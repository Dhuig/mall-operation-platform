
// 云商信用额录入详情 审核状态panes
export const AUDIT_STATUS_PANES = [
  [ '全部', 'all' ],
  [ '待审核', 'tobeAudit' ],
  [ '审核通过', 'passed' ],
  [ '审核不通过', 'noPass' ],
]
// 云商信用额录入详情 审核状态对应传值
export const AUDIT_STATUS_KEY_VALUE = {
  all: null,
  tobeAudit: 1,
  passed: 2,
  noPass: 9
}
// 云商信用额录入详情 审核状态键值对
export const AUDIT_STATUS_KEY_NAME = {
  1: '待审核',
  2: '审核通过',
  9: '审核不通过',
}

// 审核form rules
export const AUDIT_FORM_RULES = {
  auditStatus: [{ required: true, message: '请选择审核结果', trigger: 'blur' }]
}