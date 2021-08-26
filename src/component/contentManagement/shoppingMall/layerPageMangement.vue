<template>
	<div>
		<guideBar>
			<el-button v-permission="'layer_page_management_add'" type="primary" icon="el-icon-plus" @click="createNewLayer">
				新增楼层页
			</el-button>
		</guideBar>
		<el-card>
			<el-row type="flex" justify="end">
				<el-button
					v-permission="'layer_page_management_set_order'"
					:type="sortAble ? 'info' : 'primary'"
					icon="el-icon-sort"
					@click="setSort"
				>
					{{ sortAble ? '设置排序' : '完成排序' }}
				</el-button>
			</el-row>
			<el-table :data="data" v-loading="loading">
				<el-table-column type="index" width="50" label="序号" />
				<el-table-column prop="name" label="楼层页菜单" />
				<el-table-column prop="enableStatus" label="状态">
					<template slot-scope="scope">
						{{ scope.row.enableStatus == 0 ? '禁用' : '启用' }}
					</template>
				</el-table-column>
				<el-table-column label="操作" :width="450">
					<template slot-scope="scope">
						<el-button
							size="mini"
							type="primary"
							icon="el-icon-edit-outline"
							v-if="scope.row.enableStatus == 0"
							@click="handleEdit(scope.row.id)"
							v-permission="'layer_page_management_edit'"
						>
							编辑
						</el-button>
						<!-- <el-button size="mini" type="danger" icon="el-icon-delete-solid" @click="handleDelete(scope.row.id)">
							删除
						</el-button> -->
						<el-button
							v-permission="'layer_page_management_toggle_status'"
							size="mini"
							type="success"
							icon="el-icon-edit-outline"
							@click="handleAbleuse(scope.row)"
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
		<el-dialog title="新增楼层页" :visible.sync="showNewLayer" center width="550px" v-drag>
			<el-form
				:model="form"
				:rules="rules"
				ref="layerForm"
				label-width="120px"
				class="theme-form"
				label-position="left"
			>
				<el-form-item label="楼层页菜单:" prop="name">
					<el-input size="mini" v-model="form.name" class="theme-input" />
				</el-form-item>
				<el-form-item label="描述:" prop="descript">
					<el-input
						type="textarea"
						size="mini"
						:autosize="{ minRows: 4 }"
						v-model="form.descript"
						class="theme-input"
					/>
				</el-form-item>
				<el-row type="flex" justify="center" align="center">
					<el-button type="primary" icon="el-icon-check" @click="saveAndExit">保存</el-button>
					<el-button @click="cancelAdd">取消</el-button>
				</el-row>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'layerPageMangement',
	data() {
		return {
			data: [],
			loading: false,
			sortAble: true,
			showNewLayer: false,
			form: {
				name: '',
				descript: '',
			},
			rules: {
				name: [
					{ required: true, message: '请输入楼层页菜单', trigger: 'blur' },
					{ min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
				],
			},
		};
	},
	created() {
		this.$listen('LOAD_LAYER_LIST', this.loadLayerList);
		this.loadLayerList();
	},
	methods: {
		// 请求楼层页列表数据
		async loadLayerList() {
			this.loading = true;
			const res = await this.$fetch('/mgmt/cms/floor/getFloorPageList?pageNum=0&pageSize=0');
			if (res && res.code == 200) {
				this.data = res.data;
			}
			this.loading = false;
		},
		// 新建专题页
		createNewLayer() {
			this.showNewLayer = true;
		},
		// 编辑楼层页
		handleEdit(id) {
			if (!id) return;
			this.$go('/update_layer_page', { title: '编辑楼层页', id });
		},
		// 删除楼层页
		handleDelete(id) {
			this.$confirm('此操作将删除该楼层页配置, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'GET',
					url: '/mgmt/cms/floor/removeFloorPage/' + id,
					data: {
						floorPageId: id,
					},
				});
				if (res && res.code == 200) {
					this.$message.message(res.message);
					this.loadLayerList();
				}
			});
		},
		// 启用禁用楼层页
		async handleAbleuse(row) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/cms/floor/enable',
				data: {
					id: row.id,
					enable: row.enableStatus == 0 ? '1' : '0',
				},
			});
			if (res && res.code == 200) this.loadLayerList();
		},
		// 设置排序
		async setSort() {
			this.sortAble = this.sortAble ? false : true;
			if (this.sortAble) {
				let arr = this.data.map(({ id }, index) => ({ id, sort: this.data.length - index }));
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/cms/floor/update/sort',
					data: arr,
				});
				if (res && res.code == 200) {
					this.$message.success(res.message);
					this.loadLayerList();
				}
			}
		},
		// 预览专题页
		handlePreview(id) {
			if (!id) return;
			this.$go('/update_theme_page', {
				id,
				title: '预览楼层页',
				preview: true,
			});
		},
		// 保存新建楼层
		saveAndExit() {
			this.$refs['layerForm'].validate(async (valid) => {
				if (valid) {
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/cms/floor/saveFloorPage',
						data: this.form,
					});
					if (res && res.code == 200) {
						this.$message.success(res.message);
						this.showNewLayer = false;
						this.$refs['layerForm'].resetFields();
						this.loadLayerList();
						this.$confirm('是否预览?', '提示', {
							confirmButtonText: '预览',
							cancelButtonText: '取消',
							type: 'warning',
						}).then(() => {
							this.$go('layer_page_preview', { title: '预览楼层页', id: res.data.id });
						});
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 取消楼层页
		cancelAdd() {
			this.$refs['layerForm'].resetFields();
			this.showNewLayer = false;
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
