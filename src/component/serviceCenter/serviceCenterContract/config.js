import { optionGenerator } from 'util';
import { formatDateDefault, formatDate } from 'util/formValidation.js';
// import { filters } from 'plugins/filters';

// 合同提交状态
export const SUBMIT_STATUS = {
  '1': '未提交',
  '2': '已提交',
}

// 合同签署状态
export const AGREE_STATUS = {
  1: '未提交',
  2: '待店铺签署',
  3: '待公司签署',
  4: '已完成',
  5: '已撤销',
}
// 合同类型
export const CONTRACT_TYPE = {
  // 1: '服务合同',
  // 2: '连带责任合同',
  // 3: '终端形象合同',
  // 4: '服务网点合同',
}
// 模板状态
export const TEMPLATE_STATUS = {
  1: '停用',
  2: '启用',
}
// 对接状态
export const LINK_STATUS = {
  1: '未对接',
  2: '已对接',
}

// 合同搜索
export const SERVICE_CENTER_CONTRACT_SEARCH = {
  form: [
      {
          label: '服务中心编号',
          key: 'storeCode',
          type: 'input',
          value: '',
          placeholder: '请输入服务中心编号',
      },
      {
          label: '年度',
          key: 'year',
          type: 'datePicker',
          value: '',
          config: {
            type: 'year',
            pickerOptions: {},
            placeholder: '请选择年度',
          }
      },
      {
          label: '合同模板',
          key: 'templateNo',
          type: 'select',
          value: '',
          placeholder: '请选择合同模板',
          options: optionGenerator(CONTRACT_TYPE),
      },
      {
          label: '签署状态',
          key: 'signStatus',
          type: 'select',
          value: '',
          options: optionGenerator(AGREE_STATUS),
          placeholder: '请选择签署状态',
      },
  ],
  rules: {
    storeCode: [{ max: 10, message: '请输入1~10位数字', trigger: 'blur' }]
  }
}

export const SERVICE_CENTER_CONTRACT_CONFIG = [
  {	
    prop: 'commitTime', 
    label: '提交日期', 
    align: 'center',
    formatter: ({commitTime}) => {
      return formatDateDefault(commitTime);
    }
  },
  {	prop: 'storeCode', label: '服务中心编号', align: 'center' },
  {	prop: 'year', label: '年度', align: 'center' },
  {	
    prop: 'templateNo', 
    label: '合同模板', 
    align: 'center',
    formatter: ({templateNo}) => {
      return CONTRACT_TYPE[templateNo];
    }
  },
  {	prop: 'managerName', label: '经营者', align: 'center' },
  {	prop: 'leaderName', label: '负责人', align: 'center' },
  {	prop: 'spouseName', label: '配偶', align: 'center' },
  {	
    prop: 'signStatus', 
    label: '签署状态', 
    align: 'center',
    formatter: ({signStatus}) => {
        
      
      return signStatus in AGREE_STATUS ? AGREE_STATUS[signStatus] : '';
    }
  },
  {	prop: 'remark', label: '备注', align: 'center' },
];

// 法大大注册状态
export const FADADA_STATUS = {
  1: '未注册',
  2: '已注册'
}

// 新建服务中心合同配置
export const BUILD_SERVICE_CENTRE_CONTRACT_CONFIG = [
  // { prop: 'storeCode', value: '', label: '服务中心编号', type: 'input' },
  { prop: 'storeName', value: '', label: '服务中心名称', type: 'input', disabled: true, },
  { prop: 'socialCreditCode', value: '', label: '社会信用代码', type: 'input', disabled: true, },
  { prop: 'managerName', value: '', label: '经营者', type: 'input',disabled: true, },
  { prop: 'managerCardNo', value: '', label: '经营者身份证号码', type: 'input',disabled: true, },
  { prop: 'leaderName', value: '', label: '负责人', type: 'input',disabled: true, },
  { prop: 'spouseName', value: '', label: '配偶', type: 'input',disabled: true, },
  { prop: 'registerStatus', value: '', label: '法大大注册状态', type: 'input',disabled: true,button: true },
  { prop: 'customerId', value: '', label: '法大大客户编号', type: 'input',disabled: true, },
  { prop: 'templateNo', value: '', label: '合同模板', type: 'select', options: [],},
  { prop: 'year', value: '', label: '年度', type: 'datePicker', config: {type: 'year', pickerOptions: {
    disabledDate(time) {
      return (time.getFullYear() > new Date().getFullYear()+1) || (time.getFullYear() < new Date().getFullYear()-1);
    },
  }} },
  { prop: 'fieldMatch', value: '', label: '字段匹配', type: 'input', slot: true, slotConfig: {text:'查看', complete: true,} },
  { prop: 'remark', value: '', label: '备注', type: 'textarea', maxlength: 100, },
]
export const BUILD_SERVICE_CENTRE_CONTRACT_RULES_CONFIG = {
  storeCode: [{required: true, message: '请确认服务中心编号已填', trigger: 'blur'}],
  storeName: [{required: true, message: '请确认服务中心名称已填', trigger: 'blur'}],
  socialCreditCode: [{required: true, message: '请确认社会信用代码已填', trigger: 'blur'}],
  managerName: [{required: true, message: '请确认法人姓名已填', trigger: 'blur'}],
  managerCardNo: [{required: true, message: '请确认服务中心法人身份证号已填', trigger: 'blur'}],
  templateNo: [{required: true, message: '请选择合同模板', trigger: 'change'}],
  year: [{ required: true, message: '请选择年度', trigger: 'blur' }]
}

// 服务中心合同详情配置
export const SERVICE_CENTRE_CONTRACT_DETAIL_CONFIG = [
  { prop: 'storeCode', value: '', label: '服务中心编号', },
  { prop: 'storeName', value: '', label: '服务中心名称',  },
  { prop: 'customerId', value: '', label: '法大大客户编号',  },
  { prop: 'creditNo', value: '', label: '社会信用代码',  },
  { prop: 'managerName', value: '', label: '经营者' },
  { prop: 'managerCardNo', value: '', label: '经营者身份证号' },
  { prop: 'leaderName', value: '', label: '负责人' },
  { prop: 'spouseName', value: '', label: '配偶' },
  { prop: 'templateName', value: '', label: '合同模板',},
  { prop: 'year', value: '', label: '年度'},
  { prop: 'remark', value: '', label: '备注' },

]

// 服务中心合同模板列表项配置
export const CONTRACT_TEMPLATE_LIST_COLUMNS_CONFIG = [
  { 
    prop: 'createTime', 
    label: '添加时间', 
    value: '',
    formatter: ({createTime}) => {
      return formatDate(createTime);
    }
  },
  { prop: 'templateNo', label: '合同模板编号', value: '' },
  { prop: 'templateName', label: '合同模板名称', value: '' },
  { 
    prop: 'templateStatus', 
    label: '模板状态', 
    value: '',
    formatter: ({templateStatus}) => {
      return templateStatus ? TEMPLATE_STATUS[templateStatus] : '';
    }
  },
  // { 
  //   prop: 'linkStatus', 
  //   label: '对接状态', 
  //   value: '',
  //   formatter: ({linkStatus}) => {
  //     return `
  //       <span class="${linkStatus==2?'green':''}">${linkStatus ? LINK_STATUS[linkStatus] : ''}</span>
  //     `;
  //   }
  // },
  { prop: 'employeeNumber', label: 'OA工号', value: '' },
  { prop: 'customerId', label: '法大大客户编号', value: '' },
]

// 模板字段匹配预览列表配置
export const TEMPLATE_FIELD_MATCH_CONFIG = [
  {prop: 'name', label: '合同字段名称', align: 'center'},
  {prop: 'required', label: '是否必填', align: 'center',
    formatter: ({required}) => {
      return required?'是':'否';
    }
  },
  {prop: 'value', label: '服务中心字段预览', align: 'center',
    formatter: ({value, required}) => {
      return value || required&& `
      <span class="color_red">缺少该字段，请完善后再发起</span>
      `
    }
  },
]