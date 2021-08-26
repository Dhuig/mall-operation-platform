<template>
	<div class="charging-list">
		<guideBar></guideBar>
		<el-card class="box-card">
			<el-tabs v-model="activeStatusTab">
				<el-tab-pane label="优惠券信息" name="coupondata">
					<coupon-basis :pageData="pageData" ref="coupondata" />
				</el-tab-pane>
				<el-tab-pane label="使用范围" name="product">
					<coupon-product :pageData="pageData" ref="productRef" />
				</el-tab-pane>
				<el-tab-pane label="使用详情" name="breakdown">
					<coupon-data :pageData="pageData" ref="breakdown" />
				</el-tab-pane>
				<el-tab-pane label="优惠券码" name="couponCode" v-if="pageData.isGenerateCode === 1">
					<coupon-code :pageData="pageData" ref="couponCode" />
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>
<script>
import CouponBasis from './detailModal/couponBasis.vue';
import CouponCode from './detailModal/couponCode.vue';
import CouponProduct from './detailModal/couponProduct.vue';
import CouponData from './detailModal/couponData.vue';
export default {
	name: 'couponDetail',
	components: {
		CouponBasis,
		CouponProduct,
		CouponCode,
		CouponData,
	},
	data() {
		return {
			activeStatusTab: 'coupondata',
			pageData: {},
		};
	},
	created() {
		this.pageData.id = this.$route.query.id;
		this.$listen('GET_ACTIVITY_DATA', this.loadData);
		this.$listen('GET_ACTIVITY_DATA_LOADING', this.loading);
		this.loadData();
	},
	methods: {
		async loadData() {
			const res = await this.$fetch(`/mgmt/prmt/coupon/getBasicInfo?id=${this.$route.query.id}`);
			if (res && res.code == 200) this.pageData = { ...this.pageData, ...res.data };
		},
		loading(val) {
			if (val === 'product') {
				let { useRange } = this.pageData;
				this.$refs.productRef.getSelectProductPageData();
				if (useRange === 2 || useRange === 3) {
					this.$refs.productRef.productData();
				} else if (useRange === 4) {
					this.$refs.productRef.getproductType();
				} else if (useRange === 5) {
					this.$refs.productRef.getActivityData();
				}
			}
			if (val === 'breakdown') {
				this.$refs.breakdown.breakdown();
				this.$refs.breakdown.getCouponDataPage();
			}
			if (val === 'couponCode') {
				this.$refs.couponCode.customerCodeData();
				this.$refs.couponCode.breakdown();
			}
		},
	},
	watch: {
		activeStatusTab: {
			handler(val) {
				this.loading(val);
			},
			immediate: true,
		},
	},
};
</script>
<style lang="scss" scoped>
@import '@/assets/css/elementUi.scss';
.charging-list {
	.box-card {
		margin: 24px 0;
	}
}
</style>
