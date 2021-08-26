<template>
	<div>
		<guideBar />
		<el-row type="flex" justify="end" class="margin20">
			<el-button
				v-permission="'extension_link_total_add'"
				type="primary"
				icon="el-icon-plus"
				@click="addDialogShow = true"
			>
				新增
			</el-button>
		</el-row>
		<el-card>
			<el-table :data="tableData" style="width: 100%">
				<el-table-column align="center" prop="date" label="序号" width="90">
					<template slot-scope="scope">
						<div>{{ scope.$index + 1 }}</div>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="thirdPartySoftwareName" label="第三方软件" width="100"></el-table-column>
				<el-table-column align="center" prop="platform" label="平台" width="100">
					<template slot-scope="scope">
						<div>{{ PLATFORM[scope.row.platform] }}</div>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="createTime" label="创建时间" width="180"></el-table-column>
				<el-table-column align="center" prop="visitedCount" label="跳转次数" width="100"></el-table-column>
				<el-table-column align="center" prop="link" label="链接"></el-table-column>
				<el-table-column align="center" prop="address" label="操作" width="200">
					<template slot-scope="scope">
						<el-button
							v-if="scope.row.onUseStatus == '1'"
							v-permission="'extension_link_total_disabled'"
							type="text"
							@click="changStatus(scope.row, '0')"
							size="small"
						>
							禁用
						</el-button>
						<el-button
							v-else
							v-permission="'extension_link_total_disabled'"
							@click="changStatus(scope.row, '1')"
							type="text"
							size="small"
						>
							启用
						</el-button>
						<el-button
							v-permission="'extension_link_total_del'"
							@click="deleteData(scope.row)"
							type="text"
							size="small"
						>
							删除
						</el-button>

						<el-button
							v-permission="'extension_link_total_copy'"
							class="copy"
							type="text"
							@click="copyLink(scope.$index)"
						>
							复制链接
						</el-button>

						<el-button v-permission="'extension_link_total_info'" @click="details(scope.row)" type="text" size="small">
							详情
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				class="pagination"
				@size-change="handleSizeChange"
				@current-change="handleChangePage"
				:current-page="pagination.pageNum"
				:page-size="pagination.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="pagination.total"
			></el-pagination>
		</el-card>

		<el-dialog title="新增" :visible.sync="addDialogShow" width="30%" :before-close="cancelDialog">
			<el-form :model="addForm" :rules="ADD_EXTENSION_LINK_RULE" ref="addForm" label-width="100px">
				<el-form-item label="第三方软件" prop="thirdPartySoftwareName">
					<el-input
						v-model="addForm.thirdPartySoftwareName"
						class="W300"
						placeholder="请输入第三方软件名称"
						maxlength="20"
						show-word-limit
					></el-input>
				</el-form-item>
				<el-form-item label="选择平台" prop="platform">
					<el-select v-model="addForm.platform" placeholder="请选择平台" class="W300">
						<el-option label="APP" value="1"></el-option>
						<el-option label="小程序" value="2"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancelDialog">取 消</el-button>
				<el-button type="primary" @click="addData">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { PLATFORM, ADD_EXTENSION_LINK_RULE } from './config';
import Clipboard from 'clipboard';
export default {
	name: 'extensionLinkTotalList',
	data() {
		return {
			PLATFORM,
			ADD_EXTENSION_LINK_RULE,
			tableData: [],
			pagination: {
				total: 0,
				pageNum: 1,
				pageSize: 10,
			},
			addForm: {
				thirdPartySoftwareName: '',
				platform: null,
			},
			addDialogShow: false,
		};
	},
	computed: {},
	methods: {
		async getData() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/cms/promotionLink/getLinkPage`,
				data: this.pagination,
			});
			if (res?.code == 200) {
				const { list, total } = res.data;
				this.pagination.total = total;
				this.tableData = list;
			}
		},
		// 取消弹窗
		cancelDialog() {
			this.$refs.addForm.resetFields();
			this.addDialogShow = false;
		},
		// 复制
		copyLink(index) {
			let Url = this.tableData[index].link;
			let clipboard = new Clipboard('.copy', {
				text: () => Url,
			});
			clipboard.on('success', () => {
				this.$message({ type: 'success', duration: 1500, message: '复制成功' });
				clipboard.destroy();
			});
			clipboard.on('error', e => {
				this.$message({ type: 'warning', duration: 1500, message: '复制功能暂不可用' });
				console.error('copy error:', e);
				clipboard.destroy();
			});
		},
		// 删除
		deleteData({ id }) {
			this.$confirm('确认删除吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: `/mgmt/cms/promotionLink/delete`,
					data: { id },
				});
				if (res?.code == 200) {
					this.$message.success(res.message);
					this.getData();
				}
			});
		},
		// 启用/禁用
		changStatus({ id }, useStatus) {
			this.$confirm(`确认${useStatus == 1 ? '启用' : '禁用'}吗?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: `/mgmt/cms/promotionLink/changUseStatus`,
					data: { id, useStatus },
				});
				if (res?.code == 200) {
					this.$message.success(res.message);
					this.getData();
				}
			});
		},
		// 详情
		details({ id, thirdPartySoftwareName, platform, link }) {
			this.$go('extension_link_total_detail', {
				promotionLinkId: id,
				thirdPartySoftwareName,
				platform: this.PLATFORM[platform],
				link,
			});
		},
		// 添加
		addData() {
			this.$refs.addForm.validate(async valid => {
				if (valid) {
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/cms/promotionLink/save`,
						data: this.addForm,
					});
					if (res?.code == 200) {
						this.$message.success(res.message);
						this.cancelDialog();
						this.getData();
					}
				}
			});
		},
		// 翻页操作
		handleChangePage(page) {
			this.pagination.pageNum = page;
			this.getData();
		},
		// 切换页面条数
		handleSizeChange(pageSize) {
			this.pagination = {
				pageNum: 1,
				pageSize,
				total: 0,
			};
			this.getData();
		},
	},
	async mounted() {
		await this.getData();
	},
};
</script>
<style lang="scss" scoped>
.pagination {
	margin-top: 20px;
	text-align: right;
}
.margin20 {
	margin: 20px 0;
}
.W300 {
	width: 300px;
}
</style>