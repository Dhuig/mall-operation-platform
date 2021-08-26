import { formatDate } from 'util/formValidation';

export const OWNING_LIST_CONFIG = {
	form:[
		{
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号',
    },
    {
      label: '产品编码',
      key: 'productCode',
      type: 'input',
      value: '',
      placeholder: '请输入产品编码',
		},
	],
}

// 后台欠货未发列表页-列表配置
export const OWNING_LIST_COLUMNS = [
	{
		prop: 'storeCode',
		label: '服务中心编号',
		align: 'left',
	},
	{
		prop: 'productCode',
		label: '产品编码',
		align: 'left',
	},
	{
		prop: 'productName',
		label: '产品名称',
    align: 'left',
    width: 150,
	},
	{
		prop: 'createTime',
		label: '押货日期',
    align: 'left',
    width: 150,
		formatter: ({createTime}) => {
			return formatDate(createTime);
		}
	},
	{
		prop: 'orderSn',
		label: '押货单号',
    align: 'left',
    width: 180,
	},
	{
		prop: 'productNum',
		label: '押货数量',
		align: 'left',
		formatter: ({ productNum }) => productNum
	},
	{
		prop: 'productDeliveredNum',
		label: '已发货',
		align: 'left',
		formatter: ({productDeliveredNum}) => {
			return productDeliveredNum;
		}
	},
	{
		prop: 'diffNum',
		label: '欠货未发',
		align: 'left',
		formatter: ({diffNum}) => {
			return diffNum;
		}
	},
]
