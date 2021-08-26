<template>
	<div>
		<el-tabs v-model="customerTab">
			<el-tab-pane label="不可购顾客" name="gklist">
				<el-card class="box-card">
					<searchPanel
						v-model="customerSearchData"
						:config="CUSTOMER_NOT_CONFIG"
						@search="customerSearch"
						@reset="customerReset"
					/>
				</el-card>
				<el-card class="card-gap">
					<div class="head-class-table">
						<div class="head-table">
							<span class="head-left">顾客列表</span>
						</div>
						<span class="top-btn-text" @click="importDisableMemberTemplate()">下载模板</span>
						<el-button class="top-btn-dc" type="primary" v-permission="'spike_activity_batch_disable'" @click="batch">
							批量删除
						</el-button>
						<el-upload
							ref="elUpload"
							class="upload-demo"
							:on-error="onError"
							:action="$store.getters['system/getbaseURL'] + '/mgmt/prmt/importDisableList'"
							name="file"
							accept=".xls, .xlsx"
							:data="{
								promotionId: $route.query.id,
								limitType: pageData.limitType,
								limitNumber: pageData.limitNumber,
								promotionType: 1,
							}"
							:show-file-list="false"
							:before-upload="beforeVideoUpload"
							:http-request="handleSuccess"
						>
							<el-button class="top-btn-dr" v-permission="'spike_activity_add_by_import'" type="primary">
								导入新增
							</el-button>
						</el-upload>
						<el-button
							class="top-btn-dc"
							type="primary"
							v-permission="'spike_activity_add_by_handled'"
							@click="dialogVisible = true"
						>
							手动新增
						</el-button>
						<span class="top-btn-dc" style="margin-top: 5px; font-size: 14px">
							已选{{ customerSelection.length }}个顾客
						</span>
					</div>
					<tableList
						border
						:options="options"
						:dataSource="purchaseNot.data"
						:columns="PURCHASE_NOT_COLUMNS"
						:pagination="purchaseNot.pagination"
						:dataTotal="purchaseNot.total"
						:loading="purchaseNot.loading"
						@handleSelectionChange="handleSelectionChange"
						@handleChangePage="customerChangePage"
						@handleSizeChange="customerSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								type="text"
								v-permission="'spike_activity_toggle_enable_state'"
								@click="purchaseDel(scope.data)"
							>
								删除
							</el-button>
						</template>
					</tableList>
				</el-card>
			</el-tab-pane>
			<el-tab-pane label="编辑记录" name="editjl">
				<el-card class="box-card">
					<searchPanel v-model="recordSearchData" :config="CUSTOMER_NOT_RECORD" @search="recordSearch" />
				</el-card>
				<el-card class="box-card">
					<tableList
						border
						:dataSource="record.data"
						:columns="RECORD_NOT_COLUMNS"
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
			<div class="import-class">
				<div class="import-div del-top-text">删除确认</div>
				<div class="import-div del-text">删除后，该顾客可以继续参与活动</div>
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
import {
	CUSTOMER_NOT_CONFIG,
	LINMIT_NOT_MUMBER,
	CUSTOMER_NOT_RECORD,
	RECORD_NOT_COLUMNS,
	PURCHASE_NOT_COLUMNS,
} from '../config';
import { exportExcel, fromDataUpload } from 'util';
import qs from 'querystring';
export default {
	name: 'activitycustomerNot',
	props: {
		pageData: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			options: {
				selection: true,
			},
			PURCHASE_NOT_COLUMNS,
			CUSTOMER_NOT_CONFIG,
			LINMIT_NOT_MUMBER,
			CUSTOMER_NOT_RECORD,
			customerTab: 'gklist',
			customerSearchData: {
				cardNo: '',
				realName: '',
				mobile: '',
			},
			customerSelection: [],
			purchaseNot: {
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				loading: false,
			},
			recordSearchData: {
				cardNo: '',
				mobile: '',
				realName: '',
				eidtTime: [],
			},
			RECORD_NOT_COLUMNS,
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
	},
	created() {
		this.getDisableUserPage();
	},
	methods: {
		importDisableMemberTemplate() {
			exportExcel(`/mgmt/prmt/importDisableMemberTemplate`);
		},
		beforeVideoUpload() {
			if (this.pageData.promotionState === 4) {
				this.$message.warning('该活动已停止，不可添加活动不可购顾客');
				return false;
			} else {
				return true;
			}
		},
		// 查询事件
		customerSearch() {
			this.getDisableUserPage();
		},
		// 重置事件
		customerReset() {
			this.getDisableUserPage();
		},
		customerChangePage(val) {
			this.purchaseNot.pagination.currentPage = val;
			this.getDisableUserPage();
		},
		customerSizeChange(val) {
			this.purchaseNot.pagination.currentPage = 1;
			this.purchaseNot.pagination.pageSize = val;
			this.getDisableUserPage();
		},
		handleSelectionChange(val) {
			this.customerSelection = val;
		},
		async saveStatus() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/deleteDisableUserById`,
				data: {
					ids: this.customerSelection.map(e => e.id),
				},
			});
			if (res && res.code == 200) {
				this.statusVisible = false;
				this.$message.success(res.message);
				this.getDisableUserPage();
			}
		},
		async getDisableUserPage() {
			let { query } = this.$route;
			let { currentPage, pageSize } = this.purchaseNot.pagination;
			let params = { pageNum: currentPage, pageSize, promotionId: query.id, ...this.customerSearchData };
			const res = await this.$fetch(`/mgmt/prmt/getDisableUserPage?${qs.stringify(params)}`);
			if (res && res.code == 200) {
				this.purchaseNot.data = res.data.list;
				this.purchaseNot.total = res.data.total;
			}
		},
		batch() {
			let idsArr = this.customerSelection.map(e => e.id);
			if (idsArr.length === 0) return this.$message.warning('请勾选一个或多个');
			this.statusVisible = true;
		},
		onError() {
			this.$message.error('导入失败');
		},
		handleSuccess(file) {
			let { limitCustomer, limitNumber, limitType } = this.pageData;
			let { id: promotionId } = this.$route.query;
			fromDataUpload.call(
				this,
				{
					url: `/mgmt/prmt/importDisableList`,
					formObject: { limitType, promotionId, limitNumber, promotionType: 1, file: file.file },
				},
				res => {
					if (res.code === 200) {
						this.$message.success(res.message);
						this.importData = res.data;
						if (res.data.falseCount) {
							this.importVisible = true;
						}
						if (limitCustomer == '2') {
							this.getDisableUserPage();
						} else {
							this.identityData();
						}
					} else {
						this.$message.error(res.message);
					}
				}
			);
		},
		beforeClose() {
			this.statusVisible = false;
		},
		purchaseDel({ realName, id, cardNo }) {
			this.$confirm('确定删除会员' + (realName || cardNo) + '?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/prmt/deleteDisableUserById',
					data: { ids: [id] },
				});
				if (res.code === 200) {
					this.$message.success(res.message);
					this.getDisableUserPage();
				}
			});
		},
		handleClose() {
			this.dialogVisible = false;
			this.resetAdd();
		},
		async save() {
			if (this.pageData.promotionState === 4) return this.$message.warning('该活动已停止，不可添加活动不可购顾客');
			if (this.addList.length === 0) return this.$message.warning('请根据卡号搜索一位顾客添加');
			let { cardNo, mobile, realName, id } = this.addList[0];
			let promotionId = this.$route.query.id;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/addDisableUser`,
				data: { cardNo, id, mobile, promotionId, realName },
			});
			if (res && res.code == 200) {
				this.$message.success('添加成功');
				this.getDisableUserPage();
				this.handleClose();
				this.resetAdd();
			}
		},
		resetAdd() {
			this.cardNo = '';
			this.customerDetail = {};
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
			const res = await this.$fetch(`/mgmt/prmt/getDisableChangePage?${qs.stringify(params)}`);
			if (res.code == 200) {
				this.record.data = res.data.list;
				this.record.total = res.data.total;
			}
		},
		recordHandleChangePage(val) {
			this.record.pagination.currentPage = val;
			this.recordGetData();
		},
		recordHandleSizeChange(val) {
			this.record.pagination.currentPage = 1;
			this.record.pagination.pageSize = val;
			this.recordGetData();
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
						this.getDisableUserPage();
					}
				})
				.catch();
		},
	},
	watch: {
		customerTab: {
			handler(val) {
				if ((this.$route.query && !this.$route.query.id) || !this.$route.query.id) return;
				if (val === 'gklist') this.getDisableUserPage();
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
