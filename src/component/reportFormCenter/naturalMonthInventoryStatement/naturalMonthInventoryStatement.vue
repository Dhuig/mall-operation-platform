<template>
	<div class="natural-month-inventory-statement">
		<guideBar />
		<el-card>
			<searchPanel v-model="searchConfig" :config="NATURAL_MONTH_INVENTORY_STATEMENT_SEARCH" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				border
				ref="multipleTable"
				:dataSource="list"
				:columns="NATURAL_MONTH_INVENTORY_STATEMENT_COLUMNS"
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
import { NATURAL_MONTH_INVENTORY_STATEMENT_SEARCH, NATURAL_MONTH_INVENTORY_STATEMENT_COLUMNS } from './config';
import qs from 'querystring';
export default {
	name: 'naturalMonthInventoryStatement',
	data() {
		return {
			NATURAL_MONTH_INVENTORY_STATEMENT_SEARCH,
			NATURAL_MONTH_INVENTORY_STATEMENT_COLUMNS,
			searchConfig: {},
			loading: false,
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
			list: [],
		};
	},
	computed: {
		loadDataPost() {
			const {
				pagination: { currentPage: pageNo, pageSize },
			} = this;
			return {
				...this.searchConfig,
				pageNo,
				pageSize,
			};
		},
	},
	methods: {
		// 搜索
		handleSearch() {
			console.log('搜索');
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
		// 获取列表数据
		async loadData() {
			const res = await this.$fetch({
				method: 'GET',
				url: `/1.0/history/inStorageReportNature/list?${qs.stringify(this.loadDataPost)}`,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
				if (!total) {
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