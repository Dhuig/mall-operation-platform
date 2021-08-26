<template>
	<div class="config-balance-withdrawal-limit">
		<guideBar />
		<el-card class="base-info">
			单日累计提现申请超过
			<span class="box-border">{{ quota }}</span>
			需要总公司审核，配置完成立即生效。
			<el-button type="text" v-permission="'finance_balance_withdrawal_limit_config_limit'" @click="quotaConfig">
				配置限额
			</el-button>
		</el-card>
		<el-card>
			<tableList
				border
				:dataSource="list"
				:columns="BALANCE_WITHDRAWAL_LIMIT_CONFIG_LOGS"
				:dataTotal="dataTotal"
				:pagination="pagination"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			/>
		</el-card>
		<el-dialog
			v-drag
			title="更改单日累计提现申请限额"
			width="500px"
			:visible.sync="editDialogVisible"
			@close="cancel('editForm')"
		>
			<el-form :model="editForm" ref="editForm" :rules="editFormRules" label-width="190px" label-suffix=":">
				<el-form-item label="当前单日累计提现限额">
					<el-input v-model="quota" disabled>
						<span slot="append">元</span>
					</el-input>
				</el-form-item>
				<el-form-item label="修改后的单日累计提现限额" prop="value">
					<el-input v-model="editForm.value">
						<span slot="append">元</span>
					</el-input>
				</el-form-item>
				<el-form-item><span class="color_red">（如更改单日累计提现限额，将立即生效）</span></el-form-item>
			</el-form>
			<div class="dialog-btn-footer">
				<el-button @click="cancel('editForm')">取消</el-button>
				<el-button type="primary" @click="save('editForm')">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { BALANCE_WITHDRAWAL_LIMIT_CONFIG_LOGS } from './config';
import qs from 'querystring';
export default {
	name: 'configBalanceWithdrawalLimit',
	data() {
		return {
			BALANCE_WITHDRAWAL_LIMIT_CONFIG_LOGS,
			list: [],
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
			quota: '', //现有限额
			editDialogVisible: false,
			editForm: {},
			editFormRules: {
				value: [{ pattern: /^([1-9]\d*|0).?\d+$/, message: '请输入数字字符', trigger: 'blur' }],
			},
		};
	},
	computed: {
		loadDataFields() {
			const { currentPage: pageNum, pageSize } = this.pagination;
			return {
				type: 2,
				pageNum,
				pageSize,
			};
		},
	},
	methods: {
		// 翻页操作
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 切换每页条数
		handleSizeChange(pageSize) {
			this.pagination = {
				currentPage: 1,
				pageSize: pageSize,
			};
			this.loadData();
		},
		quotaConfig() {
			this.editDialogVisible = true;
			this.editForm.type = 2;
		},
		// 取消修改
		cancel(formName) {
			this.$refs[formName].resetFields();
			this.editDialogVisible = false;
		},
		// 保存修改
		save(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const res = await this.$fetch(`/mgmt/fin/wallet/updateAccountConfig?${qs.stringify(this.editForm)}`);
					if (res && res.code == 200) {
						this.loadData();
						this.loadQuota();
						this.$message.success('操作成功');
						this.$refs[formName].resetFields();
						this.editDialogVisible = false;
					} else {
						this.$message.error((res && res.data.message) || '操作失败');
					}
				}
			});
		},
		// 获取提现申请限额
		async loadQuota() {
			const res = await this.$fetch(`/mgmt/fin/wallet/getAccountConfigValue?type=2`);
			if (res && res.code == 200) {
				this.quota = res.data;
			} else {
				this.$message.error('获取提现申请限额失败，请查看服务是否可用');
			}
		},
		// 获取修改记录数据
		async loadData() {
			const res = await this.$fetch(`/mgmt/fin/wallet/getAccountConfig?${qs.stringify(this.loadDataFields)}`);
			if (res && res.code == 200 && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
			} else {
				this.$message.error('获取修改记录数据失败，请查询服务是否可用');
			}
		},
	},
	mounted() {
		this.loadQuota();
		this.loadData();
	},
};
</script>

<style lang="scss" scoped>
::v-deep.config-balance-withdrawal-limit {
	.base-info {
		font-size: 14px;
	}
	.dialog-btn-footer {
		display: flex;
		justify-content: flex-end;
	}
	.color_red {
		color: $error;
	}
	.box-border {
		padding: 8px 16px;
		min-width: 50px;
		text-align: center;
		display: inline-block;
		border: 1px solid $color-body;
	}
}
</style>
