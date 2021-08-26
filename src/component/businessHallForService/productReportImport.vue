<template>
	<div class="holiday-manage-import">
		<guideBar />
		<el-card class="box-card">
			<el-steps :active="active" align-center>
				<el-step title="下载excel模板">
					<template slot="description">
						<span class="download" @click="download">点我下载</span>
					</template>
				</el-step>
				<el-step title="按要求填写excel模板并上传">
					<template slot="description">
						<el-upload
							ref="upload"
							:action="url + '/mgmt/store/productReportApply/excelBatchImport'"
							:headers="$store.getters['system/getSignatureVerification']"
							:limit="1"
							:before-upload="beforeUpload"
							accept=".xls,.xlsx"
							class="up-class"
							:on-success="uploadSuccess"
							:show-file-list="false"
							:auto-upload="true"
							name="excelFile"
						>
							<span slot="trigger" class="download">点我上传</span>
						</el-upload>
					</template>
				</el-step>
				<el-step>
					<template slot="title">
						<span>导入结果：成功：{{ importData.successCount }}条；失败：{{ importData.failCount }}条</span>
					</template>
					<template slot="description">
						<span v-if="this.active === 3" @click="exportRecord" class="download">导出失败记录</span>
					</template>
				</el-step>
			</el-steps>
		</el-card>
	</div>
</template>

<script>
import axios from 'axios';
import { exportExcel } from 'util';
export default {
	name: 'productReportImport',
	data() {
		return {
			url: axios.defaults.baseURL,
			active: 1,
			importData: {
				success: 0,
				failure: 0,
				//参数
			},
			uploadUrl: '', //地址
			token: {
				//请求头
				Authorization: null,
			},
		};
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			};
			return params;
		},
	},
	methods: {
		exportRecord() {
			exportExcel('/mgmt/store/productReportApply/exportFailList');
		},
		// 下载模板
		download() {
			exportExcel('/mgmt/store/productReportApply/templateDownLaod');
			this.active = 2;
		},
		// 上传之前钩子
		beforeUpload() {
			// let extension = file.name.substring(file.name.lastIndexOf('.') + 1);file
			// if (extension !== 'xls' || extension !== 'xlsx') {
			// 	this.$message({
			// 		message: '上传文件只能是 xls格式!',
			// 		type: 'warning',
			// 	});
			// 	return false;
			// }
		},
		// 上传成功
		uploadSuccess(res) {
			if (res.code === 200) {
				this.importData = res.data;
				this.$message.success('导入成功');
			} else {
				this.$message.error(res.message);
			}
			if (res.code !== 500) this.active = 3;
			this.$refs.upload.clearFiles();
		},
	},
	mounted() {
		// this.uploadUrl = '路径';
		// this.token.Authorization = Cookies.get('token'); //从cookie里获取token
	},
};
</script>
<style lang="scss" scoped>
::v-deep.holiday-manage-import {
	.box-card {
		margin: 24px 0;
	}
	.download:hover {
		cursor: pointer;
		color: #3883f8;
	}
}
</style>
