<template>
	<div>
		<guideBar>
			<el-button
				v-permission="'other_approval_list_batch_export'"
				type="primary"
				@click="loadData(1)"
				icon="el-icon-document-copy"
			>
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="OTHER_APPROVAL_SEARCH" @search="search" />
		</el-card>
		<el-card>
			<tableList
				:options="options"
				:loading="loading"
				:dataSource="data"
				:columns="OTHER_APPROVAL_COLUMNS"
				:pagination="pagination"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				:dataTotal="pagination.total"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button
						v-permission="'other_approval_list_detail|other_approval_list_detail'"
						type="text"
						@click="viewDetail(scope.data)"
					>
						查看详情
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { OTHER_APPROVAL_SEARCH, OTHER_APPROVAL_COLUMNS } from './config';
import { genCurrentMonthFirstAndLastDay, exportExcel } from 'util';
import { formatDateDefault } from 'util/formValidation.js';
import qs from 'querystring';
export default {
	name: 'otherApprovalList',
	data() {
		return {
			OTHER_APPROVAL_SEARCH,
			OTHER_APPROVAL_COLUMNS,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			searchConfig: {
				companyName: null,
				storeCode: null,
				auditStatus: null,
				registrationTime: genCurrentMonthFirstAndLastDay(),
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
			let { registrationTime, storeCode, companyName, auditStatus } = this.searchConfig;
			let startTime = registrationTime && registrationTime.length > 0 ? formatDateDefault(registrationTime[0]) : null;
			let endTime = registrationTime && registrationTime.length > 0 ? formatDateDefault(registrationTime[1]) : null;
			return { storeCode, companyName, auditStatus, startTime, endTime };
		},
	},
	created() {
		this.loadData();
		this.$listen('QITASHENPI_LIST', this.loadData);
	},
	methods: {
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
				exportExcel('/mgmt/store/other/exportStoreOtherList', params);
				return;
			}
			this.loading = true;
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/store/other/getOtherInfoList?${qs.stringify(params)}`,
			});
			if (res && res.code == 200) {
				this.data = res.data ? res.data.list : [];
				this.pagination.total = res.data ? res.data.total : 0;
			}
			this.loading = false;
		},
		viewDetail({ id, storeCode }) {
			this.$go('other_approval_list_detail', { id, storeCode });
		},
	},
};
</script>
