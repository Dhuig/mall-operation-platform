import { formatDate } from 'util/formValidation.js';

// 默认列表

//审核状态
export const AUDITSTATUS = [
	{
		label:'全部',
		value:null
	},
	{
		label:'待审核',
		value:3
	},
	{
		label:'已审核',
		value:1
	},
	{
		label:'审核不通过',
		value:2
	}
]

// 账号状态
export const ACCOUNTSTATUS = [
	{
		label:'全部',
		value:null
	},
	{
		label:'已生效',
		value:1
	},
	{
		label:'已作废',
		value:2
	},
]

// 审核结果
export const ADUITRESULT = [
	{
		label:'审核通过',
		value:1
	},
	{
		label:'审核不通过',
		value:2
	},
]

//账户类型
export const ACCOUNTTYPE = [
	{
		label:'基本账户',
		value:4
	},
	{
		label:'一般账户',
		value:1
	},
	{
		label:'专用账户',
		value:2
	},
	{
		label:'临时账户',
		value:3
	},
]

// 服务中心银行账号
export const SERVICE_CENTER_BANK_CONFIG ={
    form: [
        {
            label: '服务中心编号',
            key: 'storeCode',
            type: 'input',
            value: '',
            placeholder: '请输入服务中心编号',
        },
        {
            label: '分公司',
            key: 'companyCode',
            type: 'select',
            value: '',
						bindKey: 'serviceCompanyOptions',
            options: [],
            placeholder: '请选择分公司',
				},
		// {
    //         label: '审核状态',
    //         key: 'verifyStatus',
    //         type: 'select',
    //         value: '',
    //         options:AUDITSTATUS,
    //         placeholder: '请选择审核状态',
    //     },
				{
					label: '账号状态',
					key: 'isUsed',
					type: 'select',
					value: '',
					options:ACCOUNTSTATUS,
					placeholder: '请选择账号状态',
				},
        {
            label: '负责人卡号',
            key: 'leaderCardNo',
            type: 'input',
            value: '',
            placeholder: '请输入负责人卡号',
        },
    ],
}

export const ADUIT = {
	1: '审核通过' ,
	2: '审核不通过',
	3: '待审核'
};

export const ACCOUNTLIST = {
	1: '一般账户',
	2: '专用账户',
	3: '临时账户',
	4: '基本账户'
};

export const ISDEDUCTION = {
	1: '是',
	2: '否',
};

export const ISUSED = {
	1: '生效',
	2: '作废',
};

export const OPTYPE = {
	1: '新增',
	2: '修改',
	3: '作废',
};
// 列表切换状态	 全部：null	待审核：3
export const SWITCH_COLUMS_STATUS = {
	all: null,
	audit: 3
}

// 银行账号列表 待审核tabs
export const TOBE_AUDIT_TABS = [
	['全部审核', 'allAudit'],
	['新增审核', 'addAudit'],
	['修改审核', 'editAudit'],
	['删除审核', 'delAudit'],
]
export const TOBE_AUDIT_TABS_VALUE = {
	allAudit: null,
	addAudit: 1,
	editAudit: 2,
	delAudit: 3,
}


export const SERVICE_CENTER_BANK_COLUMS =  [
	{
		prop: 'storeCode',
		label: '服务中心编号',
		align: 'center',
		width: 100,
	},
	{
		prop: 'companyName',
		label: '分公司',
		align: 'center',
		width: 120,
	},
	{
		prop: 'storeName',
		label: '服务中心名称',
		align: 'center',
		width: 150,
	},
	{
		prop: 'leaderNo',
		label: '负责人卡号',
		align: 'center',
		width: 150,
	},
	{
		prop: 'accountName',
		label: '账户名称',
		align: 'center',
		width: 150,
	},
	{
		prop: 'accountBank',
		label: '开户银行',
		align: 'center',
	},
	{
		prop: 'account',
		label: '账号',
		align: 'center',
		width: 150,
		formatter: ({ account, isUsed }) => {
			return `
				<span class="${isUsed==2?'mark_red':''}">${account}</span>
			`;
		}
	},
	{
		prop: 'provinceName',
		label: '银行省份',
		align: 'center',
	},
	{
		prop: 'cityName',
		label: '银行城市',
		align: 'center',
	},
	{
		prop: 'branch',
		label: '开户行名称',
		align: 'center',
		width: 180,
	},
	{
		prop: 'accountType',
		label: '账户性质',
		align: 'center',
		formatter: ({ accountType }) => {
			return accountType in ACCOUNTLIST ? ACCOUNTLIST[accountType] : '';
		}
	},
	{
		prop: 'opType',
		label: '审核类型',
		align: 'center',
		formatter: ({ opType }) => {
			return opType in OPTYPE ? OPTYPE[opType] : '';
		}
	},
	{
		prop: 'verifyStatus',
		label: '审核状态',
		align: 'center',
		formatter: ({ verifyStatus }) => {
			return verifyStatus in ADUIT ? ADUIT[verifyStatus] : '';
		}
	},
	{
		prop: 'isUsed',
		label: '账户状态',
		align: 'center',
		formatter: ({ isUsed }) => {
			return isUsed in ISUSED ? ISUSED[isUsed] : '';
		}
	},
	{
		prop: 'isDeduction',
		label: '扣款账号',
		align: 'center',
		width: 100,
		formatter: ({ isDeduction }) => {
			return isDeduction in ISDEDUCTION ? ISDEDUCTION[isDeduction] : '';
		}
	},
	{
		prop: 'createTime',
		label: '提交时间',
		align: 'center',
		width: 150,
		formatter: ({ createTime }) => {return formatDate(new Date(createTime).getTime())}
	},
	{
		prop: 'submitter',
		label: '提交人',
		align: 'center',
		width: 100,
	},
	{
		prop: 'verifyTime',
		label: '审核时间',
		align: 'center',
		width: 150,
		formatter: ({ verifyTime }) => {return formatDate(new Date(verifyTime).getTime())}
	},
	{
		prop: 'verifier',
		label: '审核人',
		align: 'center',
		width: 100,
	},
	{
		prop: 'verifyRemark',
		label: '审核备注',
		align: 'center',
		width: 150,
	},
]

//服务中心详情，表格头部
export const HEADERDATA = [
	{
		name: '全部',
	},
	{
		name: '待审核',
	}
]

// 新建检验规则
export const CREATE_NEW_BANK_RULES = {
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
	accountBank :[
		{ required: true, message: '请选择开户银行', trigger: 'change' },
	],
	// 账号
	account:[
		{ required: true, message: '请输入账户', trigger: 'blur' },
		{ min: 1, max: 50, message: '支持1~50个字符，不限输入类型', trigger: 'blur' },
	],
	// 银行省份
	provinceName:[
		{ required: true, message: '请选择银行省份', trigger: 'change' },
	],
	// 银行城市
	cityName:[
		{ required: true, message: '请选择银行城市', trigger: 'change' },
	],
	// 开户行名称
	branch:[
		{ required: true, message: '请输入开户行名称', trigger: 'blur' },
		{ min: 1, max: 50, message: '支持1~50个字符，不限输入类型', trigger: 'blur' },
	],
	// 账户类型
	accountType:[
		{ required: true, message: '请选择账户类型', trigger: 'change' },
	],
	permissionUrl: [
		{ required: true, message: '请选择文件', trigger: 'blur' }
	]
}

// 审核功能验证规则
export const AUDIT_FORM_RULES = {
	verifyStatus: [{ required: true, message: '请选择审核结果', trigger: 'blur' }]
}

// 新建服务中心银行账号字段
export const DataKey = {
	account:'',
	accountBank:'',
	accountName:'',
	accountType:null,
	branch:'',
	cityName: '',
	isDeduction:2,
	permissionUrl:'',
	provinceName: '',
	storeCode:'',
	submitter:'',
	storeName: '',
	leaderName:''
}


export const SERVICE_BANKHISTORY_COLUMNS =  [
	{
		prop: 'submitter',
		label: '修改人',
		align: 'center',
	},
	{
		prop: 'updaterNo',
		label: '修改人编号',
		align: 'center',
		width: 100
	},
	{
		prop: 'updateTime',
		label: '修改（申请）时间',
		align: 'center',
		width: 140,
		formatter: ({ updateTime }) => formatDate(updateTime)
	},
	{
		prop: 'opType',
		label: '操作类型',
		align: 'center',
		formatter: ({ opType }) => {
			return opType in OPTYPE ? OPTYPE[opType] : '';
		}
	},
	{
		prop: 'accountName',
		label: '账户名称',
		align: 'center',
		width: 150
	},
	{
		prop: 'accountBank',
		label: '开户银行',
		align: 'center',
	},
	{
		prop: 'account',
		label: '账号',
		align: 'center',
		width: 150
	},
	{
		prop: 'provinceName',
		label: '银行省份',
		align: 'center',
	},
	{
		prop: 'cityName',
		label: '银行城市',
		align: 'center',
	},
	{
		prop: 'branch',
		label: '开户行名称',
		align: 'center',
	},
	{
		prop: 'isUsed',
		label: '账号状态',
		align: 'center',
		formatter: ({ isUsed }) => {
			return isUsed in ISUSED ? ISUSED[isUsed] : '';
		}
	},
	{
		prop: 'accountType',
		label: '账户类型',
		align: 'center',
		formatter: ({ accountType }) => {
			return accountType in ACCOUNTLIST ? ACCOUNTLIST[accountType] : '';
		}
	},
	{
		prop: 'isDeduction',
		label: '扣款账号',
		align: 'center',
		formatter: ({ isDeduction }) => {
			return isDeduction in ISDEDUCTION ? ISDEDUCTION[isDeduction] : '';
		}
	},
	{
		prop: 'verifier',
		label: '审核人',
		align: 'center',
	},
	{
		prop: 'verifyStatus	',
		label: '审核结果',
		align: 'center',
		formatter: ({ verifyStatus }) => {
			return verifyStatus in ADUIT ? ADUIT[verifyStatus] : '';
		}
	},
	{
		prop: 'verifyRemark',
		label: '审核备注',
		align: 'center',
	},
	{
		prop: 'verifyTime',
		label: '审核时间',
		align: 'center',
		formatter: ({ verifyTime }) => formatDate(verifyTime),
		width: 140
	},
]
