import { optionGenerator } from 'util';

// 押货单状态
export const ORDER_STATUS_KEY = {
	'all': '',
	'tobeReviewed': 1,
	'tobeDelivered': 2,
	'someShipment': 3,
	'completed': 4,
	'cancelled': 5,
}
// 押货
export const TAB_PANE = [
	{ label: '全部', value: 'all' },
	{ label: '待审核', value: 'tobeReviewed' },
	{ label: '待发货', value: 'tobeDelivered' },
	{ label: '部分发货', value: 'someShipment' },
	{ label: '已完成', value: 'completed' },
	{ label: '已取消', value: 'cancelled' },
]
// 押货单列表页-押货单状态
export const ORDER_STATUS = {
	1: '待审核',
	2: '待发货',
	3: '部分发货',
	4: '已完成',
	5: '已取消',
}

// 押货单列表页-押货单来源
export const ORDER_SOURCE = {
	1: '服务中心押货',
	2: '后台新增押货',
}

// 押货单详情页-押货标志
export const ORDER_MARK = {
	1: '普通押货单',
	2: '仅调账不发货',
	3: '套装组合押货',
	4: '套装拆分押货',
}

// 押货单详情页-修改标记 
export const EDITFLAG_SIGN = {
	0: '未修改',
	1: '已修改',
}

// 押货单详情页-审核状态
export const AUDITSTATUS = {
	0: '拒绝',
	1: '通过',
}

// 押货单管理 -- 押货标识
export const PLEDGE_SYMBOL = {
	'1': '普通押货单',
	'2': '调账不发货',
	'3': '套装组合',
	'4': '套装拆分',
}

// 定制品搜索条件
export const CUSTOMIZED_LIST_CONFIG = {
	form: [
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
			placeholder: '请输入服务中心编号',
			showForever: true
    },
    {
      label: '押货单号',
      key: 'orderSn',
      type: 'input',
      value: '',
			placeholder: '请输入押货单号',
			showForever: true
		},
		{
      label: '分公司编号',
      key: 'companyCode',
      type: 'input',
      value: '',
			placeholder: '请输入分公司编号',
			showForever: true
		},
		{
      label: '修改标记',
      key: 'editFlag',
      type: 'select',
      value: '',
			placeholder: '请选择修改标记',
			options: optionGenerator(EDITFLAG_SIGN),
    },
		{
      label: '押货单来源',
      key: 'orderSource',
      type: 'select',
      value: '',
			placeholder: '请选择押货单来源',
			options: optionGenerator(ORDER_SOURCE),
    },
    {
      label: '提交时间',
      key: 'registrationTime',
      type: 'datePicker',
      value: [],
      config: {
        type: 'daterange',
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期'
      }
		},
		{
      label: '押货标识',
      key: 'orderMark',
      type: 'select',
      value: '',
			placeholder: '请选择押货标识',
			options: optionGenerator(PLEDGE_SYMBOL),
    },
  ],
}
// 定制品列表 
export const CUSTOMIZED_LIST_COLUMNS = [
  { prop: 'orderSn', label: '押货单号', align: 'center', width: 150, },
  { prop: 'storeCode', label: '服务中心编号', align: 'center', width: 100, },
  { prop: 'leaderNo', label: '负责人卡号', align: 'center', width: 100, },
  { prop: 'companyCode', label: '分公司编号', align: 'center' },
  { prop: 'orderRetailAmount', label: '零售金额', align: 'center' },
	{ prop: 'orderMortgageAmount', label: '押货金额', align: 'center' },
	{ prop: 'orderPvAmount', label: 'PV合计', align: 'center' },
  { prop: 'createTime', label: '提交时间', align: 'center', width: 150, },
  {
		prop: 'orderStatus',
		label: '押货单状态',
		align: 'center' ,
		formatter: ({ orderStatus }) => {
			return orderStatus in ORDER_STATUS ? ORDER_STATUS[orderStatus] : '';
		},
	},
	{
		prop: 'orderSource',
		label: '押货单来源',
		align: 'center',
		formatter: ({ orderSource }) => {
			return orderSource in ORDER_SOURCE ? ORDER_SOURCE[orderSource] : '';
		},
		width: 120,
 },
  {
		prop: 'orderMark',
		label: '押货标识',
		align: 'center',
		formatter: ({ orderMark }) => {
			return orderMark in ORDER_MARK ? ORDER_MARK[orderMark] : '';
		},
	},
	{
		prop: 'editFlag',
		label: '修改标记',
		align: 'center',
		formatter: ({ editFlag }) => {
			return editFlag in EDITFLAG_SIGN ? EDITFLAG_SIGN[editFlag] : '';
		},
	},
	{ prop: 'storeName', label: '服务中心名称', align: 'center', width: 120, },
	{ prop: 'companyName', label: '分公司名称', align: 'center', width: 120, },
];

// 定制品详情 - 押货单详情列表
export const DETAIL_LIST_COLUMNS = [
  { prop: 'productCode', label: '产品编码', align: 'center', width: 80, },
  { prop: 'productName', label: '产品名称', align: 'center', width: 160, },
  { prop: 'productSecCode', label: '二级编码', align: 'center', width: 80, },
  { prop: 'productSecName', label: '二级产品名称', align: 'center', width: 160, },
  { prop: 'productPacking', label: '规格', align: 'center', width: 160, },
  { prop: 'productUnit', label: '单位', align: 'center', width: 80, },
  { prop: 'productBoxNum', label: '装箱数量', align: 'center', width: 80, },
  { prop: 'productMortgagePrice', label: '单价', align: 'center', width: 80, },
  { prop: 'productPv', label: 'PV', align: 'center', width: 80, },
  { prop: 'productNum', label: '押货数', align: 'center', width: 80, },
	{ 
		prop: 'productDeliveredNum', label: '已发货数', align: 'center', width: 80,
		formatter:({productDeliveredNum}) => {
			return productDeliveredNum * 1
		}
	},
];
// 定制品详情 - 发货记录列表
export const DELIVERY_RECORD_COLUMNS = [
  { prop: 'productCode', label: '产品编码', align: 'center', width: 100, },
  { prop: 'productName', label: '产品名称', align: 'center', width: 160, },
  { prop: 'productSecCode', label: '二级产品编码', align: 'center', width: 100, },
  { prop: 'productSecName', label: '二级产品名称', align: 'center', width: 160, },
  { prop: 'productPacking', label: '规格', align: 'center', width: 100, },
  { prop: 'productUnit', label: '单位', align: 'center', width: 80, },
  { prop: 'productNum', label: '本次发货数', align: 'center', width: 80, },
];
