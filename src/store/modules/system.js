import CONFIG from '@/config/index';
import signatureManger from 'util/verifySignature'

const system = {
  namespaced: true,
  state: () => ({
    // 页签相关
    activeTab: '',
    tabList: [],
    matchTabIndex: -1,
    menu: [],
    // 权限映射表(路由权限与按钮权限)
    permissionList: {},
    // ip
    ip: '',
    // 当前环境
    env: process.env.VUE_APP_DEFAULT_ENV ?? 'dev',
    // 协议
    protocol: process.env.VUE_APP_DEFAULT_PROTOCOL ?? 'http',
    // 下拉选项配置
    options: {},
    priceParams: {}, // 价格参数
    closeTabArr: [], // 想要关闭TAB的路由数组
    productAttrList: [], // 产品属性
    errorCode: null,
    signatureVerification: null,  // 上传文件验签相关
    routeUrlData:{
      oldUrl:'',
      newUrl:''
    }
  }),
  mutations: {
    ROUTE_DATA(state,data){
      state.routeUrlData = Object.assign(state.routeUrlData,data) 
    },
    // 更新 自定义字段 (谨慎使用)
    // UPDATE_CUSTOM_FIELD(state, { key, val }) {
    //   state[key] = val;
    // },
    // 更新活动页签
    UPDATE_ACTIVE_TAB(state, activeTab) {
      state.activeTab = activeTab;
    },
    // 更新活动页签索引
    UPDATE_ACTIVE_TAB_INDEX(state, matchTabIndex) {
      state.matchTabIndex = matchTabIndex;
    },
    // 更新菜单
    UPDATE_MENU(state, menu) {
      state.menu = menu;
    },
    // 更新权限映射表
    UPDATE_PERMISSION_LIST(state, permissionList) {
      state.permissionList = permissionList;
    },
    // 更新 ip
    UPDATE_IP(state, ip) {
      state.ip = ip;
    },
    // 更新页签列表
    UPDATE_TABLIST(state, tabList) {
      state.tabList = tabList;
    },
    // 更新下拉选项配置
    UPDATE_OPTIONS(state, obj) {
      state.options = { ...state.options, ...obj }
    },
    UPDATE_OPTIONS_BY_KEY(state, { key, val }) {
      state.options[key] = val
    },
    // 更新产品属性
    UPDATE_PORDUCT_ATTRBUTE(state, array) {
      state.productAttrList = array
    },
    // 更新环境标识
    UPDATE_ENV(state, env) {
      state.env = env;
    },
    // 更新环境标识
    UPDATE_PROTOCOL(state, protocol) {
      state.protocol = protocol;
    },
    // 更新错误code
    UPDATA_ERROR_CODE(state, errorCode) {
      state.errorCode = errorCode
    },
    // 查询价格参数
    UPDATA_PRICE_PARAMS(state, data) {
      state.priceParams = data
    },
    // 更新关闭TAB的路由数组
    UPDATA_CLOSE_TAB_ARR(state, data) {
      if (data.type) {
        state.closeTabArr = []
      } else {
        state.closeTabArr.push(data)
      }
    },
    // 更新上传验签header
    UPDATE_SIGNATURE_VERIFICATION(state,data) {
      const generalPlatformHeaders = {
        client: 'op',
        channel: 'pc'
      }
      const verifySignatureHeaders = signatureManger.generateVerifyRequestHeaders(
        signatureManger.getPath(data && data.indexOf('/api/')>-1?data.substring(data.indexOf('/api/')+4):'/storage/upload'),
        signatureManger.getMethod('POST'),
        signatureManger.generateUid(),
        signatureManger.getTimestamp(),
        signatureManger.getToken(this.getters['user/getFullToken']),
        signatureManger.getPlatformKey()
      );
      state.signatureVerification = {
        'Authorization': this.getters['user/getFullToken'],
        ...generalPlatformHeaders,
        ...verifySignatureHeaders,
      }
    }
  },
  getters: {
    getRouteUrl(state){
      return state.routeUrlData
    },
    getbaseURL({env,protocol}){
     return `${protocol}://${CONFIG.HOST_MAP[env]}`
    },
    // 返回激活页签
    getActiveTab(state) {
      return state.activeTab;
    },
    // 返回页签数组
    getTabList(state) {
      return state.tabList;
    },
    // 返回菜单
    getMenu(state) {
      return state.menu;
    },
    // 返回ip
    getIP(state) {
      return state.ip;
    },
    // 返回权限映射表
    getPermissionList(state) {
      return state.permissionList;
    },
    // 返回 环境标识
    getEnv(state) {
      return state.env;
    },
    // 返回 协议
    getProtocol(state) {
      return state.protocol;
    },
    // 返回 错误code
    getError(state) {
      return state.errorCode
    },
    // 返回 价格参数
    getPriceParams(state) {
      return state.priceParams
    },
    // 下拉选项配置
    getOptions(state) {
      return state.options
    },
    // 获取oss上传的URL
    getOssUploadUrl(state) {
      return CONFIG.OSS_UPLOAD_URL[state.env]
    },
    // 获取关闭TAB的路由数组
    getCloseTabArr(state) {
      return state.closeTabArr
    },
    // 获取产品属性
    getProductAttrList(state) {
      return state.productAttrList
    },
    // 获取验签header
    getSignatureVerification(state) {
      return state.signatureVerification;
    }
  }
}

export default system