<template>
	<div class="cloud-business-remittance">
		<guideBar>
			<el-button type="primary" @click="addCraft">手工录入款项</el-button>
			<el-button type="primary">导出EXCEL</el-button>
		</guideBar>
		<el-card class="box-card">
			<searchPanel
				:config="CLOUD_BUSINESS_REMITTANCE_CONFIG"
				@search="handleSearch"
				@reset="handleReset"
			/>
		</el-card>
		<el-card class="box-card">
			<el-tabs v-model="activeStatusTab">
				<el-tab-pane label="全部" name="all">
					<tableList
						border
						:dataSource="all.data"
						:columns="All_COLUMNS"
						:pagination="all.pagination"
						:dataTotal="all.data.length"
						:options="options"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<div>
								<el-button type="text" class="btns" @click="detail(scope.data)">详情</el-button>
								<el-button type="text" class="btns" @click="reviedwed(scope.data)">审核</el-button>
							</div>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="待审核" name="tobeReviewed">
					<tableList
						border
						:dataSource="tobeReviewed.data"
						:columns="TOBEREVIEWED_COLUMNS"
						:pagination="tobeReviewed.pagination"
						:dataTotal="tobeReviewed.data.length"
						:options="options"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<div>
								<el-button type="text" class="btns" @click="reviedwed(scope.data)">审核</el-button>
							</div>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="已审核" name="passed">
					<tableList
						border
						:dataSource="passed.data"
						:columns="PASSED_COLUMNS"
						:pagination="passed.pagination"
						:dataTotal="passed.data.length"
						:options="options"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button type="text" class="btns" @click="detail(scope.data)">详情</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 新增手工押货款项 -->
		<el-dialog title="新增手工押货款项" :visible.sync="depositShow" width="740px">
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
						<el-form-item label="服务中心编号" prop="serviceCenterNo">
							<el-input size="medium" v-model="deposit.serviceCenterNo"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="search-btutton-col">
						<el-button type="primary" size="medium">查询</el-button>
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
						<el-form-item label="分公司" prop="branchOffice">
							<el-select size="medium" v-model="deposit.branchOffice" placeholder="请选择">
								<el-option label="广东省" value="1"></el-option>
								<el-option label="湖南省" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="款项类型" prop="disbursementsType">
							<el-select size="medium" v-model="deposit.disbursementsType" placeholder="请选择">
								<el-option label="转销售" value="1"></el-option>
								<el-option label="退押货款" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="资金来源" prop="fundsSource">
							<el-select size="medium" v-model="deposit.fundsSource" placeholder="请选择">
								<el-option label="委托扣款" value="1"></el-option>
								<el-option label="手工退款" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="款项金额" prop="disbursements">
							<el-input
								size="medium"
								v-model="deposit.disbursements"
								placeholder="请输入"
								onkeyup="value = value.replace(/[^\- \d.]/g,'')"
							></el-input>
							<span class="tip">(正数表示增加款项，负数则表示扣减款项)</span>
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
		<!-- 审核or详情 -->
		<el-dialog :title="isDetail ? '详情' : '手工款项审核'" :visible.sync="show" width="740px">
			<el-form
				label-suffix=":"
				class="pass-or-detail"
				:model="passObj"
				label-width="110px"
				ref="passRef"
			>
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
						<el-form-item label="款项类型">
							<span>{{ '无法识别款确认押货款' }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="资金来源">
							<span>{{ '无法识别款' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="款项金额">
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
				<!-- 详情show -->
				<el-row v-show="isDetail">
					<el-col :span="12">
						<el-form-item label="审核人">
							<span>{{ '黄某某' }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="审核时间">
							<span>{{ '2020-05-09 12:30:45' }}</span>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="审核结果" prop="result">
							<template v-if="isDetail">
								<span>{{ '已通过' }}</span>
							</template>
							<template v-else>
								<el-radio-group v-model="passObj.result">
									<el-radio label="1">通过</el-radio>
									<el-radio label="0">拒绝</el-radio>
								</el-radio-group>
							</template>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="16">
						<el-form-item label="审核备注" prop="remark">
							<template v-if="isDetail">
								<span>{{ '备注' }}</span>
							</template>
							<template v-else>
								<el-input type="textarea" size="medium" v-model="passObj.remark" placeholder="请输入"></el-input>
							</template>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<!-- 按钮组 -->
			<span slot="footer" class="dialog-footer">
				<template v-if="isDetail">
					<el-button class="dialog-btn" @click="detailCacel">取消</el-button>
				</template>
				<template v-else>
					<el-button type="primary" @click="handleSave" class="dialog-btn mr-16">审核</el-button>
					<el-button @click="handleCacel" class="dialog-btn">取 消</el-button>
				</template>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { CLOUD_BUSINESS_REMITTANCE_CONFIG, All_COLUMNS, TOBEREVIEWED_COLUMNS, PASSED_COLUMNS } from './config';
export default {
	name: 'cloudBusinessRemittance',
	data() {
		return {
			CLOUD_BUSINESS_REMITTANCE_CONFIG,
			All_COLUMNS,
			TOBEREVIEWED_COLUMNS,
			PASSED_COLUMNS,
			activeStatusTab: 'all',
			all: {
				data: [
					{
						serviceCenterNo: 12323,
					},
				],
				pagination: {},
			},
			tobeReviewed: {
				data: [
					{
						serviceCenterNo: 2,
					},
				],
				pagination: {},
			},
			passed: {
				data: [
					{
						serviceCenterNo: 3,
					},
				],
				pagination: {},
			},
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			depositShow: false, // 新增手工弹窗
			deposit: {
				serviceCenterNo: '', // 服务中心编号
				branchOffice: '', // 分公司
				disbursementsType: '', // 新款类型
				fundsSource: '', // 资金来源
				disbursements: '', // 款项金额
				payAccount: '', // 付款账户
				payBank: '', // 付款银行名称
				desciption: '', // 备注
			},
			rules: {
				serviceCenterNo: [{ required: true, message: '请输入服务中心编号', trigger: 'blur' }],
				branchOffice: [{ required: true, message: '请选择分公司', trigger: 'change' }],
				disbursementsType: [{ required: true, message: '请选择款项类型', trigger: 'change' }],
				fundsSource: [{ required: true, message: '请选择资金来源', trigger: 'change' }],
				disbursements: [
					{
						required: true,
						message: '请输入款项金额',
						trigger: 'change',
					},
				],
			},
			show: false, // 审核和详情弹窗
			isDetail: false, // 是否是详情页
			passObj: {
				// 审核数据
				result: '', // 审核结果
				remark: '', //审核备注
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
		// 分页触发事件
		handleChangePage(currentPage) {
			console.log(currentPage);
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			console.log(pageSize);
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
			this.isDetail = false;
		},
		// 详情
		detail(row) {
			console.log(row);
			this.show = true;
			this.isDetail = true;
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
		// 详情弹窗取消按钮
		detailCacel() {
			this.show = false;
		},
	},
};
</script>
<style lang="scss" scoped>
::v-deep.cloud-business-remittance {
	.box-card {
		margin-bottom: 16px;
	}
	.search-btutton-col {
		padding-top: 5px;
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
::v-deep.pass-or-detail {
	padding: 0 30px;
	box-sizing: border-box;
	.el-form-item {
		margin-bottom: 2px;
	}
	.el-textarea__inner {
		height: 90px;
	}
}
</style>
