import { GRADE_OPTIONS } from '../../serviceCenter/serviceCenterGrade/config';
// 服务中心分配量 搜索
export const SERVICE_CENTRE_ALLOCATION_SEARCH = {
	form: [
		{
			label: '服务中心编号',
			key: 'storeCode',
			type: 'input',
			value: '',
			placeholder: '请输入服务中心编号',
		},
		{
			label: '服务中心名称',
			key: 'name',
			type: 'input',
			value: '',
			placeholder: '请输入服务中心名称',
		},
		{
			label: '负责人卡号',
			key: 'leaderCardNo',
			type: 'input',
			value: '',
			placeholder: '请输入负责人卡号',
		},
		{
			label: '负责人姓名',
			key: 'leaderName',
			type: 'input',
			value: '',
			placeholder: '请输入负责人姓名',
		},
		{
			label: '分公司',
			key: 'companyCode',
			type: 'select',
			value: '',
			bindKey: 'serviceCompanyOptions',
			placeholder: '请输入分公司',
		},
	]
};

// 网点类型
export const SHOP_TYPE = {
	"1": "微店",
	"2": "正式网店",
}

// 控制类型
export const CONTROL_TYPE = {
	"1": "累计"
}

// 服务中心分配量 列定义
export const SERVICE_CENTRE_ALLOCATION_COLUMNS = [
	{ prop: 'companyName', label: '所属分公司名称', align: 'center' },
	{ prop: 'code', label: '服务中心编号', align: 'center' },
	{ prop: 'name', label: '服务中心名称', align: 'center' },
	{ prop: 'leaderCardNo', label: '负责人卡号', align: 'center' },
	{ prop: 'leaderName', label: '负责人姓名', align: 'center' },
	{
		prop: 'level',
		label: '网点等级',
		align: 'center',
		formatter: ({ level }) => {
			return level in GRADE_OPTIONS ? GRADE_OPTIONS[level] : '';
		}
	},
	{ prop: 'cityName', label: '所在城市', align: 'center' },
	{
		prop: 'shopType',
		label: '网点类型',
		align: 'center',
		formatter: ({ shopType }) => {
			return shopType in SHOP_TYPE ? SHOP_TYPE[shopType] : '';
		}
	},
];
