<template>
	<div class="return-goods-details">
		<guideBar></guideBar>
		<!-- 审批流程 -->
		<el-card>
			<div class="audit-flow">
				<div class="audit-flow-header flex itemC">
					<div>退货单号：{{ returnGoodInfo.orderReturn.returnNo }}</div>
					<div class="orderNo">
						订单号：
						<span class="blue" @click="goOrderInfo(returnGoodInfo.orderReturn.orderNo)">
							{{ returnGoodInfo.orderReturn.orderNo }}
						</span>
					</div>
					<div class="orderNo">退货类型：{{ returnGoodInfo.orderReturn.returnTypeDesc }}</div>
					<div class="orderNo">申请来源：{{ returnGoodInfo.orderReturn.applySourceDesc }}</div>
					<div class="orderNo" v-if="returnGoodInfo.orderReturn.returnStatus == 99">
						退款状态：{{ returnGoodInfo.orderReturn.refundStatusDesc }}
					</div>

					<el-button
						size="mini"
						v-if="returnGoodInfo.orderReturn.refundStatus == 2"
						type="primary"
						@click="initiateRefund"
						class="marginL10"
					>
						重新发起退款
					</el-button>
				</div>
				<div class="audit-flow-content flex">
					<div class="audit-flow-left">
						<div
							class="audit-flow-status"
							:class="{ 'audit-flow-gray': [98, 97].includes(returnGoodInfo.orderReturn.returnStatus) }"
						>
							{{ returnGoodInfo.orderReturn.returnStatusDesc }}
						</div>
						<div class="audit-flow-right">
							<!-- 时间 -->
							<p v-if="timeMessage" class="marginB10">{{ timeMessage }}</p>
							<!-- 自提且待审核才显示 -->
							<p
								class="red margin10"
								v-if="
									returnGoodInfo.orderReturn.expressType == 1 &&
									returnGoodInfo.orderReturn.returnStatus == 1 &&
									returnGoodInfo.orderReturn.returnInvoiceStatus != 2 &&
									returnGoodInfo.orderReturn.isReturnInvoice == 1
								"
							>
								待确认退票
							</p>

							<!-- 公司交付 || 自提订单 && 关闭店铺-->
							<div
								class="flex flex-direction"
								v-if="
									returnGoodInfo.orderReturn.expressType == 2 ||
									(returnGoodInfo.orderReturn.expressType == 1 && returnGoodInfo.orderReturn.isStoreClosed == 1)
								"
							>
								<!-- 待退回的时候才出现代客补充物流信息 -->
								<div v-if="returnGoodInfo.orderReturn.returnStatus == 2">
									物流信息:无
									<el-button type="text" class="margin10" @click="logisticsShow = true">代客补充物流信息</el-button>
								</div>
								<!-- 待验货到时候出现编辑 代客补充物流信息 已完成不出现编辑/验货-->
								<div v-if="[3, 99].includes(returnGoodInfo.orderReturn.returnStatus)">
									<div v-if="returnGoodInfo.orderReturn.returnExpressType">
										{{ returnGoodInfo.orderReturn.returnStatus == 3 ? '退回物流' : '物流信息' }}:{{
											returnGoodInfo.orderReturn.returnExpressType == 1
												? `${returnGoodInfo.orderReturn.returnExpressNo} ${returnGoodInfo.orderReturn.returnExpressName}`
												: '自带'
										}}
									</div>
									<el-button
										type="text"
										class="margin10"
										v-permission="'return_goods_detail_edit_return_flow'"
										@click="editLogisticsShow"
									>
										编辑
									</el-button>
									<div
										class="flex flex-align marginT10"
										v-if="
											returnGoodInfo.orderReturn.returnExpressType == 1 &&
											returnGoodInfo.orderReturn.goodsReturnAttachmentUrls.length
										"
									>
										<div>退回凭证:</div>
										<div v-for="(item, index) in returnGoodInfo.orderReturn.goodsReturnAttachmentUrls" :key="index">
											<el-image
												class="images"
												:src="item"
												:preview-src-list="returnGoodInfo.orderReturn.goodsReturnAttachmentUrls"
											></el-image>
										</div>
									</div>
									<p
										class="red"
										v-if="
											returnGoodInfo.orderReturn.returnStatus == 3 &&
											returnGoodInfo.orderReturn.returnInvoiceStatus != 2 &&
											returnGoodInfo.orderReturn.isReturnInvoice == 1
										"
									>
										待确认退票，无法进行验货操作
									</p>
									<div>
										<el-button
											type="primary"
											v-if="returnGoodInfo.orderReturn.returnStatus == 3"
											:disabled="returnGoodInfo.orderReturn.returnInvoiceStatus == 1"
											class="margin10"
											v-permission="'return_goods_detail_inpect'"
											@click="auditVerifyGodds('verify')"
										>
											验货
										</el-button>
									</div>
									<!-- 已完成才显示才显示 -->
									<div v-if="returnGoodInfo.orderReturn.returnStatus == 99">
										<p class="marginT10" v-if="returnGoodInfo.orderReturn.subsidyFreight">
											运费补贴:{{ returnGoodInfo.orderReturn.subsidyFreight }}
										</p>
										<p class="marginT10" v-if="returnGoodInfo.orderReturn.refundNo > 0">
											支付流水:{{ returnGoodInfo.orderReturn.refundNo || 0 }}
										</p>
									</div>
								</div>
							</div>

							<!-- 公司交付-->
							<div class="flex flex-direction" v-if="returnGoodInfo.orderReturn.expressType == 2">
								<!-- 待审核的时候才出现审核按钮 -->
								<el-button
									type="primary"
									class="margin10"
									:disabled="
										!returnGoodInfo.orderServiceComments.length || !reasonForm.reason1Id || !reasonForm.reason2Id
									"
									v-if="returnGoodInfo.orderReturn.returnStatus == 1 && returnGoodInfo.orderReturn.applySource != 0"
									v-permission="'return_goods_detail_audit'"
									@click="auditVerifyGodds('audit')"
								>
									审核
								</el-button>
								<!-- 待退回的时候才出现撤销审核按钮 -->
								<el-button
									v-permission="'return_goods_detail_reset'"
									v-if="returnGoodInfo.orderReturn.returnStatus == 2"
									@click="cancelOrderReturnAudit"
								>
									撤销审核
								</el-button>
							</div>
							<!-- 待审核才出现的按钮 -->
							<div class="flex" v-if="returnGoodInfo.orderReturn.returnStatus == 1">
								<!-- 自提 && 关闭店铺 &&  非代客售后 && 有审核意见 显示审核 -->
								<el-button
									type="primary"
									v-if="
										returnGoodInfo.orderReturn.expressType == 1 &&
										returnGoodInfo.orderReturn.isStoreClosed == 1 &&
										returnGoodInfo.orderReturn.applySource != 0
									"
									:disabled="
										!returnGoodInfo.orderServiceComments.length || !reasonForm.reason1Id || !reasonForm.reason2Id
									"
									class="margin10 flexone"
									@click="auditVerifyGodds('audit')"
								>
									审核
								</el-button>
								<!--  自提 && 总公司代客售后 && 有审核意见 显示同意退款 -->
								<el-button
									type="primary"
									v-if="returnGoodInfo.orderReturn.applySource == 0"
									v-permission="'return_goods_detail_agree'"
									:disabled="!returnGoodInfo.orderServiceComments.length"
									class="margin10 flexone"
									@click="enterRetuen"
								>
									同意退款
								</el-button>
							</div>
							<!-- 待审核出现 -->
							<div class="flex" v-if="returnGoodInfo.orderReturn.returnStatus == 1">
								<el-button
									class="flexone"
									v-permission="'return_goods_detail_cancel_apply'"
									@click="cancelRetuenGoodsApply"
								>
									取消退货申请
								</el-button>
							</div>
						</div>
					</div>
					<!-- 步骤条 -->
					<div class="audit-flow-right">
						<el-steps :active="isActive" align-center process-status="wait">
							<el-step
								icon="el-icon-circle-check"
								v-for="(item, index) in resultStep"
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
		<!-- 退货信息 -->
		<el-card>
			<div slot="header" class="card-header">
				<div class="title">退货信息</div>
				<div v-permission="'return_goods_save_reason_button'">
					<el-button v-if="showReason" type="primary" @click="saveReason">保存</el-button>
				</div>
			</div>
			<div v-if="showReason">
				<el-form :model="reasonForm" :rules="AUDIT_VERIFY_DIALOG_RULES" ref="reasonForm" label-width="140px">
					<el-row type="flex">
						<el-col :span="6">
							<el-form-item label="一级退货原因" prop="reason1Id">
								<el-select v-model="reasonForm.reason1Id" @change="clearReason2Id" placeholder="请选择一级退货原因">
									<el-option
										v-for="{ returnReason, id } in reasonDict"
										:label="returnReason"
										:value="id"
										:key="id"
									></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="一级退货原因备注" prop="reason1Remark">
								<el-input v-model="reasonForm.reason1Remark" placeholder="补充说明"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row type="flex">
						<el-col :span="6">
							<el-form-item label="二级退货原因" prop="reason2Id">
								<el-select v-model="reasonForm.reason2Id" placeholder="请选择二级退货原因">
									<el-option
										v-for="{ returnReason, id } in reasonDict2"
										:label="returnReason"
										:value="id"
										:key="id"
									></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="二级退货原因备注" prop="reason2Remark">
								<el-input v-model="reasonForm.reason2Remark" placeholder="补充说明"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item
						label="退货凭证"
						v-if="returnGoodInfo.orderReturn.attachmentUrls && returnGoodInfo.orderReturn.attachmentUrls.length"
					>
						<el-image
							v-for="(item, index) in returnGoodInfo.orderReturn.attachmentUrls"
							:key="index"
							class="images"
							:src="item"
							:preview-src-list="returnGoodInfo.orderReturn.attachmentUrls"
						></el-image>
					</el-form-item>
				</el-form>
			</div>
			<div v-else>
				<div v-if="returnGoodInfo.orderReturn.reason1">
					<span>一级退货原因:</span>
					{{ returnGoodInfo.orderReturn.reason1 }}
					<span>补充一级原因:</span>
					{{ returnGoodInfo.orderReturn.reason1Remark || '--' }}
				</div>
				<div v-if="returnGoodInfo.orderReturn.reason2" class="marginT10">
					<span>二级退货原因:</span>
					{{ returnGoodInfo.orderReturn.reason2 }}
					<span>补充二级原因:</span>
					{{ returnGoodInfo.orderReturn.reason2Remark || '--' }}
				</div>
				<div
					class="flex marginT10"
					v-if="returnGoodInfo.orderReturn.attachmentUrls && returnGoodInfo.orderReturn.attachmentUrls.length"
				>
					<span>退货凭证:</span>

					<el-image
						v-for="(item, index) in returnGoodInfo.orderReturn.attachmentUrls"
						:key="index"
						class="images"
						:src="item"
						:preview-src-list="returnGoodInfo.orderReturn.attachmentUrls"
					></el-image>
				</div>
			</div>
		</el-card>
		<!-- 审核意见 -->
		<el-card>
			<div slot="header">
				<span>审核意见</span>
				<el-button
					class="marginL10"
					v-if="returnGoodInfo.orderReturn.returnStatus == 1"
					type="primary"
					@click="ideaOperate('add')"
					v-permission="'return_goods_detail_add_audit_suggestion'"
				>
					添加
				</el-button>
			</div>
			<tableList :dataSource="returnGoodInfo.orderServiceComments" :columns="IDEA_RETURN_GOODS_COLUMS" slotcontent>
				<template slot-scope="scope" v-if="![97, 98, 99].includes(returnGoodInfo.orderReturn.returnStatus)">
					<el-button
						type="text"
						v-permission="'return_goods_detail_edit_audit_suggestion'"
						@click="ideaOperate('edit', scope.data)"
					>
						编辑
					</el-button>
					<el-button
						type="text"
						v-permission="'return_goods_detail_delete_audit_suggestion'"
						@click="ideaOperate('del', scope.data)"
					>
						删除
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 退回地址 -->
		<el-card v-if="returnGoodInfo.orderReturn.returnAddress">
			<div slot="header">
				<div class="title">退回地址</div>
			</div>
			<div>{{ returnGoodInfo.orderReturn.returnAddress }}</div>
		</el-card>
		<!-- 详情 -->
		<!-- <el-card>
			<div class="return-ticket-info flex">
				<div class="row">
					<h4>开单信息</h4>
					<div>开单人姓名: {{ returnGoodInfo.order.creatorName }}</div>
					<div>开单人卡号: {{ returnGoodInfo.order.creatorCard }}</div>
					<div>开单人手机号: {{ returnGoodInfo.order.creatorPhone }}</div>
					<h4>顾客信息</h4>
					<div>顾客姓名: {{ returnGoodInfo.order.customerName }}</div>
					<div>顾客卡号: {{ returnGoodInfo.order.customerCard }}</div>
					<div>顾客手机号: {{ returnGoodInfo.order.customerPhone }}</div>
					<div>顾客类型: {{ CUSTOMERTYPE[returnGoodInfo.order.customerType] }}</div>
					<h4>送货人信息</h4>
					<div>送货人姓名: {{ returnGoodInfo.order.ownerName }}</div>
					<div>送货人卡号: {{ returnGoodInfo.order.ownerCard }}</div>
				</div>
				<div class="row">
					<h4>交付方式</h4>
					<div>交付方式: {{ EXPRESSTYPE[returnGoodInfo.order.expressType] }}</div>
					<div v-if="returnGoodInfo.order.expressType == 1" class="lineFeed">
						自提地址: {{ returnGoodInfo.order.receiverAddress }}
					</div>
					<div v-if="returnGoodInfo.order.expressType == 1">联系电话: {{ returnGoodInfo.order.receiverPhone }}</div>
					<h4>收件人信息</h4>
					<div>收件人: {{ returnGoodInfo.order.receiver }}</div>
					<div>收件人手机号: {{ returnGoodInfo.order.receiverPhone }}</div>
					<div v-if="returnGoodInfo.order.expressType == 2">收货地址: {{ returnGoodInfo.order.receiverAddress }}</div>
					<h4>服务中心&分公司</h4>
					<div v-if="returnGoodInfo.order.expressType == 1">
						服务中心/编号: {{ returnGoodInfo.order.storeName }} {{ returnGoodInfo.order.storeCode }}
					</div>
					<div>分公司/编号: {{ returnGoodInfo.order.companyName }} {{ returnGoodInfo.order.companyCode }}</div>
				</div>
				<div class="row">
					<h4>付款信息</h4>
					<div>付款方式: {{ PAYTYPE[returnGoodInfo.order.payType] }}</div>
					<div>付款时间: {{ returnGoodInfo.order.payTime }}</div>
					<div>运费补贴: {{ returnGoodInfo.order.expressAmount }}</div>
					<div>产品总金额: {{ returnGoodInfo.order.orderAmount }}</div>
					<div>订单积分PV: {{ returnGoodInfo.order.pv }}</div>
					<div>个人累计PV: {{ returnGoodInfo.order.grandTotalPv }}</div>
					<div>返还比例: {{ returnGoodInfo.order.returnRate }}</div>
					<div>返还金额: {{ returnGoodInfo.order.returnAmount }}</div>
					<div>电子礼券: {{ returnGoodInfo.order.giftCouponAmount }}</div>
					<div>优惠券: {{ returnGoodInfo.order.couponAmount }}</div>
					<div>运费补贴券: {{ returnGoodInfo.order.expressSubsidyAmount }}</div>
					<div>实付金额: {{ returnGoodInfo.order.actuallyAmount }}</div>
				</div>
				<div class="row">
					<h4>发票信息</h4>
					<div v-if="!returnGoodInfo.orderInvoice">未申请发票</div>
					<div v-if="returnGoodInfo.orderInvoice && returnGoodInfo.orderInvoice.invoiceType == 1" class="paddingNone">
						<div>开票类型: {{ INVOICETYPE[returnGoodInfo.orderInvoice.invoiceType] }}</div>
						<div>个人姓名: {{ returnGoodInfo.orderInvoice.name }}</div>
						<div>
							开票状态: {{ INVOICESTATUS[returnGoodInfo.orderInvoice.invoiceStatus] }}
						</div>
					</div>
					<div v-if="returnGoodInfo.orderInvoice && returnGoodInfo.orderInvoice.invoiceType == 2" class="paddingNone">
						<div>开票类型: {{ INVOICETYPE[returnGoodInfo.orderInvoice.invoiceType] }}</div>
						<div>单位全称: {{ returnGoodInfo.orderInvoice.name }}</div>
						<div>注册地址: {{ returnGoodInfo.orderInvoice.registerAddress }}</div>
						<div>注册电话: {{ returnGoodInfo.orderInvoice.registerPhone }}</div>
						<div>开户银行名称: {{ returnGoodInfo.orderInvoice.bankName }}</div>
						<div>开户银行账号: {{ returnGoodInfo.orderInvoice.bankAccount }}</div>
						<div>联系人电话: {{ returnGoodInfo.orderInvoice.phone }}</div>
						<div>
							开票状态: {{ INVOICESTATUS[returnGoodInfo.orderInvoice.invoiceStatus] }}
						</div>
					</div>
					<div v-if="returnGoodInfo.orderInvoice && returnGoodInfo.orderInvoice.invoiceType == 3" class="paddingNone">
						<div>开票类型: {{ INVOICETYPE[returnGoodInfo.orderInvoice.invoiceType] }}</div>
						<div>纳税人识别号: {{ returnGoodInfo.orderInvoice.taxpayerNo }}</div>
						<div>单位全称: {{ returnGoodInfo.orderInvoice.name }}</div>
						<div>注册地址: {{ returnGoodInfo.orderInvoice.registerAddress }}</div>
						<div>注册电话: {{ returnGoodInfo.orderInvoice.registerPhone }}</div>
						<div>开户银行名称: {{ returnGoodInfo.orderInvoice.bankName }}</div>
						<div>开户银行账号: {{ returnGoodInfo.orderInvoice.bankAccount }}</div>
						<div>联系人电话: {{ returnGoodInfo.orderInvoice.phone }}</div>
						<div>开票状态: {{ INVOICESTATUS[returnGoodInfo.orderInvoice.invoiceStatus] }}</div>
						<div>
							授权委托书: &nbsp;
							<el-button
								v-if="returnGoodInfo.orderInvoice.authorizeLicense != '--'"
								@click="handPreview({ url: returnGoodInfo.orderInvoice.authorizeLicense })"
								type="text"
							>
								查看
							</el-button>
							<span v-else>{{ returnGoodInfo.orderInvoice.authorizeLicense }}</span>
						</div>
						<div>
							营业执照副本: &nbsp;
							<el-button
								v-if="returnGoodInfo.orderInvoice.businessLicense != '--'"
								@click="handPreview({ url: returnGoodInfo.orderInvoice.businessLicense })"
								type="text"
							>
								查看
							</el-button>
							<span v-else>{{ returnGoodInfo.orderInvoice.businessLicense }}</span>
						</div>
						<div>
							银行开户许可证: &nbsp;
							<el-button
								v-if="returnGoodInfo.orderInvoice.bankLicense != '--'"
								@click="handPreview({ url: returnGoodInfo.orderInvoice.bankLicense })"
								type="text"
							>
								查看
							</el-button>
							<span v-else>{{ returnGoodInfo.orderInvoice.bankLicense }}</span>
						</div>
					</div>
				</div>
			</div>
		</el-card> -->
		<!-- 退货产品明细 -->
		<el-card>
			<div slot="header">
				<span>产品明细</span>
				<span class="titleMoney" v-if="returnGoodInfo.orderReturn.refundStatus == 1">
					实退金额：￥{{
						returnGoodInfo.orderReturn.refundAmount && returnGoodInfo.orderReturn.refundAmount.toFixed(2)
					}}
				</span>
			</div>
			<tableList
				:dataSource="returnGoodInfo.orderReturnProducts"
				showSummary
				:columns="ORDER_RETURN_GOODS_COLUMS"
			></tableList>
		</el-card>
		<!-- 推送消息名单 -->
		<el-card v-if="returnGoodInfo.orderMsgInfos && returnGoodInfo.orderMsgInfos.length">
			<div slot="header">
				<span>推送消息名单</span>
			</div>
			<el-table :data="returnGoodInfo.orderMsgInfos" style="width: 100%">
				<el-table-column label="序号" align="center" width="80px">
					<template slot-scope="scope">
						<span>{{ scope.$index + 1 }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="customerCard" label="会员卡号"></el-table-column>
				<el-table-column align="center" prop="customer" label="顾客姓名"></el-table-column>
				<el-table-column align="center" prop="customerPhone" label="手机号码"></el-table-column>
				<el-table-column align="center" prop="msgPushTime" label="消息推送时间">
					<template slot-scope="scope">
						<div>
							{{ scope.row.msgPushTime | formatDateStr }}
						</div>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 操作记录 -->
		<el-card>
			<div slot="header">
				<span>操作记录</span>
			</div>
			<tableList :dataSource="returnGoodInfo.orderServiceLogs" :columns="HANDLE_RETURN_GOODS_COLUMS" slotcontent>
				<template slot-scope="scope" v-if="scope.data.attachmentUrls.length">
					<div v-for="(item, index) in scope.data.attachmentUrls" :key="index">
						<el-button class="marginR10" type="text" @click="lookPicture(item)">附件{{ index + 1 }}</el-button>
					</div>
				</template>
			</tableList>
		</el-card>
		<!-- 退货审核 / 验证审核 -->
		<el-dialog :title="auditVerifydialog.title" :visible.sync="auditVerifydialog.show" v-drag>
			<el-form
				ref="auditVerifyForm"
				:model="auditVerifyForm"
				:rules="AUDIT_VERIFY_DIALOG_RULES"
				label-width="140px"
				label-suffix=":"
			>
				<div class="flex">
					<el-form-item label="退货单号">
						{{ returnGoodInfo.orderReturn.returnNo }}
					</el-form-item>
					<el-form-item label="订单号">
						{{ returnGoodInfo.orderReturn.orderNo }}
					</el-form-item>
				</div>
				<el-form-item label="审核结果" prop="auditStatus">
					<el-radio-group v-model="auditVerifyForm.auditStatus" @change="addRemarks">
						<el-radio v-for="{ value, label } in optionGenerator(AUDIT_VERIFY, '')" :key="value" :label="value" border>
							{{ label }}
						</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="审核意见" prop="remarks">
					<el-input
						placeholder="请输入审核不通过的原因"
						:disabled="auditVerifyForm.auditStatus == 1"
						:autosize="{ minRows: 4, maxRows: 4 }"
						maxlength="1000"
						show-word-limit
						type="textarea"
						v-model="auditVerifyForm.remarks"
					></el-input>
				</el-form-item>
				<el-form-item label="附件">
					<p>支持格式jpg、png，最大10M，最多可以上传3张图片</p>
					<el-upload
						ref="elUpload"
						:action="uploadData.actionUrl"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						list-type="picture-card"
						:limit="3"
						:before-upload="beforeAvatarUpload"
						:on-success="handleSuccess1"
						:on-preview="handPreview"
						:on-remove="handleRemove"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
				<div v-if="auditVerifyForm.auditStatus != 2">
					<div v-if="auditVerifydialog.type == 'verify' && returnGoodInfo.orderReturn.returnExpressType == 1">
						<el-form-item label="运费补贴" prop="subsidyFreight">
							<el-input v-model="auditVerifyForm.subsidyFreight"></el-input>
						</el-form-item>
					</div>
				</div>
			</el-form>
			<div slot="footer" class="flex footer">
				<el-button class="cancelBtn" @click="closeVerifyFormDialog">取 消</el-button>
				<el-button type="primary" @click="isSaveVerifyFormDialog">保 存</el-button>
			</div>
		</el-dialog>
		<!-- 验证审核确认 -->
		<el-dialog class="edittitle" title="验货审核确认" :visible.sync="auitDialogEnter.show" v-drag>
			<div class="margin10 fonst20_weight">{{ auitDialogEnter.title }}</div>
			<el-form label-width="140px" label-suffix=":">
				<el-form-item label="退货单号">
					{{ returnGoodInfo.orderReturn.returnNo }}
				</el-form-item>
				<el-form-item label="订单号">
					{{ returnGoodInfo.orderReturn.orderNo }}
				</el-form-item>
				<el-form-item label="审核结果">
					{{ AUDIT_VERIFY[auditVerifyForm.auditStatus] }}
				</el-form-item>
				<el-form-item label="审核意见">
					{{ auditVerifyForm.remarks }}
				</el-form-item>
				<el-form-item
					label="运费补贴"
					v-if="
						auditVerifyForm.subsidyFreight &&
						auditVerifyForm.auditStatus == 1 &&
						returnGoodInfo.orderReturn.returnExpressType == 1
					"
				>
					{{ auditVerifyForm.subsidyFreight }}
				</el-form-item>
				<el-form-item label="附件">
					<el-image
						v-for="(item, index) in auditVerifyForm.attachmentUrlList"
						:key="index"
						style="width: 100px; height: 100px; margin-left: 10px"
						:src="item"
						@click="lookPicture(item)"
					></el-image>
				</el-form-item>
			</el-form>
			<div slot="footer" class="flex footer">
				<el-button class="cancelBtn" @click="auitDialogEnter.show = false">取 消</el-button>
				<el-button type="primary" @click="enterVerifyFormDialog">保 存</el-button>
			</div>
		</el-dialog>
		<!-- 退回物流 -->
		<el-dialog title="退回物流" :visible.sync="logisticsShow" v-drag>
			<el-form
				:model="logisticsForm"
				:rules="LOGISTICSFORM_RULES"
				ref="logisticsForm"
				label-width="120px"
				class="demo-ruleForm"
			>
				<el-form-item label="交付方式：" prop="returnExpressType" label-width="120px">
					<el-radio-group v-model="logisticsForm.returnExpressType">
						<el-radio :label="1">物流配送</el-radio>
						<el-radio :label="2">顾客自带</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item
					label="物流公司："
					prop="returnExpressName"
					label-width="120px"
					v-if="logisticsForm.returnExpressType == 1"
				>
					<el-input v-model="logisticsForm.returnExpressName"></el-input>
				</el-form-item>
				<el-form-item
					label="物流单号："
					prop="returnExpressNo"
					label-width="120px"
					v-if="logisticsForm.returnExpressType == 1"
				>
					<el-input v-model="logisticsForm.returnExpressNo"></el-input>
				</el-form-item>
				<el-form-item label="退回凭证：" label-width="120px" v-if="logisticsForm.returnExpressType == 1">
					<el-upload
						:action="uploadData.actionUrl"
						:headers="$store.getters['system/getSignatureVerification']"
						list-type="picture-card"
						:on-preview="handPreview"
						:on-remove="handleRemove"
						:on-success="handleSuccess2"
						:file-list="fileList"
						:limit="3"
						:data="uploadData"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="flex footer">
				<el-button @click="cancelLogisticsForm">取 消</el-button>
				<el-button type="primary" @click="saveLogisticsForm">保存并确认退回</el-button>
			</div>
		</el-dialog>
		<!-- 查看图片 -->
		<el-dialog :visible.sync="previewObj.visible" append-to-body v-drag>
			<img width="100%" :src="previewObj.url" alt />
		</el-dialog>
		<!-- 添加/编辑 审核意见  -->
		<el-dialog :title="ideaDialog.title" :visible.sync="ideaDialog.show" width="50%" v-drag>
			<el-form ref="ideaForm" :rules="IDEA_RULES" :model="ideaForm" label-width="140px" label-suffix=":">
				<el-form-item label="退货单号">
					{{ $route.query.returnNo }}
				</el-form-item>
				<el-form-item label="订单号">
					{{ returnGoodInfo.order.orderNo }}
				</el-form-item>
				<el-form-item label="审批意见" prop="comment">
					<el-input type="textarea" :rows="4" v-model="ideaForm.comment"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="footer flex">
				<el-button @click="cancelIdea">取 消</el-button>
				<el-button type="primary" @click="saveIdea">保 存</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { formatDate, formatDateStr } from '@/util/formValidation';
import { optionGenerator } from 'util';

import {
	LOGISTICSFORM_RULES,
	AUDIT_VERIFY_DIALOG_RULES,
	AUDIT_VERIFY,
	APPLYSOURCE,
	CUSTOMERTYPE,
	EXPRESSTYPE,
	INVOICESTATUS,
	INVOICETYPE,
	PAYTYPE,
	MONENY_FILTER_ARR,
	ORDER_RETURN_GOODS_COLUMS,
	IDEA_RETURN_GOODS_COLUMS,
	HANDLE_RETURN_GOODS_COLUMS,
	IDEA_RULES,
} from './config';
export default {
	name: 'returnGoodsDetails',
	data() {
		return {
			LOGISTICSFORM_RULES,
			INVOICESTATUS,
			INVOICETYPE,
			APPLYSOURCE,
			AUDIT_VERIFY_DIALOG_RULES,
			ORDER_RETURN_GOODS_COLUMS,
			HANDLE_RETURN_GOODS_COLUMS,
			IDEA_RETURN_GOODS_COLUMS,
			IDEA_RULES,
			CUSTOMERTYPE,
			EXPRESSTYPE,
			AUDIT_VERIFY,
			PAYTYPE,
			returnGoodInfo: {
				orderReturn: {},
				order: {},
				orderInvoice: {},
				orderReturnProducts: [],
				orderServiceLogs: [],
				orderServiceComments: [],
			},
			reasonForm: {
				reason1: '',
				reason1Remark: '',
				reason2: '',
				reason2Remark: '',
			},
			isActive: 1,
			timeMessage: '',
			companyStep: [
				// 公司交付进度条数据
				{
					statusDesc: '提交退货单',
				},
				{
					statusDesc: '分公司审核',
				},
				{
					statusDesc: '顾客退回',
				},
				{
					statusDesc: '分公司验货',
				},
				{
					statusDesc: '完成',
				},
			],
			resultStep: [],
			logisticsShow: false, //是否显示退回物流弹窗
			previewObj: {
				// 显示图片
				url: '',
				visible: false,
			},
			fileList: [],
			logisticsForm: {
				// 退回物流表单数据
				returnExpressType: 1,
				returnExpressName: '',
				returnExpressNo: '',
				attachmentUrlList: [],
			},
			uploadData: {
				storageType: this.$config.OSS_UPLOAD_TYPE, // 存储类型（目前支持的类型:FastDFS）
				clientKey: this.$config.CLIENT_KEY.order, // 客户端Key(由管理员进行分配)
				actionUrl: this.$store.getters['system/getOssUploadUrl'],
			},
			auditVerifydialog: {
				// 审核 audit / 验货 verify
				title: '',
				show: false,
				type: '',
			},
			auditVerifyForm: {
				// 退货审核 / 验证审核 form
				auditStatus: '1', //审核状态 1->通过 2->不通过
				remarks: '同意', // 审核意见
				attachmentUrlList: [], // 核附件URL列表
				subsidyFreight: '', // 运费补贴
			},
			// 确认验证审核
			auitDialogEnter: {
				show: false,
				title: '',
			},
			reasonDict: [],
			reasonDict2: [],
			ideaDialog: {
				show: false,
				title: '',
			},
			ideaForm: {
				comment: '',
				id: '',
			},
		};
	},
	watch: {
		'logisticsForm.returnExpressType': function (newValue) {
			if (newValue == 2) {
				// 切换就清空数据
				this.logisticsForm = {
					// 退回物流表单数据
					returnExpressType: newValue,
					returnExpressName: '',
					returnExpressNo: '',
					attachmentUrlList: [],
				};
			}
		},
		'auditVerifyForm.auditStatus': function (newValue) {
			if (newValue == 2) {
				this.auditVerifyForm = {
					...this.auditVerifyForm,
					remarks: '',
					subsidyFreight: '', //运费补贴
				};
			}
			if (newValue == 1) {
				this.getAuditVerifyForm();
			}
			this.auitDialogEnter = {
				...this.auitDialogEnter,
				title: newValue == 1 ? '确认后，则退款成功' : '验货失败，请核实库存',
			};
		},
		'reasonForm.reason1Id': function (newValue) {
			if (newValue && this.reasonDict.length) {
				let obj = this.reasonDict.find(item => item.id === newValue);
				if (!obj) return;
				this.reasonDict2 = obj.reasonList;
				this.reasonForm.reason1 = obj.returnReason;
			}
		},
		'reasonForm.reason2Id': function (newValue) {
			this.reasonForm.reason2 = this.reasonDict2?.find(item => item.id === newValue)?.returnReason;
		},
	},
	filters: { formatDateStr },
	computed: {
		takeStep() {
			const { applySource } = this.returnGoodInfo.orderReturn;
			return [
				{
					statusDesc: '等待审核',
				},
				{
					statusDesc: applySource == 0 ? '公司审核' : '店铺审核',
				},
				{
					statusDesc: '完成',
				},
			];
		},
		showReason: ({ returnGoodInfo }) => {
			const { returnStatus, applySource, expressType, isStoreClosed } = returnGoodInfo.orderReturn;
			if (returnStatus == 1 && applySource != 0) {
				console.log(expressType, isStoreClosed);
				return expressType == 2 || (expressType == 1 && isStoreClosed == 1);
			}
			return false;
		},
	},
	methods: {
		// 保存 退货原因
		saveReason() {
			this.$refs['reasonForm'].validate(async valid => {
				if (valid) {
					const { returnNo } = this.$route.query;
					let obj = {
						method: 'POST',
						url: '/mgmt/order/return/updateOrderReturn',
						data: { ...this.reasonForm, returnNo },
					};
					let res = await this.$fetch(obj);
					if (res?.code == 200) {
						this.getReturnGoodsDetails();
						this.$message.success(res.message);
					}
				}
			});
		},
		// 发起退款
		async initiateRefund() {
			this.$confirm('重新发起退款，提交后不可修改。', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					const { returnNo } = this.$route.query;
					let obj = {
						method: 'POST',
						url: '/mgmt/order/return/refund',
						params: {
							returnNo, //退货单号
						},
					};
					let res = await this.$fetch(obj);
					if (res.code == 200) {
						this.$message.success(res.message);
						this.getReturnGoodsDetails();
					} else if (this.$store.getters['system/getError']) {
						this.$message.error(res.message);
					}
				})
				.catch(() => {});
		},
		goOrderInfo(orderNo) {
			if (!orderNo) return;
			this.$go('customer_order_detail', { title: '顾客订单详情', orderNo: orderNo });
		},
		addRemarks() {
			this.auditVerifyForm.remarks = this.auditVerifyForm.auditStatus == 1 ? '同意' : '';
			this.$refs.auditVerifyForm.clearValidate();
		},
		// 选的时候清空
		clearReason2Id() {
			this.reasonDict2 = [];
			this.reasonForm.reason2Id = '';
			this.reasonForm.reason2 = '';
		},
		optionGenerator,
		lookPicture(url) {
			this.previewObj = {
				url,
				visible: true,
			};
		},
		// 是否打开确认审核
		isSaveVerifyFormDialog() {
			this.$refs['auditVerifyForm'].validate(valid => {
				if (valid) {
					const { auditStatus, subsidyFreight } = this.auditVerifyForm;
					const { returnExpressType } = this.returnGoodInfo.orderReturn;
					if (this.auditVerifydialog.type == 'verify') {
						if (auditStatus == 1 && subsidyFreight && returnExpressType == 1) {
							if (subsidyFreight < 1 || subsidyFreight > 500) {
								return this.$message.warning('运费补贴的范围只能在1-500之间!');
							}
							if (!Number(subsidyFreight)) {
								return this.$message.warning('请输入正确的数字');
							} else {
								const reg = /[.]/;
								if (reg.test(subsidyFreight)) {
									return this.$message.warning('请输入整数');
								}
							}
						}
						this.auitDialogEnter.show = true;
					} else {
						this.enterVerifyFormDialog();
					}
				}
			});
		},
		async getReturnGoodsDetails() {
			const { returnNo } = this.$route.query;
			let obj = {
				method: 'GET',
				url: '/mgmt/order/return/getOrderReturnDetails',
				params: {
					returnNo, //退货单号
				},
			};
			let res = await this.$fetch(obj);
			if (res.code == 200) {
				this.returnGoodInfo = res.data;
				const { statusChangeInfos, orderReturn, order, orderInvoice } = res.data;
				// 数据 处理
				[order, orderInvoice].forEach(item => {
					for (const key in item) {
						if (!item[key]) {
							item[key] = '--';
						} else {
							// 金钱格式化
							if (MONENY_FILTER_ARR.includes(key)) {
								item[key] = '￥' + Number(item[key]).toFixed(2);
							}
							// 添加百分比
							if (key == 'returnRate') {
								item[key] = item[key] * 100 + '%';
							}
						}
					}
				});
				// 审核赋值
				this.getAuditVerifyForm();
				// 步骤条处理
				this.disposeStep(statusChangeInfos, orderReturn);
				let date =
					orderReturn.expressType == 2
						? orderReturn.returnDeadline - Date.parse(new Date())
						: orderReturn.auditDeadline - Date.parse(new Date());
				this.timeMessage = '';
				// 时间处理
				if (date > 0) {
					this.countdown(
						date,
						orderReturn.returnStatus,
						orderReturn.expressType,
						orderReturn.orderDeliverStatus,
						orderReturn.returnType
					);
				}
			}
		},
		// 打开 退货审核 / 验证审核
		auditVerifyGodds(type) {
			this.auditVerifydialog = {
				title: type == 'audit' ? '退货审核' : '验货审核',
				show: true,
				type,
			};
		},
		// 审核赋值
		getAuditVerifyForm() {
			const { reason1Id, reason1Remark, reason1, reason2Id, reason2Remark, reason2 } = this.returnGoodInfo.orderReturn;
			this.reasonForm = {
				reason1Id,
				reason1Remark,
				reason1,
				reason2Id,
				reason2Remark,
				reason2,
			};
		},
		// 步骤条处理
		disposeStep(statusChangeInfos, orderReturn) {
			// 已完成/已取消/已拒绝 用后台返回
			if ([97, 98, 99].includes(orderReturn.returnStatus)) {
				this.resultStep = statusChangeInfos;
			}
			// 代客售后 总公司代客售后，流程为：提交--公司审核--完成
			else if (orderReturn.applySource == 0) {
				this.resultStep = this.takeStep;
			}
			// applySource==1(或2)，用户/公司申请售后
			else {
				if (orderReturn.expressType == 1 && orderReturn.isStoreClosed == 0) {
					// 提交--店铺审核--完成
					this.resultStep = this.takeStep;
				} else {
					// 提交--公司审核--退回--验货--完成
					this.resultStep = this.companyStep;
				}
			}
			// 步骤条
			statusChangeInfos.forEach((item, index) => {
				this.isActive = index + 1;
				this.resultStep[index] = {
					serviceStatus: item.serviceStatus,
					createTime: formatDate(item.createTime),
					statusDesc: item.statusDesc ? item.statusDesc : this.resultStep[index].statusDesc,
					operator: item.operator,
				};
			});
		},
		// 时间处理 status是状态 type是自提/公司交付 orderDeliver是是否发货 returnType == 1当月退货
		countdown(date, status, type, orderDeliver, returnType) {
			if (date) {
				let hr;
				let min;
				const newDate = date / 1000;
				const day = parseInt(newDate / 3600 / 24);
				const hour = parseInt((newDate / 3600) % 24);
				if (hour < 0) {
					return;
				}
				const minute = parseInt((newDate - parseInt(newDate / 3600) * 3600) / 60);
				let dayStr = '';
				hr = hour > 9 ? hour : '0' + hour;
				min = minute > 9 ? minute : '0' + minute;
				console.log(parseInt(newDate / 3600), 'hour');
				if (day) {
					dayStr = day + '天';
				}
				// 自提 && 待审核的时候
				if (type == 1 && status == 1) {
					//未发货 && 当月退货
					const after = orderDeliver == 0 && returnType == 1 ? '超时自动通过' : '超时自动取消';
					this.timeMessage = `剩余：${dayStr}${hr}小时${min}分钟，${after}`;
					return;
				}
				// 配送 && 待退回的时候
				if (type == 2 && status == 2) {
					this.timeMessage = `剩余：${dayStr}${hr}小时${min}分钟，超时自动取消`;
					return;
				}
				this.timeMessage = '';
			}
		},
		// 取消退货申请
		cancelRetuenGoodsApply() {
			this.$confirm('确定取消退货吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			}).then(async () => {
				const { returnNo } = this.$route.query;
				let obj = {
					method: 'POST',
					url: '/mgmt/order/return/cancelOrderReturn',
					params: {
						returnNo,
					},
				};
				let res = await this.$fetch(obj);
				if (res) {
					this.$message({
						type: 'success',
						message: '取消成功!',
					});
					this.getReturnGoodsDetails();
				}
			});
		},
		//撤销审核事件
		cancelOrderReturnAudit() {
			const { returnNo } = this.$route.query;
			this.$confirm('确定撤销审核?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			}).then(async () => {
				let obj = {
					method: 'POST',
					url: '/mgmt/order/return/cancelOrderReturnAudit',
					params: {
						returnNo,
					},
				};
				let res = await this.$fetch(obj);
				if (res) {
					this.$message({
						type: 'success',
						message: '撤销成功!',
					});
					this.getReturnGoodsDetails();
				}
			});
		},
		//保存退回物流
		saveLogisticsForm() {
			const { returnNo } = this.$route.query;
			this.$refs['logisticsForm'].validate(async valid => {
				if (valid) {
					let obj = {
						method: 'POST',
						url: '/mgmt/order/return/returnGoods',
						data: {
							serviceNo: returnNo,
							...this.logisticsForm,
						},
					};
					let res = await this.$fetch(obj);
					if (res) {
						this.$message({
							type: 'success',
							message: '提交成功!',
						});
						this.logisticsShow = false;
						this.getReturnGoodsDetails();
					}
				}
			});
		},
		// 取消退回物流
		cancelLogisticsForm() {
			this.logisticsShow = false;
			this.$refs.logisticsForm.resetFields();
		},
		// 编辑/更新退回物流
		editLogisticsShow() {
			const { returnExpressNo, returnExpressName, goodsReturnAttachmentUrls } = this.returnGoodInfo.orderReturn;
			this.logisticsForm = {
				...this.logisticsForm,
				returnExpressNo,
				returnExpressName,
				attachmentUrlList: goodsReturnAttachmentUrls,
			};
			this.fileList = goodsReturnAttachmentUrls.map(item => ({ name: '', url: item }));
			this.logisticsShow = true;
		},
		// 上传前校验
		beforeAvatarUpload(file) {
			const isIMG = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
			const isLt10M = file.size / 1024 / 1024 < 10;
			if (!isIMG) {
				this.$message.error('只支持jpg和png');
			}
			if (!isLt10M) {
				this.$message.error('文件大小超过限制');
			}
			return isIMG && isLt10M;
		},
		//查看文件
		handPreview(file) {
			this.previewObj = {
				url: file.url,
				visible: true,
			};
		},
		//文件上传公共
		handleSuccess1(res, file, fileList) {
			if (res.success) {
				let list = fileList.map(x => {
					return {
						name: x.name,
						status: x.status,
						uid: x.uid,
						url: x.response.datas.fileUrlKey,
					};
				});
				this.auditVerifyForm.attachmentUrlList = list.map(x => x.url);
			}
		},
		handleSuccess2(res, file, fileList) {
			if (res.success) {
				let list = fileList.map(x => {
					return {
						name: x.name,
						status: x.status,
						uid: x.uid,
						url: x.response.datas.fileUrlKey,
					};
				});

				this.logisticsForm.attachmentUrlList = list.map(x => x.url);
			}
		},
		//文件列表移除文件时的钩子
		handleRemove(file, fileList) {
			this.logisticsForm.attachmentUrlList = fileList.map(x => x.url);
			this.auditVerifyForm.attachmentUrlList = fileList.map(x => x.url);
		},
		// dialog 取消
		closeVerifyFormDialog() {
			this.$refs.elUpload.clearFiles(); // * 清空上传图片
			this.$refs['auditVerifyForm'].resetFields();
			this.auditVerifydialog.show = false;
		},
		// 成功展示
		async enterVerifyFormDialog() {
			const { returnNo } = this.$route.query;
			// 审核 audit / 验货 verify
			const url =
				this.auditVerifydialog.type == 'audit'
					? '/mgmt/order/return/auditOrderReturn'
					: '/mgmt/order/return/auditGoods';

			const form =
				this.auditVerifydialog.type == 'audit' ? { ...this.auditVerifyForm, ...this.reasonForm } : this.auditVerifyForm;

			const data = {
				serviceNo: returnNo,
				...form,
			};
			const obj = {
				method: 'POST',
				url,
				data,
			};
			let res = await this.$fetch(obj);
			if (res?.code == 200) {
				this.auitDialogEnter.show = false;
				this.closeVerifyFormDialog();
				this.getReturnGoodsDetails();
			}
		},
		// 同意退款
		enterRetuen() {
			this.$confirm('此操作将同意退款, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				this.enterRetuenRequest();
			});
		},
		async enterRetuenRequest() {
			const { returnNo } = this.$route.query;
			const data = {
				serviceNo: returnNo,
				auditStatus: '1', //审核状态 1->通过 2->不通过
				remarks: '同意退款', // 审核意见
			};
			const obj = {
				method: 'POST',
				url: '/mgmt/order/return/auditOrderReturn',
				data,
			};
			let res = await this.$fetch(obj);
			if (res?.code == 200) {
				this.getReturnGoodsDetails();
			}
		},
		// 获取下拉框
		async getSelectList() {
			let obj = {
				method: 'GET',
				url: `sys/api/getAllReturnReasonByType`,
				params: {
					returnType: 1, // 退货审核 1 退货审核 2
				},
			};
			let res = await this.$fetch(obj);
			if (res.data && res.code == 200) {
				this.reasonDict = res.data;
			}
		},
		// 取消添加意见
		cancelIdea() {
			this.$refs['ideaForm'].clearValidate();
			this.ideaDialog.show = false;
		},
		// 添加/删除/编辑
		ideaOperate(type, row) {
			if (type == 'del') {
				this.$confirm('此操作将删除该审核意见, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(async () => {
					//删除留言
					let obj = {
						method: 'POST',
						url: '/mgmt/order/return/delComment',
						params: {
							commentId: row.id,
						},
					};
					let res = await this.$fetch(obj);
					if (res) {
						this.$message({
							type: 'success ',
							message: '删除成功',
						});
						this.getReturnGoodsDetails();
					}
				});
			}
			if (type == 'edit') {
				this.ideaForm = { ...row };
				this.ideaDialog = {
					title: '编辑审批意见',
					show: true,
				};
			}
			if (type == 'add') {
				this.ideaForm = {
					comment: '',
					id: '',
				};
				this.ideaDialog = {
					title: '新增审批意见',
					show: true,
				};
			}
		},
		// 保存添加意见
		async saveIdea() {
			this.$refs['ideaForm'].validate(async valid => {
				if (valid) {
					const { returnNo } = this.$route.query;
					let obj = {
						method: 'POST',
						url: '/mgmt/order/return/saveComment',
						data: {
							serviceNo: returnNo, //退货单号
							...this.ideaForm,
						},
					};
					let res = await this.$fetch(obj);
					if (res) {
						this.$message({
							type: 'success ',
							message: this.ideaForm.id ? '修改成功' : '添加成功',
						});
						this.getReturnGoodsDetails();
						this.cancelIdea();
					}
				}
			});
		},
	},
	async mounted() {
		await this.getSelectList();
		this.getReturnGoodsDetails();
	},
};
</script>
<style lang="scss" scoped>
.edittitle {
	::v-deep .el-dialog__title {
		font-weight: bold;
	}
}
::v-deep .el-dialog__body {
	overflow-y: auto;
	max-height: 520px;
}
::v-deep .el-card__header {
	font-weight: bold;
}
.return-goods-details {
	.titleMoney {
		font-size: 14px;
		font-weight: normal;
		padding-left: 10px;
	}
	.blue {
		cursor: pointer;
		color: #1b7eda;
	}
	.marginT10 {
		margin-top: 10px;
	}
	.marginL10 {
		margin-left: 10px;
	}
	.marginR10 {
		margin-right: 10px;
	}
	.marginB10 {
		margin-bottom: 10px;
	}
	.flex {
		display: flex;
	}
	.itemC {
		align-items: center;
	}
	.paddingNone {
		padding: 0;
	}
	.footer {
		justify-content: flex-end;
		padding-bottom: 20px;
		.cancelBtn {
			margin-right: 5px;
		}
	}
	.flex-direction {
		flex-direction: column;
	}
	.flex-align {
		align-items: center;
	}
	.margin10 {
		margin: 10px 0;
	}
	.fonst20_weight {
		font-size: 20px;
		font-weight: bold;
	}
	.red {
		color: #fe5353;
	}
	.flexone {
		flex: 1;
	}
	.images {
		width: 50px;
		height: 50px;
		margin-left: 10px;
	}
	.padding10 {
		padding: 10px 0;
	}
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
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
	// 数据详情
	.return-ticket-info {
		.row {
			width: 25%;
			.lineFeed {
				margin-right: 20px;
				line-height: 20px;
			}
			div {
				padding: 10px 0;
			}
		}
		h4 {
			font-weight: bold;
			padding: 15px 0;
		}
	}
}
</style>
