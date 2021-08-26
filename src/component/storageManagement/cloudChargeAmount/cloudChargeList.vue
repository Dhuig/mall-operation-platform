<template>
	<div class="cloud-charge-list">
		<guideBar>
			<el-button v-permission="'cloud_charge_list_batch_modify'" type="primary" @click="batchImport">
				批量调整额度
			</el-button>
			<el-button v-permission="'cloud_charge_list_export'" type="primary" @click="batchExport">导出EXCEL</el-button>
		</guideBar>
		<el-card class="box-card">
			<searchPanel
				:config="activeTab === 'all' ? CLOUD_CHARGE_LIST_CONFIG : TOBEREVIWED_LIST_CONFIG"
				v-model="searchConfig"
				@search="search"
			/>
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
							<el-button
								v-permission="'cloud_charge_list_detail|cloud_charge_detail'"
								type="text"
								@click="detail(scope.data)"
							>
								详情
							</el-button>
							<!-- <span class="btns" @click="adjustment(scope.data)">调整</span> -->
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="待审核" name="tobeReviewed">
					<div class="mb-16" v-permission="'cloud_charging_list_batch_audit'">
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
							<el-button v-permission="'cloud_charging_list_audit'" type="text" @click="reviedwed(scope.data)">
								审核
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 调整弹窗 -->
		<el-dialog :title="isAjust ? '最大押货额度调整' : '最大押货额度调整审核'" :visible.sync="show" width="600px" v-drag>
			<el-form :model="adjust" class="add-user" ref="adjustRef" :rules="batchExamineRules">
				<el-form-item label="服务中心编号:">
					<span>{{ rowInfo.storeCode }}</span>
				</el-form-item>
				<el-form-item label="服务中心名称:">
					<span>{{ rowInfo.storeName }}</span>
				</el-form-item>
				<el-form-item label="负责人卡号:">
					<span>{{ rowInfo.cardNo }}</span>
				</el-form-item>
				<el-form-item label="所属分公司:">
					<span>{{ rowInfo.companyName }}</span>
				</el-form-item>
				<el-form-item label="当前最大押货额度:">
					<span>￥{{ rowInfo.currentMaxRemit }}</span>
				</el-form-item>
				<el-form-item label="申请调整至:" prop="money">
					<el-input v-model="rowInfo.money" size="medium" :disabled="!isAjust" />
				</el-form-item>
				<el-form-item label="调整理由:" prop="applyRemark">
					<el-input type="textarea" v-model="rowInfo.applyRemark" size="medium" :disabled="!isAjust" />
				</el-form-item>
				<el-form-item label="审核结果:" prop="verifyStatus" v-if="!isAjust">
					<el-select size="medium" v-model="adjust.verifyStatus">
						<el-option label="通过" value="1"></el-option>
						<el-option label="拒绝" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="审核备注:" prop="verifyRemark" v-if="!isAjust">
					<el-input type="textarea" v-model="adjust.verifyRemark" size="medium" />
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button
					type="primary"
					:loading="submitLoading"
					@click="handleExamineSave('adjustRef')"
					class="dialog-btn mr-16"
				>
					审核
				</el-button>
				<el-button @click="handleExamineCacel('adjustRef')" class="dialog-btn">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 批量审核 -->
		<el-dialog title="批量审核" :visible.sync="batchExamineShow" width="600px" v-drag>
			<el-form :model="batchExamine" class="add-batch" :rules="batchExamineRules" ref="batchExamineRef">
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
				<el-button type="primary" @click="batchExamineSave('batchExamineRef')" class="dialog-btn mr-16">
					批量审核
				</el-button>
				<el-button @click="batchExamineCacel('batchExamineRef')" class="dialog-btn">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import {
	CLOUD_CHARGE_LIST_CONFIG,
	All_LIST_COLUMNS,
	TOBEREVIEWED_LIST_COLUMNS,
	URL_TYPE,
	TOBEREVIWED_LIST_CONFIG,
} from './config';
import qs from 'querystring';
import { exportExcel } from 'util';
export default {
	name: 'cloudChargeList',
	data() {
		return {
			//导入失败
			exportFail: {},
			CLOUD_CHARGE_LIST_CONFIG,
			URL_TYPE,
			All_LIST_COLUMNS,
			TOBEREVIEWED_LIST_COLUMNS,
			TOBEREVIWED_LIST_CONFIG,
			activeTab: 'all',
			searchConfig: {
				storeCode: '',
				companyCode: '',
				time: [],
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
			selection: [], // 勾选的数据
			show: false,
			batchExamineShow: false, // 批量操作弹窗
			isAjust: true, // 调整内容or审核内容
			adjust: {
				// 调整对象
				verifyStatus: '',
				verifyRemark: '',
			},
			batchExamine: {
				// 批量审核对象
				verifyStatus: '',
				verifyRemark: '',
			},
			batchExamineRules: {
				verifyStatus: [{ required: true, message: '请选择', trigger: 'change' }],
			},
			rowInfo: {}, // 每行数据信息
			tableRef: '', // 继承表格组件的ref标识
			submitLoading: false,
		};
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.stock,
			};
			return params;
		},
		// 接口url
		urlType() {
			return URL_TYPE[this.activeTab];
		},
		// 搜索参数
		searchFields() {
			const {
				searchConfig: { time, ...obj },
			} = this;
			return {
				...obj,
				startTime: time && time[0] ? this.formatDate(time, 0) : '',
				endTime: time && time[1] ? this.formatDate(time, 1) : '',
			};
		},
	},
	watch: {
		urlType() {
			this.getList();
		},
	},
	methods: {
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
		// 搜索的时候初始化第一页
		search() {
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
		// 批量调整额度
		batchImport() {
			this.$go('cloud_charge_import', { title: '服务中心押货额管理批量调整' });
		},
		// 获取所有分公司
		async selectCrmCompanyInfos() {
			const res = await this.$fetch(`mgmt/sys/current/user/company/list`);
			if (res && res.data) {
				let allCompany = [];
				res.data.forEach(v => {
					allCompany.push({ label: v.name, value: v.code });
				});
				// this.CLOUD_CHARGE_LIST_CONFIG.form[1].options = allCompany;
				this.TOBEREVIWED_LIST_CONFIG.form[1].options = allCompany;
			}
		},
		// 详情
		detail(row) {
			this.$go('cloud_charge_detail', {
				title: '服务中心押货额详情',
				row: JSON.stringify(row),
			});
		},
		// 调整
		adjustment(row) {
			this.adjust = row;
			this.show = true;
			this.isAjust = true;
		},
		// 审核确定按钮
		handleExamineSave(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const params = {
						...this.adjust,
						verifyStatus: +this.adjust.verifyStatus,
						ids: [this.rowInfo.id],
					};
					await this.apply(params);
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
			this.rowInfo = row;
			this.show = true;
			this.isAjust = false;
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
		// 批量导出
		batchExport() {
			const { activeTab, searchFields } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this[activeTab];
			const params = {
				pageNum,
				pageSize,
				...searchFields,
			};
			exportExcel('/mgmt/inventory/mortgageAmount/exportMortgageAmountMaxRemit', params);
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
					await this.apply(params);
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
		// 审核接口
		async apply(params) {
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/inventory/mortgageAmount/verifyMortgageAmountMaxRemitApply',
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
		// 请求数据
		async getList() {
			const { activeTab, urlType, searchFields } = this;
			switch (searchFields.companyCode) {
				case 1:
					searchFields.companyCode = '001001';
					break;
				case 2:
					searchFields.companyCode = '001006';
					break;
				case 3:
					searchFields.companyCode = '003005';
					break;
				case 4:
					searchFields.companyCode = '002001';
					break;
				case 5:
					searchFields.companyCode = '002002';
					break;
			}
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this[activeTab];
			this[activeTab].loading = true;
			const params = {
				pageNum,
				pageSize,
				...searchFields,
			};

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
		this.getList();
		// 获取所有分公司
		this.selectCrmCompanyInfos();
	},
};
</script>
<style lang="scss" scoped>
::v-deep.cloud-charge-list {
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
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
}
::v-deep.add-user {
	padding-right: 25%;
	.el-form-item {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		margin-bottom: 0px;
		.el-form-item__content,
		.el-input,
		.el-select,
		.el-date-editor {
			width: 224px;
		}
	}
	.el-textarea__inner {
		margin: 18px 0;
	}
}
::v-deep.add-batch {
	padding-right: 25%;
	.el-form-item {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		margin-bottom: 24px;
		.el-form-item__content,
		.el-input,
		.el-select,
		.el-date-editor {
			width: 224px;
		}
	}
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
.process {
	width: 80%;
	margin: 0 auto;
	::v-deep .el-upload-list__item.is-ready {
		width: 150px;
	}
	li {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px;
		.flex_font {
			display: flex;
			align-items: center;
			margin-bottom: 20px;
		}
	}
}
</style>
