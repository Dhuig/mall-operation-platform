import { optionGenerator, genCurrentMonthFirstAndLastDay,dateRangePickerGenerator } from 'util';
import { filters } from 'plugins/filters';

// 服务中心管理 附件资料 列定义
export const SERVICE_COMPANY_ATTACH_COLUMNS = [
	{ prop: 'dataName', label: '名称', align: 'center' },
	{ prop: 'certificatesName', label: '文件', align: 'center' },
	{ prop: 'uploadedBy', label: '上传人', align: 'center' },
	{ prop: 'uploadTimeShow', label: '上传时间', align: 'center' },
];

// 服务公司-操作记录 列定义
export const OPERATION_RECORD_COLUMNS = [
	{ prop: 'statusText', label: '操作类型', align: 'center', width: 120 },
	{ prop: 'createPerson', label: '操作人', align: 'center', width: 120 },
	{ prop: 'createTimeText', label: '操作时间', align: 'center' },
	{ prop: 'reason', label: '操作原因', align: 'center' },
	{ prop: 'reasonDes', label: '原因说明', align: 'center'},
];

// 服务公司设置 - 注销原因 - 列定义
export const UNREG_REASON_COLUMN = [
	{ prop: 'reason', label: '注销原因名称', align: 'center' },
	{ prop: 'creator', label: '创建人', align: 'center' },
	{ prop: 'createTime', label: '创建时间', align: 'center' },
	{ prop: 'editor', label: '修改人', align: 'center' },
	{ prop: 'editeTime', label: '修改时间', align: 'center' },
];

// 服务公司类型
export const SERVICE_COMPANY_TYPE = {
	'1': '自主',
	'2': '代办'
}

// 审核状态
export const VALIDATE_STATUS = {
	'1': '草稿',
	'2': '待审核',
	'3': '审核通过',
	'4': '审核不通过',
	'5': '已注销'
}
// 审核状态枚举
export const VALIDATE_STATUS_MAP = {
	'DRAFT': 1,
	'TO_BE_CHECK': 2,
	'PASSED': 3,
	'NOT_PASS': 4,
	'UN_REGISTERED': 5,
}

// 是否跟进
export const TRACKING_STATE = {
	'1': '是',
	'2': '否'
}

// 是否上海
export const IS_SHANGHAI = {
	'1': '是',
	'2': '否'
}

// 法人与本人关系
export const LEGAL_PERSON_RELATIONSHIP = {
	'1': '本人',
	'2': '配偶',
	'3': '父母',
	'4': '子女',
	'5': '其他'
}

// 帐户性质
export const ACCOUNT_PROPERTY = {
	'1': '基本账户'
}

// 文件类型
export const FILE_TYPE = {
	'1': '营业执照',
	'2': '税务登记证（三证合一无需）',
	'3': '开户许可证',
	'4': '公司/发票/法人/财务印章',
	'5': '第三方关系说明书',
	'6': '更改申请书',
	'7': '结婚证',
	'8': '通讯清单'
}

// 银行卡发放类型
export const PROVIDE_TYPE = {
	'1': '直销员',
	'2': '客户经理'
}
// 银行卡切换
export const TAB_PANE = [
	{ label: '全部', value: 'all' },
	{ label: '无帐号', value: 'noAccount' },
	{ label: '正常', value: 'normal' },
	{ label: '汇退', value: 'refund' },
]

// 银行卡模板下载
export const TEMPLATE_DOWNLOAD = {
	dev: 'dev-perfect-oss-uc2.oss-cn-shenzhen.aliyuncs.com/mall-center-member/202101111513567x4Z1.xlsx', // 开发环境
	test: 'test-perfect-oss-uc2.oss-cn-shenzhen.aliyuncs.com/mall-center-member/202101111513567x4Z1.xlsx', // 测试环境
	uat: 'uat-perfect-oss-uc2.oss-cn-shenzhen.aliyuncs.com/mall-center-member/202101111513567x4Z1.xlsx', // uat环境
	prod: 'uc.oss.perfect99.com/mall-center-member/202101111513567x4Z1.xlsx', // 生产环境
}

// 银行卡状态
export const BANKCARD_STATUS = {
	'1': '汇退',
	'2': '正常',
	'3': '无帐号' // 删除
}
// 银行卡枚举字典
export const BANKCARD_STATUS_CONFIG = {
	refund: '1',
	normal: '2',
	noAccount: '3'
}

// 银行卡状态选项卡映射字典
export const BANKCARD_STATUS_MAP = {
	all: '',
	noAccount: '3',
	normal: '2',
	refund: '1'
}

// 服务公司管理 搜索定义
export const SERVICE_COMPANY_SEARCH = {
	form: [
		{
			label: '会员卡号',
			key: 'cardNo',
			type: 'input',
			value: '',
			placeholder: '请填写会员卡号',
		},
		{
			label: '服务公司',
			key: 'serviceId',
			type: 'input',
			value: '',
			placeholder: '服务公司编号/法人/姓名',
		},
		{
			label: '姓名',
			key: 'name',
			type: 'input',
			value: '',
			placeholder: '请填写姓名',
		},
		{
			label: '审批状态',
			key: 'state',
			type: 'select',
			value: '',
			options: optionGenerator(VALIDATE_STATUS),
			placeholder: '请选择状态',
		},
		{
			label: '类型',
			key: 'type',
			type: 'select',
			value: '',
			options: optionGenerator(SERVICE_COMPANY_TYPE),
			placeholder: '请选择类型',
		},
		{
			label: '注册手机号',
			key: 'phoneNumber',
			type: 'input',
			value: '',
			placeholder: '请填写注册手机号',
		},
		{
			label: '是否跟进',
			key: 'trackingState',
			type: 'select',
			value: '',
			options: optionGenerator(TRACKING_STATE),
			placeholder: '请选择是否跟进',
		},
		{
			label: '是否上海',
			key: 'isItShanghai',
			type: 'select',
			value: '',
			options: optionGenerator(IS_SHANGHAI),
			placeholder: '请选择是否上海',
		},
		{
			label: '提交时间',
			key: 'submitTimeRange',
			type: 'datePicker',
			value: [undefined, undefined],
			config: {
				type: 'daterange',
			},
		},
	],
};

// 服务公司管理 列定义
export const SERVICE_COMPANY_COLUMNS = [
	{ prop: 'serviceId', label: '服务公司编号', align: 'center',  width: 120 },
	{ prop: 'serviceName', label: '服务公司名称', align: 'center', width: 200 },
	{ prop: 'legalPerson', label: '法人', align: 'center' },
	{ prop: 'cardNo', label: '会员卡号', align: 'center', width: 120 },
	{ prop: 'realname', label: '姓名', align: 'center' },
	{
		prop: 'submitTime',
		label: '提交时间',
		align: 'center',
		width: 150,
		formatter: ({ submitTime }) => {
			if(!submitTime) return '';
			return filters.timestampFormat(new Date(submitTime).valueOf());
		}
	},
	{
		prop: 'trackingState',
		label: '是否跟进',
		align: 'center',
		formatter: ({ trackingState }) => {
			return trackingState in TRACKING_STATE ? TRACKING_STATE[trackingState] : '';
		}
	},
	{
		prop: 'type',
		label: '类型',
		align: 'center',
		formatter: ({ type }) => {
			return type in SERVICE_COMPANY_TYPE ? SERVICE_COMPANY_TYPE[type] : '';
		}
	},
	{
		prop: 'state',
		label: '审批状态',
		align: 'center',
		formatter: ({ state }) => {
			return state in VALIDATE_STATUS ? VALIDATE_STATUS[state] : '';
		}
	},
	{
		prop: 'mobile',
		label: '注册手机号',
		align: 'center',
		width: 150
	},
];
// 服务公司详情表单验证规则
export const COMPANY_RULES = {
	// serviceId: [{ required: true, message: '请输入服务公司编号', trigger: 'blur' }],
	serviceName: [{ required: true, message: '请输入服务公司名称', trigger: 'blur' }],
	legalPerson: [{ required: true, message: '请输入法人', trigger: 'blur' }],
	legalPersonOn: [{ required: true, message: '请选择法人与本人关系', trigger: 'blur' }],
	taxpayerNumber: [{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }],
	belongToCode: [{ required: true, message: '请输入所属分公司', trigger: 'blur' }],
	province: [{ required: true, message: '请输入省份名称', trigger: 'blur' }],
	postalCode: [
		{ required: true, message: '请输入邮政编码', trigger: 'blur' }, 
		{ pattern: /^[0-9]{6}$/, message: '请输入6位邮政编码', trigger: 'blur' },
	],
	businessLicenseSite: [{ type: 'array', required: true, message: '请输入营业执照地址', trigger: 'change' }],
};
// 服务公司详情-银行信息表单验证规则
export const COMPANY_BANK_RULES = {
	bankAccountName: [{ required: true, message: '请输入帐户名称', trigger: 'blur' }],
	bankName: [{ required: true, message: '请输入银行名称', trigger: 'blur' }],
	bankId: [{ required: true, message: '请输入开户银行', trigger: 'blur' }],
	bankNumber: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
	bankSite: [{ type: 'array', required: true, message: '请输入所属省市区', trigger: 'change' }],
};

// 银行卡列表查询
export const BANKCARD_SEARCH_LIST = {
	form: [
		{
			label: '会员卡号',
			key: 'cardNo',
			type: 'input',
			value: '',
			placeholder: '请填写会员卡号',
		},
		{
			label: '顾客姓名',
			key: 'realname',
			type: 'input',
			value: '',
			placeholder: '请填写顾客姓名',
		},
		{
			label: '注册手机号',
			key: 'mobile',
			type: 'input',
			value: '',
			placeholder: '请填写注册手机号',
		},
		{
			label: '发放类型',
			key: 'provideType',
			type: 'select',
			value: '',
			options: optionGenerator(PROVIDE_TYPE),
			placeholder: '请选择发放类型',
		},
		// {
		// 	label: '银行卡状态',
		// 	key: 'status',
		// 	type: 'select',
		// 	value: '',
		// 	options: optionGenerator(BANKCARD_STATUS),
		// 	placeholder: '请选择发放类型',
		// },
		{
			label: '提交时间',
			key: 'createTimeRange',
			type: 'datePicker',
			value: genCurrentMonthFirstAndLastDay(),
			config: {
				type: 'daterange',
			},
		},
	]
};

// 银行卡列表 列定义
export const BANKCARD_LIST_COLUMNS = [
	{ prop: 'cardNo', label: '会员卡号', align: 'center' },
	{ prop: 'realname', label: '顾客姓名', align: 'center' },
	{
		prop: 'provideType',
		label: '发放类型',
		align: 'center',
		formatter: ({ provideType }) => {
			return provideType in PROVIDE_TYPE ? PROVIDE_TYPE[provideType] : '';
		}
	},
	{
		prop: 'bankOpenType',
		label: '开户银行类型',
		align: 'center',
		width:100,
		formatter: ({ bankOpenTypeDesc }) => bankOpenTypeDesc || ''
	},
	{ prop: 'bankOpenName', label: '开户银行名称', align: 'center', width:120, },
	{ prop: 'bankNo', label: '银行账号', align: 'center', width:160, },
	{
		prop: 'openCardTime',
		label: '开卡时间',
		align: 'center',
		width:150,
		formatter: ({ openCardTime }) => {
			return filters.timestampFormat(openCardTime)
		}
	},
	{
		prop: 'status',
		label: '银行卡状态',
		align: 'center',
		formatter: ({ status }) => {
			return status in BANKCARD_STATUS ? BANKCARD_STATUS[status] : '';
		}
	},
	{ prop: 'directSellerBanksVo', label: '直销员开户银行名称', align: 'center', width:150, 
		formatter: ({ directSellerBanksVo }) => {
			let bankname = (directSellerBanksVo && directSellerBanksVo.bankname) || ''
			return bankname
		}
	},
	{ prop: 'bankno', label: '直销员银行账号', align: 'center', width:150, 
		formatter: ({ directSellerBanksVo }) => {
			let bankno = (directSellerBanksVo && directSellerBanksVo.bankno) || ''
			return bankno
		}
	},
];

// 银行卡变更日志记录 列定义
export const CHANGE_HISTORY_COLUMNS = [
	{ prop: 'realName', label: '顾客姓名', align: 'center' },
	{
		prop: 'status',
		label: '银行卡状态',
		align: 'center',
		formatter: ({ status }) => {
			return status in BANKCARD_STATUS ? BANKCARD_STATUS[status] : '';
		}
	},
	{ prop: 'operatorPerson', label: '操作人', align: 'center' },
	{
		prop: 'createTime',
		label: '操作时间',
		align: 'center',
		formatter: ({ createTime }) => {
			return filters.timestampFormat(createTime)
		}
	},
	{ prop: 'updateDesc', label: '操作类型', align: 'center' }
];

// 银行卡表单验证规则
export const BANKCARD_RULES = {
	cardNo: [{ required: true, message: '请输入会员卡号', trigger: 'blur' }],
	provideType: [{ required: true, message: '请选择发放类型', trigger: 'change' }],
	bankOpenType: [{ required: true, message: '请选择开户银行类型', trigger: 'change' }],
	site: [{ type:'array', required: true, message: '请选择省市区', trigger: 'change' }],
	bankNo: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
	bankOpenName: [{ required: true, message: '请输入开户行名称', trigger: 'blur' }],
};

// 开户银行管理 列定义
export const BANK_OF_DEPOSIT_COLUMNS = [
	{ prop: 'code', label: '开户银行编号', align: 'center',width:150, },
	{ prop: 'name', label: '开户银行名称', align: 'center' },
	{ prop: 'operatorName', label: '创建人', align: 'center',width:150, },
	{
		prop: 'createTime',
		label: '创建时间',
		align: 'center',
		formatter: ({ createTime }) => {
			return filters.timestampFormat(createTime)
		}
	},
];

// 会员卡状态
export const MEMBER_CARD_STATUS = {
	'null': '全部',
	'-2': '未激活',
	'-1': '待激活',
	'0': '有效',
	'1': '已失效',
	'2': '已注销',
}

// 会员列表 搜索
export const MEMBER_LIST_SEARCH = {
	form: [
		{
			label: '会员卡号',
			key: 'cardNo',
			type: 'input',
			value: '',
			placeholder: '请填写会员卡号',
		},
		{
			label: '姓名',
			key: 'realname',
			type: 'input',
			value: '',
			placeholder: '请填写本人或配偶姓名',
		},
		{
			label: '手机号',
			key: 'mobile',
			type: 'input',
			value: '',
			placeholder: '请填写会员本人或配偶手机号',
		},
		{
			label: '经办人',
			key: 'handledCardNo',
			type: 'input',
			value: '',
			placeholder: '请填写经办人卡号或姓名',
		},
		{
			label: '会员卡状态',
			key: 'cardStatus',
			type: 'select',
			value: '',
			options: optionGenerator(MEMBER_CARD_STATUS, 'string'),
			placeholder: '请选择类型',
		},
		{
			label: '办卡时间',
			key: 'createTimeRange',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
				pickerOptions:{
					disabledDate(time) {
						return time.getTime() > Date.now();
					},
					shortcuts: [
						dateRangePickerGenerator('最近一周', 7),
						dateRangePickerGenerator('最近一个月', 30),
						dateRangePickerGenerator('最近三个月', 90),
						dateRangePickerGenerator('最近半年', 180),
					],
				}
			},
		},
		{
			label: '身份证号',
			key: 'certificatesNo',
			type: 'input',
			value: '',
			placeholder: '请填写本人或配偶身份证号',
		},
		// {
		// 	label: '最后购货月份',
		// 	key: 'orderDate',
		// 	type: 'datePicker',
		// 	value: '',
		// 	config: {
		// 		type: 'month',
		// 		valueFormat: 'yyyy-MM',
		// 		placeholder: '请选择最后购货月份',
		// 		pickerOptions:{
		// 			disabledDate(time) {
    //         return time.getTime() > Date.now();
    //       },
		// 		}
		// 	},
		// },
		// {
		// 	label: '取消月份',
		// 	key: 'cancelDate',
		// 	type: 'datePicker',
		// 	value: '',
		// 	config: {
		// 		type: 'month',
		// 		valueFormat: 'yyyy-MM',
		// 		placeholder: '请选择取消月份',
		// 		pickerOptions:{
		// 			disabledDate(time) {
    //         return time.getTime() > Date.now();
    //       },
		// 		}
		// 	},
		// },
	]
};

// 会员列表 列定义
export const MEMBER_LIST_COLUMNS = [
	{ prop: 'cardNo', label: '会员卡号', align: 'center', width: 100 },
	{ prop: 'realname', label: '姓名', align: 'center' },
	{ prop: 'mobile', label: '手机号', align: 'center',  width: 120 },
	{ prop: 'certificatesNo', label: '证件号码', align: 'center', width: 200 },
	{ prop: 'openCardTimeStr', label: '办卡时间', align: 'center', width: 200 },
	{ prop: 'handledCardNo', label: '经办人卡号', align: 'center', width: 100 },
	{ prop: 'handledCardName', label: '经办人姓名', align: 'center' },
	{
		prop: 'cardStatus',
		label: '会员卡状态',
		align: 'center',
		formatter: ({ cardStatus }) => {
			return cardStatus in MEMBER_CARD_STATUS ? MEMBER_CARD_STATUS[cardStatus] : '';
		}
	},
	{ prop: 'orderDate', label: '最后购货月份', align: 'center',width: 120 },
	{ prop: 'cancelDate', label: '取消月份', align: 'center',
		formatter: ({ cancelDate }) => {
			let cancelTime = cancelDate ? cancelDate.slice(0, 4) + '-' + cancelDate.slice(-2) : "";
			return cancelTime;
		}
	},
];

// 优惠卡表单验证规则
export const MEMBER_CARD_RULES = {
	// 办卡人部份字段
	cardNo: [{ required: true, message: '请输入卡号', trigger: 'blur' }],
	realname: [{ required: true, message: '请输入办卡人姓名', trigger: 'blur' }],
	certificatesNo: [{ required: true, message: '请输入证件号', trigger: 'blur' }],
	// contactMobile: [{ required: true, message: '请输入联系手机', trigger: 'blur' }],
	// 配偶部份字段
	spouseRealname: [{ required: true, message: '请输入配偶姓名', trigger: 'blur' }],
	spouseCertificatesNo: [{ required: true, message: '请输入配偶证件号', trigger: 'blur' }],
	// spouseMobile: [{ required: true, message: '请输入配偶的联系手机', trigger: 'blur' }],
	// 经办人
	handledCardNo: [{ required: true, message: '请输入经办人卡号', trigger: 'blur' }],
	// 挂靠服务中心号
	relyStoreCode: [{ required: true, message: '请输入挂靠服务中心号', trigger: 'blur' }],
};

// 会员卡列表 搜索
export const MEMBER_CARD_LOG_SEARCH = {
	form: [
		{
			label: '顾客编号',
			key: 'memberNo',
			type: 'input',
			value: '',
			placeholder: '请填写顾客编号',
		},
		{
			label: '会员卡号',
			key: 'cardNo',
			type: 'input',
			value: '',
			placeholder: '请填写会员卡号',
		},
		{
			label: '顾客姓名',
			key: 'realname',
			type: 'input',
			value: '',
			placeholder: '请填写顾客姓名',
		},
		{
			label: '注册手机号',
			key: 'mobile',
			type: 'input',
			value: '',
			placeholder: '请填写注册手机号码',
		},
		{
			label: '转换前状态',
			key: 'beforeCardStatus',
			type: 'select',
			value: '',
			options: optionGenerator(MEMBER_CARD_STATUS, 'string'),
			placeholder: '请选择转换前状态',
		},
		{
			label: '转换后状态',
			key: 'afterCardStatus',
			type: 'select',
			value: '',
			options: optionGenerator(MEMBER_CARD_STATUS, 'string'),
			placeholder: '请选择转换后状态',
		},
		{
			label: '开卡时间',
			key: 'openCardTimeRange',
			type: 'datePicker',
			value: genCurrentMonthFirstAndLastDay(),
			config: {
				type: 'daterange',
			},
		},
		{
			label: '转换时间',
			key: 'transformEndTimeRange',
			type: 'datePicker',
			// value: [Date.now(), Date.now()],
			value: genCurrentMonthFirstAndLastDay(),
			config: {
				type: 'daterange',
			},
		},
	]
};

// 会员卡列表 列定义
export const MEMBER_CARD_LOG_COLUMN = [
	{
		prop: 'openCardTime',
		label: '开卡时间',
		align: 'center',
	},
	{
		prop: 'transformTime',
		label: '转换时间',
		align: 'center',
	},
	{ prop: 'memberNo', label: '顾客编号', align: 'center' },
	{ prop: 'cardNo', label: '会员卡号', align: 'center' },
	{ prop: 'realname', label: '顾客姓名', align: 'center' },
	{
		prop: 'mobile',
		label: '注册手机号',
		align: 'center'
	},
	{
		prop: 'beforeCardStatus',
		label: '转换前卡状态',
		align: 'center',
		formatter: ({ beforeCardStatus }) => {
			return beforeCardStatus in MEMBER_CARD_STATUS ? MEMBER_CARD_STATUS[beforeCardStatus] : '';
		}
	},
	{
		prop: 'afterCardStatus',
		label: '转换后卡状态',
		align: 'center',
		formatter: ({ afterCardStatus }) => {
			return afterCardStatus in MEMBER_CARD_STATUS ? MEMBER_CARD_STATUS[afterCardStatus] : '';
		}
	},
	{ prop: 'createPerson', label: '操作人', align: 'center' },
];

// 会员PV列表 搜索
export const MEMBER_PV_SEARCH = {
	form: [
		{
			label: '顾客编号',
			key: 'memberNo',
			type: 'input',
			value: '',
			placeholder: '请填写顾客编号',
		},
		{
			label: '会员卡号',
			key: 'cardNo',
			type: 'input',
			value: '',
			placeholder: '请填写会员卡号',
		},
		{
			label: '顾客姓名',
			key: 'realname',
			type: 'input',
			value: '',
			placeholder: '请填写顾客姓名',
		},
		{
			label: '注册手机号',
			key: 'mobile',
			type: 'input',
			value: '',
			placeholder: '请填写注册手机号',
		},
		{
			label: '开卡时间',
			key: 'openCardTime',
			type: 'datePicker',
			value: genCurrentMonthFirstAndLastDay(),
			config: {
				type: 'daterange',
			},
		},
	]
};

// 会员PV列表 列定义
export const MEMBER_PV_LIST_COLUMNS = [
	{ prop: 'openCardTimeStr', label: '开卡时间', align: 'center', width: 160 },
	{ prop: 'memberNo', label: '顾客编号', align: 'center', width: 160 },
	{ prop: 'cardNo', label: '会员卡号', align: 'center',  width: 120 },
	{ prop: 'realname', label: '顾客姓名', align: 'center', width: 100 },
	{ prop: 'mobile', label: '注册手机号', align: 'center', width: 120 },
	{
		prop: 'cardStatusdesc',
		label: '卡状态',
		align: 'center',
	},
	{ prop: 'totalPv', label: '个人累计PV', align: 'center', width: 100,
		formatter:({totalPv}) => { return totalPv || 0 }
	},
	{ prop: 'realTimePv', label: '实时个人PV', align: 'center', width: 100,
		formatter:({realTimePv}) => { return realTimePv || 0 }
	},
];

// PV流水明细-来源
export const FLOW_DETAILS_STATUS = {
	'1': '核心',
	'2': '商城',
	'3': '上海健康',
}
// PV流水明细-操作类型
export const OPERATION_STATUS_ALL = [
	{
		value: 1,
		label: '订单支付'
	},
	{
		value: 2,
		label: '当月退'
	},
	{
		value: 3,
		label: '隔月退'
	},
	{
		value: 4,
		label: '补报单'
	},
	{
		value: 5,
		label: '团购报单'
	},
	{
		value: 6,
		label: '油葱健康订单'
	},
	{
		value: 7,
		label: '核心月结'
	},
	{
		value: 8,
		label: '商城失效'
	},
	{
		value: 9,
		label: '恢复资格'
	},
]
// PV流水明细-操作类型-核心
export const OPERATION_STATUS_CORE = [
	{
		value: 7,
		label: '核心月结'
	},
]
// PV流水明细-操作类型-商城
export const OPERATION_STATUS_MALL = [
	{
		value: 1,
		label: '订单支付'
	},
	{
		value: 2,
		label: '当月退'
	},
	{
		value: 3,
		label: '隔月退'
	},
	{
		value: 4,
		label: '补报单'
	},
	{
		value: 5,
		label: '团购报单'
	},
	{
		value: 8,
		label: '商城失效'
	},
	{
		value: 9,
		label: '恢复资格'
	},
]
// PV流水明细-操作类型-上海健康
export const OPERATION_STATUS_HEALTHY = [
	{
		value: 6,
		label: '油葱健康订单'
	},
]
// 会员PV详情-PV流水明细 搜索
export const PV_FLOW_DETAILS_SEARCH = {
	form: [
		{
			label: '业绩月份',
			key: 'achievementMonth',
			type: 'datePicker',
			value: genCurrentMonthFirstAndLastDay(),
			config: {
				type: 'monthrange',
			},
		},
		{
			label: '变更时间',
			key: 'pvChangeTime',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
			},
		},
		{
			label: 'PV来源',
			key: 'channel',
			type: 'select',
			value: '',
			options: optionGenerator(FLOW_DETAILS_STATUS, 'string'),
			placeholder: '请选择PV来源',
		},
		{
			label: 'PV操作类型',
			key: 'operationType',
			type: 'select',
			value: '',
			options: OPERATION_STATUS_ALL,
			placeholder: '请选择PV操作类型',
		},
	]
};

// 会员PV详情-PV流水明细 列定义
export const PV_FLOW_DETAILS_COLUMNS = [
	{ prop: 'cardNo', label: '会员卡号', align: 'center', width: 120 },
	{ prop: 'realname', label: '顾客姓名', align: 'center', width: 100 },
	{ prop: 'pvOrder', label: 'PV流水', align: 'center',  width: 100 },
	{ prop: 'createTimeText', label: 'PV变更时间', align: 'center', width: 160 },
	{ prop: 'ChangePv', label: 'PV变化值', align: 'center', width: 120,
		formatter: ({ beforeChangePv, afterChangePv}) => {
			return afterChangePv - beforeChangePv
		}
	},
	{ prop: 'beforeChangePv', label: '变更前个人累计PV值', align: 'center', width: 160,
		formatter:({beforeChangePv}) => { return beforeChangePv || 0 },
	},
	{ prop: 'afterChangePv', label: '变更后个人累计PV值', align: 'center', width: 160,
		formatter:({afterChangePv}) => { return afterChangePv || 0 },
	},
	{ prop: 'month', label: 'PV业绩月份', align: 'center', width: 100,
		formatter: ({ month }) => {
			let isMonth = month ? `${month.substring(0,4)}-${month.substring(4)}` : '';
			return isMonth
		}
	},
	{ prop: 'channelText', label: 'PV来源', align: 'center', width: 100 },
	{ prop: 'orderNo', label: 'PV对应单据', align: 'center', width: 170 },
	{ prop: 'operationTypeText', label: 'PV操作类型', align: 'center', width: 100 },
];
// 会员PV详情-当月个人PV 搜索
export const PV_SAME_MONTH_SEARCH = {
	form: [
		{
			label: '业绩月份',
			key: 'personalMonth',
			type: 'datePicker',
			value: genCurrentMonthFirstAndLastDay(),
			config: {
				type: 'monthrange',
			},
		}
	]
};

// 会员PV详情-当月个人PV 列定义
export const PV_SAME_MONTH_COLUMNS = [
	{ prop: 'memberNo', label: '顾客编号', align: 'center' },
	{ prop: 'cardNo', label: '会员卡号', align: 'center'},
	{ prop: 'realname', label: '顾客姓名', align: 'center' },
	{ prop: 'openCardTimeStr', label: '开卡时间', align: 'center', width: 180 },
	{ prop: 'month', label: '业绩月份', align: 'center',
		formatter: ({ month }) => {
			let isMonth = month ? `${month.substring(0,4)}-${month.substring(4)}` : '';
			return isMonth
		}
	},
	{ prop: 'totalMonthPv', label: '月个人PV', align: 'center',
		formatter: ({ totalMonthPv }) => {
			return totalMonthPv || 0
		}
	},
];

