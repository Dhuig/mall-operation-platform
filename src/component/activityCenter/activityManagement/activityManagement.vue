<template>
	<div class="charging-list">
		<guideBar>
			<el-button
				v-permission="'activity_management_add'"
				class="top-btn"
				icon="el-icon-circle-plus-outline"
				type="primary"
				@click="add"
			>
				新建活动
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel
				ref="searchPanel"
				v-model="serachData"
				:config="MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG"
				@search="handleSearch"
			/>
		</el-card>
		<el-card>
			<el-tabs v-model="activeStatusTab">
				<el-tab-pane :label="item.label" :name="item.name" v-for="(item, index) in tabPane" :key="index"></el-tab-pane>
			</el-tabs>
			<tableList
				:dataSource="tabPaneObj[activeStatusTab].data"
				:columns="CHANGE_COLUMNS"
				:pagination="tabPaneObj[activeStatusTab].pagination"
				:dataTotal="tabPaneObj[activeStatusTab].pagination.total"
				:loading="tabPaneObj[activeStatusTab].loading"
				slotcontent
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			>
				<!-- @loadMore="loadMore" -->
				<template slot-scope="scope">
					<el-button
						v-permission="'activity_management_detail|spike_activity'"
						type="text"
						v-if="scope.data.promotionState !== 6"
						@click="detail(scope.data, 'detail')"
					>
						详情
					</el-button>
					<el-button
						v-permission="'activity_management_edit'"
						type="text"
						v-if="scope.data.promotionState == 5 || scope.data.promotionState == 6 || scope.data.promotionState == 1"
						@click="edit(scope.data, 'edit')"
					>
						编辑
					</el-button>
					<el-button
						v-permission="'activity_management_audit'"
						type="text"
						v-if="scope.data.promotionState == 1"
						@click="review(scope.data, 'review')"
					>
						审核
					</el-button>
					<el-button
						v-permission="'activity_management_delete'"
						type="text"
						v-if="scope.data.promotionState == 5 || scope.data.promotionState == 6"
						@click="del(scope.data, 'del')"
					>
						删除
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG, TAB_PANE, GET_STATUS, CHANGE_COLUMNS } from './config';
import { formatDate } from 'util/formValidation.js';
// , resData
export default {
	name: 'activityManagement',
	data() {
		let tabPaneObj = {
			all: {},
			pending: {},
			tostart: {},
			processing: {},
			over: {},
			rejected: {},
			draft: {},
		};
		for (const key in tabPaneObj) {
			tabPaneObj[key] = {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			};
		}
		return {
			MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG,
			itemData: {},
			centerDialogVisible: false,
			CHANGE_COLUMNS,
			serachData: {
				promotionName: null,
				promotionCode: null,
				createTime: [],
				periodTime: [],
				serialNo: null,
				limitType: '',
			},
			tabPane: TAB_PANE,
			getStatus: GET_STATUS,
			activeStatusTab: 'all',
			tabPaneObj,
		};
	},
	created() {
		this.$listen('ACTIVITY_MANAGEMENT_LIST', this.handleSearch);
	},
	computed: {
		serach() {
			let { promotionName, promotionCode, createTime, periodTime, serialNo, limitType } = this.serachData;
			let createTimes = createTime && createTime.length > 0;
			let periodTimes = periodTime && periodTime.length > 0;
			return {
				createTimeMin: createTimes ? formatDate(createTime[0]) : null,
				createTimeMax: createTimes ? formatDate(createTime[1] + 86399000) : null,
				periodTimeMin: periodTimes ? formatDate(periodTime[0]) : null,
				periodTimeMax: periodTimes > 0 ? formatDate(periodTime[1] + 86399000) : null,
				promotionName,
				promotionCode,
				promotionType: '1',
				serialNo,
				limitType,
			};
		},
		planStatus() {
			return this.getStatus[this.activeStatusTab];
		},
	},
	methods: {
		// 第一步：增加滚动到底部时触发的回调函数，并绑定到tabList组件上 例如：<tablist @loadMore="loadMore" />
		loadMore() {
			// 解构当前选项卡下的页码、页码条数、数据总条数
			let { currentPage, pageSize, total } = this.tabPaneObj[this.activeStatusTab].pagination;
			// 计算数据是否加载完必，是则reuten并提示
			if (currentPage * pageSize >= total) {
				return this.$message.warning('没有更多数据');
			}
			// 否则当前选项卡的页码自增1
			this.tabPaneObj[this.activeStatusTab].pagination.currentPage++;
			// 加载数据
			this.loadData();
		},
		// 翻页操作
		handleChangePage(page) {
			this.tabPaneObj[this.activeStatusTab].pagination.currentPage = page;
			this.loadData();
		},
		// 切换页面条数
		handleSizeChange(pageSize) {
			this.tabPaneObj[this.activeStatusTab].pagination.pageSize = pageSize;
			this.loadData();
		},
		// 温馨提示！：改造load的代码上下文按如下格式最佳，避免出现不必要的错误
		async loadData() {
			let { serach, activeStatusTab, planStatus } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabPaneObj[activeStatusTab];
			this.tabPaneObj[activeStatusTab].loading = true;
			let params = { ...serach, promotionState: planStatus, pageNum, pageSize };
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/prmt/selectPromotionListPage`,
				params: params,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.tabPaneObj[activeStatusTab].pagination.total = total || 0;
				// 执行concat拼接数据达到加载;
				this.tabPaneObj[activeStatusTab].data = list;
			}
			this.tabPaneObj[activeStatusTab].loading = false;
			// if (res && res.code === 200) {
			// 	const { list, total } = res.data;
			// 	this.tabPaneObj[activeStatusTab].pagination.total = total;
			// 	// 执行concat拼接数据达到加载;
			// 	this.tabPaneObj[activeStatusTab].data = this.tabPaneObj[activeStatusTab].data.concat(resData(list));
			// } else {
			// 	this.tabPaneObj[activeStatusTab].data = [];
			// 	this.tabPaneObj[activeStatusTab].pagination.total = 0;
			// }
			// this.tabPaneObj[activeStatusTab].loading = false;
		},
		// 查询事件
		handleSearch() {
			// 重置当前选项卡的数据，重置页码，并加载数据
			// this.tabPaneObj[this.activeStatusTab].data = [];
			// this.tabPaneObj[this.activeStatusTab].pagination.currentPage = 1;
			this.loadData();
		},
		onError() {
			this.$message.error('复制失败');
		},
		serachList() {
			this.$message.success('复制成功');
		},
		promote({ id, promotionName, promotionCode, appUrl, webUrl }) {
			this.centerDialogVisible = true;
			this.itemData = { id, promotionName, promotionCode, appUrl, webUrl };
		},
		review({ id, promotionName, promotionCode }) {
			this.$go('activity_review', { title: '活动审核', id, promotionName, promotionCode, name: '活动' });
		},
		del({ id, promotionName }) {
			this.$confirm('确定删除' + (promotionName ? promotionName : '') + '?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/prmt/deletePromotion',
					data: { id },
				});
				if (res.code === 200) {
					this.$message.success('删除成功');
					this.loadData();
				}
			});
		},
		add() {
			this.$fetch({ method: 'POST', url: `/mgmt/prmt/deleteCacheMember`, data: { id: null } });
			this.$go('add_activity', { numNow: Date.now() });
		},
		edit({ id }) {
			this.$go('add_activity', { id, numNow: Date.now() });
		},
		// 详情
		detail({ id }) {
			this.$go('spike_activity', { id });
		},
	},
	watch: {
		activeStatusTab: {
			handler() {
				// 调用查询回调
				this.handleSearch();
			},
			immediate: true,
		},
	},
};
</script>
<style lang="scss" scoped>
@import '@/assets/css/elementUi.scss';
.charging-list {
	.top-btn {
		float: right;
		margin-bottom: 14px;
	}
}
.promote-content {
	width: 100%;
	overflow: hidden;
}
.promote {
	padding-left: 30px;
}
.head-text {
	height: 50px;
	line-height: 50px;
	text-indent: 14px;
}
.btns-btn {
	margin-left: 10px;
}
.table_list_fix {
	overflow: hidden;
	.btn-operates {
		margin-bottom: 6px;
		a {
			color: #fff;
			text-decoration: none;
			display: inline-block;
		}
	}
}
.table-header {
	padding-top: 10px;
	.table-header_button {
		text-align: right;
		float: right;
		margin-bottom: 12px;
		line-height: 40px;
	}
}
.newjump {
	text-decoration: none;
	color: dodgerblue;
}
::v-deep.pagination {
	text-align: right;
	.el-pagination__sizes {
		float: left;
	}
	.el-pagination__total {
		float: left;
	}
}
</style>
