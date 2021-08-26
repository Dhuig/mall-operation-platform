<template>
	<div>
		<guideBar />
		<el-card>
			<tableList
				:options="setOptions"
				:loading="loading"
				:dataSource="data"
				:columns="DOWNLOAD_COLUMNS"
				:pagination="pagination"
				:dataTotal="total"
				@handleSizeChange="handleSizeChange"
				@handleChangePage="handleChangePage"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button type="text" v-if="scope.data.status === 2" @click.stop="download(scope.data)">下载</el-button>
					<el-button
						type="text"
						v-if="scope.data.status === 5 || scope.data.status === 3"
						@click.stop="reset(scope.data)"
					>
						重试
					</el-button>
					<el-button
						type="text"
						v-if="scope.data.status === 2 || scope.data.status === 3 || scope.data.status === 5"
						@click.stop="remove(scope.data)"
					>
						删除
					</el-button>
					<el-button type="text" v-if="scope.data.status === 0" @click.stop="cancel(scope.data)">取消</el-button>
				</template>
			</tableList>
		</el-card>
		<el-dialog title="下载" v-drag :visible.sync="isVisible" width="30%">
			<div class="import-class">
				<tableList :dataSource="selectData" :columns="SELECT_DOWNLOAD_COLUMNS" slotcontent>
					<template slot-scope="scope">
						<el-button type="text" @click.stop="selectDownload(scope.data)">下载</el-button>
					</template>
				</tableList>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="isVisible = false">取 消</el-button>
				<el-button type="primary" @click="isVisible = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { DOWNLOAD_COLUMNS } from './config.js';
export default {
	name: 'downloadMange',
	data() {
		return {
			setOptions: {
				index: true,
				labelIndex: '序号',
			},
			loading: false,
			isVisible: false,
			data: [],
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			total: 0,
			DOWNLOAD_COLUMNS,
			selectData: [],
			SELECT_DOWNLOAD_COLUMNS: [{ label: '文件名', prop: 'filename', align: 'center' }],
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		handleSizeChange(val) {
			this.pagination.pageSize = val;
			this.loadData();
		},
		handleChangePage(val) {
			this.pagination.currentPage = val;
			this.loadData();
		},
		async loadData() {
			this.loading = true;
			let { currentPage: pageNum, pageSize } = this.pagination;
			let res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/download/recordeList',
				data: { pageNum, pageSize, userId: this.$store.state.user.userInfo.userId },
			});
			if (res && res.code == 200) {
				this.data = res.data.list;
				this.total = res.data.total;
			}
			this.loading = false;
		},
		beforeClose() {
			this.isVisible = false;
		},
		selectDownload({ ossUrl }) {
			if (!ossUrl) return this.$message.warning('暂无资源下载');
			window.open(ossUrl);
		},
		download({ fileList }) {
			if (fileList.length === 0) return this.$message.warning('暂无资源下载');
			if (fileList.length === 1) {
				if (!fileList[0].ossUrl) return this.$message.warning('暂无资源下载');
				window.open(fileList[0].ossUrl);
			} else {
				this.selectData = fileList;
				this.isVisible = true;
			}
		},
		async reset({ recordId }) {
			let res = await this.$fetch({ method: 'POST', url: `/mgmt/download/retry?recordId=${recordId}` });
			if (res && res.code == 200) {
				this.loadData();
				this.$message.success(res.message);
			}
		},
		async remove({ recordId }) {
			this.$confirm(`确定删除?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					let res = await this.$fetch({ method: 'POST', url: `/mgmt/download/delete?recordId=${recordId}` });
					if (res && res.code == 200) {
						this.loadData();
						this.$message.success(res.message);
					}
				})
				.catch(() => {});
		},
		async cancel({ recordId }) {
			let res = await this.$fetch({ method: 'POST', url: `/mgmt/download/cancel?recordId=${recordId}` });
			if (res && res.code == 200) {
				this.loadData();
				this.$message.success(res.message);
			}
		},
	},
};
</script>
