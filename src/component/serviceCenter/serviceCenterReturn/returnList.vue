<template>
	<div class="refundList">
		<guideBar>
			<el-button v-permission="'service_return_list_add_customer_quota'" type="success" @click="addReturn">
				新增顾客自购退货限制
			</el-button>
			<el-button v-permission="'service_return_list_add_business_quota'" type="success" @click="addCloudReturn">
				新增云商下单退货限制
			</el-button>
			<el-button v-permission="'service_return_list_batch_audit'" type="primary" @click="toBatchAudit">
				批量审核
			</el-button>
			<el-button v-permission="'service_return_list_batch_import'" type="primary" @click="batchImport">
				批量导入
			</el-button>
			<el-button v-permission="'service_return_list_batch_export'" type="primary" @click="batchExport">
				导出EXCEL
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="SERVICE_CENTER_RETURN_SEARCH" @search="handleSearch" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeName">
				<el-tab-pane
					:label="label"
					:name="name"
					v-for="([label, name], $idx) in SERVICE_CENTER_RETURN_TABS"
					:key="$idx"
				>
					<tableList
						border
						:loading="tabPanes[activeName].loading"
						:dataSource="tabPanes[activeName].data"
						:columns="SERVICE_CENTER_RETURN_COLUMN"
						:pagination="tabPanes[activeName].pagination"
						:dataTotal="tabPanes[activeName].total"
						:options="{ index: true, labelIndex: '序号', selection: true }"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						@handleSelectionChange="handleSelectionChange"
						slotcontent
					>
						<template slot-scope="row">
							<el-row type="flex" justify="center">
								<el-button
									v-permission="'service_return_list_detail|service_return_detail'"
									type="text"
									@click="toDetail(row.data)"
								>
									详情
								</el-button>
								<div class="el-button el-button--text" v-permission="'service_return_list_audit'">
									<el-button type="text" v-if="row.data.verifyStatus == 3" @click="toAudit(row.data)">审核</el-button>
								</div>
								<el-button v-permission="'service_return_list_change_quota'" type="text" @click="toEdit(row.data)">
									调整
								</el-button>
							</el-row>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>

		<!-- 新增编辑提示窗口 -->
		<!-- 添加账户弹窗 -->
		<el-dialog v-drag :title="editDialogTitle" :visible.sync="editDialog.show" width="500px" top="5vh">
			<el-form
				:model="addReturnData"
				ref="addReturnData"
				:rules="RETURN_AMOUNT_RULES"
				label-suffix=":"
				label-width="130px"
				class="add-user"
			>
				<el-form-item label="服务中心编号" prop="storeCode">
					<el-input
						v-model="addReturnData.storeCode"
						size="medium"
						placeholder="请输入服务中心编号"
						@blur="loadStoreInfoByCode"
						:disabled="isEditMode || isAuditMode"
					></el-input>
				</el-form-item>
				<el-form-item label="网点类型" prop="storeType">
					<el-input v-model="addReturnData.storeType" size="medium" disabled></el-input>
				</el-form-item>
				<el-form-item label="负责人卡号" prop="leaderNo">
					<el-input v-model="addReturnData.leaderNo" size="medium" disabled></el-input>
				</el-form-item>
				<el-form-item label="负责人姓名" prop="leaderName">
					<el-input v-model="addReturnData.leaderName" size="medium" disabled></el-input>
				</el-form-item>
				<el-form-item label="当前可用押货余额" prop="availableAmount">
					<el-input v-model="addReturnData.availableAmount" size="medium" disabled></el-input>
				</el-form-item>
				<el-form-item label="控制类型" prop="controlType">
					<el-input :value="RETURN_CONTROL_TYPE[addReturnData.controlType]" size="medium" disabled></el-input>
				</el-form-item>
				<el-form-item label="退货额度比例" prop="returnRatio" v-if="addReturnData.controlType == 2">
					<el-input v-model="addReturnData.returnRatio" size="medium" :disabled="isAuditMode">
						<el-button slot="append">%</el-button>
					</el-input>
				</el-form-item>
				<el-form-item label="押货余额极限值" prop="returnAmount">
					<el-input
						v-model="addReturnData.returnAmount"
						size="medium"
						:disabled="addReturnData.controlType == 2 || isAuditMode"
					></el-input>
				</el-form-item>
				<el-form-item label="记录状态" prop="state">
					<el-select v-model="addReturnData.state" size="medium" :disabled="isAuditMode">
						<el-option label="生效" :value="1"></el-option>
						<el-option label="失效" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<template v-if="isAuditMode">
					<el-form-item label="审核结果" prop="verifyStatus">
						<el-select size="medium" v-model="addReturnData.verifyStatus">
							<el-option label="审核通过" :value="1"></el-option>
							<el-option label="审核不通过" :value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核备注" prop="remark">
						<el-input
							type="textarea"
							size="medium"
							v-model="addReturnData.remark"
							maxlength="200"
							show-word-limit
						></el-input>
					</el-form-item>
				</template>
			</el-form>
			<el-row>注：押货余额极限值可输入两位小数，可输入负数，可输入范围±100万</el-row>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editCancel('addReturnData')" style="width: 100px">取 消</el-button>
				<el-button
					type="primary"
					@click="editSave('addReturnData')"
					v-if="!isAuditMode"
					style="width: 100px; margin-right: 16px"
				>
					确认
				</el-button>
				<el-button
					type="primary"
					@click="auditConfirm('addReturnData')"
					v-else
					style="width: 100px; margin-right: 16px"
				>
					确认
				</el-button>
			</span>
		</el-dialog>
		<!-- 批量审核 -->
		<el-dialog v-drag title="审核" :visible.sync="auditModalVisible" width="500px">
			<el-form
				:model="batchAuditForm"
				ref="batchAuditForm"
				:rules="RETURN_AMOUNT_AUDIT_RULES"
				label-suffix=":"
				label-width="100px"
			>
				<el-form-item label="审核结果" prop="verifyStatus">
					<el-select size="medium" v-model="batchAuditForm.verifyStatus">
						<el-option label="审核通过" :value="1"></el-option>
						<el-option label="审核不通过" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="审核备注" prop="remark">
					<el-input
						type="textarea"
						size="medium"
						v-model="batchAuditForm.remark"
						maxlength="200"
						show-word-limit
					></el-input>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="center">
				<el-button @click="batchAuditCancel('batchAuditForm')">取消</el-button>
				<el-button type="primary" @click="batchAuditConfirm('batchAuditForm')">确认</el-button>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import { exportExcel } from 'util';
import { formatDateDefault } from 'util/formValidation.js';
import {
	SERVICE_CENTER_RETURN_SEARCH,
	SERVICE_CENTER_RETURN_COLUMN,
	RETURN_AMOUNT_RULES,
	SERVICE_CENTER_RETURN_TABS,
	SERVICE_CENTER_RETURN_VERIFY_STATUS,
	SERVICE_CENTER_RETURN_STATE,
	RETURN_CONTROL_TYPE,
	RETURN_AMOUNT_AUDIT_RULES,
} from './config.js';
import qs from 'querystring';
export default {
	name: 'returnList',
	data() {
		const tabPanes = {};
		SERVICE_CENTER_RETURN_TABS.map(([label, value]) => {
			tabPanes[value] = {
				loading: false,
				name: label,
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				total: 0,
				data: [],
			};
		});
		return {
			SERVICE_CENTER_RETURN_SEARCH,
			SERVICE_CENTER_RETURN_COLUMN,
			RETURN_AMOUNT_RULES,
			SERVICE_CENTER_RETURN_TABS,
			SERVICE_CENTER_RETURN_VERIFY_STATUS,
			SERVICE_CENTER_RETURN_STATE,
			RETURN_CONTROL_TYPE,
			RETURN_AMOUNT_AUDIT_RULES,
			searchConfig: {},
			activeName: 'all',
			tabPanes,
			selectIds: [], // 选中的数据id集合
			editDialog: { show: false, type: 'add' }, //编辑弹窗信息
			addReturnData: {}, //新增编辑form数据
			dialogContent: '',
			loading: false,
			auditModalVisible: false, //批量审核弹窗modal状态
			batchAuditForm: {}, // 批量审核form
		};
	},
	watch: {
		activeName(val) {
			if (val in SERVICE_CENTER_RETURN_STATE) {
				this.searchConfig.state = SERVICE_CENTER_RETURN_STATE[val];
			} else {
				this.searchConfig.state = null;
			}
			this.loadData();
		},
		'addReturnData.returnRatio'(val) {
			if (/^([1-9]\d{0,1}|100)$/.test(val)) {
				this.computedReturnAmount();
			}
		},
		'editDialog.controlType'(val) {
			this.RETURN_AMOUNT_RULES.returnAmount[0].required = val == 1;
		},
	},
	computed: {
		loadDataPost() {
			const { searchConfig, activeName, SERVICE_CENTER_RETURN_VERIFY_STATUS, SERVICE_CENTER_RETURN_STATE } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabPanes[activeName];
			let data = {
				...searchConfig,
				pageNum,
				pageSize,
			};
			if (data.returnRatio) {
				data.startReturnRatio = data.returnRatio[0] / 100;
				data.endReturnRatio = data.returnRatio[1] / 100;
				delete data.returnRatio;
			}
			if (data.createTime) {
				data.createStartTime = data.createTime[0] ? formatDateDefault(data.createTime[0]) : null;
				data.createEndTime = data.createTime[1] ? formatDateDefault(data.createTime[1]) : null;
				delete data.createTime;
			}
			if (data.approveTime) {
				data.approveStartTime = data.approveTime[0] ? formatDateDefault(data.approveTime[0]) : null;
				data.approveEndTime = data.approveTime[1] ? formatDateDefault(data.approveTime[1]) : null;
				delete data.approveTime;
			}
			if (activeName in SERVICE_CENTER_RETURN_VERIFY_STATUS) {
				data.verifyStatus = SERVICE_CENTER_RETURN_VERIFY_STATUS[activeName];
			} else {
				data.verifyStatus = null;
			}
			if (activeName in SERVICE_CENTER_RETURN_STATE) {
				data.state = SERVICE_CENTER_RETURN_STATE[activeName];
				data.verifyStatus = 1; // 当tab为生效/失效时，默认获取审核通过的数据
			}
			return data;
		},
		editDialogTitle() {
			const { type, controlType } = this.editDialog;
			let title;
			switch (true) {
				case type == 'add' && controlType == 1:
					title = '新增/编辑押货余额极限值';
					break;
				case type == 'edit' && controlType == 1:
					title = '编辑押货余额极限值';
					break;
				case type == 'add' && controlType == 2:
					title = '新增/编辑退货额度比例';
					break;
				case type == 'audit':
					title = '审核';
					break;
				default:
					title = '编辑退货额度比例';
			}
			return title;
		},
		isEditMode() {
			// 编辑模式
			return this.editDialog.type == 'edit';
		},
		isAuditMode() {
			// 审核模式
			return this.editDialog.type == 'audit';
		},
	},
	methods: {
		// 顾客自购添加服务中心退货额 controlType 控制类型
		addReturn() {
			this.editDialog = { show: true, type: 'add', controlType: 1 };
			this.$nextTick(() => {
				this.addReturnData.controlType = 1;
			});
		},
		// 云商下单添加服务中心退货额 controlType 控制类型
		addCloudReturn() {
			this.editDialog = { show: true, type: 'add', controlType: 2 };
			this.$nextTick(() => {
				this.addReturnData.controlType = 2;
			});
		},
		// 批量审核
		toBatchAudit() {
			const { selectIds } = this;
			if (!selectIds.length) {
				return this.$message.warning('请至少选择一个待审核选项');
			}
			this.auditModalVisible = true;
		},
		// 批量导入
		batchImport() {
			this.$go('service_return_import');
		},
		// 导出EXCEL
		batchExport() {
			exportExcel('/mgmt/inventory/return/config/exportList', this.loadDataPost);
		},
		// 查询事件
		handleSearch() {
			const { activeName } = this;
			this.tabPanes[activeName].pagination.currentPage = 1;
			this.loadData();
		},
		// 分页触发事件
		handleChangePage(page) {
			const { activeName } = this;
			this.tabPanes[activeName].pagination.currentPage = page;
			this.loadData();
		},
		// 分页下拉触发事件
		handleSizeChange(pageSize) {
			const { activeName } = this;
			this.tabPanes[activeName].pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 表格选择行
		handleSelectionChange(data) {
			this.selectIds = data.map(({ id, verifyStatus }) => verifyStatus == 3 && id).filter(item => item);
		},
		// 详情
		toDetail(row) {
			const { id, storeCode, leaderNo, leaderName } = row;
			this.$go('service_return_detail', { id, storeCode, leaderNo, leaderName });
		},
		//修改
		toEdit(row) {
			const { controlType } = row;
			this.editDialog = { show: true, type: 'edit', controlType };
			this.$nextTick(() => {
				this.addReturnData = { ...row, controlType, returnRatio: row.returnRatio * 100 };
			});
		},
		// 审核
		toAudit(row) {
			this.editDialog = { show: true, type: 'audit' };
			this.$nextTick(() => {
				this.addReturnData = { ...row, verifyStatus: null, returnRatio: row.returnRatio * 100 };
			});
		},

		// 批量审核 取消
		batchAuditCancel(formName) {
			this.$refs[formName].resetFields();
			this.auditModalVisible = false;
		},
		// 批量审核 确认
		batchAuditConfirm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$confirm('是否确认审核', '提示')
						.then(async () => {
							const data = { ids: this.selectIds, ...this.batchAuditForm };
							this.auditFn(data).then(() => {
								this.batchAuditCancel(formName);
							});
						})
						.catch(() => {});
				}
			});
		},
		// 编辑退货额度-取消
		editCancel(formName) {
			this.$refs[formName].resetFields();
			this.editDialog.show = false;
		},
		// 编辑退货额度-确认
		editSave(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					const { controlType } = this.addReturnData;
					const title = {
						1: '押货余额极限值',
						2: '退货额度比例',
					};
					this.$confirm(`确认提交该${title[controlType]}？`, '提示')
						.then(() => {
							this.addOrEditAmountFn(formName);
						})
						.catch(() => {});
				}
			});
		},
		// 审核 确认
		auditConfirm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$confirm('是否确认提交', '提示')
						.then(async () => {
							const { id, verifyStatus, remark } = this.addReturnData;
							const data = { ids: [id], verifyStatus, remark };
							this.auditFn(data).then(() => {
								this.editCancel(formName);
							});
						})
						.catch(() => {});
				}
			});
		},
		// 审核方法
		async auditFn(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/inventory/return/config/deal',
				data,
			});
			if (res && res.code == 200) {
				this.$message.success('操作成功');
				this.loadData();
			} else {
				this.$message.error((res && res.data.message) || '操作失败');
			}
		},
		// 添加或修改配置额度方法
		async addOrEditAmountFn(formName) {
			this.addReturnData.returnRatio = Number(this.addReturnData.returnRatio) / 100;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/inventory/return/config/addOrUpdate',
				data: this.addReturnData,
			});
			if (res && res.code === 200) {
				const { verifyStatus } = this.addReturnData;
				let title = '新增记录提交成功';
				if (verifyStatus == 3) {
					title = '调整记录提交成功';
				}
				this.$message.success(title);
				this.editCancel(formName);
				this.loadData();
			} else {
				this.$message.error((res && res.data.message) || '操作失败');
			}
		},
		// 获取服务中心基础退货配置信息及押货余额信息
		async loadStoreInfoByCode() {
			const { storeCode, controlType } = this.addReturnData;
			if (!storeCode) return this.$message.warning('请输入服务中心编号');
			const res = await this.$fetch(
				`/mgmt/inventory/return/config/getBaseReturnConfigByStoreCode?${qs.stringify({ storeCode, controlType })}`
			);
			if (res && res.code === 200) {
				const { returnRatio } = res.data;
				if (returnRatio) {
					this.$message.warning('该服务中心已设定售后额度');
					res.data.returnRatio = returnRatio * 100;
				}
				this.addReturnData = { ...this.addReturnData, ...res.data, state: 1 };
			} else {
				this.$message.error('获取服务中心编号有误，请重新输入');
			}
		},
		// 获取实时计算押货余额极限值
		async computedReturnAmount() {
			const { returnRatio, storeCode } = this.addReturnData;
			const data = { storeCode, returnRatio: returnRatio / 100 };
			const res = await this.$fetch(`/mgmt/inventory/return/config/getReturnAmount?${qs.stringify(data)}`);
			if (res && res.code == 200) {
				this.addReturnData.returnAmount = res.data;
			} else {
				this.$message.error('实时计算押货余额极限值失败');
			}
		},
		// 获取分公司信息
		async initCompanyOptions() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			this.SERVICE_CENTER_RETURN_SEARCH.form[2].options =
				serviceCompanyOptions?.map(({ label, value }) => ({
					label: `${value} ${label}`,
					value,
				})) || [];
		},
		// 获取退货额度列表数据
		async loadData() {
			const { activeName } = this;
			this.tabPanes[activeName].loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/inventory/return/config/pageList',
				data: this.loadDataPost,
			});
			this.tabPanes[activeName].loading = false;
			if (res && res.data) {
				const { list, total } = res.data;
				this.tabPanes[activeName].data = list;
				this.tabPanes[activeName].total = total;
				if (list && list.length == 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取退货额度列表数据失败');
			}
		},
	},
	mounted() {
		this.initCompanyOptions();
		this.loadData();
	},
};
</script>
<style lang="scss" scoped>
::v-deep.el-select {
	width: 100%;
}
::v-deep.add-user {
	.el-form-item {
		margin-bottom: 16px;
	}
}
</style>
