import { optionGenerator } from 'util'
import { formatCurrency, addPrefixForAmount } from 'util/formValidation';

// 列表搜索栏 配置
export const PLEDGE_STATISTICAL_HISTORY_SEARCH_CONFIG = {
  form: [
    {                           //3. datePicker类型（此时可以配置config字段）
      label: '月份区间',
      key: 'monthrange',
      type: 'datePicker',  
      value: '',
      config: {
          type: 'monthrange',              //daterange 日期范围类型
          pickerOptions:{},              // 支持快捷键日期配置
          placeholder: '请选择月份'
      }
    },
    {
      label: '分公司编号',
      key: 'companyCode',
      type: 'select',
      value: '',
      placeholder: '请选择分公司编号',
      options: []
    },
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号'
    },
  ],
  rules: {
    monthrange: [{ required: true, message: '请选择月份区间', trigger: 'blur' }]
  }
}

// 列表表格 配置
export const PLEDGE_STATISTICAL_HISTORY_COLUMNS_CONFIG = [
  {	prop: 'newMonth', label: '月份', align: 'center' },
  {	prop: 'shopCode', label: '服务中心编号', align: 'center', width: 100, },
  {	prop: 'companyCode', label: '公司编号', align: 'center', width: 100, },
  {	prop: 'lastMonthMortgageBalance', label: '上月剩余押货额', align: 'center', width: 120,
    formatter: ({lastMonthMortgageBalance}) => {
      return addPrefixForAmount(formatCurrency(lastMonthMortgageBalance));
    }
  },
  {	prop: 'monthRemittanceMortgage', label: '本月汇押货款', align: 'center', width: 120,
  formatter: ({monthRemittanceMortgage}) => {
    return addPrefixForAmount(formatCurrency(monthRemittanceMortgage));
  } 
  },
  {	prop: 'monthDistributionReturn', label: '本月配送返还', align: 'center', width: 120,
  formatter: ({monthDistributionReturn}) => {
    return addPrefixForAmount(formatCurrency(monthDistributionReturn));
  } 
  },
  {	prop: 'monthMallReturn', label: '本月商城退货', align: 'center', width: 120,
  formatter: ({monthMallReturn}) => {
    return addPrefixForAmount(formatCurrency(monthMallReturn));
  } 
  },
  {	prop: 'monthUseMortgage', label: '本月已用押货额', align: 'center', width: 120,
  formatter: ({monthUseMortgage}) => {
    return addPrefixForAmount(formatCurrency(monthUseMortgage));
  } 
  },
  {	prop: 'monthMortgageCredit', label: '本月押货信誉额', align: 'center', width: 120, 
  formatter: ({monthMortgageCredit}) => {
    return addPrefixForAmount(formatCurrency(monthMortgageCredit));
  } 
  },
  {	prop: 'monthMortgageAdjust', label: '本月调整金额', align: 'center', width: 120, 
  formatter: ({monthMortgageAdjust}) => {
    return addPrefixForAmount(formatCurrency(monthMortgageAdjust));
  } 
  },
  {	prop: 'monthMortgageBalance', label: '本月剩余押货额', align: 'center', width: 120, 
  formatter: ({monthMortgageBalance}) => {
    return addPrefixForAmount(formatCurrency(monthMortgageBalance));
  } 
  },
  {	prop: 'monthCountMortgageBalance', label: '计算本月结余', align: 'center', width: 120, 
  formatter: ({monthCountMortgageBalance}) => {
    return addPrefixForAmount(formatCurrency(monthCountMortgageBalance));
  } 
  },
  {	prop: 'monthMortgageBalanceDiffer', label: '差异', align: 'center', width: 120, 
  formatter: ({monthMortgageBalanceDiffer}) => {
    return addPrefixForAmount(formatCurrency(monthMortgageBalanceDiffer));
  } 
  },
  {	prop: 'allRemittanceMortgage', label: '累计已汇押货款', align: 'center', width: 120, 
  formatter: ({allRemittanceMortgage}) => {
    return addPrefixForAmount(formatCurrency(allRemittanceMortgage));
  } 
  },
  {	prop: 'maxRemittanceMortgage', label: '最大可汇押货款', align: 'center', width: 120, 
  formatter: ({maxRemittanceMortgage}) => {
    return addPrefixForAmount(formatCurrency(maxRemittanceMortgage));
  } 
  },
  {	prop: 'shopName', label: '服务中心名称', align: 'center', width: 120, },
]
// 调整原因 选项
const ADJUST_TYPE_OPTIONS = {
  1: '配送返还',
  2: '商城退货',
  3: '押货使用',
  4: '押货退货',
  5: '押货调整',
  7: '汇押货款',
  8: '退押货款',
  9: '新增押货信誉额',
  10: '押货信誉额还款',
  11: '产品调价',
}
// 账款类型 选项
const MONEY_TYPE_OPTIONS = {
  1: '汇押货款',
  2: '配送返还',
  3: '商城退货',
  4: '已用押货额',
  5: '押货信誉额',
  6: '调整金额',
}
// 详情搜索栏 配置
export const PLEDGE_STATISTICAL_HISTORY_DETAIL_SEARCH_CONFIG = {
  form: [
    {                           //3. datePicker类型（此时可以配置config字段）
      label: '月份区间',
      key: 'monthrange',
      type: 'datePicker',  
      value: '',
      config: {
          type: 'monthrange',              //daterange 日期范围类型
          pickerOptions:{},              // 支持快捷键日期配置
          placeholder: '请选择月份'
      }
    },
    {
      label: '调整原因',
      key: 'adjustType',
      type: 'select',
      value: '',
      placeholder: '请选择调整原因',
      options: optionGenerator(ADJUST_TYPE_OPTIONS)
    },
    {
      label: '账款类型',
      key: 'moneyType',
      type: 'select',
      value: '',
      placeholder: '请选择账款类型',
      options: optionGenerator(MONEY_TYPE_OPTIONS)
    },
    {
      label: '单号',
      key: 'mortgageOrderNo',
      type: 'input',
      value: '',
      placeholder: '请输入单号',
    },
  ],
  rules: {
    monthrange: [{ required: true, message: '请选择月份区间', trigger: 'blur' }]
  }
}

// 详情表格 配置
export const PLEDGE_STATISTICAL_HISTORY_DETAIL_COLUMNS_CONFIG = [
  {	prop: 'moneyTypeName', label: '款项类型', align: 'center' },
  {	prop: 'typeName', label: '调整原因', align: 'center' },
  {	prop: 'amount', label: '增减额度（元）', align: 'center',
    formatter: ({amount}) => {
      return addPrefixForAmount(formatCurrency(amount));
    }
  },
  {	prop: 'availableMortgageAmount', label: '可用余额', align: 'center',
    formatter: ({availableMortgageAmount}) => {
      return addPrefixForAmount(formatCurrency(availableMortgageAmount));
    }
  },
  {	prop: 'relationNo', label: '对应单号', align: 'center' },
  {	prop: 'createTime', label: '时间', align: 'center', width: 150, },
  {	prop: 'remark', label: '备注', align: 'center' },
]