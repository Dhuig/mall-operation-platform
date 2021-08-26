<template>
	<div>
		<guideBar>
			<el-button type="primary" :loading="exportLoading" v-permission="'world_top_detail_export'" @click="batchExport">
				导出
			</el-button>
		</guideBar>
		<el-card>
			<el-row type="flex" align="middle">
				<div>数据明细</div>
				<el-radio-group class="marginL20" v-model="day">
					<el-radio-button label="1">昨日</el-radio-button>
					<el-radio-button label="7">7日</el-radio-button>
					<el-radio-button label="30">30日</el-radio-button>
				</el-radio-group>
			</el-row>
			<el-table :data="tableData.list" border style="margin-top: 20px">
				<el-table-column prop="handledName" label="经办人"></el-table-column>
				<el-table-column prop="handledCount" label="开卡人数"></el-table-column>
			</el-table>
			<el-pagination
				border
				class="pagination marginT20"
				:total="tableData.total"
				:current-page.sync="tableData.pagination.pageNum"
				:page-size="tableData.pagination.pageSize"
				@current-change="handleCurrentChange"
				@size-change="handleSizeChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
		</el-card>
	</div>
</template>
<script>
export default {
	name: 'handlerDetail',
	data() {
		return {
			day: '1',
			exportLoading: false,
			tableData: {
				list: [],
				total: 1,
				pagination: {
					pageNum: 1,
					pageSize: 10,
				},
			},
		};
	},
	watch: {
		day() {
			this.getData();
		},
	},
	methods: {
		async batchExport() {
			this.exportLoading = true;
			const { day } = this;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/dataAdmin/export/handledDetail',
				timeout: 60000,
				data: {
					day,
				},
				callback: () => {
					this.exportLoading = false;
				},
			});
			if (res?.code == 200) {
				this.$message.success('excel表格正在生成中，请在下载管理查看');
			} else {
				this.$message.error('操作失败');
			}
		},
		handleCurrentChange(val) {
			this.tableData.pagination.pageNum = val;
			this.getData();
		},
		handleSizeChange(val) {
			this.tableData.pagination.pageSize = val;
			this.tableData.pagination.pageNum = 1;
			this.getData();
		},
		async getData() {
			const {
				day,
				tableData: {
					pagination: { pageNum, pageSize },
				},
			} = this;

			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/dataAdmin/userData/handled/list/detail`,
				params: {
					day,
					pageNum,
					pageSize,
				},
			});
			if (res?.code == 200 && res?.data) {
				const { list, total } = res.data;
				this.tableData.list = list || [];
				this.tableData.total = total || 0;
			}
		},
	},
	mounted() {
		this.getData();
	},
};
</script>
<style lang="scss" scoped>
$height: 20px;
.marginL20 {
	margin-left: $height;
}
.marginT20 {
	margin-top: $height;
}
::v-deep.pagination {
	text-align: right;
}
</style>