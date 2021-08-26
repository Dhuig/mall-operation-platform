<template>
	<div>
		<el-card class="card-gap">
			<div class="had-text">
				<span>服务中心编号：</span>
				<span class="text-span">{{ pageHeadData.store.code ? pageHeadData.store.code : '--' }}</span>
				<span>服务中心名称：</span>
				<span class="text-span">{{ pageHeadData.store.name ? pageHeadData.store.name : '--' }}</span>
				<span>负责人卡号：</span>
				<span class="text-span">{{ pageHeadData.user.cardNo ? pageHeadData.user.cardNo : '--' }}</span>
				<span>负责人姓名：</span>
				<span>{{ pageHeadData.user.realname ? pageHeadData.user.realname : '--' }}</span>
			</div>
		</el-card>
		<el-card class="card-gap">
			<el-form :model="pageData" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
				<el-form-item label="变更内容：">
					<span>{{ DATA_CHANGE_CONTENT[queryData.profileChangeType] }}</span>
				</el-form-item>
				<el-form-item label="审批状态：" v-if="verifyStatusVisible">
					<span :style="{ color: pageData.verifyStatus == 2 || pageData.verifyStatus === 4 ? 'red' : 'blue' }">
						{{ pageData.verifyStatus | REFUND_APPROVAL_STATUS }}
					</span>
				</el-form-item>
				<el-row v-for="(item, index) in mobileList" :key="index">
					<el-form-item :label="item.labelOne" v-if="pageData.mobileChangeType * 1 === item.type">
						{{ pageData.oldMobile }}
					</el-form-item>
					<el-form-item :label="item.labelTwo" v-if="pageData.mobileChangeType * 1 === item.type">
						{{ pageData.mobile }}
					</el-form-item>
				</el-row>
			</el-form>
			<div class="text-div" v-if="queryData.profileChangeType == '4'">
				<p class="text-p" v-if="pageData.receiver">
					<span>收货人：</span>
					<span>{{ pageData.receiver }}</span>
				</p>
				<p class="text-p" v-if="pageData.oldReceiver">
					<span>原收货人：</span>
					<span>{{ pageData.oldReceiver }}</span>
				</p>
				<p class="text-p" v-if="pageData.receiverMobile">
					<span>收货人电话：</span>
					<span>{{ pageData.receiverMobile }}</span>
				</p>
				<p class="text-p" v-if="pageData.oldReceiverMobile">
					<span>原收货人电话：</span>
					<span>{{ pageData.oldReceiverMobile }}</span>
				</p>
			</div>
			<div class="address" v-if="queryData.profileChangeType == '4'">
				<p class="text-p" v-if="pageData.detailAddress">
					<span>收货地址：</span>
					<el-popover
						placement="top-start"
						width="200"
						trigger="hover"
						:content="
							pageData.provinceName +
								pageData.cityName +
								pageData.areaName +
								pageData.streetName +
								pageData.detailAddress || '--'
						"
					>
						<span slot="reference">
							{{ pageData.provinceName }}{{ pageData.cityName }}{{ pageData.areaName }}{{ pageData.streetName
							}}{{ pageData.detailAddress }}
						</span>
					</el-popover>
					<span></span>
				</p>
				<p class="text-p" v-if="pageData.oldReceiverFullAddress">
					<span>原收货地址：</span>
					<el-popover
						placement="top-start"
						width="200"
						trigger="hover"
						:content="pageData.oldReceiverFullAddress || '--'"
					>
						<span slot="reference">
							{{ pageData.oldReceiverFullAddress || '--' }}
						</span>
					</el-popover>
				</p>
				<p class="text-p" v-if="pageData.submitRemark">
					<span>变更原因：</span>
					<el-popover placement="top-start" width="200" trigger="hover" :content="pageData.submitRemark || '--'">
						<span slot="reference">
							{{ pageData.submitRemark || '--' }}
						</span>
					</el-popover>
				</p>
			</div>

			<bank
				:pageData="pageData"
				:profileChangeType="queryData.profileChangeType"
				v-if="
					queryData.profileChangeType == '6' || queryData.profileChangeType == '7' || queryData.profileChangeType == '8'
				"
			/>

			<!-- 证件-->
			<certificates :pageData="pageData" v-if="queryData.profileChangeType == '5'" />
			<!-- 负责人联系地址 -->
			<div class="text-div" v-if="queryData.profileChangeType == '9'">
				<p class="text-night">
					<span>原联系地址：</span>
					<span>
						{{ pageData.oldProvinceName == pageData.oldCityName ? '' : pageData.oldProvinceName }}
						{{ pageData.oldCityName }}
						{{ pageData.oldAreaName }}
						{{ pageData.oldStreetName }}
					</span>
					<span>{{ pageData.oldDetailAddress }}</span>
				</p>
				<p class="text-night">
					<span>新联系地址：</span>
					<span>
						{{ pageData.provinceName == pageData.cityName ? '' : pageData.provinceName }}
						{{ pageData.cityName }}
						{{ pageData.areaName }}
						{{ pageData.streetName }}
					</span>
					<span>{{ pageData.detailAddress }}</span>
				</p>
				<p class="text-night">
					<span>申请人：</span>
					<span>{{ pageData.submitter }}</span>
				</p>
				<p class="text-night">
					<span>申请时间：</span>
					<span>{{ pageData.updateTime | formatDate }}</span>
				</p>
			</div>
			<!-- 微信变更 -->
			<div class="text-div" v-if="queryData.profileChangeType == '10'">
				<p class="text-night">
					<span>原微信号：</span>
					<span>
						{{ pageData.oldWechat }}
					</span>
				</p>
				<p class="text-night">
					<span>新微信号：</span>
					<span>
						{{ pageData.wechat }}
					</span>
				</p>
				<p class="text-night">
					<span>申请人：</span>
					<span>{{ pageData.submitter }}</span>
				</p>
				<p class="text-night">
					<span>申请时间：</span>
					<span>{{ pageData.updateTime | formatDate }}</span>
				</p>
			</div>

			<div class="text-div" v-if="queryData.profileChangeType != '10' && queryData.profileChangeType != '9'">
				<p class="text-p">
					<span>申请时间：</span>
					<span>{{ pageData.createTime | formatDate }}</span>
				</p>
				<p class="text-p">
					<span>申请人：</span>
					<span>{{ pageData.submitter }}</span>
				</p>
				<p class="text-p" v-if="pageData.verifyTime">
					<span>审批时间：</span>
					<span>{{ pageData.verifyTime | formatDate }}</span>
				</p>
				<p class="text-p" v-if="pageData.verifier">
					<span>审批人：</span>
					<span>{{ pageData.verifier }}</span>
				</p>
				<p class="text-p" v-if="pageData.verifyRemark">
					<span>审批意见：</span>
					<el-popover placement="top-start" width="200" trigger="hover" :content="pageData.verifyRemark || '--'">
						<span slot="reference">
							{{ pageData.verifyRemark || '--' }}
						</span>
					</el-popover>
				</p>
			</div>
		</el-card>
		<el-dialog :title="title" :visible.sync="centerDialogVisible" width="50%" :before-close="close" v-drag>
			<div>
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
					<el-form-item label="审批结果：" prop="verifyStatus">
						<el-select v-model="ruleForm.verifyStatus" placeholder="请选择">
							<el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审批意见：" prop="verifyRemark">
						<el-input
							type="textarea"
							:autosize="{ minRows: 7 }"
							show-word-limit
							maxlength="200"
							v-model="ruleForm.verifyRemark"
							placeholder="请填写意见"
						/>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="close">取消</el-button>
				<el-button type="primary" :loading="isAddMsg" @click="addMsg">确定</el-button>
			</span>
		</el-dialog>
		<actionBar>
			<template>
				<el-button type="primary" @click="$closeSelf()">返 回</el-button>
				<el-button
					type="primary"
					v-permission="'data_change_list_detail_audit'"
					icon="el-icon-check"
					v-if="pageData.verifyStatus === 3"
					@click="review('yes')"
				>
					审核
				</el-button>
			</template>
		</actionBar>
	</div>
</template>

<script>
import { DATA_CHANGE_STATUS, REFUND_TYPE, DATA_CHANGE_CONTENT, ZHANGHUXINGZHI_STATUS } from './config';
import certificates from './dataChangeDetailModal/certificates.vue';
import bank from './dataChangeDetailModal/bank.vue';
import { formatDate } from 'util/formValidation.js';
import qs from 'querystring';

export default {
	name: 'dataChangeListDetail',
	components: {
		certificates,
		bank,
	},
	data() {
		return {
			isAddMsg: false,
			profileChangeType: null,
			option: [
				{ value: 1, label: '同意' },
				{ value: 2, label: '驳回' },
			],
			DATA_CHANGE_CONTENT,
			title: '请选择审核结果',
			contentText: '确认后将更新服务中心收货地址',
			ruleForm: {
				verifyStatus: 1,
				verifyRemark: '',
			},
			centerDialogVisible: false,
			dialogImageUrl: '',
			dialogVisible: false,
			rules: {
				verifyStatus: [{ required: true, message: '请选择', trigger: 'blur' }],
				verifyRemark: [{ required: false, message: '请输入意见', trigger: 'blur' }],
			},
			mobileList: [
				{ labelOne: '负责人原手机号：', labelTwo: '负责人新手机号：', type: 1 },
				{ labelOne: '配偶原手机号：', labelTwo: '配偶新手机号：', type: 2 },
				{ labelOne: '原电话号码1：', labelTwo: '新电话号码1：', type: 3 },
				{ labelOne: '原电话号码2：', labelTwo: '原电话号码2：', type: 4 },
			],
			pageData: {},
			queryData: {
				profileChangeType: '',
				storeCode: '',
				storeName: '',
				verifier: '',
			},
			pageHeadData: {
				store: {
					code: '',
					name: '',
				},
				user: {
					realname: '',
					cardNo: '',
				},
			},
			imglist: [],
			zhimgList: [],
			oldzhimgList: [],
		};
	},
	filters: {
		ZHANGHUXINGZHI_STATUS: val => (val + '' in ZHANGHUXINGZHI_STATUS ? ZHANGHUXINGZHI_STATUS[val] : '--'),
		REFUND_APPROVAL_STATUS: val => (val + '' in DATA_CHANGE_STATUS ? DATA_CHANGE_STATUS[val] : '--'),
		refundType: val => (val in REFUND_TYPE ? REFUND_TYPE[val] : '--'),
		formatDate: val => (val ? formatDate(val) : '--'),
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			};
			return params;
		},
		verifyStatusVisible() {
			return this.pageData.verifyStatus && this.pageData.profileChangeType > 3 && this.pageData.profileChangeType < 9;
		},
	},
	created() {
		this.queryData = this.$route.query;
		this.getHeadDate();
		this.profileChangeType = this.queryData.profileChangeType;
	},
	methods: {
		close() {
			this.centerDialogVisible = false;
			this.$refs.ruleForm.clearValidate();
			this.ruleForm.verifyRemark = '';
		},
		async addMsg() {
			this.$refs['ruleForm'].validate(async valid => {
				if (valid) {
					this.isAddMsg = true;
					let { id, storeCode } = this.$route.query;
					let { verifyRemark, verifyStatus } = this.ruleForm;
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/store/verifyProfileChange`,
						data: { storeCode, id, verifyRemark, verifyStatus },
					});
					if (res && res.code == 200) {
						this.loadData();
						this.$dispatch('DATACHANGELIST');
						this.centerDialogVisible = false;
						this.$message.success(res.message);
						this.$closeSelf();
					}
					this.isAddMsg = false;
				}
			});
		},
		async getHeadDate() {
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/store/getStoreByCode?code=${this.queryData.storeCode}`,
			});
			if (res && res.data) {
				this.pageHeadData = res.data;
			}
		},
		async getPhoneDate() {
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/store/getProfileMobileChangeDetail?${qs.stringify(this.queryData)}`,
			});
			if (res && res.data) {
				this.pageData = res.data;
			}
		},
		async getAddressData() {
			let { id, storeCode } = this.queryData;
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/store/getProfileDeliveryChangeDetail?${qs.stringify({ id, storeCode })}`,
			});
			if (res && res.data) {
				this.pageData = res.data;
			}
		},
		async getBank() {
			let { id, storeCode } = this.queryData;
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/store/getProfileBankAccountChangeDetail?${qs.stringify({ id, storeCode })}`,
			});
			if (res && res.data) {
				this.pageData = res.data;
				this.zhimgList = res.data.permissionUrl ? [{ name: '01', url: res.data.permissionUrl }] : [];
				this.oldzhimgList = res.data.oldPermissionUrl ? [{ name: '01', url: res.data.oldPermissionUrl }] : [];
			}
		},
		async getWechatChangeDetail() {
			let { id } = this.queryData;
			const res = await this.$fetch(`/mgmt/store/getWechatChangeDetail?${qs.stringify({ id })}`);
			if (res && res.data) {
				this.pageData = res.data;
				this.zhimgList = res.data.permissionUrl ? [{ name: '01', url: res.data.permissionUrl }] : [];
				this.oldzhimgList = res.data.oldPermissionUrl ? [{ name: '01', url: res.data.oldPermissionUrl }] : [];
			}
		},
		async getContactAddressChangeDetail() {
			let { id } = this.queryData;
			const res = await this.$fetch(`/mgmt/store/getContactAddressChangeDetail?${qs.stringify({ id })}`);
			if (res && res.data) {
				this.pageData = res.data;
				this.zhimgList = res.data.permissionUrl ? [{ name: '01', url: res.data.permissionUrl }] : [];
				this.oldzhimgList = res.data.oldPermissionUrl ? [{ name: '01', url: res.data.oldPermissionUrl }] : [];
			}
		},
		async getCertificates() {
			let { id, storeCode } = this.queryData;
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/store/getProfileCredentialChangeDetail?${qs.stringify({ id, storeCode })}`,
			});
			if (res && res.data) {
				this.pageData = res.data;
			}
		},
		async loadData() {
			const res = await this.$fetch({
				method: 'GET',
				url: `/appStore/web/store/other/getOtherApplyInfo`,
			});
			if (res && res.data) {
				this.pageData = res.data;
			}
		},
		async review() {
			this.centerDialogVisible = true;
			this.ruleForm.verifyRemark = '';
		},
		onError() {
			this.$message.warning('只能上传3个文件');
		},
		handleSuccessPC(res, file) {
			this.pushData.enclosureVos.push({ fileName: file.name, urls: file.response.datas.fileUrlKey });
		},
		beforeRemovePC(res) {
			this.pushData.enclosureVos.forEach((e, index) => {
				if (e.fileName === res.name) this.pushData.enclosureVos.splice(index, 1);
			});
		},
	},
	watch: {
		['queryData.profileChangeType'](businessType) {
			if (/10/.test(businessType)) return this.getWechatChangeDetail();
			if (/9/.test(businessType)) return this.getContactAddressChangeDetail();
			if (/1|2|3/.test(businessType)) return this.getPhoneDate();
			if (/4/.test(businessType)) return this.getAddressData();
			if (/5/.test(businessType)) return this.getCertificates();
			if (/6|7|8/.test(businessType)) return this.getBank();
		},
		'ruleForm.verifyStatus'(val) {
			this.rules.verifyRemark = [{ required: val === 2, message: '请输入意见', trigger: 'blur' }];
		},
	},
};
</script>

<style lang="scss" scoped>
.card-gap {
	margin-top: 20px;
	.title-text {
		padding: 20px;
		padding-top: 0;
		margin-bottom: 20px;
		border-bottom: 1px solid $color-border;
	}
}
::v-deep .el-upload--picture-card {
	display: none; /* 上传按钮隐藏 */
}
::v-deep .el-dialog__wrapper {
	overflow: auto;
}
.text-div {
	padding: 0 50px;
	overflow: hidden;
	.text-p {
		width: 50%;
		float: left;
		line-height: 50px;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		-ms-text-overflow: ellipsis;
		white-space: nowrap;
	}
	.text-night {
		line-height: 50px;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		-ms-text-overflow: ellipsis;
		white-space: nowrap;
	}
}
.text-span {
	margin-right: 20px;
}
.had-text {
	font-size: 14px;
}
.address {
	padding: 0 50px;
	overflow: hidden;
	.text-p {
		width: 50%;
		float: left;
		line-height: 50px;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		-ms-text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
