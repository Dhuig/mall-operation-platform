<template>
	<div class="main">
		<guideBar>
			<el-button type="primary" plain @click="goback">返回</el-button>
		</guideBar>
		<el-card class="card-gap">
			<el-steps :active="step" align-center>
				<el-step
					:title="item.title"
					:description="item.description"
					v-for="(item, index) in stepContent"
					:key="index"
				></el-step>
			</el-steps>
		</el-card>
		<keep-alive>
			<component
				ref="componentInstance"
				:is="componentId"
				:promotion="promotion"
				:id="id"
				@firstData="firstData"
				@productEmit="productEmit"
				@PromotionCode="PromotionCodes"
			></component>
		</keep-alive>
		<actionBar>
			<template>
				<el-button plain @click="save('draft')" v-show="step < 3">存草稿</el-button>
				<el-button plain @click="save('back')" v-show="step == 1">返回</el-button>
				<el-button plain @click="save('goback')" v-show="step < 3 && step > 1">上一步</el-button>
				<el-button type="primary" @click="save('go')" v-show="step < 2">下一步</el-button>
				<el-button type="primary" @click="save('save')" v-show="step === 2">提交审核</el-button>
			</template>
		</actionBar>
	</div>
</template>

<script>
import ActiveConfiguration from './modal/activeConfiguration.vue';
import ParticipatingCustomers from './modal/participatingCustomers.vue';
import SubmitYesPage from './modal/submitYesPage.vue';
export default {
	name: 'addEditCoupon',
	data() {
		return {
			id: null,
			componentId: '',
			cacheData: {},
			promotion: {
				platforms: [],
				limitStore: 0,
				categoryIds: [], //分类ID
				couponCount: -1,
				limitCount: 0,
				couponName: '',
				couponNumber: '',
				couponState: 1,
				couponType: 2,
				endTime: null,
				faceValue: '',
				grantCount: 0,
				isGenerateCode: 0,
				isStacked: 0,
				minAmount: '',
				promotionIds: [],
				remarks: '',
				serialNos: [],
				disableSerialNos: [],
				startTime: null,
				useRange: 1,
				usedCount: 0,
			},
			step: 1,
			stepContent: [
				{ title: '优惠券规则', description: '优惠券的基础设置' },
				{ title: '优惠券的适用范围', description: '添加优惠券适用产品或活动' },
				{ title: '完成', description: '' },
			],
			nowNum: null,
			promotionCodes: 1,
		};
	},
	mounted() {
		this.$listen('ADD_EDIT_ACTIVI', this.loadData);
		if (this.$route.query && this.$route.query.id) this.loadData();
	},
	watch: {
		step: {
			handler(val) {
				switch (val) {
					case 1:
						this.componentId = ActiveConfiguration;
						break;
					case 2:
						this.componentId = ParticipatingCustomers;
						break;
					case 3:
						this.componentId = SubmitYesPage;
						break;
					default:
						break;
				}
			},
			immediate: true,
		},
	},
	methods: {
		PromotionCodes(e) {
			this.promotionCodes = e;
		},
		draftClear() {
			if (this.step >= 2) return;
			if (this.step === 1) this.promotion = [];
			this.promotion.roleIds = [];
			this.promotion.memberIdentities = [];
		},
		async saveAddCoupon() {
			if (!this.warning()) return;
			let { query } = this.$route;
			this.promotion.couponState = 1;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/coupon/${query && query.id ? 'editCoupon' : 'addCoupon'}`,
				data: this.promotion,
			});
			if (res && res.code == 200) {
				this.id = res.data;
				this.step = 3;
				this.$dispatch('COUPONMANAGEMENT_LIST');
				this.$message.success('提交成功');
			} else {
				this.promotion = Object.assign(this.promotion, this.cacheData);
			}
		},
		warning() {
			let { serialNos, useRange, promotionIds } = this.promotion;
			if (promotionIds.length === 0 && useRange === 5 && this.step === 2) {
				this.promotion = Object.assign(this.promotion, this.cacheData);
				this.$message.warning('请至少添加一项活动！');
				return;
			}
			if (serialNos.length === 0 && (useRange === 2 || useRange === 3) && this.step === 2) {
				this.promotion = Object.assign(this.promotion, this.cacheData);
				this.$message.warning('请至少添加一项可用产品！');
				return;
			}
			return true;
		},
		async draftSave() {
			if (!this.warning()) return;
			let { query } = this.$route;
			this.promotion.couponState = 7;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/coupon/${query && query.id ? 'editCoupon' : 'addCoupon'}`,
				data: this.promotion,
			});
			if (res && res.code == 200) {
				this.back();
				this.$message.success('保存草稿成功');
			} else {
				this.$message.error('保存草稿失败');
			}
		},
		stepHandle() {
			if (this.step === 1) {
				this.$refs.componentInstance.emit();
			} else if (this.step === 2) {
				this.$refs.componentInstance.productEmit();
			}
		},
		initData() {
			let { promotionIds, serialNos, useRange, disableSerialNos } = this.promotion;
			this.cacheData = JSON.parse(JSON.stringify(this.promotion));
			this.promotion.promotionIds = promotionIds.filter(e => !!e.id).map(e => e.id);
			this.promotion.serialNos = serialNos.filter(e => !!e.serialNo).map(e => e.serialNo);
			this.promotion.disableSerialNos = disableSerialNos.filter(e => !!e.serialNo).map(e => e.serialNo);
			if (useRange === 4) {
				this.promotion.promotionIds = [];
				this.promotion.serialNos = [];
			}
			if (useRange === 3 || useRange === 2) {
				this.promotion.categoryIds = [];
				this.promotion.promotionIds = [];
			}
			if (useRange === 1) {
				this.promotion.promotionIds = [];
				this.promotion.serialNos = [];
				this.promotion.categoryIds = [];
			}
			if (this.step === 1) {
				this.promotion.promotionIds = [];
				this.promotion.serialNos = [];
				this.promotion.categoryIds = [];
				this.promotion.useRange = null;
			}
		},
		back() {
			this.$closeSelf();
		},
		save(type) {
			if (type === 'draft') {
				this.stepHandle();
				this.initData();
				this.draftSave();
			} else if (type === 'back') {
				this.back();
			} else if (type === 'goback') {
				this.stepHandle();
				this.step = --this.step;
			} else if (type === 'go') {
				this.stepHandle();
				let { startTime, endTime, faceValue, couponType, minAmount } = this.promotion;
				if (endTime && startTime > endTime) return this.$message.warning('失效时间必须大于生效时间！');
				let { isGo, isGos } = this.$refs.componentInstance;
				if (!isGo() || !isGos()) return;
				if (couponType !== 1 && faceValue > minAmount) return this.$message.warning('优惠券面值不能大于使用条件');
				if (this.promotionCodes !== 1) return this.$message.warning('该编号重复!');
				this.step = ++this.step;
				if (!this.promotion.useRange) {
					this.promotion.useRange = 1;
				}
			} else if (type === 'save') {
				this.stepHandle();
				this.initData();
				this.saveAddCoupon();
			}
		},
		async firstData(e) {
			this.promotion = Object.assign(this.promotion, e);
		},
		async productEmit(e) {
			this.promotion = e;
		},
		async loadData() {
			const res = await this.$fetch(`/mgmt/prmt/coupon/getCouponById?id=${this.$route.query.id}`);
			if (res && res.code == 200) {
				let { categoryIds, promotionIds, serialNos, endTime, startTime, useRange, disableSerialNos } = res.data;
				this.promotion = res.data;
				this.promotion.endTime = new Date(endTime).getTime();
				this.promotion.startTime = new Date(startTime).getTime();
				this.promotion.categoryIds = categoryIds ? categoryIds : [];
				this.promotion.promotionIds = promotionIds
					? promotionIds
					: [{ id: '', endTime: '', promotionCode: '', promotionName: '', startTime: '' }];
				this.promotion.serialNos = serialNos || [];
				this.promotion.disableSerialNos = disableSerialNos || [];
				let { status } = this.$route.query;
				if (useRange > 0 && status && status * 1 === 7) {
					this.step = 2;
				}
			}
		},
		goback() {
			this.$closeSelf();
		},
	},
	components: {
		ActiveConfiguration,
		ParticipatingCustomers,
		SubmitYesPage,
	},
};
</script>

<style lang="scss" scoped>
.card-gap {
	&:nth-of-type(3) {
		margin-top: 10px;
	}
	&:nth-of-type(4) {
		margin-top: 10px;
	}
	&:nth-of-type(5) {
		margin-top: 10px;
	}
	.form-width-protect {
		padding: 0 40px;
	}
	.head-text {
		font-size: 18px;
		font-weight: 600;
		padding: 0 0 20px 30px;
	}
	.module-text {
		margin-left: 10px;
		color: $color-link;
	}
}
.btns {
	color: #0877fd;
	cursor: pointer;
	margin-right: 18px;
}
.dilog-serach {
	padding: 10px 20px;
	.serach-btn {
		margin-left: 10px;
	}
}
::v-deep .el-step__title.is-process {
	color: #8c939b;
	font-weight: 400;
}
::v-deep .el-step__head.is-process {
	color: #8c939b;
	font-weight: 400;
	border-color: #8c939b;
}
::v-deep .el-step__description.is-process {
	color: #8c939b;
}
::v-deep .el-dialog__body {
	// 深度修改样式
	padding: 0px 20px;
}
.dilog-main {
	position: relative;
	padding: 0 30px;
	height: 360px;
	overflow: auto;
}

.table_list_fix {
	overflow: hidden;
	.tab-btn {
		height: 45px;
		overflow: hidden;
		.tab-btns {
			float: right;
			margin-right: 10px;
		}
	}
	.btn-operates {
		margin-bottom: 6px;
		a {
			color: #fff;
			text-decoration: none;
			display: inline-block;
		}
	}
}
.table-header {
	padding-top: 10px;
	.table-header_button {
		text-align: right;
		float: right;
		margin-bottom: 12px;
		line-height: 40px;
	}
}
</style>
