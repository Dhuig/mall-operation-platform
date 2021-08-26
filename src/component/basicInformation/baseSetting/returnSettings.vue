<template>
	<div class="return-settings">
		<guideBar />
		<el-card class="box-card">
			<el-tabs v-model="activeTab">
				<!-- 购买、退/换货单 -->
				<el-tab-pane label="购买、退/换货单" name="one">
					<tableList
						:loading="one.loading"
						border
						:dataSource="one.data"
						:columns="RETURN_SETTINGS_COLUMNS"
						:options="options"
						slotcontent
					>
						<template slot-scope="row">
							<el-button v-permission="'return_settings_return_settime'" type="text" @click="handleEdit(row.data)">
								设置时间
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
				<!-- 单位团购订单 -->
				<el-tab-pane label="单位团购订单" name="two">
					<tableList
						:loading="two.loading"
						border
						:dataSource="two.data"
						:columns="RETURN_SETTINGS_COLUMNS"
						:options="options"
						slotcontent
					>
						<template slot-scope="row">
							<el-button v-permission="'return_settings_group_settime'" type="text" @click="handleEdit(row.data)">
								设置时间
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
				<!--押货单、押货退/换货单  -->
				<el-tab-pane label="押货单、押货退/换货单" name="three">
					<tableList
						:loading="three.loading"
						border
						:dataSource="three.data"
						:columns="RETURN_SETTINGS_COLUMNS"
						:options="options"
						slotcontent
					>
						<template slot-scope="row">
							<el-button v-permission="'return_settings_pledge_settime'" type="text" @click="handleEdit(row.data)">
								设置时间
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
			<!-- <tableList
				:loading="loading"
				border
				:dataSource="dataSource"
				:columns="RETURN_SETTINGS_COLUMNS"
				:options="options"
				slotcontent
			>
				<template slot-scope="row">
					<span class="btns" @click="handleEdit(row.data)">
						设置时间
					</span>
				</template>
			</tableList> -->
		</el-card>
		<!-- 设置时间弹窗 -->
		<el-dialog title="设置时间" :visible.sync="show" width="700px" v-drag>
			<el-form class="add-rate" :model="ruleForm" ref="ruleForm" label-width="110px" label-position="right">
				<div class="flex" v-if="!isEffectiveDate">
					<el-form-item label="设置时间：" prop="sky">
						<el-input-number v-model="ruleForm.sky" controls-position="right" class="wd" :min="0" :max="39" />
						<span class="sky">天</span>
					</el-form-item>
					<el-form-item class="set" prop="hour">
						<el-input-number v-model="ruleForm.hour" controls-position="right" class="wd" :min="0" :max="23" />
						<span class="sky">时</span>
					</el-form-item>
					<el-form-item class="set" prop="minute">
						<el-input-number v-model="ruleForm.minute" controls-position="right" class="wd" :min="0" :max="59" />
						<span class="sky">分</span>
					</el-form-item>
				</div>
				<div class="flex" v-else>
					<el-form-item label="常规产品订单-待付款状态，次月" prop="sky" label-width="220px">
						<el-input-number v-model="ruleForm.effectiveDate" controls-position="right" class="wd" :min="1" :max="28" />
						<span class="sky">日后状态未变为已支付，则系统自动取消订单</span>
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="saveSettime('ruleForm')" class="save">保存</el-button>
				<el-button @click="cacelSettime('ruleForm')" class="cacel">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { RETURN_SETTINGS_COLUMNS, ORDER_TYPE } from './config';
import qs from 'querystring';
// import { getNextMonthNum } from 'util/formValidation';

export default {
	name: 'returnSettings',
	data() {
		return {
			effectiveDateNumMax: null,
			isEffectiveDate: false,
			RETURN_SETTINGS_COLUMNS,
			activeTab: 'one',
			one: {
				loading: false,
				data: [],
			},
			two: {
				loading: false,
				data: [],
			},
			three: {
				loading: false,
				data: [],
			},
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			show: false,
			ruleForm: {
				sky: 0, // 天数
				hour: 0, // 小时
				minute: 0, // 分钟
				effectiveDate: 1,
			},
			row: {},
		};
	},
	computed: {
		orderTypes() {
			return ORDER_TYPE[this.activeTab];
		},
	},
	watch: {
		orderTypes() {
			this.getList();
		},
	},
	methods: {
		// 编辑按钮
		handleEdit(row) {
			this.show = true;
			this.row = row;
			this.isEffectiveDate = row.type == 2;
			let sky = parseInt(row.configTime / 60 / 24);
			let hour = parseInt((row.configTime / 60) % 24);
			let minute = parseInt(row.configTime % 60);
			this.ruleForm = {
				sky,
				hour,
				minute,
				effectiveDate: row.configTime,
			};
		},
		// 保存
		async saveSettime() {
			const { sky, hour, minute, effectiveDate } = this.ruleForm;
			const { id, type } = this.row;
			let configTime = sky * 24 * 60 + hour * 60 + minute;
			if (configTime === 0) return this.$message.warning('设置时间需大于1分钟');
			const params = { id, configTime: type == 2 ? effectiveDate : configTime };
			await this.update(params);
			this.$nextTick(() => {
				this.show = false;
				this.getList();
			});
		},
		// 取消
		cacelSettime(formName) {
			this.$refs[formName].resetFields();
			this.show = false;
		},
		// 修改接口
		async update(params) {
			const res = await this.$fetch(`/mgmt/sys/updateOrderConfigTime?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
		},
		// 请求数据
		async getList() {
			// this.loading = true;
			// const res = await this.$fetch('/mgmt/sys/getOrderConfigList');
			// if (res && res.code === 200) {
			// 	const { data } = res;
			// 	this.dataSource = data;
			// } else {
			// 	this.dataSource = [];
			// }
			// this.loading = false;
			const { activeTab, orderTypes } = this;
			this[activeTab].loading = true;
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/sys/getOrderConfigsByType',
				data: orderTypes,
			});

			if (res && res.code === 200) {
				const { data } = res;
				this[activeTab].data = data;
			} else {
				this[activeTab].data = [];
			}
			this[activeTab].loading = false;
		},
	},
	created() {
		this.getList();
		// this.effectiveDateNumMax = getNextMonthNum().monthNum;
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
