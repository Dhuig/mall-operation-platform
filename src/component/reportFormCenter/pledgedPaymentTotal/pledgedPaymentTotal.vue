<template>
	<div class="pledged-payment-total">
		<guideBar>
			<el-button type="primary" @click="batchExport">导出EXCEL</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="PLEDGED_PAYMENT_TOTAL_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				border
				ref="multipleTable"
				:loading="loading"
				:dataSource="list"
				:columns="PLEDGED_PAYMENT_TOTAL_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="{ index: true, labelIndex: '序号' }"
				showSummary
				:summary-method="getSummaries"
				:height="600"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="row">
					<el-button type="text" @click="detail(row.data)">详情</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { formatDateDefault } from 'util/formValidation';
import { PLEDGED_PAYMENT_TOTAL_SEARCH_CONFIG, PLEDGED_PAYMENT_TOTAL_COLUMNS_CONFIG } from './config';
import { getLastMonth } from '../pledgeBalanceStatistical/config';
import { exportExcel } from 'util';
export default {
	name: 'pledgedPaymentTotal',
	data() {
		return {
			PLEDGED_PAYMENT_TOTAL_SEARCH_CONFIG,
			PLEDGED_PAYMENT_TOTAL_COLUMNS_CONFIG,
			searchConfig: {},
			loading: false,
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
			list: [],
			summaryData: null,
		};
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
				data.beginMonth = formatDateDefault(data.monthrange[0]).replace('-', '').substr(0, 6);
				data.endMonth = formatDateDefault(data.monthrange[1]).replace('-', '').substr(0, 6);
				delete data.monthrange;
			}
			return data;
		},
	},
	methods: {
		// 导出EXCEL
		batchExport() {
			exportExcel('/months/mortgage/exportBillRemitReportList', this.loadDataPost);
		},
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
			this.loadDataSum();
		},
		// 翻页操作
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 切换单页条数
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 详情
		detail(row) {
			this.$go('pledged_refund_payment_detail', { info: JSON.stringify(row) });
		},
		// 合计
		getSummaries() {
			const { summaryData } = this;
			const sums = [];
			if (summaryData) {
				PLEDGED_PAYMENT_TOTAL_COLUMNS_CONFIG.forEach((column, index) => {
					if (column.summary) {
						const prop = `sum${column.prop.charAt(0).toUpperCase() + column.prop.slice(1)}`;
						sums[index] = prop in summaryData ? summaryData[prop] : '';
						sums[index] = typeof sums[index] == 'number' ? '￥' + sums[index] : '';
					} else {
						sums[index] = '';
					}
				});
			}
			sums.splice(0, 1);
			this.$nextTick(() => {
				this.$refs['multipleTable'].$children[0].doLayout();
			});
			return ['', `合计:`, ...sums];
		},
		// 获取列表合计数据
		async loadDataSum() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/months/mortgage/billRemitReportListSumMsg',
				data: this.loadDataPost,
				timeout: 3 * 60000,
			});
			if (res && res.data) {
				this.summaryData = { ...res.data };
			} else {
				this.$message.error('获取列表合计数据失败，请查询服务是否可用');
			}
		},
		// 获取列表数据
		async loadData() {
			this.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/months/mortgage/billRemitReportList',
				data: this.loadDataPost,
				timeout: 3 * 60000,
				callback: () => {
					this.loading = false;
				},
			});
			this.loading = false;
			if (res && res.code === 200 && res.data) {
				let { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
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