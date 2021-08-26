<template>
	<div class="productControlAddRule">
		<guideBar />
		<el-Card>
			<div slot="header" class="clearfix">
				<h3>设置产品管控预警规则</h3>
			</div>
			<el-form :model="warningForm" :rules="WARNING_FORM_RULE" ref="warningForm" class="form" label-width="140px">
				<el-form-item label="预警项目名称" prop="warningName">
					<el-input v-model="warningForm.warningName" maxlength="40" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="预警粒度" prop="warningGranularity">
					<el-radio-group v-model="warningForm.warningGranularity">
						<el-radio label="Month">每月</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="预警类型" prop="warningType">
					<el-radio-group v-model="warningForm.warningType">
						<el-radio label="0">销售数量</el-radio>
						<el-radio label="1">销售PV</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="预警维度" prop="dimension">
					<el-row type="flex" align="middle">
						<el-checkbox-group v-model="warningForm.dimension" size="small">
							<el-checkbox label="buy">购货预警</el-checkbox>
							<el-checkbox label="pay">交付预警</el-checkbox>
						</el-checkbox-group>
						<el-popover placement="top-start" width="200" trigger="hover">
							<div>
								<div>购货预警包括：</div>
								<div>顾客做为购货人的所有订单</div>
								<br />
								<div>门店交付预警包括：</div>
								<div>1. 云商/微店自购订单</div>
								<div>2. 云商/微店代购订单</div>
								<div>3. 门店自提订单</div>
							</div>
							<el-button class="popoverBtn" slot="reference" icon="el-icon-warning"></el-button>
						</el-popover>
					</el-row>
				</el-form-item>
				<el-form-item label="预警规则" prop="shopWarningNumber">
					<el-row type="flex" align="middle">
						<div class="left-title">购货预警 &nbsp;</div>
						<el-input-number
							:disabled="buyDisable"
							:step="1"
							step-strictly
							v-model.number="warningForm.shopWarningNumber"
							:min="0"
						></el-input-number>
						<div class="right-title">{{ CHANGERULESTATUS[warningForm.warningType] }} /月/购货人</div>
					</el-row>
				</el-form-item>
				<el-form-item prop="deliverWarningNumber">
					<el-row type="flex" align="middle">
						<div class="left-title">交付预警 &nbsp;</div>
						<el-input-number
							:disabled="payDisable"
							:step="1"
							step-strictly
							v-model.number="warningForm.deliverWarningNumber"
							:min="0"
						></el-input-number>
						<div class="right-title">{{ CHANGERULESTATUS[warningForm.warningType] }} /月/门店</div>
					</el-row>
				</el-form-item>
				<el-form-item label="交付方式" prop="deliverType">
					<el-radio-group v-model="warningForm.deliverType">
						<el-radio label="all">全部交付方式</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="预警产品" prop="warningProduct">
					<el-radio-group v-model="warningForm.warningProduct">
						<el-radio label="0">所有产品</el-radio>
						<el-radio label="1">单一产品</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="产品编号" prop="productCode" v-if="warningForm.warningProduct == '1'">
					<el-row type="flex" align="middle" class="productBox">
						<el-input v-model="warningForm.productCode" @blur="getProduct" maxlength="40" show-word-limit></el-input>
						<div v-if="productName" class="porductName">产品名称：{{ productName }}</div>
					</el-row>
				</el-form-item>
				<el-form-item label="活动形式" prop="remark">
					<el-input
						type="textarea"
						:autosize="{ minRows: 4 }"
						placeholder="描述预警说明，用于解决什么问题，出现问题后怎么处理等。"
						maxlength="255"
						show-word-limit
						v-model="warningForm.remark"
					></el-input>
				</el-form-item>
			</el-form>
		</el-Card>

		<actionBar>
			<el-row type="flex" justify="end">
				<el-button @click="$closeSelf()">返回</el-button>
				<el-button type="primary" @click="save">保存</el-button>
			</el-row>
		</actionBar>
	</div>
</template>

<script>
import { WARNING_FORM_RULE, CHANGERULESTATUS } from './config';
export default {
	name: 'productControlAddRule',
	data() {
		return {
			warningForm: {
				warningName: '', // 预警项目名称
				warningGranularity: 'Month', // 预警粒度
				warningType: '0', // 预警类型
				dimension: ['buy', 'pay'], // 预警维度
				shopWarningNumber: 0, // 预警规则 - 购货预警数量
				deliverWarningNumber: 0, // 预警规则 - 交付预警数量

				deliverType: 'all', // 交付方式
				warningProduct: '0', // 预警产品
				productCode: '', // 产品编码
				remark: '',
			},
			productName: '',
			CHANGERULESTATUS,
			WARNING_FORM_RULE,
		};
	},
	mounted() {},
	watch: {
		'warningForm.warningProduct': function (newValue) {
			if (!Number(newValue)) {
				this.warningForm.productCode = '';
				this.productName = '';
			}
		},
	},
	computed: {
		buyDisable: ({ warningForm }) => {
			const flag = warningForm.dimension.some(x => x == 'buy');
			if (!flag) {
				warningForm.shopWarningNumber = 0;
			}
			return !flag;
		},
		payDisable: ({ warningForm }) => {
			const flag = warningForm.dimension.some(x => x == 'pay');
			if (!flag) {
				warningForm.deliverWarningNumber = 0;
			}
			return !flag;
		},
	},
	methods: {
		save() {
			const { shopWarningNumber, deliverWarningNumber } = this.warningForm;
			const { buyDisable, payDisable } = this;
			console.log(payDisable, 'pay');
			this.$refs.warningForm.validate(async valid => {
				if (valid) {
					if (!buyDisable && !payDisable) {
						if (!shopWarningNumber || !deliverWarningNumber) {
							return this.$message.warning('购货预警和交付预警的数量或者PV不得为0');
						}
					} else {
						if (!buyDisable) {
							if (!shopWarningNumber) {
								return this.$message.warning('购货预警的数量或者PV不得为0');
							}
						}
						if (!payDisable) {
							if (!deliverWarningNumber) {
								return this.$message.warning('交付预警的数量或者PV不得为0');
							}
						}
					}

					const data = {
						...this.warningForm,
						isDeliverWarning: String(Number(!this.payDisable)), // 交付预警
						isShopWarning: String(Number(!this.buyDisable)), //购货预警
					};
					delete data.dimension;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/dataAdmin/warningRule/save',
						data,
					});
					if (res?.code == 200) {
						this.$message.success(res.message);
						this.$closeSelf();
						this.$dispatch('PRODUCT_CONTROLLIST_LIST');
						this.$go('product_control_list');
					}
				}
			});
		},
		async getProduct() {
			this.warningForm.productCode = this.warningForm.productCode.toLocaleUpperCase();
			const res = await this.$fetch(`/mgmt/product/item/getProductInfo?serialNo=${this.warningForm.productCode}`);
			if (res?.code == 200 && res?.data) {
				const { title } = res.data;
				this.productName = title;
			} else {
				this.productName = '';
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.popoverBtn {
	padding: 0;
	font-size: 20px;
	border: none;
	border-radius: 50%;
	margin-left: 20px;
}
.left-title {
	width: 80px;
}
.right-title {
	width: 140px;
	margin-left: 10px;
}
.form {
	width: 500px;
}
.productBox {
	position: relative;
}
.porductName {
	position: absolute;
	left: 370px;
	width: 100%;
}
</style>