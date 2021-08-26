import { genCurrentMonthFirstAndLastDay, dateRangePickerGenerator } from 'util';
// 服务单 搜索项
export const SERVICE_ORDER_SEARCH = {
  form: [
    {
			label: '申请时间',
			key: 'applicantTime',
			type: 'datePicker',
			value: genCurrentMonthFirstAndLastDay(),
			config: {
				type: 'daterange',
			},
		},
    {
			label: '服务单号',
			key: 'accOrderNo',
			type: 'input',
			value: '',
			placeholder: '请填写服务单号',
		},
    {
			label: '申请人手机',
			key: 'applicantMobile',
			type: 'input',
			value: '',
			placeholder: '请填写申请人手机',
		},
    {
			label: '服务人员卡号',
			key: 'cleanerCardNo',
			type: 'input',
			value: '',
			placeholder: '请填写服务人员卡号',
		},
    {
			label: '服务人员手机',
			key: 'cleanerMobile',
			type: 'input',
			value: '',
			placeholder: '请填写服务人员手机',
		},
    {
			label: '服务人员姓名',
			key: 'cleanerName',
			type: 'input',
			value: '',
			placeholder: '请填写服务人员姓名',
		},
    {
			label: '服务完成时间',
			key: 'serviceTime',
			type: 'datePicker',
			value: '',
			config: {
				type: 'daterange',
				pickerOptions: {
					shortcuts: [
						dateRangePickerGenerator('最近一周', 7),
						dateRangePickerGenerator('最近一个月', 30),
						dateRangePickerGenerator('最近三个月', 90),
						dateRangePickerGenerator('最近半年', 180),
						dateRangePickerGenerator('最近一年', 365),
					],
				}
			},
		},
    {
			label: '服务码',
			key: 'serviceNo',
			type: 'input',
			value: '',
			placeholder: '搜索服务码',
		},
  ]
}

// tab 切换配置
export const SERVICE_ORDER_TABS = [
  [ 'all', '全部服务单' ],
  [ 'tobeOrder', '待接单' ],
  [ 'tobeService', '待服务' ],
  [ 'completed', '已完成' ],
  [ 'cancelled', '已取消' ],
]
export const SERVICE_ORDER_TABS_VALUE = {
  'all': null,
  'tobeOrder': 0,
  'tobeService': 1,
  'completed': 2,
  'cancelled': -1,
}
export const SERVICE_ORDER_TABS_NAME = {
	'0': '待接单',
	'1': '待服务',
	'2': '已完成',
	'-1': '已取消',
}

// 列表项 配置
export const SERVICE_ORDER_COLUMNS = [
  { prop: 'accOrderNo', label: '服务单号', align: 'center', width: 180, },
  { prop: 'applicantMobile', label: '申请人手机', align: 'center', width: 100,},
  { prop: 'cleanerName', label: '服务人员', align: 'center' },
  { prop: 'cleanerCardNo', label: '服务人员卡号', align: 'center', width: 100, },
  { prop: 'cleanerMobile', label: '服务人员手机', align: 'center', width: 100, },
  { prop: 'accItemName', label: '服务项目', align: 'center', width: 120, },
  { prop: 'skuName', label: '服务规格', align: 'center' },
  { prop: 'serviceNum', label: '数量', align: 'center' },
  { prop: 'orderStatus', label: '服务状态', align: 'center',
		formatter: ({orderStatus}) => {
			return orderStatus in SERVICE_ORDER_TABS_NAME ? SERVICE_ORDER_TABS_NAME[orderStatus] : '';
		}
	},
  { prop: 'serviceNo', label: '服务码', align: 'center' },
  { prop: 'createTime', label: '申请时间', align: 'center', width: 150, },
  { prop: 'serviceTimeStart', label: '上门服务时间', align: 'center', width: 150, },
]

// 服务单详情
const OPERATE_TYPE = {
	'-1': '取消服务单',
	'0': '提交服务申请',
	'1': '接单',
	'2': '确认订单',
}
// 列表项 配置
export const SERVICE_ORDER_DETAIL_COLUMNS = [
  { prop: 'createTime', label: '操作时间', align: 'center' },
  { prop: 'operatorType', label: '操作内容', align: 'center',
		formatter: ({operatorType}) => {
			return operatorType in OPERATE_TYPE ? OPERATE_TYPE[operatorType] : '';
		}
	},
  { prop: 'operator', label: '操作人姓名', align: 'center' },
  { prop: 'operatorNo', label: '工号', align: 'center' },
  { prop: 'operatorCardNo', label: '会员卡号', align: 'center' },
  { prop: 'operatorMobile', label: '手机号', align: 'center' },
  { prop: 'remarks', label: '备注', align: 'center' },
]