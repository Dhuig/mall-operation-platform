import CryptoJS from 'crypto-js';
import AESPlugin from 'crypto-js/aes';
/**
 * 简单封装一下
 */
const aesUtil = {

	//获取key，
	genKey: function (length = 16) {
		let random = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let str = "";
		for (let i = 0; i < length; i++) {
			str = str + random.charAt(Math.random() * random.length)
		}
		return str;
	},

	//加密
	encrypt: function (plaintext, key) {
		if (plaintext instanceof Object) {
			//JSON.stringify
			plaintext = JSON.stringify(plaintext)
		}
		let encrypted = AESPlugin.encrypt(CryptoJS.enc.Utf8.parse(plaintext), CryptoJS.enc.Utf8.parse(key), { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
		return encrypted.toString();
	},

	//解密
	decrypt: function (ciphertext, key) {
		let decrypt = AESPlugin.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key), { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
		let decString = CryptoJS.enc.Utf8.stringify(decrypt).toString();
		if (decString.charAt(0) === "{" || decString.charAt(0) === "[") {
			//JSON.parse
			decString = JSON.parse(decString);
		}
		return decString;
	}
};

export default aesUtil;
