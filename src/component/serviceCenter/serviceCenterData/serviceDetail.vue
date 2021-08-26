<template>
	<div class="serviceDetail">
		<guideBar>
			<template v-if="storeExist">
				<el-button
					type="success"
					v-permission="'service_center_detail_store_transfer'"
					icon="el-icon-money"
					@click="storeTransfer"
				>
					店铺转让
				</el-button>
				<el-button
					type="primary"
					v-permission="'service_center_detail_data_edit'"
					icon="el-icon-edit-outline"
					@click="editData"
				>
					修改资料
				</el-button>
			</template>
		</guideBar>
		<el-card class="box-card">
			<div class="detailMessage">
				<h6>关键信息</h6>
				<div>
					<span class="newUI label-name">服务中心编号：</span>
					<span class="newUI label-content">{{ keyInfo.store.code || '' }}</span>
				</div>
				<div>
					<span class="newUI label-name">服务中心名称：</span>
					<span class="newUI label-content">{{ keyInfo.store.name || '' }}</span>
				</div>
				<div>
					<span class="newUI label-name">负责人卡号：</span>
					<span class="newUI label-content">{{ (keyInfo.user && keyInfo.user.cardNo) || '' }}</span>
				</div>
				<div>
					<span class="newUI label-name">负责人姓名：</span>
					<span class="newUI label-content">{{ (keyInfo.user && keyInfo.user.realname) || '' }}</span>
				</div>
			</div>
		</el-card>
		<el-card>
			<el-tabs v-model="activeName">
				<el-tab-pane name="personDetail" label="负责人资料">
					<personDetail :dataSource="personData" />
				</el-tab-pane>
				<el-tab-pane name="serviceCenterDetail" label="服务中心资料">
					<service-center-detail :dataSource="serviceCenterData" />
				</el-tab-pane>
				<el-tab-pane name="bankDetail" label="银行账户资料">
					<bankDetail :data="bankData" />
				</el-tab-pane>
				<el-tab-pane name="cardDetail" label="证件资料">
					<cardDetail :dataSource="cardData" />
				</el-tab-pane>
				<el-tab-pane name="clerkDetail" label="店员资料">
					<clerkDetail :activeName="activeName" :storeCode="code" />
				</el-tab-pane>
				<el-tab-pane name="shopDetail" label="店铺资料">
					<shopDetail :dataSource="shopData" />
				</el-tab-pane>
				<el-tab-pane name="historyDetail" label="变更历史">
					<historyDetail :dataSource="historyDetail" />
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import personDetail from './unit/personDetail';
import serviceCenterDetail from './unit/serviceCenterDetail';
import bankDetail from './unit/bankDetail';
import cardDetail from './unit/cardDetail';
import clerkDetail from './unit/clerkDetail';
import shopDetail from './unit/shopDetail';
import historyDetail from './unit/historyDetail';
import qs from 'querystring';

export default {
	name: 'serviceDetail',
	components: {
		personDetail,
		serviceCenterDetail,
		bankDetail,
		cardDetail,
		clerkDetail,
		shopDetail,
		historyDetail,
	},
	data() {
		return {
			active: 0,
			code: null,
			activeName: 'personDetail',
			keyInfo: { store: {}, user: {} }, //关键信息
			// 负责人资料
			personData: {},
			// 服务中心资料
			serviceCenterData: {},
			// 银行账号资料
			bankData: [],
			// 证件资料
			cardData: null,
			// 店员资料
			clerkData: [],
			// 店铺资料
			shopData: {},
			// 变更历史
			historyDetail: {
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
			},
		};
	},
	watch: {
		// 当前激活选项卡
		activeName(name) {
			const { code } = this;
			if (name === 'personDetail') return this.getLeaderInfoById(); // 负责人详情
			if (name === 'serviceCenterDetail') return this.getStoreInfoDetail(code); // 服务中心详情
			if (name === 'bankDetail') return this.getBankAccountList(code); // 银行详情
			if (name === 'cardDetail') return this.listCredential(code); // 证件资料详情
			if (name === 'shopDetail') return this.decorationInfo(code); // 服务中心装修资料
			if (name === 'historyDetail') return this.loadChangeHistory(code); // 历史记录
		},
	},
	computed: {
		storeExist() {
			return this.keyInfo.store && !this.keyInfo.store.disqualified;
		},
	},
	methods: {
		// 店铺转让
		storeTransfer() {
			this.$go('service_edit_leader', { code: this.code, cardNo: this.cardNo, type: 'transfer' });
		},
		// 修改资料
		editData() {
			this.$go('service_edit', { code: this.code, cardNo: this.cardNo });
		},
		// 根据服务中心编号获取服务中心和负责人资料
		async getStoreByCode() {
			const params = {
				code: this.code,
			};
			const res = await this.$fetch(`/mgmt/store/getStoreByCode?${qs.stringify(params)}`);
			if (res && res.code == 200) {
				const { user } = res.data;
				this.cardNo = user.cardNo;
				this.keyInfo = { ...res.data };
				this.getLeaderInfoById();
			} else {
				this.$message.error(res.data.message || '获取服务中心和负责人基础资料失败');
			}
		},
		// 根据会员id获取负责人资料
		async getLeaderInfoById() {
			const { leaderId } = this.keyInfo.store;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/store/leader/getLeaderById',
				params: { leaderId },
			});
			if (res && res.data) {
				const { realname, storeCode, memberType, del } = res.data;
				this.personData = res.data;
				this.keyInfo.realname = realname || '';
				this.serviceCenterData.mainStoreCode = storeCode; //总店storeCode
				this.serviceCenterData.leaderType = memberType; //负责人身份
				this.serviceCenterData.mainStoreDel = del; //总店是否取消
			} else {
				this.$message.error('获取负责人资料失败');
			}
		},
		//根据会员卡号获取顾客信息队列 @todo 接口修改
		// async getMemberInfoByCardNo(cardNo) {
		// 	if (!cardNo) return this.$message.warning('未获取到负责人卡号');
		// 	const res = await this.$fetch(`/mgmt/store/leader/getLeaderByCardNo?cardNo=${cardNo}`);
		// 	if (res && res.data) {
		// 		this.personData = res.data;
		// 		this.keyInfo.realname = res.data.realname || '';
		// 		this.serviceCenterData.mainStoreCode = res.data.storeCode; //总店storeCode
		// 		this.serviceCenterData.leaderType = res.data.memberType; //负责人身份
		// 		this.serviceCenterData.mainStoreDel = res.data.del; //总店是否取消
		// 	} else {
		// 		this.$message.error('获取负责人资料失败');
		// 	}
		// },

		//服务中心详情 -- 服务中心资料
		async getStoreInfoDetail(storeCode) {
			if (!storeCode) return this.$message.warning('未获取到服务中心编号');
			const res = await this.$fetch(`/mgmt/store/getStoreInfoDetail?storeCode=${storeCode}`);
			if (res && res.code === 200 && res.data) {
				let { deliveryInfo, extraInfo, storeInfo, loginMobile } = res.data;
				let params = storeInfo;
				params.deliveryInfo = deliveryInfo;
				params.extraInfo = extraInfo;
				this.serviceCenterData = {
					loginMobile,
					...this.serviceCenterData,
					...params,
				};
			} else {
				this.$message.error(res.data.message || '获取服务中心资料信息失败');
			}
		},
		//服务中心装修资料
		async decorationInfo(storeCode) {
			if (!storeCode) return this.$message.warning('未获取到服务中心编号');
			const res = await this.$fetch(`/mgmt/store/decorationInfo?storeCode=${storeCode}`);
			if (res && res.data) {
				this.shopData = res.data;
			} else {
				this.$message.error(res.message);
			}
		},
		//获取银行账号--通过storeCode
		async getBankAccountList(storeCode) {
			if (!storeCode) return this.$message.warning('未获取到服务中心编号');
			const res = await this.$fetch(`/mgmt/store/getBankAccountList?storeCode=${storeCode}`);
			if (res && res.data) {
				this.bankData = res.data;
			} else {
				this.$message.error(res.data.message || '获取银行资料信息失败');
			}
		},
		//服务中心证件资料
		async listCredential(storeCode) {
			if (!storeCode) return this.$message.warning('未获取到服务中心编号');
			const res = await this.$fetch(`/mgmt/store/listCredential?storeCode=${storeCode}`);
			if (res && res.data && res.data.length) {
				const [certificateVO1, certificateVO3, certificateVO2] = res.data;
				this.cardData = {
					certificateVO1: { ...certificateVO1, info: JSON.parse(certificateVO1.info) },
					certificateVO2: { ...certificateVO2, info: JSON.parse(certificateVO2.info) },
					certificateVO3: { ...certificateVO3, info: JSON.parse(certificateVO3.info) },
				};
			} else {
				this.$message.error('未获取到服务中心证件资料');
			}
		},
		async loadChangeHistory(code) {
			const { currentPage, pageSize } = this.historyDetail.pagination;
			const params = {
				storeCode: code,
				pageNum: currentPage,
				pageSize,
			};
			const res = await this.$fetch(`/mgmt/store/storeEditLog?${qs.stringify(params)}`);
			if (res && res.data) {
				const { list, total } = res.data;
				const dataSource = {
					list: list,
					total: total,
				};
				this.historyDetail = { ...this.historyDetail, ...dataSource };
				if (total == 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取变更历史数据失败');
			}
		},
		pageChangeHistory(data) {
			this.historyDetail.pagination = { ...this.historyDetail.pagination, ...data };
			this.loadChangeHistory(this.code);
		},
	},
	mounted() {
		const { code, cardNo } = this.$route.query;
		if (cardNo || code) {
			this.code = code;
		}
		this.getStoreByCode();
		this.$listen('UPDATE_CHANGE_HISTORY_LIST', this.pageChangeHistory);
		this.$listen('UPDATE_LEADER_DATA_MODULE', this.getStoreByCode);
		this.$listen('UPDATE_SERVICE_CENTRE_DETAIL', this.getStoreByCode);
	},
};
</script>
<style lang="scss">
.serviceDetail {
	.table-content {
		height: 300px;
		overflow-y: scroll;
	}
	.detailMessage {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		margin-bottom: -8px;
		h6 {
			font-size: 16px;
			width: 100%;
			margin-bottom: 16px;
		}
		> div {
			width: 33%;
			font-size: 12px;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			color: rgba(134, 134, 134, 1);
			line-height: 17px;
			margin-bottom: 8px;
		}
	}
}
</style>
