import { optionGenerator, genCurrentMonthFirstAndLastDay } from 'util';
import { formatDateStr } from 'util/formValidation';

// 顾客退货 申请来源
const APPLY_SOURCE = {
	'1': '顾客申请',
	'2': '代客售后',
	'3': '商城1.0申请'
}

// export const REFUND_STATUS = {
// 	'-1':'无需退款',
// 	'0': '退款中',
// 	'1': '已退款',
// 	'2': '退款失败'
// }
// 申请来源 详情显示
export const APPLYSOURCE = {
	'0': '代客售后', // 总公司申请的代客售后
	'1': '顾客申请',
	'2': '代客售后', // 分公司申请的代客售后
}

// 订单发货状态
export const ORDERDELIVERSTATUS = {
	'0': '待发货',
	'1': '已发货'
}

// 顾客退货 退货类型
const RETURN_TYPE = {
	'1': '当月退货',
	'2': '隔月退货'
}

// 顾客退货 交付方式
const EXPRESS_TYPE = {
	'1': '服务中心自提',
	'2': '公司交付'
}

// 顾客退货 搜索配置
export const RETURN_GOODS_SEARCH = {
	form: [
		{
			label: '退货类型',
			key: 'returnType',
			type: 'select',
			value: '',
			placeholder: '请选择退货类型',
			options: optionGenerator(RETURN_TYPE),
			showForever: true
		},
		{
			label: '交付方式',
			key: 'expressType',
			type: 'select',
			value: '',
			placeholder: '请选择交付方式',
			clearable: false,
			options: optionGenerator(EXPRESS_TYPE),
		},
		{
			label: '申请时间',
			key: 'applyTime',
			type: 'datePicker',
			value: genCurrentMonthFirstAndLastDay(),
			config: {
				type: 'daterange',
			},
			showForever: true
		},
		{
			label: '申请来源',
			key: 'applySource',
			type: 'select',
			value: '',
			placeholder: '请选择申请来源',
			options: optionGenerator(APPLY_SOURCE),
			showForever: true
		},
		{
			label: '业务分公司',
			key: 'companyCode',
			type: 'select',
      filterable: true,
			value: '',
      placeholder: '请选择业务分公司',
      options: [],
		},
		{
			label: '财务分公司',
			key: 'financeCompanyCode',
			type: 'select',
      filterable: true,
			value: '',
      placeholder: '请选择财务分公司',
      options: [],
		},
		{
			label: '订单发货状态',
			key: 'orderDeliverStatus',
			type: 'select',
			value: '',
			placeholder: '请填写订单发货状态',
			options: optionGenerator(ORDERDELIVERSTATUS),
		},
		{
			label: '服务中心编号',
			key: 'storeCode',
			type: 'input',
			value: '',
			placeholder: '请填写服务中心编号',
		},

		{
			label: '顾客卡号',
			key: 'customerCard',
			type: 'input',
			value: '',
			placeholder: '请填写顾客卡号',
		},
		{
			label: '开单人卡号',
			key: 'creatorCard',
			type: 'input',
			value: '',
			placeholder: '请填写开单人卡号',
		},
		{
			label: '售后单号',
			key: 'returnNo',
			type: 'input',
			value: '',
			placeholder: '请填写售后订单号',
		},
		{
			label: '对应订单号',
			key: 'orderNo',
			type: 'input',
			value: '',
			placeholder: '请填写对应订单号',
		},

	],
}

export function TABITEM() {
	this.loading = false;
	this.data = [];
	this.total = 0;
	this.tabTotal = 0;
	this.selections = []
	this.pagination = {
		currentPage: 1,
		pageSize: 10,
	}
}
// 顾客退货管理 页签列表
export const RETURN_GOODS_TABLIST = [
	['全部', '0'],
	['待审核', '1'],
	['待退回', '2'],
	['待验货', '3'],
	['已完成', '99'],
	['已取消/已拒绝', '98'],
];


// 顾客退货管理 表格列定义
export const RETURN_GOODS_COLUMNS = [
	{ prop: 'returnNo', label: '售后单号', align: 'center', width: 195, fixed: 'left' },
	{ prop: 'orderNo', label: '对应订单号', align: 'center', width: 195, fixed: 'left' },
	{ prop: 'applyTimeDesc', label: '申请日期', align: 'center', width: 150 },
	{ prop: 'customerCard', label: '顾客卡号', align: 'center', width: 120 },
	{ prop: 'creatorCard', label: '开单人卡号', align: 'center', width: 120 },
	{ prop: 'financeCompanyCode', label: '财务分公司编号', align: 'center', width: 110 },
	{ prop: 'financeCompanyName', label: '财务分公司', align: 'center', width: 150 },
	{ prop: 'companyCode', label: '业务分公司编号', align: 'center', width: 110 },
	{ prop: 'companyName', label: '业务分公司', align: 'center', width: 150 },
	{ prop: 'storeName', label: '服务中心名称', align: 'center', width: 180 },
	{ prop: 'storeCode', label: '服务中心编号', align: 'center', width: 100 },
	{
		prop: 'applySourceDesc',
		label: '来源',
		align: 'center',
	},
	{
		prop: 'returnType',
		label: '退货类型',
		align: 'center',
		formatter: ({ returnType }) => {
			return returnType in RETURN_TYPE ? RETURN_TYPE[returnType] : '';
		}
	},
	{ prop: 'orderDeliverStatusDesc', label: '订单发货状态', align: 'center', width: 100 },
	{
		prop: 'expressType',
		label: '交付方式',
		align: 'center',
		width: 110,
		formatter: ({ expressType }) => {
			return expressType in EXPRESS_TYPE ? EXPRESS_TYPE[expressType] : '';
		}
	},
	{ prop: 'returnStatusDesc', label: '处理状态', align: 'center' },
	{
		prop: 'refundAmount', label: '退货金额(元)', align: 'center', width: 90,
		formatter: ({ refundAmount }) => {
			return '￥' + refundAmount.toFixed(2)
		}
	},
	{ prop: 'refundStatusDesc', label: '退款状态', align: 'center' },
	{
		prop: 'orderPv', label: '订单积分/PV', align: 'center', width: 120,
		formatter: ({ orderPv }) => {
			return Number(orderPv)
		}
	}
];

// 顾客退货详情 退回物流规则
export const LOGISTICSFORM_RULES = {
	returnExpressType: [{ required: true, message: '请选择交付方式', trigger: 'change' }],
	returnExpressName: [{ required: true, message: '请选择物流公司', trigger: 'change' }],
	returnExpressNo: [{ required: true, message: '请选择物流单号', trigger: 'change' }],
}

// 退货审核 / 验证审核 规则
export const AUDIT_VERIFY_DIALOG_RULES = {
	auditStatus: [
		{ required: true, message: '请选择审核结果', trigger: 'blur' }
	],
	remarks: [
		{ required: true, message: '请输入审核不通过的原因', trigger: 'blur' }
	],
	reason1Id: [
		{ required: true, message: '请选择一级退货原因', trigger: ['blur', 'change'] }
	],
	reason2Id: [
		{ required: true, message: '请选择二级退货原因', trigger: ['blur', 'change'] }
	]
}


// 退货详情 审核
export const AUDIT_VERIFY = {
	'1': '审核通过',
	'2': '审核不通过',
}
// 退货详情 退票方式
export const EXPRESSTYPE = {
	1: '服务中心自提',
	2: '公司交付'
}
// 退货详情 开票状态
export const INVOICESTATUS = {
	1: '未开票',
	2: '开票中',
	3: '已开票'
}
// 退货详情 / 顾客类型
export const CUSTOMERTYPE = {
	1: '普通顾客',
	2: '优惠顾客',
	3: '云商',
	4: '微店',
}
// 退货详情 开票类型
export const INVOICETYPE = {
	1: '个人普通电子票',
	2: '企业普通电子发票',
	3: '企业专用纸质发票'
}
// 退货详情 付款方式
export const PAYTYPE = {
	101: '微信',
	102: '支付宝',
	103: '银联',
	201: '工商银行',
	202: '建设银行',
	203: '邮政存蓄银行',
	204: '交通银行',
	205: '平安代扣',
	800: '完美钱包',
	801: '完美钱包+工商银行支付',
	802: '完美钱包+建设银行支付',
	803: '完美钱包+交通银行支付',
	804: '完美钱包+银联支付',
	805: '完美钱包+微信支付',
	806: '完美钱包+支付宝支付',
	807: '完美钱包+邮政储蓄银行支付',
	808: '完美钱包+平安代扣支付',
}
// 退货详情 金钱需格式化字段
export const MONENY_FILTER_ARR = ['orderAmount', 'returnAmount', 'actuallyAmount', 'giftCouponAmount', 'couponAmount', 'expressSubsidyAmount', 'expressAmount']

// 退货详情 退货明细
export const ORDER_RETURN_GOODS_COLUMS = [
	{ label: '序号', prop: 'no', type: "index", align: 'center', width: 50, formatter: (record, prop, index) => index + 1 },
	{ label: '产品编码', prop: 'productCode', align: 'center' },
	{ label: '产品名称', prop: 'productName', align: 'center', width: 350 },
	{ label: '规格', prop: 'packing', align: 'center' },
	{ label: '单位', prop: 'meterUnit', align: 'center' },
	{ label: '数量', prop: 'buyQuantity', align: 'center', summary: true },
	{
		label: '零售价',
		prop: 'retailPrice',
		align: 'center',
		formatter: ({ retailPrice }) => {
			return retailPrice ? retailPrice.toFixed(2) : ''
		},
	},
	{
		label: '活动价',
		prop: 'price',
		align: 'center',
		formatter: ({ price }) => {
			return price ? price.toFixed(2) : ''
		},
	},
	{ label: 'pv', prop: 'pv', align: 'center',
		formatter: ({ pv }) => {
			return pv +  ''
		}
	},
	{
		label: '金额小计',
		prop: 'totalPrice',
		align: 'center',
		summary: true,
		sumConfig: {
			type: 'moneyFixed',
			fixed: true
		},
		formatter: ({ totalPrice }) => {
			return totalPrice ? `￥${totalPrice.toFixed(2)}` : ''
		},
	},
	{ label: 'pv小计', prop: 'totalPv', align: 'center', summary: true,
		formatter: ({ totalPv }) => {
			return totalPv + ''
		}
	},
]

// 退货详情 操作明细
export const HANDLE_RETURN_GOODS_COLUMS = [
	{ label: '序号', prop: 'no', type: "index", align: 'center', width: 50, formatter: (record, prop, index) => index + 1 },
	{
		label: '操作时间', prop: 'createTime', align: 'center',
		formatter: ({ createTime }) => {
			return formatDateStr(createTime);
		}
	},
	{ label: '操作内容', prop: 'content', align: 'center' },
	{ label: '操作人', prop: 'operator', align: 'center' },
	{ label: '机构', prop: 'organName', align: 'center' },
	{ label: '备注', prop: 'remarks', align: 'center' },
]
// 退货详情 审核意见
export const IDEA_RETURN_GOODS_COLUMS = [
	{ label: '序号', prop: 'no', type: "index", align: 'center', width: 50, formatter: (record, prop, index) => index + 1 },
	{
		label: '审核时间', prop: 'createTime', align: 'center',
		formatter: ({ createTime }) => {
			return formatDateStr(createTime);
		}
	},
	{ label: '审核人', prop: 'creator', align: 'center' },
	{ label: '机构', prop: 'comName', align: 'center' },
	{ label: '审核内容', prop: 'comment', align: 'center' },
]

export const IDEA_RULES = {
	comment: [{ required: true, message: '请输入审核意见', trigger: 'blur' }],
}