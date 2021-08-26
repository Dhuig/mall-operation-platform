<template>
	<tableList
		border
		:dataSource="list"
		:columns="CLERK_DETAIL_COLUMNS"
		:pagination="pagination"
		:dataTotal="dataTotal"
		:options="{ index: true, labelIndex: '序号' }"
		@handleChangePage="handleChangePage"
		@handleSizeChange="handleSizeChange"
		slotcontent
	>
		<template slot-scope="row">
			<el-button type="text" @click="delateOne(row.data)">删除账号</el-button>
			<el-button type="text" @click="resetPassword(row.data)">重置登录密码</el-button>
		</template>
	</tableList>
</template>

<script>
import { CLERK_DETAIL_COLUMNS } from './config';
import qs from 'querystring';
export default {
	name: 'clerkDetail',
	props: {
		dataSource: {
			type: Array,
		},
		storeCode: String,
		activeName: String,
	},
	data() {
		return {
			CLERK_DETAIL_COLUMNS,
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
			list: [],
		};
	},
	watch: {
		activeName(val) {
			if (val == 'clerkDetail') {
				this.loadData();
			}
		},
	},
	computed: {
		loadDataPost() {
			const {
				storeCode,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			return {
				storeCode,
				pageNum,
				pageSize,
			};
		},
	},
	methods: {
		// 翻页
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 单页数据条数切换
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 删除账号
		delateOne(row) {
			this.$confirm('您确认要删除该用户吗？', '提示')
				.then(async () => {
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/store/clerk/remove',
						data: { storeCode: this.storeCode, id: row.id },
					});
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.loadData();
					} else {
						this.$message.error('操作失败');
					}
				})
				.catch(() => {});
		},
		// 重置登录密码
		resetPassword(row) {
			this.$confirm('您确认要将该用户的服务中心登录密码重置为默认密码88888888', '提示')
				.then(async () => {
					const params = { authClerkId: row.authClerkId, password: 88888888 };
					const res = await this.$fetch(`/auth/store/clerk/resetPassword?${qs.stringify(params)}`);
					if (res && res.code === 200) {
						this.$message.success(res.message || '重置密码成功');
						this.loadData();
					} else {
						this.$message.error(res.data.message || '重置密码失败');
					}
				})
				.catch(() => {});
		},
		// 获取店员资料列表信息
		async loadData() {
			const res = await this.$fetch(`/mgmt/store/clerk/page?${qs.stringify(this.loadDataPost)}`);
			if (res && res.code == 200 && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
			} else {
				this.$message.error('获取店员资料信息失败');
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.box-card {
	margin: 24px 0;
}
.clerkDetail {
	.title {
		margin-bottom: 30px;
		font-weight: 500;
		color: rgba(48, 51, 54, 1);
	}
	.flex {
		display: flex;
		font-weight: 400;
		font-size: 14px;
		color: rgba(92, 98, 104, 1);
		.label {
			width: 120px;
			text-align: right;
		}
		.content {
			margin-left: 16px;
		}
	}
}
</style>
