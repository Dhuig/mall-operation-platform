<template>
	<div ref="productDetail">
		<guideBar />
		<!-- <historyLog v-if="$route.query.history === true" /> -->
		<!-- 基本信息 -->
		<el-card class="row-gap" ref="productBasics" v-if="defer(1)">
			<h6>基本信息</h6>
			<el-form
				ref="baseInfo"
				:model="detail"
				:rules="PRODUCT_RULES"
				:disabled="type === 'preview'"
				inline
				label-position="right"
				label-width="140px"
				label-suffix=":"
			>
				<el-row>
					<el-col :span="8">
						<el-form-item label="产品编号" prop="serialNo">
							<el-input
								size="small"
								v-model="detail.serialNo"
								placeholder="请输入产品编号"
								class="discount-formitem"
								:disabled="type === 'edit'"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="产品类型" prop="catalogId">
							<el-select
								size="small"
								v-model="detail.catalogId"
								class="discount-formitem"
								placeholder="请选择产品类型"
								@change="handleSelectChange($event, config.catalog, 'catalogTitle')"
								clearable
							>
								<el-option v-for="item in config.catalog" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="前端分类" prop="showIds[0]">
							<el-select
								size="small"
								v-model="detail.showIds"
								class="discount-formitem"
								placeholder="请选择前端分类"
								multiple
							>
								<el-option v-for="item in config.show" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="产品名称" prop="title">
							<el-input
								size="small"
								v-model="detail.title"
								placeholder="请输入产品名称"
								class="discount-formitem"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="产品品牌" prop="brandId">
							<el-select
								size="small"
								v-model="detail.brandId"
								class="discount-formitem"
								placeholder="请选择产品品牌"
								@change="handleSelectChange($event, config.brand, 'brandTitle')"
								clearable
							>
								<el-option v-for="item in config.brand" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="计量单位">
							<el-input
								size="small"
								v-model="detail.meterUnit"
								placeholder="请输入计量单位"
								class="discount-formitem"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="包装规格">
							<el-input
								size="small"
								v-model="detail.packing"
								placeholder="请输入包装规格"
								class="discount-formitem"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="装箱数量" prop="boxNum">
							<el-input
								size="small"
								v-model="detail.boxNum"
								placeholder="请输入装箱数量"
								class="discount-formitem"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="销售主体" prop="saleCompanyId">
							<el-select
								size="small"
								v-model="detail.saleCompanyId"
								class="discount-formitem"
								placeholder="请选择销售主体"
								@change="handleSelectChange($event, config.company, 'saleCompanyTitle')"
								clearable
							>
								<el-option v-for="item in config.company" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="产权">
							<el-input
								size="small"
								v-model="detail.propertyRights"
								placeholder="请输入产权"
								class="discount-formitem"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="产品加工方式">
							<el-select
								size="small"
								v-model="detail.processMode"
								class="discount-formitem"
								placeholder="请选择产品加工方式"
								clearable
							>
								<el-option
									v-for="item in PROCESS_TYPE_OPTIONS"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="订货类型" prop="orderType">
							<!-- 普通/组合商品 订货类型下拉选项 -->
							<template v-if="/1|3/.test(productType) || /1|3/.test(detail.productType)">
								<el-select
									size="small"
									v-model="detail.orderType"
									class="discount-formitem"
									:disabled="type === 'edit'"
									placeholder="请选择订货类型"
									clearable
								>
									<el-option
										v-for="item in ORDER_TYPE_OPTIONS"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</template>
							<!-- 定制品 订货类型下拉选项 -->
							<template v-if="productType === 2 || detail.productType === 2">
								<el-select size="small" v-model="detail.orderType" class="discount-formitem" disabled>
									<el-option :label="CUSTOMIZE_PRODUCT_OPTIONS.label" :value="CUSTOMIZE_PRODUCT_OPTIONS.value" />
								</el-select>
							</template>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="公司统一运费模板" prop="shippingId">
							<el-select
								size="small"
								v-model="detail.shippingId"
								class="discount-formitem"
								placeholder="请选择运费模板"
								@change="handleUpdateshippingTpl(detail.shippingId)"
								clearable
							>
								<el-option
									v-for="item in transportTemplateOptions"
									:key="item.id"
									:label="item.carriageName"
									:value="item.id"
									:disabled="item.status === 0"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="是否直销产品" prop="directSale">
							<el-select
								size="small"
								v-model="detail.directSale"
								class="discount-formitem"
								placeholder="请选择直销产品属性"
								clearable
							>
								<el-option
									v-for="item in IS_DIRECT_SALE_OPTIONS"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="保质期" prop="guarantee">
							<el-input
								size="small"
								v-model="detail.guarantee"
								placeholder="请输入保质期"
								class="discount-formitem"
								clearable
							>
								<template slot="append">天</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="产品标签" prop="tags">
							<el-checkbox-group v-model="detail.tags">
								<el-checkbox v-for="{ label, value } in config.tag" :key="value" :label="value">
									{{ label }}
								</el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<!-- 组合产品 -->
			<addCompositionProduct
				v-if="detail.productType === 3 || productType === 3"
				:data="detail.bundleProducts"
				:disabled="type === 'preview'"
				@updateCompositionData="updateCompositionData"
			/>
			<!-- 定制产品 -->
			<addCustomizeProduct
				v-if="detail.productType === 2 || productType === 2"
				:data="detail.customProducts"
				:disabled="type === 'preview'"
				@updateCustomizeData="updateCustomizeData"
			/>
		</el-card>
		<!-- 产品价格及PV -->
		<el-card class="row-gap" ref="productPrice" v-if="defer(2)">
			<h6>产品价格及PV</h6>
			<el-form
				ref="priceInfo"
				:model="detail"
				:rules="PRODUCT_RULES"
				:disabled="type === 'preview'"
				inline
				label-position="right"
				label-width="130px"
				label-suffix=":"
			>
				<el-row>
					<el-col :span="8">
						<el-form-item label="零售价" prop="retailPrice">
							<el-input
								size="small"
								v-model="detail.retailPrice"
								class="discount-formitem"
								clearable
								@input="handleUpdatePrice"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="押货价" prop="securityPrice">
							<el-input
								size="small"
								v-model="detail.securityPrice"
								placeholder="根据零售价自动计算"
								class="discount-formitem"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="单位团购价" prop="groupPrice">
							<el-input
								size="small"
								v-model="detail.groupPrice"
								placeholder="根据零售价自动计算"
								class="discount-formitem"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="PV" prop="pv">
							<el-input
								size="small"
								v-model="detail.pv"
								placeholder="请输入产品的PV"
								class="discount-formitem"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="展业包订货价" prop="orderPrice">
							<el-input
								size="small"
								v-model="detail.orderPrice"
								placeholder="根据零售价自动计算"
								class="discount-formitem"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<!-- 产品属性 -->
		<el-card class="row-gap" v-if="defer(3)">
			<h6>产品属性</h6>
			<el-form
				:model="detail"
				:disabled="type === 'preview'"
				inline
				data-src="packing"
				label-position="right"
				label-width="130px"
				label-suffix=":"
			>
				<el-row>
					<el-col :span="/1|2/.test(item.attrType) ? 8 : 16" v-for="item in productParams" :key="item.id">
						<!-- 文本 -->
						<template v-if="item.attrType === 1">
							<el-form-item :label="item.attrKey">
								<el-input size="small" v-model="item.transValue" class="discount-formitem" clearable />
							</el-form-item>
						</template>
						<!-- 单选 -->
						<template v-if="item.attrType === 2">
							<el-form-item :label="item.attrKey">
								<el-checkbox v-model="item.transValue.checked" :label="item.transValue.label">
									{{ item.transValue.label }}
								</el-checkbox>
							</el-form-item>
						</template>
						<!-- 多选 -->
						<template v-if="item.attrType === 3">
							<el-form-item :label="item.attrKey">
								<el-checkbox
									v-for="(checkItem, $idx) in item.transValue"
									:key="$idx"
									:label="checkItem.label"
									v-model="checkItem.checked"
								>
									{{ checkItem.label }}
								</el-checkbox>
							</el-form-item>
						</template>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<!-- 产品描述 -->
		<el-card class="row-gap" v-if="defer(4)">
			<h6>产品描述</h6>
			<el-form :disabled="type === 'preview'" inline label-position="right" label-width="130px" label-suffix=":">
				<el-row>
					<el-col :span="24">
						<el-form-item label="产品图片">
							<el-upload
								multiple
								:disabled="type === 'preview'"
								:action="$store.getters['system/getOssUploadUrl']"
								:headers="$store.getters['system/getSignatureVerification']"
								:limit="10"
								:data="uploadParams"
								:show-file-list="true"
								:on-preview="previewCover"
								:file-list="extra.covers"
								:on-success="handleUploadSuccess"
								:on-remove="handleRemove"
								:on-exceed="picUploadExceed"
								:before-upload="beforeUpload"
								list-type="picture-card"
							>
								<i class="el-icon-plus" />
							</el-upload>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="产品视频">
							<el-upload
								:action="$store.getters['system/getOssUploadUrl']"
								:headers="$store.getters['system/getSignatureVerification']"
								:limit="1"
								:data="uploadParams"
								:on-success="handleVideoUploadSuccess"
								:on-remove="handleVideoUploadRemove"
								:file-list="extra.video"
								:on-progress="onProgressVideoUpload"
								:before-upload="beforeVideoUpload"
								list-type="text"
							>
								<el-button size="small" type="primary">点击上传</el-button>
								<div slot="tip" class="el-upload__tip">只能上传 mp4 文件，且不超过 20M</div>
							</el-upload>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if="isVideo">
						<el-form-item label="视频展示">
							<video :src="VideoUrl" controls height="500" width="691"></video>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="服务说明">
							<tinyEditor v-model="detail.serveContent" :id="explain" key="serveContent" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="产品介绍">
							<el-tabs v-model="activeContentTab">
								<el-tab-pane label="PC端" name="pc">
									<tinyEditor v-model="detail.webContent" :id="pcId" key="webContent" />
								</el-tab-pane>
								<el-tab-pane label="移动端" name="mobile">
									<tinyEditor v-model="detail.appContent" :id="mobileId" key="appContent" />
								</el-tab-pane>
							</el-tabs>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<!-- 销售规则 -->
		<el-card v-if="defer(5)">
			<h6>销售规则</h6>
			<el-form
				:disabled="type === 'preview'"
				inline
				class="profile-step"
				label-position="right"
				label-width="170px"
				label-suffix=":"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="停止网点押货">
							<el-checkbox v-model="detail['isStopBat']">
								{{ '勾选时，产品不显示在服务中心前端，因此服务中心无法押货' }}
							</el-checkbox>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="detail['isStopBat']">
						<el-form-item>
							<el-radio-group v-model="detail.stopBatType" @change="changePledgeTime">
								<el-radio class="RL10" :label="1">选择定时停止网点押货时间</el-radio>
								<el-date-picker
									v-if="detail.stopBatType == 1"
									class="RL10"
									v-model="detail.stopBatTime"
									value-format="timestamp"
									:picker-options="pickerOptions"
									type="datetime"
									placeholder="选择停止网点押货时间"
								></el-date-picker>
								<el-radio :label="2">不定时</el-radio>
							</el-radio-group>
						</el-form-item>

						<el-form-item></el-form-item>
					</el-col>
					<el-col :span="24" v-for="({ label, key, tips }, idx) in SALE_RULES" :key="idx">
						<el-form-item :label="label">
							<el-checkbox v-model="detail[key]">{{ tips }}</el-checkbox>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<!-- 上下架配置 -->
		<el-card v-if="defer(6)">
			<h6>上下架配置</h6>
			<el-row class="row-gap">
				<el-radio-group v-model="detail.saleTimeType" @change="cangeSaleTimeType" :disabled="type === 'preview'">
					<el-radio :label="1">立即上架</el-radio>
					<el-radio :label="2">立即下架</el-radio>
					<el-radio :label="3">定时上架</el-radio>
					<el-radio :label="4">定时下架</el-radio>
					<el-radio :label="5">定时上下架</el-radio>
				</el-radio-group>
			</el-row>
			<el-row>
				<el-form>
					<template v-if="detail.saleTimeType === 3">
						<el-form-item label="上架时间">
							<el-date-picker
								v-model="detail.upSaleTime"
								type="datetime"
								placeholder="选择定时上架时间"
								:picker-options="pickerOptions"
								value-format="timestamp"
								:disabled="type === 'preview'"
							/>
						</el-form-item>
						<span>指定时间上架产品，需要审核通过后才会在指定时间上架</span>
					</template>
					<template v-if="detail.saleTimeType === 4">
						<el-form-item label="下架时间">
							<el-date-picker
								v-model="detail.downSaleTime"
								type="datetime"
								placeholder="选择定时下架时间"
								:picker-options="pickerOptions"
								value-format="timestamp"
								:disabled="type === 'preview'"
							/>
						</el-form-item>
						<span>指定时间下架产品，需要审核通过后才会在指定时间下架</span>
					</template>
					<template v-if="detail.saleTimeType === 5">
						<el-form-item label="上架时间">
							<el-date-picker
								v-model="detail.upSaleTime"
								type="datetime"
								placeholder="选择定时上架日期"
								:picker-options="pickerOptions"
								value-format="timestamp"
								:disabled="type === 'preview'"
							/>
						</el-form-item>
						<el-form-item label="下架时间">
							<el-date-picker
								v-model="detail.downSaleTime"
								type="datetime"
								placeholder="选择定时下架日期"
								:picker-options="pickerOptions"
								value-format="timestamp"
								:disabled="type === 'preview'"
							/>
						</el-form-item>
					</template>
				</el-form>
			</el-row>
		</el-card>
		<!-- 产品信息 保存/更新 按钮区域 -->
		<actionBar v-if="/add|edit/.test(type) && defer(7)">
			<el-row type="flex" justify="end">
				<el-button type="primary" @click="submitToValidate">提交审核</el-button>
				<template v-if="type === 'add'">
					<el-button @click="saveDraft">保存草稿</el-button>
					<el-button @click="closePage">关闭</el-button>
				</template>
				<template v-if="type === 'edit'">
					<el-button type="warning" @click="save('updata')" v-if="/7|8/.test(detail.versionStatus)">保存</el-button>
					<el-button type="success" @click="save('add')" v-else>保存</el-button>
					<el-button @click="cancelEdit">取消</el-button>
				</template>
			</el-row>
		</actionBar>
		<!-- 产品日志 -->
		<productLog v-if="type === 'preview' && productLogShow" :params="params" />
		<productAuditLog v-if="type === 'preview' && productLogAuditShow" :params="params" />
		<!-- 查看大图 -->
		<el-dialog v-if="defer(8)" :visible.sync="previewCoverDialog.show" v-drag>
			<img width="100%" :src="previewCoverDialog.url" />
		</el-dialog>
	</div>
</template>

<script>
import { optionGenerator } from 'util';
import addCompositionProduct from './addCompositionProduct';
import addCustomizeProduct from './addCustomizeProduct';
import productLog from './productLog';
import productAuditLog from './productAuditLog';
import { generateRandomCode, deferData } from '@/util';
import { loadProductsConfig } from '@/service';
// import defer from '@/util/defer';

import {
	PRODUCT_RULES,
	ORDER_TYPE,
	IS_DIRECT_SALE,
	SALE_RULES,
	PROCESS_TYPE,
	PRODUCT_TYPE,
	PRODUCT_DETAIL,
	CUSTOMIZE_PRODUCT_OPTIONS,
} from './config';

// 启用配置检测
// const configValidateCheck = ({ cfgStatus }) => cfgStatus === 1;
// // 配置格式转换
// const optionGenerator2 = ({ title: label, id: value }) => ({ label, value });
// 转换产品属性格式
const transformAttrs = property => {
	const ret = Object.create(null);
	property.forEach(item => {
		if (item.attrType === 1) {
			ret[item.attrKey] = item.transValue;
		} else if (item.attrType === 2) {
			ret[item.attrKey] = item.transValue.checked ? item.transValue.label : [];
		} else if (item.attrType === 3) {
			ret[item.attrKey] = item.transValue.filter(({ checked }) => checked).map(({ label }) => label);
		}
	});
	return JSON.stringify(ret);
};
// 从JSON中解析产品属性
const parseProperty = (propertyJSON, productParams) => {
	try {
		if (!propertyJSON || !propertyJSON.length || propertyJSON == '{}') return productParams;
		const propertyObj = JSON.parse(propertyJSON);
		const ret = [];
		productParams.forEach(item => {
			if (item.attrType === 1) {
				const propItem = { ...item, transValue: propertyObj[item.attrKey] };
				ret.push(propItem);
			} else if (item.attrType === 2) {
				const propItem = {
					...item,
					transValue: {
						label: item.transValue.label,
						checked: propertyObj[item.attrKey] === item.transValue.label,
					},
				};
				ret.push(propItem);
			} else if (item.attrType === 3) {
				const propItem = {
					...item,
					transValue: item.transValue.map(checkItem => {
						if (propertyObj[item.attrKey]) {
							for (let label of propertyObj[item.attrKey]) {
								if (label === checkItem.label) {
									checkItem.checked = item.attrValArray.includes(label);
								}
							}
						}
						return checkItem;
					}),
				};
				ret.push(propItem);
			}
		});
		return ret;
	} catch (error) {
		console.warn('解析产品属性失败:', error);
	}
};
import { loadPriceParams } from '@/service';
import { uploadFileType } from 'util/formValidation';
export default {
	name: 'productDetail',
	mixins: [deferData()],
	data() {
		return {
			explain: generateRandomCode(),
			pcId: generateRandomCode(),
			mobileId: generateRandomCode(),
			PRODUCT_RULES,
			CUSTOMIZE_PRODUCT_OPTIONS,
			PROCESS_TYPE_OPTIONS: optionGenerator(PROCESS_TYPE),
			ORDER_TYPE_OPTIONS: optionGenerator(ORDER_TYPE),
			IS_DIRECT_SALE_OPTIONS: optionGenerator(IS_DIRECT_SALE),
			transportTemplateOptions: [],
			SALE_RULES,
			PRODUCT_DETAIL,
			hrefLink: '',
			uploadData: {
				storageType: '',
				clientKey: '',
				sign: '',
				timeStamp: '',
			},
			previewCoverDialog: {
				show: false,
				url: '',
			},
			activeContentTab: 'pc',
			// 产品参数
			productParams: this.$store.getters['system/getProductAttrList'],
			attrs: null,
			id: '',
			detail: {
				// 基础信息
				productId: '', // 商品id，新建版本时为空
				versionStatus: 1,
				// 主要字段
				serialNo: '',
				catalogTitle: '', // 类型名
				catalogId: '', // 类型id
				showIds: [], // 前端分类
				title: '',
				brandTitle: '', // 品牌名
				brandId: '', // 品牌id
				meterUnit: '',
				packing: '',
				boxNum: '',
				saleCompanyTitle: '完美中国', // 销售主体公司名
				saleCompanyId: '2', // 销售主体 id 2是完美公司
				propertyRights: '',
				processMode: '',
				orderType: '',
				shippingTpl: '', // 运费模板名
				shippingId: '', // 运费模板id
				directSale: 0, // 默认非直销
				guarantee: '',
				tags: [],
				bundleProducts: [],
				customProducts: [],
				// 价格
				retailPrice: '',
				securityPrice: '',
				groupPrice: '',
				pv: '',
				orderPrice: '',
				discountPrice: '',
				// 商品自定义属性
				attrs: '',
				// 描述
				verMedais: [],
				videoMedais: [],
				imgMedais: [],
				webContent: '', // web富文本内容
				appContent: '', // app富文本内容
				serveContent: '',
				// 销售规则
				stopBatType: null, // 停止押货类型 1-定时，2-立即
				stopBatTime: null, //待停止押货时间 时间戳
				isStopBat: false,
				isStopSale: false,
				isExchangeProduct: false,
				isInstall: false,
				isRepair: false,
				isReturnRepair: false,
				isConsumeStock: false,
				isInvoice: true,
				isOneOrder: false,
				isProductReturn: true,
				// 上下架
				saleTimeType: 1,
				upSaleTime: null,
				downSaleTime: null,
			},
			extra: {
				covers: [],
				video: [],
			},
			price: {
				price: 0,
				unfoldPrice: 0,
				batchPrice: 0,
				pv: 0,
			},
			property: [
				{ label: '规格', value: '12支/盒' },
				{ label: '产地', value: '浙江 温州' },
			],
			onlineConfig: {
				type: 'onlineTime',
				onlineTime: '',
				offlineTime: '',
				duration: '',
			},
			productLogShow: false,
			productLogAuditShow: false,
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7;
				},
			},
			uploadFlag: false,
		};
	},
	computed: {
		totalHeight: vm => -vm.$refs.productDetail?.offsetHeight + 1000,
		isVideo: vm => vm.detail.videoMedais.length,
		VideoUrl: vm => {
			const [{ url }] = vm.detail.videoMedais;
			return url;
		},
		config: vm => vm.$store.getters['system/getOptions'],
		// 产品价格系数配置
		priceParams: vm => vm.$store.getters['system/getPriceParams'],
		uploadParams() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.goods,
			};
			return params;
		},
		type() {
			return this.$route.query.type || 'preview';
		},
		// 商品类型
		productType() {
			return PRODUCT_TYPE[this.$route.query.category || ''];
		},
		params() {
			const {
				id: versionId,
				detail: { productId },
			} = this;
			return { versionId, productId };
		},
	},
	methods: {
		changePledgeTime(type) {
			if (this.type == 'add') {
				this.detail.stopBatTime = type == 1 ? new Date().getTime() : null;
			}
		},
		// 上下架时间判断
		verifyTimeFlag(str, type) {
			const { upSaleTime, downSaleTime, saleTimeType, isStopBat, stopBatType } = this.detail;
			let data = Date.now();
			if (saleTimeType === 3) {
				if (!upSaleTime) {
					return this.$message.warning('请选择上架时间');
				}
				if (data >= upSaleTime) {
					return this.$message.warning('上架时间必须超过当前时间');
				}
			}
			if (saleTimeType === 4) {
				if (!downSaleTime) {
					return this.$message.warning('请选择下架时间');
				}
				if (data >= downSaleTime) {
					return this.$message.warning('下架时间必须超过当前时间');
				}
			}
			if (saleTimeType === 5) {
				if (upSaleTime && downSaleTime) {
					if (upSaleTime >= downSaleTime) {
						return this.$message.warning('下架时间必须超过上架时间');
					}
				} else {
					return this.$message.warning('请选择上下架时间');
				}
			}
			console.log(this.uploadFlag);
			// 拦截上传
			if (this.uploadFlag) {
				console.log(this.uploadFlag);
				return this.$message.warning('视频上传中，请上传完成后提交');
			}

			// 销售规则 处理 detail['isStopBat']
			if (!isStopBat) {
				this.detail.stopBatType = null;
				this.detail.stopBatTime = null;
			}
			if (isStopBat) {
				if (!this.detail.stopBatTime && stopBatType == 1) {
					return this.$message.warning('选择定时停止网点押货时间');
				}
				if (stopBatType == 2) {
					this.detail.stopBatTime = null;
				}
			}
			let obj = {
				audit: this.addGoods,
				add: type == 'add' ? this.addGoods : this.updateGoods,
			};
			console.log(saleTimeType, obj);

			obj[str]();
		},
		// 每次切换按钮清空上下架的时间
		cangeSaleTimeType() {
			this.detail.upSaleTime = null;
			this.detail.downSaleTime = null;
		},
		save(type) {
			this.detail.versionStatus = 1;
			this.$refs.baseInfo.validate(valid => {
				if (valid) {
					this.$refs.priceInfo.validate(priceValid => {
						if (priceValid) {
							// 保存前先验证下上下架的时间戳
							this.verifyTimeFlag('add', type);
							// this.addGoods();
						} else {
							this.jumpWarningCard('productPrice');
							return false;
						}
						return false;
					});
				} else {
					this.jumpWarningCard('productBasics');
					return false;
				}
			});
		},
		// 添加组合产品
		updateCompositionData(data) {
			const appendGoods = data.map(item => {
				const { subId, subVerId, productId, versionId } = item;
				return {
					...item,
					subId: subId ? subId : productId,
					subVerId: subVerId ? subVerId : versionId,
				};
			});
			console.log(appendGoods);
			this.detail.bundleProducts = appendGoods;
		},
		// 添加定制产品
		updateCustomizeData(data) {
			this.detail.customProducts = this.detail.customProducts.concat(data);
		},
		// 下拉选择回调
		handleSelectChange(value, config, title) {
			const matchItem = config.find(item => item.value === value);
			if (matchItem) {
				const field = matchItem.label;
				this.detail[title] = field;
			}
		},
		// 更新运费模板名字
		handleUpdateshippingTpl(shippingId) {
			// 解决清空报错问题
			if (!shippingId) return;
			const [{ carriageName: shippingTpl }] = this.transportTemplateOptions.filter(({ id }) => id === shippingId);
			if (shippingTpl) this.detail.shippingTpl = shippingTpl;
		},
		// 键入零售价时自动根据系数计算 押货价/单位团购价/展业包订货价
		handleUpdatePrice() {
			const {
				detail: { retailPrice },
				priceParams: { groupParam, orderParam, productParam },
			} = this;
			const transRetailPrice = Number(retailPrice);
			// 不满足最多两位小数的正数时 不进行自动计算
			if (!PRODUCT_RULES.retailPrice[1].pattern.test(transRetailPrice)) return false;
			// 计算押货价
			const securityPrice = Math.round(retailPrice / productParam);
			// 计算单位团购价, 展业包订货价
			const [groupPrice, orderPrice] = [groupParam, orderParam].map(param => {
				const item = transRetailPrice * param;
				return Math.round(item);
			});
			this.detail = {
				...this.detail,
				groupPrice,
				orderPrice,
				securityPrice,
			};
		},
		// 预览图片
		previewCover({ url }) {
			this.previewCoverDialog = {
				show: true,
				url,
			};
		},
		// 提交审核
		submitToValidate() {
			this.detail.versionStatus = 2;
			this.$refs.baseInfo.validate(valid => {
				if (valid) {
					this.$refs.priceInfo.validate(priceValid => {
						if (priceValid) {
							this.verifyTimeFlag('audit');
							// this.addGoods();
						} else {
							this.jumpWarningCard('productPrice');
							return false;
						}
						return false;
					});
				} else {
					this.jumpWarningCard('productBasics');
					return false;
				}
			});
		},
		// 保存草稿
		saveDraft() {
			this.detail.versionStatus = 1;
			this.$refs.baseInfo.validate(valid => {
				if (valid) {
					this.$refs.priceInfo.validate(priceValid => {
						if (priceValid) {
							this.addGoods();
						} else {
							this.jumpWarningCard('productPrice');

							return false;
						}
						return false;
					});
				} else {
					this.jumpWarningCard('productBasics');

					return false;
				}
			});
		},
		// 关闭本页
		closePage() {
			this.$confirm('已经填写了部分信息, 是否要保存?', '提示', {
				confirmButtonText: '是的',
				cancelButtonText: '不保存',
				type: 'warning',
			})
				.then(() => {
					this.saveDraft();
				})
				.catch(() => {
					this.$closeSelf();
				});
		},
		// 取消编辑
		cancelEdit() {
			this.$closeSelf();
		},
		// 跳转提示
		jumpWarningCard(type) {
			this.$refs[type]?.$el.scrollIntoView();
		},
		// 获取菜单类型
		// 产品配置 -- 菜单类型名字
		// [show: 前端展示 catalog: 产品类型 company: 销售主体 brand: 产品品牌 tag: 产品标签]
		// async loadConfigMenu(type) {
		// 	if (!type) return;
		// 	this.property.loading = true;
		// 	const res = await this.$fetch(`/mgmt/product/cfg/menu/${type}`);
		// 	if (res && res.data) {
		// 		this[type].menu = [res.data];
		// 	} else {
		// 		this.$message.warning('获取菜单配置信息失败');
		// 	}
		// 	this.property.loading = false;
		// },
		// 获取配置 service
		// [show: 前端展示 catalog: 产品类型 company: 销售主体 brand: 产品品牌 tag: 产品标签]
		async loadConfig(type) {
			if (!type) return;
			const res = await this.$fetch(`/mgmt/product/cfg/list/${type}`);
			if (res && res.data) {
				return res.data;
			} else {
				this.$message.warning('获取配置信息失败');
			}
		},
		// 图片上传回调
		handleUploadSuccess(response) {
			if (response.success) {
				const imageItem = {
					mediaType: 1,
					sort: this.detail.imgMedais.length + this.detail.videoMedais.length + 1,
					storageType: 1,
					url: response.datas.fileUrlKey,
				};
				this.detail.imgMedais.push(imageItem);
			} else {
				this.$message({
					type: 'error',
					message: response.errorMessage || '上传失败请重试',
				});
			}
		},
		// 删除图片
		handleRemove(file, fileList) {
			this.detail.imgMedais = JSON.parse(JSON.stringify(fileList));
		},
		// 删除视频
		handleVideoUploadRemove() {
			this.uploadFlag = false;
			this.detail.videoMedais = [];
		},
		// 上传图片数据超过数量时触发回调
		picUploadExceed() {
			this.$message.warning('上传的图片数量请不要超过10张!');
		},
		// 视频上传时候的狗子
		onProgressVideoUpload() {
			this.uploadFlag = true;
		},
		// 视频上传回调
		handleVideoUploadSuccess(response) {
			// console.log('response: ', response); @todo 上传逻辑仍需要调整优化
			// console.log('file: ', file);
			if (response.success) {
				const videoItem = {
					mediaType: 2,
					sort: this.detail.imgMedais.length + this.detail.videoMedais.length + 1,
					storageType: 1,
					url: response.datas.fileUrlKey,
					name: '视频',
				};
				this.detail.videoMedais = [videoItem];
				console.log(this.detail.videoMedais);
			} else {
				this.$message({
					type: 'error',
					message: response.errorMessage || '上传失败请重试',
				});
			}
			this.uploadFlag = false;
		},
		// 图片上传前的钩子 [废弃]
		// async getUploadParams() {
		// 	const res = await this.$fetch(`/mgmt/cms/common/getUploadParams`);
		// 	if (res && res.data) {
		// 		// 获取签名、上传路径、附带参数
		// 		const { url, storageType, clientKey, sign, timeStamp } = res.data;
		// 		this.hrefLink = url;
		// 		this.uploadData = {
		// 			storageType,
		// 			clientKey,
		// 			sign,
		// 			timeStamp,
		// 		};
		// 	}
		// },
		// 图片上传前的钩子(不给传视频)
		beforeUpload(file) {
			if (!file) this.$message.warning('读取文件失败, 请更换文件重试');
			const whiteList = ['jpg', 'png', 'img', 'webp', 'bmp'];
			return uploadFileType.call(this, file, whiteList, 20);
		},
		// 视频上传前的钩子
		beforeVideoUpload(file) {
			if (!file) this.$message.warning('读取文件失败, 请更换文件重试');
			const whiteList = ['mp4'];
			return uploadFileType.call(this, file, whiteList, 20);
			// const { size, type } = file;
			// const isVideoExtend = ['video/mp4', 'video/flv', 'video/avi', 'video/asf', 'video/wmv'].indexOf(type) !== -1;
			// const exceedLimitSize = size / 1024 / 1024 < 20;
			// // console.log('isVideoExtend: ', isVideoExtend);
			// // console.log('exceedLimitSize: ', exceedLimitSize);
			// if (!isVideoExtend) {
			// 	this.$message.error('请上传正确的视频格式');
			// }
			// if (!exceedLimitSize) {
			// 	this.$message.error('上传视频大小不能超过20MB!');
			// }
			// const canUpload = isVideoExtend && exceedLimitSize;
			// // canUpload && this.getUploadParams();
			// return canUpload;
		},
		// 集中获取配置
		// loadALlConfig() {
		// 	const CONFIG_LIST = ['show', 'catalog', 'brand', 'company', 'tag'];
		// 	Promise.all(CONFIG_LIST.map(this.loadConfig))
		// 		.then((configs) => {
		// 			if (configs && configs && configs.length === CONFIG_LIST.length) {
		// 				const CONFIG_OPTIONS = configs.map((config) => config.filter(configValidateCheck).map(optionGenerator2));
		// 				CONFIG_LIST.forEach((type, idx) => {
		// 					this.config[type] = CONFIG_OPTIONS[idx];
		// 				});
		// 			} else {
		// 				throw new Error('获取配置信息失败');
		// 			}
		// 		})
		// 		.catch((error) => {
		// 			this.$message('获取配置信息失败' + JSON.stringify(error));
		// 		});
		// },
		// 添加商品
		addGoods() {
			const { detail, productType, productParams } = this;
			const info = JSON.parse(JSON.stringify(detail));
			console.log(info);
			const {
				directSale,
				orderType,
				isStopBat,
				isStopSale,
				isExchangeProduct,
				isInstall,
				isRepair,
				isReturnRepair,
				isConsumeStock,
				isInvoice,
				isOneOrder,
				isProductReturn,
				videoMedais,
				imgMedais,
			} = info;

			const goodsInfo = {
				id: '',
				productType,
				...info,
				attrs: transformAttrs(productParams),
				directSale: Number(directSale),
				orderType: Number(orderType),
				isStopBat: Number(isStopBat),
				isStopSale: Number(isStopSale),
				isExchangeProduct: Number(isExchangeProduct),
				isInstall: Number(isInstall),
				isRepair: Number(isRepair),
				isReturnRepair: Number(isReturnRepair),
				isConsumeStock: Number(isConsumeStock),
				isInvoice: Number(isInvoice),
				isOneOrder: Number(isOneOrder),
				isProductReturn: Number(isProductReturn),
				verMedais: [...imgMedais, ...videoMedais],
			};
			this.createProduct(goodsInfo);
		},
		// 上下架商品 编辑更新
		updateGoods() {
			const { detail, productType, productParams } = this;
			const info = JSON.parse(JSON.stringify(detail));
			const {
				directSale,
				orderType,
				isStopBat,
				isStopSale,
				isExchangeProduct,
				isInstall,
				isRepair,
				isReturnRepair,
				isConsumeStock,
				isInvoice,
				isOneOrder,
				isProductReturn,
				imgMedais,
				videoMedais,
			} = info;
			const goodsInfo = {
				productType,
				...info,
				attrs: transformAttrs(productParams),
				directSale: Number(directSale),
				orderType: Number(orderType),
				isStopBat: Number(isStopBat),
				isStopSale: Number(isStopSale),
				isExchangeProduct: Number(isExchangeProduct),
				isInstall: Number(isInstall),
				isRepair: Number(isRepair),
				isReturnRepair: Number(isReturnRepair),
				isConsumeStock: Number(isConsumeStock),
				isInvoice: Number(isInvoice),
				isOneOrder: Number(isOneOrder),
				isProductReturn: Number(isProductReturn),
				verMedais: [...imgMedais, ...videoMedais],
			};
			goodsInfo.versionStatus = 1;
			delete goodsInfo.id;
			this.createProduct(goodsInfo);
		},
		// 商品详情
		async loadData(verId) {
			if (!verId) return this.$message('商品Id 不存在或无效, 无法获取商品详细信息');

			const res = await this.$fetch(`/mgmt/product/item/getVersion?verId=${verId}`);
			if (res && res.data) {
				const {
					isStopBat,
					isStopSale,
					isExchangeProduct,
					isInstall,
					isRepair,
					isReturnRepair,
					isConsumeStock,
					isInvoice,
					isOneOrder,
					isProductReturn,
					verMedais,
					orderPrice,
					attrs,
				} = res.data;
				this.detail = {
					...res.data,
					isStopBat: Boolean(isStopBat),
					isStopSale: Boolean(isStopSale),
					isExchangeProduct: Boolean(isExchangeProduct),
					isInstall: Boolean(isInstall),
					isRepair: Boolean(isRepair),
					isReturnRepair: Boolean(isReturnRepair),
					isConsumeStock: Boolean(isConsumeStock),
					isInvoice: Boolean(isInvoice),
					isOneOrder: Boolean(isOneOrder),
					isProductReturn: Boolean(isProductReturn),
					videoMedais: verMedais.filter(x => x.mediaType == 2),
					imgMedais: verMedais.filter(x => x.mediaType == 1),
					orderPrice: orderPrice ? orderPrice : 0,
				};
				this.productParams = parseProperty(attrs, this.$store.getters['system/getProductAttrList']);
				if (this.detail.videoMedais.length) {
					verMedais.find(x => x.mediaType == 2).name = '视频';
				}
				// 上传图片
				this.extra.covers = this.detail.imgMedais;
				this.extra.video = this.detail.videoMedais;
				// 组合商品 通过数据的 bundleProductInfos 取值
				if (res.data.productType === 3) {
					this.detail.bundleProducts = this.detail.bundleProductInfos;
				}
			} else {
				this.$message.warning('查询商品详情失败');
			}
			// console.log('res: ', res);
		},
		// 添加商品
		async createProduct(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/product/item/saveVersion',
				data,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
					duration: 800,
					onClose: () => {
						this.$dispatch('UPDATE_GOODS_LIST');
						this.$closeSelf();
					},
				});
			} else {
				if (this.$store.getters['system/getError']) {
					// * 错误提示
					this.$message.error('新增商品失败, 请确保填写参数正确');
				}
			}
		},
		// 查询产品属性
		// async loadGoodsProperties() {
		// 	const res = await this.$fetch(`/mgmt/product/cfg/listAttr?pageNum=0&pageSize=0`);
		// 	console.log('产品属性: ', res.data.list);
		// 	if (res && res.data) {
		// 		const { list } = res.data;
		// 		this.productParams = list.map((item) => {
		// 			if (item.attrType === 1) return { ...item, transValue: '' };
		// 			if (item.attrType === 2) return { ...item, transValue: { label: item.attrValArray[0], checked: false } };
		// 			if (item.attrType === 3)
		// 				return { ...item, transValue: item.attrValArray.map((label) => ({ label, checked: false })) };
		// 		});
		// 		console.info('this.productParams: ', this.productParams);
		// 	} else {
		// 		this.productParams = [];
		// 		this.$message.error('获取产品属性信息失败');
		// 	}
		// },
		// 查询运费模板
		async loadTransportFeeTemplate() {
			const res = await this.$fetch('/mgmt/sys/getCarriList');
			if (res && res.data) {
				this.transportTemplateOptions = res.data;
				// 公司统一费用 默认值
				if (this.type === 'add') {
					// '1217978678543324234' == 按订单金额收取费用
					let id = this.transportTemplateOptions.find(({ id }) => id == '1217978678543324234')?.id;
					if (id) {
						this.detail.shippingId = id;
						this.handleUpdateshippingTpl(id);
					}
				}
			} else {
				this.transportTemplateOptions = [];
				this.$message.error('获取运费模板失败');
			}
		},
		isShowProductLog() {
			if (this.productLogAuditShow && this.productLogShow) {
				// 触发显示之后 移除滚动监听
				window.removeEventListener('scroll', this.isShowProductLog, true);
				return;
			}
			let top = this.$refs.productDetail?.getBoundingClientRect().top;
			this.productLogShow = top < this.totalHeight;
			let height = this.totalHeight - 650;
			this.productLogAuditShow = top < height;
			// console.log('未移除');
		},
	},
	async created() {
		await loadProductsConfig();
		if (this.type == 'preview') {
			window.addEventListener('scroll', this.isShowProductLog, true);
		}
	},
	async mounted() {
		// this.$listen('LOAD_GOODS_CONFIGS', this.loadALlConfig);
		// this.$listen('LOAD_PRICE_CONFIGS', this.loadPriceParams);
		const { id } = this.$route.query;
		// this.loadALlConfig(); // 请求五种配置
		loadPriceParams(); // 请求价格参数
		// this.loadGoodsProperties(); // 请求产品参数
		this.loadTransportFeeTemplate(); // 请求运费模板

		//  新建时
		if (this.type === 'add') {
			// 定制商品 设置定货类型为 "定制品订货"
			// 其他 设置定货类型为 "产品订货"
			this.detail.orderType = this.productType === 2 ? 3 : 1;
		}
		if (id) {
			this.id = id;
			this.loadData(id); // 获取商品详情
		}
	},
	components: {
		addCompositionProduct,
		addCustomizeProduct,
		productLog,
		productAuditLog,
	},
};
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
	overflow: auto;
}
.RL10 {
	margin-right: 10px;
}
h6 {
	margin-bottom: 16px;
}
.row-gap {
	margin-bottom: 24px;
}
.product-cover {
	width: 100px;
	height: 100px;
	outline: 1px dashed #ccc;
	margin-right: 16px;
}
.discount-formitem {
	max-width: 192px;
}
.service-des {
	width: 800px;
}
.add-tips {
	width: 200px;
	margin-left: 24px;
}
</style>
