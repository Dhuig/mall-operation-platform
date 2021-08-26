const AsyncCouponHandList = () => import(/* webpackChunkName: 'Inventory Query'*/ '@/component/activityCenter/couponHandManagement/couponHandList.vue');
const AsyncCreateHandWork = () => import(/* webpackChunkName: 'Stock Add Substraction'*/ '@/component/activityCenter/couponHandManagement/createHandWork.vue');
const AsyncCreateHandWorkSuccess = () => import(/* webpackChunkName: 'Inventory Reconciliation'*/ '@/component/activityCenter/couponHandManagement/createHandWorkSuccess.vue');
const AsyncCouponHandOfDetail = () => import(/* webpackChunkName: 'package Split'*/ '@/component/activityCenter/couponHandManagement/couponHandOfDetail.vue');
const giftManagement = () => import(/* webpackChunkName: 'package Split'*/ '@/component/activityCenter/giftManagement/giftManagement.vue');
const giftimprot = () => import(/* webpackChunkName: 'package Split'*/ '@/component/activityCenter/giftManagement/giftimprot.vue');
const changePurchaseManagement = () => import(/* webpackChunkName: 'package Split'*/ '@/component/activityCenter/changePurchase/changePurchaseManagement.vue');
const changePurchaseDetail = () => import(/* webpackChunkName: 'package Split'*/ '@/component/activityCenter/changePurchase/changePurchaseDetail.vue');
export default [
  {
    path: 'activity_management',
    component: () => import( /* webpackChunkName: 'ActivityCenter-activityManagement' */
      '@/component/activityCenter/activityManagement/activityManagement.vue'
    ),
    meta: {
			title: '活动管理列表',
			requireAuth: true
    }
  },
  {
    path: 'add_activity',
    component: () => import( /* webpackChunkName: 'ActivityCenter-activityReview' */
      '@/component/activityCenter/activityManagement/addActivity.vue'
    ),
    meta: {
      title: '新建/编辑活动',
    }
  },
  {
    path: 'activity_review',
    component: () => import( /* webpackChunkName: 'ActivityCenter-addActivity' */
      '@/component/activityCenter/activityManagement/activityReview.vue'
    ),
    meta: {
      title: '活动审核',
    }
  },
  {
    path: 'spike_activity',
    component: () => import( /* webpackChunkName: 'ActivityCenter-spikeActivityDetail' */
      '@/component/activityCenter/activityManagement/spikeActivityDetail.vue'
    ),
    meta: {
      title: '活动详情',
			requireAuth: true,
    }
  },
  {
    path: 'coupon_management',
    component: () => import( /* webpackChunkName: 'ActivityCenter-couponManagement' */
      '@/component/activityCenter/couponManagement/couponManagement.vue'
    ),
    meta: {
			title: '优惠券列表',
			requireAuth: true
    }
  },
  {
    path: 'coupon_detail',
    component: () => import( /* webpackChunkName: 'ActivityCenter-couponDetail' */
      '@/component/activityCenter/couponManagement/couponDetail.vue'
    ),
    meta: {
      title: '优惠券详情',
    }
  },
  {
    path: 'coupon_review',
    component: () => import( /* webpackChunkName: 'ActivityCenter-couponReview' */
      '@/component/activityCenter/couponManagement/couponReview.vue'
    ),
    meta: {
      title: '优惠券审核',
    }
  },
  {
    path: 'add_edit_coupon',
    component: () => import( /* webpackChunkName: 'ActivityCenter-addEditCoupon' */
      '@/component/activityCenter/couponManagement/addEditCoupon.vue'
    ),
    meta: {
      title: '新建/编辑优惠券',
    }
  },
  {
    path: 'coupon_handList',
    component: AsyncCouponHandList,
    meta: {
			title: '优惠券派发列表',
			requireAuth: true
    }
  },
  {
    path: 'create_handWork',
    component: AsyncCreateHandWork,
    meta: {
      title: '新建/编辑派发任务',
    }
  },
  {
    path: 'create_handWork_success',
    component: AsyncCreateHandWorkSuccess,
    meta: {
      title: '新建/编辑派发任务完成页',
    }
  },
  {
    path: 'coupon_handOf_Detail',
    component: AsyncCouponHandOfDetail,
    meta: {
      title: '优惠券派发详情',
    }
  },
  {
    path: 'gift_management',
    component: giftManagement,
    meta: {
			title: '赠品管理',
			requireAuth: true
    }
  },
  {
    path: 'gift_improt',
    component: giftimprot,
    meta: {
      title: '赠品批量导入',
    }
  },
  {
    path: 'change_purchase_management',
    component: changePurchaseManagement,
    meta: {
			title: '换购管理',
			requireAuth: true
    }
  },
  {
    path: 'change_purchase_detail',
    component: changePurchaseDetail,
    meta: {
      title: '换购详情',
			requireAuth: true,
    }
  },
  {
    path: 'add_change_purch',
    component: () => import( /* webpackChunkName: 'ActivityCenter-addChangePurch' */
      '@/component/activityCenter/changePurchase/addChangePurch.vue'
    ),
    meta: {
      title: '新建/编辑换购',
    }
  },
  {
    path: 'donate_coupon',
    component: () => import( /* webpackChunkName: 'ActivityCenter-donateCoupon' */
      '@/component/activityCenter/donateCoupon/donateCoupon.vue'
    ),
    meta: {
      title: '转赠优惠券派发列表',
    }
  },
  {
    path: 'add_donate_coupon',
    component: () => import( /* webpackChunkName: 'ActivityCenter-addDonateCoupon' */
      '@/component/activityCenter/donateCoupon/addDonateCoupon.vue'
    ),
    meta: {
      title: '新建编辑转赠优惠券派发任务',
    }
  },
  {
    path: 'donate_coupon_detail',
    component: () => import( /* webpackChunkName: 'ActivityCenter-addDonateCoupon' */
      '@/component/activityCenter/donateCoupon/donateCouponDetail.vue'
    ),
    meta: {
      title: '转赠优惠券派发详情',
    }
  },
  
  {
    path: 'login_with_gifts_list',
    component: () => import( /* webpackChunkName: 'ActivityCenter-loginWithGifts' */
      '@/component/activityCenter/loginWithGifts/loginWithGiftsList.vue'
    ),
    meta: {
			title: '登录有礼',
			requireAuth: true
    }
  },
  {
    path: 'login_with_gifts_detail',
    component: () => import( /* webpackChunkName: 'ActivityCenter-loginWithGifts' */
      '@/component/activityCenter/loginWithGifts/loginWithGiftsDetail.vue'
    ),
    meta: {
			title: '登录有礼详情',
			requireAuth: true
    }
  },
  {
    path: 'login_with_gifts_add',
    component: () => import( /* webpackChunkName: 'ActivityCenter-loginWithGifts' */
      '@/component/activityCenter/loginWithGifts/loginWithGiftsAdd.vue'
    ),
    meta: {
			title: '新建登录有礼活动',
			requireAuth: true
    }
  },
  {
    path: 'login_with_gifts_edit',
    component: () => import( /* webpackChunkName: 'ActivityCenter-loginWithGifts' */
      '@/component/activityCenter/loginWithGifts/loginWithGiftsAdd.vue'
    ),
    meta: {
			title: '编辑登录有礼活动',
			// requireAuth: true
    }
  },
]
