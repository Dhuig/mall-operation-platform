<template>
	<div>
		<guideBar>
			<el-button
				v-permission="'product_management_batch_validate'"
				icon="el-icon-s-order"
				type="success"
				@click="batchValidate"
			>
				批量审核
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="PRODUCT_INFO_VALIDATE_SERACH" @search="resetLoad" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeTab">
				<el-tab-pane
					v-for="([label, name], $idx) in PRODUCT_INFO_VALIDATE_TABS_LIST"
					:key="$idx"
					:label="label"
					:name="name"
				>
					<tableList
						:options="options"
						:dataSource="tabPanes[activeTab].data"
						:columns="PRODUCT_INFO_VALIDATE_COLUMNS"
						:pagination="tabPanes[activeTab].pagination"
						:dataTotal="tabPanes[activeTab].total"
						:loading="tabPanes[activeTab].loading"
						@loadMore="loadMore"
						@handleSelectionChange="handleSelectionChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'product_management_validate'"
								type="text"
								v-if="/2/.test(scope.data.versionStatus)"
								@click="doValidate(scope.data.id)"
							>
								审核
							</el-button>
							<el-button v-permission="'product_management_detail'" type="text" @click="view(scope.data.id)">
								查看
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 批量审核弹窗 -->
		<el-dialog title="批量审核" :visible.sync="validate.show" width="30%" v-drag>
			<el-form :model="validate.form" label-width="90px" label-position="left" label-suffix=":">
				<el-form-item label="审核操作">
					<el-select size="mini" v-model="validate.form.auditResult" class="theme-input">
						<el-option label="审核通过" :value="1" />
						<el-option label="审核不通过" :value="2" />
					</el-select>
				</el-form-item>
				<el-form-item label="备注说明">
					<el-input type="textarea" size="mini" :rows="4" v-model="validate.form.remarks" class="theme-input" />
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="cancelBatchValidate">取 消</el-button>
				<el-button type="primary" @click="saveBatchValidate">保存</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { timeStartFormat, timeEndFormat } from 'util';
import {
	PRODUCT_INFO_VALIDATE_SERACH,
	PRODUCT_INFO_VALIDATE_COLUMNS,
	PRODUCT_AUDIT_TYPE,
	PRODUCT_INFO_VALIDATE_TABS_LIST,
	TABITEM,
} from './config';

export default {
	name: 'productInfoValidate',
	data() {
		const tabPanes = Object.create(null);
		PRODUCT_INFO_VALIDATE_TABS_LIST.map((tabItem) => (tabPanes[tabItem[1]] = new TABITEM()));
		return {
			PRODUCT_INFO_VALIDATE_SERACH,
			PRODUCT_INFO_VALIDATE_COLUMNS,
			PRODUCT_INFO_VALIDATE_TABS_LIST,
			options: {
				label: '全部',
				index: false,
				selection: true,
				labelIndex: '序号',
			},
			activeTab: 'all',
			searchConfig: {
				serialNo: '',
				title: '',
				timeRange: ['', ''],
			},
			tabPanes,
			validate: {
				show: false,
				form: {
					versionIds: [],
					auditResult: 1,
					remarks: '同意这些产品通过审核',
				},
			},
		};
	},
	computed: {
		// 顾客购物类型
		auditStauts() {
			return PRODUCT_AUDIT_TYPE[this.activeTab];
		},
		// 搜索参数
		searchFields() {
			const {
				searchConfig: { serialNo, title, timeRange },
			} = this;
			return {
				serialNo,
				title,
				startTime: timeStartFormat(timeRange[0]) || '',
				endTime: timeEndFormat(timeRange[1]) || '',
			};
		},
	},
	watch: {
		auditStauts: {
			immediate: true,
			handler() {
				this.resetLoad();
			},
		},
	},
	methods: {
		// 下拉刷新
		loadMore() {
			const { currentPage, pageSize } = this.tabPanes[this.activeTab].pagination;
			const { total } = this.tabPanes[this.activeTab];
			console.log(total, this.tabPanes[this.activeTab]);
			if (currentPage * pageSize >= total) {
				return this.$message.warning('没有更多数据');
			}
			this.tabPanes[this.activeTab].pagination.currentPage++;
			this.loadData();
		},
		// 分页触发事件
		handleChangePage(currentPage) {
			this[this.activeTab].pagination.currentPage = currentPage;
			this.loadData();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this[this.activeTab].pagination.pageSize = pageSize;
			this.loadData();
		},
		// 搜索方法
		resetLoad() {
			this.tabPanes[this.activeTab].pagination.currentPage = 1;
			this.tabPanes[this.activeTab].data = [];
			this.$nextTick(this.loadData);
		},
		// 复选回调
		handleSelectionChange(selection) {
			this.validate.form.versionIds = selection.map(({ id }) => id);
		},
		// 批量审核
		batchValidate() {
			const { versionIds: selection } = this.validate.form;
			if (!selection || !selection.length) return this.$message.warning('请至少选择一项产品,再进行批量审核操作');
			this.validate.show = true;
		},
		// 审核产品
		doValidate(id) {
			this.$go('/product_info_validate_detail', { id, title: '产品审核' });
		},
		// 查看商品详情
		view(id) {
			this.$go('/product_detail', { id, title: '查看产品详情' });
		},
		// 取消批量审核回调
		cancelBatchValidate() {
			this.validate.show = false;
		},
		// 确认批量审核回调
		saveBatchValidate() {
			this.doBatchvalidate(this.validate.form);
			this.validate.show = false;
		},
		// 批量审核产品
		async doBatchvalidate(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/product/ctrl/batchInfoAudit',
				data,
			});

			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.$nextTick(this.resetLoad);
			} else {
				this.$message({
					type: 'error',
					message: '批量审核失败',
				});
			}
		},
		// 查询产品信息审核列表
		async loadData() {
			const { searchFields, activeTab, auditStauts } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabPanes[activeTab];
			const data = {
				auditStauts,
				pageNum,
				pageSize,
				...searchFields,
			};
			this.tabPanes[activeTab].loading = true;

			const res = await this.$fetch({
				method: 'POST',
				url: 'mgmt/product/ctrl/listInfoAudit',
				data,
			});
			this.tabPanes[activeTab].loading = false;

			if (res && res.data) {
				const { list, total } = res.data;
				this.tabPanes[activeTab].data = this.tabPanes[activeTab].data.concat(list);
				this.tabPanes[activeTab].total = total;
			} else {
				this.tabPanes[activeTab].data = [];
				this.tabPanes[activeTab].total = 0;
			}
		},
	},
	mounted() {
		this.$listen('UPDATE_PRODUCT_VALIDATE_LIST', this.resetLoad);
	},
};
</script>
