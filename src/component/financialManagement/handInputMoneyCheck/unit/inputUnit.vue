<template>
	<div class="input-unit">
		<el-card>
			<searchPanel v-model="searchConfig" :config="PERFECT_WALLET_LIST_CONFIG_TWO" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				border
				ref="multipleTable"
				:loading="loading"
				:dataSource="list"
				:columns="HAND_INPUT_MONEY_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				showSummary
				:summary-method="getSummaries"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button type="text" v-permission="'hand_input_money_check_input_button'" @click="handleInput(scope.data)">
						手工录入项
					</el-button>
				</template>
			</tableList>
		</el-card>
		<edit-input-modal
			:show="inputDialogVisible"
			:form="ruleForm"
			@close="inputDialogVisible = false"
			@success="successEditModal"
		/>
	</div>
</template>

<script>
import editInputModal from '../modal/editInputModal';
import { PERFECT_WALLET_LIST_CONFIG_TWO } from '../../perfectWallet/config';
import { HAND_INPUT_MONEY_COLUMNS_CONFIG, COMPANY_LIST } from '../config';
export default {
	name: 'handInputUnit',
	components: {
		'edit-input-modal': editInputModal,
	},
	props: {
		unitActiveTab: String,
	},
	data() {
		return {
			PERFECT_WALLET_LIST_CONFIG_TWO,
			HAND_INPUT_MONEY_COLUMNS_CONFIG,
			COMPANY_LIST,
			searchConfig: {},
			loading: false,
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
			list: [],
			summaryData: null,
			inputDialogVisible: false,
			ruleForm: {},
		};
	},
	watch: {
		unitActiveTab: {
			immediate: true,
			handler(val) {
				if (val === 'input') {
					this.upData();
					this.loadSummaryAmt();
				}
			},
		},
		'searchConfig.storeCode'(val) {
			if (/^\d{6,}$/.test(val)) {
				this.handleSearchCardNo();
			}
		},
	},
	computed: {
		loadDataPost() {
			let data = { ...this.searchConfig };
			data.pageNum = this.pagination.currentPage;
			data.pageSize = this.pagination.pageSize;
			return data;
		},
	},
	methods: {
		// 监听按下回车事件
		enterHandler(e) {
			if (e.which === 13 && this.$route.path.includes('hand_input_money_check')) {
				this.handleSearch();
			}
		},
		// 通过服务中心编号查询会员卡号
		async handleSearchCardNo() {
			const { storeCode } = this.searchConfig;
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/fin/wallet/getCardNoByStoreCode?storeCode=${storeCode}`,
			});
			if (res && res.code == 200) {
				this.searchConfig.cardNo = res.data;
			} else {
				this.$message.error('获取会员卡号失败');
			}
		},
		handleSearch() {
			this.pagination.currentPage = 1;
			this.upData();
			this.loadSummaryAmt();
		},
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.upData();
		},
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.upData();
		},
		// 手工录入操作
		handleInput(row) {
			this.inputDialogVisible = true;
			this.$nextTick(() => {
				const {
					walletId,
					walletAdjustId,
					companyNo: companyCode,
					companyName,
					thisMonthActualBalanceAmt: actualBalance,
				} = row;
				this.ruleForm = {
					walletId,
					walletAdjustId,
					companyCode,
					companyName,
					actualBalance,
				};
			});
		},
		successEditModal() {
			this.inputDialogVisible = false;
			this.upData();
		},
		// 合计
		getSummaries() {
			const sums = [];
			const { summaryData, dataTotal } = this;
			if (summaryData) {
				HAND_INPUT_MONEY_COLUMNS_CONFIG.forEach((column, index) => {
					if (column.summary) {
						sums[index] = column.prop in summaryData ? summaryData[column.prop] : '';
						sums[index] = typeof sums[index] == 'number' ? '' + sums[index] : '';
					} else {
						sums[index] = '';
					}
				});
			}
			sums.splice(0, 2);
			this.$nextTick(() => {
				this.$refs['multipleTable'].$children[0].doLayout();
			});
			return ['合计:', `${dataTotal}人`, ...sums];
		},
		// 获取分公司编号
		async loadCompanyCode() {
			const res = await this.$fetch(`/mgmt/inventory/common/getCompanyList`);
			if (res && res.code === 200 && res.data) {
				this.PERFECT_WALLET_LIST_CONFIG_TWO.form[3].options = res.data.map(v => {
					this.COMPANY_LIST[v.code] = v.name;
					return {
						label: `${v.code} ${v.name}`,
						value: v.code,
					};
				});
			} else {
				this.$message.warning((res && res.data.message) || '分公司编号选项更新失败');
			}
		},
		// 获取钱包管理合计金额
		async loadSummaryAmt() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/getWalletTotalAmt',
				data: this.loadDataPost,
				timeout: 20000,
			});
			if (res && res.code === 200) {
				this.summaryData = res.data;
			} else {
				this.$message.error('获取钱包管理合计数据失败');
			}
		},
		// 获取列表数据
		async loadData() {
			this.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/getList',
				data: this.loadDataPost,
				timeout: 20000,
				callback: () => {
					this.loading = false;
				},
			});
			this.loading = false;
			if (res && res.code == 200 && res.data) {
				let { list } = res.data;
				this.list = list;
			} else {
				this.$message.error('获取列表数据失败，请查询服务是否可用');
			}
		},
		// 获取数据条数
		async loadDataTotal() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/getWalletCount',
				data: this.loadDataPost,
				timeout: 60000,
			});
			if (res && res.code === 200) {
				this.dataTotal = res.data;
			} else {
				this.$message.error('获取数据合计条数失败，请查询服务是否可用');
			}
		},
		// 更新数据
		upData() {
			this.loadData();
			this.loadDataTotal();
		},
	},
	mounted() {
		this.loadCompanyCode();
		window.addEventListener('keydown', this.enterHandler);
	},
	beforeDestroy() {
		window.removeEventListener('keydown', this.enterHandler);
	},
};
</script>

<style>
</style>