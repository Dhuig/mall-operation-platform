<template>
	<div>
		<el-card>
			<h6>产品变更日志</h6>
			<searchPanel v-model="changelogSearch" :config="PRODUCT_DETAIL_CHANGELOG_SEARCH" @search="resetLoad" />
			<tableList
				:columns="PRODUCT_DETAIL_CHANGELOG_COLUMNS"
				:dataSource="change.data"
				@loadMore="loadMore"
				:height="430"
				:pagination="change.pagination"
				:loading="change.loading"
				:dataTotal="change.data.length"
			/>
		</el-card>
	</div>
</template>


<script>
import { PRODUCT_DETAIL_CHANGELOG_SEARCH, PRODUCT_DETAIL_CHANGELOG_COLUMNS, TABITEM } from './config';
import { timeStartFormat, timeEndFormat } from 'util';

export default {
	props: {
		//查询配置项
		params: Object,
	},
	data() {
		return {
			PRODUCT_DETAIL_CHANGELOG_SEARCH,
			PRODUCT_DETAIL_CHANGELOG_COLUMNS,
			change: new TABITEM(),
			// 产品变更日志
			changelogSearch: {
				operator: '',
				timeRange: [],
				chgContent: '',
			},
		};
	},
	computed: {
		// 搜索参数
		changeSearchFields() {
			const {
				changelogSearch: { operator, chgContent, timeRange = ['', ''] },
			} = this;
			return {
				operator,
				chgContent,
				startTime: timeStartFormat(timeRange[0]) || '',
				endTime: timeEndFormat(timeRange[1]) || '',
			};
		},
	},
	methods: {
		timeStartFormat,
		// 下拉刷新
		loadMore() {
			let { currentPage, pageSize } = this.change.pagination;
			if (currentPage * pageSize >= this.change.total) {
				return this.$message.warning('没有更多数据');
			}
			this.change.pagination.currentPage++;
			this.loadChangeList();
		},
		// 重置刷新
		resetLoad() {
			this.change.pagination.currentPage = 1;
			this.change.data = [];
			this.loadChangeList();
		},
		// 查询产品变更日志 api
		async loadChangeList() {
			const {
				params: { versionId },
				params: { productId },
				changeSearchFields,
				change: {
					pagination: { currentPage: pageNum, pageSize },
				},
			} = this;
			const data = {
				versionId,
				productId,
				pageNum,
				pageSize,
				...changeSearchFields,
			};
			this.change.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/product/item/listVerLog',
				data,
			});
			this.change.loading = false;
			if (res && res.data && res.data.list) {
				const { list, total } = res.data;
				this.change.data = this.change.data.concat(list);
				this.change.total = total;
			} else {
				this.$message.warning('查询不到产品变更日志');
			}
		},
	},
	mounted() {
		this.resetLoad();
	},
};
</script>