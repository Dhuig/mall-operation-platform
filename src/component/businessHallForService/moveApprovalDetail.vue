<template>
	<div>
		<el-card class="card-gap">
			<div class="had-text">
				<span>服务中心编号：</span>
				<span class="text-span">{{ moveVO.storeCode }}</span>
				<span>服务中心名称：</span>
				<span class="text-span">{{ moveVO.storeName }}</span>
				<span>负责人卡号：</span>
				<span class="text-span">{{ pageHeadData.user.cardNo }}</span>
				<span>负责人姓名：</span>
				<span>{{ pageHeadData.user.realname }}</span>
			</div>
		</el-card>
		<el-card>当前状态：{{ moveVO.auditStatus | MOVE_APPROVAL_STATUS_BQ }}</el-card>
		<el-card class="card-gap">
			<div class="tab-content">
				<div class="tab-had">审核信息</div>
				<div class="tab-tabel">
					<div class="left">
						<div class="tr">
							<div class="td">申请人:</div>
							<div class="td">{{ moveVO.applyPeople }}</div>
						</div>
						<div class="tr">
							<div class="td">搬迁原因:</div>
							<div class="td">
								<el-popover
									slot="reference"
									placement="top-start"
									width="200"
									trigger="hover"
									:content="moveVO.moveReason + ''"
								>
									<span slot="reference">{{ moveVO.moveReason }}</span>
								</el-popover>
							</div>
						</div>
						<div class="tr">
							<div class="td">当前地址:</div>
							<div class="td">
								<el-popover
									slot="reference"
									placement="top-start"
									width="200"
									trigger="hover"
									:content="moveVO.currentAddr + ''"
								>
									<span slot="reference">{{ moveVO.currentAddr }}</span>
								</el-popover>
							</div>
						</div>
						<div class="tr">
							<div class="td">新店地址:</div>
							<div class="td">
								<el-popover
									slot="reference"
									placement="top-start"
									width="200"
									trigger="hover"
									:content="moveVO.newShopAddr + moveVO.detailedAddr + ''"
								>
									<span slot="reference">{{ moveVO.newShopAddr + moveVO.detailedAddr }}</span>
								</el-popover>
							</div>
						</div>
					</div>
					<div class="right">
						<div class="tr">
							<div class="td">申请时间:</div>
							<div class="td">
								<el-popover
									slot="reference"
									placement="top-start"
									width="200"
									trigger="hover"
									:content="moveVO.createTime | formatDate"
								>
									<span slot="reference">{{ moveVO.createTime | formatDate }}</span>
								</el-popover>
							</div>
						</div>
						<div class="tr">
							<div class="td">
								<span>审批意见：</span>
							</div>
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
							<div class="td">
								<span>审批时间：</span>
							</div>
							<div class="td">
								<span>{{ headerData.auditTimeText }}</span>
							</div>
						</div>
						<div class="tr">
							<div class="td">
								<span>审批状态：</span>
							</div>
							<div class="td">
								<span>{{ headerData.statusText }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="tab-content">
				<div class="tab-had">新店信息</div>
				<div class="tab-tabel">
					<div class="left">
						<div class="tr">
							<div class="td">总面积(㎡):</div>
							<div class="td">{{ infoVO.totalArea || '--' }}</div>
						</div>
						<div class="tr">
							<div class="td">营业区面积(㎡):</div>
							<div class="td">{{ infoVO.businessArea || '--' }}</div>
						</div>
						<div class="tr">
							<div class="td">招牌长度(m):</div>
							<div class="td">{{ infoVO.signLength || '--' }}</div>
						</div>
						<div class="tr">
							<div class="td">招牌宽度(m):</div>
							<div class="td">
								{{ infoVO.signWidth || '--' }}
							</div>
						</div>
					</div>
					<div class="right">
						<div class="tr">
							<div class="td">房产类型:</div>
							<div class="td">
								<el-popover
									slot="reference"
									placement="top-start"
									width="200"
									trigger="hover"
									:content="
										infoVO.propertyType ? `租赁,租期${infoVO.rentTime}年，租金${infoVO.rentMoney}元/月` : '自有'
									"
								>
									<span slot="reference">
										{{ infoVO.propertyType ? `租赁,租期${infoVO.rentTime}年，租金${infoVO.rentMoney}元/月` : '自有' }}
									</span>
								</el-popover>
							</div>
						</div>
						<div class="tr">
							<div class="td">店铺类型:</div>
							<div class="td">{{ infoVO.shopType | ConversionShopType }}</div>
						</div>
						<div class="tr">
							<div class="td">是否安装公司招牌：</div>
							<div class="td">{{ infoVO.isSign ? '是' : '否' }}</div>
						</div>
						<div class="tr">
							<div class="td">是否安装LED屏：</div>
							<div class="td">{{ infoVO.isLed ? '是' : '否' }}</div>
						</div>
					</div>
				</div>
			</div>

			<div class="archive-content">
				<el-form>
					<el-form-item class="form_item" v-if="infoVO.isSign == 0" label="不能安装公司招牌的证明材料"></el-form-item>
					<el-form-item label="" v-if="infoVO.isSign == 0">
						<el-upload
							class="displaynone"
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							list-type="picture-card"
							accept="doc, docx, pdf, wps, bmp, jpg, png"
							disabled
							:file-list="imglistProve"
						>
							<i slot="default" class="el-icon-plus"></i>
							<div slot="file" slot-scope="{ file }">
								<img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
								<span class="el-upload-list__item-actions">
									<span class="el-upload-list__item-preview" @click="imgPreview(file)">
										<i class="el-icon-zoom-in"></i>
									</span>
									<span class="el-upload-list__item-delete" @click="imglistThreeClickone(file, '装修拆除照片')">
										<i class="el-icon-download"></i>
									</span>
								</span>
							</div>
						</el-upload>
					</el-form-item>
					<el-form-item class="form_item" label="门面、周边、体验区照片与招牌、体验区测量图"></el-form-item>
					<el-form-item label="">
						<el-upload
							class="displaynone"
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							list-type="picture-card"
							accept="doc, docx, pdf, wps, bmp, jpg, png"
							disabled
							:file-list="imglistmeasuring"
						>
							<i slot="default" class="el-icon-plus"></i>
							<div slot="file" slot-scope="{ file }">
								<img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
								<span class="el-upload-list__item-actions">
									<span class="el-upload-list__item-preview" @click="imgPreview(file)">
										<i class="el-icon-zoom-in"></i>
									</span>
									<span class="el-upload-list__item-delete" @click="imglistThreeClickone(file, '装修拆除照片')">
										<i class="el-icon-download"></i>
									</span>
								</span>
							</div>
						</el-upload>
					</el-form-item>
					<div v-if="moveVO.auditStatus == 5 || moveVO.auditStatus == 6">
						<el-form-item class="form_item" label="旧门店拆除照片"></el-form-item>
						<el-form-item label="">
							<el-upload
								class="displaynone"
								:action="$store.getters['system/getOssUploadUrl']"
								:headers="$store.getters['system/getSignatureVerification']"
								list-type="picture-card"
								accept="doc, docx, pdf, wps, bmp, jpg, png"
								disabled
								:file-list="oldEchoImg"
							>
								<i slot="default" class="el-icon-plus"></i>
								<div slot="file" slot-scope="{ file }">
									<img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
									<span class="el-upload-list__item-actions">
										<span class="el-upload-list__item-preview" @click="imgPreview(file)">
											<i class="el-icon-zoom-in"></i>
										</span>
										<span class="el-upload-list__item-delete" @click="oldDownload(file, '旧门店拆除照片')">
											<i class="el-icon-download"></i>
										</span>
									</span>
								</div>
							</el-upload>
						</el-form-item>
						<el-form-item class="form_item" label="新门店装修照片"></el-form-item>
						<el-form-item label="">
							<el-upload
								class="displaynone"
								:action="$store.getters['system/getOssUploadUrl']"
								:headers="$store.getters['system/getSignatureVerification']"
								list-type="picture-card"
								accept="doc, docx, pdf, wps, bmp, jpg, png"
								disabled
								:file-list="newEchoImg"
							>
								<i slot="default" class="el-icon-plus"></i>
								<div slot="file" slot-scope="{ file }">
									<img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
									<span class="el-upload-list__item-actions">
										<span class="el-upload-list__item-preview" @click="imgPreview(file)">
											<i class="el-icon-zoom-in"></i>
										</span>
										<span class="el-upload-list__item-delete" @click="newDownload(file, '新门店装修照片')">
											<i class="el-icon-download"></i>
										</span>
									</span>
								</div>
							</el-upload>
						</el-form-item>
					</div>
					<div v-if="moveVO.auditStatus == 7 || moveVO.auditStatus == 4">
						<el-form-item class="form_item" label="撤销信息"></el-form-item>
						<el-form-item label="申请原因:">
							{{ moveVO.cancelReason || '--' }}
						</el-form-item>
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
										<span class="el-upload-list__item-delete" @click="newDownload(file, '新门店装修照片')">
											<i class="el-icon-download"></i>
										</span>
									</span>
								</div>
							</el-upload>
						</el-form-item>
					</div>
				</el-form>
			</div>
			<div class="rear-text">操作记录</div>
			<tableList :dataSource="recording" :columns="RECORDING_COLUMNS">
				<template v-slot:reason="{ row }">
					<el-popover slot="reference" placement="top-start" width="200" trigger="hover" :content="row.reason">
						<span class="reason-style" slot="reference">{{ row.reason }}</span>
					</el-popover>
				</template>
			</tableList>
		</el-card>

		<actionBar>
			<template>
				<el-button type="primary" @click="$closeSelf()" class="btn">返 回</el-button>
				<span v-permission="'move_approval_detail_revoke'">
					<el-button
						class="btn"
						type="primary"
						@click="revoke"
						v-if="moveVO.auditStatus == 3 || moveVO.auditStatus == 1"
					>
						撤销申请
					</el-button>
				</span>
				<span v-permission="'move_approval_detail_audit'">
					<el-button class="btn" type="primary" @click="review" v-if="moveVO.auditStatus == 3">审批</el-button>
				</span>
				<span v-permission="'move_approval_detail_out_move'">
					<el-button class="btn" type="primary" @click="carryOut" v-if="moveVO.auditStatus == 1">完成搬迁</el-button>
				</span>
				<span v-permission="'move_approval_detail_out_accept'">
					<el-button class="btn" type="primary" @click="accept" v-if="moveVO.auditStatus == 6">完成受理</el-button>
				</span>
				<span v-permission="'move_approval_detail_stop_accept'">
					<el-button class="btn" type="primary" @click="revokeAccept" v-if="moveVO.auditStatus == 7">
						撤销受理
					</el-button>
				</span>
			</template>
		</actionBar>

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
							:on-preview="imgPreview"
							:before-upload="beforeVideoUpload"
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

		<el-dialog title="完成搬迁" v-drag :visible.sync="moveVisible" width="720px">
			<el-form>
				<el-form-item label="旧门店拆除照片"></el-form-item>
				<el-form-item label="">
					<el-upload
						:class="[oldList.length == 2 ? 'old' : '']"
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						list-type="picture-card"
						:on-success="oldsuccess"
						:on-remove="oldRemove"
						:limit="2"
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
						:class="[newList.length == 4 ? 'new' : '']"
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						list-type="picture-card"
						:on-success="moveSuccessNew"
						:on-remove="moveRemoveNew"
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
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="moveVisible = false">取 消</el-button>
				<el-button type="primary" @click="moveSave">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog :visible.sync="dialogVisible" width="40%">
			<img width="100%" :src="dialogImageUrl" alt="" />
		</el-dialog>
	</div>
</template>

<script>
import { MOVE_APPROVAL_STATUS_BQ, MOVE_APPROVAL_SHOPTYPE, RECORDING_COLUMNS } from './config';
import { formatDate, downloadUrlFile, uploadFileType } from 'util/formValidation.js';
export default {
	name: 'moveApprovalDetail',
	data() {
		return {
			RECORDING_COLUMNS,
			moveVisible: false,
			newList: [],
			oldList: [],
			title: '完成搬迁受理审批',
			isAddMsg: false,
			cancelReason: '',
			revokeList: [],
			isRevoke: false,
			revokeDialogVisible: false,
			ruleForm: {
				auditStatus: 1,
				auditOpinion: '',
			},
			option: [
				{ value: 1, label: '审核通过' },
				{ value: 2, label: '审核驳回' },
			],
			moveVO: {},
			infoVO: {},
			centerDialogVisible: false,
			dialogImageUrl: '',
			dialogVisible: false,
			rules: {
				auditStatus: [{ required: true, message: '请选择', trigger: 'change' }],
				auditOpinion: [{ required: false, message: '请输入意见', trigger: 'blur' }],
			},
			oldEchoImg: [],
			newEchoImg: [],
			imglistProve: [],
			imglistmeasuring: [],
			pageHeadData: {
				store: {
					code: '',
					name: '',
				},
				user: {
					realname: '',
					cardNo: '',
				},
			},
			recording: [],
			auditStatus: null,
		};
	},
	filters: {
		MOVE_APPROVAL_STATUS_BQ: val => (val in MOVE_APPROVAL_STATUS_BQ ? MOVE_APPROVAL_STATUS_BQ[val] : '--'),
		ConversionShopType: val => MOVE_APPROVAL_SHOPTYPE[val] || '--',
		formatDate: val => formatDate(val) || '--',
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
			let { auditStatus, auditOpinion, dealTime, approveTime, dealOpinion } = this.moveVO;
			let auditText, statusText, auditTimeText;
			// '1': '审核通过','2': '已驳回','3': '待审核','4': '已撤销','5': '已完成', '7': '撤销待受理','6': '完成待受理',
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
				auditTimeText = approveTime;
				auditText = auditOpinion;
			};
			if (auditStatus == 3) {
				funText();
				statusText = '待审核';
			} else if (auditStatus == 1) {
				fun();
				statusText = '审核通过';
				if (dealTime) {
					statusText = '审核驳回';
					fundeal();
				}
			} else if (auditStatus == 2) {
				fun();
				statusText = '审核驳回';
			} else if (auditStatus == 5) {
				statusText = '审核通过';
				fun();
				if (dealTime) fundeal();
			} else if (auditStatus == 4) {
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
	created() {
		this.loadData();
		this.getHeadDate();
		this.getMoveApplyRecord();
	},
	methods: {
		oldDownload({ url }, fileName) {
			downloadUrlFile(url, fileName, () => {
				this.$message.success('下载成功');
			});
		},
		newDownload({ url }, fileName) {
			downloadUrlFile(url, fileName, () => {
				this.$message.success('下载成功');
			});
		},
		moveRemoveNew(res) {
			this.newList.forEach((e, index) => {
				if (e.fileName === res.name) this.newList.splice(index, 1);
			});
		},
		moveSuccessNew(res, file) {
			if (res.success) this.newList.push({ fileName: file.name, urls: res.datas.fileUrlKey });
		},
		oldRemove(res) {
			this.oldList.forEach((e, index) => {
				if (e.fileName === res.name) this.oldList.splice(index, 1);
			});
		},
		oldsuccess(res, file) {
			if (res.success) this.oldList.push({ fileName: file.name, urls: res.datas.fileUrlKey });
		},
		async loadHandle(auditStatus, callback) {
			const res = await this.$fetch(`/mgmt/store/move/getStoreMoveApply?id=${this.$route.query.id}`);
			if (res && res.data.moveVO.auditStatus == auditStatus) {
				callback && callback();
			} else {
				this.$message.warning('操作已更新');
				this.loadData();
			}
		},
		carryOut() {
			this.loadHandle(1, () => {
				this.moveVisible = true;
				this.oldList = [];
				this.newList = [];
			});
		},
		async moveSave() {
			this.isAddMsg = true;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/move/finishStoreMoveApply`,
				data: {
					id: this.$route.query.id,
					newPic: this.newList.map(e => e.urls),
					oldPic: this.oldList.map(e => e.urls),
					port: 0,
				},
			});
			if (res.code === 200) {
				this.$message.success(res.message);
				this.loadData();
				this.getMoveApplyRecord();
				this.moveVisible = false;
			}
			this.isAddMsg = false;
		},
		async revoke() {
			let { id } = this.$route.query;
			this.ruleForm.id = id;
			this.cancelApplication = '';
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
		resetFrom() {
			this.ruleForm.auditOpinion = '';
			this.ruleForm.auditStatus = 1;
		},
		review() {
			this.loadHandle(3, () => {
				this.ruleForm.id = this.$route.query.id;
				this.centerDialogVisible = true;
				this.resetFrom();
				this.title = '搬迁申请审批';
			});
		},
		async updateStoreMoveApply() {
			this.isAddMsg = true;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/move/updateStoreMoveApply`,
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
		async getMoveApplyRecord() {
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/store/move/getMoveApplyRecord`,
				params: { id: this.$route.query.id, pageSize: 999, pageNum: 1 },
			});
			if (res && res.code === 200) {
				this.recording = res.data.list;
			}
		},
		messageSuccess(res) {
			this.loadData();
			this.$dispatch('BANQIANSHENPI_LIST');
			this.getMoveApplyRecord();
			this.$message.success(res.message);
		},
		messageError(res) {
			this.$message({
				message: res.data.message,
				type: 'error',
			});
		},
		async dealMoveApply() {
			this.isAddMsg = true;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/move/dealMoveApply`,
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
			if (this.moveVO.auditStatus >= 6) {
				this.dealMoveApply();
			} else {
				this.updateStoreMoveApply();
			}
		},
		revokeAccept() {
			this.loadHandle(7, () => {
				this.ruleForm.id = this.$route.query.id;
				this.centerDialogVisible = true;
				this.title = '撤销申请受理审批';
				this.resetFrom();
			});
		},
		accept() {
			this.loadHandle(6, () => {
				this.ruleForm.id = this.$route.query.id;
				this.centerDialogVisible = true;
				this.title = '完成搬迁受理审批';
				this.resetFrom();
			});
		},
		async cancleStoreMoveApply() {
			this.isRevoke = true;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/store/move/cancleStoreMoveApply`,
				data: {
					id: this.ruleForm.id,
					cancelApplication: this.revokeList.map(e => e.urls),
					port: 0,
					cancelReason: this.cancelReason,
				},
			});
			if (res && res.code == 200) {
				this.messageSuccess(res);
			} else if (res) {
				this.messageError(res);
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
				if (e.fileName === res.name) this.revokeList.splice(index, 1);
			});
		},
		imglistThreeClickone({ url }, fileName) {
			downloadUrlFile(url, fileName, () => {
				this.$message.success('下载成功');
			});
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
		close() {
			this.centerDialogVisible = false;
		},
		async loadData() {
			const res = await this.$fetch(`/mgmt/store/move/getStoreMoveApply?id=` + this.$route.query.id);
			if (res && res.data) {
				let { infoVO, moveVO, movePicVO } = res.data;
				this.infoVO = infoVO;
				this.moveVO = moveVO;
				this.oldEchoImg =
					movePicVO && movePicVO.oldPic.length > 0
						? movePicVO.oldPic.map(e => ({ name: '1', url: e }))
						: [{ name: '0', url: require('assets/img-empty.png') }];
				this.newEchoImg =
					movePicVO && movePicVO.newPic.length > 0
						? movePicVO.newPic.map(e => ({ name: '1', url: e }))
						: [{ name: '0', url: require('assets/img-empty.png') }];
				this.revokeImg =
					movePicVO && movePicVO.cancelApplication.length > 0
						? movePicVO.cancelApplication.map(e => ({ name: '1', url: e }))
						: [{ name: '0', url: require('assets/img-empty.png') }];
				this.imglistProve =
					movePicVO && movePicVO.noSignPic.length > 0
						? movePicVO.noSignPic.map((e, i) => ({ name: i, url: e }))
						: [{ name: '0', url: require('assets/img-empty.png') }];
				this.imglistmeasuring =
					movePicVO && movePicVO.storeMeasurePic.length > 0
						? movePicVO.storeMeasurePic.map((e, i) => ({ name: i, url: e }))
						: [{ name: '0', url: require('assets/img-empty.png') }];
			}
		},
		imgPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
	},
};
</script>

<style lang="scss" scoped>
.card-gap {
	margin-top: 20px;
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
	margin-top: 20px;
}

.form_item ::v-deep .el-form-item__label {
	font-size: 18px;
}
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
.displaynone ::v-deep .el-upload--picture-card {
	display: none;
}
.had-text {
	font-size: 14px;
}
.text-span {
	margin-right: 20px;
}
.rear-text {
	margin-bottom: 10px;
	font-size: 18px;
	line-height: 50px;
}

.btn {
	margin-right: 10px;
}
.reason-style {
	overflow: hidden;
	text-overflow: ellipsis;
	-ms-text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
