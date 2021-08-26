


// 仓库管理-搜索配置
export const STOREMANAGE_LIST_CONFIG = {
	form: [
		{
			label: '仓库编码',
			key: 'depotCode',
			type: 'input',
			value: '',
			placeholder: '请输入仓库编码'
		},
		{
			label: '业务范围',
			key: 'businessRange',
			type: 'select',
			value: '',
			options: [
				{ value: 1, label: 'B' },
				{ value: 2, label: 'C' },
				{ value: 3, label: 'B+C' },
			],
			placeholder: '请选择业务范围',
		},
	],
}


// 仓库管理-表格配置
export const STOREMANAGE_LIST_COLUMNS = [
	{
		prop: 'code',
		label: '仓库编码',
		align: 'left',
	},
	{
		prop: 'name',
		label: '仓库名称',
		align: 'left',
	},
	{
		prop: 'type',
		label: '类型',
		align: 'left',
		formatter: ({ type }) => type == '1' ? '成品仓' : '中转仓'
	},
	{
		prop: 'businessRangeStr',
		label: '业务范围',
		align: 'left',
		// formatter: ({ businessRange }) => {
		// return businessRange && businessRange.length && businessRange.map(item => {
		// 	return `<span style="overflow:'hidden';tex-overflow:'ellipsis';
		// 	white-space: nowrap" >${item}</span>`;
		// }).join('+');
		// },
	},
]
