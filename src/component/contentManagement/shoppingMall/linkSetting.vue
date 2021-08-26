<template>
	<div>
		<guideBar />
		<el-card>
			<el-row :gutter="20">
				<el-col :span="5">
					<el-row class="linkHeadTitle">
						<span>底部链接导航</span>
						<el-button v-permission="'link_setting_add'" type="primary" size="small" @click="addMenuAddress">
							新建
						</el-button>
					</el-row>
					<el-menu :default-active="menuActive" class="el-menu-vertical-demo" @select="handleSelect">
						<el-menu-item v-for="(item, index) in linkMenuList" :index="String(index)" :key="index">
							<span>{{ item.linkName }}</span>
							<el-button
								v-if="String(index) === menuActive"
								class="deleteButton"
								type="danger"
								size="small"
								@click="deleteMenu(item)"
								v-permission="'link_setting_delete'"
							>
								删除
							</el-button>
						</el-menu-item>
					</el-menu>
					<el-row class="pt-20 menuBorder" v-if="linkMenuList.length > 0">
						<el-button size="mini" icon="el-icon-top" @click="linkMove(0)">上移</el-button>
						<el-button size="mini" icon="el-icon-bottom" @click="linkMove(1)">下移</el-button>
					</el-row>
					<el-row class="pt-20 menuBorder" v-if="linkMenuList.length > 0">
						<el-button size="mini" icon="el-icon-top" @click="linkMove(2)">置顶</el-button>
						<el-button size="mini" icon="el-icon-bottom" @click="linkMove(3)">置底</el-button>
					</el-row>
				</el-col>
				<el-col :span="18" v-if="linkMenuList.length > 0">
					<el-form :model="linkForm" ref="linkForm" label-width="120px" class="link-form">
						<el-form-item label="底部链接名称:" prop="linkName">
							<el-input size="mini" v-model="linkForm.linkName" class="link-input" :disabled="formDisabled" />
							<el-button
								v-permission="'link_setting_edit'"
								type="primary"
								style="margin-left: 60px"
								@click="formDisabled = false"
								v-if="formDisabled"
							>
								编辑
							</el-button>
						</el-form-item>
						<el-form-item label="底部链接内容:" prop>
							<el-row type="flex" justify="end">
								<el-button
									v-permission="'link_setting_set_order'"
									:type="sortAble ? 'info' : 'primary'"
									:disabled="formDisabled"
									icon="el-icon-sort"
									@click="setSort"
								>
									{{ sortAble ? '设置排序' : '完成排序' }}
								</el-button>
							</el-row>
							<el-table :data="linkForm.children">
								<el-table-column type="index" label="序号" width="50" />
								<el-table-column prop="linkName" label="链接名称" width="150">
									<template slot-scope="scope">
										<el-input v-model="scope.row.linkName" placeholder="请输入内容" :disabled="formDisabled"></el-input>
									</template>
								</el-table-column>
								<el-table-column prop="linkUrl" label="链接地址">
									<template slot-scope="scope">
										<el-input v-model="scope.row.linkUrl" placeholder="请输入内容" :disabled="formDisabled"></el-input>
									</template>
								</el-table-column>
								<el-table-column label="操作" :width="300">
									<template slot-scope="scope">
										<el-button size="mini" type="danger" icon="el-icon-delete-solid" @click="handleDelete(scope.row)">
											删除
										</el-button>
										<el-button
											size="mini"
											icon="el-icon-top"
											@click="handleListUpper(scope.$index, scope.row)"
											:disabled="scope.$index == 0 || sortAble"
										>
											上移
										</el-button>
										<el-button
											size="mini"
											icon="el-icon-bottom"
											@click="handleListDownner(scope.$index, scope.row)"
											:disabled="scope.$index == linkForm.children.length - 1 || sortAble"
										>
											下移
										</el-button>
									</template>
								</el-table-column>
							</el-table>
							<el-row class="mt-20" v-if="!formDisabled">
								<el-button type="primary" icon="el-icon-plus" @click="showLink = true">新建链接</el-button>
								<el-button type="primary" @click="saveLink">保存</el-button>
							</el-row>
						</el-form-item>
					</el-form>
				</el-col>
				<el-col :span="18" v-else>
					<div class="dft-div">暂无数据</div>
				</el-col>
			</el-row>
		</el-card>
		<!-- 新增友情链接弹窗 -->
		<el-dialog title="新增友情链接" :visible.sync="showLink" center width="550px" v-drag>
			<el-form
				:model="dialogLinkForm"
				:rules="dialogLinkRules"
				ref="dialogLinkForm"
				class="dialogLinkForm"
				label-width="120px"
				label-position="left"
				label-suffix=":"
			>
				<el-form-item label="友情链接名称" prop="linkName">
					<el-input size="mini" v-model="dialogLinkForm.linkName" class="link-input" />
				</el-form-item>
				<el-form-item label="友情链接地址" prop="linkAddress">
					<el-input size="mini" v-model="dialogLinkForm.linkAddress" class="link-input" />
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click.stop="svaeLinkAddress" class="mr-16">保存</el-button>
				<el-button @click.stop="cancelAddLink">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 新增底部链接弹窗 -->
		<el-dialog title="新增底部链接" :visible.sync="showBottomLink" center width="550px" v-drag>
			<el-form
				:model="bottomLinkForm"
				:rules="bottomLinkRules"
				ref="bottomLinkForm"
				class="bottomLinkForm"
				label-width="120px"
				label-position="left"
				label-suffix=":"
			>
				<el-form-item label="底部链接名称" prop="bottomLinkName">
					<el-input size="mini" v-model="bottomLinkForm.bottomLinkName" class="link-input" />
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click.stop="svaeBottomLink" class="mr-16">保存</el-button>
				<el-button @click.stop="cancelAddBottomLink">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
export default {
	name: 'linkSetting',
	data() {
		return {
			formDisabled: true,
			linkForm: {
				linkName: '',
				children: [],
			},
			linkMenuList: [],
			linkData: [],
			showLink: false,
			showBottomLink: false,
			defaultActive: '0',
			menuActive: '0',
			dialogLinkForm: {},
			dialogLinkRules: {
				linkName: [{ required: true, message: '请输入连接名称', trigger: 'blur' }],
				linkAddress: [{ required: true, message: '请输入连接地址', trigger: 'blur' }],
			},
			bottomLinkForm: {
				bottomLinkName: '',
			},
			bottomLinkRules: {
				bottomLinkName: [{ required: true, message: '请输入底部链接名称', trigger: 'blur' }],
			},
			sortAble: true,
		};
	},
	created() {
		this.loadlinkData();
	},
	methods: {
		addMenuAddress() {
			this.showBottomLink = true;
		},
		// menu切换
		handleSelect(index) {
			this.menuActive = index;
			this.linkMenuList.forEach((item, i) => {
				if (i == index) {
					this.linkForm = item;
				}
			});
		},
		// 获取数据
		async loadlinkData(id) {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/friendship/getFriendshipLinkList',
			});
			if (res) {
				this.linkMenuList = res.data;
				if (id == 1) {
					this.linkForm = this.linkMenuList[this.linkMenuList.length - 1];
					this.menuActive = String(this.linkMenuList.length - 1);
				} else if (id == 2) {
					this.menuActive = String(this.menuActive * 1 - 1);
					this.linkForm = this.linkMenuList[this.menuActive];
				} else {
					this.linkForm = res.data[this.menuActive];
				}
			}
		},
		// 保存新建连接
		svaeLinkAddress() {
			this.$refs['dialogLinkForm'].validate(async (valid) => {
				if (valid) {
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/cms/friendship/saveFriendshipLink',
						data: {
							linkName: this.dialogLinkForm.linkName,
							linkUrl: this.dialogLinkForm.linkAddress,
							parentId: this.linkForm.id,
						},
					});
					if (res) {
						this.$message({
							type: 'success',
							message: res.message,
						});
						this.cancelAddLink();
						this.loadlinkData();
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 保存新建底部连接导航
		svaeBottomLink() {
			this.$refs['bottomLinkForm'].validate(async (valid) => {
				if (valid) {
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/cms/friendship/saveFriendshipLink',
						data: {
							linkName: this.bottomLinkForm.bottomLinkName,
						},
					});
					if (res) {
						this.$message({
							type: 'success',
							message: res.message,
						});
						this.cancelAddBottomLink();
						this.loadlinkData(1);
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		async saveLink() {
			let { id, linkName, children } = this.linkForm;
			for (let index = 0; index < children.length; index++) {
				if (!children[index].linkName || !children[index].linkUrl) {
					this.$message.warning('链接名称与链接地址不能为空！');
					return;
				}
			}
			let isStop = false;
			children.forEach(({ linkName, linkUrl }) => {
				if (!linkName || !linkUrl) {
					isStop = true;
				}
			});
			if (isStop) {
				this.$message.warning('链接名称、链接地址不能为空！');
				return;
			}
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/cms/friendship/saveMultiFriendLink',
				data: {
					childList: children.map(({ linkName, linkUrl }) => ({ linkName, linkUrl })),
					id,
					name: linkName,
				},
			});
			if (res) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.formDisabled = true;
				// this.cancelAddLink();
				this.loadlinkData();
			}
		},
		// 关闭新建弹窗
		cancelAddLink() {
			this.$refs['dialogLinkForm'].resetFields();
			this.showLink = false;
		},
		cancelAddBottomLink() {
			this.$refs['bottomLinkForm'].resetFields();
			this.showBottomLink = false;
		},
		// 删除底部链接
		async deleteMenu(row) {
			this.$confirm('此操作将删除该底部链接, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					const res = await this.$fetch({
						method: 'GET',
						url: '/mgmt/cms/friendship/removeFriendshipLink/' + row.id,
					});
					if (res) {
						this.$message({
							type: 'success',
							message: `删除成功!`,
						});
						this.loadlinkData(2);
					}
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		// 删除友情链接
		async handleDelete(row) {
			this.$confirm('此操作将删除该友情链接, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					const res = await this.$fetch({
						method: 'GET',
						url: '/mgmt/cms/friendship/removeFriendshipLink/' + row.id,
					});
					if (res) {
						this.$message({
							type: 'success',
							message: `删除成功!`,
						});
						this.loadlinkData();
					}
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		// 底部链接移动
		async linkMove(val) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/cms/friendship/move',
				data: {
					id: this.linkMenuList[this.menuActive * 1].id,
					operate: val,
				},
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				if (val == 0) this.menuActive = String(this.menuActive * 1 - 1);
				if (val == 1) this.menuActive = String(this.menuActive * 1 + 1);
				if (val == 2) this.menuActive = '0';
				if (val == 2) this.menuActive = String(this.linkMenuList.length - 1);
				this.loadlinkData();
			}
		},
		swapArray(arr, index1, index2) {
			arr[index1] = arr.splice(index2, 1, arr[index1])[0];
			return arr;
		},
		// 设置排序
		async setSort() {
			this.sortAble = this.sortAble ? false : true;
			if (this.sortAble) {
				let arr = [];
				this.linkForm.children.map((item, index) => {
					let obj = {};
					obj.sort = index;
					obj.id = item.id;
					arr.push(obj);
				});
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/cms/friendship/update/sort',
					data: arr,
				});
				if (res) {
					this.$message({
						type: 'success',
						message: res.message,
					});
					this.loadlinkData();
				}
			}
		},
		// 友情链接上移
		handleListUpper(index) {
			this.swapArray(this.linkForm.children, index, index - 1);
		},
		// 友情链接下移
		handleListDownner(index) {
			this.swapArray(this.linkForm.children, index, index + 1);
		},
	},
	watch: {},
};
</script>
<style lang="scss" scoped>
.linkHeadTitle {
	line-height: 56px;
	font-weight: 500;
	border-right: 1px solid #e6e6e6;
	button {
		float: right;
		margin: 14px 20px 0 0;
	}
}
.link-input {
	max-width: 350px;
}
.mt-20 {
	margin-top: 20px;
}
.pt-20 {
	padding-top: 20px;
}
.menuBorder {
	border-right: 1px solid #e6e6e6;
}
.deleteButton {
	float: right;
	margin-top: 14px;
}
.dft-div {
	height: 400px;
	text-align: center;
	line-height: 400px;
}
</style>
