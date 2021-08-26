<template>
	<div>
		<guideBar>
			<el-button v-permission="'theme_page_management_add'" type="primary" icon="el-icon-plus" @click="createNewTheme">
				新增专题页
			</el-button>
		</guideBar>
		<el-card>
			<el-row type="flex" justify="end">
				<el-button
					v-permission="'theme_page_management_set_order'"
					:type="sortAble ? 'info' : 'primary'"
					icon="el-icon-sort"
					@click="setSort"
				>
					{{ sortAble ? '设置排序' : '完成排序' }}
				</el-button>
			</el-row>
			<el-table :data="data" v-loading="loading">
				<el-table-column type="index" label="序号" width="50" />
				<el-table-column prop="name" label="专题页菜单" />
				<el-table-column prop="enableStatus" label="状态">
					<template slot-scope="scope">
						<span>{{ scope.row.enableStatus == 0 ? '禁用' : '启用' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" :width="450">
					<template slot-scope="scope">
						<el-button
							size="mini"
							type="primary"
							icon="el-icon-edit-outline"
							@click="handleEdit(scope.row.id)"
							v-if="!scope.row.enableStatus"
							v-permission="'theme_page_management_edit'"
						>
							编辑
						</el-button>
						<!-- <el-button size="mini" type="danger" icon="el-icon-delete-solid" @click="handleDelete(scope.row.id)">
							删除
						</el-button> -->
						<el-button
							size="mini"
							type="success"
							icon="el-icon-edit-outline"
							@click="handleAbleuse(scope.row)"
							v-permission="'theme_page_management_toggle_status'"
						>
							{{ scope.row.enableStatus == 0 ? '启用' : '禁用' }}
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
		<!-- 新增专题页弹窗 -->
		<el-dialog title="新增专题页" :visible.sync="showNewTheme" center width="550px" v-drag>
			<el-form
				:model="dialogNewThemeForm"
				:rules="rules"
				ref="dialogNewThemeForm"
				label-width="100px"
				label-position="left"
			>
				<el-form-item label="专题页菜单:" prop="menu">
					<el-input size="mini" v-model="dialogNewThemeForm.menu" class="theme-input" />
				</el-form-item>
				<el-form-item label="描述:" prop="description">
					<el-input
						type="textarea"
						size="mini"
						:autosize="{ minRows: 4 }"
						v-model="dialogNewThemeForm.description"
						class="theme-input"
					/>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click.stop="svaeNewTheme" class="mr-16">保存</el-button>
				<el-button @click.stop="cancelNewTheme">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'themePageManagement',
	data() {
		return {
			data: [],
			loading: false,
			showNewTheme: false,
			dialogNewThemeForm: {
				menu: '',
				description: '',
			},
			rules: {
				menu: [
					{ required: true, message: '请输入专题页菜单', trigger: 'blur' },
					{ min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
				],
			},
			sortAble: true,
		};
	},
	methods: {
		// 请求专题页列表数据
		async loadThemeList() {
			this.loading = true;
			const res = await this.$fetch('/mgmt/cms/thematic/getThematicBarList?pageNum=0&pageSize=0');
			if (res && res.code == 200) {
				this.data = res.data;
			}
			setTimeout(() => {
				this.loading = false;
			}, 500);
		},
		// 新建专题页
		createNewTheme() {
			this.showNewTheme = true;
		},
		// 编辑专题页
		handleEdit(id) {
			if (!id) return;
			this.$go('/update_theme_page', { title: '编辑专题页', id });
		},
		// 删除专题页
		handleDelete(id) {
			this.$confirm('此操作将删除该专题页配置, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch('/mgmt/cms/thematic/removeThematicBar/' + id);
				if (res && res.code == 200) {
					this.$message.success('删除成功');
					this.loadThemeList();
				}
			});
		},
		// 启用 禁用
		async handleAbleuse({ id, enableStatus }) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/cms/thematic/enable',
				data: { id, enable: enableStatus == 0 ? 1 : 0 },
			});
			if (res && res.code == 200) {
				this.$message.success(res.message);
				this.loadThemeList();
			}
		},
		swapArray(arr, index1, index2) {
			arr[index1] = arr.splice(index2, 1, arr[index1])[0];
			return arr;
		},
		// 设置排序
		async setSort() {
			this.sortAble = this.sortAble ? false : true;
			if (this.sortAble) {
				let arr = this.data.map(({ id }, index) => ({ id, sort: this.data.length - index }));
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/cms/thematic/update/sort',
					data: arr,
				});
				if (res && res.code == 200) {
					this.$message.success(res.message);
					// this.loadThemeList();
				}
			}
		},
		// 上移
		handleUpper(index) {
			this.swapArray(this.data, index, index - 1);
		},
		// 下移
		handleDownner(index) {
			this.swapArray(this.data, index, index + 1);
		},
		// 保存新增专题页
		svaeNewTheme() {
			this.$refs['dialogNewThemeForm'].validate(async valid => {
				if (valid) {
					this.$confirm('确定新增?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}).then(async () => {
						const res = await this.$fetch({
							method: 'POST',
							url: '/mgmt/cms/thematic/saveThematicBar',
							data: {
								descript: this.dialogNewThemeForm.description,
								name: this.dialogNewThemeForm.menu,
							},
						});
						if (res && res.code == 200) {
							this.$message.success(res.message);
							this.cancelNewTheme();
							this.loadThemeList();
							this.$confirm('是否预览?', '提示', {
								confirmButtonText: '预览',
								cancelButtonText: '取消',
								type: 'warning',
							}).then(() => {
								this.$go('update_theme_page', { title: '预览专题页', id: res.data.id,preview:true });
							});
						}
					});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 取消新增专题页
		cancelNewTheme() {
			this.$refs['dialogNewThemeForm'].resetFields();
			this.showNewTheme = false;
		},
	},
	created() {
		this.$listen('LOAD_THEME_LIST', this.loadThemeList);
		this.loadThemeList();
	},
	mounted() {
		this.loadThemeList();
	},
};
</script>
