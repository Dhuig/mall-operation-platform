<template>
	<div class="group-buy-order-stock-management">
		<guideBar>
			<el-button v-permission="'groupBuy_Order_Management_batch_export'" type="primary" @click="batchExport">
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<el-row :gutter="20">
				<el-form label-width="120px">
					<el-col :span="8">
						<el-form-item label="负责人卡号">
							<el-input
								v-model="cardNo"
								placeholder="请输入负责人卡号"
								size="medium"
								@blur="querySearchAsync(cardNo)"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="服务中心编号" align="center">
							<el-input v-model="storeCode" size="medium" disabled></el-input>
						</el-form-item>
					</el-col>
				</el-form>
			</el-row>
		</el-card>
		<el-card>
			<searchPanel
				v-model="searchConfig"
				:config="GROUP_BUY_ORDER__MANAGEMENT_SERACH"
				@search="search"
				ref="searchPanel"
			/>
		</el-card>
		<el-card>
			<tableList
				:columns="GROUP_BUY_ORDER_MANAGEMENT_COLUMNS"
				:pagination="pagination"
				:dataTotal="pagination.total"
				:loading="loading"
				:dataSource="list"
				@loadMore="loadMore"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button type="text" v-permission="'groupbuy_order_stock_detail'" @click="detail(scope.data)">
						详情
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { exportExcel } from 'util';
import { GROUP_BUY_ORDER__MANAGEMENT_SERACH, GROUP_BUY_ORDER_MANAGEMENT_COLUMNS } from './config';
export default {
	name: 'groupBuyOrderManagement',
	data() {
		return {
			GROUP_BUY_ORDER__MANAGEMENT_SERACH,
			GROUP_BUY_ORDER_MANAGEMENT_COLUMNS,
			loading: false,
			cardNo: '',
			storeCode: '',
			list: [],
			searchConfig: {
				companyCode: '',
				month: '',
				orderNo: '',
				productCode: '',
				storeCode: '',
				settleMonth: '',
			},
			pagination: {
				pageNum: 1,
				pageSize: 10,
				total: 0,
			},
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadMore() {
			const { pageNum, pageSize, total } = this.pagination;
			if (pageNum * pageSize >= total) {
				return this.$message.warning('没有更多数据');
			}
			this.pagination.pageNum++;
			this.loadData();
		},
		async querySearchAsync(cardNo) {
			let params = {
				cardNo,
			};
			const res = await this.$fetch({
				url: '/mgmt/store/leader/getLeaderByCardNo',
				params: params,
			});
			if (res && res.data) {
				this.storeCode = res.data.storeCode;
			}
		},
		// 批量导出
		batchExport() {
			const { searchConfig } = this;
			const params = Object.assign({}, searchConfig);
			exportExcel('/mgmt/inventory/group-order/stock/excel-export', params);
		},
		async loadData() {
			const {
				searchConfig,
				pagination: { pageNum, pageSize },
			} = this;
			this.loading = true;

			const params = {
				pageNum,
				pageSize,
				...searchConfig,
			};

			const res = await this.$fetch({
				url: '/mgmt/inventory/group-order/stock/page',
				params,
			});
			this.loading = true;
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = this.list.concat(list);
				this.pagination.total = total;
			} else {
				this.list = [];
				this.pagination.total = 0;
			}
			this.loading = false;
		},
		detail(row) {
			const { orderNo, productCode } = row;
			this.$go('groupBuy_Order_Detail', { title: '团购订单库存详情', orderNo, productCode });
		},
		// 搜索
		search() {
			this.pagination.pageNum = 1;
			this.list = [];
			this.loadData();
		},
	},
};
</script>
