<template>
	<div class="wallet-reconciliation-form-detail">
		<guideBar>
			<!-- <el-button type="primary" v-permission="'wallet_reconciliation_form_detail_export'">导出</el-button> -->
		</guideBar>
		<el-card>
			<el-form :model="baseInfo" label-width="120px" label-suffix=":">
				<el-row>
					<el-col :span="6">
						<el-form-item label="顾客编号">{{ baseInfo.userNumber }}</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="会员卡号">{{ baseInfo.userCode }}</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="顾客姓名">{{ baseInfo.userName }}</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="钱包余额">
							￥{{ baseInfo.walletAmount && formatCurrency(baseInfo.walletAmount) }}
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<el-card>
			<searchPanel v-model="searchConfig" :config="WALLET_RECONCILIATION_DETAIL_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="list"
				:columns="WALLET_RECONCILIATION_DETAIL_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			/>
		</el-card>
	</div>
</template>

<script>
import { WALLET_RECONCILIATION_DETAIL_SEARCH_CONFIG, WALLET_RECONCILIATION_DETAIL_COLUMNS_CONFIG } from './config';
import { formatDateDefault, formatCurrency } from 'util/formValidation';
import qs from 'querystring';
export default {
	name: 'walletReconciliationFormDetail',
	data() {
		return {
			WALLET_RECONCILIATION_DETAIL_SEARCH_CONFIG,
			WALLET_RECONCILIATION_DETAIL_COLUMNS_CONFIG,
			baseInfo: {},
			searchConfig: {},
			loading: false,
			list: [],
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
		};
	},
	watch: {
		'searchConfig.monthrange': {
			handler(data) {
				if (data && typeof data[0] == 'undefined') {
					this.searchConfig.monthrange = null;
				}
			},
		},
	},
	computed: {
		loadDataParams() {
			const {
				searchConfig,
				pagination: { currentPage: pageNo, pageSize },
				baseInfo: { userId },
			} = this;
			let data = {
				userId,
				...searchConfig,
				pageNo,
				pageSize,
			};
			if (data.monthrange) {
				data.beginMonth = data.monthrange[0] ? formatDateDefault(data.monthrange[0]).substr(0, 7) : null;
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
			this.pagination.currentPage = 1;
			this.loadData();
		},
		// 翻页
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 调整单页条数
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 获取列表数据
		async loadData() {
			this.loading = true;
			const res = await this.$fetch({
				url: `/1.0/history/walletReconciliation/queryWalletTradeDetailsList?${qs.stringify(this.loadDataParams)}`,
				callback: () => {
					this.loading = false;
				},
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list || [];
				this.dataTotal = total || 0;
				if (!list || list.length == 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
	},
	mounted() {
		this.baseInfo = { ...this.$route.query };
		if (this.baseInfo.userId) {
			this.$nextTick(() => {
				let { month } = this.baseInfo;
				const time = new Date(month).getTime();
				this.searchConfig.monthrange = [time, time];
				this.loadData();
			});
		}
	},
};
</script>

<style>
</style>