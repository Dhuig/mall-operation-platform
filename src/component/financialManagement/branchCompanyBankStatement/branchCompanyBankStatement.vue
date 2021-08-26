<template>
	<div class="branch_company_bank_statement">
		<guideBar>
			<el-button v-permission="'branch_company_bank_statement_export_eas'" type="primary" @click="exportEAS">
				导出EAS凭证
			</el-button>
			<el-button
				v-permission="'branch_company_bank_statement_batch_export'"
				type="primary"
				v-bind:loading="exportLoading"
				@click="batchExport"
			>
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="BRANCH_COMPANY_BANK_LIST_SEARCH" @search="handleSearch" />
		</el-card>
		<!-- 表格 -->
		<el-card>
			<tableList
				ref="multipleTable"
				:loading="loading"
				:dataSource="list"
				:columns="LIST_COLUMNS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				showSummary
				:summary-method="getSummaries"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			/>
		</el-card>
	</div>
</template>

<script>
import { formatDate } from 'util/formValidation.js';
import { exportExcelPost } from 'util';
import { BRANCH_COMPANY_BANK_LIST_SEARCH, LIST_COLUMNS } from './config.js';
export default {
	name: 'branchCompanyBankStatement',
	data() {
		return {
			BRANCH_COMPANY_BANK_LIST_SEARCH,
			LIST_COLUMNS,
			exportLoading: false, // 导出loading
			searchConfig: {
				transTime: '',
				companyCode: '001006',
			},
			summaryData: {}, // 合计
			loading: false,
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 0,
			list: [],
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
			if (data.timerange) {
				data.startTime = data.timerange[0] ? data.timerange[0] : null;
				data.endTime = data.timerange[1] ? data.timerange[1].substr(0, 11) + '23:59:59' : null;
			}
			return data;
		},
	},
	methods: {
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
		},
		// 导出EAS
		exportEAS() {
			const setTime = { timeout: 30000 };
			exportExcelPost('/mgmt/fin/wallet/bill/exportEASCollectionOfPayments', this.loadDataPost, 'EAS凭证', setTime);
		},
		// 批量导出
		async batchExport() {
			this.exportLoading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/bill/exportFinWalletCompanyAccountTrans',
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
		// 翻页
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 切换单页数据条数
		handleSizeChange(pageSize) {
			this.pagination = {
				currentPage: 1,
				pageSize,
			};
			this.loadData();
		},
		// 获取分公司编号
		async loadCompanyList() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			if (!serviceCompanyOptions) return this.$message.warning('未获取到分公司编号，或影响获取列表数据');
			this.BRANCH_COMPANY_BANK_LIST_SEARCH.form[1].options = serviceCompanyOptions.map(({ value }) => ({
				label: value,
				value,
			}));
			this.searchConfig.companyCode = serviceCompanyOptions[0].value;
			this.loadData();
		},
		// 合计
		getSummaries() {
			const { summaryData, LIST_COLUMNS } = this;
			let sums = [];
			if (summaryData) {
				LIST_COLUMNS.forEach((column, index) => {
					if (index == 0) {
						sums[index] = `合计：`;
						return;
					}
					if (column.summary) {
						const prop = `sum${column.prop.charAt(0).toUpperCase() + column.prop.slice(1)}`;
						sums[index] = prop in summaryData ? '￥' + summaryData[prop] : '';
					} else {
						sums[index] = '';
					}
				});
			}
			this.$nextTick(() => {
				this.$refs['multipleTable'].$children[0].doLayout();
			});
			return sums;
		},
		// 获取列表数据
		async loadData() {
			this.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/bill/queryFinWalletCompanyAccountTrans',
				data: this.loadDataPost,
				timeout: 20000,
				callback: () => {
					this.loading = false;
				},
			});
			if (res && res.data) {
				const { list, total } = res.data.billTransDtlPage;
				this.list = list;
				this.dataTotal = total;
				this.summaryData = { ...res.data };
				if (list.length == 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取数据失败');
			}
		},
	},
	mounted() {
		this.$nextTick(() => {
			// 默认
			this.searchConfig.transTime = formatDate(new Date(), 'month');
			this.loadCompanyList();
		});
	},
};
</script>

<style lang="scss" scoped>
::v-deep.branch_company_bank_statement {
	.title {
		margin-bottom: 30px;
		font-weight: 500;
		color: rgba(48, 51, 54, 1);
	}
	.infor {
		width: 100%;
		padding: 16px;
		box-sizing: border-box;
		overflow: hidden;
		font-size: 13px;
		text-align: center;
		.el-row {
			border: 1px #eff0f2 solid;
		}
	}
	.infor-item-left {
		padding: 15px 8px;
		color: #666;
		background: #f5f5f5;
	}
	.infor-item-right {
		padding: 15px 8px;
		text-align: center;
	}
}
</style>
