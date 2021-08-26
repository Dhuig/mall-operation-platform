export const AREA_MANGE_COLUMNS = [
	{
		prop: 'code',
		label: '地区编码',
		align: 'left',
	},
	{
		prop: 'provinceName',
		label: '省份名称',
		align: 'left',
	},
	{
		prop: 'cityName',
		label: '城市名称',
		align: 'left',
	},
	{
		prop: 'districtName',
		label: '区县名称',
		align: 'left',
	},
	{
		prop: 'streetName',
		label: '乡镇街名称',
		align: 'left',
	},
]

let isReg = /^[0-9]*$/;
const ruleFcun = (rule, value, callback) => {
	if (!value) {
		return callback(new Error('请输入城市编码'));
	} else if (!isReg.test(value)) {
		return callback(new Error('只支持输入数字'));
	} else {
		callback()
	}
};
// 表单验证规则 Region 
export const REGION_RULES = {
	provinceCode: [{ required: true, message: '请选择省', trigger: 'change' }],
	cityCode: [{ required: true, message: '请选择市', trigger: 'change' }],
	districtCode: [{ required: true, message: '请选择区/县', trigger: 'change' }],
	streetCode: [{ required: true, message: '请选择街乡镇', trigger: 'change' }],
	cityName: [{ required: true, message: '请输入城市名称', trigger: 'blur' },],
	districtName: [{ required: true, message: '请输入区/县名称', trigger: 'blur' }],
	streetName: [{ required: true, message: '请输入街乡镇名称', trigger: 'blur' }],
	newCityCode: [{ required: true, message: '请输入城市编码', validator: ruleFcun, trigger: 'blur' }
		, { min: 2, message: '城市编码长度为2个字符', trigger: 'blur' }],
	newDistrictCode: [{ required: true, validator: ruleFcun, trigger: 'blur' }
		, { min: 2, message: '区/县编码长度为2个字符', trigger: 'blur' }],
	newStreetCode: [{ required: true, message: '请输入街乡镇编码', trigger: 'blur' }
		, { min: 3, message: '街乡镇编码长度为3个字符', trigger: 'blur' }],
};
