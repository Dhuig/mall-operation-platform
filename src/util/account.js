
export default class Account {
	static DEFAULT_ACCOUNT = {
		username: '',
		password: '',
		save: false,
	}
  // 下次自动登录存储帐号信息
	static saveAccount(account) {
		if (account) {
			const {username,password,save} = account

			if (save) {
				let userArray = this.getLocalStorage()
				if (userArray.filter(x=>x.username == username).length) {
					userArray.map(x=> username == x.username ? x.password = password: x)
				} else {
					userArray.push(account)
				}
				// 保存
				localStorage.setItem('OP_cacheAccount', btoa(JSON.stringify(userArray)));
			} else {
				// 清空
        this.clearKeyAccount(username)
			}
		}
	}
	// 读取最新存储 的 用户 密码 
	static getInitialAccount() {
		try {
			const uerInfoArr = this.getLocalStorage()
			const length = uerInfoArr.length - 1
			const accountInfo = uerInfoArr.length ? uerInfoArr[length] : { ... this.DEFAULT_ACCOUNT };
			return accountInfo;
		} catch (err) {
			console.warn('[WARN]读取帐号信息失败');
			return { ...this.DEFAULT_ACCOUNT };
		}

	}
	// 读取 保存密码的 密码
	static getPassWord(name){
		const getInfoArr = this.getLocalStorage()
		return getInfoArr.find(({username})=> name == username)?.password
	}
  // 清空对应 key 的账号信息
  static clearKeyAccount(username) {
    let getInfoArr = this.getLocalStorage()
		let resultArr = getInfoArr.filter(x=> x.username!= username)
		// 保存
		localStorage.setItem('OP_cacheAccount', btoa(JSON.stringify(resultArr)));
  }
	// 获取本地储存的 账号集
	static getLocalStorage() {
		const getInfoArr = localStorage.getItem('OP_cacheAccount');
		return getInfoArr ? JSON.parse(atob(getInfoArr)): []
	}
	// 兼容旧版的储存 以前 {} ------> 现在 []
	static changeLocalStorage() {
		const obj = this.getLocalStorage()
		if (Object.prototype.toString.call(obj) === '[object Object]') {
			localStorage.setItem('OP_cacheAccount', btoa(JSON.stringify([obj])));
		}
		return
	}
}

 