<template>
	<div class="serviceCenterDetail" v-if="JSON.stringify(dataSource) != '{}'">
		<el-form :model="dataSource" label-suffix=":" label-width="130px">
			<el-row class="el-row">
				<el-col :span="8" class="flex">
					<el-form-item label="服务中心名称">{{ dataSource.name || '' }}</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="所属分公司编号">{{ dataSource.companyCode || '' }}</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="网点类型">
						{{ (dataSource.shopType && NETWORK_TYPE[dataSource.shopType]) || '' }}
					</el-form-item>
				</el-col>
				<!-- 负责人顾客身份不是微店 -->
				<template v-if="notWechatStore">
					<el-col :span="8" class="flex">
						<el-form-item label="是否分店">{{ dataSource.isMainShop == 2 ? '是' : '否' }}</el-form-item>
					</el-col>
					<el-col :span="8" class="flex">
						<el-form-item label="总店负责人卡号">{{ dataSource.leaderNo || '' }}</el-form-item>
					</el-col>
					<el-col :span="8" class="flex" v-show="mainStoreCodeVisible">
						<el-form-item label="分店管理员卡号">{{ dataSource.shopkeeperNo || '' }}</el-form-item>
					</el-col>
					<el-col :span="8" class="flex" v-show="mainStoreCodeVisible">
						<el-form-item label="分店管理员姓名">
							{{ dataSource.shopkeeperName || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="8" class="flex">
						<el-form-item label="登录手机号码">
							{{ dataSource.loginMobile || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="8" v-show="mainStoreCodeVisible">
						<el-form-item label="总店服务中心编号">
							{{ (!dataSource.mainStoreDel && dataSource.mainStoreCode) || '' }}
						</el-form-item>
					</el-col>
				</template>
				<template v-else>
					<el-col :span="8" class="flex">
						<el-form-item label="负责人卡号">{{ dataSource.leaderNo || '' }}</el-form-item>
					</el-col>
				</template>
				<el-col :span="8" class="flex">
					<el-form-item label="是否服务网点">{{ dataSource.isServiceShop == 1 ? '是' : '否' }}</el-form-item>
				</el-col>
				<el-col :span="8" v-if="!notWechatStore">
					<el-form-item label="油葱编号">{{ dataSource.ucongNo || '' }}</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="是否签订合同">{{ dataSource.isSignContract == 1 ? '是' : '否' }}</el-form-item>
				</el-col>
				<el-col :span="24" class="flex">
					<el-form-item label="未签合同原因">
						{{ (dataSource.extraInfo && dataSource.extraInfo.unContactReason) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="批准时间">{{ formatDateDefault(dataSource.ratifyDate) || '--' }}</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="开业时间">{{ formatDateDefault(dataSource.openDate) || '--' }}</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="服务中心邮箱">
						{{ (dataSource.email && dataSource.email + '@perfect99.com') || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="电话1">{{ (dataSource.extraInfo && dataSource.extraInfo.phone1) || '' }}</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="电话2">{{ (dataSource.extraInfo && dataSource.extraInfo.phone2) || '' }}</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="联系手机">{{ dataSource.phone || '' }}</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="邮编">{{ dataSource.zipCode || '' }}</el-form-item>
				</el-col>
				<el-col :span="16" class="flex">
					<el-form-item label="传真">{{ dataSource.fax || '' }}</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="经营地址">{{ businessAddress || '' }}</el-form-item>
				</el-col>
				<el-col :span="16" class="flex">
					<el-form-item label="详细地址">
						{{ (dataSource.deliveryInfo && dataSource.deliveryInfo.detailAddress) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="收货地址">{{ receiveGoodsAddress || '' }}</el-form-item>
				</el-col>
				<el-col :span="16" class="flex">
					<el-form-item label="详细地址">
						{{ (dataSource.deliveryInfo && dataSource.deliveryInfo.address) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="收货人">
						{{ (dataSource.deliveryInfo && dataSource.deliveryInfo.person) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="收货人电话">
						{{ (dataSource.deliveryInfo && dataSource.deliveryInfo.phoneNum) || '' }}
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="24" class="el-row">
				<el-col :span="8" class="flex">
					<el-form-item label="收讫章">
						<el-image
							fit="scale-down"
							class="image-wrap"
							v-if="dataSource.deliveryInfo && dataSource.deliveryInfo.receiptSeal"
							:src="dataSource.deliveryInfo.receiptSeal"
							:preview-src-list="[dataSource.deliveryInfo.receiptSeal]"
							alt
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<el-form-item label="拟搬迁地址">
						{{ (dataSource.deliveryInfo && dataSource.deliveryInfo.planMoveAddress) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="联系地址">
						{{ contactAddress }}
					</el-form-item>
				</el-col>
				<el-col :span="16">
					<el-form-item label="详细地址">
						{{ (dataSource.deliveryInfo && dataSource.deliveryInfo.contactDetailAddress) || '' }}
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="8" class="flex">
					<el-form-item label="法人姓名">
						{{ (dataSource.extraInfo && dataSource.extraInfo.legalPerson) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="法人身份证">
						{{ (dataSource.extraInfo && dataSource.extraInfo.legalInfo) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="微信号">
						{{ dataSource.wechat || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="担保人1卡号">
						{{ (dataSource.extraInfo && dataSource.extraInfo.guaranteeCard1) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="担保人1姓名">
						{{ (dataSource.extraInfo && dataSource.extraInfo.guaranteeName1) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="担保人1服务中心">
						{{ (dataSource.extraInfo && dataSource.extraInfo.guaranteeCenter1) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="担保人2卡号">
						{{ (dataSource.extraInfo && dataSource.extraInfo.guaranteeCard2) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="担保人2姓名">
						{{ (dataSource.extraInfo && dataSource.extraInfo.guaranteeName2) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="担保人2服务中心">
						{{ (dataSource.extraInfo && dataSource.extraInfo.guaranteeCenter2) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="是否跨省搬迁">
						{{ dataSource.extraInfo && dataSource.extraInfo.isTransProvincial == 1 ? '是' : '否' }}
					</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="原店号">
						{{ (dataSource.extraInfo && dataSource.extraInfo.originalStore) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="24" class="flex">
					<el-form-item label="服务中心权限">
						<el-checkbox-group v-model="dataSource.permission">
							<el-checkbox v-for="(item, index) in SERVICEAUTHORITY" :key="index" :label="item.value" disabled>
								{{ item.label }}
								<el-popover placement="top-start" width="120" trigger="hover" :content="item.tips">
									<i slot="reference" class="el-icon-question" />
								</el-popover>
							</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="8" class="flex" v-if="!notCancelType">
					<el-form-item label="取消时间">
						<span>
							{{ formatDateDefault(dataSource.extraInfo && dataSource.extraInfo.cancelTime) || '--' }}
						</span>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="取消类型">
						{{ (dataSource.extraInfo && CANCEL_TYPE_OPTIONS[dataSource.extraInfo.cancelType]) || '' }}
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<template v-if="!notFrozenType">
					<el-col :span="8" class="flex">
						<el-form-item label="冻结/解冻时间">
							{{ formatDateDefault(dataSource.extraInfo && dataSource.extraInfo.frozenTime) || '--' }}
						</el-form-item>
					</el-col>
					<el-col :span="16" class="flex">
						<el-form-item label="冻结/解冻原因">
							{{ (dataSource.extraInfo && dataSource.extraInfo.frozenReason) || '' }}
						</el-form-item>
					</el-col>
				</template>
				<el-col :span="8" class="flex">
					<el-form-item label="服务中心星级">{{ GRADE_OPTIONS[dataSource.level] || '' }}</el-form-item>
				</el-col>
				<el-col :span="16" class="flex">
					<el-form-item label="星级类型">{{ dataSource.levelResult || '' }}</el-form-item>
				</el-col>
				<el-col :span="24" class="flex">
					<el-form-item label="备注">{{ dataSource.remarks || '' }}</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script>
import { GRADE_OPTIONS } from '../../serviceCenterGrade/config.js';
import { NETWORK_TYPE, CANCEL_TYPE_OPTIONS } from '../config';
import { SERVICEAUTHORITY } from '../../serviceCenterLimit/config';
import { formatDateDefault } from '@/util/formValidation.js';
export default {
	name: 'serviceCenterDetail',
	props: {
		dataSource: {
			type: Object,
		},
	},
	data() {
		return {
			GRADE_OPTIONS,
			SERVICEAUTHORITY,
			NETWORK_TYPE,
			CANCEL_TYPE_OPTIONS,
		};
	},
	watch: {
		dataSource(val) {
			console.log(val);
			if (val.permission) {
				val.permission = val.permission.split(',').map(Number);
			}
		},
	},
	computed: {
		businessAddress() {
			const { provinceName, cityName, areaName, streetName } = this.dataSource;
			return `${provinceName || ''} ${cityName || ''} ${areaName || ''} ${streetName || ''}`;
		},
		receiveGoodsAddress() {
			const { deliveryProvinceName, deliveryCityName, deliveryAreaName, deliveryStreetName } =
				this.dataSource?.deliveryInfo || {};
			return `${deliveryProvinceName || ''} ${deliveryCityName || ''} ${deliveryAreaName || ''} ${
				deliveryStreetName || ''
			}`;
		},
		contactAddress() {
			const { contactProvinceName, contactCityName, contactAreaName, contactStreetName } =
				this.dataSource?.deliveryInfo || {};
			return `${contactProvinceName || ''} ${contactCityName || ''} ${contactAreaName || ''} ${
				contactStreetName || ''
			}`;
		},
		mainStoreCodeVisible() {
			const { isMainShop } = this.dataSource;
			return isMainShop == 2;
		},
		// 非微店用户
		notWechatStore() {
			return this.dataSource.leaderType != 4;
		},
		// 网点类型不是冻结类型 隐藏冻结时间和冻结原因
		notFrozenType() {
			return NETWORK_TYPE[this.dataSource.shopType].indexOf('冻结') == -1;
		},
		// 网点类型不是取消类型 隐藏取消时间字段
		notCancelType() {
			return NETWORK_TYPE[this.dataSource.shopType].indexOf('取消') == -1;
		},
		formatDateDefault() {
			return formatDateDefault;
		},
	},
	created() {
		this.shopTypeList();
	},
	methods: {
		chooseAdress(data) {
			console.log(data);
		},
		// 网点类型列表
		async shopTypeList() {
			const res = await this.$fetch(`/mgmt/store/list/shopType?pageNum=0&pageSize=0`);
			if (res && res.code === 200) {
				let list = res.data.list;
				list &&
					list.forEach(item => {
						this.NETWORK_TYPE[item.type] = item.name;
					});
			} else {
				this.$message.error(res.message || '获取网点类型列表数据失败');
			}
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep.serviceCenterDetail {
	.el-row {
		line-height: 40px;
	}
	.el-form-item {
		margin-bottom: 0;
	}
	.image-wrap {
		> img {
			width: 100px;
			height: 100px;
		}
	}
}
</style>
