<template>
	<div>
		<el-card class="card-gap">
			<div class="had-text">
				<span>服务中心编号：</span>
				<span class="text-span">{{ pageData.storeCode }}</span>
				<span>服务中心名称：</span>
				<span class="text-span">{{ pageData.storeName }}</span>
				<span>负责人卡号：</span>
				<span class="text-span">{{ user.cardNo }}</span>
				<span>负责人姓名：</span>
				<span>{{ user.realname }}</span>
			</div>
		</el-card>
		<el-card class="card-gap">
			<el-form :model="pageData" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
				<el-form-item label="审批状态：" v-if="pageData.applyReason != '批量导入'">
					<span :style="{ color: pageData.status == 2 ? 'red' : 'blue' }">
						{{ pageData.status | status }}
					</span>
				</el-form-item>
				<el-form-item label="申请原因：">{{ pageData.applyReason }}</el-form-item>
				<el-form-item label="申请凭证：" v-if="pageData.applyReason != '批量导入'">
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
					<el-dialog :visible.sync="dialogVisible" width="40%">
						<img width="100%" :src="dialogImageUrl" alt="" />
					</el-dialog>
				</el-form-item>
			</el-form>
			<div class="text-div">
				<p class="text-p">
					<span>申请时间：</span>
					<span>{{ pageData.applyTime | formatDate }}</span>
				</p>
				<p class="text-p">
					<span>申请人：</span>
					<span>{{ pageData.applyPeople }}</span>
				</p>
				<p class="text-p" v-if="pageData.status != 3 && pageData.applyReason != '批量导入'">
					<span>审批时间：</span>
					<span>{{ pageData.approveTime | formatDate }}</span>
				</p>
				<p class="text-p" v-if="pageData.status != 3 && pageData.applyReason != '批量导入'">
					<span>审批人：</span>
					<span>{{ pageData.approvePeople || '--' }}</span>
				</p>
				<p class="text-p" v-if="pageData.status != 3 && pageData.applyReason != '批量导入'">
					<span>审批意见：</span>
					<el-popover
						slot="reference"
						placement="top-start"
						width="200"
						trigger="hover"
						:content="pageData.approveOpinion || '--'"
					>
						<span slot="reference">{{ pageData.approveOpinion || '--' }}</span>
					</el-popover>
				</p>
			</div>
			<div class="text-div" v-if="pageData.status == 4 || pageData.status == 1">
				<p class="text-p">
					<span>下载有效期：</span>
					<span>{{ pageData.validitDate | formatDateDefault }}</span>
					<span v-if="isItinvalid" style="color: red; margin-left: 10px">已失效</span>
				</p>
			</div>
		</el-card>
		<el-dialog :title="title" :visible.sync="centerDialogVisible" width="40%" :before-close="close" v-drag>
			<div>
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm2" label-width="140px" class="demo-ruleForm">
					<el-form-item label="审批结果：" prop="status">
						<el-select v-model="ruleForm.status" placeholder="请选择">
							<el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="证件下载有效期" prop="validitDate" v-if="ruleForm.status == 1">
						<el-date-picker
							class="date-picker"
							v-model="ruleForm.validitDate"
							type="date"
							placeholder="选择日期时间"
							:picker-options="timeDisabel"
							value-format="yyyy-MM-dd HH:mm:ss"
						></el-date-picker>
					</el-form-item>
					<el-form-item label="审批意见" prop="approveOpinion">
						<el-input
							type="textarea"
							:autosize="{ minRows: 7 }"
							show-word-limit
							maxlength="200"
							v-model="ruleForm.approveOpinion"
							placeholder="请填写"
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
					v-if="pageData.status == '3'"
					v-permission="'product_report_detail_audit'"
				>
					审 批
				</el-button>
			</template>
		</actionBar>
	</div>
</template>

<script>
import { PRODUCT_RERORT_LIST_STATUS } from './config';
import { formatDate, formatDateDefault } from 'util/formValidation.js';
export default {
	name: 'productReportDetail',
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
				validitDate: '',
				approveOpinion: '',
				status: 1,
			},
			centerDialogVisible: false,
			dialogImageUrl: '',
			dialogVisible: false,
			rules: {
				validitDate: [{ required: true, message: '请选择时间', trigger: 'blur' }],
				approveOpinion: [{ required: false, message: '请填写意见', trigger: 'blur' }],
				status: [{ required: true, message: '请选择', trigger: 'blur' }],
			},
			pageData: {},
			imglist: [],
			store: {
				code: '',
				name: '',
			},
			user: {
				realname: '',
				cardNo: '',
			},
		};
	},
	computed: {
		isItinvalid() {
			let val = false;
			let pageDate = new Date(formatDateDefault(this.pageData.validitDate)).getTime();
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
	watch: {
		'ruleForm.status'(val) {
			this.rules.approveOpinion = [{ required: val === 2, message: '请填写意见', trigger: 'blur' }];
		},
	},
	filters: {
		status: val => PRODUCT_RERORT_LIST_STATUS[val],
		formatDate: val => formatDate(val) || '--',
		formatDateDefault: val => formatDateDefault(val) || '--',
	},
	created() {
		this.getHeadDate();
		let { query } = this.$route;
		if (query && query.id) {
			this.loadData();
		}
	},
	methods: {
		async getHeadDate() {
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/store/getStoreByCode?code=${this.$route.query.storeCode}`,
			});
			if (res && res.code == 200) {
				let { store, user } = res.data;
				this.store = store ? store : { code: '--', name: '--' };
				this.user = user ? user : { realname: '--', cardNo: '--' };
			}
		},
		close() {
			this.centerDialogVisible = false;
			this.$refs.ruleForm2.clearValidate();
			this.ruleForm.approveOpinion = '';
		},
		addMsg() {
			let id = this.$route.query.id;
			let { approveOpinion, validitDate, status } = this.ruleForm;
			this.$refs['ruleForm2'].validate(async valid => {
				if (valid) {
					this.isAddMsg = true;
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/store/productReportApply/approve`,
						data: { id, approveOpinion, status, validitDate: validitDate.split(' ')[0] },
					});
					if (res && res.code == 200) {
						this.$dispatch('ZHENGJIANBAOSHENPI_LIST');
						this.centerDialogVisible = false;
						this.loadData();
						this.$message.success('操作成功！');
					}
					this.isAddMsg = false;
				}
			});
		},
		async loadData() {
			const res = await this.$fetch(`/mgmt/store/productReportApply/detail?id=${this.$route.query.id}`);
			if (res && res.data) {
				this.pageData = res.data;
				this.imglist = res.data.applyCredential
					? this.pageData.applyCredential.split(',').map((e, i) => ({ name: i, url: e }))
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
::v-deep .el-dialog__wrapper {
	overflow: auto;
}
</style>
