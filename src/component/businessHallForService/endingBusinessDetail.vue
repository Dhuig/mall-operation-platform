<template>
	<div>
		<el-card class="card-gap">
			<div class="had-text">
				<span>服务中心编号：</span>
				<span class="text-span">{{ pageHeadData.store.code }}</span>
				<span>服务中心名称：</span>
				<span class="text-span">{{ pageHeadData.store.name }}</span>
				<span>负责人卡号：</span>
				<span class="text-span">{{ pageHeadData.user.cardNo }}</span>
				<span>负责人姓名：</span>
				<span>{{ pageHeadData.user.realname }}</span>
			</div>
		</el-card>
		<el-card>当前状态：{{ pageData.auditStatus | ENDING_BUSSINESS_MOVE_SEARCH }}</el-card>
		<el-card class="card-gap">
			<div class="tab-content">
				<div class="tab-had">结业信息</div>
				<div class="tab-tabel">
					<div class="left">
						<div class="tr">
							<div class="td">结业原因:</div>
							<div class="td">{{ pageData.graduationReason | graduationReason }}</div>
						</div>
						<div class="tr">
							<div class="td">未领取的水机售后处理方式:</div>
							<div class="td">{{ pageData.dispenserHandling | dispenserHandling }}</div>
						</div>
						<div class="tr">
							<div class="td">旧系统库存处理方式:</div>
							<div class="td">{{ pageData.oldSysHandling | oldSysHandling }}</div>
						</div>
						<div class="tr">
							<div class="td">押货库存处理方式:</div>
							<div class="td">
								{{ pageData.inventoryHandling | inventoryHandling }}
								<span style="width: 10px"></span>
								{{
									pageData.inventoryHandling === 3 && pageData.inventoryMoveStorecode
										? '转店服务中心编号：' + pageData.inventoryMoveStorecode
										: ''
								}}
							</div>
						</div>
						<div class="tr" v-if="pageData.auditPeople">
							<div class="td">审批人:</div>
							<div class="td">{{ pageData.auditPeople ? pageData.auditPeople : '--' }}</div>
						</div>
					</div>
					<div class="right">
						<div class="tr" v-if="pageData.auditCode">
							<div class="td">审批人工号:</div>
							<div class="td">{{ pageData.auditCode ? pageData.auditCode : '--' }}</div>
						</div>
						<div class="tr">
							<div class="td">审批意见:</div>
							<div class="td">
								<el-popover
									slot="reference"
									placement="top-start"
									width="200"
									trigger="hover"
									:content="headerData.auditText"
								>
									<span slot="reference">{{ headerData.auditText }}</span>
								</el-popover>
							</div>
						</div>
						<div class="tr">
							<div class="td">审批状态:</div>
							<div class="td">{{ headerData.statusText }}</div>
						</div>
						<div class="tr">
							<div class="td">审批时间:</div>
							<div class="td">{{ headerData.auditTimeText }}</div>
						</div>
						<div class="tr" v-if="pageData.auditStatus == 4">
							<div class="td">完成结业时间:</div>
							<div class="td">{{ pageData.graduationTime }}</div>
						</div>
						<div class="tr" v-if="pageData.auditStatus == 5">
							<div class="td">撤销申请时间:</div>
							<div class="td">{{ pageData.cancelTime | formatDate }}</div>
						</div>
						<div class="tr" v-if="pageData.auditStatus != 5 && pageData.auditStatus != 4">
							<div class="td"></div>
							<div class="td"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="archive-content">
				<div class="archive-had">
					{{ pageData.auditStatus != 5 && pageData.auditStatus != 7 ? '存档资料' : '撤销信息' }}
				</div>
				<div class="archive-list">
					<div class="li">
						<el-form>
							<div v-if="pageData.auditStatus != 5 && pageData.auditStatus != 7">
								<el-form-item label="装修拆除照片：">
									<el-upload
										:action="$store.getters['system/getOssUploadUrl']"
										:headers="$store.getters['system/getSignatureVerification']"
										class="disUoloadSty"
										list-type="picture-card"
										accept="doc, docx, pdf, wps, bmp, jpg, png"
										disabled
										:file-list="imglistThree"
									>
										<i slot="default" class="el-icon-plus"></i>
										<div slot="file" slot-scope="{ file }">
											<img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
											<span class="el-upload-list__item-actions">
												<span class="el-upload-list__item-preview" @click="imgPreview(file)">
													<i class="el-icon-zoom-in"></i>
												</span>
												<span class="el-upload-list__item-delete" @click="imgDownload(file, '装修拆除照片')">
													<i class="el-icon-download"></i>
												</span>
											</span>
										</div>
									</el-upload>
								</el-form-item>
							</div>
							<div v-else>
								<el-form-item label="申请原因:">{{ pageData.cancelReason }}</el-form-item>
								<el-form-item label="撤销申请书:"></el-form-item>
								<el-form-item label="">
									<el-upload
										class="displaynone"
										:action="$store.getters['system/getOssUploadUrl']"
										:headers="$store.getters['system/getSignatureVerification']"
										list-type="picture-card"
										accept="doc, docx, pdf, wps, bmp, jpg, png"
										disabled
										:file-list="revokeImg"
									>
										<i slot="default" class="el-icon-plus"></i>
										<div slot="file" slot-scope="{ file }">
											<img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
											<span class="el-upload-list__item-actions">
												<span class="el-upload-list__item-preview" @click="imgPreview(file)">
													<i class="el-icon-zoom-in"></i>
												</span>
												<span class="el-upload-list__item-delete" @click="imgDownload(file, '撤销申请书')">
													<i class="el-icon-download"></i>
												</span>
											</span>
										</div>
									</el-upload>
								</el-form-item>
							</div>
						</el-form>
					</div>
				</div>
			</div>
			<div class="tab-had rear-text">操作记录</div>
			<tableList :dataSource="recording" :columns="RECORDING_COLUMNS">
				<template v-slot:reason="{ row }">
					<el-popover slot="reference" placement="top-start" width="200" trigger="hover" :content="row.reason">
						<span class="reason-style" slot="reference">{{ row.reason }}</span>
					</el-popover>
				</template>
			</tableList>
		</el-card>
		<el-dialog v-drag :visible.sync="dialogVisible">
			<img width="100%" :src="dialogImageUrl" alt="" />
		</el-dialog>
		<el-dialog :title="title" :visible.sync="centerDialogVisible" width="40%" :before-close="close">
			<div>
				<el-form label-width="100px" :model="ruleForm" :rules="rules" ref="ruleForm2" class="demo-ruleForm">
					<el-form-item label="审批结果：" prop="verifyStatus" v-if="title != '转出确认'">
						<el-select v-model="ruleForm.verifyStatus" placeholder="请选择">
							<el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审批意见：" v-if="title != '转出确认'">
						<el-input
							type="textarea"
							:autosize="{ minRows: 7 }"
							show-word-limit
							maxlength="200"
							v-model="ruleForm.auditOpinion"
							placeholder="请填写意见"
						/>
					</el-form-item>
					<div v-if="title == '转出确认'" class="transferout">
						是否进行礼券转出操作？如果是，将会把含有该服务中心编号（即申请结点的服务中心编号）的未使用电子礼券进行转出。
					</div>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="close">取消</el-button>
				<el-button type="primary" :loading="isAddMsg" @click="addMsg">确定</el-button>
			</span>
		</el-dialog>

		<el-dialog title="完成结业" v-drag :visible.sync="graduationDialogVisible" width="720px">
			<el-form>
				<el-form-item label="装修拆除照片"></el-form-item>
				<el-form-item label="">
					<el-upload
						:class="[savelist.length == 4 ? 'graduation' : '']"
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						list-type="picture-card"
						:on-success="handlePictureCardSuccess"
						:on-remove="beforeRemove"
						:limit="4"
						multiple
						:on-preview="imgPreview"
						:before-upload="beforeVideoUpload"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="只能支持上传4张图片格式支持bmp，jpg，png，tif大小不能超过10M"></el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="graduationDialogVisible = false">取 消</el-button>
				<el-button type="primary" :loading="isAddMsg" @click="save">确 定</el-button>
			</span>
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
				<div v-if="auditStatus == 2">
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
							:on-preview="imgPreview"
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
		<actionBar>
			<template>
				<el-button type="primary" @click="$closeSelf()" class="btn">返 回</el-button>
				<span v-permission="'ending_business_detail_revoke'">
					<el-button
						class="btn"
						type="primary"
						@click="revoke"
						v-if="pageData.auditStatus == 1 || pageData.auditStatus == 2"
					>
						撤销申请
					</el-button>
				</span>
				<span v-permission="'ending_business_detail_audit'">
					<el-button class="btn" type="primary" @click="review" v-if="pageData.auditStatus == 1">审 批</el-button>
				</span>
				<span v-permission="'ending_business_detail_transfer'">
					<el-button class="btn" type="primary" @click="transferout" v-if="pageData.auditStatus == 2">
						礼券转出
					</el-button>
				</span>
				<span v-permission="'ending_business_detail_complete'">
					<el-button class="btn" type="primary" @click="successBusiness" v-if="pageData.auditStatus == 2">
						完成结业
					</el-button>
				</span>
				<span v-permission="'ending_business_detail_out_accept'">
					<el-button class="btn" type="primary" @click="businessAccept" v-if="pageData.auditStatus == 6">
						完成受理
					</el-button>
				</span>
				<span v-permission="'ending_business_detail_stop_accept'">
					<el-button type="primary" @click="revokeAccept" v-if="pageData.auditStatus == 7">撤销受理</el-button>
				</span>
			</template>
		</actionBar>
	</div>
</template>

<script>
import {
	COMPANY_CERTIFICATE_COLUMNS_DETAIL,
	JIEYEYUANYING_SEARCH,
	JIUXITONGCHULIFANGSHI_SEARCH,
	YAHUOCHULIFANGHIS_SEARCH,
	WEICHULISHUIJISHOUHOU_SEARCH,
	ENDING_BUSSINESS_MOVE_SEARCH,
	RECORDING_COLUMNS,
} from './config';
import { formatDate, downloadUrlFile, uploadFileType } from 'util/formValidation.js';
export default {
	name: 'endingBusinessDetail',
	data() {
		return {
			revokeImg: [],
			cancelApplication: '',
			revokeList: [],
			isRevoke: false,
			revokeDialogVisible: false,
			RECORDING_COLUMNS,
			recording: [],
			isAddMsg: false,
			showImg: false,
			dialogImageUrljy: '',
			graduationDialogVisible: false,
			timeDisabel: {
				disabledDate(time) {
					return time.getTime() < Date.now();
				},
			},
			pageHeadData: {
				store: {
					code: '',
					name: '',
				},
				user: {
					cardNo: '',
					realname: '',
				},
			},
			title: '结业申请审批',
			ruleForm: {
				verifyStatus: 2,
				auditOpinion: '',
				id: null,
			},
			option: [
				{ value: 2, label: '审核通过' },
				{ value: 3, label: '审核驳回' },
			],
			centerDialogVisible: false,
			dialogImageUrl: '',
			dialogVisible: false,
			rules: {
				verifyStatus: [{ required: true, message: '请选择', trigger: 'blur' }],
			},
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			data: [],
			pageData: {},
			imglistOne: [],
			imglistTwo: [],
			imglistThree: [],
			COMPANY_CERTIFICATE_COLUMNS_DETAIL,
			savelist: [],
			auditStatus: null,
		};
	},
	watch: {
		'ruleForm.verifyStatus'(val) {
			this.rules.auditOpinion = [{ required: val === 3, message: '请输入意见', trigger: 'blur' }];
		},
	},
	filters: {
		graduationReason: val => (val in JIEYEYUANYING_SEARCH ? JIEYEYUANYING_SEARCH[val] : '--'),
		oldSysHandling: val => (val in JIUXITONGCHULIFANGSHI_SEARCH ? JIUXITONGCHULIFANGSHI_SEARCH[val] : '--'),
		inventoryHandling: val => (val in YAHUOCHULIFANGHIS_SEARCH ? YAHUOCHULIFANGHIS_SEARCH[val] : '--'),
		dispenserHandling: val => (val in WEICHULISHUIJISHOUHOU_SEARCH ? WEICHULISHUIJISHOUHOU_SEARCH[val] : '--'),
		ENDING_BUSSINESS_MOVE_SEARCH: val =>
			val in ENDING_BUSSINESS_MOVE_SEARCH ? ENDING_BUSSINESS_MOVE_SEARCH[val] : '--',
		formatDate: val => (val ? formatDate(val) : '--'),
	},
	created() {
		this.loadData();
		this.getHeadDate();
		this.getApplyRecord();
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			};
			return params;
		},
		headerData() {
			let { auditStatus, auditOpinion, dealTime, auditTime, dealOpinion } = this.pageData;
			let auditText, statusText, auditTimeText;
			// 1: '待审核', 2: '审核通过', 3: '已驳回',4: '已结业',5: '已撤销',7: '撤销待受理'6: '完成待受理',
			let funText = () => {
				auditText = '';
				auditTimeText = '';
				statusText = '';
			};
			let fundeal = () => {
				auditTimeText = dealTime;
				auditText = dealOpinion;
			};
			let fun = () => {
				auditTimeText = auditTime;
				auditText = auditOpinion;
			};
			if (auditStatus == 1) {
				auditTimeText = '';
				auditText = '';
				statusText = '待审核';
			} else if (auditStatus == 2) {
				fun();
				statusText = '审核通过';
				if (dealTime) {
					statusText = '审核驳回';
					fundeal();
				}
			} else if (auditStatus == 3) {
				fun();
				statusText = '审核驳回';
			} else if (auditStatus == 4) {
				statusText = '审核通过';
				fun();
				if (dealTime) fundeal();
			} else if (auditStatus == 5) {
				funText();
				if (dealTime) {
					fundeal();
					statusText = '审核通过';
				}
			} else {
				funText();
			}
			return { auditText, auditTimeText: auditTimeText ? formatDate(new Date(auditTimeText)) : '', statusText };
		},
	},
	methods: {
		resetFrom() {
			this.ruleForm.auditOpinion = '';
			this.ruleForm.verifyStatus = 2;
		},
		imgPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		async cancle() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/graduation/cancle`,
				data: {
					id: this.$route.query.id,
					decoratePic: this.revokeList.map(e => e.urls).join(','),
					port: 0,
					cancelApplication: this.cancelApplication,
				},
			});
			if (res.code === 200) {
				this.messageSuccess(res);
			} else if (res) {
				this.messageError(res);
			}
			this.revokeDialogVisible = false;
		},
		async revoke() {
			let { id } = this.$route.query;
			this.cancelApplication = '';
			this.revokeList = [];
			this.ruleForm.id = id;
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
				if (e.fileName === res.name) this.revokeList.splice(index, 1);
			});
		},
		revokeSave() {
			this.cancle();
		},
		async getApplyRecord() {
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/store/graduation/getApplyRecord`,
				params: { id: this.$route.query.id, pageSize: 999, pageNum: 1 },
			});
			if (res && res.code === 200) {
				this.recording = res.data.list;
			}
		},
		saveHandlePictureCardPreview(file) {
			this.dialogImageUrljy = file.url;
			this.showImg = true;
		},
		async save() {
			this.completeGraduationById();
		},
		beforeVideoUpload(file) {
			const whiteList = ['bmp', 'png', 'jpg', 'tif'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		beforeRemove(res) {
			this.savelist.forEach((e, index) => {
				if (e.fileName === res.name) this.savelist.splice(index, 1);
			});
		},
		handlePictureCardSuccess(res, file) {
			if (res.success) this.savelist.push({ fileName: file.name, urls: res.datas.fileUrlKey });
		},
		imgDownload({ url }, fileName) {
			downloadUrlFile(url, fileName, () => {
				this.$message.success('下载成功');
			});
		},
		close() {
			this.centerDialogVisible = false;
		},
		messageSuccess(res) {
			this.loadData();
			this.getApplyRecord();
			this.$dispatch('JIEYESHENPI_LIST');
			this.$message.success(res.message);
		},
		messageError(res) {
			this.loadData();
			this.getApplyRecord();
			this.$message({
				message: res.data.message,
				type: 'error',
			});
		},
		async updateGiftCouponTransOutStatusByStoreCode() {
			this.isAddMsg = true;
			const res = await this.$fetch(
				`/mgmt/fin/voucher/gift/coupon/updateGiftCouponTransOutStatusByStoreCode?storeCode=${this.$route.query.storeCode}`
			);
			if (res && res.code == 200) {
				this.messageSuccess(res);
			} else if (res) {
				this.messageError(res);
			}
			this.centerDialogVisible = false;
			this.isAddMsg = false;
		},
		async completeGraduationById() {
			this.isAddMsg = true;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/graduation/completeGraduationById`,
				data: { id: this.$route.query.id, decoratePic: this.savelist.map(e => e.urls).join(','), port: 0 },
			});
			if (res.code === 200) {
				this.messageSuccess(res);
			} else if (res) {
				this.messageError(res);
			}
			this.isAddMsg = false;
			this.graduationDialogVisible = false;
		},
		async dealGraduationApply() {
			this.isAddMsg = true;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/graduation/dealGraduationApply`,
				data: this.ruleForm,
			});
			if (res && res.code == 200) {
				this.messageSuccess(res);
			} else if (res) {
				this.messageError(res);
			}
			this.isAddMsg = false;
			this.centerDialogVisible = false;
		},
		async updateGraduationApply() {
			this.isAddMsg = true;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/graduation/updateGraduationApply`,
				data: this.ruleForm,
			});
			if (res && res.code == 200) {
				this.messageSuccess(res);
			} else if (res) {
				this.messageError(res);
			}
			this.isAddMsg = false;
			this.centerDialogVisible = false;
		},
		async addMsg() {
			if (this.title === '转出确认') {
				this.updateGiftCouponTransOutStatusByStoreCode();
			} else {
				this.ruleForm.id = this.$route.query.id;
				this.$refs['ruleForm2'].validate(async valid => {
					if (valid) {
						if (this.pageData.auditStatus >= 6) {
							this.dealGraduationApply();
						} else {
							this.updateGraduationApply();
						}
					}
				});
			}
		},
		async loadData() {
			const res = await this.$fetch(`/mgmt/store/graduation/queryGraduationInfoById?id=` + this.$route.query.id);
			if (res && res.code == 200) {
				let { decoratePic, cancelApplication } = res.data;
				this.pageData = res.data;
				this.revokeImg = cancelApplication
					? cancelApplication.split(',').map((e, i) => ({ name: i, url: e }))
					: [{ name: '0', url: require('assets/img-empty.png') }];
				this.imglistThree = decoratePic
					? decoratePic.split(',').map((e, i) => ({ name: i, url: e }))
					: [{ name: '0', url: require('assets/img-empty.png') }];
			}
		},
		async getHeadDate() {
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/store/getStoreByCode?code=${this.$route.query.storeCode}`,
			});
			if (res && res.code == 200) {
				this.pageHeadData = res.data;
			}
		},
		async revokeAccept() {
			this.loadHandle(7, () => {
				this.title = '撤销申请受理审批';
				this.centerDialogVisible = true;
				this.resetFrom();
			});
		},
		async businessAccept() {
			this.loadHandle(6, () => {
				this.centerDialogVisible = true;
				this.title = '完成结业受理审批';
				this.resetFrom();
			});
		},
		successBusiness() {
			this.loadHandle(2, () => {
				this.graduationDialogVisible = true;
				this.savelist = [];
			});
		},
		transferout() {
			this.loadHandle(2, () => {
				this.centerDialogVisible = true;
				this.title = '转出确认';
				this.resetFrom();
			});
		},
		review() {
			this.loadHandle(1, () => {
				this.centerDialogVisible = true;
				this.title = '结业申请审批';
				this.resetFrom();
			});
		},
		async loadHandle(auditStatus, callback) {
			const res = await this.$fetch(`/mgmt/store/graduation/queryGraduationInfoById?id=${this.$route.query.id}`);
			if (res && res.data.auditStatus == auditStatus) {
				callback && callback();
			} else {
				this.$message.warning('操作已更新');
				this.loadData();
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.card-gap {
	margin-top: 20px;
	overflow: hidden;
	.title-text {
		padding: 20px;
		padding-top: 0;
		margin-bottom: 20px;
		border-bottom: 1px solid $color-border;
	}
}
.text-div {
	padding: 0 50px;
	overflow: hidden;
	.text-p {
		width: 33.33%;
		float: left;
		line-height: 50px;
		font-size: 14px;
	}
}
.text-span {
	margin-right: 20px;
}
.had-content {
	overflow: hidden;
	.left {
		width: 30%;
		float: left;
		p {
			font-size: 14px;
			height: 30px;
			line-height: 30px;
		}
	}
	.right {
		width: 70%;
		float: left;
	}
}

::v-deep .el-step__title.is-process {
	color: #8c939b;
	font-weight: 400;
}
::v-deep .el-step__head.is-process {
	color: #8c939b;
	font-weight: 400;
	border-color: #8c939b;
}
::v-deep .el-step__description.is-process {
	color: #8c939b;
}
.rear-text {
	margin-bottom: 10px;
}
.tab-content {
	overflow: hidden;
	.tab-had {
		font-size: 18px;
		height: 50px;
		line-height: 50px;
	}
	.tab-tabel {
		overflow: hidden;
		border-left: 1px solid $color-border;
		.left {
			overflow: hidden;
			width: 50%;
			float: left;
			border-top: 1px solid $color-border;
			.tr {
				box-sizing: border-box;
				height: 40px;
				line-height: 40px;
				.td {
					box-sizing: border-box;
					float: left;
					border-bottom: 1px solid $color-border;
					border-right: 1px solid $color-border;
					height: 40px;
					line-height: 40px;
					overflow: hidden;
					text-overflow: ellipsis;
					-ms-text-overflow: ellipsis;
					white-space: nowrap;
					&:first-child {
						width: 220px;
						padding-right: 10px;
						text-align: right;
						background-color: #f7f7f7;
					}
					&:last-child {
						width: calc(100% - 220px);
						padding-left: 10px;
					}
				}
			}
		}
		.right {
			overflow: hidden;
			width: 50%;
			float: left;
			border-top: 1px solid $color-border;
			.tr {
				box-sizing: border-box;
				height: 40px;
				line-height: 40px;
				.td {
					box-sizing: border-box;
					float: left;
					height: 40px;
					line-height: 40px;
					border-bottom: 1px solid $color-border;
					border-right: 1px solid $color-border;
					overflow: hidden;
					text-overflow: ellipsis;
					-ms-text-overflow: ellipsis;
					white-space: nowrap;
					&:first-child {
						width: 220px;
						padding-right: 10px;
						text-align: right;
						background-color: #f7f7f7;
					}
					&:last-child {
						width: calc(100% - 220px);
						padding-left: 10px;
					}
				}
			}
		}
	}
}
.archive-content {
	overflow: hidden;
	.archive-had {
		font-size: 18px;
		height: 50px;
		line-height: 50px;
	}
	.archive-list {
		overflow: hidden;
		.li {
			position: relative;
			.upload-text {
				position: absolute;
				bottom: -10px;
				left: 105px;
				cursor: pointer;
				color: $color-link;
			}
		}
	}
}

::v-deep .el-dialog__wrapper {
	overflow: auto;
}
.disUoloadSty ::v-deep .el-upload--picture-card {
	display: none; /* 上传按钮隐藏 */
}

.graduation ::v-deep .el-upload--picture-card {
	display: inline-block; /* 上传按钮隐藏 */
}
.revoke ::v-deep .el-upload--picture-card {
	display: none;
}
.transferout {
	line-height: 30px;
}
.btn {
	margin-right: 10px;
}

.displaynone ::v-deep .el-upload--picture-card {
	display: none;
}
.had-text {
	font-size: 14px;
}
.text-span {
	margin-right: 20px;
}
</style>
