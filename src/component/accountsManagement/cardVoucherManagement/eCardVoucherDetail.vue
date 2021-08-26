<template>
	<div class="e-card-voucher-detail">
		<guideBar />
		<el-card class="box-card all-info fs13">
			<el-row>
				<el-col>
					<span class="card-title">{{ ECARD_STATUS[allInfo.giftCouponStatus] }}</span>
					<span v-if="allInfo.orderNo">
						使用订单：
						<span class="color-blue">{{ allInfo.orderNo }}</span>
					</span>
					<span class="marginL10" v-if="allInfo.applyTime && allInfo.giftCouponStatus == 1">
						使用时间:
						<span class="color-blue">{{ formatDate(allInfo.applyTime) }}</span>
					</span>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="6">会员卡号：{{ allInfo.cardNo }}</el-col>
				<el-col :span="6">会员姓名：{{ allInfo.realname }}</el-col>
				<el-col :span="6">服务中心/微店编号：{{ allInfo.shopCode }}</el-col>
			</el-row>
			<el-row>
				<el-col :span="6">电子礼券金额：￥{{ allInfo.giftCouponCardAmount }}</el-col>
				<el-col :span="6">礼券编码：{{ allInfo.giftCouponCode }}</el-col>
				<el-col :span="6">发放时间：{{ formatDate(allInfo.claimTime) }}</el-col>
				<!-- <el-col :span="6">报单月份：{{ formatDate(allInfo.expiresTime) }}</el-col> -->
			</el-row>
		</el-card>
		<el-card class="box-card">
			<div class="card-title">转店明细</div>
			<tableList border :dataSource="transferStoreList" :columns="TRANSFER_STORE_DETAIL_COLUMNS_CONFIG" />
		</el-card>
		<el-card class="box-card">
			<div class="card-title">转出记录</div>
			<tableList border :dataSource="transferOutList" :columns="TRANSFER_OUT_STORE_RECORD_COLUMNS_CONFIG" />
		</el-card>
		<el-card class="box-card">
			<div class="card-title">冻结记录</div>
			<tableList border :dataSource="frozenRecordList" :columns="FROZEN_RECORD_COLUMNS_CONFIG" />
		</el-card>
	</div>
</template>

<script>
import {
	TRANSFER_STORE_DETAIL_COLUMNS_CONFIG,
	TRANSFER_OUT_STORE_RECORD_COLUMNS_CONFIG,
	FROZEN_RECORD_COLUMNS_CONFIG,
	ECARD_STATUS,
} from './config';
import { formatDate } from 'util/formValidation.js';
export default {
	name: 'eCardVoucherDetail',
	data() {
		return {
			ECARD_STATUS,
			grantdtlId: '',
			allInfo: {},
			TRANSFER_STORE_DETAIL_COLUMNS_CONFIG,
			transferStoreList: [],
			TRANSFER_OUT_STORE_RECORD_COLUMNS_CONFIG,
			transferOutList: [],
			FROZEN_RECORD_COLUMNS_CONFIG,
			frozenRecordList: [],
			formatDate,
		};
	},
	methods: {
		// 获取数据
		async loadData() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/fin/voucher/gift/coupon/queryGiftCouponManagerDetailInfo?grantdtlId=${this.grantdtlId}`,
			});
			if (res && res.data) {
				const {
					giftCouponFrozendtlDto,
					giftCouponGrantdtlDto,
					giftCouponTransOutdtlDto,
					giftCouponTransShopdtlDto,
				} = res.data;
				this.frozenRecordList = giftCouponFrozendtlDto;
				this.transferOutList = giftCouponTransOutdtlDto;
				this.transferStoreList = giftCouponTransShopdtlDto;
				this.allInfo = giftCouponGrantdtlDto;
			}
		},
	},
	mounted() {
		const { id } = this.$route.query;
		if (id) {
			this.grantdtlId = id;
			this.loadData();
		}
	},
};
</script>

<style lang="scss" scoped>
::v-deep.e-card-voucher-detail {
	.box-card {
		margin-bottom: 16px;
	}
	.card-title {
		font-size: 18px;
		margin-right: 24px;
		margin-bottom: 16px;
	}
	.fs13 {
		font-size: 13px;
	}
	.color-blue {
		color: $color-link;
	}
	.marginL10 {
		margin-left: 10px;
	}
	.all-info {
		.el-row {
			margin-bottom: 16px;
			&:last-child {
				margin-bottom: 0;
			}
		}
	}
}
</style>