<template>
	<div class="contract-template-list">
		<guideBar>
			<el-button type="primary" v-permission="'contract_template_list_build_template'" @click="addTemplate">
				新建增加模板
			</el-button>
		</guideBar>
		<el-card>
			<business-contract-config />
			<tableList
				border
				:dataSource="list"
				:columns="CONTRACT_TEMPLATE_LIST_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="row">
					<el-button type="text" v-permission="'contract_template_list_delete'" @click="delOne(row.data)">
						删除
					</el-button>
					<el-button type="text" v-permission="'contract_template_list_startend'" @click="switchService(row.data)">
						{{ TEMPLATE_STATUS[row.data.templateStatusBack] }}
					</el-button>
					<el-button type="text" v-permission="'contract_template_list_edit'" @click="edit(row.data)">
						编辑
					</el-button>
					<el-button type="text" v-permission="'contract_template_list_preview'" @click="preview(row.data)">
						查看字段
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 新增/编辑模板 -->
		<el-dialog :title="dialogVisible.title" :visible.sync="dialogVisible.show" width="600px" class="template-pop">
			<el-form ref="form" :model="form" :rules="formRules" label-width="130px">
				<el-form-item label="合同模板编号" prop="templateNo">
					<el-input v-model="form.templateNo" placeholder="输入模板编号" class="input-width"></el-input>
					<el-button type="primary" @click="previewContractTemplate">搜索</el-button>
				</el-form-item>
				<el-form-item label="合同模板名称" prop="templateName">
					<el-input v-model="form.templateName" placeholder="输入模板名称" class="input-width"></el-input>
				</el-form-item>
				<el-form-item label="OA工号" prop="employeeNumber">
					<el-input v-model="form.employeeNumber" placeholder="输入门户OA工号" class="input-width"></el-input>
					<el-button type="primary" @click="loadCustomerIdByOA">搜索</el-button>
				</el-form-item>
				<el-form-item label="法大大客户编号" prop="customerId">
					<el-input v-model="form.customerId" class="input-width" disabled></el-input>
				</el-form-item>
			</el-form>
			<span class="dialog-footer">
				<el-button @click="templateCancel('form')">取消</el-button>
				<el-button type="primary" @click="templateConfirm('form')">确定</el-button>
			</span>
		</el-dialog>
		<!-- 查看合同模板 -->
		<el-dialog title="查看合同模板" :visible.sync="previewContractPop.show" width="700px">
			<!-- <iframe class="preview-iframe" :src="previewContractPop.src"></iframe> -->
			<el-form ref="templateform" label-width="130px">
				<el-form-item
					:label="item.name"
					prop=""
					v-for="(item, index) in previewContractPop.templateContent"
					:key="index"
				>
					<el-input :type="item.type" disabled></el-input>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import { CONTRACT_TEMPLATE_LIST_COLUMNS_CONFIG, TEMPLATE_STATUS } from './config';
import qs from 'querystring';
import businessContractTemplateConfig from './businessContractTemplateConfig.vue';
export default {
	components: {
		'business-contract-config': businessContractTemplateConfig,
	},
	name: 'contractTemplateList',
	data() {
		return {
			CONTRACT_TEMPLATE_LIST_COLUMNS_CONFIG,
			TEMPLATE_STATUS,
			list: [],
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 0,
			dialogVisible: {
				title: '添加合同模板',
				show: false,
				type: 'add',
			},
			form: {
				templateNo: '',
				templateName: '',
				employeeNumber: '',
				customerId: '',
			},
			previewContractPop: {
				show: false,
				templateContent: [],
			},
			formRules: {
				templateNo: [{ required: true, message: '请输入模板编号', trigger: 'blur' }],
				templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
				employeeNumber: [{ required: true, message: '请输入OA工号', trigger: 'blur' }],
				customerId: [{ required: true, message: '请输入法大大客户编号', trigger: 'blur' }],
			},
		};
	},
	watch: {
		list: {
			handler(list) {
				list &&
					list.map(item => {
						item.templateStatusBack = item.templateStatus == 1 ? 2 : 1;
					});
			},
			deep: true,
		},
	},
	methods: {
		// 新增模板
		addTemplate() {
			this.dialogVisible = { title: '添加合同模板', show: true, type: 'add' };
			delete this.form.id;
		},
		// 翻页
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 切换数据展示条数
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 删除操作
		delOne(row) {
			console.log(row);
			this.$confirm('确定删除该合同模板吗？', '提示')
				.then(() => {
					this.delOneFn(row.id);
				})
				.catch(() => {
					console.log('取消了');
				});
		},
		// 模板启用/停用
		async switchService(row) {
			const { templateStatusBack, id } = row;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/store/updateContractTemplate',
				params: { id, type: templateStatusBack },
			});
			if (res && res.code === 200) {
				this.loadData();
				this.$message.success('操作成功');
			} else {
				this.$message.error((res && res.data.message) || '操作失败');
			}
		},
		// 编辑操作
		edit(row) {
			this.dialogVisible = { title: '编辑合同模板', show: true, type: 'edit' };
			this.form = { ...row };
		},
		// 查看操作
		async preview(row) {
			const res = await this.$fetch(`/mgmt/store/templateWidgetList?templateNo=${row.templateNo}`);
			if (res && res.code === 200) {
				this.previewContractPop = { show: true, templateContent: res.data };
			} else {
				this.$message.error('合同模板不存在');
			}
		},
		// 添加/编辑合同模板 - 取消
		templateCancel(formName) {
			console.log('取消');
			this.$refs[formName].resetFields();
			this.dialogVisible.show = false;
		},
		// 添加/编辑合同模板 - 确定
		templateConfirm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					console.log(this.form);
					this.addOrUpdateContractTemp(formName);
				}
			});
		},
		// 添加/修改合同模板
		async addOrUpdateContractTemp(formName) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/store/addOrUpdateContractTemplate',
				data: this.form,
			});
			if (res && res.code === 200) {
				this.loadData();
				this.$message.success('操作成功');
				this.$refs[formName].resetFields();
				this.dialogVisible.show = false;
			} else {
				this.$message.error((res.data && res.data.message) || '操作失败');
			}
		},
		// 删除合同模板方法
		async delOneFn(id) {
			if (!id) {
				return this.$message.warning('数据无id值，无法删除');
			}
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/delContractTemplate?id=${id}`,
			});
			if (res && res.code === 200) {
				this.loadData();
				this.$message.success('删除成功');
			} else {
				this.$message.error((res.data && res.data.message) || '删除失败');
			}
		},
		// 查看合同模板是否可用
		async previewContractTemplate() {
			const { templateNo } = this.form;
			if (!templateNo) return this.$message.warning('请输入模板编号');
			const res = await this.$fetch(`/mgmt/store/templateWidgetList?templateNo=${templateNo}`);
			if (res && res.code === 200) {
				this.$message.success('模板可用');
			} else {
				this.$message.warning((res.data && res.data.message) || '模板不可用');
			}
		},
		// 通过OA工号获取法大大客户编号
		async loadCustomerIdByOA() {
			const { employeeNumber } = this.form;
			if (!employeeNumber) return this.$message.warning('请输入OA工号');
			const res = await this.$fetch(`/mgmt/store/personRegister?account=${employeeNumber}`);
			if (res && res.code === 200) {
				this.form.customerId = res.data;
			} else {
				this.$message.warning((res.data && res.data.message) || '获取法大大客户编号失败，请输入正确OA工号');
			}
		},
		// 获取列表数据
		async loadData() {
			const { currentPage, pageSize } = this.pagination;
			const data = {
				pageNum: currentPage,
				pageSize,
			};
			const res = await this.$fetch(`/mgmt/store/queryContractTemplateListPage?${qs.stringify(data)}`);
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
				if (list.length === 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error((res.data && res.data.message) || '获取合同模板数据失败');
			}
		},
	},
	mounted() {
		this.loadData();
	},
};
</script>

<style lang="scss" scoped>
::v-deep.contract-template-list {
	.green {
		color: #1abc9c;
	}
	.template-pop {
		.input-width {
			width: 80%;
			margin-right: 10px;
		}
		.dialog-footer {
			display: flex;
			justify-content: flex-end;
		}
	}
	.preview-iframe {
		width: 100%;
		height: 600px;
	}
}
</style>
