<template>
	<div class="valetServiceList">
		<guideBar />
		<el-card>
			<searchPanel v-model="searchConfig" :config="VALET_SERVICE_SERACH" @search="onHandleSearch" />
		</el-card>
		<el-card>
			<tableList
				:loading="tabPanes.loading"
				element-loading-text="拼命加载中"
				element-loading-spinner="el-icon-loading"
				:dataSource="tabPanes.data"
				:columns="CUSTOMER_ORDER_COLUMNS"
				:pagination="tabPanes.pagination"
				:dataTotal="tabPanes.total"
				@handleSizeChange="handleSizeChange"
				@handleChangePage="handleChangePage"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button
						type="text"
						v-permission="'valet_service_detail|valet_service_details'"
						@click="onDetail(scope.data)"
					>
						代客售后
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { VALET_SERVICE_SERACH, CUSTOMER_ORDER_COLUMNS } from './config';
import { formatDateDefault } from '@/util/formValidation';

export default {
	name: 'valetServiceList',
	data() {
		return {
			VALET_SERVICE_SERACH,
			CUSTOMER_ORDER_COLUMNS,
			tabPanes: {
				loading: false,
				data: [],
				total: 0,
				selections: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
			},
			//搜索数据
			searchConfig: {
				time: ['', ''],
				orderNo: '',
				customerCard: '',
				receiverPhone: '',
			},
		};
	},
	computed: {
		// 搜索参数
		searchFields() {
			const { time = ['', ''], ...others } = this.searchConfig;
			return {
				...others,
				commitStartTime: formatDateDefault(time[0]) || null,
				commitEndTime: formatDateDefault(time[1]) || null,
			};
		},
	},
	methods: {
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
		//获取代客售后
		async loadData() {
			let params = {
				...this.searchFields,
				orderStatusList: '2,3,99',
				pageNum: this.tabPanes.pagination.currentPage, //当前页数
				pageSize: this.tabPanes.pagination.pageSize, //每页显示数
			};
			this.tabPanes.loading = true;
			let res = await this.$fetch({
				url: 'mgmt/order/getValetOrderList',
				timeout: 60000 * 1, // 1分钟
				params,
			});
			// res && res.code && res.code == 200
			if (res?.code == 200) {
				const { list, total } = res.data;
				this.tabPanes.data = list;
				this.tabPanes.total = total;
			} else {
				this.tabPanes.data = [];
				this.tabPanes.total = 0;
				// 后台报什么奇怪code 返回错误信息
				if (this.$store.getters['system/getError']) {
					this.$message({
						type: 'error',
						message: res.message,
					});
				}
			}
			this.tabPanes.loading = false;
		},
		// 搜索事件
		onHandleSearch() {
			this.tabPanes.pagination.currentPage = 1;
			this.tabPanes.data = [];
			this.$nextTick(this.loadData);
		},
		//退票详情与审核事件
		onDetail(row) {
			const { orderNo } = row;
			this.$go('valet_service_details', { orderNo });
		},
	},
	mounted() {
		this.onHandleSearch();
	},
};
</script>
