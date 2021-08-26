<template>
	<div class="area-manage-list">
		<guideBar>
			<el-button v-permission="'area_manage_add'" type="primary" @click="addAreaManage">新增地区</el-button>
		</guideBar>
		<el-card>
			<el-row type="flex">
				<el-col :span="8" class="month-label">
					<div>省份：</div>
					<el-select
						placeholder="请选择省份"
						v-model="searchData.provinceCode"
						@change="getCityList(searchData.provinceCode)"
						size="medium"
						clearable
					>
						<el-option
							v-for="item in provinceList"
							:key="item.provinceCode"
							:label="item.provinceName"
							:value="item.provinceCode"
						></el-option>
					</el-select>
				</el-col>
				<el-col :span="8" class="month-label">
					<div>城市：</div>
					<el-select
						placeholder="请选择城市"
						v-model="searchData.cityCode"
						@change="getRegionListByCity(searchData.cityCode)"
						size="medium"
						clearable
					>
						<el-option
							v-for="item in cityList"
							:key="item.cityCode"
							:label="item.cityName"
							:value="item.cityCode"
						></el-option>
					</el-select>
				</el-col>
				<el-col :span="8" class="month-label">
					<div>区域：</div>
					<el-select placeholder="请选择区/县" v-model="searchData.districtCode" clearable size="medium">
						<el-option
							v-for="item in districtList"
							:key="item.districtCode"
							:label="item.districtName"
							:value="item.districtCode"
						></el-option>
					</el-select>
				</el-col>
			</el-row>
			<el-row type="flex">
				<el-col :span="10" class="month-label">
					<div>乡镇街道：</div>
					<el-input placeholder="请输入乡镇街道" v-model="searchData.streetName" clearable />
				</el-col>
			</el-row>
			<el-row type="flex" justify="end">
				<el-col :span="6" class="my-col">
					<el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
					<el-button icon="el-icon-refresh-left" class="ml-16" @click="reset">重置</el-button>
				</el-col>
			</el-row>
		</el-card>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="dataSource"
				:columns="AREA_MANGE_COLUMNS"
				:pagination="pagination"
				:dataTotal="total"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button v-permission="'area_manage_edit'" type="text" @click="handleEdit(scope.data)">编辑</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>
<script>
import { AREA_MANGE_COLUMNS } from './config';
import qs from 'querystring';

export default {
	name: 'areaManageList',
	data() {
		return {
			loading: false,
			arr: [], // 多级下拉数据
			AREA_MANGE_COLUMNS,
			dataSource: [],
			searchData: {
				provinceCode: '',
				cityCode: '',
				districtCode: '',
				streetName: '',
			},
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			total: 0,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			provinceList: [], // 省数据
			cityList: [], // 市数据
			districtList: [], // 区/县数据
		};
	},
	methods: {
		// 查询事件
		search() {
			this.pagination.currentPage = 1;
			this.getList();
		},
		// 重置事件
		reset() {
			this.searchData = {
				provinceCode: '',
				cityCode: '',
				districtCode: '',
				streetName: '',
			};
		},
		// 分页触发事件
		handleChangePage(val) {
			this.pagination.currentPage = val;
			this.getList();
		},
		// 分页下拉触发事件
		handleSizeChange(val) {
			this.pagination.pageSize = val;
			this.getList();
		},

		// 多级下拉框事件
		handleChange() {
			// 选择之后将下拉界面收起
			this.$refs.elcascader.dropDownVisible = false;
		},
		// 新增地区
		addAreaManage() {
			this.$go('update_area_manage', { title: '添加地区', state: 'add' });
		},
		// 编辑地区
		handleEdit(data) {
			this.$go('update_area_manage', { title: '编辑地区', data: JSON.stringify(data) });
		},
		// 获取省份信息
		async getProvinceList() {
			const res = await this.$fetch(`/mgmt/sys/getProvinceList`);
			if (res && res.data) {
				this.provinceList = res.data;
			}
		},
		// 根据省份编码获取下属城市
		async getCityList(provinceCode) {
			const res = await this.$fetch(`/mgmt/sys/getCityList?provinceCode=${provinceCode}`);
			if (res && res.data) {
				this.cityList = res.data;
				this.districtList = [];
				this.searchData.cityCode = '';
				this.searchData.districtCode = '';
			}
		},
		// 根据城市编码获取下属地区
		async getRegionListByCity(cityCode) {
			const res = await this.$fetch(`/mgmt/sys/getRegionListByCity?cityCode=${cityCode}`);
			if (res && res.data) {
				this.districtList = res.data;
				this.searchData.districtCode = '';
			}
		},
		// 请求数据
		async getList() {
			this.loading = true;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this;

			const params = {
				pageNum,
				pageSize,
				...this.searchData,
			};
			const res = await this.$fetch(`/mgmt/sys/region/page?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { list, total } = res.data;
				this.dataSource = list;
				this.total = total;
			} else {
				this.dataSource = [];
				this.total = 0;
			}
			this.loading = false;
		},
	},
	created() {
		this.$listen('UPDATE_AREA_LIST', this.getList);
		this.getList();
		this.getProvinceList();
	},
};
</script>
<style lang="scss" scoped>
::v-deep.area-manage-list {
	.month-label {
		font-size: 14px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-top: 10px;
		margin-bottom: 26px;
		div {
			min-width: 60px;
			text-align: right;
		}
		.el-input,
		.el-input__inner {
			width: 240px;
		}
	}
	.my-col {
		text-align: right;
	}
}
</style>
