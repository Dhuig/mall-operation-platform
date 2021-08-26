<template>
	<div class="charging-list">
		<guideBar>
			<el-button
				v-permission="'integral_management_add'"
				class="top-btn"
				icon="el-icon-circle-plus-outline"
				type="primary"
				@click="add"
			>
				新建任务
			</el-button>
		</guideBar>
		<el-card>
			<el-tabs v-model="activeStatusTab">
				<el-tab-pane :label="item.label" :name="item.name" v-for="(item, index) in tabPane" :key="index"></el-tab-pane>
			</el-tabs>
			<tableList
				:options="options"
				:dataSource="tabPaneObj.data"
				:columns="CHANGE_COLUMNS"
				:pagination="tabPaneObj.pagination"
				:dataTotal="tabPaneObj.pagination.total"
				:loading="tabPaneObj.loading"
				slotcontent
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			>
				<template slot-scope="scope">
					<el-button v-permission="'integral_management_edit_btn'" type="text" @click="edit(scope.data)">
						编辑
					</el-button>
					<el-button
						v-permission="'integral_management_detail_btn|Integral_detail'"
						type="text"
						@click="detail(scope.data)"
					>
						详情
					</el-button>
					<span v-if="scope.data.ban == 0" class="btn">
						<el-button type="text" v-permission="'integral_management_stop_btn'" @click="stop(scope.data)">
							禁用
						</el-button>
					</span>
					<span v-else class="btn">
						<el-button type="text" v-permission="'integral_management_start_btn'" @click="start(scope.data)">
							启用
						</el-button>
					</span>
				</template>
				<template v-slot:taskExplain="{ row }">
					<div v-for="(item, index) in row.taskExplain" :key="index">{{ item }}</div>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { CHANGE_COLUMNS } from './config';
export default {
	name: 'integralManagement',
	data() {
		return {
			options: {
				index: true,
				labelIndex: '序号',
			},
			CHANGE_COLUMNS,
			tabPane: [],
			getStatus: null,
			activeStatusTab: '',
			tabPaneObj: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
		};
	},
	created() {
		this.getPlanList();
		this.$listen('INTEGRAL_MANAGEMENT', this.loadData);
	},
	methods: {
		async getPlanList() {
			const res = await this.$fetch('/member/tool/getPlanList');
			if (res && res.data) {
				this.tabPane = res.data.map(({ id, planName }) => ({ label: planName, name: id }));
				this.activeStatusTab = res.data[0].id;
			}
		},
		// 翻页操作
		handleChangePage(page) {
			this.tabPaneObj[this.activeStatusTab].pagination.currentPage = page;
			this.loadData();
		},
		// 切换页面条数
		handleSizeChange(pageSize) {
			this.tabPaneObj[this.activeStatusTab].pagination.pageSize = pageSize;
			this.loadData();
		},
		// 温馨提示！：改造load的代码上下文按如下格式最佳，避免出现不必要的错误
		async loadData() {
			const { activeStatusTab } = this;
			const { currentPage: pageNum, pageSize } = this.tabPaneObj.pagination;
			this.tabPaneObj.loading = true;
			let params = { pageNum, pageSize, planId: activeStatusTab };
			const res = await this.$fetch({
				method: 'GET',
				url: `/member/tool/queryPlanInfoList`,
				params: params,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.tabPaneObj.pagination.total = total || 0;
				this.tabPaneObj.data = list;
			}
			this.tabPaneObj.loading = false;
		},
		confirmHandle(text, callback) {
			this.$confirm(`${text}?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				callback && callback();
			});
		},
		async banTaskByName({ ban, taskName }) {
			const res = await this.$fetch({
				method: 'GET',
				url: `/member/tool/banTaskByName`,
				params: { taskName, status: ban == 1 ? 0 : 1 },
			});
			if (res && res.code === 200) {
				this.loadData();
				this.$message.success(res.message);
			}
		},
		stop(row) {
			this.confirmHandle('确定禁用', () => {
				this.banTaskByName(row);
			});
		},
		start(row) {
			this.confirmHandle('确定启用', () => {
				this.banTaskByName(row);
			});
		},
		add() {
			this.$go('add_integral', { title: '新增任务' });
		},
		edit({ id }) {
			this.$go('add_integral', { title: '编辑任务', id, numNow: Date.now() });
		},
		// 详情
		detail({ id, taskName, taskBInfo }) {
			this.$go('Integral_detail', { id, taskName, taskBInfo });
		},
	},
	watch: {
		activeStatusTab: {
			handler(val) {
				if (val == '0') return;
				// 调用查询回调
				this.tabPaneObj.pagination.currentPage = 1;
				this.loadData();
			},
		},
	},
};
</script>
<style lang="scss" scoped>
.btn {
	margin-left: 10px;
}
</style>
