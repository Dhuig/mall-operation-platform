<template>
	<div>
		<el-card class="card-gap">
			<div class="had-text">
				<span>服务中心编号：</span>
				<span class="text-span">{{ pageData.storeCode }}</span>
				<span>服务中心名称：</span>
				<span class="text-span">{{ pageData.storeName }}</span>
				<span>负责人卡号：</span>
				<span class="text-span">{{ pageHeadData.user.cardNo }}</span>
				<span>负责人姓名：</span>
				<span>{{ pageHeadData.user.realname }}</span>
			</div>
		</el-card>
		<el-card class="card-gap">
			<el-form :model="pageData" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
				<el-form-item label="审批状态：">
					<span :style="{ color: pageData.auditStatus == 2 ? 'red' : 'blue' }">
						{{ pageData.auditStatus | REFUND_APPROVAL_STATUS }}
					</span>
				</el-form-item>
				<el-form-item label="申请理由：">{{ pageData.applyReason }}</el-form-item>
				<el-form-item label="申请凭证：">
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						class="disUoloadSty"
						list-type="picture-card"
						:on-success="handleSuccessPC"
						:on-preview="handlePictureCardPreview"
						accept="doc, docx, pdf, wps, bmp, jpg, png"
						:on-error="onError"
						:on-exceed="onError"
						disabled
						:file-list="imglist"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible" v-drag><img width="100%" :src="dialogImageUrl" alt="" /></el-dialog>
				</el-form-item>
			</el-form>
			<div class="text-div">
				<p class="text-p">
					<span>申请时间：</span>
					<span>{{ pageData.createTime }}</span>
				</p>
				<p class="text-p">
					<span>申请人：</span>
					<span>{{ pageData.applyPeople }}</span>
				</p>
				<p class="text-p" v-if="pageData.auditStatus !== 3">
					<span>审批时间：</span>
					<span>{{ pageData.updateTime }}</span>
				</p>
				<p class="text-p" v-if="pageData.auditStatus !== 3">
					<span>审批人：</span>
					<span>{{ pageData.auditPeople }}</span>
				</p>
				<p class="text-p" v-if="pageData.auditStatus !== 3">
					<span>审批意见：</span>
					<el-popover
						slot="reference"
						placement="top-start"
						width="200"
						trigger="hover"
						:content="pageData.auditOpinion || '--'"
					>
						<span slot="reference">{{ pageData.auditOpinion || '--' }}</span>
					</el-popover>
				</p>
			</div>
		</el-card>
		<el-dialog :title="title" :visible.sync="centerDialogVisible" width="40%" :before-close="close" v-drag>
			<div>
				<el-form :model="ruleForm" :rules="rules" label-width="100px" ref="ruleForm" class="demo-ruleForm">
					<el-form-item label="审批结果：" prop="verifyStatus">
						<el-select v-model="ruleForm.verifyStatus" placeholder="请选择">
							<el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审批意见" prop="auditOpinion">
						<el-input
							type="textarea"
							:autosize="{ minRows: 7 }"
							show-word-limit
							maxlength="200"
							v-model="ruleForm.auditOpinion"
							placeholder="请填写意见"
						></el-input>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="close">取消</el-button>
				<el-button type="primary" :loading="isAddMsg" @click="addMsg">确定</el-button>
			</span>
		</el-dialog>
		<actionBar>
			<template>
				<el-button type="primary" @click="$closeSelf()">返 回</el-button>
				<el-button
					type="primary"
					@click="review"
					v-if="pageData.auditStatus == 3"
					v-permission="'other_approval_list_detail_audit'"
				>
					审 批
				</el-button>
			</template>
		</actionBar>
	</div>
</template>

<script>
import { QITASHENGQING_STATUS, REFUND_TYPE } from './config';
import { formatDate } from 'util/formValidation.js';
export default {
	name: 'otherApprovalListDetail',
	data() {
		return {
			isAddMsg: false,
			title: '审批',
			option: [
				{ value: 1, label: '通过' },
				{ value: 2, label: '驳回' },
			],
			ruleForm: {
				auditOpinion: '',
				verifyStatus: 1,
			},
			centerDialogVisible: false,
			dialogImageUrl: '',
			dialogVisible: false,
			rules: {
				verifyStatus: [{ required: true, message: '请选择', trigger: 'change' }],
				auditOpinion: [{ required: false, message: '请输入意见', trigger: 'blur' }],
			},
			pageData: {},
			imglist: [],
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
		};
	},
	watch: {
		'ruleForm.verifyStatus'(val) {
			this.rules.auditOpinion = [{ required: val === 2, message: '请输入意见', trigger: 'blur' }];
		},
	},
	filters: {
		REFUND_APPROVAL_STATUS: val => (val in QITASHENGQING_STATUS ? QITASHENGQING_STATUS[val] : '--'),
		refundType: val => (val in REFUND_TYPE ? REFUND_TYPE[val] : '--'),
		formatDate: val => (val ? formatDate(val) : '--'),
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
	created() {
		if (this.$route.query.id) {
			this.loadData();
			this.getHeadDate();
		}
	},
	methods: {
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
			this.$refs.ruleForm.clearValidate();
			this.ruleForm.auditOpinion = '';
		},
		async addMsg() {
			this.$refs['ruleForm'].validate(async valid => {
				if (valid) {
					this.isAddMsg = true;
					let id = this.$route.query.id;
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/store/other/auditOtherApply`,
						data: { id, ...this.ruleForm },
					});
					if (res && res.code == 200) {
						this.loadData();
						this.$dispatch('QITASHENPI_LIST');
						this.centerDialogVisible = false;
						this.$message.success(res.message);
					}
					this.isAddMsg = false;
				}
			});
		},
		async loadData() {
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/store/other/getOtherApplyInfo?id=` + this.$route.query.id,
			});
			if (res && res.data) {
				let { applyVoucherPic } = res.data;
				this.pageData = res.data;
				this.imglist =
					applyVoucherPic.length > 0
						? applyVoucherPic.map((e, i) => ({ name: i, url: e }))
						: [{ name: '0', url: require('assets/img-empty.png') }];
			}
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		async review() {
			this.centerDialogVisible = true;
			this.ruleForm.auditOpinion = '';
		},
		onError() {
			this.$message.warning('只能上传3个文件');
		},
		handleSuccessPC(res, file) {
			if (res.success) this.pushData.enclosureVos.push({ fileName: file.name, urls: res.datas.fileUrlKey });
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__wrapper {
	overflow: auto;
}
.card-gap {
	margin-top: 20px;
	.title-text {
		padding: 20px;
		padding-top: 0;
		margin-bottom: 20px;
		border-bottom: 1px solid $color-border;
	}
}
::v-deep .el-upload--picture-card {
	display: none; /* 上传按钮隐藏 */
}
.text-div {
	padding: 0 50px;
	overflow: hidden;
	.text-p {
		width: 50%;
		float: left;
		line-height: 50px;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		-ms-text-overflow: ellipsis;
		white-space: nowrap;
	}
}
.text-span {
	margin-right: 20px;
}
.had-text {
	font-size: 14px;
}
</style>
