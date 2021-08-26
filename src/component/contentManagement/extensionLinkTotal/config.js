// 文档状态 platform
export const PLATFORM = {
	'1':'APP' ,
	'2':'小程序'
}
export const ADD_EXTENSION_LINK_RULE = {
	thirdPartySoftwareName: [
		{ required: true, message: '请输入第三方软件名称', trigger: 'blur' }
	],
	platform: [
		{ required: true, message: '请选择平台', trigger: 'blur' }
	],
}
