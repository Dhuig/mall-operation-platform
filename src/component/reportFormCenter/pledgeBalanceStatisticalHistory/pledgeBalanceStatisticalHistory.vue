<template>
	<div class="pledge-balance-statistical-history">
		<guideBar>
			<!-- <el-button type="primary" v-permission="'pledge_statistical_history_export'">导出</el-button> -->
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="PLEDGE_STATISTICAL_HISTORY_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<el-row type="flex">
				<span class="color-red">*</span>
				如果查询当月
				<span class="color-red">有产品调价</span>
				，本月
				<span class="fw-bold">调整金额</span>
				将在
				<span class="fw-bold">月结日</span>
				进行计算，将影响
				<span class="color-red">本月剩余押货额</span>
			</el-row>
		</el-card>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="list"
				:columns="PLEDGE_STATISTICAL_HISTORY_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button type="text" v-permission="'pledge_statistical_history_detail'" @click="toDetail(scope.data)">
						查看明细
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { PLEDGE_STATISTICAL_HISTORY_SEARCH_CONFIG, PLEDGE_STATISTICAL_HISTORY_COLUMNS_CONFIG } from './config';
import qs from 'querystring';
import { formatDateDefault } from 'util/formValidation';
export default {
	name: 'pledgeBalanceStatisticalHistory',
	data() {
		return {
			PLEDGE_STATISTICAL_HISTORY_SEARCH_CONFIG,
			PLEDGE_STATISTICAL_HISTORY_COLUMNS_CONFIG,
			searchConfig: {},
			loading: false,
			list: [],
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
		};
	},
	computed: {
		loadDataParams({ searchConfig, pagination: { currentPage: pageNo, pageSize } }) {
			let data = {
				...searchConfig,
				pageNo,
				pageSize,
			};
			if (data.monthrange) {
				data.startMonth = data.monthrange[0] ? formatDateDefault(data.monthrange[0]).substr(0, 7) : null;
				data.endMonth = data.monthrange[1] ? formatDateDefault(data.monthrange[1]).substr(0, 7) : null;
				delete data.monthrange;
			}
			return data;
		},
	},
	methods: {
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
		},
		// 翻页
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 查看明细
		toDetail(row) {
			this.$go('pledge_statistical_detail_history', { ...row });
		},
		// 分公司选项 初始化
		initServiceCompanyOptions() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			this.PLEDGE_STATISTICAL_HISTORY_SEARCH_CONFIG.form[1].options = serviceCompanyOptions.map(({ value }) => ({
				label: value,
				value,
			}));
		},
		// 获取列表数据
		async loadData() {
			const res = await this.$fetch(`/1.0/history/inmortgageReportNew/list?${qs.stringify(this.loadDataParams)}`);
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
	},
	mounted() {
		this.initServiceCompanyOptions();
	},
};
</script>

<style lang="scss" scoped>
.pledge-balance-statistical-history {
	.color-red {
		color: $primary;
	}
	.fw-bold {
		font-weight: bold;
	}
}
</style>