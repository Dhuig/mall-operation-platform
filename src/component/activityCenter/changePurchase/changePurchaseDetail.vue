<template>
	<div class="charging-list">
		<guideBar>
			<el-button class="btns-btn" @click="$closeSelf()">返回</el-button>
		</guideBar>
		<el-card class="box-card">
			<el-tabs v-model="activeStatusTab">
				<el-tab-pane label="换购方案" name="activitydata">
					<redeem-basis :pageData="pageData" />
				</el-tab-pane>
				<el-tab-pane label="换购产品" name="product">
					<redeem-product ref="activityproduct" />
				</el-tab-pane>
				<el-tab-pane label="参与顾客" name="customer" v-if="pageData.limitCustomer === 4">
					<redeem-customer :pageData="pageData" ref="activitycustomer" />
				</el-tab-pane>
				<el-tab-pane label="换购数据" name="data">
					<redeem-data ref="activitydata" />
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>
<script>
import RedeemBasis from './detailModal/redeemBasis';
import RedeemProduct from './detailModal/redeemProduct';
import RedeemCustomer from './detailModal/redeemCustomer';
import RedeemData from './detailModal/redeemData';
export default {
	name: 'changePurchaseDetail',
	components: {
		RedeemBasis,
		RedeemProduct,
		RedeemCustomer,
		RedeemData,
	},
	data() {
		return {
			activeStatusTab: 'activitydata',
			pageData: {},
			pageId: null,
		};
	},
	activated() {
		this.$listen('CHANGE_PURCHASE_DETAIL_LOADATA', this.loadData);
		this.pageId = this.$route.query.id;
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
