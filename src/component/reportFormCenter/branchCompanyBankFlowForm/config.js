import { formatCurrency, addPrefixForAmount } from 'util/formValidation';
import { CUSTOMER_TYPE } from '@/component/customerManagement/config';
import { optionGenerator } from 'util';
// 搜索栏 配置
export const BARNCH_BANK_FLOW_FORM_SEARCH_CONFIG = {
  form: [
    {                           //3. datePicker类型（此时可以配置config字段）
      label: '月份',
      key: 'months',
      type: 'datePicker',  
      value: '',
      config: {
          type: 'month',              //daterange 日期范围类型
          valueFormat: 'yyyy-MM',
          pickerOptions:{},              // 支持快捷键日期配置
          placeholder: '请选择月份'
      }
    },
    {                           //3. datePicker类型（此时可以配置config字段）
      label: '到账时间',
      key: 'accountTime',
      type: 'datePicker',  
      value: '',
      config: {
          type: 'daterange',              //daterange 日期范围类型
          pickerOptions:{},              // 支持快捷键日期配置
          placeholder: '请选择时间'
      }
    },
    {
      label: '分公司编号',
      key: 'branchCompanyCode',
      type: 'select',
      value: '',
      placeholder: '请选择分公司编号',
      options: [],
    },
    {
      label: '会员卡号',
      key: 'userCode',
      type: 'input',
      value: '',
      placeholder: '请输入会员卡号',
    },
    {
      label: '顾客编号',
      key: 'userNumber',
      type: 'input',
      value: '',
      placeholder: '请输入顾客编号',
    },
    {
      label: '顾客类型',
      key: 'userType',
      type: 'select',
      value: '',
      placeholder: '请选择顾客类型',
      options: optionGenerator(CUSTOMER_TYPE).slice(0, 4),
    },
    {
      label: '后期调整数据',
      key: 'adjustType',
      type: 'select',
      value: '',
      placeholder: '请选择后期调整数据',
      options: [
        { label: '是', value: 'YES' },
        { label: '否', value: 'NO' }
      ],
    },
  ],
  rules: {
    months: [{ required: true, message: '请选择月份', trigger: 'blur' }],
    branchCompanyCode: [{ required: true, message: '请选择月份', trigger: 'blur' }],
  }
}
const WHETHER_ADJUST_DATA = {
  'YES': '是',
  'NO': '否',
}
// 列表 配置
export const BARNCH_BANK_FLOW_FORM_COLUMNS_CONFIG = [
  { prop: 'tradeId', label: '交易流水号', align: 'center' },
  { prop: 'branchCompanyCode', label: '分公司编号', align: 'center' },
  { prop: 'userNumber', label: '顾客编号', align: 'center', width: 120, },
  { prop: 'userCode', label: '会员卡号', align: 'center' },
  { prop: 'userName', label: '顾客姓名', align: 'center' },
  { prop: 'userType', label: '顾客类型', align: 'center' },
  { prop: 'bankAccount', label: '银行账号', align: 'center', width: 160, },
  { prop: 'tradeAmount', label: '转账金额', align: 'center', width: 120,
    formatter: ({tradeAmount}) => {
      return addPrefixForAmount(formatCurrency(tradeAmount));
    }
  },
  { prop: 'paymentTime', label: '到账时间', align: 'center', width: 150, },
  { prop: 'paymentType', label: '到账类型', align: 'center' },
  { prop: 'transferType', label: '转账类型', align: 'center' },
  { prop: 'bankType', label: '银行类型', align: 'center' },
  { prop: 'bankName', label: '银行类型名称', align: 'center' },
  { prop: 'whetherAdjust', label: '是否后期调整', align: 'center',
    formatter: ({whetherAdjust}) => {
      return whetherAdjust in WHETHER_ADJUST_DATA ? WHETHER_ADJUST_DATA[whetherAdjust] : '';
    }
  },
  { prop: 'adjustType', label: '调整类型', align: 'center' },
]