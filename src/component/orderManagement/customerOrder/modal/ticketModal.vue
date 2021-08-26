<template>
	<!-- 申请开票对话框 -->
	<el-dialog
		:title="ticketModal.title"
		:visible.sync="ticketModal.show"
		:close-on-click-modal="false"
		:lock-scroll="false"
		width="45%"
		destroy-on-close
		v-drag
	>
		<div class="ticket-content">
			<p>说明：</p>
			<p>1. 电子普通发票与纸质普通发票具备同等法律效力</p>
			<p>2. 开票金额不包括电子礼券/折扣部分金额</p>
			<p>3. 发票内容按产品明细开具</p>
			<div class="ticket-type">
				<div class="type-gap">选择开票类型:</div>
				<div>
					<el-radio-group v-model="invoiceType">
						<el-radio label="ticketPerson">个人普通电子票</el-radio>
						<el-radio label="ticketBusinessNormal">企业普通电子发票</el-radio>
						<el-radio v-if="!ticketModal.againState" label="ticketBusinessPro">企业专用纸质发票</el-radio>
					</el-radio-group>
				</div>
			</div>
			<!-- 个人普通电子票 -->
			<el-form
				key="1"
				v-show="invoiceType === 'ticketPerson'"
				ref="ticketPerson"
				label-width="140px"
				class="giveInputWidth"
				:rules="TICKER_VALIDATE_RULES.ticketPersonRules"
				:model="ticketPerson"
			>
				<el-form-item label="个人姓名" prop="name">
					<el-input
						clearable
						size="small"
						placeholder="请输入个人姓名"
						auto-complete="off"
						v-model="ticketPerson.name"
					/>
				</el-form-item>
			</el-form>
			<!-- 企业普通电子发票 -->
			<el-form
				key="2"
				v-show="invoiceType === 'ticketBusinessNormal'"
				ref="ticketBusinessNormal"
				label-width="140px"
				class="giveInputWidth"
				:rules="TICKER_VALIDATE_RULES.ticketBusinessNormalRules"
				:model="ticketBusinessNormal"
			>
				<el-form-item label="单位名称" prop="name" key="ticketBusinessNormal.name">
					<el-input
						clearable
						size="small"
						placeholder="请输入单位名称"
						auto-complete="off"
						v-model="ticketBusinessNormal.name"
					/>
				</el-form-item>
				<el-form-item label="纳税人识别码" prop="taxpayerNo" key="ticketBusinessNormal.taxpayerNo">
					<el-input
						clearable
						size="small"
						placeholder="请输入纳税人识别码"
						@blur="headingCode(ticketBusinessNormal.taxpayerNo)"
						auto-complete="off"
						v-model="ticketBusinessNormal.taxpayerNo"
					/>
				</el-form-item>
				<el-form-item label="注册地址" prop="registerAddress" key="ticketBusinessNormal.registerAddress">
					<el-input
						clearable
						size="small"
						placeholder="请输入注册地址"
						auto-complete="off"
						v-model="ticketBusinessNormal.registerAddress"
					/>
				</el-form-item>
				<el-form-item label="注册电话" prop="registerPhone" key="ticketBusinessNormal.registerPhone">
					<el-input
						clearable
						size="small"
						placeholder="请输入注册电话"
						auto-complete="off"
						v-model="ticketBusinessNormal.registerPhone"
					/>
				</el-form-item>
				<el-form-item label="开户银行名称" prop="bankName" key="ticketBusinessNormal.bankName">
					<el-input
						clearable
						size="small"
						placeholder="请输入开户银行名称"
						auto-complete="off"
						v-model="ticketBusinessNormal.bankName"
					/>
				</el-form-item>
				<el-form-item label="银行帐号" prop="bankAccount" key="ticketBusinessNormal.bankAccount">
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
				v-show="invoiceType === 'ticketBusinessPro' && !ticketModal.againState"
				key="3"
				ref="ticketBusinessPro"
				label-width="140px"
				class="giveInputWidth"
				:rules="TICKER_VALIDATE_RULES.ticketBusinessProRules"
				:model="ticketBusinessPro"
			>
				<el-form-item label="单位名称" prop="name">
					<el-input
						clearable
						size="small"
						placeholder="请输入单位名称"
						auto-complete="off"
						v-model="ticketBusinessPro.name"
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
				<el-form-item label="营业执照副本" prop="businessLicense">
					<el-upload
						class="upload-demo"
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="ossParams"
						:on-remove="handleRemoveBusinessLicense"
						:on-success="handleSuccessBusinessLicense"
						:before-upload="beforeAvatarUpload"
						:limit="1"
						:file-list="ticketBusinessPro.businessLicenseFileList"
					>
						<div slot="tip" class="el-upload__tip">原件照片、扫描件或者加盖公章的复印件，大小不超过5M。</div>
						<el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="银行开户许可" prop="bankLicense">
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
				<el-form-item label="授权委托书" prop="authorizeLicense">
					<el-upload
						class="upload-demo"
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="ossParams"
						:on-remove="handleRemoveAuthorizeLicense"
						:on-success="handleSuccessAuthorizeLicense"
						:before-upload="beforeAvatarUpload"
						:limit="1"
						:file-list="ticketBusinessPro.authorizeLicenseFileList"
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
				<el-button type="primary" @click.stop="submitApply" icon="el-icon-s-claim" :disabled="!this.invoiceType">
					提交申请
				</el-button>
			</span>
		</span>
	</el-dialog>
</template>

<script>
import { TICKER_VALIDATE_RULES, TICKET_TYPE } from '../config';
export default {
	name: 'ticketModal',
	data() {
		return {
			TICKER_VALIDATE_RULES,
			invoiceType: 'ticketPerson',
			ticketType: {
				1: 'ticketPerson',
				2: 'ticketBusinessNormal',
				3: 'ticketBusinessPro',
			},
			ticketPerson: {
				name: '',
			},
			ticketBusinessNormal: {
				name: '',
				taxpayerNo: '',
				registerAddress: '',
				registerPhone: '',
				bankName: '',
				bankAccount: '',
			},
			ticketBusinessPro: {
				name: '',
				taxpayerNo: '',
				registerAddress: '',
				registerPhone: '',
				bankName: '',
				bankAccount: '',
				phone: '',
				businessLicense: '',
				businessLicenseFileList: [],
				businessLicenseName: '',
				bankLicense: '',
				bankLicenseFileList: [],
				bankLicenseName: '',
				authorizeLicense: '',
				authorizeLicenseFileList: [],
				authorizeLicenseName: '',
			},
			// ossParams: {
			// 	// 上传需要的参数信息
			// 	storageType: '', // 存储类型（目前支持的类型:FastDFS）
			// 	timeStamp: '', // 时间（格式：yyyyMMddHHmmss)
			// 	clientKey: '', // 客户端Key(由管理员进行分配)
			// 	sign: '', // 签名（具体见签名规则说明）
			// },
			ossParams: {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			},
		};
	},
	watch: {
		invoiceType: function (newValue) {
			console.log(newValue)[
				//
				('ticketBusinessPro', 'ticketBusinessNormal', 'ticketPerson')
			].forEach(item => {
				if (item != newValue) {
					this.$refs[item].resetFields();
				}
			});
		},
		'ticketBusinessNormal.taxpayerNo': function (newValue) {
			this.ticketBusinessNormal.taxpayerNo = newValue.toUpperCase();
		},
		'ticketBusinessPro.taxpayerNo': function (newValue) {
			this.ticketBusinessPro.taxpayerNo = newValue.toUpperCase();
		},
	},
	props: ['ticketModal'],
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
		// 提交申请
		submitApply() {
			// * 输入空格过滤
			// 企业普通电子发票 单位名称↓
			this.ticketBusinessNormal.name = this.ticketBusinessNormal.name.replace(/ /g, '');
			// todo: 接口未完全调通
			this.$refs[this.invoiceType].validate(async valid => {
				if (valid) {
					let tipInfo = !this.ticketModal.againState ? '确定申请发票吗?' : '确定重新申请发票吗?';
					this.$confirm(tipInfo, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					})
						.then(async () => {
							const data = {
								invoiceType: TICKET_TYPE[this.invoiceType],
								orderNo: this.ticketModal.orderNo,
								...this[this.invoiceType],
							};
							let url = this.ticketModal.againState ? '/mgmt/order/updateInvoice' : '/mgmt/order/applyInvoice';
							const res = await this.$fetch({
								method: 'POST',
								url,
								data,
							});
							if (res.code === 200) {
								this.$message.success(res.message);
								this.$emit('close');
							} else {
								this.$message.error(res.message);
							}
						})
						.catch(() => {
							this.$message.info('操作取消');
						});
				}
			});
		},
		// 上传参数接口
		// async getUploadInfo() {
		// 	const res = await this.$fetch('http://42.194.215.85:8908/mgmt/cms/common/getUploadParams');
		// 	const { storageType, timeStamp, clientKey, sign, url } = res.data;
		// 	this.ossParams = {
		// 		...this.ossParams,
		// 		storageType,
		// 		timeStamp,
		// 		clientKey,
		// 		sign,
		// 	};
		// 	this.url = url;
		// },
		handleRemoveBusinessLicense() {
			this.ticketBusinessPro.businessLicense = '';
			this.ticketBusinessPro.businessLicenseFileList = [];
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
			this.ticketBusinessPro.businessLicense = fileUrlKey;
			this.ticketBusinessPro.businessLicenseName = file.name;
			this.ticketBusinessPro.businessLicenseFileList = fileList;
		},
		handleRemoveBankLicense() {
			this.ticketBusinessPro.bankLicense = '';
			this.ticketBusinessPro.bankLicenseFileList = [];
		},
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
			this.ticketBusinessPro.bankLicense = fileUrlKey;
			this.ticketBusinessPro.bankLicenseName = file.name;
			this.ticketBusinessPro.bankLicenseFileList = fileList;
		},
		handleRemoveAuthorizeLicense() {
			this.ticketBusinessPro.authorizeLicense = '';
			this.ticketBusinessPro.authorizeLicenseFileList = [];
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
			this.ticketBusinessPro.authorizeLicense = fileUrlKey;
			this.ticketBusinessPro.authorizeLicenseName = file.name;
			this.ticketBusinessPro.authorizeLicenseFileList = fileList;
		},
	},
	created() {
		console.log(this.ticketModal);
		// 数据回填
		// 个人普通电子票
		this.invoiceType = this.ticketType[this.ticketModal.invoiceType];
		if (this.ticketModal.invoiceType === 1) {
			this.ticketPerson.name = this.ticketModal.name;
		} else if (this.ticketModal.invoiceType === 2) {
			this.ticketBusinessNormal = this.ticketModal;
		}
	},
};
</script>

<style lang="scss" scoped>
.ticket-content {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	max-height: 400px;
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
.giveInputWidth {
	.el-input {
		width: 250px;
	}
}
</style>
