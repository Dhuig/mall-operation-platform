<template>
	<div class="open-store-deposit-list">
		<guideBar>
			<el-button v-permission="'deposit_balance_list_batch_export'" type="primary" @click="batchExport">
				导出EXCEL
			</el-button>
		</guideBar>
		<el-card class="box-card">
			<searchPanel v-model="searchConfig" :config="OPEN_STORE_DEPOSIT_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<!-- 表格 -->
		<el-card class="box-card">
			<tableList
				border
				ref="multipleTable"
				:loading="loading"
				:dataSource="list"
				:columns="OPEN_STORE_DEPOSIT_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="{ index: true, labelIndex: '序号' }"
				showSummary
				:summary-method="getSummaries"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			/>
		</el-card>
	</div>
</template>

<script>
import {
	OPEN_STORE_DEPOSIT_SEARCH_CONFIG,
	OPEN_STORE_DEPOSIT_COLUMNS_CONFIG,
	TRANSFER_METHODS,
	DEPOSIT_TYPE,
} from './config';
import qs from 'querystring';
import { exportExcel } from 'util';
export default {
	name: 'openStoreDepositList',
	data() {
		return {
			OPEN_STORE_DEPOSIT_SEARCH_CONFIG,
			OPEN_STORE_DEPOSIT_COLUMNS_CONFIG,
			TRANSFER_METHODS,
			DEPOSIT_TYPE,
			searchConfig: {},
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 0,
			list: [],
			summaryData: {}, // 合计
			loading: false,
		};
	},
	watch: {
		'searchConfig.storeCode'(val) {
			if (val && /\d{6,}/.test(val)) {
				this.loadCardByStoreCode();
				this.loadStoreNameByStoreCode();
			}
		},
	},
	methods: {
		// 导出excel
		batchExport() {
			exportExcel('/mgmt/store/exportDepositSearchList', this.loadDataPost);
		},
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
			this.loadDataSum();
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
		// 合计
		getSummaries() {
			const { summaryData } = this;
			const sums = [];
			if (summaryData) {
				OPEN_STORE_DEPOSIT_COLUMNS_CONFIG.forEach((column, index) => {
					if (column.summary) {
						sums[index] = column.prop in summaryData ? summaryData[column.prop] : '';
					} else {
						sums[index] = '';
					}
				});
			}
			this.$nextTick(() => {
				this.$refs['multipleTable'].$children[0].doLayout();
			});
			return [`合计:`, ...sums];
		},
		// 获取会员卡号
		async loadCardByStoreCode() {
			const { storeCode } = this.searchConfig;
			if (!storeCode) return this.$message.warning('请输入服务中心编号');
			const res = await this.$fetch(`/mgmt/fin/wallet/getCardNoByStoreCode?storeCode=${storeCode}`);
			if (res && res.code == 200) {
				this.searchConfig.cardNo = res.data;
			} else {
				this.$message.error('获取会员卡号失败');
			}
		},
		// 通过服务中心编号获取服务中心名称
		async loadStoreNameByStoreCode() {
			const { storeCode } = this.searchConfig;
			if (!storeCode) return this.$message.warning('请输入服务中心编号');
			const res = await this.$fetch(`/mgmt/fin/wallet/getNameByStoreCode?storeCode=${storeCode}`);
			if (res && res.code == 200) {
				this.searchConfig.storeName = res.data;
			} else {
				this.$message.error('获取服务中心名称失败');
			}
		},
		// 获取开店保证金统计【即时】
		async loadDataSum() {
			const res = await this.$fetch(`/mgmt/store/countDeposit?${qs.stringify(this.loadDataPost)}`);
			if (res && res.code == 200) {
				this.summaryData = res.data;
			} else {
				this.$message.error('获取开店保证金统计失败，请查询服务是否可用');
			}
		},
		// 获取列表数据
		async loadData() {
			this.loading = true;
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/store/listDeposit?${qs.stringify(this.loadDataPost)}`,
			});
			this.loading = false;
			this.list.length = 0;
			if (res && res.code == 200) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
				if (list.length == 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取数据失败');
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
	mounted() {
		this.loadData();
		this.loadDataSum();
	},
};
</script>

