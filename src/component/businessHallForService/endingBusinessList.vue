<template>
	<div>
		<guideBar />
		<el-card>
			<searchPanel v-model="searchConfig" :config="ENDING_BUSSINESS_SEARCH" @search="search" />
		</el-card>
		<el-card>
			<tableList
				:options="options"
				:loading="loading"
				:dataSource="data"
				:columns="ENDING_BUSSINESS_SEARCH_COLUMNS"
				:pagination="pagination"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				:dataTotal="pagination.total"
				slotcontent
			>
				<template slot-scope="scope">
					<span v-permission="'ending_business_list_detail|ending_business_detail'">
						<el-button type="text" class="btn" @click="viewDetail(scope.data)">详情</el-button>
					</span>
					<span v-permission="'ending_business_list_revoke'">
						<el-button
							class="btn"
							v-if="scope.data.auditStatus === 2 || scope.data.auditStatus === 1"
							type="text"
							@click="revoke(scope.data)"
						>
							撤销申请
						</el-button>
					</span>
					<span v-permission="'ending_business_list_complete'">
						<el-button class="btn" v-if="scope.data.auditStatus === 2" type="text" @click="complete(scope.data)">
							完成结业
						</el-button>
					</span>
					<span v-permission="'ending_business_list_stop_accept'">
						<el-button class="btn" v-if="scope.data.auditStatus === 7" type="text" @click="stopAccept(scope.data)">
							撤销受理
						</el-button>
					</span>
					<span v-permission="'ending_business_list_out_accept'">
						<el-button class="btn" v-if="scope.data.auditStatus === 6" type="text" @click="outAccept(scope.data)">
							完成受理
						</el-button>
					</span>
				</template>
			</tableList>
		</el-card>

		<el-dialog title="完成结业" v-drag :visible.sync="dialogVisible" width="50%">
			<el-form label-width="140px">
				<el-form-item label="装修拆除照片">
					<el-upload
						:class="[imglist.length == 4 ? 'business' : '']"
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						list-type="picture-card"
						:on-success="handlePictureCardSuccess"
						:on-remove="beforeRemove"
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

		<el-dialog :title="title" :visible.sync="centerDialogVisible" width="40%" :before-close="close">
			<div>
				<el-form label-width="100px" :model="ruleForm" :rules="rules" ref="ruleForm2" class="demo-ruleForm">
					<el-form-item label="审批结果：" prop="verifyStatus">
						<el-select v-model="ruleForm.verifyStatus" placeholder="请选择">
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

		<el-dialog :visible.sync="showImg">
			<img width="100%" :src="dialogImageUrl" alt="" />
		</el-dialog>

		<el-dialog title="撤销原因" :visible.sync="revokeDialogVisible" width="720px">
			<el-form>
				<el-form-item>
					<el-input
						type="textarea"
						:autosize="{ minRows: 7 }"
						show-word-limit
						maxlength="200"
						v-model="cancelApplication"
						placeholder="请输入申请原因"
					/>
				</el-form-item>
				<div v-if="auditStatus === 2">
					<el-form-item label="撤销申请书："></el-form-item>
					<el-form-item label="">
						<el-upload
							:class="[revokeList.length == 4 ? 'revoke' : '']"
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							list-type="picture-card"
							:on-success="handleRevokeSuccess"
							:on-remove="revokeRemove"
							:limit="4"
							multiple
							:before-upload="beforeVideoUpload"
							:on-preview="imgPreview"
						>
							<i class="el-icon-plus"></i>
						</el-upload>
					</el-form-item>
					<el-form-item label="">
						<span>只能支持上传4张图片格式支持bmp，jpg，png，tif大小不能超过10M</span>
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="revokeDialogVisible = false">取 消</el-button>
				<el-button type="primary" :loading="isRevoke" @click="revokeSave">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { ENDING_BUSSINESS_SEARCH, ENDING_BUSSINESS_SEARCH_COLUMNS } from './config';
import { uploadFileType } from 'util/formValidation';
export default {
	name: 'endingBusinessList',
	data() {
		return {
			cancelApplication: '',
			revokeList: [],
			isRevoke: false,
			revokeDialogVisible: false,
			title: '完成结业受理审批',
			option: [
				{ value: 2, label: '审核通过' },
				{ value: 3, label: '审核驳回' },
			],
			isAddMsg: false,
			centerDialogVisible: false,
			rules: {
				verifyStatus: [{ required: true, message: '请选择', trigger: 'blur' }],
				auditOpinion: [{ required: false, message: '请输入意见', trigger: 'blur' }],
			},
			ruleForm: {
				verifyStatus: 2,
				auditOpinion: '',
				id: null,
			},
			itemId: null,
			showImg: false,
			dialogVisible: false,
			dialogImageUrl: '',
			ENDING_BUSSINESS_SEARCH,
			ENDING_BUSSINESS_SEARCH_COLUMNS,
			searchConfig: {
				companyName: '',
				storeCode: '',
				verifyStatus: '',
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
				pageSize: 20,
				total: 0,
			},
			imglist: [],
			auditStatus: null,
		};
	},
	created() {
		this.$listen('JIEYESHENPI_LIST', this.loadData);
		this.loadData();
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			};
			return params;
		},
	},
	methods: {
		resetFrom() {
			this.ruleForm.auditOpinion = '';
			this.ruleForm.verifyStatus = 2;
		},
		imgPreview(file) {
			this.dialogImageUrl = file.url;
			this.showImg = true;
		},
		async cancle() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/graduation/cancle`,
				data: {
					id: this.ruleForm.id,
					decoratePic: this.revokeList.map(e => e.urls).join(','),
					port: 0,
					cancelApplication: this.cancelApplication,
				},
			});
			if (res.code === 200) {
				this.loadData();
			}
			this.revokeDialogVisible = false;
		},
		revokeSave() {
			this.cancle();
		},
		async revoke({ id }) {
			this.ruleForm.id = id;
			this.cancelApplication = '';
			this.revokeList = [];
			const res = await this.$fetch(`/mgmt/store/graduation/queryGraduationInfoById?id=` + id);
			if (res && (res.data.auditStatus == 1 || res.data.auditStatus == 2)) {
				this.revokeDialogVisible = true;
				this.auditStatus = res.data.moveVO.auditStatus;
			} else {
				this.$message.warning('操作已更新');
				this.loadData();
			}
		},
		handleRevokeSuccess(res, file) {
			if (res.success) this.revokeList.push({ fileName: file.name, urls: res.datas.fileUrlKey });
		},
		revokeRemove(res) {
			this.revokeList.forEach((e, index) => {
				if (e.fileName === res.name) this.savelist.splice(index, 1);
			});
		},
		addMsg() {
			this.dealGraduationApply();
		},
		async dealGraduationApply() {
			this.isAddMsg = true;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/graduation/dealGraduationApply`,
				data: this.ruleForm,
			});
			if (res && res.code == 200) {
				this.loadData();
			}
			this.isAddMsg = false;
			this.centerDialogVisible = false;
		},
		close() {
			this.centerDialogVisible = false;
		},
		beforeVideoUpload(file) {
			const whiteList = ['bmp', 'png', 'jpg', 'tif'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		async save() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/graduation/completeGraduationById`,
				data: { id: this.itemId, decoratePic: this.imglist.map(e => e.urls).join(','), port: 0 },
			});
			if (res && res.code === 200) {
				this.$message.success(res.message);
				this.loadData();
				this.dialogVisible = false;
			} else if (res) {
				this.$message.error(res.data.message);
				this.loadData();
			}
		},
		beforeRemove(res) {
			this.imglist.forEach((e, index) => {
				if (e.fileName === res.name) this.imglist.splice(index, 1);
			});
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.showImg = true;
		},
		handlePictureCardSuccess(res, file) {
			if (res.success) this.imglist.push({ fileName: file.name, urls: res.datas.fileUrlKey });
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
		async loadData() {
			let { currentPage: pageNum, pageSize } = this.pagination;
			let params = { ...this.searchConfig, pageNum, pageSize };
			this.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/graduation/queryGraduationList`,
				data: params,
			});
			if (res && res.code == 200) {
				this.data = res.data ? res.data.list : [];
				this.pagination.total = res.data ? res.data.total : 0;
			}
			this.loading = false;
		},
		viewDetail({ id, storeCode }) {
			this.$go('ending_business_detail', { id, storeCode });
		},
		complete({ id }) {
			this.loadHandle(2, id, () => {
				this.itemId = id;
				this.dialogVisible = true;
				this.imglist = [];
			});
		},
		async loadHandle(auditStatus, id, callback) {
			const res = await this.$fetch(`/mgmt/store/graduation/queryGraduationInfoById?id=${id}`);
			if (res && res.data.auditStatus == auditStatus) {
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
				this.title = '完成结业受理审批';
				this.centerDialogVisible = true;
				this.ruleForm.id = id;
				this.resetFrom();
			});
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
.business ::v-deep .el-upload--picture-card {
	display: none;
}
.btn {
	margin-right: 10px;
}
</style>
