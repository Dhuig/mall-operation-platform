<template>
	<div>
		<guideBar>
			<el-button v-permission="'business_list_batch_export'" type="primary" @click="batchExport">批量导出</el-button>
		</guideBar>
		<el-card class="row-gap">
			<el-form :inline="true" ref="form" :model="form" label-width="140px" label-suffix=":">
				<el-row>
					<el-form-item label="变更日期" prop="date">
						<el-date-picker
							v-model="form.date"
							type="daterange"
							align="left"
							unlink-panels
							value-format="yyyy-MM-dd"
							range-separator="~"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:picker-options="pickerOptions"
						></el-date-picker>
					</el-form-item>
					<el-form-item label="业务类型" prop="businessTypCode">
						<el-select
							v-model="form.businessTypCode"
							placeholder="请选择状态"
							size="medium"
							class="business-select"
							clearable
						>
							<el-option v-for="(option, idx) in business_type" :key="idx" :value="option.code" :label="option.name" />
						</el-select>
					</el-form-item>
					<el-form-item label="会员卡号" prop="cardNo">
						<el-input v-model="form.cardNo" class="business-input" clearable />
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="OA工单号" prop="oaNo">
						<el-input v-model="form.oaNo" class="business-input" placeholder="请填写OA工单号" clearable />
					</el-form-item>
					<el-form-item label="操作人" prop="businessUpdateName">
						<el-input v-model="form.businessUpdateName" class="business-input" placeholder="请填写操作人" clearable />
					</el-form-item>
				</el-row>
				<el-row type="flex" justify="end">
					<el-button icon="el-icon-search" type="primary" @click="search">搜索</el-button>
					<el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
				</el-row>
			</el-form>
		</el-card>
		<el-card class="row-gap">
			<tableList
				border
				:dataSource="data"
				:columns="BUSINESS_LIST_COLUMNS"
				:pagination="pagination"
				:dataTotal="pagination.total"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="row">
					<el-button
						v-permission="'business_list_view|business_detail'"
						type="text"
						@click="handleEdit(row.data.businessNo, row.data.businessTypCode)"
					>
						查看
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { BUSINESS_LIST_COLUMNS } from './config';
import { dateRangePickerGenerator } from 'util';
import { formatDateDefault } from '../../util/formValidation';
import { exportExcel } from '../../util/index';

export default {
	name: 'businessList',
	data() {
		return {
			form: {
				date: [],
				businessTypCode: '',
				cardNo: '',
				oaNo: '',
				businessUpdateName: '',
			},
			BUSINESS_LIST_COLUMNS,
			data: [],
			pagination: {
				total: 0,
				currentPage: 1,
				pageSize: 20,
			},
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			business_type: [],
			pickerOptions: {
				shortcuts: [
					dateRangePickerGenerator('最近一周', 7),
					dateRangePickerGenerator('最近一个月', 30),
					dateRangePickerGenerator('最近三个月', 90),
					dateRangePickerGenerator('最近半年', 180),
					dateRangePickerGenerator('最近一年', 365),
				],
			},
		};
	},
	created() {
		this.form.date = [formatDateDefault(this.getFirstDay()), formatDateDefault(Date.now())];
		this.$listen('GET_BUSINESS_LIST', this.getList);
		this.getList();
		this.getBusinessType();
	},
	computed: {
		searchData() {
			const {
				form,
				form: { date = ['', ''] },
				pagination,
			} = this;
			const dateRange = date ? date : [null, null];
			const params = {
				...form,
				bsUpdateTimeStartStr: dateRange[0],
				bsUpdateTimeEndStr: dateRange[1],
				pageSize: pagination.pageSize,
				pageNum: pagination.currentPage,
			};
			delete params.date;
			return params;
		},
	},
	methods: {
		reset() {
			this.form = {
				date: [formatDateDefault(this.getFirstDay()), formatDateDefault(Date.now())],
				businessTypCode: '',
				cardNo: '',
				oaNo: '',
				businessUpdateName: '',
			};
		},
		// 获取本月第一天的时间
		getFirstDay() {
			var date = new Date();
			date.setDate(1);
			date.setHours(0);
			date.setSeconds(0);
			return date.setMinutes(0);
		},
		// 获取业务列表类型
		async getList() {
			const { searchData: data } = this;
			const res = await this.$fetch({
				method: 'POST',
				url: '/crm/memberBusiness/getBusinessList',
				data,
			});

			if (res && res.data) {
				const { list, total } = res.data;
				this.data = list;
				this.pagination.total = total;
			}
		},
		// 请求业务类型
		async getBusinessType() {
			const res = await this.$fetch('/crm/memberBusiness/getBusinessTypeList');
			if (res && res.data) {
				this.business_type = res.data;
			}
		},
		search() {
			this.getList();
		},
		// 批量导出
		batchExport() {
			const { searchData } = this;
			exportExcel('/crm/memberBusiness/exportBusinessList', searchData);
		},
		// 分页触发事件
		handleChangePage(currentPage) {
			this.pagination.currentPage = currentPage;
			this.getList();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.getList();
		},
		// 编辑业务详情
		handleEdit(no, code) {
			this.$go('business_detail', { title: '查看详情', no, code });
		},
	},
};
</script>

<style lang="scss" scoped>
.row-gap {
	margin-bottom: 16px;
}
.business-input {
	width: 350px;
}
.business-select {
	width: 350px;
}
.searchBtn {
	float: right;
	button:nth-child(2) {
		margin-left: 16px !important;
	}
}
</style>
