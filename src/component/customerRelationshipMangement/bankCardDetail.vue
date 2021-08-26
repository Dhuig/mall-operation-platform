<template>
	<div>
		<guideBar />
		<!-- 顾客信息 -->
		<el-card class="part-gap">
			<h3>顾客信息</h3>
			<el-form :model="detail" inline label-position="right" label-width="140px" label-suffix=":">
				<el-row>
					<el-form-item label="顾客编号">
						<el-input size="small" v-model="detail.memberId" class="input-item" readonly />
					</el-form-item>
					<el-form-item label="会员卡号">
						<el-input size="small" v-model="detail.cardNo" class="input-item" readonly />
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="身份证号">
						<el-input size="small" v-model="detail.certificatesNo" class="input-item" readonly />
					</el-form-item>
					<el-form-item label="顾客姓名">
						<el-input size="small" v-model="detail.realname" class="input-item" readonly />
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="手机号码">
						<el-input size="small" v-model="detail.mobile" class="input-item" readonly />
					</el-form-item>
					<el-form-item label="服务中心编号">
						<el-input size="small" v-model="detail.storeCode" class="input-item" readonly />
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="服务中心负责人">
						<el-input size="small" v-model="detail.storeLeaderName" class="input-item" readonly />
					</el-form-item>
					<el-form-item label="负责人手机号码">
						<el-input size="small" v-model="detail.storeLeaderPhone" class="input-item" readonly />
					</el-form-item>
				</el-row>
			</el-form>
		</el-card>
		<!-- 银行信息 -->
		<el-card class="part-gap">
			<h3>银行信息</h3>
			<el-form :model="detail" inline label-position="right" label-width="140px" disabled label-suffix=":">
				<el-row>
					<el-form-item label="开户银行类型">
						<el-select size="small" v-model="detail.bankOpenType" placeholder="" class="input-item" readonly>
							<el-option
								v-for="(option, $idx) in BANKTYPE_OPTIONS"
								:key="$idx"
								:label="option.label"
								:value="option.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item label="发放类型">
						<el-select size="small" v-model="detail.provideType" placeholder class="input-item" readonly>
							<el-option
								v-for="(option, $idx) in PAY_TYPE_OPTIONS"
								:key="$idx"
								:label="option.label"
								:value="option.value"
							/>
						</el-select>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="开户行名称">
						<el-input size="small" v-model="detail.bankOpenName" class="input-item" readonly />
					</el-form-item>
					<el-form-item label="银行帐号">
						<el-input size="small" v-model="detail.bankNo" class="input-item" readonly />
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="所属省市" prop>
						<el-cascader size="medium" ref="pca-elcascader" placeholder v-model="site" class="bank_info" />
					</el-form-item>
				</el-row>
			</el-form>
		</el-card>
		<!-- 直销员银行信息 -->
		<el-card class="part-gap">
			<h3>直销员银行信息</h3>
			<el-form :model="detail" disabled inline label-position="right" label-width="140px" label-suffix=":">
				<el-row>
					<el-form-item label="开户银行类型">
						<el-select
							size="small"
							v-model="detail.directSellerBanksVo.banktype"
							placeholder
							class="input-item"
							readonly
						>
							<el-option
								v-for="(option, $idx) in BANKTYPE_OPTIONS"
								:key="$idx"
								:label="option.label"
								:value="option.value"
							/>
						</el-select>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="开户行名称">
						<el-input size="small" v-model="detail.directSellerBanksVo.bankname" class="input-item" readonly />
					</el-form-item>
					<el-form-item label="银行账号">
						<el-input size="small" v-model="detail.directSellerBanksVo.bankno" class="input-item" readonly />
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="所属省">
						<el-input size="small" v-model="detail.directSellerBanksVo.provname" class="input-item" readonly />
					</el-form-item>
					<el-form-item label="所属城市">
						<el-input size="small" v-model="detail.directSellerBanksVo.cityname" class="input-item" readonly />
					</el-form-item>
				</el-row>
			</el-form>
		</el-card>
		<!-- 变更日志记录 -->
		<el-card class="part-gap">
			<h3>变更日志记录</h3>
			<tableList
				border
				:dataSource="changelog.data"
				:columns="CHANGE_HISTORY_COLUMNS"
				:pagination="changelog.pagination"
				:dataTotal="changelog.total"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			>
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click.stop="handleRemove(scope.row)" icon="el-icon-plus">
						新增
					</el-button>
					<el-button type="danger" size="small" @click.stop="handleRemove(scope.row)" icon="el-icon-delete">
						删除
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { optionGenerator } from 'util';
import maps from 'config/map';
import { PROVIDE_TYPE, BANKCARD_STATUS_CONFIG, CHANGE_HISTORY_COLUMNS } from './config';

export default {
	name: 'bankCardDetail',
	data() {
		return {
			PAY_TYPE_OPTIONS: optionGenerator(PROVIDE_TYPE),
			BANKTYPE_OPTIONS: [],
			BANKCARD_STATUS_CONFIG,
			CHANGE_HISTORY_COLUMNS,
			id: '',

			detail: {
				cardNo: '',
				card: '',
				certificatesNo: '',
				realname: '',
				mobile: '',
				storeCode: '',
				storeLeaderName: '',
				storeLeaderPhone: '',
				// 银行信息
				bankOpenType: '',
				provideType: '',
				bankOpenName: '',
				bankNo: '',
				province: '',
				city: '',
				district: '',
				// 直销员银行信息
				directSellerBanksVo: {
					banktype: '',
				},
			},
			// 变更日志
			changelog: {
				data: [],
				total: 0,
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			// 省市区
			lazyProps: {
				lazy: true, //  是否开启懒加载
				lazyLoad: this.lazyLoad, // 加载函数
			},
			site: [],
			placeData: {},
		};
	},
	methods: {
		handleChangePage(currentPage) {
			this.changelog.pagination.currentPage = currentPage;
			this.loadChangelog();
		},
		handleSizeChange(pageSize) {
			this.changelog.pagination.pageSize = pageSize;
			this.loadChangelog();
		},
		// 省市区回填
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
						if (item.value == data[index]) {
							result.push(item.label);
							if (item.children) {
								index++;
								loop(data, item.children);
							}
						}
					}
				});
			};
			loop(data, cityStore);
			return result;
		},
		// 银行卡详情
		async loadDetail() {
			const { id } = this;
			if (!id) return this.$message('银行卡 Id 不存在或无效, 无法查询银行卡详情');

			const res = await this.$fetch({
				method: 'POST',
				url: `/crm/bmemberbank/getProvideBankInfoById?id=${id}`,
			});

			if (res && res.code === 200 && res.data) {
				const {
					data,
					data: { bankOpenType },
				} = res;
				this.detail = {
					...data,
					bankOpenType: String(bankOpenType),
				};
				this.detail.directSellerBanksVo = data.directSellerBanksVo || { banktype: '' };
				// 省市区回填
				if (data.province) {
					console.log(data.province);
					let oneselfPro = this.rewritePlace([data.province, data.city, data.district], maps);
					this.site = `${oneselfPro[0] || ''}/${oneselfPro[1] || ''}`;
					setTimeout(() => {
						this.$refs['pca-elcascader'].inputValue = this.site;
						console.log(this.site);
					}, 300);
				}
				this.$nextTick(this.loadChangelog);
			} else {
				this.$message({
					type: 'error',
					message: res.message,
				});
			}
		},
		// 变更日志
		async loadChangelog() {
			const {
				detail: { provideType, memberId },
				changelog: {
					pagination: { currentPage: pageNum, pageSize },
				},
			} = this;
			if (!memberId) return this.$message('银行卡 Id 不存在或无效, 无法查询银行卡详情');
			const data = {
				memberId,
				provideType,
				pageNum,
				pageSize,
			};

			const res = await this.$fetch({
				method: 'POST',
				url: '/crm/bmemberbank/getProvideBankLog',
				data,
			});

			if (res && res.data) {
				const { list, total } = res.data;
				this.changelog.data = list;
				this.changelog.total = total;
			}
		},
		// 获取银行类型字典 @todo {字典:银行}
		async loadBankType() {
			const res = await this.$fetch('/crm/lov/getCrmLovListByType?dictType=openBankCode');
			if (res && res.data && res.data.length) {
				this.BANKTYPE_OPTIONS = res.data.map(({ code: value, name: label }) => ({ value, label }));
			}
		},
	},
	mounted() {
		const { id } = this.$route.query;
		this.id = id;
		this.loadBankType();
		setTimeout(() => {
			this.loadDetail(id);
		}, 500);
	},
};
</script>

<style lang="scss" scoped>
h3 {
	font-size: 16px;
	color: $color-title;
	margin-bottom: 16px;
}
.part-gap {
	margin-bottom: 16px;
}
.input-item {
	width: 200px;
}
.bank_info {
	width: 330px;
}
</style>
