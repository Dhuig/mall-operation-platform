<template>
	<div class="remit-type">
		<guideBar>
			<el-button v-permission="'remit_type_add'" type="primary" @click="addRemitType">新增汇款类型</el-button>
		</guideBar>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="dataSource"
				:columns="REMITTANCE_COLUMNS"
				:options="options"
				slotcontent
			>
				<template slot-scope="row">
					<el-button v-permission="'remit_type_edit'" type="text" @click="handleEdit(row.data)">编辑</el-button>
					<el-button v-permission="'remit_type_switch'" type="text" @click="handleToggle(row.data)">
						{{ row.data.status * 1 === 1 ? '禁用' : '启用' }}
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 新增/编辑税率 -->
		<el-dialog :title="isAddRemit ? '新增汇款类型' : '编辑汇款类型'" :visible.sync="show" width="30%" v-drag>
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
					<el-form-item label="汇款类型名称" prop="typeName">
						<el-input size="medium" v-model="ruleForm.typeName"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="计算方式" prop="calculation">
						<el-select size="medium" v-model="ruleForm.calculation">
							<el-option v-for="item in calculationList" :key="item.value" :value="item.value" :label="item.label" />
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="说明" prop="explanation">
						<el-input size="medium" v-model="ruleForm.explanation" />
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
import { REMITTANCE_COLUMNS, CALCULATION_METHOD } from './config';
import { optionGenerator } from 'util';
import qs from 'querystring';

export default {
	name: 'remitType',
	data() {
		return {
			loading: false,
			REMITTANCE_COLUMNS,
			dataSource: [],
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			show: false, // 显示弹窗
			isAddRemit: true, // 新增or编辑
			ruleForm: {
				typeName: '',
				calculation: '',
				explanation: '',
			},
			// 表单验证
			rules: {
				typeName: [{ required: true, message: '请输入汇款类型名称', trigger: 'blur' }],
				calculation: [{ required: true, message: '请选择计算方式', trigger: 'change' }],
			},
			calculationList: [], // 计算方式数据
		};
	},
	methods: {
		// 添加
		addRemitType() {
			this.show = true;
			this.isAddRemit = true;
		},
		// 编辑
		handleEdit(row) {
			const { typeName, calculation, explanation, id } = row;
			this.show = true;
			this.isAddRemit = false;
			this.ruleForm = {
				...this.ruleForm,
				typeName,
				calculation,
				explanation,
				id,
			};
		},
		// 切换
		async handleToggle(row) {
			const { id, status } = row;
			let s = null;
			if (status * 1 === 0) {
				s = 1;
			} else {
				s = 0;
			}
			const params = {
				id,
				status: s,
			};
			await this.switch(params);
			this.getList();
		},
		// 开启/禁用接口
		async switch(params) {
			const res = await this.$fetch(`/mgmt/sys/alterRemittancePermission?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
		},
		// 保存
		save(formName) {
			if (this.isAddRemit) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						await this.addRemit(this.ruleForm);
						this.show = false;
						this.$refs[formName].resetFields();
						this.getList();
					}
				});
			} else {
				this.$refs[formName].validate(async (valid) => {
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
			this.ruleForm = {
				typeName: '',
				calculation: '',
				explanation: '',
			};
		},
		// 新增接口
		async addRemit(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/sys/addRemittance',
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
				url: '/mgmt/sys/updateRemittance',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
		},
		// 请求列表数据
		async getList() {
			this.loading = true;
			const res = await this.$fetch('/mgmt/sys/getRemittanceList');
			if (res && res.code === 200) {
				const { data } = res;
				this.dataSource = data;
			} else {
				this.dataSource = [];
			}
			this.loading = false;
		},
	},
	created() {
		this.calculationList = optionGenerator(CALCULATION_METHOD);
		console.log('this.calculationList:', this.calculationList);
		this.getList();
	},
};
</script>
<style lang="scss" scoped>
.remit-type {
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
