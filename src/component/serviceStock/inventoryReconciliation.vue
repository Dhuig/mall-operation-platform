<template>
	<div class="inventoryReconciliationPage">
		<guideBar>
			<el-button
				:loading="exportLoading"
				v-permission="'inventory_Reconciliation_batch_export_Excel'"
				type="primary"
				@click="batchExport"
			>
				导出Excel
			</el-button>
			<el-button v-permission="'inventory_Reconciliation_batch_export_PDF'" type="primary" @click="batchExportPDF">
				导出PDF
			</el-button>
			<el-button
				v-permission="'inventory_Reconciliation_print'"
				type="primary"
				@click="printShipment"
				:disabled="printLoading"
				v-loading="printLoading"
				element-loading-spinner="el-icon-loading"
				icon="el-icon-printer"
			>
				打印
			</el-button>
		</guideBar>
		<!-- 基础信息 -->
		<el-card>
			<searchPanel v-model="searchConfig" :config="SERVICE_RECONCILIATION_SEARCH" @search="search">
				<template slot="month">
					<el-date-picker
						v-model="searchConfig.month"
						type="monthrange"
						start-placeholder="开始日期"
						range-separator="~"
						end-placeholder="结束日期"
						:picker-options="pickerOptions"
					></el-date-picker>
				</template>
			</searchPanel>
		</el-card>
		<!-- 表格 -->
		<el-card>
			<tableList
				show-summary
				:summary-method="Summary"
				:ref="`table`"
				:columns="SERVICE_RECONCILIATION_COLUMNS"
				:pagination="tabPanes.pagination"
				:dataTotal="tabPanes.total"
				:options="options"
				:loading="tabPanes.loading"
				:dataSource="tabPanes.data"
				@loadMore="loadMore"
			/>
		</el-card>
		<!-- 打印表格 -->
		<div style="display: none">
			<printTA4
				v-if="printDialog"
				:title="'库存对账单'"
				:tableData="printDate"
				:userMessage="printHeader"
				:id="`printDialog-${nowTime}-1`"
			></printTA4>
		</div>
	</div>
</template>

<script>
import { exportExcel } from 'util';
import { formatDate } from 'util/formValidation.js';
import printTA4 from './components/printTA4';
import { SERVICE_RECONCILIATION_COLUMNS, SERVICE_RECONCILIATION_SEARCH } from './config.js';
import qs from 'querystring';

export default {
	name: 'inventoryReconciliation',
	components: {
		printTA4,
	},
	data() {
		return {
			exportLoading: false,
			show3: true,
			SERVICE_RECONCILIATION_COLUMNS,
			SERVICE_RECONCILIATION_SEARCH,
			pickerOptions: {},
			searchConfig: {
				month: [],
				companyCode: '',
				storeCode: '',
			},
			options: {
				index: true,
				labelIndex: '序号',
			},
			tabPanes: {
				data: [],
				total: 0,
				loading: false,
				pagination: {
					pageNum: 1,
					pageSize: 15,
				},
			},
			// 打印
			printLoading: false,
			printDialog: false,
			printHeader: {},
			printDate: {},
			nowTime: formatDate(new Date()),
		};
	},
	async created() {
		await this.getMonthTime();
	},
	mounted() {
		this.search();
	},
	computed: {
		// 搜索参数
		searchFields() {
			const { searchConfig } = this;
			let params = {
				...searchConfig,
				minMonth: searchConfig.month ? formatDate(searchConfig.month[0], 'month').replace('-', '') : null,
				maxMonth: searchConfig.month ? formatDate(searchConfig.month[1], 'month').replace('-', '') : null,
				pageNum: this.tabPanes.pagination.pageNum,
				pageSize: this.tabPanes.pagination.pageSize,
			};
			delete params.month;
			return params;
		},
	},
	methods: {
		// 解决 disabledDate 卡顿
		isEarlyThan(dateA, dateB) {
			// dateA 比 dateB 早则为 true(严格小于)
			const yearA = dateA.getFullYear();
			const yearB = dateB.getFullYear();
			if (yearA < yearB) {
				return true;
			}
			if (yearA === yearB) {
				return dateA.getMonth() < dateB.getMonth();
			}

			return false;
		},
		// 获取月份区间
		async getMonthTime() {
			const res = await this.$fetch(`/mgmt/inventory/settled-scope`);
			if (res?.code) {
				const { minMonth, maxMonth } = res.data;
				const min = String(minMonth);
				const max = String(maxMonth);
				const minTime = min.slice(0, 4) + '-' + min.slice(4, 6);
				const maxTime = max.slice(0, 4) + '-' + max.slice(4, 6);
				const that = this;
				this.searchConfig.month = [new Date(maxTime), new Date(maxTime)];
				this.pickerOptions = {
					disabledDate(time) {
						return that.isEarlyThan(time, new Date(minTime)) || that.isEarlyThan(new Date(maxTime), time);
					},
				};
			}
		},
		// 批量导出处理
		async batchExport() {
			const { searchFields } = this;
			const params = Object.assign(searchFields);
			this.exportLoading = true;
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/inventory/bill/export',
				params,
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
		// 批量导出PDF
		batchExportPDF() {
			const { searchFields } = this;
			const { data } = this.tabPanes;
			if (!data.length) {
				return this.$message.warning('请查询 有数据 再导出');
			}
			if (!this.searchFields.companyCode && !this.searchFields.storeCode) {
				return this.$message.warning('请选择分公司编号或者输入服务中心编号');
			}

			const params = Object.assign(searchFields);
			exportExcel('/mgmt/inventory/bill/exportToPDF', params);
		},
		// 打印发货
		printShipment() {
			this.getPrint();
		},
		search() {
			this.tabPanes.pagination.pageNum = 1;
			this.tabPanes.data = [];
			// this.getLeaderByStoreCode(this.searchFields.storeCode);
			this.loadData();
			this.getSummaries();
			this.getCompanyCode();
		},
		loadMore() {
			const { pageNum, pageSize } = this.tabPanes.pagination;
			const { total } = this.tabPanes;
			if (pageNum * pageSize >= total) {
				return this.$message.warning('没有更多数据');
			}
			this.tabPanes.pagination.pageNum++;
			this.loadData();
		},
		// 请求列表
		async loadData() {
			const { searchFields } = this;
			this.tabPanes.loading = true;
			const params = {
				...searchFields,
			};
			const res = await this.$fetch(`/mgmt/inventory/bill/page?${qs.stringify(params)}`);
			if (res) {
				const { list, total } = res.data.page;
				this.scope = res.data.scope;
				this.tabPanes.data = this.tabPanes.data.concat(list);
				this.tabPanes.total = total;
			} else {
				this.tabPanes.data = [];
				this.tabPanes.total = 0;
			}
			this.tabPanes.loading = false;
		},
		// 打印
		async getPrint() {
			const { searchFields } = this;
			this.printLoading = true;
			const params = {
				...searchFields,
			};
			delete params.pageNum;
			delete params.pageSize;
			const res = await this.$fetch(`/mgmt/inventory/bill/print?${qs.stringify(params)}`);
			if (res.code == 200 && res.data) {
				const {
					list,
					storeCode,
					storeName,
					productNum,
					mortgageNum,
					mortgageReturn,
					orderReturn,
					priorBalance,
					orderNum,
					adjustNum,
					scope: { maxMonth, minMonth },
				} = res.data;
				this.printDialog = true;
				let obj = {
					productCode: '合计',
					mortgageNum,
					mortgageReturn,
					orderReturn,
					priorBalance,
					productNum,
					orderNum,
					adjustNum,
				};
				this.printDate = list.concat(obj);
				this.printHeader = {
					storeCode,
					storeName,
					productNum,
					nowTime: this.nowTime,
					month: minMonth == maxMonth ? minMonth : minMonth + '-' + maxMonth,
				};
				this.printDialog = true;
				this.$nextTick(() => {
					this.$print({
						printable: `printDialog-${this.nowTime}-1`,
						type: 'html',
						scanStyles: false,
						css: 'print_css/stockPrintA4.css',
					});
					this.printDialog = false;
				});
			}
			this.printLoading = false;
		},
		// 获取分公司编号
		async getCompanyCode() {
			const res = await this.$fetch(`/mgmt/sys/listCompanyByCode`);
			if (res?.code === 200) {
				let code = res.data.map(item => ({
					label: item.code + '-' + item.name,
					value: item.code,
				}));
				this.SERVICE_RECONCILIATION_SEARCH.form[0].options = code;
				this.SERVICE_RECONCILIATION_SEARCH.form[0].options = code;
			} else {
				this.$message.warning('获取分公司编号数据失败');
			}
		},
		// 获取合计
		async getSummaries() {
			const res = await this.$fetch(`/mgmt/inventory/bills/total?${qs.stringify(this.searchFields)}`);
			if (res?.code == 200 && res.data) {
				this.summaryData = res.data;
			}
		},
		// 合计
		Summary() {
			const { summaryData } = this;
			// console.log(summaryData);
			const sums = [];
			if (summaryData) {
				this.SERVICE_RECONCILIATION_COLUMNS.forEach((column, index) => {
					if (column.summary) {
						sums[index] = column.prop in summaryData ? summaryData[column.prop] : '';
					}
				});
			}
			this.$nextTick(() => {
				this.$refs[`table`].$children[0].doLayout();
			});
			return ['合计:', ...sums];
		},
	},
};
</script>
<style lang="scss" scoped>
::v-deep .el-loading-spinner {
	margin-top: 0;
	transform: translateY(-50%);
}
.el-dropdown-link {
	cursor: pointer;
	color: #409eff;
}
</style>