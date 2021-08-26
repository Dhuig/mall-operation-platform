
export const CHANGE_COLUMNS = [
  { prop: 'taskName', label: '任务名称', align: 'center' },
  { prop: 'taskDescribe', label: '任务描述', align: 'center', width: 200},
  { prop: 'taskExplain', label: '条件说明', align: 'left', slot: 'taskExplain', width: 200},
  { prop: 'taskStartTime', label: '任务周期', align: 'center', width: 160, formatter: ({ taskStartTime, taskEndTime }) => `${taskStartTime}至${taskEndTime}`},
  { prop: 'taskType', label: '条件类型', align: 'center', width: 160 },
  { prop: 'taskAPv', label: '达标积分', align: 'center', width: 160 },
  { prop: 'taskBInfo', label: '1个月合格客户经理', align: 'center', width: 140},
  { prop: 'createTime', label: '创建时间', align: 'center', width: 160 },
];
export const INTEGRAL_DETAIL_LIST_COLUMNS = [
  { prop: 'cardNo', label: '会员卡号', align: 'center' },
  { prop: 'currentPV', label: '当前积分', align: 'center'},
  { prop: 'taskPV', label: '达标积分', align: 'center' },
  { prop: 'taskBSuccess', label: '1个月合格客户经理', align: 'center', formatter: ({ taskBSuccess }) => taskBSuccess=='1'?'已完成':'未完成'},
  { prop: 'isSuccess', label: '是否已达标', align: 'center' },
];
export const TASK_COLUMNS = [
  { prop: 'getTime', label: '时间', align: 'center' },
  { prop: 'pv', label: '积分', align: 'center' },
];

export const INTEGRAL_DETAIL_CONFIG = {
  form: [
    {
      label: '会员卡号',
      key: 'cardNo',
      type: 'input',
      value: '',
      placeholder: '请输入会员卡号'
    },
  ],
  buttonGroup: [
    {
      type: 'primary',
      title: '搜索',
      key: 'search'
    }
  ]
}
