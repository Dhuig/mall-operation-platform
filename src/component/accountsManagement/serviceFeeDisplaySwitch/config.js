import { formatDate } from 'util/formValidation.js'
//服务费显示开关 -- 列表项
export const SWITCH_COLUMNS_CONFIG = [
  { 
    prop: 'updateTime',
    label: '修改时间',
    align: 'center',
    formatter: ({updateTime}) => {
      return formatDate(updateTime);
    }
  },
  { 
    prop: 'operation',
    label: '操作类型',
    align: 'center'
  },
  { 
    prop: 'updaterName',
    label: '修改人',
    align: 'center'
  },
]