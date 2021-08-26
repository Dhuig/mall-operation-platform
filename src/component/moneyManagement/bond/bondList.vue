<template>
	<div class="bond-list">
		<guideBar />
		<el-card class="box-card">
			<searchPanel :config="BOND_LIST_CONFIG" @search="handleSearch" @reset="handleReset" />
		</el-card>
		<el-card class="box-card">
			<tableList
				border
				:dataSource="dataSource"
				:columns="BOND_LIST_COLUMNS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="row">
					<span class="btns" @click="handleDetail(row.data)">
						详情
					</span>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { BOND_LIST_CONFIG, BOND_LIST_COLUMNS } from './config';
export default {
	name: 'bondList',
	data() {
		return {
			BOND_LIST_CONFIG,
			BOND_LIST_COLUMNS,
			dataSource: [
				{
					no: '1111111',
					id: '222',
				},
			],
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 200,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
		};
	},
	methods: {
		// 查询事件
		handleSearch(val) {
			console.log('emit handleSearch', val);
		},
		// 重置事件
		handleReset(val) {
			console.log('emit handleReset', val);
		},
		// 分页触发事件
		handleChangePage(val) {
			console.log(`当前页: ${val}`);
		},
		// 分页下拉触发事件
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		handleDetail(row) {
			this.$go('bond_detail', { title: '保证金详情', id: row.id });
		},
	},
};
</script>
<style lang="scss" scoped>
::v-deep.bond-list {
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}
	.el-form-item__label {
		width: 192px !important;
	}
}
</style>
