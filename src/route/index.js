import VueRouter from 'vue-router';
import Vue from 'vue';

import LoginManage from '../util/login';
import App from '../app.vue';
import LoginRoute from './login';	// 登录模块
import store from '@/store/index';

// 路由自动导入
const contexts = require.context('./modules', false, /\.js$/);
let autoImportRoute = [];
contexts.keys().forEach(path => {
	if (path.indexOf('index.js') > 0) return;
	autoImportRoute = autoImportRoute.concat(contexts(path).default);
});

// 基础路由
const routes = [
	...LoginRoute,
	{
		path: '/',
		component: App,
		meta: {
			title: '主页'
		},
		children: autoImportRoute
	},
	// 客服系统跳转查询路由
	{
    path: '/crm_query',
    redirect: to => {
      const { query: { token = '', type = '', from = '', userid = '', cardNo = '', storeCode = '', ...rest }} = to;
			if(!(token && type && from && userid)) return '/crm_query';
      store.commit('user/UPDATE_TOKEN', token);
      store.commit('crm/UPDATE_CRM_QUERY_PARAMS', {
        token,
        type,
        from,
				userid,
				cardNo,
				storeCode,
				...rest,
			});
      return type;
    }
  },
];

// 访问控制
function accessAble(to) {
	const realPath = to.path.replace(/\//, '').trim();
	console.log('realPath:', realPath, store.getters['system/getPermissionList'])
	if(to.meta && to.meta.requireAuth) return realPath in store.getters['system/getPermissionList'];
	return true;
}

const router = new VueRouter({ routes });
router.beforeEach((to, from, next) => {
	store.commit('system/ROUTE_DATA', {oldUrl:from.fullPath,newUrl:to.fullPath});
	if (!store.getters['crm/isSkipFromCRM'] && to.path !== '/login' && !LoginManage.isLogined()) {
		next('/login');
  } else if (to.query.token && to.query.from === 'crm_system') {
    next();
  } else {
		if(accessAble(to)) {
			next();
		} else {
			Vue.prototype.$message({
				type: 'error',
				message: '您没有访问这个页面的权限! 请联系管理员为您的帐号添加访问权限.',
				duration: 5000
			});
		}
  }
});

export { router, autoImportRoute }
