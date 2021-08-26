<template>
	<div>
		<el-card class="card-gap">
			<div class="title-text">优惠券审核</div>
			<el-row type="flex" class="form-width-protect">
				<el-form :model="pushData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="活动编号：">{{ titleobj.couponNumber }}</el-form-item>
					<el-form-item label="活动名称：">{{ titleobj.couponName }}</el-form-item>
					<el-form-item label="审核结果：" prop="examine">
						<el-radio-group v-model="pushData.examine">
							<el-radio :label="3">审核通过</el-radio>
							<el-radio :label="4">审核不通过</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="审核意见：" prop="remarks">
						<el-input
							type="textarea"
							:autosize="{ minRows: 5 }"
							maxlength="1000"
							show-word-limit
							v-model="pushData.remarks"
							placeholder="请输入审核意见"
						></el-input>
					</el-form-item>
					<el-form-item label="附件：" prop="desc">
						<span>支持格式doc、docx、pdf、wps、bmp、jpg、png，最大10M，3个文件</span>
					</el-form-item>
					<el-form-item label prop="desc">
						<el-upload
							:class="[this.pushData.enclosureVos.length == 3 ? 'is-upload' : '']"
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							:limit="3"
							multiple
							list-type="picture-card"
							:on-success="handleSuccessPC"
							:on-error="onError"
							:on-exceed="onError"
							:before-upload="beforeVideoUpload"
							:file-list="imglist"
							accept="doc, docx, pdf, wps, bmp, jpg, png"
						>
							<i class="el-icon-plus"></i>
							<div slot="file" slot-scope="{ file }" class="uploadSlotDiv">
								<pdf
									v-if="file && file.response && file.response.datas && file.response.datas.fileUrlKey.includes('.pdf')"
									:src="file.url"
								></pdf>
								<img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
								<span class="el-upload-list__item-actions">
									<span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
										<i class="el-icon-zoom-in"></i>
									</span>
									<span class="el-upload-list__item-delete" @click="beforeRemovePC(file)">
										<i class="el-icon-delete"></i>
									</span>
								</span>
							</div>
						</el-upload>
						<el-dialog v-drag :visible.sync="dialog.visible" @closed="closeDialog">
							<pdf v-if="dialog.isPdf" :src="dialog.url"></pdf>
							<img width="100%" :src="dialog.url" alt="" />
						</el-dialog>
					</el-form-item>
				</el-form>
			</el-row>
		</el-card>
		<actionBar>
			<template>
				<el-button type="primary" @click="review('ruleForm')">保存</el-button>
				<el-button plain @click="close('ruleForm')">取消</el-button>
			</template>
		</actionBar>
	</div>
</template>

<script>
import { uploadFileType } from 'util/formValidation';
import pdf from 'vue-pdf';

export default {
	name: 'couponReview',
	components: { pdf },
	data() {
		return {
			dialogImageUrl: '',
			dialogVisible: false,
			titleobj: {
				title: '',
				code: '',
			},
			imglist: [],
			dialog: {
				visible: false,
				url: '',
				isPdf: '',
			},
			pushData: {
				promotionId: null,
				examine: 3,
				remarks: null,
				enclosureVos: [],
			},
			rules: {
				remarks: [{ required: true, message: '请输入审核意见', trigger: 'blur' }],
				examine: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
			},
		};
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			};
			return params;
		},
	},
	created() {
		this.titleobj = this.$route.query;
	},
	methods: {
		handlePictureCardPreview(file) {
			const { fileUrlKey: url } = file.response.datas;
			this.dialog = {
				url,
				visible: true,
				isPdf: url.includes('.pdf'),
			};
		},
		closeDialog() {
			this.dialog = {
				url: null,
				visible: false,
				isPdf: false,
			};
		},
		beforeVideoUpload(file) {
			const whiteList = ['doc', 'docx', 'pdf', 'wps', 'bmp', 'jpg', 'png'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		async review() {
			this.pushData.couponId = this.$route.query.id;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/coupon/examine`,
				data: this.pushData,
			});
			if (res && res.code == 200) {
				this.$dispatch('COUPONMANAGEMENT_LIST');
				this.$dispatch('GET_ACTIVITY_DATA');
				this.$message.success('审核成功');
				this.$closeSelf();
			} else {
				this.$message.error('审核失败');
			}
		},
		onError() {
			this.$message.error('上传失败');
		},
		close() {
			this.$closeSelf();
		},
		handleSuccessPC(res, file, fileList) {
			if (res.success) {
				this.imglist = fileList;
				this.pushData.enclosureVos.push({ fileName: file.name, urls: res.datas.fileUrlKey });
				this.$message.success('上传成功');
			}
		},
		beforeRemovePC(res) {
			this.pushData.enclosureVos.forEach((e, index) => {
				if (e.fileName === res.name) {
					this.pushData.enclosureVos.splice(index, 1);
					this.imglist.splice(index, 1);
				}
			});
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
.is-upload ::v-deep .el-upload--picture-card {
	display: none; /* 上传按钮隐藏 */
}
</style>
