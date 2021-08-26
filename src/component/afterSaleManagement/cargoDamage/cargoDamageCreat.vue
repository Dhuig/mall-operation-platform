<template>
	<div class="add-pledge-order">
		<guideBar />
		<el-form
			:inline="true"
			ref="addMortgageDiffOrderVO"
			label-width="180px"
			:model="addMortgageDiffOrderVO"
			:rules="CARGO_DAMAGE_RULE"
			label-suffix=":"
		>
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>{{ nextPage ? '基本' : '货物清单' }}</span>
				</div>
				<el-row class="min-width">
					<el-col :span="8">
						<el-form-item label="服务中心编号" prop="storeCode">
							<!-- <span v-if="nextPage">{{ addMortgageDiffOrderVO.storeCode }}</span> -->
							<el-input
								:disabled="nextPage"
								placeholder="请输入服务中心编号"
								v-model="addMortgageDiffOrderVO.storeCode"
								@blur.prevent="search"
								size="medium"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="服务中心名称">
							<span>{{ storeInfo && storeInfo.name }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="负责人卡号">
							<span>{{ storeInfo && storeInfo.shopkeeperId }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="8">
						<el-form-item label="发货日期" prop="deliverDate">
							<el-date-picker
								:disabled="nextPage"
								:picker-options="pickerDisabled"
								value-format="yyyy-MM-dd"
								v-model="addMortgageDiffOrderVO.deliverDate"
								type="date"
								placeholder="选择日期"
							></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="收货日期" prop="receiveDate">
							<el-date-picker
								:disabled="nextPage"
								:picker-options="pickerDisabled"
								value-format="yyyy-MM-dd"
								v-model="addMortgageDiffOrderVO.receiveDate"
								type="date"
								placeholder="选择日期"
							></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="8">
						<el-form-item label="类型" prop="diffType">
							<span v-if="nextPage">{{ addMortgageDiffOrderVO.diffType == '1' ? '货损' : '货差' }}</span>
							<el-radio
								v-if="!nextPage"
								@change="getAllDiffReason(addMortgageDiffOrderVO.diffType)"
								v-model="addMortgageDiffOrderVO.diffType"
								label="1"
							>
								货损
							</el-radio>
							<el-radio
								v-if="!nextPage"
								@change="getAllDiffReason(addMortgageDiffOrderVO.diffType)"
								v-model="addMortgageDiffOrderVO.diffType"
								label="2"
							>
								货差
							</el-radio>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="12">
						<el-form-item label="发货单号" prop="deliverySn">
							<!-- <p v-if="nextPage">{{ addMortgageDiffOrderVO.deliverySn }}</p> -->
							<el-input
								:disabled="nextPage"
								type="textarea"
								@blur="getDeliverySnList(addMortgageDiffOrderVO.deliverySn)"
								v-model="addMortgageDiffOrderVO.deliverySn"
							></el-input>
							<el-button v-if="!nextPage" type="text" @click="searchOddNum">导入发货单号产品</el-button>
							<p v-if="!nextPage">支持输入多个发货单号，每行支持一个发货单号，支持按回车换行</p>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="12">
						<el-form-item label="备注" prop="orderRemarks">
							<p v-if="nextPage">{{ addMortgageDiffOrderVO.orderRemarks }}</p>
							<el-input v-else type="textarea" v-model="addMortgageDiffOrderVO.orderRemarks"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-card>
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>货损货差详情</span>
					<div class="header_title">
						<span class="left_span">
							<span>损差数量合计:</span>
							<span>{{ ableAmount || 0 }}</span>
						</span>
						<span class="left_span">
							<span>合计金额:</span>
							<span>{{ moneyAll || 0 }}</span>
						</span>
					</div>
				</div>
				<el-table :data="addMortgageDiffOrderVO.productList" style="width: 100%" border>
					<el-table-column prop="opt" label="序号" width="80px">
						<template slot-scope="scope">
							<span>{{ scope.$index + 1 }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productCode" label="产品编号" width="180">
						<template slot-scope="scope">
							<!-- <span v-if="nextPage">{{ scope.row.productCode }}</span> -->
							<el-input
								:disabled="nextPage"
								style="width: 100%"
								size="small"
								v-model="scope.row.productCode"
								@blur="searchProduct(scope.row)"
								placeholder="请输入"
							/>
						</template>
					</el-table-column>
					<el-table-column prop="productName" label="产品名称" min-width="120"></el-table-column>
					<el-table-column prop="productSecCode" label="二级产品编码" min-width="120"></el-table-column>
					<el-table-column prop="productSecName" label="二级产品名称" min-width="120"></el-table-column>
					<el-table-column prop="productRetailPrice" label="零售价"></el-table-column>
					<el-table-column prop="productPacking" label="规格" min-width="120"></el-table-column>
					<el-table-column prop="productUnit" label="单位"></el-table-column>
					<el-table-column label="类型">
						<template>
							<span>{{ addMortgageDiffOrderVO.diffType == '1' ? '货损' : '货差' }}</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="productDiffDescId"
						label="详细描述"
						min-width="180"
						:rules="CARGO_DAMAGE_RULE.productDiffDescId"
					>
						<template slot-scope="scope">
							<el-select :disabled="nextPage ? true : false" v-model="scope.row.productDiffDescId" placeholder="请选择">
								<el-option
									v-for="item in detailOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column prop="productNum" label="损差数量" min-width="120">
						<template slot-scope="scope">
							<el-input-number
								:disabled="nextPage"
								style="width: 100%"
								size="small"
								:min="1"
								:max="scope.row.maxNum"
								v-model="scope.row.productNum"
							/>
						</template>
					</el-table-column>
					<el-table-column prop="moneySubtotal" label="金额小计">
						<template slot-scope="scope">
							<span>{{ scope.row.productRetailPrice * scope.row.productNum || 0 }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="deliverySn" label="发货单号" min-width="120"></el-table-column>
					<el-table-column prop="deliverTime" label="发货日期" min-width="120">
						<template slot-scope="scope">
							<span>{{ scope.row.deliverTime | format }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="mortgageOrderSn" label="对应押货单" min-width="120">
						<template slot-scope="scope">
							<span @click="goPage(scope.row)" class="blue">{{ scope.row.mortgageOrderSn }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="operation" v-if="!nextPage" label="操作" width="140">
						<template slot-scope="scope">
							<span class="btns" @click="deleteRow(scope.$index)">删除</span>
						</template>
					</el-table-column>
				</el-table>
				<div class="footer-box" v-if="!nextPage">
					<div>
						<el-button type="primary" @click="dialogFormVisible = true">添加货损货差产品</el-button>
					</div>
				</div>
			</el-card>
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>{{ nextPage ? '凭证' : '添加凭证' }}</span>
				</div>
				<div v-if="!nextPage">
					<p>注：</p>
					<p>1、《货损、货差证明》（须服务中心与物流公司送货人双方签名加盖公章）；</p>
					<p>2、黄色联《货物清单》（须服务中心在黄色回执联注明货损或货差数量及情况，并签名盖公章）；</p>
					<p>3、货损照片（产品货损时提供）</p>
				</div>
				<el-row class="min-width">
					<el-col :span="12">
						<el-form-item label="《货损，货差证明》" prop="diffProofs">
							<el-upload
								class="upload-demo"
								:disabled="nextPage"
								:action="$store.getters['system/getOssUploadUrl']"
								:headers="$store.getters['system/getSignatureVerification']"
								:data="uploadData"
								:limit="3"
								:on-preview="handlePreview"
								:on-exceed="handleExceed"
								:on-remove="(file, fileList) => handleRemove(file, fileList, 'diffProofs')"
								:on-success="(response, file, fileList) => handleSuccessFile(response, file, fileList, 'diffProofs')"
								:before-upload="beforeAvatarUpload"
							>
								<el-button size="small" type="primary" v-if="!nextPage">添加附件</el-button>
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
					<el-col :span="12">
						<el-form-item label="《货物清单》" prop="diffProductList">
							<el-upload
								class="fileStyle"
								:disabled="nextPage"
								:action="$store.getters['system/getOssUploadUrl']"
								:data="uploadData"
								:on-preview="handlePreview"
								:limit="3"
								:headers="$store.getters['system/getSignatureVerification']"
								:on-exceed="handleExceed"
								:on-remove="(file, fileList) => handleRemove(file, fileList, 'diffProductList')"
								:on-success="
									(response, file, fileList) => handleSuccessFile(response, file, fileList, 'diffProductList')
								"
								:before-upload="beforeAvatarUpload"
							>
								<el-button size="small" type="primary" v-if="!nextPage">添加附件</el-button>
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
				<el-row class="min-width">
					<el-col :span="12">
						<el-form-item label="《货损照片》" prop="diffPhotos">
							<el-upload
								class="fileStyle"
								:disabled="nextPage"
								:action="$store.getters['system/getOssUploadUrl']"
								:data="uploadData"
								:limit="3"
								:headers="$store.getters['system/getSignatureVerification']"
								:on-preview="handlePreview"
								:on-exceed="handleExceed"
								:on-remove="(file, fileList) => handleRemove(file, fileList, 'diffPhotos')"
								:on-success="(response, file, fileList) => handleSuccessFile(response, file, fileList, 'diffPhotos')"
								:before-upload="beforeAvatarUpload"
							>
								<el-button size="small" type="primary" v-if="!nextPage">添加附件</el-button>
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
					<el-col :span="12">
						<el-form-item label="《其它附件》" prop="diffOtherProofs">
							<el-upload
								class="fileStyle"
								:disabled="nextPage"
								:action="$store.getters['system/getOssUploadUrl']"
								:data="uploadData"
								:limit="3"
								:headers="$store.getters['system/getSignatureVerification']"
								:on-preview="handlePreview"
								:on-exceed="handleExceed"
								:on-remove="(file, fileList) => handleRemove(file, fileList, 'diffOtherProofs')"
								:on-success="
									(response, file, fileList) => handleSuccessFile(response, file, fileList, 'diffOtherProofs')
								"
								:before-upload="beforeAvatarUpload"
							>
								<el-button size="small" type="primary" v-if="!nextPage">添加附件</el-button>
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
			</el-card>
			<div class="eidt-btn-footer">
				<div class="eidt-btn-footer-box">
					<el-button v-if="!nextPage" type="primary" plain @click="handleNext('addMortgageDiffOrderVO')">
						下一步
					</el-button>
					<el-button v-if="nextPage" :loading="submitLoading" type="primary" plain @click="handleSave()">
						提交
					</el-button>
					<el-button v-if="nextPage" type="primary" plain @click="nextPage = false">返回</el-button>
				</div>
			</div>
		</el-form>
		<el-dialog title="选择货损货差产品" :visible.sync="dialogFormVisible">
			<el-form :model="form" ref="form" :rules="CARGO_DAMAGE_ADD_RULE">
				<el-form-item label="产品编号" label-width="120px">
					<el-select
						v-model="form.productCode"
						filterable
						remote
						@change="getFromData"
						reserve-keyword
						placeholder="请输入产品编号"
						:remote-method="remoteMethod"
						:loading="loading"
					>
						<el-option
							v-for="item in restaurants"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="产品名称" prop="productName" label-width="120px">
					<span>{{ form.productName || form.productSecName }}</span>
				</el-form-item>
				<el-form-item label="发货单号" prop="deliverySn" label-width="120px">
					<span>{{ form.deliverySn }}</span>
				</el-form-item>
				<el-form-item label="数量" prop="productNum" label-width="120px">
					<el-input-number v-model="form.productNum" :min="1" :max="form.maxNum"></el-input-number>
				</el-form-item>
				<el-form-item label="详细描述" label-width="120px">
					<el-select v-model="form.productDiffDescId" placeholder="请选择">
						<el-option
							v-for="item in detailOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="resetAddProduct('form')">取 消</el-button>
				<el-button type="primary" @click="comfirmAddProduct('form')">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 预览 -->
		<el-dialog class="preview_dialog" title="预览" width="40%" :visible.sync="previewDialog">
			<img :src="previewImg" alt />
		</el-dialog>
	</div>
</template>
<script>
import qs from 'querystring';
import { formatDate, uploadFileType } from 'util/formValidation';
import { CARGO_DAMAGE_ADD_RULE, CARGO_DAMAGE_RULE } from './config';
export default {
	name: 'cargoDamageCreat',
	data() {
		return {
			headers: {
				Authorization: this.$store.getters['user/getFullToken'],
			},
			CARGO_DAMAGE_ADD_RULE, //新增货损货差产品校验
			CARGO_DAMAGE_RULE, //新增货损货差
			dialogFormVisible: false, //选择货损货差产品
			nextPage: false, //是否进入下一页
			form: {},
			// 禁用当天之后的时间
			pickerDisabled: {
				disabledDate: time => {
					return time.getTime() > new Date(new Date().toLocaleDateString()).getTime();
				},
			},
			loading: false, //下拉联想加载
			//下拉联想数据
			restaurants: [],
			restaurantsList: [],
			detailOptions: [], //详情描述列表
			addMortgageDiffOrderVO: {
				storeCode: '',
				receiveDate: '',
				diffType: null,
				orderRemarks: '',
				productList: [],
				diffProofs: [], //货损货差证明文件
				diffProductList: [], //货物清单文件
				diffPhotos: [], //货损照片
				diffOtherProofs: [], //其他凭证
				deliverySnList: [],
				deliverySn: '',
			},
			fileListDiffProofs: [], //货损货差证明文件列表
			fileListDiffProductList: [], //货物清单文件列表
			fileListDiffPhotos: [], //货损照片列表
			fileListDiffOtherProofs: [], //其他凭证列表
			showStoreInfo: false, // 显示服务中心内容
			storeInfo: {}, // 服务中心信息
			checkProductList: [], // 勾选的产品列表
			fileList: [],
			previewImg: '', // 预览图片
			previewDialog: false, // 预览弹框
			submitLoading: false,
		};
	},
	computed: {
		// 损差合计
		ableAmount() {
			return this.addMortgageDiffOrderVO.productList
				.map(item => item.productNum)
				.reduce((acc, cur) => parseFloat(cur) + acc, 0);
		},
		// 合计金额
		moneyAll() {
			return this.addMortgageDiffOrderVO.productList
				.map(item => item.productNum * item.productRetailPrice)
				.reduce((acc, cur) => parseFloat(cur) + acc, 0);
		},
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.stock,
			};
			return params;
		},
	},
	created() {},
	filters: {
		// 格式时间
		format(val) {
			if (!val) return;
			return formatDate(val);
		},
	},
	methods: {
		// 跳转押货单详情
		goPage(row) {
			// console.log(row);
			this.$go('charging_detail', { type: 'detail', title: '押货单详情', orderSn: row.mortgageOrderSn });
		},
		getDeliverySnList(sn) {
			let a = sn;
			a = a.replace(/\s+/g, ',');
			a = a.replace(',,', ',');
			let list = a.split(',');
			this.addMortgageDiffOrderVO.deliverySnList = list;
		},
		// 导入发货单号产品
		searchOddNum() {
			if (this.addMortgageDiffOrderVO.deliverySn) {
				let params = {
					deliverSnList: this.addMortgageDiffOrderVO.deliverySnList,
					storeCode: this.addMortgageDiffOrderVO.storeCode,
				};
				this.getDeliverProductList(params);
			} else {
				this.$message({
					message: '发货单号不能为空',
					type: 'warning',
				});
			}
		},
		// 确定添加货损货差产品
		comfirmAddProduct(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.addMortgageDiffOrderVO.productList.push(this.form);
					this.dialogFormVisible = false;
					this.form = {};
				} else {
					return false;
				}
			});
		},
		// 取消添加货损货差产品
		resetAddProduct(formName) {
			this.$refs[formName].resetFields();
			this.dialogFormVisible = false;
		},
		// 表格操作
		deleteRow(index) {
			this.addMortgageDiffOrderVO.productList.splice(index, 1);
		},
		//获取联想数据
		remoteMethod(query) {
			if (query !== '') {
				this.loading = true;
				setTimeout(() => {
					this.loading = false;
					this.getAssociate(query);
				}, 200);
			} else {
				this.restaurants = [];
			}
		},
		async getAssociate(keyword) {
			let deliverSnList = this.addMortgageDiffOrderVO.deliverySnList.join(',');
			const params = {
				deliverSnList: deliverSnList,
				keyword: keyword,
				storeCode: this.addMortgageDiffOrderVO.storeCode,
			};
			const res = await this.$fetch(`/mgmt/inventory/diffOrder/getMatchDeliveryProducts?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { data } = res;
				this.restaurantsList = data;
				this.restaurants = [];
				this.restaurantsList.map(e => {
					let item = {
						value: e.productSecCode || e.productCode,
						label: e.productSecName || e.productName,
					};
					this.restaurants.push(item);
				});
				if (this.restaurantsList.length == 0) {
					this.form = {};
				}
			}
		},
		getFromData(val) {
			if (this.restaurantsList.length > 0) {
				this.restaurantsList.map(item => {
					if (val === (item.productSecCode || item.productCode)) {
						item.deliverySn = item.deliverSn;
						item.mortgageOrderSn = item.orderSn;
						item.maxNum = item.productNum;
						this.form = item;
						console.log(this.form);
					}
				});
			}
		},
		createStateFilter(queryString) {
			return state => {
				return state.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
			};
		},
		// 查询产品信息
		searchProduct(row) {
			// 根据产品编码获取商品信息处理
			const params = {
				// storeCode: this.addMortgageDiffOrderVO.storeCode,
				productCode: row.productCode,
			};
			this.getProductInfo(params).then(res => {
				row.productCode = res.productCode;
				row.productSecCode = res.productSecCode ? res.productSecCode : '';
				row.productName = res.productName;
				row.productPacking = res.productPacking;
				row.productUnit = res.productUnit;
				row.productBoxNum = res.productBoxNum || 0;
				row.productMortgagePrice = res.productMortgagePrice || 0;
				row.canMortgageNum = res.canMortgageNum || 0;
				row.productNum = 1;
			});
		},
		// 勾选库存
		handleSelection(val) {
			this.checkProductList = val;
		},
		// 取消
		cacelOrder() {
			this.show = false;
		},
		// 搜索事件
		search() {
			const params = {
				storeCode: this.addMortgageDiffOrderVO.storeCode,
			};
			this.getStoreInfo(params);
		},
		// 获取服务中心信息接口
		async getStoreInfo(params) {
			const res = await this.$fetch(`/mgmt/inventory/common/getStoreInfo?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { data } = res;
				this.storeInfo = data;
				this.showStoreInfo = true;
			} else {
				this.storeInfo = {};
			}
		},
		// 获取所有货损货差详情理由
		async getAllDiffReason(type) {
			this.detailOptions = [];
			const res = await this.$fetch(`/mgmt/inventory/diffOrder/getAllDiffReason`);
			if (res && res.code === 200) {
				let arr = [];
				Object.keys(res.data).forEach(item => arr.push(res.data[item]));
				this.addMortgageDiffOrderVO.productList.forEach(e => {
					e.productDiffDescId = '';
				});
				let list = [];
				if (type == 1) {
					list = arr[0];
					list.map(e => {
						let item = {
							value: e.diffId,
							label: e.diffDesc,
						};
						this.detailOptions.push(item);
					});
				} else {
					list = arr[1];
					list.map(e => {
						let item = {
							value: e.diffId,
							label: e.diffDesc,
						};
						this.detailOptions.push(item);
					});
				}
			} else {
				this.$message({
					type: 'error',
					message: res.message,
				});
			}
		},
		// 获取押货余额接口
		async getAvaiableAmount(params) {
			const res = await this.$fetch(`/mgmt/inventory/mortgageAmount/getAvailableAmount?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { data } = res;
				this.ableAmount = data;
			} else {
				this.ableAmount = '';
			}
		},
		// 获取服务中心全部库存信息接口
		async getProducts(params) {
			const res = await this.$fetch(`/mgmt/inventory/order/productsForAddPage?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { data } = res;
				this.productList = data;
			} else {
				this.productList = [];
			}
		},
		// 根据产品编码获取商品信息
		async getProductInfo(params) {
			const res = await this.$fetch(`/mgmt/inventory/common/getProductByCode?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { data } = res;
				return data;
			} else {
				this.$message({
					type: 'error',
					message: res.message,
				});
			}
		},
		// 凭证上传前格式验证
		beforeAvatarUpload(file) {
			const whiteList = ['Word', 'EXCEL', 'PDF', 'rar', 'zip', 'jpg', 'png', 'tif', 'bmp'];
			return uploadFileType.bind(this, file, whiteList, 10)();
		},
		// 获取发货单列表对应的商品
		async getDeliverProductList(params) {
			const res = await this.$fetch(`/mgmt/inventory/diffOrder/getDeliverProductList?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				let list = res.data;
				list.forEach(e => {
					e.deliverTime = e.deliverDate;
					e.deliverySn = e.deliverSn;
					e.maxNum = e.productNum;
				});
				this.addMortgageDiffOrderVO.productList = list;
				console.log(this.addMortgageDiffOrderVO.productList);
			}
		},
		// 限制数量
		handleExceed(files, fileList) {
			this.$message.warning(
				`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
			);
		},
		// 预览
		handlePreview(file) {
			this.previewDialog = true;
			this.previewImg = file.url;
		},

		// 文件上传成功
		handleSuccessFile(response, file, fileList, voucher) {
			this.addMortgageDiffOrderVO[voucher] = [];
			fileList.map(val => {
				let name = val.response.datas.fileUrlKey.split('/')[val.response.datas.fileUrlKey.split('/').length - 1];
				val.name = name;
				val.url = val.response.datas.fileUrlKey;
				let item = {
					name,
					url: val.response.datas.fileUrlKey,
				};
				this.addMortgageDiffOrderVO[voucher].push(item);
			});
		},
		// 删除文件
		handleRemove(file, fileList, voucher) {
			this.addMortgageDiffOrderVO[voucher] = [];
			fileList.map(val => {
				let name = val.response.datas.fileUrlKey.split('/')[val.response.datas.fileUrlKey.split('/').length - 1];
				val.name = name;
				let item = {
					name,
					url: val.response.datas.fileUrlKey,
				};
				this.addMortgageDiffOrderVO[voucher].push(item);
			});
		},
		// 新增货损货差单
		async handleSave() {
			let params = this.addMortgageDiffOrderVO;
			// if(params){
			// 	console.log(params)
			// 	return
			// }
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/inventory/diffOrder/diffOrder',
				data: params,
			});
			this.submitLoading = false;
			if (res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.$nextTick(() => {
					this.$dispatch('UP_LIST');
					this.$closeSelf();
				});
			} else {
				this.$message({
					type: 'error',
					message: res.message,
				});
			}
		},
		// 下一步
		handleNext(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.addMortgageDiffOrderVO.productList.every(e => {
						if (e.productDiffDescId) {
							this.nextPage = true;
						} else {
							this.$message.error('详细描述不能为空');
							return false;
						}
					});
				} else {
					return false;
				}
			});
		},
	},
};
</script>
<style lang="scss" scoped>
.blue {
	color: #3883f8;
	cursor: pointer;
}
::v-deep.add-pledge-order {
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}
	.title {
		margin-bottom: 30px;
		font-weight: 500;
		color: rgba(48, 51, 54, 1);
	}
	.el-card__header {
		background-color: #eee;
	}
	.header_title {
		display: inline-block;
		margin-left: 100px;
		font-size: 14px;
		.left_span {
			margin-right: 24px;
			span:nth-child(2) {
				margin-left: 12px;
			}
		}
		.right_span {
			span:nth-child(2) {
				margin-left: 12px;
			}
		}
	}
	.fr {
		float: right;
		margin-top: 20px;
		cursor: pointer;
	}
	.eidt-btn-footer {
		z-index: 1;
		background: #fff;
		padding: 16px 38px;
		box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.2);
		position: fixed;
		bottom: 0;
		left: 264px;
		right: 0;
		.eidt-btn-footer-box {
			text-align: center;
			.el-button--default {
				background: rgba(255, 255, 255, 1);
				border-radius: 4px;
				border: 1px solid rgba(211, 217, 226, 1);
				color: #303336;
				font-size: 14px;
			}
			.el-button--primary {
				background: rgba(56, 131, 248, 1);
				border-radius: 2px;
				color: #fff;
				font-size: 14px;
			}
			button {
				padding: 9px 16px;
			}
		}
	}
	.flex {
		display: flex;
		font-weight: 400;
		font-size: 14px;
		color: rgba(92, 98, 104, 1);
		.label {
			width: 180px;
			text-align: right;
		}
		.content {
			margin-left: 0px;
		}
	}
	.self-label {
		display: flex;
		justify-content: center;
		font-weight: 400;
		font-size: 14px;
		color: rgba(92, 98, 104, 1);
	}
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
	.preview_dialog .el-dialog {
		max-width: 500px;
		img {
			width: 100%;
		}
	}
}
</style>
