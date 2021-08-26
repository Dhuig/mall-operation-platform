import {formatDateStr} from '@/util/formValidation';
const SERVICE_COMPANY_SEARCH = {
  form: [
    {
      label: '云商会员卡号',
      key: 'cardNo',
      type: 'input',
      value: '',
      placeholder: '请填写云商会员卡号',
    }, {
      label: '补报月份',
      key: 'onMonth',
      type: 'datePicker',
      value: '',
      config: {
        pickerOptions:{
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        type: "month",
        placeholder: '请选择补报月份',
      },
    },
  ]
}

const SERVICE_CMMPANY_COLUMN = [
  { label: '云商顾客编号', prop: 'memberNo', align: 'center', width: 150 },
  { label: '云商会员卡号', prop: 'cardNo', align: 'center', width: 150 },
  { label: '云商顾客姓名', prop: 'realName', align: 'center', width: 120 },
  { label: '补报开始时间', prop: 'startTime', align: 'center', width: 180, formatter: (({ startTime }) => formatDateStr(startTime)) },
  { label: '补报结束时间', prop: 'endTime', align: 'center', width: 180, formatter: (({ endTime }) => formatDateStr(endTime)) },
  { label: '补报月份', prop: 'onMonth', align: 'center',formatter: ({ onYear,onMonth }) => `${onYear}-${onMonth}`  },
  { label: '补报类型', prop: 'sceneName', align: 'center', width: 90 },
  { label: '权限状态', prop: 'stateName', align: 'center' },
  { label: '来源', prop: 'source', align: 'center', width: 150 },
  { label: '操作人', prop: 'creatorName', align: 'center', width: 150 },
  { label: '操作时间', prop: 'createTime', align: 'center', width: 180, formatter: (({ createTime }) => formatDateStr(createTime)) },
];

// 修改记录的column
const SERVICE_CMMPANY_ALTER_RECORD_COLUMN = [
  { label: '设置时间', prop: 'updateTime', align: 'center', width: 180, formatter: (({ updateTime }) => formatDateStr(updateTime)) },
  { label: '公开补报开始时间', prop: 'startDay', align: 'center', width: 180 },
  { label: '公开补报结束时间', prop: 'endDay', align: 'center', width: 180 },
  { label: '当月补报截至时间', prop: 'deadline', align: 'center', width: 180 },
  { label: '操作人', prop: 'updaterName', align: 'center', width: 180 },
]

const ADD_FORM_RULES = {
  cardNo: [
    { pattern: /^\d{8,10}$/, message: '输入云商的会员卡号，8~10位数字', trigger: 'blur' },
  ],
  startTime: [
    { required: true, message: '请选择补报开始时间', trigger: 'blur' }
  ],
  endTime: [
    { required: true, message: '请选择补报结束时间', trigger: 'blur' }
  ],
}

const SET_REMEDY_RULES = {
  startDay:[{required:true,message:'请选择开始日期'}],
  startTime:[{required:true,message:'请选择开始时间'}],
  endDay:[{required:true,message:'请选择结束日期'}],
  endTime:[{required:true,message:'请选择结束时间'}],
  deadline:[{required:true,message:'请选择截止时间'}],
}

export {
  SERVICE_COMPANY_SEARCH,
  SERVICE_CMMPANY_COLUMN,
  SERVICE_CMMPANY_ALTER_RECORD_COLUMN,
  ADD_FORM_RULES,
  SET_REMEDY_RULES,
}
