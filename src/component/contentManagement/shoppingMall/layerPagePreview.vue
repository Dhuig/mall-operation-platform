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
						disabled
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						:limit="1"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemove"
						:on-success="handleSuccess"
						:before-upload="beforeVideoUpload"
						:file-list="webList"
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
						disabled
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						:limit="1"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemoveApp"
						:on-success="handleSuccessApp"
						:before-upload="beforeVideoUpload"
						:file-list="appList"
						:class="appList.length === 1 ? 'hide_box' : ''"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<span class="tipTitle">建议图片大小为: 1440px * 700px, 支持 jpg/png/gif 等格式</span>
				</el-form-item>
				<el-form-item label="上传小程序广告图:" prop="mpImg">
					<el-upload
						disabled
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						:limit="1"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemoveMp"
						:before-upload="beforeVideoUpload"
						:on-success="handleSuccessMp"
						:file-list="mpList"
						:class="mpList.length === 1 ? 'hide_box' : ''"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<span class="tipTitle">建议图片大小为: 1440px * 700px, 支持 jpg/png/gif 等格式</span>
				</el-form-item>
				<el-form-item label="描述:" prop="descript">
					<el-input
						disabled
						type="textarea"
						size="mini"
						:autosize="{ minRows: 4 }"
						v-model="form.descript"
						class="theme-input"
					/>
				</el-form-item>
				<el-form-item label="广告图文关联地址:" prop="relateType">
					<el-select
						disabled
						v-model="form.relateType"
						clearable
						size="small"
						class="banner-formitem"
						placeholder="请选择关联地址类型"
					>
						<el-option label="无设置" :value="0">无设置</el-option>
						<el-option label="商城内部链接或外部链接" :value="3">商城内部链接或外部链接</el-option>
					</el-select>
					<template>
						<!-- 关联内部或外部链接 -->
						<el-input
							disabled
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
						<el-button disabled type="primary" class="btn-gap" icon="el-icon-share" @click="bindProductClick">
							选择产品
						</el-button>
					</el-row>
					<el-table :data="relativeProductList">
						<el-table-column type="index" label="序号" />
						<el-table-column prop="serialNo" label="产品编码" />
						<el-table-column prop="title" label="产品名称" />
						<el-table-column prop="catalogTitle" label="产品分类" />
					</el-table>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
import { BIND_PRODUCT_CONFIG, BIND_PRODUCT_COLUMNS } from './config';
import { uploadFileType } from 'util/formValidation';
export default {
	name: 'layerPagePreview',
	data() {
		const vaildeProduct = (rule, value, callback) => {
			if (this.relativeProductList.length == 0) {
				callback(new Error('请选择关联的产品'));
			} else {
				callback();
			}
		};
		return {
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
				pageSize: 20,
			},
			bindProductOptions: {
				label: '全部',
				index: true,
				selection: true,
				labelIndex: '序号',
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
		// 关联的产品列表
		async getBindProductList() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/getLinkProductList',
				params: {
					decorateId: this.$route.query.id,
					decorateType: '2',
					pageNum: 1,
					pageSize: 999999,
				},
			});
			if (res.data.list) {
				this.relativeProductList = res.data.list;
			} else {
				this.relativeProductList = [];
			}
		},
		// 获取所有产品列表
		async getAllProductList(data) {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/getProductList',
				params: {
					pageNum: this.bindProductPagination.currentPage,
					pageSize: this.bindProductPagination.pageSize,
					keyword: data ? data.name : '',
					catalogId: data ? data.category : '',
				},
			});
			if (res) {
				this.bindProductPagination.total = res.data.total;
				this.bindProductList = res.data.list;
			}
		},
		// 保存选择的产品事件
		addSelectProduct() {
			if (this.form.relatedProducts && this.form.relatedProducts.length == 0) {
				this.$message({
					type: 'error',
					message: '请选择要关联的产品',
				});
				return;
			}
			let codeName = '';
			this.form.relatedProducts.map(item => {
				this.relativeProductList.map(temp => {
					if (item.serialNo == temp.serialNo) {
						codeName = item.serialNo;
						return;
					}
				});
			});
			if (codeName && codeName != '') {
				this.$message({
					type: 'error',
					message: `产品编码 ${codeName}重复选择！`,
				});
			} else {
				this.relativeProductList = this.relativeProductList.concat(this.form.relatedProducts);
				this.bindProduct = false;
			}
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
		handleSearchProduct(data) {
			this.getAllProductList(data);
		},
		handleResetProduct(data) {
			this.getAllProductList(data);
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
					if (res) {
						this.$message({
							type: 'success',
							message: res.message,
						});
						this.$dispatch('LOAD_LAYER_LIST');
						this.$closeSelf();
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
::v-deep.el-dialog__wrapper .el-dialog__body .table_list_fix {
	max-height: 300px;
	overflow: auto;
}
</style>
