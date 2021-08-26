<template>
	<div class="charging-list">
		<guideBar>
			<el-button
				class="el-icon-sold-out"
				v-permission="'coupon_management_batch_export'"
				type="primary"
				@click="exportCoupon"
			>
				批量导出
			</el-button>
			<el-button
				class="el-icon-delete"
				v-permission="'coupon_management_batch_delete'"
				type="primary"
				@click="batchdel"
			>
				批量删除
			</el-button>
			<el-button icon="el-icon-circle-plus-outline" v-permission="'coupon_management_add'" type="primary" @click="add">
				新建优惠券
			</el-button>
			<el-button
				icon="el-icon-circle-plus-outline"
				v-permission="'coupon_management_donate_coupone'"
				type="primary"
				@click="donateCoupon"
			>
				派发转赠优惠券
			</el-button>
			<el-button
				icon="el-icon-circle-plus-outline"
				v-permission="'coupon_management_distribute'"
				type="primary"
				@click="distribute"
			>
				派发优惠券
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel
				ref="searchPanel"
				v-model="serachData"
				:config="MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG"
				@search="search"
			/>
		</el-card>
		<el-card>
			<el-tabs v-model="activeStatusTab">
				<el-tab-pane :label="item.label" :name="item.name" v-for="(item, index) in tabPane" :key="index"></el-tab-pane>
			</el-tabs>
			<tableList
				:dataSource="tabPaneObj[activeStatusTab].data"
				:columns="CHANGE_COLUMNS"
				:options="customerOptions"
				:pagination="tabPaneObj[activeStatusTab].pagination"
				:dataTotal="tabPaneObj[activeStatusTab].pagination.total"
				:loading="tabPaneObj[activeStatusTab].loading"
				@handleSelectionChange="handleSelectionChange"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button
						v-permission="'coupon_management_detail|coupon_detail'"
						type="text"
						v-if="scope.data.couponState !== 7"
						@click="detail(scope.data, 'detail')"
					>
						详情
					</el-button>
					<el-button
						v-permission="'coupon_management_edit'"
						type="text"
						v-if="scope.data.couponState == 1 || scope.data.couponState == 6 || scope.data.couponState == 7"
						@click="edit(scope.data, scope.data.couponState)"
					>
						编辑
					</el-button>
					<el-button
						v-permission="'coupon_management_audit'"
						type="text"
						v-if="scope.data.couponState == 1"
						@click="review(scope.data)"
					>
						审核
					</el-button>
					<el-button
						v-permission="'coupon_management_disable'"
						type="text"
						v-if="scope.data.couponState == 2 || scope.data.couponState == 3"
						@click="stop(scope.data)"
					>
						停用
					</el-button>
					<el-button
						v-permission="'coupon_management_enable'"
						type="text"
						v-if="scope.data.couponState == 5"
						@click="start(scope.data, 1)"
					>
						启用
					</el-button>
					<el-button
						v-permission="'coupon_management_delete'"
						type="text"
						v-if="scope.data.couponState == 6 || scope.data.couponState == 7"
						@click="delCoupon"
					>
						删除
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG, TAB_PANE, GET_STATUS, TAB_PANE_OBG, CHANGE_COLUMNS } from './config';
import { formatDate } from 'util/formValidation.js';
import { exportExcel } from 'util';

export default {
	name: 'couponManagement',
	data() {
		return {
			MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG,
			itemData: {},
			CHANGE_COLUMNS,
			customerOptions: {
				selection: true,
			},
			delids: [],
			serachData: {
				limitStore: null,
				couponName: null,
				couponNumber: null,
				redeem: null,
				createTime: null,
				isGenerateCode: null,
			},
			tabPane: TAB_PANE,
			getStatus: GET_STATUS,
			activeStatusTab: 'all',
			tabPaneObj: TAB_PANE_OBG,
		};
	},
	created() {
		this.$listen('COUPONMANAGEMENT_LIST', this.search);
	},
	computed: {
		serach() {
			let { couponName, couponNumber, redeem, createTime, isGenerateCode, limitStore } = this.serachData;
			return {
				couponName,
				couponNumber,
				isGenerateCode,
				limitStore,
				createTimeMin: createTime && createTime.length > 0 ? formatDate(createTime[0]) : null,
				createTimeMax: createTime && createTime.length > 0 ? formatDate(createTime[1] + 86399999) : null,
				startTime: redeem && redeem.length > 0 ? formatDate(redeem[0]) : null,
				endTime: redeem && redeem.length > 0 ? formatDate(redeem[1] + 86399000) : null,
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
		async loadData() {
			let { serach, activeStatusTab, planStatus } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabPaneObj[activeStatusTab];
			let params = { ...serach, couponState: planStatus, pageNum, pageSize };
			this.tabPaneObj[activeStatusTab].loading = true;
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/prmt/coupon/getListPage`,
				params: params,
			});
			if (res && res.code === 200) {
				const { list, total } = res.data;
				this.tabPaneObj[activeStatusTab].pagination.total = total || 0;
				// 执行concat拼接数据达到加载;
				this.tabPaneObj[activeStatusTab].data = list;
			}
			this.tabPaneObj[activeStatusTab].loading = false;
		},
		search() {
			this.tabPaneObj[this.activeStatusTab].data = [];
			this.tabPaneObj[this.activeStatusTab].pagination.currentPage = 1;
			this.loadData();
		},
		handleSelectionChange(val) {
			this.delids = val;
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
		confirmHandle(text, callback) {
			this.$confirm(`${text}?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				callback && callback();
			});
		},
		exportCoupon() {
			let { serach, activeStatusTab, planStatus } = this;
			const { currentPage: pageNum, pageSize } = this.tabPaneObj[activeStatusTab].pagination;
			let params = { ...serach, couponState: planStatus, pageNum, pageSize, couponIds: this.delids.map(e => e.id) };
			exportExcel('/mgmt/prmt/coupon/exportList', params);
		},
		batchdel() {
			this.confirmHandle('确定批量删除', async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/prmt/coupon/deleteCouponBatch',
					data: this.delids.map(e => e.id),
				});
				if (res.code === 200) {
					this.$message.success('操作成功');
					this.search();
				}
			});
		},
		add() {
			this.$go('add_edit_coupon', { nowNum: Date.now() });
		},
		async delImportData() {
			this.$fetch({
				method: 'POST',
				url: '/mgmt/prmt/couponTransfer/deleteImportMember',
				data: { id: null },
			});
		},
		donateCoupon() {
			if (this.delids.length !== 1) return this.$message.warning('请选择一个优惠券派发！');
			if (
				(this.delids[0].couponState !== 2 && this.delids[0].couponState !== 3) ||
				this.delids[0].isGenerateCode !== 0
			) {
				return this.$message.warning('只有待生效或进行中且未生成优惠码的优惠券才能派发！');
			}
			this.delImportData();
			this.$go('add_donate_coupon', { id: this.delids[0].id, numRandom: Date.now() });
		},
		distribute() {
			if (this.delids.length !== 1) return this.$message.warning('请选择一个优惠券派发！');
			if (
				(this.delids[0].couponState !== 2 && this.delids[0].couponState !== 3) ||
				this.delids[0].isGenerateCode !== 0
			) {
				return this.$message.warning('只有待生效或进行中且未生成优惠码的优惠券才能派发！');
			}
			this.$go('create_handWork', { id: this.delids[0].id, numRandom: Date.now() });
		},
		delCoupon({ id, couponName }) {
			this.confirmHandle('确定删除' + couponName, async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/prmt/coupon/deleteCouponBatch',
					data: [id],
				});
				if (res.code === 200) {
					this.$message.success('操作成功');
					this.search();
				}
			});
		},
		edit({ id }, status) {
			this.$go('add_edit_coupon', { title: '新建/编辑优惠券', id, status });
		},
		review({ id, couponName, couponNumber }) {
			this.$go('coupon_review', { title: '优惠券审核', id, couponName, couponNumber, num: Date.now() });
		},
		stop({ id }, status) {
			this.confirmHandle('确定' + (status ? '启用' : '禁用') + '?', async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/prmt/coupon/enableOrDisable',
					data: { id, couponState: status ? 1 : 5 },
				});
				if (res.code === 200) {
					this.$message.success('操作成功');
					this.search();
				}
			});
		},
		start({ id }, status) {
			this.confirmHandle('确定' + (status ? '启用' : '禁用') + '?', async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/prmt/coupon/enableOrDisable',
					data: { id, couponState: status ? 1 : 5 },
				});
				if (res.code === 200) {
					this.$message.success('操作成功');
					this.search();
				}
			});
		},
		// 详情
		detail({ id }) {
			this.$go('coupon_detail', { title: '优惠券详情', id });
		},
	},
	watch: {
		activeStatusTab: {
			handler() {
				this.search();
			},
			immediate: true,
		},
	},
};
</script>
<style lang="scss" scoped>
@import '@/assets/css/elementUi.scss';
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
