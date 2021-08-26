<template>
	<div>
		<guideBar>
			<el-button
				v-permission:crm="'member_list_make_discount_card'"
				type="success"
				@click="createNewDiscountCard"
				icon="el-icon-bank-card"
			>
				新开优惠卡
			</el-button>
			<el-button v-permission:crm="'member_pv_list'" type="primary" @click="memberPvLink" icon="el-icon-bank-card">
				会员卡PV查询
			</el-button>
			<el-button
				v-permission="'member_list_member_card_log'"
				type="primary"
				@click="memberCardLogLink"
				icon="el-icon-bank-card"
			>
				会员卡日志查询
			</el-button>
			<el-button v-permission="'member_list_batch_export'" type="primary" @click="batchExport">批量导出</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="MEMBER_LIST_SEARCH" @search="handleSearch(0)" @reset="loadData" />
		</el-card>
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="data"
				:columns="MEMBER_LIST_COLUMNS"
				:pagination="pagination"
				:options="optionsReviewed"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				@toggleRowSelection="toggleRowSelection"
				@handleSelectionChange="handleSelectionChange"
				:dataTotal="total"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button v-permission="'member_list_edit'" type="text" @click="edit(scope.data.id)">编辑</el-button>
					<el-button v-permission="'member_list_detail'" type="text" @click="detail(scope.data.id)">查看</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { timeEndFormat } from 'util';
import { MEMBER_LIST_SEARCH, MEMBER_LIST_COLUMNS } from './config';
import qs from 'querystring';
export default {
	name: 'memberList',
	data() {
		return {
			MEMBER_LIST_SEARCH,
			MEMBER_LIST_COLUMNS,
			searchConfig: {
				cardNo: '',
				realname: '',
				mobile: '',
				cardStatus: '',
				createTimeRange: [],
				certificatesNo: '',
				orderDate: '',
				cancelDate: '',
			},
			loading: false,
			data: [],
			pagination: {
				currentPage: 1,
				pageSize: 20,
			},
			optionsReviewed: {
				label: '全部',
				index: true,
				selection: true,
				labelIndex: '序号',
			},
			tableRef: '', // 继承表格组件的ref标识
			selection: [], // 勾选的数据
			total: 0,
		};
	},
	computed: {
		// 搜索参数
		searchFields() {
			const {
				searchConfig,
				searchConfig: { createTimeRange = ['', ''] },
			} = this;
			const params = {
				...searchConfig,
				createStartTimeLong: createTimeRange[0] || '',
				createEndTimeLong: timeEndFormat(createTimeRange[1]) || '',
			};
			delete params.createTimeRange;
			return params;
		},
	},
	methods: {
		handleChangePage(currentPage) {
			this.pagination.currentPage = currentPage;
			this.loadData();
		},
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.loadData();
		},
		// 初始化清空复选框勾选状态
		toggleRowSelection(that) {
			this.tableRef = that;
			return that.clearSelection();
		},
		// 复选框选中项
		handleSelectionChange(val) {
			this.selection = [];
			val.map(items => {
				this.selection.push(items.cardNo);
			});
			this.searchFields.cardNo = String(this.selection);
		},
		// 搜索
		handleSearch(addState) {
			console.log(111111);
			let searchState = '';
			for (let key in this.searchFields) {
				if (key !== 'cardStatus' && this.searchFields[key]) {
					searchState = this.searchFields[key];
				}
			}
			// 判断搜索条件
			if (!searchState) {
				console.log(searchState);
				console.log(111111);
				if (addState) {
					return;
				}
				let searchTitle = this.searchFields.cardStatus ? '会员卡状态不可单独搜索' : '搜索条件不能为空';
				this.$message.warning(searchTitle);
				return;
			}
			console.log(222222222);
			this.data = [];
			this.pagination.currentPage = 1;
			this.loadData();
		},
		async batchExport() {
			// this.selection
			const {
				searchFields,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			const searchData = {
				pageNum,
				pageSize,
				...searchFields,
			};
			// exportExcel('/crm/cardMgmt/exportMemberCard', searchData);
			const res = await this.$fetch(`/crm/cardMgmt/exportMemberCard?${qs.stringify(searchData)}`);
			if (res && res.code === 200) {
				this.$message.success('excel表格正在生成中，请在下载管理查看');
			} else {
				this.$message.warning(res.message);
			}
		},
		async loadData() {
			const {
				searchFields,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			const data = {
				pageNum,
				pageSize,
				...searchFields,
			};
			// data.createEndTimeLong += 86399999
			this.loading = true;

			const res = await this.$fetch({
				method: 'POST',
				url: '/crm/cardMgmt/getMemberCardPage',
				data,
				timeout: 10000 * 2,
			});

			if (res && res.data) {
				const { list, total } = res.data;
				if (!list.length) {
					this.$message.warning('搜索无数据，请检查查询条件');
				}
				this.data = list;
				this.total = total;
			} else {
				this.data = [];
				this.total = 0;
				this.$message.warning('搜索无数据，请检查查询条件');
			}
			this.loading = false;
		},
		createNewDiscountCard() {
			this.$go('make_discount_card', { type: 'add', title: '新开优惠卡' });
		},
		memberPvLink() {
			this.$go('member_pv_list', { title: '会员卡PV查询' });
		},
		edit(id) {
			this.$go('make_discount_card', { id, type: 'edit', title: '编辑优惠卡' });
		},
		detail(id) {
			this.$go('make_discount_card', { id, type: 'preview', title: '查看优惠卡' });
		},
		// 会员卡日志查询
		memberCardLogLink() {
			this.$go('member_card_log');
		},
	},
	mounted() {
		// this.$listen('UPDATE_MEMBER_LIST', this.loadData);
		this.$listen('UPDATE_MEMBER_LIST', () => {
			this.handleSearch(1);
		});
		// this.$nextTick(this.loadData);
	},
};
</script>
