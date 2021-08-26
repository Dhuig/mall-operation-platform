<template>
	<div>
		<guideBar />
		<el-row type="flex" justify="end" class="marginB20">
			<el-button
				v-permission="'material_list_add_source_material'"
				type="primary"
				icon="el-icon-plus"
				@click="sourceMaterial('添加素材', 'add')"
			>
				添加素材
			</el-button>
			<el-button
				v-permission="'material_list_start_up_source_materials'"
				type="primary"
				icon="el-icon-circle-check"
				@click="batchOperation('switch', { status: 1 })"
			>
				批量启用素材
			</el-button>
			<el-button
				v-permission="'material_list_disable_source_materials'"
				type="primary"
				icon="el-icon-circle-close"
				@click="batchOperation('switch', { status: 0 })"
			>
				批量禁用素材
			</el-button>
			<el-button
				v-permission="'material_list_delete_source_materials'"
				type="primary"
				icon="el-icon-delete"
				@click="batchOperation('del')"
			>
				批量删除素材
			</el-button>
		</el-row>
		<el-card>
			<searchPanel v-model="searchConfig" :config="MATERIAL_LIST_SEARCH" @search="search" />
		</el-card>
		<el-card>
			<tableList
				:columns="MATERIAL_LIST_COLUMNS"
				:pagination="tabPanes.pagination"
				:dataTotal="tabPanes.total"
				:loading="tabPanes.loading"
				:dataSource="tabPanes.data"
				ref="tableList"
				@handleSelectionChange="handleSelectionChange"
				:options="{ operatesWidth: 300, selection: true, saveSelection: true, rowKey: 'id' }"
				@loadMore="loadMore"
				slotcontent
			>
				<template slot-scope="scope" width="300">
					<el-button
						type="text"
						v-permission="'material_list_details_source_material'"
						@click="sourceMaterial('素材详情', 'details', scope.data.id)"
					>
						详情
					</el-button>
					<el-button
						v-permission="'material_list_edit_source_material'"
						type="text"
						@click="sourceMaterial('素材编辑', 'edit', scope.data.id)"
					>
						编辑
					</el-button>
					<el-button
						v-permission="'material_list_disable_source_material'"
						v-if="scope.data.status == 1"
						type="text"
						@click="operation(scope.data, 'switch', { status: 0 })"
					>
						禁用
					</el-button>
					<el-button
						v-permission="'material_list_start_up_source_material'"
						v-if="scope.data.status == 0"
						type="text"
						@click="operation(scope.data, 'switch', { status: 1 })"
					>
						启用
					</el-button>
					<el-button
						v-permission="'material_list_delete_source_material'"
						type="text"
						@click="operation(scope.data, 'del')"
					>
						删除
					</el-button>

					<el-button
						type="text"
						v-permission="'material_list_download_record'"
						@click="sourceMaterial('下载记录', 'down', scope.data.id)"
					>
						下载记录
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>
<script>
import { TABITEM, MATERIAL_LIST_SEARCH, MATERIAL_LIST_COLUMNS, COMMONDATA } from './config';
import { timeStartFormat, timeEndFormat } from 'util';
export default {
	name: 'materialList',
	data() {
		return {
			MATERIAL_LIST_SEARCH,
			MATERIAL_LIST_COLUMNS,
			tabPanes: new TABITEM(),
			searchConfig: {
				name: '', // 素材名称
				materialNo: '', // 素材编号
				applyTime: [], // 上传时间
				cmsClassificationLabelIds: [], // 素材分类
				cmsTypeLabelId: '',
				status: '', // 素材状态
			},
			objApi: {
				// 批量删除
				del: this.batchDelCmsMaterial,
				// 批量 启用/禁用
				switch: this.batchEnableOrDisableCmsMaterial,
			},
		};
	},
	computed: {
		// 搜索参数
		searchFields() {
			const {
				searchConfig,
				searchConfig: { applyTime = ['', ''], cmsClassificationLabelIds },
			} = this;
			const { pagination } = this.tabPanes;
			const params = {
				...searchConfig,
				...pagination,
				startTime: timeStartFormat(applyTime[0]) || '',
				endTime: timeEndFormat(applyTime[1]) || '',
				cmsClassificationLabelIds: cmsClassificationLabelIds && cmsClassificationLabelIds.join(','),
			};
			delete params.applyTime;

			return params;
		},
	},
	methods: {
		// 下拉加载
		loadMore() {
			const { pageNum, pageSize } = this.tabPanes.pagination;
			const { tabTotal } = this.tabPanes;
			console.log(tabTotal);
			if (pageNum * pageSize >= tabTotal) return this.$message.warning('没有更多数据');
			this.tabPanes.pagination.pageNum++;
			this.loadData();
		},
		// 搜索
		search() {
			this.tabPanes.pagination.pageNum = 1;
			this.tabPanes.data = [];
			this.$nextTick(this.loadData);
		},
		// 获取素材列表列表数据
		async loadData() {
			const { tabPanes, searchFields } = this;
			tabPanes.loading = true;

			Object.keys(searchFields).map(i => {
				if (!searchFields[i] && typeof searchFields[i] !== 'number') {
					delete searchFields[i];
				}
			});

			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/cms/material/queryCmsMaterialFileList`,
				timeout: 60000 * 1,
				data: { ...searchFields },
			});
			if (res?.code == 200) {
				const { list, total } = res.data;
				tabPanes.data = tabPanes.data.concat(list);
				tabPanes.tabTotal = total;
			}
			tabPanes.loading = false;
		},
		// 获取素材分类 下拉框数据
		async getClassificationDate() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/cms/classificationLabel/queryLabelList`,
				timeout: 60000 * 1,
				data: COMMONDATA,
			});
			if (res?.code == 200) {
				const { cmsLabelRespVos } = res.data;
				let optionArray = cmsLabelRespVos.map(({ id, name }) => ({ value: id, label: name }));
				this.MATERIAL_LIST_SEARCH.form[3].options = optionArray;
			}
		},
		// 获取素材标签 下拉框数据
		async getLabelDate() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/cms/typeLabel/queryTypeLabelList`,
				timeout: 60000 * 1,
				data: COMMONDATA,
			});
			if (res?.code == 200) {
				const { cmsLabelRespVos } = res.data;
				let optionArray = cmsLabelRespVos.map(({ id, name }) => ({ value: id, label: name }));
				this.MATERIAL_LIST_SEARCH.form[4].options = optionArray;
			}
		},
		// 批量选择
		handleSelectionChange(val) {
			this.tabPanes.selections = val;
		},
		// 批量操作
		batchOperation(type, params) {
			let ids = this.tabPanes.selections.map(x => x.id);
			const data = {
				ids,
				...params,
			};
			if (ids && ids.length) {
				this.objApi[type](data);
				this.$refs.tableList.$children[0].clearSelection();
				return;
			}
			return this.$message.warning('请选择数据');
		},
		// 跳转新增 / 编辑 / 详情 / 下载记录
		sourceMaterial(title, type, id = '') {
			let query = { title, type };
			if (id) {
				query = { ...query, id };
			}
			let routerName = type == 'down' ? 'material_Download' : 'material_Details';
			this.$go(routerName, query);
		},
		// 操作
		operation({ id }, type, params) {
			if (!id) {
				return this.$message.error('id 不存在');
			}
			this.$refs.tableList.$children[0].clearSelection();
			const data = {
				ids: [id],
				...params,
			};
			this.objApi[type](data);
		},
		// 删除接口
		batchDelCmsMaterial(data) {
			this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				center: true,
			}).then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: `/mgmt/cms/material/batchDelCmsMaterial`,
					timeout: 60000 * 1,
					data,
				});
				if (res?.code == 200) {
					this.search();
				}
			});
		},
		// 启用/禁用接口
		async batchEnableOrDisableCmsMaterial(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/cms/material/batchEnableOrDisableCmsMaterial`,
				data,
			});
			if (res?.code == 200) {
				this.search();
			}
		},
		// 清空选中 并且 刷新表格
		updata() {
			this.$refs.tableList.$children[0].clearSelection();
			this.search();
		},
	},
	created() {
		this.$listen('MATERIAL_LIST', this.updata);
	},
	async mounted() {
		await this.getClassificationDate();
		await this.getLabelDate();
		this.loadData();
	},
};
</script>
<style lang="scss" scoped>
.marginB20 {
	margin-bottom: 20px;
}
.el-input {
	width: 600px;
}
.el-textarea {
	width: 600px;
}
</style>