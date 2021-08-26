<template>
	<div class="main">
		<guideBar>
			<el-button class="el-icon-back" type="primary" plain @click="goback">返回</el-button>
		</guideBar>
		<el-card class="card-gap" v-if="centerDialogVisible">
			<h6 class="title-text">{{ pushData.msgTitle }}</h6>
			<el-form :model="pushData" :rules="rules" label-suffix=":" ref="ruleForm" label-width="100px">
				<el-form-item label="场景描述：" prop="sceneDesc" required style="width: 600px">
					<el-input type="textarea" v-model="pushData.sceneDesc" required></el-input>
				</el-form-item>
				<el-form-item label="发送时间" prop="triggerType" required>
					<el-radio-group v-model="pushData.triggerType">
						<el-radio :label="0">即时发送</el-radio>
						<el-radio :label="1">定时发送</el-radio>
					</el-radio-group>
					<span v-if="pushData.triggerType === 1" style="margin-left: 10px">
						<el-select
							v-model="pushData.cronVo.cronSelect"
							placeholder="请选择"
							style="width: 100px"
							@change="changecronSelect"
						>
							<el-option v-for="item in year" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<span v-if="pushData.cronVo.cronSelect === 1">月份:</span>
						<el-select
							v-model="pushData.cronVo.month"
							placeholder="请选择"
							style="width: 100px"
							v-if="pushData.cronVo.cronSelect === 1"
						>
							<el-option v-for="item in month" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<span v-if="pushData.cronVo.cronSelect === 1 || pushData.cronVo.cronSelect === 2">日期:</span>
						<el-select
							v-model="pushData.cronVo.day"
							placeholder="请选择"
							style="width: 100px"
							v-if="pushData.cronVo.cronSelect === 1 || pushData.cronVo.cronSelect === 2"
						>
							<el-option v-for="item in day" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<span>小时:</span>
						<el-select v-model="pushData.cronVo.hour" placeholder="请选择" style="width: 100px">
							<el-option v-for="item in hour" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<span>分钟:</span>
						<el-select v-model="pushData.cronVo.minutes" placeholder="请选择" style="width: 100px">
							<el-option v-for="item in min" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</span>
				</el-form-item>
				<el-form-item label="发送内容" prop="contentFrom" required>
					<el-radio-group v-model="pushData.contentFrom" @change="radioChange">
						<el-radio :label="0">自由编辑</el-radio>
						<el-radio :label="1">模板消息</el-radio>
					</el-radio-group>
					<span v-if="pushData.contentFrom === 1">
						<el-button type="primary" class="date-picker" plain @click="addParameter('模板')">选择模板</el-button>
						<span class="module-text" v-if="!!pushData.templateTitle">
							{{ pushData.templateTitle }}
							<span @click="clearText" class="clear-text">×</span>
						</span>
					</span>
				</el-form-item>
				<el-form-item label="发送平台" required>
					<el-checkbox v-model="pushData.sendLetter" label="站内信"></el-checkbox>
					<el-checkbox v-model="pushData.sendSms" label="短信"></el-checkbox>
				</el-form-item>
				<el-form-item label="消息类型：" prop="msgType">
					<el-cascader
						v-model="pushData.msgType"
						:disabled="!!pushData.contentFrom"
						:options="options"
						:props="props"
						clearable
					></el-cascader>
				</el-form-item>
				<el-form-item label="消息标题" prop="msgTitle" required>
					<el-input
						v-model="pushData.msgTitle"
						placeholder="请输入消息标题"
						:disabled="!!pushData.contentFrom"
						style="width: 217px"
					></el-input>
				</el-form-item>
				<el-form-item label="消息内容" required>
					<el-button
						class="el-icon-document-add"
						type="primary"
						:disabled="!!pushData.contentFrom"
						@click="addParameter('参数')"
					>
						添加参数
					</el-button>
				</el-form-item>
				<el-form-item label prop="content">
					<tinyEditor v-model="mallForm" :id="id" :init="init" />
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="card-gap" v-else>
			<div class="succCon">
				<div class="icon_tip">
					<i class="el-icon-success font_set"></i>
					<p>提交成功</p>
					<p>提交成功，等待审核完成</p>
				</div>
				<div class="btn_list">
					<el-button class="el-icon-tickets" type="primary" @click="goList">返回列表</el-button>
					<el-button @click="goDetail">查看详情</el-button>
				</div>
			</div>
		</el-card>
		<actionBar>
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
						</el-form-item>
					</el-form>
				</div>
				<div class="dilog-main" v-if="dialogTitle === '选择模板'">
					<tableList border :dataSource="moduleList" :columns="COULUMNS_EDIT_MODULELIST" slotcontent>
						<template slot-scope="scope">
							<div>
								<span class="btns" @click="use(scope.data, dialogTitle)">使用</span>
							</div>
						</template>
					</tableList>
				</div>
				<div class="dilog-main" v-else>
					<tableList border :dataSource="parmasList" :columns="COULUMNS_EDIT_PARMASLIST" slotcontent>
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
import { COULUMNS_EDIT_PARMASLIST, COULUMNS_EDIT_MODULELIST } from './config.js';
import { generateRandomCode } from 'util';
export default {
	name: 'editSystemMessage',
	data() {
		return {
			id: generateRandomCode(),
			init: {
				readonly: false,
			},
			options: [],
			props: {
				lazy: false,
				children: 'child',
				label: 'dicName',
				value: 'dicValue',
				expandTrigger: 'click',
			},
			year: [],
			month: [],
			day: [],
			hour: [],
			min: [],
			dialogTitle: '选择模板',
			serachTitle: '搜索模板',
			isAddParameter: false,
			centerDialogVisible: true,
			mallForm: '',
			serhchValue: '',
			radio: 0,
			radiotmp: 0,
			dataSource: [],
			parmasList: [],
			COULUMNS_EDIT_MODULELIST,
			COULUMNS_EDIT_PARMASLIST,
			pushData: {
				content: '',
				contentFrom: 0,
				id: '',
				msgTitle: '',
				msgType: '',
				operatorId: '',
				operatorName: '',
				params: [],
				sceneDesc: '',
				status: '',
				templateCode: '',
				templateTitle: '',
				triggerType: 0,
				pushType: 3,
				updateTime: '',
				cronVo: {
					cronSelect: 1,
					month: 1,
					day: 1,
					hour: 0,
					minutes: 0,
				},
				sendLetter: false,
				sendSms: false,
			},
			checkedCities: [],
			dicValueId: '',
			dicValueIdchild: '',
			paramsArr: [],
			moduleList: [],
			rules: {
				sceneDesc: [{ required: true, message: '请填写场景描述', trigger: 'blur' }],
				msgTitle: [{ required: true, message: '请填写标题', trigger: 'blur' }],
				msgType: [{ required: true, message: '请选择消息类型', trigger: 'change' }],
				message: [{ required: true, message: '请选择请至少勾选一个', trigger: 'change' }],
			},
			pageId: null,
		};
	},
	mounted() {
		this.getData();
	},
	created() {
		this.pageId = this.$route.query.id ? this.$route.query.id : null;
		this.getForData(12, e => {
			this.month.push({ value: e + 1, label: e + 1 });
		});
		this.getForData(24, e => {
			this.hour.push({ value: e, label: e });
		});
		this.getForData(60, e => {
			this.min.push({ value: e, label: e });
		});
		this.getForData(28, e => {
			this.day.push({ value: e + 1, label: e + 1 });
		});
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
		getTree(ary, type, status) {
			if (Array.isArray(ary) && ary.length > 0) {
				ary.forEach(e => {
					if (e.child === null) {
						e.child = undefined;
					} else {
						if (Array.isArray(e.child) && e.child.length === 0) e.child = undefined;
					}
					if (status) {
						if (type.msgType + '' === e.dicValue + '') this.dicValueId = e.pid;
					} else {
						if (type === e.id) this.dicValueIdchild = e.dicValue;
					}
					if (Array.isArray(e.child) && e.child.length > 0) this.getTree(e.child, type, status);
				});
			}
		},
		async getMsgType() {
			const res = await this.$fetch(`/mgmt/msgadmin/msgType/all`);
			if (res.code === 200) {
				this.options = res.data;
				this.getTree(this.options, this.pushData, 1);
				this.getTree(this.options, this.dicValueId, 0);
				this.pushData.msgType = [this.dicValueIdchild + '', this.pushData.msgType + ''];
			}
		},
		changecronSelect() {
			let obj = { month: 1, day: 1, hour: 0, minutes: 0 };
			this.pushData.cronVo = Object.assign(this.pushData.cronVo, obj);
		},
		getForData(length, callback) {
			for (let index = 0; index < length; index++) {
				callback && callback(index);
			}
		},
		async getYear() {
			const res = await this.$fetch(`/mgmt/msgadmin/plan/getTrigger`);
			if (res.code === 200) res.data.forEach(e => this.year.push({ value: e.id * 1, label: e.name }));
		},
		getParamArr(str) {
			// 4、js全局截取两个字符串之前的内容：
			if (str) str = str.match(/{([\s\S]*?)}/g);
			let res = str ? str.toString().replace(/{/g, '').replace(/}/g, '') : '';
			return res;
		},
		clearText() {
			this.pushData.templateTitle = '';
		},
		async getData() {
			const res = await this.$fetch(`/mgmt/msgadmin/plan/query/${this.$route.query.id}`);
			if (res && res.code === 200) {
				this.pushData = res.data;
				let { sendLetter, sendSms } = res.data;
				if (!res.data.cronVo) this.pushData.cronVo = { cronSelect: 1, month: 1, day: 1, hour: 0, minutes: 0 };
				this.init.readonly = !!res.data.contentFrom;
				this.mallForm = this.pushData.content;
				this.pushData.sendLetter = !!sendLetter;
				this.pushData.sendSms = !!sendSms;
			}
			this.getMsgType();
			this.getYear();
		},
		async getModuleData(key) {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/msgadmin/manageTemplate/queryTemplate',
				params: { key },
			});
			if (res.code === 200) this.moduleList = res.data;
		},
		async getParams(key) {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/msgadmin/param/search',
				params: { key },
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
			if (!e) this.pushData.templateCode = '';
			this.pushData.contentFrom = e ? 1 : 0;
		},
		save(formName) {
			let { sendLetter, sendSms } = this.pushData;
			if (!sendLetter && !sendSms) return this.$message.warning('发送平台至少勾选一个');
			this.$refs[formName].validate(async valid => {
				if (valid) {
					let { cronSelect } = this.pushData.cronVo;
					if (cronSelect === 2) this.pushData.cronVo.month = 0;
					if (cronSelect === 3) {
						this.pushData.cronVo.month = 0;
						this.pushData.cronVo.day = 0;
					}
					this.pushData.content = this.mallForm;
					this.pushData.params = this.getParamArr(this.mallForm) ? '[' + this.getParamArr(this.mallForm) + ']' : '';
					this.pushData.msgType = this.pushData.msgType[this.pushData.msgType.length - 1];
					let parmas = Object.assign({}, this.pushData);
					parmas.sendLetter = sendLetter ? 1 : 0;
					parmas.sendSms = sendSms ? 1 : 0;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/msgadmin/plan/update',
						data: parmas,
					});
					if (res && res.code === 200) {
						this.pageId = res.data ? res.data : this.$route.query.id;
						this.centerDialogVisible = false;
						this.$dispatch('SUBTEM_MESSAGE_LIST');
					}
				}
			});
		},
		use({ title, msgType, templateCode, content, field }, e) {
			if (e === '选择模板') {
				let obj = { msgTitle: title, templateTitle: title, msgType: msgType + '', templateCode, content };
				this.pushData = Object.assign(this.pushData, obj);
				this.mallForm = content;
			} else {
				if (this.mallForm) {
					let index =
						this.mallForm.lastIndexOf('</p>') === -1 ? this.mallForm.length : this.mallForm.lastIndexOf('</p>');
					this.mallForm = this.mallForm.substring(0, index) + field + this.mallForm.substring(index);
				} else {
					this.mallForm = this.mallForm + field;
				}
				this.pushData.content = this.mallForm;
			}
			this.$message({ message: '添加成功', type: 'success' });
			this.isAddParameter = false;
		},
		goback() {
			this.$closeSelf();
		},
		addParameter(text) {
			this.dialogTitle = text === '模板' ? '选择模板' : '添加参数';
			this.serachTitle = text === '模板' ? '搜索模板' : '搜索参数';
			this.getModuleData();
			this.getParams();
			this.isAddParameter = true;
		},
		close() {
			this.isAddParameter = false;
		},
		goList() {
			let { sceneId, platformId } = this.$route.query;
			this.$go('sub_scene_management', { title: '子场景管理', sceneId, platformId });
			this.$closeOldPage();
		},
		goDetail() {
			let { sceneId, platformId } = this.$route.query;
			this.$go('system_message_detail', { id: this.pageId, platformId, sceneId });
			this.$closeOldPage();
		},
		preview(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$go('preview_message', {
						title: '预览消息',
						id: this.$route.query.id,
						type: 'previvew',
						obj: JSON.stringify(this.pushData),
					});
				}
			});
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
	}
	.date-picker {
		margin-left: 10px;
	}
	.clear-text {
		cursor: pointer;
	}
}
.save-class {
	margin-top: 40px;
	height: 110px;
	text-align: center;
	box-sizing: border-box;
	.icon {
		margin-bottom: 20px;
		color: $success;
		overflow: hidden;
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
