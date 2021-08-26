<template>
	<div>
		<guideBar>
			<el-button type="primary" v-permission="'service_distribution_detail_add'" @click="handleAddDistribution">
				添加新产品分配
			</el-button>
		</guideBar>
		<el-card>
			<el-row style="margin-bottom: 16px;">
				<el-col :span="12">
					<span class="newUI label-name">服务中心编号：</span>
					<span class="newUI label-content">{{ baseData.code }}</span>
				</el-col>
				<el-col :span="12">
					<span class="newUI label-name">服务中心名称：</span>
					<span class="newUI label-content">{{ baseData.name }}</span>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<span class="newUI label-name">负责人：</span>
					<span class="newUI label-content">{{ baseData.leaderName }}</span>
				</el-col>
				<el-col :span="12">
					<span class="newUI label-name">负责人卡号：</span>
					<span class="newUI label-content">{{ baseData.shopkeeperId }}</span>
				</el-col>
			</el-row>
		</el-card>
		<el-card>
			<tableList
				border
				:dataSource="dataSource"
				:columns="SERVICE_CENTER_DISTRIBUTION_DETAIL_COLUMS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="row">
					<el-button
						type="text"
						v-permission="'service_distribution_detail_delete'"
						@click="handleBtnsGruop(row.data, 'delete')"
					>
						删除
					</el-button>
					<el-button
						type="text"
						v-permission="'service_distribution_detail_edit'"
						@click="handleBtnsGruop(row.data, 'edit')"
					>
						修改
					</el-button>
				</template>
			</tableList>
		</el-card>

		<!-- 新增弹窗 -->
		<!-- 添加账户弹窗 -->
		<el-dialog title="更新产品分配量" label-suffix=":" :visible.sync="showAddDistributionBox" width="30%">
			<el-form :rules="rules" ref="ruleForm" :model="ruleForm" class="add-user">
				<el-form-item label="产品代码" prop="productCode">
					<el-input v-model="ruleForm.productCode" size="medium" :disabled="isEdit">
						<el-button slot="append" icon="el-icon-search" @click="getProductInfo(ruleForm.productCode)"></el-button>
					</el-input>
				</el-form-item>
				<el-form-item label="产品名称" prop="productName">
					<span>{{ ruleForm.productName }}</span>
				</el-form-item>
				<el-form-item label="规格" prop="packing">
					<span>{{ ruleForm.packing }}</span>
				</el-form-item>
				<el-form-item label="单位" prop="meterUnit">
					<span>{{ ruleForm.meterUnit }}</span>
				</el-form-item>
				<el-form-item label="控制类型" prop="">
					<span>累计</span>
				</el-form-item>
				<el-form-item label="最大可押货数量" prop="maxNum">
					<el-input-number size="small" v-model="ruleForm.maxNum"></el-input-number>
				</el-form-item>
				<el-form-item label="生效时间" prop="effectTime">
					<el-date-picker
						v-model="ruleForm.effectTime"
						type="datetime"
						placeholder="选择日期"
						:disabled="!canEditTime"
					></el-date-picker>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm('ruleForm')" style="width: 100px; margin-right: 16px;">
					{{ isEdit ? '更新' : '添加' }}
				</el-button>
				<el-button @click="cancelEdit('ruleForm')" style="width: 100px;">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { SERVICE_CENTER_DISTRIBUTION_DETAIL_COLUMS, DataKey, limitMaxnum } from './config.js';
import qs from 'querystring';
export default {
	name: 'distributionDetail',
	data() {
		return {
			SERVICE_CENTER_DISTRIBUTION_DETAIL_COLUMS,
			rules: {
				productCode: [{ required: true, message: '请输入产品代码', trigger: 'blur' }],
				maxNum: [{ required: true, validator: limitMaxnum, trigger: 'blur' }],
				effectTime: [{ type: 'date', required: true, message: '请输入生效时间', trigger: 'change' }],
			},
			ruleForm: Object.assign({ ...DataKey }),
			isEdit: false, //是否编辑
			//添加新产品分配
			dataSource: [],
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 0,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			loading: false,
			baseData: {},
			// 添加新产品分配
			showAddDistributionBox: false,
		};
	},
	mounted() {
		this.code = this.$route.query.code;
		// this.ruleForm.storeCode = this.code;
		this.loadData(this.code);
		this.getStoreByCode(this.code);
	},
	computed: {
		canEditTime() {
			let canEdit;
			const { isEdit, ruleForm } = this;
			if (!isEdit) {
				canEdit = true;
			} else {
				canEdit = !(ruleForm.effectTime <= new Date().getTime());
			}
			return canEdit;
		},
	},
	methods: {
		handleBtnsGruop(row, handleType) {
			switch (handleType) {
				case 'delete':
					//删除
					this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					})
						.then(() => {
							this.delDistribution(row.id, row.storeCode);
						})
						.catch(() => {
							this.$message({
								type: 'info',
								message: '已取消删除',
							});
						});
					break;
				case 'edit':
					//修改
					this.isEdit = true;
					this.showAddDistributionBox = true;
					this.ruleForm = { ...row };
					break;
				default:
					break;
			}
		},
		// 查询分配量详情
		async loadData(storeCode) {
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			const params = {
				pageNum,
				pageSize,
				storeCode,
			};
			const res = await this.$fetch(`/mgmt/inventory/distribution/listDistributionInfo?${qs.stringify(params)}`);
			if (res && res.data) {
				const { list, total } = res.data;
				this.dataSource = list;
				this.dataTotal = total;
				if (total == 0) {
					this.$message.warning('暂无数据');
				}
			} else {
				this.$message.error('获取详情列表失败');
			}
		},
		// 服务中心分配量删除
		async delDistribution(id, code) {
			let storeCode = code;
			if (!id) {
				this.$message.warning('产品id为空，删除失败');
				return;
			}
			const res = await this.$fetch(`/mgmt/inventory/distribution/delDistribution?${qs.stringify({ id })}`);
			if (res && res.code === 200) {
				this.$message.success('操作成功');
				this.loadData(storeCode);
			} else {
				this.$message.error(res.data.message || '操作失败');
			}
		},
		// 根据产品编码查询产品
		async getProductInfo(serialNo) {
			const params = {
				serialNo,
			};
			const res = await this.$fetch(`/mgmt/product/item/getProductInfo?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.ruleForm.productName = res.data.title;
				this.ruleForm.packing = res.data.packing;
				this.ruleForm.meterUnit = res.data.meterUnit;
				this.$forceUpdate();
			} else {
				this.$message.error(res.data.message || '获取数据失败');
			}
		},
		// 根据服务中心编号获取服务中心
		async getStoreByCode(code) {
			if (!code) return;
			const res = await this.$fetch(`/mgmt/inventory/common/getStoreInfo?${qs.stringify({ storeCode: code })}`);
			if (res && res.data) {
				this.baseData = res.data;
			} else {
				this.$message.error(res.data.message || '获取服务中心信息失败');
			}
		},
		// 添加or更新分配量
		async addOrUpdateDistribution(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/inventory/distribution/addOrUpdateDistribution',
				data: params,
			});
			if (res && res.code === 200) {
				this.loadData(this.code);
				this.$message.success(res.message);
			} else {
				this.$message.error(res.data.message || '操作失败');
			}
		},
		// 添加or更新分配
		submitForm(formName) {
			// const { isEdit } = this;
			this.$refs[formName].validate(async valid => {
				if (valid) {
					this.showAddDistributionBox = false;
					this.ruleForm.storeCode = this.code;
					this.ruleForm.maxNum = parseInt(this.ruleForm.maxNum);
					let params = this.ruleForm;
					this.addOrUpdateDistribution(params);
				}
			});
		},
		cancelEdit(formName) {
			this.showAddDistributionBox = false;
			this.$refs[formName].resetFields();
		},
		// 分页触发事件
		handleChangePage(val) {
			this.pagination.currentPage = val;
			this.loadData(this.code);
		},
		// 分页下拉触发事件
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData(this.code);
		},
		// 添加新产品分配
		handleAddDistribution() {
			this.ruleForm = {
				account: '',
				accountBank: '',
				accountName: '',
				accountType: null,
				address: '',
				branch: '',
				isDeduction: 2,
				permissionUrl: '',
				storeCode: '',
				submitter: '',
				effectTime: new Date(),
			};
			this.isEdit = false;
			this.showAddDistributionBox = true;
		},
	},
};
</script>
