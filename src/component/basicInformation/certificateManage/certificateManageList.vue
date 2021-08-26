<template>
	<div
		class="certificate-manage-list"
		v-loading.fullscreen="loadingPage"
		element-loading-text="拼命加载中"
		element-loading-spinner="el-icon-loading"
		element-loading-background="rgba(0, 0, 0, 0.4)"
	>
		<guideBar>
			<el-button v-permission="'certificate_manage_add'" type="primary" @click="add">新增证件</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="CERTIFICATE_MANAGE_LIST_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="dataSource"
				:columns="CERTIFICATE_MANAGE_LIST_COLUMNS"
				:pagination="pagination"
				:dataTotal="total"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="row">
					<el-button v-permission="'certificate_manage_preview'" type="text" @click="handlePreview(row.data)">
						预览
					</el-button>
					<el-button v-permission="'certificate_manage_download'" type="text" @click="handleDownload(row.data)">
						下载
					</el-button>
					<el-button v-permission="'certificate_manage_edit'" type="text" @click="handleEdit(row.data)">编辑</el-button>
					<el-button v-permission="'certificate_manage_delete'" type="text" @click="handleDelete(row.data)">
						删除
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 新增/编辑 -->
		<el-dialog :title="isAdd ? '新增公司证件' : '编辑公司证件'" :visible.sync="show" width="700px">
			<el-form
				class="add-rate"
				:model="ruleForm"
				:rules="rules"
				ref="ruleForm"
				label-width="140px"
				label-position="right"
				label-suffix=":"
			>
				<div class="flex">
					<el-form-item label="证件类型" prop="certiTypeId">
						<el-select size="medium" v-model="ruleForm.certiTypeId" placeholder="请选择证件类型">
							<el-option
								v-for="item in certificateTypeOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="所属公司">
						<el-input size="medium" v-model="ruleForm.companyName" placeholder="请选择所属公司" />
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="状态" prop="status">
						<el-select size="medium" v-model="ruleForm.status" placeholder="请选择状态">
							<el-option label="启用" value="1" />
							<el-option label="禁用" value="0" />
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="有效期" prop="validTime">
						<el-date-picker
							size="medium"
							type="date"
							v-model="ruleForm.validTime"
							value-format="yyyy-MM-dd"
							placeholder="请选择有效期"
						/>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="备注" prop="remarks">
						<el-input size="medium" v-model="ruleForm.remarks" />
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="添加附件" prop="fileUrl">
						<el-upload
							class="upload-demo"
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							:before-remove="handleRemove"
							:on-preview="onPreview"
							:on-success="handleSuccess"
							:limit="1"
							:file-list="fileList"
							:before-upload="beforeVideoUpload"
							accept=".doc, .docx, .pdf, .xlsx, .xls, .rar, .zip"
						>
							<el-button size="small" type="primary" v-if="showUpdate">上传文件</el-button>
							<div slot="tip" class="el-upload__tip tip-title" v-if="showUpdate" ref="up_dom">
								(支持文件格式：doc、docx、pdf、xlsx、xls、rar、zip、7z、jpeg等)
							</div>
						</el-upload>
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="save('ruleForm')" class="save">保存</el-button>
				<el-button @click="cacel('ruleForm')" class="cacel">取 消</el-button>
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
import { CERTIFICATE_MANAGE_LIST_CONFIG, CERTIFICATE_MANAGE_LIST_COLUMNS, CERTIFICATE_MANAGE_STATUS } from './config';
import { formatDateDefault, uploadFileType, getObjectURL } from 'util/formValidation';
import qs from 'querystring';
import pdf from 'vue-pdf';
import axios from 'axios';
const DataKey = {
	certiTypeId: '', // 证件类型
	companyName: '', // 所属公司
	status: '', // 状态
	validTime: '', // 有效期
	remarks: '', // 备注
	fileUrl: '', // 上传附件
};
export default {
	name: 'certificateManageList',
	components: { pdf },
	data() {
		return {
			loadingPage: false,
			reviewImg: '',
			url: '',
			numPages: undefined,
			isReview: false,
			CERTIFICATE_MANAGE_LIST_CONFIG,
			CERTIFICATE_MANAGE_LIST_COLUMNS,
			CERTIFICATE_MANAGE_STATUS,
			loading: false,
			searchConfig: {
				certiTypeId: '', // 证件类型
				companyId: '', // 所属公司
				status: '', // 状态
				registrationTime: [], // 创建时间
			},
			dataSource: [],
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
			},
			show: false,
			isAdd: true,
			ruleForm: Object.assign({ ...DataKey }),
			rules: {
				certiTypeId: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
				companyId: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
				status: [{ required: true, message: '请选择状态', trigger: 'change' }],
			},
			fileList: [],
			showUpdate: true, // 默认显示上传按钮
			certificateTypeOptions: [], // 证件类型数据源
			organizationOptions: [], // 所属公司数据源
			// ossParams: {
			// 	// 上传需要的参数信息
			// 	storageType: '', // 存储类型（目前支持的类型:FastDFS）
			// 	timeStamp: '', // 时间（格式：yyyyMMddHHmmss)
			// 	clientKey: '', // 客户端Key(由管理员进行分配)
			// 	sign: '', // 签名（具体见签名规则说明）
			// },
			// url: '', // 上传oss的地址
			fileName: '', //上传的文件名称
		};
	},
	computed: {
		uploadData() {
			return {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.order,
			};
		},

		// 搜索参数
		searchFields() {
			const { searchConfig } = this;
			return {
				...searchConfig,
				startTime:
					searchConfig.registrationTime.length && searchConfig.registrationTime[0]
						? this.formatDate(searchConfig.registrationTime, 0)
						: '',
				endTime:
					searchConfig.registrationTime.length && searchConfig.registrationTime[0]
						? this.formatDate(searchConfig.registrationTime, 1)
						: '',
			};
		},
	},
	methods: {
		beforeVideoUpload(file) {
			const whiteList = ['doc', 'docx', 'pdf', 'xlsx', 'xls', 'rar', 'zip', '7z', 'jpeg'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		// 格式化时间
		formatDate(item, index) {
			if (item && item.length >= 2) {
				let d = new Date(item[index]);
				let YY = d.getFullYear() + '-';
				let MM = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '-';
				let DD = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
				return YY + MM + DD;
			} else {
				return '';
			}
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
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.getList();
		},
		// 新增证件
		add() {
			(this.show = true), (this.isAdd = true);
			this.ruleForm = {
				certiTypeId: '', // 证件类型
				companyId: '', // 所属公司
				status: '', // 状态
				validTime: '', // 有效期
				remarks: '', // 备注
				fileUrl: '', // 上传附件
			};
			this.showUpdate = true;
			this.fileList = [];
		},
		handlePreview({ fileUrl, id }) {
			this.reviewImg = fileUrl;
			if (!fileUrl.includes('.pdf') && !fileUrl.includes('.PDF')) {
				return (this.isReview = true);
			}
			axios.defaults.timeout = 0;
			this.loadingPage = true;
			axios({
				method: 'get',
				url: `/mgmt/sys/certificate/download?id=${id}&type=1`, // 请求地址
				responseType: 'blob', //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
			})
				.then(res => {
					if (res.status == 200) {
						this.isReview = true;
						this.url = pdf.createLoadingTask({
							url: getObjectURL(res.data),
							//引入pdf.js字体，templ  解决水印字体不显示
							cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.5.207/cmaps/',
							cMapPacked: true,
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
		handleDownload({ fileUrl, id }) {
			if (!fileUrl) this.$message.warning('下载资源失败');
			this.loadingPage = true;
			axios({
				method: 'get',
				url: `/mgmt/sys/certificate/download?id=${id}&storeCode=''&type=2`, // 请求地址
				responseType: 'blob', //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
			})
				.then(res => {
					this.exportFile(res.data, fileUrl);
					this.loadingPage = false;
				})
				.catch(() => {
					this.loadingPage = false;
				});
		},
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
		// 编辑
		handleEdit(row) {
			this.show = true;
			this.isAdd = false;
			const { id, certiTypeId, companyName, status, validTime, remarks, fileUrl } = row;
			this.ruleForm = {
				...this.ruleForm,
				id,
				certiTypeId,
				companyName,
				status: String(status),
				validTime: formatDateDefault(validTime),
				remarks,
				fileUrl,
			};
			if (fileUrl) {
				this.showUpdate = false;
				this.fileList = [{ name: fileUrl, url: fileUrl }];
			} else {
				this.showUpdate = true;
				this.fileList = [];
			}
		},
		// 删除
		async handleDelete({ id }) {
			this.$confirm('确定删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				await this.delete({ id });
				this.getList();
			});
		},
		// 保存
		save(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					if (this.isAdd) {
						await this.addCerti(this.ruleForm);
						this.show = false;
						this.$refs[formName].resetFields();
					} else {
						await this.update(this.ruleForm);
						this.show = false;
						this.$refs[formName].resetFields();
						this.getList();
					}
				}
			});
		},
		// 取消
		cacel(formName) {
			this.show = false;
			this.$refs[formName].resetFields();
			this.ruleForm = Object.assign({ ...DataKey });
			this.fileList = [];
			this.showUpdate = true;
		},
		// 编辑
		async update(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/sys/updateCerti',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message.success(res.message);
			}
		},
		// 新增接口
		async addCerti(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/sys/addCerti',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message.success(res.message);
				this.getList();
			}
		},
		onPreview(file) {
			window.open(file.url, '_blank');
		},
		handleRemove() {
			this.showUpdate = true;
			this.ruleForm.fileUrl = '';
			this.fileList = [];
		},
		handleSuccess(response, file, fileList) {
			this.showUpdate = false;
			const { fileUrlKey } = response.datas;
			const { success } = response;
			if (success) {
				this.ruleForm.fileUrl = fileUrlKey;
				this.fileName = file.name;
				this.fileList = fileList;
			}
		},
		// 获取证件类型接口
		async getCertiTypeAndName() {
			const res = await this.$fetch('/mgmt/sys/getCertiTypeIdAndName');
			if (res.code === 200) {
				const { data } = res;
				this.certificateTypeOptions = data.map(v => {
					return {
						label: v.name,
						value: v.id,
					};
				});
				// 初始化搜索配置下拉选项数据
				CERTIFICATE_MANAGE_LIST_CONFIG.form[0].options = this.certificateTypeOptions;
			} else {
				this.certificateTypeOptions = [];
			}
		},
		// 获取所属公司接口
		async getComIdAndName() {
			const res = await this.$fetch('/mgmt/sys/getComIdAndName');
			if (res.code === 200) {
				const { data } = res;
				this.organizationOptions = data.map(v => {
					return {
						label: v.name,
						value: v.id,
					};
				});
				// 初始化搜索配置下拉选项数据
				CERTIFICATE_MANAGE_LIST_CONFIG.form[1].options = this.organizationOptions;
			} else {
				this.organizationOptions = [];
			}
		},
		// 删除接口
		async delete(params) {
			const res = await this.$fetch(`/mgmt/sys/delCerti?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
		},
		// 请求数据
		async getList() {
			this.loading = true;
			const {
				pagination: { currentPage: pageNum, pageSize },
				searchFields,
			} = this;
			let obj = Object.assign({}, searchFields);
			delete obj.registrationTime;
			const params = {
				pageNum,
				pageSize,
				...obj,
			};
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/sys/getCerti',
				data: params,
			});
			if (res.code === 200) {
				const { list, total } = res.data;
				this.dataSource = list;
				this.total = total;
			} else {
				this.dataSource = [];
				this.total = 0;
			}
			this.loading = false;
		},
	},
	created() {
		this.getList();
		this.getCertiTypeAndName();
		this.getComIdAndName();
	},
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__wrapper {
	overflow: auto;
}
.certificate-manage-list {
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}

	.dialog-footer {
		display: flex;
		justify-content: center;
	}
	.tip-title {
		white-space: nowrap;
		word-break: keep-all;
		color: #ccc;
	}
}
::v-deep.add-rate {
	.el-form-item {
		margin-bottom: 25px;
		.el-form-item__content,
		.el-input,
		.el-select,
		.el-date-editor {
			width: 224px;
		}
	}
	.el-input-group__append {
		padding: 0 6px;
	}
	.flex {
		display: flex;
	}
}
::v-deep.upload-demo {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	ul {
		width: 224px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
.save {
	width: 100px;
	margin-right: 16px;
}
.cacel {
	width: 100px;
}
</style>
