// import { filters } from 'plugins/filters';
import { optionGenerator } from 'util';
import { GRADE_OPTIONS } from '../serviceCenterGrade/config.js';
export const CAN_BUILD_STORE_ARR = [3, 4]; //可建服务中心顾客身份集合
// 默认列表
//是否为分店
export const ISSERVICESHOP = [
	{
		label:'是',
		value:2
	},
	{
		label:'否',
		value:1
	},
]
// 是否选项
export const ISTRUE = [
	{
		label:'是',
		value: 1
	},
	{
		label:'否',
		value: 2
	}
]
// 证件类型
export const CARDLIST = [
	{
		label:'身份证',
		value:1
	},
	{
		label:'其他证件',
		value:2
	}
]

//居住地
export const PLACEOPTION = [
	{
		label:'大中城市',
		value:'1'
	},
	{
		label:'县城',
		value:'2'
	},
	{
		label:'农村',
		value:'3'
	},
]

//文化程度
export const EDUCATIONOPTION = [
	{
		label:'高中或以下',
		value:'01'
	},
	{
		label:'中专',
		value:'02'
	},
	{
		label:'大专',
		value:'03'
	},
	{
		label:'大学本科',
		value:'04'
	},
	{
		label:'研究生及以上',
		value:'05'
	},
]
// 职业类型
export const OCCUPATIONOPTION = [
	{
		label:'企事业管理人员',
		value:'1'
	},
	{
		label:'专业人士',
		value:'2'
	},
	{
		label:'私营老板',
		value:'3'
	},
	{
		label:'职员/职工',
		value:'4'
	},
	{
		label:'自由职业',
		value:'5'
	},
	{
		label:'下岗/退休',
		value:'6'
	},
	{
		label:'务农',
		value:'7'
	},
	{
		label:'其他',
		value:'8'
	}
]

export const SEXOPTION = [
	{
		label:'男',
		value:1
	},
	{
		label:'女',
		value:2
	}
]

// 组成形式
export const COMPOSTIONOPTION = [
	{
		label:'个人经营',
		value:'1'
	},
	{
		label:'家庭经营',
		value:'2'
	},
]

//服务中心权限
export const SERVICEAUTHORITY = [
	{
		label:'A.可押货',
		value:1
	},
	{
		label:'B.可配送',
		value:2
	},
	{
		label:'C.自购下单',
		value:3
	},
	{
		label:'D.可退货',
		value:4
	},
	{
		label:'E.代客下单',
		value:5
	},
	{
		label:'F.禁止登录',
		value:6
	},
	{
		label:'G.取消资格',
		value:7
	},
]

//经营类型
export const MANAGEMENTOPTION = [
	{
		label:'个体工商户',
		value:1
	},
	{
		label:'个体独资企业',
		value:2
	},
	{
		label:'家庭经营',
		value:3
	},
	{
		label:'普通合伙企业',
		value:4
	},
	{
		label:'有限责任公司',
		value:5
	},
	{
		label:'集体所有制',
		value:6
	},
	{
		label:'非公司私营企业',
		value:7
	},
]

//顾客身份
export const CLENTOPTION = [
	{
		label:'普通顾客',
		value:1
	},
	{
		label:'优惠顾客',
		value:2
	},
	{
		label:'云商',
		value:3
	},
	{
		label:'微店（云+）',
		value:4
	},
	{
		label:'店员',
		value:5
	},
	{
		label:'子账号',
		value:6
	},
]

//房产类型
export const PROPERTYOPTION = [
	{
		label:'自有',
		value:1
	},
	{
		label:'租赁',
		value:2
	},
]

//总分店
export const GENERALBRANCH = [
	{
		label:'全部',
		value:''
	},
	{
		label:'仅总店',
		value:1
	},
	{
		label:'仅分店',
		value:2
	},
]

//所属分公司
export const BRANCH_COMPANY = [];

// 签署合同
export const SIGNCONTRACT = [
	{
		label:'已签',
		value: 1
	},
	{
		label:'未签',
		value: 2
	},
]

// 网点类型
export const NETWORK_TYPE = {
	1: '微店',
	2: '微店（账务未清）'
}

//服务中心详情，表格头部
export const HEADERDATA = [
	{ name: '负责人资料' },
	{ name: '服务中心资料' },
	{ name: '银行账户资料' },
	{ name: '证件资料' },
	{ name: '店员资料' },
	{ name: '店铺资料' },
	{ name: '变更历史' },
];

// 模块对应名称
export const MODULE_TO_NAME = {
	'addMemberLeaderAo': '负责人资料',
	'storeVO': '服务中心资料',
	'credentialVO1': '证件资料',
	'credentialVO2': '证件资料',
	'credentialVO3': '证件资料',
}

// 取消类型 （2.3.1版本新增）
export const CANCEL_TYPE_OPTIONS = {
	1: '结点取消',
	2: '转让取消',
	3: '违规取消',
	4: '不达标取消',
	5: '冻结取消',
	6: '转云取消',
}

// 新建检验规则
export const CREATE_NEW_SERVICE_RULES = {
	// 负责人资料
	'addMemberLeaderAo.cardNo': [
		{ required: true, message: '请输入负责人卡号', trigger: 'blur' },
		{ pattern:/^(\d{8}|\d{10})$/,min: 8, max: 10, message: '长度在 8 或 10 个字符', trigger: 'blur' },
	],
	'addMemberLeaderAo.realname': [
		{ required: true, message: '请输入负责人姓名', trigger: 'blur' },
		{ min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' },
	],
	// 'storeVO.code': [
	// 	{ required: true, message: '请输入服务中心编号', trigger: 'blur' },
	// 	{ pattern: /^9[0-9]{5}$/, message: '默认按照9开头+省份代码+3位流水号预生成编号' }
	// ],
	'addMemberLeaderAo.mobile': [
		{ required: true, message: '请输入正确的手机号码', trigger: 'blur' },
    // { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码' },
    { pattern: /^1\d{10}$/, message: '请输入正确的手机号码' }
	],
	// 'addMemberLeaderAo.gender' :[
	// 	{ required: true, message: '请选择性别', trigger: 'change' },
	// ],
	'addMemberLeaderAo.certificatesType' :[
		{ required: true, message: '请选择证件类型', trigger: 'change' },
	],
	'addMemberLeaderAo.certificatesNo': [
    { required: true, message: '请输入证件号码', trigger: 'blur' },
    // { pattern: /^[\da-zA-Z]*$/, message: '证件号码只支持数字和字母类型' } @todo 兼容香港身份证，放开验证
	],
	'addMemberLeaderAo.homePhone': [
		{ pattern: /^((\d{3,4})|\d{3,4}-|s)?\d{7,14}$/, message: '请输入正确固定电话', trigger: 'blur' },
	],
	'addMemberLeaderAo.trainingTimes': [
		{ pattern: /^([1-9]|10)$/, message: '支持输入1~10，只支持数字', trigger: 'blur' },
	],
	// 'addMemberLeaderAo.lecturerLevel': [
	// 	{ min: 1, max: 30, message: '支持输入1~30字符', trigger: 'blur' },
	// ],
	// 'addMemberLeaderAo.resourceCommitteeIdentity': [
	// 	{ min: 1, max: 30, message: '支持输入1~30字符', trigger: 'blur' },
	// ],
	'addMemberLeaderAo.eatingHabbits': [
		{ min: 1, max: 30, message: '支持输入1~30字符', trigger: 'blur' },
	],
	'addMemberLeaderAo.spouseRealname': [
		{ min: 1, max: 20, message: '支持输入1~20字符', trigger: 'blur' },
	],
	'addMemberLeaderAo.spouseMobile': [
		{pattern: /^1[345678]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
	],
	'addMemberLeaderAo.spouseCertificatesNo': [
		{ min: 1, max: 30, message: '支持输入1~30字符', trigger: 'blur' },
	],
	// 服务中心
	// 'storeVO.code': [
	// 	{ required: true, message: '请输入服务中心编号', trigger: 'blur' },
	// 	{ pattern: /^9[0-9]{5}$/, message: '默认按照9开头+省份代码+3位流水号预生成编号' }
	// ],
	'storeVO.name': [
		// { required: true, message: '请输入服务中心名称', trigger: 'blur' },
		{ min: 1, max: 40, message: '支持输入1~40字符', trigger: 'blur' },
	],
	'storeVO.companyCode': [
		{ required: true, message: '请选择所属分公司', trigger: 'blur' },
	],
	'storeVO.shopType' :[
		{ required: true, message: '请选择网点类型', trigger: 'change' },
	],
	'storeVO.isMainShop' : [
		{ required: true, message: '请选择是否分店', trigger: 'change' },
	],
	'storeVO.shopkeeperNo': [
		{ required: true, message: '请输入分店管理员卡号', trigger: 'blur' },
	],
	'storeVO.shopkeeperName': [
		{ required: true, message: '请输入分店管理员姓名', trigger: 'blur' },
	],
	'storeVO.ucongNo': [
		{ pattern: /^\d{7}$/, message: '仅可输入7位数字', trigger: 'blur' },
	],
	'storeVO.extraInfo.unContactReason': [
		{ min: 1, max: 100, message: '支持输入1~100字符', trigger: 'blur' },
	],
	'storeVO.ratifyDate': [
		{ required: true, message: '请选择批准时间', trigger: 'blur' },
	],
	'storeVO.extraInfo.phone1': [
		{min: 1, max: 20, message: '支持输入1~20位字符', trigger: 'blur'},
	],
	'storeVO.extraInfo.phone2': [
		{min: 1, max: 20, message: '支持输入1~20位字符', trigger: 'blur'},
	],
	'storeVO.phone': [
		{pattern: /^1(3|4|5|6|7|8)\d{9}$/, message: '请输入正确手机号', trigger: 'blur'},
	],
	'storeVO.zipCode': [
		{ pattern: /^\d{6}$/, message: '支持输入6位数字字符', trigger: 'blur' },
	],
	'storeVO.fax': [
		{ min: 1, max: 20, message: '支持输入1~20位字符', trigger: 'blur' },
	],
	'storeVO.wechat': [
		{ min: 6, max: 20, message: '支持输入6~20字符', trigger: 'blur' },
	],
	// 'storeVO.receiveGoodsSite': [
	// 	{ required: false, message: '请选择收货地址', trigger: 'blur' },
	// ],
	'storeVO.deliveryInfo.address': [
		// { required: true, message: '请输入收货地址', trigger: 'blur' },
		{ min: 1, max: 50, message: '支持输入1~50字符', trigger: 'blur' },
	],
	'storeVO.addressInfo.detailAddress': [
		{ min: 1, max: 50, message: '支持输入1~50字符', trigger: 'blur' },
	],
	'storeVO.addressInfo.contactAddress': [
		{ min: 1, max: 50, message: '支持输入1~50字符', trigger: 'blur' },
	],
	'storeVO.deliveryInfo.person': [
		// { required: true, message: '请输入收货人', trigger: 'blur' },
		{ min: 1, max: 50, message: '支持输入1~50字符', trigger: 'blur' },
	],
	'storeVO.deliveryInfo.phoneNum': [
		{pattern: /^((1(3|4|5|6|7|8)\d{9})|(((\d{3,4})|\d{3,4}-|s)?\d{7,14}))$/, message: '请输入正确电话', trigger: 'blur'},
	],
	// 'storeVO.site': [
	// 	{ required: true, message: '请选择省市区', trigger: 'blur' },
	// ],
	'storeVO.deliveryInfo.detailAddress': [
		// { required: true, message: '请输入详细地址', trigger: 'blur' },
		{ min: 1, max: 50, message: '请输入1~50字符', trigger: 'blur' }
	],
	'storeVO.deliveryInfo.contactDetailAddress': [
		{ min: 1, max: 50, message: '请输入1~50字符', trigger: 'blur' }
	],
	'storeVO.extraInfo.legalInfo': [
		{ min: 1, max: 30, message: '支持输入1~30字符', trigger: 'blur' },
	],
	'storeVO.extraInfo.guaranteeCard1': [
		{ pattern: /^\d{1,30}$/, message: '支持输入1~30位数字', trigger: 'blur' },
	],
	'storeVO.extraInfo.guaranteeName1': [
		{ min: 1, max: 30, message: '支持输入1~30字符', trigger: 'blur' },
	],
	'storeVO.extraInfo.guaranteeCard2': [
		{ pattern: /^\d{1,30}$/, message: '支持输入1~30位数字', trigger: 'blur' },
	],
	'storeVO.extraInfo.guaranteeName2': [
		{ min: 1, max: 30, message: '支持输入1~30字符', trigger: 'blur' },
	],
	'storeVO.extraInfo.originalStore': [
		{ min: 1, max: 30, message: '支持输入1~30字符', trigger: 'blur' },
	],
	'storeVO.extraInfo.frozenReason': [
		{ min: 1, max: 100, message: '支持输入1~100字符', trigger: 'blur' },
	],
	'storeVO.remarks': [
		{ min: 1, max: 200, message: '支持输入1~200字符', trigger: 'blur' },
	],
	'storeVO.extraInfo.legalPerson': [
		// { required: true, message: '请输入法人姓名', trigger: 'blur' },
		{ min: 1, max: 20, message: '支持输入1~20字符', trigger: 'blur' },
	],
	// 证件
	'credentialVO1.info.certificateName': [
		{ min: 1, max: 40, message: '支持输入1~40字符', trigger: 'blur' },
	],
	'credentialVO1.info.certificateCode': [
		{ min: 1, max: 20, message: '支持输入1~20字符', trigger: 'blur' },
	],
	'credentialVO1.info.certificatePerson': [
		{ min: 1, max: 20, message: '支持输入1~20字符', trigger: 'blur' },
	],
	'credentialVO1.info.socialCreditCode': [
		{ min: 1, max: 20, message: '支持输入1~20字符', trigger: 'blur' },
	],
	'credentialVO1.info.operatorName': [
		{ min: 1, max: 20, message: '支持输入1~20字符', trigger: 'blur' },
	],
	'credentialVO1.info.identificationCode': [
		{ min: 1, max: 20, message: '支持输入1~20字符', trigger: 'blur' },
	],
	'credentialVO1.info.certificationAuthority': [
		{ min: 1, max: 20, message: '支持输入1~20字符', trigger: 'blur' },
	],
	'credentialVO1.info.businessScope': [
		{ min: 1, max: 200, message: '支持输入1~200字符', trigger: 'blur' },
	],
	'credentialVO1.info.businessPlace': [
		{ min: 1, max: 200, message: '支持输入1~200字符', trigger: 'blur' }
	],
	'credentialVO2.info.code': [
		{ min: 1, max: 20, message: '支持输入1~20字符', trigger: 'blur' },
	],
	'credentialVO2.info.certificationAuthority': [
		{ min: 1, max: 20, message: '支持输入1~20字符', trigger: 'blur' },
	],
	'credentialVO2.info.businessScope': [
		{ min: 1, max: 200, message: '支持输入1~200字符', trigger: 'blur' },
	],
	'credentialVO3.info.isFoodBusinessLicense': [
		// { min: 1, max: 20, message: '支持输入1~20字符', trigger: 'blur' },
	],
	'credentialVO3.info.certificationAuthority': [
		{ min: 1, max: 20, message: '支持输入1~20字符', trigger: 'blur' },
	],
	'credentialVO3.info.businessScope': [
		{ min: 1, max: 200, message: '支持输入1~200字符', trigger: 'blur' },
	],
}


// 新建服务中心字段
export const DataKey = {
	// 负责人
	addMemberLeaderAo:{
		certificatesEndDate: "",
		cardNo: '',
		certificatesPositive:"",
		certificatesReverse:"",
		certificatesNo: "",
		certificatesPositiveUrl: '',
		certificatesReverseUrl: '',
		certificatesStartDate: "",
		certificatesType: null,
		createTime: "",
		eatingHabbits: "",
		education: "",
		gender: null,
		homePhone: "",
		id: null,
		mobile:null,
		lecturerLevel: "",
		livePlace: "",
		nation: "",
		profession: [],
		realname: "",
		resourceCommitteeIdentity:"",
		shopId: null,
		spouseCardNo: "",
		spouseCertificatesNo: "",
		spouseCertificatesType: null,
		spouseEatingHabbits: "",
		spouseEducation: "",
		spouseGender: null,
		spouseLecturerLevel: "",
		spouseLivePlace: "",
		spouseMobile: "",
		spouseNation: "",
		spouseProfession: "",
		spouseRealname: "",
		spouseResourceCommitteeIdentity: null,
		spouseTrainingTimes: '',
		trainingTimes: '',
		updateTime: ""
	},
	// 服务中心
	storeVO:{
		city: "",
		code: "",
		companyCode: "",
		// email: "",
		// fax: "",
		isMainShop: null,
		// isServiceShop: 0,
		// isSignContract: 0,
		leaderNo: null,
		// level: 0,
		name: "",
		openDate: "",
		permission: [],
		// phone: "",
		province: "",
		ratifyDate: "",
		remarks: "",
		shopStatus: null,
		// shopType: 0,
		shopkeeperNo: null,
		storeId: null,
		zipCode: null,
		decorationInfo:{
			totalArea:'',
			businessArea:'',
			leaseTerm:'',
			monthlyRent:'',
			shopLength:'',
			businessFloorHeight:'',
			shopWidth:'',
			signLength:'',
			signWidth:'',
			propertyType:'',
			isSign:'',
			isLed:'',
		},
		//收货信息
		deliveryInfo:{
			person: '',
			phoneNum: '',
			address: '',
			receiptSeal: '',
		},
		//详细地址／联系地址
		addressInfo :{
			detailAddress: '',
			contactAddress: '',
		},
		extraInfo:{
			subShopName: '',
			unContactReason:'',
			phone1: '',
			email1: '',
			phone2: '',
			email2: '',
			legalPerson: '',
			legalInfo: '',
			originalStore: '',
			guaranteeName1: '',
			guaranteeCard1: '',
			guaranteeCenter1: '',
			isTransProvincial: '',
			guaranteeCard2:'',
			guaranteeName2:'',
			guaranteeCenter2:'',
			cancelTime: '',
			frozenTime: '',
			frozenReason: '',
		},
	},
	// 1营业执照
	credentialVO1:{
		certificateDate: "",
		credentialType: 1,
		expiryDate: "",
		picUrls: "",
		storeCode: "",
		info:{
			certificateName:'',
			certificateCode:'',
			certificatePerson:'',
			isFive:'',
			operatorName:'',
			operatorType:'',
			socialCreditCode:'',
			composition:'',
			identificationCode:'',
			certificationAuthority:'',
			businessPlace:'',
			isSale:'',
			businessScope:'',
			}
		},
		// 3税务登记证
	credentialVO2:{
		certificateDate: "",
		credentialType: 3,
		expiryDate: "",
		info: {
			picUrls: "",
			storeCode: "",
			code:'',
			certificationAuthority:'',
			businessScope:'',
			},
		},
		// 2食品经营许可证
	credentialVO3:{
		certificateDate: "",
		credentialType: 2,
		expiryDate: "",
		info: {
			picUrls: "",
			storeCode: "",
			isFoodBusinessLicense:"",
			licenseKey:"",
			certificationAuthority:"",
			businessScope:""
		},
	},
}

// 服务中心资料管理
export const SERVICE_CENTER_DATA_CONFIG = {
    form: [
        {
            label: '服务中心编号',
            key: 'storeCode',
            type: 'input',
						value: '',
						showForever: true,
            placeholder: '请输入服务中心编号',
        },
        {
            label: '负责人卡号',
            key: 'leaderCardNo',
            type: 'input',
            value: '',
						showForever: true,
            placeholder: '请输入负责人卡号',
        },
        {
            label: '经营地址',
            key: 'address',
            type: 'input',
            value: '',
						showForever: true,
            placeholder: '请输入经营地址关键字',
        },
        {
            label: '服务中心名称',
            key: 'name',
            type: 'input',
            value: '',
            placeholder: '请输入服务中心名称',
        },
        {
            label: '负责人姓名',
            key: 'leaderName',
            type: 'input',
            value: '',
            placeholder: '请输入负责人姓名',
        },
        {
            label: '分店管理员卡号',
            key: 'shopkeeperNo',
            type: 'input',
            value: '',
						showForever: true,
            placeholder: '请输入分店管理员卡号',
        },
        {
            label: '分店管理员姓名',
            key: 'shopkeeperName',
            type: 'input',
            value: '',
            placeholder: '请输入分店管理员姓名',
        },
        {
            label: '分公司',
            key: 'companyCode',
            type: 'select',
						value: '',
						bindKey: 'serviceCompanyOptions',
            placeholder: '请选择',
        },
        {
            label: '总分店',
            key: 'isMainShop',
            type: 'select',
            value: '',
            options: GENERALBRANCH,
            placeholder: '请选择',
        },
        {
            label: '网点类型',
            key: 'shopType',
            type: 'select',
						value: '',
						bindKey: 'shopTypeOptions',
            placeholder: '请选择',
				},
				// {
				// 	label: '管理员卡号',
				// 	key: 'shopkeeperNo',
				// 	type: 'input',
				// 	value: '',
				// 	placeholder: '请输入管理员卡号',
				// },
				// {
				// 		label: '管理员姓名',
				// 		key: 'shopkeeperName',
				// 		type: 'input',
				// 		value: '',
				// 		placeholder: '请输入管理员姓名',
				// },
        {
            label: '批准时间',
						key: 'ratifyDate',
						type: 'datePicker',
						value: [undefined, undefined],
						config: {
							type: 'daterange',
							rangeSeparator: '~',
							startPlaceholder: '开始日期',
							endPlaceholder: '结束日期'
						}
					},
        {
            label: '网点等级',
            key: 'level',
            type: 'select',
            value: '',
            options: optionGenerator(GRADE_OPTIONS),
            placeholder: '请选择',
        },
        {
            label: '签署合同',
            key: 'isSignContract',
            type: 'select',
            value: '',
            options:SIGNCONTRACT,
						placeholder: '请选择',
				},
        {
            label: '所在省份',
            key: 'regionCode',
						slotcontent: true,
            value: '',
            placeholder: '请选择',
        },
    ],
}

export const SERVICE_MANAGEMENT_COLUMNS =  [
	{
		prop: 'code',
		label: '服务中心编号',
		align: 'center',
		width: 100
	},
	{
		prop: 'name',
		label: '服务中心名称',
		align: 'center',
		width: 200,
		formatter: ({name, disqualified}) => {
			return name ? `
				<div class="${disqualified?'bg-red':''}">${name}</div>
			` : '';
		}
	},
	{
		prop: 'leaderCardNo',
		label: '负责人卡号',
		align: 'center',
		width: 100
	},
	{
		prop: 'leaderName',
		label: '负责人姓名',
		align: 'center',
		width: 100
	},
	{
		prop: 'shopkeeperNo',
		label: '管理员卡号',
		align: 'center',
		width: 100
	},
	{
		prop: 'shopkeeperName',
		label: '管理员姓名',
		align: 'center',
		width: 100
	},
	{
		prop: 'provinceName',
		label: '所在省份',
		align: 'center',
	},
	{
		prop: 'detailAddress',
		label: '经营地址',
		align: 'center',
		width: 270,
		formatter: ({provinceName,cityName,areaName,streetName,detailAddress}) => {
			return `
			${provinceName ? provinceName : ''} 
			${cityName ? cityName : ''} 
			${areaName ? areaName : ''} 
			${streetName ? streetName: ''} 
			${detailAddress ? detailAddress : ''}`;
		}
	},
	{
		prop: 'companyName',
		label: '所属分公司',
		align: 'center',
		width: 150
	},
	{
		prop: 'shopType',
		label: '网点类型',
		align: 'center',
		width: 160,
		formatter: ({shopType}) => {
			return NETWORK_TYPE[shopType];
		},
	},
]

// 确认变更内容列表
export const CHANGE_CONFIRM_LIST = [
	{ label: '负责人资料', value: 1, prop: 'editLeaderAo' },
	{ label: '服务中心资料', value: 2, prop: 'storeDataDto' },
	{ label: '证件资料', value: 3, prop: 'credentialList' },
	{ label: '店铺装修', value: 4, prop: 'storeDecorationDto' },
]
export const CHANGE_CONFIRM_NAME_TO_LABEL = {
	editLeaderAo: '负责人资料',
	storeDataDto: '服务中心资料',
	credentialList: '证件资料',
	storeDecorationDto: '店铺装修',
}
export const CHANGE_CONFIRM_NAME_TO_VALUE = {
	editLeaderAo: 1,
	storeDataDto: 2,
	credentialList: 3,
	storeDecorationDto: 4,
}

// 地址选择只有三联的城市集合(@todo 此处需要优化)
export const SPECIAL_CITY_CODE_COLLECTION = ['442000000000', '441900000000'];