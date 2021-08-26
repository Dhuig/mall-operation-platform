<template>
	<div class="cloud-charge-list">
		<guideBar>
			<el-button type="primary" @click="batchExport">导出EXCEL</el-button>
		</guideBar>
		<el-card class="box-card">
			<searchPanel :config="PLEDGE_STATISTICAL_SEARCH_CONFIG" v-model="searchConfig" @search="handleSearch" />
		</el-card>
		<el-card class="box-card">
			<tableList
				border
				ref="multipleTable"
				:dataSource="list"
				:columns="PLEDGE_STATISTICAL_LIST_COLUMNS"
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
				<template slot-scope="scope">
					<el-button type="text" @click="detail(scope.data)">详情</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>
<script>
import { PLEDGE_STATISTICAL_SEARCH_CONFIG, PLEDGE_STATISTICAL_LIST_COLUMNS } from './config';
import { formatDate } from 'util/formValidation';
import { exportExcel } from 'util';
export default {
	name: 'pledgeStatisticalList',
	data() {
		return {
			PLEDGE_STATISTICAL_SEARCH_CONFIG,
			PLEDGE_STATISTICAL_LIST_COLUMNS,
			searchConfig: {},
			list: [],
			dataTotal: 0,
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			summaryData: null,
		};
	},
	computed: {
		// 搜索参数
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
				data.beginMonth = data.monthrange[0] ? formatDate(data.monthrange[0]).substr(0, 7).replace('-', '') : null;
				data.endMonth = data.monthrange[1] ? formatDate(data.monthrange[1]).substr(0, 7).replace('-', '') : null;
				delete data.monthrange;
			}
			if (data.maxRemitAmount) {
				data.maxRemitAmountBegin = data.maxRemitAmount[0] === '' ? null : Number(data.maxRemitAmount[0]);
				data.maxRemitAmountEnd = data.maxRemitAmount[1] === '' ? null : Number(data.maxRemitAmount[1]);
				delete data.maxRemitAmount;
			}
			if (data.closingBalance) {
				data.closingBalanceBegin = data.closingBalance[0] === '' ? null : Number(data.closingBalance[0]);
				data.closingBalanceEnd = data.closingBalance[1] === '' ? null : Number(data.closingBalance[1]);
				delete data.closingBalance;
			}
			return data;
		},
	},
	methods: {
		// 导出
		batchExport() {
			exportExcel('/months/mortgage/exportBillsReport', this.loadDataPost);
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
			const {
				loadDataPost: { beginMonth, endMonth },
			} = this;
			const info = {
				...row,
			};
			if (beginMonth) {
				info.beginMonth = String(beginMonth).replace(/(\d{4})(\d{2})/, `$1-$2`);
				info.endMonth = String(endMonth).replace(/(\d{4})(\d{2})/, `$1-$2`);
			}
			this.$go('pledge_statistical_detail', {
				info: JSON.stringify(info),
			});
		},
		// 渲染分公司选项
		renderCompanyOptions() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			this.PLEDGE_STATISTICAL_SEARCH_CONFIG.form[2].options = serviceCompanyOptions.map(({ label, value }) => ({
				label: `${value} ${label}`,
				value,
			}));
		},
		// 合计
		getSummaries() {
			const { summaryData, dataTotal } = this;
			const sums = [];
			if (summaryData) {
				PLEDGE_STATISTICAL_LIST_COLUMNS.forEach((column, index) => {
					if (column.summary) {
						const prop = `sum${column.prop.charAt(0).toUpperCase() + column.prop.slice(1)}`;
						sums[index] = prop in summaryData ? summaryData[prop] : '';
					} else {
						sums[index] = '';
					}
				});
			}
			sums.splice(0, 1);
			this.$nextTick(() => {
				this.$refs['multipleTable'].$children[0].doLayout();
			});
			return ['合计: ', `${dataTotal}条`, ...sums];
		},
		// 获取列表合计数据
		async loadDataSum() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/months/mortgage/billsReportSum',
				data: this.loadDataPost,
				timeout: 3 * 60000,
			});
			if (res && res.data) {
				this.summaryData = { ...res.data };
			} else {
				this.$message.error('获取列表合计数据失败，请查询服务是否可用');
			}
		},
		// 请求数据
		async loadData() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/months/mortgage/billsReport`,
				data: this.loadDataPost,
				timeout: 3 * 60000,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
				if (total == 0) {
					return this.$message.warning('暂无数据');
				}
			} else {
				this.list = [];
				this.dataTotal = 0;
				this.$message.error('获取列表数据失败');
			}
		},
		initLoad() {
			this.$nextTick(() => {
				// const timeArr = getLastMonth();
				// this.searchConfig.monthrange = [new Date(timeArr[0]).getTime(), new Date(timeArr[1]).getTime()];
				this.loadData();
				this.loadDataSum();
			});
		},
	},
	created() {
		this.initLoad();
		this.renderCompanyOptions();
	},
};
</script>
<style lang="scss" scoped>
</style>
