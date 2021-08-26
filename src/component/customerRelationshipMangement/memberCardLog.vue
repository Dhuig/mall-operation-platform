<template>
	<div>
		<guideBar>
			<el-button type="primary" @click="batchExport">批量导出</el-button>
		</guideBar>
		<el-card style="margin-bottom: 16px;">
			<searchPanel
				v-model="searchConfig"
				:config="MEMBER_CARD_LOG_SEARCH"
				@search="handleSearch"
				@reset="loadData"
			/>
		</el-card>
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="data"
				:columns="MEMBER_CARD_LOG_COLUMN"
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
import { MEMBER_CARD_LOG_SEARCH, MEMBER_CARD_LOG_COLUMN } from './config';

export default {
	name: 'memberCardLog',
	data() {
		return {
			MEMBER_CARD_LOG_SEARCH,
			MEMBER_CARD_LOG_COLUMN,
			searchConfig: {
				memberNo: '',
				cardNo: '',
				realname: '',
				mobile: '',
				beforeCardStatus: '',
				afterCardStatus: '',
				openCardTimeRange: [],
				transformEndTimeRange: [],
				openCardStartTime: 0,
				openCardEndTime: 0,
				transformStartTime: 0,
				transformEndTime: 0,
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
				searchConfig: { openCardTimeRange = [0, 0], transformEndTimeRange = [0, 0] },
			} = this;
			const params = {
				...searchConfig,
				openCardStartTime: openCardTimeRange[0] || '',
				openCardEndTime: timeEndFormat(openCardTimeRange[1]) || '',
				transformStartTime: transformEndTimeRange[0] || '',
				transformEndTime: timeEndFormat(transformEndTimeRange[1]) || '',
			};
			delete params.openCardTimeRange;
			delete params.transformEndTimeRange;
			return params;
		},
	},
	methods: {
		handleChangePage(currentPage) {
			this.pagination.currentPage = currentPage;
			this.loadData();
		},
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.loadData();
		},
		// 搜索
		handleSearch(){
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
			exportExcel('/crm/memberCardChangeLog/exportList', params);
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
				url: '/crm/memberCardChangeLog/getChangeCardStatusLogList',
				data,
			});

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
