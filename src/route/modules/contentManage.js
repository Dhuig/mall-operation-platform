
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
			title: '???????????????',
			requireAuth: true
		}
	},
	{
		path: 'update_theme_page',
		component: AsyncUpdateThemePage,
		meta: {
			title: '???????????????',
		}
	},
	{
		path: 'layer_page_management',
		component: AsyncLayerPageMangement,
		meta: {
			title: '???????????????',
			requireAuth: true
		}
	},
	{
		path: 'update_layer_page',
		component: AsyncUpdateLayerPage,
		meta: {
			title: '???????????????',
		}
	},
	{
		path: 'banner_management',
		component: AsyncBannerMangement,
		meta: {
			title: '???????????????',
			requireAuth: true
		}
	},
	{
		path: 'update_banner_page',
		component: AsyncUpdateBannerPage,
		meta: {
			title: '???????????????',
		}
	},
	{
		path: 'logo_management',
		component: AsyncLogoMangement,
		meta: {
			title: '??????logo??????',
			requireAuth: true
		}
	},
	{
		path: 'link_setting',
		component: AsyncLinkSetting,
		meta: {
			title: '??????????????????',
			requireAuth: true
		}
	},
	{
		path: 'search_setting',
		component: AsyncSearchSetting,
		meta: {
			title: '??????????????????',
			requireAuth: true
		}
	},
	{
		path: 'recommend_product_setting',
		component: AsyncRecommendProductSetting,
		meta: {
			title: '??????????????????',
			requireAuth: true
		}
	},
	{
		path: 'activity_area',
		component: AsyncActivityArea,
		meta: {
			title: '????????????',
			requireAuth: true
		}
	},
	{
		path: 'update_active_page',
		component: AsyncUpdateActivePage,
		meta: {
			title: '????????????',
		}
	},
	{
		path: 'mall_agreement',
		component: AsyncMallAgreement,
		meta: {
			title: '??????????????????',
			requireAuth: true
		}
	},
	{
		path: 'first_classification',
		component: AsyncFirstClassification,
		meta: {
			title: '??????????????????',
			requireAuth: true
		}
	},
	{
		path: 'app_setting',
		component: AsyncAppSetting,
		meta: {
			title: 'App???????????????',
			requireAuth: true
		}
	},
	{
		path: 'update_app',
		component: AsyncUpdateApp,
		meta: {
			title: '???????????????',
		}
	},
	{
		path: 'layer_page_preview',
		component: layerPagePreview,
		meta: {
			title: '???????????????',
		}
	},
	{
		path: 'material_list',
		component: materialList,
		meta: {
			title: '????????????',
		}
	},
	{
		path: 'material_classification',
		component: materialClassification,
		meta: {
			title: '????????????',
		}
	},
	{
		path: 'material_label',
		component: materialLabel,
		meta: {
			title: '????????????',
		}
	},
	{
		path: 'material_Details',
		component: materiaDetails,
		meta: {
			title: '????????????',
		}
	},	
	{
		path: 'material_Download',
		component: materialDownload,
		meta: {
			title: '??????????????????',
		}
	},
	{
		path: 'file_list',
		component: fileList,
		meta: {
			title: '????????????',
		}
	},
	{
		path: 'file_classification',
		component: fileClassification,
		meta: {
			title: '????????????',
		}
	},
	{
		path: 'file_label',
		component: fileLabel,
		meta: {
			title: '????????????',
		}
	},
	{
		path: 'file_details',
		component: fileDetails,
		meta: {
			title: '????????????',
    }
  },
  {
    path: 'integral_management',
    component: () => import(
      /* webpackChunkName: 'contentManagement-integral' */
      '@/component/contentManagement/integral/integralManagement.vue'
    ),
    meta: {
      title: '????????????',
    }
  }, 
  {
    path: 'add_integral',
    component: () => import(
      /* webpackChunkName: 'contentManagement-integral' */
      '@/component/contentManagement/integral/addIntegral.vue'
    ),
    meta: {
      title: '????????????', 
    }
  },
  {
    path: 'Integral_detail',
    component: () => import(
      /* webpackChunkName: 'contentManagement-IntegralDetail' */
      '@/component/contentManagement/integral/IntegralDetail.vue'
    ),
    meta: {
      title: '????????????',
    }
  },
  {
    path: 'plan_managment',
    component: () => import(
      /* webpackChunkName: 'contentManagement-planManagment' */
      '@/component/contentManagement/planManagment/planManagment.vue'
    ),
    meta: {
      title: '????????????',
    }
  },
	{
    path: 'extension_link_total',
    component: () => import(
      /* webpackChunkName: 'extension_link_total' */
      '@/component/contentManagement/extensionLinkTotal/extensionLinkTotalList.vue'
    ),
    meta: {
      title: '?????????????????????',
    }
  }, 
	{
		path: 'extension_link_total_detail',
		component: () => import(
			/* webpackChunkName: 'extensionLinkTotalListDetail' */
			'@/component/contentManagement/extensionLinkTotal/extensionLinkTotalListDetail.vue'
		),
		meta: {
			title: '???????????????????????????',
		}
	},
];