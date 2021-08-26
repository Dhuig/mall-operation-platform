<template>
	<div>
		<guideBar />
		<el-card>
			<el-row>
				<el-row class="activeTitle">关联活动</el-row>
				<el-button type="primary" v-if="preview" class="btn-gap" icon="el-icon-share" @click="chooseActive">
					选择活动
				</el-button>
				<el-row class="tipTitle">已关联活动{{ data.length }}个</el-row>
				<el-table :data="data">
					<el-table-column type="index" label="序号" />
					<el-table-column prop="promotionCode" label="编号" />
					<el-table-column prop="promotionName" label="活动名称" />
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button @click="deleteBindActive(scope.$index)" v-if="preview">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
			<el-form
				:model="activeForm"
				:rules="rules"
				ref="activeForm"
				label-width="120px"
				class="active-form"
				label-position="right"
			>
				<el-form-item label="活动详情背景图:" prop="detailImg">
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemove"
						:on-success="handleSuccess"
						:data="uploadData"
						:file-list="photoList"
						accept="jpg,png,gif"
						:before-upload="beforeVideoUpload"
						:class="photoList.length === 1 ? 'hide_box' : ''"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="" />
					</el-dialog>
					<el-checkbox v-model="activeForm.isSetBg">不设置背景</el-checkbox>
					<el-row class="tipTitle">
						该图片用于Web商城背景图，建议图片大小为: 1440px * 700px, 支持 jpg/png/gif 等格式
					</el-row>
				</el-form-item>
				<el-form-item label="活动列表背景图:" prop="listImage">
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:limit="1"
						:data="uploadData"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemoveList"
						:on-success="handleSuccessList"
						:before-upload="beforeVideoUpload"
						:file-list="listBg"
						:class="listBg.length == 1 ? 'hide_box' : ''"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="" />
					</el-dialog>
					<el-row class="tipTitle">默认背景图为红色</el-row>
				</el-form-item>
				<el-form-item label="活动列表内容:" prop="content">
					<el-input size="mini" v-model="activeForm.content" class="banner-input" />
				</el-form-item>
				<el-row type="flex" justify="center" align="center">
					<el-button type="primary" icon="el-icon-check" @click="saveAndExit">保存</el-button>
				</el-row>
			</el-form>
		</el-card>
		<!-- 关联活动弹窗 -->
		<el-dialog title="关联活动" :visible.sync="showActive" width="65%">
			<search-panel :config="BIND_ACTIVE_CONFIG" @search="handleSearchProduct" @reset="handleResetProduct" />
			<el-row class="mb-16"></el-row>
			<table-list
				border=""
				:dataSource="bindActiveList"
				:columns="BIND_ACTIVE_COLUMNS"
				:operates="bindActiveOperate"
				:options="bindActiveOptions"
				@handleSelectionChange="activeSelect"
				:pagination="bindActivePagination"
				:dataTotal="bindActivePagination.total"
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
	</div>
</template>
<script>
import { BIND_ACTIVE_CONFIG, BIND_ACTIVE_COLUMNS } from '../shoppingMall/config';
import { uploadFileType } from 'util/formValidation';
export default {
	name: 'updateActivePage',
	data() {
		return {
			data: [],
			showActive: false,
			activeForm: {
				isSetBg: false,
				name: '',
				detailImg: '',
				listImg: '',
				content: '',
			},
			listBg: [],
			bindActiveList: [],
			activeSelectList: [],
			rules: {
				name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
			},
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
			},
			bindActiveOperate: [],
			dialogImageUrl: '',
			dialogVisible: false,
			photoList: [],
			BIND_ACTIVE_CONFIG,
			BIND_ACTIVE_COLUMNS,
		};
	},
	computed: {
		preview() {
			return !this.$route.query.id;
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
		if (this.preview === false) {
			this.getActiveDetail();
		}
	},
	methods: {
		beforeVideoUpload(file) {
			const whiteList = ['jpg', 'png', 'gif'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		// 活动列表背景图上传成功
		handleSuccessList(response, file, fileList) {
			this.activeForm.listImg = response.datas.fileUrlKey;
			this.listBg = fileList;
		},
		// 活动列表背景删除
		handleRemoveList(file, fileList) {
			this.activeForm.listImg = '';
			this.listBg = fileList;
		},
		// 根据id获取活动详情
		async getActiveDetail() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/activity/getActivity/' + this.$route.query.id,
			});
			if (res) {
				let { name, promotionVo, id, content, detailImg, listImg, isSetBg } = res.data;
				res.data.promotionName = res.data.name;
				this.data = [res.data];
				this.activeForm.name = name;
				this.activeForm.isSetBg = !!isSetBg;
				this.activeForm.content = content;
				this.promotionId = promotionVo ? promotionVo.promotionId : '';
				this.activityId = id;
				this.activeForm.detailImg = detailImg;
				if (detailImg && detailImg != '') this.photoList.push({ url: res.data.detailImg });
				if (listImg && listImg != '') this.listBg.push({ url: res.data.listImg });
			}
		},
		// 打开关联活动弹窗
		chooseActive() {
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
			if (res.data.list) {
				this.bindActiveList = res.data.list;
			} else {
				this.bindActiveList = [];
			}
		},
		// 搜索
		handleSearchProduct(data) {
			this.getAllActiveList(data);
		},
		// 重置
		handleResetProduct(data) {
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
		// 弹窗活动选中
		activeSelect(val) {
			this.activeSelectList = val;
		},
		// 保存新增活动
		async saveAndExit() {
			this.$refs['activeForm'].validate(async valid => {
				if (valid) {
					let { detailImg, isSetBg, content, listImg } = this.activeForm;
					if (this.preview) {
						const res = await this.$fetch({
							method: 'POST',
							url: '/mgmt/cms/activity/saveActivity',
							data: {
								name: this.data.promotionName,
								listImg,
								content,
								detailImg,
								isSetBg: isSetBg ? '1' : '0',
								promotionId: this.data[0] ? this.data[0].promotionId : '',
							},
						});
						if (res) {
							this.$message({
								type: 'success',
								message: res.message,
							});
							this.$dispatch('LOAD_ACTIVE_LIST');
							this.$closeSelf();
						}
					} else if (this.preview === false) {
						const res = await this.$fetch({
							method: 'POST',
							url: '/mgmt/cms/activity/editActivity/' + this.activityId,
							data: {
								name: this.data.promotionName,
								listImg,
								content,
								detailImg,
								isSetBg: isSetBg ? '1' : '0',
								promotionId: this.data[0] ? this.data[0].promotionId : '',
							},
						});
						if (res) {
							this.$message({
								type: 'success',
								message: res.message,
							});
							this.$dispatch('LOAD_ACTIVE_LIST');
							this.$closeSelf();
						}
					} else {
						this.$message({
							type: 'error',
							message: '请选择要关联的活动',
						});
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 删除图片
		handleRemove(file, fileList) {
			this.activeForm.detailImg = '';
			this.photoList = fileList;
		},
		// 预览图片
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		// 图片上传成功
		handleSuccess(response, file, fileList) {
			this.activeForm.detailImg = response.datas.fileUrlKey;
			this.photoList = fileList;
		},
		// 绑定活动
		async saveActive() {
			if (this.activeSelectList.length == 0) {
				this.$message({
					type: 'error',
					message: '请选择要关联的活动',
				});
				return;
			}
			if (this.activeSelectList.length > 1 || this.data.length > 1) {
				this.$message({
					type: 'error',
					message: '一个专题页只能关联一个活动',
				});
				return;
			}
			this.data = this.activeSelectList;
			this.showActive = false;
		},
		// 删除绑定的活动
		deleteBindActive(index) {
			this.data.splice(index, 1);
		},
	},
};
</script>
<style lang="scss" scoped>
.activeTitle {
	font-weight: 500;
	color: #303336;
	margin-bottom: 20px;
}
.tipTitle {
	color: #8c939b;
	font-size: 14px;
	margin: 10px 0;
}
.active-form {
	margin-top: 20px;
}
.active-input {
	max-width: 350px;
}
.mb-16 {
	margin-bottom: 16px;
}
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
.el-dialog__wrapper {
	overflow: auto;
}
</style>
