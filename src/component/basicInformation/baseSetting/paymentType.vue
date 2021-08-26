<template>
	<div class="payment-type">
		<guideBar />
		<el-card class="box-card">
			<tableList
				border
				:loading="loading"
				:dataSource="dataSource"
				:columns="PAYMENT_TYPE_COLUMNS"
				:options="options"
				slotcontent
			>
				<template slot-scope="row">
					<el-button v-permission="'payment_type_switch'" type="text" @click="handleToggle(row.data)">
						{{ row.data.status * 1 === 1 ? '禁用' : '启用' }}
					</el-button>
					<!-- <el-button v-permission="'payment_type_edit'" type="text" @click="handleEdit(row.data)">编辑</el-button> -->
				</template>
			</tableList>
		</el-card>
		<!-- 编辑弹窗 -->
		<el-dialog title="编辑适用对象" :visible.sync="show" width="30%" v-drag>
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
					<el-form-item label="支付方式" prop="paymentMethod">
						<el-input size="medium" disabled v-model="ruleForm.paymentMethod" />
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="适用对象" prop="applianceRoleFlag">
						<el-checkbox-group v-model="ruleForm.applianceRoleFlag">
							<el-checkbox v-for="item in applianceList" :key="item.value" :label="item.value">
								{{ item.label }}
							</el-checkbox>
						</el-checkbox-group>
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
import { PAYMENT_TYPE_COLUMNS, PAYMENT_METHOD_NAME, ADAPTATION_ROLE_FLAG } from './config';
// import qs from 'querystring';
import { optionGenerator } from 'util';

export default {
	name: 'paymentType',
	data() {
		return {
			loading: false,
			PAYMENT_TYPE_COLUMNS,
			dataSource: [],
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			show: false, // 显示弹窗
			ruleForm: {
				paymentMethod: '',
				applianceRoleFlag: [], // 适配对象
			},
			// 表单验证
			rules: {
				applianceRoleFlag: [
					{
						type: 'array',
						required: true,
						message: '请至少选择一个适用对象',
						trigger: 'change',
					},
				],
			},
			applianceList: [], // 勾选数据
		};
	},
	methods: {
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
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/sys/pay/method/status/update`,
				data: params,
			});
			// const res = await this.$fetch(`/mgmt/sys/alterPaymentPermission?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
		},
		// 编辑
		handleEdit(row) {
			this.show = true;
			// 获取勾选的数据
			this.applianceList = optionGenerator(ADAPTATION_ROLE_FLAG);
			const { id, paymentMethod, applianceRoleFlag } = row;
			const Flag = applianceRoleFlag.map(v => Number(v));
			let payment = paymentMethod in PAYMENT_METHOD_NAME ? PAYMENT_METHOD_NAME[paymentMethod] : '';
			this.ruleForm = {
				...this.ruleForm,
				paymentMethod: payment,
				applianceRoleFlag: Flag,
				id,
			};
		},
		// 保存
		saveRate(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const params = Object.assign({}, this.ruleForm);
					// console.log('params: ', params);
					delete params.paymentMethod;
					await this.update(params);
					this.show = false;
					this.$refs[formName].resetFields();
					this.getList();
				}
			});
		},
		// 编辑接口
		async update(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/sys/updateApplianceType',
				data,
			});

			if (res && res.code === 200) {
				this.$message.success(res.message);
				this.$nextTick(this.getList);
			} else {
				this.$message.error(res.data.message || '修改支付方式失败');
			}
		},
		// 取消
		cacelRate(formName) {
			this.show = false;
			this.$refs[formName].resetFields();
		},
		// 请求列表数据
		async getList() {
			this.loading = true;
			const res = await this.$fetch('/mgmt/sys/pay/method/list');
			if (res && res.code === 200) {
				this.dataSource = res.data.filter(({ paymentMethod }) => paymentMethod !== 6);
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
.payment-type {
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
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
