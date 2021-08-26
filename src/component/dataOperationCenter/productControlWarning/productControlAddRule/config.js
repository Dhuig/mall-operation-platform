let isName = /[^\w\s\u4e00-\u9fa5]+/;
export const CHECK_WARNING_NAME = (rule, value, callback) => {
	if (!value) {
		return callback(new Error('请填写预警项目名称'));
	} else if (isName.test(value)) {
		return callback(new Error('不支持特殊符号'));
	} else {
		callback()
	}
};

export const CHANGERULESTATUS = {
  0: '数量',
  1: 'PV'
}

export const WARNING_FORM_RULE = {
  warningName: [
    {
      required: true,
      validator: CHECK_WARNING_NAME,
      trigger: 'blur',
    },
  ],
  warningGranularity: [      
    { required: true, message: '请选择预警粒度', trigger: 'change' }
  ],
  warningType: [      
    { required: true, message: '请选择预警类型', trigger: 'change' }
  ],
  dimension: [      
    { required: true, message: '请选择预警维度', trigger: 'change' }
  ],
  shopWarningNumber:  [
    { required: true, message: '请填写购货预警', trigger: 'change' }
  ],
  deliverWarningNumber:  [
    { required: true, message: '请填写交付预警', trigger: 'change' }
  ],
  productCode:[
    { required: true, message: '请输入产品编号，1~40位字符，仅支持单个产品', trigger: 'blur' }
  ]
}