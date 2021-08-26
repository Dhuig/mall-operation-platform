// import { filters } from 'plugins/filters';

// 默认列表
//审核状态
let getYearItems = () => {
	let currYear = new Date().getFullYear();
	let start = currYear - 39;
	let end = currYear;
	let yearItems = [];
	for (var i = start; i <= end; i++) {
		yearItems.push({
			label: i,
			value: i,
		});
	}
	return yearItems;
}

// 年度
export const YEAR = getYearItems();

export const AUDITSTATUS = [
	{
		label: '全部',
		value: null
	},
	{
		label: '待审核',
		value: 3
	},
	{
		label: '审核通过',
		value: 1
	},
	{
		label: '审核不通过',
		value: 2
	}
]

// 提交状态
export const SUBMITRESULT = [
	{
		label: '全部',
		value: null
	},
	{
		label: '未提交',
		value: 2
	},
	{
		label: '已提交',
		value: 1
	},
]

// 审核状态
export const ADUITRESULT = [
	{
		label: '全部',
		value: 1
	},
	{
		label: '未通过',
		value: 2
	},
	{
		label: '已审核',
		value: 3
	},
]

//合同类型
export const CONCTACTTYPE = [
	{
		label: '全部',
		value: 1
	},
	{
		label: '服务合同',
		value: 2
	},
	{
		label: '连带责任合同',
		value: 3
	},
	{
		label: '终端形象合同',
		value: 4
	},
	{
		label: '服务网点合同',
		value: 5
	},
]


// 服务中心银行账号
export const SERVICE_CENTER_AGREEMENT_CONFIG = {
	form: [
		{
			label: '服务中心编号',
			key: 'storeCode',
			type: 'input',
			value: '',
			placeholder: '请输入服务中心编号',
		},
		{
			label: '年度',
			key: 'year',
			type: 'select',
			value: '',
			options: YEAR,
			placeholder: '',
		},
		{
			label: '合同类型',
			key: 'contractType',
			type: 'select',
			value: '',
			options: CONCTACTTYPE,
			placeholder: '',
		},
		{
			label: '提交状态',
			key: 'submitStatus',
			type: 'select',
			value: '',
			options: SUBMITRESULT,
			placeholder: '',
		},
		{
			label: '审核状态',
			key: 'verifyStatus',
			type: 'select',
			value: '',
			options: ADUITRESULT,
			placeholder: '',
		},
	],
}

export const ADUIT = {
	3: '审核待通过',
	2: '审核未通过',
	1: '审核通过'
};

export const SUBMITTYPPE = {
	1: '已提交',
	2: '未提交'
};

export const ISDEDUCTION = {
	1: '是',
	2: '否',
};

export const ISUSED = {
	1: '启用',
	2: '禁用',
};

export const OPTYPE = {
	1: '新增',
	2: '修改',
	3: '作废',
};

export const CONTRACTTYPE = {
	1: '服务合同',
	2: '连带责任合同',
	3: '终端形象合同',
	4: '服务网点合同',
};

export const SERVICE_CENTER_AGREEMENT_COLUMS = [
	{
		prop: 'code',
		label: '服务中心编号',
		align: 'left',
	},
	{
		prop: 'name',
		label: '服务中心名称',
		align: 'left',
	},
	{
		prop: 'year',
		label: '年度',
		align: 'left',
	},
	{
		prop: 'contractType',
		label: '合同类型',
		align: 'left',
		formatter: ({ contractType }) => {
			return contractType in CONTRACTTYPE ? CONTRACTTYPE[contractType] : '';
		}
	},
	{
		prop: 'shopkeeperId',
		label: '经营者',
		align: 'left',
	},
	{
		prop: 'leaderId',
		label: '负责人',
		align: 'left',
	},
	{
		prop: 'account',
		label: '配偶',
		align: 'left',
	},
	{
		prop: 'createTime',
		label: '提交日期',
		align: 'left',
	},
	{
		prop: 'submitStatus',
		label: '提交状态',
		align: 'left',
		formatter: ({ submitStatus }) => {
			return submitStatus in SUBMITTYPPE ? SUBMITTYPPE[submitStatus] : '';
		}
	},
	{
		prop: 'verifyStatus',
		label: '审核状态',
		align: 'left',
		formatter: ({ verifyStatus }) => {
			return verifyStatus in ADUIT ? ADUIT[verifyStatus] : '';
		}
	},
]


// 新建检验规则
export const CREATE_NEW_AGREEMENT_RULES = {
	// 服务中心编号
	storeCode: [
		{ required: true, message: '请输入服务中心编号', trigger: 'blur' },
	],
	// 账户名称
	accountName: [
		{ required: true, message: '请输入账户名称', trigger: 'blur' },
		{ min: 1, max: 50, message: '支持1~50个字符（包括汉字），不限输入类型', trigger: 'blur' },
	],
	// 开户银行
	accountBank: [
		{ required: true, message: '请选择开户银行', trigger: 'change' },
	],
	// 账号
	account: [
		{ required: true, message: '请输入账户', trigger: 'blur' },
		{ min: 1, max: 50, message: '支持1~50个字符，不限输入类型', trigger: 'blur' },
	],
	// 银行省份
	'address.provice': [
		{ required: true, message: '请选择银行省份', trigger: 'change' },
	],
	// 银行省份
	'address.city': [
		{ required: true, message: '请选择银行城市', trigger: 'change' },
	],
	// 开户行名称
	branch: [
		{ required: true, message: '请输入开户行名称', trigger: 'blur' },
		{ min: 1, max: 50, message: '支持1~50个字符，不限输入类型', trigger: 'blur' },
	],
	// 账户类型
	accountType: [
		{ required: true, message: '请选择账户类型', trigger: 'change' },
	],
}


// 新建服务中心银行账号字段
export const DataKey = {
	account: '',
	accountBank: '',
	accountName: '',
	accountType: null,
	address: '',
	branch: '',
	isDeduction: 2,
	permissionUrl: '',
	storeCode: '',
	submitter: ''
}

