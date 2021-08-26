<template>
	<div class="service-order-management">
		<guideBar>
			<el-button v-permission="'perfect_home_service_order_exportExcel'" type="primary" @click="batchExport">
				导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="SERVICE_ORDER_SEARCH" @search="handleSearch" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeName">
				<el-tab-pane :name="name" :label="label" :key="name" v-for="[name, label] in SERVICE_ORDER_TABS">
					<tableList
						:loading="tabPanes[activeName].loading"
						:dataSource="tabPanes[activeName].list"
						:columns="SERVICE_ORDER_COLUMNS"
						:pagination="tabPanes[activeName].pagination"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						:dataTotal="tabPanes[activeName].total"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'perfect_home_service_order_detail|service_order_detail'"
								type="text"
								@click="toDetail(scope.data)"
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
import { SERVICE_ORDER_SEARCH, SERVICE_ORDER_TABS, SERVICE_ORDER_TABS_VALUE, SERVICE_ORDER_COLUMNS } from './config';
import qs from 'querystring';
import { formatDateDefault } from 'util/formValidation';
import { exportExcel } from 'util';
export default {
	name: 'serviceOrderManagement',
	data() {
		let tabPanes = {};
		Object.keys(SERVICE_ORDER_TABS_VALUE).map(item => {
			tabPanes[item] = {
				loading: false,
				list: [],
				pagination: { currentPage: 1, pageSize: 10 },
				total: 0,
			};
		});
		return {
			SERVICE_ORDER_SEARCH,
			SERVICE_ORDER_TABS,
			SERVICE_ORDER_COLUMNS,
			searchConfig: {},
			activeName: 'all',
			tabPanes,
		};
	},
	watch: {
		activeName() {
			this.loadData();
		},
	},
	computed: {
		loadDataPost() {
			const { searchConfig, activeName } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabPanes[activeName];
			let data = {
				...searchConfig,
				orderStatus: SERVICE_ORDER_TABS_VALUE[activeName],
				pageNum,
				pageSize,
			};
			if (data.applicantTime) {
				data.applicantStartTime = data.applicantTime[0] ? formatDateDefault(data.applicantTime[0]) : null;
				data.applicantEndTime = data.applicantTime[1] ? formatDateDefault(data.applicantTime[1]) : null;
				delete data.applicantTime;
			}
			if (data.serviceTime) {
				data.serviceTimeStart = data.serviceTime[0] ? formatDateDefault(data.serviceTime[0]) : null;
				data.serviceTimeEnd = data.serviceTime[1] ? formatDateDefault(data.serviceTime[1]) : null;
				delete data.serviceTime;
			}
			return data;
		},
	},
	methods: {
		// 导出
		batchExport() {
			exportExcel('/mgmt/acc/order/export', this.loadDataPost);
		},
		// 搜索
		handleSearch() {
			const { activeName } = this;
			this.tabPanes[activeName].pagination.currentPage = 1;
			this.loadData();
		},
		// 分页触发事件
		handleChangePage(page) {
			this.tabPanes[this.activeName].pagination.currentPage = page;
			this.loadData();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.tabPanes[this.activeName].pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 详情
		toDetail(row) {
			const { accOrderId } = row;
			this.$go('service_order_detail', { id: accOrderId });
		},
		// 获取列表数据
		async loadData() {
			const { activeName } = this;
			this.tabPanes[activeName].loading = true;
			const res = await this.$fetch(`/mgmt/acc/order/page?${qs.stringify(this.loadDataPost)}`);
			this.tabPanes[activeName].loading = false;
			if (res && res.data) {
				const { list, total } = res.data;
				this.tabPanes[activeName].list = list;
				this.tabPanes[activeName].total = total;
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
	},
	mounted() {
		this.loadData();
	},
};
</script>

<style></style>
