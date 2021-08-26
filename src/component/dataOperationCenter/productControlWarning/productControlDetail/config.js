export const BUY_WARNING_COLUMNS = [
  { prop: 'storeCode', label: '报单服务中心', align: 'center' },
	{ prop: 'companyCode', label: '报单分公司', align: 'center' },
	{ prop: 'totalQuantity', label: '购买数量合计', align: 'center' },
	{ prop: 'percentQuantity', label: '购买数量占比', align: 'center', width: 150  },
	{ prop: 'totalPv', label: '购买积分合计', align: 'center' },
	{ prop: 'percentPv', label: '购买积分占比', align: 'center' },
	{ prop: 'percentWarning', label: '超出预警数量比例', align: 'center' }
]

export const 	CONTROL_DETAIL_TABS_LIST = [
	{ label: '按购货人统计', name: 'buy' },
	{ label: '按产品统计', name: 'product' },
]

export const CONTROL_BUY_TABS_LIST = [
	{ label: '代购/自提明细', name: 'buy' },
	{ label: '自购/公司交付明细', name: 'pay' },
]

export const CONTROL_DETAIL_COLUMNS = {
	'buy': [
		{ prop: 'customerCard', label: '购货人卡号', align: 'center' },
		{ prop: 'customerName', label: '购货人姓名', align: 'center' },
		{ prop: 'openCardTime', label: '办卡时间', align: 'center', width: 150 },
		{ prop: 'totalQuantity', label: '报单数量合计', align: 'center'  },
		{ prop: 'totalPv', label: '报单积分合计', align: 'center' },
		{ prop: 'customerAllPv', label: '购买人当月个人积分', align: 'center', width: 150 },
		{ prop: 'percentQuantity', label: '报单数量占比', align: 'center' },
		{ prop: 'percentWarning', label: '超出预警数量比例', align: 'center', width: 150 },
	],
	'product': [
		{ prop: 'serialNo', label: '产品编号', align: 'center' },
		{ prop: 'title', label: '产品名称', align: 'center' },
		{ prop: 'productPv', label: '产品PV', align: 'center' },
		{ prop: 'totalQuantity', label: '报单数量合计', align: 'center' },
		{ prop: 'totalPv', label: '报单积分合计', align: 'center' },
		{ prop: 'percentQuantity', label: '报单数量占比', align: 'center' },
		{ prop: 'percentWarning', label: '超出预警数量比例', align: 'center' }
	]
}

export const CONTROL_BUY_COLUMNS = {
	'buy': [
		{ prop: 'storeCode', label: '报单服务中心', align: 'center' },
		{ prop: 'companyCode', label: '报单分公司', align: 'center' },
		{ prop: 'totalQuantity', label: '购买数量合计', align: 'center', width: 150 },
		{ prop: 'percentQuantity', label: '购买数量占比', align: 'center'  },
		{ prop: 'totalPv', label: '购买积分合计', align: 'center' },
		{ prop: 'percentPv', label: '购买积分占比', align: 'center', width: 150 },
		{ prop: 'percentWarning', label: '超出预警数量比例', align: 'center', width: 150 },
	],
	'pay': [
		{ prop: 'companyCode', label: '报单分公司', align: 'center' },
		{ prop: 'totalQuantity', label: '购买数量合计', align: 'center', width: 150 },
		{ prop: 'percentQuantity', label: '购买数量占比', align: 'center'  },
		{ prop: 'totalPv', label: '购买积分合计', align: 'center' },
		{ prop: 'percentPv', label: '购买积分占比', align: 'center', width: 150 },
		{ prop: 'percentWarning', label: '超出预警数量比例', align: 'center', width: 150 },
	]
}

export function TABITEM() {
  this.loading = false;
  this.data = []; 
  this.tabTotal = 0;
  this.pagination = {
      currentPage: 1,
      pageSize: 10,
  }
}