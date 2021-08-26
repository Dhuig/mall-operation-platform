<template>
	<div :class="['vertical-side-bar', !expand && 'sidebar-shrink']">
		<ul class="menu-list">
			<li class="level-item" v-for="(levelOneMenu, levelOneIndex) in menu" :key="levelOneIndex">
				<!-- 第一栏标题 -->
				<div
					:class="['title', levelOneIndex === activeOneName && 'active']"
					@click="openOneMenu(levelOneMenu, levelOneIndex)"
				>
					<i class="iconfont icon-color" v-html="levelOneMenu.icon" />
					<span class="sidebar-item-title" @click="goTo(levelOneMenu, levelOneIndex)">
						{{ levelOneMenu.name }}
					</span>
					<i
						class="icon-right"
						:class="openedTitles.includes(levelOneIndex) ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"
						v-if="levelOneMenu.children.length"
					/>
				</div>

				<ul :class="['level-item-ul', openedTitles.includes(levelOneIndex) && 'level-item-ul-show']">
					<li class="level-item-li" v-for="(levelTwoMenu, levelTwoIndex) in levelOneMenu.children" :key="levelTwoIndex">
						<!-- 第二栏标题 -->
						<div
							:class="['title', currentTitle == levelTwoMenu.href && 'current']"
							@click="openOneMenu(levelTwoMenu, levelOneIndex + '-' + levelTwoIndex)"
						>
							<span
								class="sidebar-item-title two-menu"
								v-show="expand"
								@click="goTo(levelTwoMenu, levelOneIndex + '-' + levelTwoIndex)"
							>
								{{ levelTwoMenu.name }}
							</span>
							<i
								class="icon-right"
								:class="
									openedTitles.includes(levelOneIndex + '-' + levelTwoIndex)
										? 'el-icon-caret-bottom'
										: 'el-icon-caret-right'
								"
								v-if="levelTwoMenu.children.length"
							/>
						</div>
						<ul
							:class="[
								'level-item-ul',
								openedTitles.includes(levelOneIndex + '-' + levelTwoIndex) && 'level-item-ul-show',
							]"
						>
							<li v-for="(levelThreeMenu, levelThreeIndex) in levelTwoMenu.children" :key="levelThreeIndex">
								<!-- 第三栏标题 -->
								<div :class="['title', currentTitle == levelThreeMenu.href && 'current']">
									<span class="sidebar-item-title three-menu" v-show="expand" @click="goTo(levelThreeMenu)">
										{{ levelThreeMenu.name }}
									</span>
									<i class="el-icon-caret-right" v-if="levelThreeMenu.children.length"></i>
								</div>
							</li>
						</ul>
					</li>
				</ul>
			</li>
		</ul>
		<div class="el-sidebar-shrink-button" @click="toggleExpand">
			<i :class="`el-icon-s-${expand ? 'fold' : 'unfold'}`" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'verticalSideBar',
	props: {
		menu: {
			type: Array,
			default() {
				return [];
			},
			required: true,
		},
	},
	data() {
		return {
			expand: true, //菜单栏是否展开
			openedTitles: [],
			activeOneName: null, // 第一层title name
			currentTitle: null, // 当前激活的菜单（无需考虑页签切换）
		};
	},
	methods: {
		toggleExpand() {
			this.expand = !this.expand;
		},
		// 展开/收缩栏目
		openOneMenu(item, index) {
			if (item.children && item.children.length) {
				if (this.openedTitles.includes(index)) {
					this.openedTitles = this.openedTitles.filter(item => item != index);
				} else {
					this.openedTitles.push(index);
				}
			}
			const subIndex = Number(String(index).split('-')[0]);
			this.activeOneName = this.openedTitles.includes(subIndex) ? subIndex : null;
		},
		// 跳转
		goTo(item) {
			if (!item || !item.href || (item.children && item.children.length)) return;
			this.$router.push(item.href);
			this.currentTitle = item.href;
		},
	},
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
	/* 隐藏滚动条 */
	display: none;
}
.vertical-side-bar {
	width: 264px;
	transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
	position: relative;
	border-right: 1px solid $color-divider;
	z-index: 330;
	background-color: $bg-control;
	&.sidebar-shrink {
		width: 62px;
		.icon-right {
			display: none;
		}
	}
	.menu-list {
		height: calc(100% - 24px);
		overflow-y: auto;
	}
	.icon-color {
		color: $color-red;
	}
	ul {
		li {
			line-height: 48px;
			font-size: 14px;
			color: #303336;
			cursor: pointer;
			.title {
				display: flex;
				align-items: center;
				padding: 0 24px;
				box-sizing: border-box;
				transition: background-color 0.2s;
				user-select: none;
				&:hover {
					background-color: $bg-bar-hover;
				}
				&.current {
					color: #c70032;
					background: #efc4ce;
				}
				.sidebar-item-title {
					flex: 1;
					text-indent: 12px;
					display: inline-block;
					// max-width: 264px;
					width: 188px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					&.two-menu {
						text-indent: 25px;
					}
					&.three-menu {
						text-indent: 44px;
					}
				}
				&.active {
					background: #f7e6ea;
					font-weight: 500;
					box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);
				}
			}
		}
	}
	.level-item-ul {
		/* 下拉缓动 */
		max-height: 0;
		overflow-y: hidden;
		transition: all 0.4s;

		&.level-item-ul-show {
			max-height: 1000px;
		}
	}
	.el-sidebar-shrink-button {
		/* 菜单折叠按钮 */
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 24px;
		background-color: $bg-disabled;
		cursor: pointer;
		&:hover {
			background-color: #f7e6ea;
		}
	}
}
</style>
