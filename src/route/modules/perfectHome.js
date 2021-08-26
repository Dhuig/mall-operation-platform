export default [
  {
		path: 'service_order_management',
		component: () => import(
			/* webpackChunkName: 'perfectHome-serviceOrderManagement' */
			'@/component/perfectHome/serviceOrderManagement/serviceOrderManagement.vue'
		),
		meta: {
			title: '服务单管理',
      requireAuth: true
		}
	},
  {
		path: 'service_order_detail',
		component: () => import(
			/* webpackChunkName: 'perfectHome-serviceOrderManagement' */
			'@/component/perfectHome/serviceOrderManagement/serviceOrderDetail.vue'
		),
		meta: {
			title: '服务单详情',
      requireAuth: true
		}
	},
  {
		path: 'service_project_detail',
		component: () => import(
			/* webpackChunkName: 'perfectHome-serviceProjectManagement' */
			'@/component/perfectHome/serviceProjectManagement/serviceProjectDetail.vue'
		),
		meta: {
			title: '服务项目管理',
      requireAuth: true
		}
	},
  {
		path: 'service_project_edit',
		component: () => import(
			/* webpackChunkName: 'perfectHome-serviceProjectManagement' */
			'@/component/perfectHome/serviceProjectManagement/serviceProjectEdit.vue'
		),
		meta: {
			title: '服务项目编辑',
      requireAuth: true
		}
	},
]