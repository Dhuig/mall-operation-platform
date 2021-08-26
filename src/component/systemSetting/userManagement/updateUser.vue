<template>
	<div>
		<guideBar />
		<el-card>
			<el-form
				:rules="CREATE_NEW_USER_RULES"
				:model="formData"
				label-suffix=":"
				ref="formData"
				class="form--label-left"
				label-width="120px"
				size="small"
			>
				<el-row>
					<el-col :span="8">
						<el-form-item prop="username" label="用户账号">
							<el-input
								v-model="formData.username"
								@blur="checkUsernameAvailable"
								@input="syncUsernameToOperatorNo"
								placeholder="请输入用户账号"
								:clearable="true"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item prop="mobile" label="手机号码">
							<el-input v-model="formData.mobile" maxlength="11" placeholder="请输入手机号码" clearable />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item prop="operatorStatus" label="状态">
							<el-select v-model="formData.operatorStatus" placeholder="请选择状态" class="full-width">
								<el-option :value="0" label="启用" />
								<el-option :value="1" label="禁用" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item prop="operatorName" label="姓名">
							<el-input v-model="formData.operatorName" placeholder="请输入用户姓名" clearable />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item prop="operatorNo" label="工号">
							<el-input
								v-model="formData.operatorNo"
								@blur="checkOperatorNoAvailable"
								placeholder="请输入用户工号"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item prop="phone" label="电话">
							<el-input v-model="formData.phone" placeholder="请输入用户电话" clearable />
						</el-form-item>
					</el-col>
					<el-col :span="16">
						<el-form-item prop="companyCode" label="组织">
							<el-select
								v-model="formData.companyCode"
								@change="handleCompanyChange"
								placeholder="请选择组织, 支持多选/输入筛选"
								class="full-width"
								filterable
								multiple
								clearable
							>
								<el-option v-for="{ id, code, name } in wholeBranchCompanyList" :key="id" :label="name" :value="code" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="16">
						<el-form-item label="备注" prop="remark">
							<el-input
								type="textarea"
								maxlength="200"
								show-word-limit
								resize="none"
								v-model="formData.remark"
								placeholder="可备注用户的特殊信息"
								rows="4"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="16">
						<el-form-item prop="roleIdList" label="角色选择">
							<el-input
								placeholder="可输入角色名进行筛选"
								v-model="roleFilter"
								class="role-filter-gap"
								@input="handleFilterRole"
								clearable
							/>
							<el-card shadow="never" class="role-filter-gap">
								<el-checkbox-group v-model="formData.roleIdList">
									<el-checkbox v-for="{ label, value } in displayRoleList" :label="value" :key="value">
										{{ label }}
									</el-checkbox>
								</el-checkbox-group>
							</el-card>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- 底部控制按钮区 -->
				<actionBar>
					<el-button plain @click="resetForm">取消</el-button>
					<el-button type="primary" plain @click="submitForm" icon="el-icon-check">保存</el-button>
				</actionBar>
			</el-form>
		</el-card>
	</div>
</template>

<script>
import { CREATE_NEW_USER_RULES } from './config';

export default {
	name: 'updateUser',
	data() {
		return {
			id: null,
			CREATE_NEW_USER_RULES,
			memberTypeList: [],
			displayRoleList: [],
			authorizedList: [],
			matchCompanyList: [],
			usernameAvailable: false,
			operatorNoAvailable: false,
			formData: {
				companyCode: [],
				id: null,
				mobile: '',
				operatorName: '',
				operatorNo: '',
				operatorStatus: 0,
				phone: '',
				remark: '',
				roleIdList: [],
				username: '',
			},
			roleFilter: '',
			wholeBranchCompanyList: [],
			comList: [],
		};
	},
	async created() {
		await this.loadRoleData();
		await this.loadWholeBranchCompanyData();

		const { id = '' } = this.$route.query;
		this.id = id;

		if (id) {
			await this.fetchUserDetail(id);
			await this.fetchAuthorizedRole(id);
		}
	},
	methods: {
		// 同步姓名到工号字段
		syncUsernameToOperatorNo(val) {
			this.formData.operatorNo = val;
		},
		// 选择组织回调
		handleCompanyChange() {
			const {
				wholeBranchCompanyList: companyList,
				formData: { companyCode },
			} = this;
			this.matchCompanyList = companyList.filter(({ code }) => companyCode.includes(code));
		},
		// 筛选角色
		handleFilterRole() {
			const { roleFilter, memberTypeList } = this;
			const displayRoleList = memberTypeList.filter(({ label }) => label.indexOf(roleFilter) !== -1);
			this.displayRoleList = displayRoleList;
		},
		// 获取全部分公司(组织)数据
		async loadWholeBranchCompanyData() {
			const res = await this.$fetch('/mgmt/sys/getCompanyList');
			if (res && res.data) {
				if (!res.data.length) return this.$message.warning('获取的分公司数据为空');
				this.wholeBranchCompanyList = res.data.map(({ id, code, name }) => ({ id, code, name }));
			} else {
				this.$message.warning('获取的分公司数据失败');
			}
		},
		// 用户详情
		async fetchUserDetail(id) {
			if (!id) return this.$message.warning('用户 Id 为空, 无法查询用户详情');

			const res = await this.$fetch(`/auth/operator?id=${id}`);
			if (res && res.data) {
				const { id, phone, mobile, remark, username, operatorName, companyCode, operatorNo, operatorStatus } = res.data;
				this.formData = {
					id,
					phone,
					mobile,
					remark,
					username,
					operatorName,
					operatorNo,
					operatorStatus,
					roleIdList: [],
					companyCode: companyCode && companyCode.length ? companyCode.split(',') : [],
				};
			} else {
				this.$message.warning('查询用户详情失败');
			}
		},
		// 获取账号已绑定的角色
		async fetchAuthorizedRole(id) {
			if (!id) return this.$message.warning('用户 Id 为空, 无法查询绑定的角色');

			const res = await this.$fetch(`/auth/role/toOperator/authorized?id=${id}`);
			if (res && res.data && res.data.length) {
				res.data.forEach(({ id }) => {
					this.authorizedList.push(id);
				});
				this.formData.roleIdList = this.authorizedList;
			} else {
				return this.$message.warning('查询绑定的角色失败');
			}
		},
		// 获取对应的系统类型的角色
		async loadRoleData() {
			const res = await this.$fetch('/auth/role/toMember/list?memberType=2');
			if (res && res.data) {
				if (!res.data.length) return this.$message.warning('获取的角色列表为空, 当前暂无角色数据');
				this.memberTypeList = res.data.map(({ roleName: label, id: value }) => ({ label, value }));
				this.displayRoleList = this.memberTypeList;
			} else {
				this.$message.warning('获取的角色数据失败');
			}
		},
		// 取消
		resetForm() {
			this.$refs['formData'].resetFields();
			this.$go('user_management');
		},
		// 校验用户名可用性
		async checkUsernameAvailable() {
			const { username } = this.formData;
			if (!username) return;

			const res = await this.$fetch(`/auth/operator/checkUsername?username=${username}`);
			if (res && res.data) {
				this.$message.warning(res.data.message || '请换一个帐号名');
				this.usernameAvailable = false;
			} else {
				this.$message.success('该账号可使用');
				this.usernameAvailable = true;
			}
		},
		// 检验工号可用性
		async checkOperatorNoAvailable() {
			const { operatorNo } = this.formData;
			if (!operatorNo) return;

			const res = await this.$fetch(`/auth/operator/checkOperatorNo?operatorNo=${operatorNo}`);
			if (res.code !== 200) {
				this.$message.warning(res.data.message);
				this.operatorNoAvailable = false;
			} else {
				// this.$message.success('该工号可使用');
				this.operatorNoAvailable = true;
			}
		},
		// 编辑
		async operatorUpdate(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/auth/operator/updateOp',
				data,
			});
			if (res && res.code === 200) {
				// 更新列表页列表数据
				this.$dispatch('UP_LIST');
				// 关闭编辑/新增页面
				this.$message({
					type: 'success',
					message: res.message,
					onClose: () => {
						this.$dispatch('UPDATE_USER_LIST');
						this.$closeSelf();
					},
				});
			} else {
				this.$message({
					type: 'error',
					message: res.data.message,
				});
			}
		},
		// 新增
		async operatorAdd(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/auth/operator/addOp',
				data,
			});
			if (res && res.code === 200) {
				// 更新列表页列表
				this.$dispatch('UP_LIST');
				// 关闭编辑/新增页面
				this.$message({
					type: 'success',
					message: res.message,
					onClose: () => {
						this.$dispatch('UPDATE_USER_LIST');
						this.$closeSelf();
					},
				});
			} else {
				this.$message({
					type: 'error',
					message: res.data.message,
				});
			}
		},
		// 保存
		submitForm() {
			this.$refs['formData'].validate(async valid => {
				if (valid) {
					this.handleCompanyChange();
					const companyCode = this.matchCompanyList.map(({ code }) => code).join(',');
					const params = {
						...this.formData,
						companyCode,
					};

					if (this.id) {
						this.operatorUpdate(params);
					} else {
						delete params.id;
						this.operatorAdd(params);
					}
				} else {
					return false;
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.full-width {
	width: 100%;
}
.role-filter-gap {
	margin-bottom: 8px;
}
</style>
