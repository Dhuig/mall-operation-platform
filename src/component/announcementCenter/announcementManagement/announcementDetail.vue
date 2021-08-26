<template>
	<div>
		<guideBar>
			<el-button class="btns el-icon-back" type="primary" plain @click="submitForm('back')">返回</el-button>
		</guideBar>
		<el-card class="card-gap">
			<div class="header">
				<span>{{ pageData.status | status }}</span>
				<el-button type="primary" class="review" v-if="pageData.status === -1" @click="submitForm('pushAndClose', 1)">
					立即发布
				</el-button>
				<el-button type="primary" class="review" v-if="pageData.status === 0" @click="submitForm('zhiding', 1)">
					置顶
				</el-button>
				<el-button type="primary" v-if="pageData.status === -2" class="review" @click="submitForm('review')">
					审核
				</el-button>
				<el-button
					class="btns"
					v-if="pageData.status === -2 || pageData.status === -3"
					type="primary"
					plain
					@click="submitForm('edit')"
				>
					编辑
				</el-button>
				<el-button
					class="btns"
					v-if="(pageData.status !== -1 && pageData.status !== 0) || pageData.status === -3"
					type="danger"
					plain
					@click="submitForm('del')"
				>
					删除
				</el-button>
				<el-button
					class="btns"
					v-if="pageData.status === -1 || pageData.status === 0"
					type="danger"
					plain
					@click="submitForm('pushAndClose', 2)"
				>
					撤销发布
				</el-button>
			</div>
			<div class="messge-detail">
				<span>公告类型：{{ pageData.typeId }}</span>
				<span class="m-l">
					公告平台：{{ pageData.showStore ? '服务中心后台' : ''
					}}{{ pageData.showStore && pageData.showMall ? '、' : '' }}{{ pageData.showMall ? '商城' : '' }}
				</span>
				<span class="m-l">发布时间：{{ !pageData.triggerType ? '即时发布' : '定时发送' }}</span>
				<span class="m-l">创建时间：{{ createTime }}</span>
				<div class="div-enclosure" v-if="pageData.attachmentUrl">
					<span>
						公告附件:
						<span class="enclosure" @click="downloadEnclosure(pageData.attachmentUrl)">
							{{ pageData.attachmentName }}
						</span>
					</span>
				</div>
				<div class="alink">
					<span
						class="link-text"
						v-clipboard:copy="'我是复制的内容ddd'"
						v-clipboard:success="copyLink"
						v-clipboard:error="onError"
					>
						复制商城链接
					</span>
				</div>
			</div>
			<div class="center-context">
				<p>{{ pageData.title }}</p>
				<p>{{ time }}</p>
			</div>
			<div class="content-text" v-html="pageData.content"></div>
		</el-card>
	</div>
</template>

<script>
import { formatDate } from 'util/formValidation.js';
import { ANNOUNCEMENT_DETAIL_STATUS } from './config';
export default {
	name: 'announcementDetail',
	data() {
		return {
			pageData: {},
			time: formatDate(new Date().getTime()),
		};
	},
	activated() {
		this.loadData();
	},
	filters: {
		status: val => ANNOUNCEMENT_DETAIL_STATUS[val],
	},
	computed: {
		createTime() {
			return formatDate(this.pageData.createTime);
		},
	},
	methods: {
		downloadEnclosure(url) {
			window.open(url, '_blank');
		},
		async loadData() {
			const res = await this.$fetch(`/mgmt/msgadmin/mgmt/msg/notice/getNoticeById?id=${this.$route.query.id}`);
			if (res && res.code === 200) {
				this.pageData = res.data;
				this.announcementType();
			}
		},
		async announcementType() {
			const res = await this.$fetch(`/mgmt/msgadmin/mgmt/msg/notice/getNoticeTypeByPage?pageNum=1&pageSize=100000`);
			if (res.code === 200) {
				res.data.list.forEach(e => {
					if (this.pageData.typeId == e.id) {
						this.pageData.typeId = e.typeName;
					}
				});
			}
		},
		confirmcallback(title, callback) {
			this.$confirm('确定' + title + '?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				callback && callback();
			});
		},
		async submitForm(type, typeid) {
			let { id } = this.$route.query;
			if (type == 'edit') {
				this.$go('add_edit_announcement', { id });
			} else if (type == 'del') {
				this.confirmcallback('删除' + this.pageData.title, async () => {
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/msgadmin/mgmt/msg/notice/deleteNotice`,
						data: { id },
					});
					if (res && res.code === 200) {
						this.$message.success(res.message);
						this.$dispatch('ANNOUNCEMENT_MANAGEMENT');
						this.$closeSelf();
					}
				});
			} else if (type == 'review') {
				this.$go('announcement_preview', { id });
			} else if (type == 'pushAndClose') {
				this.confirmcallback(typeid === 1 ? '发布' : '撤销', async () => {
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/msgadmin/mgmt/msg/notice/doNoticeRelease`,
						data: { id, type: typeid },
					});
					if (res && res.code === 200) {
						this.$message.success(res.message);
						this.$dispatch('ANNOUNCEMENT_MANAGEMENT');
						this.$closeSelf();
					}
				});
			} else if (type === 'zhiding') {
				this.confirmcallback('置顶', async () => {
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/msgadmin/mgmt/msg/notice/doNoticeTopping`,
						data: { id },
					});
					if (res && res.code === 200) {
						this.$message.success(res.message);
						this.$dispatch('ANNOUNCEMENT_MANAGEMENT');
					}
				});
			}
			if (type == 'back') {
				this.$closeSelf();
			}
		},
		copyLink(e) {
			console.log(e);
		},
		onError() {},
	},
};
</script>

<style lang="scss" scoped>
.card-gap {
	.header {
		line-height: 32px;
		overflow: hidden;
		.review {
			margin-left: 20px;
		}
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
	.messge-detail {
		position: relative;
		padding: 30px 0;
		font-size: $font-size;
		color: $color-body;
		.btn-text {
			color: $color-link;
			cursor: pointer;
		}
		.m-l {
			margin-left: 10px;
		}
		.alink {
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
			color: $color-link;
		}
		.link-text {
			margin-right: 10px;
		}
	}
	.center-context {
		padding: 40px 0;
		text-align: center;
		color: $color-body;
		border-top: 1px solid $color-border;
		border-bottom: 1px solid $color-border;
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
.div-enclosure {
	margin-top: 20px;
}
.enclosure {
	color: $primary;
	cursor: pointer;
}
</style>
