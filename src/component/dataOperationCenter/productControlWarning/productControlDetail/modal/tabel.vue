<template>
	<div>
		<el-tabs v-model="activeTab" v-if="activeTab">
			<el-tab-pane v-for="({ label, name }, $idx) in tablist" :key="$idx" :label="label" :name="name">
				<searchPanel v-model="TABEL_SEARCH_MODEL[name]" :config="TABEL_SEARCH[name]" @search="search" />
				<tableList
					:columns="columns"
					:pagination="tabPanes[activeTab].pagination"
					:dataTotal="tabPanes[activeTab].total"
					:loading="tabPanes[activeTab].loading"
					:dataSource="tabPanes[activeTab].data"
					@handleSizeChange="handleSizeChange"
					@handleChangePage="handleChangePage"
					slotcontent
				>
					<template slot-scope="scope">
						<el-button v-permission="'product_control_detail_look'" type="text" @click="viewDetail(scope.data)">
							查看明细
						</el-button>
					</template>
				</tableList>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import { TABLIST, TABEL_SEARCH, TABEL_SEARCH_MODEL, TABITEM, TABEL_COLUMNS, TABEL_API } from './config.js';
import qs from 'querystring';

export default {
	name: 'table',
	props: {
		placeMonthStr: {
			type: String,
		},
		info: {
			type: Object,
		},
		ruleId: {
			type: String,
		},
		tableData: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		const tabPanes = Object.create(null);
		TABLIST.map(({ name }) => (tabPanes[name] = new TABITEM()));
		return {
			activeTab: null,
			TABLIST,
			TABEL_SEARCH,
			TABEL_SEARCH_MODEL,
			tabPanes,
		};
	},
	watch: {
		tableData: {
			handler(newValue) {
				this.activeTab = this.activeTab
					? this.activeTab
					: newValue.length > 1
					? 'buyWarning'
					: newValue[0]?.type == 0
					? 'buyWarning'
					: 'payWarning';
				this.$nextTick(this.search);
			},
			deep: true,
			immediate: true,
		},
		activeTab: {
			handler() {
				this.$nextTick(this.search);
			},
		},
	},
	computed: {
		// 搜索参数
		searchFields() {
			const { TABEL_SEARCH_MODEL, activeTab, placeMonthStr, ruleId, tableData } = this;

			const {
				pagination: { currentPage, pageSize },
			} = this.tabPanes[activeTab];
			const statisticId = tableData.find(({ status }) => activeTab == status)?.statisticId;
			const params = {
				...TABEL_SEARCH_MODEL[activeTab],
				pageSize,
				placeMonthStr,
				ruleId,
				statisticId,
				pageNum: currentPage,
			};
			return params;
		},
		tablist() {
			const { tableData } = this;
			if (tableData.length > 1) {
				return TABLIST;
			} else {
				return TABLIST.filter((x, index) => {
					if (tableData[0]?.type == 0) {
						return index == 0 || index == 2;
					} else {
						return index == 1 || index == 3;
					}
				});
			}
		},
		columns({ activeTab, info: { productCode } }) {
			let result = TABEL_COLUMNS[activeTab].map(x => {
				if (x.show) {
					x.isShow = () => !(productCode == '所有产品');
				}
				return x;
			});
			if (['payWarning', 'importantPayWarning'].includes(activeTab)) {
				result[2].width = '200';
				result[8].width = '150';
			}
			return result;
		},
	},
	methods: {
		// 查看明细
		viewDetail({ customerCard, customerName, openCardTime, centerCode, productPv }) {
			const { activeTab, info, tableData, ruleId, placeMonthStr } = this;
			// 购货预警 -------
			const [buy, pay] = tableData;
			let warningRuleWord;
			const isBuyWarning = ['buyWarning', 'importantBuyWarning'].includes(activeTab);
			if (tableData.length == 2) {
				warningRuleWord = isBuyWarning ? buy.warningRuleWord : pay.warningRuleWord;
			} else {
				warningRuleWord = tableData[0].warningRuleWord;
			}
			// ---------------
			this.$go('warning_detailed_list', {
				...info,
				activeTab,
				placeMonthStr,
				warningRuleWord,
				isBuyWarning: Number(isBuyWarning),
				customerCard,
				customerName,
				openCardTime,
				centerCode,
				productPv,
				ruleId,
			});
		},
		search() {
			this.tabPanes[this.activeTab].pagination.currentPage = 1;
			this.tabPanes[this.activeTab].data = [];
			this.loadData();
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
			const { searchFields, activeTab } = this;
			const params = {
				...searchFields,
			};
			this.tabPanes[activeTab].loading = true;
			const res = await this.$fetch({
				url: `${TABEL_API[this.activeTab]}?${qs.stringify(params)}`,
				timeout: 60000 * 1,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.tabPanes[activeTab].data = list ?? [];
				this.tabPanes[activeTab].total = total ?? 0;
			} else {
				this.tabPanes[activeTab].data = [];
				this.tabPanes[activeTab].total = 0;
			}
			this.tabPanes[activeTab].loading = false;
		},
	},
};
</script>
