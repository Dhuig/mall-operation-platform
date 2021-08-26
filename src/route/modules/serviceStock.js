
export default [
	{
		path: '/inventory_query',
		component: () => import(
			/* webpackChunkName: 'inventoryQuery'*/
			'@/component/serviceStock/inventoryQuery.vue'
		),
		meta: { title: '库存查询', requireAuth: true }
	},
	{
		path: '/inventory_history_query',
		component: () => import(
			/* webpackChunkName: 'inventoryHistoryQuery'*/
			'@/component/serviceStock/inventoryHistoryQuery.vue'
		),
		meta: { title: '库存历史月份查询',requireAuth: true } 
	},
	{
		path: '/Stock_Add_Substraction',
		component: () => import(
			/* webpackChunkName: 'stockAddSubstraction'*/
			'@/component/serviceStock/stockAddSubstraction.vue'
		),
		meta: { title: '库存增减明细' }
	},
	{
		path: '/inventory_Reconciliation',
		component: () => import(
			/* webpackChunkName: 'inventoryReconciliation'*/
			'@/component/serviceStock/inventoryReconciliation.vue'
		),
		meta: { title: '库存对账单', requireAuth: true }
	},
	{
		path: '/print_switch',
		component: () => import(
			/* webpackChunkName: 'printSwitch'*/
			'@/component/serviceStock/printSwitch.vue'
		),
		meta: { title: '库存对账单打印开关', requireAuth: true }
	},
	{
		path: '/package_Split',
		component: () => import(
			/* webpackChunkName: 'packageSplit'*/
			'@/component/serviceStock/packageSplit.vue'
		),
		meta: { title: '套装拆分', requireAuth: true }
	},
	{
		path: '/package_Retain',
		component: () => import(
			/* webpackChunkName: 'packageRetain'*/
			'@/component/serviceStock/packageRetain.vue'
		),
		meta: { title: '套装保留', requireAuth: true }
	},
	{
		path: '/package_Retain_Import',
		component: () => import(
			/* webpackChunkName: 'packageRetainImport'*/
			'@/component/serviceStock/packageRetainImport.vue'
		),
		meta: { title: '套装保留批量导入'}
	},
	{
		path: '/package_Combination',
		component: () => import(
			/* webpackChunkName: 'packageCombination'*/
			'@/component/serviceStock/packageCombination.vue'
		),
		meta: { title: '套装组合', requireAuth: true }
	},
	{
		path: '/groupBuy_Order_Management',
		component: () => import(
			/* webpackChunkName: 'groupBuyOrderManagement'*/
			'@/component/serviceStock/groupManagement/groupBuyOrderManagement.vue'
		),
		meta: { title: '团购订单库存管理', requireAuth: true }
	},
	{
		path: '/groupBuy_Order_Detail',
		component: () => import(
			/* webpackChunkName: 'groupBuyOrderStockDetail'*/
			'@/component/serviceStock/groupManagement/groupBuyOrderStockDetail.vue'
		),
		meta: { title: '报单详情' }
	},
];
