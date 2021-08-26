// 产品管理路由定义

export default [
	{
		path: 'product_management',
		component: () => import(
			/* webpackChunkName: 'Product-productManagement' */
			'@/component/productAndStock/product/productManagement.vue'
		),
		meta: {
			title: '产品管理',
			requireAuth: true
		}
	},
	{
		path: "/product_config",
		component: () => import(
			/* webpackChunkName: 'Product-productConfig' */
			'@/component/productAndStock/product/productConfig.vue'
		),
		meta: {
			title: '产品配置',
			requireAuth: true
		}
	},
	{
		path: 'sales_stock_control',
		component: () => import(
			/* webpackChunkName: 'Product-salesStockControl' */
			'@/component/productAndStock/product/salesStockControl.vue'
		),
		meta: {
			title: '销售库存控制',
			requireAuth: true
		}
	},
	{
		path: 'sales_stock_control_changelog',
		component: () => import(
			/* webpackChunkName: 'Product-salesStockControlChangelog' */
			'@/component/productAndStock/product/salesStockControlChangelog.vue'
		),
		meta: {
			title: '销售库存控制变更日志'
		}
	},
	{
		path: "/product_detail",
		component: () => import(
			/* webpackChunkName: 'Product-productDetail' */
			'@/component/productAndStock/product/productDetail.vue'
		),
		meta: {
			title: '产品详情'
		}
	},
	{
		path: "/product_info_validate",
		component: () => import(
			/* webpackChunkName: 'Product-productInfoValidate' */
			'@/component/productAndStock/product/productInfoValidate.vue'
		),
		meta: {
			title: '产品信息审核列表',
			requireAuth: true
		}
	},
	{
		path: "/product_info_validate_detail",
		component: () => import(
			/* webpackChunkName: 'Product-productInfoValidateDetail' */
			'@/component/productAndStock/product/productInfoValidateDetail.vue'
		),
		meta: {
			title: '产品信息审核'
		}
	},
	{
		path: "/product_history",
		component: () => import(
			/* webpackChunkName: 'Product-productHistory' */
			'@/component/productAndStock/product/productHistory.vue'
		),
		meta: {
			title: '产品历史日志'
		}
	},
	{
		path: "/service_centre_allocation",
		component: () => import(
			/* webpackChunkName: 'Product-serviceCentreAllocation' */
			'@/component/productAndStock/serviceCentreAllocation/serviceCentreAllocation.vue'
		),
		meta: {
			title: '服务中心分配量',
			requireAuth: true,
		}
	},
	{
		path: "/service_centre_allocation_detail",
		component: () => import(
			/* webpackChunkName: 'Product-serviceCentreAllocationDetail' */
			'@/component/productAndStock/serviceCentreAllocation/serviceCentreAllocationDetail.vue'
		),
		meta: {
			title: '服务中心分配详情',
			requireAuth: true,
		}
	},
];
