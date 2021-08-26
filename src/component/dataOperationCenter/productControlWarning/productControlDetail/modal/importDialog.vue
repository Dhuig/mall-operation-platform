<template>
	<el-dialog
		:title="dialogForm.title"
		:visible.sync="dialogForm.show"
		width="30%"
		:before-close="handleClose"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
	>
		<el-form ref="form" :model="form" label-width="100px">
			<el-form-item label="导入清单" prop="fileList">
				<el-upload
					:http-request="upload"
					action="#"
					:on-remove="handleRemove"
					multiple
					:limit="1"
					:file-list="fileList"
				>
					<el-button size="small" type="primary">点击上传</el-button>
					<div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过20M</div>
				</el-upload>
			</el-form-item>
			<el-form-item>
				<el-button type="text" @click="downModel">下载模板</el-button>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleClose">取 消</el-button>
			<el-button :loading="loading" type="primary" @click="success">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import { uploadFileType } from 'util/formValidation';
import { exportExcel } from 'util';
import { DOWNLOAD_MODEL, IMPORT_API } from './config.js';
export default {
	props: {
		dialogForm: {
			type: Object,
			default: () => {},
		},
		ruleId: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			fileList: [],
			uploadData: null,
			loading: false,
		};
	},
	methods: {
		handleClose() {
			this.fileList = [];
			this.uploadData = null;
			this.$emit('changeDialog', false);
		},
		// 下载模板
		downModel() {
			exportExcel(DOWNLOAD_MODEL[this.dialogForm.type]);
		},
		// 自定义上传
		async upload({ file }) {
			let result = uploadFileType.call(this, file, ['xls', 'xlsx'], 20);
			if (result) {
				const data = new FormData();
				data.append('excelFile', file);
				data.append('ruleId', this.ruleId);
				this.uploadData = data;
			} else {
				this.fileList = [];
			}
		},
		// 确定按键
		async success() {
			this.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: IMPORT_API[this.dialogForm.type],
				data: this.uploadData,
				callback: () => {
					this.loading = false;
				},
			});
			if (res?.code === 200) {
				this.$message.success('上传成功');
				this.handleClose();
				this.$emit('updataList');
			} else {
				this.$message.error('上传失败');
			}
		},
	},
};
</script>
