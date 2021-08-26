<template>
	<div>
		<guideBar>
			<el-button
				type="success"
				plain
				icon="el-icon-download"
				v-permission="'system_operation_log_export'"
				@click="exportWholeOperateLogs"
			>
				导出所有操作日志
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="OPERATION_LOG_SEARCH" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="data"
				:columns="OPERATION_LOG_COLUMN"
				:pagination="pagination"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				:dataTotal="total"
			/>
		</el-card>
	</div>
</template>

<script>
import { OPERATION_LOG_SEARCH, OPERATION_LOG_COLUMN } from './config';
import { timeStartFormat, timeEndFormat } from '@/util';
import qs from 'querystring';

export default {
	name: 'systemOperationLog',
	data() {
		return {
			OPERATION_LOG_SEARCH,
			OPERATION_LOG_COLUMN,
			searchConfig: {
				operator: '',
				logTimeRange: '',
				startTime: '',
				endTime: '',
			},
			loading: false,
			data: [],
			pagination: {
				currentPage: 1,
				pageSize: 20,
			},
			total: 0,
		};
	},
	computed: {
		// 搜索参数
		searchFields() {
			const {
				searchConfig,
				searchConfig: { logTimeRange = [0, 0] },
			} = this;
			const params = {
				...searchConfig,
				startTime: timeStartFormat(logTimeRange[0]),
				endTime: timeEndFormat(logTimeRange[1]),
			};
			delete params.logTimeRange;
			return params;
		},
	},
	methods: {
		async exportWholeOperateLogs() {
			const {
				searchFields,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			const data = {
				pageNum,
				pageSize,
				...searchFields,
			};

			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/common/log/export',
				data,
			});

			if (res && res.code == 200) {
				this.$message.success('excel表格正在生成中，请在下载管理查看');
			} else {
				this.$message.warning('操作失败');
			}
		},
		handleChangePage(currentPage) {
			this.pagination.currentPage = currentPage;
			this.loadData();
		},
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.loadData();
		},
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
		},
		// 获取
		async loadData() {
			// this.loading = true;
			const {
				searchFields,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			const data = {
				pageNum,
				pageSize,
				...searchFields,
			};
			const res = await this.$fetch(`/common/mall/log/query?${qs.stringify(data)}`);
			if (res && res.data) {
				const { list, total } = res.data;
				this.data = list;
				this.total = total;
			} else {
				this.data = [];
				this.total = 0;
			}
			this.loading = false;
		},
	},
	mounted() {
		this.$nextTick(this.loadData);
	},
};
</script>
