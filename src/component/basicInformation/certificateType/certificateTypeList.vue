<template>
	<div class="certificate-type-list">
		<guideBar>
			<el-button v-permission="'certificate_type_add'" type="primary" @click="addType">新增类型</el-button>
		</guideBar>
		<el-card class="box-card">
			<tableList
				:loading="loading"
				:dataSource="dataSource"
				:columns="CERTIFICATE_TYPE_COLUMNS"
				:pagination="pagination"
				:dataTotal="total"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="row">
					<el-button v-permission="'certificate_type_edit'" type="text" @click="handleEdit(row.data)">编辑</el-button>
					<el-button v-permission="'certificate_type_delete'" type="text" @click="handleDelete(row.data)">
						删除
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 新增/编辑类型 -->
		<el-dialog :title="isAdd ? '新增公司证件类型' : '编辑公司证件类型'" :visible.sync="show" width="30%" v-drag>
			<el-form
				class="add-rate"
				:model="ruleForm"
				:rules="rules"
				ref="ruleForm"
				label-width="110px"
				label-position="right"
				label-suffix=":"
			>
				<div class="flex">
					<el-form-item label="类型名称" prop="typeName">
						<el-input size="medium" v-model="ruleForm.typeName"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="备注" prop="remarks">
						<el-input size="medium" v-model="ruleForm.remarks" />
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
import { CERTIFICATE_TYPE_COLUMNS } from './config';
import qs from 'querystring';

export default {
	name: 'certificateTypeList',
	data() {
		return {
			loading: false,
			CERTIFICATE_TYPE_COLUMNS,
			dataSource: [],
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			total: 0,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			show: false,
			isAdd: true,
			ruleForm: {
				typeName: '',
				remarks: '',
			},
			rules: {
				typeName: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
			},
		};
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
		// 添加
		addType() {
			(this.show = true), (this.isAdd = true);
			this.ruleForm = {
				typeName: '',
				remarks: '',
			};
		},
		// 编辑
		handleEdit(row) {
			this.show = true;
			this.isAdd = false;
			const { typeName, remarks, id } = row;
			this.ruleForm = {
				...this.ruleForm,
				typeName,
				remarks,
				id,
			};
		},
		// 删除
		async handleDelete({ id }) {
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
		save(formName) {
			if (this.isAdd) {
				this.$refs[formName].validate(async valid => {
					if (valid) {
						await this.addCertiType(this.ruleForm);
						this.show = false;
						this.$refs[formName].resetFields();
						this.getList();
					}
				});
			} else {
				this.$refs[formName].validate(async valid => {
					if (valid) {
						await this.update(this.ruleForm);
						this.show = false;
						this.$refs[formName].resetFields();
						this.getList();
					}
				});
			}
		},
		// 取消
		cacel(formName) {
			this.show = false;
			this.$refs[formName].resetFields();
		},
		// 新增接口
		async addCertiType(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/sys/addCertiType',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
		},
		// 编辑接口
		async update(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/sys/updateCertiType',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
		},
		// 删除接口
		async delete(params) {
			const res = await this.$fetch(`/mgmt/sys/delCertiType?${qs.stringify(params)}`);
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
			} = this;

			const params = {
				pageNum,
				pageSize,
			};
			const res = await this.$fetch(`/mgmt/sys/getCertiType?${qs.stringify(params)}`);
			if (res.code === 200) {
				const { list, total } = res.data;
				this.dataSource = list;
				this.total = total;
			} else {
				this.dataSource = [];
				this.total = 0;
			}
			this.loading = false;
		},
	},
	created() {
		this.getList();
	},
};
</script>
<style lang="scss" scoped>
.certificate-type-list {
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}
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
