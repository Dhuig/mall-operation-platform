<template>
	<div class="userManagement">
		<guideBar>
			<el-button type="primary" @click="handleImport">批量导入</el-button>
			<el-button v-permission="'package_Retain_add'" type="primary" @click="creatSuit">新建套装保留</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="SERVICE_RETAIN_CONFIG" @search="search" />
		</el-card>
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="dataSource"
				:columns="SERVICE_RETAIN_COLUMNS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="options"
				@loadMore="loadMore"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button v-permission="'package_Retain_edit'" type="text" @click="handleBtnsGruop(scope.data, 'edit')">
						编辑
					</el-button>
					<el-button v-permission="'package_Retain_delete'" type="text" @click="handleBtnsGruop(scope.data, 'delete')">
						删除
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 更新套装保留 -->
		<el-dialog title="更新套装保留" :visible.sync="creatSuitShow" width="740px" v-drag>
			<el-form
				label-suffix=":"
				class="add-formData"
				label-width="110px"
				:rules="CREATE_NEW_SUIT_RULES"
				:model="formData"
				ref="formData"
			>
				<el-row>
					<el-col :span="24">
						<el-form-item label="服务中心编号" prop="storeCode">
							<el-input
								class="mr20"
								size="medium"
								v-model="formData.storeCode"
								:disabled="disabled"
								placeholder="请输入服务中心编号"
							></el-input>
							<el-button :disabled="disabled" @click="getStoreByCode(formData.storeCode)" type="primary">
								搜索
							</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="服务中心名称">
							<div>{{ formData.storeName }}</div>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="负责人卡号">
							<div>{{ formData.cardNo }}</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="产品名称">
							<div>{{ formData.produceName }}</div>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="负责人名称">
							<div>{{ formData.companyName }}</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="套装编码" prop="serialNo">
							<el-input
								@blur="getProductInfo(formData.serialNo)"
								size="medium"
								v-model="formData.serialNo"
								placeholder="请输入套装编码"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="保留数量" prop="amount">
							<el-input size="medium" v-model="formData.amount" placeholder="请输入保留数量"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="18">
						<el-form-item label="保留时间" prop="reserveTime">
							<el-date-picker
								@change="getDate(formData.reserveTime)"
								v-model="formData.reserveTime"
								type="datetimerange"
								range-separator="至"
								value-format="timestamp"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
							></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="save('formData')" class="dialog-btn mr-16">提交</el-button>
				<el-button @click="cacel('formData')" class="dialog-btn">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { SERVICE_RETAIN_CONFIG, SERVICE_RETAIN_COLUMNS, CREATE_NEW_SUIT_RULES } from './config.js';
import qs from 'querystring';

export default {
	name: 'packageRetain',
	data() {
		return {
			SERVICE_RETAIN_CONFIG,
			SERVICE_RETAIN_COLUMNS,
			CREATE_NEW_SUIT_RULES,
			creatSuitShow: false,
			formData: {
				storeCode: '',
				serialNo: '',
				amount: 0,
				reserveBeginTime: 0,
				reserveEndTime: 0,
				reserveTime: [],
				storeName: '',
				cardNo: '',
				produceName: '',
				companyName: '',
			},
			disabled: false,
			rules: {},
			pagination: {
				pageNum: 1,
				pageSize: 10,
			},
			searchConfig: {},
			dataTotal: 0,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			dataSource: [],
			loading: false,
		};
	},
	mounted() {
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
		handleBtnsGruop(row, type) {
			if (type === 'edit') {
				this.disabled = true;
				this.getReserveBundleInfo(row.reserveId);
				this.creatSuitShow = true;
			} else {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						this.searchConfig = {};
						this.delete(row.reserveId);
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除',
						});
					});
			}
		},
		// 批量套装保留
		handleImport() {
			this.$go('/package_Retain_Import');
		},
		// 新建套装保留
		creatSuit() {
			this.formData = {
				storeCode: '',
				serialNo: '',
				amount: 0,
				reserveBeginTime: 0,
				reserveEndTime: 0,
				reserveTime: [],
				storeName: '',
				cardNo: '',
				produceName: '',
				companyName: '',
			};
			this.disabled = false;
			this.creatSuitShow = true;
		},
		// 查询套装信息
		async getReserveBundleInfo(reserveId) {
			const params = {
				reserveId,
			};
			const res = await this.$fetch(`/mgmt/product/bundle/getReserveBundleInfo?${qs.stringify(params)}`);
			if (res) {
				let data = res.data;
				this.formData = {
					...this.formData,
					...data,
				};
				this.formData.storeName = data.name;
				this.formData.cardNo = data.leaderCardNo;
				this.formData.companyName = data.leaderName;
				this.formData.produceName = data.title;
				this.formData.reserveTime = [data.reserveBeginTime, data.reserveEndTime];
			}
		},
		// 搜索
		search() {
			this.pagination.pageNum = 1;
			this.dataSource = [];
			this.loadData();
		},
		// 下拉滚动
		loadMore() {
			const { pageNum, pageSize } = this.pagination;
			const { dataTotal } = this;
			if (pageNum * pageSize >= dataTotal) {
				return this.$message.warning('没有更多数据');
			}
			this.pagination.pageNum++;
			this.loadData();
		},
		// 请求用户列表
		async loadData() {
			const { searchFields } = this;
			this.loading = true;
			const params = {
				...searchFields,
				pageNum: this.pagination.pageNum,
				pageSize: this.pagination.pageSize,
			};
			const res = await this.$fetch(`/mgmt/product/bundle/getReserveBundleList?${qs.stringify(params)}`);
			if (res) {
				this.dataSource = this.dataSource.concat(res.data.list);
				this.dataTotal = res.data.total;
			} else {
				this.dataSource = [];
				this.pagination.total = 0;
			}
			this.loading = false;
		},
		// 根据产品编码查询产品
		async getProductInfo(val) {
			const serialNo = val;
			const params = {
				serialNo,
			};
			const res = await this.$fetch(`/mgmt/product/item/getProductInfo?${qs.stringify(params)}`);
			if (res) {
				this.formData.produceName = res.data.title;
			} else {
				this.formData.produceName = '';
			}
		},

		// 取消
		cacel(formName) {
			this.$refs[formName].resetFields();
			this.creatSuitShow = false;
		},
		// 保存-新增/编辑
		save(formName) {
			this.formData.reserveBeginTime = this.formData.reserveTime[0];
			this.formData.reserveEndTime = this.formData.reserveTime[1];
			this.$refs[formName].validate(async (valid) => {
				if (valid) {
					await this.saveReserveBundle(this.formData);
					this.$refs[formName].resetFields();
					this.creatSuitShow = false;
					this.loadData();
				}
			});
		},
		// 新增/编辑套装保留
		async saveReserveBundle(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/product/bundle/saveReserveBundle',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			} else {
				this.$message.error(res.message);
			}
		},
		// 删除保留套装
		async delete(val) {
			let params = {
				reserveId: val,
			};
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/product/bundle/delete',
				params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.loadData();
			} else {
				this.$message.error(res.message);
			}
		},
		// 根据服务中心编号获取服务中心
		async getStoreByCode(val) {
			let code = val;
			const params = {
				code,
			};
			const res = await this.$fetch(`/mgmt/store/getStoreByCode?${qs.stringify(params)}`);
			if (res) {
				this.formData.storeName = res.data.store.name;
				this.formData.cardNo = res.data.user.cardNo;
				this.formData.companyName = res.data.user.realname;
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.box-card {
	margin: 24px 0;
}

::v-deep.add-formData {
	padding: 0 30px;
	box-sizing: border-box;
	.el-input,
	.el-select,
	.el-date-editor {
		width: 196px;
	}
	.el-date-editor {
		width: 100%;
	}
	.el-textarea__inner {
		height: 90px;
	}
	.mr20 {
		margin-right: 20px;
	}
}
</style>
