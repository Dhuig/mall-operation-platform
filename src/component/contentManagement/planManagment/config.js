export const PLAN_COLUMNS = [
  { prop: 'planName', label: '计划名称', align: 'center' },
  { prop: 'status', label: '状态', align: 'center', formatter: ({ status }) => status==1?'禁用':'启用'},
];

