<template>
	<div class="service-order-detail">
		<guideBar />
		<el-card>
			<el-row>
				<el-col :span="12">
					<div>订单号：{{ baseInfo.accOrderNo }}</div>
					<div class="order-status">{{ baseInfo.orderStatusDesc }}</div>
					<div v-permission="'perfect_home_service_order_detail_cancelbutton'">
						<el-button type="info" plain v-if="cancelButtonShow" @click="serviceOrderCancel">取消服务单</el-button>
					</div>
				</el-col>
				<el-col :span="12">
					<el-steps :active="statusActive" align-center>
						<el-step title="提交申请" :description="baseInfo.createTime"></el-step>
						<template v-if="!(baseInfo.orderStatus == '-1')">
							<el-step title="已接单" :description="baseInfo.acceptTime"></el-step>
							<el-step title="完成服务" :description="baseInfo.completedTime"></el-step>
						</template>
						<el-step v-else title="已取消" :description="baseInfo.cancelledTime"></el-step>
					</el-steps>
				</el-col>
			</el-row>
		</el-card>
		<el-card class="service-message-module">
			<el-row type="flex">
				<el-col :span="8">
					<div class="title">申请人</div>
					<ul>
						<li>申请人注册手机: {{ baseInfo.applicantMobile || '' }}</li>
						<li>服务地址: {{ baseInfo.serviceAddress || '' }}</li>
						<li>服务时间: {{ baseInfo.serviceTimeStart || '' }}</li>
						<li>服务码: {{ baseInfo.serviceNo || '' }}</li>
					</ul>
				</el-col>
				<el-col :span="8">
					<div class="title">服务人员</div>
					<ul>
						<li>服务人员会员卡号: {{ (baseInfo.cleaner && baseInfo.cleaner.cardNo) || '' }}</li>
						<li>服务人员姓名: {{ (baseInfo.cleaner && baseInfo.cleaner.cleanerName) || '' }}</li>
						<li>服务人员手机号: {{ (baseInfo.cleaner && baseInfo.cleaner.cleanerMobile) || '' }}</li>
					</ul>
				</el-col>
				<el-col :span="8">
					<div class="title">服务明细</div>
					<ul>
						<li>服务项目: {{ baseInfo.itemName || '' }}</li>
						<li>项目规格: {{ baseInfo.itemsSkuName || '' }}</li>
						<li>服务单位: {{ baseInfo.itemUnit || '' }}</li>
						<li>服务数量: {{ baseInfo.serviceNum || '' }}</li>
					</ul>
				</el-col>
			</el-row>
		</el-card>
		<el-card>
			<div class="table-title">操作记录</div>
			<tableList :dataSource="list" :columns="SERVICE_ORDER_DETAIL_COLUMNS" />
		</el-card>
		<!-- 取消服务单提醒 -->
		<el-dialog v-drag title="取消服务单提醒" :visible.sync="servicePop" width="500px">
			<el-form :model="serviceForm" ref="serviceForm" label-width="50px">
				<div style="margin-bottom: 16px">取消后服务单会变成已取消状态</div>
				<el-form-item label="备注" prop="remarks">
					<el-input v-model="serviceForm.remarks" placeholder="输入备注信息"></el-input>
				</el-form-item>
				<el-row type="flex" justify="end">
					<el-button @click="cancelServiceForm('serviceForm')">取消</el-button>
					<el-button type="primary" v-bind:loading="submitLoading" @click="saveServiceForm('serviceForm')">
						保存
					</el-button>
				</el-row>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import { SERVICE_ORDER_DETAIL_COLUMNS } from './config';
export default {
	name: 'serviceOrderDetail',
	data() {
		return {
			SERVICE_ORDER_DETAIL_COLUMNS,
			id: '',
			baseInfo: {
				cleaner: {},
			}, //基本信息
			list: [], //操作记录
			servicePop: false,
			serviceForm: {
				//取消服务单提醒form
				remarks: '',
			},
			submitLoading: false, // 防止连续提交
		};
	},
	computed: {
		cancelButtonShow() {
			// 当服务单状态为：待接单和待服务时 可取消
			const { orderStatus } = this.baseInfo;
			return orderStatus == 0 || orderStatus == 1;
		},
		statusActive() {
			const { orderStatus } = this.baseInfo;
			let active = orderStatus + 1;
			if (orderStatus == -1) {
				active = 2;
			}
			return active;
		},
	},
	methods: {
		// 取消服务单
		serviceOrderCancel() {
			this.servicePop = true;
		},
		// 取消服务单提醒 取消
		cancelServiceForm(formName) {
			this.$refs[formName].resetFields();
			this.servicePop = false;
		},
		// 取消服务单提醒 确认
		async saveServiceForm(formName) {
			const data = {
				orderStatus: -1, // 取消
				accOrderId: this.id,
				...this.serviceForm,
			};
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/acc/order/status/update',
				data,
				callback: () => {
					this.submitLoading = false;
				},
			});
			if (res && res.code == 200) {
				this.$message.success('操作成功');
				this.cancelServiceForm(formName);
				this.initData();
			} else {
				this.$message.error((res && res.data.message) || '操作失败');
			}
		},
		// 获取操作记录数据
		async loadLogs() {
			const res = await this.$fetch(`/mgmt/acc/order/log/list/${this.id}`);
			if (res && res.data) {
				this.list = res.data;
			} else {
				this.$message.error('获取操作记录失败');
			}
		},
		// 获取数据
		async loadData() {
			const res = await this.$fetch(`/mgmt/acc/order/detail/${this.id}`);
			if (res && res.data) {
				this.baseInfo = res.data;
			} else {
				this.$message.error('获取数据失败');
			}
		},
		// 初始化
		initData() {
			this.loadData();
			this.loadLogs();
		},
	},
	mounted() {
		const { id } = this.$route.query;
		if (id) {
			this.id = id;
			this.initData();
		}
	},
};
</script>

<style lang="scss" scoped>
::v-deep.service-order-detail {
	.order-status {
		font-size: 24px;
		color: blue;
		margin: 16px 0 24px;
	}
	.service-message-module {
		.el-col:not(:first-child) {
			border-left: 1px solid #000;
			padding-left: 20px;
		}
		.title {
			font-size: 18px;
			font-weight: 600;
			padding: 0 0 26px 0;
		}
		ul {
			li {
				line-height: 24px;
				font-size: 14px;
				color: $color-body;
			}
		}
	}
	.table-title {
		font-size: 18px;
		font-weight: 600;
		padding: 0 0 16px 0;
	}
}
</style>