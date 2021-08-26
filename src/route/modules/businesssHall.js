// 业务大厅路由定义
export default [
	{
		path: 'business_list',
		component: () => import(
			/* webpackChunkName: 'BusinessHall-businessList' */
			'@/component/businessHall/businessList.vue'
		),
		meta: {
			title: '业务大厅',
			requireAuth: true
		}
	},
	{
		path: 'business_detail',
		component: () => import(
			/* webpackChunkName: 'BusinessHall-businessDetail' */
			'@/component/businessHall/businessDetail.vue'
		),
		meta: {
			title: '业务详情',
		}
	},
	{
		path: 'black_list',
		component: () => import(
			/* webpackChunkName: 'BusinessHall-blackList' */
			'@/component/businessHall/blackList.vue'
		),
		meta: {
			title: '黑名单管理',
			requireAuth: true
		}
	},
	{
		path: 'black_step',
		component: () => import(
			/* webpackChunkName: 'BusinessHall-blackStep' */
			'@/component/businessHall/blackStep.vue'
		),
		meta: {
			title: '黑名单批量导入',
		}
	},
];
