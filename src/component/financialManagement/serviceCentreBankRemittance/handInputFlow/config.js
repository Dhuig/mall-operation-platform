const petternForPayment1 = /^([1-9]\d{0,9}|0)(\.\d{1,2})?$/;
const petternForPayment2 = /^-?([1-9]\d{0,9}|0)(\.\d{1,2})?$/;
export const VALID_MONEY_UP0 = (rule, value, callback) => {
  if (!value) {
    callback(new Error('款项金额不能为空'));
  }else{
      if( petternForPayment1.test(value)){
        callback();
      }else{
        callback(new Error('款项金额支持0~9999999999.99'));
      }
  }
}
export const VALID_MONEY_UP_OTHER = (rule, value, callback) => {
  if (!value) {
    callback(new Error('款项金额不能为空'));
  }else{
    if( petternForPayment2.test(value)){
      callback();
    }else{
      callback(new Error('款项金额支持-9999999999.99~9999999999.99'));
    }
  }
}

export const INPUT_RULES = {
  storeCode: [{required: true, message: '请输入服务中心编号', trigger: 'blur'}],
  sourceType: [{required: true, message: '请选择款项类型', trigger: 'blur'}],
  remitMoney: [{required: true, validator: VALID_MONEY_UP0,   trigger: 'blur'}],
  // account: [{required: true, message: '请输入付款账号', trigger: 'blur'}],
  // bankName: [{required: true, message: '请输入付款银行', trigger: 'blur'}],
  // receiptAccount: [{required: true, message: '请输入收款账号', trigger: 'blur'}],
  // receiptBankName: [{required: true, message: '请输入收款银行', trigger: 'blur'}],
  remark: [{required: true, message: '请输入备注', trigger: 'blur'}],
}

