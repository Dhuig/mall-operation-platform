// 消息中心-子场景管理列表
export const SYSTEM_MESSGE_MANAGEMENT_SUBSCENEMANAGEMENT_LIST_CONFIG = {
  form: [
    {
      label: '场景标题',
      key: 'sceneTitle',
      type: 'input',
      value: '',
      placeholder: '请输入场景标题'
    },
    {
      label: '编辑时间',
      key: 'time',
      type: 'datePicker',
      value: [],
      config: {
        type: 'daterange', //daterange 日期范围类型
        rangeSeparator: '~',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
      },
    },
    {
      label: '系统消息状态',
      key: 'status',
      type: 'select',
      value: '-1',
      options: [
        {
          value: '-1',
          label: '全部',
        },
        {
          value: '1',
          label: '启用中',
        },
        {
          value: '0',
          label: '已停用',
        },
      ],
      placeholder: '请选择消息状态',
    },
  ],
  buttonGroup: [
    {
      type: '',
      title: '重置',
      key: 'reset',
    },
    {
      type: 'primary',
      title: '搜索',
      key: 'search',
    },
  ],
}
export const COULUMNS_SUBSCENEMANAGEMENT = [
  {
    prop: 'updateTime',
    label: '编辑时间',
    align: 'left',
  },
  {
    prop: 'sceneTitle',
    label: '场景标题',
    align: 'left',
  },
  {
    prop: 'operatorName',
    label: '编辑人员',
    align: 'left',
  },
  {
    prop: 'status',
    label: '消息状态',
    align: 'left',
    formatter: (row) => {
      return `<span style="white-space: nowrap">${row.status === 1 ? '启用中' : '已停用'}</span>`;
    },
  },
]
export const COULUMNS_EDIT_PARMASLIST = [
  { prop: 'field', label: '字段名', align: 'left', },
  { prop: 'fieldDesc', label: '字段释义', align: 'left', },
]
export const COULUMNS_EDIT_MODULELIST = [
  {
    prop: 'templateCode',
    label: '模板编号',
    align: 'left',
  },
  {
    prop: 'title',
    label: '模板名称',
    align: 'left',
  },
]
export const systemMessageManagement = [
  {
    prop: 'dicName',
    label: '系统消息场景大类',
    align: 'left',
  },
  {
    prop: 'count',
    label: '子场景数',
    align: 'left',
  },
]
// 消息中心-系统消息管理列表
export const SYSTEM_MESSGE_MAANGEMENT_CONFIG = {
  form: [
    {
      label: '场景大类',
      key: 'name',
      type: 'input',
      value: '',
      placeholder: '搜索场景大类'
    },
  ],
  buttonGroup: [
    {
      type: '',
      title: '重置',
      key: 'reset',
    },
    {
      type: 'primary',
      title: '搜索',
      key: 'search',
    },
  ],
}


