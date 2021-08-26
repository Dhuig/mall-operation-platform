<template>
	<div>
		<guideBar />
		<el-card>
			<el-form :model="appForm" :rules="rules" ref="appForm" label-width="120px" class="banner-form">
				<el-form-item label="上传图片:" prop="imageUrl">
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						:limit="1"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemove"
						:on-success="handleSuccess"
						:before-upload="beforeUpload"
						:file-list="appList"
						:class="appList.length == 1 ? 'hide_box' : ''"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="" />
					</el-dialog>
					<el-row class="tipTitle">上传图片大小750*1624，设计安全区域为750*1334，支持jpg/png/gif等图片格式</el-row>
				</el-form-item>
				<el-form-item label="广告页名称:" prop="advertName">
					<el-input size="mini" v-model="appForm.advertName" class="banner-input" />
				</el-form-item>
				<el-form-item label="广告图链接地址:" prop="linkUrl">
					<el-input size="mini" v-model="appForm.linkUrl" class="banner-input" />
					<el-row class="tipTitle">(可设置外部链接、内部链接)</el-row>
				</el-form-item>
				<el-form-item label="设置停留时间:" prop="stayTime">
					<el-input size="mini" type="number" v-model="appForm.stayTime" class="banner-input" />
					<el-row class="tipTitle">(默认广告时间为3秒，可设置1~5秒的广告)</el-row>
				</el-form-item>
				<el-form-item label="上下架类型:" prop="shelfConfig">
					<el-button type="primary" @click="showShelf = true">点我设置</el-button>
					<el-row v-if="appForm.shelfConfig == '1'">类型：立即上架</el-row>
					<el-row v-if="appForm.shelfConfig == '2'">
						类型：定时上架，上架时间：{{ dialogShelfForm.onShelfTime | timestampFormat }}
					</el-row>
					<el-row v-if="appForm.shelfConfig == '3'">
						类型：定时上下架，上架时间：{{ dialogShelfForm.onShelfTime | timestampFormat }}，下架时间：{{
							dialogShelfForm.offShelfTime | timestampFormat
						}}
					</el-row>
				</el-form-item>
				<el-row type="flex" justify="center" align="center">
					<el-button type="primary" icon="el-icon-check" @click="saveAndExit">保存</el-button>
					<el-button @click="cancelEdit">取消</el-button>
				</el-row>
			</el-form>
		</el-card>
		<!-- 上下架弹窗 -->
		<el-dialog title="上下架类型" :visible.sync="showShelf" center width="550px" v-drag>
			<el-form
				:model="dialogShelfForm"
				:rules="dialogShelfRules"
				ref="dialogShelfForm"
				class="dialogShelfForm"
				label-width="120px"
				label-position="left"
				label-suffix=":"
			>
				<el-form-item label="类型" prop="type">
					<el-radio-group v-model="dialogShelfForm.type">
						<el-radio label="1">立即上架</el-radio>
						<el-radio label="2">定时上架</el-radio>
						<el-radio label="3">定时上下架</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item
					v-if="dialogShelfForm.type == '2' || dialogShelfForm.type == '3'"
					label="上架时间"
					prop="onShelfTime"
				>
					<el-date-picker
						size="medium"
						placeholder="请选择上架时间"
						class="banner-formitem"
						type="datetime"
						value-format="timestamp"
						:picker-options="timeDisabel"
						v-model="dialogShelfForm.onShelfTime"
					/>
				</el-form-item>
				<el-form-item v-if="dialogShelfForm.type == '3'" label="下架时间" prop="offShelfTime">
					<el-date-picker
						size="medium"
						placeholder="请选择下架时间"
						class="banner-formitem"
						type="datetime"
						value-format="timestamp"
						:picker-options="pickerOptions"
						v-model="dialogShelfForm.offShelfTime"
					/>
				</el-form-item>
				<el-row class="tipTitle ml-20" v-if="dialogShelfForm.type == '1'">（该产品将立即上架）</el-row>
				<el-row class="tipTitle ml-20" v-if="dialogShelfForm.type == '2'">（该产品将在指定时间上架）</el-row>
				<el-row class="tipTitle ml-20" v-if="dialogShelfForm.type == '3'">（该产品将在指定时间上架、下架）</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click.stop="svaeShelf" class="mr-16">保存</el-button>
				<el-button @click.stop="cancelShelf">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { SHELF_RULES } from '../shoppingMall/config';
import { uploadFileType } from 'util/formValidation';
export default {
	name: 'updateApp',
	data() {
		const imgValid = (rule, value, callback) => {
			if (this.appForm.imageUrl == '') {
				callback(new Error('请上传图片'));
			} else {
				callback();
			}
		};
		return {
			timeDisabel: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 3600 * 1000 * 24;
				},
			},
			appForm: {
				imageUrl: '',
				advertName: '',
				linkUrl: '',
				stayTime: '3',
				shelfConfig: '',
			},
			dialogShelfForm: {
				type: '',
				onShelfTime: '',
				offShelfTime: '',
			},
			dialogShelfRules: SHELF_RULES,
			rules: {
				imageUrl: [{ required: true, validator: imgValid, trigger: 'change' }],
				shelfConfig: [{ required: true, message: '请选择上下架类型', trigger: 'change' }],
				stayTime: [{ required: true, message: '请选择上下架类型', trigger: 'blur' }],
			},
			dialogImageUrl: '',
			dialogVisible: false,
			appList: [],
			showShelf: false,
		};
	},
	computed: {
		pickerOptions: function () {
			return {
				disabledDate: time => {
					if (this.dialogShelfForm.onShelfTime) {
						return time.getTime() < new Date(this.dialogShelfForm.onShelfTime).getTime() + 24 * 3600 * 1000;
					}
				},
			};
		},
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.cms,
			};
			return params;
		},
		formData() {
			const { appForm, dialogShelfForm } = this;
			const params = {
				...appForm,
				...dialogShelfForm,
			};
			delete params.type;
			delete params.offShelfTime;
			delete params.onShelfTime;
			return params;
		},
		preview() {
			return !this.$route.query.id;
		},
	},
	created() {
		if (!this.preview) this.getDetail();
	},
	methods: {
		beforeUpload(file) {
			const whiteList = ['jpg', 'jpeg', 'png', 'gif'];
			return uploadFileType.call(this, file, whiteList, 5);
		},
		// 获取启动页详情
		async getDetail() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/advert/getAdvertPage/' + this.$route.query.id,
			});
			if (res && res.code == 200) {
				this.appForm = res.data;
				this.dialogShelfForm = {
					type: String(res.data.shelfConfig),
					onShelfTime: res.data.shelfUpTime,
					offShelfTime: res.data.shelfOffTime,
				};
				this.appList.push({ url: res.data.imageUrl });
			}
		},
		// 上传成功
		handleSuccess(response, file, fileList) {
			this.appForm.imageUrl = response.datas.fileUrlKey;
			this.appList = fileList;
		},
		// 删除banner回调
		handleRemove(file, fileList) {
			this.appForm.imageUrl = '';
			this.appList = fileList;
		},
		// 预览
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		// 保存上下架弹窗
		svaeShelf() {
			this.$refs['dialogShelfForm'].validate(valid => {
				if (valid) {
					this.appForm.shelfConfig = this.dialogShelfForm.type;
					this.appForm.shelfOffTime = this.dialogShelfForm.offShelfTime;
					this.appForm.shelfUpTime = this.dialogShelfForm.onShelfTime;
					this.showShelf = false;
				} else {
					this.$message.error('请填写完整！');
					return false;
				}
			});
		},
		// 关闭上下架类型弹窗
		cancelShelf() {
			this.$refs['dialogShelfForm'].resetFields();
			this.showShelf = false;
		},
		// 保存
		saveAndExit() {
			const { formData } = this;
			this.$refs['appForm'].validate(async valid => {
				if (valid) {
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/cms/advert/saveAdvertPage',
						data: formData,
					});
					if (res && res.code == 200) {
						this.$message.success(res.message);
						this.$nextTick(() => {
							this.$dispatch('GET_ADVERT_LIST');
							this.$closeSelf();
						});
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 取消
		cancelEdit() {
			this.$closeSelf();
		},
	},
};
</script>
<style lang="scss" scoped>
.banner-input {
	width: 350px;
}
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
.dialogShelfForm {
	min-height: 200px;
}
.tipTitle {
	color: #8c939b;
}

::v-deep .el-dialog__wrapper {
	overflow: auto;
}
</style>
