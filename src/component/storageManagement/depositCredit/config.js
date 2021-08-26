import { formatDate } from 'util/formValidation.js';
import {optionGenerator,dateRangePickerGenerator} from 'util';

// 服务中心信誉额列表页-请求接口路径
export const URL_TYPE = {
	'all': '/mgmt/inventory/mortgageAmount/listMortgageAmountCredit',
	'tobeReviewed': '/mgmt/inventory/mortgageAmount/listMortgageAmountCreditWait2Verify',
}

// 服务中心信誉额列表页-分公司
export const COMPANY_TYPE = {
	1: '总公司',
	2: '分公司',
	3: '上海商业',
	4: '扬州公司',
	5: '吉林公司',
	6: '广东公司',
}

// 服务中心信誉额列表页-类型
export const SOURCE = {
	1: '服务中心后台',
	2: '运营后台',
}

// 服务中心信誉额列表页-金额类型
export const MONEY_TYPE = {
	0: '全部',
	1: '金额>0',
	2: '金额=0',
}
// 服务中心信誉额列表页-变更记录 changeRecord
export const CHANGE_RECORD = {
	0: '全部',
	1: '存在',
	2: '不存在',
}



// 服务中心信誉额列表页-审核状态
export const VERIFY_STATUS = {
	1: '通过',
	2: '拒绝',
	3: '待审核'
}

// 服务中心信誉额详情页-类型
export const DETAIL_TYPE = {
	'all': 0,
	'tobeReviewed': 3,
}
// 押货信誉额列表
export const DEPOSIT_CREDIT_LIST_CONFIG = {
	form: [
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
			placeholder: '请输入服务中心编号',
			showForever:true
    },
		{
      label: '分公司',
      key: 'companyCode',
      type: 'select',
      value: '',
			placeholder: '请选择分公司',
			options: optionGenerator(COMPANY_TYPE),
			showForever:true
		},
		{
      label: '到期日期',
      key: 'expireTime',
      type: 'datePicker',
      value: [],
      config: {
        type: 'daterange',
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
				endPlaceholder: '结束日期',
				pickerOptions: {
					disabledDate() {},
					shortcuts: [
						dateRangePickerGenerator('最近一周', 7),
						dateRangePickerGenerator('最近一个月', 30),
						dateRangePickerGenerator('最近三个月', 90),
						dateRangePickerGenerator('最近半年', 180),
						dateRangePickerGenerator('最近一年', 365),
					],
				},
			},
			showForever:true
		},
		{
      label: '审核月份',
      key: 'examineMonth',
      type: 'datePicker',
      value: [],
      config: {
        type: 'monthrange',
			},
		},
		{
      label: '当前信誉额',
      key: 'moneyType',
      type: 'select',
      value: '',
			placeholder: '请选择金额',
			options: optionGenerator(MONEY_TYPE),
		},
		{
      label: '变更记录',
      key: 'changeRecord',
      type: 'select',
      value: '',
			placeholder: '请选择变更记录',
			options: optionGenerator(CHANGE_RECORD),
    },
  ],
}
// 押货信誉额列表-待审核
export const STAY_EXAMINE_LIST_CONFIG = {
	form: [
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
			placeholder: '请输入服务中心编号',
			showForever:true
    },
		{
      label: '分公司',
      key: 'companyCode',
      type: 'select',
      value: '',
			placeholder: '请选择分公司',
			options: optionGenerator(COMPANY_TYPE),
			showForever:true
		},
		{
      label: '到期日期',
      key: 'expireTime',
      type: 'datePicker',
      value: [],
      config: {
        type: 'daterange',
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
				endPlaceholder: '结束日期',
				pickerOptions: {
					disabledDate() {},
					shortcuts: [
						dateRangePickerGenerator('最近一周', 7),
						dateRangePickerGenerator('最近一个月', 30),
						dateRangePickerGenerator('最近三个月', 90),
						dateRangePickerGenerator('最近半年', 180),
						dateRangePickerGenerator('最近一年', 365),
					],
				},
			},
			showForever:true
		},
		{
      label: '当前信誉额',
      key: 'moneyType',
      type: 'select',
      value: '',
			placeholder: '请选择金额',
			options: optionGenerator(MONEY_TYPE),
		},
		{
      label: '变更记录',
      key: 'changeRecord',
      type: 'select',
      value: '',
			placeholder: '请选择变更记录',
			options: optionGenerator(CHANGE_RECORD),
    },
  ],
}
// 服务中心信誉额列表页-列表配置-全部
export const All_LIST_COLUMNS = [
	{ prop: 'companyName', label: '分公司', align: 'left' },
  { prop: 'storeCode', label: '服务中心编号', align: 'left' },
  { prop: 'shopType', label: '网点类型', align: 'left' },
	{ prop: 'money', label: '当前信誉额', align: 'left',
	formatter: ({money}) => {
		return '￥' + money;
	}
	},
  {
		prop: 'verifyTimeStr',
		label: '审核时间',
		align: 'left',
		width: 180
	},
	{
		prop: 'endTimeStr',
		label: '到期时间',
		align: 'left',
		width: 180
	},
];
// 服务中心信誉额列表页-列表配置-待审核
export const TOBEREVIEWED_LIST_COLUMNS = [
	{
		prop: 'storeCode',
		label: '服务中心编号',
		align: 'left',
		width: 120
	},
	{
		prop: 'companyName',
		label: '分公司',
		align: 'left',
		width: 120
	},
	{
		prop: 'money',
		label: '调整金额',
		align: 'left'
	},
	{
		prop: 'applyRemark',
		label: '调整理由',
		align: 'left',
		width: 120
	},
	// {
	// 	prop: 'openTime',
	// 	label: '生效日期',
	// 	align: 'left',
	// 	formatter: ({openTime}) => {
	// 		return formatDate(openTime);
	// 	},
	// 	width: 180
	// },
	// {
	// 	prop: 'endTime',
	// 	label: '到期日期',
	// 	align: 'left',
	// 	formatter: ({endTime}) => {
	// 		return formatDate(endTime);
	// 	},
	// 	width: 180
	// },
	{
		prop: 'submitter',
		label: '提交人',
		align: 'left'
	},
	{
		prop: 'createTime',
		label: '提交时间',
		align: 'left',
		formatter: ({createTime}) => {
			return formatDate(createTime);
		},
		width: 180
	},
	{
		prop: 'endTime',
		label: '到期时间',
		align: 'left',
		width: 180,
		formatter: ({endTime}) => {
			return formatDate(endTime);
		}
	},
	{
		prop: 'verifyStatus',
		label: '审核状态',
		align: 'left',
		formatter: ({ verifyStatus }) => {
			return verifyStatus in VERIFY_STATUS ? VERIFY_STATUS[verifyStatus] : '';
		},
	},
]

// 详情页-列表搜索配置
export const DEPOSIT_CREDIT_DETAIL_CONFIG = {
	form: [
		{
      label: '审核日期',
      key: 'examineTime',
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
      label: '到期日期',
      key: 'expireTime',
      type: 'datePicker',
      value: [],
      config: {
        type: 'daterange',
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
				endPlaceholder: '结束日期',
				pickerOptions: {
					disabledDate() {},
					shortcuts: [
						dateRangePickerGenerator('最近一周', 7),
						dateRangePickerGenerator('最近一个月', 30),
						dateRangePickerGenerator('最近三个月', 90),
						dateRangePickerGenerator('最近半年', 180),
						dateRangePickerGenerator('最近一年', 365),
					],
				},
			},
		},
	]
}

// 详情页-全部
export const All_DETAIL_COLUMNS = [
	{
		prop: 'money',
		label: '调整金额',
		align: 'left',
		formatter: ({money}) => {
			return '￥' + money;
		}
	},
	{
		prop: 'source',
		label: '类型',
		align: 'left',
		width:100,
		formatter: ({ source }) => {
			return source in SOURCE ? SOURCE[source] : '';
		},
	},
	{ prop: 'applyRemark', label: '调整备注', align: 'left' },
  // {
	// 	prop: 'openTime',
	// 	label: '生效日期',
	// 	align: 'left',
	// 	width:150,
	// 	formatter: ({openTime}) => {
	// 		return formatDate(openTime);
	// 	}
	// },
  {
		prop: 'createTime',
		label: '提交时间',
		align: 'left',
		width:150,
		formatter: ({createTime}) => {
			return formatDate(createTime);
		}
	},
	{
		prop: 'endTime',
		label: '到期日期',
		align: 'left',
		width:150,
		formatter: ({endTime}) => {
			return formatDate(endTime);
		}
	},
	{ prop: 'submitter', label: '提交人', align: 'left' },
	{
		prop: 'verifyStatus',
		label: '审核状态',
		align: 'left',
		formatter: ({ verifyStatus }) => {
			return verifyStatus in VERIFY_STATUS ? VERIFY_STATUS[verifyStatus] : '';
		},
	},
  {
		prop: 'verifierTime',
		label: '审核时间',
		align: 'left',
		width:150,
		formatter: ({verifierTime}) => {
			return formatDate(verifierTime);
		}
	},
  { prop: 'verifier', label: '审核人', align: 'left' },
  { prop: 'verifyRemark', label: '审核备注', align: 'left' },
];
// 详情页-待审核
export const TOBEREVIEWED_DETAIL_COLUMNS = [
	{
		prop: 'money',
		label: '调整金额',
		align: 'left',
		formatter: ({money}) => {
			return '￥' + money;
		}
	},
	{
		prop: 'applyRemark',
		label: '调整理由',
		align: 'left'
	},
	{
		prop: 'openTime',
		label: '生效日期',
		align: 'left',
		width:150,
		formatter: ({openTime}) => {
			return formatDate(openTime);
		}
	},
	{
		prop: 'endTime',
		label: '到期日期',
		align: 'left',
		width:150,
		formatter: ({endTime}) => {
			return formatDate(endTime);
		}
	},
	{
		prop: 'submitter',
		label: '提交人',
		align: 'left'
	},
	{
		prop: 'createTime',
		label: '提交时间',
		align: 'left',
		width: 150,
		formatter: ({createTime}) => {
			return formatDate(createTime);
		}
	},
	{
		prop: 'verifyStatus',
		label: '审核状态',
		align: 'left',
		formatter: ({ verifyStatus }) => {
			return verifyStatus in VERIFY_STATUS ? VERIFY_STATUS[verifyStatus] : '';
		},
	},
]
