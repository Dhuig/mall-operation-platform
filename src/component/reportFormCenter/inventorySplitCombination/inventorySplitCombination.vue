<template>
	<div class="inventory-split-combination-report">
		<guideBar>
			<el-button
				:loading="exportLoading"
				type="primary"
				v-permission="'inventory_split_combination_form_batchexport'"
				@click="batchExport"
			>
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<el-tabs v-model="activeName">
				<el-tab-pane name="split" label="库存拆分报表">
					<inventory-split-form v-model="searchData" :activeName="activeName" />
				</el-tab-pane>
				<el-tab-pane name="combination" label="库存组合报表">
					<inventory-combination-form v-model="searchData" :activeName="activeName" />
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import inventorySplitForm from './unit/inventorySplitForm.vue';
import inventoryCombinationForm from './unit/inventoryCombinationForm.vue';
export default {
	name: 'inventorySplitCombination',
	components: {
		'inventory-split-form': inventorySplitForm,
		'inventory-combination-form': inventoryCombinationForm,
	},
	data() {
		return {
			activeName: 'split',
			searchData: {}, // 搜索传值
			exportLoading: false,
		};
	},
	methods: {
		// 批量导出
		async batchExport() {
			const urlData = {
				split: '/mgmt/inventory/split/statement-export',
				combination: '/mgmt/inventory/combine/statement-export',
			};
			this.exportLoading = true;
			const res = await this.$fetch({
				method: 'GET',
				url: urlData[this.activeName],
				params: this.searchData,
				callback: () => {
					this.exportLoading = false;
				},
			});
			if (res?.code == 200) {
				this.$message.success('excel表格正在生成中，请在下载管理查看');
			} else {
				this.$message.error('操作失败');
			}
		},
	},
};
</script>

<style>
</style>