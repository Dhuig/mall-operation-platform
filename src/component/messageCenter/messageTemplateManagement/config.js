export const MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG = {
	form: [
		{
			label: '模板编号',
			key: 'templateCode',
			type: 'input',
			value: '',
			placeholder: '请输入模板编号',
		},
		{
			label: '模板名称',
			key: 'templateName',
			type: 'input',
			value: '',
			placeholder: '请输入模板名称',
		},
		{
			label: '编辑时间',
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
			label: '消息类型',
			key: 'msgType',
			type: 'select',
			value: '',
			placeholder: '请选择消息类型',
			options: [],
		},
		{
			label: '模板状态',
			key: 'status',
			type: 'select',
			value: '',
			placeholder: '请选择模板状态',
			options: [
				{
					value: '-1',
					label: '全部'
				},
				{
					value: '1',
					label: '启用'
				},
				{
					value: '0',
					label: '停用'
				},
			],
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
	{ prop: 'templateCode', label: '模板编号', align: 'center' },
	{ prop: 'templateName', label: '模板名称', align: 'center' },
	{ prop: 'updateTime', label: '编辑时间', align: 'center' },
	{ prop: 'msgType', label: '消息类型', align: 'center' },
	{
		prop: 'status', label: '模板状态', align: 'center',
		formatter: ({ status }) => {
			return Object.values([{ '0': '已停用' }, { '1': '启用中' }].filter(e => Object.keys(e)[0] * 1 === status)[0])[0]
		}
	},
];
