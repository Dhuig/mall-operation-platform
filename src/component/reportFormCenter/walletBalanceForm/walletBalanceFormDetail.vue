<template>
	<div class="wallet-balance-form-detail">
		<guideBar>
			<el-button type="primary" @click="batchExport">导出EXCEL</el-button>
		</guideBar>
		<el-card>
			<div class="baseinfo-title">综合信息</div>
			<el-form :model="baseInfo" label-width="100px" label-suffix=":">
				<el-row>
					<el-col :span="4">
						<el-form-item label="月份">{{ baseInfo.month || '' }}</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="分公司编号">{{ baseInfo.companyCode || '' }}</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="会员卡号">{{ baseInfo.cardNo || '' }}</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="顾客姓名">{{ baseInfo.realname || '' }}</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="顾客类型">
							{{ baseInfo.memberType || '' }}
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<tableList class="base-tablelist" border :dataSource="[baseInfo]" :columns="WALLET_BALANCE_BASE_COLUMNS_CONFIG" />
		</el-card>
		<el-card>
			<searchPanel v-model="searchConfig" :config="WALLET_BALANCE_DETAIL_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="list"
				:columns="WALLET_BALANCE_DETAIL_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="{ index: true, labelIndex: '序号' }"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			>
				<template slot-scope="scoped" slot="orderNo">
					<el-button
						v-if="scoped.row.orderNoList && scoped.row.orderNoList.length > 1"
						class="order-button"
						size="small"
						type="text"
						@click="previewOrderNo(scoped.row)"
					>
						{{ scoped.row.orderNo }}等{{ scoped.row.orderNoList.length }}张
					</el-button>
					<span v-else>{{ scoped.row.orderNo }}</span>
				</template>
			</tableList>
		</el-card>
		<!-- 多个订单号弹窗显示 -->
		<el-dialog title="关联单号" :visible.sync="orderNoModalVisible" width="500px">
			<tableList border :dataSource="orderNoList" :columns="ORDER_LIST_COLUMNS" :height="300" />
			<el-row type="flex" justify="center">
				<el-button type="primary" @click="orderNoModalVisible = false">确定</el-button>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import {
	WALLET_BALANCE_COLUMNS_CONFIG,
	WALLET_BALANCE_DETAIL_SEARCH_CONFIG,
	WALLET_BALANCE_DETAIL_COLUMNS_CONFIG,
} from './config';
import { ORDER_LIST_COLUMNS } from '@/component/financialManagement/perfectWallet/config';
import { formatDateDefault } from 'util/formValidation.js';
import { exportExcelPost } from 'util';
export default {
	name: 'walletBalanceFormDetail',
	data() {
		const WALLET_BALANCE_BASE_COLUMNS_CONFIG = WALLET_BALANCE_COLUMNS_CONFIG.slice(6).map(item => {
			return {
				...item,
				headerConfig: null,
			};
		});
		return {
			WALLET_BALANCE_DETAIL_SEARCH_CONFIG,
			WALLET_BALANCE_DETAIL_COLUMNS_CONFIG,
			WALLET_BALANCE_BASE_COLUMNS_CONFIG,
			ORDER_LIST_COLUMNS,
			searchConfig: {},
			baseInfo: {},
			loading: false,
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
			list: [],
			conflictFields: ['receptionTransType', 'backstageTransType', 'reportField'],
			orderNoModalVisible: false, // 关联单号显示弹窗状态
			orderNoList: [], // 关联单号详情弹窗 列表数据
		};
	},
	watch: {
		'searchConfig.receptionTransType'(val) {
			if (val) {
				this.conflictFields.map(item => {
					this.searchConfig[item] = item != 'receptionTransType' ? null : val;
				});
			}
		},
		'searchConfig.backstageTransType'(val) {
			if (val) {
				this.conflictFields.map(item => {
					this.searchConfig[item] = item != 'backstageTransType' ? null : val;
				});
			}
		},
		'searchConfig.reportField'(val) {
			if (val) {
				this.conflictFields.map(item => {
					this.searchConfig[item] = item != 'reportField' ? null : val;
				});
			}
		},
	},
	computed: {
		loadDataPost() {
			const {
				searchConfig,
				baseInfo: { month, walletId },
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			let data = {
				...searchConfig,
				month,
				walletId,
				pageNum,
				pageSize,
			};
			if (data.monthrange) {
				data.transMonthStart = data.monthrange[0] ? formatDateDefault(data.monthrange[0]).substr(0, 7) : null;
				data.transMonthEnd = data.monthrange[1] ? formatDateDefault(data.monthrange[1]).substr(0, 7) : null;
				delete data.monthrange;
			}
			return data;
		},
	},
	methods: {
		// 导出excel
		batchExport() {
			exportExcelPost('/months/wallet/exportBillsWalletDetailReport', this.loadDataPost, '钱包余额详情报表');
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
		// 切换单页条数
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 查看关联单号详情
		previewOrderNo(data) {
			this.orderNoModalVisible = true;
			const { orderNoList } = data;
			this.orderNoList = [...orderNoList];
		},
		// 获取前端交易类型
		async loadFrontTransType() {
			const res = await this.$fetch(`/months/wallet/walletFrontBizType`);
			if (res && res.code == 200) {
				this.WALLET_BALANCE_DETAIL_SEARCH_CONFIG.form[2].options = res.data.map(item => ({
					label: item.biztypeDesc,
					value: item.biztype,
				}));
			} else {
				this.$message.warning('前端交易类型未更新');
			}
		},
		// 获取报表字段选项
		async loadReportField() {
			const res = await this.$fetch(`/months/wallet/walletReportField`);
			if (res && res.code == 200) {
				this.WALLET_BALANCE_DETAIL_SEARCH_CONFIG.form[1].options = res.data.map(item => ({
					label: item.biztypeDesc,
					value: item.biztype,
				}));
			} else {
				this.$message.warning('报表字段未更新');
			}
		},
		// 获取后台交易类型
		async loadBackTransType() {
			const res = await this.$fetch(`/months/wallet/walletBackBizType`);
			if (res && res.code == 200) {
				this.WALLET_BALANCE_DETAIL_SEARCH_CONFIG.form[3].options = res.data.map(item => ({
					label: item.biztypeDesc,
					value: item.biztype,
				}));
			} else {
				this.$message.warning('后台交易类型未更新');
			}
		},
		// // 获取列表数据
		// async loadData() {
		// 	const res = await this.$fetch(`/months/wallet/billsWalletDetailReport?${qs.stringify(this.loadDataPost)}`);
		// 	if (res && res.data) {
		// 		const { list, total } = res.data;
		// 		this.list = list;
		// 		this.dataTotal = total;
		// 	} else {
		// 		this.$message.error('获取列表数据失败，请查询服务是否可用');
		// 	}
		// },
		// 获取列表数据 (改为直接使用完美钱包详情接口)
		async loadData() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/getTransDetail',
				data: this.loadDataPost,
			});
			if (res && res.data) {
				const { page } = res.data;
				// this.summaryList = { transAmt: totalAmt };
				this.list = page?.list || [];
				this.dataTotal = page?.total || 0;
			} else {
				this.$message.error(`获取数据失败，请查询服务是否可用`);
			}
		},
	},
	mounted() {
		const { info } = this.$route.query;
		this.baseInfo = { ...JSON.parse(info) };
		this.loadReportField();
		this.loadBackTransType();
		this.loadFrontTransType();
		this.$nextTick(() => {
			const time = new Date(String(this.baseInfo.month).replace(/(\d{4})(\d{2})/, `$1-$2`)).getTime();
			this.searchConfig.monthrange = [time, time];
			this.loadData();
		});
	},
};
</script>

<style lang="scss" scoped>
::v-deep.wallet-balance-form-detail {
	// .el-form-item {
	// 	margin-bottom: 0;
	// }
	.base-tablelist {
		.el-table {
			height: 100px !important;
		}
	}
}
</style>