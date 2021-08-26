<template>
	<div class="credit-adjust-record-logs">
		<guideBar />
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="list"
				:columns="CREDIT_ADJUST_RECORD_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			/>
		</el-card>
	</div>
</template>

<script>
import { CREDIT_ADJUST_RECORD_COLUMNS_CONFIG } from './config';
import qs from 'querystring';
export default {
	name: 'creditAdjustRecordLogs',
	data() {
		return {
			CREDIT_ADJUST_RECORD_COLUMNS_CONFIG,
			loading: false,
			walletId: '',
			month: '',
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
			list: [],
		};
	},
	computed: {
		loadDataPost() {
			const {
				month,
				walletId,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			return {
				month,
				walletId,
				pageNum,
				pageSize,
			};
		},
	},
	methods: {
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
		// 获取列表数据
		async loadData() {
			this.loading = true;
			const res = await this.$fetch(`/months/wallet/billsWalletCreditDetailReport?${qs.stringify(this.loadDataPost)}`);
			this.loading = false;
			if (res && res.code === 200 && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
	},
	mounted() {
		const { walletId, month } = this.$route.query;
		if (walletId || month) {
			this.walletId = walletId;
			this.month = month;
			this.loadData();
		}
	},
};
</script>

<style>
</style>