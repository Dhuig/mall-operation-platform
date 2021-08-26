<template>
	<div>
		<guideBar>
			<el-button v-permission="'bank_of_deposit_add'" type="primary" @click="insertAccount">
				新增开户银行
			</el-button>
			<el-button v-permission="'bank_of_deposit_export'" type="primary" @click="batchExport">批量导出</el-button>
		</guideBar>
		<el-card>
			<tableList :loading="loading" :dataSource="data" :columns="BANK_OF_DEPOSIT_COLUMNS"></tableList>
		</el-card>
		<!-- 新增/编辑 银行帐号 对话框 -->
		<el-dialog title="新增开户银行" :visible.sync="bankCardModal.show" width="40%" v-drag>
			<el-form
				inline
				size="small"
				:model="bankCardModal"
				label-width="120px"
				ref="bankCardData"
				label-suffix=":"
				label-position="right"
			>
				<el-row>
					<el-form-item label="开户银行编码" prop="bankNo">
						<el-input v-model="bankCardModal.code" maxlength="19" clearable />
					</el-form-item>
					<el-form-item label="开户银行名称" prop="bankOpenName">
						<el-input v-model="bankCardModal.name" clearable />
					</el-form-item>
				</el-row>
			</el-form>
			<div slot="footer" v-permission="'bank_of_deposit_submit'">
				<el-button type="info" @click="bankCardModal.show = false">取消</el-button>
				<el-button type="primary" @click="subBankCard">保存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { exportExcel } from 'util';
import { BANK_OF_DEPOSIT_COLUMNS } from './config';

export default {
	name: 'bankOfDepositManage',
	data() {
		return {
			BANK_OF_DEPOSIT_COLUMNS,
			loading: false,
			data: [],
			bankCardModal: {
				show: false,
				code: '',
				name: '',
			},
			// end
		};
	},
	computed: {},
	watch: {},
	methods: {
		// 新增开户银行-弹框
		insertAccount() {
			this.bankCardModal = {
				show: true,
				code: '',
				name: '',
			};
		},
		// 批量导出
		batchExport() {
			exportExcel('/crm/bmemberbank/importData');
		},
		// 新增开户银行
		async subBankCard() {
			const { code, name } = this.bankCardModal;
			const data = {
				code,
				name,
			};
			const res = await this.$fetch({
				method: 'POST',
				url: '/crm/bmemberbank/saveBank',
				data,
			});
			if (res && res.code == 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.loadData();
				this.bankCardModal.show = false;
			}
		},
		// 请求开户银行列表
		async loadData() {
			this.loading = true;
			const res = await this.$fetch(`/crm/bmemberbank/allBankList`);

			if (res && res.data) {
				if (!res.data) {
					this.$message.warning('搜索无数据，请检查查询条件');
				}
				this.data = res.data;
			} else {
				this.data = [];
				this.$message.warning('搜索无数据，请检查查询条件');
			}
			this.loading = false;
		},
	},
	mounted() {
		this.$nextTick(this.loadData);
	},
};
</script>
<style lang="scss" scoped>
.upload-gap {
	margin: 0 8px;
}
::v-deep .el-upload-list {
	width: 0 !important;
	height: 0 !important;
	border: 1px solid transparent !important;
	overflow: hidden !important;
}
</style>
