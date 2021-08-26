<template>
	<div>
		<guideBar>
			<el-button class="btns el-icon-back" type="primary" plain @click="submitForm('ruleForm')">返回</el-button>
		</guideBar>
		<el-card class="card-gap">
			<div class="header">
				<span>预览消息</span>
			</div>
			<div class="center-context">
				<p>{{ pageData.msgTitle }}</p>
				<p>{{ pageData.updateTime }}</p>
			</div>
			<div class="content-text" v-html="pageData.content"></div>
		</el-card>
	</div>
</template>

<script>
export default {
	name: 'previewMessage',
	data() {
		return {
			pageData: {},
		};
	},
	methods: {
		submitForm() {
			this.$closeSelf();
		},
		goBack() {
			this.$router.go(-1);
		},
	},
	activated() {
		this.pageData = JSON.parse(this.$route.query.obj);
		let { cronExpr, updateTime, title, msgTitle } = this.pageData;
		this.pageData.updateTime = cronExpr ? cronExpr : updateTime ? updateTime : '';
		this.pageData.msgTitle = title ? title : msgTitle ? msgTitle : '';
	},
};
</script>

<style lang="scss" scoped>
.card-gap {
	.header {
		line-height: 32px;
		overflow: hidden;
		span {
			font-size: $font-size;
			color: $color-body;
		}
		.btns {
			float: right;
			&:last-child {
				margin-right: 10px;
			}
		}
	}
	.center-context {
		padding: 40px 0;
		text-align: center;
		color: $color-body;
		border-top: 1px solid $color-border;
		border-bottom: 1px solid $color-border;
		margin-top: 20px;
		p {
			&:nth-of-type(1) {
				font-size: 18px;
				font-weight: 600;
			}
			&:nth-of-type(2) {
				font-size: $font-size;
				margin-top: 15px;
			}
		}
	}
	.content-text {
		padding: 10px;
		font-size: $font-size;
		color: $color-body;
		line-height: 25px;
		.image {
			width: 379px;
			height: 220px;
			margin-bottom: 40px;
		}
	}
}
</style>
