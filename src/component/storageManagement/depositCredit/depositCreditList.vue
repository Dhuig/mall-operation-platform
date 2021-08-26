<template>
	<div class="depsit-credit-list">
		<guideBar>
			<!-- <el-button
				v-permission="'deposit_credit_list_export_month_outdate_log'"
				type="primary"
				@click="expireExport"
			>导出本月到期记录</el-button>-->
			<el-button v-permission="'deposit_credit_list_batch_modify'" type="primary" @click="BatchImport">
				批量调整信誉额
			</el-button>
			<el-button v-permission="'deposit_credit_list_export'" type="primary" @click="batchExport">导出EXCEL</el-button>
		</guideBar>
		<el-card class="box-card">
			<searchPanel
				:config="activeTab === 'all' ? DEPOSIT_CREDIT_LIST_CONFIG : STAY_EXAMINE_LIST_CONFIG"
				:showExpand="true"
				:showReset="false"
				v-model="searchConfig"
				@search="handleSearch"
				@reset="getList"
			/>
		</el-card>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>综合信息</span>
			</div>
			<el-row class="min-width mb-24">
				<el-col :span="8" class="flex">
					<div class="label">服务中心数量合计:</div>
					<div class="content">{{ creditAmountTotal.storeCount }}</div>
				</el-col>
				<el-col :span="8" class="flex">
					<div class="label">押货信誉额总计:</div>
					<div class="content">￥{{ creditAmountTotal.creditTotalAmount }}</div>
				</el-col>
			</el-row>
		</el-card>
		<el-card class="box-card">
			<el-tabs v-model="activeTab">
				<el-tab-pane label="全部" name="all">
					<tableList
						border
						:loading="all.loading"
						:dataSource="all.data"
						:columns="All_LIST_COLUMNS"
						:pagination="all.pagination"
						:dataTotal="all.pagination.total"
						:options="options"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<div v-permission="'deposit_credit_list_detail|deposit_credit_detail'">
								<span class="btns" @click="detail(scope.data)">详情</span>
							</div>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="待审核" name="tobeReviewed">
					<div class="mb-16" v-permission="'deposit_credit_list_batch_audit'">
						<el-button type="primary" @click="handleBatchExamine">批量审核</el-button>
					</div>
					<tableList
						border
						:loading="tobeReviewed.loading"
						:dataSource="tobeReviewed.data"
						:columns="TOBEREVIEWED_LIST_COLUMNS"
						:pagination="tobeReviewed.pagination"
						:dataTotal="tobeReviewed.pagination.total"
						:options="optionsReviewed"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						@toggleRowSelection="toggleRowSelection"
						@handleSelectionChange="handleSelectionChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button v-permission="'deposit_credit_list_audit'" type="text" @click="reviedwed(scope.data)">
								审核
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 审核弹窗 -->
		<el-dialog title="信誉额审核" :visible.sync="show" width="600px" v-drag>
			<el-form :model="creditAmount" class="add-user" :rules="batchExamineRules" ref="creditRef">
				<el-form-item label="服务中心编号:">
					<span>{{ rowInfo && rowInfo.storeCode }}</span>
				</el-form-item>
				<el-form-item label="服务中心名称:">
					<span>{{ rowInfo && rowInfo.storeName }}</span>
				</el-form-item>
				<el-form-item label="分公司名称:">
					<span>{{ rowInfo && rowInfo.companyName }}</span>
				</el-form-item>
				<el-form-item label="当前信誉额:">
					<span>￥{{ rowInfo && rowInfo.currentCredit }}</span>
				</el-form-item>
				<el-form-item label="调整金额:" prop="money">
					<span>￥{{ rowInfo && rowInfo.money }}</span>
				</el-form-item>
				<el-form-item label="调整理由:" prop="applyRemark">
					<span>{{ rowInfo && rowInfo.applyRemark }}</span>
				</el-form-item>
				<el-form-item label="协议图片:" v-if="rowInfo && rowInfo.source === 1">
					<div class="img_box">
						<el-upload
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							list-type="picture-card"
							:on-preview="handlePictureCardPreview"
							:file-list="rowInfo.imgArr"
							class="hide_box"
							disabled
						>
							<i class="el-icon-plus"></i>
						</el-upload>
					</div>
				</el-form-item>
				<el-form-item label="审核结果:" prop="verifyStatus">
					<el-select size="medium" v-model="creditAmount.verifyStatus">
						<el-option label="通过" value="1"></el-option>
						<el-option label="拒绝" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注:" prop="verifyRemark">
					<el-input type="textarea" v-model="creditAmount.verifyRemark" size="medium" />
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button
					type="primary"
					:loading="submitLoading"
					@click="handleExamineSave('creditRef')"
					class="dialog-btn mr-16"
				>
					审核
				</el-button>
				<el-button @click="handleExamineCacel('creditRef')" class="dialog-btn">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 批量审核 -->
		<el-dialog title="批量审核" :visible.sync="batchExamineShow" width="600px" v-drag>
			<el-form :model="batchExamine" class="add-user" :rules="batchExamineRules" ref="batchExamineRef">
				<el-form-item label="审核数量合计:">
					<span>{{ selection.length }}</span>
				</el-form-item>
				<el-form-item label="审核状态:" prop="verifyStatus">
					<el-select size="medium" v-model="batchExamine.verifyStatus">
						<el-option label="通过" value="1"></el-option>
						<el-option label="拒绝" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注:" prop="verifyRemark">
					<el-input type="textarea" v-model="batchExamine.verifyRemark" size="medium" />
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button
					type="primary"
					:loading="submitLoading"
					@click="batchExamineSave('batchExamineRef')"
					class="dialog-btn mr-16"
				>
					批量审核
				</el-button>
				<el-button @click="batchExamineCacel('batchExamineRef')" class="dialog-btn">取 消</el-button>
			</span>
		</el-dialog>
		<el-dialog class="img_preview" :visible.sync="dialogVisible" :modal-append-to-body="false" v-drag>
			<img width="100%" :src="dialogImageUrl" alt />
		</el-dialog>
	</div>
</template>
<script>
import {
	DEPOSIT_CREDIT_LIST_CONFIG,
	STAY_EXAMINE_LIST_CONFIG,
	All_LIST_COLUMNS,
	TOBEREVIEWED_LIST_COLUMNS,
	URL_TYPE,
	COMPANY_TYPE,
} from './config';
import { exportExcel } from 'util';
import qs from 'querystring';
import { formatDateDefault } from 'util/formValidation';

export default {
	name: 'depositCreditList',
	data() {
		return {
			DEPOSIT_CREDIT_LIST_CONFIG,
			STAY_EXAMINE_LIST_CONFIG,
			All_LIST_COLUMNS,
			TOBEREVIEWED_LIST_COLUMNS,
			URL_TYPE,
			COMPANY_TYPE,
			activeTab: 'all',
			searchConfig: {
				storeCode: '',
				companyCode: '',
				moneyType: '',
				changeRecord: '',
				examineMonth: [],
				expireTime: [],
			},
			all: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			tobeReviewed: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			optionsReviewed: {
				label: '全部',
				index: true,
				selection: true,
				labelIndex: '序号',
			},
			dialogVisible: false, //图片预览
			dialogImageUrl: '', //图片路径
			creditAmountTotal: {}, // 综合信息
			selection: [], // 勾选的数据
			batchExamineShow: false, // 批量操作弹窗
			show: false, // 审核弹窗
			creditAmount: {
				verifyStatus: '', // 审核状态
				verifyRemark: '', // 审核备注
			},
			batchExamine: {
				// 批量审核对象
				verifyStatus: '',
				verifyRemark: '',
			},
			batchExamineRules: {
				verifyStatus: [{ required: true, message: '请选择', trigger: 'change' }],
			},
			rowInfo: {}, // 每行列表数据
			tableRef: '', // 继承表格组件的ref标识
			exportParams: {}, // 导出参数
			submitLoading: false,
		};
	},
	computed: {
		// 接口url
		urlType() {
			return URL_TYPE[this.activeTab];
		},
		// 搜索参数
		searchFields() {
			let {
				searchConfig: { examineMonth, expireTime, ...obj },
			} = this;
			examineMonth = this.activeTab !== 'tobeReviewed' ? examineMonth : [];
			let isStartMonth = examineMonth[0] ? formatDateDefault(examineMonth[0]).split('-') : '',
				isEndMonth = examineMonth[1] ? formatDateDefault(examineMonth[1]).split('-') : '',
				startDay = expireTime[0] ? formatDateDefault(expireTime[0]) : '',
				endDay = expireTime[1] ? formatDateDefault(expireTime[1]) : '';
			return {
				...obj,
				startMonth: isStartMonth && `${isStartMonth[0]}-${isStartMonth[1]}`,
				endMonth: isEndMonth && `${isEndMonth[0]}-${isEndMonth[1]}`,
				startDay,
				endDay,
			};
		},
	},
	watch: {
		urlType() {
			this.getList();
		},
	},
	methods: {
		// 图片预览
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		// 格式化时间
		formatDate(item, index) {
			if (item && item.length >= 2) {
				let d = new Date(item[index]);
				let YY = d.getFullYear() + '-';
				let MM = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '-';
				let DD = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
				return YY + MM + DD;
			} else {
				return '';
			}
		},
		// 分页触发事件
		handleChangePage(currentPage) {
			this[this.activeTab].pagination.currentPage = currentPage;
			this.getList();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this[this.activeTab].pagination.pageSize = pageSize;
			this.getList();
		},
		// 搜索
		handleSearch() {
			this[this.activeTab].pagination.currentPage = 1;
			this.getList();
		},
		// 初始化清空复选框勾选状态
		toggleRowSelection(that) {
			this.tableRef = that;
			return that.clearSelection();
		},
		// 复选框选中项
		handleSelectionChange(val) {
			this.selection = val;
		},
		// 批量调整信誉额
		BatchImport() {
			this.$go('deposit_credit_import', { title: '信誉额批量调整' });
		},

		// 详情
		detail(row) {
			this.$go('deposit_credit_detail', {
				title: '信誉额详情',
				row: JSON.stringify(row),
			});
		},
		// 审核确定按钮
		handleExamineSave(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const params = {
						...this.creditAmount,
						verifyStatus: +this.creditAmount.verifyStatus,
						ids: [this.rowInfo.id],
					};

					await this.creditAudit(params);
					this.show = false;
					this.$refs[formName].resetFields();
					this.getList();
				}
			});
		},
		// 审核取消按钮
		handleExamineCacel(formName) {
			this.show = false;
			this.$refs[formName].resetFields();
		},
		// 审核
		reviedwed(row) {
			this.show = true;
			this.rowInfo = row;
			this.rowInfo.imgArr = [];
			if (row.source === 1 && row.protocolPic) {
				let allImg = row.protocolPic.split(',');
				allImg.forEach((v, i) => {
					this.rowInfo.imgArr.push({ name: `protocolPic_${i}`, url: v });
				});
			}
		},
		// 批量审核
		handleBatchExamine() {
			if (!this.selection.length) {
				this.$message({
					message: '至少勾选一项!',
					type: 'error',
				});
			} else {
				this.batchExamineShow = true;
			}
		},
		// 批量审核确定按钮
		batchExamineSave(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const ids = this.selection.map(v => v.id);
					const params = {
						...this.batchExamine,
						verifyStatus: +this.batchExamine.verifyStatus,
						ids,
					};
					await this.creditAudit(params);
					this.$refs[formName].resetFields();
					this.batchExamineShow = false;
					this.getList();
				}
			});
		},
		// 批量审核取消按钮
		batchExamineCacel(formName) {
			this.$refs[formName].resetFields();
			this.batchExamineShow = false;
			// 清空勾选状态
			this.tableRef.clearSelection();
		},
		// 导出
		batchExport() {
			exportExcel('/mgmt/inventory/mortgageAmount/exportMortgageAmountCredit', this.exportParams);
		},
		// 导出本月到期记录
		expireExport() {
			exportExcel('/mgmt/inventory/mortgageAmount/exportCurMonthEndMortgageAmountCredit');
		},
		// 获取分公司编号
		async loadCompanyCode() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			let companyData = serviceCompanyOptions.map(({ label, value }) => {
				return {
					label: `${label} ${value}`,
					value,
				};
			});
			this.DEPOSIT_CREDIT_LIST_CONFIG.form[1].options = companyData;
			this.STAY_EXAMINE_LIST_CONFIG.form[1].options = companyData;
		},
		// 押货信誉额审核接口
		async creditAudit(params) {
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/inventory/mortgageAmount/verifyMortgageAmountCredit',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
			this.submitLoading = false;
		},
		// 获取押货信誉额合计接口
		async getCreditAmountTotal() {
			const { searchFields } = this;
			const data = {
				...searchFields,
			};
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/inventory/mortgageAmount/countCreditAmount`,
				data,
			});

			if (res && res.data) {
				this.creditAmountTotal = res.data;
			} else {
				this.creditAmountTotal = 0;
			}
		},
		// 请求数据
		async getList() {
			const { activeTab, urlType, searchFields } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this[activeTab];
			this[activeTab].loading = true;
			const params = {
				pageNum,
				pageSize,
				...searchFields,
			};
			this.exportParams = params;

			const res = await this.$fetch(`${urlType}?${qs.stringify(params)}`);

			if (res) {
				const { list, total } = res.data;
				this[activeTab].data = list;
				this[activeTab].pagination.total = total;
			} else {
				this[activeTab].data = [];
				this[activeTab].pagination.total = 0;
			}
			this[activeTab].loading = false;
		},
	},
	created() {
		this.loadCompanyCode();
		this.getList();
		this.getCreditAmountTotal();
	},
};
</script>
<style lang="scss" scoped>
::v-deep.depsit-credit-list {
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}
	.title {
		margin-bottom: 30px;
		font-weight: 500;
		color: rgba(48, 51, 54, 1);
	}
	// .el-card__header {
	// 	background-color: #eee;
	// }
	.flex {
		display: flex;
		font-weight: 400;
		font-size: 14px;
		color: rgba(92, 98, 104, 1);
		.label {
			// width: 180px;
			text-align: right;
		}
		.content {
			margin-left: 16px;
		}
	}
	.el-form-item {
		width: 100%;
		display: flex;
		flex: auto;
		margin-bottom: 26px;
		.el-form-item__content,
		.el-input,
		.el-select,
		.el-date-editor {
			width: 224px;
		}
	}
	.dialog-footer {
		display: flex;
		justify-content: center;
	}
	.el-dialog__footer {
		padding-bottom: 30px !important;
	}
	.el-textarea__inner {
		height: 90px;
	}
	.img_box .is-success {
		width: 80px;
		height: 80px;
	}
	.img_box {
		width: 300px;
	}
	.img_box img {
		width: 100px;
		height: 100px;
		margin-right: 10px;
	}
	.img_preview {
		.el-dialog {
			height: 80%;
			.el-dialog__body {
				height: 80%;
				overflow: auto;
			}
		}
	}
}
::v-deep.add-user {
	padding-right: 25%;
	.el-form-item {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		margin-bottom: 10px;
		.el-form-item__content,
		.el-input,
		.el-select,
		.el-date-editor {
			width: 224px;
		}
	}
}
.min-width {
	min-width: 1024px;
}
.mb-24 {
	margin-bottom: 24px;
}
.mb-16 {
	margin-bottom: 16px;
}
.dialog-btn {
	width: 100px;
}
.mr-16 {
	margin-right: 16px;
}
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
.avatar-gap {
	margin-bottom: 16px;
}
</style>
