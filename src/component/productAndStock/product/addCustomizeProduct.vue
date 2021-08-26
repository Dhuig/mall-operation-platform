<template>
	<div>
		<el-divider>定制产品列表</el-divider>
		<el-row type="flex" class="row-gap">
			<el-button size="small" type="primary" icon="el-icon-plus" @click="addCompositionProduct" :disabled="disabled">
				添加产品
			</el-button>
			<el-upload
				:action="$store.getters['system/getOssUploadUrl']"
				:headers="$store.getters['system/getSignatureVerification']"
				:data="uploadData"
				:show-file-list="false"
				:disabled="disabled"
				:on-success="uploadSuccess"
			>
				<el-button
					type="primary"
					icon="el-icon-plus"
					class="btn marginL5"
					:disabled="disabled"
					:loading="exportLoading"
				>
					批量导入
				</el-button>
			</el-upload>
			<el-button size="small" class="marginL5" type="text" @click="downloadMoudel">下载导入模板</el-button>
			<el-button
				size="small"
				v-if="errorData.failList.length"
				class="marginL5 warning"
				type="text"
				@click="errorData.show = true"
				:disabled="disabled"
			>
				错误的导入数据
			</el-button>
			<el-alert title="最多只能添加 1000 种二级产品" type="info" show-icon :closable="false" class="add-tips" />
		</el-row>
		<el-row>
			<el-table :data="filterData">
				<el-table-column label="序号" type="index" width="70" align="center" />
				<el-table-column prop="cusSerialNo" label="二级代码" align="center" />
				<el-table-column prop="cusTitle" label="产品名称" align="center" />
				<el-table-column align="center">
					<template slot="header" slot-scope="scope">
						<el-input
							v-if="scope.$index == 3"
							v-model="secondLevelSearch"
							size="mini"
							:placeholder="`输入二级代码或产品名称搜索`"
						/>
					</template>
					<template slot-scope="scope">
						<el-button type="text" @click="removeProduct(scope.row)" :disabled="disabled">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-row>
		<!-- 添加定制产品弹窗 -->
		<el-dialog title="添加产品" :visible.sync="show" width="60%" :close-on-click-modal="false" top="10vh" v-drag>
			<el-table :data="searchList" :height="250" size="small" border>
				<el-table-column prop="cusSerialNo" label="产品编码" align="center">
					<template slot-scope="scope">
						<el-input v-model="scope.row.cusSerialNo" size="small" clearable />
					</template>
				</el-table-column>
				<el-table-column prop="cusTitle" label="产品名称" align="center">
					<template slot-scope="scope">
						<el-input v-model="scope.row.cusTitle" size="small" clearable />
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button icon="el-icon-plus" @click="addRow">新增一行</el-button>
				<el-button @click="handleCancel">取 消</el-button>
				<el-button type="primary" @click="handleConfirm" icon="el-icon-check" :disabled="!searchList.length">
					保存
				</el-button>
			</span>
		</el-dialog>
		<!-- 错误的导入数据 -->
		<el-dialog title="错误的导入数据" :visible.sync="errorData.show" width="60%" :close-on-click-modal="false" v-drag>
			<el-table :height="250" :data="errorData.failList" border>
				<el-table-column label="序号" type="index" width="70" align="center" />
				<el-table-column prop="cusSerialNo" label="二级代码" align="center" />
				<el-table-column prop="cusTitle" label="产品名称" align="center" />
			</el-table>
		</el-dialog>
	</div>
</template>

<script>
import { exportExcel } from 'util';
export default {
	name: 'addCustomizeProduct',
	props: ['data', 'disabled'],
	data() {
		return {
			show: false,
			searchList: [],
			loading: false,
			secondLevelSearch: '',
			uploadData: {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.stock,
			},
			exportLoading: false,
			errorData: {
				show: false,
				failList: [],
			},
		};
	},
	methods: {
		// 添加产品 -- 新增一行
		addRow() {
			this.searchList.push({
				cusSerialNo: '',
				cusTitle: '',
			});
		},
		// 添加产品
		addCompositionProduct() {
			this.addRow();
			this.show = true;
		},
		// 删除产品
		removeProduct(row) {
			this.data.forEach((e, i) => {
				if (e.id === row.id) this.data.splice(i, 1);
			});
		},
		// 添加产品取消
		handleCancel() {
			this.show = false;
			this.searchList = [];
		},
		// 添加产品确认
		handleConfirm() {
			if (this.data.length > 1000) {
				return this.$message({
					showClose: true,
					message: '二级产品数量不能超过 1000 个',
					type: 'warning',
				});
			}

			const addList = this.searchList.slice();
			this.$emit('updateCustomizeData', addList);
			this.$nextTick(() => {
				this.show = false;
				this.searchList = [];
			});
		},
		// 下载模板
		downloadMoudel() {
			exportExcel('/mgmt/product/item/getCusItemTemplate');
		},
		//上传excel获取oss地址
		async uploadSuccess(response) {
			this.exportLoading = true;
			let data = {
				url: response.datas.fileUrlKey,
			};
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/product/item/customImport?url=${data.url}`,
			});
			if (res && res.code == 200) {
				const { failList, sucList, errMsg } = res.data;
				if (!sucList?.length && !failList?.length) {
					this.exportLoading = false;
					return this.$message.error(errMsg);
				}
				// 存在且有数据就添加
				if (sucList?.length) {
					this.$emit('updateCustomizeData', sucList);
				}
				// 存在且有失败数据打开弹框显示失败数据
				if (failList?.length) {
					// 显示弹出框
					// 赋值
					this.errorData = {
						show: true,
						failList,
					};
				}
			}
			this.exportLoading = false;
		},
	},
	computed: {
		filterData() {
			const { data, secondLevelSearch } = this;
			let pageData = data.map((e, i) => {
				e.id = i;
				return e;
			});
			let list = pageData.filter(
				data =>
					!secondLevelSearch ||
					data.cusSerialNo.toLowerCase().includes(secondLevelSearch.toLowerCase()) ||
					data.cusTitle.includes(secondLevelSearch.toLowerCase())
			);
			return list;
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep .btn {
	padding: 9px 16px;
}
.warning {
	color: #e6a23c;
}
.marginL5 {
	margin-left: 5px;
}
.row-gap {
	margin-bottom: 16px;
}
.add-tips {
	margin-left: 16px;
}
</style>
