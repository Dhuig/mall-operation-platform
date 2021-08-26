<template>
	<div>
		<guideBar>
			<el-button class="btns el-icon-back" type="primary" plain @click="goBack">返回</el-button>
		</guideBar>
		<el-card class="card-gap">
			<div class="header">
				<span>{{ dataSource.status === 1 ? '启用中' : '已停用' }}</span>
				<el-button class="btns el-icon-edit-outline" type="primary" plain @click="goEdit">编辑</el-button>
				<el-button
					class="btns el-icon-video-pause"
					type="danger"
					v-if="dataSource.status === 1"
					plain
					@click="updateStatus(0)"
				>
					停用
				</el-button>
				<el-button class="btns" type="success" v-else plain @click="updateStatus(1)">启用</el-button>
			</div>
			<div class="title-text">
				场景标题：
				<span>{{ dataSource.msgTitle }}</span>
				消息类型：{{ dataSource.msgType }}
			</div>
			<div class="center-context">
				<p>{{ dataSource.msgTitle }}</p>
				<p>{{ dataSource.updateTime }}</p>
			</div>
			<div class="content-text" v-html="dataSource.content"></div>
		</el-card>
	</div>
</template>

<script>
export default {
	name: 'systemMessageDetail',
	data() {
		return {
			dataSource: {},
		};
	},
	created() {
		this.getData();
	},
	methods: {
		async getData() {
			const res = await this.$fetch(`/mgmt/msgadmin/plan/query/${this.$route.query.id}`);
			if (res.code === 200) {
				this.dataSource = res.data;
			}
			const resdata = await this.$fetch(`/mgmt/msgadmin/msgType/second`);
			if (resdata.code === 200) {
				resdata.data.map(e => {
					if (e.dicValue * 1 === this.dataSource.msgType) this.dataSource.msgType = e.dicName;
				});
			}
		},
		updateStatus(status) {
			this.$confirm('是否' + (status ? '启用消息?' : '停用消息?'), '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/msgadmin/plan/updateStatus/${this.$route.query.id}/${this.$route.query.sceneId}/${status}`,
					});
					if (res && res.code === 200) {
						this.$dispatch('SUBTEM_MESSAGE_LIST');
						this.$message.success(status ? '启用成功' : '停用成功');
						this.$closeSelf();
					}
				})
				.catch(() => {});
		},
		goBack() {
			this.$closeSelf();
		},
		goEdit() {
			let { id, sceneId, platformId } = this.$route.query;
			this.$go('edit_system_message', { title: '编辑系统消息', type: 'edit', id, sceneId, platformId });
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
	&:nth-of-type(3) {
		margin-top: 5px;
	}
	&:nth-of-type(4) {
		margin-top: 5px;
	}
	&:nth-of-type(5) {
		margin-top: 5px;
	}
	.title-text {
		font-weight: 400;
		font-size: $font-size;
		color: $color-body;
		padding: 20px 0;
		.title-type {
			font-size: 16px;
			font-weight: 600;
		}
	}
	.center-context {
		padding: 40px 0;
		text-align: center;
		color: $color-body;
		border-top: 1px solid $color-border;
		border-bottom: 1px solid $color-border;
		margin-top: 10px;
		margin-bottom: 10px;
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
		font-size: $font-size;
		color: $color-body;
	}
}
</style>
