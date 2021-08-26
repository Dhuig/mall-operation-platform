// 会员管理路由定义

export default [
	{
		path: "/member_list",
		component: () => import(
			/* webpackChunkName: 'CRM-MemberList'*/
			'@/component/customerRelationshipMangement/memberList.vue'
		),
		meta: {
			title: "会员列表",
			requireAuth: true
		},
	},
	{
		path: "/make_discount_card",
		component: () => import(
			/* webpackChunkName: 'CRM-MakeDiscountCard'*/
			'@/component/customerRelationshipMangement/makeDiscountCard.vue'
		),
		meta: {
			title: "新开/编辑/查看 优惠卡"
		},
	},
	{
		path: "/batch_import_bankcard",
		component: () => import(
			/* webpackChunkName: 'CRM-MakeDiscountCard'*/
			'@/component/customerRelationshipMangement/batchImport.vue'
		),
		meta: {
			title: "批量导入"
		},
	},
	{
		path: "/bankcard_list",
		component: () => import(
			/* webpackChunkName: 'CRM-BankCardList'*/
			'@/component/customerRelationshipMangement/bankCardList.vue'
		),
		meta: {
			title: "银行卡管理",
			requireAuth: true
		},
	},
	{
		path: "/bank_of_deposit_manage",
		component: () => import(
			/* webpackChunkName: 'CRM-BankCardList'*/
			'@/component/customerRelationshipMangement/bankOfDepositManage.vue'
		),
		meta: {
			title: "开户银行管理",
			requireAuth: true
		},
	},
	
	{
		path: "/bankcard_detail",
		component: () => import(
			/* webpackChunkName: 'CRM-BankDetail'*/
			'@/component/customerRelationshipMangement/bankCardDetail.vue'
		),
		meta: {
			title: "银行卡详情"
		},
	},
	{
		path: "/bankcard_import",
		component: () => import(
			/* webpackChunkName: 'CRM-BankCardImport'*/
			'@/component/customerRelationshipMangement/bankCardImport.vue'
		),
		meta: {
			title: "批量导入"
		},
	},
	{
		path: "/service_company_update",
		component: () => import(
			/* webpackChunkName: 'CRM-ServiceCompanyUpdate'*/
			'@/component/customerRelationshipMangement/serviceCompanyUpdate.vue'
		),
		meta: {
			title: "新增/编辑/查看 服务公司管理"
		},
	},
	{
		path: "/service_company_mange",
		component: () => import(
			/* webpackChunkName: 'CRM-ServiceCompanyMange'*/
			'@/component/customerRelationshipMangement/serviceCompanyMange.vue'
		),
		meta: {
			title: "服务公司管理",
			requireAuth: true
		},
	},
	// {
	// 	path: "/service_company_setting",
	// 	component: () => import(
	// 		/* webpackChunkName: 'CRM-ServiceCompanySetting'*/
	// 		'@/component/customerRelationshipMangement/serviceCompanySetting.vue'
	// 	),
	// 	meta: {
	// 		title: "服务公司设置"
	// 	},
	// },
	{
		path: "/member_card_log",
		component: () => import(
			/* webpackChunkName: 'CRM-memberCardLog'*/
			'@/component/customerRelationshipMangement/memberCardLog.vue'
		),
		meta: {
			title: "会员卡日志"
		},
	},
	{
		path: "/member_pv_list",
		component: () => import(
			/* webpackChunkName: 'CRM-MemberList'*/
			'@/component/customerRelationshipMangement/memberPvList.vue'
		),
		meta: {
			title: "会员卡PV",
			requireAuth: false
		},
	},
	{
		path: "/member_pv_detail",
		component: () => import(
			/* webpackChunkName: 'CRM-MemberList'*/
			'@/component/customerRelationshipMangement/memberPvDetail.vue'
		),
		meta: {
			title: "会员卡PV详情",
			requireAuth: false
		},
	},
];
