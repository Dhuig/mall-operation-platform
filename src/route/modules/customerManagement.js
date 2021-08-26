// 顾客管理模块路由定义
export default [
	{
		path: 'normal_customer',
		component: () => import(
			/* webpackChunkName: 'Customer-normalCustomer'*/
			'@/component/customerManagement/normalCustomer.vue'
		),
		meta: {
			title: '普通顾客',
			requireAuth: true
		}
	},
	{
		path: 'discount_customer',
		component: () => import(
			/* webpackChunkName: 'Customer-discountCustomer'*/
			'@/component/customerManagement/discountCustomer.vue'
		),
		meta: {
			title: '优惠顾客',
			requireAuth: true
		}
	},
	{
		path: 'identity_transform_log',
		component: () => import(
			/* webpackChunkName: 'Customer-identityTransformLog'*/
			'@/component/customerManagement/identityTransformLog.vue'
		),
		meta: {
			title: '身份转换日志',
			requireAuth: true
		}
	},
	{
		path: 'cloud_management',
		component: () => import(
			/* webpackChunkName: 'Customer-cloudManagement'*/
			'@/component/customerManagement/cloudManagement.vue'
		),
		meta: {
			title: '云商/油葱微店管理',
			requireAuth: true
		}
	},
	{
		path: '/account_management_normal',
		component: () => import(
			/* webpackChunkName: 'Customer-accountManagement'*/
			'@/component/customerManagement/accountManagement.vue'
		),
		meta: {
			title: '普通顾客 -- 账户管理',
			requireAuth: true,
		}
	},
	{
		path: '/account_management_vip',
		component: () => import(
			/* webpackChunkName: 'Customer-accountManagement'*/
			'@/component/customerManagement/accountManagement.vue'
		),
		meta: {
			title: '优惠顾客 -- 账户管理',
			requireAuth: true,
		}
	},
	{
		path: '/account_management_cloud',
		component: () => import(
			/* webpackChunkName: 'Customer-accountManagement'*/
			'@/component/customerManagement/accountManagement.vue'
		),
		meta: {
			title: '云商/微店 -- 账户管理',
			requireAuth: true,
		}
	},
	{
		path: '/account_modify_changelog',
		component: () => import(
			/* webpackChunkName: 'Customer-accountModifyChangelog'*/
			'@/component/customerManagement/accountModifyChangelog.vue'
		),
		meta: {
			title: '账户修改日志',
		}
	},
	{
		path: '/business_and_customer_detail',
		component: () => import(
			/* webpackChunkName: 'Customer-businessAndCustomerDetail'*/
			'@/component/customerManagement/businessAndCustomerDetail.vue'
		),
		meta: {
			title: '业务及顾客详情'
		}
	},
	{
		path: 'sharer_log_list',
		component: () => import(
			/* webpackChunkName: 'Customer-sharerLogList'*/
			'@/component/customerManagement/sharerLogList.vue'
		),
		meta: {
			title: '分享人日志查询',
			requireAuth: true
		}
  },
  {
		path: 'customer_overview',
		component: () => import(
			/* webpackChunkName: 'Customer-customerOverview'*/
			'@/component/customerManagement/customerOverview.vue'
		),
		meta: {
			title: '顾客概览',
			requireAuth: true
		}
	},
	{
		path: 'potential_customer',
		component: () => import(
			/* webpackChunkName: 'Customer-customerOverview'*/
			'@/component/customerManagement/potentialCustomer.vue'
		),
		meta: {
			title: '潜在顾客',
			requireAuth: true
		}
	},
	{
		path: 'customer_data_modify_log',
		component: () => import(
			/* webpackChunkName: 'Customer-identityTransformLog'*/
			'@/component/customerManagement/customerDataModifyLog.vue'
		),
		meta: {
			title: '顾客资料修改日志',
			requireAuth: true
		}
	},
	{
		path: '/customer_data_modify_detail',
		component: () => import(
			/* webpackChunkName: 'Customer-accountManagement'*/
			'@/component/customerManagement/customerDataModifyDetail.vue'
		),
		meta: {
			title: '修改顾客资料详情',
		}
	},
];
