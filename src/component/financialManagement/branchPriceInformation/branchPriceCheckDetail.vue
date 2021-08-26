<template>
	<div class="branch-price-check-detail">
		<guideBar></guideBar>
		<el-card class="box-card">
			<div class="search-header">
				<el-form :inline="true" :model="formData" ref="formRef" label-width="280px" label-suffix=":">
					<el-row :gutter="20">
						<el-col :span="10" v-for="(item, idx) in BRANCH_PRICE_DETAIL_SEARCH.form" :key="idx">
							<el-form-item :label="item.label" :prop="item.key" class="search-header-item" :rules="item.rules">
								<!-- 输入框 -->
								<template v-if="item.type === 'input'">
									<el-input
										:value="item.format(formData[item.key])"
										:placeholder="item.placeholder"
										:size="item.size || 'medium'"
										:disabled="item.disabled"
										v-if="item.format"
									/>
									<el-input
										:value="formData[item.key]"
										:placeholder="item.placeholder"
										:size="item.size || 'medium'"
										:disabled="item.disabled"
										v-else
									/>
								</template>
								<!-- 下拉框 -->
								<template v-else-if="item.type === 'select'">
									<el-select
										v-model="formData[item.key]"
										:placeholder="item.placeholder"
										:size="item.size || 'medium'"
										:disabled="item.disabled"
									>
										<el-option
											v-for="(option, idx) in item.options"
											:key="idx"
											:value="option.value"
											:label="option.label"
										/>
									</el-select>
								</template>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-card>
		<!-- 表格 -->
		<el-card class="box-card">
			<div class="flex logs-list-title">
				<div>操作日志</div>
				<div class="logs-list-switch" @click="logsListSwitch">{{ logsListShow ? '收起' : '展开' }}</div>
			</div>
			<div class="logs-content" v-show="logsListShow">
				<searchPanel v-model="searchConfig" :config="BRANCH_PRICE_DETAIL_SEARCH_TIME" @search="handleSearch" />
				<tableList
					border
					:loading="false"
					:dataSource="logsList"
					:columns="BRANCH_PRICE_DETAIL_LOGS"
					:pagination="pagination"
					:dataTotal="dataTotal"
					@handleChangePage="handleChangePage"
					@handleSizeChange="handleSizeChange"
				/>
			</div>
		</el-card>
	</div>
</template>

<script>
import { BRANCH_PRICE_DETAIL_SEARCH, BRANCH_PRICE_DETAIL_LOGS, BRANCH_PRICE_DETAIL_SEARCH_TIME } from './config';
export default {
	name: 'branchPriceCheckDetail',
	data() {
		return {
			BRANCH_PRICE_DETAIL_SEARCH,
			BRANCH_PRICE_DETAIL_LOGS,
			BRANCH_PRICE_DETAIL_SEARCH_TIME,
			productId: '',
			formData: {},
			searchConfig: {},
			logsList: [],
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
			logsListShow: true,
		};
	},
	computed: {
		loadDataPost() {
			const {
				productId,
				searchConfig,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			let data = {
				...searchConfig,
				pageNum,
				pageSize,
				productId,
			};
			if (data.updateTime) {
				data.startTime = data.updateTime[0];
				data.endTime = data.updateTime[1];
				if (data.startTime == data.endTime) {
					data.endTime = data.endTime + 24 * 3600 * 1000;
				}
			}
			return data;
		},
	},
	methods: {
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
		},
		logsListSwitch() {
			this.logsListShow = !this.logsListShow;
		},
		// 翻页操作
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 切换单页数据条数
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 获取分公司价格审核详情信息
		async loadPriceAuditInfo() {
			const res = await this.$fetch(`/mgmt/product/filiale/getFilialeDetail?productId=${this.productId}`);
			if (res && res.data) {
				this.formData = { ...res.data };
			} else {
				this.$message.error('获取分公司价格审核详情信息失败');
			}
		},
		// 获取操作日志列表数据
		async loadData() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/product/filiale/getAuditLog',
				data: this.loadDataPost,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				if (list.length) {
					this.logsList = list;
					this.dataTotal = total;
				} else {
					this.logsList = [];
					this.dataTotal = 0;
				}
			} else {
				this.$message.error('获取操作日志列表数据失败');
			}
		},
	},
	mounted() {
		const { productId } = this.$route.query;
		if (productId) {
			this.productId = productId;
		}
		this.loadPriceAuditInfo();
		this.loadData();
	},
};
</script>

<style lang="scss" scoped>
::v-deep.branch-price-check-detail {
	.box-card {
		margin-bottom: 16px;
	}
	.logs-list-switch {
		cursor: pointer;
		color: #797979;
	}
	.logs-content {
		margin-top: 20px;
	}
	.flex {
		display: flex;
		justify-content: space-between;
	}
	.search-header {
		.el-form {
			display: flex;
			justify-content: space-between;
		}
	}
	.el-row {
		&:first-child {
			width: 90%;
		}
	}
}
</style>