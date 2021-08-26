<template>
	<div class="member_pv">
		<guideBar>
			<el-button type="primary" @click="batchExport">批量导出</el-button>
		</guideBar>
		<el-card>
			<el-form inline label-width="120px" label-suffix=":" class="customer-info">
				<el-row class="member_info">
					<el-form-item label="顾客编号">
						<span>{{ pvDetail.memberNo }}</span>
					</el-form-item>
					<el-form-item label="会员卡号">
						<span>
							<span>{{ pvDetail.cardNo }}</span>
						</span>
					</el-form-item>
					<el-form-item label="顾客姓名">
						<span>{{ pvDetail.realname }}</span>
					</el-form-item>
					<el-form-item label="个人累计PV">
						<span>{{ pvDetail.totalPv }}</span>
					</el-form-item>
					<el-form-item label="注册手机号">
						<span>{{ pvDetail.mobile }}</span>
					</el-form-item>
					<el-form-item label="开卡时间">
						<span>{{ pvDetail.openCardTimeStr }}</span>
					</el-form-item>
					<el-form-item label="卡状态">
						<span>{{ pvDetail.cardStatusdesc }}</span>
					</el-form-item>
					<el-form-item label="实时个人PV">
						<span>{{ pvDetail.realTimePv }}</span>
					</el-form-item>
				</el-row>
			</el-form>
			<el-tabs v-model="activeTab">
				<el-tab-pane label="PV流水明细" name="flowDetails">
					<searchPanel
						v-model="flowDetailsSearch"
						:config="PV_FLOW_DETAILS_SEARCH"
						@search="handleSearch"
					/>
					<el-popover placement="top-start" trigger="hover">
						<div v-popover>
							1、个人累计PV：会员开卡以来在油葱商城及油葱健康中发生的个人累计分；
							<br />2、实时个人PV：会员本月在油葱商城及油葱健康中发生的实时个人月累计分；
							<br />3、月个人PV：含商城及上海健康PV，按业绩月份汇总个人月PV累计；
						</div>
						<i slot="reference" class="el-icon-question" />
					</el-popover>&nbsp;备注
					<br />
					<br />
					<tableList
						border
						:dataSource="tabPanel.flowDetails.data"
						:columns="PV_FLOW_DETAILS_COLUMNS"
						:pagination="tabPanel.flowDetails.pagination"
						:dataTotal="tabPanel.flowDetails.pagination.total"
						:loading="tabPanel.flowDetails.loading"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								type="text"
								v-if="infoButtonState(scope.data.operationType)"
								@click="detail(scope.data.orderNo)"
							>详情</el-button>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="月个人PV" name="sameMonth">
					<searchPanel v-model="sameMonthSearch" :config="PV_SAME_MONTH_SEARCH" @search="handleSearch" />
					<el-popover placement="top-start" trigger="hover">
						<div v-popover>
							1、个人累计PV：会员开卡以来在油葱商城及油葱健康中发生的个人累计分；
							<br />2、实时个人PV：会员本月在油葱商城及油葱健康中发生的实时个人月累计分；
							<br />3、月个人PV：含商城及上海健康PV，按业绩月份汇总个人月PV累计；
						</div>
						<i slot="reference" class="el-icon-question" />
					</el-popover>&nbsp;备注
					<br />
					<br />
					<tableList
						border
						:dataSource="tabPanel.sameMonth.data"
						:columns="PV_SAME_MONTH_COLUMNS"
						:pagination="tabPanel.sameMonth.pagination"
						:dataTotal="tabPanel.sameMonth.pagination.total"
						:loading="tabPanel.sameMonth.loading"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
					></tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import { exportExcel } from 'util';
import { PV_FLOW_DETAILS_SEARCH, PV_SAME_MONTH_SEARCH, PV_FLOW_DETAILS_COLUMNS, PV_SAME_MONTH_COLUMNS,OPERATION_STATUS_ALL,OPERATION_STATUS_CORE,OPERATION_STATUS_MALL,OPERATION_STATUS_HEALTHY } from './config';
import qs from 'querystring';
import { formatDateDefault } from 'util/formValidation';
export default {
	name: 'memberPvDetail',
	data() {
		return {
			PV_FLOW_DETAILS_SEARCH,
			PV_SAME_MONTH_SEARCH,
			PV_FLOW_DETAILS_COLUMNS,
			PV_SAME_MONTH_COLUMNS,
			// PV流水明细-搜索条件
			flowDetailsSearch: {
				achievementMonth: PV_FLOW_DETAILS_SEARCH.form,
				pvChangeTime: [],
				channel: '',
				operationType: '',
			},
			sameMonthSearch:{
				personalMonth:[]
			},
			activeTab:'flowDetails',
			pvDetail: {},
			tabPanel:{
				flowDetails: {
					loading:false,
					searchData:{},
					data:[],
					pagination: {
						total: 0,
						currentPage: 1,
						pageSize: 20,
					},
				},
				sameMonth: {
					loading:false,
					searchData:{},
					data:[],
					pagination: {
						total: 0,
						currentPage: 1,
						pageSize: 20,
					},
				}
			},
			memberId:'',
		};
	},
	watch: {
		'flowDetailsSearch.channel'(val) {
			let isOPtions = OPERATION_STATUS_ALL;
			if(val === '1') {// 核心
				isOPtions = OPERATION_STATUS_CORE
			} else if(val === '2'){ // 商城
				isOPtions = OPERATION_STATUS_MALL
			} else if(val === '3'){ // 上海健康
				isOPtions = OPERATION_STATUS_HEALTHY
			}
			this.PV_FLOW_DETAILS_SEARCH.form[3].options = isOPtions
		},
		// 切换刷新接口
		activeTab: {
			handler() {
				// 调用查询回调
				this.handleSearch();
			},
			immediate: true,
		},
	},
	computed: {
		// PV流水明细 搜索参数
		searchFields() {
			const {
				flowDetailsSearch,
				flowDetailsSearch: { achievementMonth, pvChangeTime },
			} = this;
			let isBeginMonth = achievementMonth[0] ?  formatDateDefault(achievementMonth[0]).split('-') : '',
					isEndMonth = achievementMonth[1] ?  formatDateDefault(achievementMonth[1]).split('-') : '';
			const params = {
				memberId: this.memberId,
				...flowDetailsSearch,
				// 业绩月份 
				beginMonth: isBeginMonth[0]+isBeginMonth[1],
				endMonth: isEndMonth[0]+isEndMonth[1],
				// 变更时间
				createStartTimeLong: pvChangeTime[0] || '',
				createEndTimeLong: pvChangeTime[1] + 86399999 || '',
			};
			delete params.achievementMonth;
			delete params.pvChangeTime;
			return params;
		},
	},
	methods: {
		infoButtonState(operationType){
			return ![6,7,8,9].includes(operationType)
		},
		// 第一步：增加滚动到底部时触发的回调函数，并绑定到tabList组件上 例如：<tablist @loadMore="loadMore" />
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
			if(this.activeTab === 'flowDetails'){
					// 会员pv流水
				this.queryMemberPvDetail()
			} else {
				// 当月个人pv列表
				this.queryMemberMonthPv()
			}
		},
		handleChangePage(currentPage) {
			this.tabPanel[this.activeTab].pagination.currentPage = currentPage;
			if(this.activeTab === 'flowDetails'){
					// 会员pv流水
				this.queryMemberPvDetail()
			} else {
				// 当月个人pv列表
				this.queryMemberMonthPv()
			}
		},
		handleSizeChange(pageSize) {
			this.tabPanel[this.activeTab].pagination.pageSize = pageSize;
			if(this.activeTab === 'flowDetails'){
					// 会员pv流水
				this.queryMemberPvDetail()
			} else {
				// 当月个人pv列表
				this.queryMemberMonthPv()
			}
		},
		// 搜索
		handleSearch() {
			if(this.searchFields.beginMonth && this.searchFields.createStartTimeLong){
				this.$message.warning('变更时间和业绩月份不能同时查');
				this.flowDetailsSearch.pvChangeTime = [];
				return
			}
			this.tabPanel[this.activeTab].pagination.currentPage = 1;
			if(this.activeTab === 'flowDetails'){
			this.queryMemberPvDetail()
			} else {
				this.queryMemberMonthPv()
			}
		},
		// 导出
		batchExport() {
			let excelUrl = '',
					excelData = {};
			if(this.activeTab === 'flowDetails'){
				excelUrl = '/crm/member/pv/exportMemberPvDetail';
				excelData = this.tabPanel.flowDetails.searchData
			} else {
				excelUrl = '/crm/member/pv/exportMemberMonthPv'
				excelData = this.tabPanel.sameMonth.searchData;
			}
			exportExcel(excelUrl, excelData);
		},
		// 会员pv流水
		async queryMemberPvDetail(){
			
			if(!this.memberId){
				return;
			}
			const {
				searchFields,
				tabPanel: { flowDetails:{pagination:{currentPage: pageNum, pageSize}} },
			} = this;
			const data = {
				pageNum,
				pageSize,
				...searchFields,
			};
			this.tabPanel.flowDetails.loading = true;
			this.tabPanel.flowDetails.searchData = data;
			const res = await this.$fetch(`/crm/member/pv/queryMemberPvDetail?${qs.stringify(data)}`);
			if (res && res.data) {
				const { list, total } = res.data;
				if (!list.length) {
					this.$message.warning('搜索无数据，请检查查询条件');
				}
				this.tabPanel.flowDetails.data = list;
				this.tabPanel.flowDetails.pagination.total = total;
			} else {
				this.tabPanel.flowDetails.data = [];
				this.tabPanel.flowDetails.pagination.total = 0;
				this.$message.warning('搜索无数据，请检查查询条件');
			}
			this.tabPanel.flowDetails.loading = false;
		},
		// 当月个人pv列表
		async queryMemberMonthPv(){
			const {
				sameMonthSearch:{personalMonth},
				tabPanel: { sameMonth:{pagination:{currentPage: pageNum, pageSize}} },
			} = this;
			// 转化时间
			let isBeginMonth = personalMonth[0] ?  formatDateDefault(personalMonth[0]).split('-') : '',
					isEndMonth = personalMonth[1] ?  formatDateDefault(personalMonth[1]).split('-') : '';
			const data = {
				memberId:this.memberId,
				pageNum,
				pageSize,
				beginMonth: isBeginMonth[0]+isBeginMonth[1],
				endMonth: isEndMonth[0]+isEndMonth[1],
			};
			this.tabPanel.sameMonth.loading = true;
			this.tabPanel.sameMonth.searchData = data;
			const res = await this.$fetch(`/crm/member/pv/queryMemberMonthPv?${qs.stringify(data)}`);
			if (res && res.data) {
				const { list, total } = res.data;
				if (!list.length) {
					this.$message.warning('搜索无数据，请检查查询条件');
				}
				this.tabPanel.sameMonth.data = list;
				this.tabPanel.sameMonth.pagination.total = total;
			} else {
				this.tabPanel.sameMonth.data = [];
				this.tabPanel.sameMonth.pagination.total = 0;
				this.$message.warning('搜索无数据，请检查查询条件');
			}
			this.tabPanel.sameMonth.loading = false;
		},
		// 会员信息
		async memberPv() {
			this.loading = true;
			const res = await this.$fetch(`/crm/member/pv/queryInfoByMemberId?memberId=${this.memberId}`);
			if (res && res.data) {
				this.pvDetail = res.data;
			} else {
				this.$message.warning(res.data.message);
			}
			this.loading = false;
		},
		// 详情
		detail(orderNo) {
			this.$go('customer_order_detail', { title: '顾客订单详情', orderNo });
		},
	},
	mounted() {
		const { id } = this.$route.query;
		this.memberId = id;
		this.$nextTick(() => {
			this.memberPv();
			// 会员pv流水
			this.queryMemberPvDetail()
			// 当月个人pv列表
			// this.queryMemberMonthPv()
		})
	},
};
</script>
<style lang="scss" scoped>
.member_pv {
	.member_info {
		::v-deep.el-form-item {
			width: 260px;
		}
	}
}
</style>