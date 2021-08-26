<template>
	<div>
		<guideBar>
			<el-button
				type="primary"
				:loading="exportLoading"
				v-permission="'user_today_add_total_detail_export'"
				@click="batchExport"
			>
				导出
			</el-button>
		</guideBar>
		<el-card>
			<el-row type="flex" align="middle">
				<div>数据明细</div>
				<el-date-picker
					class="marginL20"
					v-model="time"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					value-format="yyyy-MM-dd"
					:picker-options="pickerOptions"
				></el-date-picker>
				<el-button type="primary" class="marginL20" @click="getData">搜索</el-button>
			</el-row>
			<el-table :data="tableData.list" border style="margin-top: 20px">
				<el-table-column prop="statisticsDate" label="时间"></el-table-column>
				<el-table-column prop="addMemberOrdi1d" label="普通顾客"></el-table-column>
				<el-table-column prop="addMemberDisc1d" label="优惠顾客（注册）"></el-table-column>
				<el-table-column prop="addMemberUpDisc1d" label="优惠顾客（转换）"></el-table-column>
				<el-table-column prop="addMemberShopOrdi1d" label="新增购货普通顾客"></el-table-column>
				<el-table-column prop="addMemberShopDisc1d" label="新增购货优惠顾客"></el-table-column>
				<el-table-column prop="addMemberShop1d" label="新增购货用户"></el-table-column>
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
import { formatDateStr } from 'util/formValidation';
import { genCurrentMonthFirstAndLastDay } from 'util';
export default {
	name: 'userAddDetail',
	data() {
		return {
			time: [],
			tableData: {
				list: [],
				total: 1,
				pagination: {
					pageNum: 1,
					pageSize: 10,
				},
			},
			exportLoading: false,
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
			},
		};
	},
	methods: {
		async batchExport() {
			this.exportLoading = true;
			const {
				time: [startTime, endTime],
			} = this;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/dataAdmin/export/exportUserIncrease',
				timeout: 60000,
				data: {
					startTime,
					endTime,
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
				tableData: {
					pagination: { pageNum, pageSize },
				},
				time: [startTime, endTime],
			} = this;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/dataAdmin/userData/getDayIncreasePage`,
				data: { pageSize, pageNum, startTime, endTime },
			});
			if (res?.code == 200 && res?.data) {
				const { list, total } = res.data;
				this.tableData.list = list || [];
				this.tableData.total = total || 0;
			}
		},
	},
	mounted() {
		const [start, end] = genCurrentMonthFirstAndLastDay();
		this.time = [formatDateStr(new Date(start), 'day'), formatDateStr(new Date(end), 'day')];
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
