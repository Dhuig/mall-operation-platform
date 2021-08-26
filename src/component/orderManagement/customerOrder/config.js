import { mapToSelectOptions,genCurrentMonthFirstAndLastDay } from 'util';
import { formatDate, formatDateDefault } from 'util/formValidation';
// 订单类型对象
export const ORDER_TYPE_MAP = {
	1: '正常订单' ,
	2: '补报订单' ,
	3: '调差订单' ,
	4: '单位团购转分订单'
};

// 订单调整方式djustmentType
export const DJUSTMENT_MAP = {
	1: '级别' ,
	2: '级别+收入' ,
};



// 下单渠道
export const SOURCE_MAP  = {
	1: 'WEB商城',
	2: 'APP商城',
	3: '小程序商城',
	4: '系统下单',
	5: '商城1.0',
};
// 顾客类型字典
export const CUSTOMER_TYPE = {
	1: '普通顾客',
	2: '优惠顾客',
	3: '云商',
	4: '微店',
};
// 库存类型选项
export const STOCK_TYPE_MAP  = {
	1: '公司库存',
	2: '押货库存',
	3: '单位团购库存',
	4: '展业包库存',
};

// 下单方式选项
export const ORDER_WAY_MAP = {
	1: '自购订单',
	2: '代购订单',
}

export const PRODUCT_ORDER_TYPE_MAP = {
	1:'产品订货',
	2:'资料订货' ,
	3:'定制品订货' 
};

// 是否活动订单映射
export const IS_PROMITION_MAP = {
	0: '否',
	1: '是',
};

// 顾客订单 tab-pane 列表
export const CUSTOMER_ORDER_TABS_LIST = [
	{
		label: '全部订单',
		name: 'all',
	},
	{
		label: '待付款',
		name: 'toPay',
	},
	{
		label: '待发货',
		name: 'toSend',
	},
	{
		label: '待收货',
		name: 'toReceived',
	},

	{
		label: '已完成',
		name: 'completed',
	},
	{
		label: '已退货/已取消',
		name: 'canceled',
	},
];

// 订单状态列表字典
export const ORDER_STATUS_LIST = {
	toPay: ['1'],
	toSend: ['2'],
	toReceived: ['3'],
	completed: ['99'],
	canceled: ['4', '5'],
};

// // 交付方式字典
// export const EXPRESS_TYPE = {
// 	1: '服务中心自提',
// 	2: '公司交付',
// };

// 订单状态字典
export const ORDER_STATUS = {
	1: '待支付',
	2: '待发货',
	3: '待收货',
	4: '已取消',
	5: '已退货',
	99: '已完成',
};

// 票据验证规则
export const TICKER_VALIDATE_RULES = {
	// 个人普通电子票检验规则
	ticketPersonRules: {
		name: [
			{ required: true, message: '请输个人姓名' },
			{ min: 1, max: 20, message: '请输入正确的姓名' },
			{
			pattern: /^[\u4e00-\u9fa5a-zA-Z0-9·]+$/, message: '请输入正确的姓名'
			},
		],
	},
	// 企业普通电子票检验规则
	ticketBusinessNormalRules: {
		name: [
			{ required: true, message: '请输入单位名称' },
			{ min: 1, max: 50, message: '单位名称格式错误' },
		],
		taxpayerNo: [
			{ required: true, message: '请输入纳税人识别号' },
			{
        pattern: /^\w+$/,
        message: '不支持特殊符号',
      },
		],
		registerAddress: [
			{ min: 1, max: 200, message: '请输入1-200个字符' },
		],
		registerPhone: [
			{ min: 1, max: 20, message: '请输入1-20个字符' },
		],
		bankName: [
			{ min: 1, max: 200, message: '请输入1-200个字符' },
		],
		bankAccount: [
			{ min: 1, max: 40, message: '请输入1-40个数字' },
		]
	},
	// 企业专用纸质发票检验规则
	ticketBusinessProRules: {
		name: [
			{ required: true, message: '请输入单位名称' },
			{ min: 1, max: 50, message: '请输入1-50个字符' }
		],
		taxpayerNo: [
			{ required: true, message: '请输入纳税人识别号' },
			{
        pattern: /^\w+$/,
        message: '不支持特殊符号',
      },
		],
		registerAddress: [
			{ required: true, message: '请填写注册地址' },
			{ min: 1, max: 200, message: '请输入1-200个字符' }
		],
		registerPhone: [
			{ required: true, message: '请填写注册电话' },
			{ min: 1, max: 20, message: '请输入1-20个字符' }
		],
		bankName: [
			{ required: true, message: '请填写开户银行名称' },
			{ min: 1, max: 200, message: '请输入1-200个字符' },
		],
		bankAccount: [
			{ required: true, message: '请填写开户银行帐号' },
			{ min: 1, max: 40, message: '请输入1-40个数字' },
			{
        pattern: /^\w+$/,
        message: '不支持特殊符号',
      },
		],
		phone: [
			{ required: true, message: '请填写联系人电话' },
			{ min: 1, max: 20, message: '请输入1-20个字符' },
		],
		businessLicense: [{ required: true, message: '请上传营业执照副本!' }],
		bankLicense: [{ required: true, message: '请上传银行开户许可证!' }],
		authorizeLicense: [{ required: true, message: '请上传授权委托书!' }],
	},
};

// 付款方式字典
export const PAY_TYPE = {
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
};

// 发票状态字典
export const INVOICE_STATUS = {
	1: '未开票',
	2: '开票中',
	3: '已开票',
};

// 发票类型字典
export const INVOICE_TYPE = {
	1: '个人普通电子票',
	2: '企业普通电子发票',
	3: '企业专用纸质发票',
};

// 发表类型值映射
export const TICKET_TYPE = {
	ticketPerson: 1,
	ticketBusinessNormal: 2,
	ticketBusinessPro: 3,
};

// 订单步骤条数组
export const ORDER_STEPS = [
	{
		orderStatus: 1,
		createTime: '',
	},
	{
		orderStatus: 2,
		createTime: '',
	},
	{
		orderStatus: 3,
		createTime: '',
	},
	{
		orderStatus: 4,
		createTime: '',
	},
	{
		orderStatus: 5,
		createTime: '',
	},
	{
		orderStatus: 99,
		createTime: '',
	},
	{
		orderStatus: 100,
		createTime: '',
	},
];

//订单步骤条描述信息
export const ORDER_STEPS_TITLE = {
	1: '提交订单',
	2: '付款成功',
	3: '商品出库',
	4: '订单已取消',
	5: '订单已退货',
	99: '顾客收货',
	100: '完成',
};

// 订单状态提示信息
export const ORDER_STATUS_TIP = {
	1: '等待付款',
	2: '等待出库',
	3: '等待收货',
	4: '已取消',
	5: '已退货',
	99: '已完成',
};

export const USE_PERIOD_DICT = [
	{
		value: '1',
		label: '早',
	},
	{
		value: '2',
		label: '中',
	},
	{
		value: '3',
		label: '晚',
	},
];

export const PROBLEM_STATUS_DICT = [
	{
		value: '1',
		label: '初次开封使用发现',
	},
	{
		value: '2',
		label: '使用过程中发现',
	},
];

export const JUNK_HANDLE_TYPE = [
	{
		label: '分公司处理',
		value: '1',
	},
	{
		label: '中转仓处理',
		value: '2',
	},
];

export const EXCHANGE_TYPE = [
	{
		label: '先退后换',
		value: 1,
	},
	{
		label: '秒换',
		value: 2,
	},
	{
		label: '先换后退',
		value: 3,
	},
];

// 验证正整数
const integerValidator = (rule, value, callback) => {
	const {required} = rule
	if (required) {
		if (value.find(Boolean)) {
			callback();
		} else {
			callback(new Error('请输入下单时间'))
		}
	}
	callback()
}

// 顾客订单搜索栏配置
export const CUSTOMER_ORDER_SERACH = {
	form: [
		{
			label: '订单号',
			key: 'orderNo',
			type: 'input',
			value: '',
			placeholder: '请输入订单号',
			showForever: true
		},
		{
			label: '下单时间',
			key: 'time',
			type: 'datePicker',
			value: genCurrentMonthFirstAndLastDay(),
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期',
				pickerOptions: {
					shortcuts: [
						{
							text: '上月',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
								picker.$emit('pick', [start, end]);
							},
						},
					],
					disabledDate: (time) => {
            return time.getTime() > new Date(new Date().toLocaleDateString()).getTime();
          }
				},
			},
			showForever: true
		},
		{
			label: '订单类型',
			key: 'orderType',
			type: 'select',
			value: null,
			options: mapToSelectOptions(ORDER_TYPE_MAP,'全部订单'),
			placeholder: '请选择订单类型',
			showForever: true
		},
		{
			label: '下单渠道',
			key: 'source',
			type: 'select',
			value: null,
			options: mapToSelectOptions(SOURCE_MAP),
			placeholder: '请选择下单渠道',
		},
		{
			label: '顾客类型',
			key: 'customerType',
			type: 'select',
			value: null,
			options: mapToSelectOptions(CUSTOMER_TYPE),
			placeholder: '请选择是否需要发票',
		},
		{
			label: '交付方式',
			key: 'expressType',
			type: 'select',
			value: null,
			options: [
				{ value: null, label: '全部' },
				{ value: '1', label: '服务中心自提' },
				{ value: '2', label: '公司交付' },
			],
			placeholder: '请选择交付方式',
		},
		{
			label: '库存类型',
			key: 'stockType',
			type: 'select',
			value: null,
			options: mapToSelectOptions(STOCK_TYPE_MAP),
			placeholder: '请选择库存类型',
		},
		{
			label: '下单方式',
			key: 'orderWay',
			type: 'select',
			value: null,
			options: mapToSelectOptions(ORDER_WAY_MAP),
			placeholder: '请选择下单方式',
		},
		{
			label: '开单人卡号',
			key: 'creatorCard',
			type: 'input',
			value: '',
			placeholder: '请输入开单人卡号',
		},
		{
			label: '顾客手机号',
			key: 'customerPhone',
			type: 'input',
			value: '',
			placeholder: '请输入顾客手机号',
		},
		{
			label: '顾客会员卡',
			key: 'customerCard',
			type: 'input',
			value: '',
			maxlength: '20',
			placeholder: '请输入顾客会员卡',
		},
		{
			label: '顾客姓名',
			key: 'customerName',
			type: 'input',
			value: '',
			maxlength: '20',
			placeholder: '请输入顾客姓名',
		},
		{
			label: '业务分公司',
			key: 'companyCode',
			type: 'select',
			filterable: true,
			options: [],
			value: '',
			maxlength: '20',
			placeholder: '请输入业务分公司编号/名称',
		},
		{
			label: '财务分公司',
			key: 'financeCompanyCode',
			type: 'select',
			filterable: true,
			options: [],
			value: '',
			maxlength: '20',
			placeholder: '请输入财务分公司编号/名称',
		},
		{
			label: '服务中心',
			key: 'storeCode',
			slotcontent:true,
		},
		{
			label: '订货类型',
			key: 'productOrderType',
			type: 'select',
			value: null,
			disabled: true,
			options: mapToSelectOptions(PRODUCT_ORDER_TYPE_MAP),
			placeholder: '请选择订货类型',
		},
		{
			label: '是否需要发票',
			key: 'isInvoice',
			type: 'select',
			value: null,
			disabled: true,
			options: [
				{ value: null, label: '全部' },
				{ value: '1', label: '需要' },
				{ value: '0', label: '不需要' },
			],
			placeholder: '请选择是否需要发票',
		},
		{
			label: '产品编码',
			key: 'serialNo',
			filterable: true,
			slotcontent:true,
		},
		{
			label: '收货人手机号',
			key: 'receiverPhone',
			type: 'input',
			value: '',
			placeholder: '请输入收货人手机号',
		},
		{
			label: '活动订单',
			key: 'isPromotion',
			type: 'select',
			value: null,
			disabled: true,
			options: [
				{ value: null, label: '全部' },
				{ value: 0, label: '否' },
				{ value: 1, label: '是' },
			],
			placeholder: '请选择是否活动订单',
		},
	],
	rules: {
    time: [{ required: true, validator: integerValidator, trigger: 'blur' }],
  }
};

// 顾客订单表格列配置
export const CUSTOMER_ORDER_COLUMNS = [
	{ label: '订单号', prop: 'orderNo', align: 'center', width: 200 },
	{ label: '业务分公司编号', prop: 'companyCode', align: 'center', width: 110  },
	{ label: '业务分公司名称', prop: 'companyName', align: 'center', width: 180 },
	{ prop: 'financeCompanyCode', label: '财务分公司编号', align: 'center', width: 110 },
	{ prop: 'financeCompanyName', label: '财务分公司', align: 'center', width: 150 },
	{ label: '服务中心编号', prop: 'storeCode', align: 'center', width: 120,
		formatter: ({ storeCode }) => {
			return storeCode || ''
		}
	},
	{ label: '服务中心名称', prop: 'storeName', align: 'center', width: 200,
		formatter: ({ storeName }) => {
			return  storeName || ''
		}, 
	},
	{ label: '顾客会员卡', 
		prop: 'customerCard', 
		align: 'center', 
		width: 150,	
			formatter: ({ customerType, customerCard }) => {
			return customerType == '1'? '' : customerCard
		}, 
	},
	{ label: '顾客姓名', prop: 'customerName', align: 'center' },
	{
		label: '顾客类型',
		prop: 'customerType',
		align: 'center',
		formatter: ({ customerType }) => {
			return customerType in CUSTOMER_TYPE ? CUSTOMER_TYPE[customerType] : '';
		},
	},
	{ label: '开单人姓名', prop: 'creatorName', align: 'center' },
	{ label: '开单人卡号', prop: 'creatorCard', align: 'center', width: 120 },
	{ label: '开单人手机', prop: 'creatorPhone', align: 'center', width: 120 },
	{ label: '应付金额', prop: 'orderAmount', align: 'center' },
	{
		label: '返还金额',
		prop: 'returnAmount',
		align: 'center',
		formatter: ({ returnAmount }) => {
			return returnAmount + '';
		},
	},
	{
		label: '电子礼券',
		prop: 'giftCouponAmount',
		align: 'center',
		formatter: ({ giftCouponAmount }) => {
			return giftCouponAmount + '';
		},
	},
	{ label: '实付金额', prop: 'totalAmount', align: 'center',
		formatter: ({ totalAmount }) => {
			return totalAmount + ''
		},
	},
	{
		label: 'PV',
		prop: 'pv',
		align: 'center',
		formatter: ({ pv }) => {
			return pv + '';
		},
	},
	{
		label: '订单类型',
		prop: 'orderTypeDesc',
		align: 'center',
		// formatter: ({ orderType }) => {
		// 	return orderType in ORDER_TYPE_MAP ? ORDER_TYPE_MAP[orderType] : '';
		// },
	},
	{
		label: '交付方式',
		prop: 'expressTypeDesc',
		align: 'center',
		width: '100',
	},
	{
		label: '库存类型',
		prop: 'stockType',
		align: 'center',
		width: '100',
		formatter: ({ stockType }) => {
			return stockType in STOCK_TYPE_MAP ? STOCK_TYPE_MAP[stockType]: ''
		},
	},
	{
		label: '开单日期',
		prop: 'commitTime',
		align: 'center',
		formatter: ({ commitTime }) => {
			return formatDateDefault(commitTime);
		},
		width: '100',
	},
	{
		label: '付款日期',
		prop: 'payTime',
		align: 'center',
		formatter: ({ payTime }) => {
			return formatDateDefault(payTime);
		},
		width: '100',
	},
	{
		label: '发货日期',
		prop: 'deliveryTime',
		align: 'center',
		formatter: ({ deliverTime }) => {
			return (deliverTime && formatDateDefault(deliverTime)) || deliverTime;
		},
		width: '100',
	},
	{
		label: '订单状态',
		prop: 'orderStatus',
		align: 'center',
		formatter: ({ orderStatus }) => {
			return orderStatus in ORDER_STATUS ? ORDER_STATUS[orderStatus] : '';
		},
	},
];

// 订单详情->产品明细表格列配置 / 申请退货 -> 产品明细
export const PRODUCT_DETAILS_COLUMNS = [
	{
		label: '产品编码',
		prop: 'serialNo',
		align: 'center',
	},
	{
		label: '产品名称',
		prop: 'title',
		align: 'center',
	},
	{
		label: '规格',
		prop: 'packing',
		align: 'center',
	},
	{
		label: '单位',
		prop: 'meterUnit',
		align: 'center',
	},
	{
		label: '数量',
		prop: 'quantity',
		align: 'center',
		summary: true,
	},
	{
		label: '团购价',
		prop: 'price',
		align: 'center',
		formatter: ({ price }) => {
			return `￥${price}`
		}
	},
	{
		label: '订购价',
		prop: 'securityPrice',
		align: 'center',
		formatter: ({ securityPrice }) => {
			return `￥${securityPrice}`;
		},
	},
	{
		label: '零售价',
		prop: 'retailPrice',
		align: 'center'
	},
	// {
	// 	label: '活动价',
	// 	prop: 'price',
	// 	align: 'center',
	// 	formatter: ({ price }) => {
	// 		return `￥${price}`
	// 	}
	// },
	{
		label: 'PV',
		prop: 'pv',
		align: 'center',
		summary: true,
	},
	{
		label: '金额小计',
		prop: 'totalPrice',
		align: 'center',
		summary: true,
		sumConfig: {
			type: 'money'
		},
		formatter: ({ totalPrice }) => {
			return `￥${totalPrice}`;
		},
	},
	{
		label: 'PV小计',
		prop: 'totalPv',
		align: 'center',
		summary: true,
	},
];
// 操作记录
export const OPERATION_RECORD = [
	{
		label: '操作时间',
		prop: 'createTime',
		align: 'center',
		formatter: ({ createTime }) => {
			return formatDate(createTime);
		},
	},
	{
		label: '操作内容',
		prop: 'operation',
		align: 'center',
	},
	{
		label: '操作人卡号',
		prop: 'operatorCard',
		align: 'center',
	},
	{
		label: '机构',
		prop: 'companyName',
		align: 'center',
	},
	{
		label: '备注说明',
		prop: 'remarks',
		align: 'center',
	},
	{
		label: '附件',
		prop: 'serialNo',
		align: 'attachment',
	},
];
// 退货产品明细table列配置
export const RETURN_PRODUCT_DETAILS = [
	{
		label: '产品编码',
		prop: 'pv',
		align: 'center',
	},
	{
		label: '产品名称',
		prop: 'pv',
		align: 'center',
	},
	{
		label: '规格',
		prop: 'pv',
		align: 'center',
	},
	{
		label: '单位',
		prop: 'pv',
		align: 'center',
	},
	{
		label: '数量',
		prop: 'pv',
		align: 'center',
	},
	{
		label: '单价',
		prop: 'pv',
		align: 'center',
	},
	{
		label: 'PV',
		prop: 'pv',
		align: 'center',
	},
	{
		label: '金额小计',
		prop: 'pv',
		align: 'center',
	},
	{
		label: 'PV小计',
		prop: 'pv',
		align: 'center',
	},
];
