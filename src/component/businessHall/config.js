import { filters } from '../../plugins/filters';
import { formatDate } from 'util/formValidation';
// 业务类型
export const BUSSINESS_TYPE = {
	'person_change_code': '更改个人资料',
	'inherit_cus_change_code': '继承变更-按顾客',
	'inherit_card_change_code': '继承变更-按卡号',
	'transfer_cus_change_code': '转让变更-按顾客',
	'transfer_card_change_code': '转让变更-按卡号',
	'add_spouse_msg_code': '补填配偶信息',
	'del_spouse_msg_code': '去除配偶信息',
	'self_spouse_exchange_code': '本人与配偶信息对调',
	'handled_change_code': '更改经办人',
	'card_number_change_code': '更改卡号',
	'month_back_card_code': '当月退卡',
	'logout_vip_code': '注销VIP资格',
	'reinstatement_code': '恢复资格',
	'freeze_purchase_qualification': '冻结购物资格',
	'unfreezing_purchase_qualification': '解冻购物资格',
}

// 业务办理详情页 -- 提交按钮 -- 权限映射表
export const BUSINESS_HALL_PERMISSION_MAP = {
	"person_change_code": 'businesshall_change_profile_submit',
	"card_number_change_code": 'businesshall_change_cardno_submit',
	"handled_change_code": 'businesshall_change_handled_submit',
	"month_back_card_code": 'businesshall_change_monthback_submit',
	"logout_vip_code": 'businesshall_change_logout_submit',
	"reinstatement_code": 'businesshall_change_reinstatement_submit',
	"purchase_qualification": 'businesshall_change_qualification_submit',
}

export const BUSINESS_EDITINFO_TYPE = [
	{ label: '更改个人资料', value: 'person_change_code' },
	{ label: '继承变更-按顾客', value: 'inherit_cus_change_code' },
	{ label: '继承变更-按卡号', value: 'inherit_card_change_code' },
	{ label: '转让变更-按顾客', value: 'transfer_cus_change_code' },
	{ label: '转让变更-按卡号', value: 'transfer_card_change_code' },
	{ label: '补填配偶信息', value: 'add_spouse_msg_code' },
	{ label: '去除配偶信息', value: 'del_spouse_msg_code' },
	{ label: '本人与配偶信息对调', value: 'self_spouse_exchange_code' },
]

export const BUSINESS_FREEZE_TYPE = [
	{ label: '冻结购物资格', value: 'freeze_purchase_qualification' },
	{ label: '解冻购物资格', value: 'unfreezing_purchase_qualification' },
]

// 业务列表 列定义
export const BUSINESS_LIST_COLUMNS = [
	{
		label: '流水号',
		align: 'center',
		prop: 'businessNo',
		width: 200
	},
	{
		label: '业务类型',
		align: 'center',
		prop: 'businessTypCode',
		width: 150,
		formatter: ({ businessTypCode }) => {
			return businessTypCode in BUSSINESS_TYPE ? BUSSINESS_TYPE[businessTypCode] : ''
		}
	},
	{
		label: '会员卡号',
		align: 'center',
		prop: 'cardNo',
		width: 180,
	},
	{
		label: '姓名',
		align: 'center',
		prop: 'realname',
		width: 150,
	},
	{
		label: '注册手机号',
		align: 'center',
		prop: 'mobile',
		width: 120,
	},
	{
		label: '证件号码',
		align: 'center',
		prop: 'certificatesNo',
		width: 180,
	},
	{
		label: '变更时间',
		align: 'center',
		prop: 'businessUpdateTime',
		width: 150,
		formatter: ({ businessUpdateTime }) => filters.timestampFormat(businessUpdateTime)
	},
	{
		label: '操作人',
		align: 'center',
		prop: 'businessUpdateName',
	},
	{
		label: 'OA工单',
		align: 'center',
		prop: 'oaNo',
	},
];

// 业务大厅详情输入框绑定
export const DETAIL_FORM = [
	{ label: '姓名', key: 'realname' },
	{ label: '身份证号', key: 'certificatesNo' },
	{ label: '性别', key: 'gender' },
	{ label: '注册手机号', key: 'mobile' },
	{ label: '当前级别', key: 'currentLevel' },
	{ label: '历史最高级别', key: 'highestLevel' },
	{ label: '办卡时间', key: 'openCardTime' },
	{ label: '开卡服务中心', key: 'storeCode' },
	{ label: '原经办人卡号', key: 'handledCardNo' },
	{ label: '原经办人姓名', key: 'handledName' },
	{ label: '购货冻结', key: 'isFreeze' },
	{ label: '购货冻结时间', key: 'freezeLimit' },
	{ label: '配偶姓名', key: 'spouseRealname' },
	{ label: '配偶手机号', key: 'spouseMobile' },
	{ label: '配偶身份证号', key: 'spouseCertificatesNo' },
	{ label: '卡状态', key: 'cardStatus' }
];

export const MEMBER_STATUS_YTPE = {
	'-3': '未开卡', '-2': '未激活', '-1': '待激活', 0: '有效', 1: '已失效', 2: '已注销'
}

export const BLACK_LIST_CONGIF = {
	form: [
		{
			label: '会员卡号',
			key: 'cardNo',
			type: 'input',
			value: '',
			placeholder: '请输入会员卡号',
		},
		{
			label: '提交日期',
			key: 'time',
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
			label: '状态',
			key: 'status',
			type: 'select',
			value: '',
			options: [
				{ label: '生效中', value: '1' },
				{ label: '已失效', value: '2' },
			],
			placeholder: '请选择状态',
    },
    {
      label: '证件号码',
      key: 'certificatesNo',
      type: 'input',
      value: '',
      placeholder: '请输入证件号码',
    },
    {
      label: '姓名',
      key: 'realname',
      type: 'input',
      value: '',
      placeholder: '请输入姓名',
    },
	],
}

export const BLACK_LIST_COLUMNS = [
	{
		prop: 'cardNo',
		label: '会员卡',
		align: 'center',
		width: 150,
	},
	{
		prop: 'certificatesNo',
		label: '证件号码',
		align: 'center',
		width: 150,
	},
	{
		prop: 'realname',
		label: '姓名',
		align: 'center',
	},
	{
		prop: 'commitDate',
		label: '提交时间',
		align: 'center',
		width: 100,
		formatter: ({ commitDate }) => formatDate(commitDate,'day'),
	},
	{
		prop: 'expireDate',
		label: '到期日期',
		align: 'center',
		width: 100,
		formatter: ({ expireDate }) => formatDate(expireDate,'day')
	},
	{
		prop: 'diffNum',
		label: '状态',
		align: 'center',
		formatter: ({ status }) => {
			return status && status == '1' ? '生效中' : '已失效'
		}
	},
]

export const BLACK_LIST_RULES = {
	// cardNo: [
	// 	{ required: true, message: '请输入会员卡号', trigger: 'blur' }
	// ],
	// certificatesType: [
	// 	{ required: true, message: '请选择证件类型', trigger: 'change' }
	// ],
	certificatesNo: [
		{ required: true, message: '请输入证件号码', trigger: 'blur' }
	],
	expireDate: [
		{ required: true, message: '请选择到期时间', trigger: 'change' }
	],
}

// 注销VIP 标题
export const LOGOUT_VIP_CODE_TITLE = {
	1: '回归', 2: '挂公司管理', 3: '紧缩'
}
