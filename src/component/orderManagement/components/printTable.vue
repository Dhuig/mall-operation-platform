<template>
	<div class="print-dialog">
		<print
			id="print-dialog"
			title="发货单"
			:tableData="getTableData"
			:tableHead="tableHead"
			:headerHeight="headerHeight + addHeaderHeight"
			:signHeight="signHeight"
			:subTitleHeight="subTitleHeight"
			@onPrint="$emit('onPrint')"
		>
			<template slot="sub-title" slot-scope="subTitle">
				<div class="sub-title">
					<div class="item">
						<div class="label">订单号：</div>
						<div class="value">{{ userMessage['orderNo'] }}</div>
					</div>
					<div class="item">
						<div class="label">购货日期：</div>
						<div class="value">{{ userMessage['commitTime'] }}</div>
					</div>
					<div class="item">第{{ subTitle.data.index + 1 }}页，共{{ subTitle.data.length }}页</div>
				</div>
			</template>
			<template slot="header" slot-scope="header">
				<div class="order-header-bar">
					<div class="item">
						<div class="label">购货日期：</div>
						<div class="value">{{ userMessage['commitTime'] }}</div>
					</div>
					<div class="item">
						<div class="label">销售方：</div>
						<div class="value">完美（中国）有限公司</div>
					</div>
					<div class="item">第{{ header.data.index + 1 }}页，共{{ header.data.length }}页</div>
				</div>
				<div class="order-header-info">
					<div class="order-header-cell flex">
						<div class="item">
							<div class="label">订单号（与购货单的订单号一致）：</div>
							<div class="value">{{ userMessage['orderNo'] }}</div>
						</div>
					</div>
					<div class="order-header-cell flex" v-if="userMessage['customerType'] != 1">
						<div class="item">
							<div class="label">顾客卡号/姓名：</div>
							<div class="value">
								<span v-if="userMessage['customerCard']">{{ userMessage['customerCard'] }}</span>
								<span>{{ userMessage['customerName'] }}</span>
							</div>
						</div>
						<div class="item">
							<div class="label">顾客电话：</div>
							<div class="value">
								{{ userMessage['customerPhone'] }}
							</div>
						</div>
					</div>
					<div class="order-header-cell flex-all" v-if="userMessage['expressType'] == 1">
						<div class="item">
							<div class="label">服务中心名称/电话：</div>
							<div class="value">
								{{ userMessage['address'] }}
								{{ userMessage['receiverPhone'] }}
							</div>
						</div>
					</div>
				</div>
			</template>
			<template slot="sign">
				<div class="order-total">
					<div>订单总金额：￥ {{ userMessage['orderAmount'] }}</div>
					<div>总PV：{{ userMessage['pv'] }}</div>
					<div class="order-total-count"></div>
				</div>
				<div class="order-remark">
					<div class="remark-info">
						注：消费者在购买产品30天内，将完好无损、具有销售价值的产品连同本单据一起退回，可按本单据价格等值换货或者退货。
					</div>
					<div class="sign-info">
						<div class="sign-item"><span>发货人：</span></div>
						<div class="sign-item"><span>(服务中心盖章)</span></div>
						<div class="sign-item"><span>顾客签收：</span></div>
						<div class="sign-item"><span>日期：</span></div>
					</div>
				</div>
			</template>
		</print>
	</div>
</template>
<script>
import Print from 'component/common/print';
import { formatCurrency } from 'util/formValidation';
export default {
	components: {
		Print,
	},
	props: {
		userMessage: {
			type: Object,
		},
		tableData: {
			default: () => {
				return [];
			},
			type: Array,
		},
		orderAllData: {
			default: () => {
				return {};
			},
			type: Object,
		},
	},
	data() {
		return {
			options: {
				index: 1,
				labelIndex: '序号',
			},
			headerHeight: 26,
			addHeaderHeight: 0,
			signHeight: 30,
			subTitleHeight: 8,
			tableHead: [
				{
					label: '序号',
					key: 'index',
					width: '10mm',
				},
				{
					label: '产品编码',
					key: 'serialNo',
					width: '20mm',
				},
				{
					label: '产品名称',
					key: 'title',
					// width: '16mm',
				},
				{
					label: '单价',
					key: 'retailPrice',
					width: '22mm',
					textAlign: 'right',
				},
				{
					label: '数量',
					key: 'quantity',
					width: '12mm',
					textAlign: 'right',
				},
				{
					label: '小计',
					key: 'totalPrice',
					width: '22mm',
					textAlign: 'right',
				},
				{
					label: 'PV',
					key: 'totalPv',
					width: '15mm',
					textAlign: 'right',
				},
			],
		};
	},
	computed: {
		getTableData() {
			return this.tableData.map((item, index) => {
				return {
					...item,
					index: index + 1,
					retailPrice: '￥' + formatCurrency(item.retailPrice),
					totalPrice: '￥' + formatCurrency(item.totalPrice),
				};
			});
		},
	},
};
</script>
<style scoped>
.print-dialog {
	font-size: 7.5pt;
	line-height: 1.2;
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	width: 126mm;
	height: 105mm;
	flex-direction: column;
	display: flex;
	justify-content: space-between;
	padding: 0 0;
	overflow: hidden;
}
.order-header-bar {
	margin-top: 2mm;
	display: flex;
	justify-content: space-between;
	padding-bottom: 1mm;
	border-bottom: 1px #000 solid;
}
.order-header-bar .item {
	display: flex;
}

.order-header-bar .item .label {
	/* margin-right: 2mm; */
}

.order-header-info {
	margin-top: 2mm;
	flex-wrap: wrap;
	display: flex;
	flex-direction: column;
}
.order-header-info .flex {
	overflow: hidden;
	box-sizing: border-box;
	display: flex;
	width: 100%;
}
.order-header-info .flex .item {
	flex: 1;
	overflow: hidden;
}
.order-header-info .flex-all .item {
	flex: 1;
	overflow: hidden;
}
.order-header-info .flex-all {
	display: flex;
	overflow: hidden;
}
.order-header-info .flex-all .item,
.order-header-info .flex .item {
	display: flex;
	/* margin-bottom: 2mm; */
	overflow: hidden;
}
.order-header-info .value {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
.order-header-info .value span {
	margin-right: 2mm;
}
.order-header-info .value-all {
	word-break: break-all;
	max-height: 20pt;
	overflow: hidden;
}
.order-header-info .value-all span {
	margin-right: 2mm;
}
.order-header-info .flex-all .label,
.order-header-info .flex .label {
	/* margin-right: 2mm; */
	white-space: nowrap;
}

.order-total {
	margin-top: 2mm;
	justify-content: space-between;
	display: flex;
	padding-bottom: 1mm;
	border-bottom: 1px #000 solid;
}
.order-remark {
	margin-top: 4mm;
}
.order-remark .remark-info {
	margin-bottom: 2mm;
}
.order-remark .sign-info {
	display: flex;
}
.order-remark .sign-info .sign-item {
	flex: 1;
}
.order-remark .sign-info .sign-item span {
	margin-right: 2mm;
}
</style>
