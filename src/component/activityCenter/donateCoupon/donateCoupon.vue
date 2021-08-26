<template>
	<div class="platform-activeCenter_couponHandList-wrap">
		<guideBar>
			<el-button
				class="el-icon-sold-out"
				v-permission="'donate_coupon_list_batch_export'"
				type="primary"
				@click="batchExport"
			>
				导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel ref="searchPanel" v-model="searchModel" :config="COUPON_SEARCH_LIST_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeName">
				<el-tab-pane :label="item.label" :name="item.name" v-for="(item, index) in tabPane" :key="index"></el-tab-pane>
			</el-tabs>
			<tableList
				:options="options"
				:dataSource="tabPaneObj[activeName].data"
				:columns="CHANGE_COLUMNS"
				:pagination="tabPaneObj[activeName].pagination"
				:dataTotal="tabPaneObj[activeName].pagination.total"
				:loading="tabPaneObj[activeName].loading"
				@handleSelectionChange="handleSelectionChange"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot="content_context">
					<div class="list-text">如果需要创建派发任务，请在优惠券列表进行派发任务的创建。</div>
				</template>
				<template slot-scope="{ data }">
					<span v-permission="'donate_coupon_list_detail'" class="btn-sty">
						<el-button type="text" v-if="data.state !== 4 || data.state !== 5" @click="detail(data)">详情</el-button>
					</span>
					<span v-permission="'donate_coupon_list_edit'" class="btn-sty">
						<el-button type="text" v-if="data.state === 1 || data.state === 4 || data.state === 5" @click="edit(data)">
							编辑
						</el-button>
					</span>
					<span v-permission="'donate_coupon_list_again_submint'" class="btn-sty">
						<el-button type="text" v-if="data.state === 4" @click="submitClick(data)">再次提交</el-button>
					</span>
					<span v-permission="'donate_coupon_list_audit'" class="btn-sty">
						<el-button type="text" v-if="data.state === 1" @click="preview(data)">审核</el-button>
					</span>
					<span v-permission="'donate_coupon_list_stop_donate'" class="btn-sty">
						<el-button type="text" v-if="data.state === 2 && data.grantType != 1" @click="stop(data)">停止</el-button>
					</span>
				</template>
			</tableList>
		</el-card>

		<el-dialog title="停止派发提示" v-drag :visible.sync="stopVisible" width="500px" :before-close="stopClose">
			<div>
				<div class="batch-void">
					<p class="is-text-top">
						<span class="el-icon-question"></span>
						<span class="text">停止派发任务</span>
					</p>
					<p class="is-text">停止后优惠券派发任务会终止，但已经派发的优惠券不会作废</p>
				</div>
				<el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="停止原因：">
						<el-col :span="12">
							<el-input
								style="width: 340px"
								v-model="ruleForm.invalidReason"
								placeholder="请输入停止原因"
								maxlength="40"
								show-word-limit
							/>
						</el-col>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="stopClose">取消</el-button>
				<el-button type="primary" @click="addMsg">确定</el-button>
			</span>
		</el-dialog>

		<el-dialog title="优惠券派发审核" :visible.sync="dialogVisible" :before-close="beforeClose" width="50%">
			<div class="dialog_con">
				<div class="attr">
					<p>优惠券编号：{{ head.couponNumber }}</p>
					<p>优惠券名称：{{ head.couponName }}</p>
				</div>
				<h1 class="dialog_title">优惠券派发审核</h1>
				<el-form ref="examineForm" :model="examineForm" label-width="100px" :rules="theRules">
					<el-form-item label="审核结果：" prop="examine">
						<el-radio v-model="examineForm.examine" :label="3">审核通过</el-radio>
						<el-radio v-model="examineForm.examine" :label="4">审核不通过</el-radio>
					</el-form-item>
					<el-form-item label="审核意见：" prop="remark">
						<el-input
							type="textarea"
							v-model="examineForm.remark"
							placeholder="请输入审核意见"
							:autosize="{ minRows: 5 }"
							style="width: 80%"
							maxlength="1000"
							show-word-limit
						></el-input>
					</el-form-item>
					<el-form-item>附件： 支持格式doc、docx、pdf、wps、bmp、jpg、png，最大10M，3个文件</el-form-item>
					<el-form-item>
						<el-upload
							:class="[examineForm.enclosureVos.length == 3 ? 'is-upload' : '']"
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							:limit="3"
							multiple
							list-type="picture-card"
							:on-success="handlePictureCardSuccess"
							:on-error="onError"
							:on-exceed="onExceed"
							:before-upload="beforeVideoUpload"
							:file-list="imglist"
							accept=".doc, .docx, .pdf, .wps, .bmp, .jpg, .png"
						>
							<i class="el-icon-plus"></i>
							<div slot="file" slot-scope="{ file }" class="uploadSlotDiv">
								<pdf
									v-if="file && file.response && file.response.datas && file.response.datas.fileUrlKey.includes('.pdf')"
									:src="file.url"
								></pdf>
								<img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
								<span class="el-upload-list__item-actions">
									<span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
										<i class="el-icon-zoom-in"></i>
									</span>
									<span class="el-upload-list__item-delete" @click="beforeRemovePC(file)">
										<i class="el-icon-delete"></i>
									</span>
								</span>
							</div>
						</el-upload>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="beforeClose">取 消</el-button>
				<el-button type="primary" @click="save">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog v-drag :modal="false" :visible.sync="dialog.visible" @closed="closeDialog">
			<pdf v-if="dialog.isPdf" :src="dialog.url"></pdf>
			<img width="100%" :src="dialog.url" alt="" />
		</el-dialog>
	</div>
</template>

<script>
import { COUPON_SEARCH_LIST_CONFIG, TAB_PANE, CHANGE_COLUMNS, TAB_PANE_OBG, TAB_PANE_STATUS } from './config';
import { formatDate, uploadFileType } from 'util/formValidation.js';
import { exportExcel } from 'util';
import pdf from 'vue-pdf';
export default {
	name: 'donateCoupon',
	components: { pdf },
	data() {
		return {
			dataId: null,
			ruleForm: {
				invalidReason: '',
			},
			stopVisible: false,
			head: {
				couponNumber: '',
				couponName: '',
				id: '',
			},
			imglist: [],
			dialog: {
				visible: false,
				url: '',
				isPdf: '',
			},
			showImg: false,
			dialogVisible: false,
			theRules: {
				option: [{ required: true, message: '请输入审核意见！', change: 'blur' }],
				result: [{ required: true, message: '请选择审核结果', change: 'blur' }],
			},
			examineForm: {
				enclosureVos: [],
				examine: 3,
				grantId: null,
				remark: '',
			},
			COUPON_SEARCH_LIST_CONFIG,
			tabPane: TAB_PANE,
			tabPaneObj: TAB_PANE_OBG,
			CHANGE_COLUMNS,
			activeName: 'all',
			searchModel: {
				createTime: null,
				couponName: null,
				couponNumber: null,
			},
			options: {
				selection: true,
			},
		};
	},
	computed: {
		searchData() {
			let { createTime, grantTime, couponName, couponNumber, grantTarget, grantType } = this.searchModel;
			let grantTimes = grantTime && createTime.length > 0;
			let createTimes = createTime && createTime.length > 0;
			return {
				grantTarget,
				grantType,
				couponName,
				couponNumber,
				grantStartTime: grantTimes ? formatDate(createTime[0]) : null,
				grantEndTime: grantTimes ? formatDate(createTime[1] + 86399000) : null,
				createTimeMin: createTimes ? formatDate(createTime[0]) : null,
				createTimeMax: createTimes ? formatDate(createTime[1] + 86399000) : null,
			};
		},
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			};
			return params;
		},
		state() {
			return TAB_PANE_STATUS[this.activeName];
		},
	},
	created() {
		this.$listen('DONATE_CONPON_LIST', this.handleSearch);
	},
	methods: {
		stopClose() {
			this.stopVisible = false;
			this.ruleForm.invalidReason = '';
		},
		async addMsg() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/prmt/couponGrant/stopGrant',
				data: { id: this.dataId, remarks: this.ruleForm.invalidReason },
			});
			if (res && res.code === 200) {
				this.$message.success(res.message);
				this.handleSearch();
				this.stopVisible = false;
			}
		},
		handlePictureCardPreview(file) {
			const { fileUrlKey: url } = file.response.datas;
			this.dialog = {
				url,
				visible: true,
				isPdf: url.includes('.pdf'),
			};
		},
		closeDialog() {
			this.dialog = {
				url: null,
				visible: false,
				isPdf: false,
			};
		},
		beforeVideoUpload(file) {
			const whiteList = ['doc', 'docx', 'pdf', 'wps', 'bmp', 'jpg', 'png'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		beforeClose() {
			this.dialogVisible = false;
			this.examineForm.remark = '';
			this.examineForm.grantId = '';
			this.examineForm.examine = 3;
		},
		beforeRemovePC(res) {
			this.examineForm.enclosureVos.forEach((e, index) => {
				if (e.fileName === res.name) this.examineForm.enclosureVos.splice(index, 1);
			});
			this.imglist.forEach((e, index) => {
				if (e.name === res.name) this.imglist.splice(index, 1);
			});
		},
		onError() {
			this.$message.error('上传失败');
		},
		onExceed() {
			this.$message.warning('只能上传3个文件');
		},
		async save() {
			this.examineForm.grantId = this.head.id;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/prmt/couponTransfer/examineGrant',
				data: this.examineForm,
			});
			if (res && res.code === 200) {
				this.$message.success(res.message);
				this.handleSearch();
				this.beforeClose();
			}
		},
		handlePictureCardSuccess(res, file, fileList) {
			if (res.success) {
				this.imglist = fileList;
				this.examineForm.enclosureVos.push({ fileName: file.name, urls: res.datas.fileUrlKey });
				this.$message.success('上传成功');
			}
		},
		batchExport() {
			exportExcel(`/mgmt/prmt/couponTransfer/exportCouponTransferGrant`, {
				...this.searchData,
				state: this.state,
				ids: this.ids,
				grantWay: 2,
			});
		},
		async loadData() {
			let { searchData, state } = this;
			let { currentPage: pageNum, pageSize } = this.tabPaneObj[this.activeName].pagination;
			this.tabPaneObj[this.activeName].loading = true;
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/prmt/couponGrant/getCouponGrantList`,
				params: { ...searchData, pageNum, pageSize, state, grantWay: 2 },
			});
			if (res && res.code == 200) {
				const { list, total } = res.data;
				this.tabPaneObj[this.activeName].pagination.total = total || 0;
				this.tabPaneObj[this.activeName].data = list;
			}
			this.tabPaneObj[this.activeName].loading = false;
		},
		// 翻页操作
		handleChangePage(page) {
			this.tabPaneObj[this.activeName].pagination.currentPage = page;
			this.loadData();
		},
		// 切换页面条数
		handleSizeChange(pageSize) {
			this.tabPaneObj[this.activeName].pagination.pageSize = pageSize;
			this.loadData();
		},
		handleSearch() {
			this.tabPaneObj[this.activeName].pagination.currentPage = 1;
			this.loadData();
		},
		handleSelectionChange(e) {
			this.ids = e.map(e => e.id);
		},
		stop({ id }) {
			this.dataId = id;
			this.stopVisible = true;
		},
		detail({ id }) {
			this.$go('donate_coupon_detail', { id });
		},
		edit({ id }) {
			this.$go('add_donate_coupon', { edit: id });
		},
		submitClick({ id }) {
			this.$confirm('确定再次提交?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/prmt/couponGrant/submitAgain',
					data: { id },
				});
				if (res.code === 200) {
					this.$message.success(res.message);
					this.handleSearch();
				}
			});
		},
		preview({ id, couponName, couponNumber }) {
			this.head = { couponNumber, couponName, id };
			this.dialogVisible = true;
		},
	},
	watch: {
		activeName: {
			handler() {
				this.handleSearch();
			},
			immediate: true,
		},
	},
};
</script>

<style lang="scss" scoped>
.uplod_img {
	margin-left: 30px;
	p {
		line-height: 30px;
		margin-bottom: 20px;
	}
}
.dialog_con {
	.attr {
		p {
			margin-right: 10px;
			display: inline-block;
		}
	}
	.dialog_title {
		font-size: 24px;
		color: blue;
		font-weight: bold;
		margin: 30px 0px;
	}
}
.is-upload ::v-deep .el-upload--picture-card {
	display: none; /* 上传按钮隐藏 */
}

::v-deep .el-dialog__wrapper {
	overflow: auto;
}
.list-text {
	color: $color-hit;
	padding-top: 10px;
	padding-bottom: 20px;
}

.batch-void {
	padding-left: 10px;
	padding-bottom: 20px;
	.is-text-top {
		line-height: 40px;
		height: 40px;
		.el-icon-question {
			color: $warning;
			font-size: 40px;
			float: left;
		}
		.text {
			font-size: 18px;
			color: $color-body-se;
			display: inline-block;
			margin-bottom: 10px;
		}
	}
	.is-text {
		font-size: 14px;
		color: $color-disabled;
		text-indent: 40px;
	}
}
.btn-sty {
	margin-right: 3px;
}
</style>
