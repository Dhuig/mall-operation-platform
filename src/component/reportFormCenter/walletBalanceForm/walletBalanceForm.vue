<template>
	<div class="wallet-balance-form">
		<guideBar>
			<el-button type="primary" @click="batchExport">导出EXCEL</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="WALLET_BALANCE_SEARCH_CONFIG" @search="handleSearch">
				<el-input
					slot="storeCode"
					size="medium"
					v-model="searchConfig.storeCode"
					@blur="loadCardNo"
					placeholder="请输入服务中心编号"
				></el-input>
			</searchPanel>
		</el-card>
		<el-card>
			<tableList
				ref="multipleTable"
				border
				:loading="loading"
				:dataSource="list"
				:columns="WALLET_BALANCE_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="{ index: true, labelIndex: '序号' }"
				showSummary
				:summary-method="getSummaries"
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
import { WALLET_BALANCE_SEARCH_CONFIG, WALLET_BALANCE_COLUMNS_CONFIG } from './config';
import { getLastMonth } from '../pledgeBalanceStatistical/config';
import qs from 'querystring';
import { formatDateDefault } from 'util/formValidation.js';
import { exportExcelPost } from 'util';
import { CUSTOMER_TYPE } from '@/component/customerManagement/config';
export default {
	name: 'walletBalanceForm',
	data() {
		return {
			WALLET_BALANCE_SEARCH_CONFIG,
			WALLET_BALANCE_COLUMNS_CONFIG,
			searchConfig: {},
			loading: false,
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
			list: [],
			summaryData: null,
		};
	},
	watch: {
		'searchConfig.monthrange'(data) {
			if (data && !data[0]) {
				this.searchConfig.monthrange = null;
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
			if (data.memberType && data.memberType.length == 0) {
				data.memberType = Object.keys(CUSTOMER_TYPE).slice(0, 4);
			}
			if (data.monthrange) {
				data.beginmonth = formatDateDefault(data.monthrange[0]).replace('-', '').substr(0, 6);
				data.endmonth = formatDateDefault(data.monthrange[1]).replace('-', '').substr(0, 6);
				delete data.monthrange;
			} else {
				data.monthrange = null;
			}
			return data;
		},
	},
	methods: {
		// 导出excel
		batchExport() {
			exportExcelPost('/months/wallet/exportBillsReport', this.loadDataPost, '完美钱包余额报表', { timeout: 30000 });
		},
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.updateData();
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
			this.$go('wallet_balance_form_detail', { info: JSON.stringify(row) });
		},
		// 合计
		getSummaries() {
			const sums = [];
			const { summaryData, dataTotal } = this;
			if (summaryData) {
				WALLET_BALANCE_COLUMNS_CONFIG.forEach((column, index) => {
					if (column.summary) {
						sums[index] = column.prop in summaryData ? summaryData[column.prop] : '';
						sums[index] = typeof sums[index] == 'number' ? '' + sums[index] : '';
					} else {
						sums[index] = '';
					}
				});
			}
			sums.shift();
			this.$nextTick(() => {
				this.$refs['multipleTable'].$children[0].doLayout();
			});
			return ['合计：', `${dataTotal}条`, ...sums];
		},
		// 通过服务中心编号获取会员卡号
		async loadCardNo() {
			const { storeCode } = this.searchConfig;
			if (!storeCode) return this.$message.warning('请输入服务中心编号');
			const res = await this.$fetch(`/mgmt/fin/wallet/getCardNoByStoreCode?storeCode=${storeCode}`);
			if (res && res.code === 200) {
				this.searchConfig.cardNo = res.data;
			} else {
				this.$message.error('获取会员卡号失败');
			}
		},
		// 获取分公司列表
		async renderCompanyList() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			this.WALLET_BALANCE_SEARCH_CONFIG.form[4].options = serviceCompanyOptions.map(({ label, value }) => ({
				label: `${value} ${label}`,
				value,
			}));
		},
		// 获取统计数据
		async loadDataSum() {
			const res = await this.$fetch(`/months/wallet/sumlistWalletBillsReport?${qs.stringify(this.loadDataPost)}`);
			if (res && res.code === 200) {
				this.summaryData = res.data || {};
			} else {
				this.$message.error('获取统计数据失败，请查询服务是否可用');
			}
		},
		// 获取列表数据
		async loadData() {
			const res = await this.$fetch(`/months/wallet/billsReport?${qs.stringify(this.loadDataPost)}`);
			if (res && res.code === 200 && res.data) {
				let { list, total } = res.data;
				if (total == 0) {
					this.$message.warning('暂无数据');
				}
				this.list = list;
				this.dataTotal = total;
			} else {
				this.$message.error('获取列表数据失败，请查询服务是否可用');
			}
		},
		// 更新数据
		updateData() {
			this.loadData();
			this.loadDataSum();
		},
		initLoad() {
			this.$nextTick(() => {
				const timeArr = getLastMonth();
				const { cardNo, mobile } = this.$route.query;
				this.searchConfig.monthrange = [new Date(timeArr[0]).getTime(), new Date(timeArr[1]).getTime()];
				this.searchConfig.cardNo = cardNo || null;
				this.searchConfig.mobile = mobile || null;
				this.updateData();
			});
		},
	},
	mounted() {
		this.initLoad();
		this.renderCompanyList();
	},
};
</script>

<style>
</style>