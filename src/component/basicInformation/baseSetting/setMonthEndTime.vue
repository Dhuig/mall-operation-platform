<template>
	<div class="return-settings">
		<guideBar>
			<el-button type="primary" v-permission="'set_month_end_time_add'" @click="addTime">新增月结时间</el-button>
		</guideBar>
		<el-card>
			<searchPanel ref="searchPanel" v-model="serachData" :config="SET_MONTH_END_TIME_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card class="box-card">
			<tableList :dataSource="dataSource" :columns="SET_MONTH_END_TIME_COLUMNS" slotcontent>
				<template slot-scope="scope">
					<el-button
						type="text"
						v-if="scope.data.status == -1"
						v-permission="'set_month_end_time_edit'"
						@click="handleEdit(scope.data)"
					>
						修改
					</el-button>
				</template>
			</tableList>
		</el-card>
		<el-dialog title="新增月结日期" :visible.sync="show" width="30%" v-drag>
			<el-form
				class="add-rate"
				:model="ruleForm"
				:rules="rules"
				ref="ruleForm"
				label-width="110px"
				label-position="right"
				label-suffix=":"
			>
				<el-form-item label="选择日期" prop="monthlyReturnDto">
					<el-date-picker
						v-model="ruleForm.monthlyReturnDto"
						type="date"
						value-format="yyyy-MM-dd"
						placeholder="选择日期"
						:picker-options="pickerOptions"
					></el-date-picker>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="saveRate('ruleForm')" class="save">保存</el-button>
				<el-button @click="cacelRate('ruleForm')" class="cacel">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { SET_MONTH_END_TIME_COLUMNS, SET_MONTH_END_TIME_CONFIG } from './config';
import { formatDate, getNextMonthNum, formatDateDefault } from 'util/formValidation.js';
export default {
	name: 'setMonthEndTime',
	data() {
		return {
			pickerOptions: {
				disabledDate: this.pickerOptionsTime,
			},
			type: 'add',
			SET_MONTH_END_TIME_COLUMNS,
			SET_MONTH_END_TIME_CONFIG,
			ruleForm: {
				monthlyReturnDto: formatDateDefault(Date.now() + 24 * 60 * 60 * 1000),
			},
			show: false,
			rules: {
				monthlyReturnDto: [{ required: true, message: '请选择时间', trigger: 'change' }],
			},
			serachData: {
				getTime: null,
			},
			id: null,
			dataSource: [],
			status: -1,
			month: null,
		};
	},
	created() {
		this.load();
	},
	computed: {
		serach() {
			let { getTime } = this.serachData;
			let endMonth = formatDate(getTime ? this.serachData.getTime[1] : null, 'month');
			let startMonth = formatDate(getTime ? this.serachData.getTime[0] : null, 'month');
			return { endMonth, startMonth };
		},
	},
	methods: {
		pickerOptionsTime(time) {
			let date = getNextMonthNum();
			let seven = formatDate(Date.now(), 'month') + '-27';
			if (new Date().getMonth() + 1 == this.month.split('')[1]) {
				return Date.now() > time.getTime() || new Date(seven).getTime() < time.getTime();
			} else {
				return (
					new Date(date.str + '-27').getTime() < time.getTime() || new Date(date.str + '-01').getTime() > time.getTime()
				);
			}
		},
		// 编辑按钮
		saveRate() {
			let effectDate = {
				effectDate: this.ruleForm.monthlyReturnDto,
				id: this.id,
			};
			this.$refs['ruleForm'].validate(async valid => {
				if (valid) {
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/sys/monthly/return/${this.type === 'add' ? 'save' : 'update'}`,
						data: effectDate,
					});
					if (res && res.code === 200) {
						this.load();
						this.show = false;
					}
				}
			});
		},
		cacelRate() {
			this.ruleForm.monthlyReturnDto = '';
			this.show = false;
			this.type = 'add';
			this.id = null;
		},
		handleSearch() {
			this.load();
		},
		addTime() {
			if (this.status === -1) return this.$message.warning('设置的月结已生效才能新增月结时间！');
			let date = new Date().getMonth() + 1 + '';
			this.month = date.length > 1 ? date : '0' + date;
			this.show = true;
			this.type = 'add';
			this.id = null;
			this.ruleForm.monthlyReturnDto = formatDateDefault(Date.now() + 24 * 60 * 60 * 1000);
		},
		handleEdit({ effectDate, id, status, month }) {
			if (status == 0) return this.$message.warning('已生效无法修改！');
			this.show = true;
			this.type = 'edit';
			this.id = id;
			this.status = status;
			this.month = month.split('-')[1];
			this.ruleForm.monthlyReturnDto = effectDate;
		},
		// 修改接口
		async load() {
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/sys/monthly/return/list`,
				params: this.serach,
			});
			if (res && res.code === 200) {
				this.dataSource = res.data;
				this.status = res.data[0].status;
			}
		},
		// 请求数据
	},
};
</script>
<style lang="scss" scoped>
::v-deep.return-settings {
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}
	.add-rate {
		.el-form-item {
			margin-bottom: 25px;
			.el-form-item__content {
				display: flex;
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
}
::v-deep.set {
	.el-form-item__content {
		display: flex;
		margin-left: 0px !important;
	}
}
.wd {
	width: 100px;
}
.sky {
	margin: 0 10px;
}
.save {
	width: 100px;
	margin-right: 16px;
}
.cacel {
	width: 100px;
}
</style>
