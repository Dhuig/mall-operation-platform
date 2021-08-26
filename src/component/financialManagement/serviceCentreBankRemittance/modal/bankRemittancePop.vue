<template>
	<div class="bank-remittance-pop">
		<el-dialog v-drag :title="title" :visible.sync="bankRemitProps.show" width="800px">
			<el-form :model="bankForm" ref="bankForm" :rules="bankFormRules" label-width="120px" label-suffix=":">
				<div class="sub-title">银行汇款流水信息</div>
				<el-row>
					<el-col :span="24">
						<el-form-item label="流水号">
							{{ bankForm.waterNo }}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="服务中心编号" prop="storeCode">
							<span v-if="bankRemitProps.type == 1">{{ bankForm.storeCode }}</span>
							<el-input
								v-model="bankForm.storeCode"
								v-else
								:disabled="!bankRemitProps.storeCodeSearch"
								@change="loadStoreInfo"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="服务中心名称">{{ bankForm.storeName || '' }}</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="负责人">{{ bankForm.leaderName || '' }}</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="所属分公司编号">{{ bankForm.companyCode || '' }}</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="款项类型">
							{{ bankForm.sourceTypeName || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="交易类型">{{ bankForm.changeReason || '' }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="款项金额">￥{{ bankForm.remitMoney || '' }}</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="付款账号">{{ bankForm.account || '' }}</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="付款银行">{{ bankForm.bankName || '' }}</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="收款账号">{{ bankForm.receiptAccount || '' }}</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="收款银行">{{ bankForm.receiptBankName || '' }}</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="银行到账时间">{{ formatDate(bankForm.bankPaymentTimeStamp * 1000) }}</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="系统到账时间">{{ formatDate(bankForm.systemPaymentTimeStamp * 1000) }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="备注">{{ bankForm.remark || '' }}</el-form-item>
					</el-col>
				</el-row>
				<div class="sub-title">处理信息</div>
				<el-row>
					<el-col :span="24">
						<el-form-item label="处理类型">
							{{ (bankForm.dealType && DEAL_TYPE[bankForm.dealType]) || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="处理状态">{{ DEAL_STATUS[bankForm.dealStatus] || '' }}</el-form-item>
					</el-col>
					<template v-if="controlDealinfoShow">
						<el-col :span="12">
							<el-form-item label="款项类型" class="need-margin" prop="sourceType">
								<span v-if="bankRemitProps.type == 1">
									<!-- {{ (bankForm.sourceType && PAYMENT_TYPE[bankForm.sourceType]) || '' }} -->
									{{ bankForm.sourceTypeName }}
								</span>
								<template v-else>
									<el-radio-group v-model="bankForm.sourceType">
										<el-radio :label="item.type" v-for="(item, index) in bankRemitProps.sourceTypeList" :key="index">
											{{ item.name }}
										</el-radio>
									</el-radio-group>
									<!-- <el-radio v-model="bankForm.type" label="2">备选项</el-radio> -->
								</template>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="交易类型" class="need-margin">{{ bankForm.changeReason || '' }}</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="备注">
								<span v-if="bankRemitProps.type == 1">{{ bankForm.dealRemark || '' }}</span>
								<el-input type="textarea" v-model="bankForm.dealRemark" v-else />
							</el-form-item>
						</el-col>
						<el-col :span="24" v-if="bankForm.type == 1">
							<el-form-item label="处理人">{{ bankForm.verifyer || bankForm.dealMan }}</el-form-item>
						</el-col>
						<el-col :span="24" v-if="bankForm.type == 1">
							<el-form-item label="处理时间" v-if="bankForm.dealTime">{{ formatDate(bankForm.dealTime) }}</el-form-item>
							<el-form-item label="处理时间" v-else>{{ formatDate(bankForm.updateTime) }}</el-form-item>
						</el-col>
					</template>
				</el-row>
			</el-form>
			<span class="pop-footer-button" v-if="bankRemitProps.type == 2">
				<el-button type="primary" :disabled="!confirmBtnSwitch" @click="confirm('bankForm')">确认</el-button>
				<el-button @click="cancel('bankForm')">取消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { formatDate } from 'util/formValidation.js';
import { DEAL_STATUS, DEAL_TYPE, PAYMENT_TYPE } from '../config';
export default {
	name: 'bankRemittancePop',
	props: {
		bankRemitProps: Object,
		confirmBtnSwitch: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			DEAL_TYPE,
			DEAL_STATUS,
			PAYMENT_TYPE,
			bankForm: {
				storeCode: '',
				type: 1, // 区分详情还是处理
				remark: '',
				sourceType: '',
			},
			bankFormRules: {
				storeCode: [{ required: false, message: '请输入服务中心编号', trigger: 'blur' }],
				sourceType: [{ required: true, message: '请选择款项类型', trigger: 'blur' }],
			},
		};
	},
	watch: {
		bankRemitProps: {
			handler(val) {
				this.bankForm = { ...this.bankForm, ...val };
			},
			deep: true,
		},
		bankForm: {
			handler(val) {
				const { sourceTypeList } = val;
				sourceTypeList &&
					sourceTypeList.map(item => {
						val.sourceType == item.type && (val.changeReason = item.changeReason);
					});
			},
			deep: true,
		},
		'bankForm.sourceType'(val) {
			// 款项类型为无法识别款确认押货款时，服务中心编号改为必须
			if (val && val == 5) {
				this.bankFormRules.storeCode[0].required = true;
			} else {
				this.bankFormRules.storeCode[0].required = false;
				this.$refs.bankForm?.clearValidate('storeCode');
			}
		},
	},
	computed: {
		title() {
			let title;
			switch (this.bankRemitProps.type) {
				case 1:
					title = '详情';
					break;
				case 2:
					title = '处理';
					break;
				default:
					title = '详情';
			}
			return title;
		},
		formatDate() {
			return formatDate;
		},
		controlDealinfoShow() {
			const { bankForm } = this;
			return (bankForm.type == 1 && bankForm.dealStatus == 1) || bankForm.type == 2;
		},
		isPersonDeal() {
			const { dealType } = this.bankForm;
			return dealType == 2;
		},
	},
	methods: {
		// 通过服务中心编码获取服务中心信息
		async loadStoreInfo() {
			const { storeCode } = this.bankForm;
			if (!storeCode) return this.$message.warning('请输入服务中心编号');
			const res = await this.$fetch(`/mgmt/inventory/common/getStoreInfo?storeCode=${storeCode}`);
			if (res && res.data) {
				const { name: storeName, leaderName, companyCode } = res.data;
				this.bankForm = { ...this.bankForm, storeName, leaderName, companyCode };
			} else {
				this.$message.error('获取服务中心信息失败');
			}
		},
		confirm(formName) {
			console.log('确认');
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$emit('confirm', this.bankForm);
				}
			});
		},
		cancel(formName) {
			console.log('取消');
			this.$refs[formName].resetFields();
			this.$emit('cancel');
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep.bank-remittance-pop {
	.el-form {
		max-height: 65vh;
		overflow: auto;
	}
	.el-form-item {
		margin-bottom: 0px;
		&.need-margin {
			margin-bottom: 24px;
		}
		.el-radio {
			line-height: 24px;
		}
	}
	.sub-title {
		font-size: 15px;
		display: flex;
		align-items: center;
		margin: 8px 0;
		&::before {
			content: '';
			display: block;
			width: 4px;
			height: 14px;
			margin-right: 8px;
			background: cornflowerblue;
		}
	}
	.pop-footer-button {
		display: flex;
		justify-content: center;
		margin-top: 16px;
	}
}
</style>