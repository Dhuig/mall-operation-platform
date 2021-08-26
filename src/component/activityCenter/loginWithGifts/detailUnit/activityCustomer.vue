<template>
	<div>
		<el-tabs v-model="activeName">
			<el-tab-pane label="顾客列表" name="gklist">
				<el-card class="box-card">
					<searchPanel
						v-model="customerSearchConfig"
						:config="LOGIN_GIFTS_CUSTOMER_SEARCH_CONFIG"
						@search="customerSearch"
					/>
				</el-card>
				<el-card class="card-gap">
					<el-row type="flex" align="middle">
						<el-col :span="4" class="section-title">顾客列表</el-col>
						<el-col :span="20">
							<el-row type="flex" justify="end" align="middle">
								<span style="margin-right: 10px">已选{{ customerSelection.length || 0 }}个顾客</span>
								<el-button
									v-permission="'login_gifts_detail_export_activityCustomer'"
									type="primary"
									@click="exportCustomerExcel"
								>
									导出
								</el-button>
								<el-button
									v-permission="'login_gifts_detail_batch_disableCustomer'"
									type="primary"
									@click="batchDisableCustomer"
								>
									批量禁用
								</el-button>
								<el-upload
									v-permission="'login_gifts_detail_import_activityCustomer'"
									class="upload-demo"
									action="/mgmt/prmt/loginGift/importMemberList"
									:show-file-list="false"
									:http-request="uploadCustom"
								>
									<el-button type="primary">导入新增</el-button>
								</el-upload>
								<el-button
									v-permission="'login_gifts_detail_handle_add_activityCustomer'"
									type="primary"
									@click="handleAddCustomer"
								>
									手动新增
								</el-button>
								<el-button
									v-permission="'login_gifts_detail_export_template_activity'"
									type="text"
									@click="templateDownload"
								>
									下载模板
								</el-button>
							</el-row>
						</el-col>
					</el-row>
					<tableList
						border
						:dataSource="customerList.data"
						:columns="LOGIN_GIFTS_CUSTOMER_COLUMNS_CONFIG"
						:pagination="customerList.pagination"
						:dataTotal="customerList.total"
						:loading="customerList.loading"
						:options="{ selection: true }"
						@handleChangePage="customerChangePage"
						@handleSizeChange="customerSizeChange"
						@handleSelectionChange="customerSelectionChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'login_gifts_detail_enable_activityCustomer'"
								type="text"
								@click="toEnable(scope.data)"
								v-if="scope.data.disabled"
							>
								启用
							</el-button>
							<el-button
								v-permission="'login_gifts_detail_disable_activityCustomer'"
								type="text"
								v-else
								@click="toDisable(scope.data)"
							>
								禁用
							</el-button>
						</template>
					</tableList>
				</el-card>
			</el-tab-pane>
			<el-tab-pane label="编辑记录" name="editLogs">
				<el-card class="box-card">
					<searchPanel
						v-model="recordSearchConfig"
						:config="LOGIN_GIFTS_CUSTOMER_RECORD_SEARCH"
						@search="recordSearch"
					/>
				</el-card>
				<el-card class="box-card">
					<el-row type="flex" justify="space-between">
						<div class="section-title">编辑记录</div>
						<el-button v-permission="'login_gifts_detail_export_logs'" type="primary" @click="exportOperateLogs">
							导出
						</el-button>
					</el-row>
					<tableList
						border
						:dataSource="operateLogs.data"
						:columns="LOGIN_GIFTS_CUSTOMER_RECORD_COLUMNS"
						:pagination="operateLogs.pagination"
						:dataTotal="operateLogs.total"
						:loading="operateLogs.loading"
						@handleChangePage="operateLogsHandleChangePage"
						@handleSizeChange="operateLogsHandleSizeChange"
					></tableList>
				</el-card>
			</el-tab-pane>
		</el-tabs>

		<el-dialog title="确认提示" v-drag :visible.sync="statusVisible" width="30%">
			<div class="import-class" v-if="customerStatus.memberState == 1">
				<div class="import-div del-top-text">
					<i class="el-icon-warning color-warning"></i>
					禁用顾客资格确认
				</div>
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

		<el-dialog title="手动新增活动顾客" v-drag :visible.sync="handleAddVisible" width="50%">
			<div class="search-div">
				<el-form :inline="true" label-width="120px">
					<el-form-item label="搜索顾客：" prop="name">
						<el-input v-model.trim="handleAddCardNo" placeholder="输入会员卡号，精准搜索" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleAddSearchCard">搜 索</el-button>
					</el-form-item>
				</el-form>
				<div class="product-class">
					<el-form label-width="120px" v-if="Object.keys(handleAddCustomerMsg).length != 0">
						<el-form-item label="会员卡号：">
							<span>{{ handleAddCustomerMsg.cardNo }}</span>
						</el-form-item>
						<el-form-item label="会员身份：">
							<span>{{ handleAddCustomerMsg.memberType }}</span>
						</el-form-item>
						<el-form-item label="会员姓名：">
							<span>{{ handleAddCustomerMsg.realName }}</span>
						</el-form-item>
						<el-form-item label="注册手机号：">
							<span>{{ handleAddCustomerMsg.mobile }}</span>
						</el-form-item>
					</el-form>
					<div class="nothing" v-else>
						<p class="el-icon-document icon-file"></p>
						<p class="file-text">搜索不到对应的顾客</p>
					</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleAddClose">取 消</el-button>
				<el-button type="primary" @click="handleAddSave">添 加</el-button>
			</span>
		</el-dialog>

		<!-- 导入新增成功弹窗 -->
		<el-dialog v-drag title="导入结果" :visible.sync="uploadVisible" width="500px">
			<div>成功导入{{ uploadCustomResponse.trueCount || 0 }}条，失败{{ uploadCustomResponse.falseCount || 0 }}条</div>
			<el-button type="text" @click="downloadCustomFail" v-if="uploadCustomResponse.falseCount > 0">
				下载失败列表
			</el-button>
			<el-row type="flex" justify="end">
				<el-button type="primary" @click="uploadVisible = false">确 定</el-button>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import {
	LOGIN_GIFTS_CUSTOMER_SEARCH_CONFIG,
	LOGIN_GIFTS_CUSTOMER_RECORD_SEARCH,
	LOGIN_GIFTS_CUSTOMER_RECORD_COLUMNS,
	LOGIN_GIFTS_CUSTOMER_COLUMNS_CONFIG,
} from './config';
import qs from 'querystring';
import { exportExcel } from 'util';
import { formatDateDefault } from 'util/formValidation';
export default {
	name: 'activityCustomer',
	props: {
		id: String,
		active: String,
		pageData: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			LOGIN_GIFTS_CUSTOMER_SEARCH_CONFIG,
			LOGIN_GIFTS_CUSTOMER_RECORD_SEARCH,
			LOGIN_GIFTS_CUSTOMER_COLUMNS_CONFIG,
			LOGIN_GIFTS_CUSTOMER_RECORD_COLUMNS,
			importKey: '', //上传key
			statusVisible: false, // 确认提示
			customerStatus: {}, // 顾客修改 确认信息
			activeName: 'gklist',
			customerSearchConfig: {}, // 顾客列表 搜索值
			customerSelection: [],
			customerList: {
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				total: 0,
				loading: false,
			},
			recordSearchConfig: {}, //编辑记录 搜索栏config
			operateLogs: {
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				loading: false,
				total: 0,
			},
			handleAddCardNo: '', //手动添加弹窗 会员卡号
			handleAddVisible: false, // 手动添加弹窗状态
			handleAddCustomerMsg: {}, // 手动添加弹窗 form
			uploadVisible: false, //导入成功弹窗状态
			uploadCustomResponse: {
				trueCount: '',
				falseCount: '',
			}, //导入成功后返回数据
		};
	},
	computed: {
		loadCustomerDataParams() {
			const { customerSearchConfig, id } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.customerList;
			let data = {
				id,
				...customerSearchConfig,
				pageNum,
				pageSize,
			};
			if (data.receiveTime) {
				data.startTime = data.receiveTime[0] ? formatDateDefault(data.receiveTime[0]) : null;
				data.endTime = data.receiveTime[1] ? formatDateDefault(data.receiveTime[1]) : null;
				delete data.receiveTime;
			}
			return data;
		},
		loadEditDataParams() {
			const { recordSearchConfig, id } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.operateLogs;
			let data = {
				id,
				...recordSearchConfig,
				pageNum,
				pageSize,
			};
			if (data.editTime) {
				data.startTime = data.editTime[0] ? formatDateDefault(data.editTime[0]) : null;
				data.endTime = data.editTime[1] ? formatDateDefault(data.editTime[1]) : null;
				delete data.editTime;
			}
			return data;
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
			this.customerList.pagination.currentPage = 1;
			this.loadCustomerData();
		},
		// 顾客列表 翻页
		customerChangePage(val) {
			this.customerList.pagination.currentPage = val;
			this.loadCustomerData();
		},
		// 顾客列表 切换条数
		customerSizeChange(val) {
			this.customerList.pagination.pageSize = val;
			this.loadCustomerData();
		},
		// 顾客列表 多选
		customerSelectionChange(row) {
			this.customerSelection = row;
		},
		// 导出顾客列表
		exportCustomerExcel() {
			const selectedIds = this.customerSelection.map(item => item.id);
			exportExcel('/mgmt/prmt/loginGift/exportMembers', { ...this.loadCustomerDataParams, selectedIds });
		},
		// 批量禁用
		batchDisableCustomer() {
			const { customerSelection } = this;
			if (customerSelection.length == 0) return this.$message.warning('请至少选择一个顾客');
			this.statusVisible = true;
			this.customerStatus.memberState = 1;
		},
		// 手动添加
		handleAddCustomer() {
			this.handleAddVisible = true;
		},
		// 模板下载
		templateDownload() {
			exportExcel('/mgmt/prmt/loginGift/exportMemberTemplate');
		},
		// 下载导入失败列表
		downloadCustomFail() {
			exportExcel('/mgmt/prmt/loginGift/getImportFailedList', { key: this.uploadCustomResponse.key });
		},
		// 导入新增
		async uploadCustom(file) {
			console.log(123, file);
			const data = new FormData();
			data.append('id', this.id);
			data.append('importKey', this.importKey);
			data.append('file', file.file);
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/prmt/loginGift/importMemberList',
				data,
			});
			if (res && res.code == 200) {
				this.$message.success('上传成功');
				this.uploadCustomResponse = res.data;
				this.importKey = res.data.importKey;
				this.uploadVisible = true;
				this.loadCustomerData();
			} else {
				this.$message.error('上传失败');
			}
		},
		// 顾客参与状态修改 禁用 确认
		async saveStatus() {
			const { memberState } = this.customerStatus;
			let data = {}; // 传参
			let urlKey = '';
			const urlData = {
				enalbe: '/mgmt/prmt/loginGift/enableMember',
				disable: '/mgmt/prmt/loginGift/disabledMembers',
			};
			if (memberState == 1) {
				// 禁用
				urlKey = 'disable';
				data.idList = this.customerSelection.map(item => item.id) || [];
			} else {
				urlKey = 'enalbe';
				data.id = this.customerStatus.id;
			}
			const res = await this.$fetch({
				method: 'POST',
				url: urlData[urlKey],
				data,
			});
			if (res && res.code == 200) {
				this.$message.success('操作成功');
				this.loadCustomerData();
				this.statusVisible = false;
			} else {
				this.$message.error('操作失败');
			}
		},
		// 启用按钮
		toEnable(row) {
			this.statusVisible = true;
			this.customerStatus = row;
		},
		// 禁用按钮
		toDisable(row) {
			this.statusVisible = true;
			this.customerStatus = { ...row, memberState: 1 };
			this.customerSelection = [row];
		},
		// 手动添加弹窗 取消
		handleAddClose() {
			this.handleAddCustomerMsg = {};
			this.handleAddCardNo = '';
			this.handleAddVisible = false;
		},
		// 手动添加弹窗 确定
		async handleAddSave() {
			const { cardNo, mobile, realName } = this.handleAddCustomerMsg;
			const { id, importKey } = this;
			if (!this.handleAddCardNo) return this.$message.warning('请输入会员卡号');
			if (!cardNo) return this.$message.warning('请输入正确的会员卡号');
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/prmt/loginGift/addImportMember',
				data: { cardNo, id, importKey, mobile, realName },
			});
			if (res && res.code == 200) {
				this.$message.success('操作成功');
				this.importKey = res.data.importKey;
				this.loadCustomerData();
				this.handleAddClose();
			} else {
				this.$message.error('操作失败');
			}
		},
		// 手动添加弹窗 搜索
		async handleAddSearchCard() {
			const res = await this.$fetch(`/mgmt/prmt/selectMemberByCard?cardNo=${this.handleAddCardNo}`);
			if (res && res.code == 200) {
				this.handleAddCustomerMsg = res.data || {};
			} else {
				this.handleAddCustomerMsg = {};
				this.$message.error('获取顾客信息失败');
			}
		},
		// ======= 编辑记录 ======
		// 导出编辑记录
		exportOperateLogs() {
			exportExcel('/mgmt/prmt/loginGift/exportOperateLogs', this.loadEditDataParams);
		},
		// 编辑记录 搜索
		recordSearch() {
			this.operateLogs.pagination.currentPage = 1;
			this.loadOperateLogs();
		},
		// 编辑记录 翻页
		operateLogsHandleChangePage(page) {
			this.operateLogs.pagination.currentPage = page;
			this.loadOperateLogs();
		},
		// 编辑记录 切换条数
		operateLogsHandleSizeChange(pageSize) {
			this.operateLogs.pagination = { currentPage: 1, pageSize };
			this.loadOperateLogs();
		},
		// 获取编辑记录数据
		async loadOperateLogs() {
			this.operateLogs.loading = true;
			const res = await this.$fetch(`/mgmt/prmt/loginGift/getOperateLogs?${qs.stringify(this.loadEditDataParams)}`);
			this.operateLogs.loading = false;
			if (res && res.code == 200 && res.data) {
				const { list, total } = res.data;
				this.operateLogs.data = list;
				this.operateLogs.total = total;
			} else {
				this.$message.error('获取编辑记录列表失败');
			}
		},
		// 获取顾客列表数据
		async loadCustomerData() {
			this.customerList.loading = true;
			const res = await this.$fetch(`/mgmt/prmt/loginGift/getMemberPage?${qs.stringify(this.loadCustomerDataParams)}`);
			this.customerList.loading = false;
			if (res && res.code == 200 && res.data) {
				const { list, total } = res.data;
				this.customerList.data = list;
				this.customerList.total = total;
			} else {
				this.$message.error('获取活动顾客列表失败');
			}
		},
	},
	watch: {
		active: {
			handler(val) {
				if (val == 'customer') {
					this.loadCustomerData();
				}
			},
		},
		activeName: {
			handler(val) {
				if (val == 'gklist') return this.loadCustomerData();
				if (val == 'editLogs') return this.loadOperateLogs();
			},
		},
	},
};
</script>

<style lang="scss" scoped>
.color-warning {
	color: $warning;
}
.upload-demo {
	margin: 0 10px;
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
