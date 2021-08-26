// 下单平台
const WARNING_DIMENSION_TYPE = [
  { value: '0', label: 'APP'},
  { value: '1', label: 'PC'},
  { value: '2', label: '小程序'},
]

export const ORDER_OVERVIEW_SEARCH = {
  form: [
    {
      label: '订单时间',
      key: 'createTime',
      type: 'datePicker',
      value: ['', ''],
      config: {
        type: 'daterange',
        valueFormat: 'yyyy-MM-dd'
      },
      placeholder: '请选择订单时间',
    },
    {
      label: '业绩月份',
      key: 'createTime',
      type: 'datePicker',
      value: ['', ''],
      config: {
        type: 'daterange',
        valueFormat: 'yyyy-MM-dd'
      },
      placeholder: '请选择业绩月份',
    },
    {
      label: '产品编码',       
      key: 'warningName',                
      type: 'input',          
      value: '',              
      placeholder: '请填写产品编码',
    },
    {
      label: '下单平台',
      key: 'warningDimension',
      type: 'select',
      value: '',
      placeholder: '请选择下单平台',
      options: WARNING_DIMENSION_TYPE,
    },
  ]
}