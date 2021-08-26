<template>
	<div class="updateUser">
		<guideBar />
		<el-card class="base-info">
			<el-form :model="baseData" label-width="110px" label-suffix=":">
				<el-row>
					<el-col :span="8">
						<el-form-item label="服务中心编号">{{ baseData.storeCode }}</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="服务中心名称">{{ baseData.storeName }}</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="分公司">{{ baseData.companyName }}</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="负责人卡号">{{ baseData.leaderNo }}</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="负责人姓名">{{ baseData.leaderName }}</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="dataSource"
				:columns="SERVICE_BANKHISTORY_COLUMNS"
				:pagination="pagination"
				:dataTotal="total"
				:options="{ index: true, labelIndex: '序号' }"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { SERVICE_BANKHISTORY_COLUMNS } from './config.js';
import qs from 'querystring';
export default {
	name: 'serviceBankDetail',
	data() {
		return {
			SERVICE_BANKHISTORY_COLUMNS,
			id: '', // 数据id
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			total: 0,
			loading: false,
			dataSource: [],
			baseData: {},
		};
	},

	computed: {
		loadDataPost() {
			const {
				id,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			return {
				id,
				pageNum,
				pageSize,
			};
		},
	},
	methods: {
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
		// 银行账号操作记录
		async getList() {
			this.loading = true;
			const res = await this.$fetch(`/mgmt/store/listBankAccountLog?${qs.stringify(this.loadDataPost)}`);
			if (res && res.code == 200 && res.data) {
				const { list, total } = res.data;
				this.dataSource = list;
				this.total = total;
			} else {
				this.$message.error(res.data.message || '获取操作记录失败');
			}
			this.loading = false;
		},
	},
	mounted() {
		const { companyName, storeCode, storeName, leaderNo, leaderName, id } = this.$route.query;
		this.id = id;
		this.baseData = { companyName, storeCode, storeName, leaderNo, leaderName };
		this.getList();
	},
};
</script>
<style lang="scss" scoped>
::v-deep.updateUser {
	.base-info {
		.el-form-item {
			margin-bottom: 0;
			color: $color-body;
			.el-form-item__label,
			.el-form-item__content {
				color: $color-hit;
			}
		}
	}
}
</style>
