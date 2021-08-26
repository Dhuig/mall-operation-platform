<template>
	<div class="exchangeGoodsList">
		<guideBar>
			<el-button
				v-permission="'exchange_goods_export_btn'"
				type="primary"
				:loading="exportLoading"
				@click="batchExport"
			>
				导出
			</el-button>
		</guideBar>
		<el-card class="box-card">
			<searchPanel v-model="searchConfig" :config="EXCHANGE_GOODS_SEARCH" @search="resetLoad" />
		</el-card>
		<el-card class="box-card">
			<el-tabs v-model="activeTab">
				<el-tab-pane v-for="([label, name], $idx) in EXCHANGE_GOODS_TABS_LIST" :key="$idx" :label="label" :name="name">
					<div slot="label">
						<template>
							{{ label }}
							<el-badge
								v-if="name == 'authstr' && tabTotal > 0"
								:max="99"
								:value="tabTotal"
								class="item"
								type="warning"
							/>
						</template>
					</div>
					<tableList
						:dataSource="tabPanes[activeTab].data"
						:columns="EXCHANGE_GOODS_COLUMNS"
						:pagination="tabPanes[activeTab].pagination"
						:dataTotal="tabPanes[activeTab].total"
						:loading="tabPanes[activeTab].loading"
						@handleSizeChange="handleSizeChange"
						@handleChangePage="handleChangePage"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'exchange_Goods_detail|exchange_goods_details'"
								type="text"
								@click="onDetail(scope.data)"
							>
								详情
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import {
	EXCHANGE_GOODS_SEARCH,
	EXCHANGE_GOODS_COLUMNS,
	EXCHANGE_GOODS_TABS_LIST,
	TABITEM,
	EXCHANGE_GOODS_STATUS_MAP,
} from './config';
import { formatDateDefault } from '@/util/formValidation.js';
import qs from 'querystring';

export default {
	name: 'exchangeGoodsList',
	data() {
		const tabPanes = Object.create(null);
		EXCHANGE_GOODS_TABS_LIST.map(tabItem => (tabPanes[tabItem[1]] = new TABITEM()));
		return {
			EXCHANGE_GOODS_SEARCH,
			EXCHANGE_GOODS_COLUMNS,
			EXCHANGE_GOODS_STATUS_MAP,
			EXCHANGE_GOODS_TABS_LIST,
			activeTab: 'all',
			tabTotal: null,
			searchConfig: {
				applyTime: [],
				applySource: '',
				expressType: '',
				companyName: '',
				companyCode: '',
				storeName: '',
				storeCode: '',
				customerCard: '',
				creatorCard: '',
				exchangeNo: '',
				orderNo: '',
			},
			exportLoading: false,
			tabPanes,
		};
	},
	computed: {
		// 换货单状态
		exchangeStatus() {
			return EXCHANGE_GOODS_STATUS_MAP[this.activeTab];
		},
		// 搜索字段
		searchFields() {
			const {
				searchConfig,
				exchangeStatus,
				searchConfig: { applyTime = ['', ''] },
			} = this;
			const params = {
				...searchConfig,
				exchangeStatus,
				applyTimeBegin: formatDateDefault(applyTime[0]) || '',
				applyTimeEnd: formatDateDefault(applyTime[1]) || '',
			};
			console.log(params);
			delete params.applyTime;
			return params;
		},
	},
	watch: {
		exchangeStatus: {
			immediate: true,
			handler() {
				this.resetLoad();
			},
		},
	},
	methods: {
		// 导出
		async batchExport() {
			this.exportLoading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/order/exchange/exportList',
				data: this.searchFields,
				callback: () => {
					this.exportLoading = false;
				},
			});
			if (res?.code == 200) {
				this.$message.success('excel表格正在生成中，请在下载管理查看');
			} else {
				this.$message.error('操作失败');
			}
		},
		// 分页触发事件
		handleChangePage(currentPage) {
			this.tabPanes[this.activeTab].pagination.currentPage = currentPage;
			this.loadData();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.tabPanes[this.activeTab].pagination.pageSize = pageSize;
			this.tabPanes[this.activeTab].pagination.currentPage = 1;
			this.loadData();
		},
		resetLoad() {
			this.tabPanes[this.activeTab].pagination.currentPage = 1;
			this.tabPanes[this.activeTab].data = [];
			this.$nextTick(this.loadData);
			this.getTotal();
		},
		async loadData() {
			const { activeTab, searchFields } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabPanes[activeTab];

			const params = {
				pageNum,
				pageSize,
				...searchFields,
			};

			this.tabPanes[activeTab].loading = true;

			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/order/exchange/getOrderExchangeList',
				params,
			});

			this.tabPanes[activeTab].loading = false;

			if (res && res.data) {
				const { list, total } = res.data;
				if (list && list.length) {
					this.tabPanes[activeTab].data = list;
					this.tabPanes[activeTab].total = total;
				} else {
					this.tabPanes[activeTab].data = [];
					this.tabPanes[activeTab].total = 0;
				}
			} else {
				this.$message.warning('查询退货列表数据失败');
			}
		},
		// 获取统计
		async getTotal() {
			const res = await this.$fetch(`/mgmt/order/exchange/countWaitAudit?${qs.stringify(this.searchFields)}`);
			if (res.code == 200) {
				this.tabTotal = res.data;
			} else {
				this.tabTotal = 0;
			}
		},
		//换货详情
		onDetail(info) {
			const { exchangeNo } = info;
			this.$go('exchange_goods_details', { exchangeNo });
		},
		// 获取分公司信息
		loadCompanyList() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			this.EXCHANGE_GOODS_SEARCH.form[4].options = serviceCompanyOptions.map(({ label, value }) => ({
				label: `${value} ${label}`,
				value,
			}));
		},
	},
	mounted() {
		this.loadCompanyList();
	},
};
</script>
<style lang="scss" scoped>
::v-deep .el-badge {
	height: 20px;
	line-height: 20px;
	margin-bottom: 20px;
}
</style>
