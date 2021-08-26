<template>
	<div class="platform-activeCenter_couponHandSuccess-wrap">
		<guideBar></guideBar>
		<el-card>
			<div class="succCon">
				<div class="icon_tip">
					<i class="el-icon-success font_set"></i>
					<p>提交成功</p>
					<p>提交成功，等待审核完成</p>
				</div>
				<div class="btn_list">
					<el-button type="primary" @click="golist">返回列表</el-button>
					<el-button @click="godetail">查看详情</el-button>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
export default {
	name: 'createHandWorkSuccess',
	components: {},
	data() {
		return {};
	},
	methods: {
		golist() {
			this.$closeSelf();
		},
		godetail() {
			this.$go('coupon_handOf_Detail', { id: this.$route.query.id });
		},
	},
};
</script>

<style lang="scss" scoped>
.platform-activeCenter_couponHandSuccess-wrap {
	.succCon {
		min-height: 600px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.icon_tip {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			font-family: 'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC', sans-serif;

			p:nth-of-type(1) {
				font-weight: 650;
				font-style: normal;
				font-size: 24px;
				color: rgba(0, 0, 0, 0.847058823529412);
				text-align: center;
				line-height: 32px;
				margin-bottom: 20px;
			}
			p:nth-of-type(2) {
				font-weight: 400;
				font-style: normal;
				color: rgba(0, 0, 0, 0.447058823529412);
				text-align: center;
				line-height: 22px;
				margin-bottom: 30px;
			}
			.font_set {
				font-size: 100px;
				color: #52c41a;
				margin-bottom: 20px;
			}
		}
	}
}
</style>