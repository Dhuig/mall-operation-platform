export const MENU_SETTING_RULES = {
	menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
	menuPath: [{ required: true, message: '请输入菜单地址', trigger: 'blur' }],
}

export const BUTTON_SETTING_RULES = {
	buttonName: [{ required: true, message: '请输入按钮名称', trigger: 'blur' }],
	buttonCode: [{ message: '请输入按钮代码', trigger: 'blur' }],
}
