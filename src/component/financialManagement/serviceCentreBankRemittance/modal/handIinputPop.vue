<template>
	<div class="hand-input-detail-pop">
		<el-dialog v-drag :title="title" :visible.sync="handInputProps.show" width="700px">
			<el-form :model="handInputForm" ref="handInputForm" :rules="handInputRules" label-width="120px" label-suffix=":">
				<div class="sub-title">手工录入流水信息</div>
				<el-row>
					<el-col :span="12">
						<el-form-item label="服务中心编号">
							<span>{{ handInputForm.storeCode || '' }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="所属分公司">{{ companyData[handInputForm.companyCode] }}</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="款项类型">
							{{ handInputForm.sourceTypeName || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="交易类型">{{ handInputForm.changeReason || '' }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="款项金额">￥{{ handInputForm.remitMoney || '' }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="备注">{{ handInputForm.remark || '' }}</el-form-item>
					</el-col>
				</el-row>
				<div class="sub-title">录入人信息</div>
				<el-row>
					<el-col :span="24">
						<el-form-item label="录入人">{{ handInputForm.inputMan || '' }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="录入时间">{{ formatDate(handInputForm.createTime) || '' }}</el-form-item>
					</el-col>
				</el-row>
				<div class="sub-title">审核信息</div>
				<el-row>
					<el-col :span="24">
						<el-form-item label="审核状态">
							{{
								handInputForm.verifyResult || (handInputForm.verifyer && handInputForm.dealTime > 0)
									? '已审核'
									: '待审核'
							}}
						</el-form-item>
					</el-col>
					<template v-if="controlDealinfoShow">
						<el-col :span="24">
							<el-form-item label="审核结果" prop="verifyResult">
								<el-radio v-model="handInputForm.verifyResult" :label="1" :disabled="isDetail">通过</el-radio>
								<el-radio v-model="handInputForm.verifyResult" :label="2" :disabled="isDetail">拒绝</el-radio>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="备注" prop="remark">
								<span v-if="isDetail">{{ handInputForm.verifyRemark || handInputForm.dealRemark || '' }}</span>
								<el-input v-else type="textarea" v-model="handInputForm.verifyRemark" />
							</el-form-item>
						</el-col>
						<el-col :span="24" v-if="isDetail">
							<el-form-item label="审核人">{{ handInputForm.verifyer || '' }}</el-form-item>
						</el-col>
						<el-col :span="24" v-if="isDetail">
							<el-form-item label="审核时间">{{ formatDate(handInputForm.updateTime) || '' }}</el-form-item>
						</el-col>
					</template>
				</el-row>
			</el-form>
			<span class="pop-footer-button" v-if="handInputProps.type == 2">
				<el-button type="primary" :disabled="!confirmBtnSwitch" @click="inputConfirm('handInputForm')">确认</el-button>
				<el-button @click="inputCancel('handInputForm')">取消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { PAYMENT_TYPE, DEAL_TYPE } from '../config';
import { formatDate } from 'util/formValidation';
import qs from 'querystring';

export default {
	name: 'handInputDetailPop',
	props: {
		handInputProps: Object,
	},
	data() {
		return {
			PAYMENT_TYPE,
			DEAL_TYPE,
			handInputForm: {
				verifyResult: '',
				verifyRemark: '',
			},
			handInputRules: {
				verifyResult: [
					{ required: true, message: '请选择审核结果', trigger: 'change' },
					{ pattern: /1|2/, message: '请选择审核结果', trigger: 'change' },
				],
			},
			confirmBtnSwitch: true,
		};
	},
	watch: {
		handInputProps: {
			handler(val) {
				console.log(val);
				// dealTime作为自动处理和后台输入的差别(基于银行流水里面)
				if (val.env == 'bankFlow' && val.verifyer && val.dealTime && val.dealTime > 0) {
					val.verifyResult = 1;
				}
				this.handInputForm = { ...this.handInputForm, ...val };
			},
			deep: true,
		},
	},
	computed: {
		title() {
			let title;
			switch (this.handInputProps.type) {
				case 1:
					title = '详情';
					break;
				case 2:
					title = '审核';
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
			const { handInputProps } = this;
			return (
				(handInputProps.type == 1 &&
					(handInputProps.verifyResult > 0 || (handInputProps.verifyer && handInputProps.dealTime > 0))) ||
				handInputProps.type == 2
			);
		},
		isDetail() {
			const { handInputProps } = this;
			return handInputProps.type == 1; // type作为区分详情和处理 1详情 2处理
		},
		// 分公司数据
		companyData() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			let result = {};
			serviceCompanyOptions.map(({ label, value }) => {
				result[value] = label;
			});
			return result;
		},
	},
	methods: {
		inputConfirm(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					this.confirmBtnSwitch = false;
					const res = await this.$fetch(
						`/mgmt/inventory/remit/verifyManualInputRemit?${qs.stringify(this.handInputForm)}`
					);
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.$refs[formName].resetFields();
						this.$dispatch('UPDATE_HAND_INPUT_FLOW_LIST');
						this.$dispatch('CLOSE_HAND_INPUT_POP');
					} else {
						this.$message.error('操作失败');
					}
					this.confirmBtnSwitch = true;
				}
			});
		},
		inputCancel(formName) {
			console.log('取消');
			this.$refs[formName].resetFields();
			this.$dispatch('CLOSE_HAND_INPUT_POP');
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep.hand-input-detail-pop {
	.el-form {
		max-height: 65vh;
		overflow: auto;
	}
	.el-form-item {
		margin-bottom: 0px;
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