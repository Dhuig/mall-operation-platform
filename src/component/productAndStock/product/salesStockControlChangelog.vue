<template>
	<div>
		<guideBar />
		<el-card style="margin-bottom: 16px">
			<searchPanel v-model="searchConfig" :config="SALES_CONTROL_CHANGELOG_CONFIG" @search="resetLoad" />
		</el-card>
		<el-card>
			<h3 slot="header">综合信息</h3>
			<el-form
				:model="info"
				inline
				label-position="right"
				label-width="150px"
				label-suffix=":"
				size="small"
				style="margin-bottom: 24px"
				disabled
			>
				<el-row>
					<el-col v-for="([label, key], $idx) in SALES_CONTROL_CHANGELOG_INFO_LIST" :key="$idx" :span="8">
						<el-form-item :label="label">
							<el-input :value="info[key]" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<tableList
				:loading="loading"
				:dataSource="data"
				:columns="SALES_CONTROL_CHANGELOG_COLUMNS"
				:pagination="pagination"
				:dataTotal="total"
				@loadMore="loadMore"
			/>
		</el-card>
	</div>
</template>

<script>
import {
	SALES_CONTROL_CHANGELOG_CONFIG,
	SALES_CONTROL_CHANGELOG_COLUMNS,
	SALES_CONTROL_CHANGELOG_INFO_LIST,
} from './config';
import { timeStartFormat, timeEndFormat } from 'util';

export default {
	name: 'salesStockControlChangelog',
	data() {
		return {
			SALES_CONTROL_CHANGELOG_CONFIG,
			SALES_CONTROL_CHANGELOG_COLUMNS,
			SALES_CONTROL_CHANGELOG_INFO_LIST,
			stockId: '',
			searchConfig: {
				timeRange: ['', ''],
			},
			loading: false,
			data: [],
			info: {
				serialNo: '',
				productTitle: '',
				maxSaleQuota: '',
				restSaleQuota: '',
				companySaleQuota: '',
				storeSaleQuota: '',
			},
			total: 0,
			pagination: {
				currentPage: 1,
				pageSize: 20,
			},
		};
	},
	computed: {
		// 搜索参数
		searchFields() {
			const {
				searchConfig: { timeRange },
			} = this;
			return {
				startTime: timeStartFormat(timeRange[0]) || '',
				endTime: timeEndFormat(timeRange[1]) || '',
			};
		},
	},
	methods: {
		// 下拉刷新
		loadMore() {
			let { currentPage, pageSize } = this.pagination;
			if (currentPage * pageSize >= this.total) {
				return this.$message.warning('没有更多数据');
			}
			this.pagination.currentPage++;
			this.loadData();
		},
		// 重置刷新
		resetLoad() {
			this.pagination.currentPage = 1;
			this.data = [];
			this.loadData();
		},
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
		// 请求库存列表
		async loadData() {
			this.loading = true;
			const {
				stockId,
				searchFields,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			const data = {
				pageNum,
				pageSize,
				stockId,
				...searchFields,
			};

			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/product/stock/listHistory',
				data,
			});
			if (res && res.data) {
				const {
					serialNo,
					productTitle,
					maxSaleQuota,
					restSaleQuota,
					companySaleQuota,
					storeSaleQuota,
					logInfos: { list, total },
				} = res.data;
				this.info = {
					serialNo,
					productTitle,
					maxSaleQuota: maxSaleQuota == '-1' ? '不限量' : maxSaleQuota,
					restSaleQuota,
					companySaleQuota,
					storeSaleQuota,
				};
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
		const { stockId } = this.$route.query;
		this.stockId = stockId;
		this.$nextTick(this.resetLoad);
	},
};
</script>
