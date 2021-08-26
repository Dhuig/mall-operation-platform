import { genCurrentMonthFirstAndLastDay } from 'util';
// import { filters } from 'plugins/filters';

// 清洗人列表切换
export const TAB_PANE = [
	{ label: '全部', value: 'all' },
	{ label: '审核通过', value: 'approved' },
	{ label: '待审核', value: 'pending' },
	{ label: '已驳回', value: 'reject' },
]

// 清洗人员状态
export const BANKCARD_STATUS = {
	'1': '审核通过',
	'0': '待审核',
	'-1': '已驳回' 
}
// 清洗人员枚举字典
export const BANKCARD_STATUS_CONFIG = {
	approved: '1',
	pending: '0',
	reject: '-1'
}

// 清洗人员状态选项卡映射字典
export const CLEAN_PERSONNEL_STATUS_MAP = {
	all:'',
	approved: '1',
	pending: '0',
	reject: '-1'
}

// 清洗人员列表-查询
export const CLEAN_PERSONNEL_SEARCH = {
	form: [
		{
			label: '服务人员卡号',
			key: 'cardNo',
			type: 'input',
			value: '',
			placeholder: '请填写服务人员卡号',
		},
		{
			label: '服务人员手机',
			key: 'cleanerMobile',
			type: 'input',
			value: '',
			placeholder: '请填写服务人员手机',
		},
		{
			label: '服务人员姓名',
			key: 'cleanerName',
			type: 'input',
			value: '',
			placeholder: '请填写服务人员姓名',
		},
		{
			label: '申请时间',
			key: 'applicantTime',
			type: 'datePicker',
			value: genCurrentMonthFirstAndLastDay(),
			config: {
				type: 'daterange',
			},
		},
		{
			label: '审核时间',
			key: 'checkTime',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
			},
		},
	]
};

// 清洗人员列表-列定义-全部
export const CLEAN_PERSONNEL_ALL_COLUMNS = [
	{ prop: 'cardNo', label: '服务人员卡号', align: 'center', width: 120, },
	{ prop: 'cleanerName', label: '服务人员', align: 'center', width: 120, },
	{ prop: 'cleanerMobile', label: '服务人员手机', align: 'center', width:120, },
	{ prop: 'address', label: '服务地址', align: 'center',  },
	{ prop: 'cleanerServiceArea', label: '服务范围', align: 'center', width:150,
		// formatter: ({ cleanerServiceArea }) => {
		// 	return cleanerServiceArea + 'KM'
		// } 
	},
	{
		prop: 'createTime',
		label: '申请时间',
		align: 'center',
		width:150,
	},
	{
		prop: 'accCleanerStatus',
		label: '审核状态',
		align: 'center',
		width:150,
		formatter: ({ accCleanerStatus }) => {
			return BANKCARD_STATUS[accCleanerStatus];
		}
	},
];

// 清洗人员列表-列定义-审核通过
export const CLEAN_PERSONNEL_REVIEWED_COLUMNS = [
	{ prop: 'cardNo', label: '服务人员卡号', align: 'center', width: 120, },
	{ prop: 'cleanerName', label: '服务人员', align: 'center', width: 120, },
	{ prop: 'cleanerMobile', label: '服务人员手机', align: 'center', width:120, },
	{ prop: 'address', label: '服务地址', align: 'center',  },
	{ prop: 'cleanerServiceArea', label: '服务范围', align: 'center', width:150,
		// formatter: ({ cleanerServiceArea }) => {
		// 	return cleanerServiceArea + 'KM'
		// } 
	},
	{
		prop: 'createTime',
		label: '申请时间',
		align: 'center',
		width:150,
	},
	{
		prop: 'checkTime',
		label: '审核时间',
		align: 'center',
		width:150,
	},
];

// 清洗人员列表-列定义-待审核
export const CLEAN_PERSONNEL_PENDING_COLUMNS = [
	{ prop: 'cardNo', label: '服务人员卡号', align: 'center' },
	{ prop: 'cleanerName', label: '服务人员', align: 'center' },
	{ prop: 'cleanerMobile', label: '服务人员手机', align: 'center', width:120, },
	{ prop: 'address', label: '服务地址', align: 'center', width:150, },
	{ prop: 'cleanerServiceArea', label: '服务范围', align: 'center', width:150, },
	{
		prop: 'createTime',
		label: '申请时间',
		align: 'center',
		width:150,
	},
];

// 清洗人员列表-列定义-已驳回
export const CLEAN_PERSONNEL_REJECTED_COLUMNS = [
	{ prop: 'cardNo', label: '服务人员卡号', align: 'center' },
	{ prop: 'cleanerName', label: '服务人员', align: 'center' },
	{ prop: 'cleanerMobile', label: '服务人员手机', align: 'center', width:120, },
	{ prop: 'address', label: '服务地址', align: 'center', width:150, },
	{ prop: 'cleanerServiceArea', label: '服务范围', align: 'center', width:150, },
	{
		prop: 'createTime',
		label: '申请时间',
		align: 'center',
		width:150,
	},
	{
		prop: 'checkTime',
		label: '驳回时间',
		align: 'center',
		width:150,
	},
];

// 清洗人员详情-列定义-已驳回
export const CLEAN_PERSONNEL_OPERATION_RECORD = [
	{ prop: 'createTime', label: '操作时间', align: 'center' },
	{ prop: 'operatorType', label: '操作内容', align: 'center' ,
	formatter: ({ operatorType }) => {
		return BANKCARD_STATUS[operatorType]
	}
	},
	{ prop: 'operator', label: '操作人姓名', align: 'center', width:120, },
	{ prop: 'operatorNo', label: '工号', align: 'center', width:120, },
	{ prop: 'operatorCardNo', label: '会员卡号', align: 'center', width:120, },
	{ prop: 'operatorMobile', label: '手机号', align: 'center', width:120, },
	{ prop: 'remarks', label: '备注', align: 'center', width:150, },
	
];

// 清洗人员表单验证规则
export const CLEAN_PERSONNEL_RULES = {
	status: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
	remarks: [{ required: true, message: '请输入审核意见', trigger: 'blur' }],
};


