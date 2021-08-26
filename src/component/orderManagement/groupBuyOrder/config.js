import { genCurrentMonthFirstAndLastDay } from 'util';
import { formatDate } from 'util/formValidation';
export const GROUP_BUY_ORDER_SERACH = {
  col: 3,
  rules: {
    orderNo: [{ min: 1, max: 20, message: '长度在 1 到 20 个字符' }],
    receiverPhone: [{ min: 1, max: 20, message: '长度在 1 到 20 个字符' }],
    consigneeMobile: [{ pattern: /^[0-9]{1,20}$/, message: '长度在 1 到 20 个数字' }],
    principalCardNo: [{ min: 1, max: 20, message: '长度在 1 到 20 个字符' }],
    principalName: [{ min: 1, max: 20, message: '长度在 1 到 20 个字符' }],
    companyCode: [{ min: 1, max: 40, message: '长度在 1 到 40 个字符' }],
    storeName: [{ min: 1, max: 40, message: '长度在 1 到 40 个字符' }],
    storeCode: [{ min: 1, max: 40, message: '长度在 1 到 40 个字符' }],
  },
  form: [
    {
      label: '订单号',
      key: 'orderNo',
      type: 'input',
      value: '',
      placeholder: '请输入订单号',
    },
    {
      label: '收货人姓名',
      key: 'consigneeName',
      type: 'input',
      value: '',
      placeholder: '请输入收货人姓名',
    },
    {
      label: '收货人手机号',
      key: 'consigneeMobile',
      type: 'input',
      value: '',
      placeholder: '请输入收货人手机号',
    },
    {
      label: '下单时间',
      key: 'time',
      type: 'datePicker',
      value: genCurrentMonthFirstAndLastDay(),
      config: {
        type: 'daterange',
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        pickerOptions: {
          shortcuts: [
            {
              text: '上月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            },
          ],
          disabledDate: (time) => {
            return time.getTime() > new Date(new Date().toLocaleDateString()).getTime();
          }
        },
      }
    },
    {
      label: '会员卡号',
      key: 'principalCardNo',
      type: 'input',
      value: '',
      placeholder: '请输入会员卡号',
    },
    {
      label: '顾客姓名',
      key: 'principalName',
      type: 'input',
      value: '',
      placeholder: '请输入顾客姓名',
    },
    {
      label: '分公司编号',
      key: 'companyCode',
      type: 'input',
      value: '',
      placeholder: '请输入分公司编号',
    },
    {
      label: '服务中心名称',
      key: 'storeName',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心名称',
    },
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号',
    },
  ]
}

export const TAB_LIST = [
  [
    '全部订单',
    'all',
  ],
  [
    '待分公司审核',
    'toBranchReview',
  ],
  [
    '待总公司审核',
    'toHeadOfficeReview',
  ],
  [
    '待发货',
    'toSend',
  ],
  [
    '待收货',
    'toReceived',
  ],
  [
    '已完成',
    'completed',
  ],
  [
    '审核不通过',
    'auditNotPassed',
  ],
  [
    '待退票',
    'toRefund',
  ],
  [
    '已取消',
    'canceled',
  ],
]

export function TABITEM() {
	this.loading = false;
	this.data = [];
	this.total = 0;
	this.selectedOrderNos = ''
	this.pagination = {
		currentPage: 1,
		pageSize: 10,
	}
}

// 验证手机号和
const rep =  /^((0\d{2,3}-?\d{7,8})|(1[3465789]\d{9}))$/;
export const phoneValidator = (rule,value,callback) => {
  if(rep.test(value)){
    callback();
  }else{
    callback(new Error('请输入正确的收货人电话'))
  }
}

export const GROUP_BUG_ORDER_STATS_MAP = {
  canceled: '7',
  toRefund: '8',
  auditNotPassed: '6',
  completed: '5',
  toReceived: '4',
  toSend: '3',
  toHeadOfficeReview: '2',
  toBranchReview: '1',
  all: null,
}

export const MEMBER_TYPE = {
  1: "普通顾客",
  2: "优惠顾客",
  3: "云商",
  4: "微店",
  5: "店员",
  6: "子账号"
}

export const GROUP_ORDER_STATE = {
  0: '提交申请',
  1: "待分公司审核",
  2: "待总公司审核",
  3: "待发货",
  4: "待收货",
  5: "已完成",
  6: "审核不通过",
  7: "取消",
  8: "待退票"
}


export const GROUP_BUG_ORDER_COLUMNS = [
  { label: '订单号', prop: 'orderNo', align: 'center', width: 200 },
	{ label: '分公司编号', prop: 'companyCode', align: 'center', width: 100},
	{ label: '分公司名称', prop: 'companyName', align: 'center', width: 150 },
	{ label: '服务中心编号', prop: 'storeCode', align: 'center', width: 150 },
	{ label: '服务中心名称', prop: 'storeName', align: 'center', width: 150 },
	{ label: '会员卡号', prop: 'principalCardNo', align: 'center', width: 150 },
	{ label: '顾客姓名', prop: 'principalName', align: 'center'},
  { label: '顾客类型', prop: 'principalType', align: 'center',
    formatter: ({ principalType }) => principalType in MEMBER_TYPE ? MEMBER_TYPE[principalType] : null
  },
  { label: '应付金额', prop: 'amount', align: 'center'},
  { label: '实付金额', prop: 'remittance', align: 'center'},
  { label: '收货人姓名', prop: 'consigneeName', align: 'center', width: 150 },
  { label: '收货人手机号', prop: 'consigneeMobile', align: 'center', width: 150 },
  { label: '开单日期', prop: 'createTime', align: 'center', width:180,
    formatter: ({ createTime }) => formatDate(createTime)
  },
  { label: '订单状态', prop: 'state', align: 'center', width: 150,
    formatter: ({ state }) => state in GROUP_ORDER_STATE ? GROUP_ORDER_STATE[state] : null
  },
];

// 订单管理-> 团购订单 / 团购订单详情 -> 产品详情
export const PRODUCT_DETAILS_COLUMNS = [
	{
		label: '产品编码',
		prop: 'productCode',
		align: 'center',
	},
	{
		label: '产品名称',
		prop: 'productName',
		align: 'center',
	},
	{
		label: '规格',
		prop: 'packing',
		align: 'center',
	},
	{
		label: '单位',
		prop: 'meterUnit',
		align: 'center',
	},
	{
		label: '数量',
		prop: 'stock',
		align: 'center',
    summary: true,
    formatter: ({ stock }) => { 
			return stock
		},
	},
	{
		label: '零售价',
		prop: 'retailPrice',
		align: 'center',
		formatter: ({ retailPrice }) => {
			return `￥${retailPrice}`;
		},
	},
	{
		label: '团购价',
		prop: 'groupPrice',
		align: 'center',
		formatter: ({ groupPrice }) => {
			return `￥${groupPrice}`
		}
	},
	{
		label: '金额小计（按团购价）',
		prop: 'totalGroupPrice',
		align: 'center',
		summary: true,
		sumConfig: {
			type: 'money'
		},
		formatter: ({ totalGroupPrice }) => {
			return `￥${totalGroupPrice}`;
		},
	}
];

// 票据验证规则
export const TICKER_VALIDATE_RULES = {
  // 个人普通电子票检验规则
  ticketPersonRules: {
    draweeName: [
      { required: true, message: '请输个人姓名' },
			{ min: 1, max: 20, message: '请输入正确的姓名' },
			{
			pattern: /^[\u4e00-\u9fa5a-zA-Z0-9·]+$/, message: '请输入正确的姓名'
			},
    ],
  },
  // 企业普通电子票检验规则
  ticketBusinessNormalRules: {
    draweeName: [
      { required: true, message: '请填写单位名称' },
      { min: 1, max: 50, message: '请输入1-50个字符' },
    ],
    taxpayerNo: [
      { required: true, message: '请输入纳税人识别号' },
      {
        pattern: /^\w+$/,
        message: '不支持特殊符号',
      },
    ],
    registerAddress: [
			{ min: 1, max: 200, message: '请输入1-200个字符' },
		],
		registerPhone: [
			{ min: 1, max: 20, message: '请输入1-20个字符' },
		],
		bankName: [
			{ min: 1, max: 200, message: '请输入1-200个字符' },
		],
		bankAccount: [
			{ min: 1, max: 40, message: '请输入1-40个数字' },
		]
  },
  // 企业专用纸质发票检验规则
  ticketBusinessProRules: {
    draweeName: [
      { required: true, message: '单位名称不能为空' },
      { min: 1, max: 50, message: '请输入1-50个字符' },
    ],
    taxpayerNo: [
      { required: true, message: '请输入纳税人识别号' },
      {
        pattern: /^\w+$/,
        message: '不支持特殊符号',
      },
    ],
    registerAddress: [
      { required: true, message: '请填写注册地址' },
      { min: 1, max: 200, message: '请输入1-200个字符' },
    ],
    registerPhone: [
      { required: true, message: '请填写注册电话' },
      { min: 1, max: 20, message: '请输入1-20个字符' },
    ],
    bankName: [
      { required: true, message: '请填写开户银行名称' },
      { min: 1, max: 200, message: '请输入1-200个字符' },
    ],
    bankAccount: [
      { required: true, message: '请填写开户银行帐号' },
      { min: 1, max: 40, message: '请输入1-40个字符' },
      {
        pattern: /^\w+$/,
        message: '不支持特殊符号',
      },
    ],
    phone: [
      { required: true, message: '联系人电话格式错误' },
      { min: 1, max: 20, message: '请输入1-20个字符' },
    ],
    bizLicenseFileList: [
      { required: true, message: '请上传营业执照副本!' },
    ],
    bankLicenseFileList: [
      { required: true, message: '请上传银行开户许可证!' },
    ],
    authLicenseFileList: [
      { required: true, message: '请上传授权委托书!' },
    ],
  },
}

// 发表类型值映射
// export const TICKET_TYPE = {
//   'ticketPerson': 1,
//   'ticketBusinessNormal': 2,
//   'ticketBusinessPro': 3,
// }

export const TICKET_TYPE = {
  1: "个人普通电子票",
  2: "企业普通电子发票",
  3: "企业专用纸质发票"
}

export const TICKET_TYPE_TEXT = {
  ticketPerson: "个人普通电子票",
  ticketBusinessNormal: "企业普通电子发票",
  ticketBusinessPro: "企业专用纸质发票",
}

//文件下载
export async function downloadFile(res, fileName) {
  if (!res) {
    return
  }
  let x = new XMLHttpRequest();
  x.open("GET", res, true);
  x.responseType = 'blob';
  x.onload = function () {
    var blob = x.response;
    if ('msSaveOrOpenBlob' in navigator) {//IE导出
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    }
    else {
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', fileName)// 文件名
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 下载完成移除元素
      window.URL.revokeObjectURL(URL.createObjectURL(blob)) // 释放掉blob对象
    }
  };
  x.send();
}