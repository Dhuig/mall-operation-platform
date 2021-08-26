
import { formatDate } from 'util/formValidation.js';
export const CHANGE_COLUMNS = [
	{ prop: 'typeName', label: '类型名称', align: 'center' },
	{
		prop: 'createTime', label: '修改时间', align: 'center',
		formatter: ({ createTime }) => createTime ? formatDate(createTime) : '--'
	},
	{
		prop: 'noticeCount', label: '公告数量', align: 'center',
		formatter: ({ noticeCount }) => noticeCount
	},
	{ prop: 'status', label: '显示', align: 'center', slot: 'status', },
];
