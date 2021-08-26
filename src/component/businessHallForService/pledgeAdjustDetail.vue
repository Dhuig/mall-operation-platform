<template>
	<div>
		<el-card class="card-gap">
			<div class="had-text">
				<span>服务中心编号：</span>
				<span class="text-span">{{ pageData.storeCode }}</span>
				<span>服务中心名称：</span>
				<span class="text-span">{{ pageData.storeName }}</span>
				<span>负责人卡号：</span>
				<span class="text-span">{{ pageData.submitManNo }}</span>
				<span>负责人姓名：</span>
				<span>{{ pageData.submitMan }}</span>
			</div>
		</el-card>
		<el-card class="card-gap">
			<el-form :model="pageData" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
				<el-form-item label="审批状态：">
					<span :style="{ color: pageData.status == 4 || pageData.status == 3 ? 'red' : 'blue' }">
						{{ pageData.status | REFUND_APPROVAL_STATUS }}
					</span>
				</el-form-item>
				<el-form-item label="申请理由：">{{ pageData.reason }}</el-form-item>
				<el-form-item label="押货单号：">{{ pageData.orderSn }}</el-form-item>
				<el-form-item label="修改说明：">{{ pageData.remarks }}</el-form-item>
			</el-form>
			<div class="text-div">
				<p class="text-p">
					<span>申请时间：</span>
					<span>{{ formatDate(pageData.createTime) }}</span>
				</p>
				<p class="text-p">
					<span>申请人：</span>
					<span>{{ pageData.submitMan }}</span>
				</p>
				<p class="text-p" v-if="pageData.status !== 1 && pageData.status !== 4">
					<span>审批时间：</span>
					<span>{{ formatDate(pageData.auditTime) }}</span>
				</p>
				<p class="text-p" v-if="pageData.status !== 1 && pageData.status !== 4">
					<span>审批人：</span>
					<span>{{ pageData.auditMan }}</span>
				</p>
				<p class="text-p" v-if="pageData.status !== 1 && pageData.status !== 4">
					<span>审批意见：</span>
					<el-popover
						slot="reference"
						placement="top-start"
						width="200"
						trigger="hover"
						:content="pageData.auditRemarks || '--'"
					>
						<span slot="reference">{{ pageData.auditRemarks || '--' }}</span>
					</el-popover>
				</p>
			</div>
		</el-card>
		<el-dialog :title="title" :visible.sync="centerDialogVisible" width="30%" :before-close="close" v-drag>
			<div>
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
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
					v-if="pageData.status == 1"
					v-permission="'pledge_adjust_detail_audit'"
				>
					审 批
				</el-button>
			</template>
		</actionBar>
	</div>
</template>

<script>
import { YAHUODANSHENPI_STATUS, REFUND_TYPE } from './config';
import { formatDate } from 'util/formValidation.js';
export default {
	name: 'pledgeAdjustDetail',
	data() {
		return {
			isAddMsg: false,
			title: '审批',
			ruleForm: {
				auditOpinion: '',
				verifyStatus: 1,
			},
			option: [
				{ value: 1, label: '同意' },
				{ value: 2, label: '驳回' },
			],
			centerDialogVisible: false,
			dialogImageUrl: '',
			dialogVisible: false,
			rules: {
				auditOpinion: [{ required: true, message: '请输入意见', trigger: 'blur' }],
				verifyStatus: [{ required: false, message: '请选择审批结果', trigger: 'change' }],
			},
			pageData: {},
			imglist: [],
		};
	},
	watch: {
		'ruleForm.verifyStatus'(val) {
			this.rules.auditOpinion = [{ required: val === 2, message: '请输入意见', trigger: 'blur' }];
		},
	},
	filters: {
		REFUND_APPROVAL_STATUS: val => (val in YAHUODANSHENPI_STATUS ? YAHUODANSHENPI_STATUS[val] : '--'),
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
		if (this.$route.query.id) this.loadData();
	},
	methods: {
		formatDate,
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
					let auditStatus = this.ruleForm.verifyStatus === 1 ? 1 : 0;
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/inventory/order/apply/audit`,
						data: { id, auditRemarks: this.ruleForm.auditOpinion, auditStatus },
					});
					if (res && res.code == 200) {
						this.loadData();
						this.$dispatch('YAHUODANSHENPI_LIST');
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
				url: `/mgmt/inventory/order/apply/detail?applyId=` + this.$route.query.id,
			});
			if (res && res.data) {
				this.pageData = res.data;
				// this.imglist = [];
				// res.data.applyVoucherPic.forEach((e, i) => {
				// 	this.imglist.push({ name: i, url: e });
				// });
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
