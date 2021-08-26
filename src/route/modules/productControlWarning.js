export default [
  {
		path: 'product_control_list',
		component: () => import(
			/* webpackChunkName: 'productControlWarning-productControlList' */
			'@/component/dataOperationCenter/productControlWarning/productControlList.vue'
		),
		meta: {
			title: '产品管控预警列表',
      requireAuth: true
		}
	},
  {
		path: 'product_control_add_rule',
		component: () => import(
			/* webpackChunkName: 'productControlWarning-productControlAddRule' */
			'@/component/dataOperationCenter/productControlWarning/productControlAddRule/productControlAddRule.vue'
		),
		meta: {
			title: '新建产品预警规则'
		}
	},
  {
		path: 'product_control_detail',
		component: () => import(
			/* webpackChunkName: 'productControlWarning-productControlAddRule' */
			'@/component/dataOperationCenter/productControlWarning/productControlDetail/productControlDetail.vue'
		),
		meta: {
			title: '产品预警详情'
		}
	},
  {
		path: 'warning_detailed_list',
		component: () => import(
			/* webpackChunkName: 'productControlWarning-warningDetailedList' */
			'@/component/dataOperationCenter/productControlWarning/productControlDetail/warningDetailedList.vue'
		),
		meta: {
			title: '预警清单明细'
		}
	},
	// todo 用户增长数据
  {
		path: 'user_add_data',
		component: () => import(
			/* webpackChunkName: 'userOperationData-userAddData' */
			'@/component/dataOperationCenter/userOperationData/userAddData.vue'
		),
		meta: {
			title: '用户增长数据'
		}
	},
  {
		path: 'user_add_detail',
		component: () => import(
			/* webpackChunkName: 'userOperationData-userAddDetail' */
			'@/component/dataOperationCenter/userOperationData/userAddDetail.vue'
		),
		meta: {
			title: '新增用户明细'
		}
	},
  {
		path: 'handler_detail',
		component: () => import(
			/* webpackChunkName: 'userOperationData-handlerDetail' */
			'@/component/dataOperationCenter/userOperationData/handlerDetail.vue'
		),
		meta: {
			title: '经办人明细'
		}
	},
	// todo 订单数据
  {
		path: 'order_overview',
		component: () => import(
			/* webpackChunkName: 'orderData-orderOverview' */
			'@/component/dataOperationCenter/orderData/orderOverview.vue'
		),
		meta: {
			title: '订单概览'
		}
	},
]