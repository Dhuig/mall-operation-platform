import { optionGenerator } from 'util';
import { addPrefixForAmount, formatDate, formatCurrency } from 'util/formValidation'
// 账款类型 选项
const TRANSFER_TYPE_OPTIONS = {
  1: '委托扣款',
  2: '支付宝',
  3: '微信',
  4: '网银',
  5: '退款',
  6: '金存入',
  7: '其他',
  8: '无法识别退款',
}
// 款项类型 选项
const NEW_PAYMENT_TYPE = {
  1: '押货款',
  2: '开店保证金',
  3: '超额保证金',
  4: '订货款',
  5: '1 : 3押货款退款申请',
  6: '超额保证金退款申请',
  8: '超额押货款',
  9: '超额押货款退款',
  10: '手工确认押货款',
  11: '转销售',
  12: '退结点余款',
  13: '押货款还钱包欠款',
  14: '还欠款',

}
// 状态 选项
const FLOW_STATUS = {
  0: '待审核' ,
  1:'已退款',
  2:'已取消',
  3:'已审核'
}
// 列表搜索栏 配置
export const BANK_FLOW_HISTORY_SEARCH_CONFIG = {
  form: [
    {
      label: '转账类型',
      key: 'transferType',
      type: 'select',
      value: '',
      placeholder: '请选择转账类型',
      options: optionGenerator(TRANSFER_TYPE_OPTIONS),
    },
    {
      label: '分公司编号',
      key: 'companyCode',
      type: 'input',
      value: '',
      placeholder: '请输入所属分公司编号',
    },
    {
      label: '银行到账时间',
      key: 'arriveTime',
      type: 'datePicker',
      value: '',
      config: {
        type: 'daterange',
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        placeholder: '请选择银行到账时间',
      }
    },
    {
      label: '服务中心识别',
      key: 'valid',
      type: 'select',
      value: '',
      placeholder: '请选择服务中心识别',
      options: [
        { label: '已识别', value: 1, },
        { label: '未识别', value: 0, },
      ],
    },
    {
      label: '服务中心编号',
      key: 'shopCode',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号',
    },
    {
      label: '款项类型',
      key: 'moneyTypes',
      type: 'select',
      value: '',
      placeholder: '请选择款项类型',
      options: optionGenerator(NEW_PAYMENT_TYPE),
    },
  ]
}

// 列表 配置
export const BANK_FLOW_HISTORY_COLUMNS_CONFIG = [
  { prop: 'shopCode', label: '服务中心', align: 'center' },
  { prop: 'remittanceAccount', label: '付款账号', align: 'center' },
  { prop: 'bankName', label: '银行', align: 'center' },
  { prop: 'transferType', label: '转账类型', align: 'center',
    formatter: ({transferType}) => {
      return transferType in TRANSFER_TYPE_OPTIONS ? TRANSFER_TYPE_OPTIONS[transferType] : '';
    }
  },
  { prop: 'amount', label: '转账金额', align: 'center', width: 120,
    formatter: ({amount}) => { 
      return addPrefixForAmount(formatCurrency(amount));
    }
  },
  { prop: 'companyCode', label: '分公司编号', align: 'center' },
  { prop: 'moneyType', label: '款项类型', align: 'center',
    formatter: ({moneyType}) => {
      return moneyType in NEW_PAYMENT_TYPE ? NEW_PAYMENT_TYPE[moneyType] : '';
    }
  },
  { prop: 'auditType', label: '审核类型', align: 'center',
    formatter: ({auditType}) => {
      return auditType==1 ? '自动识别' : '手动转入';
    }
  },
  { prop: 'updatePerson', label: '操作人', align: 'center' },
  { prop: 'arriveTime', label: '银行到账时间', align: 'center', width: 150,
    formatter: ({arriveTime}) => {
      return formatDate(arriveTime);
    }
  },
  { prop: 'sysArriveTime', label: '系统到账时间', align: 'center', width: 150,
    formatter: ({sysArriveTime}) => {
      return formatDate(sysArriveTime);
    }
  },
  { prop: 'operationTime', label: '操作时间', align: 'center', width: 150,
    formatter: ({operationTime}) => {
      return formatDate(operationTime);
    }
  },
  { prop: 'remark', label: '备注', align: 'center' },
  { prop: 'status', label: '状态', align: 'center',
    formatter: ({status}) => {
      return status in FLOW_STATUS ? FLOW_STATUS[status] : '';
    }
  },
]