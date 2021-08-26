<template>
	<div>
		<el-card class="card-gap">
			<div class="title-text">{{ titleobj.name }}审核</div>
			<el-row type="flex" class="form-width-protect">
				<el-form :model="pushData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item :label="titleobj.name + '编号：'">{{ titleobj.promotionCode }}</el-form-item>
					<el-form-item :label="titleobj.name + '名称：'">{{ titleobj.promotionName }}</el-form-item>
					<el-form-item label="审核结果：" prop="examine">
						<el-radio-group v-model="pushData.examine">
							<el-radio :label="3">审核通过</el-radio>
							<el-radio :label="4">审核不通过</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="审核意见：" prop="remarks">
						<el-input type="textarea" v-model="pushData.remarks" placeholder="请输入审核意见"></el-input>
					</el-form-item>
					<el-form-item label="附件：" prop="desc">
						<span>支持格式pdf、jpg、 png, 最大10M，3个文件</span>
					</el-form-item>
					<el-form-item label prop="desc">
						<el-upload
							:class="[this.pushData.enclosureVos.length == 3 ? 'is-upload' : '']"
							:headers="$store.getters['system/getSignatureVerification']"
							:action="$store.getters['system/getOssUploadUrl']"
							:data="uploadData"
							:limit="3"
							multiple
							list-type="picture-card"
							:on-success="handleSuccessPC"
							:on-error="onError"
							:on-exceed="onExceed"
							:before-upload="beforeVideoUpload"
							:file-list="imglist"
							accept="pdf, jpg, png"
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

		<el-dialog title="" v-drag :visible.sync="isVisible" width="300px">
			<div class="tishi">
				<span
					:class="[isSuccessError ? 'el-icon-success el-icon-success-set' : 'el-icon-error-set el-icon-error']"
				></span>
				<span>提交{{ isSuccessError ? '成功' : '失败' }}</span>
			</div>
			<span slot="footer" class="dialog-footer">
				<span v-if="isSuccessError">
					<el-button @click="golsit">返回列表</el-button>
					<el-button type="primary" @click="look">查看详情</el-button>
				</span>
				<span v-else>
					<el-button @click="isVisible = false">取 消</el-button>
					<el-button type="primary" @click="save">重新提交</el-button>
				</span>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { uploadFileType } from 'util/formValidation';
import pdf from 'vue-pdf';

export default {
	name: 'activityReview',
	data() {
		return {
			isSuccessError: true,
			isVisible: false,
			dialog: {
				visible: false,
				url: '',
				isPdf: '',
			},
			imglist: [],
			titleobj: {
				title: '',
				code: '',
				name: '',
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
	components: { pdf },
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
		look() {
			this.isVisible = false;
			this.isSuccessError = true;
			if (this.titleobj.name === '换购') {
				this.$go('change_purchase_detail', { id: this.titleobj.id });
			} else {
				this.$go('spike_activity', { id: this.titleobj.id });
			}
		},
		golsit() {
			this.isVisible = false;
			this.isSuccessError = true;
			this.$closeSelf();
		},
		save() {
			this.isVisible = false;
			this.isSuccessError = true;
			this.promotionExamine();
		},
		beforeVideoUpload(file) {
			const whiteList = ['pdf', 'jpg', 'png'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
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
		async promotionExamine() {
			this.pushData.promotionId = this.$route.query.id;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/promotionExamine`,
				data: this.pushData,
			});
			if (res && res.code == 200) {
				this.$dispatch('ACTIVITY_MANAGEMENT_LIST');
				this.$dispatch('CHANGE_PURCHASE_MANAGEMENT_LIST');
				this.$dispatch('SPIKE_ACTIVITY_LOADDATA');
				this.$dispatch('CHANGE_PURCHASE_DETAIL_LOADATA');
			}
			this.isSuccessError = res && res.code == 200;
			this.isVisible = true;
		},
		review() {
			this.$refs.ruleForm.validate(async valid => {
				if (valid) {
					if (this.titleobj.name === '活动') return this.promotionExamine();
					this.$confirm('确认审核结果，提交后不可修改?', '审核确认', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}).then(async () => {
						this.promotionExamine();
					});
				}
			});
		},
		onExceed() {
			this.$message.warning('只能上传3个文件');
		},
		onError() {
			this.$message.warning('上传失败');
		},
		close() {
			this.$closeSelf();
		},
		handleSuccessPC(res, file, fileList) {
			if (res.success) {
				this.imglist = fileList;
				this.pushData.enclosureVos.push({ fileName: file.name, urls: res.datas.fileUrlKey });
			}
		},
		beforeRemovePC(res) {
			this.pushData.enclosureVos.forEach((e, index) => {
				if (e.fileName === res.name) this.pushData.enclosureVos.splice(index, 1);
			});
			this.imglist.forEach((e, i) => {
				if (e.uid === res.uid) this.imglist.splice(i, 1);
			});
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
	overflow-y: auto;
	max-height: 520px;
}
.is-upload ::v-deep .el-upload--picture-card {
	display: none; /* 上传按钮隐藏 */
}
.card-gap {
	margin-top: 20px;
	.uploadSlotDiv {
		height: 100%;
		img {
			object-fit: cover;
		}
	}
	.title-text {
		padding: 20px;
		padding-top: 0;
		margin-bottom: 20px;
		border-bottom: 1px solid $color-border;
	}
}
.tishi {
	height: 30px;
	line-height: 30px;
}
.el-icon-success-set {
	font-size: 18px;
	margin-right: 10px;
	margin-left: 10px;
	color: $success;
}
.el-icon-error-set {
	font-size: 18px;
	margin-right: 10px;
	margin-left: 10px;
	color: $color-red;
}
</style>
