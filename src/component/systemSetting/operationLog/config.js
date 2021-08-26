// import { genCurrentMonthFirstAndLastDay } from 'util';
import { formatDate } from 'util/formValidation.js';


// 搜索
export const OPERATION_LOG_SEARCH = {
	form: [
		{
			label: '操作人',
			key: 'operator',
			type: 'input',
			value: '',
			placeholder: '请输入操作人名称',
		},
		{
			label: '选择日期',
			key: 'logTimeRange',
			type: 'datePicker',
			value:  [undefined, undefined],
			config: {
				type: 'daterange',
			},
		},
		{
			label: '操作模块',
			key: 'module',
			type: 'input',
			value: '',
			placeholder: '请输入操作模块',
		},
		{
			label: '操作内容',
			key: 'content',
			type: 'input',
			value: '',
			placeholder: '请输入操作内容',
		},
	]
};

// 列表 列定义
export const OPERATION_LOG_COLUMN = [
	{
		prop: 'ip',
		label: 'IP地址',
		align: 'center',
	},
	{
		prop: 'operator',
		label: '操作人',
		align: 'center',
	},
	{
		prop: 'time',
		label: '操作时间',
		align: 'center',
		formatter: ({ time }) => time ? formatDate(time) : '',
	},
	{ prop: 'path', label: '页面地址', align: 'center' },
	{ prop: 'module', label: '操作模块', align: 'center' },
	{ prop: 'content', label: '操作内容', align: 'center' },
];
