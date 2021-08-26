<template>
	<div class="hand-audit-unit">
		<el-card class="box-card">
			<searchPanel v-model="searchConfig" :config="HAND_INPUT_MONEY_CHECK_SEARCH" @search="handleSearch" />
		</el-card>
		<!-- 表格 -->
		<el-card class="box-card">
			<el-tabs v-model="activeTab">
				<el-tab-pane
					:label="label"
					:name="name"
					v-for="([label, name], $idx) in HAND_INPUT_AUDIT_COLUMNS_TABS"
					:key="$idx"
				>
					<tableList
						border
						:loading="tabPanes[name].loading"
						:dataSource="tabPanes[name].data"
						:columns="HAND_INPUT_MONEY_CHECK_COLUMNS_CONFIG"
						:pagination="tabPanes[name].pagination"
						:dataTotal="tabPanes[name].total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button v-permission="'hand_input_money_check_detail'" type="text" @click="detail(scope.data)">
								详情
							</el-button>
							<el-button
								v-permission="'hand_input_money_check_revoke'"
								type="text"
								@click="revoke(scope.data)"
								v-if="scope.data.adjustStatus == 1"
							>
								撤销
							</el-button>
							<el-button
								v-permission="'hand_input_money_check_audit'"
								type="text"
								@click="check(scope.data)"
								v-if="scope.data.adjustStatus == 1"
							>
								审批
							</el-button>
							<el-button
								v-permission="'hand_input_money_check_submit_again'"
								type="text"
								@click="recommit(scope.data)"
								v-if="Object.values(HAND_INPUT_AUDIT_STATUS).slice(3).includes(scope.data.adjustStatus)"
							>
								重新提交
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 审批 -->
		<el-dialog v-drag title="审批详情" :visible.sync="checkPopShow" width="600px">
			<el-form
				class="check-detail"
				:model="detailForm"
				:rules="AUDIT_DETAIL_RULES"
				ref="detailForm"
				label-width="110px"
				label-position="right"
				label-suffix=":"
			>
				<div class="edit-message">
					<div class="title edit-title">修改信息</div>
					<div class="edit-message-content">
						<div class="flex">
							<el-form-item label="分公司编号">
								<span>{{ detailForm.companyNo }}</span>
							</el-form-item>
						</div>
						<div class="flex">
							<el-form-item label="普客手机号码">
								<span>{{ detailForm.mobile }}</span>
							</el-form-item>
						</div>
						<div class="flex">
							<el-form-item label="会员卡号">
								<span>{{ detailForm.cardNo }}</span>
							</el-form-item>
						</div>
						<div class="flex">
							<el-form-item label="顾客姓名">
								<span>{{ detailForm.realname }}</span>
							</el-form-item>
						</div>
						<div class="flex">
							<el-form-item label="款项类型">
								<span>{{ detailForm.adjustType && MONEY_TYPE[detailForm.adjustType] }}</span>
							</el-form-item>
						</div>
						<div class="flex">
							<el-form-item label="修改金额">
								<span>
									{{
										detailForm.adjustAmount >= 0
											? '￥' + detailForm.adjustAmount
											: '-￥' + String(detailForm.adjustAmount).substr(1)
									}}
								</span>
							</el-form-item>
						</div>
						<div class="flex">
							<el-form-item label="录入人">
								<span>{{ detailForm.updaterName }}</span>
							</el-form-item>
						</div>
						<div class="flex">
							<el-form-item label="录入时间">
								<span>{{ formatDate(detailForm.entryTime) }}</span>
							</el-form-item>
						</div>
						<div class="flex">
							<el-form-item label="录入备注">
								<span>{{ detailForm.adjustReason }}</span>
							</el-form-item>
						</div>
					</div>
				</div>
				<div class="check-message">
					<div class="title check-title">审批信息</div>
					<div class="check-message-content">
						<div v-show="SWITCH_POP_DETAIL_CHECK === 1">
							<tableList border :dataSource="auditLogs" :columns="AUDIT_LOGS_COLUMNS_CONFIG" :height="150" />
						</div>
						<div v-show="SWITCH_POP_DETAIL_CHECK === 2">
							<div class="flex w100p">
								<el-form-item label="审核结果" prop="status">
									<el-radio v-model="detailForm.status" label="2">通过</el-radio>
									<el-radio v-model="detailForm.status" label="3">驳回</el-radio>
								</el-form-item>
							</div>
							<div class="flex w100p">
								<el-form-item label="审批意见" prop="auditRemark">
									<el-input
										type="textarea"
										:rows="2"
										placeholder="请输入审批意见"
										v-model="detailForm.auditRemark"
									></el-input>
								</el-form-item>
							</div>
						</div>
					</div>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="checkCacel('detailForm')" class="cacel">取 消</el-button>
				<el-button type="primary" @click="checkSave('detailForm')" class="save">确定</el-button>
			</span>
		</el-dialog>
		<!-- 重新提交 -->
		<edit-input-modal
			:show="inputDialogVisible"
			:form="balanceForm"
			@close="inputDialogVisible = false"
			@success="successEditModal"
		/>
	</div>
</template>

<script>
import editInputModal from '../modal/editInputModal';
import {
	HAND_INPUT_MONEY_CHECK_SEARCH,
	HAND_INPUT_AUDIT_STATUS,
	HAND_INPUT_AUDIT_COLUMNS_TABS,
	HAND_INPUT_MONEY_CHECK_COLUMNS_CONFIG,
	AUDIT_DETAIL_RULES,
	SWITCH_POP_DETAIL_CHECK,
	MONEY_TYPE,
	AUDIT_LOGS_COLUMNS_CONFIG,
} from '../config';
import { formatDate } from 'util/formValidation';
import { optionGenerator } from 'util';
export default {
	name: 'handAuditUnit',
	components: {
		'edit-input-modal': editInputModal,
	},
	props: {
		unitActiveTab: String,
	},
	data() {
		let tabPanes = {};
		Object.keys(HAND_INPUT_AUDIT_STATUS).map(item => {
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
		return {
			HAND_INPUT_MONEY_CHECK_SEARCH,
			HAND_INPUT_AUDIT_COLUMNS_TABS,
			HAND_INPUT_MONEY_CHECK_COLUMNS_CONFIG,
			HAND_INPUT_AUDIT_STATUS,
			AUDIT_DETAIL_RULES,
			SWITCH_POP_DETAIL_CHECK,
			MONEY_TYPE,
			AUDIT_LOGS_COLUMNS_CONFIG,
			searchConfig: {},
			activeTab: 'all',
			tabPanes,
			checkPopShow: false,
			detailForm: {
				status: '',
				auditRemark: '',
			},
			balanceForm: {
				type: '',
				operateType: '',
				adjustAmount: '',
				adjustReason: '',
			},
			inputDialogVisible: false,
			auditLogs: [], //审核信息列表
		};
	},
	watch: {
		unitActiveTab: {
			immediate: true,
			handler(val) {
				if (val === 'audit') {
					this.loadData();
				}
			},
		},
		activeTab: {
			immediate: true,
			handler() {
				this.loadData();
			},
		},
	},
	computed: {
		loadDataPost() {
			let { searchConfig, activeTab, tabPanes, HAND_INPUT_AUDIT_STATUS } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = tabPanes[activeTab];
			let data = {
				adjustStatus: HAND_INPUT_AUDIT_STATUS[activeTab],
				...searchConfig,
				pageNum,
				pageSize,
			};
			data.companyCode = data.companyCode || null;
			return data;
		},
		formatDate() {
			return formatDate;
		},
	},
	methods: {
		// 监听按下回车事件
		enterHandler(e) {
			if (e.which === 13 && this.$route.path.includes('hand_input_money_check')) {
				this.handleSearch();
			}
		},
		// 搜索
		handleSearch() {
			const { activeTab } = this;
			this.tabPanes[activeTab].pagination.currentPage = 1;
			this.loadData();
		},
		// 翻页
		handleChangePage(page) {
			const { activeTab } = this;
			this.tabPanes[activeTab].pagination.currentPage = page;
			this.loadData();
		},
		// 切换每页条数
		handleSizeChange(pageSize) {
			const { activeTab } = this;
			this.tabPanes[activeTab].pagination = {
				currentPage: 1,
				pageSize: pageSize,
			};
			this.loadData();
		},
		// 详情
		async detail(row) {
			this.checkPopShow = true;
			this.SWITCH_POP_DETAIL_CHECK = 1;
			this.rowContent = row;
			this.loadDetailinfo(row.walletAdjustId);
		},
		// 撤销
		revoke(row) {
			this.$confirm('是否撤销', '提示')
				.then(async () => {
					const { walletAdjustId } = row;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/fin/wallet/auditAdjust',
						data: { status: 6, walletAdjustId, auditRemark: '用户撤回' },
					});
					if (res && res.code == 200) {
						this.loadData();
						this.$message.success('操作成功');
					} else {
						this.$message.error((res.data && res.data.message) || '操作失败');
					}
				})
				.catch(() => {});
		},
		// 审批
		async check(row) {
			this.checkPopShow = true;
			this.SWITCH_POP_DETAIL_CHECK = 2;
			this.rowContent = row;
			this.loadDetailinfo(row.walletAdjustId);
		},
		// 重新提交
		recommit(row) {
			this.inputDialogVisible = true;
			this.rowContent = row;
			this.$nextTick(() => {
				const { walletId, walletAdjustId, companyNo: companyCode, companyName, actualBalance } = row;
				this.balanceForm = {
					walletId,
					walletAdjustId,
					companyCode,
					companyName,
					actualBalance,
				};
			});
		},
		successEditModal() {
			this.inputDialogVisible = false;
			this.loadData();
		},
		// 审批 - 取消
		checkCacel(formName) {
			this.checkPopShow = false;
			this.$refs[formName].resetFields();
		},
		// 审批 - 确定
		checkSave(formName) {
			if (this.SWITCH_POP_DETAIL_CHECK == 2) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						this.auditFun(formName);
						this.checkPopShow = false;
					}
				});
			} else {
				this.checkPopShow = false;
			}
		},
		// 修改钱包余额 - 取消
		editWalletCacel(formName) {
			this.editBalanceShow = false;
			this.$refs[formName].resetFields();
		},
		// 修改钱包余额 - 确定
		editWalletSave(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.resSubmitFun(formName);
					this.editBalanceShow = false;
				}
			});
		},
		// 审批方法
		async auditFun(formName) {
			let { detailForm, rowContent } = this;
			const data = {
				...detailForm,
				walletAdjustId: rowContent.walletAdjustId,
			};
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/auditAdjust',
				data,
			});
			if (res && res.code === 200) {
				this.$message.success('操作成功');
				this.loadData();
			} else {
				this.$message.error((res.data && res.data.message) || '审批失败');
			}
			this.$refs[formName].resetFields();
		},
		// 重新提交确认方法
		async resSubmitFun(formName) {
			let { balanceForm } = this;
			const data = {
				...balanceForm,
			};
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/applyAdjust',
				data,
			});
			this.$refs[formName].resetFields();
			if (res && res.code === 200) {
				this.$message.success('操作成功');
				this.loadData();
			} else {
				this.$message.error((res.data && res.data.message) || '重新提交操作失败');
			}
		},
		// 分公司编号选项 初始化
		getCompanyOptions() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			this.HAND_INPUT_MONEY_CHECK_SEARCH.form[3].options = serviceCompanyOptions.map(({ label, value }) => ({
				label: `${value} ${label}`,
				value,
			}));
		},
		// 获取字典映射
		async getDicts() {
			const [MONEY_TYPE] = await Promise.all([this.$getDict('NEW_MONEY_TYPE')]);
			if (MONEY_TYPE) {
				this.MONEY_TYPE = { ...MONEY_TYPE };
				this.moneyTypeOptions = optionGenerator(MONEY_TYPE);
			}
		},
		// 获取详情方法
		async loadDetailinfo(id) {
			this.auditLogs = [];
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/getAdjustDetail?id=' + id,
			});
			if (res && res.data) {
				this.detailForm = { ...this.detailForm, ...res.data };
				this.auditLogs = res.data.adjustAuditDtos;
			} else {
				this.$message.error('获取详情失败');
			}
		},
		// 获取数据
		async loadData() {
			const { activeTab } = this;
			this.tabPanes[activeTab].loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/getAdjustList',
				data: this.loadDataPost,
			});
			this.tabPanes[activeTab].loading = false;
			if (res && res.code == 200 && res.data) {
				const { list, total } = res.data;
				this.tabPanes[activeTab].data = list;
				this.tabPanes[activeTab].total = total;
				if (total == 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error((res.data && res.data.message) || '获取数据列表失败');
			}
		},
	},
	mounted() {
		this.getDicts();
		this.getCompanyOptions();
		window.addEventListener('keydown', this.enterHandler);
	},
	beforeDestroy() {
		window.removeEventListener('keydown', this.enterHandler);
	},
};
</script>

<style>
</style>