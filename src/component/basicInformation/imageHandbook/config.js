import { formatDate } from 'util/formValidation'
const CHANNEL = {
  1: '服务中心', 2: '微店', 3: '服务中心+微店'
}
export const IMAGE_BOOK_COLUMNS = [
  { prop: 'manualName',label: '形象手册',align: 'center',},
  { prop: 'channel', label: '使用对象', align: 'center', formatter: ({ channel }) => CHANNEL[channel] },
  { prop: 'status', label: '状态', align: 'center', formatter: ({ status }) => status ? '启用' : '禁用' },
]

export const IMAGE_BOOK_CONFIG = {
  form: [
    {
      label: '形象手册',
      key: 'manualName',
      type: 'input',
      value: '',
      placeholder: '请输入形象手册',
    },
    {
      label: '使用对象',
      key: 'channel',
      type: 'select',
      value: '',
      placeholder: '请选择使用对象',
      options: [
        { value: 1, label: '服务中心' },
        { value: 2, label: '微店' },
      ]
    },
    {
      label: '状态',
      key: 'status',
      type: 'select',
      placeholder: '请选择',
      value: '',
      options: [
        { value: 1, label: '启用' },
        { value: 0, label: '禁用' },
      ]
    }
  ],
  buttonGroup: [
    {
      type: '',
      title: '重置',
      key: 'reset'
    },
    {
      type: 'primary',
      title: '搜索',
      key: 'search'
    }
  ]
}

export const IMAGE_BOOK_RECORD_COLUMNS = [
  { prop: 'manualName', label: '形象手册', align: 'center', },
  { prop: 'storeCode', label: '服务中心编码', align: 'center', },
  { prop: 'storeName', label: '服务中心名称', align: 'center', },
  { prop: 'downloader', label: '用户名', align: 'center', },
  { prop: 'downloadTime', label: '下载时间', align: 'center', formatter: ({downloadTime}) => formatDate(downloadTime) },
]

export const IMAGE_BOOK_RECORD_CONFIG = {
  form: [
    {
      label: '形象手册',
      key: 'manualName',
      type: 'input',
      value: '',
      placeholder: '请输入形象手册',
    },
    {
      label: '服务中心编码',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请输入服务中心编码',
    },
    {
      label: '用户名',
      key: 'downloader',
      type: 'input',
      value: '',
      placeholder: '请输入用户名',
    },
    {
      label: '下载时间',
      key: 'downloadTime',
      type: 'datePicker',
      value: [],
      config: {
        type: 'daterange',
        rangeSeparator: '~',
        startPlaceholder: '开始时间',
        endPlaceholder: '截止时间'
      }
    },
  ],
  buttonGroup: [
    {
      type: '',
      title: '重置',
      key: 'reset'
    },
    {
      type: 'primary',
      title: '搜索',
      key: 'search'
    }
  ]
}

