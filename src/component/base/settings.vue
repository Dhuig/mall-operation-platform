<template>
	<div>
		<guideBar />
		<el-card>
			<h3 slot="header">系统功能</h3>
			<el-button type="text" @click="openChangePWModal" icon="el-icon-key">修改密码</el-button>
			<el-button type="text" @click="skioToDownloadPage" icon="el-icon-download">下载管理</el-button>
			<el-button type="text" @click="showDrive" icon="el-icon-guide">系统引导</el-button>
		</el-card>
		<el-card>
			<h3 slot="header">布局视图</h3>
			<el-button type="text" @click="openSwitchSideBarModal" icon="el-icon-s-operation">切换菜单</el-button>
			<el-button type="text" @click="toggleScreenFull" icon="el-icon-monitor">
				切换全屏模式/普通模式
			</el-button>
		</el-card>
	</div>
</template>

<script>
import { loadScript } from '@/util';
import { steps } from './config';

export default {
	name: 'settings',
	data() {
		return {
			driver: null,
		};
	},
	methods: {
		// 切换菜单
		openSwitchSideBarModal() {
			this.$dispatch('OPEN_SWITCH_MENU_MODAL');
		},
		// 切换菜单
		openChangePWModal() {
			this.$dispatch('OPEN_CHANGE_PW_MODAL');
		},
		//  打开下载管理页
		skioToDownloadPage() {
			this.$go('download_manage');
		},
		// 切换全屏/普通状态
		toggleScreenFull() {
			window.screenfull && window.screenfull.toggle();
		},
		//
		showDrive() {
			/* eslint-disable */
			const loading = this.$loading({
				lock: true,
				text: 'Loading',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)',
			});
			loadScript(
				'https://unpkg.com/driver.js/dist/driver.min.js',
				() => {
					const link = document.createElement('link');
					link.rel = 'stylesheet';
					link.type = 'text/css';
					link.href = 'https://unpkg.com/driver.js/dist/driver.min.css';
					document.getElementsByTagName('head')[0].appendChild(link);
					setTimeout(() => {
						this.driver = new Driver({
							allowClose: true,
							doneBtnText: '完成',
							closeBtnText: '关闭',
							stageBackground: '#fff',
							nextBtnText: '下一步',
							prevBtnText: '上一步',
						});
						this.driver.defineSteps(steps);
						loading.close();
						this.driver.start();
					}, 1000);
				},
				'driver'
			);
			/* eslint-disable */
		},
	},
};
</script>
