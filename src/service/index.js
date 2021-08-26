import Vue from 'vue';
import store from '@/store/index';
import CONFIG from '../config/index';
const { $fetch, $message } = Vue.prototype;
// 获取菜单类型
// 产品配置 -- 菜单类型名字
// [show: 前端展示 catalog: 产品类型 company: 销售主体 brand: 产品品牌 tag: 产品标签]
export const loadConfigByType = async type => {
	if (!type) return;

	const res = await $fetch(`/mgmt/product/cfg/menu/${type}`);
	if (res && res.data) {
		return res.data;
	} else {
		return [];
	}
}
// // 获取子级菜单
// // 启用配置检测
const configValidateCheck = ({ cfgStatus }) => cfgStatus === 1;
// // 配置格式转换
const optionGenerator = ({ title: label, id: value }) => ({ label, value });

// 集中获取配置
export const loadProductsConfig = async () => {
	try {
		const CONFIG_TYPE = ['show', 'catalog', 'brand', 'company', 'tag'];
		const configs = await Promise.all(CONFIG_TYPE.map(loadConfigByType));
		const CONFIG_OPTIONS = configs.map(({ childList }) => childList.filter(configValidateCheck).map(optionGenerator));
		let objOptions = {}
		CONFIG_TYPE.forEach((type, index) => {
			objOptions[type] = CONFIG_OPTIONS[index]
		});
		store.commit('system/UPDATE_OPTIONS', objOptions);
	} catch {
		$message('获取菜单配置信息失败');
	}
}

// 获取服务公司列表
export const loadServiceCompany = async () => {
	const res = await $fetch('/mgmt/sys/current/user/company/list');
	if (res && res.data) {
		// mutations.updateCustomerField('serviceCompanyOptions', res.data.map(({ name: label, code: value }) => ({ label, value })) || []);
		const payload = {
			key: 'serviceCompanyOptions',
			val: res.data.map(({ name: label, code: value }) => ({ label, value })) || []
		}
		store.commit('system/UPDATE_OPTIONS_BY_KEY', payload);
	} else {
		return [];
	}
}

// 获取产品属性
export const loadProductsAttrbute = async () => {
	const res = await $fetch('/mgmt/product/cfg/listAttr?pageNum=0&pageSize=0');
	if (res && res.data && res.data.list) {
		const { list } = res.data;
		const array = list.map((item) => {
			if (item.attrType === 1) return { ...item, transValue: '' };
			if (item.attrType === 2) return { ...item, transValue: { label: item.attrValArray[0], checked: false } };
			if (item.attrType === 3)
				return {
					...item,
					transValue: item.attrValArray.map((label) => ({ label, checked: false }))
				};
		});
		store.commit('system/UPDATE_PORDUCT_ATTRBUTE', array);
	} else {
		return $message.error('获取产品属性信息失败');
	}
}

// 获取网点类型下拉列表
export const loadShopTypeData = async () => {
	const res = await $fetch(`/mgmt/store/list/shopType?pageNum=0&pageSize=0`);
	if(res && res.data){
		const payload = {
			key: 'shopTypeOptions',
			val: res.data.list.map(({ name:label, type: value }) => ({ label, value })) || []
		};
		store.commit('system/UPDATE_OPTIONS_BY_KEY', payload);
	} else {
		return [];
	}
}

// 获取权限菜单
export const loadPermissinMenus = async () => {
	const res = await $fetch('/auth/permission?menuType=1');
	if (res && res.data) {
		const menu = transformMenuTree(res.data);
		console.log('menu:', menu)
		store.commit('system/UPDATE_MENU', menu);
		return transformPermissionTree(res.data);
	} else {
		return [];
	}
}
// 查询价格参数
export const loadPriceParams = async () => {
	const res = await $fetch('/mgmt/product/cfg/getPrice');
	if (res && res.data) {
		store.commit('system/UPDATA_PRICE_PARAMS', res.data);
	} else {
		$message.error('获取价格参数失败');
	}
}

function transformMenuTree(menu) {
	const result = [];
	menu.forEach(item => {
		const { menuName, href, children } = item;
		const name = menuName.replace(/运营后台-/g, '');
		const icon = CONFIG.MENU_ICON_MAP[name];
		if(name.indexOf('(详情页)') === -1) {
			result.push({
				...item,
				name,
				href,
				icon,
				children: transformMenuTree(children)
			});
		}
	});
	return result;
}

function transformPermissionTree(menu) {
	const result = [];
	menu.forEach(item => {
		const { menuName, href, children } = item;
		const name = menuName.replace(/运营后台-/g, '');
		const icon = CONFIG.MENU_ICON_MAP[name];
		result.push({
			...item,
			name,
			href,
			icon,
			children: transformPermissionTree(children)
		});
	});
	return result;
}
