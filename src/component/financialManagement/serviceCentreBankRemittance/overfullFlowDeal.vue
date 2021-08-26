<template>
	<div class="unknown-flow-deal">
		<guideBar>
			<el-button v-permission="'overfull_flow_deal_export'" type="primary" @click="batchExport">导出EXCEL</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="UNKNOWN_FLOW_DEAL_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeName">
				<el-tab-pane label="待处理" name="pending">
					<tableList
						:loading="pending.loading"
						:dataSource="pending.list"
						:columns="UNKNOWN_FLOW_DEAL_COLUMNS_CONFIG"
						:pagination="pending.pagination"
						:dataTotal="pending.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button v-permission="'overfull_flow_deal_detail'" type="text" @click="detail(scope.data)">
								详情
							</el-button>
							<el-button v-permission="'overfull_flow_deal_process'" type="text" @click="dealWith(scope.data)">
								处理
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="已处理" name="processed">
					<tableList
						:loading="processed.loading"
						:dataSource="processed.list"
						:columns="UNKNOWN_FLOW_DEAL_COLUMNS_CONFIG"
						:pagination="processed.pagination"
						:dataTotal="processed.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button v-permission="'overfull_flow_deal_detail'" type="text" @click="detail(scope.data)">
								详情
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 详情 -->
		<bank-remittance-pop
			:bankRemitProps="bankRemitProps"
			:confirmBtnSwitch="canConfirm"
			@confirm="dealConfirm"
			@cancel="dealCancel"
		/>
	</div>
</template>

<script>
import {
	UNKNOWN_FLOW_DEAL_SEARCH_CONFIG,
	UNKNOWN_FLOW_DEAL_COLUMNS_CONFIG,
	COLUMNS_OPTIONS_ADD_DEALMAN,
	UNKNOWN_DEAL_STATUS,
	PAYMENT_TYPE,
} from './config';
import { formatDateDefault } from 'util/formValidation.js';
import bankRemittancePop from './modal/bankRemittancePop.vue';
import { exportExcel } from 'util';
export default {
	name: 'overfullFlowDeal',
	components: {
		'bank-remittance-pop': bankRemittancePop,
	},
	data() {
		return {
			UNKNOWN_FLOW_DEAL_SEARCH_CONFIG,
			UNKNOWN_FLOW_DEAL_COLUMNS_CONFIG,
			UNKNOWN_DEAL_STATUS,
			searchConfig: {},
			activeName: 'pending',
			pending: {
				loading: false,
				list: [],
				pagination: { currentPage: 1, pageSize: 10 },
				total: 0,
			},
			processed: {
				loading: false,
				list: [],
				pagination: { currentPage: 1, pageSize: 10 },
				total: 0,
			},
			bankRemitProps: { show: false, type: 1 },
			canConfirm: true,
		};
	},
	watch: {
		activeName(val) {
			const tempArr = COLUMNS_OPTIONS_ADD_DEALMAN.map((item) => item.prop);
			this.UNKNOWN_FLOW_DEAL_COLUMNS_CONFIG = [
				...this.UNKNOWN_FLOW_DEAL_COLUMNS_CONFIG.filter((item) => !tempArr.includes(item.prop)),
			];
			if (val == 'processed') {
				this.UNKNOWN_FLOW_DEAL_COLUMNS_CONFIG.splice(7, 0, ...COLUMNS_OPTIONS_ADD_DEALMAN);
			}
			this.loadData();
		},
	},
	computed: {
		loadDataPost() {
			const { searchConfig, activeName, UNKNOWN_DEAL_STATUS } = this;
			let data = {
				...searchConfig,
				dealStatus: UNKNOWN_DEAL_STATUS[activeName],
				pageNum: this[activeName].pagination.currentPage,
				pageSize: this[activeName].pagination.pageSize,
			};
			if (data.sysTime) {
				data.sysStartTime = formatDateDefault(data.sysTime[0]);
				data.sysEndTime = formatDateDefault(data.sysTime[1]);
			}
			return data;
		},
	},
	methods: {
		// 导出EXCEL
		batchExport() {
			exportExcel('/mgmt/inventory/remit/exportOverRemitList', this.loadDataPost);
		},
		// 搜索
		handleSearch() {
			const { activeName } = this;
			this[activeName].pagination.currentPage = 1;
			this.loadData();
		},
		// 翻页操作
		handleChangePage(page) {
			const { activeName } = this;
			this[activeName].pagination.currentPage = page;
			this.loadData();
		},
		// 切换每页条数
		handleSizeChange(pageSize) {
			const { activeName } = this;
			this[activeName].pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 详情
		detail(row) {
			this.bankRemitProps = { ...this.bankRemitProps, ...row, show: true, type: 1 };
		},
		// 处理操作
		dealWith(row) {
			this.bankRemitProps = { ...this.bankRemitProps, ...row, show: true, type: 2 };
		},
		// 处理 -- 取消
		dealCancel() {
			this.bankRemitProps.show = false;
		},
		// 处理 -- 确定
		async dealConfirm(data) {
			this.canConfirm = false;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/inventory/remit/overRemit/deal',
				data,
			});
			if (res && res.code === 200) {
				this.$message.success('处理成功');
				this.bankRemitProps.show = false;
				this.loadData();
			} else {
				this.$message.error('处理失败');
			}
			this.canConfirm = true;
		},
		// 获取银行列表
		async loadBankList() {
			const res = await this.$fetch(`/crm/member/serviceCompany/bankOfDeposit?type=openBankCode`);
			if (res && res.data) {
				this.UNKNOWN_FLOW_DEAL_SEARCH_CONFIG.form[2].options = res.data.map((item) => {
					return {
						value: item.name,
						label: item.name,
					};
				});
			} else {
				this.$message.warning('获取银行列表失败');
			}
		},
		// 获取款项类型与调整原因规则映射
		async loadPaymentAdjustMap() {
			const res = await this.$fetch(`/mgmt/inventory/remit/getReasonByType?detailType=2`);
			if (res && res.data) {
				// let result = {};
				// this.paymentAdjustMap = res.data;
				this.bankRemitProps.sourceTypeList = [...res.data.slice(2, 4)];
				res.data.map((item) => {
					PAYMENT_TYPE[item.type] = item.name;
				});
			} else {
				this.$message.error('获取款项类型与调整原因规则映射失败');
			}
		},
		// 获取超额流水列表数据
		async loadData() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/inventory/remit/overRemit/pageList',
				data: this.loadDataPost,
			});
			if (res && res.data) {
				const { activeName } = this;
				const { list, total } = res.data;
				this[activeName].list = list;
				this[activeName].total = total;
				if (list.length === 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取无法识别流水列表数据失败');
			}
		},
	},
	mounted() {
		this.loadPaymentAdjustMap();
		this.loadData();
		this.loadBankList();
	},
};
</script>

<style></style>
