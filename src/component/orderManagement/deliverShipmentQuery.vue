<template>
	<div>
		<guideBar>
			<el-button type="primary" @click="$closeSelf()" icon="el-icon-back">返回</el-button>
			<el-button type="primary" @click="printShipment" icon="el-icon-printer">打印发货单</el-button>
		</guideBar>
		<div class="card" ref="print" id="print">
			<h5 class="part-title">发货单</h5>
			<div class="flex marginB20">
				<div style="width: 50%">购货日期：{{ commitTime | formatDate('day') }}</div>
				<div>销售方：完美（中国）有限公司</div>
			</div>
			<div class="line"></div>
			<div class="flex marginB20">
				<div ref="printHeader">订单号（与购货单的订单号一致）：{{ orderNo }}</div>
			</div>
			<div class="flex marginB20">
				<div style="width: 50%">顾客卡号/姓名：{{ customerCard }} {{ customerName }}</div>
				<div>顾客电话: {{ customerPhone }}</div>
			</div>
			<div class="flex marginB20" v-if="expressType == 1">
				<div>
					服务中心名称/电话：{{ address }}
					<span v-if="receiverPhone">({{ receiverPhone }})</span>
				</div>
			</div>
			<table class="table">
				<div class="flex th">
					<div class="W15">产品代码</div>
					<div class="W30">产品名称</div>
					<div class="W15">单价</div>
					<div class="W10">数量</div>
					<div class="W15">小计</div>
					<div class="W15">PV</div>
				</div>
				<div class="flex td" v-for="item in orderProductVos" :key="item.serialNo">
					<div class="W15">{{ item.serialNo }}</div>
					<div class="W30">{{ item.title }}</div>
					<div class="W15">￥{{ item.retailPrice | formatCurrency }}</div>
					<div class="W10">{{ item.quantity }}</div>
					<div class="W15">￥{{ item.totalPrice | formatCurrency }}</div>
					<div class="W15">{{ item.totalPv }}</div>
				</div>
			</table>
			<div class="flex marginT20">
				<div style="width: 50%">订单总金额：￥ {{ orderAmount | formatCurrency }}</div>
				<div>订单积分PV：{{ pv }}</div>
			</div>
			<div class="line"></div>
			<div class="tips">
				注：消费者在购买产品30天内，将完好无损、具有销售价值的产品连同本单据一起退回，可按本单据价格等值换货或者退货。
			</div>
			<div class="flex bottomNote">
				<span>发货人:</span>
				<span>(服务中心盖章)</span>
				<span>顾客签收:</span>
				<span>日期:</span>
			</div>
		</div>

		<div class="global-print-dialog" v-if="printDialog">
			<printTable
				:tableData="nowCheckData"
				:userMessage="printFormData"
				:orderAllData="orderAllData"
				:id="`printDialog-${nowTime}-1`"
				@onPrint="onPrint"
			></printTable>
		</div>
	</div>
</template>

<script>
import { formatDate, formatCurrency } from 'util/formValidation';
export default {
	name: 'deliverShipmentQuery',
	data() {
		return {
			orderProductVos: [],
			orderNo: '',
			commitTime: '',
			seller: '',
			companyName: '',
			customerName: '',
			customerCard: '',
			receiverAddress: '',
			expressType: '',
			receiver: '',
			customerPhone: '',
			orderAmount: '',
			pv: '',
			customerType: '',
			// 打印
			printDialog: false,
			//打印数据
			printFormData: {},
			//选中要打印的表格数据
			nowCheckData: [],
			//打印表格的订单金额数据
			orderAllData: {},
			nowTime: formatDate(new Date()),
		};
	},
	computed: {
		totalAmount() {
			return this.orderProductVos.reduce((pre, val) => {
				return pre + val.totalPrice;
			}, 0);
		},
		totalPV() {
			return this.orderProductVos.reduce((pre, val) => {
				return pre + val.totalPv;
			}, 0);
		},
		address() {
			if (this.receiverAddress) {
				const { address } = this.receiverAddress;
				return address;
			}
			return '';
		},
		receiverPhone() {
			if (this.receiverAddress) {
				const { storePhone } = this.receiverAddress;
				return storePhone;
			}
			return '';
		},
	},
	methods: {
		async loadData() {
			const { orderNo } = this.$route.query;
			const res = await this.$fetch({ url: `/mgmt/order/orderInfo/${orderNo}` });
			if (res && res.data) {
				// 缺少一个公司电话的字段
				const {
					orderProductVos,
					orderNo,
					commitTime,
					seller,
					companyName,
					customerName,
					customerCard,
					receiverAddress,
					receiver,
					customerPhone,
					orderAmount,
					pv,
					expressType,
					customerType,
				} = res.data;
				this.orderProductVos = orderProductVos;
				this.orderNo = orderNo;
				this.commitTime = commitTime;
				this.seller = seller;
				this.companyName = companyName;
				this.customerName = customerName;
				this.customerCard = customerCard;
				this.receiverAddress = JSON.parse(receiverAddress);
				this.expressType = expressType; // expressType == 1 自提
				this.customerType = customerType; // customerType == 1 普通顾客
				// this.receiverPhone = receiverPhone;
				this.receiver = receiver;
				this.customerPhone = customerPhone;
				this.orderAmount = orderAmount;
				this.pv = pv;
			}
		},
		// 打印发货
		printShipment() {
			const {
				orderNo,
				totalAmount,
				totalPV,
				customerCard,
				customerPhone,
				customerName,
				address,
				receiverPhone,
				expressType,
				customerType,
				orderAmount,
				pv,
			} = this;
			this.orderAllData = {
				totalAmount,
				totalPV,
				deliver: null,
			};
			this.printFormData = {
				orderNo,
				commitTime: formatDate(this.commitTime, 'day'),
				customerCard,
				customerName,
				customerPhone,
				address,
				receiverPhone,
				expressType,
				customerType,
				orderAmount: formatCurrency(orderAmount),
				pv,
			};
			this.nowCheckData = this.orderProductVos;
			this.printDialog = true;
		},
		onPrint() {
			this.$nextTick(() => {
				this.$print({
					printable: `printDialog-${this.nowTime}-1`,
					type: 'html',
					scanStyles: false,
					css: 'print_css/orderPrint.css',
				});
				this.printDialog = false;
			});
		},
	},
	mounted() {
		this.loadData();
	},
	filters: {
		formatDate,
		formatCurrency,
	},
};
</script>

<style lang="scss" scoped>
.card {
	border: 1px solid #ebeef5;
	background-color: #fff;
	color: #232426;
	transition: 0.3s;
	padding: 20px;
	.W30 {
		width: 30%;
	}
	.W15 {
		width: 15%;
	}
	.W10 {
		width: 10%;
	}
	.part-title {
		color: $color-title;
		font-size: 24px;
		text-align: center;
		font-weight: bold;
		margin-bottom: 25px;
	}
	.flex {
		display: flex;
		color: #232426;
		font-size: 14px;
	}
	.marginT20 {
		margin-top: 20px;
	}
	.marginB20 {
		margin-bottom: 20px;
	}
	.table {
		width: 100%;
		text-align: center;
		box-sizing: border-box;
		font-size: 14px;
		border-top: 1px solid #232426;
		border-left: 1px solid #232426;
		.th {
			font-size: 14px;
			box-sizing: border-box;
			border-bottom: 1px solid #232426;

			div {
				box-sizing: border-box;
				padding: 10px 0;
				border-right: 1px solid #232426;
			}
		}
		.td {
			font-size: 14px;
			box-sizing: border-box;
			border-bottom: 1px solid #232426;

			// border-left: 1px solid #232426;
			div {
				box-sizing: border-box;
				padding: 10px 0;
				border-right: 1px solid #232426;
			}
		}
	}
	.totalMoney {
		width: 100%;
		font-size: 15px;
		font-weight: bold;
		color: #232426;
		padding: 10px 0;
		text-align: right;
	}
	.line {
		margin: 10px 0;
		border-top: 1px solid #232426;
	}
	.tips {
		color: #232426;
		font-size: 15px;
		margin-bottom: 20px;
		line-height: 1.2;
	}
	.bottomNote {
		margin: 10px 0;
		span {
			width: 25%;
		}
	}
}
.sub-part-title {
	font-weight: bold;
	margin: 0 20px 0 0;
}
.info-gap {
	margin-bottom: 20px;
}
.shipment-info {
	font-size: 14px;
	margin: 15px auto;
	> div > p {
		line-height: 20px;
	}
}
.shipment-info > span {
	display: inline-block;
	width: 33.33%;
	color: $color-body-se;
	margin-bottom: 5px;
}
.align-right {
	text-align: right;
}
.money-summary {
	font-weight: bold;
	margin: 30px auto 20px auto;
	border-bottom: 1px solid #ccc;
}
</style>
