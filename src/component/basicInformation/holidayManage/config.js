// 节假日管理-列表配置
export const HOLIDAY_MANAGE_COLUMNS = [
	{
		prop: 'year',
		label: '年份',
		align: 'left',
	},
	{
		prop: 'month',
		label: '月份',
		align: 'left',
	},
	{
		prop: 'day',
		label: '日期',
		align: 'left',
	},
	{
		prop: 'holidayFlag',
		label: '是否节假日',
		align: 'left',
		formatter: (row) => {
			return row.holidayFlag == 1 ? '✔' : '';
		},
	},
	{
		prop: 'remarks',
		label: '备注',
		align: 'left',
	},
]
