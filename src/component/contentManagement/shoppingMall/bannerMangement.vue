<template>
	<div class="page-wrapper">
		<guideBar>
			<el-button v-permission="'banner_management_add'" type="primary" icon="el-icon-plus" @click="createBanner">
				新增轮播图
			</el-button>
		</guideBar>
		<el-tabs v-model="terminalActiveTab">
			<el-tab-pane label="完美商城PC版" name="1"></el-tab-pane>
			<el-tab-pane label="完美商城APP版" name="2"></el-tab-pane>
			<el-tab-pane label="完美商城小程序版" name="3"></el-tab-pane>
		</el-tabs>
		<el-card>
			<el-tabs v-model="bannerActiveTab">
				<el-tab-pane label="全部" name="all"></el-tab-pane>
				<el-tab-pane label="已上架" name="1"></el-tab-pane>
				<el-tab-pane label="待上架" name="0"></el-tab-pane>
				<el-tab-pane label="已下架" name="2"></el-tab-pane>
				<el-row type="flex" justify="end">
					<el-button
						v-permission="'banner_management_set_order'"
						:type="sortAble ? 'info' : 'primary'"
						icon="el-icon-sort"
						@click="setSort"
					>
						{{ sortAble ? '设置排序' : '完成排序' }}
					</el-button>
				</el-row>
				<el-table :data="data" v-loading="loading">
					<el-table-column type="index" label="序号" width="50" align="center" />
					<el-table-column prop="imageUrl" label="banner图片" align="center">
						<template slot-scope="scope">
							<el-image class="img" :src="scope.row.imageUrl" fit="scale-down"></el-image>
						</template>
					</el-table-column>
					<el-table-column prop="shelfUpTime" label="上架时间" align="center">
						<template slot-scope="scope">
							<span>{{ scope.row.shelfUpTime | timestampFormat }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="shelfOffTime" label="下架时间" align="center">
						<template slot-scope="scope">
							<span>{{ scope.row.shelfOffTime | timestampFormat }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="shelfStatus" label="banner状态" align="center">
						<template slot-scope="scope">
							<span>{{ SHELF_STATUS[scope.row.shelfStatus] }}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" :width="450">
						<template slot-scope="scope">
							<el-button
								size="mini"
								type="danger"
								icon="el-icon-delete-solid"
								@click="handleOffShelf(scope.row)"
								v-if="scope.row.shelfStatus == 1"
								v-permission="'banner_management_offsale'"
							>
								下架
							</el-button>
							<el-button
								v-permission="'banner_management_edit'"
								size="mini"
								type="primary"
								icon="el-icon-edit-outline"
								@click="handleEdit(scope.row.id)"
							>
								编辑
							</el-button>
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
								:disabled="scope.$index == data.length - 1 || sortAble"
							>
								下移
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tabs>
		</el-card>
		<!-- 新增banner弹窗 -->
		<!-- banner_management_app_set_order -->
		<el-dialog
			title="新增banner"
			:visible.sync="showBanner"
			:before-close="closeShowBanner"
			center
			width="750px"
			v-drag
		>
			<div>
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
							:before-upload="beforeVideoUpload"
							:file-list="imgList"
							:class="imgList.length == 1 ? 'hide_box' : ''"
						>
							<i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog :visible.sync="dialogVisible" v-drag>
							<img width="100%" :src="dialogImageUrl" alt="" />
						</el-dialog>
						<el-row class="tipTitle">建议图片大小为: 1440px * 700px, 支持 jpg/png/gif 等格式</el-row>
					</el-form-item>
					<el-form-item label="位置:" prop="location">
						<el-select v-model="bannerForm.location" clearable size="small" class="banner-formitem">
							<el-option label="PC商城首页" value="1">PC商城首页</el-option>
							<el-option label="APP" value="2">APP</el-option>
							<el-option label="小程序" value="3">小程序</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="banner名称:" prop="bannerName">
						<el-input size="mini" v-model="bannerForm.bannerName" class="banner-input" />
					</el-form-item>
					<el-form-item label="APP顶栏色值:" prop="topbarColor">
						<el-input
							size="mini"
							v-model="bannerForm.topbarColor"
							placeholder="请输入8位argb色值"
							class="banner-input"
						/>
					</el-form-item>
					<el-form-item label="展示对象:" required>
						<el-radio class="banner-radio" v-model="displayObjects" :label="1">全部（含游客）</el-radio>
					</el-form-item>
					<el-form-item label="" required>
						<el-radio class="banner-radio" v-model="displayObjects" :label="0">按顾客身份</el-radio>
					</el-form-item>
					<el-form-item label="" required>
						<el-checkbox-group v-model="checkList" :disabled="displayObjects === 1">
							<el-checkbox v-for="(item, index) in displayList" :key="index" :label="item.value">
								{{ item.label }}
							</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-form>
			</div>
			<el-row type="flex" justify="center" align="center">
				<el-button type="primary" icon="el-icon-check" @click="saveAndExit">保存</el-button>
				<el-button @click="cancel">取消</el-button>
			</el-row>
		</el-dialog>
	</div>
</template>
<script>
import { SHELF_STATUS, DISPLAY_OBJECT } from './config';
import { optionGenerator } from 'util';
import { uploadFileType } from 'util/formValidation';
export default {
	name: 'bannerMangement',
	data() {
		const imgValid = (rule, value, callback) => {
			if (this.bannerForm.imageUrl == '') {
				callback(new Error('请上传图片'));
			} else {
				callback();
			}
		};
		return {
			displayObjects: 1,
			checkList: [],
			radio: '',
			displayList: optionGenerator(DISPLAY_OBJECT),
			SHELF_STATUS,
			terminalActiveTab: '1',
			bannerActiveTab: 'all',
			data: [],
			loading: false,
			sortAble: true,
			showBanner: false,
			bannerForm: {
				imageUrl: '',
				location: '',
				bannerName: '',
				topbarColor: '',
				shelfConfig: 1,
				displayObjects: 1,
				shelfUpTime: '',
				shelfOffTime: '',
			},
			rules: {
				imageUrl: [{ required: true, validator: imgValid }],
				location: [{ required: true, message: '请选择banner图位置', trigger: 'change' }],
				displayObjects: [{ required: true, message: '请选择展示对象', trigger: 'change' }],
			},
			dialogImageUrl: '',
			dialogVisible: false,
			hrefLink: '',
			imgList: [],
		};
	},
	watch: {
		// 监听banner状态tab
		bannerActiveTab() {
			this.getBannerData();
		},
		// 监听pc与app状态tab切换
		terminalActiveTab() {
			this.getBannerData();
		},
	},
	created() {
		this.getBannerData();
		this.$listen('BANNER_MANAGEMENT_LISTREFRESH', this.getBannerData);
	},
	computed: {
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
		closeShowBanner() {
			this.$refs.bannerForm.resetFields();
			this.showBanner = false;
			this.imgList = [];
		},
		// 获取banner数据
		async getBannerData() {
			this.loading = true;
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/banner/getBannerList',
				params: {
					location: this.terminalActiveTab,
					shelfStatus: this.bannerActiveTab == 'all' ? '' : this.bannerActiveTab,
				},
			});
			if (res && res.code == 200) this.data = res.data;
			this.loading = false;
		},
		// 新增banner按钮
		createBanner() {
			this.$go('/update_banner_page', { title: '新增轮播图' });
		},
		// 编辑banner
		handleEdit(id) {
			this.$go('/update_banner_page', { title: '编辑轮播图', id });
		},
		// 下架banner
		async handleOffShelf(row) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/cms/banner/shelfOff',
				data: {
					bannerId: row.id,
					shelfStatus: '2',
				},
			});
			if (res && res.code == 200) this.getBannerData();
		},
		// 上传成功回调
		handleSuccess(response, file, fileList) {
			this.bannerForm.imageUrl = response.datas.fileUrlKey;
			this.imgList = fileList;
			this.$refs['bannerForm'].validateField('imageUrl');
		},
		// 删除图片回调
		handleRemove(file, fileList) {
			this.bannerForm.imageUrl = '';
			this.imgList = fileList;
		},
		// 预览
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		async saveRquert() {
			this.bannerForm.displayObjects = this.displayObjects === 1 ? '0' : this.checkList.join(',');
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/cms/banner/saveBanner',
				data: this.bannerForm,
			});
			if (res && res.code == 200) {
				this.$message.success(res.message);
				this.$refs['bannerForm'].resetFields();
				this.imgList = [];
				this.cancel();
				this.getBannerData();
				this.$confirm('是否预览?', '提示', {
					confirmButtonText: '预览',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					this.$go('update_banner_page', { title: '预览轮播图', id: res.data.id });
				});
			}
		},
		// 新增banner保存
		saveAndExit() {
			let { displayObjects, checkList } = this;
			if (displayObjects === 0 && checkList.length === 0) return this.$message.warning('顾客身份至少一个！请勾选');
			this.$refs['bannerForm'].validate(valid => {
				if (valid) {
					this.$confirm('确定新增?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}).then(() => {
						this.saveRquert();
					});
				}
			});
		},
		// 取消弹窗
		cancel() {
			this.closeShowBanner();
		},
		saveInner() {},
		// 设置排序
		async setSort() {
			this.sortAble = this.sortAble ? false : true;
			if (this.sortAble) {
				let arr = [];
				this.data.map((item, index) => {
					let obj = {};
					obj.id = item.id;
					obj.sort = this.data.length - index;
					arr.push(obj);
				});
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/cms/banner/update/sort',
					data: arr,
				});
				if (res) {
					this.$message({
						type: 'success',
						message: res.message,
					});
					this.getBannerData();
				}
			}
		},
		swapArray(arr, index1, index2) {
			arr[index1] = arr.splice(index2, 1, arr[index1])[0];
			return arr;
		},
		// 上移
		handleUpper(index) {
			this.swapArray(this.data, index, index - 1);
		},
		// 下移
		handleDownner(index) {
			this.swapArray(this.data, index, index + 1);
		},
	},
	mounted() {
		this.getBannerData();
	},
};
</script>
<style lang="scss" scoped>
.page-wrapper {
	padding-top: 20px;
}
.img {
	width: 100%;
	height: 40px;
}
.banner-input {
	max-width: 350px;
}
.el-select {
	width: 100%;
}
.banner-formitem {
	width: 350px;
}
.banner-radio {
	width: 110px;
}
.tipTitle {
	color: #8c939b;
}
::v-deep.el-form-item {
	margin-bottom: 14px;
}
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
/** dialog 样式改写 */
.el-dialog__wrapper {
	overflow: auto;
}
</style>
