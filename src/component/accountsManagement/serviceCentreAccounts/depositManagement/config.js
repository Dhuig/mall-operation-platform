import { formatDate } from 'util/formValidation.js';
import { optionGenerator,dateRangePickerGenerator } from 'util'
import { tableZeroShow } from '../serviceCentreMortgageBalance/config'
//开店保证金管理 -- 搜索项
export const OPEN_STORE_DEPOSIT_SEARCH_CONFIG = {
  form: [
    {
      label: '服务中心编号',              // 标签  （字段必配）        
      key: 'storeCode',                // 对应后端的请求字段 （字段必配）
      type: 'input',          // 类型   （字段必配）    
      value: '',              // 默认值 （字段必配）           
      placeholder: '请输入服务中心编号',        //占位符 
    },
    {
      label: '服务中心名称',                   
      key: 'storeName',                
      type: 'input',             
      value: '',                     
      placeholder: '请输入服务中心名称',        
    },
    {
      label: '会员卡号',                   
      key: 'cardNo',                
      type: 'input',             
      value: '',
      disabled: true,            
      placeholder: '请输入会员卡号',        
    },
    {
      label: '网点类型',                   
      key: 'shopType',                
      type: 'select',             
      value: '',                     
      bindKey: 'shopTypeOptions',
      placeholder: '请选择网点类型',       
    },
    {
      label: '开店保证金余额',                   
      key: 'openShopType',                
      type: 'select',             
      value: '',                   
      placeholder: '请选择开店保证金余额',  
      options: [
        { label: '金额为0', value: 1 },
        { label: '金额不为0', value: 2 },
      ]     
    },
    {
      label: '超额保证金余额',                   
      key: 'specialType',                
      type: 'select',             
      value: '',                   
      placeholder: '请选择超额保证金余额',  
      options: [
        { label: '金额为0', value: 1 },
        { label: '金额不为0', value: 2 },
      ]     
    },
  ]
}

//开店保证金管理 -- 列表项
export const OPEN_STORE_DEPOSIT_COLUMNS_CONFIG = [
  {
    prop: 'storeCode',
    label: '服务中心编号',
    align: 'center'
  },
  {
    prop: 'storeName',
    label: '服务中心名称',
    align: 'center'
  },
  {
    prop: 'shopTypeName',
    label: '网点类型',
    align: 'center'
  },
  {
    prop: 'depositMoney',
    label: '开店保证金余额',
    align: 'center',
    summary: true,
    formatter: ({depositMoney}) => {
      return Number(depositMoney).toFixed(2); 
    }
  },
  {
    prop: 'speciallyMoney',
    label: '超额保证金余额',
    align: 'center',
    summary: true,
    formatter: ({speciallyMoney}) => {
      return Number(speciallyMoney).toFixed(2); 
    }
  }
]

//开店保证金详情 -- 搜索项
export const OPEN_STORE_DEPOSIT_DETAIL_SEARCH_CONFIG = {
  form: [
    {
			label: '提交时间',
			key: 'timerange',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期',
			},
    },
    {
      label: '保证金类型',                   
      key: 'type',                
      type: 'select',             
      value: '',                     
      placeholder: '请选择保证金类型',    
      options: [
        { value: 0, label: '全部' },
        { value: 1, label: '开店保证金' },
        { value: 2, label: '特批押货保证金' }
      ]    
    },
  ]
}

//开店保证金详情 -- 审核状态
export const VERIFY_STATUS = {
  1: '通过',
  2: '不通过',
  3: '待审核',
}

//开店保证金详情 -- 列表项
export const OPEN_STORE_DEPOSIT_DETAIL_COLUMNS_CONFIG = [
  {
    prop: 'payAccount',
    label: '付款账号',
    align: 'center'
  },
  {
    prop: 'payBankName',
    label: '付款银行名称',
    align: 'center'
  },
  {
    prop: 'payType',
    label: '转账方式',
    align: 'center',
    formatter: ({payType}) => {
      return payType ? TRANSFER_METHODS[payType] : '';
    }
  },
  {
    prop: 'money',
    label: '保证金金额',
    align: 'center',
    formatter: ({money}) => {
      return '￥' + Number(money).toFixed(2); 
    }
  },
  {
    prop: 'depositType',
    label: '保证金类型',
    align: 'center',
    formatter: ({depositType}) => {
      return depositType ? DEPOSIT_TYPE[depositType] : '';
    }
  },
  {
    prop: 'submitter',
    label: '提交人',
    align: 'center'
  },
  {
    prop: 'createTimeStamp',
    label: '提交时间',
    align: 'center',
    formatter: ({createTimeStamp}) => {
      return formatDate(createTimeStamp*1000);
    }
  },
  {
    prop: 'verifyStatus',
    label: '状态',
    align: 'center',
    formatter: ({verifyStatus}) => {
      return VERIFY_STATUS[verifyStatus];
    }
  },
  {
    prop: 'verifier',
    label: '审核人',
    align: 'center'
  },
  {
    prop: 'verifyTimeStamp',
    label: '审核时间',
    align: 'center',
    formatter: ({verifyTimeStamp}) => {
      return formatDate(verifyTimeStamp*1000);
    }
  },
  {
    prop: 'verifyRemark',
    label: '审核备注',
    align: 'center'
  },
]

//开店保证金详情 -- 保证金类型/款项类型
export const DEPOSIT_TYPE = {
  1: '开店保证金',
  2: '超额保证金',
}
//开店保证金详情 -- tab选项
export const TAB_VALUE_TO_LABEL = {
  0: '全部',
  1: '审核通过',
  2: '审核不通过',
  3: '待审核',
}
export const TAB_OPTIONS = {
  'all': {
    type: 0
  },
  'tobeAudit': {
    type: 3
  },
}

//开店保证金详情 -- 转账方式
export const TRANSFER_METHODS = {
  1: '支付宝',
  2: '微信支付',
  3: '网银',
  4: '现金存入',
}

// 转账类型
export const PAY_TYPE = {
  1: '委托扣款',
  2: '银行收款',
  3: '手工退款',
  4: '无法识别款',
}

//开店保证金详情 -- 审核结果
export const AUDIT_RESULT = [
  { value: 1, label: '通过', },
  { value: 2, label: '不通过', },
]
//开店保证金详情 -- 提交验证
export const INPUT_DEPOSIT_FORM_RULES = {
  storeCode: [{ required: true, message: '请输入服务中心编号', trigger: 'blur' }],
  depositType: [{ required: true, message: '请选择保证金类型', trigger: 'change' }],
  payType: [{ required: true, message: '请选择转账方式', trigger: 'change' }],
  money: [{ required: true, message: '请输入保证金金额', trigger: 'blur' }],
}

// 保证金手工录入及审核 
// 搜索项
export const DEPOSIT_INPUT_AND_AUDIT_SEARCH_CONFIG = {
  form: [
    {
      label: '服务中心编号',                   
      key: 'storeCode',                
      type: 'input',             
      value: '',                     
      placeholder: '请输入服务中心编号',        
    },
    {
      label: '服务中心名称',                   
      key: 'storeName',                
      type: 'input',             
      value: '',                     
      placeholder: '请输入服务中心名称',        
    },
    {
      label: '会员卡号',                   
      key: 'leaderNo',                
      type: 'input',             
      value: '',    
      disabled: true,         
      placeholder: '请输入会员卡号',        
    },
    {
      label: '款项类型',                   
      key: 'type',                
      type: 'select',             
      value: '',                     
      placeholder: '请选择款项类型',   
      options: optionGenerator(DEPOSIT_TYPE),    
    },
  ]
}
// 
export const DEPOSIT_INPUT_AND_AUDIT_TABS_LIST = [
  [ "全部", "all" ],
  [ "待审核", "tobeAudit" ],
  [ "已审核", "audited" ],
  [ "已取消", "canceled" ],
]
export const DEPOSIT_INPUT_AND_AUDIT_STATUS = {
  all: null,
  tobeAudit: '3',
  audited: '1,2',
  canceled: '4',
}
export const DEPOSIT_INPUT_AND_AUDIT_STATUS_INDEX = {
  1: '审核通过',
  2: '已驳回',
  3: '待审核',
  4: '已取消',
}
// 
export const DEPOSIT_INPUT_AND_AUDIT_COLUMNS = [
  { prop: 'storeCode',  label: '服务中心编号', align: 'center' },
  { prop: 'storeName',  label: '服务中心名称', align: 'center', width: 140 },
  { prop: 'payType',  label: '转账类型', align: 'center',
    formatter: ({payType}) => {
      return payType in PAY_TYPE ? PAY_TYPE[payType] : '';
    }
  },
  { prop: 'money',  label: '金额', align: 'center', 
    summary: true,
    formatter: ({money}) => {
      return tableZeroShow(money);
    }
  },
  { prop: 'depositType',  label: '款项类型', align: 'center',
    formatter: ({depositType}) => {
      return depositType in DEPOSIT_TYPE ? DEPOSIT_TYPE[depositType] : '';
    }
  },
  { prop: 'submitRemark',  label: '备注', align: 'center' },
  { prop: 'submitter',  label: '录入人', align: 'center' },
  { prop: 'createTime',  label: '录入日期', align: 'center', width: 150,
    formatter: ({createTime}) => {
      return formatDate(createTime);
    }
  },
  { prop: 'verifyStatus',  label: '审核状态', align: 'center',
    formatter: ({verifyStatus}) => {
      return verifyStatus in DEPOSIT_INPUT_AND_AUDIT_STATUS_INDEX ? DEPOSIT_INPUT_AND_AUDIT_STATUS_INDEX[verifyStatus] : '';
    }
  },
  { prop: 'amountBeforeVerify',  label: '审核前金额', align: 'center',
    summary: true,
    formatter: ({amountBeforeVerify}) => {
      return tableZeroShow(amountBeforeVerify);
    }
  },
  { prop: 'verifier',  label: '审批人', align: 'center' },
  { prop: 'verifyTime',  label: '审批日期', align: 'center', width: 150,
    formatter: ({verifyTime}) => {
      return formatDate(verifyTime);
    }
  },
  { prop: 'payAccount',  label: '付款账号', align: 'center', width: 180, },
  { prop: 'payBankName',  label: '银行', align: 'center', width: 120 },
]

// 保证金余额查询列表【历史】 搜索项
export const DEPOSIT_BALANCE_HISTORY_SEARCH_CONFIG = {
  form: [
    {
			label: '月份',
			key: 'monthrange',
			type: 'datePicker',
			value: [],
			config: {
				type: 'monthrange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        pickerOptions: {
          shortcuts: [
            dateRangePickerGenerator('最近一个月', 30),
            dateRangePickerGenerator('最近三个月', 90),
            dateRangePickerGenerator('最近半年', 180),
            dateRangePickerGenerator('最近一年', 365),
          ]
        }
			},
    },
    {
      label: '服务中心编号',                   
      key: 'storeCode',                
      type: 'input',             
      value: '',                     
      placeholder: '请输入服务中心编号',        
    },
    {
      label: '服务中心名称',                   
      key: 'storeName',                
      type: 'input',             
      value: '',                     
      placeholder: '请输入服务中心名称',        
    },
    {
      label: '会员卡号',                   
      key: 'cardNo',                
      type: 'input',             
      value: '',
      disabled: true,                
      placeholder: '请输入会员卡号',        
    },
    {
      label: '网点类型',                   
      key: 'shopType',                
      type: 'select',             
      value: '',                     
      bindKey: 'shopTypeOptions',
      placeholder: '请选择网点类型',       
    },
    {
      label: '本月余额',                   
      key: 'moneyType',                
      type: 'select',             
      value: '',                   
      placeholder: '请选择本月余额',
      options: [
        { label: '余额为0', value: 1 },
        { label: '余额不为0', value: 2 }
      ]       
    },
  ]
}
// 保证金余额查询列表【历史】 列表项
export const DEPOSIT_BALANCE_HISTORY_COLUMNS_CONFIG = [
  { prop: 'month', label: '月份', align: 'center',
    formatter: ({month}) => {
      return month ? String(month).replace(/(\d{4})(\d{2})/, `$1-$2`) : '';
    }
  },
  { prop: 'storeCode', label: '服务中心编号', align: 'center' },
  { prop: 'storeName', label: '服务中心名称', align: 'center' },
  { prop: 'shopTypeName', label: '网点类型', align: 'center' },
  { prop: 'lastMonthMoney', label: '上月结余', align: 'center',
    summary: true,
    formatter: ({lastMonthMoney}) => {
      return tableZeroShow(lastMonthMoney);
    }
  },
  { prop: 'increaseMoney', label: '本月增加', align: 'center',
    summary: true,
    formatter: ({increaseMoney}) => {
      return tableZeroShow(increaseMoney);
    }
  },
  { prop: 'decreaseMoney', label: '本月减少', align: 'center',
    summary: true,
    formatter: ({decreaseMoney}) => {
      return tableZeroShow(decreaseMoney);
    }
  },
  { prop: 'currentMonthMoney', label: '本月余额', align: 'center',
    summary: true,
    formatter: ({currentMonthMoney}) => {
      return tableZeroShow(currentMonthMoney);
    }
  },
]