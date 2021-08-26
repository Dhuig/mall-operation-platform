import { optionGenerator } from 'util'
import { addPrefixForAmount , formatDate} from 'util/formValidation.js'
import store from '@/store/index'
// 网点类型 键值对
const NETWORK_TYPE_KEY_VALUE = {};
store.getters['system/getOptions']?.shopTypeOptions?.map(({label, value}) => {
  NETWORK_TYPE_KEY_VALUE[value] = label;
});
// 审核状态
export const AUDIT_STATUS = {
    1: '待审核',
    2: '已通过',
    3: '已驳回',
    7: '待提交',
}
// 批次状态
export const BATCH_STATUS = {
    1: '未生效',
    2: '已扣减',
    3: '已增加',
}
// 信用额调整批次管理-搜索项
export const CREDIT_ADJUST_BATCH_MANAGEMENT_SEARCH = {
    form: [
        {
            label: '调整批次号',
            key: 'adjustBatchNo',
            type: 'input',
            value: '',
            placeholder: '请输入调整批次号',
        },
        {
            label: '录入时间',
            key: 'entryTime',
            type: 'datePicker',
            value: '',
            config: {
                type: 'daterange',              //daterange 日期范围类型
                rangeSeparator: '~',
                startPlaceholder: '开始日期',
                endPlaceholder: '结束日期'
            },
        },
        {
            label: '审核状态',
            key: 'auditStatus',
            type: 'select',
            value: '',
            options: optionGenerator(AUDIT_STATUS),
            placeholder: '请选择审核状态',
        },
        {
            label: '批次状态',
            key: 'batchStatus',
            type: 'select',
            value: '',
            options: optionGenerator(BATCH_STATUS),
            placeholder: '请选择批次状态',
        },
        {
            label: '还款时间',
            key: 'increaseTime',
            type: 'datePicker',
            value: '',
            config: {
                type: 'daterange',              //daterange 日期范围类型
                rangeSeparator: '~',
                startPlaceholder: '开始日期',
                endPlaceholder: '结束日期'
            },
        },
    ]
}

// 信用额调整批次管理 - 表格项
export const CREDIT_ADJUST_BATCH_MANAGEMENT_COLUMNS = [
	{ prop: 'adjustBatchNo', label: '调整批次号', align: 'center', width: 100 },
	{ prop: 'entryPersonName', label: '录入人', align: 'center', width: 100 },
    { prop: 'entryTimeDesc', label: '录入时间', align: 'center', width: 150 },
    { prop: 'auditorName', label: '审核人', align: 'center', width: 100 },
    { prop: 'auditTimeDesc', label: '审核时间', align: 'center', width: 150 },
    {
			prop: 'increaseTime',
			label: '还款时间',
			align: 'center',
			width: 350,
			formatter: ({increaseTime}) => {
				return increaseTime.replace('至', ' 至 ')
			}
		},
    { prop: 'reduceTimeDesc', label: '扣减时间', align: 'center', width: 150 },
    { prop: 'auditStatusDesc', label: '审核状态', align: 'center' },
	{ prop: 'auditRemark', label: '审核备注', align: 'center', width: 120, },
	{ prop: 'batchStatusDesc', label: '批次状态', align: 'center' },
]

// 信用额调整批次详情 - 搜索项
export const CREDIT_ADJUST_BATCH_DETAIL_SEARCH = {
    form: [
        {
            label: '会员卡号',
            key: 'cardNo',
            type: 'input',
            value: '',
            placeholder: '请输入会员卡号'
        },
        {
            label: '信用额差值',
            key: 'creditDiffOption',
            type: 'select',
						value: '',
						tip: '上批增加信用额 - 本次增加信用额',
            options: [
                {
                    value: 1,
                    label: '等于0'
                },{
                    value: 2,
                    label: '其他'
                }
            ],
            placeholder: '请选择信用额差值',
        },
    ]
}

// 信用额调整批次详情 - 表格项
export const CREDIT_ADJUST_BATCH_DETAIL_COLUMNS = [
    { prop: 'adjustBatchNo', label: '调整批次号', align: 'center' },
    { prop: 'cardNo', label: '会员卡号', align: 'center', width: 100 },
	{ prop: 'realname', label: '顾客姓名', align: 'center' },
    { prop: 'lastIncreaseAmount', label: '上批增加信用额', align: 'center', width: 120,
        formatter: ({lastIncreaseAmount}) => {
            return addPrefixForAmount(lastIncreaseAmount);
        }
    },
    { prop: 'reduceAmount', label: '本次扣减信用额', align: 'center', width: 120,
        formatter: ({reduceAmount}) => {
            return addPrefixForAmount(reduceAmount);
        }
    },
    { prop: 'increaseAmount', label: '本次增加信用额', align: 'center', width: 120,
        formatter: ({increaseAmount}) => {
            return addPrefixForAmount(increaseAmount);
        }
    },
    { prop: 'creditDiffAmount', label: '信用额差值', align: 'center',
        formatter: ({creditDiffAmount}) => {
            return creditDiffAmount != 0 ? '其他' : creditDiffAmount;
        }
    },
    { prop: 'reduceTime', label: '扣减时间', align: 'center', width: 150 },
	{ prop: 'increaseTime', label: '增加时间范围', align: 'center', width: 156 },
	{ prop: 'batchdtlStatusDesc', label: '标记状态', align: 'center' },
]

// 信用额调整记录表 - 搜索项
export const CREDIT_ADJUST_RECORD_SHEET_SEARCH = {
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
            label: '生效时间范围',
            key: 'effectiveTime',
            type: 'datePicker',
            value: '',
            config: {
                type: 'daterange',              //daterange 日期范围类型
                rangeSeparator: '~',
                startPlaceholder: '开始日期',
                endPlaceholder: '结束日期'
            },
        },
    ]
}

// 信用额调整记录表 - 表格项
export const CREDIT_ADJUST_RECORD_SHEET_COLUMNS = [
    { prop: 'cardNo', label: '会员卡号', align: 'center', width: 120 },
    { prop: 'storeCode', label: '服务中心编号', align: 'center', width: 100 },
    { prop: 'shopType', label: '网点类型', align: 'center',
        formatter: ({shopType}) => {
            return shopType in NETWORK_TYPE_KEY_VALUE ? NETWORK_TYPE_KEY_VALUE[shopType] : '';
        }
    },
	{ prop: 'realname', label: '顾客姓名', align: 'center' },
    { prop: 'adjustAmount', label: '调整信用额', align: 'center',
        formatter: ({adjustAmount}) => {
            return addPrefixForAmount(adjustAmount);
        }
    },
    { prop: 'effectiveTime', label: '生效时间', align: 'center', width: 150,
        formatter: ({effectiveTime}) => {
            return formatDate(effectiveTime);
        }
    },
    { prop: 'entryPerson', label: '录入人', align: 'center', width: 120, },
    { prop: 'entryTime', label: '录入时间', align: 'center', width: 150,
        formatter: ({entryTime}) => {
            return formatDate(entryTime);
        }
    },
    { prop: 'auditorName', label: '审核人', align: 'center', width: 120, },
    { prop: 'auditTime', label: '审核时间', align: 'center', width: 150,
        formatter: ({auditTime}) => {
            return formatDate(auditTime);
        }
    },
]

// 信用额调整 - 审核状态
export const ADJUST_AUDIT_STATUS = {
    1: '待审核',
    2: '审核通过',
    7: '待提交',
    3: '审核未通过',
}

// 信用额调整/新增 - 搜索项
export const CREDIT_ADJUST_SEARCH = {
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
            label: '审核状态',
            key: 'auditStatus',
            type: 'select',
            value: '',
            options: [
                {
                    value: 7,
                    label: '待提交'
                },{
                    value: 1,
                    label: '待审核'
                },{
                    value: 2,
                    label: '审核通过'
                },{
                    value: 3,
                    label: '审核未通过'
                },
            ],
            placeholder: '请选择审核状态'
        },
        {
            label: '生效状态',
            key: 'effectStatus',
            type: 'select',
            value: '',
            options: [
                {
                    value: 1,
                    label: '未生效'
                },{
                    value: 2,
                    label: '已生效'
                }
            ],
            placeholder: '请选择生效状态'
        },
        {
            label: '生效时间范围',
            key: 'effectTime',
            type: 'datePicker',
            value: '',
            config: {
                type: 'datetimerange',              //daterange 日期范围类型
                rangeSeparator: '~',
                startPlaceholder: '开始日期',
                endPlaceholder: '结束日期'
            },
        },
    ]
}

// 信用额调整/新增 - 表格项
export const CREDIT_ADJUST_COLUMNS = [
    { prop: 'cardNo', label: '会员卡号', align: 'center', width: 120 },
    { prop: 'storeCode', label: '服务中心编号', align: 'center', width: 100 },
    { prop: 'shopType', label: '网点类型', align: 'center',
        formatter: ({shopType}) => {
            return shopType in NETWORK_TYPE_KEY_VALUE ? NETWORK_TYPE_KEY_VALUE[shopType] : '';
        }
    },
	{ prop: 'realname', label: '顾客姓名', align: 'center' },
    { prop: 'applyAmount', label: '调整信用额', align: 'center', width: 120,
        formatter: ({applyAmount}) => {
            return addPrefixForAmount(applyAmount);
        }
    },
    { prop: 'adjustedApplyAmount', label: '调整后额度', align: 'center',
        formatter: ({adjustedApplyAmount}) => {
            return addPrefixForAmount(adjustedApplyAmount);
        }
    },
    { prop: 'applyTime', label: '录入时间', align: 'center', width: 150,
        formatter: ({applyTime}) => {
            return formatDate(applyTime);
        }
    },
    { prop: 'instalment', label: '是否分期还款', align: 'center',
        formatter: ({instalment}) => {
            return instalment == 1 ? '是' : '否';
        }
    },
    { prop: 'auditStatus', label: '审核状态', align: 'center',
        formatter: ({auditStatus}) => {
            return auditStatus in ADJUST_AUDIT_STATUS ? ADJUST_AUDIT_STATUS[auditStatus] : '';
        }
    },
    { prop: 'auditRemark', label: '审核备注', align: 'center' },
    { prop: 'auditTime', label: '审核时间', align: 'center', width: 150,
        formatter: ({auditTime}) => {
            return formatDate(auditTime);
        }
    },
    { prop: 'effectStatusDesc', label: '生效状态', align: 'center' },
]

// 信用额调整/新增 - 修改项
export const CREDIT_ADJUST_EDIT_OPTIONS = [
    { key: 'memberCard', label: '会员卡号', value: '', type: 'input', require: true },
    { key: 'name', label: '顾客姓名', value: '', type: 'input', require: true },
    { key: 'creditAmount', label: '现有信用额', value: '', type: 'input', require: true },
    { key: 'newCredit', label: '调整/新增信用额', value: '', type: 'input', require: false },
    { key: 'adjustTime', label: '调整/新增时间', value: '', type: 'datePicker', require: false },
]

// 信用额调整/新增 - 新增/调整验证项
export const CREDIT_ADJUST_EDIT_RULES = {
    cardNo: [{required: true, message: '请输入会员卡号', trigger: 'blur'}],
    applyAmount: [{required: true, message: '请输入调整/新增信用额', trigger: 'blur'},
        { pattern: /^-?([1-9]\d*|0)(\.\d{1,2})?$/, message: '请输入数字，支持两位小数', trigger: 'blur'}
    ],
    // creditEffectTime: [{required: true, message: '选择日期时间', trigger: 'blur'}],
}
