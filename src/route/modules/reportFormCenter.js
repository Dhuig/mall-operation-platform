// 报表中心路由定义
export default [
  {
		path: 'pledged_payment_total',
		component: () => import(
			/* webpackChunkName: 'reportFormCenter' */
			'@/component/reportFormCenter/pledgedPaymentTotal/pledgedPaymentTotal.vue'
		),
		meta: {
			title: '累计已汇押货款余额列表',
			requireAuth: true
		}
  },
  {
		path: 'pledged_refund_payment_detail',
		component: () => import(
			/* webpackChunkName: 'reportFormCenter' */
			'@/component/reportFormCenter/pledgedPaymentTotal/pledgedRefundPaymentDetail.vue'
		),
		meta: {
			title: '汇押货款、退押货款详情'
		}
  },
  {
		path: 'wallet_credit_valid',
		component: () => import(
			/* webpackChunkName: 'reportFormCenter walletReportForm' */
			'@/component/reportFormCenter/walletReportForm/walletCreditValid.vue'
		),
		meta: {
			title: '钱包信用额（验证）',
			requireAuth: true
		}
	},
  {
		path: 'credit_adjust_record_logs',
		component: () => import(
			/* webpackChunkName: 'reportFormCenter walletReportForm' */
			'@/component/reportFormCenter/walletReportForm/creditAdjustRecordLogs.vue'
		),
		meta: {
			title: '信用额调整记录表'
		}
	},
	{
		path: 'pledge_statistical_list',
		component: () => import(
			/* webpackChunkName: 'reportFormCenter' */
			'@/component/reportFormCenter/pledgeBalanceStatistical/pledgeStatisticalList.vue'
		),
		meta: {
			title: '押货余额统计表',
			requireAuth: true
		}
	},
	{
		path: 'pledge_statistical_detail',
		component: () => import(
			/* webpackChunkName: 'reportFormCenter' */
			'@/component/reportFormCenter/pledgeBalanceStatistical/pledgeStatisticalDetail.vue'
		),
		meta: {
			title: '押货余额详情'
		}
	},
	{
		path: 'wallet_balance_form',
		component: () => import(
			/* webpackChunkName: 'reportFormCenter walletBalanceForm' */
			'@/component/reportFormCenter/walletBalanceForm/walletBalanceForm.vue'
		),
		meta: {
			title: '完美钱包余额表',
			requireAuth: true
		}
	},
	{
		path: 'wallet_balance_form_detail',
		component: () => import(
			/* webpackChunkName: 'reportFormCenter walletBalanceForm' */
			'@/component/reportFormCenter/walletBalanceForm/walletBalanceFormDetail.vue'
		),
		meta: {
			title: '钱包余额详情'
		}
	},
	{
		path: 'inventory_split_combination_form',
		component: () => import(
			/* webpackChunkName: 'reportFormCenter inventorySplitCombination' */
			'@/component/reportFormCenter/inventorySplitCombination/inventorySplitCombination.vue'
		),
		meta: {
			title: '库存拆分及组合报表',
			requireAuth: true
		}
	},
	{
		path: 'wallet_reconciliation_form',
		component: () => import(
			/* webpackChunkName: 'reportFormCenter inventorySplitCombination' */
			'@/component/reportFormCenter/walletReconciliationForm/walletReconciliationForm.vue'
		),
		meta: {
			title: '钱包对账表',
			requireAuth: true
		}
	},
	{
		path: 'wallet_reconciliation_detail',
		component: () => import(
			/* webpackChunkName: 'reportFormCenter inventorySplitCombination' */
			'@/component/reportFormCenter/walletReconciliationForm/walletReconciliationFormDetail.vue'
		),
		meta: {
			title: '钱包对账表',
		}
	},
	{
		path: 'pledge_statistical_list_history',
		component: () => import(
			/* webpackChunkName: 'reportFormCenter' */
			'@/component/reportFormCenter/pledgeBalanceStatisticalHistory/pledgeBalanceStatisticalHistory.vue'
		),
		meta: {
			title: '押货余额统计表（历史）',
			requireAuth: true
		}
	},
	{
		path: 'pledge_statistical_detail_history',
		component: () => import(
			/* webpackChunkName: 'reportFormCenter' */
			'@/component/reportFormCenter/pledgeBalanceStatisticalHistory/pledgeBalanceStatisticalHistoryDetail.vue'
		),
		meta: {
			title: '增减明细',
		}
	},
	{
		path: 'inventory_statement_form',
		component: () => import(
			/* webpackChunkName: 'reportFormCenter' */
			'@/component/reportFormCenter/inventoryStatementForm/inventoryStatementForm.vue'
		),
		meta: {
			title: '库存对账单',
			requireAuth: true
		}
	},
	{
		path: 'branch_bank_flow_form',
		component: () => import(
			/* webpackChunkName: 'reportFormCenter' */
			'@/component/reportFormCenter/branchCompanyBankFlowForm/branchCompanyBankFlowForm.vue'
		),
		meta: {
			title: '分公司银行流水',
			requireAuth: true
		}
	},
	{
		path: 'bank_remittance_flow_history',
		component: () => import(
			/* webpackChunkName: 'reportFormCenter' */
			'@/component/reportFormCenter/bankRemittanceFlowHistory/bankRemittanceFlowHistory.vue'
		),
		meta: {
			title: '银行汇款流水',
			requireAuth: true
		}
	},
	{
		path: 'natural_month_inventory_statement',
		component: () => import(
			/* webpackChunkName: 'reportFormCenter' */
			'@/component/reportFormCenter/naturalMonthInventoryStatement/naturalMonthInventoryStatement.vue'
		),
		meta: {
			title: '自然月份库存对账单',
			requireAuth: true
		}
	},

]