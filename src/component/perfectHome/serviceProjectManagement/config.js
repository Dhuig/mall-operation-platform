
// 服务项目规格 配置
export const SERVICE_PROJECT_SPECS_COLUMNS = [
  { prop: 'skuName', label: '规格名称', align: 'center' },
]

// 管理产品 配置
export const SERVICE_PROJECT_PRODUCT_COLUMNS = [
  { prop: 'serialNo', label: '产品编号', align: 'center' },
  { prop: 'title', label: '产品名称', align: 'center' },
  { prop: 'retailPrice', label: '产品价格', align: 'center' },
  { prop: 'pv', label: '产品PV', align: 'center' },
]

/* ================ 管理项目 =============== */
// 管理项目编辑 form rules
export const FORM_RULES = {
  itemName: [
    { required: true, message: '请输入服务项目名称', trigger: 'blur' },
    { pattern: /^[\u4E00-\u9FA5A-Za-z0-9]{1,20}$/, message: '1~20个字，不支持特殊符号', trigger: 'blur' }
  ],
  itemFileList: [{ required: true, message: '请选择图片', trigger: 'blur' }],
  itemUnit: [
    { required: true, message: '请输入服务项目单位', trigger: 'blur' },
    { pattern: /^[\u4E00-\u9FA5A-Za-z0-9]{1,40}$/, message: '1~40个字，不支持特殊符号', trigger: 'blur' }
  ],
  itemSkuList: [{ required: true, message: '请添加服务项目规格', trigger: 'blur' }],
  itemProductList: [{ required: true, message: '请添加关联产品', trigger: 'blur' }],
}

// 添加项目规格 rules
export const ADD_PROJECT_SPECS_RULES = {
  skuName: [
    { required: true, message: '请输入规格名称', trigger: 'blur' },
    { pattern:/^[\u4E00-\u9FA5A-Za-z0-9]{1,10}$/,message: '请输入1~10个字符，不支持特殊符号', trigger: 'blur' },
  ],
}
// 添加关联产品 rules
export const ADD_RELATION_PRODUCT_RULES = {
  serialNo: [{ required: true, message: '请输入产品编码', trigger: 'blur' }],
}