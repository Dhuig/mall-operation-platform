<template>
	<div class="charging-list">
		<guideBar>
			<el-button
				class="top-btn el-icon-sold-out"
				v-permission="'gift_management_export'"
				type="primary"
				@click="detail({}, 'dc')"
			>
				导出
			</el-button>
			<!-- <el-button type="primary" class="top-btn" @click="detail({}, 'mb')">导入模板下载</el-button> -->
			<el-button
				v-permission:crm="'gift_management_batch_delete'"
				type="primary"
				class="top-btn el-icon-delete"
				@click="detail({}, 'batchdel')"
			>
				批量删除
			</el-button>
			<el-button
				v-permission:crm="'gift_management_import'"
				type="primary"
				class="top-btn el-icon-upload"
				@click="detail({}, 'dr')"
			>
				导入
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel ref="searchPanel" v-model="searchConfig" :config="config" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				:dataSource="all.data"
				:columns="CHANGE_COLUMNS"
				:options="customerOptions"
				:pagination="all.pagination"
				:dataTotal="all.pagination.total"
				:loading="all.loading"
				@handleSelectionChange="handleSelectionChange"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button v-permission="'gift_management_delete'" type="text" @click="detail(scope.data, 'del')">
						删除
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG, CHANGE_COLUMNS } from './config';
import { formatDate } from 'util/formValidation.js';
import { exportExcel } from 'util';

export default {
	name: 'giftManagement',
	data() {
		return {
			all: {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			},
			itemData: {},
			config: MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG,
			CHANGE_COLUMNS,
			customerOptions: {
				index: true,
				labelIndex: '序号',
				selection: true,
			},
			delids: [],
			searchConfig: {
				cardNo: null,
				getTime: [],
				storeCode: null,
			},
		};
	},
	created() {
		this.$listen('COUPONMANAGEMENT_LIST', this.handleSearch);
		this.loadData();
	},
	computed: {
		serach() {
			let { cardNo, getTime, storeCode } = this.searchConfig;
			let getTimes = getTime.length > 0;
			let getTimeMin = getTimes ? formatDate(getTime[0], 'month') : null;
			let getTimeMax = getTimes ? formatDate(getTime[1], 'month') : null;
			return { cardNo, getTimeMax, storeCode, getTimeMin };
		},
	},
	methods: {
		// 翻页操作
		handleChangePage(page) {
			this.all.pagination.currentPage = page;
			this.loadData();
		},
		// 切换页面条数
		handleSizeChange(pageSize) {
			this.all.pagination.pageSize = pageSize;
			this.loadData();
		},
		loadMore() {
			let { currentPage, pageSize, total } = this.all.pagination;
			if (currentPage * pageSize >= total) return this.$message.warning('没有更多数据');
			this.all.pagination.currentPage++;
			this.loadData();
		},
		async loadData() {
			this.all.loading = true;
			const { currentPage: pageNum, pageSize } = this.all.pagination;
			let params = { ...this.serach, pageNum, pageSize };
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/prmt/gift/selectGiftPage`,
				params: params,
			});
			if (res && res.code == 200) {
				const { list, total } = res.data;
				this.all.data = list || [];
				this.all.pagination.total = total || 0;
			}
			this.all.loading = false;
		},
		handleSelectionChange(val) {
			this.delids = val;
		},
		// 查询事件
		handleSearch() {
			this.all.pagination.currentPage = 1;
			this.loadData();
		},
		detail({ id, giftName }, item) {
			switch (item) {
				case 'mb':
					exportExcel('/mgmt/prmt/gift/exportGiftTemplate');
					break;
				case 'dr':
					this.$go('gift_improt');
					break;
				case 'dc':
					exportExcel('/mgmt/prmt/gift/selectGiftList');
					break;
				case 'batchdel':
					if (this.delids.length === 0) {
						this.$message.warning('请至少选一项');
						return;
					}
					this.$confirm('确定批量删除?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}).then(async () => {
						const res = await this.$fetch({
							method: 'POST',
							url: '/mgmt/prmt/gift/deleteByIds',
							data: this.delids.map(e => e.id),
						});
						if (res.code === 200) {
							this.$message.success('操作成功');
							this.handleSearch();
						}
					});
					break;
				case 'del':
					this.$confirm('确定删除' + giftName + '?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}).then(async () => {
						const res = await this.$fetch({
							method: 'POST',
							url: '/mgmt/prmt/gift/deleteByIds',
							data: [id],
						});
						if (res.code === 200) {
							this.$message.success('操作成功');
							this.handleSearch();
						}
					});
					break;
				default:
					break;
			}
		},
	},
	watch: {},
};
</script>
<style lang="scss" scoped>
@import '@/assets/css/elementUi.scss';
.charging-list {
	.top-btn {
		float: right;
		margin-bottom: 14px;
		margin-right: 10px;
	}
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
.upload-demo {
	display: inline-block;
	margin-left: 10px;
	margin-bottom: 20px;
}
</style>
