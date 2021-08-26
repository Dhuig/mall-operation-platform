/**
 * accessButtonList permission control
 */

export const permission = {
	name: 'permission',
	define: {
		inserted(el, binding, vnode) {
			const { context: { $store } } = vnode;
			const isSkipFromCRM = $store.getters['crm/isSkipFromCRM'] || false;
			if (!isSkipFromCRM && binding.value) {
				const valueList = binding.value.split('|');
				const permissionList = $store.getters['system/getPermissionList'];
				const { buttonPermission } = permissionList;
				let isShow = false;
				// const isShow = buttonPermission.includes(binding.value) || permissionList[binding.value];
				valueList.forEach(v => {
					if (buttonPermission.includes(v) || permissionList[v]) {
						isShow = true;
					}
				});
				!isShow && el.parentNode && el.parentNode.removeChild(el);
			} else if (isSkipFromCRM && /crm/.test(binding.arg)) {
				el.parentNode && el.parentNode.removeChild(el);
			}
		}
	}
}

export const multiMatchPermission = {
	name: 'multiMatchPermission',
	define: {
		inserted(el, binding, vnode) {
			const { context: { $store }} = vnode;
			const { arg, value } = binding;
			let isShow = false;
			if (arg && value) {
				const permissionCode = arg in value ? value[arg] : '';
				const { buttonPermission } = $store.getters['system/getPermissionList'];
				isShow = buttonPermission.includes(permissionCode);
			}
			!isShow && el.parentNode && el.parentNode.removeChild(el);
		},
	}
}
