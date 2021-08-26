<template>
	<div>
		<el-card class="box-card">
			<searchPanel :config="PRODUCT_CONFIG" @search="handleSearch" @reset="handleReset" />
		</el-card>
		<el-card class="card-gap">
			<div class="product-text">如果要将产品移出活动，请在产品管理内将产品进行下架操作，或直接停止活动。</div>
			<tableList
				border
				:dataSource="product.data"
				:columns="PRODUCT_COLUMNS"
				:pagination="product.pagination"
				:dataTotal="product.total"
				:loading="product.loading"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			>
				<template slot="content_context">
					<div class="daochu">
						<el-button
							class="btn-dc"
							type="primary"
							v-permission="'spike_activity_product_export'"
							@click="productData(1)"
						>
							导 出
						</el-button>
					</div>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { PRODUCT_COLUMNS, PRODUCT_CONFIG } from '../config';
import { exportExcel } from 'util';
import qs from 'querystring';
export default {
	name: 'activityProduct',
	data() {
		return {
			PRODUCT_COLUMNS,
			PRODUCT_CONFIG,
			product: {
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				loading: false,
				total: 0,
				product: '',
			},
		};
	},
	created() {},
	methods: {
		handleChangePage(val) {
			this.product.pagination.currentPage = val;
			this.productData();
		},
		handleSizeChange(val) {
			this.product.pagination.pageSize = val;
			this.productData();
		},
		// 查询事件
		handleSearch({ product }) {
			this.product.product = product;
			this.productData();
		},
		// 重置事件
		handleReset({ product }) {
			this.product.product = product;
			this.productData();
		},
		async productData(status) {
			let {
				product: {
					pagination: { currentPage, pageSize },
					product,
				},
			} = this;
			let { id } = this.$route.query;
			let params = { pageNum: currentPage, pageSize, product, promotionId: id };
			if (status) {
				exportExcel(`/mgmt/prmt/exportProductList`, { product, promotionId: id });
				return;
			}
			const res = await this.$fetch(`/mgmt/prmt/getProductListPage?${qs.stringify(params)}`);
			if (res && res.code == 200) {
				this.product.data = res.data.list;
				this.product.total = res.data.total;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.product-text {
	color: $color-body-se;
	font-size: 14px;
}
.daochu {
	height: 32px;
	padding: 0 0 15px 0;
	.btn-dc {
		float: right;
	}
}
</style>
