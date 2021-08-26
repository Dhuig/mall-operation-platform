<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item>首页</el-breadcrumb-item>
		<el-breadcrumb-item>{{ $parent.$parent.$parent.label }}</el-breadcrumb-item>
	</el-breadcrumb>
</template>

<script>
export default {
	name: 'breadCrumb',
};
</script>
