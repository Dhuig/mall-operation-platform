export const APP_UPDATEINSTALL = {
  1: '是', 0: '否', 2: '不做任何处理'
}
export const APP_MANGE_COLUMNS = [
  { prop: 'clientVersion', label: '版本号', align: 'center', },
  { prop: 'platformType', label: '更新平台', align: 'center', formatter: ({ platformType }) => platformType === 2 ? '苹果手机' : '安卓手机' },
  { prop: 'updateLog', label: '更新内容', align: 'center', },
  { prop: 'createTime', label: '创建时间', align: 'center', },
  { prop: 'updateInstall', label: '是否强制更新', align: 'center', formatter: ({ updateInstall }) => APP_UPDATEINSTALL[updateInstall] },
]