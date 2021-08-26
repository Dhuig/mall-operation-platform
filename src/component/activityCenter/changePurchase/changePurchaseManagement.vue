<template>
	<div class="charging-list">
		<guideBar>
			<el-button
				v-permission="'change_purchase_management_add'"
				class="top-btn"
				icon="el-icon-circle-plus-outline"
				type="primary"
				@click="add"
			>
				创建换购方案
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel ref="searchPanel" v-model="serachData" :config="config" @search="handleSearch" />
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
						v-permission="'change_purchase_management_detail|change_purchase_detail'"
						type="text"
						v-if="scope.data.promotionState !== 6"
						@click="detail(scope.data)"
					>
						详情
					</el-button>
					<el-button
						v-permission="'change_purchase_management_edit'"
						type="text"
						v-if="scope.data.promotionState == 5 || scope.data.promotionState == 6 || scope.data.promotionState == 1"
						@click="edit(scope.data)"
					>
						编辑
					</el-button>
					<el-button
						v-permission="'change_purchase_management_audit'"
						type="text"
						v-if="scope.data.promotionState == 1"
						@click="review(scope.data)"
					>
						审核
					</el-button>
					<el-button
						v-permission="'change_purchase_management_delete'"
						type="text"
						v-if="scope.data.promotionState == 5 || scope.data.promotionState == 6"
						@click="del(scope.data)"
					>
						删除
					</el-button>
				</template>
			</tableList>
		</el-card>
		<el-dialog title="提示" v-drag :visible.sync="centerDialogVisible" width="50%" center>
			<div class="promote-content">
				<div class="promote">
					<div class="head-text">推广链接</div>
					<el-form label-width="140px">
						<el-form-item label="商城Web端链接：" prop="name">
							<el-col :span="14">
								<el-input disabled v-model="itemData.webUrl" placeholder></el-input>
							</el-col>
							<el-button
								type="primary"
								class="btns-btn"
								v-clipboard:copy="itemData.webUrl"
								v-clipboard:success="serachList"
								v-clipboard:error="onError"
							>
								复制
							</el-button>
						</el-form-item>
						<el-form-item label="商城APP端链接：" prop="name">
							<el-col :span="14">
								<el-input disabled v-model="itemData.appUrl" placeholder></el-input>
							</el-col>
							<el-button
								type="primary"
								class="btns-btn"
								v-clipboard:copy="itemData.appUrl"
								v-clipboard:success="serachList"
								v-clipboard:error="onError"
							>
								复制
							</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="centerDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="centerDialogVisible = false">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import searchPanel from 'component/common/searchPanel';
import { MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG, TAB_PANE, GET_STATUS, CHANGE_COLUMNS } from './config';
import { formatDate } from 'util/formValidation.js';
export default {
	name: 'changePurchaseManagement',
	components: {
		searchPanel,
	},
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
			itemData: {},
			centerDialogVisible: false,
			config: MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG,
			CHANGE_COLUMNS,
			serachData: {
				promotionName: null,
				promotionCode: null,
				periodTime: null,
				createTime: null,
			},
			tabPane: TAB_PANE,
			getStatus: GET_STATUS,
			activeStatusTab: 'all',
			tabPaneObj,
		};
	},
	created() {
		this.$listen('CHANGE_PURCHASE_MANAGEMENT_LIST', this.handleSearch);
	},
	computed: {
		serach() {
			let { promotionName, promotionCode, periodTime, createTime } = this.serachData;
			let periodTimes = periodTime && periodTime.length > 0;
			let createTimes = createTime && createTime.length > 0;
			return {
				createTimeMin: createTimes ? formatDate(createTime[0]) : null,
				createTimeMax: createTimes ? formatDate(createTime[1] + 86399000) : null,
				periodTimeMin: periodTimes ? formatDate(periodTime[0]) : null,
				periodTimeMax: periodTimes ? formatDate(periodTime[1] + 86399000) : null,
				promotionName,
				promotionCode,
				promotionType: '2',
			};
		},
		planStatus() {
			return this.getStatus[this.activeStatusTab];
		},
	},
	methods: {
		onError() {
			this.$message.error('复制失败');
		},
		serachList() {
			this.$message.success('复制成功');
		},
		loadMore() {
			let { currentPage, pageSize, total } = this.tabPaneObj[this.activeStatusTab].pagination;
			if (currentPage * pageSize >= total) return this.$message.warning('没有更多数据');
			this.tabPaneObj[this.activeStatusTab].pagination.currentPage++;
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
		async loadData() {
			let { serach, activeStatusTab, planStatus } = this;
			this.tabPaneObj[activeStatusTab].loading = true;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabPaneObj[activeStatusTab];
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
		},
		// 查询事件
		handleSearch() {
			this.loadData();
		},
		edit({ id }) {
			this.$go('add_change_purch', { title: '新建/编辑换购', id, numNow: Date.now() });
		},
		add() {
			this.$fetch({ method: 'POST', url: `/mgmt/prmt/deleteCacheMember`, data: { id: null } });
			this.$go('add_change_purch', { numNow: Date.now() });
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
					this.handleSearch();
				}
			});
		},
		review({ id, promotionName, promotionCode }) {
			this.$go('activity_review', { title: '换购审核', id, promotionName, promotionCode, name: '换购' });
		},
		promote({ id, promotionName, promotionCode, appUrl, webUrl }) {
			this.centerDialogVisible = true;
			this.itemData = { id, promotionName, promotionCode, appUrl, webUrl };
		},
		// 详情
		detail({ id }) {
			this.$go('change_purchase_detail', { title: '换购详情', id });
		},
	},
	watch: {
		activeStatusTab: {
			handler() {
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
