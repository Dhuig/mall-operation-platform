<template>
	<div class="deposit-credit-import">
		<guideBar />
		<el-card class="box-card">
			<el-steps :active="activeNum" align-center>
				<el-step title="下载excel模板" @click.native="batchExport" description="点我下载"></el-step>
				<el-step title="按要求填写excel模板并上传" @click.native="uploadFile" description="点我上传"></el-step>
				<el-step
					:title="`导入结果：成功：${uploadData.successCount}条；失败：${uploadData.failCount}条`"
					@click.native="exportFailLog"
					description="导出失败记录"
				></el-step>
			</el-steps>
		</el-card>
		<el-dialog title="上传" :visible.sync="uploadVisible" width="30%" v-drag>
			<div>
				<el-upload
					class="upload-demo"
					action="/mgmt/inventory/mortgageAmount/importMortgageAmountCredit"
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
import { exportExcel } from 'util';
export default {
	name: 'depositCreditImport',
	data() {
		return {
			uploadVisible:false,
			activeNum:1,
			uploadData:{
				failCount:0,
				successCount:0,
			},
		};
	},
	methods:{
	// 导出excel模板
		batchExport() { 
			exportExcel('/mgmt/inventory/mortgageAmount/exportMortgageAmountCreditTemplate');
		},
		// 上传文件
		uploadFile() {
			this.uploadVisible = true;
			this.activeNum = 2;
		},
		// 自定义上传
		async uploadCustom(file) {
			const data = new FormData();
			data.append('excelFile', file.file);
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/inventory/mortgageAmount/importMortgageAmountCredit',
				data,
			});
			if (res && res.code === 200) {
				this.$message.success('上传成功');
				this.uploadData = res.data;
				this.uploadVisible = false;
				this.activeNum = 3;
			} else {
				this.$message.error('上传失败');
			}
		},
		// 导出失败记录
		exportFailLog(){
			exportExcel('/mgmt/inventory/mortgageAmount/exportMortgageAmountCreditFailRecord');
		}
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
