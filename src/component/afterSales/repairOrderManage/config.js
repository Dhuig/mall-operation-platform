import { formatDateStr } from '@/util/formValidation';
export const RETURN_MAINTAIN_SEARCH = {
  form: [
    {
      label: '单号',
      key: 'repairNo',
      type: 'input',
      value: '',
      placeholder: '请输入单号',
    },
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编号',
    },
    {
      label: '顾客卡号',
      key: 'custCard',
      type: 'input',
      value: '',
      placeholder: '请输入顾客卡号',
    },
    {
      label: '产品',
      key: 'productInfo',
      type: 'input',
      value: '',
      placeholder: '请输入产品编号或产品名称',
    },
    {
      label: '申请时间',
      key: 'createTime',
      type: 'datePicker',
      value: ['', ''],
      config: {
        type: 'daterange',
        valueFormat: 'yyyy-MM-dd'
      },
      placeholder: '请选择申请时间',
    },
    {
      label: '顾客姓名',
      key: 'customer',
      type: 'input',
      value: '',
      placeholder: '请输入顾客姓名',
    },
    {
      label: '顾客电话',
      key: 'phoneNum',
      type: 'input',
      value: '',
      placeholder: '请输入顾客电话',
    }
  ]
}

export const RETURN_MAINTAIN_TABS = [
  ['全部', '0'],
  ['待处理', '1'],
  ['已接单', '2'],
  ['维修中', '3'],
  ['已完成', '99'],
  ['已取消', '98'],
]

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

const shelfLifeArr = ['', '保质期内', '保质期外']
export const repairStatusArr = {
  0: '1',
  1: '待处理',
  2: '已接单',
  3: '维修中',
  99: '已完成',
  98: '已取消',
}
export const RETURN_MAINTAIN_COLUMNS = [
  { label: '序号', prop: 'no', type: "index", align: 'center', width: 50, formatter: (record, prop, index) => index + 1 },
  { label: '单号', prop: 'repairNo', align: 'center', width: '120' },
  { label: '服务中心编号', prop: 'storeCode', align: 'center', width: '100' },
  { label: '产品编号', prop: 'productCode', align: 'center', },
  { label: '产品名称', prop: 'productName', align: 'center', width: '130' },
  { label: '保质期', prop: 'shelfLife', align: 'center', formatter: ({ shelfLife }) => shelfLifeArr[shelfLife] },
  { label: '顾客卡号', prop: 'custCard', align: 'center', },
  { label: '顾客姓名', prop: 'customer', align: 'center', },
  { label: '顾客电话', prop: 'phoneNum', align: 'center', width: '100' },
  { label: '申请日期', prop: 'createTime', align: 'center', width: '160', formatter: ({ createTime }) => formatDateStr(createTime) },
  { label: '处理状态', prop: 'repairStatus', align: 'center', formatter: ({ repairStatus }) => repairStatusArr[repairStatus] },
]

// PARTS_COLUMNS
export const PARTS_COLUMNS = [
  { label: '配件名称', prop: 'fittingsName', align: 'center' },
  { label: '配件数量', prop: 'quantity', align: 'center' },
  { label: '配件单价', prop: 'unitPrice', align: 'center' },
  { label: '配件金额', prop: 'amount', align: 'center' },
]

export const ADD_RETURN_MAINTAIN_RULES = {
  storeCode: [{ required: true, message: '请输入服务中心编码', trigger: 'blur' },],
  custCard: [{ max: 20, message: '最大不超过20个字符', trigger: 'blur' },],
  customer: [{ required: true, message: '请输入顾客姓名', trigger: 'blur' },],
  phoneNum: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1(3|4|5|7|8)\d{9}$/, message: '请输入11位手机号码', trigger: 'blur' },
  ],
  area: [{ required: true, message: '请选择所在地区', trigger: 'change' },],
  custAddress: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    { min: 1, max: 50, message: '请输入1-50个字符' }
  ],
  productCode: [
    { required: true, message: '请输入产品编码', trigger: 'blur' },
    { min: 1, max: 20, message: '请输入1-20个字符' }
  ],
  // productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' },],
  buyDate: [{ required: true, message: '请选择购买日期', trigger: 'blur' },],
  failDate: [{ required: true, message: '请选择故障日期', trigger: 'blur' },],
  produceDate: [{ required: true, message: '请选择生产日期', trigger: 'blur' },],
  useDate: [{ required: true, message: '请选择使用日期', trigger: 'blur' }],
  serialNo: [{ required: true, max: 50, message: '最大不超过50个字符', trigger: 'blur' }],
  quantity: [
    { required: true, message: '请输入申请数量', trigger: 'blur' },
    { pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: 'blur' },
  ],
  failReasonId: [{ required: true, message: '请选择故障原因', trigger: 'change' }],
  scope: [{ required: true, message: '请选择损坏情况', trigger: 'change' }],
}

