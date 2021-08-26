import { optionGenerator } from 'util';
import { formatDate } from 'util/formValidation.js'
// tablelist列表显示数字方法
export const tableZeroShow = (number) => {
  return typeof number == 'number' ? String(number) : '';
}
// 验证正整数
const rep = /^[1-9]\d*|0$/;
const integerValidator = (rule, value, callback) => {
  if (value.every(item => (rep.test(item) || !item))) {
    callback();
  } else {
    callback(new Error('请输入整数'))
  }
}
//服务中心押货余额列表 -- 搜索项
export const MORTGAGE_BALANCE_SEARCH_CONFIG = {
  form: [
    {
      label: '服务中心编号',              // 标签  （字段必配）
      key: 'storeCode',                // 对应后端的请求字段 （字段必配）
      type: 'input',          // 类型   （字段必配）
      value: '',              // 默认值 （字段必配）
      placeholder: '请输入服务中心编号',        //占位符
    },
    {
      label: '分公司',
      key: 'companyCode',
      type: 'select',
      filterable: true,
      value: '',
      placeholder: '请选择分公司',
      options: [],
    },
    {
      label: '最大押货额',
      key: 'amount',
      type: 'inputrange',
      value: [],
      placeholder: ''
    },
    {
      label: '可用押货余额',
      key: 'availableAmount',
      type: 'inputrange',
      value: [],
      placeholder: '',
    },
  ],
  rules: {
    amount: [{ validator: integerValidator, trigger: 'blur' }],
    availableAmount: [{ validator: integerValidator, trigger: 'blur' }],
  }
}

//服务中心押货余额列表 -- 列表项
export const MORTGAGE_BALANCE_COLUMNS_CONFIG = [
  {
    prop: 'storeCode',
    label: '服务中心编号',
    align: 'center',
    width: 100,
    headerConfig: {
      topTips: '1'
    }
  },
  {
    prop: 'companyName',
    label: '分公司',
    align: 'center',
    width: 140,
    headerConfig: {
      topTips: '2'
    },
    formatter: ({ companyCode = '', companyName }) => {
      return `${companyCode} ${companyName}`;
    }
  },
  {
    prop: 'lastMonthBalance',
    label: '上期结余',
    align: 'center',
    width: 150,
    summary: true,
    headerConfig: {
      topTips: '3'
    },
    formatter: ({ lastMonthBalance }) => {
      return tableZeroShow(lastMonthBalance);
    }
  },
  {
    prop: 'currentMonthRemit',
    label: '本期汇/退押货款',
    align: 'center',
    width: 150,
    summary: true,
    headerConfig: {
      topTips: '4'
    },
    formatter: ({ currentMonthRemit }) => {
      return tableZeroShow(currentMonthRemit);
    }
  },
  {
    prop: 'currentMonthSendAndReturn',
    label: '本期配送返还',
    align: 'center',
    width: 150,
    summary: true,
    headerConfig: {
      topTips: '5'
    },
    formatter: ({ currentMonthSendAndReturn }) => {
      return tableZeroShow(currentMonthSendAndReturn);
    }
  },
  {
    prop: 'currentMonthMallReturn',
    label: '本期商城退货',
    align: 'center',
    width: 150,
    summary: true,
    headerConfig: {
      topTips: '6'
    },
    formatter: ({ currentMonthMallReturn }) => {
      return tableZeroShow(currentMonthMallReturn);
    }
  },
  {
    prop: 'currentMonthMortgageUsed',
    label: '本期押货使用',
    align: 'center',
    width: 150,
    summary: true,
    headerConfig: {
      topTips: '7'
    },
    formatter: ({ currentMonthMortgageUsed }) => {
      return tableZeroShow(currentMonthMortgageUsed);
    }
  },
  {
    prop: 'currentMonthMortgageReturn',
    label: '本期押货退货',
    align: 'center',
    width: 150,
    summary: true,
    headerConfig: {
      topTips: '8'
    },
    formatter: ({ currentMonthMortgageReturn }) => {
      return tableZeroShow(currentMonthMortgageReturn);
    }
  },
  {
    prop: 'credit',
    label: '本期押货信誉额变化',
    align: 'center',
    width: 150,
    summary: true,
    headerConfig: {
      topTips: '9'
    },
    formatter: ({ credit }) => {
      return tableZeroShow(credit);
    }
  },
  {
    prop: 'adjustAmount',
    label: '本期调整金额',
    align: 'center',
    width: 150,
    summary: true,
    headerConfig: {
      topTips: '10'
    },
    formatter: ({ adjustAmount }) => {
      return tableZeroShow(adjustAmount);
    }
  },
  {
    prop: 'availableAmount',
    label: '可用押货余额',
    align: 'center',
    width: 180,
    summary: true,
    headerConfig: {
      topTips: '11=3+4+5+6+7+8+9+10'
    },
    formatter: ({ availableAmount }) => {
      return tableZeroShow(availableAmount);
    }
  },
  {
    prop: 'remitUsed',
    label: '累计已汇押货款',
    align: 'center',
    width: 150,
    summary: true,
    headerConfig: {
      topTips: '12'
    },
    formatter: ({ remitUsed }) => {
      return tableZeroShow(remitUsed);
    }
  },
  {
    prop: 'maxRemitAmount',
    label: '最大押货额',
    align: 'center',
    summary: true,
    headerConfig: {
      topTips: '13'
    },
    formatter: ({ maxRemitAmount }) => {
      return tableZeroShow(maxRemitAmount);
    }
  },
  {
    prop: 'storeName',
    label: '服务中心名称',
    align: 'center',
    width: 150
  },
]

// 款项类型（原）
export const PAYMENT_TYPE = {
  1: '汇押货款',
  2: '1:3押货退款申请',
  // 3: '超额押货款退款', //直接去掉
  4: '超额押货款确认押货款',
  5: '无法识别款确认押货款',
  // 6: '无法识别款退款', //直接去掉
  7: '手工退押货款',
  8: '手工增加押货款',
  9: '转销售',
  10: '押货款还钱包欠款',
  11: '钱包款还押货欠款',
  12: '其它',
  13: '产品调价',
  14: '押货支付',
  15: '押货退货',
  16: '押货调整',
  17: '商城订单转押货额',
  18: '商城退货减押货额',
}
// 10种映射款项类型
export const TEM_PAYMENT_TYPE = {
  1: '汇押货款',
  2: '退押货款',
  3: '信誉额',
  12: '其他',
  13: '产品调价',
  14: '押货使用',
  15: '押货退货',
  16: '押货调整',
  17: '配送返还',
  18: '商城退货',
}
// 报表字段
export const REPORT_TYPE = {
  1: '汇/退押货款',
  2: '调整金额',
  3: '信誉额',
  14: '押货使用',
  15: '押货退货',
  17: '配送返还',
  18: '商城退货',
}
// 款项类型（7项）
export const SEVEN_PAYMENT_TYPE = {
  1: '汇押货款',
  2: '1:3押货款退款申请',
  3: '手工退押货款',
  4: '手工增押货款',
  5: '转销售',
  6: '钱包款与押货款互转',
  7: '其他',
}
// 拥有关联单号的款项类型
export const LINK_ORDER_GROUPS = [14, 15, 16, 17, 18];
//服务中心押货余额详情 -- 搜索项
export const MORTGAGE_BALANCE_DETAIL_SEARCH_CONFIG = {
  form: [
    {
      label: '交易月份',
      key: 'daterange',
      type: 'datePicker',
      value: [],
      config: {
        type: 'monthrange',
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
      },
    },
    {
      label: '报表字段',
      key: 'reportType',
      type: 'select',
      value: '',
      placeholder: '请选择报表字段',
      options: optionGenerator(REPORT_TYPE),
    },
    {
      label: '款项类型',
      key: 'sevenBankType',
      type: 'select',
      value: '',
      placeholder: '请选择款项类型',
      options: optionGenerator(SEVEN_PAYMENT_TYPE),
    },
    {
      label: '交易类型',
      key: 'tenType',
      type: 'select',
      value: '',
      placeholder: '请选择交易类型',
      options: optionGenerator(TEM_PAYMENT_TYPE),
    },
    {
      label: '单号或流水号',
      key: 'bizNo',
      type: 'input',
      value: '',
      placeholder: '请输入单号或流水号',
    },
  ]
}

//服务中心押货余额详情 -- 列表项
export const MORTGAGE_BALANCE_DETAIL_COLUMNS_CONFIG = [
  {
    prop: 'tenType',
    label: '交易类型',
    align: 'center',
    formatter: ({ tenType }) => {
      return tenType in TEM_PAYMENT_TYPE ? TEM_PAYMENT_TYPE[tenType] : '';
    }
  },
  {
    prop: 'sevenBankTypeName',
    label: '款项类型',
    align: 'center',
  },
  {
    prop: 'diffMoney',
    label: '增减额度（元）',
    align: 'center',
    formatter: ({ diffMoney }) => {
      return tableZeroShow(diffMoney);
    }
  },
  {
    prop: 'businessId',
    label: '对应单号或流水号',
    align: 'center',
    width: 180,
  },
  {
    prop: 'createTime',
    label: '交易时间',
    align: 'center',
    formatter: ({ createTime }) => {
      return formatDate(createTime);
    }
  },
  {
    prop: 'remark',
    label: '备注',
    align: 'center',
  }
]
