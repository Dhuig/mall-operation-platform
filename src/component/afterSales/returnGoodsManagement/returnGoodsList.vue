<template>
	<div>
		<guideBar>
			<el-button v-permission="'retrn_goods_export'" type="primary" :loading="exportLoading" @click="batchExport">
				导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="RETURN_GOODS_SEARCH" @search="search" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeTab">
				<el-tab-pane v-for="([label, name], $idx) in RETURN_GOODS_TABLIST" :key="$idx" :label="label" :name="name">
					<div slot="label">
						<template>
							<template>
								{{ label }}
								<el-badge v-if="name == '1' && tabTotal > 0" :max="99" :value="tabTotal" class="item" type="warning" />
							</template>
						</template>
					</div>
					<tableList
						:columns="RETURN_GOODS_COLUMNS"
						:pagination="tabPanes[activeTab].pagination"
						:dataTotal="tabPanes[activeTab].total"
						:loading="tabPanes[activeTab].loading"
						:dataSource="tabPanes[activeTab].data"
						@handleSizeChange="handleSizeChange"
						@handleChangePage="handleChangePage"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'retrn_Goods_detail|return_goods_details'"
								type="text"
								@click="viewDetail(scope.data)"
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
import { RETURN_GOODS_SEARCH, RETURN_GOODS_TABLIST, RETURN_GOODS_COLUMNS, TABITEM } from './config';
import { formatDateDefault } from '@/util/formValidation.js';
import { genCurrentMonthFirstAndLastDay } from 'util';
import qs from 'querystring';

export default {
	name: 'returnGoodsList',
	data() {
		const tabPanes = Object.create(null);
		RETURN_GOODS_TABLIST.map(tabItem => (tabPanes[tabItem[1]] = new TABITEM()));
		return {
			RETURN_GOODS_SEARCH,
			RETURN_GOODS_TABLIST,
			RETURN_GOODS_COLUMNS,
			activeTab: '0',
			tabTotal: null,
			searchConfig: {
				applySource: '',
				companyCode: '',
				companyName: '',
				creatorCard: '',
				customerCard: '',
				expressType: '',
				returnNo: '',
				returnType: '',
				storeCode: '',
				applyTime: genCurrentMonthFirstAndLastDay(),
				orderDeliverStatus: '',
			},
			exportLoading: false,
			tabPanes,
		};
	},
	computed: {
		// 搜索参数
		searchFields() {
			const {
				searchConfig,
				searchConfig: { applyTime = ['', ''] },
				activeTab,
			} = this;
			const { pagination } = this.tabPanes[this.activeTab];

			const params = {
				...searchConfig,
				...pagination,
				applyTimeBegin: formatDateDefault(applyTime[0]) || '',
				applyTimeEnd: formatDateDefault(applyTime[1]) || '',
			};
			delete params.applyTime;
			if (activeTab != '0') {
				params.returnStatus = activeTab;
			}
			return params;
		},
	},
	watch: {
		activeTab: {
			immediate: true,
			handler() {
				this.search();
			},
		},
	},
	methods: {
		// 导出
		async batchExport() {
			this.exportLoading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/order/return/exportList',
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
		// 获取退货管理列表数据
		async loadData() {
			const { searchFields } = this;
			const { currentPage } = this.tabPanes[this.activeTab].pagination;
			this.loading = true;
			const params = {
				...searchFields,
				pageNum: currentPage,
			};
			this.tabPanes[this.activeTab].loading = true;
			const res = await this.$fetch({
				url: `/mgmt/order/return/getOrderReturnList?${qs.stringify(params)}`,
				timeout: 60000 * 1,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.tabPanes[this.activeTab].data = list;
				this.tabPanes[this.activeTab].total = total;
			} else {
				this.tabPanes[this.activeTab].data = [];
				this.tabPanes[this.activeTab].total = 0;
				this.$message.warning('搜索无数据，请检查查询条件');
			}
			this.tabPanes[this.activeTab].loading = false;
		},
		// 搜索事件
		search() {
			this.tabPanes[this.activeTab].pagination.currentPage = 1;
			this.tabPanes[this.activeTab].data = [];
			this.$nextTick(this.loadData);
			this.getTotal();
		},
		// 获取统计
		async getTotal() {
			const res = await this.$fetch(`/mgmt/order/return/countWaitAudit?${qs.stringify(this.searchFields)}`);
			if (res.code == 200) {
				this.tabTotal = res.data;
			} else {
				this.tabTotal = 0;
			}
		},
		// 退货详情
		viewDetail(info) {
			const { returnNo } = info;
			this.$go('return_goods_details', { returnNo });
		},
		// 获取分公司信息
		loadCompanyList() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			const company = serviceCompanyOptions.map(({ label, value }) => ({
				label: `${value} ${label}`,
				value,
			}));
			this.RETURN_GOODS_SEARCH.form[4].options = company;
			this.RETURN_GOODS_SEARCH.form[5].options = company;
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
