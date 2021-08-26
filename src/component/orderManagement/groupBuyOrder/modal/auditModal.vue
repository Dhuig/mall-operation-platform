<template>
	<div class="refund-ticket-audit">
		<el-dialog :title="title" :visible.sync="auditModalProps.show" v-drag>
			<el-form
				:model="refundTicketAuditForm"
				:rules="refundTicketAuditFormRules"
				ref="refundTicketAuditForm"
				label-width="100px"
			>
				<el-form-item prop="orderNo" label="订单号：">
					{{ auditModalProps.orderNo }}
				</el-form-item>
				<p class="order-state">{{ GROUP_ORDER_STATE[auditModalProps.state] }}</p>
				<el-form-item prop="auditResult" label="审核结果：">
					<el-radio-group v-model="refundTicketAuditForm.auditResult">
						<el-radio :label="0">审核不通过</el-radio>
						<el-radio :label="1">审核通过</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item prop="auditView" label="审核意见：">
					<el-input type="textarea" v-model="refundTicketAuditForm.auditView"></el-input>
				</el-form-item>
				<el-form-item label="附件：">
					<el-upload
						class="upload-demo"
						multiple
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="ossParams"
						:on-remove="handleRemove"
						:before-upload="beforeAvatarUpload"
						:on-success="handleSuccess"
						:limit="3"
						accept="doc,docx,pdf,wps,bmp,jpg,png"
					>
						<el-button size="small" type="primary">点击上传</el-button>
						<div slot="tip" class="el-upload__tip tip-title" ref="up_dom">
							支持格式doc、docx、pdf、wps、bmp、jpg、png，最大10M，3个文件
						</div>
					</el-upload>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="auditModalProps.show = false">取 消</el-button>
				<el-button type="primary" @click="audit">保 存</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { uploadFileType } from 'util/formValidation';
export default {
	name: 'auditModal',
	data() {
		return {
			refundTicketAuditForm: {
				attachments: [],
				auditResult: null,
				auditView: '',
			},
			refundTicketAuditFormRules: {
				auditResult: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
				auditView: [{ required: true, message: '请填写审核意见', trigger: 'blur' }],
			},
			ossParams: {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			},
		};
	},
	props: ['auditModalProps', 'loadData', 'GROUP_ORDER_STATE'],
	computed: {
		title() {
			return [1, 2].includes(this.auditModalProps.state) ? '团购单审核' : '退票审核';
		},
	},
	methods: {
		// 大小不超过10M。
		beforeAvatarUpload(file) {
			const whiteList = ['jpg', 'png', 'bmp', 'wps', 'pdf', 'docx', 'doc'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		audit() {
			this.$confirm('确定此次审核操作?', `${this.title}确认`, {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				this.$refs.refundTicketAuditForm.validate(async valid => {
					if (valid) {
						const { attachments, auditResult, auditView } = this.refundTicketAuditForm;
						const { orderNo } = this.auditModalProps;
						const res = await this.$fetch({
							method: 'PUT',
							url: '/mgmt/inventory/group-order/audit',
							data: {
								attachments,
								auditResult,
								auditView,
								orderNo,
							},
						});
						if (res.code === 200) {
							this.$message.success(res.message);
							this.loadData();
							this.$emit('close');
						}
					} else {
						return;
					}
				});
			});
		},
		// 上传参数接口
		// async getUploadInfo() {
		// 	const res = await this.$fetch('http://42.194.215.85:8908/mgmt/cms/common/getUploadParams');
		// 	const { storageType, timeStamp, clientKey, sign, url } = res.data;
		// 	this.ossParams = {
		// 		...this.ossParams,
		// 		storageType,
		// 		timeStamp,
		// 		clientKey,
		// 		sign,
		// 	};
		// 	this.url = url;
		// },
		handleRemove(file) {
			this.refundTicketAuditForm.attachments = this.refundTicketAuditForm.attachments.filter(x => x.uid != file.uid);
		},
		handleSuccess(response, file) {
			const {
				datas: { fileUrlKey, msg },
				success,
			} = response;
			const { name, uid } = file;
			if (success) {
				this.$message({
					type: 'success',
					message: `${name}-${msg}`,
				});
				this.refundTicketAuditForm.attachments = [
					...this.refundTicketAuditForm.attachments,
					{ url: fileUrlKey, name, uid },
				];
				console.log(this.refundTicketAuditForm.attachments);
			} else {
				this.$message({
					type: 'error',
					message: `${name}-${msg}`,
				});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.refund-ticket-audit {
	.order-state {
		font-size: 26px;
		font-weight: 600;
		color: #1241ea;
		margin: 14px 0;
		padding-left: 26px;
	}
}
</style>
