<template>
	<!-- 新增/编辑 -->
	<el-dialog v-drag title="手工录入款项" :visible.sync="inputDialogVisible" width="600px" @close="cacel('ruleForm')">
		<el-form
			class="add-rate"
			:model="ruleForm"
			:rules="HAND_INPUT_RULES"
			ref="ruleForm"
			label-width="130px"
			label-suffix=":"
		>
			<el-form-item label="分公司编号" prop="companyCode">
				<span v-if="form.companyCode">{{ ruleForm.companyCode }}</span>
				<el-select v-else size="medium" v-model="ruleForm.companyCode" placeholder="请选择分公司编号">
					<el-option :label="item.value" :value="item.value" v-for="item in companyData" :key="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="分公司名称">
				{{ (ruleForm.companyCode && COMPANY_LIST[ruleForm.companyCode]) || '' }}
			</el-form-item>
			<el-form-item label="当前实际余额">{{ ruleForm.actualBalance }}元</el-form-item>
			<el-form-item label="款项类型" prop="type">
				<el-select size="medium" v-model="ruleForm.type" placeholder="请选择款项类型">
					<el-option :label="item.label" :value="item.value" v-for="(item, index) in MONEY_TYPE" :key="index" />
				</el-select>
			</el-form-item>
			<el-form-item v-if="ruleForm.type === 2" label="银行类型" prop="transMethod">
				<el-select size="medium" v-model="ruleForm.transMethod" placeholder="请选择银行类型">
					<el-option :label="item.bankName" :value="item.payWayId" v-for="(item, index) in bankOption" :key="index" />
				</el-select>
			</el-form-item>
			<el-form-item label="输入金额" prop="adjustAmount">
				<el-input size="medium" v-model="ruleForm.adjustAmount" placeholder="输入数字，支持小数点后2位" />
			</el-form-item>
			<el-form-item label="修改后实际余额">
				<span>￥{{ editedAmount }}</span>
			</el-form-item>
			<el-form-item label="修改原因说明" prop="adjustReason">
				<el-input
					size="medium"
					type="textarea"
					v-model="ruleForm.adjustReason"
					placeholder="请输入修改原因说明"
					show-word-limit
					maxlength="100"
				/>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="cacel('ruleForm')" class="cacel">取 消</el-button>
			<el-button type="primary" @click="save('ruleForm')" class="save">提交审核</el-button>
		</span>
	</el-dialog>
</template>

<script>
import { HAND_INPUT_RULES, MONEY_TYPE, pattenPositiveNum, pattenNegativeNum } from '../config';
import { optionGenerator } from 'util';
import { formatCurrency } from 'util/formValidation';
export default {
	name: 'editInputModal',
	props: {
		show: {
			type: Boolean,
			default: false,
		},
		form: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			HAND_INPUT_RULES,
			MONEY_TYPE,
			inputDialogVisible: false,
			ruleForm: {},
			haveBeenReminded: false, //是否已经弹窗提醒
			bankOption: {}, // 银行类型
		};
	},
	watch: {
		show(val) {
			this.inputDialogVisible = val;
		},
		form(data) {
			this.ruleForm = { ...data };
		},
		inputDialogVisible(val) {
			// 监听录入弹窗，关闭之后则 提醒弹窗开关置为false
			if (!val) {
				this.haveBeenReminded = val;
			}
		},
		'ruleForm.type'(val) {
			if (val == 1) {
				this.HAND_INPUT_RULES.adjustAmount.splice(1, 1, {
					pattern: pattenPositiveNum,
					message: '请输入正数，支持2位小数',
					trigger: 'blur',
				});
			} else if (val == 3) {
				this.HAND_INPUT_RULES.adjustAmount.splice(1, 1, {
					pattern: pattenNegativeNum,
					message: '请输入负数，支持2位小数',
					trigger: 'blur',
				});
			} else {
				this.HAND_INPUT_RULES.adjustAmount.splice(1, 1, {
					pattern: /^-?([1-9]\d*|0)(\.\d{1,2})?$/,
					message: '请输入数字字符，支持2位小数',
					trigger: 'blur',
				});
			}
		},
	},
	computed: {
		COMPANY_LIST() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			let data = {};
			serviceCompanyOptions.forEach(({ label, value }) => {
				data[value] = label;
			});
			return data;
		},
		companyData() {
			return this.$store.getters['system/getOptions'].serviceCompanyOptions || [];
		},
		editedAmount() {
			//修改后实际余额
			const { actualBalance, adjustAmount } = this.ruleForm;
			return formatCurrency(parseFloat(actualBalance) + parseFloat(adjustAmount)) || 0;
		},
	},
	methods: {
		// 校验当前实际余额小于等于0时，输入金额不能小于0
		validateAfterEditAmount() {
			const { actualBalance, adjustAmount, type } = this.ruleForm;
			const afterAmount = Number(actualBalance) + Number(adjustAmount);
			// @todo 设置在款项类型为 其他 时，不做此限制
			if (afterAmount < 0 && adjustAmount < 0) {
				if (type != 5) {
					this.$message.warning('当前实际余额为0，不能退款');
					return false;
				} else {
					let onOff = true;
					if (!this.haveBeenReminded) {
						onOff = false;
						this.$confirm('余额不足，请核查', '提示', {
							showCancelButton: false,
						}).then(() => {
							this.haveBeenReminded = true;
						});
					}
					return onOff;
				}
			} else {
				return true;
			}
		},
		// 取消 手工录入
		cacel(formName) {
			this.$refs[formName].resetFields();
			this.inputDialogVisible = false;
			this.$emit('close');
		},
		// 保存 手工录入
		save(formName) {
			let data = this.ruleForm;
			this.$refs[formName].validate(async valid => {
				if (valid && this.validateAfterEditAmount()) {
					delete data.actualBalance;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/fin/wallet/applyAdjust',
						data,
					});
					if (res && res.code == 200) {
						this.$message.success('操作成功');
						this.inputDialogVisible = false;
						this.$refs[formName].resetFields();
						this.$emit('success');
					} else {
						this.$message.error((res && res.data.message) || '暂无银行类型');
					}
				}
			});
		},
		// 获取字典映射
		async getDicts() {
			const [MONEY_TYPE] = await Promise.all([this.$getDict('NEW_MONEY_TYPE')]);
			if (MONEY_TYPE) {
				this.MONEY_TYPE = optionGenerator(MONEY_TYPE);
			} else {
				this.$message.warning('获取款项类型选项失败');
			}
		},
		// 支付方式-银行类型
		async getPayMethod() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/getPayMethod',
			});
			if (res && res.code == 200) {
				this.bankOption = res.data;
			} else {
				this.$message.error((res && res.data.message) || '操作失败');
			}
		},
	},
	mounted() {
		this.getDicts();
		this.getPayMethod();
	},
};
</script>

<style lang="scss" scoped>
::v-deep.add-rate {
	.el-select {
		width: 100%;
	}
}
</style>
