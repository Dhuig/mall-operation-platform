import { MEMBER_TYPE } from '@/component/accountsManagement/cardVoucherManagement/config';
import { formatDate } from 'util/formValidation.js';
// 操作类型
const LOGIN_WITH_GIFTS_OPERATE_TYPE = {
  1: '创建',
  3: '审核通过',
  4: '审核不通过',
  5: '停止',
}
// 关联优惠券列表 配置
export const LOGIN_GIFTS_RELATION_COUPON_COLUMNS = [
  { prop: 'couponNumber', label: '优惠券编号', align: 'center' },
  { prop: 'couponName', label: '优惠券名称', align: 'center' },
  { prop: 'faceValue', label: '面值', align: 'center' },
  { prop: 'minAmountString', label: '使用规则', align: 'center' },
  { prop: 'couponTypeString', label: '类型', align: 'center' },
  { prop: 'loginGiftLimitCount', label: '本次活动可获数量', align: 'center' },
  { prop: 'grantCount', label: '领取总数', align: 'center' },
  { prop: 'startTime', label: '有效时间', align: 'center',
    formatter: ({startTime, endTime}) => {
      return startTime ? `${startTime}至${endTime||''}` : '';
    }
  },
]

// 操作记录 配置
export const LOGIN_GIFTS_OPERATING_COLUMNS = [
  { prop: 'createTime', label: '操作时间', align: 'center' },
  { prop: 'operate', label: '操作', align: 'center',
    formatter: ({operate}) => {
      return operate in LOGIN_WITH_GIFTS_OPERATE_TYPE ? LOGIN_WITH_GIFTS_OPERATE_TYPE[operate] : '';
    }
  },
  { prop: 'operator', label: '操作人帐号', align: 'center' },
  { prop: 'operateName', label: '操作人姓名', align: 'center' },
  { prop: 'companyName', label: '所属部门', align: 'center' },
  { prop: 'remarks', label: '备注说明', align: 'center', },
  { prop: 'attachments', label: '附件', align: 'center', slot: 'attachments', width: 200, },
]

// 顾客列表 搜索栏
export const LOGIN_GIFTS_CUSTOMER_SEARCH_CONFIG = {
  form: [
		{
			label: '会员卡号',
			key: 'cardNo',
			type: 'input',
			value: '',
			placeholder: '请输入会员卡号'
		},
		{
			label: '会员姓名',
			key: 'realName',
			type: 'input',
			value: '',
			placeholder: '请输入会员姓名'
		},
		{
			label: '注册手机号',
			key: 'mobile',
			type: 'input',
			value: '',
			placeholder: '请输入注册手机号'
		},
		{
			label: '参与状态',
			key: 'disabled',
			type: 'select',
			value: '',
			options: [
				{ value: true, label: '已禁用' },
				{ value: false, label: '已启用' }
			],
			placeholder: '请选择参与状态'
		},
		{
			label: '是否已领取',
			key: 'received',
			type: 'select',
			value: '',
			placeholder: '请选择是否已领取',
      options: [
        { value: true, label: '是' },
        { value: false, label: '否' },
      ]
		},
    {
			label: '领取时间',
			key: 'receiveTime',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期'
			}
		},
  ]
}
//顾客列表 配置
export const LOGIN_GIFTS_CUSTOMER_COLUMNS_CONFIG = [
  { prop: 'cardNo', label: '会员卡号', align: 'center' },
	{ prop: 'realName', label: '会员姓名', align: 'center' },
  { prop: 'memberType', label: '顾客身份', align: 'center',
    formatter: ({memberType}) => {
      return memberType in MEMBER_TYPE ? MEMBER_TYPE[memberType] : '';
    }
  },
  { prop: 'mobile', label: '注册手机号', align: 'center' },
  { prop: 'received', label: '是否已领取', align: 'center',
    formatter:({received}) => {
      return received ? '是' : '否';
    }
  },
  { prop: 'receivedTime', label: '领取时间', align: 'center',
    formatter: ({receivedTime}) => {
      return formatDate(receivedTime);
    }
  },
  { prop: 'disabled', label: '参与状态', align: 'center',
    formatter: ({disabled}) => {
      return disabled ? '已禁用' : '已启用';
    }
  },
]

// 编辑记录 搜索栏 配置
export const LOGIN_GIFTS_CUSTOMER_RECORD_SEARCH = {
  form: [
    {
			label: '编辑时间',
			key: 'editTime',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
				rangeSeparator: '~',
				startPlaceholder: '开始日期',
				endPlaceholder: '结束日期'
			}
		},
		{
			label: '会员卡号',
			key: 'cardNo',
			type: 'input',
			value: '',
			placeholder: '请输入会员卡号'
		},
		{
			label: '会员姓名',
			key: 'realName',
			type: 'input',
			value: '',
			placeholder: '请输入会员姓名'
		},
		{
			label: '注册手机号',
			key: 'mobile',
			type: 'input',
			value: '',
			placeholder: '请输入注册手机号'
		},
  ]
}
// 编辑记录列表 配置
export const LOGIN_GIFTS_CUSTOMER_RECORD_COLUMNS = [
  { prop: 'createTime', label: '编辑时间', align: 'center', width: 140 },
	{ prop: 'cardNo', label: '会员卡号', align: 'center' },
	{ prop: 'realName', label: '会员姓名', align: 'center' },
	{ prop: 'mobile', label: '注册手机号', align: 'center', width: 140 },
	{ prop: 'operator', label: '操作人', align: 'center' },
]