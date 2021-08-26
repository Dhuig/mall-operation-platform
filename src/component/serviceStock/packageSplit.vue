<template>
	<div class="userManagement">
		<guideBar>
			<el-button v-permission="'package_Split_batch_split'" type="primary" @click="batchSplit">批量拆分</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="SERVICE_PACKAGE_SPLIT_CONFIG" @search="search" />
		</el-card>
		<el-card>
			<tableList
				:loading="tabPanes.loading"
				:dataSource="tabPanes.data"
				:columns="SERVICE_PACKAGE_SPLIT_COLUMNS"
				:pagination="tabPanes.pagination"
				:dataTotal="tabPanes.total"
				:options="options"
				slotcontent
				@loadMore="loadMore"
				@handleSelectionChange="handleSelectionChange"
			>
				<template slot-scope="row">
					<el-button
						type="text"
						v-if="row.data.splitStatus == 2"
						@click="oneResultPreview(row.data.id)"
						v-permission="'package_Split_detail'"
					>
						拆分明细
					</el-button>
					<el-button v-permission="'package_Split_split'" type="text" v-else @click="openSplit(row.data)">
						拆分
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 批量拆分 -->
		<el-dialog title="批量拆分" :visible.sync="dialogVisibleA" width="30%" v-drag>
			<span class="center">拆分后不可恢复，请仔细核对批量拆分的产品</span>
			<span slot="footer" class="dialog-footer">
				<!-- splitBatchBundle -->
				<el-button type="primary" @click="splitResultPreview">拆分结果预览</el-button>
				<el-button type="primary" @click="splitBatchBundle">确定拆分</el-button>
				<el-button @click="dialogVisibleA = false">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 原套装/拆分后 -->
		<el-dialog title="" width="60%" :lock-scroll="false" :visible.sync="dialogVisibleB" v-drag>
			<h3 class="title">原套装</h3>
			<el-table :data="splitBefore">
				<el-table-column property="serialNo" label="产品编号" width="150" />
				<el-table-column property="title" label="产品名称" width="200" />
				<el-table-column property="packing" label="规格" />
				<el-table-column property="meterUnit" label="单位" />
				<el-table-column property="boxNum" label="装箱数量" />
				<el-table-column property="retailPrice" label="单价" />
				<el-table-column property="pv" label="单品PV" />
			</el-table>
			<h3 class="title">拆分后</h3>
			<el-table :data="splitAfter" class="h50">
				<el-table-column property="serialNo" label="产品编号" width="150" />
				<el-table-column property="title" label="产品名称" width="200" />
				<el-table-column property="packing" label="规格" />
				<el-table-column property="meterUnit" label="单位" />
				<el-table-column property="boxNum" label="装箱数量" />
				<el-table-column property="retailPrice" label="单价" />
				<el-table-column property="pv" label="单品PV" />
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="splitResultPreview('once')">拆分结果预览</el-button>
				<el-button type="primary" @click="splitBundle">确定拆分</el-button>
				<el-button @click="dialogVisibleB = false">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 套装拆分调整明细 -->
		<el-dialog title="套装拆分调整明细" :lock-scroll="false" width="60%" :visible.sync="dialogVisibleC" v-drag>
			<div>
				<el-button class="fr" type="primary" @click="batchExport" v-if="isSingle">导出</el-button>
			</div>
			<pl-table
				ref="table"
				name="table"
				v-loading="splitResultLoading"
				use-virtual
				:data="splitResult"
				highlight-current-row
				height="500px"
				:row-style="{ height: '0px' }"
				:cell-style="{ padding: '0px' }"
				:row-height="55"
			>
				<pl-table-column property="companyCode" label="分公司" width="120" />
				<pl-table-column property="storeCode" label="服务中心" width="120" />
				<pl-table-column property="productCode" label="产品编号" width="120" />
				<pl-table-column property="productName" label="产品名称" width="200" />
				<pl-table-column property="boxNum" label="装箱数量" width="100" />
				<pl-table-column property="securityPrice" label="押货价" width="100" />
				<pl-table-column property="pv" label="单品PV" />
				<pl-table-column property="packing" label="规格" width="120" />
				<pl-table-column property="meterUnit" label="单位" />
				<pl-table-column property="adjustNum" label="调整数量" />
				<pl-table-column property="amount" label="金额" />
				<pl-table-column property="isAdjusted" label="是否调账">
					<template slot-scope="scope">
						<span>{{ scope.row.isAdjusted == 1 ? '是' : '否' }}</span>
					</template>
				</pl-table-column>
				<pl-table-column property="adjustTime" label="调整时间" width="160">
					<template slot-scope="scope">
						<span>{{ scope.row.adjustTime | timestampFormat }}</span>
					</template>
				</pl-table-column>
				<pl-table-column property="orderNo" label="单据号" width="180" />
				<pl-table-column property="operator" label="操作人" />
				<pl-table-column label="操作">
					<template slot-scope="scope">
						<el-button :disabled="!scope.row.orderNo" @click="handleClick(scope.row)" type="text" size="small">
							查看
						</el-button>
					</template>
				</pl-table-column>
			</pl-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisibleC = false">关闭</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { optionGenerator, exportExcel } from 'util';
import { SERVICE_PACKAGE_SPLIT_CONFIG, SERVICE_PACKAGE_SPLIT_COLUMNS } from './config.js';
import { PlTable, PlTableColumn } from 'pl-table';
import qs from 'querystring';

export default {
	name: 'packageSplit',
	components: {
		PlTable,
		PlTableColumn,
	},
	data() {
		return {
			SERVICE_PACKAGE_SPLIT_CONFIG,
			SERVICE_PACKAGE_SPLIT_COLUMNS,
			isSingle: false,
			options: {
				label: '',
				selection: true,
			},
			tabPanes: {
				loading: false,
				data: [],
				total: 0,
				pagination: {
					pageNum: 1,
					pageSize: 10,
				},
			},
			productArr: [],
			searchConfig: {
				splitStatus: '',
				serialNo: '',
				startTime: '',
				endTime: '',
				stopTime: [],
			},
			splitResult: [], // 拆分结果浏览
			splitResultLoading: true, // 拆分结果浏览loading
			dialogVisibleA: false,
			dialogVisibleB: false,
			dialogVisibleC: false,
			splitBefore: [], // 拆分前
			splitAfter: [], // 拆分后
			splitId: null, // 单条拆分id
			productIdString: null, // 导出id
		};
	},
	mounted() {
		this.getDicts();
		this.search();
	},
	computed: {
		// 搜索参数
		searchFields() {
			const {
				searchConfig,
				searchConfig: { stopTime = ['', ''] },
			} = this;
			return {
				...searchConfig,
				startTime: stopTime[0],
				endTime: stopTime[1],
			};
		},
	},
	methods: {
		// 批量导出
		batchExport() {
			let splitId = this.productIdString;
			const params = {
				splitId,
			};
			exportExcel('/mgmt/product/bundle/batchExportFile', params);
		},
		// 下拉滚动
		loadMore() {
			const { pageNum, pageSize } = this.tabPanes.pagination;
			const { total } = this.tabPanes;
			console.log(total, this.tabPanes);
			if (pageNum * pageSize >= total) {
				return this.$message.warning('没有更多数据');
			}
			this.tabPanes.pagination.pageNum++;
			this.loadData();
		},
		// 搜索
		search() {
			this.tabPanes.pagination.pageNum = 1;
			this.tabPanes.data = [];
			this.loadData();
		},
		// 多选
		handleSelectionChange(val) {
			this.productArr = val;
		},
		// 请求列表
		async loadData() {
			const { searchFields } = this;
			const params = {
				...searchFields,
				pageNum: this.tabPanes.pagination.pageNum,
				pageSize: this.tabPanes.pagination.pageSize,
			};
			this.loading = true;
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/product/bundle/getSaleOffBundleList',
				data: params,
			});
			if (res.code === 200) {
				this.tabPanes.data = this.tabPanes.data.concat(res.data.list);
				this.tabPanes.total = res.data.total;
			} else {
				this.tabPanes.data = [];
				this.tabPanes.total = 0;
			}
			this.loading = false;
		},
		// 获取字典映射
		async getDicts() {
			const res = await this.$getDict('SPLIT_STATUS');
			SERVICE_PACKAGE_SPLIT_CONFIG.form[1].options = optionGenerator(res);
		},
		// 批量拆分
		batchSplit() {
			if (this.productArr.length) {
				this.dialogVisibleA = true;
			} else {
				this.$message({
					message: '请选择要拆分的产品',
					type: 'warning',
				});
			}
		},
		// 打开拆分
		openSplit(row) {
			this.splitId = row.id;
			this.dialogVisibleB = true;
			this.productIdString = row.productId;
			this.splitBundlePreview(row.productId);
		},
		// 拆分单个套装确认页
		async splitBundlePreview(productId) {
			this.splitBefore = [];
			this.splitAfter = [];
			const params = {
				productId,
			};
			const res = await this.$fetch(`/mgmt/product/bundle/splitBundlePreview?${qs.stringify(params)}`);
			if (res.code == 200) {
				this.splitBefore.push(res.data);
				this.splitAfter = res.data.subProductList;
			} else {
				this.splitBefore = [];
				this.splitAfter = [];
			}
		},
		// 拆分单个套装
		async splitBundle() {
			const params = {
				splitId: this.splitId,
			};
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/product/bundle/splitBundle',
				params,
			});
			if (res.code === 200) {
				this.dialogVisibleB = false;
				this.search();
				this.$message({
					type: 'success',
					message: res.message,
				});
			} else {
				this.$message.error(res.message);
			}
		},
		// 单个拆分结果浏览
		oneResultPreview(splitId) {
			this.isSingle = true;
			this.productIdString = splitId;
			this.splitDetail(splitId);
			this.dialogVisibleC = true;
		},
		// 拆分明细(已拆分)
		async splitDetail(splitId) {
			let pageNum = 1;
			let pageSize = 100000;
			const params = {
				splitId,
				pageNum,
				pageSize,
			};
			this.splitResultLoading = true;
			const res = await this.$fetch(`/mgmt/product/bundle/splitDetail?${qs.stringify(params)}`);
			if (res.code == 200) {
				this.splitResult = res.data.list;
			} else {
				this.splitResult = [];
			}
			this.splitResultLoading = false;
		},
		// 拆分结果预览
		splitResultPreview(type) {
			this.isSingle = false;
			this.splitResult = [];
			this.splitPreview(type);
			this.dialogVisibleC = true;
		},
		// 拆分结果预览 查看
		handleClick(row) {
			const { type, orderNo } = row;
			this.dialogVisibleC = false;
			if (type == 1) {
				this.$go('charging_detail', { type: 'detail', title: '押货单详情', orderSn: orderNo });
			} else {
				this.$go('return_exchange_detail', { type: 'detail', title: '押货退货详情', orderSn: orderNo });
			}
		},
		// 批量/单独拆分前明细预览(未拆分)
		async splitPreview(type) {
			const params = {
				productIds: type == 'once' ? this.productIdString : this.productArr.map((x) => x.productId),
			};
			this.splitResultLoading = true;
			const res = await this.$fetch(`/mgmt/product/bundle/splitPreview?${qs.stringify(params)}`);
			if (res.code == 200) {
				this.splitResult = res.data;
			} else {
				this.splitResult = [];
			}
			this.splitResultLoading = false;
		},
		// 批量拆分套装
		async splitBatchBundle() {
			const params = {
				splitIds: this.productArr.map((x) => x.id).join(','),
			};
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/product/bundle/splitBatchBundle',
				params,
			});
			if (res.code === 200) {
				this.search();
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.title {
	border-bottom: 1px solid #e0e0ee;
	padding-bottom: 10px;
	font-size: 18px;
	margin: 10px 0;
	font-weight: bold;
}
.fr {
	float: right;
}
.h50 {
	max-height: 18vh;
	overflow-y: auto;
}
.center {
	text-align: center;
}
</style>
