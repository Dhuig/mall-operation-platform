<template>
	<div class="grade-identification-detail">
		<guideBar />
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="list"
				:columns="SERVICE_CENTER_GRADE_IDENTIFICATION_DETAIL_COLUMS"
				:options="{ index: true, labelIndex: '序号' }"
			/>
		</el-card>
	</div>
</template>

<script>
import { SERVICE_CENTER_GRADE_IDENTIFICATION_DETAIL_COLUMS } from './config';
export default {
	name: 'gradeIdentificationDetail',
	data() {
		return {
			SERVICE_CENTER_GRADE_IDENTIFICATION_DETAIL_COLUMS,
			storeCode: '',
			loading: false,
			list: [],
		};
	},
	methods: {
		// 请求数据
		async loadData() {
			this.loading = true;
			const res = await this.$fetch({
				url: `/mgmt/store/getStoreLevelTransferLogList?storeCode=${this.storeCode}`,
				callback: () => {
					this.loading = false;
				},
			});
			if (res && res.data) {
				this.list = res.data || [];
				if (res.data && res.data.length == 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
	},
	mounted() {
		const { storeCode } = this.$route.query;
		if (storeCode) {
			this.storeCode = storeCode;
			this.loadData();
		}
	},
};
</script>

<style>
</style>