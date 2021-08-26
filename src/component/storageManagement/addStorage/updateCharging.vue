<template>
	<div class="update-charging">
		<guideBar />
		<el-form :inline="true" ref="formRef" label-width="180px" :model="ruleForm" :rules="rules" label-suffix=":">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>基本信息</span>
				</div>
				<el-row class="min-width">
					<el-col :span="8">
						<el-form-item label="服务中心编号">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.storeCode }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="押货单号">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.orderSn }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="押货价合计">
							<span>￥{{ detailInfo.orderVo && detailInfo.orderVo.orderMortgageAmount }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="8">
						<el-form-item label="押货单状态">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.orderStatus | orderStatus }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="原押货单提交日期">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.createTime }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="押货单来源">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.orderSource | orderSource }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="8">
						<el-form-item label="押货标识">
							<span>{{ detailInfo.orderVo && detailInfo.orderVo.orderMark | orderMark }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="16">
						<el-form-item label="备注" prop="orderRemarks">
							<el-input placeholder="请输入备注" v-model="ruleForm.orderRemarks" size="medium" class="self-width" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-card>
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>押货单详情</span>
					<div class="header_title">
						<span class="left_span">
							<span>可用押货余额:</span>
							<span>￥{{ ableAmount || 0 }}</span>
						</span>
						<span class="right_span">
							<span>当前押货合计:</span>
							<span>￥{{ pledgeTotal || 0 }}</span>
						</span>
					</div>
				</div>
				<el-table :data="detailList" style="width: 100%;" :loading="true" border>
					<el-table-column prop="opt" label="序号" width="80px">
						<template slot-scope="scope">
							<span>{{ scope.$index + 1 }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productCode" label="产品编码" width="180">
						<template slot-scope="scope">
							<el-input
								style="width: 100%;"
								size="small"
								v-model="detailList[scope.$index].productCode"
								placeholder="请输入产品编码"
								@blur="searchProduct(scope.row)"
								:disabled="!scope.row.isadd"
							/>
						</template>
					</el-table-column>
					<el-table-column prop="productName" label="产品名称">
						<template slot-scope="scope">
							<span>{{ detailList[scope.$index].productName }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productPacking" label="规格">
						<template slot-scope="scope">
							<span>{{ detailList[scope.$index].productPacking }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productUnit" label="单位">
						<template slot-scope="scope">
							<span>{{ detailList[scope.$index].productUnit }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productBoxNum" label="装箱数量">
						<template slot-scope="scope">
							<span>{{ detailList[scope.$index].productBoxNum }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productMortgagePrice" label="押货价">
						<template slot-scope="scope">
							<span>¥{{ detailList[scope.$index].productMortgagePrice }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productInventoryNum" label="库存数量"></el-table-column>
					<el-table-column prop="canMortgageNum" label="最高可押货量">
						<template slot-scope="scope">
							<span>{{ detailList[scope.$index].canMortgageNum }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productNum" label="押货数量" min-width="120">
						<template slot-scope="scope">
							<el-input-number
								:disabled="!showAddBtn"
								style="width: 100%;"
								size="small"
								:min="0"
								:max="max(scope.row.maxProductNum)"
								v-model="detailList[scope.$index].productNum"
								@change="productNumChange(scope.row, scope.$index)"
							/>
						</template>
					</el-table-column>
					<el-table-column prop="productDeliveredNum" label="已发货数">
						<template slot-scope="scope">
							<span>{{ detailList[scope.$index].productDeliveredNum }}</span>
						</template>
					</el-table-column>
				</el-table>
				<div class="footer-box">
					<div>
						<!-- <el-button type="primary" @click="addProduct" v-if="showAddBtn">添加产品</el-button> -->
						<el-button type="primary" :loading="submitLoading" @click="handleBatch">
							{{ showAddBtn ? '批量取消' : '欠货停发' }}
						</el-button>
					</div>
				</div>
			</el-card>
			<!-- <div class="eidt-btn-footer">
				<div class="eidt-btn-footer-box">
					<el-button type="primary" @click="handleSave('formRef')"
						>确认修改</el-button
					>
					<el-button class="cacel-btn" @click="handleCancel('formRef')"
						>取消</el-button
					>
				</div>
			</div>-->
			<actionBar>
				<el-button :loading="submitLoading" type="primary" @click="handleSave('formRef')">确认修改</el-button>
				<el-button class="cacel-btn" @click="handleCancel('formRef')">取消</el-button>
			</actionBar>
		</el-form>
	</div>
</template>
<script>
import { ORDER_SOURCE, ORDER_MARK, AUDITSTATUS, ORDER_STATUS } from './config';
import qs from 'querystring';
import { formatDate } from 'util/formValidation';

export default {
	name: 'updateCharging',
	data() {
		return {
			//记录还没修改时押货数量
			startNum: 0,
			ruleForm: {
				orderRemarks: '', // 备注
			},
			rules: {},
			detailList: [], // 押货单详情列表
			detailInfo: {}, // 详情信息
			ableAmount: '', // 押货可用余额
			orderId: '', // 押货单id
			showAddBtn: true, // 默认同月
			isBatchCancel: false, // 是否点击批量取消按钮(0正常修改 1批量取消)
			submitLoading: false,
			productDtoList: [], // 店铺库存校验
		};
	},
	filters: {
		// 押货单状态
		orderStatus(val) {
			return val in ORDER_STATUS ? ORDER_STATUS[val] : '';
		},
		// 格式时间
		format(val) {
			if (!val) return;
			return formatDate(val);
		},
		// 押货单来源
		orderSource(val) {
			return val in ORDER_SOURCE ? ORDER_SOURCE[val] : '';
		},
		// 押货标识
		orderMark(val) {
			return val in ORDER_MARK ? ORDER_MARK[val] : '';
		},
		// 审核状态
		auditStatus(val) {
			return val in AUDITSTATUS ? AUDITSTATUS[val] : '';
		},
	},
	computed: {
		// 当前押货合计
		pledgeTotal() {
			let total = 0;
			this.detailList.map(item => {
				total += item.productMortgagePrice * item.productNum;
			});
			// .reduce((acc, cur) => parseFloat(cur) + acc, 0);
			return total.toFixed(2);
		},
	},
	methods: {
		// 控制押货数量最大值
		max(val) {
			if (val === null || val === undefined || val === '') {
				return 99999;
			}
			return +val;
		},
		productNumChange(info, index) {
			let reg = /^([0]|[1-9][0-9]*)$/;
			if (info.maxProductNum < info.productDeliveredNum || !reg.test(info.productNum)) {
				this.$set(this.detailList[index], 'productNum', info.productDeliveredNum);
			}
		},
		// 控制添加产品按钮
		isShowButton(val) {
			let result = this.isSameYearMonth(val) ? !this.detailInfo.orderVo.editFlag : false;
			this.showAddBtn = result;
		},
		// 判断是否同年同月
		isSameYearMonth(old) {
			let d = new Date(old);
			let d2 = new Date();
			let Y = d.getFullYear();
			let Y2 = d2.getFullYear();
			let M = d.getMonth() + 1;
			let M2 = d2.getMonth() + 1;
			return Y === Y2 && M === M2;
		},
		// 查询产品信息
		searchProduct(row) {
			console.log(row);
			// 根据产品编码获取商品信息
			const params = {
				storeCode: this.detailInfo.orderVo.storeCode || '',
				productCode: row.productCode,
			};
			this.getProductInfo(params).then(res => {
				row.productCode = res.productCode;
				row.productName = res.productName;
				row.productPacking = res.productPacking;
				row.productUnit = res.productUnit;
				row.productBoxNum = res.productBoxNum || 0;
				row.productMortgagePrice = res.productMortgagePrice || 0;
				row.canMortgageNum = res.canMortgageNum;
				row.productNum = 1;
			});
		},
		// 添加产品
		addProduct() {
			let obj = {
				productCode: '', // 产品编码
				productName: '', // 产品名称
				productPacking: '', // 规格
				productUnit: '', // 单位
				productBoxNum: 0, // 装箱数量
				productMortgagePrice: 0, // 押货价
				canMortgageNum: 0, // 最高可押货量
				productNum: 1, // 押货数量
				productDeliveredNum: 0, // 已发货
				isadd: true, // 是否新增的产品标识
			};
			this.detailList.push(obj);
		},
		// 批量取消
		handleBatch() {
			this.isBatchCancel = true;
			this.detailList.forEach((item, index) => {
				// 删除添加的产品
				if (item.isadd) {
					this.detailList.splice(index, 1);
				}
				// 押货数量调整为等于发货数量
				item.productNum = item.productDeliveredNum;
			});
			this.handleSave('formRef');
		},

		// 确认修改
		handleSave(formName) {
			//修改时押货数量
			// let nowNum = 0;
			this.$refs[formName].validate(async valid => {
				if (valid) {
					this.getDetail({ orderId: this.orderId });
					const updateInvtMortgageOrderVO = Object.assign({ ...this.ruleForm });
					updateInvtMortgageOrderVO.id = this.orderId || '';
					let invtMortgageProductVOList = [];
					this.productDtoList = [];
					console.log(this.detailList);
					this.detailList.map(item => {
						if (item.id * 1 !== 0) {
							let goodsInfo = {
								productCode: item.productCode || '',
								id: item.id || 0,
								productNum: item.productNum || 0,
								productMortgagePrice: item.productMortgagePrice || 0,
							};
							invtMortgageProductVOList.push(goodsInfo);
						}
						// 库存判断
						if (item.maxProductNum - item.productNum !== 0) {
							this.productDtoList.push({
								productCode: item.productCode || '',
								productSecCode: item.productSecCode || '',
								productNum: item.maxProductNum - item.productNum,
							});
						}
					});
					const isBatchCancel = this.isBatchCancel ? 1 : 0;
					const params = {
						updateInvtMortgageOrderVO,
						invtMortgageProductVOList,
						isBatchCancel,
					};
					if (this.ableAmount < this.pledgeTotal && this.isBatchCancel != 1) {
						// if (this.startNum <= nowNum) {
						// 	this.$message({
						// 		type: 'error',
						// 		message: '提交失败，提示押货余额不足',
						// 	});
						// 	return false;
						// } else {
						await this.checkProductInventory(params);
						// await this.updateMortgageOrder(params);
						// }
					} else {
						await this.checkProductInventory(params);
						// await this.updateMortgageOrder(params);
					}
				}
			});
		},
		// 取消
		handleCancel(formName) {
			this.$refs[formName].resetFields();
			this.$closeSelf();
		},
		// 库存判断
		async checkProductInventory(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/inventory/order/checkProductInventory',
				data: { productDtoList: this.productDtoList, storeCode: this.detailInfo.orderVo.storeCode },
			});
			if (res && res.code === 200) {
				if (res.data && res.data.length !== 0) {
					let allCode = [],
						allNum = [];
					res.data.map(item => {
						allCode.push(item.productCode);
						allNum.push(item.productInventoryNum);
					});
					let cont = `${this.detailInfo.orderVo.storeCode}服务中心 ${allCode.join(
						'、'
					)} 等商品当前库存数量分别为：${allNum.join('、')}，目前退货数量已超出当前库存，原则上不予${
						this.showAddBtn ? '退货' : '欠货停发'
					}。请确认是否继续执行？`;
					this.$confirm(cont, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					})
						.then(() => {
							this.updateMortgageOrder(params);
						})
						.catch(() => {
							this.$message({
								type: 'info',
								message: '已取消操作',
							});
						});
				} else {
					await this.updateMortgageOrder(params);
				}
			}
			if (res && res.code == 0) {
				this.$message({
					type: 'error',
					message: res.message,
				});
				return false;
			}
		},
		// 修改接口
		async updateMortgageOrder(params) {
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/inventory/order/updateMortgageOrder',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				// this.$dispatch('UP_LIST');
				this.$closeSelf();
				this.$go('charging_detail', { title: '押货单详情', id: this.orderId, type: 'detail' });
			}
			if (res && res.code == 0) {
				this.$message({
					type: 'error',
					message: res.message,
				});
				return false;
			}
			this.submitLoading = false;
		},
		// 根据产品编码获取商品信息
		async getProductInfo(params) {
			const res = await this.$fetch(`/mgmt/inventory/order/productForAddPage?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { data } = res;
				return data;
			} else {
				return {};
			}
		},
		// 获取详情信息接口
		async getDetail(params) {
			const res = await this.$fetch(`/mgmt/inventory/order/getOrderDetail?${qs.stringify(params)}`);
			if (res) {
				this.detailInfo = res.data;
				this.detailList = res.data.productVoList || [];
				this.ruleForm.orderRemarks = this.detailInfo.orderVo.remarks || '';
				const params = {
					storeCode: (res.data && res.data.orderVo.storeCode) || '',
				};
				this.detailList.forEach(v => {
					v.maxProductNum = v.productNum;
				});
				this.startNum = this.detailList[0].productNum;
				// 获取押货余额
				this.getAvaiableAmount(params);
				// 控制添加产品按钮显示隐藏
				const oldDate = res.data.orderVo.createTime || '';
				this.isShowButton(oldDate);
			} else {
				this.detailInfo = {};
				this.detailList = [];
			}
		},
		// 获取押货可用余额接口
		async getAvaiableAmount(params) {
			const res = await this.$fetch(`/mgmt/inventory/mortgageAmount/getAvailableAmount?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { data } = res;
				this.ableAmount = data;
			} else {
				this.ableAmount = '';
			}
		},
	},
	created() {
		let orderId = this.$route.query.id || '';
		this.orderId = orderId;
		const params = {
			orderId,
		};
		this.getDetail(params);
	},
};
</script>
<style lang="scss" scoped>
::v-deep.update-charging {
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}
	// .el-card__header {
	// 	background-color: #eee;
	// }
	.header_title {
		display: inline-block;
		margin-left: 100px;
		font-size: 14px;
		.left_span {
			margin-right: 24px;
			span:nth-child(2) {
				margin-left: 12px;
			}
		}
		.right_span {
			span:nth-child(2) {
				margin-left: 12px;
			}
		}
	}
	.title {
		margin-bottom: 30px;
		font-weight: 500;
		color: rgba(48, 51, 54, 1);
	}
	.flex {
		display: flex;
		font-weight: 400;
		font-size: 14px;
		color: rgba(92, 98, 104, 1);
		.label {
			width: 180px;
			text-align: right;
		}
		.content {
			margin-left: 0px;
		}
	}
	.footer-box {
		display: flex;
		justify-content: space-between;
		margin: 24px 0;
		.first-box {
			display: flex;
			align-items: center;
			font-size: 14px;
			color: rgba(92, 98, 104, 1);
		}
		.first-box:nth-child(1) div {
			margin-right: 60px;
			span {
				margin-right: 16px;
			}
		}
	}
	.eidt-btn-footer {
		z-index: 1;
		background: #fff;
		padding: 16px 38px;
		box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.2);
		position: fixed;
		bottom: 0;
		left: 264px;
		right: 0;
		.eidt-btn-footer-box {
			text-align: center;
			.el-button--default {
				background: rgba(255, 255, 255, 1);
				border-radius: 4px;
				border: 1px solid rgba(211, 217, 226, 1);
				color: #303336;
				font-size: 14px;
			}
			.el-button--primary {
				background: rgba(56, 131, 248, 1);
				border-radius: 2px;
				color: #fff;
				font-size: 14px;
			}
			button {
				padding: 9px 16px;
			}
		}
	}
	.self-width {
		width: 500px;
	}
	.min-width {
		min-width: 1224px;
	}
	.mb-24 {
		margin-bottom: 24px;
	}
	.mb-8 {
		margin-bottom: 8px;
	}
	.cacel-btn {
		width: 90px;
	}
}
</style>
