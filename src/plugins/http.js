import axios from 'axios';
import store from '@/store/index';
import { router } from '@/route';
import { Notification } from 'element-ui';
import LoginManager from 'util/login';
import logHelper from 'util/logHelper';
import signatureManger from 'util/verifySignature';

export const httpPlugin = {
	install(vue) {
		const { HOST_MAP, TIMEOUT, PLATFORM_KEY } = vue.prototype.$config;
		// set default platform key
		signatureManger.setPlatformKey(PLATFORM_KEY);
    // config baseURL
    const baseURL = `${store.getters['system/getProtocol']}://${HOST_MAP[store.getters['system/getEnv']]}`;
		// baseURL config
		axios.defaults.baseURL = baseURL;
		// timeout config
		axios.defaults.timeout = TIMEOUT;
		// request interceptor
		axios.interceptors.request.use(config => {
			if (['login/oauth/token', 'login/lo/', 'login'].includes(config.url)) return config;
			// 从 store 中取 access_token;
			if (!store.getters['user/getFullToken']) {
				let token = localStorage.getItem('OP_accessKey');
				if (token) {
					// 刷新内存中 token (只刷一次)
					store.commit('user/UPDATE_TOKEN', atob(token));
				}
			}

			// [验证签名]的请求头
			const verifySignatureHeaders = signatureManger.generateVerifyRequestHeaders(
				signatureManger.getPath(config.url),
				signatureManger.getMethod(config.method),
				signatureManger.generateUid(),
				signatureManger.getTimestamp(),
				signatureManger.getToken(store.getters['user/getFullToken']),
				signatureManger.getPlatformKey(),
			);
			
			config.headers = {
				...verifySignatureHeaders,
				Authorization: store.getters['user/getFullToken'],
				channel: 'pc',
				client: 'op',
				...config.headers,

			}

			if (/GET/i.test(config.method)) {
				config.url += (
					(config.url.indexOf('?') === -1 ? '?' : '&') + `rnd=${Date.now()}`
				);
			}

			return config;
		});
		// response interceptor
		axios.interceptors.response.use(res => {
			logWrapper(res, baseURL);
			return res;
		});

		async function fetch(config) {
			// 错误状态
			let errorType = true
			let REQUEST_ERROR_MESSAGE = '(接口返回异常错误)'
			try {
				// window.NProgress.start();
				const res = await axios.request(config);
				// error response handler
				if (!res || !res.data) throw new Error(res);
				// stardand response handler
				const { data: { code, message }, request:{responseURL} } = res;
				const flag = responseURL.includes('mgmt/order/deliverInfo')
				// console.log('res: ', res);
				if (code === 200) return res.data;
				if (code === 401) {
					Notification.warning({
						title: 'Token 无效',
						message: '当前系统 Token 不存在 或 失效, 请重新登录, 3秒后会自动跳转到登录界面',
						duration: 3000,
						onClose: () => {
							LoginManager.handleLogout();
							store.commit('user/UPDATE_TOKEN', '');
							router.app.$go('/login');
						}
					});
					errorType = false
					store.commit('system/UPDATA_ERROR_CODE', errorType);
					return false;
				}
				// 顾客订单的特殊接口 不需要拦截
				if ((code === 500 || code === 404) && !flag) {
					Notification.error(`${message}${store.state.system.env !='prod' ? REQUEST_ERROR_MESSAGE : ''}` || `请求失败${store.state.system.env !='prod' ? REQUEST_ERROR_MESSAGE : ''}`);
					errorType = false
					store.commit('system/UPDATA_ERROR_CODE', errorType);
					return res;
				}
				store.commit('system/UPDATA_ERROR_CODE', errorType);
				return res;
			} catch (error) {
				const status = error?.response?.status
				if (status === 401) {
					errorType = false
					Notification.warning({
						title: 'Token 无效',
						message: error.response.data.message || '当前系统 Token 不存在 或 失效, 请重新登录, 3秒后会自动跳转到登录界面',
						duration: 3000,
						onClose: () => {
							LoginManager.handleLogout();
							store.commit('user/UPDATE_TOKEN', '');
							router.app.$go('/login');
						}
					});
				} else if (/^50\d$/.test(status)) {
					errorType = false
					Notification.warning({
						title: '服务器出现问题',
						message: error.response.data.message || '请求失败,服务器可能暂时不可用',
						duration: 2000,
					});
				} else if (status === 400) {
					errorType = false
					Notification.error(`${error.response.data.message}${store.state.system.env !='prod' ? REQUEST_ERROR_MESSAGE : ''}` || `请求失败${store.state.system.env !='prod' ? REQUEST_ERROR_MESSAGE : ''}`);
				}
				config.failed && config.failed(error);
				store.commit('system/UPDATA_ERROR_CODE', errorType);
			}
			finally {
				config.callback && config.callback();
				// window.NProgress.done();
			}
		}
		vue.prototype.$fetch = fetch;
	}
}

function logWrapper(response, baseURL) {
	try {
		if (response.status == 200 && response.data.code == 200) {
			const { config: { url } } = response;
			const host = baseURL;
			const ip = store.getters['system/getIP'];
			const operator = store.getters['user/getUsername'];
			const authtoken = store.getters['user/getToken'];
			const analysisData = {
				ip,
				operator,
				authtoken,
				path: location.hash.replace('#/', '') || '',
			};

			logHelper.postMessage({ url, analysisData, host, event: 'log' });
		}
	} catch (err) {
		console.warn('[WARNING]打点逻辑错误: ' + err.toString());
		return response
	}
}
