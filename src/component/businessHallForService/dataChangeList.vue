<template>
	<div>
		<guideBar>
			<el-button v-permission="'data_change_list_batch_export'" @click="loadData(1)" icon="el-icon-thumb">
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="DATA_CHANGE_SEARCH" @search="search" />
		</el-card>
		<el-card>
			<tableList
				:options="options"
				:loading="loading"
				:dataSource="data"
				:columns="DATA_CHANGE_COLUMNS"
				:pagination="pagination"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				:dataTotal="pagination.total"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button v-permission="'data_change_list_detail'" type="text" @click="viewDetail(scope.data)">
						查看详情
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { DATA_CHANGE_SEARCH, DATA_CHANGE_COLUMNS } from './config';
import { exportExcel, genCurrentMonthFirstAndLastDay } from 'util';
import { formatDateDefault } from 'util/formValidation.js';
export default {
	name: 'dataChangeList',
	data() {
		return {
			DATA_CHANGE_SEARCH,
			DATA_CHANGE_COLUMNS,
			searchConfig: {
				companyCode: '',
				changeType: null,
				storeName: null,
				verifyStatus: null,
				registrationTime: genCurrentMonthFirstAndLastDay(),
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
			let { registrationTime, storeName, changeType, verifyStatus, companyCode } = this.searchConfig;
			let startDate = registrationTime && registrationTime.length > 0 ? formatDateDefault(registrationTime[0]) : null;
			let endDate = registrationTime && registrationTime.length > 0 ? formatDateDefault(registrationTime[1]) : null;
			return { storeName, changeType, verifyStatus, startDate, companyCode, endDate };
		},
	},
	created() {
		this.$listen('DATACHANGELIST', this.loadData);
		this.loadData();
	},
	methods: {
		// 批量导出
		batchExport() {},
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
				exportExcel('/mgmt/store/exportProfileChangeList', params);
				return;
			}
			this.loading = true;
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/store/getProfileChangeList`,
				params,
			});
			if (res && res.code == 200) {
				this.data = res.data ? res.data.list : [];
				this.pagination.total = res.data ? res.data.total : 0;
			}
			this.loading = false;
		},
		viewDetail({ id, profileChangeType, storeCode }) {
			this.$go('data_change_list_detail', { id, profileChangeType, storeCode });
		},
	},
};
</script>
