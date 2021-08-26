<template>
	<div>
		<el-card class="card-gap">
			<div>
				<div class="head-text">
					数据统计:
					<!-- <span class="statistics">明天凌晨2点，更新前一天数据统计</span> -->
				</div>
				<div class="statistics-content">
					<div class="fiex" v-for="(item, name) in SUBMITORDERS" :key="item">
						<div class="text">{{ item }}</div>
						<div class="text" v-if="'couponCount' === name">
							{{ couponData['couponCount'] === '-1' ? '不限制' : couponData[name] }}
						</div>
						<div class="text" v-else>{{ couponData[name] ? couponData[name] : 0 }}</div>
					</div>
				</div>
			</div>
		</el-card>
		<el-card class="box-card">
			<searchPanel v-model="search" :config="DATA_CONFIG" @search="breakdown" />
		</el-card>
		<el-card class="card-gap">
			<div class="activity-data">
				<tableList
					border
					:dataSource="breakdownList.data"
					:pagination="breakdownList.pagination"
					:dataTotal="breakdownList.total"
					:loading="breakdownList.loading"
					@handleChangePage="activityChangePage"
					@handleSizeChange="activitySizeChange"
					@handleSelectionChange="handleSelectionChange"
					:columns="DATA_COLUMNS"
					:options="customerOptions"
				>
					<template slot="content_context">
						<div class="daochu">数据明细</div>
						<el-button class="activity-btn" type="primary" @click="importData">导 出</el-button>
						<el-button
							v-permission="'coupon_management_detail_batch_void_btn'"
							class="activity-btn"
							type="primary"
							plain
							@click="batchVoid"
						>
							批量作废
						</el-button>
						<div class="text-btn">已选{{ customerIds.length }}张优惠券</div>
					</template>
					<template v-slot:operating="{ row }">
						<span v-permission="'coupon_management_detail_void_btn'">
							<el-button type="text" v-if="row.state === 1" @click="voidHandle(row)">作废</el-button>
						</span>
					</template>
					<template v-slot:orderNo="{ row }">
						<el-button type="text" @click="goOrderDetail(row)">{{ row.orderNo }}</el-button>
					</template>
				</tableList>
			</div>
		</el-card>

		<el-dialog title="作废" v-drag :visible.sync="dialogVisible" width="444px" :before-close="close">
			<div>
				<div class="batch-void">
					<p class="is-text-top">
						<span class="el-icon-question"></span>
						<span class="text">作废优惠券</span>
					</p>
					<p class="is-text">确定作废优惠券？</p>
				</div>
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
					<el-form-item label="作废原因：">
						<el-col :span="12">
							<el-input
								type="input"
								style="width: 200px"
								v-model="ruleForm.invalidReason"
								placeholder="请输入作废原因"
							></el-input>
						</el-col>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="close">取消</el-button>
				<el-button type="primary" @click="addMsg">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { DATA_CONFIG, SUBMITORDERS, DATA_COLUMNS } from '../config';
import { exportExcel } from 'util';
export default {
	name: 'couponData',
	props: {
		pageData: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			customerOptions: {
				selection: true,
				checked: row => row.state === 1,
				// checked:(row, rowIndex){}
			},
			search: {
				cardNo: null,
				realName: null,
				mobile: null,
				state: null,
				getType: null,
				transferType: null,
				code: null,
			},
			DATA_CONFIG,
			SUBMITORDERS,
			DATA_COLUMNS,
			couponData: {
				couponCount: null,
				expiredCount: null,
				grantCount: null,
				grantPercent: null,
				invalidCount: null,
				notUsedCount: null,
				occupyCount: null,
				usePercent: null,
				usedCount: null,
			},
			breakdownList: {
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				loading: false,
				promotionId: '',
			},
			customerIds: [],
			customerId: [],
			dialogVisible: false,
			ruleForm: {
				invalidReason: '',
			},
			rules: {
				invalidReason: [{ required: true, message: '请输入作废原因', trigger: 'blur' }],
			},
		};
	},
	created() {
		this.getCouponDataPage();
	},
	methods: {
		importData() {
			let { id } = this.pageData;
			let { currentPage: pageNum, pageSize } = this.breakdownList.pagination;
			let params = { pageNum, pageSize, couponId: id, ...this.search };
			exportExcel('/mgmt/prmt/coupon/getMemberCoupon', params);
		},
		async getCouponDataPage() {
			let params = { ...this.breakdownList.pagination, couponId: this.pageData.id };
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/prmt/coupon/getCouponDataPage`,
				params: params,
			});
			if (res && res.code === 200) {
				this.couponData = Object.assign(this.couponData, res.data);
				Object.keys({ grantPercent: '', usePercent: '' }).forEach(key => {
					this.couponData[key] = (this.couponData[key] || 0) + '%';
				});
			}
		},
		goOrderDetail(row) {
			if (row.orderNo) this.$go('customer_order_detail', { orderNo: row.orderNo, title: '顾客订单详情' });
		},
		handleSelectionChange(val) {
			this.customerIds = val.filter(e => e.state === 1).map(e => e.id);
		},
		async addMsg() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/coupon/batchInvalidCoupon`,
				data: {
					ids: this.customerId.length > 0 ? this.customerId : this.customerIds,
					invalidReason: this.ruleForm.invalidReason,
				},
			});
			if (res && res.code === 200) {
				this.$message.success(res.message);
				this.dialogVisible = false;
				this.breakdown();
				this.resetClose();
			}
		},
		close() {
			this.ruleForm.invalidReason = '';
			this.resetClose();
		},
		resetClose() {
			this.dialogVisible = false;
			this.customerIds = [];
			this.customerId = [];
		},
		batchVoid() {
			if (this.customerIds.length === 0) return this.$message.warning('请勾选未使用的单券状态作废！');
			this.dialogVisible = true;
		},
		voidHandle(row) {
			this.dialogVisible = true;
			this.customerId = [row.id];
		},
		activityChangePage(val) {
			this.breakdownList.pagination.currentPage = val;
			this.breakdown();
		},
		activitySizeChange(val) {
			this.breakdownList.pagination.pageSize = val;
			this.breakdown();
		},
		async breakdown(status) {
			let { id } = this.pageData;
			let { currentPage: pageNum, pageSize } = this.breakdownList.pagination;
			let params = { pageNum, pageSize, couponId: id, ...this.search };
			if (status === 1) return exportExcel(`/mgmt/prmt/coupon/getCouponDataPage`, { couponId: id });
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/prmt/coupon/getCouponDataPage`,
				params: params,
			});
			if (res && res.code === 200) {
				this.breakdownList.data = res.data.pageVo.list;
				this.breakdownList.total = res.data.pageVo.total;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.head-text {
	font-size: 18px;
	font-weight: 600;
	padding-bottom: 20px;
	.statistics {
		font-size: $font-size;
		color: $color-disabled;
		font-weight: 400;
	}
}
.statistics-content {
	display: flex;
	.fiex {
		flex: 1;
		text-align: center;
		font-size: $font-size;
		.text {
			line-height: 30px;
		}
	}
}
.activity-btn {
	float: right;
	margin-bottom: 10px;
	margin-right: 10px;
}

.text-btn {
	float: right;
	margin-right: 10px;
	height: 30px;
	line-height: 30px;
	font-size: 14px;
}
.batch-void {
	padding-left: 58px;
	padding-bottom: 20px;
	.is-text-top {
		line-height: 40px;
		height: 40px;
		.el-icon-question {
			color: $warning;
			font-size: 40px;
			float: left;
		}
		.text {
			font-size: 18px;
			color: $color-body-se;
			display: inline-block;
			margin-bottom: 10px;
		}
	}
	.is-text {
		font-size: 14px;
		color: $color-disabled;
		text-indent: 40px;
	}
}
</style>
