// 搜索栏 配置
export const NATURAL_MONTH_INVENTORY_STATEMENT_SEARCH = {
  form: [
    {
			label: '服务中心编号',
			key: 'shopCode',
			type: 'input',
			value: '',
			placeholder: '请输入服务中心编号',
		},
		{
			label: '月份选择',
			key: 'reportRangeType',
			type: 'select',
			value: '',
			placeholder: '请选择月份',
			options: [
        { label: '2019年9月～2021年2月', value: 1 },
        { label: '2021年3月', value: 2 },
      ],
		},
  ],
  rules: {
    shopCode: [{ required: true, message: '请输入服务中心编号', trigger: 'blur' }],
    reportRangeType: [{ required: true, message: '请选择月份', trigger: 'blur' }],
  }
}

// 列表 配置
export const NATURAL_MONTH_INVENTORY_STATEMENT_COLUMNS = [
  { prop: 'shopCode', label: '服务中心编号', align: 'center' },
  { prop: 'itemCode', label: '产品编码', align: 'center' },
  { prop: 'itemName', label: '产品名称', align: 'center' },
  { prop: 'unit', label: '单位', align: 'center' },
  { prop: 'lastBalance', label: '上期结存', align: 'center' },
  { prop: 'mortgageCount', label: '押货数量', align: 'center' },
  { prop: 'mortgageReturnCount', label: '押货退回', align: 'center' },
  { prop: 'orderCount', label: '配送数量', align: 'center' },
  { prop: 'orderReturnCount', label: '配送退回', align: 'center' },
  { prop: 'adjustCount', label: '库存调整', align: 'center' },
  { prop: 'balance', label: '本期结存', align: 'center' },
]