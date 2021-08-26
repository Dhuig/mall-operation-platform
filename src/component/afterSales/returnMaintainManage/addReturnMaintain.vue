<template>
	<div class="add-return-maintain">
		<guideBar></guideBar>
		<el-form
			:model="formConfig"
			label-suffix=":"
			ref="addForm"
			size="small"
			label-width="130px"
			:rules="ADD_RETURN_MAINTAIN_RULES"
		>
			<el-card>
				<h2 class="title">第一步：填写顾客信息</h2>
				<el-row>
					<el-col :span="7">
						<el-form-item label="服务中心编码" prop="storeCode">
							<el-input v-model="formConfig.storeCode" @change="decideStoreCode"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="7">
						<el-form-item label="顾客卡号" prop="cardNo">
							<el-input v-model="formConfig.cardNo" @blur="handleCardNoDetail"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="顾客姓名" prop="realname">
							<el-input v-model="formConfig.realname"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="联系电话" prop="contact">
							<el-input v-model="formConfig.contact" maxlength="11"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="7">
						<el-form-item label="所在地区" prop="area">
							<el-cascader ref="isArea" v-model="formConfig.area" style="width: 100%" :props="lazyProps"></el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="详细地址" prop="custAddress">
							<el-input v-model="formConfig.custAddress"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-card>
			<el-card>
				<h2 class="title">第二步：填写产品信息</h2>
				<el-row>
					<el-col :span="7">
						<el-form-item label="产品编码" prop="productCode">
							<!-- <el-input v-model="formConfig.productCode"></el-input> -->
							<el-select v-model="formConfig.productCode" filterable @change="productChange" placeholder="请选择产品">
								<el-option
									v-for="{ serialNo } in productList"
									:key="serialNo"
									:label="serialNo"
									:value="serialNo"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="产品名称" prop="productName">
							<el-input v-model="formConfig.productName" disabled></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="7">
						<el-form-item label="购买日期" prop="buyDate">
							<el-date-picker
								v-model="formConfig.buyDate"
								type="date"
								placeholder="选择日期"
								style="width: 100%"
							></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="故障日期" prop="failureDate">
							<el-date-picker
								v-model="formConfig.failureDate"
								type="date"
								placeholder="选择日期"
								style="width: 100%"
							></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="保质期" prop="shelfLife">
							<el-input v-model="shelfLife" disabled></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="7">
						<el-form-item label="订单号" prop="orderNo">
							<el-input v-model="formConfig.orderNo"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="生产批号" prop="batchNumber">
							<el-input v-model="formConfig.batchNumber"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="生产日期" prop="produceDate">
							<el-date-picker
								v-model="formConfig.produceDate"
								type="date"
								placeholder="选择日期"
								style="width: 100%"
							></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="7">
						<el-form-item label="使用日期" prop="useDate">
							<el-date-picker
								v-model="formConfig.useDate"
								type="date"
								placeholder="选择日期"
								style="width: 100%"
							></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="序列号/二维码" prop="serialNo">
							<el-input v-model="formConfig.serialNo"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-card>
			<el-card>
				<h2 class="title">第三步：填写故障信息</h2>
				<el-row>
					<el-col :span="7">
						<el-form-item label="申请数量" prop="quantity">
							<el-input type="number" v-model="formConfig.quantity"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="故障原因" prop="failureReason">
							<el-select v-model="formConfig.failureReason" placeholder="请选择" style="width: 100%">
								<el-option
									v-for="{ faultReason, id } in errorReason"
									:key="id"
									:label="faultReason"
									:value="id"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="整/部件损坏情况" prop="scope">
							<el-select v-model="formConfig.scope" placeholder="请选择" style="width: 100%">
								<el-option key="zhengjian" label="整件" value="1"></el-option>
								<el-option key="bujian" label="部件" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="故障描述" prop="reasonDetail">
							<el-input type="textarea" v-model="formConfig.reasonDetail" rows="7"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="销售小票">
							<el-upload
								:action="$store.getters['system/getOssUploadUrl']"
								:headers="$store.getters['system/getSignatureVerification']"
								:data="uploadData"
								:limit="2"
								list-type="picture-card"
								:on-success="handleSuccessUpload"
								:before-upload="beforeAvatarUpload"
							>
								<i class="el-icon-plus"></i>
							</el-upload>
							<el-dialog :visible.sync="previewDialogVisible" v-drag>
								<!-- <img width="100%" :src="dialogImageUrlApp" alt /> -->
							</el-dialog>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<ul class="explain">
						<li>说明:</li>
						<li>
							1、如有小票，请上传小票附件，最多只能支持上传2张，支持格式：bmp、jpg、png、tif ，单个文件不能超过10MB
						</li>
						<li>2、若故障原因有两个或以上，请选择“其它”，并在故障详细描述中填写具体的故障信息；</li>
						<li>
							3、请确认您所提交的信息是否准确，若由于服务中心提交的信息有误等原因，导致维修人员空跑，需收取空跑费100元/次，感谢您的配合！
						</li>
					</ul>
				</el-row>
			</el-card>
		</el-form>
		<actionBar>
			<template>
				<el-button type="primary" @click="handleAddConfirm">确认提交</el-button>
				<el-button @click="this.$closeSelf">取消</el-button>
			</template>
		</actionBar>
	</div>
</template>

<script>
import { ADD_RETURN_MAINTAIN_RULES } from './config';
import { formatDateStr, uploadFileType } from '@/util/formValidation';

// import { getStringFromAddressCode } from '@/util/index';
import city from 'config/city';
export default {
	name: 'addReturnMaintain',
	data() {
		return {
			ADD_RETURN_MAINTAIN_RULES,
			formConfig: {
				storeCode: '',
				cardNo: '',
				realname: '',
				contact: '',
				custAddress: '',
				productCode: '',
				productName: '',
				buyDate: '',
				failureDate: '',
				orderNo: '',
				batchNumber: '',
				produceDate: '',
				useDate: '',
				serialNo: '',
				quantity: '',
				failureReason: '',
				scope: '',
				reasonDetail: '',
				attachmentList: [],
				area: [],
			},
			allArea: [],
			productList: [],
			errorReason: [],
			previewDialogVisible: false,
			lazyProps: {
				// expandTrigger: 'hover', // hover模式
				lazy: true, //  是否开启懒加载
				lazyLoad: this.lazyLoad, // 加载函数
			},
		};
	},
	methods: {
		beforeAvatarUpload(file) {
			const whiteList = ['jpg', 'png', 'tif', 'bmp'];
			return uploadFileType.bind(this, file, whiteList, 10)();
		},
		// 图片上传成功
		handleSuccessUpload(res) {
			const { fileUrlKey } = res.datas;
			this.formConfig.attachmentList = [fileUrlKey];
		},
		// 产品选择
		productChange(value) {
			let nowProduct = this.productList.find(item => {
				return item.serialNo === value;
			});
			this.formConfig.productName = nowProduct.title;
		},
		// 根据产品编码获取产品名称
		async getProductName() {
			const res = await this.$fetch(`/mgmt/order/factory/getProductList?keyword=`);
			if (res && res.data) {
				if (res.data.length) {
					this.productList = res.data;
				}
			}
		},
		// 判断服务中心是否存在
		async decideStoreCode() {
			const { storeCode } = this.formConfig;
			const res = await this.$fetch(`/mgmt/order/factory/decideStoreCode?storeCode=${storeCode}`);
			const { data } = res;
			// console.log(data)
			if (res.code !== 200) {
				this.$message.error(data.message);
			}
		},
		// 获取故障原因
		async getErrorReason() {
			const res = await this.$fetch('/mgmt/order/factory/getFaultReason');
			if (res && res.code === 200) {
				const { data } = res;
				this.errorReason = data;
			}
		},
		// 点击确认提交
		handleAddConfirm() {
			this.$refs['addForm'].validate(valid => {
				if (valid) {
					let areaText = this.rewritePlace(
						[this.formConfig.area[0], this.formConfig.area[1], this.formConfig.area[2]],
						city
					);
					let nowAddres = {
						districtCode: this.formConfig.area[2],
						address: this.formConfig.custAddress,
						city: areaText[1],
						provinceCode: this.formConfig.area[0],
						cityCode: this.formConfig.area[1],
						province: areaText[0],
						district: areaText[2],
					};
					const addData = {
						...this.formConfig,
						shelfLife: this.shelfLife === '保质期内' ? 1 : 2,
						custAddress: JSON.stringify(nowAddres),
						buyDate: formatDateStr(this.formConfig.buyDate, 'day'),
						failureDate: formatDateStr(this.formConfig.failureDate, 'day'),
						produceDate: this.formConfig.produceDate ? formatDateStr(this.formConfig.produceDate, 'day') : '',
						failReasonId: 123123123123,
						systemCode: 1,
					};
					delete addData.area;
					this.handleAdd(addData);
				}
			});
		},
		// 新增接口
		async handleAdd(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/order/factory/addFactoryOrder',
				data,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
					onClose: () => {
						this.$dispatch('RETURN_MAINTAIN_LIST');
						this.$closeSelf();
					},
				});
			} else {
				res && this.$message.error(res.message);
			}
		},
		// 根据顾客卡号获取顾客信息
		async handleCardNoDetail() {
			const res = await this.$fetch(`/mgmt/order/factory/getMemberInfo?customerCard=${this.formConfig.cardNo}`);
			if (res && res.code === 200) {
				const { province, city, district, provinceCode, districtCode, cityCode, address, customer, phoneNum } =
					res.data;
				this.formConfig = {
					...this.formConfig,
					realname: customer,
					contact: phoneNum,
					custAddress: address,
					area: [provinceCode, cityCode, districtCode],
				};
				this.$nextTick(() => {
					this.$refs['isArea'].inputValue = `${province}/${city}/${district}`;
				});
			} else {
				res && this.$message.error(res.message);
			}
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
		uploadData() {
			return {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.order,
			};
		},
		shelfLife() {
			let overData;
			if (this.formConfig.failureDate && Date.parse(this.formConfig.buyDate)) {
				overData = (Date.parse(this.formConfig.failureDate) - Date.parse(this.formConfig.buyDate)) / 1000 / 3600 / 24;
			}
			return overData ? (overData > 365 ? '保质期外' : '保质期内') : '';
		},
	},
	created() {
		this.getErrorReason();
		// 产品列表
		this.getProductName();
	},
};
</script>

<style lang="scss" scoped>
.add-return-maintain {
	.title {
		padding-bottom: 20px;
	}
	.explain {
		padding-left: 130px;
		li {
			margin-top: 8px;
		}
	}
}
</style>
