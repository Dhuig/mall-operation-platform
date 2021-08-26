<template>
	<div class="addAdjustment">
		<guideBar />
		<el-card>
			<el-form class="w50" :model="adjustmentForm" :rules="ADJUSTMENT_RULES" ref="adjustmentForm" label-width="120px">
				<el-form-item label="云商会员卡号" prop="storeCardNo">
					<el-input
						placeholder="输入云商的会员卡号"
						@blur="findStoreCard"
						v-model.trim="adjustmentForm.storeCardNo"
					></el-input>
				</el-form-item>
				<el-form-item label="云商姓名" prop="storeCardName">
					<el-input disabled v-model="adjustmentForm.storeCardName"></el-input>
				</el-form-item>
				<el-form-item label="顾客会员卡号" prop="customerCardNo">
					<el-input
						placeholder="输入顾客的会员卡号"
						@blur="findCustomerCardNo"
						v-model.trim="adjustmentForm.customerCardNo"
					></el-input>
				</el-form-item>
				<el-form-item label="顾客姓名" prop="customerName">
					<el-input disabled v-model="adjustmentForm.customerName"></el-input>
				</el-form-item>
				<el-form-item label="调差月份" prop="adjustmentDate">
					<el-date-picker
						style="width: 100%"
						:picker-options="monthPickerOptions"
						:editable="false"
						value-format="yyyy-MM"
						v-model="adjustmentForm.adjustmentDate"
						type="month"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="调差开始时间" prop="startTime">
					<el-date-picker
						style="width: 100%"
						v-model="adjustmentForm.startTime"
						:editable="false"
						:picker-options="pickerOptions"
						:clearable="false"
						type="datetime"
						placeholder="选择日期时间"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="调差结束时间" prop="endTime">
					<el-date-picker
						style="width: 100%"
						v-model="adjustmentForm.endTime"
						:editable="false"
						:picker-options="pickerOptions"
						:clearable="false"
						type="datetime"
						placeholder="选择日期时间"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="调整方式" prop="adjustmentType">
					<el-select style="width: 100%" v-model="adjustmentForm.adjustmentType" placeholder="请选择调整方式">
						<el-option label="级别" value="1"></el-option>
						<el-option label="级别+收入" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">立即创建</el-button>
					<el-button @click="cancel">取消</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
import { ADJUSTMENT_RULES } from './config';
const lastTime = () => {
	const nowDate = new Date().toLocaleDateString().slice().replace(/\//g, '-');
	return nowDate
		.split('-')
		.map((x, i) => (i == 0 ? x - 2 : x))
		.join('-');
};
export default {
	name: 'addAdjustment',
	data() {
		return {
			monthPickerOptions: {
				disabledDate(time) {
					return Date.parse(new Date(lastTime())) > time.getTime() || time.getTime() > Date.now();
				},
			},
			adjustmentForm: {
				storeCardNo: '',
				storeCardName: '',
				customerCardNo: '',
				customerName: '',
				adjustmentDate: '',
				startTime: new Date(),
				endTime: '',
				adjustmentType: null,
			},
			flag: false,
			ADJUSTMENT_RULES,
		};
	},
	computed: {
		pickerOptions() {
			return {
				// 日期选择限制
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7;
				},
			};
		},
	},
	methods: {
		// 查询 云商会员卡号
		async findStoreCard() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/auth/adjustment/permission/checkCardNo',
				data: { cardNo: this.adjustmentForm.storeCardNo, type: 1 },
			});
			if (res.code == 200) {
				// "agentOrder": true,//代客下单
				//"selfOrder": true,//自购下单
				const { agentOrder, selfOrder, realname } = res.data;
				this.flag = false;
				// 未勾选“自购下单”及“代客下单”权限时
				if (!agentOrder && !selfOrder) {
					this.$message.warning('该会员卡号关联服务中心未开通下单权限');
				} else if (selfOrder && !agentOrder) {
					//仅勾选“自购下单”时，提示：“该云商会员卡号仅能自购下单”，同时，“顾客会员卡号”自动填写该云商的会员卡号；
					this.$refs.adjustmentForm.clearValidate('customerCardNo');
					this.$message.warning('该云商会员卡号仅能自购下单');
					this.adjustmentForm.customerCardNo = this.adjustmentForm.storeCardNo;
					this.findCustomerCardNo();
					this.flag = true;
				} else if (agentOrder && !selfOrder) this.$message.warning('该云商会员卡号仅能代客下单');
				this.adjustmentForm.storeCardName = realname;
			} else {
				this.adjustmentForm.storeCardName = '';
			}
		},
		// 查询 顾客会员卡号
		async findCustomerCardNo() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/auth/adjustment/permission/checkCardNo',
				data: { cardNo: this.adjustmentForm.customerCardNo, type: 2 },
			});
			if (res.code == 200) {
				this.adjustmentForm.customerName = res.data.realname;
			} else {
				this.adjustmentForm.customerName = '';
			}
		},
		// 提交
		onSubmit() {
			const { startTime, endTime, customerCardNo, storeCardNo } = this.adjustmentForm;
			this.$refs.adjustmentForm.validate(async valid => {
				if (valid) {
					if (
						Date.parse(new Date()) > Date.parse(new Date(startTime)) ||
						Date.parse(new Date()) > Date.parse(new Date(endTime))
					) {
						return this.$message.warning('调差开始/结束时间不可选择之前的时间');
					}

					if (Date.parse(new Date(startTime)) >= Date.parse(new Date(endTime))) {
						return this.$message.warning('结束时间要晚于开始时间');
					}

					if (this.flag && customerCardNo != storeCardNo) {
						return this.$message.warning('该云商会员卡号仅能自购下单');
					}

					const res = await this.$fetch({
						method: 'POST',
						url: '/auth/adjustment/permission/add',
						data: this.adjustmentForm,
					});
					if (res?.code == 200) {
						this.$message.success('添加成功');
						this.$dispatch('UPDATA_ADJUSTMENT_LIST');
						this.cancel();
					}
				}
			});
		},
		// 取消
		cancel() {
			this.$refs.adjustmentForm.resetFields();
			this.$closeSelf();
			this.$go('adjustment_list');
		},
	},
};
</script>
<style lang="scss" scoped>
.w50 {
	width: 500px;
}
</style>
