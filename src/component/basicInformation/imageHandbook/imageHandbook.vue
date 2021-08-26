<template>
	<div
		class="area-manage-list"
		v-loading.fullscreen="loadingPage"
		element-loading-text="拼命加载中"
		element-loading-spinner="el-icon-loading"
		element-loading-background="rgba(0, 0, 0, 0.4)"
	>
		<guideBar>
			<el-button
				v-permission="'image_hand_book_go_record|image_book_record'"
				type="primary"
				@click="$go('image_book_record')"
			>
				下载记录
			</el-button>
			<el-button v-permission="'image_hand_book_add'" type="primary" @click="addTable">新增手册</el-button>
		</guideBar>
		<el-card>
			<searchPanel ref="searchPanel" v-model="searchData" :config="IMAGE_BOOK_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="imageBook"
				:columns="IMAGE_BOOK_COLUMNS"
				:pagination="pagination"
				:dataTotal="total"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button v-permission="'image_hand_book_preview'" type="text" @click="handlePreview(scope.data)">
						预览
					</el-button>
					<el-button v-permission="'image_hand_book_edit'" type="text" @click="handleEdit(scope.data)">编辑</el-button>
					<el-button v-permission="'image_hand_book_delete'" type="text" @click="handleDel(scope.data)">删除</el-button>
					<el-button v-permission="'image_hand_book_download'" type="text" @click="handleDowload(scope.data)">
						下载
					</el-button>
				</template>
			</tableList>
		</el-card>
		<el-dialog :title="title" v-drag :visible.sync="centerDialogVisible" width="50%" :before-close="close">
			<div class="promote-content">
				<div class="promote">
					<el-form label-width="140px" :model="form" :rules="rules" ref="tabform">
						<el-form-item label="形象手册" prop="manualName">
							<el-col :span="16">
								<el-input
									v-model="form.manualName"
									maxlength="20"
									placeholder="请填写形象手册名称"
									show-word-limit
								></el-input>
							</el-col>
						</el-form-item>
						<el-form-item label="使用对象" prop="channel">
							<el-col :span="16">
								<el-checkbox-group v-model="form.channel">
									<el-checkbox :label="1">服务中心</el-checkbox>
									<el-checkbox :label="2">微店</el-checkbox>
								</el-checkbox-group>
							</el-col>
						</el-form-item>
						<el-form-item label="状态" prop="status">
							<el-col :span="16">
								<el-select v-model="form.status" style="width: 100%">
									<el-option label="启用" :value="1"></el-option>
									<el-option label="禁用" :value="0"></el-option>
								</el-select>
							</el-col>
						</el-form-item>
						<el-form-item label="">
							<span>支持格式：bmp、jpg、png、pdf，文件不能超过50MB</span>
						</el-form-item>
						<el-form-item label="文档" required>
							<el-upload
								class="upload-demo"
								:action="$store.getters['system/getOssUploadUrl']"
								:headers="$store.getters['system/getSignatureVerification']"
								:on-remove="beforeRemoveDoc"
								:data="uploadData"
								:on-success="handleSuccess"
								:on-error="onError"
								:limit="1"
								:file-list="fileList"
								:before-upload="beforeAvatarUpload"
							>
								<el-button size="small" type="primary">点击上传</el-button>
							</el-upload>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="close">取消</el-button>
				<el-button type="primary" @click="save">确定</el-button>
			</span>
		</el-dialog>
		<el-dialog title="预览模板" :visible.sync="isReview" width="50%">
			<div>
				<div v-if="reviewImg.includes('.pdf')"><pdf v-for="i in numPages" :key="i" :src="url" :page="i"></pdf></div>
				<img v-else :src="reviewImg" alt="" style="width: 100%" />
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="isReview = false">取消</el-button>
				<el-button type="primary" @click="isReview = false">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { IMAGE_BOOK_COLUMNS, IMAGE_BOOK_CONFIG } from './config';
import { uploadFileType, getObjectURL } from 'util/formValidation';
import pdf from 'vue-pdf';
import axios from 'axios';
export default {
	name: 'imageHandbook',
	components: { pdf },
	data() {
		return {
			loadingPage: false,
			isReview: false,
			title: '新增形象手册',
			reviewImg: '',
			url: '',
			numPages: undefined,
			form: {
				channel: [1],
				manualUrl: '',
				id: '',
				status: 1,
				manualName: '',
			},
			rules: {
				manualName: [{ required: true, message: '请填写形象手册名称', trigger: 'bulr' }],
				channel: [{ required: true, message: '请勾选使用对象', trigger: 'change' }],
				status: [{ required: true, message: '请选择状态', trigger: 'change' }],
			},
			centerDialogVisible: false,
			fileList: [],
			loading: false,
			IMAGE_BOOK_COLUMNS,
			IMAGE_BOOK_CONFIG,
			imageBook: [],
			searchData: {
				channel: '',
				status: '',
				manualName: '',
			},
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			total: 0,
			options: {
				index: true,
				labelIndex: '序号',
			},
			imageUrl: '',
			tableType: [],
		};
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.sys,
			};
			return params;
		},
	},
	methods: {
		//下载
		exportFile(data, fileName) {
			const linkNode = document.createElement('a');
			linkNode.download = `${fileName}.pdf`;
			linkNode.style.display = 'none';
			linkNode.href = URL.createObjectURL(data);
			linkNode.target = '_blank';
			document.body.appendChild(linkNode);
			linkNode.click();
			URL.revokeObjectURL(linkNode.href);
			document.body.removeChild(linkNode);
			this.$message.success('下载成功');
		},
		async recordSave(id) {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/sys/image/record/save`,
				data: { downloader: this.$store.state.userInfo.nickname, id },
			});
			if (res && res.code === 200) {
				this.$dispatch('IMAGE_BOOK_RECORD');
				this.$message.success(res.message);
			}
		},
		async handleDowload({ manualUrl, id, manualName }) {
			if (!manualUrl) this.$message.warning('下载资源失败');
			axios({
				method: 'get',
				url: `/mgmt/sys/image/manual/download?id=${id}&storeCode=''&type=2`, // 请求地址
				responseType: 'blob', //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
			}).then(res => {
				this.exportFile(res.data, manualName);
				this.recordSave(id);
			});
		},
		async handlePreview({ manualUrl, id }) {
			this.reviewImg = manualUrl;
			if (!manualUrl.includes('.pdf') && !manualUrl.includes('.PDF')) {
				return (this.isReview = true);
			}
			axios.defaults.timeout = 0;
			this.loadingPage = true;
			axios({
				method: 'get',
				url: `/mgmt/sys/image/manual/download?id=${id}&storeCode=''&type=1`, // 请求地址
				responseType: 'blob', //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
			})
				.then(res => {
					if (res.status == 200) {
						this.isReview = true;
						this.url = pdf.createLoadingTask({
							url: getObjectURL(res.data),
						});
						this.url.promise.then(pdf => {
							this.numPages = pdf.numPages;
						});
					} else {
						this.$message.error('预览失败');
					}
					this.loadingPage = false;
				})
				.catch(() => {
					this.loadingPage = false;
				});
		},
		close() {
			this.form = {
				channel: [1],
				manualUrl: '',
				id: '',
				status: 1,
				manualName: '',
			};
			this.fileList = [];
			this.centerDialogVisible = false;
		},
		addTable() {
			this.title = '新增形象手册';
			this.centerDialogVisible = true;
			this.$nextTick(() => {
				this.$refs.tabform.clearValidate();
			});
		},
		handleEdit(e) {
			let { manualUrl } = e;
			this.title = '编辑形象手册';
			this.form = Object.assign({}, e);
			this.form.channel = [];
			if (e.channel === 3) {
				this.form.channel.push(1);
				this.form.channel.push(2);
			} else {
				this.form.channel.push(e.channel);
			}
			if (e.manualUrl) {
				let name = manualUrl.substring(0, manualUrl.lastIndexOf('.'));
				this.fileList = [{ name: name, url: manualUrl }];
			}
			this.centerDialogVisible = true;
		},
		handleDel({ id }) {
			this.$confirm('删除后不可恢复，请确认是否要删除？', '删除形象手册', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'DELETE',
					url: `/mgmt/sys/image/delete`,
					params: { id },
				});
				if (res && res.code === 200) {
					this.getList();
					this.$message.success(res.message);
				}
			});
		},
		save() {
			this.$refs.tabform.validate(async valid => {
				if (valid) {
					if (this.form.manualUrl == '') return this.$message.warning('请上传文档');
					if (this.title == '新增形象手册') delete this.form.id;
					let parmas = Object.assign({}, this.form);
					parmas.channel.forEach(e => {
						parmas.channel = parmas.channel.length === 1 ? e : 3;
					});
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/sys/image/${this.title == '新增形象手册' ? 'save' : 'update'}`,
						data: parmas,
					});
					if (res && res.code === 200) {
						this.getList();
						this.$message.success(res.message);
						this.close();
					}
				}
			});
		},
		handleSuccess(res, file, filelist) {
			if (res.success) {
				this.$message.success('上传成功');
				this.form.manualUrl = res.datas.fileUrlKey;
				this.fileList = filelist;
			}
			this.fileList = filelist;
		},
		onError() {
			this.$message.error('上传失败');
		},
		beforeRemoveDoc(e) {
			this.form.manualUrl = '';
			this.fileList.forEach((el, i) => {
				if (el.uid === e.uid) this.fileList.splice(i, 1);
			});
		},
		beforeAvatarUpload(file) {
			const whiteList = ['bmp', 'jpg', 'png', 'pdf'];
			return uploadFileType.call(this, file, whiteList, 50);
		},
		// 分页触发事件
		handleChangePage(val) {
			this.pagination.currentPage = val;
			this.getList();
		},
		// 分页下拉触发事件
		handleSizeChange(val) {
			this.pagination.pageSize = val;
			this.getList();
		},
		// 请求数据
		async getList() {
			this.loading = true;
			const { currentPage: pageNum, pageSize } = this.pagination;
			const params = { pageNum, pageSize, ...this.searchData };
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/sys/image/page`,
				params,
			});
			if (res && res.code === 200) {
				const { list, total } = res.data;
				this.imageBook = list;
				this.total = total;
			} else {
				this.imageBook = [];
				this.total = 0;
			}
			this.loading = false;
		},
		handleSearch() {
			this.pagination.currentPage = 1;
			this.getList();
		},
	},
	created() {
		this.$listen('UPDATE_AREA_LIST', this.getList);
		this.getList();
	},
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__wrapper {
	overflow: auto;
}
.avatar-uploader .el-upload {
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.avatar-uploader .avatar-uploader-icon:hover {
	border-color: #409eff;
}
.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
}
.avatar {
	width: 178px;
	height: 178px;
	display: block;
}
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
</style>
