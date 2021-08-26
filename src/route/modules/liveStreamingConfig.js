export default [
  {
    path: "/live_streaming_management",
    component: () => import('@/component/liveStreamingConfig/liveStreamingManagement.vue'),
    meta: {
			title: "直播列表管理",
			requireAuth: true
    }
  }
]
