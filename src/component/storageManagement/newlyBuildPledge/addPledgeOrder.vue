<template>
	<div class="add-pledge-order">
		<guideBar />
		<el-form :inline="true" ref="formRef" label-width="120px" :model="pledgeForm" :rules="pledgeRules" label-suffix=":">
			<el-card>
				<div slot="header" class="clearfix">
					<span>基本信息</span>
				</div>
				<el-row class="min-width">
					<el-col :span="8">
						<el-form-item label="服务中心编号" prop="storeCode" class="input-fix">
							<el-input placeholder="请输入服务中心编号" v-model="pledgeForm.storeCode" size="small" clearable>
								<el-button class="service_btn" slot="append" @click="search">搜索</el-button>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="服务中心名称">
							<span>{{ storeInfo && storeInfo.name }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="负责人卡号">
							<span>{{ storeInfo && storeInfo.shopkeeperId }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="8">
						<el-form-item label="押货标识" prop="isDelivery">
							<el-checkbox v-model="pledgeForm.isDelivery">仅调账不发货</el-checkbox>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="备注" prop="remarks">
							<el-input
								placeholder="请输入备注"
								v-model="pledgeForm.remarks"
								size="medium"
								type="textarea"
								class="self-width"
								:rows="2"
								maxlength="100"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-card>
			<div class="cont_box">
				<!-- 产品列表 -->
				<el-card class="product_list">
					<p class="cont_title">产品列表</p>
					<el-input
						placeholder="请输入产品编码、产品名称"
						prefix-icon="el-icon-search"
						@blur="getGoodsList"
						v-model="keyword"
					></el-input>
					<tableList
						:maxHeight="500"
						:loading="loading"
						:dataSource="goodsList"
						:columns="PRODUCT_COLUMNS"
						:pagination="pagination"
						:options="optionsReviewed"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						@toggleRowSelection="toggleRowSelection"
						@handleSelectionChange="handleSelectionChange"
						:dataTotal="total"
					></tableList>
					<el-row type="flex" justify="start" class="row-gap">
						<el-button type="primary" v-permission="'add_pledge_order_inquiry_and_import'" @click="getProducts">
							查询并导入服务中心库存
						</el-button>
						<el-button
							type="success"
							v-permission="'add_pledge_order_products_add'"
							@click="addProduct"
							icon="el-icon-plus"
						>
							添加押货产品
						</el-button>
					</el-row>
				</el-card>
				<!-- 已选押货产品 -->
				<el-card>
					<p class="cont_title">已选押货产品</p>
					<el-table :data="detailList" style="width: 100%;" border>
						<el-table-column label="序号" width="80px" type="index" />
						<el-table-column prop="productCode" label="产品编码" min-width="80"></el-table-column>
						<el-table-column prop="productName" label="产品名称" min-width="140" />
						<el-table-column prop="productPacking" label="规格" min-width="120" />
						<el-table-column prop="productUnit" label="单位" min-width="60" />
						<el-table-column prop="productBoxNum" label="装箱数量" min-width="80" />
						<el-table-column prop="productMortgagePrice" label="押货价" min-width="80" />
						<el-table-column prop="productInventoryNum" label="当前库存" min-width="80" />
						<el-table-column prop="canMortgageNum" label="最高可押货量" min-width="120" />
						<el-table-column prop="productNum" label="押货数量" min-width="140">
							<template slot-scope="scope">
								<el-input-number
									style="width: 100%;"
									size="small"
									:min="1"
									:max="999999"
									@change="handleChange"
									v-model="detailList[scope.$index].productNum"
								/>
							</template>
						</el-table-column>
						<el-table-column prop="operation" label="操作" width="140">
							<template slot-scope="scope">
								<el-button type="text" @click="deleteRow(scope.$index)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="header_title">
						<span class="left_span">
							<span>已选产品种类:</span>
							<span>{{ detailList.length || 0 }}</span>
						</span>
						<span class="left_span">
							<span>押货数量:</span>
							<span>{{ allProductNum || 0 }}</span>
						</span>
						<span class="left_span">
							<span>可用押货余额:</span>
							<span>{{ ableAmount || 0 }}</span>
						</span>
						<span class="right_span">
							<span>当前押货合计:</span>
							<span>{{ pledgeTotal || 0 }}</span>
						</span>
					</div>
				</el-card>
			</div>

			<actionBar>
				<el-button
					type="primary"
					plain
					:loading="submitLoading"
					v-permission="'add_pledge_order_products_submit'"
					@click="handleSave('formRef')"
				>
					提交押货单
				</el-button>
			</actionBar>
		</el-form>
		<!-- 查询并导入服务中心库存模态框 -->
		<el-dialog title="查询并导入服务中心库存" :visible.sync="show" width="900px" v-drag>
			<el-row class="mb-32">
				<el-col :span="8" class="self-label">
					<div class="label">服务中心编号:</div>
					<div class="content ml-16">{{ storeInfo.code }}</div>
				</el-col>
				<el-col :span="8" class="self-label">
					<div class="label">服务中心名称:</div>
					<div class="content ml-16">{{ storeInfo.name }}</div>
				</el-col>
				<el-col :span="8" class="self-label">
					<div class="label">负责人卡号:</div>
					<div class="content ml-16">{{ storeInfo.shopkeeperId }}</div>
				</el-col>
			</el-row>
			<el-table :data="productList" height="350" border @selection-change="handleSelection">
				<el-table-column type="selection" :selectable="selectEnable" width="55"></el-table-column>
				<el-table-column prop="productCode" label="产品编码">
					<template slot-scope="scope">
						<span>{{ productList[scope.$index].productCode }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="productName" label="产品名称">
					<template slot-scope="scope">
						<span>{{ productList[scope.$index].productName }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="productInventoryNum" label="当前服务中心库存">
					<template slot-scope="scope">
						<span>{{ productList[scope.$index].productInventoryNum }}</span>
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addOrder">添加至押货清单</el-button>
				<el-button class="ml-16 cacel-btn" @click="show = false">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { PRODUCT_COLUMNS } from './config';
import qs from 'querystring';

export default {
	name: 'addPledgeOrder',
	data() {
		return {
			PRODUCT_COLUMNS,
			pledgeForm: {
				storeCode: '', // 服务中心编号
				isDelivery: false, // 押货标识: 调账(不发货)：true-0, 要发货：false-1
				remarks: '', // 备注
			},
			pledgeRules: {
				storeCode: [
					{ required: true, message: '请输入服务中心编号', trigger: 'blur' },
					{ pattern: /^([1-9][0-9]*)$/, message: '服务中心编号必须纯数字', trigger: 'change' },
				],
			},
			detailList: [], // 押货单详情列表
			show: false,
			productList: [], // 库存列表
			storeInfo: {}, // 服务中心信息
			ableAmount: '', // 押货可用余额
			checkProductList: [], // 勾选的产品列表
			loading: false,
			// data: [],
			goodsList: [], // 产品列表
			keyword: '', // 产品列表搜索条件
			pagination: {
				currentPage: 1,
				pageSize: 20,
			},
			total: 0,
			tableRef: '', // 继承表格组件的ref标识
			allProductNum: 0, // 押货数量
			optionsReviewed: {
				label: '全部',
				selection: true,
			},
			submitLoading: false,
		};
	},
	computed: {
		// 当前押货合计
		pledgeTotal() {
			let total = 0;
			this.detailList
				.map(item => (total += item.productMortgagePrice * item.productNum))
				.reduce((acc, cur) => parseFloat(cur) + acc, 0);
			return total.toFixed(2);
		},
	},
	methods: {
		// 产品分页
		handleChangePage(currentPage) {
			this.pagination.currentPage = currentPage;
			this.getGoodsList();
		},
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.getGoodsList();
		},
		// 产品初始化清空复选框勾选状态
		toggleRowSelection(that) {
			this.tableRef = that;
			return that.clearSelection();
		},
		// 产品复选框选中项
		handleSelectionChange(val) {
			this.checkProductList = [];
			val.forEach(v => {
				this.$set(v, 'productNum', 1);
				this.checkProductList.push(v);
			});
		},
		// 添加产品
		addProduct() {
			let index = 0;
			this.checkProductList.forEach(v => {
				index = this.detailList.findIndex(item => {
					return item.productCode === v.productCode;
				});
				if (index === -1) {
					this.detailList.push(v);
				}
			});
			this.handleChange();
		},
		// 产品押货数量变化
		handleChange() {
			let allProductNum = 0;
			this.detailList.forEach(v => {
				allProductNum += v.productNum;
			});
			this.allProductNum = allProductNum;
		},
		// 删除
		deleteRow(index) {
			this.detailList.splice(index, 1);
		},
		// 库存禁用部分勾选
		selectEnable(row) {
			if (row.customFlag === 0) {
				return true;
			}
		},
		// 勾选库存
		handleSelection(val) {
			this.checkProductList = [];
			val.forEach(v => {
				this.$set(v, 'currentStock', v.productInventoryNum);
				this.checkProductList.push(v);
			});
		},
		// 添加至押货清单
		addOrder() {
			let aa = [1, 3, [4, 5]];
			console.log(aa.flat(1));
			this.show = false;
			let index = 0;
			this.checkProductList.forEach(item => {
				index = this.detailList.findIndex(v => {
					return v.productCode === item.productCode;
				});
				if (index === -1) {
					delete item.productInventoryNum;
					this.$set(item, 'productNum', 1);
					this.detailList.push(item);
				}
			});
			this.handleChange(); // 押货数量
		},
		// 搜索服务中心号
		search() {
			const {
				pledgeForm: { storeCode },
			} = this;
			if (!storeCode) return this.$message.warning('请输入服务中心编号后再作查询');

			const params = { storeCode };
			this.getStoreInfo(params);
			// 根据storeCode查询押货可用余额
			this.getAvaiableAmount(params);
			// 查询产品信息
			this.getGoodsList();
		},
		// 提交押货单
		handleSave(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					if (!this.detailList.length > 0) {
						this.$message({
							type: 'error',
							message: '请添加押货产品',
						});
					} else {
						// 根据storeCode查询押货可用余额
						this.getAvaiableAmount({ storeCode: this.pledgeForm.storeCode });
						const invtMortgageOrderVO = Object.assign({ ...this.pledgeForm });
						invtMortgageOrderVO.isDelivery = invtMortgageOrderVO.isDelivery ? 0 : 1;
						const invtMortgageOrderProductVOList = this.detailList.map(item => {
							return {
								productCode: item.productCode || '',
								productMortgagePrice: item.productMortgagePrice || 0,
								productNum: item.productNum || 0,
							};
						});
						const params = {
							invtMortgageOrderVO,
							invtMortgageOrderProductVOList,
						};
						await this.addMortgageOrder(params);
					}
				}
			});
		},
		// 获取服务中心信息
		async getStoreInfo(params) {
			const res = await this.$fetch(`/mgmt/inventory/common/getStoreInfo?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { data } = res;
				this.storeInfo = data;
			} else {
				this.storeInfo = {};
			}
		},
		// 获取押货可用余额
		async getAvaiableAmount(params) {
			const res = await this.$fetch(`/mgmt/inventory/mortgageAmount/getAvailableAmount?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { data } = res;
				this.ableAmount = data;
			} else {
				this.ableAmount = '';
			}
		},
		// 获取服务中心全部库存信息-弹框
		async getProducts() {
			if (this.pledgeForm.storeCode === '') {
				this.$message.warning('请输入服务中心编号后再作查询');
				return;
			}
			this.show = true;
			const params = {
				storeCode: this.pledgeForm.storeCode,
			};
			const res = await this.$fetch(`/mgmt/inventory/order/productsForAddPage?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { data } = res;
				this.productList = data;
				this.$nextTick(() => {
					this.selectEnable();
				});
			} else {
				this.productList = [];
			}
		},
		// 获取产品列表
		async getGoodsList() {
			if (this.pledgeForm.storeCode === '') {
				this.$message.warning('请输入服务中心编号后再作查询');
				return;
			}
			let {
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			console.log(pageNum, pageSize);
			const params = {
				storeCode: this.pledgeForm.storeCode,
				keyword: this.keyword,
				pageSize,
				pageNum,
			};
			const res = await this.$fetch(`/mgmt/inventory/order/searchProductsForAddPage?${qs.stringify(params)}`);
			if (res && res.data) {
				const { list, total } = res.data;
				if (!list.length) {
					this.$message.warning('搜索无数据，请检查查询条件');
				}
				this.goodsList = list;
				this.total = total;
			} else {
				this.goodsList = [];
				this.total = 0;
				this.$message.warning('搜索无数据，请检查查询条件');
			}
		},
		// 后台新增押货单接口
		async addMortgageOrder(params) {
			let sendState = params.invtMortgageOrderProductVOList.every(item => {
				if (item.productCode === '') {
					return 0;
				}
				return 1;
			});
			if (!sendState) {
				this.$message({
					type: 'error',
					message: '请添加产品',
				});
			} else {
				if (this.ableAmount >= this.pledgeTotal) {
					this.submitLoading = true;
					const res = await this.$fetch({
						method: 'post',
						url: '/mgmt/inventory/order/addMortgageOrder',
						data: params,
					});
					if (res && res.code == 200) {
						this.$message({
							type: 'success',
							message: res.message,
						});
						// 置空
						this.detailList = [];
						this.keyword = '';
						this.allProductNum = 0;
						this.storeInfo = {};
						this.goodsList = []; // 产品列表
						this.checkProductList = []; // 勾选中的产品
						this.pledgeForm = {
							storeCode: '', // 服务中心编号
							isDelivery: false, // 押货标识: 调账(不发货)：true-0, 要发货：false-1
							orderRemarks: '', // 备注
						};
						this.pagination = {
							currentPage: 1,
							pageSize: 20,
						};
						this.total = 0;
						this.ableAmount = '';
					}
					if (res && res.code == 0) {
						this.$message({
							type: 'error',
							message: res.message,
						});
						return false;
					}
					this.submitLoading = false;
				} else {
					this.$message({
						type: 'error',
						message: '提交失败，提示押货余额不足',
					});
				}
			}
		},
	},
};
</script>
<style lang="scss" scoped>
::v-deep.add-pledge-order {
	.row-gap {
		margin-top: 16px;
	}
	.title {
		margin-bottom: 30px;
		font-weight: 500;
		color: rgba(48, 51, 54, 1);
	}
	.input-fix .el-form-item__content {
		margin-bottom: -10px;
	}
	.input-fix .service_btn {
		background-color: #3883f8;
		color: #fff;
		border: 1px solid #3883f8;
	}
	.header_title {
		display: inline-block;
		margin-left: 10px;
		font-size: 14px;
		margin-top: 10px;
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
	.self-label {
		display: flex;
		justify-content: center;
		font-weight: 400;
		font-size: 14px;
		color: rgba(92, 98, 104, 1);
	}
	.dialog-footer {
		display: flex;
		justify-content: center;
		margin-bottom: 16px;
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
	.cont_box {
		display: flex;
		justify-content: space-around;
		.product_list {
			min-width: 360px;
			margin-right: 20px;
		}
		.cont_title {
			padding-bottom: 10px;
		}
		.el-input__inner {
			height: 32px;
			line-height: 32px;
			margin-bottom: 10px;
		}
		.el-input__icon {
			line-height: 32px;
		}
	}
}
.product_list ::v-deep.pagination {
	width: 100%;
	overflow: auto;
	padding-bottom: 10px;
}
</style>
