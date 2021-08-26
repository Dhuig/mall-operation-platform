<template>
	<div>
		<guideBar>
			<el-button v-permission="'normal_customer_allocation'" @click="allocateByHand" icon="el-icon-thumb">
				手工分配
			</el-button>
			<el-button
				v-permission="'normal_customer_sharer_changelog_inquiry'"
				@click="viewSharerLogList"
				icon="el-icon-thumb"
			>
				分享人日志查询
			</el-button>
			<el-button
				v-permission="'normal_customer_batch_export'"
				type="primary"
				@click="batchExport"
				icon="el-icon-download"
			>
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="NORMAL_CUSTOMER_SEARCH" :showExpand="true" @search="search" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeTab">
				<el-tab-pane v-for="([label, name], $idx) in NORMAL_CUSTOMER_TABS_LIST" :key="$idx" :name="name">
					<div slot="label">
						{{ label }}
						<el-popover placement="bottom-start" popper-class="customer-popover" title width="200" trigger="hover">
							<div>
								<div class="text-box" v-for="(item, index) in NORMAL_CUSTOMER_TEXT" :key="index">
									<span>{{ item.title }}</span>
									<p>{{ item.content }}</p>
								</div>
							</div>
							<i class="el-icon-question" slot="reference" v-if="label === '全部'"></i>
						</el-popover>
					</div>
					<tableList
						:options="options"
						:loading="tabPanel[activeTab].loading"
						:dataSource="tabPanel[activeTab].data"
						:columns="NORMAL_CUSTOMER_COLUMNS"
						:pagination="tabPanel[activeTab].pagination"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						@handleSelectionChange="handleSelectionChange"
						:dataTotal="tabPanel[activeTab].pagination.total"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button v-permission="'normal_customer_bussiness_detail'" type="text" @click="viewDetail(scope.data)">
								业务详情
							</el-button>
							<el-button
								v-permission="'normal_customer_account_manage|account_management_normal'"
								type="text"
								@click="accountMange(scope.data)"
							>
								账户管理
							</el-button>
							<el-button
								type="text"
								v-permission="'normal_customer_follow_status'"
								v-if="scope.data.changeType == 1 || scope.data.changeType == 2"
								@click="viewFollowStatus(scope.data.id)"
							>
								跟进情况
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 手工分配模态框 -->
		<el-dialog title="手工分配" :visible.sync="allocation.show" width="50%" v-drag>
			<el-input v-model="allocation.keyword" placeholder="请输入卡号" size="small" clearable>
				<el-button icon="el-icon-search" slot="append" @click="searchAllocation" />
			</el-input>
			<el-divider>客户信息</el-divider>
			<el-table :data="allocation.data">
				<el-table-column prop="cardNo" label="会员卡号" />
				<el-table-column prop="realname" label="姓名" />
				<el-table-column prop="certificatesNo" label="身份证号" />
				<el-table-column prop="sharerMemberNum" label="分配顾客数(累计)" width="150" />
				<el-table-column prop="sharerChangeNum" label="已转化顾客数(累计)" width="150" />
				<el-table-column prop="conversionRate" label="转化率" />
			</el-table>
			<span slot="footer">
				<el-button @click="cancelAllocation">退 出</el-button>
				<el-button type="primary" @click="confirmAllocation" :disabled="!memberIds.length">确定</el-button>
			</span>
		</el-dialog>
		<!-- 跟进情况模态框 -->
		<el-dialog title="跟进情况" :visible.sync="followStatus.show" width="35%" v-drag>
			<el-table :data="followStatus.data">
				<el-table-column prop="memberNumber" label="顾客编号" />
				<el-table-column prop="realname" label="顾客姓名" />
				<el-table-column prop="allotType" label="分配类型">
					<span slot-scope="scope">
						{{ scope.row.allotType in ALLOCATION_TYPE ? ALLOCATION_TYPE[scope.row.allotType] : '' }}
					</span>
				</el-table-column>
				<el-table-column prop="allotTime" label="分配时间" width="250">
					<span slot-scope="scope">{{ scope.row.allotTime | timestampFormat }}</span>
				</el-table-column>
				<el-table-column prop="changeType" label="转化分配情况" width="120">
					<span slot-scope="scope">
						{{ scope.row.changeType in TRANSFORM_STATUS ? TRANSFORM_STATUS[scope.row.changeType] : '' }}
					</span>
				</el-table-column>
			</el-table>
			<span slot="footer">
				<el-button type="primary" @click="followStatus.show = false">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { timeEndFormat } from 'util';
// import { resData } from 'util/formValidation.js';
import {
	ALLOCATION_TYPE,
	TRANSFORM_STATUS,
	CUSTOMER_PURCHASE_TYPE,
	NORMAL_CUSTOMER_TABS_LIST,
	NORMAL_CUSTOMER_SEARCH,
	NORMAL_CUSTOMER_COLUMNS,
	NORMAL_CUSTOMER_TEXT,
} from './config';
import qs from 'querystring';

export default {
	name: 'normalCustomer',
	data() {
		return {
			ALLOCATION_TYPE,
			TRANSFORM_STATUS,
			NORMAL_CUSTOMER_TABS_LIST,
			NORMAL_CUSTOMER_SEARCH,
			NORMAL_CUSTOMER_COLUMNS,
			NORMAL_CUSTOMER_TEXT,
			activeTab: 'all',
			options: {
				label: '全部',
				index: false,
				selection: true,
				labelIndex: '序号',
			},
			searchConfig: {
				memberId: '',
				cardNo: '',
				realname: '',
				channel: '',
				mobile: '',
				// status: '',
				memberStatus: '',
				changeType: '',
				sharerCardNo: '',
				registrationTime: NORMAL_CUSTOMER_SEARCH.form[8].value,
				userSource: '',
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
			allocation: {
				show: false,
				keyword: '',
				data: [],
			},
			memberIds: [],
			followStatus: {
				show: false,
				data: [],
			},
			activeTabState: 0,
		};
	},
	computed: {
		// 顾客购物类型
		showType() {
			return CUSTOMER_PURCHASE_TYPE[this.activeTab];
		},
		// 搜索参数
		searchFields() {
			const {
				searchConfig,
				searchConfig: { registrationTime },
			} = this;
			return {
				...searchConfig,
				createStartTimeLong: registrationTime[0] || '',
				createEndTimeLong: timeEndFormat(registrationTime[1]) || '',
			};
		},
	},
	watch: {
		showType: {
			immediate: true,
			handler() {
				this.$nextTick(() => {
					this.loadData('isTab');
				});
			},
		},
	},
	methods: {
		// 列表下拉加载数据
		loadMore() {
			// 解构当前选项卡下的页码、页码条数、数据总条数
			let { currentPage, pageSize, total } = this.tabPanel[this.activeTab].pagination;
			// 计算数据是否加载完必，是则reuten并提示
			if (currentPage * pageSize >= total) {
				return this.$message.warning('没有更多数据');
			}
			// 否则当前选项卡的页码自增1
			this.tabPanel[this.activeTab].pagination.currentPage++;
			// 加载数据
			this.loadData();
		},

		// 请求顾客列表
		async loadData(status) {
			const { activeTab, showType, searchFields } = this;
			// 判断处理 每次请求是否带有查询条件，是则重置当前选项卡页码，否则不做处理
			// 注意：该循环逻辑必须在解构 this.tabPanel[activeStatusTab]之前
			//  && key !== 'promotionType' 是可选的，过滤默认传入请求的数据字段，避免滚动加载时触发重置页码
			// for (const key in searchFields) {
			// 	if (searchFields[key] && !['registrationTime','createStartTimeLong','createEndTimeLong'].includes(key)) {
			// 		this.tabPanel[this.activeTab].pagination.currentPage = 1;
			// 	}
			// }
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabPanel[activeTab];
			// 处理页码大于1并且处于选项卡切换则不触发请求
			// 注意：pageNum是解构后的pageNum status是判断是否是选项卡切换
			// if (pageNum > 1 && status) return;
			console.log(status);

			this.tabPanel[activeTab].loading = true;
			const data = {
				pageNum,
				pageSize,
				...showType,
				...searchFields,
			};
			// console.log(data);
			const res = await this.$fetch({
				method: 'POST',
				url: '/crm/bmember/getMemberPage',
				data,
			});

			if (res && res.data) {
				const { list, total } = res.data;
				// if (!list.length) {
				// 	this.$message.warning('搜索无数据，请检查查询条件');
				// }
				// pageNum为1的时候重新覆盖当前选项卡数据；pageNum大于1执行concat拼接数据达到加载
				// this.tabPanel[activeTab].data =
				// 	pageNum === 1 ? list : this.tabPanel[activeTab].data.concat(resData(list));
				this.tabPanel[activeTab].data = list;
				this.tabPanel[activeTab].pagination.total = total;
			} else {
				this.tabPanel[activeTab].data = [];
				this.tabPanel[activeTab].pagination.total = 0;
			}
			this.tabPanel[activeTab].loading = false;
		},
		transformType(memberType) {
			return /2|3|4/.test(memberType) ? 'customer' : 'business';
		},
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
				if (!['memberStatus', 'registrationTime'].includes(key) && this.searchFields[key]) {
					searchState = this.searchFields[key];
				}
			}
			// 判断搜索条件
			if (!searchState) {
				let searchTitle = !['null', ''].includes(`${this.searchFields.memberStatus}`)
					? '状态不可单独搜索'
					: '搜索条件不能为空';
				this.$message.warning(searchTitle);
				return;
			}

			this.tabPanel[this.activeTab].pagination.currentPage = 1;
			this.loadData();
		},
		// 复选回调
		handleSelectionChange(selection) {
			this.memberIds = selection.map(({ id }) => id);
		},
		// 批量导出
		async batchExport() {
			const { showType, searchFields } = this;
			const params = { ...showType, ...searchFields, exportChannel: this.searchConfig.channel };
			console.log(params);
			// exportExcel('/crm/bmember/exportMember', params);
			const res = await this.$fetch(`/crm/bmember/exportMember?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.$message.success('excel表格正在生成中，请在下载管理查看');
			} else {
				this.$message.warning(res.message);
			}
		},
		// 手工分配
		allocateByHand() {
			this.allocation = {
				show: true,
				data: [],
			};
		},
		// 查询分享人日志
		viewSharerLogList() {
			this.$go('sharer_log_list');
		},
		// 搜索分配情况
		searchAllocation() {
			const {
				allocation: { keyword },
			} = this;
			if (!keyword) return this.$message('请输入正确的卡号后再搜索');
			this.searchCustomerInfoByCardNo(keyword);
		},
		// 取消手工分配
		cancelAllocation() {
			this.allocation.show = false;
		},
		// 确认手工分配
		confirmAllocation() {
			const {
				memberIds,
				allocation: { keyword: shareCardNo },
			} = this;
			if (!memberIds.length) return this.$message('请选择至少一名顾客后再进行手工分配操作');

			const params = {
				memberIds: memberIds.join(','),
				shareCardNo,
			};
			this.updateBatchManualAllot(params);
		},

		// 请求跟进情况
		async loadFollowStatus(memberId) {
			if (!memberId) return;
			const res = await this.$fetch(`/crm/bmember/getFollowCase?memberId=${memberId}`);
			if (res && res.data) {
				this.followStatus.data = [res.data] || [];
			} else {
				this.$message.warning('暂时搜索不到此用户的跟进情况数据');
			}
		},
		// 根据卡号查询客户信息
		async searchCustomerInfoByCardNo(cardNo) {
			if (!cardNo) return;
			const res = await this.$fetch({
				method: 'POST',
				url: `/crm/bmember/getShareMemberInfo?cardNo=${cardNo}`,
			});
			if (res && res.code === 200) {
				const { id, cardNo, certificatesNo, conversionRate, memberId, realname, sharerChangeNum, sharerMemberNum } =
					res.data;
				this.allocation.data = [
					{
						id,
						cardNo,
						memberId,
						realname,
						certificatesNo,
						conversionRate,
						sharerChangeNum,
						sharerMemberNum,
					},
				];
			} else {
				this.$message.warning('搜索无数据，请检查查询卡号是否为有效会员卡');
			}
		},
		// 手工分配
		async updateBatchManualAllot(params) {
			if (!params) return;
			const res = await this.$fetch(`/crm/bmember/updateBatchManualAllot?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.$nextTick(() => {
					this.allocation.show = false;
					this.loadData();
				});
			} else {
				this.$message({
					type: 'error',
					message: '执行手工分配操作失败',
				});
			}
		},
		// 查看详情
		viewDetail({ id, memberType }) {
			if (!id) return this.$message.warning('该用户的 memberId 参数无效, 无法查询账户详细信息!');
			this.$go('business_and_customer_detail', { id, type: this.transformType(memberType) });
		},
		// 账户管理
		accountMange({ id, memberType }) {
			if (!id) return this.$message.warning('该用户的 memberId 参数无效, 无法查询账户详细信息!');
			this.$go('account_management_normal', { id, type: this.transformType(memberType) });
		},
		// 跟进情况
		viewFollowStatus(id) {
			this.followStatus.show = true;
			this.loadFollowStatus(id);
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
