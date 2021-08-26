<template>
	<div class="deposit-input-and-audit">
		<guideBar>
			<el-button type="success" v-permission="'deposit_hand_input_button'" icon="el-icon-edit" @click="toInputDeposit">
				手工录入保证金
			</el-button>
			<el-button type="primary" v-permission="'deposit_input_batch_audit'" @click="batchAudit">批量审核</el-button>
			<el-button type="primary" v-permission="'deposit_input_import'" @click="batchImport">批量导入</el-button>
			<el-button type="primary" v-permission="'deposit_input_batch_export'" @click="batchExport">导出EXCEL</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="DEPOSIT_INPUT_AND_AUDIT_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeStatusTab">
				<el-tab-pane
					v-for="([label, name], $idx) in DEPOSIT_INPUT_AND_AUDIT_TABS_LIST"
					:key="$idx"
					:label="label"
					:name="name"
				>
					<tableList
						ref="multipleTable"
						:loading="tabPanes[activeStatusTab].loading"
						:dataSource="tabPanes[activeStatusTab].data"
						:columns="DEPOSIT_INPUT_AND_AUDIT_COLUMNS"
						:pagination="tabPanes[activeStatusTab].pagination"
						:dataTotal="tabPanes[activeStatusTab].total"
						:options="{ selection: true }"
						showSummary
						:summary-method="getSummaries"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						@handleSelectionChange="handleSelectionChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button v-permission="'deposit_input_and_audit_detail'" type="text" @click="previewDetail(scope.data)">
								详情
							</el-button>
							<el-button
								v-permission="'deposit_input_and_audit_revoke'"
								v-if="scope.data.verifyStatus == 3"
								type="text"
								@click="toRevoke(scope.data)"
							>
								撤销
							</el-button>
							<el-button
								v-permission="'deposit_input_and_audit_audit'"
								v-if="scope.data.verifyStatus == 3"
								type="text"
								@click="toAudit(scope.data)"
							>
								审核
							</el-button>
							<el-button
								v-permission="'deposit_input_and_audit_edit'"
								v-if="scope.data.verifyStatus == 4"
								type="text"
								@click="toEdit(scope.data)"
							>
								修改
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 批量审核 -->
		<el-dialog v-drag title="批量审核" :visible.sync="batchAuditVisible" width="500px">
			<el-form
				:model="batchAuditForm"
				ref="batchAuditForm"
				:rules="batchAuditRules"
				label-width="120px"
				label-suffix=":"
			>
				<el-form-item label="审核数量合计" prop="total">{{ batchAuditForm.total }}</el-form-item>
				<el-form-item label="审核状态" prop="verifyStatus">
					<el-select v-model="batchAuditForm.verifyStatus">
						<el-option label="通过" :value="1"></el-option>
						<el-option label="不通过" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="审核备注" prop="verifyRemark">
					<el-input type="textarea" v-model="batchAuditForm.verifyRemark" maxlength="50" show-word-limit />
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="center">
				<el-button @click="batchAuditCancel('batchAuditForm')">取消</el-button>
				<el-button type="primary" @click="batchAuditSave('batchAuditForm')">确定</el-button>
			</el-row>
		</el-dialog>
		<!-- 手工录入保证金/修改 -->
		<hand-input-deposit
			:show="handInputVisible"
			:dataSource="currentData"
			@close="closeHandInput"
			@success="loadData"
		/>
		<!-- 手工录入保证金详情/审核 -->
		<hand-input-deposit-detail
			:show="handInputVisibleDetail"
			:dataSource="currentData"
			@close="handInputVisibleDetail = false"
			@success="loadData"
		/>
	</div>
</template>

<script>
import {
	DEPOSIT_INPUT_AND_AUDIT_SEARCH_CONFIG,
	DEPOSIT_INPUT_AND_AUDIT_TABS_LIST,
	DEPOSIT_INPUT_AND_AUDIT_COLUMNS,
	DEPOSIT_INPUT_AND_AUDIT_STATUS,
} from './config';
import handInputDeposit from './modal/handInputDeposit';
import handInputDepositDetail from './modal/handInputDepositDetail';
import qs from 'querystring';
import { exportExcel } from 'util';
export default {
	name: 'depositInputAndAudit',
	components: {
		'hand-input-deposit': handInputDeposit,
		'hand-input-deposit-detail': handInputDepositDetail,
	},
	data() {
		return {
			DEPOSIT_INPUT_AND_AUDIT_SEARCH_CONFIG,
			DEPOSIT_INPUT_AND_AUDIT_TABS_LIST,
			DEPOSIT_INPUT_AND_AUDIT_COLUMNS,
			DEPOSIT_INPUT_AND_AUDIT_STATUS,
			searchConfig: {},
			activeStatusTab: 'all',
			tabPanes: {
				all: {
					loading: false,
					data: [],
					total: 0,
					pagination: {
						currentPage: 1,
						pageSize: 20,
					},
					summaryData: {},
				},
				tobeAudit: {
					loading: false,
					data: [],
					total: 0,
					pagination: {
						currentPage: 1,
						pageSize: 20,
					},
					summaryData: {},
				},
				audited: {
					loading: false,
					data: [],
					total: 0,
					pagination: {
						currentPage: 1,
						pageSize: 20,
					},
					summaryData: {},
				},
				canceled: {
					loading: false,
					data: [],
					total: 0,
					pagination: {
						currentPage: 1,
						pageSize: 20,
					},
					summaryData: {},
				},
			},
			batchAuditVisible: false,
			handInputVisible: false,
			handInputVisibleDetail: false,
			currentData: {},
			batchAuditForm: {
				total: 0,
				verifyStatus: '',
				verifyRemark: '',
			},
			batchAuditRules: {
				verifyStatus: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
			},
			selectRows: [],
		};
	},
	watch: {
		activeStatusTab: {
			immediate: true,
			handler() {
				this.updateData();
			},
		},
		'searchConfig.storeCode'(val) {
			if (val && /\d{6,}/.test(val)) {
				this.loadCardByStoreCode();
				this.loadStoreNameByStoreCode();
			}
		},
	},
	computed: {
		loadDataPost() {
			const { activeStatusTab, tabPanes, DEPOSIT_INPUT_AND_AUDIT_STATUS } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = tabPanes[activeStatusTab];
			let data = {
				...this.searchConfig,
				verifyStatus: DEPOSIT_INPUT_AND_AUDIT_STATUS[activeStatusTab],
				pageNum,
				pageSize,
			};
			return data;
		},
	},
	methods: {
		// 手工录入保证金
		toInputDeposit() {
			this.handInputVisible = true;
			this.currentData = {};
		},
		// 批量审核
		batchAudit() {
			const { selectRows } = this;
			const len = selectRows.length;
			if (len < 2) {
				return this.$message.warning('请至少选择两条数据');
			}
			this.batchAuditVisible = true;
			this.$nextTick(() => {
				this.batchAuditForm.total = len;
				console.log(this.batchAuditForm);
			});
		},
		// 批量导入
		batchImport() {
			const info = {
				downloadUrl: '/mgmt/store/downloadDepositApplyTemplate',
				uploadUrl: '/mgmt/store/importDepositApply',
				downloadFailUrl: '/mgmt/store/exportDepositApplyFailList',
			};
			this.$go('deposit_input_import', { info });
		},
		// 导出EXCEL
		batchExport() {
			exportExcel('/mgmt/store/exportSearchList', this.loadDataPost);
		},
		// 手工录入保证金 关闭回调
		closeHandInput() {
			this.handInputVisible = false;
		},
		// 搜索
		handleSearch() {
			const { activeStatusTab } = this;
			this.tabPanes[activeStatusTab].pagination.currentPage = 1;
			this.updateData();
		},
		// 详情
		previewDetail(row) {
			this.handInputVisibleDetail = true;
			this.$nextTick(() => {
				this.currentData = { ...row, type: 'detail' };
			});
		},
		// 撤销
		toRevoke(row) {
			this.$confirm('是否确认撤销？', '提示')
				.then(async () => {
					const res = await this.$fetch(`/mgmt/store/undoDepositApply?id=${row.id}`);
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.updateData();
					} else {
						this.$message.error((res && res.data.message) || '操作失败');
					}
				})
				.catch(() => {});
		},
		// 审核
		toAudit(row) {
			this.handInputVisibleDetail = true;
			this.$nextTick(() => {
				this.currentData = { ...row, verifyStatus: null, type: 'audit' };
			});
		},
		// 修改
		toEdit(row) {
			this.handInputVisible = true;
			this.$nextTick(() => {
				this.currentData = { ...row };
			});
		},
		// 翻页
		handleChangePage(page) {
			const { activeStatusTab } = this;
			this.tabPanes[activeStatusTab].pagination.currentPage = page;
			this.loadData();
		},
		handleSizeChange(pageSize) {
			const { activeStatusTab } = this;
			this.tabPanes[activeStatusTab].pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 选择列表行
		handleSelectionChange(data) {
			this.selectRows = [...data];
		},
		// 批量审核 取消
		batchAuditCancel(formName) {
			this.$refs[formName].resetFields();
			this.batchAuditVisible = false;
		},
		// 批量审核 保存
		batchAuditSave(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const { batchAuditForm, selectRows } = this;
					const ids = selectRows.map(({ id }) => id).join();
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/store/verifyDeposit',
						data: { ...batchAuditForm, ids },
					});
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.batchAuditCancel(formName);
						this.updateData();
					} else {
						this.$message.error((res && res.data.message) || '操作失败');
					}
				}
			});
		},
		// 合计
		getSummaries() {
			const { activeStatusTab } = this;
			const sums = [];
			const { summaryData } = this.tabPanes[activeStatusTab];
			if (summaryData) {
				DEPOSIT_INPUT_AND_AUDIT_COLUMNS.forEach((column, index) => {
					if (column.summary) {
						sums[index] = column.prop in summaryData ? summaryData[column.prop] : '';
					} else {
						sums[index] = '';
					}
				});
			}
			sums.splice(0, 1);
			this.$nextTick(() => {
				const data = {
					all: 0,
					tobeAudit: 1,
					audited: 2,
					canceled: 3,
				};
				this.$refs['multipleTable'][data[activeStatusTab]].$children[0].doLayout();
			});
			return ['', `小计:`, ...sums];
		},
		// 获取会员卡号
		async loadCardByStoreCode() {
			const { storeCode } = this.searchConfig;
			if (!storeCode) return this.$message.warning('请输入服务中心编号');
			const res = await this.$fetch(`/mgmt/fin/wallet/getCardNoByStoreCode?storeCode=${storeCode}`);
			if (res && res.code == 200) {
				this.searchConfig.leaderNo = res.data;
			} else {
				this.$message.error('获取会员卡号失败');
			}
		},
		// 通过服务中心编号获取服务中心名称
		async loadStoreNameByStoreCode() {
			const { storeCode } = this.searchConfig;
			if (!storeCode) return this.$message.warning('请输入服务中心编号');
			const res = await this.$fetch(`/mgmt/fin/wallet/getNameByStoreCode?storeCode=${storeCode}`);
			if (res && res.code == 200) {
				this.searchConfig.storeName = res.data;
			} else {
				this.$message.error('获取服务中心名称失败');
			}
		},
		// 获取保证金申请统计
		async loadDataSum() {
			const { activeStatusTab } = this;
			const res = await this.$fetch(`/mgmt/store/countDepositApplyList?${qs.stringify(this.loadDataPost)}`);
			if (res && res.code == 200) {
				this.tabPanes[activeStatusTab].summaryData = res.data || {};
			} else {
				this.$message.error('获取开店保证金统计失败，请查询服务是否可用');
			}
		},
		// 获取列表数据
		async loadData() {
			const { activeStatusTab } = this;
			this.tabPanes[activeStatusTab].loading = true;
			const res = await this.$fetch(`/mgmt/store/getDepositApplyList?${qs.stringify(this.loadDataPost)}`);
			this.tabPanes[activeStatusTab].loading = false;
			if (res && res.data) {
				const { list, total } = res.data;
				if (list && list.length) {
					this.tabPanes[activeStatusTab].data = list;
					this.tabPanes[activeStatusTab].total = total;
				} else {
					this.tabPanes[activeStatusTab].data = [];
					this.tabPanes[activeStatusTab].total = 0;
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message('查询商品版本列表数据失败');
			}
		},
		// 更新data
		updateData() {
			this.loadData();
			this.loadDataSum();
		},
	},
	mounted() {},
};
</script>

<style>
</style>