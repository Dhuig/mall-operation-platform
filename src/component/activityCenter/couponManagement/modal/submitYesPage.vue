<template>
	<div>
		<el-card class="card-gap">
			<div class="accomplish">
				<div class="icon-yes">
					<span class="icon-yes el-icon-success"></span>
				</div>
				<div class="sbmt">提交成功</div>
				<div class="sbmt-text">优惠券新建提交成功，等待审批完成</div>
				<div class="sbmt-btn">
					<el-button type="primary" @click="backList('ruleForm')">返回列表</el-button>
					<el-button plain @click="goDetail('ruleForm')">查看详情</el-button>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
export default {
	name: 'submitYesPage',
	props: {
		//查询配置项
		config: Object,
		default: {},
		id: {
			type: String,
		},
	},
	methods: {
		backList() {
			this.$go('coupon_management');
		},
		goDetail() {
			this.$dispatch('GET_ACTIVITY_DATA');
			this.$dispatch('GET_ACTIVITY_DATA_LOADING');
			this.$go('coupon_detail', { title: '优惠券详情', id: this.id ? this.id : this.$route.query.id });
		},
	},
};
</script>
<style lang="scss">
.card-gap {
	margin-top: 10px;
}
.accomplish {
	text-align: center;
	.icon-yes {
		margin-top: 20px;
		font-size: 68px;
		color: $success;
	}
	.sbmt {
		padding: 40px 0 0 0;
		font-size: 20px;
	}
	.sbmt-text {
		padding: 20px;
		color: $color-disabled;
		font-size: $font-size;
	}
	.sbmt-btn {
		padding-bottom: 40px;
	}
}
</style>
