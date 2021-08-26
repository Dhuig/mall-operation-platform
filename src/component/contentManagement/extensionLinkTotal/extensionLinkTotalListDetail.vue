<template>
	<div>
		<guideBar />
		<el-card>
			<el-row :gutter="24">
				<el-col :span="8">第三方软件：{{ titleData.thirdPartySoftwareName }}</el-col>
				<el-col :span="8">平台：{{ titleData.platform }}</el-col>
				<el-col :span="8">链接：{{ titleData.link }}</el-col>
			</el-row>
		</el-card>
		<el-card>
			<el-table :data="tableData" style="width: 100%">
				<el-table-column align="center" prop="no" label="序号"></el-table-column>
				<el-table-column align="center" prop="recordDate" label="日期"></el-table-column>
				<el-table-column align="center" prop="visitedCount" label="次数"></el-table-column>
			</el-table>
			<el-pagination
				class="pagination"
				@size-change="handleSizeChange"
				@current-change="handleChangePage"
				:current-page="pagination.pageNum"
				:page-size="pagination.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="pagination.total"
			></el-pagination>
		</el-card>
	</div>
</template>
<script>
export default {
	name: 'extensionLinkTotalListDetail',
	data() {
		return {
			titleData: {},
			tableData: [],
			pagination: {
				total: 0,
				pageNum: 1,
				pageSize: 10,
			},
		};
	},
	computed: {},
	methods: {
		async getData() {
			const { promotionLinkId } = this.$route.query;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/cms/promotionLink/getLinkDetailPage`,
				data: { ...this.pagination, promotionLinkId },
			});
			if (res?.code == 200) {
				const { list, total } = res.data;
				this.pagination.total = total;
				this.tableData = list;
			}
		},
		// 翻页操作
		handleChangePage(page) {
			this.pagination.pageNum = page;
			this.getData();
		},
		// 切换页面条数
		handleSizeChange(pageSize) {
			this.pagination = {
				pageNum: 1,
				pageSize,
				total: 0,
			};
			this.getData();
		},
	},
	async mounted() {
		await this.getData();
		const { thirdPartySoftwareName, platform, link } = this.$route.query;
		this.titleData = {
			thirdPartySoftwareName,
			platform,
			link,
		};
	},
};
</script>
<style lang="scss" scoped>
.pagination {
	margin-top: 20px;
	text-align: right;
}
</style>