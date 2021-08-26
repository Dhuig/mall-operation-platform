import { optionGenerator } from 'util';

export const ORDER_STATUS_KEY = {
	'all': '',
	'audited': 1,
	'returned': 2,
	'examined': 3,
	'finished': 4,
	'canceled': 5
}

// 退货单类型
export const RETURNTYPE = {
	'1':'服务中心退货',
	'2':'运营后台退货'
}

export const RETURNTYPE_TYPE = [
	{
		value:1,
		name:'服务中心退货'
	},
	{
		value:2,
		name:'运营后台退货'
	},
]

// 退货单标识
export const RETURNTAG = {
	'1':'普通押货',
	'2':'套装组合',
	'3':'套装拆分',
	'4':'押货修改'
}

export const RETURNTAG_TYPE = [
	{
		value:'',
		name:'全部'
	},
	{
		value:1,
		name:'普通押货'
	},
	{
		value:2,
		name:'套装组合'
	},
	{
		value:3,
		name:'套装拆分'
	},
	{
		value:4,
		name:'押货修改'
	}
]

// 处理状态
export const HANDLETYPE = {
	'1':'待审核',
	'2':'待退回',
	'3':'待验货',
	'4':'已完成',
	'5':'已取消'
}

// 分公司
export const SUBCOMPANY = [];

// 详情
// 退货单状态
export const ORDER_STATUS = {
	1: '待审核',
	2: '待退回',
	3: '待验货',
	4: '已完成',
	5: '已取消',
}

// 退货单类型
export const ORDER_SOURCE = {
	1: '待审核',
	2: '待退回',
	3: '待验货',
	4: '已完成',
	5: '已取消',
}

// 退货单类型orderMark
export const ORDER_MARK = {
	1: '普通押货',
	2: '套装组合',
	3: '套装拆分',
	4: '押货修改'
}

// 审批意见
export const AUDIT_STATUS = {
	0: '审核不通过',
	1: '审核通过',
}

// 退回方式
export const RETURN_TYPE = {
	1: '自带',
	2: '邮寄',
}

// 验货意见
export const INSPECT_STATUS = {
	0: '不通过',
	1: '通过',
}


export const EXCHANGE_LIST_CONFIG = {
	form: [
		{
			label: '服务中心编号',
			key: 'storeCode',
			type: 'input',
			value: '',
			placeholder: '请输入服务中心编号',
		},
		{
			label: '退货单号',
			key: 'orderSn',
			type: 'input',
			value: '',
			placeholder: '请输入押货单号',
		},
		{
			label: '分公司',
			key: 'companyCode',
			type: 'select',
			value: '',
			placeholder: '请输入分公司',
			options: optionGenerator(SUBCOMPANY),
		},
		{
			label: '申请时间',
			key: 'time',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期'
			}
		},
		// {
		// 	label: '处理状态',
		// 	key: 'orderStatus',
		// 	type: 'select',
		// 	value: '',
		// 	placeholder: '请选择处理状态',
		// 	options: optionGenerator(HANDLETYPE),
		// },
		{
			label: '退货标识',
			key: 'orderMark',
			type: 'select',
			value: '',
			placeholder: '请选择退货标识',
			options: optionGenerator(RETURNTAG),
		},
		{
			label: '退货单类型',
			key: 'orderSource',
			type: 'select',
			value: '',
			placeholder: '请选择退货单类型',
			options:  optionGenerator(RETURNTYPE),
		},
  ],
}

export const PRODUCT_COLUMNS = [
	{ prop: 'companyCode', label: '分公司编号', align: 'center' },
  { prop: 'storeCode', label: '服务中心编号', align: 'center' },
  { prop: 'orderSn', label: '退货单号', align: 'center' },
  { prop: 'createTime',
	label: '申请日期',
	align: 'center',
},
  { prop: 'orderReturnAmount', label: '退货金额合计', align: 'center' },
  { prop: 'orderSource',
	label: '退货单类型',
	align: 'center',
	formatter: ({ orderSource }) => {
		return orderSource in RETURNTYPE ? RETURNTYPE[orderSource] : '';
	}
},
  { prop: 'orderStatus',
	label: '处理状态',
	align: 'center',
	formatter: ({ orderStatus }) => {
		return orderStatus in HANDLETYPE ? HANDLETYPE[orderStatus] : '';
	}
 },
  { prop: 'orderMark',
	label: '退货标识',
	align: 'center',
	formatter: ({ orderMark }) => {
		return orderMark in RETURNTAG ? RETURNTAG[orderMark] : '';
	}
},
];

// 新建押货退货单
export const DataKey = {
	invtMortgageReturnOrderProductVOList: [
		{
			productCode: "",
			productNum: 0,
			productRemarks: ""
		}
	],
		invtMortgageReturnOrderVO: {
			orderMark: 0,
			reasonFirst: "",
			reasonFirstRemarks: "",
			reasonSecond: "",
			reasonSecondRemarks: "",
			returnAddress: "",
			storeCode: ""
		}
}

// 新建用户检验规则
export const RETURN_EXCHANGE_CREAT_RULE = {
	'invtMortgageReturnOrderVO.storeCode': [
		{ required: true, message: '请输入服务中心编号', trigger: 'blur' },
		{ min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
	],
	'invtMortgageReturnOrderVO.reasonFirst': [
		{ required: true, message: '请选择状态', trigger: 'change' }
	],
	'invtMortgageReturnOrderVO.reasonSecond': [
		{ required: true, message: '请选择状态', trigger: 'change' }
	],
}

// 审核校验规则
export const RETURN_EXCHANGE_ADUIT_RULE = {
	// reasonFirst: [
	// 	{ required: true, message: '请选择', trigger: 'change' }
	// ],
	// reasonSecond: [
	// 	{ required: true, message: '请选择二级原因', trigger: 'change' }
	// ],
	// reasonFirstRemarks: [
	// 	{ required: true, message: '请输入一级原因备注', trigger: 'blur' }
	// ],
	// reasonSecondRemarks: [
	// 	{ required: true, message: '请输入二级原因备注', trigger: 'blur' }
	// ],
	auditStatus: [
		{ required: true, message: '请选择审核结果', trigger: 'change' }
	],
	returnInfo: [
		{ required: true, message: '请输入退货地址信息', trigger: 'blur' }
	],
}

// 退回校验规则
export const RETURN_EXCHANGE_RETURN_RULE = {
	// expressNo: [
	// 	{ required: true, message: '请输入运单号', trigger: 'blur' }
	// ],
	returnType: [
		{ required: true, message: '请选择退回方式', trigger: 'change' }
	],
	// expressCompany: [
	// 	{ required: true, message: '请输入物流公司', trigger: 'blur' }
	// ],
	// expressFreightProof: [
	// 	{ required: true, message: '请上传快递凭证', trigger: 'blur' }
	// ],
}

// 验货校验规则
export const RETURN_EXCHANGE_CHECK_RULE = {
	// expressSubsidy: [
	// 	{ required: true, message: '请输入运费补贴', trigger: 'blur' }
	// ],
	inspectStatus: [
		{ required: true, message: '请选择验货意见', trigger: 'change' }
	],
	expressCompany: [
		{ required: true, message: '请输入物流公司', trigger: 'blur' }
	],
	expressFreightProof: [
		{ required: true, message: '请上传快递凭证', trigger: 'blur' }
	],
	productRealNum:[
		{ required: true, message: '请输入实退数量', trigger: 'blur' }
	],
	productRealAmount:[
		{ required: true, message: '请输入实退金额', trigger: 'blur' }
	],
}
