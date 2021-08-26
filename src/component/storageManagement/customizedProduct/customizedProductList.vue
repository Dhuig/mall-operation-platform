<template>
	<div class="customized-product-list">
		<guideBar>
			<el-button type="primary" v-permission="'customized_products_batch_export'" @click="batchExport">
				导出EXCEL
			</el-button>
		</guideBar>
		<el-card class="box-card">
			<searchPanel v-model="searchConfig" :config="CUSTOMIZED_LIST_CONFIG" @search="search" :showExpand="true" />
		</el-card>
		<el-card class="box-card">
			<el-tabs v-model="activeTab">
				<el-tab-pane :label="item.label" :name="item.value" v-for="(item, key) in tabPane" :key="key">
					<tableList
						border
						:loading="tabData[activeTab].loading"
						:dataSource="tabData[activeTab].data"
						:columns="CUSTOMIZED_LIST_COLUMNS"
						:pagination="tabData[activeTab].pagination"
						:dataTotal="tabData[activeTab].pagination.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button v-permission="'customized_detail'" type="text" @click="detail(scope.data.id)">详情</el-button>
							<el-button
								type="text"
								v-permission:crm="'customized_audit'"
								v-if="scope.data.orderSource * 1 === 2 && scope.data.orderStatus * 1 === 1"
								@click="audit(scope.data.id)"
							>
								审核
							</el-button>
							<el-button
								type="text"
								v-permission:crm="'customized_edit'"
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
import { CUSTOMIZED_LIST_CONFIG, CUSTOMIZED_LIST_COLUMNS, TAB_PANE, ORDER_STATUS_KEY } from './config';
import qs from 'querystring';
import { exportExcel } from 'util';

export default {
	name: 'customizedProductList',
	data() {
		return {
			CUSTOMIZED_LIST_CONFIG,
			CUSTOMIZED_LIST_COLUMNS,
			searchConfig: {
				storeCode: '',
				orderSn: '',
				companyCode: '',
				orderStatus: '',
				orderSource: '',
				registrationTime: [],
			},
			activeTab: 'all',
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
		batchExport() {
			const { activeTab, orderStatus, searchFields } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabData[activeTab];

			const params = {
				orderStatus,
				pageNum,
				pageSize,
				...searchFields,
				customFlag: 1,
			};
			console.log(params);
			exportExcel('/mgmt/inventory/order/export', params);
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
			this.$go('customized_detail', { title: '定制品押货单详情', id, type: 'detail' });
		},
		// 审核
		audit(id) {
			this.$go('customized_detail', { title: '定制品后台新增押货单审核', id, type: 'audit' });
		},
		// 修改
		edit(id) {
			this.$go('update_customized', { title: '修改定制品押货单', id, type: 'edit' });
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
				customFlag: 1,
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
		this.$nextTick(() => {
			this.getList();
		});
	},
};
</script>
<style lang="scss" scoped>
.customized-product-list {
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}
}
</style>
