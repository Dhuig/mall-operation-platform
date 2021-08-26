import { optionGenerator } from 'util';
// 换货单状态
export const ORDER_STATUS_KEY = {
	'all': '',
	'tobeReviewed': 1,
	'tobeReturned': 2,
	'tobeChecked': 3,
	'sending':4,
	'receiving': 5,
	'completed': 6,
	'cancelled': 7,
	
	// enterShipment录入发货
}

// 押货单列表页-换货单状态
export const ORDER_STATUS = {
	1: '待审核',
	2: '待退回',
	3: '待验货',
	4: '待发货',
	5: '待收货',
	6: '已完成',
	7: '已取消',
}

// 旧品处理方式
export const PRODUCT_DISPOSAL_TYPE = {
	1: '服务中心报废',
	2: '分公司报废',
	3: '退货中转仓',
}

// 换货处理方式
export const EXCHANGE_TYPE = {
	1: '先退后换',
	2: '秒换',
	3: '只换不退',
	4: '先换后退',
}

// 换货处理方式
export const PRODUCT_DISPOAL_TYPE = {
	1: '服务中心报废',
	2: '分公司报废',
	3: '退货中转仓',
}

// 分公司
export const SUBCOMPANY = [];


// 换货单类型
export const ORDER_SOURCE = {
	1:'服务中心换货',
	2:'运营后台换货'
}

export const ORDER_SOURCE_TYPE = [
	{
		value:1,
		name:'服务中心换货'
	},
	{
		value:2,
		name:'运营后台换货'
	},
]

// 日常使用时间
export const DAILY_USE_STATUS = {
	1:'早上',
	2:'中午',
	3:'晚上'
}
// 审核状态
export const AUDIT_STATUS = {
	0:'审核不通过',
	1:'审核通过',
}
// 问题发生状态
export const HAPPEN_STATUS= {
	1:'初次开封使用发现',
	2:'使用过程中发现'
}

export const REETURN_STATUS = {
	1:'服务中心报废',
	2:'自带',
	3:'邮寄'
}

// 问题发生状态
export const HAPPEN_TYPE = [
	{
		value:1,
		name:'初次开封使用发现'
	},
	{
		value:2,
		name:'使用过程中发现'
	}
]

// 退回方式
export const REETURN_TYPE = [
	{
		value:1,
		name:'服务中心报废'
	},
	{
		value:2,
		name:'自带'
	},
	{
		value:3,
		name:'邮寄'
	}
]

export const DELIVERTYPE = [
	{
		value:1,
		name:'顾客自提'
	},
	{
		value:2,
		name:'邮寄'
	},
]

// 日常使用时间
export const DAILY_USE_TYPE = [
	{
		value:1,
		name:'早上'
	},
	{
		value:2,
		name:'中午'
	},
	{
		value:3,
		name:'晚上'
	}
	
]

export const EXCHANGE_STATUS = [
	{
		value:1,
		name:'先退后换'
	},
	{
		value:2,
		name:'秒换'
	},
	{
		value:3,
		name:'只换不退'
	},
	{
		value:4,
		name:'先换后退'
	}
]

export const PRODUCT_DISPOSAL_STATUS = [
	{
		value:1,
		name:'服务中心报废'
	},
	{
		value:2,
		name:'分公司报废'
	},
	{
		value:3,
		name:'退货中转仓'
	},
]


export const RETURN_CHANGE_LIST_CONFIG = {
	form: [
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号',
    },
    {
      label: '换货单号',
      key: 'orderSn',
      type: 'input',
      value: '',
      placeholder: '请输入押货单号',
	},
	{
		label: '换货处理方式',
		key: 'exchangeType',
		type: 'select',
		value: '',
		placeholder: '请选择换货处理方式',
		options: optionGenerator(EXCHANGE_TYPE),
	},
	{
		label: '申请时间',
		key: 'registrationTime',
		type: 'datePicker',
		value: '',
		config: {
			type: 'daterange',
			rangeSeparator: '~',
			startPlaceholder: '开始日期',
			endPlaceholder: '结束日期',
			// pickerOptions:'dateRangePickerGenerator("最近一个月", 30)'
		}
	},
	{
		label: '旧品处理方式',
		key: 'productDisposalType',
		type: 'select',
		value: '',
		placeholder: '请选择旧品处理方式',
		options: optionGenerator(PRODUCT_DISPOSAL_TYPE),
	},	
	{
		label: '换货单类型',
		key: 'orderSource',
		type: 'select',
		value: '',
		placeholder: '请选择退货单类型',
		options: optionGenerator(ORDER_SOURCE),
	},
	{
		label: '分公司',
		key: 'companyCode',
		type: 'select',
		value: '',
		placeholder: '请输入分公司',
		options: optionGenerator(SUBCOMPANY),
	},
  ],
}

export const RETURN_CHANGE_LIST_COLUMNS = [
	{ 
		prop: 'storeCode', 
		label: '服务中心编号', 
		align: 'center' 
	},
	{ 
		prop: 'companyCode', 
		label: '分公司编号',
		align: 'center' 
	},
	{ 
		prop: 'orderSn', 
		label: '换货单号', 
    align: 'center',
    width: 180
	},
	{ 
		prop: 'createTime', 
		label: '申请日期', 
    align: 'center',
    width: 150
	},
	{ 
		prop: 'orderSource', 
		label: '类型', 
		align: 'center',
		formatter: ({ orderSource }) => {
			return orderSource in ORDER_SOURCE ? ORDER_SOURCE[orderSource] : '';
		},
	},
	{ 
		prop: 'orderStatus', 
		label: '处理状态', 
		align: 'center',
		formatter: ({ orderStatus }) => {
			return orderStatus in ORDER_STATUS ? ORDER_STATUS[orderStatus] : '';
		},
	},
	{ 
		prop: 'exchangeType', 
		label: '换货处理方式', 
		align: 'center',
		formatter: ({ exchangeType }) => {
			return exchangeType in EXCHANGE_TYPE ? EXCHANGE_TYPE[exchangeType] : '';
		},
	},
	{ 
		prop: 'reasonFirst', 
		label: '一级原因', 
		align: 'center',
		width: 150,
	},
	{ 
		prop: 'reasonSecond', 
		label: '二级原因', 
		align: 'center',
		width: 150,
	},
	// { 
	// 	prop: 'productDisposalType', 
	// 	label: '旧品处理方式', 
	// 	align: 'center',
	// 	formatter: ({ productDisposalType }) => {
	// 		return productDisposalType in PRODUCT_DISPOSAL_TYPE ? PRODUCT_DISPOSAL_TYPE[productDisposalType] : '';
	// 	},
	// },
];

// 新建押货换货单
export const DataKey = {
	storeCode:'',
	exchangeType:'',
	orderFileUrl:'',
	productDisposalType:'',
	reasonFirst:'',
	reasonFirstRemarks:'',
	reasonSecond:'',
	reasonSecondRemarks:'',
	productVoList:[]
}

// 新建换货单校验规则
export const RETURN_CHANGE_CREAT_RULE = {
	storeCode: [
		{ required: true, message: '请输入服务中心编号', trigger: 'blur' },
	],
	reasonFirst: [
		{ required: true, message: '请选择一级原因', trigger: 'change' },
	],
	reasonSecond: [
		{ required: true, message: '请选择二级原因', trigger: 'change' },
	],
	productDisposalType: [
		{ required: true, message: '请选择旧品处理方式', trigger: 'change' },
	],
	exchangeType:[
		{ required: true, message: '请选择换货处理方式', trigger: 'change' },
	],
	productCode:[{ required: true, min: 1, max: 20,message: '请输入产品编号', trigger: 'blur' }],
	productNum:[ 
		{ required: true, message: '请输入换货数量', trigger: 'blur' },
		{  pattern:/^\+?[1-9]\d{0,4}(\.\d*)?$/, message: '长度在5位的纯数字', trigger: 'blur' },
		{
			type: 'number',
			message: '不支持小数点',
			trigger: 'blur',
			transform(value) {
				if(value !== null && value !== '') {
					if (String(value).trim() === '' || Number(value) <= 0) {
						return false
					}else if (String(value).indexOf('.') !== -1 || String(value).indexOf('-') !== -1) {
						return false
					}else{
						return Number(value)
					}
				}else {
					return null
				}
			}
		}
	],
	productProductionDate:[ 
		{ required: true, message: '请输入生产日期/有效期', trigger: 'blur' },
		{ pattern:/^[0-9]{1,8}$/, message: '请输入正确生产日期', trigger: 'blur' },
	],
	productBatch:[
		{ required: true, message: '请输入批次', trigger: 'blur' },
		{ pattern:/^(\d{5}|\d{6})$/, message: '支持5位或6位纯数字', trigger: 'blur' },
	],
	productSn:[
		{ min: 1, max: 16, message: '支持1-16位数字或字母组合', trigger: 'blur' },
	],
	productProblemDesc:[ 
		{ required: true, message: '请输入详细问题描述', trigger: 'blur' },
		{ min: 1, max: 60, message: '支持1~60个字符', trigger: 'blur' },
	],
}

// 审核换货单校验规则
export const RETURN_CHANGE_ADUIT_RULE = {
	// reasonFirstRemarks: [
	// 	{ required: true, message: '请输入一级原因备注', trigger: 'blur' },
	// ],
	reasonFirst: [
		{ required: true, message: '请选择一级原因', trigger: 'change' }
	],
	reasonSecond: [
		{ required: true, message: '请选择二级原因', trigger: 'change' }
	],
	// reasonSecondRemarks: [
	// 	{ required: true, message: '请输入二级原因备注', trigger: 'blur' },
	// ],
	exchangeType: [
		{ required: true, message: '请选择确认处理方式', trigger: 'change' }
	],
	// productDisposalType: [
	// 	{ required: true, message: '请选择旧品处理方式', trigger: 'change' }
	// ],
	auditStatus: [
		{ required: true, message: '请选择审批结果', trigger: 'change' }
	],
	returnInfo: [
		{ required: true, message: '请输入押货退货信息', trigger: 'blur' },
	],
}

// 退回换货单校验规则
// export const RETURN_CHANGE_RETURN_RULE = {
// 	returnType: [
// 		{ required: true, message: '请选择退回方式', trigger: 'change' }
// 	],
// 	expressCompany: [{ validator: expressCompanyValidate}],
// 	expressProofUrl:  [{ validator: expressProofUrlyValidate}],
// 	expressNo:  [{ validator: expressNoValidate}],
// }

// 验货
export const RETURN_CHANGE_CHECK_RULE = {
	inspectStatus: [
		{ required: true, message: '请选择退回方式', trigger: 'change' }
	],
	expressSubsidy: [
		{ required: true, message: '请输入运费补贴', trigger: 'blur' }
	],
}

//发货
export const RETURN_CHANGE_DELIVER_RULE = {
	deliverType: [
		{ required: true, message: '请选择交付方式', trigger: 'change' }
	],
	expressCompany: [
		{ required: true, message: '请填写新品配送物流公司', trigger: 'change' }
	],
	expressNo: [
		{ required: true, message: '请填写物流单号', trigger: 'change' }
	],
	deliverTime: [
		{ required: true, message: '请选择发货时间', trigger: 'change' }
	],
}

