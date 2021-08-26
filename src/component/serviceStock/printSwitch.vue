<template>
	<div>
		<guideBar />
		<!-- 基础信息 -->
		<el-card>
			<h3>
				打印对账单开关
				<el-switch
					class="fr"
					v-model="switchData"
					@change="handleSwitch"
					active-text="开"
					inactive-text="关"
					v-permission="'print_switch_toggle'"
				/>
			</h3>
		</el-card>
		<!-- 表格信息 -->
		<el-card>
			<h3 slot="header">历史开关记录</h3>
			<tableList
				border
				:loading="loading"
				:dataSource="dataSource"
				:columns="SERVICE_SWTICH_COLUMNS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="{ index: true, labelIndex: '序号' }"
				@loadMore="loadMore"
			>
				<template slot-scope="data">
					<span>{{ data }}</span>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { SERVICE_SWTICH_COLUMNS } from './config';
import qs from 'querystring';
export default {
	name: 'printSwitch',
	data() {
		return {
			SERVICE_SWTICH_COLUMNS,
			switchData: false,
			dataTotal: 0,
			dataSource: [],
			pagination: {
				pageNum: 1,
				pageSize: 12,
			},
			loading: false,
		};
	},
	mounted() {
		this.loadData();
	},
	computed: {},
	methods: {
		// 请求用户列表
		async loadData() {
			this.loading = true;
			const params = {
				pageNum: this.pagination.pageNum,
				pageSize: this.pagination.pageSize,
			};
			const res = await this.$fetch(`/mgmt/inventory/bill/print-switch-history?${qs.stringify(params)}`);
			if (res.code == 200) {
				this.dataSource = this.dataSource.concat(res.data.list);
				this.dataTotal = res.data.total;
				let status = this.dataSource[0].opType;
				this.switchData = status == 1;
			} else {
				this.dataSource = [];
				this.pagination.total = 0;
			}
			this.loading = false;
		},
		// 下拉滚动
		loadMore() {
			const { pageNum, pageSize } = this.pagination;
			const { dataTotal } = this;
			console.log(dataTotal, this.tabPanes);
			if (pageNum * pageSize >= dataTotal) {
				return this.$message.warning('没有更多数据');
			}
			this.pagination.pageNum++;
			this.loadData();
		},
		// 开关
		async handleSwitch() {
			const res = await this.$fetch({
				method: 'put',
				url: '/mgmt/inventory/bill/print-switch',
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.fr {
	float: right;
}
</style>
