<template>
	<div>
		<guideBar>
			<el-button
				v-permission="'customer_order_export_btn'"
				type="primary"
				:loading="exportLoading"
				@click.stop="exportFile"
				icon="el-icon-download"
			>
				导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel
				v-model="searchConfig"
				ref="searchPanel"
				:config="CUSTOMER_ORDER_SERACH"
				@search="resetLoad"
				:showExpand="true"
			>
				<template slot="storeCode">
					<el-select
						v-model="searchConfig.storeCode"
						filterable
						clearable
						remote
						size="medium"
						reserve-keyword
						placeholder="请输入服务中心编号/名称"
						:remote-method="getStoreCodeList"
						:loading="storeCode.loading"
					>
						<el-option
							v-for="{ storeCode, storeName } in storeCode.list"
							:key="storeCode"
							:label="`${storeCode} ${storeName}`"
							:value="storeCode"
						></el-option>
					</el-select>
				</template>
				<template slot="serialNo">
					<el-select
						v-model="searchConfig.serialNo"
						filterable
						remote
						clearable
						size="medium"
						reserve-keyword
						placeholder="请输入产品编码/产品名称"
						:remote-method="getProductInfoCodeList"
						:loading="productCode.loading"
					>
						<el-option
							v-for="{ serialNo, title } in productCode.list"
							:key="serialNo"
							:label="`${serialNo} ${title}`"
							:value="serialNo"
						></el-option>
					</el-select>
				</template>
			</searchPanel>
		</el-card>
		<el-card>
			<el-tabs v-model="activeOrderTab">
				<el-tab-pane
					v-for="({ label, name }, index) in CUSTOMER_ORDER_TABS_LIST"
					:key="index"
					:label="label"
					:name="name"
				>
					<tableList
						:loading="tabPanes[activeOrderTab].loading"
						element-loading-text="拼命加载中"
						element-loading-spinner="el-icon-loading"
						:dataSource="tabPanes[activeOrderTab].data"
						:columns="CUSTOMER_ORDER_COLUMNS"
						:pagination="tabPanes[activeOrderTab].pagination"
						:dataTotal="tabPanes[activeOrderTab].total"
						@handleSelectionChange="handleSelectionChange"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
						:options="{
							selection: true,
						}"
					>
						<template slot-scope="scope">
							<el-row type="flex" justify="center">
								<div v-permission="'customer_order_detail'">
									<el-button type="text" @click="detail(scope.data, 'detail')">详情</el-button>
								</div>
								<div v-permission="'customer_order_print'">
									<el-button
										class="mar10"
										v-if="scope.data.orderStatus !== 1"
										type="text"
										@click="print(scope.data.orderNo)"
									>
										打印
									</el-button>
								</div>
							</el-row>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import {
	CUSTOMER_ORDER_SERACH,
	CUSTOMER_ORDER_COLUMNS,
	TICKER_VALIDATE_RULES,
	ORDER_STATUS_LIST,
	CUSTOMER_ORDER_TABS_LIST,
} from './config';
import { genCurrentMonthFirstAndLastDay } from 'util';
import { formatDateDefault } from 'util/formValidation';

export default {
	name: 'customerOrder',
	data() {
		const tabObj = {
			data: [],
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			total: 0,
			loading: false,
		};
		const tabPanes = {};
		['all', 'toPay', 'toSend', 'toReceived', 'completed', 'canceled'].map(x => (tabPanes[x] = tabObj));
		return {
			CUSTOMER_ORDER_SERACH,
			CUSTOMER_ORDER_COLUMNS,
			TICKER_VALIDATE_RULES,
			CUSTOMER_ORDER_TABS_LIST,
			activeOrderTab: 'all',
			searchConfig: {
				time: ['', ''],
				orderNo: '',
				commitStartTime: '',
				commitEndTime: '',
				orderType: '',
				source: '',
				needTicket: '',
				customerName: '',
				customerCard: '',
				customerPhone: '',
				customerType: '',
				companyName: '',
				companyCode: '',
				storeName: '',
				storeCode: '',
				expressType: '',
				receiverPhone: '',
				creatorCard: '',
				serialNo: '',
			},
			productCode: {
				list: [],
				loading: false,
			},
			storeCode: {
				list: [],
				loading: false,
			},
			exportLoading: false,
			selectedOrders: [], // 列表被选中行
			orderStatusList: [], // 订单状态
			tabPanes,
		};
	},
	computed: {
		// 搜索参数
		searchFields() {
			const { time, ...others } = this.searchConfig;
			return {
				...others,
				commitStartTime: formatDateDefault(time[0]) || null,
				commitEndTime: formatDateDefault(time[1]) || null,
			};
		},
		selectedOrderNoList() {
			return this.selectedOrders.map(item => item.orderNo);
		},
	},
	watch: {
		'searchConfig.orderNo': function (newValue) {
			const {
				rules: { time },
			} = this.CUSTOMER_ORDER_SERACH;
			// 输入orderNo 去掉time 的表单验证
			time[0].required = !newValue;
			// orderNo 有值就 清空time的值 没有就给默认值
			if (newValue) {
				this.searchConfig.time = [];
			} else {
				this.searchConfig.time = genCurrentMonthFirstAndLastDay();
			}
			// 清楚表单错误
			this.$refs.searchPanel.formEntity.clearValidate();
		},
		activeOrderTab: {
			immediate: true,
			handler() {
				this.resetLoad();
			},
		},
	},
	methods: {
		// loadMore() {
		// 	const { pageSize } = this.tabPanes[this.activeOrderTab].pagination;
		// 	const { total } = this.tabPanes[this.activeOrderTab];
		// 	if (total < pageSize) {
		// 		return this.$message.warning('没有更多数据');
		// 	}
		// 	this.tabPanes[this.activeOrderTab].pagination.currentPage++;
		// 	this.loadData();
		// },
		async exportFile() {
			const { activeOrderTab, searchFields } = this;
			const orderStatusList = activeOrderTab in ORDER_STATUS_LIST ? ORDER_STATUS_LIST[activeOrderTab] : null;

			const data = {
				...searchFields,
				orderStatusList,
				orderNoList: this.selectedOrderNoList.length === 0 ? [] : this.selectedOrderNoList,
			};
			this.exportLoading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/order/exportList',
				data,
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
			this.tabPanes[this.activeOrderTab].pagination.currentPage = currentPage;
			this.loadData();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.tabPanes[this.activeOrderTab].pagination.pageSize = pageSize;
			this.tabPanes[this.activeOrderTab].pagination.currentPage = 1;
			this.loadData();
		},
		// 搜索
		resetLoad() {
			this.tabPanes[this.activeOrderTab].pagination.currentPage = 1;
			this.tabPanes[this.activeOrderTab].data = [];
			this.$nextTick(this.loadData);
		},
		// 多行选中事件
		handleSelectionChange(val) {
			this.selectedOrders = val;
		},
		// 详情
		detail(row) {
			const { orderNo } = row;
			this.$go('customer_order_detail', { title: '顾客订单详情', orderNo });
		},
		async loadData() {
			const { activeOrderTab, searchFields } = this;
			const orderStatusList = activeOrderTab in ORDER_STATUS_LIST ? ORDER_STATUS_LIST[activeOrderTab].join(',') : null;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabPanes[activeOrderTab];
			this.tabPanes[activeOrderTab].loading = true;

			const params = {
				pageNum,
				pageSize,
				orderStatusList,
				...searchFields,
			};
			const res = await this.$fetch({
				url: 'mgmt/order/orderList',
				params,
				timeout: 60000 * 1, // 1分钟
			});

			if (res && res.data) {
				const { list, total } = res.data;
				this.tabPanes[activeOrderTab].data = list;
				this.tabPanes[activeOrderTab].total = total;
			} else {
				this.tabPanes[activeOrderTab].data = [];
				this.tabPanes[activeOrderTab].total = 0;
			}
			this.tabPanes[activeOrderTab].loading = false;
		},
		// 分公司
		async getCompanyCodeList() {
			const res = await this.$fetch('/mgmt/sys/listCompanyBaseByCode?companyCode=');
			if (res?.code == 200 && res?.data) {
				const result = res.data.map(({ name, code }) => ({
					label: `${code} ${name}`,
					value: code,
				}));
				this.CUSTOMER_ORDER_SERACH.form[12].options = result;
				this.CUSTOMER_ORDER_SERACH.form[13].options = result;
			}
		},
		// 产品编码
		async getProductInfoCodeList(val) {
			if (!val) return;
			this.productCode.loading = true;
			const res = await this.$fetch(`/mgmt/product/item/getProductInfoByWord?keyword=${val}`);
			if (res?.code == 200 && res?.data) {
				this.productCode.list = res.data;
			}
			this.productCode.loading = false;
		},
		// 服务中心
		async getStoreCodeList(val) {
			if (!val) return;
			const res = await this.$fetch(`/mgmt/store/getStoreOption?keyword=${val}`);
			this.storeCode.loading = true;
			if (res?.code == 200 && res?.data) {
				this.storeCode.list = res.data.filter((x, i) => i < 1000);
			}
			this.storeCode.loading = false;
		},
		print(orderNo) {
			this.$go('deliver_shipment_query', { orderNo });
		},
	},
	created() {
		this.getCompanyCodeList();
	},
};
</script>

<style lang="scss" scoped>
.mar10 {
	margin: 0 10px;
}
</style>
