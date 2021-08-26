<template>
	<div class="userManagement">
		<guideBar>
			<el-button v-permission="'cargo_damage_list_add'" type="success" @click="goCreate" icon="el-icon-s-release">
				新增货损货差单
			</el-button>
			<el-button
				v-permission="'cargo_damage_list_export_excel'"
				type="primary"
				@click="batchExport"
				icon="el-icon-download"
			>
				导出EXCEL
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="CARGO_DAMAGE_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				:dataSource="dataSource"
				:columns="CARGO_DAMAGE_COLUMNS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button v-permission="'cargo_damage_list_detail'" type="text" @click="viewDetail(scope.data)">
						详情
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { CARGO_DAMAGE_CONFIG, CARGO_DAMAGE_COLUMNS } from './config.js';
import qs from 'querystring';
import { exportExcel } from 'util';

export default {
	name: 'cargoDamageList',
	data() {
		return {
			CARGO_DAMAGE_CONFIG,
			CARGO_DAMAGE_COLUMNS,
			registrationTime: [],
			searchConfig: {
				beginTime: '',
				diffType: '',
				endTime: '',
				orderSn: '',
				orderStatus: '',
				storeCode: '',
			},
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 200,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			dataSource: [],
			loading: false,
		};
	},
	created() {
		this.loadData();
		this.getBranComByType();
		this.$listen('UP_LIST', this.loadData);
	},
	computed: {
		// 搜索参数
		searchFields() {
			const { searchConfig } = this;
			const { currentPage, pageSize } = this.pagination;
			let data = {
				...searchConfig,
				pageNum: currentPage,
				pageSize,
			};
			if (data.registrationTime) {
				data.beginTime = data.registrationTime[0] ? this.formatDate(data.registrationTime, 0) : '';
				data.endTime = data.registrationTime[1] ? this.formatDate(data.registrationTime, 1) : '';
			}
			return data;
		},
	},
	methods: {
		// 格式化时间
		formatDate(item, index) {
			if (item && item.length >= 2) {
				let d = new Date(item[index]);
				let YY = d.getFullYear() + '-';
				let MM = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '-';
				let DD = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
				return YY + MM + DD;
			} else {
				return '';
			}
		},
		// 获取公司的信息列表
		async getBranComByType() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			this.CARGO_DAMAGE_CONFIG.form[2].options = serviceCompanyOptions.map(({ label, value }) => {
				return {
					label: `${label} ${value}`,
					value,
				};
			});

			// const res = await this.$fetch(`/sys/api/getBranComByType`);
			// if (res && res.code === 200) {
			// 	let list = res.data;
			// 	this.CARGO_DAMAGE_CONFIG.form[2].options = list.map((item) => {
			// 		return {
			// 			label: item.code+'-'+item.name,
			// 			value: item.code,
			// 		};
			// 	});
			// }
		},
		// 新建用户
		goCreate() {
			this.$go('/cargo_damage_creat');
		},
		// 搜索
		handleSearch() {
			this.pagination = {
				currentPage: 1,
				pageSize: 10,
			};
			this.loadData();
		},
		// 导出
		batchExport() {
			const { pagination, searchFields } = this;

			const params = {
				...pagination,
				...searchFields,
			};
			exportExcel('/mgmt/inventory/diffOrder/export', params);
		},
		// 请求数据
		async loadData() {
			this.loading = true;
			const {
				pagination: { currentPage: pageNum, pageSize },
				searchConfig,
				searchFields,
			} = this;

			const params = {
				pageNum,
				pageSize,
				...searchConfig,
				...searchFields,
			};
			const res = await this.$fetch(`/mgmt/inventory/diffOrder/orderList?${qs.stringify(params)}`);

			if (res.code === 200) {
				const { list, total } = res.data;
				this.dataSource = list;
				this.dataTotal = total;
			} else {
				this.dataSource = [];
				this.dataTotal = 0;
			}
			this.loading = false;
		},
		handleBtnsGruop(row, handleType) {
			if (handleType === 'detail') {
				this.$go('/cargo_damage_detail', { id: row.id, orderStatus: row.orderStatus });
			} else {
				return;
			}
		},
		// 查看详情
		viewDetail({ id, orderStatus }) {
			this.$go('/cargo_damage_detail', { id, orderStatus });
		},
		// 分页触发事件
		handleChangePage(val) {
			this.pagination.currentPage = val;
			this.loadData();
		},
		// 分页下拉触发事件
		handleSizeChange(val) {
			this.pagination.pageSize = val;
			this.loadData();
		},
	},
};
</script>
