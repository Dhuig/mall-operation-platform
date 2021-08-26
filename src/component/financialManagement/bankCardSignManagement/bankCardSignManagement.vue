<template>
	<div class="bank-card-sign-management">
		<guideBar>
			<el-button v-permission="'bank_card_sign_management_export_excel'" type="primary" @click="batchExport">
				导出Excel
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="BANK_CARD_SIGN_MANAGEMENT_SEARCH" @search="handleSearch" />
		</el-card>
		<!-- 表格 -->
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="list"
				:columns="BANK_CARD_SIGN_MANAGEMENT_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope" v-if="scope.data.bindStatus == 0">
					<el-button
						v-permission="'bank_card_sign_management_change_mobile'"
						type="text"
						class="btns"
						@click="changePhone(scope.data)"
					>
						更换手机
					</el-button>
					<el-button
						v-permission="'bank_card_sign_management_terminate_contract'"
						type="text"
						class="btns"
						@click="breakContract(scope.data)"
					>
						解约操作
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 更换号码 -->
		<el-dialog title="提示" :visible.sync="editShow.show" width="500px">
			<el-form
				class="edit-wallet-balance"
				:model="editForm"
				ref="editForm"
				:rules="PHONE_VALIDATION"
				label-width="110px"
				label-position="right"
				label-suffix=":"
			>
				<div v-show="editShow.type === 'phone'">
					<el-form-item label="手机号码" prop="tel">
						<el-input v-model="editForm.tel" placeholder="请输入手机号码"></el-input>
					</el-form-item>
				</div>
				<div class="content" v-show="editShow.type === ''">{{ editShow.content }}</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editCacel('editForm')" class="cacel">取 消</el-button>
				<el-button type="primary" @click="editSave('editForm')" class="save">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {
	BANK_CARD_SIGN_MANAGEMENT_SEARCH,
	BANK_CARD_SIGN_MANAGEMENT_COLUMNS_CONFIG,
	PHONE_VALIDATION,
	BIND_STATUS,
	SIGN_BANK_TYPE_GUIDE,
} from './config';
import { optionGenerator, exportExcelPost } from 'util';
import { formatDateDefault, formatDate } from 'util/formValidation.js';
export default {
	name: 'bankCardSignManagement',
	data() {
		return {
			BANK_CARD_SIGN_MANAGEMENT_SEARCH,
			BANK_CARD_SIGN_MANAGEMENT_COLUMNS_CONFIG,
			PHONE_VALIDATION,
			BIND_STATUS,
			SIGN_BANK_TYPE_GUIDE,
			searchConfig: {},
			loading: false,
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 0,
			list: [],
			rowContent: {},
			editShow: {
				show: false,
				type: 'phone',
				content: '',
			},
			editForm: { tel: '' },
		};
	},
	methods: {
		// 导出excel
		batchExport() {
			const timeStr = formatDate(new Date().getTime());
			exportExcelPost(
				'/mgmt/fin/wallet/bank/exportFinWalletSignBankCard',
				this.loadDataPost,
				'银行卡签约信息列表_' + timeStr
			);
		},
		// 搜索
		handleSearch() {
			this.loadData();
		},
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
		// 更换手机操作
		changePhone(row) {
			this.rowContent = row;
			this.editShow = {
				show: true,
				type: 'phone',
			};
		},
		// 解约操作
		breakContract(row) {
			this.rowContent = row;
			this.editShow = {
				show: true,
				type: '',
				content: '您是否确认解除签约？',
			};
		},
		// 操作取消
		editCacel(formName) {
			this.$refs[formName].resetFields();
			this.editShow = {
				show: false,
				type: '',
				content: '',
			};
		},
		// 保存更改
		editSave(formName) {
			if (this.editShow.type == 'phone') {
				this.changePhonePost(formName);
			} else {
				this.breakContractFn(formName);
			}
		},
		// 修改手机号码方法
		changePhonePost(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const { id } = this.rowContent;
					const { tel } = this.editForm;
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/fin/wallet/bank/updateSignBankTel?id=${id}&tel=${tel}`,
					});
					if (res && res.code == 200) {
						this.$message.success('更换手机号码成功');
						this.loadData();
						this.editCacel(formName);
					} else {
						this.$message.error('更换手机号码失败');
					}
				} else {
					this.$message.warning('请输入正确的手机号码');
				}
			});
		},
		// 解约方法
		async breakContractFn(formName) {
			const { id } = this.rowContent;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/fin/wallet/bank/mgmtUnSignBankCard?id=${id}`,
			});
			if (res && res.code == 200) {
				this.loadData();
			} else {
				this.$message.error((res && res.data.message) || `操作失败`);
			}
			this.editCacel(formName);
		},
		// 获取字典映射
		async getDicts() {
			const [SIGN_BANK_TYPE] = await Promise.all([
				this.$getDict('SIGN_BANK_TYPE'),
				// this.$getDict('MEMBER_TYPE'),
			]);
			SIGN_BANK_TYPE && (this.BANK_CARD_SIGN_MANAGEMENT_SEARCH.form[3].options = optionGenerator(SIGN_BANK_TYPE));
			// MEMBER_TYPE && (this.BANK_CARD_SIGN_MANAGEMENT_SEARCH.form[6].options = optionGenerator(MEMBER_TYPE));
		},

		// 获取分公司编号
		async loadCompanyNo() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			this.BANK_CARD_SIGN_MANAGEMENT_SEARCH.form[0].options = serviceCompanyOptions.map(({ value }) => ({
				label: value,
				value,
			}));
		},
		// 获取列表数据
		async loadData() {
			this.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/bank/querySignFinWalletBank',
				data: this.loadDataPost,
				callback: () => {
					this.loading = false;
				},
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
			}
		},
	},
	computed: {
		loadDataPost() {
			const {
				searchConfig,
				pagination: { currentPage: pageNum, pageSize },
				SIGN_BANK_TYPE_GUIDE,
			} = this;
			let data = {
				...searchConfig,
				pageNum,
				pageSize,
			};
			data.createTime && (data.createTime = formatDateDefault(data.createTime));
			data.bankType && (data.bankType = SIGN_BANK_TYPE_GUIDE[data.bankType]);
			return data;
		},
	},
	created() {
		this.loadCompanyNo();
		this.loadData();
		this.getDicts();
	},
};
</script>

<style lang="scss" scoped>
::v-deep.bank-card-sign-management {
	.el-dialog {
		.content {
			text-align: center;
		}
		.el-dialog__footer {
			text-align: center;
		}
	}
}
</style>
