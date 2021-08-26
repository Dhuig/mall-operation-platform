<template>
	<div>
		<guideBar />
		<el-card v-loading="loading">
			<el-row :gutter="20">
				<el-col :span="24">
					<el-row class="row-gap">
						<el-button
							size="mini"
							icon="el-icon-top"
							:disabled="!current.id"
							@click="updateMenuPosition(current, 'up', current)"
						>
							上移
						</el-button>
						<el-button
							size="mini"
							icon="el-icon-bottom"
							:disabled="!current.id"
							@click="updateMenuPosition(current, 'down')"
						>
							下移
						</el-button>
						<el-button
							size="mini"
							icon="el-icon-upload2"
							:disabled="!current.id"
							@click="updateMenuPosition(current, 'top')"
						>
							置顶
						</el-button>
						<el-button
							size="mini"
							icon="el-icon-download"
							:disabled="!current.id"
							@click="updateMenuPosition(current, 'bottom')"
						>
							置底
						</el-button>
						<el-button size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
					</el-row>
					<el-input size="mini" v-model="filterText" class="filter-input" clearable prefix-icon="el-icon-search" />
					<el-tree
						ref="tree"
						:data="data"
						:props="defaultProps"
						@node-click="editConfig"
						empty-text="暂无菜单数据"
						highlight-current
						:expand-on-click-node="false"
						:filter-node-method="filterNode"
					>
						<span slot-scope="{ node, data }">
							<i :class="SYSTEM_ICON_MAP(data.systemId)" v-if="node.level === 1" />
							<span class="auth-menu">{{ node.label }}</span>
							<!-- [菜单类型] 的控制按钮 -->
							<template v-if="data.type === 'menu'">
								<el-button
									size="mini"
									icon="el-icon-edit"
									:circle="true"
									@click="editMenuItem(node, data)"
									type="primary"
								/>
								<el-button
									size="mini"
									icon="el-icon-delete"
									:circle="true"
									@click="deleteMenuItem(node, data)"
									type="danger"
								/>
								<el-button size="mini" type="text" @click.stop="addSameLevelMenu(node, data)">加同级菜单</el-button>
								<el-button size="mini" type="text" @click.stop="addSubLevelMenu(node, data)">加下级菜单</el-button>
								<el-button size="mini" type="text" @click.stop="addButtonModal(node, data)">加按钮</el-button>

								<template v-if="data.systemId === '2'">
									<template v-if="data.showType === 0">
										<i class="el-icon-monitor icon-gap" />
										<i class="el-icon-mobile-phone icon-gap" />
									</template>
									<template v-else-if="data.showType === 1">
										<i class="el-icon-monitor icon-gap" />
									</template>
									<template v-else-if="data.showType === 2">
										<i class="el-icon-mobile-phone icon-gap" />
									</template>
								</template>
							</template>
							<!-- [按钮类型] 的控制按钮 -->
							<template v-else>
								<el-button
									size="mini"
									icon="el-icon-edit"
									:circle="true"
									@click.stop="editButtonItem(node, data)"
									type="primary"
								/>
								<el-button
									size="mini"
									icon="el-icon-delete"
									:circle="true"
									@click.stop="deleteButtonItem(node, data)"
									type="danger"
								/>
								<el-button
									size="mini"
									type="text"
									@click.stop="toggleButtonStatusInquiry('disable', { id: data.id })"
									v-if="data.menuStatus === 0"
								>
									禁用
								</el-button>
								<el-button
									size="mini"
									type="text"
									@click.stop="toggleButtonStatusInquiry('enable', { id: data.id })"
									v-else
								>
									启用
								</el-button>
								<template v-if="data.systemId === '2'">
									<template v-if="data.showType === 0">
										<i class="el-icon-monitor icon-gap" />
										<i class="el-icon-mobile-phone icon-gap" />
									</template>
									<template v-else-if="data.showType === 1">
										<i class="el-icon-monitor icon-gap" />
									</template>
									<template v-else-if="data.showType === 2">
										<i class="el-icon-mobile-phone icon-gap" />
									</template>
								</template>
							</template>
						</span>
					</el-tree>
				</el-col>
			</el-row>
		</el-card>
		<!-- 新建菜单弹窗 -->
		<el-dialog :title="showMenuTitle" :visible.sync="showMenu" width="550px" v-drag>
			<el-form
				:model="dialogMenuForm"
				:rules="MENU_SETTING_RULES"
				ref="dialogMenuForm"
				class="dialogMenuForm"
				label-width="120px"
				label-position="left"
				label-suffix=":"
			>
				<el-form-item label="菜单名称" prop="menuName">
					<el-input size="mini" v-model="dialogMenuForm.menuName" class="link-input" />
				</el-form-item>
				<el-form-item label="菜单地址" prop="url">
					<el-input size="mini" v-model="dialogMenuForm.url" class="link-input" />
				</el-form-item>
				<el-form-item label="所属系统" prop="systemId" v-if="dialogMenuForm.parentTreeId === 'menu:0'">
					<el-select v-model="dialogMenuForm.systemId" placeholder="请选择所属系统">
						<el-option
							v-for="(option, $idx) in SYSTEM_ID_LIST"
							:key="$idx"
							:label="option.label"
							:value="option.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="状态" prop="menuStatus">
					<el-radio v-model="dialogMenuForm.menuStatus" :label="0">启用</el-radio>
					<el-radio v-model="dialogMenuForm.menuStatus" :label="1">禁用</el-radio>
				</el-form-item>
				<template v-if="dialogMenuForm.systemId === '2'">
					<el-form-item label="客户端" prop="showType">
						<el-checkbox-group v-model="showTypeList" :min="1" :max="2">
							<el-checkbox :label="1">Web</el-checkbox>
							<el-checkbox :label="2">App</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</template>
			</el-form>
			<span slot="footer">
				<el-button @click.stop="cancelAddLink">取 消</el-button>
				<el-button type="primary" @click="confirmMenu" class="mr-16" v-if="showMenuType === 'add'">保存</el-button>
				<el-button type="success" @click="confirmMenuUpdate" class="mr-16" v-if="showMenuType === 'edit'">
					更新
				</el-button>
			</span>
		</el-dialog>
		<!-- 新增按钮弹窗 -->
		<el-dialog :title="showButtonTitle" :visible.sync="showButton" width="550px" v-drag>
			<el-form
				:model="dialogButtonForm"
				:rules="BUTTON_SETTING_RULES"
				ref="dialogButtonForm"
				class="dialogButtonForm"
				label-width="120px"
				label-position="left"
				label-suffix=":"
			>
				<el-form-item label="按钮名称" prop="buttonName">
					<el-input size="mini" v-model="dialogButtonForm.buttonName" class="link-input" />
				</el-form-item>
				<el-form-item label="接口代码" prop="buttonCode">
					<el-input size="mini" type="textarea" v-model="dialogButtonForm.buttonCode" class="link-input" />
				</el-form-item>
				<el-form-item label="状态" prop="buttonStatus">
					<el-radio v-model="dialogButtonForm.buttonStatus" :label="0">启用</el-radio>
					<el-radio v-model="dialogButtonForm.buttonStatus" :label="1">禁用</el-radio>
				</el-form-item>
				<template v-if="dialogButtonForm.systemId === '2'">
					<el-form-item label="客户端" prop="showType">
						<el-checkbox-group v-model="showTypeListForButton" :min="1" :max="2">
							<el-checkbox :label="1">Web</el-checkbox>
							<el-checkbox :label="2">App</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</template>
			</el-form>
			<span slot="footer">
				<el-button @click.stop="cancelButtonModal">取 消</el-button>
				<el-button type="primary" @click.stop="saveButtonModal" class="mr-16" v-if="showButtonType === 'add'">
					保存
				</el-button>
				<el-button type="success" @click="confirmButtonUpdate" class="mr-16" v-else>更新</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { MENU_SETTING_RULES, BUTTON_SETTING_RULES } from './config';
const transformShowTypeMap = {
	0: [1, 2],
	1: [1],
	2: [2],
};

const reverseShowTypeMap = Object.fromEntries(
	Object.entries(transformShowTypeMap).map(([key, val]) => [JSON.stringify(val), key])
);

// 启用/禁用 文本翻译
const displayTextMap = {
	enable: '启用',
	disable: '禁用',
};

const ICON_MAP = {
	2: 'el-icon-s-order service-centre',
	5: 'el-icon-user-solid smart-custom',
	1: 'el-icon-s-claim operation-platform',
};

export default {
	name: 'authManagement',
	data() {
		return {
			MENU_SETTING_RULES,
			BUTTON_SETTING_RULES,
			SYSTEM_ID_LIST: [],
			filterText: '',
			data: [],
			loading: false,
			defaultProps: {
				children: 'children',
				label: 'menuName',
			},
			current: { id: '', type: '' },
			showMenu: false,
			showMenuTitle: '',
			showMenuType: '',
			showMenuLevel: 0,
			showMenuId: '',
			dialogMenuForm: {
				id: '',
				menuName: '',
				url: '',
				menuStatus: 0,
				systemId: '',
				showType: 0,
			},
			showButton: false,
			showButtonTitle: '',
			showButtonType: '',
			showButtonId: '',
			dialogButtonForm: {
				buttonName: '',
				buttonCode: '',
				buttonStatus: 0,
				systemId: '',
				showType: 0,
			},
			showTypeList: [],
			showTypeListForButton: [],
		};
	},
	watch: {
		filterText(val) {
			this.$refs.tree.filter(val);
		},
		showTypeList(showTypeList) {
			const str = JSON.stringify(showTypeList);
			this.dialogMenuForm.showType = str in reverseShowTypeMap ? reverseShowTypeMap[str] : 0;
		},
		showTypeListForButton(showTypeListForButton) {
			const str = JSON.stringify(showTypeListForButton);
			this.dialogButtonForm.showType = str in reverseShowTypeMap ? reverseShowTypeMap[str] : 0;
		},
	},
	methods: {
		SYSTEM_ICON_MAP(systemId) {
			return systemId in ICON_MAP ? ICON_MAP[systemId] : 'el-icon-s-goods other-platform';
		},
		// 编辑菜单
		editConfig(menu) {
			this.current = menu;
		},
		// 树表查询回调
		filterNode(value, data) {
			if (!value) return true;
			return data.menuName.indexOf(value) !== -1;
		},
		// 编辑菜单项目
		editMenuItem(node, data) {
			console.log('node: ', node);
			const { id, href: url, menuName, menuStatus, systemId, showType } = data;
			if (!id) return this.$message('菜单Id不存在 或 无效, 不能继续操作');

			this.showTypeList = showType in transformShowTypeMap ? transformShowTypeMap[showType] : [];
			this.showMenuTitle = '编辑菜单';
			this.showMenuType = 'edit';
			this.showMenuId = id;
			this.dialogMenuForm = {
				...this.dialogMenuForm,
				url,
				menuName,
				menuStatus,
				systemId,
			};
			this.showMenu = true;
		},
		// 删除菜单项目
		deleteMenuItem(node, data) {
			this.$confirm('确认删除此内容?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				callback: action => {
					if (action === 'confirm') {
						this.deleteMenu(data.id);
					}
				},
			});
		},
		// 增加同级菜单
		addSameLevelMenu(node, { id, parentTreeId }) {
			this.showMenuTitle = node.level === 1 ? '新建菜单(目录)' : '新建菜单(子菜单)';
			this.showMenuType = 'add';
			this.showMenuLevel = 0;
			this.showMenu = true;
			this.dialogMenuForm = {
				id: parentTreeId === 'menu:0' ? '' : id,
				menuName: '',
				url: '',
				menuStatus: 0,
				systemId: this.SYSTEM_ID_LIST[0].value,
				parentTreeId,
				showType: 0,
			};
		},
		// 增加下级菜单
		addSubLevelMenu(node, { id }) {
			this.showMenuTitle = '新建菜单(子菜单)';
			this.showMenuType = 'add';
			this.showMenuLevel = -1;
			this.showMenu = true;
			this.dialogMenuForm = {
				id,
				menuName: '',
				url: '',
				menuStatus: 0,
				systemId: this.SYSTEM_ID_LIST[0].value,
				parentTreeId: '',
				showType: 0,
			};
		},
		// 新增按钮
		addButtonModal(node, data) {
			const isServiceMenu = data?.systemId === '2'; // 是否是[门店系统] 的菜单

			this.showButton = true;
			this.showButtonId = data.id;
			this.showButtonTitle = '新建按钮';
			this.showButtonType = 'add';
			this.dialogButtonForm = {
				buttonName: '',
				buttonCode: '',
				buttonStatus: 0,
				showType: 0,
				...(isServiceMenu ? { systemId: '2' } : null), // [门店系统] 的菜单多加 systemId 字段
			};
		},
		// 编辑按钮项目
		editButtonItem(node, data) {
			const { id, buttonCode, menuName: buttonName, menuStatus: buttonStatus, showType, systemId } = data;

			this.showTypeListForButton = showType in transformShowTypeMap ? transformShowTypeMap[showType] : [];
			this.showButton = true;
			this.showButtonId = id;
			this.showButtonTitle = '编辑按钮';
			this.showButtonType = 'edit';
			this.dialogButtonForm = {
				buttonName,
				buttonCode,
				buttonStatus,
				systemId,
			};
		},
		// 删除按钮项目
		deleteButtonItem(node, data) {
			this.$confirm('确认删除此内容?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				callback: action => {
					if (action === 'confirm') {
						this.deleteButton(data.id);
					}
				},
			});
		},
		// 保存新建菜单
		confirmMenu() {
			this.$refs['dialogMenuForm'].validate(valid => {
				if (valid) {
					const {
						showMenuLevel,
						dialogMenuForm: { id, menuName, url, menuStatus, systemId, showType },
					} = this;
					if (showMenuLevel === 0) {
						// 新增同级菜单
						this.insertSameLevelMenu({
							id,
							url,
							menuName,
							menuStatus,
							systemId,
							showType,
						});
					} else if (showMenuLevel === -1) {
						// 新增下级菜单
						this.insertSubLevelMenu({
							id,
							url,
							menuName,
							menuStatus,
						});
					}
				} else {
					return this.$message('请确认关键信息填写正确!');
				}
			});
		},
		// 更新新建菜单
		confirmMenuUpdate() {
			this.$refs['dialogMenuForm'].validate(valid => {
				if (valid) {
					const {
						showMenuId: id,
						dialogMenuForm: { url, menuName, menuStatus, systemId, showType },
					} = this;
					this.updateMenuProperty({
						id,
						url,
						menuName,
						menuStatus,
						systemId,
						showType,
					});
				} else {
					return this.$message('请确认关键信息填写正确!');
				}
			});
		},
		// 取消新建菜单
		cancelAddLink() {
			this.$refs['dialogMenuForm'].resetFields();
			this.showMenu = false;
		},
		// 保存新建按钮
		saveButtonModal() {
			this.$refs['dialogButtonForm'].validate(valid => {
				if (valid) {
					const {
						showButtonId: menuId,
						dialogButtonForm: { buttonCode, buttonName, buttonStatus, systemId, showType },
					} = this;
					// 新建按钮
					this.addButton({
						menuId,
						buttonCode,
						buttonName,
						buttonStatus,
						systemId,
						showType,
					});
				} else {
					return this.$message('请确认关键信息填写正确!');
				}
			});
		},
		// 编辑按钮
		confirmButtonUpdate() {
			this.$refs['dialogButtonForm'].validate(valid => {
				if (valid) {
					const {
						showButtonId: id,
						dialogButtonForm: { buttonCode, buttonName, buttonStatus, systemId, showType },
					} = this;
					// 新建按钮
					this.editButton({
						id,
						buttonCode,
						buttonName,
						buttonStatus,
						systemId,
						showType,
					});
				} else {
					return this.$message('请确认关键信息填写正确!');
				}
			});
		},
		// 关闭新建弹窗
		cancelButtonModal() {
			this.$refs['dialogButtonForm'].resetFields();
			this.showButton = false;
		},
		// 刷新
		refresh() {
			this.loadSystemId();
			this.loadSysAuthTree();
		},
		// 获取系统Id
		async loadSystemId() {
			const res = await this.$fetch('/auth/system/getMenuType');
			if (res && res.data && res.data.length) {
				this.SYSTEM_ID_LIST = res.data.slice();
			} else {
				this.$message.warning('加载系统平台配置失败');
			}
		},
		// 获取系统菜单树
		async loadSysAuthTree() {
			this.loading = true;
			const res = await this.$fetch('auth/menu/tree');
			if (res && res.code === 200 && res.data) {
				const { data } = res;
				this.data = data || [];
			} else {
				this.$message({
					type: 'error',
					message: '获取权限菜单数据失败',
				});
			}
			this.loading = false;
		},
		// 新增同级菜单
		async insertSameLevelMenu({ id, url, menuName, menuStatus, systemId, showType }) {
			const data = {
				id,
				url,
				menuName,
				menuStatus,
				systemId,
				showType,
			};
			const res = await this.$fetch({
				method: 'POST',
				url: '/auth/menu/same',
				data,
			});

			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});

				this.showMenu = false;
				this.$nextTick(this.loadSysAuthTree);
			} else {
				this.$message({
					type: 'error',
					message: '操作失败',
				});
			}
		},
		// 新增下级菜单
		async insertSubLevelMenu({ id, url, menuName, menuStatus }) {
			const data = {
				id,
				url,
				menuName,
				menuStatus,
			};

			const res = await this.$fetch({
				method: 'POST',
				url: '/auth/menu/lower',
				data,
			});

			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});

				this.showMenu = false;
				this.$nextTick(this.loadSysAuthTree);
			} else {
				this.$message({
					type: 'error',
					message: '操作失败',
				});
			}
		},
		// 编辑菜单属性
		async updateMenuProperty(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/auth/menu/update',
				data,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.showMenu = false;
				this.$nextTick(this.loadSysAuthTree);
			} else {
				this.$message({
					type: 'error',
					message: '操作失败',
				});
			}
		},
		// 删除菜单
		async deleteMenu(id) {
			if (!id) return;

			const res = await this.$fetch({
				method: 'DELETE',
				url: `/auth/menu/del?id=${id}`,
			});

			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.$nextTick(this.loadSysAuthTree);
			} else {
				this.$message({
					type: 'error',
					message: '操作失败',
				});
			}
		},
		// 更新菜单位置
		async updateMenuPosition({ id, type }, direction) {
			if (!id) return this.$message.warning('菜单或按钮id不存在,无法继续操作');

			const res = await this.$fetch({
				method: 'POST',
				url: `/auth/menu/${direction}`,
				data: { id, type },
			});

			if (res && res.code === 200) {
				this.$message.success(res.message);
				this.$nextTick(this.loadSysAuthTree);
			} else {
				this.$message.error('操作失败');
			}
		},
		// 新增按钮
		async addButton(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/auth/button/add',
				data,
			});

			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});

				this.showButton = false;
				this.$nextTick(this.loadSysAuthTree);
			} else {
				this.$message({
					type: 'error',
					message: '操作失败',
				});
			}
		},
		// 编辑按钮
		async editButton(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/auth/button/update',
				data,
			});

			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});

				this.showButton = false;
				this.$nextTick(this.loadSysAuthTree);
			} else {
				this.$message({
					type: 'error',
					message: '操作失败',
				});
			}
		},
		// 删除按钮
		async deleteButton(id) {
			if (!id) return this.$message.info('按钮Id 不存在或无效, 无法继续操作');

			const res = await this.$fetch({
				method: 'DELETE',
				url: `/auth/button/del?id=${id}`,
			});

			if (res && res.code === 200) {
				this.$message.success(res.message);
				this.$nextTick(this.loadSysAuthTree);
			} else {
				this.$message.error('操作失败');
			}
		},
		// 启用/禁用 按钮 确认询问
		toggleButtonStatusInquiry(type, data) {
			this.$confirm(`是否确认${displayTextMap[type]}该按钮?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.toggleButtonStatus(type, data);
				})
				.catch(() => {});
		},
		// 启用/禁用 按钮
		async toggleButtonStatus(type, data) {
			const res = await this.$fetch({
				method: 'POST',
				url: `/auth/button/${type}`,
				data,
			});

			if (res && res.code === 200) {
				this.$message.success(res.message);
				this.$nextTick(this.loadSysAuthTree);
			} else {
				this.$message.error('操作失败');
			}
		},
	},
	mounted() {
		this.loadSystemId();
		this.loadSysAuthTree();
	},
};
</script>
<style lang="scss" scoped>
.auth-menu {
	display: inline-block;
	color: $color-body;
	font-size: 15px;
	margin-right: 24px;
	min-width: 220px;
	max-width: 220px;
	&:hover {
		color: $primary;
	}
}
.filter-input {
	width: 400px;
	margin-right: 5%;
	margin-bottom: 16px;
}
.linkHeadTitle {
	line-height: 56px;
	font-weight: 500;
	border-right: 1px solid #e6e6e6;
}
.service-centre {
	vertical-align: middle;
	font-size: 20px;
	color: #3782ec;
	margin-right: 8px;
}
.smart-custom {
	vertical-align: middle;
	font-size: 20px;
	color: $warning;
	margin-right: 8px;
}
.operation-platform {
	vertical-align: middle;
	font-size: 20px;
	color: $error;
	margin-right: 8px;
}
.other-platform {
	vertical-align: middle;
	font-size: 20px;
	color: $success;
	margin-right: 8px;
}
.link-input {
	max-width: 350px;
}
.row-gap {
	margin-bottom: 16px;
}
.icon-gap {
	margin-left: 8px;
}
</style>
