<template>
	<div>
		<guideBar />
		<!-- 服务公司信息 -->
		<el-card class="part-gap">
			<h3>服务公司信息</h3>
			<el-form
				:model="detail"
				:disabled="type === 'preview'"
				:rules="COMPANY_RULES"
				ref="companyData"
				inline
				label-position="right"
				label-width="140px"
				label-suffix=":"
			>
				<el-row>
					<el-form-item label="服务公司编号" v-if="type !== 'add'">
						<el-input
							size="small"
							maxlength="10"
							:placeholder="placeholderData.serviceId"
							v-model="detail.serviceId"
							class="input-item"
							disabled
						/>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="服务公司名称" prop="serviceName">
						<el-input
							size="small"
							maxlength="20"
							:placeholder="placeholderData.serviceName"
							v-model="detail.serviceName"
							style="width: 250px;"
						/>
					</el-form-item>
					<el-form-item label="法人" prop="legalPerson">
						<el-input
							size="small"
							maxlength="10"
							:placeholder="placeholderData.legalPerson"
							v-model="detail.legalPerson"
							class="input-item"
						/>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="法人与本人关系" prop="legalPersonOn">
						<el-select
							size="small"
							v-model="detail.legalPersonOn"
							:placeholder="placeholderData.legalPersonOn"
							class="input-item"
						>
							<el-option
								v-for="(option, $idx) in RELATIONSHIP_OPTIONS"
								:key="$idx"
								:label="option.label"
								:value="option.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item label="企业类型">
						<el-input
							size="small"
							:placeholder="placeholderData.companyType"
							v-model="detail.companyType"
							class="input-item"
						/>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="纳税人识别号" prop="taxpayerNumber">
						<el-input
							size="small"
							:placeholder="placeholderData.taxpayerNumber"
							v-model="detail.taxpayerNumber"
							class="input-item"
						/>
					</el-form-item>
					<el-form-item label="纳税方式">
						<el-input
							size="small"
							:placeholder="placeholderData.taxMethod"
							v-model="detail.taxMethod"
							class="input-item"
						/>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="所属分公司编号" prop="belongToCode">
						<!-- <el-input
							size="small"
							v-model="detail.belongToCode"
							placeholder="请填写所属分公司编号"
							@blur="branchOfficeInfo"
							class="input-item"
						/>-->
						<el-select
							class="branch_office"
							v-model="detail.belongToCode"
							filterable
							@change="branchOfficeInfo"
							:placeholder="placeholderData.belongToCode"
						>
							<el-option
								v-for="item in companyOptions"
								:key="item.code"
								:label="`${item.code} ${item.fullName}`"
								:value="item.code"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所属分公司名称" v-if="type !== 'preview'">
						<el-input
							size="small"
							:placeholder="placeholderData.belongName"
							v-model="detail.belongName"
							disabled
							class="input-item"
						/>
					</el-form-item>
					<el-form-item label="邮政编码" prop="postalCode">
						<el-input
							size="small"
							:placeholder="placeholderData.postalCode"
							v-model="detail.postalCode"
							maxlength="6"
							class="input-item"
						/>
					</el-form-item>
					<el-form-item label="(服务公司)电子邮箱">
						<el-input
							style="width: 220px;"
							size="small"
							:placeholder="placeholderData.serviceCompanyMail"
							v-model="detail.serviceCompanyMail"
							@blur="emailBlur"
						/>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="省份名称" prop="province">
						<el-input
							size="small"
							:placeholder="placeholderData.provinceName"
							v-model="detail.provinceName"
							disabled
							class="input-item"
						/>
					</el-form-item>
					<el-form-item label="省份编号" v-if="type === 'preview'">
						<el-input size="small" v-model="detail.province" disabled class="input-item" />
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="营业执照地址" prop="businessLicenseSite">
						<el-cascader
							class="site-item bank-district"
							ref="bl-elcascader"
							size="medium"
							v-model="detail.businessLicenseSite"
							:props="lazyProps"
							:placeholder="placeholderData.businessLicenseSite"
							@change="handleChangeSite"
						/>
						<el-input
							size="small"
							:placeholder="placeholderData.businessLicenseDetailed"
							v-model="detail.businessLicenseDetailed"
							class="input-item3"
						/>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="联系地址">
						<el-cascader
							class="site-item bank-district"
							ref="address-elcascader"
							size="medium"
							v-model="addressSite"
							:props="lazyProps"
							:placeholder="placeholderData.addressSite"
							@change="handleChangeSite"
						/>
						<el-input
							size="small"
							:placeholder="placeholderData.addressDetailed"
							v-model="detail.addressDetailed"
							class="input-item3"
						/>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="是否上海">
						<el-select
							size="small"
							v-model="detail.isItShanghai"
							:placeholder="placeholderData.isItShanghai"
							class="input-item2"
						>
							<el-option
								v-for="(option, $idx) in IS_SHANGHAI_OPTIONS"
								:key="$idx"
								:label="option.label"
								:value="option.value"
							/>
						</el-select>
					</el-form-item>
				</el-row>
			</el-form>
		</el-card>
		<!-- 客户信息 -->
		<el-card class="part-gap">
			<h3>客户信息</h3>
			<el-form
				:model="detail"
				:disabled="type === 'preview'"
				inline
				label-position="right"
				label-width="140px"
				label-suffix=":"
			>
				<el-row>
					<el-form-item label="会员卡号" required>
						<el-input
							size="small"
							:value="detail.cardNo"
							class="input-item"
							v-on:input="handleCardNoChange"
							:placeholder="placeholderData.cardNo"
							clearable
						/>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="顾客姓名">
						<el-input
							size="small"
							disabled
							:placeholder="placeholderData.name"
							v-model="detail.name"
							class="input-item"
						/>
					</el-form-item>
					<el-form-item label="配偶姓名">
						<el-input
							size="small"
							disabled
							:placeholder="placeholderData.spouseName"
							v-model="detail.spouseName"
							class="input-item"
						/>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="电子邮箱">
						<el-input
							size="small"
							disabled
							:placeholder="placeholderData.mail"
							v-model="detail.mail"
							class="input-item"
						/>
					</el-form-item>
					<el-form-item label="手机号码">
						<el-input
							size="small"
							disabled
							:placeholder="placeholderData.phoneNumber"
							v-model="detail.phoneNumber"
							class="input-item"
						/>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="服务中心编号">
						<el-input
							size="small"
							disabled
							:placeholder="placeholderData.serviceCode"
							v-model="detail.serviceCode"
							class="input-item"
						/>
					</el-form-item>
					<el-form-item label="联系电话">
						<el-input
							size="small"
							maxlength="11"
							:placeholder="placeholderData.serviceNumber"
							v-model="detail.serviceNumber"
							class="input-item"
						/>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="服务中心邮箱">
						<el-input
							size="small"
							disabled
							:placeholder="placeholderData.serviceMail"
							v-model="detail.serviceMail"
							class="input-item"
						/>
					</el-form-item>
					<el-form-item label="座机">
						<el-input
							size="small"
							:placeholder="placeholderData.serviceLandline"
							v-model="detail.serviceLandline"
							class="input-item"
						/>
					</el-form-item>
				</el-row>
			</el-form>
		</el-card>
		<!-- 银行信息 -->
		<el-card class="part-gap">
			<h3>银行信息</h3>
			<el-form
				:model="detail"
				:rules="COMPANY_BANK_RULES"
				ref="companyBankData"
				:disabled="type === 'preview'"
				inline
				label-position="right"
				label-width="140px"
				label-suffix=":"
			>
				<el-row>
					<el-form-item label="账户名称" prop="bankAccountName">
						<el-input
							size="small"
							v-model="detail.bankAccountName"
							:placeholder="placeholderData.bankAccountName"
							class="input-item"
						/>
					</el-form-item>
					<el-form-item label="银行名称" prop="bankName">
						<el-input
							size="small"
							v-model="detail.bankName"
							:placeholder="placeholderData.bankName"
							class="input-item"
						/>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="开户银行" prop="bankId">
						<el-select size="small" v-model="detail.bankId" class="input-item">
							<el-option
								v-for="(option, key) in bankTypeOptions"
								:key="key"
								:label="option.name"
								:value="option.code"
							/>
						</el-select>
						<span class="bank_code">{{ detail.bankId }}</span>
					</el-form-item>
					<el-form-item label="银行账号" prop="bankNumber">
						<el-input
							size="small"
							v-model="detail.bankNumber"
							:placeholder="placeholderData.bankNumber"
							class="input-item"
						/>
					</el-form-item>
					<el-form-item label="账户性质">
						<el-select size="small" v-model="detail.bankType" class="input-item" disabled>
							<el-option
								v-for="(option, $idx) in ACCOUNT_PROPERTY_OPTIONS"
								:key="$idx"
								:label="option.label"
								:value="option.value"
							/>
						</el-select>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="所属省市" prop="bankSite">
						<el-cascader
							class="site-item bank-district"
							ref="bank-elcascader"
							size="medium"
							v-model="detail.bankSite"
							:props="bankLazyProps"
							:placeholder="placeholderData.bankSite"
							@change="handleChangeSite"
						/>
					</el-form-item>
				</el-row>
			</el-form>
		</el-card>
		<!-- 附件资料 -->
		<el-card class="part-gap">
			<h3>附件资料</h3>
			<tableList :dataSource="detail.serviceFiles" :columns="SERVICE_COMPANY_ATTACH_COLUMNS" slotcontent>
				<template slot-scope="scope">
					<div class="upload_div">
						<el-upload
							class="upload-demo"
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							ref="uploadFile"
							:data="uploadParams"
							:http-request="file => uploadCustom(file, scope)"
							:show-file-list="false"
						>
							<el-button size="medium" type="text" v-if="type !== 'preview'">上传文件</el-button>
						</el-upload>
						<el-button
							type="text"
							@click="crmFilesDownload(scope.data)"
							v-if="scope.data.file != '' && type !== 'preview'"
						>
							下载文件
						</el-button>
						<el-button type="text" @click="delFiles(scope)" v-if="scope.data.file != '' && type !== 'preview'">
							删除
						</el-button>
						<el-button type="text" v-if="type === 'preview' && scope.data.file !== ''" @click="handlePreview(scope)">
							预览
						</el-button>
					</div>
				</template>
			</tableList>
		</el-card>
		<!-- 操作信息 -->
		<el-card class="part-gap" v-if="type === 'preview'">
			<h3>操作信息</h3>
			<tableList :dataSource="operationRecord" :columns="OPERATION_RECORD_COLUMNS"></tableList>
		</el-card>
		<!-- 底部编辑区(查看服务公司详情时用) -->
		<!-- {{VALIDATE_STATUS_MAP.DRAFT}}
		{{VALIDATE_STATUS_MAP.TO_BE_CHECK}}-->
		<actionBar v-if="!/preview/.test(type) || (/preview/.test(type) && state === 2)">
			<template v-if="/add/.test(type)">
				<el-button @click="cancelServiceCompanyInfo(1)">取消</el-button>
				<el-button type="primary" :disabled="butState" @click="saveServiceCompanysubmit(1)">保存</el-button>
				<el-button type="primary" :disabled="butState" @click="saveServiceCompanysubmit(2)">提交</el-button>
			</template>
			<template v-if="/edit/.test(type)">
				<el-button @click="cancelServiceCompanyInfo">取消</el-button>
				<el-button type="success" :disabled="butState" @click="saveServiceCompanysubmit(3)">保存</el-button>
				<el-button type="success" :disabled="butState" @click="saveServiceCompanysubmit(4)">提交</el-button>
			</template>
			<template v-if="/preview/.test(type)">
				<el-button type="primary" :disabled="butState" @click="passPrimaryCheck">通过初审</el-button>
				<el-button type="primary" :disabled="butState" @click="notPassPrimaryCheck">不通过</el-button>
			</template>
		</actionBar>
		<!-- 通过审批模态框 -->
		<el-dialog title="审核提示" :visible.sync="notPassModal.show" width="32%" v-drag>
			<div>
				<p class="notpass-tips">{{ notPassModal.titile }}</p>
				<el-select
					v-model="notPassModal.result"
					v-if="notPassModal.state === 2"
					placeholder="选择原因"
					class="notpass-select"
					size="small"
					@change="reasonNoChange"
				>
					<el-option v-for="(item, key) in examineNoData" :key="key" :value="item.id" :label="item.reasonName" />
				</el-select>
				<el-input type="textarea" :disabled="notPassModal.state === 2" v-model="notPassModal.reason" />
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="notpassCancel">取 消</el-button>
				<el-button type="primary" @click="notpassConfirm">确认</el-button>
			</span>
		</el-dialog>
		<!-- 附件资料预览 -->
		<el-dialog class="enclosure_img" title="预览" :visible.sync="previewDialog" width="40%" v-drag>
			<img class="preview_img" :src="previewUrl" alt />
		</el-dialog>
	</div>
</template>

<script>
import { optionGenerator } from 'util';
import { downloadFile } from 'util/formValidation';
import maps from 'config/map';
import { filters } from 'plugins/filters.js';
import {
	SERVICE_COMPANY_ATTACH_COLUMNS,
	LEGAL_PERSON_RELATIONSHIP,
	IS_SHANGHAI,
	VALIDATE_STATUS_MAP,
	ACCOUNT_PROPERTY,
	FILE_TYPE,
	COMPANY_RULES,
	COMPANY_BANK_RULES,
	OPERATION_RECORD_COLUMNS,
} from './config';
import signatureManger from 'util/verifySignature';
export default {
	name: 'serviceCompanyUpdate',
	data() {
		// 服务公司附件资料 默认列表
		const DEFAULT_FILE_TYPE_LIST = Object.entries(FILE_TYPE).map(([fileType, dataName]) => ({
			dataName,
			file: '',
			fileType: Number(fileType),
			uploadedBy: '',
			uploadTimeShow: '',
		}));
		return {
			FILE_TYPE,
			VALIDATE_STATUS_MAP,
			SERVICE_COMPANY_ATTACH_COLUMNS,
			RELATIONSHIP_OPTIONS: optionGenerator(LEGAL_PERSON_RELATIONSHIP),
			IS_SHANGHAI_OPTIONS: optionGenerator(IS_SHANGHAI),
			ACCOUNT_PROPERTY_OPTIONS: optionGenerator(ACCOUNT_PROPERTY),
			COMPANY_RULES,
			COMPANY_BANK_RULES,
			OPERATION_RECORD_COLUMNS,
			provinceOptions: [
				{ label: '广东', value: '0' },
				{ label: '湖南', value: '1' },
			],
			cityOptions: [
				{ label: '广州', value: '0' },
				{ label: '长沙', value: '1' },
			],
			areaOptions: [
				{ label: '天河路', value: '0' },
				{ label: '市中心', value: '1' },
			],
			uploadParams: {
				file: '',
			},
			bankTypeOptions: [],
			id: '',
			type: '',
			detail: {
				// 审批状态
				state: 1,
				// 服务公司信息
				serviceId: '',
				serviceName: '',
				legalPerson: '',
				legalPersonOn: 1,
				companyType: '',
				belongToCode: '',
				belongName: '',
				province: '',
				provinceName: '',
				postalCode: '',
				taxpayerNumber: '',
				taxMethod: '',
				businessLicenseProvince: '',
				businessLicenseCity: '',
				businessLicenseArea: '',
				businessLicenseDetailed: '',
				addressProvince: '',
				addressCity: '',
				addressArea: '',
				addressDetailed: '',
				isItShanghai: 2,
				serviceCompanyMail: '',
				// 客户信息
				memberId: '',
				cardNo: '',
				name: '',
				spouseName: '',
				mail: '',
				phoneNumber: '',
				serviceCode: '',
				serviceNumber: '',
				serviceMail: '',
				serviceLandline: '',
				// 银行信息
				bankAccountName: '',
				bankName: '',
				bankId: '',
				bankNumber: '',
				bankType: 1,
				bankProvince: '',
				bankCity: '',
				bankArea: '',
				// 服务公司文件
				serviceFiles: DEFAULT_FILE_TYPE_LIST,
				businessLicenseSite: [], // 营业执照省市区
				bankSite: [], // 银行信息省市区
			},
			oldDetail: {},
			oldServiceFiles: DEFAULT_FILE_TYPE_LIST,
			notPassModal: {
				show: false,
				result: '',
				reason: '',
				titile: '审核通过原因',
				state: 1,
			},
			examineNoData: [], // 审核不通过原因数据
			// businessLicenseSite: [], // 营业执照省市区
			addressSite: [], // 联系地址省市区
			// bankSite:[], // 银行信息省市区
			lazyProps: {
				lazy: true, //  是否开启懒加载
				lazyLoad: this.lazyLoad, // 加载函数
			},
			// 银行
			bankLazyProps: {
				lazy: true, //  是否开启懒加载
				lazyLoad: this.bankLazyLoad, // 加载函数
			},
			state: 0,
			companyOptions: [],
			checkEmail: true, // (服务公司)电子邮箱验证
			operationRecord: [], // 操作记录
			previewDialog: false, // 预览
			previewUrl: '', // 预览
			// 占位符提示
			placeholderData: {
				serviceId: '请填写服务公司编号',
				serviceName: '请填写服务公司名称',
				legalPerson: '请填写服务公司法人姓名',
				legalPersonOn: '请选择双方关系',
				companyType: '请填写企业类型',
				taxpayerNumber: '请填写纳税人识别号',
				taxMethod: '请填写纳税方式',
				belongToCode: '请选择所属分公司',
				belongName: '输入所属分公司编码后带出',
				postalCode: '请填写邮政编号',
				serviceCompanyMail: '请填写(服务公司)电子邮箱',
				provinceName: '输入所属分公司编码后带出',
				businessLicenseSite: '请选择营业执照地址',
				businessLicenseDetailed: '请输入详细的地址',
				addressSite: '请选择联系地址',
				addressDetailed: '请输入详细的地址',
				isItShanghai: '请选择是否上海',
				// 客户信息
				cardNo: '输入会员卡号会自动带出会员信息',
				name: '顾客姓名',
				spouseName: '配偶姓名',
				mail: '电子邮箱',
				phoneNumber: '手机号码',
				serviceCode: '服务中心编号',
				serviceNumber: '联系电话',
				serviceMail: '服务中心邮箱',
				serviceLandline: '座机',
				// 银行信息
				bankAccountName: '请输入账户名称',
				bankNumber: '请输入银行账号',
				bankSite: '请选择所属省市',
				bankName: '请输入银行名称',
			},
			butState: false, // 按钮状态
		};
	},
	methods: {
		emailBlur() {
			if (this.detail.serviceCompanyMail === '') {
				return;
			}
			let reg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
			if (!reg.test(this.detail.serviceCompanyMail)) {
				this.$message({
					type: 'warning',
					message: '请填写正确邮箱格式',
				});
			}
			this.checkEmail = reg.test(this.detail.serviceCompanyMail);
		},
		// 附件预览
		handlePreview(val) {
			this.previewDialog = true;
			this.previewUrl = val.data.file;
		},
		// 省市区
		handleChangeSite() {
			// 营业执照
			if (this.detail.businessLicenseSite && this.detail.businessLicenseSite.length != 0) {
				this.detail.businessLicenseProvince = this.detail.businessLicenseSite[0];
				this.detail.businessLicenseCity = this.detail.businessLicenseSite[1];
				this.detail.businessLicenseArea = this.detail.businessLicenseSite[2];
			}
			// 联系地址
			if (this.addressSite && this.addressSite.length != 0) {
				this.detail.addressProvince = this.addressSite[0];
				this.detail.addressCity = this.addressSite[1];
				this.detail.addressArea = this.addressSite[2];
			}
			// 银行信息
			if (this.detail.bankSite && this.detail.bankSite.length != 0) {
				this.detail.bankProvince = this.detail.bankSite[0];
				this.detail.bankCity = this.detail.bankSite[1];
				this.detail.bankArea = this.detail.bankSite[2];
			}
			if (this.type == 'preview') {
				this.$nextTick(() => {
					this.$refs.companyData.clearValidate();
				});
			}
		},

		// 银行懒加载
		bankLazyLoad(node, resolve) {
			const { level } = node;
			if (level == 0) {
				let nodes = maps.map(item => {
					return {
						value: item.value,
						label: item.label,
						leaf: false,
					};
				});
				resolve(nodes);
			} else if (level == 1) {
				const id = node.data.value;
				let data = [];
				maps.forEach(i => {
					if (i.value === id) {
						data = i.children;
					}
				});
				let nodes = data.map(item => {
					return {
						value: item.value,
						label: item.label,
						leaf: true,
					};
				});
				resolve(nodes);
			}
		},
		// 懒加载
		lazyLoad(node, resolve) {
			const { level } = node;
			if (level == 0) {
				let nodes = maps.map(item => {
					return {
						value: item.value,
						label: item.label,
						leaf: false,
					};
				});
				resolve(nodes);
			} else if (level == 1) {
				const id = node.data.value;
				let data = [];
				maps.forEach(i => {
					if (i.value === id) {
						data = i.children;
					}
				});
				let nodes = data.map(item => {
					return {
						value: item.value,
						label: item.label,
						leaf: false,
					};
				});
				resolve(nodes);
			} else if (level == 2) {
				const id = node.data.value;
				let data = [];
				maps.forEach(i => {
					i.children &&
						i.children.length > 0 &&
						i.children.forEach(j => {
							if (j.value === id) {
								data = j.children;
							}
						});
				});
				let nodes = data.map(item => {
					return {
						value: item.value,
						label: item.label,
						leaf: true,
					};
				});
				resolve(nodes);
			}
		},
		rewritePlace(data, cityStore) {
			let index = 0;
			let result = [];
			if (!data) {
				return;
			}
			const loop = (data, cityStore) => {
				if (!cityStore) return;
				cityStore.forEach(item => {
					if (data[index]) {
						if (item.value == data[index]) {
							result.push(item.label);
							if (item.children) {
								index++;
								loop(data, item.children);
							}
						}
					}
				});
			};
			loop(data, cityStore);
			return result;
		},
		// 自定义上传
		async uploadCustom(file, info) {
			let data = new FormData();
			data.append('file', file.file);
			data.append('storageType', this.$config.OSS_UPLOAD_TYPE);
			data.append('clientKey', 'mall-center-member');

			const verifySignatureHeaders = signatureManger.generateVerifyRequestHeaders(
				signatureManger.getPath('/storage/upload'),
				signatureManger.getMethod('POST'),
				signatureManger.generateUid(),
				signatureManger.getTimestamp(),
				signatureManger.getToken(this.$store.getters['user/getFullToken']),
				signatureManger.getPlatformKey()
			);

			const res = await this.$fetch({
				method: 'POST',
				url: this.$store.getters['system/getOssUploadUrl'],
				headers: {
					...verifySignatureHeaders,
				},
				data,
			});
			if (res.data && res.data.success) {
				this.$message.success('上传成功');
				let datas = res.data.datas;
				let enclosureInfo = {
					id: info.data.id ? info.data.id : '',
					dataName: info.data.dataName,
					certificatesName: file.file.name, // 名称
					file: datas.fileUrlKey, // 文件半路径
					fileType: info.data.fileType,
					uploadedBy: this.$store.getters['user/getUsername'], // 上传人
					uploadTimeShow: filters.timestampFormat(new Date().getTime()), // 上传时间
					uploadTime: new Date().getTime(), // 上传时间-时间戳
				};
				this.$set(this.detail.serviceFiles, info.index, enclosureInfo);
			} else {
				this.$message.error('上传失败');
			}
		},
		// 下载
		crmFilesDownload({ dataName, file }) {
			if (!(file && dataName)) return this.$message.warning('文件地址不存在, 无法下载');
			const extendTypeIndex = file.lastIndexOf('.');
			const extendTypeName = file.slice(extendTypeIndex + 1);
			const baseName = dataName ? dataName.trim() : Date.now();
			// 判断是否有后缀 没有就加 有就不加
			const filename = dataName.indexOf('.') > 0 ? dataName : `${baseName}.${extendTypeName}`;
			downloadFile(file, filename);
		},
		// 删除
		async delFiles(info) {
			let delInfo = {
				id: info.data.id ? info.data.id : '',
				dataName: info.data.dataName, // 名称
				file: '', // 文件全路径
				fileType: info.data.fileType,
				uploadedBy: '', // 上传人
				uploadTimeShow: '', // 上传时间
				uploadTime: '', // 上传时间-时间戳
			};
			this.$set(this.detail.serviceFiles, info.index, delInfo);
			if (info.data.id) {
				const res = await this.$fetch(`/crm/member/serviceCompany/deleteFileInfo?id=${info.data.id}`);
				if (res && res.code == 200) {
					this.$message({
						type: 'success',
						message: '操作成功',
					});
				} else {
					this.$toast(res.message || '无法根据此分公司编号查询分公司信息');
				}
			} else {
				this.$message({
					type: 'success',
					message: '操作成功',
				});
			}
		},

		async getCompanyRecordsByCode() {
			const res = await this.$fetch(
				`/crm/member/serviceCompany/getCompanyRecordsByCode?compamyCode=${this.detail.serviceId}`
			);
			if (res && res.code == 200) {
				this.operationRecord = res.data;
			} else {
				this.$toast(res.message || '暂无操作记录');
			}
		},

		// 根据所属分公司编号自动带出
		async branchOfficeInfo() {
			const res = await this.$fetch(
				`/crm/member/serviceCompany/selectCrmCompanyInfos?companyCode=${this.detail.belongToCode}`
			);
			if (res && res.data) {
				const { fullName, shopProvinceCode, contactProvinceNum, shopProvinceName } = res.data[0];
				this.detail.belongName = fullName;
				this.detail.province = shopProvinceCode;
				this.detail.contactProvinceNum = contactProvinceNum;
				this.detail.provinceName = shopProvinceName;
				// 省回填
				// if (shopProvinceCode) {
				// 	let shopProvince = this.rewritePlace([shopProvinceCode], citys);
				// 	console.log(shopProvince);
				// 	this.detail.provinceName = shopProvince[0];
				// }
			} else {
				this.$toast(res.message || '无法根据此分公司编号查询分公司信息');
			}
		},
		// 会员卡号输入事件(当会员卡号符合一定格式后通过会员卡号请求会员的详情)
		handleCardNoChange(cardNo) {
			this.detail.cardNo = cardNo;
			if (cardNo.length >= 8) {
				this.loadVIPDetailByCardNo(cardNo);
			}
		},
		// 审核原因选择
		reasonNoChange(val) {
			this.examineNoData.map(({ id, reasonName, reasonComment }) => {
				if (id === val) {
					this.notPassModal.result = reasonName;
					this.notPassModal.reason = reasonComment;
				}
			});
		},
		// 获取审核不通过原因
		async getExamineNoData() {
			// 0：注销,1:审核不通过,2初审通过
			const res = await this.$fetch(`/crm/member/serviceCompany/queryServiceCompanyConfig?type=1`);
			const { code, data } = res;
			if (res && code === 200 && data && data.length) {
				this.examineNoData = data || [];
			} else {
				this.examineNoData = [];
			}
		},
		// 通过初审
		passPrimaryCheck() {
			this.notPassModal = {
				show: true,
				result: '通过初审',
				reason: '',
				titile: '审核通过原因',
				state: 1,
			};
		},
		// 不通过初审
		notPassPrimaryCheck() {
			this.notPassModal = {
				show: true,
				result: '',
				reason: '',
				titile: '审核不通过原因',
				state: 2,
			};
		},
		// 不通过取消
		notpassCancel() {
			this.notPassModal.show = false;
		},
		// 审核确认
		notpassConfirm() {
			this.notPassModal.show = false;
			if (this.notPassModal.state === 1) {
				this.updateServiceCheckStatus(VALIDATE_STATUS_MAP.PASSED);
			} else {
				this.updateServiceCheckStatus(VALIDATE_STATUS_MAP.NOT_PASS);
			}
		},
		// 取消并关闭当前服务公司编辑页面
		cancelServiceCompanyInfo(state) {
			if (!(JSON.stringify(this.oldDetail) === JSON.stringify(this.detail))) {
				this.$confirm('有改动字段数值，是否保存?', '提示', {
					type: 'warning',
				})
					.then(() => {
						// this.$closeSelf();
						if (state) {
							// 保存服务公司信息[新增]
							this.addServiceCompanyDetail(VALIDATE_STATUS_MAP.DRAFT);
						} else {
							// 保存服务公司信息[编辑]
							this.updateServiceCompanyDetail(VALIDATE_STATUS_MAP.DRAFT);
						}
					})
					.catch(() => {
						this.$closeSelf();
					});
			} else {
				this.$closeSelf();
			}
		},
		// 服务公司信息提交
		saveServiceCompanysubmit(state) {
			// 1 保存服务公司信息[新增] 2 提交服务公司信息[新增] 3 保存服务公司信息[编辑] 4 提交服务公司信息[编辑]
			this.$refs.companyData.validate(valid => {
				// 银行信息验证
				if (valid) {
					this.$refs.companyBankData.validate(valid => {
						if (valid) {
							// (服务公司)电子邮箱验证
							if (this.detail.serviceCompanyMail !== '' && !this.checkEmail) {
								this.$message({
									type: 'warning',
									message: '请填写正确邮箱格式',
								});
								return;
							}
							// 保存服务公司信息[新增]
							if (state == 1) {
								this.addServiceCompanyDetail(VALIDATE_STATUS_MAP.DRAFT);
							} else if (state == 2) {
								// 提交服务公司信息[新增]
								this.addServiceCompanyDetail(VALIDATE_STATUS_MAP.TO_BE_CHECK);
							} else if (state == 3) {
								// 保存服务公司信息[编辑]
								this.updateServiceCompanyDetail(VALIDATE_STATUS_MAP.DRAFT);
							} else {
								// 提交服务公司信息[编辑]
								let state = this.state === 3 ? 3 : VALIDATE_STATUS_MAP.TO_BE_CHECK;
								this.updateServiceCompanyDetail(state);
							}
						} else {
							this.$message({
								type: 'warning',
								message: '请填写银行信息',
							});
							return false;
						}
					});
				} else {
					this.$message({
						type: 'warning',
						message: '请填写必填项',
					});
					return false;
				}
			});
		},
		// 获取银行类型
		async loadBankType() {
			const res = await this.$fetch('/crm/member/serviceCompany/bankOfDeposit?type=openBankCode');
			if (res && res.data && res.data.length) {
				// this.$config.BANK_TYPE = res.data.map(({ name: label, code: value }) => ({ label, value }));
				// this.bankTypeOptions = res.data.map(({ name: label, code }) => ({ label, value: `${code * 1}` }));
				this.bankTypeOptions = res.data;
			}
		},
		// 更改服务公司审批状态
		async updateServiceCheckStatus(state) {
			const {
				id,
				notPassModal: { result: failedReason = '', reason: failedReasonDes = '' },
			} = this;
			const data = {
				id,
				state,
				failedReason,
				failedReasonDes,
			};
			const res = await this.$fetch({
				method: 'POST',
				url: '/crm/member/serviceCompany/detailsReview',
				data,
			});

			if (res) {
				console.log(res);
				this.butState = res.code === 200;
				this.$message({
					type: 'success',
					message: res.message,
					onClose: () => {
						this.$dispatch('UPDATE_SERVICE_LIST');
						this.$closeSelf();
					},
				});
			}
		},
		// 根据会员Id 获取会员详细信息
		async loadVIPDetailByMemeberId(memberId) {
			if (!memberId) return this.$message('会员Id "memberId" 不存在或无效, 无法获取会员详细信息', 2000);
			const res = await this.$fetch(`/crm/member/serviceCompany/selectCrmVipInfoById?id=${memberId}`);
			if (res && res.data) {
				const {
					memberId,
					name,
					spouseName,
					mail,
					phoneNumber,
					serviceCode,
					serviceNumber,
					serviceMail,
					serviceLandline,
				} = res.data;
				// 查询方式比较偏
				this.detail.memberId = memberId;
				this.detail.name = name;
				this.detail.spouseName = spouseName;
				this.detail.mail = mail;
				this.detail.phoneNumber = phoneNumber;
				this.detail.serviceCode = serviceCode;
				this.detail.serviceNumber = serviceNumber;
				this.detail.serviceMail = serviceMail;
				this.detail.serviceLandline = serviceLandline;
			}
		},
		// 根据会员卡号 获取会员详细信息
		async loadVIPDetailByCardNo(cardNo) {
			if (!cardNo) return this.$message('会员卡号 "cardNo" 不存在或无效, 无法获取会员详细信息', 2000);
			const res = await this.$fetch(`/crm/member/serviceCompany/selectCrmVipInfoBycardNo?cardNo=${cardNo}`);
			if (res && res.data) {
				const {
					memberId,
					name,
					spouseName,
					mail,
					phoneNumber,
					serviceCode,
					serviceNumber,
					serviceMail,
					serviceLandline,
				} = res.data;
				// 查询方式比较偏 [这个接口还是从上个接口复制过来的]
				this.detail.memberId = memberId || '';
				this.detail.name = name;
				this.detail.spouseName = spouseName;
				this.detail.mail = mail;
				this.detail.phoneNumber = phoneNumber;
				this.detail.serviceCode = serviceCode;
				this.detail.serviceNumber = serviceNumber;
				this.detail.serviceMail = serviceMail;
				this.detail.serviceLandline = serviceLandline;
			}
		},
		// 获取所有分公司
		async selectCrmCompanyInfos() {
			const res = await this.$fetch(`crm/member/serviceCompany/selectCrmCompanyInfos?companyCode`);
			if (res && res.data) {
				this.companyOptions = res.data;
			}
		},
		// 获取服务公司详情
		async loadServiceCompanyDetail(id) {
			if (!id) return this.$message('服务公司Id 不存在或失效, 无法获取服务公司详情', 2000);

			const res = await this.$fetch(`/crm/member/serviceCompany/selectDetailsInfo?id=${id}`);
			if (res && res.data) {
				const {
					data,
					data: { memberId, bankId, email, phone, province },
				} = res;
				this.detail = {
					...data,
					memberId,
					bankId: String(bankId),
					mail: email,
					phoneNumber: phone,
					contactProvinceNum: province,
				};
				this.loadVIPDetailByMemeberId(data.memberId);

				// ! 附件资料修改
				const { serviceFiles } = this.detail;
				const { oldServiceFiles } = this;
				this.detail.serviceFiles = oldServiceFiles.map(x => {
					let obj = serviceFiles.find(item => item.fileType == x.fileType);
					if (obj) {
						return {
							...obj,
							uploadTimeShow: obj.uploadTime ? filters.timestampFormat(obj.uploadTime) : '',
							dataName: FILE_TYPE[obj.fileType],
						};
					}
					return x;
				});

				// 营业执照省市区回填
				if (data.businessLicenseProvince) {
					let businessLicensePro = this.rewritePlace(
						[data.businessLicenseProvince, data.businessLicenseCity, data.businessLicenseArea],
						maps
					);
					this.detail.businessLicenseSite = [
						data.businessLicenseProvince,
						data.businessLicenseCity,
						data.businessLicenseArea,
					];
					let isBusinessLicenseSite = `${businessLicensePro[0] || ''}/${businessLicensePro[1] || ''}/${
						businessLicensePro[2] || ''
					}`;
					this.$nextTick(() => {
						this.$refs['bl-elcascader'].inputValue = isBusinessLicenseSite;
					});
				}
				// 联系地址省市区回填
				if (data.addressProvince) {
					let addressPro = this.rewritePlace([data.addressProvince, data.addressCity, data.addressArea], maps);
					this.addressSite = [data.addressProvince, data.addressCity, data.addressArea];
					let isAddressSite = `${addressPro[0] || ''}/${addressPro[1] || ''}/${addressPro[2] || ''}`;
					this.$nextTick(() => {
						this.$refs['address-elcascader'].inputValue = isAddressSite;
					});
				}
				// 银行信息省市区回填
				if (data.bankProvince) {
					let bankePro = this.rewritePlace([data.bankProvince, data.bankCity, data.bankArea], maps);
					this.detail.bankSite = [data.bankProvince, data.bankCity, data.bankArea];
					let isBankSite = `${bankePro[0] || ''}/${bankePro[1] || ''}`;
					this.$nextTick(() => {
						this.$refs['bank-elcascader'].inputValue = isBankSite;
					});
				}
				// 操作记录
				this.getCompanyRecordsByCode();
			}
		},
		// 新增服务公司详情
		async addServiceCompanyDetail(state) {
			const {
				detail,
				detail: { legalPersonOn, isItShanghai, bankId, bankType },
			} = this;
			const data = {
				...detail,
				bankId,
				bankType: Number(bankType),
				legalPersonOn: Number(legalPersonOn),
				isItShanghai: Number(isItShanghai),
				state,
			};

			const res = await this.$fetch({
				method: 'POST',
				url: '/crm/member/serviceCompany/insertServiceCompany',
				data,
			});
			if (res && res.code === 200) {
				this.butState = true;
				this.$message({
					type: 'success',
					message: res.message,
					onClose: () => {
						this.$dispatch('UPDATE_SERVICE_LIST');
						this.$closeSelf();
					},
				});
			}
		},
		// 编辑服务公司详情
		async updateServiceCompanyDetail(state) {
			const {
				detail,
				detail: { legalPersonOn, isItShanghai, bankId, bankType },
			} = this;
			const data = {
				...detail,
				bankId,
				bankType: Number(bankType),
				legalPersonOn: Number(legalPersonOn),
				isItShanghai: Number(isItShanghai),
				state,
			};

			const res = await this.$fetch({
				method: 'POST',
				url: '/crm/member/serviceCompany/updateServiceCompanyInfo',
				data,
			});
			if (res && res.code === 200) {
				this.butState = true;
				this.$message({
					type: 'success',
					message: res.message,
					onClose: () => {
						this.$dispatch('UPDATE_SERVICE_LIST');
						this.$closeSelf();
					},
				});
			}
		},
	},
	created() {
		const { id, type, state } = this.$route.query || '';
		this.id = id;
		this.type = type;
		this.state = Number(state);
		// state 1-草稿、2-待审核、3-审核通过、4-审核不通过、5-已注销
		// 获取审核不通过原因
		if (this.state === 2) {
			this.getExamineNoData();
		}
		this.loadBankType();
		this.selectCrmCompanyInfos();
		this.oldDetail = JSON.parse(JSON.stringify(this.detail));
		if (type !== 'add') {
			// 占位符提示
			this.placeholderData = {};
			this.loadServiceCompanyDetail(id);
		}
	},
};
</script>

<style lang="scss" scoped>
h3 {
	font-size: 16px;
	color: $color-title;
	margin-bottom: 16px;
}
.part-gap {
	margin-bottom: 16px;
}
.input-item {
	width: 190px;
}
.input-item2 {
	width: 90px;
	margin-right: 8px;
}
.input-item3 {
	width: 320px;
}
.select-item {
	width: 100px;
	margin-right: 16px;
}
.select-item3 {
	width: 170px;
	margin-right: 16px;
}
.notpass-tips {
	margin-bottom: 8px;
}
.notpass-select {
	width: 100%;
	margin-bottom: 8px;
}
.dialog-footer {
	display: flex;
	justify-content: flex-end;
}
// 省市区
.site-item {
	margin-right: 8px;
	height: 32px;
}
::v-deep.site-item > .el-input--medium .el-input__inner {
	height: 32px;
	line-height: 32px;
}
::v-deep.el-upload-list {
	display: none;
}
.upload_div {
	display: flex;
	justify-content: center;
}
.upload_div .el-button {
	margin-right: 10px;
}
.bank-district {
	min-width: 340px;
}
.bank_code {
	padding-left: 10px;
	color: blue;
}
::v-deep.branch_office .el-input__inner {
	width: 300px;
	height: 32px;
	line-height: 32px;
}
.preview_img {
	width: 100%;
}
.enclosure_img ::v-deep.el-dialog__body {
	max-height: 600px;
	overflow: auto;
}
</style>
