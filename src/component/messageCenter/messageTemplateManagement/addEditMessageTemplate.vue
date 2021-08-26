<template>
	<div class="main">
		<guideBar>
			<el-button class="el-icon-back" type="primary" plain @click="goback">返回</el-button>
		</guideBar>
		<el-card class="card-gap" v-if="centerDialogVisible">
			<el-form :model="pushData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="模板名称：" prop="templateName">
					<el-input v-model="pushData.templateName" placeholder="请输入模板名称" style="width: 400px"></el-input>
				</el-form-item>
				<el-form-item label="模板状态：" required>
					<el-radio-group v-model="pushData.status">
						<el-radio :label="1">启用</el-radio>
						<el-radio :label="0">禁用</el-radio>
					</el-radio-group>
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
				<el-form-item label="消息标题：" prop="title">
					<el-input v-model="pushData.title" placeholder="请输入消息标题" style="width: 217px"></el-input>
				</el-form-item>
				<el-form-item label="消息内容：" required>
					<el-button type="primary" @click="addParameter('参数')">添加参数</el-button>
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
						<el-form-item label="搜索参数">
							<el-col :span="6">
								<el-input v-model="serhchValue" size="small" placeholder="请出入搜索参数"></el-input>
							</el-col>
							<el-button class="serach-btn" type="primary" @click="serachList">搜 索</el-button>
							<el-button plain @click="resetLst">重置</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div class="dilog-main">
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
import { generateRandomCode } from 'util';
export default {
	name: 'addEditMessageTemplate',
	data() {
		return {
			id: generateRandomCode(),
			init: {},
			props: {
				lazy: false,
				children: 'child',
				label: 'dicName',
				value: 'dicValue',
				expandTrigger: 'click',
			},
			dicValueId: '',
			dicValueIdchild: '',
			options: [],
			pushData: {
				content: '',
				defType: '',
				id: '',
				msgType: '',
				operator: '',
				remark: '',
				status: 1,
				templateCode: '',
				templateName: '',
				templateType: '',
				title: '',
				updateTime: '',
			},
			pageId: null,
			dialogTitle: '添加参数',
			editor: {},
			isAddParameter: false,
			centerDialogVisible: true,
			mallForm: '',
			serhchValue: '',
			submitObj: {
				messge: '提交成功',
				btnMsg: '查看详情',
			},
			dataSource: [],
			parmasList: [],
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
			moduleList: [],
			rules: {
				msgType: [{ required: true, message: '请选择消息类型' }],
				templateName: [{ required: true, message: '请填写模板名称' }],
				title: [{ required: true, message: '请填写消息标题' }],
			},
		};
	},
	mounted() {
		if (this.$route.query && this.$route.query.id) {
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
		getParamArr(str) {
			//  js全局截取两个字符串之前的内容：
			if (str) str = str.match(/{([\s\S]*?)}/g);
			let res = str ? str.toString().replace(/{/g, '').replace(/}/g, '') : '';
			return res;
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
						if (type.msgType + '' === e.dicValue + '') this.dicValueId = e.pid;
					} else {
						if (type + '' === e.id + '') this.dicValueIdchild = e.dicValue;
					}
					if (Array.isArray(e.child) && e.child.length > 0) this.getTree(e.child, type, status);
				});
			}
		},
		async getMsgType() {
			const res = await this.$fetch(`/mgmt/msgadmin/msgType/all`);
			this.options = res.data;
			if (this.$route.query && this.$route.query.id) {
				this.getTree(this.options, this.pushData, 1);
				this.getTree(this.options, this.dicValueId, 0);
				this.pushData.msgType = [this.dicValueIdchild + '', this.pushData.msgType];
			}
		},
		async getData() {
			const res = await this.$fetch(`/mgmt/msgadmin/manageTemplate/query/${this.$route.query.id}`);
			if (res.code === 200) {
				this.pushData = res.data;
				this.pushData.msgType = res.data.msgType + '';
				this.mallForm = res.data.content;
			}
			this.getMsgType();
		},
		async getParams(key) {
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/msgadmin/param/search`,
				params: { key },
			});
			if (res.code === 200) this.parmasList = res.data;
		},
		serachList() {
			this.getParams(this.serhchValue);
		},
		resetLst() {
			this.serhchValue = '';
			this.getParams();
		},
		save(formName) {
			let { id } = this.$route.query;
			this.$refs[formName].validate(async valid => {
				if (valid) {
					this.pushData.content = this.mallForm;
					this.pushData.msgType = this.pushData.msgType[this.pushData.msgType.length - 1];
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/msgadmin/manageTemplate/${this.$route.query && this.$route.query.id ? 'update' : 'add'}`,
						data: this.pushData,
					});
					if (res && res.code === 200) {
						this.centerDialogVisible = false;
						this.pageId = id ? id : res.data.id;
						this.$dispatch('MESSGE_TEMPLATE_MANAGEMENT');
					}
				}
			});
		},
		use({ field }) {
			let index = this.mallForm.lastIndexOf('</p>') === -1 ? this.mallForm.length : this.mallForm.lastIndexOf('</p>');
			this.mallForm = this.mallForm.substring(0, index) + field + this.mallForm.substring(index);
			this.pushData.content = this.mallForm;
			this.$message({ message: '添加成功', type: 'success' });
			this.isAddParameter = false;
		},
		goback() {
			this.$closeSelf();
		},
		addParameter() {
			this.getParams();
			this.isAddParameter = true;
		},
		close() {
			this.isAddParameter = false;
		},
		goList() {
			this.$go('message_template_management');
			this.$closeOldPage();
		},
		goDetail() {
			this.$go('message_template_Detail', { id: this.pageId });
			this.$closeOldPage();
		},
		preview(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$go('preview_message_template', {
						title: '预览消息模板',
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
	.form-width-protect {
		padding: 0 40px;
	}
	.date-picker {
		margin-left: 20px;
	}
	.module-text {
		margin-left: 10px;
		color: $color-link;
	}
}
.btns {
	color: #0877fd;
	cursor: pointer;
	margin-right: 18px;
}
.dilog-serach {
	padding: 10px 20px;
	.serach-btn {
		margin-left: 10px;
	}
}
::v-deep .el-dialog__body {
	// 深度修改样式
	padding: 0px 20px;
}
.dilog-main {
	position: relative;
	padding: 0 30px;
	height: 360px;
	overflow: auto;
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
</style>
