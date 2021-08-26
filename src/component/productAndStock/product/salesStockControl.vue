<template>
	<div>
		<guideBar>
			<el-button v-permission="'product_management_batch_edit'" type="primary" @click="batchEdit">批量编辑</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="SALES_CONTROL_CONFIG" @search="resetLoad" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeTab">
				<el-tab-pane
					v-for="([label, name], $idx) in SALES_CONTROL_STOCK_TABS_LIST"
					:key="$idx"
					:label="label"
					:name="name"
				>
					<tableList
						:options="options"
						:loading="tabPanes[activeTab].loading"
						:dataSource="tabPanes[activeTab].data"
						:columns="SALES_CONTROL_COLUMNS"
						:pagination="tabPanes[activeTab].pagination"
						:dataTotal="tabPanes[activeTab].total"
						@loadMore="loadMore"
						@handleSelectionChange="handleSelectionChange"
						slotcontent
					>
						<el-button
							v-permission="'product_management_view_changelog'"
							type="text"
							slot-scope="scope"
							@click="viewHistory(scope.data)"
						>
							查看变更日志
						</el-button>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 批量审核弹窗 -->
		<el-dialog
			title="批量审核"
			:visible.sync="batchValidateModal.show"
			width="75%"
			:modal-append-to-body="false"
			v-drag
		>
			<el-table :data="batchValidateModal.data">
				<el-table-column prop="serialNo" label="产品编码" />
				<el-table-column prop="productTitle" label="产品名称" width="150" />
				<el-table-column prop="maxSaleQuota" label="最大销售库存" width="120">
					<template slot-scope="scope">
						<el-radio-group
							v-model="scope.row.stockType"
							@change="handleStockTypeChange($event, scope.$index, scope.row)"
							class="input-gap"
						>
							<el-radio :label="1">限量</el-radio>
							<el-radio :label="2">不限量</el-radio>
						</el-radio-group>
						<el-input
							type="number"
							@input="noZero(scope.row)"
							v-model.number="scope.row.maxSaleQuota"
							size="small"
							:min="1"
							v-show="scope.row.stockType === 1"
						/>
					</template>
				</el-table-column>
				<el-table-column prop="restSaleQuota" label="剩余可销售库存" width="120" />
				<el-table-column prop="companySaleQuota" label="公司可销售库存" width="120" />
				<el-table-column prop="storeSaleQuota" label="服务中心可销售库存" width="150" />
				<el-table-column prop="storeOweQuota" label="服务中心欠货未发库存" width="170" />
				<el-table-column label="操作">
					<el-button type="text" slot-scope="scope" @click="viewHistory(scope.row)">查看变更日志</el-button>
				</el-table-column>
			</el-table>
			<span slot="footer">
				<el-button @click="cancelBatchValidate">取 消</el-button>
				<el-button type="primary" @click="saveBatchValidate">保存</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {
	SALES_CONTROL_CONFIG,
	SALES_CONTROL_COLUMNS,
	SALES_CONTROL_STOCK_TYPE_MAP,
	SALES_CONTROL_STOCK_TABS_LIST,
	TABITEM,
} from './config';

export default {
	name: 'salesStockControl',
	data() {
		const tabPanes = Object.create(null);
		SALES_CONTROL_STOCK_TABS_LIST.map((tabItem) => (tabPanes[tabItem[1]] = new TABITEM()));
		return {
			SALES_CONTROL_STOCK_TABS_LIST,
			SALES_CONTROL_CONFIG,
			SALES_CONTROL_COLUMNS,
			options: {
				label: '全部',
				index: false,
				selection: true,
				labelIndex: '序号',
			},
			activeTab: 'all',
			searchConfig: {
				serialNo: '',
				productTitle: '',
			},
			batchValidateModal: {
				show: false,
				data: [],
			},
			tabPanes,
		};
	},
	computed: {
		// 库存类型
		stockType() {
			return SALES_CONTROL_STOCK_TYPE_MAP[this.activeTab];
		},
	},
	watch: {
		stockType: {
			immediate: true,
			handler() {
				this.resetLoad();
			},
		},
	},
	methods: {
		// 不可输入零
		noZero(row) {
			const { maxSaleQuota } = row;
			row.maxSaleQuota = maxSaleQuota === 0 ? 1 : maxSaleQuota;
		},
		loadMore() {
			const { currentPage, pageSize } = this.tabPanes[this.activeTab].pagination;
			const { total } = this.tabPanes[this.activeTab];
			if (currentPage * pageSize >= total) {
				return this.$message.warning('没有更多数据');
			}
			this.tabPanes[this.activeTab].pagination.currentPage++;
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
			this.loadData();
		},
		// 搜索
		resetLoad() {
			this.tabPanes[this.activeTab].pagination.currentPage = 1;
			this.tabPanes[this.activeTab].data = [];
			this.$nextTick(this.loadData);
		},
		// 表格选择回调
		handleSelectionChange(selection) {
			this.batchValidateModal.data = JSON.parse(JSON.stringify(selection));
		},
		// 批量编辑
		batchEdit() {
			const { data } = this.batchValidateModal;
			if (!data || !data.length) return this.$message.warning('请至少选择一项再进行操作');
			this.batchValidateModal.show = true;
		},
		// 存储类型变化回调
		handleStockTypeChange(label, index, row) {
			const maxSaleQuota = {
				1: 1,
				2: -1,
			}[label];
			const updateRowData = { ...row, maxSaleQuota };
			this.batchValidateModal.data.splice(index, 1, updateRowData);
		},
		// 取消批量审核
		cancelBatchValidate() {
			this.batchValidateModal.show = false;
		},
		// 确认批量审核
		saveBatchValidate() {
			this.updateStockInfo(this.batchValidateModal.data);
		},
		// 查看变更日志
		viewHistory({ stockId }) {
			if (!stockId) return this.$message.warning('库存记录stockId 不存在或无效, 无法查看销售库存变更日志');
			this.$go('/sales_stock_control_changelog', { stockId, title: '查看变更日志' });
		},
		// 更新库存数据
		async updateStockInfo(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/product/stock/batchUpdate',
				data,
			});

			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.batchValidateModal = {
					show: false,
					data: [],
				};
				this.$nextTick(this.resetLoad);
			} else {
				this.$message({
					type: 'error',
					message: '获取菜单详情失败',
				});
			}
		},
		// 请求库存列表
		async loadData() {
			const { searchConfig, activeTab, stockType } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabPanes[activeTab];
			const data = {
				stockType,
				pageNum,
				pageSize,
				...searchConfig,
			};
			this.tabPanes[activeTab].loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/product/stock/list',
				data,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.tabPanes[activeTab].data = this.tabPanes[activeTab].data.concat(list);
				this.tabPanes[activeTab].total = total;
			} else {
				this.tabPanes[activeTab].data = [];
				this.tabPanes[activeTab].total = 0;
			}
			this.tabPanes[activeTab].loading = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.input-gap {
	margin-bottom: 8px;
}
</style>
