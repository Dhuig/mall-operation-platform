// 顾客管理模块路由定义
export default [
	{
		path: 'clean_personnel_list',
		component: () => import(
			/* webpackChunkName: 'Customer-normalCustomer'*/
			'@/component/perfectHome/cleanPersonnelManage/cleanPersonnelList.vue'
		),
		meta: {
			title: '清洗人员管理',
			requireAuth: true
		}
	},
	{
		path: 'clean_personnel_detail',
		component: () => import(
			/* webpackChunkName: 'Customer-discountCustomer'*/
			'@/component/perfectHome/cleanPersonnelManage/cleanPersonnelDetail.vue'
		),
		meta: {
			title: '清洗人员详情',
		}
	},
	{
		path: 'clean_personnel_agreement',
		component: () => import(
			/* webpackChunkName: 'Customer-discountCustomer'*/
			'@/component/perfectHome/cleanPersonnelManage/cleanPersonnelAgreement.vue'
		),
		meta: {
			title: '注册清洗人员协议',
		}
	},
];
