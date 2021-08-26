<template>
	<div>
		<guideBar>
			<el-button
				v-permission="'adjustment_list_alone_add'"
				type="primary"
				@click.stop="$go('add_adjustment')"
				icon="el-icon-plus"
			>
				单独新增
			</el-button>
			<el-button
				v-permission="'adjustment_list_import_add'"
				type="primary"
				@click.stop="$go('adjustment_import')"
				icon="el-icon-upload"
			>
				导入新增
			</el-button>
			<el-button
				v-permission="'adjustment_list_export'"
				type="primary"
				@click.stop="exportFile"
				icon="el-icon-download"
			>
				导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" ref="searchPanel" :config="ADJUSTMENT_SERACH" @search="resetLoad" />
		</el-card>
		<el-card>
			<tableList
				:loading="tabPanes.loading"
				:dataSource="tabPanes.data"
				:columns="ADJUSTMENT_COLUMNS"
				:pagination="tabPanes.pagination"
				:dataTotal="tabPanes.total"
				@handleSizeChange="handleSizeChange"
				@handleChangePage="handleChangePage"
				slotcontent
			>
				<template slot-scope="scope">
					<div v-permission="'adjustment_list_cancel'">
						<el-button v-if="scope.data.canCancel" type="text" @click="cancel(scope.data)">撤销</el-button>
					</div>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { ADJUSTMENT_SERACH, TABITEM, ADJUSTMENT_COLUMNS } from './config';
import { formatDate } from 'util/formValidation';
import { exportExcel } from 'util';
export default {
	name: 'adjustmentList',
	data() {
		return {
			ADJUSTMENT_SERACH,
			ADJUSTMENT_COLUMNS,
			tabPanes: new TABITEM(),
			searchConfig: {
				storeCardNo: '', // 云商会员卡号
				customerCardNo: '', // 顾客会员卡号
				adjustmentDate: [], // 调差月份区间 格式 yyyy-MM,yyyy-MM
				opTime: [], // 调差开始-结束日期 格式 yyyy-MM-dd,yyyy-MM-dd
				adjustmentType: '', // 调整类型 1：级别 2：级别+收入
				status: '', // 权限状态 1：待生效 2：生效中 3：已失效 4：已撤销
				creatorNo: '', // 操作人工号
				creatorTime: [], // 操作时间 格式 yyyy-MM-dd,yyyy-MM-dd
			},
		};
	},
	computed: {
		// 搜索字段
		searchFields() {
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabPanes;
			const {
				searchConfig,
				searchConfig: { creatorTime, adjustmentDate, opTime },
			} = this;
			const params = {
				pageNum,
				pageSize,
				...searchConfig,
				creatorTime: creatorTime
					? creatorTime
							.filter(Boolean)
							.map(x => formatDate(x, 'day'))
							.join(',')
					: '',
				adjustmentDate: adjustmentDate
					? adjustmentDate
							.filter(Boolean)
							.map(x => formatDate(x, 'month'))
							.join(',')
					: '',
				opTime: opTime
					? opTime
							.filter(Boolean)
							.map(x => formatDate(x, 'day'))
							.join(',')
					: '',
			};
			return params;
		},
	},
	methods: {
		// 导出
		exportFile() {
			exportExcel('/auth/adjustment/permission/export', this.searchFields);
		},
		// 撤销
		cancel({ id }) {
			if (!id) {
				return this.$message.error('id不存在');
			}
			this.$confirm('此操作将撤销调差权限, 是否继续?', '确认提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: '/auth/adjustment/permission/cancel',
					data: { id },
				});
				if (res.code == 200) {
					this.$message.success(res.data);
					this.resetLoad();
				}
			});
		},
		// 分页触发事件
		handleChangePage(currentPage) {
			this.tabPanes.pagination.currentPage = currentPage;
			this.loadData();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.tabPanes.pagination.pageSize = pageSize;
			this.tabPanes.pagination.currentPage = 1;
			this.loadData();
		},
		//搜索
		resetLoad() {
			this.tabPanes.pagination.currentPage = 1;
			this.tabPanes.data = [];
			this.$nextTick(this.loadData);
		},
		// 获取数据
		async loadData() {
			const { searchFields } = this;

			this.tabPanes.loading = true;

			const res = await this.$fetch({
				method: 'GET',
				url: '/auth/adjustment/permission/page',
				params: { ...searchFields },
			});

			this.tabPanes.loading = false;

			if (res.code == 200) {
				const { list, total } = res.data;
				if (list && list.length) {
					this.tabPanes.data = list;
					this.tabPanes.total = total;
				} else {
					this.tabPanes.data = [];
					this.tabPanes.total = 0;
				}
			} else {
				if (this.$store.getters['system/getError']) {
					this.$message.error(res.data.message);
				}
			}
		},
	},
	mounted() {
		this.$listen('UPDATA_ADJUSTMENT_LIST', this.resetLoad);
		this.loadData();
	},
};
</script>