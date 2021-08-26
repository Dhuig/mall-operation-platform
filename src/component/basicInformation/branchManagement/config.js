
// 分公司详情-公司类型
export const BRANCH_TYPE = {
	1: '总公司',
	2: '分公司',
	3: '上海商业',
	4: '杨州公司',
	5: '吉林公司',
	6: '广东公司',
}

// 分公司-地区
export const REGION_STATUS = {
	1: '华北区',
	2: '东北区',
	3: '华东区',
	4: '华中区',
	5: '东南区',
	6: '西南区',
	7: '西北区',
}

// 分公司详情-店地址(接口字段key)
export const SHOP_KEY = {
	1: 'shopProvinceName', // 省
	2: 'shopCityName', // 市
	3: 'shopDistrictName', // 区
	4: 'shopStreetName', // 街道
	5: 'shopAddress', // 地址
}

// 分公司详情-联系地址(接口字段key)
export const CONTACT_KEY = {
	1: 'contactProvinceName', // 省
	2: 'contactCityName', // 市
	3: 'contactDistrictName', // 区
	4: 'contactStreetName', // 街道
	5: 'contactAddress', // 地址
}

// 分公司详情-发货地址(接口字段key)
export const DELIVER_KEY = {
	1: 'deliveryProvinceName', // 省
	2: 'deliveryCityName', // 市
	3: 'deliveryDistrictName', // 区
	4: 'deliveryStreetName', // 街道
	5: 'deliveryAddress', // 地址
}

// 分公司详情-发票地址(接口字段key)
export const POST_KEY = {
	1: 'postProvinceName', // 省
	2: 'postCityName', // 市
	3: 'postDistrictName', // 区
	4: 'postStreetName', // 街道
	5: 'postAddress', // 地址
}

// 分公司详情-账户用途
export const ACCOUNT_USE = {
	1: '押货款专用',
	2: '商城报单',
	3: '保证金',
	4: '订货款专用',
	5: '备用金',
}

// 分公司详情-开户银行
export const BANK_TYPE = {
	'平安银行': '平安银行',
	'中国工商银行': '中国工商银行',
	'农业银行': '农业银行',
	'中国银行': '中国银行',
	'中国建设银行': '中国建设银行',
	'邮政储蓄银行': '邮政储蓄银行',
	'招商银行': '招商银行',
	'中信银行': '中信银行',
	'兴业银行': '兴业银行',
	'光大银行': '光大银行',
	'民生银行': '民生银行',
	'广发银行': '广发银行',
	'上海银行': '上海银行',
	'北京银行': '北京银行',
	// '12': '平安银行',
	// '10001': '工商银行',
	// '10002': '农业银行',
	// '10003': '中国银行',
	// '1004': '建设银行',
	// '10005': '邮政储蓄银行',
	// '10006': '招商银行',
	// '10007': '中信银行',
	// '10008': '兴业银行',
	// '10009': '光大银行',
	// '10010': '民生银行',
	// '10011': '广发银行',
	// '10012': '上海银行',
	// '10013': '北京银行',
}

// 分公司列表-搜索配置
export const BRANCH_LIST_MANAGEMENT_CONFIG = {
	form: [
		{
			label: '公司编号',
			key: 'companyCode',
			type: 'input',
			value: '',
			placeholder: '请输入公司编号'
		},
		{
			label: '负责人',
			key: 'principal',
			type: 'input',
			value: '',
			placeholder: '请输入负责人',
		},

	],
}

// 分公司列表-表格配置
export const BRANCH_LIST_MANAGEMENT_COLUMNS = [
	{
		prop: 'code',
		label: '公司编号',
		align: 'left',
	},
	{
		prop: 'name',
		label: '公司名称',
		align: 'left',
	},
	{
		prop: 'geographyCode',
		label: '地区',
		align: 'left',
		formatter: ({ geographyCode }) => {
			return geographyCode in REGION_STATUS ? REGION_STATUS[geographyCode] : '';
		},
	},
	{
		prop: 'principal',
		label: '负责人',
		align: 'left',
	},
	{
		prop: 'fullName',
		label: '公司全称',
		align: 'left',
	},
	{
		prop: 'faxPhone',
		label: '传真号码',
		align: 'left',
	},
]


// 分公司详情-表格配置
export const BRANCH_DETAIL_COLUMNS = [
	{
		prop: 'accountCode',
		label: '账号编号',
		align: 'left',
	},
	{
		prop: 'accountName',
		label: '账户名称',
		align: 'left',
	},
	{
		prop: 'account',
		label: '账户',
		align: 'left',
	},
	{
		prop: 'bankType',
		label: '开户银行',
		align: 'left',
	},
	{
		prop: 'bankProvince',
		label: '银行省份',
		align: 'left',
	},
	{
		prop: 'bankCity',
		label: '银行城市',
		align: 'left',
	},
	{
		prop: 'bankName',
		label: '开户行名称',
		align: 'left',
	},
	{
		prop: 'accountUse',
		label: '账号用途',
		align: 'left',
		formatter: ({ accountUse }) => {
			return accountUse in ACCOUNT_USE ? ACCOUNT_USE[accountUse] : '';
		},
	},
]
