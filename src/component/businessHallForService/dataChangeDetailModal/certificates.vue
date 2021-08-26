<template>
	<div>
		<div class="text-div">
			<div class="text-p">
				<span>营业执照名称：</span>
				<el-popover
					placement="top-start"
					trigger="hover"
					width="200"
					:content="businessInfo.info.certificateName || '--'"
				>
					<span
						slot="reference"
						:style="{
							color:
								oldBusinessInfo.info &&
								(businessInfo.info.certificateName === oldBusinessInfo.info.certificateName ? '' : 'red'),
						}"
					>
						{{ businessInfo.info.certificateName || '--' }}
					</span>
				</el-popover>
			</div>
			<p class="text-p">
				<span>经营类型：</span>
				<el-popover placement="top-start" trigger="hover" width="200" :content="businessInfo.info.operatorType">
					<span
						slot="reference"
						:style="{
							color:
								oldBusinessInfo.info &&
								(businessInfo.info.operatorType === oldBusinessInfo.info.operatorType ? '' : 'red'),
						}"
					>
						{{ businessInfo.info.operatorType }}
					</span>
				</el-popover>
			</p>
			<p class="text-p">
				<span>社会信用代码：</span>
				<el-popover
					placement="top-start"
					width="200"
					trigger="hover"
					:content="businessInfo.info.socialCreditCode || '--'"
				>
					<span
						slot="reference"
						:style="{
							color:
								oldBusinessInfo.info &&
								(businessInfo.info.socialCreditCode === oldBusinessInfo.info.socialCreditCode ? '' : 'red'),
						}"
					>
						{{ businessInfo.info.socialCreditCode || '--' }}
					</span>
				</el-popover>
			</p>
			<p class="text-p">
				<span>纳税人识别号：</span>
				<el-popover
					placement="top-start"
					width="200"
					trigger="hover"
					:content="businessInfo.info.identificationCode || '--'"
				>
					<span
						slot="reference"
						:style="{
							color:
								oldBusinessInfo.info &&
								(businessInfo.info.identificationCode === oldBusinessInfo.info.identificationCode ? '' : 'red'),
						}"
					>
						{{ businessInfo.info.identificationCode || '--' }}
					</span>
				</el-popover>
			</p>
			<p class="text-p">
				<span>办证机关：</span>
				<el-popover
					placement="top-start"
					width="200"
					trigger="hover"
					:content="businessInfo.info.certificationAuthority || '--'"
				>
					<span
						slot="reference"
						:style="{
							color:
								oldBusinessInfo.info &&
								(businessInfo.info.certificationAuthority === oldBusinessInfo.info.certificationAuthority ? '' : 'red'),
						}"
					>
						{{ businessInfo.info.certificationAuthority || '--' }}
					</span>
				</el-popover>
			</p>
			<p class="text-p">
				<span>经营者：</span>
				<el-popover placement="top-start" width="200" trigger="hover" :content="businessInfo.info.operatorName || '--'">
					<span
						slot="reference"
						:style="{
							color:
								oldBusinessInfo.info &&
								(businessInfo.info.operatorName === oldBusinessInfo.info.operatorName ? '' : 'red'),
						}"
					>
						{{ businessInfo.info.operatorName || '--' }}
					</span>
				</el-popover>
			</p>
			<p class="text-p">
				<span>执照证件号码：</span>
				<!-- 执照证件注册号/ -->
				<el-popover
					placement="top-start"
					width="200"
					trigger="hover"
					:content="businessInfo.info.certificateCode || '--'"
				>
					<span
						slot="reference"
						:style="{
							color:
								oldBusinessInfo.info &&
								(businessInfo.info.certificateCode === oldBusinessInfo.info.certificateCode ? '' : 'red'),
						}"
					>
						{{ businessInfo.info.certificateCode || '--' }}
					</span>
				</el-popover>
			</p>
			<p class="text-p">
				<span>办证日期：</span>
				<el-popover
					placement="top-start"
					width="200"
					trigger="hover"
					:content="businessInfo.certificateDate | formatDate"
				>
					<span
						slot="reference"
						:style="{
							color: oldBusinessInfo && (businessInfo.certificateDate === oldBusinessInfo.certificateDate ? '' : 'red'),
						}"
					>
						{{ businessInfo.certificateDate | formatDate }}
					</span>
				</el-popover>
			</p>
			<p class="text-p">
				<span>证件有效期：</span>
				<el-popover placement="top-start" width="200" trigger="hover" :content="businessInfoexpiryDate || '--'">
					<span
						slot="reference"
						:style="{
							color: oldBusinessInfo && (businessInfo.expiryDate === oldBusinessInfo.expiryDate ? '' : 'red'),
						}"
					>
						{{ businessInfoexpiryDate || '--' }}
					</span>
				</el-popover>
			</p>
			<p class="text-p">
				<span>经营场所：</span>
				<el-popover
					placement="top-start"
					width="200"
					trigger="hover"
					:content="
						businessInfo.info.businessProvinceName +
						businessInfo.info.businessCityName +
						businessInfo.info.businessAreaName +
						businessInfo.info.businessStreetName +
						(businessInfo.info.businessPlace || '--')
					"
				>
					<span
						slot="reference"
						:style="{
							color:
								oldBusinessInfo.info &&
								(businessInfo.info.businessPlace === oldBusinessInfo.info.businessPlace ? '' : 'red'),
						}"
					>
						{{
							businessInfo.info.businessProvinceName +
							businessInfo.info.businessCityName +
							businessInfo.info.businessAreaName +
							businessInfo.info.businessStreetName
						}}{{ businessInfo.info.businessPlace || '--' }}
					</span>
				</el-popover>
			</p>
			<p class="text-p">
				<span>范围是否包含销售：</span>
				<span
					:style="{
						color: oldBusinessInfo.info && (businessInfo.info.isSale === oldBusinessInfo.info.isSale ? '' : 'red'),
					}"
				>
					{{ businessInfo.info.isSale == 1 ? '有' : '无' }}
				</span>
			</p>
			<p class="text-p">
				<span>五证合一：</span>
				<span
					:style="{
						color: oldBusinessInfo.info && (businessInfo.info.isFive === oldBusinessInfo.info.isFive ? '' : 'red'),
					}"
				>
					{{ businessInfo.info.isFive ? '有' : '无' }}
				</span>
			</p>
		</div>

		<div class="text-div suiwudengji">
			<p class="text-p-f">
				<span>执照经营范围：</span>
				<el-popover
					placement="top-start"
					width="200"
					trigger="hover"
					:content="businessInfo.info.businessScope || '--'"
				>
					<span
						slot="reference"
						:style="{
							color:
								oldBusinessInfo.info &&
								(businessInfo.info.businessScope === oldBusinessInfo.info.businessScope ? '' : 'red'),
						}"
					>
						{{ businessInfo.info.businessScope || '--' }}
					</span>
				</el-popover>
			</p>
		</div>

		<div class="text-div">
			<p class="text-p">
				<span>税务登记证税字号：</span>
				<el-popover placement="top-start" width="200" trigger="hover" :content="taxInfo.info.code || '--'">
					<span
						slot="reference"
						:style="{
							color: oldTaxInfo.info && (taxInfo.info && taxInfo.info.code === oldTaxInfo.info.code ? '' : 'red'),
						}"
					>
						{{ (taxInfo.info && taxInfo.info.code) || '--' }}
					</span>
				</el-popover>
			</p>
			<p class="text-p">
				<span>办证日期：</span>
				<el-popover placement="top-start" width="200" trigger="hover" :content="taxInfo.certificateDate | formatDate">
					<span
						slot="reference"
						:style="{
							color: oldTaxInfo && (taxInfo.certificateDate === oldTaxInfo.certificateDate ? '' : 'red'),
						}"
					>
						{{ taxInfo.certificateDate | formatDate }}
					</span>
				</el-popover>
			</p>
			<p class="text-p">
				<span>证件有效期：</span>
				<el-popover
					placement="top-start"
					width="200"
					trigger="hover"
					:content="taxInfo.expiryDate.split(',').join('~') || '--'"
				>
					<span
						slot="reference"
						:style="{
							color: oldTaxInfo && (taxInfo.expiryDate === oldTaxInfo.expiryDate ? '' : 'red'),
						}"
					>
						{{ taxInfo.expiryDate.split(',').join('~') || '--' }}
					</span>
				</el-popover>
			</p>
			<p class="text-p">
				<span>办证机关：</span>
				<el-popover
					placement="top-start"
					width="200"
					trigger="hover"
					:content="taxInfo.info.certificationAuthority || '--'"
				>
					<span
						slot="reference"
						:style="{
							color:
								oldTaxInfo.info &&
								(taxInfo.info.certificationAuthority === oldTaxInfo.info.certificationAuthority ? '' : 'red'),
						}"
					>
						{{ taxInfo.info.certificationAuthority || '--' }}
					</span>
				</el-popover>
			</p>
		</div>
		<div class="text-div suiwudengji">
			<p class="text-p">
				<span>经营范围：</span>
				<el-popover placement="top-start" width="200" trigger="hover" :content="taxInfo.info.businessScope || '--'">
					<span
						slot="reference"
						:style="{
							color: oldTaxInfo.info && (taxInfo.info.businessScope === oldTaxInfo.info.businessScope ? '' : 'red'),
						}"
					>
						{{ taxInfo.info.businessScope || '--' }}
					</span>
				</el-popover>
			</p>
		</div>
		<div class="text-div">
			<p class="text-p">
				<span>食品经营许可证：</span>
				<el-popover
					width="200"
					placement="top-start"
					trigger="hover"
					:content="foodInfo.info.isFoodBusinessLicense == 1 ? '有' : '无'"
				>
					<span
						slot="reference"
						:style="{
							color:
								oldFoodInfo.info &&
								(foodInfo.info.isFoodBusinessLicense === oldFoodInfo.info.isFoodBusinessLicense ? '' : 'red'),
						}"
					>
						{{ foodInfo.info.isFoodBusinessLicense == 1 ? '有' : '无' }}
					</span>
				</el-popover>
			</p>
		</div>
		<div class="text-div">
			<p class="text-p">
				<span>许可证号：</span>
				<el-popover placement="top-start" width="200" trigger="hover" :content="foodInfo.info.licenseKey || '--'">
					<span
						slot="reference"
						:style="{
							color: oldFoodInfo.info && (foodInfo.info.licenseKey === oldFoodInfo.info.licenseKey ? '' : 'red'),
						}"
					>
						{{ foodInfo.info.licenseKey || '--' }}
					</span>
				</el-popover>
			</p>
			<p class="text-p">
				<span>办证日期：</span>
				<el-popover placement="top-start" width="200" trigger="hover" :content="foodInfo.certificateDate | formatDate">
					<span
						slot="reference"
						:style="{
							color: oldFoodInfo && (foodInfo.certificateDate === oldFoodInfo.certificateDate ? '' : 'red'),
						}"
					>
						{{ foodInfo.certificateDate | formatDate }}
					</span>
				</el-popover>
			</p>
			<p class="text-p">
				<span>证件有效期：</span>
				<el-popover placement="top-start" width="200" trigger="hover" :content="foodInfoexpiryDate || '--'">
					<span
						slot="reference"
						:style="{
							color: oldFoodInfo && (foodInfo.expiryDate === oldFoodInfo.expiryDate ? '' : 'red'),
						}"
					>
						{{ foodInfoexpiryDate || '--' }}
					</span>
				</el-popover>
			</p>
			<p class="text-p">
				<span>办证机关：</span>
				<el-popover
					placement="top-start"
					width="200"
					trigger="hover"
					:content="foodInfo.info.certificationAuthority || '--'"
				>
					<span
						slot="reference"
						:style="{
							color:
								oldFoodInfo.info &&
								(foodInfo.info.certificationAuthority === oldFoodInfo.info.certificationAuthority ? '' : 'red'),
						}"
					>
						{{ foodInfo.info.certificationAuthority || '--' }}
					</span>
				</el-popover>
			</p>
		</div>
		<div class="text-div suiwudengji">
			<p class="text-p-f">
				<span>经营范围：</span>
				<el-popover placement="top-start" width="200" trigger="hover" :content="foodInfo.info.businessScope || '--'">
					<span
						slot="reference"
						:style="{
							color: oldFoodInfo.info && (foodInfo.info.businessScope === oldFoodInfo.info.businessScope ? '' : 'red'),
						}"
					>
						{{ foodInfo.info.businessScope || '--' }}
					</span>
				</el-popover>
			</p>
		</div>
		<el-form :inline="true" style="margin-top: 20px">
			<el-form-item label="营业执照正本：">
				<el-upload
					:action="$store.getters['system/getOssUploadUrl']"
					:headers="$store.getters['system/getSignatureVerification']"
					class="disUoloadSty"
					list-type="picture-card"
					:on-preview="handlePictureCardPreview"
					disabled
					:file-list="businessimg"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog v-drag :visible.sync="dialogVisible"><img width="100%" :src="dialogImageUrl" alt="" /></el-dialog>
			</el-form-item>
			<el-form-item label="营业执照副本：">
				<el-upload
					:action="$store.getters['system/getOssUploadUrl']"
					:headers="$store.getters['system/getSignatureVerification']"
					:on-preview="handlePictureCardPreview"
					class="disUoloadSty"
					list-type="picture-card"
					disabled
					:file-list="oldbusinessimg"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog v-drag :visible.sync="dialogVisible"><img width="100%" :src="dialogImageUrl" alt="" /></el-dialog>
			</el-form-item>
			<el-form-item label="税务登记证正本：">
				<el-upload
					:action="$store.getters['system/getOssUploadUrl']"
					:headers="$store.getters['system/getSignatureVerification']"
					:on-preview="handlePictureCardPreview"
					class="disUoloadSty"
					list-type="picture-card"
					disabled
					:file-list="taxationimg"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog v-drag :visible.sync="dialogVisible"><img width="100%" :src="dialogImageUrl" alt="" /></el-dialog>
			</el-form-item>
			<el-form-item label="税务登记证副本：">
				<el-upload
					:action="$store.getters['system/getOssUploadUrl']"
					:headers="$store.getters['system/getSignatureVerification']"
					:on-preview="handlePictureCardPreview"
					list-type="picture-card"
					class="disUoloadSty"
					disabled
					:file-list="oldtaxationimg"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog v-drag :visible.sync="dialogVisible"><img width="100%" :src="dialogImageUrl" alt="" /></el-dialog>
			</el-form-item>
			<el-form-item label="食品经营许可证：">
				<el-upload
					:action="$store.getters['system/getOssUploadUrl']"
					:headers="$store.getters['system/getSignatureVerification']"
					:on-preview="handlePictureCardPreview"
					list-type="picture-card"
					class="disUoloadSty"
					disabled
					:file-list="foodInfoimg"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog v-drag :visible.sync="dialogVisible"><img width="100%" :src="dialogImageUrl" alt="" /></el-dialog>
			</el-form-item>
		</el-form>

		<div class="text-div">
			<p class="text-p">
				<span>备注：</span>
				<el-popover placement="top-start" width="200" trigger="hover" :content="pageData.verifyRemark || '--'">
					<span slot="reference">{{ pageData.verifyRemark || '--' }}</span>
				</el-popover>
			</p>
		</div>
	</div>
</template>
<script>
import { DATA_CHANGE_SEARCH, DATA_CHANGE_COLUMNS, JINGYINGLEIXING_STATUS, ZUCHENGXINGSHI_STATUS } from '../config';
import { formatDateDefault } from 'util/formValidation.js';
export default {
	name: 'certificates',
	data() {
		return {
			DATA_CHANGE_SEARCH,
			DATA_CHANGE_COLUMNS,
			businessimg: [],
			oldbusinessimg: [],
			taxationimg: [],
			oldtaxationimg: [],
			foodInfoimg: [],
			businessInfo: {
				certificateDate: null,
				expiryDate: '',
				imageBackUrl: null,
				imageFrontUrl: '',
				info: {
					businessAreaCode: '',
					businessAreaName: '',
					businessCityCode: '',
					businessCityName: '',
					businessPlace: '',
					businessProvinceCode: '',
					businessProvinceName: '',
					businessScope: '',
					businessStreetCode: '',
					businessStreetName: '',
					certificateCode: '',
					certificateName: '',
					certificatePerson: '',
					certificationAuthority: '',
					composition: '',
					identificationCode: '',
					isFive: '',
					isSale: '',
					operatorName: '',
					operatorType: '',
					socialCreditCode: '',
				},
			},
			taxInfo: {
				certificateDate: null,
				expiryDate: '',
				imageBackUrl: null,
				imageFrontUrl: null,
				info: {
					businessScope: null,
					certificationAuthority: null,
					code: null,
				},
			},
			foodInfo: {
				certificateDate: null,
				expiryDate: '',
				imageBackUrl: null,
				imageFrontUrl: null,
				info: {
					businessScope: '',
					certificationAuthority: '',
					isFoodBusinessLicense: '',
					licenseKey: null,
				},
			},
			oldBusinessInfo: {
				certificateDate: null,
				expiryDate: '',
				imageBackUrl: null,
				imageFrontUrl: '',
				info: {
					businessAreaCode: '',
					businessAreaName: '',
					businessCityCode: '',
					businessCityName: '',
					businessPlace: '',
					businessProvinceCode: '',
					businessProvinceName: '',
					businessScope: '',
					businessStreetCode: '',
					businessStreetName: '',
					certificateCode: '',
					certificateName: '',
					certificatePerson: '',
					certificationAuthority: '',
					composition: '',
					identificationCode: '',
					isFive: '',
					isSale: '',
					operatorName: '',
					operatorType: '',
					socialCreditCode: '',
				},
			},
			oldTaxInfo: {
				certificateDate: null,
				expiryDate: '',
				imageBackUrl: null,
				imageFrontUrl: null,
				info: {
					businessScope: null,
					certificationAuthority: null,
					code: null,
				},
			},
			oldFoodInfo: {
				certificateDate: null,
				expiryDate: '',
				imageBackUrl: null,
				imageFrontUrl: null,
				info: {
					businessScope: '',
					certificationAuthority: '',
					isFoodBusinessLicense: '',
					licenseKey: null,
				},
			},
			dialogImageUrl: '',
			dialogVisible: false,
		};
	},
	props: {
		pageData: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			};
			return params;
		},
		businessInfoexpiryDate() {
			return this.businessInfo.expiryDate ? this.businessInfo.expiryDate.split(',').join('~') : '--';
		},
		taxInfoexpiryDate() {
			return this.taxInfo.expiryDate ? this.taxInfo.expiryDate.split(',').join('~') : '--';
		},
		foodInfoexpiryDate() {
			return this.foodInfo.expiryDate ? this.foodInfo.expiryDate.split(',').join('~') : '--';
		},
	},
	filters: {
		formatDate: val => formatDateDefault(val) || '--',
		JINGYINGLEIXING_STATUS: val => (val + '' in JINGYINGLEIXING_STATUS ? JINGYINGLEIXING_STATUS[val] : '--'),
		ZUCHENGXINGSHI_STATUS: val => (val + '' in ZUCHENGXINGSHI_STATUS ? ZUCHENGXINGSHI_STATUS[val] : '--'),
	},
	created() {},
	methods: {
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
	},
	watch: {
		pageData: {
			handler(val) {
				let business_info = Object.assign({}, this.businessInfo.info);
				let oldBusinessInfo_info = Object.assign({}, this.oldBusinessInfo.info);
				let taxInfo_info = Object.assign({}, this.taxInfo.info);
				let oldTaxInfo_info = Object.assign({}, this.oldTaxInfo.info);
				let foodInfo_info = Object.assign({}, this.foodInfo.info);
				let oldfood_info = Object.assign({}, this.oldFoodInfo.info);
				let { businessInfo, oldBusinessInfo, oldTaxInfo, taxInfo, foodInfo, oldFoodInfo } = val;
				this.businessInfo = businessInfo;
				this.businessInfo.info = businessInfo.info ? businessInfo.info : business_info;
				this.oldBusinessInfo = oldBusinessInfo;
				this.oldBusinessInfo.info = oldBusinessInfo.info ? oldBusinessInfo.info : oldBusinessInfo_info;
				this.taxInfo = taxInfo;
				this.taxInfo.info = taxInfo.info ? taxInfo.info : taxInfo_info;
				this.oldTaxInfo = oldTaxInfo;
				this.oldTaxInfo.info = oldTaxInfo.info ? oldTaxInfo.info : oldTaxInfo_info;
				this.foodInfo = foodInfo.info ? foodInfo : this.foodInfo;
				this.foodInfo.info = foodInfo.info ? foodInfo.info : foodInfo_info;
				this.oldFoodInfo = oldFoodInfo;
				this.oldFoodInfo.info = oldFoodInfo.info ? oldFoodInfo.info : oldfood_info;
				this.businessimg = val.businessInfo && val.businessInfo.imageFrontUrl
					? [{ name: '0', url: val.businessInfo.imageFrontUrl }]
					: [{ name: '0', url: require('assets/img-empty.png') }];
				this.oldbusinessimg =
					val.businessInfo && val.businessInfo.imageBackUrl
						? [{ name: '0', url: val.businessInfo.imageBackUrl }]
						: [{ name: '0', url: require('assets/img-empty.png') }];
				this.taxationimg =
					val.taxInfo && val.taxInfo.imageFrontUrl
						? [{ name: '0', url: val.taxInfo.imageFrontUrl }]
						: [{ name: '0', url: require('assets/img-empty.png') }];
				this.oldtaxationimg =
					val.taxInfo && val.taxInfo.imageBackUrl
						? [{ name: '0', url: val.taxInfo.imageBackUrl }]
						: [{ name: '0', url: require('assets/img-empty.png') }];
				this.foodInfoimg =
					val.foodInfo && val.foodInfo.imageFrontUrl
						? [{ name: '0', url: val.foodInfo.imageFrontUrl }]
						: [{ name: '0', url: require('assets/img-empty.png') }];
			},
		},
	},
};
</script>
<style lang="scss" scoped>
.text-div {
	padding: 0 50px;
	overflow: hidden;
	.text-p {
		width: 33.33%;
		float: left;
		line-height: 50px;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		-ms-text-overflow: ellipsis;
		white-space: nowrap;
	}
	.text-p-f {
		line-height: 50px;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		-ms-text-overflow: ellipsis;
		white-space: nowrap;
	}
}
.suiwudengji {
	border-bottom: 1px solid #d3d9e2;
}
.shipin {
	border-bottom: 1px solid #d3d9e2;
}
</style>
