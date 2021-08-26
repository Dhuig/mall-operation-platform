<template>
	<div class="pledged-refund-payment-detail">
		<guideBar />
		<el-card class="base-info">
			<div>综合信息</div>
			<el-form :model="baseInfo" label-width="150px" label-suffix=":">
				<el-row>
					<el-col :span="6" v-for="(item, index) in PLEDGED_PAYMENT_DETAIL_BASEINFO_LIST" :key="index">
						<el-form-item :label="item.label" v-if="item.formatter">
							<span v-html="item.formatter(baseInfo)"></span>
						</el-form-item>
						<el-form-item :label="item.label" v-else>{{ baseInfo[item.prop] || '' }}</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<el-card>
			<searchPanel v-model="searchConfig" :config="PLEDGED_PAYMENT_DETAIL_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="list"
				:columns="PLEDGED_PAYMENT_DETAIL_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="{ index: true, labelIndex: '序号' }"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			>
				<template v-slot:content_context>
					<div class="mb8">款项金额合计：￥{{ totalMoney }}</div>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import {
	PLEDGED_PAYMENT_DETAIL_SEARCH_CONFIG,
	PLEDGED_PAYMENT_DETAIL_BASEINFO_LIST,
	PLEDGED_PAYMENT_DETAIL_COLUMNS_CONFIG,
} from './config';
export default {
	name: 'pledgedRefundPaymentDetail',
	data() {
		return {
			PLEDGED_PAYMENT_DETAIL_SEARCH_CONFIG,
			PLEDGED_PAYMENT_DETAIL_BASEINFO_LIST,
			PLEDGED_PAYMENT_DETAIL_COLUMNS_CONFIG,
			searchConfig: {},
			baseInfo: {},
			loading: false,
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
			list: [],
			totalMoney: 0,
		};
	},
	computed: {
		loadDataPost() {
			const {
				searchConfig,
				pagination: { currentPage: pageNum, pageSize },
				baseInfo: { storeCode, month },
			} = this;
			let data = {
				storeCode,
				month,
				...searchConfig,
				pageNum,
				pageSize,
			};
			return data;
		},
	},
	methods: {
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
		},
		// 翻页操作
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 切换单页条数
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 获取列表数据
		async loadData() {
			this.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/months/mortgage/billRemitReportDetail',
				data: this.loadDataPost,
				timeout: 3 * 60000,
				callback: () => {
					this.loading = false;
				},
			});
			if (res && res.code === 200 && res.data) {
				let { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
				this.totalMoney = (list[0] && list[0].sumDiffMoney) || 0;
			} else {
				this.$message.error('获取列表数据失败，请查询服务是否可用');
			}
		},
	},
	mounted() {
		const { info } = this.$route.query;
		if (info) {
			this.baseInfo = { ...JSON.parse(info) };
		}
		this.loadData();
	},
};
</script>

<style lang="scss" scoped>
.mb8 {
	margin-bottom: 16px;
}
::v-deep.base-info {
	.el-form-item {
		margin-bottom: 0;
		.el-form-item__label,
		.el-form-item__content {
			color: $color-hit;
		}
	}
}
</style>