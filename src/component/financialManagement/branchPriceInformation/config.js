import { optionGenerator } from 'util'
import { addPrefixForAmount, formatDate} from 'util/formValidation.js'
import { filters } from 'plugins/filters';
export const PRODUCT_STATUS = {
    6: '待生效',
    7: '已上架',
    8: '已下架'
}
//
export const AUDIT_RESULT = {
    1: '审核通过',
    2: '审核不通过'
}
// 搜索项配置
export const BRANCH_PRICE_INFORMATION_SEARCH = {
    form: [
        {
            label: '产品编号',
            key: 'serialNo',
            type: 'input',
            value: '',
            placeholder: '请输入产品编号',
        },
        {
            label: '产品名称',
            key: 'title',
            type: 'input',
            value: '',
            placeholder: '请输入产品名称',
        },
        {
            label: '所属类别',
            key: 'priceCatalogId',
            type: 'select',
            value: '',
            options: [
                {
                    value: 0,
                    label: '请选择所属类别'
                },{
                    value: 1,
                    label: '食用油、酒、红枣胶原肽及类似产品'
                },{
                    value: 2,
                    label: '水机、电机'
                },{
                    value: 3,
                    label: '其他'
                },
            ],
            placeholder: '请选择所属类别',
        },
        {
            label: '零售价最小值',
            key: 'minRetailPrice',
            type: 'input',
            value: '',
            placeholder: '请输入价格',
        },
        {
            label: '零售价最大值',
            key: 'maxRetailPrice',
            type: 'input',
            value: '',
            placeholder: '请输入价格',
        },
        {
            label: '销售主体',
            key: 'saleCompanyId',
            type: 'select',
            placeholder: '请选择销售主体',
        },
        {
            label: '产权',
            key: 'propertyRights',
            type: 'input',
            value: '',
            placeholder: '请输入产权',
        },
        {
            label: '产品状态',
            key: 'productStatus',
            type: 'select',
            value: '',
            options: optionGenerator(PRODUCT_STATUS),
            placeholder: '请选择产品状态',
        },
        {
            label: '创建时间',
            key: 'timerange',
            type: 'datePicker',
            value: '',
            config: {
                type: 'daterange',              //daterange 日期范围类型
                rangeSeparator: '~',
                startPlaceholder: '开始日期',
                endPlaceholder: '结束日期'
            },
        },
    ]
}

// 产品价格信息 选项卡数组
export const COMPANY_PRICE_TABS_LIST = [
	['所有产品', 'all'],
	['待添加产品价格', 'tobeAdded'],
	['待审核价格', 'tobeAudit'],
	['已通过', 'passed'],
	['未通过', 'notPass'],
	['已撤回', 'withdraw'],
]
// 产品价格信息 状态字典
export const VERSION_STATUS_MAP = {
	all: '5',
	tobeAdded: "4",
	tobeAudit: "0",
	passed: "1",
	notPass: "2",
	withdraw: "3",
}
export const VERSION_STATUS_MAP_LABEL = {
	"5": "所有产品",
	"4": "待添加",
	"0": "待审核",
	"1": "已通过",
	"2": "未通过",
	"3": "已撤回",
}

// 信息列表页-表格配置
export const PRICE_CHECK_COLUMNS = [
    { prop: 'serialNo', label: '产品编码', align: 'center', width: 100 },
    { prop: 'title', label: '产品名称', align: 'center', width: 150, },
    { prop: 'priceCatalogTitle', label: '所属类别', align: 'center' },
    { prop: 'saleCompanyTitle', label: '销售主体', align: 'center' },
    { prop: 'propertyRights', label: '产权', align: 'center', width: 100, },
    { prop: 'productStatus', label: '产品状态', align: 'center',
        formatter: ({productStatus}) => {
            return productStatus ? PRODUCT_STATUS[productStatus] : '';
        }
    },
    { prop: 'retailPrice', label: '零售价', align: 'center', width: 120, 
        formatter: ({retailPrice}) => {
            return addPrefixForAmount(filters.rounding(retailPrice, 2));
        }
    },
    { prop: 'meterUnit', label: '计量单位', align: 'center', },
    { prop: 'packing', label: '包装规格', align: 'center', width: 120, },
    { prop: 'beijingCompanyPrice', label: '北京分公司', align: 'center', width: 120,
        formatter: ({beijingCompanyPrice}) => {
            return addPrefixForAmount(filters.rounding(beijingCompanyPrice, 2));
        }
    },
    { prop: 'otherCompanyPrice', label: '除北京外分公司', align: 'center', width: 120,
        formatter: ({otherCompanyPrice}) => {
            return addPrefixForAmount(filters.rounding(otherCompanyPrice, 2));
        }
    },
    { prop: 'secondCompanyPrice', label: '二级分公司', align: 'center', width: 120,
        formatter: ({secondCompanyPrice}) => {
            return addPrefixForAmount(filters.rounding(secondCompanyPrice, 2));
        }
    },
    { prop: 'status', label: '状态', align: 'center',
        formatter: ({status}) => {
            return status in VERSION_STATUS_MAP_LABEL ? VERSION_STATUS_MAP_LABEL[status] : '';
        }
    },
    { prop: 'createUser', label: '创建人', align: 'center', width: 100, },
    { prop: 'createTime', label: '创建时间', align: 'center', width: 150,
        formatter: ({createTime}) => {
            return formatDate(createTime);
        }
    },
    { prop: 'auditUser', label: '审核人', align: 'center', width: 100, },
    { prop: 'auditTime', label: '审核时间', align: 'center', width: 150,
        formatter: ({auditTime}) => {
            return formatDate(auditTime);
        }
    },
    { prop: 'remarks', label: '审核备注', align: 'center', width: 130, },
]
// 批量审核验证
export const COMPANY_PRICE_INFO_BATCH_AUDIT_RULES = {
    auditResult: [{ required: true, message: '请选择审核结果', trigger: 'blur' }],
    remarks: [{ required: true, message: '请输入备注说明', trigger: 'blur' }]
}

export const BRANCH_PRICE_DETAIL_SEARCH = {
    form: [
        {
            label: '产品编号',
            key: 'serialNo',
            type: 'input',
            value: '',
            placeholder: '请输入产品编号',
            disabled: true,
        },
        {
            label: '创建人',
            key: 'createUser',
            type: 'input',
            value: '',
            placeholder: '请输入创建人',
            disabled: true,
        },
        {
            label: '产品名称',
            key: 'title',
            type: 'input',
            value: '',
            placeholder: '请输入产品名称',
            disabled: true,
        },
        {
            label: '创建时间',
            key: 'createTime',
            type: 'input',
            value: '',
            placeholder: '请输入创建时间',
            disabled: true,
            format: (data) => {return formatDate(data) },
        },
        {
            label: '所属类别',
            key: 'priceCatalogTitle',
            type: 'select',
            value: '',
            placeholder: '所属类别',
            options: [
                {
                    value: '',
                    label: '请选择所属类别'
                },{
                    value: '',
                    label: '食用油、酒、红枣胶原肽及类似产品'
                },{
                    value: '',
                    label: '水机、电机'
                },{
                    value: '',
                    label: '其他'
                },
            ],
            disabled: true,
        },
        {
            label: '审核人',
            key: 'auditUser',
            type: 'input',
            value: '',
            placeholder: '请输入审核人',
            disabled: true,
        },
        {
            label: '产品零售价',
            key: 'retailPrice',
            type: 'input',
            value: '',
            placeholder: '请输入产品零售价',
            disabled: true,
            format: (data) => {return addPrefixForAmount(data) },
        },
        {
            label: '审核时间',
            key: 'auditTime',
            type: 'input',
            value: '',
            placeholder: '请输入审核时间',
            disabled: true,
            format: (data) => {return formatDate(data) },
        },
        {
            label: '北京分公司价格',
            key: 'beijingCompanyPrice',
            type: 'input',
            value: '',
            placeholder: '请输入价格',
            disabled: true,
            format: (data) => {return addPrefixForAmount(data) },
        },
        {
            label: '除北京外分公司价格',
            key: 'otherCompanyPrice',
            type: 'input',
            value: '',
            placeholder: '请输入价格',
            disabled: true,
            format: (data) => {return addPrefixForAmount(data) },
        },
        {
            label: '二级分公司',
            key: 'secondCompanyPrice',
            type: 'input',
            value: '',
            placeholder: '请输入价格',
            disabled: true,
            format: (data) => {return addPrefixForAmount(data) },
        },

    ]
}

export const BRANCH_PRICE_DETAIL_SEARCH_TIME = {
    form: [
        {
            label: '更新时间',
            key: 'updateTime',
            type: 'datePicker',
            value: '',
            config: {
                type: 'daterange',
                rangeSeparator: '~',
                startPlaceholder: '开始日期',
                endPlaceholder: '结束日期'
            }
        },
    ]
}

export const BRANCH_PRICE_DETAIL_LOGS = [
    { prop: 'updateTime', label: '更新时间', align: 'center',
        formatter: ({updateTime}) => {
            return formatDate(updateTime)
        }
    },
    { prop: 'priceCatalogTitle', label: '所属类别', align: 'center' },
    { prop: 'retailPrice', label: '产品零售价', align: 'center',
        formatter: ({retailPrice}) => {
            return addPrefixForAmount(retailPrice)
        }
    },
    { prop: 'beijingCompanyPrice', label: '北京分公司价格', align: 'center',
        formatter: ({beijingCompanyPrice}) => {
            return addPrefixForAmount(beijingCompanyPrice)
        }
    },
    { prop: 'otherCompanyPrice', label: '除北京外分公司', align: 'center',
        formatter: ({otherCompanyPrice}) => {
            return addPrefixForAmount(otherCompanyPrice)
        }
    },
    { prop: 'secondCompanyPrice', label: '二级分公司', align: 'center',
        formatter: ({secondCompanyPrice}) => {
            return addPrefixForAmount(secondCompanyPrice)
        }
    },
    { prop: 'createUser', label: '创建人', align: 'center' },
    { prop: 'result', label: '审核结果', align: 'center',
        formatter: ({result}) => {
            return result in AUDIT_RESULT ? AUDIT_RESULT[result] : '';
        }
    },
    { prop: 'auditUser', label: '审核人', align: 'center' },
    { prop: 'remarks', label: '备注说明', align: 'center' },
]
