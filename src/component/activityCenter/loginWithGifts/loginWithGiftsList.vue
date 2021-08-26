<template>
	<div>
		<guideBar>
			<el-button
				v-permission="'login_gifts_list_exportExcel'"
				type="success"
				icon="el-icon-download"
				plain
				@click="exportExcel"
			>
				导出
			</el-button>
			<el-button v-permission="'login_with_gifts_add'" type="primary" @click="addActivity">新建登录有礼活动</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="LOGIN_WITH_GIFTS_LIST_SEARCH" @search="handleSearch" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeName">
				<el-tab-pane :label="label" :name="name" :key="name" v-for="(label, name) in LOGIN_WITH_GIFTS_TAB_PANES">
					<tableList
						:dataSource="tabPanes[activeName].data"
						:columns="LOGIN_WITH_GIFTS_LIST_COLUMNS"
						:pagination="tabPanes[activeName].pagination"
						:dataTotal="tabPanes[activeName].total"
						:loading="tabPanes[activeName].loading"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-row type="flex" justify="center" class="button-group">
								<el-button v-permission="'login_with_gifts_detail'" type="text" @click="toDetail(scope.data)">
									详情
								</el-button>
								<div v-permission="'login_gifts_list_edit'">
									<el-button v-if="[1, 4, 5].includes(scope.data.status)" type="text" @click="toEdit(scope.data)">
										编辑
									</el-button>
								</div>
								<div v-permission="'login_gifts_list_stop'">
									<el-button v-if="scope.data.status == 2" type="text" @click="toStop(scope.data)">停止</el-button>
								</div>
								<div v-permission="'login_gifts_list_audit'">
									<el-button v-if="scope.data.status == 1" type="text" @click="toAudit(scope.data)">审核</el-button>
								</div>
								<div v-permission="'login_gifts_list_resubmit'">
									<el-button v-if="scope.data.status == 4" type="text" @click="resubmit(scope.data)">
										再次提交
									</el-button>
								</div>
							</el-row>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 审核弹窗 -->
		<el-dialog v-drag title="活动审核" :visible.sync="auditVisible" width="700px">
			<el-form
				ref="auditForm"
				:model="auditForm"
				:rules="LOGIN_GIFTS_LIST_AUDIT_FORM_RULES"
				label-suffix=":"
				label-width="100px"
			>
				<el-row>
					<!-- <el-col :span="12">
						<el-form-item label="活动编号">{{ auditForm.number }}</el-form-item>
					</el-col> -->
					<el-col :span="12">
						<el-form-item label="活动名称">{{ auditForm.activityName }}</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="审核结果" prop="examine">
					<el-radio-group v-model="auditForm.examine">
						<el-radio :label="3">审核通过</el-radio>
						<el-radio :label="4">审核不通过</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="审核意见" prop="remarks">
					<el-input type="textarea" v-model="auditForm.remarks" placeholder="请输入审核意见"></el-input>
				</el-form-item>
				<el-form-item label="附件" prop="attachments">
					<div>支持格式doc、docx、pdf、wps、bmp、jpg、png，最大10M，3个文件</div>
					<el-upload
						ref="upload-demo"
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemove"
						:on-success="handleSuccess"
						:before-upload="beforeVideoUpload"
						:class="auditForm.attachments.length == 3 ? 'hide_box' : ''"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="end">
				<el-button @click="auditCancel('auditForm')">取消</el-button>
				<el-button type="primary" @click="auditSave('auditForm')">保存</el-button>
			</el-row>
		</el-dialog>
		<!-- 图片预览 -->
		<el-dialog :visible.sync="dialogVisible">
			<img width="100%" :src="dialogImageUrl" alt="" />
		</el-dialog>
	</div>
</template>

<script>
import {
	LOGIN_WITH_GIFTS_LIST_SEARCH,
	LOGIN_WITH_GIFTS_TAB_PANES,
	LOGIN_WITH_GIFTS_TAB_VALUE,
	LOGIN_WITH_GIFTS_LIST_COLUMNS,
	LOGIN_GIFTS_LIST_AUDIT_FORM_RULES,
} from './config';
import qs from 'querystring';
import { formatDateDefault, uploadFileType } from 'util/formValidation';
import { exportExcel } from 'util';
export default {
	name: 'loginWithGiftsList',
	data() {
		let tabPanes = {};
		Object.keys(LOGIN_WITH_GIFTS_TAB_PANES).map(item => {
			tabPanes[item] = {
				loading: false,
				pagination: { currentPage: 1, pageSize: 10 },
				total: 0,
				data: [],
			};
		});
		return {
			LOGIN_WITH_GIFTS_LIST_SEARCH,
			LOGIN_WITH_GIFTS_TAB_PANES,
			LOGIN_WITH_GIFTS_LIST_COLUMNS,
			LOGIN_GIFTS_LIST_AUDIT_FORM_RULES,
			searchConfig: {},
			activeName: 'all',
			tabPanes,
			auditVisible: false, // 审核弹窗状态
			auditForm: {
				attachments: [],
			}, //审核form
			dialogVisible: false, // 图片预览弹窗状态
			dialogImageUrl: '', // 图片预览地址
		};
	},
	watch: {
		activeName: {
			immediate: true,
			handler() {
				this.loadData();
			},
		},
	},
	computed: {
		loadDataPost() {
			const { searchConfig, activeName, tabPanes } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = tabPanes[activeName];
			let data = {
				...searchConfig,
				status: LOGIN_WITH_GIFTS_TAB_VALUE[activeName] || null,
				pageNum,
				pageSize,
			};
			if (data.createTime) {
				data.createTimeStart = data.createTime[0] ? formatDateDefault(data.createTime[0]) : null;
				data.createTimeEnd = data.createTime[1] ? formatDateDefault(data.createTime[1]) : null;
				delete data.createTime;
			}
			if (data.time) {
				data.startTime = data.time[0] ? formatDateDefault(data.time[0]) : null;
				data.endTime = data.time[1] ? formatDateDefault(data.time[1]) : null;
				delete data.time;
			}
			return data;
		},
		// 上传data
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			};
			return params;
		},
	},
	methods: {
		// 图片上传验证
		beforeVideoUpload(file) {
			const whiteList = ['doc', 'docx', 'pdf', 'wps', 'bmp', 'jpg', 'png'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		// 导出
		exportExcel() {
			exportExcel('/mgmt/prmt/loginGift/exportLoginGift', this.loadDataPost);
		},
		// 新建登录有礼活动
		addActivity() {
			this.$go('login_with_gifts_add');
		},
		// 搜索
		handleSearch() {
			this.tabPanes[this.activeName].pagination.currentPage = 1;
			this.loadData();
		},
		// 翻页
		handleChangePage(page) {
			this.tabPanes[this.activeName].pagination.currentPage = page;
			this.loadData();
		},
		handleSizeChange(pageSize) {
			this.tabPanes[this.activeName].pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 图片预览
		handlePictureCardPreview(file) {
			this.dialogVisible = true;
			this.dialogImageUrl = file.url;
		},
		// 图片删除
		handleRemove(file) {
			const { name } = file;
			this.auditForm.attachments = this.auditForm.attachments.filter(({ fileName }) => fileName != name);
		},
		// 图片上传成功
		handleSuccess(response, file, fileList) {
			this.auditForm.attachments = fileList.map(item => {
				return {
					fileName: item?.name,
					url: item?.response?.datas?.fileUrlKey,
				};
			});
		},
		// 详情
		toDetail(row) {
			const { id } = row;
			this.$go('login_with_gifts_detail', { id });
		},
		// 编辑
		toEdit(row) {
			const { id } = row;
			this.$go('login_with_gifts_edit', { id });
		},
		// 停止
		toStop(row) {
			this.$confirm('是否确认停止该活动', '提示')
				.then(async () => {
					const { id } = row;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/prmt/loginGift/stopLoginGift',
						data: { id },
					});
					if (res && res.code == 200) {
						this.$message.success('操作成功');
						this.loadData();
					} else {
						this.$message.error('操作失败');
					}
				})
				.catch(() => {});
		},
		// 审核
		toAudit(row) {
			const { id, activityName } = row;
			this.auditVisible = true;
			this.auditForm = { ...this.auditForm, id, activityName, isEdit: false };
		},
		// 再次提交
		resubmit(row) {
			this.$confirm('是否再次提交该活动', '提示')
				.then(async () => {
					const { id } = row;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/prmt/loginGift/resubmitLoginGift',
						data: { id },
					});
					if (res && res.code == 200) {
						this.$message.success('操作成功');
						this.loadData();
					} else {
						this.$message.error('操作失败');
					}
				})
				.catch(() => {});
		},
		// 审核 取消
		auditCancel(formName) {
			this.$refs[formName].resetFields();
			this.$refs['upload-demo'].clearFiles();
			this.auditVisible = false;
		},
		// 审核 保存
		auditSave(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/prmt/loginGift/examineLoginGift',
						data: this.auditForm,
					});
					if (res && res.code == 200) {
						this.$message.success('操作成功');
						this.loadData();
						this.auditCancel(formName);
					} else {
						this.$message.error('操作失败');
					}
				}
			});
		},
		// 获取列表数据
		async loadData() {
			const { activeName } = this;
			this.tabPanes[activeName].loading = true;
			const res = await this.$fetch({
				url: `/mgmt/prmt/loginGift/getLoginGiftPage?${qs.stringify(this.loadDataPost)}`,
				callback: () => {
					this.tabPanes[activeName].loading = false;
				},
			});
			if (res && res.code == 200 && res.data) {
				const { list, total } = res.data;
				this.tabPanes[activeName].data = list;
				this.tabPanes[activeName].total = total;
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
	},
	mounted() {
		this.$listen('UPDATE_LOGIN_WITH_GIFTS_LIST', this.loadData);
	},
};
</script>

<style lang="scss" scoped>
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
::v-deep.button-group {
	.el-button {
		margin-left: 10px;
	}
}
</style>