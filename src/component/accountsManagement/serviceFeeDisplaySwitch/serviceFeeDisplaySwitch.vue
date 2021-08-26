<template>
	<div class="service-fee-display-switch">
		<guideBar />
		<el-card class="box-card">
			<div class="card-title">服务费显示开关</div>
			<el-switch
				v-permission="'service_fee_display_switch_toggle'"
				v-model="switchStatus"
				active-color="#3883F8"
				@change="switchChange"
			></el-switch>
		</el-card>
		<el-card class="box-card">
			<div class="card-title">历史启闭记录</div>
			<tableList
				border
				:dataSource="list"
				:columns="SWITCH_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			/>
		</el-card>
	</div>
</template>

<script>
import { SWITCH_COLUMNS_CONFIG } from './config';
import qs from 'querystring';
export default {
	name: 'serviceFeeDisplaySwitch',
	data() {
		return {
			SWITCH_COLUMNS_CONFIG,
			switchStatus: true,
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 200,
			list: [
				{
					editTime: '2020-08-27 16:08:03',
					type: '开启',
					editor: 'admin',
				},
			],
		};
	},
	computed: {
		loadDataPost() {
			const { currentPage: pageNum, pageSize } = this.pagination;
			return {
				pageNum,
				pageSize,
				type: 1,
			};
		},
	},
	methods: {
		// 翻页操作
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 切换页面条数
		handleSizeChange(pageSize) {
			this.pagination = {
				currentPage: 1,
				pageSize,
			};
			this.loadData();
		},
		// 开关修改调用方法
		async switchChange() {
			const data = { type: 1, value: Number(this.switchStatus) };
			const res = await this.$fetch(`/mgmt/fin/wallet/updateAccountConfig?${qs.stringify(data)}`);
			if (res && res.code === 200) {
				this.$message.success('操作成功');
			} else {
				this.$message.error('操作失败');
			}
		},
		// 获取服务费显示开关信息
		async loadSwitchInfo() {
			const res = await this.$fetch(`/mgmt/fin/wallet/getAccountConfigValue?type=1`);
			if (res && res.code === 200) {
				this.switchStatus = Boolean(res.data);
			} else {
				this.$message.error('获取服务费显示开关信息失败');
			}
		},
		// 获取历史启闭记录数据
		async loadData() {
			const res = await this.$fetch(`/mgmt/fin/wallet/getAccountConfig?${qs.stringify(this.loadDataPost)}`);
			if (res && res.data) {
				const { list, total } = res.data;
				if (list.length) {
					this.list = list;
					this.dataTotal = total;
				} else {
					this.list = [];
					this.dataTotal = 0;
				}
			} else {
				this.$message.error('获取历史启闭记录数据失败');
			}
		},
	},
	mounted() {
		this.loadSwitchInfo();
		this.loadData();
	},
};
</script>

<style lang="scss" scoped>
.service-fee-display-switch {
	.box-card {
		margin-bottom: 16px;
	}
	.card-title {
		margin-bottom: 16px;
	}
}
</style>
