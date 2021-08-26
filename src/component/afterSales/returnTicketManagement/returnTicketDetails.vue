<template>
	<div class="return-ticket-details">
		<guideBar></guideBar>
		<!-- 审批流程 -->
		<el-card>
			<div class="audit-flow">
				<div class="audit-flow-header flex">
					<div>退货单号：{{ ticketDetails.orderReturnInvoiceInfo.returnNo }}</div>
					<div class="orderNo">订单号：{{ ticketDetails.orderReturnInvoiceInfo.orderNo }}</div>
				</div>
				<div class="audit-flow-content flex">
					<div class="audit-flow-left">
						<div
							class="audit-flow-status"
							:class="{ 'audit-flow-gray': ticketDetails.orderReturnInvoiceInfo.returnInvoiceStatus == 3 }"
						>
							{{ ticketDetails.orderReturnInvoiceInfo.returnInvoiceStatusDesc }}
						</div>
						<p v-if="ticketDetails.orderReturn && ticketDetails.orderReturn.returnStatus == 99">当前退货单已完成</p>
						<p v-if="ticketDetails.orderReturn && [97, 98].includes(ticketDetails.orderReturn.returnStatus)">
							当前退货单已取消
						</p>
						<el-button
							v-if="
								ticketDetails.orderReturnInvoiceInfo.returnInvoiceStatus == 1 &&
								ticketDetails.orderReturnInvoiceInfo.applySource != 3
							"
							@click="audit"
							v-permission="'return_ticket_detail_audit'"
						>
							审核
						</el-button>
						<el-button
							v-if="
								ticketDetails.orderReturn &&
								ticketDetails.orderReturnInvoiceInfo.returnInvoiceStatus == 2 &&
								[1, 3].includes(ticketDetails.orderReturn.returnStatus)
							"
							v-permission="'return_ticket_detail_reset'"
							@click="repealReturn"
						>
							撤销退票
						</el-button>
					</div>
					<div class="audit-flow-right">
						<el-steps :active="isActive" align-center process-status="wait">
							<el-step
								icon="el-icon-circle-check"
								v-for="(item, index) in initStep"
								:key="index"
								:title="item.statusDesc"
							>
								<template slot="description">
									<p v-if="item.createTime">{{ item.createTime }}</p>
									<p v-if="item.operator">操作人：{{ item.operator }}</p>
								</template>
							</el-step>
						</el-steps>
					</div>
				</div>
			</div>
		</el-card>
		<!-- 退票数据详情 -->
		<el-card>
			<div class="return-ticket-info flex">
				<div class="row">
					<h4>开单信息</h4>
					<div>开单人姓名: {{ ticketDetails.order.creatorName }}</div>
					<div>开单人卡号: {{ ticketDetails.order.creatorCard }}</div>
					<div>开单人手机号: {{ ticketDetails.order.creatorPhone }}</div>
					<h4>顾客信息</h4>
					<div>顾客姓名: {{ ticketDetails.order.customerName }}</div>
					<div>顾客卡号: {{ ticketDetails.order.customerCard }}</div>
					<div>顾客手机号: {{ ticketDetails.order.customerPhone }}</div>
					<div>顾客类型: {{ CUSTOMERTYPE[ticketDetails.order.customerType] }}</div>
					<h4>送货人信息</h4>
					<div>送货人姓名: {{ ticketDetails.order.ownerName }}</div>
					<div>送货人卡号: {{ ticketDetails.order.ownerCard }}</div>
				</div>
				<div class="row">
					<h4>收件人信息</h4>
					<div>收件人: {{ ticketDetails.order.receiver }}</div>
					<div>收件人手机号: {{ ticketDetails.order.receiverPhone }}</div>
					<h4>交付方式</h4>
					<div>交付方式: {{ EXPRESSTYPE[ticketDetails.order.expressType] }}</div>
					<div>自提地址: {{ ticketDetails.order.receiverAddress }}</div>
					<div>联系电话: {{ ticketDetails.order.receiverPhone }}</div>
					<h4>服务中心&分公司</h4>
					<div>服务中心/编号: {{ ticketDetails.order.storeCode }}</div>
					<div>分公司/编号: {{ ticketDetails.order.companyCode }}</div>
				</div>
				<div class="row">
					<h4>发票信息</h4>
					<div>开票类型: {{ INVOICETYPE[ticketDetails.orderInvoice.invoiceType] }}</div>
					<div>纳税人识别号: {{ ticketDetails.orderInvoice.taxpayerNo }}</div>
					<div>单位全称: {{ ticketDetails.orderInvoice.name }}</div>
					<div>注册地址: {{ ticketDetails.orderInvoice.registerAddress }}</div>
					<div>注册电话: {{ ticketDetails.orderInvoice.registerPhone }}</div>
					<div>开户银行名称: {{ ticketDetails.orderInvoice.bankName }}</div>
					<div>开户银行账号: {{ ticketDetails.orderInvoice.bankAccount }}</div>
					<div>联系人电话: {{ ticketDetails.orderInvoice.phone }}</div>
					<div>开票状态: {{ INVOICESTATUS[ticketDetails.orderInvoice.invoiceStatus] }}</div>
					<div>
						授权委托书: &nbsp;
						<el-button
							v-if="ticketDetails.orderInvoice.authorizeLicense != '--'"
							@click="lookPicture(ticketDetails.orderInvoice.authorizeLicense)"
							type="text"
						>
							查看
						</el-button>
						<span v-else>{{ ticketDetails.orderInvoice.authorizeLicense }}</span>
					</div>
					<div>
						营业执照副本: &nbsp;
						<el-button
							v-if="ticketDetails.orderInvoice.businessLicense != '--'"
							@click="lookPicture(ticketDetails.orderInvoice.businessLicense)"
							type="text"
						>
							查看
						</el-button>
						<span v-else>{{ ticketDetails.orderInvoice.businessLicense }}</span>
					</div>
					<div>
						银行开户许可证: &nbsp;
						<el-button
							v-if="ticketDetails.orderInvoice.bankLicense != '--'"
							@click="lookPicture(ticketDetails.orderInvoice.bankLicense)"
							type="text"
						>
							查看
						</el-button>
						<span v-else>{{ ticketDetails.orderInvoice.bankLicense }}</span>
					</div>
				</div>
			</div>
		</el-card>
		<!-- 查看图片 -->
		<el-dialog :visible.sync="picture.visible" v-drag>
			<div class="dialogPicture" v-if="picture.url">
				<img width="100%" :src="picture.url" alt="" />
			</div>
			<div class="dialogPicture" v-if="picture.urlArr.length > 0">
				<!-- <img width="100%" :src="picture.url" alt="" /> -->
				<el-image
					v-for="(item, index) in picture.urlArr"
					:key="index"
					class="dialogImg"
					:src="item"
					:preview-src-list="picture.urlArr"
				></el-image>
			</div>
		</el-dialog>
		<!-- 产品明细 -->
		<el-card>
			<div slot="header">
				<span>产品明细</span>
				<span class="money">实付金额：￥{{ ticketDetails.order.actuallyAmount }}</span>
			</div>
			<tableList
				:dataSource="ticketDetails.orderReturnProducts"
				showSummary
				:columns="ORDER_RETURN_PRODUCTS_COLUMS"
			></tableList>
		</el-card>
		<!-- 审核记录 -->
		<el-card>
			<div slot="header">
				<span>审核记录</span>
			</div>
			<tableList :dataSource="ticketDetails.orderServiceLogs" :columns="ORDER_SERVICELOGS_COLUMS" slotcontent>
				<template slot-scope="scope">
					<el-button type="text" v-if="scope.data.attachmentUrls.length > 0" @click="detail(scope.data.attachmentUrls)">
						查看
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!--审批弹窗-->
		<refunAudit-dialog :orderInfo="orderInfo" @onClosedDialog="onClosedDialog" />
	</div>
</template>

<script>
import { formatDate } from '@/util/formValidation';
import refunAuditDialog from './refunAuditDialog';

import {
	CUSTOMERTYPE,
	EXPRESSTYPE,
	INVOICETYPE,
	INVOICESTATUS,
	ORDER_RETURN_PRODUCTS_COLUMS,
	ORDER_SERVICELOGS_COLUMS,
} from './config';
export default {
	name: 'returnTicketDetails',
	data() {
		return {
			formatDate,
			CUSTOMERTYPE,
			EXPRESSTYPE,
			INVOICETYPE,
			ORDER_RETURN_PRODUCTS_COLUMS,
			ORDER_SERVICELOGS_COLUMS,
			INVOICESTATUS,
			orderInfo: {
				auditTitle: '退票审核',
				type: 'returnTicketDetails', // 退票管理
				auditShow: false, //是否显示审核弹窗
				returnNo: '',
				orderNo: '',
				id: '',
			},
			ticketDetails: {
				orderReturnInvoiceInfo: {},
				order: {},
				orderReturn: {},
				orderInvoice: {}, // 发票详情
				invoiceStatusChangeInfos: [], // 进度条
			},
			picture: {
				visible: false,
				url: '',
				urlArr: [],
			},
			isActive: 0, // 进度条激活状态
			initStep: [
				// 进度条数据
				{
					statusDesc: '提交退货单',
				},
				{
					statusDesc: '已确认退票',
				},
			],
		};
	},
	components: {
		refunAuditDialog, //审核弹窗
	},
	methods: {
		// 审核
		audit() {
			const { id, returnNo, orderNo } = this.ticketDetails.orderReturnInvoiceInfo;
			this.orderInfo = {
				...this.orderInfo,
				id,
				returnNo,
				orderNo,
			};
			this.orderInfo.auditShow = true;
		},
		// 审核关闭
		onClosedDialog(val) {
			// 成功之后更新数据
			if (val == 'success') {
				this.getReturnTicketDetails();
			}
			this.orderInfo.auditShow = false;
		},
		// 撤销退票
		repealReturn() {
			this.$confirm('此操作将撤销审核, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				this.cancelInvoiceAudit();
			});
		},
		//撤销审核调用的后端接口
		async cancelInvoiceAudit() {
			const { returnNo } = this.$route.query;
			let obj = {
				method: 'POST',
				url: '/mgmt/order/return/cancelInvoiceAudit',
				params: {
					returnNo, //退货单号
				},
			};
			let res = await this.$fetch(obj);
			if (res) {
				this.$message({
					type: 'success',
					message: '撤销成功',
				});
				this.getReturnTicketDetails();
			}
		},
		// 查看多图
		detail(urlArr) {
			this.picture = {
				visible: true,
				url: '',
				urlArr,
			};
		},
		// 查看单图
		lookPicture(url) {
			this.picture = {
				visible: true,
				url,
				urlArr: [],
			};
		},
		// 获取数据
		async getReturnTicketDetails() {
			const { id, returnNo } = this.$route.query;
			let obj = {
				method: 'GET',
				url: '/mgmt/order/return/getReturnInvoiceDetails',
				params: {
					returnNo,
					id,
				},
			};
			let res = await this.$fetch(obj);
			if (res && res.code == 200) {
				const { data } = res;
				// * 退票数据详情的数据如果没有就给'--'
				// ! 改了原数据 ↓
				[data.order, data.orderInvoice].forEach(item => {
					for (const key in item) {
						if (!item[key]) {
							item[key] = '--';
						}
					}
				});
				// 进度条↓
				data.invoiceStatusChangeInfos.forEach((item, index) => {
					this.isActive = index + 1;
					this.initStep[index] = {
						serviceStatus: item.serviceStatus,
						createTime: formatDate(item.createTime),
						statusDesc: item.statusName,
						operator: item.operator,
					};
				});
				// 数据赋值↓
				this.ticketDetails = res.data;
			}
		},
	},
	mounted() {
		this.getReturnTicketDetails();
	},
};
</script>
<style lang="scss" scoped>
.return-ticket-details {
	::v-deep .el-dialog__body {
		overflow-y: auto;
	}
	::v-deep .el-button--text {
		padding-top: 4px;
		padding-bottom: 4px;
	}
	.flex {
		display: flex;
	}
	.money {
		margin-left: 10px;
		font-size: 14px;
	}
	// 弹窗样式
	.dialogPicture {
		min-height: 480px;
		max-height: 480px;
		.dialogImg {
			width: 100px;
			height: 100px;
			margin-right: 20px;
		}
	}
	// 审核流程
	.audit-flow {
		.audit-flow-header {
			padding-bottom: 10px;
			.orderNo {
				padding-left: 20px;
			}
		}
		.audit-flow-content {
			align-items: center;
			padding-top: 10px;
			.audit-flow-status {
				font-size: 32px;
				color: #1b7eda;
				font-weight: 500;
				margin: 20px 0;
			}
			.audit-flow-gray {
				color: #aaa;
			}
			.audit-flow-right {
				flex: 1;
			}
		}
	}
	// 退票数据详情
	.return-ticket-info {
		.row {
			width: 33.33%;
			h4 {
				font-weight: bold;
				padding: 15px 0;
			}
			div {
				padding: 10px 0;
			}
		}
	}
}
</style>
