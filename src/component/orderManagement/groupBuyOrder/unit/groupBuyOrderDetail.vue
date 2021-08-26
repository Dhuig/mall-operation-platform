<template>
	<div class="customer-order-detail">
		<el-card class="card order-status-steps">
			<div class="order-info">
				<span>订单号: {{ orderDetails.orderNo }}</span>
			</div>
			<!-- <el-steps class="order-status-steps" :active="orderDetails.state" align-center> -->
			<el-steps class="order-status-steps" :active="orderSteps.length" align-center>
				<el-step
					v-for="({ operatorName, createTime, state }, index) in orderSteps"
					:key="index"
					:title="changeStateTitle(state, orderSteps)"
					:description="operatorName ? `${formatDate(createTime)}(操作员:${operatorName})` : formatDate(createTime)"
				></el-step>
			</el-steps>
			<div class="order-pending-payment">
				<h3>{{ GROUP_ORDER_STATE[orderDetails.state] }}</h3>
				<p>{{ autoConfirmTime }}</p>
			</div>
			<div class="operator">
				<span v-permission="'group_buy_order_detail_cancel'">
					<el-button v-if="[1, 2, 3].includes(orderDetails.state)" @click="cancelOrder(orderDetails.orderNo)">
						取消订单
					</el-button>
				</span>
				<span v-permission="'group_buy_order_detail_edit'">
					<el-button v-if="orderDetails.state === 1" @click="editGroupBuyOrder">编辑</el-button>
				</span>
				<span v-permission="'group_buy_order_detail_reset'">
					<el-button v-if="orderDetails.state === 2" @click="revokeAudit">撤销审核</el-button>
				</span>
				<span v-permission="'group_buy_order_detail_audit'">
					<el-button v-if="[1, 2, 8].includes(orderDetails.state)" @click="audit">审核</el-button>
				</span>
			</div>
		</el-card>

		<el-card class="card delivery-info">
			<h2>物流信息</h2>
			<div v-if="deliveryInfo && deliveryInfo.length > 0">
				<div v-for="({ company, deliveryCode, tracks }, index) in deliveryInfo" :key="index">
					<div class="delivery-company">
						<p>
							<span>物流公司: {{ company }}</span>
							<span>物流单号：{{ deliveryCode }}</span>
						</p>
						<div
							:class="{
								'delivery-info-tracks': !moreBtn[index],
							}"
						>
							<p v-for="({ occurTime, remark }, i) in tracks" :key="i">
								<span>{{ occurTime | formatDate }}</span>
								<span>{{ occurTime | getWeekFromTime }}</span>
								<span>{{ remark }}</span>
								<span v-if="i === 0" style="color: #409eff" @click="clickMoreBtn(index)">
									{{ moreBtn[index] === true ? '收起' : '展开' }}
									<i :class="moreBtn[index] === true ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
								</span>
							</p>
						</div>
					</div>
				</div>
			</div>
			<div v-else>暂无数据</div>
		</el-card>

		<el-card class="card">
			<div class="order-details">
				<div class="layout-wrapper">
					<!-- 服务中心&分公司 -->
					<div class="store">
						<h2>服务中心 & 分公司</h2>
						<p>服务中心 / 编号：{{ orderDetails.storeName }} / {{ orderDetails.storeCode }}</p>
						<p>分公司 / 编号：{{ orderDetails.companyName }} / {{ orderDetails.companyCode }}</p>
					</div>
					<!-- 单位信息 -->
					<div class="unit-info">
						<h2>单位信息</h2>
						<p>团购单位：{{ orderDetails.institution }}</p>
						<p>单位地址：{{ unitAddress }}</p>
						<p>联系电话：{{ orderDetails.creatorPhone }}</p>
					</div>
					<!-- <div class="creator-info">
						<h2>开单信息</h2>
						<p>开单人姓名：{{ orderDetails.creatorName }}</p>
						<p>开单人卡号：{{ orderDetails.creatorCard }}</p>
						<p>开单人手机号：{{ orderDetails.creatorPhone }}</p>
					</div>
					<div class="customer-info">
						<h2>顾客信息</h2>
						<p>顾客姓名：{{ orderDetails.customerName }}</p>
						<p>顾客卡号：{{ orderDetails.customerCard }}</p>
						<p>顾客手机号：{{ orderDetails.customerPhone }}</p>
						<p>顾客类型：{{ customerType }}</p>
					</div> -->
					<!-- <div class="deliveryman-info">
						<h2>送货人信息</h2>
						<p>送货人姓名：{{ orderDetails.ownerName }}</p>
						<p>送货人卡号：{{ orderDetails.ownerCard }}</p>
					</div> -->
				</div>
				<div class="layout-wrapper">
					<!-- 收货人信息 -->
					<div class="deliveryman-info">
						<h2>收货人信息</h2>
						<p>收货人：{{ orderDetails.consigneeName }}</p>
						<p>收货人手机号：{{ orderDetails.consigneeMobile }}</p>
						<p>收货地址： {{ consigneeAddress }}</p>
					</div>
					<!-- 交付方式 -->
					<div class="delivery-type">
						<h2>交付方式</h2>
						<p>交付方式：公司交付</p>
					</div>
					<h2>承诺书</h2>
					<div class="contract-attachment">
						<p>附件：</p>

						{{ orderDetails.commitment && orderDetails.commitment.name }}
						<el-button
							v-if="orderDetails.commitment && orderDetails.commitment.url"
							type="text"
							@click="download(orderDetails.commitment.url, orderDetails.commitment.name)"
						>
							下载
						</el-button>
					</div>
				</div>
				<div class="layout-wrapper">
					<!-- 付款信息 -->
					<div class="payment-info">
						<h2>付款信息</h2>
						<p>应付金额：{{ orderDetails.amount | addPrefixForAmount }}</p>
						<p>付款方式：{{ remitType }}</p>
						<p>团购单位银行账户：{{ orderDetails.bankAccount }}</p>
						<p>银行名称：{{ orderDetails.bankName }}</p>
						<div>
							<p>汇款凭证：</p>
							<img
								class="payment-voucher"
								v-for="({ name, url }, index) in remitCredentials"
								:key="index"
								:src="url"
								:alt="name"
							/>
						</div>
					</div>
					<!-- 合同附件 -->
					<h2>合同附件</h2>
					<div class="contract-attachment">
						<p>附件：</p>
						<p v-for="{ name, url } in contractAtt" :key="name">
							{{ name }}
							<el-button v-if="url" type="text" @click="download(url, name)">下载</el-button>
						</p>
					</div>
				</div>
				<div class="layout-wrapper" style="padding-left: 20px">
					<div class="invoice-info">
						<h2>发票信息</h2>
						<!-- 未开票状态 -->
						<template v-if="invoice === null">
							<!-- <p v-if="isOverTime">当前订单已超过申请发票时限。如需申请，请联系客服处理。</p> -->
							<div v-if="[6, 7].includes(orderDetails.state)">暂无</div>
							<el-button
								v-else
								v-permission="'group_buy_order_detail_apply_ticket'"
								@click="applyTicket(orderDetails.orderNo)"
							>
								申请开票
							</el-button>
						</template>
						<!-- 已开票状态 -->
						<template v-else>
							<!-- 企业专用纸质发票 -->
							<div v-if="invoice && invoice.type === 3">
								<p>开票类型：{{ GROUP_INVOICE_TYPE[invoice.type] }}</p>
								<p>纳税人识别号：{{ invoice.taxpayerNo }}</p>
								<p>单位全称：{{ invoice.draweeName }}</p>
								<p>注册地址：{{ invoice.registerAddress }}</p>
								<p>注册电话：{{ invoice.registerPhone }}</p>
								<p>开户银行名称：{{ invoice.bankName }}</p>
								<p>开户银行账号：{{ invoice.bankAccount }}</p>
								<p>联系人电话：{{ invoice.phone }}</p>
								<div>
									状态：{{ invoiceStatus }}
									<p v-for="(item, index) in invoice.invoiceUrls" :key="index">
										<el-button v-if="item" type="text" @click="download(item, index)">下载</el-button>
									</p>
								</div>
								<!-- todo: 文件名称 -->
								<p>
									授权委托书：
									<el-button type="text" @click="showImg(invoice.authLicense.url)">查看</el-button>
								</p>
								<p>
									营业执照副本：
									<el-button type="text" @click="showImg(invoice.bizLicense.url)">查看</el-button>
								</p>
								<p>
									银行开户许可证：
									<el-button type="text" @click="showImg(invoice.bankLicense.url)">查看</el-button>
								</p>
							</div>
							<!-- 企业普通电子发票 -->
							<div v-else-if="invoice.type === 2">
								<p>开票类型：{{ GROUP_INVOICE_TYPE[invoice.type] }}</p>
								<p>纳税人识别号：{{ invoice.taxpayerNo }}</p>
								<p>单位全称：{{ invoice.draweeName }}</p>
								<p>注册地址：{{ invoice.registerAddress }}</p>
								<p>注册电话：{{ invoice.registerPhone }}</p>
								<p>开户银行名称：{{ invoice.bankName }}</p>
								<p>开户银行账号：{{ invoice.bankAccount }}</p>
								<p>联系人电话：{{ invoice.phone }}</p>
								<div>
									状态：{{ invoiceStatus }}
									<p v-for="(item, index) in invoice.invoiceUrls" :key="index">
										<el-button v-if="item" type="text" @click="download(item, index)">下载</el-button>
									</p>
								</div>
							</div>
							<!-- 个人普通电子发票 -->
							<div v-else>
								<p>开票类型：{{ GROUP_INVOICE_TYPE[invoice.type] }}</p>
								<p>个人姓名：{{ invoice.draweeName }}</p>
								<div>
									状态：{{ invoiceStatus }}
									<p v-for="(item, index) in invoice.invoiceUrls" :key="index">
										<el-button v-if="item" type="text" @click="download(item, index)">下载</el-button>
									</p>
								</div>
							</div>
						</template>
					</div>
				</div>
			</div>
		</el-card>

		<el-card class="card">
			<div slot="header">
				<span>产品详情</span>
			</div>
			<tableList
				:data-source="products"
				:columns="PRODUCT_DETAILS_COLUMNS"
				showSummary
				:options="{
					index: true,
					labelIndex: '序号',
				}"
			></tableList>
		</el-card>
		<el-card class="card">备注: {{ orderDetails.remark }}</el-card>
		<el-card class="card">
			<div slot="header">
				<span>审核记录</span>
			</div>
			<el-table :data="auditLogs">
				<el-table-column type="index" label="序号"></el-table-column>
				<el-table-column prop="createTime" label="审核时间">
					<template slot-scope="scope">
						{{ scope.row.createTime | timestampFormat }}
					</template>
				</el-table-column>
				<el-table-column prop="auditResult" label="审核结果">
					<template slot-scope="scope">
						{{ AUDIT_RESSULT[scope.row.auditResult] }}
					</template>
				</el-table-column>
				<el-table-column prop="auditor" label="审核人"></el-table-column>
				<el-table-column prop="auditorOrg" label="机构"></el-table-column>
				<el-table-column prop="auditView" label="备注说明"></el-table-column>
				<el-table-column label="附件">
					<template slot-scope="scope">
						<p v-for="({ name, url }, index) in scope.row.attachments" :key="index">
							{{ name }}
							<el-button v-if="url" type="text" @click="download(url)">下载</el-button>
						</p>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<auditModal
			v-if="auditModalProps.show"
			:auditModalProps="auditModalProps"
			:loadData="loadData"
			:GROUP_ORDER_STATE="GROUP_ORDER_STATE"
			@close="closeAuditModal"
		/>
		<ticketModal v-if="ticketModal.show" :ticketModal="ticketModal" @close="closeTicketModal" />
		<!-- 查看图片 -->
		<el-dialog :visible.sync="previewObj.visible" append-to-body v-drag>
			<pdf v-if="previewObj.pdf" :src="previewObj.url"></pdf>
			<img width="100%" :src="previewObj.url" alt />
		</el-dialog>
	</div>
</template>

<script>
import { formatDate, addPrefixForAmount, getWeekFromTime } from 'util/formValidation';
// import { getStringFromAddressCode } from 'util';
// import { downloadFile } from 'util/formValidation';
import { PRODUCT_DETAILS_COLUMNS, GROUP_ORDER_STATE } from '../config';
import auditModal from '../modal/auditModal';
import ticketModal from '../modal/ticketModal';
import pdf from 'vue-pdf';

export default {
	name: 'groupBuyOrderDetail',
	data() {
		return {
			PRODUCT_DETAILS_COLUMNS,
			GROUP_INVOICE_TYPE: {},
			GROUP_INVOICE_STATE: {},
			GROUP_ORDER_STATE,
			AUDIT_RESSULT: {
				1: '通过',
				2: '不通过',
			},
			orderDetails: {
				orderNo: '',
				state: 1,
				storeName: '',
				storeCode: '',
				companyName: '',
				companyCode: '',
				institution: '',
				creatorPhone: '',
				consigneeName: '',
				consigneeMobile: '',
				amount: '',
				bankAccount: '',
				bankName: '',
				remark: '',
			},
			previewObj: {
				// 显示图片
				url: '',
				visible: false,
				pdf: false,
			},
			auditLogs: [],
			consigneeAddr: {},
			contractAtt: {
				name: '',
			},
			institutionAddr: {},
			invoice: {},
			products: [],
			remitCredentials: [],
			stateLogs: [],
			deliveryInfo: [],
			moreBtn: {},
			auditModalProps: {
				show: false,
				state: null,
				orderNo: '',
			},
			ticketModal: {
				show: false,
				orderNo: '',
			},
		};
	},
	computed: {
		// 	customerType() {
		// 		return CUSTOMER_TYPE[this.orderDetails.customerType];
		// 	},
		invoiceType() {
			return this.GROUP_INVOICE_TYPE[this.invoice.invoiceType];
		},
		invoiceState() {
			return this.invoice.state === 1 ? '未开票' : '已开票';
		},
		unitAddress() {
			return (
				this.institutionAddr?.provinceName +
				this.institutionAddr?.cityName +
				this.institutionAddr?.districtName +
				this.institutionAddr?.townName +
				this.institutionAddr?.address
			);
		},
		remitType() {
			return this.orderDetails.remitType === 1 ? '单位汇款' : '云商垫付';
		},
		consigneeAddress() {
			// const { address } = this.consigneeAddr;
			// return getStringFromAddressCode(this.consigneeAddr) + address;
			return (
				this.consigneeAddr?.provinceName +
				this.consigneeAddr?.cityName +
				this.consigneeAddr?.districtName +
				this.consigneeAddr?.townName +
				this.consigneeAddr?.address
			);
		},
		invoiceStatus() {
			return this.GROUP_INVOICE_STATE[this.invoice.state];
		},
		orderSteps() {
			// console.log([
			// 	{ state: '0', createTime: this.orderDetails.createTime },
			// 	...this.stateLogs.map(item => ({ ...item, state: String(item.state) })),
			// ]);
			return [
				{ state: '0', createTime: this.orderDetails.createTime },
				...this.stateLogs.map(item => ({ ...item, state: String(item.state) })),
			];
		},
		autoConfirmTime() {
			const { updateTime } = this.orderDetails;
			return updateTime ? this.calculateRemainingTime() : '';
		},
	},
	methods: {
		formatDate,
		changeStateTitle(state, arr) {
			const length = arr.length;
			if (length == 2) {
				this.GROUP_ORDER_STATE[1] = '分公司未审核';
			}
			if (length > 2) {
				this.GROUP_ORDER_STATE[1] = '分公司已审核';
			}
			if (length == 3) {
				this.GROUP_ORDER_STATE[2] = '总公司未审核';
			}
			if (length > 3) {
				this.GROUP_ORDER_STATE[2] = '总公司已审核';
			}
			return this.GROUP_ORDER_STATE[state];
		},
		getSummaries(param) {
			const { columns, data } = param;
			const sums = [];
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '合计';
					return;
				}
				// 零售价和活动价不参与合计
				// if (['retailPrice', 'price'].includes(column.property)) {
				// 	sums[index] = '';
				// 	return;
				// }
				const values = data.map(item => Number(item[column.property]));
				if (!values.every(value => isNaN(value))) {
					sums[index] = values.reduce((prev, curr) => {
						const value = Number(curr);
						if (!isNaN(value)) {
							return prev + curr;
						} else {
							return prev;
						}
					}, 0);
					sums[index] = '￥' + sums[index];
					// sums[index] = ['quantity', 'pv', 'totalPv'].includes(column.property) ? sums[index] : '￥' + sums[index];
				} else {
					sums[index] = '';
				}
			});

			return sums;
		},
		async loadData() {
			const { orderNo } = this.$route.query;
			const res = await this.$fetch({
				url: `/mgmt/inventory/group-order/detail`,
				params: { orderNo },
			});
			if (res && res.data) {
				const {
					auditLogs,
					consigneeAddr,
					contracts,
					institutionAddr,
					invoice,
					products,
					remitCredentials,
					deliveryInfo,
					stateLogs,
					...orderDetails
				} = res.data;
				// console.log(institutionAddr);
				this.auditLogs = auditLogs;
				this.consigneeAddr = consigneeAddr;
				this.contractAtt = contracts || {};
				this.institutionAddr = institutionAddr;
				this.invoice = invoice;
				this.products = products;
				this.remitCredentials = remitCredentials;
				this.deliveryInfo = deliveryInfo;
				this.stateLogs = stateLogs;
				this.orderDetails = orderDetails;
			}
		},
		// 获取字典映射
		async getDicts() {
			const [GROUP_INVOICE_STATE, GROUP_INVOICE_TYPE] = await Promise.all([
				this.$getDict('GROUP_INVOICE_STATE'),
				this.$getDict('GROUP_INVOICE_TYPE'),
			]);
			this.GROUP_INVOICE_STATE = GROUP_INVOICE_STATE;
			this.GROUP_INVOICE_TYPE = GROUP_INVOICE_TYPE;
		},
		calculateRemainingTime(receiveConfirm) {
			const { updateTime } = this.orderDetails;
			// const startTime = state === 1 ? commitTime : deliverTime;
			const countDownDate = updateTime + receiveConfirm * 60 * 1000;
			const now = new Date().getTime();
			const distance = countDownDate - now;
			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			this.remainingTime = `${days}天${hours}小时${minutes}分钟后自动确认收货`;

			this.timer = setInterval(() => {
				const now = new Date().getTime();
				const distance = countDownDate - now;
				if (distance < 0) {
					clearInterval(this.timer);
					this.timer = null;
					this.remainingTime = '';
				} else {
					const days = Math.floor(distance / (1000 * 60 * 60 * 24));
					const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
					const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
					this.remainingTime = `${days}天${hours}小时${minutes}分钟后自动确认收货`;
				}
			}, 1000 * 60);
			this.$once('hook:beforeDestroy', () => {
				clearInterval(this.timer);
			});
		},
		// 审核
		audit() {
			const { orderNo, state } = this.orderDetails;
			this.auditModalProps = { ...this.auditModalProps, orderNo, state, show: true };
		},
		// 关闭退票审核dialog
		closeAuditModal(data) {
			this.auditModalProps = { ...data, show: false };
		},
		// 下载文件
		download(url) {
			let resultUrl;
			if (process.env.NODE_ENV.includes('development')) {
				resultUrl = url;
			} else {
				resultUrl = url.includes('http://') ? url.replace('http://', '/rewrite/') : url;
			}
			window.open(resultUrl);
		},
		// 查看图片
		showImg(url) {
			this.previewObj = {
				// 显示图片
				url,
				visible: true,
				pdf: url.includes('.pdf'),
			};
		},
		cancelOrder(orderNo) {
			this.$confirm('确定取消订单?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'PUT',
					url: '/mgmt/inventory/group-order/revoke',
					params: { orderNo },
				});
				if (res && res.code === 200) {
					this.$message.success('取消成功');
					this.loadData();
				} else {
					res &&
						this.$message({
							message: res.message,
							type: 'error',
						});
				}
			});
		},
		editGroupBuyOrder() {
			const { orderNo } = this.orderDetails;
			this.$go('edit_group_buy_order', { title: '编辑团购订单', orderNo });
		},
		revokeAudit() {
			const { orderNo } = this.orderDetails;
			this.$confirm('确定撤销审核?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'PUT',
					url: '/mgmt/inventory/group-order/audit-revoke',
					params: { orderNo },
				});
				if (res.code === 200) {
					this.$message.success(res.message);
					this.loadData();
				} else {
					this.$message.error(res.message);
				}
			});
		},
		clickMoreBtn(index) {
			this.moreBtn = { ...this.moreBtn, [index]: !this.moreBtn[index] };
		},
		applyTicket(orderNo) {
			this.ticketModal = {
				show: true,
				orderNo,
			};
		},
		closeTicketModal() {
			this.ticketModal = {
				show: false,
				orderNo: '',
			};
			this.loadData();
		},
	},
	async mounted() {
		await this.getDicts();
		this.loadData();
	},
	components: { auditModal, ticketModal, pdf },
	filters: {
		addPrefixForAmount,
		getWeekFromTime,
	},
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
	overflow-y: auto;
	max-height: 520px;
}
.customer-order-detail {
	.card {
		margin: 20px 0;
	}
	p {
		color: $color-body;
		font-weight: normal;
		line-height: 22px;
	}

	h2 {
		font-size: 18px;
		font-weight: 500;
		color: $color-title;
		padding: 0 0 26px 0;
	}

	.order-status-steps {
		.order-info {
			padding: 0 10px 10px 0;
			span {
				padding-right: 20px;
			}
		}
		.order-status-steps {
			margin: 20px 0;
		}
		.order-pending-payment {
			h3 {
				font-size: 26px;
				font-weight: 600;
				color: #1241ea;
				margin: 14px 0;
			}
			p {
				padding: 4px 0;
				span {
					font-size: 12px;
					color: #f00;
				}
			}
		}
		.operator {
			margin: 20px 0 6px 0;
			color: $color-hit;
		}
	}

	.delivery-info {
		.delivery-company {
			display: flex;
			span {
				padding-right: 20px;
			}
			p {
				padding: 2px 0;
			}
			.delivery-info-tracks {
				max-height: 20px;
				overflow: hidden;
			}
		}
	}

	.order-details {
		display: flex;
		justify-content: space-around;

		.layout-wrapper {
			flex: 1;
			padding: 0 16px;
			border-right: 1px solid $color-border;
			.payment-voucher {
				width: 100%;
			}
		}

		.layout-wrapper > div {
			padding-bottom: 40px;
			p {
				padding: 3px 0;
				word-break: break-all;
				padding-right: 16px;
			}
		}
	}
}
</style>
