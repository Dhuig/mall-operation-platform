<template>
	<div class="monthly-pay">
		<guideBar />
		<el-card class="box-card">
			<div class="tip">
				<span>默认每月</span>
				<span class="ed">
					<el-button v-permission="'monthly_pay_edit'" type="primary" @click="edit">{{ day }}</el-button>
				</span>
				<span>日为月结日期，如更改月结日期，将在下个月生效。</span>
				<span class="last-span">（如在5月份更改了月结日期，则6月份为月结日期生效月）</span>
			</div>
			<div class="content">
				<div class="label">选择年份:</div>
				<div>
					<el-select size="medium" v-model="year" placeholder="选择年份" @change="onChange">
						<el-option v-for="item in arrYear" :label="item" :value="item" :key="item" />
					</el-select>
				</div>
			</div>
			<tableList border :loading="loading" :dataSource="dataSource" :columns="MONTHLY_PAY_COLUMNS" />
		</el-card>
		<!-- 编辑弹窗 -->
		<el-dialog title="更改补报单月结日期" :visible.sync="show" width="30%" v-drag>
			<el-form
				class="add-rate"
				:model="ruleForm"
				:rules="rules"
				ref="ruleForm"
				label-width="180px"
				label-position="right"
				label-suffix=":"
			>
				<div class="flex">
					<el-form-item label="当前补报单月结日期" prop="oldDay">
						<el-select size="medium" v-model="ruleForm.oldDay" disabled></el-select>
						<div class="hao m-1">号</div>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="修改后的日期" prop="newDay">
						<el-select size="medium" v-model="ruleForm.newDay" placeholder="请选择日期">
							<el-option v-for="item in createdDays" :key="item" :label="item" :value="item" />
						</el-select>
						<div class="hao">号</div>
					</el-form-item>
				</div>
				<div class="flex t-color">（如更改月结日期，将在下个月生效）</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="save('ruleForm')" class="save">保存</el-button>
				<el-button @click="cacel('ruleForm')" class="cacel">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { MONTHLY_PAY_COLUMNS } from './config';
import qs from 'querystring';

export default {
	name: 'monthlyPay',
	data() {
		return {
			loading: false,
			MONTHLY_PAY_COLUMNS,
			dataSource: [],
			year: '', // 年份
			arrYear: [], // 年份下拉数据
			day: '', // 默认设置月结日期
			show: false,
			ruleForm: {
				oldDay: '', // 之前的日期
				newDay: '', // 修改后的日期
			},
			rules: {
				oldDay: [{ required: false, message: '请输入当前补报单月结日期', trigger: 'blur' }],
				newDay: [{ required: true, message: '请输入修改后的日期', trigger: 'blur' }],
			},
		};
	},
	computed: {
		createdDays() {
			let arr = [];
			for (var i = 1; i <= 31; i++) {
				arr.push(i);
			}
			return arr;
		},
	},
	methods: {
		onChange(val) {
			this.year = val;
			this.getList();
		},
		edit() {
			this.show = true;
			this.ruleForm = {
				...this.ruleForm,
				oldDay: this.day,
			};
		},
		// 保存
		save(formName) {
			this.$refs[formName].validate(async (valid) => {
				if (valid) {
					const { newDay } = this.ruleForm;
					const params = {
						newDay,
					};
					await this.update(params);
					this.show = false;
					this.$refs[formName].resetFields();
					this.getPayDate();
				}
			});
		},
		// 取消
		cacel(formName) {
			this.show = false;
			this.$refs[formName].resetFields();
		},
		// update
		async update(params) {
			const res = await this.$fetch(`/mgmt/sys/updateMonCfg?${qs.stringify(params)}`);
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
			const params = {
				year: this.year,
			};
			const res = await this.$fetch(`/mgmt/sys/getMonCfgLog?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { data } = res;
				this.dataSource = data;
			} else {
				this.dataSource = [];
			}
			this.loading = false;
		},
		// 获取月结的日期
		async getPayDate() {
			const res = await this.$fetch('/mgmt/sys/getMonCfg');
			if (res && res.code === 200) {
				const {
					data: { newDay },
				} = res;
				this.day = newDay;
			} else {
				this.day = '';
			}
		},
		// 初始化
		init() {
			let myDate = new Date();
			let thisYear = myDate.getFullYear(); // 获取当年年份
			// let thisMonth = myDate.getMonth() + 1; // 获取当月月份
			// let thisDate = myDate.getDate(); // 获取当天日期
			let Section = thisYear - 2016; // 声明一个变量 获得当前年份至想获取年份差 eg.2016
			let arrYear = []; // 声明一个空数组 把遍历出的年份添加到数组里
			for (var i = 0; i <= Section; i++) {
				arrYear.push(thisYear--);
			}
			this.arrYear = arrYear;
			this.year = arrYear[0];
		},
	},
	created() {
		this.init();
		this.getList();
		this.getPayDate();
	},
};
</script>
<style lang="scss" scoped>
::v-deep.monthly-pay {
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}
	.tip {
		font-size: 14px;
		margin-bottom: 32px;
		.last-span {
			color: rgb(204, 204, 204);
		}
	}

	.content {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 14px;
		margin-bottom: 32px;
		.label {
			margin-right: 16px;
		}
	}
	.el-select {
		width: 224px;
	}
	.hao {
		width: 25px;
		height: 25px;
		text-align: center;
		line-height: 25px;
		background: #fff;
		position: absolute;
		top: 8px;
		right: 5px;
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
.ed {
	margin: 0 8px;
}
.m-1 {
	background: #f5f7fa !important;
}
.t-color {
	color: red;
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
