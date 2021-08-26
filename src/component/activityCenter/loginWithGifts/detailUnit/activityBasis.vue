<template>
	<div>
		<el-card class="card-gap">
			<div>
				<span class="status-text">{{ pageData.status | status }}</span>
				<span v-permission="'login_gifts_detail_audit'">
					<el-button class="btns-btn" type="primary" v-if="pageData.status === 1" @click="toAudit">审核</el-button>
				</span>
				<span v-permission="'login_with_gifts_edit'">
					<el-button type="primary" v-if="[1, 4, 5].includes(pageData.status)" plain class="btns-btn" @click="toEdit">
						编辑
					</el-button>
				</span>
				<span v-permission="'login_gifts_detail_stop'">
					<el-button v-if="pageData.status == 2" class="btns-btn" plain type="danger" @click="toStop">停止</el-button>
				</span>
				<span v-permission="'login_gifts_detail_resubmit'">
					<el-button type="primary" v-if="pageData.status == 4" class="btns-btn" plain @click="resubmit">
						再次提交
					</el-button>
				</span>
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="config">
				<div class="head-text">基础信息</div>
				<div class="content">
					<span class="right">活动名称: {{ pageData.activityName }}</span>
				</div>
				<div class="content">
					<span class="left">开始时间: {{ pageData.startTime }}</span>
				</div>
				<div class="content">
					<span class="right">结束时间: {{ pageData.endTime || '不限时' }}</span>
				</div>
				<div class="content">
					<span class="left">领券平台: {{ platforms }}</span>
				</div>
				<div class="content remark-class">
					<div class="remark-left">活动说明:</div>
					<div class="remark-right">{{ pageData.remarks || '--' }}</div>
				</div>
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="head-text">关联优惠券</div>
			<tableList
				border
				:dataSource="pageData.couponList"
				:options="{ index: true, labelIndex: '序号' }"
				:columns="LOGIN_GIFTS_RELATION_COUPON_COLUMNS"
			></tableList>
		</el-card>
		<el-card class="card-gap">
			<div class="config">
				<div class="head-text">提醒配置</div>
				<div class="content">
					<span class="">登录提醒: {{ pageData.remind ? '提醒' : '不提醒' }}</span>
				</div>
			</div>
			<el-row class="section-body" v-if="pageData.remind">
				<el-col :span="2">
					<div class="pc-hb"><div class="pc-left">提醒海报:</div></div>
				</el-col>
				<el-col :span="21">
					<div class="pc-hb">
						<div class="pc-left">PC版海报:</div>
						<div class="pc-right" style="margin-left: -24px">
							<img width="200px" :src="pageData.posterPicPc" alt="" />
						</div>
					</div>
					<div class="pc-hb">
						<div class="pc-left">移动端海报:</div>
						<div class="pc-right">
							<img width="200px" :src="pageData.posterPicApp" alt="" />
						</div>
					</div>
				</el-col>
			</el-row>
		</el-card>
		<el-card class="card-gap">
			<div class="config">
				<div class="head-text">参与活动顾客规则</div>
				<el-row class="section-body">
					<el-col :span="8">限制方式: {{ ACTIVITY_OBJECT[pageData.participants] || '' }}</el-col>
					<el-col :span="8">客户身份: {{ memberTypes }}</el-col>
					<el-col :span="8">
						时间限制:
						<span v-if="pageData.limitCardTime">办卡时间 {{ pageData.cardStartTime }}~{{ pageData.cardEndTime }}</span>
						<span v-else>不限制</span>
					</el-col>
				</el-row>
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="head-text">操作记录</div>
			<tableList
				border
				:dataSource="pageData.operateLogs"
				:options="operationsOptions"
				:columns="LOGIN_GIFTS_OPERATING_COLUMNS"
			>
				<template slot="attachments" slot-scope="scope">
					<div v-if="scope.row.attachments">
						<div v-for="(item, index) in scope.row.attachments" :key="index">
							<span style="margin-right: 10px">{{ item.fileName }}</span>
							<el-button type="text" class="btns" @click="downloadWithBlob(item.url)">下载</el-button>
						</div>
					</div>
				</template>
			</tableList>
		</el-card>
		<el-dialog title="" :visible.sync="imgVisible" v-drag>
			<div style="text-align: center">
				<img :src="imgsrc" alt="" />
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="imgVisible = false">关 闭</el-button>
			</span>
		</el-dialog>

		<!-- 审核弹窗 -->
		<audit-pop :visible="auditVisible" :baseInfo="auditInfo" @cancel="auditVisible = false" @success="auditSuccess" />
	</div>
</template>

<script>
import loginGiftsAuditPop from '../modal/loginGiftsAuditPop';
import { LOGIN_WITH_GIFTS_TAB_NAME, VOUCHER_PLATFORM, ACTIVITY_OBJECT } from '../config';
import { LOGIN_GIFTS_RELATION_COUPON_COLUMNS, LOGIN_GIFTS_OPERATING_COLUMNS } from './config';
import { MEMBER_TYPE } from '../../../accountsManagement/cardVoucherManagement/config';

export default {
	name: 'activityBasis',
	components: {
		'audit-pop': loginGiftsAuditPop,
	},
	props: {
		pageData: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			LOGIN_GIFTS_RELATION_COUPON_COLUMNS,
			LOGIN_GIFTS_OPERATING_COLUMNS,
			ACTIVITY_OBJECT,
			options: {
				index: 1,
				labelIndex: '序号',
			},
			operationsOptions: {
				slotcontentText: '附件',
			},
			imgVisible: false,
			imgsrc: '',

			auditVisible: false, //审核弹窗状态
			auditInfo: {}, //审核弹窗info
		};
	},
	watch: {},
	filters: {
		status: val => LOGIN_WITH_GIFTS_TAB_NAME[val],
	},
	computed: {
		platforms() {
			const { platforms } = this.pageData;
			const result = platforms?.map(item => VOUCHER_PLATFORM[item]);
			return result?.join('、') || '';
		},
		memberTypes() {
			const { memberTypes } = this.pageData;
			const result = memberTypes?.map(item => MEMBER_TYPE[item]);
			return result?.join('、') || '';
		},
	},
	created() {
		console.log();
	},
	methods: {
		async stopCustomer(id) {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/stopPromotion`,
				data: { id },
			});
			if (res && res.code == 200) {
				this.$message.success('停止活动成功');
				this.$parent.$parent.$parent.$parent.loadData();
			}
		},
		reivew(key) {
			let { id } = this.$route.query;
			let { promotionName, promotionCode } = this.pageData;
			switch (key) {
				case 'edit':
					this.$go('add_activity', { id, num: Date.now() });
					break;
				case 'review':
					this.$go('activity_review', { id, promotionName, promotionCode, name: '活动', title: '活动审核' });
					break;
				case 'stop':
					this.$confirm('确定停止活动?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}).then(() => {
						this.stopCustomer(id);
					});
					break;
				default:
					break;
			}
		},
		downloadWithBlob(url) {
			if (!url) return this.$message.error('文件地址不存在, 无法下载');
			if (url.indexOf('.png') != -1 || url.indexOf('.jpg') != -1 || url.indexOf('.jpeg') != -1) {
				this.imgsrc = url;
				this.imgVisible = true;
				return;
			}
			window.open(url);
		},
		// 停止
		toStop() {
			this.$confirm('确认停止活动？<br/>已经领券的顾客不会被影响。', '停止确认', {
				type: 'warning',
				dangerouslyUseHTMLString: true,
			})
				.then(async () => {
					const { id } = this.pageData;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/prmt/loginGift/stopLoginGift',
						data: { id },
					});
					if (res && res.code == 200) {
						this.$message.success('操作成功');
						this.$dispatch('UPDATE_LOGIN_WITH_GIFTS_DETAIL');
						this.$dispatch('UPDATE_LOGIN_WITH_GIFTS_LIST');
					} else {
						this.$message.error('操作失败');
					}
				})
				.catch(() => {});
		},
		// 编辑
		toEdit() {
			this.$go('login_with_gifts_edit', { id: this.pageData.id });
		},
		// 审核
		toAudit() {
			this.auditVisible = true;
			const { id, activityName } = this.pageData;
			this.auditInfo = { id, activityName };
		},
		// 再次提交
		resubmit() {
			this.$confirm('是否再次提交该活动', '提示')
				.then(async () => {
					const { id } = this.pageData;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/prmt/loginGift/resubmitLoginGift',
						data: { id },
					});
					if (res && res.code == 200) {
						this.$message.success('操作成功');
						this.$dispatch('UPDATE_LOGIN_WITH_GIFTS_DETAIL');
						this.$dispatch('UPDATE_LOGIN_WITH_GIFTS_LIST');
					} else {
						this.$message.error('操作失败');
					}
				})
				.catch(() => {});
		},
		//审核成功
		auditSuccess() {
			this.auditVisible = false;
			this.$dispatch('UPDATE_LOGIN_WITH_GIFTS_DETAIL');
			this.$dispatch('UPDATE_LOGIN_WITH_GIFTS_LIST');
		},
	},
};
</script>

<style lang="scss" scoped>
.status-text {
	font-size: 18px;
	color: $color-link;
	font-weight: 600;
}
.btns-btn {
	margin-left: 10px;
}
::v-deep.section-body {
	font-size: $font-size;
}
.config {
	overflow: hidden;
	.content {
		padding: 10px 0;
		width: 50%;
		float: left;
		font-size: $font-size;
	}
}
.head-text {
	font-size: 18px;
	font-weight: 600;
	padding-bottom: 20px;
	.btns {
		color: $color-link;
		cursor: pointer;
	}
}

.pc-hb {
	display: flex;
	.pc-left {
		width: 100px;
		line-height: 50px;
	}
	.pc-right {
		flex: 8.2;
		padding-top: 20px;
	}
}

.remark-class {
	overflow: hidden;
	.remark-left {
		float: left;
		width: 70px;
	}
	.remark-right {
		float: left;
		width: calc(100% - 70px);
		word-wrap: break-word;
		overflow: hidden;
	}
}
.el-dialog__wrapper {
	overflow: auto;
}
</style>
