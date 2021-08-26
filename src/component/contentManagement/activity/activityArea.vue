<template>
	<div>
		<guideBar>
			<el-button v-permission="'activity_area_add'" type="primary" icon="el-icon-plus" @click="addNewActive">
				新增活动
			</el-button>
		</guideBar>
		<el-card>
			<el-row type="flex" justify="end">
				<el-button
					v-permission="'activity_area_set_order'"
					:type="sortAble ? 'info' : 'primary'"
					icon="el-icon-sort"
					@click="setSort"
				>
					{{ sortAble ? '设置排序' : '完成排序' }}
				</el-button>
			</el-row>
			<el-table :data="data" v-loading="loading">
				<el-table-column type="index" label="序号" width="50" />
				<el-table-column prop="name" label="活动名称" />
				<el-table-column prop="noticeTime" label="预告时间">
					<template slot-scope="scope">
						<span>{{ scope.row.noticeTime | timestampFormat }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="startTime" label="开始时间">
					<template slot-scope="scope">
						<span>{{ scope.row.startTime | timestampFormat }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="endTime" label="结束时间">
					<template slot-scope="scope">
						<span>{{ scope.row.endTime | timestampFormat }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" :width="450">
					<template slot-scope="scope">
						<el-button
							size="mini"
							type="primary"
							icon="el-icon-edit-outline"
							@click="handleEdit(scope.row.id)"
							v-permission="'activity_area_edit'"
						>
							编辑
						</el-button>
						<el-button
							size="mini"
							type="danger"
							icon="el-icon-delete-solid"
							@click="handleDelete(scope.row)"
							v-permission="'activity_area_delete'"
						>
							删除
						</el-button>
						<el-button
							size="mini"
							icon="el-icon-top"
							@click="handleUpper(scope.$index)"
							:disabled="scope.$index == 0 || sortAble"
						>
							上移
						</el-button>
						<el-button
							size="mini"
							icon="el-icon-bottom"
							@click="handleDownner(scope.$index)"
							:disabled="scope.$index == data.length - 1 || sortAble"
						>
							下移
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>
<script>
export default {
	name: 'activityArea',
	data() {
		return {
			data: [],
			loading: false,
			sortAble: true,
		};
	},
	created() {
		this.$listen('LOAD_ACTIVE_LIST', this.loadAciveList);
		this.loadAciveList();
	},
	methods: {
		// 获取活动专区数据
		async loadAciveList() {
			this.loading = true;
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/activity/getActivityList',
			});
			if (res) {
				this.data = res.data;
				this.loading = false;
			} else {
				this.loading = false;
			}
		},
		// 新增活动
		addNewActive() {
			this.$go('/update_active_page', { title: '新增活动' });
		},
		// 删除活动
		async handleDelete(row) {
			this.$confirm(`是否确认删除?`, '提示', {
				confirmButtonText: '是',
				cancelButtonText: '否',
				type: 'warning',
			})
				.then(async () => {
					const res = await this.$fetch({
						method: 'GET',
						url: '/mgmt/cms/activity/removeActivity/' + row.id,
					});
					if (res) {
						this.$message({
							type: 'success',
							message: res.message,
						});
						this.loadAciveList();
					}
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		// 编辑
		handleEdit(id) {
			this.$go('/update_active_page', { title: '编辑活动', id });
		},
		// 设置排序
		async setSort() {
			this.sortAble = this.sortAble ? false : true;
			if (this.sortAble) {
				let arr = [];
				this.data.map((item, index) => {
					let obj = {};
					obj.id = item.id;
					obj.sort = this.data.length - index;
					arr.push(obj);
				});
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/cms/activity/update/sort',
					data: arr,
				});
				if (res) {
					this.$message({
						type: 'success',
						message: res.message,
					});
					this.loadAciveList();
				}
			}
		},
		swapArray(arr, index1, index2) {
			arr[index1] = arr.splice(index2, 1, arr[index1])[0];
			return arr;
		},
		// 上移
		handleUpper(index) {
			this.swapArray(this.data, index, index - 1);
		},
		// 下移
		handleDownner(index) {
			this.swapArray(this.data, index, index + 1);
		},
	},
};
</script>
<style lang="scss" scoped>
::v-deep.pagination {
	text-align: right;
	.el-pagination__sizes {
		float: left;
	}
	.el-pagination__total {
		float: left;
	}
}
</style>
