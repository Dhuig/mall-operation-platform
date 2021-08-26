<!-- 维修单管理 -->
<template>
	<div>
		<guideBar>
			<el-button v-permission="'repair_order_list_add'" type="primary" @click="handleAdd">新建维修单</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="RETURN_MAINTAIN_SEARCH" @search="search" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeTab">
				<el-tab-pane v-for="([label, name], index) in RETURN_MAINTAIN_TABS" :key="index" :name="name" :label="label">
					<tableList
						:columns="RETURN_MAINTAIN_COLUMNS"
						slotcontent
						:pagination="tabPanes[activeTab].pagination"
						:dataTotal="tabPanes[activeTab].total"
						:loading="tabPanes[activeTab].loading"
						:dataSource="tabPanes[activeTab].data"
						@handleSizeChange="handleSizeChange"
						@handleChangePage="handleChangePage"
					>
						<template slot-scope="scope">
							<el-button v-permission="'repair_order_list_detail'" type="text" @click="viewDetail(scope.data)">
								查看详情
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import { RETURN_MAINTAIN_SEARCH, RETURN_MAINTAIN_TABS, RETURN_MAINTAIN_COLUMNS, TABITEM } from './config';
// import { formatDate } from '@/util/formValidation';
import qs from 'querystring';

export default {
	name: 'repairOrderList',
	data() {
		const tabPanes = Object.create(null);
		RETURN_MAINTAIN_TABS.map(tabItem => (tabPanes[tabItem[1]] = new TABITEM()));
		return {
			RETURN_MAINTAIN_SEARCH,
			RETURN_MAINTAIN_TABS,
			RETURN_MAINTAIN_COLUMNS,
			activeTab: '0',
			searchConfig: {
				repairNo: '',
				storeCode: '',
				custCard: '',
				productInfo: '',
				createTime: [],
			},
			tabPanes,
		};
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
		handleChangePage(currentPage) {
			this.tabPanes[this.activeTab].pagination.currentPage = currentPage;
			this.loadData();
		},
		handleSizeChange(pageSize) {
			this.tabPanes[this.activeTab].pagination.pageSize = pageSize;
			this.tabPanes[this.activeTab].pagination.currentPage = 1;
			this.loadData();
		},
		search() {
			this.tabPanes[this.activeTab].pagination.currentPage = 1;
			this.tabPanes[this.activeTab].data = [];
			this.$nextTick(this.loadData);
		},
		// 点击新增返厂维修单
		handleAdd() {
			this.$go('add_repair_order');
		},
		// 点击详情
		viewDetail({ repairNo, repairStatus }) {
			this.$go('repair_order_detail', { repairNo, repairStatus });
		},
		// 获取维修单列表
		async loadData() {
			const { activeTab } = this;
			const { createTime } = this.searchConfig;
			const { currentPage, pageSize } = this.tabPanes[activeTab].pagination;
			const params = {
				...this.searchConfig,
				pageNum: currentPage,
				pageSize,
				applyTimeBegin: createTime[0],
				applyTimeEnd: createTime[1],
				repairStatus: this.activeTab == '0' ? '' : this.activeTab,
			};
			this.tabPanes[activeTab].loading = true;

			const res = await this.$fetch(`/mgmt/order/repair/list?${qs.stringify(params)}`);

			this.tabPanes[activeTab].loading = false;

			if (res && res.data) {
				const { list, total } = res.data;
				this.tabPanes[activeTab].data = list;
				this.tabPanes[activeTab].total = total;
			} else {
				this.tabPanes[activeTab].data = [];
				this.tabPanes[activeTab].total = 0;
			}
		},
	},
	created() {
		this.$listen('UPDATE_REPAIR_LIST', this.search);
	},
};
</script>
