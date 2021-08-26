<template>
	<div class="service-project-management">
		<guideBar />
		<el-card>
			<el-form :model="form" ref="form" label-width="100px">
				<el-form-item label="服务项目名称" prop="">
					<span>{{ form.itemName }}</span>
				</el-form-item>
				<el-form-item label="服务项目图片" prop="">
					<el-row>
						<el-col :span="3" v-for="item in form.itemFileList" :key="item.id">
							<el-image
								:src="item.fileUrl"
								:preview-src-list="form.itemFileList.map(({ fileUrl }) => fileUrl)"
							></el-image>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="服务项目单位" prop="">
					<span>{{ form.itemUnit }}</span>
				</el-form-item>
				<el-form-item label="服务项目规格" prop="">
					<el-row>
						<el-col :span="6">
							<tableList :dataSource="form.itemSkuList" :columns="SERVICE_PROJECT_SPECS_COLUMNS" />
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="关联产品" prop="">
					<el-row>
						<el-col :span="12">
							<tableList :dataSource="form.itemProductList" :columns="SERVICE_PROJECT_PRODUCT_COLUMNS" />
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="服务说明" prop="">
					<div v-html="form.remarks" id="editor-html"></div>
				</el-form-item>
			</el-form>
		</el-card>
		<actionBar v-permission="'perfect_home_service_project_edit|service_project_edit'">
			<el-button type="primary" @click="toEdit">编辑</el-button>
		</actionBar>
	</div>
</template>

<script>
import { SERVICE_PROJECT_SPECS_COLUMNS, SERVICE_PROJECT_PRODUCT_COLUMNS } from './config';
export default {
	name: 'serviceProjectDetail',
	data() {
		return {
			SERVICE_PROJECT_SPECS_COLUMNS,
			SERVICE_PROJECT_PRODUCT_COLUMNS,
			id: 1, // 暂时默认id 1
			form: {},
		};
	},
	methods: {
		// 编辑
		toEdit() {
			this.$go('service_project_edit', { id: this.id });
		},
		// 获取数据
		async loadData() {
			const res = await this.$fetch(`/mgmt/acc/item/detail/${this.id}`);
			if (res && res.data) {
				this.form = res.data;
			} else {
				this.$message.error('获取数据失败');
			}
		},
	},
	mounted() {
		this.loadData();
		this.$listen('UPDATE_SERVICE_PROJECT_DETAIL', this.loadData);
	},
};
</script>

<style lang="scss" scoped>
::v-deep#editor-html {
	strong,
	em {
		font: revert;
	}
}
</style>
