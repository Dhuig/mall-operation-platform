<template>
	<div class="return-over-record">
		<guideBar>
			<el-button type="primary" v-permission="'return_over_record_export'" @click="batchExport">导出EXCEL</el-button>
		</guideBar>
		<el-card>
			<el-tabs v-model="activeTab">
				<el-tab-pane label="操作记录" name="log">
					<el-card>
						<searchPanel v-model="searchConfig" :config="RETURN_OPERATE_RECORD_SEARCH" @search="handleSearch" />
					</el-card>
					<tableList
						border
						:loading="tabPanes[activeTab].loading"
						:dataSource="tabPanes[activeTab].list"
						:columns="RETURN_OVER_RECORD_LOGS_COLUMN"
						:pagination="tabPanes[activeTab].pagination"
						:dataTotal="tabPanes[activeTab].total"
						:options="{ index: true, labelIndex: '序号' }"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
					>
						<template slot-scope="scope" slot="remark" v-if="scope.row.remark">
							<el-popover placement="top-start" width="200" trigger="hover" :content="scope.row.remark">
								<div slot="reference" class="text-ellipsis">{{ scope.row.remark }}</div>
							</el-popover>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="超额记录" name="over">
					<el-card>
						<searchPanel v-model="searchConfig" :config="RETURN_OVER_RECORD_SEARCH" @search="handleSearch" />
					</el-card>
					<tableList
						border
						:loading="tabPanes[activeTab].loading"
						:dataSource="tabPanes[activeTab].list"
						:columns="RETURN_OVER_RECORD_COLUMN"
						:pagination="tabPanes[activeTab].pagination"
						:dataTotal="tabPanes[activeTab].total"
						:options="{ index: true, labelIndex: '序号' }"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
					>
						<template slot-scope="scope" slot="afterSellOrderNo">
							<el-button type="text" @click="toAfterSellDetail(scope.row)">
								{{ scope.row.afterSellOrderNo }}
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import qs from 'querystring';
import {
	RETURN_OVER_RECORD_SEARCH,
	RETURN_OPERATE_RECORD_SEARCH,
	RETURN_OVER_RECORD_COLUMN,
	RETURN_OVER_RECORD_LOGS_COLUMN,
} from './config';
import { exportExcel } from 'util';
import { formatDateDefault } from 'util/formValidation';
export default {
	name: 'returnOverRecord',
	data() {
		return {
			RETURN_OVER_RECORD_SEARCH,
			RETURN_OPERATE_RECORD_SEARCH,
			RETURN_OVER_RECORD_COLUMN,
			RETURN_OVER_RECORD_LOGS_COLUMN,
			searchConfig: {},
			activeTab: 'log', // 默认操作记录tab
			tabPanes: {
				over: {
					loading: false,
					pagination: { currentPage: 1, pageSize: 10 },
					total: 0,
					list: [],
				},
				log: {
					loading: false,
					pagination: { currentPage: 1, pageSize: 10 },
					total: 0,
					list: [],
				},
			},
		};
	},
	watch: {
		activeTab: {
			immediate: true,
			handler() {
				this.loadDataAll();
			},
		},
	},
	computed: {
		loadDataPost() {
			const { storeCode, searchConfig, activeTab } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabPanes[activeTab];
			let data = {
				storeCode,
				...searchConfig,
				pageNum,
				pageSize,
			};
			if (data.overTime) {
				data.overStartTime = data.overTime[0] ? formatDateDefault(data.overTime[0]) : null;
				data.overEndTime = data.overTime[1] ? formatDateDefault(data.overTime[1]) : null;
				delete data.overTime;
			}
			if (data.createTime) {
				data.createStartTime = data.createTime[0] ? formatDateDefault(data.createTime[0]) : null;
				data.createEndTime = data.createTime[1] ? formatDateDefault(data.createTime[1]) : null;
				delete data.createTime;
			}
			if (data.returnRatio) {
				data.startReturnRatio = data.returnRatio[0] / 100;
				data.endReturnRatio = data.returnRatio[1] / 100;
				delete data.returnRatio;
			}
			if (data.returnAmount) {
				data.returnAmountStart = data.returnAmount[0];
				data.returnAmountEnd = data.returnAmount[1];
				delete data.returnAmount;
			}
			return data;
		},
	},
	methods: {
		// 导出
		batchExport() {
			const url = {
				over: '/mgmt/inventory/return/config/exportOverData',
				log: '/mgmt/inventory/return/config/exportLogList',
			};
			exportExcel(url[this.activeTab], this.loadDataPost);
		},
		// 搜索
		handleSearch() {
			const { activeTab } = this;
			this.tabPanes[activeTab].pagination.currentPage = 1;
			this.loadDataAll();
		},
		// 分页触发事件
		handleChangePage(page) {
			const { activeTab } = this;
			this.tabPanes[activeTab].pagination.currentPage = page;
			this.loadDataAll();
		},
		// 分页下拉触发事件
		handleSizeChange(pageSize) {
			const { activeTab } = this;
			this.tabPanes[activeTab].pagination = { currentPage: 1, pageSize };
			this.loadDataAll();
		},
		// 跳转相关的商城售后详情页面
		toAfterSellDetail(data) {
			const { afterSellOrderNo: returnNo } = data;
			this.$go('return_goods_details', { returnNo });
		},
		// 获取配置额度操作记录
		async loadLogs() {
			const { activeTab } = this;
			this.tabPanes[activeTab].loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/inventory/return/config/logList',
				data: this.loadDataPost,
				callback: () => {
					this.tabPanes[activeTab].loading = false;
				},
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.tabPanes[activeTab].list = list;
				this.tabPanes[activeTab].total = total;
			} else {
				this.$message.error('获取操作记录失败');
			}
		},
		// 获取配置额度详情/超额记录数据
		async loadData() {
			const { activeTab } = this;
			this.tabPanes[activeTab].loading = true;
			const res = await this.$fetch(`/mgmt/inventory/return/config/detail?${qs.stringify(this.loadDataPost)}`);
			this.tabPanes[activeTab].loading = false;
			if (res && res.data) {
				const { list, total } = res.data;
				this.tabPanes[activeTab].list = list;
				this.tabPanes[activeTab].total = total;
				if (list.length == 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取退货额度列表数据失败');
			}
		},
		loadDataAll() {
			const { activeTab } = this;
			if (activeTab == 'over') {
				this.loadData();
			} else {
				this.loadLogs();
			}
		},
	},
	mounted() {
		const { storeCode } = this.$route.query;
		if (storeCode) {
			this.storeCode = storeCode;
		}
	},
};
</script>

<style lang="scss" scoped>
::v-deep.table-top-line-box {
	margin: 16px 0;
	.table-list-title {
		display: flex;
		flex: 1;
		font-size: 14px;
		.ol-name {
			width: 100px;
			margin-right: 10px;
			text-align: right;
		}
	}
	.export-btn-box {
		text-align: right;
	}
}
::v-deep.text-ellipsis {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
</style>
