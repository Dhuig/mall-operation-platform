<template>
	<div class="area-manage-list">
		<guideBar>
			<el-button v-permission="'app_version_add_btn'" type="primary" @click="addUpdate">新增更新内容</el-button>
		</guideBar>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="dataSource"
				:columns="APP_MANGE_COLUMNS"
				:pagination="pagination"
				:dataTotal="total"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button v-permission="'app_version_del_btn'" type="text" @click="del(scope.data)">删除</el-button>
					<el-button v-permission="'app_version_edit_btn'" type="text" @click="handleEdit(scope.data)">编辑</el-button>
					<el-button
						v-permission="'app_version_update_btn'"
						v-if="scope.data.useStatus === 1"
						type="text"
						@click="updateClick(scope.data)"
					>
						强制更新
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 新增/编辑 -->
		<el-dialog :title="'新增更新内容'" :visible.sync="show" width="700px" :before-close="cacel">
			<el-form
				class="add-rate"
				:model="ruleForm"
				:rules="rules"
				ref="ruleForm"
				label-width="160px"
				label-position="right"
				label-suffix=":"
			>
				<el-form-item label="选择更新平台" prop="platformType">
					<el-select size="medium" v-model="ruleForm.platformType" :disabled="!isAdd" placeholder="请选择更新平台">
						<el-option label="IOS" :value="2" />
						<el-option label="Android" :value="1" />
					</el-select>
				</el-form-item>
				<el-form-item label="更新下载地址" prop="apkUrl">
					<el-input size="medium" v-model="ruleForm.apkUrl" placeholder="请输入更新下载地址" />
				</el-form-item>
				<el-form-item label="更新版本号" prop="clientVersion">
					<el-input size="medium" :disabled="!isAdd" v-model="ruleForm.clientVersion" placeholder="请输入版本号" />
				</el-form-item>
				<el-form-item label="更新内容" prop="updateLog">
					<el-input
						type="textarea"
						placeholder="请输入更新内容"
						maxlength="300"
						:autosize="{ minRows: 5 }"
						show-word-limit
						v-model="ruleForm.updateLog"
					/>
				</el-form-item>
				<el-form-item label="是否强制更新" prop="updateInstall">
					<el-select size="medium" v-model="ruleForm.updateInstall" placeholder="请选择">
						<el-option
							v-for="(item, index) in APP_UPDATEINSTALL"
							:key="index"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="第三方登录显示状态" prop="thirdLoginStatus">
					<el-select size="medium" v-model="ruleForm.thirdLoginStatus" placeholder="请选择">
						<el-option label="显示" :value="1" />
						<el-option label="不显示" :value="0" />
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="save">提 交</el-button>
				<el-button @click="cacel">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { APP_MANGE_COLUMNS, APP_UPDATEINSTALL } from './config';
import qs from 'querystring';
import { optionGenerator } from 'util';

export default {
	name: 'appVersionManagement',
	data() {
		return {
			isAdd: true,
			ruleForm: {
				apkUrl: null,
				clientUseragent: null,
				clientVersion: null,
				platformType: null,
				thirdLoginStatus: null,
				updateInstall: null,
				updateLog: null,
			},
			show: false,
			loading: false,
			APP_MANGE_COLUMNS,
			dataSource: [],
			searchData: {
				clientVersion: '',
			},
			APP_UPDATEINSTALL: optionGenerator(APP_UPDATEINSTALL),
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			rules: {
				apkUrl: [{ required: true, message: '请输入下载地址', trigger: 'blur' }],
				clientVersion: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
				platformType: [{ required: true, message: '请选择更新平台', trigger: 'change' }],
				thirdLoginStatus: [{ required: true, message: '请选择', trigger: 'change' }],
				updateInstall: [{ required: true, message: '请选择', trigger: 'change' }],
				updateLog: [{ required: true, message: '请输入更新内容', trigger: 'blur' }],
				useStatus: [{ required: true, message: '请选择', trigger: 'change' }],
			},
			total: 0,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
		};
	},
	methods: {
		addUpdate() {
			this.show = true;
			this.isAdd = true;
		},
		// 查询事件
		search() {
			this.pagination.currentPage = 1;
			this.getList();
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
		handleEdit(row) {
			this.isAdd = false;
			this.show = true;
			this.$nextTick(() => {
				this.ruleForm = { ...row };
			});
		},
		del({ id }) {
			this.$confirm('确定删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'DELETE',
					url: '/mgmt/sys/version/delete',
					params: { id },
				});
				if (res.code === 200) {
					this.$message.success(res.message);
					this.getList();
				}
			});
		},
		updateClick({ id }) {
			this.$confirm('确定强制更新?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'PUT',
					url: `/mgmt/sys/version/status?${qs.stringify({ id, useStatus: 2 })}`,
				});
				if (res.code === 200) {
					this.$message.success(res.message);
					this.getList();
				}
			});
		},
		// 取消
		cacel() {
			this.$refs['ruleForm'].resetFields();
			this.show = false;
			this.ruleForm = {};
		},
		// 保存
		save() {
			this.$refs['ruleForm'].validate(async valid => {
				if (valid) {
					if (this.isAdd) delete this.ruleForm.id;
					const res = await this.$fetch({
						method: `${this.isAdd ? 'POST' : 'PUT'}`,
						url: `/mgmt/sys/version/${this.isAdd ? 'save' : 'update'}`,
						data: this.ruleForm,
					});
					if (res && res.code == 200) {
						this.$message.success(res.message);
						this.show = false;
						this.$refs['ruleForm'].resetFields();
						this.ruleForm = {};
						this.getList();
					}
				}
			});
		},
		// 请求数据
		async getList() {
			this.loading = true;
			const { currentPage: pageNum, pageSize } = this.pagination;
			const params = {
				pageNum,
				pageSize,
				...this.searchData,
			};
			const res = await this.$fetch(`/mgmt/sys/version/list?${qs.stringify(params)}`);
			if (res) {
				const { list, total } = res.data;
				this.dataSource = res.code === 200 ? list : [];
				this.total = res.code === 200 ? total : 0;
			}
			this.loading = false;
		},
	},
	created() {
		this.getList();
	},
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__wrapper {
	overflow: auto;
}
::v-deep.area-manage-list {
	.month-label {
		font-size: 14px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-top: 10px;
		margin-bottom: 26px;
		div {
			min-width: 60px;
			text-align: right;
		}
		.el-input,
		.el-input__inner {
			width: 240px;
		}
	}
	.my-col {
		text-align: right;
	}
}
</style>
