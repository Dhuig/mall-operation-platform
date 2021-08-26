<template>
	<div class="cloud-business-credit-input">
		<guideBar />
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="list"
				:columns="CREDIT_INPUT_COLUMNS_CONFIG"
				:options="{ index: true, labelIndex: '序号' }"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button
						type="text"
						v-permission="'credit_input_batch_management_submit'"
						@click="toSubmit(scope.data)"
						:disabled="!scope.data.pendingSubmit"
					>
						提交
					</el-button>
					<el-button type="text" v-permission="'credit_input_batch_management_edit'" @click="toEdit(scope.data)">
						修改
					</el-button>
					<el-button
						type="text"
						v-permission="'credit_input_batch_management_detail|cloud_business_credit_input_detail'"
						@click="toDetail(scope.data)"
					>
						详情
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 修改 -->
		<el-dialog v-drag title="修改时间" :visible.sync="editDialogVisible" width="600px">
			<el-form :model="editForm" ref="editForm" :rules="editFormRules" label-suffix=":" label-width="120px">
				<el-form-item label="扣减时间" prop="reduceTime">
					<el-date-picker
						v-model="editForm.reduceTime"
						type="date"
						size="medium"
						:clearable="false"
						value-format="yyyy-MM-dd"
						placeholder="请选择日期"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="还款时间" prop="increaseEndTime">
					<el-date-picker
						v-model="editForm.increaseEndTime"
						type="date"
						size="medium"
						:clearable="false"
						value-format="yyyy-MM-dd"
						placeholder="请选择日期"
					></el-date-picker>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="center" class="dialog-button-group">
				<el-button @click="editCancel('editForm')">取消</el-button>
				<el-button type="primary" @click="editSave('editForm')">确认</el-button>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import { CREDIT_INPUT_COLUMNS_CONFIG } from './config';
export default {
	name: 'cloudBusinessCreditInput',
	data() {
		return {
			CREDIT_INPUT_COLUMNS_CONFIG,
			loading: false,
			list: [],
			editDialogVisible: false,
			editForm: {},
			editFormRules: {
				reduceTime: [{ required: true, message: '请选择日期', trigger: 'blur' }],
				increaseEndTime: [{ required: true, message: '请选择日期', trigger: 'blur' }],
			},
			sureButtonSwitch: true, // 能否触发
		};
	},
	methods: {
		// 提交
		toSubmit(row) {
			const { reduceTime, pendingSubmit, id: batchId } = row;
			if (new Date(reduceTime).getTime() < new Date().getTime()) {
				return this.$message.warning('时间已生效，不可提交');
			}
			this.$confirm('是否确认提交审核？', `提交数量合计：${pendingSubmit}条`)
				.then(async () => {
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/fin/wallet/credit/auditBatchDetail',
						data: { batchId, auditStatus: 1 },
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
		// 修改
		toEdit(row) {
			const { reduceTime } = row;
			if (new Date(reduceTime).getTime() < new Date().getTime()) {
				return this.$message.warning('时间已生效，不可修改');
			}
			this.editDialogVisible = true;
			this.$nextTick(() => {
				const { id, reduceTime, increaseTimeStart: increaseStartTime, increaseTimeEnd: increaseEndTime } = row;
				this.editForm = {
					id,
					reduceTime,
					increaseStartTime,
					increaseEndTime,
				};
			});
		},
		// 详情
		toDetail(row) {
			const { id } = row;
			this.$go('cloud_business_credit_input_detail', { id });
		},
		// 修改 取消
		editCancel(formName) {
			this.$refs[formName].resetFields();
			this.editDialogVisible = false;
		},
		// 修改 确认
		editSave(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					if (this.sureButtonSwitch) {
						const { id, reduceTime, increaseEndTime } = this.editForm;
						const data = {
							id,
							increaseEndTime: increaseEndTime + ' 00:00:00',
							increaseStartTime: reduceTime + ' 00:00:00',
							reduceTime: reduceTime + ' 00:00:00',
						};
						this.sureButtonSwitch = false;
						const res = await this.$fetch({
							method: 'POST',
							url: '/mgmt/fin/wallet/credit/updateBatch',
							data,
							callback: () => {
								this.sureButtonSwitch = true;
							},
						});
						if (res && res.code === 200) {
							this.$message.success('操作成功');
							this.loadData();
							this.editCancel(formName);
						} else {
							this.$message.error('操作失败');
						}
					}
				}
			});
		},
		// 获取批次详情数据统计
		async loadBatchDetailStatistics(id) {
			return await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/credit/getBatchDetailStatusCount',
				data: { auditStatus: 7, id },
			});
		},
		// 获取列表数据
		async loadData() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/credit/getBatchList',
				data: {},
			});
			if (res && res.data) {
				let list = res.data;
				this.list = list;
				const loadArr = list.map(({ id }) => {
					return this.loadBatchDetailStatistics(id);
				});
				Promise.all(loadArr)
					.then(result => {
						const pendingSubmitArr = result.map(({ data: { pendingSubmit } }) => pendingSubmit);
						list.map((item, index) => {
							item.pendingSubmit = pendingSubmitArr[index] || 0;
						});
						this.list = [...list];
					})
					.catch(() => {
						this.$message.error('获取批次详情数据统计失败，提交功能或被影响');
					});
			} else {
				this.$message.error('获取列表数据失败，请查询服务是否可用');
			}
		},
	},
	mounted() {
		this.loadData();
	},
};
</script>

<style></style>
