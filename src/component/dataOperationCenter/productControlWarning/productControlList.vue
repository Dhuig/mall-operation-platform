<template>
	<div class="productControlList">
		<guideBar>
			<el-button
				:loading="exportLoading"
				v-permission="'product_control_add_export'"
				type="primary"
				@click="exportExcel"
			>
				导出
			</el-button>
			<el-button v-permission="'product_control_add_rule'" type="primary" @click="addProductRule">
				新建产品预警规则
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="WARNING_RULE_SERARCH_CONFIG" @search="search" />
		</el-card>
		<el-card>
			<tableList
				border
				:dataSource="tabPanes.data"
				:columns="PRODUCT_CONTROL_COLUMS"
				:pagination="tabPanes.pagination"
				:dataTotal="tabPanes.dataTotal"
				@handleSizeChange="handleSizeChange"
				@handleChangePage="handleChangePage"
				slotcontent
			>
				<template
					v-slot:warningRule="{
						row: { isShopWarning, warningType, shopWarningNumber, isDeliverWarning, deliverWarningNumber },
					}"
				>
					<div v-if="Number(isShopWarning)">
						购货预警: {{ shopWarningNumber }} {{ Number(warningType) ? 'PV' : '数量' }} /月/购货人
					</div>
					<div v-if="Number(isDeliverWarning)">
						交付预警: {{ deliverWarningNumber }} {{ Number(warningType) ? 'PV' : '数量' }} /月/门店
					</div>
				</template>
				<template v-slot:warningStatistic="{ row: { warningStatistic } }">
					<div v-if="warningStatistic.length">
						<div v-for="(item, index) in warningStatistic" :key="index">
							{{ Number(item.warningDimension) ? '交付' : '购货' }}预警：{{ item.number }}
						</div>
					</div>
				</template>
				<template slot-scope="row">
					<el-button v-permission="'product_control_detail'" type="text" @click="look(row.data)">查看</el-button>
					<el-button
						v-permission="'product_control_delete'"
						v-if="Number(row.data.state)"
						type="text"
						@click="deleteData(row.data)"
					>
						删除
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { WARNING_RULE_SERARCH_CONFIG, PRODUCT_CONTROL_COLUMS } from './config';
export default {
	name: 'productControlList',
	data() {
		return {
			WARNING_RULE_SERARCH_CONFIG,
			PRODUCT_CONTROL_COLUMS,
			tabPanes: {
				loading: false,
				data: [],
				dataTotal: 0,
				pagination: {
					pageSize: 10,
					currentPage: 1,
				},
			},
			searchConfig: {
				warningName: '',
				warningType: '',
				productCode: '',
				placeMonthStr: '',
				deliverType: '',
				warningDimension: '',
			},
			exportLoading: false,
		};
	},
	computed: {},
	methods: {
		// 预警规则
		returnWarningRule({ warningType }) {
			const company = !warningType ? '数量' : 'PV';
			return company;
		},
		// 跳转新增
		addProductRule() {
			this.$go('product_control_add_rule');
		},
		// 导出
		async exportExcel() {
			this.exportLoading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/dataAdmin/export/warningRule',
				data: this.searchConfig,
				callback: () => {
					this.exportLoading = false;
				},
			});
			if (res?.code == 200) {
				this.$message.success('excel表格正在生成中，请在下载管理查看');
			} else {
				this.$message.error('操作失败');
			}
		},
		// 搜索
		search() {
			this.tabPanes.data = [];
			this.tabPanes.pagination.currentPage = 1;
			this.loadData();
		},
		// 分页触发事件
		handleChangePage(currentPage) {
			this.tabPanes.pagination.currentPage = currentPage;
			this.loadData();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.tabPanes.pagination.pageSize = pageSize;
			this.tabPanes.pagination.currentPage = 1;
			this.loadData();
		},
		// 获取数据
		async loadData() {
			const { pageSize, currentPage: pageNum } = this.tabPanes.pagination;
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/dataAdmin/warningRule/list',
				params: { ...this.searchConfig, pageNum, pageSize },
			});
			this.tabPanes.loading = true;
			if (res && res.data) {
				const { list, total } = res.data;
				this.tabPanes.data = list ?? [];
				this.tabPanes.dataTotal = total;
			}
			this.tabPanes.loading = false;
		},
		// 停止
		deleteData({ ruleId }) {
			this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/dataAdmin/warningRule/disable',
					data: { ruleId },
				});
				if (res?.code == 200) {
					this.$message.success(res.message);
					this.loadData();
				}
			});
		},
		// 查看
		look({
			ruleId,
			warningName,
			warningGranularity,
			warningType,
			productCode,
			deliverType,
			shopWarningNumber,
			deliverWarningNumber,
		}) {
			this.$go('product_control_detail', {
				ruleId,
				warningName,
				warningGranularity,
				warningType,
				productCode: productCode ? productCode : '所有产品',
				deliverType,
				shopWarningNumber,
				deliverWarningNumber,
			});
		},
	},
	created() {
		this.$listen('PRODUCT_CONTROLLIST_LIST', this.loadData);
	},
	mounted() {
		this.loadData();
	},
};
</script>
