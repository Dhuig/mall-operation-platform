<template>
	<div>
		<el-card class="card-gap" v-if="centerDialogVisible">
			<div class="title-text">消息审核</div>
			<el-row type="flex" class="form-width-protect">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="消息名称：">{{ detail.msgTitle }}</el-form-item>
					<el-form-item label="审核结果：" prop="auditStatus">
						<el-radio-group v-model="ruleForm.auditStatus" required>
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
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							list-type="picture-card"
							:on-preview="handlePictureCardPreview"
							:on-remove="handleRemove"
							:data="uploadData"
							:on-success="handleChange"
							:on-error="onError"
							:multiple="true"
							:limit="3"
							:before-upload="beforeVideoUpload"
							accept="doc,docx,pdf,wps,bmp,jpg,png"
						>
							<i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog :visible.sync="dialogVisible" v-drag>
							<img width="100%" :src="dialogImageUrl" alt />
						</el-dialog>
					</el-form-item>
				</el-form>
			</el-row>
		</el-card>
		<el-card class="card-gap" v-else>
			<div class="succCon">
				<div class="icon_tip">
					<i class="el-icon-success font_set"></i>
					<p>提交成功</p>
					<p>提交成功，等待审核完成</p>
				</div>
				<div class="btn_list">
					<el-button type="primary" @click="goList">返回列表</el-button>
					<el-button @click="goDetail">查看详情</el-button>
				</div>
			</div>
		</el-card>
		<actionBar>
			<template>
				<el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
				<el-button plain @click="$closeSelf()">取消</el-button>
			</template>
		</actionBar>
	</div>
</template>

<script>
import { uploadFileType } from 'util/formValidation';
export default {
	name: 'messageReview',
	data() {
		return {
			dialogImageUrl: '',
			centerDialogVisible: true,
			dialogVisible: false,
			detail: {},
			ruleForm: {
				auditStatus: 1,
				auditOpinion: '',
				planCode: '',
				auditOperatorId: 15,
				auditOperator: '',
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
		goList() {
			this.$go('manual_message_management');
			this.$closeOldPage();
		},
		goDetail() {
			let { type, id } = this.$route.query;
			this.$go(type, { id });
			this.$closeOldPage();
		},
		handleChange(response, file) {
			if (response.success)
				this.ruleForm.files.push({ receiverUrl: response.datas.fileUrlKey, receiverName: file.name });
		},
		async loadDate() {
			const res = await this.$fetch(`/mgmt/msgadmin/handmade/details?planCode=${this.$route.query.id}`);
			if (res.code === 200) {
				this.detail = res.data;
			}
		},
		async submitForm() {
			this.$refs['ruleForm'].validate(async valid => {
				if (valid) {
					this.ruleForm.planCode = this.$route.query.id;
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/msgadmin/handmade/audit`,
						data: this.ruleForm,
					});
					if (res && res.code === 200) {
						this.centerDialogVisible = false;
						this.$dispatch('MANUAL_MESSAGE_MANAGEMENT_LIST');
						this.$dispatch('MANUAL_MESSAGE_MANAGEMENT_DETILE');
						this.$dispatch('MANUAL_MESSAGE_MANAGEMENT_GET_DSH');
						this.$dispatch('MESSGE_TEMPLATE_MANAGEMENT');
					}
				} else {
					return false;
				}
			});
		},
		onError() {
			this.$message.error('上传图片失败');
		},
		beforeVideoUpload(file) {
			const whiteList = ['doc', 'docx', 'pdf', 'wps', 'bmp', 'jpg', 'png', 'jpeg'];
			return uploadFileType.bind(this, file, whiteList, 10)();
		},
		handleRemove() {},
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
.eidt-btn-footer {
	padding: 16px 38px;
	box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.2);
	position: fixed;
	bottom: 0;
	left: 264px;
	right: 0;
	.eidt-btn-footer-box {
		text-align: right;
		.el-button--default {
			background: rgba(255, 255, 255, 1);
			border-radius: 4px;
			border: 1px solid rgba(211, 217, 226, 1);
			color: #303336;
			font-size: 14px;
		}
		.el-button--primary {
			background: rgba(56, 131, 248, 1);
			border-radius: 2px;
			color: #fff;
			font-size: 14px;
		}
		button {
			padding: 9px 16px;
		}
	}
}

.succCon {
	min-height: 600px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	.icon_tip {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		font-family: 'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC', sans-serif;

		p:nth-of-type(1) {
			font-weight: 650;
			font-style: normal;
			font-size: 24px;
			color: rgba(0, 0, 0, 0.847058823529412);
			text-align: center;
			line-height: 32px;
			margin-bottom: 20px;
		}
		p:nth-of-type(2) {
			font-weight: 400;
			font-style: normal;
			color: rgba(0, 0, 0, 0.447058823529412);
			text-align: center;
			line-height: 22px;
			margin-bottom: 30px;
		}
		.font_set {
			font-size: 100px;
			color: #52c41a;
			margin-bottom: 20px;
		}
	}
}
</style>
