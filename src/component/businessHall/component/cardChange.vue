<template>
	<div>
		<el-card class="row-gap">
			<h3 slot="header">{{ title.split('|')[0] }}</h3>
			<el-form :model="info" :rules="infoRules" inline label-position="right" label-width="120px" label-suffix=":">
				<el-form-item label="继承卡号" prop="inheritCard">
					<el-input
						size="small"
						v-model="info.inheritCard"
						@change="queryMemberInfo"
						placeholder="继承卡号"
						class="business-input"
						:readonly="viewDetail"
					/>
				</el-form-item>
				<el-form-item label="会员最高等级" prop="maxLevel">
					<el-input
						size="small"
						v-model="info.maxLevel"
						placeholder="会员最高等级"
						class="business-input"
						:readonly="viewDetail"
					/>
				</el-form-item>
				<el-form-item label="个人累计积分" prop="cumtrapz">
					<el-input
						size="small"
						v-model="info.cumtrapz"
						placeholder="个人累计积分"
						class="business-input"
						:readonly="viewDetail"
					/>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>
<script>
export default {
	name: 'cardChange',
	props: {
		info: {
			type: Object,
			default() {
				return {
					inheritCard: '',
					maxLevel: '',
					cumtrapz: '',
				};
			},
		},
		viewDetail: {
			type: Boolean,
		},
		title: {
			type: String,
			default() {},
		},
	},
	data() {
		return {
			infoRules: {
				inheritCard: [{ required: true, message: '请输入继承卡号', trigger: 'blur' }],
			},
			inheritCardinfo: {
				inheritCard: '',
				maxLevel: '',
				cumtrapz: '',
			},
		};
	},
	watch: {
		info: {
			handler(val) {
				this.inheritCardinfo = val;
			},
			deep: true,
		},
	},
	methods: {
		// 通过会员卡号查询顾客信息
		async queryMemberInfo() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/crm/memberHandle/api/queryMemberInfoByCardNo?cardNo=' + this.info.inheritCard,
			});
			if (res && res.data) {
				this.info.maxLevel = res.data.highestLevel;
				this.info.cumtrapz = res.data.cumtrapz;
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.row-gap {
	margin-bottom: 16px;
}
.tips {
	font-size: 12px;
	color: $color-body-se;
	line-height: 22px;
}
.business-input {
	width: 350px;
}
</style>


