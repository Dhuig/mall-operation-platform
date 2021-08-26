const CHANNEL = {
  1: '服务中心', 2: '商城', 3: '服务中心+商城'
}
export const AREA_MANGE_COLUMNS = [
  {
    prop: 'tableName',
    label: '表格名称',
    align: 'center',
  },
  {
    prop: 'channel',
    label: '渠道',
    align: 'center',
    formatter: ({ channel }) => CHANNEL[channel]
  },
  {
    prop: 'tableTypeName',
    label: '表格类型',
    align: 'center',
  },
  {
    prop: 'status',
    label: '状态',
    align: 'center',
    formatter: ({ status }) => status ? '启用' : '禁用'
  },
  {
    prop: 'style',
    label: '填写样式',
    align: 'center',
    slot:'fillStyle'
  }
]

export const TABEL_LIST_CONFIG = {
  form: [
    {
      label: '表格名称',
      key: 'tableName',
      type: 'input',
      value: '',
      placeholder: '请输入表格名称',
    },
    {
      label: '渠道',
      key: 'channel',
      type: 'select',
      value: '',
      placeholder: '请选择渠道',
      options: [
        { value: 1, label: '服务中心' },
        { value: 2, label: '商城' },
        { value: 3, label: '服务中心+商城' },
      ]
    },
    {
      label: '表格类型',
      key: 'typeId',
      type: 'select',
      value: '',
      options: []
    },
    {
      label: '状态',
      key: 'status',
      type: 'select',
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
export const TABLE_YTPE_COLUMNS = [
  { prop: 'name', label: '类型名称', align: 'center' },
];
