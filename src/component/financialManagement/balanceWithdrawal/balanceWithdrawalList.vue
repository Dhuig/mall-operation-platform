<template>
	<div class="finance-balance-list">
		<guideBar>
			<el-button v-permission="'finance_balance_list_batch_export'" type="primary" @click="exportExcel">
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="FINANCIAL_BALANCE_WITHDRAWAL_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<el-tabs v-model="active" @tab-click="handleTabChange">
				<el-tab-pane
					v-for="(item, index) in FINANCIAL_BALANCE_WITHDRAWAL_HEADER_CONFIG"
					:key="index"
					:label="item.name"
					:name="item.value"
					class="fade"
				>
					<div class="table-content">
						<tableList
							:ref="'multipleTable_' + item.value"
							:dataSource="FINANCIAL_BALANCE_WITHDRAWAL_DATA_CONFIG[item.prop].data"
							:columns="FINANCIAL_BALANCE_WITHDRAWAL_COLUMNS_CONFIG"
							:pagination="FINANCIAL_BALANCE_WITHDRAWAL_DATA_CONFIG[item.prop].pagination"
							:dataTotal="FINANCIAL_BALANCE_WITHDRAWAL_DATA_CONFIG[item.prop].total"
							:loading="loading"
							showSummary
							:summary-method="getSummaries"
							@handleChangePage="handleChangePage"
							@handleSizeChange="handleSizeChange"
							:slotcontent="slotcontent"
						>
							<template slot-scope="scope">
								<div>
									<el-button
										v-permission="'finance_balance_withdrawal_list_audit'"
										v-show="scope.data.status == 1"
										type="text"
										@click="handleBtnsGruop(scope.data, 'examine')"
									>
										审核
									</el-button>
									<div v-if="scope.data.status == 2 && scope.data.transferStatus < 4">
										<el-button
											type="text"
											v-permission="'finance_balance_list_success'"
											@click="handleBtnsGruop(scope.data, 'success')"
										>
											汇款成功
										</el-button>
										<el-button
											type="text"
											v-permission="'finance_balance_list_failed'"
											@click="handleBtnsGruop(scope.data, 'fail')"
										>
											汇款失败
										</el-button>
										<el-button
											type="text"
											v-permission="'finance_balance_list_reset'"
											@click="revokeWithdrawal(scope.data)"
										>
											撤销提现
										</el-button>
									</div>
								</div>
							</template>
						</tableList>
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<el-dialog center :visible.sync="remittancePop.show" width="500px">
			<div class="remittance-content">{{ remittancePop.content }}</div>
			<el-form ref="ruleForm" :model="ruleForm" :rules="formRules" label-width="100px" label-suffix=":">
				<el-form-item label="备注" prop="remittanceRemark">
					<el-input type="textarea" v-model="ruleForm.remittanceRemark" />
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cacel('ruleForm')" class="cacel">取消</el-button>
				<el-button type="primary" @click="save('ruleForm')" class="save">确认</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {
	FINANCIAL_BALANCE_WITHDRAWAL_CONFIG,
	FINANCIAL_BALANCE_WITHDRAWAL_HEADER_CONFIG,
	FINANCIAL_BALANCE_WITHDRAWAL_COLUMNS_CONFIG,
	FINANCIAL_BALANCE_WITHDRAWAL_DATA_CONFIG,
	REMIND_POP_TYPE,
	TRANSFER_STATUS,
} from './config.js';
import { exportExcelPost } from 'util';
import { formatDate } from 'util/formValidation.js';
let ruleOne = { required: true, message: '请输入备注', trigger: 'blur' }; // 用于动态验证规则
export default {
	name: 'balanceWithdrawalList',
	data() {
		return {
			FINANCIAL_BALANCE_WITHDRAWAL_CONFIG,
			FINANCIAL_BALANCE_WITHDRAWAL_HEADER_CONFIG,
			FINANCIAL_BALANCE_WITHDRAWAL_COLUMNS_CONFIG,
			FINANCIAL_BALANCE_WITHDRAWAL_COLUMNS_LAST_CONFIG: '',
			searchConfig: { cardNo: '', mobile: '', realname: '', companyCode: '', timerange: '' },
			FINANCIAL_BALANCE_WITHDRAWAL_DATA_CONFIG,
			REMIND_POP_TYPE,
			TRANSFER_STATUS,
			summaryData: {}, // 合计数据
			active: '0',
			activeIndex: 0,
			remindType: '',
			rowContent: {},
			slotcontent: true,
			loading: false,
			remittancePop: {
				show: false,
				content: '',
			},
			ruleForm: {},
			formRules: {
				remittanceRemark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
			},
		};
	},
	methods: {
		// 批量导出
		exportExcel() {
			const timeStr = formatDate(new Date().getTime());
			exportExcelPost('/mgmt/fin/wallet/exportWithdrawList', this.listDataPost, '余额提现审批列表_' + timeStr);
		},
		// 汇款成功/失败/撤销提现操作
		handleBtnsGruop(row, handleType) {
			this.remindType = handleType;
			this.rowContent = row;
			const { REMIND_POP_TYPE } = this;
			if (handleType in REMIND_POP_TYPE) {
				this.remittancePop = {
					show: true,
					content: REMIND_POP_TYPE[handleType].message,
				};
				ruleOne.required = handleType == 'fail';
				this.formRules.remittanceRemark.splice(0, 1, ruleOne);
			} else {
				this.$go('finance_balance_detail', { id: row.walletWithdrawId });
			}
		},
		// 查询事件
		handleSearch() {
			const { FINANCIAL_BALANCE_WITHDRAWAL_HEADER_CONFIG, activeIndex } = this;
			this.FINANCIAL_BALANCE_WITHDRAWAL_DATA_CONFIG[
				FINANCIAL_BALANCE_WITHDRAWAL_HEADER_CONFIG[activeIndex].prop
			].pagination.currentPage = 1;
			this.updateList();
		},
		// tab切换
		handleTabChange(tab) {
			console.log('tab', tab.name);
			this.active = tab.name;
			this.activeIndex = tab.index;
			this.updateList();
		},
		// 分页触发事件
		handleChangePage(page) {
			const { FINANCIAL_BALANCE_WITHDRAWAL_HEADER_CONFIG, activeIndex } = this;
			this.FINANCIAL_BALANCE_WITHDRAWAL_DATA_CONFIG[
				FINANCIAL_BALANCE_WITHDRAWAL_HEADER_CONFIG[activeIndex].prop
			].pagination.currentPage = page;
			this.loadData();
		},
		// 分页下拉触发事件
		handleSizeChange(pageSize) {
			const { FINANCIAL_BALANCE_WITHDRAWAL_HEADER_CONFIG, activeIndex } = this;
			this.FINANCIAL_BALANCE_WITHDRAWAL_DATA_CONFIG[
				FINANCIAL_BALANCE_WITHDRAWAL_HEADER_CONFIG[activeIndex].prop
			].pagination = {
				currentPage: 1,
				pageSize: pageSize,
			};
			this.loadData();
		},
		cacel(formName) {
			this.$refs[formName].resetFields();
			this.remittancePop = {
				show: false,
				content: '',
			};
		},
		// 保存汇款成功/失败
		save(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					let data = {
						...this.postData,
					};
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/fin/wallet/auditTransferWithdraw',
						data,
					});
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.updateList();
						this.cacel(formName);
					} else {
						this.$message.error('操作失败');
					}
				}
			});
		},
		//撤销提现
		revokeWithdrawal(row) {
			this.$confirm('是否已确认撤销提现？', '提示')
				.then(async () => {
					const { walletWithdrawId } = row;
					let data = {
						...this.postData,
						status: 6,
						walletWithdrawId,
					};
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/fin/wallet/auditWithdraw',
						data,
					});
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.updateList();
					} else {
						this.$message.error('操作失败');
					}
				})
				.catch(() => {});
		},
		// 合计
		getSummaries() {
			const { summaryData } = this;
			const sums = [];
			if (summaryData) {
				FINANCIAL_BALANCE_WITHDRAWAL_COLUMNS_CONFIG.forEach((column, index) => {
					if (column.summary) {
						const prop = `sum${column.prop.charAt(0).toUpperCase() + column.prop.slice(1)}`;
						sums[index] = prop in summaryData ? '￥' + summaryData[prop] : '';
					} else {
						sums[index] = '';
					}
				});
			}
			sums.splice(0, 1);
			this.$nextTick(() => {
				this.$refs[`multipleTable_${this.active}`][0].$children[0].doLayout();
			});
			return [`合计:`, ...sums];
		},
		// 获取列表总计
		async loadDataSum() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/getWalletWithdrawTotalAmt',
				data: this.listDataPost,
			});
			if (res && res.data) {
				this.summaryData = { ...res.data };
			} else {
				this.$message.error('获取列表总计数据失败');
			}
		},
		// 获取列表数据
		async loadData() {
			this.loading = true;
			let res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/getWithdrawList',
				data: this.listDataPost,
				callback: () => {
					this.loading = false;
				},
			});
			if (res && res.data) {
				const { list, total } = res.data;
				const { FINANCIAL_BALANCE_WITHDRAWAL_HEADER_CONFIG, activeIndex } = this;
				this.FINANCIAL_BALANCE_WITHDRAWAL_DATA_CONFIG[
					FINANCIAL_BALANCE_WITHDRAWAL_HEADER_CONFIG[activeIndex].prop
				].data = list;
				this.FINANCIAL_BALANCE_WITHDRAWAL_DATA_CONFIG[
					FINANCIAL_BALANCE_WITHDRAWAL_HEADER_CONFIG[activeIndex].prop
				].total = total;
				if (total == 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
		// 判断数组中是否存在元素
		isExist(arr, item) {
			return JSON.stringify(arr).indexOf(JSON.stringify(item)) >= 0 ? true : false;
		},
		updateList() {
			this.loadData();
			this.loadDataSum();
		},
	},
	computed: {
		postData() {
			let {
				rowContent,
				remindType,
				TRANSFER_STATUS,
				ruleForm: { remittanceRemark },
			} = this;
			let data = {
				auditRemark: '',
				remittanceRemark,
				status: rowContent.status,
				transferStatus: TRANSFER_STATUS[remindType] || null,
				walletWithdrawId: rowContent.walletWithdrawId,
			};
			return data;
		},
		listDataPost() {
			const {
				searchConfig,
				FINANCIAL_BALANCE_WITHDRAWAL_DATA_CONFIG,
				activeIndex,
				FINANCIAL_BALANCE_WITHDRAWAL_HEADER_CONFIG,
			} = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = FINANCIAL_BALANCE_WITHDRAWAL_DATA_CONFIG[FINANCIAL_BALANCE_WITHDRAWAL_HEADER_CONFIG[activeIndex].prop];
			let data = {
				...searchConfig,
				withdrawStatus: Number(this.active),
				pageNum,
				pageSize,
			};
			if (searchConfig.timerange) {
				data.applyEndTime = searchConfig.timerange[1] ? formatDate(searchConfig.timerange[1]) : null;
				data.applyStartTime = searchConfig.timerange[0] ? formatDate(searchConfig.timerange[0]) : null;
				delete data.timerange;
			}
			return data;
		},
	},
	watch: {
		active(newVal) {
			this.slotcontent = newVal > 2 ? false : true;
		},
	},
	mounted() {
		this.updateList();
		this.$listen('UPDATE_WITHDRAWAL_LIST', this.updateList);
	},
};
</script>
<style lang="scss" scoped>
.finance-balance-list {
	padding-top: 10px;
	.remittance-content {
		text-align: center;
		margin-bottom: 16px;
	}
}
</style>
