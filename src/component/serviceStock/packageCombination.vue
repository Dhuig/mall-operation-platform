<template>
	<div class="userManagement">
		<guideBar>
			<el-button
				:loading="exportLoading"
				v-permission="'package_Combination_batch_export'"
				type="primary"
				@click="batchExport"
			>
				批量导出
			</el-button>
			<el-button
				:loading="exportLoading"
				v-permission="'package_Combination_batch_composite'"
				type="primary"
				@click="combinationBtn(true)"
			>
				批量组合
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="SERVICE_PACKAGE_COMBINATION_CONFIG" @search="search" />
		</el-card>
		<el-card>
			<tableList
				:loading="tabItem.loading"
				:dataSource="tabItem.data"
				:columns="SERVICE_PACKAGE_COMBINATION_COLUMNS"
				:pagination="tabItem.pagination"
				:dataTotal="tabItem.total"
				:options="{ selection: true }"
				@loadMore="loadMore"
				slotcontent
				@handleSelectionChange="handleSelectionChange"
			>
				<template slot-scope="row">
					<el-button
						type="text"
						v-permission="'package_Combination_detail'"
						v-if="row.data.state == 2"
						@click="detail(row.data.id)"
					>
						组合明细
					</el-button>
					<el-button
						v-else
						type="text"
						v-permission="'package_Combination_composite'"
						@click="combinationBtn(null, row.data.id)"
					>
						组合
					</el-button>
				</template>
			</tableList>
		</el-card>

		<el-dialog title="批量组合" :visible.sync="batchCombination.show" width="30%" center v-drag>
			<span>组合后不可恢复，请仔细核对批量组合的产品</span>
			<div slot="footer" class="dialog-footer">
				<!-- batch -->
				<el-button type="primary" @click="openResultPreview('batch')">组合结果预览</el-button>
				<el-button type="primary" @click="enterCombination('batch')">确定组合</el-button>
				<el-button @click="batchCombination.show = false">取 消</el-button>
			</div>
		</el-dialog>

		<!-- 组合前/套装 -->
		<el-dialog title="" width="60%" :visible.sync="combination.show" v-drag>
			<div class="scrollY">
				<h3 class="title">组合前</h3>
				<el-table :data="combination.beforeList">
					<el-table-column property="companyCode" label="分公司编号" width="110"></el-table-column>
					<el-table-column property="storeCode" label="服务中心编码" width="110"></el-table-column>
					<el-table-column property="productCode" label="产品编码" width="110"></el-table-column>
					<el-table-column property="productName" label="产品名称" width="180"></el-table-column>
					<el-table-column property="productNum" label="当前库存"></el-table-column>
					<el-table-column property="packing" label="规格"></el-table-column>
					<el-table-column property="meterUnit" label="单位"></el-table-column>
					<el-table-column property="boxNum" label="装箱数量"></el-table-column>
					<el-table-column property="securityPrice" label="单价"></el-table-column>
					<el-table-column property="pv" label="单品PV"></el-table-column>
				</el-table>
				<h3 class="title">套装</h3>
				<el-table :data="combination.afterList">
					<el-table-column property="companyCode" label="分公司编号" width="110"></el-table-column>
					<el-table-column property="storeCode" label="服务中心编码" width="110"></el-table-column>
					<el-table-column property="productCode" label="产品编码" width="110"></el-table-column>
					<el-table-column property="productName" label="产品名称" width="180"></el-table-column>
					<el-table-column property="combineNum" width="150px" label="组合数量">
						<template slot-scope="scoped">
							<el-input-number
								size="mini"
								:min="1"
								:max="max(scoped.row.productNum)"
								v-model="scoped.row.combineNum"
							></el-input-number>
						</template>
					</el-table-column>
					<el-table-column property="productNum" label="当前库存"></el-table-column>
					<el-table-column property="packing" label="规格" width="320"></el-table-column>
					<el-table-column property="meterUnit" label="单位"></el-table-column>
					<el-table-column property="boxNum" label="装箱数量"></el-table-column>
					<el-table-column property="securityPrice" label="单价"></el-table-column>
					<el-table-column property="pv" label="单品PV"></el-table-column>
				</el-table>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="openResultPreview">组合结果预览</el-button>
					<el-button type="primary" @click="enterCombination">确定组合</el-button>
					<el-button @click="combination.show = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>

		<!-- 套装组合调整明细 -->
		<el-dialog title="套装组合调整明细" width="60%" :visible.sync="groupAdjustDetail.show" v-drag>
			<div>
				<el-button class="fr" type="primary" @click="adjustDetailExport" v-if="groupAdjustDetail.isExport">
					导出
				</el-button>
			</div>
			<pl-table
				ref="table"
				name="table"
				v-loading="groupAdjustDetail.loading"
				use-virtual
				:data="groupAdjustDetail.list"
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
				<pl-table-column property="operator" label="操作人" width="100" />
			</pl-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="groupAdjustDetail.show = false">关闭</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { exportExcel } from 'util';
import { SERVICE_PACKAGE_COMBINATION_CONFIG, SERVICE_PACKAGE_COMBINATION_COLUMNS } from './config.js';
import { PlTable, PlTableColumn } from 'pl-table';
import qs from 'querystring';

export default {
	name: 'packageCombination',
	components: {
		PlTable,
		PlTableColumn,
	},
	data() {
		return {
			SERVICE_PACKAGE_COMBINATION_CONFIG,
			SERVICE_PACKAGE_COMBINATION_COLUMNS,
			exportLoading: false,
			searchConfig: {
				combineBegin: '',
				combineEnd: '',
				combineState: '',
				companyCode: '',
				productCode: '',
				storeCode: '',
			},
			tabItem: {
				data: [],
				total: 0,
				selectId: [],
				pagination: {
					pageNum: 1,
					pageSize: 10,
				},
				loading: false,
			},
			// 组合
			combination: {
				show: false,
				disabled: true,
				afterList: [],
				beforeList: [],
				id: null,
			},
			// 批量组合
			batchCombination: {
				show: false,
			},
			// 套装组合调整明细
			groupAdjustDetail: {
				isExport: false,
				show: false,
				list: [],
				loading: false,
			},
		};
	},
	mounted() {
		this.search();
		this.getCompanyCode();
	},
	computed: {
		// 搜索参数
		searchFields() {
			const { combineTime = ['', ''] } = this.searchConfig;
			let { combineState, companyCode, productCode, storeCode } = this.searchConfig;
			return {
				combineState,
				companyCode,
				productCode,
				storeCode,
				combineBegin: combineTime[0],
				combineEnd: combineTime[1],
			};
		},
	},
	methods: {
		// 控制组合数量最大值
		max(val) {
			return Math.abs(val || 1);
		},
		// 查看组合明细
		detail(id) {
			this.groupAdjustDetail.isExport = true;
			this.groupAdjustDetail.id = id;
			this.GroupAdjustDetail(id);
		},
		// 组合明细的导出
		adjustDetailExport() {
			const { id } = this.groupAdjustDetail;
			exportExcel('/mgmt/inventory/combine/detail/export', { id });
		},
		// 获取组合明细 (单条)
		async GroupAdjustDetail(id) {
			const params = { id };
			const res = await this.$fetch(`/mgmt/inventory/combine/detail?${qs.stringify(params)}`);
			this.groupAdjustDetail.show = true;
			this.groupAdjustDetail.loading = true;
			if (res.code == 200) {
				this.groupAdjustDetail.list = res.data;
			} else {
				this.groupAdjustDetail.list = [];
			}
			this.groupAdjustDetail.loading = false;
		},
		// 打开组合明细预览
		openResultPreview(type) {
			let combineIds = null;
			if (type == 'batch') {
				combineIds = this.tabItem.selectId.map(x => x.id);
			} else {
				combineIds = [this.combination.id];
			}
			this.GroupAdjustPreview(combineIds);
		},
		// 组合明细(组合里面的)
		async GroupAdjustPreview(combineIds) {
			const params = {
				combineIds,
			};
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/inventory/combine/preview',
				data: params,
			});
			let list = [];
			if (res.code == 200 && res.data) {
				list = res.data;
			} else {
				list = [];
			}
			this.groupAdjustDetail = {
				list,
				show: true,
				isExport: false,
			};
		},
		// 组合
		combinationBtn(type, id) {
			// 批量
			if (type) {
				if (!this.tabItem.selectId.length) {
					return this.$message.warning('请选择要组合的产品');
				}
				this.batchCombination.show = true;
			} else {
				// 单条
				this.combinationPreview(id);
				this.combination.show = true;
				this.combination.id = id;
			}
		},
		// 确定组合
		enterCombination(type) {
			if (type == 'batch') {
				this.batch();
			} else {
				this.suitCombine();
			}
		},
		// 单个组合
		async suitCombine() {
			const [{ combineNum }] = this.combination.afterList;
			const params = {
				combineId: this.combination.id,
				combineNum,
			};
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/inventory/combine',
				data: params,
			});
			if (res.code === 200) {
				this.$message.success(res.message);
				this.groupAdjustDetail.show = false;
				this.loadData();
			} else {
				if (this.$store.getters['system/getError']) {
					// * 错误提示
					this.$message.error(res.message);
				}
			}
		},
		// 多个组合
		async batch() {
			const params = {
				combineIds: this.tabItem.selectId.map(x => x.id),
			};
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/inventory/combine/batch',
				data: params,
			});
			if (res.code === 200) {
				this.$message.success(res.message);
				this.loadData();
			} else {
				this.$message.error(res.message);
			}
			this.batchCombination.show = false;
		},
		// 套装组合预览
		async combinationPreview(id) {
			const params = { id };
			const res = await this.$fetch(`/mgmt/inventory/combine/show?${qs.stringify(params)}`);
			if (res.code == 200) {
				const { before, after } = res.data;
				this.combination.beforeList = before;
				res.data.after.combineNum = Math.abs(after.productNum || 1);
				this.combination.afterList = [{ ...after }];
			} else {
				this.combination.afterList = [];
				this.combination.beforeList = [];
			}
		},
		// 批量导出
		async batchExport() {
			const { searchFields } = this;
			const { pageNum, pageSize } = this.tabItem.pagination;
			const data = {
				...searchFields,
				pageNum,
				pageSize,
			};
			this.exportLoading = true;
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/inventory/combine/export',
				params: data,
				callback: () => {
					this.exportLoading = false;
				},
			});
			if (res?.code == 200) {
				this.$message.success('excel表格正在生成中，请在下载管理查看');
			} else {
				this.$message.error('操作失败');
			}
		},
		// 列表选择框
		handleSelectionChange(val) {
			this.tabItem.selectId = val;
		},
		// 下拉滚动
		loadMore() {
			const { pageNum, pageSize } = this.tabItem.pagination;
			const { total } = this.tabItem;
			if (pageNum * pageSize >= total) {
				return this.$message.warning('没有更多数据');
			}
			this.tabItem.pagination.pageNum++;
			this.loadData();
		},
		// 搜索
		search() {
			this.tabItem.pagination.pageNum = 1;
			this.tabItem.data = [];
			this.loadData();
		},
		// 请求列表
		async loadData() {
			const { searchFields, tabItem } = this;
			const params = {
				...searchFields,
				pageNum: tabItem.pagination.pageNum,
				pageSize: tabItem.pagination.pageSize,
			};
			this.tabItem.loading = true;
			const res = await this.$fetch(`/mgmt/inventory/combine/page?${qs.stringify(params)}`);
			if (res?.code === 200) {
				const { list, total } = res.data;
				this.tabItem.data = this.tabItem.data.concat(list);
				this.tabItem.total = total;
			} else {
				this.tabItem.data = [];
				this.tabItem.total = 0;
			}
			this.tabItem.loading = false;
		},
		// 获取分公司编号
		async getCompanyCode() {
			const res = await this.$fetch(`/mgmt/sys/listCompanyByCode?companyCode`);
			if (res && res.code === 200) {
				this.SERVICE_PACKAGE_COMBINATION_CONFIG.form[0].options = res.data.map(item => ({
					label: item.code + '-' + item.name,
					value: item.code,
				}));
			} else {
				this.$message.warning('获取分公司编号数据失败');
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
}
::v-deep .el-dialog__body {
	overflow-y: auto;
	max-height: 520px;
}
.dialog-footer {
	margin-top: 20px;
}
</style>