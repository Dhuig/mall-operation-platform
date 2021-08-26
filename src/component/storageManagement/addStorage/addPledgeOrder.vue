<template>
	<div class="add-pledge-order">
		<guideBar />
		<el-form :inline="true" ref="formRef" label-width="180px" :model="pledgeForm" :rules="pledgeRules" label-suffix=":">
			<el-card>
				<div slot="header" class="clearfix">
					<span>基本信息</span>
				</div>
				<el-row class="min-width">
					<el-col :span="8">
						<el-form-item label="服务中心编号" prop="storeCode" class="input-fix">
							<el-input
								placeholder="请输入服务中心编号"
								v-model="pledgeForm.storeCode"
								@blur.prevent="search"
								size="small"
								clearable
							>
								<el-button slot="append" @click="search">搜索</el-button>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="服务中心名称" v-if="showStoreInfo">
							<span>{{ storeInfo && storeInfo.name }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="负责人卡号" v-if="showStoreInfo">
							<span>{{ storeInfo && storeInfo.shopkeeperId }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width" v-if="showStoreInfo">
					<el-col :span="8">
						<el-form-item label="押货标识" prop="isDelivery">
							<el-checkbox v-model="pledgeForm.isDelivery">仅调账不发货</el-checkbox>
						</el-form-item>
					</el-col>
					<el-col :span="16">
						<el-form-item label="备注" prop="remarks">
							<el-input
								placeholder="请输入备注"
								v-model="pledgeForm.remarks"
								size="medium"
								type="textarea"
								class="self-width"
								:rows="2"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-card>
			<el-card v-if="showStoreInfo">
				<div slot="header" class="clearfix">
					<span>押货单详情</span>
					<div class="header_title">
						<span class="left_span">
							<span>可用押货余额:</span>
							<span>{{ ableAmount || 0 }}</span>
						</span>
						<span class="right_span">
							<span>当前押货合计:</span>
							<span>{{ pledgeTotal || 0 }}</span>
						</span>
					</div>
				</div>
				<el-table :data="detailList" style="width: 100%;" border>
					<el-table-column label="序号" width="80px" type="index" />
					<el-table-column label="产品编码" width="180">
						<template slot-scope="scope">
							<el-autocomplete
								v-model="detailList[scope.$index].productCode"
								:fetch-suggestions="querySearchAsync"
								placeholder="请输入产品编码"
								:trigger-on-focus="false"
								:select-when-unmatched="false"
								@select="searchProduct(scope.row)"
								@blur="searchProduct(scope.row)"
								@keyup.enter.native="searchProduct(scope.row)"
								clearable
							/>
						</template>
					</el-table-column>
					<el-table-column prop="productName" label="产品名称" />
					<el-table-column prop="productPacking" label="规格" />
					<el-table-column prop="productUnit" label="单位" />
					<el-table-column prop="productBoxNum" label="装箱数量" />
					<el-table-column prop="productMortgagePrice" label="押货价" />
					<el-table-column prop="canMortgageNum" label="最高可押货量" />
					<el-table-column prop="productNum" label="押货数量">
						<template slot-scope="scope">
							<el-input-number
								style="width: 100%;"
								size="small"
								:min="1"
								:max="999999"
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
				<el-row type="flex" justify="start" class="row-gap">
					<el-button
						type="primary"
						v-permission="'add_pledge_order_inquiry_and_import'"
						@click="searchOrIntroduce"
						icon="el-icon-search"
					>
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
			<actionBar>
				<el-button
					type="primary"
					plain
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
				<el-table-column type="selection" width="55"></el-table-column>
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
				<el-button class="ml-16 cacel-btn" @click="cacelOrder">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import qs from 'querystring';

export default {
	name: 'addPledgeOrder',
	data() {
		return {
			//下拉联想数据
			restaurants: [],
			timeout: null,

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
			productList: [],
			showStoreInfo: false, // 显示服务中心内容
			storeInfo: {}, // 服务中心信息
			ableAmount: '', // 押货可用余额
			checkProductList: [], // 勾选的产品列表
			loading: false,
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
		// 获取联想数据
		async querySearchAsync(queryString, cb) {
			if (queryString == '') {
				return;
			}
			this.loading = true;
			const res = await this.$fetch(`/mgmt/inventory/common/getAllProductCodes?productCode=${queryString}`);
			if (res && res.code === 200) {
				const { data } = res;
				this.restaurants = data;
			}
			let restaurants = this.restaurants;
			let results = restaurants.map(item => ({ value: item }));
			results = queryString ? results.filter(this.createStateFilter(queryString)) : results;
			cb(results);
		},
		createStateFilter(queryString) {
			return state => {
				return state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
			};
		},
		// 添加产品
		addProduct() {
			const obj = {
				productCode: '', // 产品编码
				productName: '', // 产品名称
				productPacking: '', // 规格
				productUnit: '', // 单位
				productBoxNum: 0, // 装箱数量
				productMortgagePrice: 0, // 押货价
				canMortgageNum: 0, // 最高可押货量
				productNum: 1, // 押货数量
			};
			this.detailList.push(obj);
		},
		// 表格操作
		deleteRow(index) {
			this.detailList.splice(index, 1);
		},
		// 查询产品信息
		searchProduct(row) {
			if (!row.productCode) return this.$message.warning('产品编码不能为空');
			// 根据产品编码获取商品信息
			const params = {
				storeCode: this.pledgeForm.storeCode,
				productCode: row.productCode,
			};
			this.getProductInfo(params).then(res => {
				row.productCode = res.productCode;
				row.productName = res.productName;
				row.productPacking = res.productPacking;
				row.productUnit = res.productUnit;
				row.productBoxNum = res.productBoxNum || 0;
				row.productMortgagePrice = res.productMortgagePrice || 0;
				row.canMortgageNum = res.canMortgageNum || '';
				row.productNum = 1;
			});
		},
		// 查询库存
		searchOrIntroduce() {
			this.show = true;
			//获取服务中心全部库存信息
			const params = {
				storeCode: this.pledgeForm.storeCode,
			};
			this.getProducts(params);
		},
		// 勾选库存
		handleSelection(val) {
			this.checkProductList = val;
		},
		// 添加至押货清单
		addOrder() {
			this.show = false;

			this.checkProductList.forEach(item => {
				delete item.productInventoryNum;
				// item.productNum = 1;
				this.$set(item, 'productNum', 1);
				// this.searchProduct(item);
			});
			this.detailList.push(...this.checkProductList);
		},
		// 取消
		cacelOrder() {
			this.show = false;
		},
		// 搜索事件
		search() {
			const {
				pledgeForm: { storeCode },
			} = this;
			if (!storeCode) return this.$message.warning('请输入服务中心编号后再作查询');

			const params = { storeCode };
			this.getStoreInfo(params);
			// 根据storeCode查询押货可用余额
			this.getAvaiableAmount(params);
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
		// 获取服务中心信息接口
		async getStoreInfo(params) {
			const res = await this.$fetch(`/mgmt/inventory/common/getStoreInfo?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { data } = res;
				this.storeInfo = data;
				this.showStoreInfo = true;
			} else {
				this.storeInfo = {};
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
		// 获取服务中心全部库存信息接口
		async getProducts(params) {
			const res = await this.$fetch(`/mgmt/inventory/order/productsForAddPage?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { data } = res;
				this.productList = data;
			} else {
				this.productList = [];
			}
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
					message: '请输入产品编码',
				});
			} else {
				if (this.ableAmount >= this.pledgeTotal) {
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
						this.$closeSelf();
						// 去押货单列表页
						this.$go('charging_list');
						this.$dispatch('UP_LIST');
					}
					if (res && res.code == 0) {
						this.$message({
							type: 'error',
							message: res.message,
						});
						return false;
					}
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
}
</style>
