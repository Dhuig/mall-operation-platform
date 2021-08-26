<template>
	<div class="bank-remittance-flow-history">
		<guideBar>
			<!-- <el-button v-permission="'bank_remittance_flow_history_export'" type="primary" @click="batchExport">
				导出EXCEL
			</el-button> -->
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="BANK_FLOW_HISTORY_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				ref="multipleTable"
				:loading="loading"
				:dataSource="list"
				:columns="BANK_FLOW_HISTORY_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="{ index: true, labelIndex: '序号' }"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			/>
		</el-card>
	</div>
</template>

<script>
import { BANK_FLOW_HISTORY_SEARCH_CONFIG, BANK_FLOW_HISTORY_COLUMNS_CONFIG } from './config';
import qs from 'querystring';
import { formatDateDefault } from 'util/formValidation';
export default {
	name: 'bankRemittanceFlowHistory',
	data() {
		return {
			BANK_FLOW_HISTORY_SEARCH_CONFIG,
			BANK_FLOW_HISTORY_COLUMNS_CONFIG,
			searchConfig: {},
			list: [],
			loading: false,
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 0,
		};
	},
	computed: {
		loadDataParams({ searchConfig, pagination: { currentPage: pageNo, pageSize } }) {
			let data = {
				...searchConfig,
				pageNo,
				pageSize,
			};
			data.arriveTimeFrom = null;
			data.arriveTimeTo = null;
			if (data.arriveTime) {
				data.arriveTimeFrom = data.arriveTime[0] ? formatDateDefault(data.arriveTime[0]) : null;
				data.arriveTimeTo = data.arriveTime[1] ? formatDateDefault(data.arriveTime[1]) : null;
				delete data.arriveTime;
			}
			return data;
		},
	},
	methods: {
		// 导出excel
		batchExport() {},
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
		// 切换每页条数
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 详情
		toDetail() {},
		// 获取列表数据
		async loadData() {
			this.loading = true;
			const res = await this.$fetch({
				url: `/1.0/history/inBankRemittanceLine/list?${qs.stringify(this.loadDataParams)}`,
				timeout: 60000,
				callback: () => {
					this.loading = false;
				},
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
	},
};
</script>

<style>
</style>