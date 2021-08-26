
import { formatDate } from 'util/formValidation';
import { optionGenerator } from 'util';

export const GRANT_TYPE_ARR = {
	1: '即时派发',
	2: '定时派发',
}
export const LIMIT_STORE_TYPE = {
	1:'限制门店使用',
	0:'不限制门店使用'
}
export const COUPON_SEARCH_LIST_CONFIG = {
	form: [
		{
			label: '优惠券编号',
			key: 'couponNumber',
			type: 'input',
			value: '',
			placeholder: '请输入优惠券名称',
		},
		{
			label: '优惠券名称',
			key: 'couponName',
			type: 'input',
			value: '',
			placeholder: '请输入优惠券名称',
		},
		{
			label: '派发创建时间',
			key: 'createTime',
			type: 'datePicker',
			value: '',
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期'
			}
		},
		{
			label: '派发时间',
			key: 'grantTime',
			type: 'datePicker',
			value: '',
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期'
			}
		},
		// {
		// 	label: '派发对象',
		// 	key: 'grantTarget',
		// 	type: 'select',
		// 	value: '',
		// 	placeholder: '请输入优惠券名称',
		// 	options:[
		// 		{label:'所有顾客',value:1},
		// 		{label:'顾客身份',value:2},
		// 		{label:'自由导入',value:4},
		// 	]
		// },
		{
			label: '派发方式',
			key: 'grantType',
			type: 'select',
			value: '',
			options:optionGenerator(GRANT_TYPE_ARR),
			placeholder: '请选择',
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

export const DONATE_STORE_CONFIG = {
	form: [
		{
			label: '门店编号',
			key: 'code',
			type: 'input',
			value: '',
			placeholder: '请输入门店编号',
		},
		{
			label: '管理员卡号',
			key: 'shopkeeperNo',
			type: 'input',
			value: '',
			placeholder: '请输入管理员卡号',
		},
		{
			label: '负责人卡号',
			key: 'leaderNo',
			type: 'input',
			value: '',
			placeholder: '请输入负责人卡号',
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

const coupone_status = {
	'6':'未转赠',
	'1':'未使用',
	'2':'已使用',
	'3':'已作废',
	'4':'已失效',
	'5':'占用中',
}

const coupone_transferType = {
	1:'指定用户',
	2:'券码兑换',
	3:'扫码领取',
	4:'转发领取',
}
export const DONATE_COUPONE_DETAIL_CONFIG = {
	form: [
		{
			label: '门店编号',
			key: 'code',
			type: 'input',
			value: '',
			placeholder: '请输入门店编号',
			maxlength:20
		},
		{
			label: '优惠券状态',
			key: 'state',
			type: 'select',
			value: '',
			placeholder: '请选择',
			options:optionGenerator(coupone_status)
		},
		{
			label: '转赠方式',
			key: 'transferType',
			type: 'select',
			value: '',
			placeholder: '请选择',
			options: optionGenerator(coupone_transferType)
		},
		{
			label: '搜索会员卡',
			key: 'cardNo',
			type: 'input',
			value: '',
			placeholder: '搜索会员卡号',
			maxlength:20
		},
		{
			label: '搜索姓名',
			key: 'realName',
			type: 'input',
			value: '',
			placeholder: '搜索会员姓名',
			maxlength:20
		},
		{
			label: '搜索手机号',
			key: 'mobile',
			type: 'input',
			value: '',
			placeholder: '搜索会员手机号',
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
export const DONATE_STORE_COLUMNS = [
	{ prop: 'shopkeeperNo', label: '管理员卡号', align: 'center'},
	{ prop: 'shopkeeperName', label: '管理员姓名', align: 'center' },
	{ prop: 'leaderNo', label: '负责人卡号', align: 'center' },
	{ prop: 'leaderName', label: '负责人姓名', align: 'center' },
	{ prop: 'code', label: '门店编号', align: 'center' },
	{ prop: 'storeName', label: '门店名称', align: 'center' },
	{ prop: 'grantCount', label: '原派发数量', align: 'center' },
	{ prop: 'transferCount', label: '已转赠数量', align: 'center' },
	{ prop: 'canCount', label: '可转赠数量', align: 'center' },
	{ prop: 'cancelCount', label: '已撤销数量', align: 'center' },
]

export const DONATE_COUPONE_DETAIL_COLUMNS = [
	{ prop: 'code', label: '门店编号', align: 'center'},
	{ prop: 'storeName', label: '门店名称', align: 'center' },
	{ prop: 'state', label: '优惠券券状态', align: 'center',width:140,
		formatter:({state})=>coupone_status[state] 
	},
	{ prop: 'realName', label: '会员姓名', align: 'center' },
	{ prop: 'mobile', label: '手机号', align: 'center' },
	{ prop: 'cardNo', label: '会员卡号', align: 'center' },
	{ prop: 'memberType', label: '顾客身份', align: 'center' },
	{ prop: 'getTime', label: '领取时间', align: 'center',width:140 },
	{ prop: 'transferType', label: '转赠方式', align: 'center',formatter:({transferType})=>coupone_transferType[transferType]  },
	{ prop: 'useTime', label: '使用时间', align: 'center' },
	{ prop: 'orderNo', label: '订单号', align: 'center' , slot: true},
	{ prop: 'orderAmount', label: '订单金额', align: 'center' },
]

export const DONATE_BASIS_COLUMNS = [
	{ prop: 'createTime', label: '操作时间', align: 'center',width:160},
	{ prop: 'operate', label: '操作', align: 'center',width:160,
		formatter:({operate})=> HISTORY_COLUMN[operate]
	},
	{ prop: 'operator', label: '操作人帐号', align: 'center' },
	{ prop: 'operateName', label: '操作人姓名', align: 'center' },
	{ prop: 'companyName', label: '所属部门', align: 'center' },
	{ prop: 'remarks', label: '备注说明', align: 'center' },
	{ prop: 'enclosures', label: '附件', align: 'center' , slot:'enclosures',width:200},
]
export const TAB_PANE = [
	{ name: 'all', label: '全部' },
	{ name: 'pending', label: '待审核' },
	{ name: 'handOut', label: '派发中' },
	{ name: 'processing', label: '已完成' },
	{ name: 'rejected', label: '已驳回' },
	{ name: 'stop', label: '已停止' },
	{ name: 'draft', label: '草稿' },
]

export const TAB_PANE_STATUS = {
	'all': null,
	'pending': 1,
	'handOut': 2,
	'processing': 3,
	'rejected': 4,
	'stop': 6,
	'draft': 5,
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
	handOut: {
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
	rejected: {
		loading: false,
		data: [],
		pagination: {
			total: 0,
			currentPage: 1,
			pageSize: 10,
		},
	},
	stop: {
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

export const MESSAGE_DETAIL_STATUS = {
	1: '待审核',
	2: '待生效',
	3: '生效中',
	4: '已失效',
	5: '已禁用',
	6: '已驳回',
	7: '草稿',
}

export const DETAIL_STATUS = {
	1: '待审核',
	2: '派发中',
	3: '已完成',
	4: '已驳回',
	6: '已停止',
	5: '草稿',
}
let useRangeArr = {
	1: '所有产品',
	2: '指定产品',
	3: '指定不适用产品',
	4: '指定产品分类',
	5: '指定活动',
}
export const grantTargetArr = {
	1: '全部顾客',
	2: '按照顾客身份',
}
let stateArr = {
	1: '待审核',
	2: '派发中',
	3: '已完成',
	4: '已驳回',
	6: '已停止',
	5: '草稿'
}
export const CHANGE_COLUMNS = [
	{ prop: 'createTime', label: '创建时间', align: 'center', width: 160 },
	{ prop: 'couponNumber', label: '优惠券编号', align: 'center' },
	{ prop: 'couponName', label: '优惠券名称', align: 'center' },
	{ prop: 'useRange', label: '使用范围', align: 'center', formatter: ({ useRange }) => useRangeArr[useRange] },
	{ prop: 'minAmount', label: '使用规则', align: 'center', formatter: ({ minAmount }) =>  minAmount ? `满￥${minAmount} 可用` : '无限额'  },
	// { prop: 'grantTarget', label: '派发对象', align: 'center', formatter: ({ grantTarget }) => grantTargetArr[grantTarget] },
	{ prop: 'state', label: '状态', align: 'center', formatter: ({ state }) => stateArr[state] },
	{ prop: 'grantType', label: '派发方式', align: 'center', width: 120, formatter: ({ grantType }) => GRANT_TYPE_ARR[grantType] },
	{ prop: 'fixedTime', label: '派发时间', align: 'center',width: 140,
		formatter: ({ fixedTime }) => fixedTime?formatDate(fixedTime):'即时派发'
	},
];

export const CREATE_HAND_COLUMNS = [
	{ prop: 'couponNumber', label: '优惠券编号', align: 'center' },
	{ prop: 'couponName', label: '优惠券名称', align: 'center' },
	{ prop: 'useRange', label: '使用范围', align: 'center', formatter: ({ useRange }) => useRangeArr[useRange] },
	{ prop: 'faceValue', label: '面值', align: 'center' },
	{ prop: 'minAmount', label: '使用规则', align: 'center', formatter: ({ minAmount }) => minAmount ? `满￥${minAmount} 可用` : '无限额' },
	{ prop: 'startTime', label: '有效时间', align: 'center', width: 150 , formatter: ({ startTime, endTime }) => endTime ? startTime + '-' + endTime : '不限制'},
	{ prop: 'couponState', label: '状态', align: 'center', formatter: ({ couponState }) => MESSAGE_DETAIL_STATUS[couponState] },
	{ prop: 'couponCount', label: '券总量', align: 'center', formatter: ({ couponCount }) => couponCount == '-1' ? '不限量' : couponCount },
	{ prop: 'grantCount', label: '已发放', align: 'center' },
	{ prop: 'couponCount', label: '剩余量', align: 'center', formatter: ({ couponCount, grantCount }) => couponCount === '-1' ? '-' : couponCount * 1 - grantCount * 1 },
];

export const LIMIT_RADIO = [
	{
		label: 1,
		name: "所有顾客"
	},
	{
		label: 2,
		name: "按顾客身份"
	},
	// {
	// 	label: 3,
	// 	name: "按顾客等级"
	// },
	{
		label: 4,
		name: "自由导入"
	},
]

export const CUSTOMER_IDENTITY_ARR = [
	{
		label: 1,
		name: "云商"
	},
	{
		label: 2,
		name: "微店"
	},
	{
		label: 3,
		name: "优惠顾客"
	},
	{
		label: 4,
		name: "普通顾客"
	},
	{
		label: 5,
		name: "游客"
	},
]

export const CUSTOMER_LEVEL = [
	{
		label: 1,
		name: "一星"
	},
	{
		label: 2,
		name: "客户代表"
	},
	{
		label: 3,
		name: "初级客户经理"
	},
	{
		label: 4,
		name: "中级客户经理"
	},
	{
		label: 5,
		name: "客户总监"
	},
	{
		label: 6,
		name: "高级客户总监"
	},
	{
		label: 7,
		name: "资深客户总监"
	},
	{
		label: 8,
		name: "客户总经理"
	},
]

export const IMPORT_FORM_COLUMNS = [
	{ prop: 'vipCardNum', label: '会员卡号', align: 'center' },
	{ prop: 'vipName', label: '会员姓名', align: 'center' },
	{ prop: 'vipPhoneNumber', label: '注册手机号', align: 'center' },
	{ prop: "delete", label: "操作", align: "center" }
]
let useRangeArrTwo = {
	1: '所有产品',
	2: '指定产品',
	3: '指定不适用产品',
	4: '指定产品分类',
	5: '指定活动'
}
let couponTypeArr = {
	1: '立减券',
	2: '满减券',
	3: '叠加满减券',
}
export const COUPON_TYPE = { 1: '立减券', 2: '满减券', 3: '叠加满减券' }
export const COUPON_GRAN_TYPE = { 1: '即时派发', 2: '定时派发', 3: '每日循环派发',4:'每月定时派发' }
export const COUPON_COLUMN = [
	{ prop: 'couponNumber', label: '优惠券编号', align: 'center' },
	{ prop: 'couponName', label: '优惠券名称', align: 'center' },
	{ prop: 'useRange', label: '优惠券范围', align: 'center', formatter: ({ useRange }) => useRangeArrTwo[useRange] },
	{ prop: "faceValue", label: "面值", align: "center" },
	{ prop: 'minAmount', label: '使用规则', align: 'center', formatter: ({ minAmount }) =>minAmount ? `满￥${minAmount} 可用` : '无限额'},
	{ prop: 'couponType', label: '类型', align: 'center', formatter: ({ couponType }) => couponTypeArr[couponType] },
	{ prop: "endTime", label: "有效时间", align: "center", width: 280, formatter: ({ startTime, endTime }) => endTime ? startTime + '-' + endTime : '不限制' }
]

export const HISTORY_COLUMN = {
	1: '创建优惠券派发',
	3: '审核通过',
	4: '审核不通过',
	5: '停止',
}

export const HISTORY_COLUMN_LIST = [
	{ prop: 'memberNo', label: '顾客编号', align: 'center' },
	{ prop: 'cardNo', label: '会员卡号', align: 'center' },
	{ prop: 'realName', label: '会员姓名', align: 'center' },
	{ prop: 'everyCount', label: '派发数量', align: 'center' },
	{ prop: 'mobile', label: '注册手机号', align: 'center' },
]