import { optionGenerator, genCurrentMonthFirstAndLastDay } from 'util';
import { formatDate, formatDateDefault } from 'util/formValidation';
import { filters } from 'plugins/filters';

// 搬迁申请 -- 审批状态
export const MOVE_APPROVAL_STATUS_BQ = {
	'1': '审核通过',
	'2': '已驳回',
	'3': '待审核',
	'4': '已撤销',
	'5': '已完成',
	'7': '撤销待受理',
	'6': '完成待受理',
}

// 搬迁申请 -- 店铺类型
export const MOVE_APPROVAL_SHOPTYPE = {
	'1': '临街店铺',
	'2': '写字楼',
	'3': '商城店铺',
}
// 搬迁申请审批搜索配置
export const MOVE_APPROVAL_SEARCH = {
	form: [
		{
			label: '审批状态',
			key: 'verifyStatus',
			type: 'select',
			value: '',
			options: optionGenerator(MOVE_APPROVAL_STATUS_BQ),
			placeholder: '请选择审批状态',
		},
		{
			label: '分公司',
			key: 'companyName',
			type: 'select',
			value: '',
			bindKey: 'serviceCompanyOptions',
			options: [],
			placeholder: '请选择分公司',
			filterable:true
		},
		{
			label: '服务中心',
			key: 'storeCodeOrName',
			type: 'input',
			value: '',
			placeholder: '请填写服务中心编号或名称',
		},
		{
			label: '申请时间',
			key: 'registrationTime',
			type: 'datePicker',
			value: genCurrentMonthFirstAndLastDay(),
			config: {
				type: 'daterange',
			},
		},
	]
};
// 搬迁申请审批搜索表格列定义
export const MOVE_APPROVAL_COLUMNS = [
	{ label: '分公司名称', prop: 'companyName', align: 'center', width: 150 },
	{ label: '服务中心编号', prop: 'storeCode', align: 'center', width: 150 },
	{ label: '服务中心名称', prop: 'storeName', align: 'center', width: 150 },
	{ label: '新地址', prop: 'newShopAddr', align: 'center', width: 200, formatter: ({ newShopAddr, detailedAddr }) => newShopAddr + detailedAddr },
	{ label: '申请原因', prop: 'moveReason', align: 'center', width: 160 },
	{ label: '申请时间', align: 'center', width: 160, prop: 'createTime', formatter: ({ createTime }) => formatDate(createTime) },
	{
		label: '审批时间', align: 'center', width: 200, prop: 'approveTime', formatter: ({ approveTime }) => formatDate(approveTime) || '--'
	},
	{
		label: '审批状态',
		prop: 'auditStatus',
		align: 'center',
		formatter: ({ auditStatus }) => auditStatus in MOVE_APPROVAL_STATUS_BQ ? MOVE_APPROVAL_STATUS_BQ[auditStatus] : ''
	},
];

// 资料变更审批 -- 变更内容
export const DATA_CHANGE_APPROVAL_STATUS = {
	'0': '待审核',
	'1': '审核通过',
	'2': '已驳回',
}

// 资料变更审批 -- 审批状态
export const DATA_CHANGE_CONTENT = {
	'1': '负责人手机号变更',
	'2': '配偶手机号变更',
	'3': '服务中心电话变更',
	'4': '收货人变更',
	'5': '证件信息变更',
	'6': '银行账户新增',
	'7': '银行账户变更',
	'8': '银行账户删除',
	'9': '负责人联系地址变更',
	'10': '负责人微信号变更'
}
// 资料变更审批 -- 权限配置 其荣说后来简化了,又不用区分状态,先注释掉
// export const JURISDICTION_DATA = {
// 	1: 'data_change_list_detail_audit_phone_change',
// 	2: 'data_change_list_detail_audit_phone_spousse',
// 	3: 'data_change_list_detail_audit_phone_service',
// 	4: 'data_change_list_detail_audit_phone_consignee',
// 	5: 'data_change_list_detail_audit_certificates',
// 	6: 'data_change_list_detail_audit_bank_add',
// 	7: 'data_change_list_detail_audit_bank_update',
// 	8: 'data_change_list_detail_audit_bank_del',
// }

// 资料变更审批状态
export const DATA_CHANGE_SEARCH_STATUS = {
	'1': '审核通过',
	'2': '已驳回',
	'3': '待审核',
	// '4': '已取消',
}
// 资料变更审批搜索配置
export const DATA_CHANGE_SEARCH = {
	form: [
		{
			label: '审批状态',
			key: 'verifyStatus',
			type: 'select',
			value: '',
			options: [
				{ value: 1, label: '审核通过' },
				{ value: 2, label: '已驳回' },
				{ value: 3, label: '待审核' },
				// { value: 4, label: '已取消' },
			],
			placeholder: '请选择审批状态',
		},
		{
			label: '分公司',
			key: 'companyCode',
			type: 'select',
			value: '',
			bindKey:'serviceCompanyOptions',
			options: [],
			placeholder: '请选择分公司',
			filterable:true
		},
		{
			label: '变更内容',
			key: 'changeType',
			type: 'select',
			value: '',
			options: optionGenerator(DATA_CHANGE_CONTENT),
			placeholder: '请选择变更内容',
		},
		{
			label: '服务中心',
			key: 'storeName',
			type: 'input',
			value: '',
			placeholder: '请填写服务中心编号或名称',
		},
		{
			label: '申请时间',
			key: 'registrationTime',
			type: 'datePicker',
			value: genCurrentMonthFirstAndLastDay(),
			config: {
				type: 'daterange',
			},
		},
	]
};
// 资料变更 审批状态
export const DATA_CHANGE_STATUS = {
	1: '审核通过', 2: '已驳回', 3: '待审核',
	//  4: '已取消'
}
// 资料变更审批搜索表格列定义
export const DATA_CHANGE_COLUMNS = [
	{ label: '分公司', prop: 'companyName', align: 'center', width: 150 },
	{ label: '服务中心编号', prop: 'storeCode', align: 'center', width: 150 },
	{ label: '服务中心名称', prop: 'storeName', align: 'center' },
	{ label: '变更内容', prop: 'profileChangeType', align: 'center', formatter: ({ profileChangeType }) => DATA_CHANGE_CONTENT[profileChangeType] },
	{
		label: '审批状态',
		prop: 'verifyStatus',
		align: 'center',
		formatter: ({ verifyStatus }) => {
			return verifyStatus in DATA_CHANGE_SEARCH_STATUS ? DATA_CHANGE_SEARCH_STATUS[verifyStatus] : '';
		}
	},
	{ label: '申请时间', align: 'center', width: 200, prop: 'createTime', formatter: ({ createTime }) => formatDate(createTime) },
];

export const ENDING_BUSSINESS_MOVE_SEARCH = {
	1: '待审核',
	2: '审核通过',
	3: '已驳回',
	4: '已结业',
	5: '已撤销',
	7: '撤销待受理',
	6: '完成待受理',
}
const PORT = {
	0:'',1:'APP',2:'前端'
}
export const RECORDING_COLUMNS = [
	{ label: '操作时间', prop: 'createTime', align: 'center', width: 150,formatter:({createTime})=>formatDate(createTime)},
	{
		label: '操作',
		align: 'center',
		formatter: ({ operatorEvent,port }) => PORT[port]?operatorEvent+`(${PORT[port]})`:operatorEvent
	},
	{ label: '备注原因', prop: 'reason', align: 'center',slot:'reason'},
	{ label: '操作人', prop: 'operator', align: 'center'},
]
// 结业原因
export const JIEYEYUANYING_SEARCH = {
	1: '选址困难',
	2: '无精力照看店铺',
	3: '收支不足以店内开支',
	4: '其他',
}
// 结业 旧系统处理方式
export const JIUXITONGCHULIFANGSHI_SEARCH = {
	1: '旧系统无库存',
	2: '自行处理',
	3: '退回分公司',
	4: '转店',
}
// 押货 处理方式
export const YAHUOCHULIFANGHIS_SEARCH = {
	1: '配送订单完成',
	2: '退回',
	3: '转店',
}// 未领取的税基售后 处理方式
export const WEICHULISHUIJISHOUHOU_SEARCH = {
	1: '完成水机顾客信息',
	2: '放弃处理',
	3: '无水机信息4',
	4: '转店',
}
// 结束营业审批搜索配置
export const ENDING_BUSSINESS_SEARCH = {
	form: [
		{
			label: '审批状态',
			key: 'verifyStatus',
			type: 'select',
			value: '',
			options: optionGenerator(ENDING_BUSSINESS_MOVE_SEARCH),
			placeholder: '请选择审批状态',
		},
		{
			label: '服务中心',
			key: 'storeCode',
			type: 'input',
			value: '',
			placeholder: '请输入服务中心编号',
		},
		{
			label: '分公司名称',
			key: 'companyName',
			type: 'select',
			value: '',
			options: [],
			bindKey: 'serviceCompanyOptions',
			placeholder: '请选择分公司名称',
			filterable:true
		},
	]
};

// 结束营业审批搜索表格列定义
export const ENDING_BUSSINESS_SEARCH_COLUMNS = [
	{ label: '分公司', prop: 'companyName', align: 'center', width: 150 },
	{ label: '服务中心编号', prop: 'storeCode', align: 'center', width: 150 },
	{ label: '服务中心名称', prop: 'storeName', align: 'center', width: 150 },
	{ label: '申请时间', align: 'center', width: 200, prop: 'createTime', },
	{
		label: '审批状态',
		prop: 'auditStatus',
		align: 'center',
		formatter: ({ auditStatus }) => {
			return auditStatus in ENDING_BUSSINESS_MOVE_SEARCH ? ENDING_BUSSINESS_MOVE_SEARCH[auditStatus] : '';
		}
	},
];

// 退款审批状态
export const REFUND_APPROVAL_STATUS = {
	'0': '待审核',
	'1': '审核通过',
	'2': '已驳回',
	'3': '已取消',
	'4': '已退款',
}

// 账户性质
export const ZHANGHUXINGZHI_STATUS = {
	'1': '一般帐户',
	'2': '专用帐户',
	'3': '临时账户',
	'4': '基本账户',
}

// 经营类型
export const JINGYINGLEIXING_STATUS = {
	'1': '个体工商户',
	'2': '个体独资企业',
	'3': '家庭经营',
	'4': '普通合伙企业',
	'5': '有限责任公司',
	'6': '集体所有制',
	'7': '非公司私营企业',
}

// 同意 文案显示
export const TONGYIWENAN_STATUS = {
	'4': '确认后将更新服务中心收货地址',
	'6': '确认后将新增服务中心银行账户',
	'5': '确认后将更新服务中心证件信息',
}

// 组成形式
export const ZUCHENGXINGSHI_STATUS = {
	'1': '个人经营',
	'2': '家庭经营',
}

// 退款审批搜索配置
export const REFUND_SEARCH = {
	form: [
		{
			label: '审批状态',
			key: 'verifyStatus',
			type: 'select',
			value: '',
			options: optionGenerator(REFUND_APPROVAL_STATUS),
			placeholder: '请选择审批状态',
		},
		{
			label: '分公司',
			key: 'companyCode',
			type: 'select',
			value: '',
			options: [],
			bindKey: 'serviceCompanyOptions',
			placeholder: '请选择分公司',
			filterable:true
		},
		{
			label: '服务中心',
			key: 'storeCenter',
			type: 'input',
			value: '',
			placeholder: '请填写服务中心编号或名称',
		},
		{
			label: '申请时间',
			key: 'applTime',
			type: 'datePicker',
			value: genCurrentMonthFirstAndLastDay(),
			config: {
				type: 'daterange',
			},
		},
	]
};

// 退款类型
export const CAOZUO_TYPE = {
	'审批同意': 1,
	'驳回意见': 2,
	'汇款失败': 3,
	'汇款成功': 4,
}
// 退款类型
export const REFUND_TYPE = {
	1: '已汇押货款退款', 2: '汇错账户退款'
}

// 退款审批表格列定义
export const REFUND_COLUMNS = [
	{ label: '分公司名称', prop: 'companyName', align: 'center', width: 150 },
	{ label: '服务中心编号', prop: 'storeCode', align: 'center', width: 150 },
	{ label: '服务中心名称', prop: 'storeName', align: 'center', width: 150 },
	{
		label: '申请时间',
		align: 'center',
		width: 200,
		prop: 'applyTime',
		formatter: ({ applyTime }) => filters.timestampFormat(applyTime)
	},
	{
		label: '退款类型',
		prop: 'refundType',
		align: 'center',
		formatter: ({ refundType }) => {
			return refundType in REFUND_TYPE ? REFUND_TYPE[refundType] : '';
		}
	},
	{ label: '退款原因', prop: 'refundReason', align: 'center', width: 200 },
	{ label: '退款额(元)', prop: 'refundAmount', align: 'center', width: 200 },
	{
		label: '审批状态',
		prop: 'verifyStatus',
		align: 'center',
		formatter: ({ verifyStatus }) => {
			return verifyStatus in REFUND_APPROVAL_STATUS ? REFUND_APPROVAL_STATUS[verifyStatus] : '';
		}
	}
];

// 公司证件报告审批 状态
export const COMPANY_CERTIFICATE_MAP = {
	'0': '待审核',
	'1': '审核通过',
	'2': '已驳回',
}

// 公司证件报告审批 搜索定义
export const COMPANY_CERTIFICATE_SEARCH = {
	form: [
		{
			label: '审批状态',
			key: 'auditStatus',
			type: 'select',
			value: '',
			options: optionGenerator(COMPANY_CERTIFICATE_MAP),
			placeholder: '请选择审批状态',
    },
    {
      label: '分公司',
      key: 'companyCode',
      bindKey: 'serviceCompanyOptions',
      placeholder: '请选择分公司',
      type: 'select',
      value: '',
			filterable:true
    },
    {
      label: '服务中心',
      key: 'storeStr',
      type: 'input',
      value: '',
      placeholder: '请填写服务中心编号或名称',
    },
    {
      label: '申请原因',
      key: 'applyReason',
      type: 'input',
      value: '',
      placeholder: '请填写申请原因，如批量导入',
    },
		{
			label: '申请时间',
			key: 'registrationTime',
			type: 'datePicker',
			value: genCurrentMonthFirstAndLastDay(),
			config: {
				type: 'daterange',
			},
		}
	]
};

export const COMPANY_APPROVAL_DETAIL_STATUS = {
	0: '待审核',
	1: '审核通过',
	2: '已驳回',
}

export const COMPANY_CERTIFICATE_COLUMNS_DETAIL = [
	{ label: '证件类型', prop: 'certificateType', align: 'center' },
	{ label: '所属公司', prop: 'companyName', align: 'center' },
	{ label: '证件有效期', prop: 'validTime', align: 'center' },
	{ label: '备注', prop: 'remarks', align: 'center' },
];
// 公司证件报告审批 表格列定义
export const COMPANY_CERTIFICATE_COLUMNS = [
  { label: '分公司', prop: 'companyName', align: 'center', width: 150 },
	{ label: '服务中心编号', prop: 'storeCode', align: 'center', width: 150 },
	{ label: '服务中心名称', prop: 'storeName', align: 'center', width: 150 },
	{ label: '申请时间', prop: 'applyTime', align: 'center', width: 160 },
	{ label: '申请原因', prop: 'applyReason', align: 'center', width: 200 },
	// { label: '下载有效期', prop: 'downloadDeadline', align: 'center', width: 140, formatter: ({ downloadDeadline }) => downloadDeadline || '--' },
	{ label: '审批状态', prop: 'auditStatusStr', align: 'center' },
  { label: '审批意见', prop: 'auditOpinion', align: 'center', formatter: ({ auditOpinion }) => auditOpinion || '--' },
  { label: '下载有效期', prop: 'downloadDeadline', align: 'center', width: 140  },
];
// 公司证件报告审批批量导入 表格列定义
export const COMPANY_CERTIFICATE_IMPORT_COLUMNS = [
	{ label: '证件类型', prop: 'certiTypeName', align: 'center' },
	{ label: '所属公司', prop: 'companyName', align: 'center' },
	{ label: '证件有效期', prop: 'validTime', align: 'center', formatter: ({ validTime }) => formatDateDefault(validTime) || '--' },
	{ label: '备注', prop: 'remarks', align: 'center' },
];

// 公司证件报告审批批量导入 表格列定义
export const COMPANY_CERTIFICATE_IMPORT_COLUMNS_DAORU = [
	{ label: '服务中心编号', prop: 'storeCode', align: 'center' },
	{ label: '下载有效期', prop: 'downloadDeadline', align: 'center' }
]
// 查询公司证件报告审批批量导入

export const COMPANY_CERTIFICATE_IMPORT_CONFIG = {
	form: [
		{
			label: '',
			key: 'companyName',
			type: 'input',
			value: '',
			placeholder: '所属公司',
		},
		{
			label: '',
			key: 'certiTypeId',
			type: 'select',
			value: '',
			options: [],
			placeholder: '证件类型',
		},
	]
}

// 其他申请 状态
export const QITASHENGQING_STATUS = {
	'1': '审核通过',
	'2': '已驳回',
	'3': '待审核',
}


// 押货单调整审批 状态
export const YAHUODANSHENPI_STATUS = {
	1: '待审核', 2: '审核通过', 3: '已驳回', 4: '已取消'
}
// 押货单调整审批 搜索定义
export const PLEDGE_ADJUST_SEARCH = {
	form: [
		{
			label: '审批状态',
			key: 'status',
			type: 'select',
			value: '',
			options: [
				{ value: 1, label: '待审核' },
				{ value: 2, label: '审核通过' },
				{ value: 3, label: '已驳回' },
				{ value: 4, label: '已取消' },
			],
			placeholder: '请选择审批状态',
		},
		{
			label: '分公司',
			key: 'companyCode',
			type: 'select',
			value: '',
			bindKey: 'serviceCompanyOptions',
			placeholder: '请选择分公司',
			filterable:true
		},
		{
			label: '申请时间',
			key: 'registrationTime',
			type: 'datePicker',
			value: genCurrentMonthFirstAndLastDay(),
			config: {
				type: 'daterange',
			},
		},
		{
			label: '服务中心',
			key: 'storeCode',
			type: 'input',
			value: '',
			placeholder: '请填写服务中心编号或名称',
		}
	]
};

// 押货单调整申请 表格列定义
export const PLEDGE_ADJUST_COLUMNS = [
	{ label: '分公司名称', prop: 'companyName', align: 'center', width: 120 },
	{ label: '服务中心编号', prop: 'storeCode', align: 'center', width: 120 },
	{ label: '服务中心名称', prop: 'storeName', align: 'center', width: 180 },
	{ label: '申请原因', prop: 'reason', align: 'center', width: 160 },
	{ label: '修改押货单号', prop: 'orderSn', align: 'center', width: 200 },
	{ label: '修改说明', prop: 'remarks', align: 'center', width: 200 },
	{ label: '审批状态', prop: 'status', align: 'center', formatter: ({ status }) => YAHUODANSHENPI_STATUS[status] },
	{ label: '审批说明', prop: 'auditRemarks', align: 'center', width: 200 },
	{ label: '申请时间', prop: 'createTime', align: 'center', width: 160, formatter: ({ createTime }) => formatDate(createTime) },
];
// 其它审批 搜索定义
export const OTHER_APPROVAL_SEARCH = {
	form: [
		{
			label: '审批状态',
			key: 'auditStatus',
			type: 'select',
			value: '',
			options: [
				{ value: 1, label: '审核通过' },
				{ value: 2, label: '已驳回' },
				{ value: 3, label: '待审核' },
			],
			placeholder: '请选择审批状态',
		},
		{
			label: '分公司',
			key: 'companyName',
			type: 'select',
			value: '',
			bindKey: 'serviceCompanyOptions',
			options: [],
			placeholder: '请选择分公司',
			filterable:true
		},
		{
			label: '服务中心',
			key: 'storeCode',
			type: 'input',
			value: '',
			placeholder: '请填写服务中心编号',
		},
		{
			label: '申请时间',
			key: 'registrationTime',
			type: 'datePicker',
			value: genCurrentMonthFirstAndLastDay(),
			config: {
				type: 'daterange',
			},
		},
	]
};

// 其它审批 搜索状态
export const OTHER_APPROVAL_COLUMNS_STATUS = {
	1: '审核通过',
	2: '已驳回',
	3: '待审核'
}
// 其它审批 表格列定义
export const OTHER_APPROVAL_COLUMNS = [
	{ label: '分公司名称', prop: 'companyName', align: 'center', width: 150 },
	{ label: '服务中心编号', prop: 'storeCode', align: 'center', width: 150 },
	{ label: '服务中心名称', prop: 'storeName', align: 'center', width: 150 },
	{ label: '申请原因', prop: 'applyReason', align: 'center', width: 200 },
	{
		label: '申请时间',
		prop: 'createTime',
		align: 'center',
		width: 150
	},
	{
		label: '审批状态',
		prop: 'auditStatus',
		align: 'center',
		formatter: ({ auditStatus }) => {
			return auditStatus in OTHER_APPROVAL_COLUMNS_STATUS ? OTHER_APPROVAL_COLUMNS_STATUS[auditStatus] : '';
		}
	},
	{ label: '审批意见', prop: 'auditOpinion', align: 'center', width: 200 },
];



// 成品报告审批搜索配置 status
export const PRODUCT_RERORT_STATUS = {
	3: '待审核', 1: '审核通过', 2: '已驳回'
}

// 成品报告审批搜索配置 list status
export const PRODUCT_RERORT_LIST_STATUS = {
	3: '待审核', 1: '审核通过', 2: '已驳回', 4: '审核通过'
}

// 成品报告审批搜索配置
export const PRODUCT_RERORT_SEARCH = {
	form: [
		{
			label: '审批状态',
			key: 'status',
			type: 'select',
			value: '',
			options: optionGenerator(PRODUCT_RERORT_STATUS),
			placeholder: '请选择审批状态',
		},
		{
			label: '分公司',
			key: 'companyCode',
			type: 'select',
			value: '',
			bindKey:'serviceCompanyOptions',
			placeholder: '请选择分公司',
			options:[],
			filterable:true
		},
		{
			label: '服务中心',
			key: 'codeOrName',
			type: 'input',
			value: '',
			placeholder: '请填写服务中心编号或名称',
		},
		{
			label: '申请时间',
			key: 'registrationTime',
			type: 'datePicker',
			value: genCurrentMonthFirstAndLastDay(),
			config: {
				type: 'daterange',
			},
		},
		{
			label: '申请原因',
			key: 'applyReason',
			type: 'input',
			value: '',
			placeholder: '请填写申请原因，如批量导入',
		},
	]
};

export const PRODUCT_RERORT_COLUMNS = [
	{ label: '分公司', prop: 'companyName', align: 'center', width: 150 },
	{ label: '服务中心编号', prop: 'storeCode', align: 'center', width: 150 },
	{ label: '服务中心名称', prop: 'storeName', align: 'center', width: 150 },
	{
		label: '申请时间',
		prop: 'applyTime',
		align: 'center',
		width: 150,
		formatter: ({ applyTime }) => formatDate(applyTime)
	},
	{ label: '申请原因', prop: 'applyReason', align: 'center', width: 140 },
	// {
	// 	label: '下载有效期', prop: 'validitDate', align: 'center', width: 100,
	// 	formatter: ({ validitDate }) => formatDateDefault(validitDate) || '--'
	// },
	{
		label: '审批状态',
		prop: 'status',
		align: 'center',
		formatter: ({ status }) => PRODUCT_RERORT_LIST_STATUS[status]
	},
	{
		label: '审批意见', prop: 'approveOpinion', align: 'center', width: 200,
		formatter: ({ approveOpinion }) => approveOpinion || '--'
	},
	{
		label: '下载有效期', prop: 'validitDate', align: 'center', width: 140,
		formatter: ({ validitDate }) => formatDate(validitDate,'day') || '--'
	},
];

