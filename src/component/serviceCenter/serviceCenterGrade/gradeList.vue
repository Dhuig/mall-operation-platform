<template>
	<div class="gradeList">
		<guideBar>
			<el-button v-permission="'service_grade_list_batch_change_grade'" type="primary" @click="batchChange">
				批量调整等级
			</el-button>
			<el-button v-permission="'service_grade_list_export_excel'" type="primary" @click="exportExcel">
				导出EXCEL
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="SERVICE_CENTER_GRADE_CONFIG" showExpand @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				border
				:loading="loading"
				:dataSource="dataSource"
				:columns="SERVICE_CENTER_GRADE_COLUMS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="{ index: true, labelIndex: '序号' }"
				:height="500"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button type="text" v-permission="'service_grade_list_edit_grade'" @click="toEdit(scope.data)">
						修改
					</el-button>
					<el-button type="text" v-permission="'service_grade_list_delete_grade'" @click="delOne(scope.data)">
						删除
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 修改 -->
		<el-dialog v-drag title="修改信息" width="500px" class="edit-modal" :visible.sync="editModalVisible">
			<el-form :model="editForm" ref="editForm" :rules="EDIT_FORM_RULES" label-width="110px" label-suffix=":">
				<el-form-item label="服务中心星级" prop="level">
					<el-select v-model="editForm.level" clearable>
						<el-option
							v-for="(item, index) in GRADE_OPTIONS"
							:key="index"
							:label="item"
							:value="Number(index)"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="取消类型" prop="cancelType">
					<el-select v-model="editForm.cancelType" clearable>
						<el-option
							v-for="(item, index) in CANCEL_TYPE_DATA"
							:key="index"
							:label="item"
							:value="Number(index)"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="取消日期" prop="cancelTime">
					<el-date-picker
						v-model="editForm.cancelTime"
						type="date"
						value-format="timestamp"
						placeholder="选择日期"
					></el-date-picker>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="center">
				<el-button @click="editCancel('editForm')">取消</el-button>
				<el-button type="primary" @click="editSave('editForm')">确认</el-button>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import {
	SERVICE_CENTER_GRADE_CONFIG,
	SERVICE_CENTER_GRADE_COLUMS,
	ACCOUNTLIST,
	GRADE_OPTIONS,
	EDIT_FORM_RULES,
	CANCEL_TYPE_DATA,
} from './config.js';
import { exportExcel } from 'util';
import qs from 'querystring';
import { formatDateDefault } from 'util/formValidation.js';

export default {
	name: 'gradeList',
	data() {
		return {
			SERVICE_CENTER_GRADE_COLUMS,
			SERVICE_CENTER_GRADE_CONFIG,
			ACCOUNTLIST,
			GRADE_OPTIONS,
			CANCEL_TYPE_DATA,
			EDIT_FORM_RULES,
			searchConfig: {},
			pagination: {
				currentPage: 1,
				pageSize: 20,
			},
			dataTotal: 0,
			dataSource: [],
			loading: false,
			editModalVisible: false, //修改弹窗显示状态
			editForm: {}, //修改弹窗form
		};
	},
	computed: {
		loadDataPost() {
			const {
				searchConfig,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			let data = {
				...searchConfig,
				pageNum,
				pageSize,
			};
			if (data.year && typeof data.year == 'number') {
				data.year = formatDateDefault(data.year).substr(0, 4);
			} else {
				data.year = null;
			}
			if (data.level) {
				data.level = data.level.join();
			}
			return data;
		},
	},
	methods: {
		// 批量调整等级
		batchChange() {
			this.$go('service_grade_import');
		},
		// 导出EXCEL
		exportExcel() {
			exportExcel('/mgmt/store/exportStoreLevel', this.loadDataPost);
		},
		// 翻页
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
		},
		// 分页触发事件
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 分页下拉触发事件
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 删除
		delOne(row) {
			this.$confirm('确认删除该记录？', '删除记录')
				.then(async () => {
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/store/delStoreLevel',
						data: { id: row.id },
					});
					if (res && res.code == 200) {
						this.$message.success('操作成功');
						this.loadData();
					} else {
						this.$message.error('操作失败');
					}
				})
				.catch(() => {});
		},
		// 修改
		toEdit(row) {
			this.editModalVisible = true;
			this.$nextTick(() => {
				const { id, level, cancelType, cancelTime } = row;
				this.editForm = {
					id,
					level,
					cancelType,
					cancelTime,
				};
			});
		},
		// 修改 取消
		editCancel(formName) {
			this.$refs[formName].resetFields();
			this.editModalVisible = false;
		},
		// 修改 确认
		editSave(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const params = { ...this.editForm };
					params.cancelTime = formatDateDefault(params.cancelTime);
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/store/editStoreLevel',
						data: params,
					});
					if (res && res.code === 200) {
						this.$message.success('操作成功');
						this.editCancel(formName);
						this.loadData();
					} else {
						this.$message.error((res && res.data.message) || '操作失败');
					}
				}
			});
		},
		// 初始化省份
		async initProvinces() {
			const res = await this.$fetch(`/mgmt/sys/getProvinceList`);
			if (res && res.data) {
				this.SERVICE_CENTER_GRADE_CONFIG.form[5].options = res.data.map(
					({ provinceName: label, provinceCode: value }) => ({ label, value })
				);
			} else {
				this.$message.warning('省份信息更新失败');
			}
		},
		// 网点类型列表
		async shopType() {
			this.$store.getters['system/getOptions'].shopTypeOptions.map(({ label, value }) => {
				this.ACCOUNTLIST[value] = label;
			});
		},
		// 请求数据
		async loadData() {
			this.loading = true;
			const res = await this.$fetch({
				url: `/mgmt/store/getStoreLevelList?${qs.stringify(this.loadDataPost)}`,
				callback: () => {
					this.loading = false;
				},
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.dataSource = list;
				this.dataTotal = total;
				if (total == 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.dataSource = [];
				this.total = 0;
				this.$message.error('获取列表数据失败');
			}
		},
	},
	mounted() {
		this.shopType();
		this.loadData();
		this.initProvinces();
	},
};
</script>
<style lang="scss" scoped>
::v-deep.edit-modal {
	.el-select,
	.el-date-editor {
		width: 100%;
	}
}
</style>
