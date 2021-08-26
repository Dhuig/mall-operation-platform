<template>
	<div class="perfect-wallet-detail">
		<guideBar>
			<el-button type="primary" @click="batchExport">批量导出</el-button>
		</guideBar>
		<el-card class="box-card">
			<el-form :model="baseInfo" label-width="120px" label-suffix=":">
				<el-row v-if="baseInfo">
					<el-col :span="6">
						<el-form-item label="分公司编号">{{ baseInfo.companyNo }}</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="会员卡号" v-if="baseInfo.cardType != 1">{{ baseInfo.cardNo }}</el-form-item>
						<el-form-item label="普客手机号码" v-else>{{ baseInfo.mobile }}</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="顾客姓名">{{ baseInfo.realname }}</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="顾客类型">{{ baseInfo.cardType && CUSTOMER_TYPE[baseInfo.cardType] }}</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<el-card>
			<el-row type="flex" justify="end">
				<el-button type="primary" @click="previewWalletReport">查看历史月结报表</el-button>
			</el-row>
			<tableList :dataSource="[baseInfo]" :columns="BASE_INFO_LIST_COLUMNS" />
		</el-card>
		<el-card class="box-card">
			<searchPanel v-model="searchConfig" :config="PERFECT_WALLET_DETAIL_CONFIG" @search="handleSearch" />
		</el-card>
		<!-- 表格 -->
		<el-card class="box-card">
			<tableList
				border
				ref="multipleTable"
				:dataSource="list"
				:columns="DETAIL_COLUMNS_ONE"
				:pagination="pagination"
				:dataTotal="dataTotal"
				showSummary
				:summary-method="getSummaries"
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
	LIST_COLUMNS,
	PERFECT_WALLET_DETAIL_CONFIG,
	DETAIL_COLUMNS_ONE,
	PAY_METHOD,
	ORDER_LIST_COLUMNS,
} from './config';
import { CUSTOMER_TYPE } from '@/component/customerManagement/config';
import { exportExcelPost } from 'util';
import { formatDateDefault, formatDate } from 'util/formValidation.js';
export default {
	name: 'perfectWalletDetail',
	data() {
		const BASE_INFO_LIST_COLUMNS = LIST_COLUMNS.slice(5, 14).map(item => ({
			...item,
			headerConfig: null,
		}));
		return {
			BASE_INFO_LIST_COLUMNS,
			PERFECT_WALLET_DETAIL_CONFIG,
			DETAIL_COLUMNS_ONE,
			CUSTOMER_TYPE,
			PAY_METHOD,
			ORDER_LIST_COLUMNS,
			summaryList: null, //合计对象
			searchConfig: { transactionMonth: '', transType: '', orderNo: '' },
			walletId: '',
			cardNo: '',
			baseInfo: null,
			list: [],
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 0,
			orderNoModalVisible: false, // 关联单号显示弹窗状态
			orderNoList: [], // 关联单号详情弹窗 列表数据
		};
	},
	methods: {
		batchExport() {
			const timeStr = formatDate(new Date().getTime());
			exportExcelPost('/mgmt/fin/wallet/exportWalletBillList', this.loadDataPost, '钱包交易明细_' + timeStr, {
				timeout: 10000,
			});
		},
		// 查询事件
		handleSearch() {
			this.loadData();
		},
		// 查看历史月结报表
		previewWalletReport() {
			const { cardNo, mobile } = this.baseInfo;
			this.$go('wallet_balance_form', { cardNo, mobile });
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
				pageSize,
			};
			this.loadData();
		},
		// 查看关联单号详情
		previewOrderNo(data) {
			this.orderNoModalVisible = true;
			const { orderNoList } = data;
			this.orderNoList = [...orderNoList];
		},
		// 合计
		getSummaries() {
			const sums = [];
			const { summaryList } = this;
			if (summaryList) {
				DETAIL_COLUMNS_ONE.forEach((column, index) => {
					if (column.summary) {
						sums[index] = column.prop in summaryList ? summaryList[column.prop] : '';
						sums[index] = typeof sums[index] == 'number' ? '' + sums[index] : '';
					} else {
						sums[index] = '';
					}
				});
			}
			sums.shift();
			this.$nextTick(() => {
				this.$refs['multipleTable'].$children[0].doLayout();
			});
			return ['合计:', ...sums];
		},
		// 获取字典映射
		async getDicts() {
			const [PAY_METHOD] = await Promise.all([this.$getDict('PAY_METHOD')]);
			PAY_METHOD && (this.PAY_METHOD = PAY_METHOD);
		},
		// 获取列表数据
		async loadData() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/getTransDetail',
				data: this.loadDataPost,
			});
			if (res && res.data) {
				const { page, totalAmt } = res.data;
				this.summaryList = { transAmt: totalAmt };
				this.list = page ? page.list : [];
				this.dataTotal = page ? page.total : 0;
			} else {
				this.$message.error(`获取数据失败，请查询服务是否可用`);
			}
		},
		loadInit() {
			this.$nextTick(() => {
				this.searchConfig.transactionMonth = [new Date().getTime(), new Date().getTime()];
				this.loadData();
			});
		},
	},
	computed: {
		loadDataPost() {
			const {
				baseInfo: { walletId },
				pagination: { currentPage: pageNum, pageSize },
				searchConfig,
			} = this;
			let data = {
				walletId,
				...searchConfig,
				pageNum,
				pageSize,
			};
			if (searchConfig.transactionMonth) {
				data.transMonthStart = formatDateDefault(searchConfig.transactionMonth[0]).substr(0, 7);
				data.transMonthEnd = formatDateDefault(searchConfig.transactionMonth[1]).substr(0, 7);
				delete data.transactionMonth;
			}
			return data;
		},
	},
	watch: {
		'searchConfig.receptionTransType'(val) {
			if (val) {
				this.searchConfig.reportField = null;
				this.searchConfig.backstageTransType = null;
			}
		},
		'searchConfig.reportField'(val) {
			if (val) {
				this.searchConfig.receptionTransType = null;
				this.searchConfig.backstageTransType = null;
			}
		},
		'searchConfig.backstageTransType'(val) {
			if (val) {
				this.searchConfig.reportField = null;
				this.searchConfig.receptionTransType = null;
			}
		},
	},
	mounted() {
		const { info } = this.$route.query;
		if (info) {
			this.baseInfo = { ...JSON.parse(info) };
			this.getDicts();
			this.loadInit();
		}
	},
};
</script>
<style lang="scss" scoped>
::v-deep.order-button {
	span {
		white-space: pre-wrap;
	}
}
</style>
