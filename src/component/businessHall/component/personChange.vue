<template>
	<div>
		<!-- 个人信息 -->
		<el-card v-if="addspouse == true" class="row-gap">
			<h3 slot="header">{{ title.split('|')[0] }}</h3>
			<el-form
				class="information-main"
				:model="pageInfo"
				ref="personInfoForm"
				:rules="infoRules"
				label-position="right"
				label-width="90px"
				label-suffix=":"
				:inline="true"
			>
				<div class="information-left">
					<el-form-item>
						<el-upload
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							:limit="1"
							list-type="picture-card"
							:on-preview="handlePictureCardPreview"
							:on-remove="posiRemove"
							:on-success="posiSuccess"
							:file-list="positiveList"
							:class="positiveList && positiveList.length === 1 ? 'hide_box' : ''"
						>
							<i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog v-drag :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl" alt="" />
						</el-dialog>
						<span class="tipTitle">上传证件正面</span>
					</el-form-item>
					<el-form-item>
						<el-upload
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							:limit="1"
							list-type="picture-card"
							:on-preview="handlePictureCardPreview"
							:on-remove="negaRemove"
							:on-success="negaSuccess"
							:file-list="negative"
							:class="negative.length === 1 ? 'hide_box' : ''"
						>
							<i class="el-icon-plus"></i>
						</el-upload>
						<span class="tipTitle">上传证件背面</span>
					</el-form-item>
				</div>
				<div class="information-right">
					<el-form-item label="姓名" prop="realname">
						<el-input
							size="small"
							v-model="pageInfo.realname"
							class="business-input"
							placeholder="姓名"
							clearable
							:readonly="viewDetail"
						/>
					</el-form-item>
					<el-form-item label="性别" prop="gender">
						<el-select v-model="pageInfo.gender" size="small" class="business-input" clearable :disabled="viewDetail">
							<el-option label="男" value="1">男</el-option>
							<el-option label="女" value="2">女</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="婚姻状况" prop="marital">
						<el-select v-model="pageInfo.marital" size="small" class="business-input" clearable :disabled="viewDetail">
							<el-option label="未婚" value="1">未婚</el-option>
							<el-option label="已婚" value="2">已婚</el-option>
							<el-option label="离异" value="3">离异</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="证件号" class="info-item" prop="certificatesNo">
						<el-select
							v-model="pageInfo.certificatesType"
							size="small"
							class="info-short-select"
							:disabled="viewDetail"
						>
							<el-option label="身份证" value="1">身份证</el-option>
							<el-option label="其它" value="2">其它</el-option>
						</el-select>
						<el-input
							size="small"
							class="info-long-input"
							v-model="pageInfo.certificatesNo"
							placeholder="请输入证件号"
							clearable
							:readonly="viewDetail"
						/>
					</el-form-item>
					<el-form-item label="文化程度" prop="education">
						<el-select
							v-model="pageInfo.education"
							size="small"
							class="business-input"
							clearable
							:disabled="viewDetail"
						>
							<el-option v-for="(item, index) in educationList" :key="index" :label="item.name" :value="item.code">
								{{ item.name }}
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="证件有效期">
						<el-date-picker
							v-model="pageInfo.date"
							type="daterange"
							align="left"
							unlink-panels
							value-format="yyyy-MM-dd"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:readonly="viewDetail"
						></el-date-picker>
					</el-form-item>
					<el-form-item label="联系手机">
						<!-- prop="mobile" -->
						<el-input
							size="small"
							v-model="pageInfo.contactMobile"
							placeholder="联系手机"
							class="business-input"
							clearable
							:readonly="viewDetail"
						/>
					</el-form-item>
					<el-form-item label="住宅电话" prop="homePhone">
						<el-input
							size="small"
							v-model="pageInfo.homePhone"
							placeholder="住宅电话"
							class="business-input"
							clearable
							:readonly="viewDetail"
						/>
					</el-form-item>
					<el-form-item label="邮政编码" prop="postcode">
						<el-input
							size="small"
							v-model="pageInfo.postcode"
							placeholder="邮政编码"
							class="business-input"
							clearable
							:readonly="viewDetail"
						/>
					</el-form-item>
					<el-form-item label="民族" prop="nation">
						<el-input
							size="small"
							v-model="pageInfo.nation"
							placeholder="民族"
							class="business-input"
							clearable
							:readonly="viewDetail"
						/>
					</el-form-item>
					<el-form-item label="居住地" prop="livePlace">
						<el-select
							v-model="pageInfo.livePlace"
							size="small"
							class="business-input"
							clearable
							:disabled="viewDetail"
						>
							<el-option v-for="(item, index) in liveList" :key="index" :label="item.name" :value="item.code">
								{{ item.name }}
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="电子邮件" prop="email">
						<el-input
							size="small"
							v-model="pageInfo.email"
							placeholder="电子邮件"
							class="business-input"
							clearable
							:readonly="viewDetail"
						/>
					</el-form-item>
					<el-form-item label="所在地区" prop="area">
						<addressSelect
							style="width: 800px"
							@chooseAddress="e => changeConsigneeRegion(e, 'area')"
							:defalutData="pageInfo.area"
							:needValid="false"
							:disabled="viewDetail"
							:size="'small'"
							:isStreetCode="false"
						></addressSelect>
					</el-form-item>
					<el-form-item label="职业" prop="profession">
						<el-select
							v-model="pageInfo.profession"
							size="small"
							class="business-input"
							clearable
							:disabled="viewDetail"
						>
							<el-option v-for="(item, index) in proTypeList" :key="index" :label="item.name" :value="item.code">
								{{ item.name }}
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="详细地址" prop="address">
						<el-input
							size="small"
							v-model="pageInfo.address"
							placeholder="请填写详细地址"
							class="business-input"
							clearable
							:readonly="viewDetail"
						/>
					</el-form-item>
					<el-form-item label="消费关注" prop="consumeFollowArr">
						<el-checkbox-group v-model="pageInfo.consumeFollowArr" :disabled="viewDetail">
							<el-checkbox v-for="(item, index) in consumeList" :key="index" :label="item.code">
								{{ item.name }}
							</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</div>
			</el-form>
		</el-card>
		<!-- 配偶信息 -->
		<el-card v-if="addspouse == true && pageInfo.spouseOrNot === '1'" class="row-gap">
			<h3 slot="header">{{ title.split('|')[1] }}</h3>
			<el-form
				class="information-main"
				:model="pageInfo"
				ref="spouseForm"
				:rules="spouseRules"
				label-position="right"
				label-width="90px"
				label-suffix=":"
				:inline="true"
			>
				<div class="information-left">
					<el-form-item>
						<el-upload
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							:limit="1"
							list-type="picture-card"
							:on-preview="handlePictureCardPreview"
							:on-remove="posiRemoveSpouse"
							:on-success="posiSuccessSpouse"
							:file-list="positiveListSpouse"
							:class="positiveListSpouse && positiveListSpouse.length === 1 ? 'hide_box' : ''"
						>
							<i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog v-drag :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl" alt="" />
						</el-dialog>
						<span class="tipTitle">上传证件正面</span>
					</el-form-item>
					<el-form-item>
						<el-upload
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							:limit="1"
							list-type="picture-card"
							:on-preview="handlePictureCardPreview"
							:on-remove="negaRemoveSpouse"
							:on-success="negaSuccessSpouse"
							:file-list="negativeSpouse"
							:class="negativeSpouse && negativeSpouse.length === 1 ? 'hide_box' : ''"
						>
							<i class="el-icon-plus"></i>
						</el-upload>
						<span class="tipTitle">上传证件背面</span>
					</el-form-item>
				</div>
				<div class="information-right">
					<el-form-item label="姓名" prop="spouseRealname">
						<el-input
							size="small"
							v-model="pageInfo.spouseRealname"
							placeholder="姓名"
							class="business-input"
							clearable
							:readonly="viewDetail"
						/>
					</el-form-item>
					<el-form-item label="性别" prop="spouseGender">
						<el-select
							v-model="pageInfo.spouseGender"
							size="small"
							class="business-input"
							clearable
							:disabled="viewDetail"
						>
							<el-option label="男" value="1">男</el-option>
							<el-option label="女" value="2">女</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="婚姻状况" prop="spouseMarital">
						<el-select
							v-model="pageInfo.spouseMarital"
							size="small"
							class="business-input"
							clearable
							:disabled="viewDetail"
						>
							<el-option label="未婚" value="1">未婚</el-option>
							<el-option label="已婚" value="2">已婚</el-option>
							<el-option label="离异" value="3">离异</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="证件号" class="info-item" prop="spouseCertificatesNo">
						<el-select
							v-model="pageInfo.spouseCertificatesType"
							size="small"
							class="info-short-select"
							:disabled="viewDetail"
						>
							<el-option label="身份证" value="1">身份证</el-option>
							<el-option label="其它" value="2">其它</el-option>
						</el-select>
						<el-input
							size="small"
							class="info-long-input"
							v-model="pageInfo.spouseCertificatesNo"
							placeholder="请输入证件号"
							clearable
							:readonly="viewDetail"
						/>
					</el-form-item>
					<el-form-item label="文化程度" prop="spouseEducation">
						<el-select
							v-model="pageInfo.spouseEducation"
							size="small"
							class="business-input"
							clearable
							:disabled="viewDetail"
						>
							<el-option v-for="(item, index) in educationList" :key="index" :label="item.name" :value="item.code">
								{{ item.name }}
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="证件有效期">
						<el-date-picker
							v-model="pageInfo.spouseDate"
							type="daterange"
							align="left"
							unlink-panels
							value-format="yyyy-MM-dd"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:readonly="viewDetail"
						></el-date-picker>
					</el-form-item>
					<el-form-item label="联系手机">
						<!-- prop="spouseMobile" -->
						<el-input
							size="small"
							v-model="pageInfo.spouseMobile"
							placeholder="联系手机"
							class="business-input"
							clearable
							:readonly="viewDetail"
						/>
					</el-form-item>
					<el-form-item label="住宅电话" prop="spouseHomePhone">
						<el-input
							size="small"
							v-model="pageInfo.spouseHomePhone"
							placeholder="住宅电话"
							class="business-input"
							clearable
							:readonly="viewDetail"
						/>
					</el-form-item>
					<el-form-item label="邮政编码" prop="spousePostcode">
						<el-input
							size="small"
							v-model="pageInfo.spousePostcode"
							placeholder="邮政编码"
							class="business-input"
							clearable
							:readonly="viewDetail"
						/>
					</el-form-item>
					<el-form-item label="民族" prop="spouseNation">
						<el-input
							size="small"
							v-model="pageInfo.spouseNation"
							placeholder="民族"
							class="business-input"
							clearable
							:readonly="viewDetail"
						/>
					</el-form-item>
					<el-form-item label="居住地" prop="spouseLivePlace">
						<el-select
							v-model="pageInfo.spouseLivePlace"
							size="small"
							class="business-input"
							clearable
							:disabled="viewDetail"
						>
							<el-option v-for="(item, index) in liveList" :key="index" :label="item.name" :value="item.code">
								{{ item.name }}
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="电子邮件" prop="spouseCardEmail">
						<el-input
							size="small"
							v-model="pageInfo.spouseCardEmail"
							placeholder="电子邮件"
							class="business-input"
							clearable
							:readonly="viewDetail"
						/>
					</el-form-item>
					<el-form-item label="所在地区" prop="spouseArea">
						<addressSelect
							:disabled="viewDetail"
							style="width: 800px"
							@chooseAddress="e => changeConsigneeRegion(e, 'spouseArea')"
							:defalutData="pageInfo.spouseArea"
							:needValid="false"
							:size="'small'"
							:isStreetCode="false"
						></addressSelect>
					</el-form-item>
					<el-form-item label="职业" prop="spouseProfession">
						<el-select
							v-model="pageInfo.spouseProfession"
							size="small"
							class="business-input"
							clearable
							:disabled="viewDetail"
						>
							<el-option v-for="(item, index) in proTypeList" :key="index" :label="item.name" :value="item.code">
								{{ item.name }}
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="详细地址" prop="spouseAddress">
						<el-input
							class="business-input"
							size="small"
							v-model="pageInfo.spouseAddress"
							placeholder="请填写详细地址"
							clearable
							:readonly="viewDetail"
						/>
					</el-form-item>
					<el-form-item label="消费关注">
						<el-checkbox-group v-model="pageInfo.spouseConsumeFollowArr" :disabled="viewDetail">
							<el-checkbox v-for="(item, index) in consumeList" :key="index" :label="item.code">
								{{ item.name }}
							</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</div>
			</el-form>
		</el-card>
		<!-- 填补配偶信息 -->
		<el-card v-if="addspouse == false" class="row-gap">
			<h3 slot="header">{{ title.split('|')[0] }}</h3>
			<el-form
				class="information-main"
				:model="pageInfo"
				:rules="spouseRules"
				ref="fillSpouseForm"
				label-position="right"
				label-width="90px"
				label-suffix=":"
				:inline="true"
			>
				<div class="information-left">
					<el-form-item>
						<el-upload
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							:limit="1"
							list-type="picture-card"
							:on-preview="handlePictureCardPreview"
							:on-remove="posiRemoveSpouse"
							:on-success="posiSuccessSpouse"
							:file-list="positiveListSpouse"
							:class="positiveListSpouse && positiveListSpouse.length === 1 ? 'hide_box' : ''"
						>
							<i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog v-drag :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl" alt="" />
						</el-dialog>
						<span class="tipTitle">上传证件正面</span>
					</el-form-item>
					<el-form-item>
						<el-upload
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							:limit="1"
							list-type="picture-card"
							:on-preview="handlePictureCardPreview"
							:on-remove="negaRemoveSpouse"
							:on-success="negaSuccessSpouse"
							:file-list="negativeSpouse"
							:class="negativeSpouse && negativeSpouse.length === 1 ? 'hide_box' : ''"
						>
							<i class="el-icon-plus"></i>
						</el-upload>
						<span class="tipTitle">上传证件背面</span>
					</el-form-item>
				</div>
				<div class="information-right">
					<el-form-item label="姓名" prop="spouseRealname">
						<el-input
							size="small"
							v-model="pageInfo.spouseRealname"
							placeholder="姓名"
							class="business-input"
							clearable
							:readonly="viewDetail"
						/>
					</el-form-item>
					<el-form-item label="性别" prop="spouseGender">
						<el-select
							v-model="pageInfo.spouseGender"
							size="small"
							class="business-input"
							clearable
							:disabled="viewDetail"
						>
							<el-option label="男" value="1">男</el-option>
							<el-option label="女" value="2">女</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="联系手机">
						<!-- prop="spouseMobile" -->
						<el-input
							size="small"
							v-model="pageInfo.spouseMobile"
							placeholder="联系手机"
							class="business-input"
							clearable
							:readonly="viewDetail"
						/>
					</el-form-item>
					<el-form-item label="证件号" class="info-item" prop="spouseCertificatesNo">
						<el-select
							v-model="pageInfo.spouseCertificatesType"
							size="small"
							class="info-short-select"
							:disabled="viewDetail"
						>
							<el-option label="身份证" value="1">身份证</el-option>
							<el-option label="其它" value="2">其它</el-option>
						</el-select>
						<el-input
							size="small"
							class="info-long-input"
							v-model="pageInfo.spouseCertificatesNo"
							placeholder="请输入证件号"
							clearable
							:readonly="viewDetail"
						/>
					</el-form-item>
					<el-form-item label="证件有效期">
						<el-date-picker
							v-model="pageInfo.spouseDate"
							type="daterange"
							align="left"
							unlink-panels
							value-format="yyyy-MM-dd"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:readonly="viewDetail"
						></el-date-picker>
					</el-form-item>
				</div>
			</el-form>
		</el-card>
	</div>
</template>
<script>
export default {
	name: 'personChange',
	props: {
		addspouse: {
			type: Boolean,
		},
		viewDetail: {
			type: Boolean,
		},
		info: {
			// 数据源
			type: Object,
			default() {
				return {
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
					certificatesPositiveUrl: '', // 个人 正面照片
					certificatesReverseUrl: '', // 个人 反面照片
					spouseCertificatesPositiveUrl: '', // 配偶 正面照片
					spouseCertificatesReverseUrl: '', // 配偶 反面照片
					consumeFollowArr: [],
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
				};
			},
		},
		spouseInfo: {
			type: Object,
			default() {
				return {
					spouseRealname: '',
					spouseGender: '',
					spouseCertificatesType: '1',
					spouseCertificatesNo: '',
					spouseDate: '',
					spouseMobile: '',
				};
			},
		},
		title: {
			type: String,
			default() {},
		},
	},
	watch: {
		info: {
			handler(val) {
				this.pageInfo = Object.assign(this.pageInfo, val);
				this.pageInfo.date = val.date && val.date.length > 0 && !val.date[0] ? [] : val.date;
				this.pageInfo.spouseDate =
					val.spouseDate && val.spouseDate.length > 0 && !val.spouseDate[0] ? [] : val.spouseDate;
				this.positiveList = val.certificatesPositiveUrl ? [{ url: val.certificatesPositiveUrl }] : [];
				this.negative = val.certificatesReverseUrl ? [{ url: val.certificatesReverseUrl }] : [];
				this.positiveListSpouse = val.spouseCertificatesPositiveUrl ? [{ url: val.spouseCertificatesPositiveUrl }] : [];
				this.negativeSpouse = val.spouseCertificatesReverseUrl ? [{ url: val.spouseCertificatesReverseUrl }] : [];
			},
			deep: true,
			immediate: true,
		},
	},
	data() {
		return {
			postValue: [],
			pageInfo: {
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
				certificatesPositiveUrl: '', // 个人 正面照片
				certificatesReverseUrl: '', // 个人 反面照片
				spouseCertificatesPositiveUrl: '', // 配偶 正面照片
				spouseCertificatesReverseUrl: '', // 配偶 反面照片
				consumeFollowArr: [],
				spouseOrNot: '',
				spouseRealname: '',
				spouseGender: '',
				spouseMarital: '',
				spouseCertificatesType: '',
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
			consumeList: [],
			educationList: [],
			proTypeList: [],
			liveList: [],
			hrefLink: '',
			positiveList: [],
			negative: [],
			positiveListSpouse: [],
			negativeSpouse: [],
			dialogImageUrl: '',
			dialogVisible: false,
			infoRules: {
				realname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
				contactMobile: [
					{ required: true, message: '请输入手机号', trigger: 'blur' },
					{ min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' },
				],
				mobile: [
					{ required: true, message: '请输入手机号', trigger: 'blur' },
					{ min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' },
				],
				certificatesNo: [{ required: true, message: '请输入身份证', trigger: 'blur' }],
			},
			spouseRules: {
				spouseRealname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
				spouseMobile: [
					{ required: true, message: '请输入手机号', trigger: 'blur' },
					{ min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' },
				],
				spouseCertificatesNo: [{ required: true, message: '请输入证件号', trigger: 'blur' }],
			},
		};
	},
	created() {
		this.getconsume();
		this.getEducation();
		this.getProtype();
		this.getLiveplace();
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.crm,
			};
			return params;
		},
	},
	methods: {
		// 下拉框
		changeConsigneeRegion(data, type) {
			this.pageInfo[type] = data.map(x => x.value);
		},
		pushData() {
			this.$emit('persinChangeData', { ...this.pageInfo });
		},
		async getconsume() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/crm/lov/getCrmLovListByType?dictType=' + 'consume_follow',
			});
			if (res && res.code === 200 && res.data) {
				this.consumeList = res.data;
			}
		},
		async getEducation() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/crm/lov/getCrmLovListByType?dictType=' + 'education',
			});
			if (res && res.code === 200 && res.data) {
				this.educationList = res.data;
			}
		},
		async getProtype() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/crm/lov/getCrmLovListByType?dictType=' + 'profession_type',
			});
			if (res && res.code === 200 && res.data) {
				this.proTypeList = res.data;
			}
		},
		async getLiveplace() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/crm/lov/getCrmLovListByType?dictType=' + 'live_place',
			});
			if (res && res.code === 200 && res.data) {
				this.liveList = res.data;
			}
		},
		handleSuccess() {},
		handleRemove() {},
		// 个人身份证正面
		posiSuccess(response, file, fileList) {
			this.positiveList = fileList;
			this.pageInfo.certificatesPositiveUrl = response.datas.fileUrlKey;
		},
		posiRemove(file, fileList) {
			this.pageInfo.certificatesPositiveUrl = '';
			this.positiveList = fileList;
		},
		// 个人身份证反面
		negaSuccess(response, file, fileList) {
			this.negative = fileList;
			this.pageInfo.certificatesReverseUrl = response.datas.fileUrlKey;
		},
		negaRemove(file, fileList) {
			this.pageInfo.certificatesReverseUrl = '';
			this.negative = fileList;
		},

		// 配偶身份证正面
		posiSuccessSpouse(response, file, fileList) {
			this.positiveListSpouse = fileList;
			this.pageInfo.spouseCertificatesPositiveUrl = response.datas.fileUrlKey;
		},
		posiRemoveSpouse(file, fileList) {
			this.pageInfo.spouseCertificatesPositiveUrl = '';
			this.positiveListSpouse = fileList;
		},
		// 配偶身份证反面
		negaSuccessSpouse(response, file, fileList) {
			this.negativeSpouse = fileList;
			this.pageInfo.spouseCertificatesReverseUrl = response.datas.fileUrlKey;
		},
		negaRemoveSpouse(file, fileList) {
			this.info.spouseCertificatesReverseUrl = '';
			this.negativeSpouse = fileList;
		},
		// 图片预览
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
	},
};
</script>
<style lang="scss" scoped>
.information-main {
	display: flex;
	.information-left {
		flex: 1;
	}
	.information-right {
		flex: 9;
	}
}
.row-gap {
	margin-bottom: 16px;
}
.tips {
	font-size: 12px;
	color: $color-body-se;
	line-height: 22px;
}
.business-input {
	width: 350px;
}
.business-select {
	width: 350px;
}
::v-deep.el-form-item {
	margin-bottom: 2;
}
.info-short-select {
	width: 100px;
}
.info-long-input {
	width: 250px;
}
.casca {
	width: 350px;
}
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
</style>