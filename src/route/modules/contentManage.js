
const AsyncThemePageMangement = () => import(/* webpackChunkName: 'Content theme' */ '@/component/contentManagement/shoppingMall/themePageManagement.vue');
const AsyncUpdateThemePage = () => import(/* webpackChunkName: 'Content theme' */ '@/component/contentManagement/shoppingMall/updateThemePage.vue');
const AsyncLayerPageMangement = () => import(/* webpackChunkName: 'Content layer' */ '@/component/contentManagement/shoppingMall/layerPageMangement.vue');
const AsyncUpdateLayerPage = () => import(/* webpackChunkName: 'Content layer' */ '@/component/contentManagement/shoppingMall/updateLayerPage.vue');
const AsyncBannerMangement = () => import(/* webpackChunkName: 'Content banner' */ '@/component/contentManagement/shoppingMall/bannerMangement.vue');
const AsyncUpdateBannerPage = () => import(/* webpackChunkName: 'Content banner' */ '@/component/contentManagement/shoppingMall/updateBannerPage.vue');
const AsyncLogoMangement = () => import(/* webpackChunkName: 'Content logo' */ '@/component/contentManagement/shoppingMall/logoMangement.vue');
const AsyncLinkSetting = () => import(/* webpackChunkName: 'Content link' */ '@/component/contentManagement/shoppingMall/linkSetting.vue');
const AsyncSearchSetting = () =>  import(/* webpackChunkName: 'Content search' */ '@/component/contentManagement/searchSetting.vue');
const AsyncRecommendProductSetting = () =>  import(/* webpackChunkName: 'Content recommendProduct' */ '@/component/contentManagement/recommendProductSetting.vue');
const AsyncActivityArea = () =>  import(/* webpackChunkName: 'Content activity' */ '@/component/contentManagement/activity/activityArea.vue');
const AsyncUpdateActivePage = () =>  import(/* webpackChunkName: 'Content activity' */ '@/component/contentManagement/activity/updateActivePage.vue');
const AsyncMallAgreement = () =>  import(/* webpackChunkName: 'Content mall' */ '@/component/contentManagement/mallAgreement.vue');
const AsyncFirstClassification = () =>  import(/* webpackChunkName: 'Content classification' */ '@/component/contentManagement/firstClassification.vue')
const AsyncAppSetting = () =>  import(/* webpackChunkName: 'Content app' */ '@/component/contentManagement/appSetting/appSetting.vue')
const AsyncUpdateApp = () =>  import(/* webpackChunkName: 'Content app' */ '@/component/contentManagement/appSetting/updateApp.vue')
const layerPagePreview = () =>  import(/* webpackChunkName: 'Content app' */ '@/component/contentManagement/shoppingMall/layerPagePreview.vue')
const materialList = () => import(/* webpackChunkName: 'Content app' */ '@/component/contentManagement/material/materialList.vue')
const materialClassification = () => import(/* webpackChunkName: 'Content app' */ '@/component/contentManagement/material/materialClassification.vue')
const materialLabel = () => import(/* webpackChunkName: 'Content app' */ '@/component/contentManagement/material/materialLabel.vue')
const materiaDetails = () => import(/* webpackChunkName: 'Content app' */ '@/component/contentManagement/material/materiaDetails.vue')
const materialDownload = () => import(/* webpackChunkName: 'Content app' */ '@/component/contentManagement/material/materialDownload.vue')
const fileList = () => import(/* webpackChunkName: 'Content app' */ '@/component/contentManagement/file/fileList.vue')
const fileClassification = () => import(/* webpackChunkName: 'Content app' */ '@/component/contentManagement/file/fileClassification.vue')
const fileLabel = () => import(/* webpackChunkName: 'Content app' */ '@/component/contentManagement/file/fileLabel.vue')
const fileDetails = () => import(/* webpackChunkName: 'Content app' */ '@/component/contentManagement/file/fileDetails.vue')
export default [
	{
		path: 'theme_page_management',
		component: AsyncThemePageMangement,
		meta: {
			title: '专题页管理',
			requireAuth: true
		}
	},
	{
		path: 'update_theme_page',
		component: AsyncUpdateThemePage,
		meta: {
			title: '编辑专题页',
		}
	},
	{
		path: 'layer_page_management',
		component: AsyncLayerPageMangement,
		meta: {
			title: '楼层页管理',
			requireAuth: true
		}
	},
	{
		path: 'update_layer_page',
		component: AsyncUpdateLayerPage,
		meta: {
			title: '编辑楼层页',
		}
	},
	{
		path: 'banner_management',
		component: AsyncBannerMangement,
		meta: {
			title: '轮播图管理',
			requireAuth: true
		}
	},
	{
		path: 'update_banner_page',
		component: AsyncUpdateBannerPage,
		meta: {
			title: '编辑轮播图',
		}
	},
	{
		path: 'logo_management',
		component: AsyncLogoMangement,
		meta: {
			title: '网站logo设置',
			requireAuth: true
		}
	},
	{
		path: 'link_setting',
		component: AsyncLinkSetting,
		meta: {
			title: '底部链接名称',
			requireAuth: true
		}
	},
	{
		path: 'search_setting',
		component: AsyncSearchSetting,
		meta: {
			title: '搜索热词设置',
			requireAuth: true
		}
	},
	{
		path: 'recommend_product_setting',
		component: AsyncRecommendProductSetting,
		meta: {
			title: '推荐商品设置',
			requireAuth: true
		}
	},
	{
		path: 'activity_area',
		component: AsyncActivityArea,
		meta: {
			title: '活动专区',
			requireAuth: true
		}
	},
	{
		path: 'update_active_page',
		component: AsyncUpdateActivePage,
		meta: {
			title: '新增活动',
		}
	},
	{
		path: 'mall_agreement',
		component: AsyncMallAgreement,
		meta: {
			title: '商城协议设置',
			requireAuth: true
		}
	},
	{
		path: 'first_classification',
		component: AsyncFirstClassification,
		meta: {
			title: '一级分类设置',
			requireAuth: true
		}
	},
	{
		path: 'app_setting',
		component: AsyncAppSetting,
		meta: {
			title: 'App广告页设置',
			requireAuth: true
		}
	},
	{
		path: 'update_app',
		component: AsyncUpdateApp,
		meta: {
			title: '新增启动页',
		}
	},
	{
		path: 'layer_page_preview',
		component: layerPagePreview,
		meta: {
			title: '预览楼层页',
		}
	},
	{
		path: 'material_list',
		component: materialList,
		meta: {
			title: '素材列表',
		}
	},
	{
		path: 'material_classification',
		component: materialClassification,
		meta: {
			title: '素材分类',
		}
	},
	{
		path: 'material_label',
		component: materialLabel,
		meta: {
			title: '素材标签',
		}
	},
	{
		path: 'material_Details',
		component: materiaDetails,
		meta: {
			title: '素材详情',
		}
	},	
	{
		path: 'material_Download',
		component: materialDownload,
		meta: {
			title: '素材下载记录',
		}
	},
	{
		path: 'file_list',
		component: fileList,
		meta: {
			title: '文档列表',
		}
	},
	{
		path: 'file_classification',
		component: fileClassification,
		meta: {
			title: '文档分类',
		}
	},
	{
		path: 'file_label',
		component: fileLabel,
		meta: {
			title: '文档标签',
		}
	},
	{
		path: 'file_details',
		component: fileDetails,
		meta: {
			title: '文档详情',
    }
  },
  {
    path: 'integral_management',
    component: () => import(
      /* webpackChunkName: 'contentManagement-integral' */
      '@/component/contentManagement/integral/integralManagement.vue'
    ),
    meta: {
      title: '达标情况',
    }
  }, 
  {
    path: 'add_integral',
    component: () => import(
      /* webpackChunkName: 'contentManagement-integral' */
      '@/component/contentManagement/integral/addIntegral.vue'
    ),
    meta: {
      title: '新增任务', 
    }
  },
  {
    path: 'Integral_detail',
    component: () => import(
      /* webpackChunkName: 'contentManagement-IntegralDetail' */
      '@/component/contentManagement/integral/IntegralDetail.vue'
    ),
    meta: {
      title: '达标详情',
    }
  },
  {
    path: 'plan_managment',
    component: () => import(
      /* webpackChunkName: 'contentManagement-planManagment' */
      '@/component/contentManagement/planManagment/planManagment.vue'
    ),
    meta: {
      title: '计划管理',
    }
  },
	{
    path: 'extension_link_total',
    component: () => import(
      /* webpackChunkName: 'extension_link_total' */
      '@/component/contentManagement/extensionLinkTotal/extensionLinkTotalList.vue'
    ),
    meta: {
      title: '第三方链接统计',
    }
  }, 
	{
		path: 'extension_link_total_detail',
		component: () => import(
			/* webpackChunkName: 'extensionLinkTotalListDetail' */
			'@/component/contentManagement/extensionLinkTotal/extensionLinkTotalListDetail.vue'
		),
		meta: {
			title: '第三方链接统计详情',
		}
	},
];