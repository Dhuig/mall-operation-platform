export const forbidScalingPlugin = {
	install(vue) {
		// 禁止用户对页面进行缩放操作
		const KEY_CODE_MAP = {
			// 91: true, // command
			61: true,
			107: true, // 数字键盘 +
			109: true, // 数字键盘 -
			173: true, // 火狐 - 号
			187: true, // +
			189: true, // -
		};
		// 覆盖ctrl||command + ‘+’/‘-’
		function forbidScalingByKeyboardEvent(event) {
			const e = event || window.event;
			const ctrlKey = e.ctrlKey || e.metaKey;
			if (ctrlKey && KEY_CODE_MAP[e.keyCode]) {
				e.preventDefault();
				forbidNotice();
			} else if (e.detail) { // Firefox
				event.returnValue = false;
				forbidNotice();
			}
		}
		// 覆盖鼠标滑动
		function forbidScalingByMouseEvent(e) {
			if (e.ctrlKey) {
				if (e.deltaY !== 0) {
					e.preventDefault();
					forbidNotice();
					return false;
				}
			}
		}
		// 禁止绽放的提示
		function forbidNotice() {
			vue.prototype.$notify.error({
				title: '禁止缩放',
				message: '缩放页面不利于完整展示系统的信息内容, 我们已将快捷缩放关闭, 如需缩放, 请使用浏览器的配置功能进行缩放',
				position: 'bottom-right',
			});
		}
		// 禁止键盘触发缩放
		window.addEventListener('keydown', forbidScalingByKeyboardEvent);
		// 禁止鼠标触发缩放
		window.addEventListener('wheel', forbidScalingByMouseEvent, { passive: false });
	}
}
