import { optionGenerator } from 'util';
// import { formatDateDefault } from 'util/formValidation.js';
// 手续费类型
export const FEE_TYPE = {
    101: '微信',
    102: '支付宝',
    103: '银联',
    // 201: '工商银行',
    // 202: '建设银行',
    // 203: '邮政存蓄银行',
    // 204: '交通银行',
    205: '平安代扣'
}
// 手续费明细表 -- 搜索项
export const SERVICE_FEE_SCHEDULE_SEARCH = {
    form: [
        {
            label: '月份',
            key: 'feeMonth',
            type: 'datePicker',
            value: Date.now(),
            config: {
                type: 'month',
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                },
                placeholder: '请选择月份'
            }
        },
        {
            label: '分公司编号',
            key: 'companyCode',
            type: 'select',
            value: '',
            options: [
                {
                    value: '001006',
                    label: '001006'
                },
                {
                    value: '001006',
                    label: '001006'
                },
            ],
            placeholder: '请选择分公司编号'
        },
        {
            label: '会员卡号',
            key: 'cardNo',
            type: 'input',
            value: '',
            placeholder: '请输入会员卡号'
        },
        {
            label: '手续费类型',
            key: 'feeType',
            type: 'select',
            value: '',
            options: optionGenerator(FEE_TYPE),
            placeholder: '请选择手续费类型'
        },
    ],
    rules: {
        feeMonth: [{ required: true, message: '请选择月份', trigger: 'blur' }],
        
    },
}

export const SERVICE_FEE_SCHEDULE_HEADER_CONFIG = {
    1: {
        name: '普通顾客',
        prop: 'normal',
        type: '1',
    },
    2: {
        name: '优惠顾客',
        prop: 'vip',
        type: '2',
    },
    3: {
        name: '云商/云+',
        prop: 'cloud',
        type: '3',
    }
}

// // 手续费明细表 -- 数据
export const SERVICE_FEE_DATA = {
    normal: {
        data: [],
        pagination: {
            currentPage: 1,
            pageSize: 10,
        },
        total: 0,
    },
    vip: {
        data: [],
        pagination: {
            currentPage: 1,
            pageSize: 10,
        },
        total: 0,
    },
    cloud: {
        data: [],
        pagination: {
            currentPage: 1,
            pageSize: 10,
        },
        total: 0,
    }
}

// 手续费明细表 -- 列表项
export const SERVICE_FEE_SCHEDULE_COLUMNS_CONFIG = [
    {
        prop: 'feeMonth',
        label: '所属月份',
        align: 'center'
    },
    {
        prop: 'companyCode',
        label: '分公司编号',
        align: 'center',
        width: 100
    },
    {
        prop: 'cardNo',
        label: '会员卡号',
        align: 'center',
        width: 120
    },
    {
        prop: 'realname',
        label: '姓名',
        align: 'center'
    },
    {
        prop: 'feeType',
        label: '手续费类型',
        align: 'center',
        width: 100,
        formatter: ({ feeType }) => {
            return FEE_TYPE[feeType];
        }
    },
    // {
    //     prop: 'feeRate',
    //     label: '费率',
    //     align: 'center',
    //     formatter: ({ feeRate }) => {
    //         return feeRate + '‰';
    //     }
    // },
    {
        prop: 'transAmount',
        label: '金额',
        align: 'center',
        width: 120,
    },
    {
        prop: 'refundFlag',
        label: '是否退款',
        align: 'center',
        formatter: ({ refundFlag }) => {
            return refundFlag ? '是' : '否';
        }
    },
    {
        prop: 'bankTransFee',
        label: '银行实际交易手续费',
        align: 'center',
        width: 130,
        formatter: ({ bankTransFee }) => {
            return bankTransFee ? '￥' + bankTransFee : '￥0';
        }
    },
    {
        prop: 'orderNoList',
        label: '订单编号',
        align: 'center',
        width: 180,
        formatter: ({ orderNoList }) => {
            let result = '';
            orderNoList && orderNoList.map((v) => {
                result += `<span>${v}</span>、`;
            })
            return result.substr(0, result.length - 1);
        }
    },
    {
        prop: 'feeNo',
        label: '交易流水号',
        align: 'center',
        width: 180,
    },
    {
        prop: 'updateTime',
        label: '操作时间',
        align: 'center',
        width: 150,
    },
]
