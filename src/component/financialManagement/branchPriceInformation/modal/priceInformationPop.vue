<template>
	<div class="price-information-pop">
		<el-dialog
			v-drag
			top="5vh"
			:title="popTitle"
			:visible.sync="popStatus.show"
			:width="isAudit ? 800 + 'px' : 500 + 'px'"
		>
			<el-form
				class="check-price"
				:model="ruleForm"
				ref="ruleForm"
				:rules="PRICE_INFO_POP_RULES"
				label-width="160px"
				label-position="right"
				label-suffix=":"
			>
				<el-row>
					<el-col :span="labelSpan">
						<el-form-item label="产品编号" prop="serialNo">
							<el-input size="medium" v-model="ruleForm.serialNo" :disabled="isNotAdd" />
						</el-form-item>
					</el-col>
					<el-col :span="labelSpan">
						<el-form-item label="产品名称" prop="title">
							<el-input size="medium" v-model="ruleForm.title" disabled />
						</el-form-item>
					</el-col>
					<el-col :span="labelSpan">
						<el-form-item label="所属类别" prop="priceCatalogId">
							<el-select
								size="medium"
								v-model="ruleForm.priceCatalogId"
								@change="initPrice"
								placeholder="请选择所属类别"
							>
								<el-option
									v-for="(item, index) in catalogOptions"
									:label="item.priceCatalogTitle"
									:value="item.id"
									:key="index"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="labelSpan">
						<el-form-item label="状态" prop="status" v-if="isAudit">
							<el-input size="medium" v-model="VERSION_STATUS_MAP_LABEL[ruleForm.status]" :disabled="true" />
						</el-form-item>
					</el-col>
					<el-col :span="labelSpan">
						<el-form-item label="产品零售价" prop="retailPrice">
							<el-input size="medium" v-model="ruleForm.retailPrice" disabled />
						</el-form-item>
					</el-col>
					<el-col :span="labelSpan">
						<el-form-item label="北京分公司价格" prop="beijingCompanyPrice">
							<el-input
								size="medium"
								v-model="ruleForm.beijingCompanyPrice"
								:disabled="isAudit"
								placeholder="请输入价格"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="labelSpan">
						<el-form-item label="除北京外分公司价格" prop="otherCompanyPrice">
							<el-input
								size="medium"
								v-model="ruleForm.otherCompanyPrice"
								:disabled="isAudit"
								placeholder="请输入价格"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="labelSpan">
						<el-form-item label="二级分公司" prop="secondCompanyPrice">
							<el-input
								size="medium"
								v-model="ruleForm.secondCompanyPrice"
								:disabled="isAudit"
								placeholder="请输入价格"
							/>
						</el-form-item>
					</el-col>

					<template v-if="isAudit">
						<el-col :span="12">
							<el-form-item label="审核操作" prop="auditResult" :required="true">
								<el-select size="medium" v-model="ruleForm.auditResult" placeholder="请选择审核操作">
									<el-option label="审核通过" value="1" />
									<el-option label="审核不通过" value="2" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="备注说明" prop="remarks">
								<el-input
									type="textarea"
									resize="none"
									v-model="ruleForm.remarks"
									maxlength="200"
									show-word-limit
								></el-input>
							</el-form-item>
						</el-col>
					</template>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cacel('ruleForm')" class="cacel">取 消</el-button>
				<el-button type="primary" @click="save('ruleForm')" class="save">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { PRICE_INFO_POP_RULES } from './config';
import { VERSION_STATUS_MAP_LABEL } from '../config';
import qs from 'querystring';
import { filters } from 'plugins/filters';
export default {
	name: 'priceInformationPop',
	props: {
		dataSource: {
			type: Object,
		},
		popStatus: {
			type: Object,
		},
	},
	data() {
		return {
			PRICE_INFO_POP_RULES,
			VERSION_STATUS_MAP_LABEL,
			ruleForm: {},
			catalogOptions: [],
		};
	},
	watch: {
		dataSource: {
			handler(data) {
				if (data.priceCatalogTitle) {
					const obj = this.catalogOptions.find(({ priceCatalogTitle }) => priceCatalogTitle == data.priceCatalogTitle);
					data.priceCatalogId = obj?.id ? obj?.id : '';
				}
				this.ruleForm = { ...data };
			},
			immediate: true,
			deep: true,
		},
		'ruleForm.auditResult': {
			handler(data) {
				this.PRICE_INFO_POP_RULES.remarks = [{ required: data == 2, message: '请输入备注说明', trigger: 'blur' }];
			},
		},
	},
	computed: {
		popTitle() {
			const { type } = this.popStatus;
			let title;
			switch (type) {
				case 'add':
					title = '新增分公司价格信息';
					break;
				case 'edit':
					title = '编辑分公司价格信息';
					break;
				case 'audit':
					title = '审核分公司价格信息';
					break;
				default:
					title = '新增分公司价格信息';
			}
			return title;
		},
		isAudit() {
			return this.popStatus.type == 'audit';
		},
		isNotAdd() {
			return this.popStatus.type != 'add';
		},
		labelSpan() {
			const { type } = this.popStatus;
			let span;
			switch (type) {
				case 'audit':
					span = 12;
					break;
				default:
					span = 24;
			}
			return span;
		},
	},
	methods: {
		// 默认自动计算价格
		initPrice() {
			const { priceCatalogId, retailPrice } = this.ruleForm;
			const selectData = this.catalogOptions.filter(({ id }) => id == priceCatalogId)[0] || {};
			const { beijingCompanyParam, otherCompanyParam, secondCompanyParam } = selectData;
			const beijingCompanyPrice = filters.rounding(retailPrice * beijingCompanyParam, 0);
			const otherCompanyPrice = filters.rounding(retailPrice * otherCompanyParam, 0);
			const secondCompanyPrice = filters.rounding(retailPrice * secondCompanyParam, 0);
			this.ruleForm = { ...this.ruleForm, beijingCompanyPrice, otherCompanyPrice, secondCompanyPrice };
		},
		// 取消
		cacel(formName) {
			this.$refs[formName].resetFields();
			this.$emit('close');
		},
		// 确定
		save(formName) {
			const { type } = this.popStatus;
			this.$refs[formName].validate(valid => {
				if (valid) {
					console.log(type);
					if (type == 'add' || type == 'edit') {
						this.addOrEditFn(formName);
					} else {
						this.auditFn(formName);
					}
				}
			});
		},
		// 添加修改方法
		async addOrEditFn(formName) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/product/filiale/saveFilialePrice',
				data: this.ruleForm,
			});
			if (res && res.code === 200) {
				this.$message.success('操作成功');
				this.$refs[formName].resetFields();
				this.$dispatch('UPDATE_COMPANY_PRICE_INFO_LIST');
				this.$emit('close');
			} else {
				this.$message.error((res && res.data.message) || '操作失败');
			}
		},
		// 审核方法
		async auditFn(formName) {
			const res = await this.$fetch(`/mgmt/product/filiale/audit?${qs.stringify(this.ruleForm)}`);
			if (res && res.code === 200) {
				this.$message.success('操作成功');
				this.$refs[formName].resetFields();
				this.$dispatch('UPDATE_COMPANY_PRICE_INFO_LIST');
				this.$emit('close');
			} else {
				this.$message.error((res && res.data.message) || '操作失败');
			}
		},
		// 获取价格参数列表数据
		async loadPriceList() {
			const res = await this.$fetch(`/mgmt/product/price/getFilialePriceList`);
			if (res && res.data) {
				this.catalogOptions = res.data;
			} else {
				this.$message.error('获取价格参数数据失败');
			}
		},
	},
	mounted() {
		this.loadPriceList();
	},
};
</script>

<style lang="scss" scoped>
.price-information-pop {
	.check-price {
		max-height: 65vh;
		overflow: auto;
	}
}
</style>