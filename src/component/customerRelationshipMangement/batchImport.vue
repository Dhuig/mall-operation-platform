<template>
	<div>
		<guideBar />
		<el-card class="box-card">
			<el-steps :active="2" align-center>
				<el-step title="下载excel模板" description="点我下载" />
				<el-step title="按要求填写excel模板并上传" description="点我上传" />
				<el-step title="导入结果：成功：1条；失败：2条" description="导出失败记录" />
			</el-steps>
		</el-card>
	</div>
</template>

<script>
export default {
	name: 'batchImport',
	data() {
		return {};
	},
	mounted() {},
	methods: {},
};
</script>
