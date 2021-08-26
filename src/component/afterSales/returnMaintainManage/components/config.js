export const RECEIVE_INFO_RULES = {
  returnExpressName: [
    { required: true, message: '请输入物流公司', trigger: 'change' },
    { max: 20, message: '最大长度20个字符', trigger: 'change' }
  ],
  returnExpressNo: [
    { required: true, message: '请输入运单号', trigger: 'blur' },
    { max: 20, message: '最大长度20个字符', trigger: 'blur' }
  ],
}
export const SEND_BACK_RULES = {
  consignee: [{ required: true, message: '请输入收货人', trigger: 'change' },],
  consigneeNumber: [{ required: true, message: '请输入收货人电话', trigger: 'change' },],
  area: [{ required: true, message: '请选择区域', trigger: 'change' },],
  address: [{ required: true, message: '请输入详细地址', trigger: 'change' },],
  sendExpressName: [{ required: true, message: '请输入物流公司', trigger: 'change' },],
  sendExpressNo: [{ required: true, message: '请输入运单号', trigger: 'change' },],
}