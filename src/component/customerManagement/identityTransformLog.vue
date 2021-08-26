<template>
	<div>
		<guideBar>
			<el-button
				v-permission="'identity_transform_log_batch_export'"
				type="primary"
				@click="batchExport"
			>批量导出</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="IDENTITY_TRANSFORM_SEARCH" @search="search" />
		</el-card>
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="data"
				:columns="IDENTITY_TRANSFORM_COLUMNS"
				:pagination="pagination"
				:dataTotal="total"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			/>
		</el-card>
	</div>
</template>

<script>
import { exportExcel,timeEndFormat } from 'util';
import { IDENTITY_TRANSFORM_SEARCH, IDENTITY_TRANSFORM_COLUMNS } from './config';
import qs from 'querystring';

export default {
	name: 'identityTransformLog',
	data() {
		return {
			IDENTITY_TRANSFORM_SEARCH,
			IDENTITY_TRANSFORM_COLUMNS,
			searchConfig: {
				memberId: '',
				cardNo: '',
				fromMemberType: '',
				toMemberType: '',
				mobile: '',
				conversionTime: '',
			},
			pagination: {
				currentPage: 1,
				pageSize: 20,
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
				searchConfig: { transformType },
				searchConfig: { conversionTime },
			} = this;
			const [fromMemberType, toMemberType] = transformType.split(',') || ['', ''];
			return {
				...searchConfig,
				conversionTime: conversionTime && conversionTime[0] ? `${conversionTime[0]},${timeEndFormat(conversionTime[1])}` : '',
				fromMemberType,
				toMemberType,
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
			const { searchConfig } = this;
			let params = {
				...searchConfig,
				conversionTime: (searchConfig.conversionTime || ['', '']).join(','),
			};
			exportExcel('/member/mgmt/exportConversionLog', params);
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

			const res = await this.$fetch(`/member/mgmt/getConversionLog?${qs.stringify(params)}`);

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
	},
	mounted() {
		this.$nextTick(this.loadData);
	},
};
</script>
