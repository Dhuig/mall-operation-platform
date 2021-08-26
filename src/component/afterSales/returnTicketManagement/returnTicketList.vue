<template>
	<div class="getOrderReturnList">
		<guideBar>
			<el-button v-permission="'return_ticke_export_btn'" type="primary" @click="batchExport">导出</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchData" :config="GET_ORDER_RETURN_LIST" @search="onHandleSearch" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeStatusTab">
				<el-tab-pane v-for="([label, name], index) in RETURN_TICKET_TABS_LIST" :key="index" :label="label" :name="name">
					<div slot="label">
						<template>
							{{ label }}
							<el-badge
								v-if="name == 'beRefund' && tabTotal > 0"
								:max="99"
								:value="tabTotal"
								class="item"
								type="warning"
							/>
						</template>
					</div>
					<tableList
						:loading="tabPanes[activeStatusTab].loading"
						:dataSource="tabPanes[activeStatusTab].data"
						:columns="PRODUCT_COLUMNS"
						:pagination="tabPanes[activeStatusTab].pagination"
						:dataTotal="tabPanes[activeStatusTab].total"
						@handleSizeChange="handleSizeChange"
						@handleChangePage="handleChangePage"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'get_orderReturn_list_detail|return_ticket_details'"
								type="text"
								@click="onDetail(scope.data, 'detail')"
							>
								详情
							</el-button>
							<el-button
								v-permission="'get_orderReturn_list_audit'"
								v-if="scope.data.returnInvoiceStatus == 1 && scope.data.applySource !== 3"
								type="text"
								@click="onDetail(scope.data, 'audit')"
							>
								审核
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!--审批弹窗-->
		<refunAudit-dialog :orderInfo="orderInfo" @onClosedDialog="onClosedDialog" />
	</div>
</template>

<script>
import {
	GET_ORDER_RETURN_LIST,
	PRODUCT_COLUMNS,
	RETURN_INVOICE_STATUS_TAB,
	RETURN_TICKET_TABS_LIST,
	TABITEM,
} from './config';
import { exportExcelPost } from 'util';
import refunAuditDialog from './refunAuditDialog';
import { formatDateDefault } from '@/util/formValidation';
// import { genCurrentMonthFirstAndLastDay } from 'util';
import qs from 'querystring';

export default {
	name: 'returnTicketList',
	data() {
		const tabPanes = Object.create(null);
		RETURN_TICKET_TABS_LIST.map(tabItem => (tabPanes[tabItem[1]] = new TABITEM()));
		return {
			GET_ORDER_RETURN_LIST,
			PRODUCT_COLUMNS,
			RETURN_INVOICE_STATUS_TAB,
			RETURN_TICKET_TABS_LIST,
			activeStatusTab: 'all',
			tabPanes,
			tabTotal: null,
			//搜索数据
			searchData: {
				returnNo: '', //退货单号
				orderNo: '', //订单编号
				returnInvoiceStatus: '', //处理状态 1->待退票 2->已退票 3->已取消退票
				applyTime: [],
				companyName: '', //分公司名称
				companyCode: '', //分公司编号
				storeName: '', //服务中心名称
				storeCode: '', //服务中心编号
				customerCard: '', //顾客卡号
				creatorCard: '', //开单人卡号
				applySource: '', //申请来源
			},
			orderInfo: {
				auditTitle: '退票审核',
				type: 'getOrderReturnList', // 退票管理
				auditShow: false, //是否显示审核弹窗
				returnNo: '',
				orderNo: '',
				id: '',
			},
		};
	},
	components: {
		refunAuditDialog, //审核弹窗
	},
	computed: {
		// 搜索参数
		searchFields() {
			const { applyTime = ['', ''], ...others } = this.searchData;
			return {
				...others,
				returnInvoiceStatus: RETURN_INVOICE_STATUS_TAB[this.activeStatusTab],
				applyTimeBegin: formatDateDefault(applyTime[0]) || null,
				applyTimeEnd: formatDateDefault(applyTime[1]) || null,
			};
		},
	},
	watch: {
		activeStatusTab: {
			immediate: true,
			handler() {
				this.onHandleSearch();
			},
		},
	},
	methods: {
		// 导出
		batchExport() {
			exportExcelPost('/mgmt/order/return/exportInvoiceList', this.searchFields);
		},
		// 分页触发事件
		handleChangePage(currentPage) {
			this.tabPanes[this.activeStatusTab].pagination.currentPage = currentPage;
			this.getOrderReturnList();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.tabPanes[this.activeStatusTab].pagination.pageSize = pageSize;
			this.tabPanes[this.activeStatusTab].pagination.currentPage = 1;
			this.getOrderReturnList();
		},
		//获取退货管理列表数据
		async getOrderReturnList() {
			let params = {
				...this.searchFields,
				pageNum: this.tabPanes[this.activeStatusTab].pagination.currentPage, //当前页数
				pageSize: this.tabPanes[this.activeStatusTab].pagination.pageSize, //每页显示数
			};
			this.tabPanes[this.activeStatusTab].loading = true;
			let res = await this.$fetch({
				url: '/mgmt/order/return/getOrderReturnInvoiceList',
				params,
			});
			// res && res.code && res.code == 200
			if (res?.code == 200) {
				this.tabPanes[this.activeStatusTab].data = res.data.list;
				this.tabPanes[this.activeStatusTab].total = res.data.total;
			} else {
				this.tabPanes[this.activeStatusTab].data = [];
				this.tabPanes[this.activeStatusTab].total = 0;
				// 后台报什么奇怪code 返回错误信息
				if (this.$store.getters['system/getError']) {
					this.$message({
						type: 'error',
						message: res.message,
					});
				}
			}
			this.tabPanes[this.activeStatusTab].loading = false;
		},
		//搜索事件
		onHandleSearch() {
			this.tabPanes[this.activeStatusTab].pagination.currentPage = 1;
			this.tabPanes[this.activeStatusTab].data = [];
			this.$nextTick(this.getOrderReturnList);
			this.getTotal();
		},
		//退票详情与审核事件
		onDetail(row, type) {
			const { id, orderNo, returnNo } = row;
			this.orderInfo = {
				...this.orderInfo,
				orderNo,
				returnNo,
				id,
			};
			if (type == 'audit') {
				this.orderInfo.auditShow = true;
				return;
			}
			this.$go('return_ticket_details', { returnNo, id });
		},
		//关闭审核弹窗
		onClosedDialog(val) {
			// 成功之后更新数据
			if (val == 'success') {
				this.getOrderReturnList();
			}
			this.orderInfo.auditShow = false;
		},
		// 获取统计
		async getTotal() {
			const res = await this.$fetch(`/mgmt/order/return/countWaitReturnInvoice?${qs.stringify(this.searchFields)}`);
			if (res.code == 200) {
				this.tabTotal = res.data;
			} else {
				this.tabTotal = 0;
			}
		},
		// 获取分公司信息
		loadCompanyList() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			this.GET_ORDER_RETURN_LIST.form[4].options = serviceCompanyOptions.map(({ label, value }) => ({
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
