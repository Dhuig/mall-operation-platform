<template>
	<div>
		<el-card class="box-card">使用规则：{{ pageData.useRange | useRange_filter }}</el-card>
		<el-card class="box-card" v-if="pageData.useRange == 1">
			<div class="all-content">全部产品都适用此优惠券</div>
		</el-card>
		<el-card class="box-card" v-if="pageData.useRange == 2 || pageData.useRange == 3">
			<searchPanel v-model="productStr" :config="PRODUCT_CONFIG" @search="productData" />
		</el-card>
		<el-card class="card-gap" v-if="pageData.useRange == 2 || pageData.useRange == 3">
			<tableList
				border
				:dataSource="product.data"
				:columns="PRODUCT_COLUMNS"
				:pagination="product.pagination"
				:dataTotal="product.total"
				:loading="product.loading"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="{ data }">
					<el-button v-permission="'coupon_management_delete'" type="text" @click="del(data)">删除</el-button>
				</template>
				<template slot="content_context">
					<div class="daochu">
						<span class="tableTitle">可用产品明细</span>
						<!-- <el-button class="btn-dc" type="primary" @click="productData(1)">导 出</el-button> -->
						<el-button
							class="activity-btn"
							type="primary"
							@click="isAdd('available')"
							v-permission="'coupon_management_detail_add'"
						>
							手动新增
						</el-button>
						<el-upload
							class="upload-demo"
							:on-error="onError"
							:action="`${url}/mgmt/prmt/coupon/importProduct`"
							:headers="$store.getters['system/getSignatureVerification']"
							name="file"
							:show-file-list="false"
							accept=".xls,.xlsx"
							:http-request="uploadClick"
						>
							<el-button class="activity-btn" type="primary" v-permission="'coupon_management_detail_import'">
								批量导入
							</el-button>
						</el-upload>
						<el-button class="activity-btn" type="text" @click="getExcel">下载模板</el-button>
					</div>
				</template>
			</tableList>
		</el-card>
		<el-card class="box-card card-gap" v-if="pageData.useRange == 4">
			<el-col style="width: 400px">
				<tableList border :dataSource="category" :columns="PRODUCT_TYPE_COLUMNS">
					<template slot="content_context">
						<div class="tableTitle">{{ pageData.useRange | tableTitle }}</div>
					</template>
				</tableList>
			</el-col>
		</el-card>
		<el-card class="box-card card-gap" v-if="pageData.useRange == 5">
			<tableList
				border
				:dataSource="activity.data"
				:columns="ACTIVITY_COLUMNS"
				:pagination="activity.pagination"
				:dataTotal="activity.total"
				:loading="activity.loading"
				@handleChangePage="activityhandleChangePage"
				@handleSizeChange="activityhandleSizeChange"
			>
				<template slot="content_context">
					<div class="daochu">
						<span class="tableTitle">{{ pageData.useRange | tableTitle }}</span>
						<!-- <el-button class="activity-btn" type="primary" @click="getActivityData(1)">批量导出</el-button> -->
						<el-upload
							class="upload-demo"
							:on-error="onError"
							:action="`${url}/mgmt/prmt/coupon/importProduct`"
							:headers="$store.getters['system/getSignatureVerification']"
							name="file"
							:show-file-list="false"
							accept=".xls,.xlsx"
							:http-request="uploadClick"
						>
							<!-- <el-button class="activity-btn" type="primary">批量导入</el-button> -->
						</el-upload>
					</div>
				</template>
			</tableList>
		</el-card>

		<el-card class="card-gap">
			<div class="head-text">
				指定不适用产品
				<el-popover placement="right" title width="260" trigger="hover" content="">
					<div>指定了不适用，只要订单内有此产品，就不可以使用当前优惠券</div>
					<span slot="reference" class="detail el-icon-warning-outline"></span>
				</el-popover>
			</div>
			<div class="dr">
				<span class="dr-btns">
					<el-upload
						v-permission="'coupon_management_detail_import_not_product_btn'"
						class="upload-demo"
						:on-error="onError"
						name="file"
						:action="`${url}/mgmt/prmt/coupon/importProduct`"
						:headers="$store.getters['system/getSignatureVerification']"
						:show-file-list="false"
						accept=".xls,.xlsx"
						:http-request="uploadClickNot"
					>
						<el-button class="activity-btn" type="primary">批量导入</el-button>
					</el-upload>
					<el-button
						class="activity-btn"
						v-permission="'coupon_management_detail_not_product_add_btn'"
						type="primary"
						@click="isAdd('unavailable')"
					>
						手动新增
					</el-button>
					<el-button class="activity-btn" type="text" @click="getExcel">下载模板</el-button>
				</span>
			</div>
			<div class="table_list_fix">
				<tableList border :dataSource="notProduct" :options="setUp" :columns="NOT_PRODUCT_COLUMNS" slotcontent>
					<template slot-scope="{ data }">
						<el-button v-permission="'coupon_management_delete'" type="text" @click="detail(data)">删除</el-button>
					</template>
				</tableList>
			</div>
		</el-card>
		<el-dialog
			:title="`手动新增${type === 'available' ? '' : '不'}可用优惠券产品`"
			v-drag
			:visible.sync="dialogVisible"
			width="50%"
			:before-close="handleClose"
		>
			<div class="search-div">
				<div class="title-class">手动新增后，该产品将加入优惠券{{ type === 'available' ? '' : '不' }}可用列表。</div>
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
							<span>{{ productDetail.serialNo }}</span>
						</el-form-item>
						<el-form-item label="产品名称：">
							<span>{{ productDetail.productName }}</span>
						</el-form-item>
						<el-form-item label="零售价：">
							<span>{{ productDetail.retailPrice }}</span>
						</el-form-item>
						<el-form-item label="产品PV：">
							<span>{{ productDetail.productPv }}</span>
						</el-form-item>
					</el-form>
					<div class="nothing" v-else>
						<p class="el-icon-document icon-file"></p>
						<p class="file-text">搜索不到对应的产品</p>
					</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="add">添 加</el-button>
			</span>
		</el-dialog>

		<el-dialog title="导入结果" v-drag :visible.sync="importVisible" width="30%">
			<div class="import-class">
				<div class="import-div">成功导入{{ importData.trueCount }}条数据，失败{{ importData.falseCount }}条</div>
				<div class="import-div dowload-data-file" v-if="this.importData.key" @click="dowloadFileList">下载失败列表</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="importVisible = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import axios from 'axios';
import {
	DATA_STATUS_BTN_USE_RANGE,
	PRODUCT_CONFIG,
	PRODUCT_COLUMNS,
	DATA_STATUS_TABLE_TITLE,
	ACTIVITY_COLUMNS,
	PRODUCT_TYPE_COLUMNS,
	NOT_PRODUCT_COLUMNS,
} from '../config';
import qs from 'querystring';
import { exportExcel } from 'util';
export default {
	props: {
		pageData: {
			type: Object,
			default: () => {},
		},
	},
	name: 'couponProduct',
	data() {
		return {
			setUp: {
				index: true,
				labelIndex: '序号',
			},
			NOT_PRODUCT_COLUMNS,
			PRODUCT_COLUMNS,
			PRODUCT_CONFIG,
			ACTIVITY_COLUMNS,
			PRODUCT_TYPE_COLUMNS,
			product: {
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				loading: false,
				total: 0,
			},
			productStr: {
				product: null,
			},
			activity: {
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				loading: false,
			},
			category: [],
			type: null,
			importVisible: false,
			importData: {},
			productDetail: {},
			temporary: [],
			cardNo: '',
			url: axios.defaults.baseURL,
			dialogVisible: false,
			notProduct: [],
		};
	},
	filters: {
		useRange_filter: val => DATA_STATUS_BTN_USE_RANGE[val],
		tableTitle: val => DATA_STATUS_TABLE_TITLE[val],
	},
	methods: {
		confirmHandle(callback) {
			this.$confirm('确定删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				callback && callback();
			});
		},
		del({ id }) {
			this.confirmHandle(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: `/mgmt/prmt/coupon/deleteCouponProduct`,
					data: { id },
				});
				if (res && res.code == 200) {
					this.productData();
					this.$message.success(res.message);
				}
			});
		},
		detail({ id }) {
			this.confirmHandle(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: `/mgmt/prmt/coupon/deleteCouponProductDisable`,
					data: { id },
				});
				if (res && res.code == 200) {
					this.$message.success(res.message);
					this.getSelectProductPageData();
				}
			});
		},
		isAdd(available) {
			this.type = available;
			this.dialogVisible = true;
		},
		onError() {
			this.$message.error('导入失败');
		},
		uploadClick(file) {
			this.uploadRequst(file, 1);
		},
		uploadClickNot(file) {
			this.uploadRequst(file, 2);
		},
		uploadRequst(file, type) {
			if (type === 1) {
				this.getCouponUseRange(serialNos => {
					this.uploadRequstCallBack(file, type, serialNos);
				});
			} else {
				this.selectProductPage(serialNos => {
					this.uploadRequstCallBack(file, type, serialNos);
				});
			}
		},
		async uploadRequstCallBack(file, type, serialNos) {
			let formData = new FormData();
			formData.append('file', file.file);
			formData.append('couponId', this.pageData.id);
			formData.append('serialNos', serialNos);
			formData.append('type', type);
			let res = await this.$fetch({
				method: 'POST',
				url: `${this.url}/mgmt/prmt/coupon/importProductDetail`,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				data: formData,
			});
			if (res && res.code === 200) {
				this.importData = res.data;
				this.importVisible = true;
				if (type === 1) {
					this.productData();
				} else {
					this.getSelectProductPageData();
				}
			}
		},
		getExcel() {
			exportExcel(`/mgmt/prmt/coupon/exportProductTemplate`);
		},
		handleSearch() {
			if (this.type === 'available') {
				this.yseGetProduct(this.cardNo);
			} else {
				this.notGetProduct(this.cardNo);
			}
		},
		async getCouponUseRange(callback) {
			let serialNos = '';
			let params = { pageNum: 1, pageSize: 999999999, couponId: this.pageData.id };
			const res = await this.$fetch(`/mgmt/prmt/coupon/getCouponUseRange?${qs.stringify(params)}`);
			if (res && res.code == 200) {
				serialNos = res.data.list.map(e => e.serialNo).join(',');
			}
			callback && callback(serialNos, res);
		},
		async selectProductPage(callback) {
			let serialNos = '';
			let params = { pageNum: 1, pageSize: 999999999, couponId: this.pageData.id };
			const res = await this.$fetch(`/mgmt/prmt/coupon/selectProductPage?${qs.stringify(params)}`);
			if (res && res.code == 200) {
				serialNos = res.data.list.map(e => e.serialNo);
			}
			callback && callback(serialNos, res);
		},
		yseGetProduct(couponNumber) {
			this.getCouponUseRange(async serialNos => {
				const resdata = await this.$fetch(
					`/mgmt/prmt/coupon/selectProduct?serialNo=${couponNumber}&serialNos=${serialNos}&type=1`
				);
				this.resetProductDetail(resdata);
			});
		},
		notGetProduct(couponNumber) {
			this.selectProductPage(async serialNos => {
				const resdata = await this.$fetch(
					`/mgmt/prmt/coupon/selectProduct?serialNo=${couponNumber}&serialNos=${serialNos}&type=2`
				);
				this.resetProductDetail(resdata);
			});
		},
		resetProductDetail(res) {
			if (res && res.code == 200) {
				this.productDetail = res.data;
				this.temporary = [res.data];
			} else {
				this.productDetail = {};
				this.temporary = [];
				this.cardNo = '';
			}
		},
		handleClose() {
			this.dialogVisible = false;
			this.productDetail = {};
			this.temporary = [];
			this.cardNo = '';
		},
		async add() {
			if (this.temporary.length == 0) return this.$message.warning('请搜索数据！');
			if (this.type === 'available') {
				const res = await this.$fetch({
					method: 'POST',
					url: `/mgmt/prmt/coupon/addCouponProduct`,
					data: { couponId: this.pageData.id, serialNo: this.productDetail.serialNo },
				});
				if (res && res.code == 200) {
					this.$message.success('添加成功');
					this.productData();
				}
			} else {
				const res = await this.$fetch({
					method: 'POST',
					url: `/mgmt/prmt/coupon/addCouponProductDisable`,
					data: { couponId: this.pageData.id, serialNo: this.productDetail.serialNo },
				});
				if (res && res.code == 200) {
					this.$message.success('添加成功');
					this.getSelectProductPageData();
				}
			}
		},
		dowloadFileList() {
			exportExcel('/mgmt/prmt/coupon/getImportErrorDataList', { key: this.importData.key });
		},
		async productData(status) {
			let { currentPage, pageSize } = this.product.pagination;
			let { product } = this.productStr;
			let params = { pageNum: currentPage, pageSize, product, couponId: this.pageData.id };
			if (status == 1) {
				exportExcel(`/mgmt/prmt/coupon/exportProductList`, { product, couponId: this.pageData.id });
				return;
			}
			const res = await this.$fetch(`/mgmt/prmt/coupon/getCouponUseRange?${qs.stringify(params)}`);
			if (res && res.code == 200) {
				this.product.data = res.data.list;
				this.product.total = res.data.total;
			}
		},
		handleChangePage(val) {
			this.product.pagination.currentPage = val;
			this.productData();
		},
		handleSizeChange(val) {
			this.product.pagination.pageSize = val;
			this.productData();
		},
		getSelectProductPageData() {
			this.selectProductPage((serialNos, res) => {
				if (res && res.code === 200) {
					this.notProduct = res.data.list;
				}
			});
		},
		activityhandleSizeChange(val) {
			this.activity.pagination.pageSize = val;
			this.getActivityData();
		},
		activityhandleChangePage(val) {
			this.activity.pagination.currentPage = val;
			this.getActivityData();
		},
		async getproductType() {
			const res = await this.$fetch(`/mgmt/prmt/coupon/selectCategoryList?couponId=${this.pageData.id}`);
			if (res && res.code == 200) {
				this.category = res.data;
			}
		},
		async getActivityData(status) {
			let {
				pagination: { currentPage: pageNum, pageSize },
			} = this.activity;
			if (status) {
				exportExcel('/mgmt/prmt/coupon/exportPromotionList', { pageNum, pageSize, couponId: this.pageData.id });
				return;
			}
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/prmt/coupon/getPromotionListPage`,
				params: { couponId: this.pageData.id, pageNum, pageSize },
			});
			if (res && res.code == 200) {
				this.activity.data = res.data.list;
				this.activity.total = res.data.total;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.all-content {
	height: 200px;
	line-height: 200px;
	text-align: center;
	font-size: 20px;
	color: $color-disabled;
}
.daochu {
	height: 32px;
	padding: 0 0 15px 0;
	.btn-dc {
		float: right;
		margin-right: 10px;
	}
	.tableTitle {
		font-size: 18px;
		font-weight: bold;
		line-height: 32px;
	}
}
.search-div {
	padding-bottom: 20px;
	.title-class {
		padding-bottom: 10px;
	}
}
.product-class {
	height: 230px;
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

.import-class {
	padding: 0 20px;
	font-size: 16px;
	.import-div {
		line-height: 30px;
	}
	.del-text {
		color: $color-disabled;
		font-size: 14px;
	}
	.del-top-text {
		font-size: 16px;
	}
}
.dowload-data-file {
	color: $color-link;
	cursor: pointer;
}

.head-text {
	font-size: 18px;
	font-weight: 600;
	float: left;
	padding: 0 0 20px 30px;
}

.dr {
	padding: 10px 0;
	overflow: hidden;
	.dr-btns {
		float: right;
	}
}

.upload-demo {
	float: right;
}

.activity-btn {
	float: right;
	margin-right: 10px;
}
</style>
