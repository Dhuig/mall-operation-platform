import { CUSTOMER_TYPE } from '@/component/customerManagement/config';
import { optionGenerator } from 'util';
import { formatCurrency, addPrefixForAmount } from 'util/formValidation';
// 列表搜索栏 配置
export const WALLET_RECONCILIATION_SEARCH_CONFIG = {
  form: [
    {
      label: '分公司编号',
      key: 'branchCompanyCode',
      type: 'select',
      value: '',
      placeholder: '请输入分公司编号'
    },
    {                           //3. datePicker类型（此时可以配置config字段）
      label: '月份',
      key: 'month',
      type: 'datePicker',  
      value: '',
      config: {
          type: 'month',              //daterange 日期范围类型
          valueFormat: 'yyyy-MM',
          pickerOptions:{},              // 支持快捷键日期配置
          placeholder: '请选择月份'
      }
    },
    {
      label: '顾客类型',
      key: 'userType',
      type: 'select',
      value: '',
      options: optionGenerator(CUSTOMER_TYPE).slice(0, 4),
      placeholder: '请选择顾客类型'
    },
    {
      label: '顾客编号',
      key: 'userNumber',
      type: 'input',
      value: '',
      placeholder: '请输入顾客编号'
    },
    {
      label: '会员卡号',
      key: 'userCode',
      type: 'input',
      value: '',
      placeholder: '请输入会员卡号'
    },
  ],
  // rules: {
  //   month: [{ required: true, message: '请选择月份', trigger: 'blur' }],
  //   branchCompanyCode: [{ required: true, message: '请选择分公司编号', trigger: 'blur' }],
  // }
}

// 列表表格 配置
export const WALLET_RECONCILIATION_COLUMNS_CONFIG = [
  {	prop: 'month', label: '月份', align: 'center' },
  {	prop: 'branchCompanyCode', label: '分公司编号', align: 'center' },
  {	prop: 'userName', label: '顾客姓名', align: 'center' },
  {	prop: 'userNumber', label: '顾客编号', align: 'center', width: 120 },
  {	prop: 'userCode', label: '会员卡号', align: 'center', width: 120 },
  {	prop: 'userType', label: '顾客类型', align: 'center',
    formatter: ({userType}) => {
      return userType in CUSTOMER_TYPE ? CUSTOMER_TYPE[userType]: '';
    }
  },
  {	prop: 'lastSurplus', label: '上月结余', align: 'center',
    formatter: ({lastSurplus}) => {
      return addPrefixForAmount(formatCurrency(lastSurplus));
    }
  },
  {	prop: 'remitAmount', label: '本月汇款金额', align: 'center', width: 120,
    formatter: ({remitAmount}) => {
      return addPrefixForAmount(formatCurrency(remitAmount));
    }
 },
  {	prop: 'usedAmount', label: '本月使用金额', align: 'center', width: 120,
    formatter: ({usedAmount}) => {
      return addPrefixForAmount(formatCurrency(usedAmount));
    }
  },
  {	prop: 'cashOutAmount', label: '本月提现金额', align: 'center', width: 120,
    formatter: ({cashOutAmount}) => {
      return addPrefixForAmount(formatCurrency(cashOutAmount));
    }
  },
  {	prop: 'creditAmountChange', label: '信用额变化', align: 'center', width: 120,
    formatter: ({creditAmountChange}) => {
      return addPrefixForAmount(formatCurrency(creditAmountChange));
    }
  },
  {	prop: 'computeSurplus', label: '计算结余', align: 'center', width: 120,
    formatter: ({computeSurplus}) => {
      return addPrefixForAmount(formatCurrency(computeSurplus));
    }
  },
  {	prop: 'surplus', label: '本月结余', align: 'center', width: 120,
    formatter: ({surplus}) => {
      return addPrefixForAmount(formatCurrency(surplus));
    }
  },
  {	prop: 'discrepanciesAmount', label: '差异', align: 'center', width: 120,
    formatter: ({discrepanciesAmount}) => {
      return addPrefixForAmount(formatCurrency(discrepanciesAmount));
    }
  },
  {	prop: 'fee', label: '本月手续费', align: 'center', width: 120,
    formatter: ({fee}) => {
      return addPrefixForAmount(formatCurrency(fee));
    }
  },
  {	prop: 'lastWalletAmount', label: '上月现金钱包余额', align: 'center', width: 120,
    formatter: ({lastWalletAmount}) => {
      return addPrefixForAmount(formatCurrency(lastWalletAmount));
    }
  },
  {	prop: 'lastCreditAmount', label: '上月固定信用余额', align: 'center', width: 120,
    formatter: ({lastCreditAmount}) => {
      return addPrefixForAmount(formatCurrency(lastCreditAmount));
    }
  },
  {	prop: 'lastTempCreditAmount', label: '上月临时信用余额', align: 'center', width: 120,
    formatter: ({lastTempCreditAmount}) => {
      return addPrefixForAmount(formatCurrency(lastTempCreditAmount));
    }
  },
  {	prop: 'beginRepayments', label: '上月待还金额', align: 'center', width: 120,
    formatter: ({beginRepayments}) => {
      return addPrefixForAmount(formatCurrency(beginRepayments));
    }
  },
  {	prop: 'walletAmount', label: '本月现金钱包余额', align: 'center', width: 120,
    formatter: ({walletAmount}) => {
      return addPrefixForAmount(formatCurrency(walletAmount));
    }
  },
  {	prop: 'creditAmount', label: '本月固定信用余额', align: 'center', width: 120,
    formatter: ({creditAmount}) => {
      return addPrefixForAmount(formatCurrency(creditAmount));
    }
  },
  {	prop: 'tempCreditAmount', label: '本月临时信用余额', align: 'center', width: 120,
    formatter: ({tempCreditAmount}) => {
      return addPrefixForAmount(formatCurrency(tempCreditAmount));
    }
  },
  {	prop: 'endRepayments', label: '本月待还金额', align: 'center', width: 120,
    formatter: ({endRepayments}) => {
      return addPrefixForAmount(formatCurrency(endRepayments));
    }
  },
]

// 交易类型 映射
const TRANS_TYPE_OPTIONS = [
  { label: '订单购货', value: 'PAY' },
  { label: '订单退款', value: 'REFUND' },
  { label: '充值', value: 'RECHARGE' },
  { label: '信用额还款', value: 'REPAYMENT' },
  { label: '提现', value: 'WITHDRAW' },
  { label: '手工录入', value: 'ARTIFICIAL' },
  { label: '信用额发放', value: 'MATURITY' },
  { label: '信用额到期', value: 'GRANT' },
]
// 账款类型 映射
const ACCOUNTS_TYPE_OPTIONS = [
  { label: '汇款金额' , value: 'REMIT_AMOUNT' },
  { label: '使用金额' , value: 'USED_AMOUNT' },
  { label: '提现金额' , value: 'CASH_OUT_AMOUNT' },
  { label: '信用额变化' , value: 'CREDIT_AMOUNT_CHANGE' },
]
// 详情搜索栏 配置
export const WALLET_RECONCILIATION_DETAIL_SEARCH_CONFIG = {
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
      label: '交易类型',
      key: 'tradeType',
      type: 'select',
      value: '',
      placeholder: '请选择交易类型',
      options: TRANS_TYPE_OPTIONS,
    },
    {
      label: '账款类型',
      key: 'accountsAmountType',
      type: 'select',
      value: '',
      placeholder: '请选择账款类型',
      options: ACCOUNTS_TYPE_OPTIONS,
    },
    {
      label: '订单号',
      key: 'orderId',
      type: 'input',
      value: '',
      placeholder: '请输入订单号'
    },
  ],
  rules: {
    monthrange: [{ required: true, message: '请选择月份区间', trigger: 'blur' }]
  }
} 
// 详情列表 配置
export const WALLET_RECONCILIATION_DETAIL_COLUMNS_CONFIG = [
  {	prop: 'branchCompanyCode', label: '分公司编号', align: 'center' },
  {	prop: 'orderId', label: '订单号', align: 'center' },
  {	prop: 'tradeId', label: '交易流水号', align: 'center' },
  {	prop: 'bankAccount', label: '银行账号', align: 'center' },
  {	prop: 'tradeType', label: '交易类型', align: 'center' },
  {	prop: 'tradeAmount', label: '交易金额', align: 'center',
    formatter: ({tradeAmount}) => {
      return addPrefixForAmount(tradeAmount);
    }
  },
  {	prop: 'createTime', label: '支付日期', align: 'center', width: 150, },
  {	prop: 'payType', label: '支付方式', align: 'center' },
  {	prop: 'bankType', label: '银行类别', align: 'center' },
]