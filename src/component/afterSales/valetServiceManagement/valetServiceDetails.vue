<template>
	<div class="valetServiceDetails">
		<guideBar />
		<el-card class="topCard">
			<div>订单编号：{{ data.orderNo }}</div>
			<div>顾客卡号：{{ data.customerCard }}</div>
			<div>顾客姓名：{{ data.customerName }}</div>
			<div>订单金额：￥{{ Number(data.orderAmount).toFixed(2) }}</div>
			<div>订单状态：{{ ORDER_STATUS[data.orderStatus] }}</div>
			<div>下单时间：{{ data.commitTimeDesc }}</div>
		</el-card>
		<el-card class="card">
			<h2>产品明细</h2>
			<tableList
				:data-source="data.orderProductVos"
				:columns="PRODUCT_DETAILS_COLUMNS"
				showSummary
				:options="{
					index: true,
					labelIndex: '序号',
				}"
			></tableList>
		</el-card>
		<actionBar>
			<template>
				<el-button @click="$closeSelf()">返回</el-button>
				<el-button type="primary" v-permission="'valet_service_apply_return'" @click="skip('apply_return')">
					退货
				</el-button>
				<el-button type="primary" v-permission="'valet_service_apply_exchange'" @click="skip('apply_exchange')">
					换货
				</el-button>
			</template>
		</actionBar>
	</div>
</template>

<script>
import { PRODUCT_DETAILS_COLUMNS, ORDER_STATUS } from './config';
export default {
	name: 'valetServiceDetails',
	data() {
		return {
			PRODUCT_DETAILS_COLUMNS,
			ORDER_STATUS,
			data: {
				orderProductVos: [],
			},
		};
	},
	methods: {
		//获取代客售后
		async loadData() {
			const { orderNo } = this.$route.query;
			const res = await this.$fetch({
				url: `/mgmt/order/orderInfo/${orderNo}`,
			});
			if (res?.code == 200) {
				this.data = res.data;
			} else {
				// 后台报什么奇怪code 返回错误信息
				if (this.$store.getters['system/getError']) {
					this.$message({
						type: 'error',
						message: res.message,
					});
				}
			}
		},
		// 跳转
		skip(type) {
			if (this.data.serviceNo) {
				return this.$message.warning('订单申请售后中');
			}
			const {
				data: { orderNo, orderProductVos },
				$route: { query, path },
			} = this;
			// 保存自身需要关闭的路径
			this.$store.commit('system/UPDATA_CLOSE_TAB_ARR', { query, path });

			const data = {
				orderNo,
				applySource: '0',
			};
			if (type == 'apply_exchange') {
				if (this.data.orderStatus == 2) {
					return this.$message.warning('订单未发货,无法申请换货');
				}
				Object.assign(data, { orderProductVos: JSON.stringify(orderProductVos) });
			}
			this.$go(type, data);
		},
	},
	mounted() {
		this.loadData();
	},
};
</script>
<style lang="scss" scoped>
.topCard {
	::v-deep .el-card__body {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		div {
			margin-top: 10px;
			width: 30%;
		}
	}
}
</style>