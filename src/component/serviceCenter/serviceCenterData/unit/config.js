
import { filters } from '@/plugins/filters';
// 变更模块
export const CHANGE_MODULES = {
  1: '负责人资料',
  2: '服务中心资料',
  3: '证件资料',
	4: '店铺装修资料',
	5: '银行账号增加',
	6: '银行账号修改',
	7: '银行账号废除',
	8: '重置店员密码',
	9: '删除店员',
}

// 变更历史列表项配置
export const CHANGE_HISTORY_COLUMUS_CONFIG = [
  { prop: 'updater', label: '修改人', align: 'center' },
  { prop: 'updaterNo', label: '修改人编号', align: 'center' },
  {
		prop: 'createTime',
		label: '创建时间',
		align: 'center',
		formatter: ({ createTime }) => {
			if(!createTime) return '--';
			return filters.timestampFormat(createTime);
		}
	},
  {
    prop: 'updateType',
    label: '变更模块',
    align: 'center',
    formatter: ({updateType}) => { 
			return updateType in CHANGE_MODULES ? CHANGE_MODULES[updateType] : ''; 
		}
  },
	{ prop: 'updateBeforeMsg', label: '变更前', align: 'center',
		formatter: ({updateBeforeMsg}) => {
			return updateBeforeMsg ? updateBeforeMsg.replace(/\n/g, '</br>') : '';
		}
	},
	{ prop: 'updateAfterMsg', label: '变更后', align: 'center',
		formatter: ({updateAfterMsg}) => {
			return updateAfterMsg ? updateAfterMsg.replace(/\n/g, '</br>') : '';
		}
	},
];

// 帐户类型 1一般帐户 2专用帐户 3临时账户 4基本账户
export const ACCOUNT_TYPE = {
	"1": "一般帐户",
	"2": "专用帐户",
	"3": "临时账户",
	"4": "基本账户",
}

// 是否扣款账号
export const DECUCTION_TYPE = {
	"1": "是",
	"2": "否"
}

// 网点等级（改用等级管理里面的设定）
// export const SHOP_LEVEL = {
// 	'1': '普通服务中心',
// 	'2': '五星服务中心',
// 	'3': '五星旗舰服务中心'
// }
// 证件类型配置
export const CARDLIST_CONFIG = {
	1: '身份证',
	2: '其他证件',
}
// 性别配置
export const SEX_CONFIG = {
	1: '男',
	2: '女',
}
// 文化程度配置
export const EDUCATIONOPTION_CONFIG = {
	'01': '高中或以下',
	'02': '中专',
	'03': '大专',
	'04': '大学本科',
	'05': '研究生及以上',
}
// 居住地配置
export const PLACEOPTION_CONFIG = {
	1: '大中城市',
	2: '县城',
	3: '农村',
}
// 职业配置
export const OCCUPATIONOPTION_CONFIG = {
	1: '企事业管理人员',
	2: '专业人士',
	3: '私营老板',
	4: '职员/职工',
	5: '自由职业',
	6: '下岗/退休',
	7: '务农',
	8: '其他',
}
// 组成形式
export const COMPOSITION_SHAPE = {
	'1': '个人经营',
	'2': '家庭经营',
}
// 房产类型
export const HOUSE_TYPE = {
	0: '自有',
	1: '租赁',
}
// 店铺类型
export const SHOP_TYPE = {
	1: '临街店铺', 
	2: '写字楼', 
	3: '商场店铺',
}

// 店员资料 列表配置
export const CLERK_DETAIL_COLUMNS = [
	{ prop: 'username', label: '登录账号', align: 'center' },
	{ prop: 'realname', label: '用户姓名', align: 'center' },
	{ prop: 'mobile', label: '手机号', align: 'center' },
	{ prop: 'permissionName', label: '角色', align: 'center' },
	{
		prop: 'canLoginStore',
		label: '服务中心登录',
		align: 'center',
		formatter: ({ canLoginStore }) => {
			return !canLoginStore ? '启用' : '禁用';
		},
	},
	{
		prop: 'canLoginMall',
		label: '商城登录',
		align: 'center',
		formatter: ({ canLoginMall }) => {
			return !canLoginMall ? '启用' : '禁用';
		},
	},
];