<template>
	<div>
		<guideBar />

		<el-card>
			<div slot="header">
				<el-row class="header" type="flex" align="middle">
					<div>隔月开票审批设置</div>
					<el-button
						v-permission="'set_adjust_invoice_type'"
						v-if="!isChangeIncoice"
						@click="changeIncoice"
						class="marginL20"
						type="primary"
					>
						调整发票类型
					</el-button>
				</el-row>
			</div>
			<el-form class="form" :model="invoiceForm" label-width="120px" label-suffix=":">
				<el-form-item label="请选择发票类型" prop="a">
					<el-checkbox :disabled="!isChangeIncoice" v-model="invoiceForm.perElecInvoiceReview">
						个人普通电子发票
					</el-checkbox>
				</el-form-item>
				<el-form-item>
					<el-checkbox :disabled="!isChangeIncoice" v-model="invoiceForm.enterElecInvoiceReview">
						企业普通电子发票
					</el-checkbox>
				</el-form-item>
				<el-form-item>
					<el-checkbox :disabled="!isChangeIncoice" v-model="invoiceForm.enterPaperInvoiceReview">
						企业专用纸质发票
					</el-checkbox>
				</el-form-item>
				<el-form-item class="lineHeight">
					<div>
						1.勾选中的发票类型，需进行人工隔月开票审批流程；未勾选的发票类型，提交审核后，隔月开票自动审批通过；
					</div>
					<div>
						2.从确认时间开始，勾选的发票类型，需要人工审核；取消勾选的发票类型，系统自动审批。以操作时间进行判断。调整审批发票类型后，已提交的隔月发票类型需按照原有流程处理。
					</div>
				</el-form-item>
				<el-row v-if="isChangeIncoice" type="flex" class="marginT20" justify="center">
					<el-button @click="cencal">取消</el-button>
					<el-button type="primary" @click="save">确认</el-button>
				</el-row>
			</el-form>
		</el-card>

		<el-card>
			<div slot="header">
				<div class="header">操作记录</div>
			</div>
			<el-form :inline="true" label-suffix=":">
				<el-form-item label="调整月份">
					<el-date-picker
						v-model="month"
						:picker-options="defaultPickerOptions"
						type="monthrange"
						value-format="yyyyMM"
						range-separator="至"
						start-placeholder="开始月份"
						end-placeholder="结束月份"
					></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>

			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="date" label="操作内容">
					<template slot-scope="{ row }">
						<div v-if="row.perElecInvoiceChanged">
							个人普通电子发票 {{ row.perElecInvoiceReview ? '勾选' : '取消勾选' }}
						</div>
						<div v-if="row.enterElecInvoiceChanged">
							企业普通电子发票 {{ row.enterElecInvoiceReview ? '勾选' : '取消勾选' }}
						</div>
						<div v-if="row.enterPaperInvoiceChanged">
							企业专用纸质发票 {{ row.enterPaperInvoiceReview ? '勾选' : '取消勾选' }}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="operator" label="操作人"></el-table-column>
				<el-table-column prop="createTime" label="操作时间">
					<template slot-scope="{ row }">
						{{ row.createTime | formatDate }}
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				background
				class="pagination marginT20"
				:total="total"
				:current-page.sync="pagination.pageNum"
				:page-size="pagination.pageSize"
				@current-change="handleChangePage"
				@size-change="handleSizeChange"
				layout="sizes, total , prev, pager, next, jumper"
			/>
		</el-card>
	</div>
</template>

<script>
import { formatDate } from 'util/formValidation.js';
export default {
	name: 'invoiceSet',
	data() {
		return {
			isChangeIncoice: false,
			month: [formatDate(new Date(), 'month').replace('-', ''), formatDate(new Date(), 'month').replace('-', '')],
			defaultPickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
			},
			invoiceForm: {
				perElecInvoiceReview: true, //个人普通
				enterPaperInvoiceReview: true, // 企业专用
				enterElecInvoiceReview: true, // 企业普通
			},
			temporaryData: {},
			tableData: [],
			total: 0,
			pagination: {
				pageNum: 1,
				pageSize: 10,
			},
		};
	},
	filters: {
		formatDate,
	},
	computed: {
		searchData() {
			if (this.month) {
				const [queryMonthBegin, queryMonthEnd] = this.month;
				return { queryMonthBegin, queryMonthEnd, ...this.pagination };
			} else {
				return { ...this.pagination };
			}
		},
	},
	methods: {
		search() {
			this.pagination.pageNum = 1;
			this.getList();
		},
		changeIncoice() {
			this.temporaryData = { ...this.invoiceForm };
			this.isChangeIncoice = true;
		},
		cencal() {
			this.invoiceForm = { ...this.temporaryData };
			this.isChangeIncoice = false;
		},
		async getData() {
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/order/invoiceConfig`,
			});
			if (res?.code == 200) {
				const { perElecInvoiceReview, enterPaperInvoiceReview, enterElecInvoiceReview } = res.data;
				this.invoiceForm = {
					perElecInvoiceReview: Boolean(perElecInvoiceReview),
					enterPaperInvoiceReview: Boolean(enterPaperInvoiceReview),
					enterElecInvoiceReview: Boolean(enterElecInvoiceReview),
				};
			}
		},
		// 保存
		async save() {
			const { invoiceForm } = this;
			const data = {};
			for (const key in invoiceForm) {
				data[key] = Number(invoiceForm[key]);
			}
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/order/addInvoiceConfig`,
				data,
			});
			if (res?.code == 200) {
				this.$message.success(res.message);
				this.getList();
			}
			this.isChangeIncoice = false;
		},
		// 获取列表
		async getList() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/order/invoiceConfigList`,
				data: this.searchData,
			});
			if (res?.code == 200) {
				const { total, list } = res.data;
				this.total = total;
				this.tableData = list;
			}
		},
		// 翻页操作
		handleChangePage(page) {
			this.pagination.pageNum = page;
			this.getList();
		},
		// 切换页面条数
		handleSizeChange(pageSize) {
			this.pagination = {
				pageNum: 1,
				pageSize,
			};
			this.getList();
		},
	},

	mounted() {
		this.getData();
		this.getList();
	},
};
</script>
<style lang="scss" scoped>
.marginL20 {
	margin-left: 20px;
}
.marginT20 {
	margin-top: 20px;
}
.form {
	height: 230px;
}

.header {
	height: 32px;
	line-height: 32px;
}
::v-deep .lineHeight .el-form-item__content {
	line-height: 1.8;
}
::v-deep .form .el-form-item {
	margin-bottom: 0;
}
</style>