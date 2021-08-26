export const HAND_INPUT_FORM_RULES = {
  storeCode: [{ required: true, message: '请输入服务中心编号', trigger: 'blur' }],
  depositType: [{ required: true, message: '请选择款项类型', trigger: 'blur' }],
  payType: [{ required: true, message: '请选择转账类型', trigger: 'blur' }],
  money: [
    { required: true, message: '请输入保证金金额', trigger: 'blur' }, 
    { pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: 'blur' },
  ],
}