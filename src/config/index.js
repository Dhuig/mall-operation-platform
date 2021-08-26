// 后端开发域名 在这儿添加对接的域名, 例如 钟军生（junsheng）: 192.168.0.45:8905
// const BACKEND_DEVELOPER_HOST = {
// wenqiang: '192.168.0.110:8901',
// huangzexin: '192.168.0.106:8908',
// // lingfeng:'192.168.0.104:8909',//分公司接口ip和端口
// guodong: '192.168.0.236:8901',
// jiagou: '192.168.0.107',
// yuwenbo: '192.168.0.94:8901',
// zhangheng: '192.168.0.106:8909',
// tanjianlang: '192.168.0.99:8915',
// tanjianlang2: '42.194.215.85:8915',
// junsheng: '192.168.0.45:8905',
// huxun: '192.168.0.118:8905',
// lishan: '192.168.0.104:8902',
// txt: '106.52.140.234:8904',
// hsk: '17c36i9201.51mypc.cn',
// // jianlang:'http://42.194.215.85:8905'
// wangshuanghu: '106.55.56.79:8915',
// };

// 上传服务使用的 各中心(后端) client key
const CLIENT_KEY = {
	'crm': "mall-center-member", 		      // 会员中心
	'goods': "mall-center-product",       // 商品中心
	'order': "mall-center-order",         // 订单中心
	'service': "mall-center-store",       // 服务中心
	'stock': "mall-center-inventory",     // 库存中心
	'pay': "mall-center-pay",  		        // 支付中心
	'finance': "mall-center-finance",     // 财务中心
	'cms': "mall-center-cms",  	 			    // 内容中心
	'sys': "mall-center-sys",             // 基础资料中心
	'promotion': "mall-center-promotion",  // 营销中心
	'msgnotice': "mall-center-msg"  // 消息公告中心
}

// oss 文件上传环境配置, 取代上面的 上传路径 UPLOAD_URL 定义, dev|test|uat|prod
const OSS_UPLOAD_URL = {
	// dev: "//42.194.210.148:8090/storage/upload",
	dev: '//uc-dev.perfect99.com/api/storage/upload',		 // 新版开发环境
  test: "//uc-test.perfect99.com/api/storage/upload",
	// uat: "//uc2-uat.perfect99.com/storage/upload",
	uat: "//uc-uat.perfect99.com/api/storage/upload",
	prod: "//uc.perfect99.com/api/storage/upload"
}

// oss 文件上传类型 PublicCloud(公有云) / PrivateCloud(私有云)
const OSS_UPLOAD_TYPE = 'PublicCloud'

// 各环境域名
const HOST_MAP = {
	// ...BACKEND_DEVELOPER_HOST,
	// dev: 'uc2-dev.perfect99.com',		 // 旧版开发环境
	dev: 'uc-dev.perfect99.com/api',		 // 新版开发环境
	test: 'uc-test.perfect99.com/api', // 测试环境
	// uat: 'uc2-uat.perfect99.com',	  // 旧版uat环境
	uat: 'uc-uat.perfect99.com/api',	  // 新版uat环境
	// prod: 'uc2-prod.perfect99.com/api', // 旧版生产环境
	prod: 'uc.perfect99.com/api', // 生产环境
};

// 接口超时设定
const TIMEOUT = 10000;
// 协议
const PROTOCOL = 'https';
// 平台名字
const PLATFORM_NAME = '完美运营后台';

// 登录默认使用的 Token
const DEFAULT_LOGIN_TOKEN = 'Basic b3BfYXBwOnBlcmZlY3RfcG9ydGFs';
// 高德地图 SDK url
const GAODE_MAP_URL = 'https://webapi.amap.com/maps?v=2.0&key=7c81a5163b7f86d8558d807f7500818c&plugin=AMap.Geolocation';
// 运营后台 key(验证签名的key)
const PLATFORM_KEY = '8d4324ed81ea0e448d31914d63e96dd6';

// 菜单图标映射字典
const MENU_ICON_MAP = {
	"顾客管理": '&#xe634;',
	"会员管理": "&#xe635;",
	"服务中心管理": "&#xe63d;",
	"服务中心库存管理": "&#xe632;",
	"产品管理": "&#xe633;",
	"订单管理": "&#xe62f;",
	"售后管理": "&#xe63e;",
	"押货管理": "&#xe639;",
	"押货售后管理": "&#xe63a;",
	"内容管理": "&#xe637;",
	"财务管理": "&#xe62e;",
	"账款管理": "&#xe62d;",
	"业务办理大厅": "&#xe63f;",
	"业务办理大厅(服务中心)": "&#xe631;",
	"基础信息管理": "&#xe638;",
	"系统设置": "&#xe640;",
	"消息公告管理": "&#xe636;",
	"直播设置": "&#xe63c;",
	"活动中心": "&#xe63b;",
	"报表中心": "&#xe630;",
	"完美服务到家": "&#xe607;",
	"运营数据中心": "&#xe608;",
}

export default {
	HOST_MAP,
	TIMEOUT,
	PROTOCOL,
	CLIENT_KEY,
	OSS_UPLOAD_URL,
	OSS_UPLOAD_TYPE,
	DEFAULT_LOGIN_TOKEN,
	GAODE_MAP_URL,
	MENU_ICON_MAP,
	PLATFORM_NAME,
	PLATFORM_KEY,
}
