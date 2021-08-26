<template>
	<div class="store-manage-list">
		<guideBar>
			<el-button v-permission="'store_manage_export_excel_add'" type="primary" @click="add">添加中转仓</el-button>
			<el-button v-permission="'store_manage_export_excel'" type="primary" @click="handleExport">导出Excel</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="STOREMANAGE_LIST_CONFIG" @search="getList" />
		</el-card>
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="dataSource"
				:columns="STOREMANAGE_LIST_COLUMNS"
				:options="options"
				slotcontent
			>
				<template slot-scope="row">
					<el-button
						v-if="row.data.businessRange !== 3"
						v-permission="'store_manage_detail|distribution_area'"
						type="text"
						@click="handleDetail(row.data)"
					>
						查看
					</el-button>
					<span v-else>
						<el-button
							v-permission="'store_manage_detail_b|distribution_area'"
							type="text"
							@click="handleDetail(row.data, 1)"
						>
							B区域
						</el-button>
						<el-button
							v-permission="'store_manage_detail_c|distribution_area'"
							type="text"
							@click="handleDetail(row.data, 2)"
						>
							C区域
						</el-button>
					</span>
				</template>
			</tableList>
		</el-card>
		<!-- 新增/编辑 -->
		<el-dialog title="添加中转仓" :visible.sync="show" width="700px" v-drag :before-close="cacel">
			<!-- width="700px" -->
			<el-form
				:model="ruleForm"
				:rules="rules"
				ref="ruleForm"
				label-width="200px"
				class="demo-ruleForm"
				label-suffix=":"
			>
				<div class="flex">
					<el-form-item label="仓库编码" prop="depotCode">
						<el-input type="text" size="medium" v-model="ruleForm.depotCode" placeholder="请输入仓库编码"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="仓库名称" prop="depotName">
						<el-input type="text" size="medium" v-model="ruleForm.depotName" placeholder="请输入仓库名称"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="类型" prop="type">
						<el-select size="medium" v-model="ruleForm.type" placeholder="请选择类型">
							<el-option label="成品仓" value="1" />
							<el-option label="中转仓" value="2" />
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="业务范围" prop="businessRange">
						<el-select size="medium" v-model="ruleForm.businessRange" placeholder="请选择类型">
							<el-option label="B" :value="1" />
							<el-option label="C" :value="2" />
							<el-option label="B+C" :value="3" />
						</el-select>
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="save('ruleForm')" class="save">保存</el-button>
				<el-button @click="cacel('ruleForm')" class="cacel">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { exportExcel } from 'util';
import { STOREMANAGE_LIST_CONFIG, STOREMANAGE_LIST_COLUMNS } from './config';
import cityData from 'config/city';
import qs from 'querystring';

export default {
	name: 'storeManageList',
	data() {
		return {
			rules: {
				depotCode: [{ required: true, message: '请输入仓库编码', trigger: 'blur' }],
				depotName: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
				type: [{ required: true, message: '请选择类型', trigger: 'change' }],
				businessRange: [{ required: true, message: '请选择业务范围', trigger: 'change' }],
			},
			show: false,
			ruleForm: {
				businessRange: '',
				depotCode: '',
				depotName: '',
				type: '',
			},
			certificateTypeOptions: [],
			organizationOptions: [],
			loading: false,
			searchConfig: {
				businessRange: '',
				depotCode: '',
			},
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			STOREMANAGE_LIST_CONFIG,
			STOREMANAGE_LIST_COLUMNS,
			dataSource: [],
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			regionOptions: [], // 存储业务范围
		};
	},
	methods: {
		async save() {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/sys/depot/save`,
				data: this.ruleForm,
			});
			if (res && res.code === 200) {
				this.$refs.ruleForm.resetFields();
				this.show = false;
				this.getList();
				this.$message.success(res.message);
			}
		},
		cacel() {
			this.$refs.ruleForm.resetFields();
			this.show = false;
		},
		add() {
			this.show = true;
		},
		// 导出
		handleExport() {
			exportExcel('/mgmt/sys/depot/export', this.searchConfig);
		},
		// 查看
		handleDetail({ id, businessRange }, type) {
			if (type == 1)
				return this.$go('distribution_area', { id, businessRange: 1, title: '查看配送区域', key: 'detail' });
			if (type == 2)
				return this.$go('distribution_area', { id, businessRange: 2, title: '查看配送区域', key: 'detail' });
			this.$go('distribution_area', { id, businessRange, title: '查看配送区域', key: 'detail' });
		},
		// 编辑
		handleEdit(row) {
			this.$go('distribution_area', {
				id: row.id,
				title: '编辑配送区域',
				key: 'edit',
				// codeArr,
			});
		},
		// 初始化
		init() {
			this.regionOptions = cityData.map(item => {
				return {
					label: item.n,
					value: item.c,
				};
			});
			STOREMANAGE_LIST_CONFIG.form[1].options = this.regionOptions;
		},
		// 请求数据
		async getList() {
			this.loading = true;
			const res = await this.$fetch(`/mgmt/sys/depot/list?${qs.stringify(this.searchConfig)}`);
			if (res && res.code === 200) {
				this.dataSource = res.data;
			} else {
				this.dataSource = [];
			}
			this.loading = false;
		},
	},
	created() {
		this.getList();
		this.$listen('UP_LIST', this.getList);
	},
};
</script>
<style lang="scss" scoped>
.flex {
	width: 417px;
}
</style>
