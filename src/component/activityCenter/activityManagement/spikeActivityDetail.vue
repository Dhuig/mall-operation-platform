<template>
	<div class="charging-list">
		<guideBar></guideBar>
		<el-card class="box-card">
			<el-tabs v-model="activeStatusTab">
				<el-tab-pane label="活动规则" name="activitybasis">
					<activity-basis :pageData="pageData" />
				</el-tab-pane>
				<el-tab-pane label="活动产品" name="product">
					<activity-product ref="activityproduct" />
				</el-tab-pane>
				<el-tab-pane label="活动顾客" name="customer" v-if="pageData.limitCustomer === 4">
					<activity-customer :pageData="pageData" ref="activitycustomer" />
				</el-tab-pane>
				<el-tab-pane label="活动数据" name="data">
					<activity-data ref="activitydata" />
				</el-tab-pane>
				<el-tab-pane label="不可购顾客" name="customerNot" v-if="pageData.limitCustomer === 2">
					<activity-customer-not :pageData="pageData" ref="activitycustomerNot" />
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>
<script>
import ActivityBasis from './detailModal/activityBasis';
import ActivityProduct from './detailModal/activityProduct';
import ActivityCustomer from './detailModal/activityCustomer';
import ActivityData from './detailModal/activityData';
import activityCustomerNot from './detailModal/activitycustomerNot';
export default {
	name: 'spikeActivityDetail',
	components: {
		ActivityBasis,
		ActivityProduct,
		ActivityCustomer,
		ActivityData,
    activityCustomerNot
	},
	data() {
		return {
			activeStatusTab: 'activitybasis',
			pageData: {},
		};
	},
	activated() {
		if (this.$route.query && !this.$route.query.id) return;
		this.pageId = this.$route.query.id;
		this.$listen('SPIKE_ACTIVITY_LOADDATA', this.loadData);
		this.loadData();
	},
	methods: {
		async loadData() {
			const res = await this.$fetch(`/mgmt/prmt/getPromotionInfo?promotionId=${this.pageId}`);
			if (res && res.code == 200) {
				this.pageData = res.data;
			}
		},
	},
	watch: {
		activeStatusTab: {
			handler(val) {
				if ((this.$route.query && !this.$route.query.id) || !this.$route.query.id) return;
				if (val === 'product') this.$refs.activityproduct.productData();
				if (val === 'customer') {
					this.$refs.activitycustomer.customerData();
					this.$refs.activitycustomer.productTotal();
					this.$refs.activitycustomer.recordGetData();
				}
				if (val === 'data') this.$refs.activitydata.activityData();
			},
			immediate: true,
		},
	},
};
</script>
<style lang="scss" scoped>
</style>
