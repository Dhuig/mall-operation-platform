<template>
	<div class="platform-activeCenter_couponHandDetail-wrap">
		<el-card>
			<searchPanel ref="searchPanel" v-model="searchModel" :config="DONATE_STORE_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				:options="options"
				:dataSource="dataSource"
				:columns="DONATE_STORE_COLUMNS"
				:pagination="pagination"
				:dataTotal="pagination.total"
				:loading="loading"
				@handleSelectionChange="handleSelectionChange"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot="content_context">
					<div class="list-text">已转赠的优惠券不可撤销，仅可撤销未转赠的优惠券。撤销行为可以多次触发。</div>
					<el-button type="primary" class="detail-export" @click="detailExport">导 出</el-button>
				</template>
				<template slot-scope="scope">
					<el-button type="text" v-if="pageData.state == 3" @click="revoke(scope.data)">撤销</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { DONATE_STORE_CONFIG, DONATE_STORE_COLUMNS } from '../config.js';
import { exportExcel } from 'util';
import qs from 'querystring';
export default {
	props: {
		pageData: {
			type: Object,
			default: () => {},
		},
	},
	name: 'donateStore',
	components: {},
	data() {
		return {
			options: {
				operatesWidth: 80,
			},
			DONATE_STORE_COLUMNS,
			DONATE_STORE_CONFIG,
			searchModel: {
				code: null,
				leaderNo: null,
				shopkeeperNo: null,
			},
			loading: false,
			dataSource: [],
			pagination: {
				total: 0,
				currentPage: 1,
				pageSize: 10,
			},
		};
	},
	methods: {
		detailExport() {
			let { currentPage: pageNum, pageSize } = this.pagination;
			let grantId = this.$route.query.id;
			let params = { pageNum, pageSize, grantId, ...this.searchModel };
			exportExcel(`/mgmt/prmt/couponTransfer/exportCouponStore`, params);
		},
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
		},
		async loadData() {
			let { currentPage: pageNum, pageSize } = this.pagination;
			let grantId = this.$route.query.id;
			let params = { pageNum, pageSize, grantId, ...this.searchModel };
			const res = await this.$fetch(`/mgmt/prmt/couponTransfer/getCouponStorePage?${qs.stringify(params)}`);
			if (res && res.code == 200) {
				this.dataSource = res.data.list;
				this.pagination.total = res.data.total;
			}
		},
		revoke({ id }) {
			this.$confirm('确定撤销?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/prmt/couponTransfer/revokeCoupon',
					data: { id },
				});
				if (res.code === 200) {
					this.$message.success(res.message);
					this.handleSearch();
				}
			});
		},
		// 翻页操作
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 切换页面条数
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.loadData();
		},
		handleSelectionChange(e) {
			this.ids = e.map(e => e.id);
		},
	},
};
</script>
<style lang="scss" scoped>
.list-text {
	color: $color-hit;
	padding-top: 10px;
	padding-bottom: 20px;
	float: left;
}
.detail-export {
	float: right;
}
</style>
