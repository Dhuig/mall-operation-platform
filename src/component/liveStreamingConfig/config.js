import { optionGenerator, } from 'util';
import { formatDate, } from '@/util/formValidation';
export const LIVE_STATUS = {
  101: '直播中',
  102: '未开始',
  103: '已结束',
  104: '禁播',
  105: '暂停',
  106: '异常',
  107: '已过期',
}
export const LIVE_STREAMING_SEARCH = {
  form: [
    {
      label: "直播标题",
      key: "name",
      type: "input",
      value: "",
      palceholder: "请输入直播标题",
    },
    {
      label: "状态",
      key: "live_status",
      type: "select",
      value: "",
      options: optionGenerator(LIVE_STATUS),
      palceholder: "请选择状态",
    },
    {
      label: '开播时间',
      key: 'live_time',
      type: 'datePicker',
      // value: genCurrentMonthFirstAndLastDay(),
      config: {
        // valueFormat: 'yyyy-MM-dd HH:mm:ss',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        type: 'daterange',
      },
    },
  ]
}

export const LIVE_STREAMING_COLUMNS = [
  { label: '直播间编号', prop: 'roomid', align: 'center' },
  { label: '直播标题', prop: 'name', align: 'center' },
  { label: '开播时间', prop: 'start_time', align: 'center', formatter: ({ start_time }) => formatDate(start_time * 1000) },
  { label: '结束时间', prop: 'end_time', align: 'center', formatter: ({ end_time }) => formatDate(end_time * 1000) },
  { label: '主播昵称', prop: 'anchor_name', align: 'center' },
  {
    label: '直播卡片封面', prop: 'cover_img', align: 'center',
    formatter: ({ share_img }) => `<img style="width:100%;height:100%" src=${share_img}/>`
  },
  { label: '状态', prop: 'live_status', align: 'center', formatter: ({ live_status }) => LIVE_STATUS[live_status] },
]

export const PRODUCT_COLUMNS = [
  { label: '商品图片', prop: 'cover_img', align: 'center', formatter: ({ cover_img }) => `<img style="width:100%;height:100%" src=${cover_img}/>` },
  { label: '商品名称', prop: 'name', align: 'center' },
  { label: '价格', prop: 'price', align: 'center' },
]
export const REPLAY_DOWNLOAD_COLUMNS = [
  { label: '链接', prop: 'media_url', align: 'center',slot:'media_url' },
]

export const BANNER_POSTER_FORM_RULES = {
  tittleName: [{ required: true, message: '请输入海报标题' }],
  logoUrl: [{ required: true, message: '请选择海报logo' }],
  bannerUrl: [{ required: true, message: '请选择banner图片' }],
}