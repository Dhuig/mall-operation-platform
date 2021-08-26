<template>
	<div class="platform-activeCenter_couponHandDetail-wrap">
		<el-card>
			<searchPanel
				ref="searchPanel"
				v-model="searchModel"
				:config="DONATE_COUPONE_DETAIL_CONFIG"
				@search="handleSearch"
			/>
		</el-card>
		<el-card>
			<tableList
				:options="options"
				:dataSource="dataSource"
				:columns="DONATE_COUPONE_DETAIL_COLUMNS"
				:pagination="pagination"
				:dataTotal="pagination.total"
				:loading="loading"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot="content_context">
					<el-button type="primary" class="btn" @click="detailExport">导 出</el-button>
				</template>
				<template v-slot:orderNo="{ row }">
					<el-button type="text" @click="goOrderDetail(row)">{{ row.orderNo }}</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { DONATE_COUPONE_DETAIL_CONFIG, DONATE_COUPONE_DETAIL_COLUMNS } from '../config.js';
import { exportExcel } from 'util';
import qs from 'querystring';
export default {
	name: 'donateDetail',
	components: {},
	data() {
		return {
			options: {
				operatesWidth: 80,
			},
			DONATE_COUPONE_DETAIL_COLUMNS,
			DONATE_COUPONE_DETAIL_CONFIG,
			searchModel: {
				cardNo: null,
				code: null,
				mobile: null,
				realName: null,
				state: null,
				transferType: null,
			},
			loading: false,
			dataSource: [],
			pagination: {
				total: 0,
				currentPage: 1,
				pageSize: 10,
			},
		};
	},
	methods: {
		detailExport() {
			let { currentPage: pageNum, pageSize } = this.pagination;
			let grantId = this.$route.query.id;
			let params = { pageNum, pageSize, grantId, ...this.searchModel };
			exportExcel(`/mgmt/prmt/couponTransfer/exportCouponTransfer`, params);
		},
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
		},
		async loadData() {
			let { currentPage: pageNum, pageSize } = this.pagination;
			let grantId = this.$route.query.id;
			let params = { pageNum, pageSize, grantId, ...this.searchModel };
			const res = await this.$fetch(`/mgmt/prmt/couponTransfer/getCouponTransferPage?${qs.stringify(params)}`);
			if (res && res.code == 200) {
				this.dataSource = res.data.list;
				this.pagination.total = res.data.total;
			}
		},
		goOrderDetail(row) {
			if (row.orderNo) this.$go('customer_order_detail', { orderNo: row.orderNo, title: '顾客订单详情' });
		},
		// 翻页操作
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 切换页面条数
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.loadData();
		},
	},
};
</script>
<style lang="scss" scoped>
.list-text {
	color: $color-hit;
	padding-top: 10px;
	padding-bottom: 20px;
}
.btn {
	float: right;
	margin-bottom: 15px;
}
</style>
