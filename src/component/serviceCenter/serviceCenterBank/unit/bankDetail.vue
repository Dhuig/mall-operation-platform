<template>
	<div class="bankDetail">
		<el-table
			ref="multipleTable"
			:data="dataSource"
			border
			style="width: 100%;"
			tooltip-effect="dark"
		>
			<el-table-column type="index" width="50" label="序号"> </el-table-column>
			<el-table-column prop="date" label="账户名称" width="180">
			</el-table-column>
			<el-table-column prop="name" label="开户银行" width="180">
			</el-table-column>
			<el-table-column prop="address" label="账号"> </el-table-column>
			<el-table-column prop="address" label="账号名称"> </el-table-column>
			<el-table-column prop="address" label="银行省份"> </el-table-column>
			<el-table-column prop="address" label="银行城市"> </el-table-column>
			<el-table-column prop="address" label="开户行名称"> </el-table-column>
			<el-table-column prop="address" label="账户性质"> </el-table-column>
			<el-table-column prop="address" label="账户类型"> </el-table-column>
			<el-table-column prop="address" label="默认账号"> </el-table-column>
			<el-table-column prop="address" label="是否扣款账号"> </el-table-column>
			<el-table-column prop="address" label="操作">
				<template slot-scope="scope">
					<el-button
						type="text"
						size="mini"
						@click="handleEdit(scope.$index, scope.row)"
						>修改</el-button
					>
					<el-button
						size="mini"
						type="text"
						@click="handleDelete(scope.$index, scope.row)"
						>删除</el-button
					>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
export default {
	name: 'bankDetail',
	props: {
		dataSource: {
			type: Attr,
		},
	},
	data() {
		return {};
	},
	mounted() {},
	methods: {
		toggleSelection(rows) {
			if (rows) {
				rows.forEach((row) => {
					this.$refs.multipleTable.toggleRowSelection(row);
				});
			} else {
				this.$refs.multipleTable.clearSelection();
			}
		},
		// 修改
		handleEdit() {},
		// 删除
		handleDelete() {},
	},
};
</script>
<style lang="scss" scoped>
.box-card {
	margin: 24px 0;
}
.bankDetail {
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
