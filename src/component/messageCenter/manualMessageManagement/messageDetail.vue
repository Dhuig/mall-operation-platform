<template>
	<div>
		<guideBar>
			<el-button class="btns el-icon-back" type="primary" plain @click="$closeSelf()">返回</el-button>
		</guideBar>
		<el-card class="card-gap">
			<div class="header">
				<span>{{ detail.planStatus | status }}</span>
				<el-button type="primary" class="review" @click="submitForm('review')" v-if="detail.planStatus === 0">
					审核
				</el-button>
				<el-button type="primary" class="review" @click="submitForm('release')" v-if="detail.planStatus === 1">
					立即发布
				</el-button>
				<el-button
					class="btns el-icon-edit-outline"
					type="primary"
					plain
					@click="submitForm('edit')"
					v-if="detail.planStatus === 0"
				>
					编辑
				</el-button>
				<el-button
					class="btns"
					type="danger"
					plain
					@click="submitForm('del')"
					v-if="detail.planStatus === 0 || detail.planStatus === 2 || detail.planStatus === 3"
				>
					删除
				</el-button>
				<el-button
					class="btns"
					type="danger"
					plain
					@click="submitForm('revoke')"
					v-if="detail.planStatus === 1 || detail.planStatus === 4"
				>
					撤销发布
				</el-button>
			</div>
			<div class="messge-detail">
				发送时间：
				<span>{{ !detail.triggerType ? '即时发送' : '定时发送' }}</span>
				发送渠道：
				<span>所有渠道</span>
				<!-- <span>{{ detail.receiverType === 1 ? '服务中心' : detail.receiverType === 2 ? '商城' : '未指定' }}</span> -->
				<span style="margin-left: 10px">消息类型：</span>
				<span>{{ detail.msgType }}</span>
				<span style="margin-left: 10px">接收对象：</span>
				<span>{{ detail.receiverFrom === 1 ? '全部用户' : detail.receiverFrom === 2 ? '导入名单' : '未指定' }}</span>
				<span class="btn-text" v-if="detail.receiverFrom === 2" @click="lookList">查看名单</span>
				发送内容：
				<span>{{ detail.contentFrom ? '模板消息：（' + detail.templateName + ')' : '自由编辑' }}</span>
			</div>
			<div class="center-context">
				<p>{{ detail.msgTitle }}</p>
				<p>{{ time }}</p>
			</div>
			<div class="content-text" v-html="detail.content"></div>
		</el-card>
		<el-dialog title="发送名单" :visible.sync="isAddParameter" width="60%" ref="dialog" :before-close="close" v-drag>
			<div>
				<div class="dilog-serach">
					<el-form ref="form" :inline="true" label-width="140px">
						<el-form-item label="搜索会员卡号：">
							<el-input v-model="serachData.cardNo" size="small" placeholder="请出入会员卡号"></el-input>
						</el-form-item>
						<el-form-item label="搜索姓名或手机：">
							<el-input v-model="serachData.keyWord" size="small" placeholder="请出入姓名或手机"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button class="serach-btn" type="primary" @click="serachList">搜 索</el-button>
							<el-button type="primary" @click="downloadReceiverList">导 出</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div class="dilog-main">
					<tableList
						border
						:dataSource="parmasList"
						:columns="MESSAGE_DETAIL_COLUMNS"
						:pagination="pagination"
						:dataTotal="pagination.total"
						:loading="loading"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
					></tableList>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="isAddParameter = false">取 消</el-button>
				<el-button type="primary" @click="isAddParameter = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { MESSAGE_DETAIL_STATUS, MESSAGE_DETAIL_COLUMNS } from './config';
import { formatDate } from 'util/formValidation.js';
import { exportExcel } from 'util';
export default {
	name: 'messageDetail',
	data() {
		return {
			loading: false,
			pagination: {
				total: 0,
				currentPage: 1,
				pageSize: 10,
			},
			serachData: {
				cardNo: '',
				keyWord: '',
				pageNum: 1,
				pageSize: 10,
			},
			MESSAGE_DETAIL_COLUMNS,
			isAddParameter: false,
			serhchValue: '',
			detail: {},
			parmasList: [],
			time: formatDate(new Date().getTime()),
		};
	},
	created() {
		this.loadData();
		this.$listen('MANUAL_MESSAGE_MANAGEMENT_DETILE', this.loadData);
	},
	filters: {
		status: val => MESSAGE_DETAIL_STATUS[val],
	},
	methods: {
		// 分页page
		handleChangePage(currentPage) {
			this.pagination.currentPage = currentPage;
			this.list();
		},
		// 分页size
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.list();
		},
		lookList() {
			this.isAddParameter = true;
			this.list();
		},
		resetLst() {
			this.serachData = { cardNo: '', keyWord: '' };
		},
		close() {
			this.isAddParameter = false;
		},
		serachList() {
			this.pagination.currentPage = 1;
			this.list();
		},
		async list() {
			let { currentPage: pageNum, pageSize } = this.pagination;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/msgadmin/handmade/receiverList?planCode=${this.$route.query.id}`,
				data: { planCode: this.$route.query.id, ...this.serachData, pageNum, pageSize },
			});
			if (res.status === 200) {
				this.parmasList = res.data.list;
				this.pagination.total = res.data.total;
			}
		},
		async downloadReceiverList() {
			let { currentPage: pageNum, pageSize } = this.pagination;
			exportExcel('/mgmt/msgadmin/handmade/downloadReceiverList', {
				planCode: this.$route.query.id,
				...this.serachData,
				pageNum,
				pageSize,
			});
		},
		async loadData() {
			const res = await this.$fetch(`/mgmt/msgadmin/handmade/details?planCode=${this.$route.query.id}`);
			if (res.code === 200) {
				this.detail = res.data;
			}
			const resdata = await this.$fetch(`/mgmt/msgadmin/msgType/second`);
			if (resdata.code === 200) {
				resdata.data.map(e => {
					if (e.dicValue * 1 === this.detail.msgType * 1) {
						this.detail.msgType = e.dicName;
					}
				});
			}
		},
		confirm(msg, callback) {
			this.$confirm(msg, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				callback && callback();
			});
		},
		async submitForm(item) {
			if (item === 'review') {
				this.$go('message_review', { title: '消息审核', type: 'message_detail', id: this.$route.query.id });
			} else if (item === 'del') {
				this.confirm('确定删除' + this.detail.msgTitle + '?', async () => {
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/msgadmin/handmade/delete',
						data: { planCode: this.$route.query.id },
					});
					if (res && res.code === 200) {
						this.$dispatch('MANUAL_MESSAGE_MANAGEMENT_LIST');
						this.$dispatch('MANUAL_MESSAGE_MANAGEMENT_GET_DSH');
						this.$message.success('删除成功');
						this.$closeSelf();
					}
				});
			} else if (item === 'release') {
				this.confirm('确定发送消息：' + this.detail.msgTitle + '?', async () => {
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/msgadmin/handmade/send',
						data: { planCode: this.$route.query.id },
					});
					if (res && res.code === 200) {
						this.$message.success('发送成功');
						this.$go('manual_message_management');
					}
				});
			} else if (item === 'edit') {
				this.$go('add_edit_message', { title: '新建/编辑消息', id: this.$route.query.id });
			} else if (item === 'revoke') {
				this.confirm('确定撤销消息：' + this.detail.msgTitle + '?', async () => {
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/msgadmin/handmade/repeal',
						data: { planCode: this.$route.query.id },
					});
					if (res && res.code === 200) {
						this.$message.success('撤销成功');
						this.$closeSelf();
						this.$dispatch('MANUAL_MESSAGE_MANAGEMENT_LIST');
						this.$dispatch('MANUAL_MESSAGE_MANAGEMENT_GET_DSH');
					}
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
		padding: 30px 0;
		font-size: $font-size;
		color: $color-body;
		.btn-text {
			margin-left: 10px;
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
.serach-btn {
	margin-left: 10px;
}

.dilog-main {
	max-height: 60vh;
	overflow: auto;
}
</style>
