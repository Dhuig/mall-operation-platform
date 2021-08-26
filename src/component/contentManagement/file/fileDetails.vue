<template>
	<div class="fileDetails">
		<guideBar />
		<el-card>
			<el-form
				:disabled="/details/.test(query.type)"
				:model="fileForm"
				:rules="FILEFORMRULE"
				ref="fileForm"
				label-width="100px"
			>
				<el-form-item label="文档编号" prop="materialNo">
					<el-input
						maxlength="40"
						show-word-limit
						clearable
						v-model="fileForm.materialNo"
						placeholder="请输入文档编号"
					></el-input>
				</el-form-item>

				<el-form-item label="文档名称" prop="name">
					<el-input
						maxlength="40"
						show-word-limit
						clearable
						v-model="fileForm.name"
						placeholder="请输入文档名称"
					></el-input>
				</el-form-item>

				<el-form-item label="作者名称" prop="author">
					<el-input
						maxlength="40"
						show-word-limit
						clearable
						v-model="fileForm.author"
						placeholder="请输入作者名称"
					></el-input>
				</el-form-item>

				<el-form-item label="文档状态" prop="status">
					<el-select clearable v-model="fileForm.status" placeholder="请选择文档状态">
						<el-option label="启用" :value="1"></el-option>
						<el-option label="禁用" :value="0"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="文档标签" prop="cmsClassificationLabelIds">
					<el-select multiple clearable v-model="fileForm.cmsClassificationLabelIds" placeholder="请选择文档标签">
						<el-option
							:label="label"
							:value="value"
							v-for="{ value, label } in details.classificationLabelArr"
							:key="value"
						></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="文档分类" prop="cmsTypeLabelId">
					<el-select clearable v-model="fileForm.cmsTypeLabelId" placeholder="请选择文档分类">
						<el-option
							:label="label"
							:value="value"
							v-for="{ value, label } in details.sourceMaterialLabelArr"
							:key="value"
						></el-option>
					</el-select>
				</el-form-item>

				<!-- <el-form-item label="转发状态" prop="forwardStatus">
					<el-radio-group v-model="fileForm.forwardStatus">
						<el-radio :label="1">允许转发</el-radio>
						<el-radio :label="0">不允许转发</el-radio>
					</el-radio-group>
				</el-form-item> -->

				<el-form-item label="文档封面图" prop="coverUrl">
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						list-type="picture-card"
						:limit="1"
						:file-list="coverUrl"
						:before-upload="beforeAvatarUpload"
						:on-success="coverUrlSuccess"
						:on-preview="handlePreview"
						:on-remove="coverUrlRemove"
						:class="fileForm.coverUrl ? 'hide_box' : 'avatar-gap'"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
				<div v-for="(item, index) in fileForm.cmsMaterialDocBaseReqVOS" :key="index">
					<el-form-item
						label="目录名字"
						:rules="{
							required: true,
							message: '目录名字不能为空',
							trigger: 'blur',
						}"
						:prop="'cmsMaterialDocBaseReqVOS.' + index + '.directoryName'"
					>
						<el-row type="flex" align="middle">
							<el-input
								maxlength="40"
								show-word-limit
								clearable
								v-model="item.directoryName"
								class="marginR20"
								placeholder="请输入目录名字"
							></el-input>
							<el-button type="primary" v-if="index > 0 && /add|edit/.test(query.type)" @click="delCatalog(index)">
								删除目录
							</el-button>
						</el-row>
					</el-form-item>

					<el-form-item
						label="内容"
						:rules="{
							required: true,
							message: '内容不能为空',
							trigger: 'blur',
						}"
						:prop="'cmsMaterialDocBaseReqVOS.' + index + '.context'"
					>
						<tinyEditor
							:disabled="/details/.test(query.type)"
							v-model="item.context"
							:id="catalogId + index"
							:key="`catalog${index}`"
						/>
					</el-form-item>
				</div>
			</el-form>
			<el-row type="flex" justify="space-around" align="middle" v-if="/add|edit/.test(query.type)">
				<el-button type="primary" @click="addCatalog">添加新目录</el-button>
				<div>(备注: 若是新增的目录,目录和内容为必填)</div>
			</el-row>
		</el-card>
		<el-card v-if="/details/.test(query.type)">
			<h6>操作记录</h6>
			<el-table :data="fileForm.cmsMaterialOperatorLogVOS" border :resizable="false">
				<el-table-column prop="operatorType" align="center" label="操作内容">
					<template slot-scope="scope">
						{{ OPERATIONCONTENT[scope.row.operatorType] }}
					</template>
				</el-table-column>
				<el-table-column prop="createTime" align="center" label="操作时间">
					<template slot-scope="scope">
						{{ scope.row.createTime | formatDate }}
					</template>
				</el-table-column>
				<el-table-column prop="operator" align="center" label="操作人"></el-table-column>
			</el-table>
		</el-card>
		<!-- 产品信息 保存/更新 按钮区域 -->
		<actionBar v-if="/add|edit/.test(query.type)">
			<el-row type="flex" justify="end">
				<el-button @click="returnBlack">返回</el-button>

				<template v-if="/add/.test(query.type)">
					<el-button type="success" @click="submitForm">保存</el-button>
				</template>
				<template v-if="/edit/.test(query.type)">
					<el-button type="warning" @click="submitForm">保存</el-button>
				</template>
			</el-row>
		</actionBar>
		<el-dialog v-drag :visible.sync="dialog.visible" @closed="dialog.visible = false">
			<!-- <pdf v-if="dialog.isPdf" :src="dialog.url"></pdf> -->
			<img width="100%" :src="dialog.url" alt="" />
		</el-dialog>
	</div>
</template>

<script>
import { uploadFileType } from 'util/formValidation';
import { FILEFORMRULE, COMMONDATA, OPERATIONCONTENT } from './config';
import { formatDate } from 'util/formValidation';
import { generateRandomCode } from '@/util';
export default {
	name: 'fileDetails',
	data() {
		return {
			FILEFORMRULE,
			OPERATIONCONTENT,
			catalogId: generateRandomCode(),
			query: {
				type: '',
				id: null,
			},
			fileForm: {
				materialNo: '', // 文档编号
				name: '', // 文档名称
				cmsClassificationLabelIds: [], // 文档标签
				cmsTypeLabelId: [], //文档分类ID
				coverUrl: '', // 封面图地址
				author: '', // 作者名称
				status: 0, // 文档状态
				// forwardStatus: 0, // 转发状态
				cmsMaterialDocBaseReqVOS: [{ context: '', directoryName: '' }], // 内容合集
			},
			// 上传加载
			uploadLoading: false,
			dialog: {
				visible: false,
				url: '',
				// isPdf: false,
			},
			// 上传组件回显数据
			coverUrl: [],
			details: {
				classificationLabelArr: [],
				sourceMaterialLabelArr: [],
			},
		};
	},
	filters: {
		formatDate: val => formatDate(val),
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.cms,
			};
			return params;
		},
	},
	methods: {
		// 返回
		returnBlack() {
			this.$closeSelf();
			this.$go('file_list');
		},
		// 添加目录
		addCatalog() {
			let length = this.fileForm.cmsMaterialDocBaseReqVOS.length;
			if (length >= 30) {
				return this.$message.warning('最多只能添加30个目录');
			}
			this.fileForm.cmsMaterialDocBaseReqVOS.push({ context: '', directoryName: '' });
		},
		// 删除目录
		delCatalog(index) {
			this.fileForm.cmsMaterialDocBaseReqVOS.splice(index, 1);
		},
		// 文档封面图 上传前校验
		beforeAvatarUpload(file) {
			return uploadFileType.call(this, file, ['jpg', 'png', 'jpeg', 'gif'], 20);
		},
		// 文档封面图 成功回调
		coverUrlSuccess(res, file, fileList) {
			if (res.success) {
				let url = '';
				fileList.map(x => {
					url = x.response.datas.fileUrlKey;
				});
				this.fileForm.coverUrl = url;
			}
		},
		// 文档封面图 移除回调
		coverUrlRemove() {
			this.fileForm.coverUrl = '';
			this.coverUrl = [];
		},
		// 公共的查看浏览
		handlePreview(file) {
			let url;
			if (file.response) {
				const { fileUrlKey } = file.response.datas;
				url = fileUrlKey;
			} else {
				url = file.url;
			}
			this.dialog = {
				visible: true,
				url,
				// isPdf: url.includes('.pdf'),
			};
		},
		// 保存
		submitForm() {
			this.$refs.fileForm.validate(async valid => {
				if (valid) {
					const { fileForm } = this;
					let url =
						this.query.type == 'edit'
							? '/mgmt/cms/material/updateCmsMaterialDoc' // 编辑
							: `/mgmt/cms/material/addCmsMaterialDoc`; // 添加
					const res = await this.$fetch({
						method: 'POST',
						url,
						data: {
							...fileForm,
							cmsClassificationLabelIds: fileForm.cmsClassificationLabelIds.join(','),
						},
					});
					if (res?.code == 200) {
						this.$message.success(res.message);
						this.$dispatch('MATERIAL_LIST');
						this.closeDialog();
						this.returnBlack();
					} else {
						if (this.$store.getters['system/getError']) {
							this.$message.error(res.data.message);
						}
					}
				}
			});
		},
		// 取消
		closeDialog() {
			this.coverUrl = [];
			this.$refs.fileForm.resetFields();
		},
		// 文档分类 下拉框数据
		async getClassificationDate() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/cms/classificationLabel/queryLabelList`,
				timeout: 60000 * 1,
				data: COMMONDATA,
			});
			if (res?.code == 200) {
				const { cmsLabelRespVos } = res.data;
				let optionArray = cmsLabelRespVos.map(({ id, name }) => ({ value: id, label: name }));
				this.details.classificationLabelArr = optionArray;
			}
		},
		// 文档标签 下拉框数据
		async getLabelDate() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/cms/typeLabel/queryTypeLabelList`,
				timeout: 60000 * 1,
				data: COMMONDATA,
			});
			if (res?.code == 200) {
				const { cmsLabelRespVos } = res.data;
				let optionArray = cmsLabelRespVos.map(({ id, name }) => ({ value: id, label: name }));
				this.details.sourceMaterialLabelArr = optionArray;
			}
		},
		// 获取详情接口
		async getDetails(id) {
			if (!id) {
				return this.$message.error('id 不存在');
			}
			const res = await this.$fetch(`/mgmt/cms/material/queryCmsMaterialDocQueryById/${id}`);
			if (res?.code == 200) {
				this.handleDetails(res.data);
			}
		},
		// 数据处理
		handleDetails(fileForm) {
			this.$nextTick(() => {
				this.fileForm = {
					...fileForm,
					cmsClassificationLabelIds: fileForm.cmsClassificationLabelIds.split(',').map(x => Number(x)),
					cmsMaterialDocBaseReqVOS: fileForm.cmsMaterialDocBaseRespVOS,
				};
				// console.log(this.fileForm.cmsMaterialOperatorLogVOS);
			});
			// 编辑的时候 删除不必要的对象参数
			if (this.query.type == 'edit') {
				[
					'cmsMaterialOperatorLogVOS',
					'cmsMaterialDocBaseRespVOS',
					'createTime',
					'updateTime',
					'logicLabel',
					'type',
				].map(x => {
					delete this.fileForm[x];
				});
			}
			// 添加上传回显
			this.coverUrl = [{ url: fileForm.coverUrl }];
		},
	},
	async created() {
		this.query = this.$route.query;
		if (this.query.id) {
			await this.getDetails(this.query.id);
		}
		await this.getClassificationDate();
		await this.getLabelDate();
	},
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
	overflow-y: auto;
	max-height: 520px;
}
// 图片隐藏
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
::v-deep.el-input {
	width: 600px !important;
}
::v-deep.el-select .el-input__inner {
	width: 600px !important;
}
::v-deep.el-textarea {
	width: 600px !important;
}

::v-deep.el-input.is-disabled input::-webkit-input-placeholder {
	color: #f5f7fa !important;
}

::v-deep.el-upload-list--picture-card .el-upload-w-thumbnail {
	object-fit: cover !important;
}
.uploadSlotDiv {
	height: 100%;
	img {
		object-fit: cover;
	}
}
.marginR20 {
	margin-right: 20px;
}
h6 {
	font-weight: bold;
	margin-bottom: 20px;
}
</style>
