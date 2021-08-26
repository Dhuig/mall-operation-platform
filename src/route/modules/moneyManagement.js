// 保证金管理

export default [
	{
		path: 'bond_list',
		component: () => import(
			/* webpackChunkName: 'moneyManagement-bondList' */
			'@/component/moneyManagement/bond/bondList.vue'
		),
		meta: {
			title: '开店保证金列表'
		}
	},
	{
		path: 'bond_detail',
		component: () => import(
			/* webpackChunkName: 'moneyManagement-bondDetail' */
			'@/component/moneyManagement/bond/bondDetail.vue'
		),
		meta: {
			title: '开店保证金详情'
		}
	},
];
