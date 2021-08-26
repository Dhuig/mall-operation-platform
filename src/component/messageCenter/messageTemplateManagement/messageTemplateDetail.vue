<template>
	<div>
		<guideBar>
			<el-button class="btns el-icon-back" type="primary" plain @click="submitForm('back')">返回</el-button>
		</guideBar>
		<el-card class="card-gap">
			<div class="header">
				<span>{{ dataSurce.status ? '启用中' : '已停用' }}</span>
				<el-button class="btns" type="primary" plain @click="submitForm('edit')">编辑</el-button>
				<el-button class="btns" type="danger" v-if="!dataSurce.status" plain @click="submitForm('del')">删除</el-button>
				<el-button class="btns" type="danger" plain @click="submitForm('stop', dataSurce.status)">
					{{ !dataSurce.status ? '启用' : '停用' }}
				</el-button>
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="title-text">
				<span>模板编号：{{ dataSurce.templateCode }}</span>
				<span class="m-l">模板名称：{{ dataSurce.templateName }}</span>
				<span class="m-l">消息类型：{{ dataSurce.msgType }}</span>
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="center-context">
				<p>{{ dataSurce.title }}</p>
				<p>{{ dataSurce.updateTime }}</p>
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="content-text" v-html="dataSurce.content"></div>
		</el-card>
	</div>
</template>

<script>
export default {
	name: 'messageTemplateDetail',
	data() {
		return {
			dataSurce: {},
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		async loadData() {
			const res = await this.$fetch(`/mgmt/msgadmin/manageTemplate/query/${this.$route.query.id}`);
			if (res.code === 200) {
				this.dataSurce = res.data;
			}
			this.getMsgType();
		},
		confirm(callbck) {
			this.$confirm('确定操作' + this.dataSurce.title + '?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				callbck && callbck();
			});
		},
		async updateStatus(status) {
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/msgadmin/manageTemplate/update/${this.$route.query.id}/${status === 2 ? 2 : status === 1 ? 0 : 1}`,
				data: this.pushData,
			});
			if (res.code === 200) {
				this.$message.success(res.message);
				this.loadData();
				this.$dispatch('MESSGE_TEMPLATE_MANAGEMENT');
				if (status === 2) {
					this.$closeSelf();
				}
			}
		},
		submitForm(text, status) {
			if (text === 'back') this.$closeSelf();
			if (text === 'edit')
				this.$go('add_edit_message_template', { title: '新建/编辑消息模板', id: this.$route.query.id });
			if (text === 'del') {
				this.confirm(() => {
					this.updateStatus(2);
				});
			} else if (text === 'stop') {
				this.confirm(async () => {
					this.updateStatus(status);
				});
			}
		},
		async getMsgType() {
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/msgadmin/msgType/second`,
			});
			let { data, code } = res;
			if (code === 200) {
				data.forEach(el => {
					if (el.dicValue * 1 === this.dataSurce.msgType) this.dataSurce.msgType = el.dicName;
				});
			}
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
			&:nth-of-type(2) {
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
		.title-type {
			font-size: 16px;
			font-weight: 600;
		}
		.m-l {
			margin-left: 10px;
		}
	}
	.center-context {
		padding: 40px 0;
		text-align: center;
		color: $color-body;
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
