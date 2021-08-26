export const CLOUD_BUSINESS_UNCONFIRMED_CONFIG = {
	form: [
    {
      label: '分公司编号',
      key: 'branchNo',
      type: 'input',
      value: '',
      placeholder: '请输入分公司编号',
		},
		{
      label: '分公司名称',
      key: 'branchName',
      type: 'input',
      value: '',
      placeholder: '请输入分公司名称',
		},
		{
      label: '修改时间',
      key: 'time',
      type: 'datePicker',
      value: '',
      config: {
        type: 'daterange',
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期'
      }
		},
		{
      label: '状态',
      key: 'status',
      type: 'select',
      value: '',
			placeholder: '请选择状态',
			options: [
					{
						value: '1',
						label: '全部'
					},
					{
						value: '2',
						label: '待处理'
					},
					{
						value: '3',
						label: '转手工确认'
					},
					{
						value: '4',
						label: '已作废'
					}
			],
		},
		{
      label: '处理类型',
      key: 'handleType',
      type: 'select',
      value: '',
			placeholder: '请选择处理类型',
			options: [
					{
						value: '1',
						label: '全部'
					},
					{
						value: '2',
						label: '已退款'
					},
					{
						value: '3',
						label: '转手工确认'
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

// 全部
export const All_COLUMNS = [
	{ prop: 'branchOfficeNo', label: '分公司编号', align: 'center' },
	{ prop: 'payBank', label: '付款银行名称', align: 'center' },
	{ prop: 'payAccount', label: '付款账号', align: 'center' },
  { prop: 'disbursements', label: '款项金额', align: 'center' },
	{ prop: 'systemTime', label: '系统到账时间', align: 'center' },
	{ prop: 'reason', label: '未确认原因', align: 'center' },
	{ prop: 'status', label: '状态', align: 'center' },
	{ prop: 'handlerPerson', label: '处理人', align: 'center' },
	{ prop: 'handlerType', label: '处理类型', align: 'center' },
	{ prop: 'handlerTime', label: '处理时间', align: 'center' },
	{ prop: 'remark', label: '备注', align: 'center' },
];
// 待处理
export const PENDING_COLUMNS = [
	{ prop: 'serviceCenterNo', label: '服务中心编号', align: 'center' },
	{ prop: 'branchOfficeNo', label: '分公司编号', align: 'center' },
	{ prop: 'payBank', label: '付款银行名称', align: 'center' },
	{ prop: 'payAccount', label: '付款账号', align: 'center' },
  { prop: 'disbursements', label: '款项金额', align: 'center' },
	{ prop: 'systemTime', label: '系统到账时间', align: 'center' },
	{ prop: 'reason', label: '未确认原因', align: 'center' },
	{ prop: 'status', label: '状态', align: 'center' },
]
