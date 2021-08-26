<template>
	<div>
		<guideBar />
		<el-card class="box-card">
			<searchPanel ref="searchPanel" v-model="params" :config="searchConfig" @search="search" />
		</el-card>
		<el-card>
			<tableList
				border
				:dataSource="dataSource"
				:columns="COULUMNS_SUBSCENEMANAGEMENT"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:loading="loading"
				slotcontent
				@loadMore="loadMore"
			>
				<template slot-scope="row">
					<span class="btns" @click="detail(row.data)">查看</span>
					<span class="btns" @click="edit(row.data)">编辑</span>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { SYSTEM_MESSGE_MANAGEMENT_SUBSCENEMANAGEMENT_LIST_CONFIG } from './config.js';
import { COULUMNS_SUBSCENEMANAGEMENT } from './config.js';
import { formatDateStr } from 'util/formValidation.js';
export default {
	name: 'subSceneManagement',
	data() {
		return {
			params: {
				sceneTitle: '',
				status: '-1',
				time: '',
			},
			COULUMNS_SUBSCENEMANAGEMENT,
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 200,
			dataSource: [],
			loading: false,
		};
	},
	computed: {
		searchConfig() {
			return SYSTEM_MESSGE_MANAGEMENT_SUBSCENEMANAGEMENT_LIST_CONFIG;
		},
		searchData() {
			let { sceneTitle, status, time } = this.params;
			let times = time && time.length > 0;
			return {
				sceneTitle,
				status,
				startTime: times ? formatDateStr(time[0]) : null,
				endTime: times ? formatDateStr(time[1] + 86399000) : null,
			};
		},
	},
	activated() {
		if (!this.$route.query && !this.$route.query.sceneId) return;
		this.loadData();
	},
	created() {
		this.$listen('SUBTEM_MESSAGE_LIST', this.search);
	},
	methods: {
		// 第一步：增加滚动到底部时触发的回调函数，并绑定到tabList组件上 例如：<tablist @loadMore="loadMore" />
		loadMore() {
			let { currentPage, pageSize } = this.pagination;
			if (currentPage * pageSize >= this.dataTotal) {
				return this.$message.warning('没有更多数据');
			}
			this.pagination.currentPage++;
			this.loadData();
		},
		search() {
			this.pagination.currentPage = 1;
			this.dataSource = [];
			this.loadData();
		},
		async loadData() {
			let { currentPage: pageNum, pageSize } = this.pagination;
			let { sceneId, platformId } = this.$route.query;
			let params = { pageSize, pageNum, sceneId, platformId, ...this.searchData };
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/msgadmin/plan/search`,
				data: params,
			});
			if (res && res.code === 200 && res.data) {
				let { list, total } = res.data;
				// 第二步：改成用concat拼接加载数据
				this.dataSource = this.dataSource.concat(list);
				this.dataTotal = total;
			}
		},
		edit({ id }) {
			let { sceneId, platformId } = this.$route.query;
			this.$go('edit_system_message', {
				title: '编辑系统消息',
				id,
				sceneId,
				platformId,
			});
		},
		detail({ id }) {
			let { sceneId, platformId } = this.$route.query;
			this.$go('system_message_detail', {
				title: '系统消息详情',
				id,
				sceneId,
				platformId,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.box-card {
	margin: 24px 0;
}
.btns {
	color: #0877fd;
	cursor: pointer;
	margin-right: 18px;
}
</style>
