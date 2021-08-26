// 公告路由定义
export default [
	{
		path: 'announcement_management',
		component: () => import(
			/* webpackChunkName: 'AnnouncementCenter-announcementManagement' */
			'@/component/announcementCenter/announcementManagement/announcementManagement.vue'
		),
		meta: {
			title: '公告管理列表',
			requireAuth: true
		}
	},
	{
		path: 'add_edit_announcement',
		component: () => import(
			/* webpackChunkName: 'AnnouncementCenter-addEditAnnouncement' */
			'@/component/announcementCenter/announcementManagement/addEditAnnouncement.vue'
		),
		meta: {
			title: '新建/编辑公告',
		}
	},
	{
		path: 'announcement_detail',
		component: () => import(
			/* webpackChunkName: 'AnnouncementCenter-announcementDetail' */
			'@/component/announcementCenter/announcementManagement/announcementDetail.vue'
		),
		meta: {
			title: '公告详情',
		}
	},
	{
		path: 'preview_announcement',
		component: () => import(
			/* webpackChunkName: 'AnnouncementCenter-previewAnnouncement' */
		'@/component/announcementCenter/announcementManagement/previewAnnouncement.vue'
		),
		meta: {
			title: '预览公告',
		}
	},
	{
		path: 'announcement_preview',
		component: () => import(
			/* webpackChunkName: 'AnnouncementCenter-announcementPreview' */
			'@/component/announcementCenter/announcementPreview/announcementPreview.vue'
		),
		meta: {
			title: '公告审核',
		}
	},
	{
		path: 'announcement_type',
		component: () => import(
			/* webpackChunkName: 'AnnouncementCenter-announcementType' */
			'@/component/announcementCenter/announcementType/announcementType.vue'
		),
		meta: {
			title: '公告类型',
			requireAuth: true
		}
	},
];
