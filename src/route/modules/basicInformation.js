
// 基础信息路由定义

export default [
	// 分公司
	{
		path: 'branch_list',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-branchList' */
			'@/component/basicInformation/branchManagement/branchList.vue'
		),
		meta: {
			title: '分公司列表',
			requireAuth: true
		}
	},
	{
		path: 'branch_detail',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-branchDetail' */
			'@/component/basicInformation/branchManagement/branchDetail.vue'
		),
		meta: {
			title: '分公司详情',
			requireAuth: true,
		}
	},
	{
		path: 'update_branch',
		component: () => import(/* webpackChunkName: 'BasicInformation-updateBranch' */
			'@/component/basicInformation/branchManagement/updateBranch.vue'
		),
		meta: {
			title: '新增/修改 分公司'
		}
	},
	{
		path: 'business_area',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-businessArea' */
			'@/component/basicInformation/branchManagement/businessArea.vue'
		),
		meta: {
			title: '业务区域范围选择'
		}
	},
	// 基础信息
	{
		path: 'return_settings',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-returnSettings' */
			'@/component/basicInformation/baseSetting/returnSettings.vue'
		),
		meta: {
			title: '订单超时设置',
			requireAuth: true
		}
	},
	{
		path: 'reason_manage',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-reasonManage' */
			'@/component/basicInformation/baseSetting/reasonManage.vue'
		),
		meta: {
			title: '退换货原因管理',
			requireAuth: true
		}
	},
	{
		path: 'payment_type',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-paymentType' */
			'@/component/basicInformation/baseSetting/paymentType.vue'
		),
		meta: {
			title: '支付方式设置',
			requireAuth: true
		}
	},
	{
		path: 'set_month_end_time',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-setMonthEndTime' */
			'@/component/basicInformation/baseSetting/setMonthEndTime.vue'
		),
		meta: {
			title: '设置隔月退货时间',
			requireAuth: true
		}
	},
	{
		path: 'remit_type',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-remitType' */
			'@/component/basicInformation/baseSetting/remitType.vue'
		),
		meta: {
			title: '汇款类型设置',
			requireAuth: true
		}
	},
	{
		path: 'duty_rate',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-dutyRate' */
			'@/component/basicInformation/baseSetting/dutyRate.vue'
		),
		meta: {
			title: '税率设置',
			requireAuth: true
		}
	},
	{
		path: 'shipping_template',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-shippingTemplate' */
			'@/component/basicInformation/baseSetting/shippingTemplate.vue'
		),
		meta: {
			title: '运费模板设置',
			requireAuth: true
		}
	},
	{
		path: 'update_shipping_template',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-updateShippingTemplate' */
			'@/component/basicInformation/baseSetting/updateShippingTemplate.vue'
		),
		meta: {
			title: '新增/编辑 按件数创建运费模板'
		}
	},
	{
		path: 'delivery_method',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-deliveryMethod' */
			'@/component/basicInformation/baseSetting/deliveryMethod.vue'
		),
		meta: {
			title: '物流方式管理',
			requireAuth: true
		}
	},
	{
		path: 'monthly_pay',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-monthlyPay' */
			'@/component/basicInformation/baseSetting/monthlyPay.vue'
		),
		meta: {
			title: '补报单月结日期',
			requireAuth: true
		}
	},
	// 地区信息管理
	{
		path: 'area_manage',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-areaManageList' */
			'@/component/basicInformation/areaManage/areaManageList.vue'
		),
		meta: {
			title: '地区信息管理',
			requireAuth: true
		}
	},
	{
		path: 'update_area_manage',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-updateAreaManage' */
			'@/component/basicInformation/areaManage/updateAreaManage.vue'
		),
		meta: {
			title: '添加/编辑地区'
		}
	},
	// 业务区域范围管理
	{
		path: 'business_area_scope_list',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-areaManageList' */
			'@/component/basicInformation/businessAreaScopeManage/businessAreaScopeList.vue'
		),
		meta: {
			title: '业务区域范围管理',
			requireAuth: true
		}
	},
	{
		path: 'business_area_scope_detail',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-areaManageList' */
			'@/component/basicInformation/businessAreaScopeManage/businessAreaScopeDetail.vue'
		),
		meta: {
			title: '业务区域范围详情',
		}
	},
	// 仓库管理
	{
		path: 'store_manage',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-storeManageList' */
			'@/component/basicInformation/storeManage/storeManageList.vue'
		),
		meta: {
			title: '仓库管理',
			requireAuth: true,
		}
	},
	{
		path: 'distribution_area',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-distributionArea' */
			'@/component/basicInformation/storeManage/distributionArea.vue'
		),
		meta: {
			title: '查看/编辑 配送区域',
			requireAuth: true,
		}
	},
	// 公司证件类型管理
	{
		path: 'certificate_type',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-certificateTypeList' */
			'@/component/basicInformation/certificateType/certificateTypeList.vue'
		),
		meta: {
			title: '公司证件类型管理',
			requireAuth: true
		}
	},
	// 公司证件管理
	{
		path: 'certificate_manage',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-certificateManageList' */
			'@/component/basicInformation/certificateManage/certificateManageList.vue'
		),
		meta: {
			title: '公司证件管理',
			requireAuth: true
		}
	},
	// 配件管理
	{
		path: 'parts_manage',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-partsManageList' */
			'@/component/basicInformation/partsManage/partsManageList.vue'
		),
		meta: {
			title: '配件管理',
			requireAuth: true
		}
	},
	// 节假日管理
	{
		path: 'holiday_manage',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-holidayManageList' */
			'@/component/basicInformation/holidayManage/holidayManageList.vue'
		),
		meta: {
			title: '节假日管理',
			requireAuth: true
		}
	},
	{
		path: 'holiday_manage_import',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-holidayManageImport' */
			'@/component/basicInformation/holidayManage/holidayManageImport.vue'
		),
		meta: {
			title: '批量导入节假日'
		}
	},
	{
		path: 'return_notice',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-baseSetting' */
			'@/component/basicInformation/baseSetting/returnNotice.vue'
		),
		meta: {
			title: '退换货须知管理',
			requireAuth: true
		}
	},
	{
		path: 'return_notice_detail',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-baseSetting' */
			'@/component/basicInformation/baseSetting/returnNoticeDetail.vue'
		),
		meta: {
			title: '退货须知详情'
		}
	},
	{
		path: 'logistics_style_management',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-baseSetting' */
			'@/component/basicInformation/baseSetting/logisticsStyleManagement.vue'
		),
		meta: {
			title: '物流方式管理',
			requireAuth: true
		}
	},
	{
		path: 'product_report_management',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-productReportManagement' */
			'@/component/basicInformation/baseSetting/productReportManagement.vue'
		),
		meta: {
			title: '成品报告管理',
			requireAuth: true
		}
	},
	{
		path: 'table_management',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-tableManagement' */
			'@/component/basicInformation/tableManagement/tableManagement.vue'
		),
		meta: {
			title: '表格管理',
			requireAuth: true
		}
	},
	{
		path: 'table_type',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-tableType' */
			'@/component/basicInformation/tableManagement/tableType.vue'
		),
		meta: {
			title: '表格类型管理',
			requireAuth: false
		}
  }, 
	{
		path: 'app_version_management',
		component: () => import(
			/* webpackChunkName: 'BasicInformation-appVersionManagement' */
			'@/component/basicInformation/appVersionManagement/appVersionManagement.vue'
		),
		meta: {
      title: 'APP版本管理', 
			requireAuth: true
		}
  }, 
	{
    path: 'image_hand_book',
    component: () => import(
      /* webpackChunkName: 'BasicInformation-imageHandbook' */
      '@/component/basicInformation/imageHandbook/imageHandbook.vue'
    ),
    meta: {
      title: '形象手册管理',
      requireAuth: true
    }
  },
  {
    path: 'image_book_record',
    component: () => import(
      /* webpackChunkName: 'BasicInformation-imageBookRecord' */
      '@/component/basicInformation/imageHandbook/imageBookRecord.vue'
    ),
    meta: {
      title: '形象手册下载记录',
    }
  }
];
