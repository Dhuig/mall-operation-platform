<template>
	<div class="charging-list">
		<guideBar></guideBar>
		<el-card>
			<searchPanel
				ref="searchPanel"
				v-model="serachData"
				:config="INTEGRAL_DETAIL_CONFIG"
				@search="handleSearch"
			/>
    </el-card>
		<el-card>
			<tableList
        :options="options"
				:dataSource="tabPaneObj.data"
				:columns="INTEGRAL_DETAIL_LIST_COLUMNS"
				:pagination="tabPaneObj.pagination"
				:dataTotal="tabPaneObj.pagination.total"
				:loading="tabPaneObj.loading"
				slotcontent
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
			>
        <template slot="content_context">
          任务名称：{{queryData.taskName}}
				</template>
				<template slot-scope="scope">
					<el-button
						v-permission="'INTEGRAL_detail_btn'"
						type="text"
						@click="detail(scope.data)"
					>
						查看积分详情
					</el-button>
				</template>
				<template v-slot:taskExplain="{ row }">
          <div v-for="(item,index) in row.taskExplain" :key="index">{{item}}</div>
				</template>
			</tableList>
		</el-card>
    <el-dialog title="积分详情" :visible.sync="dialogVisible" :before-close="beforeClose" width="50%">
			<tableList	:dataSource="taskList" :columns="TASK_COLUMNS"></tableList>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</span>
    </el-dialog>
	</div>
</template>

<script>
import {   INTEGRAL_DETAIL_LIST_COLUMNS,INTEGRAL_DETAIL_CONFIG,TASK_COLUMNS } from './config';
export default {
	name: 'IntegralDetail',
	data() {
		return {
      TASK_COLUMNS,
      queryData:{},
      serachData:{
        cardNo:""
      },
      options:{
        index:true,
        labelIndex:'序号',
        operatesWidth:120
      },
      taskList:[],
      INTEGRAL_DETAIL_CONFIG,
			dialogVisible: false,
			INTEGRAL_DETAIL_LIST_COLUMNS,
			tabPaneObj:{
        loading: false,
        data: [], 
        pagination: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
        },
      },
		};
	},
	created() {
    this.loadData()
    this.queryData = this.$route.query
	},
  watch:{
    'queryData.taskBInfo'(val){
				this.INTEGRAL_DETAIL_LIST_COLUMNS[3]['isShow'] = () => val == '有';
    },
  },
	methods: {
    beforeClose(){
      this.dialogVisible = false
    },
    handleSearch(){
			this.tabPaneObj.pagination.currentPage = 1;
      this.loadData()
    },
		// 翻页操作
		handleChangePage(page) {
			this.tabPaneObj.pagination.currentPage = page;
			this.loadData();
		},
		// 切换页面条数
		handleSizeChange(pageSize) {
			this.tabPaneObj.pagination.pageSize = pageSize;
			this.loadData();
		},
		// 温馨提示！：改造load的代码上下文按如下格式最佳，避免出现不必要的错误
		async loadData() {
			const { currentPage: pageNum, pageSize } = this.tabPaneObj.pagination;
			this.tabPaneObj.loading = true;
			let params = { pageNum, pageSize,cardNo:this.serachData.cardNo||'',taskId:this.$route.query.id};
			const res = await this.$fetch({
				method: 'GET',
				url: `/member/tool/queryTaskInfoList`,
				params: params,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.tabPaneObj.pagination.total = total || 0;
				this.tabPaneObj.data = list;
			}
			this.tabPaneObj.loading = false;
		},
		// 详情
		async detail({ cardNo }) {
			const res = await this.$fetch({
				method: 'GET',
				url: `/member/tool/queryPVInfoList`,
				params: {taskName:this.queryData.taskName,cardNo},
			});
			if (res && res.code===200) {
        this.taskList = res.data || []
        this.dialogVisible = true
			}
		},
	},
};
</script>
<style lang="scss" scoped>
@import '@/assets/css/elementUi.scss';
</style>
