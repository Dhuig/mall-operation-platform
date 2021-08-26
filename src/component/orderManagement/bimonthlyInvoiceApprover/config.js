import { genCurrentMonthFirstAndLastDay } from 'util';
import { formatDate } from 'util/formValidation';

// 隔月开票审批 审核状态
export const REVIEW_STATUS = {
	1: '待审核',
	2: '已通过',
	3: '已驳回'
};
// 隔月开票审批 状态字典
export const ORDER_STATUS = {
	1: '待支付',
	2: '待发货',
	3: '待收货',
	4: '已取消',
	5: '已退款',
	99: '已完成',
};


// 审核表单规则
export const AUDITSTATUS_RULES = {
	reviewStatus: [
		{ required: true, message: '请选择审核结果', trigger: 'blur' }
	],
	remarks: [
		{ required: true, message: '请输入审核意见', trigger: 'blur' }
	],
}

// 隔月开票审批 选项卡数组
export const BIMONTHLY_TABS_LIST = [
	['全部申请', 'all'],
	['待审核', '1'],
	['已通过', '2'],
	['已驳回', '3']
]

// 隔月开票审批 TABITEM
export function TABITEM() {
	this.loading = false;
	this.data = [];
	this.total = 0;
	this.selections = []
	this.pagination = {
		currentPage: 1,
		pageSize: 10,
	}
}

// 隔月开票审批 搜索
export const BIMONTHLY_SERACH = {
	form: [
		{
			label: '订单号',
			key: 'orderNo',
			type: 'input',
			value: '',
			placeholder: '请输入订单号',
			showForever: true
		},
		{
			label: '申请时间',
			key: 'time',
			type: 'datePicker',
			value: genCurrentMonthFirstAndLastDay(),
			// value: [],
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
			label: '财务分公司编号',
			key: 'financeCompanyCode',
			type: 'select',
			filterable: true,
			maxlength: '20',
			value: '',
			options: [],
			placeholder: '请输入财务分公司编号',
		},
		{
			label: '收货人手机号',
			key: 'receiverPhone',
			type: 'input',
			value: '',
			placeholder: '请输入收货人手机号',
		},
		{
			label: '顾客手机号',
			key: 'customerPhone',
			type: 'input',
			value: '',
			placeholder: '请输入顾客手机号',
		},
		{
			label: '顾客会员卡',
			key: 'customerCard',
			type: 'input',
			value: '',
			maxlength: '20',
			placeholder: '请输入顾客会员卡',
		},
		{
			label: '顾客姓名',
			key: 'customerName',
			type: 'input',
			value: '',
			maxlength: '20',
			placeholder: '请输入顾客姓名',
		},
		{
			label: '开单人卡号',
			key: 'creatorCard',
			type: 'input',
			value: '',
			placeholder: '请输入开单人卡号',
		}
	]
}


// 隔月开票审批 表格列配置
export const BIMONTHLY_COLUMNS = [
	{
		label: '申请时间',
		prop: 'applyTime',
		align: 'center',
		width: 140,
		formatter: ({ applyTime }) => {
			return formatDate(applyTime);
		},
	},
	{ label: '订单编号', prop: 'orderNo', align: 'center', width: 200 },
	{ label: '财务分公司编号', prop: 'financeCompanyCode', align: 'center', width: 110 },
	{ label: '顾客会员卡', prop: 'customerCard', align: 'center', width: 100 },
	{ label: '顾客姓名', prop: 'customerName', align: 'center', width: 80 },
	{ label: '顾客手机号', prop: 'customerPhone', align: 'center', width: 100 },
	{ label: '开单人卡号', prop: 'creatorCard', align: 'center', width: 100 },
	{
		label: '实付金额',
		prop: 'totalAmount',
		align: 'center',
		width: 90,
		formatter: ({ totalAmount }) => {
			return '￥' + Number(totalAmount).toFixed(2);
		},
	},
	{
		label: '订单状态',
		prop: 'orderStatus',
		align: 'center',
		width: 80,
		formatter: ({ orderStatus }) => {
			return orderStatus in ORDER_STATUS ? ORDER_STATUS[orderStatus] : '';
		},
	},
	{
		label: '支付时间',
		prop: 'payTime',
		align: 'center',
		width: 140,
		formatter: ({ payTime }) => {
			return formatDate(payTime);
		},
	},
	{
		label: '审核状态',
		prop: 'reviewStatus',
		align: 'center',
		width: 80,
		formatter: ({ reviewStatus }) => {
			return reviewStatus in REVIEW_STATUS ? REVIEW_STATUS[reviewStatus] : '';
		},
	},
	{ label: '审核人', prop: 'operator', align: 'center', width: 80 },
	{
		label: '审核时间',
		prop: 'operateTime',
		align: 'center',
		width: 140,
		formatter: ({ operateTime }) => {
			return formatDate(operateTime);
		},
	},
	{
		label: '审核备注',
		prop: 'remarks',
		slot: 'showTip',
		width: 180,
		align: 'center'
	},
];

