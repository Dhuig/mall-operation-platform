import { formatDate } from 'util/formValidation.js'
export const WARNING_TYPE = [
  { value: '0', label: '销售数量'},
  { value: '1', label: '销售PV'},
]

export const WARNING_GRANULARITY = {
  'Month':'每月'
}

export const DRLIVER_TYPE = [
  { value: 'all', label: '全部交付方式'},
]
// 0：代表全部，1：自购预警，2：交付预警
const WARNING_DIMENSION_TYPE = [
  { value: '0', label: '全部'},
  { value: '1', label: '购货预警'},
  { value: '2', label: '交付预警'},
]

export const WARNING_DIMENSION_WORD = {
  '0': '购货预警',
  '1': '交付预警'
}

// 搜索
export const WARNING_RULE_SERARCH_CONFIG = {
  form: [
    {
      label: '预警项目名称',       
      key: 'warningName',                
      type: 'input',          
      value: '',              
      placeholder: '请填写项目名称',
    },
    {
      label: '预警类型',
      key: 'warningType',
      type: 'select',
      value: '',
      placeholder: '请选择产品预警类型',
      options: WARNING_TYPE,
    },
    {
      label: '预警产品',       
      key: 'productCode',                
      type: 'input',          
      value: '',              
      placeholder: '请填写预警产品编号',
    },
    {
      label: '报单月份',
      key: 'placeMonthStr',
      type: 'datePicker',
      value: formatDate(new Date(), 'month'),
      config: {
          type: 'month',                  //month 月份类型
          valueFormat: 'yyyy-MM',
          pickerOptions: {
              disabledDate(time) {
                  return time.getTime() < 1609430400000 || time.getTime() > Date.now();
              },
          },
          placeholder: '请选择报单月份'
      },
    },
    {
      label: '交付方式',
      key: 'deliverType',
      type: 'select',
      value: '',
      placeholder: '请选择交付方式',
      options: DRLIVER_TYPE,
    },
    {
      label: '预警维度',
      key: 'warningDimension',
      type: 'select',
      value: '',
      placeholder: '请选择预警维度',
      options: WARNING_DIMENSION_TYPE,
    },
  ]
}

// 列表 
export const PRODUCT_CONTROL_COLUMS = [
	{
		prop: 'warningName',
    label: '项目名称',
		align: 'left',
    width: '330'
	},
	{
		prop: 'warningGranularity',
		label: '预警粒度',
		align: 'left',
    formatter: ({ warningGranularity }) => {
			return warningGranularity in WARNING_GRANULARITY ? WARNING_GRANULARITY[warningGranularity] : ''
		}
	},
	{
		prop: 'warningType',
		label: '预警类型',
		align: 'left',
    formatter: ({ warningType }) => {
			return WARNING_TYPE.find(({value})=> value==warningType)?.label
		}
	},
	{
		prop: 'warningProduct',
		label: '预警产品',
		align: 'left',
    formatter: ({ warningProduct, productCode }) => {
			return warningProduct == '0'? '所有产品': productCode
		}
	},
	{
		label: '预警规则',
    slot: 'warningRule',
		align: 'left',
    width: '220'
	},
	{
		label: '当前预警情况',
		align: 'left',
    slot: 'warningStatistic',
    width: '180'
	},
	{
		prop: 'deliverType',
		label: '交付方式',
		align: 'left',
    formatter: ({ deliverType }) => {
			return DRLIVER_TYPE.find(({value})=> value==deliverType)?.label
		}
	},

]