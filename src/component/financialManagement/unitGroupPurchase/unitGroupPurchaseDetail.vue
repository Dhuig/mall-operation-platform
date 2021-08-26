<template>
	<div class="unit-group-purchase-detail">
		<guideBar>
			<el-button type="primary" @click="batchExport">导出账单明细</el-button>
		</guideBar>
		<el-card class="box-card">
			<searchPanel v-model="searchConfig" :config="UNIT_PURCHASE_DETAIL_SEARCH" @search="handleSearch" />
		</el-card>
		<!-- 表格 -->
		<el-card class="box-card">
			<tableList
				border
				ref="multipleTable"
				:dataSource="list"
				:columns="DETAIL_COLUMNS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				showSummary
				:summary-method="getSummaries"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			></tableList>
		</el-card>
	</div>
</template>

<script>
import { UNIT_PURCHASE_DETAIL_SEARCH, DETAIL_COLUMNS } from './config.js';
import qs from 'querystring';
import { exportExcel } from 'util';
export default {
	name: 'unitGroupPurchaseDetail',
	data() {
		return {
			UNIT_PURCHASE_DETAIL_SEARCH,
			DETAIL_COLUMNS,
			orderMonth: '',
			currentStore: '',
			creatorCard: '',
			searchConfig: {},
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 0,
			list: [],
		};
	},
	computed: {
		loadDataPost() {
			const {
				searchConfig,
				orderMonth,
				storeCode,
				creatorCard,
				pagination: { currentPage, pageSize },
			} = this;
			let data = {
				...searchConfig,
				orderMonth,
				creatorCard,
				currentStore: storeCode,
				pageNum: currentPage,
				pageSize,
			};
			return data;
		},
	},
	methods: {
		// 批量导出
		batchExport() {
			exportExcel('/mgmt/order/exportGroupStatementDetail', this.loadDataPost);
		},
		// 搜索
		handleSearch() {
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
		// 合计
		getSummaries(param) {
			const { columns, data } = param;
			const COLUMNS_CONFIG = this.DETAIL_COLUMNS;
			const sums = [];
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '合计';
					return;
				}
				if (COLUMNS_CONFIG.some(col => col.prop == column.property && col.summary)) {
					const values = data.map(item => Number(item[column.property]));
					if (!values.every(value => isNaN(value))) {
						sums[index] = values.reduce((prev, curr) => {
							const value = Number(curr);
							if (!isNaN(value)) {
								return prev + curr;
							} else {
								return prev;
							}
						}, 0);
						sums[index] = '￥' + Number(sums[index]).toFixed(2);
					} else {
						sums[index] = '';
					}
				} else {
					sums[index] = '';
				}
			});
			this.$nextTick(() => {
				this.$refs['multipleTable'].$children[0].doLayout();
			});
			return sums;
		},
		// 获取列表数据
		async loadData() {
			const res = await this.$fetch(`/mgmt/order/groupStatementDetail?${qs.stringify(this.loadDataPost)}`);
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
				if (list.length === 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取数据失败');
			}
		},
	},
	mounted() {
		const { orderMonth, storeCode, creatorCard } = this.$route.query;
		if (orderMonth) {
			this.orderMonth = orderMonth;
			this.storeCode = storeCode;
			this.creatorCard = creatorCard;
			this.loadData();
		}
	},
};
</script>

<style lang="scss" scoped>
::v-deep.unit-group-purchase-detail {
	.box-card {
		margin-bottom: 16px;
	}
}
</style>