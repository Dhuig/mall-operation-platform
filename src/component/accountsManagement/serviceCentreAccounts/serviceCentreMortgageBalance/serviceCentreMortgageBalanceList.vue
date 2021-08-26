<template>
	<div class="service-centre-mortgage-balance-list">
		<guideBar>
			<el-button
				v-permission="'service_centre_mortgage_balance_list_export'"
				type="primary"
				v-bind:loading="exportLoading"
				@click="batchExport"
			>
				导出EXCEL
			</el-button>
		</guideBar>
		<el-card class="box-card">
			<searchPanel v-model="searchConfig" :config="MORTGAGE_BALANCE_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				ref="multipleTable"
				border
				:dataSource="list"
				:columns="MORTGAGE_BALANCE_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="options"
				showSummary
				:summary-method="getSummaries"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button
						v-permission="'service_centre_mortgage_balance_list_detail'"
						type="text"
						@click="detail(scope.data)"
					>
						详情
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { MORTGAGE_BALANCE_SEARCH_CONFIG, MORTGAGE_BALANCE_COLUMNS_CONFIG } from './config';
import axios from 'axios';
export default {
	name: 'serviceCentreMortgageBalanceList',
	data() {
		return {
			MORTGAGE_BALANCE_SEARCH_CONFIG,
			MORTGAGE_BALANCE_COLUMNS_CONFIG,
			exportLoading: false, // 导出loading
			searchConfig: {
				storeCode: '',
				storeName: '',
				startAmount: '',
				endAmount: '',
				companyCode: '',
				availableStartAmount: '',
				availableEndAmount: '',
			},
			allInfo: {},
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 0,
			options: {
				labelIndex: '序号',
				index: true,
			},
			list: [],
			summaryData: null,
			cancel: null, // axios取消方法
		};
	},
	methods: {
		// 导出
		async batchExport() {
			this.exportLoading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/inventory/mortgageAmount/exportSearchMortgageAmountList',
				data: this.loadDataPost,
				callback: () => {
					this.exportLoading = false;
				},
			});
			if (res && res.code == 200) {
				this.$message.success('excel表格正在生成中，请在下载管理查看');
			} else {
				this.$message.error('操作失败');
			}
		},
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
			this.loadSummaryData();
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
			// console.log(row);
			this.$go('service_centre_mortgage_balance_detail', { info: JSON.stringify(row) });
		},
		// 获取分公司信息
		async loadCompanyList() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			this.MORTGAGE_BALANCE_SEARCH_CONFIG.form[1].options = serviceCompanyOptions.map(({ label, value }) => ({
				label: `${value} ${label}`,
				value,
			}));
		},
		// 合并列
		arraySpanMethod({ rowIndex, columnIndex }) {
			if (rowIndex % 2 === 0) {
				if (columnIndex === 0) {
					return [1, 2];
				} else if (columnIndex === 1) {
					return [0, 0];
				}
			}
		},
		// 合计
		getSummaries() {
			const { summaryData } = this;
			const sums = [];
			if (summaryData) {
				MORTGAGE_BALANCE_COLUMNS_CONFIG.forEach((column, index) => {
					if (column.summary) {
						const prop = 'total' + (column.prop.charAt(0).toUpperCase() + column.prop.slice(1));
						sums[index] = prop in summaryData ? summaryData[prop] : '';
					} else {
						sums[index] = '';
					}
				});
			} else {
				MORTGAGE_BALANCE_COLUMNS_CONFIG.forEach((column, index) => {
					if (column.summary) {
						sums[index] = '加载中...';
					} else {
						sums[index] = '';
					}
				});
			}
			sums.shift();
			this.$nextTick(() => {
				this.$refs['multipleTable'].$children[0].doLayout();
			});
			return [`合计：`, `${this.dataTotal}条`, ...sums];
		},
		// 获取统计合计信息
		async loadSummaryData() {
			if (this.cancel) {
				this.cancel();
			}
			let CancelToken = axios.CancelToken;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/inventory/mortgageAmount/totalMortgageAmountMsg',
				data: this.loadDataPost,
				timeout: 60000 * 5,
				cancelToken: new CancelToken(c => {
					// 重复请求时，主动取消之前的请求
					this.cancel = c;
				}),
			});
			if (res) {
				if (res.data) {
					this.summaryData = res.data;
				} else {
					this.$message.error('获取统计合计信息失败');
				}
			}
		},
		// 获取列表数据
		async loadData() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/inventory/mortgageAmount/listMortgageAmount',
				data: this.loadDataPost,
				timeout: 20000,
			});
			if (res && res.code === 200) {
				if (res.data.mortgageAmountSearch) {
					const { list, total } = res.data.mortgageAmountSearch;
					this.list = list;
					this.dataTotal = total;
				} else {
					this.list = [];
					this.dataTotal = 0;
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取数据失败，请查询服务是否可用');
			}
		},
	},
	computed: {
		loadDataPost() {
			const { searchConfig } = this;
			const { currentPage, pageSize } = this.pagination;
			let data = {
				...searchConfig,
				pageNum: currentPage,
				pageSize,
			};
			if (data.amount) {
				data.startAmount = data.amount[0];
				data.endAmount = data.amount[1];
				delete data.amount;
			}
			if (data.availableAmount) {
				data.availableStartAmount = data.availableAmount[0];
				data.availableEndAmount = data.availableAmount[1];
				delete data.availableAmount;
			}
			return data;
		},
	},
	mounted() {
		this.loadCompanyList();
		this.loadData();
		this.loadSummaryData();
	},
};
</script>

<style lang="scss" scoped>
::v-deep.service-centre-mortgage-balance-list {
	.el-form-item__label {
		width: 200px !important;
	}
	.all-info {
		.card-title {
			margin-bottom: 8px;
		}
		.el-row {
			line-height: 40px;
			font-size: 12px;
		}
	}
}
</style>
