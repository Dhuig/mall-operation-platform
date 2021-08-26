<template>
	<div class="open-store-deposit-detail">
		<guideBar>
			<el-button type="primary" @click="inputDeposit">手工录入保证金</el-button>
			<el-button type="primary" @click="batchExport">导出EXCEL</el-button>
		</guideBar>
		<el-card class="box-card base-info">
			<div class="card-title">基本信息</div>
			<el-row>
				<el-col :span="8">
					<span>分公司:</span>
					<span>{{ baseInfo.companyName }}</span>
				</el-col>
				<el-col :span="8">
					<span>服务中心编号:</span>
					<span>{{ baseInfo.storeCode }}</span>
				</el-col>
				<el-col :span="8">
					<span>服务中心名称:</span>
					<span>{{ baseInfo.storeName }}</span>
				</el-col>
				<el-col :span="8">
					<span>开店保证金余额:</span>
					<span>￥{{ baseInfo.depositMoney }}</span>
				</el-col>
				<el-col :span="8">
					<span>特批押货保证金余额:</span>
					<span>￥{{ baseInfo.speciallyMoney }}</span>
				</el-col>
			</el-row>
		</el-card>
		<el-card class="box-card">
			<searchPanel v-model="searchConfig" :config="OPEN_STORE_DEPOSIT_DETAIL_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<!-- 表格 -->
		<el-card>
			<el-tabs v-model="activeName" @tab-click="handleTabChange">
				<el-tab-pane label="全部" name="all">
					<tableList
						border
						:dataSource="all.data"
						:columns="OPEN_STORE_DEPOSIT_DETAIL_COLUMNS_CONFIG"
						:pagination="all.pagination"
						:dataTotal="all.total"
						:options="all.options"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button type="text" @click="audit(scope.data)" v-if="scope.data.verifyStatus == 3">审核</el-button>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="待审核" name="tobeAudit">
					<tableList
						border
						:dataSource="tobeAudit.data"
						:columns="OPEN_STORE_DEPOSIT_DETAIL_COLUMNS_CONFIG"
						:pagination="tobeAudit.pagination"
						:dataTotal="tobeAudit.total"
						:options="tobeAudit.options"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button type="text" @click="audit(scope.data)">审核</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 手工录入保证金 -->
		<el-dialog
			v-drag
			title="手工录入保证金"
			width="600px"
			:visible.sync="inputDepositVisible"
			class="deposit-input-dialog"
		>
			<el-form
				:model="depositForm"
				ref="depositForm"
				:rules="INPUT_DEPOSIT_FORM_RULES"
				label-width="120px"
				label-suffix=":"
				class="deposit-pop-form"
			>
				<el-row>
					<el-col :span="24" class="mb16"
						><span class="col-left-item">服务中心编号:</span>{{ baseInfo.storeCode }}</el-col
					>
					<el-col :span="12" class="mb16"
						><span class="col-left-item">服务中心名称:</span>{{ baseInfo.storeName }}</el-col
					>
					<el-col :span="12" class="mb16"><span class="col-left-item">负责人:</span>{{ baseInfo.leaderName }}</el-col>
					<el-col :span="24" class="mb16"><span class="col-left-item">分公司:</span>{{ baseInfo.companyName }}</el-col>
					<el-col :span="12">
						<el-form-item label="保证金类型" prop="depositType">
							<el-select v-model="depositForm.depositType" placeholder="请选择保证金类型">
								<el-option :label="item" :value="index" v-for="(item, index) in DEPOSIT_TYPE" :key="index"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="转账方式" prop="payType">
							<el-select v-model="depositForm.payType" placeholder="请选择转账方式">
								<el-option
									:label="item"
									:value="index"
									v-for="(item, index) in TRANSFER_METHODS"
									:key="index"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="保证金金额" prop="money">
							<el-input v-model="depositForm.money"></el-input>
							<div class="bottom-tips">正数表示增加，负数则表示扣减</div>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="付款账号" prop="payAccount">
							<el-input v-model="depositForm.payAccount"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="付款银行名称" prop="payBankName">
							<el-input v-model="depositForm.payBankName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="18">
						<el-form-item label="备注" prop="submitRemark">
							<el-input type="textarea" v-model="depositForm.submitRemark"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancelInputDeposit('depositForm')">取 消</el-button>
				<el-button type="primary" @click="saveInputDeposit('depositForm')">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 手工录入款项审核 -->
		<el-dialog title="手工款项审核" width="600px" :visible.sync="moneyAuditVisible">
			<el-form :model="auditForm" ref="auditForm" label-width="120px" label-suffix=":" class="deposit-pop-form">
				<el-row>
					<el-col :span="24" class="mb16"
						><span class="col-left-item">服务中心编号:</span>{{ baseInfo.storeCode }}</el-col
					>
					<el-col :span="12" class="mb16"
						><span class="col-left-item">服务中心名称:</span>{{ baseInfo.storeName }}</el-col
					>
					<el-col :span="12" class="mb16"><span class="col-left-item">负责人:</span>{{ baseInfo.leaderName }}</el-col>
					<el-col :span="24" class="mb16"><span class="col-left-item">分公司:</span>{{ baseInfo.companyName }}</el-col>
					<el-col :span="12" class="mb16"
						><span class="col-left-item">保证金类型:</span
						>{{ (rowContent.depositType && DEPOSIT_TYPE[rowContent.depositType]) || '' }}</el-col
					>
					<el-col :span="12" class="mb16"
						><span class="col-left-item">转账方式:</span
						>{{ (rowContent.payType && TRANSFER_METHODS[rowContent.payType]) || '' }}</el-col
					>
					<el-col :span="24" class="mb16"
						><span class="col-left-item">保证金金额:</span>￥{{ Number(rowContent.money).toFixed(2) }}</el-col
					>
					<el-col :span="12" class="mb16"
						><span class="col-left-item">付款账号:</span>{{ rowContent.payAccount }}</el-col
					>
					<el-col :span="12" class="mb16"
						><span class="col-left-item">付款银行名称:</span>{{ rowContent.payBankName }}</el-col
					>
					<el-col :span="24" class="mb16"
						><span class="col-left-item">状态:</span
						>{{ (rowContent.verifyStatus && TAB_VALUE_TO_LABEL[rowContent.verifyStatus]) || '' }}</el-col
					>
					<el-col :span="24" class="mb16"><span class="col-left-item">备注:</span>{{ rowContent.submitRemark }}</el-col>
					<el-col :span="12" class="mb16"><span class="col-left-item">提交人:</span>{{ rowContent.submitter }}</el-col>
					<el-col :span="12" class="mb16"
						><span class="col-left-item">提交时间:</span
						>{{ (rowContent.createTimeStamp && formatDate(rowContent.createTimeStamp * 1000)) || '' }}</el-col
					>
					<el-col :span="14">
						<el-form-item label="审核结果" prop="verifyStatus">
							<el-select v-model="auditForm.verifyStatus" placeholder="审核结果">
								<el-option
									:label="item.label"
									:value="item.value"
									v-for="(item, index) in AUDIT_RESULT"
									:key="index"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="18">
						<el-form-item label="审核备注" prop="verifyRemark">
							<el-input type="textarea" v-model="auditForm.verifyRemark"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancelAudit('auditForm')">取 消</el-button>
				<el-button type="primary" @click="saveAudit('auditForm')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {
	OPEN_STORE_DEPOSIT_DETAIL_SEARCH_CONFIG,
	OPEN_STORE_DEPOSIT_DETAIL_COLUMNS_CONFIG,
	TAB_VALUE_TO_LABEL,
	TAB_OPTIONS,
	DEPOSIT_TYPE,
	TRANSFER_METHODS,
	AUDIT_RESULT,
	INPUT_DEPOSIT_FORM_RULES,
} from './config';
import qs from 'querystring';
import { formatDateDefault, formatDate } from 'util/formValidation.js';
import { exportExcel } from 'util';
export default {
	name: 'openStoreDepositDetail',
	data() {
		return {
			OPEN_STORE_DEPOSIT_DETAIL_SEARCH_CONFIG,
			OPEN_STORE_DEPOSIT_DETAIL_COLUMNS_CONFIG,
			TAB_VALUE_TO_LABEL,
			TAB_OPTIONS,
			DEPOSIT_TYPE,
			TRANSFER_METHODS,
			AUDIT_RESULT,
			INPUT_DEPOSIT_FORM_RULES,
			searchConfig: {
				timerange: '',
				type: '',
			},
			baseInfo: {},
			activeName: 'all',
			all: {
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				total: 0,
				options: {
					index: true,
					labelIndex: '序号',
				},
			},
			tobeAudit: {
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				total: 0,
				options: {
					selection: false,
				},
			},
			rowContent: {},
			inputDepositVisible: false,
			depositForm: {
				depositType: '',
				payType: '',
				money: '',
				payAccount: '',
				payBankName: '',
				submitRemark: '',
			},
			moneyAuditVisible: false,
			auditForm: {
				verifyStatus: '',
				verifyRemark: '',
			},
		};
	},
	methods: {
		// 监听按下回车事件
		enterHandler(e) {
			if (e.which === 13 && this.$route.path.includes('open_store_deposit_detail')) {
				this.loadData();
			}
		},
		// 导出
		batchExport() {
			exportExcel('/mgmt/store/exportSearchList', this.loadDataPost);
		},
		// 翻页
		handleChangePage(page) {
			const { activeName } = this;
			this[activeName].pagination.currentPage = page;
			this.loadData();
		},
		handleSizeChange(pageSize) {
			const { activeName } = this;
			this[activeName].pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 手工录入保证金
		inputDeposit() {
			this.inputDepositVisible = true;
		},
		// 录入保证金 - 取消
		cancelInputDeposit(formName) {
			this.inputDepositVisible = false;
			this.$refs[formName].resetFields();
		},
		// 录入保证金 - 确定
		saveInputDeposit(formName) {
			this.$refs[formName].validate(async (valid) => {
				if (valid) {
					const { depositForm, baseInfo } = this;
					const data = {
						...depositForm,
						storeCode: baseInfo.storeCode,
					};
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/store/addDepositApply`,
						data,
					});
					if (res && res.code == 200) {
						this.loadData();
					} else {
						this.$message({
							type: 'error',
							message: '操作失败',
						});
					}
					this.inputDepositVisible = false;
					this.$refs[formName].resetFields();
				}
			});
		},
		// 搜索
		handleSearch() {
			const { activeName } = this;
			this[activeName].pagination.currentPage = 1;
			this.loadData();
		},
		// 切换tabs
		handleTabChange() {
			this.loadData();
		},
		// 审核操作
		audit(row) {
			this.rowContent = { ...row };
			this.moneyAuditVisible = true;
		},
		// 款项审核 - 取消
		cancelAudit(formName) {
			this.moneyAuditVisible = false;
			this.$refs[formName].resetFields();
		},
		// 款项审核 - 保存
		async saveAudit(formName) {
			const { id, money, depositType } = this.rowContent;
			const { storeCode } = this.baseInfo;
			const data = {
				...this.auditForm,
				id,
				money,
				depositType,
				storeCode,
			};
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/store/verifyDeposit',
				data,
			});
			if (res && res.code === 200) {
				this.$message.success('审核成功');
				this.moneyAuditVisible = false;
				this.$refs[formName].resetFields();
				this.loadData();
			} else {
				this.$message.error('操作失败');
			}
		},
		// 获取基本信息
		async loadBaseInfo() {
			const res = await this.$fetch(`/mgmt/store/listDeposit?storeCode=${this.baseInfo.storeCode}`);
			if (res && res.data) {
				const { list } = res.data;
				const { depositMoney, speciallyMoney } = list[0];
				this.baseInfo = { ...this.baseInfo, depositMoney, speciallyMoney };
			} else {
				this.$message.warning('获取服务中心基本信息失败');
			}
		},
		// 获取列表数据
		async loadData() {
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/store/getDepositDetailInfo?${qs.stringify(this.loadDataPost)}`,
			});
			if (res && res.data) {
				const { activeName } = this;
				const { list, total } = res.data;
				this[activeName].data = list;
				this[activeName].total = total;
			} else {
				this.$message.error('获取列表数据失败');
			}
			this.loadBaseInfo();
		},
	},
	computed: {
		loadDataPost() {
			const { searchConfig, activeName, TAB_OPTIONS } = this;
			const { storeCode } = this.baseInfo;
			const { currentPage, pageSize } = this[activeName].pagination;
			let data = {
				...searchConfig,
				storeCode,
				verifyStatus: TAB_OPTIONS[activeName].type,
				pageNum: currentPage,
				pageSize,
			};
			data.type = Number(data.type);
			if (searchConfig.timerange) {
				data.startTime = formatDateDefault(searchConfig.timerange[0]);
				data.endTime = formatDateDefault(searchConfig.timerange[1]);
				delete data.timerange;
			}
			return data;
		},
		formatDate() {
			return formatDate;
		},
	},
	mounted() {
		const { storeCode, storeName, companyName, leaderName, depositMoney, speciallyMoney } = this.$route.query;
		if (storeCode) {
			// this.storeCode = storeCode;
			this.baseInfo = { storeCode, storeName, companyName, leaderName, depositMoney, speciallyMoney };
			this.loadData();
		}
		window.addEventListener('keydown', this.enterHandler);
	},
	beforeDestroy() {
		window.removeEventListener('keydown', this.enterHandler);
	},
};
</script>

<style lang="scss" scoped>
::v-deep.open-store-deposit-detail {
	.base-info {
		.card-title {
			margin-bottom: 8px;
		}
		.el-row {
			line-height: 40px;
			font-size: 12px;
		}
	}
	.mb16 {
		margin-bottom: 16px;
	}
	.bottom-tips {
		color: #d9001b;
		font-size: 12px;
		line-height: 24px;
	}
	.deposit-pop-form {
		span.col-left-item {
			display: inline-block;
			width: 120px;
			text-align: right;
			padding-right: 12px;
			box-sizing: border-box;
		}
	}
}
@media screen and (max-width: 1367px) {
	::v-deep.deposit-input-dialog {
		.el-dialog {
			margin-top: 5vh !important;
		}
	}
}
</style>