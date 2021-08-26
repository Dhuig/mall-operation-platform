<template>
	<div>
		<guideBar>
			<el-button type="primary" @click="batchExport">批量导出</el-button>
		</guideBar>
		<el-card>
			<searchPanel
				v-model="searchConfig"
				:config="MEMBER_PV_SEARCH"
				@search="handleSearch"
				@reset="loadData"
			/>
			<el-popover placement="top-start" trigger="hover">
				<div v-popover>
					1、个人累计PV：会员开卡以来在油葱商城及油葱健康中发生的个人累计分；
					<br />2、实时个人PV：会员本月在油葱商城及油葱健康中发生的实时个人月累计分；
					<br />3、月个人PV：含商城及上海健康PV，按业绩月份汇总个人月PV累计
				</div>
				<i slot="reference" class="el-icon-question" />
			</el-popover>&nbsp;备注
		</el-card>
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="data"
				:columns="MEMBER_PV_LIST_COLUMNS"
				:pagination="pagination"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				:dataTotal="total"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button type="text" @click="detail(scope.data.id)">详情</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { exportExcel } from 'util';
import { MEMBER_PV_SEARCH, MEMBER_PV_LIST_COLUMNS } from './config';
import qs from 'querystring';
export default {
	name: 'memberPvList',
	data() {
		return {
			MEMBER_PV_SEARCH,
			MEMBER_PV_LIST_COLUMNS,
			searchConfig: {
				memberNo: '',
				cardNo: '',
				realname: '',
				mobile: '',
				openCardTime: [],
			},
			loading: false,
			data: [],
			pagination: {
				currentPage: 1,
				pageSize: 20,
			},
			tableRef: '', // 继承表格组件的ref标识
			selection: [], // 勾选的数据
			total: 0,
		};
	},
	computed: {
		// 搜索参数
		searchFields() {
			const {
				searchConfig,
				searchConfig: { openCardTime = ['', ''] },
			} = this;
			const params = {
				...searchConfig,
				openCardStartTimeLong: openCardTime[0] || '',
				openCardEndTimeLong: openCardTime[1] + 86399999 || '',
			};
			delete params.openCardTime;
			return params;
		},
	},
	methods: {
		handleChangePage(currentPage) {
			this.pagination.currentPage = currentPage;
			this.loadData();
		},
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.loadData();
		},
		// 搜索
		handleSearch() {
			this.data = [];
			this.pagination.currentPage = 1;
			this.loadData();
		},
		batchExport() {
			const {
				searchFields,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			const searchData = {
				pageNum,
				pageSize,
				...searchFields,
			};
			exportExcel('/crm/member/pv/exportMemberCardNoPv', searchData);
		},
		async loadData() {
			const {
				searchFields,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			const data = {
				pageNum,
				pageSize,
				...searchFields,
			};
			this.loading = true;

			const res = await this.$fetch(`/crm/member/pv/queryMemberCardNoPv?${qs.stringify(data)}`);

			if (res && res.data) {
				const { list, total } = res.data;
				if (!list.length) {
					this.$message.warning('搜索无数据，请检查查询条件');
				}
				this.data = list;
				this.total = total;
			} else {
				this.data = [];
				this.total = 0;
				this.$message.warning('搜索无数据，请检查查询条件');
			}
			this.loading = false;
		},
		// 详情
		detail(id) {
			this.$go('member_pv_detail', { id });
		},
	},
	mounted() {
		this.$nextTick(this.loadData);
	},
};
</script>
