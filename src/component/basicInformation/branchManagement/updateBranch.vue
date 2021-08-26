<template>
	<div class="update-branch">
		<guideBar />
		<!-- 基础信息 -->
		<el-card class="box-card">
			<div class="title">基础信息</div>
			<el-form :inline="true" ref="companyFormRef" :rules="companyRules" label-width="128px" :model="company">
				<el-form-item label="公司名称:" prop="name">
					<el-input placeholder="请输入公司名称" class="style-width" v-model="company.name" size="medium" />
				</el-form-item>
				<el-form-item label="公司类型:" prop="type">
					<el-select placeholder="请选择公司类型" class="style-width" v-model="company.type" size="medium">
						<el-option label="总公司" value="1" />
						<el-option label="分公司" value="2" />
						<el-option label="上海商业" value="3" />
						<el-option label="扬州公司" value="4" />
						<el-option label="吉林公司" value="5" />
						<el-option label="广东公司" value="6" />
					</el-select>
				</el-form-item>
				<el-form-item label="公司编号:" prop="code">
					<el-input
						placeholder="请输入公司编号"
						class="style-width"
						v-model="company.code"
						size="medium"
						:disabled="!isAddData"
					/>
				</el-form-item>
				<el-form-item label="公司全称:" prop="fullName">
					<el-input placeholder="请输入公司全称" class="style-width" v-model="company.fullName" size="medium" />
				</el-form-item>
				<el-form-item label="开设日期:" prop="openTime">
					<el-date-picker
						value-format="yyyy-MM-dd"
						placeholder="请选择开设日期"
						v-model="company.openTime"
						size="medium"
						type="date"
					/>
				</el-form-item>
				<el-form-item label="公司等级:" prop="grade" v-if="company.type === '2'">
					<el-select placeholder="请选择公司等级" v-model="company.grade" size="medium">
						<el-option label="1" value="1" />
						<el-option label="2" value="2" />
						<el-option label="3" value="3" />
					</el-select>
				</el-form-item>
				<el-form-item label="负责人:" prop="principal">
					<el-input placeholder="请输入负责人" class="style-width" v-model="company.principal" size="medium" />
				</el-form-item>
				<el-form-item label="负责人手机号:" prop="principalPhone">
					<el-input
						placeholder="请输入负责人手机号"
						class="style-width"
						v-model="company.principalPhone"
						size="medium"
					/>
				</el-form-item>
				<el-form-item label="传真:" prop="faxPhone">
					<el-input placeholder="请输入传真" class="style-width" v-model="company.faxPhone" size="medium" />
				</el-form-item>
				<el-form-item label="固定电话1:" prop="fixedPhoneOne">
					<el-input placeholder="请输入固定电话1" class="style-width" v-model="company.fixedPhoneOne" size="medium" />
				</el-form-item>
				<el-form-item label="固定电话2:" prop="fixedPhoneTwo">
					<el-input placeholder="请输入固定电话2" class="style-width" v-model="company.fixedPhoneTwo" size="medium" />
				</el-form-item>
				<el-form-item label="地区:" prop="geographyCode">
					<el-select placeholder="请选择地区" class="style-width" v-model="company.geographyCode" size="medium">
						<el-option v-for="{ value, label } in regionOptions" :key="label" :label="label" :value="value" />
					</el-select>
				</el-form-item>
				<el-form-item label="电子邮箱1:" prop="emailOne">
					<el-input placeholder="请输入电子邮箱1" class="style-width" v-model="company.emailOne" size="medium" />
				</el-form-item>
				<el-form-item label="电子邮箱2:" prop="emailTwo">
					<el-input placeholder="请输入电子邮箱2" class="style-width" v-model="company.emailTwo" size="medium" />
				</el-form-item>
				<!-- 店所在地址 -->
				<el-form-item label="店所在地址:" prop="shop" class="w-hundred">
					<addressSelect
						style="width: 700px; display: inline-block"
						@chooseAddress="e => changeConsigneeRegion(e, 'shopValue')"
						:defalutData="shopValue"
						:needValid="false"
						:isStyle="true"
					></addressSelect>
				</el-form-item>
				<!-- 详情地址 -->
				<el-form-item label="店所在地详细地址:" prop="shopPostcode ">
					<el-input placeholder="请输入详细地址" class="w-f-hundred" v-model="company.shopAddress" size="medium" />
				</el-form-item>
				<el-form-item label="店所在地邮编:" prop="shopPostcode " class="w-hundred">
					<el-input placeholder="请输入邮编" class="style-width" v-model="company.shopPostcode" size="medium" />
				</el-form-item>
				<!-- 联系地址 -->
				<el-form-item label="联系地址:" prop="contact" class="w-hundred">
					<addressSelect
						style="width: 700px; display: inline-block"
						@chooseAddress="e => changeConsigneeRegion(e, 'contactValue')"
						:defalutData="contactValue"
						:needValid="false"
						:isStyle="true"
					></addressSelect>
				</el-form-item>
				<el-form-item label="联系详细地址:" prop="contactAddress" class="w-hundred">
					<!-- 详情地址 -->
					<el-input placeholder="请输入详细地址" class="w-f-hundred" v-model="company.contactAddress" size="medium" />
				</el-form-item>
				<el-form-item label="联系地址邮编:" prop="contactPostcode">
					<el-input placeholder="请输入邮编" v-model="company.contactPostcode" size="medium" />
				</el-form-item>
				<!-- 发货地址 -->
				<el-form-item label="发货地址:" prop="delivery" class="w-hundred">
					<addressSelect
						style="width: 700px; display: inline-block"
						@chooseAddress="e => changeConsigneeRegion(e, 'deliveryValue')"
						:defalutData="deliveryValue"
						:needValid="false"
						:isStyle="true"
					></addressSelect>
				</el-form-item>
				<el-form-item label="发货详细地址:" prop="deliveryAddress" class="w-hundred">
					<!-- 详情地址 -->
					<el-input placeholder="请输入详细地址" class="w-f-hundred" v-model="company.deliveryAddress" size="medium" />
				</el-form-item>
				<el-form-item label="发货地址邮编:" prop="deliveryPostcode ">
					<el-input placeholder="请输入邮编" v-model="company.deliveryPostcode" size="medium" />
				</el-form-item>
				<el-form-item label="退回信息:" prop="returnInfo" class="back_item w-hundred">
					<el-input placeholder="请输入退回信息" class="w-f-hundred" v-model="company.returnInfo" size="medium" />
				</el-form-item>
			</el-form>
		</el-card>
		<!-- 账户信息 -->
		<el-card class="box-card">
			<div class="title">
				<span>账户信息</span>
				<el-button type="primary" class="fr" @click="addAccount">添加账户</el-button>
			</div>
			<tableList border :dataSource="comAccounts" :columns="BRANCH_DETAIL_COLUMNS" slotcontent>
				<template slot-scope="row">
					<el-button type="text" size="small" @click="handleDditUser(row.data, row.index)">编辑</el-button>
					<el-button type="text" size="small" @click="handleDeleteUser(row.index)">删除</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 添加账户弹窗 -->
		<el-dialog :title="isAddUser ? '添加账户' : '编辑账户'" :visible.sync="show" v-drag>
			<el-form :model="addUser" :rules="addUserRules" ref="addUserRef" label-width="140px">
				<el-form-item label="账户编号:" prop="accountCode">
					<el-input class="w-t-hundred" v-model="addUser.accountCode" size="medium"></el-input>
				</el-form-item>
				<el-form-item label="账户名称:" prop="accountName">
					<el-input class="w-t-hundred" v-model="addUser.accountName" size="medium"></el-input>
				</el-form-item>
				<el-form-item label="账号:" prop="account">
					<el-input class="w-t-hundred" v-model="addUser.account" size="medium"></el-input>
				</el-form-item>
				<el-form-item label="开户银行:" prop="bankType">
					<el-select v-model="addUser.bankType" size="medium">
						<el-option v-for="item in bankTypeOptions" :key="item.value" :label="item.label" :value="item.label" />
					</el-select>
				</el-form-item>
				<el-form-item label="银行省份:" prop="bankProvince">
					<el-select v-model="addUser.bankProvince" size="medium" @change="changePr">
						<el-option v-for="item in bankProvinceList" :key="item.value" :label="item.n" :value="item.n" />
					</el-select>
				</el-form-item>
				<el-form-item label="银行城市:" prop="bankCity">
					<el-select v-model="addUser.bankCity" size="medium">
						<el-option v-for="item in bankCityList" :key="item.value" :label="item.n" :value="item.n" />
					</el-select>
				</el-form-item>
				<el-form-item label="开户行名称:" prop="bankName">
					<el-input class="w-t-hundred" v-model="addUser.bankName" size="medium"></el-input>
				</el-form-item>
				<el-form-item label="账号用途:" prop="accountUse">
					<el-select v-model="addUser.accountUse" size="medium">
						<el-option v-for="item in accountUseOptions" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="saveAddUser('addUserRef')" class="save">提交</el-button>
				<el-button @click="cacelAddUser('addUserRef')" class="cacel">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 发票信息 -->
		<el-card class="box-card">
			<div class="title">发票信息</div>
			<el-form :inline="true" ref="comInvoiceFormRef" label-width="130px" :model="comInvoice">
				<!-- <el-form-item label="公司名称:" prop="companyId">
							<el-input placeholder="请输入公司名称" v-model="comInvoice.companyId" size="medium" />
						</el-form-item> -->
				<el-form-item label="公司税号:" prop="taxNo">
					<el-input placeholder="请输入公司税号" v-model="comInvoice.taxNo" size="medium" />
				</el-form-item>
				<el-form-item label="电话:" prop="companyPhone">
					<el-input placeholder="请输入电话" v-model="comInvoice.companyPhone" size="medium" />
				</el-form-item>
				<el-form-item label="注册地址:" prop="companyAddress">
					<el-input
						placeholder="请输入注册地址"
						v-model="comInvoice.companyAddress"
						size="medium"
						class="invoice-address"
						maxlength="200"
					/>
				</el-form-item>
				<el-form-item label="开户银行:" prop="companyBank">
					<el-select placeholder="请选择开户银行" v-model="comInvoice.companyBank" size="medium" style="width: 196px">
						<el-option v-for="item in bankTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="支行名称:" prop="bankName">
					<el-input placeholder="请输入支行名称" v-model="comInvoice.bankName" size="medium" />
				</el-form-item>
				<el-form-item label="账号:" prop="companyAccount">
					<el-input placeholder="请输入账号" v-model="comInvoice.companyAccount" size="medium" />
				</el-form-item>
				<el-form-item label="发票地址URL:" prop="addressUrl">
					<el-input
						placeholder="请输入发票地址URL"
						v-model="comInvoice.addressUrl"
						size="medium"
						class="invoice-address"
					/>
				</el-form-item>
				<el-form-item label="不含税金额上限:" prop="excludingTaxMaximumAmount">
					<el-input placeholder="请输入不含税金额上限" v-model="comInvoice.excludingTaxMaximumAmount" size="medium" />
				</el-form-item>
				<el-form-item label="开票员:" prop="drawer">
					<el-input placeholder="请输入开票员" v-model="comInvoice.drawer" size="medium" />
				</el-form-item>
				<el-form-item label="收款员:" prop="cashier">
					<el-input placeholder="请输入收款员" v-model="comInvoice.cashier" size="medium" />
				</el-form-item>
				<el-form-item label="复核员:" prop="checker">
					<el-input placeholder="请输入复核员" v-model="comInvoice.checker" size="medium" />
				</el-form-item>
				<!-- 发票邮寄地址 -->
				<el-form-item label="发票邮寄地址:" prop="post" class="w-hundred">
					<addressSelect
						style="width: 700px"
						@chooseAddress="e => changeConsigneeRegion(e, 'postValue')"
						:defalutData="postValue"
						:needValid="false"
						:isStyle="true"
					></addressSelect>
				</el-form-item>
				<el-form-item label="发票邮寄详细地址" prop="postAddress" class="w-hundred">
					<!-- 详情地址 -->
					<el-input placeholder="请输入详细地址" style="width: 764px" v-model="comInvoice.postAddress" size="medium" />
				</el-form-item>
				<el-form-item label="邮编:" prop="postPostcode">
					<el-input placeholder="请输入邮编" v-model="comInvoice.postPostcode" size="medium" />
				</el-form-item>
				<el-form-item label="收票人/电话:" prop="drawee">
					<el-input placeholder="请输入收票人/电话" v-model="comInvoice.drawee" size="medium" />
				</el-form-item>
			</el-form>
		</el-card>
			<actionBar>
				<template>
					<el-button type="primary" @click="handleSave">保存</el-button>
					<el-button type="primary" @click="handleCancel">返回</el-button>
				</template>
			</actionBar>
	</div>
</template>
<script>
import { optionGenerator } from 'util';
import { BRANCH_DETAIL_COLUMNS, ACCOUNT_USE, BANK_TYPE, REGION_STATUS } from './config';
import city from 'config/city';
import qs from 'querystring';
import { formatDateDefault } from 'util/formValidation';

export default {
	name: 'updateBranch',
	data() {
		var validatePass = (rule, value, callback) => {
			if (value.trim() === '') {
				callback(new Error('请输入公司名称'));
			} else {
				callback();
			}
		};
		return {
			BRANCH_DETAIL_COLUMNS,
			isAddData: true, // 新增/编辑页面
			isAddUser: true, // 新增/编辑账户
			show: false, // 控制添加账户弹窗显示隐藏
			id: '', // 列表数据的id
			addUser: {
				// 添加账户弹窗数据
				accountCode: '',
				accountName: '',
				account: '',
				bankType: '',
				bankProvince: '',
				bankCity: '',
				bankName: '',
				accountUse: '',
			},
			pacas: city, // json数据源
			bankProvinceList: [], // 存放银行省份数据集合
			bankCityList: [], // 存放银行城市数据集合
			shopValue: [], // 店地址-绑定值
			contactValue: [], // 联系地址-绑定值
			deliveryValue: [], // 发货地址-绑定值
			postValue: [], // 发票邮寄地址-绑定值
			company: {
				// 基础信息
				name: '',
				type: '',
				code: '',
				fullName: '',
				openTime: '',
				grade: '',
				geographyCode: '',
				principal: '',
				principalPhone: '',
				faxPhone: '',
				fixedPhoneOne: '',
				fixedPhoneTwo: '',
				emailOne: '',
				emailTwo: '',
				shopAddress: '',
				shopPostcode: '',
				contactAddress: '',
				contactPostcode: '',
				deliveryAddress: '',
				deliveryPostcode: '',
				returnInfo: '',
			},
			comAccounts: [], // 账户信息
			comAccountsMemory: [], // 账户信息
			comAccountsFail: [], // 账户信息
			comInvoice: {
				// 发票信息
				// companyId: '',
				taxNo: '',
				companyPhone: '',
				companyAddress: '',
				companyBank: '',
				bankName: '',
				companyAccount: '',
				addressUrl: '',
				excludingTaxMaximumAmount: '',
				drawer: '',
				cashier: '',
				checker: '',
				postAddress: '',
				postPostcode: '',
				drawee: '',
			},
			comRegion: {
				// 业务区域范围
				companyId: '',
				regionCodes: [],
			},
			areaList: [],
			lazyProps: {
				expandTrigger: 'hover', // hover模式
				lazy: true, //  是否开启懒加载
				lazyLoad: this.lazyLoad, // 加载函数
			},
			companyRules: {
				// 基础信息验证规则
				name: [
					{ required: true, validator: validatePass, trigger: 'blur' },
					{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
				],
				type: [{ required: true, message: '请选择公司类型', trigger: 'change' }],
				code: [
					{ required: true, message: '请输入公司编号', trigger: 'blur' },
					{ min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
				],
				fullName: [
					{ required: true, message: '请输入公司全称', trigger: 'blur' },
					{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
				],
				openTime: [{ required: true, message: '请选择开设日期', trigger: 'change' }],
				grade: [{ required: true, message: '请选择公司等级', trigger: 'change' }],
				principal: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
				geographyCode: [{ required: true, message: '请选择地区', trigger: 'change' }],
			},
			addUserRules: {
				// 添加账户验证
				accountCode: [{ required: true, message: '请输入账户编号', trigger: 'blur' }],
				accountName: [
					{ required: true, message: '请输入账户名称', trigger: 'blur' },
					{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
				],
				account: [
					{ required: true, message: '请输入账号', trigger: 'blur' },
					{ pattern: /^[0-9]*$/, message: '请输入数字类型', trigger: 'blur' },
				],
				bankType: [{ required: true, message: '请选择开户银行', trigger: 'change' }],
				bankProvince: [{ required: true, message: '请选择银行省份', trigger: 'change' }],
				bankCity: [{ required: true, message: '请选择银行城市', trigger: 'change' }],
				bankName: [
					{ required: true, message: '请输入开户行名称', trigger: 'blur' },
					{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
				],
				accountUse: [{ required: true, message: '请选择账号用途', trigger: 'change' }],
			},
			companyInfo: {}, // 储存基础信息板块数据
			comAccountsInfo: [], // 储存账户信息板块数据
			comInvoiceInfo: {}, // 储存发票信息板块数据
			comRegionInfo: {}, // 储存业务区域范围板块数据
			shopPalce: '请选择', // 店所在地址label
			contactPalce: '请选择', // 联系地址label
			deliveryPalce: '请选择', // 发货地址label
			postPalce: '请选择', // 发票邮寄地址label
			companyId: '', // 存储详情接口基础信息里面的id
			regionCodes: [], // 请求需要的城市code数组
			areaSelectProp: {}, // 传给子组件的参数
		};
	},
	computed: {
		// 获取账户用途
		accountUseOptions() {
			return optionGenerator(ACCOUNT_USE);
		},
		// 开户银行下拉
		bankTypeOptions() {
			return Object.entries(BANK_TYPE).map(([value, label]) => ({ value: value, label }));
		},
		// 地区下拉
		regionOptions() {
			return optionGenerator(REGION_STATUS, 'string');
		},
	},
	methods: {
		// 下拉框
		changeConsigneeRegion(data, type) {
			this[type] = data.map(x => x.value);
			// if (type) {
			// 	this.editGroupBuyOrderForm.receiveInfo.consigneeRegion = data.map(x => x.value);
			// 	return;
			// }
			// this.editGroupBuyOrderForm.groupBuyInstitutionInfo.institutionRegion = data.map(x => x.value);
		},
		// 保存
		handleSave() {
			const copyCompany = Object.assign({}, this.company);
			const openTime = copyCompany.openTime;
			// 店地址
			const shopProvinceCode = this.shopValue[0] || '';
			const shopCityCode = this.shopValue[1] || '';
			const shopDistrictCode = this.shopValue[2] || '';
			const shopStreetCode = this.shopValue[3] || '';
			// 联系地址
			const contactProvinceCode = this.contactValue[0] || '';
			const contactCityCode = this.contactValue[1] || '';
			const contactDistrictCode = this.contactValue[2] || '';
			const contactStreetCode = this.contactValue[3] || '';
			// 发货地址
			const deliveryProvinceCode = this.deliveryValue[0] || '';
			const deliveryCityCode = this.deliveryValue[1] || '';
			const deliveryDistrictCode = this.deliveryValue[2] || '';
			const deliveryStreetCode = this.deliveryValue[3] || '';
			// 发票地址
			const postProvinceCode = this.postValue[0] || '';
			const postCityCode = this.postValue[1] || '';
			const postDistrictCode = this.postValue[2] || '';
			const postStreetCode = this.postValue[3] || '';
			const company = {
				...this.company,
				openTime: openTime || '',
				shopProvinceCode,
				shopCityCode,
				shopDistrictCode,
				shopStreetCode,
				contactProvinceCode,
				contactCityCode,
				contactDistrictCode,
				contactStreetCode,
				deliveryProvinceCode,
				deliveryCityCode,
				deliveryDistrictCode,
				deliveryStreetCode,
			};
			'shopProvinceName' in company && delete company.shopProvinceName;
			'shopCityName' in company && delete company.shopCityName;
			'shopDistrictName' in company && delete company.shopDistrictName;
			'shopStreetName' in company && delete company.shopStreetName;
			'contactProvinceName' in company && delete company.contactProvinceName;
			'contactCityName' in company && delete company.contactCityName;
			'contactDistrictName' in company && delete company.contactDistrictName;
			'contactStreetName' in company && delete company.contactStreetName;
			'deliveryProvinceName' in company && delete company.deliveryProvinceName;
			'deliveryCityName' in company && delete company.deliveryCityName;
			'deliveryDistrictName' in company && delete company.deliveryDistrictName;
			'deliveryStreetName' in company && delete company.deliveryStreetName;
			const comInvoice = {
				...this.comInvoice,
				postProvinceCode,
				postCityCode,
				postDistrictCode,
				postStreetCode,
			};
			'postProvinceName' in comInvoice && delete comInvoice.postProvinceName;
			'postCityName' in comInvoice && delete comInvoice.postCityName;
			'postDistrictName' in comInvoice && delete comInvoice.postDistrictName;
			'postStreetName' in comInvoice && delete comInvoice.postStreetName;
			// 业务区域参数
			const comRegion = {
				companyId: this.companyId,
				regionCodes: this.regionCodes,
			};
			this.comAccounts.forEach(e => {
				if (!e.id) this.comAccountsMemory.push(e);
			});
			this.comAccounts.forEach(e => {
				this.comAccountsMemory = this.comAccountsMemory.map(el => {
					if (e.id === el.id) el = e;
					return el;
				});
			});
			this.$refs.companyFormRef.validate(async valid => {
				if (valid) {
					const params = { company, comAccounts: this.comAccountsMemory, comInvoice, comRegion };
					if (this.isAddData) {
						await this.addComInfo(params);
					} else {
						await this.updateComInfo(params);
					}
				}
			});

			// this.$closeSelf();
		},
		// 取消
		handleCancel() {
			this.$closeSelf();
		},
		// 添加账户信息
		addAccount() {
			this.show = true;
			this.isAddUser = true;
		},
		// 选择银行省份下拉触发
		changePr() {
			for (let key of this.pacas) {
				if (key.n === this.addUser.bankProvince) {
					this.bankCityList = key.r;
					let bankProvince = this.bankCityList.filter(e => e.n == this.addUser.bankCity)[0].n;
					this.addUser.bankCity = this.isAddUser ? key.r[0].n : bankProvince; //默认选择第一个显示
				}
			}
		},
		// 添加账户-确定
		saveAddUser(formName) {
			if (this.isAddUser) {
				// 新增
				this.$refs[formName].validate(valid => {
					if (valid) {
						const params = Object.assign({}, this.addUser);
						params.isDel = 0;
						this.comAccounts.push(params);
						this.$refs[formName].resetFields();
						this.show = false;
					}
				});
			} else {
				// 编辑  (特别注意：一定要等待编辑接口成功调用之后，再触发dispatch更新数据，关闭页签方法，新增逻辑一样)
				this.$refs[formName].validate(valid => {
					if (valid) {
						const params = Object.assign({}, this.addUser);
						const { index } = params;
						this.comAccounts.splice(index, 1, params);
						this.$refs[formName].resetFields();
						this.show = false;
					}
				});
			}
		},
		// 添加账户-取消
		cacelAddUser(formName) {
			this.$refs[formName].resetFields();
			this.show = false;
		},
		// 编辑账户信息
		handleDditUser(row, index) {
			this.show = true;
			this.isAddUser = false;
			this.addUser = {
				...this.addUser,
				...row,
				index,
			};
			this.changePr();
		},
		// 删除账户
		handleDeleteUser(index) {
			this.comAccounts.splice(index, 1);
			if (this.comAccountsMemory.length == 0) return;
			this.comAccountsMemory.forEach((e, i) => {
				if (index == i) e.isDel = 1;
			});
		},
		// 选择区域
		// addArea() {
		// 	const { id, isAddData } = this;
		// 	let codes = this.areaList.map((item) => item.provinceCode);
		// 	let proviceArr = JSON.stringify(this.areaList);
		// 	const codeArr = JSON.stringify(codes);
		// 	this.$go('business_area', {
		// 		id,
		// 		isAddData,
		// 		codeArr,
		// 		proviceArr,
		// 	});
		// },
		// 懒加载
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
						leaf: false,
					};
				});
				resolve(nodes);
			} else if (level == 3) {
				const id = node.data.value;
				let data = [];
				city.forEach(i => {
					i.r &&
						i.r.length > 0 &&
						i.r.forEach(j => {
							j.r &&
								j.r.length > 0 &&
								j.r.forEach(k => {
									if (k.c === id) {
										data = k.r;
									}
								});
						});
				});

				if (data && data.length > 0) {
					let nodes = data.map(item => {
						return {
							value: item.c,
							label: item.n,
							leaf: true,
						};
					});
					resolve(nodes);
				} else {
					node.data.leaf = true;
					resolve(node);
				}
			} else {
				resolve(node);
			}
		},
		// 新增分公司接口
		async addComInfo(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/sys/addComInfo',
				data: params,
			});
			if (res && res.code === 200) {
				this.$dispatch('UP_LIST');
				// 关闭编辑/新增页面
				this.$closeSelf();
				this.$message.success(res.message);
			} else {
				this.comAccountsMemory = [];
			}
		},
		// 修改分公司接口
		async updateComInfo(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/sys/updateComInfo',
				data: params,
			});
			if (res && res.code === 200) {
				this.$dispatch('UP_LIST');
				// 关闭编辑/新增页面
				this.$closeSelf();
				this.$message.success(res.message);
			} else {
				this.comAccountsMemory = this.comAccountsFail;
			}
		},
		// 获取详情数据接口
		async getDetailInfo(params) {
			const res = await this.$fetch(`/mgmt/sys/getComInfo?${qs.stringify(params)}`);
			if (!res) return;
			const { company, comAccounts, comInvoice, comRegionInfo = {} } = res.data;

			// 储存接口数据
			this.companyInfo = company || {};
			this.comAccountsInfo = comAccounts || [];
			this.comInvoiceInfo = comInvoice || {};
			this.comRegionInfo = comRegionInfo || {};
			// 表单数据回显
			this.company = {
				...this.company,
				...company,
				openTime: formatDateDefault(company.openTime),
				type: String(company.type),
				geographyCode: String(company.geographyCode),
			};
			this.comAccounts = comAccounts;
			this.comAccountsMemory = JSON.parse(JSON.stringify(comAccounts));
			this.comAccountsFail = JSON.parse(JSON.stringify(comAccounts));
			this.comInvoice = {
				...this.comInvoice,
				...comInvoice,
				companyBank: comInvoice.companyBank,
			};

			// 四级联动地址数据回显
			const {
				shopProvinceCode,
				shopCityCode,
				shopDistrictCode,
				shopStreetCode,
				contactProvinceCode,
				contactCityCode,
				contactDistrictCode,
				contactStreetCode,
				deliveryProvinceCode,
				deliveryCityCode,
				deliveryDistrictCode,
				deliveryStreetCode,
				shopProvinceName, //
				shopCityName,
				shopDistrictName,
				shopStreetName,
				contactProvinceName,
				contactCityName,
				contactDistrictName,
				contactStreetName,
				deliveryProvinceName,
				deliveryCityName,
				deliveryDistrictName,
				deliveryStreetName,
			} = company;
			const {
				postProvinceCode,
				postCityCode,
				postDistrictCode,
				postStreetCode,
				// postProvinceName, //
				// postCityName,
				// postDistrictName,
				// postStreetName,
			} = comInvoice;
			this.shopValue = [shopProvinceCode, shopCityCode, shopDistrictCode, shopStreetCode];
			this.contactValue = contactProvinceCode
				? [contactProvinceCode, contactCityCode, contactDistrictCode, contactStreetCode]
				: [];
			this.deliveryValue = deliveryProvinceCode
				? [deliveryProvinceCode, deliveryCityCode, deliveryDistrictCode, deliveryStreetCode]
				: [];
			this.postValue = postProvinceCode ? [postProvinceCode, postCityCode, postDistrictCode, postStreetCode] : [];
			// placehodler
			shopProvinceName &&
				(this.shopPalce = [shopProvinceName, shopCityName, shopDistrictName, shopStreetName].filter(e => e).join('/'));
			contactProvinceName &&
				(this.contactPalce = [contactProvinceName, contactCityName, contactDistrictName, contactStreetName]
					.filter(e => e)
					.join('/'));
			deliveryProvinceName &&
				(this.deliveryPalce = [deliveryProvinceName, deliveryCityName, deliveryDistrictName, deliveryStreetName]
					.filter(e => e)
					.join('/'));
			let postPalce = postProvinceCode
				? this.rewritePlace([postProvinceCode, postCityCode, postDistrictCode, postStreetCode], city)
				: '';
			this.postPalce = postPalce && postPalce.filter(e => e).join('/');
			// 地区板块
			this.comRegion = {
				...this.comRegion,
				companyId: comRegionInfo.companyId || '',
				regionCodes: comRegionInfo.regionCodes || [],
			};
			this.areaList = comRegionInfo.comProvinces || [];
			this.companyId = comRegionInfo.companyId || company.id;
			this.regionCodes = comRegionInfo.regionCodes || [];
			let codes = comRegionInfo.comProvinces.map(item => item.provinceCode);
			this.areaSelectProp = {
				id: params.id,
				isAddData: this.isAddData,
				codeArr: JSON.stringify(codes),
				proviceArr: JSON.stringify(comRegionInfo.comProvinces),
			};
		},
		// 根据省市区编码获取对应文本
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
		// 初始化
		init() {
			const { id } = this.$route.query;
			this.bankProvinceList = this.pacas;
			this.id = id;
			if (id) {
				// 编辑页面
				this.isAddData = false;
				// 编辑页面获取详情接口数据回显
				const params = {
					id,
				};
				this.getDetailInfo(params);
			} else {
				// 新增页面
				this.isAddData = true;
			}
		},
		// 接收选择的地区数据
		addRegionCodes(codes) {
			this.regionCodes = codes.regionCodes || [];
		},
	},
	created() {
		this.init();
		this.$listen('SAVE_REGION_CODES', this.addRegionCodes);
	},
};
</script>
<style lang="scss" scoped>
.box-card {
	margin: 24px 0;
}
.title {
	margin-bottom: 30px;
	font-weight: 500;
	color: rgba(48, 51, 54, 1);
}
.ye {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.mb-30 {
	margin-bottom: 30px;
}
.mr-10 {
	margin-right: 10px;
}
.save {
	width: 100px;
	margin-right: 16px;
}
.cacel {
	width: 100px;
}
.fr {
	float: right;
}
.style-width {
	width: 220px;
}
.w-hundred {
	width: 100%;
}
.w-f-hundred {
	width: 500px;
}
.w-t-hundred {
	width: 280px;
}
</style>
