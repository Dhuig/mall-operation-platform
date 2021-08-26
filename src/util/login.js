import axios from 'axios';
import CONFIG from 'config/index.js';
const { HOST_MAP } = CONFIG;
import store from '@/store/index';
// import { utf8ToBase64, base64ToUtf8 } from 'util';

/**
 * 登录管理器
 */
export default class LoginManager {
	static ENV_MAP = {
		'dev': { name: '开发', disabled: true },
		'test': { name: '测试', disabled: true },
		'uat': { name: 'UAT', disabled: false },
		'prod': { name: '生产', disabled: true },
	}

	// 登录
	static handleLogin = userInfo => {
		store.commit('user/UPDATE_USERINFO', userInfo);
		localStorage.setItem('OP_accessKey', btoa(userInfo.access_token));
	}
	// 检测是否登录
	static isLogined = () => {
		try {
			if (store.getters['user/isLogined']) return true;
			const cachedStoreStr = sessionStorage.getItem('OP_tempStore') || "{}";
			const cachedStore = JSON.parse(cachedStoreStr);
			return cachedStore.userInfo && cachedStore.userInfo.userId && cachedStore.userInfo.access_token;
		} catch {
			console.warn('[WARN]获取登录状态失败');
			return false;
		}
	}
	// 注销
	static handleLogout = () => {
		store.commit('system/UPDATE_ACTIVE_TAB', '');
		store.commit('system/UPDATE_TABLIST', []);
		sessionStorage.setItem('OP_cachedTabList', "[]");
		sessionStorage.setItem('OP_cachedActiveTab', "");
		sessionStorage.removeItem('vuex')
		store.commit('user/UPDATE_USERINFO', Object.create(null));
	}
	// 同步store中存储的用户信息到storage
	static syncUserInfoToStorage() {
		return new Promise((resolve) => {
			sessionStorage.setItem('OP_tempStore', JSON.stringify(store));
			resolve(true);
		});
	}
	// 切换域名
	static changeHost(currentEnv, protocol) {
		axios.defaults.baseURL = `${protocol}://${HOST_MAP[currentEnv]}`;
		if (currentEnv === 'prod') return;
		return `使用 [${this.ENV_MAP[currentEnv].name}] 环境登录, 域名: ${axios.defaults.baseURL}`;
	}
}
