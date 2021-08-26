<template>
	<div class="pledge-statistical-history-detail">
		<guideBar>
			<!-- <el-button type="primary" v-permission="'pledge_statistical_history_detail_export'">导出</el-button> -->
		</guideBar>
		<el-card>
			<el-form :model="baseInfo" label-suffix=":" label-width="130px">
				<el-row>
					<el-col :span="6">
						<el-form-item label="分公司">{{ baseInfo.companyCode }}</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="服务中心编号">{{ baseInfo.shopCode }}</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="服务中心名称">{{ baseInfo.shopName }}</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="押货额度">
							￥{{ baseInfo.maxRemittanceMortgage && formatCurrency(baseInfo.maxRemittanceMortgage) }}
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="已汇押货款">
							￥{{ baseInfo.monthRemittanceMortgage && formatCurrency(baseInfo.monthRemittanceMortgage) }}
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="押货信誉额">
							￥{{ baseInfo.monthMortgageCredit && formatCurrency(baseInfo.monthMortgageCredit) }}
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="当前可用押货余额">
							￥{{ baseInfo.monthCountMortgageBalance && formatCurrency(baseInfo.monthCountMortgageBalance) }}
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="上期可用余额">
							￥{{ baseInfo.lastMonthMortgageBalance && formatCurrency(baseInfo.lastMonthMortgageBalance) }}
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<el-card>
			<searchPanel
				v-model="searchConfig"
				:config="PLEDGE_STATISTICAL_HISTORY_DETAIL_SEARCH_CONFIG"
				@search="handleSearch"
			/>
		</el-card>
		<el-card>
			<div class="section-title">综合信息</div>
			<el-row type="flex" class="section-body">
				<div>合计：</div>
				<div>￥{{ formatCurrency(summaryData) }}</div>
			</el-row>
		</el-card>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="list"
				:columns="PLEDGE_STATISTICAL_HISTORY_DETAIL_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="{ index: true, labelIndex: '序号' }"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button
						type="text"
						v-permission="'pledge_statistical_detail_history_detail'"
						@click="toDetail(scope.data)"
					>
						查看详情
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import {
	PLEDGE_STATISTICAL_HISTORY_DETAIL_SEARCH_CONFIG,
	PLEDGE_STATISTICAL_HISTORY_DETAIL_COLUMNS_CONFIG,
} from './config';
import { formatDateDefault, formatCurrency } from 'util/formValidation';
import qs from 'querystring';
export default {
	name: 'pledgeBalanceStatisticalHistoryDetail',
	data() {
		return {
			PLEDGE_STATISTICAL_HISTORY_DETAIL_SEARCH_CONFIG,
			PLEDGE_STATISTICAL_HISTORY_DETAIL_COLUMNS_CONFIG,
			mortgageId: '', //押货额度编号
			baseInfo: {},
			searchConfig: {},
			loading: false,
			list: [],
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
			summaryData: '', // 合计
			linkKey: {
				// 拥有关联单号的数据
				YH: 'pledge',
				TH: 'pledegReturn',
				SG: 'mallOrder',
				ST: 'mallReturn',
			},
		};
	},
	computed: {
		loadDataParams({ mortgageId, searchConfig, pagination: { currentPage: pageNo, pageSize } }) {
			let data = {
				mortgageId,
				...searchConfig,
				pageNo,
				pageSize,
			};
			if (data.monthrange) {
				data.startMonth = data.monthrange[0] ? formatDateDefault(data.monthrange[0]).substr(0, 7) : null;
				data.endMonth = data.monthrange[1] ? formatDateDefault(data.monthrange[1]).substr(0, 7) : null;
				delete data.monthrange;
			}
			return data;
		},
		formatCurrency() {
			return formatCurrency;
		},
	},
	methods: {
		// 搜索
		handleSearch() {
			console.log('search');
			this.pagination.currentPage = 1;
			this.loadData();
		},
		// 翻页
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		async toDetail(row) {
			const { linkKey } = this;
			const { relationNo: businessId, detail: tenType } = row;

			const urlCol = {
				pledge: {
					url: 'charging_detail',
					params: {
						title: '押货单详情',
						orderSn: businessId,
						type: 'detail',
					},
				},
				pledegReturn: {
					url: 'return_exchange_detail',
					params: {
						title: '押货退货详情',
						orderSn: businessId,
						type: 'detail',
					},
				},
				mallOrder: {
					url: 'customer_order_detail',
					params: {
						title: '顾客订单详情',
						orderNo: businessId,
					},
				},
				mallReturn: {
					url: 'return_goods_details',
					params: {
						title: '顾客退货详情',
						returnNo: businessId,
					},
				},
			};
			if (tenType && tenType in linkKey) {
				this.$go(urlCol[linkKey[tenType]].url, urlCol[linkKey[tenType]].params);
			}
		},
		// 获取默认列表数据/options数据
		async loadDefaultData(id) {
			if (!id) return;
			const res = await this.$fetch(`/1.0/history/inmortgageReportNew/detail?id=${id}`);
			if (res && res.data) {
				this.mortgageId = res.data.mortgageId;
				this.searchConfig.monthrange = [new Date(res.data.startMonth).getTime(), new Date(res.data.endMonth).getTime()];
				this.PLEDGE_STATISTICAL_HISTORY_DETAIL_SEARCH_CONFIG.form[1].options =
					res.data.adjustReason.map(({ name: label, value }) => ({ label, value })) || [];
				this.PLEDGE_STATISTICAL_HISTORY_DETAIL_SEARCH_CONFIG.form[2].options =
					res.data.moneyType.map(({ name: label, value }) => ({ label, value })) || [];
				this.loadData();
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
		// 获取列表数据
		async loadData() {
			const res = await this.$fetch(`/1.0/history/inmortgageDetail/list?${qs.stringify(this.loadDataParams)}`);
			if (res && res.data) {
				const {
					commonPageVO: { list, total },
					totalAmount,
				} = res.data;
				this.list = list;
				this.dataTotal = total;
				this.summaryData = totalAmount;
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
	},
	mounted() {
		const baseInfo = this.$route.query;
		if (baseInfo) {
			this.baseInfo = baseInfo || null;
			this.loadDefaultData(baseInfo.id);
		}
	},
};
</script>

<style lang="scss" scoped>
.section-title {
	line-height: 16px;
	margin-bottom: 16px;
	font-weight: bold;
}
.section-body {
	font-size: 13px;
}
</style>