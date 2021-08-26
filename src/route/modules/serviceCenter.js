export default [
	{
		path: 'service_list',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceCenterData/serviceList.vue'
		),
		meta: {
			title: '服务中心列表查询',
			requireAuth: true,
		}
	},
	{
		path: 'service_detail',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceCenterData/serviceDetail.vue'
		),
		meta: {
			title: '服务中心详情',
			requireAuth: true,
		}
	},
	{
		path: 'service_add',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceCenterData/serviceAdd.vue'
		),
		meta: {
			title: '新增服务中心',
		}
	},
	{
		path: 'service_edit',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceCenterData/serviceAdd.vue'
		),
		meta: {
			title: '修改服务中心'
		}
	},
	{
		path: 'service_edit_leader',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceCenterData/serviceAdd.vue'
		),
		meta: {
			title: '修改负责人资料'
		}
	},
	{
		path: 'service_import',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceCenterData/serviceImport.vue'
		),
		meta: {
			title: '批量导入',
		}
	},
	{
		path: 'service_limit_list',
		component: () => import(
			/* webpackChunkName: 'System ServiceLimitList' */ 
			'@/component/serviceCenter/serviceCenterLimit/serviceLimitList.vue'
		),
		meta: {
			title: '服务中心权限配置',
			requireAuth: true
		}
	},
	{
		path: 'service_bank_list',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceCenterBank/serviceBankList.vue'
		),
		meta: {
			title: '银行账号查询列表',
			requireAuth: true
		}
	},
	{
		path: 'service_bank_detail',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceCenterBank/serviceBankDetail.vue'
		),
		meta: {
			title: '银行账号详情',
		}
	},
	{
		path: 'service_contract_list',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceCenterContract/contractList.vue'
		),
		meta: {
			title: '服务中心合同列表',
			requireAuth: true,
		}
	},
	{
		path: 'service_contract_detail',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceCenterContract/contractDetail.vue'
		),
		meta: {
			title: '服务中心合同详情',
			requireAuth: true,
		}
	},
	{
		path: 'service_contract_add',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceCenterContract/contractEdit.vue'
		),
		meta: {
			title: '新建服务中心合同',
		}
	},
	{
		path: 'service_contract_edit',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceCenterContract/contractEdit.vue'
		),
		meta: {
			title: '编辑服务中心合同',
		}
	},
	{
		path: 'service_contract_import',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceCenterContract/contractImport.vue'
		),
		meta: {
			title: '批量导入',
		}
	},
	{
		path: 'service_contract_handle',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceCenterContract/contractHandle.vue'
		),
		meta: {
			title: '操作记录',
		}
	},
	{
		path: 'service_contract_template_list',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceCenterContract/contractTemplateList.vue'
		),
		meta: {
			title: '服务中心合同模板列表',
			requireAuth: true
		}
	},
	{
		path: 'service_distribution_list',
		component: () => import(
			/* webpackChunkName: 'Service-distributionList' */ 
			'@/component/serviceCenter/serviceCenterDistribution/distributionList.vue'
		),
		meta: {
			title: '服务中心分配量',
			requireAuth: true,
		}
	},
	{
		path: 'service_distribution_detail',
		component: () => import(
			/* webpackChunkName: 'Service-distributionDetail' */ 
			'@/component/serviceCenter/serviceCenterDistribution/distributionDetail.vue'
		),
		meta: {
			title: '分配量详情',
			requireAuth: true,
		}
	},
	{
		path: 'service_distribution_import',
		component: () => import(
			/* webpackChunkName: 'Service-serviceCenterDistribution' */ 
			'@/component/serviceCenter/serviceCenterDistribution/distributionImport.vue'
		),
		meta: {
			title: '批量导入',
		}
	},
	{
		path: 'service_return_list',
		component: () => import(
			/* webpackChunkName: 'Service-serviceCenterReturn' */ 
			'@/component/serviceCenter/serviceCenterReturn/returnList.vue'
		),
		meta: {
			title: '服务中心退货额度',
			requireAuth: true
		}
	},
	{
		path: 'service_return_detail',
		component: () => import(
			/* webpackChunkName: 'Service-serviceCenterReturn' */ 
			'@/component/serviceCenter/serviceCenterReturn/returnDetail.vue'
		),
		meta: {
			title: '服务中心退货额度详情',
			requireAuth: true
		}
	},
	{
		path: 'service_return_import',
		component: () => import(
			/* webpackChunkName: 'Service-serviceCenterReturn' */ 
			'@/component/serviceCenter/serviceCenterReturn/returnImport.vue'
		),
		meta: {
			title: '批量导入',
		}
	},
	{
		path: 'service_return_over_record',
		component: () => import(
			/* webpackChunkName: 'Service-serviceCenterReturn' */ 
			'@/component/serviceCenter/serviceCenterReturn/returnOverRecord.vue'
		),
		meta: {
			title: '退货额度超额记录',
			requireAuth: true,
		}
	},

	{
		path: 'service_pledge_list',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter pledgeList' */ 
			'@/component/serviceCenter/serviceCenterPledge/pledgeList.vue'
		),
		meta: {
			title: '押货退货额度配置',
			requireAuth: true
		}
	},
	{
		path: 'pledge_import',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter pledgeImport' */ 
			'@/component/serviceCenter/serviceCenterPledge/pledgeImport.vue'
		),
		meta: {
			title: '批量导入',
		}
	},
	{
		path: 'service_grade_list',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceCenterGrade/gradeList.vue'
		),
		meta: {
			title: '服务中心星级管理',
			requireAuth: true
		}
	},
	{
		path: 'service_grade_import',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceCenterGrade/gradeImport.vue'
		),
		meta: {
			title: '批量导入',
		}
	},
	{
		path: 'service_grade_identification_list',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceCenterGrade/gradeIdentificationList.vue'
		),
		meta: {
			title: '服务中心星级标识',
			requireAuth: true
		}
	},
	{
		path: 'service_grade_identification_detail',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceCenterGrade/gradeIdentificationDetail.vue'
		),
		meta: {
			title: '服务中心星级标识详情',
			requireAuth: true
		}
	},
	{
		path: 'service_dot_maintain',
		component: () => import(
			/* webpackChunkName: 'System ServiceCenter' */ 
			'@/component/serviceCenter/serviceDotMaintain/dotMaintain.vue'
		),
		meta: {
			title: '网点类型维护',
			requireAuth: true
		}
	},

];
