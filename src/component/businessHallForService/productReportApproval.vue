<template>
	<div>
		<guideBar>
			<el-button
				type="primary"
				v-permission="'product_report_approval_export'"
				@click="batchExport"
				icon="el-icon-thumb"
			>
				批量导出
			</el-button>
			<el-button
				type="primary"
				v-permission="'product_report_approval_import'"
				@click="batchImport"
				icon="el-icon-thumb"
			>
				批量导入
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="PRODUCT_RERORT_SEARCH" @search="search" />
		</el-card>
		<el-card>
			<tableList
				:options="options"
				:loading="loading"
				:dataSource="data"
				:columns="PRODUCT_RERORT_COLUMNS"
				:pagination="pagination"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				:dataTotal="pagination.total"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button
						v-permission="'product_report_approval_detail|product_report_detail'"
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
import { PRODUCT_RERORT_SEARCH, PRODUCT_RERORT_COLUMNS } from './config';
import { exportExcel, genCurrentMonthFirstAndLastDay } from 'util';
import { formatDateDefault } from 'util/formValidation.js';
export default {
	name: 'productReportApproval',
	data() {
		return {
			PRODUCT_RERORT_SEARCH,
			PRODUCT_RERORT_COLUMNS,
			searchConfig: {
				companyCode: '',
				codeOrName: null,
				status: 0,
				applyReason: null,
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
			let { registrationTime, codeOrName, status, applyReason, companyCode } = this.searchConfig;
			let applyStartTime =
				registrationTime && registrationTime.length > 0 ? formatDateDefault(registrationTime[0]) : null;
			let applyEndTime =
				registrationTime && registrationTime.length > 0 ? formatDateDefault(registrationTime[1]) : null;
			return { codeOrName, companyCode, applyReason, status: status ? status : 0, applyStartTime, applyEndTime };
		},
	},
	created() {
		this.$listen('DATACHANGELIST', this.loadData);
		this.loadData();
	},
	methods: {
		// 批量导入
		batchImport() {
			this.$go('product_report_import');
		},
		// 批量导出
		batchExport() {
			let { currentPage: pageNum, pageSize } = this.pagination;
			let params = { ...this.searchDate, pageNum, pageSize };
			if (this.data.length === 0) return this.$message.wraning('请搜索有效的数据导出');
			exportExcel('/mgmt/store/productReportApply/exportList', params);
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
		async loadData() {
			let { currentPage: pageNum, pageSize } = this.pagination;
			let params = { ...this.searchDate, pageNum, pageSize };
			this.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/productReportApply/pageList`,
				data: params,
			});
			if (res && res.code == 200) {
				this.data = res.data ? res.data.list : [];
				this.pagination.total = res.data ? res.data.total : 0;
			}
			this.loading = false;
		},
		viewDetail({ storeCode, id }) {
			this.$go('product_report_detail', { storeCode, id });
		},
	},
};
</script>
