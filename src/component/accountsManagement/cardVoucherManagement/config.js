import { formatDate } from 'util/formValidation.js';
import { optionGenerator, genCurrentMonthFirstAndLastDay } from 'util';
// 电子券使用状态
export const ECARD_STATUS = {
  1: '已使用',
  2: '未使用',
  3: '占用中',
  4: '冻结中',
  5: '已转出',
}
// 会员身份
export const MEMBER_TYPE = {
  1: '普通顾客',
  2: '优惠顾客',
  3: '云商',
  4: '微店（云+）',
  5: '店员',
  6: '子账号',
}
// 礼券调查状态
export const VOUCHER_STUDY_STATUS = {
  1: '礼券200',
  2: '礼券800',
  3: '不要礼券',
}
// 礼券使用状态
export const VOUCHER_STATUS = {
  1: '已使用',
  2: '未使用',
  3: '占用中',
  4: '冻结中',
  5: '已转出',
  6: '已失效',
}
// 补贴原因
export const SUBSIDY_REASON = {
  1: '押货退货',
  2: '押货换货',
  3: '展业包订购单退货',
  4: '展业包订购单换货',
  5: '顾客订单退货',
  6: '顾客订单换货',
  7: '货损货差',
}
// 服务中心状态
export const STORE_STATUS = {
  '0': '正常',
  '1': '结业',
}
// 业务类型
export const BUSINESS_TYPE = {
  1: '提现',
  2: '到期转出',
}
// 电子礼券管理 -- 搜索项
export const E_CARD_VOUCHER_SEARCH_CONFIG = {
  form: [
    {
      label: '会员卡号',              // 标签  （字段必配）
      key: 'cardNo',                // 对应后端的请求字段 （字段必配）
      type: 'input',          // 类型   （字段必配）
      value: '',              // 默认值 （字段必配）
      placeholder: '精准搜索会员卡号',        //占位符
    },
    {
      label: '推送批次',
      key: 'syncBatchNo',
      type: 'input',
      value: '',
      placeholder: '精准搜索推送批次',
    },
    {
      label: '店铺编号',
      key: 'shopCode',
      type: 'input',
      value: '',
      placeholder: '精准搜索服务中心/微店编号',
    },
    {
      label: '礼券状态',
      key: 'freightCouponStatus',
      type: 'select',
      value: '',
      placeholder: '请选择礼券状态',
      options: optionGenerator(VOUCHER_STATUS),
    },
    {
      label: '业务类型',
      key: 'businessType',
      type: 'select',
      value: '',
      placeholder: '请选择业务类型',
      options: optionGenerator(BUSINESS_TYPE),
    },
    {
      label: '礼券月份',
      key: 'claimTime',
      type: 'datePicker',
      value: [Date.now(),Date.now()],
      config: {
        type: 'monthrange',
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        placeholder: '请选择月份区间',
      }
    },
    {
      label: '操作时间',
      key: 'updateTime',
      type: 'datePicker',
      value: '',
      config: {
        type: 'daterange',
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        placeholder: '请选择月份区间',
      }
    },
  ]
}

// 电子礼券管理 -- 列表项
export const E_CARD_VOUCHER_COLUMNS_CONFIG = [
  {
    prop: 'claimTime',
    label: '礼券月份', // 礼券月份 == 发放月份
    align: 'center',
    formatter: ({ claimTime }) => {
      return formatDate(claimTime).substr(0, 7);
    }
  },
  {
    prop: 'expiresTime',
    label: '到期月份',
    align: 'center',
    formatter: ({ expiresTime }) => {
      return formatDate(expiresTime).substr(0, 7);
    }
  },
  { prop: 'realname', label: '会员名称', align: 'center' },
  { prop: 'cardNo', label: '会员卡号', align: 'center', width: 100 },
  { prop: 'shopCode', label: '店铺编号', summaryData: true, align: 'center' },
  {
    prop: 'giftCouponCardAmount',
    label: '礼券金额',
    align: 'center',
    width: 130,
    formatter: ({ giftCouponCardAmount }) => {
      return '￥' + giftCouponCardAmount;
    }
  },
  {
    prop: 'giftCouponStatus',
    label: '礼券状态',
    align: 'center',
    formatter: ({ giftCouponStatus }) => {
      return VOUCHER_STATUS[giftCouponStatus];
    }
  },
  { prop: 'orderNo', label: '已使用订单号', align: 'center', width: 180 },
  {
    prop: 'applyTime', label: '使用时间', align: 'center',
    formatter: ({ applyTime, giftCouponStatus }) => {
      return giftCouponStatus == 1 ? formatDate(applyTime) : ''
    }
  },
  {
    prop: 'operationTime', label: '操作时间', align: 'center', width: 150,
    formatter: ({ operationTime }) => {
      return formatDate(operationTime)
    }
  },
  {
    prop: 'businessType', label: '业务类型', align: 'center',
    formatter: ({businessType}) => {
      return businessType in BUSINESS_TYPE ? BUSINESS_TYPE[businessType] : '';
    }
  },
  { prop: 'syncBatchNo', label: '推送批次', align: 'center', width: 180 },
]
// 电子礼券管理 -- key to name
export const KEY_TO_NAME = {
  transShop: '转店',
  transOut: '转出',
  frozen: '冻结',
  thaw: '解冻',
}

// 电子礼券详情 -- 转店明细 列表项
export const TRANSFER_STORE_DETAIL_COLUMNS_CONFIG = [
  { prop: 'transOutShopCode', label: '原服务中心编号', align: 'center' },
  { prop: 'transInShopCode', label: '转入服务中心编号', align: 'center' },
  {
    prop: 'createTime',
    label: '转入时间',
    align: 'center',
    formatter: ({ createTime }) => {
      return formatDate(createTime);
    }
  },
  { prop: 'updaterName', label: '操作人', align: 'center' },
]
// 电子礼券详情 -- 转出记录 列表项
export const TRANSFER_OUT_STORE_RECORD_COLUMNS_CONFIG = [
  {
    prop: 'transOutTime',
    label: '转出时间',
    align: 'center',
    formatter: ({ transOutTime }) => {
      return formatDate(transOutTime);
    }
  },
  { prop: 'updaterName', label: '操作人', align: 'center' },
  { prop: 'transOutReason', label: '原因', align: 'center' },
]
// 电子礼券详情 -- 冻结记录 列表项
export const FROZEN_RECORD_COLUMNS_CONFIG = [
  {
    prop: 'createTime',
    label: '操作时间',
    align: 'center',
    formatter: ({ createTime }) => {
      return formatDate(createTime);
    }
  },
  {
    prop: 'operationContent',
    label: '操作内容',
    align: 'center',
    formatter: ({ operationContent }) => {
      return operationContent == 1 ? '冻结' : '解冻';
    }
  },
  { prop: 'updaterName', label: '操作人', align: 'center' },
  { prop: 'remark', label: '备注', align: 'center' },
]

// 电子礼券调查明细 -- 搜索项
export const ECARD_VOUCHER_STUDY_SEARCH_CONFIG = {
  form: [
    {
      label: '会员卡号',
      key: 'cardNo',
      type: 'input',
      value: '',
      placeholder: '精准搜索会员卡号',
    },
    {
      label: '会员手机号',
      key: 'mobile',
      type: 'input',
      value: '',
      placeholder: '精准搜索会员手机号',
    },
    {
      label: '会员身份',
      key: 'memberType',
      type: 'select',
      value: '',
      placeholder: '请选择会员身份',
      options: optionGenerator(MEMBER_TYPE).slice(0, 4),
    },
    {
      label: '服务中心编号',
      key: 'shopCode',
      type: 'input',
      value: '',
      placeholder: '精准搜索服务中心/微店编号',
    },
    {
      label: '礼券调查',
      key: 'surveyStatus',
      type: 'select',
      value: '',
      placeholder: '请选择礼券调查',
      options: [
        { value: 1, label: '礼券200' },
        { value: 2, label: '礼券800' },
        { value: 3, label: '不要礼券' },
      ]
    },
  ]
}

// 电子礼券调查明细 -- 列表项
export const ECARD_VOUCHER_STUDY_COLUMNS_CONFIG = [
  { prop: 'cardNo', label: '会员卡号', align: 'center' },
  { prop: 'mobile', label: '会员手机号', align: 'center' },
  { prop: 'realname', label: '会员姓名', align: 'center' },
  {
    prop: 'memberType',
    label: '会员身份',
    align: 'center',
    formatter: ({ memberType }) => {
      return MEMBER_TYPE[memberType];
    }
  },
  { prop: 'shopCode', label: '服务中心编号', align: 'center' },
  {
    prop: 'surveyStatus',
    label: '礼券调查',
    align: 'center',
    formatter: ({ surveyStatus }) => {
      return VOUCHER_STUDY_STATUS[surveyStatus];
    }
  },
]

// 电子礼券调查明细 -- 礼券调查变更记录  列表项
export const ECARD_VOUCHER_STUDY_RECORD_COLUMNS_CONFIG = [
  {
    prop: 'changeTime',
    label: '变更时间',
    align: 'center',
    formatter: ({ changeTime }) => {
      return formatDate(changeTime);
    }
  },
  {
    prop: 'surveyOldStatus',
    label: '原状态',
    align: 'center',
    formatter: ({ surveyOldStatus }) => {
      return VOUCHER_STUDY_STATUS[surveyOldStatus];
    }
  },
  {
    prop: 'surveyNewStatus',
    label: '变更后状态',
    align: 'center',
    formatter: ({ surveyNewStatus }) => {
      return VOUCHER_STUDY_STATUS[surveyNewStatus];
    }
  },
]

// 运费补贴券管理 -- 搜索项
export const FREIGHT_SUBSIDY_VOUCHER_SEARCH_CONFIG = {
  form: [
    {
      label: '会员卡号',
      key: 'cardNo',
      type: 'input',
      value: '',
      placeholder: '精准搜索会员卡号',
    },
    {
      label: '会员手机号',
      key: 'mobile',
      type: 'input',
      value: '',
      placeholder: '精准搜索会员手机号',
    },
    {
      label: '会员身份',
      key: 'memberType',
      type: 'select',
      value: '',
      placeholder: '全部',
      options: optionGenerator(MEMBER_TYPE).slice(0, 4),
    },
    {
      label: '服务中心编号',
      key: 'shopCode',
      type: 'input',
      value: '',
      placeholder: '精准搜索服务中心编号',
    },
    {
      label: '发放时间',
      key: 'timerange',
      type: 'datePicker',
      value: genCurrentMonthFirstAndLastDay(),
      config: {
        type: 'daterange',
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        placeholder: '请选择日期',
        pickerOptions: {}
      }
    },
    {
      label: '补贴原因',
      key: 'subsidyReason',
      type: 'select',
      value: '',
      placeholder: '全部',
      options: optionGenerator(SUBSIDY_REASON),
    },
    {
      label: '使用状态',
      key: 'freightCouponStatus',
      type: 'select',
      value: '',
      placeholder: '全部',
      options: [
        { value: 1, label: '已使用' },
        { value: 2, label: '未使用' },
        { value: 3, label: '占用中' },
        { value: 4, label: '已失效' },
      ]
    },
  ]
}

// 运费补贴券管理 -- 列表项
export const FREIGHT_SUBSIDY_VOUCHER_COLUMNS_CONFIG = [
  {
    prop: 'claimTime',
    label: '发放时间',
    align: 'center',
    width: 150,
    formatter: ({ claimTime }) => {
      return formatDate(claimTime);
    }
  },
  {
    prop: 'freightSubsidyAmount',
    label: '运费补贴金额',
    align: 'center',
    width: 90,
    formatter: ({ freightSubsidyAmount }) => {
      return '￥' + freightSubsidyAmount;
    }
  },
  { prop: 'cardNo', label: '会员卡号', align: 'center', width: 120 },
  { prop: 'mobile', label: '会员手机号', align: 'center', width: 120 },
  { prop: 'realname', label: '会员姓名', align: 'center' },
  {
    prop: 'memberType',
    label: '会员身份',
    align: 'center',
    formatter: ({ memberType }) => {
      return MEMBER_TYPE[memberType];
    }
  },
  {
    prop: 'freightCouponStatus',
    label: '使用状态',
    align: 'center',
    formatter: ({ freightCouponStatus }) => {
      return ECARD_STATUS[freightCouponStatus];
    }
  },
  {
    prop: 'subsidyReason',
    label: '补贴原因',
    align: 'center',
    width: 120,
    formatter: ({ subsidyReason }) => {
      return subsidyReason in SUBSIDY_REASON ? SUBSIDY_REASON[subsidyReason] : '';
    }
  },
  { prop: 'shopCode', label: '服务中心编号', align: 'center', width: 100 },
  { prop: 'shopName', label: '服务中心/微店名称', align: 'center', width: 200 },
  {
    prop: 'shopStatus',
    label: '服务中心状态',
    align: 'center',
    formatter: ({ shopStatus }) => {
      return STORE_STATUS[shopStatus];
    }
  },
]

// 卡券管理弹窗 form rules
export const ECARD_FORM_RULES = {
  transInshopCode: [{ pattern: /^\d+$/, message: '请输入正确服务中心编码', trigger: 'blur' }],
  transReason: [{ required: true, message: '请输入礼券转出原因', trigger: 'blur' }]
}