<template>
	<div class="apply-return">
		<guideBar />
		<el-card class="card">
			<p>
				<span>订单号: {{ orderDetails.orderNo }}</span>
				<span>订单状态: {{ ORDER_STATUS[orderDetails.orderStatus] }}</span>
			</p>
			<article>
				<p>退货须知</p>
				<p>1、退货时，需保证产品的完整性，赠品需随产品一同寄回</p>
				<p>2、退款成功后， 退款金额退回原支付渠道或完美钱包</p>
				<p>3、提交了企业专用纸质发票申请的，需要退回纸质票。</p>
			</article>
		</el-card>
		<el-card class="card">
			<h2>产品明细</h2>
			<tableList
				:data-source="orderProductVos"
				:columns="PRODUCT_DETAILS_COLUMNS"
				show-summary
				:options="{
					index: true,
					labelIndex: '序号',
				}"
			></tableList>
		</el-card>
		<el-card class="card">
			<h2>退货信息</h2>
			<el-form :model="returnInfoForm" ref="returnInfoForm" label-width="140px" label-suffix=":">
				<el-form-item
					label="一级退货原因"
					prop="reason1Id"
					:rules="[{ required: true, message: '请选择一级退货原因', trigger: ['blur', 'change'] }]"
				>
					<el-select
						v-model="returnInfoForm.reason1Id"
						@change="value => handleChange(value, 'reason1')"
						placeholder="请选择"
					>
						<el-option
							v-for="{ returnReason, id } in reasonDict"
							:label="returnReason"
							:value="id"
							:key="returnReason"
							:option="returnReason"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="一级原因备注说明" prop="reason1Remark">
					<el-input type="textarea" style="width: 400px" v-model="returnInfoForm.reason1Remark" />
				</el-form-item>
				<el-form-item
					label="二级退货原因"
					prop="reason2Id"
					:rules="[{ required: true, message: '请选择二级退货原因', trigger: ['blur', 'change'] }]"
				>
					<el-select
						v-model="returnInfoForm.reason2Id"
						placeholder="请选择"
						@change="value => handleChange(value, 'reason2')"
					>
						<el-option
							v-for="({ returnReason, id }, index) in reasonDict2"
							:label="returnReason"
							:value="id"
							:key="index"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="二级原因备注说明" prop="reason2Remark">
					<el-input type="textarea" style="width: 400px" v-model="returnInfoForm.reason2Remark" />
				</el-form-item>
				<el-form-item label="退货金额" prop="rerutnAmount">
					<el-input class="input" v-model="returnInfoForm.rerutnAmount" disabled></el-input>
				</el-form-item>
				<el-form-item label="电子礼券" prop="giftCouponAmount">
					<el-input class="input" v-model="returnInfoForm.giftCouponAmount" disabled></el-input>
				</el-form-item>
				<el-form-item label="扣减积分PV" prop="pv">
					<el-input class="input" v-model="returnInfoForm.pv" disabled></el-input>
				</el-form-item>
				<el-form-item label="扣减运费补贴券" prop="expressSubsidyAmount">
					<el-input class="input" v-model="returnInfoForm.expressSubsidyAmount" disabled></el-input>
				</el-form-item>
			</el-form>
		</el-card>
		<actionBar>
			<template>
				<el-button @click="$closeSelf()">返回</el-button>
				<el-button type="primary" @click="submitApply">提交申请</el-button>
			</template>
		</actionBar>
		<!-- 弹窗开关 -->
		<el-dialog
			center
			:close-on-press-escape="false"
			:show-close="false"
			fullscreen
			:visible.sync="dialogVisible"
			v-drag
		>
			<div class="dialogContent">
				<div class="el-icon-success icon"></div>
				<div class="bigTitle title">申请成功</div>
				<div class="smallTitle title">退货/退款申请提交成功</div>
				<div>
					<el-button @click="dialogEnter('lookInfo')">查看详情</el-button>
					<el-button @click="dialogEnter">返回</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import tableList from 'component/common/tableList';
import { ORDER_STATUS, PRODUCT_DETAILS_COLUMNS } from '../config';
export default {
	name: 'applyReturn',
	data() {
		return {
			ORDER_STATUS,
			PRODUCT_DETAILS_COLUMNS,
			orderDetails: {},
			reasonDict: [],
			reasonDict2: [],
			returnInfoForm: {
				reason1Id: '',
				reason1: '',
				reason1Remark: '',
				reason2: '',
				reason2Id: '',
				reason2Remark: '',
				rerutnAmount: '',
				giftCouponAmount: '',
				pv: '',
				expressSubsidyAmount: '',
			},
			orderProductVos: [],
			dialogVisible: false, // 弹窗开关
		};
	},
	methods: {
		handleChange(value, label) {
			const reasonArr = label === 'reason1' ? this.reasonDict : this.reasonDict2;
			const reason = reasonArr.find(item => item.id === value);
			console.log(reason);
			if (reason) {
				this.returnInfoForm[label] = reason.returnReason;
				if (label === 'reason1') {
					const { reasonList } = reason;
					this.reasonDict2 = reasonList;
				}
			}
		},
		async getReturnReasonByType() {
			const res = await this.$fetch({
				url: '/sys/api/getAllReturnReasonByType',
				params: { returnType: 1 },
			});
			if (res && res.data) {
				this.reasonDict = res.data;
			} else {
				this.$message.error(res.message);
			}
		},
		async loadData() {
			const { orderNo } = this.$route.query;
			const res = await this.$fetch({
				url: `/mgmt/order/orderInfo/${orderNo}`,
			});
			if (res && res.data) {
				const {
					orderInvoiceVo,
					orderProductVos,
					orderStatusChangeVos,
					actuallyAmount,
					giftCouponAmount,
					pv,
					expressSubsidyAmount,
					stockType,
					...orderDetails
				} = res.data;
				this.returnInfoForm = Object.assign({}, this.returnInfoForm, {
					actuallyAmount,
					giftCouponAmount,
					pv,
					expressSubsidyAmount,
					rerutnAmount: stockType == 3 ? 0 : this.rerutnAmount,
				});
				this.orderInvoiceVo = orderInvoiceVo;
				this.orderProductVos = orderProductVos;
				this.orderStatusChangeVos = orderStatusChangeVos;
				this.orderDetails = orderDetails;
			}
		},
		submitApply() {
			this.$refs['returnInfoForm'].validate(async valid => {
				if (valid) {
					console.log(this.returnInfoForm);
					const { orderNo, applySource } = this.$route.query;
					const { reason1Id, reason1, reason1Remark, reason2Id, reason2, reason2Remark } = this.returnInfoForm;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/order/return/applyReturn',
						data: {
							orderNo,
							reason1,
							reason1Id,
							reason1Remark,
							reason2,
							reason2Id,
							reason2Remark,
							applySource: applySource ? applySource : 2,
						},
					});
					if (res && res.code == 200) {
						this.dialogVisible = true;
					}
				}
			});
		},
		// 弹窗查看详情
		dialogEnter(type) {
			const {
				query,
				query: { orderNo },
				path,
			} = this.$route;
			// 查看就跳转到顾客订单详情
			if (type == 'lookInfo') {
				this.$go('customer_order_detail', { title: '顾客订单详情', orderNo });
			}
			// 触发组件更新
			this.$dispatch('RELOAD_CUSTOMER_ORDER_DETAIL');
			// 关闭换货 && 关闭代客售后
			let closeArr = this.$store.getters['system/getCloseTabArr'];
			if (closeArr.length) {
				closeArr.forEach(x => this.$closeSelf(x));
				// 清空需要关闭的数组
				this.$store.commit('system/UPDATA_CLOSE_TAB_ARR', { type: 'clear' });
			}
			// this.dialogVisible = false;
			// 关闭当前页面
			setTimeout(() => {
				this.$closeSelf({ query, path });
			}, 500);
		},
		// 获取金额
		async getMoney() {
			const res = await this.$fetch({
				url: '/mgmt/order/return/calcRefundAmount',
				params: { orderNo: this.$route.query.orderNo },
			});
			if (res && res.data) {
				this.rerutnAmount = res.data;
			}
		},
	},
	async mounted() {
		await this.getMoney();
		this.getReturnReasonByType();
		this.loadData();
		// Promise.all([this.getReturnReasonByType, this.loadData]);
	},
	components: { tableList },
};
</script>

<style lang="scss" scoped>
.apply-return {
	.card {
		margin: 24px 0;
		article {
			color: $color-hit;
			margin-top: 20px;
		}
		p {
			padding: 4px 0;
			> span {
				margin-right: 30px;
			}
		}
	}
	// 弹出窗css
	.dialogContent {
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		top: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		.icon {
			font-size: 120px;
			color: #52c41a;
		}
		.title {
			margin-bottom: 20px;
			color: #909399;
		}
		.bigTitle {
			font-size: 22px;
			font-weight: 800;
			color: #272727;
			margin-top: 10px;
		}
	}
}
.input {
	width: 217px;
}
</style>
