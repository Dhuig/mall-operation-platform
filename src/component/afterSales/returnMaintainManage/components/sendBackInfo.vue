<template>
	<div class="send-back-info">
		<el-card>
			<h4 class="title">回寄信息</h4>
			<el-form :model="formData" :rules="SEND_BACK_RULES" label-suffix=":" ref="formRef" label-width="100px">
				<el-row class="receive-info">
					<el-col :span="8">
						<el-form-item label="收货人" prop="consignee">
							<el-input v-if="repairStatus === 5" maxlength="20" v-model="formData.consignee" />
							<div v-else>{{ detailData.consignee }}</div>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="收货人电话" prop="consigneeNumber">
							<el-input v-if="repairStatus === 5" maxlength="11" v-model="formData.consigneeNumber" />
							<div v-else>{{ detailData.consigneeNumber }}</div>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="所在地区" prop="area">
							<el-cascader
								v-if="repairStatus === 5"
								v-model="formData.area"
								:props="lazyProps"
								style="width: 100%"
							></el-cascader>
							<div v-else>{{ area }}</div>
						</el-form-item>
					</el-col>
					<el-col :span="16">
						<el-form-item label="详细地址" prop="address">
							<el-input v-if="repairStatus === 5" maxlength="100" v-model="formData.address" type="textarea" />
							<div v-else>{{ address }}</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="物流公司" prop="sendExpressName">
							<el-input v-if="repairStatus === 5" maxlength="20" v-model="formData.sendExpressName" />
							<div v-else>{{ detailData.sendExpressName }}</div>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="运单号" prop="sendExpressNo">
							<el-input v-if="repairStatus === 5" maxlength="40" v-model="formData.sendExpressNo" />
							<div v-else>{{ detailData.sendExpressNo }}</div>
						</el-form-item>
					</el-col>
					<el-col :span="9">
						<el-form-item label="说明" prop="sendRemark">
							<el-input v-if="repairStatus === 5" maxlength="200" v-model="formData.sendRemark" type="textarea" />
							<div v-else>{{ detailData.sendRemark }}</div>
						</el-form-item>
					</el-col>
					<el-col :span="14">
						<el-form-item label="快递凭证">
							<el-upload
								v-if="repairStatus === 5"
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
								<img
									style="width: 100px; height: 100px; cursor: pointer"
									v-for="item in detailData.sendExpressVouchers"
									:key="item"
									:src="item"
								/>
							</div>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
	</div>
</template>

<script>
import { SEND_BACK_RULES } from './config';
import city from 'config/city';
export default {
	name: 'sendBackInfo',
	props: ['repairStatus', 'detailData'],
	data() {
		return {
			SEND_BACK_RULES,
			formData: {
				attachmentList: [],
				consignee: '',
				consigneeNumber: '',
				sendExpressName: '',
				sendExpressNo: '',
				sendRemark: '',
				area: [],
				address: '',
			},
			lazyProps: {
				// expandTrigger: 'hover', // hover模式
				lazy: true, //  是否开启懒加载
				lazyLoad: this.lazyLoad, // 加载函数
			},
		};
	},
	methods: {
		handleSuccessUpload(res) {
			const { fileUrlKey } = res.datas;
			this.formData.attachmentList = [fileUrlKey];
		},
		validForm() {
			let isValid = false;
			this.$refs['formRef'].validate(valid => {
				isValid = valid;
			});
			return isValid;
		},
		lazyLoad(node, resolve) {
			const { level } = node;
			if (level == 0) {
				let nodes = city.map(item => {
					return {
						value: item.c,
						label: item.n,
						leaf: false,
					};
				});
				resolve(nodes);
			} else if (level == 1) {
				const id = node.data.value;
				let data = [];
				city.forEach(i => {
					if (i.c === id) {
						data = i.r;
					}
				});
				let nodes = data.map(item => {
					return {
						value: item.c,
						label: item.n,
						leaf: false,
					};
				});
				resolve(nodes);
			} else if (level == 2) {
				const id = node.data.value;
				let data = [];
				city.forEach(i => {
					i.r &&
						i.r.length > 0 &&
						i.r.forEach(j => {
							if (j.c === id) {
								data = j.r;
							}
						});
				});
				let nodes = data.map(item => {
					return {
						value: item.c,
						label: item.n,
						leaf: true,
					};
				});
				resolve(nodes);
			} else {
				resolve(node);
			}
		},
	},
	computed: {
		consigneeAddress() {
			return this.formData.area + this.formData.address;
		},
		uploadData() {
			return {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.service,
			};
		},
		address() {
			if (this.detailData?.consigneeAddress) {
				const { consigneeAddress } = this.detailData;
				const { address } = JSON.parse(consigneeAddress);
				return address;
			}
			return '';
			// return consigneeAddress.split('-').splice(-1, 1).join();
		},
		area() {
			if (this.detailData?.consigneeAddress) {
				const { consigneeAddress } = this.detailData;
				const { province, city, district } = JSON.parse(consigneeAddress);
				return province + '-' + city + '-' + district;
			}
			return '';
		},
	},
};
</script>

<style lang="scss" scoped>
.send-back-info {
	.title {
		font-size: 18px;
		font-weight: 500;
		padding-bottom: 20px;
	}
	.receive-info {
		margin-bottom: 20px;
		border-bottom: 1px solid #d1d1d1;
	}
}
</style>
