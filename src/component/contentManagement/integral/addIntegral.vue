<template>
	<div class="charging-list">
		<guideBar></guideBar>
		<el-card>
			<el-form :model="form" label-suffix=": " style="width: 500px" :rules="rules" ref="ruleForm" label-width="120px">
				<el-form-item label="选择计划" prop="planId">
					<el-select v-model="form.planId" style="width: 100%" :disabled="Boolean($route.query.id)">
						<el-option
							v-for="(item, index) in planList"
							:key="index"
							:label="item.label"
							:value="item.value"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="任务周期" prop="taskTime">
					<el-date-picker
						v-model="form.taskTime"
						type="monthrange"
						range-separator="至"
						start-placeholder="开始月份"
						end-placeholder="结束月份"
						value-format="yyyy-MM"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="任务名称" prop="taskName">
					<el-input type="text" v-model="form.taskName" maxlength="30" show-word-limit />
				</el-form-item>
				<el-form-item label="任务描述">
					<el-input
						type="textarea"
						:autosize="{ minRows: 4 }"
						v-model="form.taskDescribe"
						maxlength="200"
						show-word-limit
					/>
				</el-form-item>
				<el-form-item label="子任务" required>
					<el-checkbox v-model="taskA" label="条件A：积分达标"></el-checkbox>
					<el-checkbox v-model="taskB" label="条件B：1个月合格客户经理"></el-checkbox>
				</el-form-item>
				<el-form-item label="积分达标方式" prop="pvPassMethod">
					<el-select v-model="form.pvPassMethod" style="width: 100%">
						<el-option label="个人消费积分(个人积分)" :value="1"></el-option>
						<el-option label="个人累计消费积分(小组积分)" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="任务计算" prop="taskMethod">
					<el-select v-model="form.taskMethod" style="width: 100%">
						<el-option label="任务周期内每月累计" :value="1"></el-option>
						<el-option label="任务周期内任意一个月" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="达标积分" prop="taskAPv">
					<el-input type="text" v-model="form.taskAPv" maxlength="10" show-word-limit />
				</el-form-item>
				<el-form-item label="条件A说明" prop="taskADescribe">
					<el-input
						type="textarea"
						:autosize="{ minRows: 4 }"
						maxlength="200"
						show-word-limit
						v-model="form.taskADescribe"
					/>
				</el-form-item>
				<el-form-item label="条件B说明" prop="taskBDescribe">
					<el-input
						type="textarea"
						:autosize="{ minRows: 4 }"
						maxlength="200"
						show-word-limit
						v-model="form.taskBDescribe"
					/>
				</el-form-item>
			</el-form>
		</el-card>
		<actionBar>
			<template>
				<el-button type="primary" @click="$closeSelf()">取消</el-button>
				<el-button type="primary" @click="save">保存</el-button>
			</template>
		</actionBar>
	</div>
</template>

<script>
export default {
	name: 'addIntegral',
	data() {
		const taskAPvnum = (rule, value, callback) => {
			if (value.trim() == '') {
				return callback(new Error('请填写达标积分'));
			} else if (!/^[0-9]\d*$/.test(value)) {
				return callback(new Error('请填写正整数字'));
			} else {
				callback();
			}
		};
		return {
			taskA: false,
			taskB: false,
			form: {
				id: null,
				planId: '',
				taskA: '',
				taskMethod: '',
				pvPassMethod: '',
				taskTime: '',
				taskADescribe: '',
				taskAPv: '',
				taskB: '',
				taskBDescribe: '',
				taskDescribe: '',
				taskEndTime: '',
				taskName: '',
				taskStartTime: '',
			},
			planList: [],
			rules: {
				planId: [{ required: true, message: '请选择计划', trigger: 'blur' }],
				taskName: [{ required: true, message: '请填写任务名称', trigger: 'blur' }],
				taskDescribe: [{ required: true, message: '请填写任务描述', trigger: 'blur' }],
				taskAPv: [{ required: true, validator: taskAPvnum, trigger: 'blur' }],
				taskADescribe: [{ required: true, message: '请填写条件A说明', trigger: 'blur' }],
				taskBDescribe: [{ required: true, message: '请填写条件B说明', trigger: 'blur' }],
				taskTime: [{ required: true, message: '请选择任务周期', trigger: 'change' }],
				taskMethod: [{ required: true, message: '请选择任务计算', trigger: 'change' }],
				pvPassMethod: [{ required: true, message: '请选择积分达标方式', trigger: 'change' }],
			},
		};
	},
	created() {
		if (this.$route.query.id) this.loadData();
		this.getPlanList();
		this.$listen('ADD_INTEGRAL_PANLIST', this.getPlanList);
	},
	watch: {
		taskA: {
			handler(val) {
				this.rules.taskADescribe[0].required = val;
			},
			immediate: true,
		},
		taskB: {
			handler(val) {
				this.rules.taskBDescribe[0].required = val;
			},
			immediate: true,
		},
	},
	methods: {
		save() {
			this.$refs.ruleForm.validate(async valid => {
				if (valid) {
					let { title } = this.$route.query;
					let { planId, taskADescribe, taskAPv, taskBDescribe, taskDescribe, taskName, taskMethod, pvPassMethod } =
						this.form;
					let { taskA, taskB } = this;
					if (this.form.taskTime == '') return this.$message.warning('任务周期必填');
					if (!taskA && !taskB) return this.$message.warning('子任务必填');
					let [taskStartTime, taskEndTime] = this.form.taskTime;
					let params = {
						planId,
						taskADescribe,
						taskAPv,
						taskBDescribe,
						taskDescribe,
						taskName,
						taskMethod,
						pvPassMethod,
					};
					params.taskA = taskA ? '积分达标' : '';
					params.taskB = taskB ? '1个月合格客户经理' : '';
					params.id = this.$route.query.id ? this.form.id : null;
					const res = await this.$fetch({
						method: 'POST',
						url: `/member/tool/${title === '新增任务' ? 'addTask' : 'updateTaskInfo'}`,
						data: { ...params, taskEndTime, taskStartTime },
					});
					if (res && res.code == 200) {
						this.$message.success(res.message);
						this.$dispatch('INTEGRAL_MANAGEMENT');
						this.$closeSelf();
					}
				}
			});
		},
		async getPlanList() {
			const res = await this.$fetch('/member/tool/getPlanList');
			if (res && res.data) {
				this.planList = res.data.map(({ id, planName }) => ({ label: planName, value: id }));
			}
		},
		async loadData() {
			const res = await this.$fetch('/member/tool/queryTaskInfo?taskId=' + this.$route.query.id);
			if (res && res.data) {
				let { taskA, taskB, planId, taskStartTime, taskEndTime } = res.data;
				this.form = Object.assign(this.form, res.data);
				this.form.id = this.$route.query.id;
				this.form.planId = String(planId);
				this.form.taskTime = [taskStartTime, taskEndTime];
				if (taskA) this.taskA = true;
				if (taskB) this.taskB = true;
			}
		},
	},
};
</script>
<style lang="scss" scoped>
</style>
