<template>
	<div class="branch-detail">
		<guideBar />
		<!-- 基础信息 -->
		<el-card class="box-card">
			<div class="title">基础信息</div>
			<div>
				<el-row class="el-row">
					<el-col :span="8" class="flex">
						<div class="label">公司编号:</div>
						<div class="content">{{ company.code }}</div>
					</el-col>
					<el-col :span="8" class="flex">
						<div class="label">公司名称:</div>
						<div class="content">{{ company.name }}</div>
					</el-col>
					<el-col :span="8" class="flex">
						<div class="label">公司全称:</div>
						<div class="content">{{ company.fullName }}</div>
					</el-col>
				</el-row>
				<el-row class="el-row">
					<el-col :span="8" class="flex">
						<div class="label">公司类型:</div>
						<div class="content">{{ BRANCH_TYPE[company.type] }}</div>
					</el-col>
					<el-col :span="8" class="flex">
						<div class="label">公司等级:</div>
						<div class="content">{{ company.grade }}</div>
					</el-col>
					<el-col :span="8" class="flex">
						<div class="label">开设日期:</div>
						<div class="content">{{ company.openTime }}</div>
					</el-col>
				</el-row>
				<el-row class="el-row">
					<el-col :span="8" class="flex">
						<div class="label">负责人:</div>
						<div class="content">{{ company.principal }}</div>
					</el-col>
					<el-col :span="8" class="flex">
						<div class="label">负责人手机号:</div>
						<div class="content">{{ company.principalPhone }}</div>
					</el-col>
					<el-col :span="8" class="flex">
						<div class="label">传真:</div>
						<div class="content">{{ company.faxPhone }}</div>
					</el-col>
				</el-row>
				<el-row class="el-row">
					<el-col :span="8" class="flex">
						<div class="label">固定电话1:</div>
						<div class="content">{{ company.fixedPhoneOne }}</div>
					</el-col>
					<el-col :span="8" class="flex">
						<div class="label">固定电话2:</div>
						<div class="content">{{ company.fixedPhoneTwo }}</div>
					</el-col>
					<el-col :span="8" class="flex">
						<div class="label">电子邮箱1:</div>
						<div class="content">{{ company.emailOne }}</div>
					</el-col>
				</el-row>
				<el-row class="el-row">
					<el-col :span="8" class="flex">
						<div class="label">电子邮箱2:</div>
						<div class="content">{{ company.emailTwo }}</div>
					</el-col>
					<el-col :span="8" class="flex">
						<div class="label">店所在地址:</div>
						<div class="content">{{ address('shop') }}</div>
					</el-col>
					<el-col :span="8" class="flex">
						<div class="label">邮编:</div>
						<div class="content">{{ company.shopPostcode }}</div>
					</el-col>
				</el-row>
				<el-row class="el-row">
					<el-col :span="8" class="flex">
						<div class="label">联系地址:</div>
						<div class="content">{{ address('contact') }}</div>
					</el-col>
					<el-col :span="8" class="flex">
						<div class="label">联系地址邮编:</div>
						<div class="content">{{ company.contactPostcode }}</div>
					</el-col>
					<el-col :span="8" class="flex">
						<div class="label">邮编:</div>
						<div class="content">{{ company.contactPostcode }}</div>
					</el-col>
				</el-row>
				<el-row class="el-row">
					<el-col :span="8" class="flex">
						<div class="label">发货地址:</div>
						<div class="content">{{ address('deliver') }}</div>
					</el-col>
					<el-col :span="8" class="flex">
						<div class="label">发货地址邮编:</div>
						<div class="content">{{ company.deliveryPostcode }}</div>
					</el-col>
					<el-col :span="8" class="flex">
						<div class="label">邮编:</div>
						<div class="content">{{ company.deliveryPostcode }}</div>
					</el-col>
				</el-row>
				<el-row class="el-row">
					<el-col :span="8" class="flex">
						<div class="label">退回信息:</div>
						<div class="content">{{ company.returnInfo }}</div>
					</el-col>
				</el-row>
			</div>
		</el-card>
		<!-- 账户信息 -->
		<el-card class="box-card">
			<div class="title">账户信息</div>
			<tableList border :dataSource="comAccounts" :columns="BRANCH_DETAIL_COLUMNS" />
		</el-card>
		<!-- 发票信息 -->
		<el-card class="box-card">
			<div class="title">发票信息</div>
			<div>
				<el-row class="el-row">
					<el-col :span="12" class="flex">
						<div class="label">公司全称:</div>
						<div class="content">{{ company.fullName }}</div>
						<!-- <div class="content">{{ company.name || comInvoice.companyId }}</div> -->
					</el-col>
					<el-col :span="12" class="flex">
						<div class="label">公司税号:</div>
						<div class="content">{{ comInvoice.taxNo }}</div>
					</el-col>
				</el-row>
				<el-row class="el-row">
					<el-col :span="12" class="flex">
						<div class="label">注册地址:</div>
						<div class="content">{{ comInvoice.companyAddress }}</div>
					</el-col>
					<el-col :span="12" class="flex">
						<div class="label">电话:</div>
						<div class="content">{{ comInvoice.companyPhone }}</div>
					</el-col>
				</el-row>
				<el-row class="el-row">
					<el-col :span="12" class="flex">
						<div class="label">开户银行:</div>
						<div class="content">{{ comInvoice.companyBank }}</div>
					</el-col>
					<el-col :span="12" class="flex">
						<div class="label">账号:</div>
						<div class="content">{{ comInvoice.companyAccount }}</div>
					</el-col>
				</el-row>
				<el-row class="el-row">
					<el-col :span="12" class="flex">
						<div class="label">开户支行:</div>
						<div class="content">{{ comInvoice.bankName }}</div>
					</el-col>
					<el-col :span="12" class="flex">
						<div class="label"></div>
						<div class="content"></div>
					</el-col>
				</el-row>
				<el-row class="el-row">
					<el-col :span="12" class="flex">
						<div class="label">发票地址url:</div>
						<div class="content">{{ comInvoice.addressUrl }}</div>
					</el-col>
					<el-col :span="12" class="flex">
						<div class="label">不含税金额上限:</div>
						<div class="content">{{ comInvoice.excludingTaxMaximumAmount }}</div>
					</el-col>
				</el-row>
				<el-row class="el-row">
					<el-col :span="12" class="flex">
						<div class="label">开票员:</div>
						<div class="content">{{ comInvoice.drawer }}</div>
					</el-col>
					<el-col :span="12" class="flex">
						<div class="label">收款员:</div>
						<div class="content">{{ comInvoice.cashier }}</div>
					</el-col>
				</el-row>
				<el-row class="el-row">
					<el-col :span="12" class="flex">
						<div class="label">复核人:</div>
						<div class="content">{{ comInvoice.checker }}</div>
					</el-col>
					<el-col :span="12" class="flex">
						<div class="label">发票邮寄地址:</div>
						<div class="content">{{ address('post') }}</div>
					</el-col>
				</el-row>
				<el-row class="el-row">
					<el-col :span="12" class="flex">
						<div class="label">邮编:</div>
						<div class="content">{{ comInvoice.postPostcode }}</div>
					</el-col>
					<el-col :span="12" class="flex">
						<div class="label">收票人/电话:</div>
						<div class="content">{{ comInvoice.drawee }}</div>
					</el-col>
				</el-row>
			</div>
		</el-card>
			<actionBar>
				<el-button v-permission="'branch_detail_edit_profile'" type="primary" plain @click="updateDetail">
					修改资料
				</el-button>
			</actionBar>
	</div>
</template>
<script>
import { BRANCH_DETAIL_COLUMNS, BRANCH_TYPE, BANK_TYPE, SHOP_KEY, CONTACT_KEY, DELIVER_KEY, POST_KEY } from './config';
import qs from 'querystring';

export default {
	name: 'branchDetail',
	data() {
		return {
			BRANCH_DETAIL_COLUMNS,
			BRANCH_TYPE,
			BANK_TYPE,
			company: {}, // 基础信息
			comAccounts: [], // 账户信息
			comInvoice: {}, // 发票信息
			comRegionInfo: {}, // 业务区域范围
			tableData: [],
			areaList: [],
			id: '',
			areaSelectProp: {},
		};
	},
	// filters: {
	// 	formatDate,
	// },
	methods: {
		address(type) {
			// 省
			let provinceName = this.typeCheck(type, 1) || '';
			// 市
			let citysName = this.typeCheck(type, 2) || '';
			// 区
			let districtName = this.typeCheck(type, 3) || '';
			// 街道
			let streetName = this.typeCheck(type, 4) || '';
			// 详细地址
			let addressInfo = this.typeCheck(type, 5) || '';

			return provinceName + citysName + districtName + streetName + ' ' + addressInfo;
		},
		// 判断地址类型
		typeCheck(type, index) {
			const { company, comInvoice } = this;
			switch (type) {
				// 店地址
				case 'shop':
					return company[SHOP_KEY[index]];
				// 联系地址
				case 'contact':
					return company[CONTACT_KEY[index]];
				// 发货地址
				case 'deliver':
					return company[DELIVER_KEY[index]];
				// 发票邮寄地址
				case 'post':
					return comInvoice[POST_KEY[index]];
				default:
					return null;
			}
		},
		// 修改资料
		updateDetail() {
			this.$go('update_branch', {
				title: '编辑分公司',
				id: this.id,
			});
		},
		// 获取详情信息
		async getDetail(params) {
			const res = await this.$fetch(`/mgmt/sys/getComInfo?${qs.stringify(params)}`);
			if (!res) return;
			const { company, comAccounts, comInvoice, comRegionInfo } = res.data;

			if (res && res.code === 200) {
				this.company = company;
				this.comAccounts = comAccounts;
				this.comInvoice = comInvoice;
				this.comRegionInfo = comRegionInfo;
				this.areaList = comRegionInfo.comProvinces || [];

				let codes = comRegionInfo.comProvinces.map(item => item.provinceCode);
				this.areaSelectProp = {
					id: params.id,
					isAddData: this.isAddData,
					codeArr: JSON.stringify(codes),
					proviceArr: JSON.stringify(comRegionInfo.comProvinces),
					allDisabled: true,
				};
			} else {
				this.company = {};
				this.comAccounts = [];
				this.comInvoice = {};
				this.comRegionInfo = {};
				this.areaList = [];
			}
		},
	},
	created() {
		const { id } = this.$route.query;
		this.id = id;
		const params = {
			id,
		};
		this.getDetail(params);
	},
};
</script>
<style lang="scss" scoped>
.box-card {
	margin: 24px 0;
}
.el-row {
	height: 30px;
	line-height: 30px;
}
.title {
	margin-bottom: 30px;
	font-weight: 500;
	color: rgba(48, 51, 54, 1);
}
.flex {
	display: flex;
	font-weight: 400;
	font-size: 14px;
	color: rgba(92, 98, 104, 1);
	.label {
		width: 120px;
		text-align: right;
	}
	.content {
		margin-left: 16px;
	}
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
</style>
