<template>
	<div>
		<el-card class="headerCard">
			<el-row class="margin25">
				<el-col :span="6">
					<div>订单编号：{{ declarationData.orderNo }}</div>
				</el-col>
				<el-col :span="6">
					<div>报单人：{{ declarationData.reportName }} {{ declarationData.reportCardNo }}</div>
				</el-col>
			</el-row>
			<el-row class="margin25">
				<el-col :span="6">
					<div>已报单金额合计：￥ {{ declarationData.reportedAmount }}</div>
				</el-col>
				<el-col :span="6">
					<div>未报单金额合计：￥ {{ declarationData.restAmount }}</div>
				</el-col>
				<el-col :span="6">
					<div>云商应得返款合计：￥ {{ declarationData.totalRebate }}</div>
				</el-col>
			</el-row>
		</el-card>
		<div v-if="declarationData.details.length">
			<el-card v-for="(item, index) in declarationData.details" :key="index">
				<el-row class="margin25">
					<el-col :span="6">
						<div>报单时间：{{ item.reportTime }}</div>
					</el-col>
					<el-col :span="6">
						<div>购货人：{{ item.purchaserName }} {{ item.purchaserCardNo }}</div>
					</el-col>
					<el-col :span="6">
						<div>金额：￥ {{ item.amount }}</div>
					</el-col>
					<el-col :span="6">
						<div v-if="item.state == 2" class="red">已取消</div>
					</el-col>
				</el-row>
				<el-row class="margin25">
					<el-col :span="6">
						<div>PV：{{ item.pv }}</div>
					</el-col>
					<el-col :span="6">
						<div>云商应得返款：￥{{ item.rebate }}</div>
					</el-col>
					<el-col :span="6">
						<div>单位团购转分订单编号：{{ item.reportNo }}</div>
					</el-col>
				</el-row>
				<el-table :data="item.products" border style="width: 100%">
					<el-table-column prop="productCode" label="产品编码" width="180"></el-table-column>
					<el-table-column prop="productName" label="产品名称" width="300"></el-table-column>
					<el-table-column prop="retailPrice" label="单价"></el-table-column>
					<el-table-column prop="pv" label="积分（PV）"></el-table-column>
					<el-table-column prop="num" label="数量"></el-table-column>
					<el-table-column prop="retailPriceSum" label="金额小计"></el-table-column>
					<el-table-column prop="pvSum" label="PV小计"></el-table-column>
				</el-table>
			</el-card>
		</div>
		<actionBar>
			<el-row type="flex" justify="end">
				<el-button @click="$closeSelf()">关闭</el-button>
			</el-row>
		</actionBar>
	</div>
</template>
<script>
export default {
	name: 'declarationDetails',
	data() {
		return {
			declarationData: {
				details: [],
			},
		};
	},
	methods: {
		async getDate() {
			const { orderNo } = this.$route.query;
			const res = await this.$fetch({
				url: `/mgmt/inventory/group-order/report-view`,
				params: { orderNo },
			});
			if (res?.code == 200) {
				this.declarationData = res.data;
			}
		},
	},
	mounted() {
		this.getDate();
	},
};
</script>
<style lang="scss" scoped>
.customer-tab > .el-tabs > .el-tabs__content > .el-tab-pane > .headerCard {
	padding-bottom: 0 !important;
}
.margin25 {
	margin: 25px 0;
}
.red {
	color: red;
}
</style>