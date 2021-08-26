<template>
	<div>
		<guideBar>
			<el-button
				v-permission="'role_management_exportexcel'"
				type="success"
				plain
				icon="el-icon-download"
				@click="exportWholeRoles"
			>
				导出Excel
			</el-button>
			<el-button v-permission="'role_management_add'" type="primary" @click="addRole" icon="el-icon-plus">
				新增角色
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="ROLE_MANAGEMENT_CONFIG" @search="handelSearch" />
		</el-card>

		<el-card>
			<tableList
				:loading="loading"
				:dataSource="dataSource"
				:columns="ROLE_MANAGEMENT_COLUMNS"
				:pagination="pagination"
				:dataTotal="total"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button
						v-permission="'role_management_delete'"
						type="text"
						v-if="scope.data.roleStatus === 1"
						@click="handleBtnsGruop(scope.data, 'delete')"
					>
						删除
					</el-button>
					<el-button
						v-permission="'role_management_edit'"
						type="text"
						v-if="scope.data.roleStatus !== 1"
						@click="handleBtnsGruop(scope.data, 'edit')"
					>
						编辑
					</el-button>
					<el-button
						v-permission="'role_management_detail'"
						type="text"
						v-if="scope.data.roleStatus !== 1"
						@click="handleBtnsGruop(scope.data, 'detail')"
					>
						详情
					</el-button>
					<el-button
						v-permission="'role_management_enable'"
						type="text"
						v-if="scope.data.roleStatus === 1"
						@click="handleBtnsGruop(scope.data, 'open')"
					>
						启用
					</el-button>
					<el-button
						v-permission="'role_management_disable'"
						type="text"
						v-if="scope.data.roleStatus === 0"
						@click="handleBtnsGruop(scope.data, 'close')"
					>
						禁用
					</el-button>
					<el-button v-permission="'role_management_copy'" type="text" @click="handleBtnsGruop(scope.data, 'copy')">
						复制
					</el-button>
				</template>
			</tableList>
		</el-card>

		<el-dialog title="提示" :visible.sync="centerDialogVisible" width="20%" class="dialog-box" v-drag>
			<span>{{ dialogContent }}</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">取 消</el-button>
				<el-button type="primary" @click="openDialog">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { ROLE_MANAGEMENT_CONFIG, ROLE_MANAGEMENT_COLUMNS } from './config';
import qs from 'querystring';
import { exportExcel } from 'util';

export default {
	name: 'roleManagement',
	data() {
		return {
			ROLE_MANAGEMENT_CONFIG,
			ROLE_MANAGEMENT_COLUMNS,
			searchConfig: {
				roleName: '',
				roleStatus: '',
				registrationTime: [],
			},
			loading: false,
			dataSource: [],
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			total: 0,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			centerDialogVisible: false, // 弹窗是否显示
			dialogContent: '', // 弹窗内容
			type: '', // 操作栏类型
			rowId: '', // 每行数据id
		};
	},
	computed: {
		// 搜索参数
		searchFields() {
			const { searchConfig } = this;
			return {
				...searchConfig,
				registrationTime: (searchConfig.registrationTime || ['', '']).join(','),
			};
		},
	},
	methods: {
		// 导出
		exportWholeRoles() {
			exportExcel('/auth/role/export', this.searchFields);
		},
		handleBtnsGruop(row, handleType) {
			switch (handleType) {
				case 'delete':
					//删除
					this.centerDialogVisible = true;
					this.dialogContent = '确定要删除吗？';
					this.type = handleType;
					this.rowId = row.id;
					break;
				case 'detail':
					//编辑
					this.$go('update_role', { title: '编辑角色', id: row.id });
					break;
				case 'edit':
					//编辑
					this.$go('update_role', { title: '编辑角色', id: row.id, editState: 1 });
					break;
				case 'open':
					// 启用
					this.centerDialogVisible = true;
					this.dialogContent = '确定要启用吗？';
					this.type = handleType;
					this.rowId = row.id;
					break;
				case 'close':
					// 禁用
					this.centerDialogVisible = true;
					this.dialogContent = '确定要禁用吗？';
					this.type = handleType;
					this.rowId = row.id;
					break;
				case 'copy':
					// 禁用
					this.openCopyInquiryModal(row);
					break;
				default:
					break;
			}
		},
		// 分页触发事件
		handleChangePage(val) {
			this.pagination.currentPage = val;
			this.getList();
		},
		// 分页下拉触发事件
		handleSizeChange(val) {
			this.pagination.pageSize = val;
			this.getList();
		},
		// 搜索
		handelSearch() {
			this.pagination.currentPage = 1;
			this.getList();
		},
		// 弹窗-取消
		closeDialog() {
			this.centerDialogVisible = false;
		},
		// 弹窗-确认
		openDialog() {
			this.centerDialogVisible = false;
			switch (this.type) {
				case 'delete':
					//删除
					this.delete(this.rowId);
					break;
				case 'open':
					//开启
					this.open(this.rowId);
					break;
				case 'close':
					// 禁用
					this.close(this.rowId);
					break;
				default:
					break;
			}
		},
		// 打开复制角色询问
		openCopyInquiryModal({ id: roleId, roleName }) {
			this.$confirm(`确认复制角色${`: [${roleName}] ` || ''}吗?`, '复制角色提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					const newRoleName = `${roleName}的副本`;
					this.copyRole({ roleId, newRoleName });
				})
				.catch(() => {
					this.$message.info('已取消复制角色操作');
				});
		},
		// 复制角色
		async copyRole(params) {
			if (!params || !params.roleId || !params.newRoleName) return;

			const res = await this.$fetch({
				method: 'POST',
				url: `/auth/role/copyRole?${qs.stringify(params)}`,
			});
			if (res && res.code === 200) {
				this.$message.success(res.message);
				this.$nextTick(this.getList);
			} else {
				this.$message.warning(res.data.message);
			}
		},
		// 开启角色
		async open(id) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/auth/role/enable',
				data: {
					id,
				},
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
			// 更新列表
			this.getList();
		},
		// 禁用角色
		async close(id) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/auth/role/disable',
				data: {
					id,
				},
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
			// 更新列表
			this.getList();
		},
		// 删除角色
		async delete(id) {
			const res = await this.$fetch({
				method: 'DELETE',
				url: '/auth/role/del',
				params: {
					id,
				},
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
			// 更新列表
			this.getList();
		},
		// 新增角色
		addRole() {
			this.$go('update_role', { title: '新增角色' });
		},
		// 请求数据
		async getList() {
			this.loading = true;
			const {
				pagination: { currentPage: pageNum, pageSize },
				searchFields,
			} = this;

			const params = {
				pageNum,
				pageSize,
				...searchFields,
			};
			const res = await this.$fetch(`/auth/role/page?${qs.stringify(params)}`);

			if (res.code === 200) {
				const { list, total } = res.data;
				this.dataSource = list;
				this.total = total;
			} else {
				this.dataSource = [];
				this.total = 0;
			}
			this.loading = false;
		},
	},
	created() {
		this.getList();
		this.$listen('UPDATE_ROLE_MANGEMENT_LIST', this.getList);
	},
};
</script>
