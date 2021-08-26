import { optionGenerator } from 'util'
// 领券平台
export const VOUCHER_PLATFORM = {
  1: 'APP',
  2: 'PC',
  4: '小程序',
}
// 活动对象
export const ACTIVITY_OBJECT = {
  1: '全部顾客',
  2: '按照顾客身份',
  4: '导入顾客',
}
// 搜索栏 配置
export const LOGIN_WITH_GIFTS_LIST_SEARCH = {
  form: [
    {
      label: '活动名称',
			key: 'activityName',
			type: 'input',
			value: '',
			placeholder: '请输入活动名称',
    },
		{
			label: '创建时间',
			key: 'createTime',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始时间',
				endPlaceholder: '结束时间',
        pickerOptions: {},
			}
		},
    {
      label: '领券平台',
			key: 'platform',
			type: 'select',
			value: '',
			placeholder: '请选择领券平台',
      options: optionGenerator(VOUCHER_PLATFORM),
    },
		{
			label: '活动时间',
			key: 'time',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始时间',
				endPlaceholder: '结束时间',
        pickerOptions: {},
			}
		},
  ]
}

// tab 选项卡
export const LOGIN_WITH_GIFTS_TAB_PANES = {
  'all': '全部',
  'tobeAudit': '待审核',
  'inProgress': '进行中' ,
  'completed': '已完成' ,
  'rejected': '已驳回' ,
  'stoped': '已停止' ,
  'draft': '草稿' , 
}
export const LOGIN_WITH_GIFTS_TAB_VALUE = {
  tobeAudit: 1,
  inProgress: 2,
  completed: 3,
  rejected: 4,
  stoped: 6,
  draft: 5,
}
export const LOGIN_WITH_GIFTS_TAB_NAME = {
  1: '待审核',
  2: '进行中',
  3: '已完成',
  4: '已驳回',
  6: '已停止',
  5: '草稿',
}

// 列表 配置
export const LOGIN_WITH_GIFTS_LIST_COLUMNS = [
  { prop: 'createTime', label: '创建时间', align: 'center' },
  { prop: 'platforms', label: '领券平台', align: 'center',
    formatter: ({platforms}) => {
      return platforms && platforms.map(item => VOUCHER_PLATFORM[item]).join('、') || '';
    }
  },
  { prop: 'activityName', label: '活动名称', align: 'center' },
  { prop: 'startTime', label: '活动时间', align: 'center', width: 156,
    formatter: ({startTime, endTime, unlimitedTime}) => {
      return startTime && `${startTime}至${unlimitedTime ? '' : endTime}` || '';
    }
  },
  { prop: 'participants', label: '活动对象', align: 'center',
    formatter: ({participants}) => {
      return participants in ACTIVITY_OBJECT ? ACTIVITY_OBJECT[participants] : '';
    }
  },
  { prop: 'status', label: '状态', align: 'center',
    formatter: ({status}) => {
      return status in LOGIN_WITH_GIFTS_TAB_NAME ? LOGIN_WITH_GIFTS_TAB_NAME[status] : '';
    }
  },
]

// 审核form rules
export const LOGIN_GIFTS_LIST_AUDIT_FORM_RULES = {
  examine: [{ required: true, message: '请选择审核结果', trigger: 'blur' }],
  remarks: [{ required: true, message: '请输入审核意见', trigger: 'blur' }],
}

/* =============== 详情 ============== */
// 操作记录 配置
export const LOGIN_WITH_GIFTS_DETAIL_LOGS_COLUMNS = [
  { prop: 'time', label: '操作时间', align: 'center' },
  { prop: 'time', label: '操作', align: 'center' },
  { prop: 'time', label: '操作人帐号', align: 'center' },
  { prop: 'time', label: '操作人姓名', align: 'center' },
  { prop: 'time', label: '所属部门', align: 'center' },
  { prop: 'time', label: '备注说明', align: 'center' },
  { prop: 'time', label: '附件', align: 'center' },
]

// 顾客列表 配置
export const LOGIN_WITH_GIFTS_DETAIL_CUSTOMER_COLUMNS = [
  { prop: 'time', label: '顾客编号', align: 'center' },
  { prop: 'time', label: '会员卡号', align: 'center' },
  { prop: 'time', label: '会员姓名', align: 'center' },
  { prop: 'time', label: '派发数量', align: 'center' },
  { prop: 'time', label: '注册手机号', align: 'center' },
]