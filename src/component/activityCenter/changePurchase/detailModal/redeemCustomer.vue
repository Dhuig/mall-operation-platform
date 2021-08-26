<template>
	<div>
		<el-tabs v-model="customerTab">
			<el-tab-pane label="顾客列表" name="gklist">
				<el-card class="box-card">
					<searchPanel
						v-model="customerSearchData"
						:config="CUSTOMER_CONFIG"
						@search="customerSearch"
						@reset="customerReset"
					/>
				</el-card>
				<el-card class="card-gap">
					<div class="head-class-table">
						<div class="head-table">
							<span class="head-left">顾客列表</span>
							<span class="head-right">
								限购总数量：{{
									pageData.limitNumber > 0
										? `每位顾客最多购买${pageData.limitNumber}件`
										: CHANGE_LIMITNUMBER[pageData.limitNumber]
								}}
							</span>
						</div>
						<span class="top-btn-text" @click="customerData(2)">下载模板</span>
						<el-button
							class="top-btn-dc"
							type="primary"
							v-permission="'change_purchase_detail_batch_disable'"
							@click="batch"
						>
							批量禁用
						</el-button>
						<el-upload
							ref="elUpload"
							class="upload-demo"
							:on-error="onError"
							:action="$store.getters['system/getbaseURL'] + '/mgmt/prmt/importUserList'"
							:headers="$store.getters['system/getSignatureVerification']"
							name="file"
							accept=".xls, .xlsx"
							:data="{ promotionId: $route.query.id, limitNumber: pageData.limitNumber }"
							:show-file-list="false"
							:on-success="handleSuccess"
							:before-upload="beforeVideoUpload"
						>
							<el-button class="top-btn-dr" v-permission="'change_purchase_detail_add_by_import'" type="primary">
								导入新增
							</el-button>
						</el-upload>
						<el-button
							class="top-btn-dc"
							type="primary"
							v-permission="'change_purchase_detail_add_by_handle'"
							@click="dialogVisible = true"
						>
							手动新增
						</el-button>
						<el-button
							class="top-btn-dc"
							type="primary"
							v-permission="'change_purchase_detail_customer_export'"
							@click="customerData(1)"
						>
							导出
						</el-button>
						<span class="top-btn-dc" style="margin-top: 5px; font-size: 14px">
							已选{{ customerSelection.length }}个顾客
						</span>
					</div>
					<el-table :data="customerList.data" style="width: 100%" @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="55" align="center"></el-table-column>
						<el-table-column prop="cardNo" label="会员卡号" align="center"></el-table-column>
						<el-table-column prop="realName" label="会员姓名" align="center"></el-table-column>
						<el-table-column prop="memberType" label="顾客身份" align="center"></el-table-column>
						<el-table-column prop="mobile" label="注册手机号" align="center"></el-table-column>
						<el-table-column
							prop="serialNo"
							label="产品编码"
							align="center"
							v-if="pageData.limitNumber === -2"
						></el-table-column>
						<el-table-column
							prop="totalCount"
							label="可购数量"
							align="center"
							v-if="pageData.limitNumber === -2"
						></el-table-column>
						<el-table-column
							prop="purchasedCount"
							label="已购数量"
							align="center"
							v-if="pageData.limitNumber === -2"
						></el-table-column>
						<el-table-column
							prop="restCount"
							label="剩余可购数量"
							align="center"
							v-if="pageData.limitNumber === -2"
						></el-table-column>
						<el-table-column prop="memberState" label="参与状态" align="center">
							<template slot-scope="scope">
								<div>
									<span v-if="scope.row.memberState == 1">已启用</span>
									<span v-else style="color: red">已禁用</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<div>
									<span
										class="btns"
										v-permission="'change_purchase_detail_toggle_enable_state'"
										@click="statusClick(scope.row)"
									>
										{{ scope.row.memberState == 1 ? '禁用' : '启用' }}
									</span>
								</div>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination
						border
						class="pagination"
						:total="customerList.total"
						:current-page.sync="customerList.pagination.currentPage"
						:page-size="customerList.pagination.pageSize"
						@current-change="customerChangePage"
						@size-change="customerSizeChange"
						layout="sizes, total , prev, pager, next, jumper"
					/>
				</el-card>
			</el-tab-pane>
			<el-tab-pane label="编辑记录" name="editjl">
				<el-card class="box-card">
					<searchPanel v-model="recordSearchData" :config="CUSTOMER_RECORD" @search="recordSearch" />
				</el-card>
				<el-card class="box-card">
					<tableList
						border
						:dataSource="record.data"
						:columns="RECORD_COLUMNS"
						:pagination="record.pagination"
						:dataTotal="record.total"
						:loading="record.loading"
						@handleChangePage="recordHandleChangePage"
						@handleSizeChange="recordHandleSizeChange"
					></tableList>
				</el-card>
			</el-tab-pane>
		</el-tabs>

		<el-dialog title="确认提示" v-drag :visible.sync="statusVisible" width="30%" :before-close="beforeClose">
			<div class="import-class" v-if="customerStatus.memberState == 1">
				<div class="import-div del-top-text">禁用顾客资格确认</div>
				<div class="import-div del-text">禁用后，顾客将不可以参与活动，</div>
				<div class="import-div del-text">1. 未支付的订单将不能支付。</div>
				<div class="import-div del-text">2. 已支付的订单不受影响。</div>
				<div class="import-div del-text">3. 再次启用资格后，顾客活动资格会继续计算。</div>
			</div>
			<div class="import-class" v-else>
				<div class="import-div del-top-text">启用资格确认</div>
				<div class="import-div del-text">启用后，顾客可以继续参与活动</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="statusVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveStatus">确 定</el-button>
			</span>
		</el-dialog>

		<el-dialog title="手动添加" v-drag :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
			<div class="search-div">
				<el-form :inline="true" label-width="120px">
					<el-form-item label="搜索顾客：" prop="name">
						<el-input v-model="cardNo" placeholder="输入会员卡号，精准搜索" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="searchCard">搜 索</el-button>
					</el-form-item>
				</el-form>
				<div class="product-class">
					<el-form label-width="120px" v-if="addList.length > 0">
						<el-form-item label="会员卡号：">
							<span>{{ customerDetail.cardNo }}</span>
						</el-form-item>
						<el-form-item label="会员身份：">
							<span>{{ customerDetail.memberType }}</span>
						</el-form-item>
						<el-form-item label="会员姓名：">
							<span>{{ customerDetail.realName }}</span>
						</el-form-item>
						<el-form-item label="注册手机号：">
							<span>{{ customerDetail.mobile }}</span>
						</el-form-item>
					</el-form>
					<div class="nothing" v-else>
						<p class="el-icon-document icon-file"></p>
						<p class="file-text">搜索不到对应的顾客</p>
					</div>
				</div>
				<el-table
					v-if="addList.length > 0 && pageData.limitNumber == -2"
					:data="productList"
					border
					style="width: 100%"
					:loading="false"
				>
					<el-table-column prop="serialNo" label="产品编码" align="center"></el-table-column>
					<el-table-column prop="serialNo" label="可购数量" align="center">
						<template slot-scope="{ row }">
							<div>
								<el-input
									v-model="row.totalCount"
									maxlength="4"
									show-word-limit
									placeholder="请输入可购数量"
								></el-input>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="save">添 加</el-button>
			</span>
		</el-dialog>

		<el-dialog title="导入结果" v-drag :visible.sync="importVisible" width="30%">
			<div class="import-class">
				<div class="import-div">
					成功新增{{ importData.trueCount }}条，更新{{ importData.updateCount }}条，失败{{ importData.falseCount }}条
				</div>
				<div class="import-div dowload-data-file" @click="dowloadFileList">下载失败列表</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="importVisible = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { formatDate } from 'util/formValidation.js';
import { CUSTOMER_CONFIG, CHANGE_LIMITNUMBER, CUSTOMER_RECORD, RECORD_COLUMNS } from '../config';
import { exportExcel } from 'util';
import qs from 'querystring';
export default {
	name: 'redeemCustomer',
	props: {
		pageData: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			productList: [],
			CUSTOMER_CONFIG,
			CHANGE_LIMITNUMBER,
			CUSTOMER_RECORD,
			customerStatus: {},
			customerTab: 'gklist',
			customerSearchData: {
				cardNo: '',
				memberState: '',
				mobile: '',
				purchasedCount: '',
				realName: '',
				totalCount: '',
				eidtTime: [],
			},
			customerSelection: [],
			customerList: {
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				loading: false,
				user: null,
			},
			recordSearchData: {
				cardNo: '',
				mobile: '',
				realName: '',
				eidtTime: [],
			},
			RECORD_COLUMNS,
			record: {
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				loading: false,
				total: 0,
			},
			cardNo: '',
			dialogVisible: false,
			customerDetail: {},
			addList: [],
			importVisible: false,
			importData: {},
			statusVisible: false,
			isBatch: true,
		};
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			};
			return params;
		},
		recordModelData() {
			let { cardNo, realName, serialNo, eidtTime, mobile } = this.recordSearchData;
			let eidtTimes = eidtTime.length > 0;
			let createTimeMax = eidtTimes ? formatDate(eidtTime[1] + 86399000) : null;
			let createTimeMin = eidtTimes ? formatDate(eidtTime[0]) : null;
			return { cardNo, realName, serialNo, mobile, createTimeMax, createTimeMin };
		},
		searchData() {
			let { cardNo, memberState, mobile, purchasedCount } = this.customerSearchData;
			let { realName, serialNo, totalCount, eidtTime } = this.customerSearchData;
			let eidtTimes = eidtTime.length > 0;
			let updateTimeMax = eidtTimes ? formatDate(eidtTime[1] + 86399000) : null;
			let updateTimeMin = eidtTimes ? formatDate(eidtTime[0]) : null;
			return {
				cardNo,
				memberState,
				mobile,
				purchasedCount,
				realName,
				serialNo,
				totalCount,
				updateTimeMax,
				updateTimeMin,
			};
		},
	},
	methods: {
		beforeVideoUpload() {
			if (this.pageData.promotionState === 4) {
				this.$message.warning('该活动已停止，不可添加活动顾客');
				return false;
			} else {
				return true;
			}
		},
		// 查询事件
		customerSearch() {
			this.customerData();
		},
		// 重置事件
		customerReset() {
			this.customerData();
		},
		customerChangePage(val) {
			this.customerList.pagination.currentPage = val;
			this.customerData();
		},
		customerSizeChange(val) {
			this.customerList.pagination.pageSize = val;
			this.customerData();
		},
		handleSelectionChange(val) {
			this.customerSelection = val;
		},
		async saveStatus() {
			console.log(this.customerStatus);
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/enableOrDisable`,
				data: {
					ids: this.isBatch ? this.customerSelection.map(e => e.id) : [this.customerStatus.id],
					memberState: this.isBatch ? 2 : this.customerStatus.memberState == 1 ? 2 : 1,
				},
			});
			if (res && res.code == 200) {
				this.statusVisible = false;
				this.$message.success(res.message);
				this.customerData();
			}
		},
		async customerData(status) {
			let {
				customerList: {
					pagination: { currentPage, pageSize },
				},
			} = this;
			let { id } = this.$route.query;
			let params = { pageNum: currentPage, pageSize, promotionId: id, ...this.searchData };
			if (status === 2) {
				exportExcel(`/mgmt/prmt/importPromotionMemberTemplate`);
				return;
			}
			if (status) {
				if (this.pageData.limitNumber == -2) {
					exportExcel(`/mgmt/prmt/exportPromotionMember`, { promotionId: id, ...this.searchData, limitNumber: -2 });
				} else {
					exportExcel(`/mgmt/prmt/exportPromotionMember`, { promotionId: id, ...this.searchData });
				}
				return;
			}
			const res = await this.$fetch(`/mgmt/prmt/getUserListPage?${qs.stringify(params)}`);
			if (res && res.code == 200) {
				let { list, total } = res.data;
				this.customerList.data = list;
				this.customerList.total = total;
			}
		},
		batch() {
			let idsArr = this.customerSelection.filter(e => e.memberState == 1);
			if (idsArr.length === 0) return this.$message.warning('请勾选一个或多个已启用的会员');
			this.statusVisible = true;
			this.customerStatus.memberState = 1;
			this.isBatch = true;
		},
		onError() {
			this.$message.error('导入失败');
		},
		handleSuccess(res) {
			if (res.code === 200) {
				this.importData = res.data;
				if (res.data.falseCount) {
					this.importVisible = true;
				}
				this.customerData();
			} else {
				this.$message.error(res.message);
			}
		},
		beforeClose() {
			this.statusVisible = false;
			this.customerStatus = {};
			this.isBatch = true;
		},
		statusClick(row) {
			this.statusVisible = true;
			this.customerStatus = row;
			this.isBatch = false;
		},
		handleClose() {
			this.dialogVisible = false;
			this.resetAdd();
		},
		async save() {
			if (this.pageData.promotionState === 4) return this.$message.warning('该活动已停止，不可添加活动顾客');
			if (this.addList.length === 0) return this.$message.warning('请根据卡号搜索一位顾客添加');
			let istrue = false;
			for (let index = 0; index < this.productList.length; index++) {
				if (this.productList[index].totalCount && !/^[1-9]\d*$/.test(this.productList[index].totalCount)) {
					this.productList[index].totalCount = '';
					istrue = true;
					this.$message.warning('可购数量为正整数！');
					break;
				}
			}
			if (istrue) return;
			let { cardNo, mobile, realName } = this.addList[0];
			let { limitNumber } = this.pageData;
			let promotionId = this.$route.query.id ? this.$route.query.id : null;
			let params = { limitNumber, cardNo, mobile, realName, promotionId, productLists: this.productList };
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/addUser`,
				data: params,
			});
			if (res && res.code == 200) {
				this.$message.success('添加成功');
				this.customerData();
				this.handleClose();
				this.resetAdd();
			}
		},
		resetAdd() {
			this.cardNo = '';
			this.customerDetail = {};
			this.productList = this.productList.map(e => {
				e.totalCount = null;
				return e;
			});
			this.addList = [];
		},
		async searchCard() {
			const res = await this.$fetch(`/mgmt/prmt/selectMemberByCard?cardNo=${this.cardNo}`);
			if (res.code == 200) {
				this.addList = [res.data];
				this.customerDetail = res.data;
			}
		},
		recordSearch() {
			this.recordGetData();
		},
		async recordGetData() {
			let { id } = this.$route.query;
			let { currentPage: pageNum, pageSize } = this.record.pagination;
			let params = { pageNum, pageSize, promotionId: id, ...this.recordModelData };
			const res = await this.$fetch(`/mgmt/prmt/selectChangePage?${qs.stringify(params)}`);
			if (res.code == 200) {
				this.record.data = res.data.list;
				this.record.total = res.data.total;
			}
		},
		recordHandleChangePage(val) {
			this.activityList.pagination.currentPage = val;
			this.recordGetData();
		},
		recordHandleSizeChange(val) {
			this.activityList.pagination.pageSize = val;
			this.recordGetData();
		},
		async productTotal() {
			let { id } = this.$route.query;
			let params = { pageNum: 1, pageSize: 9999, promotionId: id };
			const res = await this.$fetch(`/mgmt/prmt/getProductListPage?${qs.stringify(params)}`);
			if (res && res.code == 200) {
				this.productList = res.data.list.map(({ serialNo }) => ({ serialNo, totalCount: '' }));
			}
		},
		dowloadFileList() {
			exportExcel('/mgmt/prmt/couponGrant/getImportErrorList', { key: this.importData.key });
		},
		async del({ cardNo, id, realName }) {
			this.$confirm(`确定删除会员${realName}?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/prmt/deleteUserById`,
						data: { cardNo, id },
					});
					if (res && res.code == 200) {
						this.$message.success(res.message);
						this.customerData();
					}
				})
				.catch();
		},
	},
	watch: {
		customerTab: {
			handler(val) {
				if ((this.$route.query && !this.$route.query.id) || !this.$route.query.id) return;
				if (val === 'gklist') this.productTotal();
				if (val === 'editjl') this.recordGetData();
			},
			immediate: true,
		},
	},
};
</script>

<style lang="scss" scoped>
.head-class-table {
	overflow: hidden;
	.head-table {
		float: left;
		.head-left {
			font-weight: 600;
			margin-top: 20px;
		}
		.head-right {
			font-size: 14px;
			margin-top: 20px;
			margin-left: 30px;
		}
	}
	.top-btn-dc {
		float: right;
		margin-bottom: 14px;
		margin-right: 10px;
	}
	.top-btn-text {
		float: right;
		line-height: 32px;
		color: $color-link;
		cursor: pointer;
	}
	.upload-demo {
		float: right;
		.top-btn-dr {
			margin-bottom: 14px;
			margin-right: 10px;
		}
	}
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
.search-div {
	padding: 0 0 20px 0;
}
.dowload-data-file {
	color: $color-link;
	cursor: pointer;
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

.btns {
	color: $color-link;
	cursor: pointer;
}
</style>
