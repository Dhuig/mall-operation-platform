<template>
	<div>
		<guideBar />
		<el-row type="flex" justify="end" class="marginB20">
			<el-button
				type="primary"
				v-permission="'material_classification_add_source'"
				icon="el-icon-plus"
				@click="openLabelDialog()"
			>
				新增素材分类
			</el-button>
		</el-row>
		<el-card>
			<el-row type="flex" justify="end">
				<el-button
					v-permission="'material_classification_sort_source'"
					:type="sortAble ? 'info' : 'primary'"
					icon="el-icon-sort"
					@click="setSort"
				>
					{{ sortAble ? '设置排序' : '完成排序' }}
				</el-button>
			</el-row>
			<el-table :data="tabPanes.data" v-loading="tabPanes.loading">
				<el-table-column prop="name" label="分类名称" />
				<el-table-column label="操作" :width="450">
					<template slot-scope="scope">
						<el-button
							size="mini"
							type="primary"
							icon="el-icon-edit-outline"
							v-permission="'material_classification_edit_source'"
							@click="openLabelDialog('编辑素材分类', true, scope.row)"
						>
							编辑
						</el-button>
						<el-button
							v-permission="'material_classification_delete_source'"
							size="mini"
							type="danger"
							icon="el-icon-delete-solid"
							@click="delLabel(scope.row.id)"
						>
							删除
						</el-button>
						<el-button
							size="mini"
							icon="el-icon-top"
							@click="handleUpper(scope.$index)"
							v-permission="'material_classification_sort_source'"
							:disabled="scope.$index == 0 || sortAble"
						>
							上移
						</el-button>
						<el-button
							size="mini"
							icon="el-icon-bottom"
							@click="handleDownner(scope.$index)"
							v-permission="'material_classification_sort_source'"
							:disabled="scope.$index == tabPanes.data.length - 1 || sortAble"
						>
							下移
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<!-- 添加素材分类页弹窗 -->
		<el-dialog :title="dialog.title" :visible.sync="dialog.show" center width="550px" v-drag>
			<el-form
				:model="dialogLabelForm"
				:rules="CLASSIFICATION_OR_LABEL_RULE"
				ref="dialogLabelForm"
				label-width="100px"
				label-position="left"
			>
				<el-form-item label="分类名称" prop="name">
					<el-input
						placeholder="请输入分类名称"
						maxlength="20"
						show-word-limit
						size="mini"
						v-model="dialogLabelForm.name"
					/>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button type="primary" @click.stop="saveLabel">保存</el-button>
				<el-button @click.stop="cancelLabel">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { TABITEM, CLASSIFICATION_OR_LABEL_RULE, COMMONDATA } from './config';
export default {
	name: 'materialClassification',
	data() {
		return {
			CLASSIFICATION_OR_LABEL_RULE,
			tabPanes: new TABITEM(),
			dialog: {
				title: '',
				show: false,
			},
			dialogLabelForm: {
				name: '',
				id: null,
			},
			sortAble: true,
		};
	},
	methods: {
		// 获取素材列表列表数据
		async loadData() {
			const { tabPanes } = this;

			tabPanes.loading = true;

			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/cms/typeLabel/queryTypeLabelList`,
				timeout: 60000 * 1,
				data: COMMONDATA,
			});
			if (res?.code == 200) {
				const { cmsLabelRespVos } = res.data;
				tabPanes.data = cmsLabelRespVos;
			}
			tabPanes.loading = false;
		},
		// 打开新建分类
		openLabelDialog(title = '新建素材分类', show = true, row = null) {
			if (row) {
				this.dialogLabelForm = { ...row };
			} else {
				this.dialogLabelForm = {
					name: '',
					id: null,
				};
			}
			this.dialog = {
				title,
				show,
			};
		},
		// 保存新建分类 验证
		saveLabel() {
			const { id } = this.dialogLabelForm;
			this.$refs.dialogLabelForm.validate(valid => {
				if (valid) {
					id ? this.editLabel() : this.establishLabel();
				}
			});
		},
		// 创建分类 接口
		async establishLabel() {
			const {
				dialogLabelForm: { name },
			} = this;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/cms/typeLabel/addTypeLabel`,
				timeout: 60000 * 1,
				data: {
					...COMMONDATA,
					name,
				},
			});
			if (res?.code == 200) {
				this.cancelLabel();
				this.loadData();
			}
		},
		// 修改分类 接口
		async editLabel() {
			const { dialogLabelForm } = this;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/cms/typeLabel/updateTypeLabel`,
				timeout: 60000 * 1,
				data: {
					...COMMONDATA,
					...dialogLabelForm,
				},
			});
			if (res?.code == 200) {
				this.cancelLabel();
				this.loadData();
			}
		},
		// 删除分类 接口
		delLabel(id) {
			this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				center: true,
			}).then(async () => {
				const res = await this.$fetch({
					method: 'DELETE',
					url: `/mgmt/cms/typeLabel/delTypeLabelById/${id}`,
					timeout: 60000 * 1,
				});
				if (res?.code == 200) {
					this.loadData();
				} else {
					if (this.$store.getters['system/getError']) {
						this.$message.error(res.data.message);
					}
				}
			});
		},
		// 上移
		handleUpper(index) {
			this.swapArray(this.tabPanes.data, index, index - 1);
		},
		// 下移
		handleDownner(index) {
			this.swapArray(this.tabPanes.data, index, index + 1);
		},
		swapArray(arr, index1, index2) {
			arr[index1] = arr.splice(index2, 1, arr[index1])[0];
			return arr;
		},
		// 排序
		async setSort() {
			const {
				tabPanes: { data },
			} = this;
			this.sortAble = this.sortAble ? false : true;
			if (this.sortAble) {
				let cmsLabelUpdateBatchReqVOS = data.map(({ id }, index) => ({
					id,
					sort: data.length - index,
				}));
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/cms/typeLabel/sortTypeLabel',
					data: {
						...COMMONDATA,
						cmsLabelUpdateBatchReqVOS,
					},
				});
				if (res?.code == 200) {
					this.$message.success(res.message);
				}
			}
		},
		// 取消新建分类
		cancelLabel() {
			this.$refs.dialogLabelForm.resetFields();
			this.dialog.show = false;
		},
	},
	mounted() {
		this.loadData();
	},
};
</script>
<style lang="scss" scoped>
.marginB20 {
	margin-bottom: 20px;
}
</style>