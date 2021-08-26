<template>
	<div>
		<guideBar>
			<el-button
				icon="el-icon-plus"
				v-permission:crm="'service_company_mange_add_service_company'"
				type="success"
				@click="createNewBranchCompany"
			>
				新增服务公司
			</el-button>
			<el-button
				icon="el-icon-download"
				v-permission="'service_company_mange_batch_export'"
				type="primary"
				@click="batchExport"
			>
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="SERVICE_COMPANY_SEARCH" @search="handleSearch" @reset="loadData" />
		</el-card>
		<el-card>
			<!-- <el-tabs v-model="activeTab">
			<el-tab-pane label="全部" name="all">-->
			<tableList
				:loading="all.loading"
				:dataSource="all.data"
				:columns="SERVICE_COMPANY_COLUMNS"
				:pagination="all.pagination"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				:dataTotal="all.pagination.total"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button
						v-permission="'service_company_mange_detail'"
						type="text"
						@click="viewDetail(scope.data.id, 'preview', '服务公司详情', scope.data.state)"
					>
						详情
					</el-button>
					<el-button
						v-permission="'service_company_mange_track'"
						type="text"
						@click="viewTrackingStatus(scope.data.id)"
					>
						跟进
					</el-button>
					<el-button
						type="text"
						v-permission="'service_company_mange_edit'"
						@click="viewDetail(scope.data.id, 'edit', '编辑服务公司', scope.data.state)"
						v-if="![2, 5].includes(scope.data.state)"
						size="midum"
					>
						编辑
					</el-button>
					<el-button
						v-permission="'service_company_mange_cancel'"
						type="text"
						v-if="scope.data.state !== 5"
						@click="unregister(scope.data.id)"
					>
						注销
					</el-button>
				</template>
			</tableList>
			<!-- </el-tab-pane>
			</el-tabs>-->
		</el-card>
		<!-- 跟进情况对话框 -->
		<el-dialog title="跟进情况" :visible.sync="trackModal.show" width="47%" v-drag>
			<div class="tracking-body">
				<el-row type="flex" justify="end" class="row-gap">
					<el-button type="primary" size="small" icon="el-icon-plus" @click="appendTrackingRecord">新增跟进</el-button>
				</el-row>
				<el-form inline size="small" label-width="90px" label-suffix=":" label-position="right">
					<!-- 新增状态 -->
					<template v-if="trackModal.showAppend">
						<el-row>
							<el-col :span="24">
								<el-form-item label="跟进人">
									<el-input v-model="trackModal.followInfo.followUpPerson" clearable />
								</el-form-item>
							</el-col>
							<el-col :span="24">
								<el-form-item label="跟进内容">
									<el-input
										type="textarea"
										:rows="3"
										v-model="trackModal.followInfo.followDes"
										class="follow-des"
										clearable
									/>
								</el-form-item>
							</el-col>
						</el-row>
					</template>
					<!-- 查看状态 -->
					<template v-else>
						<el-row v-for="(item, $idx) in displayTrackList" :key="$idx">
							<el-col :span="12">
								<el-form-item label="跟进人">
									<el-input :value="item.followUpPerson" readonly />
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="记录时间">
									<el-input :value="item.recordtime | timestampFormat" readonly />
								</el-form-item>
								<el-button
									size="mini"
									type="danger"
									circle
									class="el-icon-delete delete-icon"
									@click="deleteTrackingRecord(item.id)"
								/>
							</el-col>
							<el-col :span="24">
								<el-form-item label="跟进内容">
									<el-input type="textarea" :rows="3" :value="item.followDes" class="follow-des" readonly />
								</el-form-item>
							</el-col>
						</el-row>
					</template>
				</el-form>
				<el-row type="flex" justify="center" slot="footer" v-if="!trackModal.showAppend">
					<el-button
						type="primary"
						size="small"
						icon="el-icon-more-outline"
						@click.stop="loadMoreTrackingStatus"
						v-if="this.trackModal.data.length > 2 && this.trackModal.data.length !== displayTrackList.length"
					>
						加载更多
					</el-button>
				</el-row>
				<el-row type="flex" justify="center" slot="footer" v-else>
					<el-button type="info" size="small" icon="el-icon-close" @click.stop="cancelNewTrackingStatus">
						取消
					</el-button>
					<el-button type="primary" size="small" icon="el-icon-check" @click.stop="saveNewTrackingStatus">
						保存
					</el-button>
				</el-row>
			</div>
		</el-dialog>
		<!-- 注销服务公司运作对话框 -->
		<el-dialog title="注销服务公司运作" :visible.sync="unregModal.show" width="32%" v-drag>
			<p class="row-gap">注销原因</p>
			<el-select
				class="row-gap"
				size="small"
				placeholder="请选择原因"
				@change="cancellationChange"
				v-model="unregModal.cancellation"
			>
				<el-option v-for="(item, key) in cancellationData" :key="key" :label="item.reasonName" :value="item.id" />
			</el-select>
			<el-input
				type="textarea"
				:rows="3"
				disabled
				v-model="unregModal.cancellationDes"
				size="small"
				placeholder="填写注销原因"
			/>
			<span slot="footer">
				<el-button @click.stop="unregModal.show = false">取 消</el-button>
				<el-button type="primary" @click="confirmUnRegister">确认</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { exportExcel, timeEndFormat } from 'util';
import { SERVICE_COMPANY_SEARCH, SERVICE_COMPANY_COLUMNS } from './config';
import qs from 'querystring';

export default {
	name: 'serviceCompanyMange',
	data() {
		return {
			SERVICE_COMPANY_SEARCH,
			SERVICE_COMPANY_COLUMNS,
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
			searchConfig: {
				cardNo: '',
				serviceId: '',
				name: '',
				state: '',
				type: '',
				phoneNumber: '',
				trackingState: '',
				isItShanghai: '',
				submitTime: '',
				submitEndTime: '',
			},
			unregModal: {
				id: '',
				show: false,
				cancellation: '',
				cancellationDes: '',
			},
			trackModal: {
				id: '',
				data: [],
				page: 0,
				showAppend: false,
				followInfo: {
					followUpPerson: '',
					followDes: '',
				},
				show: false,
			},
			showMoreTrackInfo: false,
			cancellationData: [], // 注销原因数据
		};
	},
	computed: {
		// 搜索参数
		searchFields() {
			const {
				searchConfig,
				searchConfig: { submitTimeRange = ['', ''] },
			} = this;
			const params = {
				...searchConfig,
				rmk1: submitTimeRange[0] || '',
				rmk2: timeEndFormat(submitTimeRange[1]) || '',
			};
			delete params.submitTimeRange;
			return params;
		},
		// 展示的跟进数据
		displayTrackList() {
			if (!this.showMoreTrackInfo) return this.trackModal.data.slice(0, 2);
			return this.trackModal.data;
		},
	},
	methods: {
		// 创建新公司
		createNewBranchCompany() {
			this.$go('service_company_update', { type: 'add', title: '新增服务公司' });
		},
		// 批量导出
		batchExport() {
			exportExcel('/crm/member/serviceCompany/exportServiceCompany', this.searchFields);
		},
		// 分页触发事件
		handleChangePage(currentPage) {
			this.all.pagination.currentPage = currentPage;
			this.loadData();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.all.pagination.pageSize = pageSize;
			this.loadData();
		},
		// 搜索
		handleSearch() {
			let searchState = '';
			for (let key in this.searchFields) {
				if (this.searchFields[key]) {
					searchState = this.searchFields[key];
				}
			}
			// 判断搜索条件
			if (!searchState) {
				this.$message.warning('搜索条件不能为空');
				return;
			}
			this.all.data = [];
			this.all.pagination.currentPage = 1;
			this.loadData();
		},
		// 查看详情
		viewDetail(id, type, title, state) {
			this.$go('service_company_update', { id, type, title, state });
		},
		// 跟进情况
		viewTrackingStatus(id) {
			this.showMoreTrackInfo = false;
			this.trackModal = {
				id,
				data: [],
				show: true,
				showAppend: false,
				page: 0,
				followInfo: {
					followUpPerson: '',
					followDes: '',
				},
			};
			this.loadTrackingData();
		},
		// 展示更多跟进情况
		loadMoreTrackingStatus() {
			this.showMoreTrackInfo = true;
			// this.trackModal.page++;
			// this.loadTrackingData();
		},
		// 注销服务公司
		unregister(id) {
			if (!id)
				return this.$message({
					type: 'warning',
					message: '服务公司 Id 不存在或无效, 无法进行注销操作',
				});
			this.unregModal.cancellation = '';
			this.unregModal.cancellationDes = '';
			this.unregModal.show = true;
			this.unregModal.id = id;
		},
		// 新增跟进情况
		appendTrackingRecord() {
			this.trackModal.followInfo = {
				followUpPerson: '',
				followDes: '',
			};
			this.trackModal.showAppend = true;
		},
		//
		cancelNewTrackingStatus() {
			this.trackModal.followInfo = {
				followUpPerson: '',
				followDes: '',
			};
			this.trackModal.showAppend = false;
		},
		// 注销原因选择
		cancellationChange(val) {
			let index = 0;
			index = this.cancellationData.findIndex(item => {
				return item.id === val;
			});
			this.unregModal.cancellationDes = this.cancellationData[index].reasonComment;
			this.unregModal.cancellation = this.cancellationData[index].reasonName;
		},
		// 获取注销原因
		async getCancellationData() {
			// 0：注销,1:审核不通过,2初审通过
			const res = await this.$fetch(`/crm/member/serviceCompany/queryServiceCompanyConfig?type=0`);
			const { code, data } = res;
			if (res && code === 200 && data && data.length) {
				this.cancellationData = data || [];
			} else {
				this.cancellationData = [];
			}
		},
		// 获取跟进信息
		async loadTrackingData() {
			const { id: followId, page = 1 } = this.trackModal;
			const params = {
				followId,
				page,
			};
			const res = await this.$fetch(`/crm/member/serviceCompany/selectFollowInfoInfo?${qs.stringify(params)}`);
			const { code, data } = res;
			if (res && code === 200 && data && data.length) {
				this.trackModal.data = data || [];
			} else {
				this.$message.info('暂无跟进情况');
			}
		},
		// 保存新跟进情况
		async saveNewTrackingStatus() {
			const {
				id: followId,
				followInfo: { followUpPerson, followDes },
			} = this.trackModal;

			if (!followId) return this.$message('跟进业务 Id 不存在或无效, 无法继续操作');
			if (!followUpPerson || !followDes) return this.$message('跟进人 与 跟进情况 必须填写');

			const res = await this.$fetch({
				method: 'POST',
				url: '/crm/member/serviceCompany/insertFollowInfo',
				data: {
					followUpPerson,
					followDes,
					followId,
				},
			});
			if (res) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				if (res.code === 200) {
					this.$nextTick(() => {
						this.cancelNewTrackingStatus();
						this.loadTrackingData();
					});
				}
			}
		},
		// 删除跟进情况
		async deleteTrackingRecord(id) {
			if (!id) return this.$message('跟进情况 Id 不存在或无效, 无法删除');

			const res = await this.$fetch(`/crm/member/serviceCompany/deleteFollowInfo?id=${id}`);
			if (res) {
				this.$message(res.message);
				this.$nextTick(this.loadMoreTrackingStatus);
				this.loadTrackingData();
			}
		},
		// 注销服务公司确认回调
		async confirmUnRegister() {
			const {
				unregModal: { id, cancellation: failedReason, cancellationDes: failedReasonDes },
			} = this;

			if (!id)
				return this.$message({
					type: 'warning',
					message: '服务公司 Id 不存在或无效, 无法进行注销操作',
				});
			const data = {
				id,
				failedReason, // 原因
				failedReasonDes, // 原因描述
				state: 5, // 状态 1-草稿、2-待审核、3-审核通过、4-审核不通过、5-已注销
			};

			const res = await this.$fetch({
				method: 'POST',
				url: '/crm/member/serviceCompany/detailsReview',
				data,
			});
			if (res) {
				const { code, message } = res;
				if (code === 200) {
					this.$message({
						type: 'success',
						message,
					});
					this.unregModal.show = false;
					this.unregModal.id = '';
					this.$nextTick(this.loadData);
				} else {
					this.$message({
						type: 'warning',
						message,
					});
				}
			}
		},
		// 查询服务公司列表
		async loadData() {
			this.all.loading = true;
			const {
				searchFields,
				all: {
					pagination: { currentPage: pageNum, pageSize },
				},
			} = this;
			const params = {
				pageNum,
				pageSize,
				...searchFields,
			};

			const res = await this.$fetch(`crm/member/serviceCompany/selectServicePage?${qs.stringify(params)}`);

			if (res && res.data) {
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
	mounted() {
		this.loadData();
		this.getCancellationData();
		this.$listen('UPDATE_SERVICE_LIST', this.loadData);
	},
};
</script>

<style lang="scss" scoped>
.row-gap {
	margin-bottom: 16px;
}
.tracking-body {
	max-height: 350px;
	overflow-y: auto;
}
.follow-des {
	width: 480px;
}
.delete-icon {
	margin-top: 10px;
}
</style>
