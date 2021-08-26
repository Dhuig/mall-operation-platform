<template>
	<el-tabs v-model="activeName">
		<el-tab-pane label="产品审核" name="audit">
			<div>
				<guideBar />
				<el-card style="margin-bottom: 16px">
					<h4 slot="header">产品审核</h4>
					<el-row>
						<el-form :model="validate" label-width="90px" label-position="left" label-suffix=":" style="width: 600px">
							<el-form-item label="审核操作">
								<el-select size="mini" @change="changeRemarks" v-model="validate.auditResult" class="theme-input">
									<el-option label="审核通过" :value="1" />
									<el-option label="审核不通过" :value="2" />
								</el-select>
							</el-form-item>
							<el-form-item label="备注说明">
								<el-input
									type="textarea"
									maxlength="200"
									show-word-limit
									size="mini"
									:rows="4"
									v-model="validate.remarks"
									class="theme-input"
								/>
							</el-form-item>
						</el-form>
					</el-row>
					<el-row>
						<el-button @click="cancelBatchValidate">取 消</el-button>
						<el-button type="primary" @click="saveBatchValidate">保存</el-button>
					</el-row>
				</el-card>
				<el-card>
					<h4 slot="header">审核日志</h4>
					<searchPanel v-model="searchConfig" :config="PRODUCT_INFO_VALIDATE_CHANGELOG_SERACH" @search="resetLoad" />
					<tableList
						:options="options"
						:loading="loading"
						:dataSource="data"
						:columns="PRODUCT_INFO_VALIDATE_CHANGELOG_COLUMNS"
						:pagination="pagination"
						:dataTotal="total"
						@loadMore="loadMore"
					/>
				</el-card>
			</div>
		</el-tab-pane>
		<el-tab-pane label="产品详情" name="info">
			<productDetail />
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import { PRODUCT_INFO_VALIDATE_CHANGELOG_SERACH, PRODUCT_INFO_VALIDATE_CHANGELOG_COLUMNS } from './config';
import productDetail from './productDetail';
export default {
	name: 'productInfoValidateDetail',
	data() {
		return {
			PRODUCT_INFO_VALIDATE_CHANGELOG_SERACH,
			PRODUCT_INFO_VALIDATE_CHANGELOG_COLUMNS,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			searchConfig: {
				operator: '',
				auditTypeResult: 0,
				timeRange: ['', ''],
			},
			validate: {
				versionId: '',
				auditResult: 1,
				remarks: '同意此产品通过审核',
			},
			loading: false,
			data: [],
			total: 0,
			pagination: {
				currentPage: 1,
				pageSize: 20,
			},
			activeName: 'audit',
		};
	},
	component: {
		productDetail,
	},
	computed: {
		// 搜索参数
		searchFields() {
			const {
				searchConfig: { operator, auditTypeResult, timeRange = ['', ''] },
			} = this;
			return {
				operator,
				auditTypeResult,
				startTime: timeRange[0],
				endTime: timeRange[1],
			};
		},
	},
	methods: {
		// 修改
		changeRemarks(val) {
			this.validate.remarks = val == 1 ? '同意此产品通过审核' : '';
		},
		// 下拉刷新
		loadMore() {
			let { currentPage, pageSize } = this.pagination;
			if (currentPage * pageSize >= this.total) {
				return this.$message.warning('没有更多数据');
			}
			this.pagination.currentPage++;
			this.loadValidateChangelog();
		},
		// 分页触发事件
		handleChangePage(currentPage) {
			this.pagination.currentPage = currentPage;
			this.loadValidateChangelog();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.loadValidateChangelog();
		},
		// 重置
		resetLoad() {
			this.pagination.currentPage = 1;
			this.data = [];
			this.loadValidateChangelog();
		},
		// 取消审核回调
		cancelBatchValidate() {
			this.$closeSelf();
		},
		// 确认审核回调
		saveBatchValidate() {
			this.doValidate(this.validate);
		},
		// 审核产品
		async doValidate(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/product/ctrl/infoAudit',
				data,
			});

			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message || '审核成功',
					onClose: () => {
						this.$dispatch('UPDATE_PRODUCT_VALIDATE_LIST');
						this.$closeSelf();
					},
				});
			} else {
				this.$message({
					type: 'error',
					message: '批量审核失败',
				});
			}
		},
		// 查询产品信息审核历史记录
		async loadValidateChangelog() {
			this.loading = true;
			const {
				validate: { versionId },
				searchFields,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			if (!versionId) return;
			const data = {
				versionId,
				pageNum,
				pageSize,
				...searchFields,
			};

			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/product/ctrl/listAuditLog',
				data,
			});

			if (res && res.data) {
				const { list, total } = res.data;
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
		const { id } = this.$route.query;
		this.validate.versionId = id;
		if (id) {
			this.resetLoad();
		}
	},
};
</script>
