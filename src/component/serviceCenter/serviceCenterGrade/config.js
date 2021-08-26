import { formatDateDefault } from 'util/formValidation.js';
import { optionGenerator } from 'util';

// 默认列表
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
	{
		label:'待审核',
		value:3
	},
]

// 网点类型
export const ACCOUNTLIST = {
	1: '微店',
	2: '正式网店',
};

//网点等级
export const GRADE_OPTIONS = {
	1: '服务中心',
	2: '五星服务中心',
	3: '五星旗舰服务中心',
	4: '无实体店',
}
// 取消类型 @todo 2.3.1版 增加了4/5/6三项
export const CANCEL_TYPE_DATA = {
	1: '结点取消',
	2: '转让取消',
	3: '违规取消',
	4: '不达标取消',
	5: '冻结取消',
	6: '转云取消',
}

// 服务中心等级
export const SERVICE_CENTER_GRADE_CONFIG ={
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
				label: '服务中心星级',
				key: 'level',
				type: 'select',
				value: [],
				multiple: true,
				showForever: true,
				options: optionGenerator(GRADE_OPTIONS),
				placeholder: '请选择等级',
		},
		{
				label: '分公司',
				key: 'companyCode',
				type: 'select',
				value: '',
				filterable: true,
				showForever: true,
				options:[],
				bindKey: 'serviceCompanyOptions',
				placeholder: '请选择分公司',
		},
		{
				label: '负责人卡号',
				key: 'leaderNo',
				type: 'input',
				value: '',
				showForever: true,
				placeholder: '请输入负责人卡号',
		},
		{
				label: '网点类型',
				key: 'shopType',
				type: 'select',
				value: '',
				showForever: true,
				bindKey: 'shopTypeOptions',
				placeholder: '请选择网点类型',
		},
		{
				label: '省份',
				key: 'provinceCode',
				type: 'select',
				value: '',
				showForever: true,
				options:[],
				placeholder: '请选择省份',
		},
		{
				label: '年份',
				key: 'year',
				type: 'datePicker',
				value: '',
				config: {
					type: 'year',
					pickerOptions: {
						disabledDate(time) {
							return time.getTime() > Date.now();
						},
					},
					placeholder: '请选择年份',
				}
		},
		{
				label: '取消类型',
				key: 'cancelType',
				type: 'select',
				value: '',
				options: optionGenerator(CANCEL_TYPE_DATA),
				placeholder: '请选择取消类型',
		},
		{
				label: '是否取消',
				key: 'isCancel',
				type: 'select',
				value: '',
				options: [
					{ label: '是', value: 1 },
					{ label: '否', value: 0 },
				],
				placeholder: '请选择是否取消',
		},
	],
}

export const OPTYPE = {
	1: '新增',
	2: '修改',
	3: '作废',
};

export const SERVICE_CENTER_GRADE_COLUMS =  [
	{
		prop: 'year',
		label: '年份',
		align: 'center',
	},
	{
		prop: 'provinceName',
		label: '所在省份',
		align: 'center',
	},
	{
		prop: 'companyName',
		label: '分公司',
		align: 'center',
		width: 120,
	},
	{
		prop: 'storeCode',
		label: '服务中心编号',
		align: 'center',
		width: 100,
	},
	{
		prop: 'leaderName',
		label: '负责人姓名',
		align: 'center',
	},
	{
		prop: 'leaderNo',
		label: '负责人卡号',
		align: 'center',
		width: 120
	},
	{
		prop: 'spouseName',
		label: '配偶姓名',
		align: 'center',
	},
	{
		prop: 'shopType',
		label: '网点类型',
		align: 'center',
		formatter: ({ shopType }) => {
			return shopType in ACCOUNTLIST ? ACCOUNTLIST[shopType] : '';
		}
	},
	{
		prop: 'level',
		label: '服务中心星级',
		align: 'center',
		width: 120,
		formatter: ({level}) => {
			return level in GRADE_OPTIONS ? GRADE_OPTIONS[level] : '';
		}
	},
	{
		prop: 'isCancelName',
		label: '是否取消',
		align: 'center',
		width: 120,
	},
	{
		prop: 'cancelTypeName',
		label: '取消类型',
		align: 'center',
		width: 120,
	},
	{
		prop: 'opTime',
		label: '操作日期',
		align: 'center',
		width: 120,
		formatter: ({opTime}) => {
			return formatDateDefault(opTime);
		}
	},
	{
		prop: 'cancelTime',
		label: '取消日期',
		align: 'center',
		width: 120,
		formatter: ({cancelTime}) => {
			return formatDateDefault(cancelTime);
		}
	},
	{
		prop: 'storeName',
		label: '服务中心名称',
		align: 'center',
		width: 120,
	},
]

// 网点等级管理 修改信息rules
export const EDIT_FORM_RULES = {
	level: [{ required: true, message: '请选择网点等级', trigger: 'blur' }],
}

// 服务中心等级标识
const IS_CANCEL_TYPE = {
	1: '是',
	0: '否',
}
// 搜索栏 配置
export const SERVICE_CENTER_GRADE_IDENTIFICATION_SEARCH = {
	form: [
		{
			label: '服务中心编号',
			key: 'storeCode',
			type: 'input',
			value: '',
			placeholder: '请输入服务中心编号',
	},
	{
			label: '网点类型',
			key: 'shopType',
			type: 'select',
			value: '',
			bindKey: 'shopTypeOptions',
			placeholder: '请选择网点类型',
	},
	{
			label: '分公司',
			key: 'companyCode',
			type: 'select',
			value: '',
			filterable: true,
			options:[],
			placeholder: '请选择分公司',
	},
	{
			label: '负责人卡号',
			key: 'leaderNo',
			type: 'input',
			value: '',
			placeholder: '请输入负责人卡号',
	},
	{
			label: '省份',
			key: 'provinceCode',
			type: 'select',
			value: '',
			options:[],
			placeholder: '请选择省份',
	},
	{
			label: '是否取消',
			key: 'levelIsCancel',
			type: 'select',
			value: '',
			options: optionGenerator(IS_CANCEL_TYPE),
			placeholder: '请选择是否取消',
	},
	]
}
// 表格 配置
export const SERVICE_CENTER_GRADE_IDENTIFICATION_COLUMS = [
	{
		prop: 'provinceName',
		label: '所在省份',
		align: 'center',
	},
	{
		prop: 'companyCode',
		label: '分公司编号',
		align: 'center',
	},
	{
		prop: 'companyName',
		label: '分公司名称',
		align: 'center',
		width: 120,
	},
	{
		prop: 'storeCode',
		label: '服务中心编号',
		align: 'center',
		width: 100,
	},
	{
		prop: 'storeName',
		label: '服务中心名称',
		align: 'center',
		width: 100,
	},
	{
		prop: 'leaderName',
		label: '负责人姓名',
		align: 'center',
	},
	{
		prop: 'leaderNo',
		label: '负责人卡号',
		align: 'center',
		width: 120
	},
	{
		prop: 'spouseRealname',
		label: '配偶姓名',
		align: 'center',
	},
	{
		prop: 'shopTypeName',
		label: '网点类型',
		align: 'center',
	},
	{
		prop: 'levelIsCancel',
		label: '是否取消',
		align: 'center',
		formatter: ({levelIsCancel}) => {
			return levelIsCancel in IS_CANCEL_TYPE ? IS_CANCEL_TYPE[levelIsCancel] : '';
		}
	},
	{
		prop: 'levelResult',
		label: '星级标识',
		align: 'center',
	},
]

// 服务中心等级标识 详情
// 表格 配置
export const SERVICE_CENTER_GRADE_IDENTIFICATION_DETAIL_COLUMS = [
	{ prop: 'year', label: '年份', align: 'center' },
	{ prop: 'storeCode', label: '服务中心编号', align: 'center' },
	{ prop: 'realname', label: '负责人姓名', align: 'center' },
	{ prop: 'cardNo', label: '负责人卡号', align: 'center' },
	{ prop: 'shopTypeName', label: '网点类型', align: 'center' },
	{ prop: 'level', label: '服务中心星级', align: 'center',
		formatter: ({level}) => {
			return level in GRADE_OPTIONS ? GRADE_OPTIONS[level] : '';
		}
	},
	{ prop: 'cancelType', label: '取消类型', align: 'center',
		formatter: ({cancelType}) => {
			return cancelType in CANCEL_TYPE_DATA ? CANCEL_TYPE_DATA[cancelType] : '';
		}
	},
	{ prop: 'cancelTime', label: '取消日期', align: 'center',
		formatter: ({cancelTime}) => {
			return formatDateDefault(cancelTime);
		}
	},
	{ prop: 'levelResult', label: '星级标识', align: 'center' },
]