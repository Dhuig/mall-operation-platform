// 商城售后路由定义

export default [
	{
		path: "return_ticket_list",
		component: () => import(
			/* webpackChunkName: 'afterSales-returnTicketList'*/
			'@/component/afterSales/returnTicketManagement/returnTicketList.vue'
		),
		meta: {
			title: '退票管理',
			requireAuth: true
		}
	},
	{
		path: "return_ticket_details",
		component: () => import(
			/* webpackChunkName: 'afterSales-returnTicketDetails'*/
			'@/component/afterSales/returnTicketManagement/returnTicketDetails.vue'
		),
		meta: {
			title: '退票详情',
			requireAuth: true
		}
	},
	{
		path: "retrn_goods_list",
		component: () => import(
			/* webpackChunkName: 'afterSales-returnGoodsList'*/
			'@/component/afterSales/returnGoodsManagement/returnGoodsList.vue'

		),
		meta: {
			title: '顾客退货管理',
			requireAuth: true
		}
	},
	{
		path: "return_goods_details",
		component: () => import(
			/* webpackChunkName: 'afterSales-returnGoodsDetails'*/
			'@/component/afterSales/returnGoodsManagement/returnGoodsDetails.vue'
		),
		meta: {
			title: '顾客退货详情',
			requireAuth: true,
		}
	},
	{
		path: "exchange_goods_list",
		component: () => import(
			/* webpackChunkName: 'afterSales-exchangeGoodsList'*/
			'@/component/afterSales/exchangeGoodsManagement/exchangeGoodsList.vue'
		),
		meta: {
			title: '顾客换货管理',
			requireAuth: true
		}
	},
	{
		path: "exchange_goods_details",
		component: () => import(
			/* webpackChunkName: 'afterSales-exchangeGoodsDetails'*/
			'@/component/afterSales/exchangeGoodsManagement/exchangeGoodsDetails.vue'
		),
		meta: {
			title: '顾客换货详情',
			requireAuth: true,
		}
	},
	{
		path: "edit_exchange_order_details",
		component: () => import(
			/* webpackChunkName: 'afterSales-editExchangeOrderDetails'*/
			'@/component/afterSales/exchangeGoodsManagement/editExchangeOrderDetails.vue'
		),
		meta: {
			title: '编辑换货单'
		}
	},
	{
		path: "return_maintain",
		component: () => import(
			/* webpackChunkName: 'afterSales-returnMaintainManage'*/
			'@/component/afterSales/returnMaintainManage/returnMaintainManage.vue'
		),
		meta: {
			title: '返厂维修单管理',
			requireAuth: true
		}
	},
	{
		path: "add_return_maintain",
		component: () => import(
			/* webpackChunkName: 'afterSales-addReturnMaintain'*/
			'@/component/afterSales/returnMaintainManage/addReturnMaintain.vue'
		),
		meta: {
			title: '新增返厂维修单'
		}
	}, {
		path: "return_maintain_detail",
		component: () => import(
			/* webpackChunkName: 'afterSales-returnMaintainDetail'*/
			'@/component/afterSales/returnMaintainManage/returnMaintainDetail.vue'
		),
		meta: {
			title: '返厂维修单处理',
			requireAuth: true
		}
	},
	{
		path: "repair_order_list",
		component: () => import(
			/* webpackChunkName: 'afterSales-repairOrderList'*/
			'@/component/afterSales/repairOrderManage/repairOrderList.vue'
		),
		meta: {
			title: '维修单管理',
			requireAuth: true
		}
	},
	{
		path: "add_repair_order",
		component: () => import(
			/* webpackChunkName: 'afterSales-editExchangeOrder'*/
			'@/component/afterSales/repairOrderManage/addRepairOrder.vue'
		),
		meta: {
			title: '新建维修单'
		}
	},
	{
		path: "repair_order_detail",
		component: () => import(
			/* webpackChunkName: 'afterSales-repairOrderDetail'*/
			'@/component/afterSales/repairOrderManage/repairOrderDetail.vue'
		),
		meta: {
			title: '维修单详情'
		}
	},
	{
		path: "valet_service_list",
		component: () => import(
			/* webpackChunkName: 'afterSales-valetServiceList'*/
			'@/component/afterSales/valetServiceManagement/valetServiceList.vue'
		),
		meta: {
			title: '代客售后',
			requireAuth: true
		}
	},
	{
		path: "valet_service_details",
		component: () => import(
			/* webpackChunkName: 'afterSales-valetServiceDetails'*/
			'@/component/afterSales/valetServiceManagement/valetServiceDetails.vue'
		),
		meta: {
			title: '代客售后详情',
			requireAuth: true,
		}
	},
];
