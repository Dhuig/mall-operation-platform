<template>
	<div>
		<guideBar>
			<!-- <el-button type="primary" @click="$closeSelf()" icon="el-icon-back">返回</el-button> -->
			<el-button type="primary" @click="printShipment" icon="el-icon-printer">打印</el-button>
		</guideBar>
		<div class="card" ref="print" id="print">
			<h5 class="part-title">服务中心退货审批单</h5>
			<div class="flex marginB20">
				<div style="width: 50%;">退换货单号：{{ orderVo && orderVo.orderSn }}</div>
				<div>服务中心编号：{{ orderVo && orderVo.storeCode }}</div>
			</div>
			<div class="line"></div>
			<div class="flex marginB20">
				<div style="width: 50%;" ref="printHeader">退换货原因：{{ orderVo && orderVo.reasonFirst }}</div>
				<div ref="printHeader">二级原因：{{ orderVo && orderVo.reasonSecond }}</div>
			</div>
			<div class="flex marginB20">
				<div style="width: 50%;">押货退货金额合计：￥{{ totalAmount || 0 }}</div>
				<div>零售额合计：￥ {{ retailPriceTotal || 0 }}</div>
			</div>
			<el-table :data="productVoList" style="width: 100%;" border>
				<el-table-column prop="index" width="50" label="序号"></el-table-column>
				<el-table-column prop="productCode" min-width="100" label="产品编号"></el-table-column>
				<el-table-column prop="productName" min-width="200" label="产品名称"></el-table-column>
				<el-table-column prop="productPacking" min-width="100" label="规格"></el-table-column>
				<el-table-column prop="productUnit" min-width="80" label="单位"></el-table-column>
				<el-table-column prop="productMortgagePrice" min-width="80" label="押货价">
					<template slot-scope="scope">
						<span>¥{{ scope.row.productMortgagePrice }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="productRetailPrice" min-width="80" label="零售价">
					<template slot-scope="scope">
						<span>¥{{ scope.row.productRetailPrice }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="productNum" min-width="100" label="退货数量"></el-table-column>
				<el-table-column prop="productRemarks" min-width="140" label="备注"></el-table-column>
				<el-table-column prop="productRealNum" min-width="100" label="实退数量"></el-table-column>
				<el-table-column prop="productRealAmount" min-width="100" label="实退总金额">
					<template slot-scope="scope">
						<span>¥{{ scope.row.productRealAmount }}</span>
					</template>
				</el-table-column>
			</el-table>
			<!-- 审批意见 -->
			<div class="marginT20">
				<p class="approval_title">审批意见</p>
				<el-table :data="opinionVoList" style="width: 100%;" border>
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="createTime" min-width="100" label="留言时间"></el-table-column>
					<el-table-column prop="submitMan" min-width="80" label="留言人"></el-table-column>
					<el-table-column prop="companyName" min-width="100" label="分公司"></el-table-column>
					<el-table-column prop="content" min-width="140" label="留言内容"></el-table-column>
				</el-table>
			</div>
			<!-- 审批信息 -->
			<div class="marginT20 approval">
				<p class="approval_title">审批信息</p>
				<el-row class="approval_info">
					<el-col :span="8">审批日期：{{ orderVo && orderVo.auditTime | format }}</el-col>
					<el-col :span="8">审批人：{{ orderVo && orderVo.auditMan }}</el-col>
					<el-col :span="8">审批意见：{{ orderVo && orderVo.auditStatus | auditStatus }}</el-col>
				</el-row>
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
import { AUDIT_STATUS } from './config';
import { formatDate } from 'util/formValidation';
import printTable from './components/printTable';
import { filters } from 'plugins/filters';
export default {
	name: 'returnExchangePrinting',
	components: {
		printTable,
	},
	data() {
		return {
			orderVo: {}, // 基本信息
			productVoList: [], // 产品列表
			opinionVoList: [], // 审批意见
			totalAmount: '', // 押货退货金额合计
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
		// 零售价合计
		retailPriceTotal() {
			let totalRetailPrice = 0;
			this.productVoList &&
				this.productVoList
					.map(item => (totalRetailPrice += item.productRetailPrice * (item.productRealNum || item.productNum)))
					.reduce((acc, cur) => parseFloat(cur) + acc, 0);
			return filters.rounding(totalRetailPrice, 2);
		},
	},
	methods: {
		async loadData() {
			const { orderId } = this.$route.query;
			const res = await this.$fetch(`/mgmt/inventory/returnOrder/getOrderDetail?orderId=${orderId}`);
			if (res.code === 200) {
				const { orderVo, productVoList, opinionVoList } = res.data;
				this.orderVo = orderVo;
				this.productVoList = productVoList;
				this.opinionVoList = opinionVoList;
				// 押货退货金额合计
				if (this.orderVo.orderStatus === 4) {
					this.totalAmount = filters.rounding(this.orderVo.orderReturnRealAmount, 2);
				} else {
					this.totalAmount = filters.rounding(this.orderVo.orderReturnAmount, 2);
				}
				// 实退总金额
				this.productVoList.forEach((e, i) => {
					e.index = i + 1;
					// 零售价 押货价补0
					e.productMortgagePrice = filters.rounding(e.productMortgagePrice, 2) || '';
					e.productRetailPrice = filters.rounding(e.productRetailPrice, 2) || '';
					// 实退总金额
					e.productRealAmount =
						this.orderVo.orderStatus !== 4
							? (e.productMortgagePrice * e.productNum).toFixed(2)
							: e.productRealAmount.toFixed(2);
					e.productRealNum = this.orderVo.orderStatus !== 4 ? e.productRealNum || e.productNum : e.productRealNum;
				});
			}
		},
		// 打印发货
		printShipment() {
			// 基本信息
			const { orderSn, storeCode, reasonFirst, reasonSecond, auditTime, auditMan, auditStatus } = this.orderVo;
			this.orderAllData = {
				deliver: null,
			};
			this.printFormData = {
				orderSn,
				storeCode,
				reasonFirst,
				reasonSecond,
				auditTime,
				auditMan,
				auditStatus,
				retailPriceTotal: this.retailPriceTotal,
				totalAmount: this.totalAmount,
				opinionVoList: this.opinionVoList,
			};
			this.nowCheckData = this.productVoList;
			this.printDialog = true;
		},
		onPrint() {
			this.$nextTick(() => {
				this.$print({
					printable: `printDialog-${this.nowTime}-1`,
					type: 'html',
					scanStyles: false,
					css: 'print_css/orderPrintPledge.css',
				});
				this.printDialog = false;
			});
		},
	},
	mounted() {
		this.loadData();
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
	.marginL50 {
		margin-left: 50px;
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
// 审批
.approval_title {
	padding: 20px 0;
	font-size: 15px;
}
.approval_info {
	font-size: 15px;
	border: 1px solid #ebeef5;
	.el-col {
		padding: 15px 10px;
	}
	.el-col:nth-child(n + 2) {
		border-left: 1px solid #ebeef5;
	}
}
</style>
