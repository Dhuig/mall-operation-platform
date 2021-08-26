
import { formatDate } from 'util/formValidation';
export const COUPON_SEARCH_LIST_CONFIG = {
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
		{
			label: '派发对象',
			key: 'grantTarget',
			type: 'select',
			value: '',
			placeholder: '请输入优惠券名称',
			options:[
				{label:'所有顾客',value:1},
				{label:'顾客身份',value:2},
				{label:'自由导入',value:4},
			]
		},
		{
			label: '派发方式',
			key: 'grantType',
			type: 'select',
			value: '',
			placeholder: '请输入优惠券名称',
			options:[
				{label:'即时派发',value:'1'},
				{label:'定时派发',value:'2'},
				{label:'每日循环派发',value:'3'},
				{label:'每月定时派发',value:'4'},
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
	1: '所有顾客',
	2: '顾客身份',
	3: '等级',
	4: '自由导入',
}

export const grantTypeArr = {
	1: '即时派发',
	2: '定时派发',
	3: '每日循环派发',
	4: '每月循环派发',
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
	{ prop: 'grantTarget', label: '派发对象', align: 'center', formatter: ({ grantTarget }) => grantTargetArr[grantTarget] },
	{ prop: 'grantType', label: '派发方式', align: 'center', width: 120, formatter: ({ grantType }) => grantTypeArr[grantType] },
	{ prop: 'state', label: '状态', align: 'center', formatter: ({ state }) => stateArr[state] },
	{ prop: 'fixedTime', label: '派发时间', align: 'center',width: 280,
		formatter: ({ grantType,fixedTime,grantStartTime,grantEndTime }) => {
			if(grantType==1){
				return '优惠券审核通过后将会即时派发'
			}else if(grantType==2){
				return formatDate(fixedTime)
			}else{
				return grantStartTime?formatDate(grantStartTime)+'至'+formatDate(grantEndTime):'--'
			}
		} 
	},
	{ prop: 'fixedTime', label: '定时规则', align: 'center',width: 160,
		formatter: ({ grantType,fixedTime}) => {
			if(grantType==1){
				return '即时派发'
			}else if(grantType==2){
				return formatDate(fixedTime)
			}else if(grantType==3){
				return '每10分钟'
			}else {
				return `每${parseInt(formatDate(fixedTime).substring(8, 10))}日${formatDate(fixedTime).split(' ')[1]}`
			}
		} 
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