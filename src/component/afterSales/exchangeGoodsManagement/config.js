import { optionGenerator } from 'util';
import { formatDateStr } from 'util/formValidation';


const APPLY_SOURCE = {
    '1': '顾客申请',
    '2': '代客售后',
    '3': '商城1.0申请'
}


// 换货 交付方式
export const EXPRESSTYPE = {
    '1': '服务中心自提',
    '2': '公司交付'
}

// 换货 换货方式 
export const EXCHANGETYPE = {
    '1': '先退后换',
    '2': '秒换',
    '3': '先换后退'
}

// 换货 顾客类型
export const CUSTOMERTYPE = {
    1: '普通顾客',
    2: '优惠顾客',
    3: '云商',
    4: '微店',
}
// 换货 搜索
export const EXCHANGE_GOODS_SEARCH = {
    form: [
        {
            label: '申请时间',
            key: 'applyTime',
            type: 'datePicker',
            value: [],
            config: {
                type: 'daterange',
            }
        },
        {
            label: '申请来源',
            key: 'applySource',
            type: 'select',
            value: '',
            clearable: false,
            placeholder: '请选择申请来源',
            options: optionGenerator(APPLY_SOURCE)
        },
        {
            label: '交付方式',
            key: 'expressType',
            type: 'select',
            value: '',
            clearable: false,
            placeholder: '请选择交付方式',
            options: optionGenerator(EXPRESSTYPE)
        },
        {
            label: '换货方式',
            key: 'exchangeType',
            type: 'select',
            value: '',
            clearable: false,
            placeholder: '请选择换货方式',
            options: optionGenerator(EXCHANGETYPE)
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
        // {
        //     label: '服务中心名称',
        //     key: 'storeName',
        //     type: 'input',
        //     value: '',
        //     placeholder: '请填写服务中心名称',
        // },
        // {
        //     label: '服务中心编号',
        //     key: 'storeCode',
        //     type: 'input',
        //     value: '',
        //     placeholder: '请填写服务中心编号',
        // },
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
        {
            label: '换货单号',
            key: 'exchangeNo',
            type: 'input',
            value: '',
            placeholder: '请填写换货订单号',
        },
        {
            label: '对应订单号',
            key: 'orderNo',
            type: 'input',
            value: '',
            placeholder: '请填写对应订单号',
        },
    ]
}



// 换货 列表
export const EXCHANGE_GOODS_COLUMNS = [
    { prop: 'applyTimeDesc', label: '申请日期', align: 'center', width: 160 },
    { prop: 'customerCard', label: '顾客卡号', align: 'center', width: 100 },
    { prop: 'creatorCard', label: '开单人卡号', align: 'center', width: 120 },
    { prop: 'companyName', label: '分公司', align: 'center', width: 110 },
    // { prop: 'storeName', label: '服务中心名称', align: 'center',width:150 },
    { prop: 'applySourceDesc', label: '来源', align: 'center', width: 100 },
    { prop: 'expressTypeDesc', label: '交付方式', align: 'center', width: 110 },
    {
        prop: 'exchangeType', label: '换货方式', align: 'center', width: 110,
        formatter: ({ exchangeType }) => {
            return String(exchangeType) in EXCHANGETYPE ? EXCHANGETYPE[exchangeType] : ''
        }
    },
    { prop: 'orderDeliverStatusDesc', label: '订单发货状态', align: 'center', width: 100 },
    { prop: 'exchangeStatusDesc', label: '处理状态', align: 'center' },
    { prop: 'exchangeNo', label: '售后单号', align: 'center', width: 200 },
    { prop: 'orderNo', label: '对应订单号', align: 'center', width: 180 },
    {
        prop: 'orderAmount', label: '订单金额', align: 'center',
        formatter: ({ orderAmount }) => {
            return '￥' + orderAmount
        }
    },
    { prop: 'pv', label: '订单积分/PV', align: 'center', width: 110 },
];

// 换货 选项卡数组
export const EXCHANGE_GOODS_TABS_LIST = [
    ['全部', 'all'],
    ['待审核', 'authstr'],
    ['待退回', 'reFunded'],
    ['待验货', 'inspection'],
    ['待发货', 'toSend'],
    ['待确认', 'toConfirm'],
    ['已完成', 'done'],
    ['已取消/已拒绝', 'canceled'],
]

// 产品版本状态字典
export const EXCHANGE_GOODS_STATUS_MAP = { //exchangeStatus
    all: "",
    authstr: "1",
    reFunded: "2",
    inspection: "3",
    toSend: "4",
    toConfirm: "5",
    done: "99",
    canceled: "98"
}
// 选显卡内容
export function TABITEM() {
    this.loading = false;
    this.data = [];
    this.total = 0;
    this.tabTotal = 0;
    this.pagination = {
        currentPage: 1,
        pageSize: 10,
    }
}


// 换货详情 ——————————————————————————————————————————————————————————————————————

export const APPLYSOURCE = {
    '0': '代客售后',
    '1': '顾客申请',
    '2': '代客售后',
}

// 日常使用时段
const USEPERIOD = {
    '1': '早',
    '2': '中',
    '3': '晚',
}
// 问题发生状态
export const PROBLEMSTATUS = {
    1: '初次开封使用发现',
    2: '使用过程中发现'
}
// 旧货处理方式
export const JUNKHANDLETYPE = {
    1: '分公司处理',
    2: '中转仓处理'
}

// 换货详情 换货产品明细
export const EXCHANGE_GOODS_PRODUCTS_COLUMS = [
    { label: '序号', prop: 'no', type: "index", align: 'center', width: 50, formatter: (record, prop, index) => index + 1 },
    { label: '产品编码', prop: 'productCode', align: 'center' },
    { label: '产品名称', prop: 'productName', align: 'center', width: 350 },
    { label: '规格', prop: 'packing', align: 'center' },
    { label: '单位', prop: 'meterUnit', align: 'center' },
    { label: '购买数量', prop: 'buyQuantity', align: 'center', summary: true },
    { label: '换货数量', prop: 'quantity', align: 'center', summary: true },
    { label: '生产日期/有效期', prop: 'expiryData', align: 'center', width: 120 },
    { label: '批号', prop: 'batchNumber', align: 'center' },
    { label: '二维码', prop: 'qrCode', align: 'center' },
    { label: '初次使用时间', prop: 'firstUseTime', align: 'center', width: 120, },
    {
        label: '日常使用时段', prop: 'usePeriod', align: 'center', width: 120,
        formatter: ({ usePeriod }) => usePeriod in USEPERIOD ? USEPERIOD[usePeriod] : null
    },
    {
        label: '问题发生状态', prop: 'problemStatus', align: 'center', width: 120,
        formatter: ({ problemStatus }) => problemStatus in PROBLEMSTATUS ? PROBLEMSTATUS[problemStatus] : null
    },
    { label: '产品内容物状态', prop: 'problemDesc', align: 'center', width: 120 },
]

// 换货详情 操作记录
export const EXCHANGE_GOODS_ORDERSERVICELOGS = [
    { label: '序号', prop: 'no', type: "index", align: 'center', width: 50, formatter: (record, prop, index) => index + 1 },
    {
        label: '操作时间', prop: 'createTime', align: 'center',
        formatter: ({ createTime }) => {
            return formatDateStr(createTime);
        }
    },
    { label: '操作内容', prop: 'content', align: 'center' },
    { label: '操作人', prop: 'operator', align: 'center' },
    { label: '机构', prop: 'organName', align: 'center' },
    { label: '备注', prop: 'remarks', align: 'center' },
]
// 换货详情 审核意见
export const EXCHANGE_GOODS_SERVICE_COMMENTS = [
    { label: '序号', prop: 'no', type: "index", align: 'center', width: 50, formatter: (record, prop, index) => index + 1 },
    {
        label: '审核时间', prop: 'createTime', align: 'center',
        formatter: ({ createTime }) => {
            return formatDateStr(createTime);
        }
    },
    { label: '审核人', prop: 'creator', align: 'center' },
    { label: '机构', prop: 'comName', align: 'center' },
    { label: '审核内容', prop: 'comment', align: 'center' },
]
export const IDEA_RULES = {
    comment: [{ required: true, message: '请输入审核意见', trigger: 'blur' }],
}

// 编辑换货

export const OPTIONS_DATA = optionGenerator(USEPERIOD)
export const PROBLEM_STATUS = optionGenerator(PROBLEMSTATUS)

// 编辑换货详情
export const EXCHANGE_ORDER_UPDATE_INFO_RULES = {
    reason1Id: [
        { required: true, message: '请选择一级退货原因', trigger: ['blur', 'change'] }
    ],
    exchangeType: [
        { required: true, message: '请选择换货方式', trigger: ['blur', 'change'] }
    ],
    junkHandleType: [
        { required: true, message: '请选择旧货处理方式', trigger: ['blur', 'change'] }
    ]
}

export const EXCHANGE_TYPE = [
    {
        value: '1',
        label: '二级原因1'
    },
    {
        value: '2',
        label: '二级原因2'
    },
    {
        value: '3',
        label: '二级原因3'
    },
    {
        value: '4',
        label: '二级原因4'
    }
]

// 审核编辑————————————————————————————
// 退货审核 / 验证审核 规则
export const AUDIT_VERIFY_DIALOG_RULES = {
    auditStatus: [
        { required: true, message: '请选择审核结果', trigger: 'blur' }
    ],
    remarks: [
        { required: true, message: '请输入审核不通过的原因', trigger: 'blur' }
    ],
    reason1Id: [
        { required: true, message: '请选择一级退货原因', trigger: ['blur', 'change'] }
    ],
    exchangeType: [
        { required: true, message: '请输入换货方式', trigger: 'blur' }
    ],
    junkHandleType: [
        { required: true, message: '请输入旧货处理方式', trigger: 'blur' }
    ],
}
// 退货详情 审核
export const AUDIT_VERIFY = [
    { value: '1', name: '审核通过' },
    { value: '2', name: '审核不通过' },
]

export const AUDITVERIFY = {
    '1': '审核通过',
    '2': '审核不通过',
}


//售后订单步骤条(先退后换)
export const ARTICLE_STEPS = [
    {
        statusDesc: "提交换货单",
        value: '1'
    },
    {
        statusDesc: "分公司审核",
        value: '2'
    },
    {
        statusDesc: "顾客退回",
        value: '3'
    },
    {
        statusDesc: "分公司验货",
        value: '4'
    },
    {
        statusDesc: "分公司发货",
        value: '5'
    },
    {
        statusDesc: "顾客确认",
        value: ''
    },
    {
        statusDesc: "完成",
        value: '99'
    },
]

//售后订单步骤条(秒换)
export const ARTICLE_STEPS_RIGHT_OFF = [
    {
        statusDesc: "提交换货单",
        value: '1'
    },
    {
        statusDesc: "分公司审核",
        value: '2'
    },
    {
        statusDesc: "顾客退回",
        value: '4'
    },
    {
        statusDesc: "分公司发货",
        value: '3'
    },
    {
        statusDesc: "分公司验货",
        value: '5'
    },
    {
        statusDesc: "顾客确认",
        value: ''
    },
    {
        statusDesc: "完成",
        value: '99'
    },
]

//售后订单步骤条(先换后退)
export const ARTICLE_STEPS_SWITCH_BACK_FIRST = [
    {
        statusDesc: "提交换货单",
        value: '1'
    },
    {
        statusDesc: "分公司审核",
        value: '4'
    },
    {
        statusDesc: "分公司发货",
        value: '2'
    },
    {
        statusDesc: "顾客退货",
        value: '3'
    },
    {
        statusDesc: "分公司验货",
        value: '5'
    },
    {
        statusDesc: "顾客确认",
        value: ''
    },
    {
        statusDesc: "完成",
        value: '99'
    },
]

// 顾客换货详情 退回物流规则
export const LOGISTICSFORM_RULES = {
    returnExpressType: [{ required: true, message: '请选择交付方式', trigger: 'change' }],
    returnExpressName: [{ required: true, message: '请选择物流公司', trigger: 'change' }],
    returnExpressNo: [{ required: true, message: '请选择物流单号', trigger: 'change' }],
}