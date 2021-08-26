<template>
	<div class="inventory-statement-form">
		<guideBar>
			<!-- <el-button type="primary" v-permission="'inventory_statement_form_export'">导出</el-button>
			<el-button type="primary" v-permission="'inventory_statement_form_print'">打印对账单</el-button> -->
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="INVENTORY_STATEMENT_FORM_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="list"
				:columns="INVENTORY_STATEMENT_FORM_COLUMNS_CONFIG"
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
import { INVENTORY_STATEMENT_FORM_SEARCH_CONFIG, INVENTORY_STATEMENT_FORM_COLUMNS_CONFIG } from './config';
import qs from 'querystring';
export default {
	name: 'inventoryStatementForm',
	data() {
		return {
			INVENTORY_STATEMENT_FORM_SEARCH_CONFIG,
			INVENTORY_STATEMENT_FORM_COLUMNS_CONFIG,
			searchConfig: {},
			loading: false,
			list: [],
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
		};
	},
	computed: {
		loadDataParams() {
			const {
				searchConfig,
				pagination: { currentPage: pageNo, pageSize },
			} = this;
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
			this.pagination.currentPage = 1;
			this.loadData();
		},
		// 翻页
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 切换每页条数
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		//获取列表数据
		async loadData() {
			const res = await this.$fetch(`/1.0/history/inStorageSnapshot/list?${qs.stringify(this.loadDataParams)}`);
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
				if (!list) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
	},
};
</script>

<style>
</style>