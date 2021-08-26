<template>
	<div>
		<guideBar />
		<el-card>
			<el-form
				:model="fromData"
				:rules="rules"
				ref="fromData"
				label-width="200px"
				class="mall-form"
				label-position="right"
			>
				<el-form-item label="协议类型:" prop="id">
					<el-select v-model="fromData.id" @change="changeType(fromData.id)" placeholder="请选择">
						<el-option
							v-for="item in agreementList"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item :label="labelName" prop="protocol" required>
					<tinyEditor v-model="fromData.protocol" :id="id" :init="init" />
				</el-form-item>
				<el-row type="flex" justify="center" align="center" v-permission="'mall_agreement_edit'">
					<el-button v-if="isEdit" type="primary" icon="el-icon-check" @click="saveAndExit">保存</el-button>
					<el-button v-else type="primary" icon="el-icon-edit-outline" @click="saveEdit">编辑</el-button>
				</el-row>
			</el-form>
		</el-card>
	</div>
</template>
<script>
import { AGREEMENT_MENU } from './shoppingMall/config';
import { generateRandomCode } from 'util';
export default {
	name: 'mallAgreement',
	data() {
		return {
			id: generateRandomCode(),
			init: {
				readonly: true,
			},
			value: '1231',
			labelName: '',
			agreementList: [],
			ruleForm: {
				triggerType: 1,
				releaseTime: '',
				typeId: null,
				title: null,
				content: null,
				showMall: 0,
				showStore: 0,
			},
			isShowEdit: false,
			isEdit: false,
			fromData: {
				applyChannelType: 0,
				id: '',
				protocol: '',
				protocolType: null,
				protocolTypeDesc: '',
			},
			agreement: {},
			menus: AGREEMENT_MENU,
			rules: {
				protocol: [{ required: true, message: '请填写完整', trigger: 'blur' }],
			},
		};
	},
	mounted() {
		this.getAgreement();
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.msgnotice,
			};
			return params;
		},
		editorOptions() {
			return {
				content: '',
				zIndex: 0,
				menus: AGREEMENT_MENU,
				uploadImgServer: this.$store.getters['system/getOssUploadUrl'],
				uploadImgParams: this.uploadData,
				uploadFileName: 'file',
				contenteditable: true,
			};
		},
	},
	methods: {
		isfalse() {
			this.isEdit = !this.isEdit;
		},
		inputCallback(html) {
			this.fromData.protocol = html;
		},
		// 编辑
		saveEdit() {
			this.isEdit = !this.isEdit;
			this.init.readonly = false;
		},
		// 获取商城协议
		async getAgreement() {
			this.agreementList = [];
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/protocol/getAllProtocol',
			});
			if (res && res.code == 200) {
				let list = res.data;
				list.map(e => {
					let item = {
						value: e.id,
						label: e.protocolTypeDesc,
					};
					this.agreementList.push(item);
				});
				this.agreement = res.data;
			}
		},
		changeType(id) {
			this.agreement.map(e => {
				if (e.id == id) {
					this.labelName = e.protocolTypeDesc;
					this.fromData.protocolTypeDesc = e.protocolTypeDesc;
					this.fromData.protocolType = e.protocolType;
					this.$nextTick(() => {
						this.content = e.protocol;
						this.fromData.protocol = e.protocol;
					});
					this.isShowEdit = true;
				}
			});
		},
		// 保存协议
		saveAndExit() {
			this.init.readonly = true;
			this.isEdit = !this.isEdit;
			this.$refs['fromData'].validate(async valid => {
				if (valid) {
					if (this.fromData.protocolTypeDesc == '') {
						let data = {
							applyChannelType: this.fromData.applyChannelType,
							id: this.fromData.id,
							protocol: this.fromData.protocol,
							protocolType: this.fromData.protocolType,
						};
						this.fromData = data;
					}
					let params = this.fromData;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/cms/protocol/saveProtocol',
						data: params,
					});
					if (res && res.code == 200) {
						this.$message.success(res.message);
						this.isEdit = false;
						this.getAgreement();
						this.init.readonly = true;
					}
				} else {
					return false;
				}
			});
		},
	},
};
</script>
<style lang="scss" scoped>
.txtBox {
	height: 500px;
	overflow-y: scroll;
}
</style>
