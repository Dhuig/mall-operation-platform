import { optionGenerator } from 'util';
// genCurrentMonthFirstAndLastDay
import { filters } from 'plugins/filters';

// 新建产品校验规则
export const PRODUCT_RULES = {
	// 产品基础信息字段校验
	serialNo: [{ required: true, message: '请输入产品编号', trigger: 'blur' }, { pattern: /^[A-Za-z0-9]+$/, message: '不支持特殊符号' }],
	title: [{ required: true, message: '请输入产品名称', min: 1, max: 20, trigger: 'blur' }],
	catalogId: [{ required: true, message: '请选择产品类型', trigger: ['blur', 'change'] }],
	showIds: [{ required: true, message: '请选择前端分类', trigger: ['blur', 'change'] }],
	brandId: [{ required: true, message: '请选择产品品牌', trigger: ['blur', 'change'] }],
	boxNum: [{ pattern: /^([1-9][0-9]*)$/, message: '装箱数量必须为大于0的整数', trigger: 'blur' }],
	saleCompanyId: [{ required: true, message: '请选择销售主体', trigger: 'blur' }],
	shippingTpl: [{ required: true, message: '请选择公司统一运费模板', trigger: 'blur' }],
	directSale: [{ required: true, message: '请选择是否直销产品', trigger: 'blur' }],
	orderType: [{ required: true, message: '请选择订货类型', trigger: 'blur' }],
	// tags: [{ type: 'array', required: true, message: '请至少选择一个产品标签', trigger: 'blur' }],
	guarantee: [{ pattern: /^([1-9][0-9]*)$/, message: '保质期必须为大于0的整数', trigger: 'blur' }],
	// 产品价格信息字段校验
	retailPrice: [
		{ required: true, message: '请输入零售价', trigger: 'blur' },
		{ pattern: /^\d+(\.\d{0,2})?$/, message: '请输入两位小数的正数', trigger: 'change' }
	],
	securityPrice: [
		{ required: true, message: '请输入押货价', trigger: ['blur', 'change'] },
		{ pattern: /^\d+(\.\d{0,2})?$/, message: '请输入两位小数的正数', trigger: 'blur' }
	],
	groupPrice: [
		{ required: true, message: '请输入单位团购价', trigger: ['blur', 'change'] },
		{ pattern: /^\d+(\.\d{0,2})?$/, message: '请输入两位小数的正数', trigger: 'blur' }
	],
	pv: [
		{ required: true, message: '请输入PV', trigger: 'blur' },
		{ pattern: /^([0-9]*)$/, message: 'PV必须为大于等于0整数', trigger: 'blur' }
	],
	orderPrice: [
		{ required: true, message: '请输入展业包订货价', trigger: ['blur', 'change'] },
		{ pattern: /^\d+(\.\d{0,2})?$/, message: '请输入两位小数的正数', trigger: 'blur' }
	],
};


// 产品版本状态
export const VERSION_STATUS = {
	"1": "草稿",
	"2": "待审核",
	"3": "未通过",
	"4": "待审核",
	"5": "未通过",
	"6": "待生效",
	"7": "已上架",
	"8": "已下架"
}

// 产品版本状态字典
export const VERSION_STATUS_MAP = {
	all: "",
	onSale: "7",
	offSale: "8",
	draft: "1",
	toBeRevied: "2,4",
	toBeEffective: "6",
	failed: "3,5"
}

// 是否是直销
export const IS_DIRECT_SALE = {
	'1': '直销产品',
	'0': '非直销产品'
}



// 订货类型 (普通/组合) 商品
export const ORDER_TYPE = {
	'1': '产品订货',
	'2': '资料订货',
}

// 订货类型 (定制品) 商品
export const CUSTOMIZE_PRODUCT_OPTIONS = {
	label: '定制品订货',
	value: 3
}

// 产品加工方式
export const PROCESS_TYPE = {
	"1": "自制",
	"2": "外购"
}

// 产品类型
export const PRODUCT_TYPE = {
	'': '',
	normal: 1,
	customize: 2,
	composition: 3,
};

// 销售规则
export const SALE_RULES = [
	// {
	// 	label: '停止网点押货',
	// 	key: 'isStopBat',
	// 	tips: '勾选时，产品不显示在服务中心前端，因此服务中心无法押货',
	// },
	{
		label: '停止销售呈报',
		key: 'isStopSale',
		tips: '勾选时，产品不显示在商城前端，因此顾客无法下单,但可支持仅消化服务中心库存',
	},
	{
		label: '是否换购产品',
		key: 'isExchangeProduct',
		tips: '勾选时，产品不可以单独购买',
	},
	{
		label: '是否支持安装服务',
		key: 'isInstall',
		tips: '勾选时，顾客可申请指定产品的安装服务',
	},
	{
		label: '是否支持维修服务',
		key: 'isRepair',
		tips: '勾选时，顾客可申请指定产品的维修服务',
	},
	{
		label: '是否支持返厂维修服务',
		key: 'isReturnRepair',
		tips: '勾选时，顾客可申请指定产品的返厂维修服务',
	},
	{
		label: '仅消化服务中心库存',
		key: 'isConsumeStock',
		tips: '勾选时，产品仅支持有库存的服务中心进行报单',
	},
	{
		label: '是否开发票',
		key: 'isInvoice',
		tips: '不勾选时，凡订单含有此产品，前端需隐藏【申请开票】',
	},
	{
		label: '是否支持单独下单',
		key: 'isOneOrder',
		tips: '勾选时，产品仅支持单独下单购买，不可以和其他产品一起购买',
	},
	{
		label: '是否支持可申请退货',
		key: 'isProductReturn',
		tips: '不勾选时，凡订单含有此产品，前端需隐藏【申请售后】',
	},
]

// 产品管理 搜索
export const PRODUCT_MANAGEMENT_CONFIG = {
	form: [
		{
			label: '产品编号',
			key: 'serialNo',
			type: 'input',
			value: '',
			placeholder: '请输入产品编号',
		},
		{
			label: '产品名称',
			key: 'title',
			type: 'input',
			value: '',
			placeholder: '请输入产品名称',
		},
		{
			label: '产品类型',
			key: 'catalogId',
			type: 'select',
			value: '',
			options: [],
			placeholder: '请选择产品类型',
		},
		{
			label: '销售主体',
			key: 'saleCompanyId',
			type: 'select',
			options: [],
			placeholder: '请输入销售主体',
		},
		{
			label: '订货类型',
			key: 'orderType',
			type: 'select',
			value: '',
			options: optionGenerator(ORDER_TYPE).concat(CUSTOMIZE_PRODUCT_OPTIONS),
			placeholder: '请输入订货类型',
		},
		{
			label: '是否直销产品',
			key: 'directSale',
			type: 'select',
			value: '',
			options: optionGenerator(IS_DIRECT_SALE),
			placeholder: '请选择是否直销产品',
		},
		{
			label: '最近修改时间',
			key: 'lastModifyTimeRange',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
				rangeSeparator: '~',
			}
		},
	]
}

// 产品管理 选项卡数组
export const PRODUCT_MANAGEMENT_TABS_LIST = [
	['全部产品', 'all'],
	['已上架', 'onSale'],
	['已下架', 'offSale'],
	['草稿', 'draft'],
	['待审核', 'toBeRevied'],
	['待生效', 'toBeEffective'],
	['未通过', 'failed'],
]

// 产品管理 列定义
export const PRODUCT_COLUMNS = [
	{ prop: 'serialNo', label: '产品编码', align: 'center', width: 100 },
	{
		prop: 'title',
		label: '产品名称',
		width: 150,
		align: 'center'
	},
	{
		prop: 'catalogTitle',
		label: '产品类型',
		align: 'center',
		width: 120
	},
	{
		prop: 'orderType',
		label: '订货类型',
		align: 'center',
		formatter: ({ orderType }) => {
			const WHOLE_ORDER_TYPE = {
				...ORDER_TYPE,
				'3': '定制品订货'
			}
			return orderType in WHOLE_ORDER_TYPE ? WHOLE_ORDER_TYPE[orderType] : '';
		}
	},
	{
		prop: 'directSale',
		label: '是否直销产品',
		width: 120,
		align: 'center',
		formatter: ({ directSale }) => {
			return directSale in IS_DIRECT_SALE ? IS_DIRECT_SALE[directSale] : '';
		}
	},
	{ prop: 'saleCompanyTitle', label: '销售主体', align: 'center' },
	{ prop: 'retailPrice', label: '零售价', align: 'center' },
	{ prop: 'securityPrice', label: '押货价', align: 'center' },
	{ prop: 'pv', label: 'PV', align: 'center' },
	{ prop: 'packing', label: '包装规格', align: 'center', width: 180 },
	{
		prop: 'versionStatus',
		label: '产品状态',
		align: 'center',
		width: 120,
		formatter: ({ versionStatus }) => {
			return versionStatus in VERSION_STATUS ? VERSION_STATUS[versionStatus] : '';
		}
	},
	{
		prop: 'updateTime',
		label: '最近修改时间',
		align: 'center',
		width: 150,
		formatter: ({ updateTime }) => filters.timestampFormat(updateTime)
	},
	{
		prop: 'onSaleTime',
		label: '上架时间',
		align: 'center',
		width: 150,
		formatter: ({ onSaleTime }) => filters.timestampFormat(onSaleTime)
	},
	{
		prop: 'offSaleTime',
		label: '下架时间',
		align: 'center',
		width: 150,
		formatter: ({ offSaleTime }) => filters.timestampFormat(offSaleTime)
	},
];

export const PRODUCT_REVIEWED_LIST_CONFIG = {
	form: [
		{
			label: '产品编号',
			key: 'no',
			type: 'input',
			value: '',
			placeholder: '请输入产品编号',
		},
		{
			label: '产品名称',
			key: 'name',
			type: 'input',
			value: '',
			placeholder: '请输入产品名称',
		},
		{
			label: '时间',
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

export const PRODUCT_CONTROL_CONFIG = {
	form: [
		{
			label: '产品编号:',
			key: 'no',
			type: 'input',
			value: '',
			placeholder: '请输入产品编号',
		},
		{
			label: '产品类型:',
			key: 'category',
			type: 'select',
			value: '',
			disabled: true,
			options: [
				{
					value: '1',
					label: '健康食品'
				},
				{
					value: '2',
					label: '厨具'
				},
				{
					value: '3',
					label: '烟酒茶叶'
				},
			],
			placeholder: '请选择产品类型'
		},
		{
			label: '前端类型:',
			key: 'fe_category',
			type: 'select',
			value: '',
			disabled: true,
			options: [
				{
					value: '1',
					label: '健康食品'
				},
				{
					value: '2',
					label: '厨具'
				},
				{
					value: '3',
					label: '烟酒茶叶'
				},
			],
			placeholder: '请选择产品类型'
		},
		{
			label: '产品名称:',
			key: 'name',
			type: 'input',
			value: '',
			placeholder: '请输入产品名称',
		},
		{
			label: '产品品牌:',
			key: 'brand',
			type: 'input',
			value: '',
			disabled: true,
			placeholder: '请输入产品品牌',
		},
		{
			label: '计量单位:',
			key: 'brand',
			type: 'input',
			value: '',
			placeholder: '请输入产品品牌',
		},
		{
			label: '销售主体:',
			key: 'salor',
			type: 'input',
			value: '',
			disabled: true,
			placeholder: '请输入销售主体',
		},
		{
			label: '时间:',
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

// 销售库存控制 搜索
export const SALES_CONTROL_CONFIG = {
	form: [
		{
			label: '产品编号',
			key: 'serialNo',
			type: 'input',
			value: '',
			placeholder: '请输入产品编号',
		},
		{
			label: '产品名称',
			key: 'productTitle',
			type: 'input',
			value: '',
			placeholder: '请输入产品名称',
		}
	]
}

// 销售库存控制 选项卡数组
export const SALES_CONTROL_STOCK_TABS_LIST = [
	['全部', 'all'],
	['限量产品', 'limitedProduct'],
	['非限量产品', 'unlimitedProduct']
]

// 销售库存控制 库存类型字典
export const SALES_CONTROL_STOCK_TYPE_MAP = {
	all: '0',
	limitedProduct: '1',
	unlimitedProduct: '2'
}

// 销售库存控制 列定义
export const SALES_CONTROL_COLUMNS = [
	{ prop: 'serialNo', label: '产品编码', align: 'center' },
	{ prop: 'productTitle', label: '产品名称', align: 'center' },
	{
		prop: 'maxSaleQuota',
		label: '最大销售库存',
		align: 'center',
		formatter: ({ maxSaleQuota, stockType }) => {
			return stockType == '2' ? "不限量" : maxSaleQuota
		}
	},
	{ prop: 'restSaleQuota', label: '剩余可销售库存', align: 'center' },
	{ prop: 'companySaleQuota', label: '公司可销售库存', align: 'center' },
	{ prop: 'storeSaleQuota', label: '服务中心可销售库存', align: 'center' },
	{ prop: 'storeOweQuota', label: '服务中心欠货未发库存', align: 'center' },
];

// 销售库存控制 变更日志 搜索
export const SALES_CONTROL_CHANGELOG_CONFIG = {
	form: [
		{
			label: '时间:',
			key: 'timeRange',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
			}
		},
	]
};
// 销售库存控制 变更日志 列定义
export const SALES_CONTROL_CHANGELOG_COLUMNS = [
	{
		prop: 'updateTime',
		label: '更新时间',
		align: 'center',
		formatter: ({ updateTime }) => filters.timestampFormat(updateTime)
	},
	{
		prop: 'maxSale',
		label: '最大销售库存',
		align: 'center',
		formatter: ({ maxSale }) => {
			return maxSale === '-1' ? "不限量" : maxSale;
		}
	},
	{ prop: 'restSale', label: '剩余可销售库存', align: 'center' },
	{ prop: 'companySale', label: '公司可销售库存', align: 'center' },
	{ prop: 'storeSale', label: '服务中心可销售库存', align: 'center' },
	{ prop: 'operator', label: '创建人', align: 'center' },
];
// 销售库存控制 变更日志 基本信息列表项
export const SALES_CONTROL_CHANGELOG_INFO_LIST = [
	['产品编号', 'serialNo'],
	['产品名称', 'productTitle'],
	['最大销售数量', 'maxSaleQuota'],
	['剩余可销售库存', 'restSaleQuota'],
	['公司可销售库存', 'companySaleQuota'],
	['服务中心可销售库存', 'storeSaleQuota'],
];

// 属性类型
export const PROPERTY_TYPE = {
	'1': '文本',
	'2': '单选',
	'3': '多选'
}

// 产品配置属性 列定义
export const PRODUCT_CONFIG_COLUMNS = [
	{ prop: 'attrKey', label: '属性名称', align: 'center' },
	{ prop: 'attrValArray', label: '属性值', align: 'center' },
	{
		prop: 'attrType',
		label: '属性类型',
		align: 'center',
		formatter: ({ attrType }) => {
			return attrType in PROPERTY_TYPE ? PROPERTY_TYPE[attrType] : '';
		}
	},
];

// 产品配置 -- 前端关联分类产品 搜索列
export const RELATIVE_CATELOG = {
	col: 2,
	form: [
		{
			label: '产品编号',
			key: 'serialNo',
			type: 'input',
			value: '',
			placeholder: '请填写产品编号',
		},
		{
			label: '产品名称',
			key: 'title',
			type: 'input',
			value: '',
			placeholder: '请填写产品名称',
		},
	]
}

// 前端关联分类产品 关联状态
const RELATIVE_STATUS = {
	'0': '未关联',
	'1': '关联',
}

// 产品配置 -- 前端关联分类产品 表格列定义
export const RELATIVE_COLUMNS = [
	{ prop: 'serialNo', label: '产品编码', align: 'center' },
	{ prop: 'title', label: '产品名称', align: 'center', width: 200 },
	{ prop: 'catalogTitle', label: '产品分类', align: 'center', width: 200 },
	{
		prop: 'status',
		label: '状态',
		align: 'center',
		formatter: ({ status }) => {
			return status in RELATIVE_STATUS ? RELATIVE_STATUS[status] : '';
		}
	},
];

// 产品详情搜索下拉框配置
export const PRODUCT_DETAIL = {
	// 产品类型
	PRODUCT_TYPE: [
		{ label: '全部', value: 'all' },
		{ label: '食品', value: 'foot' },
	],
	// 前端类型
	PRODUCT_CATEGORY: [
		{ label: '全部', value: 'all' },
		{ label: '健康食品', value: 'foot' },
	],
	// 产品品牌
	PRODUCT_BRAND: [
		{ label: '大品牌', value: 'big' },
		{ label: '小品牌', value: 'small' },
	],
	// 销售主体
	PRODUCT_SALOR: [
		{ label: '完美中国', value: 'base' },
		{ label: '服务中心', value: 'service' },
	],
	// 加工方式
	PRODUCT_MAKEWAY: [
		{ label: '自制', value: 'self' },
		{ label: '第三方', value: 'other' },
	],
	// 订货类型
	PRODUCT_ORDERTYPE: [
		{ label: '产品订货', value: 'pr' },
		{ label: '自主订货', value: 'sr' },
	],
	// 运费模板
	PRODUCT_SHIPPING_FEE_TEMPLATE: [
		{ label: '免邮费模板', value: 'free' },
		{ label: '一般计费模板', value: 'normal' },
	],
	// 是否是直销
	PRODUCT_IS_DIRECTLY: [
		{ label: '是', value: '1' },
		{ label: '否', value: '-1' },
	],
};

// 变更内容
const CHANGE_CONTENT = {
	'1': '产品名称',
	'2': '销售主体',
	'3': '产品价格与pv',
}

export const PRODUCT_DETAIL_CHANGELOG_SEARCH = {
	form: [
		{
			label: '操作人',
			key: 'operator',
			type: 'input',
			value: '',
			placeholder: '请输入操作人',
		},
		{
			label: '操作时间',
			key: 'timeRange',
			type: 'datePicker',
			value: [undefined, undefined],
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期'
			},
			placeholder: '请选择操作时间',
		},
		{
			label: '变更内容',
			key: 'chgContent',
			type: 'select',
			value: '',
			options: optionGenerator(CHANGE_CONTENT),
			placeholder: '请选择变更内容',
		},
	],
};

export const PRODUCT_DETAIL_CHANGELOG_COLUMNS = [
	{ prop: 'operator', label: '操作人', align: 'center' },
	{
		prop: 'updateTime',
		label: '操作时间',
		align: 'center',
		formatter: ({ updateTime }) => filters.timestampFormat(updateTime)
	},
	{ prop: 'changeContent', label: '变更内容', align: 'center' },
];

// 审核意见
const VALIDATE_STATUS = {
	'0': '全部',
	'1': '产品审核通过',
	'2': '产品审核不通过',
	'3': '财务审核通过',
	'4': '财务审核不通过',
}

export const PRODUCT_DETAIL_VALIDATE_SEARCH = {
	form: [
		{
			label: '审核人',
			key: 'operator',
			type: 'input',
			value: '',
			placeholder: '请输入审核人',
		},
		{
			label: '审核时间',
			key: 'timeRange',
			type: 'datePicker',
			value: [undefined, undefined],
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期'
			},
			placeholder: '请选择审核时间',
		},
		{
			label: '审核意见',
			key: 'auditTypeResult',
			type: 'select',
			value: '',
			options: optionGenerator(VALIDATE_STATUS),
			placeholder: '请选择审核意见',
		},
	],
};

export const PRODUCT_DETAIL_VALIDATE_COLUMNS = [
	{ prop: 'operator', label: '审核人', align: 'center' },
	{
		prop: 'updateTime',
		label: '审核时间',
		align: 'center',
		formatter: ({ updateTime }) => filters.timestampFormat(updateTime)
	},
	{
		prop: 'auditTypeResult',
		label: '审核意见',
		align: 'center',
		formatter: ({ auditTypeResult }) => {
			return auditTypeResult in VALIDATE_STATUS ? VALIDATE_STATUS[auditTypeResult] : '无';
		}
	},
];

// 添加组合产品 模态框 搜索
export const ADD_COMPOSITION_PRODUCT_SEARCH = {
	form: [
		{
			label: '产品编码',
			key: 'serialNo',
			type: 'input',
			value: '',
			placeholder: '请输入产品编码',
		},
		{
			label: '产品名称',
			key: 'productTitle',
			type: 'input',
			value: '',
			placeholder: '请输入产品名称',
		},
	]
};

// 添加组合产品 模态框 列定义
export const ADD_COMPOSITION_PRODUCT_COLUMNS = [
	{ prop: 'serialNo', label: '产品编码', align: 'center' },
	{ prop: 'title', label: '产品名称', align: 'center' },
	{ prop: 'retailPrice', label: '零售价格', align: 'center' },
];

// 产品审核类型字典
export const PRODUCT_AUDIT_TYPE = {
	all: '1',
	toBeValidate: '2',
	pass: '3',
	notPass: '4'
}

//  产品审核选项卡数组
export const PRODUCT_INFO_VALIDATE_TABS_LIST = [
	['所有产品', 'all'],
	['待审核', 'toBeValidate'],
	['已通过', 'pass'],
	['未通过', 'notPass']
]

// 产品审核搜索
export const PRODUCT_INFO_VALIDATE_SERACH = {
	form: [
		{
			label: '产品编码',
			key: 'serialNo',
			type: 'input',
			value: '',
			placeholder: '请输入产品编码',
		},
		{
			label: '产品名称',
			key: 'title',
			type: 'input',
			value: '',
			placeholder: '请输入产品名称',
		},
		{
			label: '时间',
			key: 'timeRange',
			type: 'datePicker',
			value: [undefined, undefined],
			config: {
				type: 'daterange',
			},
			placeholder: '请选择审核时间',
		},
	]
};

// 产品审核 列定义
export const PRODUCT_INFO_VALIDATE_COLUMNS = [
	{ prop: 'serialNo', label: '产品编码', align: 'center' },
	{ prop: 'title', label: '产品名称', align: 'center', width: 120 },
	{ prop: 'catalogTitle', label: '产品类型', align: 'center', width: 250 },
	{
		prop: 'orderType',
		label: '订货类型',
		align: 'center',
		formatter: ({ orderType }) => {
			const WHOLE_ORDER_TYPE = {
				...ORDER_TYPE,
				'3': '定制品订货'
			}
			return orderType in WHOLE_ORDER_TYPE ? WHOLE_ORDER_TYPE[orderType] : '';
		}
	},
	{
		prop: 'directSale',
		label: '是否直销',
		align: 'center',
		formatter: ({ directSale }) => {
			return directSale in IS_DIRECT_SALE ? IS_DIRECT_SALE[directSale] : '';
		}
	},
	{ prop: 'saleCompanyTitle', label: '销售类型', align: 'center' },
	{
		prop: 'statusNote',
		label: '产品状态',
		align: 'center',
		width: 120
	},
	{
		prop: 'createTime',
		label: '创建时间',
		align: 'center',
		width: 250,
		formatter: ({ createTime }) => filters.timestampFormat(createTime)
	},
];

// 审核状态
export const VALIDATE_TYPE = {
	'0': '全部',
	'1': '产品审核通过',
	'2': '产品审核不通过',
	'3': '财务审核通过',
	'4': '财务审核不通过',
}


// 产品审核详情日志 搜索
export const PRODUCT_INFO_VALIDATE_CHANGELOG_SERACH = {
	form: [
		{
			label: '审核人',
			key: 'operator',
			type: 'input',
			value: '',
			placeholder: '请输入审核人',
		},
		{
			label: '审核时间',
			key: 'timeRange',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
			},
			placeholder: '请选择审核时间',
		},
		{
			label: '审核意见',
			key: 'auditTypeResult',
			type: 'select',
			value: '',
			options: optionGenerator(VALIDATE_TYPE),
			placeholder: '请选择审核意见',
		},
	]
};

// 产品审核详情日志 列定义
export const PRODUCT_INFO_VALIDATE_CHANGELOG_COLUMNS = [
	{ prop: 'operator', label: '审核人', align: 'center' },
	{
		prop: 'updateTime',
		label: '审核时间',
		align: 'center',
		formatter: ({ updateTime }) => filters.timestampFormat(updateTime)
	},
	{ prop: 'auditTypeResultStr', label: '审核意见', align: 'center' },
];

// 产品历史日志 搜索
export const PRODUCT_HISTORY_SEARCH = {
	form: [
		{
			label: '产品编号',
			key: 'serialNo',
			type: 'input',
			value: '',
			placeholder: '请输入产品编号',
		},
		{
			label: '最近修改时间',
			key: 'timeRange',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
			},
			placeholder: '请选择最近修改时间',
		},
	]
};

// 产品历史日志 列定义
export const PRODUCT_HISTORY_COLUMNS = [
	{ prop: 'version', label: '版本编号', align: 'center' },
	{ prop: 'serialNo', label: '产品编码', align: 'center' },
	{ prop: 'title', label: '产品名称', align: 'center' },
	{
		prop: 'createTime',
		label: '版本生成时间',
		align: 'center',
		width: 150,
		formatter: ({ createTime }) => filters.timestampFormat(createTime)
	},
	{
		prop: 'offSaleTime',
		label: '版本失效时间',
		align: 'center',
		width: 150,
		formatter: ({ offSaleTime }) => filters.timestampFormat(offSaleTime)
	},
	{ prop: 'operator', label: '审批人', align: 'center' },
	{
		prop: 'isSaleVersion',
		label: '是否当前销售版本',
		align: 'center',
		formatter: ({ isSaleVersion }) => {
			return isSaleVersion === 1 ? '是' : '否'
		}
	},
];

export function TABITEM() {
	this.loading = false;
	this.data = [];
	this.total = 0;
	this.selections = []
	this.pagination = {
		currentPage: 1,
		pageSize: 10,
	}
}