<template>
	<div class="service-fee-schedule">
		<guideBar>
			<el-button v-permission="'service_fee_schedule_export_excel'" type="primary" @click="exportExcel">
				导出Excel
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="SERVICE_FEE_SCHEDULE_SEARCH" @search="handleSearch" />
		</el-card>
		<el-card>
			<div class="title">综合信息</div>
			<div class="infor">
				<el-row>
					<el-col :span="8">
						<div class="infor-item">
							<el-row>
								<el-col :span="6">
									<div class="infor-item-left">当月合计：</div>
								</el-col>
								<el-col :span="18">
									<div class="infor-item-right">{{ monthTotalMoney }}元</div>
								</el-col>
							</el-row>
						</div>
					</el-col>
				</el-row>
			</div>
		</el-card>
		<!-- 表格 -->
		<el-card>
			<el-tabs v-model="active" @tab-click="handleTabChange">
				<el-tab-pane
					v-for="(item, index) in SERVICE_FEE_SCHEDULE_HEADER_CONFIG"
					:key="index"
					:label="item.name"
					:name="item.type"
					class="fade"
				>
					<div class="table-content">
						<tableList
							border
							:loading="loading"
							:dataSource="SERVICE_FEE_DATA[item.prop].data"
							:columns="SERVICE_FEE_SCHEDULE_COLUMNS_CONFIG"
							:pagination="SERVICE_FEE_DATA[item.prop].pagination"
							:dataTotal="SERVICE_FEE_DATA[item.prop].total"
							@handleChangePage="handleChangePage"
							@handleSizeChange="handleSizeChange"
						></tableList>
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import {
	SERVICE_FEE_SCHEDULE_SEARCH,
	SERVICE_FEE_SCHEDULE_HEADER_CONFIG,
	SERVICE_FEE_SCHEDULE_COLUMNS_CONFIG,
	SERVICE_FEE_DATA,
} from './config';
import { exportExcelPost } from 'util';
import { formatDateDefault, formatDate } from 'util/formValidation.js';
export default {
	name: 'serviceFeeSchedule',
	data() {
		return {
			SERVICE_FEE_SCHEDULE_SEARCH,
			SERVICE_FEE_SCHEDULE_HEADER_CONFIG,
			SERVICE_FEE_SCHEDULE_COLUMNS_CONFIG,
			SERVICE_FEE_DATA,
			searchConfig: {},
			active: '1',
			loading: false,
			monthTotalMoney: '',
		};
	},
	methods: {
		// 导出excel
		exportExcel() {
			const timeStr = formatDate(new Date().getTime());
			exportExcelPost('/mgmt/fin/wallet/fee/exportFinWalletFee', this.loadDataPost, '手续费明细表_' + timeStr);
		},
		// 搜索
		handleSearch() {
			const { SERVICE_FEE_SCHEDULE_HEADER_CONFIG, active } = this;
			this.SERVICE_FEE_DATA[SERVICE_FEE_SCHEDULE_HEADER_CONFIG[active].prop].pagination.currentPage = 1;
			this.loadData();
		},
		// 切换tab
		handleTabChange() {
			this.loadData();
		},
		// 翻页
		handleChangePage(page) {
			const { SERVICE_FEE_SCHEDULE_HEADER_CONFIG, active } = this;
			this.SERVICE_FEE_DATA[SERVICE_FEE_SCHEDULE_HEADER_CONFIG[active].prop].pagination.currentPage = page;
			this.loadData();
		},
		// 修改页面数据条数
		handleSizeChange(pageSize) {
			const { SERVICE_FEE_SCHEDULE_HEADER_CONFIG, active } = this;
			this.SERVICE_FEE_DATA[SERVICE_FEE_SCHEDULE_HEADER_CONFIG[active].prop].pagination = {
				currentPage: 1,
				pageSize: pageSize,
			};
			this.loadData();
		},
		// 获取分公司编号
		loadCompanyNo() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			this.SERVICE_FEE_SCHEDULE_SEARCH.form[1].options = serviceCompanyOptions.map(({ value }) => ({
				label: value,
				value,
			}));
		},
		// 获取综合信息数据
		async loadAllInfo() {
			let data = {
				...this.loadDataPost,
			};
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/fee/queryFinWalletFeeAmt',
				data,
			});
			if (res && res.code == 200) {
				this.monthTotalMoney = Number(res.data).toFixed(2);
			} else {
				this.$message.error('获取综合信息数据失败');
			}
		},
		// 获取列表数据
		async loadData() {
			this.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/fee/queryFinWalletFee',
				data: this.loadDataPost,
				callback: () => {
					this.loading = false;
				},
			});
			if (res && res.code === 200) {
				const { list, total } = res.data;
				const { active, SERVICE_FEE_SCHEDULE_HEADER_CONFIG } = this;
				this.SERVICE_FEE_DATA[SERVICE_FEE_SCHEDULE_HEADER_CONFIG[active].prop].data = list;
				this.SERVICE_FEE_DATA[SERVICE_FEE_SCHEDULE_HEADER_CONFIG[active].prop].total = total;
			} else {
				this.$message.error('获取列表数据失败');
			}
			this.loadAllInfo();
		},
	},
	computed: {
		loadDataPost() {
			const { searchConfig, SERVICE_FEE_DATA, SERVICE_FEE_SCHEDULE_HEADER_CONFIG, active } = this;
			const { currentPage: pageNum, pageSize } =
				SERVICE_FEE_DATA[SERVICE_FEE_SCHEDULE_HEADER_CONFIG[active].prop].pagination;
			let data = {
				...searchConfig,
				memberType: Number(active),
				pageNum,
				pageSize,
			};
			console.log(data.feeMonth);
			if (data.feeMonth) {
				data.feeMonth = formatDateDefault(data.feeMonth).substr(0, 7);
			}
			return data;
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.loadData();
			this.loadCompanyNo();
		});
	},
};
</script>

<style lang="scss" scoped>
::v-deep.service-fee-schedule {
	.title {
		margin-bottom: 24px;
		font-weight: 500;
	}
	.infor-item {
		border: 1px $color-divider solid;
		overflow: hidden;
		box-sizing: border-box;
		font-size: 13px;
		width: 100%;
	}
	.infor-item-left {
		padding: 15px 8px;
		text-align: right;
		color: $color-body-se;
		background: $bg-disabled;
	}
	.infor-item-right {
		padding: 15px 8px;
		text-align: left;
	}
}
</style>
