<template>
	<div class="main">
		<guideBar>
			<el-button class="el-icon-back" type="primary" plain @click="goback">返回</el-button>
		</guideBar>
		<el-card class="card-gap" v-if="centerDialogVisible">
			<h6 class="title-text">{{ pageData.msgTitle }}</h6>
			<el-form :model="pageData" :rules="rules" ref="ruleForm" label-width="100px">
				<el-form-item label="接收对象：" required>
					<el-radio-group v-model="pageData.receiverFrom" @change="receiverFromChange">
						<el-radio :label="1">全部用户</el-radio>
						<el-radio :label="2">导入名单</el-radio>
					</el-radio-group>
					<span v-if="pageData.receiverFrom === 2">
						<span class="module-text" @click="dowload">
							<span>下载</span>
							<span>导入模板</span>
						</span>
						<el-upload
							class="upload-demo"
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							:on-success="handleSuccess"
							:on-remove="onRemove"
							:multiple="false"
							:limit="1"
							name="file"
							accept=".xls"
							:file-list="fileList"
							:before-upload="beforeVideoUpload"
						>
							<el-button size="small" type="primary">上传文件</el-button>
						</el-upload>
					</span>
				</el-form-item>
				<el-form-item label="发送时间：" required>
					<el-radio-group v-model="pageData.triggerType" style="margin-right: 10px">
						<el-radio :label="0">即时发送</el-radio>
						<el-radio :label="1">定时发送</el-radio>
					</el-radio-group>
					<el-date-picker
						v-if="pageData.triggerType === 1"
						class="date-picker"
						v-model="time"
						type="datetime"
						value-format="yyyy-MM-dd HH:mm:ss"
						placeholder="选择日期时间"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="发送渠道：" required>
					<el-radio-group v-model="receiverType">
						<el-radio :label="1">所有渠道</el-radio>
						<!-- <el-radio :label="1">服务中心</el-radio> -->
					</el-radio-group>
				</el-form-item>
				<el-form-item label="发送内容：" required>
					<el-radio-group v-model="pageData.contentFrom" @change="radioChange">
						<el-radio :label="0">自由编辑</el-radio>
						<el-radio :label="1">模板消息</el-radio>
					</el-radio-group>
					<span v-if="pageData.contentFrom === 1">
						<el-button type="primary" class="sle-mb" plain @click="addParameter('模板')">选择模板</el-button>
						<span class="module-text" v-if="!!templateText">
							{{ templateText }}
						</span>
					</span>
				</el-form-item>

				<el-form-item label="消息类型：" type="flex" prop="msgType">
					<el-cascader
						v-model="pageData.msgType"
						:disabled="!!pageData.contentFrom"
						:options="options"
						:props="props"
						clearable
					></el-cascader>
				</el-form-item>
				<el-form-item label="消息标题：" prop="msgTitle">
					<el-input
						style="width: 217px"
						v-model="pageData.msgTitle"
						placeholder="请输入内容"
						:disabled="!!pageData.contentFrom"
					/>
				</el-form-item>
				<el-form-item label="消息内容：" required>
					<el-button
						icon="el-icon-circle-plus-outline"
						type="primary"
						:disabled="!!pageData.contentFrom"
						@click="addParameter('参数')"
					>
						添加参数
					</el-button>
				</el-form-item>
				<el-form-item label prop="agreement">
					<tinyEditor v-model="mallForm" :id="id" :init="init" />
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="card-gap" v-else>
			<div class="accomplish">
				<div class="icon-yes">
					<i class="el-icon-success icon-textsss"></i>
				</div>
				<div class="sbmt">提交成功</div>
				<div class="sbmt-text">新建提交成功，等待审批完成</div>
				<div class="sbmt-btn">
					<el-button type="primary" @click="goList">返回列表</el-button>
					<el-button plain @click="goDetail">查看详情</el-button>
				</div>
			</div>
		</el-card>
		<actionBar v-if="centerDialogVisible">
			<template>
				<el-button class="el-icon-printer" type="primary" @click="save('ruleForm')">保存并提交审核</el-button>
				<el-button class="el-icon-document" type="primary" @click="preview('ruleForm')">预览</el-button>
			</template>
		</actionBar>
		<el-dialog
			:title="dialogTitle"
			:visible.sync="isAddParameter"
			width="60%"
			ref="dialog"
			:before-close="close"
			v-drag
		>
			<div>
				<div class="dilog-serach">
					<el-form ref="form" label-width="80px">
						<el-form-item :label="serachTitle">
							<el-col :span="6">
								<el-input v-model="serhchValue" size="small" placeholder="请出入搜索参数"></el-input>
							</el-col>
							<el-button class="serach-btn el-icon-search" type="primary" @click="serachList">搜 索</el-button>
							<el-button plain @click="resetLst">重置</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div class="dilog-main" v-if="dialogTitle === '选择模板'">
					<tableList border :dataSource="moduleList" :columns="moduleColumns" slotcontent>
						<template slot-scope="scope">
							<div>
								<span class="btns" @click="use(scope.data, dialogTitle)">使用</span>
							</div>
						</template>
					</tableList>
				</div>
				<div class="dilog-main" v-else>
					<tableList border :dataSource="parmasList" :columns="columns" slotcontent>
						<template slot-scope="scope">
							<div>
								<span class="btns" @click="use(scope.data, dialogTitle)">使用</span>
							</div>
						</template>
					</tableList>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="isAddParameter = false">取 消</el-button>
				<el-button type="primary" @click="isAddParameter = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { uploadFileType } from 'util/formValidation';
import { exportExcel, generateRandomCode } from 'util';
export default {
	name: 'addEditMessage',
	data() {
		return {
			id: generateRandomCode(),
			init: {
				readonly: false,
			},
			props: {
				lazy: false,
				children: 'child',
				label: 'dicName',
				value: 'dicValue',
			},
			fileList: [],
			options: [],
			receiverType: 1,
			pageData: {
				id: '',
				receiverFrom: 1,
				triggerType: 0,
				sendTime: '',
				receiverType: 1,
				contentFrom: 0,
				templateCode: '',
				msgType: '',
				msgTitle: '',
				content: '',
				params: '',
				receiverUrl: '',
				receiverName: '',
				operatorName: '',
				operatorId: null,
			},
			templateText: '',
			dialogTitle: '选择模板',
			serachTitle: '搜索模板',
			time: '',
			isAddParameter: false,
			centerDialogVisible: true,
			mallForm: '',
			serhchValue: '',
			dicValueId: '',
			dicValueIdchild: '',
			dataSource: [],
			parmasList: [],
			pageId: null,
			moduleColumns: [
				{
					prop: 'templateCode',
					label: '模板编号',
					align: 'left',
				},
				{
					prop: 'templateName',
					label: '模板名称',
					align: 'left',
				},
			],
			columns: [
				{
					prop: 'field',
					label: '字段名',
					align: 'left',
				},
				{
					prop: 'fieldDesc',
					label: '字段释义',
					align: 'left',
				},
			],
			paramsArr: [],
			moduleList: [],
			rules: {
				sceneDesc: [{ required: true, message: '请填写场景描述' }],
				msgType: [{ required: true, message: '请选择消息类型' }],
				updateTime: [{ required: true, message: '请填写时间' }],
				msgTitle: [{ required: true, message: '请填写标题', change: 'bulr' }],
			},
		};
	},
	activated() {
		if (this.$route.query && this.$route.query.id) {
			this.pageData.id = this.$route.query.id;
			this.getData();
			return;
		}
		this.getMsgType();
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
			const whiteList = ['xls'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		receiverFromChange(e) {
			if (e == 1) {
				this.pageData.receiverUrl = '';
				this.pageData.receiverName = '';
			}
		},
		onRemove() {
			this.pageData.receiverName = '';
			this.pageData.receiverUrl = '';
		},
		handleSuccess(file, data, filelist) {
			if (file.success) {
				let { fileUrlKey } = file.datas;
				this.fileList = filelist;
				this.pageData = Object.assign(this.pageData, { receiverName: data.name, receiverUrl: fileUrlKey });
			}
		},
		getParamArr(str) {
			//  js全局截取两个字符串之前的内容：
			if (str) str = str.match(/{([\s\S]*?)}/g);
			let res = str ? str.toString().replace(/{/g, '').replace(/}/g, '') : '';
			return res;
		},
		async dowload() {
			exportExcel('/mgmt/msgadmin/handmade/downTemplate');
		},
		getTree(ary, type, status) {
			if (Array.isArray(ary) && ary.length > 0) {
				ary.forEach(e => {
					if (e.child === null) {
						e.child = undefined;
					} else {
						if (Array.isArray(e.child) && e.child.length === 0) e.child = undefined;
					}
					if (status) {
						if (type.msgType === e.dicValue) this.dicValueId = e.pid;
					} else {
						if (type === e.id) this.dicValueIdchild = e.dicValue;
					}
					if (Array.isArray(e.child) && e.child.length > 0) this.getTree(e.child, type, status);
				});
			}
		},
		async getMsgType() {
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/msgadmin/msgType/all`,
			});
			if (res.code === 200) {
				this.options = res.data;
				if (this.$route.query && this.$route.query.id) {
					this.getTree(this.options, this.pageData, 1);
					this.getTree(this.options, this.dicValueId, 0);
					this.pageData.msgType = [this.dicValueIdchild + '', this.pageData.msgType];
				}
			}
		},
		async getData() {
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/msgadmin/handmade/details?planCode=${this.$route.query.id}`,
			});
			if (res.code === 200) {
				this.pageData = Object.assign(this.pageData, res.data);
				this.templateText = res.data.templateName;
				this.time = res.data.cronExpr;
				delete this.pageData.cronExpr;
				delete this.pageData.planStatus;
				if (res.data.receiverFrom === 2) this.fileList = [{ name: res.data.receiverName, url: res.data.receiverUrl }];
				if (res.data.contentFrom) this.init.readonly = false;
				this.mallForm = this.pageData.content;
			}
			this.getMsgType();
		},
		async getModuleData(key) {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/msgadmin/manageTemplate/queryTemplate',
				params: {
					key,
				},
			});
			if (res.code === 200) this.moduleList = res.data;
		},
		async getParams(key) {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/msgadmin/param/search',
				params: { key, level: 2 },
			});
			if (res.code === 200) this.parmasList = res.data;
		},
		serachList() {
			this.getModuleData(this.serhchValue);
			this.getParams(this.serhchValue);
		},
		resetLst() {
			this.serhchValue = '';
			this.getModuleData();
			this.getParams();
		},
		radioChange(e) {
			this.init.readonly = !!e;
			if (!e) this.pageData.templateCode = '';
			if (!this.$route.query.id && e == 0) {
				let obj = { content: '', msgTitle: '', msgType: '' };
				this.pageData = Object.assign(this.pageData, obj);
				this.mallForm = '';
			}
		},
		save(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					if (this.pageData.triggerType) this.pageData.sendTime = this.time;
					if (this.pageData.receiverFrom === 2) {
						if (!this.pageData.receiverUrl) {
							this.$message.warning('请下载导入模板并上传');
							return;
						}
					}
					this.pageData.content = this.mallForm;
					this.pageData.params = this.getParamArr(this.mallForm) ? '[' + this.getParamArr(this.mallForm) + ']' : '';
					this.pageData.msgType = this.pageData.msgType[this.pageData.msgType.length - 1];
					this.pageData.operatorName = this.$store.state.user.userInfo.nickname;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/msgadmin/handmade/saveOrUpdate',
						data: this.pageData,
					});
					if (res && res.code === 200) {
						this.pageId = res.data;
						this.centerDialogVisible = false;
						this.$dispatch('MANUAL_MESSAGE_MANAGEMENT_LIST');
						this.$dispatch('MANUAL_MESSAGE_MANAGEMENT_GET_DSH');
					}
				}
			});
		},
		use({ title, templateCode, content, field, msgType }, e) {
			if (e === '选择模板') {
				this.templateText = title;
				let obj = { templateCode, content, msgTitle: title, templateTitle: title, msgType: String(msgType) };
				this.pageData = Object.assign(this.pageData, obj);
				this.mallForm = content;
			} else {
				if (this.mallForm) {
					let index =
						this.mallForm.lastIndexOf('</p>') === -1 ? this.mallForm.length : this.mallForm.lastIndexOf('</p>');
					this.mallForm = this.mallForm.substring(0, index) + field + this.mallForm.substring(index);
				} else {
					this.mallForm = this.mallForm + field;
				}
				this.pageData.content = this.mallForm;
			}
			this.$message.success('添加成功');
			this.isAddParameter = false;
		},
		goback() {
			this.$go('manual_message_management');
		},
		addParameter(text) {
			this.dialogTitle = text === '模板' ? '选择模板' : '添加参数';
			this.serachTitle = text === '模板' ? '搜索模板' : '搜索参数';
			if (text === '模板') {
				this.getModuleData();
			} else {
				this.getParams();
			}
			this.isAddParameter = true;
		},
		close() {
			this.isAddParameter = false;
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		goList() {
			this.$go('manual_message_management');
			this.$closeOldPage();
		},
		goDetail() {
			this.$go('message_detail', { id: this.pageId });
			this.$closeOldPage();
		},
		preview(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.pageData.content = this.mallForm;
					this.$go('preview_message', {
						title: '预览消息',
						id: this.$route.query.id,
						type: 'previvew',
						obj: JSON.stringify(this.pageData),
					});
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/elementUi.scss';
.accomplish {
	text-align: center;
	.icon-yes {
		margin-top: 80px;
		font-size: 68px;
		color: $success;
	}
	.sbmt {
		padding: 40px 0 0 0;
		font-size: 20px;
	}
	.sbmt-text {
		padding: 20px;
		color: $color-disabled;
		font-size: $font-size;
	}
	.sbmt-btn {
		padding-bottom: 40px;
	}
}
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
	.sle-mb {
		margin-left: 10px;
	}
	.module-text {
		margin-left: 10px;
		color: $color-link;
		cursor: pointer;
	}
	.upload-demo {
		width: 300px;
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
			text-align: center;
		}
		.icon-textes {
			font-size: 50px;
			color: $warning;
		}
	}
}
.serach-btn {
	margin-left: 10px;
}
.dilog-main {
	height: 400px;
	overflow: auto;
	.btns {
		color: $color-link;
	}
}
.serach-btn {
	margin-left: 10px;
}
.dilog-main {
	height: 400px;
	overflow: auto;
	.btns {
		color: $color-link;
	}
}
</style>
