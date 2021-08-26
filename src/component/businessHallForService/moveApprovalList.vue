<template>
	<div>
		<guideBar>
			<el-button
				v-permission="'move_approval_list_batch_export'"
				type="primary"
				@click="loadData(1)"
				icon="el-icon-document-copy"
			>
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="MOVE_APPROVAL_SEARCH" @search="search" />
		</el-card>
		<el-card>
			<tableList
				:options="options"
				:loading="loading"
				:dataSource="data"
				:columns="MOVE_APPROVAL_COLUMNS"
				:pagination="pagination"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				:dataTotal="pagination.total"
				slotcontent
			>
				<template slot-scope="scope">
					<span v-permission="'move_approval_list_detail|move_approval_detail'" class="btn">
						<el-button type="text" @click="viewDetail(scope.data)">查看详情</el-button>
					</span>
					<span v-permission="'move_approval_list_revoke'">
						<el-button
							class="btn"
							v-if="scope.data.auditStatus === 3 || scope.data.auditStatus === 1"
							type="text"
							@click="revoke(scope.data)"
						>
							撤销申请
						</el-button>
					</span>
					<span v-permission="'move_approval_list_out_move'">
						<el-button class="btn" v-if="scope.data.auditStatus === 1" type="text" @click="complete(scope.data)">
							完成搬迁
						</el-button>
					</span>
					<span v-permission="'move_approval_list_stop_accept'">
						<el-button class="btn" type="text" v-if="scope.data.auditStatus === 7" @click="stopAccept(scope.data)">
							撤销受理
						</el-button>
					</span>
					<span v-permission="'move_approval_list_out_accept'">
						<el-button class="btn" type="text" v-if="scope.data.auditStatus === 6" @click="outAccept(scope.data)">
							完成受理
						</el-button>
					</span>
				</template>
			</tableList>
		</el-card>

		<el-dialog title="撤销原因" :visible.sync="revokeDialogVisible" width="720px">
			<el-form>
				<el-form-item>
					<el-input
						type="textarea"
						:autosize="{ minRows: 7 }"
						show-word-limit
						maxlength="200"
						v-model="cancelReason"
						placeholder="请输入申请原因"
					/>
				</el-form-item>
				<div v-if="auditStatus == 1">
					<el-form-item label="撤销申请书："></el-form-item>
					<el-form-item label="">
						<el-upload
							:class="[revokeList.length == 4 ? 'revoke' : '']"
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							list-type="picture-card"
							class="graduation"
							:on-success="handleRevokeSuccess"
							:on-remove="revokeRemove"
							:limit="4"
							multiple
							:before-upload="beforeVideoUpload"
						>
							<i class="el-icon-plus"></i>
						</el-upload>
					</el-form-item>
					<el-form-item label="" prop="examine">
						<span>只能支持上传4张图片格式支持bmp，jpg，png，tif大小不能超过10M</span>
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="revokeDialogVisible = false">取 消</el-button>
				<el-button type="primary" :loading="isRevoke" @click="revokeSave">确 定</el-button>
			</span>
		</el-dialog>

		<el-dialog title="完成搬迁" v-drag :visible.sync="dialogVisible" width="720px">
			<el-form>
				<el-form-item label="旧门店拆除照片"></el-form-item>
				<el-form-item label="">
					<el-upload
						:class="[imglist.length == 2 ? 'old' : '']"
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						list-type="picture-card"
						:on-success="handlePictureCardSuccessold"
						:on-remove="beforeRemove"
						:limit="4"
						multiple
						:before-upload="beforeVideoUpload"
						:on-preview="imgPreview"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="新门店装修照片"></el-form-item>
				<el-form-item label="">
					<el-upload
						:class="[imglistnew.length == 4 ? 'new' : '']"
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						list-type="picture-card"
						:on-success="handlePictureCardSuccessnew"
						:on-remove="beforeRemovenew"
						:limit="4"
						multiple
						:before-upload="beforeVideoUpload"
						:on-preview="imgPreview"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="" prop="examine">
					<span>只能支持上传4张图片格式支持bmp，jpg，png，tif大小不能超过10M</span>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="save">确 定</el-button>
			</span>
		</el-dialog>

		<el-dialog :visible.sync="showImg">
			<img width="100%" :src="dialogImageUrl" alt="" />
		</el-dialog>

		<el-dialog :title="title" :visible.sync="centerDialogVisible" width="40%" :before-close="close">
			<div>
				<el-form label-width="100px" :model="ruleForm" :rules="rules" ref="ruleForm2" class="demo-ruleForm">
					<el-form-item label="审批结果：" prop="auditStatus">
						<el-select v-model="ruleForm.auditStatus" placeholder="请选择">
							<el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审批意见：" prop="auditOpinion">
						<el-input
							type="textarea"
							:autosize="{ minRows: 7 }"
							show-word-limit
							maxlength="200"
							v-model="ruleForm.auditOpinion"
							placeholder="请填写意见"
						/>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="close">取消</el-button>
				<el-button type="primary" :loading="isAddMsg" @click="addMsg">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { MOVE_APPROVAL_SEARCH, MOVE_APPROVAL_COLUMNS } from './config';
import { genCurrentMonthFirstAndLastDay, exportExcel } from 'util';
import { formatDateDefault, uploadFileType } from 'util/formValidation.js';
export default {
	name: 'moveApprovalList',
	data() {
		return {
			title: '完成搬迁受理审批',
			option: [
				{ value: 1, label: '审核通过' },
				{ value: 2, label: '审核驳回' },
			],
			isAddMsg: false,
			centerDialogVisible: false,
			rules: {
				verifyStatus: [{ required: false, message: '请选择', trigger: 'change' }],
				auditOpinion: [{ required: false, message: '请输入意见', trigger: 'blur' }],
			},
			dialogVisible: false,
			cancelReason: '',
			revokeList: [],
			isRevoke: false,
			revokeDialogVisible: false,
			ruleForm: {
				auditStatus: 1,
				auditOpinion: '',
				id: null,
			},
			MOVE_APPROVAL_SEARCH,
			MOVE_APPROVAL_COLUMNS,
			searchConfig: {
				companyName: '',
				storeCodeOrName: '',
				verifyStatus: '',
				registrationTime: genCurrentMonthFirstAndLastDay(),
			},
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			data: [],
			loading: false,
			pagination: {
				currentPage: 1,
				pageSize: 10,
				total: 0,
			},
			imglist: [],
			dialogImageUrl: '',
			showImg: false,
			imglistnew: [],
			auditStatus: null,
		};
	},
	created() {
		this.loadData();
		this.$listen('BANQIANSHENPI_LIST', this.loadData);
	},
	computed: {
		searchDate() {
			let { registrationTime, companyName, storeCodeOrName, verifyStatus } = this.searchConfig;
			let startTime = registrationTime && registrationTime.length > 0 ? formatDateDefault(registrationTime[0]) : null;
			let endTime = registrationTime && registrationTime.length > 0 ? formatDateDefault(registrationTime[1]) : null;
			return { companyName, storeCodeOrName, verifyStatus, startTime, endTime };
		},
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			};
			return params;
		},
	},
	methods: {
		close() {
			this.centerDialogVisible = false;
		},
		resetFrom() {
			this.ruleForm.auditOpinion = '';
			this.ruleForm.auditStatus = 1;
		},
		async dealMoveApply() {
			this.isAddMsg = true;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/move/dealMoveApply`,
				data: this.ruleForm,
			});
			if (res && res.code == 200) {
				this.loadData();
			}
			this.isAddMsg = false;
			this.centerDialogVisible = false;
		},
		addMsg() {
			this.dealMoveApply();
		},
		async loadHandle(auditStatus, id, callback) {
			const res = await this.$fetch(`/mgmt/store/move/getStoreMoveApply?id=${id}`);
			if (res && res.data.moveVO.auditStatus == auditStatus) {
				callback && callback();
			} else {
				this.$message.warning('操作已更新');
				this.loadData();
			}
		},
		stopAccept({ id }) {
			this.loadHandle(7, id, () => {
				this.title = '撤销申请受理审批';
				this.centerDialogVisible = true;
				this.ruleForm.id = id;
				this.resetFrom();
			});
		},
		outAccept({ id }) {
			this.loadHandle(6, id, () => {
				this.title = '完成搬迁受理审批';
				this.centerDialogVisible = true;
				this.ruleForm.id = id;
				this.resetFrom();
			});
		},
		beforeRemovenew(res) {
			this.imglistnew.forEach((e, index) => {
				if (e.fileName === res.name) this.imglistnew.splice(index, 1);
			});
		},
		handlePictureCardSuccessnew(res, file) {
			if (res.success) this.imglistnew.push({ fileName: file.name, urls: res.datas.fileUrlKey });
		},
		complete({ id }) {
			this.loadHandle(1, id, () => {
				this.ruleForm.id = id;
				this.dialogVisible = true;
				this.imglistnew = [];
				this.imglist = [];
			});
		},
		async save() {
			let newPic = this.imglistnew.map(e => e.urls);
			let oldPic = this.imglist.map(e => e.urls);
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/move/finishStoreMoveApply`,
				data: { id: this.ruleForm.id, newPic, oldPic, port: 0 },
			});
			if (res.code === 200) {
				this.$message.success(res.message);
				this.loadData();
			} else if (res) {
				this.$message.error(res.data.message);
				this.loadData();
			}
			this.dialogVisible = false;
		},
		imgPreview(file) {
			this.dialogImageUrl = file.url;
			this.showImg = true;
		},
		beforeRemove(res) {
			this.imglist.forEach((e, index) => {
				if (e.fileName === res.name) this.imglist.splice(index, 1);
			});
		},
		handlePictureCardSuccessold(res, file) {
			if (res.success) this.imglist.push({ fileName: file.name, urls: res.datas.fileUrlKey });
		},
		async revoke({ id }) {
			this.ruleForm.id = id;
			this.cancelReason = '';
			this.revokeList = [];
			const res = await this.$fetch(`/mgmt/store/move/getStoreMoveApply?id=` + id);
			if (res && (res.data.moveVO.auditStatus == 1 || res.data.moveVO.auditStatus == 3)) {
				this.revokeDialogVisible = true;
				this.auditStatus = res.data.moveVO.auditStatus;
			} else {
				this.$message.warning('操作已更新');
				this.loadData();
			}
		},
		async cancleStoreMoveApply() {
			this.isRevoke = true;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/move/cancleStoreMoveApply`,
				data: {
					id: this.ruleForm.id,
					cancelApplication: this.revokeList,
					port: 0,
					cancelReason: this.cancelReason,
				},
			});
			if (res && res.code === 200) {
				this.loadData();
			} else if (res) {
				this.$message.error(res.data.message);
				this.loadData();
			}
			this.revokeDialogVisible = false;
			this.isRevoke = false;
		},
		revokeSave() {
			this.cancleStoreMoveApply();
		},
		beforeVideoUpload(file) {
			const whiteList = ['bmp', 'png', 'jpg', 'tif'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		handleRevokeSuccess(res, file) {
			if (res.success) this.revokeList.push({ fileName: file.name, urls: res.datas.fileUrlKey });
		},
		revokeRemove(res) {
			this.revokeList.forEach((e, index) => {
				if (e.fileName === res.name) this.savelist.splice(index, 1);
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
		search() {
			this.pagination.currentPage = 1;
			this.loadData();
		},
		async loadData(status) {
			let { currentPage: pageNum, pageSize } = this.pagination;
			let params = { ...this.searchDate, pageNum, pageSize };
			if (status) {
				if (this.data.length === 0) return this.$message.wraning('请搜索有效的数据导出');
				return exportExcel('/mgmt/store/move/exportStoreMoveInfoList', params);
			}
			this.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/move/queryStoreMoveList`,
				data: params,
			});
			if (res && res.code == 200) {
				this.data = res.data ? res.data.list : [];
				this.pagination.total = res.data ? res.data.total : 0;
			}
			this.loading = false;
		},
		viewDetail({ id, storeCode }) {
			this.$go('move_approval_detail', { id, storeCode });
		},
	},
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__wrapper {
	overflow: auto;
}
.revoke ::v-deep .el-upload--picture-card {
	display: none;
}
.old ::v-deep .el-upload--picture-card {
	display: none;
}
.new ::v-deep .el-upload--picture-card {
	display: none;
}

.btn {
	margin-right: 10px;
}
</style>
