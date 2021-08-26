<template>
	<div>
		<el-card>
			<div slot="header" class="title">预警清单明细</div>
			<el-row type="flex" class="flexWarp">
				<el-col :span="24">
					<div>预警项目名称：{{ info.warningName }}</div>
				</el-col>
				<el-col :span="6">
					<div>预警粒度：{{ info.warningGranularity }}</div>
				</el-col>
				<el-col :span="6">
					<div>预警类型：{{ info.warningType }}</div>
				</el-col>
				<el-col :span="6">
					<div>交付方式：{{ info.deliverType }}</div>
				</el-col>
				<el-col :span="6">
					<div>预警产品：{{ info.productCode }}</div>
				</el-col>
				<el-col :span="6" v-if="info.productCode != '所有产品'">
					<div>产品PV：{{ info.productPv }}</div>
				</el-col>
				<el-col :span="6">
					<div>{{ info.isBuyWarning ? '购货' : '交付' }}预警：{{ info.warningRuleWord }}</div>
				</el-col>
			</el-row>
		</el-card>

		<el-card>
			<div slot="header" class="title">报单月份筛选</div>
			<el-date-picker
				:editable="false"
				v-model="orderDate"
				value-format="timestamp"
				type="month"
				:clearable="false"
				:picker-options="pickerOptions"
				placeholder="---年--月"
			></el-date-picker>
			<el-button class="marginL20" type="primary" @click="search">搜索</el-button>
		</el-card>

		<el-card>
			<div slot="header" class="title">{{ info.isBuyWarning ? '会员信息' : '服务中心信息' }}</div>
			<div v-if="info.isBuyWarning">
				<el-row type="flex">
					<el-col :span="6">
						<div>会员卡号：{{ info.customerCard }}</div>
					</el-col>
					<el-col :span="6">
						<div>会员名称：{{ info.customerName }}</div>
					</el-col>
					<el-col :span="6">
						<div>办卡时间：{{ info.openCardTime }}</div>
					</el-col>
				</el-row>
			</div>
			<div v-else>
				<el-row type="flex">
					<el-col :span="6">
						<div>服务中心号：{{ serverInfo.storeCode }}</div>
					</el-col>
					<el-col :span="7">
						<div>服务中心名称：{{ serverInfo.storeName }}</div>
					</el-col>
					<el-col :span="5">
						<div>报单总数量：{{ serverInfo.totalQuantity }}</div>
					</el-col>
					<el-col :span="4">
						<div>业绩总PV：{{ serverInfo.totalPv }}</div>
					</el-col>
				</el-row>
				<el-row type="flex" class="marginT20">
					<el-col :span="6">
						<div>积分占比：{{ serverInfo.percentPv }}</div>
					</el-col>
					<el-col :span="6">
						<div>超出预警值比例：{{ serverInfo.percentWarning }}</div>
					</el-col>
				</el-row>
			</div>
		</el-card>

		<el-card>
			<div slot="header" class="title">预警明细</div>
			<el-tabs v-model="activeTab">
				<el-tab-pane v-for="({ name, label }, index) in dataList" :key="index" :label="label" :name="name">
					<tableList
						:dataSource="tabPanes[activeTab].data"
						:columns="columns[activeTab]"
						:pagination="tabPanes[activeTab].pagination"
						:dataTotal="tabPanes[activeTab].total"
						:loading="tabPanes[activeTab].loading"
						@handleSizeChange="handleSizeChange"
						@handleChangePage="handleChangePage"
					/>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import {
	TABITEM,
	CONTROL_DETAIL_TABS_LIST,
	CONTROL_BUY_TABS_LIST,
	CONTROL_DETAIL_COLUMNS,
	CONTROL_BUY_COLUMNS,
} from './config.js';
const tabPanes = Object.create(null);
CONTROL_BUY_TABS_LIST.map(({ name }) => (tabPanes[name] = new TABITEM()));
CONTROL_DETAIL_TABS_LIST.map(({ name }) => (tabPanes[name] = new TABITEM()));
export default {
	name: 'warningDetailedList',
	data() {
		return {
			info: {},
			tableData: [],
			orderDate: null,
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
			},
			serverInfo: {},
			tabPanes,
			activeTab: 'buy',
		};
	},
	watch: {
		activeTab() {
			this.search();
		},
	},
	computed: {
		dataList: ({ info: { isBuyWarning, productCode } }) =>
			isBuyWarning
				? CONTROL_BUY_TABS_LIST
				: productCode == '所有产品'
				? CONTROL_DETAIL_TABS_LIST
				: [CONTROL_DETAIL_TABS_LIST[0]],
		columns: ({ info: { isBuyWarning, warningType } }) => {
			const colums = isBuyWarning ? CONTROL_BUY_COLUMNS : CONTROL_DETAIL_COLUMNS;
			for (const key in colums) {
				colums[key][colums[key].length - 1].label = warningType == '销售数量' ? '超出预警数量比例' : '超出预警PV比例';
			}
			return colums;
		},
	},
	methods: {
		// 搜索
		search() {
			this.tabPanes[this.activeTab].pagination.currentPage = 1;
			this.tabPanes[this.activeTab].data = [];
			if (this.info.isBuyWarning) {
				this.getBuyWarning();
			} else {
				this.getServiceCenterDetail();
				this.getPayWarning();
			}
		},
		// 分页触发事件
		handleChangePage(currentPage) {
			this.tabPanes[this.activeTab].pagination.currentPage = currentPage;
			if (this.info.isBuyWarning) {
				this.getBuyWarning();
			} else {
				this.getPayWarning();
			}
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.tabPanes[this.activeTab].pagination = {
				pageSize,
				currentPage: 1,
			};
			if (this.info.isBuyWarning) {
				this.getBuyWarning();
			} else {
				this.getPayWarning();
			}
		},
		// 获取购货预警明细列表
		async getBuyWarning() {
			const {
				orderDate,
				activeTab,
				info: { ruleId, customerCard, productCode },
			} = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabPanes[activeTab];
			const params = {
				orderDate,
				ruleId,
				cardNo: customerCard,
				productNo: productCode === '所有产品' ? '' : productCode,
				dimension: activeTab == 'buy' ? '1' : '2',
				pageNum,
				pageSize,
			};
			this.tabPanes[activeTab].loading = true;
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/dataAdmin/warningDetail/shop/page`,
				timeout: 60000 * 1,
				params,
				callback: () => {
					this.tabPanes[activeTab].loading = false;
				},
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.tabPanes[activeTab].data = list;
				this.tabPanes[activeTab].total = total;
			} else {
				this.tabPanes[activeTab].data = [];
				this.tabPanes[activeTab].total = 0;
			}
		},
		// 获取交付预警列表
		async getPayWarning() {
			const {
				activeTab,
				orderDate,
				info: { ruleId, centerCode, customerCard, productCode },
			} = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabPanes[activeTab];
			const params = {
				orderDate,
				ruleId,
				cardNo: customerCard,
				storeCode: centerCode,
				productNo: productCode === '所有产品' ? '' : productCode,
				dimension: activeTab == 'buy' ? '1' : '2',
				pageNum,
				pageSize,
			};

			this.tabPanes[activeTab].loading = true;

			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/dataAdmin/warningDetail/deliver/page',
				params,
				callback: () => {
					this.tabPanes[activeTab].loading = false;
				},
			});

			if (res?.code == 200) {
				const { list, total } = res.data;
				if (list && list.length) {
					this.tabPanes[activeTab].data = list;
					this.tabPanes[activeTab].total = total;
				} else {
					this.tabPanes[activeTab].data = [];
					this.tabPanes[activeTab].total = 0;
				}
			}
		},
		// 获取服务中心信息
		async getServiceCenterDetail() {
			const {
				orderDate,
				info: { ruleId, centerCode, productCode },
			} = this;
			const params = {
				orderDate,
				ruleId,
				storeCode: centerCode,
				productNo: productCode === '所有产品' ? '' : productCode,
			};
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/dataAdmin/warningDetail/getDeliverStoreProductSummary`,
				timeout: 60000 * 1,
				params,
			});
			if (res?.code == 200) {
				this.serverInfo = res.data;
			}
		},
	},
	created() {
		const { query } = this.$route;
		this.info = { ...query, isBuyWarning: Boolean(Number(query.isBuyWarning)) };
		this.orderDate = new Date(this.info.placeMonthStr).getTime();
		this.search();
	},
};
</script>

<style lang="scss" scoped>
.title {
	font-weight: bold;
	font-size: 16px;
}
.marginT20 {
	margin-top: 20px;
}
.marginL20 {
	margin-left: 20px;
}
.flexWarp {
	flex-wrap: wrap;
	div {
		margin-bottom: 5px;
	}
}
</style>
