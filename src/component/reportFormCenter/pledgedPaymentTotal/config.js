import { addPrefixForAmount, formatDate } from 'util/formValidation.js'
import { optionGenerator } from 'util'
// 累计已汇押货款余额 - 搜索项
export const PLEDGED_PAYMENT_TOTAL_SEARCH_CONFIG = {
  form: [
    {                           //3. datePicker类型（此时可以配置config字段）
      label: '月份区间',
      key: 'monthrange',
      type: 'datePicker',  
      value: '',
      config: {
          type: 'monthrange',              //daterange 日期范围类型
          rangeSeparator: '~',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions:{}              // 支持快捷键日期配置
      }
    },
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',  
      value: '',
      placeholder: '请输入服务中心编号'
    },
    {
      label: '所属分公司编号',
      key: 'companyCode',
      type: 'select',  
      value: '',
      filterable: true,
      bindKey: 'serviceCompanyOptions',
      placeholder: '请选择所属分公司编号'
    }
  ],
}

// 累计已汇押货款余额 - 列表项
export const PLEDGED_PAYMENT_TOTAL_COLUMNS_CONFIG = [
  {	prop: 'month', label: '月份', align: 'center',
    formatter: ({month}) => {
      return month ? String(month).replace(/(\d{4})(\d{2})/, `$1-$2`) : '';
    }
  },
  {	prop: 'storeCode', label: '服务中心编号', align: 'center', width: 120, },
  {	prop: 'companyCode', label: '所属分公司编号', align: 'center', width: 120, },
  {	prop: 'preAddRefundMortgage', label: '上月累计已汇押货款', align: 'center', width: 150,
    summary: true, sumConfig: { type: 'money' },
    formatter: ({preAddRefundMortgage}) => {
      return addPrefixForAmount(preAddRefundMortgage);
    }
  },
  {	prop: 'addMortgageAmount', label: '本月汇押货款', align: 'center', width: 150,
    summary: true, sumConfig: { type: 'money' },
    formatter: ({addMortgageAmount}) => {
      return addPrefixForAmount(addMortgageAmount);
    }
  },
  {	prop: 'refoundMortgageAmount', label: '本月退押货款', align: 'center', width: 150,
    summary: true, sumConfig: { type: 'money' },
    formatter: ({refoundMortgageAmount}) => {
      return addPrefixForAmount(refoundMortgageAmount);
    }
  },
  {	prop: 'addRefundMortgage', label: '本月累计已汇押货款', align: 'center', width: 150,
    summary: true, sumConfig: { type: 'money' },
    formatter: ({addRefundMortgage}) => {
      return addPrefixForAmount(addRefundMortgage);
    }
  },
]

// 款项类型字典
export const PAYMENT_TYPE = {
  1: '汇押货款',
  2: '1:3押货退款申请',
  3: '新增信誉额',
  4: '超额押货款确认押货款',
  5: '无法识别款确认押货款',
  6: '扣减信誉额',
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
// 调整原因选项
export const ADJUST_REASON = {
  1: '汇押货款',
  2: '退押货款',
  3: '其他',
}

export const PAYMENT_TYPE_TO_ADJUST_REASON = [
  {label: 1, value: [1, 5, 4, 8, 11]},
  {label: 2, value: [2, 7, 9, 10]},
  {label: 12, value: [12]},
]
// 汇押货款、退押货款详情 - 搜索项
export const PLEDGED_PAYMENT_DETAIL_SEARCH_CONFIG = {
  form: [
    {
      label: '调整原因',
      key: 'adjustReason',
      type: 'select',  
      value: '',
      placeholder: '请选择调整原因',
      options: [{label:'全部', value: null},...optionGenerator(ADJUST_REASON)],
    },
  ]
}
// 汇押货款、退押货款详情 - 综合信息项
export const PLEDGED_PAYMENT_DETAIL_BASEINFO_LIST = [
  {	prop: 'month', label: '月份', align: 'center' },
  {	prop: 'companyCode', label: '所属分公司编号', align: 'center' },
  {	prop: 'storeCode', label: '服务中心编号', align: 'center' },
  {	prop: 'storeName', label: '服务中心名称', align: 'center' },
  {	prop: 'preAddRefundMortgage', label: '上月累计已汇押货款', align: 'center',
    formatter: ({preAddRefundMortgage}) => {
      return addPrefixForAmount(preAddRefundMortgage);
    }
  },
  {	prop: 'addMortgageAmount', label: '本月汇押货款', align: 'center',
    formatter: ({addMortgageAmount}) => {
      return addPrefixForAmount(addMortgageAmount);
    }
  },
  {	prop: 'refoundMortgageAmount', label: '本月退押货款', align: 'center',
    formatter: ({refoundMortgageAmount}) => {
      return addPrefixForAmount(refoundMortgageAmount);
    }
  },
  {	prop: 'addRefundMortgage', label: '本月累计已汇押货款', align: 'center',
    formatter: ({addRefundMortgage}) => {
      return addPrefixForAmount(addRefundMortgage);
    }
  },
]

// 汇押货款、退押货款详情 - 列表项
export const PLEDGED_PAYMENT_DETAIL_COLUMNS_CONFIG = [
  {	prop: 'recordTypeName', label: '款项类型', align: 'center', 
    
  },
  {	prop: 'adjustReason', label: '调整原因', align: 'center',
  },
  {	prop: 'diffMoney', label: '款项金额', align: 'center',
    formatter: ({diffMoney}) => {
      return addPrefixForAmount(diffMoney);
    }
  },
  {	prop: 'balance', label: '实际押货余额', align: 'center',
    formatter: ({balance}) => {
      return addPrefixForAmount(balance);
    }
  },
  {	prop: 'createTime', label: '时间', align: 'center',
    formatter: ({createTime}) => {
      return createTime ? formatDate(new Date(createTime).getTime()) : '';
    }
  },
]

