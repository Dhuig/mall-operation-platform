import { addPrefixForAmount, formatDate } from 'util/formValidation.js';
// 列表页搜索栏
export const UNIT_PURCHASE_LIST_SEARCH = {
    form: [
        {
            label: '月份',
            key: 'orderMonth',
            type: 'datePicker',
            value: '',
            config: {
                type: 'month',                  //month 月份类型
                valueFormat: 'yyyyMM',
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                },
                placeholder: '请选择月份'
            },
        },
        {
            label: '服务中心编号',
            key: 'storeCode',
            type: 'input',
            value: '',
            placeholder: '请输入服务中心编号',
        },
        {
            label: '服务中心名称',
            key: 'storeName',
            type: 'input',
            value: '',
            placeholder: '请输入服务中心名称',
        },
        {
            label: '会员卡号',
            key: 'creatorCard',
            type: 'input',
            value: '',
            placeholder: '请输入会员卡号',
        }
    ],
    rules: {
        // orderMonth: [{required: true, message: '请选择月份', trigger: 'blur'}]
    }
}

// 列表页-表格配置
export const LIST_COLUMNS = [
    {
        prop: 'orderMonth',
        label: '月份',
        align: 'center',
        formatter: ({ orderMonth }) => {
            return orderMonth ? orderMonth.replace(/(\d{4})(\d{2})/, '$1-$2') : '';
        }
    },
    { prop: 'storeCode', label: '服务中心编号', align: 'center' },
    { prop: 'storeName', label: '服务中心名称', align: 'center', width: 120 },
    { prop: 'creatorCard', label: '会员卡号', align: 'center', width: 180 },
    {
        prop: 'balanceAmount',
        label: '本月结余',
        align: 'center',
        width: 120,
        summary: true,
        summaryConfig: { type: 'money' },
        formatter: ({ balanceAmount }) => {
            return addPrefixForAmount(balanceAmount);
        }
    },
    {
        prop: 'differenceAmount',
        label: '团购差额',
        align: 'center',
        width: 120,
        summary: true,
        summaryConfig: { type: 'money' },
        formatter: ({ differenceAmount }) => {
            return addPrefixForAmount(differenceAmount);
        }
    },
    {
        prop: 'returnAmount',
        label: '6-12%的折扣',
        align: 'center',
        width: 120,
        summary: true,
        summaryConfig: { type: 'money' },
        formatter: ({ returnAmount }) => {
            return addPrefixForAmount(returnAmount);
        }
    },
    {
        prop: 'giftCouponAmount',
        label: '电子礼券',
        align: 'center',
        width: 120,
        summary: true,
        summaryConfig: { type: 'money' },
        formatter: ({ giftCouponAmount }) => {
            return addPrefixForAmount(giftCouponAmount);
        }
    },
    {
        prop: 'expressSubsidyAmount',
        label: '运费补贴券',
        align: 'center',
        width: 120,
        summary: true,
        summaryConfig: { type: 'money' },
        formatter: ({ expressSubsidyAmount }) => {
            return addPrefixForAmount(expressSubsidyAmount);
        }
    },
    {
        prop: 'actuallyAmount',
        label: '单位实际支付金额(按团购价)',
        align: 'center',
        width: 120,
        summary: true,
        summaryConfig: { type: 'money' },
        formatter: ({ actuallyAmount }) => {
            return addPrefixForAmount(actuallyAmount);
        }
    },
    {
        prop: 'orderAmount',
        label: '当月报单金额(按零售价)',
        align: 'center',
        width: 120,
        summary: true,
        summaryConfig: { type: 'money' },
        formatter: ({ orderAmount }) => {
            return addPrefixForAmount(orderAmount);
        }
    },
];

// 详情页搜索栏
export const UNIT_PURCHASE_DETAIL_SEARCH = {
    form: [
        {
            label: '报单订单号',
            key: 'orderNo',
            type: 'input',
            value: '',
            placeholder: '请输入报单订单号',
        },
    ]
}

export const DETAIL_COLUMNS = [
    { prop: 'customerCard', label: '购货人卡号', align: 'center' },
    { prop: 'customerName', label: '购货人', align: 'center' },
    {
        prop: 'commitTime',
        label: '销售呈报时间',
        align: 'center',
        formatter: ({ commitTime }) => {
            return formatDate(commitTime);
        }
    },
    { prop: 'orderNo', label: '报单订单号', align: 'center' },
    {
        prop: 'differenceAmount',
        label: '团购差额',
        align: 'center',
        summary: true,
        summaryConfig: { type: 'money' },
        formatter: ({ differenceAmount }) => {
            return addPrefixForAmount(differenceAmount);
        }
    },
    {
        prop: 'returnAmount',
        label: '6-12%的折扣',
        align: 'center',
        summary: true,
        summaryConfig: { type: 'money' },
        formatter: ({ returnAmount }) => {
            return addPrefixForAmount(returnAmount);
        }
    },
    {
        prop: 'giftCouponAmount',
        label: '电子礼券',
        align: 'center',
        summary: true,
        summaryConfig: { type: 'money' },
        formatter: ({ giftCouponAmount }) => {
            return addPrefixForAmount(giftCouponAmount);
        }
    },
    {
        prop: 'expressSubsidyAmount',
        label: '运费补贴券',
        align: 'center',
        summary: true,
        summaryConfig: { type: 'money' },
        formatter: ({ expressSubsidyAmount }) => {
            return addPrefixForAmount(expressSubsidyAmount);
        }
    },
    {
        prop: 'actuallyAmount',
        label: '单位实际支付金额(按团购价)',
        align: 'center',
        summary: true,
        summaryConfig: { type: 'money' },
        formatter: ({ actuallyAmount }) => {
            return addPrefixForAmount(actuallyAmount);
        }
    },
    {
        prop: 'orderAmount',
        label: '当月报单金额(按零售价)',
        align: 'center',
        summary: true,
        summaryConfig: { type: 'money' },
        formatter: ({ orderAmount }) => {
            return addPrefixForAmount(orderAmount);
        }
    },
]
