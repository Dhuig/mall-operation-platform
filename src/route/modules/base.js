// Base
export default [
	{
		path: '/download_manage',
    component: () => import(/* webpackChunkName: 'Base-downloadMange'*/ '@/component/base/downloadMange.vue'),
    meta: { title: '下载管理' }
	},
	{
		path: '/settings',
    component: () => import(/* webpackChunkName: 'Base-settings'*/ '@/component/base/settings.vue'),
    meta: { title: '设置' }
	},
];
