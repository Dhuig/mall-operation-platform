<template>
	<div class="hand-input-flow">
		<guideBar>
			<el-button v-permission="'hand_input_flow_insert_flow'" type="primary" @click="handInput">手工录入流水</el-button>
			<el-button v-permission="'hand_input_flow_export_excel'" type="primary" @click="batchExport">导出EXCEL</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="HAND_INPUT_FLOW_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeName">
				<el-tab-pane label="待审核" name="tobeReview">
					<tableList
						:loading="tobeReview.loading"
						:dataSource="tobeReview.list"
						:columns="HAND_INPUT_FLOW_COLUMNS_CONFIG"
						:pagination="tobeReview.pagination"
						:dataTotal="tobeReview.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button v-permission="'hand_input_flow_detail'" type="text" @click="detail(scope.data)">
								详情
							</el-button>
							<el-button v-permission="'hand_input_flow_audit'" type="text" @click="audit(scope.data)">审核</el-button>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="已审核" name="reviewed">
					<tableList
						:loading="reviewed.loading"
						:dataSource="reviewed.list"
						:columns="HAND_INPUT_FLOW_COLUMNS_CONFIG"
						:pagination="reviewed.pagination"
						:dataTotal="reviewed.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button v-permission="'hand_input_flow_detail'" type="text" @click="detail(scope.data)">
								详情
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 手工录入流水 -->
		<el-dialog v-drag title="手工录入流水" :visible.sync="inputDialogVisible" width="800px">
			<hand-input-pop />
		</el-dialog>
		<!-- 详情 -->
		<hand-input-detail-pop :handInputProps="handInputProps" />
	</div>
</template>

<script>
import { exportExcel } from 'util';
import {
	HAND_INPUT_FLOW_SEARCH_CONFIG,
	HAND_INPUT_FLOW_COLUMNS_CONFIG,
	VERIFY_STATUS_NAME_TO_NUM,
	BANK_TYPE,
	PAYMENT_TYPE_HANDLE,
} from '../config';
import handInputPop from './handInputPop.vue';
import handInputDetailPop from '../modal/handIinputPop.vue';
export default {
	name: 'handInputFlow',
	components: {
		'hand-input-pop': handInputPop,
		'hand-input-detail-pop': handInputDetailPop,
	},
	data() {
		return {
			HAND_INPUT_FLOW_SEARCH_CONFIG,
			HAND_INPUT_FLOW_COLUMNS_CONFIG,
			VERIFY_STATUS_NAME_TO_NUM,
			PAYMENT_TYPE_HANDLE,
			searchConfig: {},
			activeName: 'tobeReview',
			tobeReview: {
				loading: false,
				list: [],
				pagination: { currentPage: 1, pageSize: 10 },
				total: 0,
			},
			reviewed: {
				loading: false,
				list: [],
				pagination: { currentPage: 1, pageSize: 10 },
				total: 0,
			},
			inputDialogVisible: false,
			handInputProps: { show: false, type: 1 },
		};
	},
	computed: {
		loadDataPost() {
			const { searchConfig, activeName, VERIFY_STATUS_NAME_TO_NUM } = this;
			let data = {
				...searchConfig,
				verifyStatus: VERIFY_STATUS_NAME_TO_NUM[activeName],
				pageNum: this[activeName].pagination.currentPage,
				pageSize: this[activeName].pagination.pageSize,
			};
			return data;
		},
	},
	watch: {
		activeName() {
			this.loadData();
		},
	},
	methods: {
		// 导出EXCEL
		batchExport() {
			exportExcel('/mgmt/inventory/remit/exportManualInputRemitList', this.loadDataPost);
		},
		// 搜索
		handleSearch() {
			const { activeName } = this;
			this[activeName].pagination.currentPage = 1;
			this.loadData();
		},
		// 手工录入
		handInput() {
			this.inputDialogVisible = true;
		},
		// 翻页操作
		handleChangePage(page) {
			const { activeName } = this;
			this[activeName].pagination.currentPage = page;
			this.loadData();
		},
		// 切换每页条数
		handleSizeChange(pageSize) {
			const { activeName } = this;
			this[activeName].pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 详情
		detail(row) {
			console.log('详情');
			console.log(row, 'row');
			this.handInputProps = { show: true, type: 1, ...row };
			console.log(this.handInputProps);
		},
		// 审核操作
		audit(row) {
			this.handInputProps = {
				show: true,
				type: 2,
				...row,
				verifyResult: '',
			};
		},
		closeHandInputPop() {
			this.inputDialogVisible = false;
			this.handInputProps.show = false;
		},
		// 获取银行列表
		async loadBankList() {
			const res = await this.$fetch(`/crm/member/serviceCompany/bankOfDeposit?type=openBankCode`);
			if (res && res.data) {
				this.HAND_INPUT_FLOW_SEARCH_CONFIG.form[3].options = res.data.map(item => {
					BANK_TYPE[item.code] = item.name;
					return {
						value: item.name,
						label: item.name,
					};
				});
			} else {
				this.$message.warning('获取银行列表失败');
			}
		},
		// 获取手工款项类型
		async loadHandPaymentType() {
			const res = await this.$fetch(`/mgmt/inventory/remit/getSourceTypeByRemitType?remitType=2`);
			if (res && res.data) {
				this.HAND_INPUT_FLOW_SEARCH_CONFIG.form[2].options = res.data.map(({ type, name }) => {
					PAYMENT_TYPE_HANDLE[type] = name;
					return {
						label: name,
						value: type,
					};
				});
			}
		},
		// 获取手工录入流水列表数据
		async loadData() {
			const { activeName } = this;
			this[activeName].loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/inventory/remit/pageSearchList',
				data: this.loadDataPost,
			});
			this[activeName].loading = false;
			if (res && res.data) {
				const { list, total } = res.data;
				this[activeName].list = list;
				this[activeName].total = total;
				if (list.length === 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取银行流水列表数据失败');
			}
		},
	},
	mounted() {
		this.loadHandPaymentType();
		this.loadData();
		this.loadBankList();
		this.$listen('CLOSE_HAND_INPUT_POP', this.closeHandInputPop);
		this.$listen('UPDATE_HAND_INPUT_FLOW_LIST', this.loadData);
	},
};
</script>
