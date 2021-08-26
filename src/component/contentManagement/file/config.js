import { optionGenerator } from 'util';
import { formatDate } from 'util/formValidation';

// 文档接口 默认type
export const COMMONDATA = {
	type: 2,
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
// 文档状态
const STATUS = {
	1: '启用',
	0: '禁用'
}

// 操作内容
export const OPERATIONCONTENT = {
	1: '创建',
	2: '编辑',
	3: '启用',
	4: '禁用',
	5: '删除'
}


// 文档列表
export const FILE_LIST_SEARCH = {
	form: [
		{
			label: '文档名称',
			key: 'name',
			type: 'input',
			maxlength: '40',
			value: '',
			placeholder: '请输入文档名称',
		},
		{
			label: '文档编号',
			key: 'materialNo',
			type: 'input',
			value: '',
			maxlength: '40',
			placeholder: '请输入文档编号',
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
			label: '文档状态',
			key: 'status',
			type: 'select',
			value: '',
			placeholder: '请选择文档状态',
			options: optionGenerator(STATUS),
		},
	],
}

// 文档列表
export const FILE_LIST_COLUMNS = [
	{  label: '序号', align: 'center', width: 50,  formatter: (record, prop, index) => index + 1},
	{ prop: 'materialNo', label: '文档编号', align: 'center', },
	{ prop: 'name', label: '文档名称', align: 'center',},
	{ prop: 'createTime', label: '上传时间', align: 'center', 
		formatter: ({ createTime }) => {
			return formatDate(createTime);
		}
	},
	{ prop: 'status', label: '状态', align: 'center',
		formatter: ({ status }) => {
			return status in STATUS? STATUS[status] : ''
		}
	}
];

// 文档标签 和 文档分类 弹框规则
export const CLASSIFICATION_OR_LABEL_RULE = {
	name: [
		{ required: true, message: '请输入标签名称', trigger: 'blur' }
	]
}

// 正则部分
const checkData = (rule, value, callback) => {
  if (value) {
    if (/[\u4E00-\u9FA5]/g.test(value)) {
      callback(new Error('编号不能输入汉字'));
    } else {
      callback();
    }
  }
  callback();
}

// 文档详情
export const FILEFORMRULE = {
  name: [
		{ required: true, message: '请输入文档名称', trigger: 'blur' }
	],
	// forwardStatus: [
	// 	{ required: true, message: '请选择转发状态', trigger: 'blur' }
	// ],
  materialNo: [
		{ required: true, message: '请输入文档编号', trigger: 'blur' },
		{ validator: checkData, trigger: 'blur'}
	],
  cmsTypeLabelId: [
		{ required: true, message: '请选择文档标签', trigger: 'blur' }
	],
  cmsClassificationLabelIds: [
		{ required: true, message: '请选择文档分类', trigger: 'blur' }
  ],
  status: [
		{ required: true, message: '请选择文档状态', trigger: 'blur' }
  ],
  coverUrl: [
		{ required: true, message: '请上传封面图', trigger: 'blur' }
  ]
  
}