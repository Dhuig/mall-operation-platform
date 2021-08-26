export const CLOUD_BUSINESS_REMITTANCE_CONFIG = {
	form: [
    {
      label: '服务中心编号',
      key: 'no',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号',
		},
		{
      label: '服务中心名称',
      key: 'noName',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心名称',
		},
		{
      label: '提交时间',
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
						label: '待审核'
					},
					{
						value: '3',
						label: '已完成'
					},
					{
						value: '4',
						label: '已取消'
					}
			],
		},
		{
      label: '新款类型',
      key: 'type',
      type: 'select',
      value: '',
			placeholder: '请选择新款类型',
			options: [
					{
						value: '1',
						label: '全部'
					},
					{
						value: '2',
						label: '押货款'
					},
					{
						value: '3',
						label: '转销售'
					},
					{
						value: '4',
						label: '其他'
					}
			],
		},
		{
      label: '资金来源',
      key: 'status',
      type: 'select',
      value: '',
			placeholder: '请选择资金来源',
			options: [
					{
						value: '1',
						label: '委托扣款'
					},
					{
						value: '2',
						label: '自动退款'
					},
					{
						value: '3',
						label: '手工退款'
					},
					{
						value: '4',
						label: '转销售退款'
					}
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
	{ prop: 'serviceCenterNo', label: '服务中心编号', align: 'center' },
	{ prop: 'branchOfficeNo', label: '分公司编号', align: 'center' },
	{ prop: 'payBank', label: '付款银行名称', align: 'center' },
	{ prop: 'payAccount', label: '付款账号', align: 'center' },
  { prop: 'disbursements', label: '款项金额', align: 'center' },
  { prop: 'disbursementsType', label: '款项类型', align: 'center' },
  { prop: 'fundsSource', label: '资金来源', align: 'center' },
  { prop: 'type', label: '处理类型', align: 'center' },
	{ prop: 'transferTime', label: '转账时间', align: 'center' },
	{ prop: 'systemTime', label: '系统到账时间', align: 'center' },
	{ prop: 'status', label: '状态', align: 'center' },
	{ prop: 'submitPerson', label: '提交人', align: 'center' },
	{ prop: 'submitTime', label: '提交时间', align: 'center' },
	{ prop: 'ReviewedPerson', label: '审核人', align: 'center' },
	{ prop: 'ReviewedTime', label: '审核时间', align: 'center' },
	{ prop: 'ReviewedResult', label: '审核结果', align: 'center' },
];
// 待审核
export const TOBEREVIEWED_COLUMNS = [
	{ prop: 'serviceCenterNo', label: '服务中心编号', align: 'center' },
	{ prop: 'branchOfficeNo', label: '分公司编号', align: 'center' },
	{ prop: 'payBank', label: '付款银行名称', align: 'center' },
	{ prop: 'payAccount', label: '付款账号', align: 'center' },
  { prop: 'disbursements', label: '款项金额', align: 'center' },
  { prop: 'disbursementsType', label: '款项类型', align: 'center' },
  { prop: 'fundsSource', label: '资金来源', align: 'center' },
  { prop: 'type', label: '处理类型', align: 'center' },
	{ prop: 'status', label: '状态', align: 'center' },
	{ prop: 'submitPerson', label: '提交人', align: 'center' },
	{ prop: 'submitTime', label: '提交时间', align: 'center' },
]
// 已审核
export const PASSED_COLUMNS = [
	{ prop: 'serviceCenterNo', label: '服务中心编号', align: 'center' },
	{ prop: 'branchOfficeNo', label: '分公司编号', align: 'center' },
	{ prop: 'payBank', label: '付款银行名称', align: 'center' },
	{ prop: 'payAccount', label: '付款账号', align: 'center' },
  { prop: 'disbursements', label: '款项金额', align: 'center' },
  { prop: 'disbursementsType', label: '款项类型', align: 'center' },
  { prop: 'fundsSource', label: '资金来源', align: 'center' },
  { prop: 'type', label: '处理类型', align: 'center' },
	{ prop: 'status', label: '状态', align: 'center' },
	{ prop: 'submitPerson', label: '提交人', align: 'center' },
	{ prop: 'submitTime', label: '提交时间', align: 'center' },
	{ prop: 'ReviewedPerson', label: '审核人', align: 'center' },
	{ prop: 'ReviewedTime', label: '审核时间', align: 'center' },
	{ prop: 'ReviewedResult', label: '审核结果', align: 'center' },
]

