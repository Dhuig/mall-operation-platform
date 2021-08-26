import { addPrefixForAmount, formatDate } from 'util/formValidation.js'
// 钱包信用额（验证）- 搜索项
export const WALLET_CREDIT_VALID_SEARCH_CONFIG = {
  form: [
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号'
    },
    {
      label: '会员卡号',
      key: 'cardNo',
      type: 'input',
      value: '',
      placeholder: '请输入会员卡号',
    },
    {
      label: '月份',
      key: 'month',
      type: 'datePicker',
      value: formatDate(new Date(), 'month').replace('-', ''),
      config: {
        type: 'month',
        valueFormat: 'yyyyMM',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        placeholder: '请选择月份',
      }
    },
    {
      label: '分公司编号',
      key: 'companyCode',
      type: 'input',
      value: '',
      placeholder: '请输入分公司编号',
    },
  ]
}

// 钱包信用额（验证） - 列表项
export const WALLET_CREDIT_VALID_COLUMNS_CONFIG = [
  {
    prop: 'month', label: '月份', align: 'center',
    formatter: ({ month }) => {
      return month ? String(month).replace(/(\d{4})(\d{2})/, `$1-$2`) : '';
    }
  },
  { prop: 'cardNo', label: '会员卡号', align: 'center' },
  { prop: 'realname', label: '顾客姓名', align: 'center' },
  {
    prop: 'openingCreditAmount', label: '期初信用额', align: 'center',
    summary: true, sumConfig: { type: 'money' },
    formatter: ({ openingCreditAmount }) => {
      return addPrefixForAmount(openingCreditAmount);
    }
  },
  {
    prop: 'creditIncrease', label: '增加信用额', align: 'center',
    summary: true, sumConfig: { type: 'money' },
    formatter: ({ creditIncrease }) => {
      return addPrefixForAmount(creditIncrease);
    }
  },
  {
    prop: 'creditReduce', label: '扣减信用额', align: 'center',
    summary: true, sumConfig: { type: 'money' },
    formatter: ({ creditReduce }) => {
      return addPrefixForAmount(creditReduce);
    }
  },
  {
    prop: 'closingCreditAmount', label: '期末信用额', align: 'center',
    summary: true, sumConfig: { type: 'money' },
    formatter: ({ closingCreditAmount }) => {
      return addPrefixForAmount(closingCreditAmount);
    }
  },
]

// 信用额调整记录表 - 列表项
export const CREDIT_ADJUST_RECORD_COLUMNS_CONFIG = [
  // { prop: 'adjustBatchNo', label: '编号/调整批次号', align: 'center', width: 100, },
  { prop: 'cardNo', label: '会员卡号', align: 'center', width: 100, },
  { prop: 'userName', label: '顾客姓名', align: 'center', width: 100, },
  {
    prop: 'reduceAmount', label: '扣减信用额', align: 'center', width: 120,
    formatter: ({ reduceAmount }) => {
      return addPrefixForAmount(reduceAmount);
    }
  },
  {
    prop: 'increaseAmount', label: '增加信用额', align: 'center', width: 120,
    formatter: ({ increaseAmount }) => {
      return addPrefixForAmount(increaseAmount);
    }
  },
  {
    prop: 'reduceTime', label: '扣减时间', align: 'center', width: 150,
    formatter: ({ reduceTime }) => {
      return reduceTime ? formatDate(new Date(reduceTime).getTime()) : '';
    }
  },
  {
    prop: 'increaseTime', label: '增加时间', align: 'center', width: 150,
    formatter: ({ increaseTime }) => {
      return increaseTime ? formatDate(new Date(increaseTime).getTime()) : '';
    }
  },
  { prop: 'entryPersonName', label: '录入人', align: 'center', width: 100, },
  {
    prop: 'entryTime', label: '录入时间', align: 'center', width: 150,
    formatter: ({ entryTime }) => {
      return entryTime ? formatDate(new Date(entryTime).getTime()) : '';
    }
  },
  { prop: 'auditorName', label: '审核人', align: 'center', width: 100, },
  {
    prop: 'auditTime', label: '审核时间', align: 'center', width: 150,
    formatter: ({ auditTime }) => {
      return auditTime ? formatDate(new Date(auditTime).getTime()) : '';
    }
  },
]