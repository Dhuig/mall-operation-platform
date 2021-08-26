
// tablelist列表显示数字方法
const tableZeroShow = (number) => {
  return typeof number == 'number' ? String(number) : '';
}
// 搜索栏 配置
export const INVENTORY_STATEMENT_FORM_SEARCH_CONFIG = {
  form: [
    {
      label: '服务中心编号',
      key: 'shopCode',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号'
    },
    {                           //3. datePicker类型（此时可以配置config字段）
      label: '月份选择',
      key: 'snapshotMonth',
      type: 'datePicker',  
      value: '',
      config: {
          type: 'month',              //daterange 日期范围类型
          valueFormat: 'yyyy-MM',
          pickerOptions:{},              // 支持快捷键日期配置
          placeholder: '请选择月份'
      }
    },
  ],
  rules: {
    shopCode: [{ required: true, message: '请输入服务中心编号', trigger: 'blur' }],
    snapshotMonth: [{ required: true, message: '请选择月份', trigger: 'blur' }],
  }
}

// 列表表格 配置
export const INVENTORY_STATEMENT_FORM_COLUMNS_CONFIG = [
  { prop: 'shopCode' , label: '服务中心编号', align: 'center' },
  { prop: 'itemCodeSecond' , label: '产品编码', align: 'center' },
  { prop: 'title' , label: '产品名称', align: 'center' },
  { prop: 'meterUnit' , label: '单位', align: 'center' },
  { prop: 'lastBalance' , label: '上期结存', align: 'center' },
  { prop: 'mortgageCount' , label: '押货数量', align: 'center',
    formatter: ({mortgageCount}) => {
      return tableZeroShow(mortgageCount);
    }
  },
  { prop: 'mortgageReturnCount' , label: '押货退回', align: 'center',
    formatter: ({mortgageReturnCount}) => {
      return tableZeroShow(mortgageReturnCount);
    }
  },
  { prop: 'orderCount' , label: '配送数量', align: 'center',
    formatter: ({orderCount}) => {
      return tableZeroShow(orderCount);
    }
  },
  { prop: 'orderReturnCount' , label: '配送退回', align: 'center',
    formatter: ({orderReturnCount}) => {
      return tableZeroShow(orderReturnCount);
    }
  },
  { prop: 'adjustCount' , label: '库存调整', align: 'center',
    formatter: ({adjustCount}) => {
      return tableZeroShow(adjustCount);
    }
  },
  { prop: 'balance' , label: '本期结存', align: 'center' },
]