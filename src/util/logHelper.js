import qs from 'querystring';
import signatureManger from './verifySignature';
// 顾客管理
const burryMapForCustomerModule = {
  'updateBatchManualAllot': { module: '顾客管理--普通顾客', content: '执行手工分配操作' },
  'changeMobile': { module: '顾客管理--账户管理', content: '修改注册手机号' },
  'resetMemberPassword': { module: '顾客管理--帐户管理', content: '初始化密码' },
  'resetSubAccountPassword': { module: '顾客管理--帐户管理', content: '初始化子账号密码' },
  'changeMemberDefaultCenter': { module: '顾客管理--帐户管理', content: '更换默认配送服务中心' },
  'changeMemberStatus': { module: '顾客管理--帐户管理', content: '账户状态变更' },
  'doConversion': { module: '顾客管理--帐户管理', content: '顾客身份转换' },
  'addSubAccount': { module: '顾客管理--帐户管理', content: '添加关联手机号' },
}

// 会员管理
const burryMapForMemberModule = {
  'createMemberCard': { module: '会员管理--会员列表', content: '新开优惠卡' },
  'updateMemberCard': { module: '会员管理--会员列表', content: '编辑优惠卡' },
  'delectProvideRefundBank': { module: '会员管理--银行卡列表', content: '清空所有汇退账号' },
  'addorUpdateProvideBank': { module: '会员管理--银行卡列表', content: '录入账号' },
  'insertServiceCompany': { module: '会员管理--银行卡列表', content: '新增服务公司' },
}

// 产品管理
const burryMapForProductModule = {
  'saveVersion': { module: '产品管理', content: '新建产品' },
}

// 服务中心管理
const burryMapForServiceModule = {
  'addStore': { module: '服务中心管理', content: '新建服务中心' },
  'leaderTransfer': { module: '服务中心管理', content: '店铺转让' },
}

// 押货管理
const burryMapForPledgeModule = {
  'addMortgageOrder': { module: '押货管理', content: '新建押货单' },
  'updateMortgageOrder': { module: '押货管理', content: '修改押货单' },
}

// 押货售后管理
const burryMapForPledgeAfterSellModule = {
  'addMortgageReturnOrder': { module: '押货售后管理', content: '新建押货退货单' },
  'addMortgageExchangeOrder': { module: '押货售后管理', content: '新建押货换货单' },
  'inventory/diffOrder/diffOrder': { module: '押货售后管理', content: '新建货损货差单' },
}

// 财务管理
const burryMapForWalletModule = {
  'applyAdjust': { module: '财务管理--完美钱包管理', content: '手工录入项' },
  'addAdjustBatch': { module: '财务管理--信用额调整批次管理', content: '新建批次' },
  'addApply': { module: '财务管理--信用额调整/新增', content: '新增信用额' },
  'updateApply': { module: '财务管理--信用额调整/新增', content: '调整信用额' },
}

// 系统设置
const burryMapForSystemModule = {
  'operator/addOp': { module: '系统设置--用户管理', content: '新增用户' },
  'operator/updateOp': { module: '系统设置--用户管理', content: '编辑用户' },
	'operator/resetPassword': { module: '系统设置--用户管理', content: '重置密码' },
	'operator/disable': { module: '系统设置--用户管理', content: '禁用用户' },
	'operator/enable': { module: '系统设置--用户管理', content: '启用用户' },
	'operator/del': { module: '系统设置--用户管理', content: '删除用户' },
  'role/addRole': { module: '系统设置--角色管理', content: '新增角色' },
  'role/updateRole': { module: '系统设置--角色管理', content: '编辑角色' },
	'role/disable': { module: '系统设置--角色管理', content: '禁用角色' },
	'role/enable': { module: '系统设置--角色管理', content: '启用角色' }
}

// 全部打点业务汇总
const wholeBurryBusinessMap = {
  ...burryMapForCustomerModule,
  ...burryMapForMemberModule,
  ...burryMapForProductModule,
  ...burryMapForServiceModule,
  ...burryMapForPledgeModule,
  ...burryMapForPledgeAfterSellModule,
  ...burryMapForWalletModule,
  ...burryMapForSystemModule,
}

// 日志保存类
export default class logHelper {
	static postMessage(d) {
		const { event, url = '', analysisData, host } = d;
		if (event !== 'log' && event !== 'exportExcel') {
			return;
		}
		if (event === 'log') {
			const substringEnd = url.indexOf('?');
			const tempUrl = url.substring(0, substringEnd > -1 ? substringEnd : url.length);
			Object.keys(wholeBurryBusinessMap).forEach(k => {
				const reg = new RegExp(`${k.trim()}$`, 'ig')
				if (reg.test(tempUrl.trim())) {
					console.log(wholeBurryBusinessMap[k])
					analysisData.module = wholeBurryBusinessMap[k] ? wholeBurryBusinessMap[k].module : '';
					analysisData.content = wholeBurryBusinessMap[k] ? wholeBurryBusinessMap[k].content : '';
				}
			});
		}
		if (!analysisData.module || !analysisData.content) {
			return;
		}
		let data = {
			ip: analysisData.ip,
			operator: analysisData.operator,
			time: new Date().getTime(),
			module: analysisData.module || '',
			content: analysisData.content || '',
			path: analysisData.path || '',
			authtoken: analysisData.authtoken,
			channel: 'pc',
			client: 'op'
		}
		const verifySignatureHeaders = signatureManger.generateVerifyRequestHeaders(
			'/common/mall/log/save',
			'GET',
			signatureManger.generateUid(),
			signatureManger.getTimestamp(),
			`bearer ${analysisData.authtoken}`,
			signatureManger.getPlatformKey(),
		);
		const qsData = {
			...data,
			...verifySignatureHeaders
		}
		const img  = new Image();
		img.src = `${host}/common/mall/log/save?${qs.stringify(qsData)}`
	}
}