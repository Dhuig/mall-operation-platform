<template>
	<div class="contractList">
		<guideBar>
			<el-button v-permission="'service_contract_list_batch_submit'" type="primary" @click="batchSubmit(false)">
				批量提交
			</el-button>
			<el-button v-permission="'service_contract_list_add_contract'" type="primary" @click="addContarct">
				新增合同
			</el-button>
			<el-button v-permission="'service_contract_list_batch_import'" type="primary" @click="batchImport">
				批量导入
			</el-button>
			<el-button v-permission="'service_contract_list_export_excel'" type="primary" @click="batchExport">
				导出EXCEL
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="SERVICE_CENTER_CONTRACT_SEARCH" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				:dataSource="list"
				:columns="SERVICE_CENTER_CONTRACT_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				@handleSelectionChange="handleSelectionChange"
				slotcontent
			>
				<template slot-scope="row">
					<el-button
						v-permission="'service_contract_list_delete'"
						type="text"
						@click="contractDel(row.data)"
						v-if="row.data.signStatus == 5"
					>
						删除
					</el-button>
					<el-button
						v-permission="'service_contract_list_submit'"
						type="text"
						@click="batchSubmit(row.data)"
						v-if="row.data.signStatus == 1"
					>
						提交
					</el-button>
					<el-button
						v-permission="'service_contract_list_detail|service_contract_detail'"
						type="text"
						@click="detail(row.data)"
					>
						详情
					</el-button>
					<!-- <el-button type="text" @click="editContract(row.data)" v-if="row.data.signStatus == 1">
						编辑
					</el-button> -->
				</template>
			</tableList>
		</el-card>
		<el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center class="dialog-box">
			<span>{{ dialogContent }}</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">取 消</el-button>
				<el-button type="primary" @click="openDialog">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {
	SERVICE_CENTER_CONTRACT_SEARCH,
	SERVICE_CENTER_CONTRACT_CONFIG,
	BUILD_SERVICE_CENTRE_CONTRACT_CONFIG,
	CONTRACT_TYPE,
} from './config.js';
import qs from 'querystring';
import { exportExcelPost } from 'util';
export default {
	name: 'contractList',
	data() {
		return {
			SERVICE_CENTER_CONTRACT_SEARCH,
			SERVICE_CENTER_CONTRACT_CONFIG,
			BUILD_SERVICE_CENTRE_CONTRACT_CONFIG,
			searchConfig: {},
			dataTotal: 0,
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			options: {
				selection: true,
			},
			list: [],
			currentRow: {},
			selectRows: [],
			centerDialogVisible: false,
			dialogContent: '',
			loading: false,
			buildContractForm: {},
		};
	},
	mounted() {
		this.loadContractModules();
		this.$nextTick(() => {
			this.loadData();
		});

		this.$listen('CONTRACT_LIST_UPDATE', this.loadData);
	},
	computed: {
		loadDataPost() {
			const { searchConfig } = this;
			const { currentPage, pageSize } = this.pagination;
			let data = {
				...searchConfig,
				pageNum: currentPage,
				pageSize,
			};
			if (data.year) {
				data.year = new Date(data.year).getFullYear();
			}
			return data;
		},
		contractPost() {
			const { buildContractForm } = this;
			let data = {
				...buildContractForm,
			};
			return data;
		},
	},
	methods: {
		// 查询事件
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
		},
		// 分页触发事件
		handleChangePage(val) {
			this.pagination.currentPage = val;
			this.loadData();
		},
		// 分页下拉触发事件
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		//选中项
		handleSelectionChange(rows) {
			this.selectRows.length = 0;
			this.selectRows = rows;
		},
		// 批量提交
		batchSubmit(row) {
			let { selectRows } = this;
			if (row) {
				selectRows.length = 0;
				selectRows.push(row);
			}
			const params = {
				ids: [],
			};
			selectRows.map(v => {
				params.ids.push(v.id);
			});
			if (params.ids.length == 0) {
				this.$message.warning('请选择至少一项');
				return;
			}
			this.$confirm('确认提交？', '提示', {
				confirmButtonText: '确定',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/store/submitContract',
					data: params,
				});
				if (res && res.code === 200) {
					this.loadData();
					this.$message.success('操作成功');
				} else {
					this.$message.error('操作失败');
				}
			});
		},
		// 批量导入
		batchImport() {
			this.$go('service_contract_import');
		},
		importSuccess(res) {
			if (res && res.code === 200) {
				this.loadData();
			}
		},
		// 导出excel
		batchExport() {
			exportExcelPost('/mgmt/store/exportContractList', this.loadDataPost, `服务中心合同列表`);
		},
		// 新增协议
		addContarct() {
			this.$go('service_contract_add');
		},
		// 弹窗-取消
		closeDialog() {
			this.centerDialogVisible = false;
		},
		// 弹窗-确认
		openDialog() {
			this.centerDialogVisible = false;
		},
		// 详情
		detail(row) {
			this.$go('service_contract_detail', { id: row.id });
		},
		// 编辑合同
		editContract(row) {
			this.$go('service_contract_add', { id: row.id });
		},
		// 删除合同
		contractDel(row) {
			this.$confirm('确认删除？', '提示', {
				confirmButtonText: '确定',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: `/mgmt/store/delContract?id=${row.id}`,
				});
				if (res && res.code === 200) {
					this.$message.success('操作成功');
					this.loadData();
				} else {
					this.$message.error('操作失败');
				}
			});
		},
		// 获取合同模板列表
		async loadContractModules() {
			const res = await this.$fetch(`/mgmt/store/queryContractTemplateList`);
			if (res && res.data && res.data.length > 0) {
				this.SERVICE_CENTER_CONTRACT_SEARCH.form[2].options = res.data.map(v => {
					CONTRACT_TYPE[v.templateNo] = v.templateName;
					return {
						value: v.templateNo,
						label: v.templateName,
					};
				});
				console.log(CONTRACT_TYPE);
			} else {
				this.$message.warning('获取合同模板信息失败');
			}
		},
		// 获取数据列表
		async loadData() {
			const params = {
				...this.loadDataPost,
			};
			const res = await this.$fetch(`/mgmt/store/queryContractList?${qs.stringify(params)}`);
			if (res && res.data) {
				const { list, total } = res.data;
				if (list.length == 0) {
					this.$message.warning('暂无数据');
				}
				this.list = list;
				this.dataTotal = total;
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
	},
	watch: {},
};
</script>

<style lang="scss" scoped>
.contractList {
	.upload-button {
		margin: 0 10px;
	}
}
</style>
