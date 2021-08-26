import { addPrefixForAmount, numberAndDot } from 'util/formValidation.js'

// tablelist列表显示数字方法
export const tableZeroShow = (number) => {
    return typeof number == 'number' ? String(number) : '';
}
// 正则匹配正数负数
export const pattenPositiveNum = /^([1-9]\d*|0)(\.\d{1,2})?$/;
export const pattenNegativeNum = /^-([1-9]\d*|0)(\.\d{1,2})?$/;
// 手工录入款项 -- rules
export const HAND_INPUT_RULES = {
    companyCode: [{ required: true, message: '请选择分公司编号', trigger: 'blur' }],
    type: [{ required: true, message: '请选择款项类型', trigger: 'change' }],
    transMethod: [{ required: true, message: '请选择银行类型', trigger: 'change' }],
    adjustAmount: [{ required: true, message: '请输入金额数字', trigger: 'blur' }],
    adjustReason: [{ required: true, message: '请输入修改原因说明', trigger: 'blur' }],
};

// 分公司列表
export const COMPANY_LIST = {};

//手工录入搜索项
// 手工录入列表项
export const HAND_INPUT_MONEY_COLUMNS_CONFIG = [
    { prop: 'companyNo', label: '分公司编号', align: 'center' },
    { prop: 'mobile', label: '普客手机号码', align: 'center' },
    { prop: 'cardNo', label: '会员卡号', align: 'center' },
    { prop: 'realname', label: '顾客姓名', align: 'center' },
    { prop: 'cardTypeDesc', label: '顾客类型', align: 'center' },
    {
        prop: 'thisMonthActualBalanceAmt', label: '本期实际结余', align: 'center',
        summary: true,
        formatter: ({ thisMonthActualBalanceAmt }) => {
            return tableZeroShow(thisMonthActualBalanceAmt)
        }
    },
    {
        prop: 'thisCreditAmt', label: '当前信用额', align: 'center',
        summary: true,
        formatter: ({ thisCreditAmt }) => {
            return tableZeroShow(thisCreditAmt)
        }
    },
    {
        prop: 'thisBigWalletBalanceAmt', label: '本期大钱包余额（财务用）', align: 'center',
        summary: true,
        formatter: ({ thisBigWalletBalanceAmt }) => {
            return tableZeroShow(thisBigWalletBalanceAmt)
        }
    },
]


// 手工录入审核搜索项
export const HAND_INPUT_MONEY_CHECK_SEARCH = {
    form: [
        {
            label: '录入月份',
            key: 'adjustMonth',
            type: 'datePicker',
            value: '',
            rules: {
                required: true,
            },
            config: {
                type: 'month',
                valueFormat: 'yyyy-MM',
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                },
                placeholder: '请选择月份'
            }
        },
        {
            label: '普客手机号码',
            key: 'mobile',
            type: 'input',
            value: '',
            placeholder: '请输入普客手机号码'
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
            placeholder: '请选择分公司编号',
            options: [],
        }
    ]
}
// 表格项tab
export const HAND_INPUT_AUDIT_COLUMNS_TABS = [
    ['全部', 'all'],
    ['待审核', 'tobeAudit'],
    ['已通过', 'passed'],
    ['已驳回', 'rejected'],
    ['已撤回', 'canceled'],
]
export const HAND_INPUT_AUDIT_STATUS = {
    'all': null,
    'tobeAudit': 1,
    'passed': 2,
    'rejected': 3,
    'canceled': 6,
}
// 表格项
export const HAND_INPUT_MONEY_CHECK_COLUMNS_CONFIG = [
    { prop: 'companyNo', label: '分公司编号', align: 'center' },
    { prop: 'mobile', label: '普客手机号码', align: 'center' },
    { prop: 'cardNo', label: '会员卡号', align: 'center' },
    { prop: 'realname', label: '姓名', align: 'center' },
    {
        prop: 'adjustAmount',
        label: '录入金额',
        align: 'center',
        width: 120,
        formatter: ({ adjustAmount }) => {
            return addPrefixForAmount(adjustAmount);
        }
    },
    { prop: 'entryPersonName', label: '录入人', align: 'center' },
    { prop: 'entryTimeDesc', label: '录入时间', align: 'center', width: 150 },
    { prop: 'adjustReason', label: '录入人备注', align: 'center', width: 150 },
    { prop: 'auditorName', label: '审批人', align: 'center' },
    { prop: 'auditTimeDesc', label: '审批时间', align: 'center', width: 150 },
    { prop: 'auditRemark', label: '审批意见', align: 'center', width: 150 },
    { prop: 'adjustStatusDesc', label: '审批状态', align: 'center' }
]

// 区分审批详情弹窗 详情为1  审批为2
export const SWITCH_POP_DETAIL_CHECK = 1;   //

// 修改钱包余额弹窗 - 款项类型
export const MONEY_TYPE = [
    // { label: '团购垫付款项', value: 1 },
    // { label: '团购单位汇款', value: 2 },
    // { label: '自动划款', value: 3 },
    // { label: '申请退款', value: 4 },
    // { label: '手工确认款项', value: 5 },
    // { label: '订货汇款', value: 6 },
    // { label: '订货款转压货款', value: 7 },
    // { label: '团购垫付款退款', value: 8 },
    // { label: '补银行流水', value: 9 },
    // { label: '还欠款', value: 10 },
    // { label: '申请提现', value: 11 },
    // { label: '作废卡体现', value: 12 },
]

// 审批详情验证
export const AUDIT_DETAIL_RULES = {
    status: [{ required: true, message: '请选择审批结果', trigger: 'change' }],
    auditRemark: [{ required: true, message: '请输入修改审批意见', trigger: 'blur' }],
}
// 修改钱包余额验证
export const EDIT_BALANCE_RULES = {
    type: [{ required: true, message: '请选择款项类型', trigger: 'change' }],
    operateType: [{ required: true, message: '请选择', trigger: 'change' }],
    adjustAmount: [
        { required: true, validator: numberAndDot, message: '输入非负数字，支持小数点后2位', trigger: 'blur' },
    ],
    adjustReason: [{ required: true, message: '请输入', trigger: 'blur' }],
}

// 审核信息列表 配置
export const AUDIT_LOGS_COLUMNS_CONFIG = [
    { prop: 'auditorName', label: '审批人', align: 'center' },
    { prop: 'auditTimeDesc', label: '审批时间', align: 'center', width: 150, },
    { prop: 'adjustStatusDesc', label: '审批结果', align: 'center' },
    { prop: 'remark', label: '审批意见', align: 'center' },
]