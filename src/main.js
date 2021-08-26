import Vue from 'vue';
import './plugins/element.js';
import './plugins/echarts.js'
import './theme/index.css';
import './global.css';
import './reset.css';
import 'default-passive-events'
import VueRouter from 'vue-router';
import { router } from './route';
import { plugins } from './plugins';
import { layouts } from './layout';
import registerPage from './component';
import { directives } from './directives';
import components from './component/common';
import store from './store/index';
import entry from './entry';
import clipboard from 'vue-clipboard2';

const safePush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject) return safePush.call(this, location, onResolve, onReject);
	return safePush.call(this, location).catch(err => err);
}

// 判断是否有按钮权限
Vue.prototype.$permission = function(value) {
	const { buttonPermission } = store.getters['system/getPermissionList'];
	if (value) {
		return buttonPermission.includes(value);
	} else {
		return true;
	}
}

Vue.config.productionTip = false;

// 注册页面组件
registerPage(Vue);
// 注册插件
[clipboard].concat(plugins).forEach(plugin => Vue.use(plugin));
// 注册布局组件
layouts.forEach(layout => Vue.component(layout.name, layout));

// 注册指令
directives.forEach(directive => Vue.directive(directive.name, directive.define));
// 注册公共组件
components.forEach(component => Vue.component(component.name, component));

new Vue({
	router,
	store,
	render: h => h(entry)
}).$mount('#app');