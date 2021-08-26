import { formatDateStr } from '@/util/formValidation';
export const RETURN_MAINTAIN_SEARCH = {
  form: [
    {
      label: '返厂维修单号',
      key: 'repairNo',
      type: 'input',
      value: '',
      placeholder: '请填写返厂维修单号',
    }, {
      label: '顾客卡号',
      key: 'cardNo',
      type: 'input',
      value: '',
      placeholder: '请填写顾客卡号',
    }, {
      label: '申请时间',
      key: 'createTime',
      type: 'datePicker',
      value: '',
      config: {
        type: 'daterange',
        // valueFormat: 'yyyy-MM-DD'
      },
      placeholder: '请选择申请时间',
    },
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请填写服务中心编号',
    },
    {
      label: '产品名称',
      key: 'productInfo',
      type: 'input',
      value: '',
      placeholder: '请填写产品名称',
    },
    {
      label: '顾客姓名',
      key: 'realName',
      type: 'input',
      value: '',
      placeholder: '请输入顾客姓名',
    },
    {
      label: '顾客电话',
      key: 'contact',
      type: 'input',
      value: '',
      placeholder: '请输入顾客电话',
    }
  ]
}
export function TABITEM() {
  this.loading = false;
  this.data = [];
  this.total = 0;
  this.selections = []
  this.pagination = {
    currentPage: 1,
    pageSize: 10,
  }
}

export const RETURN_MAINTAIN_TABS = [
  ['全部', '0'],
  ['待审核', '1'],
  ['待退回', '2'],
  ['待检测', '3'],
  ['待付费确认', '4'],
  ['待维修回寄', '5'],
  ['待收货', '6'],
  ['已完成', '99'],
  ['已取消', '97'],
  ['已驳回', '98'],
]

const shelfLifeArr = ['', '保质期内', '保质期外']
export const repairStatusArr = {
  0: '1',
  1: '待审核',
  2: '待退回',
  3: '待检测',
  4: '待付费确认',
  5: '待维修回寄',
  6: '待收货',
  97: '已取消',
  98: '已驳回',
  99: '已完成',
}
const scopeArr = ['', '整件', '部件']
export const RETURN_MAINTAIN_COLUMNS = [
  { label: '序号', prop: 'no', type: "index", align: 'center', width: 50, formatter: (record, prop, index) => index + 1 },
  { label: '服务中心编号', prop: 'storeCode', align: 'center', width: '180' },
  { label: '返厂维修单号', prop: 'repairNo', align: 'center', width: '180' },
  { label: '顾客姓名', prop: 'realname', align: 'center', width: '80' },
  { label: '顾客电话', prop: 'contact', align: 'center', width: '120' },
  { label: '产品名称', prop: 'productName', align: 'center', width: '180' },
  { label: '保质期内/外', prop: 'shelfLife', align: 'center', width: '180', formatter: ({ shelfLife }) => shelfLifeArr[shelfLife] },
  { label: '整件/部件', prop: 'scope', align: 'center', formatter: ({ scope }) => scopeArr[scope] },
  { label: '申请日期', prop: 'createTime', align: 'center', width: '160', formatter: ({ createTime }) => formatDateStr(createTime) },
  { label: '处理状态', prop: 'repairStatus', align: 'center', formatter: ({ repairStatus }) => repairStatusArr[repairStatus] },
]

export const ADD_RETURN_MAINTAIN_RULES = {
  storeCode: [{ required: true, message: '请输入服务中心编码', trigger: 'blur' },],
  cardNo: [{ max: 20, message: '最大不超过20个字符', trigger: 'blur' },],
  realname: [{ required: true, message: '请输入顾客姓名', trigger: 'blur' },],
  contact: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1(3|4|5|7|8)\d{9}$/, message: '请输入11位手机号码', trigger: 'blur' },
  ],
  area: [{ required: true, message: '请选择所在地区', trigger: 'blur' },],
  custAddress: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    { min: 1, max: 50, message: '请输入1-50个字符' }
  ],
  productCode: [
    { required: true, message: '请输入产品编码', trigger: 'blur' },
    { min: 1, max: 20, message: '请输入1-20个字符' }
  ],
  productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' },],
  buyDate: [{ required: true, message: '请选择购买日期', trigger: 'blur' },],
  failureDate: [{ required: true, message: '请选择故障日期', trigger: 'blur' },],
  produceDate: [{ required: true, message: '请选择生产日期', trigger: 'blur' },],
  serialNo: [{ max: 50, message: '最大不超过50个字符', trigger: 'blur' }],
  quantity: [
    { required: true, message: '请输入申请数量', trigger: 'blur' },
    { pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: 'blur' },
  ],
  failureReason: [{ required: true, message: '请输入申请数量', trigger: 'change' }],
}

export const AUDIT_FLOW_STEP = [
  { serviceStatus: 1, title: '提交返厂维修单', createTime: '' },
  { serviceStatus: 2, title: '审核维修单', createTime: '' },
  { serviceStatus: 3, title: '产品退回', createTime: '' },
  { serviceStatus: 4, title: '产品检测', createTime: '' },
  { serviceStatus: 5, title: '支付费用', createTime: '' },
  { serviceStatus: 6, title: '产品回寄', createTime: '' },
  { serviceStatus: 99, title: '完成维修单', createTime: '' },
]
