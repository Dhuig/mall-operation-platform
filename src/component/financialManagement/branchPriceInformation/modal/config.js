//
export const PRICE_INFO_POP_RULES = {
  serialNo: [{ required: true, message: '请输入产品编号', trigger: 'blur' }],
  title: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  priceCatalogId: [{ required: true, message: '请选择所属类别', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
  retailPrice: [{ required: true, message: '请输入产品零售价', trigger: 'blur' }],
  beijingCompanyPrice: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/, message: '请输入正数，支持两位小数', trigger: 'blur' }
  ],
  otherCompanyPrice: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/, message: '请输入正数，支持两位小数', trigger: 'blur' }
  ],
  secondCompanyPrice: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/, message: '请输入正数，支持两位小数', trigger: 'blur' }
  ],
  auditResult: [{ required: true, message: '请选择审核操作', trigger: 'blur' }],
  remarks: [{ required: false, message: '请输入备注说明', trigger: 'blur' }],
}