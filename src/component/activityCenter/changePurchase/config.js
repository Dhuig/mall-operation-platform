
// import {genCurrentMonthFirstAndLastDay} from "util/index.js"
export const MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG = {
	form: [
		{
			label: '换购方案名称',
			key: 'promotionName',
			type: 'input',
			value: '',
			placeholder: '请输入换购方案名称',
		},
		{
			label: '换购方案编号',
			key: 'promotionCode',
			type: 'input',
			value: '',
			placeholder: '请输入换购方案编号',
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
			label: '换购有效期',
			key: 'periodTime',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期'
			}
		}
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
// 限购总数量
export const CHANGE_LIMITNUMBER = {
	'-2': '按需导入', '-1': '不限制'
}
export const CHANGE_COLUMNS = [
	{ prop: 'promotionCode', label: '换购方案编号', align: 'center' },
	{ prop: 'promotionName', label: '换购方案名称', align: 'center' },
	{ prop: 'startTime', label: '开始时间', align: 'center', width: 160 },
	{
		prop: 'endTime', label: '结束时间', align: 'center', width: 160,
		formatter: ({ endTime }) => endTime || '不限时'
	},
	{
		prop: 'limitNumber', label: '限购数量', align: 'center', width: 80,
		formatter: ({ limitNumber }) => limitNumber > 0 ? limitNumber : CHANGE_LIMITNUMBER[limitNumber]
	},
	{
		prop: 'promotionState', label: '状态', align: 'center',
		formatter: ({ promotionState }) => MESSAGE_DETAIL_STATUS[promotionState]
	},
	{ prop: 'createTime', label: '创建时间', align: 'center', width: 160 },
	{ prop: 'updateTime', label: '最后编辑时间', align: 'center', width: 160 },
];
export const MESSAGE_DETAIL_STATUS = {
	'': '全部活动',
	1: '待审核',
	2: '待开始',
	3: '进行中',
	4: '已结束',
	5: '已驳回',
	6: '草稿',
}
export const TAB_PANE = [
	{ name: 'all', label: '全部活动' },
	{ name: 'pending', label: '待审核' },
	{ name: 'tostart', label: '待开始' },
	{ name: 'processing', label: '进行中' },
	{ name: 'over', label: '已结束' },
	{ name: 'rejected', label: '已驳回' },
	{ name: 'draft', label: '草稿' },
]
export const GET_STATUS = {
	'all': null,
	'pending': 1,
	'tostart': 2,
	'processing': 3,
	'over': 4,
	'rejected': 5,
	'draft': 6,
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
	// { value: 3, label: '按照顾客等级' },
	{ value: 4, label: '自由导入' },
]
export const ADD_COLUMNS = [
	{ prop: 'cardNo', label: '会员卡号', align: 'center' },
	{ prop: 'realName', label: '顾客名称', align: 'center' },
]


export const DATA_CONFIG = {
	form: [
		{
			label: '搜索时间',
			key: 'searchtime',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期'
			}
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
export const PRODUCT_CONFIG = {
	form: [
		{
			label: '搜索产品',
			key: 'product',
			type: 'input',
			value: '',
			placeholder: '搜索产品编号或名称'
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
			label: '编辑时间',
			key: 'eidtTime',
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
			label: '会员卡号',
			key: 'cardNo',
			type: 'input',
			value: '',
			placeholder: '请输入会员卡号'
		},
		{
			label: '会员姓名',
			key: 'realName',
			type: 'input',
			value: '',
			placeholder: '请输入会员姓名'
		},
		{
			label: '注册手机号',
			key: 'mobile',
			type: 'input',
			value: '',
			placeholder: '请输入注册手机号'
		},
		{
			label: '产品编码',
			key: 'serialNo',
			type: 'input',
			value: '',
			placeholder: '请输入产品编码'
		},
		{
			label: '已购数量',
			key: 'purchasedCount',
			type: 'input',
			value: '',
			placeholder: '请输入已购数量'
		},
		{
			label: '参与状态',
			key: 'memberState',
			type: 'select',
			value: '',
			options: [
				{ value: 2, label: '已禁用' },
				{ value: 1, label: '已启用' }
			],
			placeholder: '请选择'
		},
		{
			label: '可购数量',
			key: 'totalCount',
			type: 'input',
			value: '',
			placeholder: '请输入可购数量'
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
	{ prop: 'serialNo', label: '产品编号', align: 'left', },
	{ prop: 'productName', label: '产品名称', align: 'left', },
	{ prop: 'specification', label: '规格', align: 'left', },
	{ prop: 'unit', label: '单位', align: 'left', },
	{ prop: 'retailPrice', label: '零售价', align: 'left', },
	// { prop: 'originalPrice', label: '原价', align: 'left', },
	{ prop: 'productPv', label: '产品PV', align: 'left', },
];
let OPERATING_COLUMNS_OBJ = {
	1: '创建活动', 3: '审核通过', 4: '审核不通过', 5: '停止活动'
}
export const OPERATING_COLUMNS = [
	{ prop: 'createTime', label: '操作时间', align: 'center' },
	{ prop: 'operate', label: '操作', align: 'center', formatter: ({ operate }) => OPERATING_COLUMNS_OBJ[operate] },
	{ prop: 'operator', label: '操作人帐号', align: 'center' },
	{ prop: 'operateName', label: '操作人姓名', align: 'center' },
	{ prop: 'companyName', label: '所属部门', align: 'center' },
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
	{ prop: 'specification', label: '规格', align: 'center', formatter: ({ specification }) => specification || '--' },
	{ prop: 'unit', label: '单位', align: 'center', formatter: ({ unit }) => unit || '--' },
	{ prop: 'retailPrice', label: '零售价', align: 'center' },
	{ prop: 'originalPrice', label: '原价', align: 'center' },
	{ prop: 'productPv', label: '产品pv', align: 'center' },
	{ prop: 'productStatus', label: '产品上架状态', align: 'center', formatter: ({ productStatus }) => productStatus == 7 ? '上架' : '下架' },
];
export const DETAIL_CHANGE_COLUMNS = [
	{ prop: 'cardNo', label: '会员卡号', align: 'center' },
	{ prop: 'realName', label: '会员名称', align: 'center' },
	{ prop: 'mobile', label: '会员手机号', align: 'center' },
];
export const DATA_COLUMNS = [
	{ prop: 'logDate', label: '日期', align: 'center' },
	// { prop: 'pageViews', label: '活动页面访问数', align: 'center', width: 140 },
	{ prop: 'submitOrders', label: '提交订单数', align: 'center' },
	{ prop: 'payOrders', label: '付款订单数', align: 'center' },
	{ prop: 'overtimeOrders', label: '支付超时订单', align: 'center', width: 140 },
	// { prop: 'visitMembers', label: '访问活动顾客数', align: 'center', width: 140 },
	{ prop: 'submitMembers', label: '下单顾客数', align: 'center' },
	{ prop: 'payMembers', label: '支付顾客数', align: 'center' },
	{ prop: 'productCount', label: '产品总销量', align: 'center' },
	{ prop: 'paymentAmount', label: '活动总金额', align: 'center' },
];
export const DATA_LIMIT_CUSTOMER = {
	1: '所有顾客', 2: '顾客身份', 3: '顾客等级', 4: '自由导入'
}
export const DATA_STATUS_CUSTOMER = {
	1: '待审核', 2: '待开始', 3: '进行中', 4: '已结束', 5: '已驳回', 6: '草稿'
}
export const SUBMITORDERS = {
	// pageViews: '资格购页面访问数',
	submitOrders: '提交订单数',
	payOrders: '付款订单数',
	overtimeOrders: '支付超时订单数',
	// visitMembers: '访问资格购顾客数',
	submitMembers: '下单顾客数',
	payMembers: '支付顾客数',
	productCount: '产品总销量',
	paymentAmount: '活动总金额',
}

// 活动顾客 查询编辑记录
export const CUSTOMER_RECORD = {
	form: [
		{
			label: '编辑时间',
			key: 'eidtTime',
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
			label: '会员卡号',
			key: 'cardNo',
			type: 'input',
			value: '',
			placeholder: '请输入会员卡号'
		},
		{
			label: '会员姓名',
			key: 'realName',
			type: 'input',
			value: '',
			placeholder: '请输入会员姓名'
		},
		{
			label: '注册手机号',
			key: 'mobile',
			type: 'input',
			value: '',
			placeholder: '请输入注册手机号'
		},
		{
			label: '产品编码',
			key: 'serialNo',
			type: 'input',
			value: '',
			placeholder: '请输入产品编码'
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


// 活动顾客 编辑记录
export const RECORD_COLUMNS = [
	{ prop: 'createTime', label: '编辑时间', align: 'center', width: 140 },
	{ prop: 'cardNo', label: '会员卡号', align: 'center' },
	{ prop: 'realName', label: '会员姓名', align: 'center' },
	{ prop: 'mobile', label: '注册手机号', align: 'center', width: 140 },
	{ prop: 'serialNo', label: '产品编码', align: 'center' },
	{ prop: 'oldCount', label: '原可购数量', align: 'center' },
	{ prop: 'newCount', label: '编辑后可购数量', align: 'center' },
	{ prop: 'changeCount', label: '变化量', align: 'center' },
];

// let isReg = /[^\w\s]+/;
let isName = /[^\w\s\u4e00-\u9fa5]+/;
export const CHECK_PROMOTION_CODE = (rule, value, callback) => {
  if (value.trim() == "") {
		return callback(new Error('请填写换购编号'));
	} else if (value.length <= 1 && value.length > 20) {
		return callback(new Error('换购编号长度为1~20'));
  } else if (isName.test(value)) {
		return callback(new Error('完美内部的换购编号,不支持特殊符号'));
	} else {
		callback()
	}
};
export const CHECK_PROMOTION_NAME = (rule, value, callback) => {
	if (!value) {
		return callback(new Error('请填写方案名称'));
	} else if (value.length <= 1 && value.length > 40) {
		return callback(new Error('换购方案名称长度1~40位字符'));
	} else if (isName.test(value)) {
		return callback(new Error('不支持特殊符号'));
	} else {
		callback()
	}
};
