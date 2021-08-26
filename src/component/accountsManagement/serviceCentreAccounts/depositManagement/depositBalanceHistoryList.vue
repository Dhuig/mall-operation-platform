<template>
	<div class="deposit-balance-history-list">
		<guideBar>
			<el-button v-permission="'deposit_balance_history_batch_export'" type="primary" @click="batchExport">
				导出EXCEL
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="DEPOSIT_BALANCE_HISTORY_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				border
				ref="multipleTable"
				:loading="loading"
				:dataSource="list"
				:columns="DEPOSIT_BALANCE_HISTORY_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="{ index: true, labelIndex: '序号' }"
				showSummary
				:summary-method="getSummaries"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			/>
		</el-card>
	</div>
</template>

<script>
import { DEPOSIT_BALANCE_HISTORY_SEARCH_CONFIG, DEPOSIT_BALANCE_HISTORY_COLUMNS_CONFIG } from './config';
import qs from 'querystring';
import { exportExcel } from 'util';
import { formatDateDefault } from 'util/formValidation';
import { getLastMonth } from '@/component/reportFormCenter/pledgeBalanceStatistical/config';
export default {
	name: 'depositBalanceHistoryList',
	data() {
		return {
			DEPOSIT_BALANCE_HISTORY_SEARCH_CONFIG,
			DEPOSIT_BALANCE_HISTORY_COLUMNS_CONFIG,
			searchConfig: {},
			loading: false,
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
			list: [],
			summaryData: {}, // 合计
		};
	},
	watch: {
		'searchConfig.storeCode'(val) {
			if (val && /\d{6,}/.test(val)) {
				this.loadCardByStoreCode();
				this.loadStoreNameByStoreCode();
			}
		},
	},
	computed: {
		loadDataPost() {
			const {
				searchConfig,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			let data = {
				...searchConfig,
				pageNum,
				pageSize,
			};
			if (data.monthrange) {
				data.startMonth = formatDateDefault(data.monthrange[0]).replace('-', '').substr(0, 6);
				data.endMonth = formatDateDefault(data.monthrange[1]).replace('-', '').substr(0, 6);
				delete data.monthrange;
			}
			return data;
		},
	},
	methods: {
		batchExport() {
			exportExcel('/mgmt/store/exportDepositMonthList', this.loadDataPost);
		},
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
			this.loadDataSum();
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
		// 合计
		getSummaries() {
			const { summaryData } = this;
			const sums = [];
			if (summaryData) {
				DEPOSIT_BALANCE_HISTORY_COLUMNS_CONFIG.forEach((column, index) => {
					if (column.summary) {
						sums[index] = column.prop in summaryData ? summaryData[column.prop] : '';
					} else {
						sums[index] = '';
					}
				});
			}
			this.$nextTick(() => {
				this.$refs['multipleTable'].$children[0].doLayout();
			});
			return [`合计:`, ...sums];
		},
		// 通过服务中心编号获取卡号
		async loadCardByStoreCode() {
			const { storeCode } = this.searchConfig;
			if (!storeCode) return this.$message.warning('请输入服务中心编号');
			const res = await this.$fetch(`/mgmt/fin/wallet/getCardNoByStoreCode?storeCode=${storeCode}`);
			if (res && res.code == 200) {
				this.searchConfig.cardNo = res.data;
			} else {
				this.$message.error('获取会员卡号失败');
			}
		},
		// 通过服务中心编号获取服务中心名称
		async loadStoreNameByStoreCode() {
			const { storeCode } = this.searchConfig;
			if (!storeCode) return this.$message.warning('请输入服务中心编号');
			const res = await this.$fetch(`/mgmt/fin/wallet/getNameByStoreCode?storeCode=${storeCode}`);
			if (res && res.code == 200) {
				this.searchConfig.storeName = res.data;
			} else {
				this.$message.error('获取服务中心名称失败');
			}
		},
		// 获取保证金月结统计
		async loadDataSum() {
			const res = await this.$fetch(`/mgmt/store/countStoreDepositMonthList?${qs.stringify(this.loadDataPost)}`);
			if (res && res.code == 200) {
				this.summaryData = res.data || {};
			} else {
				this.$message.error('获取保证金月结统计失败，请查询服务是否可用');
			}
		},
		// 获取列表数据
		async loadData() {
			const res = await this.$fetch(`/mgmt/store/getStoreDepositMonthList?${qs.stringify(this.loadDataPost)}`);
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
				if (total == 0) {
					return this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取列表数据失败，请查询服务是否可用');
			}
		},
		initLoad() {
			this.$nextTick(() => {
				const timeArr = getLastMonth();
				this.searchConfig.monthrange = [new Date(timeArr[0]).getTime(), new Date(timeArr[1]).getTime()];
				this.loadData();
				this.loadDataSum();
			});
		},
	},
	mounted() {
		this.initLoad();
	},
};
</script>

<style>
</style>