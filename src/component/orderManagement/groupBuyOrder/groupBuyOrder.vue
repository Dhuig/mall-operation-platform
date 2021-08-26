<template>
	<div class="group-bug-order">
		<guideBar>
			<el-button
				v-permission="'group_buy_order_batch_export'"
				type="primary"
				@click.stop="exportFile"
				icon="el-icon-download"
			>
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="GROUP_BUY_ORDER_SERACH" @search="resetLoad" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeTab">
				<el-tab-pane v-for="([label, name], index) in TAB_LIST" :key="index" :label="label" :name="name">
					<!-- <el-table
						v-loading="tabPanes[activeTab].loading"
						:data="tabPanes[activeTab].data"
						tooltip-effect="dark"
						@selection-change="handleSelectionChange"
					>
						<el-table-column type="selection" width="55"></el-table-column>
						<el-table-column type="index" label="序号" width="90"></el-table-column>
						<el-table-column prop="orderNo" label="订单号" width="200"></el-table-column>
						<el-table-column prop="companyCode" label="分公司编号" width="100"></el-table-column>
						<el-table-column prop="companyName" label="分公司名称" width="150"></el-table-column>
						<el-table-column prop="storeCode" label="服务中心编号" width="150"></el-table-column>
						<el-table-column prop="storeName" label="服务中心名称" width="150"></el-table-column>
						<el-table-column prop="principalCardNo" label="会员卡号" width="150"></el-table-column>
						<el-table-column prop="principalName" label="顾客姓名"></el-table-column>
						<el-table-column label="顾客类型">
							<template slot-scope="scope">
								{{ MEMBER_TYPE[scope.row.principalType] }}
							</template>
						</el-table-column>
						<el-table-column prop="amount" label="应付金额"></el-table-column>
						<el-table-column prop="remittance" label="实付金额"></el-table-column>
						<el-table-column prop="consigneeName" label="收货人姓名" width="150"></el-table-column>
						<el-table-column prop="consigneeMobile" label="收货人手机号" width="150"></el-table-column>
						<el-table-column label="开单日期" width="180">
							<template slot-scope="scope">
								{{ scope.row.createTime | formatDate }}
							</template>
						</el-table-column>
						<el-table-column label="订单状态" width="150">
							<template slot-scope="scope">
								{{ GROUP_ORDER_STATE[scope.row.state] }}
							</template>
						</el-table-column>
						<el-table-column fixed="right" label="操作" width="200px">
							<template slot-scope="scope">
								<el-button
									v-permission="'group_buy_order_detail'"
									type="text"
									@click="detail(scope.row.orderNo, 'detail')"
								>
									详情
								</el-button>
								<el-button
									v-if="[1, 2].includes(scope.row.state)"
									type="text"
									@click="audit(scope.row.orderNo, scope.row.state)"
									v-permission="'group_buy_order_audit'"
								>
									审核
								</el-button>
								<el-button
									v-permission="'group_buy_order_edit'"
									v-if="[1].includes(scope.row.state)"
									type="text"
									@click="edit(scope.row.orderNo)"
								>
									编辑
								</el-button>
								<el-button
									v-permission="'group_buy_order_cancel_order'"
									v-if="[1, 2, 3].includes(scope.row.state)"
									type="text"
									@click="cancel(scope.row.orderNo)"
								>
									取消订单
								</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination
						background
						class="pagination"
						layout="sizes, total , prev, pager, next, jumper"
						:total="tabPanes[activeTab].pagination.total"
						@current-change="handleChangePage"
						@size-change="handleSizeChange"
					></el-pagination> -->

					<tableList
						:loading="tabPanes[activeTab].loading"
						:dataSource="tabPanes[activeTab].data"
						:columns="GROUP_BUG_ORDER_COLUMNS"
						:pagination="tabPanes[activeTab].pagination"
						:dataTotal="tabPanes[activeTab].total"
						@handleSelectionChange="handleSelectionChange"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
						:options="{
							selection: true,
							labelIndex: '序号',
							index: true,
							operatesWidth: 320,
						}"
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'group_buy_order_detail'"
								type="text"
								@click="detail(scope.data.orderNo, 'detail')"
							>
								详情
							</el-button>
							<el-button
								v-if="[1, 2].includes(scope.data.state)"
								type="text"
								@click="audit(scope.data.orderNo, scope.data.state)"
								v-permission="'group_buy_order_audit'"
							>
								审核
							</el-button>
							<el-button
								v-permission="'group_buy_order_edit'"
								v-if="[1].includes(scope.data.state)"
								type="text"
								@click="edit(scope.data.orderNo)"
							>
								编辑
							</el-button>
							<el-button
								v-permission="'group_buy_order_cancel_order'"
								v-if="[1, 2, 3].includes(scope.data.state)"
								type="text"
								@click="cancel(scope.data.orderNo)"
							>
								取消订单
							</el-button>

							<el-button type="text" v-permission="'group_buy_order_declaration_details'" @click="jump(scope.data)">
								分批报单明细
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<auditModal
			ref="auditModal"
			v-if="auditModalProps.show"
			:auditModalProps="auditModalProps"
			:loadData="resetLoad"
			:GROUP_ORDER_STATE="GROUP_ORDER_STATE"
			@close="
				() => {
					auditModalProps.show = false;
				}
			"
		/>
	</div>
</template>

<script>
import searchPanel from 'component/common/searchPanel';
import {
	GROUP_BUY_ORDER_SERACH,
	TAB_LIST,
	GROUP_BUG_ORDER_STATS_MAP,
	TABITEM,
	GROUP_BUG_ORDER_COLUMNS,
	MEMBER_TYPE,
} from './config';
import { exportExcel } from 'util';
// import { formatDate, addPrefixForAmount } from 'util/formValidation';
import auditModal from './modal/auditModal';

export default {
	name: 'groupBuyOrder',
	data() {
		const tabPanes = Object.create(null);
		TAB_LIST.map(tabItem => (tabPanes[tabItem[1]] = new TABITEM()));
		return {
			GROUP_BUY_ORDER_SERACH,
			TAB_LIST,
			GROUP_BUG_ORDER_STATS_MAP,
			GROUP_BUG_ORDER_COLUMNS,
			GROUP_ORDER_STATE: {},
			MEMBER_TYPE,
			searchConfig: {
				companyCode: '',
				consigneeMobile: '',
				consigneeName: '',
				createBegin: '',
				createEnd: '',
				principalCardNo: '',
				principalName: '',
				state: '',
				storeCode: '',
				storeName: '',
			},
			auditModalProps: {
				show: false,
				state: null,
				orderNo: '',
			},
			activeTab: 'all',
			tabPanes,
		};
	},
	computed: {
		// 搜索参数
		searchFields() {
			const { time = ['', ''], ...others } = this.searchConfig;
			return {
				...others,
				createBegin: time[0] || null,
				createEnd: time[1] || null,
			};
		},
	},
	watch: {
		activeTab: {
			immediate: true,
			handler() {
				this.resetLoad();
			},
		},
	},
	methods: {
		// 跳转
		jump({ orderNo }) {
			if (!orderNo) {
				return;
			}
			this.$go('group_buy_order_declaration_details', { orderNo });
		},
		// loadMore() {
		// 	const { currentPage, pageSize } = this.tabPanes[this.activeTab].pagination;
		// 	const { total } = this.tabPanes[this.activeTab];
		// 	if (currentPage * pageSize >= total) {
		// 		return this.$message.warning('没有更多数据');
		// 	}
		// 	this.tabPanes[this.activeTab].pagination.currentPage++;
		// 	this.loadData();
		// },
		// 批量导出
		async exportFile() {
			const { activeTab, searchFields } = this;
			// 订单状态
			const state = GROUP_BUG_ORDER_STATS_MAP[activeTab];
			const params = {
				state,
				...searchFields,
				orderNo: this.tabPanes[this.activeTab].selectedOrderNos || null,
			};

			exportExcel('/mgmt/inventory/group-order/excel-export', params);
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
		// 搜索
		resetLoad() {
			this.tabPanes[this.activeTab].pagination.currentPage = 1;
			this.tabPanes[this.activeTab].data = [];
			this.$nextTick(this.loadData);
		},
		// 多行选中事件
		handleSelectionChange(val) {
			this.tabPanes[this.activeTab].selectedOrderNos = val.map(item => item.orderNo).join(',');
		},
		// 获取字典映射
		// async getDicts() {
		// 	const [GROUP_ORDER_STATE, MEMBER_TYPE] = await Promise.all([
		// 		this.$getDict('GROUP_ORDER_STATE'),
		// 		this.$getDict('MEMBER_TYPE'),
		// 	]);
		// 	this.GROUP_ORDER_STATE = GROUP_ORDER_STATE;
		// 	this.MEMBER_TYPE = MEMBER_TYPE;
		// },
		// 获取列表数据
		async loadData() {
			const { activeTab, searchFields } = this;
			// 订单状态
			const state = GROUP_BUG_ORDER_STATS_MAP[activeTab];
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabPanes[activeTab];
			this.tabPanes[activeTab].loading = true;

			const params = {
				pageNum,
				pageSize,
				state,
				...searchFields,
			};

			const res = await this.$fetch({
				url: '/mgmt/inventory/group-order/page',
				params,
			});

			if (res && res.data) {
				const { list, total } = res.data;
				this.tabPanes[activeTab].data = list;
				this.tabPanes[activeTab].total = total;
				console.log(this.tabPanes[activeTab]);
			} else {
				this.tabPanes[activeTab].data = [];
				this.tabPanes[activeTab].total = 0;
			}
			this.tabPanes[activeTab].loading = false;
		},
		// 详情
		detail(orderNo) {
			this.$go('group_buy_order_detail', { title: '团购订单详情', orderNo });
		},
		// 编辑
		edit(orderNo) {
			this.$go('edit_group_buy_order', { title: '编辑团购订单', orderNo });
		},
		// 审核
		audit(orderNo, state) {
			this.auditModalProps = { show: true, orderNo, state };
		},
		// 取消订单
		async cancel(orderNo) {
			this.$confirm('确定取消订单?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'PUT',
					url: '/mgmt/inventory/group-order/revoke',
					params: { orderNo },
				});
				if (res && res.code === 200) {
					this.$message.success('取消成功');
					this.resetLoad();
				} else {
					if (this.$store.getters['system/getError']) {
						// * 错误提示
						this.$message.error(res.message);
					}
				}
			});
		},
	},
	components: { searchPanel, auditModal },
	async mounted() {
		// await this.getDicts();
	},
};
</script>

<style lang="scss" scoped>
::v-deep.pagination {
	margin-top: 20px;
	text-align: right;
	.el-pagination__sizes {
		float: left;
	}
	.el-pagination__total {
		float: left;
	}
}
</style>
