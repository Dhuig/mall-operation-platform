<template>
	<div>
		<guideBar>
			<el-button v-permission="'owning_list_export'" type="primary" @click="batchExport">导出EXCEL</el-button>
		</guideBar>
		<el-card>
			<searchPanel :config="OWNING_LIST_CONFIG" :showReset="false" v-model="searchConfig" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				border
				:dataSource="dataSource"
				:columns="OWNING_LIST_COLUMNS"
				:pagination="pagination"
				:dataTotal="total"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="row">
					<el-button v-permission="'owning_list_detail|owning_detail'" type="text" @click="handleDetail(row.data)">
						详情
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>
<script>
import { OWNING_LIST_CONFIG, OWNING_LIST_COLUMNS } from './config';
import qs from 'querystring';
import { exportExcel } from 'util';

export default {
	name: 'owningList',
	data() {
		return {
			OWNING_LIST_CONFIG,
			OWNING_LIST_COLUMNS,
			loading: false,
			searchConfig: {
				storeCode: '',
				productCode: '',
			},
			dataSource: [],
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			total: 0,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
		};
	},
	methods: {
		// 导出
		batchExport() {
			const {
				pagination: { currentPage: pageNum, pageSize },
				searchConfig,
			} = this;

			const params = {
				pageNum,
				pageSize,
				...searchConfig,
			};
			exportExcel('/mgmt/inventory/order/exportNoDeliver', params);
		},
		// 分页触发事件
		handleChangePage(val) {
			this.pagination.currentPage = val;
			this.getList();
		},
		// 分页下拉触发事件
		handleSizeChange(val) {
			this.pagination.pageSize = val;
			this.getList();
		},
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.getList();
		},
		handleDetail(row) {
			this.$go('owning_detail', { title: '押货单详情', id: row.id, type: 'detail' });
		},
		// 请求数据
		async getList() {
			this.loading = true;
			const {
				pagination: { currentPage: pageNum, pageSize },
				searchConfig,
			} = this;

			const params = {
				pageNum,
				pageSize,
				...searchConfig,
			};
			const res = await this.$fetch(`/mgmt/inventory/order/listNotDeliverProduct?${qs.stringify(params)}`);

			if (res.code === 200) {
				const { list, total } = res.data;
				this.dataSource = list;
				this.total = total;
			} else {
				this.dataSource = [];
				this.total = 0;
			}
			this.loading = false;
		},
	},
	created() {
		this.getList();
	},
};
</script>
