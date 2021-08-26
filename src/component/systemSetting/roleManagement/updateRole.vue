<template>
	<div>
		<guideBar>
			<el-button
				type="success"
				plain
				icon="el-icon-document-checked"
				v-permission="'update_role_export_whole_roles_permission'"
				@click="exportRoleAuthInExcel"
			>
				导出角色权限表
			</el-button>
			<!-- <el-button type="primary" plain icon="el-icon-edit" @click="allowToEdit" v-if="disableEdit">编辑</el-button> -->
		</guideBar>
		<el-card>
			<el-form
				ref="ruleForm"
				:model="ruleForm"
				label-width="100px"
				label-position="right"
				label-suffix=":"
				:rules="ROLE_MANAGEMENT_FORM_RULES"
				size="small"
				class="form"
				:disabled="disableEdit"
			>
				<!-- 头部 -->
				<el-row class="row-gap">
					<el-col :span="8">
						<el-form-item label="角色名称" prop="roleName">
							<el-input v-model="ruleForm.roleName" placeholder="请输入角色名称" clearable />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="状态" prop="roleStatus">
							<el-select v-model="ruleForm.roleStatus" placeholder="请选择状态" class="adapt-width">
								<el-option label="启用" :value="0" />
								<el-option label="禁用" :value="1" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="所属服务" prop="systemId">
							<el-select v-model="ruleForm.systemId" placeholder="请选择所属服务" class="adapt-width">
								<el-option v-for="{ label, value } in systemOptions" :key="value" :label="label" :value="value" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="16">
						<el-form-item label="描述" prop="remark">
							<el-input
								type="textarea"
								placeholder="请输入"
								show-word-limit
								maxlength="150"
								:rows="5"
								resize="none"
								v-model="ruleForm.remark"
								class="self-textarea"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- 菜单权限树 -->
				<el-row>
					<el-col :span="16">
						<el-form-item label="角色权限">
							<el-input
								size="mini"
								v-model="filterText"
								class="row-gap"
								clearable
								:rows="5"
								prefix-icon="el-icon-search"
								placeholder="输入菜单名以进行筛选"
							/>
							<el-tree
								ref="tree"
								:data="data"
								:props="menuTreeProps"
								node-key="treeId"
								show-checkbox
								highlight-current
								@check1="handleTreeCheck"
								:filter-node-method="filterNode"
								:default-checked-keys="assoicatedPermission"
								empty-text="暂无菜单数据"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<!-- 底部按钮 -->
		<actionBar>
			<el-button type="primary" @click="resetForm('ruleForm')" v-if="disableEdit" icon="el-icon-back">返回</el-button>
			<template v-else>
				<!-- <el-button plain @click="cancelEditStatus" v-if="!isAddData" icon="el-icon-close">取消</el-button> -->
				<el-button plain @click="resetForm('ruleForm')" icon="el-icon-back">返回</el-button>
				<el-button
					type="primary"
					plain
					v-if="!disableEdit && checkUpdateRole"
					@click="updateRoleDetail"
					icon="el-icon-check"
				>
					保存
				</el-button>
			</template>
		</actionBar>
	</div>
</template>

<script>
import { ROLE_MANAGEMENT_FORM_RULES } from './config';
import XLSX from 'xlsx';

export default {
	name: 'updateRole',
	data() {
		return {
			ROLE_MANAGEMENT_FORM_RULES,
			isAddData: true, // 新增/编辑
			disableEdit: true, // 表单编辑状态
			ruleForm: {
				roleName: '', // 角色名称
				roleStatus: 0, // 状态
				systemId: '', // 所属服务
				remark: '', // 描述
				list: [], // 分配权限
			},
			data: [],
			filterText: '',
			menuTreeProps: {
				children: 'children',
				label: 'menuName',
			},
			systemOptions: [{ label: '商城后台', value: '1' }], // 所属服务下拉数据
			assoicatedPermission: [], // 关联的权限id列表
		};
	},
	watch: {
		filterText(val) {
			this.$refs.tree.filter(val);
		},
		['ruleForm.systemId'](systemId) {
			this.fetchPermissionBySystemId(systemId);
		},
	},
	computed: {
		// 检测是否有新增或编辑权限
		checkUpdateRole() {
			const { id = '' } = this.$route.query;
			if (id) {
				return this.$permission('role_management_edit');
			} else {
				return this.$permission('role_management_add');
			}
		},
	},
	methods: {
		// 允许编辑
		allowToEdit() {
			this.disableEdit = false;
			!this.isAddData && this.$message.warning('已启用角色编辑状态, 点击取消按钮可取消编辑状态');
		},
		// 取消编辑状态
		cancelEditStatus() {
			this.disableEdit = true;
		},
		// 导出权限角色表
		exportRoleAuthInExcel() {
			const origin = JSON.parse(JSON.stringify(this.$refs.tree.data));
			const rolePermission = [];
			const TYPE_MAP = { menu: '页面访问', button: '按钮显示' };
			const { assoicatedPermission: assoicateList } = this;
			function recursive(menu, result, firsetName, sencondName) {
				menu.forEach(item => {
					const { menuName = '', menuLevel, type, treeId, children } = item;
					firsetName = menuLevel !== 0 ? firsetName : menuName.replace(/运营后台-/g, '');
					sencondName = menuLevel !== 1 ? sencondName : menuName;
					let thirdname = menuLevel === null ? menuName : menuLevel === 2 ? menuName : '';
					if (menuLevel !== 0) {
						result.push({
							...{
								firsetName,
								sencondName,
								thirdname,
							},
							status: assoicateList.indexOf(treeId) !== -1 ? '✓' : '✕',
							type: TYPE_MAP[type],
						});
					} else {
						result.push({
							firsetName,
							sencondName: '',
							thirdname: '',
							status: '',
							type: '',
						});
					}
					if (children && children.length) {
						recursive(children, result, firsetName, sencondName);
					}
				});
				return result;
			}
			recursive(origin, rolePermission, '', '');
			// 生成 excel文档并下载
			try {
				rolePermission.unshift({
					firsetName: '一级模块',
					sencondName: '二级模块',
					thirdname: '三级模块/按钮',
					status: '权限',
					type: '权限类型',
				});
				const book = XLSX.utils.book_new();
				const sheet = XLSX.utils.json_to_sheet(rolePermission, {
					header: ['firsetName', 'sencondName', 'thirdname', 'status', 'type'],
					skipHeader: true,
				});
				// 设置列宽
				sheet['!cols'] = [1, 1.5, 1, 0.6, 0.6].map(r => ({ wpx: 150 * r }));
				const xlsxName = this.ruleForm.roleName || Date.now();
				XLSX.utils.book_append_sheet(book, sheet, xlsxName);
				XLSX.writeFile(book, `完美运营后台角色权限表--${xlsxName}.xlsx`);
			} catch (err) {
				this.$message.warning(err.toString());
			}
		},
		// 树表查询回调
		filterNode(value, data) {
			if (!value) return true;
			return data.menuName.indexOf(value) !== -1;
		},
		// 自定义权限树的选择回调
		handleTreeCheck(currentNode, treeStatus) {
			/**
			 * @des 根据父元素的勾选或取消勾选，将所有子级处理为选择或非选中状态
			 * @param { node: Object }  当前节点
			 * @param { status: Boolean } （true ： 处理为勾选状态 ； false： 处理非选中）
			 */
			const setChildStatus = (node, status) => {
				/* 这里的 id children 也可以是其它字段，根据实际的业务更改 */
				this.$refs.tree.setChecked(node.treeId, status);
				if (node.children) {
					/* 循环递归处理子节点 */
					for (let i = 0; i < node.children.length; i++) {
						setChildStatus(node.children[i], status);
					}
				}
			};
			/* 设置父节点为选中状态 */
			const setParentStatus = nodeObj => {
				/* 拿到tree组件中的node,使用该方法的原因是第一次传入的 node 没有 parent */
				const node = this.$refs.tree.getNode(nodeObj);
				if (node.parent.key) {
					this.$refs.tree.setChecked(node.parent, true);
					setParentStatus(node.parent);
				}
			};

			/* 判断当前点击是选中还是取消选中操作 */
			if (treeStatus.checkedKeys.includes(currentNode.treeId)) {
				setParentStatus(currentNode);
				setChildStatus(currentNode, true);
			} else {
				/* 取消选中 */
				if (currentNode.children) {
					setChildStatus(currentNode, false);
				}
			}
		},
		// 展示已选择的菜单权限树的节点
		updateRoleDetail() {
			this.ruleForm.list = this.$refs.tree.getCheckedNodes().map(({ id, type }) => ({ id, type }));
			this.$refs.tree.getHalfCheckedNodes().map(item => {
				this.ruleForm.list.push({
					id: item.id,
					type: item.type,
				});
			});
			if (this.isAddData) {
				// 新增
				this.$refs['ruleForm'].validate(async valid => {
					if (valid) {
						await this.addRole(this.ruleForm);
						// 更新列表页列表数据
						this.$nextTick(() => {
							this.$dispatch('UPDATE_ROLE_MANGEMENT_LIST');
							this.$closeSelf();
						});
					}
				});
			} else {
				// 编辑
				this.$refs['ruleForm'].validate(async valid => {
					if (valid) {
						await this.editRole(this.ruleForm);
						// 更新列表页列表数据
						this.$nextTick(() => {
							this.$dispatch('UPDATE_ROLE_MANGEMENT_LIST');
							this.$closeSelf();
						});
					}
				});
			}
		},
		// 根据系统id获取全部权限
		async fetchPermissionBySystemId(systemId) {
			const res = await this.$fetch(`/auth/role/permissions/unbounded?systemId=${systemId}`);
			if (res && res.data) {
				this.data = this.clearTreeData(res.data);
			} else {
				this.$message.warning('获取系统权限数据失败');
			}
		},
		// 过滤禁用权限
		clearTreeData(d) {
			const toListDF = function (tree) {
				for (var i in tree) {
					var node = tree[i];
					if (node.menuStatus === 1) {
						console.log('node:', node);
						tree.splice(i, 1);
					} else if (node.children.length !== 0) {
						toListDF(node.children);
					}
				}
			};
			toListDF(d);
			return d;
		},
		// 获取角色详情信息
		async fetchRoleDetail(id) {
			if (!id) return this.$message.warning('角色 Id 为空, 无法获取角色详细数据');

			const res = await this.$fetch(`/auth/role?id=${id}`);
			if (res && res.data) {
				const { roleName, roleStatus, systemId, remark } = res.data;
				this.ruleForm = {
					...this.ruleForm,
					roleStatus,
					roleName,
					systemId,
					remark,
					id,
				};
				this.changeCoachList(systemId, id);
			} else {
				this.$message.warning('获取角色详细数据失败');
			}
		},
		setDefaultCheckList(d) {
			const listData = this.treeToList(this.data);
			const defaultCheckList = [];
			d.forEach(v => {
				const treeObj = listData.find(i => i.id === v.id && i.type === v.type);
				if (treeObj && treeObj.lastChildren) {
					defaultCheckList.push(treeObj.treeId);
				}
				if (treeObj && !treeObj.lastChildren) {
					const fnode = this.$refs.tree.getNode(treeObj.treeId);
					if (fnode) {
						fnode.indeterminate = true;
						fnode.checked = true;
					}
				}
			});
			this.assoicatedPermission = defaultCheckList;
		},
		treeToList(tree) {
			const toListDF = function (tree, list, parentId) {
				for (var i in tree) {
					var node = tree[i];
					list.push({
						id: node.id,
						treeId: node.treeId,
						menuName: node.menuName,
						parentId: parentId,
						type: node.type,
						lastChildren: node.children.length === 0,
						childrenLength: node.children.length,
					});
					if (node.children.length !== 0) {
						toListDF(node.children, list, node.id);
					}
				}
			};
			const list = [];
			for (var i in tree) {
				var node = tree[i];
				list.push({
					id: node.id,
					treeId: node.treeId,
					menuName: node.menuName,
					parentId: 0,
					type: node.type,
					lastChildren: node.children.length === 0,
					childrenLength: node.children.length,
				});
				if (node.children.length !== 0) {
					toListDF(node.children, list, node.id);
				}
			}
			return list;
		},
		// 获取角色关联的权限
		async fetchAssoicationPermisison(id) {
			if (!id) return;

			const res = await this.$fetch(`/auth/role/permissions/authorized?id=${id}`);
			if (res && res.data) {
				this.setDefaultCheckList(res.data);
			} else {
				this.$message.warning('获取角色关联权限数据失败');
			}
		},
		// 控制执行顺序
		async changeCoachList(systemId, id) {
			await this.fetchPermissionBySystemId(systemId);
			this.fetchAssoicationPermisison(id);
		},
		// 新增角色
		async addRole(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/auth/role/addRole',
				data,
			});
			if (res && res.code === 200) {
				this.$message.success(res.message);
			} else {
				this.$message.warning(res.data.message);
			}
		},
		// 编辑角色
		async editRole(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/auth/role/updateRole',
				data,
			});
			if (res && res.code === 200) {
				this.$message.success(res.message);
			} else {
				this.$message.warning(res.data.message);
			}
		},
		// 取消
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.$closeSelf();
		},
	},
	created() {
		const { id = '', editState } = this.$route.query;
		this.ruleForm.systemId = '1';
		if (Number(editState)) {
			this.disableEdit = false;
		}
		if (id) {
			// 编辑
			this.isAddData = false;
			this.fetchRoleDetail(id);
		} else {
			// 新增
			this.isAddData = true;
			// 手动调用一下 切换编辑状态方法
			this.$nextTick(this.allowToEdit);
		}
	},
};
</script>
<style lang="scss" scoped>
.row-gap {
	margin-bottom: 16px;
}
.adapt-width {
	width: 100%;
}
</style>
