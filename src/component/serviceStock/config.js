import { optionGenerator } from 'util';
import { filters } from 'plugins/filters';
// import { formatDate } from 'util/formValidation.js';
export const OPERATOR = {
	'0': '=',
	'1': '>=',
	'2': '>',
	'3': '<=',
	'4': '<',
};

export const WAREHOUSING = [
	{
		value: null,
		label: '全部'
	},
	{
		value: 1,
		label: '入库'
	},
	{
		value: 2,
		label: '出库'
	}
]

export const SPLITTYPE = {
	'1': '未拆分',
	'2': '已拆分'
}

export const PRODUCTTYPE = {
	'8': '已下架',
	'7': '已上架'
}

export const OUTINTYPE = {
	'1': '入库',
	'2': '出库'
}

export const STATUSTYPE = {
	'1': '未过期',
	'2': '已过期',
}

export const TYPELIST = [
	{
		value: 1,
		label: '押货'
	},
	{
		value: 2,
		label: '押货退货'
	},
	{
		value: 3,
		label: '商城订单'
	},
	{
		value: 4,
		label: '顾客退货'
	},
	{
		value: 5,
		label: '库存调整'
	},
	// {
	// 	value:6,
	// 	label:'补单'
	// },
	{
		value: 7,
		label: '结存'
	}
]

export const OPEARTTYPE = {
	'1': '开启',
	'2': '关闭',
};

export const COMBINETYPE = {
	'1': '未组合',
	'2': '已组合',
}

export const SOURRSELIST = {
	'1': '押货',
	'2': '押货退货',
	'3': '商城订单',
	'4': '顾客退货',
	'5': '库存调整',
	'6': '商城订单'
}

export const REPERTORY_NARNAL_TABS = [
	['产品', 'product'],
	['服务中心', 'service'],
]

const summary = true

export function TABITEM() {
	this.loading = false;
	this.data = [];
	this.total = 0;
	this.pagination = {
		pageNum: 1,
		pageSize: 10,
	},
		this.searchConfig = { // 搜索条件
			companyCode: null,
			productCode: null,
			stock: null,
			month: '',
			stockOperator: null,
			storeCode: null,
		},
		this.summation = {} // 底部合计
}

// 库存查询-产品
export const REPERTORY_NARNAL_PRODUCT_SEARCH = {
	form: [
		{
			label: '分公司编号',
			key: 'companyCode',
			type: 'select',
			value: '',
			options: [],
			placeholder: '请选择分公司编号',
		},
		{
			label: '服务中心编号',
			key: 'storeCode',
			type: 'input',
			value: '',
			placeholder: '请输入服务中心编号',
		},
		{
			label: '产品编号',
			key: 'productCode',
			type: 'input',
			value: '',
			placeholder: '请输入产品编号',
		},
		{
			label: '当前库存',
			type: 'dual',
			key1: 'stockOperator',
			key2: 'stock',
			placeholder1: '请选择',
			placeholder2: '请输入',
			key1options: optionGenerator(OPERATOR),
		},
	],
}

// 库存查询 - 服务中心
export const REPERTORY_NARNAL_SERVICE_SEARCH = {
	form: [
		{
			label: '分公司编号',
			key: 'companyCode',
			type: 'select',
			value: '',
			options: [],
			placeholder: '请选择分公司编号',
		},
		{
			label: '服务中心编号',
			key: 'storeCode',
			type: 'input',
			value: '',
			placeholder: '请输入服务中心编号',
		},
		{
			label: '店零售价合计',
			type: 'dual',
			key1: 'stockOperator',
			key2: 'stock',
			placeholder1: '请选择',
			placeholder2: '请输入',
			key1options: optionGenerator(OPERATOR),
		},
	],
}

// 库存查询-产品列表
export const REPERTORY_MONTH_PRODUCT_COLUMNS = [
	{
		label: '分公司编号',
		align: 'center',
		prop: 'companyCode',
		width: 100,
		headerConfig: { topTips: '1' },
	},
	{
		prop: 'storeCode',
		label: '服务中心编号',
		align: 'center',
		width: 100,
		headerConfig: { topTips: '2' },
	},
	{
		label: '产品编号',
		align: 'center',
		width: 100,
		fixed: 'left',
		prop: 'productCode',
		headerConfig: { topTips: '3' },
	},
	{
		label: '产品名称',
		align: 'center',
		width: 200,
		fixed: 'left',
		prop: 'productName',
		headerConfig: { topTips: '4' },
	},
	{
		label: '单位',
		align: 'center',
		width: 100,
		prop: 'meterUnit',
		headerConfig: { topTips: '5' },
	},
	{
		label: '上期结存',
		align: 'center',
		width: 100,
		prop: 'priorBalance',
		summary,
		formatter: ({ priorBalance }) => {
			if (!priorBalance) return 0;
			return priorBalance;
		},
		headerConfig: { topTips: '6' },
	},
	{
		label: '押货数量',
		align: 'center',
		width: 100,
		prop: 'mortgageNum',
		summary,
		formatter: ({ mortgageNum }) => {
			if (!mortgageNum) return 0;
			return mortgageNum;
		},
		headerConfig: { topTips: '7' },
	},
	{
		label: '押货退回',
		align: 'center',
		width: 100,
		prop: 'mortgageReturn',
		summary,
		formatter: ({ mortgageReturn }) => {
			if (!mortgageReturn) return 0;
			return mortgageReturn;
		},
		headerConfig: { topTips: '8' },
	},
	{
		label: '配送数量',
		align: 'center',
		width: 100,
		prop: 'orderNum',
		summary,
		formatter: ({ orderNum }) => {
			if (!orderNum) return 0;
			return orderNum;
		},
		headerConfig: { topTips: '9' },
	},
	{
		label: '配送退回',
		align: 'center',
		width: 100,
		prop: 'orderReturn',
		summary,
		formatter: ({ orderReturn }) => {
			if (!orderReturn) return 0;
			return orderReturn;
		},
		headerConfig: { topTips: '10' },
	},
	{
		label: '库存调整',
		align: 'center',
		width: 100,
		prop: 'adjustNum',
		summary,
		formatter: ({ adjustNum }) => {
			if (!adjustNum) return 0;
			return adjustNum;
		},
		headerConfig: { topTips: '11' },
	},
	{
		label: '当前库存',
		align: 'center',
		width: 150,
		prop: 'productNum',
		summary,
		formatter: ({ productNum }) => {
			if (!productNum) return 0;
			return productNum;
		},
		headerConfig: { topTips: '12=6+7-8-9+10+11' },
	},
	{
		label: 'PV合计',
		align: 'center',
		width: 150,
		prop: 'pv',
		summary,
		formatter: ({ pv }) => {
			if (!pv) return 0;
			return pv;
		},
		headerConfig: { topTips: '13=12*当前PV' },
	},
	{
		label: '押货价合计',
		align: 'center',
		width: 150,
		prop: 'securityPrice',
		summary,
		filter: '￥ ',
		formatter: ({ securityPrice }) => {
			if (!securityPrice) return 0;
			return '￥ ' + securityPrice;
		},
		headerConfig: { topTips: '14=12*当前押货价' },
	},
	{
		label: '零售价合计',
		align: 'center',
		width: 150,
		prop: 'retailPrice',
		summary,
		filter: '￥ ',
		formatter: ({ retailPrice }) => {
			if (!retailPrice) return 0;
			return '￥ ' + retailPrice;
		},
		headerConfig: { topTips: '15=12*当前零售价' },
	},
];

// 库存查询-服务中心列表
export const REPERTORY_MONTH_SERVICE_COLUMNS = [
	{
		label: '分公司编号',
		align: 'center',
		width: 100,
		prop: 'companyCode'
	},
	{
		prop: 'storeCode',
		label: '服务中心编号',
		width: 100,
		align: 'center'
	},
	{
		label: '上期库存结存零售金额',
		align: 'center',
		prop: 'priorRetail',
		summary,
		filter: '￥ ',
		formatter: ({ priorRetail }) => {
			if (!priorRetail) return 0;
			return '￥ ' +  priorRetail;
		}
	},
	{
		label: '本期增加库存零售金额',
		align: 'center',
		prop: 'increaseRetail',
		summary,
		filter: '￥ ',
		formatter: ({ increaseRetail }) => {
			if (!increaseRetail) return 0;
			return '￥ ' + increaseRetail;
		}
	},
	{
		label: '本期减少库存零售金额',
		align: 'center',
		prop: 'decreaseRetail',
		summary,
		filter: '￥ ',
		formatter: ({ decreaseRetail }) => {
			if (!decreaseRetail) return 0;
			return '￥ ' + decreaseRetail;
		}
	},
	{
		label: '本期结余库存零售金额',
		align: 'center',
		prop: 'totalRetail',
		summary,
		filter: '￥ ',
		formatter: ({ totalRetail }) => {
			if (!totalRetail) return 0;
			return '￥ ' + totalRetail;
		}
	},
	{
		label: '当前结余库存PV合计',
		align: 'center',
		prop: 'totalPv',
		summary,
		formatter: ({ totalPv }) => {
			if (!totalPv) return 0;
			return totalPv;
		}
	},
	{
		label: '当前结余库存押货价合计',
		align: 'center',
		prop: 'totalSecurity',
		summary,
		filter: '￥ ',
		formatter: ({ totalSecurity }) => {
			if (!totalSecurity) return 0;
			return '￥ ' + totalSecurity;
		}
	}
];

// 库存历史月份查询-产品
export const REPERTORY_NARNAL_HISTORY_PRODUCT_SEARCH = {
	form: [
		{
			label: '分公司编号',
			key: 'companyCode',
			type: 'select',
			value: '',
			options: [],
			placeholder: '请选择分公司编号',
		},
		{
			label: '服务中心编号',
			key: 'storeCode',
			type: 'input',
			value: '',
			placeholder: '请输入服务中心编号',
		},
		{
			label: '产品编号',
			key: 'productCode',
			type: 'input',
			value: '',
			placeholder: '请输入产品编号',
		},
		{
			label: '月份',
			key: 'month',
			type: 'datePicker',
			value: new Date(),
			config: {
				type: 'month',                  //month 月份类型
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					},
				},
				placeholder: '请选择月份'
			},
		},
		{
			label: '当前库存',
			type: 'dual',
			key1: 'stockOperator',
			key2: 'stock',
			placeholder1: '请选择',
			placeholder2: '请输入',
			key1options: optionGenerator(OPERATOR),
		},
	],
}
// 库存历史月份查询 - 服务中心
export const REPERTORY_NARNAL_HISTORY_SERVICE_SEARCH = {
	form: [
		{
			label: '分公司编号',
			key: 'companyCode',
			type: 'select',
			value: '',
			options: [],
			placeholder: '请选择分公司编号',
		},
		{
			label: '服务中心编号',
			key: 'storeCode',
			type: 'input',
			value: '',
			placeholder: '请输入服务中心编号',
		},
		{
			label: '月份',
			key: 'month',
			type: 'datePicker',
			value: new Date(),
			config: {
				type: 'month',                  //month 月份类型  
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					},
				},
				placeholder: '请选择月份'
			},
		},
		{
			label: '店零售价合计',
			type: 'dual',
			key1: 'stockOperator',
			key2: 'stock',
			placeholder1: '请选择',
			placeholder2: '请输入',
			key1options: optionGenerator(OPERATOR),
		},
	],
}
// 库存历史月份查询-产品列表
export const REPERTORY_MONTH_HISTORY_PRODUCT_COLUMNS = [
	{
		label: '分公司编号',
		align: 'center',
		prop: 'companyCode',
		width: 100,
		headerConfig: { topTips: '1' },
	},
	{
		prop: 'storeCode',
		label: '服务中心编号',
		align: 'center',
		width: 100,
		headerConfig: { topTips: '2' },
	},
	{
		label: '产品编号',
		align: 'center',
		width: 100,
		fixed: 'left',
		prop: 'productCode',
		headerConfig: { topTips: '3' },
	},
	{
		label: '产品名称',
		align: 'center',
		width: 200,
		fixed: 'left',
		prop: 'productName',
		headerConfig: { topTips: '4' },
	},
	{
		label: '单位',
		align: 'center',
		width: 100,
		prop: 'meterUnit',
		headerConfig: { topTips: '5' },
	},
	{
		label: '上期结存',
		align: 'center',
		width: 100,
		prop: 'priorBalance',
		summary,
		formatter: ({ priorBalance }) => {
			if (!priorBalance) return 0;
			return priorBalance;
		},
		headerConfig: { topTips: '6' },
	},
	{
		label: '押货数量',
		align: 'center',
		width: 100,
		prop: 'mortgageNum',
		summary,
		formatter: ({ mortgageNum }) => {
			if (!mortgageNum) return 0;
			return mortgageNum;
		},
		headerConfig: { topTips: '7' },
	},
	{
		label: '押货退回',
		align: 'center',
		width: 100,
		prop: 'mortgageReturn',
		summary,
		formatter: ({ mortgageReturn }) => {
			if (!mortgageReturn) return 0;
			return mortgageReturn;
		},
		headerConfig: { topTips: '8' },
	},
	{
		label: '配送数量',
		align: 'center',
		width: 100,
		prop: 'orderNum',
		summary,
		formatter: ({ orderNum }) => {
			if (!orderNum) return 0;
			return orderNum;
		},
		headerConfig: { topTips: '9' },
	},
	{
		label: '配送退回',
		align: 'center',
		width: 100,
		prop: 'orderReturn',
		summary,
		formatter: ({ orderReturn }) => {
			if (!orderReturn) return 0;
			return orderReturn;
		},
		headerConfig: { topTips: '10' },
	},
	{
		label: '库存调整',
		align: 'center',
		width: 100,
		prop: 'adjustNum',
		summary,
		formatter: ({ adjustNum }) => {
			if (!adjustNum) return 0;
			return adjustNum;
		},
		headerConfig: { topTips: '11' },
	},
	{
		label: '当前库存',
		align: 'center',
		width: 150,
		prop: 'productNum',
		summary,
		formatter: ({ productNum }) => {
			if (!productNum) return 0;
			return productNum;
		},
		headerConfig: { topTips: '12=6+7-8-9+10+11' },
	},
	{
		label: 'PV合计',
		align: 'center',
		width: 150,
		prop: 'pv',
		summary,
		formatter: ({ pv }) => {
			if (!pv) return 0;
			return pv;
		},
		headerConfig: { topTips: '13=12*当前PV' },
	},
	{
		label: '押货价合计',
		align: 'center',
		width: 150,
		prop: 'securityPrice',
		summary,
		filter: '￥ ',
		formatter: ({ securityPrice }) => {
			if (!securityPrice) return 0;
			return '￥ ' + securityPrice;
		},
		headerConfig: { topTips: '14=12*当前押货价' },
	},
	{
		label: '零售价合计',
		align: 'center',
		width: 150,
		prop: 'retailPrice',
		summary,
		filter: '￥ ',
		formatter: ({ retailPrice }) => {
			if (!retailPrice) return 0;
			return '￥ ' + retailPrice;
		},
		headerConfig: { topTips: '15=12*当前零售价' },
	},
];

// 库存历史月份查询-服务中心列表
export const REPERTORY_MONTH_HISTORY_SERVICE_COLUMNS = [
	{
		label: '分公司编号',
		align: 'center',
		width: 100,
		prop: 'companyCode'
	},
	{
		prop: 'storeCode',
		label: '服务中心编号',
		width: 100,
		align: 'center'
	},
	{
		label: '上期库存结存零售金额',
		align: 'center',
		prop: 'priorRetail',
		summary,
		filter: '￥ ',
		formatter: ({ priorRetail }) => {
			if (!priorRetail) return 0;
			return '￥ ' + priorRetail;
		}
	},
	{
		label: '本期增加库存零售金额',
		align: 'center',
		prop: 'increaseRetail',
		summary,
		filter: '￥ ',
		formatter: ({ increaseRetail }) => {
			if (!increaseRetail) return 0;
			return '￥ ' + increaseRetail;
		}
	},
	{
		label: '本期减少库存零售金额',
		align: 'center',
		prop: 'decreaseRetail',
		summary,
		filter: '￥ ',
		formatter: ({ decreaseRetail }) => {
			if (!decreaseRetail) return 0;
			return '￥ ' +decreaseRetail;
		}
	},
	{
		label: '本期结余库存零售金额',
		align: 'center',
		prop: 'totalRetail',
		summary,
		filter: '￥ ',
		formatter: ({ totalRetail }) => {
			if (!totalRetail) return 0;
			return '￥ ' +totalRetail;
		}
	},
	{
		label: '当前结余库存PV合计',
		align: 'center',
		prop: 'totalPv',
		summary,
		formatter: ({ totalPv }) => {
			if (!totalPv) return 0;
			return totalPv;
		}
	},
	{
		label: '当前结余库存押货价合计',
		align: 'center',
		prop: 'totalSecurity',
		summary,
		filter: '￥ ',
		formatter: ({ totalSecurity }) => {
			if (!totalSecurity) return 0;
			return '￥ ' +totalSecurity;
		}
	}
];




// 库存增减明细 搜索
export const SERVICE_ADD_SEARCH = {
	form: [
		{
			label: '出入库',
			key: 'outIn',
			type: 'select',
			value: '',
			options: WAREHOUSING,
			placeholder: '请选择出入库',
		},
		{
			label: '类型',
			key: 'source',
			type: 'select',
			value: '',
			options: TYPELIST,
			placeholder: '请选择类型',
		},
		{
			label: '月份',
			key: 'monthTime',
			type: 'datePicker',
			value: '',
			config: {
				valueFormat: 'yyyyMM',
				type: 'month',                  //month 月份类型  
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					},
				},
				placeholder: '请选择月份'
			},
		}
	],
}

// 库存增减明细
export const SERVICE_ADD_COLUMNS = [
	{
		label: '日期',
		align: 'center',
		prop: 'createTime',
		formatter: ({ createTime }) => {
			if (!createTime) return '';
			return filters.formatDate(createTime);
		}
	},
	{
		prop: 'source',
		label: '类型',
		align: 'center',
		formatter: ({ source }) => {
			return source in SOURRSELIST ? SOURRSELIST[source] : '';
		},
	},
	{
		label: '单号',
		align: 'center',
		width: 200,
		prop: 'businessId',
	},
	{
		label: '出入库',
		align: 'center',
		prop: 'outIn',
		formatter: ({ outIn }) => {
			return outIn in OUTINTYPE ? OUTINTYPE[outIn] : '';
		},
	},
	{
		label: '库存增减',
		align: 'center',
		prop: 'diffNum',
		formatter: ({ diffNum }) => {
			return diffNum + '';
		},
	},
	{
		label: '库存结余',
		align: 'center',
		prop: 'productNum',
		formatter: ({ productNum }) => {
			return productNum == 0 ? 0 : productNum;
		},
	},
];

// 库存对账单
export const SERVICE_RECONCILIATION_SEARCH = {
	form: [
		{
			label: '分公司编号',
			key: 'companyCode',
			type: 'select',
			value: '',
			options: [],
			placeholder: '请选择分公司编号',
		},
		{
			label: '服务中心编号',
			key: 'storeCode',
			type: 'input',
			value: '',
			placeholder: '请输入服务中心编号',
		},
		{
			label: '产品编码',
			key: 'productCode',
			type: 'input',
			value: '',
			placeholder: '请输入产品编码',
		},
		{
			label: '月份',
			key: 'month',
			slotcontent:true,
			// config: {
			// 	type: 'monthrange',
			// 	pickerOptions: {
			// 	},
			// 	rangeSeparator: "至",
			// 	startPlaceholder: "开始月份",
			// 	endPlaceholder: "结束月份"
			// },
		},
	],
}
export const SERVICE_RECONCILIATION_COLUMNS = [
	{
		label: '服务中心编号',
		align: 'center',
		prop: 'storeCode',
		width: 100
	},
	{
		label: '分公司编号',
		align: 'center',
		prop: 'companyCode',
		width: 100
	},
	{
		label: '产品编号',
		align: 'center',
		width: 100,
		prop: 'productCode',
	},
	{
		label: '产品名称',
		align: 'center',
		width: 200,
		prop: 'productName',
	},
	{
		label: '单位',
		align: 'center',
		prop: 'meterUnit',
	},
	{
		label: '上期结存',
		align: 'center',
		prop: 'priorBalance',
		summary,
		formatter: ({ priorBalance }) => {
			return String(priorBalance)
		},
	},
	{
		label: '押货数量',
		align: 'center',
		prop: 'mortgageNum',
		summary,
		formatter: ({ mortgageNum }) => {
			return Math.abs(mortgageNum)
		},
	},
	{
		label: '押货退回',
		align: 'center',
		prop: 'mortgageReturn',
		summary,
		formatter: ({ mortgageReturn }) => {
			return Math.abs(mortgageReturn)
		},
	},
	{
		label: '配送数量',
		align: 'center',
		prop: 'orderNum',
		summary,
		formatter: ({ orderNum }) => {
			return Math.abs(orderNum)
		},
	},
	{
		label: '配送退回',
		align: 'center',
		prop: 'orderReturn',
		summary,
		formatter: ({ orderReturn }) => {
			return Math.abs(orderReturn)
		},
	},
	// {
	// 	label: '押货调整',
	// 	align: 'center',
	// 	prop: 'mortgageNum',
	// 	formatter: ({ mortgageNum }) => {
	// 		return String(mortgageNum)
	// 	},
	// },
	{
		label: '库存调整',
		align: 'center',
		prop: 'adjustNum',
		summary,
		formatter: ({ adjustNum }) => {
			return Math.abs(adjustNum)
		},
	},
	{
		label: '本期结存',
		align: 'center',
		prop: 'productNum',
		summary,
		formatter: ({ productNum }) => {
			return String(productNum)
		},
	},
];

// 库存对账单开关
export const SERVICE_SWTICH_COLUMNS = [
	{
		label: '操作类型',
		align: 'center',
		prop: 'opType',
		formatter: ({ opType }) => {
			return opType in OPEARTTYPE ? OPEARTTYPE[opType] : '';
		}
	},
	{
		label: '修改人',
		align: 'center',
		prop: 'operator',
	},
	{
		label: '修改时间',
		align: 'center',
		prop: 'createTime',
		formatter: ({ createTime }) => {
			if (!createTime) return '';
			return filters.formatDate(createTime);
		}
	},
]

// 套装拆分
export const SERVICE_PACKAGE_SPLIT_CONFIG = {
	form: [
		{
			label: '产品编号',
			key: 'serialNo',
			type: 'input',
			value: null,
			placeholder: '请输入产品编号',
		},
		{
			label: '拆分状态',
			key: 'splitStatus',
			type: 'select',
			value: '',
			options: [],
			placeholder: '请选择拆分状态',
		},
		{
			label: '停止时间',
			key: 'stopTime',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
			},
		},
	],
}

export const SERVICE_PACKAGE_SPLIT_COLUMNS = [
	{
		label: '产品编号',
		align: 'center',
		prop: 'serialNo',
	},
	{
		label: '产品名称',
		align: 'center',
		prop: 'title',
	},
	{
		label: '规格',
		align: 'center',
		prop: 'packing',
	},
	{
		label: '销售状态',
		align: 'center',
		prop: 'productStatus',
		formatter: ({ productStatus }) => {
			return productStatus in PRODUCTTYPE ? PRODUCTTYPE[productStatus] : '';
		}
	},
	{
		label: '停止时间',
		align: 'center',
		prop: 'stopSaleTime',
		formatter: ({ stopSaleTime }) => {
			return filters.formatDate(stopSaleTime);
		}
	},
	{
		label: '拆分状态',
		align: 'center',
		prop: 'splitStatus',
		formatter: ({ splitStatus }) => {
			return splitStatus in SPLITTYPE ? SPLITTYPE[splitStatus] : '';
		}
	},
]

// 套装保留
export const SERVICE_RETAIN_CONFIG = {
	form: [
		{
			label: '服务中心编号',
			key: 'storeCode',
			type: 'input',
			value: '',
			placeholder: '请输入服务中心编号',
		},
		{
			label: '产品编号',
			key: 'serialNo',
			type: 'input',
			value: '',
			placeholder: '请输入产品编号',
		},
	],
}


export const SERVICE_RETAIN_COLUMNS = [
	{
		label: '服务中心',
		align: 'center',
		prop: 'storeCode',
	},
	{
		label: '产品编号',
		align: 'center',
		prop: 'serialNo',
	},
	{
		label: '产品名称',
		align: 'center',
		prop: 'title',
	},
	{
		label: '规格',
		align: 'center',
		prop: 'packing',
	},
	{
		label: '停止时间',
		align: 'center',
		prop: 'stopSaleTime',
		formatter: ({ stopSaleTime }) => {
			if (!stopSaleTime) return '';
			return filters.formatDate(stopSaleTime);
		}
	},
	{
		label: '保留开始时间',
		align: 'center',
		prop: 'reserveBeginTime',
		formatter: ({ reserveBeginTime }) => {
			if (!reserveBeginTime) return '';
			return filters.formatDate(reserveBeginTime);
		}
	},
	{
		label: '保留截止时间',
		align: 'center',
		prop: 'reserveEndTime',
		formatter: ({ reserveEndTime }) => {
			if (!reserveEndTime) return '';
			return filters.formatDate(reserveEndTime);
		}
	},
	{
		label: '状态',
		align: 'center',
		prop: 'status',
		formatter: ({ status }) => {
			return status in STATUSTYPE ? STATUSTYPE[status] : '';
		}
	},
]

export const GROUP_BUY_ORDER__MANAGEMENT_SERACH = {
	col: 3,
	form: [
		{
			label: '分公司编号：',
			key: 'companyCode',
			type: 'input',
			value: '',
			placeholder: '请填写分公司编号',
			rules: [
				{ min: 1, max: 20, message: '长度在 1 到 20 个字符' },
			],
		},
		{
			label: '服务中心编号：',
			key: 'storeCode',
			type: 'input',
			value: '',
			placeholder: '请填写服务中心编号',
			rules: [
				{ min: 1, max: 20, message: '长度在 1 到 20 个字符' },
			],
		},
		{
			label: '产品编号：',
			key: 'productCode',
			type: 'input',
			value: '',
			placeholder: '请填写产品编号',
			rules: [
				{ min: 1, max: 20, message: '长度在 1 到 20 个字符' },
			],
		},
		{
			label: '团购订单编号：',
			key: 'orderNo',
			type: 'input',
			value: '',
			placeholder: '请填写团购订单编号',
			rules: [
				{ min: 1, max: 20, message: '长度在 1 到 20 个字符' },
			],
		},
		{
			label: '月份：',
			key: 'month',
			type: 'datePicker',
			value: [],
			config: {
				type: 'month',
				valueFormat: 'yyyyMM',
				pickerOptions: {}
			}
		},
	]
}

export const CREATE_NEW_SUIT_RULES = {
	storeCode: [
		{ required: true, message: '请输入服务中心编号', trigger: 'blur' },
	],
	serialNo: [
		{ required: true, message: '请输入套装编号', trigger: 'blur' },
	],
	amount: [
		{ required: true, message: '请输入保留数量', trigger: 'blur' }
	],
	reserveTime: [
		{ required: true, message: '请输入保留时间', trigger: 'blur' }
	],
}


// 套装组合
export const SERVICE_PACKAGE_COMBINATION_CONFIG = {
	form: [
		{
			label: '分公司编号',
			key: 'companyCode',
			type: 'select',
			value: '',
			options: [],
			placeholder: '请选择分公司编号',
		},
		{
			label: '组合状态',
			key: 'combineState',
			type: 'select',
			value: '',
			options: optionGenerator(COMBINETYPE),
			placeholder: '请选择组合状态',
		},
		{
			label: '组合时间',
			key: 'combineTime',
			type: 'datePicker',
			value: [undefined, undefined],
			config: {
				type: 'daterange',
			},
		},
		{
			label: '服务中心编号',
			key: 'storeCode',
			type: 'input',
			value: '',
			placeholder: '请输入服务中心编号',
		},
		{
			label: '产品编号',
			key: 'productCode',
			type: 'input',
			value: '',
			placeholder: '请输入产品编号',
		},
	],
}

export const SERVICE_PACKAGE_COMBINATION_COLUMNS = [
	{
		label: '分公司编码',
		align: 'center',
		prop: 'companyCode',
	},
	{
		label: '服务中心编码',
		align: 'center',
		prop: 'storeCode',
	},
	{
		label: '产品编码',
		align: 'center',
		prop: 'productCode',
	},
	{
		label: '产品名称',
		align: 'center',
		prop: 'productName',
	},
	{
		label: '规格',
		align: 'center',
		prop: 'packing',
	},
	{
		label: '销售状态',
		align: 'center',
		prop: 'productStatus',
		formatter: ({ productStatus }) => {
			return productStatus in PRODUCTTYPE ? PRODUCTTYPE[productStatus] : '';
		}
	},
	{
		label: '组合状态',
		align: 'center',
		prop: 'state',
		formatter: ({ state }) => {
			return state in COMBINETYPE ? COMBINETYPE[state] : '';
		}
	},
	{
		label: '组合时间',
		align: 'center',
		prop: 'combineTime',
		formatter: ({ combineTime }) => {
			if (!combineTime) return '';
			return filters.formatDate(combineTime);
		}
	},
	{
		label: '组合数量',
		align: 'center',
		prop: 'combineNum',
		formatter: ({ combineNum }) => {
			return combineNum === 0 ? 0 : combineNum;
		}
	},
]



