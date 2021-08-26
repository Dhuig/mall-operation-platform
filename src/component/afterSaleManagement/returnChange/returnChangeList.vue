<template>
	<div class="search-header">
		<guideBar>
			<el-button v-permission="'return_change_list_add'" type="success" @click="goCreate" icon="el-icon-document-copy">
				新增押货换货单
			</el-button>
			<el-button
				v-permission="'return_change_export_excel'"
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
						<el-form-item label="换货单号" class="search-header-item">
							<el-input v-model="searchConfig.orderSn" placeholder="请输入换货单号" size="medium" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="换货处理方式" class="search-header-item">
							<el-select v-model="searchConfig.exchangeType" placeholder="请选择" size="medium" clearable>
								<el-option
									v-for="item in EXCHANGE_STATUS"
									:key="item.value"
									:label="item.name"
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
						<el-form-item label="换货单类型" class="search-header-item">
							<el-select v-model="searchConfig.orderSource" placeholder="请选择" size="medium" clearable>
								<el-option
									v-for="item in ORDER_SOURCE_TYPE"
									:key="item.value"
									:label="item.name"
									:value="item.value"
								></el-option>
							</el-select>
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
						<el-form-item label="一级原因" class="search-header-item">
							<el-select
								v-model="searchConfig.reasonFirst"
								placeholder="请选择"
								size="medium"
								@change="changereasonFirst"
								clearable
							>
								<el-option
									v-for="item in reasonFirstOptions"
									:key="item.value"
									:label="item.label"
									:value="item.label"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="二级原因" class="search-header-item">
							<el-select v-model="searchConfig.reasonSecond" placeholder="请选择" size="medium" clearable>
								<el-option
									v-for="item in reasonSecondOptions"
									:key="item.value"
									:label="item.label"
									:value="item.label"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row type="flex" justify="end" align="middle">
					<el-button icon="el-icon-search" type="primary" @click="handleSearch" class="search-button">搜索</el-button>
					<el-button icon="el-icon-refresh-left" @click="reset" class="search-button">重置</el-button>
					<el-button class="search-button" @click="isShow = !isShow">{{ isShow ? '收起' : '展开' }}</el-button>
				</el-row>
			</el-form>
		</el-card>

		<el-card>
			<el-tabs v-model="activeTab">
				<el-tab-pane label="全部" name="all">
					<tableList
						:options="options"
						:loading="all.loading"
						:dataSource="all.data"
						:columns="RETURN_CHANGE_LIST_COLUMNS"
						:pagination="all.pagination"
						:dataTotal="all.pagination.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-if="scope.data.orderStatus * 1 !== 5"
								v-permission="'return_change_list_detail|return_change_detail'"
								type="text"
								@click="goDetail(scope.data.id, scope.data.orderStatus)"
							>
								详情
							</el-button>
							<el-button
								v-else
								v-permission="'return_change_list_detail|return_change_detail'"
								type="text"
								@click="goDetail(scope.data.id, 'detail')"
							>
								详情
							</el-button>
							<!-- <el-button
								v-permission="'return_change_list_audit'"
								type="text"
								v-if="scope.data.orderStatus * 1 === 1"
								@click="goDetail(scope.data.id, scope.data.orderStatus)"
							>审核</el-button>
							<el-button
								v-permission="'return_change_list_return'"
								type="text"
								v-if="scope.data.orderStatus * 1 === 2"
								@click="goDetail(scope.data.id, scope.data.orderStatus)"
							>退回</el-button>
							<el-button
								v-permission="'return_change_list_record'"
								type="text"
								v-if="scope.data.orderStatus * 1 === 4"
								@click="goDetail(scope.data.id, scope.data.orderStatus)"
							>录入发货</el-button>
							<el-button
								v-permission="'return_change_list_check'"
								type="text"
								v-if="scope.data.orderStatus * 1 === 3"
								@click="goDetail(scope.data.id, scope.data.orderStatus)"
							>待验货</el-button>-->
							<el-button
								v-permission="'return_change_export_receive'"
								type="text"
								v-if="scope.data.orderStatus * 1 === 5"
								@click="goDetail(scope.data.id, scope.data.orderStatus)"
							>
								确认收货
							</el-button>
							<el-button
								v-permission="'return_change_list_cancel'"
								type="text"
								v-if="scope.data.orderStatus * 1 === 1"
								@click="handleCancel(scope.data.id)"
							>
								取消
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="待审核" name="tobeReviewed">
					<tableList
						:options="options"
						:loading="tobeReviewed.loading"
						:dataSource="tobeReviewed.data"
						:columns="RETURN_CHANGE_LIST_COLUMNS"
						:pagination="tobeReviewed.pagination"
						:dataTotal="tobeReviewed.pagination.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'return_change_list_detail|return_change_detail'"
								type="text"
								@click="goDetail(scope.data.id, scope.data.orderStatus)"
							>
								详情
							</el-button>
							<!-- 只有运营后台录入的押货单才有待审核状态 -->
							<!-- <el-button
								v-permission="'return_change_list_audit'"
								type="text"
								v-if="scope.data.orderStatus * 1 === 1"
								@click="goDetail(scope.data.id, 'audit')"
							>审核</el-button>-->
							<el-button
								v-permission="'return_change_list_cancel'"
								type="text"
								v-if="scope.data.orderStatus * 1 === 1"
								@click="handleCancel(scope.data.id)"
							>
								取消
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="待退回" name="tobeReturned">
					<tableList
						:options="options"
						:loading="tobeReturned.loading"
						:dataSource="tobeReturned.data"
						:columns="RETURN_CHANGE_LIST_COLUMNS"
						:pagination="tobeReturned.pagination"
						:dataTotal="tobeReturned.pagination.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'return_change_list_detail|return_change_detail'"
								type="text"
								@click="goDetail(scope.data.id, scope.data.orderStatus)"
							>
								详情
							</el-button>
							<!-- <el-button
								v-permission="'return_change_list_return'"
								type="text"
								v-if="scope.data.orderStatus * 1 === 2"
								@click="goDetail(scope.data.id, 'return')"
							>退回</el-button>-->
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="待验货" name="tobeChecked">
					<tableList
						:options="options"
						:loading="tobeChecked.loading"
						:dataSource="tobeChecked.data"
						:columns="RETURN_CHANGE_LIST_COLUMNS"
						:pagination="tobeChecked.pagination"
						:dataTotal="tobeChecked.pagination.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'return_change_list_detail|return_change_detail'"
								type="text"
								@click="goDetail(scope.data.id, scope.data.orderStatus)"
							>
								详情
							</el-button>
							<!-- <el-button
								v-permission="'return_change_list_check'"
								type="text"
								v-if="scope.data.orderStatus * 1 === 3"
								@click="goDetail(scope.data.id, 'check')"
							>待验货</el-button>-->
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="待发货" name="sending">
					<tableList
						:options="options"
						:loading="sending.loading"
						:dataSource="sending.data"
						:columns="RETURN_CHANGE_LIST_COLUMNS"
						:pagination="sending.pagination"
						:dataTotal="sending.pagination.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'return_change_list_detail|return_change_detail'"
								type="text"
								@click="goDetail(scope.data.id, scope.data.orderStatus)"
							>
								详情
							</el-button>
							<!-- <el-button
								v-permission="'return_change_list_record'"
								type="text"
								v-if="scope.data.orderStatus * 1 === 4"
								@click="goDetail(scope.data.id, 'enterShipment')"
							>录入发货</el-button>-->
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="待收货" name="receiving">
					<tableList
						:options="options"
						:loading="receiving.loading"
						:dataSource="receiving.data"
						:columns="RETURN_CHANGE_LIST_COLUMNS"
						:pagination="receiving.pagination"
						:dataTotal="receiving.pagination.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'return_change_list_detail|return_change_detail'"
								type="text"
								@click="goDetail(scope.data.id, 'detail')"
							>
								详情
							</el-button>
							<el-button
								v-permission="'return_change_export_receive'"
								type="text"
								v-if="scope.data.orderStatus * 1 === 5"
								@click="goDetail(scope.data.id, scope.data.orderStatus)"
							>
								确认收货
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="已完成" name="completed">
					<tableList
						:options="options"
						:loading="completed.loading"
						:dataSource="completed.data"
						:columns="RETURN_CHANGE_LIST_COLUMNS"
						:pagination="completed.pagination"
						:dataTotal="completed.pagination.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'return_change_list_detail|return_change_detail'"
								type="text"
								@click="goDetail(scope.data.id, 'detail')"
							>
								详情
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="已取消" name="cancelled">
					<tableList
						:options="options"
						:loading="cancelled.loading"
						:dataSource="cancelled.data"
						:columns="RETURN_CHANGE_LIST_COLUMNS"
						:pagination="cancelled.pagination"
						:dataTotal="cancelled.pagination.total"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button
								v-permission="'return_change_list_detail|return_change_detail'"
								type="text"
								@click="goDetail(scope.data.id, 'detail')"
							>
								详情
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>
<script>
import {
	RETURN_CHANGE_LIST_CONFIG,
	RETURN_CHANGE_LIST_COLUMNS,
	ORDER_STATUS_KEY,
	ORDER_SOURCE_TYPE,
	EXCHANGE_STATUS,
	PRODUCT_DISPOSAL_STATUS,
} from './config';
import qs from 'querystring';
import { genCurrentMonthFirstAndLastDay } from 'util';

export default {
	name: 'returnChangeList',
	data() {
		return {
			ORDER_SOURCE_TYPE,
			RETURN_CHANGE_LIST_CONFIG,
			RETURN_CHANGE_LIST_COLUMNS,
			PRODUCT_DISPOSAL_STATUS,
			EXCHANGE_STATUS,
			companyList: [],
			isShow: false,
			searchConfig: {
				orderSn: '',
				storeCode: '',
				orderStatus: '',
				orderSource: '',
				companyCode: '',
				exchangeType: '',
				productDisposalType: '',
				beginTime: '',
				endTime: '',
				registrationTime: [],
				// 一二级原因（提交）
				reasonFirst: '',
				reasonSecond: '',
			},
			// 一二级原因
			reasonFirstOptions: [],
			reasonSecondOptions: [],
			reasonList: '',
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
			activeTab: 'all',
			// 全部
			all: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			// 待审批
			tobeReviewed: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			// 待发货
			sending: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			// 待退回
			tobeReturned: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			// 待验货
			tobeChecked: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			// 待收货
			receiving: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			// 已完成
			completed: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			// 已取消
			cancelled: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
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
			this.getList();
		},
	},
	created() {
		this.searchConfig.registrationTime = genCurrentMonthFirstAndLastDay();
		this.searchConfig.beginTime = this.formatDate(this.searchConfig.registrationTime[0]);
		this.searchConfig.endTime = this.formatDate(this.searchConfig.registrationTime[1]);
		this.getList();
		this.loadReasons();
		this.getBranComByType();
		document.onkeydown = e => {
			if (e.which === 13) this.getList();
		};
		this.$listen('UP_LIST', this.getList);
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
		// 导出
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
			params.orderStatus = this.orderStatus;
			// exportExcel('/mgmt/inventory/exchangeOrder/export', params);
			const res = await this.$fetch(`mgmt/inventory/exchangeOrder/exportOrder?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.$message.success('操作成功');
			} else {
				this.$message.warning(res.message);
			}
		},
		// 搜索
		handleSearch() {
			this[this.activeTab].pagination.currentPage = 1;
			this.getList();
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
		reset() {
			this.searchConfig = {
				registrationTime: [],
				orderSn: '',
				storeCode: '',
				orderStatus: '',
				orderSource: '',
				companyCode: '',
				exchangeType: '',
				productDisposalType: '',
				beginTime: '',
				endTime: '',
			};
		},
		// 详情
		goDetail(id, type) {
			// ORDER_STATUS = {
			// 	1: '待审核',
			// 	2: '待退回',
			// 	3: '待验货',
			// 	4: '待发货',
			// 	5: '待收货',
			// 	6: '已完成',
			// 	7: '已取消',
			// }
			// orderStatus * 1 === 1"
			// audit
			// orderStatus * 1 === 2"
			// return
			// orderStatus * 1 === 4
			// enterShipment
			// orderStatus * 1 === 3"
			// check
			// orderStatus * 1 === 5"
			// receiving
			if (type == 1) {
				this.$go('return_change_detail', { title: '押货换货审核', id, type: 'audit' });
			} else if (type == 2) {
				this.$go('return_change_detail', { title: '押货换货退回', id, type: 'return' });
			} else if (type == 4) {
				this.$go('return_change_detail', { title: '录入发货', id, type: 'enterShipment' });
			} else if (type == 3) {
				this.$go('return_change_detail', { title: '验货', id, type: 'check' });
			} else if (type == 5) {
				this.$confirm('此操作将该换货单确认收货, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						const params = {
							id,
						};
						this.confirmMortgageExchangeOrder(params);
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消',
						});
					});
			} else {
				this.$go('return_change_detail', { title: '押货换货详情', id, type: 'detail' });
			}
		},
		// 换货-确认收货的退货单
		async confirmMortgageExchangeOrder(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/inventory/exchangeOrder/confirmMortgageExchangeOrder',
				data: params,
			});
			if (res.code === 200) {
				this.$message({
					type: 'success',
					message: '确认收货成功!',
				});
				this.getList();
			}
		},
		// 换货-取消待审核的退货单
		async cancelOrder(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/inventory/exchangeOrder/cancelExchangeOrder',
				data: params,
			});
			if (res.code === 200) {
				this.$message({
					type: 'success',
					message: '取消成功!',
				});
				this.getList();
			} else {
				this.$message({
					type: 'error',
					message: res.data.message,
				});
			}
		},
		// 取消
		handleCancel(id) {
			this.$confirm('此操作将取消该换货单, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					const params = {
						id,
					};
					this.cancelOrder(params);
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		goCreate() {
			this.$go('creat_return_change');
		},
		// 请求数据
		async getList() {
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
			const res = await this.$fetch(`/mgmt/inventory/exchangeOrder/orderList?${qs.stringify(params)}`);

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
		// 获取一二级原因
		async loadReasons() {
			const res = await this.$fetch(`/mgmt/inventory/common/getReason?type=4`);
			if (res && res.data) {
				this.reasonFirstOptions = res.data.map(({ id: value, returnReason: label }) => ({ value, label }));
				this.reasonList = res.data;
			} else {
				this.$message.error('请求售后原因失败, 服务器可能出现问题');
			}
		},
		// 二级获取
		changereasonFirst() {
			this.reasonSecondOptions = [];
			this.searchConfig.reasonSecond = '';
			this.reasonList.forEach(e => {
				if (e.returnReason === this.searchConfig.reasonFirst) {
					e.reasonList.forEach(n => {
						let item = {
							value: n.id,
							label: n.returnReason,
						};
						this.reasonSecondOptions.push(item);
					});
				}
			});
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
}
</style>
