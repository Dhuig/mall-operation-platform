<template>
	<div class="historyDetail">
		<tableList
			border
			:dataSource="dataSource.list"
			:columns="CHANGE_HISTORY_COLUMUS_CONFIG"
			:pagination="dataSource.pagination"
			:dataTotal="dataSource.total"
			:options="options"
			@handleChangePage="handleChangePage"
			@handleSizeChange="handleSizeChange"
		>
		</tableList>
	</div>
</template>

<script>
import { CHANGE_HISTORY_COLUMUS_CONFIG } from './config';
export default {
	name: 'historyDetail',
	props: {
		dataSource: {
			type: Object,
		},
	},
	data() {
		return {
			CHANGE_HISTORY_COLUMUS_CONFIG,
			options: {
				index: true,
				labelIndex: '序号',
			},
		};
	},
	mounted() {},
	methods: {
		handleChangePage(page) {
			console.log(page);
			this.$dispatch('UPDATE_CHANGE_HISTORY_LIST', { currentPage: page });
		},
		handleSizeChange(pageSize) {
			this.$dispatch('UPDATE_CHANGE_HISTORY_LIST', { currentPage: 1, pageSize });
		},
	},
};
</script>
<style lang="scss" scoped>
.box-card {
	margin: 24px 0;
}
.clerkDetail {
	.title {
		margin-bottom: 30px;
		font-weight: 500;
		color: rgba(48, 51, 54, 1);
	}
	.flex {
		display: flex;
		font-weight: 400;
		font-size: 14px;
		color: rgba(92, 98, 104, 1);
		.label {
			width: 120px;
			text-align: right;
		}
		.content {
			margin-left: 16px;
		}
	}
}
</style>
