<template>
	<div>
		<el-divider>组合产品列表</el-divider>
		<el-row type="flex" class="row-gap">
			<el-button size="small" type="success" icon="el-icon-plus" @click="addCompositionProduct" :disabled="disabled">
				添加产品
			</el-button>
			<el-alert title="最多只能添加 30 种产品" type="info" show-icon :closable="false" class="add-tips" />
		</el-row>
		<el-row>
			<el-table :data="data" :height="250" size="small" border>
				<el-table-column label="序号" type="index" width="70" align="center" />
				<el-table-column prop="title" label="产品名称" align="center" />
				<el-table-column prop="serialNo" label="产品编码" align="center" />
				<el-table-column prop="retailPrice" label="价格" align="center" />
				<el-table-column prop="pv" label="产品PV" align="center" />
				<el-table-column prop="amount" label="数量" align="center">
					<template slot-scope="scope">
						<el-input
							type="number"
							v-model.number="scope.row.amount"
							size="small"
							:min="1"
							clearable
							:disabled="disabled"
						/>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" @click="removeProduct(scope.$index)" :disabled="disabled">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-row>
		<!-- 添加组合产品弹窗 -->
		<el-dialog
			title="添加产品"
			:visible.sync="show"
			:close-on-click-modal="false"
			:fullscreen="isFullscreen"
			width="60%"
			top="4vh"
			v-drag
		>
			<div>
				<searchPanel v-model="searchConfig" :config="ADD_COMPOSITION_PRODUCT_SEARCH" class="row-gap" @search="search" />
				<tableList
					:options="options"
					:loading="loading"
					:dataSource="searchList"
					:columns="ADD_COMPOSITION_PRODUCT_COLUMNS"
					:pagination="pagination"
					@loadMore="loadMore"
					:height="430"
					:dataTotal="total"
					@handleSelectionChange="handleSelectionChange"
				/>
			</div>
			<el-row type="flex" justify="space-between" slot="footer">
				<el-button @click="isFullscreen = !isFullscreen">切换全屏</el-button>
				<span>
					<el-button @click="handleCancel">取 消</el-button>
					<el-button type="primary" @click="handleConfirm" icon="el-icon-check" :disabled="!selection.length">
						保存
					</el-button>
				</span>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import { ADD_COMPOSITION_PRODUCT_SEARCH, ADD_COMPOSITION_PRODUCT_COLUMNS } from './config';

export default {
	name: 'addCompositionProduct',
	props: ['data', 'disabled'],
	data() {
		return {
			ADD_COMPOSITION_PRODUCT_SEARCH,
			ADD_COMPOSITION_PRODUCT_COLUMNS,
			options: {
				label: '全部',
				index: false,
				selection: true,
				labelIndex: '序号',
			},
			searchConfig: {
				serialNo: '',
				productTitle: '',
			},
			show: false,
			searchList: [],
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			total: 0,
			selection: [],
			loading: false,
			isFullscreen: false,
		};
	},
	computed: {
		searchFields() {
			const { searchConfig } = this;
			return {
				...searchConfig,
				catalogId: null,
				productType: 1,
			};
		},
	},
	methods: {
		// 下拉刷新
		loadMore() {
			let { currentPage, pageSize } = this.pagination;
			if (currentPage * pageSize >= this.total) {
				return this.$message.warning('没有更多数据');
			}
			this.pagination.currentPage++;
			this.loadData();
		},
		// 搜索重置
		search() {
			this.pagination.currentPage = 1;
			this.searchList = [];
			this.loadData();
		},
		// 页码变更回调
		handleChangePage(currentPage) {
			this.pagination.currentPage = currentPage;
			this.loadData();
		},
		// 分页数量改变回调
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.loadData();
		},
		// 复选回调
		handleSelectionChange(selection) {
			this.selection = selection;
		},
		// 添加产品
		addCompositionProduct() {
			this.show = true;
			this.search();
		},
		// 删除产品
		removeProduct(idx) {
			this.data.splice(idx, 1);
		},
		// 添加产品取消
		handleCancel() {
			this.show = false;
			// this.$refs.addCompositionTable.clearSelection();
		},
		// 添加产品确认
		handleConfirm() {
			let addList = [];
			const originList = JSON.parse(JSON.stringify(this.data));
			this.selection.forEach((selection) => {
				const itemIndex = this.data.findIndex(({ versionId }) => versionId === selection.versionId);
				if (itemIndex === -1) {
					addList.push({ ...selection });
				} else {
					originList[itemIndex].amount = 1;
				}
			});

			addList = addList.map((item) => ({ amount: 1, ...item }));

			if (originList.length + addList.length > 30) return this.$message.warning('组合商品数量不能超过 30 个');
			addList = originList.concat(addList);

			this.$emit('updateCompositionData', addList);
			this.$nextTick(() => {
				this.show = false;
				this.selection = [];
			});
		},
		// 查询商品列表
		async loadData() {
			this.loading = true;
			const {
				searchFields,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			const data = {
				pageNum,
				pageSize,
				catalogId: null,
				productType: 1,
				...searchFields,
			};

			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/product/item/getGenProductInfo',
				data,
			});

			if (res && res.data) {
				const { list, total } = res.data;
				this.searchList = this.searchList.concat(list);
				this.total = total;
			} else {
				this.searchList = [];
				this.total = 0;
				this.$message({
					type: 'warning',
					message: '无法搜索到对应的产品',
				});
			}
			this.loading = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.row-gap {
	margin-bottom: 16px;
}
.add-tips {
	margin-left: 16px;
}
</style>
