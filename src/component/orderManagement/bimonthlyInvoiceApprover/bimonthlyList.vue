<template>
	<div class="valetServiceList">
		<guideBar>
			<el-button v-permission="'bimonthly_invoice_approver_export'" type="primary" @click="batchExport">导出</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="BIMONTHLY_SERACH" @search="onHandleSearch" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeTab">
				<el-tab-pane v-for="([label, name], index) in BIMONTHLY_TABS_LIST" :key="index" :label="label" :name="name">
					<tableList
						:loading="tabPanes[activeTab].loading"
						:dataSource="tabPanes[activeTab].data"
						:columns="BIMONTHLY_COLUMNS"
						:pagination="tabPanes[activeTab].pagination"
						:dataTotal="tabPanes[activeTab].total"
						@handleSelectionChange="handleSelectionChange"
						@loadMore="loadMore"
						slotcontent
						:options="{
							selection: true,
						}"
					>
						<template slot-scope="scope">
							<el-button v-permission="'bimonthly_invoice_approver_detail'" type="text" @click="onDetail(scope.data)">
								订单详情
							</el-button>
							<el-button
								v-permission="'bimonthly_invoice_approver_audit'"
								v-if="scope.data.reviewStatus == 1"
								type="text"
								@click="onAudit(scope.data)"
							>
								审核
							</el-button>
						</template>
						<template v-slot:showTip="row">
							<el-popover placement="top-start" width="200" trigger="hover" :content="row.row.remarks">
								<div class="remarks" slot="reference">{{ row.row.remarks }}</div>
							</el-popover>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!--审批弹窗-->
		<bimonthlyAudit-dialog :dialogInfo="dialogInfo" />
	</div>
</template>

<script>
import { exportExcel } from 'util';
import { BIMONTHLY_SERACH, BIMONTHLY_COLUMNS, TABITEM, BIMONTHLY_TABS_LIST } from './config';
import { formatDateDefault } from '@/util/formValidation';
import bimonthlyAuditDialog from './bimonthlyAuditDialog';
export default {
	name: 'bimonthlyList',
	data() {
		const tabPanes = Object.create(null);
		BIMONTHLY_TABS_LIST.map(tabItem => (tabPanes[tabItem[1]] = new TABITEM()));
		return {
			BIMONTHLY_SERACH,
			BIMONTHLY_COLUMNS,
			BIMONTHLY_TABS_LIST,
			activeTab: 'all',
			tabPanes,
			selectedOrders: [],
			//搜索数据
			searchConfig: {
				time: ['', ''],
				orderNo: '',
				financeCompanyCode: '',
				receiverPhone: '',
				customerPhone: '',
				customerCard: '',
				customerName: '',
				creatorCard: '',
			},
			dialogInfo: {},
		};
	},
	components: {
		bimonthlyAuditDialog, //审核弹窗
	},
	watch: {
		activeTab() {
			this.onHandleSearch();
		},
	},
	computed: {
		// 搜索参数
		searchFields() {
			const { time = ['', ''], ...others } = this.searchConfig;
			return {
				...others,
				reviewStatus: this.activeTab == 'all' ? '' : this.activeTab,
				applyStartTime: formatDateDefault(time[0]) || null,
				applyEndTime: formatDateDefault(time[1]) || null,
			};
		},
		selectedOrderNoList: vm => vm.selectedOrders.map(item => item.orderNo),
	},
	methods: {
		// 渲染分公司选项
		renderCompanyOptions() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			console.log(this.BIMONTHLY_SERACH);
			this.BIMONTHLY_SERACH.form[2].options = serviceCompanyOptions.map(({ label, value }) => ({
				label: `${value} ${label}`,
				value,
			}));
		},
		batchExport() {
			const { activeOrderTab, searchFields } = this;
			const orderStatusList =
				activeOrderTab in BIMONTHLY_TABS_LIST ? BIMONTHLY_TABS_LIST[activeOrderTab].join(',') : null;

			const params = {
				orderStatusList,
				...searchFields,
				orderNoList: this.selectedOrderNoList.length === 0 ? [] : this.selectedOrderNoList,
			};
			exportExcel('/mgmt/order/exportReviewInvoiceList', params);
		},
		loadMore() {
			const { currentPage, pageSize } = this.tabPanes[this.activeTab].pagination;
			const { total } = this.tabPanes[this.activeTab];
			console.log(total, this.tabPanes[this.activeTab]);
			if (currentPage * pageSize >= total) {
				return this.$message.warning('没有更多数据');
			}
			this.tabPanes[this.activeTab].pagination.currentPage++;
			this.loadData();
		},
		//获取代客售后
		async loadData() {
			let params = {
				...this.searchFields,
				pageNum: this.tabPanes[this.activeTab].pagination.currentPage, //当前页数
				pageSize: this.tabPanes[this.activeTab].pagination.pageSize, //每页显示数
			};
			this.tabPanes[this.activeTab].loading = true;
			let res = await this.$fetch({
				url: '/mgmt/order/getReviewInvoiceList',
				params,
			});
			// res && res.code && res.code == 200
			if (res?.code == 200) {
				const { list, total } = res.data;
				this.tabPanes[this.activeTab].data = this.tabPanes[this.activeTab].data.concat(list);
				this.tabPanes[this.activeTab].total = total;
			} else {
				this.tabPanes[this.activeTab].data = [];
				this.tabPanes[this.activeTab].total = 0;
				// 后台报什么奇怪code 返回错误信息
				if (this.$store.getters['system/getError']) {
					this.$message({
						type: 'error',
						message: res.message,
					});
				}
			}
			this.tabPanes[this.activeTab].loading = false;
		},
		// 搜索事件
		onHandleSearch() {
			this.tabPanes[this.activeTab].pagination.currentPage = 1;
			this.tabPanes[this.activeTab].data = [];
			this.$nextTick(this.loadData);
		},
		// 多行选中事件
		handleSelectionChange(val) {
			this.selectedOrders = val;
		},
		//订单详情
		onDetail(row) {
			const { orderNo } = row;
			this.$go('customer_order_detail', { orderNo });
		},
		// 打开 订单审核
		onAudit(data) {
			this.dialogInfo = {
				...data,
				show: true,
			};
		},
	},
	created() {
		this.$listen('UPDATA_BIMONTHLY_LIST', this.onHandleSearch);
	},
	mounted() {
		this.onHandleSearch();
		this.renderCompanyOptions();
	},
};
</script>
<style lang="scss" scoped>
::v-deep .remarks {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	width: 150px;
	-webkit-box-orient: vertical;
}
</style>
