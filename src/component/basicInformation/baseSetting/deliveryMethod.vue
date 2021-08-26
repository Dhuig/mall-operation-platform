<template>
	<div class="delivery-method">
		<guideBar />
		<el-card class="box-card">
			<tableList border :dataSource="dataSource" :columns="columns" :options="options" slotcontent>
				<template slot-scope="row">
					<span class="btns" @click="handleToggle(row.data)">启用</span>
					<span class="btns" @click="handleEdit(row.data)">编辑</span>
				</template>
			</tableList>
		</el-card>
		<!-- 编辑弹窗 -->
		<el-dialog title="编辑适用对象" v-drag :visible.sync="show" width="30%">
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
					<el-form-item label="物流方式名称" prop="name">
						<el-input size="medium" disabled v-model="ruleForm.name" />
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="适用对象" prop="applyUser">
						<el-checkbox-group v-model="ruleForm.applyUser">
							<el-checkbox label="普通顾客"></el-checkbox>
							<el-checkbox label="优惠顾客"></el-checkbox>
							<el-checkbox label="云商"></el-checkbox>
							<el-checkbox label="微店"></el-checkbox>
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
export default {
	name: 'deliveryMethod',
	data() {
		return {
			columns: [
				{
					prop: 'logisticName',
					label: '物流方式名称',
					align: 'left',
				},
				{
					prop: 'applyUser',
					label: '适用对象',
					align: 'left',
				},
				{
					prop: 'created',
					label: '创建时间',
					align: 'left',
				},
				{
					prop: 'statusName',
					label: '状态',
					align: 'left',
				},
			],
			dataSource: [
				{
					logisticName: '交通银行',
					applyUser: '普通顾客,优惠顾客,云商,云+',
					created: 34234234,
					statusName: '启用',
				},
				{
					logisticName: '支付宝',
					applyUser: '普通顾客',
					created: 32849387454893,
					statusName: '禁用',
				},
			],
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			show: false, // 显示弹窗
			ruleForm: {
				applyUser: [],
			},
			// 表单验证
			rules: {
				applyUser: [
					{
						type: 'array',
						required: true,
						message: '请至少选择一个适用对象',
						trigger: 'change',
					},
				],
			},
		};
	},
	methods: {
		// 切换
		handleToggle(row) {
			console.log(row);
		},
		// 编辑
		handleEdit(row) {
			this.show = true;
			this.ruleForm.name = row.logisticName;
		},
		// 保存
		saveRate(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.show = false;
				}
			});
		},
		// 取消
		cacelRate(formName) {
			this.show = false;
			this.$refs[formName].resetFields();
		},
	},
};
</script>
<style lang="scss" scoped>
.delivery-method {
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
