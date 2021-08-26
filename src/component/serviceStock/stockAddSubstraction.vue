<template>
	<div>
		<guideBar />
		<!-- 基础信息 -->
		<el-card>
			<h3 slot="header">基础信息</h3>
			<el-form
				inline
				size="small"
				:model="detailData"
				label-width="120px"
				label-suffix=":"
				label-position="left"
				class="business-form"
			>
				<el-row>
					<el-col :span="8">
						<el-form-item label="服务中心编号">
							{{ detailData.storeCode }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="服务中心名称">
							{{ detailData.storeName }}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="产品编号">
							{{ detailData.productCode }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="产品名称">
							{{ detailData.productName }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="单位">
							{{ detailData.meterUnit }}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="当前库存">
							{{ detailData.productNum }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="押货价合计">
							{{ detailData.securityPrice }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="零售价合计">
							{{ detailData.retailPrice }}
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<!-- 搜索栏 -->
		<el-card>
			<searchPanel v-model="searchConfig" :config="SERVICE_ADD_SEARCH" @search="search" />
		</el-card>
		<!-- 表格信息 -->
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="dataSource"
				:columns="SERVICE_ADD_COLUMNS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="options"
				@handleSizeChange="handleSizeChange"
				@handleChangePage="handleChangePage"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="gotoDetail(scope.data)">详情</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { SERVICE_ADD_COLUMNS, SERVICE_ADD_SEARCH } from './config';
import qs from 'querystring';
export default {
	name: 'stockAddSubstraction',
	data() {
		return {
			SERVICE_ADD_COLUMNS,
			SERVICE_ADD_SEARCH,
			dataTotal: 0,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			dataSource: [],
			pagination: {
				pageNum: 1,
				pageSize: 10,
			},
			loading: false,
			searchConfig: {
				outIn: null,
				source: null,
				monthTime: '',
			},
			detailData: {},
		};
	},
	mounted() {
		this.loadData();
	},
	computed: {
		// 搜索参数
		searchFields() {
			const { searchConfig } = this;
			return {
				...searchConfig,
				storeCode: this.$route.query.storeCode ? this.$route.query.storeCode : '',
				productCode: this.$route.query.productCode ? this.$route.query.productCode : '',
			};
		},
	},
	methods: {
		// 分页触发事件
		handleChangePage(pageNum) {
			this.pagination.pageNum = pageNum;
			this.loadData();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.pagination.pageNum = 1;
			this.loadData();
		},
		// 详情
		gotoDetail(row) {
			const { businessId } = row;
			let type = null;
			let isRegExp = row.businessId.indexOf('YTH');
			// 订单存在YTH赋值0，否则-1
			if (row.source == 1 || (row.source == 5 && row.outIn == 1) || (row.source == 12 && isRegExp == -1)) {
				type = 1;
			} else if (row.source == 2 || (row.source == 5 && row.outIn == 2) || (row.source == 12 && isRegExp == 0)) {
				type = 2;
			} else if (row.source == 4) {
				type = 3;
			} else if (row.source == 3 || row.source == 6) {
				type = 4;
			} else {
				type = 1;
			}
			const groups = {
				1: { path: 'charging_detail', params: { type: 'detail', title: '押货单详情', orderSn: businessId } },
				2: { path: 'return_exchange_detail', params: { type: 'detail', title: '押货退货详情', orderSn: businessId } },
				3: { path: 'return_goods_details', params: { title: '顾客退货详情', returnNo: businessId } },
				4: { path: 'customer_order_detail', params: { title: '顾客订单详情', orderNo: businessId } },
			};
			this.$go(groups[type].path, groups[type].params);
		},
		// 请求用户列表
		async loadData() {
			const { searchFields } = this;
			console.log(searchFields);
			this.loading = true;
			const params = {
				...searchFields,
				pageNum: this.pagination.pageNum,
				pageSize: this.pagination.pageSize,
			};
			const res = await this.$fetch(`/mgmt/inventory/detail?${qs.stringify(params)}`);
			if (res.code == 200) {
				const { list, total } = res.data.page;
				this.detailData = res.data;
				this.dataSource = list;
				this.dataTotal = total;
			} else {
				this.dataSource = [];
				this.pagination.total = 0;
			}
			this.loading = false;
		},
		search() {
			this.pagination.pageNum = 1;
			this.dataSource = [];
			this.loadData();
		},
	},
};
</script>

