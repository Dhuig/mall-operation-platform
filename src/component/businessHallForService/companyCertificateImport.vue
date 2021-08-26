<template>
	<div>
		<guideBar />
		<el-card v-if="step === 1">
			<el-form label-width="100px" class="demo-ruleForm">
				<el-form-item label="申请证件" required>
					<el-button type="primary" @click="dailog">选择证件</el-button>
				</el-form-item>
				<el-form-item label="">
					<tableList
						:options="options"
						:loading="loading"
						:dataSource="data"
						:columns="COMPANY_CERTIFICATE_IMPORT_COLUMNS"
						:pagination="pagination"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						:dataTotal="pagination.total"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button type="text" @click="del(scope.data)">删除</el-button>
						</template>
					</tableList>
				</el-form-item>
			</el-form>
			<el-dialog title="选择证件" :visible.sync="dialogTableVisible" width="60%" v-drag :before-close="close">
				<searchPanel v-model="searchConfig" :config="COMPANY_CERTIFICATE_IMPORT_CONFIG" @search="handleSearch" />
				<tableList
					ref="tablelist"
					:options="dialogOptions"
					:loading="dialogLoading"
					:dataSource="dialogData"
					:columns="COMPANY_CERTIFICATE_IMPORT_COLUMNS"
					:pagination="dialogPagination"
					@handleChangePage="dialogChangePage"
					@handleSizeChange="dialogSizeChange"
					@handleSelectionChange="handleSelectionChange"
					:dataTotal="dialogPagination.total"
				></tableList>
				<span slot="footer" class="operate-bottom">
					<span>
						<el-button @click.stop="close">取 消</el-button>
						<el-button type="primary" @click.stop="saveCerti">保存</el-button>
					</span>
				</span>
			</el-dialog>
		</el-card>
		<el-card v-else>
			<el-form label-width="100px" class="demo-ruleForm">
				<el-form-item label="申请原因" required>
					<span>批量导入</span>
				</el-form-item>
				<el-form-item label="申请证件" required>
					<el-upload
						class="upload-demo"
						style="display: inline-block; margin-right: 10px"
						:on-error="onError"
						:action="url + '/mgmt/sys/store/certificate/upload/apply/pending'"
						:headers="$store.getters['system/getSignatureVerification']"
						name="file"
						:show-file-list="false"
						:on-success="handleSuccess"
						accept="xls,xlsx"
						:before-upload="beforeVideoUpload"
					>
						<el-button type="primary">批量导入</el-button>
					</el-upload>
					<el-button type="text" @click="getExcel">下载模板</el-button>
					<el-input
						type="text"
						class="input-text"
						v-model="storeCode"
						@blur="stepSearch"
						placeholder="输入服务中心搜索"
					/>
				</el-form-item>
				<el-form-item label="">
					<tableList
						:options="stepOptions"
						:dataSource="stepData"
						:columns="COMPANY_CERTIFICATE_IMPORT_COLUMNS_DAORU"
						:pagination="stepPagination"
						:loading="stepLoading"
						@handleChangePage="stepChangePage"
						@handleSizeChange="stepSizeChange"
						:dataTotal="stepPagination.total"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button type="text" @click="stepDel(scope.data)">删除</el-button>
						</template>
					</tableList>
				</el-form-item>
			</el-form>
		</el-card>
		<actionBar>
			<template>
				<el-button @click="$closeSelf()">关 闭</el-button>
				<el-button type="primary" @click="stepBtn(step)">{{ step === 1 ? '下一步' : '上一步' }}</el-button>
				<el-button type="primary" @click="submitBtn" v-if="step === 2">提 交</el-button>
			</template>
		</actionBar>
	</div>
</template>

<script>
import {
	COMPANY_CERTIFICATE_IMPORT_COLUMNS,
	COMPANY_CERTIFICATE_IMPORT_CONFIG,
	COMPANY_CERTIFICATE_IMPORT_COLUMNS_DAORU,
} from './config';
import axios from 'axios';
import { uploadFileType } from 'util/formValidation';
import { exportExcel } from 'util';
export default {
	name: 'companyCertificateImport',
	data() {
		return {
			url: axios.defaults.baseURL,
			step: 1,
			storeCode: '',
			stepData: [],
			stepLoading: false,
			stepPagination: {
				currentPage: 1,
				pageSize: 10,
				total: 0,
			},
			COMPANY_CERTIFICATE_IMPORT_COLUMNS_DAORU,
			stepOptions: {
				label: '全部',
				index: true,
				labelIndex: '序号',
			},
			dialogData: [],
			relativeList: [],
			temporary: [],
			dialogLoading: true,
			dialogPagination: {
				currentPage: 1,
				pageSize: 10,
				total: 0,
			},
			dialogTableVisible: false,
			COMPANY_CERTIFICATE_IMPORT_COLUMNS,
			COMPANY_CERTIFICATE_IMPORT_CONFIG,
			dialogOptions: {
				label: '全部',
				selection: true,
			},
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
				operatesWidth: 160,
				saveSelection: true,
				rowKey: 'id',
			},
			data: [],
			loading: false,
			pagination: {
				currentPage: 1,
				pageSize: 10,
				total: 0,
			},
			searchConfig: {
				certiTypeId: '',
				companyName: '',
				pageNum: 1,
				pageSize: 10,
			},
			bathApplyList: [],
		};
	},
	created() {
		this.$listen('ZHENGJIANBAOSHENPI_LIST', this.loadData);
		this.loadData();
		this.getCertiTypeAndName();
		this.stepLoadData();
		this.delPending();
	},
	methods: {
		beforeVideoUpload(file) {
			const whiteList = ['xls', 'xlss'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		async stepDel({ id }) {
			const res = await this.$fetch({
				method: 'DELETE',
				url: `/mgmt/sys/store/certificate/delete/apply/pending`,
				params: { id },
			});
			if (res && res.code === 200) {
				this.stepLoadData();
				this.$message.success(res.message);
			}
		},
		async getBathApplyList() {
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/sys/store/certificate/list/apply/pending`,
				params: { pageNum: 1, pageSize: 99999999 },
			});
			if (res.code === 200) this.bathApplyList = res.data.list;
		},
		onError() {},
		delPending() {
			this.$fetch({
				method: 'DELETE',
				url: `/mgmt/sys/store/certificate/empty/apply/pending`,
			});
		},
		getExcel() {
			exportExcel('/mgmt/sys/store/certificate/bath/template');
		},
		handleSuccess(res) {
			if (res.code == 200) {
				this.stepLoadData();
				this.$message.success('导入成功！');
			}
		},
		stepSearch() {
			this.stepPagination.currentPage = 1;
			this.stepLoadData();
		},
		stepChangePage(currentPage) {
			this.stepPagination.currentPage = currentPage;
			this.stepLoadData();
		},
		stepSizeChange(pageSize) {
			this.stepPagination.currentPage = pageSize;
			this.stepLoadData();
		},
		stepBtn() {
			this.step = this.step === 1 ? 2 : 1;
		},
		async submitBtn() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/sys/store/certificate/bath/apply`,
				data: { bathApplyList: this.bathApplyList, certificateList: this.relativeList.map(e => e) },
			});
			if (res && res.code == 200) {
				this.$message.success(res.message);
				this.$dispatch('ZHENGJIANBAOSHENPI_LIST');
				this.$closeSelf();
			}
		},
		close() {
			this.dialogTableVisible = false;
			if (this.relativeList.length === 0) {
				this.$refs.tablelist.$children[0].clearSelection();
				this.handleSearch();
			}
		},
		saveCerti() {
			this.relativeList = this.temporary;
			this.dialogTableVisible = false;
			this.$message.success('保存成功！');
		},
		async stepLoadData() {
			let { currentPage: pageNum, pageSize } = this.stepPagination;
			let params = { storeCode: this.storeCode, pageNum, pageSize };
			this.stepLoading = true;
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/sys/store/certificate/list/apply/pending`,
				params,
			});
			if (res && res.code == 200) {
				this.stepData = res.data ? res.data.list : [];
				this.stepPagination.total = res.data ? res.data.total : 0;
				this.bathApplyList = this.stepData;
				this.getBathApplyList();
			}
			this.stepLoading = false;
		},
		dailog() {
			this.dialogTableVisible = true;
			this.dialogLoadData();
		},
		async getCertiTypeAndName() {
			const res = await this.$fetch('/mgmt/sys/getCertiTypeIdAndName');
			if (res.code === 200) {
				this.COMPANY_CERTIFICATE_IMPORT_CONFIG.form.forEach(e => {
					if (e.key === 'certiTypeId') {
						e.options = res.data.map(({ id, name }) => ({ value: id, label: name }));
					}
				});
			}
		},
		handleSearch() {
			this.dialogPagination.currentPage = 1;
			this.dialogLoadData();
		},
		dialogChangePage(currentPage) {
			this.dialogPagination.currentPage = currentPage;
			this.dialogLoadData();
		},
		dialogSizeChange(pageSize) {
			this.dialogPagination.currentPage = pageSize;
			this.dialogLoadData();
		},
		handleSelectionChange(val) {
			this.temporary = val.map(e => e.id);
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
			let params = {
				...{
					certiTypeId: '',
					companyId: '',
					endTime: '',
					pageNum: 1,
					pageSize: 10,
					startTime: '',
					status: '',
				},
				pageNum,
				pageSize,
			};
			this.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/sys/getCerti`,
				data: params,
			});
			if (res && res.code == 200) {
				this.data = res.data ? res.data.list : [];
				this.pagination.total = res.data ? res.data.total : 0;
			}
			this.loading = false;
		},
		async dialogLoadData() {
			let { currentPage: pageNum, pageSize } = this.dialogPagination;
			let params = { ...this.searchConfig, pageNum, pageSize };
			this.dialogLoading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/sys/getCerti`,
				data: params,
			});
			if (res && res.code == 200) {
				this.dialogData = res.data ? res.data.list : [];
				this.dialogPagination.total = res.data ? res.data.total : 0;
			}
			this.dialogLoading = false;
		},
		async del({ id }) {
			const res = await this.$fetch(`/mgmt/sys/delCerti?id=${id}`);
			if (res && res.code === 200) {
				this.loadData();
				this.$message.success(res.message);
			}
		},
	},
};
</script>
<style  lang="scss" scoped>
.input-text {
	width: 300px;
	margin-left: 20px;
}
</style>