<template>
	<div class="charging-detail">
		<!-- 基本信息 -->
		<el-card>
			<div class="title">基本信息</div>
			<el-form :inline="true" label-width="140px" label-suffix=":">
				<el-row class="min-width">
					<el-col :span="4">
						<el-form-item label="处理状态">
							<span>{{ formData.orderVo && ORDER_STATUS[formData.orderVo.orderStatus] }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="货损货差单号">
							<span>{{ formData.orderVo && formData.orderVo.orderSn }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="9">
						<el-steps :active="active" align-center>
							<el-step
								v-for="(item, index) in processOrderRecordList"
								:key="index"
								:title="item.processName"
								:description="item.createTime"
							></el-step>
						</el-steps>
					</el-col>
				</el-row>
				<el-row class="min-width mt20">
					<el-col :span="6">
						<el-form-item label="服务中心编号">
							<span>{{ formData.orderVo && formData.orderVo.storeCode }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="负责人卡号">
							<span>{{ formData.orderVo && formData.orderVo.leaderCardNo }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="负责人姓名">
							<span>{{ formData.orderVo && formData.orderVo.leaderName }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="6">
						<el-form-item label="服务中心电话">
							<span>{{ formData.orderVo && formData.orderVo.storePhone }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="分公司名称">
							<span>{{ formData.orderVo && formData.orderVo.companyName }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="分公司编号">
							<span>{{ formData.orderVo && formData.orderVo.companyCode }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="6">
						<el-form-item label="发货日期">
							<span>{{ formData.orderVo && formData.orderVo.deliverDate | format }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="发货单号">
							<span v-for="(item, index) in formData.orderVo.deliverSnList" :key="index">
								<span v-if="index == formData.orderVo.deliverSnList.length - 1">{{ item }}</span>
								<span v-else>{{ item }},</span>
							</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="备注">
							<span>{{ formData.orderVo && formData.orderVo.orderRemarks }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="6">
						<el-form-item label="收货日期">
							<span>{{ formData.orderVo && formData.orderVo.receiveDate | format }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="类型">
							<span>
								{{
									formData.orderVo && formData.orderVo.diffType == 1
										? '货损'
										: formData.orderVo && formData.orderVo.diffType == 2
										? '货差'
										: ''
								}}
							</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<!--其它信息  -->
		<el-card>
			<el-collapse>
				<el-collapse-item title="审批信息" name="1">
					<el-form :inline="true" label-width="140px" label-suffix=":">
						<el-row class="min-width">
							<el-col :span="6">
								<el-form-item label="审批日期" prop="createTime">
									<span>{{ formData.auditVo && formData.auditVo.createTime }}</span>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="处理方式" prop="processTypeMsg">
									<span>{{ formData.replenishInfoVo && formData.replenishInfoVo.processTypeMsg }}</span>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="审批结果" prop="auditStatus">
									<span>
										{{
											formData.auditVo && formData.auditVo.auditStatus == 0
												? '不通过'
												: formData.auditVo && formData.auditVo.auditStatus == 1
												? '通过'
												: ''
										}}
									</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row class="min-width">
							<el-col :span="6">
								<el-form-item label="换/补货单号" prop="replenishSn">
									<span>{{ formData.replenishInfoVo && formData.replenishInfoVo.replenishSn }}</span>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="审批备注" prop="auditRemarks">
									<span>{{ formData.auditVo && formData.auditVo.auditRemarks }}</span>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="换/补日期" prop="replenishDate">
									<span>{{ formData.replenishInfoVo && formData.replenishInfoVo.replenishDate }}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row class="min-width">
							<el-col :span="6">
								<el-form-item label="附件" prop="auditFile">
									<span>{{ formData.auditVo && formData.auditVo.auditFile }}</span>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="运费补贴" prop="expressSubsidy">
									<span>{{ formData.replenishInfoVo && formData.replenishInfoVo.expressSubsidy }}</span>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</el-collapse-item>
			</el-collapse>
		</el-card>
		<!-- 申请退货产品 -->
		<el-card>
			<div class="title">
				货损货差详情
				<span class="red">损差数量合计：{{ ableAmount || 0 }}</span>
				<span class="red">合计金额￥{{ totalAmount || 0 }}</span>
			</div>
			<el-table :data="formData.productVoList" style="width: 100%;" border size="small">
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="productCode" label="产品编码" width="130" />
				<el-table-column prop="productName" label="产品名称" />
				<el-table-column prop="productSecCode" label="定制品二级编码" />
				<el-table-column prop="productSecName" label="二级产品名称" />
				<el-table-column prop="productRetailPrice" label="零售价" width="70" />
				<el-table-column prop="productPacking" label="规格" width="70" />
				<el-table-column prop="productUnit" label="单位" width="70" />
				<el-table-column label="类型" width="70">
					<template>
						<span>
							{{
								formData.orderVo && formData.orderVo.diffType == 1
									? '货损'
									: formData.orderVo && formData.orderVo.diffType == 2
									? '货差'
									: ''
							}}
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="productDiffDesc" label="详情描述" width="70" />
				<el-table-column prop="productNum" label="损差数量" width="70" />
				<el-table-column prop="productRetailPriceAmount" label="金额小计" width="70" />
				<el-table-column prop="deliverSn" label="发货单号" width="200" />
				<el-table-column prop="deliverTime" label="发货日期" width="150">
					<template slot-scope="scope">
						<span>{{ scope.row.deliverTime | format }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="mortgageOrderSn" label="对应押货单" width="150">
					<template slot-scope="scope">
						<span @click="goPage(scope.row)" class="blue">{{ scope.row.mortgageOrderSn }}</span>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<!--货损货差凭证  -->
		<el-card>
			<div class="title">货损货差凭证</div>
			<el-form :inline="true" label-width="150px" label-suffix=":">
				<el-row class="min-width">
					<el-col :span="12">
						<el-form-item label="《货损、货差证明》">
							<p
								@click="goFile(item)"
								class="blue"
								v-for="(item, index) in formData.proofFileVo.diffProofs"
								:key="index"
							>
								{{ item.name }}
							</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="《货物清单》">
							<p
								@click="goFile(item)"
								class="blue"
								v-for="(item, index) in formData.proofFileVo.diffProductList"
								:key="index"
							>
								{{ item.name }}
							</p>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="12">
						<el-form-item label="《货损照片》">
							<p
								@click="goFile(item)"
								class="blue"
								v-for="(item, index) in formData.proofFileVo.diffPhotos"
								:key="index"
							>
								{{ item.name }}
							</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="《其他附件》">
							<p
								@click="goFile(item)"
								class="blue"
								v-for="(item, index) in formData.proofFileVo.diffOtherProofs"
								:key="index"
							>
								{{ item.name }}
							</p>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<!-- 按钮 -->
		<action-bar>
			<el-button @click="handleCancel" icon="el-icon-back">返回</el-button>
		</action-bar>
	</div>
</template>
<script>
import { ORDER_STATUS } from './config';
import qs from 'querystring';
import { formatDate } from 'util/formValidation';
export default {
	name: 'cargoDamageDetail',
	data() {
		return {
			ORDER_STATUS,
			active: 1,
			orderStatus: '', // 页面来源（审核or详情）
			formData: {
				orderVo: {},
				replenishInfoVo: {},
				auditVo: {},
				productVoList: [],
				proofFileVo: {
					diffProofs: [],
					diffPhotos: [],
					diffOtherProofs: [],
				},
			},
			processOrderRecordList: [], //处理进度
			detail: [],
			id: '',
		};
	},
	created() {
		this.orderId = this.$route.query.id ? this.$route.query.id : '';
		this.orderStatus = this.$route.query.orderStatus ? this.$route.query.orderStatus : '';
	},
	mounted() {
		this.loadData();
	},
	computed: {
		// 损差合计
		ableAmount() {
			return this.formData.productVoList.map(item => item.productNum).reduce((acc, cur) => parseFloat(cur) + acc, 0);
		},
		// 合计金额参数
		totalAmount() {
			return this.formData.productVoList
				.map(item => item.productRetailPriceAmount)
				.reduce((acc, cur) => parseFloat(cur) + acc, 0);
		},
	},
	filters: {
		// 格式时间
		format(val) {
			if (!val) return;
			return formatDate(val, 'day');
		},
	},
	methods: {
		// 货损货差详情
		async loadData() {
			let orderId = this.orderId;
			const params = {
				orderId,
			};
			const res = await this.$fetch(`/mgmt/inventory/diffOrder/orderDetail?${qs.stringify(params)}`);
			if (res.code === 200) {
				let lastStepsData = [];
				let { auditVo, replenishInfoVo } = res.data;
				this.formData = res.data;
				this.formData.auditVo = auditVo && { createTime: formatDate(auditVo.createTime) };
				this.formData.replenishInfoVo = replenishInfoVo && { replenishDate: formatDate(replenishInfoVo.replenishDate) };
				this.processOrderRecordList = res.data.processOrderRecordList;
				res.data.processOrderRecordList.forEach((e, n) => {
					if (e.isFinish) {
						this.active = n + 1;
					}
					// 完成/取消的展示数据
					if (e.isFinish) {
						lastStepsData.push(e);
					}
				});
				this.processOrderRecordList.splice(this.processOrderRecordList.length - 1, 1);
				// 	1:'待审批',2:'待收货',3:'已完成',4:'已取消',
				if ([3, 4].includes(this.formData.orderVo.orderStatus)) {
					this.processOrderRecordList = lastStepsData;
					this.active = this.processOrderRecordList.length;
				}
			} else {
				this.$message.error(res.data.message);
			}
		},
		goFile(item) {
			window.open(item.url, '_blank');
		},
		goPage(row) {
			this.$go('charging_detail', { type: 'detail', title: '押货单详情', orderSn: row.mortgageOrderSn });
		},
		// 取消
		handleCancel() {
			this.$nextTick(() => {
				this.$dispatch('UP_LIST');
				this.$closeSelf();
			});
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep.charging-detail {
	.blue {
		color: $primary;
		cursor: pointer;
	}
	.red {
		color: red;
		font-size: 12px;
		margin-left: 50px;
	}
	.mt20 {
		margin-top: 20px;
	}
	.m10 {
		margin: 20px;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
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
	.min-width {
		min-width: 1224px;
	}
	.self-width {
		width: 375px;
	}
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #409eff;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}
	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
}
</style>
