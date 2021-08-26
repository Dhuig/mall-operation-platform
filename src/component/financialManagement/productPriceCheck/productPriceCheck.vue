<template>
	<div>
		<guideBar />
		<el-card class="box-card">
			<h5 class="part-title">产品价格审核</h5>
			<el-form ref="auditForm" :model="auditForm" :rules="AUDIT_RULES" label-width="120px" class="form-box">
				<el-form-item label="审核操作:" prop="auditResult">
					<el-select placeholder="选择审核操作" v-model="auditForm.auditResult" size="small">
						<el-option :label="item.label" :value="item.value" v-for="(item, index) in AUDIT_RESULT" :key="index" />
					</el-select>
				</el-form-item>
				<el-form-item label="备注说明:" prop="remarks">
					<el-input
						type="textarea"
						maxlength="200"
						show-word-limit
						:rows="4"
						v-model="auditForm.remarks"
						placeholder="请填写备注说明"
					/>
				</el-form-item>
				<el-row type="flex" justify="center" align="center">
					<el-button type="primary" @click="saveAndExit('auditForm')">确认</el-button>
					<el-button @click="cancelEdit">取消</el-button>
				</el-row>
			</el-form>
		</el-card>
		<el-card class="box-card">
			<div class="part-title-box">
				<h5 class="part-title">审核日志</h5>
				<div class="logs-list-switch" @click="logsListSwitch">{{ logsListShow ? '收起' : '展开' }}</div>
			</div>
			<div v-show="logsListShow">
				<div class="part-content">
					<searchPanel
						v-model="searchConfig"
						:config="CHECK_SEARCH"
						@search="handleSearch"
						@reset="handleReset"
						class="row-gap"
					/>
					<tableList
						border
						:loading="log.loading"
						:dataSource="log.data"
						:columns="CHECK_COLUMNS"
						:dataTotal="log.data.length"
					/>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
import { CHECK_SEARCH, CHECK_COLUMNS, AUDIT_RULES } from './config';
import { optionGenerator } from 'util';
export default {
	name: 'productPriceCheck',
	data() {
		return {
			versionId: '',
			searchConfig: {},
			auditForm: {},
			AUDIT_RULES,
			CHECK_SEARCH,
			CHECK_COLUMNS,
			AUDIT_RESULT: [],
			log: {
				loading: false,
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
			},
			logsListShow: true,
		};
	},
	created() {
		const { id } = this.$route.query;
		this.versionId = id;
	},
	methods: {
		handleSearch() {
			this.loadLogs();
		},
		handleReset() {},
		saveAndExit(formname) {
			this.$refs[formname].validate(async (valid) => {
				if (valid) {
					const { versionId, auditForm } = this;
					const data = {
						auditResult: auditForm.auditResult || null,
						remarks: auditForm.remarks || '',
						versionId,
					};
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/product/ctrl/finaAudit`,
						data,
					});
					if (res && res.data) {
						this.$dispatch('PRICE_LIST_UPDATE');
						this.$closeSelf();
					} else {
						this.$message({
							message: '操作失败',
							type: 'error',
						});
					}
				}
			});
		},
		cancelEdit() {
			this.$closeSelf();
		},
		logsListSwitch() {
			this.logsListShow = !this.logsListShow;
		},
		// 获取字典映射
		async getDicts() {
			const [AUDIT_RESULT] = await Promise.all([this.$getDict('AUDIT_RESULT')]);
			AUDIT_RESULT && (this.AUDIT_RESULT = optionGenerator(AUDIT_RESULT));
		},
		// 获取日志
		async loadLogs() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/product/ctrl/listAuditLog`,
				data: this.loadDataPost,
			});
			if (res && res.data) {
				let { list } = res.data;
				this.log.data = list;
			}
		},
	},
	computed: {
		loadDataPost() {
			let { searchConfig, versionId, log } = this;
			let data = {
				auditTypeResult: searchConfig.auditTypeResult || 0,
				endTime: (searchConfig.daterange && searchConfig.daterange[1]) || null,
				startTime: (searchConfig.daterange && searchConfig.daterange[0]) || null,
				operator: searchConfig.operator || '',
				versionId: versionId,
				pageNum: log.pagination.currentPage || 1,
				pageSize: log.pagination.pageSize || 10,
			};
			return data;
		},
	},
	mounted() {
		this.getDicts();
		this.loadLogs();
	},
};
</script>
<style lang="scss" scoped>
.part-title {
	color: $color-title;
	font-size: 20px;
}
.box-card {
	margin-bottom: 16px;
}
.form-box {
	margin-top: 8px;
}
.part-title-box {
	display: flex;
	justify-content: space-between;
	.logs-list-switch {
		color: #797979;
		cursor: pointer;
	}
}
.part-content {
	margin-top: 22px;
}
.table_list_fix {
	margin-top: 16px;
}
</style>
