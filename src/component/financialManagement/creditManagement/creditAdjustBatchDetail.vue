<template>
	<div class="credit-adjust-batch-detail">
		<guideBar>
			<el-button @click="batchDelete" icon="el-icon-delete">批量删除</el-button>
			<el-button type="success" @click="addAdjust" icon="el-icon-edit">新增调整</el-button>
			<el-button @click="batchReject" icon="el-icon-close">批量驳回</el-button>
			<el-button type="primary" @click="batchExport" icon="el-icon-download">批量导出</el-button>
			<el-button type="primary" @click="batchImport" icon="el-icon-upload2">批量导入</el-button>
			<!-- <el-upload
				ref="uploadDom"
				action="/mgmt/fin/wallet/credit/importAdjustBatchDetail"
				:http-request="uploadCustom"
				:show-file-list="false"
				class="ml10"
				><el-button type="primary">批量导入</el-button></el-upload
			> -->
		</guideBar>

		<el-card class="box-card">
			<searchPanel v-model="searchConfig" :config="CREDIT_ADJUST_BATCH_DETAIL_SEARCH" @search="handleSearch" />
		</el-card>
		<el-card class="box-card">
			<tableList
				border
				:loading="loading"
				:dataSource="list"
				:columns="CREDIT_ADJUST_BATCH_DETAIL_COLUMNS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="{ selection: true }"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				@handleSelectionChange="handleSelectionChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button type="text" class="btns" @click="deleteOne(scope.data)">删除</el-button>
					<el-button type="text" class="btns" @click="edit(scope.data)">修改</el-button>
					<el-button type="text" class="btns" @click="reject(scope.data)">驳回</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 修改 -->
		<el-dialog v-drag :title="editDialogTitle" :visible.sync="editDialog.show" top="5vh" width="600px">
			<el-form
				class="edit-pop"
				:model="editForm"
				ref="editForm"
				label-width="150px"
				label-position="right"
				label-suffix=":"
			>
				<el-form-item label="调整批次号" prop="adjustBatchNo">
					<el-input v-model="editForm.adjustBatchNo" disabled />
				</el-form-item>
				<el-form-item label="会员卡号" prop="cardNo">
					<el-input v-model="editForm.cardNo" :disabled="editDialog.type == 'edit'" />
				</el-form-item>
				<el-form-item label="本次扣减信用额" prop="reduceAmount">
					<el-input v-model="editForm.reduceAmount" />
				</el-form-item>
				<el-form-item label="本次增加信用额" prop="increaseAmount">
					<el-input v-model="editForm.increaseAmount" />
				</el-form-item>
				<el-form-item label="扣减时间" prop="reduceTime">
					<el-date-picker
						v-model="editForm.reduceTime"
						type="datetime"
						placeholder="选择日期时间"
						disabled
					></el-date-picker>
				</el-form-item>
				<el-form-item label="增加时间" prop="increaseTime">
					<el-date-picker
						v-model="editForm.increaseTime"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						disabled
					></el-date-picker>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editCacel('editForm')" class="cacel">取 消</el-button>
				<el-button type="primary" @click="editSave('editForm')" class="save">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { formatDate } from 'util/formValidation.js';
import { CREDIT_ADJUST_BATCH_DETAIL_SEARCH, CREDIT_ADJUST_BATCH_DETAIL_COLUMNS } from './config.js';
import { exportExcelPost } from '../../../util/index.js';
export default {
	name: 'creditAdjustBatchDetail',
	data() {
		return {
			CREDIT_ADJUST_BATCH_DETAIL_SEARCH,
			CREDIT_ADJUST_BATCH_DETAIL_COLUMNS,
			creditAdjustBatchId: '',
			auditStatus: '', //批次审核状态
			batchStatus: '', //批次状态
			searchConfig: {},
			loading: false,
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
				reduceAmount: '',
				increaseAmount: '',
				reduceTime: '',
				increaseTime: '',
			},
		};
	},
	computed: {
		userType() {
			return JSON.parse(localStorage.getItem('userInfo')).userType;
		},
		loadDataPost() {
			const {
				searchConfig,
				pagination: { currentPage, pageSize },
				creditAdjustBatchId,
			} = this;
			let data = {
				...searchConfig,
				creditAdjustBatchId,
				pageNum: currentPage,
				pageSize,
			};
			return data;
		},
		editDialogTitle() {
			const { type } = this.editDialog;
			let title;
			switch (type) {
				case 'add':
					title = '新建调整';
					break;
				case 'edit':
					title = '修改调整';
					break;
				default:
					title = '修改调整';
			}
			return title;
		},
		selectedIds() {
			const idArr = this.selectedRows.map((item) => {
				return item.creditAdjustBatchdetailId;
			});
			return idArr;
		},
		editFormData() {
			const { adjustBatchNo } = this.editForm;
			let data = {
				...this.editForm,
				creditAdjustBatchNo: adjustBatchNo,
			};
			if (data.reduceTime) {
				data.reduceTime = formatDate(data.reduceTime);
			}
			if (data.increaseTime) {
				data.increaseStartTime = data.increaseTime[0];
				data.increaseEndTime = data.increaseTime[1];
			}
			return data;
		},
		showDelBtn() {
			const { auditStatus, batchStatus } = this;
			return !(auditStatus == 2 && batchStatus == 2);
		},
		showRejectBtn() {
			return this.auditStatus == 1;
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
		// 新增调整
		addAdjust() {
			this.editDialog = { show: true, type: 'add' };
		},
		// 批量驳回
		batchReject() {
			this.$confirm('是否确认驳回？', '提示')
				.then(() => {
					if (this.selectedIds.length == 0) {
						return this.$message.warning('请至少选择一项');
					}
					this.rejectFn(this.selectedIds);
				})
				.catch(() => {});
		},
		// 批量导出
		batchExport() {
			const timeStr = formatDate(new Date().getTime());
			exportExcelPost(
				'/mgmt/fin/wallet/credit/exportAdjustBatchDetail',
				this.loadDataPost,
				`信用额调整批次详情列表${timeStr}`
			);
		},
		// 批量导入
		batchImport() {
			const info = {
				downloadUrl: 'https://uc.oss.perfect99.com/mall-center-product/20201225145252VynXs.xlsx',
				uploadUrl: '/mgmt/fin/wallet/credit/importAdjustBatchDetail',
				downloadFailUrl: '/mgmt/fin/wallet/credit/exportBatchdtlMessage',
			};
			this.$go('credit_adjust_batch_import', { info });
		},

		// 批量导入 - 自定义上传
		async uploadCustom(file) {
			console.log(123, file);
			const data = new FormData();
			data.append('file', file.file);
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/credit/importAdjustBatchDetail',
				data,
			});
			if (res && res.code === 200) {
				this.$message.success('上传成功');
				this.loadData();
			} else {
				this.$message.error('上传失败');
			}
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
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
		},
		// 删除
		deleteOne(row) {
			this.$confirm('是否确认删除？', '提示')
				.then(() => {
					this.deleteFn([row.creditAdjustBatchdetailId]);
				})
				.catch(() => {
					console.log('quexiao');
				});
		},
		// 修改
		edit(row) {
			this.editDialog = { show: true, type: 'edit' };
			const { cardNo, reduceAmount, increaseAmount, creditAdjustBatchdetailId } = row;
			this.$nextTick(() => {
				this.editForm = { ...this.editForm, cardNo, reduceAmount, increaseAmount, creditAdjustBatchdetailId };
			});
		},
		// 驳回
		reject(row) {
			this.$confirm('是否确认驳回？', '提示')
				.then(() => {
					this.rejectFn([row.creditAdjustBatchdetailId]);
				})
				.catch(() => {
					console.log('quexiao');
				});
		},
		// 取消修改
		editCacel(formName) {
			this.$refs[formName].resetFields();
			this.editDialog.show = false;
		},
		// 确认修改/新增
		async editSave(formName) {
			const { type } = this.editDialog;
			const url = {
				add: '/mgmt/fin/wallet/credit/addAdjustBatchDetail',
				edit: '/mgmt/fin/wallet/credit/updateAdjustBatchDetail',
			};
			if (type == 'add') {
				delete this.editFormData.creditAdjustBatchdetailId;
			}
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
				this.$message.error('操作失败');
			}
		},
		// 驳回调用方法
		async rejectFn(params) {
			const data = [...params];
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/credit/rejectAdjustBatchDetail',
				data: { batchdtlIdList: data },
			});
			if (res && res.code === 200) {
				this.$message.success('操作成功');
				this.loadData();
			} else {
				this.$message.error('操作失败');
			}
		},
		// 删除调用方法
		async deleteFn(params) {
			const data = [...params];
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/credit/deleteAdjustBatchDetail',
				data: { batchdtlIdList: data },
			});
			if (res && res.code === 200) {
				this.$message.success('操作成功');
				this.loadData();
			} else {
				this.$message.error('操作失败');
			}
		},
		// 通过id获取调整批次信息
		async loadAdjustBatchById() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/fin/wallet/credit/queryAdjustBatch?id=${this.creditAdjustBatchId}`,
			});
			if (res && res.data) {
				const { increaseTime } = res.data;
				res.data.increaseTime = increaseTime ? increaseTime.split('至') : '';
				this.editForm = { ...this.editForm, ...res.data };
				this.auditStatus = res.data.auditStatus;
				this.batchStatus = res.data.batchStatus;
			} else {
				this.$message.error('获取调整批次信息失败');
			}
		},
		// 获取详情列表数据
		async loadData() {
			this.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/credit/getAdjustBatchDetail',
				data: this.loadDataPost,
			});
			this.loading = false;
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
				if (total == 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取详情列表数据失败');
			}
		},
	},
	mounted() {
		const { id } = this.$route.query;
		if (id) {
			this.creditAdjustBatchId = id;
		}
		this.loadData();
		this.loadAdjustBatchById();
	},
};
</script>

<style lang="scss" scoped>
::v-deep.credit-adjust-batch-detail {
	.box-card {
		margin-bottom: 16px;
	}
	.ml10 {
		margin-left: 10px;
	}
	.edit-pop {
		.flex {
			width: 80%;
		}
		.el-input__inner,
		.el-date-editor {
			width: 100%;
		}
	}
	.el-dialog__footer {
		text-align: center;
	}
}
</style>