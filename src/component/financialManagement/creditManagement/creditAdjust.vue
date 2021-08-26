<template>
	<div class="credit-adjust">
		<guideBar>
			<!-- <el-button v-permission="'credit_adjust_batch_delete'" @click="batchDelete" icon="el-icon-delete">
				批量删除
			</el-button> -->
			<el-button v-permission="'credit_adjust_adjust'" type="success" @click="addAdjust" icon="el-icon-edit">
				新增/调整
			</el-button>
			<el-button v-permission="'credit_adjust_batch_submit'" @click="batchSubmitAudit" icon="el-icon-document-copy">
				批量提交审核
			</el-button>
			<el-button v-permission="'credit_adjust_batch_import'" type="primary" @click="batchImport" icon="el-icon-upload2">
				批量导入
			</el-button>
			<el-button v-permission="'credit_adjust_batch_audit'" @click="batchCheck" icon="el-icon-s-order">
				批量审核
			</el-button>
			<el-button
				v-permission="'credit_adjust_batch_export'"
				type="primary"
				@click="batchExport"
				icon="el-icon-download"
			>
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="CREDIT_ADJUST_SEARCH" @search="handleSearch" />
		</el-card>
		<!-- 表格 -->
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="list"
				:columns="CREDIT_ADJUST_COLUMNS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="{ selection: true, index: true, labelIndex: '序号' }"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				@handleSelectionChange="handleSelectionChange"
				slotcontent
			>
				<template slot-scope="scope">
					<template v-if="scope.data.auditStatus == 7">
						<el-button v-permission="'credit_adjust_submit_or_modify'" type="text" @click="submitToBeAudit(scope.data)">
							提交审核
						</el-button>
						<el-button v-permission="'credit_adjust_submit_or_modify'" type="text" @click="edit(scope.data)">
							修改
						</el-button>
					</template>
					<el-button
						type="text"
						@click="deleteOne(scope.data)"
						v-permission="'credit_adjust_delete'"
						v-if="scope.data.auditStatus == 7"
					>
						删除
					</el-button>
					<el-button
						v-permission="'credit_adjust_audit'"
						type="text"
						@click="check(scope.data)"
						v-if="scope.data.auditStatus == 1"
					>
						审核
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 新增/修改 -->
		<el-dialog :title="editDialogTitle" :visible.sync="editDialog.show" width="500px">
			<el-form
				class="edit-pop"
				:model="editForm"
				ref="editForm"
				:rules="CREDIT_ADJUST_EDIT_RULES"
				label-width="150px"
				label-position="right"
				label-suffix=":"
			>
				<el-form-item label="会员卡号" prop="cardNo">
					<el-input
						v-model="editForm.cardNo"
						placeholder="请输入会员卡号"
						:disabled="isEdit"
						@change="loadCreditInfoByCardNo"
					/>
				</el-form-item>
				<el-form-item label="顾客姓名" prop="realname">
					<el-input v-model="editForm.realname" placeholder="请输入顾客姓名" disabled />
				</el-form-item>
				<el-form-item label="现有信用额" prop="creditAmount">
					<el-input v-model="editForm.creditAmount" placeholder="请输入现有信用额" disabled />
				</el-form-item>
				<el-form-item label="调整/新增信用额" prop="applyAmount">
					<el-input v-model="editForm.applyAmount" placeholder="请输入调整/新增信用额" />
				</el-form-item>
				<el-form-item label="是否分期还款" prop="instalment">
					<el-select v-model="editForm.instalment" placeholder="请选择是否分期还款">
						<el-option label="是" :value="1"></el-option>
						<el-option label="否" :value="0"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editCacel('editForm')" class="cacel">取消</el-button>
				<el-button type="primary" :loading="btnLoading" @click="editSaveSubmit('editForm')" class="cacel">
					确认并提交
				</el-button>
				<el-button type="primary" :loading="btnLoading" @click="editSave('editForm')" class="save">确定</el-button>
			</span>
		</el-dialog>
		<!-- 审核 -->
		<el-dialog title="审核" :visible.sync="auditDialogVisible" width="500px">
			<el-form
				class="edit-batch"
				:model="auditForm"
				ref="auditForm"
				:rules="auditRules"
				label-width="110px"
				label-position="right"
				label-suffix=":"
			>
				<div class="flex">
					<el-form-item label="审核结果" prop="auditStatus" required>
						<el-select v-model="auditForm.auditStatus" placeholder="请选择">
							<el-option
								v-for="item in checkOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="备注" prop="auditRemark">
						<el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="auditForm.auditRemark"></el-input>
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="auditCacel('auditForm')" class="cacel">取 消</el-button>
				<el-button type="primary" @click="auditSave('auditForm')" class="save">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { formatDate } from 'util/formValidation.js';
import {
	CREDIT_ADJUST_SEARCH,
	CREDIT_ADJUST_COLUMNS,
	CREDIT_ADJUST_EDIT_OPTIONS,
	CREDIT_ADJUST_EDIT_RULES,
} from './config.js';
import { exportExcelPost } from 'util/index.js';
export default {
	name: 'creditAdjust',
	data() {
		return {
			CREDIT_ADJUST_SEARCH,
			CREDIT_ADJUST_COLUMNS,
			CREDIT_ADJUST_EDIT_OPTIONS,
			CREDIT_ADJUST_EDIT_RULES,
			searchConfig: {},
			loading: false,
			btnLoading: false,
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 0,
			list: [],
			selectedRows: [],
			editDialog: { show: false, type: 'add' },
			editForm: {
				cardNo: '',
				applyAmount: '',
				instalment: 0, // 默认为否
			},
			auditDialogVisible: false,
			auditForm: {
				auditStatus: '',
				auditRemark: '',
			},
			auditRules: {
				auditStatus: [{ required: true, message: '请选择审核结果', trigger: 'blur' }],
			},
			checkOptions: [
				{ value: 2, label: '审核通过' },
				{ value: 3, label: '审核不通过' },
			],
		};
	},
	watch: {
		'searchConfig.storeCode'(val) {
			if (/^\d{6,}$/.test(val)) {
				this.getCardNoByStoreCode();
			}
		},
	},
	computed: {
		loadDataPost() {
			const {
				searchConfig,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			let data = {
				...searchConfig,
				pageNum,
				pageSize,
			};
			if (data.effectTime) {
				data.effectStartTime = formatDate(data.effectTime[0]);
				data.effectEndTime = formatDate(data.effectTime[1]);
			}
			for (let index in data) {
				if (data[index] == '') {
					data[index] = null;
				}
			}
			return data;
		},
		editDialogTitle() {
			const { type } = this.editDialog;
			let title;
			switch (type) {
				case 'add':
					title = '新增';
					break;
				case 'edit':
					title = '修改';
					break;
				default:
					title = '修改';
			}
			return title;
		},
		isEdit() {
			return this.editDialog.type == 'edit';
		},
		editFormData() {
			const { editForm } = this;
			editForm.applyAmount = Number(editForm.applyAmount);
			return {
				...editForm,
			};
		},
		selectedIds() {
			const idArr = this.selectedRows.map(item => {
				return item.walletCreditApplyId;
			});
			return idArr;
		},
		// 修改后信用额
		afterEditCrdit() {
			const { applyAmount, creditAmount } = this.editForm;
			return Number(applyAmount) + Number(creditAmount);
		},
	},
	methods: {
		// 批量删除
		batchDelete() {
			this.$confirm('是否确认删除？', '提示')
				.then(() => {
					if (this.selectedIds.length == 0) {
						return this.$message.warning('请至少选择一项');
					}
					this.deleteFn(this.selectedIds);
				})
				.catch(() => {});
		},
		// 新增/调整
		addAdjust() {
			this.editDialog = { show: true, type: 'add' };
			// this.editForm = {
			// 	cardNo: '',
			// 	applyAmount: '',
			// };
			// if (this.$refs['editForm']) {
			// 	this.$refs['editForm'].resetFields();
			// }
		},
		// 批量提交审核
		batchSubmitAudit() {
			this.$confirm('是否确认提交审核？', '提示')
				.then(() => {
					if (this.selectedIds.length == 0) {
						return this.$message.warning('请至少选择一项');
					}
					this.submitAuditFn(this.selectedIds);
				})
				.catch(() => {});
		},
		// 批量审核
		batchCheck() {
			this.auditDialogVisible = true;
		},
		// 批量导出
		batchExport() {
			const timeStr = formatDate(new Date().getTime());
			exportExcelPost('/mgmt/fin/wallet/credit/exportApplyList', this.loadDataPost, `顾客信用额申请列表${timeStr}`, {
				timeout: 2 * 60000,
			});
		},
		// 批量导入
		batchImport() {
			const info = {
				downloadUrl: '/mgmt/fin/wallet/credit/exportCreditApplyTemplate',
				uploadUrl: '/mgmt/fin/wallet/credit/importApply',
				downloadFailUrl: '/mgmt/fin/wallet/credit/exportCreditApplyErrorMsg',
			};
			this.$go('credit_adjust_batch_import', { info });
		},
		// 获取会员卡号
		async getCardNoByStoreCode() {
			const { storeCode } = this.searchConfig;
			if (!storeCode) return;
			const res = await this.$fetch('/mgmt/fin/wallet/getCardNoByStoreCode?storeCode=' + storeCode);
			if (res && res.code == 200) {
				this.searchConfig.cardNo = res.data;
			} else {
				this.$message.error('获取会员卡号失败');
			}
		},
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
		},
		// 翻页操作
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 选择数据行
		handleSelectionChange(data) {
			this.selectedRows = [...data];
		},
		// 提交审核操作
		submitToBeAudit(row) {
			this.$confirm('是否确认提交审核？', '提示')
				.then(() => {
					this.submitAuditFn([row.walletCreditApplyId]);
				})
				.catch(() => {});
		},
		//修改
		edit(row) {
			this.editDialog = { show: true, type: 'edit' };
			this.$nextTick(() => {
				const { currentApplyAmount, walletCreditApplyId } = row;
				this.editForm = {
					...row,
					creditAmount: currentApplyAmount,
					creditApplyId: walletCreditApplyId,
				};
			});
		},
		// 删除行
		deleteOne(row) {
			this.$confirm('是否确认删除？', '提示')
				.then(() => {
					this.deleteFn([row.walletCreditApplyId]);
				})
				.catch(() => {});
		},
		// 审核
		check(row) {
			this.auditDialogVisible = true;
			this.selectedRows = [row];
		},
		// 新增/修改取消
		editCacel(formName) {
			this.$refs[formName].resetFields();
			this.editDialog.show = false;
		},
		// 新增/修改保存并提交
		editSaveSubmit(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					this.addOrEditFn(formName, true);
				}
			});
		},
		// 新增/修改保存
		editSave(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					this.addOrEditFn(formName);
				}
			});
		},
		// 取消审核
		auditCacel(formName) {
			this.$refs[formName].resetFields();
			this.auditDialogVisible = false;
		},
		// 确定审核
		auditSave(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					if (this.selectedIds.length == 0) {
						return this.$message.warning('请至少选择一项');
					}
					this.auditFn(this.selectedIds);
					this.$refs[formName].resetFields();
				}
			});
		},
		async loadCreditInfoByCardNo() {
			const { cardNo } = this.editForm;
			if (!cardNo) return this.$message.warning('请输入会员卡号');
			const res = await this.$fetch(`/mgmt/fin/wallet/getCreditAmountByCardNo?cardNo=${cardNo}`);
			if (res && res.code === 200 && res.data) {
				this.editForm = { ...this.editForm, ...res.data };
				this.$refs['editForm'].resetFields();
			} else {
				this.$message.error('获取顾客信用额信息失败');
			}
		},
		// 批量导入 - 自定义上传
		async uploadCustom(file) {
			console.log(123, file);
			const data = new FormData();
			data.append('file', file.file);
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/credit/importApply',
				data,
			});
			if (res && res.code === 200) {
				this.$message.success('上传成功');
				this.loadData();
			} else {
				this.$message.error('上传失败');
			}
		},
		// 新增/修改调用方法
		async addOrEditFn(formName, issubmit = false) {
			if (this.afterEditCrdit < 0) return this.$message.warning('顾客调整后的信用额小于0，请重新输入');
			const url = {
				add: '/mgmt/fin/wallet/credit/addApply',
				edit: '/mgmt/fin/wallet/credit/updateApply',
			};
			const { type } = this.editDialog;
			if (type == 'add') {
				delete this.editForm.creditApplyId;
			}
			this.editForm.isCommit = Number(issubmit);
			this.btnLoading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: url[type],
				data: this.editFormData,
			});
			if (res && res.code === 200) {
				this.$message.success('操作成功');
				this.loadData();
				this.$refs[formName].resetFields();
				this.editDialog.show = false;
			} else {
				this.$message.error((res && res.data.message) || '操作失败');
			}
			this.btnLoading = false;
		},
		// 删除/批量删除调用方法
		async deleteFn(params) {
			const data = [...params];
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/credit/deleteApply',
				data: { walletCreditApplyIdList: data },
			});
			if (res && res.code === 200) {
				this.$message.success('操作成功');
				this.loadData();
			} else {
				this.$message.error((res && res.data.message) || '操作失败');
			}
		},
		// 提交审核调用方法
		async submitAuditFn(params) {
			const data = {
				auditStatus: 1,
				walletCreditApplyIdList: [...params],
			};
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/credit/submitApply',
				data,
			});
			if (res && res.code === 200) {
				this.$message.success('操作成功');
				this.loadData();
			} else {
				this.$message.error((res && res.data.message) || '操作失败');
			}
		},
		// 审核调用方法
		async auditFn(params) {
			const data = { ...this.auditForm, walletCreditApplyIdList: [...params] };
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/credit/auditApply',
				data,
			});
			if (res && res.code === 200) {
				this.$message.success('操作成功');
				this.loadData();
				this.auditDialogVisible = false;
				this.selectedRows.length = 0;
			} else {
				this.$message.error((res && res.data.message) || '操作失败');
			}
		},
		// 获取列表数据
		async loadData() {
			this.loading = true;
			this.list = [];
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/credit/getApplyList',
				data: this.loadDataPost,
				callback: () => {
					this.loading = false;
				},
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
				if (total == 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取信用额调整批次数据失败');
			}
		},
	},
	mounted() {
		this.loadData();
	},
};
</script>

<style lang="scss" scoped>
::v-deep.credit-adjust {
	.ml10 {
		margin-left: 10px;
	}
	.edit-pop {
		.flex {
			width: 80%;
		}
		.el-select {
			width: 100%;
		}
	}
	.edit-batch {
		.el-input__inner,
		.el-date-editor,
		.el-select {
			width: 100%;
		}
	}
	.el-dialog__footer {
		text-align: center;
	}
}
</style>
