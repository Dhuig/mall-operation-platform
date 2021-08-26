// 搜索栏 配置
export const BANK_CARD_SIGN_MANAGEMENT_SEARCH = {
    form: [
        {
            label: '分公司编号',
            key: 'companyCode',
            type: 'select',
            value: '',
            options: [
                {
                    value: '02000',
                    label: '02000'
                },
                {
                    value: '03000',
                    label: '03000'
                },
            ],
            placeholder: '请选择公司编号'
        },
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
            label: '签约银行',
            key: 'bankType',
            type: 'select',
            value: '',
            options: [
                {
                    value: '1',
                    label: '工商银行（ICBC）'
                },
                {
                    value: '2',
                    label: '邮政储蓄银行（PSBC）'
                },
            ],
            placeholder: '请选择签约银行'
        },
        {
            label: '签约银行账号',
            key: 'bankAccount',
            type: 'input',
            value: '',
            placeholder: '请输入签约银行账号'
        },
        {
            label: '手机号码',
            key: 'tel',
            type: 'input',
            value: '',
            placeholder: '请输入手机号码'
        },
        {
            label: '提交签约时间',
            key: 'createTime',
            type: 'datePicker',
            value: '',
            rules: {
                required: true,
            },
            config: {
                type: 'date',
                pickerOptions: {},
                placeholder: '请选择日期'
            }
        },
        {
            label: '顾客类型',
            key: 'memberType',
            type: 'select',
            value: '',
            options: [
                {
                    value: '3',
                    label: '云商'
                },
                {
                    value: '4',
                    label: '微店'
                },
            ],
            placeholder: '请选择顾客类型'
        },
        {
            label: '状态',
            key: 'status',
            type: 'select',
            value: '',
            options: [
                {
                    value: '0',
                    label: '已签约'
                },
                {
                    value: '1',
                    label: '已解约'
                },
            ],
            placeholder: '请选择状态类型'
        },
    ]
}
// 顾客类型
export const MEMBER_TYPE = {
    1: "普通顾客",
    2: "优惠顾客",
    3: "云商",
    4: "微店",
    5: "店员",
    6: "子账号"
}
// 银行卡签约状态
export const BIND_STATUS = {
    0: "已签约",
    1: "已解约",
}
// 签约银行卡类型对应字段指引
export const SIGN_BANK_TYPE_GUIDE = {
    1: 'ICBC',
    2: 'PSBC'
}

// 表格项
export const BANK_CARD_SIGN_MANAGEMENT_COLUMNS_CONFIG = [
    { prop: 'companyCode', label: '分公司编号', align: 'center' },
    {
        prop: 'memberType',
        label: '顾客类型',
        align: 'center',
        formatter: ({memberType}) => {
            return MEMBER_TYPE[memberType];
        }
    },
    { prop: 'storeCode', label: '服务中心编号', align: 'center', width: 120 },
    { prop: 'cardNo', label: '会员卡号', align: 'center', width: 120 },
    { prop: 'bindName', label: '姓名', align: 'center' },
    { prop: 'bindIdcard', label: '身份证号码', align: 'center', width: 200 },
    { prop: 'createTime', label: '提交签约时间', align: 'center', width: 150 },
    { prop: 'bankType', label: '签约银行', align: 'center' },
    { prop: 'bankAccount', label: '签约银行账号', align: 'center', width: 200 },
    { prop: 'tel', label: '手机号码', align: 'center', width: 150 },
    {
        prop: 'bindStatus',
        label: '状态',
        align: 'center',
        formatter: ({bindStatus}) => {
            return BIND_STATUS[bindStatus];
        }
    },

]

// 修改手机号验证
export const PHONE_VALIDATION = {
    tel: [
        { required: true,  message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: '请输入正确手机号', trigger: 'blur' }
    ]
}
 