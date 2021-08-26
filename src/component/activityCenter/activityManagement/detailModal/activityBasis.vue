<template>
	<div>
		<el-card class="card-gap">
			<div>
				<span>{{ pageData.promotionState | status }}</span>
				<el-button
					class="btns-btn"
					type="primary"
					v-permission="'spike_activity_audit'"
					v-if="pageData.promotionState === 1"
					@click="reivew('review')"
				>
					审核
				</el-button>
				<el-button
					type="primary"
					v-if="pageData.promotionState === 5 || pageData.promotionState === 6 || pageData.promotionState === 1"
					plain
					class="btns-btn"
					v-permission="'spike_activity_edit'"
					@click="reivew('edit')"
				>
					编辑
				</el-button>
				<el-button
					v-if="pageData.promotionState === 2 || pageData.promotionState === 3"
					class="btns-btn"
					plain
					type="danger"
					@click="reivew('stop')"
				>
					停止
				</el-button>
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="config">
				<div class="head-text">基础信息</div>
				<div class="content">
					<span class="left">活动编号：{{ pageData.promotionCode }}</span>
				</div>
				<div class="content">
					<span class="right">活动名称：{{ pageData.promotionName }}</span>
				</div>
				<div class="content">
					<span class="left">开始时间：{{ pageData.startTime }}</span>
				</div>
				<div class="content">
					<span class="right">
						结束时间：{{ pageData.endTime || '不限时' }}
						<span v-if="pageData.endTime">{{ pageData.showEndTime === 0 ? '(不显示)' : '(显示)' }}</span>
					</span>
				</div>
				<div class="content remark-class">
					<div class="remark-left">活动说明：</div>
					<div class="remark-right">{{ pageData.remarks || '--' }}</div>
				</div>
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="config">
				<div class="head-text">购买规则</div>
				<div class="content">
					<span>限购总数量：</span>
					<span class="left" v-if="pageData.limitType == 1">不限量</span>
					<span class="left" v-if="pageData.limitType == 2">每位顾客可以购买每样产品{{ pageData.limitNumber }}件</span>
					<span class="left" v-if="pageData.limitType == 3">
						每位顾客可以购买所有活动产品总共{{ pageData.limitNumber }}件
					</span>
					<span class="left" v-if="pageData.limitType == 4">按需导入</span>
				</div>
				<div class="content">
					<span class="right">支付时效：{{ pageData.payMinute ? pageData.payMinute + '分钟' : '跟随系统' }}</span>
				</div>
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="head-text">优惠券配置</div>
			<tableList
				border
				:dataSource="pageData.coupons"
				slotcontent
				:options="options"
				:columns="COUPON_COLUMNS"
			></tableList>
		</el-card>
		<el-card class="card-gap">
			<div class="config">
				<div class="head-text">预告配置</div>
				<div class="content">
					<span class="left">活动预告时间：{{ pageData.isNotice ? '不预告' : pageData.noticeTime }}</span>
					<div class="pc-hb" v-if="!pageData.isNotice && pageData.noticeContent == 2">
						<div class="pc-left">PC版海报：</div>
						<div class="pc-right" style="margin-left: -24px">
							<img width="200px" :src="pageData.pcPosterImg" alt="" />
						</div>
					</div>
				</div>
				<div class="content" v-if="!pageData.isNotice">
					<span class="right">预告内容：{{ pageData.noticeContent == 1 ? '产品预告' : '海报预告' }}</span>
					<div class="pc-hb" v-if="pageData.noticeContent == 2">
						<div class="pc-left">移动端版海报：</div>
						<div class="pc-right">
							<img width="200px" :src="pageData.appPosterImg" alt="" />
						</div>
					</div>
				</div>
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="config">
				<div class="head-text">参与活动顾客规则</div>
				<div class="content">
					<span class="left">限制方式：{{ pageData.limitCustomer | customerType }}</span>
				</div>
				<div class="content" v-if="pageData.limitCustomer === 2">
					<span class="right">
						客户身份：{{ pageData.memberLists }} {{ pageData.isNewCard === 1 ? '(仅当月新开卡)' : '' }}
					</span>
				</div>
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="head-text">操作记录</div>
			<tableList
				border
				:dataSource="pageData.operations"
				:options="operationsOptions"
				:columns="OPERATING_COLUMNS"
				slotcontent
			>
				<template slot-scope="scope">
					<div>
						<div v-for="(item, index) in scope.data.enclosures" :key="index">
							<span>{{ item.fileName }}</span>
							<span class="btns" @click="downloadWithBlob(item.url)">附件</span>
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
	</div>
</template>

<script>
import { DATA_LIMIT_CUSTOMER, DATA_STATUS_CUSTOMER, LINMIT_MUMBER, COUPON_COLUMNS, OPERATING_COLUMNS } from '../config';
export default {
	name: 'activityBasis',
	props: {
		pageData: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			LINMIT_MUMBER,
			COUPON_COLUMNS,
			OPERATING_COLUMNS,
			options: {
				index: 1,
				labelIndex: '序号',
			},
			operationsOptions: {
				slotcontentText: '附件',
			},
			imgVisible: false,
			imgsrc: '',
		};
	},
	filters: {
		customerType: val => DATA_LIMIT_CUSTOMER[val],
		status: val => DATA_STATUS_CUSTOMER[val],
	},
	computed: {},
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
	},
};
</script>

<style lang="scss" scoped>
.btns-btn {
	margin-left: 10px;
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
