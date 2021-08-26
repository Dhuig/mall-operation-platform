// 系统设置路由定义

export default [
	{
		path: 'user_management',
		component: () => import(
			/* webpackChunkName: 'System-userManagement' */
			'@/component/systemSetting/userManagement/userManagement.vue'
		),
		meta: {
			title: '用户管理',
			requireAuth: true
		}
	},
	{
		path: 'update_user',
		component: () => import(
			/* webpackChunkName: 'System-updateUser' */
			'@/component/systemSetting/userManagement/updateUser.vue'
		),
		meta: {
			title: '新增/编辑 用户'
		}
	},
	{
		path: 'role_management',
		component: () => import(
			/* webpackChunkName: 'System-roleManagement' */
			'@/component/systemSetting/roleManagement/roleManagement.vue'
		),
		meta: {
			title: '角色管理',
			requireAuth: true
		}
	},
	{
		path: 'update_role',
		component: () => import(
			/* webpackChunkName: 'System-updateRole' */
		'@/component/systemSetting/roleManagement/updateRole.vue'
		),
		meta: {
			title: '新增/编辑 角色'
		}
	},
	{
		path: 'auth_management',
		component: () => import(
			/* webpackChunkName: 'System-authManagement' */
			'@/component/systemSetting/authManagement/authManagement.vue'
		),
		meta: {
			title: '权限管理',
			requireAuth: true
		}
	},
	{
		path: 'system_operation_log',
		component: () => import(
			/* webpackChunkName: 'System-operationLog' */
			'@/component/systemSetting/operationLog/systemOperationLog.vue'
		),
		meta: {
			title: '操作日志',
			requireAuth: true
		}
	},
];
