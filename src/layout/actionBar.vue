<template>
	<div :class="['edit-footer', isOpacity && 'temp-show']">
		<slot />
		<div class="temp-show-btn" @mouseover="toggleOpacity(true)" @mouseout="toggleOpacity(false)" />
	</div>
</template>

<script>
export default {
	name: 'actionBar',
	data() {
		return {
			isOpacity: false,
		};
	},
	methods: {
		toggleOpacity(status) {
			this.isOpacity = status;
		},
	},
};
</script>

<style lang="scss" scoped>
.edit-footer {
	position: relative;
	padding: 16px 38px;
	box-shadow: 0px -2px 6px 0px rgba(0, 0, 0, 0.1);
	position: fixed;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	bottom: 0;
	left: 0;
	box-sizing: border-box;
	background-color: $bg-cornt;
	right: 0;
	z-index: 120;
	transition: opacity 0.6s;
}
.temp-show {
	opacity: 0.2;
}
.temp-show-btn {
	position: absolute;
	width: 10px;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 130;
	background-color: $primary;
}
</style>
