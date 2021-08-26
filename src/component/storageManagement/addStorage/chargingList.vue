<template>
	<div>
		<guideBar>
			<el-button v-permission="'charging_list_export'" type="primary" @click="batchExport">导出EXCEL</el-button>
			<!-- <el-button v-permission="'charging_list_add'" type="primary" @click="addNewPledgeOrder">新建押货单</el-button> -->
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="CHARGING_LIST_CONFIG" @search="search" :showExpand="true" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeTab">
				<el-tab-pane :label="item.label" :name="item.value" v-for="(item, key) in tabPane" :key="key">
					<tableList
						border
						:loading="tabData[activeTab].loading"
						:dataSource="tabData[activeTab].data"
						:columns="PRODUCT_COLUMNS"
						:pagination="tabData[activeTab].pagination"
						:dataTotal="tabData[activeTab].pagination.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button v-permission="'charging_list_detail'" type="text" @click="detail(scope.data.id)">
								详情
							</el-button>
							<el-button
								type="text"
								v-permission:crm="'charging_list_audit'"
								v-if="scope.data.orderSource * 1 === 2 && scope.data.orderStatus * 1 === 1"
								@click="audit(scope.data.id)"
							>
								审核
							</el-button>
							<el-button
								type="text"
								v-permission:crm="'charging_list_edit'"
								v-if="
									(scope.data.orderStatus * 1 === 2 || scope.data.orderStatus * 1 === 3) && scope.data.editFlag !== 1
								"
								@click="edit(scope.data.id)"
							>
								修改
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>
<script>
import { CHARGING_LIST_CONFIG, PRODUCT_COLUMNS, ORDER_STATUS_KEY, TAB_PANE } from './config';
import qs from 'querystring';
// import { exportExcel } from 'util';

export default {
	name: 'chargingList',
	data() {
		return {
			CHARGING_LIST_CONFIG,
			PRODUCT_COLUMNS,
			activeTab: 'all',
			searchConfig: {
				storeCode: '',
				orderSn: '',
				companyCode: '',
				orderStatus: '',
				orderSource: '',
				registrationTime: [],
			},
			tabPane: TAB_PANE,
			tabData: {
				all: {
					loading: false,
					data: [],
					pagination: {
						total: 0,
						currentPage: 1,
						pageSize: 10,
					},
				},
				tobeReviewed: {
					loading: false,
					data: [],
					pagination: {
						total: 0,
						currentPage: 1,
						pageSize: 10,
					},
				},
				tobeDelivered: {
					loading: false,
					data: [],
					pagination: {
						total: 0,
						currentPage: 1,
						pageSize: 10,
					},
				},
				someShipment: {
					loading: false,
					data: [],
					pagination: {
						total: 0,
						currentPage: 1,
						pageSize: 10,
					},
				},
				completed: {
					loading: false,
					data: [],
					pagination: {
						total: 0,
						currentPage: 1,
						pageSize: 10,
					},
				},
				cancelled: {
					loading: false,
					data: [],
					pagination: {
						total: 0,
						currentPage: 1,
						pageSize: 10,
					},
				},
			},
		};
	},
	computed: {
		// 状态
		orderStatus() {
			return ORDER_STATUS_KEY[this.activeTab];
		},
		// 搜索参数
		searchFields() {
			const {
				searchConfig: { registrationTime, ...obj },
			} = this;
			return {
				...obj,
				beginTime: registrationTime[0] ? this.formatDate(registrationTime, 0) : '',
				endTime: registrationTime[1] ? this.formatDate(registrationTime, 1) : '',
			};
		},
	},
	watch: {
		orderStatus: {
			immediate: true,
			handler() {
				this.$nextTick(this.getList);
			},
		},
	},
	methods: {
		// 格式化时间
		formatDate(item, index) {
			if (item && item.length >= 2) {
				let d = new Date(item[index]);
				let YY = d.getFullYear() + '-';
				let MM = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '-';
				let DD = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
				return YY + MM + DD;
			} else {
				return '';
			}
		},
		// 导出
		async batchExport() {
			const { activeTab, orderStatus, searchFields } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabData[activeTab];

			const params = {
				orderStatus,
				pageNum,
				pageSize,
				...searchFields,
			};
			// exportExcel('/mgmt/inventory/order/export', params);
			const res = await this.$fetch(`/mgmt/inventory/order/exportOrder?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.$message.success('操作成功');
			} else {
				this.$message.warning(res.message);
			}
		},
		// 新建押货单
		addNewPledgeOrder() {
			this.$go('add_pledge_order', { title: '新建押货单' });
		},
		// 分页触发事件
		handleChangePage(currentPage) {
			this.tabData[this.activeTab].pagination.currentPage = currentPage;
			this.getList();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.tabData[this.activeTab].pagination.pageSize = pageSize;
			this.getList();
		},
		// 搜索
		search() {
			this.tabData[this.activeTab].pagination.currentPage = 1;
			this.getList();
		},
		// 详情
		detail(id) {
			this.$go('charging_detail', { title: '押货单详情', id, type: 'detail' });
		},
		// 审核
		audit(id) {
			this.$go('charging_detail', { title: '后台新增押货单审核', id, type: 'audit' });
		},
		// 修改
		edit(id) {
			this.$go('update_charging', { title: '修改押货单', id });
		},
		// 请求数据
		async getList() {
			const { activeTab, orderStatus, searchFields } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabData[activeTab];
			this.tabData[activeTab].loading = true;

			const params = {
				orderStatus,
				pageNum,
				pageSize,
				...searchFields,
				customFlag: 0,
			};

			const res = await this.$fetch(`/mgmt/inventory/order/listMortgageOrder?${qs.stringify(params)}`);

			if (res) {
				const { list, total } = res.data;
				this.tabData[this.activeTab].data = list;
				this.tabData[this.activeTab].pagination.total = total;
			} else {
				this.tabData[this.activeTab].data = [];
				this.tabData[this.activeTab].pagination.total = 0;
			}
			this.tabData[this.activeTab].loading = false;
		},
	},
	mounted() {
		this.$listen('UP_LIST', this.getList);
	},
};
</script>
<style lang="scss" scoped>
::v-deep.charging-list {
	.box-card {
		margin: 24px 0;
	}
	::v-deep.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}
}
</style>
