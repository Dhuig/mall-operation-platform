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
import ActiveConfiguration from './modal/activeConfig.vue';
import ProductConfiguration from './modal/product.vue';
import ParticipatingCustomers from './modal/participatingCustomers.vue';
import SubmitYesPage from './modal/submitYesPage.vue';
export default {
	name: 'addChangePurch',
	data() {
		return {
			id: null,
			componentId: '',
			promotion: {
				remarks: '',
				configDto: {
					isNewCard: 0,
					showEndTime: 1,
					limitNumber: -1,
					payLimitTime: 1,
					day: 0,
					hour: 0,
					minute: 0,
					payMinute: 0,
					appPosterImg: '',
					isNotice: 0,
					limitCustomer: 1,
					noticeContent: 2,
					noticeTime: '',
					pcPosterImg: '',
				},
				endTime: '',
				productDtos: [],
				promotionCode: '',
				promotionName: '',
				promotionState: 6,
				promotionType: 2,
				roleIds: [],
				startTime: '',
				memberIdentities: [],
				couponIds: [],
				serialNos: [],
			},
			step: 1,
			stepContent: [
				{ title: '换购配置', description: '配置换购规则和参与换购的产品' },
				{ title: '换购产品配置', description: '添加换购产品，设置换购价格、PV、购买限量' },
				{ title: '选择参与换购的顾客', description: '可以按照顾客类型和分组进行选择' },
				{ title: '完成', description: '' },
			],
		};
	},
	mounted() {
		this.$fetch({ method: 'POST', url: `/mgmt/prmt/deleteCacheMember`, data: { id: null } });
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
			if (this.step >= 3) return;
			if (this.step === 1) this.promotion.productDtos = [];
			this.promotion.configDto.limitCustomer = null;
			this.promotion.roleIds = [];
			this.promotion.memberIdentities = [];
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
				this.$dispatch('CHANGE_PURCHASE_MANAGEMENT_LIST');
				this.$dispatch('CHANGE_PURCHASE_DETAIL_LOADATA');
				this.$message.success('提交成功');
			} else {
				this.$message.error('提交失败');
			}
		},
		async draftSave() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/${this.$route.query.id ? 'editPromotion' : 'addPromotion'}`,
				data: this.initData(),
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
			} else if (this.step === 3) {
				this.$refs.componentInstance.customersData();
			}
		},
		initData() {
			let { productDtos, serialNos } = this.promotion;
			let params = Object.assign({}, this.promotion);
			params.productDtos = productDtos.filter(e => !!e.serialNo);
			params.serialNos = serialNos.filter(e => !!e.serialNo).map(e => e.serialNo);
			return params;
		},
		back() {
			this.$closeSelf();
		},
		save(type) {
			if (type === 'draft') {
				this.draftClear();
				this.stepHandle();
				this.promotion.promotionState = 6;
				this.draftSave();
			} else if (type === 'back') {
				this.back();
			} else if (type === 'goback') {
				this.stepHandle();
				this.step = --this.step;
			} else if (type === 'go') {
				this.stepHandle();
				let { startTime, endTime } = this.promotion;
				if (endTime && startTime >= endTime) return this.$message.warning('活动结束时间必须大于活动开始时间！');
				if (!this.promotion.configDto.limitNumber) {
					this.$message.warning('请输入限制总数');
					return;
				}
				if (this.step === 1 && !this.$refs.componentInstance.isGo()) return;
				if (this.step === 2 && this.promotion.productDtos.length === 0) {
					this.$message.warning('换购产品至少有一个！');
					return;
				}
				this.step = ++this.step;
			} else if (type === 'save') {
				this.saveActivity();
			}
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
				let {
					data,
					data: {
						promotionState,
						endTime,
						startTime,
						productDtos,
						memberIdentities,
						roleIds,
						configDto: { limitCustomer, limitNumber },
					},
				} = res;
				this.promotion = data;
				this.promotion.endTime = endTime ? new Date(endTime).getTime() : endTime;
				this.promotion.startTime = new Date(startTime).getTime();
				this.promotion.memberIdentities = memberIdentities ? memberIdentities : [];
				this.promotion.roleIds = roleIds ? roleIds : [];
				this.promotion.configDto.limitCustomer = limitCustomer ? limitCustomer : 1;
				this.promotion.configDto.limitNumber = limitNumber;
				this.promotion.productDtos = productDtos.map(e => {
					e.originalPrice = e.originalPrice ? e.originalPrice : e.retailPrice;
					return e;
				});
				if (limitCustomer > 0 && promotionState === 6) {
					this.step = 3;
					return;
				}
				if (productDtos.length > 0 && promotionState === 6) this.step = 2;
			}
		},
		goback() {
			this.$confirm('确认返回？已填写的修改不会保存', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
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
