<template>
	<div class="historyDetail">
		<el-table :data="dataSource" border style="width: 100%;">
			<el-table-column type="index" width="50" label="序号"> </el-table-column>
			<el-table-column prop="date" label="修改人" width="180">
			</el-table-column>
			<el-table-column prop="name" label="修改人编号" width="180">
			</el-table-column>
			<el-table-column prop="address" label="修改（申请）时间">
			</el-table-column>
			<el-table-column prop="address" label="类型"> </el-table-column>
			<el-table-column prop="address" label="账户名称"> </el-table-column>
			<el-table-column prop="address" label="开户银行"> </el-table-column>
			<el-table-column prop="address" label="账号"> </el-table-column>
			<el-table-column prop="address" label="账户名称"> </el-table-column>
			<el-table-column prop="address" label="银行省份"> </el-table-column>
			<el-table-column prop="address" label="银行城市"> </el-table-column>
			<el-table-column prop="address" label="开户行名称"> </el-table-column>
			<el-table-column prop="address" label="账户性质"> </el-table-column>
			<el-table-column prop="address" label="账户类型"> </el-table-column>
			<el-table-column prop="address" label="默认账号"> </el-table-column>
			<el-table-column prop="address" label="是否扣款账号"> </el-table-column>
			<el-table-column prop="address" label="审核人"> </el-table-column>
			<el-table-column prop="address" label="审核结果"> </el-table-column>
			<el-table-column prop="address" label="审核时间"> </el-table-column>
		</el-table>
	</div>
</template>

<script>
export default {
	name: 'historyDetail',
	props: {
		dataSource: {
			type: Attr,
		},
	},
	data() {
		return {};
	},
	mounted() {},
	methods: {},
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
