<template>
	<el-container direction="vertical" class="platform-container">
		<topBar @openSwitchSideBarModal="openSwitchSideBarModal" v-if="!$store.getters['crm/isSkipFromCRM']" />
		<el-container direction="horizontal" class="platform-layout">
			<!-- 菜单导航栏 -->
			<template v-if="!$store.getters['crm/isSkipFromCRM']">
				<sideBar v-if="sideBarType === 'sideBar'" :menu="menu" @tabChange="addTab" />
				<verticalSideBar v-else :menu="menu" />
			</template>

			<el-main class="platform-content customer-tab">
				<el-tabs v-model="activeTab" type="card" @tab-click="clickTab" @tab-remove="removeTab">
					<el-tab-pane
						v-for="{ name, title, component, closable, mode } in tabList"
						:key="name"
						:label="title"
						:name="name"
						:closable="closable"
					>
						<keep-alive v-if="mode !== 'refresh'">
							<component :is="component" ref="componentalive" />
						</keep-alive>
					</el-tab-pane>
				</el-tabs>
				<div class="tab-operation-buttons" v-if="tabList.length">
					<div class="operation-box icon-lock" @click.stop="toggleClosable">
						<i :class="['iconfont', hasLocked ? 'el-icon-unlock' : 'el-icon-lock']" />
					</div>
					<div class="operation-box icon-refresh" @click.stop="refreshActiveTabPage">
						<i class="iconfont">&#xe605;</i>
					</div>
					<div class="operation-box icon-closeAll" @click.stop="openCloseAllTabTips">
						<i class="iconfont">&#xe685;</i>
						<span class="tab-num">{{ tabList.length }}</span>
					</div>
					<div class="operation-box icon-prev" @click.stop="turnToPrevTab">
						<i :class="['iconfont', matchTabIndex === 0 && 'tab-disable']">&#xe682;</i>
					</div>
					<div class="operation-box icon-next" @click.stop="turnToNextTab">
						<i :class="['iconfont', matchTabIndex === this.tabList.length - 1 && 'tab-disable']">&#xe683;</i>
					</div>
				</div>
			</el-main>
			<!-- 关闭页签对话框 -->
			<el-dialog title="提示" :visible.sync="closeTabModal" width="32%" v-drag>
				<span>确认关闭当前 所有 {{ tabList.length }}个 页签吗? 请确保所有页签的内容都处理完毕.</span>
				<span slot="footer" class="dialog-footer">
					<el-checkbox v-model="isIgnore">以后不再提示</el-checkbox>
					<span>
						<el-button @click.stop="closeTabModal = false">取 消</el-button>
						<el-button type="primary" @click.stop="confirmCloseAllTab">关闭所有页签</el-button>
					</span>
				</span>
			</el-dialog>
			<!-- 切换导航栏对话框 -->
			<el-dialog
				class="abow-dialog"
				title="选择导航菜单"
				:visible.sync="switchSideBarModal"
				width="1200px"
				v-drag
				:lock-scroll="false"
			>
				<div class="switch-side-bar-modal">
					<div
						:class="['side-bar', checkedSideBarType === 'elSideBar' && 'side-bar-selected']"
						@click="selectSideBarType('elSideBar')"
					>
						<img src="./assets/elSideBar.gif" />
						<p>折叠式菜单</p>
					</div>
					<div
						:class="['side-bar', checkedSideBarType === 'sideBar' && 'side-bar-selected']"
						@click="selectSideBarType('sideBar')"
					>
						<img src="./assets/sideBar.gif" />
						<p>弹出式菜单</p>
					</div>
				</div>
				<div slot="footer">
					<el-button @click.stop="switchSideBarModal = false">取 消</el-button>
					<el-button type="primary" @click.stop="switchSideBar">确定</el-button>
				</div>
			</el-dialog>
		</el-container>
	</el-container>
</template>

<script>
import qs from 'querystring';
import Sortable from 'sortablejs/modular/sortable.core.esm.js';
import { debounce } from 'underscore';
import CacheTabManager from 'util/tab';
import logHelper from './util/logHelper';

function createTab({ title, name, path, query, component }) {
	const tab = Object.create(null);
	tab.title = title;
	tab.name = name;
	tab.path = path || '';
	tab.query = query || '';
	tab.component = component || '';
	tab.closable = true;
	// constant || refresh 两种模式
	// constant 模式 在浏览器刷新/新建/激活页签时 正常渲染
	// refresh 模式 在浏览器刷新时不渲染页签, 激活页签进行初始渲染
	tab.mode = 'constant';
	return tab;
}

export default {
	data() {
		const ignoreCloseTabTips = Boolean(localStorage.getItem('OP_ignoreCloseTabTips'));
		return {
			menu: this.$store.getters['system/getMenu'],
			activeTab: this.$store.getters['system/getActiveTab'],
			tabList: this.$store.getters['system/getTabList'],
			closeTabModal: false,
			isIgnore: ignoreCloseTabTips,
			ignoreCloseTabTips,
			switchSideBarModal: false,
			checkedSideBarType: localStorage.getItem('sideBarType') || 'sideBar',
			currentRouter: '',
		};
	},
	methods: {
		// 切换页签锁定状态
		toggleClosable() {
			this.tabList[this.matchTabIndex].closable = !this.tabList[this.matchTabIndex].closable;
		},
		enterHandler(e) {
			if (e.keyCode !== 13) return;
			if (e.target.parentNode.className === 'el-input el-pagination__editor is-in-pagination') return;
			if (this.matchTabIndex === -1) return;
			// 获取顶部搜索栏的DOM
			let getSearchDom = this.findDoms('search-header');
			if (getSearchDom) {
				// 执行回车
				const handler = getSearchDom.$children[0].emitSearch;
				handler && handler();
			}
		},
		findDoms(className) {
			if (this.matchTabIndex == -1 || !this.$refs.componentalive[this.matchTabIndex]) return;
			return this.$refs.componentalive[this.matchTabIndex].$children.find((item, index) => {
				if (item.$children.find(x => x.$el._prevClass == className)) {
					return index;
				}
			});
		},
		// 拖拽初始化
		initialDrag() {
			const el = document.querySelector('.el-tabs__nav');
			Sortable.create(el, {
				handle: '.is-active',
				onEnd: ({ newIndex, oldIndex }) => {
					// oldIIndex拖放前的位置， newIndex拖放后的位置
					const currRow = this.tabList.splice(oldIndex, 1)[0];
					this.tabList.splice(newIndex, 0, currRow);
				},
			});
		},
		// 新增页签
		addTab(props) {
			const { name: title, href, query, component } = props;
			// 查询字符串拼接
			const querystring = query && Object.keys(query).length ? `?${qs.stringify(query)}` : '';
			// 以完整 path 作为 页签 name, 便于唯一性识别
			const name = href + querystring;
			// 判断页签是否打开
			const openedTab = this.tabList.find(tab => tab.name === name);
			if (openedTab) {
				openedTab.mode = 'constant';
				return (this.activeTab = openedTab.name);
			}
			// 若未打开 则新建页签
			const addTabItem = createTab({
				title: query.title || title, // 优先使用 query 中的 title
				name,
				idx: this.tabList.length,
				href,
				query: querystring,
				component,
			});
			this.tabList.push(addTabItem);
			this.activeTab = addTabItem.name;
		},
		// 移除标签页
		removeTab(targetName) {
			if (!targetName) return;
			const tabs = this.tabList;
			let activeName = this.activeTab;

			if (activeName === targetName) {
				tabs.forEach((tab, index) => {
					if (tab.name === targetName) {
						let nextTab = tabs[index + 1] || tabs[index - 1];
						if (nextTab) {
							activeName = nextTab.name;
						}
					}
				});
			}
			this.activeTab = activeName;
			this.tabList = tabs.filter(tab => tab.name !== targetName);
			if (!this.tabList.length) {
				CacheTabManager.clearCachedTabList();
				this.$router.history.replace('/');
			} else {
				this.$router.history.push(activeName);
			}
		},
		// 刷新激活页签所对应的页面组件
		refreshActiveTabPage() {
			const { tabList, matchTabIndex } = this;
			// 获取打开的页签组件配置
			const origin = tabList.splice(matchTabIndex, 1)[0];
			requestAnimationFrame(() => {
				tabList.splice(matchTabIndex, 0, origin);
			});
		},
		// 打开关闭所有页签询问对话框
		openCloseAllTabTips() {
			if (!this.ignoreCloseTabTips) {
				return (this.closeTabModal = true);
			} else {
				this.closeAllTab();
			}
		},
		// 关闭所有页签21
		closeAllTab() {
			this.activeTab = '';
			this.tabList = [];
			CacheTabManager.clearCachedTabList();
			this.$router.history.replace('/');
		},
		// 确认关闭所有页签
		confirmCloseAllTab() {
			this.closeTabModal = false;
			this.closeAllTab();
			this.$nextTick(() => {
				if (this.isIgnore) {
					localStorage.setItem('OP_ignoreCloseTabTips', Number(this.isIgnore));
					this.ignoreCloseTabTips = Boolean(localStorage.getItem('OP_ignoreCloseTabTips'));
				}
			});
		},
		// 后退
		turnToPrevTab() {
			let matchIndex = this.matchTabIndex;
			if (matchIndex === 0) return;
			matchIndex -= 1;
			const name = this.tabList[matchIndex]['name'];
			this.$router.history.push(name);
		},
		// 前进
		turnToNextTab() {
			let matchIndex = this.matchTabIndex;
			if (matchIndex === this.tabList.length - 1) return;
			matchIndex += 1;
			const name = this.tabList[matchIndex]['name'];
			this.$router.history.push(name);
		},
		// 点击选项卡
		clickTab({ name }) {
			this.$router.history.push(name);
		},
		// 刷新页面回调
		refreshPageHanlder(event) {
			event.returnValue = '';

			const { matchTabIndex } = this;
			this.tabList.filter((item, index) => index !== matchTabIndex).map(item => (item.mode = 'refresh'));
			CacheTabManager.cacheTabList(this.tabList);
			// CacheTabManager.syncTabToStorage();
		},
		// 监听页面刷新事件
		listenPageRefresh() {
			window.addEventListener('beforeunload', this.refreshPageHanlder);
			this.$on('hook:beforeDestroy', () => {
				window.removeEventListener('beforeunload', this.refreshPageHanlder);
			});
		},
		// 监听页面按键事件
		listenKeyDown() {
			window.addEventListener('keydown', this.enterHandler);
			this.$on('hook:beforeDestroy', () => {
				window.removeEventListener('keydown', this.enterHandler);
			});
		},
		// 选择菜单导航
		selectSideBarType(type) {
			this.checkedSideBarType = type;
		},
		// 打开切换菜单导航 Dialog
		openSwitchSideBarModal() {
			this.switchSideBarModal = true;
		},
		// 切换菜单导航
		switchSideBar() {
			if (!this.checkedSideBarType) {
				this.$message.error('请选择菜单导航!');
			} else {
				const sideBarType = localStorage.getItem('sideBarType');
				if (sideBarType === this.checkedSideBarType) {
					this.switchSideBarModal = false;
					return;
				} else {
					localStorage.setItem('sideBarType', this.checkedSideBarType);
					this.switchSideBarModal = false;
					window.location.reload(false);
				}
			}
		},
		// crm 客服系统跳转查询 透传参数 到组件实例上的 searchConfig 中
		setCRMQuery() {
			try {
				const crmQuery = this.$store.state.crm.crmQuery;
				const isSkipFromCRM = this.$store.getters['crm/isSkipFromCRM'];
				if (!isSkipFromCRM) return;

				const comp = this.$refs.componentalive[this.matchTabIndex];
				if (!comp) return;
				const { matched } = this.$route;
				const { path } = matched[matched.length - 1];
				// 目前 透传参数
				Object.keys(crmQuery).forEach(query => {
					if (['type'].includes(query) && path.indexOf('service_company_mange') !== -1) return;
					if (query in comp._data.searchConfig) {
						comp._data.searchConfig[query] = crmQuery[query] || '';
					}
				});

				const handler = comp.$children[1].$children[0].emitSearch;
				handler && handler();
			} catch (err) {
				console.warn('[WARNING]crm客服系统跳转查询出错:' + err.toString());
			}
		},
		// crm 跳转查询执行器
		executeCrmQuery() {
			setTimeout(this.setCRMQuery, 700);
		},
		// 监听导出Excel打点事件
		listenExcelExportEvent() {
			this.$bus.$on('LOG_EXPORT_EXCEL_EVENT', this.handleExcelExport);
			this.$on('hook:beforeDestroy', () => {
				this.$bus.$off('LOG_EXPORT_EXCEL_EVENT', this.handleExcelExport);
			});
		},
		// 导出Excel打点处理回调
		handleExcelExport({ path, event: content }) {
			try {
				const module = this.$route.meta.title || '';
				const env = this.$store.getters['system/getEnv'];
				const ip = this.$store.getters['system/getIP'];
				const protocol = this.$store.getters['system/getProtocol'];

				const host = `${protocol}://${this.$config.HOST_MAP[env]}`;

				const authtoken = this.$store.getters['user/getToken'];
				const operator = this.$store.getters['user/getUsername'];
				const logInfo = {
					host,
					event: 'exportExcel',
					analysisData: {
						ip,
						operator,
						authtoken,
						module,
						content,
						path,
						time: Date.now(),
					},
				};
				logHelper.postMessage(logInfo);
			} catch (err) {
				console.warn('[WARNING]打点逻辑错误: ' + err.toString());
			}
		},
		offLineHandler() {
			this.$notify.error({
				title: '网络连接已断开',
				message: '您的网络连接似乎已经断开, 请检查网络连接, 以避免影响系统正常使用',
				position: 'bottom-right',
			});
		},
		// 监听断网情况
		listenOffline() {
			window.addEventListener('offline', this.offLineHandler);
			this.$on('hook:beforeDestroy', () => {
				window.removeEventListener('offline', this.offLineHandler);
			});
		},
	},
	computed: {
		matchTabIndex() {
			return this.tabList.findIndex(({ name }) => name === this.activeTab);
		},
		sideBarType() {
			// sideBarType 有两个, sideBar、elSideBar 默认为 sideBar
			const type = localStorage.getItem('sideBarType');
			return type || 'elSideBar';
		},
		hasLocked() {
			if (/undefined|-1/.test(this.matchTabIndex)) return false;
			return this.tabList[this.matchTabIndex].closable;
		},
	},
	watch: {
		$route: {
			handler(route) {
				// this.$dispatch('UPDATE_TABLIST_LAYOUT');
				if (!route.matched || !route.matched.length) return;
				const { query, matched } = route;
				const {
					path: href,
					meta: { title: name },
					components: {
						default: { name: component },
					},
				} = matched[matched.length - 1];
				if (!href || href === '/') return;
				this.addTab({ href, query, name, component });
				this.currentRouter = href;
			},
			immediate: true,
		},
		activeTab(newValue) {
			debounce(CacheTabManager.cacheActiveTab(newValue), 1200);
		},
		tabList: {
			handler: debounce(function (tabList) {
				CacheTabManager.cacheTabList(tabList);
			}, 1200),
		},
		matchTabIndex: {
			immediate: true,
			handler(val) {
				this.$store.commit('system/UPDATE_ACTIVE_TAB_INDEX', val);
			},
		},
	},
	mounted() {
		this.$listen('CLOSE_TAB', this.removeTab);
		this.$listen('OPEN_SWITCH_MENU_MODAL', this.openSwitchSideBarModal);
		this.$nextTick(this.initialDrag);
		this.listenPageRefresh();
		this.listenKeyDown();
		this.listenOffline();
		this.$getIP();
		this.executeCrmQuery();
		this.listenExcelExportEvent();
	},
};
</script>

<style lang="scss" scoped>
.platform-container {
	height: 100%;
	overflow: hidden;
}
.platform-topBar {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	background-color: #3883f8;
	color: $bg-control;
	font-size: 14px;
	line-height: 60px;
}
.user-name {
	color: $primary;
}
.platform-content {
	position: relative;
	min-width: 500px;
	background: url('./assets/background.png') no-repeat center center;
}
.platform-layout {
	height: calc(100% - 60px);
}
.tab-operation-buttons {
	position: absolute;
	top: 0;
	right: 24px;
	height: 50px;
	display: flex;
	justify-content: space-around;
	align-items: center;
	background-color: transparent;
}
.tab-operation-buttons i {
	font-size: 14px;
	color: #909399 !important;
}
.icon-refresh:hover {
	i {
		animation: refresh-rotate 0.6s 0.5s linear infinite;
	}
}
@keyframes refresh-rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(180deg);
	}
}
.icon-closeAll:hover .tab-num {
	visibility: visible;
}
.tab-num {
	visibility: hidden;
	position: absolute;
	font-size: 12px;
	color: #ccc;
	bottom: 7px;
	right: 6px;
	transform: scale(0.7);
}
.tab-operation-buttons .operation-box {
	position: relative;
	width: 45px;
	height: 45px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	box-shadow: 0 -1px 0 1px rgba(230, 234, 239, 1);
	margin-right: 1px;
	transition: background-color 0.3s;
}
.tab-operation-buttons .operation-box:hover {
	background-color: $bg-control;
}
.tab-disable {
	cursor: not-allowed;
}
.dialog-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.switch-side-bar-modal {
	display: flex;
	justify-content: space-around;
	.abow-dialog {
		overflow: scroll;
	}
	.side-bar {
		border: 2px solid transparent;
		border-radius: 4px;
		box-shadow: 0 0 12px rgba(0, 0, 0, 0.35);
		cursor: pointer;
		transition: border 0.4s;
		overflow: hidden;
	}
	.side-bar-selected {
		border: 2px solid $primary;
	}
	p {
		padding: 15px 0;
		text-align: center;
	}
	img {
		width: 500px;
		height: 340px;
		margin: -25px auto 25px auto;
	}
}
</style>
