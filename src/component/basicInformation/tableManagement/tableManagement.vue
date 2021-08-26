<template>
	<div class="area-manage-list">
		<guideBar>
			<el-button v-permission="'table_management_type'" type="primary" @click="$go('table_type')">
				表格类型管理
			</el-button>
			<el-button v-permission="'table_management_add'" type="primary" @click="addTable">新增表格</el-button>
		</guideBar>
		<el-card>
			<searchPanel ref="searchPanel" v-model="searchData" :config="TABEL_LIST_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="dataSource"
				:columns="AREA_MANGE_COLUMNS"
				:pagination="pagination"
				:dataTotal="total"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<!-- :operates="operates" -->
				<template v-slot:fillStyle="{ row }">
					<el-button type="text" v-permission="'table_management_preview'" @click="review(row)">预览模板</el-button>
					<el-button type="text" v-permission="'table_management_download'" @click="download(row)">下载</el-button>
				</template>
				<template slot-scope="scope">
					<el-button v-permission="'table_management_edit'" type="text" @click="handleEdit(scope.data)">编辑</el-button>
					<el-button v-permission="'table_management_del'" type="text" @click="handleDel(scope.data)">删除</el-button>
				</template>
			</tableList>
		</el-card>
		<el-dialog :title="title" v-drag :visible.sync="centerDialogVisible" width="50%" :before-close="close">
			<div class="promote-content">
				<div class="promote">
					<el-form label-width="140px" :model="form" :rules="rules" ref="tabform">
						<el-form-item label="表格名称" prop="tableName">
							<el-col :span="16">
								<el-input v-model="form.tableName" placeholder maxlength="20" show-word-limit></el-input>
							</el-col>
						</el-form-item>
						<el-form-item label="发布渠道" prop="channel">
							<el-col :span="16">
								<el-checkbox-group v-model="form.channel">
									<el-checkbox :label="1">服务中心</el-checkbox>
									<el-checkbox :label="2">商城</el-checkbox>
								</el-checkbox-group>
							</el-col>
							<el-popover placement="top-start" width="280" trigger="hover">
								<div>
									<p>说明</p>
									<p>发布在商城将会对所有的登录顾客展示；</p>
									<p>发布在服务中心将会对门店端展示；</p>
								</div>
								<span slot="reference" class="textspan">说明</span>
							</el-popover>
						</el-form-item>
						<el-form-item label="表格状态" prop="status">
							<el-col :span="16">
								<el-select v-model="form.status" style="width: 100%">
									<el-option label="启用" :value="1"></el-option>
									<el-option label="禁用" :value="0"></el-option>
								</el-select>
							</el-col>
						</el-form-item>
						<el-form-item label="表格类型" prop="tableTypeId">
							<el-col :span="16">
								<el-select v-model="form.tableTypeId" style="width: 100%">
									<el-option
										v-for="(item, index) in tableType"
										:key="index"
										:label="item.label"
										:value="item.value"
									></el-option>
								</el-select>
							</el-col>
							<span class="textspan" @click="goTableType">表格类型管理</span>
						</el-form-item>
						<el-form-item label="预览模板" prop="name">
							<el-upload
								:action="$store.getters['system/getOssUploadUrl']"
								:headers="$store.getters['system/getSignatureVerification']"
								list-type="picture-card"
								:file-list="reviewList"
								:data="uploadData"
								:limit="1"
								:on-success="handleAvatarSuccess"
								:before-upload="beforeAvatarUpload"
								:on-remove="beforeRemove"
								:on-preview="handlePictureCardPreview"
								:class="reviewList.length == 1 ? 'hide_box' : ''"
							>
								<i class="el-icon-plus"></i>
							</el-upload>
							<el-dialog :visible.sync="dialogVisible" :modal="false">
								<img width="100%" :src="imageUrl" alt="" />
							</el-dialog>
						</el-form-item>
						<el-form-item label="" prop="name">
							<span>支持格式：bmp、jpg、png，文件不能超过10MB</span>
						</el-form-item>
						<el-form-item label="文档" prop="name">
							<el-upload
								class="upload-demo"
								:action="$store.getters['system/getOssUploadUrl']"
								:headers="$store.getters['system/getSignatureVerification']"
								:on-remove="beforeRemoveDoc"
								:data="uploadData"
								:on-success="handleSuccess"
								:limit="1"
								:file-list="fileList"
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
		<el-dialog title="预览模板" v-drag :visible.sync="isReview" width="50%">
			<div>
				<img :src="reviewImg" alt="" style="width: 100%" />
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="isReview = false">取消</el-button>
				<el-button type="primary" @click="isReview = false">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { AREA_MANGE_COLUMNS, TABEL_LIST_CONFIG } from './config';
import { uploadFileType } from 'util/formValidation';
// , downloadFile
export default {
	name: 'tableManagement',
	data() {
		return {
			isReview: false,
			title: '新建表格',
			reviewImg: '',
			form: {
				channel: [],
				exampleImgUrl: '',
				id: '',
				purpose: '',
				status: 1,
				tableName: '',
				tableTypeId: '',
				uploadTableDoc: '',
				uploadTableDocName: '',
			},
			rules: {
				tableName: [{ required: true, message: '请填写表格名称', trigger: 'bulr' }],
				channel: [{ required: true, message: '请勾选发布渠道', trigger: 'change' }],
				status: [{ required: true, message: '请选择表格状态', trigger: 'change' }],
				tableTypeId: [{ required: true, message: '请选择表格类型', trigger: 'change' }],
			},
			centerDialogVisible: false,
			dialogVisible: false,
			fileList: [],
			reviewList: [],
			loading: false,
			AREA_MANGE_COLUMNS,
			TABEL_LIST_CONFIG,
			dataSource: [],
			searchData: {
				channel: '',
				status: '',
				tableName: '',
				typeId: '',
			},
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			total: 0,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
				operatesText: '填写样式',
				operateCycleWidth: 140,
				operatesWidth: 100,
				operateFixed: null,
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
		download({ uploadTableDoc }) {
			if (!uploadTableDoc) return this.$message.warning('无资源下载！');
			window.open(uploadTableDoc, '_blank');
		},
		review(row) {
			this.reviewImg = row.exampleImgUrl;
			console.log(this.reviewImg);
			this.isReview = true;
		},
		goTableType() {
			this.centerDialogVisible = false;
			this.$go('table_type');
		},
		close() {
			this.form = {
				channel: [],
				exampleImgUrl: '',
				id: '',
				purpose: '',
				status: '',
				tableName: '',
				tableTypeId: '',
				uploadTableDoc: '',
				uploadTableDocName: '',
			};
			this.reviewList = [];
			this.fileList = [];
			this.centerDialogVisible = false;
		},
		addTable() {
			this.title = '新建表格';
			this.centerDialogVisible = true;
			this.$nextTick(() => {
				this.$refs.tabform.clearValidate();
			});

			this.tableTypeList();
		},
		handleEdit(e) {
			let { uploadTableDocName, uploadTableDoc, exampleImgUrl } = e;
			this.title = '编辑表格';
			this.form = Object.assign({}, e);
			this.form.channel = [];
			if (e.channel === 3) {
				this.form.channel.push(1);
				this.form.channel.push(2);
			} else {
				this.form.channel.push(e.channel);
			}
			if (e.exampleImgUrl) this.reviewList = [{ name: '预览图', url: exampleImgUrl }];
			if (e.uploadTableDoc) {
				let name = uploadTableDocName
					? uploadTableDocName
					: '附件' + exampleImgUrl.substring(0, exampleImgUrl.lastIndexOf('.'));
				this.fileList = [{ name: name, url: uploadTableDoc }];
			}
			this.centerDialogVisible = true;
			this.tableTypeList();
		},
		handleDel({ id }) {
			this.$confirm('删除后不可恢复，请确认是否要删除?', '删除表格', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'DELETE',
					url: `/mgmt/sys/table/delete`,
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
					if (this.title == '新建表格') delete this.form.id;
					let parmas = Object.assign({}, this.form);
					parmas.channel.forEach(e => {
						parmas.channel = parmas.channel.length === 1 ? e : 3;
					});
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/sys/table/${this.title == '新建表格' ? 'save' : 'update'}`,
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
		handlePictureCardPreview(file) {
			this.imageUrl = file.url;
			this.dialogVisible = true;
		},
		handleSuccess(res, file, filelist) {
			if (res.success) {
				this.form.uploadTableDoc = res.datas.fileUrlKey;
				this.form.uploadTableDocName = file.name;
			}
			this.fileList = filelist;
		},
		beforeRemove(e) {
			this.form.exampleImgUrl = '';
			this.reviewList.forEach((el, i) => {
				if (el.uid === e.uid) this.reviewList.splice(i, 1);
			});
		},
		beforeRemoveDoc(e) {
			this.form.uploadTableDoc = '';
			this.form.uploadTableDocName = '';
			this.fileList.forEach((el, i) => {
				if (el.uid === e.uid) this.fileList.splice(i, 1);
			});
		},
		handleAvatarSuccess(res, file, filelist) {
			if (res.success) this.form.exampleImgUrl = res.datas.fileUrlKey;
			this.reviewList = filelist;
		},
		beforeAvatarUpload(file) {
			const whiteList = ['bmp', 'png', 'jpg'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		addAreaManage() {},
		// 查询事件
		search() {
			this.pagination.currentPage = 1;
			this.getList();
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

		// 多级下拉框事件
		handleChange() {
			// 选择之后将下拉界面收起
			this.$refs.elcascader.dropDownVisible = false;
		},
		async tableTypeList() {
			const res = await this.$fetch(`/mgmt/sys/table/type/list`);
			if (res && res.code === 200) {
				this.tableType = res.data.map(({ id, name }) => ({ value: id, label: name }));
				this.TABEL_LIST_CONFIG.form.forEach(e => {
					if (e.key == 'typeId') {
						e.options = this.tableType;
					}
				});
			}
		},
		// 请求数据
		async getList() {
			this.loading = true;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this;

			const params = {
				pageNum,
				pageSize,
				...this.searchData,
			};
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/sys/table/page`,
				params,
			});
			if (res && res.code === 200) {
				const { list, total } = res.data;
				this.dataSource = list;
				this.total = total;
			} else {
				this.dataSource = [];
				this.total = 0;
			}
			this.loading = false;
		},
		handleSearch() {
			this.getList();
		},
	},
	created() {
		this.$listen('UPDATE_AREA_LIST', this.getList);
		this.getList();
		this.tableTypeList();
	},
};
</script>
<style lang="scss" scoped>
.textspan {
	margin-left: 10px;
	color: #3883f8;
	cursor: pointer;
}
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
