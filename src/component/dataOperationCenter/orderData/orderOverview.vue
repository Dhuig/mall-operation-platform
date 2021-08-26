<template>
	<div>
		<guideBar />
		<el-card>
			<div style="margin-bottom: 20px">订单概览</div>
			<searchPanel v-model="searchConfig" :config="ORDER_OVERVIEW_SEARCH" @search="search" />
		</el-card>
		<!-- 中间数据 -->
		<el-row type="flex" justify="space-between" align="middle">
			<el-card class="box-card">
				<el-row class="card-content" type="flex" justify="center" align="middle">
					<div class="word">总提交订单金额（元）</div>
					<br />
					<div class="num">200,000</div>
				</el-row>
			</el-card>
			<el-card class="box-card">
				<el-row class="card-content" type="flex" justify="center" align="middle">
					<div class="word">总支付订单金额（元）</div>
					<br />
					<div class="num">100,000</div>
				</el-row>
			</el-card>
			<el-card class="box-card">
				<el-row class="card-content" type="flex" justify="center" align="middle">
					<div class="word">总退款金额（元）</div>
					<br />
					<div class="num">2000</div>
				</el-row>
			</el-card>
			<el-card class="box-card">
				<el-row class="card-content" type="flex" justify="center" align="middle">
					<div class="word">总用户数</div>
					<br />
					<div class="num">2000</div>
				</el-row>
			</el-card>
			<el-card class="box-card">
				<el-row class="card-content" type="flex" justify="center" align="middle">
					<div class="word">总用户数</div>
					<br />
					<div class="num">2000</div>
				</el-row>
			</el-card>
		</el-row>
		<!-- 订单漏斗 -->
		<el-card>
			<div slot="header">
				<span>订单漏斗</span>
			</div>
			<el-row type="flex" align="middle">
				<div class="funnel-data">
					<el-row type="flex" class="row bgGreen">
						<div class="box">
							<div class="word">开单人数</div>
							<div class="num">800</div>
						</div>
						<div class="box">
							<div class="word">下单订单数</div>
							<div class="num">800</div>
						</div>
						<div class="box">
							<div class="word">下单订单金额（元）</div>
							<div class="num">80,000.00</div>
						</div>
					</el-row>
					<el-row type="flex" class="row bgYellow">
						<div class="box">
							<div class="word">支付人数</div>
							<div class="num">800</div>
						</div>
						<div class="box">
							<div class="word">支付订单数</div>
							<div class="num">800</div>
						</div>
						<div class="box">
							<div class="word">支付订单金额（元）</div>
							<div class="num">80,000.00</div>
						</div>
					</el-row>
					<el-row type="flex" class="row bgViolet">
						<div class="box">
							<div class="word">完成人数</div>
							<div class="num">800</div>
						</div>
						<div class="box">
							<div class="word">完成订单数</div>
							<div class="num">800</div>
						</div>
						<div class="box">
							<div class="word">完成订单金额（元）</div>
							<div class="num">80,000.00</div>
						</div>
						<div class="box">
							<div class="word">客单价（元）</div>
							<div class="num">80,000.00</div>
						</div>
					</el-row>
				</div>

				<div style="width: 30%" ref="funnel" class="echearts"></div>
			</el-row>
		</el-card>
		<!-- 业务分公司（top 10) / 交付门店（top 10） -->
		<el-row type="flex" align="middle" justify="space-between">
			<!-- 交付公司 -->
			<el-card class="width50">
				<el-row type="flex" align="middle">
					<div>业务分公司（top 10)</div>
					<el-row class="flex" type="flex" align="middle" justify="end">
						<el-button type="text" @click="lookDetail('hand')">查看明细</el-button>
					</el-row>
				</el-row>
				<div ref="company" class="echearts"></div>
			</el-card>
			<!-- 交付门店 -->
			<el-card class="width50">
				<el-row type="flex" align="middle">
					<div>交付门店（top 10）</div>
					<el-row class="flex" type="flex" align="middle" justify="end">
						<el-button type="text" @click="lookDetail('hand')">查看明细</el-button>
					</el-row>
				</el-row>
				<div ref="store" class="echearts"></div>
			</el-card>
		</el-row>
		<!-- 配送方式 / 下单方式 -->
		<el-row type="flex" align="middle" justify="space-between">
			<!-- 交付公司 -->
			<el-card class="width50">
				<div>配送方式</div>

				<div ref="send" class="echearts"></div>
			</el-card>
			<!-- 交付门店 -->
			<el-card class="width50">
				<div>下单方式</div>

				<div ref="order" class="echearts"></div>
			</el-card>
		</el-row>
		<!-- 下单平台 / 下单路由 -->
		<el-row type="flex" align="middle" justify="space-between">
			<!-- 交付公司 -->
			<el-card class="width50">
				<div>下单平台</div>

				<div ref="platform" class="echearts"></div>
			</el-card>
			<!-- 交付门店 -->
			<el-card class="width50">
				<div>下单路由</div>

				<div ref="route" class="echearts"></div>
			</el-card>
		</el-row>
		<!-- 支付方式 -->
		<el-card>
			<div>平台</div>
			<div ref="pay" class="echearts"></div>
		</el-card>
	</div>
</template>
<script>
import { ORDER_OVERVIEW_SEARCH } from './config.js';
export default {
	name: 'orderOverview',
	data() {
		return {
			searchConfig: {},
			ORDER_OVERVIEW_SEARCH,
			funnelConfig: {
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b} : {c}%',
					showDelay: 5,
				},

				legend: {},

				series: [
					{
						name: '漏斗图',
						type: 'funnel',
						left: '10%',
						top: 60,
						bottom: 60,
						width: '80%',
						min: 0,
						max: 100,
						minSize: '30%',
						maxSize: '100%',
						sort: 'descending',
						gap: 2,
						label: {
							show: true,
							position: 'inside',
						},
						labelLine: {
							length: 10,
							lineStyle: {
								width: 1,
								type: 'solid',
							},
						},
						itemStyle: {
							borderColor: '#fff',
							borderWidth: 1,
						},
						emphasis: {
							label: {
								fontSize: 18,
							},
						},
						data: [
							{ value: 60, name: '访问' },
							{ value: 40, name: '咨询' },
							{ value: 20, name: '订单' },
						],
					},
				],
			},
			companyOption: {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow',
					},
				},

				grid: {
					left: '3%',
					right: '10%',
					bottom: '3%',
					containLabel: true,
				},
				xAxis: {
					type: 'value',
					boundaryGap: [0, 0.01],
				},
				yAxis: {
					type: 'category',
					data: [
						'吴彦祖1',
						'吴彦祖2',
						'吴彦祖3',
						'吴彦祖4',
						'吴彦祖5',
						'吴彦祖6',
						'吴彦祖7',
						'吴彦祖8',
						'吴彦祖9',
						'吴彦祖10',
					],
				},
				series: [
					{
						name: '2011年',
						type: 'bar',
						data: [18203, 23489, 29034, 104970, 131744, 131744 + 2, 131744 + 4, 131744 + 8, 131999, 1999999],
					},
				],
			},
			pieOption: {
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b} : {c} ({d}%)',
					showDelay: 5,
				},
				legend: {
					bottom: 10,
					left: 'center',
				},
				series: [
					{
						name: '访问来源',
						type: 'pie',
						selectedMode: 'single',
						radius: '50%',
						data: [
							{ value: 1048, name: '搜索引擎' },
							{ value: 735, name: '直接访问' },
							{ value: 580, name: '邮件营销' },
							{ value: 484, name: '联盟广告' },
							{ value: 300, name: '视频广告' },
						],
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
			option: {
				tooltip: {
					trigger: 'item',
				},
				legend: {
					top: '5%',
					left: 'center',
				},
				series: [
					{
						name: '访问来源',
						type: 'pie',
						radius: ['20%', '50%'],
						avoidLabelOverlap: false,
						itemStyle: {
							borderColor: '#fff',
							borderWidth: 2,
						},
						label: {
							show: false,
							position: 'center',
						},

						labelLine: {
							show: false,
						},
						data: [
							{ value: 1048, name: '搜索引擎' },
							{ value: 735, name: '直接访问' },
							{ value: 580, name: '邮件营销' },
							{ value: 484, name: '联盟广告' },
							{ value: 300, name: '视频广告' },
						],
					},
				],
			},
		};
	},
	methods: {
		// 平台
		getFunnel() {
			const myEcharts = this.$echarts.init(this.$refs.funnel);

			myEcharts.setOption(this.funnelConfig);
		},
		// 公司 / 门店
		getCompany() {
			this.$echarts.init(this.$refs.company).setOption(this.companyOption);

			this.$echarts.init(this.$refs.store).setOption(this.companyOption);

			this.$echarts.init(this.$refs.send).setOption(this.pieOption);
			this.$echarts.init(this.$refs.order).setOption(this.option);

			this.$echarts.init(this.$refs.pay).setOption(this.pieOption);

			this.$echarts.init(this.$refs.platform).setOption(this.companyOption);

			this.$echarts.init(this.$refs.route).setOption(this.companyOption);
		},
	},
	mounted() {
		this.getFunnel();
		this.getCompany();
	},
};
</script>

<style lang="scss" scoped>
.width50 {
	width: 49%;
}
.flex {
	flex: 1;
}
.box-card {
	width: 19%;
	.card-content {
		flex-direction: column;
		padding: 24px;
		.num {
			font-weight: bold;
			font-size: 40px;
		}
	}
}
.echearts {
	width: 100%;
	height: 480px;
	margin: 20px;
}
.funnel-data {
	flex: 1;
	.row {
		padding: 40px;
		.box {
			width: 25%;
			.word {
				margin-bottom: 10px;
			}
			.num {
				font-weight: bold;
			}
		}
	}
	.bgGreen {
		background-color: #eaf5ee;
	}
	.bgYellow {
		background-color: #fefaeb;
	}
	.bgViolet {
		background-color: #e3e5ee;
	}
}
</style>