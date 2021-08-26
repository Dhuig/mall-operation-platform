import { filters } from 'plugins/filters';
// 产品状态
export const VERSION_STATUS = {
	'1': "草稿",
	'2': "待产品审核",
	'3': "产品审核不通过",
	'4': "待财务审核",
	'5': "财务审核不通过",
	'6': "审核通过",
	'7': "已上架",
	'8': "已下架"
}
// 产品审核状态
export const AUDIT_STATUS_NAME_TO_NUMBER = {
	'1': 'all',
	'2': 'tobeAudit',
	'3': 'passed',
	'4': 'notpass'
}

// 产品审核tab选项卡数据
export const AUDIT_STATUS_PANES = {
	'1': {
		name: 'all',
		title: '所有产品',
		data: [],
		loading: false,
		pagination: {
			currentPage: 1,
			pageSize: 10,
		},
		total: 0,
		options: {
			selection: true,
		},
	},
	'2': {
		name: 'tobeAudit',
		title: '待审核',
		data: [],
		loading: false,
		pagination: {
			currentPage: 1,
			pageSize: 10,
		},
		total: 0,
		options: {
			selection: true,
		},
	},
	'3': {
		name: 'passed',
		title: '已通过',
		data: [],
		loading: false,
		pagination: {
			currentPage: 1,
			pageSize: 10,
		},
		total: 0,
		options: {
			selection: true,
		},
	},
	'4': {
		name: 'notpass',
		title: '未通过',
		data: [],
		loading: false,
		pagination: {
			currentPage: 1,
			pageSize: 10,
		},
		total: 0,
		options: {
			selection: true,
		},
	},
}

export const PRICE_CHECK_SEARCH = {
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
		{
			label: '创建时间',
			key: 'daterange',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期',
			},
		},
	],
	buttonGroup: [
		{
			key: 'search',
			title: '搜索',
			type: 'primary',
		},
		{
			key: 'reset',
			title: '重置',
			type: '',
		}
	],
};
// 价格审核列表 -- 列表项
export const PRICE_CHECK_COLUMNS = [
	{
		label: '产品编号',
		align: 'center',
		prop: 'serialNo',
		width: 100
	},
	{
		label: '产品名称',
		align: 'center',
		prop: 'title',
		width: 150,
	},
	{
		label: '产品类型',
		align: 'center',
		prop: 'catalogTitle',
		width: 120
	},
	{
		label: '零售价',
		align: 'center',
		prop: 'retailPrice',
	},
	{
		label: '押货价',
		align: 'center',
		prop: 'securityPrice',
	},
	{
		label: '团购价',
		align: 'center',
		prop: 'groupPrice',
	},
	{
		label: '产品PV',
		align: 'center',
		prop: 'pv',
	},
	{
		label: '产品状态',
		align: 'center',
		prop: 'statusNote'
	},
	{
		label: '创建时间',
		align: 'center',
		prop: 'createTime',
		width: 150,
		formatter: ({ createTime }) => {
			return createTime>0 ? filters.timestampFormat(createTime) : '';
		}
	},
	{
		label: '上架时间',
		align: 'center',
		prop: 'onSaleTime',
		width: 150,
		formatter: ({ onSaleTime }) => {
			return onSaleTime>0 ? filters.timestampFormat(onSaleTime) : '';
		}
	},
	{
		label: '下架时间',
		align: 'center',
		prop: 'offSaleTime',
		width: 150,
		formatter: ({ offSaleTime }) => {
			return offSaleTime>0 ? filters.timestampFormat(offSaleTime) : '';
		}
	}
];

// 价格审核详情 -- 搜索项
export const CHECK_SEARCH = {
	form: [
		{
			label: '审核人',
			key: 'operator',
			type: 'input',
			value: '',
			placeholder: '请填写审核人',
		},
		{
			label: '审核时间',
			key: 'daterange',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期',
			},
		},
		{
			label: '审核意见',
			key: 'auditTypeResult',
			type: 'select',
			value: '',
			options: [
				{ value: '1', label: '产品审核通过' },
				{ value: '2', label: '产品审核不通过' },
        { value: '3', label: '财务审核通过' },
				{ value: '4', label: '财务审核未通过' },
			],
			placeholder: '请填写审核意见',
		},
	],
	buttonGroup: [
		{
			key: 'search',
			title: '搜索',
			type: 'primary',
		},
		{
			key: 'reset',
			title: '重置',
			type: '',
		}
	],
};

// 审核操作
export const AUDIT_OPERATION = [
	{ value: 1, label: '审核通过' },
	{ value: 2, label: '审核不通过' }
]

// 价格审核详情 -- 审核项
export const AUDIT_RULES = {
	auditResult: [{ required: true, message: '请选择审核操作', trigger: 'change' }],
	// remarks: [{ required: true, message: '请填写备注说明', trigger: 'blur' }],
}

// 价格审核详情 -- 列表项
export const CHECK_COLUMNS = [
	{
		label: '审核人',
		align: 'center',
		prop: 'operator'
	},
	{
		label: '审核时间',
		align: 'center',
		prop: 'createTime',
		formatter: ({ createTime }) => {
			return createTime>0 ? filters.timestampFormat(createTime) : '';
		}
	},
	{
		label: '审核意见',
		align: 'center',
		prop: 'auditTypeResultStr'
	},
];

