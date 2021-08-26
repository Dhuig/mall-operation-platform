// import { optionGenerator } from 'util';
import { formatDate } from 'util/formValidation.js'

// 处理状态
export const ORDER_STATUS = {
	0:'全部',
	1:'待审批',
	5:'待发货',
	2:'待收货',
	3:'已完成',
	4:'已取消',
}
export const ORDER_STATUS_OPTION = [
	{
		value:null,
		label:'全部'
	},
	{
		value:1,
		label:'待审批'
	},
	{
		value:5,
		label:'待发货'
	},
	{
		value:2,
		label:'待收货'
	},
	{
		value:3,
		label:'已完成'
	},
	{
		value:4,
		label:'已取消'
	},
	
]

export const DIFFTYPE_STATUS_OPTION =[
	{
		value:null,
		label:'全部'
	},
	{
		value:1,
		label:'货损'
	},
	{
		value:2,
		label:'货差'
	},
]

// 货损货差管理
export const CARGO_DAMAGE_CONFIG = {
	form: [
		{
			label: '服务中心编号',
			key: 'storeCode',
			type: 'input',
			value: '',
			placeholder: '请输入服务中心编号',
		},
		{
			label: '货损货差单号',
			key: 'orderSn',
			type: 'input',
			value: '',
			placeholder: '请输入货损货差单号',
		},
		{
			label: '分公司',
			key: 'companyCode',
			type: 'select',
			value: '',
			options: [],
			placeholder: '请选择分公司',
		},
		{
			label: '处理状态',
			key: 'orderStatus',
			type: 'select',
			value: '',
			placeholder: '请选择',
			options: ORDER_STATUS_OPTION,
		},
		{
			label: '申请时间',
			key: 'registrationTime',
			type: 'datePicker',
			valueFormat: 'yyyy-MM-dd',
			value: '',
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期'
			}
		},
		{
			label: '类型',
			key: 'diffType',
			type: 'select',
			value: '',
			placeholder: '请选择',
			options: DIFFTYPE_STATUS_OPTION,
		},
	],
}
// 货损货差表格
export const CARGO_DAMAGE_COLUMNS = [
	{
		prop: 'storeCode',
		label: '服务中心编号',
		align: 'center',
	},
	{
		prop: 'companyName',
		label: '所属分公司',
		align: 'center',
	},
	{
		prop: 'orderSn',
		label: '货损货差单号',
		align: 'center',
	},
	{
		prop: 'createTime',
		label: '申请日期',
		align: 'center',
		formatter: ({createTime}) => {
      return formatDate(createTime);
    }
	},
	{
		prop: 'orderStatus',
		label: '处理状态',
		align: 'center',
		formatter: ({ orderStatus }) => {
			return orderStatus in ORDER_STATUS ? ORDER_STATUS[orderStatus] : '';
		},
	},
];
// 新增货损货差产品
export const CARGO_DAMAGE_ADD_RULE = {
	productCode: [
		{ required: true, message: '请输入产品编号', trigger: 'blur' },
	],
	productName: [
		{ required: true, message: '请输入产品名称', trigger: 'blur' },
	],
	deliverSn: [
		{ required: true, message: '请输入发货单号', trigger: 'blur' },
	],
	productNum: [
		{ required: true, message: '请输入数量', trigger: 'blur' },
	],
	productDiffDescId: [
		{ required: true, message: '请选择详细描述', trigger: 'change' },
	],
}

// 新增货损货差
export const CARGO_DAMAGE_RULE = {
	storeCode: [
		{ required: true, message: '请输入服务中心编号', trigger: 'blur' },
	],
	deliverDate: [
		{ required: true, message: '请输入发货日期', trigger: 'change' },
	],
	receiveDate: [
		{ required: true, message: '请输入收货日期', trigger: 'change' },
	],
	diffType: [
		{ required: true, message: '请选择类型', trigger: 'change' },
	],
	deliverySn: [
		{ required: true, message: '请输入发货单号', trigger: 'blur' },
	],
	diffProofs: [
		{ required: true, message: '请上传证明', trigger: 'change' },
	],
	productDiffDescId: [
		{ required: true, message: '请选择详细描述', trigger: 'change' },
	],
}
