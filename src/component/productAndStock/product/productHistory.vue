<template>
	<div>
		<guideBar />
		<el-card style="margin-bottom: 15px">
			<searchPanel v-model="searchConfig" :config="PRODUCT_HISTORY_SEARCH" @search="resetLoad" />
		</el-card>
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="data"
				:options="options"
				:columns="PRODUCT_HISTORY_COLUMNS"
				:pagination="pagination"
				@loadMore="loadMore"
				:dataTotal="total"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button type="text" @click="viewDetail(scope.data.id)">详情</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { PRODUCT_HISTORY_SEARCH, PRODUCT_HISTORY_COLUMNS } from './config';

export default {
	name: 'productHistory',
	data() {
		return {
			PRODUCT_HISTORY_SEARCH,
			PRODUCT_HISTORY_COLUMNS,
			options: {
				index: true,
				labelIndex: '序号',
			},
			searchConfig: {
				serialNo: '',
				timeRange: ['', ''],
			},
			productId: '',
			loading: false,
			data: [],
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			total: 0,
		};
	},
	computed: {
		// 搜索参数
		searchFields() {
			const {
				searchConfig: { serialNo, timeRange = ['', ''] },
			} = this;
			return {
				serialNo,
				startTime: timeRange[0],
				endTime: timeRange[1],
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
		// 查看详情
		viewDetail(id) {
			if (!id) return this.$message('产品Id 不存在或无效, 无法查看产品详情');
			this.$go('/product_detail', { id, type: 'preview', history: true, title: '查看产品历史日志详情' });
		},
		// 重置
		resetLoad() {
			this.pagination.currentPage = 1;
			this.list = [];
			this.loadData();
		},
		// 查询产品历史日志列表
		async loadData() {
			this.loading = true;
			const {
				productId,
				searchFields,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			const data = {
				pageNum,
				pageSize,
				productId,
				...searchFields,
			};

			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/product/item/listHistoryVersion',
				data,
			});

			if (res && res.data) {
				const { list, total } = res.data;
				this.data = this.data.concat(list);
				this.total = total;
			} else {
				this.data = [];
				this.total = 0;
			}

			this.loading = false;
		},
	},
	mounted() {
		const { productId } = this.$route.query;
		if (productId) {
			this.productId = productId;
			this.resetLoad();
		}
	},
};
</script>
