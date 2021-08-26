// 账户修改日志按钮权限
const AccountChangeLog = {
	account_management_normal: 'account_management_normal_change_log',
	account_management_vip: 'account_management_vip_change_log',
	account_management_cloud: 'account_management_cloud_change_log',
};

// 身份转换按钮权限
const IdentityConvert = {
	account_management_normal: '',
	account_management_vip: 'account_management_vip_identity_convert',
	account_management_cloud: 'account_management_cloud_identity_convert',
};

// 修改注册手机号按钮权限
const EditRegisterMobile = {
	account_management_normal: 'account_management_normal_edit_register_mobile',
	account_management_vip: 'account_management_vip_edit_register_mobile',
	account_management_cloud: 'account_management_cloud_edit_register_mobile',
};

// 清空注册手机号按钮权限
const ClearRegisterMobile = {
	account_management_normal: 'account_management_normal_clear_register_mobile',
	account_management_vip: 'account_management_vip_clear_register_mobile',
	account_management_cloud: 'account_management_cloud_clear_register_mobile',
};

// 添加关联手机号按钮权限
const AddBindMobile = {
	account_management_normal: '',
	account_management_vip: 'account_management_vip_add_bind_mobile',
	account_management_cloud: 'account_management_cloud_add_bind_mobile',
};

// 删除关联手机号按钮权限
const DeleteBindMobile = {
	account_management_normal: '',
	account_management_vip: 'account_management_vip_delete_bind_mobile',
	account_management_cloud: 'account_management_cloud_delete_bind_mobile',
};

// 标记配偶/取消标记 按钮权限
const ToggleCoupleMark = {
	account_management_normal: '',
	account_management_vip: 'account_management_vip_toggle_couple_mark',
	account_management_cloud: 'account_management_cloud_toggle_couple_mark',
};

// 初始化密码按钮权限
const InitialPassword = {
	account_management_normal: '',
	account_management_vip: 'account_management_vip_initial_password',
	account_management_cloud: 'account_management_cloud_initial_password',
};

// 初始化子账号密码按钮权限
const InitialChildPassword = {
	account_management_normal: '',
	account_management_vip: 'account_management_vip_initial_child_password',
	account_management_cloud: 'account_management_cloud_initial_child_password',
};

// 更换默认配送服务中心按钮权限
const ChangeDefaultService = {
	account_management_normal: 'account_management_normal_change_default_service',
	account_management_vip: 'account_management_vip_change_default_service',
	account_management_cloud: 'account_management_cloud_change_default_service',
}

// 修改账号状态按钮权限
const ChangeUserAccountState = {
	account_management_normal: 'account_management_normal_change_account_state',
	account_management_vip: 'account_management_vip_change_account_state',
	account_management_cloud: 'account_management_cloud_change_account_state',
}

export default Object.freeze({
	AccountChangeLog,
	IdentityConvert,
	EditRegisterMobile,
	ClearRegisterMobile,
	AddBindMobile,
	DeleteBindMobile,
	ToggleCoupleMark,
	InitialPassword,
	InitialChildPassword,
	ChangeDefaultService,
	ChangeUserAccountState,
});
