<template>
	<div class="credit-adjust-batch-management">
		<guideBar>
			<el-button v-permission="'credit_adjust_batch_management_add'" type="primary" @click="addBatch">
				新建批次
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="CREDIT_ADJUST_BATCH_MANAGEMENT_SEARCH" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				:dataSource="list"
				:columns="CREDIT_ADJUST_BATCH_MANAGEMENT_COLUMNS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="{ index: true, labelIndex: '编号' }"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<template v-permission="'credit_adjust_batch_management_modify'" v-if="scope.data.auditStatus == 7">
						<el-button type="text" class="btns" @click="deleteOne(scope.data)">删除</el-button>
						<el-button type="text" class="btns" @click="edit(scope.data)">修改</el-button>
					</template>
					<el-button
						v-permission="'credit_adjust_batch_management_detail'"
						type="text"
						class="btns"
						@click="detail(scope.data)"
					>
						详情
					</el-button>
					<el-button
						v-permission="'credit_adjust_batch_management_submit'"
						type="text"
						class="btns"
						@click="submitToAudit(scope.data)"
						v-if="scope.data.auditStatus == 7"
					>
						提交审核
					</el-button>
					<el-button
						type="text"
						class="btns"
						@click="pushMessage(scope.data)"
						v-if="scope.data.auditStatus == 2"
						:disabled="Boolean(scope.data.sendMsgStatus)"
						v-permission="'credit_adjust_batch_management_push'"
					>
						推送消息
					</el-button>
					<el-button
						v-permission="'credit_adjust_batch_management_audit'"
						type="text"
						class="btns"
						@click="tobeAudit(scope.data)"
						v-if="scope.data.auditStatus == 1"
					>
						审核
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 修改批次 -->
		<el-dialog :title="batchDialogTile" :visible.sync="batchDialog.show" width="600px">
			<el-form
				class="edit-batch"
				:model="editBatchForm"
				ref="editBatchForm"
				label-width="110px"
				label-position="right"
				label-suffix=":"
			>
				<div class="flex" v-if="batchDialog.type == 'edit'">
					<el-form-item label="批次号" prop="adjustBatchNo">
						<el-input size="medium" :value="editBatchForm.adjustBatchNo" :disabled="true" />
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="扣减时间" prop="reduceTime">
						<el-date-picker
							v-model="editBatchForm.reduceTime"
							prefix-icon="el-icon-date"
							type="datetime"
							value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="选择日期时间"
						></el-date-picker>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="还款时间" prop="addTimerange">
						<el-date-picker
							v-model="editBatchForm.addTimerange"
							prefix-icon="el-icon-date"
							type="datetimerange"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="yyyy-MM-dd HH:mm:ss"
						></el-date-picker>
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editBatchCacel('editBatchForm')" class="cacel">取 消</el-button>
				<el-button type="primary" @click="editBatchSave('editBatchForm')" class="save">确定</el-button>
			</span>
		</el-dialog>
		<!-- 审核 -->
		<el-dialog title="审核" :visible.sync="auditDialogVisible" width="500px">
			<el-form
				class="edit-batch"
				:model="auditForm"
				ref="auditForm"
				:rules="auditFormRules"
				label-width="110px"
				label-position="right"
				label-suffix=":"
			>
				<div class="flex">
					<el-form-item label="审核结果" prop="auditStatus">
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
import { CREDIT_ADJUST_BATCH_MANAGEMENT_SEARCH, CREDIT_ADJUST_BATCH_MANAGEMENT_COLUMNS } from './config.js';
export default {
	name: 'creditAdjustBatchManagement',
	data() {
		return {
			CREDIT_ADJUST_BATCH_MANAGEMENT_SEARCH,
			CREDIT_ADJUST_BATCH_MANAGEMENT_COLUMNS,
			searchConfig: {},
			loading: false,
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 0,
			list: [],
			batchDialog: { show: false, type: 'add' },
			editBatchForm: {},
			auditDialogVisible: false,
			auditForm: {},
			checkOptions: [
				{ value: 2, label: '审核通过' },
				{ value: 3, label: '审核驳回' },
			],
			auditFormRules: {
				auditStatus: [{ required: true, message: '请选择审核结果', trigger: 'blur' }],
			},
		};
	},
	computed: {
		loadDataPost() {
			const {
				searchConfig,
				pagination: { currentPage, pageSize },
			} = this;
			let data = {
				...searchConfig,
				pageNum: currentPage,
				pageSize,
			};
			if (data.entryTime) {
				data.entryStartTime = formatDate(data.entryTime[0]);
				data.entryEndTime = formatDate(data.entryTime[1]);
				delete data.entryTime;
			}
			if (data.increaseTime) {
				data.increaseStartTime = formatDate(data.increaseTime[0]);
				data.increaseEndTime = formatDate(data.increaseTime[1]);
				delete data.increaseTime;
			}
			return data;
		},
		batchDialogTile() {
			const { type } = this.batchDialog;
			let title;
			switch (type) {
				case 'add':
					title = '新建批次';
					break;
				case 'edit':
					title = '修改批次';
					break;
				default:
					title = '修改批次';
			}
			return title;
		},
		// 新增/修改调整批次传值
		addOrUpdateBatchForm() {
			let data = {
				...this.editBatchForm,
			};
			if (data.addTimerange) {
				data.increaseStartTime = data.addTimerange[0];
				data.increaseEndTime = data.addTimerange[1];
			}
			return data;
		},
	},
	methods: {
		// 新建批次操作
		addBatch() {
			this.batchDialog = { show: true, type: 'add' };
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
		// 删除操作
		deleteOne(row) {
			this.$confirm('是否确认删除该批次？', '提示')
				.then(async () => {
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/fin/wallet/credit/deleteAdjustBatch?id=${row.creditAdjustBatchId}`,
					});
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.loadData();
					} else {
						this.$message.error('操作失败');
					}
				})
				.catch(() => {});
		},
		// 修改操作
		edit(row) {
			this.batchDialog = { show: true, type: 'edit' };
			const { creditAdjustBatchId, adjustBatchNo, increaseTime, reduceTimeDesc } = row;
			this.$nextTick(() => {
				this.editBatchForm = {
					creditAdjBatchId: creditAdjustBatchId,
					adjustBatchNo,
					addTimerange: increaseTime ? increaseTime.split('至') : null,
					reduceTime: reduceTimeDesc,
				};
			});
		},
		// 详情
		detail(row) {
			this.$go('credit_adjust_batch_detail', { id: row.creditAdjustBatchId });
		},
		// 提交审核
		submitToAudit(row) {
			this.$confirm('是否确认提交审核', '提示')
				.then(async () => {
					const data = {
						auditStatus: 1,
						creditAdjustBatchId: row.creditAdjustBatchId,
					};
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/fin/wallet/credit/submitAdjustBatch',
						data,
					});
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.loadData();
					} else {
						this.$message.error('操作失败');
					}
				})
				.catch(() => {});
		},
		// 推送消息
		pushMessage(row) {
			const { sendMsgStatus, creditAdjustBatchId } = row;
			if (sendMsgStatus == 1) {
				return this.$message.warning('已发送');
			}
			this.$confirm('是否确认推送消息？').then(async () => {
				const res = await this.$fetch(
					`/mgmt/fin/wallet/credit/sendAdjustBatchPlanMessage?creditAdjustBatchId=${creditAdjustBatchId}`
				);
				if (res && res.code === 200) {
					this.$message.success('操作成功');
					this.loadData();
				} else {
					this.$message.error('操作失败');
				}
			});
		},
		// 去审核操作
		tobeAudit(row) {
			this.auditDialogVisible = true;
			this.auditForm.creditAdjustBatchId = row.creditAdjustBatchId;
		},
		// 修改批次取消
		editBatchCacel(formName) {
			this.$refs[formName].resetFields();
			this.batchDialog.show = false;
		},
		// 修改批次确定
		editBatchSave(formName) {
			this.addOrUpdateAdjustBatchFn(formName);
		},
		// 取消审核
		auditCacel(formName) {
			this.$refs[formName].resetFields();
			this.auditDialogVisible = false;
		},
		// 确定审核
		auditSave(formName) {
			this.$refs[formName].validate(async (valid) => {
				if (valid) {
					console.log(this.auditForm);
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/fin/wallet/credit/auditAdjustBatch',
						data: this.auditForm,
					});
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.loadData();
						this.$refs[formName].resetFields();
						this.auditDialogVisible = false;
					} else {
						this.$message.error('操作失败');
					}
				}
			});
		},
		// 新增/修改批次调用方法
		async addOrUpdateAdjustBatchFn(formName) {
			const { type } = this.batchDialog;
			const url = {
				add: '/mgmt/fin/wallet/credit/addAdjustBatch',
				edit: '/mgmt/fin/wallet/credit/updateAdjustBatch',
			};
			let data = {
				...this.addOrUpdateBatchForm,
			};
			if (type == 'add') {
				delete data.creditAdjBatchId;
			}
			const res = await this.$fetch({
				method: 'POST',
				url: url[type],
				data,
			});
			if (res && res.code === 200) {
				this.$message.success('操作成功');
				this.loadData();
				this.$refs[formName].resetFields();
				this.batchDialog.show = false;
			} else {
				this.$message.error('操作失败');
			}
		},
		// 获取列表数据
		async loadData() {
			this.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/credit/getAdjustBatchList',
				data: this.loadDataPost,
			});
			this.loading = false;
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
				if (this.list.length == 0) {
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
::v-deep.credit-adjust-batch-management {
	.edit-batch {
		.el-select {
			width: 100%;
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
