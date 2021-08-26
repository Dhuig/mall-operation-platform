import { addPrefixForAmount } from 'util/formValidation.js'
import {filters} from 'plugins/filters.js';
export const PAYMENT_CHANNEL_SEARCH = {
	form: [
		{
			label: '分公司编号',
			key: 'companyNo',
			type: 'select',
			value: '',
			filterable: true,
			placeholder: '请选择分公司编号',
			options: [],
		},
		{
			label: '交易日期',
			key: 'tradeDate',
			type: 'datePicker',
			value: '',
			config: {
				type: 'date',
				pickerOptions: {},
				placeholder: '请选择交易日期',
			},
		},
		{
      label: '支付渠道',
      key: 'channelCode',
      type: 'select',
      value: '',
			placeholder: '请选择支付渠道',
			options: [
				{
						value: '1',
						label: '工商银行'
				},
				{
						value: '2',
						label: '邮政储蓄银行'
				},
				{
						value: '3',
						label: '建设银行'
				},
				{
						value: '4',
						label: '银联'
				},
				{
						value: '5',
						label: '微信'
				},
				{
						value: '6',
						label: '支付宝'
				},
				{
						value: '7',
						label: '平安银行'
				},
				{
						value: '8',
						label: '交通银行'
				}
			],
		},
		{
      label: '平账状态',
      key: 'status',
      type: 'select',
      value: '',
			placeholder: '请选择平账状态',
			options: [
				{
					value: '1',
					label: '正常'
			},
				{
						value: '2',
						label: '异常'
				}
			],
		},
		{
			label: '会员卡号',
			key: 'cardNo',
			type: 'input',
			value: '',
			placeholder: '请输入会员卡号',
		},
		{
			label: '顾客编号',
			key: 'memberId',
			type: 'input',
			value: '',
			placeholder: '请输入顾客编号',
		},
	],
	rules: {
		'tradeDate': [{	required: true, message: '请选择交易日期',	trigger: "blur"	}],
	},
};


export const PAYMENT_CHANNEL_COLUMNS = [
	{
		label: '银行流水号',
		align: 'center',
		prop: 'bankSeq',
		width: 180,
	},
	{
		label: '分公司',
		align: 'center',
		prop: 'companyName',
	},
	{
		label: '顾客编号',
		align: 'center',
		prop: 'memberId',
	},
	{
		label: '会员卡号',
		align: 'center',
		prop: 'cardNo',
		width: 100,
	},
	{
		label: '交易流水',
		align: 'center',
		prop: 'tradeNo',
		width: 170,
	},
	{
		label: '交易时间',
		align: 'center',
		prop: 'tradeTime',
		width: 150,
		formatter: ({tradeTime}) => {
			return filters.timestampFormat(tradeTime);
		}
	},
	{
		label: '交易金额（元）',
		align: 'center',
		prop: 'amount',
		width: 120,
		formatter: ({amount}) => {
			return addPrefixForAmount(amount);
		}
	},
	{
		label: '支付渠道',
		align: 'center',
		prop: 'channelName',
		width: 100,
	},
	{
		label: '类型',
		align: 'center',
		prop: 'orderType',
	},
	{
		label: '平账状态',
		align: 'center',
		prop: 'statusName',
	},
];
