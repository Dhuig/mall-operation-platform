<template>
	<div>
		<el-card class="card-gap">
			<div class="had-text">
				<span>服务中心编号：</span>
				<span class="text-span">{{ pageHeadData.store.code ? pageHeadData.store.code : '--' }}</span>
				<span>服务中心名称：</span>
				<span class="text-span">{{ pageHeadData.store.name ? pageHeadData.store.name : '--' }}</span>
				<span>负责人卡号：</span>
				<span class="text-span">{{ pageHeadData.user.cardNo ? pageHeadData.user.cardNo : '--' }}</span>
				<span>负责人姓名：</span>
				<span>{{ pageHeadData.user.realname ? pageHeadData.user.realname : '--' }}</span>
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="title-text">审批详情</div>
			<el-form :model="pageData" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
				<el-form-item label="审批状态：">
					<span :style="{ color: pageData.verifyStatus == 2 || pageData.verifyStatus === 3 ? 'red' : 'blue' }">
						{{ pageData.verifyStatus | REFUND_APPROVAL_STATUS }}
					</span>
				</el-form-item>
				<el-form-item label="退款理由：">{{ pageData.refundReason }}</el-form-item>
				<el-form-item label="退款类型：">{{ pageData.refundType | refundType }}</el-form-item>
				<el-form-item label="退款金额：">
					<span v-if="pageData.refundAmount">￥{{ pageData.refundAmount }}</span>
				</el-form-item>
				<el-form-item label="退款凭证：">
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
				<el-form-item label="退款账户名：">{{ pageData.refundAccountName }}</el-form-item>
				<el-form-item label="退款账号：">{{ pageData.refundAccount }}</el-form-item>

				<el-form-item label="开户银行：">{{ pageData.openBank }}</el-form-item>

				<el-form-item label="开户支行：">{{ pageData.openBankBranch }}</el-form-item>
			</el-form>
			<div class="text-div">
				<p class="text-p">
					<span>申请时间：</span>
					<span>{{ pageData.applyTime | formatDate }}</span>
				</p>
				<p class="text-p">
					<span>申请人：</span>
					<span>{{ pageData.applyMan }}</span>
				</p>
				<p class="text-p" v-if="pageData.verifyTime">
					<span>审批时间：</span>
					<span>{{ pageData.verifyTime | formatDate }}</span>
				</p>
				<p class="text-p" v-if="pageData.verifyMan">
					<span>审批人：</span>
					<span>{{ pageData.verifyMan }}</span>
				</p>
				<p class="text-p" v-if="pageData.verifyRemark && pageData.verifyStatus == 2">
					<span>审批意见：</span>
					<span>{{ pageData.verifyRemark }}</span>
				</p>
				<p class="text-p" v-if="pageData.updateTime && pageData.verifyStatus == 4">
					<span>确认汇款时间：</span>
					<span>{{ pageData.updateTime | formatDate }}</span>
				</p>
				<p class="text-p" v-if="pageData.confirmMan">
					<span>确认人：</span>
					<span>{{ pageData.confirmMan }}</span>
				</p>
				<p class="text-p" v-if="pageData.successFailRemark">
					<span>汇款备注：</span>
					<span>{{ pageData.successFailRemark }}</span>
				</p>
				<!-- <p class="text-p" v-if="pageData.verifyRemark && pageData.verifyStatus == 2">
					<span>驳回意见：</span>
					<span>{{ pageData.verifyRemark }}</span>
				</p> -->
				<p class="text-p" v-if="pageData.updateTime && pageData.verifyStatus == 3">
					<span>确认失败时间：</span>
					<span>{{ pageData.updateTime | formatDate }}</span>
				</p>
			</div>
		</el-card>
		<el-dialog title="审批" :visible.sync="centerDialogVisible" width="50%" :before-close="close" v-drag>
			<div>
				<el-form :model="ruleForm" :rules="rules" ref="dolgruleForm" label-width="140px" class="demo-ruleForm">
					<el-form-item
						label=""
						v-if="ruleForm.verifyStatus == 1 && this.title !== '汇款成功' && this.title !== '汇款失败'"
					>
						确认后将通知分公司财务安排下线汇款
					</el-form-item>
					<el-form-item label="" v-if="this.title === '汇款成功'">确认分公司财务线下汇款成功，本流程完成</el-form-item>
					<el-form-item label="审批结果：" prop="verifyStatus" v-if="title == '审批同意' || title == '驳回意见'">
						<el-select v-model="ruleForm.verifyStatus" placeholder="请选择">
							<el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审批意见" prop="remark">
						<el-input
							type="textarea"
							:autosize="{ minRows: 7 }"
							show-word-limit
							maxlength="200"
							v-model="ruleForm.remark"
							:placeholder="placeholderMsg"
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
					@click="review('yes')"
					v-if="pageData.verifyStatus === 0"
					v-permission="'refund_list_detail_audit'"
				>
					审批
				</el-button>
				<el-button type="danger" @click="review('hksb')" v-if="pageData.verifyStatus === 1">汇款失败</el-button>
				<el-button type="primary" @click="review('hkcg')" v-if="pageData.verifyStatus === 1">汇款成功</el-button>
			</template>
		</actionBar>
	</div>
</template>

<script>
import { REFUND_APPROVAL_STATUS, REFUND_TYPE, CAOZUO_TYPE } from './config';
import { formatDate } from 'util/formValidation.js';
import qs from 'querystring';
export default {
	name: 'refundListDetail',
	data() {
		return {
			isAddMsg: false,
			placeholderMsg: '请填写意见',
			title: '审批同意',
			ruleForm: {
				remark: '',
				verifyStatus: 1,
			},
			option: [
				{ value: 1, label: '通过' },
				{ value: 2, label: '驳回' },
			],
			centerDialogVisible: false,
			dialogImageUrl: '',
			dialogVisible: false,
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
			rules: {
				remark: [],
			},
			pageData: {},
			imglist: [],
		};
	},
	watch: {
		'ruleForm.verifyStatus'() {
			this.rules.remark = [{ required: this.ruleForm.verifyStatus == 2, message: '请输入意见', trigger: 'blur' }];
		},
		title(val) {
			this.rules.remark = [{ required: val == '汇款失败', message: '请输入意见', trigger: 'blur' }];
			this.placeholderMsg = val == '汇款失败' ? '说明为什么汇款失败，说明哪方面的信息错误，反馈给店主' : '请填写意见';
		},
	},
	filters: {
		REFUND_APPROVAL_STATUS: val => (val in REFUND_APPROVAL_STATUS ? REFUND_APPROVAL_STATUS[val] : '--'),
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
		this.getHeadDate();
		this.loadData();
	},
	methods: {
		close() {
			this.centerDialogVisible = false;
			this.$refs.dolgruleForm.clearValidate();
			this.ruleForm.remark = '';
		},
		async addMsg() {
			this.$refs.dolgruleForm.validate(async valid => {
				if (valid) {
					this.isAddMsg = true;
					let id = this.$route.query.id;
					console.log(Date.now());
					if (!(this.title === '汇款失败' || this.title === '汇款成功'))
						this.title = this.ruleForm.verifyStatus == 1 ? '审批同意' : '驳回意见';
					let type = CAOZUO_TYPE[this.title];
					const res = await this.$fetch(
						`/mgmt/inventory/refund/deal?${qs.stringify({ id, remark: this.ruleForm.remark, type })}`
					);
					console.log(Date.now());
					if (res && res.code == 200) {
						this.ruleForm.remark = '';
						this.loadData();
						this.getHeadDate();
						this.$dispatch('REFUNDLIST_LIST');
						this.centerDialogVisible = false;
						this.$message.success(res.message);
					}
					this.isAddMsg = false;
				}
			});
		},
		async getHeadDate() {
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/store/getStoreByCode?code=${this.$route.query.storeCode}`,
			});
			if (res && res.data) {
				this.pageHeadData = res.data;
			}
		},
		async loadData() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/inventory/refund/refundDetail?id=` + this.$route.query.id,
			});
			if (res && res.data) {
				let { refundVoucher } = res.data;
				this.pageData = res.data;
				this.imglist = refundVoucher
					? refundVoucher.split(',').map((e, i) => ({ name: i, url: e }))
					: [{ name: '0', url: require('assets/img-empty.png') }];
				// this.pageData.refundVoucher = refundVoucher.split(',').map((e, i) => ({ name: i, url: e }));
			}
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		async review(type) {
			this.centerDialogVisible = true;
			this.ruleForm.remarks = '';
			if (type == 'hksb') {
				this.title = '汇款失败';
			} else if (type == 'hkcg') {
				this.title = '汇款成功';
			}
		},
		onError() {
			this.$message.warning('只能上传3个文件');
		},
		handleSuccessPC(res, file) {
			this.pushData.enclosureVos.push({ fileName: file.name, urls: file.response.datas.fileUrlKey });
		},
		beforeRemovePC(res) {
			this.pushData.enclosureVos.forEach((e, index) => {
				if (e.fileName === res.name) this.pushData.enclosureVos.splice(index, 1);
			});
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
	.text-span {
		margin-right: 20px;
	}
	.had-text {
		font-size: 14px;
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
	}
}
</style>
