<template>
	<div>
		<guideBar />
		<el-card>
			<el-form :model="form" :rules="rules" ref="layerForm" label-width="130px" class="theme-form" :disabled="preview">
				<el-form-item label="楼层页菜单:" prop="name">
					<el-input size="mini" v-model="form.name" class="theme-input" />
				</el-form-item>
				<el-form-item label="上传Web广告图:" prop="pcImg">
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						:limit="1"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemove"
						:on-success="handleSuccess"
						:file-list="webList"
						:before-upload="beforeVideoUpload"
						:class="webList.length === 1 ? 'hide_box' : ''"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible" v-drag>
						<img width="100%" :src="dialogImageUrl" alt="" />
					</el-dialog>
					<span class="tipTitle">建议图片大小为: 1440px * 700px, 支持 jpg/png/gif 等格式</span>
				</el-form-item>
				<el-form-item label="上传App广告图:" prop="appImg">
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						:limit="1"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemoveApp"
						:on-success="handleSuccessApp"
						:file-list="appList"
						:before-upload="beforeVideoUpload"
						:class="appList.length === 1 ? 'hide_box' : ''"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<span class="tipTitle">建议图片大小为: 1440px * 700px, 支持 jpg/png/gif 等格式</span>
				</el-form-item>
				<el-form-item label="上传小程序广告图:" prop="mpImg">
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						:limit="1"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemoveMp"
						:on-success="handleSuccessMp"
						:file-list="mpList"
						:before-upload="beforeVideoUpload"
						:class="mpList.length === 1 ? 'hide_box' : ''"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<span class="tipTitle">建议图片大小为: 1440px * 700px, 支持 jpg/png/gif 等格式</span>
				</el-form-item>
				<el-form-item label="描述:" prop="descript">
					<el-input
						type="textarea"
						size="mini"
						:autosize="{ minRows: 4 }"
						v-model="form.descript"
						class="theme-input"
					/>
				</el-form-item>
				<el-form-item label="广告图文关联地址:" prop="relateType">
					<el-select
						v-model="form.relateType"
						clearable
						size="small"
						class="banner-formitem"
						placeholder="请选择关联地址类型"
					>
						<el-option label="无设置" value="0">无设置</el-option>
						<el-option label="商城内部链接或外部链接" value="3">商城内部链接或外部链接</el-option>
					</el-select>
					<template>
						<!-- 关联内部或外部链接 -->
						<el-input
							v-if="form.relateType == 3"
							size="mini"
							v-model="form.linkUrl"
							placeholder="请输入某产品详情页链接地址或者外部链接地址"
							class="banner-input-address"
						/>
					</template>
				</el-form-item>
				<el-form-item label="关联产品:" prop="relatedProducts">
					<el-row>
						<el-button type="primary" class="btn-gap" icon="el-icon-share" @click="bindProductClick">
							选择产品
						</el-button>
					</el-row>
					<el-row type="flex" justify="end">
						<el-button :type="sortAble ? 'info' : 'primary'" icon="el-icon-sort" @click="setSort">
							{{ sortAble ? '设置排序' : '完成排序' }}
						</el-button>
					</el-row>
					<el-table :data="relativeProductList">
						<el-table-column type="index" label="序号" />
						<el-table-column prop="serialNo" label="产品编码" />
						<el-table-column prop="title" label="产品名称" />
						<el-table-column prop="catalogTitle" label="产品分类" />
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button size="small" type="text" @click="cancelProduct(scope.$index)">取消添加</el-button>
								<el-button
									size="mini"
									icon="el-icon-top"
									@click="handleUpper(scope.$index)"
									:disabled="scope.$index == 0 || sortAble"
								>
									上移
								</el-button>
								<el-button
									size="mini"
									icon="el-icon-bottom"
									@click="handleDownner(scope.$index)"
									:disabled="scope.$index == relativeProductList.length - 1 || sortAble"
								>
									下移
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
				<el-row type="flex" justify="center" align="center" v-if="!preview">
					<el-button type="primary" icon="el-icon-check" @click="saveAndExit">保存</el-button>
					<el-button @click="cancelEdit">取消</el-button>
				</el-row>
			</el-form>
		</el-card>
		<!-- 关联产品对话框 -->
		<el-dialog title="关联产品" :visible.sync="bindProduct" :before-close="closeProduct" width="65%">
			<search-panel v-model="productConfig" :config="bindProductConfig" @search="handleSearchProduct" class="mb-16" />
			<table-list
				ref="associateProduct"
				border
				:dataSource="bindProductList"
				:columns="bindProductColumns"
				:operates="bindProductOperate"
				:options="bindProductOptions"
				:pagination="bindProductPagination"
				:dataTotal="bindProductPagination.total"
				@handleSelectChange="handleSelectChange"
				@handleSelectAllChange="handleSelectAllChange"
				@handleChangePage="handleProductChangePage"
				@handleSizeChange="handleProductSizeChange"
			/>
			<span slot="footer" class="operate-bottom">
				<span>
					<el-button @click.stop="bindProduct = false">取 消</el-button>
					<el-button type="primary" @click.stop="addSelectProduct">添加</el-button>
				</span>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import searchPanel from 'component/common/searchPanel';
import tableList from 'component/common/tableList';
import { BIND_PRODUCT_CONFIG, BIND_PRODUCT_COLUMNS } from './config';
import { uploadFileType } from 'util/formValidation';
export default {
	name: 'updateLayerPage',
	data() {
		const vaildeProduct = (rule, value, callback) => {
			if (this.relativeProductList.length == 0) {
				callback(new Error('请选择关联的产品'));
			} else {
				callback();
			}
		};
		return {
			productConfig: {
				keyword: '',
				catalogId: '',
			},
			form: {
				name: '',
				descript: '',
				pcImg: '',
				appImg: '',
				mpImg: '',
				linkUrl: '',
				relateType: '',
				relatedProducts: null,
			},
			relativeProductList: [],
			rules: {
				name: [
					{ required: true, message: '请输入楼层页菜单', trigger: 'blur' },
					{ min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
				],
				relatedProducts: [{ required: true, validator: vaildeProduct, trigger: 'change' }],
			},
			bindProduct: false,
			bindProductList: [],
			bindProductPagination: {
				total: 0,
				currentPage: 1,
				pageSize: 10,
			},
			bindProductOptions: {
				label: '全部',
				index: true,
				selection: true,
				labelIndex: '序号',
				saveSelection: true,
				rowKey: 'productId',
			},
			bindProductOperate: [],
			dialogVisible: false,
			dialogImageUrl: '',
			appList: [],
			webList: [],
			mpList: [],
			sortAble: true,
			serialNoList: [],
		};
	},
	computed: {
		bindProductConfig: () => BIND_PRODUCT_CONFIG,
		bindProductColumns: () => BIND_PRODUCT_COLUMNS,
		// 是否是只读/预览状态
		preview() {
			const { preview = false } = this.$route.query;
			return preview;
		},
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.cms,
			};
			return params;
		},
	},
	created() {
		this.getLayerData();
		this.getCataLog();
		this.getBindProductList();
	},
	methods: {
		beforeVideoUpload(file) {
			const whiteList = ['jpg', 'png', 'gif'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		// 根据id获取楼层页消息
		async getLayerData() {
			if (this.$route.query.id) {
				const res = await this.$fetch({
					method: 'GET',
					url: '/mgmt/cms/floor/getFloorPageById/' + this.$route.query.id,
				});
				if (res && res.data) {
					this.form = res.data;
					this.form.relateType = String(this.form.relateType);
					if (res.data.pcImg && res.data.pcImg != '') this.webList.push({ url: res.data.pcImg });
					if (res.data.appImg && res.data.appImg != '') this.appList.push({ url: res.data.appImg });
					if (res.data.mpImg && res.data.mpImg != '') this.mpList.push({ url: res.data.mpImg });
				}
			}
		},
		// 获取产品分类
		async getCataLog() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/getCatalogList',
			});
			if (res) {
				BIND_PRODUCT_CONFIG.form[1].options = res.data.map(item => {
					return { label: item.title, value: item.id };
				});
			}
		},
		// 删除成功的回调
		handleRemoveMp(file, fileList) {
			this.form.mpImg = '';
			this.mpList = fileList;
		},
		// 删除成功的回调
		handleRemove(file, fileList) {
			this.form.pcImg = '';
			this.webList = fileList;
		},
		// 删除成功的回调
		handleRemoveApp(file, fileList) {
			this.form.appImg = '';
			this.appList = fileList;
		},
		// 上传成功
		handleSuccess(response, file, fileList) {
			this.form.pcImg = response.datas.fileUrlKey;
			this.webList = fileList;
		},
		handleSuccessApp(response, file, fileList) {
			this.form.appImg = response.datas.fileUrlKey;
			this.appList = fileList;
		},
		// 上传成功
		handleSuccessMp(response, file, fileList) {
			this.form.mpImg = response.datas.fileUrlKey;
			this.mpList = fileList;
		},
		// 图片预览
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		// 关联产品按钮
		bindProductClick() {
			this.bindProduct = true;
			this.getAllProductList();
		},
		// 产品弹窗选择事情
		productSelect(val) {
			this.form.relatedProducts = val;
		},
		closeProduct() {
			this.bindProduct = false;
			if (this.relativeProductList.length === 0) {
				this.$refs.associateProduct.$children[0].clearSelection();
				this.getAllProductList();
			}
		},
		handleSelectChange(val, row) {
			if (this.form.relatedProducts.length === 0) return this.form.relatedProducts.push(row);
			let index = this.form.relatedProducts.map(e => e.productId).indexOf(row.productId);
			console.log(this.form.relatedProducts);
			if (index > -1) {
				this.form.relatedProducts.splice(index, 1);
			} else {
				this.form.relatedProducts.push(row);
			}
		},
		handleSelectAllChange(val) {
			if (val.length === 0) {
				let bindProductList = this.bindProductList.map(e => e.productId);
				bindProductList.forEach(e => {
					this.form.relatedProducts.forEach(() => {
						let index = this.form.relatedProducts.map(els => els.productId).indexOf(e);
						if (index > -1) {
							this.form.relatedProducts.splice(index, 1);
						}
					});
				});
			} else {
				this.form.relatedProducts = JSON.parse(JSON.stringify(this.form.relatedProducts.concat(this.bindProductList)));
			}
		},
		// 关联的产品列表
		async getBindProductList() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/getLinkProductList',
				params: {
					decorateId: this.$route.query.id,
					decorateType: '2',
					pageNum: 1,
					pageSize: 9999999,
				},
			});
			if (res.data.list) {
				this.relativeProductList = res.data.list;
				this.form.relatedProducts = JSON.parse(JSON.stringify(res.data.list));
				console.log(this.form.relatedProducts);
			} else {
				this.relativeProductList = [];
			}
		},
		getProductList() {},
		// 获取所有产品列表
		async getAllProductList() {
			let { currentPage: pageNum, pageSize } = this.bindProductPagination;
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/getProductList',
				params: { pageNum, pageSize, ...this.productConfig },
			});
			if (res && res.code == 200) {
				this.bindProductPagination.total = res.data.total;
				this.bindProductList = res.data.list;
				this.bindProductList.forEach(e => {
					this.relativeProductList.forEach(el => {
						if (e.productId === el.productId) {
							this.$nextTick(() => {
								this.$refs.associateProduct.$children[0].toggleRowSelection(e, true);
							});
						}
					});
				});
			}
		},
		// 保存选择的产品事件
		addSelectProduct() {
			if (this.form.relatedProducts.length == 0) return this.$message.error('请选择要关联的产品');
			this.relativeProductList = this.form.relatedProducts;
			this.$message.success('保存成功');
			this.bindProduct = false;
		},
		// 取消关联的产品
		async cancelProduct(index) {
			this.$confirm('此操作将删除该关联产品, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.relativeProductList.splice(index, 1);
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		// 产品分页触发
		handleProductChangePage(currentPage) {
			this.bindProductPagination.currentPage = currentPage;
			this.getAllProductList();
		},
		// 产品弹窗切换单页数量事件
		handleProductSizeChange(pageSize) {
			this.bindProductPagination.pageSize = pageSize;
			this.getAllProductList();
		},
		handleSearchProduct() {
			this.bindProductPagination.currentPage = 1;
			this.getAllProductList();
		},
		// 保存内容并退出
		saveAndExit() {
			this.$refs['layerForm'].validate(async valid => {
				if (valid) {
					let product = [];
					this.relativeProductList.map((item, index) => {
						let obj = {};
						obj.serialNo = item.serialNo;
						obj.sort = this.relativeProductList.length - index;
						product.push(obj);
					});
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/cms/floor/editFloorPage/' + this.$route.query.id,
						data: {
							appImg: this.form.appImg,
							pcImg: this.form.pcImg,
							mpImg: this.form.mpImg,
							descript: this.form.descript,
							linkUrl: this.form.linkUrl,
							name: this.form.name,
							relateType: this.form.relateType,
							productList: product,
						},
					});
					if (res && res.code == 200) {
						this.$message.success(res.message);
						this.$dispatch('LOAD_LAYER_LIST');
						this.$confirm('是否预览?', '提示', {
							confirmButtonText: '预览',
							cancelButtonText: '取消',
							type: 'warning',
						})
							.then(() => {
								this.$go('layer_page_preview', { title: '预览楼层页', id: this.$route.query.id });
							})
							.catch(() => {
								this.$closeSelf();
							});
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 取消编辑
		cancelEdit() {
			this.$closeSelf();
		},
		// 设置排序
		async setSort() {
			this.sortAble = this.sortAble ? false : true;
		},
		swapArray(arr, index1, index2) {
			arr[index1] = arr.splice(index2, 1, arr[index1])[0];
			return arr;
		},
		// 上移
		handleUpper(index) {
			this.swapArray(this.relativeProductList, index, index - 1);
		},
		// 下移
		handleDownner(index) {
			this.swapArray(this.relativeProductList, index, index + 1);
		},
	},
	components: {
		searchPanel,
		tableList,
	},
};
</script>

<style lange="scss" scoped>
.theme-input {
	max-width: 350px;
}
.theme-input2 {
	max-width: 650px;
}
.el-select {
	width: 100%;
}
.banner-formitem {
	width: 350px;
}
.banner-input-address {
	max-width: 350px;
	margin-left: 20px;
}
::v-deep.el-input--mini .el-input__inner {
	height: 32px;
}
.btn-gap {
	margin-right: 10px;
}
.operate-bottom {
	display: flex;
	justify-content: flex-end;
}

.avatar-uploader .el-upload {
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.avatar-uploader .el-upload:hover {
	border-color: #409eff;
}
.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
	border: 1px dashed #ccc;
}
.avatar {
	width: 178px;
	height: 178px;
	display: block;
}
.tipTitle {
	color: #8c939b;
}
.mb-16 {
	margin-bottom: 16px;
}
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
::v-deep.el-dialog__wrapper {
	overflow: auto;
}
</style>
