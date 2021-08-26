<template>
	<div class="group-buy-order-stock-detail">
		<tableList
			class="table"
			:loading="loading"
			:dataSource="data"
			:columns="GROUP_BUY_STOCK_DETAIL_COLUMNS"
			:options="{ index: true, labelIndex: '序号' }"
		></tableList>
	</div>
</template>

<script>
import { GROUP_BUY_STOCK_DETAIL_COLUMNS } from './config';

export default {
	name: 'groupBuyOrderStockDetail',
	data() {
		return {
			GROUP_BUY_STOCK_DETAIL_COLUMNS,
			loading: false,
			data: [],
		};
	},
	methods: {
		async loadData() {
			const { orderNo, productCode } = this.$route.query;
			this.loading = true;
			const res = await this.$fetch({
				url: '/mgmt/inventory/group-order/stock/detail',
				params: { orderNo, productCode },
			});
			if (res && res.data) {
				this.data = res.data;
			} else {
				this.$message.error(res.message);
			}
			this.loading = false;
		},
	},
	mounted() {
		this.loadData();
	},
};
</script>

<style lang="scss" scoped>
.group-buy-order-stock-detail {
	.table {
		margin-top: 20px;
	}
}
</style>
