<template>
	<div>
		<guideBar />
		<el-card>
			<el-steps :active="step">
				<el-step title="活动配置" description="活动的基础设置、高级设置"></el-step>
				<el-step title="选择参与活动的人" description="可以按照顾客类型和导入用户名单"></el-step>
				<el-step title="完成" description=""></el-step>
			</el-steps>
		</el-card>
		<keep-alive>
			<component
				ref="componentInstance"
				:is="componentId"
				:promotion="promotion"
				:id="id"
				:componentname="componentId.name"
				@editSuccess="setData"
			></component>
		</keep-alive>
		<actionBar>
			<template>
				<el-button plain @click="saveDraft" v-show="step < 3">存草稿</el-button>
				<el-button plain @click="goBack" v-show="step == 1">返回</el-button>
				<el-button plain @click="toPrev" v-show="step < 3 && step > 1">上一步</el-button>
				<el-button type="primary" @click="toNext" v-show="step < 2">下一步</el-button>
				<el-button type="primary" @click="saveSubmit" v-show="step === 2">提交审核</el-button>
			</template>
		</actionBar>
	</div>
</template>

<script>
import activityConfig from './unit/activityConfig.vue';
import participatingCustomers from './unit/participatingCustomers.vue';
import submitYesPage from './unit/submitYesPage.vue';
import qs from 'querystring';
export default {
	name: 'loginWithGiftsAdd',
	components: {
		activityConfig,
		participatingCustomers,
		submitYesPage,
	},
	data() {
		return {
			id: null, //活动id
			componentId: 'activityConfig', //组件id
			step: 1, //步骤
			promotion: {
				activityName: '',
				cardEndTime: '',
				cardStartTime: '',
				couponList: [],
				endTime: '',
				id: '',
				importKey: '',
				limitCardTime: '',
				memberTypes: [],
				participants: '',
				platforms: [],
				posterPicApp: '',
				posterPicPc: '',
				remarks: '',
				remind: '',
				startTime: '',
				status: '',
				unlimitedTime: false,
				validImportParticipants: '',
			},
		};
	},
	watch: {
		step: {
			immediate: true,
			handler(val) {
				switch (val) {
					case 1:
						this.componentId = activityConfig;
						break;
					case 2:
						this.componentId = participatingCustomers;
						break;
					case 3:
						this.componentId = submitYesPage;
						break;
					default:
						break;
				}
			},
		},
	},
	methods: {
		// 父组件数据设置
		setData(data) {
			this.promotion = { ...this.promotion, ...data };
		},
		// 存草稿
		async saveDraft() {
			if (!this.$refs.componentInstance.toNext()) return;
			console.log(this.promotion);
			this.promotion.status = 5;
			const res = await this.$fetch({
				method: 'POST',
				url: this.id ? '/mgmt/prmt/loginGift/editLoginGift' : '/mgmt/prmt/loginGift/addLoginGift',
				data: this.promotion,
			});
			if (res && res.code == 200) {
				this.id = this.$route.query.id ? this.$route.query.id : res.data;
				this.promotion.id = this.$route.query.id ? this.$route.query.id : res.data;
				this.$dispatch('UPDATE_LOGIN_WITH_GIFTS_LIST');
				this.$message.success('操作成功');
			} else {
				this.$message.error('操作失败');
			}
		},
		// 返回
		goBack() {
			this.$confirm('确认返回？已填写的修改不会保存', '提示', {
				type: 'warning',
			})
				.then(() => {
					this.$closeSelf();
				})
				.catch(() => {});
		},
		// 上一步
		toPrev() {
			--this.step;
		},
		// 下一步
		toNext() {
			if (!this.$refs.componentInstance.toNext()) return;
			++this.step;
			console.log(this.promotion, 'next');
		},
		// 提交审核
		async saveSubmit() {
			if (!this.$refs.componentInstance.toNext()) return;
			console.log(this.promotion);
			this.promotion.status = 1;
			const res = await this.$fetch({
				method: 'POST',
				url: this.id ? '/mgmt/prmt/loginGift/editLoginGift' : '/mgmt/prmt/loginGift/addLoginGift',
				data: this.promotion,
			});
			if (res && res.code == 200) {
				this.id = this.$route.query.id ? this.$route.query.id : res.data;
				this.promotion.id = this.$route.query.id ? this.$route.query.id : res.data;
				this.step = 3;
				this.$dispatch('UPDATE_LOGIN_WITH_GIFTS_LIST');
				this.$dispatch('UPDATE_LOGIN_WITH_GIFTS_DETAIL', { id: res.data });
				this.$message.success('操作成功');
			} else {
				this.$message.error('操作失败');
			}
		},
		// 获取原始数据（编辑模式）
		async loadData() {
			const res = await this.$fetch(
				`/mgmt/prmt/loginGift/getLoginGift?${qs.stringify({ isEdit: true, loginGiftId: this.id })}`
			);
			if (res && res.code == 200) {
				this.promotion = { ...this.promotion, ...res.data };
			} else {
				this.$message.error('获取数据失败');
			}
		},
	},
	mounted() {
		const { id } = this.$route.query;
		if (id) {
			this.id = id;
			this.loadData();
		}
	},
};
</script>

<style>
</style>