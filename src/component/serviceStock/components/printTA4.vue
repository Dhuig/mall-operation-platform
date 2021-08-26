<template>
	<div class="print-dialog">
		<PrintA4 :title="title" :tableData="getTableData" :tableHead="tableHead" :headerHeight="12" :signHeight="50">
			<template slot="header">
				<div class="order-header-bar">
					<div class="item">
						<div class="label">店号：</div>
						<div class="value">
							<span>{{ userMessage['storeCode'] }}</span>
							<span>{{ userMessage['storeName'] }}</span>
						</div>
					</div>
					<div class="item">
						<div class="label">对账期间：</div>
						<div class="value">{{ userMessage['month'] }}</div>
					</div>
					<div class="item">
						<div class="label">打印日期：</div>
						<div class="value">{{ userMessage['nowTime'] }}</div>
					</div>
				</div>
			</template>
			<template slot="sign">
				<div class="order-remark">
					<div class="remark-info">
						<div>对账单说明：</div>
						<div>
							1、本表为各服务中心与完美（中国）有限公司及所属分公司（以下简称完美公司）间的押货、发货之债权债务往来对账确认之依据；
						</div>
						<div>
							<div>2、其他需说明的事项：</div>
							<div>（1）此表不反映辅销资料的订销存；</div>
							<div>
								（2）为保障你的利益，请及时检查本账单是否准确无误，如贵店于对账月份后15天内未对对账单内容提出书面异议，以上均视为正确无误。
							</div>
						</div>
					</div>
					<div class="sign-info">
						<div class="sign-item">对账联系人：客户服务室区域专员</div>
						<div class="sign-item">
							<div>
								<span class="label">服务中心确认盖章：</span>
								<span class="value"></span>
							</div>
							<div>
								<span class="label">日期：</span>
								<span class="value"></span>
							</div>
						</div>
					</div>
				</div>
			</template>
		</PrintA4>
	</div>
</template>
<script>
import PrintA4 from 'component/common/printA4';
// import PrintA4 from './printA4';
export default {
	name: 'printTA4',
	components: {
		PrintA4,
	},
	props: {
		title: String,
		userMessage: {
			type: Object,
		},
		tableData: {
			default: () => {
				return [];
			},
			type: Array,
		},
	},
	created() {},
	data() {
		return {
			options: {
				index: 1,
				labelIndex: '序号',
			},
			tableHead: [
				{
					label: '产品编码',
					key: 'productCode',
					width: '20mm',
				},
				{
					label: '产品名称',
					key: 'productName',
				},
				{
					label: '上期结存',
					key: 'priorBalance',
					width: '18mm',
				},
				{
					label: '押货数量',
					key: 'mortgageNum',
					width: '18mm',
				},
				{
					label: '押货退回',
					key: 'mortgageReturn',
					width: '18mm',
				},
				{
					label: '交付数量',
					key: 'orderNum',
					width: '18mm',
				},
				{
					label: '交付退回',
					key: 'orderReturn',
					width: '18mm',
				},
				{
					label: '本期结存',
					key: 'productNum',
					width: '18mm',
				},
			],
		};
	},
	computed: {
		getTableData() {
			return this.tableData.map((item, index) => {
				return {
					index: index + 1,
					...item,
					//押货数量转化
					mortgageNum: Math.abs(item.mortgageNum),
					//押货退回转化
					mortgageReturn: Math.abs(item.mortgageReturn),
					//交付数量转化
					orderNum: Math.abs(item.adjustNum + item.orderNum),
					//交付退回转化
					orderReturn: Math.abs(item.orderReturn),
				};
			});
		},
	},
	// methods: {
	// 	getUserMessage(index, title) {
	// 		const msgIndex = this.userMessage[index];
	// 		if (msgIndex) {
	// 			const msg = msgIndex.find(item => item.title === title);
	// 			return msg ? msg.value : '';
	// 		} else {
	// 			return '';
	// 		}
	// 	},
	// },
};
</script>
<style lang="scss">
// @import './stockPrintA4.css';
</style>
