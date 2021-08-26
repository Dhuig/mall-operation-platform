<template>
	<div>
		<guideBar>
			<el-button
				v-permission="'company_certificate_approval_List_batch_export'"
				type="primary"
				@click="loadData(1)"
				icon="el-icon-document-copy"
			>
				批量导出
			</el-button>
			<el-button
				type="primary"
				v-permission="'company_certificate_approval_List_batch_import'"
				@click="goImport"
				icon="el-icon-document-copy"
			>
				批量导入
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="COMPANY_CERTIFICATE_SEARCH" @search="search" />
		</el-card>
		<el-card>
			<tableList
				:options="options"
				:loading="loading"
				:dataSource="data"
				:columns="COMPANY_CERTIFICATE_COLUMNS"
				:pagination="pagination"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				:dataTotal="pagination.total"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button
						v-permission="'company_certificate_approval_List_detail|company_certificate_detail'"
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
import { COMPANY_CERTIFICATE_SEARCH, COMPANY_CERTIFICATE_COLUMNS } from './config';
import { formatDateDefault } from 'util/formValidation.js';
import { genCurrentMonthFirstAndLastDay } from 'util';
import { exportExcel } from 'util';
export default {
	name: 'companyCertificateApprovalList',
	data() {
		return {
			COMPANY_CERTIFICATE_SEARCH,
			COMPANY_CERTIFICATE_COLUMNS,
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
			searchConfig: {
				applyReason: '',
				companyCode: '',
				storeStr: null,
				auditStatus: null,
				registrationTime: genCurrentMonthFirstAndLastDay(),
			},
		};
	},
	computed: {
		searchDate() {
			let { registrationTime, storeStr, auditStatus, applyReason, companyCode } = this.searchConfig;
			let startTime = registrationTime && registrationTime.length > 0 ? formatDateDefault(registrationTime[0]) : null;
			let endTime = registrationTime && registrationTime.length > 0 ? formatDateDefault(registrationTime[1]) : null;
			return { storeStr, auditStatus, startTime, endTime, applyReason, companyCode };
		},
	},
	created() {
		this.$listen('ZHENGJIANBAOSHENPI_LIST', this.loadData);
		this.loadData();
	},
	methods: {
		goImport() {
			this.$go('company_certificate_import');
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
				exportExcel('/mgmt/sys/store/certificate/export', params);
				return;
			}
			this.loading = true;
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/sys/store/certificate/list`,
				params,
			});
			if (res && res.code == 200) {
				this.data = res.data ? res.data.list : [];
				this.pagination.total = res.data ? res.data.total : 0;
			}
			this.loading = false;
		},
		viewDetail({ id, storeCode }) {
			this.$go('company_certificate_detail', { id, storeCode });
		},
	},
};
</script>
