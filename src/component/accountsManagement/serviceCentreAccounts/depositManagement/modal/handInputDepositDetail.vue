<template>
	<div class="hand-input-deposit-detail">
		<el-dialog v-drag title="保证金详情" :visible.sync="visible" width="800px" @close="cancel('form')">
			<el-form :model="form" ref="form" :rules="rules" label-width="130px" label-suffix=":">
				<el-row>
					<el-col :span="24" class="sub-title">基本信息</el-col>
					<el-col :span="12">
						<el-form-item label="服务中心编号" prop="storeCode">{{ form.storeCode }}</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="服务中心名称" prop="storeName">
							{{ form.storeName }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="负责人" prop="leaderName">
							{{ form.leaderName }}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="会员卡号" prop="cardNo">
							{{ form.cardNo }}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="开店保证金余额" prop="depositMoney">
							{{ form.depositMoney }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="超额保证金余额" prop="speciallyMoney">
							{{ form.speciallyMoney }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="款项类型" prop="depositType">
							{{ DEPOSIT_TYPE[form.depositType] }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="转账类型" prop="payType">
							{{ PAY_TYPE[form.payType] }}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="保证金金额" prop="money">
							{{ form.money }}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="付款账号" prop="payAccount">
							{{ form.payAccount }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="付款银行名称" prop="payBankName">
							{{ form.payBankName }}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="备注" prop="submitRemark">
							{{ form.submitRemark }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="提交人" prop="submitter">
							{{ form.submitter }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="提交时间" prop="createTime">
							{{ formatDate(form.createTime) }}
						</el-form-item>
					</el-col>
					<template v-if="form.type == 'detail'">
						<el-col :span="24" class="sub-title">审核信息</el-col>
						<el-col :span="24">
							<el-form-item label="审核结果" prop="verifyStatus">
								{{ DEPOSIT_INPUT_AND_AUDIT_STATUS_INDEX[form.verifyStatus] }}
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="审核备注" prop="verifyRemark">
								{{ form.verifyRemark }}
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="审批人" prop="verifier">
								{{ form.verifier }}
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="审批时间" prop="verifyTime">
								{{ formatDate(form.verifyTime) }}
							</el-form-item>
						</el-col>
					</template>
					<template v-if="form.type == 'audit'">
						<el-col :span="24" class="mb-16">
							<el-form-item label="审核结果" prop="verifyStatus">
								<el-select v-model="form.verifyStatus">
									<el-option label="通过" :value="1"></el-option>
									<el-option label="不通过" :value="2"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb-16">
							<el-form-item label="审核备注" prop="verifyRemark">
								<el-input type="textarea" v-model="form.verifyRemark" maxlength="50" show-word-limit />
							</el-form-item>
						</el-col>
					</template>
				</el-row>
			</el-form>
			<el-row class="" type="flex" justify="center">
				<el-button @click="cancel('form')">取消</el-button>
				<el-button type="primary" @click="cancel('form')" v-if="form.type == 'detail'">确定</el-button>
				<el-button type="primary" @click="save('form')" v-if="form.type == 'audit'">审核</el-button>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import { DEPOSIT_TYPE, PAY_TYPE, DEPOSIT_INPUT_AND_AUDIT_STATUS_INDEX } from '../config';
import { formatDate } from 'util/formValidation';
const auditRule = [{ required: true, message: '请选择审核结果', trigger: 'change' }];
export default {
	name: 'handInputDepositDetail',
	props: {
		show: {
			type: Boolean,
			default: false,
		},
		dataSource: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			DEPOSIT_TYPE,
			PAY_TYPE,
			DEPOSIT_INPUT_AND_AUDIT_STATUS_INDEX,
			rules: {
				verifyStatus: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
			},
			visible: false,
			form: {},
		};
	},
	watch: {
		show(val) {
			this.visible = val;
		},
		dataSource(data) {
			this.form = { ...data };
			if (data.type == 'detail') {
				this.rules.verifyStatus = null;
			} else {
				this.rules.verifyStatus = auditRule;
			}
		},
		'form.storeCode'() {
			this.loadMessageByStoreCode();
		},
	},
	computed: {
		formatDate() {
			return formatDate;
		},
	},
	methods: {
		cancel(formName) {
			this.$refs[formName].resetFields();
			this.$emit('close');
		},
		save(formName) {
			this.$refs[formName].validate(async (valid) => {
				if (valid) {
					const { id: ids, verifyRemark, verifyStatus } = this.form;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/store/verifyDeposit',
						data: { ids, verifyRemark, verifyStatus },
					});
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.$emit('success');
						this.cancel(formName);
					} else {
						this.$message.error((res && res.data.message) || '操作失败');
					}
				}
			});
		},
		// 通过服务中心编号拿取数据
		async loadMessageByStoreCode() {
			const { storeCode } = this.form;
			if (!storeCode) return;
			const res = await this.$fetch(`/mgmt/store/getMainStoreInfo?storeCode=${storeCode}`);
			if (res && res.code === 200) {
				const { name: storeName, leaderName, leaderNo: cardNo } = res.data;
				this.form = { ...this.form, storeName, leaderName, cardNo };
			} else {
				this.$message.error('获取服务中心信息失败');
			}
			this.loadDepositByStoreCode();
		},
		// 通过服务中心编号获取保证金
		async loadDepositByStoreCode() {
			const res = await this.$fetch(`/mgmt/store/getDepositInfo?storeCode=${this.form.storeCode}`);
			if (res && res.code === 200) {
				const { depositMoney, speciallyMoney } = res.data;
				this.form = { ...this.form, depositMoney, speciallyMoney };
			} else {
				this.$message.error('获取保证金信息失败');
			}
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep.hand-input-deposit-detail {
	.el-form-item {
		margin-bottom: 0;
	}
	.mb-16 {
		.el-form-item {
			margin-bottom: 24px;
		}
	}
	.sub-title {
		font-size: 16px;
	}
}
</style>