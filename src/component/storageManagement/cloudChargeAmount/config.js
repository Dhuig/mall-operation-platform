import { formatDate } from 'util/formValidation.js';

// 服务中心押货额列表页-请求接口路径
export const URL_TYPE = {
	'all': '/mgmt/inventory/mortgageAmount/listMortgageAmountMaxRemit',
	'tobeReviewed': '/mgmt/inventory/mortgageAmount/listMortgageAmountMaxRemitWait2Verify',
}

// 服务中心押货额列表页-分公司
export const COMPANY_TYPE = {
	1: '完美有限公司',
	2: '广东分公司',
	3: '北京分公司',
	4: '湖北分公司',
	5: '广西分公司',
}

// 服务中心押货额列表页-申请类型
export const SOURCE = {
	1: '服务中心后台',
	2: '运营后台',
}

//服务中心押货额列表页-审核状态
export const VERIFY_STATUS = {
	1: '通过',
	2: '拒绝',
	3: '待审核'
}

// 服务中心押货额详情页-类型
export const DETAIL_TYPE = {
	'all': 0,
	'tobeReviewed': 3,
}

export const CLOUD_CHARGE_LIST_CONFIG = {
	form: [
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号',
    },
		{
      label: '分公司',
      key: 'companyCode',
			type: 'select',
			bindKey: 'serviceCompanyOptions',
      value: '',
			placeholder: '请选择分公司',
			options: [],
		},
  ],
}
// 服务中心押货额管理-待审核列表 搜索条件 tobeReviewed
export const TOBEREVIWED_LIST_CONFIG = {
	form: [
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号',
    },
		{
      label: '分公司',
      key: 'companyCode',
      type: 'select',
			value: '',
			bindKey: 'serviceCompanyOptions',
			placeholder: '请选择分公司',
			options: [],
		},
    {
      label: '提交时间',
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
  ],
}
// 服务中心押货额管理-列表配置-全部
export const All_LIST_COLUMNS = [
	{ prop: 'province', label: '省份', align: 'left' },
	{
		prop: 'companyName',
		label: '分公司',
		align: 'left'
	},
	{ prop: 'storeCode', label: '服务中心编号', align: 'left',width:100 },
	{ prop: 'shopType', label: '网点类型', align: 'left',width:120 },
	{ prop: 'maxRemitAmount', label: '最大押货额度', align: 'left',width:130,formatter:({maxRemitAmount}) => {return maxRemitAmount} },
	{ prop: 'remitUsed', label: '已汇款金额', align: 'left',formatter:({remitUsed}) => {return remitUsed} },
	{ prop: 'returnAmount', label: '已退款金额', align: 'left',formatter:({returnAmount}) => {return returnAmount} },
  { prop: 'balance', label: '当前实际押货余额', align: 'left',width:150,formatter:({balance}) => {return balance} },
  { prop: 'credit', label: '当前信誉额', align: 'left',formatter:({credit}) => {return credit} },
];
// 服务中心押货额管理-列表配置-待审核
export const TOBEREVIEWED_LIST_COLUMNS = [
	{
		prop: 'storeCode',
		label: '服务中心编号',
		align: 'left',
		width:100
	},
	{
		prop: 'companyName',
		label: '分公司',
		align: 'left',
		width:120
	},
	{
		prop: 'currentMaxRemit',
		label: '当前额度',
		align: 'left',
		formatter:({currentMaxRemit}) => {return currentMaxRemit}
	},
	{
		prop: 'money',
		label: '申请调整为',
		align: 'left'
	},
	{
		prop: 'applyRemark',
		label: '调整备注',
		align: 'left',
		width:120
	},
	{
		prop: 'submitter',
		label: '提交人',
		align: 'left'
	},
	{
		prop: 'submitTimeStamp',
		label: '提交时间',
		align: 'left',
		width:180,
		formatter: ({submitTimeStamp}) => {
			return formatDate(submitTimeStamp*1000);
		}
	},
	{
		prop: 'source',
		label: '申请类型',
		align: 'left',
		width:100,
		formatter: ({ source }) => {
			return source in SOURCE ? SOURCE[source] : '';
		},
	},
	{
		prop: 'verifyStatus',
		label: '状态',
		align: 'left',
		formatter: ({ verifyStatus }) => {
			return verifyStatus in VERIFY_STATUS ? VERIFY_STATUS[verifyStatus] : '';
		},
	}
]

// 服务中心押货额管理详情页-列表配置-全部
export const ALL_DETAIL_COLUMNS = [
	{ prop: 'currentMaxRemit', label: '当前额度', align: 'left' },
  { prop: 'money', label: '申请调整为', align: 'left' },
  { prop: 'applyRemark', label: '调整备注', align: 'left' },
  { prop: 'submitter', label: '提交人', align: 'left' },
  {
		prop: 'submitTimeStamp',
		label: '提交时间',
		align: 'left',
		width: '150',
		formatter: ({submitTimeStamp}) => {
			return formatDate(submitTimeStamp*1000);
		}
	},
  {
		prop: 'source',
		label: '申请类型',
		align: 'left',
		formatter: ({ source }) => {
			return source in SOURCE ? SOURCE[source] : '';
		},
	},
  {
		prop: 'verifyStatus',
		label: '状态',
		align: 'left',
		formatter: ({ verifyStatus }) => {
			return verifyStatus in VERIFY_STATUS ? VERIFY_STATUS[verifyStatus] : '';
		},
	},
	{ prop: 'verifier', label: '审核人', align: 'left' },
	{
		prop: 'verifyTimeStamp',
		label: '审核时间',
		align: 'left',
		width: '150',
		formatter: ({verifyTimeStamp}) => {
			return formatDate(verifyTimeStamp*1000);
		}
	},
	{
		prop: 'verifyStatus',
		label: '审核结果',
		align: 'left',
		formatter: ({ verifyStatus }) => {
			return verifyStatus in VERIFY_STATUS ? VERIFY_STATUS[verifyStatus] : '';
		},
	},
	{ prop: 'verifyRemark', label: '审核备注', align: 'left' },
]
// 服务中心押货额管理详情页-列表配置-待审核
export const TOBEREVIEWED_DETAIL_COLUMNS = [
  { prop: 'currentMaxRemit', label: '当前额度', align: 'left' },
  { prop: 'money', label: '申请调整为', align: 'left' },
  { prop: 'applyRemark', label: '调整备注', align: 'left' },
	{ prop: 'submitter', label: '提交人', align: 'left' },
  {
		prop: 'submitTimeStamp',
		label: '提交时间',
		align: 'left',
		formatter: ({submitTimeStamp}) => {
			return formatDate(submitTimeStamp*1000);
		}
	},
  {
		prop: 'source',
		label: '申请类型',
		align: 'left',
		formatter: ({ source }) => {
			return source in SOURCE ? SOURCE[source] : '';
		},
	},
  {
		prop: 'verifyStatus',
		label: '状态',
		align: 'left',
		formatter: ({ verifyStatus }) => {
			return verifyStatus in VERIFY_STATUS ? VERIFY_STATUS[verifyStatus] : '';
		},
	},
]
