<template>
	<div>
		<el-card>
			<searchPanel :config="BRANCH_LIST_MANAGEMENT_CONFIG" v-model="searchConfig" @search="handleSearch" />
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
					<el-button v-permission="'business_area_scope_detail'" type="text" @click="handleDetail(row.data, 'detail')">
						查看
					</el-button>
					<el-button v-permission="'business_area_scope_edit'" type="text" @click="handleDetail(row.data, 'edit')">
						编辑
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>
<script>
import qs from 'querystring';

import { BRANCH_LIST_MANAGEMENT_CONFIG, BRANCH_LIST_MANAGEMENT_COLUMNS } from './config';
export default {
	name: 'businessAreaScopeList',
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
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.getList();
		},
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
		handleDetail(row, state) {
			const { id } = row;
			let title = state === 'detail' ? '查看业务区域范围' : '编辑业务区域范围';
			this.$go('business_area_scope_detail', { id, title, state });
		},
		// 编辑
		// handleEdit(row) {
		// 	const { id } = row;
		// 	this.$go('business_area_scope_detail', { title: '编辑业务区域范围', id });
		// },
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
