import { minuteToDate, formatDate, formatDateDefault } from 'util/formValidation.js';
import { optionGenerator } from 'util';

// 退换货须知标题类型
export const TUIHUANHUO_XUZHI = {
	'1': '退货',
	'2': '换货',
}
// 订单类型tab
export const ORDER_TYPE = {
	'one': [1, 2, 3],
	'two': [4],
	'three': [5, 6],
}

// 订单状态
// const RETURN_ORDER_STATUS = {
// 	'1': '待付款',
// 	'2': '已付款',
// 	'3': '已发货',
// 	'4': '待退货',
// 	'5': '未退货',
// 	'6': '已完成',
// }
const ORDER_STATUS = {
	'1': '待付款订单',
	'2': '待发货订单',
	'3': '待收货订单',
	'4': '待审核的退货单',
	'5': '待退货的退货单',
	'6': '待退货的换货单',
	'7': '待收货的换货单',
	'8': '待收货',
	'9': '待退回的押货退货单',
	'10': '待退回的押货换货单',
	'11': '待收货的押货换货单',
	'12': '未审核自提退货单',
	'13': '公司交付订单未发货定时提醒',
	'14': '待收货的货损货差单',
}

// 物流方式
// const LOGISTICS_TYPE = {
// 	'1': '自提',
// 	'2': '完美公司交付',
// }

// 退换货类型
export const RETURN_EXCHANGE_TYPE = {
	'0': '全部',
	'1': '商城退货',
	'2': '商城换货',
	'3': '服务中心押货退货',
	'4': '服务中心押货换货',
	'5': '展业包订货退货',
	'6': '展业包订货换货',
	'7': '货损',
	'8': '故障维修',
}
// 支付方式名称
export const PAYMENT_METHOD_NAME = {
	'1': '微信',
	'2': '支付宝',
	'3': '银联',
	'4': '工商银行',
	'5': '储蓄银行',
	'6': '交通银行',
	'7': '建设银行',
	'8': '完美钱包',
}

// 适配对象
export const ADAPTATION_ROLE_FLAG = {
	'1': '普通顾客',
	'2': '优惠顾客',
	'4': '云商',
	'8': '微店',
}

// 支付方式-状态
const PAYMENT_MENTHOD_STATUS = {
	'0': '禁用',
	'1': '启用',
}

// 汇款类型设置-计算方式
export const CALCULATION_METHOD = {
	'1': '增加',
	'2': '减少',
	'3': '不做处理'
}

// 汇款类型设置-状态
const REMITTANCE_STATUS = {
	'0': '禁用',
	'1': '启用',
}

// 运费模板设置-状态
const SHIPPING_TEMPLATE_STATUS = {
	'0': '禁用',
	'1': '启用',
}

// // 运费模板设置-类型
// const SHIPPING_TEMPLATE_TYPE = {
// 	'1': '免邮模板',
// 	'2': '按订单金额收取运费',
// }

// 格式化‘功能说明’内容
const renderDom = (row) => {
	const date = minuteToDate(row.configTime);
	const type = String(row.flag);
	if (row.type === 2) {
		return `<span style="color:#0877fd">次月${row.configTime}日</span>后状态未变为已支付，则系统自动取消订单`
	}
	switch (type) {
		case '1':
			return `<span style="color:#0877fd">${date}</span>后，系统自动取消待付款订单`;
		case '2':
			return `<span style="color:#0877fd">${date}</span>后，系统自动确认服务中心已发货（仅适用于自提订单）`;
		case '3':
			return `<span style="color:#0877fd">${date}</span>后，系统自动确认顾客已收货`;
		case '4':
			return `<span style="color:#0877fd">${date}</span>后，系统自动确认服务中心审核通过（适用于自提且未发货的购买订单）`;
		case '5':
			return `<span style="color:#0877fd">${date}</span>后，系统自动取消退货单`;
		case '6':
			return `<span style="color:#0877fd">${date}</span>后，系统自动取消换货单`;
		case '7':
			return `<span style="color:#0877fd">${date}</span>后，系统自动完成“还未确认收货的换货单`;
		case '8':
			return `<span style="color:#0877fd">${date}</span>后，系统自动确认顾客已收货`;
		case '9':
			return `<span style="color:#0877fd">${date}</span>后，系统自动取消押货退货单`;
		case '10':
			return `<span style="color:#0877fd">${date}</span>后，系统自动取消押货换货单`;
		case '11':
			return `<span style="color:#0877fd">${date}</span>后，系统自动确认已收货`;
		case '12':
			return `<span style="color:#0877fd">${date}</span>后，自提退货单到时未审核自动取消退货`;
		case '13':
			return `<span style="color:#0877fd">${date}</span>后，未发货的公司交付订单会进行提醒`;
		case '14':
			return `<span style="color:#0877fd">${date}</span>后，系统自动确认已收货`;
		default:
			return '';
	}
}

// 订货/退货设置-列表配置
export const RETURN_SETTINGS_COLUMNS = [
	{
		prop: 'flag',
		label: '订单状态',
		align: 'center',
		width: '180px',
		formatter: ({ flag }) => {
			return flag in ORDER_STATUS ? ORDER_STATUS[flag] : '';
		},
	},
	{
		prop: 'configTime',
		label: '功能说明',
		align: 'left',
		formatter: (row) => {
			return renderDom(row);
		},
	},
	// {
	// 	prop: 'logisticsType',
	// 	label: '物流方式',
	// 	align: 'center',
	// 	formatter: ({ logisticsType }) => {
	// 		return logisticsType in LOGISTICS_TYPE ? LOGISTICS_TYPE[logisticsType] : '';
	// 	},
	// },
]

// 退货货原因管理-搜索配置
export const REASON_MANAGE_CONFIG = {
	form: [
		{
			label: '退换货类型',
			key: 'returnType',
			type: 'select',
			value: 0,
			options: optionGenerator(RETURN_EXCHANGE_TYPE),
			placeholder: '请选择退换类型',
		},
	],
}

// 支付方式管理-列表配置
export const PAYMENT_TYPE_COLUMNS = [
	{
		prop: 'name',
		// prop: 'paymentMethod',
		label: '支付方式名称',
		align: 'left',
		// formatter: ({ paymentMethod }) => {
		// 	return paymentMethod in PAYMENT_METHOD_NAME ? PAYMENT_METHOD_NAME[paymentMethod] : '';
		// },
	},
	// {
	// 	prop: 'applianceRoleFlag',
	// 	label: '适用对象',
	// 	align: 'left',
	// 	formatter: ({ applianceRoleFlag }) => {
	// 		return applianceRoleFlag.map(item => {
	// 			return item in ADAPTATION_ROLE_FLAG ? ADAPTATION_ROLE_FLAG[item] : '';
	// 		}).join(',')
	// 	},
	// },
	{
		prop: 'status',
		label: '状态',
		align: 'left',
		formatter: ({ status }) => {
			return status in PAYMENT_MENTHOD_STATUS ? PAYMENT_MENTHOD_STATUS[status] : '';
		},
	},
]

// 汇款类型设置-列表配置
export const REMITTANCE_COLUMNS = [
	{
		prop: 'typeName',
		label: '汇款类型名称',
		align: 'left',
	},
	{
		prop: 'calculation',
		label: '计算方式',
		align: 'left',
		formatter: ({ calculation }) => {
			return calculation in CALCULATION_METHOD ? CALCULATION_METHOD[calculation] : '---';
		},
	},
	{
		prop: 'explanation',
		label: '说明',
		align: 'left',
	},
	{
		prop: 'status',
		label: '状态',
		align: 'left',
		formatter: ({ status }) => {
			return status in REMITTANCE_STATUS ? REMITTANCE_STATUS[status] : '';
		},
	},
]

// 税率设置-列表配置
export const DUTY_RATE_COLUMNS = [
	{
		prop: 'name',
		label: '税率名称',
		align: 'left',
	},
	{
		prop: 'rate',
		label: '税率',
		align: 'left',
		formatter: ({ rate }) => {
			return rate + '%';
		},
	},
]

// 运费模板设置-列表配置
export const SHIPPING_TEMPLATE_COLUMNS = [
	{
		prop: 'carriageName',
		// prop: 'carriageTemplateType',
		label: '运费模板名称',
		align: 'left',
		// formatter: ({ carriageTemplateType }) => {
		// 	return carriageTemplateType in SHIPPING_TEMPLATE_TYPE ? SHIPPING_TEMPLATE_TYPE[carriageTemplateType] : '';
		// }
	},
	{
		prop: 'status',
		label: '状态',
		align: 'left',
		formatter: ({ status }) => {
			return status in SHIPPING_TEMPLATE_STATUS ? SHIPPING_TEMPLATE_STATUS[status] : '';
		}
	},
]

// 补保单月结日期-列表配置
export const MONTHLY_PAY_COLUMNS = [
	{
		prop: 'month',
		label: '月份',
		align: 'left',
		formatter: ({ monthlyDate }) => {
			return (() => {
				let d = new Date(monthlyDate);
				let MM = d.getMonth() + 1;
				return MM;
			})();
		}
	},
	{
		prop: 'monthlyDate',
		label: '补报单月结日期',
		align: 'left',
		formatter: ({ monthlyDate }) => {
			return formatDate(monthlyDate);
		}
	},
]
let returnTypeArr = {
	1: '商城退货', 2: '商城换货', 3: '服务中心押货退货', 4: '服务中心押货换货', 5: '展业包订货退货', 6: '展业包订货换货'
}
export const RETURN_NOTICE_COLUMNS = [
	{ prop: 'returnType', label: '场景标题', align: 'center', formatter: ({ returnType }) => returnTypeArr[returnType] },
	{ prop: 'updateTime', label: '编辑时间', align: 'center', wdith: 160, formatter: ({ updateTime }) => updateTime ? formatDate(updateTime) : '--' },
	{ prop: 'updater', label: '编辑人员', align: 'center' },
]
let typeArr = {
	1: '自提',
	2: '完美公司交付'
}
let applianArr = {
	1: '普通顾客', 2: '优惠顾客', 4: '云商', 8: '微店'
}
export const LOGISTICS_COLUMNS = [
	{ prop: 'type', label: '物流方式名称', align: 'center', formatter: ({ type }) => typeArr[type] },
	{
		prop: 'applianceRoleFlag', label: '适用对象', align: 'center', wdith: 160, formatter: ({ applianceRoleFlag }) => {
			let arr = []
			applianceRoleFlag.map(e => {
				if (applianArr[e]) {
					arr.push(applianArr[e])
				}
			})
			return arr.join('、')
		}
	},
	{ prop: 'createTime', label: '创建时间', align: 'center', wdith: 160 },
	{ prop: 'status', label: '状态', align: 'center', formatter: ({ status }) => status === 1 ? '启用' : '禁用' },
]

export const SET_MONTH_END_TIME_COLUMNS = [
	{ prop: 'month', label: '年月', align: 'center', wdith: 160 },
	{ prop: 'effectDate', label: '生效日期', align: 'center', wdith: 160 },
	{ prop: 'status', label: '状态', align: 'center', wdith: 160, formatter: ({ status }) => status === 0 ? '已生效' : '未生效' },
]

export const SET_MONTH_END_TIME_CONFIG = {
	form: [
		{
			label: '月份',
			key: 'getTime',
			type: 'datePicker',
			value: [],
			config: {
				type: 'monthrange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期',
				pickerOptions: {
					disabledDate: () => {
						return false;
					}
				},
			},
		}
	],
}




// 成品报告管理产地 
export const PRODUCT_RERORT_LIST_STATUS = {
	1: '中山基地', 2: '扬州基地',3: '吉林基地'
}
// 成品报告管理搜索配置
export const PRODUCT_RERORT_SEARCH = {
	form: [
		{
			label: '成品代码',
			key: 'productCode',
			type: 'input',
			value: '',
			placeholder: '请填写成品代码',
		},
		{
			label: '成品名称',
			key: 'productName',
			type: 'input',
			value: '',
			placeholder: '请填写成品名称',
		},
		{
			label: '批号',
			key: 'productNumber',
			type: 'input',
			value: '',
			placeholder: '请填写成品批号',
		},
		{
			label: '产地',
			key: 'producedAddress',
			type: 'select',
			value: '',
			options: optionGenerator(PRODUCT_RERORT_LIST_STATUS),
			placeholder: '请选择产地',
		},
		{
			label: '报告类型',
			key: 'reportType',
			type: 'select',
			value: 1,
			options: [
				{ value: 1, label: '自检' },
				{ value: 2, label: '外检' },
			],
			placeholder: '请选择类型',
			forceUpdate: true
		},
		{
			label: '生产日期',
			key: 'registrationTime',
			type: 'datePicker',
			value: '',
			config: {
				type: 'daterange',
			},
		},
		{
			label: '状态',
			key: 'status',
			type: 'select',
			value: '',
			options: [
				{ value: 0, label: '禁用' },
				{ value: 1, label: '启用' },
			],
			placeholder: '请选择状态',
		},
		{
			label: '上传时间',
			key: 'uploadTime',
			type: 'datePicker',
			value: '',
			config: {
				type: 'daterange',
			},
		},
		{
			label: '报告来源',
			key: 'sign',
			type: 'select',
			value: '',
			options: [
				{ value: 0, label: '后台' },
				{ value: 1, label: 'LIMS' },
			],
			placeholder: '请选择来源',
		},
	],
	rules: {
		productCode: [{ required: true, message: '请输入成品代码', trigger: 'blur' }],
		// productNumber: [{ required: true, message: '请输入批号', trigger: 'blur' }],
		// producedAddress: [{ required: true, message: '请选择产地', trigger: 'change' }],
	}
};

export const PRODUCT_RERORT_COLUMNS = [
	{ label: '成品代码', prop: 'productCode', align: 'center' },
	{ label: '成品名称', prop: 'productName', align: 'center' },
	{ label: '批号', prop: 'productNumber', align: 'center', width: 140,
		formatter: ({ productNumber }) => productNumber ? productNumber : '--'
	},
	{
		label: '产地', prop: 'producedAddress', align: 'center', width: 140,
		formatter: ({ producedAddress }) => PRODUCT_RERORT_LIST_STATUS[producedAddress] || '--'
	},
	{
		label: '生产日期', prop: 'producedDate', align: 'center', width: 100,
		formatter: ({ producedDate }) => producedDate? formatDateDefault(producedDate) : '--'
	},
	{
		label: '上传时间', prop: 'uploadTime', align: 'center', width: 140,
		formatter: ({ uploadTime }) => formatDate(uploadTime) || '--'
	},
	{ label: '工号', prop: 'uploadNo', align: 'center', width: 100,},
	{ label: '报告来源', prop: 'sign', align: 'center', formatter: ({ sign }) => sign === 1 ? 'LIMS' : '后台' },
	{ label: '状态', prop: 'status', align: 'center', formatter: ({ status }) => status === 1 ? '启用' : '禁用' },
];

export const REPORT_FORM_RULE = {
	productCode: [
		{ required: true, message: '请输入成品代码', trigger: 'blur' },
	],
	productName:[
		{ required: true, message: '请输入成品名称', trigger: ['blur', 'change'] }
	],
	producedAddress: [
		{ required: true, message: '请选择产地', trigger: 'change' }
	],
	reportType: [
		{ required: true, message: '请选择报告类型', trigger: 'change' }
	],
	status: [
		{ required: true, message: '请选择状态', trigger: 'change' }
	],
	date: [
		{ required: true, message: '请选择生产日期', trigger: 'change' }
	],
	productNumber: [
		{ required: true, message: '请输入批号', trigger: 'blur' },
	],
	// file: [
	// 	{ required: true, message: '请上传文件', trigger: 'change' }
	// ],
}