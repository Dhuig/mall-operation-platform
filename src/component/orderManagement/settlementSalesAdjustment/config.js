import { mapToSelectOptions } from 'util';
import {formatDateStr} from '@/util/formValidation';
export function TABITEM() {
	this.loading = false;
	this.data = [];
	this.total = 0;
	this.tabTotal = 0;
	this.pagination = {
		pageNum: 1,
		pageSize: 10,
	}
}

// 权限状态 1：待生效 2：生效中 3：已失效 4：已撤销
const STATUS_TYPE_MAP = {
	1: '待生效' ,
	2: '生效中' ,
	3: '已失效' ,
	4: '已撤销'
}
// 调整类型 1：级别 2：级别+收入
const ADJUSTMENT_TYPE_MAP = {
	1: '级别' ,
	2: '级别+收入',
}

// 结算后销售调整 搜索栏配置
export const ADJUSTMENT_SERACH = {
	form: [
		{
			label: '云商会员卡号',
			key: 'storeCardNo',
			type: 'input',
			value: '',
			placeholder: '请输入云商会员卡号',
		},
    {
      label: '顾客会员卡号',
			key: 'customerCardNo',
			type: 'input',
			value: '',
			placeholder: '请输入顾客会员卡号',
    },
    {
			label: '调差月份',
			key: 'adjustmentDate',
			type: 'datePicker',
			value: [],
			config: {
				type: 'monthrange',
				rangeSeparator: '~',
				startPlaceholder: '开始月份',
				endPlaceholder: '结束月份',
				pickerOptions: {
					disabledDate: (time) => {
						return time.getTime() > new Date(new Date().toLocaleDateString()).getTime();
          }
				},
			},
		},
    {
			label: '调差时间',
			key: 'opTime',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期',
				pickerOptions: {},
			},
		},
		{
			label: '调整方式',
			key: 'adjustmentType',
			type: 'select',
			value: null,
			options: mapToSelectOptions(ADJUSTMENT_TYPE_MAP,'全部'),
			placeholder: '请选择调整方式',
			showForever: true
		},	
		{
			label: '权限状态',
			key: 'status',
			type: 'select',
			value: null,
			options: mapToSelectOptions(STATUS_TYPE_MAP,'全部'),
			placeholder: '请选择权限状态',
			showForever: true
		},
		{
			label: '操作人',
			key: 'creatorNo',
			type: 'input',
			value: '',
			placeholder: '请输入操作人',
		},
		{
			label: '操作时间',
			key: 'creatorTime',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期',
				pickerOptions: {
					disabledDate: (time) => {
            return time.getTime() > new Date(new Date().toLocaleDateString()).getTime();
          }
				},
			},
		},
	]
};

// 结算后销售调整 列表
export const ADJUSTMENT_COLUMNS = [
	{ label: '编号', align: 'center', width: 50,  formatter: (record, prop, index) => index + 1},
	{ prop: 'storeCardNo', label: '云商会员卡号', align: 'center', width:120 },
	{ prop: 'storeRealName', label: '云商姓名', align: 'center', width: 100 },
	{ prop: 'customerCardNo', label: '顾客会员卡号', align: 'center', width:120 },
	{ prop: 'customerRealName', label: '顾客姓名', align: 'center', width: 100 },
	{ prop: 'abnormalInfo', label: '顾客会员卡异常记录', align: 'center', width: 130 },
	{ prop: 'startTime', label: '调差开始时间', align: 'center', width:180, formatter: (({ startTime }) => formatDateStr(startTime))},
	{ prop: 'endTime', label: '调差结束时间', align: 'center', width:180, formatter: (({ endTime }) => formatDateStr(endTime))},
	{ prop: 'adjustmentDate', label: '调差月份', align: 'center', width: 100 },
	{ prop: 'source', label: '来源', align: 'center', width: 100 },
	{ prop: 'adjustmentName', label: '调整方式', align: 'center', width: 100},
	{ prop: 'orderStatusName', label: '是否已下单', align: 'center', width: 100},
	{ prop: 'orderNo', label: '已下单单号', align: 'center', width: 180},
	{ prop: 'creatorNo', label: '操作人', align: 'center', width: 120},
	{ prop: 'createTime', label: '操作时间', align: 'center', width: 180, formatter: (({ createTime }) => formatDateStr(createTime))},
	{ prop: 'statusName', label: '权限状态', align: 'center', width: 120},
];

export const ADJUSTMENT_RULES = {
	storeCardNo: [
		{ required: true, message: '请输入云商会员卡号', trigger: 'blur' },   
		{ min: 8, max: 10, message: '长度在 8 到 10 个数字', trigger: 'blur' }
	],
	customerCardNo: [
		{ required: true, message: '请输入顾客会员卡号', trigger: 'blur' },   
		{ min: 8, max: 10, message: '长度在 8 到 10 个数字', trigger: 'blur' }
	],
	adjustmentDate: [
		{ required: true, message: '请输入调差月份', trigger: 'change' },   
	],
	startTime: [
		{ required: true, message: '请输入调差开始时间', trigger: 'change' },   
	],
	endTime: [
		{ required: true, message: '请输入调差结束时间', trigger: 'change' },   
	],
	adjustmentType: [
		{ required: true, message: '请选择调差方式', trigger: 'change' },   
	]
}