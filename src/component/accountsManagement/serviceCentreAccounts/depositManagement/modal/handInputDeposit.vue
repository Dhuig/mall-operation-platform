<template>
	<div class="hand-input-deposit">
		<el-dialog v-drag title="手工录入保证金" :visible.sync="visible" width="800px" @close="cancel('form')">
			<el-form :model="form" ref="form" :rules="HAND_INPUT_FORM_RULES" label-width="130px" label-suffix=":">
				<el-row>
					<el-col :span="12">
						<el-form-item label="服务中心编号" prop="storeCode">
							<el-input v-model="form.storeCode" @change="loadMessageByStoreCode" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="服务中心名称" prop="storeName">
							<el-input v-model="form.storeName" disabled />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="负责人" prop="leaderName">
							<el-input v-model="form.leaderName" disabled />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="会员卡号" prop="cardNo">
							<el-input v-model="form.cardNo" disabled />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="开店保证金余额" prop="depositMoney">
							<el-input v-model="form.depositMoney" disabled>
								<span slot="prepend">￥</span>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="超额保证金余额" prop="speciallyMoney">
							<el-input v-model="form.speciallyMoney" disabled>
								<span slot="prepend">￥</span>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="款项类型" prop="depositType">
							<el-select v-model="form.depositType">
								<el-option
									v-for="{ label, value } in optionGenerator(DEPOSIT_TYPE)"
									:key="value"
									:label="label"
									:value="value"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="转账类型" prop="payType">
							<el-select v-model="form.payType">
								<el-option
									v-for="{ label, value } in optionGenerator(PAY_TYPE)"
									:key="value"
									:label="label"
									:value="value"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="保证金金额" prop="money">
							<el-input v-model="form.money" />
							<span class="text-tips">正数表示增加，负数则表示扣减</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="付款账号" prop="payAccount">
							<el-input v-model="form.payAccount" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="付款银行名称" prop="payBankName">
							<el-input v-model="form.payBankName" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="备注" prop="submitRemark">
							<el-input type="textarea" v-model="form.submitRemark" maxlength="50" show-word-limit />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-row class="" type="flex" justify="end">
				<el-button @click="cancel('form')">取消</el-button>
				<el-button type="primary" :disabled="!buttonCanClick" @click="save('form')">提交</el-button>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import { DEPOSIT_TYPE, PAY_TYPE } from '../config';
import { HAND_INPUT_FORM_RULES } from './config';
import { optionGenerator } from 'util';
export default {
	name: 'handInputDeposit',
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
	watch: {
		show(val) {
			this.visible = val;
		},
		dataSource(data) {
			this.form = { ...data };
			if (Object.keys(data).lenth) {
				this.loadMessageByStoreCode();
			}
		},
		'form.payType'(val) {
			let rule = {
				pattern: /^([1-9]\d{0,9}|0)(\.\d{1,2})?$/,
				message: '请输入0~9999999999.99的数字',
				trigger: 'blur',
			};
			if (val == 3) {
				rule = { pattern: /^-([1-9]\d{0,9}|0)(\.\d{1,2})?$/, message: '请输入-9999999999.99~0的数字', trigger: 'blur' };
			}
			this.HAND_INPUT_FORM_RULES.money.splice(1, 1, rule);
		},
	},
	data() {
		return {
			DEPOSIT_TYPE,
			PAY_TYPE,
			HAND_INPUT_FORM_RULES,
			optionGenerator,
			visible: false,
			form: {},
			buttonCanClick: true, // 确认按钮是否可点击
		};
	},
	methods: {
		cancel(formName) {
			this.$refs[formName].resetFields();
			this.$emit('close');
		},
		save(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					this.buttonCanClick = false;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/store/addDepositApply',
						data: this.form,
						callback: () => {
							this.buttonCanClick = true;
						},
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
			if (!storeCode) return this.$message.warning('请输入服务中心编号');
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
				let { depositMoney, speciallyMoney } = res.data;
				depositMoney = Number(depositMoney).toFixed(2);
				speciallyMoney = Number(speciallyMoney).toFixed(2);
				this.form = { ...this.form, depositMoney, speciallyMoney };
			} else {
				this.$message.error('获取保证金信息失败');
			}
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep.hand-input-deposit {
	.text-tips {
		color: $error;
	}
}
</style>