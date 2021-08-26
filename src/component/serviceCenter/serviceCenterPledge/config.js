// import { filters } from 'plugins/filters';
import { addPrefixForAmount } from 'util/formValidation.js';
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
	0: '是',
	1: '否',
};

// 是否生效
export const TYPELIST = {
	1: '累计',
	2: '其他',
};

// 处理方式
export const PROCESSTYPE = {
	1: '按月'
};


// 押货退换货额度配置
export const SERVICE_CENTER_PLEDGELIST_CONFIG ={
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
            key: 'storeName',
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
            options:[],
            placeholder: '请选择分公司',
        },
    ],
}


export const SERVICE_CENTER_PLEDGELIST_COLUMS =  [
	{
		prop: 'storeCode',
		label: '服务中心编号',
		align: 'center',
	},
	{
		prop: 'storeName',
		label: '服务中心名称',
		align: 'center',
		width: 150
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
		width: 120
	},
	{
		prop: 'shopType',
		label: '网点类型',
		align: 'center',
		width: 180,
		formatter: ({ shopType }) => {
			return shopType in DOTTYPE ? DOTTYPE[shopType] : '';
		}
	},
	{
		prop: 'returnMaxAmount',
		label: '最大押货退货额度',
		align: 'center',
		width: 200,
		formatter: ({returnMaxAmount}) => {
			return addPrefixForAmount(returnMaxAmount);
		}
	},
	{
		prop: 'returnAvailableAmount',
		label: '剩余可用押货退货额度',
		align: 'center',
		width: 200,
		formatter: ({returnAvailableAmount}) => {
			return addPrefixForAmount(returnAvailableAmount);
		}
	},
	{
		prop: 'processType',
		label: '处理方式',
		align: 'center',
		formatter: ({ processType }) => {
			return processType in PROCESSTYPE ? PROCESSTYPE[processType] : '';
		}
	},
]
// 验证最大可押货退货额度（1~7位数字）
export const validReturnGoods = (rule, value, callback) => {
	let reg = /^([1-9]\d{1,6}|0)(\.\d{1,2})?$/;
	if(reg.test(value)){
		callback();
	}else{
		callback(new Error('请输入0~9999999.99之间的数值'));
	}
}
