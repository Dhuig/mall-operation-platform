import { optionGenerator } from 'util';
import { formatDate } from 'util/formValidation';

// 支持公式：文件（doc、docx、xls、xlsx、ppt、pptx、pdf、exe）、图片（jpg、png、jpeg、gif）、视频（mp4、mov）、音频（mp3、wma）
export const FILEFORMAT = {
  fileList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'exe'],
  imgList: ['jpg', 'png', 'jpeg', 'gif'],
  movieList: ['mp4', 'mov'],
  musicList: ['mp3', 'wma'],
}
// 验证商品id只能为数字
let isReg = /^[0-9]+$/;
const productIdRule = (rule, value, callback) => {
  if (value) {
    if (!isReg.test(value)) {
      return callback(new Error('商品ID只支持数字'));
    } else {
      callback()
    }
  }
	callback();
};

// 文件接口 默认type
export const COMMONDATA = {
	type: 1,
}

// 操作内容
export const OPERATIONCONTENT = {
	1: '创建',
	2: '编辑',
	3: '启用',
	4: '禁用',
	5: '删除'
}

// 渠道
export const CHANNEL = {
	1: 'web',
	2: 'app',
	3: '小程序',
	4: 'pc',
}

export function TABITEM() {
	this.loading = false;
	this.data = [];
	this.total = 0;
	this.tabTotal = 0;
	this.selections = []
	this.pagination = {
		pageNum: 1,
		pageSize: 10,
	}
}
// 素材状态
const SOURCE_MATERIAL_STATUS = {
	1: '启用',
	0: '禁用'
}

// 素材列表
export const MATERIAL_LIST_SEARCH = {
	form: [
		{
			label: '素材名称',
			key: 'name',
			type: 'input',
			maxlength: '40',
			value: '',
			placeholder: '请输入素材名称',
		},
		{
			label: '素材编号',
			key: 'materialNo',
			type: 'input',
			maxlength: '40',
			value: '',
			placeholder: '请输入素材编号',
		},
		{
			label: '上传时间',
			key: 'applyTime',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
			},
		},
		{
			label: '素材标签',
			key: 'cmsClassificationLabelIds',
			type: 'select',
			value: [],
			multiple: true,
			placeholder: '请选择素材标签',
			options: []
		},
		{
			label: '素材分类',
			key: 'cmsTypeLabelId',
			type: 'select',
			value: '',
			placeholder: '请选择素材分类',
			options: [],
		},
		{
			label: '素材状态',
			key: 'status',
			type: 'select',
			value: '',
			placeholder: '请选择素材状态',
			options: optionGenerator(SOURCE_MATERIAL_STATUS),
		},
	],
}

// 素材列表
export const MATERIAL_LIST_COLUMNS = [
	{ prop: 'materialNo', label: '素材编号', align: 'center', width: 150 },
	{ prop: 'name', label: '名称', align: 'center', width: 120 },
	{ prop: 'classificationLabeNames', label: '素材标签', align: 'center', width: 150,
		formatter: ({ classificationLabeNames }) => {
			return classificationLabeNames.join(' ')
		}
	},
	{ prop: 'cmsTypeLabelName', label: '素材分类', align: 'center', width: 120 },
	{ prop: 'createTime', label: '上传时间', align: 'center', width: 160,
		formatter: ({ createTime }) => {
			return formatDate(createTime);
		}
	},
	{ prop: 'operator', label: '上传人', align: 'center', width: 180 },
	{ prop: 'status', label: '状态', align: 'center', width: 100,
		formatter: ({ status }) => {
			return status in SOURCE_MATERIAL_STATUS? SOURCE_MATERIAL_STATUS[status] : ''
		}
	},
	{ prop: 'downCount', label: '下载量', align: 'center', width: 100,
		formatter: ({ downCount }) => {
			return downCount + ''
		}
	},
];

// 素材标签 和 素材分类 弹框规则
export const CLASSIFICATION_OR_LABEL_RULE = {
	name: [
		{ required: true, message: '请输入标签名称', trigger: 'blur' }
	]
}

// 素材详情
export const MATERIAFORMRULE = {
  name: [
		{ required: true, message: '请输入素材名称', trigger: 'blur' }
	],
  materialNo: [
		{ required: true, message: '请输入素材编号', trigger: 'blur' }
	],
  cmsTypeLabelId: [
		{ required: true, message: '请选择素材分类', trigger: 'blur' }
	],
  cmsClassificationLabelIds: [
		{ required: true, message: '请选择素材标签', trigger: 'blur' }
  ],
  status: [
		{ required: true, message: '请选择素材状态', trigger: 'blur' }
  ],
  cmsMaterialFileBaseReqVOS: [
		{ required: true, message: '请上传素材', trigger: 'blur' }
  ],
  coverUrl: [
		{ required: true, message: '请上传封面图', trigger: 'blur' }
  ],
  productId: [
    {   validator:  productIdRule, trigger: 'blur' }
  ]
  
}

// 素材下载记录 搜索
export const MATERIAL_DOWNLOAD_SEARCH = {
	form: [
		{
			label: '下载时间',
			key: 'applyTime',
			type: 'datePicker',
			value: [],
			config: {
				type: 'daterange',
			},
		},
		{
			label: '下载来源',
			key: 'channel',
			type: 'select',
			value: '',
			placeholder: '请选择下载来源',
			options: optionGenerator(CHANNEL),
		},
		{
			label: '下载人',
			key: 'download',
			type: 'input',
			value: '',
			placeholder: '下载人',
		}
	],
}

// 素材下载记录 列表
export const MATERIAL_DOWNLOAD_COLUMNS = [
	{ prop: 'createTime', label: '下载时间', align: 'center',
		formatter: ({ createTime }) => {
			return formatDate(createTime);
		}
	},
	{ prop: 'channel', label: '下载来源', align: 'center',
		formatter: ({ channel }) => {
			return channel in CHANNEL? CHANNEL[channel] : ''
		}
	},
	{ prop: 'download', label: '下载人', align: 'center'},
]