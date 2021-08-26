<template>
	<div class="receive-info">
		<el-card>
			<h4 v-if="[2, 99].includes(repairStatus)" class="title">收货人信息</h4>
			<el-row v-if="[2, 99].includes(repairStatus)" class="receive-info-detail">
				<el-col :span="5">收货人：{{ detailData.headOfficeConsignee }}</el-col>
				<el-col :span="9" :offset="1">收货地址：{{ detailData.headOfficeAddress }}</el-col>
				<el-col :span="8" :offset="1">收货人手机号码：{{ detailData.headOfficeContact }}</el-col>
			</el-row>
			<h4 class="title">{{ [2, 99].includes(repairStatus) ? '退回信息' : '已退回产品信息' }}</h4>
			<el-form
				:rules="RECEIVE_INFO_RULES"
				ref="returnBackInfoForm"
				:model="formData"
				label-suffix=":"
				label-width="100px"
			>
				<el-row>
					<el-col :span="8">
						<el-form-item label="退回方式" prop="returnType">
							<el-select
								v-if="repairStatus === 2"
								:disabled="isDisabled"
								v-model="formData.returnType"
								placeholder="请选择"
							>
								<el-option key="youji" label="邮寄" :value="1"></el-option>
								<el-option key="zidai" label="自带" :value="2"></el-option>
							</el-select>
							<div v-else>{{ detailData.returnType === 1 ? '邮寄' : '自带' }}</div>
						</el-form-item>
					</el-col>
					<el-col v-if="formData.returnType === 1" :span="8">
						<el-form-item label="物流公司" prop="returnExpressName">
							<el-input
								v-if="repairStatus === 2"
								:disabled="isDisabled"
								v-model="formData.returnExpressName"
								style="width: 60%"
							></el-input>
							<div v-else>{{ detailData.returnExpressName }}</div>
						</el-form-item>
					</el-col>
					<el-col v-if="formData.returnType === 1" :span="8">
						<el-form-item label="运单号" prop="returnExpressNo">
							<el-input
								v-if="repairStatus === 2"
								:disabled="isDisabled"
								v-model="formData.returnExpressNo"
								style="width: 60%"
							></el-input>
							<div v-else>{{ detailData.returnExpressNo }}</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="说明" prop="returnRemark">
							<el-input
								v-if="repairStatus === 2"
								:disabled="isDisabled"
								type="textarea"
								:rows="6"
								v-model="formData.returnRemark"
								style="width: 90%"
							></el-input>
							<div v-else>{{ detailData.returnRemark }}</div>
						</el-form-item>
					</el-col>
					<el-col v-if="formData.returnType === 1" :span="16">
						<el-form-item label="快递凭证" prop="attachmentList">
							<el-upload
								v-if="repairStatus === 2"
								:disabled="isDisabled"
								v-model="formData.attachmentList"
								:action="$store.getters['system/getOssUploadUrl']"
								:headers="$store.getters['system/getSignatureVerification']"
								:data="uploadData"
								:limit="3"
								list-type="picture-card"
								:on-success="handleSuccessUpload"
							>
								<i class="el-icon-plus"></i>
							</el-upload>
							<div v-else>
								<el-image
									style="width: 100px; height: 100px; margin-left: 10px"
									v-for="item in detailData.expressVouchers"
									:preview-src-list="detailData.expressVouchers"
									:key="item"
									:src="item"
								></el-image>
							</div>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
	</div>
</template>

<script>
import { RECEIVE_INFO_RULES } from './config';
export default {
	name: 'receiveInfo',
	props: ['repairStatus', 'detailData'],
	data() {
		return {
			RECEIVE_INFO_RULES,
			formData: {
				returnType: 1,
				returnExpressName: '',
				returnExpressNo: '',
				attachmentList: [],
				returnRemark: '',
			},
		};
	},
	watch: {
		'formData.returnType': function (returnType) {
			this.formData = {
				...this.formData,
				returnType,
				returnExpressName: '',
				returnExpressNo: '',
				attachmentList: [],
			};
		},
	},
	methods: {
		handleSuccessUpload(res) {
			const { fileUrlKey } = res.datas;
			this.formData.attachmentList = [fileUrlKey];
		},
	},
	computed: {
		uploadData() {
			return {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.service,
			};
		},
		isDisabled() {
			return [3].includes(this.repairStatus);
		},
	},
};
</script>

<style lang="scss" scoped>
.receive-info {
	.title {
		font-size: 18px;
		font-weight: 500;
		padding-bottom: 20px;
	}
	.receive-info-detail {
		margin-bottom: 20px;
		padding-bottom: 20px;
		border-bottom: 1px solid #d1d1d1;
	}
}
</style>
