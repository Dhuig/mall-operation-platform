<template>
	<div>
		<guideBar>
			<el-button
				v-permission="'refund_list_batch_export'"
				type="primary"
				@click="loadData(1)"
				icon="el-icon-document-copy"
			>
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="REFUND_SEARCH" @search="search" />
		</el-card>
		<el-card>
			<tableList
				:options="options"
				:loading="loading"
				:dataSource="data"
				:columns="REFUND_COLUMNS"
				:pagination="pagination"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				:dataTotal="pagination.total"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button v-permission="'refund_list_detail'" type="text" @click="viewDetail(scope.data)">
						查看详情
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { REFUND_SEARCH, REFUND_COLUMNS } from './config';
import { formatDateDefault } from 'util/formValidation.js';
import { exportExcel, genCurrentMonthFirstAndLastDay } from 'util';
export default {
	name: 'refundList',
	data() {
		return {
			REFUND_SEARCH,
			REFUND_COLUMNS,
			searchConfig: {
				applTime: genCurrentMonthFirstAndLastDay(),
				companyCode: null,
				storeCenter: null,
				verifyStatus: null,
			},
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			data: [],
			loading: false,
			pagination: {
				currentPage: 1,
				pageSize: 20,
				total: 0,
			},
		};
	},
	computed: {
		searchDate() {
			let { applTime, companyCode, storeCenter, verifyStatus } = this.searchConfig;
			let applyStartTime = applTime && applTime.length > 0 ? formatDateDefault(applTime[0]) : null;
			let applyEndTime = applTime && applTime.length > 0 ? formatDateDefault(applTime[1]) : null;
			return { companyCode, storeCenter, verifyStatus, applyStartTime, applyEndTime };
		},
	},
	created() {
		this.$listen('REFUNDLIST_LIST', this.loadData);
		this.loadData();
	},
	methods: {
		async getCompanyList() {
			const res = await this.$fetch('/mgmt/inventory/common/getCompanyList');
			if (res && res.data) {
				this.REFUND_SEARCH.form.forEach(e => {
					if (e.key === 'companyCode') {
						e.options = res.data.map(({ code, name }) => ({ value: code, label: name }));
					}
				});
			}
		},
		// 分页触发事件
		handleChangePage(currentPage) {
			this.pagination.currentPage = currentPage;
			this.loadData();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.loadData();
		},
		// 搜索
		search() {
			this.pagination.currentPage = 1;
			this.loadData();
		},
		async loadData(status) {
			let { currentPage: pageNum, pageSize } = this.pagination;
			let params = { ...this.searchDate, pageNum, pageSize };
			if (status) {
				if (this.data.length === 0) {
					this.$message.wraning('请搜索有效的数据导出');
					return;
				}
				exportExcel('/mgmt/inventory/refund/exportList', params);
				return;
			}
			this.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/inventory/refund/allRefundPageList`,
				data: params,
			});
			if (res && res.data) {
				this.data = res.data ? res.data.list : [];
				this.pagination.total = res.data ? res.data.total : 0;
			}
			this.loading = false;
		},
		viewDetail({ id, storeCode }) {
			this.$go('refund_list_detail', { id, storeCode });
		},
	},
};
</script>
