<template>
	<div>
		<guideBar>
			<el-button v-permission="'black_list_add'" type="primary" @click="addList">新增黑名单</el-button>
			<el-button v-permission="'black_list_batch_add'" type="primary" @click="batchAdd">批量新增</el-button>
			<el-button v-permission="'black_list_export_excel'" type="primary" @click="getExcel">导出EXCEL</el-button>
		</guideBar>
		<el-card class="mb-16">
			<search-panel v-model="searchConfig" :config="BLACK_LIST_CONGIF" @search="handleSearchProduct" />
		</el-card>
		<el-card>
			<table-list
				:dataSource="bindList"
				:columns="BLACK_LIST_COLUMNS"
				:options="bindOptions"
				:pagination="bindPagination"
				:dataTotal="bindPagination.total"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button v-permission="'black_list_modify'" type="text" class="button" @click="editList(scope.data)">
						修改
					</el-button>
					<el-button
						v-permission="'black_list_drop'"
						v-if="scope.data.status !== 2"
						type="text"
						class="button"
						@click="invalid(scope.data.id)"
					>
						作废
					</el-button>
				</template>
			</table-list>
		</el-card>
		<el-dialog
			:title="edit ? '修改黑名单' : '新增黑名单'"
			:visible.sync="showDialog"
			:before-close="cancel"
			center
			v-drag
			width="650px"
		>
			<el-row class="listTip" v-show="blackForm.cardNo && !edit">填写会员卡号，且新增黑名单成功后，该卡相关权限将被限制。</el-row>
			<el-form :model="blackForm" :rules="rules" ref="blackForm" label-width="120px" class="banner-form">
				<el-form-item label="会员卡号:" prop="cardNo">
					<el-input
						size="mini"
						v-model="blackForm.cardNo"
						@blur="queryMemberInfo"
						class="banner-input"
						clearable
						:readonly="edit"
					/>
				</el-form-item>
				<el-form-item label="姓名:" prop="realname">
					<el-input size="mini" v-model="blackForm.realname" class="banner-input" />
				</el-form-item>
				<el-form-item label="证件类型:" prop="certificatesType">
					<el-select v-model="blackForm.certificatesType" size="small" class="banner-input">
						<el-option label="身份证" :value="1">身份证</el-option>
						<el-option label="其它" :value="2">其它</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="证件号码:" prop="certificatesNo">
					<el-input
						size="mini"
						maxlength="18"
						v-model="blackForm.certificatesNo"
						class="banner-input"
						clearable
						:readonly="edit"
					/>
				</el-form-item>
				<el-form-item label="到期时间:" prop="expireDate">
					<el-date-picker
						class="banner-input"
						v-model="blackForm.expireDate"
						type="date"
						value-format="timestamp"
						clearable
						placeholder="选择日期"
					></el-date-picker>
				</el-form-item>
				<el-row class="listTip">黑名单限制是指生效后，该证件类型将被限制不能新开会员卡</el-row>
				<el-row type="flex" justify="center" align="center">
					<el-button type="primary" @click="addAndSave">{{ edit ? '保存' : '新增' }}</el-button>
					<el-button @click="cancel">取消</el-button>
				</el-row>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import { BLACK_LIST_CONGIF, BLACK_LIST_COLUMNS, BLACK_LIST_RULES } from './config';
import { exportExcel } from '../../util/index';

export default {
	name: 'blackList',
	data() {
		return {
			BLACK_LIST_CONGIF,
			BLACK_LIST_COLUMNS,
			bindList: [],
			bindPagination: {
				total: 0,
				currentPage: 1,
				pageSize: 20,
			},
			searchConfig: {
				cardNo: '',
				time: [],
				status: '',
				certificatesNo: '',
				realname: '',
			},
			bindOptions: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			showDialog: false,
			blackForm: {
				cardNo: '',
				realname: '',
				certificatesNo: '',
				certificatesType: '',
				commitDate: '',
				expireDate: null,
				id: null,
				status: null,
			},
			rules: BLACK_LIST_RULES,
			edit: false,
		};
	},
	computed: {
		searchData() {
			const { time = ['', ''] } = this.searchConfig;
			const { searchConfig, bindPagination } = this;
			const params = {
				...searchConfig,
				...bindPagination,
				commitDateBegin: time[0],
				commitDateEnd: time[1],
				pageNum: bindPagination.currentPage,
			};
			delete params.total;
			delete params.currentPage;
			delete params.time;
			return params;
		},
	},
	created() {
		this.getBlackList();
	},
	methods: {
		// 获取黑名单列表
		async getBlackList() {
			const { searchData } = this;
			const res = await this.$fetch({
				method: 'GET',
				url: '/crm/blacklist/getPageBlacklist',
				params: searchData,
			});
			if (res.code == 200) {
				this.bindList = res.data.list;
				this.bindPagination.total = res.data.total;
			}
		},
		// 查询顾客信息
		async queryMemberInfo() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/member/mgmt/getMasterMemberInfoByCardNo?cardNo=' + this.blackForm.cardNo,
			});
			if (res.code == 200) {
				this.$nextTick(() => {
					this.blackForm.realname = res.data.realname;
					this.blackForm.certificatesNo = res.data.certificatesNo;
				});
			}
		},
		// 批量导入
		batchAdd() {
			this.$go('/black_step');
		},
		// 新增黑名单
		addList() {
			this.showDialog = true;
			this.edit = false;
		},
		// 新增保存
		addAndSave() {
			this.$refs['blackForm'].validate(async valid => {
				if (valid) {
					if (this.edit) {
						const res = await this.$fetch({
							method: 'POST',
							url: '/crm/blacklist/updateBlacklist',
							data: {
								id: this.blackForm.id,
								expireDate: this.blackForm.expireDate,
							},
						});
						if (res.code == 200) {
							this.$refs['blackForm'].resetFields();
							this.$message.success(res.message);
							this.$nextTick(() => {
								this.getBlackList();
								this.showDialog = false;
							});
						}
					} else {
						const res = await this.$fetch({
							method: 'POST',
							url: '/crm/blacklist/insertBlacklist',
							data: this.blackForm,
						});
						if (res.code == 200) {
							this.$refs['blackForm'].resetFields();
							this.$message.success(res.message);
							this.$nextTick(() => {
								this.getBlackList();
								this.showDialog = false;
							});
						}
					}
				} else {
					this.$message.error('请填写完整！');
					return false;
				}
			});
		},
		// 取消
		cancel() {
			// this.blackForm = {};
			this.$refs['blackForm'].resetFields();
			this.showDialog = false;
		},
		// 修改
		async editList(row) {
			const res = await this.$fetch({
				method: 'GET',
				url: '/crm/blacklist/getBlacklist/' + row.id,
				data: this.blackForm,
			});
			if (res.code == 200) {
				this.showDialog = true;
				this.edit = true;
				this.$nextTick(() => {
					this.blackForm = res.data;
				});
			}
		},
		// 作废
		invalid(id) {
			this.$confirm('是否确认要作废该条信息', '提示', {
				confirmButtonText: '是',
				cancelButtonText: '否',
				type: 'warning',
			})
				.then(async () => {
					const res = await this.$fetch({
						method: 'POST',
						url: '/crm/blacklist/cancelBlacklist/' + id,
					});
					if (res.code == 200) {
						this.$message.success(res.data);
						this.getBlackList();
					}
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消',
					});
				});
		},
		// 导出excel
		getExcel() {
			const { searchData } = this;
			exportExcel('/crm/blacklist/exportBlacklist', searchData);
		},
		// 分页page
		handleChangePage(currentPage) {
			this.bindPagination.pageNum = currentPage;
			this.getBlackList();
		},
		// 分页size
		handleSizeChange(pageSize) {
			this.bindPagination.pageSize = pageSize;
			this.getBlackList();
		},
		// 搜索
		handleSearchProduct() {
			this.getBlackList();
		},
	},
};
</script>
<style lang="scss" scoped>
.mb-16 {
	margin-bottom: 16px;
}
.button {
	font-size: 12px;
}
.banner-input {
	width: 350px;
}
.listTip {
	font-size: 12px;
	text-align: center;
	margin-bottom: 16px;
	color: red;
}
</style>
