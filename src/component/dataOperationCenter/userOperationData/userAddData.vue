<template>
	<div>
		<guideBar />

		<el-row type="flex" justify="space-between" align="middle">
			<el-card class="box-card">
				<el-row class="card-content" type="flex" justify="center" align="middle">
					<div class="word">总用户数</div>
					<br />
					<div class="num">{{ userTotal.total || 0 }}</div>
				</el-row>
			</el-card>
			<el-card class="box-card">
				<el-row class="card-content" type="flex" justify="center" align="middle">
					<div class="word">昨日新增注册用户</div>
					<br />
					<div class="num">{{ userTotal.yesterdayAddTotal || 0 }}</div>
				</el-row>
			</el-card>
			<el-card class="box-card">
				<el-row class="card-content" type="flex" justify="center" align="middle">
					<div class="word">7日内新增注册用户</div>
					<br />
					<div class="num">{{ userTotal.weekTotal || 0 }}</div>
				</el-row>
			</el-card>
			<el-card class="box-card">
				<el-row class="card-content" type="flex" justify="center" align="middle">
					<div class="word">30日内新增注册用户</div>
					<br />
					<div class="num">{{ userTotal.monthTotal || 0 }}</div>
				</el-row>
			</el-card>
		</el-row>

		<el-card>
			<el-row type="flex" align="middle">
				<div>新增用户数</div>
				<el-radio-group class="marginL20" v-model="dayType">
					<el-radio-button label="1">{{ dayData[1] }}</el-radio-button>
					<el-radio-button label="7">{{ dayData[7] }}</el-radio-button>
					<el-radio-button label="30">{{ dayData[30] }}</el-radio-button>
				</el-radio-group>
			</el-row>

			<el-descriptions class="addUserNumBox" direction="vertical" :column="6" border>
				<el-descriptions-item label="新增普通顾客">
					<div class="contentBox">
						<div class="customerTitle">{{ addUserNumData.addMemberOrdiSum }}</div>
						<div class="dateTitle">{{ dayData[dayType] }}</div>
					</div>
				</el-descriptions-item>
				<el-descriptions-item label="新增优惠顾客">
					<div class="contentBox">
						<div class="customerTitle">{{ addUserNumData.addMemberDiscSum }}</div>
						<div class="dateTitle">{{ dayData[dayType] }}</div>
					</div>
				</el-descriptions-item>
				<el-descriptions-item label="新增升级优惠顾客">
					<div class="contentBox">
						<div class="customerTitle">{{ addUserNumData.addMemberUpDiscSum }}</div>
						<div class="dateTitle">{{ dayData[dayType] }}</div>
					</div>
				</el-descriptions-item>
				<el-descriptions-item label="新增购货普通顾客">
					<div class="contentBox">
						<div class="customerTitle">{{ addUserNumData.addMemberShopOrdiSum }}</div>
						<div class="dateTitle">{{ dayData[dayType] }}</div>
					</div>
				</el-descriptions-item>
				<el-descriptions-item label="新增购货优惠顾客">
					<div class="contentBox">
						<div class="customerTitle">{{ addUserNumData.addMemberShopDiscSum }}</div>
						<div class="dateTitle">{{ dayData[dayType] }}</div>
					</div>
				</el-descriptions-item>
				<el-descriptions-item label="新增购货用户">
					<div class="contentBox">
						<div class="customerTitle">{{ addUserNumData.addMemberShopSum }}</div>
						<div class="dateTitle">{{ dayData[dayType] }}</div>
					</div>
				</el-descriptions-item>
			</el-descriptions>
		</el-card>

		<el-card>
			<div>
				<el-row type="flex" align="middle">
					<div>用户每日新增统计</div>
					<el-row class="flex" type="flex" align="middle" justify="end">
						<el-button v-permission="'user_today_add_total_detail'" type="text" @click="lookDetail('user')">
							查看明细
						</el-button>
					</el-row>
				</el-row>

				<div v-if="userList.length" ref="userTodayAddDataTotal" class="echarts"></div>
				<el-empty v-else :image-size="200" />
			</div>
		</el-card>
		<!-- 经办人 -->
		<el-card>
			<el-row type="flex" align="middle">
				<div>经办人（top 10）</div>
				<el-radio-group class="marginL20" v-model="worldTopDay">
					<el-radio-button label="1">昨日</el-radio-button>
					<el-radio-button label="7">7日</el-radio-button>
					<el-radio-button label="30">30日</el-radio-button>
				</el-radio-group>
				<el-row class="flex" type="flex" align="middle" justify="end">
					<el-button type="text" v-permission="'world_top_detail'" @click="lookDetail('hand')">查看明细</el-button>
				</el-row>
			</el-row>
			<div v-if="worldTopOption.yAxis.data.length" ref="worldTop" class="echarts"></div>

			<el-empty v-else :image-size="200" />
		</el-card>
		<!-- 平台 -->
		<el-card>
			<el-row type="flex" align="middle">
				<div>平台</div>
				<el-radio-group class="marginL20" v-model="platform.day">
					<el-radio-button label="1">{{ dayData[1] }}</el-radio-button>
					<el-radio-button label="7">{{ dayData[7] }}</el-radio-button>
					<el-radio-button label="30">{{ dayData[30] }}</el-radio-button>
				</el-radio-group>
				<el-radio-group class="marginL20" v-model="platform.type">
					<el-radio-button label="0">全部</el-radio-button>
					<el-radio-button label="1">普通顾客</el-radio-button>
					<el-radio-button label="2">优惠顾客</el-radio-button>
				</el-radio-group>
			</el-row>
			<div v-if="platformOption.series[0].data.length" ref="platform" class="echarts"></div>
			<el-empty v-else :image-size="200" />
		</el-card>
	</div>
</template>
<script>
import { DAY, ADDUSERNUMDATA, USERTOTAL } from './config.js';
import { formatDateStr } from 'util/formValidation';
export default {
	name: 'userAddData',
	data() {
		return {
			// 顶部的用户统计
			userTotal: USERTOTAL,
			// 新增用户数-----
			dayType: 1,
			dayData: DAY,
			addUserNumData: ADDUSERNUMDATA,
			// ----------------

			// 平台 platform
			platform: {
				day: 1,
				type: 0,
			},
			platformOption: {
				tooltip: {
					trigger: 'item',
					formatter: '{b} : {c} ({d}%)',
					showDelay: 5,
				},
				legend: {
					bottom: 10,
					left: 'center',
				},
				series: [
					{
						type: 'pie',
						selectedMode: 'single',
						radius: '50%',
						data: [],
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)',
							},
						},
					},
				],
			},
			// ---------------

			// 经办人
			worldTopDay: 1,
			worldTopOption: {
				tooltip: {
					trigger: 'axis',
					showDelay: 5,
					axisPointer: {
						type: 'shadow',
					},
				},

				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true,
				},
				xAxis: {
					type: 'value',
				},
				yAxis: {
					type: 'category',
					inverse: true,
					data: [],
				},
				series: [
					{
						type: 'bar',
						data: [],
					},
				],
			},
			// ---------------

			// 用户每日新增统计
			userList: [],
			userOption: {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'line',
					},
					showDelay: 5,
				},
				legend: {
					data: ['新增普通顾客', '新增优惠顾客', '新增升级优惠顾客'],
				},
				grid: {
					left: '3%',
					right: '3%',
					bottom: '3%',
					containLabel: true,
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						data: [],
					},
				],
				yAxis: [
					{
						type: 'value',
					},
				],
				series: [
					{
						name: '新增普通顾客',
						type: 'line',
						stack: '总量',
						areaStyle: {},
						emphasis: {
							focus: 'series',
						},
						data: [],
					},
					{
						name: '新增优惠顾客',
						type: 'line',
						stack: '总量',
						areaStyle: {},
						emphasis: {
							focus: 'series',
						},
						data: [],
					},
					{
						name: '新增升级优惠顾客',
						type: 'line',
						stack: '总量',
						areaStyle: {},
						emphasis: {
							focus: 'series',
						},
						data: [],
					},
				],
			},
			// --------------
			// 详情
			detailInfo: {
				user: 'user_add_detail',
				hand: 'handler_detail',
			},
			// --------------
		};
	},
	watch: {
		dayType() {
			this.getAddUserNumber();
		},

		platform: {
			handler() {
				this.getPlatform();
			},
			deep: true,
		},

		worldTopDay() {
			this.getWorldTop();
		},
	},
	methods: {
		// 用户每日新增统计
		async getUserTodayTotal() {
			const start = new Date();
			const end = new Date();
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
			// this.$echarts.init(this.$refs.userTodayAddDataTotal).setOption(this.userOption);
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/dataAdmin/userData/getDayIncreasePage`,
				data: { startTime: formatDateStr(start, 'day'), endTime: formatDateStr(end, 'day') },
			});
			if (res?.code == 200 && res?.data) {
				const { list } = res.data;
				this.userOption.xAxis[0].data = list.map(x => x.statisticsDate);
				this.userOption.series[0].data = list.map(x => x.addMemberOrdi1d);
				this.userOption.series[1].data = list.map(x => x.addMemberDisc1d);
				this.userOption.series[2].data = list.map(x => x.addMemberUpDisc1d);
				this.userList = list;
				if (list.length) {
					this.$nextTick(() => {
						this.$echarts.init(this.$refs.userTodayAddDataTotal).setOption(this.userOption);
					});
				}
			}
		},
		// 经办人（top 10）
		async getWorldTop() {
			const { worldTopDay, worldTopOption } = this;
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/dataAdmin/userData/handled/list/top`,
				params: {
					day: worldTopDay,
				},
			});
			if (res?.code == 200) {
				this.worldTopOption.yAxis.data = res.data.map(x => x.handledName);
				this.worldTopOption.series[0].data = res.data.map(x => x.handledCount);
				if (res.data.length) {
					this.$nextTick(() => {
						this.$echarts.init(this.$refs.worldTop).setOption(worldTopOption);
					});
				}
			}
		},
		// 平台
		async getPlatform() {
			const {
				platform: { day, type },
				platformOption,
			} = this;
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/dataAdmin/userData/platform/list`,
				params: {
					day,
					type,
				},
			});
			if (res?.code == 200 && res?.data) {
				this.platformOption.series[0].data = res.data.map(x => {
					x['value'] = x['count'];
					return x;
				});
				if (res.data.length) {
					this.$nextTick(() => {
						this.$echarts.init(this.$refs.platform).setOption(platformOption);
					});
				}
			}
		},

		// 查看明细
		lookDetail(str) {
			this.$go(this.detailInfo[str]);
		},

		// 获取新增用户数
		async getAddUserNumber() {
			const { dayType } = this;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/dataAdmin/userData/getIncreaseToalByDayType`,
				data: { dayType },
			});
			if (res?.code == 200 && res?.data) {
				this.addUserNumData = res.data;
			} else {
				this.addUserNumData = ADDUSERNUMDATA;
			}
		},

		// 获取近期用户增长总数
		async getUserTotal() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/dataAdmin/userData/getDwsMemberTypeToal`,
			});
			if (res?.code == 200 && res?.data) {
				this.userTotal = res.data;
			} else {
				this.userTotal = USERTOTAL;
			}
		},
	},
	mounted() {
		this.getUserTotal();
		this.getAddUserNumber();
		this.getUserTodayTotal();
		this.getWorldTop();
		this.getPlatform();
	},
};
</script>
<style lang="scss" scoped>
$height: 20px;

.box-card {
	width: 24%;
	.card-content {
		flex-direction: column;
		padding: 24px;
		.num {
			font-weight: bold;
			font-size: 40px;
		}
	}
}
.marginL20 {
	margin-left: $height;
}
.flex {
	flex: 1;
}
.echarts {
	width: 100%;
	height: 500px;
	margin: $height;
}
.addUserNumBox {
	margin-top: $height;
	.contentBox {
		padding: 30px 0;
		.customerTitle {
			font-size: 25px;
			font-weight: bold;
		}
	}
}
</style>