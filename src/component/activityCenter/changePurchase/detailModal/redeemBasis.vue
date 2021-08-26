<template>
	<div>
		<el-card class="card-gap">
			<div>
				<span>{{ pageData.promotionState | status }}</span>
				<el-button
					class="btns-btn"
					type="primary"
					v-if="pageData.promotionState === 1"
					v-permission="'change_purchase_detail_audit'"
					@click="reivew('review')"
				>
					审核
				</el-button>
				<el-button
					type="primary"
					v-if="pageData.promotionState === 5 || pageData.promotionState === 6 || pageData.promotionState === 1"
					plain
					class="btns-btn"
					v-permission="'change_purchase_detail_edit'"
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
					<span class="left">换购方案编号：{{ pageData.promotionCode }}</span>
				</div>
				<div class="content">
					<span class="right">换购方案名称：{{ pageData.promotionName }}</span>
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
					<div class="remark-left">换购说明：</div>
					<div class="remark-right">{{ pageData.remarks || '--' }}</div>
				</div>
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="config">
				<div class="head-text">购买规则</div>
				<div class="content">
					<span class="left">
						限购总数量：{{
							pageData.limitNumber > 0
								? `每位顾客最多购买${pageData.limitNumber}件`
								: CHANGE_LIMITNUMBER[pageData.limitNumber]
						}}
					</span>
				</div>
				<div class="content">
					<span class="right">支付时效：{{ pageData.payMinute ? pageData.payMinute + '分钟' : '跟随系统' }}</span>
				</div>
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="config">
				<div class="head-text">参与换购顾客规则</div>
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
			<div class="head-text">加购下列产品后即可换购</div>
			<tableList border :dataSource="pageData.serialNos" :options="options" :columns="COUPON_COLUMNS"></tableList>
		</el-card>
		<el-card class="card-gap" v-if="false">
			<div>
				<div class="head-text">推广链接</div>
				<el-form label-width="140px">
					<el-form-item label="商城Web端链接：" prop="name">
						<el-col :span="10">
							<el-input disabled v-model="pageData.webUrl" placeholder></el-input>
						</el-col>
						<el-button
							type="primary"
							class="btns-btn"
							v-clipboard:copy="pageData.webUrl"
							v-clipboard:success="serachList"
							v-clipboard:error="onCopyError"
						>
							复制
						</el-button>
					</el-form-item>
					<el-form-item label="商城APP端链接：" prop="name">
						<el-col :span="10">
							<el-input disabled v-model="pageData.appUrl" placeholder></el-input>
						</el-col>
						<el-button
							type="primary"
							class="btns-btn"
							v-clipboard:copy="pageData.appUrl"
							v-clipboard:success="serachList"
							v-clipboard:error="onCopyError"
						>
							复制
						</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="head-text">操作记录</div>
			<tableList border :dataSource="pageData.operations" slotcontent :columns="OPERATING_COLUMNS">
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
import {
	DATA_LIMIT_CUSTOMER,
	DATA_STATUS_CUSTOMER,
	CHANGE_LIMITNUMBER,
	COUPON_COLUMNS,
	OPERATING_COLUMNS,
} from '../config';
export default {
	name: 'redeemBasis',
	props: {
		pageData: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			options: {
				index: 1,
				labelIndex: '序号',
			},
			OPERATING_COLUMNS,
			COUPON_COLUMNS,
			activeStatusTab: 'activitydata',
			CHANGE_LIMITNUMBER,
			imgVisible: false,
			imgsrc: '',
		};
	},
	filters: {
		customerType: val => DATA_LIMIT_CUSTOMER[val],
		status: val => DATA_STATUS_CUSTOMER[val],
	},
	created() {},
	methods: {
		async stopCustomer(id) {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/stopPromotion`,
				data: { id },
			});
			if (res && res.code == 200) {
				this.$message.success('停止换购成功');
				this.$parent.$parent.$parent.$parent.loadData();
			}
		},
		reivew(key) {
			let { id } = this.$route.query;
			let { promotionName, promotionCode } = this.pageData;
			switch (key) {
				case 'edit':
					this.$go('add_change_purch', { id, num: Date.now() });
					break;
				case 'review':
					this.$go('activity_review', { id, promotionName, promotionCode, name: '换购', title: '换购审核' });
					break;
				case 'stop':
					this.$confirm('确定停止换购?', '提示', {
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
			console.log(url);
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
}
.btns {
	margin-left: 10px;
	color: $color-link;
	cursor: pointer;
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
