import { optionGenerator } from 'util';
import { formatDate ,addPrefixForAmount} from 'util/formValidation.js';
// 银行选项
export const BANK_TYPE = {
  1: '中国工商银行',
  2: '中国建设银行',
}
// 款项类型(13种)
export const PAYMENT_TYPE = {
  1: "汇押货款",
  2: "1:3押货款退款申请",
  3: "超额押货款退款",
  4: "超额押货款押货款",
  5: "无法识别款押货款",
  6: "无法识别款退款",
  7: "退押货款",
  8: "手工增加押货款",
  9: "转销售",
  10: "押货款还钱包欠款",
  11: "钱包还押货款",
  12: "其它",
  13: "产品调价",
  14: '钱包款与押货款互转',
}
// 手工款项类型（基于13种）
export const PAYMENT_TYPE_HANDLE = {
  // 7: '退押货款',
  // 8: '手工增加押货款',
  // 9: '转销售',
  // 10: '押货款还钱包欠款',
  // 11: '钱包还押货款',
  // 12: '其它'
}
// 款项类型（新：9种）
export const NEW_PAYMENT_TYPE = {
  // 1: '汇押货款',
  // 2: '1:3押货退款申请',
  // 3: '超额押货款退款',
  // 6: '无法识别款退款',
  // 7: '手工退押货款',
  // 8: '手工增押货款',
  // 9: '转销售',
  // 12: '其它',
  // 14: '钱包款与押货款互转',
}
// 资金来源
export const PAYMENG_SOURCE = {
  1: '银行汇款',
  2: '业务数据',
  3: '后台录入',
}
// 处理类型
export const DEAL_TYPE = {
  1: '自动',
  2: '手工',
}
// 审核结果
export const VERIFY_RESULT = {
  1: '审核通过',
  2: '审核不通过',
}

// 银行汇款流水搜索项配置
export const BANK_REMITTANCE_FLOW_SEARCH_CONFIG = {
  form: [
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号',
    },
    {
      label: '分公司编号',
      key: 'companyCode',
      type: 'input',
      value: '',
      placeholder: '请输入所属分公司编号',
    },
    {
      label: '付款银行',
      key: 'bankName',
      type: 'select',
      value: '',
      placeholder: '请选择银行名称',
      options: optionGenerator(BANK_TYPE),
    },
    {
      label: '款项类型',
      key: 'sourceType',
      type: 'select',
      value: '',
      placeholder: '请选择款项类型',
      options: optionGenerator(NEW_PAYMENT_TYPE),
    },
    {
      label: '自动/手工',
      key: 'dealType',
      type: 'select',
      value: '',
      placeholder: '请选择自动/手工',
      options: [
        { value: 1, label: '自动' },
        { value: 2, label: '手工' },
      ],
    },
    {
      label: '系统到账时间',
      key: 'sysTime',
      type: 'datePicker',
      value: '',
      config: {
        type: 'daterange',
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        placeholder: '请选择系统到账时间',
      }
    },
    {
      label: '审核时间',
      key: 'verifyTime',
      type: 'datePicker',
      value: '',
      config: {
        type: 'daterange',
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        placeholder: '请选择审核时间',
      }
    },
    {
      label: '录入时间',
      key: 'inputTime',
      type: 'datePicker',
      value: '',
      config: {
        type: 'daterange',
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        placeholder: '请选择录入时间',
      }
    },
  ]
}

// 银行汇款流水列表项配置
export const BANK_REMITTANCE_FLOW_COLUMNS_CONFIG = [
  { prop: 'waterNo', label: '流水号', align: 'center', width: 180 },
  { prop: 'storeCode', label: '服务中心编号', align: 'center', width: 100 },
  { prop: 'companyCode', label: '所属分公司编号', align: 'center' },
  { prop: 'remitMoney', label: '款项金额', align: 'center', width: 120,
    summary: true, summaryConfig: { type: 'money' },
    formatter: ({remitMoney}) => {
      return remitMoney ? addPrefixForAmount(remitMoney) : '';
    }
  },
  { prop: 'sourceTypeName', label: '款项类型', align: 'center', width: 150, },
  { prop: 'changeReason', label: '交易类型', align: 'center' },
  { prop: 'bankPaymentTimeStamp', label: '银行到账时间', align: 'center',
    width: 150,
    formatter: ({bankPaymentTimeStamp}) => {
      return formatDate(bankPaymentTimeStamp*1000) || '无';
    }
  },
  { prop: 'systemPaymentTimeStamp', label: '系统到账时间', align: 'center', width: 150,
    formatter: ({systemPaymentTimeStamp}) => {
      return formatDate(systemPaymentTimeStamp*1000) || '无';
    }
  },
  { prop: 'bankName', label: '付款银行', align: 'center' },
  { prop: 'account', label: '付款账号', align: 'center', width: 150 },
  { prop: 'dealType', label: '自动/手工', align: 'center',
    formatter: ({dealType}) => {
      return dealType ? DEAL_TYPE[dealType] : '';
    }
  },
  { prop: 'dealTime', label: '处理时间', align: 'center', width: 150,
    formatter: ({dealTime}) => {
      return formatDate(dealTime) || '无';
    }
  },
  { prop: 'inputMan', label: '录入人', align: 'center', width: 120,
    formatter: ({inputMan}) => {
      return inputMan || '无';
    }
  },
  { prop: 'createTime', label: '录入时间', align: 'center', width: 150, 
    formatter: ({createTime}) => {
      return formatDate(createTime) || '无';
    }
  },
  { prop: 'remark', label: '录入备注', align: 'center',
    formatter: ({remark}) => {
      return remark || '无';
    }
  },
  { prop: 'verifyer', label: '审核人', align: 'center', width: 120,
    formatter: ({verifyer}) => {
      return verifyer || '无';
    }
  },
  { prop: 'dealTime', label: '审核时间', align: 'center', width: 150, 
    formatter: ({dealTime}) => {
      return formatDate(dealTime) || '无';
    }
  },
  { prop: 'dealRemark', label: '审核备注', align: 'center', width: 120, },
]

// 无法识别流水处理搜索项配置
export const UNKNOWN_DEAL_STATUS = {
  'pending': 0,
  'processed': 1
}
export const DEAL_STATUS = {
  '0': '待处理',
  '1': '已处理',
}
export const UNKNOWN_FLOW_DEAL_SEARCH_CONFIG = {
  form: [
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号',
    },
    {
      label: '分公司编号',
      key: 'companyCode',
      type: 'input',
      value: '',
      placeholder: '请输入所属分公司编号',
    },
    {
      label: '付款银行',
      key: 'bankName',
      type: 'select',
      value: '',
      placeholder: '请选择银行名称',
      options: optionGenerator(BANK_TYPE),
    },
    {
      label: '系统到账时间',
      key: 'sysTime',
      type: 'datePicker',
      value: '',
      config: {
        type: 'daterange',
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        placeholder: '请选择系统到账时间',
      }
    },
  ]
}
// 已处理状态列表 新增列
export const COLUMNS_OPTIONS_ADD_DEALMAN = [
  { prop: 'dealMan', label: '处理人', align: 'center', width: 150 },
  { prop: 'dealTime', label: '处理时间', align: 'center', width: 150,
    formatter: ({dealTime}) => {
      return formatDate(dealTime);
    }
  },
]
// 无法识别流水处理列表项配置
export const UNKNOWN_FLOW_DEAL_COLUMNS_CONFIG = [
  { prop: 'waterNo', label: '流水号', align: 'center', width: 150 },
  { prop: 'storeCode', label: '服务中心编号', align: 'center', width: 100, },
  { prop: 'companyCode', label: '所属分公司编号', align: 'center', width: 110, },
  { prop: 'bankName', label: '付款银行', align: 'center', width: 180 },
  { prop: 'account', label: '付款账号', align: 'center', width: 150 },
  { prop: 'remitMoney', label: '款项金额', align: 'center',
    formatter: ({remitMoney}) => {
      return remitMoney ? addPrefixForAmount(remitMoney) : '';
    }
  },
  { prop: 'dealType', label: '处理类型', align: 'center',
    formatter: ({dealType}) => {
      return dealType ? DEAL_TYPE[dealType] : '';
    }
  },
  { prop: 'bankPaymentTimeStamp', label: '银行到账时间', align: 'center', width: 150,
    formatter: ({bankPaymentTimeStamp}) => {
      return bankPaymentTimeStamp ? formatDate(bankPaymentTimeStamp*1000) : '';
    }
  },
  { prop: 'systemPaymentTimeStamp', label: '系统到账时间', align: 'center', width: 150,
    formatter: ({systemPaymentTimeStamp}) => {
      return systemPaymentTimeStamp ? formatDate(systemPaymentTimeStamp*1000) : '';
    }
  },
  { prop: 'dealStatus', label: '状态', align: 'center',
    formatter: ({dealStatus}) => {
      return DEAL_STATUS[dealStatus] || '';
    }
  },
]

// 手工录入流水及审核搜索项配置
export const VERIFY_STATUS_NAME_TO_NUM = {
  'tobeReview': 0,
  'reviewed': 1
}
export const HAND_INPUT_FLOW_SEARCH_CONFIG = {
  form: [
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号',
    },
    {
      label: '分公司编号',
      key: 'companyCode',
      type: 'input',
      value: '',
      placeholder: '请输入所属分公司编号',
    },
    {
      label: '款项类型',
      key: 'sourceType',
      type: 'select',
      value: '',
      placeholder: '请选择款项类型',
      options: optionGenerator(PAYMENT_TYPE_HANDLE),
    },
    {
      label: '付款银行',
      key: 'bankName',
      type: 'select',
      value: '',
      placeholder: '请选择银行名称',
      options: optionGenerator(BANK_TYPE),
    },
    {
      label: '审核结果',
      key: 'verifyResult',
      type: 'select',
      value: '',
      placeholder: '请选择审核结果',
      options: [
        { value: 1, label: '审核通过' },
        { value: 2, label: '审核拒绝' },
      ],
    },
  ]
}

// 手工录入流水及审核列表项配置
export const VERIFY_STATUS = {
  '0': '待审核',
  '1': '已审核'
}
export const HAND_INPUT_FLOW_COLUMNS_CONFIG = [
  { prop: 'waterNo', label: '流水号', align: 'center', width: 180 },
  { prop: 'storeCode', label: '服务中心编号', align: 'center', width: 100 },
  { prop: 'companyCode', label: '所属分公司编号', align: 'center', width: 110 },
  { prop: 'bankName', label: '付款银行', align: 'center' },
  { prop: 'account', label: '付款账号', align: 'center', width: 150 },
  { prop: 'remitMoney', label: '款项金额', align: 'center', width: 120,
    formatter: ({remitMoney}) => {
      return remitMoney ? addPrefixForAmount(remitMoney) : '';
    }
  },
  { prop: 'sourceTypeName', label: '款项类型', align: 'center', width: 120, },
  { prop: 'changeReason', label: '交易类型', align: 'center' },
  { prop: 'dealType', label: '自动/人工', align: 'center',
    formatter: ({dealType}) => {
      return dealType ? DEAL_TYPE[dealType] : '';
    }
  },
  { prop: 'inputMan', label: '录入人', align: 'center', width: 100, },
  { prop: 'remark', label: '录入备注', align: 'center', width: 180, },
  { prop: 'createTime', label: '录入时间', align: 'center', width: 150,
    formatter: ({createTime}) => {
      return formatDate(createTime);
    }
  },
  { prop: 'verifyer', label: '审核人', align: 'center', width: 100, },
  { prop: 'verifyRemark', label: '审核备注', align: 'center', width: 150, },
  { prop: 'systemPaymentTimeExcel', label: '审核时间', align: 'center', width: 150, },
  { prop: 'verifyStatus', label: '状态', align: 'center',
    formatter: ({verifyStatus}) => {
      return VERIFY_STATUS[verifyStatus] || '';
    }
  },
  { prop: 'verifyResult', label: '审核结果', align: 'center',
    formatter: ({verifyResult}) => {
      return VERIFY_RESULT[verifyResult]||'';
    }
  },
]
