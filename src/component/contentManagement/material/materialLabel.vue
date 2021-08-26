<template>
	<div>
		<guideBar />
		<el-row type="flex" justify="end" class="marginB20">
			<el-button
				type="primary"
				v-permission="'material_label_add_source'"
				icon="el-icon-plus"
				@click="openClassificationDialog()"
			>
				新增素材标签
			</el-button>
		</el-row>
		<el-card>
			<!-- <el-row type="flex" justify="end">
				<el-button
					v-permission="'material_label_sort_source'"
					:type="sortAble ? 'info' : 'primary'"
					icon="el-icon-sort"
					@click="setSort"
				>
					{{ sortAble ? '设置排序' : '完成排序' }}
				</el-button>
			</el-row> -->
			<el-table :data="tabPanes.data" v-loading="tabPanes.loading">
				<el-table-column prop="name" label="标签名称" />
				<el-table-column label="操作" :width="450">
					<template slot-scope="scope">
						<el-button
							size="mini"
							type="primary"
							icon="el-icon-edit-outline"
							v-permission="'material_label_edit_source'"
							@click="openClassificationDialog('编辑素材标签', true, scope.row)"
						>
							编辑
						</el-button>
						<el-button
							v-permission="'material_label_delete_source'"
							size="mini"
							type="danger"
							icon="el-icon-delete-solid"
							@click="delClassification(scope.row.id)"
						>
							删除
						</el-button>
						<!-- <el-button
							size="mini"
							icon="el-icon-top"
							@click="handleUpper(scope.$index)"
							v-permission="'material_label_sort_source'"
							:disabled="scope.$index == 0 || sortAble"
						>
							上移
						</el-button>
						<el-button
							size="mini"
							icon="el-icon-bottom"
							@click="handleDownner(scope.$index)"
							v-permission="'material_label_sort_source'"
							:disabled="scope.$index == tabPanes.data.length - 1 || sortAble"
						>
							下移
						</el-button> -->
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<!-- 添加素材标签页弹窗 -->
		<el-dialog :title="dialog.title" :visible.sync="dialog.show" center width="550px" v-drag>
			<el-form
				:model="dialogClassificationForm"
				:rules="CLASSIFICATION_OR_LABEL_RULE"
				ref="dialogClassificationForm"
				label-width="100px"
				label-position="left"
			>
				<div class="marg10">为不同类型的素材创建不同的标签,方便您管理也方便顾客浏览</div>
				<el-form-item label="标签名称" prop="name">
					<el-input
						placeholder="请输入标签名称"
						maxlength="20"
						show-word-limit
						size="mini"
						v-model="dialogClassificationForm.name"
					/>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button type="primary" @click.stop="saveClassification">保存</el-button>
				<el-button @click.stop="cancelClassification">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { TABITEM, CLASSIFICATION_OR_LABEL_RULE, COMMONDATA } from './config';
export default {
	name: 'materialLabel',
	data() {
		return {
			CLASSIFICATION_OR_LABEL_RULE,
			tabPanes: new TABITEM(),
			dialog: {
				title: '',
				show: false,
			},
			// sortAble: true,
			dialogClassificationForm: {
				name: '',
				id: null,
			},
		};
	},
	methods: {
		// 获取素材列表列表数据
		async loadData() {
			const { tabPanes } = this;

			tabPanes.loading = true;

			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/cms/classificationLabel/queryLabelList`,
				timeout: 60000 * 1,
				data: COMMONDATA,
			});
			if (res?.code == 200) {
				const { cmsLabelRespVos } = res.data;
				tabPanes.data = cmsLabelRespVos;
			}
			tabPanes.loading = false;
		},
		// // 上移
		// handleUpper(index) {
		// 	this.swapArray(this.tabPanes.data, index, index - 1);
		// },
		// // 下移
		// handleDownner(index) {
		// 	this.swapArray(this.tabPanes.data, index, index + 1);
		// },
		// swapArray(arr, index1, index2) {
		// 	arr[index1] = arr.splice(index2, 1, arr[index1])[0];
		// 	return arr;
		// },
		// // 排序
		// async setSort() {
		// 	const {
		// 		tabPanes: { data },
		// 	} = this;
		// 	this.sortAble = this.sortAble ? false : true;
		// 	if (this.sortAble) {
		// 		let cmsLabelUpdateBatchReqVOS = data.map(({ id }, index) => ({
		// 			id,
		// 			sort: data.length - index,
		// 		}));
		// 		const res = await this.$fetch({
		// 			method: 'POST',
		// 			url: '/mgmt/cms/classificationLabel/sortLabel',
		// 			data: {
		// 				...COMMONDATA,
		// 				cmsLabelUpdateBatchReqVOS,
		// 			},
		// 		});
		// 		if (res?.code == 200) {
		// 			this.$message.success(res.message);
		// 		}
		// 	}
		// },
		// 打开新建素材标签
		openClassificationDialog(title = '新建素材标签', show = true, row = null) {
			if (row) {
				this.dialogClassificationForm = { ...row };
			} else {
				this.dialogClassificationForm = {
					name: '',
					id: null,
				};
			}
			this.dialog = {
				title,
				show,
			};
		},
		// 保存新建素材标签 验证
		saveClassification() {
			const { id } = this.dialogClassificationForm;
			this.$refs.dialogClassificationForm.validate(valid => {
				if (valid) {
					id ? this.editClassification() : this.establishClassification();
				}
			});
		},
		// 创建素材标签 接口
		async establishClassification() {
			const {
				dialogClassificationForm: { name },
			} = this;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/cms/classificationLabel/addLabel`,
				timeout: 60000 * 1,
				data: {
					...COMMONDATA,
					name,
				},
			});
			if (res?.code == 200) {
				this.$message.success(res.message);
				this.cancelClassification();
				this.loadData();
			}
		},
		// 修改素材标签 接口
		async editClassification() {
			const { dialogClassificationForm } = this;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/cms/classificationLabel/updateLabel`,
				timeout: 60000 * 1,
				data: {
					...COMMONDATA,
					...dialogClassificationForm,
				},
			});
			if (res?.code == 200) {
				this.$message.success(res.message);
				this.cancelClassification();
				this.loadData();
			}
		},
		// 删除素材标签 接口
		delClassification(id) {
			this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				center: true,
			}).then(async () => {
				const res = await this.$fetch({
					method: 'DELETE',
					url: `/mgmt/cms/classificationLabel/delLabelById/${id}`,
				});
				if (res?.code == 200) {
					this.$message.success(res.message);
					this.loadData();
				} else {
					if (this.$store.getters['system/getError']) {
						this.$message.error(res.data.message);
					}
				}
			});
		},
		// 取消新建素材标签
		cancelClassification() {
			this.$refs.dialogClassificationForm.resetFields();
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
.marg10 {
	margin: 10px;
}
</style>