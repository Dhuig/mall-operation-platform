<template>
	<div class="cloud-charge-import">
		<guideBar />
		<el-card class="box-card">
			<el-steps :active="actived" align-center>
				<el-step @click.native="batchExport" title="下载excel模板" description="点我下载"></el-step>
				<el-step title="按要求填写excel模板并上传" description="点我上传" @click.native="openDownDialog"></el-step>
				<el-step :title="failTitle" description="导出失败记录" @click.native="downLoadFail"></el-step>
			</el-steps>
		</el-card>
		<el-dialog title="押货额模板上传" :visible.sync="uploadDialogState" width="30%" @closed="dialogClose" v-drag>
			<div style="display: flex">
				<el-form :model="uploadForm">
					<el-form-item label>
						<el-upload
							ref="uploadForm"
							action
							:multiple="false"
							:file-list="fileList"
							:on-change="handleFileChange"
							:on-remove="handleRemove"
							:http-request="uploadFile"
						>
							<el-button type="primary" class="btn">选取文件</el-button>
							<!-- <br />
							<el-button type="primary" class="btn" :loading="exportLoading" @click="submitUpload">点我上传</el-button>-->
						</el-upload>
					</el-form-item>
				</el-form>
			</div>

			<!-- <div slot="footer">
				<el-button @click="uploadDialogState = false">取 消</el-button>
				<el-button type="primary" @click="uploadDialogState = false">确 定</el-button>
			</div>-->
		</el-dialog>
	</div>
</template>

<script>
import { exportExcel } from 'util';
export default {
	name: 'cloudChargeImport',
	data() {
		return {
			actived: 1,
			//上传excel
			uploadForm: {},
			file: '',
			fileList: [],
			exportLoading: false,
			exportFail: {},
			//dialog
			uploadDialogState: false,
		};
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.stock,
			};
			return params;
		},
	},
	created() {
		this.actived = 1;
		this.failTitle = '导入结果：成功：0条；失败：0条';
	},
	methods: {
		dialogClose() {
			this.fileList = [];
		},
		//下载失败
		downLoadFail() {
			if (this.exportFail && this.exportFail.failCount !== 0) {
				exportExcel('/mgmt/inventory/mortgageAmount/exportMortgageAmountMaxRemitApplyFailRecord');
			} else {
				this.$message({
					type: 'warning',
					message: '导出失败，没有失败的记录',
				});
				return false;
			}
		},
		//批量导入产品（点击下载）
		batchExport() {
			exportExcel('/mgmt/inventory/mortgageAmount/exportMortgageAmountMaxRemitTemplate');
			this.actived = 2;
		},
		openDownDialog() {
			this.uploadDialogState = true;
		},
		//上传文件，获取文件流
		handleFileChange(file) {
			this.file = file.raw;
		},
		handleRemove() {
			this.file = '';
		},
		// 上传
		// submitUpload() {
		// 	if (this.file != '') {
		// 		this.$refs.uploadForm.submit();
		// 	} else {
		// 		this.$message({
		// 			message: '请先选择文件!',
		// 			type: 'warning',
		// 			duration: '2000',
		// 		});
		// 	}
		// },
		// 自定义上传
		async uploadFile() {
			this.exportLoading = true;
			this.showFile = true;
			let obj = {
				failCount: 0,
				successCount: 0,
			};
			// 创建表单对象
			let formData = new FormData();
			// 后端接受参数 ，可以接受多个参数
			formData.append('excelFile', this.file);
			const res = await this.$fetch({
				url: '/mgmt/inventory/mortgageAmount/importMortgageAmountMaxRemitApply',
				method: 'post',
				data: formData,
			});
			if (res) {
				if (res.code == 200) {
					this.$message.success(res.message);
					obj = res.data;
					this.uploadDialogState = false;
				}
				if (res.code == 500) {
					this.$message.error(res.message);
				}
			}
			this.actived = 3;
			this.exportLoading = false;
			this.exportFail = obj;
			this.failTitle = `导入结果：成功：${this.exportFail.successCount}条；失败：${this.exportFail.failCount}条`;
		},
	},
};
</script>
<style lang="scss" scoped>
.cloud-charge-import {
	.box-card {
		margin: 24px 0;
	}
	.el-step {
		cursor: pointer;
	}
}
</style>
