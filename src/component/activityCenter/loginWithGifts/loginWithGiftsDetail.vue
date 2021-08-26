<template>
	<div class="login-with-gifts-detail">
		<guideBar />
		<el-card>
			<el-tabs v-model="activeStatusTab">
				<el-tab-pane label="活动规则" name="activitybasis">
					<activity-basis :pageData="pageData" />
				</el-tab-pane>
				<el-tab-pane label="活动顾客" name="customer" v-if="pageData.participants == 4">
					<activity-customer :pageData="pageData" :active="activeStatusTab" :id="id" ref="activitycustomer" />
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import ActivityBasis from './detailUnit/activityBasis';
import ActivityCustomer from './detailUnit/activityCustomer';
import qs from 'querystring';

export default {
	name: 'loginWithGiftsDetail',
	components: {
		'activity-basis': ActivityBasis,
		'activity-customer': ActivityCustomer,
	},
	data() {
		return {
			id: '', //活动id
			activeStatusTab: 'activitybasis',
			pageData: {},
		};
	},
	computed: {
		isEditMode() {
			return this.$route.query.type == 'edit';
		},
	},
	methods: {
		// 获取数据
		async loadData() {
			const res = await this.$fetch(
				`/mgmt/prmt/loginGift/getLoginGift?${qs.stringify({ isEdit: false, loginGiftId: this.id })}`
			);
			if (res && res.code == 200) {
				this.pageData = res.data;
			} else {
				this.$message.error('获取数据失败');
			}
		},
	},
	created() {},
	mounted() {
		this.id = this.$route.query.id;
		this.loadData();
		this.$listen('UPDATE_LOGIN_WITH_GIFTS_DETAIL', this.loadData);
	},
};
</script>

<style lang="scss" scoped>
::v-deep.login-with-gifts-detail {
	.status {
		font-size: 18px;
		color: $color-link;
		font-weight: 600;
	}
	.section-title {
		font-size: 16px;
		font-weight: 600;
		margin-bottom: 16px;
	}
}
</style>