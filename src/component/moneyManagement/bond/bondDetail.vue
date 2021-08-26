<template>
	<div class="bond-detail">
		<guideBar>
			<el-button type="primary" @click="addCraft">手工录入保证金</el-button>
			<el-button type="primary">导出EXCEL</el-button>
		</guideBar>
		<el-card class="box-card">
			<div class="title clearfix" slot="header">基本信息</div>
			<el-row class="min-width mb-24">
				<el-col :span="8" class="flex"
					><div class="label">分公司:</div>
					<div class="content">河北分公司</div></el-col
				>
				<el-col :span="8" class="flex"
					><div class="label">服务中心编号:</div>
					<div class="content">991598</div></el-col
				>
				<el-col :span="8" class="flex"
					><div class="label">服务中心名称:</div>
					<div class="content">河北某革服务中心</div></el-col
				>
			</el-row>
			<el-row class="min-width mb-24">
				<el-col :span="8" class="flex"
					><div class="label">开店保证金余额:</div>
					<div class="content">￥20000.00</div></el-col
				>
				<el-col :span="8" class="flex"
					><div class="label">特批押货保证金余额:</div>
					<div class="content">￥20000.00</div></el-col
				>
			</el-row>
		</el-card>
		<el-card class="box-card">
			<searchPanel :config="BOND_DETAIL_CONFIG" @search="handleSearch" @reset="handleReset" />
		</el-card>
		<el-card class="box-card">
			<el-tabs v-model="activeStatusTab">
				<el-tab-pane label="全部" name="all">
					<tableList
						border
						:dataSource="all.data"
						:columns="All_COLUMNS"
						:pagination="all.pagination"
						:dataTotal="all.pagination.total"
						:options="options"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<div>
								<span class="btns" @click="reviedwed(scope.data)">审核</span>
							</div>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="待审核" name="tobeReviewed">
					<div class="mb-16">
						<el-button type="primary" @click="handleBatchExamine">批量审核</el-button>
					</div>
					<tableList
						border
						:dataSource="tobeReviewed.data"
						:columns="TOBEREVIEWED_COLUMNS"
						:pagination="tobeReviewed.pagination"
						:dataTotal="tobeReviewed.pagination.total"
						:options="optionsReviewed"
						@toggleRowSelection="toggleRowSelection"
						@handleSelectionChange="handleSelectionChange"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<div>
								<span class="btns" @click="reviedwed(scope.data)">审核</span>
							</div>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 新增手工押货款项 -->
		<el-dialog title="手工录入保证金" :visible.sync="depositShow" width="740px">
			<el-form
				label-suffix=":"
				class="add-deposit"
				:model="deposit"
				label-width="110px"
				ref="depositFormRef"
				:rules="rules"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="服务中心编号">
							<div>{{ '123456' }}</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="服务中心名称">
							<div>{{ '某某某服务中心' }}</div>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="负责人">
							<div>{{ '黄某某' }}</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="分公司">
							<div>{{ '广东分公司' }}</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="保证金类型" prop="bondType">
							<el-select size="medium" v-model="deposit.bondType" placeholder="请选择">
								<el-option label="开启保证金" value="1"></el-option>
								<el-option label="特批押货保证金" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="转账方式" prop="transfer">
							<el-select size="medium" v-model="deposit.transfer" placeholder="请选择">
								<el-option label="支付宝" value="1"></el-option>
								<el-option label="微信" value="2"></el-option>
								<el-option label="网银" value="3"></el-option>
								<el-option label="现金存入" value="4"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="保证金金额" prop="depositAmount">
							<el-input
								size="medium"
								v-model="deposit.depositAmount"
								placeholder="请输入"
								onkeyup="value = value.replace(/[^\- \d.]/g,'')"
							></el-input>
							<span class="tip">(正数表示增加，负数则表示扣减)</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="付款账号" prop="payAccount">
							<el-input size="medium" v-model="deposit.payAccount" placeholder="请输入"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="付款银行名称" prop="payBank">
							<el-select size="medium" v-model="deposit.payBank" placeholder="请选择">
								<el-option label="中国工商" value="1"></el-option>
								<el-option label="中国招商" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="16">
						<el-form-item label="备注" prop="desciption">
							<el-input type="textarea" size="medium" v-model="deposit.desciption" placeholder="请输入"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="save('depositFormRef')" class="dialog-btn mr-16">提交</el-button>
				<el-button @click="cacel('depositFormRef')" class="dialog-btn">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 审核弹窗 -->
		<el-dialog title="手工款项审核" :visible.sync="show" width="740px">
			<el-form label-suffix=":" class="pass-or-detail" :model="passObj" label-width="110px" ref="passRef">
				<el-row>
					<el-col :span="12">
						<el-form-item label="服务中心编号">
							<span>{{ '23456' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="服务中心名称">
							<div>{{ '某某某服务中心' }}</div>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="负责人">
							<div>{{ '黄某某' }}</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="分公司">
							<span>{{ '广东分公司' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="保证金类型">
							<span>{{ '开店保证金' }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="转账方式">
							<span>{{ '微信' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="保证金金额">
							<span>{{ '+￥9000' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="付款账号">
							<span>{{ '1111213432411' }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="付款银行名称">
							<span>{{ '中国银行' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="状态">
							<span>{{ '待审核' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="备注">
							<span>{{ '某某某某茜某茜茜' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="提交人">
							<span>{{ '黄某某' }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="提交时间">
							<span>{{ '2020-05-09 12:30:45' }}</span>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="审核结果" prop="result" class="self-item">
							<el-select size="medium" v-model="passObj.result">
								<el-option label="已通过" value="1"></el-option>
								<el-option label="未通过" value="0"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="16">
						<el-form-item label="审核备注" prop="remark">
							<el-input type="textarea" size="medium" v-model="passObj.remark" placeholder="请输入"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<!-- 按钮组 -->
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleSave" class="dialog-btn mr-16">审核</el-button>
				<el-button @click="handleCacel" class="dialog-btn">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 批量审核 -->
		<el-dialog title="批量审核" :visible.sync="batchExamineShow" width="600px">
			<el-form :model="batchExamine" class="add-user">
				<el-form-item label="审核数量合计:">
					<span>100</span>
				</el-form-item>
				<el-form-item label="审核状态:">
					<el-select size="medium" v-model="batchExamine.status">
						<el-option label="已通过" value="1"></el-option>
						<el-option label="未通过" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注:" prop="desc">
					<el-input type="textarea" v-model="batchExamine.desc" size="medium" />
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="batchExamineShow = false" class="dialog-btn mr-16">批量审核</el-button>
				<el-button @click="batchExamineShow = false" class="dialog-btn">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { BOND_DETAIL_CONFIG, All_COLUMNS, TOBEREVIEWED_COLUMNS } from './config';
export default {
	name: 'bondDetail',
	data() {
		const product = {
			payAccount: 'YH9092881912000048',
			payBankName: 909288,
			transfer: 232,
			bondMoney: 1292,
			bondType: '2019-12-25 16:57:28',
			person: 2,
			submissionTime: '服务中心押货',
			ReviewedResult: '调账不发货',
			ReviewedPerson: 'sdsfdsf',
			ReviewedTime: '222222222',
			ReviewedRemark: 'sdfsfsfsdfsf',
		};
		return {
			BOND_DETAIL_CONFIG,
			All_COLUMNS,
			TOBEREVIEWED_COLUMNS,
			activeStatusTab: 'all',
			all: {
				data: Array(3).fill(product),
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			tobeReviewed: {
				data: [
					{
						payAccount: 'YH9092881912000048',
						payBankName: 909288,
						transfer: 232,
						bondMoney: 1292,
						bondType: '2019-12-25 16:57:28',
						person: 2,
						submissionTime: '服务中心押货',
						ReviewedResult: '调账不发货',
					},
					{
						payAccount: 'YH9092881912000048',
						payBankName: 909288,
						transfer: 232,
						bondMoney: 1292,
						bondType: '2019-12-25 16:57:28',
						person: 2,
						submissionTime: '服务中心押货',
						ReviewedResult: '调账不发货',
					},
				],
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
			batchExamine: {}, // 批量审核对象
			show: false, // 审核弹窗
			passObj: {
				// 审核数据
				result: '', // 审核结果
				remark: '', //审核备注
			},
			depositShow: false, // 新增手工弹窗
			deposit: {
				bondType: '', // 保证金类型
				transfer: '', // 转账方式
				depositAmount: '', // 保证金金额
				payAccount: '', // 付款账户
				payBank: '', // 付款银行名称
				desciption: '', // 备注
			},
			rules: {
				bondType: [{ required: true, message: '请选择保证金类型', trigger: 'change' }],
				transfer: [{ required: true, message: '请选择转账方式', trigger: 'change' }],
				depositAmount: [
					{
						required: true,
						message: '请输入保证金金额',
						trigger: 'change',
					},
				],
			},
		};
	},
	methods: {
		// 查询事件
		handleSearch(val) {
			console.log('emit handleSearch', val);
		},
		// 重置事件
		handleReset(val) {
			console.log('emit handleReset', val);
		},
		// 初始化清空复选框勾选状态
		toggleRowSelection(that) {
			return that.clearSelection();
		},
		// 复选框选中项
		handleSelectionChange(val) {
			console.log(val);
			this.selection = val;
		},
		// 分页触发事件
		handleChangePage(currentPage) {
			console.log('currentPage', currentPage);
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			console.log('pageSize', pageSize);
		},
		// 添加
		addCraft() {
			this.depositShow = true;
		},
		save(formName) {
			console.log(formName);
			this.$refs[formName].validate((valid) => {
				if (valid) {
					console.log('新增提交', this.deposit);
					this.depositShow = false;
					// this.$refs[formName].resetFields();
				}
			});
		},
		cacel(formName) {
			this.$refs[formName].resetFields();
			this.depositShow = false;
		},
		// 审核
		reviedwed(row) {
			console.log(row);
			this.show = true;
		},
		// 保存审核按钮
		handleSave() {
			console.log(this.passObj);
			this.show = false;
		},
		// 取消审核按钮
		handleCacel() {
			this.$refs.passRef.resetFields();
			this.show = false;
		},
		// 批量审核
		handleBatchExamine() {
			if (!this.selection.length) {
				this.$message({
					message: '至少勾选一项!',
					type: 'error',
				});
			} else {
				console.log('000', this.selection);
				this.batchExamineShow = true;
			}
		},
	},
};
</script>
<style lang="scss" scoped>
::v-deep.bond-detail {
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}
	.title {
		font-weight: 500;
		color: rgba(48, 51, 54, 1);
	}

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
	.dialog-footer {
		display: flex;
		justify-content: center;
	}
	.el-dialog__footer {
		padding-bottom: 30px;
	}
	.dialog-btn {
		width: 100px;
	}
	.mr-16 {
		margin-right: 16px;
	}
	.tip {
		color: #999;
		margin-left: 16px;
	}
}
::v-deep.add-deposit {
	padding: 0 30px;
	box-sizing: border-box;
	.el-input,
	.el-select,
	.el-date-editor {
		width: 196px;
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
}
::v-deep.pass-or-detail {
	padding: 0 30px;
	box-sizing: border-box;
	.el-form-item {
		margin-bottom: 2px;
	}
	.el-textarea__inner {
		height: 90px;
	}
	.self-item {
		margin-bottom: 12px;
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
</style>
