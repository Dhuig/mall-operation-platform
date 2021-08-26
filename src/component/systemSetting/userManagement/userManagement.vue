<template>
	<div>
		<guideBar>
			<el-button
				type="success"
				plain
				icon="el-icon-download"
				v-permission="'user_management_export_whole_users'"
				@click="exportWholeUsers"
			>
				导出所有用户数据
			</el-button>
			<el-button v-permission="'user_management_add'" type="primary" icon="el-icon-plus" @click="createNewUser">
				新增用户
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="USER_MANAGEMENT_CONFIG" @search="search" />
		</el-card>
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="dataSource"
				:columns="USER_MANAGEMENT_COLUMNS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button v-permission="'user_management_edit'" type="text" @click="handleBtnsGruop(scope.data, 'edit')">
						编辑
					</el-button>
					<el-button
						v-permission="'user_management_enable'"
						v-if="scope.data.operatorStatus === 1"
						type="text"
						@click="handleBtnsGruop(scope.data, 'enable')"
					>
						启用
					</el-button>
					<el-button
						v-permission="'user_management_disable'"
						v-if="scope.data.operatorStatus === 0"
						type="text"
						@click="handleBtnsGruop(scope.data, 'disable')"
					>
						禁用
					</el-button>
					<el-button
						v-permission="'user_management_delete'"
						v-if="scope.data.operatorStatus === 1"
						type="text"
						@click="handleBtnsGruop(scope.data, 'delete')"
					>
						删除
					</el-button>
					<el-button
						v-permission="'user_management_reset_password'"
						type="text"
						@click="handleBtnsGruop(scope.data, 'resetPassword')"
					>
						重置密码
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { USER_MANAGEMENT_CONFIG, USER_MANAGEMENT_COLUMNS, USER_MANAGEMENT_STATE } from './config.js';
import qs from 'querystring';
import XLSX from 'xlsx';

export default {
	name: 'userManagement',
	data() {
		return {
			USER_MANAGEMENT_CONFIG,
			USER_MANAGEMENT_COLUMNS,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			pagination: {
				pageNum: 1,
				pageSize: 20,
			},
			searchConfig: {
				operatorNo: null,
				username: null,
				operatorName: null,
				mobile: null,
				phone: null,
				operatorStatus: null,
				roleName: null,
			},
			dataTotal: 0,
			dataSource: [],
			loading: false,
			newPassword: 888888,
		};
	},
	mounted() {
		this.$listen('UPDATE_USER_LIST', this.loadData);
		this.loadData();
	},
	computed: {
		// 搜索参数
		searchFields() {
			const { searchConfig } = this;
			return {
				...searchConfig,
			};
		},
	},
	methods: {
		// 搜索
		search() {
			this.pagination.pageNum = 1;
			this.dataSource = [];
			this.loadData();
		},
		// 导出所有用户数据
		async exportWholeUsers() {
			const params = {
				pageNum: 1,
				pageSize: 5000,
				operatorNo: '',
				username: '',
				operatorName: '',
				mobile: '',
				phone: '',
				operatorStatus: '',
				roleName: '',
			};
			const res = await this.$fetch(`/auth/operator/page?${qs.stringify(params)}`);
			if (res && res?.data?.list) {
				const data = res.data.list
					.concat()
					.map(({ operatorNo, username, operatorName, roleName, mobile, createTime, creatorName, operatorStatus }) => ({
						operatorNo,
						username,
						operatorName,
						roleName,
						mobile,
						createTime: createTime ? new Date(createTime).toLocaleString() : '',
						creatorName,
						operatorStatus: USER_MANAGEMENT_STATE[operatorStatus],
					}));

				data.unshift({
					operatorNo: '工号',
					username: '用户帐号',
					operatorName: '姓名',
					roleName: '角色名称',
					mobile: '手机号码',
					createTime: '创建时间',
					creatorName: '创建人',
					operatorStatus: '状态',
				});

				const book = XLSX.utils.book_new();
				const sheet = XLSX.utils.json_to_sheet(data, {
					header: [
						'operatorNo',
						'username',
						'operatorName',
						'roleName',
						'mobile',
						'createTime',
						'creatorName',
						'operatorStatus',
					],
					skipHeader: true,
				});
				// 设置列宽
				sheet['!cols'] = [1, 1, 1, 0.6, 1.2, 1, 1, 0.6].map(r => ({ wpx: 150 * r }));
				const xlsxName = '用户列表';
				XLSX.utils.book_append_sheet(book, sheet, xlsxName);
				XLSX.writeFile(book, `完美运营后台--${xlsxName}.xlsx`);
			} else {
				this.$message.warning('导出用户数据失败, 请稍后重试');
			}
		},
		// 新建用户
		createNewUser() {
			this.$go('/update_user', { title: '新增用户' });
		},
		handleBtnsGruop(row, handleType) {
			if (handleType === 'edit') {
				this.$go('/update_user', { id: row.id, operatorStatus: row.operatorStatus, title: '编辑用户' });
			} else if (handleType === 'open') {
				row.status = '1';
			} else if (handleType === 'enable') {
				this.enable(row);
			} else if (handleType === 'disable') {
				this.disable(row);
			} else if (handleType === 'resetPassword') {
				const { newPassword } = this;
				const { username, id: userId } = row;

				this.$confirm(
					`确认为帐号 ${username || ''} 进行重置密码操作吗? 重置后密码默认为 ${newPassword}。`,
					'重置密码提示',
					{
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}
				)
					.then(() => {
						this.resetPassword(userId, newPassword);
					})
					.catch(() => {
						this.$message.info('已取消重置密码操作');
					});
			} else if (handleType === 'delete') {
				this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						this.handleDelete(row);
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除',
						});
					});
			}
		},
		// 分页触发事件
		handleChangePage(val) {
			this.pagination.pageNum = val;
			this.loadData();
		},
		// 分页下拉触发事件
		handleSizeChange(val) {
			this.pagination.pageSize = val;
			this.loadData();
		},
		// 删除
		async handleDelete(row) {
			const id = row.id;
			const res = await this.$fetch({
				method: 'DELETE',
				url: `/auth/operator/del?id=${id}`,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message || '操作成功',
				});
				this.loadData();
				// this.$log({ module: '用户管理', content: '删除用户' });
			} else {
				this.$message({
					type: 'error',
					message: res.data.message,
				});
			}
			this.loading = false;
		},
		// 禁用
		async disable(row) {
			const data = {
				id: row.id,
			};
			let state = 'error';
			const res = await this.$fetch({
				method: 'POST',
				url: `/auth/operator/disable`,
				data,
			});
			if (res && res.code === 200) {
				this.loadData();
				state = 'success';
			}
			this.$message({
				type: state,
				message: res.message,
			});
			// this.$log({ module: '用户管理', content: '禁用用户' });
			this.loading = false;
		},
		// 启用
		async enable(row) {
			const data = {
				id: row.id,
			};
			const res = await this.$fetch({
				method: 'POST',
				url: `/auth/operator/enable`,
				data,
			});
			if (res && res.code === 200) {
				this.loadData();
			}
			this.$message({
				type: 'success',
				message: res.message,
			});
			// this.$log({ module: '用户管理', content: '启用用户' });
			this.loading = false;
		},
		// 请求用户列表
		async loadData() {
			const {
				searchFields,
				pagination: { pageNum, pageSize },
			} = this;
			this.loading = true;
			const params = {
				pageNum,
				pageSize,
				...searchFields,
			};
			const res = await this.$fetch(`/auth/operator/page?${qs.stringify(params)}`);
			if (res.code == 200) {
				if (res.data.list.length == 0) {
					this.dataTotal = 0;
					this.dataSource = [];
					this.$message.warning('查询到的用户数据为空');
				} else {
					this.dataSource = res.data.list;
					this.dataTotal = res.data.total;
				}
			} else {
				this.dataTotal = 0;
				this.dataSource = [];
				this.$message.warning('查询到的用户数据为空');
			}
			this.loading = false;
		},
		// 重置密码操作
		async resetPassword(userId, newPassword) {
			if (!userId) return this.$message.warning('用户 id 为空, 无法执行重置密码操作');

			const data = {
				userId,
				newPassword,
			};
			const res = await this.$fetch({
				method: 'POST',
				url: `/auth/operator/resetPassword`,
				data,
			});
			if (res && res.code === 200) {
				this.$message.success(res.message);
				this.loadData();
			} else {
				this.$message.warning('重置密码失败, 请稍后再试');
			}
		},
	},
};
</script>
