<template>
	<div class="upload-image-group">
		<el-upload
			:action="$store.getters['system/getOssUploadUrl']"
			:headers="$store.getters['system/getSignatureVerification']"
			:data="uploadParams"
			:limit="limit"
			list-type="picture-card"
			:before-upload="beforeAvatarUpload"
			:on-preview="handlePreview"
			:on-remove="handleRemove"
			:on-success="handleSuccess"
			:file-list="fileList"
			:class="fileList.length === limit ? 'hide_box' : ''"
		>
			<i class="el-icon-plus"></i>
		</el-upload>
		<el-dialog :visible.sync="dialogVisible">
			<img width="100%" :src="dialogImageUrl" alt="" />
		</el-dialog>
		<span class="tipTitle">{{ tips || '只支持通用的bmp、jpg、png图片上传，最大文件支持4M' }}</span>
	</div>
</template>

<script>
import { uploadFileType } from 'util/formValidation';
export default {
	name: 'uploadImage',
	props: {
		value: String,
		tips: String, //底部文字提示
		limit: {
			// 限制图片数（暂不支持）
			type: Number,
			default: 1,
		},
	},
	data() {
		return {
			fileList: [], // 文件列表
			dialogVisible: false, //预览弹窗状态
			dialogImageUrl: '', //预览图片地址
		};
	},
	watch: {
		dialogImageUrl: {
			handler(url) {
				this.$emit('input', url);
			},
		},
		value(data) {
			if (data) {
				this.dialogImageUrl = data;
				this.fileList = [{ url: data }];
			}
		},
	},
	computed: {
		uploadParams() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.service,
			};
			return params;
		},
	},
	methods: {
		// 图片上传校验
		beforeAvatarUpload(file) {
			const whiteList = ['jpg', 'png', 'bmp'];
			return uploadFileType.call(this, file, whiteList, 4);
		},
		// 预览图片
		handlePreview() {
			this.dialogVisible = true;
		},
		// 删除图片
		handleRemove(file, fileList) {
			this.fileList = fileList;
			this.dialogImageUrl = '';
		},
		// 图片上传成功
		handleSuccess(response, file, fileList) {
			this.dialogImageUrl = response.datas.fileUrlKey;
			this.fileList = fileList;
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep.upload-image-group {
	.tipTitle {
		display: inline-block;
		line-height: 20px;
		color: #8c939b;
		font-size: 12px;
		margin-top: 10px;
	}
}
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
</style>