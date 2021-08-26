<template>
	<div>
		<guideBar>
			<el-button type="primary" v-permission="'perfect_home_clean_personnel_exportExcel'" @click="batchExport">
				导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="CLEAN_PERSONNEL_SEARCH" @search="handleSearch" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeTab">
				<el-tab-pane :label="item.label" :name="item.value" v-for="(item, key) in tabPane" :key="key">
					<tableList
						:loading="tabData[activeTab].loading"
						:dataSource="tabData[activeTab].data"
						:columns="dataState[activeTab]"
						:pagination="tabData[activeTab].pagination"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						:dataTotal="tabData[activeTab].pagination.total"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								type="text"
								v-permission="'perfect_home_clean_personnel_detail|clean_personnel_detail'"
								@click="detail(scope.data)"
							>
								详情
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import { exportExcel } from 'util';
import {
	CLEAN_PERSONNEL_SEARCH,
	CLEAN_PERSONNEL_ALL_COLUMNS,
	CLEAN_PERSONNEL_REVIEWED_COLUMNS,
	CLEAN_PERSONNEL_PENDING_COLUMNS,
	CLEAN_PERSONNEL_REJECTED_COLUMNS,
	BANKCARD_STATUS,
	CLEAN_PERSONNEL_STATUS_MAP,
	TAB_PANE,
} from './config';
import qs from 'querystring';
import { formatDateDefault } from 'util/formValidation';

export default {
	name: 'cleanPersonnelList',
	data() {
		return {
			CLEAN_PERSONNEL_SEARCH,
			CLEAN_PERSONNEL_ALL_COLUMNS,
			BANKCARD_STATUS,
			// CLEAN_PERSONNEL_COLUMNS: CLEAN_PERSONNEL_REVIEWED_COLUMNS,
			activeTab: 'all',
			searchConfig: {
				accCleanerStatus: 1, // -1：已驳回 0：待审核（默认）1：审核通过
				cardNo: '',
				cleanerMobile: '',
				cleanerName: '',
				applicantStartTime: '',
				applicantEndTime: '',
				checkStartTime: '',
				checkEndTime: '',
				applicantTime: CLEAN_PERSONNEL_SEARCH.form[3].value,
				checkTime: CLEAN_PERSONNEL_SEARCH.form[4].value,
			},
			dataState: {
				all: CLEAN_PERSONNEL_ALL_COLUMNS,
				approved: CLEAN_PERSONNEL_REVIEWED_COLUMNS,
				pending: CLEAN_PERSONNEL_PENDING_COLUMNS,
				reject: CLEAN_PERSONNEL_REJECTED_COLUMNS,
			},
			tabPane: TAB_PANE,
			tabData: {
				all: {
					loading: false,
					data: [],
					pagination: {
						total: 0,
						currentPage: 1,
						pageSize: 20,
					},
				},
				approved: {
					loading: false,
					data: [],
					pagination: {
						total: 0,
						currentPage: 1,
						pageSize: 20,
					},
				},
				pending: {
					loading: false,
					data: [],
					pagination: {
						total: 0,
						currentPage: 1,
						pageSize: 20,
					},
				},
				reject: {
					loading: false,
					data: [],
					pagination: {
						total: 0,
						currentPage: 1,
						pageSize: 20,
					},
				},
			},
			// end
		};
	},
	computed: {
		// 清洗人员状态
		status() {
			return CLEAN_PERSONNEL_STATUS_MAP[this.activeTab];
		},
		// 搜索参数
		searchFields() {
			const {
				searchConfig,
				searchConfig: { applicantTime, checkTime },
			} = this;
			const params = {
				...searchConfig,
				applicantStartTime: applicantTime[0] ? formatDateDefault(applicantTime[0]) : '',
				applicantEndTime: applicantTime[1] ? formatDateDefault(applicantTime[1]) : '',
				checkStartTime: checkTime[0] ? formatDateDefault(checkTime[0]) : '',
				checkEndTime: checkTime[1] ? formatDateDefault(checkTime[1]) : '',
			};
			delete params.applicantTime;
			delete params.checkTime;
			return params;
		},
	},
	watch: {
		status() {
			this.loadData();
		},
	},
	methods: {
		// 分页触发事件
		handleChangePage(currentPage) {
			this.tabData[this.activeTab].pagination.currentPage = currentPage;
			this.loadData();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.tabData[this.activeTab].pagination.pageSize = pageSize;
			this.loadData();
		},
		// 搜索
		handleSearch() {
			this.tabData[this.activeTab].pagination.currentPage = 1;
			this.loadData();
		},
		// 批量导出
		batchExport() {
			const { searchFields } = this;
			console.log(searchFields);
			exportExcel('/mgmt/acc/cleaner/export', searchFields);
		},
		// 查看详情
		detail(info) {
			let title = `清洗人员详情-${BANKCARD_STATUS[info.accCleanerStatus]}`;
			this.$go('clean_personnel_detail', { id: info.id, title });
		},
		// 请求清洗人员列表
		async loadData() {
			const { activeTab, status, searchFields } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabData[activeTab];
			this.tabData[activeTab].loading = true;
			this.searchFields.accCleanerStatus = status;
			const params = {
				pageNum,
				pageSize,
				...searchFields,
			};
			// const res = await this.$fetch({
			// 	method: 'GET',
			// 	url: `/mgmt/acc/cleaner/list`,
			// 	data,
			// });
			const res = await this.$fetch(`/mgmt/acc/cleaner/page?${qs.stringify(params)}`);
			if (res && res.data) {
				const { list, total } = res.data;
				if (!list) {
					this.$message.warning('搜索无数据，请检查查询条件');
				}
				this.tabData[activeTab].data = list;
				this.tabData[activeTab].pagination.total = total;
			} else {
				this.tabData[activeTab].data = [];
				this.tabData[activeTab].pagination.total = 0;
				this.$message.warning('搜索无数据，请检查查询条件');
			}
			this.tabData[activeTab].loading = false;
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.loadData();
		});
		this.$listen('CLEAN_PERSONNEL_LIST', this.loadData);
	},
};
</script>
<style lang="scss" scoped>
.upload-gap {
	margin: 0 8px;
}
::v-deep .el-upload-list {
	width: 0 !important;
	height: 0 !important;
	border: 1px solid transparent !important;
	overflow: hidden !important;
}
</style>
