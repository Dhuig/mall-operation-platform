<template>
	<div>
		<guideBar>
			<el-button v-permission="'service_centre_allocation_batch_import'" type="primary" @click="batchImport">
				批量导入
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="SERVICE_CENTRE_ALLOCATION_SEARCH" @search="resetLoad" />
		</el-card>
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="data"
				:columns="SERVICE_CENTRE_ALLOCATION_COLUMNS"
				:pagination="pagination"
				:dataTotal="total"
				@loadMore="loadMore"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button v-permission="'service_centre_allocation_detail'" type="text" @click="videDetail(scope.data)">
						详情
					</el-button>
				</template>
			</tableList>
		</el-card>
		<el-dialog title="批量导入产品" :visible.sync="pullDialog" width="30%" @closed="dialogClose" v-drag>
			<template>
				<ul class="process">
					<li>
						<p>(1)下载Excel模板</p>
						<el-button type="primary" class="btn" @click="downExcel">点我下载</el-button>
					</li>
					<li>
						<p>(2)按要求填写Excel模板并上传</p>
						<el-upload
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							:show-file-list="false"
							:on-success="uploadSuccess"
						>
							<el-button type="primary" class="btn" :loading="exportLoading">点我上传</el-button>
						</el-upload>
					</li>
					<li>
						<p>(3)导入结果：成功：{{ exportFail.succNum || 0 }}条；失败{{ exportFail.failNum || 0 }}条</p>
						<el-button type="primary" class="btn" @click="downLoadFail" :disabled="!exportFail.failNum > 0">
							导出失败记录
						</el-button>
					</li>
				</ul>
			</template>
			<div slot="footer">
				<el-button @click="pullDialog = false">取 消</el-button>
				<el-button type="primary" @click="pullDialog = false">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { SERVICE_CENTRE_ALLOCATION_SEARCH, SERVICE_CENTRE_ALLOCATION_COLUMNS } from './config';
import { exportExcel } from 'util';
import qs from 'querystring';

export default {
	name: 'serviceCentreAllocation',
	data() {
		return {
			//上传按钮loading
			exportLoading: false,
			//导入失败
			exportFail: {},
			//批量导入dialog
			exportDialog: false,
			pullDialog: false,
			SERVICE_CENTRE_ALLOCATION_SEARCH,
			SERVICE_CENTRE_ALLOCATION_COLUMNS,
			searchConfig: {},
			loading: false,
			data: [],
			pagination: {
				currentPage: 1,
				pageSize: 20,
			},
			total: 0,
		};
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.stock,
			};
			return params;
		},
	},
	methods: {
		// 下拉刷新
		loadMore() {
			let { currentPage, pageSize } = this.pagination;
			if (currentPage * pageSize >= this.total) {
				return this.$message.warning('没有更多数据');
			}
			this.pagination.currentPage++;
			this.loadData();
		},
		//dialog关闭
		dialogClose() {
			this.exportFail = {};
		},
		//批量导入产品（点击下载）
		downExcel() {
			// window.open('http://106.55.0.36:7480/perfect-default/服务中心分配量导入模板.xlsx');
			exportExcel('/mgmt/product/quota/getDistImportTemplate');
		},
		//上传excel获取oss地址
		async uploadSuccess(response) {
			this.exportLoading = true;
			let data = {
				url: response.datas.fileUrlKey,
			};
			let fail = {
				failNum: 0,
				succNum: 0,
				failUrl: '',
			};
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/product/quota/batchImport?url=${data.url}`,
				data: {},
			});
			if (res && res.code == 200) {
				fail = res.data;
				this.exportFail = fail;
				this.resetLoad();
			}
			this.exportLoading = false;
		},
		downLoadFail() {
			if (this.exportFail && this.exportFail.failNum !== 0) {
				window.open(this.exportFail.failUrl);
			}
		},
		// 批量导出
		batchImport() {
			this.pullDialog = true;
		},
		// 分页触发事件
		handleChangePage(currentPage) {
			this.pagination.currentPage = currentPage;
			this.loadData();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.loadData();
		},
		// 重置刷新
		resetLoad() {
			this.pagination.currentPage = 1;
			this.data = [];
			this.loadData();
		},
		// 查看分配量详情
		videDetail({ code, name, leaderName, leaderCardNo }) {
			if (!code) return this.$message('服务中心编号缺失或无效, 无法查询该服务中心分配量详情');
			this.$go('service_centre_allocation_detail', {
				code,
				name,
				leaderName,
				leaderCardNo,
				title: '服务中心分配详情',
			});
		},
		// 获取服务中心列表
		async loadData() {
			this.loading = true;
			const {
				searchConfig,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			const params = {
				pageNum,
				pageSize,
				...searchConfig,
			};
			const res = await this.$fetch(`mgmt/product/quota/listDistribution?${qs.stringify(params)}`);
			if (res && res.data) {
				const { list, total } = res.data;
				if (!list.length) {
					this.$message.warning('搜索无数据，请检查查询条件');
				}
				this.data = this.data.concat(list);
				this.total = total;
			} else {
				this.data = [];
				this.total = 0;
				this.$message.warning('搜索无数据，请检查查询条件');
			}

			this.loading = false;
		},
	},
	mounted() {
		this.$nextTick(this.resetLoad);
	},
};
</script>
<style lang="scss" scoped>
.process {
	width: 80%;
	margin: 0 auto;
	li {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px;
		.btn {
			width: 120px;
		}
	}
}
</style>
