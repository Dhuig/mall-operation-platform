<template>
	<div class="finance-Balance-Detail">
		<guideBar />
		<el-form ref="auditForm" :model="auditForm" :rules="AUDIT_RULES" label-width="128px" size="medium" class="from-box">
			<el-card class="box-card">
				<div class="detail-message">
					<el-row>
						<el-col :span="8" v-for="(item, index) in WITHDRAWAL_DETAIL_INFO_CONFIG" :key="index">
							<div>
								<span>{{ item.label }}：</span>
								<span v-if="item.formatter" v-html="item.formatter(allInfo)"></span>
								<span v-else>{{ allInfo[item.prop] }}</span>
							</div>
						</el-col>
					</el-row>
				</div>
			</el-card>
			<el-card>
				<!-- <el-form ref="formData"> -->
				<div class="dataBox">
					<el-row :gutter="24">
						<el-col :span="12">
							<el-form-item label="审核操作" prop="status">
								<el-select v-model="auditForm.status" placeholder="请选择审核操作">
									<el-option
										v-for="item in AUDIT_RESULT"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="24">
						<el-col :span="12">
							<el-form-item label="备注说明" prop="auditRemark" style="marginbottom: 24px;">
								<el-input
									type="textarea"
									maxlength="200"
									:rows="2"
									placeholder="请输入内容"
									v-model="auditForm.auditRemark"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
				<!-- </el-form> -->
			</el-card>
		</el-form>
		<div class="eidt-btn-footer">
			<div class="eidt-btn-footer-box">
				<el-button @click="resetForm('auditForm')">取消</el-button>
				<el-button type="primary" @click="submitForm('auditForm')">保存</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import { AUDIT_RESULT, AUDIT_RULES, WITHDRAWAL_DETAIL_INFO_CONFIG } from './config';
import { optionGenerator } from 'util';
export default {
	name: 'balanceWithdrawalDetail',
	data() {
		return {
			id: '',
			isAddData: true,
			dataSource: {},
			formData: {},
			loading: false,
			auditForm: {},
			allInfo: {},
			AUDIT_RESULT,
			AUDIT_RULES,
			WITHDRAWAL_DETAIL_INFO_CONFIG,
		};
	},
	mounted() {
		let id = this.$route.query.id || '';
		this.id = id;
		this.loadData();
	},
	methods: {
		// 取消
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.$closeSelf();
			this.$go('finance_balance_list');
		},
		// 保存
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.auditFn(() => {
						// 更新列表页列表数据
						this.$dispatch('UPDATE_WITHDRAWAL_LIST');
						// 关闭编辑/新增页面
						this.$closeSelf();
					});
					this.$refs[formName].resetFields();
				}
			});
		},
		// 审核方法
		async auditFn(callback) {
			let data = {
				...this.auditForm,
				walletWithdrawId: this.id,
			};
			data.status = Number(data.status);
			data.walletWithdrawId = Number(data.walletWithdrawId);
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/auditWithdraw',
				data,
			});
			if (res && res.code == 200) {
				callback && callback();
			} else {
				this.$message({
					type: 'error',
					message: '操作失败',
				});
			}
		},
		// 获取数据
		async loadData() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/getWithdrawDetail?id=' + Number(this.id),
			});
			if (res && res.data) {
				this.allInfo = res.data;
			} else {
				this.$message({
					type: 'error',
					message: '获取数据失败',
				});
			}
		},
		// 审核
		async audit() {
			let data = {
				...this.formData,
				walletWithdrawId: this.id,
			};
			console.log(data);
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/auditWithdraw',
				data,
			});
			if (res && res.data) {
				// 更新列表页列表数据
				this.$dispatch('UPDATE_LIST');
			}
			// 关闭编辑/新增页面
			this.$closeSelf();
		},

		// 获取字典
		async loadDictByType(dictType) {
			if (!dictType) return;
			const res = await this.$fetch(`pc/dict/getDictData?dataType=${dictType}`);
			return res && res.data ? res.data : [];
		},
		// 获取字典
		async loadConfigs() {
			const DICT_ARR = ['AUDIT_RESULT'];
			Promise.all(DICT_ARR.map((type) => this.loadDictByType(type))).then((res) => {
				if (res && res.length == DICT_ARR.length) {
					const [AUDIT_RESULT] = res.map((dict) => optionGenerator(dict.data[0].value));
					this.AUDIT_RESULT = AUDIT_RESULT;
				}
			});
		},
	},
};
</script>
<style lang="scss" scoped>
.finance-Balance-Detail {
	padding-top: 16px;
	.eidt-btn-footer {
		padding: 16px 38px;
		box-shadow: 0px -2px 4px 0px $color-border;
		position: fixed;
		bottom: 0;
		left: 264px;
		right: 0;
		.eidt-btn-footer-box {
			text-align: right;
			button {
				padding: 9px 16px;
			}
		}
	}
	.box-card {
		margin-bottom: 16px;
		.detail-message {
			width: 92%;
			font-size: 14px;
			line-height: 16px;
			margin: 0 auto;
			.el-col {
				padding: 15px 0;
			}
		}
	}
}
</style>
