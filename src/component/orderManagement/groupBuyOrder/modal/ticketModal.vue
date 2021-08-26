<template>
	<!-- 申请开票对话框 -->
	<div>
		<el-dialog
			title="申请开票"
			:visible.sync="ticketModal.show"
			:lock-scroll="false"
			width="45%"
			destroy-on-close
			v-drag
			@opened="handleOpened"
		>
			<div class="ticket-content">
				<p>说明：</p>
				<p>1. 电子普通发票与纸质普通发票具备同等法律效力</p>
				<p>2. 开票金额不包括电子礼券/折扣部分金额</p>
				<p>3. 发票内容按产品明细开具</p>
				<div class="ticket-type">
					<div class="type-gap">选择开票类型:</div>
					<div>
						<el-radio-group v-model="type">
							<el-radio :label="1">个人普通电子票</el-radio>
							<el-radio :label="2">企业普通电子发票</el-radio>
							<el-radio :label="3">企业专用纸质发票</el-radio>
						</el-radio-group>
					</div>
				</div>
				<!-- 个人普通电子票 -->
				<el-form
					v-if="type === 1"
					key="1"
					ref="ticketPerson"
					label-width="140px"
					class="giveInputWidth"
					:rules="TICKER_VALIDATE_RULES.ticketPersonRules"
					:model="ticketPerson"
				>
					<el-form-item label="个人姓名" prop="draweeName">
						<el-input
							clearable
							size="small"
							placeholder="请输入个人姓名"
							auto-complete="off"
							v-model="ticketPerson.draweeName"
						/>
					</el-form-item>
				</el-form>
				<!-- 企业普通电子发票 -->
				<el-form
					v-if="type === 2"
					key="2"
					ref="ticketBusinessNormal"
					label-width="140px"
					class="giveInputWidth"
					:rules="TICKER_VALIDATE_RULES.ticketBusinessNormalRules"
					:model="ticketBusinessNormal"
				>
					<el-form-item label="单位名称" prop="draweeName">
						<el-input
							clearable
							size="small"
							placeholder="请输入单位名称"
							auto-complete="off"
							v-model="ticketBusinessNormal.draweeName"
						/>
					</el-form-item>
					<el-form-item label="纳税人识别码" prop="taxpayerNo">
						<el-input
							clearable
							size="small"
							placeholder="请输入纳税人识别码"
							@blur="headingCode(ticketBusinessNormal.taxpayerNo)"
							auto-complete="off"
							v-model="ticketBusinessNormal.taxpayerNo"
						/>
					</el-form-item>
					<el-form-item label="注册地址" prop="registerAddress">
						<el-input
							clearable
							size="small"
							placeholder="请输入注册地址"
							auto-complete="off"
							v-model="ticketBusinessNormal.registerAddress"
						/>
					</el-form-item>
					<el-form-item label="注册电话" prop="registerPhone">
						<el-input
							clearable
							size="small"
							placeholder="请输入注册电话"
							auto-complete="off"
							v-model="ticketBusinessNormal.registerPhone"
						/>
					</el-form-item>
					<el-form-item label="开户银行名称" prop="bankName">
						<el-input
							clearable
							size="small"
							placeholder="请输入开户银行名称"
							auto-complete="off"
							v-model="ticketBusinessNormal.bankName"
						/>
					</el-form-item>
					<el-form-item label="银行帐号" prop="bankAccount">
						<el-input
							clearable
							size="small"
							placeholder="请输入银行帐号"
							auto-complete="off"
							v-model="ticketBusinessNormal.bankAccount"
						/>
					</el-form-item>
				</el-form>
				<!-- 企业专用纸质发票 -->
				<el-form
					v-if="type === 3"
					key="3"
					ref="ticketBusinessPro"
					class="giveInputWidth"
					label-width="140px"
					:rules="TICKER_VALIDATE_RULES.ticketBusinessProRules"
					:model="ticketBusinessPro"
				>
					<el-form-item label="单位名称" prop="draweeName">
						<el-input
							clearable
							size="small"
							placeholder="请输入单位名称"
							auto-complete="off"
							v-model="ticketBusinessPro.draweeName"
						/>
					</el-form-item>
					<el-form-item label="纳税人识别码" prop="taxpayerNo">
						<el-input
							clearable
							size="small"
							placeholder="请输入纳税人识别码"
							@blur="headingCode(ticketBusinessPro.taxpayerNo)"
							auto-complete="off"
							v-model="ticketBusinessPro.taxpayerNo"
						/>
					</el-form-item>
					<el-form-item label="注册地址" prop="registerAddress">
						<el-input
							clearable
							size="small"
							placeholder="请输入注册地址"
							auto-complete="off"
							v-model="ticketBusinessPro.registerAddress"
						/>
					</el-form-item>
					<el-form-item label="注册电话" prop="registerPhone">
						<el-input
							clearable
							size="small"
							placeholder="请输入注册电话"
							auto-complete="off"
							v-model="ticketBusinessPro.registerPhone"
						/>
					</el-form-item>
					<el-form-item label="开户银行名称" prop="bankName">
						<el-input
							clearable
							size="small"
							placeholder="请输入开户银行名称"
							auto-complete="off"
							v-model="ticketBusinessPro.bankName"
						/>
					</el-form-item>
					<el-form-item label="银行帐号" prop="bankAccount">
						<el-input
							clearable
							size="small"
							placeholder="请输入银行帐号"
							auto-complete="off"
							v-model="ticketBusinessPro.bankAccount"
						/>
					</el-form-item>
					<el-form-item label="联系人电话" prop="phone">
						<el-input
							clearable
							size="small"
							placeholder="请输入联系人电话"
							auto-complete="off"
							v-model="ticketBusinessPro.phone"
						/>
					</el-form-item>
					<el-form-item label="营业执照副本" prop="bizLicenseFileList">
						<el-upload
							class="upload-demo"
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="ossParams"
							:on-remove="handleRemoveBusinessLicense"
							:on-success="handleSuccessBusinessLicense"
							:before-upload="beforeAvatarUpload"
							:limit="1"
							:file-list="ticketBusinessPro.bizLicenseFileList"
						>
							<div slot="tip" class="el-upload__tip">原件照片、扫描件或者加盖公章的复印件，大小不超过5M。</div>
							<el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
					</el-form-item>
					<el-form-item label="银行开户许可" prop="bankLicenseFileList">
						<el-upload
							class="upload-demo"
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="ossParams"
							:on-remove="handleRemoveBankLicense"
							:on-success="handleSuccessBankLicense"
							:before-upload="beforeAvatarUpload"
							:limit="1"
							:file-list="ticketBusinessPro.bankLicenseFileList"
						>
							<div slot="tip" class="el-upload__tip">原件照片、扫描件或者加盖公章的复印件，大小不超过5M。</div>
							<el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
					</el-form-item>
					<el-form-item label="授权委托书" prop="authLicenseFileList">
						<el-upload
							class="upload-demo"
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="ossParams"
							:on-remove="handleRemoveAuthorizeLicense"
							:on-success="handleSuccessAuthorizeLicense"
							:before-upload="beforeAvatarUpload"
							:limit="1"
							:file-list="ticketBusinessPro.authLicenseFileList"
						>
							<div slot="tip" class="el-upload__tip">支持文本和图片，大小不超过5M。</div>
							<el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
					</el-form-item>
					<div class="tips-info">
						<p>开企业专用发票须知：</p>
						<p>
							1、我公司依法开具发票，如您不是增值税一般纳税人，或您是增值税一般纳税人，但您购买的商品按税法规定属于不得从增值税销项税额中抵扣的项目（例如集体福利或个人消费等），请您选择普通发票。
						</p>
						<p>
							2、由于贵顾客为个人付款购买产品，如确实需增值税专用发票，请您提交单位委托您办理采购业务的授权委托书，格式请点击【授权委托书下载】自行下载，加盖公章后并上传，同时上传营业执照副本（加盖公章）、银行开户许可证（加盖公章）扫描件至完美商城。
						</p>
						<p>3、收到您的资料后，我们将会尽快审核，如通过审核，将在7-15个工作日内开出发票。</p>
						<p>4、请贵顾客当月提交完整的资料，以便我司审核，如资料不齐全或跨月提交我司将不受理，我司将开具普通发票。</p>
					</div>
				</el-form>
			</div>
			<span slot="footer">
				<span>
					<el-button @click.stop="ticketModal.show = false">取 消</el-button>
					<el-button type="primary" @click.stop="submitApply" icon="el-icon-s-claim" :disabled="!this.type">
						提交申请
					</el-button>
				</span>
			</span>
		</el-dialog>
		<el-dialog title="确认信息" :visible.sync="visible" custom-class="confirm-dialog" width="300px" v-drag>
			<div class="title">使用如下信息申请开票</div>
			<div>发票类型: {{ TICKET_TYPE[type] }}</div>
			<div v-if="type === 1" class="item">个人姓名: {{ ticketPerson.draweeName }}</div>
			<div v-else>
				<div class="item">单位名称： {{ content.draweeName }}</div>
				<div class="item">纳税人识别码： {{ content.taxpayerNo }}</div>
				<div class="item">注册地址： {{ content.registerAddress }}</div>
				<div class="item">注册电话： {{ content.registerPhone }}</div>
				<div class="item">开户银行名称： {{ content.bankName }}</div>
				<div class="item">银行账号： {{ content.bankAccount }}</div>
				<div class="item" v-if="type === 3">联系人电话： {{ ticketBusinessPro.phone }}</div>
			</div>
			<span slot="footer">
				<span>
					<el-button @click.stop="visible = false">取 消</el-button>
					<el-button type="primary" @click.stop="confirmSubmitApply">确认</el-button>
				</span>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { TICKER_VALIDATE_RULES, TICKET_TYPE } from '../config';
export default {
	name: 'ticketModal',
	data() {
		return {
			TICKER_VALIDATE_RULES,
			TICKET_TYPE,
			visible: false,
			type: 1,
			ticketPerson: {
				draweeName: '',
			},
			ossParams: {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			},
			ticketBusinessNormal: {
				draweeName: '',
				taxpayerNo: '',
				registerAddress: '',
				registerPhone: '',
				bankName: '',
				bankAccount: '',
			},
			ticketBusinessPro: {
				draweeName: '',
				taxpayerNo: '',
				registerAddress: '',
				registerPhone: '',
				bankName: '',
				bankAccount: '',
				phone: '',
				authLicense: {},
				bankLicense: {},
				bizLicense: {},
				authLicenseFileList: [],
				bankLicenseFileList: [],
				bizLicenseFileList: [],
			},
		};
	},
	props: ['ticketModal', 'invoice'],
	watch: {
		'ticketBusinessNormal.taxpayerNo': function (newValue) {
			this.ticketBusinessNormal.taxpayerNo = newValue.toUpperCase();
		},
		'ticketBusinessPro.taxpayerNo': function (newValue) {
			this.ticketBusinessPro.taxpayerNo = newValue.toUpperCase();
		},
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.finance,
			};
			return params;
		},
		content() {
			return this.type === 2 ? this.ticketBusinessNormal : this.ticketBusinessPro;
		},
	},
	methods: {
		// 大小不超过5M。
		beforeAvatarUpload(file) {
			const isLt5M = file.size / 1024 / 1024 < 5;
			if (!isLt5M) {
				this.$message.error('大小不能超过5MB!');
			}
			return isLt5M;
		},
		// 纳税人识别号 不是18位字符就提醒
		headingCode(value) {
			if (value.length != 18) {
				this.$message.warning('尊敬的顾客:请您再次确认您填写的纳税人识别号,常规应为18位数字,谢谢');
			}
		},
		// dialog打开后的回调
		handleOpened() {
			const formData = ['', 'ticketPerson', 'ticketBusinessNormal', 'ticketBusinessPro'];
			console.log(this.invoice);
			if (this.invoice) {
				const { type } = this.invoice;
				console.log(this[formData[type]]);
				if (type === 3) {
					const { authLicense, bankLicense, bizLicense } = this.invoice;
					this[formData[type]] = {
						...this.invoice,
						authLicenseFileList: [authLicense],
						bankLicenseFileList: [bankLicense],
						bizLicenseFileList: [bizLicense],
					};
				} else {
					this[formData[type]] = { ...this.invoice };
				}
				this.type = type;
			}
		},
		// 提交申请
		submitApply() {
			const formRef = ['', 'ticketPerson', 'ticketBusinessNormal', 'ticketBusinessPro'];
			// this.ticketModal.show = false;
			this.$refs[formRef[this.type]].validate(async valid => {
				if (valid) {
					this.visible = true;
				}
			});
		},
		// 确认提交申请
		async confirmSubmitApply() {
			const { submitCallback } = this.ticketModal;
			const formData = ['', 'ticketPerson', 'ticketBusinessNormal', 'ticketBusinessPro'];
			const data = {
				type: this.type,
				orderNo: this.ticketModal.orderNo,
				...this[formData[this.type]],
			};
			if (submitCallback) {
				submitCallback(data);
				this.$emit('close');
				this.visible = false;
			} else {
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/inventory/group-order/invoice/apply',
					data,
				});
				if (res.code === 200) {
					this.$message.success(res.message);
					this.$emit('close');
				} else {
					this.$message.error(res.message);
				}
			}
		},
		handleRemoveBusinessLicense() {
			this.ticketBusinessPro.businessLicense = {};
			this.ticketBusinessPro.bizLicenseFileList = [];
		},
		handleSuccessBusinessLicense(response, file, fileList) {
			const {
				datas: { fileUrlKey, msg },
				success,
			} = response;
			if (success) {
				this.$message({
					type: 'success',
					message: msg,
				});
			} else {
				this.$message({
					type: 'error',
					message: msg,
				});
			}
			this.ticketBusinessPro.bizLicense = {
				url: fileUrlKey,
				name: file.name,
			};
			this.ticketBusinessPro.bizLicenseFileList = fileList;
		},
		handleRemoveBankLicense() {
			this.ticketBusinessPro.bankLicense = {};
			this.ticketBusinessPro.bankLicenseFileList = [];
		},
		// 银行开户许可
		handleSuccessBankLicense(response, file, fileList) {
			const {
				datas: { fileUrlKey, msg },
				success,
			} = response;
			if (success) {
				this.$message({
					type: 'success',
					message: msg,
				});
			} else {
				this.$message({
					type: 'error',
					message: msg,
				});
			}
			this.ticketBusinessPro.bankLicense = {
				url: fileUrlKey,
				name: file.name,
			};
			this.ticketBusinessPro.bankLicenseFileList = fileList;
		},
		handleRemoveAuthorizeLicense() {
			this.ticketBusinessPro.authLicense = {};
			this.ticketBusinessPro.authLicenseFileList = [];
		},
		handleSuccessAuthorizeLicense(response, file, fileList) {
			const {
				datas: { fileUrlKey, msg },
				success,
			} = response;
			if (success) {
				this.$message({
					type: 'success',
					message: msg,
				});
			} else {
				this.$message({
					type: 'error',
					message: msg,
				});
			}
			this.ticketBusinessPro.authLicense = {
				url: fileUrlKey,
				name: file.name,
			};
			this.ticketBusinessPro.authLicenseFileList = fileList;
		},
	},
};
</script>

<style lang="scss" scoped>
.ticket-content {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	max-height: 420px;
	overflow-y: auto;
	p {
		line-height: 25px;
	}
}
.ticket-type {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	width: 100%;
	margin: 20px auto;
	.type-gap {
		margin-right: 40px;
	}
}
.tips-info {
	padding: 15px;
	font-size: 14px;
	color: $color-body;
	background-color: #eee;
}
.confirm-dialog {
	height: 500px;
	.title {
		text-align: center;
		font-size: 18px;
		padding-bottom: 30px;
	}
	.item {
		margin-top: 10px;
	}
}
.giveInputWidth {
	.el-input {
		width: 250px;
	}
}
</style>
