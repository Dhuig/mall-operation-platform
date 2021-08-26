// 关联优惠券 列表 配置
export const LOGIN_WITH_GIFTS_ADD_RELATION_COLUMNS = [
  { prop: 'couponNumber', label: '优惠券编号', align: 'center' },
  { prop: 'couponName', label: '优惠券名称', align: 'center' },
  { prop: 'faceValue', label: '面值', align: 'center' },
  { prop: 'minAmountString', label: '使用规则', align: 'center'},
  { prop: 'couponTypeString', label: '类型', align: 'center' },
  { prop: 'effectiveTime', label: '有效时间', align: 'center' },
  { prop: 'couponCountString', label: '优惠券总量', align: 'center' },
  { prop: 'limitCount', label: '最大可获数量', align: 'center'},
  { prop: 'loginGiftLimitCount', label: '本次活动可获数量', align: 'center', slot: 'loginGiftLimitCount', },
]

// 顾客名单 列表 配置
export const LOGIN_WITH_GIFTS_ADD_CUSTOMER_COLUMNS = [
  { prop: 'cardNo', label: '会员卡号', align: 'center' },
  { prop: 'realName', label: '会员姓名', align: 'center' },
  { prop: 'mobile', label: '注册手机号', align: 'center' },
]