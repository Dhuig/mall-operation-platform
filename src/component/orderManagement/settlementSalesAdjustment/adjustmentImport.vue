<template>
	<div class="distributionImport">
		<guideBar />
		<el-card class="box-card">
			<el-steps :active="active" align-center>
				<el-step
					title="下载excel模板"
					description="点我下载"
					@click.native="downloadTemplate"
					class="text-decoration"
				></el-step>
				<el-step
					title="按要求填写excel模板并上传"
					description="点我上传"
					@click.native="uploadVisible = true"
				></el-step>
				<el-step
					:title="`导入结果：成功：${count.succNum}条；失败：${count.failNum}条`"
					description="导出失败记录"
					@click.native="exportFailLog"
				></el-step>
			</el-steps>
		</el-card>
		<el-dialog title="上传提示" :visible.sync="uploadVisible" width="500px">
			<el-upload
				ref="upload"
				action="/mgmt/inventory/distribution/importStoreDistribution"
				:http-request="uploadCustom"
			>
				<el-button type="primary">选择文件</el-button>
			</el-upload>
		</el-dialog>
	</div>
</template>

<script>
import { exportExcel } from 'util';
export default {
	name: 'adjustmentImport',
	data() {
		return {
			active: 0,
			count: { failNum: 0, succNum: 0, failUrl: null },
			uploadVisible: false,
		};
	},
	mounted() {},
	methods: {
		// 下载模板
		downloadTemplate() {
			exportExcel(`/auth/adjustment/permission/getImportTemplate`);
			this.active = 1;
		},
		// 自定义上传
		async uploadCustom(params) {
			const data = new FormData();
			data.append('file', params.file);
			const res = await this.$fetch({
				method: 'POST',
				url: '/auth/adjustment/permission/import',
				data,
			});
			this.active = 2;
			if (res?.code === 200) {
				this.active = 3;
				this.$message.success('上传成功');
				this.clear();
				this.count = res.data;
			} else {
				// this.$message.error('上传失败');
				this.active = 3;
				this.clear();
				this.count = res.data.data;
			}
		},
		// 导出失败记录
		exportFailLog() {
			if (this.active == 3 && this.count.failUrl) {
				window.open(this.count.failUrl);
			} else {
				this.$message.warning('还没有导入的结果或者没有失败记录');
			}
		},
		// 关闭弹窗并清空记录
		clear() {
			this.uploadVisible = false;
			this.$refs.upload.clearFiles();
		},
	},
};
</script>
<style lang="scss" scoped>
::v-deep.distributionImport {
	.el-step__description {
		text-decoration: underline;
		cursor: pointer;
	}
}
</style>
