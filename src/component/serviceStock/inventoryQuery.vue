<template>
	<div class="userManagement">
		<guideBar>
			<div v-if="activeTab == 'product'" class="marginR10">
				<el-button v-permission="'inventory_query_exportPDF'" type="primary" @click="exportPDF">导出PDF</el-button>
				<el-button v-permission="'inventory_query_print'" type="primary" :loading="printLoading" @click="print">
					打印
				</el-button>
			</div>
			<el-button v-permission="'inventory_history_query'" type="primary" @click="historySearch">历史月份查询</el-button>
			<el-button
				:loading="exportLoading"
				v-permission="'inventory_query_batch_export'"
				type="primary"
				@click="batchExport"
			>
				批量导出
			</el-button>
		</guideBar>

		<el-tabs v-model="activeTab">
			<el-tab-pane v-for="([label, name], index) in REPERTORY_NARNAL_TABS" :key="index" :name="name" :label="label">
				<el-card>
					<searchPanel v-model="tabPanes[name].searchConfig" ref="search" :config="config" @search="search" />
				</el-card>
			</el-tab-pane>
		</el-tabs>

		<el-card>
			<tableList
				show-summary
				:summary-method="Summary"
				:dataSource="tabPanes[activeTab].data"
				:columns="columns"
				:ref="`${activeTab}Table`"
				:pagination="tabPanes[activeTab].pagination"
				:dataTotal="tabPanes[activeTab].total"
				:loading="tabPanes[activeTab].loading"
				:height="height"
				@loadMore="loadMore"
				:slotcontent="slotcontent"
			>
				<template slot-scope="row" v-if="activeTab == 'product'">
					<el-button v-permission="'inventory_query_diff_detail'" type="text" @click="handleBtnsGruop(row.data)">
						增减明细
					</el-button>
				</template>
			</tableList>
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
import {
	REPERTORY_MONTH_PRODUCT_COLUMNS,
	REPERTORY_MONTH_SERVICE_COLUMNS,
	REPERTORY_NARNAL_PRODUCT_SEARCH,
	REPERTORY_NARNAL_SERVICE_SEARCH,
	REPERTORY_NARNAL_TABS,
	TABITEM,
} from './config.js';
import qs from 'querystring';

export default {
	name: 'inventoryQuery',
	components: {
		printTA4,
	},
	data() {
		const tabPanes = Object.create(null);
		REPERTORY_NARNAL_TABS.map(tabItem => (tabPanes[tabItem[1]] = new TABITEM()));
		return {
			exportLoading: false,
			REPERTORY_NARNAL_TABS,
			REPERTORY_MONTH_PRODUCT_COLUMNS,
			REPERTORY_MONTH_SERVICE_COLUMNS,
			REPERTORY_NARNAL_PRODUCT_SEARCH,
			REPERTORY_NARNAL_SERVICE_SEARCH,
			tabPanes,
			summaryData: null,
			activeTab: 'product', //tab切换

			// 打印
			printLoading: false,
			printDialog: false,
			printHeader: {},
			printDate: {},
			nowTime: formatDate(new Date()),
		};
	},
	watch: {
		activeTab() {
			this.search();
		},
	},
	computed: {
		config: vm => (vm.activeTab == 'product' ? REPERTORY_NARNAL_PRODUCT_SEARCH : REPERTORY_NARNAL_SERVICE_SEARCH),
		columns: vm => (vm.activeTab == 'product' ? REPERTORY_MONTH_PRODUCT_COLUMNS : REPERTORY_MONTH_SERVICE_COLUMNS),
		slotcontent: vm => vm.activeTab == 'product',
		height: vm => (vm.activeTab == 'product' ? 500 : 460),
	},
	created() {
		this.search();

		this.getCompanyCode();
	},
	methods: {
		// 导出PDF
		exportPDF() {
			const { data } = this.tabPanes[this.activeTab];
			if (!data.length) {
				return this.$message.warning('请查询 有数据 再导出');
			}
			const { companyCode, storeCode } = this.tabPanes[this.activeTab].searchConfig;
			if (!companyCode && !storeCode) {
				return this.$message.warning('请选择分公司编号或者输入服务中心编号');
			}
			const params = Object.assign({
				...this.tabPanes[this.activeTab].searchConfig,
				...this.tabPanes[this.activeTab].pagination,
			});
			exportExcel('/mgmt/inventory/export-pdf', params);
		},
		// 打印
		async print() {
			// const { searchFields } = this.tabPanes[this.activeTab];
			this.printLoading = true;
			const params = {
				...this.tabPanes[this.activeTab].searchConfig,
				...this.tabPanes[this.activeTab].pagination,
			};
			console.log(params);
			const res = await this.$fetch(`/mgmt/inventory/print?${qs.stringify(params)}`);
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
		// 下拉滚动
		loadMore() {
			const { pageNum, pageSize } = this.tabPanes[this.activeTab].pagination;
			const { total } = this.tabPanes[this.activeTab];
			if (pageNum * pageSize >= total) {
				return this.$message.warning('没有更多数据');
			}
			this.tabPanes[this.activeTab].pagination.pageNum++;
			this.loadData();
			// this.getSummaries();
		},
		// 获取分公司编号
		async getCompanyCode() {
			const res = await this.$fetch(`/mgmt/sys/listCompanyByCode`);
			if (res?.code === 200) {
				let code = res.data.map(item => ({
					label: item.code + '-' + item.name,
					value: item.code,
				}));
				this.REPERTORY_NARNAL_PRODUCT_SEARCH.form[0].options = code;
				this.REPERTORY_NARNAL_SERVICE_SEARCH.form[0].options = code;
			} else {
				this.$message.warning('获取分公司编号数据失败');
			}
		},
		// 搜索
		search() {
			this.tabPanes[this.activeTab].pagination.pageNum = 1;
			this.tabPanes[this.activeTab].data = [];
			this.loadData();
			this.getSummaries();
		},
		// 获取合计
		async getSummaries() {
			this.summaryData = null;
			const { searchConfig, pagination } = this.tabPanes[this.activeTab];
			const params = {
				...searchConfig,
				...pagination,
			};
			const url = this.activeTab == 'product' ? '/mgmt/inventory/total?' : '/mgmt/inventory/store/total?';
			const res = await this.$fetch({ url: `${url}${qs.stringify(params)}`, timeout: 60000 * 1 });
			if (res?.code == 200 && res.data) {
				this.summaryData = res.data;
			}
			// this.showSummary = true;
		},
		Summary() {
			const { summaryData } = this;
			const sums = [];
			if (summaryData) {
				this.columns.forEach((column, index) => {
					if (column.filter) {
						sums[index] = column.filter + summaryData[column.prop];
					} else if (column.summary) {
						sums[index] = column.prop in summaryData ? summaryData[column.prop] : '';
					} else {
						sums[index] = index == 0 ? '合计:' : '';
					}
				});
			} else {
				return ['请求中...'];
			}
			this.$nextTick(() => {
				this.$refs[`${this.activeTab}Table`].$children[0].doLayout();
			});
			return [...sums];
		},
		handleBtnsGruop(row) {
			this.$go('/Stock_Add_Substraction', { storeCode: row.storeCode, productCode: row.productCode });
		},
		// 批量导出
		async batchExport() {
			const { searchConfig, pagination } = this.tabPanes[this.activeTab];
			let params = {
				...searchConfig,
				...pagination,
			};
			const url = this.activeTab == 'product' ? '/mgmt/inventory/export' : '/mgmt/inventory/store/export';
			this.exportLoading = true;
			const res = await this.$fetch({
				method: 'GET',
				url,
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
		// 历史月份查询
		historySearch() {
			this.$go('/inventory_history_query');
		},
		async loadData() {
			const { searchConfig, pagination } = this.tabPanes[this.activeTab];
			const params = {
				...searchConfig,
				...pagination,
			};
			this.tabPanes[this.activeTab].loading = true;
			const url = this.activeTab == 'product' ? '/mgmt/inventory/page?' : '/mgmt/inventory/store/page?';
			const res = await this.$fetch({
				url: `${url}${qs.stringify(params)}`,
				timeout: 60000 * 1,
			});
			if (res) {
				this.tabPanes[this.activeTab].data = this.tabPanes[this.activeTab].data.concat(res.data.list);
				this.tabPanes[this.activeTab].total = res.data.total;
			} else {
				this.tabPanes[this.activeTab].data = [];
				this.tabPanes[this.activeTab].total = 0;
			}
			this.tabPanes[this.activeTab].loading = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.userManagement {
	.flex {
		display: flex;
	}
}
.marginR10 {
	margin-right: 10px;
}
</style>
