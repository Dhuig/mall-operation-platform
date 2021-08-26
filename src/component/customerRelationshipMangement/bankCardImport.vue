<template>
	<div class="deposit-credit-import">
		<guideBar />
		<el-card class="box-card">
			<el-steps :active="activeNum" align-center>
				<el-step title="下载excel模板" @click.native="batchExport" description="点我下载"></el-step>
				<el-step title="按要求填写excel模板并上传" @click.native="uploadFile" description="点我上传"></el-step>
				<el-step :title="`导入结果：${uploadData}`" description></el-step>
			</el-steps>
		</el-card>
		<el-dialog title="上传" :visible.sync="uploadVisible" width="30%" v-drag>
			<div>
				<el-upload
					class="upload-demo"
					action="/crm/bmemberbank/importProvideBank"
					ref="uploadDom"
					:http-request="uploadCustom"
				>
					<el-button size="medium" type="primary">选择文件</el-button>
				</el-upload>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { TEMPLATE_DOWNLOAD } from './config';
import { exportExcel } from 'util';
export default {
	name: 'bankCardImport',
	data() {
		return {
			TEMPLATE_DOWNLOAD,
			uploadVisible: false,
			activeNum: 1,
			uploadData: '',
		};
	},
	methods: {
		// 导出excel模板
		batchExport() {
			window.open(`https://${TEMPLATE_DOWNLOAD[this.$store.getters['system/getEnv']]}`, '_blank');
		},
		// 上传文件
		uploadFile() {
			this.uploadVisible = true;
			this.activeNum = 2;
		},
		// 自定义上传
		async uploadCustom(file) {
			const data = new FormData();
			data.append('file', file.file);
			const res = await this.$fetch({
				method: 'POST',
				url: '/crm/bmemberbank/importProvideBank',
				data,
			});
			if (res && res.code == 200) {
				this.$message.success('上传成功');
				this.uploadData = '成功';
			} else {
				console.log(res);
				this.$message.error('上传失败');
				this.uploadData = res.data.message;
			}
			this.uploadVisible = false;
			this.activeNum = 3;
		},
		// 导出失败记录
		exportFailLog() {
			exportExcel('/mgmt/inventory/mortgageAmount/exportMortgageAmountCreditFailRecord');
		},
	},
};
</script>
<style lang="scss" scoped>
::v-deep.deposit-credit-import {
	.el-step__description {
		text-decoration: underline;
		cursor: pointer;
	}
}
</style>
