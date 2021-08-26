<template>
	<div>
		<guideBar>
			<!-- <el-button type="primary" v-permission="'branch_bank_flow_form_exporteas'">导出EAS凭证</el-button>
			<el-button type="primary" v-permission="'branch_bank_flow_form_batchexport'">批量导出</el-button> -->
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="BARNCH_BANK_FLOW_FORM_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<div class="section-title">综合信息</div>
			<el-row class="section-body">
				<el-col :span="6">
					云商收入汇总：¥{{ (allInfo.cloudSellerSum && formatCurrency(allInfo.cloudSellerSum)) || '0.00' }}
				</el-col>
				<el-col :span="6">
					云+收入汇总：¥{{ (allInfo.cloudPlusSellerSum && formatCurrency(allInfo.cloudPlusSellerSum)) || '0.00' }}
				</el-col>
				<el-col :span="6">优惠顾客收入汇总：¥{{ (allInfo.vipSum && formatCurrency(allInfo.vipSum)) || '0.00' }}</el-col>
				<el-col :span="6">
					普通顾客收入汇总：¥{{ (allInfo.nomalSum && formatCurrency(allInfo.nomalSum)) || '0.00' }}
				</el-col>
			</el-row>
		</el-card>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="list"
				:columns="BARNCH_BANK_FLOW_FORM_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			/>
		</el-card>
	</div>
</template>

<script>
import { BARNCH_BANK_FLOW_FORM_SEARCH_CONFIG, BARNCH_BANK_FLOW_FORM_COLUMNS_CONFIG } from './config';
import { formatDateDefault, formatCurrency } from 'util/formValidation';
export default {
	name: 'branchCompanyBankFlowForm',
	data() {
		return {
			BARNCH_BANK_FLOW_FORM_SEARCH_CONFIG,
			BARNCH_BANK_FLOW_FORM_COLUMNS_CONFIG,
			searchConfig: {},
			allInfo: {},
			loading: false,
			list: [],
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
		};
	},
	computed: {
		loadDataParams() {
			const {
				searchConfig,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			let data = {
				...searchConfig,
				pageNum,
				pageSize,
			};
			if (data.accountTime) {
				data.beginAccountTime = data.accountTime[0] ? formatDateDefault(data.accountTime[0]) : null;
				data.finishAccountTime = data.accountTime[1] ? formatDateDefault(data.accountTime[1]) : null;
				delete data.accountTime;
			}
			return data;
		},
		formatCurrency() {
			return formatCurrency;
		},
	},
	methods: {
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.getData();
		},
		// 翻页
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 切换每页条数
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 分公司options选项初始化
		initBranchCompanyOptions() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			this.BARNCH_BANK_FLOW_FORM_SEARCH_CONFIG.form[2].options = serviceCompanyOptions.map(({ value }) => ({
				label: value,
				value,
			}));
		},
		// 获取综合信息
		async loadAllInfo() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/1.0/history/companyBank/flow/queryCustomerSum',
				data: this.loadDataParams,
				timeout: 60000,
			});
			if (res && res.data) {
				this.allInfo = res.data;
			} else {
				this.$message.error('获取综合信息数据失败');
			}
		},
		//获取列表数据
		async loadData() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/1.0/history/companyBank/flow/queryList`,
				data: this.loadDataParams,
				timeout: 60000,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list || [];
				this.dataTotal = total || 0;
				if (!list) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
		getData() {
			this.loadData();
			this.loadAllInfo();
		},
	},
	mounted() {
		this.initBranchCompanyOptions();
	},
};
</script>

<style lang="scss" scoped>
.section-title {
	line-height: 16px;
	margin-bottom: 16px;
	font-weight: bold;
}
.section-body {
	color: $color-body-se;
}
</style>