<template>
	<div>
		<guideBar>
			<el-button type="primary" v-permission="'discount_customer_batch_export'" @click="batchExport">
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="DISCOUNT_CUSTOMER_SEARCH" @search="search" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeTab">
				<el-tab-pane v-for="([label, name], $idx) in DISCOUNT_CUSTOMER_TABS_LIST" :key="$idx" :name="name">
					<div slot="label">
						{{ label }}
						<el-popover placement="bottom-start" popper-class="customer-popover" title width="200" trigger="hover">
							<div>
								<div class="text-box" v-for="(item, index) in DISCOUNT_CUSTOMER_TEXT" :key="index">
									<span>{{ item.title }}</span>
									<p>{{ item.content }}</p>
								</div>
							</div>
							<i class="el-icon-question" slot="reference" v-if="label === '全部'"></i>
						</el-popover>
					</div>
					<tableList
						:loading="tabPanel[activeTab].loading"
						:dataSource="tabPanel[activeTab].data"
						:columns="DISCOUNT_CUSTOMER_COLUMNS"
						:pagination="tabPanel[activeTab].pagination"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						:dataTotal="tabPanel[activeTab].pagination.total"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'discount_customer_business_detail'"
								type="text"
								@click="viewDetail(scope.data.memberId)"
							>
								业务详情
							</el-button>
							<el-button
								v-permission="'discount_customer_account_manage|account_management_vip'"
								type="text"
								@click="accountMange(scope.data.memberId)"
							>
								账户管理
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import { timeEndFormat } from 'util';
import {
	CUSTOMER_PURCHASE_TYPE,
	DISCOUNT_CUSTOMER_TABS_LIST,
	DISCOUNT_CUSTOMER_SEARCH,
	DISCOUNT_CUSTOMER_COLUMNS,
	DISCOUNT_COUSTOMER_TYPE,
	DISCOUNT_CUSTOMER_TEXT,
} from './config';
import qs from 'querystring';

export default {
	name: 'discountCustomer',
	data() {
		return {
			DISCOUNT_CUSTOMER_TABS_LIST,
			DISCOUNT_CUSTOMER_SEARCH,
			DISCOUNT_CUSTOMER_COLUMNS,
			DISCOUNT_COUSTOMER_TYPE,
			DISCOUNT_CUSTOMER_TEXT,
			activeTab: 'all',
			searchConfig: {
				memberId: '',
				mobile: '',
				status: '',
				channel: '',
				registrationTime: [],
			},
			tabPanel: {
				all: {
					loading: false,
					data: [],
					pagination: {
						total: 0,
						currentPage: 1,
						pageSize: 20,
					},
				},
				newCustomer: {
					loading: false,
					data: [],
					pagination: {
						total: 0,
						currentPage: 1,
						pageSize: 20,
					},
				},
				notPurchase: {
					loading: false,
					data: [],
					pagination: {
						total: 0,
						currentPage: 1,
						pageSize: 20,
					},
				},
			},
		};
	},
	computed: {
		// 顾客购物类型
		showType() {
			return CUSTOMER_PURCHASE_TYPE[this.activeTab];
		},
		// 搜索参数
		searchFields() {
			const { searchConfig } = this;
			const {
				searchConfig: { registrationTime },
			} = this;
			let isTime =
				registrationTime && registrationTime[0] ? `${registrationTime[0]},${timeEndFormat(registrationTime[1])}` : '';
			return {
				...searchConfig,
				registrationTime: isTime.indexOf(',') !== 0 ? isTime : '',
			};
		},
	},
	watch: {
		showType: {
			immediate: true,
			handler() {
				this.$nextTick(() => {
					this.loadData();
				});
			},
		},
	},
	methods: {
		// 分页触发事件
		handleChangePage(currentPage) {
			this.tabPanel[this.activeTab].pagination.currentPage = currentPage;
			this.loadData();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.tabPanel[this.activeTab].pagination.pageSize = pageSize;
			this.loadData();
		},
		// 搜索
		search() {
			let searchState = '';
			for (let key in this.searchFields) {
				if (!['status'].includes(key) && this.searchFields[key]) {
					searchState = this.searchFields[key];
				}
			}
			// 判断搜索条件
			if (!searchState) {
				let searchTitle = !['null', ''].includes(`${this.searchFields.status}`)
					? '状态不可单独搜索'
					: '搜索条件不能为空';
				this.$message.warning(searchTitle);
				return;
			}
			this.tabPanel[this.activeTab].pagination.currentPage = 1;
			this.loadData();
		},
		// 批量导出
		async batchExport() {
			const { showType, searchConfig } = this;
			let searchInfo = {
				...searchConfig,
				registrationTime: (searchConfig.registrationTime || ['', '']).join(),
				exportChannel: this.searchConfig.channel,
			};
			const params = Object.assign({ showType }, searchInfo);
			// exportExcel('/member/mgmt/exportVipList', params);
			const res = await this.$fetch(`/member/mgmt/exportVipList?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.$message.success('excel表格正在生成中，请在下载管理查看');
			} else {
				this.$message.warning(res.message);
			}
		},
		// 请求顾客列表
		async loadData() {
			const { activeTab, searchFields } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabPanel[activeTab];
			this.tabPanel[activeTab].loading = true;
			// console.log(searchFields);
			const params = {
				showType: DISCOUNT_COUSTOMER_TYPE[this.activeTab],
				pageNum,
				pageSize,
				...searchFields,
			};
			const res = await this.$fetch(`/member/mgmt/getVipList?${qs.stringify(params)}`);

			if (res && res.data) {
				const { list, total } = res.data;
				if (!list.length) {
					this.$message.warning('搜索无数据，请检查查询条件');
				}
				this.tabPanel[activeTab].data = list;
				this.tabPanel[activeTab].pagination.total = total;
			} else {
				this.tabPanel[activeTab].data = [];
				this.tabPanel[activeTab].pagination.total = 0;
				this.$message.warning('搜索无数据，请检查查询条件');
			}
			this.tabPanel[activeTab].loading = false;
		},
		// 查看详情
		viewDetail(id) {
			if (!id) return this.$message.warning('该用户的 memberId 参数无效, 无法查询账户详细信息!');
			this.$go('business_and_customer_detail', { id, type: 'customer' });
		},
		// 账户管理
		accountMange(id) {
			if (!id) return this.$message.warning('该用户的 memberId 参数无效, 无法查询账户详细信息!');
			this.$go('account_management_vip', { id, type: 'customer' });
		},
	},
};
</script>
<style lang="scss" scoped>
.customer-popover {
	.text-box {
		font-size: 14px;
		color: #666666;
		margin-bottom: 24px;
		p {
			margin: 8px 0;
		}
		&:nth-last-child(1) {
			margin-bottom: 0;
		}
	}
}
</style>
