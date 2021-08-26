<template>
	<div class="cloud-business-unconfirmed">
		<guideBar>
			<el-button type="primary">导出EXCEL</el-button>
		</guideBar>
		<el-card class="box-card">
			<searchPanel
				:config="CLOUD_BUSINESS_UNCONFIRMED_CONFIG"
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
							<el-button type="text" class="btns" @click="reviedwed(scope.data)">处理</el-button>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="待处理" name="pending">
					<tableList
						border
						:dataSource="pending.data"
						:columns="PENDING_COLUMNS"
						:pagination="pending.pagination"
						:dataTotal="pending.data.length"
						:options="options"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button type="text" class="btns" @click="reviedwed(scope.data)">处理</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 处理弹窗 -->
		<el-dialog title="未确认款项处理" :visible.sync="show" width="740px">
			<el-form
				label-suffix=":"
				class="unconfirmed"
				:model="unconfirmedObj"
				label-width="110px"
				ref="unconfirmedRef"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="服务中心编号" prop="serviceCenterNo">
							<el-input size="medium" v-model="unconfirmedObj.serviceCenterNo"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="search-btutton-col">
						<el-button type="primary" size="medium">查询</el-button>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="服务中心名称">
							<div>{{ '某某某服务中心' }}</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="负责人卡号">
							<span>{{ '1234567' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="分公司编号">
							<span>{{ '23456' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="收款银行名称">
							<span>{{ '中国银行' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="付款账号">
							<span>{{ '2345678906' }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="款项金额">
							<span>{{ '￥12345' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="系统到账时间">
							<span>{{ '2020-05-01 12:30:30' }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="未确认原因">
							<span>{{ '无法识别款项' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="处理类型" prop="handlerType">
							<el-select size="medium" v-model="unconfirmedObj.handlerType" placeholder="请选择">
								<el-option label="汇入无法识别款项确认押货款" value="1"></el-option>
								<el-option label="汇入无法识别款项办理退款" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="16">
						<el-form-item label="备注" prop="remark">
							<el-input type="textarea" size="medium" v-model="unconfirmedObj.remark" placeholder="请输入"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<!-- 按钮组 -->
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleSave" class="dialog-btn mr-16">提交</el-button>
				<el-button @click="handleCacel" class="dialog-btn">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { CLOUD_BUSINESS_UNCONFIRMED_CONFIG, All_COLUMNS, PENDING_COLUMNS } from './config';
export default {
	name: 'cloudBusinessUnconfirmed',
	data() {
		return {
			CLOUD_BUSINESS_UNCONFIRMED_CONFIG,
			All_COLUMNS,
			PENDING_COLUMNS,
			activeStatusTab: 'all',
			all: {
				data: [
					{
						serviceCenterNo: 12323,
					},
				],
				pagination: {},
			},
			pending: {
				data: [
					{
						serviceCenterNo: 2,
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
			show: false,
			unconfirmedObj: {
				serviceCenterNo: '', // 服务中心编号
				handlerType: '', // 处理类型
				remark: '', // 备注
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
		// 处理
		reviedwed(row) {
			console.log(row);
			this.show = true;
		},
		// 提交
		handleSave() {
			console.log(this.unconfirmedObj);
			this.show = false;
		},
		// 取消
		handleCacel() {
			this.$refs.unconfirmedRef.resetFields();
			this.show = false;
		},
	},
};
</script>
<style lang="scss" scoped>
::v-deep.cloud-business-unconfirmed {
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
}
::v-deep.unconfirmed {
	padding: 0 30px;
	box-sizing: border-box;
	.el-input,
	.el-select,
	.el-date-editor {
		width: 196px;
	}
	.el-form-item {
		margin-bottom: 10px;
	}
	.el-textarea__inner {
		height: 90px;
	}
}
</style>
