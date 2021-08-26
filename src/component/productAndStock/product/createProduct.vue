<template>
	<div>
		<guideBar />
		<el-card>
			<el-steps :active="activeStep" simple finish-status="success" style="margin-bottom: 24px;">
				<el-step title="基本信息" icon="el-icon-edit"></el-step>
				<el-step title="产品价格及PV" icon="el-icon-money"></el-step>
				<el-step title="产品属性" icon="el-icon-setting"></el-step>
				<el-step title="产品描述" icon="el-icon-tickets"></el-step>
				<el-step title="销售规则" icon="el-icon-shopping-cart-2"></el-step>
				<el-step title="上下架配置" icon="el-icon-turn-off"></el-step>
			</el-steps>
			<el-row>
				<template v-if="activeStep === 0">
					<el-form
						:model="detail"
						inline
						class="profile-step"
						label-position="right"
						label-width="130px"
						label-suffix=":"
					>
						<el-row>
							<el-col :span="8">
								<el-form-item label="产品编号">
									<el-input size="small" v-model="detail.no" class="discount-formitem" clearable />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="产品类型">
									<el-select
										size="small"
										v-model="detail.type"
										class="discount-formitem"
										placeholder="请选择产品类型"
										clearable
									>
										<el-option
											v-for="item in PRODUCT_DETAIL.PRODUCT_TYPE"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="前端分类">
									<el-select
										size="small"
										v-model="detail.category"
										class="discount-formitem"
										placeholder="请选择前端分类"
										clearable
									>
										<el-option
											v-for="item in PRODUCT_DETAIL.PRODUCT_CATEGORY"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="产品名称">
									<el-input size="small" v-model="detail.name" class="discount-formitem" clearable />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="产品品牌">
									<el-select
										size="small"
										v-model="detail.brand"
										class="discount-formitem"
										placeholder="请选择产品品牌"
										clearable
									>
										<el-option
											v-for="item in PRODUCT_DETAIL.PRODUCT_BRAND"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="计量单位">
									<el-input size="small" v-model="detail.unit" class="discount-formitem" clearable />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="包装规格">
									<el-input size="small" v-model="detail.spec" class="discount-formitem" clearable />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="装箱数量">
									<el-input size="small" v-model="detail.packageNum" class="discount-formitem" clearable />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="销售主体">
									<el-select
										size="small"
										v-model="detail.salor"
										class="discount-formitem"
										placeholder="请选择销售主体"
										clearable
									>
										<el-option
											v-for="item in PRODUCT_DETAIL.PRODUCT_SALOR"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="产权">
									<el-input size="small" v-model="detail.owner" class="discount-formitem" clearable />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="产品加工方式">
									<el-select
										size="small"
										v-model="detail.makeWay"
										class="discount-formitem"
										placeholder="请选择产品加工方式"
										clearable
									>
										<el-option
											v-for="item in PRODUCT_DETAIL.PRODUCT_MAKEWAY"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="订货类型">
									<el-select
										size="small"
										v-model="detail.orderType"
										class="discount-formitem"
										placeholder="请选择订货类型"
										clearable
									>
										<el-option
											v-for="item in PRODUCT_DETAIL.PRODUCT_ORDERTYPE"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="公司统一运费模板">
									<el-select
										size="small"
										v-model="detail.shipmentTemplate"
										class="discount-formitem"
										placeholder="请选择公司统一运费模板"
										clearable
									>
										<el-option
											v-for="item in PRODUCT_DETAIL.PRODUCT_SHIPPING_FEE_TEMPLATE"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="是否直销产品">
									<el-select
										size="small"
										v-model="detail.isDirectly"
										class="discount-formitem"
										placeholder="请选择直销产品属性"
										clearable
									>
										<el-option
											v-for="item in PRODUCT_DETAIL.PRODUCT_IS_DIRECTLY"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="24">
								<el-form-item label="产品标签">
									<el-checkbox-group v-model="detail.label">
										<el-checkbox :label="1">新品</el-checkbox>
										<el-checkbox :label="2">热销</el-checkbox>
										<el-checkbox :label="3">专卖</el-checkbox>
										<el-checkbox :label="4">推荐</el-checkbox>
									</el-checkbox-group>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</template>
				<template v-else-if="activeStep === 1">
					<el-form
						:model="price"
						inline
						class="profile-step"
						label-position="right"
						label-width="130px"
						label-suffix=":"
					>
						<el-row>
							<el-col :span="8">
								<el-form-item label="零售价">
									<el-input size="small" v-model="price.price" class="discount-formitem" clearable />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="押货价">
									<el-input size="small" v-model="price.unfoldPrice" class="discount-formitem" clearable />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="单位团购价">
									<el-input size="small" v-model="price.batchPrice" class="discount-formitem" clearable />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="PV">
									<el-input size="small" v-model="price.pv" class="discount-formitem" clearable />
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</template>
				<template v-else-if="activeStep === 2">
					<el-form
						:model="property"
						inline
						class="profile-step"
						label-position="right"
						label-width="130px"
						label-suffix=":"
					>
						<el-row>
							<el-col :span="8">
								<el-form-item label="规格">
									<el-input size="small" v-model="price.spec" class="discount-formitem" clearable />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="产地">
									<el-input size="small" v-model="price.place" class="discount-formitem" clearable />
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</template>
				<template v-else-if="activeStep === 3">
					<el-form
						:model="description"
						inline
						class="profile-step"
						label-position="right"
						label-width="130px"
						label-suffix=":"
					>
						<el-row>
							<el-col :span="24">
								<el-form-item label="产品图片">
									<el-row type="flex">
										<template v-for="(cover, idx) in description.covers">
											<el-image class="product-cover" :src="cover" :key="idx" :preview-src-list="description.covers" />
										</template>
									</el-row>
								</el-form-item>
							</el-col>
							<el-col :span="24">
								<el-form-item label="产品视频"> </el-form-item>
							</el-col>
							<el-col :span="24">
								<el-form-item label="服务说明">
									<el-input
										class="service-des"
										type="textarea"
										:rows="8"
										placeholder="请输入服务说明"
										v-model="description.service"
									/>
								</el-form-item>
							</el-col>
							<el-col :span="24">
								<el-form-item label="产品介绍">
									<el-input
										class="service-des"
										type="textarea"
										:rows="8"
										placeholder="请输入产品介绍"
										v-model="description.inintroduction"
									/>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</template>
				<template v-else-if="activeStep === 4">
					销售规则
				</template>
				<template v-else-if="activeStep === 5">
					<el-form
						:model="onlineConfig"
						inline
						class="profile-step"
						label-position="right"
						label-width="130px"
						label-suffix=":"
					>
						<el-row>
							<el-form-item label="类型">
								<el-radio-group v-model="onlineConfig">
									<el-radio label="onlineNow">立即上架</el-radio>
									<el-radio label="offlineNow">立即下架</el-radio>
									<el-radio label="onlineTime">定时上架</el-radio>
									<el-radio label="offlineTime">定时下架</el-radio>
									<el-radio label="onOfflineTime">定时上下架</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-row>
					</el-form>
				</template>
			</el-row>
			<el-row type="flex" justify="end" align="middle">
				<el-button type="primary" icon="el-icon-arrow-left" @click="turnToPrevPart" v-show="activeStep !== 0">
					上一页
				</el-button>
				<el-button type="primary" icon="el-icon-arrow-right" @click="turnToNextPart" v-show="activeStep !== 6">
					下一页
				</el-button>
				<el-button type="success" icon="el-icon-check" @click="submit">提交审核</el-button>
				<el-button type="warning" icon="el-icon-document-copy" @click="saveDraft">保存草稿</el-button>
			</el-row>
		</el-card>
	</div>
</template>

<script>
import { PRODUCT_DETAIL } from './config';

export default {
	name: 'createProduct',
	data() {
		return {
			PRODUCT_DETAIL,
			activeStep: 0,
			detail: {
				no: '',
				type: '',
				category: '',
				name: '',
				brand: '',
				unit: '',
				spec: '',
				packageNum: '',
				salor: '',
				owner: '',
				makeWay: '',
				orderType: '',
				shipmentTemplate: '',
				isDirectly: '',
				label: [1],
			},
			price: {
				price: 0,
				unfoldPrice: 0,
				batchPrice: 0,
				pv: 0,
			},
			property: {
				spec: '',
				place: '',
			},
			description: {
				covers: [
					'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3519773921,265398917&fm=11&gp=0.jpg',
					'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592821768082&di=3c3de7afa49e78473dc1a8f0723e5f39&imgtype=0&src=http%3A%2F%2Fpic1.zhimg.com%2Fv2-cd76bd1b09712db86a5ecb1e53e17c97_im.jpg',
					'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592821855125&di=9586995da16d0b5f1b3b3fd4b03cc136&imgtype=0&src=http%3A%2F%2Ft9.baidu.com%2Fit%2Fu%3D1022200193%2C1603750046%26fm%3D193',
				],
				video: '',
				service: `1、收货时请当场验货，若商品有破损、渗漏、缺少、配送有误等问题，请立即与完美公司客服人员或分支机构联系。\n2、消费者在购买产品30天内，将完好无损、具有销售价值的产品连同购货凭证一同退回，可按购货凭证价格等值换货或退款。\n3、若商品使用过程中怀疑出现质量问题，请立即与完美公司客服人员或分支机构联系，同时提供购货凭证及清晰的产品问题图片。\n4、金伟连牌净水机、宜悦牌空气净化机/器、德列宝系列（锅具、厨具）产品若消费者在使用过程中发生故障情况，请及时与完美公司客服人员或分支机构联系，具体售后服务规定详见《使用说明书》、《用户手册》。`,
				inintroduction: '',
			},
			onlineConfig: 'offlineTime',
		};
	},
	methods: {
		// 上一页
		turnToPrevPart() {
			this.activeStep = this.activeStep-- <= 0 ? 0 : this.activeStep--;
		},
		// 下一页
		turnToNextPart() {
			this.activeStep = this.activeStep++ >= 6 ? 6 : this.activeStep++;
		},
		submit() {},
		saveDraft() {},
	},
};
</script>

<style lang="scss" scoped>
.product-cover {
	width: 100px;
	height: 100px;
	outline: 1px dashed #ccc;
	margin-right: 16px;
}
.profile-step {
	min-height: 400px;
	// border: 1px solid red;
}
.service-des {
	width: 800px;
}
</style>
