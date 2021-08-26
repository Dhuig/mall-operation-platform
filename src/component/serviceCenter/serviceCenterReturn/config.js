import { addPrefixForAmount,formatDate } from 'util/formValidation.js'
import { optionGenerator } from 'util'

export const IS_OVER = {
  '1': '是',
  '0': '否',
}
// 状态
export const RETURN_STATUS = {
  0: '禁用',
  1: '启用'
}
// 控制类型
export const RETURN_CONTROL_TYPE = {
  1: '顾客自购单退货',
  2: '云商下单退货',
}

// 验证退货额度比例
const rep = /^([1-9]|[1-9]\d|100)$/;
const ratioValidator = (rule, value, callback) => {
  if(value.every(item => (rep.test(item)||!item))){
    callback();
  }else{
    callback(new Error('请输入1~100的正整数'))
  }
}
// 验证押货余额极限值
const returnAmountRep = /^([1-9]\d{0,}|0)(\.\d{1,2})?$/;
const returnAmountValidator = (rule, value, callback) => {
  if(value.every(item => (returnAmountRep.test(item)||!item))){
    callback();
  }else{
    callback(new Error('请输入1~100的正整数'))
  }
}
// 服务中心退货额度管理 - 搜索项
export const SERVICE_CENTER_RETURN_SEARCH = {
  form: [
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号',
    },
    {
      label: '负责人卡号',
      key: 'leaderNo',
      type: 'input',
      value: '',
      placeholder: '请输入负责人卡号',
    },
    {
      label: '分公司',
      key: 'companyCode',
      type: 'select',
      value: '',
      filterable: true,
      multiple: true,
      options: [],
      placeholder: '请选择分公司',
    },
    {
      label: '是否超额',
      key: 'isOver',
      type: 'select',
      value: '',
      placeholder: '请选择是否超额',
      options: [
        {
          label: '是',
          value: '1',
        },
        {
          label: '否',
          value: '0',
        }
      ]
    },
    {
      label: '退货额度比例',
      key: 'returnRatio',
      value: [],
      type: 'inputrange',
      config: {
        type: 'ratio'
      }
    },
    {
      label: '控制类型',
      key: 'controlType',
      type: 'select',
      value: '',
      placeholder: '请选择控制类型',
      options: optionGenerator(RETURN_CONTROL_TYPE),
    },
    {
      label: '记录状态',
      key: 'state',
      type: 'select',
      value: '',
      placeholder: '请选择记录状态',
      options: [
        { label: '生效', value: 1 },
        { label: '失效', value: 0 },
      ],
    },
    {
      label: '创建时间',
      key: 'createTime',
      type: 'datePicker',
      value: [],
      config: {
        type: 'daterange',
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        pickerOptions:{},
      }
    },
    {
      label: '审核时间',
      key: 'approveTime',
      type: 'datePicker',
      value: [],
      config: {
        type: 'daterange',
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        pickerOptions:{},
      }
    },
  ],
  rules: {
    returnRatio: [{validator: ratioValidator, message: '请输入1~100的正整数', trigger: 'blur'}]
  }
}
// 服务中心退货额度管理 - 列表选项卡
export const SERVICE_CENTER_RETURN_TABS = [
  [ '全部', 'all' ],
  [ '待审核', 'tobeAudit' ],
  [ '审核通过', 'passed' ],
  [ '审核不通过', 'failed' ],
  [ '生效', 'effected' ],
  [ '失效', 'noeffect' ],
]
// 列表选项卡 对应value
export const SERVICE_CENTER_RETURN_VERIFY_STATUS = {
  tobeAudit: 3,
  passed: 1,
  failed: 2,
}
export const SERVICE_CENTER_RETURN_STATE = {
  effected: 1,
  noeffect: 0,
}

// 服务中心退货额度管理 - 列表项
export const SERVICE_CENTER_RETURN_COLUMN = [
  {	prop: 'stateExcel', label: '记录状态', align: 'center',
    formatter: ({stateExcel,verifyStatus}) => {
      return verifyStatus == 1 ? stateExcel : '';
    }
  },
  {	prop: 'storeCode', label: '服务中心编号', align: 'center', width: 100 },
  {	prop: 'leaderNo', label: '负责人卡号', align: 'center', width: 100 },
  {	prop: 'leaderName', label: '负责人姓名', align: 'center', width: 120, },
  {	prop: 'availableAmount', label: '当前可用押货余额', align: 'center', width: 120,
    formatter: ({availableAmount}) => {
      return typeof availableAmount ==='number' ? addPrefixForAmount(availableAmount.toFixed()) : '';
    }
  },
  {	prop: 'lastMonthAchievement', label: '上月账款额', align: 'center', width: 120,
    formatter: ({lastMonthAchievement}) => {
      return lastMonthAchievement <=0 ? `￥0.00` : addPrefixForAmount(lastMonthAchievement.toFixed(2));
    }
  },
  {	prop: 'returnRatio', label: '退货额度比例', align: 'center', width: 100,
    formatter: ({returnRatio, controlType}) => {
      let result;
      if(controlType == 1){
        result = '-'
      }else{
        result = typeof returnRatio === 'number' ? returnRatio*100 + '%' : '';
      }
      return result;
    }
  },
  {	prop: 'returnAmount', label: '押货余额极限值', align: 'center', width: 120,
    formatter: ({returnAmount}) => {
      return typeof returnAmount==='number' ? addPrefixForAmount(returnAmount.toFixed(2)) : '';
    }
  },
  {	prop: 'isOver', label: '是否超额', align: 'center',
    formatter: ({isOver}) => {
      return isOver in IS_OVER ? IS_OVER[isOver] : '';
    }
  },
  {	prop: 'overNumber', label: '超额次数', align: 'center', 
    formatter: ({overNumber}) => {
      return String(overNumber);
    }
  },
  {	prop: 'controlTypeExcel', label: '控制类型', align: 'center', width: 120},
  {	prop: 'createTime', label: '创建时间', align: 'center', width: 160, 
    formatter: ({createTime}) => {
      return formatDate(createTime);
    }
  },
  {	prop: 'verifyStatusExcel', label: '审核状态', align: 'center', width: 120, },
  {	prop: 'approveTime', label: '审核时间', align: 'center', width: 160, 
    formatter: ({approveTime}) => {
      return formatDate(approveTime);
    }
  },
  { prop: 'storeType', label: '网点类型', align: 'center', width: 100 },
  {	prop: 'companyCode', label: '分公司编号', align: 'center' },
  {	prop: 'companyName', label: '分公司名称', align: 'center', width: 120},
];

export const validateRatioPass = (rule, value, callback) => {
  if(value == '' || !value) {
    callback(new Error('请输入退货额度比例'));
  }else if(isNaN(value)){
    callback(new Error('请输入1~100的正整数'));
  }else if(value <= 0 || value >100 || String(value).indexOf('.')>0) {
    callback(new Error('请输入1~100的正整数'));
  }else{
    callback();
  }
}
// 新增/编辑退货额度验证
export const RETURN_AMOUNT_RULES = {
  storeCode: [
    {required: true, message: '请输入服务中心编号', trigger: 'blur'}, 
    { pattern: /^\d{1,6}$/, message: '支持1~6位字符，只支持精准查询', trigger: 'blur' }
  ],
  returnRatio: [
    { required: true, message: '请输入退货额度比例', trigger: 'blur'},
    { validator: validateRatioPass,  trigger: 'blur' }
  ],
  returnAmount: [
    { required: true, message: '请输入押货余额极限值', trigger: 'blur' }, 
    { pattern: /^-?(([1-9]\d{0,5}|0)(\.\d{1,2})?|1000000(\.0{1,2})?)$/, message: '请输入-1000000.00~1000000.00的数字', trigger: 'blur' }
  ],
  verifyStatus: [{ required: true, message: '请选择审核结果', trigger: 'blur' }],
  state: [{ required: true, message: '请选择记录状态', trigger: 'blur' }],
}
// 批量审核 form验证
export const RETURN_AMOUNT_AUDIT_RULES = {
  verifyStatus: [{ required: true, message: '请选择审核结果', trigger: 'blur' }]
}

// 退货额度超额记录 - 搜索项
export const RETURN_OVER_RECORD_SEARCH = {
  form: [
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号',
    },
    {
      label: '超额时间',
      key: 'overTime',
      type: 'datePicker',
      value: [],
      config: {
        type: 'daterange',
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        pickerOptions:{},
      }
    },
    {
      label: '控制类型',
      key: 'controlType',
      type: 'select',
      value: '',
      placeholder: '请选择控制类型',
      options: optionGenerator(RETURN_CONTROL_TYPE),
    },
    {
      label: '退货额度比例',
      key: 'returnRatio',
      value: [],
      type: 'inputrange',
      config: {
        type: 'ratio'
      }
    },
    {
      label: '押货余额极限值',
      key: 'returnAmount',
      value: [],
      type: 'inputrange',
    }
  ],
  rules: {
    returnRatio: [{ validator: ratioValidator, message: '请输入1~100的正整数', trigger: 'blur' }],
    returnAmount: [{ validator: returnAmountValidator, message: '请输入正数', trigger: 'blur' }]
  }
}
// 退货额度操作记录 - 搜索项
export const RETURN_OPERATE_RECORD_SEARCH = {
  form: [
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号',
    },
    {
      label: '操作时间',
      key: 'createTime',
      type: 'datePicker',
      value: [],
      config: {
        type: 'daterange',
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        pickerOptions:{},
      }
    },
  ]
}

export const RETURN_OVER_RECORD_COLUMN = [
  {	prop: 'storeCode', label: '服务中心编号', align: 'center',  },
  {	prop: 'storeName', label: '服务中心名称', align: 'center',  },
  {	prop: 'controlType', label: '控制类型', align: 'center', 
    formatter: ({controlType}) => {
      return controlType in RETURN_CONTROL_TYPE ? RETURN_CONTROL_TYPE[controlType] : '';
    }
  },
  {	prop: 'overAmountTime', label: '超额时间', align: 'center', width: 150,
    formatter: ({overAmountTime}) => {
      return formatDate(overAmountTime);
    }
  },
  {	prop: 'lastMonthAchievementAmount', label: '上月账款额', align: 'center', 
    formatter: ({lastMonthAchievementAmount}) => {
      return addPrefixForAmount(lastMonthAchievementAmount);
    }
  },
  {	prop: 'returnRatio', label: '退货额度比例', align: 'center', 
    formatter: ({returnRatio}) => {
      return typeof returnRatio === 'number' ? `${returnRatio * 100}%` : '';
    }
  },
  {	prop: 'returnAmount', label: '押货余额极限值', align: 'center', 
    formatter: ({returnAmount}) => {
      return addPrefixForAmount(returnAmount);
    }
  },
  {	prop: 'afterSellOrderNo', label: '关联售后单号', align: 'center', slot: 'afterSellOrderNo',
    // formatter: ({afterSellOrderNo}) => {
    //   return `
    //     <span style="color:#409EFF;">${afterSellOrderNo}</span>
    //   `;
    // }
  },
]

export const RETURN_OVER_RECORD_LOGS_COLUMN = [
  {	prop: 'operator', label: '操作人', align: 'center' },
  {	prop: 'operatorNo', label: '操作人工号', align: 'center' },
  {	prop: 'storeCode', label: '服务中心编号', align: 'center' },
  {	prop: 'operatorEvent', label: '操作内容', align: 'center' },
  {	prop: 'remark', label: '备注', align: 'center', slot: 'remark' },
  {	prop: 'createTime', label: '操作时间', align: 'center', width: 150,
    formatter: ({createTime}) => {
      return formatDate(createTime);
    }
  },
]

// 服务中心退货额度详情 列表项
export const SERVICE_CENTER_RETURN_DETAIL_COLUMN = [
  {	prop: 'createTime', label: '创建时间', align: 'center', width: 150,
    formatter: ({createTime}) => {
      return formatDate(createTime);
    }
  },
  {	prop: 'availableAmount', label: '当前可用押货余额', align: 'center',
    formatter: ({availableAmount}) => {
      return addPrefixForAmount(availableAmount);
    }
  },
  {	prop: 'lastMonthAchievement', label: '上月账款额', align: 'center',
    formatter: ({lastMonthAchievement}) => {
      return addPrefixForAmount(lastMonthAchievement);
    }
  },
  {	prop: 'returnRatioName', label: '退货额度比例', align: 'center' },
  {	prop: 'returnAmount', label: '押货余额极限值', align: 'center', width: 150,
    formatter: ({returnAmount}) => {
      return addPrefixForAmount(returnAmount);
    }
  },
  {	prop: 'applyNo', label: '提交人工号', align: 'center' },
  {	prop: 'controlTypeExcel', label: '控制类型', align: 'center', width: 150, },
  {	prop: 'verifyStatusExcel', label: '审核状态', align: 'center' },
  {	prop: 'approveNo', label: '审核人工号', align: 'center' },
  {	prop: 'approveTime', label: '审核时间', align: 'center', width: 150,
    formatter: ({approveTime}) => {
      return formatDate(approveTime);
    }
  },
  {	prop: 'stateExcel', label: '记录状态', align: 'center' },
]