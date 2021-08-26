export default [
	{
		path: 'finance_balance_list',
		component: () => import(
			/* webpackChunkName: 'Finance BalanceWithdrawalList' */
			'@/component/financialManagement/balanceWithdrawal/balanceWithdrawalList.vue'
		),
		meta: {
			title: '余额提现审批',
			requireAuth: true
		}
	},
	{
		path: 'finance_balance_detail',
		component: () => import(
			/* webpackChunkName: 'Finance BalanceWithdrawalDetail' */
			'@/component/financialManagement/balanceWithdrawal/balanceWithdrawalDetail.vue'
		),
		meta: {
			title: '余额提现详情'
		}
	},
	{
		path: 'finance_balance_withdrawal_limit',
		component: () => import(
			/* webpackChunkName: 'Finance configBalanceWithdrawalLimit' */
			'@/component/financialManagement/balanceWithdrawal/configBalanceWithdrawalLimit.vue'
		),
		meta: {
			title: '配置提现申请限额'
		}
	},

	{
		path: 'perfect_wallet',
		component: () => import(
			/* webpackChunkName: 'System User' */ 
			'@/component/financialManagement/perfectWallet/perfectWalletList.vue'
		),
		meta: {
			title: '完美钱包管理',
			requireAuth: true
		}
	},
	{
		path: 'perfect_wallet_detail',
		component: () => import(
			/* webpackChunkName: 'System User' */ 
			'@/component/financialManagement/perfectWallet/perfectWalletDetail.vue'
		),
		meta: {
			title: '钱包交易明细'
		}
	},
	{
		path: 'product_price_checkList',
		component: () => import(
			/* webpackChunkName: 'Finance ProductPriceCheckList'*/
			'@/component/financialManagement/productPriceCheck/productPriceCheckList.vue'
		),
		meta: {
			title: '产品价格审核列表',
			requireAuth: true
		}
	},
	{
		path: 'product_price_check',
		component: () => import(
			/* webpackChunkName: 'Finance ProductPriceCheck'*/
			'@/component/financialManagement/productPriceCheck/productPriceCheck.vue'
		),
		meta: {
			title: '产品价格审核'
		}
	},
	{
		path: 'payment_channel',
		component: () => import(
			/* webpackChunkName: 'Finance PaymentChannel'*/
			'@/component/financialManagement/paymentChannel/paymentChannel.vue'
		),
		meta: {
			title: '支付渠道对账',
			requireAuth: true
		},
	},
	{
		path: 'bank_remittance_flow',
		component: () => import(
			/* webpackChunkName: 'Finance serviceCentreBankRemittance' */ 
			'@/component/financialManagement/serviceCentreBankRemittance/bankRemittanceFlow.vue'
		),
		meta: {
			title: '银行汇款流水',
			requireAuth: true
		}
	},
	{
		path: 'unknown_flow_deal',
		component: () => import(
			/* webpackChunkName: 'Finance serviceCentreBankRemittance' */ 
			'@/component/financialManagement/serviceCentreBankRemittance/unknownFlowDeal.vue'
		),
		meta: {
			title: '无法识别流水处理',
			requireAuth: true
		}
	},
	{
		path: 'overfull_flow_deal',
		component: () => import(
			/* webpackChunkName: 'Finance serviceCentreBankRemittance' */ 
			'@/component/financialManagement/serviceCentreBankRemittance/overfullFlowDeal.vue'
		),
		meta: {
			title: '超额流水处理',
			requireAuth: true
		}
	},
	{
		path: 'hand_input_flow',
		component: () => import(
			/* webpackChunkName: 'Finance serviceCentreBankRemittance' */ 
			'@/component/financialManagement/serviceCentreBankRemittance/handInputFlow/handInputFlow.vue'
		),
		meta: {
			title: '手工录入流水及审核',
			requireAuth: true
		}
	},

	{
		path: 'unit_group_purchase',
		component: () => import(
			/* webpackChunkName: 'Finance UnitGroupPurchase' */ 
			'@/component/financialManagement/unitGroupPurchase/unitGroupPurchaseList.vue'
		),
		meta: {
			title: '单位团购对账',
			requireAuth: true
		}
	},
	{
		path: 'unit_group_purchase_detail',
		component: () => import(
			/* webpackChunkName: 'Finance UnitGroupPurchase' */ 
			'@/component/financialManagement/unitGroupPurchase/unitGroupPurchaseDetail.vue'
		),
		meta: {
			title: '单位团购对账详情'
		}
	},
	{
		path: 'branch_company_bank_statement',
		component: () => import(
			/* webpackChunkName: 'Finance BranchCompanyBankStatement' */ 
			'@/component/financialManagement/branchCompanyBankStatement/branchCompanyBankStatement.vue'
		),
		meta: {
			title: '分公司银行流水',
			requireAuth: true
		}
	},
	{
		path: 'bank_statement_download_center',
		component: () => import(
			/* webpackChunkName: 'Finance BranchCompanyBankStatement' */ 
			'@/component/financialManagement/branchCompanyBankStatement/downloadCenter.vue'
		),
		meta: {
			title: '下载中心'
		}
	},
	{
		path: 'branch_price_information',
		component: () => import(
			/* webpackChunkName: 'Finance BranchPriceInformation' */ 
			'@/component/financialManagement/branchPriceInformation/branchPriceInformation.vue'
		),
		meta: {
			title: '分公司价格信息',
			requireAuth: true
		}
	},
	{
		path: 'branch_price_check_detail',
		component: () => import(
			/* webpackChunkName: 'Finance BranchPriceInformation' */ 
			'@/component/financialManagement/branchPriceInformation/branchPriceCheckDetail.vue'
		),
		meta: {
			title: '分公司价格审核详情'
		}
	},
	{
		path: 'service_fee_schedule',
		component: () => import(
			/* webpackChunkName: 'Finance BranchPriceInformation' */ 
			'@/component/financialManagement/serviceFeeSchedule/serviceFeeSchedule.vue'
		),
		meta: {
			title: '手续费明细表',
			requireAuth: true
		}
	},
	{
		path: 'hand_input_money_check',
		component: () => import(
			/* webpackChunkName: 'Finance BranchPriceInformation' */ 
			'@/component/financialManagement/handInputMoneyCheck/handInputMoneyCheck.vue'
		),
		meta: {
			title: '钱包手工录入及审核',
			requireAuth: true
		}
	},
	{
		path: 'bank_card_sign_management',
		component: () => import(
			/* webpackChunkName: 'Finance BranchPriceInformation' */ 
			'@/component/financialManagement/bankCardSignManagement/bankCardSignManagement.vue'
		),
		meta: {
			title: '银行卡签约管理',
			requireAuth: true
		}
	},
	{
		path: 'credit_adjust_batch_management',
		component: () => import(
			/* webpackChunkName: 'Finance BranchPriceInformation' */ 
			// @todo 已不使用
			'@/component/financialManagement/creditManagement/creditAdjustBatchManagement.vue'
		),
		meta: {
			title: '信用额调整批次管理',
			requireAuth: true,
		}
	},
	{
		path: 'credit_adjust_batch_detail',
		component: () => import(
			/* webpackChunkName: 'Finance BranchPriceInformation' */ 
			'@/component/financialManagement/creditManagement/creditAdjustBatchDetail.vue'
		),
		meta: {
			title: '信用额调整批次详情',
			requireAuth: true,
		}
	},
	{
		path: 'credit_adjust_record_sheet',
		component: () => import(
			/* webpackChunkName: 'Finance BranchPriceInformation' */ 
			'@/component/financialManagement/creditManagement/creditAdjustRecordSheet.vue'
		),
		meta: {
			title: '信用额调整记录表',
			requireAuth: true
		}
	},
	{
		path: 'credit_adjust',
		component: () => import(
			/* webpackChunkName: 'Finance BranchPriceInformation' */ 
			'@/component/financialManagement/creditManagement/creditAdjust.vue'
		),
		meta: {
			title: '单个信用额录入及审核',
			requireAuth: true
		}
	},
	{
		path: 'credit_adjust_batch_import',
		component: () => import(
			/* webpackChunkName: 'Finance BranchPriceInformation' */ 
			'@/component/financialManagement/creditManagement/creditAdjustBatchImport.vue'
		),
		meta: {
			title: '批量导入'
		}
	},
	{
		path: 'cloud_business_credit_input',
		component: () => import(
			/* webpackChunkName: 'Finance creditManagement' */ 
			'@/component/financialManagement/creditManagement/creditInput/cloudBusinessCreditInput.vue'
		),
		meta: {
			title: '信用额批次录入',
			requireAuth: true
		}
	},
	{
		path: 'cloud_business_credit_input_detail',
		component: () => import(
			/* webpackChunkName: 'Finance creditManagement' */ 
			'@/component/financialManagement/creditManagement/creditInput/cloudBusinessCreditInputDetail.vue'
		),
		meta: {
			title: '信用额批次录入详情',
			requireAuth: true
		}
	},
	{
		path: 'cloud_business_credit_audit',
		component: () => import(
			/* webpackChunkName: 'Finance creditManagement' */ 
			'@/component/financialManagement/creditManagement/creditAudit/cloudBusinessCreditAudit.vue'
		),
		meta: {
			title: '信用额批次审核',
			requireAuth: true,
		}
	},
];
