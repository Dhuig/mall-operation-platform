<template>
	<div class="area-manage-list">
		<guideBar>
			<el-button v-permission="'image_hand_book_import'" type="primary" @click="importBtn">导 出</el-button>
		</guideBar>
		<el-card>
			<searchPanel ref="searchPanel" v-model="searchData" :config="IMAGE_BOOK_RECORD_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="imageBook"
				:columns="IMAGE_BOOK_RECORD_COLUMNS"
				:pagination="pagination"
				:dataTotal="total"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			>
			</tableList>
		</el-card>
	</div>
</template>
<script>
import { IMAGE_BOOK_RECORD_COLUMNS, IMAGE_BOOK_RECORD_CONFIG } from './config';
import { formatDate } from 'util/formValidation';
import { exportExcel } from 'util';
export default {
	name: 'imageBookRecord',
	data() {
		return {
			loading: false,
			IMAGE_BOOK_RECORD_COLUMNS,
			IMAGE_BOOK_RECORD_CONFIG,
			imageBook: [],
			searchData: {
				downloader: '',
				storeCode: '',
				manualName: '',
        downloadTime:[]
			},
			options: {
				index: true,
				labelIndex: '序号',
			},
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			total: 0,
		};
	},
	computed: {
    search(){
      let {downloadTime:[startTimes="",endTimes=""],downloader,storeCode,manualName} = this.searchData
      let startTime = startTimes?formatDate(startTimes):null
      let endTime = endTimes?formatDate(endTimes+86399000):null
      return {startTime,endTime,downloader,storeCode,manualName}
    }
	},
	methods: {
    async importBtn(){
      exportExcel(`/mgmt/sys/image/record/export`,this.search)
    },
		// 查询事件
		handleSearch() {
			this.pagination.currentPage = 1;
			this.getList();
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
		// 请求数据
		async getList() {
			this.loading = true;
			const { currentPage: pageNum, pageSize }= this.pagination;
			const params = {pageNum,pageSize,...this.search};
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/sys/image/record/page`,
				params,
			});
			if (res && res.code === 200) {
				const { list, total } = res.data;
				this.imageBook = list;
				this.total = total;
			} else {
				this.imageBook = [];
				this.total = 0;
			}
			this.loading = false;
		},
	},
	created() {
		this.getList();
    this.$listen('IMAGE_BOOK_RECORD',this.getList)
	},
};
</script>
<style lang="scss" scoped>

</style>
