<template>
	<div class="print-dialog">
		<print
			id="print-dialog"
			title="服务中心换货审批单"
			:tableData="getTableData"
			:tableHead="tableHead"
			:headerHeight="headerHeight + addHeaderHeight"
			:signHeight="signHeight"
			:subTitleHeight="subTitleHeight"
			@onPrint="$emit('onPrint')"
		>
			<!-- <template slot="sub-title" slot-scope="subTitle">
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
			</template> -->
			<template slot="header">
				<div class="order-header-bar">
					<div class="item">
						<div class="label">退换货单号：</div>
						<div class="value">{{ userMessage['orderSn'] }}</div>
					</div>
					<div class="item">
						<div class="label">服务中心编号：</div>
						<div class="value">{{ userMessage['storeCode'] }}</div>
					</div>
					<!-- <div class="item">第{{ header.data.index + 1 }}页，共{{ header.data.length }}页</div> -->
				</div>
				<div class="order-header-info">
					<div class="order-header-cell flex">
						<div class="item">
							<div class="label">退换货原因：</div>
							<div class="value">{{ userMessage['reasonFirst'] }}</div>
						</div>
						<div class="item">
							<div class="label">二级原因：</div>
							<div class="value">{{ userMessage['reasonSecond'] }}</div>
						</div>
					</div>
					<div class="order-header-cell flex" v-if="userMessage['customerType'] != 1">
						<div class="item">
							<div class="label">押货金额合计：￥</div>
							<div class="value">{{ userMessage['returnPledgeTotal'] || 0 }}</div>
						</div>
						<div class="item">
							<div class="label">零售额合计：￥</div>
							<div class="value">
								{{ userMessage['returnAmountTotal'] || 0 }}
							</div>
						</div>
					</div>
					<!-- <div class="order-header-cell flex-all" v-if="userMessage['expressType'] == 1">
						<div class="item">
							<div class="label">服务中心名称/电话：</div>
							<div class="value">
								{{ userMessage['address'] }}
								{{ userMessage['receiverPhone'] }}
							</div>
						</div>
					</div> -->
				</div>
			</template>
			<template slot="sign">
				<div class="approval">
					<div class="approval_box" v-for="item in userMessage['opinionVos']" :key="item.id">
						<p class="approval_con">审批意见：{{ item.content }}</p>
						<p class="approved_by">
							<span>
								审批人：
								<span>{{ item.submitMan }}</span>
								<span>{{ item.submitManNo }}</span>
							</span>
							<span class="marginL50">审批日期：{{ item.createTime }}</span>
						</p>
					</div>
				</div>
				<div class="order-remark">
					<!-- <div class="remark-info">
						注：消费者在购买产品30天内，将完好无损、具有销售价值的产品连同本单据一起退回，可按本单据价格等值换货或者退货。
					</div>
					<div class="sign-info">
						<div class="sign-item"><span>发货人：</span></div>
						<div class="sign-item"><span>(服务中心盖章)</span></div>
						<div class="sign-item"><span>顾客签收：</span></div>
						<div class="sign-item"><span>日期：</span></div>
					</div> -->
				</div>
			</template>
		</print>
	</div>
</template>
<script>
import Print from 'component/common/print';
import { formatCurrency } from 'util/formValidation';
import { PRODUCT_DISPOAL_TYPE } from '../config';
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
			PRODUCT_DISPOAL_TYPE,
			// options: {
			// 	index: 1,
			// 	labelIndex: '序号',
			// },
			headerHeight: 26,
			addHeaderHeight: 0,
			signHeight: 30,
			subTitleHeight: 8,
			tableHead: [
				{
					label: '产品编号',
					key: 'productCode',
					width: '20mm',
				},
				{
					label: '产品名称',
					key: 'productName',
					width: '35mm',
				},
				{
					label: '规格',
					key: 'productPacking',
					width: '20mm',
				},
				{
					label: '押货价',
					key: 'productMortgagePrice',
					width: '20mm',
					// textAlign: 'right',
				},
				{
					label: '零售价',
					key: 'productRetailPrice',
					width: '20mm',
					// textAlign: 'right',
				},
				{
					label: '生产日期/有效期',
					key: 'productProductionDate',
					width: '30mm',
					// textAlign: 'right',
				},
				{
					label: '批次',
					key: 'productBatch',
					width: '20mm',
					// textAlign: 'right',
				},
				{
					label: '序列号/二维码',
					key: 'productSn',
					width: '30mm',
					// textAlign: 'right',
				},
				{
					label: '单位',
					key: 'productUnit',
					width: '15mm',
					// textAlign: 'right',
				},
				{
					label: '数量',
					key: 'productNum',
					width: '15mm',
					// textAlign: 'right',
				},
				{
					label: '类型',
					key: 'productDisposalType',
					width: '25mm',
					// textAlign: 'right',
				},
				{
					label: '押货金额',
					key: 'pledgePrice',
					width: '25mm',
					// textAlign: 'right',
				},
			],
		};
	},
	computed: {
		getTableData() {
			return this.tableData.map(item => {
				return {
					...item,
					productMortgagePrice: '￥' + formatCurrency(item.productMortgagePrice),
					productRetailPrice: '￥' + formatCurrency(item.productRetailPrice),
					productDisposalType: PRODUCT_DISPOAL_TYPE ? PRODUCT_DISPOAL_TYPE[item.productDisposalType] : '',
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
	height: 210mm;
	flex-direction: column;
	display: flex;
	justify-content: space-between;
	padding: 0 0;
	overflow: auto;
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
/* .order-header-info .value {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
} */
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
	padding: 1mm;
	border: 1px #000 solid;
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
/* 审批 */
/* .approval {
	margin-top: 2mm;
}
.approval .approval_box {
	color: blue;
	padding: 20px;
	font-size: 15px;
	border: 1px solid #232426;
	height: 100%;
}
.approval .approval_box .approval_con {
	height: 100pt;
	display: block;
}
.approval .approval_box .approved_by span {
	margin-right: 15px;
} */
</style>
