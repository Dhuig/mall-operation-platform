import { filters } from 'plugins/filters';
import { optionGenerator } from 'util';
// 新建用户检验规则
export const CREATE_NEW_USER_RULES = {
	username: [
		{ required: true, message: '请输入用户账号', trigger: 'blur' },
		{ min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' },
	],
	// mobile: [
	// 	{ required: true, message: '请输入手机号码', trigger: 'blur' },
	// 	{ pattern: /^1[34578]\d{9}$/, message: '仅支持11位纯数字' }
	// ],
	status: [
		{ required: true, message: '请选择状态', trigger: 'change' }
	],
	operatorName: [
		{ required: true, message: '请输入姓名', trigger: 'blur' },
		{ min: 1, max: 20, message: '20个汉字内，支持字母（区分大小写）、数字及符号', trigger: 'blur' },
	],
	// operatorNo: [
	// 	{ required: true, message: '请输入工号', trigger: 'blur' },
	// 	{ min: 6, max: 10, message: '支持字符数量为6-10位，支持数字及字母', trigger: 'blur' },
	// ],
	companyCode: [
		{ required: true, message: '请选择组织', trigger: 'blur' },
	],
	operatorStatus: [
		{ required: true, message: '请选择状态', trigger: 'blur' },
	],
	// regionCode: [
	// 	{ required: true, message: '请选择区域', trigger: 'change' },
	// ],
	// password: [
	// 	{ required: true, message: '请输入密码', trigger: 'blur' },
	// 	{ min: 6, max: 12, message: '密码长度须为 6-12 位，可包含字母、数字和符号', trigger: 'blur' },
	// ],
	// confirmPassword: [
	// 	{ required: true, message: '请重复密码', trigger: 'blur' },
	// 	{ min: 6, max: 12, message: '密码长度须为 6-12 位，可包含字母、数字和符号', trigger: 'blur' },
	// ],
	roleIdList: [
		{ type: 'array',required: true, message: '请选择角色权限', trigger: 'change' },
	],
	// type: [
	// 	{ type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
	// ],
}

// 用户管理 启用状态
export const USER_MANAGEMENT_STATE = {
	'0': '启用',
	'1': '禁用',
}

// 用户管理 搜索配置
export const USER_MANAGEMENT_CONFIG = {
	form: [
		{
			label: '工号',
			key: 'operatorNo',
			type: 'input',
			value: '',
			placeholder: '请输入工号',
		},
		{
			label: '用户账号',
			key: 'username',
			type: 'input',
			value: '',
			placeholder: '请输入用户账号',
		},
		{
			label: '姓名',
			key: 'operatorName',
			type: 'input',
			value: '',
			placeholder: '请输入姓名',
		},
		{
			label: '手机号码',
			key: 'mobile',
			type: 'input',
			value: '',
			placeholder: '请输入手机号码',
		},
		{
			label: '电话',
			key: 'phone',
			type: 'input',
			value: '',
			placeholder: '请输入电话',
		},
		{
			label: '状态',
			key: 'operatorStatus',
			type: 'select',
			value: '',
			options: optionGenerator(USER_MANAGEMENT_STATE),
			placeholder: '',
		},
		{
			label: '角色名称',
			key: 'roleName',
			type: 'input',
			value: '',
			placeholder: '请输入角色名称',
		},
	],
}

// 用户管理 列定义
export const USER_MANAGEMENT_COLUMNS = [
	{
		prop: 'operatorNo',
		label: '工号',
		align: 'center',
	},
	{
		prop: 'username',
		label: '用户账号',
		align: 'center',
	},
	{
		prop: 'operatorName',
		label: '姓名',
		align: 'center',
		width: 100,
	},
	{
		prop: 'roleName',
		label: '角色名称',
		align: 'center',
		width: 120,
	},
	{
		prop: 'mobile',
		label: '手机号码',
		align: 'center',
		width: 120,
	},
	{
		prop: 'phone',
		label: '电话',
		align: 'center',
		width: 120,
	},
	{
		prop: 'updateTime',
		label: '创建时间',
		align: 'center',
		width: 250,
		formatter: ({ createTime }) => filters.timestampFormat(new Date(createTime).getTime())
	},
	{
		prop: 'creatorName',
		label: '创建人',
		align: 'center',
		width: 150,
	},
	{
		prop: 'operatorStatus',
		label: '状态',
		align: 'center',
		width: 100,
		formatter: ({ operatorStatus }) => {
			return operatorStatus in USER_MANAGEMENT_STATE ? USER_MANAGEMENT_STATE[operatorStatus] : '';
		}
	},
];
