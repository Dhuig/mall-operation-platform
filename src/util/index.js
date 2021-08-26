import store from '@/store/index';
import cityJson from 'config/city';
import qs from 'querystring';
import Vue from 'vue';
import CONFIG from '../config/index.js';
import signatureManger from './verifySignature';
const { HOST_MAP } = CONFIG;

// 自定义 FormData 上传
async function fromDataUpload (options, callback) {
	let { formObject, url } = options;
	let formData = new FormData();
	Object.keys(formObject).forEach(key => {
		formData.append(key, formObject[key]);
	});
	let res = await this.$fetch({
		method: 'POST',
		url,
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		data: formData,
	});
	callback && callback(res);
}

export const deferData = function (count = 10) {
  return {
    data () {
      return {
        displayPriority: 0
      }
    },

    mounted () {
      this.runDisplayPriority()
    },

    methods: {
      runDisplayPriority () {
        const step = () => {
          requestAnimationFrame(() => {
            this.displayPriority++
            if (this.displayPriority < count) {
              step()
            }
          })
        }
        step()
      },

      defer (priority) {
        return this.displayPriority >= priority
      }
    }
  }
}
// 配置选项生成器
const optionGenerator = (optionMap, keyType = 'number') => Object.entries(optionMap).map(([value, label]) => ({ value: keyType === 'number' ? Number(value) : String(value), label }));
// 搜索配置生成器
const searchConfigGenerator = searchConfig => {
	const searchData = {};
	if (!searchConfig || !searchConfig.form || !searchConfig.form.length) return {};
	searchConfig.form.forEach(({ key, value }) => {
		// searchData[key] = value;
		searchData[key] = Array.isArray(value) ? value.join(',') : value;
	});
	return searchData;
}
// 指定日期区间生成方法 (datePicker pickerOptions.shortcuts 使用)
const dateRangePickerGenerator = (text, dayCount) => {
	return {
		text,
		onClick(picker) {
			const end = new Date();
			const start = new Date();
			start.setTime(start.getTime() - 3600 * 1000 * 24 * dayCount);
			picker.$emit('pick', [start, end]);
		}
	}
}
// 导出 Excel 文件
const exportExcel = (path, params, event = '批量导出 Excel') => {
  const authtoken = store.getters['user/getToken'];
  const CUR_ENV = store.getters['system/getEnv'] || 'dev';
	// [验证签名]的请求头
	const channel = 'pc';	
	const client = 'op';
	const verifySignatureHeaders = signatureManger.generateVerifyRequestHeaders(
		signatureManger.getPath(path),
		signatureManger.getMethod(`GET`),
		signatureManger.generateUid(),
		signatureManger.getTimestamp(),
		signatureManger.getToken(store.getters['user/getFullToken']),
		signatureManger.getPlatformKey(),
	);
	const url = `//${HOST_MAP[CUR_ENV]}${path}?${qs.stringify(params ? 
					{ ...params, authtoken, channel, client, ...verifySignatureHeaders } : 
					{ authtoken, channel, client, ...verifySignatureHeaders })}`;
	window.open(url, '_blank');
	logExportAction({ url, event });
}

// 构造时间字符串 YYYY-MM-DD
const genDateStr = (date) => {
	if (!date) return '';
	const D = new Date(date);
	const year = D.getFullYear();
	const month = D.getMonth() + 1;
	const day = D.getDate();
	const padZero = (number) => String(number).padStart(2, '0');
	return `${year}-${padZero(month)}-${padZero(day)}`;
}

// 生成本月第一天和最后一天
const genCurrentMonthFirstAndLastDay = (type = 'timestamp') => {
	const date = new Date();
	const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	const range = [firstDay, lastDay];
	if (type === 'timestamp') {
		return range.map(item => new Date(item).getTime())
	} else if (/iso|json/.test(type)) {
		return range.map(item => JSON.stringify(item))
	} else if (/str|string/.test(type)) {
		return range.map(item => genDateStr(item))
	}
	return range;
}

// 导出 Excel 文件（POST请求流文件）
const exportExcelPost = async (url, data, title = "Excel数据表", setTime, event = '批量导出 Excel') => {
	const { $fetch, $confirm } = Vue.prototype;
	const res = await $fetch({
		method: 'POST',
		url: url,
		data,
		responseType: 'blob',
		...setTime
	});
	if (res && res.data) {
		const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
		const objectUrl = URL.createObjectURL(blob);
		const a = document.createElement('a');
		document.body.appendChild(a);
		a.style.display = 'none';
		a.href = objectUrl;
		a.download = title;
		a.click();
		document.body.removeChild(a);
		logExportAction({ url, event });
	} else {
		$confirm('操作失败', '提示');
	}
}

const getStringFromAddressCode = ({ province, city, district, town, townName }, type = 'default') => {
	if (province) {
		const provinceObj = cityJson.filter(item => item.c === province).pop()
		const cityObj = provinceObj.r.filter(item => item.c === city).pop()
		const districtObj = cityObj.r.filter(item => item.c === district).pop()
		// 如果town为空字符串就用townName拼接
		const townObj = town? districtObj.r.filter(item => item.c === town).pop(): {n:townName}
		const returnObj = {
			default: `${provinceObj?.n}${cityObj?.n}${districtObj?.n}${townObj?.n}`,
			arr: [provinceObj?.n, cityObj?.n, districtObj?.n, townObj?.n]
		}
		return returnObj[type]
	} else {
		return ''
	}
}

// 生成随机字符串(随机字母)
function generateRandomCode(count = 6) {
	return 'NB' + Math.random().toString(16).substring(2, count + 2);
}

// 键值对映射转为选择器选项
const mapToSelectOptions = (obj, label = '全部', flag = true) => {
	const arr = []
	for (const key in obj) {
		arr.push({value:key, label:obj[key]})
	}
	flag? arr.unshift({value: null, label}) : null
	return arr
}

// 脚本加载器
function loadScript(url, callback, id) {
	const script = document.createElement("script");
	script.type = "application/javascript";
	id && (script.id = id);

	if (script.readyState) {
		// IE support
		script.onreadystatechange = () => {
			if (/loaded|complete/.test(script.readyState)) {
				script.onreadystatechange = null;
				setImmediate(() => {
					callback && callback();
				});
			}
		};
	} else {
		// Others support
		script.onload = () => {
			setImmediate(() => {
				callback && callback();
			});
		};
	}
	script.src = url;
	if(id && document.getElementById(id)) {
		setImmediate(() => {
			callback && callback();
		});
		return false;
	}
	document.getElementsByTagName("head")[0].appendChild(script);
}

// 日志查询时间处理(起始)
const timeStartFormat = (time) => {
	if (!time) return '';
	return new Date(new Date(time).toLocaleDateString()).getTime();
};

// 日志查询时间处理(结束)
const timeEndFormat = (time) => {
	if (!time) return '';
	return new Date(new Date(time).toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1;
};

// 路由路径剔除符号
function pathFormat(path) {
	if (!path) return '';
	return path.replace(/(\/)|(\s)/g, '');
}

// 下载方法打点
function logExportAction({ url, event }) {
	if (!url) {
		return console.warn('下载文件的 url 不存在, 不作下载动作打点记录');
	}
	Vue.prototype.$bus.$emit('LOG_EXPORT_EXCEL_EVENT', { path: location.hash.replace('#/', '') || '', url, event });
}

// upload组件 上传前更新签名方法
// function updateSignatureVerification(file, callback) {
// 	return new Promise((resolve, reject) => {
//     store.commit('system/UPDATE_SIGNATURE_VERIFICATION');
// 		callback(file) ? resolve() : reject();
//   });
// }
// Vue.prototype.$updateSignatureVerification = updateSignatureVerification;

export {
	optionGenerator,
	searchConfigGenerator,
	dateRangePickerGenerator,
	exportExcel,
	genCurrentMonthFirstAndLastDay,
	exportExcelPost,
	getStringFromAddressCode,
	generateRandomCode,
	mapToSelectOptions,
	loadScript,
	timeStartFormat,
	timeEndFormat,
	pathFormat,
	fromDataUpload
};

