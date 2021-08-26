import { genCurrentMonthFirstAndLastDay } from 'util';

// 代客售后类型对象
export const ORDER_TYPE_MAP = {
	1: '正常订单' ,
	2: '补报订单' ,
	3: '调差订单' 
};
// 代客售后状态字典
export const ORDER_STATUS = {
	1: '待支付',
	2: '待发货',
	3: '待收货',
	4: '已取消',
	5: '已退货',
	99: '已完成',
};
export const VALET_SERVICE_SERACH = {
	form: [
		{
			label: '订单编号',
			key: 'orderNo',
			type: 'input',
			value: '',
			placeholder: '请输入订单编号',
			showForever: true
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
							},
						},
					],
					disabledDate: (time) => {
						return time.getTime() > new Date(new Date().toLocaleDateString()).getTime();
					}
				},
			},
			showForever: true
		},
		{
			label: '会员卡号',
			key: 'customerCard',
			type: 'input',
			value: '',
			maxlength: '20',
			placeholder: '请输入会员卡号',
		},
		{
			label: '收货人手机号',
			key: 'receiverPhone',
			type: 'input',
			value: '',
			placeholder: '请输入收货人手机号',
    }
  ]
}


// 代客售后表格列配置
export const CUSTOMER_ORDER_COLUMNS = [
	{ label: '订单编号', prop: 'orderNo', align: 'center', width: 200 },
	{
		label: '订单类型',
		prop: 'orderType',
		align: 'center',
		formatter: ({ orderType }) => {
			return orderType in ORDER_TYPE_MAP ? ORDER_TYPE_MAP[orderType] : '';
		},
	},
	{ 
		label: '顾客会员卡号', 
		prop: 'customerCard', 
		align: 'center', 
		width: 150,	
			formatter: ({ customerType, customerCard }) => {
			return customerType == '1'? '' : customerCard
		}, 
	},
	{ label: '顾客姓名', prop: 'customerName', align: 'center' },
	{ label: '收货人手机号', prop: 'receiverPhone', align: 'center', width: 120 },
	{ label: '开单人卡号', prop: 'creatorCard', align: 'center', width: 120 },
	{ label: '开单人姓名', prop: 'creatorName', align: 'center' },
	{ label: '分公司编号', prop: 'companyCode', align: 'center' },
	{ label: '服务中心编号', prop: 'storeCode', align: 'center', width: 120 },
	{
		label: '订单金额',
		prop: 'orderAmount',
		align: 'center',
		formatter: ({ orderAmount }) => {
			return orderAmount.toFixed(2);
		},
	},
	{
		label: '下单日期',
		prop: 'commitTimeDesc',
		align: 'center',
	},
	{
		label: '订单状态',
		prop: 'orderStatus',
		align: 'center',
		formatter: ({ orderStatus }) => {
			return orderStatus in ORDER_STATUS ? ORDER_STATUS[orderStatus] : '';
		},
	}
	// { label: '分公司名称', prop: 'companyName', align: 'center', width: 180 },
	// { label: '服务中心名称', prop: 'storeName', align: 'center', width: 200 },

	// {
	// 	label: '顾客类型',
	// 	prop: 'customerType',
	// 	align: 'center',
	// 	formatter: ({ customerType }) => {
	// 		return customerType in CUSTOMER_TYPE ? CUSTOMER_TYPE[customerType] : '';
	// 	},
	// },
	// { label: '开单人手机', prop: 'creatorPhone', align: 'center', width: 120 },
	// { label: '应付金额', prop: 'orderAmount', align: 'center' },
	// {
	// 	label: '电子礼券',
	// 	prop: 'giftCouponAmount',
	// 	align: 'center',
	// 	formatter: ({ giftCouponAmount }) => {
	// 		return giftCouponAmount + '';
	// 	},
	// },
	// { label: '实付金额', prop: 'totalAmount', align: 'center' },
	// {
	// 	label: 'PV',
	// 	prop: 'pv',
	// 	align: 'center',
	// 	formatter: ({ pv }) => {
	// 		return pv + '';
	// 	},
	// },
	// {
	// 	label: '配送方式',
	// 	prop: 'expressType',
	// 	align: 'center',
	// 	formatter: ({ expressType }) => {
	// 		return expressType in EXPRESS_TYPE ? EXPRESS_TYPE[expressType] : '';
	// 	},
	// 	width: '100',
	// },
	// {
	// 	label: '开单日期',
	// 	prop: 'commitTime',
	// 	align: 'center',
	// 	formatter: ({ commitTime }) => {
	// 		return formatDateDefault(commitTime);
	// 	},
	// 	width: '100',
	// },
	// {
	// 	label: '付款日期',
	// 	prop: 'payTime',
	// 	align: 'center',
	// 	formatter: ({ payTime }) => {
	// 		return formatDateDefault(payTime);
	// 	},
	// 	width: '100',
	// },

	// 	width: '100',
	// },
	// },
];

// 产品明细
export const PRODUCT_DETAILS_COLUMNS = [
	{
		label: '产品编码',
		prop: 'serialNo',
		align: 'center',
	},
	{
		label: '产品名称',
		prop: 'title',
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
		prop: 'quantity',
		align: 'center',
		summary: true,
	},
	// {
	// 	label: '零售价',
	// 	prop: 'retailPrice',
	// 	align: 'center',
	// 	formatter: ({ retailPrice }) => {
	// 		return `￥${retailPrice}`;
	// 	},
	// },
	// {
	// 	label: '活动价',
	// 	prop: 'price',
	// 	align: 'center',
	// 	formatter: ({ price }) => {
	// 		return `￥${price}`
	// 	}
	// },
	// {
	// 	label: 'PV',
	// 	prop: 'pv',
	// 	align: 'center',
	// 	summary: true,
	// },
	// {
	// 	label: '金额小计',
	// 	prop: 'totalPrice',
	// 	align: 'center',
	// 	summary: true,
	// 	sumConfig: {
	// 		type: 'money'
	// 	},
	// 	formatter: ({ totalPrice }) => {
	// 		return `￥${totalPrice}`;
	// 	},
	// },
	// {
	// 	label: 'PV小计',
	// 	prop: 'totalPv',
	// 	align: 'center',
	// 	summary: true,
	// },
];