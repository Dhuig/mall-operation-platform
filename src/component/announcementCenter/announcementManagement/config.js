
import { formatDate } from 'util/formValidation.js';
export const MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG = {
	form: [
		{
			label: '公告标题',
			key: 'title',
			type: 'input',
			value: '',
			placeholder: '请输入公告标题',
		},
		{
			label: '发布时间',
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
			label: '创建时间',
			key: 'createTime',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期',
				pickerOptions: {
					disabledDate: () => {
						return false;
					}
				},
			}
		},
		{
			label: '平台筛选',
			key: 'channel',
			type: 'select',
			value: 0,
			placeholder: '请选择平台筛选',
			options: [
				{ label: '所有平台', value: 0 },
				{ label: '服务中心后台', value: 2 },
				{ label: '商城', value: 1 },
			],
		},
		{
			label: '公告类型',
			key: 'typeId',
			type: 'select',
			value: '',
			placeholder: '请选择公告类型',
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
const statusData = { '-2': '待审核', '-1': '待发布', '0': '已发布', '1': '已驳回', '2': '已取消' }
export const CHANGE_COLUMNS = [
	{ prop: 'title', label: '公告标题', align: 'center' },
	{
		prop: 'createTime', label: '创建时间', align: 'center', width: 140,
		formatter: ({ createTime }) => createTime ? formatDate(createTime) : '--'
	},
	{
		prop: 'releaseTime', label: '发布时间', align: 'center', width: 140,
		formatter: ({ releaseTime }) => releaseTime ? formatDate(releaseTime) : '--'
	},
	{ prop: 'createrName', label: '发布人员', align: 'center', },
	{ prop: 'typeName', label: '公告分类', align: 'center' },
	{
		prop: 'status', label: '发布状态', align: 'center',
		formatter: ({ status }) => status in statusData ? statusData[status] : '--'
	},
];

export const GET_STATUS = {
	all: null,
	draft:-3,
	pending: -2,
	tobesent: -1,
	hasbeensent: 0,
	cancelled: 1,
	finished: 2,
}
export const TAB_CONFIG = [
	{ name: 'all', label: '全部' },
	{ name: 'pending', label: '待审核' },
	{ name: 'tobesent', label: '待发布' },
	{ name: 'hasbeensent', label: '已发布' },
	{ name: 'cancelled', label: '已驳回' },
	{ name: 'finished', label: '已取消' },
	{ name: 'draft', label: '草稿' },
]
export const ANNOUNCEMENT_DETAIL_STATUS = {
	'-3': '草稿',
	'-2': '待审核',
	'-1': '待发布',
	0: '已发布',
	1: '已驳回',
	2: '已取消',
}