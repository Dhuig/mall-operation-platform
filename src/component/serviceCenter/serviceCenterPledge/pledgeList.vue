<template>
	<div>
		<guideBar>
			<el-button v-permission="'service_pledge_list_add_quota'" type="primary" @click="handleAddDistribution">
				添加服务中心退货额
			</el-button>
			<el-button v-permission="'service_pledge_list_batch_import'" type="primary" @click="batchImport">
				批量导入
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="SERVICE_CENTER_PLEDGELIST_CONFIG" @search="loadData" />
		</el-card>
		<el-card>
			<tableList
				:dataSource="dataSource"
				:columns="SERVICE_CENTER_PLEDGELIST_COLUMS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="row">
					<el-button v-permission="'service_pledge_list_delete'" type="text" @click="toDelete(row.data, 'delete')">
						删除
					</el-button>
					<el-button v-permission="'service_pledge_list_edit'" type="text" @click="toEdit(row.data, 'edit')">
						修改
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 添加账户弹窗 -->
		<el-dialog
			:title="isEdit ? '修改押货退货额度' : '手工添加押货退货额度'"
			:visible.sync="showUpdatePledge"
			width="500px"
			v-drag
		>
			<el-form :rules="rules" ref="ruleForm" :model="ruleForm" label-width="130px" label-suffix=":" class="add-user">
				<el-form-item label="服务中心编号" prop="storeCode">
					<el-input v-model="ruleForm.storeCode" size="medium" :disabled="isEdit">
						<el-button
							slot="append"
							icon="el-icon-search"
							:disabled="isEdit"
							@click="getMainStoreInfo(ruleForm.storeCode)"
						></el-button>
					</el-input>
				</el-form-item>
				<el-form-item label="服务中心名称" prop="name">
					<span>{{ ruleForm.name }}</span>
				</el-form-item>
				<el-form-item label="负责人卡号" prop="leaderCardNo">
					<span>{{ ruleForm.leaderCardNo }}</span>
				</el-form-item>
				<el-form-item label="负责人姓名" prop="leaderName">
					<span>{{ ruleForm.leaderName }}</span>
				</el-form-item>
				<el-form-item label="最大押货退货额度" prop="returnMaxAmount">
					<el-input size="medium" v-model="ruleForm.returnMaxAmount">
						<span slot="prepend">￥</span>
					</el-input>
				</el-form-item>
				<el-form-item label="处理方式" prop="">
					<span>按月</span>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" v-model="ruleForm.remark" maxlength="100" show-word-limit></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm('ruleForm')" style="width: 100px; margin-right: 16px">
					添加
				</el-button>
				<el-button @click="submitCancel('ruleForm')" style="width: 100px">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {
	SERVICE_CENTER_PLEDGELIST_CONFIG,
	SERVICE_CENTER_PLEDGELIST_COLUMS,
	DOTTYPE,
	validReturnGoods,
} from './config.js';
import qs from 'querystring';

export default {
	name: 'pledgeList',
	data() {
		return {
			SERVICE_CENTER_PLEDGELIST_COLUMS,
			SERVICE_CENTER_PLEDGELIST_CONFIG,
			isEdit: false, //是否修改
			pagination: {
				currentPage: 1,
				pageSize: 20,
			},
			searchConfig: {
				companyCode: '',
				leaderCardNo: '',
				leaderName: '',
				name: '',
				storeCode: '',
			},
			dataTotal: 0,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			dataSource: [],
			loading: false,
			showUpdatePledge: false,
			rules: {
				storeCode: [{ required: true, message: '请输入服务中心编号', trigger: 'blur' }],
				returnMaxAmount: [{ validator: validReturnGoods, trigger: 'blur' }],
			},
			ruleForm: {
				processType: 1,
				remark: '',
				returnMaxAmount: null,
				storeCode: '',
				name: '',
				leaderNo: '',
				leaderName: '',
			},
		};
	},
	mounted() {
		this.loadShoptype();
		this.loadData();
	},
	computed: {
		// 搜索参数
		searchFields() {
			const { searchConfig } = this;
			return {
				...searchConfig,
			};
		},
	},
	methods: {
		// 添加服务中心退货额
		handleAddDistribution() {
			this.showUpdatePledge = true;
			this.isEdit = false;
			this.$nextTick(() => {
				this.ruleForm = {
					processType: 1,
					remark: '',
					returnMaxAmount: null,
					storeCode: '',
				};
			});
		},
		// 批量导入
		batchImport() {
			console.log('批量导入');
			this.$go('pledge_import');
		},
		// 分页触发事件
		handleChangePage(val) {
			this.pagination.currentPage = val;
			this.loadData();
		},
		// 分页下拉触发事件
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		// 删除
		toDelete(row) {
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.deleteReturnMortgageAmountMortgageOrder(row.id);
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		// 修改
		toEdit(row) {
			this.showUpdatePledge = true;
			this.isEdit = true;
			this.ruleForm = { ...row };
			this.ruleForm.name = row.storeName;
		},
		// 新增/修改 取消
		submitCancel(formName) {
			this.$refs[formName].resetFields();
			this.showUpdatePledge = false;
		},
		// 新增/修改 提交
		submitForm(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					this.showUpdatePledge = false;
					let params = this.ruleForm;
					this.addOrUpdateReturnMortgageAmountMortgageOrder(params);
					this.loadData(this.code);
				}
			});
		},
		// 获取网点类型
		async loadShoptype() {
			this.$store.getters['system/getOptions'].shopTypeOptions.map(({ label, value }) => {
				DOTTYPE[value] = label;
			});
		},
		// 根据产品编码查询产品
		async getMainStoreInfo(storeCode) {
			if (!storeCode) {
				this.$message.warning('请输入服务中心编号');
				return;
			}
			const res = await this.$fetch(`/mgmt/inventory/common/getStoreInfo?${qs.stringify({ storeCode })}`);
			if (res && res.data) {
				const { name, leaderName } = res.data;
				const leaderCardNo = res.data.shopkeeperId;
				this.ruleForm = { ...this.ruleForm, name, leaderCardNo, leaderName };
				this.verifyAmountExist(storeCode);
			} else {
				this.$message.warning(res.data.message || '获取服务中心信息失败');
			}
		},
		// 请求数据
		async loadData() {
			this.loading = true;
			const {
				pagination: { currentPage: pageNum, pageSize },
				searchFields,
			} = this;

			const params = {
				pageNum,
				pageSize,
				...searchFields,
			};
			const res = await this.$fetch(
				`/mgmt/inventory/mortgageAmount/listMortgageAmountMaxStoreReturn?${qs.stringify(params)}`
			);

			if (res && res.data) {
				const { list, total } = res.data;
				this.dataSource = list;
				this.dataTotal = total;
			} else {
				this.dataSource = [];
				this.dataTotal = 0;
				this.$message.error('获取列表数据失败');
			}
			this.loading = false;
		},
		// 通过输入的服务中心编号查询是否已经添加
		async verifyAmountExist(storeCode) {
			const params = {
				...this.searchFields,
				storeCode,
			};
			const res = await this.$fetch(
				`/mgmt/inventory/mortgageAmount/listMortgageAmountMaxStoreReturn?${qs.stringify(params)}`
			);
			if (res && res.data) {
				const { list } = res.data;
				if (list.length > 0) {
					const { returnMaxAmount, id } = list[0];
					this.ruleForm = { ...this.ruleForm, returnMaxAmount, id };
				}
			} else {
				this.$message.warning('获取该服务中心最大可押货退货额度失败');
			}
		},
		// 删除服务中心最大押货退货额
		async deleteReturnMortgageAmountMortgageOrder(id) {
			if (!id) {
				return this.$message.warning('该信息id不存在，无法删除');
			}
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/inventory/mortgageAmount/deleteMortgageAmountMaxStoreReturn?id=${id}`,
			});
			if (res && res.code === 200) {
				this.loadData();
				this.$message.success('删除成功');
			} else {
				this.$message.error('删除失败');
			}
		},
		// 添加或修改服务中心最大押货退货额
		async addOrUpdateReturnMortgageAmountMortgageOrder(params) {
			console.log(params, 'params');
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/inventory/mortgageAmount/addOrUpdateMortgageAmountMaxStoreReturn',
				data: params,
			});
			if (res && res.code === 200) {
				this.loadData();
				this.$message.success(res.message || '添加成功');
			} else {
				this.$message.warning('添加失败');
			}
		},
	},
};
</script>
