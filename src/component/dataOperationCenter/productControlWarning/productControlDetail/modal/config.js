
const BUY_SEARCH = {
  form: [
      {
          label: '会员卡号',
          key: 'customerCard',
          type: 'input',
          value: '',
          placeholder: '搜索会员卡号',
      },
      {
          label: '会员姓名',
          key: 'customerName',
          type: 'input',
          value: '',
          placeholder: '搜索会员姓名',
      },
      {
          label: '注册手机',
          key: 'registerPhone',
          type: 'input',
          value: '',
          placeholder: '搜索注册手机',
      },
  ]
}

const PAY_SEARCH = {
  form: [
    {
        label: '服务中心编码',
        key: 'centerCode',
        type: 'input',
        value: '',
        placeholder: '搜索服务中心编号',
    },
    {
        label: '服务中心名称',
        key: 'centerName',
        type: 'input',
        value: '',
        placeholder: '搜索服务中心名称',
    },
]
}

const TABEL_SEARCH_BUY_MODEL = {
  customerCard: '',
  customerName: '',
  registerPhone: ''
}

const TABEL_SEARCH_PAY_MODEL = {
  centerCode: '',
  centerName: '',
}

export function TABITEM() {
  this.loading = false;
  this.data = []; 
  this.tabTotal = 0;
  this.pagination = {
      currentPage: 1,
      pageSize: 10,
  }
}

const BUY_COLUMNS = [
	{ prop: 'placeMonth', label: '报单月份', align: 'center' },
	{ prop: 'customerCard', label: '会员卡号', align: 'center', width: 120  },
	{ prop: 'customerName', label: '会员姓名', align: 'center' },
	{ prop: 'openCardTime', label: '办卡时间', align: 'center', width: 150  },
	{ prop: 'registerPhone', label: '注册手机', align: 'center', width: 120  },
	{ prop: 'productName', label: '产品名称', align: 'center',show: true, width: 180    },
	{ prop: 'productCode', label: '产品代码', align: 'center',show: true },
	{ prop: 'productPv', label: '产品PV', align: 'center',show: true },
	{ prop: 'buyAllNumber', label: '购买总数量', align: 'center' },
	{ prop: 'buyAllPv', label: '购买总PV', align: 'center' },
	{ prop: 'pointMonth', label: '当月个人积分', align: 'center', width: 120},
	{ prop: 'pointPercentage', label: '积分占比', align: 'center',show: true,
    formatter: ({ pointPercentage }) => {
      return pointPercentage + '%'
    } 
  },
	{ prop: 'overPercentage', label: '超出预警数量比例', align: 'center', width: 150,   
    formatter: ({ overPercentage }) => {
      return overPercentage + '%'
    } 
  },
];

const PAY_COLUMNS = [
  { prop: 'placeMonth', label: '报单月份', align: 'center' },
	{ prop: 'centerCode', label: '服务中心编号', align: 'center', width: 120  },
	{ prop: 'centerName', label: '服务中心名称', align: 'center', width: 120  },
	{ prop: 'productName', label: '产品名称', align: 'center', width: 180, show: true  },
	{ prop: 'productCode', label: '产品代码', align: 'center',show: true },
	{ prop: 'productPv', label: '产品PV', align: 'center',show: true },
	{ prop: 'buyAllNumber', label: '报单总数量', align: 'center' },
	{ prop: 'buyAllPv', label: '总PV', align: 'center'},
	{ prop: 'pvMonth', label: '当月门店业绩总PV', align: 'center', width: 120},
	{ prop: 'pointPercentage', label: '积分占比', align: 'center',show: true,
    formatter: ({ pointPercentage }) => {
      return pointPercentage + '%'
    } 
  },
	{ prop: 'overPercentage', label: '超出预警值比例', align: 'center', width: 150,   
    formatter: ({ overPercentage }) => {
      return overPercentage + '%'
    } 
  },
];

// tab 列表
export const TABLIST = [
  { label: '购货预警', name: 'buyWarning' },
  { label: '交付预警', name: 'payWarning' },
  { label: '重点购货预警名单', name: 'importantBuyWarning' },
  { label: '重点交付预警名单', name: 'importantPayWarning' },
]

// 搜索绑定的 form
export const TABEL_SEARCH = {
  'buyWarning': BUY_SEARCH,
  'payWarning': PAY_SEARCH,
  'importantBuyWarning': BUY_SEARCH,
  'importantPayWarning': PAY_SEARCH,
}

// 搜索绑定的字段
export const TABEL_SEARCH_MODEL = {
  'buyWarning': TABEL_SEARCH_BUY_MODEL,
  'payWarning': TABEL_SEARCH_PAY_MODEL,
  'importantBuyWarning': TABEL_SEARCH_BUY_MODEL,
  'importantPayWarning': TABEL_SEARCH_PAY_MODEL,
}

// TAB 切换所需的表格字段
export const TABEL_COLUMNS = {
  'buyWarning': BUY_COLUMNS,
  'payWarning': PAY_COLUMNS,
  'importantBuyWarning': BUY_COLUMNS,
  'importantPayWarning': PAY_COLUMNS,
}

// 请求接口
export const TABEL_API = {
  'buyWarning': '/mgmt/dataAdmin/shopWarningDetail/list',
  'payWarning': '/mgmt/dataAdmin/deliverWarningDetail/list',
  'importantBuyWarning': '/mgmt/dataAdmin/keyShopWarningDetail/list',
  'importantPayWarning': '/mgmt/dataAdmin/keyDeliverWarningDetail/list',
}


// 导入的接口
export const IMPORT_API = {
  'buy': '/mgmt/dataAdmin/import/warning/shop', // 导入文件-重点购货预警名单
  'pay': '/mgmt/dataAdmin/import/warning/deliver', // 导入文件-重点交付预警名单
}

// 下载模板
export const DOWNLOAD_MODEL = {
  'buy': '/mgmt/dataAdmin/download/shopWarningTemplate',
  'pay': '/mgmt/dataAdmin/download/deliverWarningTemplate'
}
