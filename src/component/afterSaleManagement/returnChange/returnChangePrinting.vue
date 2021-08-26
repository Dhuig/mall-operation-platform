<template>
	<div>
		<guideBar>
			<!-- <el-button type="primary" @click="$closeSelf()" icon="el-icon-back">返回</el-button> -->
			<el-button type="primary" @click="printShipment" icon="el-icon-printer">打印</el-button>
		</guideBar>
		<div class="card" ref="print" id="print">
			<h5 class="part-title">服务中心换货审批单</h5>
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
				<div style="width: 50%;">押货金额合计：￥{{ returnPledgeTotal || 0 }}</div>
				<div>零售额合计：￥ {{ returnAmountTotal || 0 }}</div>
			</div>
			<el-table :data="productVos" style="width: 100%;" border>
				<el-table-column prop="productCode" min-width="100" label="产品编号"></el-table-column>
				<el-table-column prop="productName" min-width="200" label="产品名称"></el-table-column>
				<el-table-column prop="productPacking" min-width="100" label="规格"></el-table-column>
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
				<el-table-column prop="productProductionDate" min-width="150" label="生产日期/有效期"></el-table-column>
				<el-table-column prop="productBatch" min-width="100" label="批次"></el-table-column>
				<el-table-column prop="productSn" min-width="160" label="序列号/二维码"></el-table-column>
				<el-table-column prop="productUnit" min-width="80" label="单位"></el-table-column>
				<el-table-column prop="productNum" min-width="80" label="数量"></el-table-column>
				<el-table-column prop="productDisposalType" min-width="100" label="类型">
					<template slot-scope="scope">
						<span>{{ scope.row.productDisposalType | productDisposalType }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="pledgePrice" min-width="100" label="押货金额">
					<template slot-scope="scope">
						<span>¥{{ scope.row.pledgePrice }}</span>
					</template>
				</el-table-column>
			</el-table>
			<div class="marginT20 approval">
				<div class="approval_box" v-for="item in opinionVos" :key="item.id">
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
import { PRODUCT_DISPOSAL_STATUS, PRODUCT_DISPOAL_TYPE } from './config';
import { formatDate } from 'util/formValidation';
import printTable from './components/printTable';
import { filters } from 'plugins/filters';
export default {
	name: 'returnChangePrinting',
	components: {
		printTable,
	},
	data() {
		return {
			PRODUCT_DISPOSAL_STATUS,
			PRODUCT_DISPOAL_TYPE, //换货处理方式
			orderVo: {}, // 基本信息
			productVos: [], // 产品列表
			opinionVos: [], // 审批意见
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
		returnAmountTotal() {
			if (this.productVos.length === 0) return;
			let totalRetailPrice = 0;
			this.productVos.map(item => {
				totalRetailPrice += item.productRetailPrice * item.productNum;
			});
			return filters.rounding(totalRetailPrice, 2);
		},
		// 押货金额合计
		returnPledgeTotal() {
			if (this.productVos.length === 0) return;
			let totalRetailPrice = 0;
			this.productVos.map(item => {
				totalRetailPrice += item.productMortgagePrice * item.productNum;
			});
			return filters.rounding(totalRetailPrice, 2);
		},
	},
	methods: {
		async loadData() {
			const { orderId } = this.$route.query;
			const res = await this.$fetch(`/mgmt/inventory/exchangeOrder/exchangeOrderDetail?orderId=${orderId}`);
			if (res.code === 200) {
				const { orderVo, productVos, opinionVos } = res.data;
				this.orderVo = orderVo;
				this.productVos = productVos;
				this.opinionVos = opinionVos;
				// 产品押货金额
				this.productVos.forEach(item => {
					let pledgePrice = item.productMortgagePrice * item.productNum;
					item.pledgePrice = filters.rounding(pledgePrice, 2) || 0;
					// 零售价 押货价补0
					item.productMortgagePrice = filters.rounding(item.productMortgagePrice, 2) || '';
					item.productRetailPrice = filters.rounding(item.productRetailPrice, 2) || '';
				});
			}
		},
		// 打印发货
		printShipment() {
			// 基本信息
			const { orderSn, storeCode, reasonFirst, reasonSecond } = this.orderVo;
			this.orderAllData = {
				deliver: null,
			};
			this.printFormData = {
				orderSn,
				storeCode,
				reasonFirst,
				reasonSecond,
				returnAmountTotal: this.returnAmountTotal,
				returnPledgeTotal: this.returnPledgeTotal,
				opinionVos: this.opinionVos,
			};
			this.nowCheckData = this.productVos;
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
		formatDate,
		// 旧品处理方式
		productDisposalType(val) {
			return val in PRODUCT_DISPOAL_TYPE ? PRODUCT_DISPOAL_TYPE[val] : '';
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
.approval {
	border-bottom: 1px solid #232426;
}
.approval_box {
	padding: 20px;
	font-size: 15px;
	border: 1px solid #232426;
	border-bottom: none;
	.approval_con {
		height: 100px;
	}
	.approved_by {
		span {
			margin-right: 15px;
		}
	}
}
</style>
