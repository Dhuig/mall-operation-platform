<template>
	<div class="parts-manage-list">
		<guideBar>
			<el-button v-permission="'parts_manage_add'" type="primary" @click="addParts">添加配件</el-button>
		</guideBar>
		<el-card>
			<searchPanel :config="PARTS_MANAGE_LIST_CONFIG" v-model="searchConfig" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="dataSource"
				:columns="PARTS_MANAGE_LIST_COLUMNS"
				:pagination="pagination"
				:dataTotal="pagination.total"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="row">
					<el-button v-permission="'parts_manage_edit'" type="text" @click="handleEdit(row.data)">编辑</el-button>
					<el-button v-permission="'parts_manage_delete'" type="text" @click="handleDelete(row.data.id)">
						删除
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 新增/编辑类型 -->
		<el-dialog :title="dialog.title" :visible.sync="dialog.show" width="30%" v-drag>
			<el-form
				class="add-rate"
				:model="dialog.ruleForm"
				:rules="rules"
				ref="ruleForm"
				label-width="90px"
				label-position="right"
				label-suffix=":"
			>
				<div class="flex">
					<el-form-item label="产品名称" prop="productTitle">
						<el-select
							:disabled="!dialog.isAdd"
							v-model="dialog.ruleForm.productTitle"
							filterable
							placeholder="请选择产品名称"
							@change="productChange"
						>
							<el-option v-for="{ title, id } in productList" :key="id" :label="title" :value="title"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="配件编码" prop="fittingSerialno">
						<el-input size="medium" v-model="dialog.ruleForm.fittingSerialno" />
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="配件名称" prop="fittingTitle">
						<el-input size="medium" v-model="dialog.ruleForm.fittingTitle" />
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="配件价" prop="fittingPrice">
						<el-input-number v-model="dialog.ruleForm.fittingPrice" :min="0"></el-input-number>
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="save('ruleForm')" class="save">保存</el-button>
				<el-button @click="cacel('ruleForm')" class="cacel">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { PARTS_MANAGE_LIST_COLUMNS, PARTS_MANAGE_LIST_CONFIG } from './config';
import qs from 'querystring';

export default {
	name: 'partsManageList',
	data() {
		return {
			loading: false,
			PARTS_MANAGE_LIST_COLUMNS,
			PARTS_MANAGE_LIST_CONFIG,
			pagination: {
				currentPage: 1,
				pageSize: 10,
				total: 0,
			},
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			dialog: {
				show: false,
				isAdd: true,
				title: '',
				ruleForm: {
					// 新增/编辑表单
					productTitle: '',
					fittingSerialno: '',
					fittingTitle: '',
					fittingPrice: '',
					productSerialno: '',
				},
			},
			searchConfig: {
				productSerialno: '', // 产品编码
				productTitle: '', // 产品名称
				fittingSerialno: '', // 配件编码
				fittingTitle: '', // 配件名称
			},
			dataSource: [],
			productList: [], // 产品下拉数据
			rules: {
				//  规则
				productTitle: [{ required: true, message: '请选择产品名称', trigger: 'change' }],
				fittingSerialno: [
					{ required: true, message: '请输入配件编码', trigger: 'blur' },
					{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
				],
				fittingTitle: [
					{ required: true, message: '请输入配件名称', trigger: 'blur' },
					{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
				],
				fittingPrice: [
					{ required: true, message: '请输入配件价', trigger: 'blur' },
					{
						pattern: /^\d+$/,
						message: '请输入正整数',
						trigger: 'blur',
					},
				],
			},
		};
	},
	computed: {
		// 搜索参数
		searchFields() {
			return { ...this.searchConfig };
		},
	},
	methods: {
		// 分页触发事件
		handleChangePage(val) {
			this.pagination.currentPage = val;
			this.getList();
		},
		// 分页下拉触发事件
		handleSizeChange(val) {
			this.pagination.pageSize = val;
			this.getList();
		},
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.getList();
		},
		// 添加
		addParts() {
			this.dialog = {
				title: '新增产品配件',
				isAdd: true,
				show: true,
				ruleForm: {
					productTitle: '',
					fittingSerialno: '',
					fittingTitle: '',
					fittingPrice: '',
					productSerialno: '',
				},
			};
			if (this.$refs.ruleForm) {
				this.$refs.ruleForm.resetFields();
			}
		},
		// 编辑
		handleEdit(row) {
			this.dialog = {
				title: '编辑产品配件',
				isAdd: false,
				show: true,
				ruleForm: { ...row },
			};
		},
		// 删除
		async handleDelete(id) {
			this.$confirm('确定删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				await this.delete({ id });
				this.getList();
			});
		},
		// 保存
		async save(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					let url = this.dialog.isAdd ? '/mgmt/sys/addFitting' : '/mgmt/sys/updateFitting';
					let res = await this.apiUpdate(this.dialog.ruleForm, url);
					if (res && res.code === 200) {
						this.$message({
							type: 'success',
							message: res.message,
						});
						this.dialog.show = false;
						this.getList();
					}
				}
			});
		},
		// 取消
		cacel(formName) {
			this.dialog.show = false;
			this.$refs[formName].resetFields();
		},
		// 产品编码
		productChange(value) {
			this.dialog.ruleForm.productSerialno = this.productList.find(item => item.title === value).serialNo;
		},
		// 获取产品名称
		async getRepairableProdList() {
			const res = await this.$fetch(`/mgmt/order/repair/getRepairableProdList?keyword`);
			if (res && res.code === 200) {
				this.productList = res.data;
			}
		},
		// 添加/编辑接口
		async apiUpdate(data, url) {
			return await this.$fetch({
				method: 'post',
				url,
				data,
			});
		},
		// 删除接口
		async delete(params) {
			const res = await this.$fetch(`/mgmt/sys/delFittingById?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
		},
		// 请求数据
		async getList() {
			this.loading = true;
			const {
				pagination: { currentPage: pageNum, pageSize },
				searchFields,
			} = this;
			const params = {
				pageNum,
				pageSize,
				...searchFields,
			};
			const res = await this.$fetch(`/mgmt/sys/getFittingPages?${qs.stringify(params)}`);
			if (res.code === 200) {
				const { list, total } = res.data;
				this.dataSource = list;
				this.pagination.total = total;
			} else {
				this.dataSource = [];
				this.pagination.total = 0;
			}
			this.loading = false;
		},
	},
	created() {
		this.getRepairableProdList();
		this.getList();
	},
};
</script>
<style lang="scss" scoped>
.parts-manage-list {
	::v-deep.el-dialog {
		min-width: 360px;
	}
	.dialog-footer {
		display: flex;
		justify-content: center;
	}
}
::v-deep.add-rate {
	.el-form-item {
		margin-bottom: 25px;
		.el-form-item__content,
		.el-input,
		.el-select,
		.el-input-number,
		.el-date-editor {
			width: 224px;
		}
	}
	.el-input-group__append {
		padding: 0 6px;
	}
	.flex {
		display: flex;
		justify-content: center;
	}
}
.save {
	width: 100px;
	margin-right: 16px;
}
.cacel {
	width: 100px;
}
</style>
