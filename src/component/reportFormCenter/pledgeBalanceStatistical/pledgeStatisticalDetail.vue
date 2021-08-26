<template>
	<div class="pledge_statistical_detail">
		<guideBar>
			<el-button type="primary" @click="batchExport">导出EXCEL</el-button>
		</guideBar>
		<el-card>
			<p class="caard_title">综合信息</p>
			<el-form :model="baseInfo" label-width="140px" label-suffix=":">
				<el-row>
					<el-col :span="6">
						<el-form-item label="月份">
							{{ baseInfo && baseInfo.month && String(baseInfo.month).replace(/(\d{4})(\d{2})/, `$1-$2`) }}
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="服务中心编号">
							{{ baseInfo && baseInfo.storeNo }}
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="所属分公司编号">
							{{ baseInfo && baseInfo.companyCode }}
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="服务中心名称">
							{{ baseInfo && baseInfo.storeName }}
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<tableList border :dataSource="[baseInfo]" :columns="PLEDGE_STATISTICAL_BASE_LIST_COLUMNS" />
		</el-card>
		<el-card>
			<searchPanel :config="STATISTICAL_DETAIL_SEARCH_CONFIG" v-model="searchConfig" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				border
				ref="multipleTable"
				:dataSource="list"
				:columns="STATISTICAL_DETAIL_COLUMNS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="{ index: true, labelIndex: '序号' }"
				showSummary
				:summary-method="getSummaries"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button type="text" @click="infoLink(scope.data)" v-if="scope.data.recordType in linkKey">详情</el-button>
					<span v-else>--</span>
				</template>
			</tableList>
		</el-card>
	</div>
</template>
<script>
import { formatDate } from 'util/formValidation';
import { exportExcel } from 'util';
import {
	STATISTICAL_DETAIL_COLUMNS,
	STATISTICAL_DETAIL_SEARCH_CONFIG,
	PLEDGE_STATISTICAL_LIST_COLUMNS,
} from './config';
export default {
	name: 'pledgeStatisticalDetail',
	data() {
		const PLEDGE_STATISTICAL_BASE_LIST_COLUMNS = PLEDGE_STATISTICAL_LIST_COLUMNS.slice(3, 14).map((item) => {
			return {
				...item,
				headerConfig: null,
			};
		});
		return {
			STATISTICAL_DETAIL_COLUMNS,
			STATISTICAL_DETAIL_SEARCH_CONFIG,
			PLEDGE_STATISTICAL_BASE_LIST_COLUMNS,
			searchConfig: {},
			list: [],
			dataTotal: 0,
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			summaryData: null,
			rowInfo: {}, // 每行数据信息
			baseInfo: {}, // 列表页传递过来的数据
			linkKey: {
				// 拥有关联单号的数据
				14: 'pledge',
				15: 'pledegReturn',
				17: 'mallOrder',
				18: 'mallReturn',
			},
		};
	},
	watch: {
		'searchConfig.reportType'(val) {
			if (val) {
				this.searchConfig.sevenBankType = null;
				this.searchConfig.tenType = null;
			}
		},
		'searchConfig.sevenBankType'(val) {
			if (val) {
				this.searchConfig.reportType = null;
				this.searchConfig.tenType = null;
			}
		},
		'searchConfig.tenType'(val) {
			if (val) {
				this.searchConfig.sevenBankType = null;
				this.searchConfig.reportType = null;
			}
		},
	},
	computed: {
		// 搜索参数
		loadDataPost() {
			const {
				baseInfo: { storeNo: storeCode },
				searchConfig,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			let data = {
				storeCode,
				...searchConfig,
				pageNum,
				pageSize,
			};
			if (data.monthrange) {
				data.beginMonth = formatDate(data.monthrange[0]).substr(0, 7).replace('-', '');
				data.endMonth = formatDate(data.monthrange[1]).substr(0, 7).replace('-', '');
				delete data.monthrange;
			}
			return data;
		},
	},
	methods: {
		// 导出
		batchExport() {
			exportExcel('/months/mortgage/exportBillsReportDetail', this.loadDataPost);
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
		// 详情跳转
		async infoLink(row) {
			const { linkKey } = this;
			const { businessId, tenType } = row;

			const urlCol = {
				pledge: {
					url: 'charging_detail',
					params: {
						title: '押货单详情',
						orderSn: businessId,
						type: 'detail',
					},
				},
				pledegReturn: {
					url: 'return_exchange_detail',
					params: {
						title: '押货退货详情',
						orderSn: businessId,
						type: 'detail',
					},
				},
				mallOrder: {
					url: 'customer_order_detail',
					params: {
						title: '顾客订单详情',
						orderNo: businessId,
					},
				},
				mallReturn: {
					url: 'return_goods_details',
					params: {
						title: '顾客退货详情',
						returnNo: businessId,
					},
				},
			};
			if (tenType && tenType in linkKey) {
				this.$go(urlCol[linkKey[tenType]].url, urlCol[linkKey[tenType]].params);
			}
		},
		// 合计
		getSummaries() {
			const { summaryData, dataTotal } = this;
			const sums = [];
			if (summaryData) {
				STATISTICAL_DETAIL_COLUMNS.forEach((column, index) => {
					if (column.summary) {
						const prop = `total${column.prop.charAt(0).toUpperCase() + column.prop.slice(1)}`;
						sums[index] = prop in summaryData ? summaryData[prop] : '';
					} else {
						sums[index] = '';
					}
				});
			}
			sums.splice(0, 1);
			this.$nextTick(() => {
				this.$refs['multipleTable'].$children[0].doLayout();
			});
			return ['', `合计: ${dataTotal}条`, ...sums];
		},
		// 请求数据
		async loadData() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/months/mortgage/billsReportDetailPage',
				data: this.loadDataPost,
				timeout: 3 * 60000,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
				this.summaryData = { ...list[0] };
			} else {
				this.list = [];
				this.dataTotal = 0;
				this.$message.error('获取列表数据失败');
			}
		},
	},
	created() {
		let rowInfo = this.$route.query.info || '{}';
		this.baseInfo = JSON.parse(rowInfo);
		this.$nextTick(() => {
			const { beginMonth, endMonth } = this.baseInfo;
			this.searchConfig.monthrange = [new Date(beginMonth).getTime(), new Date(endMonth).getTime()];
			this.loadData();
		});
	},
};
</script>
<style lang="scss" scoped>
::v-deep.pledge_statistical_detail {
	.total-money-line {
		margin-bottom: 8px;
	}
}
</style>
