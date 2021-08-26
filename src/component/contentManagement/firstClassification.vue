<template>
	<div>
		<guideBar />
		<el-card>
			<el-tabs v-model="activeTab">
				<el-tab-pane label="完美商城APP版" name="2"></el-tab-pane>
				<el-tab-pane label="完美商城小程序版" name="3"></el-tab-pane>
			</el-tabs>
			<el-row :gutter="20">
				<el-col :span="5">
					<el-row class="linkHeadTitle">
						<span>一级分类主题</span>
						<el-button
							v-permission="'first_classification_add'"
							type="primary"
							size="small"
							@click="showFirstTheme = true"
						>
							新建
						</el-button>
					</el-row>
					<el-menu :default-active="defaultActive" class="el-menu-vertical-demo" @select="handleSelect">
						<el-menu-item v-for="(item, index) in themeList" :index="String(item.id)" :key="index">
							<span>{{ item.name }}</span>
						</el-menu-item>
					</el-menu>
				</el-col>
				<el-col :span="18">
					<el-form :model="themeForm" :rules="themeRules" ref="themeForm" label-width="120px" class="theme-form">
						<el-form-item label="一级分类主题:" prop="name">
							<el-row type="flex" justify="space-between">
								<el-col>
									<el-input
										:disabled="!themeForm.shelfStatus == 0"
										size="mini"
										v-model="themeForm.name"
										:readonly="!isEdit"
										class="theme-input"
									/>
								</el-col>
								<el-col class="button-tet">
									<el-button
										v-if="themeForm.shelfStatus == 1 && themeForm.isDefault == 1"
										type="primary"
										size="small"
										@click.stop="offShelft"
									>
										下架
									</el-button>
									<el-button
										v-if="!isEdit && themeForm.shelfStatus === 0 && $permission('first_classification_edit')"
										type="primary"
										size="small"
										@click.stop="handleEdit"
									>
										编辑
									</el-button>
									<el-button
										v-if="themeForm.shelfStatus != 1 && $permission('first_classification_delete')"
										type="danger"
										size="small"
										@click.stop="deleteTheme"
									>
										删除
									</el-button>
								</el-col>
							</el-row>
						</el-form-item>
						<el-form-item label="一级分类内容:" prop="content">
							<el-table :data="themeForm.content" v-loading="loading">
								<el-table-column prop="title" label="一级分类" />
								<el-table-column prop="icon" label="图标">
									<template slot-scope="scope">
										<el-row>
											<el-col>
												<el-upload
													:disabled="!isEdit"
													:action="$store.getters['system/getOssUploadUrl']"
													:headers="$store.getters['system/getSignatureVerification']"
													list-type="picture-card"
													:data="uploadData"
													:limit="1"
													:on-preview="handlePictureCardPreview"
													:before-upload="beforeVideoUpload"
													:on-success="
														(response, file, fileList) => {
															handleSuccess(response, file, fileList, scope.$index);
														}
													"
													:on-remove="
														(file, fileList) => {
															handleRemove(file, fileList, scope.$index);
														}
													"
													:file-list="scope.row.bindFileList"
													:class="scope.row.bindFileList.length == 1 ? 'hide_box' : ''"
												>
													<i class="el-icon-plus"></i>
												</el-upload>
											</el-col>
											<el-col class="tipTitle">支持上传png、jpg格式图片</el-col>
										</el-row>
									</template>
								</el-table-column>
							</el-table>
						</el-form-item>
						<el-form-item label="上架状态:" prop="shelfStatus">
							<span>{{ getStatus(themeForm.shelfStatus) }}</span>
						</el-form-item>
						<el-form-item label="上下架类型:" prop="shelfConfig" v-if="themeForm.isDefault == 1">
							<el-button type="primary" @click="showShelf = true" :disabled="!isEdit">点我设置</el-button>
							<el-row v-if="themeForm.shelfConfig == '1'">类型：立即上架</el-row>
							<el-row v-if="themeForm.shelfConfig == '2'">
								类型：定时上架，上架时间：{{ dialogShelfForm.onShelfTime | timestampFormat }}
							</el-row>
							<el-row v-if="themeForm.shelfConfig == '3'">
								类型：定时上下架，上架时间：{{ dialogShelfForm.onShelfTime | timestampFormat }}，下架时间：{{
									dialogShelfForm.offShelfTime | timestampFormat
								}}
							</el-row>
						</el-form-item>
						<el-row type="flex" justify="center" align="center" v-if="isEdit || themeForm.isDefault == 0">
							<el-button v-permission="'mall_agreement_save'" type="primary" icon="el-icon-check" @click="saveAndExit">
								保存
							</el-button>
						</el-row>
					</el-form>
				</el-col>
			</el-row>
		</el-card>
		<el-dialog :visible.sync="dialogVisible" v-drag>
			<img width="100%" :src="dialogImageUrl" alt />
		</el-dialog>
		<!-- 上下架类型弹窗 -->
		<el-dialog title="上下架类型" :visible.sync="showShelf" :before-close="cancelShelf" center width="550px" v-drag>
			<el-form
				:model="dialogShelfForm"
				:rules="dialogShelfRules"
				ref="dialogShelfForm"
				class="dialogShelfForm"
				label-width="120px"
				label-position="left"
				label-suffix=":"
			>
				<el-form-item label="类型" prop="type">
					<el-radio-group v-model="dialogShelfForm.type">
						<el-radio label="1">立即上架</el-radio>
						<el-radio label="2">定时上架</el-radio>
						<el-radio label="3">定时上下架</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item
					v-if="dialogShelfForm.type == '2' || dialogShelfForm.type == '3'"
					label="上架时间"
					prop="onShelfTime"
				>
					<el-date-picker
						size="medium"
						class="first-formitem"
						placeholder="请选择上架时间"
						type="datetime"
						value-format="timestamp"
						:picker-options="timeDisabel"
						v-model="dialogShelfForm.onShelfTime"
					/>
				</el-form-item>
				<el-form-item v-if="dialogShelfForm.type == '3'" label="下架时间" prop="offShelfTime">
					<el-date-picker
						size="medium"
						class="first-formitem"
						placeholder="请选择下架时间"
						type="datetime"
						value-format="timestamp"
						:picker-options="pickerOptions"
						v-model="dialogShelfForm.offShelfTime"
					/>
				</el-form-item>
				<el-row class="tipTitle ml-20" v-if="dialogShelfForm.type == '1'">（该产品将立即上架）</el-row>
				<el-row class="tipTitle ml-20" v-if="dialogShelfForm.type == '2'">（该产品将在指定时间上架）</el-row>
				<el-row class="tipTitle ml-20" v-if="dialogShelfForm.type == '3'">（该产品将在指定时间上架、下架）</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click.stop="svaeShelf" class="mr-16">保存</el-button>
				<el-button @click.stop="cancelShelf">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 新增一级分类弹窗 -->
		<el-dialog title="新增一级分类" :visible.sync="showFirstTheme" center width="550px" v-drag>
			<el-form
				:model="firstThemeForm"
				:rules="firstThemeRules"
				ref="firstThemeForm"
				class="firstThemeForm"
				label-width="120px"
				label-position="left"
				label-suffix=":"
			>
				<el-form-item label="一级分类名称" prop="name">
					<el-input size="mini" v-model="firstThemeForm.name" class="link-input" />
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click.stop="svaeFirstTheme" class="mr-16">保存</el-button>
				<el-button @click.stop="cancelFirstTheme">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { uploadFileType } from 'util/formValidation';
export default {
	name: 'firstClassification',
	data() {
		const shelfVaild = (rule, value, callback) => {
			if (!this.themeForm.shelfConfig || this.themeForm.shelfConfig == '') {
				callback(new Error('请选择上架类型'));
			} else {
				callback();
			}
		};
		const imgVaild = (rule, value, callback) => {
			this.themeForm.content.forEach(item => {
				if (item.bindFileList.length == 0) {
					return callback(new Error('请上传图标'));
				}
				callback();
			});
		};
		return {
			themeList: [],
			activeTab: '2',
			defaultActive: '-1',
			themeActive: '',
			themeForm: {
				name: '',
				content: [],
			},
			themeRules: {
				content: [{ required: true, validator: imgVaild, trigger: 'change' }],
				shelfConfig: [{ required: true, validator: shelfVaild, trigger: 'change' }],
			},
			loading: false,
			dialogImageUrl: '',
			dialogVisible: false,
			showShelf: false,
			dialogShelfForm: {
				type: '',
				offShelfTime: '',
				onShelfTime: '',
			},
			dialogShelfRules: {
				type: [{ required: true, message: '请选择类型', trigger: 'change' }],
				onShelfTime: [{ required: true, message: '请选择上架时间', trigger: 'change' }],
				offShelfTime: [{ required: true, message: '请选择下架时间', trigger: 'change' }],
			},
			showFirstTheme: false,
			firstThemeForm: {
				name: '',
			},
			firstThemeRules: {
				name: [{ required: true, message: '请输入一级分类主题名称', trigger: 'blur' }],
			},
			category: [],
			allThemeList: [],
			isEdit: false,
			timeDisabel: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 3600 * 1000 * 24;
				},
			},
		};
	},
	watch: {
		activeTab() {
			this.getThemeList();
		},
	},
	created() {
		this.getCategory();
	},
	computed: {
		pickerOptions: function () {
			return {
				disabledDate: time => {
					if (this.dialogShelfForm.onShelfTime) {
						return time.getTime() < new Date(this.dialogShelfForm.onShelfTime).getTime() + 24 * 3600 * 1000;
					}
				},
			};
		},
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.cms,
			};
			return params;
		},
	},
	methods: {
		beforeVideoUpload(file) {
			const whiteList = ['jpg', 'png'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		// 获取商品分类
		async getCategory() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/category/getCategory',
			});
			if (res) {
				this.category = res.data;
				this.category = this.category.map(item => {
					return { ...item, icon: '', bindFileList: [] };
				});
				this.getThemeList();
			}
		},
		// 获取主题列表
		async getThemeList() {
			this.isEdit = false;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/cms/category/getThemeList',
				data: {
					location: this.activeTab,
				},
			});
			if (res && res.code == 200) {
				if (res.data.length == 0) {
					// 没有数据 展示系统默认
					this.themeList = [{ id: '-1', name: '系统默认', content: this.category, shelfStatus: '1', isDefault: 0 }];
					this.themeForm = this.themeList[0];
					this.defaultActive = '-1';
					this.themeActive = '-1';
				} else {
					// 判断数据中是否有系统默认  有系统数据 展示
					let includeDefault = false;
					res.data.forEach((item, index) => {
						if (item.isDefault == 0) {
							includeDefault = true;
							this.themeForm = item;
							this.themeForm.content.forEach(item => {
								if (item.icon && item.icon != '') {
									item.bindFileList = [{ url: item.icon }];
								} else {
									item.bindFileList = [];
								}
							});
							this.defaultActive = String(item.id);
							this.themeActive = String(item.id);
							res.data.splice(index, 1);
							res.data.unshift(item);
							this.themeList = res.data;
							return;
						}
					});
					if (includeDefault == false) {
						this.themeList = res.data;
						let obj = { id: '-1', name: '系统默认', content: this.category, shelfStatus: '1', isDefault: 0 };
						this.themeList.unshift(obj);
						this.themeForm = this.themeList[0];
						this.themeForm.content.forEach(item => {
							if (item.icon && item.icon != '') {
								item.bindFileList = [{ url: item.icon }];
							} else {
								item.bindFileList = [];
							}
						});
						this.defaultActive = '-1';
						this.themeActive = '-1';
					}
				}
			}
		},
		// 删除图片回调
		handleRemove(file, fileList, index) {
			const item = this.themeForm.content[index];
			this.themeForm.content.splice(index, 1, { ...item, bindFileList: fileList });
		},
		// 上传图片成功回调
		handleSuccess(response, file, fileList, index) {
			const item = this.themeForm.content[index];
			this.themeForm.content.splice(index, 1, { ...item, bindFileList: fileList, urlKey: response.datas.fileUrlKey });
			this.$refs['themeForm'].clearValidate('content');
		},
		// 图片预览
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		// theme切换
		handleSelect(index) {
			this.themeActive = index;
			this.isEdit = false;
			this.themeList.forEach(item => {
				if (item.id == index) {
					this.themeForm = item;
					this.themeForm.content.forEach(item => {
						if (item.icon && item.icon != '') {
							item.bindFileList = [{ url: item.icon }];
						} else {
							item.bindFileList = [];
						}
					});
					this.dialogShelfForm.offShelfTime = this.themeForm.shelfOffTime;
					this.dialogShelfForm.onShelfTime = this.themeForm.shelfUpTime;
					if (this.themeForm.shelfConfig) {
						this.dialogShelfForm.type = this.themeForm.shelfConfig.toString();
					}
				}
			});
		},
		// 删除分类主题
		async deleteTheme() {
			this.$confirm('此操作将删除该分类主题, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/cms/category/removeTheme/' + this.themeForm.id,
						data: {
							themeId: this.themeForm.id,
						},
					});
					if (res && res.code == 200) {
						this.$message.success(res.message);
						this.getThemeList();
					}
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		// 下架
		async offShelft() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/cms/category/shelfOff',
				data: {
					themeId: this.themeForm.id,
					shelfStatus: 2,
				},
			});
			if (res && res.code == 200) {
				this.$message.success(res.message);
				this.getThemeList();
			}
		},
		// 编辑
		handleEdit() {
			this.isEdit = true;
		},
		// 保存
		saveAndExit() {
			this.$refs['themeForm'].validate(async valid => {
				if (valid) {
					let contentList = this.themeForm.content.map(item => {
						if (item.urlKey) {
							return { id: item.id, title: item.title, icon: item.urlKey };
						} else {
							return { id: item.id, title: item.title, icon: item.icon };
						}
					});
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/cms/category/saveTheme',
						data: {
							name: this.themeForm.name,
							content: contentList,
							id: this.themeForm.id == '-1' ? '' : this.themeForm.id,
							isDefault: this.themeForm.isDefault,
							location: this.activeTab,
							shelfConfig: this.themeForm.shelfConfig,
							shelfOffTime: this.dialogShelfForm.offShelfTime,
							shelfUpTime: this.dialogShelfForm.onShelfTime,
						},
					});
					if (res && res.code == 200) {
						this.$message.success(res.message);
						this.getThemeList();
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 上下架弹窗关闭
		cancelShelf() {
			this.$refs['dialogShelfForm'].resetFields();
			this.dialogShelfForm = {
				type: '',
				offShelfTime: '',
				onShelfTime: '',
			};
			this.showShelf = false;
		},
		// 保存上下架类型
		svaeShelf() {
			this.$refs['dialogShelfForm'].validate(valid => {
				if (valid) {
					this.showShelf = false;
					this.themeForm.shelfConfig = this.dialogShelfForm.type;
					this.$refs['themeForm'].clearValidate('shelfConfig');
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 取消关闭新建分类弹窗
		cancelFirstTheme() {
			this.$refs['firstThemeForm'].resetFields();
			this.showFirstTheme = false;
		},
		// 保存新建一级分类主题名称
		svaeFirstTheme() {
			this.$refs['firstThemeForm'].validate(async valid => {
				if (valid) {
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/cms/category/saveTheme',
						data: {
							name: this.firstThemeForm.name,
							content: this.category,
							location: this.activeTab,
							isDefault: 1,
						},
					});
					if (res && res.code === 200) {
						this.$message.success(res.message);
						this.cancelFirstTheme();
						this.getThemeList();
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		getStatus(val) {
			if (val == 0) return '待上架';
			if (val == 1) return '已上架';
			if (val == 2) return '已下架';
		},
	},
};
</script>
<style lang="scss" scoped>
.theme-input {
	max-width: 350px;
}
.linkHeadTitle {
	line-height: 56px;
	font-weight: 500;
	border-right: 1px solid #e6e6e6;
	button {
		float: right;
		margin: 14px 20px 0 0;
	}
}
.first-formitem {
	width: 350px;
}
.tipTitle {
	color: #8c939b;
}
.dialogShelfForm {
	min-height: 200px;
}
.deleteButton {
	float: right;
	margin-top: 14px;
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
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
.button-tet {
	text-align: right;
}
</style>
