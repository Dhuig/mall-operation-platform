<template>
	<div class="freight-subsidy-voucher-management">
		<guideBar />
		<el-card class="box-card fs13">
			<searchPanel v-model="searchConfig" :config="FREIGHT_SUBSIDY_VOUCHER_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card class="box-card fs13">
			<span>运费补贴合计：¥{{ subsidyMoney }}</span>
		</el-card>
		<el-card class="box-card">
			<tableList
				border
				:dataSource="list"
				:columns="FREIGHT_SUBSIDY_VOUCHER_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button v-permission="'freight_subsidy_voucher_management_detail'" type="text" @click="detail(scope.data)">
						详情
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { FREIGHT_SUBSIDY_VOUCHER_SEARCH_CONFIG, FREIGHT_SUBSIDY_VOUCHER_COLUMNS_CONFIG } from './config';
import { formatDate, formatDateDefault } from 'util/formValidation.js';
export default {
	name: 'freightSubsidyVoucherManagement',
	data() {
		return {
			FREIGHT_SUBSIDY_VOUCHER_SEARCH_CONFIG,
			FREIGHT_SUBSIDY_VOUCHER_COLUMNS_CONFIG,
			searchConfig: {},
			subsidyMoney: 0, // 补贴金额合计
			list: [],
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 0,
		};
	},
	methods: {
		handleSearch() {
			this.loadData();
		},
		// 翻页操作
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 切换页面条数
		handleSizeChange(pageSize) {
			this.pagination = {
				currentPage: 1,
				pageSize,
			};
			this.loadData();
		},
		// 详情
		detail(row) {
			this.$go('freight_subsidy_voucher_detail', { grantdtlId: row.grantdtlId });
		},
		// 获取运费补贴合计
		async loadSubsidyMoney() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/voucher/freight/subsidy/queryFreightSubsidyAmtManager',
				data: this.loadDataPost,
			});
			if (res && res.code === 200) {
				this.subsidyMoney = res.data;
			} else {
				this.$message({
					type: 'error',
					message: res.message,
				});
			}
		},
		// 获取列表数据
		async loadData() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/voucher/freight/subsidy/queryFreightSubsidyManagerInfo',
				data: this.loadDataPost,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
			} else {
				this.$message({
					type: 'error',
					message: '获取数据失败',
				});
			}
			this.loadSubsidyMoney();
		},
	},
	computed: {
		loadDataPost() {
			const { searchConfig } = this;
			const { currentPage, pageSize } = this.pagination;
			let data = {
				...searchConfig,
				pageNum: currentPage,
				pageSize,
			};
			if (data.timerange) {
				data.startTime = data.timerange[0] ? formatDate(data.timerange[0]) : null;
				data.endTime = data.timerange[1] ? formatDateDefault(data.timerange[1]) + ' 23:59:59' : null;
				delete data.timerange;
			}
			return data;
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.loadData();
		});
	},
};
</script>

<style lang="scss" scoped>
.freight-subsidy-voucher-management {
	.box-card {
		margin-bottom: 16px;
	}
	.fs13 {
		font-size: 13px;
	}
}
</style>
