<template>
	<div class="return-detail">
		<guideBar>
			<el-button v-permission="'service_return_detail_export'" type="primary" @click="exportExcel">导出EXCEL</el-button>
		</guideBar>
		<el-card>
			<el-row>
				<el-col :span="6">服务中心编号: {{ baseInfo.storeCode || '' }}</el-col>
				<el-col :span="6">负责人卡号: {{ baseInfo.leaderNo || '' }}</el-col>
				<el-col :span="6">负责人姓名: {{ baseInfo.leaderName || '' }}</el-col>
			</el-row>
		</el-card>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="list"
				:columns="SERVICE_CENTER_RETURN_DETAIL_COLUMN"
				:options="{ index: true, labelIndex: '序号' }"
			/>
		</el-card>
	</div>
</template>

<script>
import { SERVICE_CENTER_RETURN_DETAIL_COLUMN } from './config';
import { exportExcel } from 'util';
export default {
	name: 'returnDetail',
	data() {
		return {
			SERVICE_CENTER_RETURN_DETAIL_COLUMN,
			baseInfo: {},
			loading: false,
			list: [],
		};
	},
	methods: {
		// 导出excel
		exportExcel() {
			const { id } = this.baseInfo;
			exportExcel('/mgmt/inventory/return/config/exportDetailConfig', { id });
		},
		//获取数据
		async loadData() {
			const { id } = this.baseInfo;
			const res = await this.$fetch(`/mgmt/inventory/return/config/detailConfig?id=${id}`);
			if (res && res.data) {
				this.list = res.data;
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
	},
	mounted() {
		this.baseInfo = this.$route.query || {};
		this.loadData();
	},
};
</script>

<style>
</style>