<template>
	<div class="e-card-voucher-management">
		<guideBar>
			<el-button type="primary" v-permission="'e_card_voucher_management_batchexport'" @click="batchExport">
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="E_CARD_VOUCHER_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<div class="text-right mb16">
				<el-button v-permission="'e_card_voucher_management_output'" type="primary" @click="useVoucher('transOut')">
					提现转出
				</el-button>
				<el-button v-permission="'e_card_voucher_management_freeze'" type="primary" @click="useVoucher('frozen')">
					礼券冻结
				</el-button>
				<el-button v-permission="'e_card_voucher_management_unfreeze'" type="primary" @click="useVoucher('thaw')">
					礼券解冻
				</el-button>
				<el-button v-permission="'e_card_voucher_management_transfer'" type="primary" @click="useVoucher('transShop')">
					礼券转店
				</el-button>
			</div>
			<tableList
				border
				:dataSource="list"
				ref="multipleTable"
				:columns="E_CARD_VOUCHER_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="options"
				:loading="loading"
				showSummary
				:summary-method="getSummaries"
				@handleSelectionChange="handleSelectionChange"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button v-permission="'e_card_voucher_management_detail'" type="text" @click="detail(scope.data)">
						详情
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 电子礼券使用方式pop -->
		<el-dialog :title="eCardUsePop.title" width="600px" :visible.sync="eCardUsePop.show">
			<el-form ref="ecardForm" :model="ecardForm" :rules="ECARD_FORM_RULES" label-width="150px" label-suffix=":">
				<div v-if="eCardUsePop.type == 'transShop'">
					<div class="mb16">当前已选{{ currentSelectOptions.length }}张电子礼券</div>
					<el-form-item label="转入服务中心编码" prop="transInshopCode">
						<el-input
							v-model.trim="ecardForm.transInshopCode"
							placeholder="请输入转入服务中心编码"
							@change="loadStoreName"
						/>
					</el-form-item>
					<el-form-item label="转入服务中心名称" prop="transInshopName">
						<el-input v-model="ecardForm.transInshopName" :disabled="true" />
					</el-form-item>
				</div>
				<div v-if="eCardUsePop.type == 'transOut'">
					<div class="mb16">当前已选{{ currentSelectOptions.length }}张电子礼券，保存后将会被转出。</div>
					<el-form-item label="原因" prop="transReason">
						<el-input maxlength="50" show-word-limit v-model="ecardForm.transReason" placeholder="请输入礼券转出原因" />
					</el-form-item>
				</div>
				<div v-if="eCardUsePop.type == 'frozen'">
					<div class="mb16">当前已选{{ currentSelectOptions.length }}张电子礼券，保存后将会被冻结。</div>
					<el-form-item label="备注" prop="remark">
						<el-input
							maxlength="50"
							show-word-limit
							type="textarea"
							v-model="ecardForm.remark"
							placeholder="请输入备注"
						/>
					</el-form-item>
				</div>
				<div v-if="eCardUsePop.type == 'thaw'">
					<div>当前已选{{ currentSelectOptions.length }}张电子礼券，保存后将会被解冻。</div>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cacelEcardUse('ecardForm')">取消</el-button>
				<el-button type="primary" @click="saveEcardUse('ecardForm')">保存</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { E_CARD_VOUCHER_SEARCH_CONFIG, E_CARD_VOUCHER_COLUMNS_CONFIG, KEY_TO_NAME, ECARD_FORM_RULES } from './config';
import { formatDateDefault } from 'util/formValidation';
import { exportExcelPost } from 'util';
export default {
	name: 'eCardVoucherManagement',
	data() {
		return {
			E_CARD_VOUCHER_SEARCH_CONFIG,
			E_CARD_VOUCHER_COLUMNS_CONFIG,
			KEY_TO_NAME,
			ECARD_FORM_RULES,
			searchConfig: {},
			voucherMoney: 0,
			loading: false,
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 0,
			options: {
				selection: true,
			},
			list: [],
			currentSelectOptions: [],
			eCardUsePop: {
				title: '电子礼券转店',
				show: false,
				type: 'transShop',
			},
			ecardForm: { transInshopCode: '', transReason: '', remark: '' },
			confirmPop: {
				title: '转店确认',
				show: false,
			},
		};
	},
	methods: {
		// 批量导出
		batchExport() {
			exportExcelPost('/mgmt/fin/voucher/gift/coupon/export', this.loadDataPost, '电子礼券管理');
		},
		// 搜索
		handleSearch() {
			this.list = [];
			this.pagination.currentPage = 1;
			this.loadData();
		},
		// 翻页操作
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 切换页面条数
		handleSizeChange(pageSize) {
			this.pagination = {
				currentPage: 1,
				pageSize,
			};
			this.loadData();
		},
		// 详情
		detail(row) {
			this.$go('e_card_voucher_detail', { id: row.grantdtlId });
		},
		handleSelectionChange(val) {
			this.currentSelectOptions = val;
		},
		useVoucher(name) {
			if (!this.currentSelectOptions.length) {
				return this.$message.warning('请选择一条数据');
			}
			const { KEY_TO_NAME } = this;
			this.eCardUsePop = {
				show: true,
				title: '电子礼券' + KEY_TO_NAME[name],
				type: name,
			};
		},
		// 合计
		getSummaries(param) {
			const { columns } = param;
			const sums = [];
			columns.forEach((column, index) => {
				if (index === 6) {
					sums[index] = `¥ ${this.voucherMoney}`;
				}
			});
			sums.splice(0, 3);
			this.$nextTick(() => {
				this.$refs['multipleTable'].$children[0].doLayout();
			});
			return ['', '合计条数：', this.dataTotal, ...sums];
		},
		// 店子礼券使用 -- 取消
		cacelEcardUse(formname) {
			this.eCardUsePop = {
				show: false,
				title: '',
				type: '',
			};
			this.$refs[formname].resetFields();
		},
		// 店子礼券使用 -- 保存
		saveEcardUse(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$confirm('确认结果，提交后不可修改。', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					})
						.then(() => {
							this.eCardUseFn(this.eCardUsePop.type);
						})
						.catch(() => {});
				}
			});
		},
		// 电子礼券操作接口
		async eCardUseFn(type) {
			const interfaceHouse = {
				transOut: '/mgmt/fin/voucher/gift/coupon/updateGiftCouponTransOutStatus',
				frozen: '/mgmt/fin/voucher/gift/coupon/updateGiftCouponFrozendStatus',
				thaw: '/mgmt/fin/voucher/gift/coupon/updateGiftCouponFrozendStatus',
				transShop: '/mgmt/fin/voucher/gift/coupon/updateGiftCouponTransShopStatus',
			};
			const { currentSelectOptions } = this;
			let data = {
				grantdtlIdList: [],
				...this.ecardForm,
			};
			type === 'frozen' && (data.operationContent = 1);
			type === 'thaw' && (data.operationContent = 2);

			currentSelectOptions &&
				currentSelectOptions.map(item => {
					data.grantdtlIdList.push(item.grantdtlId);
				});
			const res = await this.$fetch({
				method: 'POST',
				url: interfaceHouse[type],
				data,
			});
			if (res && res.code === 200) {
				this.submitTips('success');
				this.loadData();
				this.$refs['ecardForm'].resetFields();
				this.eCardUsePop = {
					show: false,
					title: '',
					type: '',
				};
			} else {
				this.submitTips('fail', this.saveEcardUse, res.data.message);
			}
		},
		// 礼券操作成功/失败提示
		submitTips(type, confirmback, cancelback) {
			console.log('type', type);
			let confirmItem = {
				content: '提交成功',
				btns: {
					confirmButtonText: '确定',
					cancelButtonText: '返回列表',
				},
			};
			if (type === 'fail') {
				confirmItem = {
					content: cancelback,
					btns: {
						confirmButtonText: '重新提交',
						cancelButtonText: '取消',
					},
				};
			}
			this.$confirm(confirmItem.content, '提示', {
				...confirmItem.btns,
				type,
			})
				.then(() => {
					confirmback && confirmback();
				})
				.catch(() => {
					cancelback && cancelback();
				});
		},
		// 获取电子礼券金额统计
		async loadVoucherMoney() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/voucher/gift/coupon/queryGiftCouponAmtManager',
				data: this.loadDataPost,
				timeout: 60000,
			});
			if (res && res.code === 200) {
				this.voucherMoney = res.data;
			} else {
				this.$message({
					type: 'error',
					message: '获取电子礼券金额失败',
				});
			}
		},
		// 根据storecode获取服务中心名称
		async loadStoreName() {
			const res = await this.$fetch(`/mgmt/inventory/common/getStoreInfo?storeCode=${this.ecardForm.transInshopCode}`);
			if (res && res.data) {
				this.$set(this.ecardForm, 'transInshopName', res.data.name);
			} else {
				this.$message.error(res.message || '获取服务中心名称失败');
			}
		},
		// 获取数据
		async loadData() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/voucher/gift/coupon/queryGiftCouponManagerInfo',
				data: this.loadDataPost,
				timeout: 60000,
			});
			this.loading = true;
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
			} else {
				this.$message({
					type: 'error',
					message: '获取列表数据失败',
				});
			}
			this.loading = false;
			this.loadVoucherMoney();
		},
	},
	computed: {
		loadDataPost() {
			const { searchConfig } = this;
			const { currentPage, pageSize } = this.pagination;
			let data = {
				...searchConfig,
				pageNum: currentPage,
				pageSize,
			};

			if (data.claimTime) {
				data.claimTimeStart = data.claimTime[0] ? formatDateDefault(data.claimTime[0]).substr(0, 7) : null;
				data.claimTimeEnd = data.claimTime[1] ? formatDateDefault(data.claimTime[1]).substr(0, 7) : null;
				delete data.claimTime;
			}
			if (data.couponTime) {
				data.couponTimeStart = data.couponTime[0] ? formatDateDefault(data.couponTime[0]).substr(0, 7) : null;
				data.couponTimeEnd = data.couponTime[1] ? formatDateDefault(data.couponTime[1]).substr(0, 7) : null;
				delete data.couponTime;
			}
			if (data.updateTime) {
				data.updateTimeStart = data.updateTime[0] ? formatDateDefault(data.updateTime[0]) + ' 00:00:00' : null;
				data.updateTimeEnd = data.updateTime[1] ? formatDateDefault(data.updateTime[1]) + ' 23:59:59' : null;
				delete data.updateTime;
			}
			return data;
		},
	},
	mounted() {
		this.loadData();
	},
};
</script>

<style lang="scss" scoped>
.e-card-voucher-management {
	.text-right {
		text-align: right;
	}
	.mb16 {
		margin-bottom: 16px;
	}
	.mr40 {
		margin-right: 40px;
	}
	.fs13 {
		font-size: 13px;
	}
}
</style>
