<template>
	<div class="credit-adjust-record-sheet">
		<guideBar>
			<el-button v-permission="'credit_adjust_record_sheet'" type="primary" @click="batchExport">批量导出</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="CREDIT_ADJUST_RECORD_SHEET_SEARCH" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="list"
				:columns="CREDIT_ADJUST_RECORD_SHEET_COLUMNS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			/>
		</el-card>
	</div>
</template>

<script>
import { formatDate, formatDateDefault } from 'util/formValidation.js';
import { exportExcelPost } from 'util';
import { CREDIT_ADJUST_RECORD_SHEET_SEARCH, CREDIT_ADJUST_RECORD_SHEET_COLUMNS } from './config.js';
export default {
	name: 'creditAdjustRecordSheet',
	data() {
		return {
			CREDIT_ADJUST_RECORD_SHEET_SEARCH,
			CREDIT_ADJUST_RECORD_SHEET_COLUMNS,
			searchConfig: {},
			loading: false,
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 0,
			list: [],
		};
	},
	watch: {
		'searchConfig.storeCode'(val) {
			if (/^\d{6,}$/.test(val)) {
				this.loadCardNoByStoreCode();
			}
		},
	},
	computed: {
		loadDataPost() {
			this.dealSearchConfig();
			const {
				searchConfig,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			let data = {
				...searchConfig,
				pageNum,
				pageSize,
			};
			if (data.effectiveTime) {
				data.effectiveStartTime = data.effectiveTime[0] ? formatDateDefault(data.effectiveTime[0]) + ' 00:00:00' : null;
				data.effectiveEndTime = data.effectiveTime[1] ? formatDateDefault(data.effectiveTime[1]) + ' 23:59:59' : null;
				delete data.effectiveTime;
			}
			return data;
		},
	},
	methods: {
		// 批量导出
		batchExport() {
			const timeStr = formatDate(new Date().getTime());
			exportExcelPost('/mgmt/fin/wallet/credit/exportAdjustedList', this.loadDataPost, `信用额调整记录表${timeStr}`, {
				timeout: 2 * 60000,
			});
		},
		// 第一栏查询事件
		async loadCardNoByStoreCode() {
			const { storeCode } = this.searchConfig;
			if (!storeCode) return;
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/fin/wallet/getCardNoByStoreCode?storeCode=' + storeCode,
			});
			if (res && res.code == 200) {
				this.searchConfig.cardNo = res.data;
			} else {
				this.$message.error('获取会员卡号失败');
			}
		},
		// 搜索2
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
		},
		// 翻页操作
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 处理搜索栏数据（清空无值属性）
		dealSearchConfig() {
			const { searchConfig } = this;
			for (let index in searchConfig) {
				if (searchConfig[index] == '') {
					searchConfig[index] = null;
				}
			}
		},
		// 获取记录表数据
		async loadData() {
			this.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/credit/getAdjustedList',
				data: this.loadDataPost,
				callback: () => {
					this.loading = false;
				},
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
				if (total == 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取记录表数据失败');
			}
		},
	},
	mounted() {
		this.loadData();
	},
};
</script>

<style>
</style>
