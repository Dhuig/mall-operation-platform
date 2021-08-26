<template>
	<div class="freight-subsidy-voucher-detail">
		<guideBar />
		<el-card class="box-card" v-if="subsidyInfo">
			<el-row>
				<el-col>
					<span class="card-title">{{ VOUCHER_STATUS[subsidyInfo.freightCouponStatus] }}</span>
					<span>
						使用订单:
						<span class="color-blue">{{ subsidyInfo.orderNo }}</span>
					</span>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="6">运费补贴券金额: ￥{{ subsidyInfo.freightSubsidyAmount }}</el-col>
				<el-col :span="6">发放时间: {{ formatDate(subsidyInfo.claimTime) }}</el-col>
				<el-col :span="6">
					补贴来源:
					<span class="color-blue">{{ subsidyInfo.subsidySource }}</span>
				</el-col>
				<el-col :span="6">补贴券编码: {{ subsidyInfo.freightSubsidyCode }}</el-col>
			</el-row>
			<el-row>
				<el-col :span="6">有效期: {{ formatDate(subsidyInfo.effectiveEndTime) }}</el-col>
				<el-col :span="6">会员卡号: {{ subsidyInfo.cardNo }}</el-col>
				<el-col :span="6">会员姓名: {{ subsidyInfo.realname }}</el-col>
				<el-col :span="6">会员手机号: {{ subsidyInfo.mobile }}</el-col>
			</el-row>
			<el-row>
				<el-col :span="6">会员身份: {{ MEMBER_TYPE[subsidyInfo.memberType] }}</el-col>
				<el-col :span="6">服务中心编号: {{ subsidyInfo.shopCode }}</el-col>
				<el-col :span="6">服务中心名称: {{ subsidyInfo.shopName }}</el-col>
				<el-col :span="6">服务中心状态: {{ STORE_STATUS[subsidyInfo.shopStatus] }}</el-col>
			</el-row>
		</el-card>
	</div>
</template>

<script>
import { VOUCHER_STATUS, SUBSIDY_REASON, MEMBER_TYPE, STORE_STATUS } from './config';
import { formatDate } from 'util/formValidation.js';
export default {
	name: 'freightSubsidyVoucherDetail',
	data() {
		return {
			VOUCHER_STATUS,
			SUBSIDY_REASON,
			MEMBER_TYPE,
			STORE_STATUS,
			grantdtlId: '',
			subsidyInfo: {},
		};
	},
	computed: {
		formatDate() {
			return formatDate;
		},
	},
	methods: {
		// 获取数据
		async loadData() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/fin/voucher/freight/subsidy/queryFreightSubsidyDetailInfo?grantdtlId=${this.grantdtlId}`,
			});
			if (res && res.data) {
				this.subsidyInfo = res.data;
			} else {
				this.$message.error('获取数据失败');
			}
		},
	},
	mounted() {
		const { grantdtlId } = this.$route.query;
		if (grantdtlId) {
			this.grantdtlId = grantdtlId;
			this.loadData();
		}
	},
};
</script>

<style lang="scss" scoped>
::v-deep.freight-subsidy-voucher-detail {
	.el-row {
		margin-bottom: 24px;
		font-size: 13px;
		&:last-child {
			margin-bottom: 0;
		}
	}
	.card-title {
		font-size: 18px;
		margin-right: 24px;
	}
	.color-blue {
		color: $color-link;
	}
}
</style>
