<template>
	<div>
		<guideBar />
		<el-card>
			<el-form :model="bannerForm" :rules="rules" ref="bannerForm" label-width="120px" class="banner-form">
				<el-form-item label="上传图片:" prop="imageUrl">
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						:limit="1"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemove"
						:on-success="handleSuccess"
						:file-list="bannerList"
						:before-upload="beforeVideoUpload"
						:class="bannerList.length == 1 ? 'hide_box' : ''"
						:disabled="isPreview"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible" v-drag>
						<img width="100%" :src="dialogImageUrl" alt="" />
					</el-dialog>
					<el-row class="tipTitle">建议图片大小为: 1440px * 700px, 支持 jpg/png/gif 等格式</el-row>
				</el-form-item>
				<el-form-item label="位置:" prop="location">
					<el-select v-model="bannerForm.location" clearable size="small" class="banner-formitem" :disabled="isPreview">
						<el-option label="PC商城首页" value="1" :key="1"></el-option>
						<el-option label="APP商城首页" value="2" :key="2"></el-option>
						<el-option label="小程序商城首页" value="3" :key="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="banner名称:" prop="bannerName">
					<el-input size="mini" v-model="bannerForm.bannerName" class="banner-input" :disabled="isPreview" />
				</el-form-item>
				<el-form-item v-if="bannerForm.location == 2" label="APP顶栏色值:" prop="topbarColor">
					<el-input
						size="mini"
						v-model="bannerForm.topbarColor"
						placeholder="请输入8位argb色值"
						:disabled="isPreview"
						class="banner-input"
					/>
				</el-form-item>
				<el-form-item label="展示对象:" required>
					<el-radio class="banner-radio" :disabled="isPreview" v-model="displayObjects" :label="1">
						全部（含游客）
					</el-radio>
				</el-form-item>
				<el-form-item label="">
					<el-radio class="banner-radio" :disabled="isPreview" v-model="displayObjects" :label="0">按顾客身份</el-radio>
				</el-form-item>
				<el-form-item label="">
					<el-checkbox-group v-model="checkList" :disabled="displayObjects === 1">
						<el-checkbox v-for="(item, index) in displayList" :key="index" :label="item.value">
							{{ item.label }}
						</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="上下架类型:" prop="shelfConfig">
					<el-button type="primary" @click="showShelf = true" :disabled="isPreview">点我设置</el-button>
					<el-row v-if="bannerForm.shelfConfig == '1'">类型：立即上架</el-row>
					<el-row v-if="bannerForm.shelfConfig == '2'">
						类型：定时上架，上架时间：{{ dialogShelfForm.onShelfTime | formatDate }}
					</el-row>
					<el-row v-if="bannerForm.shelfConfig == '3'">
						类型：定时上下架，上架时间：{{ dialogShelfForm.onShelfTime | formatDate }}，下架时间：{{
							dialogShelfForm.offShelfTime | formatDate
						}}
					</el-row>
				</el-form-item>
				<el-form-item label="图片链接地址:">
					<el-select
						v-model="bannerForm.relateType"
						clearable
						size="small"
						class="banner-formitem"
						:disabled="isPreview"
					>
						<el-option label="关联产品" :value="1">关联产品</el-option>
						<el-option label="关联活动" :value="2">关联活动</el-option>
						<el-option label="商城内部链接" :value="3">商城内部链接</el-option>
						<el-option label="外部链接" :value="5">外部链接</el-option>
						<el-option label="跳转其他小程序" v-if="bannerForm.location == 3" :value="4">跳转其他小程序</el-option>
					</el-select>
					<template>
						<!-- 关联产品 -->
						<el-row v-if="bannerForm.relateType == 1">
							<el-form-item>
								<el-row class="mt-16">
									<el-button
										type="primary"
										class="btn-gap"
										icon="el-icon-share"
										:disabled="isPreview"
										@click="bindProductClick"
									>
										选择产品
									</el-button>
								</el-row>
								<el-row type="flex" justify="end">
									<el-button
										:type="sortAble ? 'info' : 'primary'"
										:disabled="isPreview"
										icon="el-icon-sort"
										@click="setSort"
									>
										{{ sortAble ? '设置排序' : '完成排序' }}
									</el-button>
								</el-row>
								<el-table :data="relativeProductList">
									<el-table-column type="index" label="序号" />
									<el-table-column prop="serialNo" label="产品编码" />
									<el-table-column prop="title" label="产品名称" />
									<el-table-column prop="catalogTitle" label="产品分类"></el-table-column>
									<el-table-column label="操作" width="250">
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
						</el-row>
						<!-- 关联活动 -->
						<el-row v-if="bannerForm.relateType == 2">
							<el-form-item>
								<el-row class="mt-16">
									<el-button
										type="primary"
										class="btn-gap"
										:disabled="isPreview"
										icon="el-icon-share"
										@click="bindActiveClick"
									>
										选择活动
									</el-button>
								</el-row>
								<el-table :data="relativeActiveList">
									<el-table-column type="index" label="序号" />
									<el-table-column prop="promotionCode" label="活动编号" />
									<el-table-column prop="promotionName" label="活动名称" />
									<el-table-column prop="noticeTime" label="预告时间">
										<template slot-scope="scope">
											<span>{{ scope.row.noticeTime | formatDate }}</span>
										</template>
									</el-table-column>
									<el-table-column prop="startTime" label="开始时间">
										<template slot-scope="scope">
											<span>{{ scope.row.startTime | formatDate }}</span>
										</template>
									</el-table-column>
									<el-table-column prop="endTime" label="结束时间">
										<template slot-scope="scope">
											<span>{{ scope.row.endTime | formatDate }}</span>
										</template>
									</el-table-column>
									<el-table-column label="操作" width="100">
										<template slot-scope="scope">
											<el-button @click="deleteBindActive(scope.$index)" :disabled="isPreview">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-form-item>
							<el-form :model="activeForm" ref="activeForm" label-width="120px" class="active-form">
								<el-form-item label="活动详情背景图:" prop="image">
									<el-upload
										:disabled="isPreview"
										:action="$store.getters['system/getOssUploadUrl']"
										:headers="$store.getters['system/getSignatureVerification']"
										:limit="1"
										:data="uploadData"
										list-type="picture-card"
										:on-preview="handlePictureCardPreview"
										:on-remove="handleRemoveBg"
										:on-success="handleSuccessBg"
										:file-list="activeBgList"
										:before-upload="beforeVideoUpload"
										:class="activeBgList.length == 1 ? 'hide_box' : ''"
									>
										<i class="el-icon-plus"></i>
									</el-upload>
									<el-dialog :visible.sync="dialogVisible" v-drag>
										<img width="100%" :src="dialogImageUrl" alt="" />
									</el-dialog>
									<el-checkbox v-model="activeForm.checked" :disabled="isPreview">不设置背景</el-checkbox>
									<el-row class="tipTitle">
										该图片用于Web商城背景图，建议图片大小为: 1440px * 700px, 支持 jpg/png/gif 等格式
									</el-row>
								</el-form-item>
								<el-form-item label="活动列表背景图:" prop="listImage">
									<el-upload
										:disabled="isPreview"
										:action="$store.getters['system/getOssUploadUrl']"
										:headers="$store.getters['system/getSignatureVerification']"
										:limit="1"
										:data="uploadData"
										list-type="picture-card"
										:on-preview="handlePictureCardPreview"
										:on-remove="handleRemoveList"
										:on-success="handleSuccessList"
										:file-list="listBg"
										:before-upload="beforeVideoUpload"
										:class="listBg.length == 1 ? 'hide_box' : ''"
									>
										<i class="el-icon-plus"></i>
									</el-upload>
									<el-dialog :visible.sync="dialogVisible" v-drag>
										<img width="100%" :src="dialogImageUrl" alt="" />
									</el-dialog>
									<el-row class="tipTitle">默认背景图为红色</el-row>
								</el-form-item>
								<el-form-item label="活动列表内容:" prop="listContent">
									<el-input size="mini" :disabled="isPreview" v-model="activeForm.listContent" class="banner-input" />
								</el-form-item>
							</el-form>
						</el-row>
					</template>
				</el-form-item>
				<!-- 关联内部或外部链接 -->
				<el-form-item v-if="bannerForm.relateType == 3 || bannerForm.relateType == 5" prop="linkUrl">
					<el-input
						size="mini"
						:disabled="isPreview"
						v-model="bannerForm.linkUrl"
						:placeholder="bannerForm.relateType == 3 ? '请输入某产品详情页链接地址' : '请输入外部链接地址'"
						class="wchat"
					/>
				</el-form-item>
				<el-form-item label="" prop="appId" v-if="bannerForm.location == 3 && bannerForm.relateType == 4">
					<el-input
						size="mini"
						class="wchat"
						style=""
						:disabled="isPreview"
						v-model="bannerForm.appId"
						placeholder="请输入小程序APPID"
					/>
				</el-form-item>
				<el-form-item label="" prop="path" v-if="bannerForm.location == 3 && bannerForm.relateType == 4">
					<el-input
						size="mini"
						class="wchat"
						:disabled="isPreview"
						v-model="bannerForm.path"
						placeholder="请输入落地页链接"
					/>
				</el-form-item>
				<el-row type="flex" justify="center" align="center">
					<el-button type="primary" v-if="!isPreview" icon="el-icon-check" @click="saveAndExit">保存</el-button>
					<el-button v-if="!isPreview" @click="cancelEdit">取消</el-button>
				</el-row>
			</el-form>
			<!-- 上下架弹窗 -->
			<el-dialog title="上下架类型" :visible.sync="showShelf" center width="550px" v-drag>
				<el-form
					:model="dialogShelfForm"
					:rules="dialogShelfRules"
					ref="dialogShelfForm"
					class="dialogShelfForm"
					label-width="120px"
					label-position="left"
					label-suffix=":"
				>
					<el-form-item label="类型" prop="type">
						<el-radio-group v-model="dialogShelfForm.type">
							<el-radio label="1">立即上架</el-radio>
							<el-radio label="2">定时上架</el-radio>
							<el-radio label="3">定时上下架</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item
						v-if="dialogShelfForm.type == '2' || dialogShelfForm.type == '3'"
						label="上架时间"
						prop="onShelfTime"
					>
						<el-date-picker
							size="medium"
							placeholder="请选择上架时间"
							class="banner-formitem"
							type="datetime"
							value-format="timestamp"
							:picker-options="timeDisabel"
							v-model="dialogShelfForm.onShelfTime"
						/>
					</el-form-item>
					<el-form-item v-if="dialogShelfForm.type == '3'" label="下架时间" prop="offShelfTime">
						<el-date-picker
							size="medium"
							placeholder="请选择下架时间"
							class="banner-formitem"
							type="datetime"
							value-format="timestamp"
							:picker-options="pickerOptions"
							v-model="dialogShelfForm.offShelfTime"
						/>
					</el-form-item>
					<el-row class="tipTitle ml-20" v-if="dialogShelfForm.type == '1'">（该产品将立即上架）</el-row>
					<el-row class="tipTitle ml-20" v-if="dialogShelfForm.type == '2'">（该产品将在指定时间上架）</el-row>
					<el-row class="tipTitle ml-20" v-if="dialogShelfForm.type == '3'">（该产品将在指定时间上架、下架）</el-row>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click.stop="svaeShelf" class="mr-16">保存</el-button>
					<el-button @click.stop="cancelShelf">取 消</el-button>
				</span>
			</el-dialog>
			<!-- 关联产品弹窗 -->
			<el-dialog title="关联产品" :visible.sync="showProduct" width="65%" v-drag :before-close="beforeClose">
				<search-panel
					v-model="bindProductPagination"
					:config="bindProductConfig"
					@search="handleSearchProduct"
					@reset="handleResetProduct"
					class="mb-16"
				/>
				<table-list
					ref="tablelist"
					border=""
					:dataSource="bindProductList"
					:columns="bindProductColumns"
					:options="bindProductOptions"
					:pagination="bindProductPagination"
					@handleSelectionChange="productSelect"
					:dataTotal="bindProductPagination.total"
					@handleChangePage="handleProductChangePage"
					@handleSizeChange="handleProductSizeChange"
				/>
				<span slot="footer" class="operate-bottom">
					<span>
						<el-button @click.stop="beforeClose">取 消</el-button>
						<el-button type="primary" @click.stop="saveProduct">保存</el-button>
					</span>
				</span>
			</el-dialog>
			<!-- 关联活动弹窗 -->
			<el-dialog title="关联活动" :visible.sync="showActive" width="65%" v-drag>
				<search-panel
					:config="bindActiveConfig"
					@search="handleSearchActive"
					@reset="handleResetActive"
					class="mb-16"
				/>
				<table-list
					border=""
					:dataSource="bindActiveList"
					:columns="bindActiveColumns"
					:options="bindActiveOptions"
					:pagination="bindActivePagination"
					:dataTotal="bindActivePagination.total"
					@handleSelectionChange="activeSelect"
					@handleChangePage="handleChangePage"
					@handleSizeChange="handleSizeChange"
				/>
				<span slot="footer" style="display: flex; justify-content: center">
					<span>
						<el-button @click.stop="showActive = false">取 消</el-button>
						<el-button type="primary" @click.stop="saveActive">保存</el-button>
					</span>
				</span>
			</el-dialog>
		</el-card>
	</div>
</template>
<script>
import {
	BIND_PRODUCT_CONFIG,
	BIND_PRODUCT_COLUMNS,
	BIND_ACTIVE_CONFIG,
	BIND_ACTIVE_COLUMNS,
	SHELF_RULES,
	DISPLAY_OBJECT,
} from './config.js';
import { uploadFileType } from 'util/formValidation';
import { optionGenerator } from 'util';
export default {
	name: 'updateBannerPage',
	data() {
		const imgValid = (rule, value, callback) => {
			if (this.bannerForm.imageUrl == '') {
				callback(new Error('请上传图片'));
			} else {
				callback();
			}
		};
		return {
			displayList: optionGenerator(DISPLAY_OBJECT),
			displayObjects: 1,
			checkList: [],
			isPreview: false,
			bannerForm: {
				imageUrl: '',
				location: '',
				bannerName: '',
				topbarColor: '',
				displayObjects: '',
				shelfConfig: '',
				relateType: '',
				linkUrl: '',
			},
			dialogShelfForm: {
				type: '',
				onShelfTime: '',
				offShelfTime: '',
			},
			banner: {
				imageUrl: '',
			},
			dialogImageUrl: '',
			dialogVisible: false,
			showShelf: false,
			rules: {
				imageUrl: [{ required: true, validator: imgValid, trigger: 'change' }],
				location: [{ required: true, message: '请选择banner图位置', trigger: 'change' }],
				displayObjects: [{ required: true, message: '请选择展示对象', trigger: 'change' }],
				shelfConfig: [{ required: true, message: '请选择上下架类型', trigger: 'change' }],
				appId: [{ required: true, message: '请输入小程序APPID', trigger: 'blur' }],
				path: [{ required: true, message: '请输入落地页链接', trigger: 'blur' }],
			},
			dialogShelfRules: SHELF_RULES,
			relativeProductList: [],
			showProduct: false,
			bindProductList: [],
			bindSelectProductList: [],
			bindProductPagination: {
				catalogId: null,
				keyword: null,
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
			showActive: false,
			relativeActiveList: [],
			bindActiveList: [],
			activeSelectList: [],
			bindActivePagination: {},
			bindActiveOptions: {
				label: '全部',
				index: true,
				selection: true,
				labelIndex: '序号',
			},
			activeForm: {
				checked: false,
				activityName: '',
				listContent: '',
				image: '',
				listImage: '',
			},
			sortAble: true,
			bannerList: [],
			activeBgList: [],
			listBg: [],
			timeDisabel: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 3600 * 1000 * 24;
				},
			},
		};
	},
	computed: {
		pickerOptions: function () {
			return {
				disabledDate: time => {
					if (this.dialogShelfForm.onShelfTime) {
						return time.getTime() < new Date(this.dialogShelfForm.onShelfTime).getTime() + 24 * 3600 * 1000;
					}
				},
			};
		},
		bindProductConfig: () => BIND_PRODUCT_CONFIG,
		bindProductColumns: () => BIND_PRODUCT_COLUMNS,
		bindActiveConfig: () => BIND_ACTIVE_CONFIG,
		bindActiveColumns: () => BIND_ACTIVE_COLUMNS,
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.cms,
			};
			return params;
		},
	},
	created() {
		if (this.$route.query.title == '预览轮播图') {
			this.$route.meta.title = '预览轮播图';
			this.isPreview = true;
		}
		if (this.$route.query.id) {
			this.getBannerDetail();
			this.getCataLog();
			this.getBindProductList();
			this.getBindActiveList();
		}
	},
	watch: {
		displayObjects(val) {
			let { displayObjects } = this.bannerForm;
			let splitmap = displayObjects == '0' || !displayObjects ? [] : displayObjects.split(',').map(e => Number(e));
			this.checkList = val === 1 ? [] : splitmap;
		},
		'bannerForm.shelfConfig'() {
			this.$refs.bannerForm.clearValidate('shelfConfig');
		},
		'bannerForm.location'(val, old) {
			if (old == 3 && val != 3 && this.bannerForm.relateType == 4) this.bannerForm.relateType = '';
		},
		'banner.imageUrl'(val) {
			if (val) this.$refs.bannerForm.clearValidate('imageUrl');
		},
	},
	methods: {
		beforeVideoUpload(file) {
			const whiteList = ['jpg', 'png', 'gif'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		// 根据id获取banner
		async getBannerDetail() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/banner/getBannerById/' + this.$route.query.id,
			});
			if (res) {
				let { location, relateType, imageUrl, displayObjects } = res.data;
				this.bannerForm = res.data;
				this.banner.imageUrl = imageUrl;
				this.bannerForm.location = location.toString();
				this.bannerForm.relateType = relateType;
				this.dialogShelfForm.type = this.bannerForm.shelfConfig.toString();
				this.dialogShelfForm.offShelfTime = this.bannerForm.shelfOffTime;
				this.dialogShelfForm.onShelfTime = this.bannerForm.shelfUpTime;
				this.bannerList.push({ url: imageUrl });
				this.displayObjects = displayObjects !== '0' ? 0 : 1;
				this.checkList = displayObjects == '0' ? displayObjects.split(',').map(e => Number(e)) : [];
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
		// 删除banner回调
		handleRemove(file, fileList) {
			this.banner.imageUrl = '';
			this.bannerList = fileList;
		},
		// 活动详情背景删除
		handleRemoveBg(file, fileList) {
			this.activeForm.image = '';
			this.activeBgList = fileList;
		},
		// 活动列表背景删除
		handleRemoveList(file, fileList) {
			this.activeForm.listImage = '';
			this.listBg = fileList;
		},
		// 上传成功
		handleSuccess(response, file, fileList) {
			this.banner.imageUrl = response.datas.fileUrlKey;
			this.bannerList = fileList;
		},
		// 活动详情背景图上传成功
		handleSuccessBg(response, file, fileList) {
			this.activeForm.image = response.datas.fileUrlKey;
			this.activeBgList = fileList;
		},
		// 活动列表背景图上传成功
		handleSuccessList(response, file, fileList) {
			this.activeForm.listImage = response.datas.fileUrlKey;
			this.listBg = fileList;
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		// 关联产品按钮
		bindProductClick() {
			this.showProduct = true;
			this.getAllProductList();
		},
		// 获取所有产品列表
		async getAllProductList() {
			let { currentPage: pageNum, pageSize, keyword, catalogId } = this.bindProductPagination;
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/getProductList',
				params: { pageNum, pageSize, keyword, catalogId },
			});
			if (res) {
				this.bindProductPagination.total = res.data.total;
				this.bindProductList = res.data.list;
				this.bindProductList.map(e => {
					this.relativeProductList.map(el => {
						if (e.productId === el.productId) {
							this.$nextTick(() => {
								this.$refs.tablelist.$children[0].toggleRowSelection(e, true);
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
					decorateType: '6',
					pageNum: '',
					pageSize: '',
				},
			});
			if (res.data.list) {
				this.relativeProductList = res.data.list;
			} else {
				this.relativeProductList = [];
			}
		},
		// 产品选择事件
		productSelect(val) {
			this.bindSelectProductList = val;
		},
		// 产品搜索
		handleSearchProduct() {
			this.bindProductPagination.currentPage = 1;
			this.getAllProductList();
		},
		// 产品搜索重置
		handleResetProduct() {
			this.bindProductPagination = {};
			this.getAllProductList();
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
		// 删除关联的产品
		cancelProduct(index) {
			this.$confirm('此操作将删除该关联产品, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				this.relativeProductList.splice(index, 1);
			});
		},
		beforeClose() {
			this.showProduct = false;
			if (this.relativeProductList.length === 0) {
				this.$refs.tablelist.$children[0].clearSelection();
				this.handleSearchProduct();
			}
		},
		// 保存选择的产品
		saveProduct() {
			if (this.bindSelectProductList.length == 0) return this.$message.error('请选择要关联的产品');
			this.relativeProductList = this.bindSelectProductList;
			this.showProduct = false;
		},
		// 关联活动弹窗
		bindActiveClick() {
			if (this.relativeActiveList.length > 0) {
				this.$message.error('只能选择一个活动');
				return;
			}
			this.showActive = true;
			this.getAllActiveList();
		},
		// 获取所有活动列表
		async getAllActiveList(data) {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/getActivityList',
				params: {
					pageNum: this.bindActivePagination.currentPage,
					pageSize: this.bindActivePagination.pageSize,
					promotionCode: data ? data.no : '',
					promotionName: data ? data.name : '',
				},
			});
			if (res && res.code == 200) {
				this.bindActiveList = res.data.list;
				this.bindActivePagination.total = res.data.total;
			}
		},
		// 活动弹窗多选
		activeSelect(val) {
			this.activeSelectList = val;
		},
		// 关联的活动列表，对应一个活动
		async getBindActiveList() {
			const resp = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/getLinkActivityList',
				params: {
					decorateId: this.$route.query.id,
					decorateType: '6',
					pageNum: '1',
					pageSize: '10',
				},
			});
			if (resp.data.list && resp.data.list.length > 0) {
				this.relativeActiveList = resp.data.list;
				if (this.relativeActiveList[0].detailImg && this.relativeActiveList[0].detailImg != '') {
					this.activeBgList = [{ url: this.relativeActiveList[0].detailImg }];
				}
				if (this.relativeActiveList[0].listImg && this.relativeActiveList[0].listImg != '') {
					this.listBg = [{ url: this.relativeActiveList[0].listImg }];
				}
				this.activeForm = {
					listContent: resp.data.list[0].content,
					checked: resp.data.list[0].isSetBg == '1' ? false : true,
					activityName: resp.data.list[0].activityName,
					image: resp.data.list[0].detailImg,
					listImage: resp.data.list[0].listImg,
				};
			} else {
				this.relativeActiveList = [];
			}
		},
		// 活动搜索
		handleSearchActive(data) {
			this.getAllActiveList(data);
		},
		// 活动重置
		handleResetActive(data) {
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
		// 保存选择的活动
		saveActive() {
			if (this.activeSelectList.length == 0) {
				this.$message.error('请选择要关联的活动');
				return;
			}
			if (this.activeSelectList.length > 1) {
				this.$message.error('只能关联一个活动');
				return;
			}
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
				this.showActive = false;
				this.relativeActiveList = this.relativeActiveList.concat(this.activeSelectList);
			}
		},
		// 删除已经关联的活动
		deleteBindActive(index) {
			this.$confirm('此操作将删除该关联活动, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				this.relativeActiveList.splice(index, 1);
			});
		},
		// 保存上下架弹窗
		svaeShelf() {
			this.$refs['dialogShelfForm'].validate(valid => {
				if (valid) {
					this.bannerForm.shelfConfig = this.dialogShelfForm.type;
					this.bannerForm.shelfOffTime = this.dialogShelfForm.offShelfTime;
					this.bannerForm.shelfUpTime = this.dialogShelfForm.onShelfTime;
					this.showShelf = false;
				} else {
					return false;
				}
			});
		},
		// 关闭上下架类型弹窗
		cancelShelf() {
			this.$refs['dialogShelfForm'].resetFields();
			this.showShelf = false;
		},
		// 保存编辑banner
		saveAndExit() {
			let { displayObjects, checkList } = this;
			let { id } = this.$route.query;
			if (displayObjects == 0 && checkList.length === 0) return this.$message.warning('顾客身份至少一个！请勾选');
			this.bannerForm.displayObjects = this.displayObjects === 1 ? '0' : this.checkList.join(',');
			this.bannerForm.imageUrl = this.banner.imageUrl;
			this.$refs['bannerForm'].validate(async valid => {
				if (valid) {
					let product = this.relativeProductList.map(({ serialNo }, index) => ({
						serialNo,
						sort: this.relativeProductList.length - index,
					}));
					let active = {
						content: this.activeForm.listContent,
						detailImg: this.activeForm.image,
						isSetBg: this.activeForm.checked == true ? 0 : 1,
						listImg: this.activeForm.listImage,
						activityName: this.activeForm.activityName,
						promotionId: this.relativeActiveList[0] ? this.relativeActiveList[0].promotionId : '',
						promotionName: this.relativeActiveList[0] ? this.relativeActiveList[0].promotionName : '',
					};
					this.bannerForm.productList = product;
					this.bannerForm.decorationPromotionReqVo = active;
					console.log(this.bannerForm);
					const res = await this.$fetch({
						method: `POST`,
						url: `/mgmt/cms/banner/${id ? 'editBanner' : 'saveBanner'}${id ? '/' + id : ''}`,
						data: this.bannerForm,
					});
					if (res && res.code == 200) {
						this.$dispatch('BANNER_MANAGEMENT_LISTREFRESH');
						this.$message.success(res.message);
						this.$confirm('是否预览?', '提示', {
							confirmButtonText: '预览',
							cancelButtonText: '取消',
							type: 'warning',
						})
							.then(() => {
								this.$dispatch('BANNER_MANAGEMENT_LISTREFRESH');
								this.$go('/update_banner_page', { title: '预览轮播图', id: id ? id : res.data.id });
							})
							.catch(() => {
								this.$dispatch('BANNER_MANAGEMENT_LISTREFRESH');
								this.$closeSelf();
							});
					}
				} else {
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
<style lang="scss" scoped>
.banner-input {
	max-width: 350px;
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
.wchat {
	max-width: 350px;
}
.tipTitle {
	color: #8c939b;
}
.ml-20 {
	margin-left: 20px;
}
.dialogShelfForm {
	min-height: 200px;
}
.mt-16 {
	margin-top: 16px;
}
.mb-16 {
	margin-bottom: 16px;
}
.active-form {
	margin-top: 20px;
}
::v-deep.el-input--mini .el-input__inner {
	height: 32px;
}
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
::v-deep.el-dialog__wrapper .el-dialog__body .table_list_fix {
	max-height: 300px;
	overflow: auto;
}
</style>
