import { addPrefixForAmount } from 'util/formValidation.js'
import { optionGenerator } from 'util'
import { CUSTOMER_TYPE } from '@/component/customerManagement/config'
import { BACK_TRANS_TYPE } from '@/component/financialManagement/perfectWallet/config'

// 账款类型
export const ACCOUNTS_TYPE = {
    1: '充值',
    2: '购货转入',
    6: '提现',
    7: '原路退款',
    9: '还欠款',
    10: '补银行流水',
    11: '手工退款',
    12: '押货款与钱包互转',
    13: '其他',
}
// 自动/手工
export const AUTO_OR_HAND = {
    1: '自动',
    2: '手工',
}
// 搜索栏
export const BRANCH_COMPANY_BANK_LIST_SEARCH = {
    form: [
        {
            label: '月份',
            key: 'transTime',
            type: 'datePicker',
            value: '',
            config: {
                type: 'month',
                valueFormat: 'yyyy-MM',
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                },
                placeholder: '请选择月份',
            },
        },
        {
            label: '分公司编号',
            key: 'companyCode',
            type: 'select',
            value: '',
            options: [],
            placeholder: '请选择分公司编号',
        },
        {
            label: '到账时间',
            key: 'timerange',
            type: 'datePicker',
            value: [],
            config: {
                type: 'daterange',
                rangeSeparator: '~',
                startPlaceholder: '开始日期',
                endPlaceholder: '结束日期',
                valueFormat: 'yyyy-MM-dd HH:mm:ss',
            }
        },
        {
            label: '会员卡号',
            key: 'cardNo',
            type: 'input',
            value: '',
            placeholder: '请输入会员卡号',
        },
        {
            label: '普客手机号',
            key: 'mobile',
            type: 'input',
            value: '',
            placeholder: '请输入普客手机号',
        },
        {
            label: '顾客类型',
            key: 'memberTypeList',
            type: 'select',
            value: [],
            multiple: true,
            options: optionGenerator(CUSTOMER_TYPE).slice(0, 4),
            placeholder: '请选择顾客类型',
        },
        {
            label: '账款类型',
            key: 'transType',
            type: 'select',
            value: '',
            options: optionGenerator(ACCOUNTS_TYPE),
            placeholder: '请选择账款类型',
        },
        {
            label: '自动/手工',
            key: 'autoType',
            type: 'select',
            value: '',
            options: optionGenerator(AUTO_OR_HAND),
            placeholder: '请选择自动/手工',
        },
    ],
    rules: {
        transTime: [{ required: true, message: '请选择月份', trigger: 'blur' }],
        companyCode: [{ required: true, message: '请选择分公司编号', trigger: 'blur' }],
    }
}

const HAND_DEAL_METHOD = Object.keys(BACK_TRANS_TYPE).slice(8).map(item => Number(item));
// 列表页-表格配置
export const LIST_COLUMNS = [
    { prop: 'transNo', label: '交易流水号', align: 'center', width: 160 },
    { prop: 'companyCode', label: '分公司编号', align: 'center' },
    { prop: 'mobile', label: '普客手机号', align: 'center', width: 110 },
    { prop: 'cardNo', label: '会员卡号', align: 'center', width: 100, },
    { prop: 'realname', label: '顾客姓名', align: 'center' },
    { prop: 'memberTypeDesc', label: '顾客类型', align: 'center' },
    {
        prop: 'transAmount', label: '转账金额', align: 'center', width: 120,
        summary: true,
        formatter: ({ transAmount }) => {
            return addPrefixForAmount(transAmount);
        }
    },
    { prop: 'transTypeDesc', label: '账款类型', align: 'center' },
    { prop: 'payTimeDesc', label: '到账时间', align: 'center', width: 150, },
    { prop: 'bankAccount', label: '银行账号', align: 'center', width: 150, },
    { prop: 'bankTypeCode', label: '银行类型', align: 'center' },
    { prop: 'bankTypeName', label: '银行类型名称', align: 'center', width: 120, },
    {
        prop: 'payTimeDesc', label: '自动/手工', align: 'center',
        formatter: ({ transType }) => {
            return HAND_DEAL_METHOD.includes(transType) ? '手工' : '自动';
        }
    },
    { prop: 'entryPersonName', label: '录入人', align: 'center' },
    { prop: 'entryTime', label: '录入时间', align: 'center', width: 150, },
    { prop: 'entryRemark', label: '录入备注', align: 'center' },
    { prop: 'auditorName', label: '审核人', align: 'center' },
    { prop: 'auditTime', label: '审核时间', align: 'center', width: 150, },
    { prop: 'auditRemark', label: '审核备注', align: 'center' },
]

export const EAS_COLUMNS = [
    { prop: 'index', label: '序号', align: 'center' },
    { prop: 'createTime', label: '创建时间', align: 'center' },
    { prop: 'filename', label: '文件名称', align: 'center' },
]
