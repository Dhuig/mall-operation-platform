<template>
	<div>
		<guideBar>
			<el-button type="primary" v-permission="'product_report_add_btn'" @click="openDialog('add')">
				新建成品报告
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="PRODUCT_RERORT_SEARCH" @search="search" ref="searchPanel" />
		</el-card>
		<el-card>
			<tableList
				:options="options"
				:loading="loading"
				:dataSource="data"
				:columns="PRODUCT_RERORT_COLUMNS"
				:pagination="pagination"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				:dataTotal="pagination.total"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button
						v-permission="'product_report_list_detail'"
						type="text"
						@click="openTableDialog(scope.data, '浏览列表', 'view')"
					>
						浏览
					</el-button>
					<el-button v-permission="'product_report_status-btn'" type="text" @click="statusBtn(scope.data)">
						{{ scope.data.status === 1 ? '禁用' : '启用' }}
					</el-button>
					<el-button
						type="text"
						v-if="scope.data.status === 1"
						v-permission="'product_report_download_btn'"
						@click="openTableDialog(scope.data, '下载列表', 'download')"
					>
						下载
					</el-button>
					<el-button
						type="text"
						v-if="scope.data.status === 1 && scope.data.sign == 0"
						v-permission="'product_report_edit_btn'"
						@click="openDialog('edit', scope.data, '编辑成品报告')"
					>
						编辑
					</el-button>
					<el-button
						type="text"
						v-permission="'product_report_copy_btn'"
						@click="openDialog('copy', scope.data, '复制成品报告')"
					>
						复制
					</el-button>
					<el-button
						type="text"
						v-if="scope.data.uploadNo == uploadNo"
						v-permission="'product_report_detelet_btn'"
						@click="deleteDate(scope.data)"
					>
						删除
					</el-button>
				</template>
			</tableList>
		</el-card>
		<el-dialog :visible.sync="centerDialogVisible" width="60%" :before-close="close">
			<div class="report-preview">
				<pdf v-for="i in numPages" :key="i" :src="url" :page="i"></pdf>
			</div>
		</el-dialog>

		<!-- 新建/编辑 成品管理 -->
		<el-dialog
			:visible.sync="reportDialog.show"
			:title="reportDialog.title"
			width="60%"
			:before-close="closeReportDialog"
		>
			<el-form :model="reportForm" :rules="REPORT_FORM_RULE" ref="reportForm" label-width="100px">
				<el-row :gutter="24">
					<el-col :span="12">
						<el-form-item label="成品代码" prop="productCode">
							<el-input @blur="getProduct" v-model="reportForm.productCode"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="成品名称" prop="productName">
							{{ reportForm.productName }}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="24">
					<el-col :span="12">
						<el-form-item label="报告类型" prop="reportType">
							<el-select v-model="reportForm.reportType" placeholder="请选择报告类型">
								<el-option label="自检" :value="1"></el-option>
								<el-option label="外检" :value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="产地" prop="producedAddress">
							<el-select v-model="reportForm.producedAddress" placeholder="请选择产地">
								<el-option label="中山基地" :value="1"></el-option>
								<el-option label="扬州基地" :value="2"></el-option>
								<el-option label="吉林基地" :value="3"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="24">
					<el-col :span="12">
						<el-form-item label="生产日期" prop="date">
							<el-date-picker
								:picker-options="pickerOptions"
								value-format="yyyy-MM-dd"
								v-model="reportForm.date"
								:editable="false"
								type="date"
								placeholder="选择日期"
							></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="批号" prop="productNumber">
							<el-input v-model="reportForm.productNumber"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="24">
					<el-col :span="12">
						<el-form-item label="状态" prop="status">
							<el-select v-model="reportForm.status" placeholder="请选择转态">
								<el-option label="启用" :value="1"></el-option>
								<el-option label="禁用" :value="0"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="24">
					<el-col :span="24">
						<el-form-item label="附件">
							<el-upload
								:action="uploadData.actionUrl"
								:class="[successsFileList.length == 20 ? 'is-upload' : '']"
								:headers="$store.getters['system/getSignatureVerification']"
								:on-change="change"
								:on-remove="enclosureRemove"
								:on-progress="progress"
								:on-success="enclosureSuccess"
								:before-upload="beforeAvatarUpload"
								:file-list="fileList"
								:limit="10"
								:data="uploadData"
							>
								<el-button size="small" type="primary">点击上传</el-button>
								<div slot="tip">只能上传10个pdf格式文件,且大小不超过20M</div>
							</el-upload>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item>
					<el-row type="flex" justify="end">
						<el-button :loading="dialogLoading" type="primary" @click="enterReportDialog">保 存</el-button>
						<el-button @click="closeReportDialog">取 消</el-button>
					</el-row>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!-- 浏览下载列表 -->

		<el-dialog
			:visible.sync="downOrViewDialog.show"
			:title="downOrViewDialog.title"
			width="60%"
			:show-close="false"
			:close-on-press-escape="false"
			v-drag
		>
			<div v-loading="downOrViewDialog.loading">
				<el-table :data="downOrViewDialog.data" style="width: 100%">
					<el-table-column prop="name" label="文件名"></el-table-column>
					<el-table-column label="操作" width="150">
						<template slot-scope="scope">
							<el-button type="text" v-if="downOrViewDialog.type == 'view'" @click="viewDetail(scope.$index)">
								浏览
							</el-button>
							<el-button type="text" v-if="downOrViewDialog.type == 'download'" @click="downloadBtn(scope.$index)">
								下载
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-row class="marginT20" type="flex" justify="end">
					<el-button type="primary" @click="downOrViewDialog.show = false">返回</el-button>
				</el-row>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { PRODUCT_RERORT_SEARCH, PRODUCT_RERORT_COLUMNS, REPORT_FORM_RULE } from './config';
import { formatDateDefault, getObjectURL, uploadFileType } from 'util/formValidation.js';
// import { timeStartFormat, timeEndFormat } from 'util';
import pdf from 'vue-pdf';
import { exportExcel } from 'util';
export default {
	name: 'productReportManagement',
	components: {
		pdf,
	},
	data() {
		return {
			toggleSearchDisplay: true,
			isForm: true,
			centerDialogVisible: false,
			PRODUCT_RERORT_SEARCH,
			PRODUCT_RERORT_COLUMNS,
			REPORT_FORM_RULE,
			searchConfig: {
				productCode: null,
				productName: null,
				productNumber: null,
				codeOrName: null,
				reportType: 1,
				producedAddress: null,
				status: null,
				registrationTime: null,
				uploadTime: null,
			},
			uploadData: {
				storageType: this.$config.OSS_UPLOAD_TYPE, // 存储类型（目前支持的类型:FastDFS）
				clientKey: this.$config.CLIENT_KEY.sys, // 客户端Key(由管理员进行分配)
				actionUrl: this.$store.getters['system/getOssUploadUrl'],
			},
			dialogLoading: false,
			url: '',
			numPages: undefined,
			src: '',
			ruleForm: {},
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
				operatesWidth: 260,
			},
			uploadNo: null,
			data: [],
			loading: false,
			pagination: {
				currentPage: 1,
				pageSize: 10,
				total: 0,
			},
			reportDialog: {
				type: '',
				title: '',
				show: false,
			},
			reportForm: {
				fileUrlKey: '',
				reportName: '',
				productCode: '', // 成品代码
				productName: '', // 成品名称
				reportType: null, // 报告类型 1自检 2外检
				producedAddress: null, // 产地:1中山基地;2扬州基地;3吉林基地
				date: '', // 生产日期(yyyy-MM-dd)
				productNumber: '', // 批号
				status: 1, // 状态 0 禁用 1 启用
				sign: 0, // 标识 0:后台 1:LIMS
			},

			pickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
			},
			successsFileList: [],
			fileList: [],
			downOrViewDialog: {
				show: false,
				id: null,
				title: '',
				data: [],
				type: '',
				loading: false,
			},
		};
	},
	computed: {
		searchDate() {
			let { registrationTime, uploadTime } = this.searchConfig;
			let producedStartDate =
				registrationTime && registrationTime.length > 0 ? formatDateDefault(registrationTime[0]) : null;
			let producedEndDate =
				registrationTime && registrationTime.length > 0 ? formatDateDefault(registrationTime[1]) : null;
			let uploadStartTime = uploadTime && uploadTime.length > 0 ? formatDateDefault(uploadTime[0]) : null;
			let uploadEndTime = uploadTime && uploadTime.length > 0 ? formatDateDefault(uploadTime[1]) : null;
			return {
				producedStartDate,
				producedEndDate,
				uploadStartTime,
				uploadEndTime,
			};
		},
	},
	watch: {
		// ['searchConfig.reportType'](val) {
		// 	this.PRODUCT_RERORT_SEARCH.rules.productNumber[0].required = val === 1;
		// 	this.$refs.searchPanel.formEntity.clearValidate();
		// },
		['reportForm.reportType'](val) {
			if (val) {
				this.REPORT_FORM_RULE.productNumber[0].required = val === 1;
				this.REPORT_FORM_RULE.date[0].required = val === 1;

				this.$nextTick(() => {
					this.$refs.reportForm.clearValidate();
				});
			}
		},
	},
	methods: {
		// 大小不超过20M。
		beforeAvatarUpload(file) {
			return uploadFileType.call(this, file, ['pdf'], 20);
		},
		// 进度条
		progress(e) {
			if (e.percent == 100) {
				e.percent = 99;
			}
		},
		enclosureSuccess(res, file) {
			const {
				response: {
					datas: { relativePath },
				},
			} = file;
			let obj = {};
			obj = { name: file.name, fileUrlKey: relativePath.substr(1), reportName: file.name };
			this.successsFileList.push(obj);
		},
		// 移除上传
		enclosureRemove(file) {
			const { fileUrlKey } = file;
			this.successsFileList = this.successsFileList.filter(x => x.fileUrlKey != fileUrlKey);
			console.log(this.successsFileList);
		},
		close() {
			this.centerDialogVisible = false;
		},
		// 打开新增 / 编辑 成品报告
		openDialog(type, data = null, title = '新建成品报告') {
			this.reportDialog = {
				title,
				type,
				show: true,
			};
			if (data) {
				this.$nextTick(() => {
					this.reportForm = { ...data, date: formatDateDefault(data.producedDate), sign: 0 };
					if (type == 'copy') {
						this.reportForm.status = 1;
					}
					let reportName = data.reportName.split(':');
					let fileUrlKey = data.fileUrlKey.split(':');

					this.successsFileList = fileUrlKey.map((x, i) => ({
						name: reportName[i],
						fileUrlKey: x,
						reportName: reportName[i],
					}));
					this.fileList = this.successsFileList.map(x => ({ name: x.name, fileUrlKey: x.fileUrlKey }));
					if (type != 'edit') {
						this.successsFileList = [];
						this.fileList = [];
					}
				});
			}
			// this.REPORT_FORM_RULE.file[0].required = !data;
		},
		//  关闭 成品报告
		closeReportDialog() {
			this.successsFileList = [];
			this.fileList = [];
			this.$refs.reportForm.resetFields();

			this.reportDialog = {
				type: '',
				title: '',
				show: false,
			};
		},
		// 确认 成品报告
		enterReportDialog() {
			this.$refs.reportForm.validate(async valid => {
				if (valid) {
					if (!this.successsFileList.length) {
						return this.$message.error('请上传附件');
					}
					// 附件处理
					this.reportForm.fileUrlKey = this.successsFileList.map(x => x.fileUrlKey).join(':');
					this.reportForm.reportName = this.successsFileList.map(x => x.reportName).join(':');

					const { reportType, date, productNumber } = this.reportForm;
					// 外检的时候 时间跟批号 传空
					if (reportType == 2) {
						if (!date) {
							this.reportForm.date = '';
						}
						if (!productNumber) {
							this.reportForm.productNumber = '';
						}
					}

					// 编辑的时候进行时间判断
					if (this.reportDialog.type == 'edit') {
						if (new Date(this.reportForm.date) > this.reportForm.uploadTime) {
							return this.$message.error(
								`生产日期 不可超过 上传日期（${formatDateDefault(this.reportForm.uploadTime)}）`
							);
						}
					}

					//  检测是否 重复数据
					this.dialogLoading = true;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/store/productReportManage/getReportIds',
						timeout: 60000 * 5,
						data: this.reportForm,
					});
					if (res?.code == 200) {
						if (res.data.length) {
							this.$confirm('该成品报告已存在，请确认是否继续保存?', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning',
							}).then(async () => {
								this.addOrEdit();
							});
						} else {
							this.addOrEdit();
						}
					}
					this.dialogLoading = false;
					// ------------------------------------------------
				} else {
					return false;
				}
			});
		},
		// 调用添加 or 编辑
		async addOrEdit() {
			let formData = new FormData();
			for (const key in this.reportForm) {
				formData.append(key, this.reportForm[key]);
			}
			this.dialogLoading = true;
			const res = await this.$fetch({
				method: 'POST',
				url:
					this.reportDialog.type == 'edit'
						? `/mgmt/store/productReportManage/updateReport`
						: `/mgmt/store/productReportManage/uploadFile`,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				timeout: 60000 * 5,
				data: formData,
			});
			if (res?.code == 200) {
				this.$message.success(res.message);
				this.search();
				this.closeReportDialog();
			}
			this.dialogLoading = false;
		},
		// 获取产品数据
		async getProduct() {
			if (this.reportForm.productCode) {
				const res = await this.$fetch({
					method: 'POST',
					url: `/mgmt/product/item/searchProductLite`,
					data: {
						serialNo: this.reportForm.productCode,
						type: 1,
					},
				});
				if (res?.code == 200) {
					if (res.data.length) {
						const [{ title }] = res.data;
						this.reportForm.productName = title;
						this.$refs.reportForm.clearValidate('productName');
					} else {
						this.$message.error('请检查成品代码，需为已上架、待上架、已下架商品。');
						this.reportForm.productName = '';
					}
				} else if (res) {
					this.reportForm.productName = '';
					this.$message.error(res.message);
				}
			}
		},
		// 删除
		deleteDate({ id }) {
			this.$confirm('删除后不可恢复,请确认是否要删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch(`/mgmt/store/productReportManage/delete?id=${id}`);
				if (res?.code == 200) {
					this.$message.success(res.message);
					this.search();
				}
			});
		},
		// 分页触发事件
		handleChangePage(currentPage) {
			this.pagination.currentPage = currentPage;
			this.loadData();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.loadData();
		},
		// 搜索
		async search() {
			await this.getUploadNo();
			this.pagination.currentPage = 1;
			this.loadData();
		},
		statusBtn({ id, status }) {
			this.$confirm(`确认${status ? '禁用' : '启用'}？`)
				.then(async () => {
					const res = await this.$fetch({
						method: 'GET',
						url: `/mgmt/store/productReportManage/deal`,
						params: { id: id, status: status ? 0 : 1 },
					});
					if (res && res.code == 200) {
						this.$message.success('操作成功！');
						this.loadData();
					} else if (res) {
						this.$message.error(res.message);
					}
				})
				.catch(() => {});
		},
		async loadData() {
			let { currentPage: pageNum, pageSize } = this.pagination;
			let params = { ...this.searchDate, ...this.searchConfig, pageNum, pageSize };
			this.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/productReportManage/pageList`,
				data: params,
			});
			if (res && res.code == 200) {
				this.data = res.data ? res.data.list : [];
				this.pagination.total = res.data ? res.data.total : 0;
			}
			this.loading = false;
		},
		// 打开浏览
		openTableDialog({ id, reportName }, title, type) {
			this.downOrViewDialog = {
				title,
				show: true,
				type,
				id,
				data: reportName.split(':').map(x => ({ name: x })),
				loading: false,
			};
		},
		// 单个浏览
		async viewDetail(no) {
			this.downOrViewDialog.loading = true;
			let res = await this.$fetch({
				method: 'get',
				url: `/mgmt/store/productReportManage/fileToLookAndDown?id=${this.downOrViewDialog.id}&no=${no}&type=1`, // 请求地址
				responseType: 'blob', //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
				timeout: 60000 * 10,
			});
			if (res.status == 200) {
				this.url = '';
				this.url = pdf.createLoadingTask({
					url: getObjectURL(res.data),
					//引入pdf.js字体，templ  解决水印字体不显示
					cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.5.207/cmaps/',
					cMapPacked: true,
				});
				// this.url = pdf.createLoadingTask(getObjectURL(res.data));
				this.url.promise.then(pdf => {
					this.numPages = pdf.numPages;
				});
				this.centerDialogVisible = true;
			} else {
				this.$message.error('预览失败!');
			}
			this.downOrViewDialog.loading = false;
		},
		// 单个下载
		async downloadBtn(no) {
			exportExcel(
				`/mgmt/store/productReportManage/fileToLookAndDown`,
				{ id: this.downOrViewDialog.id, no, type: 2 },
				'下载成品报告PDF'
			);
		},
		// 获取工号
		async getUploadNo() {
			const res = await this.$fetch(`/mgmt/store/productReportManage/getGongHao`);
			if (res?.code == 200) {
				this.uploadNo = res.data;
			}
		},
	},
	async created() {
		await this.getUploadNo();
	},
};
</script>
<style lang="scss" scoped>
.marginT20 {
	margin-top: 20px;
}
.main-dialog {
	overflow: hidden;
	border-left: 1px solid $color-border;
	border-top: 1px solid $color-border;
	.main-child {
		box-sizing: border-box;
		float: left;
		width: 25%;
		height: 40px;
		padding-left: 10px;
		line-height: 40px;
		color: #333333;
		border-right: 1px solid $color-border;
		border-bottom: 1px solid $color-border;
		.requied {
			color: red;
		}
	}
	.dl {
		padding-left: 0;
	}
}
::v-deep .el-dialog__wrapper {
	overflow: auto;
}
::v-deep.el-select {
	width: 100%;
}
::v-deep.el-date-editor.el-input {
	width: 100%;
}
.is-upload ::v-deep .el-upload--picture-card {
	display: none; /* 上传按钮隐藏 */
}
</style>
