<template>
	<div class="exchange-goods-details">
		<guideBar></guideBar>
		<!-- 审批流程 -->
		<el-card>
			<div class="audit-flow">
				<div class="audit-flow-header flex">
					<div>换货单号：{{ exchangeGoodInfo.orderExchange.exchangeNo }}</div>
					<div class="orderNo">
						订单号：

						<span class="blue" @click="goOrderInfo(exchangeGoodInfo.orderExchange.orderNo)">
							{{ exchangeGoodInfo.orderExchange.orderNo }}
						</span>
					</div>
					<div class="orderNo">交付方式：{{ exchangeGoodInfo.orderExchange.expressTypeDesc }}</div>
					<div class="orderNo" v-if="exchangeGoodInfo.orderExchange.exchangeType">
						换货方式：{{ EXCHANGETYPE[exchangeGoodInfo.orderExchange.exchangeType] }}
					</div>
					<div class="orderNo">申请来源：{{ exchangeGoodInfo.orderExchange.applySourceDesc }}</div>
				</div>
				<div class="audit-flow-content flex">
					<div class="audit-flow-left">
						<div
							class="audit-flow-status"
							:class="{ 'audit-flow-gray': [98, 97].includes(exchangeGoodInfo.orderExchange.exchangeStatus) }"
						>
							{{ exchangeGoodInfo.orderExchange.exchangeStatusDesc }}
						</div>
						<div class="audit-flow-right">
							<!-- 等待审批的时候才出现编辑换货单 -->
							<div v-if="exchangeGoodInfo.orderExchange.exchangeStatus == 1" class="flex flex-direction">
								<el-button class="flexone" v-permission="'exchange_goods_detail_edit'" @click="editExchangeGood">
									编辑
								</el-button>
								<el-button
									:disabled="!exchangeGoodInfo.orderServiceComments.length"
									class="flexone audit marginT10"
									type="primary"
									v-permission="'exchange_goods_detail_audit'"
									@click="auditVerifyGodds('audit')"
								>
									审核
								</el-button>
							</div>
							<p v-if="timeMessage" class="marginB10">{{ timeMessage }}</p>
							<div v-if="exchangeGoodInfo.orderExchange.exchangeStatus == 2" class="flex flex-direction">
								<div>
									退回物流:无
									<el-button type="text" class="margin10" @click="openLogistics('edit')">代客补充物流信息</el-button>
								</div>
								<!-- 等待退回&&先退后换 显示发货物流 -->
								<p
									class="marginT10"
									v-if="
										exchangeGoodInfo.orderExchange.sendExpressType && exchangeGoodInfo.orderExchange.exchangeType == 3
									"
								>
									发货物流:
									<span v-if="exchangeGoodInfo.orderExchange.sendExpressType == 1">
										{{ exchangeGoodInfo.orderExchange.sendExpressNo }}&nbsp;
										{{ exchangeGoodInfo.orderExchange.sendExpressName }}
									</span>
									<span v-else>顾客自提</span>
								</p>
							</div>
							<!-- 待验货/待发货/待确认已完成 -->
							<div v-if="[3, 4, 5, 99].includes(exchangeGoodInfo.orderExchange.exchangeStatus)">
								<!-- 先退后换/代发货 不显示 -->
								<span
									v-if="
										!(
											exchangeGoodInfo.orderExchange.exchangeType == 3 &&
											exchangeGoodInfo.orderExchange.exchangeStatus == 4
										)
									"
								>
									退回物流:
									<span
										v-if="
											exchangeGoodInfo.orderExchange.returnExpressType == 1 &&
											exchangeGoodInfo.orderExchange.returnExpressNo
										"
									>
										{{ exchangeGoodInfo.orderExchange.returnExpressNo }}
									</span>
									<span
										v-if="
											exchangeGoodInfo.orderExchange.returnExpressType == 1 &&
											exchangeGoodInfo.orderExchange.returnExpressName
										"
									>
										{{ exchangeGoodInfo.orderExchange.returnExpressName }}
									</span>
									<span v-if="exchangeGoodInfo.orderExchange.returnExpressType != 1">自带</span>
								</span>
								<!-- 先退后换/代发货 先退后换/待确认 已成功 不显示 -->
								<el-button
									v-if="
										!(
											(exchangeGoodInfo.orderExchange.exchangeType == 3 &&
												exchangeGoodInfo.orderExchange.exchangeStatus == 4) ||
											(exchangeGoodInfo.orderExchange.exchangeType == 1 &&
												exchangeGoodInfo.orderExchange.exchangeStatus == 5) ||
											exchangeGoodInfo.orderExchange.exchangeStatus == 99
										)
									"
									type="text"
									class="margin10"
									v-permission="'exchange_goods_detail_edit_return_flow'"
									@click="editLogisticsShow('edit')"
								>
									编辑
								</el-button>
								<div
									class="flex flex-align marginT10"
									v-if="exchangeGoodInfo.orderExchange.goodsReturnAttachmentUrls.length"
								>
									<div>退回凭证:</div>
									<div v-for="(item, index) in exchangeGoodInfo.orderExchange.goodsReturnAttachmentUrls" :key="index">
										<el-image
											class="images"
											:src="item"
											:preview-src-list="exchangeGoodInfo.orderExchange.goodsReturnAttachmentUrls"
										></el-image>
									</div>
								</div>
								<!-- 运费补贴/发货物流 -->
								<div>
									<!-- 运费补贴 等待公司验货是不显示的 -->
									<p
										class="marginT10"
										v-if="
											exchangeGoodInfo.orderExchange.subsidyFreight &&
											exchangeGoodInfo.orderExchange.exchangeStatus != 3
										"
									>
										运费补贴: ￥{{ exchangeGoodInfo.orderExchange.subsidyFreight }}
									</p>
									<p class="marginT10" v-if="exchangeGoodInfo.orderExchange.sendExpressType">
										发货物流:
										<span v-if="exchangeGoodInfo.orderExchange.sendExpressType == 1">
											{{ exchangeGoodInfo.orderExchange.sendExpressNo }}&nbsp;{{
												exchangeGoodInfo.orderExchange.sendExpressName
											}}
										</span>
										<span v-else>顾客自提</span>
									</p>
								</div>
								<!-- 待发货才会有这个 -->
								<el-button
									v-if="exchangeGoodInfo.orderExchange.exchangeStatus == 4"
									type="primary"
									class="margin10"
									v-permission="'exchange_goods_detail_delivery'"
									@click="openLogistics('deliver')"
								>
									发货
								</el-button>
								<div>
									<el-button
										type="primary"
										v-if="exchangeGoodInfo.orderExchange.exchangeStatus == 3"
										class="margin10"
										v-permission="'exchange_goods_detail_inspect'"
										@click="auditVerifyGodds('verify')"
									>
										验货
									</el-button>
								</div>
							</div>
							<!-- 先换后退/代发货 || 其他/等待退回 -->
							<el-button
								v-if="
									(exchangeGoodInfo.orderExchange.exchangeStatus == 2 &&
										exchangeGoodInfo.orderExchange.exchangeType != 3) ||
									(exchangeGoodInfo.orderExchange.exchangeType == 3 &&
										exchangeGoodInfo.orderExchange.exchangeStatus == 4)
								"
								class="flexone marginT10"
								v-permission="'exchange_goods_detail_reset'"
								@click="cancelOrderExchangeAudit"
							>
								撤销审核
							</el-button>
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
		<!-- 审核意见 -->
		<el-card>
			<div slot="header">
				<span>审核意见</span>
				<el-button
					v-if="exchangeGoodInfo.orderExchange.exchangeStatus == 1"
					class="marginL10"
					type="primary"
					v-permission="'exchange_goods_detail_add_audit_suggestion'"
					@click="ideaOperate('add')"
				>
					添加
				</el-button>
			</div>
			<tableList
				:dataSource="exchangeGoodInfo.orderServiceComments"
				:columns="EXCHANGE_GOODS_SERVICE_COMMENTS"
				slotcontent
			>
				<template slot-scope="scope" v-if="![97, 98, 99].includes(exchangeGoodInfo.orderExchange.exchangeStatus)">
					<el-button
						type="text"
						v-permission="'exchange_goods_detail_edit_audit_suggestion'"
						@click="ideaOperate('edit', scope.data)"
					>
						编辑
					</el-button>
					<el-button
						type="text"
						v-permission="'exchange_goods_detail_delete_audit_suggestion'"
						@click="ideaOperate('del', scope.data)"
					>
						删除
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 退回地址 -->
		<el-card v-if="exchangeGoodInfo.orderExchange.returnAddress">
			<div slot="header">
				<div class="title">退回地址</div>
			</div>
			<div>{{ exchangeGoodInfo.orderExchange.returnAddress }}</div>
		</el-card>
		<!-- 详情 -->
		<!-- <el-card>
			<div class="exchange-ticket-info flex">
				<div class="row">
					<h4>开单信息</h4>
					<div>开单人姓名: {{ exchangeGoodInfo.order.creatorName }}</div>
					<div>开单人卡号: {{ exchangeGoodInfo.order.creatorCard }}</div>
					<div>开单人手机号: {{ exchangeGoodInfo.order.creatorPhone }}</div>
					<h4>顾客信息</h4>
					<div>顾客姓名: {{ exchangeGoodInfo.order.customerName }}</div>
					<div>顾客卡号: {{ exchangeGoodInfo.order.customerCard }}</div>
					<div>顾客手机号: {{ exchangeGoodInfo.order.customerPhone }}</div>
					<div>顾客类型: {{ CUSTOMERTYPE[exchangeGoodInfo.order.customerType] }}</div>
					<h4>送货人信息</h4>
					<div>送货人姓名: {{ exchangeGoodInfo.order.ownerName }}</div>
					<div>送货人卡号: {{ exchangeGoodInfo.order.ownerCard }}</div>
				</div>
				<div class="row">
					<h4>交付方式</h4>
					<div>交付方式: {{ EXPRESSTYPE[exchangeGoodInfo.order.expressType] }}</div>
					<div v-if="exchangeGoodInfo.order.expressType == 1" class="lineFeed">
						自提地址: {{ exchangeGoodInfo.order.receiverAddress }}
					</div>
					<div v-if="exchangeGoodInfo.order.expressType == 1">联系电话: {{ exchangeGoodInfo.order.receiverPhone }}</div>
					<h4>收件人信息</h4>
					<div>收件人: {{ exchangeGoodInfo.order.receiver }}</div>
					<div>收件人手机号: {{ exchangeGoodInfo.order.receiverPhone }}</div>
					<div v-if="exchangeGoodInfo.order.expressType == 2">
						收货地址: {{ exchangeGoodInfo.order.receiverAddress }}
					</div>
					<h4>服务中心&分公司</h4>
					<div v-if="exchangeGoodInfo.order.expressType == 1">
						服务中心/编号: {{ exchangeGoodInfo.order.storeName }} {{ exchangeGoodInfo.order.storeCode }}
					</div>
					<div>分公司/编号: {{ exchangeGoodInfo.order.companyName }} {{ exchangeGoodInfo.order.companyCode }}</div>
				</div>
			</div>
		</el-card> -->
		<!-- 换货信息 -->
		<el-card>
			<div slot="header">
				<div class="title">换货信息</div>
			</div>
			<div v-if="exchangeGoodInfo.orderExchange.reason1Id">
				<span>一级换货原因:</span>
				{{ exchangeGoodInfo.orderExchange.reason1 }}
				<span>补充一级原因:</span>
				{{ exchangeGoodInfo.orderExchange.reason1Remark || '--' }}
			</div>
			<div v-if="exchangeGoodInfo.orderExchange.reason2Id" class="marginT10">
				<span>二级换货原因:</span>
				{{ exchangeGoodInfo.orderExchange.reason2 }}
				<span>补充二级原因:</span>
				{{ exchangeGoodInfo.orderExchange.reason2Remark || '--' }}
			</div>
			<div v-if="exchangeGoodInfo.orderExchange.junkHandleType" class="marginT10">
				旧品处理方式: {{ JUNKHANDLETYPE[exchangeGoodInfo.orderExchange.junkHandleType] }}
			</div>
			<div v-if="exchangeGoodInfo.orderExchange.exchangeType" class="marginT10">
				换货方式: {{ EXCHANGETYPE[exchangeGoodInfo.orderExchange.exchangeType] }}
			</div>
			<div
				class="flex marginT10"
				v-if="exchangeGoodInfo.orderExchange.attachmentUrls && exchangeGoodInfo.orderExchange.attachmentUrls.length"
			>
				<span>换货凭证:</span>

				<el-image
					v-for="(item, index) in exchangeGoodInfo.orderExchange.attachmentUrls"
					:key="index"
					class="images"
					:src="item"
					:preview-src-list="exchangeGoodInfo.orderExchange.attachmentUrls"
				></el-image>
			</div>
		</el-card>
		<!-- 换货产品明细 -->
		<el-card>
			<div slot="header">
				<span>产品明细</span>
			</div>
			<tableList
				:dataSource="exchangeGoodInfo.orderExchangeProducts"
				showSummary
				:columns="EXCHANGE_GOODS_PRODUCTS_COLUMS"
			></tableList>
		</el-card>
		<!-- 操作记录 -->
		<el-card>
			<div slot="header">
				<span>操作记录</span>
			</div>
			<tableList :dataSource="exchangeGoodInfo.orderServiceLogs" :columns="EXCHANGE_GOODS_ORDERSERVICELOGS" slotcontent>
				<template slot-scope="scope" v-if="scope.data.attachmentUrls.length">
					<div v-for="(item, index) in scope.data.attachmentUrls" :key="index">
						<el-button class="marginR10" type="text" @click="lookPicture({ url: item })">附件{{ index + 1 }}</el-button>
					</div>
				</template>
			</tableList>
		</el-card>
		<!-- 查看图片 -->
		<el-dialog :visible.sync="previewObj.visible" append-to-body v-drag>
			<img width="100%" :src="previewObj.url" alt />
		</el-dialog>
		<!-- 添加/编辑 审核意见  -->
		<el-dialog :title="ideaDialog.title" :visible.sync="ideaDialog.show" width="50%" v-drag>
			<el-form ref="ideaForm" :rules="IDEA_RULES" :model="ideaForm" label-width="140px" label-suffix=":">
				<el-form-item label="换货单号">
					{{ exchangeGoodInfo.orderExchange.exchangeNo }}
				</el-form-item>
				<el-form-item label="订单号">
					{{ exchangeGoodInfo.orderExchange.orderNo }}
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
		<!-- 验证审核 -->
		<el-dialog :title="auditVerifydialog.title" :visible.sync="auditVerifydialog.show" v-drag>
			<el-form
				ref="auditVerifyForm"
				:model="auditVerifyForm"
				:rules="AUDIT_VERIFY_DIALOG_RULES"
				label-width="140px"
				label-suffix=":"
			>
				<div class="flex">
					<el-form-item label="换货单号">
						{{ exchangeGoodInfo.orderExchange.exchangeNo }}
					</el-form-item>
					<el-form-item label="订单号">
						{{ exchangeGoodInfo.orderExchange.orderNo }}
					</el-form-item>
				</div>
				<el-form-item label="审核结果" prop="auditStatus">
					<el-radio-group v-model="auditVerifyForm.auditStatus" @change="addRemarks">
						<el-radio v-for="{ value, name } in AUDIT_VERIFY" :key="value" :label="value" border>
							{{ name }}
						</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="审核意见" prop="remarks">
					<el-input
						placeholder="请输入审核不通过的原因"
						:autosize="{ minRows: 4, maxRows: 4 }"
						:disabled="auditVerifyForm.auditStatus == 1"
						maxlength="1000"
						show-word-limit
						type="textarea"
						v-model="auditVerifyForm.remarks"
					></el-input>
				</el-form-item>
				<el-form-item label="附件">
					<p>附件： 支持格式jpg、png，最大10M，最多可以上传3张图片</p>
					<el-upload
						ref="elUpload"
						:action="uploadData.actionUrl"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						list-type="picture-card"
						:limit="3"
						:before-upload="beforeAvatarUpload"
						:on-success="handleSuccess1"
						:on-preview="lookPicture"
						:on-remove="handleRemove"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
				<div v-if="auditVerifyForm.auditStatus != 2">
					<div v-if="auditVerifydialog.type == 'audit'">
						<el-form-item label="一级换货原因" prop="reason1Id">
							<el-select v-model="auditVerifyForm.reason1Id" @change="clearReason2Id">
								<el-option
									v-for="{ returnReason, id } in reasonDict"
									:label="returnReason"
									:value="id"
									:key="id"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="一级换货原因备注" prop="reason1Remark">
							<el-input v-model="auditVerifyForm.reason1Remark" placeholder="补充说明"></el-input>
						</el-form-item>
						<el-form-item label="二级换货原因" prop="reason2Id">
							<el-select v-model="auditVerifyForm.reason2Id" placeholder="请选择活动区域">
								<el-option
									v-for="{ returnReason, id } in reasonDict2"
									:label="returnReason"
									:value="id"
									:key="id"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="二级换货原因备注" prop="reason2Remark">
							<el-input v-model="auditVerifyForm.reason2Remark" placeholder="补充说明"></el-input>
						</el-form-item>
						<el-form-item label="换货方式" prop="exchangeType">
							<el-select v-model="auditVerifyForm.exchangeType" placeholder="请选择换货方式">
								<el-option
									v-for="{ value, label } in optionGenerator(EXCHANGETYPE)"
									:label="label"
									:value="value"
									:key="value"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="旧货处理方式" prop="junkHandleType">
							<el-select v-model="auditVerifyForm.junkHandleType" placeholder="请选择旧货处理方式">
								<el-option
									v-for="{ value, label } in optionGenerator(JUNKHANDLETYPE)"
									:label="label"
									:value="value"
									:key="value"
								></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div v-if="auditVerifydialog.type == 'verify' && exchangeGoodInfo.orderExchange.returnExpressType == 1">
						<el-form-item label="运费补贴" prop="subsidyFreight">
							<div class="flex">
								<el-input style="width: 300px" v-model="auditVerifyForm.subsidyFreight"></el-input>
								<div class="marginL10">顾客填写运费:{{ exchangeGoodInfo.orderExchange.returnFreight }}</div>
							</div>
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
			<el-form label-width="140px" label-suffix=":">
				<el-form-item label="换货单号">
					{{ exchangeGoodInfo.orderExchange.exchangeNo }}
				</el-form-item>
				<el-form-item label="订单号">
					{{ exchangeGoodInfo.orderExchange.orderNo }}
				</el-form-item>
				<el-form-item label="审核结果">
					{{ AUDITVERIFY[auditVerifyForm.auditStatus] }}
				</el-form-item>
				<el-form-item label="审核意见">
					{{ auditVerifyForm.remarks }}
				</el-form-item>
				<el-form-item
					label="运费补贴"
					v-if="
						auditVerifyForm.subsidyFreight &&
						auditVerifyForm.auditStatus == 1 &&
						exchangeGoodInfo.orderExchange.returnExpressType == 1
					"
				>
					{{ auditVerifyForm.subsidyFreight }}
				</el-form-item>
				<el-form-item label="附件" v-if="auditVerifyForm.attachmentUrlList.length">
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
		<el-dialog :title="logistics.title" :visible.sync="logistics.show" v-drag>
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
				<el-form-item
					label="退回凭证："
					label-width="120px"
					v-if="logisticsForm.returnExpressType == 1 && logistics.type == 'edit'"
				>
					<el-upload
						:action="uploadData.actionUrl"
						:headers="$store.getters['system/getSignatureVerification']"
						list-type="picture-card"
						:on-preview="lookPicture"
						:on-remove="handleRemove"
						:on-success="handleSuccess2"
						:file-list="fileList"
						:limit="3"
						:data="uploadData"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
				<el-form-item
					label="运费："
					prop="returnFreight"
					v-if="logisticsForm.returnExpressType == 1 && logistics.type == 'edit'"
				>
					<el-input v-model="logisticsForm.returnFreight"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="flex footer">
				<el-button @click="cancelLogisticsForm">取 消</el-button>
				<el-button type="primary" @click="saveLogisticsForm">{{ logistics.buttonTitle }}</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import {
	EXCHANGETYPE,
	CUSTOMERTYPE,
	JUNKHANDLETYPE,
	EXPRESSTYPE,
	EXCHANGE_GOODS_PRODUCTS_COLUMS,
	EXCHANGE_GOODS_ORDERSERVICELOGS,
	EXCHANGE_GOODS_SERVICE_COMMENTS,
	AUDIT_VERIFY_DIALOG_RULES,
	LOGISTICSFORM_RULES,
	AUDITVERIFY,
	AUDIT_VERIFY,
	ARTICLE_STEPS,
	APPLYSOURCE,
	ARTICLE_STEPS_RIGHT_OFF,
	ARTICLE_STEPS_SWITCH_BACK_FIRST,
	IDEA_RULES,
} from './config';
import { optionGenerator } from 'util';
import { formatDate } from '@/util/formValidation';

export default {
	name: 'exchangeGoodsDetails',
	data() {
		return {
			EXCHANGETYPE,
			APPLYSOURCE,
			EXPRESSTYPE,
			CUSTOMERTYPE,
			JUNKHANDLETYPE,
			AUDITVERIFY,
			EXCHANGE_GOODS_PRODUCTS_COLUMS,
			EXCHANGE_GOODS_ORDERSERVICELOGS,
			EXCHANGE_GOODS_SERVICE_COMMENTS,
			AUDIT_VERIFY_DIALOG_RULES,
			ARTICLE_STEPS,
			ARTICLE_STEPS_RIGHT_OFF,
			ARTICLE_STEPS_SWITCH_BACK_FIRST,
			AUDIT_VERIFY,
			LOGISTICSFORM_RULES,
			IDEA_RULES,
			isActive: 1,
			timeMessage: '',
			resultStep: [],
			uploadData: {
				storageType: this.$config.OSS_UPLOAD_TYPE, // 存储类型（目前支持的类型:FastDFS）
				clientKey: this.$config.CLIENT_KEY.order, // 客户端Key(由管理员进行分配)
				actionUrl: this.$store.getters['system/getOssUploadUrl'],
			},
			exchangeGoodInfo: {
				orderExchange: {},
				order: {},
				orderExchangeProducts: [],
				orderServiceLogs: [],
				orderServiceComments: [],
				statusChangeInfos: [],
			},
			previewObj: {
				// 显示图片
				url: '',
				visible: false,
			},
			ideaDialog: {
				show: false,
				title: '',
			},
			ideaForm: {
				comment: '',
				id: '',
			},
			auditVerifydialog: {
				// 审核 audit / 验货 verify
				title: '',
				show: false,
				type: '',
			},
			auditVerifyForm: {
				// 换货审核 / 验证审核 form
				auditStatus: '1', //审核状态 1->通过 2->不通过
				remarks: '同意', // 审核意见
				attachmentUrlList: [], // 核附件URL列表
				subsidyFreight: '', // 运费补贴
				reason1Id: '', //一级换货原因id
				reason2Id: '', //二级换货原因id
				reason1: '',
				reason2: '',
				reason1Remark: '', //一级换货原因备注
				reason2Remark: '', //二级换货原因备注
				exchangeType: '', // 换货方式
				junkHandleType: '', // 旧货处理方式
			},
			auitDialogEnter: {
				show: false,
			},
			reasonDict: [],
			reasonDict2: [],
			logistics: {
				title: '',
				show: false, //是否显示退回物流弹窗
				type: '',
			},
			logisticsForm: {
				// 退回物流表单数据
				returnExpressType: 1,
				returnExpressName: '',
				returnExpressNo: '',
				attachmentUrlList: [],
				returnFreight: '',
			},
			fileList: [],
		};
	},
	watch: {
		'logisticsForm.returnExpressType': function (newValue) {
			if (newValue == 2) {
				this.logisticsForm = {
					// 退回物流表单数据
					returnExpressType: newValue,
					returnExpressName: '',
					returnExpressNo: '',
					attachmentUrlList: [],
					returnFreight: '',
				};
			}
		},
		'auditVerifyForm.auditStatus': function (newValue) {
			if (newValue == 2) {
				this.auditVerifyForm = {
					...this.auditVerifyForm,
					remarks: '',
					reason1Id: '', //一级换货原因id
					reason1Remark: '', //一级换货原因备注
					reason1: '',
					reason2: '',
					reason2Id: '', //二级换货原因id
					reason2Remark: '', //二级换货原因备注
					subsidyFreight: '', //运费补贴
					exchangeType: '', // 换货方式
					junkHandleType: '', // 旧货处理方式
				};
			}
			if (newValue == 1) {
				this.getAuditVerifyForm();
			}
		},
		'auditVerifyForm.reason1Id': function (newValue) {
			if (newValue && this.reasonDict.length) {
				let obj = this.reasonDict.find(item => item.id === newValue);
				if (!obj) return;
				this.reasonDict2 = obj.reasonList;
				this.auditVerifyForm.reason1 = obj.returnReason;
			}
		},
		'auditVerifyForm.reason2Id': function (newValue) {
			this.auditVerifyForm.reason2 = this.reasonDict2?.find(item => item.id === newValue)?.returnReason;
		},
	},
	methods: {
		goOrderInfo(orderNo) {
			if (!orderNo) return;
			this.$go('customer_order_detail', { title: '顾客订单详情', orderNo: orderNo });
		},
		addRemarks() {
			this.auditVerifyForm.remarks = this.auditVerifyForm.auditStatus == 1 ? '同意' : '';
		},
		clearReason2Id() {
			this.reasonDict2 = [];
			this.auditVerifyForm.reason2Id = '';
			this.auditVerifyForm.reason2 = '';
		},
		optionGenerator,
		// 查看图片
		lookPicture({ url }) {
			this.previewObj = {
				url,
				visible: true,
			};
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
						this.getExchangeGoodsDetails();
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
		// 编辑换货单
		editExchangeGood() {
			const { exchangeNo } = this.$route.query;
			this.$go('edit_exchange_order_details', { exchangeNo });
		},
		// 保存添加意见
		async saveIdea() {
			this.$refs['ideaForm'].validate(async valid => {
				if (valid) {
					const { exchangeNo } = this.$route.query;
					let obj = {
						method: 'POST',
						url: '/mgmt/order/return/saveComment',
						data: {
							serviceNo: exchangeNo, //换货单号
							...this.ideaForm,
						},
					};
					let res = await this.$fetch(obj);
					if (res) {
						this.$message({
							type: 'success ',
							message: this.ideaForm.id ? '修改成功' : '添加成功',
						});
						this.cancelIdea();
						this.getExchangeGoodsDetails();
					}
				}
			});
		},
		// 取消添加意见
		cancelIdea() {
			this.$refs['ideaForm'].clearValidate();
			this.ideaDialog.show = false;
		},
		// 打开审核
		auditVerifyGodds(type) {
			this.auditVerifydialog = {
				title: type == 'audit' ? '换货审核' : '验货审核',
				show: true,
				type,
			};
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
		// 是否打开确认审核
		isSaveVerifyFormDialog() {
			this.$refs['auditVerifyForm'].validate(valid => {
				if (valid) {
					const { auditStatus, subsidyFreight } = this.auditVerifyForm;
					const { returnExpressType } = this.exchangeGoodInfo.orderExchange;
					if (this.auditVerifydialog.type == 'verify') {
						// 退回物流非自带 && 审核状态为通过 && 有退货运费的时候
						if (returnExpressType == 1 && auditStatus == 1 && subsidyFreight) {
							// subsidyFreight小于1 || subsidyFreight超过500
							if (subsidyFreight < 1 || subsidyFreight > 500) {
								return this.$message.warning('运费补贴的范围只能在1-500之间!');
							}
							// 非数字提示
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
		// 成功展示
		async enterVerifyFormDialog() {
			const { exchangeNo } = this.$route.query;
			// 审核 audit / 验货 verify
			const url =
				this.auditVerifydialog.type == 'audit'
					? '/mgmt/order/exchange/auditOrderExchange'
					: '/mgmt/order/exchange/auditGoods';
			const data = {
				serviceNo: exchangeNo,
				...this.auditVerifyForm,
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
				this.getExchangeGoodsDetails();
			}
		},
		// 获取下拉框
		async getSelectList() {
			let obj = {
				method: 'GET',
				url: `sys/api/getAllReturnReasonByType`,
				params: {
					returnType: 2, // 换货审核 1 换货审核 2
				},
			};
			let res = await this.$fetch(obj);
			if (res.data && res.code == 200) {
				this.reasonDict = res.data;
			}
		},
		//取消换货申请接口
		async cancelOrderExchangeAudit() {
			this.$confirm('确定取消审核吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			}).then(async () => {
				const { exchangeNo } = this.$route.query;
				let obj = {
					method: 'POST',
					url: '/mgmt/order/exchange/cancelOrderExchangeAudit',
					params: {
						exchangeNo, //换货单号
					},
				};
				let res = await this.$fetch(obj);
				if (res) {
					this.$message({
						type: 'success',
						message: '申请成功!',
					});
					this.getExchangeGoodsDetails();
				}
			});
		},
		openLogistics(type) {
			this.logistics = {
				title: type == 'edit' ? '退回物流' : '发货物流',
				buttonTitle: type == 'edit' ? '保存并确认退回' : '保存并确认发货',
				show: true,
				type,
			};
		},
		// 取消退回物流
		cancelLogisticsForm() {
			this.logistics.show = false;
			this.$refs.logisticsForm.resetFields();
		},
		//保存退回物流
		saveLogisticsForm() {
			const { exchangeNo } = this.$route.query;
			this.$refs['logisticsForm'].validate(async valid => {
				if (valid) {
					const {
						logisticsForm: { returnFreight, returnExpressType },
						logisticsForm,
						logistics: { type },
					} = this;
					if (returnExpressType == 1 && type == 'edit' && returnFreight) {
						if (returnFreight < 1 || returnFreight > 500) {
							return this.$message.warning('运费补贴的范围只能在1-500之间!');
						}
						if (!Number(returnFreight)) {
							return this.$message.warning('请输入正确的数字');
						}
					}
					let url = type == 'edit' ? '/mgmt/order/exchange/returnGoods' : '/mgmt/order/exchange/sendGoods';
					let data = null;
					if (type == 'edit') {
						data = { serviceNo: exchangeNo, ...logisticsForm };
					} else {
						data = {
							serviceNo: exchangeNo,
							sendExpressName: logisticsForm.returnExpressName,
							sendExpressNo: logisticsForm.returnExpressNo,
							sendExpressType: logisticsForm.returnExpressType,
						};
					}
					let obj = { method: 'POST', url, data };
					let res = await this.$fetch(obj);
					if (res.code == 200) {
						this.$message({
							type: 'success',
							message: '提交成功!',
						});
						this.cancelLogisticsForm();
						this.getExchangeGoodsDetails();
					}
				}
			});
		},
		// 编辑/更新退回物流
		editLogisticsShow(type) {
			const { returnExpressNo, returnExpressName, goodsReturnAttachmentUrls, returnFreight } =
				this.exchangeGoodInfo.orderExchange;
			this.logisticsForm = {
				...this.logisticsForm,
				returnExpressNo,
				returnExpressName,
				returnFreight,
				attachmentUrlList: goodsReturnAttachmentUrls,
			};
			this.fileList = goodsReturnAttachmentUrls.map(item => ({ name: '', url: item }));
			this.openLogistics(type);
		},
		// 步骤条处理
		disposeStep(statusChangeInfos, orderExchange) {
			this.resultStep = [];
			statusChangeInfos.forEach((item, index) => {
				this.isActive = index + 1;
				this.resultStep[index] = {
					serviceStatus: item.serviceStatus,
					createTime: formatDate(item.createTime),
					statusDesc: item.statusDesc,
					operator: item.operator,
				};
			});
			// 步骤条旧数据处理
			if (![97, 98, 99].includes(orderExchange.exchangeStatus)) {
				// 获取后半截数据
				let showStepData = [];
				if (orderExchange.exchangeType === 1) {
					showStepData = this.ARTICLE_STEPS;
				} else if (orderExchange.exchangeType === 2) {
					showStepData = this.ARTICLE_STEPS_RIGHT_OFF;
				} else {
					showStepData = this.ARTICLE_STEPS_SWITCH_BACK_FIRST;
				}
				let endIndex = showStepData.findIndex(item => item.value == orderExchange.exchangeStatus);
				let dataEnd = showStepData.slice(endIndex + 1);
				let allStepData = this.resultStep.concat(dataEnd);
				this.resultStep = allStepData;
			}
		},
		// 时间处理
		countdown(date, exchangeStatus, exchangeType) {
			let hr;
			let min;
			const newDate = date / 1000;
			const day = parseInt(newDate / 3600 / 24);
			const hour = parseInt((newDate / 3600) % 24);
			const minute = parseInt((newDate / 60) % 60);
			if (hour < 0) {
				return;
			}
			hr = hour > 9 ? hour : '0' + hour;
			min = minute > 9 ? minute : '0' + minute;
			let dayStr = '';
			if (day) {
				dayStr = day + '天';
			}
			// 先退后换和秒换 && 待退回
			if (exchangeStatus == 2 && exchangeType != 3) {
				this.timeMessage = `剩余：${dayStr}${hr}小时${min}分钟，超时自动取消`;
				return;
			}
			// 待确认
			if (exchangeStatus == 5) {
				this.timeMessage = `${dayStr}${hr}小时${min}分钟,自动确认`;
				return;
			}
		},
		// 审核赋值
		getAuditVerifyForm() {
			const { reason1Id, reason1Remark, reason1, reason2Id, reason2Remark, reason2 } =
				this.exchangeGoodInfo.orderExchange;
			this.auditVerifyForm = {
				...this.auditVerifyForm,
				reason1Id,
				reason1Remark,
				reason1,
				reason2Id,
				reason2Remark,
				reason2,
			};
		},
		async getExchangeGoodsDetails() {
			const { exchangeNo } = this.$route.query;
			let obj = {
				method: 'GET',
				url: '/mgmt/order/exchange/getOrderExchangeDetails',
				params: {
					exchangeNo, //换货单号
				},
			};
			let res = await this.$fetch(obj);
			if (res.code == 200) {
				this.exchangeGoodInfo = res.data;
				const { order, statusChangeInfos, orderExchange } = res.data;
				// 数据 处理
				for (const key in order) {
					if (!order[key]) {
						order[key] = '--';
					}
				}
				// 审核赋值
				this.getAuditVerifyForm();
				// 步骤条处理
				this.disposeStep(statusChangeInfos, orderExchange);
				const { confirmDeadline, returnDeadline, exchangeStatus, exchangeType } = orderExchange;
				let date =
					exchangeStatus == 5 ? confirmDeadline - Date.parse(new Date()) : returnDeadline - Date.parse(new Date());
				this.timeMessage = '';
				// 时间处理 先退后换和秒换(exchangeType!=3) 待退回(exchangeStatus=2)  ||  待确认(exchangeStatus = 5)
				if (((exchangeStatus == 2 && exchangeType != 3) || exchangeStatus == 5) && date > 0) {
					this.countdown(date, exchangeStatus, exchangeType);
				}
			}
		},
	},
	async mounted() {
		await this.getSelectList();
		this.$listen('updata_exchang_good_details', this.getExchangeGoodsDetails);
		this.getExchangeGoodsDetails();
	},
};
</script>
<style lang="scss" scoped>
.edittitle {
	::v-deep .el-dialog__title {
		font-weight: bold;
	}
}
::v-deep .el-step.is-center .el-step__description {
	padding-left: 10%;
	padding-right: 10%;
}
::v-deep .el-dialog__body {
	overflow-y: auto;
	max-height: 520px;
}
::v-deep .el-card__header {
	font-weight: bold;
}
.exchange-goods-details {
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
	.audit {
		margin-left: 0;
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
	.exchange-ticket-info {
		.row {
			width: 50%;
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
