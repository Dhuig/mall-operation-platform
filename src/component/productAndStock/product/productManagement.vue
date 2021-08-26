<template>
	<div>
		<guideBar>
			<el-button v-permission="'product_management_batch_export'" icon="el-icon-sold-out" @click="batchExport">
				批量导出
			</el-button>
			<el-button v-permission="'product_management_batch_delete'" icon="el-icon-delete" @click="batchDelete">
				批量删除
			</el-button>
			<el-button v-permission="'product_management_batch_import'" icon="el-icon-upload" @click="batchUploadProducts">
				批量导入产品
			</el-button>
			<el-button
				v-permission="'product_management_add_normal'"
				icon="el-icon-circle-plus-outline"
				type="primary"
				@click="createProduct('normal', '新增普通产品')"
			>
				新增产品
			</el-button>
			<el-button
				v-permission="'product_management_add_composition'"
				icon="el-icon-connection"
				type="primary"
				@click="createProduct('composition', '新增组合产品')"
			>
				新增组合产品
			</el-button>
			<el-button
				v-permission="'product_management_add_customize'"
				icon="el-icon-place"
				type="primary"
				@click="createProduct('customize', '新增定制产品')"
			>
				新增定制产品
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="PRODUCT_MANAGEMENT_CONFIG" @search="resetLoad" ref="searchPanel" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeStatusTab">
				<el-tab-pane
					v-for="([label, name], $idx) in PRODUCT_MANAGEMENT_TABS_LIST"
					:key="$idx"
					:label="label"
					:name="name"
				>
					<tableList
						:options="options"
						:loading="tabPanes[activeStatusTab].loading"
						:dataSource="tabPanes[activeStatusTab].data"
						:columns="PRODUCT_COLUMNS"
						:pagination="tabPanes[activeStatusTab].pagination"
						:dataTotal="tabPanes[activeStatusTab].total"
						@handleSelectionChange="handleSelectionChange"
						@handleSizeChange="handleSizeChange"
						@handleChangePage="handleChangePage"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								type="text"
								@click="viewDetail(scope.data.id, 'preview')"
								v-permission="'product_management_detail'"
							>
								详情
							</el-button>
							<el-button
								type="text"
								@click="revertProduct(scope.data.id)"
								v-if="scope.data.versionStatus === 2"
								v-permission="'product_management_reset'"
							>
								撤回
							</el-button>
							<el-button
								type="text"
								@click="commitProduct(scope.data.id)"
								v-if="/1|3|5/.test(scope.data.versionStatus)"
								v-permission="'product_management_submit'"
							>
								提交
							</el-button>
							<el-button
								type="text"
								@click="viewDetail(scope.data.id, 'edit')"
								v-if="/1|7|6|8|3|5/.test(scope.data.versionStatus)"
								v-permission="'product_management_edit'"
							>
								编辑
							</el-button>
							<el-button
								type="text"
								@click="viewHistory(scope.data.productId)"
								v-if="scope.data.productId"
								v-permission="'product_management_history'"
							>
								历史版本
							</el-button>
							<el-button
								type="text"
								@click="deleteProduct(scope.data.id)"
								v-if="scope.data.versionStatus === 1"
								v-permission="'product_management_delete'"
							>
								删除
							</el-button>
							<el-button
								type="text"
								@click="setProductOffsale(scope.data.productId)"
								v-if="scope.data.versionStatus === 7"
								v-permission="'product_management_offsale'"
							>
								下架
							</el-button>
							<el-button
								type="text"
								@click="setProductOnsale(scope.data.productId)"
								v-if="scope.data.versionStatus === 8"
								v-permission="'product_management_onsale'"
							>
								上架
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<el-dialog title="批量导入产品" :visible.sync="exportDialog" width="30%" @closed="dialogClose" v-drag>
			<template>
				<ul class="process">
					<li>
						<p>(1)下载Excel模板</p>
						<el-button type="primary" class="btn" @click="downExcel">点我下载</el-button>
					</li>
					<li>
						<p>(2)按要求填写Excel模板并上传</p>
						<el-upload
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							:show-file-list="false"
							:on-success="uploadSuccess"
						>
							<el-button type="primary" class="btn" :loading="exportLoading">点我上传</el-button>
						</el-upload>
					</li>
					<li>
						<p>(3)导入结果：成功：{{ exportFail.succNum || 0 }}条；失败{{ exportFail.failNum || 0 }}条</p>
						<el-button type="primary" class="btn" @click="downLoadFail" :disabled="!exportFail.failNum > 0">
							导出失败记录
						</el-button>
					</li>
				</ul>
			</template>
			<div slot="footer">
				<el-button @click="exportDialog = false">取 消</el-button>
				<el-button type="primary" @click="exportDialog = false">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import {
	PRODUCT_MANAGEMENT_CONFIG,
	PRODUCT_COLUMNS,
	PRODUCT_MANAGEMENT_TABS_LIST,
	VERSION_STATUS_MAP,
	TABITEM,
} from './config';
import { exportExcel, timeStartFormat, timeEndFormat } from 'util';

export default {
	name: 'productManagement',
	data() {
		const tabPanes = Object.create(null);
		// console.log(new TABITEM());
		PRODUCT_MANAGEMENT_TABS_LIST.map(tabItem => (tabPanes[tabItem[1]] = new TABITEM()));
		return {
			//上传按钮loading
			exportLoading: false,
			//导入失败
			exportFail: {},
			//批量导入dialog
			exportDialog: false,
			PRODUCT_COLUMNS,
			PRODUCT_MANAGEMENT_CONFIG,
			PRODUCT_MANAGEMENT_TABS_LIST,
			activeStatusTab: 'all',
			searchConfig: {
				serialNo: '',
				title: '',
				catalogId: '',
				saleCompanyId: '',
				orderType: '',
				directSale: '',
				lastModifyTimeRange: ['', ''],
			},
			tabPanes,
			options: {
				label: '全部',
				index: false,
				selection: true,
				labelIndex: '序号',
			},
		};
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.stock,
			};
			return params;
		},

		// 产品版本状态字典
		versionStatus() {
			return VERSION_STATUS_MAP[this.activeStatusTab];
		},
		// 搜索字段
		searchFields() {
			const {
				searchConfig,
				searchConfig: { lastModifyTimeRange = ['', ''] },
			} = this;

			const params = {
				...searchConfig,
				startTime: timeStartFormat(lastModifyTimeRange[0]),
				endTime: timeEndFormat(lastModifyTimeRange[1]),
			};
			delete params.lastModifyTimeRange;
			return params;
		},
	},
	watch: {
		versionStatus: {
			immediate: true,
			handler() {
				this.handleSizeChange(100);
			},
		},
	},
	methods: {
		// loadMore() {
		// 	const { currentPage, pageSize } = this.tabPanes[this.activeStatusTab].pagination;
		// 	const { total } = this.tabPanes[this.activeStatusTab];
		// 	console.log(total, this.tabPanes[this.activeStatusTab]);
		// 	if (currentPage * pageSize >= total) {
		// 		return this.$message.warning('没有更多数据');
		// 	}
		// 	this.tabPanes[this.activeStatusTab].pagination.currentPage++;
		// 	this.loadData();
		// },
		//dialog关闭
		dialogClose() {
			this.exportFail = {};
		},
		//批量导入产品点击下载
		downExcel() {
			// window.open('http://106.55.0.36:7480/perfect-default/商品导入模板.xlsx');
			exportExcel('/mgmt/product/item/getItemImportTemplate');
		},
		//上传excel获取oss地址
		async uploadSuccess(response) {
			this.exportLoading = true;
			let data = {
				url: response.datas.fileUrlKey,
			};
			let fail = {
				failNum: 0,
				succNum: 0,
				failUrl: '',
			};
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/product/item/batchImport?url=${data.url}`,
				data: {},
			});
			if (res && res.code == 200) {
				fail = res.data;
				this.exportFail = fail;
			}
			this.exportLoading = false;
		},
		downLoadFail() {
			if (this.exportFail && this.exportFail.failNum !== 0) {
				window.open(this.exportFail.failUrl);
			}
		},
		// 分页改变回调
		handleChangePage(currentPage) {
			this.tabPanes[this.activeStatusTab].pagination.currentPage = currentPage;
			this.loadData();
		},
		// 页码改变回调
		handleSizeChange(pageSize) {
			this.tabPanes[this.activeStatusTab].pagination.pageSize = pageSize;
			this.tabPanes[this.activeStatusTab].pagination.currentPage = 1;
			this.loadData();
		},
		// 搜索
		resetLoad() {
			this.tabPanes[this.activeStatusTab].pagination.currentPage = 1;
			this.tabPanes[this.activeStatusTab].data = [];
			this.$nextTick(this.loadData);
		},
		// 表格项选中回调
		handleSelectionChange(selections) {
			this.tabPanes[this.activeStatusTab].selections = selections.map(({ id }) => id);
		},
		// 批量导出
		batchExport() {
			const { versionStatus, searchFields, activeStatusTab, tabPanes } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = tabPanes[activeStatusTab];
			const params = Object.assign({ versionStatus, pageNum, pageSize }, searchFields);
			exportExcel('/mgmt/product/item/batchExportFile', params);
		},
		// 批量导入
		batchUploadProducts() {
			this.exportDialog = true;
		},
		// 批量删除
		batchDelete() {
			const { selections } = this.tabPanes[this.activeStatusTab];
			if (!selections || !selections.length) return this.$message.warning('请至少选择一项再进行操作');

			this.$confirm('你确定要删除这些产品?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.batchDeleteGoods(selections);
				})
				.catch(() => {
					this.$message.warning('已取消删除操作');
				});
		},
		// 新建产品
		createProduct(category, title) {
			this.$go('/product_detail', { category, title, type: 'add' });
		},
		// 查看详情
		viewDetail(id, type) {
			const viewType = { preview: '查看', edit: '编辑' }[type];
			this.$go('/product_detail', {
				id,
				type,
				title: `${viewType}商品详情`,
			});
		},
		// 撤回产品
		revertProduct(id) {
			if (!id) return this.$message.warning('产品Id 不存在或无效, 无法执行删除操作');

			this.$confirm('确定撤回该产品吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.revertGoods(id);
				})
				.catch(() => {
					this.$message.waring('已取消撤回操作');
				});
		},
		// 删除产品
		deleteProduct(id) {
			if (!id) return this.$message.waring('产品Id 不存在或无效, 无法执行删除操作');

			this.$confirm('确定删除该产品吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.batchDeleteGoods([id]);
				})
				.catch(() => {
					this.$message.warning('已取消删除操作');
				});
		},
		// 提审产品
		commitProduct(id) {
			if (!id) return this.$message.warning('产品Id 不存在或无效, 无法执行提审操作');
			this.commitGoods(id);
		},
		// 查看产品历史日志
		viewHistory(productId) {
			if (!productId) return this.$message.warning('产品Id 不存在或无效, 无法执行操作');
			this.$go('/product_history', { productId });
		},
		// 设置商品下架
		setProductOffsale(id) {
			if (!id) return this.$message.warning('产品Id 不存在或无效, 无法执行下架操作');
			this.$confirm('确定下架该产品吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.setGoodsOffsale(id);
				})
				.catch(() => {
					this.$message.warning('已取消下架操作');
				});
		},
		// 设置商品上架
		setProductOnsale(id) {
			if (!id) return this.$message.warning('产品Id 不存在或无效, 无法执行上架操作');
			this.$confirm('确定上架该产品吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.setGoodsOnsale(id);
				})
				.catch(() => {
					this.$message.warning('已取消上架操作');
				});
		},
		// 查询商品版本列表
		async loadData() {
			const { activeStatusTab, searchFields, versionStatus } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabPanes[activeStatusTab];

			const data = {
				versionStatus,
				pageNum,
				pageSize,
				...searchFields,
			};
			this.tabPanes[activeStatusTab].loading = true;

			const res = await this.$fetch({
				method: 'POST',
				url: 'mgmt/product/item/listVersion',
				data,
			});

			this.tabPanes[activeStatusTab].loading = false;

			if (res && res.data) {
				const { list, total } = res.data;
				if (list && list.length) {
					this.tabPanes[activeStatusTab].data = list;
					this.tabPanes[activeStatusTab].total = total;
				} else {
					this.tabPanes[activeStatusTab].data = [];
					this.tabPanes[activeStatusTab].total = 0;
				}
			} else {
				this.$message.warning('查询商品版本列表数据失败');
			}
		},
		// 删除商品版本 [支持批量]
		async batchDeleteGoods(data) {
			if (!data || !data.length) return;
			const ids = data.join(',');
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/product/item/batchDel?ids=${ids}`,
			});

			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.$nextTick(this.resetLoad);
			} else {
				this.$message({
					type: 'error',
					message: '删除失败',
				});
			}
		},
		// 撤回商品版本
		async revertGoods(verId) {
			if (!verId) return;

			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/product/item/revertVersion?verId=${verId}`,
			});

			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.$nextTick(this.resetLoad);
			} else {
				this.$message({
					type: 'error',
					message: '撤回失败',
				});
			}
		},
		// 提审商品版本
		async commitGoods(verId) {
			if (!verId) return;

			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/product/item/commitVersion?verId=${verId}`,
			});

			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message || '产品提审成功',
					onClose: () => {
						this.$dispatch('UPDATE_PRODUCT_VALIDATE_LIST');
					},
				});
				this.$nextTick(this.resetLoad);
			} else {
				const message = res.message ? res.message : '提交失败';
				this.$message({
					type: 'error',
					message,
				});
			}
		},
		// 下架商品版本
		async setGoodsOffsale(productId) {
			if (!productId) return;

			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/product/item/offSaleVersion?productId=${productId}`,
			});

			if (res && res.code === 200) {
				this.$message.success(res.message || '下架商品成功');
				this.$nextTick(this.resetLoad);
			} else {
				this.$message.error('下架商品失败');
			}
		},
		// 上架商品版本
		async setGoodsOnsale(productId) {
			if (!productId) return;

			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/product/item/onSaleVersion?productId=${productId}`,
			});

			if (res && res.code === 200) {
				this.$message.success(res.message || '上架商品成功');
				this.$nextTick(this.resetLoad);
			} else {
				this.$message.error('上架商品失败');
			}
		},
		// 获取销售主体
		async getCompany() {
			const res = await this.$fetch(`/mgmt/product/cfg/menu/company`);
			if (res?.code == 200) {
				this.PRODUCT_MANAGEMENT_CONFIG.form[3].options = this.resultOptions(res.data.childList);
			}
		},
		// 获取产品类型
		async getCatalog() {
			const res = await this.$fetch(`/mgmt/product/cfg/menu/catalog`);
			if (res?.code == 200) {
				this.PRODUCT_MANAGEMENT_CONFIG.form[2].options = this.resultOptions(res.data.childList);
			}
		},
		// 处理返回正确的options
		resultOptions(arr) {
			// cfgStatus 启用 or 禁用
			return arr.filter(x => Boolean(x.cfgStatus)).map(({ title: label, id: value }) => ({ label, value }));
		},
	},
	async created() {
		await this.getCompany();
		await this.getCatalog();
	},
	mounted() {
		this.$listen('UPDATE_GOODS_LIST', this.resetLoad);
		this.$listen('UPDATE_COMPANY_OPTIONS', this.$refs.searchPanel.initFormData);
		this.$listen('UPDATE_CATALOG_OPTIONS', this.$refs.searchPanel.initFormData);
	},
};
</script>
<style lang="scss" scoped>
.process {
	width: 80%;
	margin: 0 auto;
	li {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px;
		.btn {
			width: 120px;
		}
	}
}
</style>
