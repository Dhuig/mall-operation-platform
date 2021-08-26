import { formatDate, addPrefixForAmount } from "util/formValidation.js";
// import { tableZeroShow } from '@/component/financialManagement/handInputMoneyCheck/config'
// 财务管理-余额提现
export const FINANCIAL_BALANCE_WITHDRAWAL_CONFIG = {
    form: [
        {
            label: '会员卡号',
            key: 'cardNo',
            type: 'input',
            value: '',
            placeholder: '请输入会员卡号',
        },
        {
            label: '手机号码',
            key: 'mobile',
            type: 'input',
            value: '',
            placeholder: '请输入顾客手机号码',
        },
        {
            label: '顾客姓名',
            key: 'realname',
            type: 'input',
            value: '',
            placeholder: '请输入顾客姓名',
        },
        {
            label: '分公司编号',
            key: 'companyCode',
            type: 'input',
            value: '',
            placeholder: '请输入分公司编号',
        },
        {                           //3. datePicker类型（此时可以配置config字段）
            label: '申请提现时间',
            key: 'timerange',
            type: 'datePicker',
            value: '',
            config: {
                type: 'datetimerange',              //daterange 日期范围类型
                rangeSeparator: '~',
                startPlaceholder: '开始日期',
                endPlaceholder: '结束日期'
            }
        },
    ],
}

// 余额提现审批 -- 列表title配置
export const FINANCIAL_BALANCE_WITHDRAWAL_HEADER_CONFIG =[
	{
		name: '全部',
		prop: 'all',
		value: '0',
	},
	{
		name: '待审核',
		prop: 'tobeView',
		value: '1',
	},
	{
		name: '待受理',
		prop: 'tobeAccept',
		value: '2',
	},
	{
		name: '汇款成功',
		prop: 'success',
		value: '4',
	},
	{
		name: '汇款失败',
		prop: 'failed',
		value: '5',
	},
	{
		name: '已撤销',
		prop: 'revoked',
		value: '6',
	},
]

// 余额提现审批 -- 列表内容配置
export const FINANCIAL_BALANCE_WITHDRAWAL_DATA_CONFIG = {
	all: {
		data: [],
		pagination: {
			currentPage: 1,
			pageSize: 10
		},
		total: 0,
	},
	tobeView: {
		data: [],
		pagination: {
			currentPage: 1,
			pageSize: 10
		},
		total: 0,
	},
	tobeAccept: {
		data: [],
		pagination: {
			currentPage: 1,
			pageSize: 10
		},
		total: 0,
	},
	success: {
		data: [],
		pagination: {
			currentPage: 1,
			pageSize: 10
		},
		total: 0,
	},
	failed: {
		data: [],
		pagination: {
			currentPage: 1,
			pageSize: 10
		},
		total: 0,
	},
	revoked: {
		data: [],
		pagination: {
			currentPage: 1,
			pageSize: 10
		},
		total: 0,
	},
}
// 余额提现审批 -- 列表项配置
export const FINANCIAL_BALANCE_WITHDRAWAL_COLUMNS_CONFIG =[
	{
		prop: 'memberId',
		label: '顾客编号',
		align: 'center',
	},
	{
		prop: 'cardNo',
		label: '会员卡号',
		align: 'center',
		width: 150
	},
	{
		prop: 'realname',
		label: '顾客姓名',
		align: 'center',
	},
	{
		prop: 'mobile',
		label: '注册手机号',
		align: 'center',
		width: 120
	},
	{
		prop: 'companyNo',
		label: '分公司编号',
		align: 'center',
	},
	{
		prop: 'withdrawAmount',
		label: '提现金额',
		align: 'center',
		summary: true,
		width: 120,
		formatter: ({ withdrawAmount }) => {
			return addPrefixForAmount(withdrawAmount);
		}
	},
	{
		prop: 'totalWithdrawAmount',
		label: '日累计提现金额',
		align: 'center',
		summary: true,
		width: 120,
		formatter: ({ totalWithdrawAmount }) => {
			return addPrefixForAmount(totalWithdrawAmount);
		}
	},
	{
		prop: 'bankTypeDesc',
		label: '银行类别',
		align: 'center',
		width: 100
	},
	{
		prop: 'bankAccount',
		label: '银行账号',
		align: 'center',
		width: 180
	},
	{
		prop: 'bankName',
		label: '银行名称',
		align: 'center',
		width: 100
	},
	{
		prop: 'bankAddress',
		label: '银行地址',
		align: 'center',
		width: 120
	},
	{
		prop: 'bankBranchName',
		label: '开户行名称',
		align: 'center',
		width: 120
	},
	{
		prop: 'applyTime',
		label: '申请提现时间',
		align: 'center',
		width: 150,
		formatter: ({applyTime}) => {
			return formatDate(applyTime);
		}
	},
	{
		prop: 'auditTime',
		label: '审核时间',
		align: 'center',
		width: 150,
		formatter: ({auditTime}) => {
			return formatDate(auditTime);
		}
	},
	{
		prop: 'auditorName',
		label: '审核人',
		align: 'center',
		width: 90
	},
	{
		prop: 'statusDesc',
		label: '审核状态',
		align: 'center',
	},
	{
		prop: 'remark',
		label: '审核备注',
		align: 'center',
		width: 120,
	},
	{
		prop: 'remittanceRemark',
		label: '汇款备注',
		align: 'center',
		width: 120,
	},
	{
		prop: 'transferStatusDesc',
		label: '汇款记录',
		align: 'center',

	},
]

// 余额提现详情 -- 操作
export const AUDIT_RESULT = [
	{ value: '2', label: '通过' },
	{ value: '6', label: '不通过' }
]
// 审核操作 -- 验证
export const AUDIT_RULES = {
	status: [{ required: true, message: '请选择审核操作', trigger: 'change' }]
}

// 余额提现详情 -- 提现详情信息配置
export const WITHDRAWAL_DETAIL_INFO_CONFIG = [
	{
		prop: 'withdrawAmount',
		label: '提现金额',
		formatter:({withdrawAmount})=>{
			return withdrawAmount && '￥' + withdrawAmount;
		}
	},
	{
		prop: 'rechargeAmount',
		label: '钱包充值金额',
		formatter:({rechargeAmount})=>{
			return rechargeAmount && '￥' + rechargeAmount;
		}
	},
	{
		prop: 'mobile',
		label: '注册手机号码',
	},
	{
		prop: 'cardNo',
		label: '会员卡号' ,
	},
	{
		prop: 'realname',
		label: '顾客姓名',
	},
	{
		prop: 'companyCode',
		label: '分公司编号',
	},
	{
		prop: 'bankTypeDesc',
		label: '银行类别描述' ,
	},
	{
		prop: 'bankAccount',
		label: '银行账号' ,
	},
	{
		prop: 'bankName',
		label: '银行名称' ,
	},
	{
		prop: 'bankAddress',
		label: '银行地址' ,
	},
	{
		prop: 'bankBranchName',
		label: '开户行名称' ,
	},
	{
		prop: 'applyTime',
		label: '申请提现时间',
		formatter:({applyTime})=>{
			return applyTime&&formatDate(applyTime);
		}
	},
]

// 汇款成功或者失败
export const TRANSFER_STATUS = {
	'success': 4,
	'fail': 5
}
// 提醒弹窗状态类型
export const REMIND_POP_TYPE = {
	'success': {
		message: '是否已确认汇款成功？',
	},
	'fail': {
		message: '是否已确认汇款失败？'
	},
	'revoke': {
		message: '是否已确认撤销提现？'
	}
}


// 提现申请限额 历史修改记录
export const BALANCE_WITHDRAWAL_LIMIT_CONFIG_LOGS = [
	{ prop: 'updateTime', label: '修改时间', align: 'center',
		formatter: ({updateTime}) => {
			return formatDate(updateTime);
		}
	},
	{ prop: 'operation', label: '修改金额', align: 'center'},
	{ prop: 'updaterName', label: '修改人', align: 'center' },
]