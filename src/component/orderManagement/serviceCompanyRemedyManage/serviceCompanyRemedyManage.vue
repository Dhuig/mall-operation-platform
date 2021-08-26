<template>
	<div class="service-company-remedy">
		<guideBar />
		<el-card>
			<searchPanel v-model="searchConfig" :config="SERVICE_COMPANY_SEARCH" @search="resetLoad" />
		</el-card>
		<el-card>
			<div class="tool-bar">
				<div class="remedy-time">
					公开补报时间:
					<span class="remedy-info">{{ remedyTime }}</span>
					<el-button
						v-permission="'service_company_remedy_management_setting'"
						size="small"
						@click="handleSetRemedyTime"
						icon="el-icon-setting"
					>
						设置
					</el-button>
					<el-button
						type="text"
						v-permission="'service_company_remedy_management_view_changelog'"
						@click="dialog.visible = true"
					>
						修改记录
					</el-button>
				</div>
				<div class="add">
					<el-upload
						class="upload-demo"
						:on-error="onError"
						:action="axios.defaults.baseURL + '/auth/scenes/permission/importMonthlyReport'"
						name="file"
						:headers="$store.getters['system/getSignatureVerification']"
						accept=".xls, .xlsx"
						:limit="1"
						:show-file-list="false"
						:on-success="handleSuccess"
						:http-request="uploadCustom"
					>
						<el-button
							v-permission="'service_company_remedy_management_add_by_import'"
							class="top-btn-dr"
							type="primary"
							icon="el-icon-sell"
						>
							导入新增
						</el-button>
					</el-upload>
					<!-- <el-button type="primary" @click="handleExportAdd">导入新增</el-button> -->
					<el-button
						v-permission="'service_company_remedy_management_add_one'"
						type="success"
						@click="handleSingleAdd"
						icon="el-icon-circle-plus-outline"
					>
						单独新增
					</el-button>
				</div>
			</div>
			<div class="tool-bar new-bottom-bar">
				<div class="remedy-time">
					补报截止时间:
					<span class="remedy-info">本月{{ abortTime }}日</span>
				</div>
			</div>
			<el-dialog title="设置记录" :visible="dialog.visible" width="50%" @close="dialog.visible = false" v-drag>
				<tableList
					:height="250"
					ref="alterRecordTable"
					:columns="SERVICE_CMMPANY_ALTER_RECORD_COLUMN"
					:dataSource="alterRecordData"
				></tableList>
			</el-dialog>
			<tableList
				:columns="SERVICE_CMMPANY_COLUMN"
				:loading="loading"
				:pagination="pagination"
				:dataTotal="pagination.total"
				:dataSource="dataSource"
				:height="430"
				@loadMore="loadMore"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button
						v-permission="'service_company_remedy_management_reset'"
						v-if="scope.data.status !== 1"
						type="text"
						@click="handleCancel(scope)"
					>
						撤销
					</el-button>
				</template>
			</tableList>
		</el-card>
		<setRemedyTime ref="setRemedyTimeDialog" :formData="formData" :getRemedyTime="this.getRemedyTime" />
	</div>
</template>

<script>
import { SERVICE_COMPANY_SEARCH, SERVICE_CMMPANY_COLUMN, SERVICE_CMMPANY_ALTER_RECORD_COLUMN } from './config';
import { formatDate } from 'util/formValidation.js';
import axios from 'axios';
import setRemedyTime from './setRemedyTime';
import qs from 'querystring';
export default {
	name: 'serviceCompanyRemedyManage',
	data() {
		return {
			SERVICE_COMPANY_SEARCH,
			SERVICE_CMMPANY_COLUMN,
			SERVICE_CMMPANY_ALTER_RECORD_COLUMN,
			searchConfig: {
				carNo: '',
				onMonth: null,
			},
			formData: {},
			remedyTime: '',
			abortTime: '',
			dataSource: [],
			pagination: {
				total: 0,
				currentPage: 1,
				pageSize: 10,
			},
			loading: false,
			dialog: {
				visible: false,
			},
			alterRecordData: [],
			axios,
		};
	},
	computed: {
		// 搜索参数
		searchFields() {
			const { onMonth, ...order } = this.searchConfig;
			let filterDate = !onMonth || onMonth.length > 0 ? '' : formatDate(onMonth, 'month');
			return {
				onMonth: filterDate,
				...order,
			};
		},
	},
	methods: {
		loadMore() {
			const { currentPage, pageSize, total } = this.pagination;
			if (currentPage * pageSize >= total) {
				return this.$message.warning('没有更多数据');
			}
			this.pagination.currentPage++;
			this.getList();
		},
		// 搜索
		resetLoad() {
			this.pagination.currentPage = 1;
			this.dataSource = [];
			this.getList();
		},
		// 分页查询列表
		async getList() {
			const params = {
				...this.searchFields,
				pageNum: this.pagination.currentPage,
				pageSize: this.pagination.pageSize,
			};
			this.loading = true;
			const res = await this.$fetch(`/auth/scenes/permission/pageMonthlyReport?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { list, total } = res.data;
				this.dataSource = this.dataSource.concat(list);
				this.pagination.total = total;
			} else {
				this.$message.error(res.message);
			}
			this.loading = false;
		},
		// 获取公开补报时间
		async getRemedyTime() {
			const res = await this.$fetch('/auth/scenes/permission/getBaseMonthlyReport');
			if (res && res.code === 200) {
				const { data } = res;
				this.remedyTime = data;
			}
		},
		// 获取截止时间
		async getAbortTime() {
			const res = await this.$fetch('/auth/scenes/permission/getBaseMonthlyReportDeadline');
			if (res && res.code === 200) {
				const { data } = res;
				this.abortTime = data;
			}
		},
		// 查询公开补报变更记录
		async getAlterRecord() {
			const res = await this.$fetch('/auth/scenes/permission/log');
			if (res && res.code === 200) {
				const { data } = res;
				this.alterRecordData = data;
			}
		},
		// 点击撤销
		async handleCancel({ data: { id } }) {
			this.$confirm('确定撤销该云商补报权限？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: '/auth/scenes/permission/cancelMonthlyReport',
					data: { id },
				});
				if (res && res.code === 200) {
					this.$message.success('撤销成功');
					this.resetLoad();
				} else {
					res && this.$message.error(res.message);
				}
			});
		},
		// 自定义上传表格
		async uploadCustom(file) {
			const data = new FormData();
			data.append('file', file.file);
			const res = await this.$fetch({
				method: 'POST',
				url: '/auth/scenes/permission/importMonthlyReport',
				data,
			});
			if (res && res.code === 200) {
				this.$message.success('导入成功');
				this.resetLoad();
			}
			if (this.$store.getters['system/getError']) {
				this.$message.error(res.message);
			}
		},
		// 导入成功的回调
		handleSuccess(res) {
			if (res && res.code === 200) {
				this.$message.success('导入成功');
				this.resetLoad();
			}
			if (this.$store.getters['system/getError']) {
				this.$message.error(res.message);
			}
		},
		// 导入失败的回调
		onError() {
			this.$message.error('导入失败');
		},
		// 查询公开补报时间数据
		async getAlterRecordTime() {
			const res = await this.$fetch('/auth/scenes/permission/getBaseMonthlyReportData');
			if (res && res.code === 200) {
				const { data } = res;
				this.formData = data;
			}
		},
		// 设置公开补报时间
		handleSetRemedyTime() {
			this.$refs['setRemedyTimeDialog'].visible = true;
		},
		handleSingleAdd() {
			this.$go('add_service_company_remedy');
		},
		handleChangePage(currentPage) {
			this.pagination.currentPage = currentPage;
			this.getList();
		},
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.getList();
		},
	},
	components: {
		setRemedyTime,
	},
	created() {
		this.resetLoad();
		this.getRemedyTime();
		this.getAbortTime();
		this.getAlterRecord();
		this.getAlterRecordTime();
		this.$listen('GET_SERVER_COMPANY_LIST', this.resetLoad);
	},
};
</script>

<style lang="scss" scoped>
.service-company-remedy {
	.upload-demo {
		margin-right: 10px;
	}
	.remedy-info {
		margin: 0 16px;
		font-size: 14px;
		letter-spacing: 1.4px;
	}
	.tool-bar {
		display: flex;
		justify-content: space-between;
		.add {
			display: flex;
			justify-content: flex-end;
			padding-bottom: 20px;
		}
	}
	.new-bottom-bar {
		margin-bottom: 20px;
	}
}
</style>
