<template>
	<div>
		<el-card>
			<searchPanel v-model="searchConfig" :config="SPLIT_COMBINATION_FORM_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				border
				ref="multipleTable"
				:loading="loading"
				:dataSource="list"
				:columns="SPLIT_COMBINATION_FORM_COLUMNS_CONFIG"
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
import qs from 'querystring';
import { SPLIT_COMBINATION_FORM_SEARCH_CONFIG, SPLIT_COMBINATION_FORM_COLUMNS_CONFIG } from '../config';
export default {
	name: 'inventoryCombinationForm',
	props: {
		activeName: String,
	},
	data() {
		return {
			SPLIT_COMBINATION_FORM_SEARCH_CONFIG,
			SPLIT_COMBINATION_FORM_COLUMNS_CONFIG,
			searchConfig: {},
			loading: false,
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
			list: [],
		};
	},
	watch: {
		activeName: {
			immediate: true,
			handler(val) {
				if (val == 'combination') {
					this.loadData();
					this.$emit('input', this.loadDataPost);
				}
			},
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
			if (data.daterange) {
				data.adjustTimeBegin = data.daterange[0] || null;
				data.adjustTimeEnd = data.daterange[1] || null;
				delete data.daterange;
			}
			return data;
		},
	},
	methods: {
		// 监听按下回车事件
		enterHandler(e) {
			if (e.which === 13 && this.$route.path.includes('inventory_split_combination_form')) {
				this.handleSearch();
			}
		},
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
			this.$emit('input', this.loadDataPost);
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
		loadCompanyList() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			SPLIT_COMBINATION_FORM_SEARCH_CONFIG.form[3].options = serviceCompanyOptions.map(({ label, value }) => {
				return {
					label: `${value} ${label}`,
					value,
				};
			});
		},
		// 获取列表数据
		async loadData() {
			const res = await this.$fetch(`/mgmt/inventory/combine/statement?${qs.stringify(this.loadDataPost)}`);
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
	},
	mounted() {
		this.loadCompanyList();
		window.addEventListener('keydown', this.enterHandler);
	},
	beforeDestroy() {
		window.removeEventListener('keydown', this.enterHandler);
	},
};
</script>

<style>
</style>