<template>
	<div class="search-header">
		<guideBar>
			<el-button
				v-permission="'return_exchange_list_add'"
				type="success"
				@click="goCreate"
				icon="el-icon-shopping-cart-2"
			>
				新建押货退货单
			</el-button>
			<el-button
				v-permission="'return_exchange_list_export_excel'"
				type="primary"
				@click="batchExport"
				icon="el-icon-download"
			>
				导出EXCEL
			</el-button>
		</guideBar>
		<!-- 基础信息 -->
		<el-card class="row-gap">
			<el-form :inline="true" :model="searchConfig" label-width="150px" label-suffix=":">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="服务中心编号" class="search-header-item">
							<el-input
								v-model="searchConfig.storeCode"
								placeholder="请输入服务中心编号"
								size="medium"
								clearable
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="退货单号" class="search-header-item">
							<el-input v-model="searchConfig.orderSn" placeholder="请输入退货单号" size="medium" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="分公司" class="search-header-item">
							<el-select v-model="searchConfig.companyCode" placeholder="请选择" size="medium" clearable>
								<el-option
									v-for="item in companyList"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20" v-if="isShow">
					<el-col :span="8">
						<el-form-item label="申请日期" class="search-header-item">
							<el-date-picker
								v-model="searchConfig.registrationTime"
								type="daterange"
								align="right"
								unlink-panels
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								:picker-options="pickerOptions2"
							></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="退货标识" class="search-header-item">
							<el-select v-model="searchConfig.orderMark" placeholder="请选择" size="medium" clearable>
								<el-option
									v-for="item in RETURNTAG_TYPE"
									:key="item.value"
									:label="item.name"
									:value="item.value"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="退货单类型" class="search-header-item">
							<el-select v-model="searchConfig.orderSource" placeholder="请选择" size="medium" clearable>
								<el-option
									v-for="item in RETURNTYPE_TYPE"
									:key="item.value"
									:label="item.name"
									:value="item.value"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row type="flex" justify="end" align="middle">
					<el-button icon="el-icon-search" type="primary" @click="loadData" class="search-button">搜索</el-button>
					<el-button icon="el-icon-refresh-left" @click="reset" class="search-button">重置</el-button>
					<el-button class="search-button" @click="isShow = !isShow">{{ isShow ? '收起' : '展开' }}</el-button>
				</el-row>
			</el-form>
		</el-card>
		<!-- <el-card class="box-card">
			<searchPanel v-model="searchConfig" :config="EXCHANGE_LIST_CONFIG" @search="loadData" />
		</el-card>-->
		<el-card class="box-card">
			<el-tabs v-model="activeTab">
				<el-tab-pane label="全部" name="all">
					<tableList
						:loading="all.loading"
						:dataSource="all.data"
						:columns="PRODUCT_COLUMNS"
						:pagination="all.pagination"
						:dataTotal="all.pagination.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						:options="options"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'return_exchange_list_detail|return_exchange_detail'"
								type="text"
								@click="detail(scope.data)"
							>
								详情
							</el-button>
							<!-- <el-button
								v-permission="'return_exchange_list_return'"
								type="text"
								v-if="scope.data.orderStatus === 2"
								@click="detail(scope.data, 'return')"
							>退回</el-button>
							<el-button
								v-permission="'return_exchange_list_audit'"
								type="text"
								v-if="scope.data.orderStatus === 1"
								@click="detail(scope.data, 'audit')"
							>审核</el-button>
							<el-button
								v-permission="'return_exchange_list_check'"
								type="text"
								v-if="scope.data.orderStatus === 3"
								@click="detail(scope.data, 'check')"
							>验货</el-button>-->
							<el-button
								type="text"
								v-permission="'return_exchange_list_cancel'"
								v-if="scope.data.orderStatus === 2 || scope.data.orderStatus === 1"
								@click="(cancelShow = true), (orderId = scope.data.id)"
							>
								取消
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="待审核" name="audited">
					<tableList
						:loading="audited.loading"
						:dataSource="audited.data"
						:columns="PRODUCT_COLUMNS"
						:pagination="audited.pagination"
						:dataTotal="audited.pagination.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						:options="options"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'return_exchange_list_detail|return_exchange_detail'"
								type="text"
								@click="detail(scope.data)"
							>
								详情
							</el-button>
							<!-- <el-button
								v-permission="'return_exchange_list_audit'"
								type="text"
								@click="detail(scope.data, 'audit')"
							>审核</el-button>-->
							<el-button
								type="text"
								v-permission="'return_exchange_list_cancel'"
								v-if="scope.data.orderStatus === 2 || scope.data.orderStatus === 1"
								@click="(cancelShow = true), (orderId = scope.data.id)"
							>
								取消
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="待退回" name="returned">
					<tableList
						:loading="returned.loading"
						:dataSource="returned.data"
						:columns="PRODUCT_COLUMNS"
						:pagination="returned.pagination"
						:dataTotal="returned.pagination.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						:options="options"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'return_exchange_list_detail|return_exchange_detail'"
								type="text"
								@click="detail(scope.data)"
							>
								详情
							</el-button>
							<!-- <el-button
								v-permission="'return_exchange_list_return'"
								type="text"
								@click="detail(scope.data, 'return')"
							>退回</el-button>-->
							<el-button
								type="text"
								v-permission="'return_exchange_list_cancel'"
								v-if="scope.data.orderStatus === 2 || scope.data.orderStatus === 1"
								@click="(cancelShow = true), (orderId = scope.data.id)"
							>
								取消
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="待验货" name="examined">
					<tableList
						:loading="examined.loading"
						:dataSource="examined.data"
						:columns="PRODUCT_COLUMNS"
						:pagination="examined.pagination"
						:dataTotal="examined.pagination.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						:options="options"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'return_exchange_list_detail|return_exchange_detail'"
								type="text"
								@click="detail(scope.data)"
							>
								详情
							</el-button>
							<!-- <el-button
								v-permission="'return_exchange_list_check'"
								type="text"
								@click="detail(scope.data, 'check')"
							>验货</el-button>-->
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="已完成" name="finished">
					<tableList
						:loading="finished.loading"
						:dataSource="finished.data"
						:columns="PRODUCT_COLUMNS"
						:pagination="finished.pagination"
						:dataTotal="finished.pagination.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						:options="options"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'return_exchange_list_detail|return_exchange_detail'"
								type="text"
								@click="detail(scope.data)"
							>
								详情
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="已取消" name="canceled">
					<tableList
						:loading="canceled.loading"
						:dataSource="canceled.data"
						:columns="PRODUCT_COLUMNS"
						:pagination="canceled.pagination"
						:dataTotal="canceled.pagination.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						:options="options"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'return_exchange_list_detail|return_exchange_detail'"
								type="text"
								@click="detail(scope.data)"
							>
								详情
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 取消弹框 -->
		<el-dialog title="取消退货单" :visible.sync="cancelShow" width="40%" v-drag>
			<p class="cancel_p">
				<span style="color: red;">*</span>
				取消原因:
				<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="cancelReason"></el-input>
			</p>
			<div class="cancel_btn">
				<el-button size="small" type="primary" @click="cancelOrderHandle">确认</el-button>
				<el-button size="small" @click="(cancelShow = false), (cancelReason = '')">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import { genCurrentMonthFirstAndLastDay } from 'util';
import qs from 'querystring';
import { EXCHANGE_LIST_CONFIG, ORDER_STATUS_KEY, PRODUCT_COLUMNS, RETURNTAG_TYPE, RETURNTYPE_TYPE } from './config';

export default {
	name: 'returnExchangeList',
	data() {
		return {
			RETURNTAG_TYPE,
			EXCHANGE_LIST_CONFIG,
			PRODUCT_COLUMNS,
			RETURNTYPE_TYPE,
			companyList: [],
			isShow: false,
			pickerOptions2: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
			},
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			searchConfig: {
				beginTime: '',
				companyCode: '',
				endTime: '',
				orderMark: '',
				orderSn: '',
				orderSource: '',
				orderStatus: '',
				storeCode: '',
				registrationTime: [],
			},
			activeTab: 'all',
			all: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			audited: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			returned: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			examined: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			canceled: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			finished: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			// 取消
			cancelShow: false,
			cancelReason: '',
			orderId: '',
		};
	},
	created() {
		this.searchConfig.registrationTime = genCurrentMonthFirstAndLastDay();
		this.searchConfig.beginTime = this.formatDate(this.searchConfig.registrationTime[0]);
		this.searchConfig.endTime = this.formatDate(this.searchConfig.registrationTime[1]);
		this.$listen('UP_LIST', this.loadData);
		this.loadData();
		this.getBranComByType();
		document.onkeydown = e => {
			if (e.which === 13) this.loadData();
		};
	},
	computed: {
		// 状态
		orderStatus() {
			return ORDER_STATUS_KEY[this.activeTab];
		},
		// 搜索参数
		searchFields() {
			const {
				searchConfig: { registrationTime, ...obj },
			} = this;
			return {
				...obj,
				beginTime: this.formatDate(registrationTime, 0),
				endTime: this.formatDate(registrationTime, 1),
			};
		},
	},
	watch: {
		orderStatus() {
			this.loadData();
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
		goCreate() {
			this.$go('creat_return_exchange');
		},
		// 获取公司的信息
		async getBranComByType() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			this.companyList = serviceCompanyOptions.map(({ label, value }) => {
				return {
					label: `${label} ${value}`,
					value,
				};
			});
			// const res = await this.$fetch(`mgmt/sys/current/user/company/list`);
			// if (res && res.code === 200) {
			// 	let list = res.data;
			// 	this.companyList = list.map((item) => {
			// 		return {
			// 			name: item.name,
			// 			value: item.code,
			// 		};
			// 	});
			// }
		},
		// 分页触发事件
		handleChangePage(currentPage) {
			this[this.activeTab].pagination.currentPage = currentPage;
			this.loadData();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this[this.activeTab].pagination.pageSize = pageSize;
			this.loadData();
		},
		// 批量导出
		async batchExport() {
			const { activeTab, orderStatus, searchFields } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this[activeTab];

			const params = {
				orderStatus,
				pageNum,
				pageSize,
				...searchFields,
			};
			// exportExcel('/mgmt/inventory/returnOrder/export', params);
			const res = await this.$fetch(`/mgmt/inventory/returnOrder/exportOrder?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.$message.success('操作成功');
			} else {
				this.$message.warning(res.message);
			}
		},
		// 请求列表
		async loadData() {
			const { activeTab, orderStatus, searchFields } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this[activeTab];
			this[activeTab].loading = true;

			const params = {
				orderStatus,
				pageNum,
				pageSize,
				...searchFields,
			};
			params.orderStatus = this.orderStatus;
			const res = await this.$fetch(`/mgmt/inventory/returnOrder/listOrder?${qs.stringify(params)}`);
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
		// 详情
		detail(row) {
			// console.log(row.orderStatus)
			// if(row){
			// 	return
			// }

			// orderStatus === 2"
			// return
			// orderStatus === 1"
			// audit
			// orderStatus === 3"
			// check
			let id = row.id;
			if (row.orderStatus == 1) {
				this.$go('return_exchange_detail', { title: '押货退货审核', id, type: 'audit' });
			} else if (row.orderStatus == 2) {
				this.$go('return_exchange_detail', { title: '押货退货退回', id, type: 'return' });
			} else if (row.orderStatus == 3) {
				this.$go('return_exchange_detail', { title: '押货退验货', id, type: 'check' });
			} else {
				this.$go('return_exchange_detail', { title: '押货退货详情', id, type: 'detail', orderMark: row.orderMark });
			}
		},
		// 审核
		audit(id) {
			this.$go('charging_detail', { title: '押货单详情', id, type: 'audit' });
		},
		// 退货-取消待审核的退货单
		async cancelOrder(params) {
			const res = await this.$fetch({
				method: 'post',
				url: 'mgmt/inventory/returnOrder/cancelOrder',
				data: params,
			});
			if (res.code === 200) {
				this.$message({
					type: 'success',
					message: '取消成功!',
				});
				// 置空
				this.cancelShow = false;
				this.cancelReason = '';
			} else {
				this.$message({
					type: 'error',
					message: res.data.message,
				});
			}
		},
		reset() {
			this.searchConfig = {
				beginTime: '',
				companyCode: '',
				endTime: '',
				orderMark: '',
				orderSn: '',
				orderSource: '',
				orderStatus: '',
				storeCode: '',
				registrationTime: [],
			};
		},
		// 取消
		cancelOrderHandle() {
			if (!this.cancelReason) {
				this.$message({
					type: 'warning',
					message: '请填写取消原因',
				});
				return;
			}
			let params = {
				id: this.orderId,
				cancelReason: this.cancelReason,
			};
			this.cancelOrder(params);
		},
	},
};
</script>
<style lang="scss" scoped>
.search-header {
	padding-top: 10px;
	.search-header-item.el-form-item {
		width: 100%;
		display: flex;
		flex: auto;
		margin-bottom: 26px;
		.el-form-item__content,
		.el-input,
		.el-select,
		.el-date-editor {
			width: 100% !important;
		}
	}
	.search-button {
		margin-left: 16px !important;
	}
	.cancel_p {
		display: flex;
		.el-textarea {
			margin-left: 10px;
			width: 80%;
		}
	}
	.cancel_btn {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}
}
</style>
