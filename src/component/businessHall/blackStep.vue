<template>
	<div>
		<guideBar />
		<el-card>
			<el-steps :active="stepNum">
				<el-step title="下载excel模板"></el-step>
				<el-step title="按要求填写excel模板并上传"></el-step>
				<el-step :title="`导入结果:成功${data.succNum};失败${data.failNum}`"></el-step>
			</el-steps>
			<el-row type="flex" justify="space-between" class="title">
				<el-col class="down" @click.native="download"><el-button size="small" type="text">点我下载</el-button></el-col>
				<el-col class="upload">
					<el-upload
						class="upload-demo"
						:show-file-list="false"
						:action="axios.defaults.baseURL + '/crm/blacklist/importBlackist'"
						name="file"
						:http-request="handleSuccess"
					>
						<el-button size="small" type="text">点我上传</el-button>
					</el-upload>
				</el-col>
				<el-col class="export">
					<!-- <el-button size="small" @click.native="exportdownload" type="text">导出记录</el-button> -->
				</el-col>
			</el-row>
		</el-card>
	</div>
</template>
<script>
import axios from 'axios';
import { fromDataUpload } from 'util';
export default {
	name: 'blackStep',
	data() {
		return {
			stepNum: 2,
			fileList: [],
			axios,
			data: {
				failNum: 0,
				succNum: 0,
			},
		};
	},
	created() {},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.sys,
			};
			return params;
		},
	},
	methods: {
		download() {
			let templateUrl = '-perfect-oss-uc2.oss-cn-shenzhen.aliyuncs.com/mall-center-cms/wef32687fkwjer.xlsx';
			// 	DEV：https://dev-perfect-oss-uc2.oss-cn-shenzhen.aliyuncs.com/mall-center-cms/wef32687fkwjer.xlsx
			// TEST：https://test-perfect-oss-uc2.oss-cn-shenzhen.aliyuncs.com/mall-center-cms/wef32687fkwjer.xlsx
			// UAT： https://uat-perfect-oss-uc2.oss-cn-shenzhen.aliyuncs.com/mall-center-cms/wef32687fkwjer.xlsx
			window.open(`https://${this.$store.getters['system/getEnv']}${templateUrl}`, '_blank');
		},
		exportdownload() {},
		handleSuccess(res) {
			console.log(res);
			fromDataUpload.call(
				this,
				{
					url: `/crm/blacklist/importBlackist`,
					formObject: { file: res.file },
				},
				res => {
					if (res.code === 200) {
						this.data = res.data;
						this.stepNum = 3;
					}
				}
			);
		},
	},
};
</script>
<style lang="scss" scoped>
.down {
	font-size: 12px;
	cursor: pointer;
	color: $color-link;
}
.upload {
	font-size: 12px;
	text-align: center;
	color: $color-link;
	cursor: pointer;
}
.export {
	font-size: 12px;
	text-align: right;
	cursor: pointer;
	color: $color-link;
}
</style>
