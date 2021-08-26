import { formatDate } from 'util/formValidation.js'
import { optionGenerator } from 'util';
import { TEM_PAYMENT_TYPE, REPORT_TYPE, SEVEN_PAYMENT_TYPE } from '../../accountsManagement/serviceCentreAccounts/serviceCentreMortgageBalance/config'

// 获取上一月月头月尾
export const getLastMonth = () => {
	const date = new Date()
	const m = date.getMonth() + 1
	const y = date.getFullYear()
	// const d = date.getDate()
	const lastM = m > 1 ? m - 1 : 12
	const yOfLastM = lastM === 12 ? y - 1 : y
	const lastDayOfLastM = new Date(yOfLastM, lastM, 0).getDate()
	const addZero = n => n < 10 ? "0" + n : n
	return [
		`${yOfLastM}-${addZero(lastM)}-01`,
		`${yOfLastM}-${addZero(lastM)}-${addZero(lastDayOfLastM)}`,
	]
}
// tablelist列表显示数字方法
export const tableZeroShow = (number) => {
	return typeof number == 'number' ? String(number) : '';
}
// 验证input区间 正整数字
export const integerValidator = (rule, value, callback) => {
	const rep = /^-?([1-9]\d*|0)(\.\d+)?$/;
	if (value.every(item => (rep.test(item) || !item))) {
		callback();
	} else {
		callback(new Error('请输入数字'))
	}
}

export const PLEDGE_STATISTICAL_SEARCH_CONFIG = {
	form: [
		{                           //3. datePicker类型（此时可以配置config字段）
			label: '月份区间',
			key: 'monthrange',
			type: 'datePicker',
			value: [new Date(getLastMonth()[0]).getTime(), new Date(getLastMonth()[1]).getTime()],
			config: {
				type: 'monthrange',              //daterange 日期范围类型
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期',
				pickerOptions: {}              // 支持快捷键日期配置
			}
		},
		{
			label: '服务中心编号',
			key: 'storeNo',
			type: 'input',
			value: '',
			placeholder: '请输入服务中心编号',
		},
		{
			label: '所属分公司编号',
			key: 'companyCode',
			type: 'select',
			value: '',
			filterable: true,
			options: [],
			placeholder: '请选择所属分公司编号',
		},
		{
			label: '最大押货额',
			key: 'maxRemitAmount',
			type: 'inputrange',
			value: [],
			placeholder: '',
		},
		{
			label: '本期结余',
			key: 'closingBalance',
			type: 'inputrange',
			value: [],
			placeholder: '',
		},
	],
	rules: {
		'maxRemitAmount': [{ validator: integerValidator, trigger: 'blur', }],
		'closingBalance': [{ validator: integerValidator, trigger: 'blur', }],
	}
}
// 押货余额统计表-列表配置
export const PLEDGE_STATISTICAL_LIST_COLUMNS = [
	{ prop: 'month', label: '月份', align: 'center', headerConfig: { topTips: '1' } },
	{
		prop: 'storeNo', label: '服务中心编号', align: 'center', width: 100,
		headerConfig: { topTips: '2' }
	},
	{
		prop: 'companyCode', label: '所属分公司编号', align: 'center', width: 120,
		headerConfig: { topTips: '3' }
	},
	{
		prop: 'openingBalance', label: '上期结余', align: 'center', width: 120,
		headerConfig: { topTips: '4' },
		summary: true, sumConfig: { type: 'money' },
		formatter: ({ openingBalance }) => {
			return tableZeroShow(openingBalance);
		}
	},
	{
		prop: 'addRefundMortgage', label: '本期汇/退押货款', align: 'center', width: 120,
		headerConfig: { topTips: '5' },
		summary: true, sumConfig: { type: 'money' },
		formatter: ({ addRefundMortgage }) => {
			return tableZeroShow(addRefundMortgage);
		}
	},
	{
		prop: 'mallOrder2Mortgate', label: '本期配送返还', align: 'center', width: 120,
		headerConfig: { topTips: '6' },
		summary: true, sumConfig: { type: 'money' },
		formatter: ({ mallOrder2Mortgate }) => {
			return tableZeroShow(mallOrder2Mortgate);
		}
	},
	{
		prop: 'mallRefundReduceMortgate', label: '本期商城退货', align: 'center', width: 120,
		headerConfig: { topTips: '7' },
		summary: true, sumConfig: { type: 'money' },
		formatter: ({ mallRefundReduceMortgate }) => {
			return tableZeroShow(mallRefundReduceMortgate);
		}
	},
	{
		prop: 'mortgatePay', label: '本期押货使用', align: 'center', width: 120,
		headerConfig: { topTips: '8' },
		summary: true, sumConfig: { type: 'money' },
		formatter: ({ mortgatePay }) => {
			return tableZeroShow(mortgatePay);
		}
	},
	{
		prop: 'mortgateRefund', label: '本期押货退货', align: 'center', width: 120,
		headerConfig: { topTips: '9' },
		summary: true, sumConfig: { type: 'money' },
		formatter: ({ mortgateRefund }) => {
			return tableZeroShow(mortgateRefund);
		}
	},
	{
		prop: 'bizCreditAmount', label: '本期押货信誉额变化', align: 'center', width: 130,
		headerConfig: { topTips: '10' },
		summary: true, sumConfig: { type: 'money' },
		formatter: ({ bizCreditAmount }) => {
			return tableZeroShow(bizCreditAmount);
		}
	},
	{
		prop: 'adjustAmount', label: '本期调整金额', align: 'center', width: 120,
		headerConfig: { topTips: '11' },
		summary: true, sumConfig: { type: 'money' },
		formatter: ({ adjustAmount }) => {
			return tableZeroShow(adjustAmount);
		}
	},
	{
		prop: 'closingBalance', label: '本期结余', align: 'center', width: 180,
		headerConfig: { topTips: '12=4+5+6+7+8+9+10+11' },
		summary: true, sumConfig: { type: 'money' },
		formatter: ({ closingBalance }) => {
			return tableZeroShow(closingBalance);
		}
	},
	{
		prop: 'twoMonthAddRefundMont', label: '累计已汇押货款', align: 'center', width: 120,
		headerConfig: { topTips: '13' },
		summary: true, sumConfig: { type: 'money' },
		formatter: ({ twoMonthAddRefundMont }) => {
			return tableZeroShow(twoMonthAddRefundMont);
		}
	},
	{
		prop: 'maxRemitAmount', label: '最大押货额', align: 'center', width: 120,
		headerConfig: { topTips: '14' },
		summary: true, sumConfig: { type: 'money' },
		formatter: ({ maxRemitAmount }) => {
			return tableZeroShow(Number(maxRemitAmount));
		}
	},
	{
		prop: 'storeName', label: '服务中心名称', align: 'center', width: 100,
		headerConfig: { topTips: '15' },
	},
];

// 交易类型
export const TRANS_TYPE = {
	1: '汇押货款',
	2: '退押货款',
	3: '信誉额',
	12: '其他',
	13: '产品调价',
	14: '押货使用',
	15: '押货退货',
	16: '押货调整',
	17: '配送返还',
	18: '商城退货',

}
export const STATISTICAL_DETAIL_SEARCH_CONFIG = {
	form: [
		{                           //3. datePicker类型（此时可以配置config字段）
			label: '交易月份',
			key: 'monthrange',
			type: 'datePicker',
			value: '',
			config: {
				type: 'monthrange',              //daterange 日期范围类型
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期',
				pickerOptions: {}              // 支持快捷键日期配置
			}
		},
		{
			label: '报表字段',
			key: 'reportType',
			type: 'select',
			value: '',
			options: optionGenerator(REPORT_TYPE),
			placeholder: '请选择报表字段'
		},
		{
			label: '款项类型',
			key: 'sevenBankType',
			type: 'select',
			value: '',
			placeholder: '请选择款项类型',
			options: optionGenerator(SEVEN_PAYMENT_TYPE),
		},
		{
			label: '交易类型',
			key: 'tenType',
			type: 'select',
			value: '',
			options: optionGenerator(TEM_PAYMENT_TYPE),
			placeholder: '请选择交易类型'
		},
		{
			label: '单号或流水号',
			key: 'bizNo',
			type: 'input',
			value: '',
			placeholder: '请输入单号或流水号'
		},
	]
}
// 押货余额详情-列表配置
export const STATISTICAL_DETAIL_COLUMNS = [
	{ prop: 'tenType', label: '交易类型', align: 'center', 
		formatter: ({tenType}) => {
			return tenType in TEM_PAYMENT_TYPE ? TEM_PAYMENT_TYPE[tenType] : '';
		}
	},
	{ prop: 'sevenBankTypeName', label: '款项类型', align: 'center', },
	{ prop: 'diffMoney', label: '增减额度(元)', align: 'center',
		summary: true,
		formatter: ({ diffMoney }) => {
			return tableZeroShow(diffMoney);
		}
	},
	{ prop: 'businessId', label: '对应单号或流水号', align: 'center',
		formatter: ({businessId}) => {
			return businessId ? businessId : '无对应单号';
		}
	},
	{
		prop: 'createTime',
		label: '交易时间',
		align: 'center',
		formatter: ({createTime}) => {
			return formatDate(new Date(createTime).getTime());
		}
	}
]
