<template>
	<div>
		<guideBar>
			<el-button v-permission="'branch_list_add'" type="primary" @click="addCompany">添加公司</el-button>
			<el-button v-permission="'branch_list_export_excel'" type="primary" @click="handleExport">导出Excel</el-button>
		</guideBar>
		<el-card>
			<searchPanel :config="BRANCH_LIST_MANAGEMENT_CONFIG" v-model="searchConfig" @search="getList" />
		</el-card>
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="dataSource"
				:columns="BRANCH_LIST_MANAGEMENT_COLUMNS"
				:pagination="pagination"
				:dataTotal="total"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="row">
					<el-button v-permission="'branch_list_detail|branch_detail'" type="text" @click="handleDetail(row.data)">
						查看详情
					</el-button>
					<el-button v-permission="'branch_list_edit'" type="text" @click="handleEdit(row.data)">编辑</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>
<script>
import qs from 'querystring';

import { BRANCH_LIST_MANAGEMENT_CONFIG, BRANCH_LIST_MANAGEMENT_COLUMNS } from './config';
import { exportExcel } from 'util';
export default {
	name: 'branchList',
	data() {
		return {
			BRANCH_LIST_MANAGEMENT_CONFIG,
			BRANCH_LIST_MANAGEMENT_COLUMNS,
			loading: false,
			searchConfig: {
				companyCode: '',
				principal: '',
			},
			dataSource: [],
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			total: 0,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
		};
	},
	methods: {
		// 分页触发事件
		handleChangePage(val) {
			this.pagination.currentPage = val;
			this.getList();
		},
		// 分页下拉触发事件
		handleSizeChange(val) {
			this.pagination.pageSize = val;
			this.getList();
		},
		// 查看详情
		handleDetail(row) {
			const { id } = row;
			this.$go('branch_detail', { id });
		},
		// 编辑
		handleEdit(row) {
			const { id } = row;
			this.$go('update_branch', { title: '编辑分公司', id });
		},
		// 添加公司
		addCompany() {
			this.$go('update_branch', { title: '新增分公司' });
		},
		// 导出excel
		handleExport() {
			exportExcel('/mgmt/sys/exportCompany', { ...this.searchConfig });
		},
		// 请求数据
		async getList() {
			this.loading = true;
			const {
				pagination: { currentPage: pageNum, pageSize },
				searchConfig,
			} = this;

			const params = {
				pageNum,
				pageSize,
				...searchConfig,
			};
			const res = await this.$fetch(`/mgmt/sys/getComByCodeOrPri?${qs.stringify(params)}`);

			if (res.code === 200) {
				const { list, total } = res.data;
				this.dataSource = list;
				this.total = total;
			} else {
				this.dataSource = [];
				this.total = 0;
			}
			this.loading = false;
		},
	},
	created() {
		this.getList();
		this.$listen('UP_LIST', this.getList);
	},
};
</script>
