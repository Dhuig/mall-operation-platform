<template>
	<div class="business-contract-template-config">
		<el-row class="fs-14">
			<span class="font-bold">当前经营合同：</span>
			{{ contractData[curContractTemplate] || '暂不设置' }}
			<el-button type="primary" @click="toConfig" v-permission="'service_contract_setting_business_button'">
				设置
			</el-button>
			<el-button type="text" @click="previewLogs" v-permission="'service_contract_setting_modify_history'">
				修改记录
			</el-button>
		</el-row>
		<!-- 设置经营合同 -->
		<el-dialog v-drag title="设置经营合同" :visible.sync="configDialogVisible" width="700px">
			<div>选择一个已启用的合同模板做为经营合同，设置之后会更新服务中心“是否已经签署合同”的状态。</div>
			<el-row>
				<el-col :span="24" class="no-config-line">
					<!-- <el-radio :label="''">暂不设置</el-radio> -->
					<el-checkbox v-model="configData.noTemplate">暂不设置</el-checkbox>
				</el-col>
				<el-radio-group v-model="configData.templateNo" style="width: 100%;">
					<el-col :span="24">
						<el-table :data="configTableData" style="width: 100%;">
							<el-table-column prop="date" label="选择">
								<template slot-scope="scope">
									<el-radio :label="scope.row.templateNo"><span></span></el-radio>
								</template>
							</el-table-column>
							<el-table-column prop="createTime" label="添加时间">
								<template slot-scope="scope">
									<span>{{ formatDate(scope.row.createTime) }}</span>
								</template>
							</el-table-column>
							<el-table-column prop="templateName" label="合同模板名称"></el-table-column>
						</el-table>
					</el-col>
				</el-radio-group>
			</el-row>
			<div class="footer-button-group">
				<el-button @click="cancelConfig">取消</el-button>
				<el-button type="primary" @click="saveConfig">保存设置</el-button>
			</div>
		</el-dialog>
		<!-- 修改记录 -->
		<el-dialog v-drag title="设置记录" :visible.sync="configLogsVisible" width="700px">
			<el-card class="change-logs-box">
				<tableList
					:dataSource="list"
					:columns="BUSINESS_CONTRACT_CHANGE_LOGS_COLUMNS"
					:dataTotal="dataTotal"
					:pagination="pagination"
				/>
			</el-card>
		</el-dialog>
	</div>
</template>

<script>
import { formatDate } from 'util/formValidation';
import qs from 'querystring';
export default {
	name: 'businessContractTemplateConfig',
	data() {
		const BUSINESS_CONTRACT_CHANGE_LOGS_COLUMNS = [
			{
				prop: 'createTime',
				label: '设置时间',
				align: 'center',
				formatter: ({ createTime }) => {
					return formatDate(createTime);
				},
			},
			{ prop: 'templateName', label: '设置经营合同', align: 'center' },
			{ prop: 'submitterName', label: '操作人', align: 'center' },
		];
		return {
			BUSINESS_CONTRACT_CHANGE_LOGS_COLUMNS,
			list: [],
			dataTotal: 0,
			pagination: { currentPage: 1, pageSize: 10 },
			contractData: {},
			curContractTemplate: '暂不设置',
			configDialogVisible: false,
			configData: { templateNo: '', noTemplate: false },
			configTableData: [],
			configLogsVisible: false,
		};
	},
	watch: {
		'configData.noTemplate'(val) {
			if (val) {
				this.configData.templateNo = '';
			}
		},
		'configData.templateNo'(val) {
			this.configData.noTemplate = !val;
		},
	},
	computed: {
		formatDate() {
			return formatDate;
		},
	},
	methods: {
		async toConfig() {
			this.configDialogVisible = true;
			await this.loadContractTemplateList();
			this.$nextTick(() => {
				const { configTableData } = this;
				this.configData.noTemplate = !configTableData.some(({ isBusiness }) => isBusiness == 1);
				configTableData.map(({ isBusiness, templateNo }) => {
					isBusiness == 1 ? (this.configData.templateNo = templateNo) : '';
				});
			});
		},
		cancelConfig() {
			this.configData = { templateNo: '', noTemplate: false };
			this.configDialogVisible = false;
		},
		async saveConfig() {
			const { templateNo } = this.configData;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/settingBusinessTemplate?templateNo=${templateNo}`,
			});
			if (res && res.code === 200) {
				this.$message.success('设置成功');
				this.curContractTemplate = templateNo;
				this.cancelConfig();
				this.loadContractTemplateList();
			} else {
				this.$message.error((res && res.data.message) || '设置失败');
			}
		},
		previewLogs() {
			this.configLogsVisible = true;
			this.loadContractChangeLogs();
		},
		// 获取经营合同变更日志列表
		async loadContractChangeLogs() {
			const { currentPage: pageNum, pageSize } = this.pagination;
			const res = await this.$fetch(`/mgmt/store/contractBizLogList?${qs.stringify({ pageNum, pageSize })}`);
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
			} else {
				this.$message.error('获取经营合同变更日志列表失败');
			}
		},
		// 获取合同模板下拉列表
		async loadContractTemplateList() {
			const res = await this.$fetch(`/mgmt/store/queryContractTemplateList`);
			if (res && res.code === 200) {
				res.data &&
					res.data.map(({ templateNo, templateName, isBusiness }) => {
						this.contractData[templateNo] = templateName;
						isBusiness == 1 ? (this.curContractTemplate = templateNo) : '';
					});
				this.configTableData = res.data;
			} else {
				this.$message.error('获取合同模板下拉列表失败');
			}
		},
	},
	mounted() {
		this.loadContractTemplateList();
	},
};
</script>

<style lang="scss" scoped>
::v-deep.business-contract-template-config {
	.fs-14 {
		font-size: 14px;
	}
	.no-config-line {
		margin: 16px 0;
	}
	.footer-button-group {
		margin-top: 16px;
		display: flex;
		justify-content: flex-end;
	}
	.change-logs-box {
		max-height: 500px;
		overflow: auto;
	}
}
.font-bold {
	font-weight: bold;
}
</style>
