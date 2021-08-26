import { formatDateDefault } from 'util/formValidation';
import { optionGenerator } from 'util';

// 公司证件管理-列表状态
export const CERTIFICATE_MANAGE_STATUS = {
	'0': '禁用',
	'1': '启用'
}

// 公司证件管理-搜索配置
export const CERTIFICATE_MANAGE_LIST_CONFIG = {
	form: [
		{
			label: '证件类型',
			key: 'certiTypeId',
			type: 'select',
			value: '',
			placeholder: '请选择证件类型',
			options: [],
		},
		{
			label: '所属公司',
			key: 'companyName',
			type: 'input',
			value: '',
			placeholder: '请选择所属公司',
		},
		{
			label: '状态',
			key: 'status',
			type: 'select',
			value: '',
			placeholder: '请选择状态',
			options: optionGenerator(CERTIFICATE_MANAGE_STATUS),
		},
		{
			label: '创建时间',
			key: 'registrationTime',
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
			label: '备注',
			key: 'remarks',
			type: 'input',
			value: '',
			placeholder: '请输入备注',
		},
	],

}

// 公司证件管理-表格配置
export const CERTIFICATE_MANAGE_LIST_COLUMNS = [
	{
		prop: 'certiTypeName',
		label: '证件类型',
		align: 'center'
	},
	{
		prop: 'companyName',
		label: '所属公司',
		align: 'center'
	},
	{
		prop: 'validTime',
		label: '有效期',
		align: 'center',
		formatter: ({ validTime }) => {
			return formatDateDefault(validTime);
		},
	},
	{
		prop: 'createTime',
		label: '创建时间',
		align: 'center',
		formatter: ({ createTime }) => {
			return formatDateDefault(createTime);
		},
	},
	{
		prop: 'remarks',
		label: '备注',
		align: 'center'
	},
	{
		prop: 'status',
		label: '状态',
		align: 'center',
		formatter: ({ status }) => {
			return status in CERTIFICATE_MANAGE_STATUS ? CERTIFICATE_MANAGE_STATUS[status] : '';
		}
	},
];

