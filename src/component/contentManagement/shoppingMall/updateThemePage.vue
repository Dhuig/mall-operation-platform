<template>
	<div>
		<guideBar />
		<el-card>
			<el-form :model="form" :rules="rules" ref="addThemeForm" label-width="120px" class="theme-form">
				<el-form-item label="专题页菜单:" prop="menu">
					<el-input size="mini" v-model="form.menu" class="theme-input" :disabled="preview" />
				</el-form-item>
				<el-form-item label="描述:" prop="description">
					<el-input
						type="textarea"
						size="mini"
						:autosize="{ minRows: 4 }"
						v-model="form.description"
						class="theme-input"
						:disabled="preview"
					/>
				</el-form-item>
				<el-form-item label="关联物料:" prop="relative">
					<el-radio-group v-model="form.relative" :disabled="preview">
						<el-radio :label="1">关联产品</el-radio>
						<el-radio :label="2">关联活动</el-radio>
					</el-radio-group>
				</el-form-item>
				<template>
					<div v-show="form.relative == 1">
						<el-form-item>
							<el-row>
								<el-button
									type="primary"
									class="btn-gap"
									icon="el-icon-share"
									@click="bindProductClick"
									:disabled="preview"
								>
									关联产品
								</el-button>
							</el-row>
							<el-row type="flex" justify="end">
								<el-button
									:type="sortAble ? 'info' : 'primary'"
									icon="el-icon-sort"
									@click="setSort"
									:disabled="preview"
								>
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
										<el-button size="small" type="text" @click="cancelProduct(scope.$index)" :disabled="preview">
											取消添加
										</el-button>
										<el-button
											size="mini"
											icon="el-icon-top"
											@click="handleUpper(scope.$index)"
											:readonly="preview"
											:disabled="preview || scope.$index == 0 || sortAble"
										>
											上移
										</el-button>
										<el-button
											size="mini"
											icon="el-icon-bottom"
											@click="handleDownner(scope.$index)"
											:readonly="preview"
											:disabled="scope.$index == relativeProductList.length - 1 || sortAble"
										>
											下移
										</el-button>
									</template>
								</el-table-column>
							</el-table>
						</el-form-item>
					</div>
					<div v-show="form.relative == 2">
						<el-form-item>
							<el-row>
								<el-button
									type="primary"
									class="btn-gap"
									icon="el-icon-share"
									@click="bindActiveClick"
									:disabled="preview"
								>
									关联活动
								</el-button>
							</el-row>
							<el-table :data="relativeActiveList">
								<el-table-column type="index" label="序号" />
								<el-table-column prop="promotionCode" label="活动编号" />
								<el-table-column prop="promotionName" label="活动名称" />
								<el-table-column prop="noticeTime" label="预告时间">
									<template slot-scope="scope">
										<span>{{ scope.row.noticeTime | timestampFormat }}</span>
									</template>
								</el-table-column>
								<el-table-column prop="startTime" label="开始时间">
									<template slot-scope="scope">
										<span>{{ scope.row.startTime | timestampFormat }}</span>
									</template>
								</el-table-column>
								<el-table-column prop="endTime" label="结束时间">
									<template slot-scope="scope">
										<span>{{ scope.row.endTime | timestampFormat }}</span>
									</template>
								</el-table-column>
								<el-table-column label="操作" width="100">
									<template slot-scope="scope">
										<el-button @click="deleteBindActive(scope.$index)" :disabled="preview">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
							<el-form :model="activeForm" ref="activeForm" label-width="120px" class="active-form">
								<el-form-item label="活动详情背景图:" prop="image">
									<el-upload
										:disabled="preview"
										:action="$store.getters['system/getOssUploadUrl']"
										:headers="$store.getters['system/getSignatureVerification']"
										:limit="1"
										:data="uploadData"
										list-type="picture-card"
										:on-preview="handlePictureCardPreview"
										:on-remove="handleRemove"
										:on-success="handleSuccess"
										:file-list="activeImgList"
										:before-upload="beforeVideoUpload"
										:class="activeImgList.length == 1 ? 'hide_box' : ''"
									>
										<i class="el-icon-plus"></i>
									</el-upload>
									<el-dialog :visible.sync="dialogVisible" v-drag>
										<img width="100%" :src="dialogImageUrl" alt="" />
									</el-dialog>
									<el-checkbox v-model="activeForm.checked" :disabled="preview">不设置背景</el-checkbox>
									<el-row class="tipTitle">
										该图片用于Web商城背景图，建议图片大小为: 1440px * 700px, 支持 jpg/png/gif 等格式
									</el-row>
								</el-form-item>
								<el-form-item label="活动名称:" prop="activityName">
									<el-input size="mini" v-model="activeForm.activityName" :disabled="preview" class="theme-input" />
								</el-form-item>
							</el-form>
						</el-form-item>
					</div>
				</template>
				<el-row type="flex" justify="center" align="center" v-if="!preview">
					<el-button type="primary" icon="el-icon-check" @click="saveAndExit" :disabled="preview">保存</el-button>
					<el-button @click="cancelEdit">取消</el-button>
				</el-row>
			</el-form>
		</el-card>
		<!-- 关联产品对话框 -->
		<el-dialog
			title="关联产品"
			:visible.sync="bindProduct"
			:before-close="closeProduct"
			:close-on-press-escape="false"
			width="65%"
			v-drag
		>
			<searchPanel v-model="bindProductSearch" :config="bindProductConfig" @search="searchProductList" class="mb-16" />
			<table-list
				border
				ref="associateProduct"
				:dataSource="bindProductList"
				:columns="bindProductColumns"
				:options="bindProductOptions"
				@handleSelectChange="handleSelectChange"
				@handleSelectAllChange="handleSelectAllChange"
				:pagination="bindProductPagination"
				:dataTotal="bindProductPagination.total"
				@handleChangePage="handleProductChangePage"
				@handleSizeChange="handleProductSizeChange"
			/>
			<span slot="footer" class="operate-bottom">
				<span>
					<el-button @click.stop="closeProduct">取 消</el-button>
					<el-button type="primary" @click.stop="saveBindProduct">保存</el-button>
				</span>
			</span>
		</el-dialog>
		<!-- 关联活动对话框 -->
		<el-dialog title="关联活动" :visible.sync="bindActive" width="65%" :before-close="closeActivity" v-drag>
			<searchPanel :config="bindActiveConfig" @search="handleSearchActive" class="mb-16" />
			<table-list
				border
				:dataSource="bindActiveList"
				:columns="bindActiveColumns"
				:options="bindActiveOptions"
				@handleSelectionChange="activeSelect"
				:pagination="bindActivePagination"
				:dataTotal="bindActivePagination.total"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			/>
			<span slot="footer" style="display: flex; justify-content: center">
				<span>
					<el-button @click.stop="bindActive = false">取 消</el-button>
					<el-button type="primary" @click.stop="bindSelectActive">保存</el-button>
				</span>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import searchPanel from 'component/common/searchPanel';
import { BIND_PRODUCT_CONFIG, BIND_PRODUCT_COLUMNS, BIND_ACTIVE_CONFIG, BIND_ACTIVE_COLUMNS } from './config';
import { uploadFileType } from 'util/formValidation';
export default {
	name: 'updateThemePage',
	data() {
		return {
			form: {
				menu: '',
				description: '',
				relative: '',
				linkUrl: '',
			},
			relativeProductList: [],
			relativeActiveList: [],
			rules: {
				menu: [
					{ required: true, message: '请输入专题页菜单', trigger: 'blur' },
					{ min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
				],
				relative: [{ required: true, message: '请选择关联物料', trigger: 'change' }],
			},
			sortAble: true,
			bindProduct: false,
			bindProductList: [],
			bindSelectProductList: [],
			bindProductSearch: {
				catalogId: '',
				keyword: '',
			},
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
				// saveSelection: true,
				// rowKey: 'productId',
			},
			bindActive: false,
			bindActiveList: [],
			activeSelectList: [],
			bindActivePagination: {
				total: 0,
				currentPage: 1,
				pageSize: 20,
			},
			bindActiveOptions: {
				label: '全部',
				index: true,
				selection: true,
				labelIndex: '序号',
				saveSelection: true,
				rowKey: 'productId',
			},
			activeForm: {
				image: '',
				activityName: '',
				checked: false,
			},
			activeImgList: [],
			dialogImageUrl: '',
			dialogVisible: false,
		};
	},
	created() {
		this.getEditData();
		this.getBindActiveList();
		this.getBindProductList();
		this.getCataLog();
	},
	computed: {
		bindProductConfig: () => BIND_PRODUCT_CONFIG,
		bindProductColumns: () => BIND_PRODUCT_COLUMNS,
		bindActiveConfig: () => BIND_ACTIVE_CONFIG,
		bindActiveColumns: () => BIND_ACTIVE_COLUMNS,
		// 是否是只读/预览状态
		preview() {
			const { preview } = this.$route.query;
			return !!preview;
		},
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.cms,
			};
			return params;
		},
	},
	methods: {
		beforeVideoUpload(file) {
			const whiteList = ['jpg', 'png', 'gif'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		// 获取产品分类
		async getCataLog() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/getCatalogList',
			});
			if (res && res.data) {
				BIND_PRODUCT_CONFIG.form[1].options = res.data.map(item => {
					return { label: item.title, value: item.id };
				});
			}
		},
		// 活动搜索
		handleSearchActive(data) {
			this.bindActivePagination.currentPage = 1;
			this.getAllActiveList(data);
		},
		// 活动弹窗分页触发事件
		handleChangePage(currentPage) {
			this.bindActivePagination.currentPage = currentPage;
			this.getAllActiveList();
		},
		// 活动弹窗切换单页数量事件
		handleSizeChange(pageSize) {
			this.bindActivePagination.pageSize = pageSize;
			this.getAllActiveList();
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
		searchProductList() {
			this.bindProductPagination.currentPage = 1;
			this.getAllProductList();
		},
		// 保存编辑内容并退出
		saveAndExit() {
			this.$refs['addThemeForm'].validate(async valid => {
				if (valid) {
					let { promotionId, promotionName } = this.relativeActiveList[0] || {};
					let { image: detailImg, checked, activityName } = this.activeForm;
					let { description: descript, menu: name, relative: relateType } = this.form;
					const productList = this.relativeProductList.map(({ serialNo }, index) => ({ sort: index, serialNo }));
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/cms/thematic/editThematicBar/' + this.$route.query.id,
						data: {
							descript,
							name,
							relateType,
							productList,
							decorationPromotionReqVo: {
								content: '',
								detailImg,
								isSetBg: checked == true ? 0 : 1,
								listImg: '',
								activityName,
								promotionId: promotionId || '',
								promotionName: promotionName || '',
							},
						},
					});
					if (res && res.code == 200) {
						this.$message.success(res.message);
						this.$dispatch('LOAD_THEME_LIST');
						this.$confirm('是否预览?', '提示', {
							confirmButtonText: '预览',
							cancelButtonText: '取消',
							type: 'warning',
						})
							.then(() => {
								this.$go('update_theme_page', { title: '预览专题页', id: this.$route.query.id, preview: true });
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
		// 根据id获取到专题页数据
		async getEditData() {
			if (this.$route.query.id) {
				const res = await this.$fetch({
					method: 'GET',
					url: '/mgmt/cms/thematic/getThematicById/' + this.$route.query.id,
				});
				if (res && res.data) {
					let { name: menu, descript: description, relateType: relative, linkUrl } = res.data;
					this.form = { menu, description, relative, linkUrl };
					if (this.preview) {
						this.$nextTick(() => {
							this.$refs['addThemeForm'].clearValidate('relative');
						});
					}
				}
			}
		},
		// 关联的活动列表，一个专题页只能关联一个活动，分页数据写死
		async getBindActiveList() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/getLinkActivityList',
				params: {
					decorateId: this.$route.query.id,
					decorateType: '1',
					pageNum: 1,
					pageSize: 9999999,
				},
			});
			if (res && res.data.list.length > 0) {
				this.relativeActiveList = res.data.list;
				let { detailImg: image, isSetBg, activityName } = this.relativeActiveList[0] || {};
				if (image && image != '') this.activeImgList = [{ url: image }];
				this.activeForm = { checked: isSetBg == '1' ? false : true, activityName, image };
			} else {
				this.relativeActiveList = [];
			}
		},
		// 关联活动弹窗
		bindActiveClick() {
			this.bindActive = true;
			this.getAllActiveList();
		},
		// 获取所有活动列表
		async getAllActiveList(data) {
			let { currentPage: pageNum, pageSize } = this.bindActivePagination;
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/getActivityList',
				params: {
					pageNum,
					pageSize,
					promotionCode: data ? data.no : '',
					promotionName: data ? data.name : '',
				},
			});
			if (res) {
				this.bindActiveList = res.data.list;
				this.bindActivePagination.total = res.data.total;
			}
		},
		// 活动弹窗多选
		activeSelect(val) {
			this.activeSelectList = val;
		},
		closeActivity() {},
		// 绑定活动
		async bindSelectActive() {
			if (this.activeSelectList.length == 0) return this.$message.error('请选择要关联的活动');
			if (this.activeSelectList.length > 1) return this.$message.error('一个专题页只能关联一个活动');
			let codeName = '';
			this.activeSelectList.map(item => {
				this.relativeActiveList.map(temp => {
					if (item.promotionCode == temp.promotionCode) {
						codeName = item.promotionCode;
						return;
					}
				});
			});
			if (codeName && codeName != '') {
				this.$message.error(`活动编号 ${codeName}重复选择！`);
			} else {
				this.relativeActiveList = this.activeSelectList;
				this.bindActive = false;
			}
		},
		// 删除已经关联的活动
		deleteBindActive(index) {
			this.$confirm('此操作将删除该关联活动, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.relativeActiveList.splice(index, 1);
				})
				.catch(() => {
					this.$message.info('已取消删除');
				});
		},
		// 关联产品按钮
		bindProductClick() {
			this.bindProduct = true;
			this.getAllProductList();
		},
		// 获取所有产品列表
		async getAllProductList() {
			let { currentPage: pageNum, pageSize } = this.bindProductPagination;
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/getProductList',
				params: { pageNum, pageSize, ...this.bindProductSearch },
			});
			if (res.data) {
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
		// 关联的产品列表
		async getBindProductList() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/getLinkProductList',
				params: {
					decorateId: this.$route.query.id,
					decorateType: '1',
					pageNum: 1,
					pageSize: 9999999,
				},
			});
			if (res && res.data.list) {
				this.relativeProductList = res.data.list;
				this.bindSelectProductList = JSON.parse(JSON.stringify(res.data.list));
			} else {
				this.relativeProductList = [];
			}
		},
		// 保存关联产品
		async saveBindProduct() {
			if (this.bindSelectProductList.length == 0) return this.$message.error('请选择要关联的产品');
			this.relativeProductList = this.bindSelectProductList;
			this.$message.success('保存成功');
			this.bindProduct = false;
		},
		// 删除关联的产品
		cancelProduct(index) {
			this.$confirm('此操作将删除该关联产品, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.relativeProductList.splice(index, 1);
					this.closeProduct();
				})
				.catch(() => {
					this.$message.info('已取消删除');
				});
		},
		handleSelectChange(val, row) {
			if (this.bindSelectProductList.length === 0) return this.bindSelectProductList.push(row);
			let index = this.bindSelectProductList.map(e => e.productId).indexOf(row.productId);
			if (index > -1) {
				this.bindSelectProductList.splice(index, 1);
			} else {
				this.bindSelectProductList.push(row);
			}
		},
		handleSelectAllChange(val) {
			if (val.length === 0) {
				let bindProductList = this.bindProductList.map(e => e.productId);
				bindProductList.forEach(e => {
					this.bindSelectProductList.forEach(() => {
						let index = this.bindSelectProductList.map(els => els.productId).indexOf(e);
						if (index > -1) {
							this.bindSelectProductList.splice(index, 1);
						}
					});
				});
			} else {
				this.bindSelectProductList = JSON.parse(
					JSON.stringify(this.bindSelectProductList.concat(this.bindProductList))
				);
			}
		},
		closeProduct() {
			this.bindProduct = false;
			if (this.relativeProductList.length === 0) {
				this.$refs.associateProduct.$children[0].clearSelection();
				this.getAllProductList();
			}
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
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		// 活动背景图上传成功
		handleSuccess(response, file, fileList) {
			this.activeForm.image = response.datas.fileUrlKey;
			this.activeImgList = fileList;
		},
		handleRemove(file, fileList) {
			this.activeForm.image = '';
			this.activeImgList = fileList;
		},
	},
	components: {
		searchPanel,
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
.btn-gap {
	margin-right: 10px;
}
.operate-bottom {
	display: flex;
	justify-content: flex-end;
}
.mb-16 {
	margin-bottom: 16px;
}
.active-form {
	margin-top: 16px;
}
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
::v-deep.el-dialog__wrapper .el-dialog__body .table_list_fix {
	max-height: 300px;
	overflow: auto;
}
</style>
