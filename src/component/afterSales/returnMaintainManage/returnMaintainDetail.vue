<template>
	<div class="return-maintain-detail">
		<guideBar />
		<!-- 审批流程 -->
		<el-card>
			<div class="audit-flow">
				<div class="audit-flow-left">
					<div class="audit-flow-cardno">返厂维修单号：{{ detailData.repairNo }}</div>
					<div class="audit-flow-status">{{ repairStatusArr[detailData.repairStatus] }}</div>
				</div>
				<div class="audit-flow-right">
					<el-steps :active="isActive" align-center>
						<el-step
							v-for="item in statusList"
							:key="item.serviceStatus"
							:title="item.title"
							:description="formatDate(item.createTime)"
						></el-step>
					</el-steps>
				</div>
			</div>
		</el-card>
		<!-- 返厂维修单信息 -->
		<el-card>
			<div class="return-maintain-info">
				<h4 class="title">返厂维修单信息</h4>
				<el-row>
					<el-col :span="6">顾客卡号：{{ detailData.cardNo }}</el-col>
					<el-col :span="6">顾客姓名：{{ detailData.realname }}</el-col>
					<el-col :span="6">顾客电话：{{ detailData.contact }}</el-col>
					<!-- <el-col :span='6'>所在地区：XXXXXXX</el-col> -->
					<el-col :span="6">详细地址：{{ detailData.custAddress }}</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">产品编码：{{ detailData.productCode }}</el-col>
					<el-col :span="6">产品名称：{{ detailData.productName }}</el-col>
					<el-col :span="6">购买日期：{{ formatDate(detailData.buyDate, 'day') }}</el-col>
					<el-col :span="6">故障日期：{{ formatDate(detailData.failureDate, 'day') }}</el-col>
					<el-col :span="6">保质期：{{ detailData.shelfLife == 1 ? '保质期内' : '保质期外' }}</el-col>
					<el-col :span="6">订单号：{{ detailData.orderNo }}</el-col>
					<el-col :span="6">生产批号：{{ detailData.batchNumber }}</el-col>
					<el-col :span="6">生产日期：{{ formatDate(detailData.produceDate, 'day') }}</el-col>
					<el-col :span="6">使用日期：{{ formatDate(detailData.useDate, 'day') }}</el-col>
					<el-col :span="6">序列号/二维码：{{ detailData.serialNo }}</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">申请数量：{{ detailData.quantity }}</el-col>
					<el-col :span="6">故障原因：{{ detailData.failureReason }}</el-col>
					<el-col :span="6">整/部件损坏情况：{{ detailData.scope == 1 ? '整件' : '部件' }}</el-col>
					<el-col :span="6">故障详细描述：{{ detailData.reasonDetail }}</el-col>
					<el-col :span="6">
						销售小票：
						<img
							v-for="item in detailData.salesTickets"
							@click="() => handleDialog(item)"
							:key="item"
							style="width: 100px; height: 100px; cursor: pointer"
							:src="item"
						/>
					</el-col>
				</el-row>
			</div>
		</el-card>
		<auditResult v-if="detailData.repairStatus === 1" ref="auditResult" />
		<receiveInfo
			v-if="[2, 3, 99].includes(detailData.repairStatus)"
			ref="receiveInfo"
			:repairStatus="detailData.repairStatus"
			:detailData="detailData"
		/>
		<maintainInfo
			v-if="[3, 4, 5, 6, 99].includes(detailData.repairStatus)"
			ref="maintainInfo"
			:repairStatus="detailData.repairStatus"
			:editMaintainInfo="editMaintainInfo"
			:detailData="detailData"
		/>
		<el-card v-if="[4].includes(detailData.repairStatus)">
			<div class="remittance-info">
				<div class="title">汇款信息</div>
				<el-row>
					<el-col :span="8">维修费汇款账户：{{ detailData.remittanceAccount }}</el-col>
					<el-col :span="8">账号：{{ detailData.accountNumber }}</el-col>
					<el-col :span="8">银行：{{ detailData.bank }}</el-col>
					<el-col :span="8">维修费用合计：{{ detailData.totalAmount ? `¥${detailData.totalAmount}` : '--' }}</el-col>
				</el-row>
			</div>
		</el-card>
		<el-card v-if="[4, 5].includes(detailData.repairStatus)">
			<div class="title" style="padding-bottom: 30px">
				{{ detailData.repairStatus === 4 ? '上传凭证' : '付费确认' }}
			</div>
			<el-form label-suffix=":">
				<el-form-item label="付费凭证">
					<el-upload
						v-if="detailData.repairStatus === 4"
						v-model="attachmentList"
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
							style="width: 100px; height: 100px; margin-left: 5px"
							:preview-src-list="detailData.paymentVouchers"
							v-for="item in detailData.paymentVouchers"
							:key="item"
							:src="item"
						></el-image>
					</div>
				</el-form-item>
			</el-form>
			<div v-if="detailData.repairStatus === 4" style="color: red">
				注：确认前请确保跟顾客已沟通，一旦确认维修项目和费用后不可更改
			</div>
			<div v-else>
				<el-form
					label-suffix=":"
					:model="confirmPayFormData"
					:rules="confirmPayFormRules"
					ref="confirmPayForm"
					label-width="100px"
				>
					<el-form-item label="是否已付费" prop="isPay">
						<el-checkbox-group v-model="confirmPayFormData.isPay">
							<el-checkbox label="已付费" name="isPay"></el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="confirmPayFormData.payRemark" type="textarea" style="width: 50%" />
					</el-form-item>
				</el-form>
			</div>
		</el-card>
		<sendBackInfo
			v-if="[5, 6, 99].includes(detailData.repairStatus)"
			ref="sendBackInfo"
			:repairStatus="detailData.repairStatus"
			:detailData="detailData"
		/>
		<el-dialog :visible.sync="visible" width="60%" v-drag>
			<img class="view-img" :src="viewUrl" />
		</el-dialog>

		<actionBar>
			<template>
				<el-button
					v-if="[1, 2].includes(detailData.repairStatus)"
					v-permission="'return_maintain_detail_cancel_order'"
					@click="handleCancelOrder"
				>
					取消返修单
				</el-button>
				<el-button
					v-if="detailData.repairStatus == 4 && !editMaintainInfo"
					type="primary"
					v-permission="'return_maintain_detail_edit'"
					@click="editMaintainInfo = true"
				>
					修改维修信息
				</el-button>
				<el-button v-if="detailData.repairStatus == 4 && editMaintainInfo" type="primary" @click="saveMaintainInfo">
					保存
				</el-button>
				<el-button
					v-if="detailData.repairStatus == 4 && editMaintainInfo"
					@click="
						editMaintainInfo = false;
						getDetail();
					"
				>
					取消
				</el-button>
				<el-button
					v-if="![97, 98, 99].includes(detailData.repairStatus) && !editMaintainInfo"
					v-permission="'return_maintain_detail_confirm_submit'"
					@click="handleSubmit"
					type="primary"
				>
					提交
					<!-- {{ [6].includes(detailData.repairStatus) ? '确认收货' : '提交' }} -->
				</el-button>
				<el-button
					v-if="
						![97, 98, 99].includes(detailData.repairStatus) &&
						!editMaintainInfo &&
						[6].includes(detailData.repairStatus)
					"
					v-permission="'return_maintain_detail_confirm_receipt'"
					@click="handleSubmit"
					type="primary"
				>
					确认收货
				</el-button>
				<el-button v-if="!editMaintainInfo" @click="handleBack">返回</el-button>
			</template>
		</actionBar>
	</div>
</template>

<script>
import { repairStatusArr, AUDIT_FLOW_STEP } from './config';
import { formatDate } from '@/util/formValidation';
import auditResult from './components/auditResult';
import receiveInfo from './components/receiveInfo';
import maintainInfo from './components/maintainInfo';
import city from 'config/city';
export default {
	name: 'returnMaintainDetail',
	data() {
		return {
			repairStatusArr,
			formatDate,
			detailData: {},
			attachmentList: [], //上传凭证
			isCustAddress: {}, // 地址
			statusList: AUDIT_FLOW_STEP,
			isActive: 0,
			confirmPayFormData: {
				payRemark: '',
				isPay: [],
			},
			confirmPayFormRules: {
				isPay: [{ type: 'array', required: true, message: '请选择是否已付费', trigger: 'change' }],
			},
			editMaintainInfo: false, // 修改维护单
			viewUrl: '',
			visible: false,
			errorReason: [],
		};
	},
	methods: {
		// 获取维修单详情
		async getDetail() {
			const { id } = this.$route.query;
			const res = await this.$fetch(`/mgmt/order/factory/getFactoryOrderById?id=${id}`);
			if (res && res.code === 200) {
				const { data } = res;
				// 后台返回 /777 错误
				let isCustAddress = data.custAddress == '/777' ? '' : JSON.parse(data.custAddress);
				// 显示 undefined 的时候 不显示
				let resultIsAddress = Object.prototype.toString.call(isCustAddress) === '[object Object]';
				console.log(resultIsAddress);
				const { province, city, district, street, address } = isCustAddress;
				let editStreet = street ? '-' + street : '';
				let editAddress = address ? '-' + address : '';
				this.detailData = {
					...data,
					custAddress: resultIsAddress ? `${province}-${city}-${district}${editStreet}${editAddress}` : '',
					id,
				};
				// 故障原因
				this.getErrorReason();
				// 处理状态
				let index = 0;
				if (data.statusChangeList.length != 0) {
					const pauseArr = [97, 98].includes(this.detailData.repairStatus) ? data.statusChangeList : AUDIT_FLOW_STEP;
					this.statusList = JSON.parse(JSON.stringify(pauseArr));
					const title = this.detailData.repairStatus == 97 ? '取消维修单' : '驳回维修单';
					data.statusChangeList.forEach(v => {
						index = this.statusList.findIndex(item => item.serviceStatus === v.serviceStatus);
						this.statusList[index] = {
							serviceStatus: v.serviceStatus,
							createTime: v.createTime,
							title: [97, 98].includes(v.serviceStatus)
								? title
								: AUDIT_FLOW_STEP.find(x => x.serviceStatus == v.serviceStatus).title,
						};
					});
				} else {
					index = AUDIT_FLOW_STEP.findIndex(item => item.serviceStatus === this.detailData.repairStatus);
				}
				this.isActive = index + 1;

				this.confirmPayFormData.isPay = data.isPay == 1 ? [true] : [];
			} else {
				res && this.$message.error(res.message);
			}
		},
		// 获取故障原因
		async getErrorReason() {
			const res = await this.$fetch('/mgmt/order/factory/getFaultReason');
			if (res && res.code === 200) {
				const { data } = res;
				this.errorReason = data;
				let isError = data.find(item => {
					return item.id == this.detailData.failureReason;
				});
				if (isError?.faultReason) {
					this.$nextTick(() => {
						this.detailData.failureReason = isError?.faultReason;
					});
				}
			}
		},
		// 取消返厂维修单
		async handleCancelOrder() {
			const { id } = this.detailData;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/order/factory/cancelFactoryOrder',
				data: {
					id,
					systemCode: 1,
				},
			});
			if (res && res.code === 200) {
				this.$message.success('取消成功');
				this.getDetail();
			} else {
				res && this.$message.warning(res.message);
			}
		},
		// 提交审批接口
		audit() {
			const { auditFactoryOrderVo } = this.$refs['auditResult'];
			this.getRequest({ ...auditFactoryOrderVo }, '/mgmt/order/factory/auditFactoryOrder');
		},
		// 提交退回接口
		back() {
			const {
				formData,
				$refs: { returnBackInfoForm },
			} = this.$refs['receiveInfo'];
			returnBackInfoForm?.validate(valid => {
				if (valid) {
					this.getRequest(
						{
							...formData,
							systemCode: 1,
						},
						'/mgmt/order/factory/turnBackFactoryOrder'
					);
				} else {
					this.$message.warning('请检查表单，填写完整信息');
				}
			});
		},
		// 提交检测接口
		maintain() {
			const { formData, totalAmount, dataSource } = this.$refs['maintainInfo'];
			if (dataSource.length <= 0) {
				return this.$message.warning('没有需要维修的项目');
			}
			if (!dataSource.every(x => x.fittingsNo && x.quantity)) {
				return this.$message.warning('请填写配件编码且数量必须大于0');
			}
			this.getRequest(
				{
					...formData,
					systemCode: 1,
					fittingsList: dataSource,
					totalAmount,
				},
				'/mgmt/order/factory/checkingFactoryOrder'
			);
		},
		// 保存维修信息
		saveMaintainInfo() {
			const { dataSource, totalAmount } = this.$refs['maintainInfo'];
			if (dataSource.length <= 0) {
				return this.$message.warning('没有需要维修的项目');
			}
			if (!dataSource.every(x => x.fittingsNo && x.quantity)) {
				return this.$message.warning('请填写配件编码且数量必须大于0');
			}
			this.getRequest(
				{
					fittingsList: dataSource,
					systemCode: 1,
					totalAmount,
				},
				'/mgmt/order/factory/updateFittings'
			);
		},
		// 付费确认接口
		confirmPay() {
			this.getRequest(
				{
					attachmentList: this.attachmentList,
					systemCode: 1,
				},
				'/mgmt/order/factory/paymentConfirm'
			);
		},
		// 获取省市区文本
		rewritePlace(data, cityStore) {
			let index = 0;
			let result = [];
			if (!data) {
				return;
			}
			const loop = (data, cityStore) => {
				if (!cityStore) return;
				cityStore.forEach(item => {
					if (data[index]) {
						if (item.c == data[index]) {
							result.push(item.n);
							if (item.r) {
								index++;
								loop(data, item.r);
							}
						}
					}
				});
			};
			loop(data, cityStore);
			return result;
		},

		// 维修回寄接口
		sendBack() {
			this.$refs.confirmPayForm.validate(valid => {
				if (valid) {
					const { validForm, formData } = this.$refs['sendBackInfo'];
					if (validForm()) {
						let areaText = this.rewritePlace([formData.area[0], formData.area[1], formData.area[2]], city);
						let nowAddres = {
							districtCode: formData.area[2],
							address: formData.address,
							city: areaText[1],
							provinceCode: formData.area[0],
							cityCode: formData.area[1],
							province: areaText[0],
							district: areaText[2],
						};
						const data = {
							...formData,
							consigneeAddress: JSON.stringify(nowAddres),
							systemCode: 1,
							isPay: this.confirmPayFormData.isPay.length,
							payRemark: this.confirmPayFormData.payRemark,
						};
						delete data.area;
						delete data.address;
						this.getRequest(data, '/mgmt/order/factory/repairAndReturn');
					} else {
						this.$message.warning('请检查表单，填写完整信息');
					}
				}
			});
		},

		// 确认收货接口
		confirmReceive() {
			this.getRequest({ systemCode: 1 }, '/mgmt/order/factory/receiptConfirm');
		},

		// 请求封装
		async getRequest(data = {}, url) {
			const { id } = this.$route.query;
			const res = await this.$fetch({
				method: 'POST',
				url,
				data: { ...data, id },
			});
			this.dealResult(res);
		},

		// 请求结果处理
		dealResult(res) {
			if (res && res.code === 200) {
				this.$message.success(res.data);
				this.getDetail();
				this.$dispatch('RETURN_MAINTAIN_LIST');
			} else {
				return this.$message.error(res.message);
			}
			if (this.editMaintainInfo) {
				this.editMaintainInfo = false;
			}
		},

		// 点击提交
		handleSubmit() {
			switch (this.detailData.repairStatus) {
				case 1:
					this.audit();
					break;
				case 2:
					this.back();
					break;
				case 3:
					this.maintain();
					break;
				case 4:
					this.confirmPay();
					break;
				case 5:
					this.sendBack();
					break;
				case 6:
					this.confirmReceive();
					break;
				default:
					break;
			}
		},
		// 点击图片查看大图
		handleDialog(url) {
			if (url) {
				this.viewUrl = url;
				this.visible = true;
			}
		},
		// 凭证上传成功的回调
		handleSuccessUpload(res) {
			const { fileUrlKey } = res.datas;
			this.attachmentList = [fileUrlKey];
		},
		// 点击返回
		handleBack() {
			this.$closeSelf();
		},
	},
	computed: {
		// active() {
		// 	const index = AUDIT_FLOW_STEP.findIndex((item) => item.value === this.detailData.repairStatus);
		// 	return index + 1;
		// },
		uploadData() {
			return {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.service,
			};
		},
	},
	created() {
		this.getDetail();
	},
	components: {
		auditResult,
		receiveInfo,
		maintainInfo,
	},
};
</script>

<style lang="scss" scoped>
.return-maintain-detail {
	.title {
		font-size: 18px;
		font-weight: 500;
	}
	.remittance-info {
		.el-col {
			margin-top: 20px;
		}
		.el-col:last-child {
			color: red;
		}
	}
	.audit-flow {
		display: flex;
		.audit-flow-left {
			.audit-flow-status {
				font-size: 32px;
				color: #1b7eda;
				font-weight: 500;
				margin-top: 20px;
			}
		}
		.audit-flow-right {
			flex: 1;
		}
	}
	.return-maintain-info {
		word-break: break-all;
		.el-row {
			border-bottom: 1px solid #d1d1d1;
			padding-bottom: 20px;
			.el-col {
				margin-top: 30px;
			}
		}
		.el-row:last-child {
			border-bottom: 0;
			padding-bottom: 30;
		}
	}
	.view-img {
		width: 100%;
		height: 100%;
	}
}
</style>
