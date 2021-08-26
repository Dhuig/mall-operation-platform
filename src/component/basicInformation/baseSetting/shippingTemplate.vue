<template>
	<div class="shipping-template">
		<guideBar>
			<!-- <el-button type="primary" @click="addCreateFreight"
				>按件数创建运费模板</el-button
			> -->
			<el-button v-permission="'shipping_template_add'" type="primary" @click="addcollect">
				按订单金额收取运费
			</el-button>
		</guideBar>
		<el-card class="box-card">
			<div class="des">
				<span>按订单金额收取运费:</span>
				<span>当订单金额≥{{ row.orderAmount }}元，免运费；小于部分统一收取{{ row.carriage }}元运费。</span>
			</div>
			<tableList
				border
				:loading="loading"
				:dataSource="dataSource"
				:columns="SHIPPING_TEMPLATE_COLUMNS"
				:options="options"
				slotcontent
			>
				<template slot-scope="row">
					<!-- <span class="btns" @click="handleEdit(row.data)">
						编辑
					</span> -->
					<el-button v-permission="'shipping_template_switch'" type="text" @click="handleToggle(row.data)">
						{{ row.data.status * 1 === 1 ? '禁用' : '启用' }}
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 收取运费 -->
		<el-dialog title="按订单金额收取运费" :visible.sync="show" width="40%" v-drag>
			<el-form class="content" ref="ruleForm" :model="ruleForm" :rules="rules">
				<div class="money-input">
					<el-form-item label="当订单金额≥" prop="orderAmount">
						<el-input size="medium" class="wd" v-model="ruleForm.orderAmount" />
						<span>免运费；</span>
					</el-form-item>
					<el-form-item label="小于部分统一收取" prop="carriage">
						<el-input size="medium" class="wd" v-model="ruleForm.carriage" />
						<span>元运费。</span>
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="saveSetMoney('ruleForm')" class="save">保存</el-button>
				<el-button @click="cacelSetMoney('ruleForm')" class="cacel">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { isAmount } from 'util/formValidation';
import { SHIPPING_TEMPLATE_COLUMNS } from './config';
import qs from 'querystring';

export default {
	name: 'shippingTemplate',
	data() {
		return {
			SHIPPING_TEMPLATE_COLUMNS,
			loading: false,
			dataSource: [],
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			show: false, // 显示收取运费弹窗
			row: {
				orderAmount: null,
			},
			ruleForm: {
				orderAmount: '', // 订单金额
				carriage: '', // 运费
			},
			// 表单验证
			rules: {
				orderAmount: [{ required: true, validator: isAmount, trigger: 'blur' }],
				carriage: [{ required: true, validator: isAmount, trigger: 'blur' }],
			},
		};
	},
	methods: {
		// 编辑
		handleEdit(row) {
			this.$go('update_shipping_template', {
				title: '编辑/按件数创建运费模板',
				id: row.code,
			});
		},
		// 切换
		async handleToggle(row) {
			const { id, status } = row;
			const params = {
				id,
				status: status * 1 === 0 ? 1 : 0,
			};
			await this.switch(params);
			this.getList();
		},
		// 开启/禁用接口
		async switch(params) {
			const res = await this.$fetch(`/mgmt/sys/alterCarriPermission?${qs.stringify(params)}`);
			if (res && res.code === 200) this.$message.success(res.message);
		},
		// 创建运费模板
		addCreateFreight() {
			this.$go('update_shipping_template', {
				title: '新增/按件数创建运费模板',
			});
		},
		// 添加收取运费
		addcollect() {
			this.show = true;
		},
		// 保存收取运费
		saveSetMoney(formName) {
			console.log(this.ruleForm);
			this.$refs[formName].validate(async (valid) => {
				if (valid) {
					const { id } = this.row;
					const params = {
						...this.ruleForm,
						id,
					};
					await this.update(params);
					this.show = false;
					this.$refs[formName].resetFields();
					this.getList();
				}
			});
		},
		// 取消收取运费
		cacelSetMoney(formName) {
			this.show = false;
			this.$refs[formName].resetFields();
		},
		// update
		async update(params) {
			const res = await this.$fetch(`/mgmt/sys/updateCarriOrder?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.$message.success(res.message);
			}
		},
		// 请求列表数据
		async getList() {
			this.loading = true;
			const res = await this.$fetch('/mgmt/sys/getCarriList');
			if (res && res.code === 200) {
				const { data } = res;
				this.dataSource = data;
				this.row = data.find((v) => v.carriageTemplateType * 1 === 1);
				console.log(this.row);
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
::v-deep.shipping-template {
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}
	.des {
		font-size: 14px;
		margin-bottom: 24px;
	}
	.dialog-footer {
		display: flex;
		justify-content: center;
	}
	.content {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.money-input {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.el-form-item {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 !important;
	}
	.wd {
		width: 70px;
		margin-right: 10px;
	}
	.save {
		width: 100px;
		margin-right: 16px;
	}
	.cacel {
		width: 100px;
	}
}
</style>
