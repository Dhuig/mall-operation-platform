import { CUSTOMER_TYPE } from '@/component/customerManagement/config'
import { optionGenerator } from 'util'
import { addPrefixForAmount } from 'util/formValidation.js'

// tablelist列表显示数字方法
const tableZeroShow = (number) => {
  return typeof number == 'number' ? String(number) : '';
}
// 是否选项
export const SWITCH_OPTIONS = [
  { label: '全部', value: 0 },
  { label: '是', value: 1 },
  { label: '否', value: 2 },
]
// 完美钱包余额表 搜索项
export const WALLET_BALANCE_SEARCH_CONFIG = {
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
      value: '',
      slotcontent: true,
      placeholder: '请输入服务中心编号'
    },
    {
      label: '会员卡号',
      key: 'cardNo',
      type: 'input',  
      value: '',
      placeholder: '请输入会员卡号'
    },
    {
      label: '普客手机号码',
      key: 'mobile',
      type: 'input',  
      value: '',
      placeholder: '请输入普客手机号码'
    },
    {
      label: '分公司编号',
      key: 'companyCode',
      type: 'select',  
      value: '',
      options: [],
      filterable: true,
      placeholder: '请选择所属分公司编号'
    },
    // {
    //   label: '顾客编号',
    //   key: 'memberNo',
    //   type: 'input',  
    //   value: '',
    //   placeholder: '请输入顾客编号'
    // },
    // {
    //   label: '顾客姓名',
    //   key: 'userName',
    //   type: 'input',  
    //   value: '',
    //   placeholder: '请输入顾客姓名'
    // },
    {
      label: '顾客类型',
      key: 'memberType',
      type: 'select',  
      value: [],
      multiple: true,
      options: optionGenerator(CUSTOMER_TYPE).slice(0,4),
      placeholder: '请选择顾客类型'
    },
    {
      label: '是否有信用额',
      key: 'closeCreditAmount',
      type: 'select',  
      value: '',
      options: SWITCH_OPTIONS,
      placeholder: '请选择是否有信用额'
    },
    {
      label: '实际余额为负',
      key: 'closeWalletAmount',
      type: 'select',  
      value: '',
      options: SWITCH_OPTIONS,
      placeholder: '请选择实际余额是否为负'
    },
  ],
  rules: {
    'monthrange': [{ required: true, message: '请选择月份',trigger: 'blur' }]
  }
}

// 完美钱包余额表 列表项
export const WALLET_BALANCE_COLUMNS_CONFIG = [
  {	prop: 'month', label: '月份', align: 'center' },
  {	prop: 'companyCode', label: '分公司编号', align: 'center', width: 100, },
  {	prop: 'num', label: '会员卡号/普客手机号码', align: 'center', width: 150, },
  // {	prop: 'memberNo', label: '顾客编号', align: 'center', width: 100, },
  // {	prop: 'cardNo', label: '会员卡号', align: 'center', width: 100, },
  {	prop: 'realname', label: '顾客姓名', align: 'center', width: 100, },
  {	prop: 'memberType', label: '顾客类型', align: 'center', width: 100,},
  {	prop: 'openingBalance', label: '上期大钱包结余', align: 'center', width: 120,
    summary: true, headerConfig: { topTips: '1+2' },
    formatter: ({openingBalance}) => {
      return tableZeroShow(openingBalance);
    }
  },
  {	prop: 'openingWalletAmount', label: '上期实际结余', align: 'center', width: 120,
    summary: true, headerConfig: { topTips: '1' },
    formatter: ({openingWalletAmount}) => {
      return tableZeroShow(openingWalletAmount);
    }
  },
  {	prop: 'openingAdjustCreditAmount', label: '期初信用额', align: 'center', width: 120,
    summary: true, headerConfig: { topTips: '2' },
    formatter: ({openingAdjustCreditAmount}) => {
      return tableZeroShow(openingAdjustCreditAmount);
    }
  },
  {	prop: 'bizAmount', label: '本期汇款', align: 'center', width: 120,
    summary: true, headerConfig: { topTips: '3' },
    formatter: ({bizAmount}) => {
      return tableZeroShow(bizAmount);
    }
  },
  {	prop: 'useMoney', label: '本期使用', align: 'center', width: 120,
    summary: true, headerConfig: { topTips: '4' },
    formatter: ({useMoney}) => {
      return tableZeroShow(useMoney);
    }
  },
  {	prop: 'withdraw', label: '本期提现', align: 'center', width: 120,
    summary: true, headerConfig: { topTips: '5' },
    formatter: ({withdraw}) => {
      return tableZeroShow(withdraw);
    }
  },
  {	prop: 'creditAdjustIncrease', label: '本期信用额增加', align: 'center', width: 120,
    summary: true, headerConfig: { topTips: '6' },
    formatter: ({creditAdjustIncrease}) => {
      return tableZeroShow(creditAdjustIncrease);
    }
  },
  {	prop: 'creditAdjustReduce', label: '本期信用额扣减', align: 'center', width: 120,
    summary: true, headerConfig: { topTips: '7' },
    formatter: ({creditAdjustReduce}) => {
      return tableZeroShow(creditAdjustReduce);
    }
  },
  {	prop: 'closingWalletAmount', label: '本期实际结余', align: 'center', width: 130,
    summary: true, headerConfig: { topTips: '8=1+3+4+5' },
    formatter: ({closingWalletAmount}) => {
      return tableZeroShow(closingWalletAmount);
    }
  },
  {	prop: 'closingAdjustCreditAmount', label: '期末信用额', align: 'center', width: 120,
    summary: true, headerConfig: { topTips: '9=2+6+7' },
    formatter: ({closingAdjustCreditAmount}) => {
      return tableZeroShow(closingAdjustCreditAmount);
    }
  },
  {	prop: 'closingBalance', label: '本期大钱包结余', align: 'center', width: 120,
    summary: true, headerConfig: { topTips: '10=9+8' },
    formatter: ({closingBalance}) => {
      return tableZeroShow(closingBalance);
    }
  },
]
// 前端交易类型
export const FRONT_TRANS_TYPE = {
  0: '全部',
  1: '汇入',
  2: '退货',
  5: '购货',
  3: '提现',
  4: '退款',
  8: '信用额',
  6: '转款',
  7: '其他',
}
// 后台交易类型
export const BACK_TRANS_TYPE = {
  0: '全部',
  1: '充值',
  2: '购货转入',
  5: '退货转入',
  3: '购货支付',
  4: '提现',
  8: '原路退款',
  6: '信用额增加',
  7: '信用额扣减',
  9: '还欠款',
  10: '补银行流水',
  11: '手工退款',
  12: '押货款与钱包款互转',
  13: '其他',
}
// 报表字段
export const REPORT_FORM_KEY = {
  0: '全部',
  1: '本期汇款',
  2: '本期使用',
  3: '本期信用额增加',
  4: '本期信用额扣减',
  5: '本期提现'
}
// 完美钱包余额详情 搜索项
export const WALLET_BALANCE_DETAIL_SEARCH_CONFIG = {
  form: [
    {                           //3. datePicker类型（此时可以配置config字段）
      label: '交易月份',
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
  ]
}
// 完美钱包余额详情 列表项
export const WALLET_BALANCE_DETAIL_COLUMNS_CONFIG = [
  {	prop: 'receptionTransTypeDesc', label: '前端交易类型', align: 'center', width: 100 },
  {	prop: 'backstageTransTypeDesc', label: '后台交易类型', align: 'center', width: 100 },
  {	prop: 'orderNo', label: '订单号', align: 'center', width: 180, slot: 'orderNo', },
  {	prop: 'transNo', label: '流水号', align: 'center', width: 180 },
  {	prop: 'bankAccount', label: '银行账号', align: 'center', width: 150 },
  {	prop: 'transAmt', label: '交易金额', align: 'center', width: 120,
    formatter: ({transAmt}) => {
      return addPrefixForAmount(transAmt);
    }
  },
  {	prop: 'transTime', label: '交易日期', align: 'center', width: 150,},
  {	prop: 'transMethod', label: '支付方式', align: 'center', width: 100 },
]