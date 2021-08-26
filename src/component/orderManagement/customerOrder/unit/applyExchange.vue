<template>
	<div class="apply-exchange">
		<guideBar />
		<el-card>
			<section class="order-no">订单号: {{ orderNo }}</section>
			<article>
				<p>换货须知</p>
				<p>1、退货时，需保证产品的完整性，赠品需随产品一同寄回</p>
				<p>2、退款成功后， 退款金额退回原支付渠道或完美钱包</p>
				<p>3、提交了企业专用纸质发票申请的，需要退回纸质票。</p>
			</article>
		</el-card>
		<el-card class="card">
			<h2>产品明细</h2>
			<el-table :data="orderExchangeProducts" show-summary :summary-method="getSummaries" size="small">
				<el-table-column type="index" label="序号" />
				<el-table-column prop="productCode" label="产品编码" width="120" />
				<el-table-column prop="productName" label="产品名称" width="200" />
				<el-table-column prop="packing" label="规格" width="160" />
				<el-table-column prop="price" label="单位" />
				<el-table-column prop="quantityPurchased" label="购买数量" />
				<el-table-column prop="quantity" label="换货数量" width="120">
					<template v-slot="scope">
						<el-input
							v-model.number="scope.row.quantity"
							placeholder="换货数量"
							@input="handleEdit(scope.$index, scope.row)"
							size="small"
						/>
					</template>
				</el-table-column>
				<el-table-column prop="expiryData" label="生产日期/有效期" width="200">
					<template v-slot="scope">
						<el-date-picker
							class="table-input"
							v-model="scope.row.expiryData"
							format="yyyy-MM-dd"
							value-format="yyyy-MM-dd"
							:editable="false"
							placeholder="生产日期/有效期"
							size="small"
						/>
					</template>
				</el-table-column>
				<el-table-column prop="batchNumber" label="批号" width="120">
					<template v-slot="scope">
						<div :class="{ showRed: scope.row.quantity > 0 && !scope.row.batchNumber }">
							<el-input v-model="scope.row.batchNumber" placeholder="批号" size="small" />
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="firstUseTime" label="初次使用时间" width="200">
					<template v-slot="scope">
						<el-date-picker
							class="table-input"
							size="small"
							v-model="scope.row.firstUseTime"
							format="yyyy-MM-dd"
							value-format="yyyy-MM-dd"
							:editable="false"
							:picker-options="defaultPickerOptions"
							placeholder="初次使用时间"
						/>
					</template>
				</el-table-column>
				<el-table-column prop="usePeriod" label="日常使用时段" width="120">
					<template v-slot="scope">
						<el-select v-model="scope.row.usePeriod" size="small">
							<el-option v-for="item in USE_PERIOD_DICT" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="problemStatus" label="问题发生状态" width="120">
					<template v-slot="scope">
						<el-select v-model="scope.row.problemStatus" size="small">
							<el-option
								v-for="item in PROBLEM_STATUS_DICT"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="problemDesc" label="产品内容物状态" width="200">
					<template v-slot="scope">
						<el-input v-model="scope.row.problemDesc" placeholder="产品内容物状态" size="small" />
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-card>
			<h2>换货信息</h2>
			<el-form :model="exchangeInfoForm" ref="exchangeInfoForm" label-width="140px">
				<el-form-item
					label="一级原因"
					prop="reason1Id"
					:rules="[{ required: true, message: '请选择一级原因', trigger: ['blur', 'change'] }]"
				>
					<el-select v-model="exchangeInfoForm.reason1Id" placeholder="请选择一级原因">
						<el-option
							v-for="({ returnReason, id }, index) in reason1Dict"
							:label="returnReason"
							:value="id"
							:key="index"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="一级原因备注说明" prop="reason1Remark">
					<el-input class="input" v-model="exchangeInfoForm.reason1Remark"></el-input>
				</el-form-item>
				<el-form-item
					label="二级原因"
					prop="reason2Id"
					:rules="[{ required: true, message: '请选择二级原因', trigger: ['blur', 'change'] }]"
				>
					<el-select v-model="exchangeInfoForm.reason2Id" placeholder="请选择二级原因">
						<el-option
							v-for="({ returnReason, id }, index) in reason2Dict"
							:label="returnReason"
							:value="id"
							:key="index"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="二级原因备注说明" prop="reason2Remark">
					<el-input class="input" v-model="exchangeInfoForm.reason2Remark"></el-input>
				</el-form-item>
				<el-form-item
					label="换货方式"
					prop="reason1Id"
					:rules="[{ required: true, message: '请选择换货方式', trigger: ['blur', 'change'] }]"
				>
					<el-select v-model="exchangeInfoForm.exchangeType" placeholder="请选择换货方式">
						<el-option
							v-for="({ label, value }, index) in EXCHANGE_TYPE"
							:label="label"
							:value="value"
							:key="index"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					label="旧货处理方式"
					prop="junkHandleType"
					:rules="[{ required: true, message: '请选择旧货处理方式', trigger: ['blur', 'change'] }]"
				>
					<el-select v-model="exchangeInfoForm.junkHandleType" placeholder="请选择旧货处理方式">
						<el-option
							v-for="({ label, value }, index) in JUNK_HANDLE_TYPE"
							:label="label"
							:value="value"
							:key="index"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="上传图片" prop="attachmentUrlList">
					<el-upload
						class="upload-demo"
						multiple
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="ossParams"
						:on-remove="handleRemove"
						:on-success="handleSuccess"
						:before-upload="beforeAvatarUpload"
						:limit="3"
						list-type="picture-card"
						accept="bmp, jpg, png"
					>
						<i class="el-icon-plus"></i>
						<div slot="tip" class="el-upload__tip tip-title" ref="up_dom">
							(支持格式bmp、jpg、png，最大10M，3个文件)
						</div>
					</el-upload>
				</el-form-item>
			</el-form>
		</el-card>
		<actionBar>
			<el-button @click="cancelApplication">取消</el-button>
			<el-button type="primary" @click="submitApplication">提交申请</el-button>
		</actionBar>
		<!-- 弹窗开关 -->
		<el-dialog
			center
			:close-on-press-escape="false"
			:show-close="false"
			fullscreen
			:visible.sync="dialogVisible"
			v-drag
		>
			<div class="dialogContent">
				<div class="el-icon-success icon"></div>
				<div class="bigTitle title">申请成功</div>
				<div class="smallTitle title">换货申请提交成功</div>
				<div>
					<el-button @click="dialogEnter('lookInfo')">查看详情</el-button>
					<el-button @click="dialogEnter">返回</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { USE_PERIOD_DICT, PROBLEM_STATUS_DICT, JUNK_HANDLE_TYPE, EXCHANGE_TYPE } from '../config';
export default {
	name: 'applyExchange',
	data() {
		return {
			USE_PERIOD_DICT,
			PROBLEM_STATUS_DICT,
			JUNK_HANDLE_TYPE,
			EXCHANGE_TYPE,
			orderNo: this.$route.query.orderNo,
			orderProductVos: this.$route.query.orderProductVos,
			reason1Dict: [], // 一级原因字典
			reason2Dict: [], // 二级原因字典
			orderExchangeProducts: JSON.parse(this.$route.query.orderProductVos).map(item => {
				const { serialNo, title, packing, price, quantity } = item;
				return Object.assign(
					{
						productCode: serialNo,
						productName: title,
						packing,
						price,
						quantityPurchased: quantity,
					},
					{
						quantity: '',
						expiryData: '',
						batchNumber: '',
						qrCode: '',
						firstUseTime: '',
						usePeriod: '',
						problemStatus: '',
						problemDesc: '',
					}
				);
			}),
			exchangeInfoForm: {
				reason1Id: '',
				reason1Remark: '',
				reason2Id: '',
				reason2Remark: '',
				exchangeType: '',
				junkHandleType: '',
				attachmentUrlList: [],
			},
			defaultPickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
			},
			ossParams: {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			},
			url: '', // 上传oss的地址
			dialogVisible: false,
		};
	},
	watch: {
		'exchangeInfoForm.reason1Id'() {
			const reason2Arr = this.reason1Dict.find(item => item.id === this.exchangeInfoForm.reason1Id);
			console.log(reason2Arr);
			if (reason2Arr) {
				this.reason2Dict = reason2Arr.reasonList;
			}
		},
	},
	methods: {
		// 大小不超过10M。
		beforeAvatarUpload(file) {
			const isLt10M = file.size / 1024 / 1024 < 10;
			if (!isLt10M) {
				this.$message.error(`大小不能超过10MB!`);
			}
			return isLt10M;
		},
		// 弹窗查看详情
		dialogEnter(type) {
			const {
				query,
				query: { orderNo },
				path,
			} = this.$route;
			// 查看就跳转到顾客订单详情
			if (type == 'lookInfo') {
				this.$go('customer_order_detail', { title: '顾客订单详情', orderNo });
			}
			// 触发组件更新
			this.$dispatch('RELOAD_CUSTOMER_ORDER_DETAIL');
			// 关闭换货 && 关闭代客售后
			let closeArr = this.$store.getters['system/getCloseTabArr'];
			if (closeArr.length) {
				closeArr.forEach(x => this.$closeSelf(x));
				// 清空需要关闭的数组
				this.$store.commit('system/UPDATA_CLOSE_TAB_ARR', { type: 'clear' });
			}
			// this.dialogVisible = false;
			// 关闭当前页面
			setTimeout(() => {
				this.$closeSelf({ query, path });
			}, 500);
		},
		async getAllReturnReasonByType() {
			const res = await this.$fetch({
				url: '/sys/api/getAllReturnReasonByType',
				params: { returnType: 2 },
			});
			if (res && res.data) {
				this.reason1Dict = res.data;
			} else {
				this.$message.error(res.message);
			}
		},
		getSummaries(param) {
			const { columns, data } = param;
			const sums = [];
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '合计';
					return;
				}

				if (column.property === 'quantity') {
					const values = data.map(item => Number(item[column.property]));
					if (!values.every(value => isNaN(value))) {
						sums[index] = values.reduce((prev, curr) => {
							const value = Number(curr);
							if (!isNaN(value)) {
								return prev + curr;
							} else {
								return prev;
							}
						}, 0);
						sums[index] = ['quantity', 'totalPv'].includes(column.property) ? sums[index] : '￥' + sums[index];
					} else {
						sums[index] = '';
					}
				}
			});

			return sums;
		},
		handleEdit(index, row) {
			const { quantity, quantityPurchased } = row;
			if (isNaN(Number(quantity))) {
				row.quantity = 0;
			}
			if (quantity > quantityPurchased) {
				this.$message.error('换货数量不能大于购买数量');
				row.quantity = Number(row.quantityPurchased);
			}
			if (quantity < 0) {
				row.quantity = 0;
			}
		},
		// 上传参数接口
		// async getUploadInfo() {
		// 	const uploadedNum = this.exchangeInfoForm.attachmentUrlList.length;
		// 	console.log('uploadedNum: ', uploadedNum);
		// 	if (uploadedNum >= 2) return this.$message.warning('最多可上传3张图片');

		// 	const res = await this.$fetch('http://42.194.215.85:8908/mgmt/cms/common/getUploadParams');
		// 	const { storageType, timeStamp, clientKey, sign, url } = res.data;
		// 	this.ossParams = {
		// 		...this.ossParams,
		// 		storageType,
		// 		timeStamp,
		// 		clientKey,
		// 		sign,
		// 	};
		// 	this.url = url;
		// },
		handleRemove(file, fileList) {
			console.log('remove');
			console.log(file);
			console.log(fileList);
		},
		handleSuccess(response, file) {
			const {
				datas: { fileUrlKey, msg },
				success,
			} = response;
			const { name } = file;
			if (success) {
				this.exchangeInfoForm.attachmentUrlList = [...this.exchangeInfoForm.attachmentUrlList, fileUrlKey];
			} else {
				this.$message.error(`${name}-${msg}`);
			}
		},
		// 取消申请
		cancelApplication() {
			this.$confirm('确认取消申请吗', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.$closeSelf();
				})
				.catch(() => {});
		},
		// 提交申请
		submitApplication() {
			// 判断数量是否大于0 quantity
			let quantity = this.orderExchangeProducts.filter(x => Number(x.quantity) > 0);
			if (quantity.length == 0) {
				return this.$message.error('换货数量为空');
			}
			// 判断换货数量大于0就必须填写批号
			let isCorrect = quantity.map(item => !item.batchNumber).some(Boolean);
			if (isCorrect) {
				return this.$message.warning('请输入批号');
			}
			this.$refs['exchangeInfoForm'].validate(async valid => {
				if (valid) {
					const {
						orderNo,
						orderExchangeProducts,
						exchangeInfoForm: {
							reason1Id,
							reason1Remark,
							reason2Id,
							reason2Remark,
							exchangeType,
							junkHandleType,
							attachmentUrlList,
						},
					} = this;
					let productsList = orderExchangeProducts.filter(item => {
						if (item.quantity) {
							return { ...item, productCode: item.serialNo };
						}
					});
					const { applySource } = this.$route.query;
					const data = {
						applySource: applySource ? applySource : 2,
						orderNo,
						orderExchangeProducts: productsList,
						reason1Id,
						reason1: this.getTextByIdFromDict(this.reason1Dict, reason1Id),
						reason1Remark,
						reason2Id,
						reason2: this.getTextByIdFromDict(this.reason2Dict, reason2Id),
						reason2Remark,
						exchangeType,
						junkHandleType,
						attachmentUrlList,
					};
					console.log(data);
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/order/exchange/applyExchange',
						data,
					});
					if (res.code === 200 && res.data) {
						this.dialogVisible = true;
					}
				}
			});
		},
		getTextByIdFromDict(dict, id) {
			return id ? [...dict].filter(item => item.id === id).shift().returnReason : null;
		},
	},
	mounted() {
		this.getAllReturnReasonByType();
	},
};
</script>

<style lang="scss" scoped>
.apply-exchange {
	// 弹出窗css
	.dialogContent {
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		top: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		.icon {
			font-size: 120px;
			color: #52c41a;
		}
		.title {
			margin-bottom: 20px;
			color: #909399;
		}
		.bigTitle {
			font-size: 22px;
			font-weight: 800;
			color: #272727;
			margin-top: 10px;
		}
	}
	.showRed {
		::v-deep.el-input__inner {
			border-color: $error;
		}
	}
	.table-input {
		width: 180px !important;
	}
	article {
		color: $color-hit;
		margin-top: 20px;
	}
	p {
		padding: 4px 0;
		> span {
			margin-right: 30px;
		}
	}
	.order-no {
		margin: 20px 0;
	}
	h2 {
		margin-bottom: 20px;
		color: $color-title;
		font-weight: 600;
	}
	.input {
		width: 223px;
	}
}
</style>
