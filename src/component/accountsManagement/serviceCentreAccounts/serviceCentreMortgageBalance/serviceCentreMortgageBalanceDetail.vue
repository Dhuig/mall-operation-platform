<template>
	<div class="service-centre-mortgage-balance-detail">
		<guideBar />
		<el-card class="box-card">
			<searchPanel v-model="searchConfig" :config="MORTGAGE_BALANCE_DETAIL_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card class="box-card all-info">
			<div class="card-title">综合信息</div>
			<el-form :model="baseInfo" label-suffix=":" label-width="130px">
				<el-row>
					<el-col :span="6">
						<el-form-item label="服务中心编号">{{ baseInfo.storeCode }}</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="所属分公司编号">{{ baseInfo.companyCode }}</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="服务中心名称">{{ baseInfo.storeName }}</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div class="card-title-box">
				<el-button type="primary" @click="toMortgageReport">查看历史月结报表</el-button>
			</div>
			<tableList border :dataSource="allInfo" :columns="MORTGAGE_BALANCE_DETAIL_ALLINFO_CONFIG" />
		</el-card>

		<el-card>
			<tableList
				border
				:dataSource="list"
				:columns="MORTGAGE_BALANCE_DETAIL_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="{ labelIndex: '序号', index: true }"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<el-row slot="content_context" style="margin: 16px 0">增减额度合计：{{ totalDiffMoney }}</el-row>
				<template slot-scope="scope">
					<el-button type="text" @click="detail(scope.data)" v-if="LINK_ORDER_GROUPS.includes(scope.data.recordType)">
						详情
					</el-button>
					<div v-else>--</div>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { formatDateDefault } from 'util/formValidation';
import {
	MORTGAGE_BALANCE_DETAIL_SEARCH_CONFIG,
	MORTGAGE_BALANCE_DETAIL_COLUMNS_CONFIG,
	MORTGAGE_BALANCE_COLUMNS_CONFIG,
	LINK_ORDER_GROUPS,
} from './config';
export default {
	name: 'serviceCentreMortgageBalanceDetail',
	data() {
		const MORTGAGE_BALANCE_DETAIL_ALLINFO_CONFIG = MORTGAGE_BALANCE_COLUMNS_CONFIG.slice(2, 13).map((item) => {
			return {
				...item,
				headerConfig: null,
			};
		});
		return {
			MORTGAGE_BALANCE_DETAIL_SEARCH_CONFIG,
			MORTGAGE_BALANCE_DETAIL_COLUMNS_CONFIG,
			MORTGAGE_BALANCE_DETAIL_ALLINFO_CONFIG,
			LINK_ORDER_GROUPS,
			storeCode: '',
			allInfo: [],
			searchConfig: {},
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 0,
			list: [],
			totalDiffMoney: 0, //增减额度合计
		};
	},
	watch: {
		'searchConfig.tenType'(val) {
			if (val) {
				this.searchConfig.reportType = null;
				this.searchConfig.sevenBankType = null;
			}
		},
		'searchConfig.reportType'(val) {
			if (val) {
				this.searchConfig.tenType = null;
				this.searchConfig.sevenBankType = null;
			}
		},
		'searchConfig.sevenBankType'(val) {
			if (val) {
				this.searchConfig.reportType = null;
				this.searchConfig.tenType = null;
			}
		},
	},
	computed: {
		loadDataPost() {
			const {
				allInfo: [{ storeCode }],
				searchConfig,
				pagination: { currentPage, pageSize },
			} = this;
			let data = {
				storeCode,
				...searchConfig,
				pageNum: currentPage,
				pageSize,
			};
			if (data.type) {
				data.type = [data.type];
			}
			if (data.daterange) {
				data.startMonth = formatDateDefault(data.daterange[0]).substr(0, 7);
				data.endMonth = formatDateDefault(data.daterange[1]).substr(0, 7);
				delete data.daterange;
			}
			return data;
		},
		baseInfo() {
			return this.allInfo[0] || {};
		},
	},
	methods: {
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
		},
		// 查看月结报表
		toMortgageReport() {
			this.$go('pledge_statistical_list');
		},
		//翻页
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 列表单页条数切换
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 详情
		detail(row) {
			const { recordType, businessId } = row;
			const groups = {
				14: { path: 'charging_detail', params: { title: '押货单详情', orderSn: businessId, type: 'detail' } },
				15: { path: 'return_exchange_detail', params: { title: '押货退货详情', orderSn: businessId, type: 'detail' } },
				16: { path: 'charging_detail', params: { title: '押货单详情', orderSn: businessId, type: 'detail' } },
				17: { path: 'customer_order_detail', params: { title: '顾客订单详情', orderNo: businessId } },
				18: { path: 'return_goods_details', params: { title: '顾客退货详情', returnNo: businessId } },
			};
			this.$go(groups[recordType].path, groups[recordType].params);
		},

		// 获取列表数据
		async loadData() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/inventory/mortgageAmount/mortgageAmountChangePageList',
				data: this.loadDataPost,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
				this.totalDiffMoney = list[0] ? list[0].totalDiffMoney : 0;
			} else {
				this.$message.error('获取详情列表数据失败，请查询服务是否可用');
			}
		},
		initLoad() {
			this.$nextTick(() => {
				const curTimes = new Date().getTime();
				this.searchConfig.daterange = [curTimes, curTimes];
				this.loadData();
			});
		},
	},
	mounted() {
		const { info } = this.$route.query;
		if (info) {
			this.allInfo = [JSON.parse(info)];
		}
		this.initLoad();
	},
};
</script>

<style lang="scss" scoped>
::v-deep.service-centre-mortgage-balance-detail {
	.all-info {
		.card-title-box {
			display: flex;
			justify-content: flex-end;
		}
		.card-title {
			margin-bottom: 8px;
		}
		.el-row {
			line-height: 40px;
			font-size: 12px;
		}
		.el-form-item {
			margin-bottom: 0;
		}
	}
}
</style>