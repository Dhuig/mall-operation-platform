<template>
	<div>
		<guideBar />
		<el-row type="flex" justify="end" class="marginB20">
			<el-button
				v-permission="'file_list_add_file'"
				type="primary"
				icon="el-icon-plus"
				@click="sourceFile('添加文档', 'add')"
			>
				添加文档
			</el-button>
			<el-button
				type="primary"
				v-permission="'file_lists_start_up_files'"
				icon="el-icon-circle-check"
				@click="batchOperation('switch', { status: 1 })"
			>
				批量启用文档
			</el-button>
			<el-button
				v-permission="'file_lists_disable_files'"
				type="primary"
				icon="el-icon-circle-close"
				@click="batchOperation('switch', { status: 0 })"
			>
				批量禁用文档
			</el-button>
			<el-button
				v-permission="'file_lists_delete_files'"
				type="primary"
				icon="el-icon-delete"
				@click="batchOperation('del')"
			>
				批量删除文档
			</el-button>
		</el-row>
		<el-card>
			<searchPanel v-model="searchConfig" :config="FILE_LIST_SEARCH" @search="search" />
		</el-card>
		<el-card>
			<tableList
				:columns="FILE_LIST_COLUMNS"
				:pagination="tabPanes.pagination"
				:dataTotal="tabPanes.total"
				:loading="tabPanes.loading"
				:dataSource="tabPanes.data"
				ref="tableList"
				@handleSelectionChange="handleSelectionChange"
				:options="{ saveSelection: true, operatesWidth: 300, selection: true, rowKey: 'id' }"
				@loadMore="loadMore"
				slotcontent
			>
				<template slot-scope="scope" width="300">
					<el-button
						v-permission="'file_lists_details'"
						type="text"
						@click="sourceFile('文档详情', 'details', scope.data.id)"
					>
						详情
					</el-button>
					<el-button
						v-permission="'file_lists_edit'"
						type="text"
						@click="sourceFile('文档编辑', 'edit', scope.data.id)"
					>
						编辑
					</el-button>
					<el-button
						v-permission="'file_lists_disable'"
						v-if="scope.data.status == 1"
						type="text"
						@click="operation(scope.data, 'switch', { status: 0 })"
					>
						禁用
					</el-button>
					<el-button
						v-permission="'file_lists_start_up'"
						v-if="scope.data.status == 0"
						type="text"
						@click="operation(scope.data, 'switch', { status: 1 })"
					>
						启用
					</el-button>
					<el-button v-permission="'file_lists_delete'" type="text" @click="operation(scope.data, 'del')">
						删除
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>
<script>
import { TABITEM, FILE_LIST_SEARCH, FILE_LIST_COLUMNS } from './config';
import { timeStartFormat, timeEndFormat } from 'util';

export default {
	name: 'fileList',
	data() {
		return {
			FILE_LIST_SEARCH,
			FILE_LIST_COLUMNS,
			tabPanes: new TABITEM(),
			searchConfig: {
				name: '', // 文档名称
				materialNo: '', // 文档编号
				applyTime: [], // 上传时间
				status: '', // 文档状态
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
				searchConfig: { applyTime = ['', ''] },
			} = this;
			const { pagination } = this.tabPanes;
			const params = {
				...searchConfig,
				...pagination,
				startTime: timeStartFormat(applyTime[0]) || '',
				endTime: timeEndFormat(applyTime[1]) || '',
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
		// 获取文档列表列表数据
		async loadData() {
			const { tabPanes, searchFields } = this;
			tabPanes.loading = true;
			console.log(searchFields);
			Object.keys(searchFields).map(i => {
				if (!searchFields[i] && typeof searchFields[i] !== 'number') {
					delete searchFields[i];
				}
			});

			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/cms/material/queryCmsMaterialDocList`,
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
		// 批量选择
		handleSelectionChange(val) {
			this.tabPanes.selections = val;
			console.log(this.tabPanes.selections);
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
		// 跳转新增 / 编辑 / 详情
		sourceFile(title, type, id = '') {
			let query = { title, type };
			if (id) {
				query = { ...query, id };
			}
			console.log(query);
			this.$go('file_details', query);
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
		async batchDelCmsMaterial(data) {
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
					this.$message.success(res.message);
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
				this.$message.success(res.message);

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
		await this.loadData();
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