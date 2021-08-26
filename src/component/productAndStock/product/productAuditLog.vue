<template>
	<div>
		<el-card>
			<h6>审核日志</h6>
			<searchPanel v-model="checkSearch" :config="PRODUCT_DETAIL_VALIDATE_SEARCH" @search="resetLoad" />
			<tableList
				:columns="PRODUCT_DETAIL_VALIDATE_COLUMNS"
				:dataSource="validate.data"
				@loadMore="loadMore"
				:height="430"
				:pagination="validate.pagination"
				:loading="validate.loading"
				:dataTotal="validate.data.length"
			/>
		</el-card>
	</div>
</template>


<script>
import { PRODUCT_DETAIL_VALIDATE_SEARCH, PRODUCT_DETAIL_VALIDATE_COLUMNS, TABITEM } from './config';
import { timeStartFormat, timeEndFormat } from 'util';

export default {
	props: {
		//查询配置项
		params: Object,
	},
	data() {
		return {
			PRODUCT_DETAIL_VALIDATE_SEARCH,
			PRODUCT_DETAIL_VALIDATE_COLUMNS,
			validate: new TABITEM(),
			// 审核日志
			checkSearch: {
				operator: '',
				auditTypeResult: '',
				timeRange: [],
			},
		};
	},
	computed: {
		// 搜索参数
		checkSearchFields() {
			const {
				checkSearch: { operator, auditTypeResult, timeRange = ['', ''] },
			} = this;
			return {
				operator,
				auditTypeResult,
				startTime: timeStartFormat(timeRange[0]) || '',
				endTime: timeEndFormat(timeRange[1]) || '',
			};
		},
	},
	methods: {
		timeStartFormat,
		// 下拉刷新
		loadMore() {
			let { currentPage, pageSize } = this.validate.pagination;
			if (currentPage * pageSize >= this.validate.total) {
				return this.$message.warning('没有更多数据');
			}
			this.validate.pagination.currentPage++;
			this.loadCheckList();
		},
		// 重置刷新
		resetLoad() {
			this.validate.pagination.currentPage = 1;
			this.validate.data = [];
			this.loadCheckList();
		},
		// 查询审核日志 api
		async loadCheckList() {
			const {
				params: { versionId },
				params: { productId },
				checkSearchFields,

				validate: {
					pagination: { currentPage: pageNum, pageSize },
				},
			} = this;
			const data = {
				versionId,
				productId,
				pageNum,
				pageSize,
				...checkSearchFields,
			};
			this.validate.loading = true;

			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/product/ctrl/listAuditLog',
				data,
			});
			this.validate.loading = false;

			if (res && res.data && res.data.list) {
				const { list, total } = res.data;
				this.validate.data = this.validate.data.concat(list);
				this.validate.total = total;
			} else {
				this.$message.warning('查询不到审核日志');
			}
		},
	},
	mounted() {
		this.resetLoad(); // 获取审核日志
	},
};
</script>