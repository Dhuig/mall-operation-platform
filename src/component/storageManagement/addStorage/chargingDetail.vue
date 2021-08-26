<template>
	<div class="charging-detail">
		<guideBar>
			<el-button type="primary" @click="goToBill" v-if="showEdit" v-permission="'charging_list_detail_edit'">
				修改押货单
			</el-button>
		</guideBar>
		<el-form :inline="true" ref="formRef" label-width="180px" :model="ruleForm" :rules="rules" label-suffix=":">
			<!-- 基本信息 -->
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>基本信息</span>
				</div>
				<el-row class="min-width">
					<el-col :span="8">
						<el-form-item label="服务中心编号">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.storeCode }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="押货单号">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.orderSn }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="押货价合计">
							<span>￥{{ detailInfo.orderVo && detailInfo.orderVo.orderMortgageAmount }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="8">
						<el-form-item label="押货单状态">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.orderStatus | orderStatus }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="押货单来源">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.orderSource | orderSource }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="押货标识">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.orderMark | orderMark }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="修改标记">
							<span>{{ detailInfo.orderVo && (detailInfo.orderVo.editFlag * 1 === 1 ? '已修改' : '未修改') }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8" v-if="type === 'audit'">
						<el-form-item label="提交日期">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.createTime }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width" v-if="type === 'audit'">
					<el-col :span="8">
						<el-form-item label="经办人">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.submitMan }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="经办人编号">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.submitManNo }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="备注">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.remarks }}</span>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="8">
						<el-form-item label="操作时间">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.createTime }}</span>
						</el-form-item>
					</el-col>-->
				</el-row>
				<!-- <el-row
					class="min-width"
					v-if="type==='detail'&&(detailInfo.orderVo&&detailInfo.orderVo.orderSource*1===2&&detailInfo.orderVo.orderStatus * 1 !== 4)"
				>
					<el-col :span="8">
						<el-form-item label="审核人">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.auditMan }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="审核人编号">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.auditManNo }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="审核人结果">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.auditStatus | auditStatus }}</span>
						</el-form-item>
					</el-col>
				</el-row>-->
				<!-- <el-row
					class="min-width"
					v-if="type==='detail'&&(detailInfo.orderVo&&detailInfo.orderVo.orderSource*1===2&&detailInfo.orderVo.orderStatus * 1 !== 4)"
				>
					<el-col :span="8">
						<el-form-item label="审核备注">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.auditRemarks }}</span>
						</el-form-item>
					</el-col>
				</el-row>-->
			</el-card>
			<!-- 押货单详情 -->
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>押货单详情</span>
					<div class="header_title">
						<!-- <span class="left_span" v-if="type === 'audit'">
							<span>可用押货余额:</span>
							<span>{{ ableAmount || 0 }}</span>
						</span>-->
						<span class="left_span">
							<span>可用押货余额:</span>
							<span>￥{{ ableAmount || 0 }}</span>
						</span>
						<span class="right_span">
							<span>当前押货合计:</span>
							<span>￥{{ pledgeTotal || 0 }}</span>
						</span>
					</div>
				</div>
				<el-table :data="detailList" style="width: 100%;" border>
					<el-table-column prop="opt" label="序号" width="80px">
						<template slot-scope="scope">
							<span>{{ scope.$index + 1 }}</span>
						</template>
					</el-table-column>
					<el-table-column label="产品编码" width="180">
						<template slot-scope="scope">
							<span>{{ scope.row.productSecCode || scope.row.productCode }}</span>
						</template>
					</el-table-column>
					<el-table-column label="产品名称">
						<template slot-scope="scope">
							<span>{{ scope.row.productSecName || scope.row.productName }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productPacking" label="规格">
						<template slot-scope="scope">
							<span>{{ detailList[scope.$index].productPacking }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productUnit" label="单位">
						<template slot-scope="scope">
							<span>{{ detailList[scope.$index].productUnit }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productBoxNum" label="装箱数量">
						<template slot-scope="scope">
							<span>{{ detailList[scope.$index].productBoxNum }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productMortgagePrice" label="单价">
						<template slot-scope="scope">
							<span>¥{{ detailList[scope.$index].productMortgagePrice }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productPv" label="PV">
						<template slot-scope="scope">
							<span>{{ detailList[scope.$index].productPv }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productNum" label="押货数">
						<template slot-scope="scope">
							<span>{{ detailList[scope.$index].productNum }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productDeliveredNum" label="已发货数">
						<template slot-scope="scope">
							<span>{{ detailList[scope.$index].productDeliveredNum }}</span>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
			<!-- 发货记录 -->
			<el-card class="box-card" v-if="type === 'detail'">
				<div slot="header" class="clearfix">
					<span>发货记录</span>
				</div>
				<div class="collpase-box">
					<el-collapse v-model="activeName" v-if="list.length > 0">
						<el-collapse-item v-for="(item, index) in list" :key="index" :name="index + 1">
							<template slot="title">
								<div class="head_div">
									<div class="project_name">
										<div>
											<span>发货时间：</span>
											<span>{{ item.deliverTime | format }}</span>
										</div>
										<div>
											<span>预计到货时间：</span>
											<span>{{ item.expectedArrivalTime | estimateTime }}</span>
										</div>
										<div>
											<span>发货单号：</span>
											<span>{{ item.deliverSn }}</span>
										</div>
									</div>
									<div class="total_num">{{ activeName === index + 1 ? '收起' : '展开' }}</div>
								</div>
							</template>
							<!-- 物流信息 -->
							<div class="logistics_box" v-if="[3, 4].includes(detailInfo.orderVo.orderStatus)">
								<div
									class="logistics_item_box"
									v-for="(logisticsItem, key) in item.deliverProcessRecordList"
									:key="key"
								>
									<span>物流单号：{{ logisticsItem[0].logisticsDeliverSn }}</span>
									<div>
										<p v-for="(logistics, key) in logisticsItem" :key="key">
											<span>{{ logistics.happenTime | format }}</span>
											<span>{{ logistics.remark }}</span>
										</p>
									</div>
								</div>
							</div>
							<div style="margin: 25px 0;">
								<el-table border :data="item.deliverItemList" style="width: 100%;">
									<el-table-column prop="opt" label="序号" width="80px">
										<template slot-scope="scope">
											<span>{{ scope.$index + 1 }}</span>
										</template>
									</el-table-column>
									<el-table-column prop="productCode" label="产品编码" width="180">
										<template slot-scope="scope">
											<span>{{ scope.row.productCode }}</span>
										</template>
									</el-table-column>
									<el-table-column prop="productName" label="产品名称">
										<template slot-scope="scope">
											<span>{{ scope.row.productName }}</span>
										</template>
									</el-table-column>
									<el-table-column prop="productPacking" label="规格">
										<template slot-scope="scope">
											<span>{{ scope.row.productPacking }}</span>
										</template>
									</el-table-column>
									<el-table-column prop="productUnit" label="单位">
										<template slot-scope="scope">
											<span>{{ scope.row.productUnit }}</span>
										</template>
									</el-table-column>
									<el-table-column prop="productNum" label="本次发货数">
										<template slot-scope="scope">
											<span>{{ scope.row.productNum }}</span>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</el-collapse-item>
					</el-collapse>
				</div>
			</el-card>
			<!-- 操作记录 -->
			<el-card class="box-card" v-if="type === 'detail'">
				<div slot="header" class="clearfix">
					<span>操作记录</span>
					<span v-if="returnOrderSn" class="relation_order">
						关联单号：
						<el-button type="text" @click="returnInfo">{{ returnOrderSn }}</el-button>
					</span>
				</div>
				<div class="collpase-box">
					<div style="margin: 25px 0;">
						<el-table border :data="editLogList" style="width: 100%;">
							<el-table-column label="序号" width="50px">
								<template slot-scope="scope">
									<span>{{ scope.$index + 1 }}</span>
								</template>
							</el-table-column>
							<el-table-column prop="editMan" label="操作人" min-width="100"></el-table-column>
							<el-table-column prop="editManNo" label="操作人编号" min-width="100"></el-table-column>
							<el-table-column label="操作时间" width="180">
								<template slot-scope="scope">
									<span>{{ timestampFormat(scope.row.createTime) }}</span>
								</template>
							</el-table-column>
							<el-table-column label="操作记录" min-width="250">
								<template slot-scope="scope">
									<p v-for="(item, key) in scope.row.logItems" :key="key">{{ item.allInfo }}</p>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
			</el-card>
			<!-- 审核 -->
			<el-card class="box-card" v-if="type === 'audit'">
				<div slot="header" class="clearfix">
					<span>审核</span>
				</div>
				<el-row class="min-width">
					<el-col :span="8">
						<el-form-item label="审核结果" prop="auditStatus">
							<el-select v-model="ruleForm.auditStatus" size="medium">
								<el-option label="通过" value="1" />
								<el-option label="拒绝" value="0" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="24">
						<el-form-item label="审核备注" prop="auditRemarks">
							<el-input
								type="textarea"
								placeholder="请输入"
								v-model="ruleForm.auditRemarks"
								class="self-width"
								maxlength="100"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-card>
		</el-form>
		<!-- 按钮 -->
		<div class="eidt-btn-footer" v-if="type === 'audit'">
			<div class="eidt-btn-footer-box">
				<el-button type="primary" :loading="submitLoading" @click="handleSave('formRef')">确认</el-button>
				<el-button @click="handleCancel('formRef')">取消</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import { ORDER_SOURCE, ORDER_MARK, AUDITSTATUS, ORDER_STATUS } from './config';
import qs from 'querystring';
import { formatDate, formatDateDefault } from 'util/formValidation';
import { filters } from 'plugins/filters';

export default {
	name: 'chargingDetail',
	data() {
		return {
			activeName: '1',
			type: '', // 页面来源（审核or详情）
			detailList: [], // 押货单详情列表
			list: [], // 发货记录列表
			ruleForm: {
				auditStatus: '', // 审核结果
				auditRemarks: '', // 审核备注
			},
			rules: {
				auditStatus: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
			},
			detailInfo: {
				orderVo: {},
			}, // 详情信息
			editLogList: [], // 操作记录
			returnOrderSn: '', // 关联单号
			// 操作记录修改类型
			editTypeList: {
				1: { name: '增加押货产品：', num: '增加押货数：', diff: '扣减押货余额：' },
				2: { name: '减少押货产品：', num: '减少押货数：', diff: '增加押货余额：' },
				3: { name: '新增押货产品：', num: '新增押货数：', diff: '扣减押货余额：' },
				4: { name: '审核结果：' },
				5: { name: '审核备注：' },
			},
			ableAmount: '', // 押货可用余额
			orderId: '', // 押货单id
			submitLoading: false,
		};
	},
	filters: {
		// 押货单状态
		orderStatus(val) {
			return val in ORDER_STATUS ? ORDER_STATUS[val] : '';
		},
		// 格式时间-时分秒
		format(val) {
			if (!val) return;
			return formatDate(val);
		},
		// 预计到货时间
		estimateTime(val) {
			if (!val) return;
			return formatDateDefault(val);
		},
		// 押货单来源
		orderSource(val) {
			return val in ORDER_SOURCE ? ORDER_SOURCE[val] : '';
		},
		// 押货标识
		orderMark(val) {
			return val in ORDER_MARK ? ORDER_MARK[val] : '';
		},
		// 审核状态
		auditStatus(val) {
			return val in AUDITSTATUS ? AUDITSTATUS[val] : '';
		},
	},
	computed: {
		// 当前押货合计
		pledgeTotal() {
			let total = 0;
			this.detailList
				.map(item => (total += item.productMortgagePrice * item.productNum))
				.reduce((acc, cur) => parseFloat(cur) + acc, 0);
			return total.toFixed(2);
		},
		// 控制修改按钮
		showEdit() {
			if (this.type === 'audit') return false;
			let status = (this.detailInfo.orderVo && this.detailInfo.orderVo.orderStatus) || '';
			if (+status === 2 || +status === 3) return true;
			return false;
		},
	},
	methods: {
		timestampFormat(time) {
			return filters.timestampFormat(time);
		},
		// 确认
		handleSave(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const params = {
						id: this.orderId,
						...this.ruleForm,
					};
					await this.auditOrder(params);
					this.$dispatch('UP_LIST');
					this.$closeSelf();
				} else {
					return false;
				}
			});
		},
		// 取消
		handleCancel(formName) {
			this.$refs[formName].resetFields();
			this.$closeSelf();
		},
		// 去修改押货单
		goToBill() {
			this.$go('update_charging', {
				title: '修改押货单',
				id: this.orderId,
			});
		},
		// 调整押货退货详情
		returnInfo() {
			this.$go('return_exchange_detail', { title: '押货退货详情', orderSn: this.returnOrderSn });
		},
		// 审核押货单接口
		async auditOrder(params) {
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/inventory/order/auditMortgageOrder',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
			this.submitLoading = false;
		},
		// 获取详情信息接口
		async getDetail(params, orderSn) {
			const queryUrl = orderSn
				? `mgmt/inventory/order/getOrderDetailBySn?${qs.stringify(params)}`
				: `/mgmt/inventory/order/getOrderDetail?${qs.stringify(params)}`;
			const res = await this.$fetch(queryUrl);
			if (res) {
				this.detailInfo = res.data;
				this.detailList = res.data.productVoList || [];
				this.list = res.data.deliverRecordList || [];
				// 如果详情接口返回押货单id那么重置
				res.data.orderVo.id && (this.orderId = res.data.orderVo.id);
				const params = {
					storeCode: (res.data && res.data.orderVo.storeCode) || '',
				};
				// 操作记录
				let editLogList = res.data.editLogList;
				editLogList.forEach(v => {
					// 操作记录内容
					v.logItems.forEach(k => {
						let allInfo = '';
						if (![4, 5].includes(k.editType)) {
							allInfo = `${this.editTypeList[k.editType].name}${k.productName}， ${this.editTypeList[k.editType].num}${
								k.productDiffNum
							}， ${this.editTypeList[k.editType].diff}￥${k.mortgageAmountDiff || ''}`;
						} else {
							allInfo = `${this.editTypeList[k.editType].name}${k.desc}`;
						}
						k.allInfo = allInfo;
					});
				});
				this.editLogList = editLogList;
				this.editLogList.map(({ returnOrderSn }) => {
					if (returnOrderSn) {
						this.returnOrderSn = returnOrderSn;
					}
				});
				console.log(this.returnOrderSn);
				this.getAvaiableAmount(params);
			} else {
				this.detailInfo = {};
				this.detailList = [];
				this.list = [];
			}
		},
		// 获取押货可用余额接口
		async getAvaiableAmount(params) {
			const res = await this.$fetch(`/mgmt/inventory/mortgageAmount/getAvailableAmount?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { data } = res;
				this.ableAmount = data;
			} else {
				this.ableAmount = '';
			}
		},
	},
	created() {
		let type = this.$route.query.type;
		let orderId = this.$route.query.id || '';
		// 押货单编号
		let orderSn = this.$route.query.orderSn || '';
		this.orderId = orderId;
		this.type = type;
		const params = orderSn ? { orderSn } : { orderId };
		this.getDetail(params, orderSn);
	},
};
</script>

<style lang="scss" scoped>
::v-deep.charging-detail {
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}
	// .el-card__header {
	// 	background-color: #eee;
	// }
	.header_title {
		display: inline-block;
		margin-left: 100px;
		font-size: 14px;
		.left_span {
			margin-right: 24px;
			span:nth-child(2) {
				margin-left: 12px;
			}
		}
		.right_span {
			span:nth-child(2) {
				margin-left: 12px;
			}
		}
	}
	.el-textarea__inner {
		height: 90px;
	}
	.title {
		margin-bottom: 30px;
		font-weight: 500;
		color: rgba(48, 51, 54, 1);
	}
	.flex {
		display: flex;
		font-weight: 400;
		font-size: 14px;
		color: rgba(92, 98, 104, 1);
		.label {
			width: 180px;
			text-align: right;
		}
		.content {
			margin-left: 0px;
		}
	}
	.el-collapse-item__content {
		padding: 0;
	}
	.el-collapse-item__header {
		background-color: #f9f9f9;
	}
	.head_div {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #f9f9f9;
		padding-left: 16px;
		padding-right: 5px;
	}
	.project_name {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		div {
			margin-right: 40px;
		}
	}
	.eidt-btn-footer {
		z-index: 1;
		background: #fff;
		padding: 16px 38px;
		box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.2);
		position: fixed;
		bottom: 0;
		left: 264px;
		right: 0;
		.eidt-btn-footer-box {
			text-align: center;
			.el-button--default {
				background: rgba(255, 255, 255, 1);
				border-radius: 4px;
				border: 1px solid rgba(211, 217, 226, 1);
				color: #303336;
				font-size: 14px;
			}
			.el-button--primary {
				background: rgba(56, 131, 248, 1);
				border-radius: 2px;
				color: #fff;
				font-size: 14px;
			}
			button {
				padding: 9px 16px;
			}
		}
	}
	.min-width {
		min-width: 1224px;
	}
	.self-width {
		width: 375px;
	}
	.relation_order {
		font-size: 14px;
		margin-left: 15px;
	}
	.logistics_box {
		padding: 15px;
		background: #f9f9f9;
		margin-top: 10px;
		// max-height: 100px;
		// overflow: auto;
		.logistics_item_box {
			display: flex;
			span {
				margin-right: 10px;
			}
		}
	}
}
</style>
