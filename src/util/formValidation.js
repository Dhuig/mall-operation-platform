
// 用于存放搜索校验方法

// 手机验证
export function validatorMobile(rule, value, callback) {
	const reg = /^1(3|4|5|7|8)\d{9}$/;
	if (!reg.test(value)) {
		callback('请输入正确的手机号')
	} else {
		callback()
	}
}

//验证是否0-100之间
export function isOneToNinetyNine(rule, value, callback) {
	const re = /^100$|^(\d|[1-9]\d)(\.\d+)*$/;
	const rsCheck = re.test(value);
	if (!rsCheck) {
		callback(new Error('请输入值为【0,100】'));
	} else {
		callback();
	}
}

// 验证非负数
export function isNonnegativeNumber(rule, value, callback) {
	const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
	if (!reg.test(value) && value !== '') {
		callback('请输入非负数!')
	} else {
		callback()
	}
}

// 验证只能输入0-23位数字(hour小时)
export function isHour(rule, value, callback) {
	const reg = /^(2[0-3]|[0-1]?\d|\*|-|\/)$/;
	if (!reg.test(value) && value !== '') {
		callback('请输入0~23的数字!')
	} else {
		callback()
	}
}

// 验证只能输入0-59位数字（分钟/秒钟）
export function isMinute(rule, value, callback) {
	const reg = /^(?:[1-5]?\d|\*|-|\/)$/;
	if (!reg.test(value) && value !== '') {
		callback('请输入0~59的数字!')
	} else {
		callback()
	}
}

// 验证模板名称限制在40字符以内
export function restrictionName(rule, value, callback) {
	const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,40}$/;
	if (!reg.test(value)) {
		callback('模板名称限制在40字符以内')
	} else {
		callback()
	}
}

// 验证起步件数,限制100件以内
export function restrictionStarters(rule, value, callback) {
	const reg = /^[1-9][0-9]?$/;
	if (!reg.test(value)) {
		callback('起步件数,限制100件以内')
	} else {
		callback()
	}
}

// 验证加价件数必须为正数，限制在100千克以内
export function restrictionMarkups(rule, value, callback) {
	const reg = /^[1-9][0-9]?$/;
	if (!reg.test(value)) {
		callback('加价件数必须为正数，限制在100千克以内')
	} else {
		callback()
	}
}

// 验证默认起步价不能为空，必须为非负数字，限制在1000万以内
export function restrictionDefaultStartingPrice(rule, value, callback) {
	const reg = /^[1-9][0-9]{0,7}$/;
	if (!reg.test(value)) {
		callback('默认起步价不能为空，必须为非负数字，限制在1000万以内')
	} else {
		callback()
	}
}

// 验证默认加价必须为非负数字，限制在1000万以内
export function restrictionIncreasePrice(rule, value, callback) {
	const reg = /^[1-9][0-9]{0,7}$/;
	if (!reg.test(value)) {
		callback('默认加价必须为非负数字，限制在1000万以内')
	} else {
		callback()
	}
}

// 验证只能输入2位数字
export function twoNumber(rule, value, callback) {
	const reg = /^(?:[1-9]?\d|99)$/;
	if (!reg.test(value)) {
		callback('请输入2位数字')
	} else {
		callback()
	}
}

// 验证只能输入数字，支持小数点后两位
export function numberAndDot(rule, value, callback) {
	const reg = /^(\d+(?:\.\d{0,2})?)$/;
	if (!reg.test(value)) {
		callback('请输入输入数字，支持小数点后2位')
	} else {
		callback()
	}
}
//
export function validatorTime(rule, value, callback) {
	if (value === '' || value === null) {
		callback('请输入请选择交易日期')
	} else {
		callback()
	}
}

//传入的分钟数  转换成天、时、分
export function minuteToDate(minute) {
	var day = parseInt(minute / 60 / 24);
	var hour = parseInt(minute / 60 % 24);
	var min = parseInt(minute % 60);
	minute = "";
	if (day > 0) {
		minute = day + "天";
	}
	if (hour > 0) {
		minute += hour + "小时";
	}
	if (min > 0) {
		minute += parseFloat(min) + "分钟";
	}
	//三元运算符 传入的分钟数不够一分钟 默认为0分钟，else return 运算后的minute
	return minute == "" ? "0分钟" : minute;
}

// 获取次月天数
export function getNextMonthNum() {
	let month = new Date().getMonth() + 1;
	let year = new Date().getFullYear();
	if (month + 1 == 12) {
		return {
			str: String(year + 1) + '-' + (month + 1),
			monthNum: new Date(year + 1, 1, 0).getDate(),
		};
	} else {
		return {
			str: year + '-' + (month + 1),
			monthNum: new Date(year, month + 1, 0).getDate(),
		};
	}
}

// 验证正整数
export function isPositiveIntegerNumber(rule, value, callback) {
	const reg = /(^[1-9]\d*$)/;
	if (!reg.test(value)) {
		callback('请输入正整数!')
	} else {
		callback()
	}
}

// 金额
export function isAmount(rule, value, callback) {
	const reg = /^(\d+(?:\.\d{0,2})?)$/;
	if (!reg.test(value)) {
		callback('请输入金额!')
	} else {
		callback()
	}
}

//时间戳转成YYYY-MM-DD hh:mm:ss格式 传不同日期获取不同格式
export function formatDate(date, type = 'default') {
	if (!date) {
		return ''
	}

	let d = new Date(+date);
	let YY = d.getFullYear() + '-';
	let MM = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '-';
	let mms = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1);
	let DD = (d.getDate() < 10 ? '0' + (d.getDate()) : d.getDate());
	let hh = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':';
	let mm = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ':';
	let ss = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
	const typeArr = {
		default: YY + MM + DD + " " + hh + mm + ss,
		day: YY + MM + DD,
		month: YY + mms,
		hms: hh + mm + ss
	}
	return typeArr[type]
}

// 日期格式 Thu Oct 01 2020 00:00:00 GMT+0800 (中国标准时间)转成YYYY-MM-DD hh:mm:ss格式
export function formatDateStr(date, type) {
	let dateNum = new Date(date).getTime()
	return formatDate(dateNum, type)
}

// 时间戳转成YYYY-MM-DD格式
export function formatDateDefault(date) {
	if (!date) {
		return ''
	}
	let d = new Date(date);
	let YY = d.getFullYear() + '-';
	let MM = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '-';
	let DD = (d.getDate() < 10 ? '0' + (d.getDate()) : d.getDate());
	return YY + MM + DD;
}

// 获取上n个月
export function getLastMonth(n = 0) {
	const nowDate = new Date()
	let year = nowDate.getFullYear()
	let month = nowDate.getMonth() - n
	if (month == 0) {
		year = parseInt(year) - 1;
		month = 12;
	}
	if (month < 10) {
		month = `0${month}`
	}
	console.log(`${year}-${month}`)
	return `${year}-${month}`
}

// 金额数字前添加 ￥
export function addPrefixForAmount(amount) {
	return amount || amount === 0 ? `￥ ${amount}` : amount
}
/**
 * 将数值四舍五入(保留2位小数)后格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
 export function formatCurrency(num) {
	num = num.toString().replace(/\$|\\,/g, '');
	if (isNaN(num)) num = "0";
	let sign = (num == (num = Math.abs(num)));
	num = Math.floor(num * 100 + 0.50000000001);
	let cents = num % 100;
	num = Math.floor(num / 100).toString();
	if (cents < 10)
		cents = "0" + cents;
	for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
		num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
	}
	return (((sign) ? '' : '-') + num + '.' + cents);
}

// 获取日期的星期数, 如 2020.09.10 为 周六
export function getWeekFromTime(time) {
	const map = {
		1: '周一',
		2: '周二',
		3: '周三',
		4: '周四',
		5: '周五',
		6: '周六',
		7: '周日',
	}

	return map[new Date(time).getDay()]
}

// 节流
export function throttle(func, delay) {
	var prev = Date.now();
	return function () {
		var context = this;
		var args = arguments;
		var now = Date.now();
		if (now - prev >= delay) {
			func.apply(context, args);
			prev = Date.now();
		}
	}
}

//通过文件url下载
export async function downloadFile(url, fileName) {
	if (!url) {
		return
	}
	let x = new XMLHttpRequest();
	x.open("GET", url, true);
	x.responseType = 'blob';
	x.onload = function () {
		var blob = x.response;
		if (blob.type == "application/octet-stream") return window.open(url)
		if ('msSaveOrOpenBlob' in navigator) {//IE导出
			window.navigator.msSaveOrOpenBlob(blob, fileName);
		}
		else {
			let link = document.createElement('a')
			link.style.display = 'none'
			link.href = URL.createObjectURL(blob)
			link.setAttribute('download', fileName)// 文件名
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link) // 下载完成移除元素
			window.URL.revokeObjectURL(URL.createObjectURL(blob)) // 释放掉blob对象
		}
	};
	x.send();
}


export async function downloadUrlFile(url, fileName,callback) {
	const linkNode = document.createElement('a');
	linkNode.download = `${fileName}`;
	linkNode.style.display = 'none';
	linkNode.href = url
	linkNode.target = '_blank';
	document.body.appendChild(linkNode);
	linkNode.click();
	URL.revokeObjectURL(linkNode.href);
	document.body.removeChild(linkNode);
	callback()
}


//文件上传 类型判断提示
export function uploadFileType(file, whiteList, sizeNum) {
	const { size, name } = file;
	const fileSuffix = name.substring(name.lastIndexOf('.') + 1);
	const fileSize = size / 1024 / 1024 < sizeNum;
	if (whiteList.indexOf(fileSuffix.toLowerCase()) === -1) {
		this.$message.error(`上传文件只能是${whiteList.join('、')}格式`);
		return false;
	}
	if (!fileSize) {
		this.$message.error(`上传文件大小不能超过${sizeNum}MB`);
		return false;
	}
	return true;
}

// 检查是否是数据并返回数组
export function resData(array) {
	return Array.isArray(array) ? array : [];
}

// 将返回的流数据转换为url
export function getObjectURL(file) {
	let url = null;
	if (window.createObjectURL != undefined) {
		// basic
		url = window.createObjectURL(file);
	} else if (window.webkitURL != undefined) {
		// webkit or chrome
		try {
			url = window.webkitURL.createObjectURL(file);
		} catch (error) {
			console.log(error);
		}
	} else if (window.URL != undefined) {
		// mozilla(firefox)
		try {
			url = window.URL.createObjectURL(file);
		} catch (error) {
			console.log(error);
		}
	}
	return url;
}