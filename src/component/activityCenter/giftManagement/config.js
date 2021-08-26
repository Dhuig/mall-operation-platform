import { formatDate } from "util/formValidation.js"
export const MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG = {
	form: [
		{
			label: '服务中心编号',
			key: 'storeCode',
			type: 'input',
			value: '',
			placeholder: '请输入服务中心编号',
		},
		{
			label: '获赠会员卡号',
			key: 'cardNo',
			type: 'input',
			value: '',
			placeholder: '请输入获赠会员卡号',
		},
		{
			label: '获赠月份',
			key: 'getTime',
			type: 'datePicker',
			value: [],
			config: {
				type: 'monthrange',
				rangeSeparator: '~',
				startPlaceholder: '开始月份',
				endPlaceholder: '结束月份'
			}
		},
	],
	buttonGroup: [
		{
			type: '',
			title: '重置',
			key: 'reset'
		},
		{
			type: 'primary',
			title: '搜索',
			key: 'search'
		}
	]
}
export const CHANGE_COLUMNS = [
	{ prop: 'createTime', label: '导入时间', align: 'center', width: 160, formatter: ({ createTime }) => formatDate(createTime) },
	{ prop: 'getTime', label: '获赠月份', align: 'center' },
	{ prop: 'periodTime', label: '有效期', align: 'center', width: 160 , formatter: ({ periodTime }) => formatDate(periodTime,'day')},
	{ prop: 'giftCode', label: '赠品编码', align: 'center' },
	{ prop: 'giftName', label: '赠品名称', align: 'center' },
	{ prop: 'storeCode', label: '服务中心编号', align: 'center', minwidth: 120 },
	{ prop: 'storeName', label: '服务中心名称', align: 'center', minwidth: 120 },
	{ prop: 'cardNo', label: '获赠会员卡号', align: 'center', width: 160 },
	{ prop: 'memberName', label: '会员名称', align: 'center', },
	{ prop: 'giftCount', label: '赠品数量', align: 'center', },
];

