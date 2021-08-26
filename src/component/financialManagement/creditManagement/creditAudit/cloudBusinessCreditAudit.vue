<template>
	<div>
		<guideBar>
			<el-button type="primary" v-permission="'credit_audit_batch_management_batchaudit'" @click="batchAudit">
				批量审核
			</el-button>
			<el-button type="primary" v-permission="'credit_audit_batch_management_batchexport'" @click="batchExport">
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="CREDIT_INPUT_DETAIL_SEARCH_CONFIG_ONLY" @search="handleSearch" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeStatusTab">
				<el-tab-pane :label="label" :name="name" v-for="([label, name], $idx) in AUDIT_STATUS_PANES" :key="$idx">
					<tableList
						:loading="tabPanes[name].loading"
						:dataSource="tabPanes[name].data"
						:columns="CREDIT_INPUT_DETAIL_COLUMNS_CONFIG"
						:pagination="tabPanes[name].pagination"
						:dataTotal="tabPanes[name].total"
						:options="{ selection: true }"
						@handleSelectionChange="handleSelectionChange"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								type="text"
								@click="toAudit(scope.data)"
								v-permission="'credit_audit_batch_management_audit'"
								v-if="scope.data.auditStatus == 1"
							>
								审核
							</el-button>
							<el-button
								type="text"
								@click="toAuditBack(scope.data)"
								v-permission="'credit_audit_batch_management_auditback'"
								v-if="scope.data.auditStatus == 2 && scope.data.batchdtlStatus == 0"
							>
								反审
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 审核 -->
		<el-dialog v-drag title="审核" width="500px" :visible.sync="auditModalVisible">
			<el-form :model="auditForm" ref="auditForm" :rules="AUDIT_FORM_RULES" label-width="100px" label-suffix=":">
				<el-form-item label="审核结果" prop="auditStatus">
					<el-select v-model="auditForm.auditStatus" :disabled="auditForm.modalType == 'reject'">
						<el-option
							v-for="{ label, value } in optionGenerator(AUDIT_STATUS_KEY_NAME).slice(1)"
							:key="value"
							:label="label"
							:value="value"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注" prop="auditRemark">
					<el-input type="textarea" v-model="auditForm.auditRemark" maxlength="100" show-word-limit />
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="center">
				<el-button @click="auditCancel('auditForm')">取消</el-button>
				<el-button type="primary" @click="auditSave('auditForm')">确定</el-button>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import { CREDIT_INPUT_DETAIL_SEARCH_CONFIG, CREDIT_INPUT_DETAIL_COLUMNS_CONFIG } from '../creditInput/config';
import { AUDIT_STATUS_PANES, AUDIT_STATUS_KEY_VALUE, AUDIT_STATUS_KEY_NAME, AUDIT_FORM_RULES } from './config';
import { optionGenerator, exportExcelPost } from 'util';
export default {
	name: 'cloudBusinessCreditAudit',
	data() {
		let tabPanes = {};
		Object.keys(AUDIT_STATUS_KEY_VALUE).map(item => {
			tabPanes[item] = {
				loading: false,
				data: [],
				total: 0,
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
			};
		});
		const CREDIT_INPUT_DETAIL_SEARCH_CONFIG_ONLY = {
			form: CREDIT_INPUT_DETAIL_SEARCH_CONFIG.form.slice(0, -1),
		};
		return {
			CREDIT_INPUT_DETAIL_SEARCH_CONFIG_ONLY,
			AUDIT_STATUS_PANES,
			AUDIT_STATUS_KEY_VALUE,
			CREDIT_INPUT_DETAIL_COLUMNS_CONFIG,
			AUDIT_STATUS_KEY_NAME,
			AUDIT_FORM_RULES,
			searchConfig: {},
			activeStatusTab: 'all',
			tabPanes,
			selectRows: [], // 选中的row
			auditModalVisible: false, //审核弹窗显示状态
			auditForm: {}, //审核弹窗form
			sureButtonSwitch: true, //能否触发
		};
	},
	watch: {
		activeStatusTab: {
			immediate: true,
			handler() {
				this.loadData();
			},
		},
		'searchConfig.storeCode'(val) {
			if (/^\d{6,}$/.test(val)) {
				this.loadCardNoByStoreCode();
			}
		},
	},
	computed: {
		loadDataPost() {
			let { id, searchConfig, activeStatusTab, tabPanes, AUDIT_STATUS_KEY_VALUE } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = tabPanes[activeStatusTab];
			return {
				id,
				auditStatus: AUDIT_STATUS_KEY_VALUE[activeStatusTab],
				...searchConfig,
				pageNum,
				pageSize,
			};
		},
		optionGenerator() {
			return optionGenerator;
		},
	},
	methods: {
		// 批量审核
		batchAudit() {
			const { selectRows } = this;
			const selectLen = selectRows.length;
			if (selectLen < 2) {
				return this.$message.warning('需至少选择两条');
			}
			this.auditModalVisible = true;
			this.$nextTick(() => {
				const { creditAdjBatchId: batchId } = selectRows[0];
				const idList = selectRows.map(({ id }) => id);
				this.auditForm = {
					batchId,
					idList,
				};
			});
		},
		// 批量导出
		batchExport() {
			exportExcelPost('/mgmt/fin/wallet/credit/exportAuditBatchDetail', this.loadDataPost, '云商信用额审核列表', {
				timeout: 2 * 60000,
			});
		},
		// 搜索
		handleSearch() {
			const { activeStatusTab } = this;
			this.tabPanes[activeStatusTab].pagination.currentPage = 1;
			this.loadData();
		},
		// 翻页
		handleChangePage(page) {
			const { activeStatusTab } = this;
			this.tabPanes[activeStatusTab].pagination.currentPage = page;
			this.loadData();
		},
		// 切换每页条数
		handleSizeChange(pageSize) {
			const { activeStatusTab } = this;
			this.tabPanes[activeStatusTab].pagination = {
				currentPage: 1,
				pageSize: pageSize,
			};
			this.loadData();
		},
		// 选择列表数据
		handleSelectionChange(data) {
			this.selectRows = [...data];
		},
		// 审核
		toAudit(row) {
			this.auditModalVisible = true;
			this.$nextTick(() => {
				const { id, creditAdjBatchId: batchId } = row;
				this.auditForm = {
					idList: [id],
					batchId,
				};
			});
		},
		// 反审 (默认驳回)
		toAuditBack(row) {
			this.auditModalVisible = true;
			this.$nextTick(() => {
				const { id, creditAdjBatchId: batchId } = row;
				this.auditForm = {
					modalType: 'reject',
					idList: [id],
					batchId,
					auditStatus: 9, // 驳回
				};
			});
		},
		// 审核 取消
		auditCancel(formName) {
			this.$refs[formName].resetFields();
			this.auditModalVisible = false;
		},
		// 审核 确定
		auditSave(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid && this.sureButtonSwitch) {
					this.sureButtonSwitch = false;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/fin/wallet/credit/auditBatchDetail',
						data: this.auditForm,
						callback: () => {
							this.sureButtonSwitch = true;
						},
					});
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.loadData();
						this.auditCancel(formName);
					} else {
						this.$message.error('操作失败');
					}
				}
			});
		},
		// 获取会员卡号 通过服务中心编号
		async loadCardNoByStoreCode() {
			const { storeCode } = this.searchConfig;
			if (!storeCode) return;
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/fin/wallet/getCardNoByStoreCode?storeCode=' + storeCode,
			});
			if (res && res.code == 200) {
				this.searchConfig.cardNo = res.data;
			} else {
				this.$message.error('获取会员卡号失败');
			}
		},
		// 获取列表数据
		async loadData() {
			const { activeStatusTab } = this;
			this.tabPanes[activeStatusTab].loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/credit/getAuditBatchDetailList',
				data: this.loadDataPost,
				callback: () => {
					this.tabPanes[activeStatusTab].loading = false;
				},
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.tabPanes[activeStatusTab].data = list;
				this.tabPanes[activeStatusTab].total = total;
				if (total == 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取列表数据失败，请查询服务是否可用');
			}
		},
	},
};
</script>

<style>
</style>