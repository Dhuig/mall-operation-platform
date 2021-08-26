<template>
	<div class="return-maintain-detail">
		<guideBar />
		<!-- 审批流程 -->
		<el-card>
			<div class="audit-flow">
				<div class="audit-flow-left">
					<div class="audit-flow-cardno">维修单号：{{ detailData.repairNo }}</div>
					<div class="audit-flow-status">{{ repairStatusArr[detailData.repairStatus] }}</div>
				</div>
				<div class="audit-flow-right">
					<el-steps :active="isActive" align-center>
						<el-step
							v-for="item in statusList"
							:key="item.serviceStatus"
							:title="item.action"
							:description="formatDate(item.createTime)"
						></el-step>
					</el-steps>
				</div>
			</div>
		</el-card>
		<!-- 维修单信息 -->
		<el-card>
			<div class="return-maintain-info">
				<h4 class="title">维修单信息</h4>
				<el-row>
					<el-col :span="6">顾客卡号：{{ detailData.custCard }}</el-col>
					<el-col :span="6">顾客姓名：{{ detailData.customer }}</el-col>
					<el-col :span="6">顾客电话：{{ detailData.phoneNum }}</el-col>
					<!-- <el-col :span="6">所在地区：XXXXXXX</el-col> -->
					<el-col :span="6">详细地址：{{ detailData.custAddress }}</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">产品编码：{{ detailData.productCode }}</el-col>
					<el-col :span="6">产品名称：{{ detailData.productName }}</el-col>
					<el-col :span="6">购买日期：{{ formatDate(detailData.buyDate, 'day') }}</el-col>
					<el-col :span="6">故障日期：{{ formatDate(detailData.failDate, 'day') }}</el-col>
					<el-col :span="6">保质期：{{ detailData.shelfLife == 1 ? '保质期内' : '保质期外' }}</el-col>
					<el-col :span="6">订单号：{{ detailData.orderNo }}</el-col>
					<el-col :span="6">生产批号：{{ detailData.batchNum }}</el-col>
					<el-col :span="6">生产日期：{{ formatDate(detailData.produceDate, 'day') }}</el-col>
					<el-col :span="6">使用日期：{{ formatDate(detailData.useDate, 'day') }}</el-col>
					<el-col :span="6">序列号/二维码：{{ detailData.serialNo }}</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">申请数量：{{ detailData.quantity }}</el-col>
					<el-col :span="6">故障原因：{{ detailData.failReason }}</el-col>
					<el-col :span="6">整/部件损坏情况：{{ detailData.scope == 1 ? '整件' : '部件' }}</el-col>
					<el-col :span="6">故障详细描述：{{ detailData.reasonDetail }}</el-col>
					<el-col :span="6" class="sale-img-col">
						销售小票：
						<img
							v-for="item in detailData.attachmentList"
							@click="() => handleDialog(item)"
							:key="item"
							style="width: 100px; height: 100px; cursor: pointer"
							:src="item"
						/>
					</el-col>
					<el-col :span="24">取消原因：{{ detailData.refusereason }}</el-col>
				</el-row>
			</div>
		</el-card>
		<!-- 维修基本信息 -->
		<el-card v-if="![1, 98].includes(detailData.repairStatus)">
			<div class="return-maintain-info">
				<h4 class="title">维修基本信息</h4>
				<el-row>
					<el-col :span="8">通知网点时间：{{ formatDate(detailData.noticeTime, 'day') }}</el-col>
					<el-col :span="8">预约维修时间：{{ formatDate(detailData.bookTime, 'day') }}</el-col>
					<el-col :span="8">网点类型：{{ detailData.branchName }}</el-col>
					<el-col :span="8">保修类型：{{ detailData.guaranteeType == 1 ? '保修期内' : '保修期外' }}</el-col>
					<el-col :span="8">维修师傅姓名：{{ detailData.masterName }}</el-col>
					<el-col :span="8">联系电话：{{ detailData.contactNum }}</el-col>
					<el-col :span="8">故障现象：{{ detailData.faultType }}</el-col>
					<el-col :span="8">维修方式：{{ detailData.repairMode }}</el-col>
					<el-col :span="8">维修完成时间：{{ formatDate(detailData.finishTime, 'day') }}</el-col>
				</el-row>
			</div>
		</el-card>
		<!-- 配件使用信息 -->
		<el-card v-if="![1, 2, 98].includes(detailData.repairStatus)">
			<div class="return-maintain-info">
				<h4 class="title">配件使用信息</h4>
				<el-row>
					<tableList :dataSource="dataSource" :columns="PARTS_COLUMNS" :options="optionsReviewed"></tableList>
				</el-row>
			</div>
		</el-card>
		<!-- 费用记录 -->
		<el-card v-if="![1, 2, 98].includes(detailData.repairStatus)">
			<div class="return-maintain-info">
				<h4 class="title">费用记录</h4>
				<el-row>
					<el-col :span="8">空跑费：{{ detailData.idleCost }}</el-col>
					<el-col :span="8">服务费：{{ detailData.serviceCost }}</el-col>
					<el-col :span="8">配件费：{{ detailData.fittingCost }}</el-col>
					<el-col :span="8">总费用：{{ detailData.totalCost }}</el-col>
				</el-row>
			</div>
		</el-card>
		<el-dialog :visible.sync="visible" width="60%" v-drag>
			<img class="view-img" :src="viewUrl" />
		</el-dialog>
	</div>
</template>

<script>
import { repairStatusArr, PARTS_COLUMNS } from './config';
import { formatDate } from '@/util/formValidation';
export default {
	name: 'repairOrderDetail',
	data() {
		return {
			repairStatusArr,
			PARTS_COLUMNS,
			formatDate,
			detailData: {},
			dataSource: [],
			statusList: [
				{ serviceStatus: 1, action: '提交维修单', createTime: '' },
				{ serviceStatus: 2, action: '审核维修单', createTime: '' },
				{ serviceStatus: 3, action: '维修处理', createTime: '' },
				{ serviceStatus: 99, action: '完成维修', createTime: '' },
			],
			isActive: 0,
			optionsReviewed: {
				// label: '全部',
				index: true,
				// selection: true,
				labelIndex: '序号',
			},
			viewUrl: '',
			visible: false,
		};
	},
	methods: {
		// 获取维修单详情
		async getDetail() {
			const { repairNo, repairStatus } = this.$route.query;
			const res = await this.$fetch(`/mgmt/order/repair/detail?repairNo=${repairNo}`);
			if (res && res.code === 200) {
				const { data } = res;
				console.log(data);
				this.detailData = {
					...data.orderRepair,
					repairNo,
					repairStatus,
				};
				console.log([1].includes(this.detailData.repairStatus));
				this.dataSource = data.fittingsList;
				let index = 0;
				if (repairStatus != '98') {
					data.statusChangeList.forEach(v => {
						index = this.statusList.findIndex(item => item.serviceStatus === v.serviceStatus);
						this.statusList[index] = v;
					});
				} else {
					index = this.statusList.findIndex(item => item.serviceStatus === this.detailData.repairStatus);
					this.statusList = data.statusChangeList;
				}
				this.isActive = index + 1;
			} else {
				res && this.$message.error(res.message);
			}
		},
		// 点击图片查看大图
		handleDialog(url) {
			if (url) {
				this.viewUrl = url;
				this.visible = true;
			}
		},
		// 点击返回
		handleBack() {
			this.$closeSelf();
		},
	},
	created() {
		this.getDetail();
	},
};
</script>

<style lang="scss" scoped>
.return-maintain-detail {
	font-size: 15px;
	.title {
		font-size: 18px;
		font-weight: 500;
	}
	.remittance-info {
		.el-col {
			margin-top: 20px;
		}
		.el-col:last-child {
			color: red;
		}
	}
	.audit-flow {
		display: flex;
		.audit-flow-left {
			.audit-flow-status {
				font-size: 32px;
				color: #1b7eda;
				font-weight: 500;
				margin-top: 20px;
			}
		}
		.audit-flow-right {
			flex: 1;
		}
	}
	.return-maintain-info {
		word-break: break-all;
		.el-row {
			border-bottom: 1px solid #d1d1d1;
			padding-bottom: 20px;
			.el-col {
				margin-top: 30px;
			}
		}
		.el-row:last-child {
			border-bottom: 0;
			padding-bottom: 30;
		}
	}
	::v-deep.el-dialog {
		max-height: 70%;
		overflow: auto;
	}
	.sale-img-col {
		display: flex;
	}
	.view-img {
		width: 100%;
		height: 100%;
	}
}
</style>