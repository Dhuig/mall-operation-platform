import { optionGenerator } from "util"
import { formatDate } from 'util/formValidation';
// 单据类型
const ORDER_TYPE = {
  1: '押货单',
  2: '押货退货单',
}
// 拆分及合并列表 搜索栏
export const SPLIT_COMBINATION_FORM_SEARCH_CONFIG = {
  form: [
    {
			label: '单据号',
			key: 'orderNo',
			type: 'input',
			value: '',
			placeholder: '请输入押货单号/押货退货单号',
		},
    {
			label: '单据类型',
			key: 'orderType',
			type: 'select',
			value: '',
			placeholder: '请选择单据类型',
      options: optionGenerator(ORDER_TYPE),
		},
    {
			label: '服务中心编号',
			key: 'storeCode',
			type: 'input',
			value: '',
			placeholder: '请输入服务中心编号',
		},
    {
			label: '分公司编号',
			key: 'companyCode',
			type: 'select',
			value: '',
      filterable: true,
			placeholder: '请选择分公司编号',
		},
    {
			label: '产品编码',
			key: 'productCode',
			type: 'input',
			value: '',
			placeholder: '请输入产品编码',
		},
    {                           //3. datePicker类型（此时可以配置config字段）
      label: '调整时间',
      key: 'daterange',
      type: 'datePicker',  
      value: '',
      config: {
          type: 'daterange',              //daterange 日期范围类型
          rangeSeparator: '~',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions:{}              // 支持快捷键日期配置
      }
    },
  ]
}
// 拆分及合并列表 列表
export const SPLIT_COMBINATION_FORM_COLUMNS_CONFIG = [
  { prop: 'orderNo', label: '单据号', align: 'center', width: 150, },
  { prop: 'orderType', label: '单据类型', align: 'center', 
    formatter: ({orderType}) => {
      return orderType in ORDER_TYPE ? ORDER_TYPE[orderType] : '';
    }
  },
  { prop: 'companyCode', label: '分公司编号', align: 'center', width: 100, },
  { prop: 'storeCode', label: '服务中心编号', align: 'center', width: 100,},
  { prop: 'productCode', label: '产品编码', align: 'center', },
  { prop: 'productName', label: '产品名称', align: 'center', width: 150, },
  { prop: 'adjustNum', label: '押货数量', align: 'center', 
    formatter: ({orderType, adjustNum}) => {
      return orderType == 1 ? Math.abs(adjustNum) : '';
    }
  },
  { prop: 'adjustNum', label: '发货数量', align: 'center', 
    formatter: ({orderType, adjustNum}) => {
      return orderType == 1 ? Math.abs(adjustNum) : '';
    }
  },
  { prop: 'adjustNum', label: '押货退货数量', align: 'center', width: 110, 
    formatter: ({orderType, adjustNum}) => {
      return orderType == 2 ? Math.abs(adjustNum) : '';
    }
  },
  { prop: 'adjustTime', label: '调整时间', align: 'center', width: 150,
    formatter: ({adjustTime}) => {
      return formatDate(adjustTime);
    }
  },
]