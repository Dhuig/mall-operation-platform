<!-- 返厂维修单管理 -->
<template>
	<div>
		<guideBar>
			<el-button v-permission="'return_maintain_add'" type="primary" @click="handleAdd">新增返厂维修单</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="RETURN_MAINTAIN_SEARCH" @search="search" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeTab">
				<el-tab-pane v-for="([label, name], index) in RETURN_MAINTAIN_TABS" :key="index" :name="name" :label="label">
					<tableList
						:columns="RETURN_MAINTAIN_COLUMNS"
						:pagination="tabPanes[activeTab].pagination"
						:dataTotal="tabPanes[activeTab].total"
						:loading="tabPanes[activeTab].loading"
						:dataSource="tabPanes[activeTab].data"
						@handleSizeChange="handleSizeChange"
						@handleChangePage="handleChangePage"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button v-permission="'return_maintain_detail'" type="text" @click="viewDetail(scope.data)">
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
import { formatDate } from '@/util/formValidation';
import qs from 'querystring';

export default {
	name: 'returnMaintainManage',
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
				cardNo: '',
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
		search() {
			this.tabPanes[this.activeTab].pagination.currentPage = 1;
			this.tabPanes[this.activeTab].data = [];
			this.$nextTick(this.loadData);
		},
		// 点击新增返厂维修单
		handleAdd() {
			this.$go('add_return_maintain');
		},
		// 点击详情
		viewDetail({ id }) {
			this.$go('return_maintain_detail', { id });
		},
		// 获取返厂维修单列表
		async loadData() {
			const { createTime } = this.searchConfig;
			const { currentPage, pageSize } = this.tabPanes[this.activeTab].pagination;
			const params = {
				pageNum: currentPage,
				pageSize,
				repairStatus: this.activeTab === '0' ? '' : this.activeTab,
				systemCode: 1,
				...this.searchConfig,
			};
			if (createTime && createTime.length && createTime[0]) {
				params.createBeginTime = formatDate(createTime[0]);
				params.createEndTime = formatDate(createTime[1] + 24 * 3600 * 1000 - 1000);
			}
			this.tabPanes[this.activeTab].loading = true;
			const res = await this.$fetch(`/mgmt/order/factory/getFactoryOrderByPage?${qs.stringify(params)}`);
			if (res && res.data) {
				const { list, total } = res.data;
				this.tabPanes[this.activeTab].data = list;
				this.tabPanes[this.activeTab].total = total;
			} else {
				this.tabPanes[this.activeTab].data = [];
				this.tabPanes[this.activeTab].total = 0;
			}
			this.tabPanes[this.activeTab].loading = false;
		},
	},
	mounted() {
		// this.loadData();
		this.$listen('RETURN_MAINTAIN_LIST', this.search);
	},
};
</script>
