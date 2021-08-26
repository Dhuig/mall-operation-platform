<template>
	<div class="updateUser">
		<breadCrumb />
		<el-card class="box-card">
			<div class="detailMessage">
				<div>
					<span class="newUI label-name">服务中心/公司编号：</span
					><span class="newUI label-content">{{}}</span>
				</div>
				<div>
					<span class="newUI label-name">协议编号：</span
					><span class="newUI label-content">{{}}</span>
				</div>
				<div>
					<span class="newUI label-name">甲方单位：</span
					><span class="newUI label-content">{{}}</span>
				</div>
				<div>
					<span class="newUI label-name">乙方单位名称：</span
					><span class="newUI label-content">{{}}</span>
				</div>
			</div>
		</el-card>
		<el-card class="box-card">
			<el-table :data="recordData" border style="width: 100%;">
				<el-table-column type="index" width="50" label="序号"></el-table-column>
				<el-table-column prop="date" label="操作人" width="180">
				</el-table-column>
				<el-table-column prop="name" label="操作时间" width="180">
				</el-table-column>
				<el-table-column prop="address" label="操作状态"> </el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
export default {
	name: 'contractHandle',
	data() {
		return {
			recordData: [
				{
					date: '2016-05-02',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄',
				},
				{
					date: '2016-05-04',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1517 弄',
				},
				{
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄',
				},
				{
					date: '2016-05-03',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1516 弄',
				},
			],
		};
	},
	mounted() {},
	computed: {},
	methods: {},
};
</script>
<style lang="scss">
.updateUser {
	padding-top: 10px;
	.box-card {
		margin: 24px 0;
		.detailMessage {
			width: 100%;
			border-bottom: 1px solid #ececec;
			padding: 15px 0;
			display: flex;
			flex-wrap: wrap;
			margin-bottom: -8px;
			> div {
				width: 33%;
				font-size: 12px;
				font-family: PingFangSC-Regular;
				font-weight: 400;
				color: rgba(134, 134, 134, 1);
				line-height: 17px;
				margin-bottom: 8px;
			}
		}
	}
}
</style>
