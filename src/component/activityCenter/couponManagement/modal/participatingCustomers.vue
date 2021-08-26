<template>
	<div>
		<el-card class="card-gap">
			<div class="head-text">使用范围</div>
			<el-form :model="customer" :rules="rules" ref="ruleForm" label-width="140px">
				<el-form-item label="选择使用范围：" prop="useRange">
					<el-radio v-model="customer.useRange" :label="item.value" v-for="(item, index) in limit" :key="index">
						{{ item.label }}
					</el-radio>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="card-gap">
			<div class="all-content" v-if="customer.useRange == 1">所有产品都可以使用优惠券</div>
			<div v-if="customer.useRange == 2">
				<div class="head-text">可用产品明细</div>
				<div class="dr">
					<span class="dr-btns">
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
							<el-button class="top-btn-dr" type="primary">批量导入</el-button>
						</el-upload>
						<el-button type="text" @click="getExcel">下载模板</el-button>
						<el-button type="primary" @click="isAdd('available')">手动新增</el-button>
					</span>
				</div>
				<div class="table_list_fix">
					<tableList border :dataSource="serialNoAry" :options="setUp" :columns="SERIALNOARY_COLUMNS" slotcontent>
						<template slot-scope="{ $index }">
							<el-button v-permission="'coupon_management_delete'" type="text" @click="del($index)">删除</el-button>
						</template>
					</tableList>
				</div>
			</div>
			<div v-if="customer.useRange == 5">
				<div class="head-text">指定活动</div>
				<!-- <div class="dr">
					<span class="dr-btns">
						<el-upload
							class="upload-demo"
							:on-error="onError"
							:action="`${url}/mgmt/prmt/coupon/importPromotion`"
							name="file"
							:headers="{ Authorization: token }"
							:show-file-list="false"
							:on-success="saveNotActivity"
							accept=".xls,.xlsx"
						>
							<el-button class="top-btn-dr" type="primary">导入</el-button>
						</el-upload>
						<el-button type="primary" @click="getExcelActivity('save')">下载模板</el-button>
					</span>
				</div> -->
				<div class="table_list_fix">
					<el-table :data="promotionIds" border style="width: 100%" :loading="false">
						<el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="{ row, $index }">
								<div>
									<span class="btns" @click="addCode(row, $index)">添加</span>
									<span class="btns" @click="delCode(row, $index)" v-if="promotionIds.length !== 1">删除</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="promotionCode" label="活动编码" align="center">
							<template slot-scope="{ row, $index }">
								<div>
									<el-select
										v-model="row.promotionCode"
										filterable
										placeholder="输入活动编码"
										:remote-method="remoteMethodCode"
										:loading="optionsLoadingCode"
										reserve-keyword
										remote
										@change="selChangeCode($event, $index)"
										maxlength="40"
										show-word-limit
									>
										<el-option
											v-for="item in optionsCode"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										></el-option>
									</el-select>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="promotionName" label="活动名称" align="center">
							<template slot-scope="{ row, $index }">
								<div>
									<el-select
										v-model="row.promotionName"
										filterable
										placeholder="输入活动名称"
										:remote-method="productNameMethodCode"
										:loading="optionsLoadingCode"
										reserve-keyword
										remote
										@change="selChangeCode($event, $index)"
										maxlength="40"
										show-word-limit
									>
										<el-option
											v-for="item in productNameoptionsCode"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										></el-option>
									</el-select>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="startTime" label="活动开始时间" align="center"></el-table-column>
						<el-table-column prop="endTime" label="活动结束时间" align="center">
							<template slot-scope="{ row }">
								<div>
									{{ row.endTime || '不限制' }}
								</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
			<el-form :model="customer" :rules="rules" ref="ruleForm" label-width="140px" v-show="customer.useRange == 4">
				<el-form-item label="选择产品分类：">
					<el-checkbox-group v-model="customer.categoryIds">
						<el-checkbox :label="item.value" v-for="(item, index) in productType" :key="index">
							{{ item.label }}
						</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
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
					<!-- :action="`${url}/mgmt/prmt/coupon/importProduct`" -->
					<el-upload
						class="upload-demo"
						:on-error="onError"
						name="file"
						:action="`${url}/mgmt/prmt/coupon/importProduct`"
						:headers="$store.getters['system/getSignatureVerification']"
						:show-file-list="false"
						accept=".xls,.xlsx"
						:http-request="uploadClickNot"
					>
						<el-button class="top-btn-dr" type="primary">批量导入</el-button>
					</el-upload>
					<el-button type="text" @click="getExcel">下载模板</el-button>
					<el-button type="primary" @click="isAdd('unavailable')">手动新增</el-button>
				</span>
			</div>
			<div class="table_list_fix">
				<tableList border :dataSource="serialNoAryNot" :options="setUp" :columns="SERIALNOARY_COLUMNS" slotcontent>
					<template slot-scope="{ $index }">
						<el-button v-permission="'coupon_management_delete'" type="text" @click="detail($index)">删除</el-button>
					</template>
				</tableList>
			</div>
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
					<div class="import-div dowload-data-file" v-if="this.importData.key" @click="dowloadFileList">
						下载失败列表
					</div>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="importVisible = false">确 定</el-button>
				</span>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
import axios from 'axios';
import { PARTICIPATING_CUSTOMER_COLUMNS, SERIALNOARY_COLUMNS } from '../config.js';
import { exportExcel } from 'util';
export default {
	name: 'productConfiguration',
	props: {
		promotion: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	data() {
		return {
			customer: {
				categoryIds: [], //分类ID
				couponNumber: '',
				promotionIds: [],
				serialNos: [],
				disableSerialNos: [],
				useRange: 1,
			},
			setUp: {
				index: true,
				labelIndex: '序号',
			},
			SERIALNOARY_COLUMNS,
			importData: {},
			importVisible: false,
			type: null,
			product: {},
			cardNo: '',
			dialogVisible: false,
			dataSource: [],
			couponCountNum: 1,
			url: axios.defaults.baseURL,
			productType: [],
			serialNoAry: [],
			serialNoAryLs: [],
			temporary: [],
			options: [],
			productNameoptions: [],
			optionsLoading: false,
			serialNoAryNot: [],
			temporaryNot: [],
			optionsNot: [],
			productNameoptionsNot: [],
			optionsLoadingNot: false,
			promotionIds: [{ id: '', endTime: '', promotionCode: '', promotionName: '', startTime: '' }],
			optionsCode: [],
			productNameoptionsCode: [],
			optionsLoadingCode: false,
			limit: [
				{ value: 1, label: '全部产品' },
				{ value: 2, label: '指定产品' },
				// { value: 3, label: '指定不适用产品' },
				{ value: 4, label: '指定产品分类' },
				{ value: 5, label: '指定活动' },
			],
			PARTICIPATING_CUSTOMER_COLUMNS,
			rules: {
				useRange: [{ required: true, message: '请选择顾客限制', trigger: 'blur' }],
				memberIdentities: [{ required: true, message: '请选择顾客身份', trigger: 'blur' }],
				categoryIds: [{ required: true, message: '请选择顾客等级', trigger: 'blur' }],
			},
			isPush: false,
		};
	},
	computed: {
		token() {
			return this.$store.getters['user/getFullToken'];
		},
	},
	created() {
		let { serialNos, useRange, promotionIds, disableSerialNos } = this.promotion;
		this.serialNoAry = serialNos;
		this.disableSerialNos = disableSerialNos;
		this.customer.useRange = useRange;
		this.promotionIds =
			promotionIds.length > 0
				? promotionIds
				: [{ id: '', endTime: '', promotionCode: '', promotionName: '', startTime: '' }];
		this.identityData();
	},
	watch: {
		promotion: {
			handler(val) {
				let { serialNos, useRange, promotionIds, disableSerialNos } = val;
				this.customer = Object.assign(this.customer, val);
				this.serialNoAry = JSON.parse(JSON.stringify(serialNos));
				this.serialNoAryNot = JSON.parse(JSON.stringify(disableSerialNos));
				this.customer.useRange = useRange;
				this.promotionIds =
					promotionIds.length > 0
						? promotionIds
						: [{ id: '', endTime: '', promotionCode: '', promotionName: '', startTime: '' }];
			},
			deep: true,
			immediate: true,
		},
	},
	methods: {
		dowloadFileList() {
			exportExcel('/mgmt/prmt/coupon/getImportErrorDataList', { key: this.importData.key });
		},
		uploadClick(file) {
			this.uploadRequst(file, 1);
		},
		uploadClickNot(file) {
			this.uploadRequst(file, 2);
		},
		async uploadRequst(file, type) {
			let { id } = this.$route.query;
			let formData = new FormData();
			formData.append('file', file.file);
			formData.append('couponId', id ? id : '');
			formData.append(
				'serialNos',
				type === 1 ? this.serialNoAry.map(e => e.serialNo) : this.serialNoAryNot.map(e => e.serialNo)
			);
			formData.append('type', type);
			let res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/coupon/importProduct`,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				data: formData,
			});
			if (res && res.code === 200) {
				this.importData = res.data;
				this.importVisible = true;
				if (type === 1) {
					this.serialNoAry = this.serialNoAry.concat(res.data.list);
				} else {
					this.serialNoAryNot = this.serialNoAryNot.concat(res.data.list);
				}
			}
		},
		isAdd(available) {
			this.type = available;
			this.dialogVisible = true;
		},
		handleSearch() {
			this.getProduct(this.cardNo, this.type === 'available' ? 1 : 2);
		},
		async getProduct(couponNumber = '', type) {
			let serialNoAry = this.serialNoAry.map(e => e.serialNo).join(',');
			let serialNoAryNot = this.serialNoAryNot.map(e => e.serialNo).join(',');
			let serialNos = type === 1 ? serialNoAry : serialNoAryNot;
			const res = await this.$fetch(
				`/mgmt/prmt/coupon/selectProduct?serialNo=${couponNumber}&serialNos=${serialNos}&type=${type}`
			);
			if (res && res.code == 200) {
				this.product = res.data;
				this.temporary = [res.data];
			} else {
				this.product = {};
				this.temporary = [];
				this.cardNo = '';
			}
		},
		add() {
			if (this.temporary.length == 0) return this.$message.warning('请搜索数据！');
			if (this.type === 'available') {
				this.isPush = false;
				this.serialNoAry.forEach(el => {
					if (this.product.serialNo === el.serialNo) {
						this.isPush = true;
						this.$message.warning('请添加未添加过的产品');
					}
				});
				if (this.isPush) return;
				this.serialNoAry.push(this.product);
			} else {
				this.isPush = false;
				this.serialNoAryNot.forEach(el => {
					if (this.product.serialNo === el.serialNo) {
						this.isPush = true;
						this.$message.warning('请添加未添加过的产品');
					}
				});
				if (this.isPush) return;
				this.serialNoAryNot.push(this.product);
			}
			this.$message.success('添加成功');
		},
		handleClose() {
			this.dialogVisible = false;
			this.product = {};
			this.temporary = [];
			this.cardNo = '';
		},
		detail(index) {
			this.confirmHandle(() => {
				this.serialNoAryNot.splice(index, 1);
			});
		},
		confirmHandle(callback) {
			this.$confirm('确定删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				callback && callback();
			});
		},
		del(index) {
			this.confirmHandle(() => {
				this.serialNoAry.splice(index, 1);
			});
		},
		selChangeCode(e, row) {
			let { promotionIds } = this;
			this.isPush = false;
			promotionIds.forEach(el => {
				if (e === el.id) {
					this.isPush = true;
					this.$message.warning('请选择未添加过的活动');
				}
			});
			if (this.isPush) return;
			let aryItem = this.temporaryCode.filter(el => e === el.id)[0];
			this.promotionIds.splice(row, 1, aryItem);
		},
		delCode({ id }) {
			this.confirmHandle(() => {
				this.promotionIds = this.promotionIds.filter(e => e.id !== id);
			});
		},
		addCode() {
			this.promotionIds.push({
				appUrl: null,
				createTime: null,
				endTime: null,
				id: null,
				limitNumber: null,
				limitNumberString: null,
				promotionCode: null,
				promotionName: null,
				promotionState: null,
				promotionStateString: null,
				startTime: null,
				updateTime: null,
				webUrl: null,
			});
		},
		remoteMethodCode(query) {
			if (query !== '') {
				this.optionsLoadingCode = true;
				this.getProductCode(query, null);
			}
		},
		productNameMethodCode(query) {
			if (query !== '') {
				this.optionsLoadingCode = true;
				this.getProductCode(null, query);
			}
		},
		async getProductCode(promotionCode = null, promotionName = null) {
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/prmt/coupon/getPromotionByCodeOrName`,
				params: { promotionName, promotionCode },
			});
			if (res && res.code == 200) {
				let { data } = res;
				this.temporaryCode = data;
				if (promotionName) {
					this.productNameoptionsCode = data.map(({ id, promotionName }) => ({
						value: id,
						label: promotionName,
					}));
				} else {
					this.optionsCode = data.map(({ promotionCode, id }) => ({ value: id, label: promotionCode }));
				}
				this.optionsLoadingCode = false;
			}
		},
		async identityData() {
			const res = await this.$fetch(`/mgmt/prmt/coupon/getShowList`);
			if (res && res.code == 200) {
				this.productType = res.data.map(({ id, title }) => ({ value: id, label: title }));
			}
		},
		getExcel() {
			exportExcel(`/mgmt/prmt/coupon/exportProductTemplate`);
		},
		async save(res) {
			this.$message.success('导入成功');
			this.serialNoAry = res.data.concat(this.serialNoAry);
			let arr = new Set(
				this.serialNoAry.map(e => {
					if (e.serialNo !== '') {
						return e.serialNo;
					}
				})
			);
			let qc = [];
			arr.forEach(e => {
				for (let index = 0; index < this.serialNoAry.length; index++) {
					if (e && e === this.serialNoAry[index].serialNo) {
						qc.push(this.serialNoAry[index]);
						break;
					}
				}
			});
			this.serialNoAry = qc;
		},
		async saveNot() {
			// this.$message.success('导入成功');res
			// this.serialNoAryNot = res.data.concat(this.serialNoAryNot);
			// let arr = new Set(
			// 	this.serialNoAryNot.map(e => {
			// 		if (e.serialNo !== '') {
			// 			return e.serialNo;
			// 		}
			// 	})
			// );
			// let qc = [];
			// arr.forEach(e => {
			// 	for (let index = 0; index < this.serialNoAryNot.length; index++) {
			// 		if (e && e === this.serialNoAryNot[index].serialNo) {
			// 			qc.push(this.serialNoAryNot[index]);
			// 			break;
			// 		}
			// 	}
			// });
			// this.serialNoAryNot = qc;
		},
		saveNotActivity(res) {
			this.$message.success('导入成功');
			this.promotionIds = res.data.concat(this.promotionIds);
		},
		getExcelActivity() {
			exportExcel(`/mgmt/prmt/coupon/exportPromotionTemplate`);
		},
		onError() {
			this.$message.error('导入失败');
		},
		productEmit() {
			let parmas = Object.assign({}, this.customer);
			parmas.serialNos = this.serialNoAry.filter(e => !!e.serialNo);
			parmas.disableSerialNos = this.serialNoAryNot.filter(e => !!e.serialNo);
			parmas.promotionIds = this.promotionIds;
			this.$emit('productEmit', { ...parmas });
		},
	},
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/elementUi.scss';
.card-gap {
	margin-top: 10px;
	.form-width-protect {
		padding: 0 40px;
	}
	.upload-demo {
		margin-left: 20px;
		float: right;
	}
	.dr {
		padding: 10px 0;
		overflow: hidden;
		.dr-btns {
			float: right;
		}
	}
	.all-content {
		height: 200px;
		line-height: 200px;
		text-align: center;
		font-size: 20px;
		color: $color-disabled;
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
.table-box {
	overflow: hidden;
	margin-bottom: 20px;
}
.search-div {
	padding: 20px 0;
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
</style>
