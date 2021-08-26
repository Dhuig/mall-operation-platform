<template>
	<div class="main-content">
		<breadCrumb />
		<div class="detailMessage">
			<el-card class="box-card">
				<div slot="header" class="clearfix">换货信息</div>
				<el-form :model="ruleForm" ref="ruleForm" label-width="130px" size="medium">
					<div class="detailMessage-box line">
						<div class="dataBox">
							<el-row :gutter="24">
								<el-col :span="11">
									<el-form-item
										label="服务中心编号"
										:rules="RETURN_CHANGE_CREAT_RULE.storeCode"
										prop="storeCode"
										class="row-gap"
									>
										<el-input
											placeholder="请输入服务中心编号"
											v-model="ruleForm.storeCode"
											@blur.prevent="loadServiceInfoByNo"
											@input="handleInput"
											size="small"
											clearable
										>
											<el-button slot="append" icon="el-icon-search" @click="loadServiceInfoByNo" />
										</el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="24" v-if="showStoreInfo">
								<el-col :span="8">
									<el-form-item label="服务中心名称" prop="name" class="row-gap">
										<span>{{ storeInfo && storeInfo.name }}</span>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="负责人卡号" prop="leaderCardNo" class="row-gap">
										<span>{{ storeInfo && storeInfo.leaderCardNo }}</span>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="负责人姓名" prop="leaderName" class="row-gap">
										<span>{{ storeInfo && storeInfo.leaderName }}</span>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="24" v-if="showStoreInfo">
								<el-col :span="8">
									<el-form-item
										label="一级原因"
										prop="reasonFirst"
										:rules="RETURN_CHANGE_CREAT_RULE.reasonFirst"
										class="row-gap"
									>
										<el-select
											size="small"
											v-model="ruleForm.reasonFirst"
											placeholder="请选择一级原因"
											@change="changereasonFirst(ruleForm.reasonFirst)"
											clearable
										>
											<el-option
												v-for="option in reasonFirstOptions"
												:key="option.id"
												:label="option.label"
												:value="option.label"
											/>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="一级原因备注说明 " prop="reasonFirstRemarks" class="row-gap">
										<el-input
											size="small"
											v-model="ruleForm.reasonFirstRemarks"
											placeholder="请输入一级原因备注说明"
											clearable
										/>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="24" v-if="showStoreInfo && ruleForm.reasonFirst">
								<el-col :span="8">
									<el-form-item
										label="二级原因"
										prop="reasonSecond"
										:rules="RETURN_CHANGE_CREAT_RULE.reasonSecond"
										class="row-gap"
									>
										<el-select size="small" v-model="ruleForm.reasonSecond" placeholder="请选择二级原因" clearable>
											<el-option
												v-for="option in reasonSecondOptions"
												:key="option.id"
												:label="option.label"
												:value="option.label"
											/>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="二级原因备注说明 " prop="reasonSecondRemarks" class="row-gap">
										<el-input
											size="small"
											v-model="ruleForm.reasonSecondRemarks"
											placeholder="请输入二级原因备注说明"
											clearable
										/>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="24" v-if="showStoreInfo">
								<el-col :span="8">
									<el-form-item label="附件">
										<el-upload
											:before-upload="beforeAttachmentUpload"
											:action="$store.getters['system/getOssUploadUrl']"
											:headers="$store.getters['system/getSignatureVerification']"
											:data="uploadData"
											:limit="3"
											:on-remove="handleRemoveFile"
											:on-success="handleSuccessFile"
											:file-list="fileList"
										>
											<el-button size="small" type="primary" icon="el-icon-upload">添加附件</el-button>
											<p class="tips" slot="tip">
												1.支持文件格式:Word、EXCEL、PDF、压缩包（rar、zip)、bmp、jpg、png、tif
												<br />
												2.支持上传3个文件,
												<br />
												3.单个文件不能超过10M
												<br />
											</p>
										</el-upload>
									</el-form-item>
								</el-col>
							</el-row>
						</div>
					</div>
				</el-form>
			</el-card>
		</div>
		<div class="detailMessage" v-if="showStoreInfo">
			<el-card class="box-card">
				<h6 class="title">
					换货详情
					<span>押货换货金额合计：{{ returnAmountTotal }}</span>
					<span>零售价合计：{{ retailPriceTotal }}</span>
				</h6>
				<div class="detailMessage-box line">
					<el-form :model="ruleForm" ref="ruleForm">
						<el-table :data="ruleForm.productVoList" fit>
							<el-table-column type="index" width="50" label="序号" />
							<el-table-column width="200" label="产品编号/定制品二级编码">
								<template slot-scope="scope">
									<el-form-item
										:prop="'productVoList.' + scope.$index + '.productCode'"
										:rules="RETURN_CHANGE_CREAT_RULE.productCode"
									>
										<el-autocomplete
											v-model="scope.row.productCode"
											:fetch-suggestions="querySearchAsync"
											placeholder="请输入产品编码"
											@input="getAssociate(scope.row)"
											@select="getProductInfo(scope.row)"
											size="small"
											clearable
										/>
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column prop="title" label="产品名称" width="150">
								<template slot-scope="scope">
									<el-form-item>{{ scope.row.title }}</el-form-item>
								</template>
							</el-table-column>
							<el-table-column prop="packing" label="规格">
								<template slot-scope="scope">
									<el-form-item>{{ scope.row.packing }}</el-form-item>
								</template>
							</el-table-column>
							<el-table-column prop="meterUnit" label="单位">
								<template slot-scope="scope">
									<el-form-item>{{ scope.row.meterUnit }}</el-form-item>
								</template>
							</el-table-column>
							<el-table-column prop="retailPrice" label="零售价">
								<template slot-scope="scope">
									<el-form-item>{{ scope.row.retailPrice }}</el-form-item>
								</template>
							</el-table-column>
							<el-table-column label="换货数量" width="160">
								<template slot-scope="scope">
									<el-form-item
										:prop="'productVoList.' + scope.$index + '.productNum'"
										:rules="RETURN_CHANGE_CREAT_RULE.productNum"
									>
										<el-input-number size="mini" v-model="scope.row.productNum" :min="1" label="描述文字" />
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column label="*生产日期/有效期" width="160">
								<template slot-scope="scope">
									<el-form-item
										:prop="'productVoList.' + scope.$index + '.productProductionDate'"
										:rules="RETURN_CHANGE_CREAT_RULE.productProductionDate"
									>
										<el-input
											size="small"
											maxlength="8"
											v-model="scope.row.productProductionDate"
											placeholder="请输入"
										/>
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column label="*批次" width="120">
								<template slot-scope="scope">
									<el-form-item
										:prop="'productVoList.' + scope.$index + '.productBatch'"
										:rules="RETURN_CHANGE_CREAT_RULE.productBatch"
									>
										<el-input size="small" v-model="scope.row.productBatch" placeholder="请输入" />
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column label="序列号/二维码" width="120">
								<template slot-scope="scope">
									<el-form-item
										:prop="'productVoList.' + scope.$index + '.productSn'"
										:rules="RETURN_CHANGE_CREAT_RULE.productSn"
									>
										<el-input size="small" v-model="scope.row.productSn" placeholder="请输入" />
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column label="*详细问题描述" width="160">
								<template slot-scope="scope">
									<el-form-item
										:prop="'productVoList.' + scope.$index + '.productProblemDesc'"
										:rules="RETURN_CHANGE_CREAT_RULE.productProblemDesc"
									>
										<el-input size="small" v-model="scope.row.productProblemDesc" placeholder="请输入" />
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column prop="productDisposalType" label="*旧品处理方式" width="220">
								<template slot-scope="scope">
									<el-form-item
										:prop="'productVoList.' + scope.$index + '.productDisposalType'"
										:rules="RETURN_CHANGE_CREAT_RULE.productDisposalType"
									>
										<el-select v-model="scope.row.productDisposalType" placeholder="请选择" size="small">
											<el-option
												v-for="option in PRODUCT_DISPOSAL_STATUS"
												:key="option.value"
												:label="option.name"
												:value="option.value"
											/>
										</el-select>
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column prop="firstUseTime" label="初次使用时间" width="250">
								<template slot-scope="scope">
									<el-form-item>
										<el-date-picker
											v-model="scope.row.firstUseTime"
											type="date"
											:picker-options="defaultPickerOptions"
											value-format="yyyy-MM-dd"
											placeholder="选择日期时间"
											size="small"
										/>
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column prop="dailyUseType" label="日常使用时段" width="120">
								<template slot-scope="scope">
									<el-form-item>
										<el-select v-model="scope.row.dailyUseType" placeholder="请选择" size="small">
											<el-option
												v-for="item in DAILY_USE_TYPE"
												:key="item.value"
												:label="item.name"
												:value="item.value"
											/>
										</el-select>
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column prop="happenType" label="问题发生状态" width="140">
								<template slot-scope="scope">
									<el-form-item>
										<el-select v-model="scope.row.happenType" placeholder="请选择" size="small">
											<el-option v-for="item in HAPPEN_TYPE" :key="item.value" :label="item.name" :value="item.value" />
										</el-select>
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column prop="address" label="操作">
								<template slot-scope="scope">
									<el-form-item>
										<el-button type="danger" @click="handleEdit(scope.$index)" icon="el-icon-delete" circle />
									</el-form-item>
								</template>
							</el-table-column>
						</el-table>
					</el-form>
				</div>
				<div class="footer-box" v-if="showStoreInfo">
					<div class="first-box" />
					<el-button type="success" icon="el-icon-plus" @click="addProduct">添加产品</el-button>
				</div>
			</el-card>
		</div>

		<!-- 换货处理方式 -->
		<div class="detailMessage" v-if="showStoreInfo">
			<el-card class="box-card">
				<div slot="header" class="clearfix">换货处理方式</div>
				<div class="detailMessage-box line">
					<el-form :model="ruleForm" ref="ruleForm" label-width="128px" size="medium" style="width: 100%; margin: 0px">
						<div class="detailMessage-box line">
							<div class="dataBox">
								<el-form-item
									label="换货处理方式"
									:rules="RETURN_CHANGE_CREAT_RULE.exchangeType"
									prop="exchangeType"
									class="row-gap"
								>
									<el-radio-group v-model="ruleForm.exchangeType">
										<el-radio :label="item.value" v-for="(item, index) in EXCHANGE_STATUS" :key="index">
											{{ item.name }}
										</el-radio>
									</el-radio-group>
								</el-form-item>
							</div>
						</div>
					</el-form>
				</div>
			</el-card>
		</div>
		<!-- 旧品处理方式 -->
		<!-- <div class="detailMessage" v-if="showStoreInfo">
			<el-card class="box-card">
				<h6 class="title">旧品处理方式</h6>
				<div class="detailMessage-box line">
					<el-radio-group v-model="ruleForm.productDisposalType">
						<el-radio :label="item.value" v-for="(item, index) in PRODUCT_DISPOSAL_STATUS" :key="index">
							{{ item.name }}
						</el-radio>
					</el-radio-group>
				</div>
			</el-card>
		</div>-->

		<!-- 控制按钮组 -->
		<actionBar>
			<el-button icon="el-icon-back" @click="handleCancel('ruleForm')">返回</el-button>
			<el-button
				type="primary"
				icon="el-icon-check"
				:loading="submitLoading"
				:disabled="submitAble"
				@click="handleSubmit('ruleForm')"
			>
				提交
			</el-button>
		</actionBar>
	</div>
</template>

<script>
import {
	DataKey,
	HAPPEN_TYPE,
	DAILY_USE_TYPE,
	EXCHANGE_STATUS,
	RETURN_CHANGE_CREAT_RULE,
	PRODUCT_DISPOSAL_STATUS,
} from './config';
import { uploadFileType } from 'util/formValidation';
import qs from 'querystring';

export default {
	name: 'creatReturnChange',
	data() {
		return {
			headers: {
				Authorization: this.$store.getters['user/getFullToken'],
			},
			defaultPickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
			},
			RETURN_CHANGE_CREAT_RULE,
			HAPPEN_TYPE,
			DAILY_USE_TYPE,
			EXCHANGE_STATUS,
			PRODUCT_DISPOSAL_STATUS,
			ruleForm: Object.assign({ ...DataKey }),
			fileList: [], //附件数组
			//下拉联想数据
			restaurants: [],
			reasonList: [],
			// 一级原因
			reasonFirstOptions: [],
			// 二级原因
			reasonSecondOptions: [],
			productItem: {
				productCode: '',
				productNum: 0,
				productMortgagePrice: '',
				productRetailPrice: '',
				dailyUseType: '',
				firstUseTime: '',
				happenType: '',
				productBatch: '',
				productProblemDesc: '',
				productProductionDate: '',
				productSn: '',
				productDisposalType: null,
			},
			storeInfo: {
				address: null,
				leaderCardNo: '',
				leaderId: '',
				leaderName: '',
				name: '',
			}, // 服务中心信息
			form: {},
			// 一级原因
			reasonOptions: [],
			recordData: [],
			submitLoading: false,
		};
	},
	computed: {
		// 展示服务中心相关信息
		showStoreInfo() {
			return !!this.storeInfo.leaderId;
		},
		// 是否可提交表单
		submitAble() {
			const { productVoList } = this.ruleForm;
			const ret = productVoList.length && productVoList.every(({ productCode }) => !!productCode);
			return !ret;
		},
		// 押货换货金额合计
		returnAmountTotal() {
			let count = 0;
			for (let item of this.ruleForm.productVoList) {
				count += item.securityPrice * item.productNum;
			}
			return count;
		},
		// 零售价合计
		retailPriceTotal() {
			let count = 0;
			for (let item of this.ruleForm.productVoList) {
				count += item.retailPrice * item.productNum;
			}
			return count;
		},
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.stock,
			};
			return params;
		},
	},
	methods: {
		// 获取服务中心信息
		async loadStoreInfo() {
			const { storeCode } = this.ruleForm;
			if (!storeCode) return this.$message.warning('输入服务中心编号后再进行查询');

			const res = await this.$fetch(`/mgmt/inventory/common/getStoreSimpleInfo?storeCode=${storeCode}`);
			if (res && res.data) {
				const { data } = res;
				this.storeInfo = data;
				this.loadReasons();
			} else {
				this.$message.warning('查询结果为空');
			}
		},
		//获取联想数据
		async getAssociate(item) {
			const res = await this.$fetch(`/mgmt/inventory/common/getAllProductCodes?productCode=${item.productCode}`);
			if (res && res.code === 200) {
				const { data } = res;
				this.restaurants = data;
			}
		},
		querySearchAsync(queryString, cb) {
			let returnRes = [];
			var restaurants = this.restaurants;
			var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
			results.map(item => {
				let obj = {};
				obj.value = item;
				returnRes.push(obj);
			});
			cb(returnRes);
		},
		createStateFilter(queryString) {
			return state => {
				return state.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
			};
		},
		// 公共-获取商品信息
		async getProductInfo(row) {
			const params = {
				productCode: row.productCode,
			};
			const res = await this.$fetch(`/mgmt/inventory/common/getProductByCode?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { data } = res;
				row.title = data.productName;
				row.packing = data.productPacking;
				row.meterUnit = data.productUnit;
				row.retailPrice = data.retailPrice;
				row.securityPrice = data.mortgagePrice;
			} else {
				this.$message({
					type: 'error',
					message: res.message,
				});
			}
		},
		// 删除
		handleEdit(index) {
			this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.ruleForm.productVoList.splice(index, 1);
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		// 输入编号查询回调
		handleInput(code) {
			if (!code) return;
			if (code.length >= 6) this.loadServiceInfoByNo();
		},
		// 根据服务中心编号查询服务中心基础信息
		loadServiceInfoByNo() {
			this.loadStoreInfo();
			this.ruleForm.productVoList = [];
		},
		// 获取各种原因
		async loadReasons() {
			const res = await this.$fetch(`/mgmt/inventory/common/getReason?type=4`);
			if (res && res.data) {
				if (!res.data.length) {
					return this.$message.error('售后原因为空');
				}
				this.reasonFirstOptions = res.data.map(({ id: value, returnReason: label }) => ({ value, label }));
				this.reasonList = res.data;
			} else {
				this.$message.error('请求售后原因失败, 服务器可能出现问题');
			}
		},
		changereasonFirst(returnReason) {
			this.reasonSecondOptions = [];
			this.reasonList.forEach(e => {
				if (e.returnReason === returnReason) {
					e.reasonList.forEach(n => {
						let item = {
							value: n.id,
							label: n.returnReason,
						};
						this.reasonSecondOptions.push(item);
					});
				}
			});
		},
		// 上传附件
		beforeAttachmentUpload(file) {
			const whiteList = ['rar', 'zip', 'bmp', 'jpg', 'jpeg', 'png', 'tif', 'doc', 'docx', 'xls', 'xlsx'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		// 删除文件
		handleRemoveFile(file, fileList) {
			console.log(file, fileList);
			this.ruleForm.orderFileUrl = '';
			this.ruleForm.orderFileName = '';
		},
		// 文件上传成功
		handleSuccessFile(response, file, fileList) {
			let arr = [];
			let arrName = [];
			fileList.map(e => {
				arr.push(e.response.datas.fileUrlKey);
				arrName.push(e.response.datas.fileUrlKey.split('/')[response.datas.fileUrlKey.split('/').length - 1]);
			});
			this.ruleForm.orderFileUrl = arr.join(',');
			this.ruleForm.orderFileName = arrName.join(',');
		},
		// 退货-后台新建换货单
		async addMortgageExchangeOrder(params) {
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'post',
				url: 'mgmt/inventory/exchangeOrder/addMortgageExchangeOrder',
				data: params,
			});
			if (res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.$nextTick(() => {
					this.$dispatch('UP_LIST');
					this.$closeSelf();
				});
			}
			this.submitLoading = false;
		},
		// 添加产品
		addProduct() {
			let obj = {
				productCode: '',
				title: '',
				packing: '',
				meterUnit: '',
				retailPrice: 0,
				productNum: '',
				productProductionDate: '',
				productBatch: '',
				productSn: '',
				productProblemDesc: '',
				firstUseTime: '',
				dailyUseType: '',
				happenType: '',
				securityPrice: 0,
				productDisposalType: '',
			};
			this.ruleForm.productVoList.push(obj);
		},
		// 提交
		handleSubmit(formName) {
			if (this.ruleForm.reasonFirst == '') {
				this.$message.error('请选择一级原因');
			} else if (this.ruleForm.reasonSecond == '') {
				this.$message.error('请选择二级原因');
			}
			// 检查是否选择了 [旧品处理方式]
			const noDiseaseTypeItem = this.ruleForm.productVoList.some(({ productDisposalType }) => !productDisposalType);
			if (noDiseaseTypeItem) return this.$message.warning('请为换货商品选择[旧品处理方式]');
			// 初次使用时间修改
			this.ruleForm.productVoList.map(val => {
				val.firstUseTime = val.firstUseTime ? `${val.firstUseTime} 00:00:00` : '';
			});
			this.$refs[formName].validate(valid => {
				if (valid) {
					let params = this.ruleForm;
					this.addMortgageExchangeOrder(params);
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		handleCancel(formName) {
			this.$refs[formName].resetFields();
			this.$nextTick(() => {
				this.$dispatch('UP_LIST');
				this.$closeSelf();
			});
		},
	},
};
</script>
<style lang="scss" scoped>
.main-content {
	padding-top: 20px !important;
	.detailMessage {
		margin: 24px 0;
		.box-card {
			width: 100%;
			border-bottom: 1px solid #ececec;
			margin-bottom: 24px;
			.footer-box {
				display: flex;
				justify-content: space-between;
				margin: 24px 0;
				.first-box {
					display: flex;
					align-items: center;
					font-size: 14px;
					color: rgba(92, 98, 104, 1);
				}
				.first-box:nth-child(1) div {
					margin-right: 60px;
					span {
						margin-right: 16px;
					}
				}
			}
			.title {
				font-size: 16px;
				width: 100%;
				padding-bottom: 12px;
				border-bottom: 1px solid #ececec;
				display: inline-block;
				span {
					color: #ff0000;
					font-size: 12px;
					margin-left: 15px;
				}
			}
			.detailMessage-box {
				padding: 24px 0;
				width: 100%;
				overflow: hidden;
			}
		}
	}
	.row-gap {
		margin-bottom: 16px;
	}
	.flex {
		display: flex;
		font-weight: 400;
		font-size: 14px;
		color: rgba(92, 98, 104, 1);
		.label {
			width: 100px;
			text-align: left;
		}
		.content {
			margin-left: 0px;
		}
	}
	.dialog-footer {
		display: flex;
		justify-content: center;
		margin-bottom: 16px;
	}
	.min-width {
		min-width: 1224px;
	}
	.mb {
		margin-bottom: 24px;
	}
	.self-width {
		width: 500px;
	}
	.mb-32 {
		margin-bottom: 32px;
	}
	.ml-16 {
		margin-left: 16px !important;
	}
	.cacel-btn {
		width: 132px;
	}
}
</style>
