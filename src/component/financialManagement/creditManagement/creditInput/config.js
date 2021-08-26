import { optionGenerator } from 'util'
import { addPrefixForAmount } from 'util/formValidation'
import store from '@/store/index'
// 网点类型 键值对
const NETWORK_TYPE_KEY_VALUE = {};
store.getters['system/getOptions']?.shopTypeOptions?.map(({label, value}) => {
  NETWORK_TYPE_KEY_VALUE[value] = label;
});
// 分公司options 初始化
const serviceCompanyOptions = store.getters['system/getOptions']?.serviceCompanyOptions?.map(({value}) => ({
  label: value,
  value
}));
// 云商信用额录入【业务】 列表项
export const CREDIT_INPUT_COLUMNS_CONFIG = [
  { prop: 'reduceTime', label: '扣减时间', align: 'center' },
  { prop: 'increaseTimeEnd', label: '还款时间', align: 'center',},
]

const BATCH_STATUS = {
  '0': '待生效',
  '2': '已扣减',
  '3': '已增加'
}
// 云商信用额录入详情 搜索项
export const CREDIT_INPUT_DETAIL_SEARCH_CONFIG = {
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
      placeholder: '请输入会员卡号'
    },
    {
      label: '分公司编号',
      key: 'companyCode',
      type: 'select',
      value: '',
      placeholder: '请输入分公司编号',
      options: serviceCompanyOptions || [],
    },
    {
      label: '生效状态',
      key: 'batchdtlStatus',
      type: 'select',
      value: '',
      placeholder: '请选择生效状态',
      options: optionGenerator(BATCH_STATUS),
    },
    {
      label: '信用额差值',
      key: 'creditDiffAmount',
      type: 'select',
      value: '',
      placeholder: '请选择信用额差值',
      options: [
        { label: '等于0', value: 0 },
        { label: '其他', value: 1 },
      ],
    },
    {
      label: '是否分期还款',
      key: 'instalment',
      type: 'select',
      value: '',
      placeholder: '请选择是否分期还款',
      options: [
        { label: '不分期', value: 0 },
        { label: '分期', value: 1 },
      ],
    },
  ]
}

// 云商信用额录入详情 审核状态panes
export const AUDIT_STATUS_PANES = [
  [ '全部', 'all' ],
  [ '待提交', 'tobeSubmit' ],
  [ '待审核', 'tobeAudit' ],
  [ '审核通过', 'passed' ],
  [ '审核不通过', 'noPass' ],
]
export const AUDIT_STATUS_KEY_VALUE = {
  all: null,
  tobeSubmit: 7,
  tobeAudit: 1,
  passed: 2,
  noPass: 9
}
export const AUDIT_STATUS_KEY_NAME = {
  1: '待审核',
  2: '审核通过',
  7: '待提交',
  9: '审核不通过',
}
export const CREDIT_INPUT_DETAIL_COLUMNS_CONFIG = [
  { prop: 'cardNo', label: '会员卡号', align: 'center', width: 100 },
  { prop: 'companyNo', label: '分公司编号', align: 'center' },
  { prop: 'storeCode', label: '服务中心编号', align: 'center', width: 100 },
  { prop: 'shopType', label: '网点类型', align: 'center',
      formatter: ({shopType}) => {
          return shopType in NETWORK_TYPE_KEY_VALUE ? NETWORK_TYPE_KEY_VALUE[shopType] : '';
      }
  },
  { prop: 'realname', label: '顾客姓名', align: 'center' },
  { prop: 'lastIncreaseAmount', label: '上批增加信用额', align: 'center',
    formatter: ({lastIncreaseAmount}) => {
      return addPrefixForAmount(lastIncreaseAmount);
    }
  },
  { prop: 'reduceAmount', label: '本次扣减信用额', align: 'center',
    formatter: ({reduceAmount}) => {
      return addPrefixForAmount(reduceAmount);
    }
  },
  { prop: 'increaseAmount', label: '本次增加信用额', align: 'center',
    formatter: ({increaseAmount}) => {
      return addPrefixForAmount(increaseAmount);
    }
  },
  { prop: 'creditDiffAmount', label: '信用额差值', align: 'center',
    formatter: ({creditDiffAmount}) => {
      return addPrefixForAmount(creditDiffAmount);
    }
  },
  { prop: 'reduceTime', label: '扣减时间', align: 'center', width: 150, },
  { prop: 'increaseStartTime', label: '还款时间', align: 'center', width: 156,
    formatter: ({increaseStartTime, increaseEndTime}) => {
      return increaseStartTime && increaseEndTime ? `${increaseStartTime}至${increaseEndTime}` : '';
    }
  },
  { prop: 'instalment', label: '是否分期还款', align: 'center', width: 100,
    formatter: ({instalment}) => {
      return instalment == 1 ? '是' : '否';
    }
  },
  { prop: 'auditTime', label: '审核时间', align: 'center' },
  { prop: 'auditorName', label: '审核人', align: 'center' },
  { prop: 'auditStatus', label: '审核状态', align: 'center',
    formatter: ({ auditStatus }) => {
      return auditStatus in  AUDIT_STATUS_KEY_NAME ? AUDIT_STATUS_KEY_NAME[auditStatus] : '';
    }
  },
  { prop: 'auditRemark', label: '审核备注', align: 'center' },
  { prop: 'batchdtlStatus', label: '生效状态', align: 'center',
    formatter: ({batchdtlStatus}) => {
      return BATCH_STATUS[String(batchdtlStatus)] || '';
    }
  },
]