<template>
	<div class="duty-rate">
		<guideBar>
			<!-- <el-button type="primary" @click="addDutyRate">新增税率</el-button> -->
		</guideBar>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="dataSource"
				:columns="DUTY_RATE_COLUMNS"
				:options="options"
				slotcontent
			>
				<template slot-scope="row">
					<el-button v-permission="'duty_rate_edit'" type="text" @click="handleEdit(row.data)">编辑</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 新增/编辑税率 -->
		<el-dialog v-drag :title="isAddRate ? '新增税率' : '编辑税率'" :visible.sync="show" width="30%">
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
					<el-form-item label="税率名称" prop="name">
						<el-input size="medium" v-model="ruleForm.name" :disabled="disabled"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="现有税率" prop="nowrate">
						<el-input size="medium" v-model="ruleForm.nowrate" :disabled="disabled">
							<template slot="append">%</template>
						</el-input>
					</el-form-item>
				</div>
				<div class="flex" v-if="!isAddRate">
					<el-form-item label="修改后的税率" prop="newrate">
						<el-input size="medium" v-model="ruleForm.newrate">
							<template slot="append">%</template>
						</el-input>
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="saveRate('ruleForm')" class="save">保存</el-button>
				<el-button @click="cacelRate('ruleForm')" class="cacel">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { isOneToNinetyNine } from 'util/formValidation';
import { DUTY_RATE_COLUMNS } from './config';
import qs from 'querystring';

export default {
	name: 'dutyRate',
	data() {
		return {
			loading: false,
			DUTY_RATE_COLUMNS,
			dataSource: [],
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			show: false, // 显示弹窗
			isAddRate: true, // 新增税率or编辑税率
			disabled: false,
			ruleForm: {
				name: '',
				nowrate: '',
				newrate: '',
			},
			// 表单验证
			rules: {
				name: [{ required: true, message: '请输入税率名称', trigger: 'blur' }],
				nowrate: [{ required: true, validator: isOneToNinetyNine, trigger: 'blur' }],
				newrate: [{ required: true, validator: isOneToNinetyNine, trigger: 'blur' }],
			},
		};
	},
	methods: {
		// 新增税率
		addDutyRate() {
			this.show = true;
			this.isAddRate = true;
			this.disabled = false;
		},
		// 编辑税率
		handleEdit(row) {
			this.show = true;
			this.isAddRate = false;
			this.disabled = true;
			this.ruleForm = {
				...this.ruleForm,
				name: row.name,
				nowrate: row.rate,
				id: row.id,
			};
		},
		// 保存
		saveRate(formName) {
			if (this.isAddRate) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						this.show = false;
						// this.$refs[formName].resetFields();
					}
				});
			} else {
				this.$refs[formName].validate(async valid => {
					if (valid) {
						const { id, newrate } = this.ruleForm;
						const params = {
							id,
							taxRate: newrate,
						};
						await this.update(params);
						this.show = false;
						this.$refs[formName].resetFields();
						this.getList();
					}
				});
			}
		},
		// 取消
		cacelRate(formName) {
			this.show = false;
			this.$refs[formName].resetFields();
		},
		// update
		async update(params) {
			const res = await this.$fetch(`/mgmt/sys/updateTaxRate?${qs.stringify(params)}`);
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
			const res = await this.$fetch('/mgmt/sys/getTaxRate');
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
		this.getList();
	},
};
</script>
<style lang="scss" scoped>
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
.dialog-footer {
	display: flex;
	justify-content: center;
}
.save {
	width: 100px;
	margin-right: 16px;
}
.cacel {
	width: 100px;
}
</style>
