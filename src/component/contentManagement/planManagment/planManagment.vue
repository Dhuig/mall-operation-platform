<template>
	<div class="charging-list">
		<guideBar>
			<el-button
				v-permission="'plan_management_add'"
				class="top-btn"
				icon="el-icon-circle-plus-outline"
				type="primary"
				@click="add"
			>
				新增计划
			</el-button>
    </guideBar>
		<el-card>
			<tableList
        :options="options"
				:dataSource="dataSource"
				:columns="PLAN_COLUMNS"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button
						v-permission="'plan_management_detail'"
						type="text"
						@click="edit(scope.data)"
					>
						编辑
					</el-button>
          <span v-if="scope.data.status===0"  class="btn">
            <el-button type="text" v-permission="'plan_management_stop'" @click="stop(scope.data)">禁用</el-button>
          </span>
          <span v-else  class="btn">
            <el-button type="text" v-permission="'plan_management_start'" @click="start(scope.data)">启用</el-button>
          </span>
				</template>
			</tableList>
		</el-card>
    <el-dialog :title="title" :visible.sync="dialogVisible" :before-close="beforeClose" width="35%">
       <el-form :model="form" label-suffix=": " :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="计划名称" prop="planName">
            <el-input type="text" maxlength="20" show-word-limit  v-model="form.planName" placeholder="请输入计划名称" />
          </el-form-item>
       </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="beforeClose">取 消</el-button>
				<el-button type="primary" @click="save">确 定</el-button>
			</span>
    </el-dialog>
	</div>
</template>

<script>
import { PLAN_COLUMNS } from './config';
import qs from 'querystring'
export default {
	name: 'planManagment',
	data() {
		return {
      title:'新增计划',
      dataSource:[],
      PLAN_COLUMNS,
      options:{
        index:true,
        labelIndex:'序号',
      },
      rules:{
				planName: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
      },
      form:{
        planName:''
      },
			dialogVisible: false,
      formId:null
		};
	},
	created() {
    this.loadData()
	},
	methods: {
		confirmHandle(text, callback) {
			this.$confirm(`${text}?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				callback && callback();
			});
		},
    async banPlan({status,planName}){
      const res = await this.$fetch({
        method: 'GET',
        url: `/member/tool/banPlan`,
        params: {planName,status:status==1?0:1},
      });
      if (res && res.code===200) {
        this.loadData()
        this.$dispatch('ADD_INTEGRAL_PANLIST')
        this.$dispatch('INTEGRAL_MANAGEMENT')
        this.$message.success(res.message)
      }
    },
		stop(row) {
      this.confirmHandle('确定禁用',() => {
        this.banPlan(row)
      });
		},
    start(row){
      this.confirmHandle('确定启用',() => {
        this.banPlan(row)
      });
    },
    add(){
      this.title = '新增计划';
      this.dialogVisible = true
      this.form.id = ''
    },
    save(){
      this.$refs.ruleForm.validate(async (valid) => {
        if(valid){
          const res = await this.$fetch(`/member/tool/${this.form.id?'updatePlan':'addPlan'}?${qs.stringify(this.form)}`);
          if (res && res.code===200) {
            this.beforeClose()
            this.$message.success(res.message)
            this.loadData()
            this.$dispatch('ADD_INTEGRAL_PANLIST')
            this.$dispatch('INTEGRAL_MANAGEMENT')
          }
        }
      })
    },
    beforeClose(){
      this.form.planName = ''
      this.dialogVisible = false
    },
		// 温馨提示！：改造load的代码上下文按如下格式最佳，避免出现不必要的错误
		async loadData() {
			const res = await this.$fetch(`/member/tool/queryPlanList`);
			if (res && res.code===200) {
        this.dataSource = res.data
			}
		},
		// 详情
		async edit({ planName,id }) {
      this.title = '编辑计划';
      this.form.planName= planName;
      this.form.id= id;
      this.dialogVisible = true;
		},
	},
};
</script>
<style lang="scss" scoped>
@import '@/assets/css/elementUi.scss';
.btn {
	margin-left: 10px;
}
</style>
