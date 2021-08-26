export const BIND_PRODUCT_CONFIG = {
	form: [
		{
			label: '产品名称',
			key: 'keyword',
			type: 'input',
			value: '',
			placeholder: '请输入产品编码或产品名称',
		},
		{
			label: '产品分类',
			key: 'catalogId',
			type: 'select',
			value: '',
			options: [],
			placeholder: '请选择产品分类',
		}
	],
	buttonGroup: [
		{
			type: '',
			title: '重置',
			key: 'reset',
		},
		{
			type: 'primary',
			title: '搜索',
			key: 'search',
		},
	],
};

export const BANNER_MANAGEMENT_COLUMNS = [
	{ prop: 'serialNo', label: '活动编码', align: 'center', },
	{ prop: 'serialNo', label: '活动名称', align: 'center', },
	{ prop: 'serialNo', label: '预告时间', align: 'center', },
	{ prop: 'serialNo', label: '开始时间', align: 'center', },
	{ prop: 'serialNo', label: '结束时间', align: 'center', },
]
export const BIND_PRODUCT_COLUMNS = [
	{
		prop: 'serialNo',
		label: '产品编号',
		align: 'center',
	},
	{
		prop: 'title',
		label: '产品名称',
		align: 'center',
	},
	{
		prop: 'showList', label: '产品类型', align: 'center', formatter: ({ showList }) => {
			return showList.map(({ title }) => title).join('/')
		}
	},
];

export const BIND_ACTIVE_CONFIG = {
	form: [
		{
			label: '活动名称',
			key: 'name',
			type: 'input',
			value: '',
			placeholder: '请输入活动名称',
		},
		{
			label: '活动编码',
			key: 'no',
			type: 'input',
			value: '',
			placeholder: '请输入活动编码',
		},
	],
	buttonGroup: [
		{
			type: '',
			title: '重置',
			key: 'reset',
		},
		{
			type: 'primary',
			title: '搜索',
			key: 'search',
		},
	],
}

export const BIND_ACTIVE_COLUMNS = [
	{
		prop: 'promotionCode',
		label: '活动编号',
		align: 'center'
	},
	{
		prop: 'promotionName',
		label: '活动名称',
		align: 'center'
	}
];

export const BANNER_MANGEMENT_TYPE = {
	all: '1',
	onShelf: '2',
	pendingShelf: '3',
	offShelf: '4',
}

export const DISPLAY_OBJECT = {
	// '0': '全部（含游客）',
	'7': '游客 ',
	'1': '普通顾客',
	'2': '优惠顾客',
	'3': '云商',
	'4': '微店 ',
}

export const SHELF_STATUS = {
	'0': '待上架',
	'1': '已上架',
	'2': '已下架',
}

export const SHELF_RULES = {
	type: [
		{ required: true, message: '请选择类型', trigger: 'change' }
	],
	onShelfTime: [
		{ required: true, message: '请选择上架时间', trigger: 'change' }
	],
	offShelfTime: [
		{ required: true, message: '请选择下架时间', trigger: 'change' }
	]
}

export const AGREEMENT_MENU = [
	'head', // 标题
	// 'bold', // 粗体
	'fontSize', // 字号
	'fontName', // 字体
	'italic', // 斜体
	'underline', // 下划线
	'strikeThrough', // 删除线
	'foreColor', // 文字颜色
	'backColor', // 背景颜色
	'link', // 插入链接
	// 'list', // 列表
	'justify', // 对齐方式
	'quote', // 引用
	// 'emoticon', // 表情
	'image', // 插入图片
	// 'table', // 表格
	// 'code', // 插入代码
	'undo', // 撤销
	// 'redo' // 重复
]