<template>
	<div>
		<guideBar />
		<el-card>
			<searchPanel v-model="searchConfig" :config="MATERIAL_DOWNLOAD_SEARCH" @search="search" />
		</el-card>
		<el-card>
			<el-row type="flex" class="marginB20">
				<el-col :span="8">
					<div>素材编号: {{ resultDate.materialNo }}</div>
				</el-col>
				<el-col :span="8">
					<div>
						素材名称:
						<span class="clickActive" @click="$go('material_Details', { type: 'details', id: resultDate.id })">
							{{ resultDate.name }}
						</span>
					</div>
				</el-col>
				<el-col :span="8">
					<div>格式: {{ resultDate.cmsTypeLabelName }}</div>
				</el-col>
			</el-row>
		</el-card>
		<el-card>
			<tableList
				:columns="MATERIAL_DOWNLOAD_COLUMNS"
				:pagination="tabPanes.pagination"
				:dataTotal="tabPanes.total"
				:loading="tabPanes.loading"
				:dataSource="tabPanes.data"
				:height="400"
				@loadMore="loadMore"
			/>
		</el-card>
	</div>
</template>
<script>
import { TABITEM, MATERIAL_DOWNLOAD_SEARCH, MATERIAL_DOWNLOAD_COLUMNS } from './config';
import { timeStartFormat, timeEndFormat } from 'util';
export default {
	name: 'materialDownload',
	data() {
		return {
			MATERIAL_DOWNLOAD_SEARCH,
			MATERIAL_DOWNLOAD_COLUMNS,
			tabPanes: new TABITEM(),
			searchConfig: {
				channel: '',
				download: '',
				applyTime: [],
			},
			resultDate: {
				id: null,
				materialNo: '',
				name: '',
				cmsTypeLabelName: '',
			},
		};
	},
	computed: {
		// 搜索参数
		searchFields() {
			const {
				searchConfig,
				searchConfig: { applyTime = ['', ''] },
				$route: {
					query: { id },
				},
			} = this;
			const { pagination } = this.tabPanes;
			const params = {
				...searchConfig,
				...pagination,
				cmsMaterialId: id,
				startTime: timeStartFormat(applyTime[0]) || '',
				endTime: timeEndFormat(applyTime[1]) || '',
			};
			delete params.applyTime;
			return params;
		},
	},
	methods: {
		search() {
			this.tabPanes.pagination.pageNum = 1;
			this.tabPanes.data = [];
			this.$nextTick(this.loadData);
		},
		// 下拉加载
		loadMore() {
			const { pageNum, pageSize } = this.tabPanes.pagination;
			const { tabTotal } = this.tabPanes;
			if (pageNum * pageSize >= tabTotal) return this.$message.warning('没有更多数据');
			this.tabPanes.pagination.pageNum++;
			this.loadData();
		},
		// 获取素材下载管理
		async loadData() {
			const { tabPanes, searchFields } = this;
			tabPanes.loading = true;

			Object.keys(searchFields).map(i => {
				if (!searchFields[i]) {
					delete searchFields[i];
				}
			});

			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/cms/material/queryCmsMaterialDownloadList`,
				timeout: 60000 * 1,
				data: { ...searchFields },
			});
			if (res?.code == 200) {
				const { list, total } = res.data;
				this.resultDate = { ...list[0] };
				let result = list.filter(x => x.createTime && x.channel && x.download);
				this.tabPanes.data = tabPanes.data.concat(result);
				console.log(total);
				this.tabPanes.tabTotal = total;
			}
			tabPanes.loading = false;
		},
	},
	async mounted() {
		await this.loadData();
	},
};
</script>
<style lang="scss" scoped>
.marginB20 {
	margin-bottom: 20px;
	text-align: center;
}
.clickActive {
	cursor: pointer;
	color: #c70032;
	text-decoration: underline;
}
</style>