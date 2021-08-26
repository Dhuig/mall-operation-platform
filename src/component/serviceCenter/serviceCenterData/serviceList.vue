<template>
	<div class="userManagement">
		<guideBar>
			<el-button
				v-permission:crm="'service_list_add_service'"
				type="success"
				@click="addServiceCenter"
				icon="el-icon-s-home"
			>
				新增服务中心
			</el-button>
			<el-button v-permission="'service_list_export_excel'" type="primary" @click="exportExcel">导出EXCEL</el-button>
		</guideBar>
		<el-card class="search-card">
			<searchPanel v-model="searchConfig" :config="SERVICE_CENTER_DATA_CONFIG" showExpand @search="handleSearch">
				<el-select filterable slot="regionCode" clearable v-model="searchConfig.provinceCode">
					<el-option v-for="item in provinces" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</searchPanel>
		</el-card>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="list"
				:columns="SERVICE_MANAGEMENT_COLUMNS"
				:pagination="pagination"
				:dataTotal="total"
				:options="{ index: true, labelIndex: '序号' }"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="row">
					<el-button
						v-permission="'service_list_detail|service_detail'"
						type="text"
						size="small"
						@click="viewDetail(row.data, 'detail')"
					>
						详情
					</el-button>
					<template v-if="!row.data.del">
						<el-button
							v-permission="'service_list_reset_password'"
							type="text"
							size="small"
							@click="toResetPassword(row.data, 'resetPassword')"
						>
							重置密码
						</el-button>
					</template>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { SERVICE_CENTER_DATA_CONFIG, SERVICE_MANAGEMENT_COLUMNS, BRANCH_COMPANY, NETWORK_TYPE } from './config.js';
import qs from 'querystring';
import { exportExcel } from 'util';
import { formatDateDefault } from 'util/formValidation.js';
export default {
	name: 'serviceList',
	data() {
		return {
			SERVICE_CENTER_DATA_CONFIG,
			SERVICE_MANAGEMENT_COLUMNS,
			BRANCH_COMPANY,
			NETWORK_TYPE,
			searchConfig: {},
			pagination: {
				currentPage: 1,
				pageSize: 20,
			},
			total: 0,
			list: [],
			loading: false,
			provinces: [],
		};
	},
	mounted() {
		this.shopTypeList();
		this.getList();
		this.loadProvinces();
		this.$listen('UPDATE_SERVICE_CENTRE_LIST', this.getList);
	},
	computed: {
		// 搜索参数
		loadDataPost() {
			const {
				searchConfig,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			let data = {
				...searchConfig,
				ratifyStartTime: searchConfig.ratifyDate && formatDateDefault(searchConfig.ratifyDate[0]),
				ratifyEndTime: searchConfig.ratifyDate && formatDateDefault(searchConfig.ratifyDate[1]),
				pageNum,
				pageSize,
			};
			return data;
		},
	},
	methods: {
		// 导出EXCEL
		exportExcel() {
			exportExcel('/mgmt/store/exportStore', this.loadDataPost);
		},
		// 新增服务中心
		addServiceCenter() {
			this.$go('service_add', { title: '新增服务中心' });
		},
		// 查询事件
		handleSearch() {
			this.pagination.currentPage = 1;
			this.getList();
		},
		// 分页触发事件
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.getList();
		},
		// 分页下拉触发事件
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.getList();
		},
		// 详情
		viewDetail(row) {
			const { code, leaderCardNo: cardNo } = row;
			this.$go('service_detail', { code, cardNo });
		},
		// 重置密码
		toResetPassword(row) {
			this.$confirm('确认后服务中心负责人的登录密码将更改为默认密码', '提示')
				.then(() => {
					this.resetPassword(row);
				})
				.catch(() => {});
		},
		// 重置密码
		async resetPassword(row) {
			const { code: storeCode, leaderCardNo: cardNo } = row;
			const res = await this.$fetch({
				method: 'POST',
				url: '/auth/store/restPsw',
				data: { storeCode, cardNo },
			});
			if (res && res.code === 200) {
				this.$message.success('重置成功');
				this.getList();
			} else {
				this.$message.error(res.data.message || '重置失败');
			}
		},
		// 获取省份数据
		async loadProvinces() {
			const res = await this.$fetch(`/mgmt/sys/getProvinceList`);
			if (res && res.code === 200) {
				this.provinces = res.data.map(item => ({
					label: item.provinceName,
					value: item.provinceCode,
				}));
			} else {
				this.$message.warning('获取省份数据失败');
			}
		},
		// 网点类型列表
		async shopTypeList() {
			this.$store.getters['system/getOptions'].shopTypeOptions.map(({ label, value }) => {
				this.NETWORK_TYPE[value] = label;
			});
		},
		// 请求数据
		async getList() {
			this.loading = true;
			this.list = [];
			const res = await this.$fetch({
				url: `/mgmt/store/listStore?${qs.stringify(this.loadDataPost)}`,
				callback: () => {
					this.loading = false;
				},
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.total = total;
				if (total == 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error((res && res.data.message) || '获取列表数据失败');
			}
		},
	},
};
</script>
<style lang="scss" scoped>
::v-deep.userManagement {
	.bg-red {
		color: $error;
	}
	.search-card {
		.el-form-item__label {
			width: 185px !important;
		}
	}
}
</style>
