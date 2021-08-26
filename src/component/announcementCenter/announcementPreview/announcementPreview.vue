<template>
	<div>
		<el-card class="card-gap">
			<div class="title-text">公告审核</div>
			<el-row type="flex" class="form-width-protect">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="消息名称：">{{ detail.title }}</el-form-item>
					<el-form-item label="审核结果：" prop="auditResult">
						<el-radio-group v-model="ruleForm.auditResult" required>
							<el-radio :label="1">审核通过</el-radio>
							<el-radio :label="2">审核不通过</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="审核意见：" prop="auditOpinion">
						<el-input type="textarea" v-model="ruleForm.auditOpinion" placeholder="请输入审核意见"></el-input>
					</el-form-item>
					<el-form-item label="附件：">
						<span>支持格式doc、docx、pdf、wps、bmp、jpg、png，最大10M，3个文件</span>
					</el-form-item>
					<el-form-item label>
						<el-upload
							:class="[ruleForm.files.length == 3 ? 'is-upload' : '']"
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							list-type="picture-card"
							:on-preview="handlePictureCardPreview"
							:data="uploadData"
							:on-success="handleChange"
							:before-remove="handleRemove"
							:before-upload="beforeVideoUpload"
							multiple
							:limit="3"
							:on-exceed="onError"
							name="file"
							accept="doc, docx, pdf, wps, bmp, jpg, png"
						>
							<i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog v-drag :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl" alt />
						</el-dialog>
					</el-form-item>
				</el-form>
			</el-row>
		</el-card>
		<actionBar>
			<template>
				<el-button type="primary" @click="submitForm">保存</el-button>
				<el-button plain @click="$closeSelf()">取消</el-button>
			</template>
		</actionBar>
		<el-dialog v-drag title="提示" :visible.sync="centerDialogVisible" width="30%" center>
			<div class="save-class">
				<div class="icon">
					<i v-if="submitObj.messge == '提交成功'" class="el-icon-success icon-textsss"></i>
					<i v-else class="el-icon-success icon-textes"></i>
				</div>
				<div>{{ submitObj.messge }}</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="goList">返回列表</el-button>
				<el-button @click="goDetail">{{ submitObj.btnMsg }}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { uploadFileType } from 'util/formValidation';
export default {
	name: 'announcementPreview',
	data() {
		return {
			dialogImageUrl: '',
			centerDialogVisible: false,
			dialogVisible: false,
			submitObj: {
				messge: '提交成功',
				btnMsg: '查看详情',
			},
			detail: {},
			ruleForm: {
				id: null,
				auditResult: 1,
				auditOpinion: '',
				files: [],
			},
			rules: {
				auditOpinion: [{ required: true, message: '请填写审核意见', trigger: 'blur' }],
				auditStatus: [{ required: true, message: '请填写审核意见', trigger: 'blur' }],
			},
		};
	},
	created() {
		this.loadDate();
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.msgnotice,
			};
			return params;
		},
	},
	methods: {
		beforeVideoUpload(file) {
			const whiteList = ['doc', 'docx', 'pdf', 'wps', 'bmp', 'jpg', 'png'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		onError() {
			this.$message.warning('只能上传3个文件');
		},
		handleChange(response, file) {
			if (response.success)
				this.ruleForm.files.push({ receiverUrl: response.datas.fileUrlKey, receiverName: file.name });
		},
		async loadDate() {
			const res = await this.$fetch(`/msgadmin/mgmt/msg/notice/getNoticeById?id=${this.$route.query.id}`);
			if (res.code === 200) this.detail = res.data;
		},
		goList() {
			this.centerDialogVisible = false;
			this.$go('announcement_management');
			this.$closeOldPage();
		},
		goDetail() {
			if (this.submitObj.btnMsg == '查看详情') {
				this.centerDialogVisible = false;
				this.$go('announcement_detail', { id: this.$route.query.id });
				this.$closeOldPage();
			} else {
				this.submitForm();
			}
		},
		async submitForm() {
			this.$refs['ruleForm'].validate(async valid => {
				if (valid) {
					this.ruleForm.id = this.$route.query.id;
					const res = await this.$fetch({
						method: 'POST',
						url: `/msgadmin/mgmt/msg/notice/doNoticeAudit`,
						data: this.ruleForm,
					});
					if (res && res.code == 200) {
						if (!this.centerDialogVisible) this.centerDialogVisible = true;
						this.$dispatch('ANNOUNCEMENT_MANAGEMENT');
						this.$dispatch('ANNOUNCEMENT_MANAGEMENT_GETDSH');
						this.submitObj.messge = res.code === 200 ? '提交成功' : '提交失败';
						this.submitObj.btnMsg = res.code === 200 ? '查看详情' : '重新提交';
					}
				}
			});
		},
		handleRemove(file) {
			this.ruleForm.files.forEach((e, index) => {
				if (e.receiverName === file.name) this.ruleForm.files.splice(index, 1);
			});
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
	},
};
</script>

<style lang="scss" scoped>
.card-gap {
	margin-top: 20px;
	.title-text {
		padding: 20px;
		padding-top: 0;
		margin-bottom: 20px;
		border-bottom: 1px solid $color-border;
	}
}
.save-class {
	margin-top: 40px;
	height: 150px;
	text-align: center;
	box-sizing: border-box;
	.icon {
		margin-bottom: 20px;
		color: $success;
		.icon-textsss {
			font-size: 50px;
			color: $success;
		}
		.icon-textes {
			font-size: 50px;
			color: $warning;
		}
	}
}
.is-upload ::v-deep .el-upload--picture-card {
	display: none; /* 上传按钮隐藏 */
}
</style>
