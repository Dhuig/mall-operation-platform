<template>
	<div class="cloud-charge-detail">
		<guideBar>
			<el-button
				type="primary"
				v-permission="'cloud_charging_detail_change_limit_by_hand'"
				@click="adjustment"
				:disabled="!!searchAudit"
			>
				手工调整押货额
			</el-button>
			<el-button plain type="primary" v-permission="'cloud_charging_detail_change_export_excel'">导出EXCEL</el-button>
		</guideBar>
		<el-card class="card-box">
			<el-form :inline="true" label-width="180px" label-suffix=":">
				<div class="min-width">
					<el-row>
						<el-col :span="8">
							<el-form-item label="服务中心编号">
								<span>{{ detailInfo && detailInfo.storeCode }}</span>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="服务中心名称">
								<span>{{ detailInfo && detailInfo.storeName }}</span>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="负责人">
								<span>{{ detailInfo && detailInfo.leaderName }}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="8">
							<el-form-item label="最大押货额度">
								<span>￥{{ shouldCurrentMaxRemit || (detailInfo && detailInfo.maxRemitAmount) }}</span>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="累计已汇押货款">
								<span>￥{{ detailInfo && detailInfo.remitUsed }}</span>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="已退款金额">
								<span>￥{{ detailInfo && detailInfo.returnAmount }}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="8">
							<el-form-item label="当前押货余额">
								<span>￥{{ detailInfo && detailInfo.balance }}</span>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="当前信誉额">
								<span>￥{{ detailInfo && detailInfo.credit }}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-form>
		</el-card>
		<el-card class="box-card">
			<el-tabs v-model="activeTab">
				<el-tab-pane label="全部" name="all">
					<tableList
						border
						:loading="all.loading"
						:dataSource="all.data"
						:columns="ALL_DETAIL_COLUMNS"
						:pagination="all.pagination"
						:dataTotal="all.pagination.total"
						:options="options"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<div>
								<span
									class="btns"
									@click="reviedwed(scope.data)"
									v-if="+scope.data.verifyStatus === 3"
									v-permission="'cloud_charging_detail_audit'"
								>
									审核
								</span>
							</div>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="待审核" name="tobeReviewed">
					<div class="mb-16">
						<el-button type="primary" @click="handleBatchExamine" v-permission="'cloud_charging_detail_batch_audit'">
							批量审核
						</el-button>
					</div>
					<tableList
						border
						:loading="tobeReviewed.loading"
						:dataSource="tobeReviewed.data"
						:columns="TOBEREVIEWED_DETAIL_COLUMNS"
						:pagination="tobeReviewed.pagination"
						:dataTotal="tobeReviewed.pagination.total"
						:options="optionsReviewed"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						@toggleRowSelection="toggleRowSelection"
						@handleSelectionChange="handleSelectionChange"
						slotcontent
					>
						<template slot-scope="scope">
							<div>
								<span class="btns" v-permission="'cloud_charging_detail_audit'" @click="reviedwed(scope.data)">
									审核
								</span>
							</div>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 调整弹窗 -->
		<el-dialog :title="isAjust ? '最大押货额度调整' : '最大押货额度调整审核'" :visible.sync="show" width="600px" v-drag>
			<el-form :model="adjust" class="add-user" ref="adjustRef" :rules="batchExamineRules">
				<el-form-item label="服务中心编号:">
					<span>{{ rowInfo.storeCode }}</span>
				</el-form-item>
				<el-form-item label="服务中心名称:">
					<span>{{ rowInfo.storeName }}</span>
				</el-form-item>
				<el-form-item label="负责人卡号:">
					<span>{{ rowInfo.cardNo }}</span>
				</el-form-item>
				<el-form-item label="所属分公司:">
					<span>{{ rowInfo.companyName }}</span>
				</el-form-item>
				<el-form-item label="当前最大押货额度:">
					<span>￥{{ shouldCurrentMaxRemit || rowInfo.currentMaxRemit }}</span>
				</el-form-item>
				<el-form-item label="申请调整至:" prop="money">
					<el-input v-model="adjust.money" size="medium" :disabled="!isAjust" />
				</el-form-item>
				<el-form-item label="调整理由:" prop="applyRemark">
					<el-input type="textarea" v-model="adjust.applyRemark" size="medium" :disabled="!isAjust" />
				</el-form-item>
				<el-form-item label="审核结果:" prop="verifyStatus" v-if="!isAjust">
					<el-select size="medium" v-model="adjust.verifyStatus">
						<el-option label="通过" value="1"></el-option>
						<el-option label="拒绝" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="审核备注:" prop="verifyRemark" v-if="!isAjust">
					<el-input type="textarea" v-model="adjust.verifyRemark" size="medium" />
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button
					:loading="submitLoading"
					type="primary"
					@click="handleExamineSave('adjustRef')"
					class="dialog-btn mr-16"
				>
					{{ isAjust ? '提交' : '审核' }}
				</el-button>
				<el-button @click="handleExamineCacel('adjustRef')" class="dialog-btn">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 批量审核 -->
		<el-dialog title="批量审核" :visible.sync="batchExamineShow" width="600px" v-drag>
			<el-form :model="batchExamine" class="add-batch" :rules="batchExamineRules" ref="batchExamineRef">
				<el-form-item label="审核数量合计:">
					<span>{{ selection.length }}</span>
				</el-form-item>
				<el-form-item label="审核状态:" prop="verifyStatus">
					<el-select size="medium" v-model="batchExamine.verifyStatus">
						<el-option label="通过" value="1"></el-option>
						<el-option label="拒绝" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注:" prop="verifyRemark">
					<el-input type="textarea" v-model="batchExamine.verifyRemark" size="medium" />
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="batchExamineSave('batchExamineRef')" class="dialog-btn mr-16">
					批量审核
				</el-button>
				<el-button @click="batchExamineCacel('batchExamineRef')" class="dialog-btn">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { ALL_DETAIL_COLUMNS, TOBEREVIEWED_DETAIL_COLUMNS, DETAIL_TYPE } from './config';
import { numberAndDot } from 'util/formValidation';
import qs from 'querystring';
// import { log } from 'console';

export default {
	name: 'cloudChargeDetail',
	data() {
		return {
			ALL_DETAIL_COLUMNS,
			TOBEREVIEWED_DETAIL_COLUMNS,
			activeTab: 'all',
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			optionsReviewed: {
				label: '全部',
				index: true,
				selection: true,
				labelIndex: '序号',
			},
			selection: [], // 勾选的数据
			all: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			tobeReviewed: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			show: false,
			batchExamineShow: false, // 批量操作弹窗
			isAjust: true, // 调整内容or审核内容
			adjust: {
				// 调整对象
				money: '', // 调整金额
				applyRemark: '', // 调整理由
				verifyStatus: '', // 审核状态
				verifyRemark: '', // 审核备注
			},
			batchExamine: {
				// 批量审核对象
				verifyStatus: '',
				verifyRemark: '',
			},
			batchExamineRules: {
				money: [{ required: false, validator: numberAndDot, trigger: 'blur' }],
				verifyStatus: [{ required: true, message: '请选择', trigger: 'change' }],
			},
			rowInfo: {}, // 每行数据信息
			tableRef: '', // 继承表格组件的ref标识
			detailInfo: {}, // 列表页传递过来的数据
			shouldCurrentMaxRemit: '', // 记录审核成功时，回显的当前额度
			submitLoading: false,
		};
	},
	computed: {
		//查看所有数据是否含有待审核数据
		searchAudit() {
			let status = 0;
			if (this.activeTab == 'all') {
				status = this.all.data.some(item => {
					if (item.verifyStatus == 3) {
						return 1;
					}
					return 0;
				});
			} else {
				status = this.tobeReviewed.data.some(item => {
					if (item.verifyStatus == 3) {
						return 1;
					}
					return 0;
				});
			}

			return status;
		},
		// 审核类型
		verifyStatus() {
			return DETAIL_TYPE[this.activeTab];
		},
	},
	watch: {
		verifyStatus() {
			this.getList();
		},
	},
	methods: {
		// 分页触发事件
		handleChangePage(currentPage) {
			this[this.activeTab].pagination.currentPage = currentPage;
			this.getList();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this[this.activeTab].pagination.pageSize = pageSize;
			this.getList();
		},
		// 初始化清空复选框勾选状态
		toggleRowSelection(that) {
			this.tableRef = that;
			return that.clearSelection();
		},
		// 复选框选中项
		handleSelectionChange(val) {
			this.selection = val;
		},
		// 调整
		adjustment() {
			this.rowInfo = {
				...this.detailInfo,
				// currentMaxRemit: this.detailInfo.availableAmount,
				currentMaxRemit: this.detailInfo.maxRemitAmount,
			};
			this.adjust = {
				...this.adjust,
				money: '',
				applyRemark: '',
			};
			this.show = true;
			this.isAjust = true;
		},
		// 审核确定按钮
		handleExamineSave(formName) {
			if (this.isAjust) {
				this.$refs[formName].validate(async valid => {
					if (valid) {
						const params = {
							storeCode: this.detailInfo.storeCode,
							money: this.adjust.money || 0,
							applyRemark: this.adjust.applyRemark,
						};
						await this.addMortgage(params);
						this.show = false;
						this.$refs[formName].resetFields();
						this.getList();
					}
				});
			} else {
				this.$refs[formName].validate(async valid => {
					if (valid) {
						const params = {
							verifyRemark: this.adjust.verifyRemark,
							verifyStatus: +this.adjust.verifyStatus,
							ids: [this.rowInfo.id],
						};
						await this.apply(params);
						this.show = false;
						this.$refs[formName].resetFields();
						this.getList();
					}
				});
			}
		},
		// 审核取消按钮
		handleExamineCacel(formName) {
			this.show = false;
			this.$refs[formName].resetFields();
		},
		// 审核
		reviedwed(row) {
			this.rowInfo = row;
			this.adjust = {
				...this.adjust,
				money: row.money,
				applyRemark: row.applyRemark,
			};
			this.show = true;
			this.isAjust = false;
		},
		// 批量审核
		handleBatchExamine() {
			if (!this.selection.length) {
				this.$message({
					message: '至少勾选一项!',
					type: 'error',
				});
			} else {
				this.batchExamineShow = true;
			}
		},
		// 批量审核确定按钮
		batchExamineSave(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const ids = this.selection.map(v => v.id);
					const params = {
						...this.batchExamine,
						verifyStatus: +this.batchExamine.verifyStatus,
						ids,
					};
					await this.apply(params);
					this.$refs[formName].resetFields();
					this.batchExamineShow = false;
					this.getList();
				}
			});
		},
		// 批量审核取消按钮
		batchExamineCacel(formName) {
			this.$refs[formName].resetFields();
			this.batchExamineShow = false;
			// 清空勾选状态
			this.tableRef.clearSelection();
		},
		// 审核接口
		async apply(params) {
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/inventory/mortgageAmount/verifyMortgageAmountMaxRemitApply',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
			this.submitLoading = false;
		},
		// 押货额变更申请接口
		async addMortgage(params) {
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'get',
				url: '/mgmt/inventory/mortgageAmount/addMortgageAmountMaxRemitApply',
				params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
			this.submitLoading = false;
		},
		// 请求数据
		async getList() {
			const { activeTab, verifyStatus, detailInfo } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this[activeTab];
			this[activeTab].loading = true;
			const params = {
				verifyStatus,
				pageNum,
				pageSize,
				storeCode: detailInfo.storeCode,
			};

			const res = await this.$fetch(
				`/mgmt/inventory/mortgageAmount/listMortgageAmountMaxRemitInfo?${qs.stringify(params)}`
			);

			if (res) {
				const { list, total } = res.data;
				this[activeTab].data = list;
				this[activeTab].pagination.total = total;
				// 取列表的第一条数据回显到最大押货额度位置
				if (+verifyStatus === 0) {
					this.shouldCurrentMaxRemit =
						list[0] && (list[0].currentMaxRemit || (this.detailInfo && this.detailInfo.maxRemitAmount));
				}
			} else {
				this[activeTab].data = [];
				this[activeTab].pagination.total = 0;
			}
			this[activeTab].loading = false;
		},
	},
	created() {
		let rowInfo = this.$route.query.row || '{}';
		this.detailInfo = JSON.parse(rowInfo);
		this.getList();
	},
};
</script>
<style lang="scss" scoped>
::v-deep.cloud-charge-detail {
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}
	.el-form-item {
		width: 100%;
		display: flex;
		flex: auto;
		margin-bottom: 26px;
		.el-form-item__content,
		.el-input,
		.el-select,
		.el-date-editor {
			width: 224px;
		}
	}
	.dialog-footer {
		display: flex;
		justify-content: center;
	}
	.el-dialog__footer {
		padding-bottom: 30px !important;
	}
	.el-textarea__inner {
		height: 90px;
	}
}
::v-deep.add-user {
	padding-right: 25%;
	.el-form-item {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		margin-bottom: 0px;
		.el-form-item__content,
		.el-input,
		.el-select,
		.el-date-editor {
			width: 224px;
		}
	}
	.el-textarea__inner {
		margin: 18px 0;
	}
}
::v-deep.add-batch {
	padding-right: 25%;
	.el-form-item {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		margin-bottom: 24px;
		.el-form-item__content,
		.el-input,
		.el-select,
		.el-date-editor {
			width: 224px;
		}
	}
}
.mb-16 {
	margin-bottom: 16px;
}
.dialog-btn {
	width: 100px;
}
.mr-16 {
	margin-right: 16px;
}
</style>
