// 消息中心路由定义
export default [
	{
		path: 'system_message_management',
		component: () => import(
			/* webpackChunkName: 'MessgeCenter-systemMessgeManagement' */
			'@/component/messageCenter/systemMessageManagement/systemMessageManagement.vue'
		),
		meta: {
			title: '系统消息管理列表',
			requireAuth: true
		}
	},
	{
		path: 'sub_scene_management',
		component: () => import(
			/* webpackChunkName: 'MessgeCenter-subSceneManagement' */
			'@/component/messageCenter/systemMessageManagement/subSceneManagement.vue'
		),
		meta: {
			title: '子场景管理',
		}
	},
	{
		path: 'edit_system_message',
		component: () => import(
			/* webpackChunkName: 'MessgeCenter-editSystemMessge' */
			'@/component/messageCenter/systemMessageManagement/editSystemMessage.vue'
		),
		meta: {
			title: '编辑系统消息',
		}
	},
	{
		path: 'system_message_detail',
		component: () => import(
			/* webpackChunkName: 'MessgeCenter-systemMessgeDetail' */
			'@/component/messageCenter/systemMessageManagement/systemMessageDetail.vue'
		),
		meta: {
			title: '系统消息详情',
		}
	},
	{
		path: 'manual_message_management',
		component: () => import(
			/* webpackChunkName: 'MessgeCenter-manualMessgeManagement' */
			'@/component/messageCenter/manualMessageManagement/manualMessageManagement.vue'
		),
		meta: {
			title: '手工消息管理列表',
			requireAuth: true
		}
	},
	{
		path: 'add_edit_message',
		component: () => import(
			/* webpackChunkName: 'MessgeCenter-addEditMessge' */
			'@/component/messageCenter/manualMessageManagement/addEditMessage.vue'
		),
		meta: {
			title: '新建/编辑消息',
		}
	},
	{
		path: 'preview_message',
		component: () => import(
			/* webpackChunkName: 'MessgeCenter-previewMessge' */
			'@/component/messageCenter/manualMessageManagement/previewMessage.vue'
		),
		meta: {
			title: '预览消息',
		}
	},
	{
		path: 'message_detail',
		component: () => import(
			/* webpackChunkName: 'MessgeCenter-messgeDetail' */
			'@/component/messageCenter/manualMessageManagement/messageDetail.vue'
		),
		meta: {
			title: '消息详情',
		}
	},
	{
		path: 'message_review',
		component: () => import(
			/* webpackChunkName: 'MessgeCenter-messgeReview' */
			'@/component/messageCenter/messageReview/messageReview.vue'
		),
		meta: {
			title: '消息审核',
		},
		beforeRouteLeave() {
			// 导航离开该组件的对应路由时调用
			// 可以访问组件实例 `this`
		}
	},
	{
		path: 'message_template_management',
		component: () => import(
			/* webpackChunkName: 'MessgeCenter-messgeTemplateManagement' */
			'@/component/messageCenter/messageTemplateManagement/messageTemplateManagement.vue'
		),
		meta: {
			title: '消息模板管理列表',
			requireAuth: true
		}
	},
	{
		path: 'add_edit_message_template',
		component: () => import(
			/* webpackChunkName: 'MessgeCenter-addEditMessgeTemplate' */
			'@/component/messageCenter/messageTemplateManagement/addEditMessageTemplate.vue'
		),
		meta: {
			title: '新建/编辑消息模板',
		}
	},
	{
		path: 'preview_message_template',
		component: () => import(
			/* webpackChunkName: 'MessgeCenter-previewMessgeTemplate' */
			'@/component/messageCenter/messageTemplateManagement/previewMessageTemplate.vue'
		),
		meta: {
			title: '预览消息模板',
		}
	},
	{
		path: 'message_template_detail',
		component: () => import(
			/* webpackChunkName: 'MessgeCenter-messgeTemplateDetail' */
			'@/component/messageCenter/messageTemplateManagement/messageTemplateDetail.vue'
		),
		meta: {
			title: '消息模板详情',
		}
	},
	{
		path: 'message_type',
		component: () => import(
			/* webpackChunkName: 'MessgeCenter-messgeType' */
			'@/component/messageCenter/messageType/messageType.vue'
		),
		meta: {
			title: '消息类型',
			requireAuth: true
		}
	},
];
