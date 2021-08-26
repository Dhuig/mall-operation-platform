<template>
  <div class="audit-result">
    <el-card>
      <h4 class="title">审核结果</h4>
      <el-form :model="auditFactoryOrderVo" label-suffix=':'>
        <el-form-item label='审核处理'>
          <el-radio-group v-model="auditFactoryOrderVo.orderStatus">
            <el-radio :label="1">同意处理</el-radio>
            <el-radio :label="2">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label='说明'>
          <el-input style="width:50%" v-model="auditFactoryOrderVo.auditRemark" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
	name: 'auditResult',
	data() {
		return {
			auditFactoryOrderVo: {
				orderStatus: 1,
				auditRemark: '',
			},
		};
	},
};
</script>

<style lang="scss" scoped>
.audit-result {
	.title {
		font-size: 18px;
		font-weight: 500;
		padding-bottom: 20px;
	}
}
</style>