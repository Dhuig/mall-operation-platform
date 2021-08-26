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
				<el-step title="按要求填写excel模板并上传" description="点我上传" @click.native="uploadFile"></el-step>
				<el-step
					:title="`导入结果：成功：${count.successCount}条；失败：${count.failCount}条`"
					description="导出失败记录"
					@click.native="exportFailLog"
				></el-step>
			</el-steps>
		</el-card>
		<el-dialog title="上传提示" :visible.sync="uploadVisible" width="500px">
			<el-upload
				ref="uploadDom"
				action="/mgmt/inventory/distribution/importStoreDistribution"
				:http-request="uploadCustom"
				><el-button type="primary">选择文件</el-button></el-upload
			>
		</el-dialog>
	</div>
</template>

<script>
import { exportExcel } from 'util';
export default {
	name: 'distributionImport',
	data() {
		return {
			active: 0,
			count: { failCount: 0, successCount: 0 },
			uploadVisible: false,
		};
	},
	mounted() {},
	methods: {
		// 下载模板
		downloadTemplate() {
			exportExcel(`/mgmt/inventory/distribution/exportStoreDistributionTemplate`);
			this.active = 1;
		},
		// 上传文件
		uploadFile() {
			this.uploadVisible = true;
			this.active = 2;
		},
		// 自定义上传
		async uploadCustom(file) {
			console.log(123, file);
			const data = new FormData();
			data.append('excelFile', file.file);
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/inventory/distribution/importStoreDistribution',
				data,
			});
			if (res && res.code === 200) {
				this.$message.success('上传成功');
				this.count = res.data;
				this.uploadVisible = false;
				this.active = 3;
			} else {
				this.$message.error('上传失败');
			}
		},
		// 导出失败记录
		exportFailLog() {
			exportExcel(`/mgmt/inventory/distribution/exportStoreDistributionFailRecord`);
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
