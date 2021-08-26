
export const tableScroll = {
	name: 'tableScroll',
	define: {
		bind(el, binding) {
			let scrollTop = 0;
			let dom = el.querySelector(".el-table__body-wrapper");

			function loadMoreCallback() {
				let reachedBottom = parseInt(dom.scrollHeight - dom.scrollTop) === dom.clientHeight;
				let isHorizontal = scrollTop == dom.scrollTop;

				if (reachedBottom && !isHorizontal && dom.scrollTop !== 0) {
					binding.value && binding.value();
				}
				if (!isHorizontal) {
					scrollTop = dom.scrollTop;
				}
			}

			dom.addEventListener("scroll", loadMoreCallback);
			el.__dom__ = dom;
			el.__loadMoreCallback__ = loadMoreCallback;
		},
		unbind(el) {
			el.__dom__.removeEventListener("scroll", el.__loadMoreCallback__);
		}
	}
}
