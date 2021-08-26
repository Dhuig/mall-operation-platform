<template>
	<div class="service-project-edit">
		<guideBar />
		<el-card>
			<el-form :model="form" ref="form" :rules="FORM_RULES" label-width="110px">
				<el-form-item label="服务项目名称" prop="itemName">
					<el-input v-model="form.itemName"></el-input>
					<span class="tips">1~20个字，不支持特殊符号</span>
				</el-form-item>
				<el-form-item label="服务项目图片" prop="itemFileList">
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:data="uploadParams"
						:headers="$store.getters['system/getSignatureVerification']"
						list-type="picture-card"
						:on-success="handleImgSuccess"
						:on-preview="handleImgPreview"
						:on-remove="handleImgRemove"
						:before-upload="beforeAvatarUpload"
						:file-list="form.itemFileList"
						:limit="3"
						:class="form.itemFileList && form.itemFileList.length === 3 ? 'hide_box' : ''"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog v-drag :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="" />
					</el-dialog>
					<div class="tips">支持格式bmp、jpg、png，最大10M，3张图片</div>
				</el-form-item>
				<el-form-item label="服务项目单位" prop="itemUnit">
					<el-input v-model="form.itemUnit" placeholder="请输入服务项目单位"></el-input>
					<span class="tips">1~40位字符，不支持特殊符号</span>
				</el-form-item>
				<el-form-item label="服务项目规格" prop="itemSkuList">
					<el-row>
						<el-col :span="10">
							<tableList :dataSource="form.itemSkuList" :columns="SERVICE_PROJECT_SPECS_COLUMNS" slotcontent>
								<template slot-scope="scope">
									<el-button
										v-permission="'perfect_home_service_project_deletespecs'"
										type="text"
										@click="specsDel(scope.data, scope.index)"
									>
										删除
									</el-button>
								</template>
							</tableList>
						</el-col>
					</el-row>
					<el-row>
						<el-button v-permission="'perfect_home_service_project_addspecs'" type="primary" @click="addSpecs">
							添加规格
						</el-button>
						<span class="tips ml-10">1~10个字，不支持特殊符号，最多添加5个规格，不可重复添加</span>
					</el-row>
				</el-form-item>
				<el-form-item label="关联产品" prop="itemProductList">
					<el-row>
						<el-col :span="16">
							<tableList :dataSource="form.itemProductList" :columns="SERVICE_PROJECT_PRODUCT_COLUMNS" slotcontent>
								<template slot-scope="scope">
									<el-button
										v-permission="'perfect_home_service_project_deleteproduct'"
										type="text"
										@click="productDel(scope.data, scope.index)"
									>
										删除
									</el-button>
								</template>
							</tableList>
						</el-col>
					</el-row>
					<el-row>
						<el-button v-permission="'perfect_home_service_project_addproduct'" type="primary" @click="addProduct">
							添加产品
						</el-button>
						<span class="tips ml-10">最多添加5个关联产品</span>
					</el-row>
				</el-form-item>
				<el-form-item label="服务说明" prop="remarks">
					<tinyEditor :id="id" v-model="form.remarks" />
				</el-form-item>
			</el-form>
		</el-card>
		<actionBar>
			<el-button v-permission="'perfect_home_service_project_toback'" @click="toBack('form')">返回</el-button>
			<el-button
				v-permission="'perfect_home_service_project_submit'"
				type="primary"
				v-bind:loading="saveButtonLoading"
				@click="saveForm('form')"
			>
				保存
			</el-button>
		</actionBar>
		<!-- 添加规格 -->
		<el-dialog v-drag title="添加规格" width="500px" :visible.sync="addSpecsVisible">
			<el-form :model="addSpecsForm" ref="addSpecsForm" :rules="ADD_PROJECT_SPECS_RULES" label-width="80px">
				<el-row style="margin-bottom: 16px">规格名最长10个字，最多添加5个规格，不可重复添加。</el-row>
				<el-form-item label="规格名称" prop="skuName">
					<el-input v-model="addSpecsForm.skuName" placeholder="请输入规格名称"></el-input>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="end">
				<el-button @click="addSpecsCancel('addSpecsForm')">取消</el-button>
				<el-button type="primary" @click="addSpecsSave('addSpecsForm')">添加</el-button>
			</el-row>
		</el-dialog>
		<!-- 新增关联产品 -->
		<el-dialog v-drag title="新增关联产品" width="500px" :visible.sync="addProductVisible">
			<el-form :model="addProductForm" ref="addProductForm" :rules="ADD_RELATION_PRODUCT_RULES" label-width="80px">
				<el-form-item label="搜索产品" prop="serialNo">
					<el-select
						v-model="addProductForm.serialNo"
						filterable
						remote
						placeholder="请输入关键词"
						:remote-method="loadProducts"
					>
						<el-option v-for="item in products" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="end">
				<el-button @click="addProductCancel('addProductForm')">取消</el-button>
				<el-button type="primary" @click="addProductSave('addProductForm')">添加</el-button>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import {
	SERVICE_PROJECT_SPECS_COLUMNS,
	SERVICE_PROJECT_PRODUCT_COLUMNS,
	FORM_RULES,
	ADD_PROJECT_SPECS_RULES,
	ADD_RELATION_PRODUCT_RULES,
} from './config';
import { generateRandomCode } from 'util';
import { uploadFileType } from 'util/formValidation';
import { deepCopy } from '../../serviceCenter/serviceCenterData/util';
export default {
	name: 'serviceProjectEdit',
	data() {
		return {
			SERVICE_PROJECT_SPECS_COLUMNS,
			SERVICE_PROJECT_PRODUCT_COLUMNS,
			FORM_RULES,
			ADD_PROJECT_SPECS_RULES,
			ADD_RELATION_PRODUCT_RULES,
			id: generateRandomCode(), // 富文本id
			accItemId: '', // 项目id
			init: {},
			originalImgDel: [], //被删除的原始图片
			originalGpecsDel: [], //被删除的原始规格
			originalProductDel: [], //被删除的原始产品
			form: {
				id: '',
				remarks: '',
				itemSkuList: [], // 规格
				itemProductList: [], // 关联产品
				itemFileList: [], //图片
			},
			dialogVisible: false, // 图片预览弹窗状态
			dialogImageUrl: '', // 图片预览链接
			addSpecsVisible: false, //添加规格弹窗状态
			addSpecsForm: {
				// 添加规格弹窗form
				skuName: '',
			},
			addProductVisible: false, //添加关联产品弹窗状态
			addProductForm: { serialNo: '' },
			products: [], //搜索的产品
			saveButtonLoading: false, //提交按钮loading
		};
	},
	computed: {
		uploadParams() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.service,
			};
			return params;
		},
	},
	methods: {
		// 图片上传 验证
		beforeAvatarUpload(file) {
			console.log(file);
			const whiteList = ['jpg', 'png', 'bmp'];
			return uploadFileType.bind(this, file, whiteList, 10)();
		},
		// 图片上传成功
		handleImgSuccess(response) {
			this.dialogImageUrl = response.datas.fileUrlKey;
			this.form.itemFileList.push({ url: response.datas.fileUrlKey, fileUrl: response.datas.fileUrlKey });
		},
		// 图片预览
		handleImgPreview(data) {
			this.dialogVisible = true;
			this.dialogImageUrl = data.url;
		},
		// 图片删除
		handleImgRemove(file, fileList) {
			this.form.itemFileList = fileList;
			this.dialogImageUrl = '';
			if (file.logicLabel) {
				this.originalImgDel.push({ ...file, logicLabel: 0 });
			}
		},
		// 删除规格
		specsDel(row, index) {
			this.$confirm('删除确认', '确认提示')
				.then(() => {
					this.form.itemSkuList.splice(index, 1);
					if (row.logicLabel) {
						this.originalGpecsDel.push({ ...row, logicLabel: 0 });
					}
				})
				.catch(() => {});
		},
		// 删除产品
		productDel(row, index) {
			this.$confirm('删除确认', '确认提示')
				.then(() => {
					this.form.itemProductList.splice(index, 1);
					if (row.logicLabel) {
						this.originalProductDel.push({ ...row, logicLabel: 0 });
					}
				})
				.catch(() => {});
		},
		// 添加规格
		addSpecs() {
			this.addSpecsVisible = true;
		},
		// 添加规格 取消
		addSpecsCancel(formName) {
			this.$refs[formName].resetFields();
			this.addSpecsVisible = false;
		},
		// 添加规格 确定
		addSpecsSave(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					const { skuName } = this.addSpecsForm;
					if (
						this.form.itemSkuList.length < 5 &&
						!this.form.itemSkuList.map(({ skuName }) => skuName).includes(skuName)
					) {
						this.form.itemSkuList.push({ skuName });
						this.addSpecsCancel(formName);
					} else {
						this.$message.warning('最多添加5个规格，不可重复添加');
					}
				}
			});
		},
		// 新增关联产品
		addProduct() {
			this.addProductVisible = true;
		},
		// 新增关联产品 取消
		addProductCancel(formName) {
			this.$refs[formName].resetFields();
			this.addProductVisible = false;
			this.addProductForm.data = '';
		},
		// 新增关联产品 确定
		addProductSave(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const { serialNo } = this.addProductForm;
					const res = await this.$fetch(`/mgmt/product/item/getProductInfo?serialNo=${serialNo}`);
					if (res && res.data) {
						const { serialNo, title, retailPrice, pv, productStatus } = res.data;
						if (productStatus == 8) {
							this.$message.warning('该产品已下架，不可添加');
						} else {
							if (
								this.form.itemProductList.length < 5 &&
								!this.form.itemProductList.map(({ serialNo }) => serialNo).includes(serialNo)
							) {
								this.form.itemProductList.push({ serialNo, title, retailPrice, pv, logicLabel: 1 });
								this.addProductCancel(formName);
							} else {
								this.$message.warning('最多添加5个关联产品，不可重复添加');
							}
						}
					} else {
						this.$message.error('获取产品信息失败');
					}
				}
			});
		},
		// 返回
		toBack() {
			this.$closeSelf();
		},
		// 保存
		async saveForm(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const {
						form: { itemFileList, itemSkuList, itemProductList },
						originalImgDel,
						originalGpecsDel,
						originalProductDel,
					} = this;
					let data = deepCopy(this.form);
					data.itemFileList = [...itemFileList, ...originalImgDel];
					data.itemSkuList = [...itemSkuList, ...originalGpecsDel];
					data.itemProductList = [...itemProductList, ...originalProductDel];
					this.saveButtonLoading = true;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/acc/item/update',
						data,
						callback: () => {
							this.saveButtonLoading = false;
						},
					});
					if (res && res.code == 200) {
						this.$message.success('操作成功');
						this.$dispatch('UPDATE_SERVICE_PROJECT_DETAIL');
						this.$closeSelf();
					} else {
						this.$message.error((res && res.data.message) || '操作失败');
					}
				}
			});
		},
		//获取产品数据
		async loadProducts(val) {
			const res = await this.$fetch(`/mgmt/product/item/getProductInfoList?likeSerialNo=${val}`);
			if (res && res.data) {
				this.products = res.data.map(({ title, serialNo }) => ({
					label: title,
					value: serialNo,
				}));
			} else {
				this.$message.error('搜索产品失败');
			}
		},
		// 获取数据
		async loadData() {
			const res = await this.$fetch(`/mgmt/acc/item/detail/${this.accItemId}`);
			if (res && res.code == 200 && res.data) {
				let { itemFileList, itemProductList } = res.data;
				this.form = res.data;
				itemFileList.forEach(item => {
					item.url = item.fileUrl;
				});
				itemProductList.forEach(item => {
					item.logicLabel = 1;
				});
			} else {
				this.$message.error('获取数据失败');
			}

			console.log(this.form);
		},
	},
	mounted() {
		const { id } = this.$route.query;
		if (id) {
			this.accItemId = id;
			this.form.id = id;
			this.loadData();
		}
	},
};
</script>

<style lang="scss" scoped>
.service-project-edit {
	.tips {
		font-size: 12px;
		color: #8c939b;
	}
	.ml-10 {
		margin-left: 10px;
	}
}
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
</style>