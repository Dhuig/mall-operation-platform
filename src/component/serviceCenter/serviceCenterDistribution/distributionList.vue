<template>
	<div class="distributionList">
		<guideBar>
			<!-- @todo 暂时屏蔽 -->
			<el-button v-permission="'service_distribution_list_batch_import'" type="primary" @click="batchImport">
				批量导入
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="SERVICE_CENTER_DISTRIBUTION_CONFIG" @search="loadData" />
		</el-card>
		<el-card>
			<tableList
				border
				:dataSource="list"
				:columns="SERVICE_CENTER_DISTRIBUTION_COLUMS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="row">
					<el-button
						v-permission="'service_distribution_list_detail|service_distribution_detail'"
						type="text"
						@click="detail(row.data)"
					>
						详情
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { SERVICE_CENTER_DISTRIBUTION_CONFIG, SERVICE_CENTER_DISTRIBUTION_COLUMS } from './config';
import qs from 'querystring';

export default {
	name: 'distributionList',
	data() {
		return {
			SERVICE_CENTER_DISTRIBUTION_COLUMS,
			SERVICE_CENTER_DISTRIBUTION_CONFIG,
			pagination: {
				currentPage: 1,
				pageSize: 20,
			},
			searchConfig: {
				companyCode: '',
				leaderCardNo: '',
				leaderName: '',
				name: '',
				storeCode: '',
			},
			dataTotal: 0,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			list: [],
			loading: false,
		};
	},
	mounted() {
		this.loadData();
		this.getBranComByType();
	},
	computed: {
		// 搜索参数
		searchFields() {
			const { searchConfig } = this;
			return {
				...searchConfig,
			};
		},
	},
	methods: {
		detail(row) {
			this.$go('service_distribution_detail', { code: row.code });
		},
		// 请求数据
		async loadData() {
			this.loading = true;
			const {
				pagination: { currentPage: pageNum, pageSize },
				searchFields,
			} = this;

			const params = {
				pageNum,
				pageSize,
				...searchFields,
			};
			const res = await this.$fetch(`/mgmt/inventory/distribution/listDistribution?${qs.stringify(params)}`);

			if (res.code === 200) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
			} else {
				this.list = [];
				this.dataTotal = 0;
				this.$message.error('获取列表数据失败');
			}
			this.loading = false;
		},
		// 获取公司的信息
		async getBranComByType() {
			const res = await this.$fetch(`/mgmt/inventory/common/getCompanyList`);
			if (res && res.code === 200) {
				let list = res.data;
				SERVICE_CENTER_DISTRIBUTION_CONFIG.form[4].options = list.map(item => {
					return {
						label: item.name,
						value: item.code,
					};
				});
			}
		},
		// 分页触发事件
		handleChangePage(val) {
			this.pagination.currentPage = val;
			this.loadData();
		},
		// 分页下拉触发事件
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 批量导入
		batchImport() {
			this.$go('service_distribution_import');
		},
		// 弹窗-取消
		closeDialog() {
			this.centerDialogVisible = false;
		},
		// 弹窗-确认
		openDialog() {
			this.centerDialogVisible = false;
		},
	},
};
</script>
