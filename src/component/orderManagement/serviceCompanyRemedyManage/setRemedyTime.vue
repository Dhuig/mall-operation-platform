<template>
	<!-- <div class="set-remedy-time"> -->
	<el-dialog :visible.sync="visible" title="设置公开补报时间" @close="cencal" v-drag>
		<div style="dialogBox">
			<h4 class="set-remedy-time">设置后会立即生效</h4>
			<el-form ref="setRemedyForm" :model="formData" label-suffix=":" :rules="SET_REMEDY_RULES">
				<el-row type="flex">
					<el-col :span="9">
						<el-form-item label="补报开始时间" prop="startDay">
							本月
							<el-select v-model="formData.startDay" style="width: 120px">
								<el-option
									v-for="item in daySelect"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
							日,
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label prop="startTime">
							<el-time-picker
								v-model="formData.startTime"
								format="HH:mm"
								value-format="HH:mm"
								:picker-options="{ selectableRange: '00:00:00 - 23:59:59' }"
								placeholder="任意时间点"
							></el-time-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="9">
						<el-form-item label="补报结束时间" prop="endDay">
							本月
							<el-select v-model="formData.endDay" style="width: 120px">
								<el-option
									v-for="item in daySelect"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
							日,
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item prop="endTime">
							<el-time-picker
								v-model="formData.endTime"
								format="HH:mm"
								value-format="HH:mm"
								:picker-options="{ selectableRange: '00:00:00 - 23:59:59' }"
								placeholder="任意时间点"
							></el-time-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="set-remedy-time">设置补报截止时间</div>
				<el-row>
					<el-col>
						<el-form-item label="本月补报截止时间" prop="deadline">
							本月
							<el-select v-model="formData.deadline" style="width: 120px">
								<el-option
									v-for="item in daySelect"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
							日, 设置后会在截至日期前30分钟生效
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button @click="cencal">取 消</el-button>
			<el-button type="primary" @click="handleSetRemedy">保存设置</el-button>
		</span>
	</el-dialog>
	<!-- </div> -->
</template>

<script>
import { SET_REMEDY_RULES } from './config';
export default {
	name: 'setRemedyTime',
	props: {
		getRemedyTime: Function,
		formData: Object,
	},
	data() {
		return {
			visible: false,
			SET_REMEDY_RULES,
			daySelect: [],
		};
	},
	methods: {
		// 保存公开补报时间
		handleSetRemedy() {
			this.$refs['setRemedyForm'].validate(async valid => {
				if (valid) {
					const res = await this.$fetch({
						method: 'POST',
						url: '/auth/scenes/permission/updateBaseMonthlyReport',
						data: this.formData,
					});
					if (res && res.code === 200) {
						this.$message.success('设置成功');
						this.getRemedyTime();
						this.$parent.getAbortTime(); //获取截止时间更新
						this.$parent.getAlterRecord(); // 查询公开补报变更记录
						this.$parent.getAlterRecordTime();
						this.visible = false;
					} else {
						res && this.$message.error(res.message);
					}
				}
			});
		},
		// 取消重置
		cencal() {
			this.$refs.setRemedyForm.resetFields();
			this.visible = false;
		},
		// 获取当前月份的天数
		mGetDate() {
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var d = new Date(year, month, 0);
			return d.getDate();
		},
		// 选择日期列表
		daySelectList() {
			let day = new Array(this.mGetDate());
			this.daySelect = day.fill(1).map((item, index) => {
				if (index + 1 < 10) {
					return { label: '0' + (index + 1), value: `${'0' + (index + 1)}` };
				}
				return { label: index + 1, value: `${index + 1}` };
			});
		},
	},
	mounted() {
		this.daySelectList();
	},
};
</script>

<style lang="scss" scoped>
.set-remedy-time {
	padding-bottom: 20px;
}
::v-deep .el-dialog {
	width: 60%;
}
.dialogBox {
	height: 350px;
}
</style>