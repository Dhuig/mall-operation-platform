export const MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG = {
	form: [
		{
			label: '消息标题',
			key: 'msgTitle',
			type: 'input',
			value: '',
			placeholder: '请输入消息标题',
		},
		{
			label: '发送时间',
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
		{
			label: '渠道',
			key: 'receiverType',
			type: 'select',
			value: '',
			placeholder: '请选择处理状态',
			options: [],
		},
		{
			label: '消息类型',
			key: 'msgType',
			type: 'select',
			value: '',
			placeholder: '请选择消息类型',
			options: [],
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
export const CHANGE_COLUMNS = [
	{ prop: 'createTime', label: '编辑时间', align: 'center' },
	{ prop: 'msgTitle', label: '标题', align: 'center' },
	{ prop: 'operatorName', label: '创建人员', align: 'center' },
	{
		prop: 'msgType', label: '消息类型', align: 'center',
	},
	{ prop: 'planCode', label: '发布状态', align: 'center' },
];
export const MESSAGE_DETAIL_STATUS = {
	0: '待审核',
	1: '待发送',
	2: '已驳回',
	3: '已取消',
	4: '已发送',
}
export const TAB_PANE = [
	{ name: 'all', label: '全部 ' },
	{ name: 'pending', label: '待审核' },
	{ name: 'tobesent', label: '待发送' },
	{ name: 'hasbeensent', label: '已发送' },
	{ name: 'cancelled', label: '已驳回' },
	{ name: 'finished', label: '已取消' },
]
export const MESSAGE_DETAIL_COLUMNS = [
	{prop: 'cardNo',label: '会员卡号',align: 'left',},
	{prop: 'ctsName',label: '姓名',align: 'left',},
	{prop: 'phone',label: '手机号',align: 'left',},
	{prop: 'invoiceTotal',label: '发票总额',align: 'left',},
	{prop: 'serverNo',label: '服务中心号',align: 'left',},
	{prop: 'readStatusStr',label: '状态',align: 'left',},
]
export const GET_STATUS = {
	all: '',
	pending: '0',
	tobesent: '1',
	hasbeensent: '4',
	cancelled: '2',
	finished: '3',
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
	tobesent: {
		loading: false,
		data: [],
		pagination: {
			total: 0,
			currentPage: 1,
			pageSize: 10,
		},
	},
	hasbeensent: {
		loading: false,
		data: [],
		pagination: {
			total: 0,
			currentPage: 1,
			pageSize: 10,
		},
	},
	cancelled: {
		loading: false,
		data: [],
		pagination: {
			total: 0,
			currentPage: 1,
			pageSize: 10,
		},
	},
	finished: {
		loading: false,
		data: [],
		pagination: {
			total: 0,
			currentPage: 1,
			pageSize: 10,
		},
	},
}
