// 业务大厅(服务中心)路由定义

export default [
	{
		path: 'data_change_list',
		component: () => import(
			/* webpackChunkName: 'BusinessHallForService-dataChangeList' */
			'@/component/businessHallForService/dataChangeList.vue'
		),
		meta: {
			title: '服务中心资料变更审批',
			requireAuth: true
		}
	},
	{
		path: 'data_change_list_detail',
		component: () => import(
			/* webpackChunkName: 'BusinessHallForService-dataChangeListDetail' */
			'@/component/businessHallForService/dataChangeListDetail.vue'
		),
		meta: {
			title: '服务中心资料变更审批详情',
			requireAuth: true,
		}
	},
	{
		path: 'move_approval_list',
		component: () => import(
			/* webpackChunkName: 'BusinessHallForService-moveApprovalList' */
			'@/component/businessHallForService/moveApprovalList.vue'
		),
		meta: {
			title: '搬迁申请审批',
			requireAuth: true
		}
	},
	{
		path: 'move_approval_detail',
		component: () => import(
			/* webpackChunkName: 'BusinessHallForService-moveApprovalDetail' */
			'@/component/businessHallForService/moveApprovalDetail.vue'
		),
		meta: {
			title: '搬迁申请审批详情',
			requireAuth: true,
		}
	},
	{
		path: 'ending_business_list',
		component: () => import(
			/* webpackChunkName: 'BusinessHallForService-endingBusinessList' */
			'@/component/businessHallForService/endingBusinessList.vue'
		),
		meta: {
			title: '结业审批',
			requireAuth: true
		}
	},
	{
		path: 'ending_business_detail',
		component: () => import(
			/* webpackChunkName: 'BusinessHallForService-endingBusinessDetail' */
			'@/component/businessHallForService/endingBusinessDetail.vue'
		),
		meta: {
			title: '结业审批详情',
			requireAuth: true,
		}
	},
	{
		path: 'refund_list',
		component: () => import(
			/* webpackChunkName: 'BusinessHallForService-refundList' */
			'@/component/businessHallForService/refundList.vue'
		),
		meta: {
			title: '退款审批',
			requireAuth: true
		}
	},
	{
		path: 'refund_list_detail',
		component: () => import(
			/* webpackChunkName: 'BusinessHallForService-refundListDetail' */
			'@/component/businessHallForService/refundListDetail.vue'
		),
		meta: {
			title: '退款审批详情',
			requireAuth: true,
		}
	},
	{
		path: 'company_certificate_approval_List',
		component: () => import(
			/* webpackChunkName: 'BusinessHallForService-companyCertificateApprovalList' */
			'@/component/businessHallForService/companyCertificateApprovalList.vue'
		),
		meta: {
			title: '公司证件报告审批',
			requireAuth: true
		}
	},
	{
		path: 'company_certificate_import',
		component: () => import(
			/* webpackChunkName: 'BusinessHallForService-companyCertificateImport' */
			'@/component/businessHallForService/companyCertificateImport.vue'
		),
		meta: {
			title: '公司证件报告审批批量导入',
		}
	},
	{
		path: 'company_certificate_detail',
		component: () => import(
			/* webpackChunkName: 'BusinessHallForService-companyCertificateDetail' */
			'@/component/businessHallForService/companyCertificateDetail.vue'
		),
		meta: {
			title: '公司证件报告审批详情',
			requireAuth: true,
		}
	},
	{
		path: 'pledge_adjust_list',
		component: () => import(
			/* webpackChunkName: 'BusinessHallForService-pledgeAdjustList' */
			'@/component/businessHallForService/pledgeAdjustList.vue'
		),
		meta: {
			title: '押货单调整审批',
			requireAuth: true
		}
	},
	{
		path: 'pledge_adjust_detail',
		component: () => import(
			/* webpackChunkName: 'BusinessHallForService-pledgeAdjustDetail' */
			'@/component/businessHallForService/pledgeAdjustDetail.vue'
		),
		meta: {
			title: '押货单调整审批详情',
			requireAuth: true,
		}
	},
	{
		path: 'other_approval_list',
		component: () => import(
			/* webpackChunkName: 'BusinessHallForService-otherApprovalList' */
			'@/component/businessHallForService/otherApprovalList.vue'
		),
		meta: {
			title: '其它审批',
			requireAuth: true
		}
	},
	{
		path: 'other_approval_list_detail',
		component: () => import(
			/* webpackChunkName: 'BusinessHallForService-otherApprovalListDetail' */
			'@/component/businessHallForService/otherApprovalListDetail.vue'
		),
		meta: {
			title: '其它审批详情',
			requireAuth: true,
		}
	},
	{
		path: 'product_report_approval',
		component: () => import(
			/* webpackChunkName: 'BusinessHallForService-productReportApproval' */
			'@/component/businessHallForService/productReportApproval.vue'
		),
		meta: {
			title: '成品报告审批',
			requireAuth: true,
		}
	},
	{
		path: 'product_report_import',
		component: () => import(
			/* webpackChunkName: 'BusinessHallForService-productReportImport' */
			'@/component/businessHallForService/productReportImport.vue'
		),
		meta: {
			title: '成品报告审批导入',
		}
	},
	{
		path: 'product_report_detail',
		component: () => import(
			/* webpackChunkName: 'BusinessHallForService-productReportDetail' */
			'@/component/businessHallForService/productReportDetail.vue'
		),
		meta: {
			title: '成品报告审批详情',
			requireAuth: true,
		}
	},
];
