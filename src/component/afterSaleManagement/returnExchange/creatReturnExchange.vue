<template>
	<div class="updateUser">
		<breadCrumb />
		<div class="detailMessage">
			<el-card class="box-card">
				<h6 class="title">退货信息</h6>
				<div class="detailMessage-box line">
					<el-form
						ref="ruleForm"
						:rules="RETURN_EXCHANGE_CREAT_RULE"
						:model="ruleForm"
						label-width="128px"
						size="medium"
						style="width: 100%; margin: 0px;"
					>
						<div class="detailMessage-box line">
							<div class="dataBox">
								<el-row :gutter="24">
									<el-col :span="10">
										<el-form-item
											label="服务中心编号"
											prop="invtMortgageReturnOrderVO.storeCode"
											style="marginbottom: 24px;"
										>
											<el-input
												placeholder="服务中心编号"
												v-model.trim="ruleForm.invtMortgageReturnOrderVO.storeCode"
												@blur.prevent="getStoreSimpleInfo(ruleForm.invtMortgageReturnOrderVO.storeCode)"
												size="small"
												clearable
											>
												<el-button
													slot="append"
													icon="el-icon-search"
													@click="getStoreSimpleInfo(ruleForm.invtMortgageReturnOrderVO.storeCode)"
												/>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8" v-if="isServeice">
										<el-form-item label="服务中心名称" style="marginbottom: 24px;">
											<span>{{ baseInfo.name }}</span>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24" v-if="isServeice">
									<el-col :span="8">
										<el-form-item label="负责人卡号" style="marginbottom: 24px;">
											<span>{{ baseInfo.shopkeeperId }}</span>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="负责人姓名" style="marginbottom: 24px;">
											<span>{{ baseInfo.leaderName }}</span>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24" v-if="isServeice">
									<el-col :span="8">
										<el-form-item
											label="一级原因"
											prop="invtMortgageReturnOrderVO.reasonFirst"
											style="marginbottom: 24px;"
										>
											<el-select
												@change="changereasonFirst(ruleForm.invtMortgageReturnOrderVO.reasonFirst)"
												v-model="ruleForm.invtMortgageReturnOrderVO.reasonFirst"
												placeholder="请选择一级原因"
												style="width: 248px; height: 32px;"
											>
												<el-option
													v-for="option in reasonFirstOptions"
													:key="option.value"
													:label="option.label"
													:value="option.label"
												></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item
											label="一级原因备注说明 "
											prop="invtMortgageReturnOrderVO.reasonFirstRemarks"
											style="marginbottom: 24px;"
										>
											<el-input
												v-model="ruleForm.invtMortgageReturnOrderVO.reasonFirstRemarks"
												placeholder="请输入一级原因备注说明"
											></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24" v-if="isServeice">
									<el-col :span="8">
										<el-form-item
											label="二级原因"
											prop="invtMortgageReturnOrderVO.reasonSecond"
											style="marginbottom: 24px;"
										>
											<el-select
												v-model="ruleForm.invtMortgageReturnOrderVO.reasonSecond"
												placeholder="请选择二级原因"
												style="width: 248px; height: 32px;"
											>
												<el-option
													v-for="option in reasonSecondOptions"
													:key="option.value"
													:label="option.label"
													:value="option.label"
												></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item
											label="二级原因备注说明 "
											prop="invtMortgageReturnOrderVO.reasonSecondRemarks"
											style="marginbottom: 24px;"
										>
											<el-input
												v-model="ruleForm.invtMortgageReturnOrderVO.reasonSecondRemarks"
												placeholder="请输入二级原因备注说明"
											></el-input>
										</el-form-item>
									</el-col>
									<!-- <el-col :span="8">
										<el-form-item label="退货地址" style="marginbottom: 24px;">
											<el-input
												v-model="ruleForm.invtMortgageReturnOrderVO.returnAddress"
												placeholder="请输入退货地址"
											></el-input>
										</el-form-item>
									</el-col>-->
								</el-row>
							</div>
						</div>
					</el-form>
				</div>
			</el-card>
		</div>
		<div class="detailMessage" v-if="isServeice">
			<el-card class="box-card">
				<h6 class="title">
					退货详情
					<span>押货退货金额合计：{{ totalMortgagePrice }}</span>
					<span>零售价合计：{{ totalMount }}</span>
					<span>退货数量：{{ totalNum }}</span>
				</h6>
				<div class="detailMessage-box tableBox line">
					<el-table :data="ruleForm.invtMortgageReturnOrderProductVOList" border style="width: 100%;">
						<el-table-column type="index" width="50" label="序号"></el-table-column>
						<el-table-column prop="productCode" width="180" label="产品编号/定制品二级编码">
							<template slot-scope="scope">
								<el-input
									size="small"
									@blur="getProductInfo(scope.row, scope.$index)"
									v-model="scope.row.productCode"
									placeholder="请输入"
								></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="productName" label="产品名称"></el-table-column>
						<el-table-column prop="productPacking" label="规格"></el-table-column>
						<el-table-column prop="productUnit" label="单位"></el-table-column>
						<el-table-column prop="productMortgagePrice" label="押货价"></el-table-column>
						<el-table-column prop="productRetailPrice" label="零售价"></el-table-column>
						<el-table-column prop="currentStock" label="库存数量"></el-table-column>
						<el-table-column prop="productNum" width="180" label="退货数量">
							<template slot-scope="scope">
								<el-input-number size="mini" :min="1" :step="1" v-model="scope.row.productNum"></el-input-number>
							</template>
						</el-table-column>
						<el-table-column prop="productRemarks" width="180" label="备注">
							<template slot-scope="scope">
								<el-input size="small" v-model="scope.row.productRemarks" placeholder="请输入备注"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="address" label="操作">
							<template slot-scope="scope">
								<el-button type="text" @click="handleEdit(scope.$index)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="footer-box">
					<div class="first-box"></div>
					<div>
						<el-button type="primary" @click="addProduct(-1)">添加产品</el-button>
						<el-button type="primary" @click="searchOrIntroduce">查询并导入服务中心库存</el-button>
						<el-button type="primary" :loading="submitLoading" @click="submitForm('ruleForm')">提交</el-button>
					</div>
				</div>
			</el-card>
		</div>
		<!-- 弹窗 -->
		<el-dialog title="服务中心库存" :visible.sync="show" width="40%" v-drag>
			<div class="scrollY">
				<el-row class="mb-32">
					<el-col :span="12" class="flex">
						<div class="label">服务中心编号:</div>
						<div class="content ml-16">{{ ruleForm.invtMortgageReturnOrderVO.storeCode }}</div>
					</el-col>
					<el-col :span="12" class="flex">
						<div class="label">服务中心名称:</div>
						<div class="content ml-16">{{ baseInfo.name }}</div>
					</el-col>
				</el-row>
				<el-table :data="productList" style="width: 100%;" height="80%" border @selection-change="handleSelection">
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="productCode" label="产品编号"></el-table-column>
					<el-table-column prop="productName" label="产品名称"></el-table-column>
					<el-table-column prop="productInventoryNum" label="库存数量"></el-table-column>
				</el-table>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="addProductFrom">添加至押货清单</el-button>
					<el-button class="ml-16 cacel-btn" @click="resetDialog">取 消</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { RETURN_EXCHANGE_CREAT_RULE } from './config';
import qs from 'querystring';
export default {
	name: 'creatReturnExchange',
	data() {
		return {
			// totalMortgagePrice:0,
			// totalMount:0,
			// totalNum:0,
			reasonList: [],
			ruleForm: {
				invtMortgageReturnOrderProductVOList: [],
				invtMortgageReturnOrderVO: {
					orderMark: 0,
					reasonFirst: '',
					reasonFirstRemarks: '',
					reasonSecond: '',
					reasonSecondRemarks: '',
					returnAddress: '',
					storeCode: '',
				},
			},
			show: false,
			RETURN_EXCHANGE_CREAT_RULE,
			// 一级原因
			reasonFirstOptions: [],
			// 二级原因
			reasonSecondOptions: [],
			productList: [],
			baseInfo: {},
			selectList: [],
			isServeice: false,
			submitLoading: false,
			productDtoList: [], // 库存判断
		};
	},
	mounted() {
		this.getReason();
	},
	computed: {
		totalMortgagePrice() {
			let count = 0;
			for (let item of this.ruleForm.invtMortgageReturnOrderProductVOList) {
				count += item.productMortgagePrice * item.productNum;
			}
			return count;
		},
		totalMount() {
			let count = 0;
			for (let item of this.ruleForm.invtMortgageReturnOrderProductVOList) {
				count += item.productRetailPrice * item.productNum;
			}
			return count;
		},
		totalNum() {
			let count = 0;
			for (let item of this.ruleForm.invtMortgageReturnOrderProductVOList) {
				count += item.productNum;
			}
			return count;
		},
	},
	methods: {
		// 获取产品信息
		async getProductInfo(row, index) {
			const params = {
				storeCode: this.ruleForm.invtMortgageReturnOrderVO.storeCode,
				productCode: row.productCode,
			};
			const res = await this.$fetch(`/mgmt/inventory/returnOrder/getProductForAddPage?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { data } = res;
				let newRow = data;
				newRow.productCode = row.productCode;
				newRow.productName = data.productSecName || data.productName;
				newRow.productNum = data.currentStock;
				newRow.productRemarks = '';
				this.ruleForm.invtMortgageReturnOrderProductVOList.splice(index, 1, newRow);
			} else {
				this.$message({
					type: 'error',
					message: res.message,
				});
			}
		},
		// 库存导入当库存量<0时，禁用选择
		checkboxSelect(row) {
			let num = row.productInventoryNum;
			if (num > 0) {
				return true; // 不禁用
			} else {
				return false; // 禁用
			}
		},
		// 退货数量判断
		checkProductRealAmount(row) {
			let num = Number(row.productNum);
			let currentStock = Number(row.currentStock);
			if (num > currentStock) {
				num = currentStock;
			} else if (num < 0) {
				num = 0;
			}
			row.productNum = num;
		},
		// 添加产品
		addProduct(n) {
			let length = this.ruleForm.invtMortgageReturnOrderProductVOList.length;
			if (n == -1 || n == length - 1) {
				let obj = {
					productNum: 1,
					productCode: '',
					productName: '',
					specification: '',
					unit: '',
					depositPrice: 0,
					chargeableAmount: 0,
					quantityAmount: 0,
					productMortgagePrice: 0,
					productRetailPrice: 0,
				};
				this.ruleForm.invtMortgageReturnOrderProductVOList.push(obj);
			}
		},
		// 获取服务中心信息
		async getStoreSimpleInfo(storeCode) {
			const params = {
				storeCode,
			};
			const res = await this.$fetch(`/mgmt/inventory/common/getStoreInfo?${qs.stringify(params)}`);
			if (res.code != 200) {
				return this.$message({
					type: 'error',
					message: res.data.message,
				});
			}
			this.baseInfo = {
				...res.data,
			};
			this.isServeice = true;
			this.ruleForm.invtMortgageReturnOrderVO.returnAddress = res.data.address;
		},
		// 新增押货单页面:获取服务中心的全部库存信息
		async productsForAddPage(storeCode) {
			const params = {
				storeCode,
			};
			const res = await this.$fetch(`/mgmt/inventory/order/productsForAddPage?${qs.stringify(params)}`);
			this.productList = res.data;
		},
		// 获取各种原因
		async getReason() {
			let type = 3;
			const params = {
				type,
			};
			const res = await this.$fetch(`/mgmt/inventory/common/getReason?${qs.stringify(params)}`);
			let list = res.data;
			list.forEach(e => {
				let item = {
					value: e.id,
					label: e.returnReason,
				};
				this.reasonFirstOptions.push(item);
			});
			this.reasonList = res.data;
		},
		// 一级原因触发
		changereasonFirst(id) {
			this.reasonSecondOptions = [];
			this.reasonList.forEach(e => {
				if (e.returnReason == id) {
					e.reasonList.forEach(n => {
						let item = {
							value: n.id,
							label: n.returnReason,
						};
						this.reasonSecondOptions.push(item);
					});
				}
			});
		},
		// 添加至押货清单
		addProductFrom() {
			let arr = this.selectList.map(e => {
				return {
					...e,
					productCode: e.productSecCode || e.productCode,
					productName: e.productSecName || e.productName,
					currentStock: e.productInventoryNum,
					productNum: e.productInventoryNum,
					productRemarks: '',
				};
			});
			this.ruleForm.invtMortgageReturnOrderProductVOList = this.ruleForm.invtMortgageReturnOrderProductVOList.filter(
				e => !(e.productCode == '' && e.productNum == 0)
			);
			arr.map(e => {
				this.ruleForm.invtMortgageReturnOrderProductVOList.push(e);
			});
			this.show = false;
		},
		// 查询并导入服务中心库存
		searchOrIntroduce() {
			if (this.ruleForm.invtMortgageReturnOrderVO.storeCode) {
				this.show = true;
				this.productsForAddPage(this.ruleForm.invtMortgageReturnOrderVO.storeCode);
			} else {
				this.$message.error('请输入服务中心编号');
			}
		},
		// 弹框列表选择
		handleSelection(val) {
			this.selectList = val;
		},
		handleEdit(index) {
			this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.ruleForm.invtMortgageReturnOrderProductVOList.splice(index, 1);
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		resetDialog() {
			this.show = false;
		},
		// 后台申请添加押货退货单
		async addMortgageReturnOrder(params) {
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/inventory/returnOrder/addMortgageReturnOrder',
				data: params,
			});
			if (res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				// 更新列表页列表数据
				this.$dispatch('UP_LIST');
				// 关闭编辑/新增页面
				this.$closeSelf();
			} else {
				this.$message({
					type: 'error',
					message: res.message,
				});
			}
			this.submitLoading = false;
		},
		// 提交
		submitForm(formName) {
			// let list = this.ruleForm.invtMortgageReturnOrderProductVOList;
			// let isFinished = false;
			this.ruleForm.invtMortgageReturnOrderProductVOList = this.ruleForm.invtMortgageReturnOrderProductVOList.filter(
				e => !(e.productCode == '' && e.productNum == 0)
			);
			// this.ruleForm.invtMortgageReturnOrderProductVOList.map(e => {
			// 	if (e.productCode && e.productNum) {
			// 		isFinished = true;
			// 	} else {
			// 		isFinished = false;
			// 		this.$message.error('退货数量不能为0');
			// 	}
			// });
			// if (isFinished) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					let goodsInfo = this.ruleForm.invtMortgageReturnOrderProductVOList;
					this.productDtoList = [];
					goodsInfo.map(item => {
						this.productDtoList.push({
							productCode: item.productCode || '',
							productNum: item.productNum || 0,
							productSecCode: item.productSecCode || '',
						});
					});
					await this.checkProductInventory();
					// this.ruleForm.invtMortgageReturnOrderProductVOList = [];
				}
			});
			// }
		},
		// 库存判断
		async checkProductInventory() {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/inventory/order/checkProductInventory',
				data: { productDtoList: this.productDtoList, storeCode: this.ruleForm.invtMortgageReturnOrderVO.storeCode },
			});
			if (res && res.code === 200) {
				if (res.data && res.data.length !== 0) {
					let allCode = [],
						allNum = [];
					res.data.map(item => {
						allCode.push(item.productCode);
						allNum.push(item.productInventoryNum);
					});
					let cont = `${this.ruleForm.invtMortgageReturnOrderVO.storeCode}服务中心 ${allCode.join(
						'、'
					)} 等商品当前库存数量分别为：${allNum.join(
						'、'
					)}，目前退货数量已超出当前库存，原则上不予退货。请确认是否继续执行？`;
					this.$confirm(cont, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					})
						.then(() => {
							this.addMortgageReturnOrder(this.ruleForm);
						})
						.catch(() => {
							this.$message({
								type: 'info',
								message: '已取消操作',
							});
						});
				} else {
					this.addMortgageReturnOrder(this.ruleForm);
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
	},
};
</script>
<style lang="scss" scoped>
.updateUser {
	padding-top: 10px;
	.scrollY {
		height: 500px;
		// overflow-y: scroll;
	}
	.detailMessage {
		margin: 24px 0;
		.box-card {
			width: 100%;
			border-bottom: 1px solid #ececec;
			margin-bottom: 24px;
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
			.title {
				font-size: 16px;
				width: 100%;
				padding-bottom: 12px;
				border-bottom: 1px solid #ececec;
				display: inline-block;
				span {
					color: #ff0000;
					font-size: 12px;
					margin-left: 15px;
				}
			}
			.detailMessage-box {
				padding: 24px 0;
				width: 100%;
				overflow: hidden;
			}
			.line {
				/* border-bottom: 1px solid #ececec; */
			}
		}
		.flex {
			display: flex;
			font-weight: 400;
			font-size: 14px;
			color: rgba(92, 98, 104, 1);
			.label {
				width: 100px;
				text-align: left;
			}
			.content {
				margin-left: 0px;
			}
		}
		.dialog-footer {
			display: flex;
			justify-content: center;
			margin-top: 16px;
		}
		.min-width {
			min-width: 1224px;
		}
		.mb {
			margin-bottom: 24px;
		}
		.self-width {
			width: 500px;
		}
		.mb-32 {
			margin-bottom: 32px;
		}
		.ml-16 {
			margin-left: 16px !important;
		}
		.cacel-btn {
			width: 132px;
		}
	}
	.flex {
		display: flex;
		font-weight: 400;
		font-size: 14px;
		color: rgba(92, 98, 104, 1);
		.label {
			width: 100px;
			text-align: left;
		}
		.content {
			margin-left: 0px;
		}
	}
	.dialog-footer {
		display: flex;
		justify-content: center;
		margin-top: 16px;
	}
	.min-width {
		min-width: 1224px;
	}
	.mb {
		margin-bottom: 24px;
	}
	.self-width {
		width: 500px;
	}
	.mb-32 {
		margin-bottom: 32px;
	}
	.ml-16 {
		margin-left: 16px !important;
	}
	.cacel-btn {
		width: 132px;
	}
	.tableBox {
		.el-input__inner {
			width: 130px !important;
			height: 28px !important;
		}
	}
}
</style>
