import { formatDate } from "util/formValidation.js"
import { optionGenerator } from "util"
export const LIMIT_STORE_TYPE = {
	1:'限制门店使用',
	0:'不限制门店使用'
}
export const MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG = {
	form: [
		{
			label: '优惠券名称',
			key: 'couponName',
			type: 'input',
			value: '',
			placeholder: '请输入优惠券名称',
		},
		{
			label: '优惠券编号',
			key: 'couponNumber',
			type: 'input',
			value: '',
			placeholder: '请输入优惠券编号',
		},
		{
			label: '创建时间',
			key: 'createTime',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期'
			}
		},
		{
			label: '优惠券有效期',
			key: 'redeem',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期'
			}
		},
		{
			label: '生成兑换码',
			key: 'isGenerateCode',
			type: 'select',
			value: '',
			options: [
				{ value: 1, label: '是' },
				{ value: 0, label: '否' },
			],
			placeholder: '请输入选择',
		},
		{
			label: '使用限制',
			key: 'limitStore',
			type: 'select',
			value: '',
			options:optionGenerator(LIMIT_STORE_TYPE),
			placeholder: '请输入选择',
		},
	],
	buttonGroup: [
		{
			type: '',
			title: '重置',
			key: 'reset'
		},
		{
			type: 'primary',
			title: '搜索',
			key: 'search'
		}
	]
}
const USE_RANGE = {
	1: '全部产品', 2: '指定产品', 3: '指定不适用产品', 4: '指定产品分类', 5: '指定活动'
}
export const CHANGE_COLUMNS = [
	{ prop: 'couponNumber', label: '优惠券编号', align: 'center', width: 160 },
	{ prop: 'couponName', label: '优惠券名称', align: 'center', width: 160 },
	{ prop: 'useRange', label: '使用范围', align: 'center', width: 160, formatter: ({ useRange }) => useRange in USE_RANGE ? USE_RANGE[useRange] : '--' },
	{ prop: 'faceValue', label: '面值', align: 'center', formatter: ({ faceValue }) => `￥${faceValue}` },
	{ prop: 'minAmount', label: '使用规则', align: 'center', width: 110, formatter: ({ minAmount }) => minAmount ? `满￥${minAmount} 可用` : '无限额' },
	{
		prop: 'limitStore', label: '类型', align: 'center',
		formatter: ({ limitStore }) => LIMIT_STORE_TYPE[limitStore]
	},	
	{
		prop: 'couponType', label: '类型', align: 'center',
		formatter: ({ couponType }) => DATA_STATUS_COUPONETYPE[couponType]
	},
	{ prop: 'startTime', label: '有效时间', align: 'center', width: 320, formatter: ({ endTime, startTime }) => endTime ? startTime + '至' + endTime : '不限制' },
	{
		prop: 'couponState', label: '状态', align: 'center',
		formatter: ({ couponState }) => {
			return MESSAGE_DETAIL_STATUS[couponState]
		}
	},
	{
		prop: 'couponCount', label: '券总量', align: 'center',
		formatter: ({ couponCount }) => couponCount === '-1' ? '不限量' : couponCount
	},
	{ prop: 'grantCount', label: '已发放', align: 'center' },
	{ prop: 'usedCount', label: '已核销', align: 'center' },
	{ prop: 'usedPercent', label: '券核销率', align: 'center', formatter: ({ usedPercent }) => usedPercent + '' },
	{ prop: 'isGenerateCode', label: '生成兑换码', align: 'center', formatter: ({ isGenerateCode }) => isGenerateCode ? '是' : '否' },
	{ prop: 'createTime', label: '创建时间', align: 'center', width: 160 },
];
export const MESSAGE_DETAIL_STATUS = {
	1: '待审核',
	2: '待生效',
	3: '进行中',
	4: '已失效',
	5: '已禁用',
	6: '已驳回',
	7: '草稿',
}
export const TAB_PANE = [
	{ name: 'all', label: '全部' },
	{ name: 'pending', label: '待审核' },
	{ name: 'tobeeffective', label: '待生效' },
	{ name: 'takeeffect', label: '进行中' },
	{ name: 'processing', label: '已失效' },
	{ name: 'disableover', label: '已禁用' },
	{ name: 'rejected', label: '已驳回' },
	{ name: 'draft', label: '草稿' },
]
export const GET_STATUS = {
	'all': null,
	'pending': 1,
	'tobeeffective': 2,
	'takeeffect': 3,
	'processing': 4,
	'disableover': 5,
	'rejected': 6,
	'draft': 7,
}
export const TAB_PANE_OBG = {
	all: {
		loading: false,
		data: [],
		pagination: {
			total: 0,
			currentPage: 1,
			pageSize: 10,
		},
	},
	pending: {
		loading: false,
		data: [],
		pagination: {
			total: 0,
			currentPage: 1,
			pageSize: 10,
		},
	},
	tobeeffective: {
		loading: false,
		data: [],
		pagination: {
			total: 0,
			currentPage: 1,
			pageSize: 10,
		},
	},
	takeeffect: {
		loading: false,
		data: [],
		pagination: {
			total: 0,
			currentPage: 1,
			pageSize: 10,
		},
	},
	processing: {
		loading: false,
		data: [],
		pagination: {
			total: 0,
			currentPage: 1,
			pageSize: 10,
		},
	},
	disableover: {
		loading: false,
		data: [],
		pagination: {
			total: 0,
			currentPage: 1,
			pageSize: 10,
		},
	},
	rejected: {
		loading: false,
		data: [],
		pagination: {
			total: 0,
			currentPage: 1,
			pageSize: 10,
		},
	},
	draft: {
		loading: false,
		data: [],
		pagination: {
			total: 0,
			currentPage: 1,
			pageSize: 10,
		},
	},
}
export const MESSAGE_DETAIL_COLUMNS = [
	{
		prop: 'cardNo',
		label: '会员卡号',
		align: 'left',
	},
	{
		prop: 'ctsName',
		label: '姓名',
		align: 'left',
	},
	{
		prop: 'phone',
		label: '手机号',
		align: 'left',
	},
]
export const ACTIVITY_COUPON_COLUMNS = [
	{ prop: 'cardNo', label: '优惠券编号', align: 'left', },
	// { label: '优惠券名称', align: 'left', },
	{ prop: 'phone', label: '面值', align: 'left', },
	{ prop: 'phone', label: '使用规则', align: 'left', },
	{ prop: 'phone', label: '类型', align: 'left', },
	{ prop: 'phone', label: '有效时间', align: 'left', },
]
export const PARTICIPATING_CUSTOMER_COLUMNS = [
	{ prop: 'cardNo', label: '会员卡号', align: 'center' },
	{ prop: 'realName', label: '会员姓名', align: 'center' },
	{ prop: 'mobile', label: '注册手机号', align: 'center' },
]
export const LIMIT = [
	{ value: 1, label: '所有顾客' },
	{ value: 2, label: '按照顾客身份' },
	{ value: 3, label: '按照顾客等级' },
	{ value: 4, label: '自由导入' },
]
export const ADD_COLUMNS = [
	{ prop: 'cardNo', label: '会员卡号', align: 'center' },
	{ prop: 'realName', label: '顾客名称', align: 'center' },
]

export const TURN_GIFT_WAY= {
	1: '指定用户',
	2: '券码兑换',
	3: '扫码领取',
	4: '转发领取',
}

export const OBTAIN_COUPNE_WAY= {
	1: '系统派发',
	2: '券码兑换',
	3: '门店转赠',
}

export const COUPON_MANAGEMENT_STATE_STATUS = {
	1: '未使用',
	2: '已使用',
	3: '已作废',
	4: '已失效',
	5: '占用中',
}

export const DATA_CONFIG = {
	form: [
		{
			label: '搜索会员卡号',
			key: 'cardNo',
			type: 'input',
			value: '',
			placeholder: '请输入会员卡号',
		},
		{
			label: '搜索姓名',
			key: 'realName',
			type: 'input',
			value: '',
			placeholder: '请输入会员姓名',
		},
		{
			label: '搜索手机号',
			key: 'mobile',
			type: 'input',
			value: '',
			placeholder: '请输入会员手机号',
		},
		{
			label: '优惠券状态',
			key: 'state',
			type: 'select',
			value: '',
			placeholder: '请输入选择',
			options:optionGenerator(COUPON_MANAGEMENT_STATE_STATUS)
		},
		{
			label: '获券方式',
			key: 'getType',
			type: 'select',
			value: '',
			placeholder: '请输入选择',
			options:optionGenerator(OBTAIN_COUPNE_WAY)
		},
		{
			label: '转赠方式',
			key: 'transferType',
			type: 'select',
			value: '',
			placeholder: '请输入选择',
			options:optionGenerator(TURN_GIFT_WAY)
		},
		{
			label: '转赠门店',
			key: 'code',
			type: 'input',
			value: '',
			placeholder: '请输入门店编号',
		},
	],
	buttonGroup: [
		{
			type: 'primary',
			title: '搜索',
			key: 'search'
		}
	]
}
export const PRODUCT_CONFIG = {
	form: [
		{
			label: '搜索产品',
			key: 'product',
			type: 'input',
			value: '',
			placeholder: '请输入产品名称'
		}
	],
	buttonGroup: [
		{
			type: 'primary',
			title: '搜索',
			key: 'search'
		}
	]
}
export const CUSTOMER_CONFIG = {
	form: [
		{
			label: '搜索顾客',
			key: 'memberInfo',
			type: 'input',
			value: '',
			placeholder: '请输入搜索顾客卡号'
		}
	],
	buttonGroup: [
		{
			type: 'primary',
			title: '搜索',
			key: 'search'
		}
	]
}
export const COUPON_COLUMNS = [
	{ prop: 'couponNumber', label: '优惠券编号', align: 'center' },
	{ prop: 'couponName', label: '优惠券名称', align: 'center' },
	{ prop: 'faceValue', label: '面值', align: 'center' },
	{ prop: 'minAmount', label: '使用规则', align: 'center' },
	{ prop: 'couponTypeString', label: '类型', align: 'center' },
	{ prop: 'startTime', label: '开始时间', align: 'center' },
	{ prop: 'endTime', label: '结束时间', align: 'center' },
]; 
const OPERAT = {1:'创建优惠券',3:'审核通过',4:'审核不通过'}
export const OPERATING_COLUMNS = [
	{ prop: 'createTime', label: '操作时间', align: 'center', width: 140 },
  { prop: 'operate', label: '操作', align: 'center', formatter: ({ operate }) => OPERAT[operate]},
	{ prop: 'operator', label: '操作人帐号', align: 'center' },
	{ prop: 'operateName', label: '操作人姓名', align: 'center' },
	{ prop: 'companyName', label: '公司名称', align: 'center' },
	{ prop: 'remarks', label: '备注说明', align: 'center' },
];
export const CUSTOMER_COLUMNS = [
	{ prop: 'cardNo', label: '会员卡号', align: 'center' },
	{ prop: 'realName', label: '会员姓名', align: 'center' },
	{ prop: 'mobile', label: '注册手机号', align: 'center' },
];
export const PRODUCT_COLUMNS = [
	{ prop: 'serialNo', label: '产品编码', align: 'center' },
	{ prop: 'productName', label: '产品名称', align: 'center' },
	{ prop: 'specification', label: '规格', align: 'center' },
	{ prop: 'unit', label: '单位', align: 'center' },
	{ prop: 'retailPrice', label: '零售价', align: 'center' },
	{ prop: 'productPv', label: '产品pv', align: 'center' },
];

export const DETAIL_CHANGE_COLUMNS = [
	{ prop: 'couponNumber', label: '优惠券编号', align: 'center', width: 100 },
	{ prop: 'couponCode', label: '优惠码', align: 'center' },
	{ prop: 'realName', label: '顾客姓名', align: 'center' },
	{ prop: 'mobile', label: '手机号', align: 'center', width: 100 },
	{ prop: 'cardNo', label: '会员卡号', align: 'center', width: 140 },
	{ prop: 'memberType', label: '顾客身份', align: 'center', formatter: ({ memberType }) => COUPON_MANAGEMENT_MEMBERTYPE_STATUS[memberType] },
	{ prop: 'getTime', label: '领取时间', align: 'center', width: 140, formatter: ({ getTime }) => getTime ? getTime : '--' },
	{ prop: 'getType', label: '领取方式', align: 'center', formatter: ({ getType }) => (getType === 1 ? '系统发券' : '券码兑换') },
	{ prop: 'useTime', label: '使用时间', align: 'center', width: 140, formatter: ({ useTime }) => useTime ? useTime : '--' },
	{ prop: 'state', label: '单券状态', align: 'center', formatter: ({ state }) => COUPON_MANAGEMENT_STATE_STATUS[state] },
	{ prop: 'invalidReason', label: '作废原因', align: 'center' },
];
export const DETAIL_MEMBERTYPE = {
	1:'普通顾客',2:'优惠顾客',3:'云商',4:'微店（云+）',5:'店员',6:'子账号'
}
export const DATA_COLUMNS = [
	{ prop: 'realName', label: '顾客姓名', align: 'center' },
	{ prop: 'mobile', label: '手机号', align: 'center' },
	{ prop: 'cardNo', label: '会员卡号', align: 'center' },
	{ prop: 'memberType', label: '顾客身份', align: 'center', formatter: ({ memberType }) => DETAIL_MEMBERTYPE[memberType] },
	{ prop: 'getTime', label: '领取时间', align: 'center' },
	{ prop: 'getType', label: '获券方式', align: 'center', formatter: ({ getType }) => OBTAIN_COUPNE_WAY[getType]},
	{ prop: 'transferType', label: '转赠方式', align: 'center', formatter: ({ transferType }) => TURN_GIFT_WAY[transferType]},
	{ prop: 'code', label: '转赠门店', align: 'center' },
	{ prop: 'useTime', label: '使用时间', align: 'center' },
	{ prop: 'state', label: '单券状态', align: 'center', formatter: ({ state }) => COUPON_MANAGEMENT_STATE_STATUS[state] },
	{ prop: 'orderNo', label: '订单号', align: 'center',slot:'orderNo' },
	{ prop: 'orderAmount', label: '订单金额', align: 'center' },
	{ prop: '', label: '操作', align: 'center',slot:'operating' },
	{ prop: 'invalidReason', label: '作废原因', align: 'center',},
];
export const DATA_LIMIT_CUSTOMER = {
	1: '所有', 2: '顾客身份', 3: '顾客等级', 4: '导入'
}
export const DATA_STATUS_CUSTOMER = {
	1: '待审核', 2: '待开始', 3: '进行中', 4: '已失效', 5: '已禁用', 6: '已驳回', 7: '草稿'
}
export const DATA_STATUS_CUSTOMER_BTN = {
	1: '编辑', 2: '停用', 3: '停用', 5: '启用', 6: '编辑',
}
export const DATA_STATUS_BTN_USE_RANGE = {
	1: '全部产品', 2: '指定产品', 3: '指定不适用产品', 4: '指定产品分类', 5: '指定活动'
}
export const DATA_STATUS_TABLE_TITLE = {
	2: '可用产品明细',4: '可用产品分类', 5: '可用活动'
}
export const DATA_STATUS_TEXT_BTN = {
	1: '审核', 6: '删除'
}
export const DATA_STATUS_COUPONETYPE = {
	1: '立减券', 2: '满减券', 3: '叠加满减券'
}
export const DATA_STATUS_ISSTACKED = {
	0: '不可叠加', 1: '可叠加'
}
export const SUBMITORDERS = {
	couponCount:'券总量',
	grantCount:'已发放',
	grantPercent:'发放率',
	usedCount:'已使用',
	usePercent:'使用率',
	occupyCount:'占用中',
	notUsedCount:'未使用',
	expiredCount:'已失效',
	invalidCount:'已作废',
}
export const SUBMITORDERS_CODE = {
	couponCount:'券码总量',
	exchangeCount:'已兑换',
	exchangePercent:'兑换率',
	// usedCount:'已核销',
	// usePercent:'核销率',
}

const COUPON_MANAGEMENT_MEMBERTYPE_STATUS = {
	1: '普通顾客',
	2: '优惠顾客',
	3: '云商',
	4: '微店（云+）',
	5: '店员',
	6: '子账号',
}
export const DETAIL_CODE_CHANGE_COLUMNS = [
	{ prop: 'couponCode', label: '优惠码', align: 'center' },
	{ prop: 'isExchange', label: '此码是否已被兑换', width: 140, align: 'center', formatter: ({ isExchange }) => isExchange == 1 ? '未兑换' : '已兑换' },
	// { prop: 'couponNumber', label: '此码是否已占用', align: 'center' },
  { prop: 'state', label: '此码是否已核销', width: 140, align: 'center', formatter: ({ state }) => state === 2 ? '是' :'否'}, //  (DETAIL_CODE_COLUMNS_STATE[state])
	{ prop: 'endTime', label: '优惠券有效期', width: 280, align: 'center', formatter: ({ endTime, startTime }) => endTime ? formatDate(startTime) + '~' + formatDate(endTime) : '永久有效' },
	{ prop: 'faceValue', label: '优惠券面值', align: 'center' },
	{ prop: 'minAmount', label: '使用条件', align: 'center', formatter: ({ minAmount }) => minAmount ? minAmount : '不限制' },
]
export const CUSTOMER_CODE_CONFIG = {
	form: [
		{
			label: '是否已兑换',
			key: 'isExchange',
			type: 'select',
			value: '',
			placeholder: '请选择是否已兑换',
			options: [
				{ value: '', label: '全部' },
				{ value: '1', label: '未兑换' },
				{ value: '2', label: '已兑换' },
			]
		},
		{
			label: '是否已核销',
			key: 'state',
			type: 'select',
			value: '',
			placeholder: '请选择',
			options: [
				{ value: '', label: '全部' },
				{ value: 1, label: '未核销' },
				{ value: 2, label: '已核销' },
				// { value: '1', label: '未使用' },
				// { value: '2', label: '已使用' },
				// { value: '3', label: '已作废' },
			]
		},
	],
	buttonGroup: [
		{
			type: '',
			title: '重置',
			key: 'reset'
		},
		{
			type: 'primary',
			title: '搜索',
			key: 'search'
		}
	]
}
// let isReg = /[^\w\s]+/;
let isName = /[^\w\s\u4e00-\u9fa5]+/;
export const CHECK_PROMOTION_CODE = (rule, value, callback) => {
  if (value.trim() == "") {
    return callback(new Error('请填写优惠券编号'));
	} else if (value.length < 1 || value.length > 20) {
		return callback(new Error('优惠券编号长度为1~20'));
  } else if (isName.test(value)) {
		return callback(new Error('完美内部的优惠券编号,不支持特殊符号'));
	} else {
		return callback();
	}
};
export const CHECK_PROMOTION_NAME = (rule, value, callback) => {
	if (!value) {
		return callback(new Error('请填写优惠券名称'));
	} else if (value.length < 1 || value.length > 40) {
		return callback(new Error('优惠券名称长度1~40位字符'));
	} else if (isName.test(value)) {
		return callback(new Error('不支持特殊符号'));
	} else {
		return callback();
	}
};
export const ACTIVITY_COLUMNS = [
	{ prop: 'promotionCode', label: '活动编号', align: 'center' },
	{ prop: 'promotionName', label: '活动名称', align: 'center' },
]
export const PRODUCT_TYPE_COLUMNS = [
	{ prop: 'title', label: '分类名称', align: 'center'},
]

export const NOT_PRODUCT_COLUMNS = [
	{ prop: 'serialNo', label: '分产品编码名称', align: 'center'},
	{ prop: 'productName', label: '产品名称', align: 'center'},
	{ prop: 'specification', label: '规格', align: 'center'},
	{ prop: 'unit', label: '单位', align: 'center'},
	{ prop: 'retailPrice', label: '零售价', align: 'center'},
	{ prop: 'productPv', label: '产品pv', align: 'center'},
]
export const SERIALNOARY_COLUMNS = [
	{ prop: 'serialNo', label: '分产品编码名称', align: 'center'},
	{ prop: 'productName', label: '产品名称', align: 'center'},
	{ prop: 'specification', label: '规格', align: 'center'},
	{ prop: 'unit', label: '单位', align: 'center'},
	{ prop: 'retailPrice', label: '零售价', align: 'center'},
	{ prop: 'productPv', label: '产品pv', align: 'center'},
]
