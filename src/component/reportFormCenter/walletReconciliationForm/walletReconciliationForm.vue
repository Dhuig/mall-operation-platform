<template>
	<div class="wallet-reconciliation-form">
		<guideBar>
			<!-- <el-button type="primary" v-permission="'wallet_reconciliation_form_export'">导出</el-button> -->
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="WALLET_RECONCILIATION_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				ref="multipleTable"
				border
				:loading="loading"
				:dataSource="list"
				:columns="WALLET_RECONCILIATION_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button type="text" v-permission="'wallet_reconciliation_form_detail'" @click="previewDetail(scope.data)">
						查看明细
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { WALLET_RECONCILIATION_SEARCH_CONFIG, WALLET_RECONCILIATION_COLUMNS_CONFIG } from './config';
import { formatDateDefault } from 'util/formValidation';
import qs from 'querystring';
export default {
	name: 'walletReconciliationForm',
	data() {
		return {
			WALLET_RECONCILIATION_SEARCH_CONFIG,
			WALLET_RECONCILIATION_COLUMNS_CONFIG,
			branchCompanyCode: '', // 默认分公司code
			searchConfig: {},
			canSearch: true, //是否可开始搜索
			loading: false,
			list: [],
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
		};
	},
	watch: {
		searchConfig: {
			deep: true,
			handler(data) {
				const { userCode } = data;
				if (userCode) {
					this.canSearch = true;
				} else {
					this.$nextTick(() => {
						const { branchCompanyCode, month } = data;
						if (branchCompanyCode && month) {
							this.canSearch = true;
						} else {
							this.canSearch = false;
						}
					});
				}
			},
		},
	},
	computed: {
		loadDataParams({ searchConfig, pagination: { currentPage: pageNo, pageSize } }) {
			return {
				...searchConfig,
				pageNo,
				pageSize,
			};
		},
	},
	methods: {
		// 搜索
		handleSearch() {
			if (this.canSearch) {
				this.pagination.currentPage = 1;
				this.loadData();
			} else {
				this.$message.warning('请选择分公司编号和月份或会员卡号');
			}
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
		// 查看明细
		previewDetail(row) {
			const { userId, userNumber, userCode, userName, walletAmount, month } = row;
			this.$go('wallet_reconciliation_detail', { userId, userNumber, userCode, userName, walletAmount, month });
		},
		// 分公司options选项初始化
		initBranchCompanyOptions() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			this.branchCompanyCode = serviceCompanyOptions[0].value;
			this.WALLET_RECONCILIATION_SEARCH_CONFIG.form[0].options = serviceCompanyOptions.map(({ value }) => ({
				label: value,
				value,
			}));
		},
		// 获取列表数据
		async loadData() {
			this.loading = true;
			const res = await this.$fetch({
				url: `/1.0/history/walletReconciliation/queryWalletReconciliationList?${qs.stringify(this.loadDataParams)}`,
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
		this.initBranchCompanyOptions();
		this.$nextTick(() => {
			this.searchConfig.branchCompanyCode = this.branchCompanyCode;
			this.searchConfig.month = formatDateDefault(Date.now()).substr(0, 7);
			this.loadData();
		});
	},
};
</script>

<style>
</style>