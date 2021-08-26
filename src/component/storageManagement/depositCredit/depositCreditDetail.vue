<template>
	<div class="deposit-credit-detail">
		<guideBar>
			<el-button type="primary" v-permission="'deposit_credit_detail_change_limit_by_hand'" @click="addCraft">
				手工调整信誉额
			</el-button>
		</guideBar>
		<el-card class="box-card">
			<searchPanel
				:config="DEPOSIT_CREDIT_DETAIL_CONFIG"
				:showReset="false"
				v-model="searchConfig"
				@search="handleSearch"
				@reset="getList"
			/>
		</el-card>
		<!-- 基本信息 -->
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>基本信息</span>
			</div>
			<el-row class="min-width mb-24">
				<el-col :span="8" class="flex">
					<div class="label">服务中心编号:</div>
					<div class="content">{{ detailInfo && detailInfo.storeCode }}</div>
				</el-col>
				<el-col :span="8" class="flex">
					<div class="label">服务中心名称:</div>
					<div class="content">{{ detailInfo && detailInfo.storeName }}</div>
				</el-col>
				<el-col :span="8" class="flex">
					<div class="label">分公司:</div>
					<div class="content">{{ detailInfo && detailInfo.companyName }}</div>
				</el-col>
			</el-row>
			<el-row class="min-width mb-24">
				<el-col :span="8" class="flex">
					<div class="label">当前信誉额:</div>
					<div class="content">￥{{ creditAmountTotal.creditTotalAmount }}</div>
				</el-col>
			</el-row>
		</el-card>
		<!--调整历史  -->
		<el-card class="box-card">
			<tableList
				border
				:loading="all.loading"
				:dataSource="all.data"
				:columns="All_DETAIL_COLUMNS"
				:pagination="all.pagination"
				:dataTotal="all.pagination.total"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<div>
						<span
							class="btns"
							@click="reviedwed(scope.data)"
							v-if="+scope.data.verifyStatus === 3"
							v-permission="'deposit_credit_detail_audit'"
						>
							审核
						</span>
					</div>
				</template>
			</tableList>
		</el-card>
		<!-- 审核弹窗 -->
		<el-dialog title="信誉额审核" :visible.sync="show" width="600px" v-drag>
			<el-form :model="creditAmount" class="add-user" :rules="batchExamineRules" ref="creditRef">
				<el-form-item label="服务中心编号:">
					<span>{{ detailInfo && detailInfo.storeCode }}</span>
				</el-form-item>
				<el-form-item label="服务中心名称:">
					<span>{{ detailInfo && detailInfo.storeName }}</span>
				</el-form-item>
				<el-form-item label="分公司名称:">
					<span>{{ detailInfo && detailInfo.companyName }}</span>
				</el-form-item>
				<el-form-item label="当前信誉额:">
					<span>￥{{ creditAmountTotal.creditTotalAmount }}</span>
				</el-form-item>
				<el-form-item label="调整金额:" prop="money">
					<span>￥{{ rowInfo && rowInfo.money }}</span>
				</el-form-item>
				<el-form-item label="协议图片:" v-if="rowInfo && rowInfo.source === 1">
					<div class="img_box" v-if="rowInfo.imgArr.length !== 0">
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
				<!-- <el-form-item label="生效日期:" prop="money">
					<span>￥{{ rowInfo&&rowInfo.effectTime }}</span>
				</el-form-item>
				<el-form-item label="到期日期:" prop="money">
					<span>￥{{ rowInfo&&rowInfo.expireTime }}</span>
				</el-form-item>-->
				<el-form-item label="调整备注:" prop="applyRemark">
					<span>{{ rowInfo && rowInfo.applyRemark }}</span>
				</el-form-item>
				<el-form-item label="审核结果:" prop="verifyStatus">
					<el-select size="medium" v-model="creditAmount.verifyStatus">
						<el-option label="通过" value="1"></el-option>
						<el-option label="拒绝" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="审核备注:" prop="verifyRemark">
					<el-input type="textarea" v-model="creditAmount.verifyRemark" size="medium" />
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button
					type="primary"
					@click="handleExamineSave('creditRef')"
					:loading="subLoading"
					class="dialog-btn mr-16"
				>
					提交
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
					<el-input type="textarea" maxlength="50" v-model="batchExamine.verifyRemark" size="medium" />
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="batchExamineSave('batchExamineRef')" class="dialog-btn mr-16">
					批量审核
				</el-button>
				<el-button @click="batchExamineCacel('batchExamineRef')" class="dialog-btn">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 手工调整信誉额 -->
		<el-dialog title="手工调整信誉额" :visible.sync="craftShow" width="600px" v-drag>
			<el-form label-suffix=":" class="add-craft" :model="craft" :rules="craftRules" ref="craftRef">
				<el-form-item label="服务中心编号">
					<span>{{ detailInfo && detailInfo.storeCode }}</span>
				</el-form-item>
				<el-form-item label="服务中心名称">
					<span>{{ detailInfo && detailInfo.storeName }}</span>
				</el-form-item>
				<el-form-item label="分公司名称">
					<span>{{ detailInfo && detailInfo.companyName }}</span>
				</el-form-item>
				<el-form-item label="当前信誉额">
					<span>￥{{ creditAmountTotal.creditTotalAmount }}</span>
				</el-form-item>
				<el-form-item label="调整金额" prop="money">
					<el-input size="medium" v-model="craft.money"></el-input>
				</el-form-item>
				<!-- <el-form-item label="生效日期" prop="openTime">
					<el-date-picker
						type="date"
						v-model="craft.openTime"
						placeholder="选择日期"
						:picker-options="pickerOptions"
						value-format="yyyy-MM-dd"
						@change="timeChange"
						size="medium"
					/>
				</el-form-item> -->
				<el-form-item label="到期日期" prop="endTime">
					<el-date-picker
						type="datetime"
						v-model="craft.endTime"
						placeholder="选择日期"
						:picker-options="pickerOptions"
						value-format="yyyy-MM-dd HH:mm:ss"
						size="medium"
					/>
				</el-form-item>
				<el-form-item label="调整备注" prop="applyRemark">
					<el-input type="textarea" v-model="craft.applyRemark" size="medium" />
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="subLoading" @click="craftSave('craftRef')" class="dialog-btn mr-16">
					提交
				</el-button>
				<el-button @click="craftCacel('craftRef')" class="dialog-btn">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { DEPOSIT_CREDIT_DETAIL_CONFIG, All_DETAIL_COLUMNS, TOBEREVIEWED_DETAIL_COLUMNS, DETAIL_TYPE } from './config';
import qs from 'querystring';
import { formatDateDefault } from 'util/formValidation';

export default {
	name: 'depositCreditDetail',
	data() {
		return {
			DEPOSIT_CREDIT_DETAIL_CONFIG,
			All_DETAIL_COLUMNS,
			TOBEREVIEWED_DETAIL_COLUMNS,
			activeTab: 'all',
			creditAmountTotal: {}, // 当前信誉额
			searchConfig: {
				validTime: [], // 生效时间
				expireTime: [], // 到期时间
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
			batchExamineShow: false, // 批量操作弹窗
			show: false, // 审核弹窗
			craftShow: false,
			craft: {
				money: '',
				openTime: '',
				endTime: '',
				applyRemark: '',
			},
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
			craftRules: {
				money: [
					{ required: true, message: '请输入保证金金额', trigger: 'blur' },
					// { pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: 'blur' },
					// { pattern: /^[0-9.]+$/, message: '请输入数字或小数点', trigger: 'blur' },
					{ pattern: /^-?([1-9]\d*|0)(\.\d{1,2})?$/, message: '请输入数字或小数点,小数最多不超过2位', trigger: 'blur' },
				],
				// openTime: [{ required: true, message: '请选择生效日期', trigger: 'blur' }],
				endTime: [{ required: true, message: '请选择到期日期', trigger: 'blur' }],
				applyRemark: [{ required: true, message: '请输入调整理由', trigger: 'blur' }],
			},
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7; //禁用以前的日期，今天不禁用
					// return date.getTime() <= Date.now();    //禁用今天以及以前的日期
				},
			},
			detailInfo: {}, // 列表页传递过来的数据
			tableRef: '', // 继承表格组件的ref标识
			rowInfo: {}, // 每行列表数据
			subLoading: false,
		};
	},
	computed: {
		// 审核类型
		verifyStatus() {
			return DETAIL_TYPE[this.activeTab];
		},
		// 搜索参数
		searchFields() {
			const {
				searchConfig: { examineTime, expireTime },
			} = this;
			return {
				startTime: examineTime && examineTime[0] ? formatDateDefault(examineTime[0]) : '',
				endTime: examineTime && examineTime[1] ? formatDateDefault(examineTime[1]) : '',
				startDay: expireTime && expireTime[0] ? formatDateDefault(expireTime[0]) : '',
				endDay: expireTime && expireTime[1] ? formatDateDefault(expireTime[1]) : '',
			};
		},
	},
	watch: {
		verifyStatus() {
			this.getList();
		},
	},
	methods: {
		// 格式化时间
		// formatDate(item,index) {
		// 	if(item&&item.length>=2) {
		// 		let d = new Date(item[index]);
		// 		let YY = d.getFullYear() + '-';
		// 		let MM = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '-';
		// 		let DD = (d.getDate() < 10 ? '0' + (d.getDate()) : d.getDate());
		// 		return YY + MM + DD;
		// 	}else {
		// 		return '';
		// 	}
		// },
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
		// 手工调整信誉额
		addCraft() {
			this.craftShow = true;
			let examineData = this.all.data.find(({ verifyStatus }) => {
				return verifyStatus === 3;
			});
			this.craft = {
				money: (examineData && examineData.money) || '',
				applyRemark: (examineData && examineData.applyRemark) || '',
			};
		},
		// 手工调整信誉额-日期选择
		timeChange() {
			if (this.craft.openTime && this.craft.endTime) {
				if (new Date(this.craft.openTime).getTime() > new Date(this.craft.endTime).getTime()) {
					this.$message({
						message: '生效日期不能大于到期日期!',
						type: 'warning',
					});
					this.craft.openTime = '';
				}
			}
		},
		// 手工调整确认按钮
		craftSave(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					if (Number(this.craft.money) + Number(this.creditAmountTotal.creditTotalAmount) < 0) {
						this.$message({
							message: '信誉额不能为负数，请重新输入调整金额!',
							type: 'warning',
						});
						return;
					}
					this.subLoading = true;
					const params = {
						...this.craft,
						money: +this.craft.money,
						storeCode: this.detailInfo.storeCode,
					};
					await this.addMortgageAmount(params);
					this.craftShow = false;
					this.subLoading = false;
					this.$refs[formName].resetFields();
					this.getList();
				}
			});
		},
		// 手工取消
		craftCacel(formName) {
			this.craftShow = false;
			this.$refs[formName].resetFields();
		},
		// 审核确定按钮
		handleExamineSave(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					this.subLoading = true;
					const params = {
						...this.creditAmount,
						verifyStatus: +this.creditAmount.verifyStatus,
						ids: [this.rowInfo.id],
					};
					await this.creditAudit(params);
					this.show = false;
					this.subLoading = false;
					this.$refs[formName].resetFields();
					this.getList();
					this.getCreditAmountTotal(); // 当前押货额
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
		// 押货信誉额变更申请
		async addMortgageAmount(params) {
			const res = await this.$fetch({
				method: 'get',
				url: '/mgmt/inventory/mortgageAmount/addMortgageAmountCreditApply',
				params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			} else {
				this.$message({
					type: 'error',
					message: res.data.message,
				});
			}
		},
		// 获取押货信誉额合计接口
		async getCreditAmountTotal() {
			const data = {
				storeCode: this.detailInfo.storeCode,
				companyCode: '',
				moneyType: '',
				startTime: '',
				endTime: '',
			};
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/inventory/mortgageAmount/countCreditAmount`,
				data,
			});

			if (res && res.data) {
				this.creditAmountTotal = res.data;
			} else {
				this.creditAmountTotal = {};
			}
		},
		// 押货信誉额审核接口
		async creditAudit(params) {
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
		},
		// 请求数据
		async getList() {
			const { detailInfo, searchFields } = this;
			console.log(searchFields);
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.all;
			this.all.loading = true;
			const params = {
				pageNum,
				pageSize,
				storeCode: detailInfo.storeCode,
				...searchFields,
			};

			const res = await this.$fetch(
				`/mgmt/inventory/mortgageAmount/listMortgageAmountCreditInfo?${qs.stringify(params)}`
			);

			if (res) {
				const { list, total } = res.data;
				this.all.data = list;
				this.all.pagination.total = total;
			} else {
				this.all.data = [];
				this.all.pagination.total = 0;
			}
			this.all.loading = false;
		},
	},
	created() {
		let rowInfo = this.$route.query.row || '{}';
		this.detailInfo = JSON.parse(rowInfo);
		this.getList();
		this.getCreditAmountTotal();
	},
};
</script>
<style lang="scss" scoped>
::v-deep.deposit-credit-detail {
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}
	.el-form-item {
		.el-form-item__content,
		.el-input,
		.el-select,
		.el-date-editor {
			width: 224px;
		}
	}
	// .el-card__header {
	// 	background-color: #eee;
	// }
	.title {
		margin-bottom: 30px;
		font-weight: 500;
		color: rgba(48, 51, 54, 1);
	}
	.flex {
		display: flex;
		font-weight: 400;
		font-size: 14px;
		color: rgba(92, 98, 104, 1);
		.label {
			width: 150px;
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
	.el-textarea__inner {
		margin: 18px 0;
	}
}
::v-deep.add-craft {
	padding-right: 25%;
	.el-form-item {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		margin-bottom: 18px;
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
.img_box {
	width: 300px;
}
.img_box img {
	width: 100px;
	height: 100px;
	margin-right: 10px;
}
</style>
