// 配件管理-搜索配置
export const PARTS_MANAGE_LIST_CONFIG = {
	form: [
		{
			label: '产品编码',
			key: 'productSerialno',
			type: 'input',
			value: '',
			placeholder: '请输入产品编码'
		},
		{
			label: '产品名称',
			key: 'productTitle',
			type: 'input',
			value: '',
			placeholder: '请输入产品名称'
		},
		{
			label: '配件编码',
			key: 'fittingSerialno',
			type: 'input',
			value: '',
			placeholder: '请输入配件编码'
		},
		{
			label: '配件名称',
			key: 'fittingTitle',
			type: 'input',
			value: '',
			placeholder: '请输入配件名称'
		}
	],

}
// 配件管理-列表配置
export const PARTS_MANAGE_LIST_COLUMNS = [
	{
		prop: 'productSerialno',
		label: '产品编码',
		align: 'left',
	},
	{
		prop: 'productTitle',
		label: '产品名称',
		align: 'left',
	},
	{
		prop: 'fittingSerialno',
		label: '配件编码',
		align: 'left',
	},
	{
		prop: 'fittingTitle',
		label: '配件名称',
		align: 'left',
	},
	{
		prop: 'fittingPrice',
		label: '配件价',
		align: 'left',
	},
]
