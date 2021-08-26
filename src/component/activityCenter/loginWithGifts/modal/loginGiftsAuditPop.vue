<template>
	<div>
		<el-dialog v-drag title="活动审核" :visible.sync="visible" width="700px">
			<el-form
				ref="auditForm"
				:model="auditForm"
				:rules="LOGIN_GIFTS_LIST_AUDIT_FORM_RULES"
				label-suffix=":"
				label-width="100px"
			>
				<el-row>
					<!-- <el-col :span="12">
						<el-form-item label="活动编号">{{ auditForm.number }}</el-form-item>
					</el-col> -->
					<el-col :span="12">
						<el-form-item label="活动名称">{{ auditForm.activityName }}</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="审核结果" prop="examine">
					<el-radio-group v-model="auditForm.examine">
						<el-radio :label="3">审核通过</el-radio>
						<el-radio :label="4">审核不通过</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="审核意见" prop="remarks">
					<el-input type="textarea" v-model="auditForm.remarks" placeholder="请输入审核意见"></el-input>
				</el-form-item>
				<el-form-item label="附件" prop="attachments">
					<div>支持格式doc、docx、pdf、wps、bmp、jpg、png，最大10M，3个文件</div>
					<el-upload
						ref="upload-demo"
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemove"
						:on-success="handleSuccess"
						:before-upload="beforeVideoUpload"
						:class="auditForm.attachments.length == 3 ? 'hide_box' : ''"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="end">
				<el-button @click="auditCancel('auditForm')">取消</el-button>
				<el-button type="primary" @click="auditSave('auditForm')">保存</el-button>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import { LOGIN_GIFTS_LIST_AUDIT_FORM_RULES } from '../config';
import { uploadFileType } from 'util/formValidation';
export default {
	name: 'loginGiftsAuditPop',
	props: {
		visible: Boolean,
		baseInfo: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			LOGIN_GIFTS_LIST_AUDIT_FORM_RULES,
			auditForm: {
				attachments: [],
			}, //审核form
		};
	},
	watch: {
		baseInfo: {
			handler(data) {
				this.auditForm = { ...this.auditForm, ...data };
			},
		},
	},
	computed: {
		// 上传data
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			};
			return params;
		},
	},
	methods: {
		// 图片上传验证
		beforeVideoUpload(file) {
			const whiteList = ['doc', 'docx', 'pdf', 'wps', 'bmp', 'jpg', 'png'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		// 图片预览
		handlePictureCardPreview(file) {
			this.dialogVisible = true;
			this.dialogImageUrl = file.url;
		},
		// 图片删除
		handleRemove(file) {
			const { name } = file;
			this.auditForm.attachments = this.auditForm.attachments.filter(({ fileName }) => fileName != name);
		},
		// 图片上传成功
		handleSuccess(response, file, fileList) {
			this.auditForm.attachments = fileList.map(item => {
				return {
					fileName: item?.name,
					url: item?.response?.datas?.fileUrlKey,
				};
			});
		},
		// 审核 取消
		auditCancel(formName) {
			this.$refs[formName].resetFields();
			this.$emit('cancel');
			this.$refs['upload-demo'].clearFiles();
		},
		// 审核 保存
		auditSave(formName) {
			const data = {
				...this.auditForm,
				...this.baseInfo,
			};
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/prmt/loginGift/examineLoginGift',
						data,
					});
					if (res && res.code == 200) {
						this.$message.success('操作成功');
						this.$dispatch('UPDATE_LOGIN_WITH_GIFTS_LIST');
						this.auditCancel(formName);
						this.$emit('success');
					} else {
						this.$message.error('操作失败');
					}
				}
			});
		},
	},
};
</script>

<style>
</style>