<template>
	<div class="wallet-credit-valid">
		<guideBar>
			<el-button type="primary" @click="batchExport">批量导出</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="WALLET_CREDIT_VALID_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="list"
				:columns="WALLET_CREDIT_VALID_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="{ index: true, labelIndex: '序号' }"
				showSummary
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
import { WALLET_CREDIT_VALID_SEARCH_CONFIG, WALLET_CREDIT_VALID_COLUMNS_CONFIG } from './config';
import qs from 'querystring';
import { exportExcelPost } from 'util';
export default {
	name: 'walletCreditValid',
	data() {
		return {
			WALLET_CREDIT_VALID_SEARCH_CONFIG,
			WALLET_CREDIT_VALID_COLUMNS_CONFIG,
			searchConfig: {
				month: '',
			},
			loading: false,
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
			list: [],
		};
	},
	watch: {
		'searchConfig.storeCode'(val) {
			if (val && /\d{6,}/.test(val)) {
				this.loadCardNoByStoreCode();
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
			return data;
		},
	},
	methods: {
		batchExport() {
			exportExcelPost('/months/wallet/exportCreditBillReport', this.loadDataPost, '钱包信用额', { timeout: 60000 * 2 });
		},
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
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
		detail(row) {
			const { walletId, month } = row;
			this.$go('credit_adjust_record_logs', { walletId, month });
		},
		// 通过服务中心编号获取会员卡号
		async loadCardNoByStoreCode() {
			const { storeCode } = this.searchConfig;
			if (!storeCode) return;
			const res = await this.$fetch(`/mgmt/fin/wallet/getCardNoByStoreCode?storeCode=${storeCode}`);
			if (res && res.code == 200) {
				this.searchConfig.cardNo = res.data;
			} else {
				this.$message.error('获取会员卡号失败');
			}
		},
		// 获取列表信息
		async loadData() {
			this.loading = true;
			const res = await this.$fetch(`/months/wallet/creditBillReport?${qs.stringify(this.loadDataPost)}`);
			this.loading = false;
			if (res && res.code == 200 && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.loadData();
		});
	},
};
</script>

<style>
</style>