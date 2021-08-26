<template>
	<div class="packageRetainImport">
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
							:action="uploadData.actionUrl"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							:limit="1"
							accept=".xls,.xlsx"
							:on-success="uploadSuccess"
							:show-file-list="false"
							:auto-upload="true"
						>
							<span slot="trigger" class="download">点我上传</span>
						</el-upload>
					</template>
				</el-step>
				<el-step>
					<template slot="title">
						<span>导入结果：成功：{{ importData.succNum }}条；失败：{{ importData.failNum }}条</span>
					</template>
					<template slot="description" v-if="importData.failUrl">
						<span class="download" @click="download(importData.failUrl)">导出失败记录</span>
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
	name: 'packageRetainImport',
	data() {
		return {
			url: axios.defaults.baseURL,
			active: 1,
			importData: {
				succNum: 0,
				failNum: 0,
				failUrl: '',
				total: 0,
				//参数
			},
			uploadData: {
				storageType: this.$config.OSS_UPLOAD_TYPE, // 存储类型（目前支持的类型:FastDFS）
				clientKey: this.$config.CLIENT_KEY.stock, // 客户端Key(由管理员进行分配)
				actionUrl: this.$store.getters['system/getOssUploadUrl'],
			},
		};
	},
	methods: {
		// 下载模板/导出失败记录
		download(url) {
			if (url) {
				window.open(url);
				return;
			}
			exportExcel('/mgmt/product/bundle/getReserveTemplate');
			this.active = 2;
		},
		// 上传成功
		uploadSuccess(result) {
			if (result.success) {
				const { fileUrlKey } = result.datas;
				this.getData(fileUrlKey);
			} else {
				this.$message.error('上传失败');
			}
		},
		// 获取数据
		async getData(url) {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/product/bundle/batchImportReserve',
				params: { url },
			});
			this.active = 3;
			this.importData = { ...res.data };
			// 清空上传
			this.$refs.upload.clearFiles();
		},
	},
};
</script>
<style lang="scss" scoped>
::v-deep.packageRetainImport {
	.box-card {
		margin: 24px 0;
	}
	.download:hover {
		cursor: pointer;
		color: #3883f8;
	}
}
</style>
