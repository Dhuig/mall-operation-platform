<template>
	<div class="edit_group_order">
		<guideBar />
		<el-card class="card" shadow="never">订单号: {{ orderDetails.orderNo }}</el-card>
		<el-card class="card" shadow="never">
			<el-form
				ref="editGroupBuyOrderForm"
				:model="editGroupBuyOrderForm"
				:rules="editGroupBuyOrderFormRules"
				label-width="130px"
			>
				<h2 class="title">团购单位信息</h2>
				<el-form-item prop="groupBuyInstitutionInfo.institution" label="单位名称：">
					<el-input
						v-model="editGroupBuyOrderForm.groupBuyInstitutionInfo.institution"
						size="medium"
						placeholder="请输入单位名称"
					></el-input>
				</el-form-item>
				<el-form-item prop="groupBuyInstitutionInfo.institutionRegion" label="所在地区：">
					<addressSelect
						@chooseAddress="e => changeConsigneeRegion(e, false)"
						:defalutData="editGroupBuyOrderForm.groupBuyInstitutionInfo.institutionRegion"
						:needValid="false"
					></addressSelect>
				</el-form-item>
				<el-form-item prop="groupBuyInstitutionInfo.address" label="单位地址：">
					<el-input
						v-model="editGroupBuyOrderForm.groupBuyInstitutionInfo.address"
						size="medium"
						placeholder="请输入单位地址"
					></el-input>
				</el-form-item>
				<h2 class="title">
					收货信息
					<el-popover trigger="hover" placement="right">
						<div>- 选择服务中心收货不支持编辑地址</div>
						<div>- 服务中心收货姓名和电话为服务中心负责人姓名和电话</div>
						<div>- 服务中心地区和地址区服务中心地区和详细地址</div>
						<i slot="reference" style="margin-left: 30px" class="el-icon-warning-outline"></i>
					</el-popover>
				</h2>
				<el-form-item prop="receiveInfo.receiveType" label="收货对象：">
					<el-radio-group v-model="editGroupBuyOrderForm.receiveInfo.receiveType">
						<el-radio :label="1">单位收货</el-radio>
						<el-radio :label="2">服务中心收货</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item prop="receiveInfo.consigneeName" label="收货人姓名：">
					<el-input
						v-model="editGroupBuyOrderForm.receiveInfo.consigneeName"
						size="medium"
						placeholder="请输入收货人姓名"
					></el-input>
				</el-form-item>
				<el-form-item prop="receiveInfo.consigneeMobile" label="收货人电话：">
					<el-input
						v-model.number="editGroupBuyOrderForm.receiveInfo.consigneeMobile"
						size="medium"
						placeholder="请输入收货人电话"
					></el-input>
				</el-form-item>
				<el-form-item prop="receiveInfo.consigneeRegion" label="所在地区：">
					<addressSelect
						@chooseAddress="e => changeConsigneeRegion(e, true)"
						:disabled="editGroupBuyOrderForm.receiveInfo.receiveType == 2"
						:defalutData="editGroupBuyOrderForm.receiveInfo.consigneeRegion"
						:needValid="false"
					></addressSelect>
				</el-form-item>
				<el-form-item prop="receiveInfo.address" label="详细地址：">
					<el-input
						:disabled="editGroupBuyOrderForm.receiveInfo.receiveType == 2"
						v-model="editGroupBuyOrderForm.receiveInfo.address"
						size="medium"
						placeholder="请输入详细地址"
					></el-input>
				</el-form-item>
				<h2 class="title">汇款信息</h2>
				<el-form-item prop="remitInfo.remitType" label="汇款方式：">
					<el-radio-group v-model="editGroupBuyOrderForm.remitInfo.remitType">
						<el-radio :label="1">单位汇款</el-radio>
						<el-radio :label="2">云商垫付</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item prop="remitInfo.bankAccount" label="银行账号：">
					<el-input
						v-model="editGroupBuyOrderForm.remitInfo.bankAccount"
						size="medium"
						placeholder="请输入银行账号"
					></el-input>
				</el-form-item>
				<el-form-item prop="remitInfo.bankName" label="银行名称：">
					<el-input
						v-model="editGroupBuyOrderForm.remitInfo.bankName"
						size="medium"
						placeholder="请输入银行名称"
					></el-input>
				</el-form-item>
				<el-form-item prop="remitInfo.remitCredentials" label="汇款凭证：">
					<el-upload
						class="upload-demo"
						multiple
						:data="ossParams"
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:on-remove="handleRemove"
						:on-preview="handlePictureCardPreview"
						:on-success="handleSuccess"
						:before-upload="beforeAvatarUpload(file, 10, ['jpeg', 'jpg', 'png'])"
						:limit="5"
						:file-list="editGroupBuyOrderForm.remitInfo.remitCredentials"
						list-type="picture-card"
					>
						<i class="el-icon-plus"></i>
						<div slot="tip" class="el-upload__tip tip-title" ref="up_dom">
							(支持JPG、JPEG、PNG，最大10M，最多可以上传5张图片)
						</div>
					</el-upload>
				</el-form-item>
				<h2 class="title">发票信息</h2>
				<el-form-item prop="needInvoice" label="是否需要发票：">
					<el-radio-group v-model="editGroupBuyOrderForm.needInvoice">
						<el-radio :label="0">否</el-radio>
						<el-radio :label="1">是</el-radio>
					</el-radio-group>
					<template v-if="editGroupBuyOrderForm.needInvoice === 1">
						<div>
							<el-button type="text" @click="ticketModal.show = true">{{ invoiceText }}</el-button>
						</div>
						<div v-if="invoice">
							<p>开票类型：{{ GROUP_INVOICE_TYPE[invoice.type] }}</p>
							<p>纳税人识别号：{{ invoice.taxpayerNo }}</p>
							<p>单位全称：{{ invoice.draweeName }}</p>
							<p>注册地址：{{ invoice.registerAddress }}</p>
							<p>注册电话：{{ invoice.registerPhone }}</p>
							<p>开户银行名称：{{ invoice.bankName }}</p>
							<p>开户银行账号：{{ invoice.bankAccount }}</p>
							<p>联系人电话：{{ invoice.phone }}</p>
							<p>
								附件资料：
								<el-button type="text">查看</el-button>
							</p>
						</div>
					</template>
				</el-form-item>
				<h2 class="title">签订合同</h2>
				<el-form-item prop="contractAtt" label="上传合同">
					<div class="upload-contract">
						<el-upload
							class="upload-demo"
							:data="ossParams"
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:on-remove="handleRemoveContractAtt"
							:on-success="handleSuccessContractAtt"
							:before-upload="beforeAvatarUpload(file, 5, ['doc', 'docx', 'pdf', 'bmp', 'jpg', 'png'])"
							:limit="1"
							:file-list="editGroupBuyOrderForm.contractAttFileList"
						>
							<div slot="tip" class="el-upload__tip">支持格式doc、docx、pdf、bmp、jpg、png，最大5M</div>
							<el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
						<el-button size="small" type="text" @click="handleDown('contract')">下载合同范本</el-button>
					</div>
				</el-form-item>
				<h2 class="title">承诺书</h2>
				<el-form-item prop="commitment" label="上传承诺书">
					<div class="upload-contract">
						<el-upload
							:data="ossParams"
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:on-remove="handleRemoveCommitment"
							:on-success="handleSuccessCommitment"
							:before-upload="beforeAvatarUpload(file, 5, ['doc', 'docx', 'jpg', 'jpeg', 'bmp', 'gif', 'png'])
							"
							:limit="1"
							:file-list="editGroupBuyOrderForm.commitmentFileList"
						>
							<div slot="tip" class="el-upload__tip">支持格式doc、docx、jpg、jpeg、bmp、gif、png，最大5M</div>
							<el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
						<el-button size="small" type="text" @click="handleDown('commitment')">下载承诺书</el-button>
					</div>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="card" shadow="never">
			<div slot="header" class="clearfix">
				<span>产品信息</span>
			</div>
			<el-table :data="products" class="products">
				<el-table-column type="index" label="序号" align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button @click="addProduct" type="text" size="medium">
							<i class="el-icon-plus"></i>
						</el-button>
						<el-button @click="deleteProduct(scope.$index)" type="text" size="medium">
							<i class="el-icon-delete"></i>
						</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="productCode" label="产品编码" align="center">
					<template slot-scope="scope">
						<el-autocomplete
							v-if="!scope.row.isExistingProduct"
							v-model="scope.row.productCode"
							value-key="serialNo"
							:fetch-suggestions="querySearchAsync"
							placeholder="请输入产品编码"
							@select="handleSelect"
						></el-autocomplete>
						<span v-else>{{ scope.row.productCode }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
				<el-table-column prop="packing" label="规格" align="center"></el-table-column>
				<el-table-column prop="meterUnit" label="单位" align="center"></el-table-column>
				<el-table-column prop="retailPrice" label="零售价" align="center">
					<template slot-scope="scope">{{ scope.row.retailPrice | addPrefixForAmount }}</template>
				</el-table-column>
				<el-table-column prop="stock" label="数量" align="center" width="150">
					<template slot-scope="scope">
						<el-input-number
							style="width: 100%"
							:min="1"
							v-model="scope.row.stock"
							:step="1"
							size="small"
							step-strictly
						></el-input-number>
					</template>
				</el-table-column>
				<el-table-column prop="groupPrice" label="团购价" align="center" width="150">
					<template slot-scope="scope">
						<el-input-number
							style="width: 106%"
							v-model="scope.row.groupPrice"
							:precision="2"
							:step="0.1"
							size="small"
						></el-input-number>
					</template>
				</el-table-column>
				<el-table-column label="金额小计(按团购价)" align="center">
					<template slot-scope="scope">
						{{ (scope.row.groupPrice * scope.row.stock) | summaryCalc | addPrefixForAmount }}
					</template>
				</el-table-column>
			</el-table>
			<p>
				<span>商品数量: {{ productsAmount }}</span>
				<span>金额合计: {{ totalAmount | summaryCalc | addPrefixForAmount }}</span>
			</p>
		</el-card>
		<el-card class="card" shadow="never">
			<div slot="header" class="clearfix">
				<span>备注</span>
			</div>
			<el-input type="textarea" placeholder="请输入备注" v-model="remark"></el-input>
		</el-card>
		<actionBar>
			<template>
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" @click="save">保存</el-button>
			</template>
		</actionBar>
		<!-- 图片预览 -->
		<el-dialog :visible.sync="dialogVisible" v-drag>
			<img width="100%" :src="dialogImageUrl" alt />
		</el-dialog>
		<ticketModal
			v-if="editGroupBuyOrderForm.needInvoice === 1"
			:ticketModal="ticketModal"
			:invoice="invoice"
			@close="handleClose"
		/>
		<!-- 弹窗开关 -->
		<el-dialog
			center
			:close-on-press-escape="false"
			:show-close="false"
			fullscreen
			:visible.sync="successDialog"
			v-drag
		>
			<div class="dialogContent">
				<div class="el-icon-success icon"></div>
				<div class="bigTitle title">提交成功</div>
				<div>
					<el-button @click="successdialogEnter('lookInfo')">查看详情</el-button>
					<el-button @click="successdialogEnter">返回列表</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import city from 'config/city';
import { addPrefixForAmount } from 'util/formValidation';
import ticketModal from '../modal/ticketModal';
import { uploadFileType } from 'util/formValidation';
import { phoneValidator } from '../config.js';
export default {
	name: 'editGroupBuyOrder',
	data() {
		return {
			GROUP_INVOICE_TYPE: {},
			orderDetails: {},
			ticketModal: {
				show: false,
				submitCallback: this.submitCallback,
			},
			editGroupBuyOrderForm: {
				groupBuyInstitutionInfo: {
					institution: '', // 单位名称
					institutionRegion: null, // 单位所在地区
					address: '', // 单位详细地址
				},
				receiveInfo: {
					receiveType: 1, // 收货对象
					consigneeName: '', // 收货人姓名
					consigneeMobile: '', // 收货人电话
					consigneeRegion: null, // 收货人所在地区
					address: '', // 收货人详细地址
				},
				remitInfo: {
					remitType: 1, // 汇款方式
					bankAccount: '', // 银行账号
					bankName: '', // 银行名称
					remitCredentials: [], // 汇款凭证
				},
				needInvoice: 0,
				contractAtt: null, // 合同附件
				commitment: null,
				contractAttFileList: [], // 合同附件上传文件list
				commitmentFileList: [],
			},
			invoice: null, // 发票信息
			products: [],
			remark: '', // 备注
			editGroupBuyOrderFormRules: {
				'groupBuyInstitutionInfo.institution': [
					{ required: true, message: '请输入单位名称', trigger: ['blur', 'change'] },
					{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: ['blur', 'change'] },
				], // 单位名称
				'groupBuyInstitutionInfo.institutionRegion': [
					{ required: true, message: '请选择单位所在地区', trigger: ['blur', 'change'] },
				], // 单位所在地区
				'groupBuyInstitutionInfo.address': [
					{ required: true, message: '请输入单位详细地址', trigger: ['blur', 'change'] },
					{ min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: ['blur', 'change'] },
				], // 单位详细地址
				'receiveInfo.receiveType': [{ required: true, message: '请选择收货对象', trigger: ['blur', 'change'] }], // 收货对象
				'receiveInfo.consigneeName': [
					{ required: true, message: '请输入收货人电话', trigger: ['blur', 'change'] },
					{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: ['blur', 'change'] },
				], // 收货人姓名
				'receiveInfo.consigneeMobile': [
					{ required: true, message: '请输入收货人电话', trigger: ['blur', 'change'] },
					{ validator: phoneValidator, message: '请输入正确的收货人电话', trigger: 'blur' },
					// { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: ['blur', 'change'] },
					// { type: 'number', message: '收货人电话必须为数字值' },
				], // 收货人电话
				'receiveInfo.consigneeRegion': [
					{ required: true, message: '请选择收货人所在地区', trigger: ['blur', 'change'] },
				], // 收货人所在地区
				'receiveInfo.address': [
					{ required: true, message: '请输入收货人详细地址', trigger: ['blur', 'change'] },
					{ min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: ['blur', 'change'] },
				], // 收货人详细地址
				'remitInfo.remitType': [{ required: true, message: '请选择收款方式', trigger: ['blur', 'change'] }], // 汇款方式
				'remitInfo.bankAccount': [
					{ required: true, message: '请输入银行账号', trigger: ['blur', 'change'] },
					{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: ['blur', 'change'] },
				], // 银行账号
				'remitInfo.bankName': [
					{ required: true, message: '请输入银行名称', trigger: ['blur', 'change'] },
					{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: ['blur', 'change'] },
				], // 银行名称
				'remitInfo.remitCredentials': [{ required: true, message: '请上传汇款凭证', trigger: ['blur', 'change'] }], // 汇款凭证
				needInvoice: [{ required: true, message: '请选择是否需要发票', trigger: ['blur', 'change'] }],
			},
			initStoreCodeInfo: {
				// 初始服务中心信息
				consigneeName: '',
				consigneeMobile: '',
				consigneeRegion: [],
				address: '',
			},
			initUnitInfo: {
				// 初始单位收货信息
				consigneeName: '',
				consigneeMobile: '',
				consigneeRegion: [],
				address: '', // 收货人详细地址
			},
			cascaderProps: {
				children: 'r',
				label: 'n',
				value: 'c',
				checkStrictly: true, // 选择任意一级选项
			},
			areaTree: city,
			ossParams: {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			},
			dialogImageUrl: '',
			dialogVisible: false,
			successDialog: false,
		};
	},
	methods: {
		// 下拉框
		changeConsigneeRegion(data, type) {
			if (type) {
				this.editGroupBuyOrderForm.receiveInfo.consigneeRegion = data.map(x => x.value);
				return;
			}
			this.editGroupBuyOrderForm.groupBuyInstitutionInfo.institutionRegion = data.map(x => x.value);
		},
		// 大小不超过10M。
		beforeAvatarUpload(file, num, whiteList) {
			return uploadFileType.call(this, file, whiteList, num);
		},
		async handleDown(key) {
			const res = await this.$fetch(`/mgmt/inventory/group-order/sample-url?key=${key}`);
			if (res && res.code === 200) {
				const { data } = res;
				window.open(data);
			}
		},
		submitCallback(value) {
			this.invoice = { ...value };
		},
		handleClose() {
			this.ticketModal.show = false;
		},
		async getDicts() {
			const [GROUP_INVOICE_TYPE] = await Promise.all([this.$getDict('GROUP_INVOICE_TYPE')]);
			this.GROUP_INVOICE_TYPE = GROUP_INVOICE_TYPE;
		},
		async getGroupBuyOrderDetails() {
			const { orderNo } = this.$route.query;
			const res = await this.$fetch({
				url: `/mgmt/inventory/group-order/detail`,
				params: { orderNo },
			});
			if (res && res.data) {
				const { invoice, products, storeCode, ...orderDetails } = res.data;
				let s = {};
				if (storeCode) {
					const storeCodeInfo = await this.$fetch(`/mgmt/inventory/group-order/store-address?storeCode=${storeCode}`);
					if (storeCodeInfo && storeCodeInfo.code === 200) {
						s = storeCodeInfo.data;
					}
				}
				this.invoice = invoice;
				this.products = products.map(item => ({ ...item, isExistingProduct: true }));
				this.orderDetails = orderDetails;
				const { consigneeAddr: c, institutionAddr: i } = orderDetails;
				// console.log([s.provinceCode, s.cityCode, s.areaCode, s.streetCode].filter(Boolean));
				const editGroupBuyOrderForm = {
					groupBuyInstitutionInfo: {
						institution: orderDetails.institution,
						institutionRegion: [i.province, i.city, i.district, i.town].filter(Boolean),
						address: orderDetails?.institutionAddr?.address,
					},
					receiveInfo: {
						receiveType: orderDetails.receiveType, // 收货对象
						consigneeName: orderDetails.receiveType === 1 ? orderDetails.consigneeName : s.person, // 收货人姓名
						consigneeMobile: orderDetails.receiveType === 1 ? orderDetails.consigneeMobile : s.phoneNum, // 收货人电话
						consigneeRegion:
							orderDetails.receiveType === 1
								? [c.province, c.city, c.district, c.town].filter(Boolean)
								: [s.provinceCode, s.cityCode, s.areaCode, s.streetCode].filter(Boolean),
						address: orderDetails.receiveType === 1 ? orderDetails.consigneeAddr.address : s.address, // 收货人详细地址
					},
					remitInfo: {
						remitType: orderDetails.remitType, // 汇款方式
						bankAccount: orderDetails.bankAccount, // 银行账号
						bankName: orderDetails.bankName, // 银行名称
						remitCredentials: orderDetails.remitCredentials.map(item => ({ url: item.url, name: item.name })), // 汇款凭证
					},

					needInvoice: orderDetails.needInvoice,
					commitment: orderDetails.commitment, // 承诺书
					commitmentFileList: [orderDetails.commitment],
					contractAtt: orderDetails.contracts, // 合同附件
					contractAttFileList: orderDetails.contracts
						? orderDetails.contracts.map(item => ({ url: item.url, name: item.name }))
						: [], // 合同附件上传文件list
				};

				this.editGroupBuyOrderForm = editGroupBuyOrderForm;
				this.remark = orderDetails.remark;
				this.initStoreCodeInfo = {
					// 初始服务中心信息
					consigneeName: s.person,
					consigneeMobile: s.phoneNum,
					consigneeRegion: [
						s.deliveryProvinceCode,
						s.deliveryCityCode,
						s.deliveryAreaCode,
						s.deliveryStreetCode,
					].filter(Boolean),
					address: s.deliveryDetailAddress,
				};
				this.initUnitInfo = {
					// 初始单位收货信息
					consigneeName: orderDetails.consigneeName,
					consigneeMobile: orderDetails.consigneeMobile,
					consigneeRegion: [c.province, c.city, c.district, c.town].filter(Boolean),
					address: orderDetails.consigneeAddr.address, // 收货人详细地址
				};
			}
		},
		handleRemove(file, fileList) {
			this.editGroupBuyOrderForm.remitInfo.remitCredentials = JSON.parse(JSON.stringify(fileList));
		},
		handleSuccess(response, file) {
			const {
				datas: { fileUrlKey },
				success,
			} = response;
			const { name } = file;
			if (success) {
				this.editGroupBuyOrderForm.remitInfo.remitCredentials = [
					...this.editGroupBuyOrderForm.remitInfo.remitCredentials,
					{
						name,
						url: fileUrlKey,
					},
				];
			}
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		handleRemoveContractAtt() {
			this.editGroupBuyOrderForm.contractAtt = [];
			this.editGroupBuyOrderForm.contractAttFileList = [];
		},
		handleSuccessContractAtt(response, file, fileList) {
			const {
				datas: { fileUrlKey },
			} = response;
			this.editGroupBuyOrderForm.contractAtt = [
				{
					url: fileUrlKey,
					name: file.name,
				},
			];
			this.editGroupBuyOrderForm.contractAttFileList = fileList;
		},
		handleRemoveCommitment() {
			this.editGroupBuyOrderForm.commitment = null;
			this.editGroupBuyOrderForm.commitmentFileList = [];
		},
		handleSuccessCommitment(response, file, fileList) {
			const {
				datas: { fileUrlKey },
			} = response;
			this.editGroupBuyOrderForm.commitment = {
				url: fileUrlKey,
				name: file.name,
			};
			this.editGroupBuyOrderForm.commitmentFileList = fileList;
		},
		handleCancel() {
			this.$confirm('取消后当前页面内容不会保存。', '确认取消', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.$closeSelf();
				})
				.catch(() => {});
		},
		save() {
			this.$refs['editGroupBuyOrderForm'].validate(async valid => {
				if (valid) {
					console.log(this.editGroupBuyOrderForm.receiveInfo.consigneeRegion);

					// 团购单位信息数据
					const { institution, institutionRegion } = this.editGroupBuyOrderForm.groupBuyInstitutionInfo;
					const institutionAddr = {
						address: this.editGroupBuyOrderForm.groupBuyInstitutionInfo.address,
						province: institutionRegion[0],
						city: institutionRegion[1],
						district: institutionRegion[2],
						town: institutionRegion[3],
					};
					// 收货人信息数据
					const { receiveType, consigneeName, consigneeMobile, address, consigneeRegion } =
						this.editGroupBuyOrderForm.receiveInfo;
					const consigneeAddr = {
						address,
						province: consigneeRegion[0],
						city: consigneeRegion[1],
						district: consigneeRegion[2],
						town: consigneeRegion[3],
					};
					// 汇款信息数据
					const { remitType, bankAccount, bankName, remitCredentials } = this.editGroupBuyOrderForm.remitInfo;

					// 汇款信息数据
					const { needInvoice, contractAtt, commitment } = this.editGroupBuyOrderForm;

					if (!commitment) {
						return this.$message.warning('请上传承诺书');
						// console.log(commitment);
					}

					const { products, remark, invoice } = this;

					const { orderNo } = this.orderDetails;

					const params = {
						orderNo,
						institution,
						institutionAddr,
						consigneeAddr,
						receiveType,
						consigneeName,
						consigneeMobile,
						remitType,
						bankAccount,
						bankName,
						remitCredentials,
						needInvoice,
						contracts: contractAtt,
						commitment,
						invoice: needInvoice === 0 ? null : invoice,
						products: products.map(item => {
							const { groupPrice, productCode, stock } = item;
							return { groupPrice, productCode, stock };
						}),
						remark,
						remittance: this.totalAmount,
					};
					const res = await this.$fetch({
						method: 'PUT',
						url: '/mgmt/inventory/group-order/update',
						data: params,
					});
					if (res && res.code === 200) {
						// this.$message.success('编辑成功');
						// this.$closeSelf();
						this.successDialog = true;
					} else {
						res && this.$message.error(res.data.message);
					}
				}
			});
		},
		addProduct() {
			this.products.push({
				productCode: '',
				productName: '',
				packing: '',
				meterUnit: '',
				retailPrice: 0,
				stock: 1,
				groupPrice: 0,
				isExistingProduct: false,
			});
		},
		deleteProduct(index) {
			this.$confirm('确定删除该产品', '确定删除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				this.products = this.products.filter((item, i) => index !== i);
			});
		},
		async querySearchAsync(queryString, cb) {
			const res = await this.$fetch({
				url: '/mgmt/product/item/getProductInfoList',
				params: { likeSerialNo: queryString },
			});
			if (res && res.data) {
				cb(res.data);
			}
		},
		handleSelect(item) {
			this.products = this.products.map(i => {
				if (item.serialNo === i.productCode) {
					return {
						...i,
						productName: item.title,
						packing: item.packing,
						meterUnit: item.meterUnit,
						retailPrice: item.retailPrice,
						groupPrice: item.groupPrice,
					};
				} else {
					return i;
				}
			});
		},
		async successdialogEnter(type) {
			if (type == 'lookInfo') {
				await this.getDicts();
				await this.getGroupBuyOrderDetails();
				this.successDialog = false;
				return;
			}
			this.$closeSelf();
			this.$go('group_buy_order');
		},
	},
	computed: {
		invoiceText() {
			if (this.invoice) {
				return '编辑发票信息';
			} else {
				return '添加发票信息';
			}
		},
		productsAmount() {
			return this.products.reduce((pre, item) => {
				return pre + item.stock;
			}, 0);
		},
		totalAmount() {
			return this.products.reduce((pre, item) => {
				return pre + item.stock * item.groupPrice;
			}, 0);
		},
	},
	watch: {
		'editGroupBuyOrderForm.receiveInfo.receiveType'() {
			if (this.editGroupBuyOrderForm.receiveInfo.receiveType === 1) {
				this.editGroupBuyOrderForm.receiveInfo = {
					...this.editGroupBuyOrderForm.receiveInfo,
					...this.initUnitInfo,
				};
			} else {
				this.editGroupBuyOrderForm.receiveInfo = {
					...this.editGroupBuyOrderForm.receiveInfo,
					...this.initStoreCodeInfo,
				};
			}
		},
	},
	async mounted() {
		await this.getDicts();
		await this.getGroupBuyOrderDetails();
	},
	filters: {
		addPrefixForAmount,
		summaryCalc(val) {
			return Number(val).toFixed(2);
		},
	},
	components: {
		ticketModal,
	},
};
</script>

<style lang="scss" scoped>
.edit_group_order {
	.title {
		font-size: 20px;
		font-weight: 600;
		margin-bottom: 22px;
	}
	.my-cascader {
		width: 100%;
	}
	.card {
		margin-bottom: 22px;
		.products + p {
			text-align: right;
			margin-top: 22px;
			span {
				margin-right: 20px;
			}
		}
	}
	.upload-contract {
		position: relative;
		display: flex;
		> .el-button {
			height: 40px;
			position: absolute;
			left: 100px;
		}
	}
}
// 弹出窗css
.dialogContent {
	position: absolute;
	left: 50%;
	transform: translate(-50%, -50%);
	top: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	.icon {
		font-size: 120px;
		color: #52c41a;
	}
	.title {
		margin-bottom: 20px;
		color: #909399;
	}
	.bigTitle {
		font-size: 22px;
		font-weight: 800;
		color: #272727;
		margin-top: 10px;
	}
}
</style>
