import { optionGenerator } from 'util';
import { formatDate } from 'util/formValidation.js';
const ROLE_STATUS = {
	'0': '启用',
	'1': '禁用',
}

// 角色管理列表
export const ROLE_MANAGEMENT_CONFIG = {
	form: [
		{
			label: '角色名称',
			key: 'roleName',
			type: 'input',
			value: '',
			placeholder: '请输入角色名称',
		},
		{
			label: '状态',
			key: 'roleStatus',
			type: 'select',
			value: '',
			options: optionGenerator(ROLE_STATUS),
			placeholder: '请选择状态'
		},
		{
			label: '创建时间',
			key: 'registrationTime',
			type: 'datePicker',
			value: [undefined, undefined],
      config: {
        type: 'daterange',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
      },
		},
	],
}

export const ROLE_MANAGEMENT_COLUMNS = [
	{
		prop: 'id',
		label: '角色编号',
		align: 'center',
		width: 180
	},
	{
		prop: 'roleName',
		label: '角色名称',
		align: 'center',
		width: 150,
	},
	{
		prop: 'remark',
		label: '描述',
		align: 'center',
		width: 150,
		formatter: ({ remark }) => {
			return remark && (remark.length < 20 ? remark : `${remark.substring(0, 20)}...`);
		}
	},
	{
		prop: 'creatorName',
		label: '创建人',
		align: 'center',
	},
	{
		prop: 'createTime',
		label: '创建时间',
		align: 'center',
		width: 250,
		formatter: ({ createTime }) => createTime ? formatDate(new Date(createTime).getTime()) : '',
	},
	{
		prop: 'roleStatus',
		label: '状态',
		align: 'center',
		width: 100,
		formatter: ({ roleStatus }) => {
			return roleStatus in ROLE_STATUS ? ROLE_STATUS[roleStatus] : '';
		},
	},
];

// 角色管理表单校验
export const ROLE_MANAGEMENT_FORM_RULES = {
	roleName: [{ required: true, message: '请输入角色名称,最多20个字符', max: 20, trigger: 'blur' }],
	roleStatus: [{ required: true, message: '请选择状态', trigger: 'change' }],
	systemId: [{ required: true, message: '请选择所属服务', trigger: 'change' }],
	list: [
		{
			type: 'array',
			required: true,
			message: '请选择权限, 请至少选择一项',
			trigger: 'blur',
		},
	],
};
