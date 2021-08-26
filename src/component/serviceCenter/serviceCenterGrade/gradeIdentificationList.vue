<template>
	<div class="grade-identification-list">
		<guideBar>
			<el-button type="primary" v-permission="'grade_identification_list_export_excel'" @click="exportExcel">
				导出EXCEL
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="SERVICE_CENTER_GRADE_IDENTIFICATION_SEARCH" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="list"
				:columns="SERVICE_CENTER_GRADE_IDENTIFICATION_COLUMS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="{ index: true, labelIndex: '序号' }"
				:height="500"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button
						v-permission="'grade_identification_list_detail|service_grade_identification_detail'"
						type="text"
						@click="toDetail(scope.data)"
					>
						详情
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { SERVICE_CENTER_GRADE_IDENTIFICATION_SEARCH, SERVICE_CENTER_GRADE_IDENTIFICATION_COLUMS } from './config';
import { exportExcel } from 'util';
import qs from 'querystring';
export default {
	name: 'gradeIdentificationList',
	data() {
		return {
			SERVICE_CENTER_GRADE_IDENTIFICATION_SEARCH,
			SERVICE_CENTER_GRADE_IDENTIFICATION_COLUMS,
			searchConfig: {},
			pagination: {
				currentPage: 1,
				pageSize: 20,
			},
			dataTotal: 0,
			list: [],
			loading: false,
		};
	},
	computed: {
		loadDataPost() {
			const {
				searchConfig,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			let data = {
				...searchConfig,
				pageNum,
				pageSize,
			};
			return data;
		},
	},
	methods: {
		// 导出excel
		exportExcel() {
			exportExcel('/mgmt/store/exportStoreLevelResultList', this.loadDataPost);
		},
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
		},
		// 分页触发事件
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 分页下拉触发事件
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 详情
		toDetail(row) {
			const { storeCode } = row;
			this.$go('service_grade_identification_detail', { storeCode });
		},
		// 初始化省份
		async initProvinces() {
			const res = await this.$fetch(`/mgmt/sys/getProvinceList`);
			if (res && res.data) {
				this.SERVICE_CENTER_GRADE_IDENTIFICATION_SEARCH.form[4].options = res.data.map(
					({ provinceName: label, provinceCode: value }) => ({ label, value })
				);
			} else {
				this.$message.warning('省份信息更新失败');
			}
		},
		// 初始化分公司
		initCompanyList() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			this.SERVICE_CENTER_GRADE_IDENTIFICATION_SEARCH.form[2].options =
				serviceCompanyOptions?.map(({ label, value }) => ({
					label: `${value} ${label}`,
					value,
				})) || [];
		},
		// 请求数据
		async loadData() {
			this.loading = true;
			const res = await this.$fetch({
				url: `/mgmt/store/getStoreLevelResultList?${qs.stringify(this.loadDataPost)}`,
				callback: () => {
					this.loading = false;
				},
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
				if (total == 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.list = [];
				this.total = 0;
				this.$message.error('获取列表数据失败');
			}
		},
	},
	mounted() {
		this.loadData();
		this.initProvinces();
		this.initCompanyList();
	},
};
</script>

<style></style>
