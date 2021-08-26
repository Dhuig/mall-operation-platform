<template>
	<div>
		<guideBar>
			<el-button v-permission="'unit_group_purchase_batch_export'" type="primary" @click="batchExport">
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="UNIT_PURCHASE_LIST_SEARCH" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				ref="multipleTable"
				:dataSource="list"
				:columns="LIST_COLUMNS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				showSummary
				:summary-method="getSummaries"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button v-permission="'unit_group_purchase_detail'" type="text" @click="detail(scope.data)">
						详情
					</el-button>
				</template>
			</tableList>
			<el-row class="table-tips">
				<el-col :span="24">注:</el-col>
				<el-col :span="24">1、团购差额=单位实际支付金额（按团购价）—当月报单金额（按零售价）</el-col>
				<el-col :span="24">2、6-18%折扣：当月实际报单的产生的折扣</el-col>
				<el-col :span="24">3、电子礼券：按实际报单时抵扣的电子礼券</el-col>
				<el-col :span="24">4、本月结余：月结时到个人补扣</el-col>
			</el-row>
		</el-card>
	</div>
</template>

<script>
import { UNIT_PURCHASE_LIST_SEARCH, LIST_COLUMNS } from './config.js';
import qs from 'querystring';
import { exportExcel } from 'util';
import { formatDate } from 'util/formValidation.js';
export default {
	name: 'unitGroupPurchaseList',
	data() {
		return {
			UNIT_PURCHASE_LIST_SEARCH,
			LIST_COLUMNS,
			searchConfig: {
				orderMonth: '',
			},
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
				pagination: { currentPage, pageSize },
			} = this;
			let data = {
				...searchConfig,
				pageNum: currentPage,
				pageSize,
			};
			return data;
		},
	},
	methods: {
		// 批量导出
		batchExport() {
			exportExcel('/mgmt/order/exportGroupStatement', this.loadDataPost);
		},
		// 查询
		handleSearch() {
			if (this.loadDataPost.orderMonth === 'NaNNaN') {
				this.loadDataPost.orderMonth = null;
			}
			this.loadData();
		},
		// 翻页
		handleChangePage(page) {
			this.pagination.currentPage = page;
			2;
			this.loadData();
		},
		// 切换每页条数
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 详情
		detail(row) {
			const { storeCode, creatorCard, orderMonth } = row;
			this.$go('unit_group_purchase_detail', { storeCode, creatorCard, orderMonth });
		},
		// 合计
		getSummaries(param) {
			const { columns, data } = param;
			const COLUMNS_CONFIG = this.LIST_COLUMNS;
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
			const res = await this.$fetch({
				url: `/mgmt/order/getGroupStatement?${qs.stringify(this.loadDataPost)}`,
				timeout: 30000,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				if (list.length === 0) {
					this.$message.warning('暂无数据');
				}
				this.list = list;
				this.dataTotal = total;
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.searchConfig.orderMonth = formatDate(new Date(), 'month').replace('-', '');
			this.loadData();
		});
	},
};
</script>
<style lang="scss" scoped>
::v-deep.table-tips {
	line-height: 24px;
	color: $color-body-se;
}
</style>
