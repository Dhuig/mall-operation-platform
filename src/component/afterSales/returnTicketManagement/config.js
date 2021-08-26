import { formatDateDefault } from 'util/formValidation';
// import { genCurrentMonthFirstAndLastDay } from 'util';

// 退票管理内容
export function TABITEM() {
    this.loading = false;
    this.data = [];
    this.total = 0;
    this.tabTotal = 0;
    this.selections = []
    this.pagination = {
        currentPage: 1,
        pageSize: 10,
    }
}

// 退票管理 选项卡数组
export const RETURN_TICKET_TABS_LIST = [
    ['全部售后单', 'all'],
    ['待退票', 'beRefund'],
    ['已退票', 'reFunded'],
    ['已驳回', 'reJect']
]

// 退票管理 申请来源
const APPLYSOURCE = [
    {
        value: '1',
        label: '顾客申请'
    },
    {
        value: '2',
        label: '公司申请'
    },
    {
        value: '3',
        label: '商城1.0申请'
    }
]
// 退票管理 搜索列表
export const GET_ORDER_RETURN_LIST = {
    form: [
        {
            label: '申请时间',
            key: 'applyTime',
            type: 'datePicker',
            value: [],
            config: {
                type: 'daterange',
                rangeSeparator: '~',
                startPlaceholder: '开始日期',
                endPlaceholder: '结束日期',
            }
        },
        {
            label: '申请来源',
            key: 'applySource',
            type: 'select',
            value: '',
            placeholder: '请选择申请来源',
            clearable: false,
            options: APPLYSOURCE,
        },
        {
            label: '售后单号',
            key: 'returnNo',
            type: 'input',
            value: '',
            placeholder: '请填写售后单号',
        },
        {
            label: '订单号',
            key: 'orderNo',
            type: 'input',
            value: '',
            placeholder: '请填写订单号',
        },
        {
            label: '分公司',
            key: 'companyCode',
            type: 'select',
            filterable: true,
            value: '',
            placeholder: '请选择分公司',
            options: [],
        },
        {
            label: '服务中心名称',
            key: 'storeName',
            type: 'input',
            value: '',
            placeholder: '请填写服务中心名称',
        },
        {
            label: '服务中心编号',
            key: 'storeCode',
            type: 'input',
            value: '',
            placeholder: '请填写服务中心编号',
        },
        {
            label: '顾客卡号',
            key: 'customerCard',
            type: 'input',
            value: '',
            placeholder: '请填写顾客卡号',
        },
        {
            label: '开单人卡号',
            key: 'creatorCard',
            type: 'input',
            value: '',
            placeholder: '请填写开单人卡号',
        },
    ],
    buttonGroup: [
        {
            type: '',
            title: '重置',
            key: 'reset'
        },
        {
            type: 'primary',
            title: '搜索',
            key: 'search'
        }
    ]
}
// 退票管理 tab-pane 列表 字典
export const RETURN_INVOICE_STATUS_TAB = {
    'all': '',
    'beRefund': '1',
    'reFunded': '2',
    'reJect': '3'
}
// 退票管理 处理状态字典 
const RETURN_INVOICE_STATIS = {
    '1': '待退票',
    '2': '已退票',
    '3': '已驳回',
}
// 退票管理 表格列表
export const PRODUCT_COLUMNS = [
    { prop: 'applyTimeDesc', label: '申请日期', align: 'center', width: '150' },
    { prop: 'customerCard', label: '顾客卡号', align: 'center', width: '100' },
    { prop: 'creatorCard', label: '开单人卡号', align: 'center', width: '120' },
    { prop: 'companyName', label: '分公司名称', align: 'center', width: '110' },
    { prop: 'companyCode', label: '分公司编号', align: 'center' },
    { prop: 'storeName', label: '服务中心名称', align: 'center', width: '120' },
    { prop: 'storeCode', label: '服务中心编号', align: 'center', width: '100' },
    { prop: 'applySourceDesc', label: '来源', align: 'center' },
    {
        prop: 'returnInvoiceStatus', label: '处理状态', align: 'center',
        formatter: ({ returnInvoiceStatus }) => {
            return returnInvoiceStatus in RETURN_INVOICE_STATIS ? RETURN_INVOICE_STATIS[returnInvoiceStatus] : '';
        }
    },
    { prop: 'returnNo', label: '售后单号', align: 'center', width: '200' },
    { prop: 'orderNo', label: '对应订单号', align: 'center', width: '180' },
];
// 退票管理 审核结果
export const AUDITSTATUS_RESULT = [
    { value: '1', name: '审核通过' },
    { value: '2', name: '审核不通过' },
];
// 退票管理 审核表单规则
export const REFUN_AUDIT_DIALOG_RULES = {
    auditStatus: [
        { required: true, message: '请选择审核结果', trigger: 'blur' }
    ],
    remarks: [
        { required: true, message: '请输入审核意见', trigger: 'blur' }
    ],
}
// 退票详情 顾客类型
export const CUSTOMERTYPE = {
    1: '普通顾客',
    2: '优惠顾客',
    3: '微店',
    4: '云商'
}
// 退票详情 退票方式
export const EXPRESSTYPE = {
    1: '服务中心自提',
    2: '公司交付'
}
// 退票详情 开票类型
export const INVOICETYPE = {
    1: '个人普通电子票',
    2: '企业普通电子发票',
    3: '企业专用纸质发票'
}
// 退票详情 开票状态
export const INVOICESTATUS = {
    1: '待开票',
    2: '开票中',
    3: '已开票'
}
// 退票详情 产品明细
export const ORDER_RETURN_PRODUCTS_COLUMS = [
    { label: '序号', prop: 'no', type: "index", align: 'center', width: 50, formatter: (record, prop, index) => index + 1 },
    { label: '产品编码', prop: 'productCode', align: 'center' },
    { label: '产品名称', prop: 'productName', align: 'center', width: 350 },
    { label: '规格', prop: 'packing', align: 'center' },
    { label: '单位', prop: 'meterUnit', align: 'center' },
    { label: '数量', prop: 'buyQuantity', align: 'center', summary: true },
    {
        label: '零售价',
        prop: 'retailPrice',
        align: 'center',
        formatter: ({ retailPrice }) => {
            return retailPrice?.toFixed(2)
        },
    },
    {
        label: '活动价',
        prop: 'price',
        align: 'center',
        formatter: ({ price }) => {
            return  price?.toFixed(2)
        },
    },
    { label: 'pv', prop: 'pv', align: 'center', summary: true },
    {
        label: '金额小计',
        prop: 'totalPrice',
        align: 'center',
        summary: true,
        sumConfig: {
            type: 'money',
            fixed: true
        },
        formatter: ({ totalPrice }) => {
            return `￥${totalPrice.toFixed(2)}`;
        },
    },
]

// 退票详情 审核记录
export const ORDER_SERVICELOGS_COLUMS = [
    { label: '序号', prop: 'no', type: "index", align: 'center', width: 50, formatter: (record, prop, index) => index + 1 },
    {
        label: '审核时间',
        prop: 'createTime',
        align: 'center',
        formatter: ({ createTime }) => {
            return formatDateDefault(createTime);
        },
    },
    { label: '审核结果', prop: 'content', align: 'center' },
    { label: '审核人', prop: 'operator', align: 'center' },
    { label: '机构', prop: 'organName', align: 'center' },
    { label: '备注说明', prop: 'remarks', align: 'center' },

]


//文件下载
// export function downloadFile(res, fileName) {
//     if (!res) {
//         return
//     }
//     if (window.navigator.msSaveBlob) {
//         try {
//             window.navigator.msSaveBlob(res, fileName)
//         } catch (e) {
//             console.log(e)
//         }
//     } else {
//         let url = window.URL.createObjectURL(new Blob([res]))
//         let link = document.createElement('a')
//         link.style.display = 'none'
//         link.href = url
//         link.setAttribute('download', fileName)// 文件名
//         document.body.appendChild(link)
//         link.click()
//         document.body.removeChild(link) // 下载完成移除元素
//         window.URL.revokeObjectURL(url) // 释放掉blob对象
//     }
// }
