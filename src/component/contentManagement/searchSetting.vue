<template>
	<div>
		<guideBar>
			<el-button
				v-permission="'search_setting_add'"
				type="primary"
				icon="el-icon-plus"
				@click="
					showHotWord = true;
					edit = false;
				"
			>
				新增搜索热词
			</el-button>
		</guideBar>
		<el-card>
			<el-row type="flex" justify="end">
				<el-button
					v-permission="'search_setting_set_order'"
					:type="sortAble ? 'info' : 'primary'"
					icon="el-icon-sort"
					@click="setSort"
				>
					{{ sortAble ? '设置排序' : '完成排序' }}
				</el-button>
			</el-row>
			<el-table :data="data" v-loading="loading">
				<el-table-column type="index" label="序号" width="50" />
				<el-table-column prop="name" label="搜索热词名称" />
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button
							v-permission="'search_setting_edit'"
							size="mini"
							type="primary"
							icon="el-icon-edit-outline"
							@click="handleEdit(scope.row)"
						>
							编辑
						</el-button>
						<el-button
							v-permission="'search_setting_delete'"
							size="mini"
							type="danger"
							icon="el-icon-delete-solid"
							@click="handleDelete(scope.row)"
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
		<!-- 新增热词弹窗 -->
		<el-dialog :title="edit ? '编辑搜索热词' : '新增搜索热词'" :visible.sync="showHotWord" center width="550px" v-drag>
			<el-form
				:model="dialogHotWordForm"
				:rules="rules"
				ref="dialogHotWordForm"
				class="dialogHotWordForm"
				label-width="120px"
				label-position="right"
				label-suffix=":"
			>
				<el-form-item label="搜索热词名称" prop="name">
					<el-input size="mini" v-model="dialogHotWordForm.name" maxlength="40" show-word-limit class="banner-input" />
				</el-form-item>
				<el-form-item label="设置颜色" prop="colorType">
					<el-radio-group v-model="dialogHotWordForm.colorType">
						<el-radio label="1">是</el-radio>
						<el-radio label="0">否</el-radio>
					</el-radio-group>
					<el-row>
						<span class="tipTitle" v-if="dialogHotWordForm.colorType !== '0'">前端搜索热词文字颜色为商城主色</span>
						<span class="tipTitle" v-else>前端搜索热词文字颜色为灰色</span>
					</el-row>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click.stop="svaeHotWord" class="mr-16">保存</el-button>
				<el-button @click.stop="cancelHotWord">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
export default {
	name: 'searchSetting',
	data() {
		return {
			data: [],
			loading: false,
			showHotWord: false,
			dialogHotWordForm: {
				colorType: '1',
			},
			rules: {
				name: [{ required: true, message: '请输入搜索热词名称', trigger: 'blur' }],
			},
			edit: false,
			editId: null,
			sortAble: true,
		};
	},
	created() {
		this.loadWordData();
	},
	methods: {
		// 请求搜索热词数据
		async loadWordData() {
			this.loading = true;
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/searchword/getSearchhotWordsList',
			});
			if (res) {
				this.data = res.data;
				this.loading = false;
			} else {
				this.loading = false;
			}
		},
		// 保存热词
		svaeHotWord() {
			this.$refs['dialogHotWordForm'].validate(async (valid) => {
				if (valid) {
					// 编辑保存
					if (this.edit) {
						const res = await this.$fetch({
							method: 'POST',
							url: '/mgmt/cms/searchword/editSearchHotword/' + this.editId,
							data: {
								color: this.dialogHotWordForm.colorType,
								name: this.dialogHotWordForm.name,
							},
						});
						if (res && res.code == 200) {
							this.$message.success(res.message);
							this.cancelHotWord();
							this.loadWordData();
							this.$$refs['dialogHotWordForm'].resetFields();
						}
					} else {
						// 新增保存
						const res = await this.$fetch({
							method: 'post',
							url: '/mgmt/cms/searchword/saveSearchHotword',
							data: {
								color: this.dialogHotWordForm.colorType,
								name: this.dialogHotWordForm.name,
							},
						});
						if (res && res.code == 200) {
							this.$message.success(res.message);
							this.cancelHotWord();
							this.loadWordData();
						}
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 关闭弹窗
		cancelHotWord() {
			this.$refs['dialogHotWordForm'].resetFields();
			this.showHotWord = false;
		},
		// 编辑热词
		async handleEdit(row) {
			this.edit = true;
			const res = await this.$fetch('/mgmt/cms/searchword/getSearchHotword/' + row.id);
			if (res && res.code == 200) {
				this.showHotWord = true;
				this.dialogHotWordForm = {
					name: res.data.name,
					colorType: String(res.data.color),
				};
				this.editId = res.data.id;
			}
		},
		// 删除热词
		async handleDelete(row) {
			this.$confirm(`此操作将删除热词${row.name}, 是否继续?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'GET',
					url: '/mgmt/cms/searchword/removeSearchHotword/' + row.id,
				});
				if (res && res.code == 200) {
					this.$message.success(res.message);
					this.loadWordData();
				}
			});
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
		// 设置排序
		async setSort() {
			this.sortAble = this.sortAble ? false : true;
			if (this.sortAble) {
				let arr = this.data.map(({ id }, index) => ({ id, sort: this.data.length - index }));
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/cms/searchword/update/sort',
					data: arr,
				});
				if (res && res.code == 200) {
					this.$message.success(res.message);
					this.loadWordData();
				}
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.tipTitle {
	color: #8c939b;
}
.banner-input {
	max-width: 350px;
}
</style>
