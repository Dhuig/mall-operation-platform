

// 分公司-地区
export const REGION_STATUS = {
	1: '华北区',
	2: '东北区',
	3: '华东区',
	4: '华中区',
	5: '东南区',
	6: '西南区',
	7: '西北区',
}



// 业务区域范围管理-搜索配置
export const BRANCH_LIST_MANAGEMENT_CONFIG = {
	form: [
		{
			label: '公司编号',
			key: 'companyCode',
			type: 'input',
			value: '',
			placeholder: '请输入公司编号'
		},
		{
			label: '负责人',
			key: 'principal',
			type: 'input',
			value: '',
			placeholder: '请输入负责人',
		},

	],
}

// 业务区域范围管理列表-表格配置
export const BRANCH_LIST_MANAGEMENT_COLUMNS = [
	{
		prop: 'code',
		label: '公司编号',
		align: 'left',
	},
	{
		prop: 'name',
		label: '公司名称',
		align: 'left',
		width:130
	},
	{
		prop: 'geographyCode',
		label: '地区',
		align: 'left',
		formatter: ({ geographyCode }) => {
			return geographyCode in REGION_STATUS ? REGION_STATUS[geographyCode] : '';
		},
	},
	{
		prop: 'principal',
		label: '负责人',
		align: 'left',
	},
	{
		prop: 'fullName',
		label: '公司全称',
		align: 'left',
		width:160
	},
	{
		prop: 'faxPhone',
		label: '传真号码',
		align: 'left',
		width:120
	},
]



