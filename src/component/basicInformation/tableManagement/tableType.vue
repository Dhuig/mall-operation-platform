<template>
	<div>
		<guideBar>
			<el-button class="top-btn" type="primary" @click="addType" icon="el-icon-circle-plus-outline">新增类型</el-button>
		</guideBar>
		<el-card>
			<tableList
				:dataSource="all.data"
				:columns="TABLE_YTPE_COLUMNS"
				:pagination="all.pagination"
				:dataTotal="all.total"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button type="text" @click="detail(scope.data, 'edit')">编辑</el-button>
					<el-button type="text" @click="detail(scope.data, 'delete')">删除</el-button>
				</template>
			</tableList>
		</el-card>
		<el-dialog :title="title" v-drag :visible.sync="centerDialogVisible" :before-close="close" width="40%">
			<div>
				<el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
					<el-form-item label="表格类型" prop="typeName">
						<el-input
							type="text"
							placeholder="请填写表格类型名称"
							v-model="ruleForm.typeName"
							maxlength="30"
							show-word-limit
						/>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="close">取消</el-button>
				<el-button type="primary" @click="typeSave">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { TABLE_YTPE_COLUMNS } from './config';
export default {
	name: 'tableType',
	data() {
		return {
			title: '新建类型',
			ruleForm: { typeName: '', id: null },
			centerDialogVisible: false,
			TABLE_YTPE_COLUMNS,
			rules: {
				typeName: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
			},
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			all: {
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				total: 0,
			},
		};
	},
	activated() {
		this.loadData();
	},
	methods: {
		addType() {
			this.centerDialogVisible = true;
			this.title = '编辑类型';
		},
		close() {
			this.centerDialogVisible = false;
			this.ruleForm = {};
		},
		async typeSave() {
			this.$refs['ruleForm'].validate(async valid => {
				if (valid) {
					if (this.title === '新建表格') delete this.ruleForm.id;
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/sys/table/type/${this.ruleForm.id ? 'update' : 'save'}`,
						data: this.ruleForm,
					});
					if (res && res.code === 200) {
						this.$message.success(res.message);
						this.centerDialogVisible = false;
						this.ruleForm = {};
						this.loadData();
					}
				}
			});
		},
		handleChangePage(currentPage) {
			this.all.pagination.currentPage = currentPage;
			this.loadData();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.all.pagination.pageSize = pageSize;
			this.loadData();
		},
		// 详情
		async detail({ id, name }, item) {
			if (item === 'edit') {
				this.title = '编辑类型';
				this.ruleForm = { id, name };
				this.centerDialogVisible = true;
			} else {
				this.$confirm('删除后不可恢复，请确认是否要删除?', '删除类型', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(async () => {
					const res = await this.$fetch({
						method: 'DELETE',
						url: '/mgmt/sys/table/type/delete',
						params: { id },
					});
					if (res && res.code === 200) {
						this.$message.success(res.message);
						this.loadData();
					}
				});
			}
		},
		async loadData() {
			let { currentPage: pageNum, pageSize } = this.all.pagination;
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/sys/table/type/page',
				params: { pageNum, pageSize },
			});
			if (res && res.code === 200) {
				let { list, total } = res.data;
				this.all.total = total;
				this.all.data = list;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/elementUi.scss';
.card-gap {
	.top-btn {
		float: right;
		margin-bottom: 14px;
	}
}
</style>
