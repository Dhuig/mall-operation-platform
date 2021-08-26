<template>
	<div>
		<el-card class="card-gap">
			<div class="head-text">基础信息</div>
			<el-row type="flex">
				<el-form :model="pageData" :rules="rulesConfigDto" ref="ruleForm" label-width="140px">
					<el-form-item label="优惠券编号：" prop="couponNumber">
						<el-input
							class="style-width"
							v-model="pageData.couponNumber"
							placeholder="请输入优惠券编号"
							@change="blurClick"
							maxlength="20"
							show-word-limit
						></el-input>
						<span v-if="isSelectPromotionCode === 1" class="icon-class el-icon-success"></span>
						<span v-if="isSelectPromotionCode === 0" class="icon-class el-icon-error"></span>
						<span v-if="isSelectPromotionCode === 1">该编号可用</span>
						<span v-if="isSelectPromotionCode === 0">该编号重复</span>
					</el-form-item>
					<el-form-item label="优惠券名称：" prop="couponName">
						<el-input
							class="style-width"
							v-model="pageData.couponName"
							placeholder="请输入优惠券名称"
							maxlength="40"
							show-word-limit
						></el-input>
					</el-form-item>
					<el-form-item label="生效时间：" prop="startTime">
						<el-date-picker
							class="date-picker"
							v-model="pageData.startTime"
							type="datetime"
							placeholder="选择日期时间"
							value-format="timestamp"
							:picker-options="timeDisabel"
						></el-date-picker>
						<!-- value-format="yyyy-MM-dd HH:mm:ss" -->
					</el-form-item>
					<el-form-item label="失效时间：" prop="endTime">
						<el-date-picker
							:disabled="limitNum"
							class="date-picker"
							v-model="pageData.endTime"
							type="datetime"
							value-format="timestamp"
							placeholder="选择日期时间"
							:picker-options="timeDisabel"
						></el-date-picker>
						<el-checkbox class="radio-xz" style="margin-right: 10px" v-model="limitNum">不限制</el-checkbox>
						<el-popover placement="right" title width="220" trigger="hover" content=" ">
							<div>选择不限制，优惠券没有失效时间</div>
							<span slot="reference" class="detail el-icon-warning-outline"></span>
						</el-popover>
					</el-form-item>
					<el-form-item label="优惠券总量" prop="couponCount">
						<el-radio class="radio-xz" v-model="couponCountNum" :label="-1">不限制</el-radio>
						<el-radio class="radio-xz" v-model="couponCountNum" :label="1">最多</el-radio>
						<el-input-number
							:disabled="couponCountNum == -1"
							v-model="pageData.couponCount"
							:min="1"
							step-strictly
							:max="1000000"
						></el-input-number>
						<span style="margin-left: 10px">张</span>
					</el-form-item>
					<el-form-item label="优惠码" prop="isGenerateCode">
						<el-radio class="radio-xz" v-model="pageData.isGenerateCode" :label="0">不生成优惠码</el-radio>
						<el-radio
							class="radio-xz"
							v-model="pageData.isGenerateCode"
							:disabled="couponCountNum === -1 || pageData.limitStore == 1"
							:label="1"
						>
							生成优惠码
						</el-radio>
						<el-popover placement="right" title width="200" trigger="hover" content="">
							<div>生成优惠码要设置优惠券总量</div>
							<span slot="reference" class="detail el-icon-warning-outline"></span>
						</el-popover>
					</el-form-item>
					<el-form-item label="可获得数量" prop="couponCount">
						<el-radio class="radio-xz" v-model="limitCountNum" :label="0">不限制</el-radio>
						<el-radio class="radio-xz" v-model="limitCountNum" :label="1">最多</el-radio>
						<el-input-number
							:disabled="!limitCountNum"
							v-model="pageData.limitCount"
							:min="1"
							step-strictly
						></el-input-number>
						<span style="margin-left: 10px; margin-right: 10px">张</span>
						<el-popover placement="right" title width="200" trigger="hover" content="">
							<div>用于控制每位顾客最多可获得相同优惠券的数量</div>
							<span slot="reference" class="detail el-icon-warning-outline"></span>
						</el-popover>
					</el-form-item>
					<el-form-item label="优惠券说明" prop="remarks">
						<el-input
							type="textarea"
							placeholder="请输入活动说明，方便内部识别说明"
							v-model="pageData.remarks"
							:autosize="{ minRows: 5 }"
							maxlength="1000"
							show-word-limit
						></el-input>
					</el-form-item>
				</el-form>
			</el-row>
		</el-card>
		<el-card class="card-gap">
			<div class="head-text">使用规则</div>
			<el-row type="flex" class="form-width-protect">
				<el-form :model="pageData" ref="ruleFormrule" :rules="rulesConfigDto" label-width="140px">
					<el-form-item label="面值：" prop="faceValue">
						<el-input-number
							:min="1"
							:max="9999999999"
							placeholder="1~10位数字"
							v-model="pageData.faceValue"
							@change="changeFaceValue"
							style="width: 210px"
						></el-input-number>
						元
					</el-form-item>
					<el-form-item label="优惠券类型：" prop="couponType">
						<el-radio class="radio-xz" v-model="pageData.couponType" :label="2">满减券</el-radio>
						<el-radio class="radio-xz" v-model="pageData.couponType" :label="1">立减券</el-radio>
						<el-radio class="radio-xz" v-model="pageData.couponType" :label="3">叠加满减券</el-radio>
					</el-form-item>
					<el-form-item label="使用条件：" :prop="pageData.couponType === 1 ? '' : 'minAmount'">
						<div v-if="pageData.couponType !== 1">
							{{ pageData.couponType === 3 ? '每' : '' }}满
							<el-input-number
								:min="1"
								:max="9999999999"
								style="margin-left: 10px; margin-right: 10px"
								v-model="pageData.minAmount"
								@change="minAmountNum"
							></el-input-number>
							元，可用使用
							<el-popover placement="right" title width="260" trigger="hover" content="">
								<div v-if="pageData.couponType === 3">每满{{ pageData.minAmount }}元可用，是阶梯级的满减规则</div>
								<div v-else>
									满{{ pageData.minAmount }}元可用，是指订单中(使用范围内产品)必须达到满足金额，才能使用该优惠券
								</div>
								<span slot="reference" class="detail el-icon-warning-outline"></span>
							</el-popover>
						</div>
						<div v-else>不限</div>
					</el-form-item>
					<el-form-item label="叠加控制：" prop="isStacked">
						<el-radio class="radio-xz" v-model="pageData.isStacked" :label="0">不可叠加</el-radio>
						<el-radio class="radio-xz" v-model="pageData.isStacked" :label="1">可叠加</el-radio>
					</el-form-item>
					<el-form-item label="门店限制：" prop="limitStore">
						<el-radio class="radio-xz" v-model="pageData.limitStore" :label="0">不限制门店使用</el-radio>
						<el-radio class="radio-xz" v-model="pageData.limitStore" :label="1">限制门店使用</el-radio>
						<el-popover placement="right" title width="300" trigger="hover" content="">
							<div>限制门店使用:</div>
							<div>1.自购时只能选择关联门店交付；</div>
							<div>2.代购时只能由关联门店下单。</div>
							<div>用于转赠优惠券限制，正常优惠券请选择不限制门店使用</div>
							<span slot="reference" class="detail el-icon-warning-outline"></span>
						</el-popover>
					</el-form-item>
					<el-form-item label="平台限制：" prop="platforms">
						<el-checkbox-group v-model="pageData.platforms">
							<el-checkbox :label="1">APP</el-checkbox>
							<el-checkbox :label="2">PC</el-checkbox>
							<el-checkbox :label="4">小程序</el-checkbox>
							<el-popover placement="right" title width="280" trigger="hover" content="">
								<div>限制平台使用：仅可用于已勾选的平台使用</div>
								<span slot="reference" style="margin-left: 10px" class="detail el-icon-warning-outline"></span>
							</el-popover>
						</el-checkbox-group>
					</el-form-item>
				</el-form>
			</el-row>
		</el-card>
	</div>
</template>

<script>
import axios from 'axios';
import { CHECK_PROMOTION_CODE, CHECK_PROMOTION_NAME } from '../config.js';
export default {
	name: 'activeConfiguration',
	props: {
		promotion: {
			type: Object,
			default: () => {
				return {
					remarks: null,
					couponNumber: '',
					couponName: '',
					startTime: '',
					endTime: '',
					couponCount: -1,
					isGenerateCode: 1,
					faceValue: '',
					couponType: 1,
					minAmount: '',
					isStacked: 0,
				};
			},
		},
	},
	data() {
		// let num = /^\d{1,10}$/;
		let num = /^\d+$|^\d*\.\d+$/;
		const faceValuechecked = (rule, value, callback) => {
			if (!num.test(value) || String(value).length > 10) {
				return callback(new Error('请输入1~10位数字'));
			} else {
				return callback();
			}
		};
		return {
			isSelectPromotionCode: '',
			timeDisabel: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 3600 * 1000 * 24;
				},
			},
			pageData: {},
			limitNum: false,
			couponCountNum: -1,
			limitCountNum: 0,
			couponNumber: '',
			rulesConfigDto: {
				couponNumber: [{ required: true, validator: CHECK_PROMOTION_CODE, trigger: 'change' }],
				couponName: [{ required: true, validator: CHECK_PROMOTION_NAME, trigger: 'change', minlength: 2 }],
				startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
				couponCount: [{ required: true, message: '请输入优惠券总量', trigger: 'change' }],
				isGenerateCode: [{ required: true, message: '请选择是否生成优惠码', trigger: 'change' }],
				faceValue: [{ required: true, validator: faceValuechecked, trigger: 'blur' }],
				couponType: [{ required: true, message: '请选择优惠券类型', trigger: 'change' }],
				minAmount: [{ required: true, message: '请填写使用条件', validator: faceValuechecked, trigger: 'change' }],
				isStacked: [{ required: true, message: '请选择叠加控制', trigger: 'change' }],
				limitStore: [{ required: true, message: '请选择', trigger: 'change' }],
				platforms: [{ required: true, message: '请选择至少一个平台', trigger: 'change' }],
			},
			isFlag: false,
			isFlags: false,
		};
	},
	watch: {
		promotion: {
			handler(val) {
				this.pageData = Object.assign({}, val);
				this.couponCountNum = val.couponCount == -1 ? -1 : 1;
				this.limitCountNum = val.limitCount ? 1 : 0;
				this.limitNum = !val.endTime ? true : false;
			},
			deep: true,
			immediate: true,
		},
		'pageData.limitStore'(val) {
			if (val == 1) this.pageData.isGenerateCode = 0;
		},
		limitNum(val) {
			this.pageData.endTime = val ? '' : this.pageData.endTime || '';
			if (val) this.$refs['ruleForm'].clearValidate('endTime');
		},
		couponCountNum(val) {
			if (val === -1) this.pageData.isGenerateCode = 0;
		},
	},
	methods: {
		promotionCode() {
			this.$emit('PromotionCode', this.isSelectPromotionCode);
		},
		changeFaceValue(e) {
			this.pageData.faceValue = Number(e).toFixed(2);
		},
		minAmountNum(e) {
			this.pageData.minAmount = e.toFixed(2);
		},
		async blurClick(e) {
			if (!/[^\w\s]+/.test(e) && e.trim() !== '') {
				let { id } = this.$route.query;
				const res = await axios.request(
					`/mgmt/prmt/coupon/selectCouponNumber?couponNumber=${e}&couponId=${this.$route.query.id ? id : ''}`
				);
				if (res.data.code == 500 && res.data.message != '优惠券编码不能重复') {
					this.$message.error('网络异常！');
				} else {
					this.isSelectPromotionCode = res && res.data.code == 200 ? 1 : 0;
				}
				if (!e) this.isSelectPromotionCode = '';
			} else {
				this.isSelectPromotionCode = '';
			}
			this.promotionCode();
		},
		isGo() {
			this.isFlag = false;
			this.$refs['ruleForm'].validate(valid => {
				this.isFlag = valid;
			});
			return this.isFlag;
		},
		isGos() {
			this.isFlags = false;
			this.$refs['ruleFormrule'].validate(valid => {
				this.isFlags = valid;
			});
			return this.isFlags;
		},
		emit() {
			let { endTime, couponCount, limitCount, minAmount, couponType } = this.pageData;
			let parmas = Object.assign({}, this.pageData);
			parmas.endTime = this.limitNum ? null : endTime;
			parmas.minAmount = couponType == 1 ? null : minAmount;
			parmas.couponCount = this.couponCountNum === -1 ? -1 : couponCount;
			parmas.limitCount = this.limitCountNum ? limitCount : null;
			this.$emit('firstData', { ...parmas });
		},
	},
};
</script>

<style lang="scss" scoped>
.style-width {
	width: 300px;
	margin-right: 10px;
}
.detail {
	font-size: 18px;
	cursor: pointer;
}
.card-gap {
	margin-top: 10px;
	.radio-xz {
		margin-left: 10px;
	}
	.form-width-protect {
		padding: 0 40px;
		.radio-xz {
			margin-left: 10px;
		}
		.span-text {
			margin-left: 10px;
		}
		.activity-text {
			color: $color-disabled;
		}
	}
	.head-text {
		font-size: 18px;
		font-weight: 600;
		padding: 0 0 20px 30px;
	}
	.module-text {
		margin-left: 10px;
		color: $color-link;
	}
}
.btns {
	color: #0877fd;
	cursor: pointer;
	margin-right: 18px;
}
.icon-class {
	color: $success;
	margin-right: 5px;
}
.el-icon-error {
	color: $error;
}
</style>
