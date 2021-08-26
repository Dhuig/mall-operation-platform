<template>
	<div class="customer-order-detail">
		<el-card class="card order-status-steps">
			<div class="order-info">
				<span>订单号: {{ orderDetails.orderNo }}</span>
			</div>
			<div class="flex">
				<div class="order-pending-payment">
					<h3>{{ ORDER_STATUS_TIP[orderDetails.orderStatus] }}</h3>
					<p v-if="orderDetails.orderStatus == 4">{{ orderDetails.cancelReason }}</p>
					<p v-if="orderDetails.orderStatus == 4 && orderDetails.remarks">备注: {{ orderDetails.remarks }}</p>
					<p
						v-if="
							[1, 3].includes(orderDetails.orderStatus) && (orderDetails.sysCancelTime || orderDetails.sysReceiveTime)
						"
					>
						剩余时间: {{ remainingTime }}
					</p>
					<p v-if="orderDetails.serviceType == 1">
						<span>售后中，售后单号：{{ orderDetails.serviceNo }}</span>
					</p>
				</div>
				<el-steps class="order-status-steps" :active="stepsActive" align-center>
					<el-step
						v-for="(status, index) in orderSteps"
						:key="index"
						:title="ORDER_STEPS_TITLE[status.orderStatus]"
						:description="formatDate(status.createTime)"
					></el-step>
				</el-steps>
			</div>
			<div class="operator">
				<el-button plain v-permission="'customer_order_detail_print'" @click="print(orderDetails.orderNo)">
					打印
				</el-button>
				<el-button
					plain
					v-permission="'customer_order_detail_cancel'"
					v-if="[1].includes(orderDetails.orderStatus)"
					@click="cancelOrderShow = true"
				>
					取消订单
				</el-button>
				<el-button
					plain
					v-permission="'customer_order_detail_apply_after_sales'"
					v-if="[2, 3, 99].includes(orderDetails.orderStatus) && orderDetails.stockType != 3"
					:disabled="orderDetails.serviceType == 1"
					@click="applyAfterSales(orderDetails, orderProductVos)"
				>
					代客售后
				</el-button>
			</div>
		</el-card>
		<el-card class="card delivery-info">
			<h2>物流信息</h2>

			<template v-if="deliveryInfo.length">
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
			</template>
			<template v-else>
				{{ deliveryMessage }}
			</template>
		</el-card>

		<el-card class="card">
			<div class="order-details">
				<div class="layout-wrapper">
					<div class="creator-info">
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
					</div>
					<div class="deliveryman-info">
						<h2>送货人信息</h2>
						<p>送货人姓名：{{ orderDetails.ownerName }}</p>
						<p>送货人卡号：{{ orderDetails.ownerCard }}</p>
					</div>
					<div class="deliveryman-info">
						<h2>订单信息</h2>
						<p>订单编号：{{ orderDetails.orderNo }}</p>
						<p>下单方式：{{ ORDER_WAY_MAP[orderDetails.orderWay] }}</p>
						<p>下单渠道：{{ SOURCE_MAP[orderDetails.source] }}</p>
						<!-- <p>产品类型：{{ PRODUCT_ORDER_TYPE_MAP[orderDetails.ownerCard] }}</p> -->
						<p>交付方式：{{ orderDetails.expressTypeDesc }}</p>
						<p>订单类型：{{ orderDetails.orderTypeDesc }}</p>
						<p>活动订单：{{ IS_PROMITION_MAP[orderDetails.isPromotion] }}</p>
						<p>库存类型：{{ STOCK_TYPE_MAP[orderDetails.stockType] }}</p>
						<p v-if="orderDelayVos(1)">
							待支付自动取消时间：{{ orderDetails.orderDelayVos.find(x => x.delayType == 1).delayTime | getTimeText }}
						</p>
						<p v-if="orderDelayVos(3)">
							自动确认收货时间：{{ orderDetails.orderDelayVos.find(x => x.delayType == 3).delayTime | getTimeText }}
						</p>
						<p v-if="orderDetails.orderType == 3">
							调整方式：{{
								orderDetails.adjustmentType in DJUSTMENT_MAP ? DJUSTMENT_MAP[orderDetails.adjustmentType] : ''
							}}
						</p>
						<p v-if="orderDetails.orderType == 3">业绩月份：{{ orderDetails.orderMonth }}</p>
					</div>
				</div>
				<div class="layout-wrapper" style="padding-left: 20px">
					<div class="deliveryman-info">
						<h2>收货人信息</h2>
						<p>收货人：{{ orderDetails.receiver }}</p>
						<p>收货人手机号：{{ orderDetails.receiverPhone }}</p>
						<p v-if="orderDetails.expressType === 2">收货地址： {{ address }}</p>
					</div>
					<div class="delivery-type">
						<h2>交付方式</h2>
						<p>交付方式 ：{{ orderDetails.expressTypeDesc }}</p>
						<template v-if="orderDetails.expressType === 1">
							<p style="line-height: 1.3">自提地址 ：{{ address }}</p>
							<p>联系电话：{{ receiverAddress.storePhone }}</p>
						</template>
					</div>
					<div class="store">
						<h2>服务中心 & 服务分公司</h2>
						<p>服务中心 / 编号：{{ orderDetails.storeName }} / {{ orderDetails.storeCode }}</p>
						<p>分公司 / 编号：{{ orderDetails.companyName }} / {{ orderDetails.companyCode }}</p>
					</div>
				</div>
				<div class="layout-wrapper" style="padding-left: 20px">
					<div class="payment-info">
						<h2>付款信息</h2>
						<p v-if="orderDetails.orderStatus != 1">付款方式：{{ payType }}</p>
						<p v-if="orderDetails.orderStatus != 1">付款时间：{{ orderDetails.payTime | formatDate }}</p>
						<p>个人累计PV：{{ orderDetails.grandTotalPv }}</p>
						<p>订单积分(PV)：{{ orderDetails.pv }}</p>
						<p>应付金额：{{ orderDetails.orderAmount | addPrefixForAmount }}</p>
						<p>运费：{{ orderDetails.expressAmount | addPrefixForAmount }}</p>
						<p>返还比例：{{ orderDetails.returnRate * 100 }} %</p>
						<p>返还金额：{{ orderDetails.returnAmount | addPrefixForAmount }}</p>
						<p>电子礼券：{{ orderDetails.giftCouponAmount | addPrefixForAmount }}</p>
						<p>优惠券：{{ orderDetails.couponAmount | addPrefixForAmount }}</p>
						<p>运费补贴券：{{ orderDetails.expressSubsidyAmount | addPrefixForAmount }}</p>
						<p v-if="orderDetails.orderStatus == 1">需付款：{{ orderDetails.totalAmount | addPrefixForAmount }}</p>
						<p v-if="orderDetails.orderStatus != 1">实付金额：{{ orderDetails.actuallyAmount | addPrefixForAmount }}</p>
					</div>
				</div>
				<div class="layout-wrapper" style="padding-left: 20px">
					<div class="invoice-info">
						<div class="invoice_info_title">
							<h2>发票信息</h2>
							<el-button
								size="mini"
								v-permission="'customer_order_detail_update_ticket'"
								v-if="
									[1, 2].includes(orderInvoiceVo.invoiceType) && Number(orderDetails.isUpdateInvoice) // 又添加了订单是否能重新开票的判断
								"
								@click="applyTicket(orderDetails.orderNo, orderInvoiceVo, 'again')"
							>
								重开发票
							</el-button>
						</div>
						<div class="fontw" style="margin-bottom: 10px">收款与开票分公司</div>
						<div>{{ orderDetails.financeCompanyName }} / {{ orderDetails.financeCompanyCode }}</div>
						<br />
						<br />
						<!-- 未开票状态 -->
						<template v-if="orderDetails.isInvoice === 0">
							<p v-if="isOverTime">当前订单已超过申请发票时限。如需申请，请联系客服处理。</p>
							<div v-if="orderDetails.serviceType == 1">当前订单售后中，无法申请开票。</div>
							<div
								v-if="
									(!isOverTime && orderDetails.totalAmount == 0) ||
									[4, 5].includes(orderDetails.orderStatus) ||
									orderDetails.orderType == 3 ||
									!Number(orderDetails.isCanInvoice) // 又添加了订单不能开票给文案显示
								"
							>
								暂无
							</div>
							<el-button
								v-if="
									!isOverTime &&
									Number(orderDetails.isCanInvoice) && // 又添加了订单是否能开票的判断
									orderDetails.totalAmount > 0 &&
									orderDetails.serviceType != 1 &&
									![4, 5].includes(orderDetails.orderStatus) &&
									orderDetails.orderType != 3
								"
								v-permission="'customer_order_detail_apply_ticket'"
								@click="applyTicket(orderDetails.orderNo)"
							>
								申请开票
							</el-button>
							<!-- <el-button @click="applyTicket(orderDetails.orderNo)">申请开票</el-button> -->
						</template>
						<!-- 已开票状态 -->
						<template v-else>
							<!-- 企业专用纸质发票 -->
							<div v-if="orderInvoiceVo && orderInvoiceVo.invoiceType === 3">
								<p>开票类型：{{ INVOICE_TYPE[orderInvoiceVo.invoiceType] }}</p>
								<p>纳税人识别号：{{ orderInvoiceVo.taxpayerNo }}</p>
								<p>单位全称：{{ orderInvoiceVo.name }}</p>
								<p>注册地址：{{ orderInvoiceVo.registerAddress }}</p>
								<p>注册电话：{{ orderInvoiceVo.registerPhone }}</p>
								<p>开户银行名称：{{ orderInvoiceVo.bankName }}</p>
								<p>开户银行账号：{{ orderInvoiceVo.bankAccount }}</p>
								<p>联系人电话：{{ orderInvoiceVo.phone }}</p>
								<div>
									<div>状态：{{ invoiceStatus }}</div>
									<div v-if="orderInvoiceVo.invoiceStatus == 3">
										<el-button
											type="text"
											v-for="(item, index) in orderInvoiceVo.invoiceUrls"
											:key="index"
											@click="showImg(item)"
										>
											发票{{ index + 1 }}
										</el-button>
									</div>
									<div v-if="orderInvoiceVo.invoiceStatus == 4">开票失败</div>
								</div>
								<!-- todo: 文件名称 -->
								<p>授权委托书：</p>
								<p>
									委托书
									<el-button type="text" @click="showImg(orderInvoiceVo.authorizeLicense)">查看</el-button>
								</p>
								<p>营业执照副本：</p>
								<p>
									营业执照
									<el-button type="text" @click="showImg(orderInvoiceVo.businessLicense)">查看</el-button>
								</p>
								<p>银行开户许可证：</p>
								<p>
									银行开户许可证
									<el-button type="text" @click="showImg(orderInvoiceVo.bankLicense)">查看</el-button>
								</p>
							</div>
							<!-- 企业普通电子发票 -->
							<div v-else-if="orderInvoiceVo.invoiceType === 2">
								<p>开票类型：{{ INVOICE_TYPE[orderInvoiceVo.invoiceType] }}</p>
								<p>纳税人识别号：{{ orderInvoiceVo.taxpayerNo }}</p>
								<p>单位全称：{{ orderInvoiceVo.name }}</p>
								<p>注册地址：{{ orderInvoiceVo.registerAddress }}</p>
								<p>注册电话：{{ orderInvoiceVo.registerPhone }}</p>
								<p>开户银行名称：{{ orderInvoiceVo.bankName }}</p>
								<p>开户银行账号：{{ orderInvoiceVo.bankAccount }}</p>
								<div>
									<div>状态：{{ invoiceStatus }}</div>
									<div v-if="orderInvoiceVo.invoiceStatus == 3">
										<el-button
											type="text"
											v-for="(item, index) in orderInvoiceVo.invoiceUrls"
											:key="index"
											@click="showImg(item)"
										>
											发票{{ index + 1 }}
										</el-button>
									</div>
									<div v-if="orderInvoiceVo.invoiceStatus == 4">开票失败</div>
								</div>
							</div>
							<!-- 个人普通电子发票 -->
							<div v-else>
								<p>开票类型：{{ INVOICE_TYPE[orderInvoiceVo.invoiceType] }}</p>
								<p>个人姓名：{{ orderInvoiceVo.name }}</p>
								<div>
									<div>状态：{{ invoiceStatus }}</div>

									<div v-if="orderInvoiceVo.invoiceStatus == 3">
										<el-button
											type="text"
											v-for="(item, index) in orderInvoiceVo.invoiceUrls"
											:key="index"
											@click="showImg(item)"
										>
											发票{{ index + 1 }}
										</el-button>
									</div>
									<div v-if="orderInvoiceVo.invoiceStatus == 4">开票失败</div>
								</div>
							</div>
						</template>
					</div>
				</div>
			</div>
		</el-card>

		<el-card class="card">
			<h2>产品明细</h2>
			<tableList
				:data-source="orderProductVos"
				:columns="PRODUCT_DETAILS_COLUMNS"
				showSummary
				:options="{
					index: true,
					labelIndex: '序号',
				}"
			></tableList>
		</el-card>
		<el-card class="card">
			<h2>操作记录</h2>
			<tableList
				:data-source="orderStatusChangeVos"
				:columns="OPERATION_RECORD"
				:options="{
					index: true,
					labelIndex: '序号',
				}"
			></tableList>
		</el-card>
		<ticketModal v-if="ticketModal.show" :ticketModal="ticketModal" @close="closeTicketModal" />
		<afterSaleModal v-if="afterSaleModal.show" :afterSaleModal="afterSaleModal" />
		<el-dialog
			title="取消订单"
			:visible.sync="cancelOrderShow"
			width="40%"
			:before-close="closeCancelOrderShow"
			:close-on-press-escape="false"
		>
			<p class="marginB10">代客取消订单</p>
			<el-form :model="orderForm" :rules="rules" ref="orderForm" label-width="96px" class="demo-ruleForm">
				<el-form-item label="取消原因" prop="remarks">
					<el-input
						type="textarea"
						placeholder="请输入取消原因"
						maxlength="1000"
						show-word-limit
						:autosize="{ minRows: 4, maxRows: 4 }"
						v-model="orderForm.remarks"
					></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeCancelOrderShow">取 消</el-button>
				<el-button type="primary" @click="cancelOrder">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 查看图片 -->
		<el-dialog :visible.sync="previewObj.visible" append-to-body v-drag>
			<img width="100%" :src="previewObj.url" alt />
		</el-dialog>
	</div>
</template>

<script>
import { formatDate, addPrefixForAmount, getWeekFromTime } from 'util/formValidation';
import {
	PRODUCT_DETAILS_COLUMNS,
	CUSTOMER_TYPE,
	INVOICE_STATUS,
	ORDER_STATUS,
	OPERATION_RECORD,
	ORDER_STEPS,
	ORDER_STEPS_TITLE,
	ORDER_STATUS_TIP,
	INVOICE_TYPE,
	PAY_TYPE,
	IS_PROMITION_MAP,
	ORDER_WAY_MAP,
	STOCK_TYPE_MAP,
	PRODUCT_ORDER_TYPE_MAP,
	DJUSTMENT_MAP,
	SOURCE_MAP,
} from '../config';
import ticketModal from '../modal/ticketModal';
import afterSaleModal from '../modal/afterSaleModal';
export default {
	name: 'customerOrderDetail',
	data() {
		return {
			PRODUCT_DETAILS_COLUMNS,
			ORDER_STATUS,
			OPERATION_RECORD,
			ORDER_STEPS_TITLE,
			ORDER_STATUS_TIP,
			INVOICE_TYPE,
			IS_PROMITION_MAP,
			ORDER_WAY_MAP,
			STOCK_TYPE_MAP,
			PRODUCT_ORDER_TYPE_MAP,
			SOURCE_MAP,
			DJUSTMENT_MAP,
			previewObj: {
				// 显示图片
				url: '',
				visible: false,
			},
			orderDetails: {
				orderDelayVos: [],
			}, // 除发票信息、产品明细、步骤条信息之外的订单信息
			orderStatusChangeVos: [], // 步骤条信息和操作记录
			orderInvoiceVo: {}, // 发票信息
			orderProductVos: [], // 产品明细
			remainingTime: '', // 剩余时间
			applyAfterSale: {},
			ticketModal: {
				show: false,
				orderNo: '',
				title: '申请开票',
				state: 1,
			},
			afterSaleModal: {
				show: false,
				orderNo: '',
			},
			deliveryInfo: [],
			deliveryMessage: '暂无物流信息',
			moreBtn: {},
			cancelOrderShow: false, // 取消订单dialog
			orderForm: {
				remarks: '',
			},
			rules: {
				remarks: [{ required: true, message: '请输入取消原因', trigger: 'blur' }],
			},
		};
	},
	computed: {
		stepsActive() {
			const { orderStatus } = this.orderDetails;
			return orderStatus === 99 ? 100 : orderStatus;
		},
		customerType() {
			return CUSTOMER_TYPE[this.orderDetails.customerType];
		},
		payType() {
			return PAY_TYPE[this.orderDetails.payType];
		},
		invoiceStatus() {
			return INVOICE_STATUS[this.orderInvoiceVo.invoiceStatus];
		},
		orderSteps() {
			// 通过拼接上接口数据没有的信息造出整个steps数据
			const orderStatusArr = this.orderStatusChangeVos.map(item => item.orderStatus);
			return ![4, 5].includes(this.orderDetails.orderStatus)
				? [...this.orderStatusChangeVos].concat(
						// 正常流程场景
						ORDER_STEPS.filter(item => !orderStatusArr.includes(item.orderStatus) && ![4, 5].includes(item.orderStatus))
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  )
				: this.orderStatusChangeVos.map(({ orderStatus, createTime }) => ({
						// 取消/退货场景
						orderStatus,
						createTime,
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  }));
		},
		isOverTime() {
			return this.orderDetails.payTime
				? new Date(this.orderDetails.payTime).getMonth() + 1 < new Date().getMonth()
				: false;
		},
		address() {
			const receiverAddress = this.orderDetails.receiverAddress;
			const province = receiverAddress.province ? receiverAddress.province : '';
			const city = receiverAddress.city ? receiverAddress.city : '';
			const district = receiverAddress.district ? receiverAddress.district : '';
			const street = receiverAddress.street ? receiverAddress.street : '';
			const address = receiverAddress.address ? receiverAddress.address : '';
			return receiverAddress ? `${province}${city}${district}${street}${address}` : '';
		},
		receiverAddress() {
			const storePhone = this.orderDetails.receiverAddress?.storePhone;
			const address = this.orderDetails.receiverAddress?.address;
			return { address, storePhone };
		},
	},
	methods: {
		showImg(url) {
			console.log();
			if (url.includes('.pdf')) {
				// pdf 改下载
				// window.location.path
				// window.open(url);
				let resultUrl;
				if (process.env.NODE_ENV.includes('development')) {
					resultUrl = url;
				} else {
					resultUrl = url.includes('http://') ? url.replace('http://', '/rewrite/') : url;
				}
				window.open(resultUrl);
				return;
			}
			this.previewObj = {
				// 显示图片
				url,
				visible: true,
			};
		},
		orderDelayVos(type) {
			return this.orderDetails.orderDelayVos.filter(x => x.delayType == type).length;
		},
		formatDate,
		async loadData() {
			const { orderNo } = this.$route.query;
			const res = await this.$fetch({
				url: `/mgmt/order/orderInfo/${orderNo}`,
			});
			if (res && res.data) {
				const { orderInvoiceVo, orderProductVos, orderStatusChangeVos, receiverAddress, ...orderDetails } = res.data;
				if (orderDetails.expressType == 2) {
					this.getDeliverInfo();
				}
				this.PRODUCT_DETAILS_COLUMNS[5]['isShow'] = () => orderDetails.orderType == 4; // 是否显示团购价
				this.PRODUCT_DETAILS_COLUMNS[6]['isShow'] = () => orderDetails.productOrderType == 2; // 是否显示订购价
				this.PRODUCT_DETAILS_COLUMNS[7]['formatter'] = ({ price, retailPrice }) => {
					return `￥${orderDetails.productOrderType == 2 ? price : retailPrice}`;
				}; // 零售价 修改
				this.orderInvoiceVo = orderInvoiceVo;
				this.orderProductVos = orderProductVos;
				this.orderStatusChangeVos = orderStatusChangeVos;
				this.orderDetails = orderDetails;
				this.orderDetails.receiverAddress = receiverAddress ? JSON.parse(receiverAddress.replace(/\n/g, '')) : '';
				this.calculateRemainingTime(); // 获取自动取消时间/确认收货时间之后, 设置倒计时定时器
			}
		},
		async getDeliverInfo() {
			const { orderNo } = this.$route.query;
			const res = await this.$fetch({
				url: `/mgmt/order/deliverInfo/${orderNo}`,
				timeout: 60000,
			});

			if (res?.code === 200 && res?.data) {
				this.deliveryInfo = res.data;
			}
		},
		async applyAfterSaleInfo() {
			const { orderNo } = this.$route.query;
			const res = await this.$fetch({
				url: `/mgmt/order/as/applyAfterSale/?orderNo=${orderNo}`,
			});
			if (res.code === 200 && res.data) {
				this.applyAfterSale = res.data;
				console.log(this.applyAfterSale);
			}
		},
		calculateRemainingTime() {
			const { orderStatus, commitTime, deliverTime, orderDelayVos } = this.orderDetails;
			const sysCancelTime = orderDelayVos.find(x => x.delayType == 1)?.delayTime;
			const sysReceiveTime = orderDelayVos.find(x => x.delayType == 3)?.delayTime;
			const startTime = orderStatus === 1 ? commitTime : deliverTime;
			const deadline = orderStatus === 1 ? sysCancelTime : sysReceiveTime;
			const countDownDate = startTime + deadline * 60 * 1000;
			const now = new Date().getTime();
			const distance = countDownDate - now;
			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			this.remainingTime = `${days}天${hours}小时${minutes}分钟,${
				orderStatus === 1 ? '超时自动取消' : '超时自动确认收货'
			}`;

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
					this.remainingTime = `${days}天${hours}小时${minutes}分钟`;
				}
			}, 1000 * 60);
			this.$once('hook:beforeDestroy', () => {
				clearInterval(this.timer);
			});
		},
		download(type) {
			window.open(this.orderInvoiceVo[type]);
		},
		// 关闭取消订单弹窗
		closeCancelOrderShow() {
			this.$refs.orderForm.resetFields();
			this.cancelOrderShow = false;
		},
		// 关闭确认订单弹窗
		cancelOrder() {
			this.$refs['orderForm'].validate(async valid => {
				if (valid) {
					const formdata = new FormData();
					formdata.append('orderNo', this.orderDetails.orderNo);
					formdata.append('remarks', this.orderForm.remarks);
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/order/cancelOrder',
						data: formdata,
					});
					if (res && res.code === 200) {
						this.$message({
							message: res.message,
							type: 'success',
						});
						this.closeCancelOrderShow();
						this.loadData();
						return;
					}
				}
			});
		},
		applyTicket(orderNo, info, title) {
			if (this.orderDetails.stockType == 3) {
				return this.$message.warning('单位团购不支持申请开票');
			}
			this.ticketModal = {
				...info,
				show: true,
				orderNo,
				ticketModal,
				title: title ? '修改开票信息' : '申请开票',
				againState: title,
			};
			console.log(this.ticketModal.againState);
		},
		closeTicketModal() {
			this.ticketModal = {
				show: false,
				orderNo: '',
			};
			this.loadData();
		},
		applyAfterSales(orderDetails, orderProductVos) {
			const { orderNo, expressType, expressTypeDesc, storeCode, storeName, storePhone } = orderDetails;
			const { isStoreReturnOver, isStoreClosed } = this.applyAfterSale;
			this.afterSaleModal = {
				show: true,
				orderNo,
				expressType,
				expressTypeDesc,
				storeCode,
				storeName,
				storePhone,
				orderProductVos,
				isStoreReturnOver,
				isStoreClosed,
			};
		},
		// 物流信息 更多 按钮
		clickMoreBtn(index) {
			this.moreBtn = { ...this.moreBtn, [index]: !this.moreBtn[index] };
		},
		print(orderNo) {
			this.$go('deliver_shipment_query', { orderNo });
		},
	},
	created() {
		this.$listen('RELOAD_CUSTOMER_ORDER_DETAIL', () => {
			this.loadData();
		});
	},
	async mounted() {
		this.applyAfterSaleInfo();
		await this.loadData();
	},
	filters: {
		addPrefixForAmount,
		getWeekFromTime,
		getTimeText(m) {
			const days = Math.trunc(m / (24 * 60));
			const hours = Math.trunc((m % (24 * 60)) / 60);
			const minutes = (m % (24 * 60)) - hours * 60;
			return `${days}天${hours}小时${minutes}分钟`;
		},
	},
	components: { ticketModal, afterSaleModal },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
	overflow-y: auto;
	max-height: 520px;
}
::v-deep .el-card__header {
	font-weight: bold;
}
.fontw {
	font-weight: 600;
}
.customer-order-detail {
	color: $color-body;
	.flex {
		display: flex;
		align-items: center;
	}
	.card {
		margin: 20px 0;

		h2 {
			font-size: 18px;
			font-weight: 600;
			color: $color-title;
			padding: 0 0 26px 0;
		}
	}
	.order-status-steps {
		flex: 1;
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
	.marginB10 {
		margin-bottom: 10px;
	}
	.delivery-info {
		line-height: 18px;
		p {
			padding: 2px 0;
		}
		.delivery-company {
			display: flex;
			span {
				padding-right: 20px;
			}
			.delivery-info-tracks {
				max-height: 20px;
				overflow: hidden;
			}
		}
	}

	.deliveryman-info {
		line-height: 20px;
	}

	.order-details {
		display: flex;
		justify-content: space-around;

		.layout-wrapper {
			width: 25%;
			border-right: 1px solid #000;
		}

		.layout-wrapper > div {
			padding-bottom: 40px;
			p {
				padding: 3px 0;
			}
		}
		.invoice_info_title {
			display: flex;
			justify-content: space-between;
			padding-right: 15px;
			.el-button {
				padding: 0 13px;
				height: 34px;
			}
		}
	}
}
</style>
