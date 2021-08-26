<template>
	<div class="product-price-check-list">
		<guideBar>
			<el-button v-permission="'product_price_checkList_batch_audit'" type="primary" @click="batchCheck">
				批量审核
			</el-button>
			<el-button v-permission="'product_price_checkList_batch_export'" type="primary" @click="batchOutput">
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="PRICE_CHECK_SEARCH" @search="handleSearch" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeStatusTab">
				<el-tab-pane :label="item.title" :name="index" v-for="(item, index) in AUDIT_STATUS_PANES" :key="index">
					<tableList
						:loading="item.loading"
						:dataSource="item.data"
						:columns="PRICE_CHECK_COLUMNS"
						:pagination="item.pagination"
						:dataTotal="item.total"
						:options="item.options"
						@handleSelectionChange="productChange"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button v-permission="'product_price_checkList_view'" type="text" @click="lookover(scope.data)">
								查看
							</el-button>
							<el-button
								v-permission="'product_price_checkList_audit'"
								type="text"
								@click="audit(scope.data)"
								v-if="scope.data.versionStatus < 5"
							>
								审核
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 批量审核 -->
		<el-dialog title="产品价格审核" width="500px" :visible.sync="batchAuditVisible" class="audit-pop">
			<el-form :model="auditForm" ref="auditForm" :rules="AUDIT_RULES" label-width="120px">
				<el-form-item label="审核操作" prop="auditResult">
					<el-select label="审核操作" v-model="auditForm.auditResult" placeholder="请选择审核操作">
						<el-option
							:label="item.label"
							:value="item.value"
							v-for="(item, index) in AUDIT_OPERATION"
							:key="index"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注说明">
					<el-input v-model="auditForm.remarks" type="textarea"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cacelBatchAudit('auditForm')">取 消</el-button>
				<el-button type="primary" @click="saveBatchAudit('auditForm')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {
	PRICE_CHECK_SEARCH,
	PRICE_CHECK_COLUMNS,
	AUDIT_STATUS_PANES,
	AUDIT_STATUS_NAME_TO_NUMBER,
	AUDIT_RULES,
	AUDIT_OPERATION,
} from './config';
import { optionGenerator, exportExcel } from 'util';
export default {
	name: 'productPriceCheckList',
	data() {
		return {
			PRICE_CHECK_SEARCH,
			PRICE_CHECK_COLUMNS,
			AUDIT_STAUTS: [],
			AUDIT_STATUS_PANES,
			AUDIT_STATUS_NAME_TO_NUMBER,
			searchConfig: {},
			activeStatusTab: '1',
			batchIds: [],
			batchAuditVisible: false,
			auditForm: {},
			AUDIT_RULES,
			AUDIT_OPERATION,
		};
	},
	methods: {
		handleSearch() {
			this.AUDIT_STATUS_PANES[this.activeStatusTab].pagination.currentPage = 1;
			this.loadData();
		},
		// 批量审核
		batchCheck() {
			this.batchAuditVisible = true;
		},
		// 批量导出
		batchOutput() {
			exportExcel('/mgmt/product/ctrl/batchExportFile', this.loadDataPost);
		},
		// 翻页
		handleChangePage(page) {
			this.AUDIT_STATUS_PANES[this.activeStatusTab].pagination.currentPage = page;
			this.loadData();
		},
		handleSizeChange(pageSize) {
			this.AUDIT_STATUS_PANES[this.activeStatusTab].pagination.pageSize = pageSize;
			this.loadData();
		},
		// 产品是否选中回调
		productChange(rowcollect) {
			let data = [];
			rowcollect.forEach((v) => {
				if (v.versionStatus < 5) {
					data.push(v.id);
				}
			});
			this.batchIds = data;
		},
		// 查看
		lookover(row) {
			const id = row.id;
			const type = 'preview';
			this.$go('/product_detail', { id, type, title: '查看商品详情' });
		},
		// 审核
		audit(row) {
			this.$go('/product_price_check', { id: row.id });
		},
		// 批量审核 -- 取消
		cacelBatchAudit(formname) {
			this.batchAuditVisible = false;
			this.$refs[formname].resetFields();
		},
		// 批量审核 -- 保存
		saveBatchAudit(formname) {
			this.$refs[formname].validate(async (valid) => {
				if (valid) {
					if (this.batchIds.length > 0) {
						const { auditResult, remarks } = this.auditForm;
						const data = {
							auditResult: Number(auditResult),
							remarks,
							versionIds: this.batchIds,
						};
						const res = await this.$fetch({
							method: 'POST',
							url: `/mgmt/product/ctrl/batchFinaAudit`,
							data,
						});

						if (res && res.data) {
							this.loadData();
						} else {
							this.$message({
								message: '操作失败',
								type: 'error',
							});
						}
						this.$refs[formname].resetFields();
						this.batchAuditVisible = false;
					} else {
						this.$message({
							message: '请勾选至少一个待审核产品',
							type: 'warning',
						});
					}
				}
			});
		},
		// 获取字典映射
		async getDicts() {
			const [AUDIT_STAUTS] = await Promise.all([this.$getDict('AUDIT_STAUTS')]);
			AUDIT_STAUTS && (this.AUDIT_STAUTS = optionGenerator(AUDIT_STAUTS));
			this.loadData();
		},
		// 获取数据
		async loadData() {
			// 创建时间如果选择同一天，结束时间设置为隔天
			const { startTime, endTime } = this.loadDataPost;
			if (startTime && startTime === endTime) {
				this.loadDataPost.endTime += 86400000;
			}
			const { activeStatusTab } = this;
			this.AUDIT_STATUS_PANES[activeStatusTab].loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/product/ctrl/listFinaAudit`,
				data: this.loadDataPost,
			});
			this.AUDIT_STATUS_PANES[activeStatusTab].loading = false;
			if (res && res.data) {
				let { list, total } = res.data;
				this.$nextTick(() => {
					this.AUDIT_STATUS_PANES[activeStatusTab].data = list;
					this.AUDIT_STATUS_PANES[activeStatusTab].total = total;
				});
				if (total == 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
	},
	watch: {
		activeStatusTab() {
			this.loadData();
		},
		AUDIT_STAUTS(newVal) {
			let { AUDIT_STATUS_NAME_TO_NUMBER } = this;
			let data = {};
			newVal.forEach((v) => {
				v.label === '所有' && (v.label = '所有产品');
				data[v.value] = {
					name: AUDIT_STATUS_NAME_TO_NUMBER[v.value],
					loading: false,
					title: v.label,
					data: [],
					pagination: {
						currentPage: 1,
						pageSize: 10,
					},
					total: 0,
					options: {
						selection: true,
					},
				};
			});
			this.AUDIT_STATUS_PANES = data;
		},
	},
	computed: {
		loadDataPost() {
			let { activeStatusTab, searchConfig, AUDIT_STATUS_PANES } = this;
			let data = {
				auditStauts: Number(activeStatusTab),
				endTime: (searchConfig.daterange && searchConfig.daterange[1]) || null,
				startTime: (searchConfig.daterange && searchConfig.daterange[0]) || null,
				serialNo: searchConfig.serialNo || '',
				title: searchConfig.title || '',
				pageNum: 1,
				pageSize: 10,
			};
			if (AUDIT_STATUS_PANES[activeStatusTab] && AUDIT_STATUS_PANES[activeStatusTab].pagination) {
				data.pageNum = AUDIT_STATUS_PANES[activeStatusTab].pagination.currentPage;
				data.pageSize = AUDIT_STATUS_PANES[activeStatusTab].pagination.pageSize;
			}
			data.serialNo = data.serialNo ? String(data.serialNo).trim() : '';
			return data;
		},
	},
	mounted() {
		this.getDicts();
		this.$listen('PRICE_LIST_UPDATE', this.loadData);
	},
};
</script>

<style lang="scss" scoped>
::v-deep.product-price-check-list {
	.el-dialog__footer {
		text-align: center;
	}
	.audit-pop {
		.el-select {
			width: 100%;
		}
	}
}
</style>
