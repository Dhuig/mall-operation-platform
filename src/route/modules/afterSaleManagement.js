// 押货售后路由定义

export default [
	{
		path: 'return_exchange_list',
		component: () => import(
			/* webpackChunkName: 'AfterSale-returnExchangeList' */
			'@/component/afterSaleManagement/returnExchange/returnExchangeList.vue'
		),
		meta: {
			title: '押货退货单列表',
			requireAuth: true,
		}
	},
	{
		path: 'creat_return_exchange',
		component: () => import(
			/* webpackChunkName: 'AfterSale-creatReturnExchange' */
		'@/component/afterSaleManagement/returnExchange/creatReturnExchange.vue'
		),
		meta: {
			title: '新建押货退货单'
		}
	},
	{
		path: 'return_exchange_detail',
		component: () => import(
			/* webpackChunkName: 'AfterSale-returnExchangeDetail' */
		'@/component/afterSaleManagement/returnExchange/returnExchangeDetail.vue'
		),
		meta: {
			title: '押货退货详情',
			requireAuth: true,
		}
	},
	{
		path: 'return_exchange_printing',
		component: () => import(
			/* webpackChunkName: 'AfterSale-returnChangePrinting' */
			'@/component/afterSaleManagement/returnExchange/returnExchangePrinting.vue'
		),
		meta: {
			title: '押货退货单审批表打印',
		}
	},
	{
		path: 'return_change_list',
		component: () => import(
			/* webpackChunkName: 'AfterSale-returnChangeList' */
			'@/component/afterSaleManagement/returnChange/returnChangeList.vue'
		),
		meta: {
			title: '押货换货单列表',
			requireAuth: true
		}
	},
	{
		path: 'creat_return_change',
		component: () => import(
			/* webpackChunkName: 'AfterSale-creatReturnChange' */
			'@/component/afterSaleManagement/returnChange/creatReturnChange.vue'
		),
		meta: {
			title: '新建押货换货单'
		}
	},
	{
		path: 'return_change_detail',
		component: () => import(
			/* webpackChunkName: 'AfterSale-returnChangeDetail' */
			'@/component/afterSaleManagement/returnChange/returnChangeDetail.vue'
		),
		meta: {
			title: '押货换货详情',
			requireAuth: true,
		}
	},
	{
		path: 'return_change_printing',
		component: () => import(
			/* webpackChunkName: 'AfterSale-returnChangePrinting' */
			'@/component/afterSaleManagement/returnChange/returnChangePrinting.vue'
		),
		meta: {
			title: '押货换货单审批表打印',
		}
	},
	{
		path: 'cargo_damage_list',
		component: () => import(
			/* webpackChunkName: 'AfterSale-cargoDamageList' */
			'@/component/afterSaleManagement/cargoDamage/cargoDamageList.vue'
		),
		meta: {
			title: '货损货差列表',
			requireAuth: true
		}
	},
	{
		path: 'cargo_damage_detail',
		component: () => import(
			/* webpackChunkName: 'AfterSale-cargoDamageDetail' */
			'@/component/afterSaleManagement/cargoDamage/cargoDamageDetail.vue'
		),
		meta: {
			title: '货损货差详情'
		}
	},
	{
		path: 'cargo_damage_creat',
		component: () => import(
			/* webpackChunkName: 'AfterSale-cargoDamageCreat' */
			'@/component/afterSaleManagement/cargoDamage/cargoDamageCreat.vue'
		),
		meta: {
			title: '新建货损货差'
		}
	},
]
