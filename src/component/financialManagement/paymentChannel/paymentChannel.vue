<template>
	<div class="payment-channel">
		<guideBar>
			<el-button v-permission="'payment_channel_batch_export'" type="primary" @click="batchOutput">批量导出</el-button>
		</guideBar>
		<el-card class="box-card">
			<searchPanel v-model="searchConfig" :config="PAYMENT_CHANNEL_SEARCH" @search="handleSearch" />
		</el-card>
		<el-card class="box-card" v-loading="allInfoLoading">
			<div class="title">综合信息</div>
			<div class="infor">
				<el-form :model="allInfo" label-width="130px">
					<el-row align="middle" type="flex">
						<el-col :span="6">
							<el-form-item label="当日交易金额(元)">￥{{ allInfo.tradeAmount }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="当日退款金额(元)">￥{{ allInfo.refundAmount }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="当日交易笔数">{{ allInfo.tradeCount }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="当日退款笔数">{{ allInfo.refundCount }}</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-card>
		<el-card class="box-card">
			<tableList
				:loading="loading"
				:dataSource="list"
				:columns="PAYMENT_CHANNEL_COLUMNS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template>
					<span>--</span>
				</template>
			</tableList>
		</el-card>
	</div>
</template>
<script>
import { PAYMENT_CHANNEL_SEARCH, PAYMENT_CHANNEL_COLUMNS } from './config';
import { formatDateDefault } from 'util/formValidation.js';
import { optionGenerator, exportExcel } from 'util';
export default {
	name: 'paymentChannel',
	data() {
		return {
			PAYMENT_CHANNEL_SEARCH,
			PAYMENT_CHANNEL_COLUMNS,
			searchConfig: {},
			allInfoLoading: false,
			allInfo: {},
			loading: false,
			list: [],
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 0,
		};
	},
	methods: {
		// 批量导出
		batchOutput() {
			exportExcel('/mgmt/pay/verifyAcct/export', this.loadDataPost);
		},
		// 查询事件
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
			this.loadAllInfo();
		},
		// 分页触发事件
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 分页下拉触发事件
		handleSizeChange(pageSize) {
			this.pagination = {
				currentPage: 1,
				pageSize: pageSize,
			};
			this.loadData();
		},
		// 分公司选项 初始化
		initCompanyOptions() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			this.PAYMENT_CHANNEL_SEARCH.form[0].options = serviceCompanyOptions.map(({ label, value }) => ({
				label: `${value} ${label}`,
				value,
			}));
		},
		// 获取字典映射
		async getDicts() {
			const [PAY_CHANNEL, VERIFY_ACCT_STATUS] = await Promise.all([
				this.$getDict('PAY_CHANNEL'),
				this.$getDict('VERIFY_ACCT_STATUS'),
			]);
			if (PAY_CHANNEL) {
				this.PAYMENT_CHANNEL_SEARCH.form[2].options = optionGenerator(PAY_CHANNEL);
			}
			if (VERIFY_ACCT_STATUS) {
				this.PAYMENT_CHANNEL_SEARCH.form[3].options = [
					{ label: '全部', value: '' },
					...optionGenerator(VERIFY_ACCT_STATUS),
				];
			}
		},
		// 获取综合信息
		async loadAllInfo() {
			this.allInfoLoading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/pay/verifyAcct/total',
				data: this.loadDataPost,
				timeout: 60000,
				callback: () => {
					this.allInfoLoading = false;
				},
			});
			if (res && res.data) {
				this.allInfo = res.data;
			} else {
				this.$message({
					type: 'error',
					message: '获取数据失败',
				});
			}
		},
		// 获取列表信息
		async loadData() {
			this.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/pay/verifyAcct/query',
				data: this.loadDataPost,
				timeout: 60000,
				callback: () => {
					this.loading = false;
				},
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
		},
	},
	watch: {
		'searchConfig.tradeDate'(val) {
			if (Array.isArray(val)) {
				this.searchConfig.tradeDate = null;
			}
		},
	},
	computed: {
		loadDataPost() {
			const {
				searchConfig,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			let data = {
				...searchConfig,
				pageNum,
				pageSize,
			};
			if (data.tradeDate) {
				data.tradeDate = formatDateDefault(data.tradeDate);
			}
			return data;
		},
	},
	created() {
		this.$nextTick(() => {
			this.searchConfig.tradeDate = new Date().getTime();
			this.loadData();
			this.loadAllInfo();
			this.getDicts();
			this.initCompanyOptions();
		});
	},
};
</script>
<style lang="scss" scoped>
::v-deep.payment-channel {
	.title {
		margin-bottom: 16px;
		font-weight: 500;
		color: rgba(48, 51, 54, 1);
	}
	.infor {
		padding: 16px;
		box-sizing: border-box;
		overflow: hidden;
		font-size: 13px;
		text-align: center;
		.el-form-item {
			margin-bottom: 0;
		}
		.el-form-item__label {
			color: #666;
			background: #f5f5f5;
		}
	}
}
</style>
