<template>
	<el-dialog
		title="申请售后"
		:visible.sync="afterSaleModal.show"
		:lock-scroll="false"
		width="45%"
		destroy-on-close
		v-drag
	>
		<div class="order-info">
			<p>
				<span>订单号: {{ afterSaleModal.orderNo }}</span>
				<span>交付方式: {{ afterSaleModal.expressTypeDesc }}</span>
			</p>
			<p v-if="afterSaleModal.expressType == 1" class="service-info">
				服务中心:
				<span>{{ afterSaleModal.storeCode }}</span>
				<span>{{ afterSaleModal.storeName }}</span>
				<span>{{ afterSaleModal.storePhone }}</span>
				<span v-if="afterSaleModal.isStoreClosed">(已结点)</span>
			</p>
			<p v-if="afterSaleModal.isStoreClosed">该自提服务中心已经结点，将由完美总部为你提供售后服务。</p>
		</div>
		<el-card class="card">
			<el-button type="text" @click="applyReturn(afterSaleModal.orderNo)">申请退货/退款</el-button>
			<p>不管客户是否收到货，均可在此申请退货</p>
			<p class="waring" v-if="afterSaleModal.isStoreReturnOver">该服务中心押货余额超出极限值</p>
		</el-card>
		<el-card class="card">
			<el-button
				type="text"
				@click="applyExchange(afterSaleModal.orderNo)"
				:disabled="afterSaleModal.expressType === 1"
			>
				申请换货
			</el-button>
			<p v-if="afterSaleModal.expressType === 2">当产品质量有问题时，可在此申请更换产品</p>
			<p v-else>自提订单不可在线申请换货，请联系自提服务中心处理</p>
		</el-card>

		<span slot="footer">
			<span>
				<el-button @click.stop="afterSaleModal.show = false">取 消</el-button>
			</span>
		</span>
	</el-dialog>
</template>

<script>
export default {
	name: 'afterSaleModal',
	data() {
		return {};
	},
	props: ['afterSaleModal'],
	methods: {
		applyReturn(orderNo) {
			this.$go('apply_return', { orderNo, orderProductVos: JSON.stringify(this.afterSaleModal.orderProductVos) });
			this.afterSaleModal.show = false;
		},
		applyExchange(orderNo) {
			this.$go('apply_exchange', { orderNo, orderProductVos: JSON.stringify(this.afterSaleModal.orderProductVos) });
			this.afterSaleModal.show = false;
		},
	},
	mounted() {
		console.log(this.afterSaleModal);
	},
};
</script>

<style lang="scss" scoped>
.service-info span {
	margin-right: 8px;
}
.order-info {
	margin-bottom: 20px;
	> p {
		padding: 6px 0;
	}
	> p > span {
		margin-right: 20px;
	}
}
.card {
	margin-bottom: 20px;
	.waring {
		padding-top: 10px;
		color: $error;
	}
}
</style>
