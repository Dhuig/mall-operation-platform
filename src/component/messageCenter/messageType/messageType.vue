<template>
	<div>
		<guideBar>
			<el-button class="el-icon-back" type="primary" plain @click="submitForm('ruleForm')">返回</el-button>
		</guideBar>
		<el-card class="card-gap">
			<div class="main-content">
				<div class="title-text">消息类型</div>
				<div class="btn">
					<el-button
						v-permission="'message_type_add_type'"
						class="top-btn"
						type="primary"
						@click="append({}, 'add')"
						icon="el-icon-circle-plus-outline"
					>
						添加类型
					</el-button>
				</div>
				<div class="center-context">
					<el-tree :data="treeData" node-key="id" :expand-on-click-node="false" :props="defaultProps">
						<span class="custom-tree-node" slot-scope="{ node }">
							<span>{{ node.label }}</span>
							<span class="tree-btn">
								<el-button
									v-permission="'message_type_add'"
									type="text"
									size="mini"
									@click="append(node, 'add')"
									v-if="node.id === 1"
								>
									新增
								</el-button>
								<el-button v-permission="'message_type_edit'" type="text" size="mini" @click="append(node, 'edit')">
									编辑
								</el-button>
								<el-button
									v-permission="'message_type_delete'"
									type="text"
									size="mini"
									@click="append(node, 'del')"
									v-if="node.id > 1"
								>
									删除
								</el-button>
							</span>
						</span>
					</el-tree>
				</div>
			</div>
		</el-card>
		<el-dialog title="添加类型" :visible.sync="centerDialogVisible" width="30%" :before-close="close" v-drag>
			<div>
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
					<el-form-item label="消息类型：" prop="dicName">
						<el-col :span="12">
							<el-input
								type="input"
								style="width: 200px"
								v-model="ruleForm.dicName"
								placeholder="请输入消息类型"
							></el-input>
						</el-col>
					</el-form-item>
					<el-form-item label="上级消息类型：" prop="pid">
						<el-select v-model="ruleForm.pid" placeholder="请选择上级消息类型" style="width: 200px">
							<el-option v-for="(item, index) in slect" :key="index" :label="item.dicName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="close">取消</el-button>
				<el-button type="primary" @click="addMsg">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'messageType',
	data() {
		return {
			type: 'add',
			treeData: [],
			slect: [],
			ruleForm: {
				id: '',
				dicValue: '',
				dicName: '',
				pid: '',
				status: '1',
			},
			pid: '',
			rules: {
				dicName: [{ required: true, message: '请输入消息类型', trigger: 'blur' }],
				pid: [{ required: true, message: '请选择上级消息类型', trigger: 'change' }],
			},
			defaultProps: {
				children: 'child',
				label: 'dicName',
			},
			centerDialogVisible: false,
		};
	},
	created() {
		this.getMsgInit();
		this.loadData();
	},
	methods: {
		submitForm() {
			this.$closeSelf();
		},
		addMsg() {
			this.$refs.ruleForm.validate(async valid => {
				if (valid) {
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/msgadmin/msgType/${this.type === 'add' ? 'add' : 'update'}`,
						data: this.ruleForm,
					});
					if (res.code === 200) {
						this.$message.success(res.message);
						this.centerDialogVisible = false;
						this.getMsgInit();
						this.loadData();
					}
				}
			});
		},
		async getMsgInit() {
			const res = await this.$fetch('/mgmt/msgadmin/msgType/init');
			if (res.code === 200) {
				this.slect = res.data;
				this.slect.unshift({ id: 0, dicValue: '', dicName: '设置成一级', pid: 0, status: '1' });
			}
		},
		async loadData() {
			const res = await this.$fetch(`/mgmt/msgadmin/msgType/all`);
			if (res && res.code == 200) {
				this.treeData = res.data;
			}
		},
		async loadNode(node, resolve) {
			if (node.level >= 1) {
				const res = await this.$fetch(`/mgmt/msgadmin/msgType/child/${node.data.id}`);
				return resolve(res.data);
			}
		},
		async append({ data }, type) {
			this.type = type;
			this.centerDialogVisible = true;
			if (type === 'add') {
				this.ruleForm = {};
			} else if (type === 'edit') {
				this.ruleForm = data ? data : {};
			} else if (type === 'del') {
				this.centerDialogVisible = false;
				this.$confirm('确定删除' + data.dicName + '?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(async () => {
					if (data.child && data.child.length > 0) {
						this.$message.warning('该类型下有二级类型，无法删除');
						return;
					}
					this.ruleForm = data;
					this.ruleForm.status = '0';
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/msgadmin/msgType/delete`,
						data: this.ruleForm,
					});
					if (res.code === 200) {
						this.$message.success(res.message);
						this.loadData();
					}
				});
			}
		},
		close() {
			this.centerDialogVisible = false;
			this.ruleForm = {};
		},
	},
};
</script>

<style lang="scss" scoped>
.card-gap {
	.title-text {
		padding: 20px;
		border: 1px solid $color-border;
		font-weight: 400;
		font-size: $font-size;
		color: $color-body;
	}
	.btns-span {
		margin-right: 10px;
		color: $color-link;
		cursor: pointer;
	}
	.btn {
		height: 31px;
		padding: 10px 0;
		.top-btn {
			float: right;
		}
	}
}
.tree-btn {
	margin-left: 20px;
}
</style>
