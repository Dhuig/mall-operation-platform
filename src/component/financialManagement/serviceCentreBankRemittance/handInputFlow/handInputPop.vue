<template>
	<div class="hand-input-pop">
		<el-form
			:model="inputForm"
			ref="inputForm"
			:rules="INPUT_RULES"
			label-width="120px"
			label-suffix=":"
			class="hand-input-form"
		>
			<el-row>
				<el-col :span="24">
					<el-form-item label="服务中心编号" prop="storeCode">
						<el-input v-model="inputForm.storeCode">
							<el-button slot="append" icon="el-icon-search" @click="loadStoreInfo"></el-button>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="服务中心名称" prop="storeName">{{ inputForm.storeName || '' }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="负责人" prop="leaderName">{{ inputForm.leaderName }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="所属分公司" prop="companyCode">{{ COMPANY_DATA[inputForm.companyCode] }}</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="款项类型" prop="sourceType">
						<el-select v-model="inputForm.sourceType" placeholder="请选择">
							<el-option
								v-for="(item, index) in optionGenerator(PAYMENT_TYPE_HANDLE)"
								:key="index"
								:label="item.label"
								:value="item.value"
							></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="交易类型">{{ inputForm.changeReason || '' }}</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="款项金额" prop="remitMoney">
						{{ paymentAdd ? '' : '-' }}￥
						<el-input
							type="number"
							v-model="inputForm.remitMoney"
							class="line-input"
							@blur="judgeRemitMoney(inputForm.remitMoney)"
						></el-input>
						<span class="tips">正数表示增加款项，负数则表示扣减款项</span>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="" class="marginbottom-0">
						<div>调整后累计已汇押货款：￥{{ pledgedPayment }}</div>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="">
						<div>调整后押货余额：￥{{ pledgedBalance }}</div>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="付款账号" prop="account">
						<el-input v-model="inputForm.account" v-if="isExchangePledge" />
						<el-select v-model="inputForm.account" placeholder="请选择" class="all-input" v-else>
							<el-option
								v-for="(item, index) in companyAccountJson"
								:key="index"
								:label="index"
								:value="index"
							></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="付款银行" prop="bankName">
						<el-input v-model="inputForm.bankName" :disabled="!isExchangePledge" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="收款账号" prop="receiptAccount">
						<el-input v-model="inputForm.receiptAccount" v-if="!isExchangePledge" />
						<el-select v-model="inputForm.receiptAccount" placeholder="请选择" class="all-input" v-else>
							<el-option
								v-for="(item, index) in companyAccountJson"
								:key="index"
								:label="index"
								:value="index"
							></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="收款银行" prop="receiptBankName">
						<el-input v-model="inputForm.receiptBankName" :disabled="isExchangePledge" />
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="备注" prop="remark">
						<el-input type="textarea" v-model="inputForm.remark" show-word-limit maxlength="100" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<span class="pop-foot-button">
			<el-button type="primary" :disabled="!confirmBtnSwitch" @click="inputConfirm('inputForm')">确认</el-button>
			<el-button @click="inputCancel('inputForm')">取消</el-button>
		</span>
	</div>
</template>

<script>
import { PAYMENT_TYPE_HANDLE } from '../config';
import { INPUT_RULES, VALID_MONEY_UP0, VALID_MONEY_UP_OTHER } from './config';
import { optionGenerator } from 'util';
const setNegativeArr = [7, 9, 10];
export default {
	name: 'handInputPop',
	data() {
		return {
			INPUT_RULES,
			inputForm: {
				storeCode: '',
				storeName: '',
				leaderName: '',
				companyCode: '',
				sourceType: '',
				changeReason: '',
				remitMoney: '',
				account: '',
				bankName: '',
				remark: '',
			},
			paymentAdd: true, //款项金额正负
			paymentAdjustList: null,
			companyAccountJson: null, // 分公司绑定账号
			storeAccountJson: null, //服务中心绑定账号(@todo 暂不使用)
			remitUsed: 0,
			balance: 0,
			confirmBtnSwitch: true,
		};
	},
	watch: {
		inputForm: {
			handler(val) {
				const { sourceType, account, receiptAccount, remitMoney } = val;
				this.paymentAdd = !setNegativeArr.includes(sourceType);
				account && !this.isExchangePledge && (val.bankName = this.companyAccountJson[account]);
				receiptAccount && this.isExchangePledge && (val.receiptBankName = this.companyAccountJson[receiptAccount]);
				if (sourceType == 14) {
					// 款项类型为 押货款与钱包款互转 时
					if (remitMoney) {
						val.changeReason = remitMoney >= 0 ? '汇押货款' : '退押货款';
					}
				} else if (sourceType == 12) {
					//款项类型为 其他 时
					val.changeReason = '其他';
				} else {
					val.changeReason =
						(this.paymentAdjustList && this.paymentAdjustList.find(({ type }) => type == sourceType)?.changeReason) ||
						'';
				}
			},
			deep: true,
		},
		'inputForm.sourceType'() {
			this.INPUT_RULES.remitMoney = [{ required: true, validator: this.validMoney, trigger: 'blur' }];
		},
	},
	computed: {
		optionGenerator() {
			return optionGenerator;
		},
		PAYMENT_TYPE_HANDLE() {
			return PAYMENT_TYPE_HANDLE;
		},
		COMPANY_DATA() {
			let data = {};
			this.$store.getters['system/getOptions'].serviceCompanyOptions.map(({ label, value }) => {
				data[value] = label;
			});
			return data;
		},
		pledgedPayment() {
			let { remitMoney, sourceType } = this.inputForm;
			const { remitUsed } = this;
			const otherEnv = [12, 14]; // 其他和钱包款与押货款互转选项情况下，可输入正负
			remitMoney = !otherEnv.includes(sourceType) ? Math.abs(remitMoney) : Number(remitMoney);
			return setNegativeArr.includes(sourceType)
				? (remitUsed - remitMoney).toFixed(2)
				: (remitUsed + remitMoney).toFixed(2);
		},
		pledgedBalance() {
			let { remitMoney, sourceType } = this.inputForm;
			const { balance } = this;
			const otherEnv = [12, 14]; // 其他和钱包款与押货款互转选项情况下，可输入正负
			remitMoney = !otherEnv.includes(sourceType) ? Math.abs(remitMoney) : Number(remitMoney);
			return setNegativeArr.includes(sourceType)
				? (balance - remitMoney).toFixed(2)
				: (balance + remitMoney).toFixed(2);
		},
		// 判断汇押货款
		isExchangePledge() {
			const { sourceType, changeReason, remitMoney } = this.inputForm;
			let isExchangePledge;
			// 款项类型位其他的时候 判断区分
			if (sourceType == 12 || sourceType == 14) {
				isExchangePledge = remitMoney >= 0;
			} else {
				isExchangePledge = changeReason == '汇押货款';
			}
			return isExchangePledge;
		},
		validMoney() {
			const { sourceType } = this.inputForm;
			let result;
			if (sourceType == 12 || sourceType == 14) {
				result = VALID_MONEY_UP_OTHER;
			} else {
				result = VALID_MONEY_UP0;
			}
			return result;
		},
	},
	methods: {
		// 基于款项类型为其他时，通过输入金额判断调整原因
		judgeRemitMoney() {
			const { sourceType } = this.inputForm;
			const { pledgedPayment } = this;
			// 款项类型为其他时
			if (sourceType == 12) {
				this.inputForm.changeReason = '其他';
			}
			if (pledgedPayment < 0) {
				this.$message.warning('累计已汇押货款为负，请核实');
			}
		},
		// 获取服务中心绑定账号
		async loadStoreAccount(storeCode) {
			const res = await this.$fetch(`/mgmt/store/getBankAccountList?storeCode=${storeCode}`);
			if (res && res.data) {
				let result = {};
				res.data.map(item => {
					result[item.account] = item.accountBank;
				});
				this.storeAccountJson = result;
			} else {
				this.$message.error('获取服务中心绑定账号失败');
			}
		},
		// 获取分公司绑定账号
		async loadCompanyAccount(companyCode) {
			const res = await this.$fetch(`/mgmt/sys/getAccountList?companyCode=${companyCode}`);
			if (res && res.data) {
				let result = {};
				res.data.map(item => {
					result[item.account] = item.bankType;
				});
				this.companyAccountJson = result;
			} else {
				this.$message.error('获取分公司绑定账号失败');
			}
		},
		// 通过服务中心获取押货款信息
		async loadPledgePayment() {
			const { storeCode } = this.inputForm;
			const res = await this.$fetch(`mgmt/inventory/mortgageAmount/getMortgageAmountByStore?storeCode=${storeCode}`);
			if (res && res.data) {
				const { remitUsed, balance } = res.data;
				this.remitUsed = remitUsed;
				this.balance = balance;
			} else {
				this.$message.error('获取服务中心押货款信息失败');
			}
		},
		// 通过服务中心编码获取服务中心信息
		async loadStoreInfo() {
			const { storeCode } = this.inputForm;
			if (!storeCode) return this.$message.warning('请输入服务中心编号');
			const res = await this.$fetch(`/mgmt/inventory/common/getStoreInfo?storeCode=${storeCode}`);
			if (res && res.data) {
				const { name: storeName, leaderName, companyCode } = res.data;
				this.inputForm = { ...this.inputForm, storeName, leaderName, companyCode };
				this.loadCompanyAccount(companyCode);
				this.loadPledgePayment();
				this.loadStoreAccount(storeCode);
			} else {
				this.$message.error('获取服务中心信息失败');
			}
		},
		// 获取款项类型
		async loadPaymentType() {
			const res = await this.$fetch(`/mgmt/inventory/remit/getSourceTypeByRemitType?remitType=2`);
			if (res && res.data) {
				this.paymentAdjustList = res.data;
			} else {
				this.$message.error('获取款项类型失败');
			}
		},
		inputCancel(formName) {
			this.$dispatch('CLOSE_HAND_INPUT_POP');
			this.$refs[formName].resetFields();
		},
		inputConfirm(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					this.confirmBtnSwitch = false;
					const {
						paymentAdd,
						inputForm: { remitMoney },
					} = this;
					this.inputForm.remitMoney = !paymentAdd ? `-${remitMoney}` : remitMoney;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/inventory/remit/addManualInputRemit',
						data: this.inputForm,
					});
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.$dispatch('UPDATE_HAND_INPUT_FLOW_LIST');
						this.$dispatch('CLOSE_HAND_INPUT_POP');
						this.$refs[formName].resetFields();
					} else {
						this.$message.error('操作失败');
					}
					this.confirmBtnSwitch = true;
				}
			});
		},
	},
	created() {
		this.loadPaymentType();
	},
};
</script>

<style lang="scss" scoped>
::v-deep.hand-input-pop {
	.hand-input-form {
		max-height: 65vh;
		overflow-x: hidden;
		overflow-y: auto;
	}
	.line-input {
		// display: inline-block;
		width: 40%;
		input {
			width: 100%;
		}
	}
	.all-input {
		width: 100%;
	}
	.tips {
		color: #d9001b;
	}
	.marginbottom-0 {
		margin-bottom: 0;
	}
}
.pop-foot-button {
	display: flex;
	justify-content: center;
	margin-top: 16px;
}
</style>