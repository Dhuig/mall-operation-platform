<template>
	<div>
		<guideBar />
		<!-- 会员信息 -->
		<el-card class="row-gap">
			<h3 slot="header">会员信息</h3>
			<el-form
				size="small"
				:model="detail"
				:rules="rules"
				label-width="120px"
				label-suffix=":"
				class="business-form"
				ref="formRef"
				:inline="true"
				label-position="top"
			>
				<el-form-item label="业务类型" prop="businessTypeCode">
					<el-select
						v-model="detail.businessTypeCode"
						placeholder="请选择业务类型"
						size="medium"
						clearable
						class="business-select"
						:disabled="viewDetail"
					>
						<el-option
							v-for="(option, idx) in BUSINESS_EDITINFO_TYPE"
							:key="idx"
							:value="option.value"
							:label="option.label"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="会员卡号" prop="cardNo">
					<el-input
						v-model="detail.cardNo"
						class="business-input"
						@change="queryMemberInfo"
						:rows="5"
						:readonly="viewDetail"
						maxlength="10"
					/>
				</el-form-item>
				<el-form-item :label="field.label" v-for="field in DETAIL_FORM" :key="field.key">
					<el-input
						:value="detail[field.key] | formatDateToStr(field.key, detail)"
						class="business-input"
						:rows="5"
						readonly
					/>
				</el-form-item>
				<el-form-item v-if="showType" label="类型" prop="type">
					<el-select
						v-model="detail.type"
						placeholder="请选择类型"
						size="medium"
						clearable
						class="business-select"
						:disabled="viewDetail"
					>
						<el-option label="回归" :value="1">回归</el-option>
						<el-option label="挂公司管理" :value="2">挂公司管理</el-option>
						<el-option label="紧缩" v-if="detail.handledCardNo != '0000000'" :value="3">紧缩</el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</el-card>
		<!-- 变更信息 -->
		<el-card class="row-gap">
			<h3 slot="header">变更信息</h3>
			<el-form
				size="small"
				ref="changeInfo"
				:model="change"
				label-width="120px"
				label-suffix=":"
				label-position="left"
				class="business-form"
				:rules="changeInfoRules"
			>
				<el-form-item
					label="购货冻结时间"
					v-if="showDate && detail.businessTypeCode == 'freeze_purchase_qualification'"
					prop="date"
				>
					<el-date-picker
						v-model="change.date"
						type="daterange"
						unlink-panels
						value-format="timestamp"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						:readonly="viewDetail"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="跟进人" v-if="showDate">
					<el-input v-model="change.followPerson" class="business-input" :readonly="viewDetail" />
				</el-form-item>
				<el-form-item label="OA工单号">
					<el-input v-model="change.oa" class="business-input" :readonly="viewDetail" />
				</el-form-item>
				<el-form-item label="审批时间">
					<el-date-picker
						v-model="change.checkTime"
						type="date"
						align="left"
						value-format="timestamp"
						class="business-input"
						:readonly="viewDetail"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="change.remark" class="business-textarea" :readonly="viewDetail" />
				</el-form-item>
				<el-form-item label="图片">
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						:limit="9"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemove"
						:on-success="handleSuccess"
						:file-list="changeDataList"
						:disabled="viewDetail"
						:before-upload="beforeVideoUpload"
						:class="changeDataList && changeDataList.length == 9 ? 'hide_box' : ''"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible" v-drag>
						<img width="100%" :src="dialogImageUrl" alt />
					</el-dialog>
					<p class="tips">
						1.支持文件格式:.jpeg .jpg .bmp .png .raw .tiff .gif
						<br />
						2.最多可上传9张图片,
						<br />
						3.单个文件不能超过20M
						<br />
					</p>
				</el-form-item>
				<el-form-item label="附件">
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						:limit="9"
						:on-remove="handleRemoveFile"
						:on-success="handleSuccessFile"
						:file-list="change.fileList"
						:disabled="viewDetail"
						:before-upload="beforeVideoUploadFile"
					>
						<el-button size="small" type="primary">添加附件</el-button>
						<p class="tips" slot="tip">
							1.支持文件格式:.rar .zip .doc .docx .pdf
							<br />
							2.最多可上传9个文件,
							<br />
							3.单个文件不能超过500M
							<br />
						</p>
					</el-upload>
				</el-form-item>
				<!-- <el-row>
					<el-col :span="24">
					</el-col>
					<el-col :span="12">
					</el-col>
					<el-col :span="12">
						<p class="tips">
							1.支持文件格式:.jpeg .jpg .bmp .png .raw .tiff .gif
							<br />
							2.最多可上传9张图片,
							<br />
							3.单个文件不能超过20M
							<br />
						</p>
					</el-col>
					<el-col :span="24">
					</el-col>
				</el-row> -->
			</el-form>
		</el-card>
		<!-- 变更资料动态组件  -->
		<component
			ref="sourceChange"
			:is="changeInfoComponent"
			:info="componentInfo"
			:spouseInfo="spouseInfo"
			:title="title"
			:addspouse="addspouse"
			:viewDetail="viewDetail"
			@persinChangeData="persinChangeData"
		/>
		<!-- 更改卡号 -->
		<el-card class="row-gap" v-if="detail.businessTypeCode == 'card_number_change_code'">
			<h3 slot="header">更改卡号</h3>
			<el-form :model="cardForm" :rules="rules" ref="formbd" label-width="120px;">
				<el-form-item label="新卡号:" prop="newCard">
					<el-input v-model="cardForm.newCard" class="business-input" maxlength="10" clearable :readonly="viewDetail" />
				</el-form-item>
			</el-form>
		</el-card>
		<!-- 更改经办人 -->
		<el-card class="row-gap" v-if="detail.businessTypeCode == 'handled_change_code'">
			<h3 slot="header">更改经办人</h3>
			<el-form inline :model="handleFrom" ref="handleFromrules" :rules="handleFromrules" label-width="120px">
				<el-row>
					<el-col :span="10">
						<el-form-item label="新经办人卡号:" prop="newHandledCardNo">
							<el-input
								v-model="handleFrom.newHandledCardNo"
								@change="queryHandleInfo"
								class="business-input"
								clearable
								:readonly="viewDetail"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="14">
						<el-form-item label="新经办人姓名:" prop="newHandledName">
							<el-input v-model="handleFrom.newHandledName" class="business-input" clearable :readonly="viewDetail" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<!-- 注销VIP资格 -->
		<el-card class="row-gap" v-if="detail.businessTypeCode == 'logout_vip_code' && detail.type != ''">
			<h3 slot="header">{{ LOGOUT_VIP_CODE_TITLE[detail.type] }}</h3>
			<el-form :model="vipForm" :rules="vipRules" ref="vipForm" label-width="130px">
				<el-row>
					<el-col :span="10">
						<el-form-item label="大客户专享计划" prop="vipPlan">
							<el-select
								v-model="vipForm.vipPlan"
								size="medium"
								clearable
								class="business-select"
								:disabled="viewDetail"
							>
								<el-option label="无利保" :value="1">无利保</el-option>
								<el-option label="一次性报完剩余利保" :value="2">一次性报完剩余利保</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="大客户专享套餐">
							<el-input
								v-model="vipForm.vipSuitn"
								placeholder="请填写大客户专享套餐"
								class="business-input"
								:readonly="viewDetail"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="10" v-if="detail.type == 1">
						<el-form-item label="新经办人卡号" prop="newHandledCardNo">
							<el-input
								v-model="vipForm.newHandledCardNo"
								@change="queryVipInfo"
								class="business-input"
								clearable
								:readonly="viewDetail"
								placeholder="请填写新经办人卡号"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="10" v-if="detail.type == 1">
						<el-form-item label="新经办人姓名">
							<el-input v-model="vipForm.newHandledName" class="business-input" clearable :readonly="viewDetail" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<actionBar>
			<template>
				<!-- <template>
					<el-button
						type="primary"
						v-permission="'businesshall_change_profile_submit'"
						icon="el-icon-check"
						@click="handleSubmit"
					>
						提交
					</el-button>
				</template> -->
				<el-button
					type="primary"
					v-multiMatchPermission:[$route.query.type]="BusinessHallPermissionMap"
					icon="el-icon-check"
					@click="handleSubmit"
				>
					提交
				</el-button>
				<el-button @click="cancelEdit">取消</el-button>
			</template>
		</actionBar>
		<!-- <el-row type="flex" justify="center" align="center">
			<template v-if="!viewDetail">
				<el-button type="primary" icon="el-icon-check" @click="handleSubmit"> 提交 </el-button>
			</template>
			<el-button @click="cancelEdit">取消</el-button>
		</el-row>-->
		<el-dialog title="提示" :visible.sync="isVisible" width="30%">
			<span class="d-t">
				<i class="el-icon-warning"></i>
				是否选择配偶沿用本人的非关键信息
			</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="isVisibleClose">否</el-button>
				<el-button type="primary" @click="isVisibleSave">是</el-button>
			</span>
		</el-dialog>

		<el-dialog title="提示" v-drag :visible.sync="backCardVisible" width="444px" :before-close="backCardClose">
			<div>
				<div class="batch-void">
					<div class="is-text-top">
						<span class="el-icon-question"></span>
					</div>
					<div class="is-text">
						<p v-for="(item, index) in backCardMsg" :key="index">{{ item }}</p>
					</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="backCardClose">取消</el-button>
				<el-button type="primary" @click="backCard">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {
	DETAIL_FORM,
	BUSINESS_EDITINFO_TYPE,
	BUSINESS_HALL_PERMISSION_MAP,
	BUSSINESS_TYPE,
	BUSINESS_FREEZE_TYPE,
	LOGOUT_VIP_CODE_TITLE,
	MEMBER_STATUS_YTPE,
} from './config';
import personChange from './component/personChange';
import cardChange from './component/cardChange';
import { optionGenerator } from 'util';
import { filters } from 'plugins/filters';
import { uploadFileType, formatDateDefault } from 'util/formValidation';
export default {
	name: 'businessDetail',
	data() {
		const validatePlan = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请选择专享计划'));
			} else {
				callback();
			}
		};
		const vaildateCard = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入经办人卡号'));
			} else {
				callback();
			}
		};
		let reg = /^[0-9]+$/;
		const updateCard = (rule, value, callback) => {
			if (!reg.test(value) && (value === '' || value.length !== 8)) {
				callback(new Error('请输入支持8位，数字型的新卡号'));
			} else {
				callback();
			}
		};
		const validateCardNo = (rule, value, callback) => {
			if (!reg.test(value) && (value === '' || (value.length !== 8 && value.length !== 10))) {
				callback(new Error('请输入支持8位或10位，数字型的新卡号'));
			} else {
				callback();
			}
		};
		const validateNewCard = (rule, value, callback) => {
			if ((!reg.test(value) && value === '') || value.length !== 8) {
				callback(new Error('系统只有8位卡号的优惠顾客才能修改，请留意，谢谢'));
			} else {
				callback();
			}
		};
		return {
			backCardVisible: false,
			backCardMsg: [],
			BusinessHallPermissionMap: Object.freeze(BUSINESS_HALL_PERMISSION_MAP),
			isVisible: false,
			BUSINESS_EDITINFO_TYPE_LS: null,
			LOGOUT_VIP_CODE_TITLE,
			isAddClick: true,
			DETAIL_FORM,
			BUSINESS_FREEZE_TYPE,
			BUSINESS_EDITINFO_TYPE,
			BUSSINESS_TYPE,
			viewDetail: false,
			showType: false,
			addspouse: true,
			title: '',
			changeInfoComponent: '',
			rules: {
				cardNo: [
					{
						required: true,
						validator: this.$route.query.type === 'card_number_change_code' ? updateCard : validateCardNo,
						trigger: 'blur',
					},
				],
				businessTypeCode: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
				type: [{ required: true, message: '请选择类型', trigger: 'change' }],
				newCard: [{ required: true, validator: validateNewCard, trigger: 'blur' }],
			},
			handleFromrules: {
				newHandledCardNo: [{ required: true, message: '请填写卡号', trigger: 'blur' }],
			},
			detail: {
				cardNo: '',
				businessTypeCode: '',
				type: '',
				cardStatus: '',
				freezeLimit: '',
				freezeStartDate: '',
				freezeEndDate: '',
				realname: '',
				certificatesNo: '',
				gender: '',
				mobile: '',
				contactMobile: '',
				currentLevel: '',
				highestLevel: '',
				openCardTime: '',
				storeCode: '',
				handledCardNo: '',
				handledName: '',
				isFreeze: '',
				spouseRealname: '',
				spouseMobile: '',
				spouseCertificatesNo: '',
				memberStatus: '',
			},
			componentInfo: {},
			change: {
				oa: '',
				checkTime: '',
				remark: '',
				fileList: [],
				followPerson: '',
				date: [],
			},
			info: {
				cardNo: '',
				realname: '',
				gender: '',
				marital: '',
				certificatesType: '',
				certificatesNo: '',
				education: '',
				date: [],
				mobile: '',
				contactMobile: '',
				homePhone: '',
				nation: '',
				postcode: '',
				email: '',
				livePlace: '',
				profession: '',
				area: [],
				address: '',
				consumeFollowArr: [],
				certificatesPositiveUrl: '', // 个人 正面照片
				certificatesReverseUrl: '', // 个人 反面照片
				spouseCertificatesPositiveUrl: '', // 配偶 正面照片
				spouseCertificatesReverseUrl: '', // 配偶 反面照片
				spouseOrNot: '',
				spouseRealname: '',
				spouseGender: '',
				spouseMarital: '',
				spouseCertificatesType: '1',
				spouseCertificatesNo: '',
				spouseEducation: '',
				spouseDate: [],
				spouseMobile: '',
				spouseHomePhone: '',
				spouseNation: '',
				spousePostcode: '',
				spouseCardEmail: '',
				spouseLivePlace: '',
				spouseProfession: '',
				spouseArea: [],
				spouseAddress: '',
				spouseConsumeFollowArr: [],
			},
			cardInfo: {
				inheritCard: '',
				maxLevel: '',
				cumtrapz: '',
			},
			spouseInfo: {
				spouseRealname: '',
				spouseGender: '',
				spouseCertificatesType: '1',
				spouseCertificatesNo: '',
				spouseDate: [],
				spouseMobile: '',
			},
			cardForm: {
				newCard: '',
			},
			handleFrom: {
				newHandledCardNo: '',
				newHandledName: '',
			},
			vipForm: {
				vipPlan: '',
				vipSuitn: '',
				newHandledCardNo: '',
				newHandledName: '',
			},
			vipRules: {
				vipPlan: [{ required: true, validator: validatePlan, trigger: 'change' }],
				newHandledCardNo: [{ required: true, validator: vaildateCard, trigger: 'blur' }],
			},
			vailed: false,
			showDate: false,
			dialogImageUrl: '',
			dialogVisible: false,
			changeDataList: [], // 变更信息图片列表,
			changeInfoRules: {
				date: [{ required: true, message: '请选择购货冻结时间' }],
			},
		};
	},
	watch: {
		'detail.businessTypeCode': {
			handler(val) {
				switch (val) {
					case 'person_change_code':
						this.title = '更改个人信息-个人|更改个人信息-配偶';
						this.getMasterMemberInfo();
						this.componentInfo = this.info;
						this.addspouse = true;
						this.changeInfoComponent = personChange;
						break;
					case 'inherit_cus_change_code':
						this.getMasterMemberInfo();
						this.changeInfoComponent = personChange;
						this.title = '继承变更-按顾客（本人)|继承变更-按顾客（配偶）';
						this.componentInfo = this.info;
						this.addspouse = true;
						break;
					case 'inherit_card_change_code':
						this.changeInfoComponent = cardChange;
						this.title = '继承变更-按卡号|';
						this.componentInfo = this.cardInfo;
						this.addspouse = true;
						break;
					case 'transfer_cus_change_code':
						this.getMasterMemberInfo();
						this.changeInfoComponent = personChange;
						this.title = '转让变更-按顾客（本人)|转让变更-按顾客（配偶）';
						this.addspouse = true;
						this.componentInfo = this.info;
						break;
					case 'transfer_card_change_code':
						this.changeInfoComponent = cardChange;
						this.title = '转让变更-按卡号|';
						this.addspouse = true;
						this.componentInfo = this.cardInfo;
						break;
					case 'add_spouse_msg_code':
						this.changeInfoComponent = personChange;
						this.title = '补填配偶信息|';
						this.addspouse = false;
						this.componentInfo = this.spouseInfo;
						break;
					case 'freeze_purchase_qualification':
						this.showDate = true;
						break;
					case 'unfreezing_purchase_qualification':
						this.showDate = true;
						break;
					default:
						this.changeInfoComponent = '';
						break;
				}
			},
		},
	},
	components: {
		personChange,
		cardChange,
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.crm,
			};
			return params;
		},
		formData() {
			const {
				detail,
				change,
				change: { date = ['', ''] },
				componentInfo,
				componentInfo: { area = ['', '', ''], spouseDate = ['', ''], spouseArea = ['', '', ''] },
				changeDataList,
			} = this;
			const pictureArr = changeDataList.map(item => {
				return item.response.datas.fileUrlKey;
			});
			const fileArr = change.fileList.map(item => {
				return item.response.datas.fileUrlKey;
			});
			delete componentInfo.cardNo;
			const params = {
				...detail,
				...componentInfo,
				...change,
				approveTime: change.checkTime,
				oaNo: change.oa,
				changeRemark: change.remark,
				freezeStartTime: date[0],
				freezeEndTime: date[1],
				certificatesStartDate: componentInfo.date && componentInfo.date.length > 0 ? componentInfo.date[0] : '',
				certificatesEndDate: componentInfo.date && componentInfo.date.length > 0 ? componentInfo.date[1] : '',
				province: area[0],
				city: area[1],
				district: area[2],
				consumeFollow: componentInfo.consumeFollowArr ? componentInfo.consumeFollowArr.join(',') : '',
				spouseCertificatesStartDate: spouseDate[0],
				spouseCertificatesEndDate: spouseDate[1],
				spouseProvince: spouseArea[0],
				spouseCity: spouseArea[1],
				spouseDistrict: spouseArea[2],
				spouseConsumeFollow: componentInfo.spouseConsumeFollowArr ? componentInfo.spouseConsumeFollowArr.join(',') : '',
				changeAnnex: fileArr.join(','),
				changeFile: pictureArr.join(','),
			};
			return params;
		},
		businessData() {
			const {
				detail,
				change,
				change: { date = ['', ''] },
				handleFrom,
				vipForm,
				cardForm,
				changeDataList,
			} = this;
			const pictureArr = changeDataList.map(item => {
				return item.response.datas.fileUrlKey;
			});
			const fileArr = change.fileList.map(item => {
				return item.response.datas.fileUrlKey;
			});
			let params = {};
			if (this.handleFrom.newHandledCardNo) {
				params = {
					...detail,
					...change,
					...handleFrom,
					...cardForm,
					approveTime: change.checkTime,
					oaNo: change.oa,
					changeRemark: change.remark,
					freezeStartTime: date[0],
					freezeEndTime: date[1],
					changeAnnex: fileArr.join(','),
					changeFile: pictureArr.join(','),
				};
				return params;
			}
			params = {
				...detail,
				...change,
				...handleFrom,
				...vipForm,
				...cardForm,
				approveTime: change.checkTime,
				oaNo: change.oa,
				changeRemark: change.remark,
				freezeStartTime: date[0],
				freezeEndTime: date[1],
				changeAnnex: fileArr.join(','),
				changeFile: pictureArr.join(','),
			};
			return params;
		},
	},
	filters: {
		formatDateToStr: (originValue, key, detail) => {
			const { cardStatus, openCardTime, gender, isFreeze } = detail;
			// const { freezeTimeEnd, freezeTimeStart, freezeStartDate, freezeEndDate } = detail;
			if ('cardStatus' === key) {
				return MEMBER_STATUS_YTPE[cardStatus];
			}
			if ('openCardTime' === key) {
				if (!openCardTime) return '';
				return `${filters.timestampFormat(openCardTime)}`;
			}
			if ('gender' === key) {
				if (!gender) return '';
				if (gender == '1') return '男';
				if (gender == '2') return '女';
			}
			if ('isFreeze' === key) {
				if (isFreeze == '0') return '否';
				if (isFreeze == '1') return '是';
			}
			return originValue;
		},
	},
	created() {
		if (this.$route.query.no) {
			this.businessNo = this.$route.query.no;
			this.viewDetail = true;
			this.BUSINESS_EDITINFO_TYPE = optionGenerator(BUSSINESS_TYPE, 'string');
			this.getDetails();
			if (this.$route.query.code == 'logout_vip_code') {
				this.showType = true;
			}
		}
		if (this.$route.query.type) {
			if (this.$route.query.type == 'person_change_code') {
				this.BUSINESS_EDITINFO_TYPE = BUSINESS_EDITINFO_TYPE;
			} else if (this.$route.query.type == 'purchase_qualification') {
				this.BUSINESS_EDITINFO_TYPE = BUSINESS_FREEZE_TYPE;
			} else {
				this.detail.businessTypeCode = this.$route.query.type;
				let obj = [];
				for (let k in this.BUSSINESS_TYPE) {
					if (k == this.$route.query.type) {
						obj.push({ value: k, label: this.BUSSINESS_TYPE[k] });
					}
				}
				this.BUSINESS_EDITINFO_TYPE = obj;
			}
			if (this.$route.query.type == 'logout_vip_code') {
				this.showType = true;
			}
		}
	},
	methods: {
		async logoutVip() {
			let res = await this.$fetch({
				method: 'POST',
				url: '/crm/memberHandle/api/logoutVip',
				data: this.businessData,
			});
			this.backCardVisible = false;
			if (res && res.code == 200) {
				this.$message.success(res.message);
				this.$nextTick(() => {
					this.$dispatch('GET_BUSINESS_LIST');
					this.$closeSelf();
				});
			}
		},
		async monthBackCard() {
			let res = await this.$fetch({
				method: 'POST',
				url: '/crm/memberHandle/api/monthBackCard',
				data: this.businessData,
			});
			this.backCardVisible = false;
			if (res && res.code == 200) {
				this.$message.success(res.message);
				this.$nextTick(() => {
					this.$dispatch('GET_BUSINESS_LIST');
					this.$closeSelf();
				});
			}
		},
		backCard() {
			if (this.$route.query.code == 'month_back_card_code') {
				this.monthBackCard();
			} else {
				this.logoutVip();
			}
		},
		backCardClose() {
			this.backCardVisible = false;
		},
		async isVisibleClose() {
			this.formData.isRetain = false;
			const res = await this.$fetch({
				method: 'POST',
				url: '/crm/memberHandle/api/changeMemberInfo',
				data: this.formData,
			});
			if (res && res.code == 200) {
				this.$dispatch('GET_BUSINESS_LIST');
				this.$closeSelf();
				this.isVisible = false;
				this.$message.success(res.message);
			}
		},
		async isVisibleSave() {
			this.formData.isRetain = true; // 是否沿用
			const res = await this.$fetch({
				method: 'POST',
				url: '/crm/memberHandle/api/changeMemberInfo',
				data: this.formData,
			});
			if (res && res.code == 200) {
				this.$dispatch('GET_BUSINESS_LIST');
				this.$closeSelf();
				this.$message.success(res.message);
				this.isVisible = false;
			}
		},
		beforeVideoUpload(file) {
			const whiteList = ['jpeg', 'jpg', 'bmp', 'png', 'raw', 'tiff', 'gif'];
			return uploadFileType.call(this, file, whiteList, 20);
		},
		beforeVideoUploadFile(file) {
			const whiteList = ['rar', 'zip', 'doc', 'docx', 'pdf'];
			return uploadFileType.call(this, file, whiteList, 500);
		},
		// 业务列表跳转查看详情
		async getDetails() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/crm/memberBusiness/getDetailByBusinessNo',
				params: {
					businessNo: this.businessNo,
				},
			});
			if (res) {
				const code = this.$route.query.code;
				const { editMemberBusinessDetail, editMemberInfo, memberBusinessExtend, memberInfo } = res.data;
				const { advanceName, freezeTimeStart, freezeTimeEnd, newManagerName, newManagerCardNo } = memberBusinessExtend;
				this.detail = memberInfo.memberBusiness;
				this.detail.freezeLimit = this.detail.freezeTimeStart
					? `${formatDateDefault(this.detail.freezeTimeStart)} ~ ${formatDateDefault(this.detail.freezeTimeEnd)}`
					: '';
				if (memberInfo.memberBusiness.changeFile && memberInfo.memberBusiness.changeFile != '') {
					let arr = memberInfo.memberBusiness.changeFile.split(',');
					this.changeDataList = arr.map(item => ({ url: item }));
				} else {
					this.changeDataList = [];
				}
				this.change = {
					followPerson: advanceName,
					date: freezeTimeStart ? [freezeTimeStart, freezeTimeEnd] : [],
					oa: memberInfo.memberBusiness.oaNo,
					remark: memberInfo.memberBusiness.changeRemark,
					checkTime: memberInfo.memberBusiness.approveTime,
				};
				if (memberInfo.memberBusiness.changeAnnex && memberInfo.memberBusiness.changeAnnex != '') {
					let arr = memberInfo.memberBusiness.changeAnnex.split(',');
					this.change.fileList = arr.map(item => ({ name: item }));
				} else {
					this.change.fileList = [];
				}

				// 更改个人资料  继承 转让按顾客
				if (code == 'person_change_code' || code == 'transfer_cus_change_code' || code == 'inherit_cus_change_code') {
					editMemberBusinessDetail.consumeFollowArr =
						editMemberBusinessDetail.consumeFollow.length > 0 ? editMemberBusinessDetail.consumeFollow.split(',') : [];
					editMemberBusinessDetail.spouseConsumeFollowArr =
						editMemberBusinessDetail.spouseConsumeFollow.length > 0
							? editMemberBusinessDetail.spouseConsumeFollow.split(',')
							: [];
					editMemberBusinessDetail.date = [
						editMemberBusinessDetail.certificatesStartDate,
						editMemberBusinessDetail.certificatesEndDate,
					];
					editMemberBusinessDetail.spouseDate = [
						editMemberBusinessDetail.spouseCertificatesStartDate,
						editMemberBusinessDetail.spouseCertificatesEndDate,
					];
					editMemberBusinessDetail.area = [
						editMemberBusinessDetail.province,
						editMemberBusinessDetail.city,
						editMemberBusinessDetail.district,
					];
					editMemberBusinessDetail.spouseArea = [
						editMemberBusinessDetail.spouseProvince,
						editMemberBusinessDetail.spouseCity,
						editMemberBusinessDetail.spouseDistrict,
					];
					this.info = this.numberToString(Object.assign(editMemberBusinessDetail, editMemberInfo));
				}
				// 继承 转让卡号
				if (code == 'inherit_card_change_code' || code == 'transfer_card_change_code') {
					this.cardInfo.inheritCard = memberBusinessExtend.inheritCardNo;
					this.cardInfo.maxLevel = memberBusinessExtend.maxLevel;
					this.cardInfo.cumtrapz = memberBusinessExtend.cumtrapz;
				}
				// 补填配偶信息
				if (code == 'add_spouse_msg_code') {
					editMemberBusinessDetail.spouseDate = [
						editMemberBusinessDetail.spouseCertificatesStartDate
							? editMemberBusinessDetail.spouseCertificatesStartDate
							: '',
						editMemberBusinessDetail.spouseCertificatesEndDate
							? editMemberBusinessDetail.spouseCertificatesEndDate
							: '',
					];
					this.spouseInfo = this.numberToString(editMemberBusinessDetail);
				}
				// 业务  更改卡号
				if (code == 'card_number_change_code') {
					this.cardForm.newCard = memberBusinessExtend.newCardNo;
				}
				// 业务  更改经办人
				if (code == 'handled_change_code') {
					this.handleFrom.newHandledCardNo = newManagerCardNo;
					this.handleFrom.newHandledName = newManagerName;
				}
				// 业务 注销VIP
				if (code == 'logout_vip_code') {
					this.detail.type = memberInfo.logoutType;
					this.vipForm.vipPlan = memberBusinessExtend.exclusivePlan;
					this.vipForm.vipSuitn = memberBusinessExtend.exclusivePackage;
					this.vipForm.newHandledCardNo = memberBusinessExtend.newManagerCardNo;
					this.vipForm.newHandledName = memberBusinessExtend.newManagerName;
				}
				if (this.detail.handledCardName) this.detail.handledName = this.detail.handledCardName;
				if (this.detail.storeName) this.detail.storeCode = this.detail.storeName;
			}
		},
		// 通过会员卡号查询顾客信息
		async queryMemberInfo() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/crm/memberHandle/api/queryMemberInfoByCardNo?cardNo=' + this.detail.cardNo,
			});
			if (res) {
				res.data.type = '';
				this.detail = Object.assign(this.detail, res.data);
				let { freezeStartDate, freezeEndDate } = this.detail;
				this.detail.freezeLimit = freezeStartDate
					? `${formatDateDefault(freezeStartDate)}~${formatDateDefault(freezeEndDate)}`
					: '';
				if (!this.BUSINESS_EDITINFO_TYPE_LS) {
					this.BUSINESS_EDITINFO_TYPE_LS = this.BUSINESS_EDITINFO_TYPE.map(e => e);
				}
				let BUSINESS_EDITINFO_TYPE = this.BUSINESS_EDITINFO_TYPE_LS.map(e => e);
				if (this.detail.channel === 7) {
					let launchArr = [
						'继承变更-按顾客',
						'继承变更-按卡号',
						'转让变更-按顾客',
						'转让变更-按卡号',
						'更改卡号',
						'冻结购物资格',
						'解冻购物资格',
					];
					launchArr.forEach(e => {
						BUSINESS_EDITINFO_TYPE.forEach((el, i) => {
							if (e === el.label) {
								BUSINESS_EDITINFO_TYPE.splice(i, 1);
							}
						});
					});
					this.BUSINESS_EDITINFO_TYPE = BUSINESS_EDITINFO_TYPE;
				} else {
					this.BUSINESS_EDITINFO_TYPE = this.BUSINESS_EDITINFO_TYPE_LS;
				}
			}
		},
		// 通过会员卡号查询顾客信息
		async queryHandleInfo() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/crm/memberHandle/api/queryMemberInfoByCardNo?cardNo=' + this.handleFrom.newHandledCardNo,
			});
			if (res) {
				this.handleFrom.newHandledName = res.data.realname;
			}
		},
		async queryVipInfo() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/crm/memberHandle/api/queryMemberInfoByCardNo?cardNo=' + this.vipForm.newHandledCardNo,
			});
			if (res) {
				this.vipForm.newHandledName = res.data.realname;
			}
		},
		// 根据会员卡号获取主卡顾客信息
		async getMasterMemberInfo() {
			if (this.detail.cardNo === '') {
				return;
			}
			const resp = await this.$fetch({
				method: 'GET',
				url: '/member/mgmt/getMasterMemberInfoByCardNo?cardNo=' + this.detail.cardNo,
			});
			if (resp.data.detail) {
				const { detail } = resp.data;
				detail.consumeFollowArr = detail.consumeFollow ? detail.consumeFollow.split(',') : [''];
				detail.spouseConsumeFollowArr = detail.spouseConsumeFollow ? detail.spouseConsumeFollow.split(',') : [''];
				detail.area = [detail.province, detail.city, detail.district];
				detail.spouseArea = [detail.spouseProvince, detail.spouseCity, detail.spouseDistrict];
				if (resp.data.contactMobile) detail.contactMobile = resp.data.contactMobile;
				this.info = Object.assign(this.info, this.numberToString(detail));
				this.componentInfo = this.numberToString(detail);
				this.componentInfo.date = [this.componentInfo.certificatesStartDate, this.componentInfo.certificatesEndDate];
				this.componentInfo.spouseDate = [
					this.componentInfo.spouseCertificatesStartDate,
					this.componentInfo.spouseCertificatesEndDate,
				];
				// this.changeInfoComponent = personChange;
			}
		},
		// 点击提交
		handleSubmit() {
			this.$refs['formRef'].validate(valid => {
				valid && this.submit();
			});
		},
		persinChangeData(e) {
			this.info = Object.assign(this.info, e);
			this.componentInfo = Object.assign(this.componentInfo, e);
		},
		async submit() {
			this.$refs.sourceChange && this.$refs.sourceChange.pushData && this.$refs.sourceChange.pushData();
			const code = this.detail.businessTypeCode;
			const { formData } = this;
			const { businessData } = this;
			// 更改个人资料  顾客变更继承
			if (code == 'person_change_code' || code == 'inherit_cus_change_code') {
				if (formData.spouseOrNot == 1) {
					const { personInfoForm, spouseForm } = this.$refs['sourceChange'].$refs;
					personInfoForm.validate(validPerson => {
						spouseForm.validate(validPouse => {
							if (validPerson && validPouse) {
								this.vailed = true;
							} else {
								this.vailed = false;
								this.$message({
									type: 'error',
									message: '请填写完成',
								});
							}
						});
					});
					// if (
					// 	formData.realname &&
					// 	formData.spouseRealname &&
					// 	formData.mobile &&
					// 	formData.spouseMobile &&
					// 	formData.certificatesNo &&
					// 	formData.spouseCertificatesNo &&
					// 	formData.certificatesType &&
					// 	formData.spouseCertificatesType
					// ) {
					// 	this.vailed = true;
					// } else {
					// 	this.vailed = false;
					// 	this.$message({
					// 		type: 'error',
					// 		message: '请填写完成',
					// 	});
					// }
					// 无配偶
				} else {
					const { personInfoForm } = this.$refs['sourceChange'].$refs;
					personInfoForm.validate(validPerson => {
						if (validPerson) {
							this.vailed = true;
						} else {
							this.vailed = false;
							this.$message({
								type: 'error',
								message: '请填写完成',
							});
						}
					});
				}
				// if (formData.realname && formData.mobile && formData.certificatesNo && formData.certificatesType) {
				// 	this.vailed = true;
				// } else {
				// 	this.vailed = false;
				// 	this.$message({
				// 		type: 'error',
				// 		message: '请填写完成',
				// 	});
				// }
			}
			// 转让变更-按顾客
			if (code == 'transfer_cus_change_code') {
				const res = await this.$fetch({
					method: 'POST',
					url: '/crm/memberHandle/api/changeMemberInfo',
					data: formData,
				});
				if (res && res.code == 200) {
					this.$message({
						type: 'success',
						message: res.message,
					});
					this.$closeSelf();
				}
			}
			// 补填配偶信息
			if (code == 'add_spouse_msg_code') {
				let { spouseRealname, spouseCertificatesNo, spouseCertificatesType } = formData;
				if (spouseRealname && spouseCertificatesNo && spouseCertificatesType) {
					this.vailed = true;
				} else {
					this.vailed = false;
					this.$message({
						type: 'error',
						message: '请填写完成',
					});
				}
			}
			// 变更 继承 变更-按卡号
			if (code == 'inherit_card_change_code' || code == 'transfer_card_change_code') {
				if (formData.inheritCard && formData.inheritCard != '') {
					this.vailed = true;
				} else {
					this.vailed = false;
					this.$message({
						type: 'error',
						message: '请填写完成',
					});
				}
			}
			// 去除配偶信息
			if (code == 'del_spouse_msg_code') {
				this.vailed = true;
			}
			// 本人与配偶信息对调
			if (code == 'self_spouse_exchange_code') {
				this.isVisible = true;
			}
			// 只用作 资料变更
			if (this.vailed) {
				const res = await this.$fetch({
					method: 'POST',
					url: '/crm/memberHandle/api/changeMemberInfo',
					data: formData,
				});
				if (res && res.code == 200) {
					this.$message.success(res.message);
					this.$nextTick(() => {
						this.$dispatch('GET_BUSINESS_LIST');
						this.$closeSelf();
					});
				}
			}
			// 更改卡号
			if (code == 'card_number_change_code') {
				this.$refs.formbd.validate(async valid => {
					if (valid) {
						if (this.cardForm.newCard && this.cardForm.newCard != '') {
							const res = await this.$fetch({
								method: 'POST',
								url: '/crm/memberHandle/api/cardNumberChange?newCard=' + this.cardForm.newCard,
								data: businessData,
							});
							if (res && res.code == 200) {
								this.$message.success(res.message);
								this.$nextTick(() => {
									this.$dispatch('GET_BUSINESS_LIST');
									this.$closeSelf();
								});
							}
						} else {
							this.$message({
								type: 'error',
								message: '请输入新卡号',
							});
						}
					}
				});
			}
			// 更改经办人
			if (code == 'handled_change_code') {
				this.$refs.handleFromrules.validate(async valid => {
					if (valid) {
						const res = await this.$fetch({
							method: 'POST',
							url: '/crm/memberHandle/api/changeHandled',
							data: businessData,
						});
						if (res && res.code == 200) {
							this.$message.success(res.message);
							this.$nextTick(() => {
								this.$dispatch('GET_BUSINESS_LIST');
								this.$closeSelf();
							});
						}
					}
				});
			}
			// 当月退卡
			if (code == 'month_back_card_code') {
				const res = await this.$fetch({
					method: 'GET',
					url: '/crm/memberHandle/api/remind?cardNo=' + businessData.cardNo,
				});
				if (res.data && res.data != '') {
					// 有内容需要弹窗展示 ，是 调用退卡接口  否 取消
					this.backCardMsg = res.data.split('\n');
					this.backCardVisible = true;
				} else {
					let res = await this.$fetch({
						method: 'POST',
						url: '/crm/memberHandle/api/monthBackCard',
						data: businessData,
					});
					if (res && res.code == 200) {
						this.$message.success(res.message);
						this.$nextTick(() => {
							this.$dispatch('GET_BUSINESS_LIST');
							this.$closeSelf();
						});
					}
				}
			}
			// 恢复资格
			if (code == 'reinstatement_code') {
				const res = await this.$fetch({
					method: 'POST',
					url: '/crm/memberHandle/api/reinstatement',
					data: businessData,
				});
				if (res && res.code == 200) {
					this.$message.success(res.message);
					this.$nextTick(() => {
						this.$dispatch('GET_BUSINESS_LIST');
						this.$closeSelf();
					});
				}
			}
			// 注销vip
			if (code == 'logout_vip_code') {
				let { type, cardNo } = this.detail;
				let { newHandledCardNo } = this.vipForm;
				this.$refs['vipForm'].validate(async valid => {
					if (valid) {
						if ((type == 1 && newHandledCardNo === cardNo) || newHandledCardNo === '0000000') {
							return this.$message.warning('该卡号不能做回归处理的经办人，请确认');
						}
						const res = await this.$fetch({
							method: 'GET',
							url: '/crm/memberHandle/api/remind?cardNo=' + businessData.cardNo,
						});
						if (res.data && res.data != '') {
							// 有内容需要弹窗展示 ，是 调用退卡接口  否 取消
							this.backCardMsg = res.data.split('\n');
							this.backCardVisible = true;
						} else {
							this.logoutVip();
						}
					}
				});
			}
			// 冻结
			if (code == 'freeze_purchase_qualification') {
				this.$refs.changeInfo.validate(async valid => {
					if (valid) {
						const res = await this.$fetch({
							method: 'POST',
							url: '/crm/memberHandle/api/freezeOrUnFreeze',
							data: businessData,
						});
						if (res && res.code == 200) {
							this.$message.success(res.message);
							this.$nextTick(() => {
								this.$dispatch('GET_BUSINESS_LIST');
								this.$closeSelf();
							});
						}
					}
				});
			}
			// 解冻
			if (code == 'unfreezing_purchase_qualification') {
				this.$refs.changeInfo.validate(async valid => {
					if (valid) {
						const res = await this.$fetch({
							method: 'POST',
							url: '/crm/memberHandle/api/freezeOrUnFreeze',
							data: businessData,
						});
						if (res && res.code == 200) {
							this.$message.success(res.message);
							this.$nextTick(() => {
								this.$dispatch('GET_BUSINESS_LIST');
								this.$closeSelf();
							});
						}
					}
				});
			}
			this.$dispatch('GET_BUSINESS_LIST');
		},
		// 变更资料图片上传成功
		handleSuccess(response, file, fileList) {
			this.changeDataList = fileList;
		},
		// 变更图片删除
		handleRemove(file, fileList) {
			this.changeDataList = fileList;
		},
		handleRemoveFile(file, fileList) {
			this.change.fileList = fileList;
		},
		handleSuccessFile(response, file, fileList) {
			this.change.fileList = fileList;
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		numberToString(obj) {
			for (let i in obj) {
				if (typeof obj[i] == 'number') {
					obj[i] = obj[i].toString();
				}
			}
			return obj;
		},
		cancelEdit() {
			this.$dispatch('GET_BUSINESS_LIST');
			this.$closeSelf();
		},
	},
};
</script>

<style lang="scss" scoped>
.row-gap {
	margin-bottom: 16px;
}
.tips {
	font-size: 12px;
	color: $color-body-se;
	line-height: 22px;
}
.business-textarea {
	width: 350px;
}
.business-input {
	width: 350px;
}
.business-select {
	width: 350px;
}
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
.d-t {
	font-size: 16px;
	.el-icon-warning {
		font-size: 18px;
		color: #fdad4d;
	}
}
.batch-void {
	display: flex;
	.is-text-top {
		flex: 1.3;
		line-height: 40px;
		height: 40px;
		.el-icon-question {
			color: $warning;
			font-size: 40px;
			float: left;
		}
		.text {
			font-size: 18px;
			color: $color-body-se;
			display: inline-block;
			margin-bottom: 10px;
		}
	}
	.is-text {
		flex: 8.7;
		font-size: 14px;
		p {
			line-height: 26px;
		}
	}
}
</style>
