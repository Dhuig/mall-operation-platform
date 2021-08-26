<template>
	<div class="charging-list">
		<guideBar>
			<el-button
				v-permission="'message_template_management_add'"
				class="top-btn el-icon-folder-add"
				type="primary"
				@click="add"
			>
				新建模板消息
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel ref="searchPanel" v-model="serach" :config="config" @search="handleSearch" />
		</el-card>
		<el-card v-table-scroll="loadMoreData">
			<el-table :data="all.data" border style="width: 100%" :height="500">
				<el-table-column prop="templateCode" label="模板编号" align="center"></el-table-column>
				<el-table-column prop="templateName" label="模板名称" align="center"></el-table-column>
				<el-table-column prop="updateTime" label="编辑时间" align="center" width="160"></el-table-column>
				<el-table-column prop="msgType" label="消息类型" align="center">
					<template slot-scope="scope">
						<span>{{ msgTypeData(scope.row.msgType) }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="模板状态" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.status === 0 ? '已停用' : '已启用' }}</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center" width="200">
					<template slot-scope="scope">
						<el-button v-permission="'message_template_management_view'" type="text" @click="detail(scope.row)">
							查看
						</el-button>
						<el-button v-permission="'message_template_management_toggle'" type="text" @click="status(scope.row)">
							{{ scope.row.status === 1 ? '停用' : '启用' }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>
<script>
import searchPanel from 'component/common/searchPanel';
import { MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG, CHANGE_COLUMNS } from './config';
import { formatDate } from 'util/formValidation.js';
export default {
	name: 'messageTemplateManagement',
	components: {
		searchPanel,
	},
	data() {
		return {
			config: MANUAL_MESSGE_MANAGEMENT_LIST_CONFIG,
			CHANGE_COLUMNS,
			listType: [],
			all: {
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
					total: 0,
				},
				loading: false,
			},
			serach: {
				templateCode: '',
				templateName: '',
				msgType: '',
				status: '',
				time: null,
			},
		};
	},
	activated() {
		this.loadData();
		this.getMsgType();
		this.$listen('MESSGE_TEMPLATE_MANAGEMENT', this.handleSearch);
	},
	computed: {
		serachData() {
			let { templateCode, templateName, msgType, status, time } = this.serach;
			let times = time && time.length > 0;
			return {
				templateCode,
				templateName,
				msgType,
				status,
				startTime: times ? formatDate(time[0] + 86399000) : '',
				endTime: times ? formatDate(time[1] + 86399000) : '',
			};
		},
	},
	methods: {
		loadMoreData() {
			let { currentPage, pageSize, total } = this.all.pagination;
			if (currentPage * pageSize >= total) {
				return this.$message.warning('没有更多数据');
			}
			this.all.pagination.currentPage++;
			this.loadData();
		},
		async loadData() {
			let { currentPage: pageNum, pageSize } = this.all.pagination;
			this.serach = { ...this.serach, pageSize, pageNum };
			this.all.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/msgadmin/manageTemplate/search',
				data: this.serach,
			});
			if (res && res.code === 200 && res.data) {
				let { list, total } = res.data;
				this.all.pagination.total = total;
				this.all.data = this.all.data.concat(list);
			}
			this.all.loading = false;
		},
		msgTypeData(val) {
			let text = '';
			this.listType.forEach(e => {
				if (val * 1 === e.dicValue * 1) {
					text = e.dicName;
				}
			});
			return text;
		},
		// 分页触发事件
		handleChangePage(val) {
			this.all.pagination.currentPage = val;
			this.loadData();
		},
		// 分页下拉触发事件
		handleSizeChange(val) {
			this.all.pagination.pageSize = val;
			this.loadData();
		},
		async getMsgType() {
			const res = await this.$fetch(`/mgmt/msgadmin/msgType/second`);
			let { data, code } = res;
			if (code === 200) {
				this.listType = data;
				this.config.form.forEach(e => {
					if (e.key === 'msgType') {
						data.forEach(el => {
							e.options.push({ value: el.dicValue, label: el.dicName });
						});
					}
				});
			}
		},
		// 查询事件
		handleSearch() {
			this.all.pagination.currentPage = 1;
			this.all.data = [];
			this.loadData();
		},
		confirm(type, callbck) {
			this.$confirm('确定' + type + '?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				callbck && callbck();
			});
		},
		add() {
			this.$go('add_edit_message_template');
		},
		status({ id, status, templateName }) {
			let title = status ? '停用：' + templateName : '启用：' + templateName;
			this.confirm(title, async () => {
				const res = await this.$fetch(`mgmt/msgadmin/manageTemplate/update/${id}/${status ? 0 : 1}`);
				if (res.code === 200) {
					this.$message.success(res.message);
					this.handleSearch();
				}
			});
		},
		// 详情
		async detail({ id }) {
			this.$go('message_template_detail', { title: '消息模板详情', id });
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
::v-deep.pagination {
	margin-top: 20px;
	text-align: right;
}
</style>
