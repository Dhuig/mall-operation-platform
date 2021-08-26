<template>
	<div>
		<el-card class="card-gap">
			<div class="accomplish">
				<div class="icon-yes">
					<span class="icon-yes el-icon-success"></span>
				</div>
				<div class="sbmt">提交成功</div>
				<div class="sbmt-text">活动提交成功，等待审批完成</div>
				<div class="sbmt-btn">
					<el-button type="primary" @click="backList">返回列表</el-button>
					<el-button plain @click="goDetail">查看详情</el-button>
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
		id: String,
	},
	data() {
		return {};
	},
	methods: {
		backList() {
			this.$go('activity_management');
		},
		goDetail() {
			this.$go('spike_activity', { id: this.id });
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
		margin-top: 80px;
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
