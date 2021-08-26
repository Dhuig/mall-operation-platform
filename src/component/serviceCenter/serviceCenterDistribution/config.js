import { filters } from 'plugins/filters';

// 默认列表

// 等级
export const LEVELLIST = {
	1: '普通服务中心',
	2: '五星服务中心',
	3: '五星旗舰服务中心',
};
// 网点类型
export const DOTTYPE = {
	1: '微店',
	2: '否正式网店',
};

// 是否生效
export const ISEFFECTLIST = {
	0: '已生效',
	1: '待生效',
};

// 是否生效
export const TYPELIST = {
	1: '累计',
	2: '其他',
};

// 新建服务中心分配量
export const DataKey = {
	productName:'',
	packing:'',
	meterUnit:'',
	effectTime:'',
	maxNum:1,
	productCode:'',
	storeCode:'',
}

export const SERVICE_CENTER_DISTRIBUTION_CONFIG ={
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
            options:[
							{label: '广东分公司', value: '001006'},
							{label: '北京分公司', value: '003005'},
							{label: '湖北分公司', value: '002001'},
							{label: '广西分公司', value: '002002'},
						],
            placeholder: '请选择分公司',
        },
    ],
}

export const OPTYPE = {
	1: '新增',
	2: '修改',
	3: '作废',
};

export const SERVICE_CENTER_DISTRIBUTION_COLUMS =  [
	{
		prop: 'code',
		label: '服务中心编号',
		align: 'center',
	},
	{
		prop: 'name',
		label: '服务中心名称',
		align: 'center',
	},
	{
		prop: 'leaderCardNo',
		label: '负责人卡号',
		align: 'center',
	},
	{
		prop: 'leaderName',
		label: '负责人姓名',
		align: 'center',
	},
	{
		prop: 'level',
		label: '网点等级',
		align: 'center',
		formatter: ({ level }) => {
			return level in LEVELLIST ? LEVELLIST[level] : '';
		}
	},
]

// 分配量详情
export const SERVICE_CENTER_DISTRIBUTION_DETAIL_COLUMS =  [
	{
		prop: 'productCode',
		label: '产品代码',
		align: 'center',
	},
	{
		prop: 'productName',
		label: '产品名称',
		align: 'center',
		width: 150,
	},
	{
		prop: 'packing',
		label: '规格',
		align: 'center',
	},
	{
		prop: 'meterUnit',
		label: '单位',
		align: 'center',
	},
	{
		prop: 'maxNum',
		label: '最大可押货数量',
		align: 'center',
	},
	{
		prop: 'mortgageNum',
		label: '已用押货数量',
		align: 'center',
	},
	{
		prop: 'effectTime',
		label: '启用时间',
		align: 'center',
		width: 150,
		formatter: ({effectTime}) => {
			return filters.timestampFormat(effectTime);
		}
	},
	{
		prop: 'isEffect',
		label: '状态',
		align: 'center',
		formatter: ({ isEffect }) => {
			return isEffect in ISEFFECTLIST ? ISEFFECTLIST[isEffect] : '';
		}
	},
	{
		prop: 'type',
		label: '控制类型',
		align: 'center',
		formatter: ({ type }) => {
			return type in TYPELIST ? TYPELIST[type] : '';
		}
	},
]

// 验证不超过8位数的数字
export const limitMaxnum = (rule, value, callback) => {
	const len = String(value).length;
	if( len > 8 || len < 1){
		callback(new Error('请输入不超过8位数的数字'))
	}else{
		if(value < 0 || String(value).indexOf('.')>0){
			callback(new Error('请输入正整数'))
		}else{
			callback();	
		}
		
	}
}