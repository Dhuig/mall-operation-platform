import { formatDate } from 'util/formValidation'
export const steps = [
	{
		element: '.platform-topBar',
		popover: {
			title: '顶部栏',
			description: '这里展示运营后台的基本信息, 设置按钮, 登录用户信息 和 退出按钮',
			position: 'bottom-center',
		},
	},
	{
		element: '.platform-sidebar',
		popover: {
			title: '菜单栏',
			description: '展示所有可访问的菜单, 有展开式 和 折叠式 两种菜单可选',
			position: 'right-bottom',
		},
	},
	{
		element: '.el-tabs__nav-scroll',
		popover: {
			title: '页签栏',
			description: '展示所有已打开的页签',
			position: 'bottom',
		},
	},
	{
		element: '.tab-operation-buttons',
		popover: {
			title: '页签控制按钮区',
			description: '放置控制页签行为的按钮',
			position: 'left-bottom',
		},
	},
	{
		element: '.icon-lock',
		popover: {
			title: '锁定页签按钮',
			description: '可锁定/解锁页签',
			position: 'left-bottom',
		},
	},
	{
		element: '.icon-refresh',
		popover: {
			title: '刷新页签按钮',
			description: '可刷新当前激活的页签, 让页签中的数据初始化',
			position: 'left-bottom',
		},
	},
	{
		element: '.icon-closeAll',
		popover: {
			title: '关闭所有页签按钮',
			description: '可关闭所有页签',
			position: 'left-bottom',
		},
	},
	{
		element: '.icon-prev',
		popover: {
			title: '前一个页签按钮',
			description: '激活前一个页签',
			position: 'left-bottom',
		},
	},
	{
		element: '.icon-next',
		popover: {
			title: '后一个页签按钮',
			description: '激活后一个页签',
			position: 'left-bottom',
		},
	},
	{
		element: '.el-tabs__content',
		popover: {
			title: '页签内容区',
			description: '展示页签的主要内容',
			position: 'mid-center',
		},
	},
];

export const DOWLOAD_MANGE_STATUS = {
	0: '待处理', 1: '处理中', 2: '处理完成', 3: '已取消', 5: '导出失败'
}
export const DOWNLOAD_COLUMNS = [
	{ label: '文件名', prop: 'filename', align: 'center' },
  { label: '创建时间', prop: 'createTime', align: 'center', formatter: ({ createTime }) => formatDate(new Date(createTime).getTime()) || '--' },
	// { label: '操作人', prop: 'operator', align: 'center' },
	{ label: '导出状态', prop: 'status', align: 'center', formatter: ({ status }) => DOWLOAD_MANGE_STATUS[status] || '--' },
]