export const GROUP_BUY_ORDER_STOCK_MANAGEMENT_SERACH = {
  col: 3,
  form: [
    {
      label: '分公司编号：',
      key: 'companyCode',
      type: 'input',
      value: '',
      placeholder: '请填写分公司编号',
      rules: [
        { min: 1, max: 20, message: '长度在 1 到 20 个字符' },
      ],
    },
    {
      label: '服务中心编号：',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请填写服务中心编号',
      rules: [
        { min: 1, max: 20, message: '长度在 1 到 20 个字符' },
      ],
    },
    {
      label: '产品编号：',
      key: 'productCode',
      type: 'input',
      value: '',
      placeholder: '请填写产品编号',
      rules: [
        { min: 1, max: 20, message: '长度在 1 到 20 个字符' },
      ],
    },
    {
      label: '团购订单编号：',
      key: 'orderNo',
      type: 'input',
      value: '',
      placeholder: '请填写团购订单编号',
      rules: [
        { min: 1, max: 20, message: '长度在 1 到 20 个字符' },
      ],
    },
    {
      label: '月份：',
      key: 'month',
      type: 'datePicker',
      value: [],
      config: {
        type: 'month',
        valueFormat: 'yyyyMM',
        pickerOptions: {}
      }
    },
  ]
}