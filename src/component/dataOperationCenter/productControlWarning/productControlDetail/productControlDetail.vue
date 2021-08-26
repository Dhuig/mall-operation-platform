<template>
	<div>
		<el-card>
			<div slot="header" class="title">产品预警详情</div>
			<el-row type="flex" :gutter="24" class="flexWarp">
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
			</el-row>
		</el-card>
		<el-card>
			<div slot="header" class="title">报单月份筛选</div>
			<el-date-picker
				:editable="false"
				v-model="placeMonthStr"
				value-format="yyyy-MM"
				type="month"
				:clearable="false"
				:picker-options="pickerOptions"
				placeholder="---年--月"
			></el-date-picker>
			<el-button class="marginL20" type="primary" @click="search">搜索</el-button>
		</el-card>

		<el-card>
			<div slot="header" class="title">产品预警规则</div>
			<el-table :data="tableData" border style="width: 50%">
				<el-table-column prop="warningDimension" label="预警维度"></el-table-column>
				<el-table-column prop="warningRuleWord" label="预警规则"></el-table-column>
				<el-table-column prop="number" label="预警数"></el-table-column>
			</el-table>
		</el-card>

		<el-card v-if="tableData.length">
			<div slot="header">
				<el-row type="flex" align="middle">
					<el-col>
						<div class="title">预警明细</div>
					</el-col>
					<el-button
						v-permission="'product_control_detail_export'"
						type="primary"
						:loading="exportLoading"
						@click="exportExcel"
					>
						导出
					</el-button>
					<el-button
						type="primary"
						v-permission="'product_control_detail_import_buy'"
						v-if="tableData.length == 2 || (tableData.length == 1 && tableData[0].type == '0')"
						class="marginL20"
						@click="openDialog('buy')"
					>
						导入重点购货预警名单
					</el-button>
					<el-button
						v-permission="'product_control_detail_import_pay'"
						v-if="tableData.length == 2 || (tableData.length == 1 && tableData[0].type == '1')"
						type="primary"
						class="marginL20"
						@click="openDialog('pay')"
					>
						导入重点交付预警名单
					</el-button>
				</el-row>
			</div>

			<Tabel ref="tabel" :tableData="tableData" :ruleId="info.ruleId" :info="info" :placeMonthStr="placeMonthStr" />
			<Dialog :ruleId="info.ruleId" :dialogForm="dialogForm" @updataList="search" @changeDialog="closeDialog" />
		</el-card>
		<el-card v-else>
			<div slot="header">
				<div class="title">预警明细</div>
			</div>
			<el-empty :image-size="200"></el-empty>
		</el-card>
	</div>
</template>

<script>
import { WARNING_GRANULARITY, WARNING_TYPE, DRLIVER_TYPE, WARNING_DIMENSION_WORD } from '../config.js';
import { formatDate } from 'util/formValidation.js';
import Tabel from './modal/tabel.vue';
import Dialog from './modal/importDialog.vue';
const EXPORT_API = {
	buyWarning: '/mgmt/dataAdmin/export/shopWarningDetail',
	payWarning: '/mgmt/dataAdmin/export/deliverWarningDetail',
	importantBuyWarning: '/mgmt/dataAdmin/export/key/shopWarningDetail', // 重点购货预警
	importantPayWarning: '/mgmt/dataAdmin/export/key/deliverWarningDetail', // 重点交付预警
};
// 0 购货 1 交付
const RULEAFTERWORD = ['/月/购货人', '/月/门店'];

export default {
	name: 'productControlDetail',
	components: { Tabel, Dialog },
	data() {
		return {
			placeMonthStr: formatDate(new Date(), 'month'),
			tableData: [],
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
			},
			exportLoading: false,
			dialogForm: {
				title: '',
				show: false,
				type: '',
			},
		};
	},
	computed: {
		info: ({ $route: { query } }) => {
			return {
				...query,
				warningGranularity: WARNING_GRANULARITY[query.warningGranularity],
				warningType: WARNING_TYPE?.find(({ value }) => value == query.warningType)?.label,
				deliverType: DRLIVER_TYPE?.find(({ value }) => value == query.deliverType)?.label,
				warningNumberArray: [query.shopWarningNumber, query.deliverWarningNumber],
			};
		},
		// needData: ({ tableData, info: { ruleId } }) => ({ tableData, ruleId }),
	},
	methods: {
		// 导出
		async exportExcel() {
			const { activeTab, searchFields } = this.$refs.tabel;

			this.exportLoading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: EXPORT_API[activeTab],
				data: searchFields,
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
		// 关闭导入弹出框
		closeDialog() {
			this.dialogForm.show = false;
		},
		// 打开导入弹出框
		openDialog(type) {
			this.dialogForm = {
				title: type == 'buy' ? '导入重点购货预警名单' : '导入重点交付预警名单',
				show: true,
				type,
			};
		},

		search() {
			this.getWarningResule();
		},
		async getWarningResule() {
			const {
				info: { ruleId },
				placeMonthStr,
			} = this;
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/dataAdmin/warningStatistic/list`,
				params: { ruleId, statisticMonthStr: placeMonthStr },
			});
			if (res?.code == 200 && res?.data.length) {
				const {
					info: { warningNumberArray },
				} = this;
				this.tableData = res.data.map(({ warningDimension, warningType, number, statisticId }) => ({
					warningDimension: WARNING_DIMENSION_WORD[warningDimension],
					warningRuleWord: `${warningNumberArray[warningDimension]} ${Number(warningType) ? 'PV' : '数量'}${
						RULEAFTERWORD[warningDimension]
					}`,
					type: warningDimension,
					status: warningDimension == '0' ? 'buyWarning' : 'payWarning',
					number,
					statisticId,
				}));
			} else {
				this.tableData = [];
			}
		},
	},
	created() {
		this.getWarningResule();
	},
};
</script>
<style lang="scss" scoped>
.title {
	font-weight: bold;
	font-size: 16px;
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