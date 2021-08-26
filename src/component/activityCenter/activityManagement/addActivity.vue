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
				:componentname="componentId.name"
				@firstData="firstData"
				@productEmit="productEmit"
				@customersData="customersData"
			></component>
		</keep-alive>
		<actionBar>
			<template>
				<el-button plain @click="save('draft')" v-show="step < 4">存草稿</el-button>
				<el-button plain @click="save('back')" v-show="step == 1">返回</el-button>
				<el-button plain @click="save('goback')" v-show="step < 4 && step > 1">上一步</el-button>
				<el-button type="primary" @click="save('go')" v-show="step < 3">下一步</el-button>
				<el-button type="primary" @click="save('save')" v-show="step === 3">提交审核</el-button>
			</template>
		</actionBar>
	</div>
</template>

<script>
import ActiveConfiguration from './modal/activeConfiguration.vue';
import ProductConfiguration from './modal/productConfiguration.vue';
import ParticipatingCustomers from './modal/participatingCustomers.vue';
import SubmitYesPage from './modal/submitYesPage.vue';
export default {
	name: 'addActivity',
	data() {
		return {
			id: null,
			componentId: '',
			promotion: {
				remarks: '',
				configDto: {
					isNewCard: 0,
					showEndTime: 1,
					limitNumber: '',
					payLimitTime: 1,
					appPosterImg: '',
					isNotice: 0,
					limitCustomer: 1,
					noticeContent: 2,
					noticeTime: '',
					pcPosterImg: '',
					day: 0,
					hour: 0,
					minute: 0,
					payMinute: 0,
					limitType: 1,
				},
				endTime: '',
				productDtos: [],
				promotionCode: '',
				promotionName: '',
				promotionState: 6,
				promotionType: 1,
				roleIds: [],
				startTime: '',
				memberIdentities: [],
				couponIds: [],
				serialNos: [],
			},
			step: 1,
			stepContent: [
				{ title: '活动配置', description: '活动的基础设置、高级设置' },
				{ title: '活动产品配置', description: '添加活动产品，设置活动价格、PV、购买限量' },
				{ title: '选择参与顾客', description: '可以按照顾客类型和分组进行选择' },
				{ title: '完成', description: '' },
			],
		};
	},
	mounted() {
		this.$fetch({
			method: 'POST',
			url: `/mgmt/prmt/deleteCacheMember`,
			data: { id: null },
		});
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
						this.componentId = ProductConfiguration;
						break;
					case 3:
						this.componentId = ParticipatingCustomers;
						break;
					case 4:
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
		draftClear() {
			let { productDtos, couponIds } = this.promotion;
			let data = JSON.parse(JSON.stringify(this.promotion));
			data.productDtos = productDtos.filter(e => !!e.serialNo);
			data.couponIds = couponIds.filter(e => !!e.id).map(e => e.id);
			if (this.step >= 3) return data;
			if (this.step === 1) data.productDtos = [];
			data.configDto.limitCustomer = null;
			data.roleIds = [];
			data.memberIdentities = [];
			return data;
		},
		async saveActivity() {
			this.promotion.promotionState = 1;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/${this.$route.query.id ? 'editPromotion' : 'addPromotion'}`,
				data: this.initData(),
			});
			if (res && res.code == 200) {
				this.id = this.$route.query.id ? this.$route.query.id : res.data;
				this.step = 4;
				this.$dispatch('ACTIVITY_MANAGEMENT_LIST');
				this.$dispatch('SPIKE_ACTIVITY_LOADDATA');
				this.$message.success('提交成功');
			} else {
				this.$message.error('提交失败');
			}
		},
		async draftSave() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/${this.$route.query.id ? 'editPromotion' : 'addPromotion'}`,
				data: { ...this.draftClear(), promotionState: 6 },
			});
			if (res && res.code == 200) {
				this.back();
				this.$message.success(res.message);
			}
		},
		stepHandle() {
			if (this.step === 1) {
				this.$refs.componentInstance.emit();
			} else if (this.step === 2) {
				this.$refs.componentInstance.productEmit();
			} else if (this.step === 3) {
				this.$refs.componentInstance.customersData();
			}
		},
		initData() {
			let { productDtos, couponIds } = this.promotion;
			let params = JSON.parse(JSON.stringify(this.promotion));
			params.productDtos = productDtos.filter(e => !!e.serialNo);
			params.couponIds = couponIds.filter(e => !!e.id).map(e => e.id);
			return params;
		},
		back() {
			this.$dispatch('ACTIVITY_MANAGEMENT_LIST');
			this.$closeSelf();
		},
		save(type) {
			if (type === 'draft') {
				this.stepHandle();
				if (this.dentities()) return this.$message.warning('顾客限制必填');
				this.draftSave();
			} else if (type === 'back') {
				this.goback();
			} else if (type === 'goback') {
				this.stepHandle();
				this.step = --this.step;
			} else if (type === 'go') {
				this.stepHandle();
				let { startTime, endTime, productDtos } = this.promotion;
				if (endTime && startTime >= endTime) return this.$message.warning('活动结束时间必须大于活动开始时间！');
				if (this.step === 1 && !this.$refs.componentInstance.isGo()) return;
				if (this.step === 2 && productDtos.length === 0) return this.$message.warning('活动产品至少有一个！');
				this.step = ++this.step;
			} else if (type === 'save') {
				if (this.dentities()) return this.$message.warning('顾客限制必填');
				this.saveActivity();
			}
		},
		dentities() {
			return this.promotion.configDto.limitCustomer == 2 && this.promotion.memberIdentities.length === 0;
		},
		async firstData(e) {
			this.promotion = Object.assign(this.promotion, e);
		},
		async productEmit(e) {
			this.promotion.productDtos = e;
		},
		async customersData(e) {
			this.promotion = Object.assign(this.promotion, e);
		},
		async loadData() {
			const res = await this.$fetch(`/mgmt/prmt/getPromotionById?id=${this.$route.query.id}`);
			if (res && res.code == 200) {
				let { data } = res;
				let { limitCustomer } = res.data.configDto;
				let { promotionState, endTime, startTime, productDtos, memberIdentities, roleIds } = res.data;
				this.promotion = data;
				this.promotion.endTime = endTime ? new Date(endTime).getTime() : endTime;
				this.promotion.startTime = new Date(startTime).getTime();
				this.promotion.memberIdentities = memberIdentities ? memberIdentities : [];
				this.promotion.roleIds = roleIds ? roleIds : [];
				this.promotion.configDto.limitCustomer = limitCustomer ? limitCustomer : 1;
				if (limitCustomer > 0 && promotionState === 6) return (this.step = 3);
				if (productDtos.length > 0 && promotionState === 6) this.step = 2;
			}
		},
		goback() {
			this.$confirm('确认返回？已填写的修改不会保存', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.back();
				})
				.catch(() => {});
		},
	},
	components: {
		ActiveConfiguration,
		ProductConfiguration,
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
