<template>
	<div class="materiaDetails">
		<guideBar />
		<el-card>
			<el-form
				:disabled="/details/.test(query.type)"
				:model="materialForm"
				:rules="MATERIAFORMRULE"
				ref="materialForm"
				label-width="100px"
			>
				<el-form-item label="素材编号" prop="materialNo">
					<el-input
						maxlength="40"
						show-word-limit
						clearable
						v-model="materialForm.materialNo"
						placeholder="请输入素材编号"
					></el-input>
				</el-form-item>

				<el-form-item label="素材名称" prop="name">
					<el-input
						maxlength="40"
						show-word-limit
						clearable
						v-model="materialForm.name"
						placeholder="请输入素材名称"
					></el-input>
				</el-form-item>

				<el-form-item label="素材分类" prop="cmsTypeLabelId">
					<el-select clearable v-model="materialForm.cmsTypeLabelId" placeholder="请选择素材分类">
						<el-option
							:label="label"
							:value="value"
							v-for="{ value, label } in details.sourceMaterialLabelArr"
							:key="value"
						></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="素材标签" prop="cmsClassificationLabelIds">
					<el-select multiple clearable v-model="materialForm.cmsClassificationLabelIds" placeholder="请选择素材标签">
						<el-option
							:label="label"
							:value="value"
							v-for="{ value, label } in details.classificationLabelArr"
							:key="value"
						></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="商品ID" prop="productId">
					<el-input
						clearable
						maxlength="10"
						show-word-limit
						v-model="materialForm.productId"
						placeholder="请输入商品ID"
					></el-input>
				</el-form-item>

				<el-form-item label="素材上传" prop="cmsMaterialFileBaseReqVOS">
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						list-type="picture-card"
						v-loading="uploadLoading"
						:limit="10"
						multiple
						:on-success="cmsMaterialFileBaseReqVOSSuccess"
						:on-progress="onProgress"
						:on-error="onError"
						:before-upload="beforeUpload"
						:file-list="uploadFileList.materialUrl"
						:class="materialForm.cmsMaterialFileBaseReqVOS.length == 10 ? 'hide_box' : 'avatar-gap'"
					>
						<i class="el-icon-plus"></i>
						<div slot="file" slot-scope="{ file }" class="uploadSlotDiv">
							<!-- <pdf
								v-if="file && file.response && file.response.datas && file.response.datas.fileUrlKey.includes('.pdf')"
								:src="file.url"
							></pdf> -->
							<img v-if="isShowImg(file.name)" class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
							<div v-else>
								<p>{{ file.name }}</p>
								<p>不支持预览格式</p>
							</div>
							<span class="el-upload-list__item-actions">
								<span v-if="isShowImg(file.name)" class="el-upload-list__item-preview" @click="handlePreview(file)">
									<i class="el-icon-zoom-in"></i>
								</span>
								<span
									class="el-upload-list__item-delete"
									v-if="query.type != 'details'"
									@click="cmsMaterialFileBaseReqVOSRemove(file)"
								>
									<i class="el-icon-delete"></i>
								</span>
							</span>
						</div>
					</el-upload>
				</el-form-item>

				<el-form-item label="素材封面图" prop="coverUrl">
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						list-type="picture-card"
						:limit="1"
						:file-list="uploadFileList.coverUrl"
						:before-upload="beforeAvatarUpload"
						:on-success="coverUrlSuccess"
						:on-preview="handlePreview"
						:on-remove="coverUrlRemove"
						:class="materialForm.coverUrl ? 'hide_box' : 'avatar-gap'"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>

				<el-form-item label="素材状态" prop="status">
					<el-select clearable v-model="materialForm.status" placeholder="请选择素材状态">
						<el-option label="启用" :value="1"></el-option>
						<el-option label="禁用" :value="0"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="素材说明" prop="remarks">
					<el-input
						maxlength="1000"
						show-word-limit
						type="textarea"
						v-model="materialForm.remarks"
						placeholder="请输入素材说明"
					></el-input>
				</el-form-item>

				<!-- <el-form-item>
					<el-button type="primary" @click="submitForm">保存</el-button>
					<el-button @click="closeDialog">取消</el-button>
				</el-form-item> -->
			</el-form>
		</el-card>
		<el-card v-if="/details/.test(query.type)">
			<h6>操作记录</h6>
			<el-table :data="materialForm.cmsMaterialOperatorLogVOS" border :resizable="false">
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
import { FILEFORMAT, MATERIAFORMRULE, COMMONDATA, OPERATIONCONTENT } from './config';
import { formatDate } from 'util/formValidation';

export default {
	name: 'materiaDetails',
	data() {
		return {
			FILEFORMAT,
			MATERIAFORMRULE,
			OPERATIONCONTENT,
			query: {
				type: '',
				id: null,
			},
			materialForm: {
				materialNo: '', // 素材编号
				name: '', // 素材名称
				cmsClassificationLabelIds: [], // 素材标签
				cmsTypeLabelId: [], //素材分类ID
				coverUrl: '', // 封面图地址
				cmsMaterialFileBaseReqVOS: [], // 素材上传
				productId: '', //商品id
				status: 0, // 素材状态
				forwardStatus: 1, // 转发状态
				author: '', // 作者名称
				remarks: '', // 素材说明
			},
			// 上传加载
			uploadLoading: false,
			dialog: {
				visible: false,
				url: '',
				// isPdf: false,
			},
			// 上传组件回显数据
			uploadFileList: {
				coverUrl: [],
				materialUrl: [],
			},
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
			this.$confirm('确认后离开页面, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				center: true,
			}).then(async () => {
				this.$closeSelf();
				this.$go('material_list');
			});
		},
		// 是否是图片
		isShowImg(name) {
			if (name) {
				const { imgList } = this.FILEFORMAT;
				return imgList.filter(x => name.includes(x)).length;
			}
		},
		// 素材上传 上传前校验
		beforeUpload(file) {
			const { fileList, movieList, musicList, imgList } = this.FILEFORMAT;
			let whiteList = [...fileList, ...movieList, ...musicList, ...imgList];
			return uploadFileType.call(this, file, whiteList, 100);
			// 图片上限20张，单张上限10m，上传超限制提示“上传大小最大为10m
		},
		// 素材上传 成功回调
		cmsMaterialFileBaseReqVOSSuccess(res, file, fileList) {
			if (res.success) {
				console.log(fileList);
				let resultList = fileList.map(x => ({
					fileName: x.name,
					fileUrl: x?.response?.datas?.fileUrlKey || x.url,
					fileSize: '',
				}));
				this.materialForm.cmsMaterialFileBaseReqVOS = resultList;
				this.uploadFileList.materialUrl = fileList;
			} else {
				fileList.splice(fileList.indexOf(file), 1);
				this.$message.error(res.errorMessage);
			}
			this.uploadLoading = false;
		},
		// 素材上传 移除回调
		cmsMaterialFileBaseReqVOSRemove(res) {
			this.materialForm.cmsMaterialFileBaseReqVOS.forEach((e, index, arr) => {
				if (e.fileName === res.name) arr.splice(index, 1);
			});

			this.uploadFileList.materialUrl.forEach((e, i, arr) => {
				if (e.uid === res.uid) arr.splice(i, 1);
			});
		},
		// 素材上传 上传前添加loading回调
		onProgress() {
			this.uploadLoading = true;
		},
		// 素材上传 失败
		onError() {
			this.uploadLoading = false;
		},
		// 素材封面图 上传前校验
		beforeAvatarUpload(file) {
			const { imgList } = this.FILEFORMAT;
			return uploadFileType.call(this, file, imgList, 20);
		},
		// 素材封面图 成功回调
		coverUrlSuccess(res, file, fileList) {
			if (res.success) {
				let url = '';
				fileList.map(x => {
					url = x.response.datas.fileUrlKey;
				});
				this.materialForm.coverUrl = url;
			}
		},
		// 素材封面图 移除回调
		coverUrlRemove() {
			this.materialForm.coverUrl = '';
			this.uploadFileList.coverUrl = [];
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
			this.$refs.materialForm.validate(async valid => {
				if (valid) {
					const { materialForm } = this;
					let url =
						this.query.type == 'edit'
							? '/mgmt/cms/material/updateCmsMaterialFile' // 编辑
							: `/mgmt/cms/material/addCmsMaterialFile`; // 添加

					let data = {
						...materialForm,
						productId: materialForm.productId ? Number(materialForm.productId) : null,
						cmsClassificationLabelIds: materialForm.cmsClassificationLabelIds.join(','),
					};

					// Object.keys(data).map(i => {
					// 	if (!data[i] && typeof data[i] !== 'number') {
					// 		delete data[i];
					// 	}
					// });
					const res = await this.$fetch({
						method: 'POST',
						url,
						data,
					});

					if (res?.code == 200) {
						this.$message.success(res.message);
						this.$dispatch('MATERIAL_LIST');
						this.closeDialog();
						this.$closeSelf();
						this.$go('material_list');
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
			this.uploadFileList.materialUrl = [];
			this.uploadFileList.coverUrl = [];
			this.$refs.materialForm.resetFields();
		},
		// 获取素材分类 下拉框数据
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
		// 获取素材标签 下拉框数据
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
			const res = await this.$fetch(`/mgmt/cms/material/queyCmsMaterialFileQueryById/${id}`);
			if (res?.code == 200) {
				this.handleDetails(res.data);
			}
		},
		// 数据处理
		handleDetails(materialForm) {
			this.$nextTick(() => {
				this.materialForm = {
					...materialForm,
					cmsClassificationLabelIds: materialForm.cmsClassificationLabelIds.split(',').map(x => Number(x)),
					cmsMaterialFileBaseReqVOS: materialForm.cmsMaterialFileBaseRespVOS,
				};
				// console.log(this.materialForm.cmsMaterialOperatorLogVOS);
			});
			// 编辑的时候 删除不必要的对象参数
			if (this.query.type == 'edit') {
				[
					'cmsMaterialOperatorLogVOS',
					'cmsMaterialFileBaseRespVOS',
					'createTime',
					'updateTime',
					'logicLabel',
					'type',
				].map(x => {
					delete this.materialForm[x];
				});
			}
			// 添加上传回显
			this.uploadFileList = {
				coverUrl: [{ url: materialForm.coverUrl }],
				materialUrl: materialForm.cmsMaterialFileBaseRespVOS.map(x => ({
					name: x.fileName,
					url: x.fileUrl,
				})),
			};
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
::v-deep.el-input.is-disabled input::-webkit-input-placeholder {
	color: #f5f7fa !important;
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

::v-deep.el-upload-list--picture-card .el-upload-list__item-thumbnail {
	object-fit: cover !important;
}
.uploadSlotDiv {
	height: 100%;
	img {
		object-fit: cover;
	}
}
h6 {
	font-weight: bold;
	margin-bottom: 20px;
}
</style>
