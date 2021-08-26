import md5 from '../lib/md5';

/**
 * 签名验证类
 * 管理接口签名验证的管理器 @JalonUniversal
 */

class VerifySignature {
	// 获取 Path
	getPath(url) {
		url = url.startsWith('/') ? url : '/' + url;
		let queryPos = url.indexOf('?');
		return queryPos === -1 ? url : url.substring(0, queryPos);
	}
	// 获取 HTTP method
	getMethod(method) {
		return method.toUpperCase();
	}
	// 生成 uuid 方法
	generateUid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (Math.random() * 16) | 0,
				v = c == 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}
	// 返回时间戳
	getTimestamp() {
		return Date.now();
	}
	// 返回 token
	getToken(token) {
		return token;
	}
	// 设置平台 key
	setPlatformKey(platformKey = '') {
		this.platformKey = platformKey;
	}
	// 获取平台 key
	getPlatformKey() {
		return this.platformKey || '';
	}
	// 生成验签请求首部相关字段
	generateVerifyRequestHeaders(path, method, nonce, timestamp, accessToken, key) {
		const signature = Object.entries({
			path,
			method,
			nonce,
			timestamp,
			accessToken,
			key,
		});
		const finnalSignature = signature.reduce((acc, [key, value]) => `${acc}${key}=${value}&`, '')
			.slice(0, -1);
		const encryptedSignature = md5(finnalSignature);

		return {
			"GW-Timestamp": timestamp,
			"GW-Nonce": nonce,
			"GW-Signature": encryptedSignature
		}
	}
}

export default new VerifySignature();
