<template>
	<div>
		<el-card class="card-gap">
			<div class="head-text">基础信息</div>
			<el-row type="flex">
				<el-form :model="pagePromotion" :rules="rulesConfigDto" ref="ruleForm3" label-width="140px">
					<el-form-item label="换购方案编号：" prop="promotionCode">
						<el-input
							class="style-width"
							v-model="pagePromotion.promotionCode"
							@change="blurClick"
							placeholder="请输入换购方案编号"
							maxlength="20"
							show-word-limit
						></el-input>
						<span v-if="isSelectPromotionCode === 1" class="icon-class el-icon-success"></span>
						<span v-if="isSelectPromotionCode === 0" class="icon-class el-icon-error"></span>
						<span v-if="isSelectPromotionCode === 1">该编号可用</span>
						<span v-if="isSelectPromotionCode === 0">该编号重复</span>
					</el-form-item>
					<el-form-item label="换购方案名称：" prop="promotionName">
						<el-input
							class="style-width"
							maxlength="20"
							v-model="pagePromotion.promotionName"
							placeholder="请输入换购方案名称"
						></el-input>
					</el-form-item>
					<el-form-item label="开始时间：" prop="startTime">
						<el-date-picker
							class="date-picker"
							v-model="pagePromotion.startTime"
							type="datetime"
							placeholder="选择日期时间"
							:picker-options="timeDisabel"
							value-format="timestamp"
						></el-date-picker>
					</el-form-item>
					<el-form-item label="换购结束时间：" prop="endTime">
						<el-date-picker
							class="date-picker1"
							:disabled="showEndTimeNum"
							v-model="pagePromotion.endTime"
							type="datetime"
							value-format="timestamp"
							:picker-options="timeDisabel"
							placeholder="选择日期时间"
						></el-date-picker>
						<el-checkbox style="margin-right: 10px; margin-left: 10px" v-model="showEndTimeNum">不限时</el-checkbox>
						<el-popover placement="right" title width="200" trigger="hover" content=" ">
							<div>设为不限时换购时，该换购不会自动停止。商城不会有换购结束倒计时。</div>
							<span slot="reference" class="detail el-icon-warning-outline"></span>
						</el-popover>
					</el-form-item>
					<el-form-item label="显示结束时间" required>
						<el-radio
							class="radio-xz"
							:disabled="showEndTimeNum"
							v-model="pagePromotion.configDto.showEndTime"
							:label="1"
						>
							显示
						</el-radio>
						<el-radio
							class="radio-xz"
							:disabled="showEndTimeNum"
							v-model="pagePromotion.configDto.showEndTime"
							:label="0"
						>
							不显示
						</el-radio>
					</el-form-item>
					<el-form-item label="换购说明" prop="remarks">
						<el-input
							class="style-width textarea-class"
							type="textarea"
							placeholder="请输入换购说明，方便内部识别说明"
							v-model="pagePromotion.remarks"
						></el-input>
					</el-form-item>
				</el-form>
			</el-row>
		</el-card>
		<el-card class="card-gap">
			<div class="head-text">购买配置</div>
			<el-row class="form-width-protect">
				<el-form :model="pagePromotion.configDto" ref="ruleForm1" :rules="rulesConfigDto" label-width="140px">
					<el-form-item label="限购总数量：" required>
						<el-col>
							<el-radio
								class="radio-xz"
								:disabled="$route.query.id && limitNumber == -2"
								v-model="limitNumber"
								:label="0"
							>
								每位顾客最多购买
							</el-radio>
							<el-input-number
								v-model="limitNumberStr"
								:min="0"
								style="width: 140px"
								:disabled="limitNumber !== 0"
								label="描述文字"
								:max="9999"
							></el-input-number>
							<span style="margin-left: 10px">件</span>
						</el-col>
					</el-form-item>
					<el-form-item label="">
						<el-radio
							class="radio-xz"
							:disabled="$route.query.id && limitNumber == -2"
							v-model="limitNumber"
							:label="-1"
						>
							不限制
						</el-radio>
					</el-form-item>
					<el-form-item label="">
						<el-radio
							class="radio-xz"
							:disabled="$route.query.id && limitNumber !== -2"
							v-model="limitNumber"
							:label="-2"
						>
							按需导入
						</el-radio>
					</el-form-item>
					<el-form-item label="支付时效：" required>
						<el-col :span="5">
							<el-col>
								<el-input-number
									:disabled="ispayLimitTime"
									style="margin-right: 10px; width: 140px"
									v-model="pagePromotion.configDto.day"
									:min="0"
								></el-input-number>
								<span>天</span>
							</el-col>
						</el-col>
						<el-col :span="5">
							<el-col>
								<el-input-number
									:disabled="ispayLimitTime"
									style="margin-right: 10px; width: 140px"
									v-model="pagePromotion.configDto.hour"
									:min="0"
								></el-input-number>
								<span>时</span>
							</el-col>
						</el-col>
						<el-col :span="5">
							<el-col>
								<el-input-number
									:disabled="ispayLimitTime"
									style="margin-right: 10px; width: 140px"
									v-model="pagePromotion.configDto.minute"
									:min="0"
								></el-input-number>
								<span>分</span>
							</el-col>
						</el-col>
						<el-checkbox class="radio-xz" style="margin-right: 10px" v-model="ispayLimitTime">跟随系统</el-checkbox>
						<el-popover placement="right" title width="200" trigger="hover" content=" ">
							<div>
								-控制该活动产品下单后的支付时效，超过支付时间未支付的订单，会自动取消
								<br />
								-如果订单内有其他产品，以活动产品为主。如果有多个活动产品，以最短支付时间的产品为准。
								<br />
								-选择跟随系统，该活动内产品的支付时效跟随系统全局配置
								<br />
								-最大值10天23时59分
							</div>
							<span slot="reference" class="detail el-icon-warning-outline"></span>
						</el-popover>
					</el-form-item>
				</el-form>
			</el-row>
		</el-card>
		<el-card class="card-gap">
			<div class="head-text-cp">
				<span class="head-text-child">换购主产品</span>
				<el-popover placement="right" title width="200" trigger="hover" content=" ">
					<div>顾客购物车内有下列产品时，可以选择换购活动产品</div>
					<span slot="reference" class="detail el-icon-warning-outline"></span>
				</el-popover>
				<el-button class="btn-add" type="primary" @click="isAdd">手动新增</el-button>
			</div>
			<div class="table_list_fix">
				<el-table :data="productDtosArr" border style="width: 100%" :loading="false">
					<el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
					<el-table-column prop="serialNo" label="产品编码" align="center"></el-table-column>
					<el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
					<el-table-column prop="specification" label="规格" align="center"></el-table-column>
					<el-table-column prop="unit" label="单位" align="center"></el-table-column>
					<el-table-column prop="retailPrice" label="零售价" align="center"></el-table-column>
					<el-table-column prop="productPv" label="产品pv" align="center"></el-table-column>
					<el-table-column prop="productPv" label="操作" align="center">
						<template slot-scope="scope">
							<el-button type="text" @click="del(scope.$index)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<el-dialog
				title="手动新增活动主产品"
				v-drag
				:visible.sync="dialogVisible"
				width="50%"
				:before-close="handleClose"
			>
				<div class="search-div">
					<el-form :inline="true" label-width="120px">
						<el-form-item label="搜索产品：" prop="name">
							<el-input v-model="cardNo" placeholder="输入产品编码，精准搜索" clearable></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="handleSearch">搜 索</el-button>
						</el-form-item>
					</el-form>
					<div class="product-class">
						<el-form label-width="120px" v-if="temporary.length > 0">
							<el-form-item label="产品编码：">
								<span>{{ product.serialNo }}</span>
							</el-form-item>
							<el-form-item label="产品名称：">
								<span>{{ product.productName }}</span>
							</el-form-item>
							<el-form-item label="零售价：">
								<span>{{ product.retailPrice }}</span>
							</el-form-item>
							<el-form-item label="产品PV：">
								<span>{{ product.productPv }}</span>
							</el-form-item>
						</el-form>
						<div class="nothing" v-else>
							<p class="el-icon-document icon-file"></p>
							<p class="file-text">搜索不到产品或产品已下架</p>
						</div>
					</div>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button @click="handleClose">取 消</el-button>
					<el-button type="primary" @click="add">添 加</el-button>
				</span>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
import { CHECK_PROMOTION_CODE, CHECK_PROMOTION_NAME } from '../config.js';
import axios from 'axios';
import qs from 'querystring';
export default {
	name: 'activeConfig',
	props: {
		promotion: {
			type: Object,
			default: () => {
				return {};
			},
		},
		componentname: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			pagePromotion: {},
			isSelectPromotionCode: '',
			dialogVisible: false,
			showEndTimeNum: false,
			uploadData: { promotionId: null },
			optionsLoading: false,
			isPush: false,
			temporary: [],
			options: [],
			productDtosArr: [],
			productNameoptions: [],
			ispayLimitTime: false,
			timeDisabel: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 3600 * 1000 * 24;
				},
			},
			limitNumberStr: '',
			limitNumber: false,
			rulesConfigDto: {
				promotionCode: [{ required: true, validator: CHECK_PROMOTION_CODE, trigger: 'blur' }],
				promotionName: [{ required: true, validator: CHECK_PROMOTION_NAME }],
				startTime: [{ required: true, message: '请选择开始时间' }],
				endTime: [{ required: true, message: '请选择结束时间' }],
			},
			time: {
				day: 0,
				hour: 1,
				minute: 0,
			},
			isFlag: false,
			product: {},
			cardNo: '',
			isdeleteCacheMember: true,
		};
	},
	watch: {
		showEndTimeNum: {
			handler(val) {
				this.rulesConfigDto.endTime = [{ required: !val, message: '请选择结束时间' }];
				if (val) {
					this.pagePromotion.endTime = '';
					this.pagePromotion.configDto.showEndTime = 0;
				}
			},
		},
		limitNumber(val, oldval) {
			this.limitNumberStr = this.pagePromotion.configDto.limitNumber > 0 ? this.pagePromotion.configDto.limitNumber : 0;
			if (!this.$route.query.id) {
				if (oldval === -2 && this.isdeleteCacheMember) {
					this.deleteCacheMember();
				} else if (oldval !== -2 && val === -2 && this.isdeleteCacheMember) {
					this.deleteCacheMember();
				}
				this.isdeleteCacheMember = true;
			}
		},
		ispayLimitTime(val) {
			this.pagePromotion.configDto.payLimitTime = val ? 1 : 2;
		},
		'pagePromotion.configDto.limitNumber'(val) {
			this.limitNumber = val > 0 ? 0 : val;
			this.limitNumberStr = val > 0 ? val : '';
		},
		promotion: {
			handler(val) {
				this.pagePromotion = val;
				this.ispayLimitTime = val.configDto.payLimitTime == 1 ? true : false;
				if (val.serialNos.length > 0) {
					this.productDtosArr = val.serialNos;
				}
			},
			deep: true,
			immediate: true,
		},
		'promotion.endTime'(val) {
			if (val === null && this.componentname === 'activeConfig') {
				this.showEndTimeNum = true;
				this.pagePromotion.endTime = '';
			}
		},
	},
	created() {
		let { limitNumber } = this.promotion.configDto;
		this.limitNumber = limitNumber > 0 ? 0 : limitNumber;
		this.limitNumberStr = limitNumber > 0 ? limitNumber : '';
	},
	methods: {
		async deleteCacheMember() {
			let res = await this.$fetch(`/mgmt/prmt/getUserListPage?${qs.stringify({ pageNum: 1, pageSize: 10 })}`);
			if (res && res.code === 200 && res.data && res.data.list.length > 0) {
				this.$confirm('切换购买配置类型将清空已导入的顾客?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						this.$fetch({ method: 'POST', url: `/mgmt/prmt/deleteCacheMember`, data: { id: null } });
					})
					.catch(() => {
						this.limitNumber = this.promotion.configDto.limitNumber;
						this.isdeleteCacheMember = false;
					});
			}
		},
		async blurClick(e) {
			if (!/[^\w\s]+/.test(e) && e.trim()!=="") {
				let { id } = this.$route.query;
				const res = await axios.request(
					`/mgmt/prmt/selectPromotionCode?promotionCode=${e}&promotionId=${this.$route.query.id ? id : ''}`
				);
				if (res.data.code == 500 && res.data.message != '活动编码不能重复') {
					this.$message.error('网络异常！');
				} else {
					this.isSelectPromotionCode = res && res.data.code == 200 ? 1 : 0;
				}
				if (!e) this.isSelectPromotionCode = '';
			} else {
				this.isSelectPromotionCode = '';
			}
		},
		handleSearch() {
			if (!this.cardNo) return this.$message.warning('请输入产品编码进行搜索');
			this.getProduct(this.cardNo, '');
		},
		handleClose() {
			this.dialogVisible = false;
			this.product = {};
			this.temporary = [];
			this.cardNo = '';
		},
		del(index) {
			this.$confirm('确定删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				this.productDtosArr.splice(index, 1);
			});
		},
		isAdd() {
			this.dialogVisible = true;
		},
		add() {
			if (this.temporary.length == 0) return this.$message.warning('请搜索数据！');
			this.isPush = false;
			this.productDtosArr.forEach(el => {
				if (this.product.productId === el.productId) {
					this.isPush = true;
					this.$message.warning('请添加未添加过的产品');
				}
			});
			if (this.isPush) return;
			this.productDtosArr.push(this.product);
			this.$message.success('新增成功！');
		},
		async getProduct(couponNumber = '', productName = '') {
			const res = await this.$fetch(
				`/mgmt/prmt/getProductListByCodeOrName?productCode=${couponNumber}&productName=${productName}&type=3`
			);
			if (res && res.code == 200) {
				let { data } = res;
				this.temporary = data;
				this.product = data[0] || {};
			} else {
				this.temporary = [];
				this.product = {};
			}
		},
		isGo() {
			let isFlag = false;
			let isFlag1 = false;
			let isTure4 = true;
			this.$refs['ruleForm3'].validate(valid => {
				isFlag = valid;
			});
			if (this.productDtosArr.filter(e => !!e.serialNo).length === 0) {
				this.$message.warning('换购产品至少添加一项');
				isFlag1 = false;
			} else {
				isFlag1 = true;
			}
			let { day, hour, minute, payLimitTime } = this.pagePromotion.configDto;
			let time = true;
			if (payLimitTime === 2) {
				time = !!day || !!hour || !!minute ? true : false;
				if (!time) this.$message.warning('请填写支付时效');
			} else {
				time = true;
			}
			if (this.isSelectPromotionCode == '' && isFlag && this.$route.query.id) {
				isTure4 = true;
			} else if (this.isSelectPromotionCode) {
				isTure4 = true;
			} else {
				isTure4 = false;
			}
			return isFlag && isFlag1 && time && isTure4;
		},
		emit() {
			let params = Object.assign({}, this.pagePromotion);
			params.configDto.limitNumber = this.limitNumber !== 0 ? this.limitNumber : this.limitNumberStr;
			params.configDto.payLimitTime = this.ispayLimitTime ? 1 : 2;
			params.endTime = this.showEndTimeNum ? null : this.pagePromotion.endTime;
			params.serialNos = this.productDtosArr;
			this.$emit('firstData', { ...params });
		},
	},
};
</script>

<style lang="scss" scoped>
.detail {
	font-size: 18px;
	cursor: pointer;
}
.card-gap {
	margin-top: 10px;
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
	.head-text-cp {
		height: 32px;
		padding: 0 0 20px 30px;
		line-height: 32px;
		.head-text-child {
			font-size: 18px;
			font-weight: 600;
			margin-right: 10px;
		}
		.btn-add {
			float: right;
		}
	}
	.head-text {
		padding: 0 0 20px 30px;
		font-size: 18px;
		font-weight: 600;
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

.search-div {
	padding: 20px 0;
}
.product-class {
	height: 288px;
	.nothing {
		color: $color-disabled;
		text-align: center;
		.icon-file {
			font-size: 128px;
			margin-top: 30px;
		}
		.file-text {
			margin-top: 30px;
			font-size: 16px;
		}
	}
}

.style-width {
	width: 300px;
	margin-right: 10px;
}
.icon-class {
	color: $success;
	margin-right: 5px;
}
.el-icon-error {
	color: $error;
}
.textarea-class ::v-deep .el-input__count {
	right: 28px;
}
.textarea-class ::v-deep.el-textarea__inner {
	padding-bottom: 50px;
}
</style>
