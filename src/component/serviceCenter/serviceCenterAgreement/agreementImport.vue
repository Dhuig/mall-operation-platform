<template>
	<div class="serviceImport">
		<guideBar> </guideBar>
		<el-card class="box-card">
			<el-steps :active="2" align-center>
				<el-step title="下载excel模板" description="点我下载"></el-step>
				<el-step
					title="按要求填写excel模板并上传"
					description="点我上传"
				></el-step>
				<el-step
					title="导入结果：成功：1条；失败：2条"
					description="导出失败记录"
				></el-step>
			</el-steps>
		</el-card>
	</div>
</template>

<script>
export default {
	name: 'serviceAgreementImport',
	data() {
		return {};
	},
	mounted() {},
	methods: {},
};
</script>
<style lang="scss" scoped>
.serviceImport {
	.box-card {
		margin: 24px 0;
	}

	// .el-steps /deep/ .el-step__head.is-finish {
	// 	color: #92d6eb;
	// 	border-color: #92d6eb;
	// }
}
</style>
