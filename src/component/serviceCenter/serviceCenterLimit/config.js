// import { filters } from 'plugins/filters';

// 默认列表
// 获取公司的信息
export const SUBCOMPANY = [];

// 等级
export const LEVELLIST = {
	1: '普通服务中心',
	2: '五星服务中心',
	3: '五星旗舰服务中心',
};
// 是否总店
export const ISMAINDOT = [
	{
		label:'总店',
		value:1
	},
	{
		label:'分店',
		value:2
	},
]


// 网点类型
export const DOTTYPE = {};

//服务中心权限
export const SERVICEAUTHORITY = [
	{
		label:'可押货',
    value:1,
    tips: '勾选上表示允许服务中心进行押货下单'
	},
	{
		label:'可配送',
    value:2,
    tips: '勾选上表示顾客下单允许选择该服务中心自提'
	},
	{
		label:'自购下单',
    value:3,
    tips: '勾选上表示代客下单时可选择店主的卡号进行购物,但不允许选择公司交付'
	},
	{
		label:'可退货',
    value:4,
    tips: '勾选上表示允许服务中心发起押货退换货'
	},
	{
		label:'代客下单',
    value:5,
    tips: '勾选上表示该服务中心允许代客下单'
	},
	{
		label:'禁止登录',
    value:6,
    tips: '勾选上表示禁止当该服务中心的网点登录到服务中心系统,一般冻结时才会禁止登录'
	},
	{
		label:'取消资格',
    value:7,
    tips: '勾选上表示系统正式认为此服务中心正式结店，结店时必须勾选上'
	},
]



// 权限配置
export const SERVICE_CENTER_LIMIT_CONFIG ={
    form: [
        {
            label: '服务中心编号',
            key: 'storeCode',
            type: 'input',
            value: '',
            placeholder: '请输入服务中心编号',
            showForever: true,
        },
        {
            label: '服务中心名称',
            key: 'name',
            type: 'input',
            value: '',
            placeholder: '请输入服务中心名称',
            showForever: true,
		},
		{
            label: '负责人卡号',
            key: 'leaderCardNo',
            type: 'input',
            value: '',
            placeholder: '请输入负责人卡号',
            showForever: true,
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
            options:SUBCOMPANY,
            placeholder: '请选择分公司',
		},
		{
            label: '总分店',
            key: 'isMainShop',
            type: 'select',
            value: '',
            options:ISMAINDOT,
            placeholder: '请选择总分店',
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
            label: '省份',
            key: 'provinceCode',
            type: 'select',
            value: '',
            options:[],
            placeholder: '请选择省份',
        },
    ],
}


export const SERVICE_CENTER_LIMIT_COLUMS =  [
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
		prop: 'companyName',
		label: '所属分公司',
		align: 'center',
	},
	{
		prop: 'shopType',
		label: '网点类型',
		align: 'center',
		formatter: ({ shopType }) => {
			return shopType in DOTTYPE ? DOTTYPE[shopType] : '';
		}
	},
]


