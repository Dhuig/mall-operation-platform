<template>
	<div class="charging-list">
		<guideBar>
			<el-button
				v-permission="'announcement_management_add'"
				class="top-btn"
				icon="el-icon-circle-plus-outline"
				type="primary"
				@click="goAddAnnouncement('ruleForm')"
			>
				新建公告
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel ref="searchPanel" v-model="searchData" :config="config" @search="search" />
		</el-card>
		<el-card>
			<div class="prent">
				<div class="num-messge">{{ total > 99 ? total + '+' : total }}</div>
			</div>
			<el-tabs v-model="activeStatusTab">
				<el-tab-pane
					:label="item.label"
					:name="item.name"
					v-for="(item, index) in tabConfig"
					:key="index"
				></el-tab-pane>
				<tableList
					border
					:dataSource="tabPane[activeStatusTab].data"
					:columns="CHANGE_COLUMNS"
					:pagination="tabPane[activeStatusTab].pagination"
					:loding="tabPane[activeStatusTab].loding"
					:dataTotal="tabPane[activeStatusTab].pagination.total"
					slotcontent
					@loadMore="loadMore"
				>
					<template slot-scope="scope">
						<el-button
							v-permission="'announcement_management_detail'"
							type="text"
							v-if="scope.data.status !== 2"
							@click="detail(scope.data)"
						>
							查看
						</el-button>
						<el-button
							v-if="scope.data.status === -2 || scope.data.status === -3"
							type="text"
							@click="eidt(scope.data)"
						>
							编辑
						</el-button>
						<el-button
							v-permission="'announcement_management_delete'"
							type="text"
							v-if="scope.data.status !== -1 && scope.data.status !== 0"
							@click="del(scope.data)"
						>
							删除
						</el-button>
						<el-button
							v-permission="'announcement_management_audit'"
							type="text"
							v-if="scope.data.status === -2"
							@click="review(scope.data)"
						>
							审核
						</el-button>
					</template>
				</tableList>
			</el-tabs>
		</el-card>
	</div>
</template>
<script>
import searchPanel from 'component/common/searchPanel';
import { MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG, CHANGE_COLUMNS, GET_STATUS, TAB_CONFIG } from './config';
import qs from 'querystring';
import { formatDate } from 'util/formValidation.js';
export default {
	name: 'announcementManagement',
	components: {
		searchPanel,
	},
	data() {
		let tabPane = {
			all: {},
			pending: {},
			tobesent: {},
			hasbeensent: {},
			cancelled: {},
			finished: {},
			draft: {},
		};
		for (const key in tabPane) {
			tabPane[key] = {
				loading: false,
				data: [],
				pagination: {
					total: 0,
					currentPage: 1,
					pageSize: 10,
				},
			};
		}
		return {
			searchData: {
				title: null,
				channel: 0,
				typeId: null,
				time: null,
				createTime: null,
			},
			tabConfig: TAB_CONFIG,
			getStatus: GET_STATUS,
			config: MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG,
			CHANGE_COLUMNS,
			total: 0,
			activeStatusTab: 'all',
			tabPane,
		};
	},
	computed: {
		serach() {
			let { title, channel, time, createTime, typeId } = this.searchData;
			let times = time && time.length > 0;
			let createTimes = createTime && createTime.length > 0;
			return {
				title,
				channel,
				typeId,
				releaseBeginTime: times ? formatDate(time[0]) : null,
				releaseEndTime: times ? formatDate(time[1] + 86399000) : null,
				createBeginTime: createTimes ? formatDate(time[0]) : null,
				createEndTime: createTimes ? formatDate(time[1] + 86399000) : null,
			};
		},
		planStatus() {
			return this.getStatus[this.activeStatusTab];
		},
	},
	created() {
		this.$listen('ANNOUNCEMENT_MANAGEMENT', this.search);
		this.$listen('ANNOUNCEMENT_MANAGEMENT_GETDSH', this.getDsh);
		this.getDsh();
		this.announcementType();
	},
	methods: {
		loadMore() {
			let { currentPage, pageSize, total } = this.tabPane[this.activeStatusTab].pagination;
			if (currentPage * pageSize >= total) {
				return this.$message.warning('没有更多数据');
			}
			this.tabPane[this.activeStatusTab].pagination.currentPage++;
			this.loadData();
		},
		removeEnter() {
			document.onkeydown = null;
		},
		async announcementType() {
			const res = await this.$fetch(
				`/mgmt/msgadmin/mgmt/msg/notice/getNoticeTypeByPage?${qs.stringify({ pageNum: 1, pageSize: 100000 })}`
			);
			if (res.code === 200) {
				this.config.form.forEach(el => {
					if (el.key === 'typeId') {
						if (el.options.length > 0) return;
						res.data.list.forEach(e => {
							el.options.push({ label: e.typeName, value: e.id });
						});
					}
				});
			}
		},
		async getDsh() {
			let { serach } = this;
			const { currentPage: pageNum, pageSize } = this.tabPane['pending'].pagination;
			let params = { ...serach, showType: -2, pageNum, pageSize };
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/msgadmin/mgmt/msg/notice/getNoticeByPage`,
				data: params,
			});
			if (res.code === 200) this.total = res.data ? res.data.total : 0;
		},
		async loadData() {
			let { serach, activeStatusTab, planStatus } = this;
			const { currentPage: pageNum, pageSize } = this.tabPane[activeStatusTab].pagination;
			this.tabPane[activeStatusTab].loading = true;
			let params = { ...serach, showType: planStatus, pageNum, pageSize };
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/msgadmin/mgmt/msg/notice/getNoticeByPage',
				data: params,
			});
			if (res && res.code === 200 && res.data) {
				const { list, total } = res.data;
				this.tabPane[activeStatusTab].pagination.total = total;
				this.tabPane[activeStatusTab].data = this.tabPane[activeStatusTab].data.concat(list);
			} else {
				this.tabPane[activeStatusTab].data = [];
				this.tabPane[activeStatusTab].pagination.total = 0;
			}
			this.tabPane[activeStatusTab].loading = false;
		},
		search() {
			this.tabPane[this.activeStatusTab].data = [];
			this.tabPane[this.activeStatusTab].pagination.currentPage = 1;
			this.loadData();
		},
		goAddAnnouncement() {
			this.$go('add_edit_announcement', { numRoumd: Date.now() });
		},
		eidt({ id }) {
			this.$go('add_edit_announcement', { id });
		},
		review({ id }) {
			this.$go('announcement_preview', { title: '公告审核', id });
		},
		del({ id, title }) {
			this.$confirm('确定删除：' + title + '?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: `/mgmt/msgadmin/mgmt/msg/notice/deleteNotice`,
					data: { id },
				});
				if (res && res.code === 200) {
					this.$message.success(res.message);
					this.getDsh();
					this.search();
				}
			});
		},
		detail({ id }) {
			this.$go('announcement_detail', { title: '公告详情', id });
		},
	},
	watch: {
		activeStatusTab: {
			handler() {
				this.search();
			},
			immediate: true,
		},
	},
};
</script>
<style lang="scss" scoped>
.charging-list {
	.top-btn {
		float: right;
		margin-bottom: 14px;
	}
}
.prent {
	position: relative;
	.num-messge {
		display: block;
		position: absolute;
		top: 0px;
		left: 110px;
		width: 26px;
		height: 20px;
		border-radius: 50%;
		background-color: red;
		font-size: 10px;
		line-height: 20px;
		text-align: center;
		color: #fff;
	}
}
</style>
