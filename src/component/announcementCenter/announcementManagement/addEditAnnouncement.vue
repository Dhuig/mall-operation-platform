<template>
	<div>
		<guideBar />
		<el-card class="card-gap" v-if="isPage">
			<h6 class="title-text">新建/编辑公告</h6>
			<el-row type="flex" class="form-width-protect">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="公告类型：">
						<el-col :span="8">
							<el-select v-model="ruleForm.typeId" placeholder="请选择公告类型">
								<template v-for="item in options">
									<el-option v-if="item.status" :key="item.value" :label="item.typeName" :value="item.id"></el-option>
								</template>
							</el-select>
						</el-col>
						<span class="btn" @click="centerDialogVisible = true">添加类型</span>
					</el-form-item>
					<el-form-item label="公告平台：" required>
						<el-col :span="8">
							<el-checkbox-group v-model="showMall">
								<el-checkbox label="服务中心" name="type"></el-checkbox>
								<el-checkbox label="商城" name="type"></el-checkbox>
							</el-checkbox-group>
						</el-col>
						<el-popover
							placement="right"
							title
							width="200"
							trigger="hover"
							content="公告不会区分顾客，所有人都可以看到"
						>
							<span slot="reference" class="detail el-icon-warning-outline"></span>
						</el-popover>
					</el-form-item>
					<el-form-item label="发布时间：" required>
						<el-date-picker
							:disabled="isSocket"
							v-model="ruleForm.releaseTime"
							type="datetime"
							value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="选择日期时间"
						></el-date-picker>
						<div class="release" @click="getDate">
							<div class="v-radio">
								<div class="v-radio-bule" v-show="isSocket"></div>
							</div>
							<span :class="[isSocket ? 'v-radio-text' : 'v-radio-text-click']">即时发送</span>
						</div>
					</el-form-item>
					<el-form-item label="公告标题：" prop="title">
						<el-col :span="8">
							<el-input v-model="ruleForm.title" placeholder="请填写公告标题"></el-input>
						</el-col>
					</el-form-item>
					<el-form-item label="公告内容：" required>
						<tinyEditor v-model="mallForm" :id="id" :init="init" />
						<div ref="agreementEditor"></div>
					</el-form-item>
					<el-form-item label="公告附件：">
						支持格式：doc、docx、pdf、xlsx、xls、rar、zip、7z格式的文件，大小不超过10M，仅限1个附件。
					</el-form-item>
					<el-form-item label="">
						<el-upload
							class="upload-demo"
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							:on-success="handleChange"
							:on-preview="handlePictureCardPreview"
							:before-upload="beforeVideoUpload"
							:on-remove="handleRemove"
							:multiple="false"
							name="file"
							:limit="1"
							accept=".doc,.docx,.pdf,.xlsx,.xls,.rar,.zip,.7z"
							:file-list="fileList"
						>
							<el-button size="small" type="primary">上传附件</el-button>
						</el-upload>
					</el-form-item>
				</el-form>
			</el-row>
		</el-card>

		<el-card v-else>
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
				<el-button class="el-icon-printer" type="primary" @click="draft('ruleForm')">保存为草稿</el-button>
				<el-button class="el-icon-printer" type="primary" @click="submitForm('ruleForm')">保存并提交审核</el-button>
				<el-button class="el-icon-document" type="primary" @click="preview('ruleForm')">预览</el-button>
			</template>
		</actionBar>
		<el-dialog title="添加类型" v-drag :visible.sync="centerDialogVisible" width="40%">
			<div>
				<el-form :model="anntype" ref="ruleForm" label-width="160px" class="demo-ruleForm">
					<el-form-item label="类型名称：" required>
						<el-input
							type="input"
							class="textarea-input"
							v-model="anntype.typeName"
							placeholder="请输入类型名称"
						></el-input>
					</el-form-item>
					<el-form-item label="类型描述：">
						<el-input
							type="textarea"
							class="textarea"
							v-model="anntype.typeDesc"
							placeholder="请输入类型描述"
						></el-input>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="centerDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="typeSave">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { formatDate, uploadFileType } from 'util/formValidation.js';
import { generateRandomCode } from 'util';
export default {
	name: 'addEditAnnouncement',
	data() {
		return {
			id: generateRandomCode(),
			init: {},
			isPage: true,
			isSocket: false,
			centerDialogVisible: false,
			fileList: [],
			options: [],
			showMall: [],
			submitObj: {
				messge: '提交成功',
				btnMsg: '查看详情',
			},
			ruleForm: {
				triggerType: 1,
				releaseTime: '',
				typeId: null,
				title: null,
				content: null,
				showMall: 0,
				showStore: 0,
				attachmentUrl: '',
				attachmentName: '',
			},
			anntype: { typeName: '', typeDesc: '' },
			mallForm: '',
			rules: {
				showMall: [{ required: true, message: '请选择公告平台' }],
				typeId: [{ required: true, message: '请选择公告类型' }],
				title: [{ required: true, message: '请填写公告标题' }],
				releaseTime: [{ required: true, message: '请选择发送时间' }],
			},
			pageId: null,
		};
	},
	activated() {
		this.$listen('ADD_ANNOUNCEMENT_TYPE', this.announcementType);
		if (this.$route.query && this.$route.query.id) this.loadData();
		this.announcementType();
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
			const whiteList = ['doc', 'docx', 'pdf', 'xlsx', 'xls', 'rar', 'zip', '7z'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		handleChange(response, file) {
			if (response.success) {
				this.ruleForm.attachmentName = file.name;
				this.ruleForm.attachmentUrl = response.datas.fileUrlKey;
			}
		},
		handleRemove() {
			this.fileList = [];
			this.ruleForm.attachmentName = '';
			this.ruleForm.attachmentUrl = '';
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		async loadData() {
			this.pageId = this.$route.query.id;
			const res = await this.$fetch(`/mgmt/msgadmin/mgmt/msg/notice/getNoticeById?id=${this.pageId}`);
			if (res && res.code === 200) {
				let { attachmentUrl, attachmentName } = res.data;
				this.ruleForm = Object.assign(this.ruleForm, res.data);
				this.ruleForm.releaseTime = formatDate(this.ruleForm.releaseTime);
				this.showMall = [];
				if (attachmentUrl)
					this.fileList = [
						{
							url: attachmentUrl,
							name: attachmentName,
						},
					];
				if (this.ruleForm.showMall) this.showMall.push('商城');
				if (this.ruleForm.showStore) this.showMall.push('服务中心');
				this.isSocket = !this.ruleForm.triggerType;
				this.mallForm = this.ruleForm.content;
			}
		},
		goList() {
			this.$go('announcement_management');
			this.$closeOldPage();
		},
		goDetail() {
			this.$go('announcement_detail', { id: this.pageId });
			this.$closeOldPage();
		},
		async typeSave() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/msgadmin/mgmt/msg/notice/addNoticeType',
				data: this.anntype,
			});
			if (res.code === 200) {
				this.$message.success(res.message);
				this.centerDialogVisible = false;
				this.anntype = { typeName: '', typeDesc: '' };
				this.announcementType();
			}
		},
		async announcementType() {
			const res = await this.$fetch(`/mgmt/msgadmin/mgmt/msg/notice/getNoticeTypeByPage?pageNum=1&pageSize=100000`);
			if (res.code === 200) {
				this.options = res.data.list;
			}
		},
		getDate() {
			this.isSocket = !this.isSocket;
			this.ruleForm.triggerType = this.isSocket ? 0 : 1;
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.saveRequst(0);
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		async saveRequst(saveAsDraft) {
			let { query } = this.$route;
			this.ruleForm.content = this.mallForm;
			this.ruleForm.showMall = this.showMall.indexOf('商城') > -1 ? 1 : 0;
			this.ruleForm.showStore = this.showMall.indexOf('服务中心') > -1 ? 1 : 0;
			this.ruleForm.releaseTime = this.ruleForm.triggerType ? this.ruleForm.releaseTime : '';
			this.ruleForm.saveAsDraft = saveAsDraft;
			let push = this.ruleForm;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/msgadmin/mgmt/msg/notice/${query && query.id ? 'editNotice' : 'addNotice'}`,
				data: push,
			});
			if (res && res.code == 200) {
				this.isPage = false;
				this.pageId = this.$route.query.id ? this.$route.query.id : res.data;
				this.$dispatch('ANNOUNCEMENT_MANAGEMENT');
				this.$dispatch('ANNOUNCEMENT_TYPE');
				this.$dispatch('ANNOUNCEMENT_MANAGEMENT_GETDSH');
			}
		},
		draft(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					this.saveRequst(1);
				}
			});
		},
		preview() {
			this.ruleForm.content = this.mallForm;
			this.$go('preview_announcement', { preview: JSON.stringify(this.ruleForm) });
		},
	},
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/elementUi.scss';
.card-gap {
	.title-text {
		padding: 20px;
		border: 1px solid $color-border;
		margin-bottom: 20px;
		font-weight: 400;
		font-size: $font-size;
		color: $color-body;
	}
	.form-width-protect {
		padding: 0 40px;
	}
	.btn {
		color: $color-link;
		margin-left: 10px;
		cursor: pointer;
	}
	.detail {
		color: $color-hit;
		font-size: 18px;
	}
	.time {
		height: 50px;
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
.release {
	position: absolute;
	width: 90px;
	height: 40px;
	display: inline-block;
	margin-left: 10px;
	cursor: pointer;
}
.v-radio {
	position: absolute;
	display: inline-block;
	width: 14px;
	height: 14px;
	border-radius: 50%;
	left: 5px;
	top: 50%;
	margin-top: -7px;
	border: 1px solid $color-border;
	.v-radio-bule {
		position: relative;
		box-sizing: border-box;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 4px solid $primary;
	}
}
.v-radio-text {
	position: absolute;
	color: $color-link;
	right: 5px;
}
.v-radio-text-click {
	position: absolute;
	right: 5px;
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
.textarea {
	font-size: 13px;
}
.textarea-input {
	font-size: 13px;
	font-weight: normal;
}
::v-deep .el-input__inner {
	font-family: 'Courier New', Courier, monospace;
	// &::placeholder {
	// 	font-size: vw(14);
	// }

	// &::-webkit-input-placeholder {
	// 	/* WebKit browsers 适配谷歌 */
	// 	font-size: vw(14);
	// }

	// &:-moz-placeholder {
	// 	/* Mozilla Firefox 4 to 18 适配火狐 */
	// 	font-size: vw(14);
	// }

	// &::-moz-placeholder {
	// 	/* Mozilla Firefox 19+ 适配火狐 */
	// 	font-size: vw(14);
	// }

	// &:-ms-input-placeholder {
	// 	/* Internet Explorer 10+  适配ie*/
	// 	font-size: vw(14);
	// }
}
</style>
