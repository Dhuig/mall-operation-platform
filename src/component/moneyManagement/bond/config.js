import { optionGenerator } from 'util';
// 特批押货保证金余额状态
export const SPECIAL_STATUS = {
	'0': '全部',
	'1': '金额为0',
	'2': '金额不为0'
};
// 分公司
export const BRANCH_OFFICE = {
	'0': '全部',
	'1': '广东分公司',
	'2': '河南分公司',
	'3': '河北分公司'
};
// 开店保证金余额
export const DEPOSIT_STATUS = {
	'0': '全部',
	'1': '金额为0',
	'2': '金额不为0'
};
export const BOND_LIST_CONFIG = {
	form:[
		{
      label: '服务中心编号',
      key: 'no',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号',
		},
		{
      label: '服务中心名称',
      key: 'name',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心名称',
    },
    {
      label: '特批押货保证金余额',
      key: 'code',
      type: 'select',
			value: '',
			options: optionGenerator(SPECIAL_STATUS),
      placeholder: '请选择特批押货保证金余额',
		},
		{
      label: '分公司',
      key: 'branchOffice',
      type: 'select',
			value: '',
			options: optionGenerator(BRANCH_OFFICE),
      placeholder: '请选择分公司',
		},
		{
      label: '开店保证金余额',
      key: 'code1',
      type: 'select',
			value: '',
			options: optionGenerator(DEPOSIT_STATUS),
      placeholder: '请选择开店保证金余额',
		},
	],
}

export const BOND_LIST_COLUMNS = [
	{
		label: '分公司',
		align: 'center',
		prop: 'no',
	},
	{
		label: '服务中心编号',
		align: 'center',
		prop: 'vip_card_no'
	},
	{
		label: '服务中心名称',
		align: 'center',
		prop: 'name'
	},
	{
		label: '开店保证金余额',
		align: 'center',
		prop: 'phone',
	},
	{
		label: '特批押货保证金余额',
		align: 'center',
		prop: 'certi_type',
	},
];

export const BOND_DETAIL_CONFIG = {
	form:[
		{
      label: '提交时间',
      key: 'time',
      type: 'input',
      value: '',
      placeholder: '请输入提交时间',
		},
		{
      label: '保证金类型',
      key: 'depositType',
      type: 'select',
			value: '',
			options: optionGenerator(DEPOSIT_STATUS),
      placeholder: '请选择开店保证金余额',
		},
	],
}

// 全部
export const All_COLUMNS = [
	{ prop: 'payAccount', label: '付款账号', align: 'center' },
	{ prop: 'payBankName', label: '付款银行名称', align: 'center' },
  { prop: 'transfer', label: '转账方式', align: 'center' },
  { prop: 'bondMoney', label: '保证金金额', align: 'center' },
  { prop: 'bondType', label: '保证金类型', align: 'center' },
  { prop: 'person', label: '提交人', align: 'center' },
	{ prop: 'submissionTime', label: '提交时间', align: 'center' },
	{ prop: 'ReviewedResult', label: '状态', align: 'center' },
	{ prop: 'ReviewedPerson', label: '审核人', align: 'center' },
	{ prop: 'ReviewedTime', label: '审核时间', align: 'center' },
	{ prop: 'ReviewedRemark', label: '审核备注', align: 'center' },
];
// 待审核
export const TOBEREVIEWED_COLUMNS = [
	{ prop: 'payAccount', label: '付款账号', align: 'center' },
	{ prop: 'payBankName', label: '付款银行名称', align: 'center' },
  { prop: 'transfer', label: '转账方式', align: 'center' },
  { prop: 'bondMoney', label: '保证金金额', align: 'center' },
  { prop: 'bondType', label: '保证金类型', align: 'center' },
  { prop: 'person', label: '提交人', align: 'center' },
	{ prop: 'submissionTime', label: '提交时间', align: 'center' },
	{ prop: 'ReviewedResult', label: '状态', align: 'center' },
]
