<template>
	<div>
		<guideBar />
		<el-card>
			<el-form :model="logoForm" :rules="rules" ref="logoForm" label-width="120px" class="logo-form">
				<el-form-item label="商城logo名称:" prop="logoName">
					<span v-if="!isEdit">{{ logoForm.logoName }}</span>
					<el-input v-else size="mini" v-model="logoForm.logoName" class="logo-input" clearable />
				</el-form-item>
				<el-form-item label="商城logo:" prop="imageUrl">
					<div v-if="!isEdit">
						<img width="100" :src="logoForm.imageUrl" @click="imageUrlPreview = true" alt="" />
						<el-dialog :visible.sync="imageUrlPreview" v-drag>
							<img width="100%" :src="logoForm.imageUrl" alt="" />
						</el-dialog>
					</div>
					<div v-else>
						<el-upload
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							:limit="1"
							list-type="picture-card"
							:on-preview="handlePictureCardPreview"
							:on-remove="handleRemove"
							:on-success="handleSuccess"
							:file-list="logoList"
							:class="logoList.length === 1 ? 'hide_box' : ''"
							:before-upload="beforeVideoUpload"
						>
							<i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog :visible.sync="dialogVisible" v-drag>
							<img width="100%" :src="dialogImageUrl" alt="" />
						</el-dialog>
						<el-row class="tipTitle">建议图片大小为：200px*200px，支持jpg、png、jpeg等图片格式</el-row>
					</div>
				</el-form-item>
				<el-row type="flex" justify="center" align="center" v-permission="'logo_management_edit'">
					<el-button v-if="!isEdit" type="primary" icon="el-icon-edit-outline" @click="saveEdit">编辑</el-button>
					<el-button v-else type="primary" icon="el-icon-check" @click="saveAndExit">保存</el-button>
				</el-row>
			</el-form>
		</el-card>
	</div>
</template>
<script>
import { uploadFileType } from 'util/formValidation';
export default {
	name: 'logoMangement',
	data() {
		const valiImage = (rule, value, callback) => {
			if (this.logoForm.imageUrl == '') {
				callback(new Error('请上传图片'));
			} else {
				callback();
			}
		};
		return {
			logoForm: {
				imageUrl: '',
				logoName: '',
			},
			dialogVisible: false,
			dialogImageUrl: '',
			imageUrlPreview: false,
			rules: {
				imageUrl: [{ required: true, validator: valiImage, trigger: 'change' }],
				logoName: [
					{ required: true, message: '请输入logo名称', trigger: 'blur' },
					{ min: 0, max: 20, message: '长度在20个字符内', trigger: 'blur' },
				],
			},
			formData: {},
			logoList: [],
			isEdit: false,
		};
	},
	created() {
		this.getLogo();
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.cms,
			};
			return params;
		},
	},
	methods: {
		beforeVideoUpload(file) {
			const whiteList = ['jpg', 'png', 'jpeg'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		// 获取logo
		async getLogo() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/logo/getLogoConfig',
			});
			if (res && res.code == 200) {
				this.logoForm = res.data;
				this.logoList.push({ url: res.data.imageUrl });
			}
		},
		// 删除成功的回调
		handleRemove(file, fileList) {
			this.logoForm.imageUrl = '';
			this.logoList = fileList;
		},
		// 图片预览
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		// 上传成功的回调
		handleSuccess(response, file, fileList) {
			this.logoForm.imageUrl = response.datas.fileUrlKey;
			this.logoList = fileList;
		},
		// 点击编辑
		saveEdit() {
			this.isEdit = !this.isEdit;
		},
		// 保存logo
		async saveAndExit() {
			this.$refs['logoForm'].validate(async valid => {
				if (valid) {
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/cms/logo/saveLogoConfig',
						data: {
							imageUrl: this.logoForm.imageUrl,
							logoName: this.logoForm.logoName,
						},
					});
					if (res) {
						this.$message({
							type: 'success',
							message: res.message,
						});
						setTimeout(() => {
							this.$closeSelf();
						}, 1500);
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
	},
};
</script>
<style lang="scss" scoped>
.logo-input {
	max-width: 350px;
}
.tipTitle {
	color: #8c939b;
}
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
</style>
