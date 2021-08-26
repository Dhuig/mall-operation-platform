import { CUSTOMER_TYPE } from '@/component/customerManagement/config';
import { optionGenerator, dateRangePickerGenerator } from 'util'
// tablelist列表显示数字方法
const tableZeroShow = (number) => {
  return typeof number == 'number' ? String(number) : '';
}
// 列表页-搜索栏1
export const PERFECT_WALLET_LIST_CONFIG_ONE = {
	form: [
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号',
		},
		{
      label: '会员卡号',
      key: 'cardNo',
      type: 'input',
      value: '',
      placeholder: '请输入会员卡号',
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
// 列表页-搜索栏2
export const PERFECT_WALLET_LIST_CONFIG_TWO = {
	form: [
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号',
		},
		{
      label: '会员卡号',
      key: 'cardNo',
      type: 'input',
      value: '',
      placeholder: '请输入会员卡号',
    },
		{
      label: '普客手机号码',
      key: 'mobile',
      type: 'input',
      value: '',
      placeholder: '请输入普客手机号码',
    },
    {
      label: '分公司编号',
      key: 'companyCode',
      type: 'select',
      value: '',
      filterable: true,
      placeholder: '请选择分公司编号',
      options: [],
		},
		{
      label: '顾客类型',
      key: 'cardTypeList',
      type: 'select',
      value: '',
      multiple: true,
			placeholder: '请选择顾客类型',
			options: optionGenerator(CUSTOMER_TYPE).slice(0,4),
		},
		{
      label: '是否有信用额',
      key: 'creditEnable',
      type: 'select',
      value: '',
			placeholder: '请选择是否有信用额',
			options: [
					{
							value: true,
							label: '是'
					},
					{
							value: false,
							label: '否'
					}
			],
		},
		{
      label: '实际结余为负',
      key: 'negativeEnable',
      type: 'select',
      value: false,
			placeholder: '请选择实际结余为负',
      options: [
        {
          value: true,
          label: '是'
        },
        {
          value: false,
          label: '否'
        },
      ]
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
// 列表页-表格配置
export const LIST_COLUMNS = [
	{
    prop: 'companyNo',
    label: '分公司编号',
    align: 'center',
    headerConfig: { topTips: '1' },
  },
	{ 
    prop: 'mobile', 
    label: '会员卡号/普客手机号码', 
    align: 'center',
    width: 150,
    headerConfig: { topTips: '3' },
    formatter: ({cardNo, mobile}) => {  // 会员卡号/普客手机号码合并
      return cardNo || mobile;  
    }
  },
  {
    prop: 'realname',
    label: '顾客姓名',
    align: 'center',
    headerConfig: { topTips: '4' },
  },
  {
    prop: 'cardTypeDesc',
    label: '顾客类型',
    align: 'center',
    headerConfig: { topTips: '5' },
  },
  { 
    prop: 'lastMothBalanceAmt', 
    label: '上期实际结余', 
    align: 'center',
    width: 120,
    summary: true,
    headerConfig: { topTips: '6' },
    formatter: ({ lastMothBalanceAmt, lastMothBalanceAmtDesc }) => {
      let result;
      if(lastMothBalanceAmtDesc.indexOf('月结中') != -1){
        result = '月结中';
      }else{
        result = lastMothBalanceAmt ? tableZeroShow(lastMothBalanceAmt) : '0';
      }

      return result;
    }
  },
  { 
    prop: 'thisMonthRemitAmt', 
    label: '本期汇款', 
    align: 'center', 
    width: 120,
    summary: true,
    headerConfig: { topTips: '7' },
    formatter: ({ thisMonthRemitAmt }) => {
      return tableZeroShow(thisMonthRemitAmt);
    }
  },
	{ 
    prop: 'thisMonthUseAmt', 
    label: '本期使用', 
    align: 'center',
    width: 120,
    summary: true,
    headerConfig: { topTips: '8' },
    formatter: ({thisMonthUseAmt}) => {
      return tableZeroShow(thisMonthUseAmt);
    }
  },
  { 
    prop: 'thisMonthWithdrawAmt', 
    label: '本期提现', 
    align: 'center',
    width: 120,
    summary: true,
    headerConfig: { topTips: '9' },
    formatter: ({thisMonthWithdrawAmt}) => {
      return tableZeroShow(thisMonthWithdrawAmt);
    }
  },
	{ 
    prop: 'thisMonthActualBalanceAmt', 
    label: '本期实际结余', 
    align: 'center',
    width: 120,
    summary: true,
    headerConfig: { topTips: '10=6+7+8+9' },
    formatter: ({thisMonthActualBalanceAmt}) => {
      return tableZeroShow(thisMonthActualBalanceAmt);
    }
  },
	{ 
    prop: 'thisCreditAmt', 
    label: '当前信用额', 
    align: 'center',
    width: 120,
    summary: true,
    headerConfig: { topTips: '11' },
    formatter: ({thisCreditAmt}) => {
      return tableZeroShow(thisCreditAmt);
    }
  },
	{ 
    prop: 'thisBigWalletBalanceAmt', 
    label: '本期大钱包余额（财务用）', 
    align: 'center',
    width: 120,
    summary: true,
    headerConfig: { topTips: '12=10+11' },
    formatter: ({thisBigWalletBalanceAmt}) => {
      return tableZeroShow(thisBigWalletBalanceAmt);
    }
  },
	{ 
    prop: 'thisFrozenAmt', 
    label: '提现冻结', 
    align: 'center',
    width: 120,
    summary: true,
    headerConfig: { topTips: '13' },
    formatter: ({thisFrozenAmt}) => {
      return tableZeroShow(thisFrozenAmt);
    }
  },
	{ 
    prop: 'thisAvailableBalanceAmt', 
    label: '本期可用余额（业务用）', 
    align: 'center',
    width: 110,
    summary: true,
    headerConfig: { topTips: '14=10+11-13' },
    formatter: ({thisAvailableBalanceAmt}) => {
      return tableZeroShow(thisAvailableBalanceAmt);
    }
  },
];

// 详情页 - 信息栏配置
// export const PERFECT_WALLET_DETAIL_MESSAGE = {
//   memberId: '',
//   realname: '',
//   actualBalance: '',
//   lastMonthBalance: '',
//   thisMonthTransferAmount: '',
//   thisMonthUseAmount: '',
//   thisMonthWithdrawalAmount: '',
//   otherAmount: '',
//   creditAmount: '',
//   creditEffectTime: '',
//   creditInvalidTime: '',
// }

// 前端交易类型
export const FRONT_TRANS_TYPE = {
  1: '汇入',
  2: '退货',
  3: '购货', 
  4: '提现',
  5: '退款',
  6: '信用额',
  7: '转款',
  8: '其他',
}
// 后台交易类型
export const BACK_TRANS_TYPE = {
  1: '充值',
  2: '购货转入', 
  3: '退货转入', 
  4: '购货支付', 
  5: '提现', 
  6: '原路退款', 
  7: '信用额增加',
  8: '信用额扣减' ,
  9: '还欠款', 
  10: '补银行流水', 
  11: '手工退款', 
  12: '押货款与钱包互转', 
  13: '其他',
}
export const REPORT_FORM_KEY = {
  1: '本期汇款',
  2: '本期使用',
  3: '本期提现'
}
// 详情页-搜索栏配置
export const PERFECT_WALLET_DETAIL_CONFIG = {
	form: [
		{
			label: '交易月份',
			key: 'transactionMonth',
			type: 'datePicker',
			value: '',
			config: {
					type: 'monthrange',
					rangeSeparator: '~',
					startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
            shortcuts: [
              dateRangePickerGenerator('最近一个月', 30),
              dateRangePickerGenerator('最近三个月', 90),
              dateRangePickerGenerator('最近半年', 180),
              dateRangePickerGenerator('最近一年', 365),
            ],
          }
			}
    },
    {
      label: '报表字段',
      key: 'reportField',
      type: 'select',  
      value: '',
      options: optionGenerator(REPORT_FORM_KEY),
      placeholder: '请选择报表字段'
    },
		{
      label: '前端交易类型',
      key: 'receptionTransType',
      type: 'select',  
      value: '',
      options: optionGenerator(FRONT_TRANS_TYPE),
      placeholder: '请选择前端交易类型'
    },
    {
      label: '后台交易类型',
      key: 'backstageTransType',
      type: 'select',  
      value: '',
      options: optionGenerator(BACK_TRANS_TYPE),
      placeholder: '请选择后台交易类型'
    },
    {
      label: '订单编号',
      key: 'orderNo',
      type: 'input',  
      value: '',
      placeholder: '请输入订单编号'
    },
    {
      label: '是否有信用额',
      key: 'creditEnable',
      type: 'select',  
      value: '',
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
      placeholder: '请选择是否有信用额'
    },
  ],
  rules: {
    transactionMonth: [{required: true, message: '请选择交易月份', trigger: 'blur'}]
  }
}
// 支付方式
export const PAY_METHOD = {
  101: "微信支付",
  102: "支付宝支付",
  103: "银联",
  202: "建设银行",
  204: "交通银行"
}

// 详情页-表头1
export const DETAIL_COLUMNS_ONE = [
	{ 
    prop: 'companyCode', 
    label: '分公司编号', 
    align: 'center',
  },
  { 
    prop: 'receptionTransTypeDesc', 
    label: '前端交易类型', 
    align: 'center',
  },
  { 
    prop: 'backstageTransTypeDesc', 
    label: '后台交易类型', 
    align: 'center',
  },
  { 
    prop: 'transAmt', 
    label: '交易金额', 
    align: 'center',
    summary: true,
    formatter: ({ transAmt }) => {
      return tableZeroShow(transAmt);
    }
  },
  { 
    prop: 'transTime', 
    label: '交易日期', 
    align: 'center',
  },
  { 
    prop: 'bankAccount', 
    label: '银行账号', 
    align: 'center',
  },
  {
    prop: 'transMethod',
    label: '支付方式',
    align: 'center',
  },
	{ 
    prop: 'orderNo', 
    label: '订单号', 
    align: 'center',
    slot: 'orderNo',
    width: 180,
  },
  { 
    prop: 'transNo', 
    label: '流水号', 
    align: 'center',
  },
  // {
  //   prop: 'callbackTimeDesc',
  //   label: '银行回调时间',
  //   align: 'center',
  // },
];

// 手工录入款项 -- rules
export const HAND_INPUT_RULES = {
  type: [{ required: true, message: '请选择款项类型', trigger: 'change' }],
  adjustAmount: [{ required: true, validator: numberAndDot, trigger: 'blur' }],
  adjustReason: [{ required: true, message: '请输入修改原因说明', trigger: 'blur' }],
};

export const MONEY_TYPE = [
  {
    value: '1',
    label: '线上充值'
  },
  {
      value: '2',
      label: '购货充值'
  },
  {
      value: '3',
      label: '退货充值'
  },
  {
      value: '4',
      label: '清结算充值'
  },
  {
      value: '5',
      label: '手工调整'
  },
  {
      value: '6',
      label: '提现'
  },
  {
      value: '7',
      label: '退款（原路退回）'
  },
  {
      value: '8',
      label: '购货支付'
  }
]

// 关联单号详情弹窗 列表配置
export const ORDER_LIST_COLUMNS = [
  { prop: 'orderNo', label: '订单号', align: 'center' },
  { prop: 'orderPableAmt', label: '实付金额', align: 'center' },
]

// 验证只能输入数字(正负)，支持小数点后两位
export function numberAndDot(rule, value, callback) {
	const reg = /^([-+])?(\d+(?:\.\d{0,2})?)$/;
	if(!reg.test(value)) {
			callback('请输入输入数字，支持小数点后2位')
	}else {
		callback()
	}
}
