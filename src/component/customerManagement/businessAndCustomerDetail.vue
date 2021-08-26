<template>
	<div>
		<guideBar />
		<el-tabs v-model="activeTab" @tab-click="handleTabChange()">
			<el-tab-pane label="业务详情" name="business">
				<el-form inline label-width="120px" label-suffix=":" class="customer-info">
					<el-row>
						<el-form-item label="顾客编号">
							<span>{{ detail.memberNo }}</span>
						</el-form-item>
						<el-form-item label="会员卡号">
							<span>
								<span v-if="isHaveCustomer">{{ detail.cardNo }}</span>
							</span>
						</el-form-item>
						<el-form-item label="注册手机号">
							<span>{{ detail.mobile }}</span>
						</el-form-item>
					</el-row>
					<el-row>
						<el-form-item label="顾客身份">
							<span>{{ detail.memberType in CUSTOMER_TYPE ? CUSTOMER_TYPE[detail.memberType] : '' }}</span>
						</el-form-item>
						<el-form-item label="邮箱">
							<span>{{ detail.email }}</span>
						</el-form-item>
						<el-form-item label="微信">
							<span>{{ detail.wechat.nickname }}</span>
						</el-form-item>
					</el-row>
					<el-row>
						<el-form-item label="顾客来源">
							<span>{{ detail.userSource in USER_SOURCE ? USER_SOURCE[detail.userSource] : '' }}</span>
						</el-form-item>
						<el-form-item label="开通渠道">
							<span>{{ detail.channel in CHANNEL ? CHANNEL[detail.channel] : '' }}</span>
						</el-form-item>
						<el-form-item label="邀请人卡号">
							<span>{{ detail.handledCardNo }}</span>
						</el-form-item>
						<el-form-item label="微信Open id">
							<span style="width: 260px;">{{ (detail.wechat && detail.wechat.openid) || '' }}</span>
						</el-form-item>
					</el-row>
					<el-row>
						<el-form-item label="状态">
							<span>{{ detail.memberStatus in ACCOUT_STATUS ? ACCOUT_STATUS[detail.memberStatus] : '' }}</span>
						</el-form-item>
						<el-form-item label="邀请人姓名">
							<span>{{ detail.handledRealname }}</span>
						</el-form-item>
						<el-form-item label="QQ">
							<span>{{ (detail.qq && detail.qq.nickname) || '' }}</span>
						</el-form-item>
					</el-row>
					<el-row>
						<el-form-item label="常驻地区">
							<span>{{ detail.usualLocation }}</span>
						</el-form-item>
						<el-form-item label="设备ID">
							<span></span>
						</el-form-item>
						<el-form-item label="QQ Open id">
							<span>{{ (detail.qq && detail.qq.openid) || '' }}</span>
						</el-form-item>
					</el-row>
					<el-row v-if="isHaveCustomer">
						<el-form-item label="折扣">
							<span>{{ detail.discount * 100 }}%</span>
						</el-form-item>
						<el-form-item label="PV">
							<span>{{ detail.pv }}</span>
						</el-form-item>
						<el-form-item label="会员最高等级">
							<span>{{ MEMBER_LEVEL_MAX[detail.memberLevelMax] }}</span>
						</el-form-item>
					</el-row>
				</el-form>
				<el-tabs v-model="business.activeTab" @tab-click="handleChildTabChange()">
					<el-tab-pane label="订单详情" name="order">
						<tableList
							border
							:dataSource="business.order.data"
							:columns="ORDER_COLUMNS"
							:pagination="business.order.pagination"
							:dataTotal="business.order.total"
							@handleChangePage="handleChangePage"
							@handleSizeChange="handleSizeChange"
							slotcontent
						>
							<template slot-scope="scope">
								<el-button type="primary" size="small" @click="gotoDetail(0, scope.data.orderNo)">详情</el-button>
							</template>
						</tableList>
					</el-tab-pane>
					<el-tab-pane label="退货" name="afterSell">
						<tableList
							border
							:dataSource="business.afterSell.data"
							:columns="AFTERSELL_COLUMNS"
							:pagination="business.afterSell.pagination"
							:dataTotal="business.afterSell.total"
							@handleChangePage="handleChangePage"
							@handleSizeChange="handleSizeChange"
							slotcontent
						>
							<template slot-scope="scope">
								<el-button type="primary" size="small" @click="gotoDetail(1, scope.data)">详情</el-button>
							</template>
						</tableList>
					</el-tab-pane>
					<el-tab-pane label="换货" name="changeSell">
						<tableList
							border
							:dataSource="business.changeSell.data"
							:columns="CHANGESELL_COLUMNS"
							:pagination="business.changeSell.pagination"
							:dataTotal="business.changeSell.total"
							@handleChangePage="handleChangePage"
							@handleSizeChange="handleSizeChange"
							slotcontent
						>
							<template slot-scope="scope">
								<el-button type="primary" size="small" @click="gotoDetail(2, scope.data)">详情</el-button>
							</template>
						</tableList>
					</el-tab-pane>
					<el-tab-pane label="优惠详情" name="discount">
						<tableList
							border
							:dataSource="business.discount.data"
							:columns="DISCOUNT_COLUMNS"
							:pagination="business.discount.pagination"
							:dataTotal="business.discount.total"
							@handleChangePage="handleChangePage"
							@handleSizeChange="handleSizeChange"
							slotcontent
						>
							<template slot-scope="scope">
								<el-button type="primary" size="small" @click="gotoDetail(3, scope.data.id)">详情</el-button>
							</template>
						</tableList>
					</el-tab-pane>
					<el-tab-pane label="收藏信息" name="favourite">
						<tableList
							border
							:dataSource="business.favourite.data"
							:columns="FAVOURITE_COLUMNS"
							:pagination="business.favourite.pagination"
							:dataTotal="business.favourite.total"
							@handleChangePage="handleChangePage"
							@handleSizeChange="handleSizeChange"
							slotcontent
						>
							<template slot-scope="scope">
								<el-button type="primary" size="small" @click="gotoDetail(4, scope.data.productId)">详情</el-button>
							</template>
						</tableList>
					</el-tab-pane>
					<el-tab-pane label="分享信息" name="share" v-if="isHaveCustomer">
						<tableList
							border
							:dataSource="business.share.data"
							:columns="SHARE_COLUMNS"
							:pagination="business.share.pagination"
							:dataTotal="business.share.total"
							@handleChangePage="handleChangePage"
							@handleSizeChange="handleSizeChange"
						></tableList>
					</el-tab-pane>
				</el-tabs>
			</el-tab-pane>
			<el-tab-pane label="顾客详情" name="customer" v-if="isHaveCustomer">
				<el-card class="item-gap">
					<h3>基本信息</h3>
					<el-form inline label-width="120px" label-suffix=":" class="customer-info">
						<el-row>
							<el-form-item label="会员卡号">
								<span>{{ customerDetail.cardNo }}</span>
							</el-form-item>
							<el-form-item label="姓名">
								<span>{{ customerDetail.realname }}</span>
							</el-form-item>
							<el-form-item label="联系手机号">
								<span>{{ customerDetail.contactMobile }}</span>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="证件类型">
								<span>
									{{
										customerDetail.certificatesType in CERTIFICATES_TYPE
											? CERTIFICATES_TYPE[customerDetail.certificatesType]
											: ''
									}}
								</span>
							</el-form-item>
							<el-form-item label="证件号码">
								<span>{{ customerDetail.certificatesNo }}</span>
							</el-form-item>
							<el-form-item label="证件有效期">
								<span>
									{{ customerDetail.detail.certificatesStartDate || '暂无' }} -
									{{ customerDetail.detail.certificatesEndDate || '暂无' }}
								</span>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="邮箱">
								<span>{{ customerDetail.email || '暂无' }}</span>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="性别">
								<span>{{ customerDetail.gender in SEX_TYPE ? SEX_TYPE[customerDetail.gender] : '' }}</span>
							</el-form-item>
							<el-form-item label="出生日期">
								<span>{{ customerDetail.detail ? customerDetail.detail.birthday : '' }}</span>
							</el-form-item>
							<el-form-item label="婚姻状况">
								<span>
									{{ customerDetail.detail.marital in MARITAL_TYPE ? MARITAL_TYPE[customerDetail.detail.marital] : '' }}
								</span>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="文化程度">
								<span>{{ dictType.education }}</span>
							</el-form-item>
							<el-form-item label="民族">
								<span>{{ customerDetail.detail.nation }}</span>
							</el-form-item>
							<el-form-item label="住宅电话">
								<span>{{ customerDetail.detail.homePhone }}</span>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="邮政编码">
								<span>{{ customerDetail.detail.postcode }}</span>
							</el-form-item>
							<el-form-item label="居住地">
								<span>{{ dictType.livePlace }}</span>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="所在区域">
								<span>
									<!-- {{ customerDetail.detail.province }} {{ customerDetail.detail.city }}
									{{ customerDetail.detail.district }}-->
									{{ customerRegion }}
								</span>
							</el-form-item>
							<el-form-item label="详细地址">
								<span>{{ customerDetail.detail.address }}</span>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="职业">
								<span>{{ dictType.professionType }}</span>
							</el-form-item>
							<el-form-item label="消费关注">
								<span>{{ dictType.consumeFollow }}</span>
							</el-form-item>
						</el-row>
					</el-form>
				</el-card>
				<el-card class="item-gap">
					<h3>邀请人信息</h3>
					<el-form inline label-width="120px" label-suffix=":" class="customer-info">
						<el-row>
							<el-form-item label="邀请人卡号">
								<span>{{ customerDetail.handledCardNo }}</span>
							</el-form-item>
							<el-form-item label="邀请人姓名">
								<span>{{ customerDetail.handledRealname }}</span>
							</el-form-item>
							<el-form-item label="联系手机">
								<span>{{ customerDetail.handledContactMobile }}</span>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="服务中心号">
								<span>{{ customerDetail.handledLeaderStoreCode }}</span>
							</el-form-item>
						</el-row>
					</el-form>
				</el-card>
				<el-card class="item-gap" v-if="customerDetail.detail && customerDetail.detail.spouseOrNot === 1">
					<h3>配偶信息</h3>
					<el-form inline label-width="120px" label-suffix=":" class="customer-info">
						<el-row>
							<el-form-item label="姓名">
								<span>{{ customerDetail.detail.spouseRealname }}</span>
							</el-form-item>
							<el-form-item label="联系手机号">
								<span>{{ customerDetail.detail.spouseMobile }}</span>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="证件类型">
								<span>
									{{
										customerDetail.detail.spouseCertificatesType in CERTIFICATES_TYPE
											? CERTIFICATES_TYPE[customerDetail.detail.spouseCertificatesType]
											: ''
									}}
								</span>
							</el-form-item>
							<el-form-item label="证件号码">
								<span>{{ customerDetail.detail.spouseCertificatesNo }}</span>
							</el-form-item>
							<el-form-item label="证件有效期">
								<span>
									{{ customerDetail.detail.spouseCertificatesStartDate || '暂无' }} -
									{{ customerDetail.detail.spouseCertificatesEndDate || '暂无' }}
								</span>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="性别">
								<span>
									{{
										customerDetail.detail.spouseGender in SEX_TYPE ? SEX_TYPE[customerDetail.detail.spouseGender] : ''
									}}
								</span>
							</el-form-item>
							<el-form-item label="出生日期">
								<span>{{ customerDetail.detail.spouseBirthday }}</span>
							</el-form-item>
							<el-form-item label="婚姻状况">
								<span>
									{{
										customerDetail.detail.spouseMarital in MARITAL_TYPE
											? MARITAL_TYPE[customerDetail.detail.spouseMarital]
											: ''
									}}
								</span>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="文化程度">
								<span>{{ spouseDictType.spouseEducation }}</span>
							</el-form-item>
							<el-form-item label="民族">
								<span>{{ customerDetail.detail.spouseNation }}</span>
							</el-form-item>
							<el-form-item label="住宅电话">
								<span>{{ customerDetail.detail.spouseHomePhone }}</span>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="邮箱">
								<span>{{ customerDetail.detail.spouseCardEmail }}</span>
							</el-form-item>
							<el-form-item label="邮政编码">
								<span>{{ customerDetail.detail.spousePostcode }}</span>
							</el-form-item>
							<el-form-item label="居住地">
								<span>{{ spouseDictType.spouseLivePlace }}</span>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="所在区域">
								<span>
									<!-- {{ customerDetail.detail.spouseProvince }} {{ customerDetail.detail.spouseCity }}
									{{ customerDetail.detail.spouseDistrict }}-->
									{{ spouseCustomerRegion }}
								</span>
							</el-form-item>
							<el-form-item label="详细地址">
								<span>{{ customerDetail.detail.spouseAddress }}</span>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="职业">
								<span>{{ spouseDictType.spouseProfession }}</span>
							</el-form-item>
							<el-form-item label="消费关注">
								<span>{{ spouseDictType.spouseConsumeFollow }}</span>
							</el-form-item>
						</el-row>
					</el-form>
				</el-card>
				<el-card class="item-gap">
					<h3>紧急联系人</h3>
					<el-form inline label-width="120px" label-suffix=":" class="customer-info">
						<el-row>
							<el-form-item label="姓名">
								<span>{{ customerDetail.detail.emerContactName }}</span>
							</el-form-item>
							<el-form-item label="手机号码">
								<span>{{ customerDetail.detail.emerContactMobile }}</span>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="住宅电话">
								<span>{{ customerDetail.detail.emerContactHomePhone }}</span>
							</el-form-item>
							<el-form-item label="电子邮箱">
								<span>{{ customerDetail.detail.emerContactEmail }}</span>
							</el-form-item>
						</el-row>
					</el-form>
				</el-card>
				<el-card class="item-gap">
					<h3>优惠顾客开卡资料表</h3>
					<el-form inline label-width="180px" label-suffix=":" class="customer-info">
						<el-row>
							<el-form-item label="顾客线下开卡资料表">
								<el-image :src="customerDetail.detail.opencardPositiveUrl" class="img-gap">
									<div slot="error" class="image-slot">暂无图片</div>
								</el-image>
								<el-image :src="customerDetail.detail.opencardReverseUrl">
									<div slot="error" class="image-slot">暂无图片</div>
								</el-image>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="身份证(正卡)">
								<el-image :src="customerDetail.detail.certificatesPositiveUrl" class="img-gap">
									<div slot="error" class="image-slot">暂无图片</div>
								</el-image>
								<el-image :src="customerDetail.detail.certificatesReverseUrl">
									<div slot="error" class="image-slot">暂无图片</div>
								</el-image>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="身份证(副卡)">
								<el-image :src="customerDetail.detail.spouseCertificatesPositiveUrl" class="img-gap">
									<div slot="error" class="image-slot">暂无图片</div>
								</el-image>
								<el-image :src="customerDetail.detail.spouseCertificatesReverseUrl">
									<div slot="error" class="image-slot">暂无图片</div>
								</el-image>
							</el-form-item>
						</el-row>
					</el-form>
				</el-card>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import {
	SEX_TYPE,
	CERTIFICATES_TYPE,
	ORDER_COLUMNS,
	AFTERSELL_COLUMNS,
	CHANGESELL_COLUMNS,
	DISCOUNT_COLUMNS,
	FAVOURITE_COLUMNS,
	SHARE_COLUMNS,
	ACCOUT_STATUS,
	CHANNEL,
	USER_SOURCE,
	CUSTOMER_TYPE,
	MARITAL_TYPE,
	MEMBER_LEVEL_MAX,
} from './config';
import qs from 'querystring';
import citys from 'config/city';
const optionGenerator = options => options.map(({ code: value, name: label }) => ({ label, value }));
// import {formatDateDefault} from "util/formValidation";

export default {
	name: 'businessAndCustomerDetail',
	data() {
		return {
			SEX_TYPE,
			CERTIFICATES_TYPE,
			ORDER_COLUMNS,
			AFTERSELL_COLUMNS,
			CHANGESELL_COLUMNS,
			DISCOUNT_COLUMNS,
			FAVOURITE_COLUMNS,
			SHARE_COLUMNS,
			ACCOUT_STATUS,
			CHANNEL,
			USER_SOURCE,
			CUSTOMER_TYPE,
			MARITAL_TYPE,
			MEMBER_LEVEL_MAX,
			id: '',
			activeTab: 'business',
			isHaveCustomer: false,
			business: {
				activeTab: 'order',
				order: {
					data: [],
					pagination: { currentPage: 1, pageSize: 10 },
					total: 0,
				},
				afterSell: {
					data: [],
					pagination: { currentPage: 1, pageSize: 10 },
					total: 0,
				},
				changeSell: {
					data: [],
					pagination: { currentPage: 1, pageSize: 10 },
					total: 0,
				},
				discount: {
					data: [],
					pagination: {},
					total: 0,
				},
				favourite: {
					data: [],
					pagination: { currentPage: 1, pageSize: 10 },
					total: 0,
				},
				share: {
					data: [],
					pagination: {},
					total: 0,
				},
			},
			detail: {},
			customerDetail: { detail: {} },
			customerRegion: '',
			spouseCustomerRegion: '',
			dictType: {
				education: '',
				livePlace: '',
				consumeFollow: '',
				professionType: '',
			},
			spouseDictType: {
				spouseEducation: '',
				spouseLivePlace: '',
				spouseConsumeFollow: '',
				spouseProfession: '',
			},
		};
	},
	methods: {
		// 分页触发事件
		handleChangePage(currentPage) {
			this.business[this.business.activeTab].pagination.currentPage = currentPage;
			this.handleChildTabChange();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.business[this.business.activeTab].pagination.pageSize = pageSize;
			this.handleChildTabChange();
		},
		// 查看详情
		gotoDetail(type, params) {
			console.log(params);
			switch (type) {
				case 0:
					this.$go('customer_order_detail', { title: '顾客订单详情', orderNo: params });
					break;
				case 1: {
					// 退货路径修改
					const { returnNo } = params;
					this.$go('return_goods_details', { returnNo });
					break;
				}
				case 2: {
					// 换货路径修改
					const { exchangeNo } = params;
					this.$go('exchange_goods_details', { exchangeNo });
					break;
				}
				case 3:
					this.$go('spike_activity', { title: '活动详情', id: params });
					break;
				case 4:
					this.$go('/product_detail', { id: params, title: '查看产品详情' });
					break;
			}
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
		// 查询顾客信息
		async loadUserInfo(memberId) {
			if (!memberId) return;
			const res = await this.$fetch(`/member/api/getMasterMemberInfoByMemberId?memberId=${memberId}`);
			if (res && res.data) {
				this.detail = res.data;
				this.handleChildTabChange();
			} else {
				this.$fetch.warning('查询业务详情失败');
			}
		},
		async loadCustomerInfo() {
			const res = await this.$fetch(`/member/mgmt/getMemberInfoById?id=${this.id}`);
			if (res && res.data) {
				this.customerDetail = res.data;
				let customerPro = this.rewritePlace(
					[res.data.detail.province, res.data.detail.city, res.data.detail.district],
					citys
				);
				// 没数据不显示 //
				this.customerRegion = customerPro.length
					? `${customerPro[0] || ''}/${customerPro[1] || ''}/${customerPro[2] || ''}`
					: null;
				// 配偶地址
				let spouseCustomerPro = this.rewritePlace(
					[res.data.detail.spouseProvince, res.data.detail.spouseCity, res.data.detail.spouseDistrict],
					citys
				);
				// 没数据不显示 //
				this.spouseCustomerRegion = spouseCustomerPro.length
					? `${spouseCustomerPro[0] || ''}/${spouseCustomerPro[1] || ''}/${spouseCustomerPro[2] || ''}`
					: null;
				// 字典
				if (this.customerDetail.detail) {
					this.$nextTick(() => {
						this.loadConfigs();
					});
				}
			} else {
				this.$fetch.warning('查询顾客信息失败');
			}
		},
		// 切换tabs
		handleTabChange() {
			if (this.activeTab === 'business') {
				this.loadUserInfo(this.id);
			} else if (this.activeTab === 'customer') {
				this.loadCustomerInfo();
			}
		},
		// 业务详情下切换tabs
		handleChildTabChange() {
			switch (this.business.activeTab) {
				case 'order':
					this.getOrderDetail();
					break;
				case 'afterSell':
					this.getOrderReturn();
					break;
				case 'changeSell':
					this.getOrderExchange();
					break;
				case 'discount':
					this.getMemberCoupons();
					break;
				case 'favourite':
					this.getMemberFavorite();
					break;
				case 'share':
					this.getPersonShares();
			}
		},
		// 订单详情
		async getOrderDetail() {
			let res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/order/getBusinessOrderList?${qs.stringify(this.loadDataPost)}`,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.business[this.business.activeTab].data = list;
				this.business[this.business.activeTab].total = total;
			}
			this.messageFun('暂无订单数据');
		},
		//退货
		async getOrderReturn() {
			let res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/order/return/getUserOrderReturnList?${qs.stringify(this.loadDataPost)}`,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.business[this.business.activeTab].data = list;
				this.business[this.business.activeTab].total = total;
			}
			this.messageFun('暂无退货数据');
		},
		//换货
		async getOrderExchange() {
			let res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/order/exchange/getUserOrderExchangeList?${qs.stringify(this.loadDataPost)}`,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.business[this.business.activeTab].data = list;
				this.business[this.business.activeTab].total = total;
			}
			this.messageFun('暂无换货数据');
		},
		// 优惠券
		async getMemberCoupons() {
			let res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/prmt/coupon/selectMemberCoupons?${qs.stringify(this.loadDataPost)}`,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.business[this.business.activeTab].data = list;
				this.business[this.business.activeTab].total = total;
			}
			this.messageFun('暂无优惠券数据');
		},

		// 客户收藏
		async getMemberFavorite() {
			let res = await this.$fetch({
				method: 'GET',
				url: `/member/favorite/app/getMemberFavoriteByMember?${qs.stringify(this.loadDataPost)}`,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.business[this.business.activeTab].data = list;
				this.business[this.business.activeTab].total = total;
			}
			this.messageFun('暂无收藏数据');
		},

		// 分享信息
		async getPersonShares() {
			let res = await this.$fetch({
				method: 'GET',
				url: `/member/share/app/personShareInfoList?${qs.stringify(this.loadDataPost)}`,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.business[this.business.activeTab].data = list;
				this.business[this.business.activeTab].total = total;
			}
			this.messageFun('暂无分享数据');
		},

		messageFun(msg) {
			if (!this.business[this.business.activeTab].total) {
				this.$message.warning(msg || '暂无数据');
			}
		},
		// 获取配置字典
		async loadConfigs() {
			const DICT_ARR = ['education', 'live_place', 'consume_follow', 'profession_type'];
			// education-学历  live_place-居住地  consume_follow-消费关注  profession_type-职业
			Promise.all(DICT_ARR.map(type => this.loadDictByType(type)))
				.then(res => {
					if (res && res.length === DICT_ARR.length) {
						const [educationData, livePlaceData, consumeFollowData, professionTypeData] = res.map(dict =>
							optionGenerator(dict)
						);
						let dictData = {
							educationData,
							livePlaceData,
							consumeFollowData,
							professionTypeData,
						};
						this.getDict(1, dictData);
						// 配偶
						if (this.customerDetail.detail.spouseOrNot === 1) {
							this.getDict(2, dictData);
						}
					} else {
						throw new Error('获取字典失败');
					}
				})
				.catch(err => {
					this.$message({
						type: 'error',
						message: typeof err === 'string' ? err : err.message,
					});
				});
		},
		// 获取字典
		async loadDictByType(dictType) {
			if (!dictType) return;
			const res = await this.$fetch(`/crm/lov/getCrmLovListByType?dictType=${dictType}`);
			return res && res.data ? res.data : [];
		},
		// 获取对应字典
		getDict(state, dictData) {
			let paramsDict = {
				education: state === 1 ? this.customerDetail.detail.education : this.customerDetail.detail.spouseEducation,
				livePlace: state === 1 ? this.customerDetail.detail.livePlace : this.customerDetail.detail.spouseLivePlace,
				consumeFollow:
					state === 1 ? this.customerDetail.detail.consumeFollow : this.customerDetail.detail.spouseConsumeFollow,
				professionType:
					state === 1 ? this.customerDetail.detail.profession : this.customerDetail.detail.spouseProfession,
			};
			// 学历
			let education =
					!paramsDict.education ||
					dictData.educationData.find(item => {
						return item.value === paramsDict.education;
					}), // 居住地
				livePlace =
					!paramsDict.livePlace ||
					dictData.livePlaceData.find(item => {
						return item.value === paramsDict.livePlace;
					}), // 职业
				professionType =
					!paramsDict.professionType ||
					dictData.professionTypeData.find(item => {
						return item.value === paramsDict.professionType;
					}),
				consumeFollow = '',
				isConsumeFollow = [];
			if (paramsDict.consumeFollow) {
				consumeFollow = paramsDict.consumeFollow.split(',');
				consumeFollow.map(item => {
					dictData.consumeFollowData.find(items => {
						if (items.value === item && items.label) {
							isConsumeFollow.push(items.label);
							return;
						}
					});
				});
			}
			if (state === 1) {
				setTimeout(() => {
					this.dictType = {
						education: education?.label || '',
						livePlace: livePlace?.label || '',
						consumeFollow: isConsumeFollow.join(','),
						professionType: professionType?.label || '',
					};
				}, 500);
			} else {
				// 配偶
				setTimeout(() => {
					this.spouseDictType = {
						spouseEducation: education?.label || '',
						spouseLivePlace: livePlace?.label || '',
						spouseConsumeFollow: isConsumeFollow.join(','),
						spouseProfession: professionType?.label || '',
					};
				}, 500);
			}
		},
	},

	computed: {
		loadDataPost() {
			const { currentPage, pageSize } = this.business[this.business.activeTab].pagination;
			const { activeTab } = this.business;
			let data = {
				pageNum: currentPage,
				pageSize,
			};
			if (activeTab === 'order') {
				data.currentCard = this.detail.cardNo;
			} else if (activeTab === 'afterSell' || activeTab === 'changeSell') {
				data.userCard = this.detail.cardNo;
			} else if (activeTab === 'favourite' || activeTab === 'discount' || activeTab === 'share') {
				data.memberId = this.id;
			}
			return data;
		},
	},
	mounted() {
		const { id, type, memberType } = this.$route.query;
		this.id = id || '';
		this.activeTab = 'business';
		this.isHaveCustomer = type === 'customer' || memberType === 'customer';
		id && this.loadUserInfo(id);
	},
};
</script>

<style lang="scss" scoped>
h3,
.item-gap {
	margin-bottom: 16px;
}
.img-gap {
	margin-right: 16px;
}
.customer-info span {
	display: inline-block;
	width: 150px;
}
.el-image {
	width: 250px;
}
</style>
