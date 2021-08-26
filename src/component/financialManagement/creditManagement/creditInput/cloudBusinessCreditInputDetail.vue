<template>
	<div>
		<guideBar>
			<el-button type="primary" v-permission="'cloud_businesss_credit_input_detail_batch_submit'" @click="batchSubmit">
				批量提交
			</el-button>
			<el-button type="primary" v-permission="'cloud_businesss_credit_input_detail_batch_export'" @click="batchExport">
				批量导出
			</el-button>
			<el-button type="primary" v-permission="'cloud_businesss_credit_input_detail_batch_import'" @click="batchImport">
				批量导入
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="CREDIT_INPUT_DETAIL_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeStatusTab">
				<el-tab-pane :label="label" :name="name" v-for="([label, name], $idx) in AUDIT_STATUS_PANES" :key="$idx">
					<tableList
						:loading="tabPanes[name].loading"
						:dataSource="tabPanes[name].data"
						:columns="CREDIT_INPUT_DETAIL_COLUMNS_CONFIG"
						:pagination="tabPanes[name].pagination"
						:dataTotal="tabPanes[name].total"
						:options="{ selection: true }"
						@handleSelectionChange="handleSelectionChange"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								type="text"
								v-if="[7, 9].includes(scope.data.auditStatus)"
								v-permission="'cloud_businesss_credit_input_detail_edit'"
								@click="toEdit(scope.data)"
							>
								修改
							</el-button>
							<el-button
								type="text"
								v-if="[7, 9].includes(scope.data.auditStatus)"
								v-permission="'cloud_businesss_credit_input_detail_submit'"
								@click="toSubmit(scope.data)"
							>
								提交
							</el-button>
							<!-- <el-button type="text" v-if="scope.data.auditStatus == 9" @click="toDelete(scope.data)">删除</el-button> -->
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 修改 -->
		<el-dialog title="修改" :visible.sync="editModalVisible" width="500px">
			<el-form :model="editForm" ref="editForm" :rules="editFormRules" label-width="120px" label-suffix=":">
				<el-row>
					<el-col :span="12">
						<el-form-item label="会员卡号" prop="cardNo">{{ editForm.cardNo }}</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="顾客姓名" prop="realname">{{ editForm.realname }}</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="本次增加信用额" prop="increaseAmount">
					<el-input v-model="editForm.increaseAmount">
						<span slot="prepend">￥</span>
					</el-input>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="center">
				<el-button @click="editCancel('editForm')">取消</el-button>
				<el-button type="primary" @click="editSave('editForm')">确定</el-button>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import { exportExcelPost } from 'util';
import {
	CREDIT_INPUT_DETAIL_SEARCH_CONFIG,
	AUDIT_STATUS_PANES,
	AUDIT_STATUS_KEY_VALUE,
	CREDIT_INPUT_DETAIL_COLUMNS_CONFIG,
} from './config';
export default {
	name: 'cloudBusinessCreditInputDetail',
	data() {
		let tabPanes = {};
		Object.keys(AUDIT_STATUS_KEY_VALUE).map(item => {
			tabPanes[item] = {
				loading: false,
				data: [],
				total: 0,
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
			};
		});
		return {
			CREDIT_INPUT_DETAIL_SEARCH_CONFIG,
			AUDIT_STATUS_PANES,
			AUDIT_STATUS_KEY_VALUE,
			CREDIT_INPUT_DETAIL_COLUMNS_CONFIG,
			id: '', //批次id
			searchConfig: {},
			activeStatusTab: 'all',
			tabPanes,
			selectRows: [], // 选中的row
			editModalVisible: false, // 修改弹窗显示状态
			editForm: {},
			sureButtonSwitch: true, //能否触发
			editFormRules: {
				increaseAmount: [
					{ pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/, message: '请输入正数，支持2位小数', trigger: 'blur' },
				],
			},
		};
	},
	watch: {
		activeStatusTab: {
			handler() {
				this.loadData();
			},
		},
		'searchConfig.storeCode'(val) {
			if (/^\d{6,}$/.test(val)) {
				this.loadCardNoByStoreCode();
			}
		},
	},
	computed: {
		loadDataPost() {
			let { id, searchConfig, activeStatusTab, tabPanes, AUDIT_STATUS_KEY_VALUE } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = tabPanes[activeStatusTab];
			return {
				id,
				auditStatus: AUDIT_STATUS_KEY_VALUE[activeStatusTab],
				...searchConfig,
				pageNum,
				pageSize,
			};
		},
	},
	methods: {
		// 批量提交
		batchSubmit() {
			const { selectRows } = this;
			const selectLen = selectRows.length;
			if (selectLen < 2) {
				return this.$message.warning('需至少选择两条');
			}
			this.$confirm('是否确认提交审核？', `提交数量合计：${selectLen}条`)
				.then(async () => {
					const idList = selectRows.map(({ id }) => id);
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/fin/wallet/credit/auditBatchDetail',
						data: { auditStatus: 1, idList },
					});
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.loadData();
					} else {
						this.$message.error('操作失败');
					}
				})
				.catch(() => {});
		},
		// 批量导出
		batchExport() {
			exportExcelPost('/mgmt/fin/wallet/credit/exportBatchDetail', this.loadDataPost, '云商信用额录入详情列表', {
				timeout: 2 * 60000,
			});
		},
		// 批量导入
		batchImport() {
			const info = {
				downloadUrl: 'https://uc.oss.perfect99.com/mall-center-product/202102201059450mh8r.xlsx',
				uploadUrl: '/mgmt/fin/wallet/credit/importBatchDetail',
				downloadFailUrl: '/mgmt/fin/wallet/credit/exportBatchDetailErrorMsg',
				uploadParams: {
					batchId: this.id,
				},
			};
			this.$go('credit_adjust_batch_import', { info });
		},
		// 搜索
		handleSearch() {
			const { activeStatusTab } = this;
			this.tabPanes[activeStatusTab].pagination.currentPage = 1;
			this.loadData();
		},
		// 翻页
		handleChangePage(page) {
			const { activeStatusTab } = this;
			this.tabPanes[activeStatusTab].pagination.currentPage = page;
			this.loadData();
		},
		// 切换每页条数
		handleSizeChange(pageSize) {
			const { activeStatusTab } = this;
			this.tabPanes[activeStatusTab].pagination = {
				currentPage: 1,
				pageSize: pageSize,
			};
			this.loadData();
		},
		// 选择列表数据
		handleSelectionChange(data) {
			this.selectRows = [...data];
		},
		// 修改
		toEdit(row) {
			this.editModalVisible = true;
			this.$nextTick(() => {
				const { creditAdjBatchId: batchId, id: batchdtlId, cardNo, realname, increaseAmount, walletId } = row;
				this.editForm = {
					batchId,
					batchdtlId,
					walletId,
					cardNo,
					realname,
					increaseAmount,
				};
			});
		},
		// 提交
		toSubmit(row) {
			this.$confirm('是否确认提交审核？', '提交')
				.then(async () => {
					const { id } = row;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/fin/wallet/credit/auditBatchDetail',
						data: { auditStatus: 1, idList: [id] },
					});
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.loadData();
					} else {
						this.$message.error((res && res.data.message) || '操作失败');
					}
				})
				.catch(() => {});
		},
		// 删除
		toDelete(row) {
			this.$confirm('是否确认删除？', '删除')
				.then(async () => {
					const { id } = row;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/fin/wallet/credit/deleteAdjustBatchDetail',
						data: { batchdtlIdList: [id] },
					});
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.loadData();
					} else {
						this.$message.error((res && res.data.message) || '操作失败');
					}
				})
				.catch(() => {});
		},
		// 修改 取消
		editCancel(formName) {
			this.$refs[formName].resetFields();
			this.editModalVisible = false;
		},
		// 修改 确定
		async editSave(formName) {
			if (this.sureButtonSwitch) {
				this.sureButtonSwitch = false;
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/fin/wallet/credit/updateBatchDetail',
					data: this.editForm,
					callback: () => {
						this.sureButtonSwitch = true;
					},
				});
				if (res && res.code === 200) {
					this.$message.success('操作成功');
					this.editCancel(formName);
					this.loadData();
				} else {
					this.$message.error('操作失败');
				}
			}
		},
		// 获取会员卡号 通过服务中心编号
		async loadCardNoByStoreCode() {
			const { storeCode } = this.searchConfig;
			if (!storeCode) return;
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/fin/wallet/getCardNoByStoreCode?storeCode=' + storeCode,
			});
			if (res && res.code == 200) {
				this.searchConfig.cardNo = res.data;
			} else {
				this.$message.error('获取会员卡号失败');
			}
		},
		// 获取列表数据
		async loadData() {
			const { activeStatusTab } = this;
			this.tabPanes[activeStatusTab].loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/credit/getBatchDetailList',
				data: this.loadDataPost,
				callback: () => {
					this.tabPanes[activeStatusTab].loading = false;
				},
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.tabPanes[activeStatusTab].data = list;
				this.tabPanes[activeStatusTab].total = total;
			} else {
				this.$message.error('获取列表数据失败，请查询服务是否可用');
			}
		},
	},
	mounted() {
		const { id } = this.$route.query;
		if (id) {
			this.id = id;
			this.loadData();
		}
	},
};
</script>
