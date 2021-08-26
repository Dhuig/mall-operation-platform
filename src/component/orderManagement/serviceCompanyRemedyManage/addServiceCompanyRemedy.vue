<template>
	<div class="add-service-company">
		<guideBar />
		<el-card>
			<h3 class="title">补报信息</h3>
			<el-form
				size="small"
				:model="formData"
				label-suffix=":"
				label-position="right"
				label-width="140px"
				ref="form"
				:rules="ADD_FORM_RULES"
			>
				<el-row>
					<el-col :span="10">
						<el-form-item
							label="云商会员卡号"
							prop="cardNo"
							:rules="{
								required: !this.formData.selectAll,
								message: '输入云商的会员卡号，8~10位数字',
								trigger: 'blur',
							}"
						>
							<el-input v-model="formData.cardNo" :disabled="formData.selectAll" clearable />
						</el-form-item>
					</el-col>
					<el-col :span="2" class="is-select-all">
						<!-- <el-form-item label="" prop="selectAll"> -->
						<el-checkbox class="all" v-model="formData.selectAll" @change="handleChange">所有云商</el-checkbox>
						<!-- </el-form-item> -->
					</el-col>
				</el-row>
				<el-col :span="10">
					<el-form-item label="允许补报月份" prop="month">
						<el-date-picker v-model="month" type="month" disabled class="full-width" format="yyyy-MM" />
					</el-form-item>
				</el-col>
				<el-col :span="10">
					<el-form-item label="补报开始时间" prop="startTime">
						<el-date-picker
							v-model="formData.startTime"
							:picker-options="timeDisabel"
							class="full-width"
							type="datetime"
							value-format="timestamp"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="10">
					<el-form-item label="补报结束时间" prop="endTime">
						<el-date-picker
							v-model="formData.endTime"
							:picker-options="timeDisabel"
							class="full-width"
							type="datetime"
							value-format="timestamp"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="10">
					<el-form-item label="说明" prop="remark">
						<el-input
							v-model="formData.remark"
							type="textarea"
							maxlength="1000"
							show-word-limit
							:autosize="{ minRows: 4, maxRows: 10 }"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="10">
					<el-form-item>
						<el-button @click="handleCancel">返回</el-button>
						<el-button type="primary" @click="handleAdd">确认</el-button>
					</el-form-item>
				</el-col>
			</el-form>
		</el-card>
	</div>
</template>

<script>
import { ADD_FORM_RULES } from './config';
import { getLastMonth } from '@/util/formValidation';

export default {
	name: 'addServiceCompanyRemedy',
	data() {
		return {
			formData: {
				cardNo: '',
				startTime: Date.now(),
				endTime: null,
				remark: '',
				selectAll: false,
			},
			timeDisabel: {
				disabledDate(time) {
					return new Date(time).getMonth() + 1 != new Date().getMonth() + 1;
				},
			},
			ADD_FORM_RULES,
		};
	},
	computed: {
		month() {
			return getLastMonth();
		},
	},
	methods: {
		handleCancel() {
			this.$closeSelf();
		},
		// 补报开始时间回调
		remedyTimeJudge() {
			const {
				formData: { startTime, endTime },
			} = this;
			console.log(startTime);

			if (!startTime || !endTime) {
				return {
					useAble: false,
					message: '补报开始时间 和 补报结束时间 必须填写',
				};
			}
			if (startTime >= endTime) {
				return {
					useAble: false,
					message: '补报开始时间不能晚于补报结束时间',
				};
			}
			return {
				useAble: true,
				message: '补报时间可用',
			};
		},
		async handleAdd() {
			this.$refs.form.validate(async (valid) => {
				if (valid) {
					const timeJudgeResult = this.remedyTimeJudge();
					if (!timeJudgeResult.useAble) return this.$message.error(timeJudgeResult.message);

					const res = await this.$fetch({
						method: 'POST',
						url: '/auth/scenes/permission/addMonthlyReport',
						data: this.formData,
					});
					console.log('res: ', res);
					if (res && res.code === 200) {
						this.$message({
							type: 'success',
							message: res.message || '新增云商补报单成功',
							onClose: () => {
								this.$dispatch('GET_SERVER_COMPANY_LIST');
								this.$closeSelf();
							},
						});
					} else {
						this.$message.success(res.data.message);
					}
				}
			});
		},
		// 备选项改变
		handleChange(checked) {
			if (checked) {
				this.formData.cardNo = '';
			}
		},
	},
	created() {
		getLastMonth();
	},
};
</script>

<style lang="scss" scoped>
.add-service-company {
	min-width: 1096px;
	.full-width {
		width: 100%;
	}
	.is-select-all {
		.el-checkbox {
			margin-top: 0;
		}
	}
	.all {
		margin: 8px 0 0 20px;
	}
	.title {
		font-size: 20px;
		font-weight: 500;
		padding-bottom: 20px;
	}
	.el-input__count {
		bottom: 40px;
	}
	.el-col-12 {
		display: flex;
	}
	.el-form {
		display: flex;
		flex-direction: column;
	}
	.operat-button {
		width: 45%;
		margin-top: 100px;
		display: flex;
		justify-content: flex-end;
	}
}
</style>
