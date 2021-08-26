<template>
	<div class="login">
		<div class="login-bg-shadow" />
		<div class="login-bg" :style="{ transform: `scale(${scaleNum})` }">
			<div class="header-text" @click="showEnvSelectorClick">{{ $config.PLATFORM_NAME }}</div>
			<div class="loginleft">
				<img class="img" src="../../assets/login_left.png" />
			</div>
			<div class="loginBox">
				<el-form class="login-form" ref="loginForm" :rules="LOGIN_RULES" :model="loginForm" label-width="20px">
					<el-form-item class="header">
						<p class="text" @dblclick="togglerVersionTip">
							欢迎登录
							<span v-if="showVersion">{{ versionBuildTime }}</span>
						</p>
					</el-form-item>
					<el-form-item class="login-input-item-one">
						<el-input
							class="login-input"
							ref="username"
							prop="username"
							autocomplete="off"
							placeholder="账号"
							v-model.lazy="loginForm.username"
							@blur="getPassWord"
						/>
					</el-form-item>
					<el-form-item class="login-input-item-two">
						<el-input
							prop="password"
							class="login-input"
							autocomplete="off"
							:type="pwdType"
							placeholder="密码"
							v-model="loginForm.password"
						>
							<i @click="togglePasswordShow" slot="suffix" class="el-input__icon el-icon-view" />
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-button
							class="submit"
							:type="buttonType"
							@click="secureLogin"
							:disabled="!loginForm.username"
							v-loading="loading"
						>
							登录
						</el-button>
					</el-form-item>
					<el-form-item>
						<el-checkbox v-model="loginForm.save">记住密码</el-checkbox>
					</el-form-item>
					<el-form-item v-if="showEnvSelector">
						<el-select v-model="currentEnv" placeholder="请选择所使用环境" class="login-input-evn">
							<el-option
								v-for="item in ENV_OPTIONS"
								:key="item.value"
								:label="item.label"
								:value="item.value"
								:disabled="item.disabled"
							/>
						</el-select>
						<p>{{ envTips }}</p>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
import { LOGIN_RULES, ENV_OPTIONS } from './config';
import LoginManager from 'util/login';
import Account from 'util/account';
import { loadServiceCompany, loadPermissinMenus, loadShopTypeData } from '@/service';
import qs from 'querystring';
import { autoImportRoute } from '@/route';
import { pathFormat } from 'util';
import { formatDate } from 'util/formValidation';
import { MessageBox } from 'element-ui';
import { debounce, throttle } from 'underscore';
import RSA from '@/lib/rsa';
import AES from '@/lib/aes';

import { mapMutations } from 'vuex';

export default {
	name: 'login',
	data() {
		return {
			scaleNum: 0.5,
			LOGIN_RULES,
			ENV_OPTIONS,
			showEnvSelectorCount: 0,
			envTips: '',
			checked: true,
			loginForm: Account.getInitialAccount(),
			loading: false,
			pwdType: 'password',
			flatMenu: [],
			versionCode: process.env.VUE_APP_BUILD_TIME,
			showVersion: false,
			currentEnv: this.$store.getters['system/getEnv'],
			encryptLoginInfo: {},
			backendPublicKey: `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDf3n7GvYCjevA+JEnMQHfxDX/ePSviRR2C2tsNSVyuTm6TfaP/HLzNbAO0kK+52nr2HO2LzsSd+a98V4n5npYDWPqbswXzKLj73kBlBI0P6Uf3uygCAZtfd9qkAn0DkgGpVw1VtCb33svBkaQinOYB550OygDM1vemuQYq11E/mQIDAQAB`,
		};
	},
	computed: {
		versionBuildTime() {
			return '构建时间: ' + formatDate(this.versionCode);
		},
		// 环境选择器后门
		showEnvSelector() {
			return this.showEnvSelectorCount && this.showEnvSelectorCount % 5 === 0;
		},
		buttonType() {
			return {
				dev: 'warning',
				test: 'success',
				uat: 'danger',
				prod: 'primary',
			}[this.currentEnv];
		},
	},
	watch: {
		currentEnv: {
			immediate: true,
			handler(env) {
				const protocol = env === 'dev' ? 'http' : 'https';
				this.envTips = LoginManager.changeHost(env, protocol);
				this.UPDATE_ENV(env);
				this.UPDATE_PROTOCOL(protocol);
			},
		},
	},
	methods: {
		...mapMutations('system', ['UPDATE_ENV', 'UPDATE_PROTOCOL', 'UPDATE_PERMISSION_LIST']),
		// 切换版本标识
		togglerVersionTip() {
			this.showVersion = !this.showVersion;
		},
		// 铺平菜单数组
		flatMenuService(menu) {
			menu.forEach(item => {
				if (item.children && item.children.length) {
					if (item.href) {
						this.flatMenu.push(item);
					}
					this.flatMenuService(item.children);
				} else if (item.href) {
					this.flatMenu.push(item);
				}
			});
		},
		// 环境选择器后门
		showEnvSelectorClick() {
			this.showEnvSelectorCount++;
		},
		// 切换密码显隐
		togglePasswordShow() {
			this.pwdType = this.pwdType === 'password' ? '' : 'password';
		},
		// 登录
		handleLogin() {
			this.$refs.loginForm.validate(valid => {
				if (valid) {
					this.requestLoginPermission();
				} else {
					return false;
				}
			});
		},
		// 使用会员卡登录
		async requestLoginPermission() {
			this.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: 'login',
				data: qs.stringify(this.encryptLoginInfo),
				headers: {
					client: 'op',
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: this.$config.DEFAULT_LOGIN_TOKEN,
				},
			});

			if (res && res.code === 200 && res.data) {
				// 成功登陆之后 才保存密码
				Account.saveAccount(this.loginForm);

				LoginManager.handleLogin({ ...res.data });
				loadServiceCompany();
				loadShopTypeData();
				const originMenu = await loadPermissinMenus();
				if (!originMenu || !originMenu.length) {
					MessageBox.alert('系统检测到您没有可用的菜单, 请联系管理员为您添加菜单的访问权限', '提示', {
						confirmButtonText: '好的, 知道了',
					});
				}
				// 铺平嵌套菜单
				this.flatMenuService(originMenu);
				// 生成权限映射表
				const permissionList = Object.create(null);
				permissionList.buttonPermission = [];
				// 与全部路由比较得到可访问的 [页面路由&&按钮权限], 构造权限映射表
				autoImportRoute.forEach(route => {
					this.flatMenu.forEach(menu => {
						if (this.checkPathAndMenu(route.path, menu.href)) {
							const buttonList = menu.buttonList.slice().map(({ buttonCode }) => buttonCode);
							permissionList[menu.href.trim()] = buttonList;
							buttonList.length && permissionList.buttonPermission.push(...buttonList);
						}
					});
				});
				// 权限映射表存入 数据仓库
				this.UPDATE_PERMISSION_LIST(permissionList);
				// this.$store.commit('UPDATE_PERMISSION_LIST', permissionList);
				setTimeout(() => {
					this.loading = false;
					// 跳转进首页
					this.$go('/');
					this.$message.success('登录成功, 欢迎使用完美油葱商城后台');
				}, 200);
			} else {
				this.loading = false;
				this.$message.error((res && res.data.message) || '登录失败, 请检查网络或咨询服务提供方');
			}
		},
		checkPathAndMenu(path, href) {
			const tempPosition = (href || '').indexOf('?');
			let newHref = tempPosition === -1 ? href || '' : (href || '').substring(0, tempPosition);
			return pathFormat(newHref) === pathFormat(path);
		},
		// 监听回车事件
		listenEnterPressDown() {
			document.onkeydown = e => {
				if (e.keyCode === 13) {
					this.$refs.username.blur();
					this.secureLogin();
				}
			};
			this.$once('hook:beforeDestroy', () => {
				document.onkeydown = null;
			});
		},
		resizeHanlder: throttle(function () {
			let scaleNum = document.documentElement.clientWidth / 1920;
			if (scaleNum >= 0.7) this.scaleNum = scaleNum;
		}, 400),
		// 监听页面拖动事件
		listenPageResize() {
			window.addEventListener('resize', this.resizeHanlder);
			this.$once('hook:beforeDestroy', () => {
				window.removeEventListener('resize', this.resizeHanlder);
			});
		},
		// 获取密码
		getPassWord() {
			this.loginForm.password = Account.getPassWord(this.loginForm.username);
		},
		// 安全登录
		secureLogin: debounce(
			function () {
				const AES_KEY = AES.genKey();
				RSA.genKeyPair();
				const key = RSA.encrypt(AES_KEY, this.backendPublicKey);

				const { username, password } = this.loginForm;
				const loginInfo = {
					username,
					password,
					grant_type: 'password',
					auth_type: 'op',
				};

				const data = AES.encrypt(loginInfo, AES_KEY);
				this.encryptLoginInfo = {
					data,
					key,
				};
				// 处理好后请求登录接口
				this.requestLoginPermission();
			},
			500,
			true
		),
	},
	mounted() {
		Account.changeLocalStorage();
		this.listenEnterPressDown();
		this.resizeHanlder();
		this.listenPageResize();
	},
};
</script>
<style lang="scss" scoped>
@keyframes blink {
	0% {
		opacity: 0.05;
	}
	100% {
		opacity: 0.35;
	}
}
.login-bg-shadow {
	width: 100%;
	height: 100%;
	animation: blink 4s alternate infinite;
	background: url('../.././assets/background.png') no-repeat;
	background-size: cover;
}
.login {
	width: 100%;
	height: 100%;
	.login-bg {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -277px;
		margin-left: -489px;
		transform: scale(1);
		width: 968px;
		height: 554px;
		background: #fff;
		box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
		border-radius: 20px;
		transition: all 0.2s;
		background-size: cover;
		&:hover {
			box-shadow: 0px 3px 10px 2px rgba(0, 0, 0, 0.2);
		}
		.header-text {
			position: absolute;
			top: -76px;
			left: 50%;
			font-size: 36px;
			transform: translateX(-50%);
		}
		.loginleft {
			width: 364px;
			float: left;
			.img {
				height: 554px;
			}
		}
		.loginBox {
			width: 585px;
			height: 554px;
			float: left;
			margin-right: 15px;
			background: $bg-control;
			transition: box-shadow 0.4s;
			.login-input {
				width: 524px;
				::v-deep .el-input__inner {
					height: 50px;
					font-size: 20px;
				}
			}
			.login-input-evn {
				width: 524px;
				::v-deep .el-input__inner {
					height: 30px;
					font-size: 20px;
				}
			}
			.login-form {
				.submit {
					width: 524px;
					height: 52px;
					font-size: 20px;
				}
				.login-input-item-two {
					margin-bottom: 54px;
				}
				.login-input-item-one {
					margin-bottom: 40px;
				}
				.header {
					margin-top: 56px;
					margin-bottom: 44px;
					.text {
						font-size: 28px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #333333;
					}
				}
				::v-deep .el-input__inner {
					border: 0;
					border-bottom: 1px solid $color-border;
					border-radius: 0;
				}
			}
			.footer {
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				font-size: 14px;
				color: #666;
				height: 48px;
				line-height: 48px;
				text-align: center;
				background: #f5f5f5;
				cursor: default;
				user-select: none;
			}
		}
	}
}
</style>
