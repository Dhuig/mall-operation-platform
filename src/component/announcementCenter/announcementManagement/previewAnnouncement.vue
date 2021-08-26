<template>
	<div>
		<guideBar>
			<el-button class="btns el-icon-back" type="primary" plain @click="back()">返回</el-button>
		</guideBar>
		<el-card class="card-gap">
			<div class="header">
				<span>预览公告</span>
			</div>
			<div class="center-context">
				<p>{{ pageData.title }}</p>
				<p>{{ time }}</p>
			</div>
			<div class="content-text" v-html="pageData.content"></div>
			<div class="fj" v-if="pageData.attachmentName">
				下载附件:
				<span class="dowload" @click="downloadFileClick(pageData.attachmentUrl, pageData.attachmentName)">
					{{ pageData.attachmentName }}
				</span>
			</div>
		</el-card>
	</div>
</template>

<script>
// , downloadFile
import { formatDate } from 'util/formValidation.js';
export default {
	name: 'previewAnnouncement',
	data() {
		return {
			pageData: {},
			time: formatDate(new Date().getTime()),
		};
	},
	activated() {
		this.pageData = JSON.parse(this.$route.query.preview);
	},
	methods: {
		back() {
			this.$closeSelf();
		},
		downloadFileClick(url) {
			window.open(url, '_blank');
		},
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
	.fj {
		font-size: 14px;
		.dowload {
			color: $color-link;
			cursor: pointer;
		}
	}
	.center-context {
		padding: 40px 0;
		text-align: center;
		color: $color-body;
		border-top: 1px solid $color-border;
		border-bottom: 1px solid $color-border;
		margin-top: 15px;
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
		padding: 20px 10px;
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
