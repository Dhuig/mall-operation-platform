<template>
	<div class="serviceBankList">
		<guideBar>
			<el-button v-permission="'service_bank_list_add_bank'" type="primary" @click="showServiceCenter(1, 'add')">
				新增银行账号
			</el-button>
			<el-button v-permission="'service_bank_list_export_excel'" type="primary" @click="exportExcel">
				导出EXCEL
			</el-button>
		</guideBar>
		<el-card class="box-card">
			<searchPanel v-model="searchConfig" :config="SERVICE_CENTER_BANK_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeTab">
				<el-tab-pane label="全部" name="all">
					<tableList
						border
						:loading="all.loading"
						:dataSource="all.data"
						:columns="SERVICE_CENTER_BANK_COLUMS"
						:pagination="all.pagination"
						:dataTotal="all.total"
						:options="options"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="row">
							<el-button
								type="text"
								@click="editOptions(row.data, 'edit')"
								v-permission="'service_bank_list_edit'"
								v-if="row.data.verifyStatus == 1 && row.data.isUsed != 2"
							>
								修改
							</el-button>
							<el-button
								type="text"
								@click="voidOptions(row.data, 'void')"
								v-permission="'service_bank_drop'"
								v-if="row.data.verifyStatus == 1 && row.data.isUsed != 2"
							>
								作废
							</el-button>
							<el-button type="text" v-permission="'service_bank_detail'" @click="viewDetail(row.data, 'history')">
								详情
							</el-button>
							<el-button
								type="text"
								size="small"
								@click="auditOptions(row.data, 'audit')"
								v-permission="'service_bank_audit'"
								v-if="row.data.verifyStatus == 3"
							>
								审核
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="待审核" name="audit">
					<el-tabs v-model="auditActiveTab" type="card">
						<el-tab-pane :name="name" :label="label" v-for="([label, name], $idx) in TOBE_AUDIT_TABS" :key="$idx">
							<tableList
								border
								:loading="auditTabPanes[name].loading"
								:dataSource="auditTabPanes[name].data"
								:columns="SERVICE_CENTER_BANK_COLUMS"
								:pagination="auditTabPanes[name].pagination"
								:dataTotal="auditTabPanes[name].total"
								:options="{ index: true, labelIndex: '序号' }"
								@handleChangePage="handleChangePage"
								@handleSizeChange="handleSizeChange"
								slotcontent
							>
								<template slot-scope="row">
									<el-button type="text" size="small" @click="viewDetail(row.data, 'history')">详情</el-button>
									<el-button type="text" size="small" @click="auditOptions(row.data, 'audit')">审核</el-button>
								</template>
							</tableList>
						</el-tab-pane>
					</el-tabs>
				</el-tab-pane>
			</el-tabs>
		</el-card>

		<!-- 新增/编辑 -->
		<el-dialog
			:title="editDialogTitle"
			:visible.sync="isShowBankAccount"
			width="700px"
			top="5vh"
			v-drag
			class="edit-dialog"
		>
			<el-form
				class="add-rate"
				:model="ruleForm"
				:rules="CREATE_NEW_BANK_RULES"
				ref="ruleForm"
				label-width="120px"
				label-position="right"
				label-suffix=":"
			>
				<el-row :gutter="24">
					<el-col :span="12">
						<el-form-item label="服务中心编号" prop="storeCode">
							<el-input size="medium" v-model="ruleForm.storeCode" :disabled="!isAdd">
								<el-button slot="append" @click="getStoreByCode(ruleForm.storeCode)" v-if="isAdd">查询</el-button>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="服务中心名称" prop="storeName">
							{{ ruleForm.storeName }}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="24">
					<el-col :span="12">
						<el-form-item label="负责人" prop="leaderName">
							{{ ruleForm.leaderName }}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="账号名称" prop="accountName">
							{{ ruleForm.accountName }}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="24">
					<el-col :span="12">
						<el-form-item label="开户银行" prop="accountBank">
							<el-select size="medium" v-model="ruleForm.accountBank" placeholder="请选择证件类型">
								<el-option :label="item.label" v-for="item in bankDeposit" :key="item.value" :value="item.label" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="账号" prop="account">
							<el-input size="medium" v-model="ruleForm.account" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="24">
					<el-col :span="12">
						<el-form-item label="银行省份" prop="provinceName">
							<el-select
								size="medium"
								v-model="ruleForm.provinceName"
								placeholder="请选择"
								@change="ruleForm.cityName = ''"
							>
								<el-option :label="item.label" v-for="item in provinces" :key="item.value" :value="item.label" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="银行城市" prop="cityName">
							<el-select size="medium" v-model="ruleForm.cityName" placeholder="请选择">
								<el-option :label="item.label" v-for="item in citys" :key="item.value" :value="item.label" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="24">
					<el-col :span="12">
						<el-form-item label="开户行名称" prop="branch">
							<el-input size="medium" v-model="ruleForm.branch" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="账户类型" prop="accountType">
							<el-select size="medium" v-model="ruleForm.accountType" placeholder="请选择账户类型">
								<el-option :label="item.label" v-for="item in ACCOUNTTYPE" :key="item.value" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="24">
					<el-col :span="12">
						<el-form-item label="是否扣款账号" prop="isDeduction">
							<el-checkbox @change="changeisDeduction" v-model="check"></el-checkbox>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="开户许可证" prop="permissionUrl">
							<el-upload
								class="avatar-uploader"
								:action="$store.getters['system/getOssUploadUrl']"
								:headers="$store.getters['system/getSignatureVerification']"
								:data="uploadParams"
								:show-file-list="false"
								:before-upload="beforeAvatarUpload"
								:on-success="handlePermissionUrlSuccess"
							>
								<img v-if="ruleForm.permissionUrl" :src="ruleForm.permissionUrl" class="avatar" />
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
							<div class="upload-tips">支持格式：bmp、jpg、png，文件不能超过4MB</div>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm('ruleForm')" class="save">{{ isAdd ? '提交' : '修改' }}</el-button>
				<el-button @click="resetForm('ruleForm')" class="cacel">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 审核 -->
		<el-dialog v-drag :title="auditDialogTitle" :visible.sync="isShowAduit" top="5vh" width="700px" class="edit-dialog">
			<el-form
				class="add-rate"
				:model="auditFrom"
				ref="aduitForm"
				:rules="AUDIT_FORM_RULES"
				label-width="120px"
				label-position="right"
				label-suffix=":"
			>
				<el-row :gutter="24">
					<el-col :span="12">
						<el-form-item label="服务中心编号" prop="storeCode">
							{{ auditFrom.storeCode }}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="服务中心名称" prop="storeName">
							{{ auditFrom.storeName }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="负责人" prop="leaderName">
							{{ auditFrom.leaderName }}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="账户名称" prop="accountName">
							{{ auditFrom.accountName }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="开户银行" prop="accountBank">
							{{ auditFrom.accountBank }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="账号" prop="account">
							{{ auditFrom.account }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="银行省份" prop="provinceName">
							{{ auditFrom.provinceName }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="银行城市" prop="cityName">
							{{ auditFrom.cityName }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="开户行名称" prop="branch">
							{{ auditFrom.branch }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="账户性质" prop="accountType">
							{{ (auditFrom.accountType && ACCOUNTLIST[auditFrom.accountType]) || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否扣款账号" prop="isDeduction">
							{{ (auditFrom.isDeduction && ISDEDUCTION[auditFrom.isDeduction]) || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="审核类型">
							{{ (auditFrom.opType && OPTYPE[auditFrom.opType] + '审核') || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="开户许可证">
							<el-image
								fit="scale-down"
								class="image-wrap"
								v-if="auditFrom.permissionUrl"
								:src="auditFrom.permissionUrl"
								:preview-src-list="[auditFrom.permissionUrl]"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="审核结果" prop="verifyStatus">
							<el-select size="medium" v-model="auditFrom.verifyStatus" placeholder="请选择审核结果">
								<el-option :label="item.label" v-for="item in ADUITRESULT" :key="item.value" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="审核备注" prop="verifyRemark">
							<el-input type="textarea" v-model="auditFrom.verifyRemark" maxlength="100" show-word-limit></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="aduitForm('aduitForm')" class="save">审核</el-button>
				<el-button @click="resetAduitForm('aduitForm')" class="cacel">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {
	SERVICE_CENTER_BANK_CONFIG,
	SERVICE_CENTER_BANK_COLUMS,
	DataKey,
	CREATE_NEW_BANK_RULES,
	ACCOUNTTYPE,
	ADUITRESULT,
	ACCOUNTLIST,
	ISDEDUCTION,
	SWITCH_COLUMS_STATUS,
	TOBE_AUDIT_TABS,
	TOBE_AUDIT_TABS_VALUE,
	OPTYPE,
	AUDIT_FORM_RULES,
} from './config.js';
import { exportExcel } from 'util';
import { uploadFileType } from 'util/formValidation';
import qs from 'querystring';
export default {
	name: 'serviceBankList',
	data() {
		return {
			SERVICE_CENTER_BANK_CONFIG,
			SERVICE_CENTER_BANK_COLUMS,
			CREATE_NEW_BANK_RULES,
			ACCOUNTTYPE,
			ADUITRESULT,
			ACCOUNTLIST,
			ISDEDUCTION,
			SWITCH_COLUMS_STATUS,
			TOBE_AUDIT_TABS,
			TOBE_AUDIT_TABS_VALUE,
			OPTYPE,
			AUDIT_FORM_RULES,
			ruleForm: Object.assign({ ...DataKey }),
			isShowAduit: false,
			check: false,
			searchConfig: {
				companyCode: null,
				isUsed: null,
				leaderCardNo: null,
				storeCode: null,
			},
			activeTab: 'all',
			auditActiveTab: 'allAudit',
			isShowBankAccount: false,
			isAdd: false,
			auditFrom: {
				id: 0,
				verifyRemark: '',
				verifyStatus: 0,
			},
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			all: {
				loading: false,
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				total: 0,
			},
			auditTabPanes: {
				allAudit: {
					loading: false,
					data: [],
					pagination: {
						currentPage: 1,
						pageSize: 10,
					},
					total: 0,
				},
				addAudit: {
					loading: false,
					data: [],
					pagination: {
						currentPage: 1,
						pageSize: 10,
					},
					total: 0,
				},
				editAudit: {
					loading: false,
					data: [],
					pagination: {
						currentPage: 1,
						pageSize: 10,
					},
					total: 0,
				},
				delAudit: {
					loading: false,
					data: [],
					pagination: {
						currentPage: 1,
						pageSize: 10,
					},
					total: 0,
				},
			},
			bankDeposit: [], //开户银行列表
			provinces: [],
			citys: [],
		};
	},
	mounted() {
		this.getCrmLovListByType();
		this.loadProvinces();
	},

	watch: {
		activeTab() {
			this.loadData();
		},
		auditActiveTab: {
			handler() {
				this.loadData();
			},
			immediate: true,
		},
		'ruleForm.provinceName'(val) {
			if (val) {
				const { provinceName } = this.ruleForm;
				const curProvince = this.provinces.filter(item => {
					return item.label == provinceName;
				});
				this.loadCitys(curProvince[0].value);
			}
		},
	},
	computed: {
		loadDataPost() {
			const { searchConfig, activeTab, auditActiveTab } = this;
			let data = {};
			if (activeTab == 'audit') {
				const {
					pagination: { currentPage: pageNum, pageSize },
				} = this.auditTabPanes[auditActiveTab];
				data = { pageNum, pageSize };
			} else {
				const {
					pagination: { currentPage: pageNum, pageSize },
				} = this[activeTab];
				data = { pageNum, pageSize };
			}
			data = { ...data, ...searchConfig };
			return data;
		},
		// 搜索参数
		searchFields() {
			const { searchConfig } = this;
			return {
				...searchConfig,
			};
		},
		uploadParams() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.service,
			};
			return params;
		},
		verifyStatus() {
			const { activeTab } = this;
			return activeTab == 'audit' ? 3 : null;
		},
		tableName() {
			const { activeTab, auditActiveTab } = this;
			return activeTab == 'audit' ? this.auditTabPanes[auditActiveTab] : this[activeTab];
		},
		editDialogTitle() {
			return this.isAdd ? '新增银行账号' : '编辑银行账号';
		},
		auditDialogTitle() {
			const { opType } = this.auditFrom;
			let title;
			switch (opType) {
				case 1:
					title = '新增';
					break;
				case 2:
					title = '修改';
					break;
				case 3:
					title = '删除';
					break;
				default:
					title = '新增';
			}
			return title + '账号审核';
		},
	},
	methods: {
		beforeAvatarUpload(file) {
			const whiteList = ['jpg', 'png', 'bmp'];
			return uploadFileType.call(this, file, whiteList, 4);
		},
		// 搜索
		handleSearch() {
			this.activeTab = 'all';
			this.tableName.pagination.currentPage = 1;
			this.loadData();
		},
		// 修改
		editOptions(row) {
			this.showServiceCenter(row, 'edit');
		},
		// 作废
		voidOptions(row) {
			this.$confirm('此操作将作废该银行账户, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.toVoid(row);
				})
				.catch(() => {
					this.$message.info('已取消');
				});
		},
		// 详情
		viewDetail(row) {
			const { companyName, storeCode, storeName, leaderNo, leaderName, id } = row;
			this.$go('service_bank_detail', { companyName, storeCode, storeName, leaderNo, leaderName, id });
		},
		// 审核
		auditOptions(row) {
			this.isShowAduit = true;
			this.$nextTick(() => {
				this.auditFrom = { ...row };
				this.auditFrom.verifyStatus = null;
			});
		},
		// 获取开户银行列表
		async getCrmLovListByType() {
			const res = await this.$fetch(`/crm/lov/getCrmLovListByType?dictType=openBankCode`);
			if (res && res.code === 200) {
				this.bankDeposit = res.data.map(({ name: label, id: value }) => ({ label, value }));
			} else {
				this.$message.error('获取开户银行列表数据，请查询服务是否可用');
			}
		},
		resetAduitForm() {
			(this.auditFrom = {
				id: 0,
				verifyRemark: '',
				verifyStatus: 0,
			}),
				(this.isShowAduit = false);
		},
		// 分页触发事件
		handleChangePage(page) {
			this.tableName.pagination.currentPage = page;
			this.loadData();
		},
		// 分页下拉触发事件
		handleSizeChange(pageSize) {
			this.tableName.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 显示更新服务中心银行弹窗
		showServiceCenter(row, type) {
			this.isShowBankAccount = !this.isShowBankAccount;
			if (type == 'add') {
				this.isAdd = true;
				this.ruleForm = Object.assign({ ...DataKey });
			} else {
				this.isAdd = false;
				this.$nextTick(() => {
					this.ruleForm = { ...row };
					this.check = row.isDeduction == 1;
				});
			}
		},
		// 导出EXCEL
		exportExcel() {
			const { searchFields } = this;
			const params = {
				...searchFields,
			};
			exportExcel('/mgmt/store/exportBankAccount', params);
		},
		// 添加服务中心银行账号
		async addBankAccount(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/store/addOrUpdateBankAccount',
				data: params,
			});
			if (res && res.code === 200) {
				this.loadData();
				this.$message.success('添加服务中心银行账号成功');
				this.resetForm('ruleForm');
				this.check = false;
			} else {
				this.$message.error((res && res.data.message) || '操作失败');
			}
		},
		// 审批 银行账号
		aduitForm(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const res = await this.$fetch({
						method: 'post',
						url: '/mgmt/store/verifyBankAccount',
						data: this.auditFrom,
					});
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.resetAduitForm();
						this.isShowAduit = false;
						this.loadData();
					} else {
						this.$message.error((res && res.data.message) || '操作失败');
					}
				}
			});
		},
		// 作废
		async toVoid(row) {
			const res = await this.$fetch(`/mgmt/store/delBankAccount?accountId=${row.id}`);
			if (res && res.code === 200) {
				this.$message.success('操作成功');
				this.loadData();
			} else {
				this.$message.error((res && res.data.message) || '操作失败');
			}
		},
		// 更新银行账号
		async updateBankAccount(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/store/updateBankAccount',
				data: params,
			});
			if (res && res.code === 200) {
				this.loadData();
				this.$message.success('操作成功');
				this.resetForm('ruleForm');
				this.check = false;
			} else {
				this.$message.error((res && res.data.message) || '操作失败');
			}
		},
		// 根据服务中心编号获取服务中心
		async getStoreByCode(code) {
			if (code) {
				const params = { code };
				const res = await this.$fetch(`/mgmt/store/getStoreByCode?${qs.stringify(params)}`);
				if (res && res.code === 200) {
					const storeName = res.data?.store?.name;
					const leaderName = res.data?.user?.realname;
					this.ruleForm = { ...this.ruleForm, storeName, leaderName, accountName: storeName };
				} else {
					this.$message.error((res && res.data.message) || '获取服务中心信息失败');
				}
			} else {
				this.$message.warning(`请输入服务中心编号`);
			}
		},
		changeisDeduction(val) {
			if (val) {
				this.ruleForm.isDeduction = 1;
			} else {
				this.ruleForm.isDeduction = 2;
			}
		},
		submitForm(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					let params = this.ruleForm;
					if (this.isAdd) {
						'id' in params && delete params.id;
						this.addBankAccount(params);
					} else {
						this.updateBankAccount(params);
					}
				}
			});
		},
		// 取消
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.check = false;
			this.isShowBankAccount = false;
		},
		// 获取省份数据
		async loadProvinces() {
			const res = await this.$fetch(`/mgmt/sys/getProvinceList`);
			if (res && res.code === 200 && res.data) {
				this.provinces = res.data.map(({ provinceName, provinceCode }) => ({
					label: provinceName,
					value: provinceCode,
				}));
			} else {
				this.$message.warning('获取省份数据失败，请查询服务是否可用');
			}
		},
		// 获取市级数据
		async loadCitys(provinceCode) {
			const res = await this.$fetch(`/mgmt/sys/listCityAndDistrict?provinceCode=${provinceCode}`);
			if (res && res.code === 200 && res.data) {
				this.citys = res.data.map(({ cityName, cityCode }) => ({
					label: cityName,
					value: cityCode,
				}));
			} else {
				this.$message.warning('获取市级数据失败，请查询服务是否可用');
			}
		},
		// 开户许可证上传成功回调
		handlePermissionUrlSuccess(res) {
			this.ruleForm.permissionUrl = res.datas.fileUrlKey;
		},
		// 请求服务中心银行列表
		async loadData() {
			const { verifyStatus, auditActiveTab, TOBE_AUDIT_TABS_VALUE } = this;
			this.tableName.loading = true;
			const params = {
				opType: verifyStatus ? TOBE_AUDIT_TABS_VALUE[auditActiveTab] : verifyStatus,
				verifyStatus,
				...this.loadDataPost,
			};
			const res = await this.$fetch({
				url: `/mgmt/store/listBankAccount?${qs.stringify(params)}`,
				callback: () => {
					this.tableName.loading = false;
				},
			});
			if (res && res.code == 200 && res.data) {
				const { list, total } = res.data;
				if (!list.length) {
					this.$message.warning('查询的银行帐号数据为空,请更换搜索条件再试');
				}
				this.tableName.data = list;
				this.tableName.total = total;
			} else {
				this.tableName.data = [];
				this.tableName.total = 0;
				this.$message.warning('查询的银行帐号数据为空,请更换搜索条件再试');
			}
		},
	},
};
</script>
<style lang="scss" scoped>
::v-deep.serviceBankList {
	.edit-dialog {
		.add-rate {
			max-height: 65vh;
			width: 100%;
			overflow-x: hidden;
			overflow-y: auto;
		}
		.el-input-group__append {
			background: $primary;
			color: #fff;
		}
		.el-form-item {
			margin-bottom: 16px;
		}
	}
	.mark_red {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 10px;
		box-sizing: border-box;
		background: $error;
	}
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 128px;
		height: 128px;
		line-height: 128px;
		text-align: center;
	}
	.avatar {
		width: 128px;
		height: 128px;
		display: block;
	}
	.upload-tips {
		font-size: 12px;
		line-height: 20px;
	}
	.image-wrap {
		> img {
			width: 100px;
		}
	}
}
</style>
