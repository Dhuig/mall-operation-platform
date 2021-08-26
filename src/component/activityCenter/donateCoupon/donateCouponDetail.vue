<template>
	<div class="platform-activeCenter_couponHandDetail-wrap">
		<guideBar></guideBar>
		<el-card>
			<el-tabs v-model="activeTab">
				<el-tab-pane label="派发信息" name="basis">
					<donate-coupon-basis :pageData="pageData" ref="basis" />
				</el-tab-pane>
				<el-tab-pane label="门店列表" name="store">
					<donate-store ref="store" :pageData="pageData" />
				</el-tab-pane>
				<el-tab-pane label="优惠券详情" name="details">
					<donate-detail :pageData="pageData" ref="details" />
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import DonateCouponBasis from './detailModal/donateCouponBasis.vue';
import DonateStore from './detailModal/donateStore.vue';
import DonateDetail from './detailModal/donateDetail.vue';
export default {
	name: 'donateCouponDetail',
	components: {
		DonateCouponBasis,
		DonateStore,
		DonateDetail,
	},
	data() {
		return {
			queryId: null,
			pageData: {},
			activeTab: 'basis',
		};
	},
	created() {
		this.queryId = this.$route.query.id;
	},
	methods: {},
	watch: {
		activeTab: {
			handler(val) {
				this.$nextTick(() => {
					if (val == 'basis') this.$refs.basis.loadData();
					if (val == 'store') this.$refs.store.loadData();
					if (val == 'details') this.$refs.details.loadData();
				});
			},
			immediate: true,
		},
	},
};
</script>
<style lang="scss" scoped>
</style>
