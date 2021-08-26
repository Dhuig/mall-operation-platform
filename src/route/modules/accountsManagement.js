// 财务管理路由定义

export default [
	{
		path: 'deposit_input_and_audit',
		component: () => import(
			/* webpackChunkName: 'accounts-openStoreDepositList' */
			'@/component/accountsManagement/serviceCentreAccounts/depositManagement/depositInputAndAudit.vue'
		),
		meta: {
			title: '保证金录入及审核',
			requireAuth: true
		}
	},
	{
		path: 'deposit_input_import',
		component: () => import(
			/* webpackChunkName: 'accounts-openStoreDepositList' */
			'@/component/accountsManagement/serviceCentreAccounts/depositManagement/depositInputImport.vue'
		),
		meta: {
			title: '保证金批量导入',
		}
  },
  {
		path: 'open_store_deposit_list',
		component: () => import(
			/* webpackChunkName: 'accounts-openStoreDepositList' */
			'@/component/accountsManagement/serviceCentreAccounts/depositManagement/openStoreDepositList.vue'
		),
		meta: {
			title: '保证金余额查询',
			requireAuth: true
		}
	},
	{
		path: 'deposit_balance_history_list',
		component: () => import(
			/* webpackChunkName: 'accounts-openStoreDepositHistory' */
			'@/component/accountsManagement/serviceCentreAccounts/depositManagement/depositBalanceHistoryList.vue'
		),
		meta: {
			title: '保证金余额查询【历史】',
		}
	},
  {
		path: 'open_store_deposit_detail',
		component: () => import(
			/* webpackChunkName: 'accounts-openStoreDepositDetail' */
			'@/component/accountsManagement/serviceCentreAccounts/depositManagement/openStoreDepositDetail.vue'
		),
		meta: {
			title: '开店保证金详情',
		}
	},
  {
		path: 'service_centre_mortgage_balance_list',
		component: () => import(
			/* webpackChunkName: 'accounts-serviceCentreMortgageBalanceList' */
			'@/component/accountsManagement/serviceCentreAccounts/serviceCentreMortgageBalance/serviceCentreMortgageBalanceList.vue'
		),
		meta: {
			title: '服务中心押货余额查询',
			requireAuth: true
		}
	},
  {
		path: 'service_centre_mortgage_balance_detail',
		component: () => import(
			/* webpackChunkName: 'accounts-serviceCentreMortgageBalanceDetail' */
			'@/component/accountsManagement/serviceCentreAccounts/serviceCentreMortgageBalance/serviceCentreMortgageBalanceDetail.vue'
		),
		meta: {
			title: '服务中心押货余额详情',
		}
  },
  {
		path: 'service_fee_display_switch',
		component: () => import(
			/* webpackChunkName: 'accounts-serviceFeeDisplaySwitch' */
			'@/component/accountsManagement/serviceFeeDisplaySwitch/serviceFeeDisplaySwitch.vue'
		),
		meta: {
			title: '服务中心账款',
			requireAuth: true
		}
	},
  {
		path: 'e_card_voucher_management',
		component: () => import(
			/* webpackChunkName: 'accounts-eCardVoucherManagement' */
			'@/component/accountsManagement/cardVoucherManagement/eCardVoucherManagement.vue'
		),
		meta: {
			title: '电子礼券管理',
			requireAuth: true
		}
	},
  {
		path: 'e_card_voucher_detail',
		component: () => import(
			/* webpackChunkName: 'accounts-eCardVoucherDetail' */
			'@/component/accountsManagement/cardVoucherManagement/eCardVoucherDetail.vue'
		),
		meta: {
			title: '电子礼券详情',
		}
	},
  {
		path: 'e_card_voucher_study_detail',
		component: () => import(
			/* webpackChunkName: 'accounts-eCardVoucherStudyDetail' */
			'@/component/accountsManagement/cardVoucherManagement/eCardVoucherStudyDetail.vue'
		),
		meta: {
			title: '电子礼券调查明细',
			requireAuth: true
		}
	},
  {
		path: 'freight_subsidy_voucher_management',
		component: () => import(
			/* webpackChunkName: 'accounts-freightSubsidyVoucherManagement' */
			'@/component/accountsManagement/cardVoucherManagement/freightSubsidyVoucherManagement.vue'
		),
		meta: {
			title: '运费补贴券管理',
			requireAuth: true
		}
	},
  {
		path: 'freight_subsidy_voucher_detail',
		component: () => import(
			/* webpackChunkName: 'accounts-freightSubsidyVoucherDetail' */
			'@/component/accountsManagement/cardVoucherManagement/freightSubsidyVoucherDetail.vue'
		),
		meta: {
			title: '运费补贴券详情',
		}
	},
]
