// 顾客订单
const AsyncCustomerOrder = () => import(
	/* webpackChunkName: 'Order-customerOrder'*/
	'@/component/orderManagement/customerOrder/customerOrder.vue'
);
// 发货物流查询
const AsyncDeliverShipmentQuery = () => import(
	/* webpackChunkName: 'Order-deliverShipmentQuery'*/
	'@/component/orderManagement/deliverShipmentQuery.vue'
);
// 顾客订单详情
const CustomerOrderDetail = () => import(
	/* webpackChunkName: 'Order-customerOrderDetail'*/
	'@/component/orderManagement/customerOrder/unit/customerOrderDetail.vue'
)
// 申请退货/退款
const ApplyReturn = () => import(
	/* webpackChunkName: 'Order-applyReturn'*/
	'@/component/orderManagement/customerOrder/unit/applyReturn.vue'
)
// 申请换货
const ApplyExchange = () => import(
	/* webpackChunkName: 'Order-applyExchange'*/
	'@/component/orderManagement/customerOrder/unit/applyExchange.vue'
)
// 团购单管理
const GroupBuyOrder = () => import(
	/* webpackChunkName: 'Order-groupOrder'*/
	'@/component/orderManagement/groupBuyOrder/groupBuyOrder.vue'
);
// 团购单详情
const GroupBuyOrderDetail = () => import(
	/* webpackChunkName: 'Order-groupBuyOrderDetail'*/
	'@/component/orderManagement/groupBuyOrder/unit/groupBuyOrderDetail.vue'
);
// 团购单详情
const GroupBuyOrderDeclarationDetails = () => import(
	/* webpackChunkName: 'Order-GroupBuyOrderDeclarationDetails'*/
	'@/component/orderManagement/groupBuyOrder/unit/declarationDetails.vue'
);
// 编辑团购单
const EditGroupBuyOrder = () => import(
	/* webpackChunkName: 'Order-editGroupBuyOrder'*/
	'@/component/orderManagement/groupBuyOrder/unit/editGroupBuyOrder.vue'
);
// 云商补报管理
const ServiceCompanyRemedyManage = () => import(
	/* webpackChunkName: 'Order-groupBuyOrderStockDetail'*/
	'@/component/orderManagement/serviceCompanyRemedyManage/serviceCompanyRemedyManage.vue'
)
// 新增云商补报
const AddServiceCompanyRemedy = () => import(
	/* webpackChunkName: 'Order-groupBuyOrderStockDetail'*/
	'@/component/orderManagement/serviceCompanyRemedyManage/addServiceCompanyRemedy.vue'
)
// 隔月开票审批
const BimonthlyInvoiceApprover = () => import(
	/* webpackChunkName: 'Order-bimonthlyList'*/
	'@/component/orderManagement/bimonthlyInvoiceApprover/bimonthlyList.vue'
)
// 结算后销售调整
const adjustmentList = () => import(
	/* webpackChunkName: 'Order-adjustmentList'*/
	'@/component/orderManagement/settlementSalesAdjustment/adjustmentList.vue'
)
// 结算后销售调整 批量导入
const adjustmentImport = () => import(
	/* webpackChunkName: 'Order-adjustmentImport'*/
	'@/component/orderManagement/settlementSalesAdjustment/adjustmentImport.vue'
)

// 结算后销售调整 单独新增
const addAdjustment = () => import(
	/* webpackChunkName: 'Order-addAdjustment'*/
	'@/component/orderManagement/settlementSalesAdjustment/addAdjustment.vue'
)

export default [
	{
		path: "customer_order",
		component: AsyncCustomerOrder,
		meta: {
			title: '顾客订单',
			requireAuth: true,
		}
	},
	{
		path: "deliver_shipment_query",
		component: AsyncDeliverShipmentQuery,
		meta: {
			title: '发货物流查询',
		}
	},
	{
		path: "customer_order_detail",
		component: CustomerOrderDetail,
		meta: {
			title: '顾客订单详情',
			requireAuth: true,
		}
	},
	{
		path: "apply_return",
		component: ApplyReturn,
		meta: {
			title: '申请退货/退款'
		}
	},
	{
		path: "apply_exchange",
		component: ApplyExchange,
		meta: {
			title: '申请换货'
		}
	},
	{
		path: "group_buy_order",
		component: GroupBuyOrder,
		meta: {
			title: '团购订单',
			requireAuth: true
		}
	},
	{
		path: "group_buy_order_detail",
		component: GroupBuyOrderDetail,
		meta: {
			title: '团购订单详情',
			requireAuth: true,
		}
	},
	{
		path: "group_buy_order_declaration_details",
		component: GroupBuyOrderDeclarationDetails,
		meta: {
			title: '分批报单明细',
		}
	},
	{
		path: "edit_group_buy_order",
		component: EditGroupBuyOrder,
		meta: {
			title: '编辑团购订单'
		}
	},
	{
		path: "/service_company_remedy_management",
		component: ServiceCompanyRemedyManage,
		meta: {
			title: '云商补报管理',
			requireAuth: true
		}
	},
	{
		path: "/add_service_company_remedy",
		component: AddServiceCompanyRemedy,
		meta: {
			title: '新增云商补报'
		}
	},
	{
		path: "/bimonthly_invoice_approver",
		component: BimonthlyInvoiceApprover,
		meta: {
			title: '隔月开票审批'
		}
	},
	{
		path: "/adjustment_list",
		component: adjustmentList,
		meta: {
			title: '结算后销售调整',
		}
	},
	{
		path: "/adjustment_import",
		component: adjustmentImport,
		meta: {
			title: '结算后销售调整批量导入',
		}
	},
	{
		path: "/add_adjustment",
		component: addAdjustment,
		meta: {
			title: '新增结算后销售调整',
		}
	},
	// 
	{
		path: "/bimonthly_invoice_approver_set",
		component: () => import(
			/* webpackChunkName: 'bimonthlyInvoiceApprover_set' */
			'@/component/orderManagement/bimonthlyInvoiceApprover/invoiceSet.vue'
		),
		meta: {
			title: '隔月开票审批设置',
		}
	},
];
