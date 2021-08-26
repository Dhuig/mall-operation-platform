<template>
	<div class="branch-price-information">
		<guideBar>
			<el-button v-permission="'branch_price_information_batch_audit'" type="primary" @click="batchAudit">
				批量审核
			</el-button>
			<el-button v-permission="'branch_price_information_batch_cancel'" type="primary" @click="batchRevoke">
				批量撤销
			</el-button>
			<el-button v-permission="'branch_price_information_batch_export'" type="primary" @click="batchExport">
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="BRANCH_PRICE_INFORMATION_SEARCH" @search="handleSearch" />
		</el-card>
		<!-- 表格选项卡 -->
		<el-card>
			<el-tabs v-model="activeStatusTab">
				<el-tab-pane v-for="([label, name], $idx) in COMPANY_PRICE_TABS_LIST" :key="$idx" :label="label" :name="name">
					<tableList
						:loading="tabPanes[activeStatusTab].loading"
						:dataSource="tabPanes[activeStatusTab].data"
						:columns="PRICE_CHECK_COLUMNS"
						:pagination="tabPanes[activeStatusTab].pagination"
						:dataTotal="tabPanes[activeStatusTab].total"
						:options="{ selection: true }"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						@handleSelectionChange="handleSelectionChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'branch_price_information_view'"
								type="text"
								@click="lookover(scope.data)"
								v-if="scope.data.status != 4"
							>
								查看
							</el-button>
							<el-button
								v-permission="'branch_price_information_reset'"
								type="text"
								@click="withdraw(scope.data)"
								v-if="scope.data.status == 0"
							>
								撤回
							</el-button>
							<el-button
								v-permission="'branch_price_information_audit'"
								type="text"
								@click="tobeAudit(scope.data)"
								v-if="scope.data.status == 0"
							>
								审核
							</el-button>
							<el-button
								v-permission="'branch_price_information_edit'"
								type="text"
								@click="edit(scope.data)"
								v-if="[2, 3].includes(scope.data.status)"
							>
								编辑
							</el-button>
							<el-button
								v-permission="'branch_price_information_cancel'"
								type="text"
								@click="withdraw(scope.data)"
								v-if="[1, 2].includes(scope.data.status)"
							>
								撤销
							</el-button>
							<el-button
								v-permission="'branch_price_information_add_price'"
								type="text"
								@click="addPrice(scope.data)"
								v-if="scope.data.status == 4"
							>
								添加价格
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 批量审核 -->
		<el-dialog title="产品价格审核" :visible.sync="batchAuditPopVisible" width="500px">
			<el-form
				:model="batchAuditForm"
				ref="batchAuditForm"
				:rules="COMPANY_PRICE_INFO_BATCH_AUDIT_RULES"
				label-suffix=":"
				label-width="110px"
			>
				<el-form-item label="审核操作" prop="auditResult">
					<el-select size="medium" v-model="batchAuditForm.auditResult" placeholder="请选择审核操作">
						<el-option label="审核通过" value="1" />
						<el-option label="审核不通过" value="2" />
					</el-select>
				</el-form-item>
				<el-form-item label="备注说明" prop="remarks">
					<el-input type="textarea" v-model="batchAuditForm.remarks" maxlength="200" show-word-limit />
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="batchAuditCancel('batchAuditForm')" class="cacel">取 消</el-button>
				<el-button type="primary" @click="batchAuditSave('batchAuditForm')" class="save">确定</el-button>
			</span>
		</el-dialog>
		<!-- 添加/修改/审核 弹窗 -->
		<price-information-pop :dataSource="popDataSource" :popStatus="popStatus" @close="pricePopClose" />
	</div>
</template>

<script>
import {
	BRANCH_PRICE_INFORMATION_SEARCH,
	PRICE_CHECK_COLUMNS,
	COMPANY_PRICE_TABS_LIST,
	VERSION_STATUS_MAP,
	COMPANY_PRICE_INFO_BATCH_AUDIT_RULES,
} from './config.js';
import priceInformationPop from './modal/priceInformationPop.vue';
import qs from 'querystring';
import { exportExcel } from 'util';
export default {
	name: 'branchPriceInformation',
	components: {
		'price-information-pop': priceInformationPop,
	},
	data() {
		return {
			BRANCH_PRICE_INFORMATION_SEARCH,
			PRICE_CHECK_COLUMNS,
			COMPANY_PRICE_TABS_LIST,
			COMPANY_PRICE_INFO_BATCH_AUDIT_RULES,
			searchConfig: {},
			activeStatusTab: 'all',
			tabPanes: {
				all: {
					loading: false,
					data: [],
					total: 0,
					pagination: {
						currentPage: 1,
						pageSize: 20,
					},
				},
				tobeAdded: {
					loading: false,
					data: [],
					total: 0,
					pagination: {
						currentPage: 1,
						pageSize: 20,
					},
				},
				tobeAudit: {
					loading: false,
					data: [],
					total: 0,
					pagination: {
						currentPage: 1,
						pageSize: 20,
					},
				},
				passed: {
					loading: false,
					data: [],
					total: 0,
					pagination: {
						currentPage: 1,
						pageSize: 20,
					},
				},
				notPass: {
					loading: false,
					data: [],
					total: 0,
					pagination: {
						currentPage: 1,
						pageSize: 20,
					},
				},
				withdraw: {
					loading: false,
					data: [],
					total: 0,
					pagination: {
						currentPage: 1,
						pageSize: 20,
					},
				},
			},
			selectRows: [],
			popStatus: { type: 'add', show: false },
			popDataSource: {},
			batchAuditPopVisible: false,
			batchAuditForm: {
				auditResult: '',
				remarks: '',
			},
		};
	},
	watch: {
		activeStatusTab() {
			this.loadData();
		},
		'batchAuditForm.auditResult': {
			handler(val) {
				const param = [{ required: val == 2, message: '请输入备注说明', trigger: 'blur' }];
				this.COMPANY_PRICE_INFO_BATCH_AUDIT_RULES.remarks = [...param];
			},
		},
	},
	computed: {
		loadDataPost() {
			const { activeStatusTab, tabPanes } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = tabPanes[activeStatusTab];
			let data = {
				...this.searchConfig,
				status: VERSION_STATUS_MAP[activeStatusTab],
				pageNum,
				pageSize,
			};
			if (data.timerange) {
				data.beginDate = data.timerange[0];
				data.endDate = data.timerange[1];
				if (data.timerange[0] == data.timerange[1]) {
					data.endDate = data.beginDate + 24 * 3600 * 1000;
				}
			}
			return data;
		},
		productIds() {
			const ids = this.selectRows.map(item => {
				return item.productId;
			});
			return ids;
		},
	},
	methods: {
		// 批量审核
		batchAudit() {
			if (this.productIds.length == 0) {
				return this.$message.warning('至少选中一个产品');
			}
			this.batchAuditPopVisible = true;
		},
		// 批量撤销
		batchRevoke() {
			if (this.productIds.length == 0) {
				return this.$message.warning('至少选中一个产品');
			}
			this.$confirm('您确认撤销选中的的产品审核结果吗？', '提示')
				.then(async () => {
					const res = await this.$fetch(
						`/mgmt/product/filiale/batchRevert?${qs.stringify({ productIds: this.productIds })}`
					);
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.loadData();
					} else {
						this.$message.error(res.data.message || '操作失败');
					}
				})
				.catch(() => {});
		},
		// 批量导出
		batchExport() {
			exportExcel('/mgmt/product/filiale/export', this.loadDataPost);
		},
		// 搜索
		handleSearch() {
			const { activeStatusTab } = this;
			this.tabPanes[activeStatusTab].pagination.currentPage = 1;
			this.loadData();
		},
		// 翻页操作
		handleChangePage(page) {
			const { activeStatusTab } = this;
			this.tabPanes[activeStatusTab].pagination.currentPage = page;
			this.loadData();
		},
		// 切换单页数据条数
		handleSizeChange(pageSize) {
			const { activeStatusTab } = this;
			this.tabPanes[activeStatusTab].pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 选择行
		handleSelectionChange(data) {
			this.selectRows = [...data];
		},
		// 添加价格
		addPrice(row) {
			this.popStatus = { show: true, type: 'add' };
			this.popDataSource = { ...row };
		},
		// 查看
		lookover(row) {
			this.$go('branch_price_check_detail', { productId: row.productId });
		},
		// 撤回
		withdraw(row) {
			this.$confirm('您确认要撤回提交审核吗？', '撤回提交')
				.then(async () => {
					const res = await this.$fetch(`/mgmt/product/filiale/revert?productId=${row.productId}`);
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.loadData();
					} else {
						this.$message.error(res.data.message || '操作失败');
					}
				})
				.catch(() => {});
		},
		// 审核
		tobeAudit(row) {
			this.popStatus = { show: true, type: 'audit' };
			this.popDataSource = { ...row };
		},
		// 撤销
		revoke() {},
		// 编辑
		edit(row) {
			this.popStatus = { show: true, type: 'edit' };
			this.popDataSource = { ...row };
		},
		// 新增/编辑/审核 关闭
		pricePopClose() {
			this.popStatus.show = false;
		},
		// 批量审核取消
		batchAuditCancel(formName) {
			this.$refs[formName].resetFields();
			this.batchAuditPopVisible = false;
		},
		// 批量审核确定
		batchAuditSave(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					this.batchAuditForm.productIds = this.productIds.join();
					const res = await this.$fetch(`/mgmt/product/filiale/batchAudit?${qs.stringify(this.batchAuditForm)}`);
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.$refs[formName].resetFields();
						this.batchAuditPopVisible = false;
						this.loadData();
					} else {
						this.$message.error(res.data.message || '操作失败');
					}
				}
			});
		},
		// 获取价格参数列表数据
		async loadPriceList() {
			const res = await this.$fetch(`/mgmt/product/price/getFilialePriceList`);
			if (res && res.data) {
				this.BRANCH_PRICE_INFORMATION_SEARCH.form[2].options = res.data.map(item => {
					return {
						label: item.priceCatalogTitle,
						value: item.id,
					};
				});
			}
		},
		// 获取列表数据
		async loadData() {
			const { activeStatusTab } = this;
			this.tabPanes[activeStatusTab].loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/product/filiale/getFilialePriceList',
				data: this.loadDataPost,
			});
			this.tabPanes[activeStatusTab].loading = false;
			if (res && res.data) {
				const { list, total } = res.data;
				if (list && list.length) {
					this.tabPanes[activeStatusTab].data = list;
					this.tabPanes[activeStatusTab].total = total;
				} else {
					this.tabPanes[activeStatusTab].data = [];
					this.tabPanes[activeStatusTab].total = 0;
				}
			} else {
				this.$message('查询商品版本列表数据失败');
			}
		},
		// 获取销售主体
		async getCompany() {
			const res = await this.$fetch(`/mgmt/product/cfg/menu/company`);
			if (res?.code == 200) {
				this.BRANCH_PRICE_INFORMATION_SEARCH.form[5].options = this.resultOptions(res.data.childList);
			}
		},
		// 处理返回正确的options
		resultOptions(arr) {
			// cfgStatus 启用 or 禁用
			return arr.filter(x => Boolean(x.cfgStatus)).map(({ title: label, id: value }) => ({ label, value }));
		},
	},
	async created() {
		await this.getCompany();
	},
	mounted() {
		this.loadData();
		this.loadPriceList();
		this.$listen('UPDATE_COMPANY_PRICE_INFO_LIST', this.loadData);
	},
};
</script>

<style lang="scss" scoped>
::v-deep.branch-price-information {
	.dialog-footer {
		display: flex;
		justify-content: center;
	}
	.el-select--medium {
		width: 100%;
	}
	.edit-price {
		.flex {
			width: 80%;
		}
	}
	.check-price {
		.flex {
			display: flex;
			.el-form-item {
				width: 50%;
			}
		}
	}
	.operate-group {
		> span {
			display: inline;
		}
	}
}
</style>
