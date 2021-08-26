<template>
	<div class="build-contract" v-if="buildContractForm">
		<guideBar />
		<!-- 新建/修改合同 -->
		<el-card>
			<el-form
				:model="buildContractForm"
				:rules="BUILD_SERVICE_CENTRE_CONTRACT_RULES_CONFIG"
				ref="buildContractForm"
				label-width="140px"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="服务中心编号" prop="storeCode">
							<el-input v-model="buildContractForm.storeCode" @change="loadInfoByStorecode">
								<el-button slot="append" icon="el-icon-search"></el-button>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col
						:span="item.type == 'textarea' ? 24 : 12"
						v-for="item in BUILD_SERVICE_CENTRE_CONTRACT_CONFIG"
						:key="item.prop"
					>
						<el-form-item :label="item.label" :prop="item.prop">
							<el-input :disabled="item.disabled" v-model="buildContractForm[item.prop]" v-if="item.type === 'input'">
								<el-button slot="append" v-if="item.button" @click="toRegister">注册</el-button>
								<el-button
									slot="prefix"
									v-if="item.slot"
									:icon="item.slotConfig.complete ? 'el-icon-success' : 'el-icon-error'"
								>
									{{ item.slotConfig.complete ? '字段齐全' : '字段不全' }}
								</el-button>
								<el-button slot="append" v-if="item.slot" @click="previewField">
									{{ item.slotConfig && item.slotConfig.text }}
								</el-button>
							</el-input>
							<el-input
								:disabled="item.disabled"
								type="textarea"
								v-model="buildContractForm[item.prop]"
								:maxlength="item.maxlength || 100"
								show-word-limit
								v-if="item.type === 'textarea'"
							></el-input>
							<el-select :disabled="item.disabled" v-model="buildContractForm[item.prop]" v-if="item.type === 'select'">
								<el-option
									:label="option.label"
									:value="option.value"
									v-for="option in item.options"
									:key="option.value"
								></el-option>
							</el-select>
							<el-date-picker
								type="year"
								placeholder="选择年度"
								v-model="buildContractForm[item.prop]"
								v-if="item.type === 'datePicker'"
								value-format="yyyy"
								:picker-options="item.config.pickerOptions || {}"
								style="width: 100%"
							></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<actiionBar>
			<span class="dialog-footer">
				<el-button :disabled="submitLoading" @click="serviceContractCancel('buildContractForm')">取 消</el-button>
				<el-button type="primary" :disabled="submitLoading" @click="serviceContractConfirm('buildContractForm')">
					保存
				</el-button>
				<el-button type="primary" :disabled="submitLoading" @click="keepSubmitContract('buildContractForm')">
					保存并提交
				</el-button>
			</span>
		</actiionBar>
		<!-- 新增成功弹窗 -->
		<el-dialog title="提示" :visible.sync="successDialog.show" width="500px" class="success-pop-box">
			<div class="content-box">
				<el-button type="success" icon="el-icon-check" circle></el-button>
				<div class="">{{ successDialog.content[successDialog.type].title }}</div>
				<div>{{ successDialog.content[successDialog.type].tip }}</div>
			</div>
			<span class="dialog-footer">
				<el-button type="primary" @click="successDialog.show = false">再次新增</el-button>
				<el-button @click="previewDetail">查看详情</el-button>
				<el-button @click="backTolist">返回列表</el-button>
			</span>
		</el-dialog>
		<!-- 查看服务中心字段匹配 -->
		<el-dialog title="模板字段预览" :visible.sync="templatePreviewVisible" width="600px">
			<tableList border :dataSource="templateFieldList" :columns="TEMPLATE_FIELD_MATCH_CONFIG" />
		</el-dialog>
	</div>
</template>

<script>
import {
	BUILD_SERVICE_CENTRE_CONTRACT_CONFIG,
	BUILD_SERVICE_CENTRE_CONTRACT_RULES_CONFIG,
	TEMPLATE_FIELD_MATCH_CONFIG,
} from './config';
import actiionBar from 'layout/actionBar.vue';
import qs from 'querystring';
const successTips = {
	1: { title: '保存成功', tip: '服务中心合同保存成功，等待提交。' },
	2: { title: '提交成功', tip: '服务中心合同提交成功。' },
};
export default {
	name: 'contractEdit',
	components: {
		actiionBar,
	},
	data() {
		return {
			BUILD_SERVICE_CENTRE_CONTRACT_CONFIG,
			BUILD_SERVICE_CENTRE_CONTRACT_RULES_CONFIG,
			TEMPLATE_FIELD_MATCH_CONFIG,
			id: '', //合同id
			buildContractForm: {},
			successDialog: { show: false, content: successTips, type: 1 },
			templatePreviewVisible: false,
			templateFieldList: [],
			submitLoading: false,
		};
	},
	watch: {
		buildContractForm: {
			handler(val) {
				this.BUILD_SERVICE_CENTRE_CONTRACT_CONFIG[6].button = !val.customerId;
				if (val.templateNo) {
					this.loadTemplateFillKeyValue();
				}
			},
			deep: true,
		},
	},
	methods: {
		// 取消新增/修改合同
		serviceContractCancel(formName) {
			this.$refs[formName].resetFields();
			this.$closeSelf();
		},
		// 注册
		toRegister() {
			this.$confirm('是否注册？', '提示')
				.then(async () => {
					const { storeCode, storeName } = this.buildContractForm;
					if (!storeCode) return this.$message.warning('请输入正确的服务中心编号');
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/store/register',
						data: { storeCode, storeName },
					});
					if (res && res.code === 200) {
						this.$message.success('注册成功');
						this.loadContractDockingInfo(storeCode);
					} else {
						this.$message.error((res && res.data.message) || '注册失败，请确认服务中心编号');
					}
				})
				.catch(() => {
					console.log('取消');
				});
		},
		// 查看字段匹配
		previewField() {
			this.templatePreviewVisible = true;
		},
		// 确定新增/修改合同
		serviceContractConfirm(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const { id } = this;
					const params = {
						...this.buildContractForm,
						id: '',
					};
					if (id == '') {
						params.id = null;
					} else {
						params.id = id;
					}
					if (!this.verifyFieldMatch()) {
						return this.$message.warning('服务中心合同必填字段不齐全');
					}
					this.submitLoading = true;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/store/addOrUpdateContract',
						data: params,
					});
					this.submitLoading = false;
					if (res && res.code === 200) {
						this.id = res.data;
						this.$message.success('操作成功');
						this.successDialog = { ...this.successDialog, show: true, type: 1 };
						this.$dispatch('CONTRACT_LIST_UPDATE');
						this.$dispatch('CONTRACT_LIST_DETAIL_UPDATE');
						this.$refs[formName].resetFields();
					} else {
						this.$message.error((res && res.data.message) || '操作失败');
					}
				}
			});
		},
		// 保存并提交合同
		async keepSubmitContract(formName) {
			if (!this.verifyFieldMatch()) {
				return this.$message.warning('服务中心合同必填字段不齐全');
			}
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/store/addAndSubmitContract',
				data: this.buildContractForm,
			});
			this.submitLoading = false;
			if (res && res.code === 200) {
				this.id = res.data;
				this.$message.success('操作成功');
				this.successDialog = { ...this.successDialog, show: true, type: 2 };
				this.$dispatch('CONTRACT_LIST_UPDATE');
				this.$dispatch('CONTRACT_LIST_DETAIL_UPDATE');
				this.$refs[formName].resetFields();
			} else {
				this.$message.error((res && res.data.message) || '操作失败');
			}
		},
		// 查看详情操作
		previewDetail() {
			this.$closeSelf();
			this.$go('service_contract_detail', { id: this.id });
		},
		// 返回列表
		backTolist() {
			this.$closeSelf();
			this.$go('service_contract_list');
		},
		// 判断字段匹配齐全与否
		verifyFieldMatch() {
			const { fieldMatch } = this.buildContractForm;
			return fieldMatch ? JSON.parse(fieldMatch) : false;
		},
		// 根据服务中心及模板编号获取填充字段-对应值
		async loadTemplateFillKeyValue() {
			const { storeCode, templateNo } = this.buildContractForm;
			const data = { storeCode, templateNo };
			const res = await this.$fetch(`/mgmt/store/getTemplateFillKeyValue?${qs.stringify(data)}`);
			if (res && res.code == 200 && res.data) {
				let hasValueArr = [];
				this.templateFieldList = res.data;
				res.data.map(item => {
					item.required = !(item.name == '负责人手机号码');
					if (item.required && (item.value == '' || !item.value)) {
						hasValueArr.push(false);
					} else {
						hasValueArr.push(true);
					}
				});
				this.BUILD_SERVICE_CENTRE_CONTRACT_CONFIG[10].slotConfig.complete = !hasValueArr.includes(false);
				this.buildContractForm.fieldMatch = JSON.stringify(
					this.BUILD_SERVICE_CENTRE_CONTRACT_CONFIG[10].slotConfig.complete
				);
			} else {
				this.$message.warning((res && res.data.message) || '模板不可用');
				this.BUILD_SERVICE_CENTRE_CONTRACT_CONFIG[10].slotConfig.complete = false;
				this.buildContractForm.fieldMatch = JSON.stringify(false);
			}
		},

		// 通过storeCode获取服务中心合同对接关联信息
		async loadContractDockingInfo(code) {
			if (!code) {
				return this.$message.warning('服务中心code为空，无法搜索');
			}
			const res = await this.$fetch(`/mgmt/store/queryStoreContractRelation?storeCode=${code}`);
			if (res && res.data) {
				const { customerId } = res.data;
				if (customerId) {
					this.buildContractForm = { ...this.buildContractForm, customerId, registerStatus: '已注册' };
					this.BUILD_SERVICE_CENTRE_CONTRACT_CONFIG[6].button = false;
					this.loadContractModules();
				} else {
					this.buildContractForm = { ...this.buildContractForm, customerId, registerStatus: '未注册' };
					this.BUILD_SERVICE_CENTRE_CONTRACT_CONFIG[8].options = [];
				}
			} else {
				this.$message.warning('获取法大大注册信息失败');
			}
		},
		// 通过storeCode获取相关信息(新建合同搜索需要)
		async loadInfoByStorecode(code) {
			if (!code) {
				return this.$message.warning('服务中心code为空，无法搜索');
			}
			const res = await this.$fetch(`/mgmt/store/searchByStoreCode?${qs.stringify({ storeCode: code })}`);
			if (res && res.data) {
				this.buildContractForm = { ...res.data };
			} else {
				this.$message.error('通过storeCode获取相关信息失败');
			}
			this.loadContractDockingInfo(code);
		},
		// 获取合同模板列表
		async loadContractModules() {
			const res = await this.$fetch(`/mgmt/store/queryContractTemplateList`);
			if (res && res.data && res.data.length > 0) {
				this.BUILD_SERVICE_CENTRE_CONTRACT_CONFIG[8].options = res.data.map(v => {
					return {
						value: v.templateNo,
						label: v.templateName,
					};
				});
			} else {
				this.$message.warning('获取合同模板信息失败');
			}
		},
		// 通过合同id获取合同信息
		async loadContractInfoById() {
			const res = await this.$fetch(`/mgmt/store/queryContractDetailById?id=${this.id}`);
			if (res && res.data) {
				const { creditNo } = res.data;
				this.buildContractForm = {
					...res.data,
					socialCreditCode: creditNo,
				};
				this.loadContractDockingInfo(res.data.storeCode);
			} else {
				this.$message.error('获取合同信息失败');
			}
		},
	},
	mounted() {
		const { id } = this.$route.query;
		if (id) {
			this.id = id;
			this.loadContractInfoById();
		}
	},
};
</script>

<style lang="scss" scoped>
::v-deep.build-contract {
	.el-select {
		width: 100%;
	}
	.el-icon-success {
		color: #67c23a;
	}
	.el-icon-error {
		color: #f56c6c;
	}
	.el-input__prefix {
		line-height: 40px;
		.el-button {
			border: none;
		}
	}
	.color_red {
		color: #f56c6c;
	}
}
::v-deep.edit-footer {
	left: auto;
	right: 0;
	width: calc(100% - 244px);
}
::v-deep.success-pop-box {
	.content-box {
		text-align: center;
		line-height: 40px;
	}
	.dialog-footer {
		margin-top: 16px;
		display: flex;
		justify-content: center;
	}
}
</style>