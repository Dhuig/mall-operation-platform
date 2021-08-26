<template>
	<div>
		<guideBar>
			<el-button type="primary" @click="batchExport">批量导出</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="ACCOUNT_MODIFY_SEARCH" @search="search" />
		</el-card>
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="data"
				:columns="ACCOUNT_MODIFY_COLUMN"
				:pagination="pagination"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				:dataTotal="total"
			/>
		</el-card>
	</div>
</template>

<script>
import { exportExcel,timeEndFormat } from 'util';
import { ACCOUNT_MODIFY_SEARCH, ACCOUNT_MODIFY_COLUMN } from './config';
import qs from 'querystring';

export default {
	name: 'accountModifyChangelog',
	data() {
		return {
			ACCOUNT_MODIFY_SEARCH,
			ACCOUNT_MODIFY_COLUMN,
			memberId: '',
			searchConfig: {
				memberNo: '',
				cardNo: '',
				realname: '',
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
			} = this;
			const params = {
				...searchConfig,
				createTimeBegin: allotTimeRange[0] || '',
				createTimeEnd: timeEndFormat(allotTimeRange[1]) || '',
			};
			delete params.allotTimeRange;
			return params;
		},
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
		// 批量导出
		batchExport() {
			const {
				searchFields: { createTimeBegin, createTimeEnd },
				memberId,
			} = this;
			const params = {
				memberId,
				createTimeBegin,
				createTimeEnd,
			};

			exportExcel('/crm/memberModifyLog/export', params);
		},
		// 获取
		async loadData() {
			this.loading = true;
			const {
				searchFields: { createTimeBegin, createTimeEnd },
				memberId,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			const params = {
				pageNum,
				pageSize,
				memberId,
				createTimeBegin,
				createTimeEnd,
			};

			const res = await this.$fetch(`/crm/memberModifyLog/page?${qs.stringify(params)}`);

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
	created() {
		const { memberId, memberNo, cardNo, realname, memberType } = this.$route.query;
		this.memberId = memberId;
		this.ACCOUNT_MODIFY_SEARCH.form[0].value = memberNo;
		this.ACCOUNT_MODIFY_SEARCH.form[1].value = memberType == 1 ? '' : cardNo;
		this.ACCOUNT_MODIFY_SEARCH.form[2].value = realname;
		this.$nextTick(this.loadData);
	},
};
</script>
