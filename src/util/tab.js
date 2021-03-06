// 页签存储管理
import store from '@/store/index';

export default class CacheTabManager {
	// 初始化页签列表
	static initialTabList() {
		try {
			const cachedTablist = sessionStorage.getItem('OP_cachedTabList');
			if (!cachedTablist || !cachedTablist.length) return [];
			return JSON.parse(cachedTablist);
		} catch {
			console.warn('[WARN]读取存储页签列表失败');
		}
	}
	// 初始化激活页签
	static intialActiveTab() {
		return sessionStorage.getItem('OP_cachedActiveTab') || '';
	}
	// 存储激活页签
	static cacheActiveTab(activeTab) {
		if (activeTab == 0) return;
		store.commit('system/UPDATE_ACTIVE_TAB', activeTab);
	}
	// 存储页签列表
	static cacheTabList(tabList) {
		if (!tabList.length) return;
		store.commit('system/UPDATE_TABLIST', tabList);
	}
	// 同步store中存储的页签信息到storage
	static syncTabToStorage() {
		return new Promise((resolve) => {
			sessionStorage.setItem('OP_cachedTabList', JSON.stringify(store.state.system.tabList));
			sessionStorage.setItem('OP_cachedActiveTab', store.state.system.activeTab);
			resolve(true);
		});
	}
	// 清空存储的页签列表
	static clearCachedTabList() {
		return new Promise((resolve) => {
			store.commit('system/UPDATE_ACTIVE_TAB', '');
			store.commit('system/UPDATE_TABLIST', []);
			sessionStorage.setItem('OP_cachedTabList', "[]");
			sessionStorage.setItem('OP_cachedActiveTab', "");
			resolve(true);
		});
	}
}
