<template>
	<div>
		<guideBar>
			<el-button v-permission="'customer_data_modify_log_batch_export'" type="primary" @click="batchExport">
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="CUSTOMER_DATA_MODIFY_SEARCH" @search="search" />
		</el-card>
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="data"
				:columns="CUSTOMER_DATA_MODIFY_COLUMNS"
				:pagination="pagination"
				:dataTotal="total"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button v-permission="'customer_data_modify_log_detail'" type="text" @click="viewDetail(scope.data)">
						详情
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { exportExcel, timeEndFormat } from 'util';
import { CUSTOMER_DATA_MODIFY_SEARCH, CUSTOMER_DATA_MODIFY_COLUMNS } from './config';
// import qs from 'querystring';

export default {
	name: 'customerDataModifyLog',
	data() {
		return {
			CUSTOMER_DATA_MODIFY_SEARCH,
			CUSTOMER_DATA_MODIFY_COLUMNS,
			searchConfig: {
				cardNo: '',
				userName: '',
				mobile: '',
				operatorNo: '',
				operatorName: '',
				platform: '',
				type: '',
				modifyTime: '',
			},
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			total: 0,
			loading: false,
			data: [],
		};
	},
	computed: {
		// 搜索参数
		searchFields() {
			const {
				searchConfig,
				searchConfig: { modifyTime },
			} = this;
			// const [fromMemberType, toMemberType] = transformType.split(',') || ['', ''];
			console.log(modifyTime);
			return {
				...searchConfig,
				startTime: modifyTime && modifyTime[0] ? timeEndFormat(modifyTime[0]) - 86399999 : '',
				endTime: modifyTime && modifyTime[1] ? timeEndFormat(modifyTime[1]) : '',
			};
		},
	},
	methods: {
		// 分页触发事件
		handleChangePage(currentPage) {
			this.pagination.currentPage = currentPage;
			this.loadData();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.loadData();
		},
		// 搜索
		search() {
			this.pagination.currentPage = 1;
			this.loadData();
		},
		// 批量导出
		batchExport() {
			// const { searchFields } = this;
			let params = this.searchFields;
			delete params.modifyTime;
			console.log(params);
			exportExcel('/member/memberUpdateLog/importData', params);
		},
		// 请求转换列表
		async loadData() {
			this.loading = true;
			const {
				searchFields,
				pagination: { currentPage: pageNum, pageSize },
			} = this;

			const params = {
				pageNum,
				pageSize,
				...searchFields,
			};
			delete params.modifyTime;

			// const res = await this.$fetch(`/member/memberUpdateLog/list?${qs.stringify(params)}`);
			const res = await this.$fetch({
				method: 'post',
				url: '/member/memberUpdateLog/list',
				data: params,
			});

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
			}
			this.loading = false;
		},
		// 查看详情
		viewDetail({ id }) {
			this.$go('customer_data_modify_detail', { id });
		},
	},
	mounted() {
		this.$nextTick(this.loadData);
	},
};
</script>
