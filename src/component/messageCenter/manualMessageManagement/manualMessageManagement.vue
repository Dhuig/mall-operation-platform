<template>
	<div class="charging-list">
		<guideBar>
			<el-button
				icon="el-icon-circle-plus-outline"
				type="primary"
				v-permission="'manual_message_management_create_new'"
				@click="addMessage"
			>
				新建消息
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel ref="searchPanel" v-model="serachData" :config="config" @search="searchHandle" />
		</el-card>
		<el-card>
			<div class="prent">
				<div class="num-messge">{{ total > 99 ? total + '+' : total }}</div>
			</div>
			<el-tabs v-model="activeStatusTab" ref="eltabs">
				<el-tab-pane :label="item.label" :name="item.name" v-for="(item, index) in tabPane" :key="index"></el-tab-pane>
				<div class="table_list_fix" v-table-scroll="loadMoreData">
					<el-table
						:data="tabPaneObj[activeStatusTab].data"
						border
						:loading="tabPaneObj[activeStatusTab].loading"
						:height="500"
					>
						<el-table-column prop="sendTime" label="发送时间" width="180" align="center">
							<template slot-scope="scope">
								<div>{{ scope.row.sendTime || '--' }}</div>
							</template>
						</el-table-column>
						<el-table-column prop="msgTitle" label="标题" align="center"></el-table-column>
						<el-table-column prop="operatorName" label="创建人员" align="center"></el-table-column>
						<el-table-column prop="msgType" label="消息类型" align="center">
							<template slot-scope="scope">
								<div>{{ filterMsgType(scope.row.msgType) }}</div>
							</template>
						</el-table-column>
						<el-table-column label="操作" fixed="right" align="center">
							<template slot-scope="scope">
								<div>
									<el-button
										v-permission="'manual_message_management_view'"
										type="text"
										v-if="scope.row.planStatus !== 3"
										@click="detail(scope.row)"
									>
										查看
									</el-button>
									<el-button
										v-permission="'manual_message_management_edit'"
										type="text"
										v-if="scope.row.planStatus === 0"
										@click="edit(scope.row)"
									>
										编辑
									</el-button>
									<el-button
										v-permission="'manual_message_management_delete'"
										type="text"
										v-if="scope.row.planStatus === 0 || scope.row.planStatus === 2 || scope.row.planStatus === 3"
										@click="del(scope.row)"
									>
										删除
									</el-button>
									<el-button
										v-permission="'manual_message_management_audit'"
										type="text"
										v-if="scope.row.planStatus === 0"
										@click="review(scope.row)"
									>
										审核
									</el-button>
								</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</el-tabs>
		</el-card>
	</div>
</template>
<script>
import searchPanel from 'component/common/searchPanel';
import { MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG, TAB_PANE, GET_STATUS } from './config';
import qs from 'querystring';
import { formatDate } from 'util/formValidation.js';
export default {
	name: 'manualMessageManagement',
	components: {
		searchPanel,
	},
	data() {
		const tabPaneObj = {
			all: {},
			pending: {},
			tobesent: {},
			hasbeensent: {},
			cancelled: {},
			finished: {},
		};
		for (const key in tabPaneObj) {
			tabPaneObj[key] = {
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
			config: MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG,
			serachData: {
				msgTitle: null,
				time: null,
				startTime: null,
				endTime: '',
				receiverType: null,
				msgType: null,
			},
			tabPane: TAB_PANE,
			getStatus: GET_STATUS,
			msgTypeList: [],
			activeStatusTab: 'all',
			total: 0,
			tabPaneObj,
		};
	},
	activated() {
		this.$listen('MANUAL_MESSAGE_MANAGEMENT_LIST', this.searchHandle);
		this.$listen('MANUAL_MESSAGE_MANAGEMENT_GET_DSH', this.getDsh);
		this.getFilterchannel();
		this.getreceiverType();
		this.getDsh();
	},
	computed: {
		searchData() {
			let { msgTitle, time, receiverType, msgType } = this.serachData;
			let times = time && time.length > 0;
			return {
				msgTitle,
				startTime: times ? formatDate(time[0]) : null,
				endTime: times ? formatDate(time[1] + 86399000) : null,
				receiverType,
				msgType,
			};
		},
		planStatus() {
			return this.getStatus[this.activeStatusTab];
		},
		// store() {
		// 	return this.$store.state;
		// },
	},
	methods: {
		loadMoreData() {
			let { currentPage, pageSize, total } = this.tabPaneObj[this.activeStatusTab].pagination;
			if (currentPage * pageSize >= total) {
				return this.$message.warning('没有更多数据');
			}
			this.tabPaneObj[this.activeStatusTab].pagination.currentPage++;
			this.loadData();
		},
		formatDate,
		async getDsh() {
			let { searchData } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabPaneObj['pending'];
			let params = { ...searchData, planStatus: '0', pageNum, pageSize };
			const res = await this.$fetch(`/mgmt/msgadmin/handmade/list?${qs.stringify(params)}`);
			this.total = res.data.total;
		},
		addMessage() {
			this.$go('add_edit_message', { nowNum: Date.now() });
		},
		async loadData() {
			let { searchData, activeStatusTab, planStatus } = this;
			this.tabPaneObj[activeStatusTab].loading = true;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabPaneObj[activeStatusTab];
			let params = { ...searchData, planStatus, pageNum, pageSize };
			const res = await this.$fetch(`/mgmt/msgadmin/handmade/list?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { list, total } = res.data;
				this.tabPaneObj[activeStatusTab].pagination.total = total;
				this.tabPaneObj[activeStatusTab].data = this.tabPaneObj[activeStatusTab].data.concat(list);
			} else {
				this.tabPaneObj[activeStatusTab].data = [];
				this.tabPaneObj[activeStatusTab].pagination.total = 0;
			}
			this.tabPaneObj[activeStatusTab].loading = false;
		},
		handleChangePage(currentPage) {
			this.tabPaneObj[this.activeStatusTab].pagination.currentPage = currentPage;
			this.loadData();
		},
		searchHandle() {
			this.tabPaneObj[this.activeStatusTab].data = [];
			this.tabPaneObj[this.activeStatusTab].pagination.currentPage = 1;
			this.loadData();
			this.getDsh();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.tabPaneObj[this.activeStatusTab].pagination.pageSize = pageSize;
			this.loadData();
		},
		filterMsgType(val) {
			if (this.msgTypeList.length > 0) {
				this.msgTypeList.forEach(e => {
					if (val === e.dicValue) {
						val = e.dicName;
					}
				});
			}
			return val;
		},
		async getFilterchannel() {
			const res = await this.$fetch('/mgmt/msgadmin/msgType/second');
			if (res.code === 200) {
				this.msgTypeList = res.data;
				this.config.form.forEach(e => {
					if (e.key === 'msgType') {
						res.data.forEach(el => {
							e.options.push({ value: el.dicValue, label: el.dicName });
						});
					}
				});
			}
		},
		async getreceiverType() {
			const res = await this.$fetch('/mgmt/msgadmin/handmade/receiverType');
			if (res.code === 200) {
				this.config.form.forEach(e => {
					if (e.key === 'receiverType') {
						if (e.options.length > 0) return;
						res.data.forEach(el => {
							e.options.push({ value: el.dicValue, label: el.dicName });
						});
					}
				});
			}
		},
		del(row) {
			this.$confirm('确定删除' + (row.msgTitle ? row.msgTitle : '') + '?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/msgadmin/handmade/delete',
					data: { planCode: row.planCode },
				});
				if (res.code === 200) {
					this.$message.success('删除成功!');
					this.searchHandle();
				}
			});
		},
		edit(row) {
			this.$go('add_edit_message', { title: '新建/编辑消息', id: row.planCode });
		},
		review(row) {
			this.$go('message_review', { type: 'message_detail', id: row.planCode });
		},
		// 详情
		detail(row) {
			this.$go('message_detail', { title: '消息详情', id: row.planCode });
		},
	},
	watch: {
		activeStatusTab: {
			immediate: true,
			handler() {
				this.searchHandle();
			},
		},
	},
};
</script>
<style lang="scss" scoped>
.table_list_fix {
	overflow: hidden;
	.btn-operates {
		margin-bottom: 6px;
		a {
			color: #fff;
			text-decoration: none;
			display: inline-block;
		}
	}
}
.table-header {
	padding-top: 10px;
	.table-header_button {
		text-align: right;
		float: right;
		margin-bottom: 12px;
		line-height: 40px;
	}
}
.newjump {
	text-decoration: none;
	color: dodgerblue;
}
::v-deep.pagination {
	text-align: right;
	.el-pagination__sizes {
		float: left;
	}
	.el-pagination__total {
		float: left;
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
