<template>
	<div class="print-dialog">
		<print
			id="print-dialog"
			title="服务中心退货审批单"
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
							<div class="label">押货退货金额合计：￥</div>
							<div class="value">{{ userMessage['totalAmount'] || 0 }}</div>
						</div>
						<div class="item">
							<div class="label">零售额合计：￥</div>
							<div class="value">
								{{ userMessage['retailPriceTotal'] || 0 }}
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
				<div>
					<p class="approval_title">审批意见</p>
					<div class="return_goods_approval">
						<div class="return_goods_approval_tr">
							<span class="return_goods_approval_th">序号</span>
							<span class="return_goods_approval_th">留言时间</span>
							<span class="return_goods_approval_th">留言人</span>
							<span class="return_goods_approval_th">分公司</span>
							<span class="return_goods_approval_th">留言内容</span>
						</div>
						<div class="return_goods_approval_tr" v-for="(item, key) in userMessage['opinionVoList']" :key="key">
							<span class="return_goods_approval_td">{{ key + 1 }}</span>
							<span class="return_goods_approval_td">{{ item.createTime }}</span>
							<span class="return_goods_approval_td">{{ item.submitMan }}</span>
							<span class="return_goods_approval_td">{{ item.companyName }}</span>
							<span class="return_goods_approval_td">{{ item.content }}</span>
						</div>
					</div>
				</div>
				<div class="order-remark">
					<p class="approval_title">审批信息</p>
					<div class="approval_info">
						<span class="approval_info_span">审批日期：{{ userMessage['auditTime'] | format }}</span>
						<span class="approval_info_span">审批人：{{ userMessage['auditMan'] }}</span>
						<span class="approval_info_span">审批意见：{{ userMessage['auditStatus'] | auditStatus }}</span>
					</div>
				</div>
			</template>
		</print>
	</div>
</template>
<script>
import Print from 'component/common/print';
import { formatCurrency, formatDate } from 'util/formValidation';
import { AUDIT_STATUS } from '../config';
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
			AUDIT_STATUS,
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
					width: '15mm',
					// textAlign: 'right',
				},
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
					label: '单位',
					key: 'productUnit',
					width: '15mm',
					// textAlign: 'right',
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
					label: '退货数量',
					key: 'productNum',
					width: '20mm',
					// textAlign: 'right',
				},
				{
					label: '备注',
					key: 'productRemarks',
					width: '30mm',
					// textAlign: 'right',
				},
				{
					label: '实退数量',
					key: 'productRealNum',
					width: '20mm',
					// textAlign: 'right',
				},

				{
					label: '实退总金额',
					key: 'productRealAmount',
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
				};
			});
		},
	},
	filters: {
		// 格式时间
		format(val) {
			if (!val) return;
			return formatDate(val);
		},
		// 审批意见
		auditStatus(val) {
			return val in AUDIT_STATUS ? AUDIT_STATUS[val] : '';
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
</style>
