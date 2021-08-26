<template>
	<div class="bank-remittance-flow">
		<guideBar>
			<el-button
				v-permission="'bank_remittance_flow_export'"
				type="primary"
				v-bind:loading="exportLoading"
				@click="batchExport"
			>
				导出EXCEL
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="BANK_REMITTANCE_FLOW_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				ref="multipleTable"
				:loading="loading"
				:dataSource="list"
				:columns="BANK_REMITTANCE_FLOW_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				showSummary
				:summary-method="getSummaries"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button v-permission="'bank_remittance_flow_detail'" type="text" @click="detail(scope.data)">
						详情
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 详情 -->
		<bank-remittance-pop :bankRemitProps="bankRemitProps" />
		<hand-input-pop :handInputProps="handInputProps" />
	</div>
</template>

<script>
import { BANK_REMITTANCE_FLOW_SEARCH_CONFIG, BANK_REMITTANCE_FLOW_COLUMNS_CONFIG, BANK_TYPE } from './config';
import { formatDateDefault } from 'util/formValidation.js';
import bankRemittancePop from './modal/bankRemittancePop.vue';
import handInputPop from './modal/handIinputPop.vue';
export default {
	name: 'bankRemittanceFlow',
	components: {
		'bank-remittance-pop': bankRemittancePop,
		'hand-input-pop': handInputPop,
	},
	data() {
		return {
			BANK_REMITTANCE_FLOW_SEARCH_CONFIG,
			BANK_REMITTANCE_FLOW_COLUMNS_CONFIG,
			exportLoading: false, // 导出loading
			searchConfig: {},
			paymentTotal: '',
			list: [],
			loading: false,
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 0,
			summaryData: {},
			bankRemitProps: { show: false, type: 1 },
			handInputProps: { show: false, type: 1, env: 'bankFlow' },
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
			if (data.sysTime) {
				data.sysStartTime = data.sysTime[0] ? formatDateDefault(data.sysTime[0]) : null;
				data.sysEndTime = data.sysTime[1] ? formatDateDefault(data.sysTime[1]) : null;
				delete data.sysTime;
			}
			if (data.verifyTime) {
				data.verifyStartTime = data.verifyTime[0] ? formatDateDefault(data.verifyTime[0]) : null;
				data.verifyEndTime = data.verifyTime[1] ? formatDateDefault(data.verifyTime[1]) : null;
				delete data.verifyTime;
			}
			if (data.inputTime) {
				data.inputStartTime = data.inputTime[0] ? formatDateDefault(data.inputTime[0]) : null;
				data.inputEndTime = data.inputTime[1] ? formatDateDefault(data.inputTime[1]) : null;
				delete data.inputTime;
			}
			return data;
		},
	},
	methods: {
		// 导出
		async batchExport() {
			this.exportLoading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/inventory/remit/exportBankRemitList',
				data: this.loadDataPost,
				callback: () => {
					this.exportLoading = false;
				},
			});
			if (res && res.code == 200) {
				this.$message.success('excel表格正在生成中，请在下载管理查看');
			} else {
				this.$message.error('操作失败');
			}
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
		// 切换每页条数
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 详情
		detail(row) {
			console.log('详情');
			const { moneyFrom } = row;
			row.dealStatus = 1;
			row.dealType == 1 ? (row.verifyer = '系统') : '';
			if (moneyFrom == 3) {
				this.handInputProps = { show: true, type: 1, env: 'bankFlow', ...row };
			} else {
				this.bankRemitProps = { show: true, type: 1, ...row };
			}
		},
		// 获取银行列表
		async loadBankList() {
			const res = await this.$fetch(`/crm/member/serviceCompany/bankOfDeposit?type=openBankCode`);
			if (res && res.data) {
				this.BANK_REMITTANCE_FLOW_SEARCH_CONFIG.form[2].options = res.data.map(item => {
					BANK_TYPE[item.code] = item.name;
					return {
						value: item.name,
						label: item.name,
					};
				});
			} else {
				this.$message.warning('获取银行列表失败');
			}
		},
		// 合计
		getSummaries() {
			const { summaryData } = this;
			const sums = [];
			if (summaryData) {
				BANK_REMITTANCE_FLOW_COLUMNS_CONFIG.forEach((column, index) => {
					if (column.summary) {
						const prop = `${column.prop}`;
						sums[index] = prop in summaryData ? '￥' + summaryData[prop] : '';
					} else {
						sums[index] = '';
					}
				});
			}
			sums.splice(0, 1);
			this.$nextTick(() => {
				this.$refs['multipleTable'].$children[0].doLayout();
			});
			return ['合计:', ...sums];
		},
		// 获取款项类型数据
		async loadPaymentType() {
			const res = await this.$fetch(`/mgmt/inventory/remit/getSourceTypeByRemitType?remitType=1`);
			if (res && res.data) {
				this.BANK_REMITTANCE_FLOW_SEARCH_CONFIG.form[3].options = res.data.map(({ type: value, name: label }) => {
					return {
						label,
						value,
					};
				});
			} else {
				this.$message.error('获取款项类型数据失败');
			}
		},
		// 获取银行流水搜索列表款项金额统计
		async loadDataTotal() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/inventory/remit/sumBankRemitAmount',
				data: this.loadDataPost,
			});
			if (res && res.code === 200) {
				this.summaryData = { remitMoney: res.data };
			} else {
				this.$message.error('获取银行流水金额统计失败');
			}
		},
		// 获取银行汇款流水列表数据
		async loadData() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/inventory/remit/bank/pageList',
				data: this.loadDataPost,
			});
			if (res && res.data) {
				let { list, total } = res.data;
				list.map(item => {
					if (item.dealType == 1) {
						item.verifyer = '无';
						item.remark = '无';
					}
				});
				this.list = list;
				this.dataTotal = total;
				if (list.length === 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取银行流水列表数据失败');
			}
			this.loadDataTotal();
		},
	},
	mounted() {
		this.loadPaymentType();
		this.loadData();
		this.loadBankList();
	},
};
</script>

<style lang="scss" scoped>
::v-deep.bank-remittance-flow {
	.paymeng-total {
		font-size: 14px;
		.name {
			text-align: right;
		}
	}
}
</style>
