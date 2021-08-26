<template>
	<div class="bimonthlyAuditDialog">
		<el-dialog title="隔月开票审核" :visible.sync="dialogInfo.show" width="60%" :before-close="closeDialog" v-drag>
			<!-- 退票审核 -->
			<div class="dialogBox">
				<el-alert v-if="errorStatus" :title="errorTitle" type="warning" :closable="false" show-icon></el-alert>
				<el-form ref="dialogForm" :model="dialogForm" :rules="AUDITSTATUS_RULES" label-width="120px" label-suffix=":">
					<div class="flex">
						<el-form-item label="订单号">
							{{ dialogInfo.orderNo }}
						</el-form-item>
						<el-form-item label="订单状态">
							{{ ORDER_STATUS[dialogInfo.orderStatus] }}
						</el-form-item>
					</div>
					<el-form-item label="付款时间">
						{{ dialogInfo.payTimeDesc }}
					</el-form-item>
					<el-form-item label="审核结果" prop="reviewStatus">
						<el-radio-group v-model="dialogForm.reviewStatus">
							<el-radio :disabled="errorStatus" label="2">通过</el-radio>
							<el-radio label="3">驳回</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="审核意见" prop="remarks">
						<el-input
							:disabled="errorStatus && dialogForm.reviewStatus != '3'"
							placeholder="请输入审核意见"
							:autosize="{ minRows: 4, maxRows: 4 }"
							maxlength="1000"
							show-word-limit
							type="textarea"
							v-model="dialogForm.remarks"
						></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="flex footer">
					<el-button class="cancelBtn" @click="closeDialog">取 消</el-button>
					<el-button
						type="primary"
						:loading="loading"
						element-loading-spinner="el-icon-loading"
						@click="enterDialog('dialogForm')"
					>
						保 存
					</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { AUDITSTATUS_RULES, ORDER_STATUS } from './config';
export default {
	name: 'refundAudit',
	props: {
		// 传入信息
		dialogInfo: Object,
	},
	data() {
		return {
			AUDITSTATUS_RULES,
			ORDER_STATUS,
			dialogForm: {
				// 表单
				reviewStatus: '',
				remarks: '',
			},
			loading: false,
		};
	},
	computed: {
		// 错误提示
		errorTitle() {
			return this.dialogInfo.isReturn == 1
				? '当前订单为已退货或退货中，不允许通过审核，请驳回。'
				: '当前订单支付时间已经超过2个自然月，不允许通过审核，请驳回';
		},
		// 错误状态
		errorStatus() {
			// 是否退货 0 -> 否 1 -> 是           // 是否跨月 0 -> 否 1 -> 是
			return !!this.dialogInfo.isReturn || !!this.dialogInfo.isAcrossMonth;
		},
	},
	methods: {
		// dialog 取消
		closeDialog() {
			this.dialogForm = {
				reviewStatus: '',
				remarks: '',
			};
			this.$refs['dialogForm'].resetFields();
			this.dialogInfo.show = false;
		},
		// dialog 确认
		enterDialog(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					// 确认后切换显示
					// this.loading = true;
					this.auditInvoice();
				}
			});
		},

		//审核
		async auditInvoice() {
			let obj = {
				method: 'POST',
				url: `/mgmt/order/reviewInvoice`,
				data: {
					orderNo: this.dialogInfo.orderNo,
					...this.dialogForm,
				},
			};
			this.loading = true;
			let res = await this.$fetch(obj);
			if (res.code == 200) {
				this.closeDialog();
				this.$message.success(res.message);
				this.$dispatch('UPDATA_BIMONTHLY_LIST');
			} else {
				if (this.$store.getters['system/getError']) {
					// * 错误提示
					this.$message.error(res.message);
				}
			}

			this.loading = false;
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
	overflow-y: auto;
}
::v-deep .el-loading-spinner {
	margin-top: 0;
	transform: translateY(-50%);
}
.bimonthlyAuditDialog {
	.dialogBox {
		max-height: 520px;
	}
	.flex {
		display: flex;
		.el-form-item {
			width: 50%;
		}
	}
	.footer {
		justify-content: flex-end;
		padding-bottom: 20px;
		.cancelBtn {
			margin-right: 5px;
		}
	}
}
</style>
