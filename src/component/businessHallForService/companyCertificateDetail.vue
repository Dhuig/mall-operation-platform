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
				<el-form-item label="审批状态：" v-if="pageData.applyReason !== '批量导入'">
					<span :style="{ color: pageData.auditStatus == 2 ? 'red' : 'blue' }">{{ pageData.auditStatusStr }}</span>
				</el-form-item>
				<el-form-item label="申请理由：">{{ pageData.applyReason }}</el-form-item>
				<el-form-item label="申请凭证：">
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						class="disUoloadSty"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						accept="doc, docx, pdf, wps, bmp, jpg, png"
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
					<span>{{ pageData.applyTime }}</span>
				</p>
				<p class="text-p">
					<span>申请人：</span>
					<span>{{ pageData.applicantName }}</span>
				</p>
				<p class="text-p" v-if="pageData.auditStatus == '1'">
					<span>下载有效期：</span>
					<span>{{ pageData.downloadDeadline | formatDateDefault }}</span>
					<span v-if="isItinvalid" style="color: red; margin-left: 10px">已失效</span>
				</p>
			</div>
			<div class="text-div">
				<p class="text-p" v-if="pageData.auditStatus !== 0">
					<span>审批时间：</span>
					<span>{{ pageData.auditTime || '--' }}</span>
				</p>
				<p class="text-p" v-if="pageData.auditStatus !== 0">
					<span>审核人：</span>
					<span>{{ pageData.auditName || '--' }}</span>
				</p>
				<p class="text-p" v-if="pageData.auditStatus != 0" :style="{ color: pageData.auditStatus == 1 ? '' : 'red' }">
					<span>{{ ruleForm.auditStatus == 1 ? '审核意见' : '驳回意见' }}：</span>
					<span>{{ pageData.auditOpinion || '--' }}</span>
				</p>
			</div>
			<el-form label-width="140px" class="demo-ruleForm">
				<el-form-item label="申请证件：">
					<tableList :dataSource="data" :options="options" :columns="COMPANY_CERTIFICATE_COLUMNS_DETAIL"></tableList>
				</el-form-item>
			</el-form>
		</el-card>
		<el-dialog :title="title" :visible.sync="centerDialogVisible" width="40%" :before-close="close" v-drag>
			<div>
				<el-form :model="ruleForm" :rules="rules" label-width="140px" ref="ruleForm2" class="demo-ruleForm">
					<el-form-item label="审批结果：" prop="auditStatus">
						<el-select v-model="ruleForm.auditStatus" placeholder="请选择">
							<el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="证件下载有效期" prop="downloadDeadline" v-if="ruleForm.auditStatus == 1">
						<el-date-picker
							class="date-picker"
							v-model="ruleForm.downloadDeadline"
							type="date"
							placeholder="选择日期时间"
							:picker-options="timeDisabel"
							value-format="yyyy-MM-dd HH:mm:ss"
						></el-date-picker>
					</el-form-item>
					<el-form-item label="审批意见" prop="auditOpinion">
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
		<actionBar>
			<template>
				<el-button type="primary" @click="$closeSelf()">返 回</el-button>
				<el-button
					type="primary"
					@click="review"
					v-if="pageData.auditStatus == '0'"
					v-permission="'company_certificate_detail_audit'"
				>
					审 批
				</el-button>
			</template>
		</actionBar>
	</div>
</template>

<script>
import { REFUND_TYPE, COMPANY_CERTIFICATE_COLUMNS_DETAIL } from './config';
import { formatDate, formatDateDefault } from 'util/formValidation.js';
export default {
	name: 'companyCertificateDetail',
	data() {
		return {
			isAddMsg: false,
			timeDisabel: {
				disabledDate(time) {
					return time.getTime() < Date.now();
				},
			},
			option: [
				{ value: 1, label: '同意' },
				{ value: 2, label: '驳回' },
			],
			title: '审批',
			ruleForm: {
				downloadDeadline: '',
				auditOpinion: '',
				auditStatus: 1,
			},
			centerDialogVisible: false,
			dialogImageUrl: '',
			dialogVisible: false,
			rules: {
				downloadDeadline: [{ required: true, message: '请选择时间', trigger: 'blur' }],
				auditOpinion: [{ required: false, message: '请输入审批意见', trigger: 'blur' }],
				auditStatus: [{ required: true, message: '请选择时间', trigger: 'change' }],
			},
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			data: [],
			pageData: {},
			imglist: [],
			COMPANY_CERTIFICATE_COLUMNS_DETAIL,
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
		'ruleForm.auditStatus'(val) {
			this.rules.auditOpinion = [{ required: val === 2, message: '请输入意见', trigger: 'blur' }];
		},
	},
	filters: {
		refundType: val => (val in REFUND_TYPE ? REFUND_TYPE[val] : '--'),
		formatDate: val => (val ? formatDate(val) : '--'),
		formatDateDefault: val => (val ? formatDateDefault(val) : '--'),
	},
	computed: {
		isItinvalid() {
			let val = false;
			let pageDate = new Date(formatDateDefault(this.pageData.downloadDeadline)).getTime();
			let nowDate = formatDateDefault(Date.now());
			if (formatDateDefault(pageDate) === nowDate) {
				val = false;
			} else if (pageDate < Date.now()) {
				val = true;
			} else {
				val = false;
			}
			return val;
		},
	},
	created() {
		this.loadData();
		this.getHeadDate();
	},
	methods: {
		formatDateDefault,
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
			this.$refs.ruleForm2.clearValidate();
			this.ruleForm.auditOpinion = '';
		},
		addMsg() {
			this.$refs['ruleForm2'].validate(async valid => {
				if (valid) {
					this.isAddMsg = true;
					let id = this.$route.query.id;
					let { auditOpinion, downloadDeadline, auditStatus } = this.ruleForm;
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/sys/store/certificate/audit`,
						data: { id, auditOpinion, auditStatus, downloadDeadline: downloadDeadline },
					});
					if (res && res.code == 200) {
						this.loadData();
						this.$dispatch('ZHENGJIANBAOSHENPI_LIST');
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
				url: `/mgmt/sys/store/certificate/detail?id=` + this.$route.query.id,
			});
			if (res && res.code == 200) {
				let { certificateList, applyVoucher } = res.data;
				this.pageData = res.data;
				this.data = certificateList;
				this.imglist = applyVoucher
					? applyVoucher.map((e, index) => ({ url: e, name: index }))
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
	},
};
</script>

<style lang="scss" scoped>
.card-gap {
	margin-top: 20px;
	.title-text {
		padding: 20px;
		padding-top: 0;
		margin-bottom: 20px;
		border-bottom: 1px solid $color-border;
	}
}

::v-deep .el-dialog__wrapper {
	overflow: auto;
}
::v-deep .el-upload--picture-card {
	display: none; /* 上传按钮隐藏 */
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
.had-text {
	font-size: 14px;
}
// ::v-deep .el-button--text {
// 	display: none; /* 此刻按钮隐藏 */
// }
</style>
