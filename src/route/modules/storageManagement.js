export default [
	{
		path: 'add_pledge_order',
		// component: AsyncAddPledgeOrder,
		component: () => import(
			'@/component/storageManagement/newlyBuildPledge/addPledgeOrder.vue'
		),
		meta: {
			title: '新建押货单',
			requireAuth: true
		}
	},
	{
		path: 'add_customized_products',
		// component: AsyncAddCustomizedProducts,
		component: () => import(
			'@/component/storageManagement/newlyBuildPledge/addCustomizedProducts.vue'
		),
		meta: {
			title: '新建定制品押货单',
			requireAuth: true
		}
	},
	{
		path: 'charging_list',
		// component: AsyncChargingList,
		component: () => import(
			'@/component/storageManagement/addStorage/chargingList.vue'
		),
		meta: {
			title: '押货单查询',
			requireAuth: true,
		}
	},
	{
		path: 'update_charging',
		// component: AsyncUpdateCharging,
		component: () => import(
			'@/component/storageManagement/addStorage/updateCharging.vue'
		),
		meta: {
			title: '修改押货单'
		}
	},
	{
		path: 'charging_detail',
		// component: AsyncChargingDetail,
		component: () => import(
			'@/component/storageManagement/addStorage/chargingDetail.vue'
		),
		meta: {
			title: '押货单详情',
		}
	},
	{
		path: 'customized_product',
		// component: AsyncCustomizedProductList,
		component: () => import(
			'@/component/storageManagement/customizedProduct/customizedProductList.vue'
		),
		meta: {
			title: '定制品押货查询',
			requireAuth: true
		}
	},
	{
		path: 'customized_detail',
		// component: AsyncCustomizedDetail,
		component: () => import(
			'@/component/storageManagement/customizedProduct/customizedDetail.vue'
		),
		meta: {
			title: '定制品押货单详情'
		}
	},
	{
		path: 'update_customized',
		// component: AsyncUpdateCustomized,
		component: () => import(
			'@/component/storageManagement/customizedProduct/updateCustomized.vue'
		),
		meta: {
			title: '修改定制品押货单'
		}
	},
	{
		path: 'owning_list',
		// component: AsyncOwningList,
		component: () => import(
			'@/component/storageManagement/owningGoods/owningList.vue'
		),
		meta: {
			title: '欠货未发明细查询',
			requireAuth: true
		}
	},
	{
		path: 'owning_detail',
		// component: AsyncChargingDetail,
		component: () => import(
			'@/component/storageManagement/addStorage/chargingDetail.vue'
		),
		meta: {
			title: '欠货未发明细详情',
			requireAuth: true,
		}
	},
	{
		path: 'cloud_charge_list',
		// component: AsyncCloudChargeList,
		component: () => import(
			'@/component/storageManagement/cloudChargeAmount/cloudChargeList.vue'
		),
		meta: {
			title: '服务中心押货额管理',
			requireAuth: true,
		}
	},
	{
		path: 'cloud_charge_detail',
		// component: AsyncCloudChargeDetail,
		component: () => import(
			'@/component/storageManagement/cloudChargeAmount/cloudChargeDetail.vue'
		),
		meta: {
			title: '服务中心押货额详情',
			requireAuth: true,
		}
	},
	{
		path: 'cloud_charge_import',
		// component: AsyncCloudChargeImport,
		component: () => import(
			'@/component/storageManagement/cloudChargeAmount/cloudChargeImport.vue'
		),
		meta: {
			title: '服务中心押货额管理批量调整'
		}
	},
	{
		path: 'deposit_credit_list',
		// component: AsyncDepositCreditList,
		component: () => import(
			'@/component/storageManagement/depositCredit/depositCreditList.vue'
		),
		meta: {
			title: '信誉额查询列表',
			requireAuth: true
		}
	},
	{
		path: 'deposit_credit_detail',
		// component: AsyncDepositCreditDetail,
		component: () => import(
			'@/component/storageManagement/depositCredit/depositCreditDetail.vue'
		),
		meta: {
			title: '信誉额详情',
			requireAuth: true
		}
	},
	{
		path: 'deposit_credit_import',
		// component: AsyncDepositCreditImport,
		component: () => import(
			'@/component/storageManagement/depositCredit/depositCreditImport.vue'
		),
		meta: {
			title: '信誉额批量调整'
		}
	}
]
