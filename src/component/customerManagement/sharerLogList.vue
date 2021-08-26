<template>
	<div>
		<guideBar>
			<el-button type="primary" @click="batchExport">批量导出</el-button>
		</guideBar>
		<el-card style="margin-bottom: 16px;">
			<searchPanel v-model="searchConfig" :config="SHARAER_LOG_SEARCH" @search="search" />
		</el-card>
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="data"
				:columns="SHARAER_LOG_COLUMN"
				:pagination="pagination"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				:dataTotal="total"
			/>
		</el-card>
	</div>
</template>

<script>
import { exportExcel } from 'util';
import { SHARAER_LOG_SEARCH, SHARAER_LOG_COLUMN } from './config';

export default {
	name: 'sharerLogList',
	data() {
		return {
			SHARAER_LOG_SEARCH,
			SHARAER_LOG_COLUMN,
			searchConfig: {
				memberNo: '',
				cardNo: '',
				realname: '',
				mobile: '',
				shareCardNo: '',
				shareRealname: '',
				allotType: 1,
				allotTimeEndStr: '',
				allotTimeStartStr: '',
				allotTimeRange: [],
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
				searchConfig: { allotTimeRange = ['', ''] },
				genDateStr,
			} = this;
			const params = {
				...searchConfig,
				allotTimeStartStr: genDateStr(allotTimeRange[0]),
				allotTimeEndStr: genDateStr(allotTimeRange[1]),
			};
			delete params.allotTimeRange;
			return params;
		},
	},
	methods: {
		// 构造时间字符串 YYYY-MM-DD
		genDateStr(date) {
			if (!date) return '';
			const dateOrigin = new Date(date);
			const year = dateOrigin.getFullYear();
			const month = dateOrigin.getMonth() + 1;
			const day = dateOrigin.getDate();
			const padZero = (number) => String(number).padStart(2, '0');
			return `${year}-${padZero(month)}-${padZero(day)}`;
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
		// 批量导出
		batchExport() {
			const {
				searchFields,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			const params = {
				pageNum,
				pageSize,
				...searchFields,
			};
			exportExcel('/crm/memberShareLog/exportShareLogList', params);
		},
		// 获取
		async loadData() {
			this.loading = true;
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
				url: '/crm/memberShareLog/getShareLogList',
				data,
			});

			if (res && res.data) {
				const { list, total } = res.data;
				if (!list.length) {
					this.$message.warning('搜索无数据，请检查查询条件');
				}
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
