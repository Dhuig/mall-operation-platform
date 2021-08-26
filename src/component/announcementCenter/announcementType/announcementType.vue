<template>
	<div>
		<guideBar>
			<el-button
				v-permission="'announcement_type_add'"
				class="top-btn"
				type="primary"
				@click="centerDialogVisible = true"
				icon="el-icon-circle-plus-outline"
			>
				添加
			</el-button>
		</guideBar>
		<el-card>
			<tableList
				:dataSource="all.data"
				:columns="CHANGE_COLUMNS"
				:pagination="all.pagination"
				:dataTotal="all.total"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
				@loadMore="loadMore"
			>
				<template slot-scope="scope">
					<el-button v-permission="'announcement_type_edit'" type="text" @click="detail(scope.data, 'edit')">
						编辑
					</el-button>
					<el-button v-permission="'announcement_type_delete'" type="text" @click="detail(scope.data, 'delete')">
						删除
					</el-button>
				</template>
				<template v-slot:status="{ row }">
					<el-switch v-model="row.status" @change="switchClick($event, row)"></el-switch>
				</template>
				<!-- <template v-slot:defalut="123123">
					<span>123456456</span>
				</template> -->
			</tableList>
		</el-card>
		<el-dialog title="添加类型" v-drag :visible.sync="centerDialogVisible" :before-close="close" width="40%">
			<div>
				<el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="160px" class="demo-ruleForm">
					<el-form-item label="类型名称：" prop="typeName">
						<el-input
							type="input"
							class="textarea-input"
							v-model="ruleForm.typeName"
							placeholder="请输入类型名称"
						></el-input>
					</el-form-item>
					<el-form-item label="类型描述：">
						<el-input
							type="textarea"
							class="textarea"
							v-model="ruleForm.typeDesc"
							placeholder="请输入类型描述"
						></el-input>
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
import { CHANGE_COLUMNS } from './config';
export default {
	name: 'announcementType',
	data() {
		return {
			ruleForm: { typeName: '', typeDesc: '' },
			centerDialogVisible: false,
			CHANGE_COLUMNS,
			rules: {
				typeName: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
			},
			all: {
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
					total: 0,
				},
			},
		};
	},
	activated() {
		this.loadData();
		this.$listen('ANNOUNCEMENT_TYPE', this.loadingData);
	},
	methods: {
		loadingData() {
			this.all.pagination.currentPage = 1;
			this.all.data = [];
			this.loadData();
		},
		async switchClick(e, { id }) {
			const res = await this.$fetch({
				method: 'POST',
				url: `/msgadmin/mgmt/msg/notice/changeNoticeTypeStatusById`,
				data: { id },
			});
			if (res && res.code === 200) {
				this.$message.success(res.message);
				this.all.data = this.all.data.map(el => {
					if (el.id == id) el.status = e;
					return el;
				});
				this.loadingData();
				this.$dispatch('ADD_ANNOUNCEMENT_TYPE');
			}
		},
		loadMore() {
			let { currentPage, pageSize, total } = this.all.pagination;
			if (currentPage * pageSize >= total) {
				return this.$message.warning('没有更多数据');
			}
			this.all.pagination.currentPage++;
			this.loadData();
		},
		close() {
			this.centerDialogVisible = false;
			this.ruleForm = {};
		},
		async typeSave() {
			this.$refs['ruleForm'].validate(async valid => {
				if (valid) {
					const res = await this.$fetch({
						method: 'POST',
						url: `/msgadmin/mgmt/msg/notice/${this.ruleForm.id ? 'editNoticeType' : 'addNoticeType'}`,
						data: this.ruleForm,
					});
					if (res && res.code === 200) {
						this.$message.success(res.message);
						this.centerDialogVisible = false;
						this.ruleForm = {};
						this.loadingData();
						this.$dispatch('ADD_ANNOUNCEMENT_TYPE');
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
		async detail({ id, typeName, typeDesc }, item) {
			if (item === 'edit') {
				this.ruleForm = { id, typeName, typeDesc };
				this.centerDialogVisible = true;
			} else {
				this.$confirm('确定' + typeName + '?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(async () => {
					const res = await this.$fetch({
						method: 'POST',
						url: '/msgadmin/mgmt/msg/notice/deleteNoticeType',
						data: { id },
					});
					if (res && res.code === 200) {
						this.loadingData();
						this.$dispatch('ADD_ANNOUNCEMENT_TYPE');
					}
				});
			}
		},
		async loadData() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/msgadmin/mgmt/msg/notice/getNoticeTypeByPage',
				params: this.all.pagination,
			});
			if (res && res.code === 200) {
				let { list, total } = res.data;
				this.all.pagination.total = total;
				let datalist = list.map(e => {
					e.status = e.status == 1;
					return e;
				});
				if (this.all.pagination.pageNum === 1) {
					this.all.data = datalist;
				} else {
					this.all.data = this.all.data.concat(datalist);
				}
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
.textarea {
	font-size: 13px;
}
.textarea-input {
	font-size: 13px;
	font-weight: normal;
}
::v-deep .el-input__inner {
	font-family: 'Courier New', Courier, monospace;
	// &::placeholder {
	// 	font-size: vw(14);
	// }

	// &::-webkit-input-placeholder {
	// 	/* WebKit browsers 适配谷歌 */
	// 	font-size: vw(14);
	// }

	// &:-moz-placeholder {
	// 	/* Mozilla Firefox 4 to 18 适配火狐 */
	// 	font-size: vw(14);
	// }

	// &::-moz-placeholder {
	// 	/* Mozilla Firefox 19+ 适配火狐 */
	// 	font-size: vw(14);
	// }

	// &:-ms-input-placeholder {
	// 	/* Internet Explorer 10+  适配ie*/
	// 	font-size: vw(14);
	// }
}
</style>
